(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Kh="181",Fp=0,qd=1,Up=2,L0=1,D0=2,ts=3,Rs=0,zn=1,At=2,Oi=0,Oa=1,li=2,Yd=3,$d=4,zp=5,Xs=100,Np=101,kp=102,Op=103,Bp=104,Vp=200,Gp=201,Hp=202,Wp=203,Vc=204,Gc=205,Xp=206,qp=207,Yp=208,$p=209,Zp=210,Kp=211,Jp=212,jp=213,Qp=214,Hc=0,Wc=1,Xc=2,Xa=3,qc=4,Yc=5,$c=6,Zc=7,Jh=0,em=1,tm=2,Es=0,I0=1,F0=2,U0=3,jh=4,z0=5,N0=6,k0=7,O0=300,qa=301,Ya=302,Kc=303,Jc=304,Dl=306,On=1e3,ss=1001,jc=1002,ei=1003,nm=1004,fo=1005,ci=1006,Yl=1007,Zs=1008,qi=1009,B0=1010,V0=1011,kr=1012,Qh=1013,sa=1014,zi=1015,Bi=1016,ed=1017,td=1018,Or=1020,G0=35902,H0=35899,W0=1021,X0=1022,bi=1023,Br=1026,Vr=1027,nd=1028,id=1029,sd=1030,ad=1031,rd=1033,nl=33776,il=33777,sl=33778,al=33779,Qc=35840,eh=35841,th=35842,nh=35843,ih=36196,sh=37492,ah=37496,rh=37808,oh=37809,lh=37810,ch=37811,hh=37812,dh=37813,uh=37814,fh=37815,ph=37816,mh=37817,xh=37818,gh=37819,vh=37820,Mh=37821,_h=36492,yh=36494,bh=36495,wh=36283,Sh=36284,Th=36285,Eh=36286,im=3200,sm=3201,od=0,am=1,bs="",Lt="srgb",$a="srgb-linear",dl="linear",jt="srgb",ua=7680,Zd=519,rm=512,om=513,lm=514,q0=515,cm=516,hm=517,dm=518,um=519,Ah=35044,Kd="300 es",Ni=2e3,ul=2001;function Y0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function fl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function fm(){const n=fl("canvas");return n.style.display="block",n}const Jd={};function pl(...n){const e="THREE."+n.shift();console.log(e,...n)}function wt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function hn(...n){const e="THREE."+n.shift();console.error(e,...n)}function Gr(...n){const e=n.join(" ");e in Jd||(Jd[e]=!0,wt(...n))}function pm(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class Qa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jd=1234567;const Er=Math.PI/180,Hr=180/Math.PI;function Vi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ln[n&255]+Ln[n>>8&255]+Ln[n>>16&255]+Ln[n>>24&255]+"-"+Ln[e&255]+Ln[e>>8&255]+"-"+Ln[e>>16&15|64]+Ln[e>>24&255]+"-"+Ln[t&63|128]+Ln[t>>8&255]+"-"+Ln[t>>16&255]+Ln[t>>24&255]+Ln[i&255]+Ln[i>>8&255]+Ln[i>>16&255]+Ln[i>>24&255]).toLowerCase()}function zt(n,e,t){return Math.max(e,Math.min(t,n))}function ld(n,e){return(n%e+e)%e}function mm(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function xm(n,e,t){return n!==e?(t-n)/(e-n):0}function Ar(n,e,t){return(1-t)*n+t*e}function gm(n,e,t,i){return Ar(n,e,1-Math.exp(-t*i))}function vm(n,e=1){return e-Math.abs(ld(n,e*2)-e)}function Mm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function _m(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function ym(n,e){return n+Math.floor(Math.random()*(e-n+1))}function bm(n,e){return n+Math.random()*(e-n)}function wm(n){return n*(.5-Math.random())}function Sm(n){n!==void 0&&(jd=n);let e=jd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tm(n){return n*Er}function Em(n){return n*Hr}function Am(n){return(n&n-1)===0&&n!==0}function Cm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Rm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Pm(n,e,t,i,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),u=a((e-i)/2),m=r((e-i)/2),p=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(o*d,c*u,c*m,o*h);break;case"YZY":n.set(c*m,o*d,c*u,o*h);break;case"ZXZ":n.set(c*u,c*m,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*p,o*h);break;case"YXY":n.set(c*p,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*p,o*d,o*h);break;default:wt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Mi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ue={DEG2RAD:Er,RAD2DEG:Hr,generateUUID:Vi,clamp:zt,euclideanModulo:ld,mapLinear:mm,inverseLerp:xm,lerp:Ar,damp:gm,pingpong:vm,smoothstep:Mm,smootherstep:_m,randInt:ym,randFloat:bm,randFloatSpread:wm,seededRandom:Sm,degToRad:Tm,radToDeg:Em,isPowerOfTwo:Am,ceilPowerOfTwo:Cm,floorPowerOfTwo:Rm,setQuaternionFromProperEuler:Pm,normalize:Qt,denormalize:Mi};class Ne{constructor(e=0,t=0){Ne.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=zt(this.x,e.x,t.x),this.y=zt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=zt(this.x,e,t),this.y=zt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(zt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class os{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let c=i[s+0],h=i[s+1],d=i[s+2],u=i[s+3],m=a[r+0],p=a[r+1],x=a[r+2],_=a[r+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=m,e[t+1]=p,e[t+2]=x,e[t+3]=_;return}if(u!==_||c!==m||h!==p||d!==x){let g=c*m+h*p+d*x+u*_;g<0&&(m=-m,p=-p,x=-x,_=-_,g=-g);let f=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);f=Math.sin(f*y)/v,o=Math.sin(o*y)/v,c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+_*o}else{c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+_*o;const y=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=y,h*=y,d*=y,u*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],u=a[r],m=a[r+1],p=a[r+2],x=a[r+3];return e[t]=o*x+d*u+c*p-h*m,e[t+1]=c*x+d*m+h*u-o*p,e[t+2]=h*x+d*p+o*m-c*u,e[t+3]=d*x-o*u-c*m-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),u=o(a/2),m=c(i/2),p=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"YXZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"ZXY":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"ZYX":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"YZX":this._x=m*d*u+h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u-m*p*x;break;case"XZY":this._x=m*d*u-h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u+m*p*x;break;default:wt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],h=t[2],d=t[6],u=t[10],m=i+o+u;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(d-c)*p,this._y=(a-h)*p,this._z=(r-s)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+r)/p,this._z=(a+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(a-h)/p,this._x=(s+r)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(r-s)/p,this._x=(a+h)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(zt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*o+s*h-a*c,this._y=s*d+r*c+a*o-i*h,this._z=a*d+r*h+i*c-s*o,this._w=r*d-i*o-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,h=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+c*h+r*u-o*d,this.y=i+c*d+o*h-a*u,this.z=s+c*u+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=zt(this.x,e.x,t.x),this.y=zt(this.y,e.y,t.y),this.z=zt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=zt(this.x,e,t),this.y=zt(this.y,e,t),this.z=zt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(zt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $l.copy(this).projectOnVector(e),this.sub($l)}reflect(e){return this.sub($l.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $l=new L,Qd=new os;class It{constructor(e,t,i,s,a,r,o,c,h){It.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h)}set(e,t,i,s,a,r,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],c=i[6],h=i[1],d=i[4],u=i[7],m=i[2],p=i[5],x=i[8],_=s[0],g=s[3],f=s[6],y=s[1],v=s[4],M=s[7],E=s[2],S=s[5],C=s[8];return a[0]=r*_+o*y+c*E,a[3]=r*g+o*v+c*S,a[6]=r*f+o*M+c*C,a[1]=h*_+d*y+u*E,a[4]=h*g+d*v+u*S,a[7]=h*f+d*M+u*C,a[2]=m*_+p*y+x*E,a[5]=m*g+p*v+x*S,a[8]=m*f+p*M+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*o*h-i*a*d+i*o*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=d*r-o*h,m=o*c-d*a,p=h*a-r*c,x=t*u+i*m+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=u*_,e[1]=(s*h-d*i)*_,e[2]=(o*i-s*r)*_,e[3]=m*_,e[4]=(d*t-s*c)*_,e[5]=(s*a-o*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(r*t-i*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*o)+r+e,-s*h,s*c,-s*(-h*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Zl.makeScale(e,t)),this}rotate(e){return this.premultiply(Zl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Zl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Zl=new It,eu=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tu=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lm(){const n={enabled:!0,workingColorSpace:$a,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===jt&&(s.r=as(s.r),s.g=as(s.g),s.b=as(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===jt&&(s.r=Ba(s.r),s.g=Ba(s.g),s.b=Ba(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===bs?dl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Gr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Gr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[$a]:{primaries:e,whitePoint:i,transfer:dl,toXYZ:eu,fromXYZ:tu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:jt,toXYZ:eu,fromXYZ:tu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}const Gt=Lm();function as(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ba(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let fa;class Dm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{fa===void 0&&(fa=fl("canvas")),fa.width=e.width,fa.height=e.height;const s=fa.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=fa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=as(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(as(t[i]/255)*255):t[i]=as(t[i]);return{data:t,width:e.width,height:e.height}}else return wt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Im=0;class cd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Im++}),this.uuid=Vi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Kl(s[r].image)):a.push(Kl(s[r]))}else a=Kl(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Kl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(wt("Texture: Unable to serialize Texture."),{})}let Fm=0;const Jl=new L;class Nn extends Qa{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,i=ss,s=ss,a=ci,r=Zs,o=bi,c=qi,h=Nn.DEFAULT_ANISOTROPY,d=bs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fm++}),this.uuid=Vi(),this.name="",this.source=new cd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Jl).x}get height(){return this.source.getSize(Jl).y}get depth(){return this.source.getSize(Jl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){wt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){wt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==O0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case On:e.x=e.x-Math.floor(e.x);break;case ss:e.x=e.x<0?0:1;break;case jc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case On:e.y=e.y-Math.floor(e.y);break;case ss:e.y=e.y<0?0:1;break;case jc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=O0;Nn.DEFAULT_ANISOTROPY=1;class tn{constructor(e=0,t=0,i=0,s=1){tn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],u=c[8],m=c[1],p=c[5],x=c[9],_=c[2],g=c[6],f=c[10];if(Math.abs(d-m)<.01&&Math.abs(u-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+m)<.1&&Math.abs(u+_)<.1&&Math.abs(x+g)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,M=(p+1)/2,E=(f+1)/2,S=(d+m)/4,C=(u+_)/4,A=(x+g)/4;return v>M&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=S/i,a=C/i):M>E?M<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),i=S/s,a=A/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=C/a,s=A/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(u-_)*(u-_)+(m-d)*(m-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(u-_)/y,this.z=(m-d)/y,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=zt(this.x,e.x,t.x),this.y=zt(this.y,e.y,t.y),this.z=zt(this.z,e.z,t.z),this.w=zt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=zt(this.x,e,t),this.y=zt(this.y,e,t),this.z=zt(this.z,e,t),this.w=zt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(zt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Um extends Qa{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ci,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new tn(0,0,e,t),this.scissorTest=!1,this.viewport=new tn(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Nn(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ci,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new cd(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Si extends Um{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class $0 extends Nn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ei,this.minFilter=ei,this.wrapR=ss,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class zm extends Nn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ei,this.minFilter=ei,this.wrapR=ss,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class la{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(fi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(fi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=fi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,fi):fi.fromBufferAttribute(a,r),fi.applyMatrix4(e.matrixWorld),this.expandByPoint(fi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),po.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),po.copy(i.boundingBox)),po.applyMatrix4(e.matrixWorld),this.union(po)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fi),fi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cr),mo.subVectors(this.max,cr),pa.subVectors(e.a,cr),ma.subVectors(e.b,cr),xa.subVectors(e.c,cr),cs.subVectors(ma,pa),hs.subVectors(xa,ma),Us.subVectors(pa,xa);let t=[0,-cs.z,cs.y,0,-hs.z,hs.y,0,-Us.z,Us.y,cs.z,0,-cs.x,hs.z,0,-hs.x,Us.z,0,-Us.x,-cs.y,cs.x,0,-hs.y,hs.x,0,-Us.y,Us.x,0];return!jl(t,pa,ma,xa,mo)||(t=[1,0,0,0,1,0,0,0,1],!jl(t,pa,ma,xa,mo))?!1:(xo.crossVectors(cs,hs),t=[xo.x,xo.y,xo.z],jl(t,pa,ma,xa,mo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Zi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Zi=[new L,new L,new L,new L,new L,new L,new L,new L],fi=new L,po=new la,pa=new L,ma=new L,xa=new L,cs=new L,hs=new L,Us=new L,cr=new L,mo=new L,xo=new L,zs=new L;function jl(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){zs.fromArray(n,a);const o=s.x*Math.abs(zs.x)+s.y*Math.abs(zs.y)+s.z*Math.abs(zs.z),c=e.dot(zs),h=t.dot(zs),d=i.dot(zs);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const Nm=new la,hr=new L,Ql=new L;class er{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Nm.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hr.subVectors(e,this.center);const t=hr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(hr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ql.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hr.copy(e.center).add(Ql)),this.expandByPoint(hr.copy(e.center).sub(Ql))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ki=new L,ec=new L,go=new L,ds=new L,tc=new L,vo=new L,nc=new L;class hd{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ki)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ki.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ki.copy(this.origin).addScaledVector(this.direction,t),Ki.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ec.copy(e).add(t).multiplyScalar(.5),go.copy(t).sub(e).normalize(),ds.copy(this.origin).sub(ec);const a=e.distanceTo(t)*.5,r=-this.direction.dot(go),o=ds.dot(this.direction),c=-ds.dot(go),h=ds.lengthSq(),d=Math.abs(1-r*r);let u,m,p,x;if(d>0)if(u=r*c-o,m=r*o-c,x=a*d,u>=0)if(m>=-x)if(m<=x){const _=1/d;u*=_,m*=_,p=u*(u+r*m+2*o)+m*(r*u+m+2*c)+h}else m=a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m=-a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m<=-x?(u=Math.max(0,-(-r*a+o)),m=u>0?-a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h):m<=x?(u=0,m=Math.min(Math.max(-a,-c),a),p=m*(m+2*c)+h):(u=Math.max(0,-(r*a+o)),m=u>0?a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h);else m=r>0?-a:a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ec).addScaledVector(go,m),p}intersectSphere(e,t){Ki.subVectors(e.center,this.origin);const i=Ki.dot(this.direction),s=Ki.dot(Ki)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,m=this.origin;return h>=0?(i=(e.min.x-m.x)*h,s=(e.max.x-m.x)*h):(i=(e.max.x-m.x)*h,s=(e.min.x-m.x)*h),d>=0?(a=(e.min.y-m.y)*d,r=(e.max.y-m.y)*d):(a=(e.max.y-m.y)*d,r=(e.min.y-m.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-m.z)*u,c=(e.max.z-m.z)*u):(o=(e.max.z-m.z)*u,c=(e.min.z-m.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ki)!==null}intersectTriangle(e,t,i,s,a){tc.subVectors(t,e),vo.subVectors(i,e),nc.crossVectors(tc,vo);let r=this.direction.dot(nc),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ds.subVectors(this.origin,e);const c=o*this.direction.dot(vo.crossVectors(ds,vo));if(c<0)return null;const h=o*this.direction.dot(tc.cross(ds));if(h<0||c+h>r)return null;const d=-o*ds.dot(nc);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tt{constructor(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g)}set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=h,f[6]=d,f[10]=u,f[14]=m,f[3]=p,f[7]=x,f[11]=_,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/ga.setFromMatrixColumn(e,0).length(),a=1/ga.setFromMatrixColumn(e,1).length(),r=1/ga.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const m=r*d,p=r*u,x=o*d,_=o*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=p+x*h,t[5]=m-_*h,t[9]=-o*c,t[2]=_-m*h,t[6]=x+p*h,t[10]=r*c}else if(e.order==="YXZ"){const m=c*d,p=c*u,x=h*d,_=h*u;t[0]=m+_*o,t[4]=x*o-p,t[8]=r*h,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=p*o-x,t[6]=_+m*o,t[10]=r*c}else if(e.order==="ZXY"){const m=c*d,p=c*u,x=h*d,_=h*u;t[0]=m-_*o,t[4]=-r*u,t[8]=x+p*o,t[1]=p+x*o,t[5]=r*d,t[9]=_-m*o,t[2]=-r*h,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const m=r*d,p=r*u,x=o*d,_=o*u;t[0]=c*d,t[4]=x*h-p,t[8]=m*h+_,t[1]=c*u,t[5]=_*h+m,t[9]=p*h-x,t[2]=-h,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const m=r*c,p=r*h,x=o*c,_=o*h;t[0]=c*d,t[4]=_-m*u,t[8]=x*u+p,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-h*d,t[6]=p*u+x,t[10]=m-_*u}else if(e.order==="XZY"){const m=r*c,p=r*h,x=o*c,_=o*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=m*u+_,t[5]=r*d,t[9]=p*u-x,t[2]=x*u-p,t[6]=o*d,t[10]=_*u+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(km,e,Om)}lookAt(e,t,i){const s=this.elements;return Kn.subVectors(e,t),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),us.crossVectors(i,Kn),us.lengthSq()===0&&(Math.abs(i.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),us.crossVectors(i,Kn)),us.normalize(),Mo.crossVectors(Kn,us),s[0]=us.x,s[4]=Mo.x,s[8]=Kn.x,s[1]=us.y,s[5]=Mo.y,s[9]=Kn.y,s[2]=us.z,s[6]=Mo.z,s[10]=Kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],c=i[8],h=i[12],d=i[1],u=i[5],m=i[9],p=i[13],x=i[2],_=i[6],g=i[10],f=i[14],y=i[3],v=i[7],M=i[11],E=i[15],S=s[0],C=s[4],A=s[8],w=s[12],b=s[1],P=s[5],D=s[9],O=s[13],Z=s[2],ee=s[6],Y=s[10],J=s[14],te=s[3],pe=s[7],Me=s[11],Ze=s[15];return a[0]=r*S+o*b+c*Z+h*te,a[4]=r*C+o*P+c*ee+h*pe,a[8]=r*A+o*D+c*Y+h*Me,a[12]=r*w+o*O+c*J+h*Ze,a[1]=d*S+u*b+m*Z+p*te,a[5]=d*C+u*P+m*ee+p*pe,a[9]=d*A+u*D+m*Y+p*Me,a[13]=d*w+u*O+m*J+p*Ze,a[2]=x*S+_*b+g*Z+f*te,a[6]=x*C+_*P+g*ee+f*pe,a[10]=x*A+_*D+g*Y+f*Me,a[14]=x*w+_*O+g*J+f*Ze,a[3]=y*S+v*b+M*Z+E*te,a[7]=y*C+v*P+M*ee+E*pe,a[11]=y*A+v*D+M*Y+E*Me,a[15]=y*w+v*O+M*J+E*Ze,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],h=e[13],d=e[2],u=e[6],m=e[10],p=e[14],x=e[3],_=e[7],g=e[11],f=e[15];return x*(+a*c*u-s*h*u-a*o*m+i*h*m+s*o*p-i*c*p)+_*(+t*c*p-t*h*m+a*r*m-s*r*p+s*h*d-a*c*d)+g*(+t*h*u-t*o*p-a*r*u+i*r*p+a*o*d-i*h*d)+f*(-s*o*d-t*c*u+t*o*m+s*r*u-i*r*m+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=e[9],m=e[10],p=e[11],x=e[12],_=e[13],g=e[14],f=e[15],y=u*g*h-_*m*h+_*c*p-o*g*p-u*c*f+o*m*f,v=x*m*h-d*g*h-x*c*p+r*g*p+d*c*f-r*m*f,M=d*_*h-x*u*h+x*o*p-r*_*p-d*o*f+r*u*f,E=x*u*c-d*_*c-x*o*m+r*_*m+d*o*g-r*u*g,S=t*y+i*v+s*M+a*E;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/S;return e[0]=y*C,e[1]=(_*m*a-u*g*a-_*s*p+i*g*p+u*s*f-i*m*f)*C,e[2]=(o*g*a-_*c*a+_*s*h-i*g*h-o*s*f+i*c*f)*C,e[3]=(u*c*a-o*m*a-u*s*h+i*m*h+o*s*p-i*c*p)*C,e[4]=v*C,e[5]=(d*g*a-x*m*a+x*s*p-t*g*p-d*s*f+t*m*f)*C,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*f-t*c*f)*C,e[7]=(r*m*a-d*c*a+d*s*h-t*m*h-r*s*p+t*c*p)*C,e[8]=M*C,e[9]=(x*u*a-d*_*a-x*i*p+t*_*p+d*i*f-t*u*f)*C,e[10]=(r*_*a-x*o*a+x*i*h-t*_*h-r*i*f+t*o*f)*C,e[11]=(d*o*a-r*u*a-d*i*h+t*u*h+r*i*p-t*o*p)*C,e[12]=E*C,e[13]=(d*_*s-x*u*s+x*i*m-t*_*m-d*i*g+t*u*g)*C,e[14]=(x*o*s-r*_*s-x*i*c+t*_*c+r*i*g-t*o*g)*C,e[15]=(r*u*s-d*o*s+d*i*c-t*u*c-r*i*m+t*o*m)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,c=e.z,h=a*r,d=a*o;return this.set(h*r+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*r,0,h*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,h=a+a,d=r+r,u=o+o,m=a*h,p=a*d,x=a*u,_=r*d,g=r*u,f=o*u,y=c*h,v=c*d,M=c*u,E=i.x,S=i.y,C=i.z;return s[0]=(1-(_+f))*E,s[1]=(p+M)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(p-M)*S,s[5]=(1-(m+f))*S,s[6]=(g+y)*S,s[7]=0,s[8]=(x+v)*C,s[9]=(g-y)*C,s[10]=(1-(m+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=ga.set(s[0],s[1],s[2]).length();const r=ga.set(s[4],s[5],s[6]).length(),o=ga.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],pi.copy(this);const h=1/a,d=1/r,u=1/o;return pi.elements[0]*=h,pi.elements[1]*=h,pi.elements[2]*=h,pi.elements[4]*=d,pi.elements[5]*=d,pi.elements[6]*=d,pi.elements[8]*=u,pi.elements[9]*=u,pi.elements[10]*=u,t.setFromRotationMatrix(pi),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=Ni,c=!1){const h=this.elements,d=2*a/(t-e),u=2*a/(i-s),m=(t+e)/(t-e),p=(i+s)/(i-s);let x,_;if(c)x=a/(r-a),_=r*a/(r-a);else if(o===Ni)x=-(r+a)/(r-a),_=-2*r*a/(r-a);else if(o===ul)x=-r/(r-a),_=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=_,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Ni,c=!1){const h=this.elements,d=2/(t-e),u=2/(i-s),m=-(t+e)/(t-e),p=-(i+s)/(i-s);let x,_;if(c)x=1/(r-a),_=r/(r-a);else if(o===Ni)x=-2/(r-a),_=-(r+a)/(r-a);else if(o===ul)x=-1/(r-a),_=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=x,h[14]=_,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ga=new L,pi=new Tt,km=new L(0,0,0),Om=new L(1,1,1),us=new L,Mo=new L,Kn=new L,nu=new Tt,iu=new os;class Ti{constructor(e=0,t=0,i=0,s=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],h=s[5],d=s[9],u=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(zt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(zt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-zt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,p),this._y=0);break;default:wt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return nu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return iu.setFromEuler(this),this.setFromQuaternion(iu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class dd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Bm=0;const su=new L,va=new os,Ji=new Tt,_o=new L,dr=new L,Vm=new L,Gm=new os,au=new L(1,0,0),ru=new L(0,1,0),ou=new L(0,0,1),lu={type:"added"},Hm={type:"removed"},Ma={type:"childadded",child:null},ic={type:"childremoved",child:null};class kt extends Qa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bm++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kt.DEFAULT_UP.clone();const e=new L,t=new Ti,i=new os,s=new L(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new It}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=kt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return va.setFromAxisAngle(e,t),this.quaternion.multiply(va),this}rotateOnWorldAxis(e,t){return va.setFromAxisAngle(e,t),this.quaternion.premultiply(va),this}rotateX(e){return this.rotateOnAxis(au,e)}rotateY(e){return this.rotateOnAxis(ru,e)}rotateZ(e){return this.rotateOnAxis(ou,e)}translateOnAxis(e,t){return su.copy(e).applyQuaternion(this.quaternion),this.position.add(su.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(au,e)}translateY(e){return this.translateOnAxis(ru,e)}translateZ(e){return this.translateOnAxis(ou,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ji.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?_o.copy(e):_o.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),dr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ji.lookAt(dr,_o,this.up):Ji.lookAt(_o,dr,this.up),this.quaternion.setFromRotationMatrix(Ji),s&&(Ji.extractRotation(s.matrixWorld),va.setFromRotationMatrix(Ji),this.quaternion.premultiply(va.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(hn("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lu),Ma.child=e,this.dispatchEvent(Ma),Ma.child=null):hn("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hm),ic.child=e,this.dispatchEvent(ic),ic.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ji.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ji.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ji),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lu),Ma.child=e,this.dispatchEvent(Ma),Ma.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,e,Vm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,Gm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),u=r(e.shapes),m=r(e.skeletons),p=r(e.animations),x=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}kt.DEFAULT_UP=new L(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mi=new L,ji=new L,sc=new L,Qi=new L,_a=new L,ya=new L,cu=new L,ac=new L,rc=new L,oc=new L,lc=new tn,cc=new tn,hc=new tn;class oi{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),mi.subVectors(e,t),s.cross(mi);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){mi.subVectors(s,t),ji.subVectors(i,t),sc.subVectors(e,t);const r=mi.dot(mi),o=mi.dot(ji),c=mi.dot(sc),h=ji.dot(ji),d=ji.dot(sc),u=r*h-o*o;if(u===0)return a.set(0,0,0),null;const m=1/u,p=(h*c-o*d)*m,x=(r*d-o*c)*m;return a.set(1-p-x,x,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Qi)===null?!1:Qi.x>=0&&Qi.y>=0&&Qi.x+Qi.y<=1}static getInterpolation(e,t,i,s,a,r,o,c){return this.getBarycoord(e,t,i,s,Qi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Qi.x),c.addScaledVector(r,Qi.y),c.addScaledVector(o,Qi.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return lc.setScalar(0),cc.setScalar(0),hc.setScalar(0),lc.fromBufferAttribute(e,t),cc.fromBufferAttribute(e,i),hc.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(lc,a.x),r.addScaledVector(cc,a.y),r.addScaledVector(hc,a.z),r}static isFrontFacing(e,t,i,s){return mi.subVectors(i,t),ji.subVectors(e,t),mi.cross(ji).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mi.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),mi.cross(ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return oi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return oi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return oi.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return oi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return oi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;_a.subVectors(s,i),ya.subVectors(a,i),ac.subVectors(e,i);const c=_a.dot(ac),h=ya.dot(ac);if(c<=0&&h<=0)return t.copy(i);rc.subVectors(e,s);const d=_a.dot(rc),u=ya.dot(rc);if(d>=0&&u<=d)return t.copy(s);const m=c*u-d*h;if(m<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(_a,r);oc.subVectors(e,a);const p=_a.dot(oc),x=ya.dot(oc);if(x>=0&&p<=x)return t.copy(a);const _=p*h-c*x;if(_<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(ya,o);const g=d*x-p*u;if(g<=0&&u-d>=0&&p-x>=0)return cu.subVectors(a,s),o=(u-d)/(u-d+(p-x)),t.copy(s).addScaledVector(cu,o);const f=1/(g+_+m);return r=_*f,o=m*f,t.copy(i).addScaledVector(_a,r).addScaledVector(ya,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Z0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fs={h:0,s:0,l:0},yo={h:0,s:0,l:0};function dc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class at{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Gt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Gt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Gt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Gt.workingColorSpace){if(e=ld(e,1),t=zt(t,0,1),i=zt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=dc(r,a,e+1/3),this.g=dc(r,a,e),this.b=dc(r,a,e-1/3)}return Gt.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(a){a!==void 0&&parseFloat(a)<1&&wt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:wt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);wt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const i=Z0[e.toLowerCase()];return i!==void 0?this.setHex(i,t):wt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=as(e.r),this.g=as(e.g),this.b=as(e.b),this}copyLinearToSRGB(e){return this.r=Ba(e.r),this.g=Ba(e.g),this.b=Ba(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return Gt.workingToColorSpace(Dn.copy(this),e),Math.round(zt(Dn.r*255,0,255))*65536+Math.round(zt(Dn.g*255,0,255))*256+Math.round(zt(Dn.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Gt.workingColorSpace){Gt.workingToColorSpace(Dn.copy(this),t);const i=Dn.r,s=Dn.g,a=Dn.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,h;const d=(o+r)/2;if(o===r)c=0,h=0;else{const u=r-o;switch(h=d<=.5?u/(r+o):u/(2-r-o),r){case i:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-i)/u+2;break;case a:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=Gt.workingColorSpace){return Gt.workingToColorSpace(Dn.copy(this),t),e.r=Dn.r,e.g=Dn.g,e.b=Dn.b,e}getStyle(e=Lt){Gt.workingToColorSpace(Dn.copy(this),e);const t=Dn.r,i=Dn.g,s=Dn.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(fs),this.setHSL(fs.h+e,fs.s+t,fs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(fs),e.getHSL(yo);const i=Ar(fs.h,yo.h,t),s=Ar(fs.s,yo.s,t),a=Ar(fs.l,yo.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dn=new at;at.NAMES=Z0;let Wm=0;class Is extends Qa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=Oa,this.side=Rs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vc,this.blendDst=Gc,this.blendEquation=Xs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=Xa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ua,this.stencilZFail=ua,this.stencilZPass=ua,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){wt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){wt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Oa&&(i.blending=this.blending),this.side!==Rs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Vc&&(i.blendSrc=this.blendSrc),this.blendDst!==Gc&&(i.blendDst=this.blendDst),this.blendEquation!==Xs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xa&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ua&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ua&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ua&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ct extends Is{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Jh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gn=new L,bo=new Ne;let Xm=0;class ti{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ah,this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)bo.fromBufferAttribute(this,t),bo.applyMatrix3(e),this.setXY(t,bo.x,bo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix3(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix4(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyNormalMatrix(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.transformDirection(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array),a=Qt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ah&&(e.usage=this.usage),e}}class K0 extends ti{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class J0 extends ti{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Rt extends ti{constructor(e,t,i){super(new Float32Array(e),t,i)}}let qm=0;const si=new Tt,uc=new kt,ba=new L,Jn=new la,ur=new la,Tn=new L;class sn extends Qa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qm++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Y0(e)?J0:K0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new It().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,i){return si.makeTranslation(e,t,i),this.applyMatrix4(si),this}scale(e,t,i){return si.makeScale(e,t,i),this.applyMatrix4(si),this}lookAt(e){return uc.lookAt(e),uc.updateMatrix(),this.applyMatrix4(uc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ba).negate(),this.translate(ba.x,ba.y,ba.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Rt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&wt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new la);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){hn("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Jn.setFromBufferAttribute(a),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,Jn.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,Jn.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(Jn.min),this.boundingBox.expandByPoint(Jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&hn('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new er);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){hn("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Jn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];ur.setFromBufferAttribute(o),this.morphTargetsRelative?(Tn.addVectors(Jn.min,ur.min),Jn.expandByPoint(Tn),Tn.addVectors(Jn.max,ur.max),Jn.expandByPoint(Tn)):(Jn.expandByPoint(ur.min),Jn.expandByPoint(ur.max))}Jn.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Tn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Tn));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)Tn.fromBufferAttribute(o,h),c&&(ba.fromBufferAttribute(e,h),Tn.add(ba)),s=Math.max(s,i.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&hn('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){hn("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ti(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<i.count;A++)o[A]=new L,c[A]=new L;const h=new L,d=new L,u=new L,m=new Ne,p=new Ne,x=new Ne,_=new L,g=new L;function f(A,w,b){h.fromBufferAttribute(i,A),d.fromBufferAttribute(i,w),u.fromBufferAttribute(i,b),m.fromBufferAttribute(a,A),p.fromBufferAttribute(a,w),x.fromBufferAttribute(a,b),d.sub(h),u.sub(h),p.sub(m),x.sub(m);const P=1/(p.x*x.y-x.x*p.y);isFinite(P)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(u,-p.y).multiplyScalar(P),g.copy(u).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(P),o[A].add(_),o[w].add(_),o[b].add(_),c[A].add(g),c[w].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let A=0,w=y.length;A<w;++A){const b=y[A],P=b.start,D=b.count;for(let O=P,Z=P+D;O<Z;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const v=new L,M=new L,E=new L,S=new L;function C(A){E.fromBufferAttribute(s,A),S.copy(E);const w=o[A];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),M.crossVectors(S,w);const P=M.dot(c[A])<0?-1:1;r.setXYZW(A,v.x,v.y,v.z,P)}for(let A=0,w=y.length;A<w;++A){const b=y[A],P=b.start,D=b.count;for(let O=P,Z=P+D;O<Z;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ti(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const s=new L,a=new L,r=new L,o=new L,c=new L,h=new L,d=new L,u=new L;if(e)for(let m=0,p=e.count;m<p;m+=3){const x=e.getX(m+0),_=e.getX(m+1),g=e.getX(m+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,_),r.fromBufferAttribute(t,g),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),r.fromBufferAttribute(t,m+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(m+0,d.x,d.y,d.z),i.setXYZ(m+1,d.x,d.y,d.z),i.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Tn.fromBufferAttribute(e,t),Tn.normalize(),e.setXYZ(t,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,u=o.normalized,m=new h.constructor(c.length*d);let p=0,x=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*d;for(let f=0;f<d;f++)m[x++]=h[p++]}return new ti(m,d,u)}if(this.index===null)return wt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new sn,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const c=[],h=a[o];for(let d=0,u=h.length;d<u;d++){const m=h[d],p=e(m,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const h=r[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,m=h.length;u<m;u++){const p=h[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let m=0,p=u.length;m<p;m++)d.push(u[m].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hu=new Tt,Ns=new hd,wo=new er,du=new L,So=new L,To=new L,Eo=new L,fc=new L,Ao=new L,uu=new L,Co=new L;class U extends kt{constructor(e=new sn,t=new Ct){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){Ao.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=o[c],u=a[c];d!==0&&(fc.fromBufferAttribute(u,e),r?Ao.addScaledVector(fc,d):Ao.addScaledVector(fc.sub(t),d))}t.add(Ao)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wo.copy(i.boundingSphere),wo.applyMatrix4(a),Ns.copy(e.ray).recast(e.near),!(wo.containsPoint(Ns.origin)===!1&&(Ns.intersectSphere(wo,du)===null||Ns.origin.distanceToSquared(du)>(e.far-e.near)**2))&&(hu.copy(a).invert(),Ns.copy(e.ray).applyMatrix4(hu),!(i.boundingBox!==null&&Ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ns)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,m=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(r))for(let x=0,_=m.length;x<_;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,E=v;M<E;M+=3){const S=o.getX(M),C=o.getX(M+1),A=o.getX(M+2);s=Ro(this,f,e,i,h,d,u,S,C,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let g=x,f=_;g<f;g+=3){const y=o.getX(g),v=o.getX(g+1),M=o.getX(g+2);s=Ro(this,r,e,i,h,d,u,y,v,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,_=m.length;x<_;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,E=v;M<E;M+=3){const S=M,C=M+1,A=M+2;s=Ro(this,f,e,i,h,d,u,S,C,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let g=x,f=_;g<f;g+=3){const y=g,v=g+1,M=g+2;s=Ro(this,r,e,i,h,d,u,y,v,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Ym(n,e,t,i,s,a,r,o){let c;if(e.side===zn?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,e.side===Rs,o),c===null)return null;Co.copy(o),Co.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(Co);return h<t.near||h>t.far?null:{distance:h,point:Co.clone(),object:n}}function Ro(n,e,t,i,s,a,r,o,c,h){n.getVertexPosition(o,So),n.getVertexPosition(c,To),n.getVertexPosition(h,Eo);const d=Ym(n,e,t,i,So,To,Eo,uu);if(d){const u=new L;oi.getBarycoord(uu,So,To,Eo,u),s&&(d.uv=oi.getInterpolatedAttribute(s,o,c,h,u,new Ne)),a&&(d.uv1=oi.getInterpolatedAttribute(a,o,c,h,u,new Ne)),r&&(d.normal=oi.getInterpolatedAttribute(r,o,c,h,u,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const m={a:o,b:c,c:h,normal:new L,materialIndex:0};oi.getNormal(So,To,Eo,m.normal),d.face=m,d.barycoord=u}return d}class re extends sn{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],u=[];let m=0,p=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new Rt(h,3)),this.setAttribute("normal",new Rt(d,3)),this.setAttribute("uv",new Rt(u,2));function x(_,g,f,y,v,M,E,S,C,A,w){const b=M/C,P=E/A,D=M/2,O=E/2,Z=S/2,ee=C+1,Y=A+1;let J=0,te=0;const pe=new L;for(let Me=0;Me<Y;Me++){const Ze=Me*P-O;for(let I=0;I<ee;I++){const De=I*b-D;pe[_]=De*y,pe[g]=Ze*v,pe[f]=Z,h.push(pe.x,pe.y,pe.z),pe[_]=0,pe[g]=0,pe[f]=S>0?1:-1,d.push(pe.x,pe.y,pe.z),u.push(I/C),u.push(1-Me/A),J+=1}}for(let Me=0;Me<A;Me++)for(let Ze=0;Ze<C;Ze++){const I=m+Ze+ee*Me,De=m+Ze+ee*(Me+1),Se=m+(Ze+1)+ee*(Me+1),Ie=m+(Ze+1)+ee*Me;c.push(I,De,Ie),c.push(De,Se,Ie),te+=6}o.addGroup(p,te,w),p+=te,m+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new re(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Za(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(wt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Xn(n){const e={};for(let t=0;t<n.length;t++){const i=Za(n[t]);for(const s in i)e[s]=i[s]}return e}function $m(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function j0(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Gt.workingColorSpace}const Wr={clone:Za,merge:Xn};var Zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Km=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class An extends Is{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zm,this.fragmentShader=Km,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Za(e.uniforms),this.uniformsGroups=$m(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Q0 extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=Ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ps=new L,fu=new Ne,pu=new Ne;class jn extends Q0{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Hr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Er*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hr*2*Math.atan(Math.tan(Er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ps.x,ps.y).multiplyScalar(-e/ps.z),ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ps.x,ps.y).multiplyScalar(-e/ps.z)}getViewSize(e,t){return this.getViewBounds(e,fu,pu),t.subVectors(pu,fu)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Er*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wa=-90,Sa=1;class Jm extends kt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jn(wa,Sa,e,t);s.layers=this.layers,this.add(s);const a=new jn(wa,Sa,e,t);a.layers=this.layers,this.add(a);const r=new jn(wa,Sa,e,t);r.layers=this.layers,this.add(r);const o=new jn(wa,Sa,e,t);o.layers=this.layers,this.add(o);const c=new jn(wa,Sa,e,t);c.layers=this.layers,this.add(c);const h=new jn(wa,Sa,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,c]=t;for(const h of t)this.remove(h);if(e===Ni)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ul)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,h,d]=this.children,u=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,m,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class ef extends Nn{constructor(e=[],t=qa,i,s,a,r,o,c,h,d){super(e,t,i,s,a,r,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class jm extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ef(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new re(5,5,5),a=new An({name:"CubemapFromEquirect",uniforms:Za(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:zn,blending:Oi});a.uniforms.tEquirect.value=t;const r=new U(s,a),o=t.minFilter;return t.minFilter===Zs&&(t.minFilter=ci),new Jm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class tt extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qm={type:"move"};class pc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),f=this._getHandJoint(h,_);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],m=d.position.distanceTo(u.position),p=.02,x=.005;h.inputState.pinching&&m>p+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=p-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new tt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class ud{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new at(e),this.near=t,this.far=i}clone(){return new ud(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class tf extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ex{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ah,this.updateRanges=[],this.version=0,this.uuid=Vi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Hn=new L;class ml{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Hn.fromBufferAttribute(this,t),Hn.applyMatrix4(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Hn.fromBufferAttribute(this,t),Hn.applyNormalMatrix(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Hn.fromBufferAttribute(this,t),Hn.transformDirection(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Qt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Qt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array),a=Qt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){pl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new ti(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ml(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){pl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Il extends Is{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new at(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ta;const fr=new L,Ea=new L,Aa=new L,Ca=new Ne,pr=new Ne,nf=new Tt,Po=new L,mr=new L,Lo=new L,mu=new Ne,mc=new Ne,xu=new Ne;class xl extends kt{constructor(e=new Il){if(super(),this.isSprite=!0,this.type="Sprite",Ta===void 0){Ta=new sn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new ex(t,5);Ta.setIndex([0,1,2,0,2,3]),Ta.setAttribute("position",new ml(i,3,0,!1)),Ta.setAttribute("uv",new ml(i,2,3,!1))}this.geometry=Ta,this.material=e,this.center=new Ne(.5,.5),this.count=1}raycast(e,t){e.camera===null&&hn('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ea.setFromMatrixScale(this.matrixWorld),nf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Aa.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ea.multiplyScalar(-Aa.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;Do(Po.set(-.5,-.5,0),Aa,r,Ea,s,a),Do(mr.set(.5,-.5,0),Aa,r,Ea,s,a),Do(Lo.set(.5,.5,0),Aa,r,Ea,s,a),mu.set(0,0),mc.set(1,0),xu.set(1,1);let o=e.ray.intersectTriangle(Po,mr,Lo,!1,fr);if(o===null&&(Do(mr.set(-.5,.5,0),Aa,r,Ea,s,a),mc.set(0,1),o=e.ray.intersectTriangle(Po,Lo,mr,!1,fr),o===null))return;const c=e.ray.origin.distanceTo(fr);c<e.near||c>e.far||t.push({distance:c,point:fr.clone(),uv:oi.getInterpolation(fr,Po,mr,Lo,mu,mc,xu,new Ne),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Do(n,e,t,i,s,a){Ca.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(pr.x=a*Ca.x-s*Ca.y,pr.y=s*Ca.x+a*Ca.y):pr.copy(Ca),n.copy(e),n.x+=pr.x,n.y+=pr.y,n.applyMatrix4(nf)}class sf extends Nn{constructor(e=null,t=1,i=1,s,a,r,o,c,h=ei,d=ei,u,m){super(null,r,o,c,h,d,s,a,u,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gl extends ti{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ra=new Tt,gu=new Tt,Io=[],vu=new la,tx=new Tt,xr=new U,gr=new er;class rn extends U{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,tx)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new la),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ra),vu.copy(e.boundingBox).applyMatrix4(Ra),this.boundingBox.union(vu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new er),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ra),gr.copy(e.boundingSphere).applyMatrix4(Ra),this.boundingSphere.union(gr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gr.copy(this.boundingSphere),gr.applyMatrix4(i),e.ray.intersectsSphere(gr)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,Ra),gu.multiplyMatrices(i,Ra),xr.matrixWorld=gu,xr.raycast(e,Io);for(let r=0,o=Io.length;r<o;r++){const c=Io[r];c.instanceId=a,c.object=this,t.push(c)}Io.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new gl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new sf(new Float32Array(s*this.count),s,this.count,nd,zi));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=o,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const xc=new L,nx=new L,ix=new It;class Gs{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=xc.subVectors(i,t).cross(nx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(xc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||ix.getNormalMatrix(e),s=this.coplanarPoint(xc).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ks=new er,sx=new Ne(.5,.5),Fo=new L;class fd{constructor(e=new Gs,t=new Gs,i=new Gs,s=new Gs,a=new Gs,r=new Gs){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ni,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],h=a[3],d=a[4],u=a[5],m=a[6],p=a[7],x=a[8],_=a[9],g=a[10],f=a[11],y=a[12],v=a[13],M=a[14],E=a[15];if(s[0].setComponents(h-r,p-d,f-x,E-y).normalize(),s[1].setComponents(h+r,p+d,f+x,E+y).normalize(),s[2].setComponents(h+o,p+u,f+_,E+v).normalize(),s[3].setComponents(h-o,p-u,f-_,E-v).normalize(),i)s[4].setComponents(c,m,g,M).normalize(),s[5].setComponents(h-c,p-m,f-g,E-M).normalize();else if(s[4].setComponents(h-c,p-m,f-g,E-M).normalize(),t===Ni)s[5].setComponents(h+c,p+m,f+g,E+M).normalize();else if(t===ul)s[5].setComponents(c,m,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ks.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ks.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ks)}intersectsSprite(e){ks.center.set(0,0,0);const t=sx.distanceTo(e.center);return ks.radius=.7071067811865476+t,ks.applyMatrix4(e.matrixWorld),this.intersectsSphere(ks)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Fo.x=s.normal.x>0?e.max.x:e.min.x,Fo.y=s.normal.y>0?e.max.y:e.min.y,Fo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Fo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class vl extends Is{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new at(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ml=new L,_l=new L,Mu=new Tt,vr=new hd,Uo=new er,gc=new L,_u=new L;class Ch extends kt{constructor(e=new sn,t=new vl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)Ml.fromBufferAttribute(t,s-1),_l.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ml.distanceTo(_l);e.setAttribute("lineDistance",new Rt(i,1))}else wt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Uo.copy(i.boundingSphere),Uo.applyMatrix4(s),Uo.radius+=a,e.ray.intersectsSphere(Uo)===!1)return;Mu.copy(s).invert(),vr.copy(e.ray).applyMatrix4(Mu);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,m=i.attributes.position;if(d!==null){const p=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let _=p,g=x-1;_<g;_+=h){const f=d.getX(_),y=d.getX(_+1),v=zo(this,e,vr,c,f,y,_);v&&t.push(v)}if(this.isLineLoop){const _=d.getX(x-1),g=d.getX(p),f=zo(this,e,vr,c,_,g,x-1);f&&t.push(f)}}else{const p=Math.max(0,r.start),x=Math.min(m.count,r.start+r.count);for(let _=p,g=x-1;_<g;_+=h){const f=zo(this,e,vr,c,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){const _=zo(this,e,vr,c,x-1,p,x-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function zo(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(Ml.fromBufferAttribute(o,s),_l.fromBufferAttribute(o,a),t.distanceSqToSegment(Ml,_l,gc,_u)>i)return;gc.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(gc);if(!(h<e.near||h>e.far))return{distance:h,point:_u.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const yu=new L,bu=new L;class ax extends Ch{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)yu.fromBufferAttribute(t,s),bu.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+yu.distanceTo(bu);e.setAttribute("lineDistance",new Rt(i,1))}else wt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class en extends Nn{constructor(e,t,i,s,a,r,o,c,h){super(e,t,i,s,a,r,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class af extends Nn{constructor(e,t,i=sa,s,a,r,o=ei,c=ei,h,d=Br,u=1){if(d!==Br&&d!==Vr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:u};super(m,s,a,r,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new cd(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class rf extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class bn extends sn{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],h=new L,d=new Ne;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,m=3;u<=t;u++,m+=3){const p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),r.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(r[m]/e+1)/2,d.y=(r[m+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new Rt(r,3)),this.setAttribute("normal",new Rt(o,3)),this.setAttribute("uv",new Rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Xe extends sn{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],m=[],p=[];let x=0;const _=[],g=i/2;let f=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new Rt(u,3)),this.setAttribute("normal",new Rt(m,3)),this.setAttribute("uv",new Rt(p,2));function y(){const M=new L,E=new L;let S=0;const C=(t-e)/i;for(let A=0;A<=a;A++){const w=[],b=A/a,P=b*(t-e)+e;for(let D=0;D<=s;D++){const O=D/s,Z=O*c+o,ee=Math.sin(Z),Y=Math.cos(Z);E.x=P*ee,E.y=-b*i+g,E.z=P*Y,u.push(E.x,E.y,E.z),M.set(ee,C,Y).normalize(),m.push(M.x,M.y,M.z),p.push(O,1-b),w.push(x++)}_.push(w)}for(let A=0;A<s;A++)for(let w=0;w<a;w++){const b=_[w][A],P=_[w+1][A],D=_[w+1][A+1],O=_[w][A+1];(e>0||w!==0)&&(d.push(b,P,O),S+=3),(t>0||w!==a-1)&&(d.push(P,D,O),S+=3)}h.addGroup(f,S,0),f+=S}function v(M){const E=x,S=new Ne,C=new L;let A=0;const w=M===!0?e:t,b=M===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*b,0),m.push(0,b,0),p.push(.5,.5),x++;const P=x;for(let D=0;D<=s;D++){const Z=D/s*c+o,ee=Math.cos(Z),Y=Math.sin(Z);C.x=w*Y,C.y=g*b,C.z=w*ee,u.push(C.x,C.y,C.z),m.push(0,b,0),S.x=ee*.5+.5,S.y=Y*.5*b+.5,p.push(S.x,S.y),x++}for(let D=0;D<s;D++){const O=E+D,Z=P+D;M===!0?d.push(Z,Z+1,O):d.push(Z+1,Z,O),A+=3}h.addGroup(f,A,M===!0?1:2),f+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fi extends Xe{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new Fi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fl extends sn{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),h(i),d(),this.setAttribute("position",new Rt(a,3)),this.setAttribute("normal",new Rt(a.slice(),3)),this.setAttribute("uv",new Rt(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new L,M=new L,E=new L;for(let S=0;S<t.length;S+=3)p(t[S+0],v),p(t[S+1],M),p(t[S+2],E),c(v,M,E,y)}function c(y,v,M,E){const S=E+1,C=[];for(let A=0;A<=S;A++){C[A]=[];const w=y.clone().lerp(M,A/S),b=v.clone().lerp(M,A/S),P=S-A;for(let D=0;D<=P;D++)D===0&&A===S?C[A][D]=w:C[A][D]=w.clone().lerp(b,D/P)}for(let A=0;A<S;A++)for(let w=0;w<2*(S-A)-1;w++){const b=Math.floor(w/2);w%2===0?(m(C[A][b+1]),m(C[A+1][b]),m(C[A][b])):(m(C[A][b+1]),m(C[A+1][b+1]),m(C[A+1][b]))}}function h(y){const v=new L;for(let M=0;M<a.length;M+=3)v.x=a[M+0],v.y=a[M+1],v.z=a[M+2],v.normalize().multiplyScalar(y),a[M+0]=v.x,a[M+1]=v.y,a[M+2]=v.z}function d(){const y=new L;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const M=g(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;r.push(M,1-E)}x(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],M=r[y+2],E=r[y+4],S=Math.max(v,M,E),C=Math.min(v,M,E);S>.9&&C<.1&&(v<.2&&(r[y+0]+=1),M<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function m(y){a.push(y.x,y.y,y.z)}function p(y,v){const M=y*3;v.x=e[M+0],v.y=e[M+1],v.z=e[M+2]}function x(){const y=new L,v=new L,M=new L,E=new L,S=new Ne,C=new Ne,A=new Ne;for(let w=0,b=0;w<a.length;w+=9,b+=6){y.set(a[w+0],a[w+1],a[w+2]),v.set(a[w+3],a[w+4],a[w+5]),M.set(a[w+6],a[w+7],a[w+8]),S.set(r[b+0],r[b+1]),C.set(r[b+2],r[b+3]),A.set(r[b+4],r[b+5]),E.copy(y).add(v).add(M).divideScalar(3);const P=g(E);_(S,b+0,y,P),_(C,b+2,v,P),_(A,b+4,M,P)}}function _(y,v,M,E){E<0&&y.x===1&&(r[v]=y.x-1),M.x===0&&M.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fl(e.vertices,e.indices,e.radius,e.details)}}class pd extends Fl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new pd(e.radius,e.detail)}}class Yi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){wt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,c=a-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-r,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],m=i[s+1]-d,p=(r-d)/m;return(s+p)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=t||(r.isVector2?new Ne:new L);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,s=[],a=[],r=[],o=new L,c=new Tt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new L)}a[0]=new L,r[0]=new L;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),m=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),m<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let p=1;p<=e;p++){if(a[p]=a[p-1].clone(),r[p]=r[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(zt(s[p-1].dot(s[p]),-1,1));a[p].applyMatrix4(c.makeRotationAxis(o,x))}r[p].crossVectors(s[p],a[p])}if(t===!0){let p=Math.acos(zt(a[0].dot(a[e]),-1,1));p/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(p=-p);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],p*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class md extends Yi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ne){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),m=c-this.aX,p=h-this.aY;c=m*d-p*u+this.aX,h=m*u+p*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class rx extends md{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function xd(){let n=0,e=0,t=0,i=0;function s(a,r,o,c){n=a,e=o,t=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,h){s(r,o,h*(o-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,h,d,u){let m=(r-a)/h-(o-a)/(h+d)+(o-r)/d,p=(o-r)/d-(c-r)/(d+u)+(c-o)/u;m*=d,p*=d,s(r,o,m,p)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const No=new L,vc=new xd,Mc=new xd,_c=new xd;class ox extends Yi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%a]:(No.subVectors(s[0],s[1]).add(s[0]),h=No);const u=s[o%a],m=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(No.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=No),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(d),p);_<1e-4&&(_=1),x<1e-4&&(x=_),g<1e-4&&(g=_),vc.initNonuniformCatmullRom(h.x,u.x,m.x,d.x,x,_,g),Mc.initNonuniformCatmullRom(h.y,u.y,m.y,d.y,x,_,g),_c.initNonuniformCatmullRom(h.z,u.z,m.z,d.z,x,_,g)}else this.curveType==="catmullrom"&&(vc.initCatmullRom(h.x,u.x,m.x,d.x,this.tension),Mc.initCatmullRom(h.y,u.y,m.y,d.y,this.tension),_c.initCatmullRom(h.z,u.z,m.z,d.z,this.tension));return i.set(vc.calc(c),Mc.calc(c),_c.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function wu(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*o+a*n+t}function lx(n,e){const t=1-n;return t*t*e}function cx(n,e){return 2*(1-n)*n*e}function hx(n,e){return n*n*e}function Cr(n,e,t,i){return lx(n,e)+cx(n,t)+hx(n,i)}function dx(n,e){const t=1-n;return t*t*t*e}function ux(n,e){const t=1-n;return 3*t*t*n*e}function fx(n,e){return 3*(1-n)*n*n*e}function px(n,e){return n*n*n*e}function Rr(n,e,t,i,s){return dx(n,e)+ux(n,t)+fx(n,i)+px(n,s)}class of extends Yi{constructor(e=new Ne,t=new Ne,i=new Ne,s=new Ne){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ne){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Rr(e,s.x,a.x,r.x,o.x),Rr(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class mx extends Yi{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Rr(e,s.x,a.x,r.x,o.x),Rr(e,s.y,a.y,r.y,o.y),Rr(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lf extends Yi{constructor(e=new Ne,t=new Ne){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ne){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ne){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class xx extends Yi{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cf extends Yi{constructor(e=new Ne,t=new Ne,i=new Ne){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ne){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(Cr(e,s.x,a.x,r.x),Cr(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gx extends Yi{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(Cr(e,s.x,a.x,r.x),Cr(e,s.y,a.y,r.y),Cr(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hf extends Yi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ne){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(wu(o,c.x,h.x,d.x,u.x),wu(o,c.y,h.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Ne().fromArray(s))}return this}}var Su=Object.freeze({__proto__:null,ArcCurve:rx,CatmullRomCurve3:ox,CubicBezierCurve:of,CubicBezierCurve3:mx,EllipseCurve:md,LineCurve:lf,LineCurve3:xx,QuadraticBezierCurve:cf,QuadraticBezierCurve3:gx,SplineCurve:hf});class vx extends Yi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Su[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),h=c===0?0:1-r/c;return o.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Su[s.type]().fromJSON(s))}return this}}class Tu extends vx{constructor(e){super(),this.type="Path",this.currentPoint=new Ne,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new lf(this.currentPoint.clone(),new Ne(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new cf(this.currentPoint.clone(),new Ne(e,t),new Ne(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new of(this.currentPoint.clone(),new Ne(e,t),new Ne(i,s),new Ne(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new hf(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,o,c),this}absellipse(e,t,i,s,a,r,o,c){const h=new md(e,t,i,s,a,r,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class gd extends Tu{constructor(e){super(e),this.uuid=Vi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Tu().fromJSON(s))}return this}}function Mx(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=df(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,h;if(i&&(a=Sx(n,e,a,t)),n.length>80*t){o=n[0],c=n[1];let d=o,u=c;for(let m=t;m<s;m+=t){const p=n[m],x=n[m+1];p<o&&(o=p),x<c&&(c=x),p>d&&(d=p),x>u&&(u=x)}h=Math.max(d-o,u-c),h=h!==0?32767/h:0}return Xr(a,r,t,o,c,h,0),r}function df(n,e,t,i,s){let a;if(s===Ux(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=Eu(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=Eu(r/i|0,n[r],n[r+1],a);return a&&Ka(a,a.next)&&(Yr(a),a=a.next),a}function aa(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ka(t,t.next)||dn(t.prev,t,t.next)===0)){if(Yr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Xr(n,e,t,i,s,a,r){if(!n)return;!r&&a&&Rx(n,i,s,a);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?yx(n,i,s,a):_x(n)){e.push(c.i,n.i,h.i),Yr(n),n=h.next,o=h.next;continue}if(n=h,n===o){r?r===1?(n=bx(aa(n),e),Xr(n,e,t,i,s,a,2)):r===2&&wx(n,e,t,i,s,a):Xr(aa(n),e,t,i,s,a,1);break}}}function _x(n){const e=n.prev,t=n,i=n.next;if(dn(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),u=Math.min(o,c,h),m=Math.max(s,a,r),p=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=m&&x.y>=u&&x.y<=p&&wr(s,o,a,c,r,h,x.x,x.y)&&dn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function yx(n,e,t,i){const s=n.prev,a=n,r=n.next;if(dn(s,a,r)>=0)return!1;const o=s.x,c=a.x,h=r.x,d=s.y,u=a.y,m=r.y,p=Math.min(o,c,h),x=Math.min(d,u,m),_=Math.max(o,c,h),g=Math.max(d,u,m),f=Rh(p,x,e,t,i),y=Rh(_,g,e,t,i);let v=n.prevZ,M=n.nextZ;for(;v&&v.z>=f&&M&&M.z<=y;){if(v.x>=p&&v.x<=_&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&wr(o,d,c,u,h,m,v.x,v.y)&&dn(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==r&&wr(o,d,c,u,h,m,M.x,M.y)&&dn(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=_&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&wr(o,d,c,u,h,m,v.x,v.y)&&dn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=y;){if(M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==r&&wr(o,d,c,u,h,m,M.x,M.y)&&dn(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function bx(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Ka(i,s)&&ff(i,t,t.next,s)&&qr(i,s)&&qr(s,i)&&(e.push(i.i,t.i,s.i),Yr(t),Yr(t.next),t=n=s),t=t.next}while(t!==n);return aa(t)}function wx(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&Dx(r,o)){let c=pf(r,o);r=aa(r,r.next),c=aa(c,c.next),Xr(r,e,t,i,s,a,0),Xr(c,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function Sx(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=df(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(Lx(h))}s.sort(Tx);for(let a=0;a<s.length;a++)t=Ex(s[a],t);return t}function Tx(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Ex(n,e){const t=Ax(n,e);if(!t)return e;const i=pf(t,n);return aa(i,i.next),aa(t,t.next)}function Ax(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(Ka(n,t))return t;do{if(Ka(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&uf(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);qr(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&Cx(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function Cx(n,e){return dn(n.prev,n,e.prev)<0&&dn(e.next,n,n.next)<0}function Rx(n,e,t,i){let s=n;do s.z===0&&(s.z=Rh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Px(s)}function Px(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let h=0;h<t&&(o++,r=r.nextZ,!!r);h++);let c=t;for(;o>0||c>0&&r;)o!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function Rh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Lx(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function uf(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function wr(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&uf(n,e,t,i,s,a,r,o)}function Dx(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Ix(n,e)&&(qr(n,e)&&qr(e,n)&&Fx(n,e)&&(dn(n.prev,n,e.prev)||dn(n,e.prev,e))||Ka(n,e)&&dn(n.prev,n,n.next)>0&&dn(e.prev,e,e.next)>0)}function dn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ka(n,e){return n.x===e.x&&n.y===e.y}function ff(n,e,t,i){const s=Oo(dn(n,e,t)),a=Oo(dn(n,e,i)),r=Oo(dn(t,i,n)),o=Oo(dn(t,i,e));return!!(s!==a&&r!==o||s===0&&ko(n,t,e)||a===0&&ko(n,i,e)||r===0&&ko(t,n,i)||o===0&&ko(t,e,i))}function ko(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Oo(n){return n>0?1:n<0?-1:0}function Ix(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&ff(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function qr(n,e){return dn(n.prev,n,n.next)<0?dn(n,e,n.next)>=0&&dn(n,n.prev,e)>=0:dn(n,e,n.prev)<0||dn(n,n.next,e)<0}function Fx(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function pf(n,e){const t=Ph(n.i,n.x,n.y),i=Ph(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function Eu(n,e,t,i){const s=Ph(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Yr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ph(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ux(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class zx{static triangulate(e,t,i=2){return Mx(e,t,i)}}class Pr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return Pr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];Au(e),Cu(i,e);let r=e.length;t.forEach(Au);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,Cu(i,t[c]);const o=zx.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function Au(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Cu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class vd extends Fl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new vd(e.radius,e.detail)}}class Nt extends sn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,u=e/o,m=t/c,p=[],x=[],_=[],g=[];for(let f=0;f<d;f++){const y=f*m-r;for(let v=0;v<h;v++){const M=v*u-a;x.push(M,-y,0),_.push(0,0,1),g.push(v/o),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){const v=y+h*f,M=y+h*(f+1),E=y+1+h*(f+1),S=y+1+h*f;p.push(v,M,S),p.push(M,E,S)}this.setIndex(p),this.setAttribute("position",new Rt(x,3)),this.setAttribute("normal",new Rt(_,3)),this.setAttribute("uv",new Rt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ul extends sn{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let u=e;const m=(t-e)/s,p=new L,x=new Ne;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){const f=a+g/i*r;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),h.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,d.push(x.x,x.y)}u+=m}for(let _=0;_<s;_++){const g=_*(i+1);for(let f=0;f<i;f++){const y=f+g,v=y,M=y+i+1,E=y+i+2,S=y+1;o.push(v,M,S),o.push(M,E,S)}}this.setIndex(o),this.setAttribute("position",new Rt(c,3)),this.setAttribute("normal",new Rt(h,3)),this.setAttribute("uv",new Rt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ul(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class zl extends sn{constructor(e=new gd([new Ne(0,.5),new Ne(-.5,-.5),new Ne(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new Rt(s,3)),this.setAttribute("normal",new Rt(a,3)),this.setAttribute("uv",new Rt(r,2));function h(d){const u=s.length/3,m=d.extractPoints(t);let p=m.shape;const x=m.holes;Pr.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,f=x.length;g<f;g++){const y=x[g];Pr.isClockWise(y)===!0&&(x[g]=y.reverse())}const _=Pr.triangulateShape(p,x);for(let g=0,f=x.length;g<f;g++){const y=x[g];p=p.concat(y)}for(let g=0,f=p.length;g<f;g++){const y=p[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,f=_.length;g<f;g++){const y=_[g],v=y[0]+u,M=y[1]+u,E=y[2]+u;i.push(v,M,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Nx(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new zl(i,e.curveSegments)}}function Nx(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Ot extends sn{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let h=0;const d=[],u=new L,m=new L,p=[],x=[],_=[],g=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let M=0;f===0&&r===0?M=.5/t:f===i&&c===Math.PI&&(M=-.5/t);for(let E=0;E<=t;E++){const S=E/t;u.x=-e*Math.cos(s+S*a)*Math.sin(r+v*o),u.y=e*Math.cos(r+v*o),u.z=e*Math.sin(s+S*a)*Math.sin(r+v*o),x.push(u.x,u.y,u.z),m.copy(u).normalize(),_.push(m.x,m.y,m.z),g.push(S+M,1-v),y.push(h++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],M=d[f][y],E=d[f+1][y],S=d[f+1][y+1];(f!==0||r>0)&&p.push(v,M,S),(f!==i-1||c<Math.PI)&&p.push(M,E,S)}this.setIndex(p),this.setAttribute("position",new Rt(x,3)),this.setAttribute("normal",new Rt(_,3)),this.setAttribute("uv",new Rt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ps extends sn{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],h=[],d=new L,u=new L,m=new L;for(let p=0;p<=i;p++)for(let x=0;x<=s;x++){const _=x/s*a,g=p/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(_),u.y=(e+t*Math.cos(g))*Math.sin(_),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),m.subVectors(u,d).normalize(),c.push(m.x,m.y,m.z),h.push(x/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=s;x++){const _=(s+1)*p+x-1,g=(s+1)*(p-1)+x-1,f=(s+1)*(p-1)+x,y=(s+1)*p+x;r.push(_,g,y),r.push(g,f,y)}this.setIndex(r),this.setAttribute("position",new Rt(o,3)),this.setAttribute("normal",new Rt(c,3)),this.setAttribute("uv",new Rt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class kx extends An{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Is{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=od,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ox extends Is{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=od,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Jh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Bx extends Is{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=im,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Vx extends Is{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Md extends kt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new at(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Gx extends Md{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new at(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const yc=new Tt,Ru=new L,Pu=new L;class mf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.mapType=qi,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fd,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Ru.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ru),Pu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Pu),t.updateMatrixWorld(),yc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(yc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Lu=new Tt,Mr=new L,bc=new L;class Hx extends mf{constructor(){super(new jn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ne(4,2),this._viewportCount=6,this._viewports=[new tn(2,1,1,1),new tn(0,1,1,1),new tn(3,1,1,1),new tn(1,1,1,1),new tn(3,0,1,1),new tn(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),Mr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Mr),bc.copy(i.position),bc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(bc),i.updateMatrixWorld(),s.makeTranslation(-Mr.x,-Mr.y,-Mr.z),Lu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lu,i.coordinateSystem,i.reversedDepth)}}class _d extends Md{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Hx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class yd extends Q0{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Wx extends mf{constructor(){super(new yd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wc extends Md{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new Wx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Xx extends jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class xf{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Du=new Tt;class qx{constructor(e,t,i=0,s=1/0){this.ray=new hd(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new dd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):hn("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Du.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Du),this}intersectObject(e,t=!0,i=[]){return Lh(e,this,i,t),i.sort(Iu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)Lh(e[s],this,i,t);return i.sort(Iu),i}}function Iu(n,e){return n.distance-e.distance}function Lh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Lh(a[r],e,t,!0)}}function Fu(n,e,t,i){const s=Yx(i);switch(t){case W0:return n*e;case nd:return n*e/s.components*s.byteLength;case id:return n*e/s.components*s.byteLength;case sd:return n*e*2/s.components*s.byteLength;case ad:return n*e*2/s.components*s.byteLength;case X0:return n*e*3/s.components*s.byteLength;case bi:return n*e*4/s.components*s.byteLength;case rd:return n*e*4/s.components*s.byteLength;case nl:case il:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case sl:case al:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case eh:case nh:return Math.max(n,16)*Math.max(e,8)/4;case Qc:case th:return Math.max(n,8)*Math.max(e,8)/2;case ih:case sh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ah:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case rh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oh:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case lh:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ch:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case hh:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case dh:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case uh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case fh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ph:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case mh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case xh:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case gh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case vh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Mh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case _h:case yh:case bh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case wh:case Sh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Th:case Eh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yx(n){switch(n){case qi:case B0:return{byteLength:1,components:1};case kr:case V0:case Bi:return{byteLength:2,components:1};case ed:case td:return{byteLength:2,components:4};case sa:case Qh:case zi:return{byteLength:4,components:1};case G0:case H0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kh}}));typeof window<"u"&&(window.__THREE__?wt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kh);function gf(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function $x(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,u=h.byteLength,m=n.createBuffer();n.bindBuffer(c,m),n.bufferData(c,h,d),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){const d=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,d);else{u.sort((p,x)=>p.start-x.start);let m=0;for(let p=1;p<u.length;p++){const x=u[m],_=u[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++m,u[m]=_)}u.length=m+1;for(let p=0,x=u.length;p<x;p++){const _=u[p];n.bufferSubData(h,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:a,update:r}}var Zx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kx=`#ifdef USE_ALPHAHASH
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
#endif`,Jx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,eg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tg=`#ifdef USE_AOMAP
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
#endif`,ng=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ig=`#ifdef USE_BATCHING
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
#endif`,sg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ag=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,og=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,lg=`#ifdef USE_IRIDESCENCE
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
#endif`,cg=`#ifdef USE_BUMPMAP
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
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,dg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ug=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,mg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,vg=`#define PI 3.141592653589793
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
} // validated`,Mg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_g=`vec3 transformedNormal = objectNormal;
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
#endif`,yg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Eg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ag=`#ifdef USE_ENVMAP
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
#endif`,Cg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Rg=`#ifdef USE_ENVMAP
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
#endif`,Pg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Lg=`#ifdef USE_ENVMAP
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
#endif`,Dg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ig=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ug=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zg=`#ifdef USE_GRADIENTMAP
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
}`,Ng=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Og=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bg=`uniform bool receiveShadow;
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
#endif`,Vg=`#ifdef USE_ENVMAP
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
#endif`,Gg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qg=`PhysicalMaterial material;
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
#endif`,Yg=`uniform sampler2D dfgLUT;
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
}`,$g=`
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
#endif`,Zg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Kg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,t1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,n1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,i1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,s1=`#if defined( USE_POINTS_UV )
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
#endif`,a1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,r1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,o1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,l1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,c1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h1=`#ifdef USE_MORPHTARGETS
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
#endif`,d1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,u1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,f1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,p1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,g1=`#ifdef USE_NORMALMAP
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
#endif`,v1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,y1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,b1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,w1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,S1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,T1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,E1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,A1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,C1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,P1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,L1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,D1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,I1=`float getShadowMask() {
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
}`,F1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,U1=`#ifdef USE_SKINNING
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
#endif`,z1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,N1=`#ifdef USE_SKINNING
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
#endif`,k1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,O1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,B1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,V1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,G1=`#ifdef USE_TRANSMISSION
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
#endif`,H1=`#ifdef USE_TRANSMISSION
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
#endif`,W1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,X1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Y1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Z1=`uniform sampler2D t2D;
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
}`,K1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,j1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e2=`#include <common>
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
}`,t2=`#if DEPTH_PACKING == 3200
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
}`,n2=`#define DISTANCE
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
}`,i2=`#define DISTANCE
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
}`,s2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,a2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r2=`uniform float scale;
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
}`,o2=`uniform vec3 diffuse;
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
}`,l2=`#include <common>
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
}`,c2=`uniform vec3 diffuse;
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
}`,h2=`#define LAMBERT
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
}`,d2=`#define LAMBERT
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
}`,u2=`#define MATCAP
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
}`,f2=`#define MATCAP
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
}`,p2=`#define NORMAL
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
}`,m2=`#define NORMAL
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
}`,x2=`#define PHONG
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
}`,g2=`#define PHONG
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
}`,v2=`#define STANDARD
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
}`,M2=`#define STANDARD
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
}`,_2=`#define TOON
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
}`,y2=`#define TOON
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
}`,b2=`uniform float size;
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
}`,w2=`uniform vec3 diffuse;
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
}`,S2=`#include <common>
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
}`,T2=`uniform vec3 color;
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
}`,E2=`uniform float rotation;
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
}`,A2=`uniform vec3 diffuse;
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
}`,Ft={alphahash_fragment:Zx,alphahash_pars_fragment:Kx,alphamap_fragment:Jx,alphamap_pars_fragment:jx,alphatest_fragment:Qx,alphatest_pars_fragment:eg,aomap_fragment:tg,aomap_pars_fragment:ng,batching_pars_vertex:ig,batching_vertex:sg,begin_vertex:ag,beginnormal_vertex:rg,bsdfs:og,iridescence_fragment:lg,bumpmap_pars_fragment:cg,clipping_planes_fragment:hg,clipping_planes_pars_fragment:dg,clipping_planes_pars_vertex:ug,clipping_planes_vertex:fg,color_fragment:pg,color_pars_fragment:mg,color_pars_vertex:xg,color_vertex:gg,common:vg,cube_uv_reflection_fragment:Mg,defaultnormal_vertex:_g,displacementmap_pars_vertex:yg,displacementmap_vertex:bg,emissivemap_fragment:wg,emissivemap_pars_fragment:Sg,colorspace_fragment:Tg,colorspace_pars_fragment:Eg,envmap_fragment:Ag,envmap_common_pars_fragment:Cg,envmap_pars_fragment:Rg,envmap_pars_vertex:Pg,envmap_physical_pars_fragment:Vg,envmap_vertex:Lg,fog_vertex:Dg,fog_pars_vertex:Ig,fog_fragment:Fg,fog_pars_fragment:Ug,gradientmap_pars_fragment:zg,lightmap_pars_fragment:Ng,lights_lambert_fragment:kg,lights_lambert_pars_fragment:Og,lights_pars_begin:Bg,lights_toon_fragment:Gg,lights_toon_pars_fragment:Hg,lights_phong_fragment:Wg,lights_phong_pars_fragment:Xg,lights_physical_fragment:qg,lights_physical_pars_fragment:Yg,lights_fragment_begin:$g,lights_fragment_maps:Zg,lights_fragment_end:Kg,logdepthbuf_fragment:Jg,logdepthbuf_pars_fragment:jg,logdepthbuf_pars_vertex:Qg,logdepthbuf_vertex:e1,map_fragment:t1,map_pars_fragment:n1,map_particle_fragment:i1,map_particle_pars_fragment:s1,metalnessmap_fragment:a1,metalnessmap_pars_fragment:r1,morphinstance_vertex:o1,morphcolor_vertex:l1,morphnormal_vertex:c1,morphtarget_pars_vertex:h1,morphtarget_vertex:d1,normal_fragment_begin:u1,normal_fragment_maps:f1,normal_pars_fragment:p1,normal_pars_vertex:m1,normal_vertex:x1,normalmap_pars_fragment:g1,clearcoat_normal_fragment_begin:v1,clearcoat_normal_fragment_maps:M1,clearcoat_pars_fragment:_1,iridescence_pars_fragment:y1,opaque_fragment:b1,packing:w1,premultiplied_alpha_fragment:S1,project_vertex:T1,dithering_fragment:E1,dithering_pars_fragment:A1,roughnessmap_fragment:C1,roughnessmap_pars_fragment:R1,shadowmap_pars_fragment:P1,shadowmap_pars_vertex:L1,shadowmap_vertex:D1,shadowmask_pars_fragment:I1,skinbase_vertex:F1,skinning_pars_vertex:U1,skinning_vertex:z1,skinnormal_vertex:N1,specularmap_fragment:k1,specularmap_pars_fragment:O1,tonemapping_fragment:B1,tonemapping_pars_fragment:V1,transmission_fragment:G1,transmission_pars_fragment:H1,uv_pars_fragment:W1,uv_pars_vertex:X1,uv_vertex:q1,worldpos_vertex:Y1,background_vert:$1,background_frag:Z1,backgroundCube_vert:K1,backgroundCube_frag:J1,cube_vert:j1,cube_frag:Q1,depth_vert:e2,depth_frag:t2,distanceRGBA_vert:n2,distanceRGBA_frag:i2,equirect_vert:s2,equirect_frag:a2,linedashed_vert:r2,linedashed_frag:o2,meshbasic_vert:l2,meshbasic_frag:c2,meshlambert_vert:h2,meshlambert_frag:d2,meshmatcap_vert:u2,meshmatcap_frag:f2,meshnormal_vert:p2,meshnormal_frag:m2,meshphong_vert:x2,meshphong_frag:g2,meshphysical_vert:v2,meshphysical_frag:M2,meshtoon_vert:_2,meshtoon_frag:y2,points_vert:b2,points_frag:w2,shadow_vert:S2,shadow_frag:T2,sprite_vert:E2,sprite_frag:A2},We={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},Di={basic:{uniforms:Xn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.fog]),vertexShader:Ft.meshbasic_vert,fragmentShader:Ft.meshbasic_frag},lambert:{uniforms:Xn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.fog,We.lights,{emissive:{value:new at(0)}}]),vertexShader:Ft.meshlambert_vert,fragmentShader:Ft.meshlambert_frag},phong:{uniforms:Xn([We.common,We.specularmap,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.fog,We.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:Ft.meshphong_vert,fragmentShader:Ft.meshphong_frag},standard:{uniforms:Xn([We.common,We.envmap,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.roughnessmap,We.metalnessmap,We.fog,We.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag},toon:{uniforms:Xn([We.common,We.aomap,We.lightmap,We.emissivemap,We.bumpmap,We.normalmap,We.displacementmap,We.gradientmap,We.fog,We.lights,{emissive:{value:new at(0)}}]),vertexShader:Ft.meshtoon_vert,fragmentShader:Ft.meshtoon_frag},matcap:{uniforms:Xn([We.common,We.bumpmap,We.normalmap,We.displacementmap,We.fog,{matcap:{value:null}}]),vertexShader:Ft.meshmatcap_vert,fragmentShader:Ft.meshmatcap_frag},points:{uniforms:Xn([We.points,We.fog]),vertexShader:Ft.points_vert,fragmentShader:Ft.points_frag},dashed:{uniforms:Xn([We.common,We.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ft.linedashed_vert,fragmentShader:Ft.linedashed_frag},depth:{uniforms:Xn([We.common,We.displacementmap]),vertexShader:Ft.depth_vert,fragmentShader:Ft.depth_frag},normal:{uniforms:Xn([We.common,We.bumpmap,We.normalmap,We.displacementmap,{opacity:{value:1}}]),vertexShader:Ft.meshnormal_vert,fragmentShader:Ft.meshnormal_frag},sprite:{uniforms:Xn([We.sprite,We.fog]),vertexShader:Ft.sprite_vert,fragmentShader:Ft.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ft.background_vert,fragmentShader:Ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Ft.backgroundCube_vert,fragmentShader:Ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ft.cube_vert,fragmentShader:Ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ft.equirect_vert,fragmentShader:Ft.equirect_frag},distanceRGBA:{uniforms:Xn([We.common,We.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ft.distanceRGBA_vert,fragmentShader:Ft.distanceRGBA_frag},shadow:{uniforms:Xn([We.lights,We.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:Ft.shadow_vert,fragmentShader:Ft.shadow_frag}};Di.physical={uniforms:Xn([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag};const Bo={r:0,b:0,g:0},Os=new Ti,C2=new Tt;function R2(n,e,t,i,s,a,r){const o=new at(0);let c=a===!0?0:1,h,d,u=null,m=0,p=null;function x(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?t:e).get(M)),M}function _(v){let M=!1;const E=x(v);E===null?f(o,c):E&&E.isColor&&(f(E,1),M=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,M){const E=x(M);E&&(E.isCubeTexture||E.mapping===Dl)?(d===void 0&&(d=new U(new re(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:Za(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Os.copy(M.backgroundRotation),Os.x*=-1,Os.y*=-1,Os.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Os.y*=-1,Os.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(C2.makeRotationFromEuler(Os)),d.material.toneMapped=Gt.getTransfer(E.colorSpace)!==jt,(u!==E||m!==E.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new U(new Nt(2,2),new An({name:"BackgroundMaterial",uniforms:Za(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:Rs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.toneMapped=Gt.getTransfer(E.colorSpace)!==jt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||m!==E.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function f(v,M){v.getRGB(Bo,j0(n)),i.buffers.color.setClear(Bo.r,Bo.g,Bo.b,M,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),c=M,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(o,c)},render:_,addToRenderList:g,dispose:y}}function P2(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null);let a=s,r=!1;function o(b,P,D,O,Z){let ee=!1;const Y=u(O,D,P);a!==Y&&(a=Y,h(a.object)),ee=p(b,O,D,Z),ee&&x(b,O,D,Z),Z!==null&&e.update(Z,n.ELEMENT_ARRAY_BUFFER),(ee||r)&&(r=!1,M(b,P,D,O),Z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,P,D){const O=D.wireframe===!0;let Z=i[b.id];Z===void 0&&(Z={},i[b.id]=Z);let ee=Z[P.id];ee===void 0&&(ee={},Z[P.id]=ee);let Y=ee[O];return Y===void 0&&(Y=m(c()),ee[O]=Y),Y}function m(b){const P=[],D=[],O=[];for(let Z=0;Z<t;Z++)P[Z]=0,D[Z]=0,O[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:D,attributeDivisors:O,object:b,attributes:{},index:null}}function p(b,P,D,O){const Z=a.attributes,ee=P.attributes;let Y=0;const J=D.getAttributes();for(const te in J)if(J[te].location>=0){const Me=Z[te];let Ze=ee[te];if(Ze===void 0&&(te==="instanceMatrix"&&b.instanceMatrix&&(Ze=b.instanceMatrix),te==="instanceColor"&&b.instanceColor&&(Ze=b.instanceColor)),Me===void 0||Me.attribute!==Ze||Ze&&Me.data!==Ze.data)return!0;Y++}return a.attributesNum!==Y||a.index!==O}function x(b,P,D,O){const Z={},ee=P.attributes;let Y=0;const J=D.getAttributes();for(const te in J)if(J[te].location>=0){let Me=ee[te];Me===void 0&&(te==="instanceMatrix"&&b.instanceMatrix&&(Me=b.instanceMatrix),te==="instanceColor"&&b.instanceColor&&(Me=b.instanceColor));const Ze={};Ze.attribute=Me,Me&&Me.data&&(Ze.data=Me.data),Z[te]=Ze,Y++}a.attributes=Z,a.attributesNum=Y,a.index=O}function _(){const b=a.newAttributes;for(let P=0,D=b.length;P<D;P++)b[P]=0}function g(b){f(b,0)}function f(b,P){const D=a.newAttributes,O=a.enabledAttributes,Z=a.attributeDivisors;D[b]=1,O[b]===0&&(n.enableVertexAttribArray(b),O[b]=1),Z[b]!==P&&(n.vertexAttribDivisor(b,P),Z[b]=P)}function y(){const b=a.newAttributes,P=a.enabledAttributes;for(let D=0,O=P.length;D<O;D++)P[D]!==b[D]&&(n.disableVertexAttribArray(D),P[D]=0)}function v(b,P,D,O,Z,ee,Y){Y===!0?n.vertexAttribIPointer(b,P,D,Z,ee):n.vertexAttribPointer(b,P,D,O,Z,ee)}function M(b,P,D,O){_();const Z=O.attributes,ee=D.getAttributes(),Y=P.defaultAttributeValues;for(const J in ee){const te=ee[J];if(te.location>=0){let pe=Z[J];if(pe===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),pe!==void 0){const Me=pe.normalized,Ze=pe.itemSize,I=e.get(pe);if(I===void 0)continue;const De=I.buffer,Se=I.type,Ie=I.bytesPerElement,$=Se===n.INT||Se===n.UNSIGNED_INT||pe.gpuType===Qh;if(pe.isInterleavedBufferAttribute){const K=pe.data,Ae=K.stride,Fe=pe.offset;if(K.isInstancedInterleavedBuffer){for(let Be=0;Be<te.locationSize;Be++)f(te.location+Be,K.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Be=0;Be<te.locationSize;Be++)g(te.location+Be);n.bindBuffer(n.ARRAY_BUFFER,De);for(let Be=0;Be<te.locationSize;Be++)v(te.location+Be,Ze/te.locationSize,Se,Me,Ae*Ie,(Fe+Ze/te.locationSize*Be)*Ie,$)}else{if(pe.isInstancedBufferAttribute){for(let K=0;K<te.locationSize;K++)f(te.location+K,pe.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let K=0;K<te.locationSize;K++)g(te.location+K);n.bindBuffer(n.ARRAY_BUFFER,De);for(let K=0;K<te.locationSize;K++)v(te.location+K,Ze/te.locationSize,Se,Me,Ze*Ie,Ze/te.locationSize*K*Ie,$)}}else if(Y!==void 0){const Me=Y[J];if(Me!==void 0)switch(Me.length){case 2:n.vertexAttrib2fv(te.location,Me);break;case 3:n.vertexAttrib3fv(te.location,Me);break;case 4:n.vertexAttrib4fv(te.location,Me);break;default:n.vertexAttrib1fv(te.location,Me)}}}}y()}function E(){A();for(const b in i){const P=i[b];for(const D in P){const O=P[D];for(const Z in O)d(O[Z].object),delete O[Z];delete P[D]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const D in P){const O=P[D];for(const Z in O)d(O[Z].object),delete O[Z];delete P[D]}delete i[b.id]}function C(b){for(const P in i){const D=i[P];if(D[b.id]===void 0)continue;const O=D[b.id];for(const Z in O)d(O[Z].object),delete O[Z];delete D[b.id]}}function A(){w(),r=!0,a!==s&&(a=s,h(a.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function L2(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,u){u!==0&&(n.drawArraysInstanced(i,h,d,u),t.update(d,i,u))}function o(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,u);let p=0;for(let x=0;x<u;x++)p+=d[x];t.update(p,i,1)}function c(h,d,u,m){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<h.length;x++)r(h[x],d[x],m[x]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,d,0,m,0,u);let x=0;for(let _=0;_<u;_++)x+=d[_]*m[_];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function D2(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==bi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const A=C===Bi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==qi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==zi&&!A)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(wt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:E,maxSamples:S}}function I2(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Gs,o=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,m){const p=u.length!==0||m||i!==0||s;return s=m,i=u.length,p},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,m){t=d(u,m,0)},this.setState=function(u,m,p){const x=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let M=f.clippingState||null;c.value=M,M=d(x,m,v,p);for(let E=0;E!==v;++E)M[E]=t[E];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,m,p,x){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=c.value,x!==!0||g===null){const f=p+_*4,y=m.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,M=p;v!==_;++v,M+=4)r.copy(u[v]).applyMatrix4(y,o),r.normal.toArray(g,M),g[M+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function F2(n){let e=new WeakMap;function t(r,o){return o===Kc?r.mapping=qa:o===Jc&&(r.mapping=Ya),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Kc||o===Jc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new jm(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const ws=4,Uu=[.125,.215,.35,.446,.526,.582],qs=20,U2=512,_r=new yd,zu=new at;let Sc=null,Tc=0,Ec=0,Ac=!1;const z2=new L;class Dh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=z2}=a;Sc=this._renderer.getRenderTarget(),Tc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ou(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ku(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Sc,Tc,Ec),this._renderer.xr.enabled=Ac,e.scissorTest=!1,Pa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qa||e.mapping===Ya?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sc=this._renderer.getRenderTarget(),Tc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ci,minFilter:ci,generateMipmaps:!1,type:Bi,format:bi,colorSpace:$a,depthBuffer:!1},s=Nu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nu(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=N2(a)),this._blurMaterial=O2(a,e,t)}return s}_compileMaterial(e){const t=new U(new sn,e);this._renderer.compile(t,_r)}_sceneToCubeUV(e,t,i,s,a){const c=new jn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,m=u.autoClear,p=u.toneMapping;u.getClearColor(zu),u.toneMapping=Es,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new U(new re,new Ct({name:"PMREM.Background",side:zn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let f=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,f=!0):(g.color.copy(zu),f=!0);for(let v=0;v<6;v++){const M=v%3;M===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):M===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;Pa(s,M*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(_,c),u.render(e,c)}u.toneMapping=p,u.autoClear=m,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===qa||e.mapping===Ya;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ou()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ku());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;Pa(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,_r)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=k2(this._lodMax,y,v)}const r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-d*d),m=.05+h*.95,p=u*m,{_lodMax:x}=this,_=this._sizeLods[i],g=3*_*(i>x-ws?i-x+ws:0),f=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,Pa(a,g,f,3*_,2*_),s.setRenderTarget(a),s.render(o,_r),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,Pa(e,g,f,3*_,2*_),s.setRenderTarget(e),s.render(o,_r)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&hn("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=h;const m=h.uniforms,p=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*qs-1),_=a/x,g=isFinite(a)?1+Math.floor(d*_):qs;g>qs&&wt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${qs}`);const f=[];let y=0;for(let C=0;C<qs;++C){const A=C/_,w=Math.exp(-A*A/2);f.push(w),C===0?y+=w:C<g&&(y+=2*w)}for(let C=0;C<f.length;C++)f[C]=f[C]/y;m.envMap.value=e.texture,m.samples.value=g,m.weights.value=f,m.latitudinal.value=r==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:v}=this;m.dTheta.value=x,m.mipInt.value=v-i;const M=this._sizeLods[s],E=3*M*(s>v-ws?s-v+ws:0),S=4*(this._cubeSize-M);Pa(t,E,S,3*M,2*M),c.setRenderTarget(t),c.render(u,_r)}}function N2(n){const e=[],t=[],i=[];let s=n;const a=n-ws+1+Uu.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-ws?c=Uu[r-n+ws-1]:r===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,u=1+h,m=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,x=6,_=3,g=2,f=1,y=new Float32Array(_*x*p),v=new Float32Array(g*x*p),M=new Float32Array(f*x*p);for(let S=0;S<p;S++){const C=S%3*2/3-1,A=S>2?0:-1,w=[C,A,0,C+2/3,A,0,C+2/3,A+1,0,C,A,0,C+2/3,A+1,0,C,A+1,0];y.set(w,_*x*S),v.set(m,g*x*S);const b=[S,S,S,S,S,S];M.set(b,f*x*S)}const E=new sn;E.setAttribute("position",new ti(y,_)),E.setAttribute("uv",new ti(v,g)),E.setAttribute("faceIndex",new ti(M,f)),i.push(new U(E,null)),s>ws&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Nu(n,e,t){const i=new Si(n,e,t);return i.texture.mapping=Dl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Pa(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function k2(n,e,t){return new An({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:U2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Nl(),fragmentShader:`

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
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function O2(n,e,t){const i=new Float32Array(qs),s=new L(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:qs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Nl(),fragmentShader:`

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
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function ku(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nl(),fragmentShader:`

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
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function Ou(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function Nl(){return`

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
	`}function B2(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===Kc||c===Jc,d=c===qa||c===Ya;if(h||d){let u=e.get(o);const m=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new Dh(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return h&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new Dh(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function a(o){const c=o.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function V2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Gr("WebGLRenderer: "+i+" extension not supported."),s}}}function G2(n,e,t,i){const s={},a=new WeakMap;function r(u){const m=u.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);m.removeEventListener("dispose",r),delete s[m.id];const p=a.get(m);p&&(e.remove(p),a.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(u,m){return s[m.id]===!0||(m.addEventListener("dispose",r),s[m.id]=!0,t.memory.geometries++),m}function c(u){const m=u.attributes;for(const p in m)e.update(m[p],n.ARRAY_BUFFER)}function h(u){const m=[],p=u.index,x=u.attributes.position;let _=0;if(p!==null){const y=p.array;_=p.version;for(let v=0,M=y.length;v<M;v+=3){const E=y[v+0],S=y[v+1],C=y[v+2];m.push(E,S,S,C,C,E)}}else if(x!==void 0){const y=x.array;_=x.version;for(let v=0,M=y.length/3-1;v<M;v+=3){const E=v+0,S=v+1,C=v+2;m.push(E,S,S,C,C,E)}}else return;const g=new(Y0(m)?J0:K0)(m,1);g.version=_;const f=a.get(u);f&&e.remove(f),a.set(u,g)}function d(u){const m=a.get(u);if(m){const p=u.index;p!==null&&m.version<p.version&&h(u)}else h(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function H2(n,e,t){let i;function s(m){i=m}let a,r;function o(m){a=m.type,r=m.bytesPerElement}function c(m,p){n.drawElements(i,p,a,m*r),t.update(p,i,1)}function h(m,p,x){x!==0&&(n.drawElementsInstanced(i,p,a,m*r,x),t.update(p,i,x))}function d(m,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,a,m,0,x);let g=0;for(let f=0;f<x;f++)g+=p[f];t.update(g,i,1)}function u(m,p,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<m.length;f++)h(m[f]/r,p[f],_[f]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,a,m,0,_,0,x);let f=0;for(let y=0;y<x;y++)f+=p[y]*_[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function W2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:hn("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function X2(n,e,t){const i=new WeakMap,s=new tn;function a(r,o,c){const h=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let m=i.get(o);if(m===void 0||m.count!==u){let b=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var p=b;m!==void 0&&m.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;x===!0&&(M=1),_===!0&&(M=2),g===!0&&(M=3);let E=o.attributes.position.count*M,S=1;E>e.maxTextureSize&&(S=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const C=new Float32Array(E*S*4*u),A=new $0(C,E,S,u);A.type=zi,A.needsUpdate=!0;const w=M*4;for(let P=0;P<u;P++){const D=f[P],O=y[P],Z=v[P],ee=E*S*4*P;for(let Y=0;Y<D.count;Y++){const J=Y*w;x===!0&&(s.fromBufferAttribute(D,Y),C[ee+J+0]=s.x,C[ee+J+1]=s.y,C[ee+J+2]=s.z,C[ee+J+3]=0),_===!0&&(s.fromBufferAttribute(O,Y),C[ee+J+4]=s.x,C[ee+J+5]=s.y,C[ee+J+6]=s.z,C[ee+J+7]=0),g===!0&&(s.fromBufferAttribute(Z,Y),C[ee+J+8]=s.x,C[ee+J+9]=s.y,C[ee+J+10]=s.z,C[ee+J+11]=Z.itemSize===4?s.w:1)}}m={count:u,texture:A,size:new Ne(E,S)},i.set(o,m),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const _=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:a}}function q2(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return u}function r(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const vf=new Nn,Bu=new af(1,1),Mf=new $0,_f=new zm,yf=new ef,Vu=[],Gu=[],Hu=new Float32Array(16),Wu=new Float32Array(9),Xu=new Float32Array(4);function tr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Vu[s];if(a===void 0&&(a=new Float32Array(s),Vu[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function wn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Sn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function kl(n,e){let t=Gu[e];t===void 0&&(t=new Int32Array(e),Gu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Y2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function $2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2fv(this.addr,e),Sn(t,e)}}function Z2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wn(t,e))return;n.uniform3fv(this.addr,e),Sn(t,e)}}function K2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4fv(this.addr,e),Sn(t,e)}}function J2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Sn(t,e)}else{if(wn(t,i))return;Xu.set(i),n.uniformMatrix2fv(this.addr,!1,Xu),Sn(t,i)}}function j2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Sn(t,e)}else{if(wn(t,i))return;Wu.set(i),n.uniformMatrix3fv(this.addr,!1,Wu),Sn(t,i)}}function Q2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Sn(t,e)}else{if(wn(t,i))return;Hu.set(i),n.uniformMatrix4fv(this.addr,!1,Hu),Sn(t,i)}}function ev(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function tv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2iv(this.addr,e),Sn(t,e)}}function nv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wn(t,e))return;n.uniform3iv(this.addr,e),Sn(t,e)}}function iv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4iv(this.addr,e),Sn(t,e)}}function sv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function av(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2uiv(this.addr,e),Sn(t,e)}}function rv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wn(t,e))return;n.uniform3uiv(this.addr,e),Sn(t,e)}}function ov(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4uiv(this.addr,e),Sn(t,e)}}function lv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Bu.compareFunction=q0,a=Bu):a=vf,t.setTexture2D(e||a,s)}function cv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||_f,s)}function hv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||yf,s)}function dv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Mf,s)}function uv(n){switch(n){case 5126:return Y2;case 35664:return $2;case 35665:return Z2;case 35666:return K2;case 35674:return J2;case 35675:return j2;case 35676:return Q2;case 5124:case 35670:return ev;case 35667:case 35671:return tv;case 35668:case 35672:return nv;case 35669:case 35673:return iv;case 5125:return sv;case 36294:return av;case 36295:return rv;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return lv;case 35679:case 36299:case 36307:return cv;case 35680:case 36300:case 36308:case 36293:return hv;case 36289:case 36303:case 36311:case 36292:return dv}}function fv(n,e){n.uniform1fv(this.addr,e)}function pv(n,e){const t=tr(e,this.size,2);n.uniform2fv(this.addr,t)}function mv(n,e){const t=tr(e,this.size,3);n.uniform3fv(this.addr,t)}function xv(n,e){const t=tr(e,this.size,4);n.uniform4fv(this.addr,t)}function gv(n,e){const t=tr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function vv(n,e){const t=tr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Mv(n,e){const t=tr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function _v(n,e){n.uniform1iv(this.addr,e)}function yv(n,e){n.uniform2iv(this.addr,e)}function bv(n,e){n.uniform3iv(this.addr,e)}function wv(n,e){n.uniform4iv(this.addr,e)}function Sv(n,e){n.uniform1uiv(this.addr,e)}function Tv(n,e){n.uniform2uiv(this.addr,e)}function Ev(n,e){n.uniform3uiv(this.addr,e)}function Av(n,e){n.uniform4uiv(this.addr,e)}function Cv(n,e,t){const i=this.cache,s=e.length,a=kl(t,s);wn(i,a)||(n.uniform1iv(this.addr,a),Sn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||vf,a[r])}function Rv(n,e,t){const i=this.cache,s=e.length,a=kl(t,s);wn(i,a)||(n.uniform1iv(this.addr,a),Sn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||_f,a[r])}function Pv(n,e,t){const i=this.cache,s=e.length,a=kl(t,s);wn(i,a)||(n.uniform1iv(this.addr,a),Sn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||yf,a[r])}function Lv(n,e,t){const i=this.cache,s=e.length,a=kl(t,s);wn(i,a)||(n.uniform1iv(this.addr,a),Sn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Mf,a[r])}function Dv(n){switch(n){case 5126:return fv;case 35664:return pv;case 35665:return mv;case 35666:return xv;case 35674:return gv;case 35675:return vv;case 35676:return Mv;case 5124:case 35670:return _v;case 35667:case 35671:return yv;case 35668:case 35672:return bv;case 35669:case 35673:return wv;case 5125:return Sv;case 36294:return Tv;case 36295:return Ev;case 36296:return Av;case 35678:case 36198:case 36298:case 36306:case 35682:return Cv;case 35679:case 36299:case 36307:return Rv;case 35680:case 36300:case 36308:case 36293:return Pv;case 36289:case 36303:case 36311:case 36292:return Lv}}class Iv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=uv(t.type)}}class Fv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dv(t.type)}}class Uv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const Cc=/(\w+)(\])?(\[|\.)?/g;function qu(n,e){n.seq.push(e),n.map[e.id]=e}function zv(n,e,t){const i=n.name,s=i.length;for(Cc.lastIndex=0;;){const a=Cc.exec(i),r=Cc.lastIndex;let o=a[1];const c=a[2]==="]",h=a[3];if(c&&(o=o|0),h===void 0||h==="["&&r+2===s){qu(t,h===void 0?new Iv(o,n,e):new Fv(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Uv(o),qu(t,u)),t=u}}}class rl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);zv(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Yu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Nv=37297;let kv=0;function Ov(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const $u=new It;function Bv(n){Gt._getMatrix($u,Gt.workingColorSpace,n);const e=`mat3( ${$u.elements.map(t=>t.toFixed(4))} )`;switch(Gt.getTransfer(n)){case dl:return[e,"LinearTransferOETF"];case jt:return[e,"sRGBTransferOETF"];default:return wt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Zu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Ov(n.getShaderSource(e),o)}else return a}function Vv(n,e){const t=Bv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Gv(n,e){let t;switch(e){case I0:t="Linear";break;case F0:t="Reinhard";break;case U0:t="Cineon";break;case jh:t="ACESFilmic";break;case N0:t="AgX";break;case k0:t="Neutral";break;case z0:t="Custom";break;default:wt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Vo=new L;function Hv(){Gt.getLuminanceCoefficients(Vo);const n=Vo.x.toFixed(4),e=Vo.y.toFixed(4),t=Vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sr).join(`
`)}function Xv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function qv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function Sr(n){return n!==""}function Ku(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ju(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ih(n){return n.replace(Yv,Zv)}const $v=new Map;function Zv(n,e){let t=Ft[e];if(t===void 0){const i=$v.get(e);if(i!==void 0)t=Ft[i],wt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ih(t)}const Kv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ju(n){return n.replace(Kv,Jv)}function Jv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Qu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function jv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===L0?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===D0?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ts&&(e="SHADOWMAP_TYPE_VSM"),e}function Qv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qa:case Ya:e="ENVMAP_TYPE_CUBE";break;case Dl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function eM(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Ya&&(e="ENVMAP_MODE_REFRACTION"),e}function tM(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Jh:e="ENVMAP_BLENDING_MULTIPLY";break;case em:e="ENVMAP_BLENDING_MIX";break;case tm:e="ENVMAP_BLENDING_ADD";break}return e}function nM(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function iM(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=jv(t),h=Qv(t),d=eM(t),u=tM(t),m=nM(t),p=Wv(t),x=Xv(a),_=s.createProgram();let g,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Sr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Sr).join(`
`),f.length>0&&(f+=`
`)):(g=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sr).join(`
`),f=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Es?"#define TONE_MAPPING":"",t.toneMapping!==Es?Ft.tonemapping_pars_fragment:"",t.toneMapping!==Es?Gv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ft.colorspace_pars_fragment,Vv("linearToOutputTexel",t.outputColorSpace),Hv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sr).join(`
`)),r=Ih(r),r=Ku(r,t),r=Ju(r,t),o=Ih(o),o=Ku(o,t),o=Ju(o,t),r=ju(r),o=ju(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Kd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Kd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+g+r,M=y+f+o,E=Yu(s,s.VERTEX_SHADER,v),S=Yu(s,s.FRAGMENT_SHADER,M);s.attachShader(_,E),s.attachShader(_,S),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(P){if(n.debug.checkShaderErrors){const D=s.getProgramInfoLog(_)||"",O=s.getShaderInfoLog(E)||"",Z=s.getShaderInfoLog(S)||"",ee=D.trim(),Y=O.trim(),J=Z.trim();let te=!0,pe=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(te=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,E,S);else{const Me=Zu(s,E,"vertex"),Ze=Zu(s,S,"fragment");hn("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+ee+`
`+Me+`
`+Ze)}else ee!==""?wt("WebGLProgram: Program Info Log:",ee):(Y===""||J==="")&&(pe=!1);pe&&(P.diagnostics={runnable:te,programLog:ee,vertexShader:{log:Y,prefix:g},fragmentShader:{log:J,prefix:f}})}s.deleteShader(E),s.deleteShader(S),A=new rl(s,_),w=qv(s,_)}let A;this.getUniforms=function(){return A===void 0&&C(this),A};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,Nv)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=kv++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=S,this}let sM=0;class aM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new rM(e),t.set(e,i)),i}}class rM{constructor(e){this.id=sM++,this.code=e,this.usedTimes=0}}function oM(n,e,t,i,s,a,r){const o=new dd,c=new aM,h=new Set,d=[],u=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return h.add(w),w===0?"uv":`uv${w}`}function g(w,b,P,D,O){const Z=D.fog,ee=O.geometry,Y=w.isMeshStandardMaterial?D.environment:null,J=(w.isMeshStandardMaterial?t:e).get(w.envMap||Y),te=J&&J.mapping===Dl?J.image.height:null,pe=x[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&wt("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const Me=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,Ze=Me!==void 0?Me.length:0;let I=0;ee.morphAttributes.position!==void 0&&(I=1),ee.morphAttributes.normal!==void 0&&(I=2),ee.morphAttributes.color!==void 0&&(I=3);let De,Se,Ie,$;if(pe){const Bt=Di[pe];De=Bt.vertexShader,Se=Bt.fragmentShader}else De=w.vertexShader,Se=w.fragmentShader,c.update(w),Ie=c.getVertexShaderID(w),$=c.getFragmentShaderID(w);const K=n.getRenderTarget(),Ae=n.state.buffers.depth.getReversed(),Fe=O.isInstancedMesh===!0,Be=O.isBatchedMesh===!0,nt=!!w.map,qt=!!w.matcap,rt=!!J,Wt=!!w.aoMap,V=!!w.lightMap,Pt=!!w.bumpMap,Et=!!w.normalMap,Xt=!!w.displacementMap,Qe=!!w.emissiveMap,Zt=!!w.metalnessMap,ot=!!w.roughnessMap,St=w.anisotropy>0,F=w.clearcoat>0,R=w.dispersion>0,j=w.iridescence>0,de=w.sheen>0,ve=w.transmission>0,se=St&&!!w.anisotropyMap,et=F&&!!w.clearcoatMap,ze=F&&!!w.clearcoatNormalMap,it=F&&!!w.clearcoatRoughnessMap,$e=j&&!!w.iridescenceMap,ye=j&&!!w.iridescenceThicknessMap,Ue=de&&!!w.sheenColorMap,pt=de&&!!w.sheenRoughnessMap,ht=!!w.specularMap,qe=!!w.specularColorMap,gt=!!w.specularIntensityMap,H=ve&&!!w.transmissionMap,He=ve&&!!w.thicknessMap,Oe=!!w.gradientMap,ke=!!w.alphaMap,Ce=w.alphaTest>0,me=!!w.alphaHash,Je=!!w.extensions;let Mt=Es;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Mt=n.toneMapping);const Yt={shaderID:pe,shaderType:w.type,shaderName:w.name,vertexShader:De,fragmentShader:Se,defines:w.defines,customVertexShaderID:Ie,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Be,batchingColor:Be&&O._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&O.instanceColor!==null,instancingMorph:Fe&&O.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:$a,alphaToCoverage:!!w.alphaToCoverage,map:nt,matcap:qt,envMap:rt,envMapMode:rt&&J.mapping,envMapCubeUVHeight:te,aoMap:Wt,lightMap:V,bumpMap:Pt,normalMap:Et,displacementMap:m&&Xt,emissiveMap:Qe,normalMapObjectSpace:Et&&w.normalMapType===am,normalMapTangentSpace:Et&&w.normalMapType===od,metalnessMap:Zt,roughnessMap:ot,anisotropy:St,anisotropyMap:se,clearcoat:F,clearcoatMap:et,clearcoatNormalMap:ze,clearcoatRoughnessMap:it,dispersion:R,iridescence:j,iridescenceMap:$e,iridescenceThicknessMap:ye,sheen:de,sheenColorMap:Ue,sheenRoughnessMap:pt,specularMap:ht,specularColorMap:qe,specularIntensityMap:gt,transmission:ve,transmissionMap:H,thicknessMap:He,gradientMap:Oe,opaque:w.transparent===!1&&w.blending===Oa&&w.alphaToCoverage===!1,alphaMap:ke,alphaTest:Ce,alphaHash:me,combine:w.combine,mapUv:nt&&_(w.map.channel),aoMapUv:Wt&&_(w.aoMap.channel),lightMapUv:V&&_(w.lightMap.channel),bumpMapUv:Pt&&_(w.bumpMap.channel),normalMapUv:Et&&_(w.normalMap.channel),displacementMapUv:Xt&&_(w.displacementMap.channel),emissiveMapUv:Qe&&_(w.emissiveMap.channel),metalnessMapUv:Zt&&_(w.metalnessMap.channel),roughnessMapUv:ot&&_(w.roughnessMap.channel),anisotropyMapUv:se&&_(w.anisotropyMap.channel),clearcoatMapUv:et&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:ze&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:$e&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:pt&&_(w.sheenRoughnessMap.channel),specularMapUv:ht&&_(w.specularMap.channel),specularColorMapUv:qe&&_(w.specularColorMap.channel),specularIntensityMapUv:gt&&_(w.specularIntensityMap.channel),transmissionMapUv:H&&_(w.transmissionMap.channel),thicknessMapUv:He&&_(w.thicknessMap.channel),alphaMapUv:ke&&_(w.alphaMap.channel),vertexTangents:!!ee.attributes.tangent&&(Et||St),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!ee.attributes.uv&&(nt||ke),fog:!!Z,useFog:w.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ae,skinning:O.isSkinnedMesh===!0,morphTargets:ee.morphAttributes.position!==void 0,morphNormals:ee.morphAttributes.normal!==void 0,morphColors:ee.morphAttributes.color!==void 0,morphTargetsCount:Ze,morphTextureStride:I,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Mt,decodeVideoTexture:nt&&w.map.isVideoTexture===!0&&Gt.getTransfer(w.map.colorSpace)===jt,decodeVideoTextureEmissive:Qe&&w.emissiveMap.isVideoTexture===!0&&Gt.getTransfer(w.emissiveMap.colorSpace)===jt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===At,flipSided:w.side===zn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Je&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&w.extensions.multiDraw===!0||Be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Yt.vertexUv1s=h.has(1),Yt.vertexUv2s=h.has(2),Yt.vertexUv3s=h.has(3),h.clear(),Yt}function f(w){const b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)b.push(P),b.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(y(b,w),v(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function y(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function v(w,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),w.push(o.mask)}function M(w){const b=x[w.type];let P;if(b){const D=Di[b];P=Wr.clone(D.uniforms)}else P=w.uniforms;return P}function E(w,b){let P;for(let D=0,O=d.length;D<O;D++){const Z=d[D];if(Z.cacheKey===b){P=Z,++P.usedTimes;break}}return P===void 0&&(P=new iM(n,b,w,a),d.push(P)),P}function S(w){if(--w.usedTimes===0){const b=d.indexOf(w);d[b]=d[d.length-1],d.pop(),w.destroy()}}function C(w){c.remove(w)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:M,acquireProgram:E,releaseProgram:S,releaseShaderCache:C,programs:d,dispose:A}}function lM(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function cM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function e0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function t0(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,m,p,x,_,g){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:m,material:p,groupOrder:x,renderOrder:u.renderOrder,z:_,group:g},n[e]=f):(f.id=u.id,f.object=u,f.geometry=m,f.material=p,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=_,f.group=g),e++,f}function o(u,m,p,x,_,g){const f=r(u,m,p,x,_,g);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(u,m,p,x,_,g){const f=r(u,m,p,x,_,g);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,m){t.length>1&&t.sort(u||cM),i.length>1&&i.sort(m||e0),s.length>1&&s.sort(m||e0)}function d(){for(let u=e,m=n.length;u<m;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:h}}function hM(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new t0,n.set(i,[r])):s>=a.length?(r=new t0,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function dM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new at};break;case"SpotLight":t={position:new L,direction:new L,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new at,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new at,groundColor:new at};break;case"RectAreaLight":t={color:new at,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function uM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let fM=0;function pM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function mM(n){const e=new dM,t=uM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new L);const s=new L,a=new Tt,r=new Tt;function o(h){let d=0,u=0,m=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,x=0,_=0,g=0,f=0,y=0,v=0,M=0,E=0,S=0,C=0;h.sort(pM);for(let w=0,b=h.length;w<b;w++){const P=h[w],D=P.color,O=P.intensity,Z=P.distance,ee=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=D.r*O,u+=D.g*O,m+=D.b*O;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(P.sh.coefficients[Y],O);C++}else if(P.isDirectionalLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,te=t.get(P);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,i.directionalShadow[p]=te,i.directionalShadowMap[p]=ee,i.directionalShadowMatrix[p]=P.shadow.matrix,y++}i.directional[p]=Y,p++}else if(P.isSpotLight){const Y=e.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(D).multiplyScalar(O),Y.distance=Z,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,i.spot[_]=Y;const J=P.shadow;if(P.map&&(i.spotLightMap[E]=P.map,E++,J.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=J.matrix,P.castShadow){const te=t.get(P);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,i.spotShadow[_]=te,i.spotShadowMap[_]=ee,M++}_++}else if(P.isRectAreaLight){const Y=e.get(P);Y.color.copy(D).multiplyScalar(O),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=Y,g++}else if(P.isPointLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const J=P.shadow,te=t.get(P);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,te.shadowCameraNear=J.camera.near,te.shadowCameraFar=J.camera.far,i.pointShadow[x]=te,i.pointShadowMap[x]=ee,i.pointShadowMatrix[x]=P.shadow.matrix,v++}i.point[x]=Y,x++}else if(P.isHemisphereLight){const Y=e.get(P);Y.skyColor.copy(P.color).multiplyScalar(O),Y.groundColor.copy(P.groundColor).multiplyScalar(O),i.hemi[f]=Y,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=We.LTC_FLOAT_1,i.rectAreaLTC2=We.LTC_FLOAT_2):(i.rectAreaLTC1=We.LTC_HALF_1,i.rectAreaLTC2=We.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=m;const A=i.hash;(A.directionalLength!==p||A.pointLength!==x||A.spotLength!==_||A.rectAreaLength!==g||A.hemiLength!==f||A.numDirectionalShadows!==y||A.numPointShadows!==v||A.numSpotShadows!==M||A.numSpotMaps!==E||A.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+E-S,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=C,A.directionalLength=p,A.pointLength=x,A.spotLength=_,A.rectAreaLength=g,A.hemiLength=f,A.numDirectionalShadows=y,A.numPointShadows=v,A.numSpotShadows=M,A.numSpotMaps=E,A.numLightProbes=C,i.version=fM++)}function c(h,d){let u=0,m=0,p=0,x=0,_=0;const g=d.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){const v=h[f];if(v.isDirectionalLight){const M=i.directional[u];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),u++}else if(v.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),p++}else if(v.isRectAreaLight){const M=i.rectArea[x];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const M=i.point[m];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),m++}else if(v.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:i}}function n0(n){const e=new mM(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function xM(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new n0(n),e.set(s,[o])):a>=r.length?(o=new n0(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const gM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vM=`uniform sampler2D shadow_pass;
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
}`;function MM(n,e,t){let i=new fd;const s=new Ne,a=new Ne,r=new tn,o=new Bx({depthPacking:sm}),c=new Vx,h={},d=t.maxTextureSize,u={[Rs]:zn,[zn]:Rs,[At]:At},m=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:gM,fragmentShader:vM}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const x=new sn;x.setAttribute("position",new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new U(x,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=L0;let f=this.type;this.render=function(S,C,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),D=n.state;D.setBlending(Oi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const O=f!==ts&&this.type===ts,Z=f===ts&&this.type!==ts;for(let ee=0,Y=S.length;ee<Y;ee++){const J=S[ee],te=J.shadow;if(te===void 0){wt("WebGLShadowMap:",J,"has no shadow.");continue}if(te.autoUpdate===!1&&te.needsUpdate===!1)continue;s.copy(te.mapSize);const pe=te.getFrameExtents();if(s.multiply(pe),a.copy(te.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/pe.x),s.x=a.x*pe.x,te.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/pe.y),s.y=a.y*pe.y,te.mapSize.y=a.y)),te.map===null||O===!0||Z===!0){const Ze=this.type!==ts?{minFilter:ei,magFilter:ei}:{};te.map!==null&&te.map.dispose(),te.map=new Si(s.x,s.y,Ze),te.map.texture.name=J.name+".shadowMap",te.camera.updateProjectionMatrix()}n.setRenderTarget(te.map),n.clear();const Me=te.getViewportCount();for(let Ze=0;Ze<Me;Ze++){const I=te.getViewport(Ze);r.set(a.x*I.x,a.y*I.y,a.x*I.z,a.y*I.w),D.viewport(r),te.updateMatrices(J,Ze),i=te.getFrustum(),M(C,A,te.camera,J,this.type)}te.isPointLightShadow!==!0&&this.type===ts&&y(te,A),te.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(w,b,P)};function y(S,C){const A=e.update(_);m.defines.VSM_SAMPLES!==S.blurSamples&&(m.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Si(s.x,s.y)),m.uniforms.shadow_pass.value=S.map.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(C,null,A,m,_,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(C,null,A,p,_,null)}function v(S,C,A,w){let b=null;const P=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)b=P;else if(b=A.isPointLight===!0?c:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const D=b.uuid,O=C.uuid;let Z=h[D];Z===void 0&&(Z={},h[D]=Z);let ee=Z[O];ee===void 0&&(ee=b.clone(),Z[O]=ee,C.addEventListener("dispose",E)),b=ee}if(b.visible=C.visible,b.wireframe=C.wireframe,w===ts?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const D=n.properties.get(b);D.light=A}return b}function M(S,C,A,w,b){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===ts)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const O=e.update(S),Z=S.material;if(Array.isArray(Z)){const ee=O.groups;for(let Y=0,J=ee.length;Y<J;Y++){const te=ee[Y],pe=Z[te.materialIndex];if(pe&&pe.visible){const Me=v(S,pe,w,b);S.onBeforeShadow(n,S,C,A,O,Me,te),n.renderBufferDirect(A,null,O,Me,S,te),S.onAfterShadow(n,S,C,A,O,Me,te)}}}else if(Z.visible){const ee=v(S,Z,w,b);S.onBeforeShadow(n,S,C,A,O,ee,null),n.renderBufferDirect(A,null,O,ee,S,null),S.onAfterShadow(n,S,C,A,O,ee,null)}}const D=S.children;for(let O=0,Z=D.length;O<Z;O++)M(D[O],C,A,w,b)}function E(S){S.target.removeEventListener("dispose",E);for(const A in h){const w=h[A],b=S.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}const _M={[Hc]:Wc,[Xc]:$c,[qc]:Zc,[Xa]:Yc,[Wc]:Hc,[$c]:Xc,[Zc]:qc,[Yc]:Xa};function yM(n,e){function t(){let H=!1;const He=new tn;let Oe=null;const ke=new tn(0,0,0,0);return{setMask:function(Ce){Oe!==Ce&&!H&&(n.colorMask(Ce,Ce,Ce,Ce),Oe=Ce)},setLocked:function(Ce){H=Ce},setClear:function(Ce,me,Je,Mt,Yt){Yt===!0&&(Ce*=Mt,me*=Mt,Je*=Mt),He.set(Ce,me,Je,Mt),ke.equals(He)===!1&&(n.clearColor(Ce,me,Je,Mt),ke.copy(He))},reset:function(){H=!1,Oe=null,ke.set(-1,0,0,0)}}}function i(){let H=!1,He=!1,Oe=null,ke=null,Ce=null;return{setReversed:function(me){if(He!==me){const Je=e.get("EXT_clip_control");me?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),He=me;const Mt=Ce;Ce=null,this.setClear(Mt)}},getReversed:function(){return He},setTest:function(me){me?K(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(me){Oe!==me&&!H&&(n.depthMask(me),Oe=me)},setFunc:function(me){if(He&&(me=_M[me]),ke!==me){switch(me){case Hc:n.depthFunc(n.NEVER);break;case Wc:n.depthFunc(n.ALWAYS);break;case Xc:n.depthFunc(n.LESS);break;case Xa:n.depthFunc(n.LEQUAL);break;case qc:n.depthFunc(n.EQUAL);break;case Yc:n.depthFunc(n.GEQUAL);break;case $c:n.depthFunc(n.GREATER);break;case Zc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ke=me}},setLocked:function(me){H=me},setClear:function(me){Ce!==me&&(He&&(me=1-me),n.clearDepth(me),Ce=me)},reset:function(){H=!1,Oe=null,ke=null,Ce=null,He=!1}}}function s(){let H=!1,He=null,Oe=null,ke=null,Ce=null,me=null,Je=null,Mt=null,Yt=null;return{setTest:function(Bt){H||(Bt?K(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(Bt){He!==Bt&&!H&&(n.stencilMask(Bt),He=Bt)},setFunc:function(Bt,Bn,Pn){(Oe!==Bt||ke!==Bn||Ce!==Pn)&&(n.stencilFunc(Bt,Bn,Pn),Oe=Bt,ke=Bn,Ce=Pn)},setOp:function(Bt,Bn,Pn){(me!==Bt||Je!==Bn||Mt!==Pn)&&(n.stencilOp(Bt,Bn,Pn),me=Bt,Je=Bn,Mt=Pn)},setLocked:function(Bt){H=Bt},setClear:function(Bt){Yt!==Bt&&(n.clearStencil(Bt),Yt=Bt)},reset:function(){H=!1,He=null,Oe=null,ke=null,Ce=null,me=null,Je=null,Mt=null,Yt=null}}}const a=new t,r=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},u={},m=new WeakMap,p=[],x=null,_=!1,g=null,f=null,y=null,v=null,M=null,E=null,S=null,C=new at(0,0,0),A=0,w=!1,b=null,P=null,D=null,O=null,Z=null;const ee=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,J=0;const te=n.getParameter(n.VERSION);te.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(te)[1]),Y=J>=1):te.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),Y=J>=2);let pe=null,Me={};const Ze=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),De=new tn().fromArray(Ze),Se=new tn().fromArray(I);function Ie(H,He,Oe,ke){const Ce=new Uint8Array(4),me=n.createTexture();n.bindTexture(H,me),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Je=0;Je<Oe;Je++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(He,0,n.RGBA,1,1,ke,0,n.RGBA,n.UNSIGNED_BYTE,Ce):n.texImage2D(He+Je,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ce);return me}const $={};$[n.TEXTURE_2D]=Ie(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Ie(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Ie(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Ie(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(Xa),Pt(!1),Et(qd),K(n.CULL_FACE),Wt(Oi);function K(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function Ae(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Fe(H,He){return u[H]!==He?(n.bindFramebuffer(H,He),u[H]=He,H===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=He),H===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=He),!0):!1}function Be(H,He){let Oe=p,ke=!1;if(H){Oe=m.get(He),Oe===void 0&&(Oe=[],m.set(He,Oe));const Ce=H.textures;if(Oe.length!==Ce.length||Oe[0]!==n.COLOR_ATTACHMENT0){for(let me=0,Je=Ce.length;me<Je;me++)Oe[me]=n.COLOR_ATTACHMENT0+me;Oe.length=Ce.length,ke=!0}}else Oe[0]!==n.BACK&&(Oe[0]=n.BACK,ke=!0);ke&&n.drawBuffers(Oe)}function nt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const qt={[Xs]:n.FUNC_ADD,[Np]:n.FUNC_SUBTRACT,[kp]:n.FUNC_REVERSE_SUBTRACT};qt[Op]=n.MIN,qt[Bp]=n.MAX;const rt={[Vp]:n.ZERO,[Gp]:n.ONE,[Hp]:n.SRC_COLOR,[Vc]:n.SRC_ALPHA,[Zp]:n.SRC_ALPHA_SATURATE,[Yp]:n.DST_COLOR,[Xp]:n.DST_ALPHA,[Wp]:n.ONE_MINUS_SRC_COLOR,[Gc]:n.ONE_MINUS_SRC_ALPHA,[$p]:n.ONE_MINUS_DST_COLOR,[qp]:n.ONE_MINUS_DST_ALPHA,[Kp]:n.CONSTANT_COLOR,[Jp]:n.ONE_MINUS_CONSTANT_COLOR,[jp]:n.CONSTANT_ALPHA,[Qp]:n.ONE_MINUS_CONSTANT_ALPHA};function Wt(H,He,Oe,ke,Ce,me,Je,Mt,Yt,Bt){if(H===Oi){_===!0&&(Ae(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),H!==zp){if(H!==g||Bt!==w){if((f!==Xs||M!==Xs)&&(n.blendEquation(n.FUNC_ADD),f=Xs,M=Xs),Bt)switch(H){case Oa:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case li:n.blendFunc(n.ONE,n.ONE);break;case Yd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $d:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:hn("WebGLState: Invalid blending: ",H);break}else switch(H){case Oa:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case li:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Yd:hn("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $d:hn("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:hn("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,S=null,C.set(0,0,0),A=0,g=H,w=Bt}return}Ce=Ce||He,me=me||Oe,Je=Je||ke,(He!==f||Ce!==M)&&(n.blendEquationSeparate(qt[He],qt[Ce]),f=He,M=Ce),(Oe!==y||ke!==v||me!==E||Je!==S)&&(n.blendFuncSeparate(rt[Oe],rt[ke],rt[me],rt[Je]),y=Oe,v=ke,E=me,S=Je),(Mt.equals(C)===!1||Yt!==A)&&(n.blendColor(Mt.r,Mt.g,Mt.b,Yt),C.copy(Mt),A=Yt),g=H,w=!1}function V(H,He){H.side===At?Ae(n.CULL_FACE):K(n.CULL_FACE);let Oe=H.side===zn;He&&(Oe=!Oe),Pt(Oe),H.blending===Oa&&H.transparent===!1?Wt(Oi):Wt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const ke=H.stencilWrite;o.setTest(ke),ke&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Qe(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function Et(H){H!==Fp?(K(n.CULL_FACE),H!==P&&(H===qd?n.cullFace(n.BACK):H===Up?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),P=H}function Xt(H){H!==D&&(Y&&n.lineWidth(H),D=H)}function Qe(H,He,Oe){H?(K(n.POLYGON_OFFSET_FILL),(O!==He||Z!==Oe)&&(n.polygonOffset(He,Oe),O=He,Z=Oe)):Ae(n.POLYGON_OFFSET_FILL)}function Zt(H){H?K(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+ee-1),pe!==H&&(n.activeTexture(H),pe=H)}function St(H,He,Oe){Oe===void 0&&(pe===null?Oe=n.TEXTURE0+ee-1:Oe=pe);let ke=Me[Oe];ke===void 0&&(ke={type:void 0,texture:void 0},Me[Oe]=ke),(ke.type!==H||ke.texture!==He)&&(pe!==Oe&&(n.activeTexture(Oe),pe=Oe),n.bindTexture(H,He||$[H]),ke.type=H,ke.texture=He)}function F(){const H=Me[pe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function R(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function de(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ve(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function se(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ze(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function it(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function $e(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ye(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ue(H){De.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),De.copy(H))}function pt(H){Se.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),Se.copy(H))}function ht(H,He){let Oe=h.get(He);Oe===void 0&&(Oe=new WeakMap,h.set(He,Oe));let ke=Oe.get(H);ke===void 0&&(ke=n.getUniformBlockIndex(He,H.name),Oe.set(H,ke))}function qe(H,He){const ke=h.get(He).get(H);c.get(He)!==ke&&(n.uniformBlockBinding(He,ke,H.__bindingPointIndex),c.set(He,ke))}function gt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},pe=null,Me={},u={},m=new WeakMap,p=[],x=null,_=!1,g=null,f=null,y=null,v=null,M=null,E=null,S=null,C=new at(0,0,0),A=0,w=!1,b=null,P=null,D=null,O=null,Z=null,De.set(0,0,n.canvas.width,n.canvas.height),Se.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:Ae,bindFramebuffer:Fe,drawBuffers:Be,useProgram:nt,setBlending:Wt,setMaterial:V,setFlipSided:Pt,setCullFace:Et,setLineWidth:Xt,setPolygonOffset:Qe,setScissorTest:Zt,activeTexture:ot,bindTexture:St,unbindTexture:F,compressedTexImage2D:R,compressedTexImage3D:j,texImage2D:$e,texImage3D:ye,updateUBOMapping:ht,uniformBlockBinding:qe,texStorage2D:ze,texStorage3D:it,texSubImage2D:de,texSubImage3D:ve,compressedTexSubImage2D:se,compressedTexSubImage3D:et,scissor:Ue,viewport:pt,reset:gt}}function bM(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ne,d=new WeakMap;let u;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(F,R){return p?new OffscreenCanvas(F,R):fl("canvas")}function _(F,R,j){let de=1;const ve=St(F);if((ve.width>j||ve.height>j)&&(de=j/Math.max(ve.width,ve.height)),de<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const se=Math.floor(de*ve.width),et=Math.floor(de*ve.height);u===void 0&&(u=x(se,et));const ze=R?x(se,et):u;return ze.width=se,ze.height=et,ze.getContext("2d").drawImage(F,0,0,se,et),wt("WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+se+"x"+et+")."),ze}else return"data"in F&&wt("WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),F;return F}function g(F){return F.generateMipmaps}function f(F){n.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(F,R,j,de,ve=!1){if(F!==null){if(n[F]!==void 0)return n[F];wt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let se=R;if(R===n.RED&&(j===n.FLOAT&&(se=n.R32F),j===n.HALF_FLOAT&&(se=n.R16F),j===n.UNSIGNED_BYTE&&(se=n.R8)),R===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(se=n.R8UI),j===n.UNSIGNED_SHORT&&(se=n.R16UI),j===n.UNSIGNED_INT&&(se=n.R32UI),j===n.BYTE&&(se=n.R8I),j===n.SHORT&&(se=n.R16I),j===n.INT&&(se=n.R32I)),R===n.RG&&(j===n.FLOAT&&(se=n.RG32F),j===n.HALF_FLOAT&&(se=n.RG16F),j===n.UNSIGNED_BYTE&&(se=n.RG8)),R===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(se=n.RG8UI),j===n.UNSIGNED_SHORT&&(se=n.RG16UI),j===n.UNSIGNED_INT&&(se=n.RG32UI),j===n.BYTE&&(se=n.RG8I),j===n.SHORT&&(se=n.RG16I),j===n.INT&&(se=n.RG32I)),R===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(se=n.RGB8UI),j===n.UNSIGNED_SHORT&&(se=n.RGB16UI),j===n.UNSIGNED_INT&&(se=n.RGB32UI),j===n.BYTE&&(se=n.RGB8I),j===n.SHORT&&(se=n.RGB16I),j===n.INT&&(se=n.RGB32I)),R===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(se=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(se=n.RGBA16UI),j===n.UNSIGNED_INT&&(se=n.RGBA32UI),j===n.BYTE&&(se=n.RGBA8I),j===n.SHORT&&(se=n.RGBA16I),j===n.INT&&(se=n.RGBA32I)),R===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(se=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(se=n.R11F_G11F_B10F)),R===n.RGBA){const et=ve?dl:Gt.getTransfer(de);j===n.FLOAT&&(se=n.RGBA32F),j===n.HALF_FLOAT&&(se=n.RGBA16F),j===n.UNSIGNED_BYTE&&(se=et===jt?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(se=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(se=n.RGB5_A1)}return(se===n.R16F||se===n.R32F||se===n.RG16F||se===n.RG32F||se===n.RGBA16F||se===n.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function M(F,R){let j;return F?R===null||R===sa||R===Or?j=n.DEPTH24_STENCIL8:R===zi?j=n.DEPTH32F_STENCIL8:R===kr&&(j=n.DEPTH24_STENCIL8,wt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===sa||R===Or?j=n.DEPTH_COMPONENT24:R===zi?j=n.DEPTH_COMPONENT32F:R===kr&&(j=n.DEPTH_COMPONENT16),j}function E(F,R){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==ei&&F.minFilter!==ci?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function S(F){const R=F.target;R.removeEventListener("dispose",S),A(R),R.isVideoTexture&&d.delete(R)}function C(F){const R=F.target;R.removeEventListener("dispose",C),b(R)}function A(F){const R=i.get(F);if(R.__webglInit===void 0)return;const j=F.source,de=m.get(j);if(de){const ve=de[R.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&w(F),Object.keys(de).length===0&&m.delete(j)}i.remove(F)}function w(F){const R=i.get(F);n.deleteTexture(R.__webglTexture);const j=F.source,de=m.get(j);delete de[R.__cacheKey],r.memory.textures--}function b(F){const R=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(R.__webglFramebuffer[de]))for(let ve=0;ve<R.__webglFramebuffer[de].length;ve++)n.deleteFramebuffer(R.__webglFramebuffer[de][ve]);else n.deleteFramebuffer(R.__webglFramebuffer[de]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[de])}else{if(Array.isArray(R.__webglFramebuffer))for(let de=0;de<R.__webglFramebuffer.length;de++)n.deleteFramebuffer(R.__webglFramebuffer[de]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let de=0;de<R.__webglColorRenderbuffer.length;de++)R.__webglColorRenderbuffer[de]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[de]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const j=F.textures;for(let de=0,ve=j.length;de<ve;de++){const se=i.get(j[de]);se.__webglTexture&&(n.deleteTexture(se.__webglTexture),r.memory.textures--),i.remove(j[de])}i.remove(F)}let P=0;function D(){P=0}function O(){const F=P;return F>=s.maxTextures&&wt("WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),P+=1,F}function Z(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function ee(F,R){const j=i.get(F);if(F.isVideoTexture&&Zt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&j.__version!==F.version){const de=F.image;if(de===null)wt("WebGLRenderer: Texture marked for update but no image data found.");else if(de.complete===!1)wt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(j,F,R);return}}else F.isExternalTexture&&(j.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+R)}function Y(F,R){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){$(j,F,R);return}else F.isExternalTexture&&(j.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+R)}function J(F,R){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){$(j,F,R);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+R)}function te(F,R){const j=i.get(F);if(F.version>0&&j.__version!==F.version){K(j,F,R);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+R)}const pe={[On]:n.REPEAT,[ss]:n.CLAMP_TO_EDGE,[jc]:n.MIRRORED_REPEAT},Me={[ei]:n.NEAREST,[nm]:n.NEAREST_MIPMAP_NEAREST,[fo]:n.NEAREST_MIPMAP_LINEAR,[ci]:n.LINEAR,[Yl]:n.LINEAR_MIPMAP_NEAREST,[Zs]:n.LINEAR_MIPMAP_LINEAR},Ze={[rm]:n.NEVER,[um]:n.ALWAYS,[om]:n.LESS,[q0]:n.LEQUAL,[lm]:n.EQUAL,[dm]:n.GEQUAL,[cm]:n.GREATER,[hm]:n.NOTEQUAL};function I(F,R){if(R.type===zi&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===ci||R.magFilter===Yl||R.magFilter===fo||R.magFilter===Zs||R.minFilter===ci||R.minFilter===Yl||R.minFilter===fo||R.minFilter===Zs)&&wt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,pe[R.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,pe[R.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,pe[R.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,Me[R.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,Me[R.minFilter]),R.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,Ze[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===ei||R.minFilter!==fo&&R.minFilter!==Zs||R.type===zi&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(F,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,s.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function De(F,R){let j=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",S));const de=R.source;let ve=m.get(de);ve===void 0&&(ve={},m.set(de,ve));const se=Z(R);if(se!==F.__cacheKey){ve[se]===void 0&&(ve[se]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,j=!0),ve[se].usedTimes++;const et=ve[F.__cacheKey];et!==void 0&&(ve[F.__cacheKey].usedTimes--,et.usedTimes===0&&w(R)),F.__cacheKey=se,F.__webglTexture=ve[se].texture}return j}function Se(F,R,j){return Math.floor(Math.floor(F/j)/R)}function Ie(F,R,j,de){const se=F.updateRanges;if(se.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,R.width,R.height,j,de,R.data);else{se.sort((ye,Ue)=>ye.start-Ue.start);let et=0;for(let ye=1;ye<se.length;ye++){const Ue=se[et],pt=se[ye],ht=Ue.start+Ue.count,qe=Se(pt.start,R.width,4),gt=Se(Ue.start,R.width,4);pt.start<=ht+1&&qe===gt&&Se(pt.start+pt.count-1,R.width,4)===qe?Ue.count=Math.max(Ue.count,pt.start+pt.count-Ue.start):(++et,se[et]=pt)}se.length=et+1;const ze=n.getParameter(n.UNPACK_ROW_LENGTH),it=n.getParameter(n.UNPACK_SKIP_PIXELS),$e=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,R.width);for(let ye=0,Ue=se.length;ye<Ue;ye++){const pt=se[ye],ht=Math.floor(pt.start/4),qe=Math.ceil(pt.count/4),gt=ht%R.width,H=Math.floor(ht/R.width),He=qe,Oe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,gt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,gt,H,He,Oe,j,de,R.data)}F.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ze),n.pixelStorei(n.UNPACK_SKIP_PIXELS,it),n.pixelStorei(n.UNPACK_SKIP_ROWS,$e)}}function $(F,R,j){let de=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(de=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(de=n.TEXTURE_3D);const ve=De(F,R),se=R.source;t.bindTexture(de,F.__webglTexture,n.TEXTURE0+j);const et=i.get(se);if(se.version!==et.__version||ve===!0){t.activeTexture(n.TEXTURE0+j);const ze=Gt.getPrimaries(Gt.workingColorSpace),it=R.colorSpace===bs?null:Gt.getPrimaries(R.colorSpace),$e=R.colorSpace===bs||ze===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e);let ye=_(R.image,!1,s.maxTextureSize);ye=ot(R,ye);const Ue=a.convert(R.format,R.colorSpace),pt=a.convert(R.type);let ht=v(R.internalFormat,Ue,pt,R.colorSpace,R.isVideoTexture);I(de,R);let qe;const gt=R.mipmaps,H=R.isVideoTexture!==!0,He=et.__version===void 0||ve===!0,Oe=se.dataReady,ke=E(R,ye);if(R.isDepthTexture)ht=M(R.format===Vr,R.type),He&&(H?t.texStorage2D(n.TEXTURE_2D,1,ht,ye.width,ye.height):t.texImage2D(n.TEXTURE_2D,0,ht,ye.width,ye.height,0,Ue,pt,null));else if(R.isDataTexture)if(gt.length>0){H&&He&&t.texStorage2D(n.TEXTURE_2D,ke,ht,gt[0].width,gt[0].height);for(let Ce=0,me=gt.length;Ce<me;Ce++)qe=gt[Ce],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Ce,0,0,qe.width,qe.height,Ue,pt,qe.data):t.texImage2D(n.TEXTURE_2D,Ce,ht,qe.width,qe.height,0,Ue,pt,qe.data);R.generateMipmaps=!1}else H?(He&&t.texStorage2D(n.TEXTURE_2D,ke,ht,ye.width,ye.height),Oe&&Ie(R,ye,Ue,pt)):t.texImage2D(n.TEXTURE_2D,0,ht,ye.width,ye.height,0,Ue,pt,ye.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){H&&He&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ke,ht,gt[0].width,gt[0].height,ye.depth);for(let Ce=0,me=gt.length;Ce<me;Ce++)if(qe=gt[Ce],R.format!==bi)if(Ue!==null)if(H){if(Oe)if(R.layerUpdates.size>0){const Je=Fu(qe.width,qe.height,R.format,R.type);for(const Mt of R.layerUpdates){const Yt=qe.data.subarray(Mt*Je/qe.data.BYTES_PER_ELEMENT,(Mt+1)*Je/qe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Ce,0,0,Mt,qe.width,qe.height,1,Ue,Yt)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Ce,0,0,0,qe.width,qe.height,ye.depth,Ue,qe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Ce,ht,qe.width,qe.height,ye.depth,0,qe.data,0,0);else wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Oe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Ce,0,0,0,qe.width,qe.height,ye.depth,Ue,pt,qe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Ce,ht,qe.width,qe.height,ye.depth,0,Ue,pt,qe.data)}else{H&&He&&t.texStorage2D(n.TEXTURE_2D,ke,ht,gt[0].width,gt[0].height);for(let Ce=0,me=gt.length;Ce<me;Ce++)qe=gt[Ce],R.format!==bi?Ue!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_2D,Ce,0,0,qe.width,qe.height,Ue,qe.data):t.compressedTexImage2D(n.TEXTURE_2D,Ce,ht,qe.width,qe.height,0,qe.data):wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Ce,0,0,qe.width,qe.height,Ue,pt,qe.data):t.texImage2D(n.TEXTURE_2D,Ce,ht,qe.width,qe.height,0,Ue,pt,qe.data)}else if(R.isDataArrayTexture)if(H){if(He&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ke,ht,ye.width,ye.height,ye.depth),Oe)if(R.layerUpdates.size>0){const Ce=Fu(ye.width,ye.height,R.format,R.type);for(const me of R.layerUpdates){const Je=ye.data.subarray(me*Ce/ye.data.BYTES_PER_ELEMENT,(me+1)*Ce/ye.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,me,ye.width,ye.height,1,Ue,pt,Je)}R.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ye.width,ye.height,ye.depth,Ue,pt,ye.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ht,ye.width,ye.height,ye.depth,0,Ue,pt,ye.data);else if(R.isData3DTexture)H?(He&&t.texStorage3D(n.TEXTURE_3D,ke,ht,ye.width,ye.height,ye.depth),Oe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ye.width,ye.height,ye.depth,Ue,pt,ye.data)):t.texImage3D(n.TEXTURE_3D,0,ht,ye.width,ye.height,ye.depth,0,Ue,pt,ye.data);else if(R.isFramebufferTexture){if(He)if(H)t.texStorage2D(n.TEXTURE_2D,ke,ht,ye.width,ye.height);else{let Ce=ye.width,me=ye.height;for(let Je=0;Je<ke;Je++)t.texImage2D(n.TEXTURE_2D,Je,ht,Ce,me,0,Ue,pt,null),Ce>>=1,me>>=1}}else if(gt.length>0){if(H&&He){const Ce=St(gt[0]);t.texStorage2D(n.TEXTURE_2D,ke,ht,Ce.width,Ce.height)}for(let Ce=0,me=gt.length;Ce<me;Ce++)qe=gt[Ce],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Ce,0,0,Ue,pt,qe):t.texImage2D(n.TEXTURE_2D,Ce,ht,Ue,pt,qe);R.generateMipmaps=!1}else if(H){if(He){const Ce=St(ye);t.texStorage2D(n.TEXTURE_2D,ke,ht,Ce.width,Ce.height)}Oe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ue,pt,ye)}else t.texImage2D(n.TEXTURE_2D,0,ht,Ue,pt,ye);g(R)&&f(de),et.__version=se.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function K(F,R,j){if(R.image.length!==6)return;const de=De(F,R),ve=R.source;t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+j);const se=i.get(ve);if(ve.version!==se.__version||de===!0){t.activeTexture(n.TEXTURE0+j);const et=Gt.getPrimaries(Gt.workingColorSpace),ze=R.colorSpace===bs?null:Gt.getPrimaries(R.colorSpace),it=R.colorSpace===bs||et===ze?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);const $e=R.isCompressedTexture||R.image[0].isCompressedTexture,ye=R.image[0]&&R.image[0].isDataTexture,Ue=[];for(let me=0;me<6;me++)!$e&&!ye?Ue[me]=_(R.image[me],!0,s.maxCubemapSize):Ue[me]=ye?R.image[me].image:R.image[me],Ue[me]=ot(R,Ue[me]);const pt=Ue[0],ht=a.convert(R.format,R.colorSpace),qe=a.convert(R.type),gt=v(R.internalFormat,ht,qe,R.colorSpace),H=R.isVideoTexture!==!0,He=se.__version===void 0||de===!0,Oe=ve.dataReady;let ke=E(R,pt);I(n.TEXTURE_CUBE_MAP,R);let Ce;if($e){H&&He&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ke,gt,pt.width,pt.height);for(let me=0;me<6;me++){Ce=Ue[me].mipmaps;for(let Je=0;Je<Ce.length;Je++){const Mt=Ce[Je];R.format!==bi?ht!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,Mt.width,Mt.height,ht,Mt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,gt,Mt.width,Mt.height,0,Mt.data):wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,Mt.width,Mt.height,ht,qe,Mt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,gt,Mt.width,Mt.height,0,ht,qe,Mt.data)}}}else{if(Ce=R.mipmaps,H&&He){Ce.length>0&&ke++;const me=St(Ue[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ke,gt,me.width,me.height)}for(let me=0;me<6;me++)if(ye){H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ue[me].width,Ue[me].height,ht,qe,Ue[me].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,gt,Ue[me].width,Ue[me].height,0,ht,qe,Ue[me].data);for(let Je=0;Je<Ce.length;Je++){const Yt=Ce[Je].image[me].image;H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,Yt.width,Yt.height,ht,qe,Yt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,gt,Yt.width,Yt.height,0,ht,qe,Yt.data)}}else{H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,ht,qe,Ue[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,gt,ht,qe,Ue[me]);for(let Je=0;Je<Ce.length;Je++){const Mt=Ce[Je];H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,ht,qe,Mt.image[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,gt,ht,qe,Mt.image[me])}}}g(R)&&f(n.TEXTURE_CUBE_MAP),se.__version=ve.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function Ae(F,R,j,de,ve,se){const et=a.convert(j.format,j.colorSpace),ze=a.convert(j.type),it=v(j.internalFormat,et,ze,j.colorSpace),$e=i.get(R),ye=i.get(j);if(ye.__renderTarget=R,!$e.__hasExternalTextures){const Ue=Math.max(1,R.width>>se),pt=Math.max(1,R.height>>se);ve===n.TEXTURE_3D||ve===n.TEXTURE_2D_ARRAY?t.texImage3D(ve,se,it,Ue,pt,R.depth,0,et,ze,null):t.texImage2D(ve,se,it,Ue,pt,0,et,ze,null)}t.bindFramebuffer(n.FRAMEBUFFER,F),Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ve,ye.__webglTexture,0,Xt(R)):(ve===n.TEXTURE_2D||ve>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,de,ve,ye.__webglTexture,se),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Fe(F,R,j){if(n.bindRenderbuffer(n.RENDERBUFFER,F),R.depthBuffer){const de=R.depthTexture,ve=de&&de.isDepthTexture?de.type:null,se=M(R.stencilBuffer,ve),et=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ze=Xt(R);Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ze,se,R.width,R.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,ze,se,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,se,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,F)}else{const de=R.textures;for(let ve=0;ve<de.length;ve++){const se=de[ve],et=a.convert(se.format,se.colorSpace),ze=a.convert(se.type),it=v(se.internalFormat,et,ze,se.colorSpace),$e=Xt(R);j&&Qe(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,$e,it,R.width,R.height):Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$e,it,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,it,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const de=i.get(R.depthTexture);de.__renderTarget=R,(!de.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),ee(R.depthTexture,0);const ve=de.__webglTexture,se=Xt(R);if(R.depthTexture.format===Br)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ve,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ve,0);else if(R.depthTexture.format===Vr)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ve,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function nt(F){const R=i.get(F),j=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const de=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),de){const ve=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,de.removeEventListener("dispose",ve)};de.addEventListener("dispose",ve),R.__depthDisposeCallback=ve}R.__boundDepthTexture=de}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const de=F.texture.mipmaps;de&&de.length>0?Be(R.__webglFramebuffer[0],F):Be(R.__webglFramebuffer,F)}else if(j){R.__webglDepthbuffer=[];for(let de=0;de<6;de++)if(t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[de]),R.__webglDepthbuffer[de]===void 0)R.__webglDepthbuffer[de]=n.createRenderbuffer(),Fe(R.__webglDepthbuffer[de],F,!1);else{const ve=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=R.__webglDepthbuffer[de];n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,se)}}else{const de=F.texture.mipmaps;if(de&&de.length>0?t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),Fe(R.__webglDepthbuffer,F,!1);else{const ve=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,se)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function qt(F,R,j){const de=i.get(F);R!==void 0&&Ae(de.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&nt(F)}function rt(F){const R=F.texture,j=i.get(F),de=i.get(R);F.addEventListener("dispose",C);const ve=F.textures,se=F.isWebGLCubeRenderTarget===!0,et=ve.length>1;if(et||(de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture()),de.__version=R.version,r.memory.textures++),se){j.__webglFramebuffer=[];for(let ze=0;ze<6;ze++)if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer[ze]=[];for(let it=0;it<R.mipmaps.length;it++)j.__webglFramebuffer[ze][it]=n.createFramebuffer()}else j.__webglFramebuffer[ze]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer=[];for(let ze=0;ze<R.mipmaps.length;ze++)j.__webglFramebuffer[ze]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(et)for(let ze=0,it=ve.length;ze<it;ze++){const $e=i.get(ve[ze]);$e.__webglTexture===void 0&&($e.__webglTexture=n.createTexture(),r.memory.textures++)}if(F.samples>0&&Qe(F)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let ze=0;ze<ve.length;ze++){const it=ve[ze];j.__webglColorRenderbuffer[ze]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[ze]);const $e=a.convert(it.format,it.colorSpace),ye=a.convert(it.type),Ue=v(it.internalFormat,$e,ye,it.colorSpace,F.isXRRenderTarget===!0),pt=Xt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,pt,Ue,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,j.__webglColorRenderbuffer[ze])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),Fe(j.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(se){t.bindTexture(n.TEXTURE_CUBE_MAP,de.__webglTexture),I(n.TEXTURE_CUBE_MAP,R);for(let ze=0;ze<6;ze++)if(R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)Ae(j.__webglFramebuffer[ze][it],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ze,it);else Ae(j.__webglFramebuffer[ze],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ze,0);g(R)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(et){for(let ze=0,it=ve.length;ze<it;ze++){const $e=ve[ze],ye=i.get($e);let Ue=n.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Ue=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ue,ye.__webglTexture),I(Ue,$e),Ae(j.__webglFramebuffer,F,$e,n.COLOR_ATTACHMENT0+ze,Ue,0),g($e)&&f(Ue)}t.unbindTexture()}else{let ze=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(ze=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ze,de.__webglTexture),I(ze,R),R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)Ae(j.__webglFramebuffer[it],F,R,n.COLOR_ATTACHMENT0,ze,it);else Ae(j.__webglFramebuffer,F,R,n.COLOR_ATTACHMENT0,ze,0);g(R)&&f(ze),t.unbindTexture()}F.depthBuffer&&nt(F)}function Wt(F){const R=F.textures;for(let j=0,de=R.length;j<de;j++){const ve=R[j];if(g(ve)){const se=y(F),et=i.get(ve).__webglTexture;t.bindTexture(se,et),f(se),t.unbindTexture()}}}const V=[],Pt=[];function Et(F){if(F.samples>0){if(Qe(F)===!1){const R=F.textures,j=F.width,de=F.height;let ve=n.COLOR_BUFFER_BIT;const se=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=i.get(F),ze=R.length>1;if(ze)for(let $e=0;$e<R.length;$e++)t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+$e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer);const it=F.texture.mipmaps;it&&it.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let $e=0;$e<R.length;$e++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(ve|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(ve|=n.STENCIL_BUFFER_BIT)),ze){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,et.__webglColorRenderbuffer[$e]);const ye=i.get(R[$e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ye,0)}n.blitFramebuffer(0,0,j,de,0,0,j,de,ve,n.NEAREST),c===!0&&(V.length=0,Pt.length=0,V.push(n.COLOR_ATTACHMENT0+$e),F.depthBuffer&&F.resolveDepthBuffer===!1&&(V.push(se),Pt.push(se),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Pt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,V))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ze)for(let $e=0;$e<R.length;$e++){t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$e,n.RENDERBUFFER,et.__webglColorRenderbuffer[$e]);const ye=i.get(R[$e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+$e,n.TEXTURE_2D,ye,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const R=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Xt(F){return Math.min(s.maxSamples,F.samples)}function Qe(F){const R=i.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Zt(F){const R=r.render.frame;d.get(F)!==R&&(d.set(F,R),F.update())}function ot(F,R){const j=F.colorSpace,de=F.format,ve=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||j!==$a&&j!==bs&&(Gt.getTransfer(j)===jt?(de!==bi||ve!==qi)&&wt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):hn("WebGLTextures: Unsupported texture color space:",j)),R}function St(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(h.width=F.naturalWidth||F.width,h.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(h.width=F.displayWidth,h.height=F.displayHeight):(h.width=F.width,h.height=F.height),h}this.allocateTextureUnit=O,this.resetTextureUnits=D,this.setTexture2D=ee,this.setTexture2DArray=Y,this.setTexture3D=J,this.setTextureCube=te,this.rebindTextures=qt,this.setupRenderTarget=rt,this.updateRenderTargetMipmap=Wt,this.updateMultisampleRenderTarget=Et,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=Qe}function wM(n,e){function t(i,s=bs){let a;const r=Gt.getTransfer(s);if(i===qi)return n.UNSIGNED_BYTE;if(i===ed)return n.UNSIGNED_SHORT_4_4_4_4;if(i===td)return n.UNSIGNED_SHORT_5_5_5_1;if(i===G0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===H0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===B0)return n.BYTE;if(i===V0)return n.SHORT;if(i===kr)return n.UNSIGNED_SHORT;if(i===Qh)return n.INT;if(i===sa)return n.UNSIGNED_INT;if(i===zi)return n.FLOAT;if(i===Bi)return n.HALF_FLOAT;if(i===W0)return n.ALPHA;if(i===X0)return n.RGB;if(i===bi)return n.RGBA;if(i===Br)return n.DEPTH_COMPONENT;if(i===Vr)return n.DEPTH_STENCIL;if(i===nd)return n.RED;if(i===id)return n.RED_INTEGER;if(i===sd)return n.RG;if(i===ad)return n.RG_INTEGER;if(i===rd)return n.RGBA_INTEGER;if(i===nl||i===il||i===sl||i===al)if(r===jt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===nl)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===il)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===al)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===nl)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===il)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sl)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===al)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Qc||i===eh||i===th||i===nh)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Qc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===eh)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===th)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===nh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ih||i===sh||i===ah)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===ih||i===sh)return r===jt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===ah)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===rh||i===oh||i===lh||i===ch||i===hh||i===dh||i===uh||i===fh||i===ph||i===mh||i===xh||i===gh||i===vh||i===Mh)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===rh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===lh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ch)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===hh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===dh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===uh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===fh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ph)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===mh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===gh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Mh)return r===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_h||i===yh||i===bh)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===_h)return r===jt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===yh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===bh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wh||i===Sh||i===Th||i===Eh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===wh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Sh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Th)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Eh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Or?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const SM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TM=`
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

}`;class EM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new rf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new An({vertexShader:SM,fragmentShader:TM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new U(new Nt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class AM extends Qa{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,h=null,d=null,u=null,m=null,p=null,x=null;const _=typeof XRWebGLBinding<"u",g=new EM,f={},y=t.getContextAttributes();let v=null,M=null;const E=[],S=[],C=new Ne;let A=null;const w=new jn;w.viewport=new tn;const b=new jn;b.viewport=new tn;const P=[w,b],D=new Xx;let O=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new pc,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new pc,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new pc,E[$]=K),K.getHandSpace()};function ee($){const K=S.indexOf($.inputSource);if(K===-1)return;const Ae=E[K];Ae!==void 0&&(Ae.update($.inputSource,$.frame,h||r),Ae.dispatchEvent({type:$.type,data:$.inputSource}))}function Y(){s.removeEventListener("select",ee),s.removeEventListener("selectstart",ee),s.removeEventListener("selectend",ee),s.removeEventListener("squeeze",ee),s.removeEventListener("squeezestart",ee),s.removeEventListener("squeezeend",ee),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",J);for(let $=0;$<E.length;$++){const K=S[$];K!==null&&(S[$]=null,E[$].disconnect(K))}O=null,Z=null,g.reset();for(const $ in f)delete f[$];e.setRenderTarget(v),p=null,m=null,u=null,s=null,M=null,Ie.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&wt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&wt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",ee),s.addEventListener("selectstart",ee),s.addEventListener("selectend",ee),s.addEventListener("squeeze",ee),s.addEventListener("squeezestart",ee),s.addEventListener("squeezeend",ee),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",J),y.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,Fe=null,Be=null;y.depth&&(Be=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=y.stencil?Vr:Br,Fe=y.stencil?Or:sa);const nt={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:a};u=this.getBinding(),m=u.createProjectionLayer(nt),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),M=new Si(m.textureWidth,m.textureHeight,{format:bi,type:qi,depthTexture:new af(m.textureWidth,m.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const Ae={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Si(p.framebufferWidth,p.framebufferHeight,{format:bi,type:qi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(o),Ie.setContext(s),Ie.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function J($){for(let K=0;K<$.removed.length;K++){const Ae=$.removed[K],Fe=S.indexOf(Ae);Fe>=0&&(S[Fe]=null,E[Fe].disconnect(Ae))}for(let K=0;K<$.added.length;K++){const Ae=$.added[K];let Fe=S.indexOf(Ae);if(Fe===-1){for(let nt=0;nt<E.length;nt++)if(nt>=S.length){S.push(Ae),Fe=nt;break}else if(S[nt]===null){S[nt]=Ae,Fe=nt;break}if(Fe===-1)break}const Be=E[Fe];Be&&Be.connect(Ae)}}const te=new L,pe=new L;function Me($,K,Ae){te.setFromMatrixPosition(K.matrixWorld),pe.setFromMatrixPosition(Ae.matrixWorld);const Fe=te.distanceTo(pe),Be=K.projectionMatrix.elements,nt=Ae.projectionMatrix.elements,qt=Be[14]/(Be[10]-1),rt=Be[14]/(Be[10]+1),Wt=(Be[9]+1)/Be[5],V=(Be[9]-1)/Be[5],Pt=(Be[8]-1)/Be[0],Et=(nt[8]+1)/nt[0],Xt=qt*Pt,Qe=qt*Et,Zt=Fe/(-Pt+Et),ot=Zt*-Pt;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(Zt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Be[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const St=qt+Zt,F=rt+Zt,R=Xt-ot,j=Qe+(Fe-ot),de=Wt*rt/F*St,ve=V*rt/F*St;$.projectionMatrix.makePerspective(R,j,de,ve,St,F),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ze($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,Ae=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(Ae=g.depthFar)),D.near=b.near=w.near=K,D.far=b.far=w.far=Ae,(O!==D.near||Z!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,Z=D.far),D.layers.mask=$.layers.mask|6,w.layers.mask=D.layers.mask&3,b.layers.mask=D.layers.mask&5;const Fe=$.parent,Be=D.cameras;Ze(D,Fe);for(let nt=0;nt<Be.length;nt++)Ze(Be[nt],Fe);Be.length===2?Me(D,w,b):D.projectionMatrix.copy(w.projectionMatrix),I($,D,Fe)};function I($,K,Ae){Ae===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(Ae.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Hr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(m===null&&p===null))return c},this.setFoveation=function($){c=$,m!==null&&(m.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function($){return f[$]};let De=null;function Se($,K){if(d=K.getViewerPose(h||r),x=K,d!==null){const Ae=d.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let Fe=!1;Ae.length!==D.cameras.length&&(D.cameras.length=0,Fe=!0);for(let rt=0;rt<Ae.length;rt++){const Wt=Ae[rt];let V=null;if(p!==null)V=p.getViewport(Wt);else{const Et=u.getViewSubImage(m,Wt);V=Et.viewport,rt===0&&(e.setRenderTargetTextures(M,Et.colorTexture,Et.depthStencilTexture),e.setRenderTarget(M))}let Pt=P[rt];Pt===void 0&&(Pt=new jn,Pt.layers.enable(rt),Pt.viewport=new tn,P[rt]=Pt),Pt.matrix.fromArray(Wt.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(Wt.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(V.x,V.y,V.width,V.height),rt===0&&(D.matrix.copy(Pt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Fe===!0&&D.cameras.push(Pt)}const Be=s.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const rt=u.getDepthInformation(Ae[0]);rt&&rt.isValid&&rt.texture&&g.init(rt,s.renderState)}if(Be&&Be.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let rt=0;rt<Ae.length;rt++){const Wt=Ae[rt].camera;if(Wt){let V=f[Wt];V||(V=new rf,f[Wt]=V);const Pt=u.getCameraImage(Wt);V.sourceTexture=Pt}}}}for(let Ae=0;Ae<E.length;Ae++){const Fe=S[Ae],Be=E[Ae];Fe!==null&&Be!==void 0&&Be.update(Fe,K,h||r)}De&&De($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Ie=new gf;Ie.setAnimationLoop(Se),this.setAnimationLoop=function($){De=$},this.dispose=function(){}}}const Bs=new Ti,CM=new Tt;function RM(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,j0(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),u(g,f)):f.isMeshPhongMaterial?(a(g,f),d(g,f)):f.isMeshStandardMaterial?(a(g,f),m(g,f),f.isMeshPhysicalMaterial&&p(g,f,M)):f.isMeshMatcapMaterial?(a(g,f),x(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),_(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?c(g,f,y,v):f.isSpriteMaterial?h(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===zn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===zn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,M=y.envMapRotation;v&&(g.envMap.value=v,Bs.copy(M),Bs.x*=-1,Bs.y*=-1,Bs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Bs.y*=-1,Bs.z*=-1),g.envMapRotation.value.setFromMatrix4(CM.makeRotationFromEuler(Bs)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,y,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=v*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function m(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===zn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,f){f.matcap&&(g.matcap.value=f.matcap)}function _(g,f){const y=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function PM(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const M=v.program;i.uniformBlockBinding(y,M)}function h(y,v){let M=s[y.id];M===void 0&&(x(y),M=d(y),s[y.id]=M,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const S=e.render.frame;a[y.id]!==S&&(m(y),a[y.id]=S)}function d(y){const v=u();y.__bindingPointIndex=v;const M=n.createBuffer(),E=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,E,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return hn("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(y){const v=s[y.id],M=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let S=0,C=M.length;S<C;S++){const A=Array.isArray(M[S])?M[S]:[M[S]];for(let w=0,b=A.length;w<b;w++){const P=A[w];if(p(P,S,w,E)===!0){const D=P.__offset,O=Array.isArray(P.value)?P.value:[P.value];let Z=0;for(let ee=0;ee<O.length;ee++){const Y=O[ee],J=_(Y);typeof Y=="number"||typeof Y=="boolean"?(P.__data[0]=Y,n.bufferSubData(n.UNIFORM_BUFFER,D+Z,P.__data)):Y.isMatrix3?(P.__data[0]=Y.elements[0],P.__data[1]=Y.elements[1],P.__data[2]=Y.elements[2],P.__data[3]=0,P.__data[4]=Y.elements[3],P.__data[5]=Y.elements[4],P.__data[6]=Y.elements[5],P.__data[7]=0,P.__data[8]=Y.elements[6],P.__data[9]=Y.elements[7],P.__data[10]=Y.elements[8],P.__data[11]=0):(Y.toArray(P.__data,Z),Z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,M,E){const S=y.value,C=v+"_"+M;if(E[C]===void 0)return typeof S=="number"||typeof S=="boolean"?E[C]=S:E[C]=S.clone(),!0;{const A=E[C];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return E[C]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function x(y){const v=y.uniforms;let M=0;const E=16;for(let C=0,A=v.length;C<A;C++){const w=Array.isArray(v[C])?v[C]:[v[C]];for(let b=0,P=w.length;b<P;b++){const D=w[b],O=Array.isArray(D.value)?D.value:[D.value];for(let Z=0,ee=O.length;Z<ee;Z++){const Y=O[Z],J=_(Y),te=M%E,pe=te%J.boundary,Me=te+pe;M+=pe,Me!==0&&E-Me<J.storage&&(M+=E-Me),D.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=M,M+=J.storage}}}const S=M%E;return S>0&&(M+=E-S),y.__size=M,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?wt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):wt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const M=r.indexOf(v.__bindingPointIndex);r.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:f}}const LM=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let es=null;function DM(){return es===null&&(es=new sf(LM,32,32,sd,Bi),es.minFilter=ci,es.magFilter=ci,es.wrapS=ss,es.wrapT=ss,es.generateMipmaps=!1,es.needsUpdate=!0),es}class IM{constructor(e={}){const{canvas:t=fm(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const x=new Set([rd,ad,id]),_=new Set([qi,sa,kr,Or,ed,td]),g=new Uint32Array(4),f=new Int32Array(4);let y=null,v=null;const M=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Es,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let C=!1;this._outputColorSpace=Lt;let A=0,w=0,b=null,P=-1,D=null;const O=new tn,Z=new tn;let ee=null;const Y=new at(0);let J=0,te=t.width,pe=t.height,Me=1,Ze=null,I=null;const De=new tn(0,0,te,pe),Se=new tn(0,0,te,pe);let Ie=!1;const $=new fd;let K=!1,Ae=!1;const Fe=new Tt,Be=new L,nt=new tn,qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let rt=!1;function Wt(){return b===null?Me:1}let V=i;function Pt(T,z){return t.getContext(T,z)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Kh}`),t.addEventListener("webglcontextlost",Ce,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",Je,!1),V===null){const z="webgl2";if(V=Pt(z,T),V===null)throw Pt(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw T("WebGLRenderer: "+T.message),T}let Et,Xt,Qe,Zt,ot,St,F,R,j,de,ve,se,et,ze,it,$e,ye,Ue,pt,ht,qe,gt,H,He;function Oe(){Et=new V2(V),Et.init(),gt=new wM(V,Et),Xt=new D2(V,Et,e,gt),Qe=new yM(V,Et),Xt.reversedDepthBuffer&&m&&Qe.buffers.depth.setReversed(!0),Zt=new W2(V),ot=new lM,St=new bM(V,Et,Qe,ot,Xt,gt,Zt),F=new F2(S),R=new B2(S),j=new $x(V),H=new P2(V,j),de=new G2(V,j,Zt,H),ve=new q2(V,de,j,Zt),pt=new X2(V,Xt,St),$e=new I2(ot),se=new oM(S,F,R,Et,Xt,H,$e),et=new RM(S,ot),ze=new hM,it=new xM(Et),Ue=new R2(S,F,R,Qe,ve,p,c),ye=new MM(S,ve,Xt),He=new PM(V,Zt,Xt,Qe),ht=new L2(V,Et,Zt),qe=new H2(V,Et,Zt),Zt.programs=se.programs,S.capabilities=Xt,S.extensions=Et,S.properties=ot,S.renderLists=ze,S.shadowMap=ye,S.state=Qe,S.info=Zt}Oe();const ke=new AM(S,V);this.xr=ke,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const T=Et.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Et.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(T){T!==void 0&&(Me=T,this.setSize(te,pe,!1))},this.getSize=function(T){return T.set(te,pe)},this.setSize=function(T,z,G=!0){if(ke.isPresenting){wt("WebGLRenderer: Can't change size while VR device is presenting.");return}te=T,pe=z,t.width=Math.floor(T*Me),t.height=Math.floor(z*Me),G===!0&&(t.style.width=T+"px",t.style.height=z+"px"),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(te*Me,pe*Me).floor()},this.setDrawingBufferSize=function(T,z,G){te=T,pe=z,Me=G,t.width=Math.floor(T*G),t.height=Math.floor(z*G),this.setViewport(0,0,T,z)},this.getCurrentViewport=function(T){return T.copy(O)},this.getViewport=function(T){return T.copy(De)},this.setViewport=function(T,z,G,X){T.isVector4?De.set(T.x,T.y,T.z,T.w):De.set(T,z,G,X),Qe.viewport(O.copy(De).multiplyScalar(Me).round())},this.getScissor=function(T){return T.copy(Se)},this.setScissor=function(T,z,G,X){T.isVector4?Se.set(T.x,T.y,T.z,T.w):Se.set(T,z,G,X),Qe.scissor(Z.copy(Se).multiplyScalar(Me).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(T){Qe.setScissorTest(Ie=T)},this.setOpaqueSort=function(T){Ze=T},this.setTransparentSort=function(T){I=T},this.getClearColor=function(T){return T.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,G=!0){let X=0;if(T){let B=!1;if(b!==null){const oe=b.texture.format;B=x.has(oe)}if(B){const oe=b.texture.type,fe=_.has(oe),ae=Ue.getClearColor(),we=Ue.getClearAlpha(),be=ae.r,Ee=ae.g,_e=ae.b;fe?(g[0]=be,g[1]=Ee,g[2]=_e,g[3]=we,V.clearBufferuiv(V.COLOR,0,g)):(f[0]=be,f[1]=Ee,f[2]=_e,f[3]=we,V.clearBufferiv(V.COLOR,0,f))}else X|=V.COLOR_BUFFER_BIT}z&&(X|=V.DEPTH_BUFFER_BIT),G&&(X|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ce,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",Je,!1),Ue.dispose(),ze.dispose(),it.dispose(),ot.dispose(),F.dispose(),R.dispose(),ve.dispose(),H.dispose(),He.dispose(),se.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",co),ke.removeEventListener("sessionend",rr),Ei.stop()};function Ce(T){T.preventDefault(),pl("WebGLRenderer: Context Lost."),C=!0}function me(){pl("WebGLRenderer: Context Restored."),C=!1;const T=Zt.autoReset,z=ye.enabled,G=ye.autoUpdate,X=ye.needsUpdate,B=ye.type;Oe(),Zt.autoReset=T,ye.enabled=z,ye.autoUpdate=G,ye.needsUpdate=X,ye.type=B}function Je(T){hn("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Mt(T){const z=T.target;z.removeEventListener("dispose",Mt),Yt(z)}function Yt(T){Bt(T),ot.remove(T)}function Bt(T){const z=ot.get(T).programs;z!==void 0&&(z.forEach(function(G){se.releaseProgram(G)}),T.isShaderMaterial&&se.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,G,X,B,oe){z===null&&(z=qt);const fe=B.isMesh&&B.matrixWorld.determinant()<0,ae=N(T,z,G,X,B);Qe.setMaterial(X,fe);let we=G.index,be=1;if(X.wireframe===!0){if(we=de.getWireframeAttribute(G),we===void 0)return;be=2}const Ee=G.drawRange,_e=G.attributes.position;let Le=Ee.start*be,xt=(Ee.start+Ee.count)*be;oe!==null&&(Le=Math.max(Le,oe.start*be),xt=Math.min(xt,(oe.start+oe.count)*be)),we!==null?(Le=Math.max(Le,0),xt=Math.min(xt,we.count)):_e!=null&&(Le=Math.max(Le,0),xt=Math.min(xt,_e.count));const vt=xt-Le;if(vt<0||vt===1/0)return;H.setup(B,X,ae,G,we);let dt,mt=ht;if(we!==null&&(dt=j.get(we),mt=qe,mt.setIndex(dt)),B.isMesh)X.wireframe===!0?(Qe.setLineWidth(X.wireframeLinewidth*Wt()),mt.setMode(V.LINES)):mt.setMode(V.TRIANGLES);else if(B.isLine){let Ge=X.linewidth;Ge===void 0&&(Ge=1),Qe.setLineWidth(Ge*Wt()),B.isLineSegments?mt.setMode(V.LINES):B.isLineLoop?mt.setMode(V.LINE_LOOP):mt.setMode(V.LINE_STRIP)}else B.isPoints?mt.setMode(V.POINTS):B.isSprite&&mt.setMode(V.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Gr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Et.get("WEBGL_multi_draw"))mt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ge=B._multiDrawStarts,Dt=B._multiDrawCounts,lt=B._multiDrawCount,Ut=we?j.get(we).bytesPerElement:1,xn=ot.get(X).currentProgram.getUniforms();for(let Kt=0;Kt<lt;Kt++)xn.setValue(V,"_gl_DrawID",Kt),mt.render(Ge[Kt]/Ut,Dt[Kt])}else if(B.isInstancedMesh)mt.renderInstances(Le,vt,B.count);else if(G.isInstancedBufferGeometry){const Ge=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Dt=Math.min(G.instanceCount,Ge);mt.renderInstances(Le,vt,Dt)}else mt.render(Le,vt)};function Bn(T,z,G){T.transparent===!0&&T.side===At&&T.forceSinglePass===!1?(T.side=zn,T.needsUpdate=!0,Mn(T,z,G),T.side=Rs,T.needsUpdate=!0,Mn(T,z,G),T.side=At):Mn(T,z,G)}this.compile=function(T,z,G=null){G===null&&(G=T),v=it.get(G),v.init(z),E.push(v),G.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),T!==G&&T.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const X=new Set;return T.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let fe=0;fe<oe.length;fe++){const ae=oe[fe];Bn(ae,G,B),X.add(ae)}else Bn(oe,G,B),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(T,z,G=null){const X=this.compile(T,z,G);return new Promise(B=>{function oe(){if(X.forEach(function(fe){ot.get(fe).currentProgram.isReady()&&X.delete(fe)}),X.size===0){B(T);return}setTimeout(oe,10)}Et.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Pn=null;function ui(T){Pn&&Pn(T)}function co(){Ei.stop()}function rr(){Ei.start()}const Ei=new gf;Ei.setAnimationLoop(ui),typeof self<"u"&&Ei.setContext(self),this.setAnimationLoop=function(T){Pn=T,ke.setAnimationLoop(T),T===null?Ei.stop():Ei.start()},ke.addEventListener("sessionstart",co),ke.addEventListener("sessionend",rr),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){hn("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(z),z=ke.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,z,b),v=it.get(T,E.length),v.init(z),E.push(v),Fe.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),$.setFromProjectionMatrix(Fe,Ni,z.reversedDepth),Ae=this.localClippingEnabled,K=$e.init(this.clippingPlanes,Ae),y=ze.get(T,M.length),y.init(),M.push(y),ke.enabled===!0&&ke.isPresenting===!0){const oe=S.xr.getDepthSensingMesh();oe!==null&&Ai(oe,z,-1/0,S.sortObjects)}Ai(T,z,0,S.sortObjects),y.finish(),S.sortObjects===!0&&y.sort(Ze,I),rt=ke.enabled===!1||ke.isPresenting===!1||ke.hasDepthSensing()===!1,rt&&Ue.addToRenderList(y,T),this.info.render.frame++,K===!0&&$e.beginShadows();const G=v.state.shadowsArray;ye.render(G,T,z),K===!0&&$e.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,B=y.transmissive;if(v.setupLights(),z.isArrayCamera){const oe=z.cameras;if(B.length>0)for(let fe=0,ae=oe.length;fe<ae;fe++){const we=oe[fe];or(X,B,T,we)}rt&&Ue.render(T);for(let fe=0,ae=oe.length;fe<ae;fe++){const we=oe[fe];Ci(y,T,we,we.viewport)}}else B.length>0&&or(X,B,T,z),rt&&Ue.render(T),Ci(y,T,z);b!==null&&w===0&&(St.updateMultisampleRenderTarget(b),St.updateRenderTargetMipmap(b)),T.isScene===!0&&T.onAfterRender(S,T,z),H.resetDefaultState(),P=-1,D=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&$e.setGlobalState(S.clippingPlanes,v.state.camera)):v=null,M.pop(),M.length>0?y=M[M.length-1]:y=null};function Ai(T,z,G,X){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)v.pushLight(T),T.castShadow&&v.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$.intersectsSprite(T)){X&&nt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Fe);const fe=ve.update(T),ae=T.material;ae.visible&&y.push(T,fe,ae,G,nt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||$.intersectsObject(T))){const fe=ve.update(T),ae=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),nt.copy(T.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),nt.copy(fe.boundingSphere.center)),nt.applyMatrix4(T.matrixWorld).applyMatrix4(Fe)),Array.isArray(ae)){const we=fe.groups;for(let be=0,Ee=we.length;be<Ee;be++){const _e=we[be],Le=ae[_e.materialIndex];Le&&Le.visible&&y.push(T,fe,Le,G,nt.z,_e)}}else ae.visible&&y.push(T,fe,ae,G,nt.z,null)}}const oe=T.children;for(let fe=0,ae=oe.length;fe<ae;fe++)Ai(oe[fe],z,G,X)}function Ci(T,z,G,X){const{opaque:B,transmissive:oe,transparent:fe}=T;v.setupLightsView(G),K===!0&&$e.setGlobalState(S.clippingPlanes,G),X&&Qe.viewport(O.copy(X)),B.length>0&&da(B,z,G),oe.length>0&&da(oe,z,G),fe.length>0&&da(fe,z,G),Qe.buffers.depth.setTest(!0),Qe.buffers.depth.setMask(!0),Qe.buffers.color.setMask(!0),Qe.setPolygonOffset(!1)}function or(T,z,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new Si(1,1,{generateMipmaps:!0,type:Et.has("EXT_color_buffer_half_float")||Et.has("EXT_color_buffer_float")?Bi:qi,minFilter:Zs,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Gt.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],fe=X.viewport||O;oe.setSize(fe.z*S.transmissionResolutionScale,fe.w*S.transmissionResolutionScale);const ae=S.getRenderTarget(),we=S.getActiveCubeFace(),be=S.getActiveMipmapLevel();S.setRenderTarget(oe),S.getClearColor(Y),J=S.getClearAlpha(),J<1&&S.setClearColor(16777215,.5),S.clear(),rt&&Ue.render(G);const Ee=S.toneMapping;S.toneMapping=Es;const _e=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&$e.setGlobalState(S.clippingPlanes,X),da(T,G,X),St.updateMultisampleRenderTarget(oe),St.updateRenderTargetMipmap(oe),Et.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let xt=0,vt=z.length;xt<vt;xt++){const dt=z[xt],{object:mt,geometry:Ge,material:Dt,group:lt}=dt;if(Dt.side===At&&mt.layers.test(X.layers)){const Ut=Dt.side;Dt.side=zn,Dt.needsUpdate=!0,ho(mt,G,X,Ge,Dt,lt),Dt.side=Ut,Dt.needsUpdate=!0,Le=!0}}Le===!0&&(St.updateMultisampleRenderTarget(oe),St.updateRenderTargetMipmap(oe))}S.setRenderTarget(ae,we,be),S.setClearColor(Y,J),_e!==void 0&&(X.viewport=_e),S.toneMapping=Ee}function da(T,z,G){const X=z.isScene===!0?z.overrideMaterial:null;for(let B=0,oe=T.length;B<oe;B++){const fe=T[B],{object:ae,geometry:we,group:be}=fe;let Ee=fe.material;Ee.allowOverride===!0&&X!==null&&(Ee=X),ae.layers.test(G.layers)&&ho(ae,z,G,we,Ee,be)}}function ho(T,z,G,X,B,oe){T.onBeforeRender(S,z,G,X,B,oe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),B.onBeforeRender(S,z,G,X,T,oe),B.transparent===!0&&B.side===At&&B.forceSinglePass===!1?(B.side=zn,B.needsUpdate=!0,S.renderBufferDirect(G,z,X,B,T,oe),B.side=Rs,B.needsUpdate=!0,S.renderBufferDirect(G,z,X,B,T,oe),B.side=At):S.renderBufferDirect(G,z,X,B,T,oe),T.onAfterRender(S,z,G,X,B,oe)}function Mn(T,z,G){z.isScene!==!0&&(z=qt);const X=ot.get(T),B=v.state.lights,oe=v.state.shadowsArray,fe=B.state.version,ae=se.getParameters(T,B.state,oe,z,G),we=se.getProgramCacheKey(ae);let be=X.programs;X.environment=T.isMeshStandardMaterial?z.environment:null,X.fog=z.fog,X.envMap=(T.isMeshStandardMaterial?R:F).get(T.envMap||X.environment),X.envMapRotation=X.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,be===void 0&&(T.addEventListener("dispose",Mt),be=new Map,X.programs=be);let Ee=be.get(we);if(Ee!==void 0){if(X.currentProgram===Ee&&X.lightsStateVersion===fe)return lr(T,ae),Ee}else ae.uniforms=se.getUniforms(T),T.onBeforeCompile(ae,S),Ee=se.acquireProgram(ae,we),be.set(we,Ee),X.uniforms=ae.uniforms;const _e=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(_e.clippingPlanes=$e.uniform),lr(T,ae),X.needsLights=q(T),X.lightsStateVersion=fe,X.needsLights&&(_e.ambientLightColor.value=B.state.ambient,_e.lightProbe.value=B.state.probe,_e.directionalLights.value=B.state.directional,_e.directionalLightShadows.value=B.state.directionalShadow,_e.spotLights.value=B.state.spot,_e.spotLightShadows.value=B.state.spotShadow,_e.rectAreaLights.value=B.state.rectArea,_e.ltc_1.value=B.state.rectAreaLTC1,_e.ltc_2.value=B.state.rectAreaLTC2,_e.pointLights.value=B.state.point,_e.pointLightShadows.value=B.state.pointShadow,_e.hemisphereLights.value=B.state.hemi,_e.directionalShadowMap.value=B.state.directionalShadowMap,_e.directionalShadowMatrix.value=B.state.directionalShadowMatrix,_e.spotShadowMap.value=B.state.spotShadowMap,_e.spotLightMatrix.value=B.state.spotLightMatrix,_e.spotLightMap.value=B.state.spotLightMap,_e.pointShadowMap.value=B.state.pointShadowMap,_e.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Ee,X.uniformsList=null,Ee}function uo(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=rl.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function lr(T,z){const G=ot.get(T);G.outputColorSpace=z.outputColorSpace,G.batching=z.batching,G.batchingColor=z.batchingColor,G.instancing=z.instancing,G.instancingColor=z.instancingColor,G.instancingMorph=z.instancingMorph,G.skinning=z.skinning,G.morphTargets=z.morphTargets,G.morphNormals=z.morphNormals,G.morphColors=z.morphColors,G.morphTargetsCount=z.morphTargetsCount,G.numClippingPlanes=z.numClippingPlanes,G.numIntersection=z.numClipIntersection,G.vertexAlphas=z.vertexAlphas,G.vertexTangents=z.vertexTangents,G.toneMapping=z.toneMapping}function N(T,z,G,X,B){z.isScene!==!0&&(z=qt),St.resetTextureUnits();const oe=z.fog,fe=X.isMeshStandardMaterial?z.environment:null,ae=b===null?S.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:$a,we=(X.isMeshStandardMaterial?R:F).get(X.envMap||fe),be=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ee=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),_e=!!G.morphAttributes.position,Le=!!G.morphAttributes.normal,xt=!!G.morphAttributes.color;let vt=Es;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(vt=S.toneMapping);const dt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,mt=dt!==void 0?dt.length:0,Ge=ot.get(X),Dt=v.state.lights;if(K===!0&&(Ae===!0||T!==D)){const Gn=T===D&&X.id===P;$e.setState(X,T,Gn)}let lt=!1;X.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==Dt.state.version||Ge.outputColorSpace!==ae||B.isBatchedMesh&&Ge.batching===!1||!B.isBatchedMesh&&Ge.batching===!0||B.isBatchedMesh&&Ge.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ge.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ge.instancing===!1||!B.isInstancedMesh&&Ge.instancing===!0||B.isSkinnedMesh&&Ge.skinning===!1||!B.isSkinnedMesh&&Ge.skinning===!0||B.isInstancedMesh&&Ge.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ge.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ge.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ge.instancingMorph===!1&&B.morphTexture!==null||Ge.envMap!==we||X.fog===!0&&Ge.fog!==oe||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==$e.numPlanes||Ge.numIntersection!==$e.numIntersection)||Ge.vertexAlphas!==be||Ge.vertexTangents!==Ee||Ge.morphTargets!==_e||Ge.morphNormals!==Le||Ge.morphColors!==xt||Ge.toneMapping!==vt||Ge.morphTargetsCount!==mt)&&(lt=!0):(lt=!0,Ge.__version=X.version);let Ut=Ge.currentProgram;lt===!0&&(Ut=Mn(X,z,B));let xn=!1,Kt=!1,Vn=!1;const Vt=Ut.getUniforms(),Jt=Ge.uniforms;if(Qe.useProgram(Ut.program)&&(xn=!0,Kt=!0,Vn=!0),X.id!==P&&(P=X.id,Kt=!0),xn||D!==T){Qe.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Vt.setValue(V,"projectionMatrix",T.projectionMatrix),Vt.setValue(V,"viewMatrix",T.matrixWorldInverse);const $n=Vt.map.cameraPosition;$n!==void 0&&$n.setValue(V,Be.setFromMatrixPosition(T.matrixWorld)),Xt.logarithmicDepthBuffer&&Vt.setValue(V,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Vt.setValue(V,"isOrthographic",T.isOrthographicCamera===!0),D!==T&&(D=T,Kt=!0,Vn=!0)}if(B.isSkinnedMesh){Vt.setOptional(V,B,"bindMatrix"),Vt.setOptional(V,B,"bindMatrixInverse");const Gn=B.skeleton;Gn&&(Gn.boneTexture===null&&Gn.computeBoneTexture(),Vt.setValue(V,"boneTexture",Gn.boneTexture,St))}B.isBatchedMesh&&(Vt.setOptional(V,B,"batchingTexture"),Vt.setValue(V,"batchingTexture",B._matricesTexture,St),Vt.setOptional(V,B,"batchingIdTexture"),Vt.setValue(V,"batchingIdTexture",B._indirectTexture,St),Vt.setOptional(V,B,"batchingColorTexture"),B._colorsTexture!==null&&Vt.setValue(V,"batchingColorTexture",B._colorsTexture,St));const ii=G.morphAttributes;if((ii.position!==void 0||ii.normal!==void 0||ii.color!==void 0)&&pt.update(B,G,Ut),(Kt||Ge.receiveShadow!==B.receiveShadow)&&(Ge.receiveShadow=B.receiveShadow,Vt.setValue(V,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Jt.envMap.value=we,Jt.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&z.environment!==null&&(Jt.envMapIntensity.value=z.environmentIntensity),Jt.dfgLUT!==void 0&&(Jt.dfgLUT.value=DM()),Kt&&(Vt.setValue(V,"toneMappingExposure",S.toneMappingExposure),Ge.needsLights&&k(Jt,Vn),oe&&X.fog===!0&&et.refreshFogUniforms(Jt,oe),et.refreshMaterialUniforms(Jt,X,Me,pe,v.state.transmissionRenderTarget[T.id]),rl.upload(V,uo(Ge),Jt,St)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(rl.upload(V,uo(Ge),Jt,St),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Vt.setValue(V,"center",B.center),Vt.setValue(V,"modelViewMatrix",B.modelViewMatrix),Vt.setValue(V,"normalMatrix",B.normalMatrix),Vt.setValue(V,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Gn=X.uniformsGroups;for(let $n=0,ql=Gn.length;$n<ql;$n++){const Fs=Gn[$n];He.update(Fs,Ut),He.bind(Fs,Ut)}}return Ut}function k(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function q(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(T,z,G){const X=ot.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(T.texture).__webglTexture=z,ot.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){const G=ot.get(T);G.__webglFramebuffer=z,G.__useDefaultFramebuffer=z===void 0};const Q=V.createFramebuffer();this.setRenderTarget=function(T,z=0,G=0){b=T,A=z,w=G;let X=!0,B=null,oe=!1,fe=!1;if(T){const we=ot.get(T);if(we.__useDefaultFramebuffer!==void 0)Qe.bindFramebuffer(V.FRAMEBUFFER,null),X=!1;else if(we.__webglFramebuffer===void 0)St.setupRenderTarget(T);else if(we.__hasExternalTextures)St.rebindTextures(T,ot.get(T.texture).__webglTexture,ot.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const _e=T.depthTexture;if(we.__boundDepthTexture!==_e){if(_e!==null&&ot.has(_e)&&(T.width!==_e.image.width||T.height!==_e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");St.setupDepthRenderbuffer(T)}}const be=T.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(fe=!0);const Ee=ot.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ee[z])?B=Ee[z][G]:B=Ee[z],oe=!0):T.samples>0&&St.useMultisampledRTT(T)===!1?B=ot.get(T).__webglMultisampledFramebuffer:Array.isArray(Ee)?B=Ee[G]:B=Ee,O.copy(T.viewport),Z.copy(T.scissor),ee=T.scissorTest}else O.copy(De).multiplyScalar(Me).floor(),Z.copy(Se).multiplyScalar(Me).floor(),ee=Ie;if(G!==0&&(B=Q),Qe.bindFramebuffer(V.FRAMEBUFFER,B)&&X&&Qe.drawBuffers(T,B),Qe.viewport(O),Qe.scissor(Z),Qe.setScissorTest(ee),oe){const we=ot.get(T.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+z,we.__webglTexture,G)}else if(fe){const we=z;for(let be=0;be<T.textures.length;be++){const Ee=ot.get(T.textures[be]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+be,Ee.__webglTexture,G,we)}}else if(T!==null&&G!==0){const we=ot.get(T.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,we.__webglTexture,G)}P=-1},this.readRenderTargetPixels=function(T,z,G,X,B,oe,fe,ae=0){if(!(T&&T.isWebGLRenderTarget)){hn("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(we=we[fe]),we){Qe.bindFramebuffer(V.FRAMEBUFFER,we);try{const be=T.textures[ae],Ee=be.format,_e=be.type;if(!Xt.textureFormatReadable(Ee)){hn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Xt.textureTypeReadable(_e)){hn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-X&&G>=0&&G<=T.height-B&&(T.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+ae),V.readPixels(z,G,X,B,gt.convert(Ee),gt.convert(_e),oe))}finally{const be=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(V.FRAMEBUFFER,be)}}},this.readRenderTargetPixelsAsync=async function(T,z,G,X,B,oe,fe,ae=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(we=we[fe]),we)if(z>=0&&z<=T.width-X&&G>=0&&G<=T.height-B){Qe.bindFramebuffer(V.FRAMEBUFFER,we);const be=T.textures[ae],Ee=be.format,_e=be.type;if(!Xt.textureFormatReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Xt.textureTypeReadable(_e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Le),V.bufferData(V.PIXEL_PACK_BUFFER,oe.byteLength,V.STREAM_READ),T.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+ae),V.readPixels(z,G,X,B,gt.convert(Ee),gt.convert(_e),0);const xt=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(V.FRAMEBUFFER,xt);const vt=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await pm(V,vt,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Le),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,oe),V.deleteBuffer(Le),V.deleteSync(vt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,G=0){const X=Math.pow(2,-G),B=Math.floor(T.image.width*X),oe=Math.floor(T.image.height*X),fe=z!==null?z.x:0,ae=z!==null?z.y:0;St.setTexture2D(T,0),V.copyTexSubImage2D(V.TEXTURE_2D,G,0,0,fe,ae,B,oe),Qe.unbindTexture()};const ne=V.createFramebuffer(),ce=V.createFramebuffer();this.copyTextureToTexture=function(T,z,G=null,X=null,B=0,oe=null){oe===null&&(B!==0?(Gr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let fe,ae,we,be,Ee,_e,Le,xt,vt;const dt=T.isCompressedTexture?T.mipmaps[oe]:T.image;if(G!==null)fe=G.max.x-G.min.x,ae=G.max.y-G.min.y,we=G.isBox3?G.max.z-G.min.z:1,be=G.min.x,Ee=G.min.y,_e=G.isBox3?G.min.z:0;else{const ii=Math.pow(2,-B);fe=Math.floor(dt.width*ii),ae=Math.floor(dt.height*ii),T.isDataArrayTexture?we=dt.depth:T.isData3DTexture?we=Math.floor(dt.depth*ii):we=1,be=0,Ee=0,_e=0}X!==null?(Le=X.x,xt=X.y,vt=X.z):(Le=0,xt=0,vt=0);const mt=gt.convert(z.format),Ge=gt.convert(z.type);let Dt;z.isData3DTexture?(St.setTexture3D(z,0),Dt=V.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(St.setTexture2DArray(z,0),Dt=V.TEXTURE_2D_ARRAY):(St.setTexture2D(z,0),Dt=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,z.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,z.unpackAlignment);const lt=V.getParameter(V.UNPACK_ROW_LENGTH),Ut=V.getParameter(V.UNPACK_IMAGE_HEIGHT),xn=V.getParameter(V.UNPACK_SKIP_PIXELS),Kt=V.getParameter(V.UNPACK_SKIP_ROWS),Vn=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,dt.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,dt.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,be),V.pixelStorei(V.UNPACK_SKIP_ROWS,Ee),V.pixelStorei(V.UNPACK_SKIP_IMAGES,_e);const Vt=T.isDataArrayTexture||T.isData3DTexture,Jt=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){const ii=ot.get(T),Gn=ot.get(z),$n=ot.get(ii.__renderTarget),ql=ot.get(Gn.__renderTarget);Qe.bindFramebuffer(V.READ_FRAMEBUFFER,$n.__webglFramebuffer),Qe.bindFramebuffer(V.DRAW_FRAMEBUFFER,ql.__webglFramebuffer);for(let Fs=0;Fs<we;Fs++)Vt&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ot.get(T).__webglTexture,B,_e+Fs),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ot.get(z).__webglTexture,oe,vt+Fs)),V.blitFramebuffer(be,Ee,fe,ae,Le,xt,fe,ae,V.DEPTH_BUFFER_BIT,V.NEAREST);Qe.bindFramebuffer(V.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(B!==0||T.isRenderTargetTexture||ot.has(T)){const ii=ot.get(T),Gn=ot.get(z);Qe.bindFramebuffer(V.READ_FRAMEBUFFER,ne),Qe.bindFramebuffer(V.DRAW_FRAMEBUFFER,ce);for(let $n=0;$n<we;$n++)Vt?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ii.__webglTexture,B,_e+$n):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,ii.__webglTexture,B),Jt?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Gn.__webglTexture,oe,vt+$n):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Gn.__webglTexture,oe),B!==0?V.blitFramebuffer(be,Ee,fe,ae,Le,xt,fe,ae,V.COLOR_BUFFER_BIT,V.NEAREST):Jt?V.copyTexSubImage3D(Dt,oe,Le,xt,vt+$n,be,Ee,fe,ae):V.copyTexSubImage2D(Dt,oe,Le,xt,be,Ee,fe,ae);Qe.bindFramebuffer(V.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else Jt?T.isDataTexture||T.isData3DTexture?V.texSubImage3D(Dt,oe,Le,xt,vt,fe,ae,we,mt,Ge,dt.data):z.isCompressedArrayTexture?V.compressedTexSubImage3D(Dt,oe,Le,xt,vt,fe,ae,we,mt,dt.data):V.texSubImage3D(Dt,oe,Le,xt,vt,fe,ae,we,mt,Ge,dt):T.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,oe,Le,xt,fe,ae,mt,Ge,dt.data):T.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,oe,Le,xt,dt.width,dt.height,mt,dt.data):V.texSubImage2D(V.TEXTURE_2D,oe,Le,xt,fe,ae,mt,Ge,dt);V.pixelStorei(V.UNPACK_ROW_LENGTH,lt),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Ut),V.pixelStorei(V.UNPACK_SKIP_PIXELS,xn),V.pixelStorei(V.UNPACK_SKIP_ROWS,Kt),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Vn),oe===0&&z.generateMipmaps&&V.generateMipmap(Dt),Qe.unbindTexture()},this.initRenderTarget=function(T){ot.get(T).__webglFramebuffer===void 0&&St.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?St.setTextureCube(T,0):T.isData3DTexture?St.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?St.setTexture2DArray(T,0):St.setTexture2D(T,0),Qe.unbindTexture()},this.resetState=function(){A=0,w=0,b=null,Qe.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Gt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Gt._getUnpackColorSpace()}}function Fn(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},o=n[0].morphTargetsRelative,c=new sn;let h=0;for(let d=0;d<n.length;++d){const u=n[d];let m=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,d),h+=p}}if(t){let d=0;const u=[];for(let m=0;m<n.length;++m){const p=n[m].index;for(let x=0;x<p.count;++x)u.push(p.getX(x)+d);d+=n[m].attributes.position.count}c.setIndex(u)}for(const d in a){const u=i0(a[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let m=0;m<u;++m){const p=[];for(let _=0;_<r[d].length;++_)p.push(r[d][_][m]);const x=i0(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function i0(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),o=new ti(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const u=c/t;for(let m=0,p=d.count;m<p;m++)for(let x=0;x<t;x++){const _=d.getComponent(m,x);o.setComponent(m+u,x,_)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class FM extends tf{constructor(){super();const e=new re;e.deleteAttribute("uv");const t=new W({side:zn}),i=new W,s=new _d(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new U(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new rn(e,i,6),o=new kt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new U(e,La(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new U(e,La(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new U(e,La(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new U(e,La(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const m=new U(e,La(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new U(e,La(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function La(n){return new Ox({color:0,emissive:16777215,emissiveIntensity:n})}const ol={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class nr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const UM=new yd(-1,1,1,-1,0,1);class zM extends sn{constructor(){super(),this.setAttribute("position",new Rt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Rt([0,2,0,0,2,0],2))}}const NM=new zM;class bd{constructor(e){this._mesh=new U(NM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,UM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class bf extends nr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof An?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Wr.clone(e.uniforms),this.material=new An({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new bd(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class s0 extends nr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class kM extends nr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class OM{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ne);this._width=i.width,this._height=i.height,t=new Si(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Bi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new bf(ol),this.copyPass.material.blending=Oi,this.clock=new xf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}s0!==void 0&&(r instanceof s0?i=!0:r instanceof kM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ne);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class BM extends nr{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new at}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const Go={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class VM extends nr{constructor(){super(),this.uniforms=Wr.clone(Go.uniforms),this.material=new kx({name:Go.name,uniforms:this.uniforms,vertexShader:Go.vertexShader,fragmentShader:Go.fragmentShader}),this._fsQuad=new bd(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Gt.getTransfer(this._outputColorSpace)===jt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===I0?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===F0?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===U0?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===jh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===N0?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===k0?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===z0&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const GM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new at(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ja extends nr{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ne(e.x,e.y):new Ne(256,256),this.clearColor=new at(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new Si(a,r,{type:Bi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new Si(a,r,{type:Bi});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const m=new Si(a,r,{type:Bi});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),a=Math.round(a/2),r=Math.round(r/2)}const o=GM;this.highPassUniforms=Wr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new An({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ne(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Wr.clone(ol.uniforms),this.blendMaterial=new An({uniforms:this.copyUniforms,vertexShader:ol.vertexShader,fragmentShader:ol.fragmentShader,blending:li,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new at,this._oldClearAlpha=1,this._basic=new Ct,this._fsQuad=new bd(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Ne(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ja.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ja.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new An({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ne(.5,.5)},direction:{value:new Ne(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new An({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ja.BlurDirectionX=new Ne(1,0);Ja.BlurDirectionY=new Ne(0,1);const ir=document.querySelector("#game"),ln=new IM({canvas:ir,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),ca=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;ln.setPixelRatio(Math.min(window.devicePixelRatio,ca?1.5:2));ln.setSize(window.innerWidth,window.innerHeight);ln.shadowMap.enabled=!ca;ln.info.autoReset=!1;ln.shadowMap.type=D0;ln.outputColorSpace=Lt;ln.toneMapping=jh;ln.toneMappingExposure=1.12;const Te=new tf;window.__steelRibbonScene=Te;Te.background=new at(16764588);Te.fog=new ud(14719602,360,2150);const wf=new Dh(ln);wf.compileEquirectangularShader();Te.environment=wf.fromScene(new FM,.04).texture;Te.environmentIntensity=.58;const xe=new jn(69,window.innerWidth/window.innerHeight,.08,1800);Te.add(xe);const Ye={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const je=new Set,Re={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},HM=new xf,on=new L(0,1,0),wd=new L,Sd=new L,Ol=new L,cn=new kt,Sf=.86,Fh=1.2,WM=.78,kn=.55,Ve={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ra=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Tf=Math.max(...ra.map(n=>n.width));let As=0,ie=ra[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new L,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Ye.best.textContent=`Best score ${l.best}`;let wi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function $i(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&wi==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}$i();function XM(){wi=wi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",wi),$i(),l.message=wi==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const Ho=[];function Gi(n,e=!1){let t=Ho.find(s=>!s.busy);t||(Ho.length>=4?t=Ho[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Ho.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Cn(n=880,e=.16,t="triangle",i=.16){if(!Pe)return;const{ctx:s}=Pe,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Pe.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let a0=0;function qM(){if(!Pe||Pe.ctx.currentTime-a0<.45)return;a0=Pe.ctx.currentTime;const{ctx:n}=Pe,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),o=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,o),r.gain.linearRampToValueAtTime(.05,o+.015),r.gain.setValueAtTime(.05,o+i),r.gain.exponentialRampToValueAtTime(1e-4,o+i+.04),s.connect(r),a.connect(r),r.connect(Pe.master),s.start(o),a.start(o),s.stop(o+i+.05),a.stop(o+i+.05)}}function YM(n){const e=ue.clamp(n,0,1);return e*e*(3-2*e)}function $M(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*ue.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-YM((e-i.end)/i.settle)))}return t}function Td(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function Ef(n,e){const{t,n:i}=Td(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let o=i-r.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),a+=r.amp*Math.exp(-(o*o)/(r.width*r.width))}return a+=$M(n,i),a}function Wo(n){const{x:e,z:t,n:i}=Td(ie,n),s=Ef(ie,i);return new L(e,s,t)}function _t(n){const e=(n%ie.length+ie.length)%ie.length,t=Wo(e),i=Wo(e+2).sub(t).normalize(),s=wd.crossVectors(on,i).normalize(),a=Wo(e-2).y,r=Wo(e+2).y,o=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=ie.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Hi(n){const e=(n%ie.length+ie.length)%ie.length;return ie.gaps.some(t=>e>t.start&&e<t.end)}function r0(n){return ue.clamp(n/(ie.length*ie.laps),0,1)}function Rc(n,e,t){const i=Math.floor(n/ie.length),s=Math.floor(e/ie.length);for(let a=i;a<=s;a++){const r=a*ie.length+t;if(n<r&&e>=r)return!0}return!1}function ZM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let o=0;o<e;o++)i.fillStyle=(o+r)%2?"#101318":"#f5f1df",i.fillRect(o*s,r*s,s,s);const a=new en(t);return a.colorSpace=Lt,a.wrapS=On,a.wrapT=On,a.repeat.set(3,1),a}function KM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(r,o),t.bezierCurveTo(r+Math.random()*22-11,o+36,r+Math.random()*22-11,o+82,r+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Lt,s.wrapS=On,s.wrapT=On,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),s}function JM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,o,0,r,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,o,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new en(e);return s.colorSpace=Lt,s.wrapS=On,s.wrapT=On,s.repeat.set(18,18),s.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),s}function jM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(r,o);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(r,o);t.stroke()}const s=new en(e);return s.colorSpace=Lt,s.wrapS=On,s.wrapT=On,s.repeat.set(9,16),s.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),s}function QM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new en(e);return s.colorSpace=Lt,s}function Ia(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new en(i);return a.colorSpace=Lt,a}function e_(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+u-2),s.moveTo(c+2,h+u*.52),s.lineTo(c+d-2,h+u*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new en(i);return o.colorSpace=Lt,o.wrapS=On,o.wrapT=On,o.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),o}function t_(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const o=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,o):t.lineTo(r,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Lt,s.wrapS=On,s.wrapT=On,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),s}function n_(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new en(t);return a.colorSpace=Lt,a}function o0(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:o}=s;a.fillStyle=t,a.fillRect(0,0,r,o),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,o-16),a.save(),a.translate(r/2,o/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new en(s);return c.colorSpace=Lt,c}const _s=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],yl=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],ys=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Af(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new en(i);return r.colorSpace=Lt,r.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),r}function Pc(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new en(t);return s.colorSpace=Lt,s}function Lc(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const o=new en(s);return o.colorSpace=Lt,o.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),o}function i_(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new en(t);return s.colorSpace=Lt,s.anisotropy=Math.min(16,ln.capabilities.getMaxAnisotropy()),s}function s_(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new en(e);return r.colorSpace=Lt,r}function le(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function Fa(n,e,t,i){const s=t*.5,a=i*.5;let r=le(n,e);for(const o of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,le(n+o,e+c));return r}function Bl(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:o,streetW:c}=Ve;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((a-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const Ss={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function In(n,e,t,i,s=8){const{x0:a,x1:r,zNear:o,zFar:c,pitch:h,streetW:d}=Ve,u=t*.5,m=i*.5,p=d*.5+s;let x=null;const _=(g,f,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:f,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+m<c-p||e-m>o+p)continue;const f=u+p-Math.abs(n-g);f>0&&_("x",Math.round(g),f)}for(let g=o;g>=c-1;g-=h){if(n+u<a-p||n-u>r+p)continue;const f=m+p-Math.abs(e-g);f>0&&_("z",Math.round(g),f)}return x}const oa=[],Cf=[],yn={spots:[],im:null,imW:null};function Rf(n=1){const e=new An({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return Cf.push(e),e}function Pf(n,e,t,i=t,s=null){oa.push({x:n,z:e,rx:t,rz:i,waterY:s})}function ta(n,e){let t=0,i=null;for(const s of oa){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,o=a*a+r*r;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=ue.clamp((s.waterY-le(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const Va=[],Dc=[],Ed=[];let bl=0;function mn(n,e){return Ed.push({obj:n,update:e}),n}function Lf(n){bl+=n;for(const e of Ed)e.update(bl,n)}function Vl(){if(Dc.length===0)for(let n=0;n<ra.length;n++){const e=ra[n];for(let t=0;t<e.length;t+=14){const i=Td(e,t);Dc.push({x:i.x,y:Ef(e,t),z:i.z,s:t,courseIndex:n})}}return Dc}function En(n,e,t=0){let i=null,s=1/0;for(const a of Vl()){const r=n-a.x,o=e-a.z,c=Math.hypot(r,o);c<s&&(s=c,i=a)}return{clearance:s-t-Tf*.58,distance:s,nearestS:i?.s??0}}function Hs(n,e,t,i,s,a=9){const r=t*.5,o=i*.5,c=Tf*.62+a;let h=null;for(const d of Vl()){const u=Math.max(Math.abs(d.x-n)-r,0),m=Math.max(Math.abs(d.z-e)-o,0),p=Math.hypot(u,m)-c;if(p>0)continue;const x=d.y-2.8,_=s-x;_<=0||(!h||_-p>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:p,verticalIntrusion:_,score:_-p})}return h}function xi(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(En(a.x,a.z,e).clearance>=t&&!In(a.x,a.z,e*2,e*2,3.5))return a}return null}function gi(n,e,t,i,s){const a=En(e,t,i);Va.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function a_(){const n=[...Va].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Va.length,unsafe:Va.filter(e=>e.clearance<e.margin),closest:n}}function qn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),o=new U(new Xe(i,i,r.length(),8),s);return o.position.copy(a),o.quaternion.setFromUnitVectors(on,r.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const vn={cloudMats:[],glowMats:[]};function r_(){const n=new Gx(16757626,3097190,.66);Te.add(n);const e=new wc(7179775,.6);e.position.set(260,145,-260),Te.add(e);const t=new wc(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Te.add(t);const i=new wc(16742973,.5);i.position.set(-180,35,280),Te.add(i);const s=new _d(5556479,90,900,2);s.position.set(0,88,-920),Te.add(s),vn.hemi=n,vn.fill=e,vn.key=t,vn.rim=i}let vi=null;function o_(){const n=new L(-310,150,230).normalize();vi=new U(new Ot(1200,48,32),new An({side:zn,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
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
        }`})),vi.renderOrder=-100,vi.frustumCulled=!1,Te.add(vi);const e=n,t=new Ct({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new U(new bn(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),vi.add(i);const s=new Ct({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:li});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const o=new U(new bn(a,48),s.clone());o.material.opacity=r,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),vi.add(o),vn.glowMats.push({mat:o.material,dusk:r})}vn.skyU=vi.material.uniforms,vn.sunMat=t}function l_(){const n=new W({map:JM(),color:8231526,roughness:.98,metalness:.02}),e=new U(new Nt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let m=0;m<t.count;m++){const p=t.getX(m),x=t.getY(m);t.setZ(m,le(p,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Te.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:At});for(let m=0;m<3;m++){const p=150-m*190,x=-760-m*420,_=980,g=64+m*18,f=new U(new Nt(980,64+m*18,1,1),i.clone());f.rotation.x=-Math.PI/2,f.rotation.z=-.34+m*.03,f.position.set(p,Fa(p,x,_,g)-.55,x),f.renderOrder=-4,Te.add(f)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let m=0;m<46;m++){const p=28+Math.random()*90,x=-900+Math.random()*1800,_=-260-Math.random()*1780,g=[le(x,_)];for(let y=0;y<6;y++)g.push(le(x+Math.cos(y)*p*.9,_+Math.sin(y*1.9)*p*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const f=new U(new bn(p,9),s[m%s.length]);f.rotation.x=-Math.PI/2,f.rotation.z=Math.random()*Math.PI,f.position.set(x,Math.max(...g)+.07,_),f.scale.y=.32+Math.random()*.5,f.receiveShadow=!0,Te.add(f)}const a=new Ct({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let m=0;m<32;m++){const p=new U(new bn(70+Math.random()*150,22),a.clone());p.material.opacity=.008+Math.random()*.014,p.rotation.x=-Math.PI/2,p.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),p.position.y<8&&Ss.lowFogDisks++,p.scale.y=.22+Math.random()*.26,p.renderOrder=-6,Te.add(p)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let m=0;m<52;m++){const p=78+Math.random()*180,x=52+Math.random()*115,_=xi(f=>{const y=m/52*Math.PI*2+f*1.77,v=1380+Math.random()*820+f*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!_)continue;const g=new U(new Fi(x,p,5+Math.floor(Math.random()*2)),r[m%r.length]);if(g.position.set(_.x,-9,_.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Te.add(g),gi("mountain",_.x,_.z,x,480),p>160){const f=new U(new Fi(x*.34,p*.22,5),o);f.position.copy(g.position).add(new L(0,p*.39,0)),f.rotation.y=g.rotation.y,Te.add(f)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const m=new Xe(.28,.42,1,6).translate(0,.5,0),p=Fn([new Fi(2.7,5.4,7).translate(0,1.9,0),new Fi(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Fi(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new at(v)),_=new rn(m,c,185),g=new rn(p,new W({roughness:.92}),185),f=new kt;let y=0;for(let v=0;v<185;v++){const M=.58+Math.random()*1.05,E=8*M,S=xi(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!S)continue;const{x:C,z:A}=S;if(Bl(C,A,18))continue;const w=le(C,A)+.8,b=2.2+Math.random()*3.8;f.position.set(C,w,A),f.rotation.y=Math.random()*Math.PI,f.scale.set(M,b,M),f.updateMatrix(),_.setMatrixAt(y,f.matrix),f.position.set(C,w+b,A),f.scale.set(M,M,M),f.updateMatrix(),g.setMatrixAt(y,f.matrix),g.setColorAt(y,x[v%3]),y++,gi("tree",C,A,E,145)}_.count=y,g.count=y,_.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Te.add(_),Te.add(g)}{const m=x=>{const _=document.createElement("canvas");_.width=256,_.height=128;const g=_.getContext("2d"),f=(v,M)=>Math.sin(x*M+v*37.7)*.5+.5;for(let v=0;v<16;v++){const M=v/15,E=Math.sin(M*Math.PI),S=24+M*208,C=66+(f(v,53)-.5)*22*E,A=(18+f(v,29)*22)*(.45+E*.75),w=g.createRadialGradient(S,C-A*.18,0,S,C,A);w.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),w.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),w.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=w,g.beginPath(),g.arc(S,C,A,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const M=.12+v/9*.76,E=M*256,S=20+f(v,71)*16,C=g.createRadialGradient(E,92,0,E,92,S);C.addColorStop(0,"rgba(255, 176, 128, 0.22)"),C.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=C,g.beginPath(),g.arc(E,92,S,0,Math.PI*2),g.fill()}const y=new en(_);return y.colorSpace=Lt,y},p=[m(1),m(2),m(3)];ge.cloudSprites=0;for(let x=0;x<44;x++){const _=new Il({map:p[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new xl(_),f=170+Math.random()*280;g.scale.set(f,f*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Te.add(g),ge.cloudSprites++,mn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let m=0;m<44;m++){const p=new tt,x=20+Math.random()*95,_=8+Math.random()*18,g=8+Math.random()*18,f=new U(new re(_,x,g),h[m%h.length]);f.position.y=x/2,f.castShadow=!0,f.receiveShadow=!0,p.add(f);const y=Ia(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const C of[-1,1]){const A=new U(new Nt(_*.82,x*.74),v);A.position.set(0,x*.53,C*(g/2+.08)),A.rotation.y=C<0?Math.PI:0,p.add(A)}const M=new U(new re(_*1.08,1.2,g*1.08),d);if(M.position.y=x+.7,p.add(M),Math.random()<.32){const C=new U(new Xe(.18,.3,10+Math.random()*12,8),d);C.position.y=x+6.5,p.add(C)}const E=Math.hypot(_,g)*.65,S=xi(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);S&&(p.position.set(S.x,Fa(S.x,S.z,_,g)-.7,S.z),p.rotation.y=Math.random()*Math.PI,Te.add(p),gi("building",S.x,S.z,E,240))}const u=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let m=0;m<18;m++){const p=new tt,x=_s[m%_s.length],_=yl[(m*3+1)%yl.length],g=ys[m%ys.length],f=new W({map:Af(x,_,g),color:16777215,roughness:.22,metalness:.04,emissive:new at(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,M=new U(new re(y,v,.5),f);M.position.y=10,p.add(M);const E=new U(new re(y+1.2,.32,.75),u);E.position.y=10+v*.5+.25,p.add(E);for(const C of[-7,7]){const A=new U(new Xe(.24,.32,10,8),u);A.position.set(C,5,-.2),p.add(A)}const S=xi(()=>({x:-780+Math.random()*1560,z:-450-m*135+Math.random()*80-40}),22,175,50);S&&(p.position.set(S.x,le(S.x,S.z)+.5,S.z),p.rotation.y=-.35+Math.random()*.7,Te.add(p),gi("billboard",S.x,S.z,22,175),Ws("roadside-billboard",S.x,p.position.y+10,S.z))}}function c_(){for(let f=0;f<3;f++){const y=[4012638,5326704,7035525][f],v=new Ct({color:y,transparent:!0,opacity:.6-f*.14,depthWrite:!1,fog:!1}),M=60,E=5200,S=new Nt(E,360,M,1),C=S.attributes.position;for(let w=0;w<=M;w++){const b=w/M,P=(Math.sin(b*22+f*3)*.5+Math.sin(b*9+f)*.5)*70+120;C.setY(w,P),C.setY(w+M+1,-180)}C.needsUpdate=!0;const A=new U(S,v);A.position.set(0,40,-2300-f*360),Te.add(A)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let f=0;f<48;f++){const y=.7+Math.random()*1.2,v=9*y,M=xi(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!M)continue;const{x:E,z:S}=M;if(Bl(E,S,18))continue;const C=le(E,S)+.6,A=new tt,w=2.6+Math.random()*3.4,b=new U(new Xe(.34,.5,w,6),n);b.position.y=w/2,A.add(b);const P=e[Math.floor(Math.random()*e.length)],D=3+Math.floor(Math.random()*3);for(let O=0;O<D;O++){const Z=2.4+Math.random()*1.8,ee=new U(new Ot(Z,9,7),P);ee.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),ee.scale.y=.82+Math.random()*.3,A.add(ee)}A.position.set(E,C,S),A.scale.setScalar(y),Te.add(A),gi("tree",E,S,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:At}),new W({color:9077368,roughness:1,flatShading:!0,side:At}),new W({color:6249043,roughness:1,flatShading:!0,side:At})];for(let f=0;f<70;f++){const y=2+Math.random()*7,v=xi(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:M,z:E}=v,S=new U(new vd(y,0),t[f%t.length]),C=S.geometry.attributes.position;for(let A=0;A<C.count;A++)C.setXYZ(A,C.getX(A)*(.8+Math.random()*.4),C.getY(A)*(.6+Math.random()*.4),C.getZ(A)*(.8+Math.random()*.4));C.needsUpdate=!0,S.geometry.computeVertexNormals(),S.position.set(M,le(M,E)+y*.35,E),S.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),S.castShadow=!0,Te.add(S),_i.push({kind:"rock",x:M,z:E,radius:y*1.12}),gi("rock",M,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let f=0;f<14;f++){const y=130+Math.random()*200,v=130+Math.random()*200,M=xi(()=>{for(let P=0;P<6;P++){const D=-1500+Math.random()*3e3,O=-700-Math.random()*1700,Z=[le(D,O),le(D+y*.45,O+v*.45),le(D-y*.45,O+v*.45),le(D+y*.45,O-v*.45),le(D-y*.45,O-v*.45)];if(Math.max(...Z)-Math.min(...Z)<1)return{x:D,z:O}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!M||M.x>9e4)continue;const{x:E,z:S}=M,C=new tt,A=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let P=0;P<A;P++){const D=new W({color:P%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),O=new U(new Nt(y,v/A),D);O.rotation.x=-Math.PI/2,O.position.set(0,.05,-v/2+(P+.5)*(v/A)),C.add(O)}const b=Math.max(le(E,S),le(E+y*.45,S+v*.45),le(E-y*.45,S+v*.45),le(E+y*.45,S-v*.45),le(E-y*.45,S-v*.45));C.position.set(E,b+.06,S),C.rotation.y=Math.random()*Math.PI,Te.add(C),gi("field",E,S,Math.max(y,v)*.5,40)}{const f=xi(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(f){const y=[le(f.x,f.z)];for(let E=0;E<8;E++)y.push(le(f.x+Math.cos(E/8*Math.PI*2)*110,f.z+Math.sin(E/8*Math.PI*2)*74),le(f.x+Math.cos(E/8*Math.PI*2)*200,f.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,S)=>E-S);const v=y[4]+.4,M=new U(new bn(150,48),Rf(9));M.rotation.x=-Math.PI/2,M.position.set(f.x,v,f.z),M.scale.set(1.5,1,1),M.renderOrder=-4,Te.add(M),Pf(f.x,f.z,222,148,v),Ss.waterBlockers++,gi("lake",f.x,f.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let f=0;f<9;f++){const y=f/9*Math.PI*2+.6,v=1500+Math.random()*700,M=Math.cos(y)*v,E=Math.sin(y)*v-1150,S=60+Math.random()*40,C=new tt,A=new U(new Xe(1.1,2.2,S,10),s);A.position.y=S/2,C.add(A);const w=new tt;w.position.set(0,S,3);const b=new U(new re(3,3,7),s);w.add(b);const P=new tt;P.position.z=3.5;for(let O=0;O<3;O++){const Z=new U(new re(1.1,26,.5),s);Z.position.y=13;const ee=new tt;ee.add(Z),ee.rotation.z=O/3*Math.PI*2,P.add(ee)}w.add(P),C.add(w),C.position.set(M,-8,E),C.rotation.y=Math.random()*Math.PI,Te.add(C);const D=.5+Math.random()*.5;mn(P,O=>{P.rotation.z=O*D})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new vl({color:2764595,transparent:!0,opacity:.5});let o=null;for(let f=0;f<7;f++){const y=-1100+f*360,v=-1650-Math.sin(f*.7)*120,M=48,E=new tt,S=6;for(const A of[-1,1])for(const w of[-1,1]){const b=new U(new Xe(.4,.7,M,5),a);b.position.set(A*S,M/2,w*S),b.rotation.z=-A*.08,b.rotation.x=w*.08,E.add(b)}for(const A of[M*.6,M*.82,M]){const w=new U(new re(S*4,.8,.8),a);w.position.y=A,E.add(w)}E.position.set(y,le(y,v)-2,v),Te.add(E);const C=le(y,v)-2+M;if(o)for(const A of[-S*2,0,S*2]){const w=o.x+A,b=o.z,P=y+A,D=v,O=[],Z=12;for(let Y=0;Y<=Z;Y++){const J=Y/Z,te=Math.sin(J*Math.PI)*6;O.push(new L(w+(P-w)*J,o.y-te+(C-o.y)*J,b+(D-b)*J))}const ee=new Ch(new sn().setFromPoints(O),r);Te.add(ee)}o={x:y,y:C,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let f=0;f<5;f++){const y=xi(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:M}=y,E=70+Math.random()*50,S=new tt,C=8;for(let P=0;P<C;P++){const D=new U(new Xe(.5,.7,E/C,4),P%2?h:c);D.position.y=(P+.5)*(E/C),D.rotation.y=Math.PI/4,S.add(D)}const A=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new U(new Ot(1.1,10,8),A);w.position.y=E+1,S.add(w),S.position.set(v,le(v,M),M),Te.add(S),gi("mast",v,M,8,120);const b=Math.random()*Math.PI*2;mn(w,P=>{A.emissiveIntensity=Math.sin(P*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let f=0;f<6;f++){const y=new tt,v=d[f%d.length],M=new W({map:E_(v[0],v[1]),roughness:.5,metalness:.05,emissive:new at(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new U(new Ot(11,20,16),M);E.scale.y=1.25,y.add(E);const S=new U(new re(3.4,3,3.4),new W({color:8014371,roughness:.9}));S.position.y=-17,y.add(S);const C=new vl({color:3811866});for(const D of[-1,1])for(const O of[-1,1]){const Z=new Ch(new sn().setFromPoints([new L(D*1.6,-15.5,O*1.6),new L(D*7,-3,O*7)]),C);y.add(Z)}const A=-700+Math.random()*1400,w=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(A,b,w),Te.add(y);const P=Math.random()*Math.PI*2;mn(y,D=>{y.position.y=b+Math.sin(D*.5+P)*6,y.position.x=A+Math.sin(D*.08+P)*90,y.rotation.z=Math.sin(D*.4+P)*.04})}const u=new Ct({color:2829104,side:At,fog:!1});function m(){const f=new gd;return f.moveTo(0,0),f.lineTo(-2.6,1.1),f.lineTo(-2.2,.2),f.lineTo(0,.5),f.lineTo(2.2,.2),f.lineTo(2.6,1.1),f.lineTo(0,0),new U(new zl(f),u)}for(let f=0;f<5;f++){const y=new tt,v=5+Math.floor(Math.random()*5),M=[];for(let P=0;P<v;P++){const D=m(),O=P%2?1:-1,Z=Math.ceil(P/2);D.position.set(O*Z*5,-Z*2.4,0),D.rotation.x=-Math.PI/2,y.add(D),M.push(D)}const E=150+Math.random()*120,S=-500-Math.random()*1400,C=18+Math.random()*14,A=1400,w=-700+Math.random()*1400;y.position.set(w,E,S),Te.add(y);const b=Math.random()*Math.PI*2;mn(y,(P,D)=>{y.position.x+=C*D,y.position.x>A&&(y.position.x=-A);const O=Math.sin(P*6+b);for(const Z of M)Z.rotation.x=-Math.PI/2+O*.4})}{const f=new tt,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new U(new Ot(20,20,16),y);v.scale.set(2.6,1,1),f.add(v);const M=new W({color:13781835,roughness:.6});for(let w=0;w<3;w++){const b=new U(new re(10,9,.6),M);b.position.x=-46,b.rotation.x=w/3*Math.PI*2,f.add(b)}const E=new U(new re(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,f.add(E);const S=new U(new Nt(40,10),new Ct({map:Cd("STEEL RIBBON"),transparent:!0,side:At}));S.position.set(60,0,0),f.add(S);const C=900,A=240;f.position.set(0,A,-1200),Te.add(f),mn(f,w=>{const b=w*.05;f.position.x=Math.cos(b)*C,f.position.z=-1200+Math.sin(b)*C*.5,f.position.y=A+Math.sin(w*.3)*8,f.rotation.y=-b+Math.PI/2})}const p=new Ct({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let f=0;f<14;f++){const y=new U(new Nt(220+Math.random()*360,16+Math.random()*22),p.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Te.add(y);const v=2+Math.random()*3;mn(y,(M,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),_=new Ct({map:A_(),side:At});for(let f=0;f<4;f++){const y=xi(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:M}=y,E=new tt,S=60+Math.random()*40,C=new U(new re(S,1.4,26),x);C.position.set(0,26,-4),C.rotation.x=-.32,E.add(C);const A=new U(new Nt(S*.94,24),_);A.position.set(0,12,6),A.rotation.x=-.85,E.add(A);for(const w of[-S/2,S/2]){const b=new U(new re(1.4,26,1.4),x);b.position.set(w,13,-8),E.add(b)}E.position.set(v,le(v,M),M),E.rotation.y=Math.atan2(-v,-M)+(Math.random()-.5)*.5,Ys.stands.push({x:v,z:M,yaw:E.rotation.y,w:S,gy:E.position.y}),Te.add(E),gi("grandstand",v,M,40,30)}Ys.init();const g=[16731486,16765503,16777215,11824127];for(let f=0;f<90;f++){const y=xi(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:M}=y,E=new tt,S=g[Math.floor(Math.random()*g.length)],C=new Ct({color:S,side:At}),A=5+Math.floor(Math.random()*6);for(let w=0;w<A;w++){const b=new U(new bn(.5+Math.random()*.4,5),C);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,le(v,M),M),Te.add(E),gi("flowers",v,M,3,20)}}const pn=[],ri=[];let Uh=0;const _i=[],ha=[],Rn=[],Ua=[],Cs=[],Ga=[],ge={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},wl=[];function Ws(n,e,t,i){ge.signs++,wl.length<160&&wl.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function ms(n,e,t=1){ge[n][e]=(ge[n][e]||0)+t}let Xo=null,l0=null;function sr(){return Xo||(Xo=new W({vertexColors:!0,roughness:.42,metalness:.22}),Xo.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},l0=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:Xo,glass:l0}}const xs=new at;function ut(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,o=new Float32Array(r*3),c=new Float32Array(r*3);xs.set(t??16777215);for(let h=0;h<r;h++)o[h*3]=xs.r,o[h*3+1]=xs.g,o[h*3+2]=xs.b;if(i){xs.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=xs.r,c[h*3+1]=xs.g,c[h*3+2]=xs.b}return a.setAttribute("color",new Rt(o,3)),a.setAttribute("aEmissive",new Rt(c,3)),a}function yt(n,e,t,i=0){return(i?new Tt().makeRotationZ(i):new Tt).setPosition(n,e,t)}function so(n,e){const t=new tt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=sr(),o=n==="taxi"?16767293:e,c=new at(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(ut(new re(s.w,s.h,s.l),yt(0,.95,0),o)),(s.bus?d:h).push(ut(new re(s.cabin[0],s.cabin[1],s.cabin[2]),yt(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(ut(new re(s.cabin[0]*.78,s.cabin[1]*.55,.08),yt(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(ut(new re(.08,s.cabin[1]*.5,s.cabin[2]*.48),yt(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(ut(new re(s.w*.94,.58,s.l*.38),yt(0,1.2,1.35),c)),s.box&&h.push(ut(new re(s.box[0],s.box[1],s.box[2]),yt(0,1.55,1.25),15130833)),s.bus){h.push(ut(new re(s.w+.06,.28,s.l*.86),yt(0,1.38,0),c));const y=new re(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const M of[-1,1])d.push(ut(y,yt(M*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(ut(new re(1,.24,.46),yt(0,2.2,-.35),16774310,16765773,.9));const u=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],m=[],p=Fn([ut(new Xe(.42,.42,.36,14),yt(0,0,0,Math.PI/2),395016),ut(new Xe(.18,.18,.38,10),yt(0,0,0,Math.PI/2),14147041)],!1),x=new re(.3,.34,1.12);for(const y of u)for(const v of[-s.w*.54,s.w*.54]){const M=new U(p,a);M.position.set(v,.45,y),t.add(M),m.push(M),h.push(ut(x,yt(v*1.02,.72,y),1250072))}const _=new re(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(ut(_,yt(0,.62,y),1250072));const g=new re(.42,.2,.1),f=new re(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(ut(g,yt(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(ut(f,yt(y,.98,s.l*.52+.04),16725033,16717325,1.45));if(s.bus){const y=[11893070,9657655,13018202,8541761][(e>>>4)%4],v=-s.cabin[0]*.27,M=s.cabinZ-s.cabin[2]/2+.55;h.push(ut(new Ot(.155,8,6),yt(v,2.06,M),y));const E=new Ot(.145,8,5);E.scale(1,.55,1),h.push(ut(E,yt(v,2.18,M),1119001))}return t.add(new U(Fn(h,!1),a)),d.length&&t.add(new U(Fn(d,!1),r)),t.userData={wheels:m,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55,plateHalfL:s.l/2,hasDriver:!!s.bus},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function Ad(n,e){const t=new tt,{opaque:i}=sr(),s=new Ot(.25,8,5);s.scale(1,.5,1),t.add(new U(Fn([ut(new Xe(.28,.34,.95,8),yt(0,1.35,0),n),ut(new Ot(.24,10,8),yt(0,2.02,0),12947299),ut(s,yt(0,2.17,0),1119001)],!1),i));const a=[],r=ut(new Xe(.075,.09,.78,6),null,e),o=ut(new Xe(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new U(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new U(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}const c0="BCDFGHJKLMNPRSTVWXZ",h_=["FCK","SHT","DCK","CNT","KKK","WTF","FML","NGR","FGT","SLT","DMN","BTC","JZZ"],qo=340;function Df(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}let Yo=null;function d_(){if(Yo)return Yo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<64;s++){const a=Df(335585+s*2654435761);let r="";do{r="";for(let d=0;d<3;d++)r+=c0[a()*c0.length|0]}while(h_.includes(r));r+=" ";for(let d=0;d<3;d++)r+=a()*10|0;t.push(r);const o=s%8*128,c=(s/8|0)*64,h=s%9===3;e.fillStyle=h?"#f3d268":"#ece9dc",e.fillRect(o+6,c+8,116,48),e.strokeStyle="#25304d",e.lineWidth=3,e.strokeRect(o+7.5,c+9.5,113,45),e.fillStyle="#1c2848",e.textAlign="center",e.textBaseline="middle",e.font="bold 30px 'Courier New', monospace",e.fillText(r,o+64,c+38),e.font="bold 10px sans-serif",e.fillText("STEEL STATE",o+64,c+17)}const i=new en(n);return i.colorSpace=Lt,i.anisotropy=4,Yo={texture:i,texts:t},Yo}const u_=new L(1,1,1),Ic=new Tt,$o=new Tt,Ui={mesh:null,texts:null,statics:[],dynamics:[],_zero:new Tt().makeScale(0,0,0),ensure(){if(this.mesh)return;const{texture:n,texts:e}=d_();this.texts=e;const t=new Nt(.55,.17);t.setAttribute("aPlateSlot",new gl(new Float32Array(qo*2),2));const i=new Ct({map:n});i.customProgramCacheKey=()=>"plate-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aPlateSlot;
varying vec2 vPlateUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPlateUv = uv * 0.125 + aPlateSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vPlateUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vPlateUv );")},this.mesh=new rn(t,i,qo),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;for(let s=0;s<qo;s++)this.mesh.setMatrixAt(s,this._zero);Te.add(this.mesh)},_slot(n){const e=n%64;return{u:e%8*.125,v:(7-(e/8|0))*.125,s:e}},_offsets(n,e=.03){return{offF:new Tt().makeRotationY(Math.PI).setPosition(0,.62,-(n+e)),offR:new Tt().setPosition(0,.62,n+e)}},resetStatic(){this.ensure(),this.statics.length=0;for(let n=0;n<260;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},resetDynamic(){this.ensure(),this.dynamics.length=0;for(let n=260;n<qo;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},addStatic(n,e,t,i){if(this.ensure(),this.statics.length>=130)return;const s=this.statics.length*2,{u:a,v:r,s:o}=this._slot(t*13+29),c={matrix:n.clone(),spot:i,wasTaken:null,iF:s,iR:s+1,slot:o,...this._offsets(e)},h=this.mesh.geometry.getAttribute("aPlateSlot");h.setXY(c.iF,a,r),h.setXY(c.iR,a,r),h.needsUpdate=!0,this.statics.push(c),this._applyStatic(c)},_applyStatic(n){n.wasTaken=!!(n.spot&&n.spot.taken),n.wasTaken?(this.mesh.setMatrixAt(n.iF,this._zero),this.mesh.setMatrixAt(n.iR,this._zero)):(this.mesh.setMatrixAt(n.iF,$o.multiplyMatrices(n.matrix,n.offF)),this.mesh.setMatrixAt(n.iR,$o.multiplyMatrices(n.matrix,n.offR))),this.mesh.instanceMatrix.needsUpdate=!0},addDynamic(n,e){if(this.ensure(),this.dynamics.length>=40)return;const t=260+this.dynamics.length*2,{u:i,v:s,s:a}=this._slot(e*37+11),r=this.mesh.geometry.getAttribute("aPlateSlot");r.setXY(t,i,s),r.setXY(t+1,i,s),r.needsUpdate=!0,this.dynamics.push({carMesh:n,iF:t,iR:t+1,slot:a,...this._offsets(n.userData.plateHalfL||2.2,.155)})},update(){if(!(!this.mesh||!this.dynamics.length)){for(const n of this.dynamics)Ic.compose(n.carMesh.position,n.carMesh.quaternion,u_),this.mesh.setMatrixAt(n.iF,$o.multiplyMatrices(Ic,n.offF)),this.mesh.setMatrixAt(n.iR,$o.multiplyMatrices(Ic,n.offR));for(const n of this.statics)!!(n.spot&&n.spot.taken)!==n.wasTaken&&this._applyStatic(n);this.mesh.instanceMatrix.needsUpdate=!0}}},Ys={stands:[],torsos:null,heads:null,active:-1,cap:0,figures:0,_seats:[],init(){if(this.torsos||!this.stands.length)return;this.cap=ca?140:280;const{opaque:n}=sr(),e=ut(new re(.52,.6,.38),null,16777215),t=ut(new Ot(.17,7,5),yt(0,.45,0),12947299);this.torsos=new rn(e,n,this.cap),this.heads=new rn(t,n,this.cap);const i=new at,s=[16731486,16765503,4111086,16777215,15121483,5025616,16744576,3392239];for(let a=0;a<this.cap;a++)this.torsos.setColorAt(a,i.set(s[a%s.length]));this.torsos.instanceColor&&(this.torsos.instanceColor.needsUpdate=!0);for(const a of[this.torsos,this.heads])a.frustumCulled=!1,a.castShadow=!1,a.receiveShadow=!1,a.visible=!1,a.count=0,Te.add(a);mn(this.torsos,a=>this.update(a))},_layout(n){this._seats.length=0;const e=Math.cos(-.85),t=Math.sin(-.85),i=Math.cos(n.yaw),s=Math.sin(n.yaw),a=Math.min(46,Math.floor(n.w*.9/1.7)),r=Math.min(6,Math.floor(this.cap/a));for(let o=0;o<r;o++)for(let c=0;c<a&&!(this._seats.length>=this.cap);c++){const h=-((a-1)*1.7)/2+c*1.7,d=-9.5+o*3.4,u=h,m=12+d*e+.35*-t,p=6+d*t+.35*e;this._seats.push({x:n.x+u*i+p*s,y:n.gy+m,z:n.z-u*s+p*i,ph:c*.42+o*.9})}this.figures=this._seats.length},update(n){if(!this.torsos)return;const e=xe.position.x,t=xe.position.z;let i=-1,s=4900;for(let r=0;r<this.stands.length;r++){const o=this.stands[r],c=(o.x-e)*(o.x-e)+(o.z-t)*(o.z-t);c<s&&(s=c,i=r)}if(i<0){this.active>=0&&(this.active=-1,this.torsos.visible=!1,this.heads.visible=!1);return}i!==this.active&&(this.active=i,this._layout(this.stands[i]),this.torsos.count=this.figures,this.heads.count=this.figures,this.torsos.visible=!0,this.heads.visible=!0);const a=new Tt;for(let r=0;r<this.figures;r++){const o=this._seats[r],c=Math.max(0,Math.sin(n*2.2-o.ph))*.5;a.makeRotationY(this.stands[this.active].yaw+Math.PI),a.setPosition(o.x,o.y+c,o.z),this.torsos.setMatrixAt(r,a),this.heads.setMatrixAt(r,a)}this.torsos.instanceMatrix.needsUpdate=!0,this.heads.instanceMatrix.needsUpdate=!0}},zh=40,h0=[[["running late again","me"],["the ribbon jam??","them"],["every. time.","me"]],[["pizza tonight?","them"],["obviously","me"],["extra olives","them"]],[["did u see that stunt","me"],["the triple flip?!","them"],["unreal","me"]],[["buy milk pls","them"],["on it","me"],["and cookies","them"]],[["gate 8 is glowing","me"],["on my way!!","them"]],[["new high score","me"],["screenshot or it","them"],["didn't happen","them"]],[["taxi 27 honked at me","me"],["classic 27","them"]],[["lost my parking spot","me"],["someone STOLE it??","them"],["drove right off","me"]]];let Zo=null;function f_(){if(Zo)return Zo;const n=document.createElement("canvas");n.width=512,n.height=512;const e=n.getContext("2d");for(let i=0;i<8;i++){const s=i%4*128,a=(i/4|0)*256,r=h0[i%h0.length];e.fillStyle="#101823",e.fillRect(s,a,128,256),e.fillStyle="#1c2a3a",e.fillRect(s,a,128,26),e.fillStyle="#9fd6ff",e.font="bold 14px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("chat",s+64,a+14),e.font="bold 16px sans-serif",e.textAlign="left";let o=a+42;for(const[c,h]of r){const d=h==="me",u=Math.min(116,e.measureText(c).width+14),m=d?s+124-u:s+4;e.fillStyle=d?"#2f7fd4":"#2a3546",e.beginPath(),e.roundRect(m,o,u,34,10),e.fill(),e.fillStyle="#eaf4ff",e.fillText(c,m+7,o+18),o+=42}}const t=new en(n);return t.colorSpace=Lt,t.anisotropy=4,Zo={texture:t,mat:new Ct({map:t})},Zo}const za={kits:null,pool:0,_timer:0,ensure(){if(this.kits)return;this.pool=ca?4:8;const{opaque:n}=sr(),e=[1976625,3153952,5985575,2503224,4400680,1710618,5124895,3355970],t=[9067082,7952701,10707786,8341813,9067082,7952701,10707786,8341813],i=[3087378,1975326,4022546,3087378,1975326,4022546,3087378,1975326];this.kits=[];for(let s=0;s<this.pool;s++){const a=[],r=new Ot(.038,6,5),o=new re(.078,.02,.02),c=new Ot(.03,6,5),h=new re(.09,.022,.02);for(const b of[-.085,.085])a.push(ut(r,yt(b,2.06,-.198),1842476)),a.push(ut(o,yt(b,2.118,-.207),i[s%i.length]));a.push(ut(c,yt(0,2,-.229),11893070)),a.push(ut(h,yt(0,1.935,-.216),t[s%t.length]));const d=new U(Fn(a,!1),n),u=ut(new Ot(.056,6,5),null,12947299),m=ut(new re(.13,.07,.24),null,e[s%e.length]),p=new U(u,n),x=new U(u,n),_=new U(m,n),g=new U(m,n);p.position.set(0,-.38,0),x.position.set(0,-.38,0),_.position.set(0,-.42,-.045),g.position.set(0,-.42,-.045);const f=f_(),y=new tt,v=new U(ut(new re(.075,.15,.014),null,1315356),n),M=new Nt(.062,.128),E=s%4*.25,S=1-((s/4|0)+1)*.5,C=M.attributes.uv;for(let b=0;b<C.count;b++)C.setXY(b,E+C.getX(b)*.25,S+C.getY(b)*.5);const A=new U(M,f.mat);A.position.z=.0095,y.add(v),y.add(A),y.position.set(.34,1.47,-.36),y.quaternion.setFromUnitVectors(new L(0,0,1),new L(-.34,.55,.36).normalize());const w={face:d,handL:p,handR:x,shoeL:_,shoeR:g,phone:y,texting:!1,ped:null};for(const b of[d,p,x,_,g,y,v,A])b.userData.kitPart=!0,b.castShadow=!1,b.receiveShadow=!0;this.kits.push(w)}},attach(n,e,t){const i=e.mesh,s=i.userData.limbs||[];i.add(n.face),s[0]?.mesh.add(n.shoeL),s[1]?.mesh.add(n.shoeR),s[2]?.mesh.add(n.handL),s[3]?.mesh.add(n.handR),n.texting=!!t,n.texting&&i.add(n.phone),n.ped=e},detach(n){for(const e of[n.face,n.handL,n.handR,n.shoeL,n.shoeR,n.phone])e.removeFromParent();n.ped=null,n.texting=!1},reset(){if(this.kits)for(const n of this.kits)n.ped&&this.detach(n)},promotedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.ped?1:0),0):0},update(n){if(!Cs.length){this.reset();return}if(this.kits){for(const o of this.kits)if(o.ped&&o.texting){const c=o.ped.mesh.userData.limbs?.[3]?.mesh;c&&(c.rotation.x=-2.05,c.position.y=1.33)}}if(this._timer-=n,this._timer>0)return;this._timer=.35,this.ensure();const e=xe.position.x,t=xe.position.z,i=zh*zh,s=[];for(let o=0;o<Cs.length;o++){const c=Cs[o];if(!c.active||!c.mesh.visible)continue;const h=c.x-e,d=c.z-t,u=h*h+d*d;u<i&&s.push({a:c,idx:o,d2:u})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool),r=new Set(a.map(o=>o.a));for(const o of this.kits)o.ped&&(!r.has(o.ped)||!o.ped.active||!o.ped.mesh.visible)&&this.detach(o);for(const o of a){const c=this.kits[o.idx%this.pool];c.ped!==o.a&&(c.ped&&r.has(c.ped)||(c.ped&&this.detach(c),this.attach(c,o.a,o.idx%3===0)))}}};let Ko=null;function p_(){if(Ko)return Ko;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<8;s++){const a=s%4*256,r=(s/4|0)*256,o=(s*97+13)%90+10;t.push(o),e.fillStyle="#14203a",e.textAlign="center",e.textBaseline="middle",e.font="bold 88px sans-serif",e.fillText(`TAXI ${o}`,a+128,r+96),e.font="bold 34px sans-serif",e.fillText("STEEL CITY CAB",a+128,r+178)}const i=new en(n);return i.colorSpace=Lt,i.anisotropy=4,Ko={texture:i,nums:t,mat:new Ct({map:i,transparent:!0,alphaTest:.25})},Ko}const Nh={pool:null,used:0,ensure(){if(this.pool)return;const n=p_();this.pool=[];for(let e=0;e<8;e++){const t=e%4*.25,i=1-((e/4|0)+1)*.5,s=[];for(const[r,o]of[[-.585,Math.PI],[-.115,0]]){const c=new Nt(.94,.2),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+.25+h.getY(d)*.25);o&&c.rotateY(o),c.translate(0,2.2,r),s.push(c)}for(const[r,o]of[[1.13,Math.PI/2],[-1.13,-Math.PI/2]]){const c=new Nt(.62,.3),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+h.getY(d)*.5);c.rotateY(o),c.translate(r,1.05,-.2),s.push(c)}const a=new U(Fn(s,!1),n.mat);a.castShadow=!1,a.receiveShadow=!1,a.userData.taxiSign=e,this.pool.push(a)}},reset(){if(this.pool)for(const n of this.pool)n.removeFromParent();this.used=0},attach(n){this.ensure(),!(this.used>=this.pool.length)&&n.add(this.pool[this.used++])},count(){return this.pool?this.pool.reduce((n,e)=>n+(e.parent?1:0),0):0}};let Jo=null;function m_(){if(Jo)return Jo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=(a,r,o)=>{const d=["#e8a45c","#7fb8d8","#e8c087","#c77bd8"][o],u=["#ffdba4","#c8ecff","#ffe9c4","#ffb3ec"][o],m=e.createLinearGradient(a,r,a,r+224);m.addColorStop(0,u),m.addColorStop(.55,d),m.addColorStop(1,["#8a5a2c","#3f6c86","#8a6a3c","#6c3f86"][o]),e.fillStyle=m,e.fillRect(a,r,512,224),e.strokeStyle="#221a14",e.lineWidth=10,e.strokeRect(a+5,r+5,502,214),e.lineWidth=4,e.beginPath(),e.moveTo(a+512/2,r),e.lineTo(a+512/2,r+224),e.moveTo(a,r+224/2),e.lineTo(a+512,r+224/2),e.stroke(),e.fillStyle="rgba(255, 230, 180, 0.85)";for(let p=a+60;p<a+512-40;p+=110)e.fillRect(p,r+8,3,26),e.beginPath(),e.moveTo(p-12,r+34),e.lineTo(p+15,r+34),e.lineTo(p+1.5,r+48),e.fill();if(e.fillStyle="rgba(10, 8, 12, 0.88)",o===0)for(let p=a+70;p<a+512-60;p+=150)e.fillRect(p,r+150,74,8),e.fillRect(p+33,r+158,8,52),e.fillRect(p-18,r+168,26,42),e.fillRect(p+66,r+168,26,42);else if(o===1)for(let p=a+50;p<a+512-60;p+=90)e.fillRect(p,r+60,12,60),e.fillRect(p-14,r+76,40,10),e.beginPath(),e.arc(p+6,r+180,26,0,7),e.fill();else if(o===2){for(const p of[80,130,180])e.fillRect(a+40,r+p,432,8);e.fillStyle="rgba(30, 22, 16, 0.9)";for(const p of[56,106,156])for(let x=a+56;x<a+512-70;x+=44)e.fillRect(x,r+p,26,22)}else for(let p=a+60;p<a+512-80;p+=120)e.fillRect(p,r+90,62,120),e.fillStyle=["#4ff3ff","#ff4fb7","#68ff8f"][(p/120|0)%3],e.fillRect(p+10,r+104,42,34),e.fillStyle="rgba(10, 8, 12, 0.88)"};t(0,0,0),t(512,0,1),t(0,224,2),t(512,224,3);const i=(a,r,o,c,h)=>{e.fillStyle=c,e.fillRect(a+4,452,r-8,56),e.strokeStyle=h,e.lineWidth=3,e.strokeRect(a+7,455,r-14,50),e.fillStyle=h,e.font="900 26px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(o,a+r/2,481,r-24)};i(0,150,"OPEN","#1d3a24","#7dffa5"),i(150,150,"CLOSED","#3a1d1d","#ff8d7d"),i(300,190,"BACK IN 5","#33301d","#ffe27d");const s=new en(n);return s.colorSpace=Lt,s.anisotropy=4,Jo={texture:s,mat:new Ct({map:s})},Jo}const Ks={spots:[],kits:null,pool:0,_timer:0,resetSpots(){if(this.spots.length=0,this.kits)for(const n of this.kits)n.group.visible=!1,n.spot=null},addSpot(n,e,t,i,s){this.spots.push({x:n,y:e,z:t,yaw:i,w:s})},ensure(){if(this.kits)return;this.pool=ca?2:4;const n=m_();this.kits=[];for(let e=0;e<this.pool;e++){const t=new tt,i=e%2*.5,s=e<2?.5625:.125,a=new Nt(5.6,1.9),r=a.attributes.uv;for(let y=0;y<r.count;y++)r.setXY(y,i+r.getX(y)*.5,s+r.getY(y)*.4375);const o=new U(a,n.mat);o.position.set(-.7,1.55,.06),t.add(o);const c=new U(new re(1.3,2.3,.03),new W({color:15326941,roughness:.7,metalness:.05}));c.position.set(2.75,1.15,.03),t.add(c);const h=new U(new re(1.02,2.14,.05),new W({color:5910302,roughness:.55,metalness:.15}));h.position.set(2.75,1.07,.05),t.add(h);const d=new U(new Nt(.6,.8),new W({color:10217727,roughness:.1,metalness:.1,emissive:2963258,emissiveIntensity:.5}));d.position.set(2.75,1.5,.081),t.add(d);const u=new U(new re(.035,.17,.045),new W({color:13092431,roughness:.3,metalness:.85}));u.position.set(3.14,1.02,.09),t.add(u);const m=[150,150,190][e%3]/150,p=new Nt(.34*m,.14),x=p.attributes.uv,_=[0,150/1024,300/1024][e%3],g=[150/1024,150/1024,190/1024][e%3];for(let y=0;y<x.count;y++)x.setXY(y,_+x.getX(y)*g,(4+x.getY(y)*56)/512);const f=new U(p,n.mat);f.position.set(2.75,.62,.085),t.add(f),t.traverse(y=>(y.castShadow=!1,y.receiveShadow=!1,y.userData.dressKit=!0)),t.visible=!1,Te.add(t),this.kits.push({group:t,spot:null})}},dressedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.spot?1:0),0):0},update(n){if(!this.spots.length||(this._timer-=n,this._timer>0))return;this._timer=.4,this.ensure();const e=xe.position.x,t=xe.position.z,i=2025,s=[];for(const o of this.spots){const c=o.x-e,h=o.z-t,d=c*c+h*h;d<i&&s.push({s:o,d2:d})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool).map(o=>o.s),r=new Set(a);for(const o of this.kits)o.spot&&!r.has(o.spot)&&(o.spot=null,o.group.visible=!1);for(const o of a){if(this.kits.some(h=>h.spot===o))continue;const c=this.kits.find(h=>!h.spot);if(!c)break;c.spot=o,c.group.position.set(o.x,o.y,o.z),c.group.rotation.y=o.yaw,c.group.scale.setScalar(Math.min(1,o.w*.72/7)),c.group.visible=!0}}},Pi={meshes:null,counts:{hydrants:0,meters:0,benches:0,cans:0},sample:[]};function x_(n,e,t,i,s,a,r,o){const{opaque:c}=sr(),h=Fn([ut(new Xe(.11,.13,.1,6),yt(0,.05,0),2894892),ut(new Xe(.09,.1,.34,6),yt(0,.27,0),15021620),ut(new Ot(.095,6,4),yt(0,.47,0),15021620),ut(new Xe(.035,.035,.3,6),yt(0,.33,0,Math.PI/2),13840175),ut(new Xe(.03,.03,.08,6),yt(0,.56,0),16765778)],!1),d=Fn([ut(new Xe(.024,.03,1.04,6),yt(0,.52,0),3092306),ut(new re(.15,.22,.09),yt(0,1.13,0),5395032),ut(new re(.11,.1,.02),yt(0,1.16,-.047),13036239)],!1),u=Fn([ut(new re(.14,.42,.42),yt(-.62,.21,0),2432796),ut(new re(.14,.42,.42),yt(.62,.21,0),2432796),ut(new re(.12,.62,.06),yt(-.62,.7,.21),2432796),ut(new re(.12,.62,.06),yt(.62,.7,.21),2432796),ut(new re(1.55,.05,.16),yt(0,.44,-.12),9130315),ut(new re(1.55,.05,.16),yt(0,.44,.08),9130315),ut(new re(1.55,.16,.05),yt(0,.68,.2),9130315),ut(new re(1.55,.16,.05),yt(0,.9,.22),9130315)],!1),m=Fn([ut(new Xe(.19,.16,.52,8),yt(0,.26,0),3225437),ut(new Xe(.2,.2,.05,8),yt(0,.55,0),4936027),ut(new Xe(.13,.13,.03,8),yt(0,.57,0),1118996)],!1),p=[{key:"hydrants",geo:h,cap:46},{key:"meters",geo:d,cap:60},{key:"benches",geo:u,cap:33},{key:"cans",geo:m,cap:46}];if(Pi.meshes)for(const v of Pi.meshes)v.removeFromParent(),v.geometry.dispose();Pi.meshes=[],Pi.sample=[];const x={},_=new kt,g=Df(61453);for(const v of p){const M=new rn(v.geo,c,v.cap);M.frustumCulled=!1,M.castShadow=!1,M.receiveShadow=!0,M.userData.furniture=v.key,M.userData.used=0,x[v.key]=M,Pi.meshes.push(M),n.add(M)}const f=(v,M,E,S)=>{const C=x[v];C.userData.used>=C.count||(_.position.set(M,le(M,E)+.02,E),_.rotation.y=S,_.updateMatrix(),C.setMatrixAt(C.userData.used++,_.matrix),Pi.sample.length<8&&Pi.sample.push({key:v,x:+M.toFixed(1),z:+E.toFixed(1)}))},y=(v,M)=>{const E=v?i+9:e+9,S=v?s-9:t-9;for(let C=E;C<=S;C+=15+g()*10){const A=v?Math.abs((C-s)%a+a)%a:Math.abs((C-e)%a+a)%a;if(A<13||A>a-13)continue;const w=g()<.5?-1:1,b=w*(r*.66+1.35),P=v?M+b:C,D=v?C:M+b;if(o(P,D,.6).clearance<.8)continue;const O=g();O<.27?f("hydrants",P,D,g()*6.28):O<.58?f("meters",P,D,v?w*Math.PI*.5:w>0?Math.PI:0):O<.76?f("benches",P,D,v?w*Math.PI*.5:w>0?Math.PI:0):f("cans",P,D,g()*6.28)}};for(let v=e;v<=t+1;v+=a)y(!0,Math.round(v));for(let v=s;v>=i-1;v-=a)y(!1,Math.round(v));for(const v of p){const M=x[v.key];M.count=M.userData.used,M.instanceMatrix.needsUpdate=!0,Pi.counts[v.key]=M.userData.used}}const Sl=["RIBBON AVE","COIL ST","PISTON BLVD","TORQUE WAY","APEX DR","CHICANE CT","GEARBOX ST","TURBINE AVE","SPOKE LN","CAMBER RD","NITRO AVE","DYNAMO ST","CLUTCH ST","MANIFOLD AVE","OCTANE BLVD","SPOILER ST","DOWNSHIFT DR","HAIRPIN RD","SLIPSTREAM AVE","REDLINE ST","IGNITION WAY","FLYWHEEL RD","BANKED AVE","PIT LANE","VELOCITY BLVD","CHROME ST","SPROCKET ST","AERO WAY","MEDALLION RD","CROSSWALK CT","OVERPASS AVE","STEEL RIBBON PKWY"];let jo=null;function g_(){if(jo)return jo;const n=document.createElement("canvas");n.width=1024,n.height=256;const e=n.getContext("2d");for(let s=0;s<32;s++){const a=s%8*128,r=(s/8|0)*64;e.fillStyle="#175430",e.fillRect(a+2,r+14,124,36),e.strokeStyle="#e8f4ea",e.lineWidth=2.5,e.strokeRect(a+4.5,r+16.5,119,31),e.fillStyle="#f2fbf4",e.font="bold 17px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(Sl[s%Sl.length],a+64,r+33,112)}const t=new en(n);t.colorSpace=Lt,t.anisotropy=4;const i=new Ct({map:t});return i.customProgramCacheKey=()=>"street-sign-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aSignSlot;
varying vec2 vSignUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vSignUv = uv * vec2(0.125, 0.25) + aSignSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vSignUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vSignUv );")},jo={texture:t,mat:i},jo}const ai={poles:0,blades:0,meshes:null,sample:[]};function v_(n,e,t,i,s,a,r,o){const c=g_(),{opaque:h}=sr();if(ai.meshes)for(const A of ai.meshes)A.removeFromParent(),A.geometry.dispose();ai.meshes=[],ai.sample=[];const d=[],u=[];for(let A=e;A<=t+1;A+=a)d.push(Math.round(A));for(let A=s;A>=i-1;A-=a)u.push(Math.round(A));const m=d.length*u.length+4,p=Fn([ut(new Xe(.035,.045,2.55,6),yt(0,1.275,0),1590848),ut(new Xe(.05,.05,.06,6),yt(0,2.58,0),2894377)],!1),x=new rn(p,h,m),_=new Nt(.92,.17),g=new Nt(.92,.17);g.rotateY(Math.PI);const f=Fn([_,g],!1);f.setAttribute("aSignSlot",new gl(new Float32Array(m*2*2),2));const y=new rn(f,c.mat,m*2),v=f.getAttribute("aSignSlot");for(const A of[x,y])A.frustumCulled=!1,A.castShadow=!1,A.receiveShadow=!0,n.add(A),ai.meshes.push(A);const M=new kt;let E=0,S=0;const C=(A,w)=>(A?w:d.length+w)%32;for(let A=0;A<d.length;A++)for(let w=0;w<u.length;w++){const b=d[A]+r*.66+1.5,P=u[w]+r*.66+1.5;if(o(b,P,.5).clearance<.7||E>=m||S+2>y.count)continue;const D=le(b,P)+.02;M.position.set(b,D,P),M.rotation.y=0,M.updateMatrix(),x.setMatrixAt(E++,M.matrix);const O=C(!0,A),Z=C(!1,w);M.position.set(b,D+2.4,P),M.rotation.y=Math.PI/2,M.updateMatrix(),y.setMatrixAt(S,M.matrix),v.setXY(S,O%8*.125,(3-(O/8|0))*.25),S++,M.position.set(b,D+2.56,P),M.rotation.y=0,M.updateMatrix(),y.setMatrixAt(S,M.matrix),v.setXY(S,Z%8*.125,(3-(Z/8|0))*.25),S++,ai.sample.length<4&&ai.sample.push({x:+b.toFixed(1),y:+D.toFixed(2),z:+P.toFixed(1),ns:Sl[O],ew:Sl[Z]})}x.count=E,y.count=S,x.instanceMatrix.needsUpdate=!0,y.instanceMatrix.needsUpdate=!0,v.needsUpdate=!0,ai.poles=E,ai.blades=S}const $s={count:0,sample:[]};let Qo=null;function M_(){if(Qo)return Qo;const n=i=>{const s=document.createElement("canvas");s.width=64,s.height=64;const a=s.getContext("2d");a.fillStyle="#0a0c10",a.fillRect(0,0,64,64),i(a);const r=new en(s);return r.colorSpace=Lt,new Ct({map:r,transparent:!0})},e=n(i=>{i.fillStyle="#f4f8ff",i.strokeStyle="#f4f8ff",i.lineWidth=5,i.lineCap="round",i.beginPath(),i.arc(34,13,6,0,7),i.fill(),i.beginPath(),i.moveTo(34,19),i.lineTo(30,35),i.moveTo(30,35),i.lineTo(20,52),i.moveTo(30,35),i.lineTo(41,50),i.moveTo(33,25),i.lineTo(20,32),i.moveTo(33,25),i.lineTo(45,33),i.stroke()}),t=n(i=>{i.fillStyle="#ff7a26",i.fillRect(22,26,22,24);for(let s=0;s<4;s++)i.fillRect(22+s*5.7,11,4.4,19);i.fillRect(15,30,8,13)});return Qo={walk:e,hand:t},Qo}function __(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],m=[],p=30,x=[],_=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=a;I>=r-1;I-=o)_.push(Math.round(I));_.sort((I,De)=>I-De);const g=x[0],f=x[x.length-1],y=_[0],v=_[_.length-1];Rn.length=0,Ua.length=0,Cs.length=0,Ga.length=0,ge.traffic=0,ge.pedestrians=0,ge.types={},ge.turns=0,ge.splats=0,ge.trafficCrashes=0,ge.streetLights=0,ge.trafficLights=0,ge.stopSigns=0,Ui.resetDynamic(),za.reset(),Nh.reset();const M=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,S=(I,De)=>{let Se=0,Ie=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-De);K<Ie&&(Ie=K,Se=$)}return Se},C=(I,De,Se)=>{const Ie=I==="ns"?_:x;if(Se>0){for(const $ of Ie)if($>De+.05)return $;return Ie[Ie.length-1]}for(let $=Ie.length-1;$>=0;$--)if(Ie[$]<De-.05)return Ie[$];return Ie[0]},A=I=>{const De=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+De,z:I.along}:{x:I.along,z:I.road+De}},w=I=>{if(l.mode!=="roam")return null;const De=A(I);if(Math.abs(l.roamPos.y-(le(De.x,De.z)+kn))>4.2)return null;const Se=I.axis==="ns"?0:I.dir,Ie=I.axis==="ns"?I.dir:0,$=l.roamPos.x-De.x,K=l.roamPos.z-De.z,Ae=$*Se+K*Ie,Fe=I.axis==="ns"?$:K,Be=Math.abs(Fe),nt=Math.hypot($,K),qt=I.mesh?.userData?.colliderHalfW||2,rt=I.mesh?.userData?.colliderHalfD||3;return nt<Un+Math.max(qt,rt)*.55||Ae>-1.5&&Ae<rt+4.2&&Be<Un+qt*.85?{crash:!0}:Ae>0&&Ae<30&&Be<c*.36?{avoidOffset:(Fe>=0?-1:1)*I.maxAvoidOffset,stop:Ae<13&&Be<Un+qt*.95}:null},b=(I,De)=>`${Math.round(I)},${Math.round(De)}`,P=(I,De)=>{const Se=((De+I.phase)%15.5+15.5)%15.5;return Se<6.2?"ns":Se<7.4?"yellow-ns":Se<13.6?"ew":"yellow-ew"},D=(I,De)=>{const Se=I.axis==="ns"?I.road:I.next,Ie=I.axis==="ns"?I.next:I.road,$=b(Se,Ie),K=h.get($);if(!K)return null;if(K.type==="signal"){const Ae=P(K,De),Fe=Ae===`yellow-${I.axis}`;return Ae===I.axis&&!Fe?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},O=(I,De=!1)=>{const Se=I.axis,Ie=I.along,$=Se==="ns"?x:_,K=I.road,Ae=S($,K),Fe=[],Be=Se==="ns"?y:g,nt=Se==="ns"?v:f;!De&&Ie+I.dir*o>=Be&&Ie+I.dir*o<=nt&&Fe.push({axis:Se,road:I.road,along:Ie,dir:I.dir,turn:!1}),Ae>0&&Fe.push({axis:Se==="ns"?"ew":"ns",road:Ie,along:K,dir:-1,turn:!0}),Ae<$.length-1&&Fe.push({axis:Se==="ns"?"ew":"ns",road:Ie,along:K,dir:1,turn:!0}),Fe.length||Fe.push({axis:Se,road:I.road,along:Ie,dir:-I.dir,turn:!0});const qt=Fe.filter(Wt=>Wt.turn),rt=!De&&qt.length&&Math.random()<.42?M(qt):M(Fe);(rt.turn||rt.axis!==Se)&&ge.turns++,I.axis=rt.axis,I.road=rt.road,I.along=rt.along,I.dir=rt.dir,I.laneOffset=E(I.dir),I.next=C(I.axis,I.along,I.dir),I.turnBlend=rt.turn?1:0,I.lastControlKey=null};for(let I=0;I<p;I++){const De=Math.random()<.56?"ns":"ew",Se=u[I%u.length],Ie=Math.random()<.5?-1:1,$=(Se==="bus"||Se==="boxTruck"?10:13)+Math.random()*9,K={axis:De,dir:Ie,type:Se,road:M(De==="ns"?x:_),laneOffset:E(Ie),along:M(De==="ns"?_:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:so(Se,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=C(K.axis,K.along,K.dir),Rn.push(K.collider),m.push(K),Ua.push(K),n.add(K.mesh),Ui.addDynamic(K.mesh,I),Se==="taxi"&&Nh.attach(K.mesh),ge.types[Se]=(ge.types[Se]||0)+1}function Z(I,De=0,Se=0){if(I.stolen)return;let Ie=Math.max(0,I.speed*Se);I.panicT>0?(I.panicT-=Se,Ie*=.32,I.brakePulse=1,I.avoidOffset+=(Math.sign(I.laneOffset||1)*2.1-I.avoidOffset)*Math.min(1,Se*3),I.honked||(I.honked=!0,qM())):I.honked=!1;const $=w(I);for($?.crash?(cp(I,l.roamPos),Ie=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,Se*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Ie=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,Se*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-Se),Ie=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-Se),Ie=0);Ie>0;){const V=D(I,De);if(V){const Et=I.next-I.dir*(V.kind==="signal"?12:8),Xt=(Et-I.along)*I.dir;if(Xt>=-.35&&Xt<=Ie+.25){I.along=Et,I.brakePulse=1,Ie=0,V.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=V.key);break}}const Pt=Math.abs(I.next-I.along);if(Ie<Pt)I.along+=I.dir*Ie,Ie=0;else{I.along=I.next,Ie-=Pt;const Et=I.next<=(I.axis==="ns"?y:g)+.05||I.next>=(I.axis==="ns"?v:f)-.05;O(I,Et)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-Se*3.2),I.turnBlend=Math.max(0,I.turnBlend-Se*3.2);const{x:K,z:Ae}=A(I),Fe=I.axis==="ns"?0:I.dir,Be=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,le(K,Ae)+.28+Math.sin(De*3.2+I.bob)*.035,Ae);const nt=Math.atan2(-Fe,-Be),qt=Math.atan2(Math.sin(nt-I.mesh.rotation.y),Math.cos(nt-I.mesh.rotation.y));I.mesh.rotation.y+=qt*Math.min(1,Se*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(De*22+I.bob)*.02);for(const V of I.mesh.userData.wheels||[])V.rotation.x-=I.dir*I.speed*Se*1.7;const rt=I.mesh.userData.colliderHalfD,Wt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=Ae,I.collider.hw=I.axis==="ns"?Wt:rt,I.collider.hd=I.axis==="ns"?rt:Wt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of m)Z(I,0,0);ge.traffic=m.length,mn(n,(I,De)=>{for(const Se of m)Z(Se,I,De);Ui.update()});const ee=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],Y=[2437188,3092787,4930093,2244434],J=[],te=45;for(let I=0;I<te;I++){const De=Math.random()<.56?"ns":"ew",Se=e[Math.random()*e.length|0],Ie=Math.abs(Se.z1-Se.z0)>Math.abs(Se.x1-Se.x0),$=De==="ns"?Ie?"ns":"ew":Ie?"ew":"ns",K=Math.random()<.5?-1:1,Ae=Math.random()<.5?-1:1,Fe={axis:$,dir:K,sideSign:Ae,coord:M($==="ns"?x:_),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Ad(ee[I%ee.length],Y[I*2%Y.length])};I<14&&(Fe.axis="ns",Fe.coord=80,Fe.sideSign=I%2?-1:1,Fe.dir=I%3===0?1:-1,Fe.along=350-I*24,Fe.speed=1.5+I%4*.35),J.push(Fe),Cs.push(Fe),Fe.mesh.traverse(Be=>Be.castShadow=!1),n.add(Fe.mesh)}const pe=new Ct({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:At}),Me=new Ct({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:At});for(let I=0;I<18;I++){const De=new tt,Se=new U(new bn(1,12),pe.clone());Se.rotation.x=-Math.PI/2,De.add(Se);for(let Ie=0;Ie<7;Ie++){const $=new U(new bn(.25+Math.random()*.25,8),Me.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Ie)*(.6+Math.random()*1.2),.01,Math.sin(Ie*1.7)*(.5+Math.random()*1.1)),De.add($)}De.visible=!1,De.userData.life=0,De.userData.maxLife=2.8,De.position.y=-99,n.add(De),Ga.push(De)}function Ze(I,De=0,Se=0){if(!I.active)if(I.respawn-=Se,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*Se,I.axis==="ns"?(I.along<r-28&&(I.along=a+28),I.along>a+28&&(I.along=r-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const Ie=I.sideSign*(c*.66+1.2),$=I.axis==="ns"?I.coord+Ie:I.along,K=I.axis==="ns"?I.along:I.coord+Ie,Ae=I.axis==="ns"?0:I.dir,Fe=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,le($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-Ae,-Fe);const Be=Math.sin(De*7+I.phase);for(const nt of I.mesh.userData.limbs||[])nt.mesh.rotation.x=Be*nt.amp*nt.side,nt.mesh.position.y=nt.baseY+Math.abs(Be)*.025}for(const I of J)Ze(I,0,0);ge.pedestrians=J.length,mn(n,(I,De)=>{for(const Se of J)Ze(Se,I,De);za.update(De),Ks.update(De);for(const Se of Ga){if(!Se.visible)continue;Se.userData.life-=De;const Ie=Se.userData.life,$=ue.clamp(Ie/Se.userData.maxLife,0,1);Se.scale.setScalar(1+(1-$)*.35),Se.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Ie<=0&&(Se.visible=!1)}})}function y_(){const n=new tt,e=new kt;new os().setFromAxisAngle(new L(1,0,0),-Math.PI/2),ge.roadDetails={},ge.buildingArchetypes={},ge.zones={},ge.openerProps=0;const t=Ve.x0,i=Ve.x1,s=Ve.zNear,a=Ve.zFar,r=Ve.pitch,o=Ve.streetW,c=r-o,h=[],d=[];for(let N=t;N<=i+1;N+=r)h.push(Math.round(N));for(let N=s;N>=a-1;N-=r)d.push(Math.round(N));const u=[];for(const N of h)u.push({x0:N,z0:s,x1:N,z1:a});for(const N of d)u.push({x0:t,z0:N,x1:i,z1:N});function m(N,k){const q=N.x1-N.x0,Q=N.z1-N.z0,ne=Math.hypot(q,Q)||1,ce=-Q/ne,T=q/ne;return{x0:N.x0+ce*k,z0:N.z0+T*k,x1:N.x1+ce*k,z1:N.z1+T*k}}function p(N,k,q){const Q=[],ne=[];for(const T of N){const z=T.x1-T.x0,G=T.z1-T.z0,X=Math.hypot(z,G),B=Math.max(1,Math.round(X/14)),oe=z/X,fe=-(G/X),ae=oe;let we=null,be=null;for(let Ee=0;Ee<=B;Ee++){const _e=Ee/B,Le=_e*X/68,xt=T.x0+z*_e,vt=T.z0+G*_e,dt=xt+fe*k,mt=vt+ae*k,Ge=xt-fe*k,Dt=vt-ae*k,lt=[dt,le(dt,mt)+q,mt,Le],Ut=[Ge,le(Ge,Dt)+q,Dt,Le];we&&(Q.push(we[0],we[1],we[2],be[0],be[1],be[2],Ut[0],Ut[1],Ut[2]),Q.push(we[0],we[1],we[2],Ut[0],Ut[1],Ut[2],lt[0],lt[1],lt[2]),ne.push(0,we[3],1,be[3],1,Ut[3]),ne.push(0,we[3],1,Ut[3],0,lt[3])),we=lt,be=Ut}}const ce=new sn;return ce.setAttribute("position",new Rt(Q,3)),ce.setAttribute("uv",new Rt(ne,2)),ce.computeVertexNormals(),ce}const x=(vn.roadMat=new W({map:jM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:At}),vn.roadMat),_=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),f=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),M=[],E=[];for(const N of u)M.push(m(N,o*.5+3.3),m(N,-13.3)),E.push(m(N,o*.5+.42),m(N,-10.42));const S=new U(p(M,2.9,.66),_);S.receiveShadow=!0,n.add(S);const C=new U(p(E,.28,.78),g);C.receiveShadow=!0,n.add(C),ms("roadDetails","sidewalkRuns",M.length),ms("roadDetails","curbRuns",E.length);const A=new U(p(u,o/2,.55),x);A.receiveShadow=!0,n.add(A);const w=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:At});n.add(new U(p(u,.4,.62),w));let b=0,P=0,D=0;for(let N=1;N<h.length-1;N++)for(let k=1;k<d.length-1;k++){const q=h[N],Q=d[k];if(!(En(q,Q,o*.75).clearance<2))for(const ne of[-1,1]){const ce=new U(new re(o*.92,.07,1.15),f);ce.position.set(q,le(q,Q+ne*13)+.83,Q+ne*13),ce.receiveShadow=!0,n.add(ce);const T=new U(new re(1.15,.07,o*.92),f);T.position.set(q+ne*13,le(q+ne*13,Q)+.83,Q),T.receiveShadow=!0,n.add(T),b+=2}}const O=new gd;O.moveTo(0,5.8),O.lineTo(2.5,1.6),O.lineTo(.72,1.6),O.lineTo(.72,-5.2),O.lineTo(-.72,-5.2),O.lineTo(-.72,1.6),O.lineTo(-2.5,1.6),O.closePath();const Z=new zl(O);Z.rotateX(-Math.PI/2);for(const N of u){const k=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),q=Math.hypot(N.x1-N.x0,N.z1-N.z0),Q=Math.max(2,Math.floor(q/280));for(let ne=0;ne<Q;ne++){const ce=(ne+.5)/Q,T=N.x0+(N.x1-N.x0)*ce,z=N.z0+(N.z1-N.z0)*ce;if(En(T,z,4).clearance<2)continue;const G=new U(Z,y);if(G.position.set(T,le(T,z)+.86,z),G.rotation.y=k?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),P++,ne%2===0){const X=new U(new Xe(1.05,1.05,.08,24),v);X.position.set(T+(k?3.8:0),le(T,z)+.84,z+(k?0:3.8)),n.add(X),D++}}}ms("roadDetails","crosswalks",b),ms("roadDetails","laneArrows",P),ms("roadDetails","manholes",D);const ee=new Ct({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:At,blending:li}),Y=new Ct({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:At,blending:li});for(let N=0;N<120;N++){const k=u[Math.random()*u.length|0],q=Math.random(),Q=k.x0+(k.x1-k.x0)*q,ne=k.z0+(k.z1-k.z0)*q;if(En(Q,ne,4).clearance<2)continue;const ce=new U(new bn(1,18),(N%4===0?Y:ee).clone());ce.rotation.x=-Math.PI/2,ce.rotation.z=Math.atan2(k.x1-k.x0,k.z1-k.z0)+(Math.random()-.5)*.35,ce.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),ce.position.set(Q+(Math.random()-.5)*o*.7,le(Q,ne)+.66,ne+(Math.random()-.5)*o*.7),n.add(ce)}const J=[Ia(160,320,.5),Ia(160,320,.62),Ia(160,320,.42)],te=[new W({map:J[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:J[0],emissiveIntensity:.34}),new W({map:J[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:J[1],emissiveIntensity:.32}),new W({map:J[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:J[2],emissiveIntensity:.36})],pe=new re(1,1,1),Me=[[],[],[]],Ze=[],I=[],De=[],Se=[],Ie=[],$=[],K=[],Ae=[],Fe=[],Be=[],nt=[],qt=[],rt=[],Wt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],V=e_(256,256,"#dbcdb8"),Pt=t_(),Et=n_(),Xt=[Lc(512,384,"#944737","#2e95bf"),Lc(512,384,"#7e4d3e","#d04d65"),Lc(512,384,"#a65a35","#4fba6d")],Qe=i_();function Zt(N,k){ms("zones",N),ms("buildingArchetypes",k)}function ot(N,k,q,Q,ne,ce="downtown"){if(In(N,k,q,Q))return!1;const T=Fa(N,k,q,Q)-1.1;if(Hs(N,k,q,Q,T+ne+2))return!1;if(e.position.set(N,T+ne/2,k),e.quaternion.identity(),e.scale.set(q,ne,Q),e.updateMatrix(),Me[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,T+ne+.6,k),e.scale.set(q*1.04,1.2,Q*1.04),e.updateMatrix(),Ze.push(e.matrix.clone()),ne>26){const z=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(N,T+ne+1.35,k+G*(Q*.52+.12)),e.scale.set(q*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),De.push(z);Math.random()<.34&&Se.push({px:N,pz:k,w:q,d:Q,h:ne,gy:T,zSide:Math.random()<.5?-1:1})}if(ne>14&&Math.random()<.48){const z=Math.random()<.5?"x":"z";Ie.push({px:N,pz:k,w:q,d:Q,h:ne,gy:T,axis:z,side:Math.random()<.5?-1:1})}if(ne>28&&Math.random()<.18){const z=Math.random()<.5?"x":"z";$.push({px:N,pz:k,w:q,d:Q,h:ne,gy:T,axis:z,side:Math.random()<.5?-1:1})}return pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:T+ne+2}),Zt(ce,ne>64?"glassTower":"midrise"),!0}function St(N,k,q,Q,ne,ce="residential"){if(In(N,k,q,Q))return!1;const T=Fa(N,k,q,Q)-.55,z=2+Math.random()*2.4;if(Hs(N,k,q,Q,T+ne+z+1.5,6))return!1;e.position.set(N,T+ne/2,k),e.quaternion.identity(),e.scale.set(q,ne,Q),e.updateMatrix(),K.push(e.matrix.clone()),pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:T+ne+z+1.5}),Ae.push(Wt[Math.random()*Wt.length|0]),e.position.set(N,T+ne+z/2,k),e.scale.set(q*.82,z,Q*.82),e.updateMatrix(),Fe.push(e.matrix.clone());const G=t+Math.round((N-t)/r)*r,X=s-Math.round((s-k)/r)*r,B=Math.abs(N-G)<Math.abs(k-X),oe=B?G>N?1:-1:X>k?1:-1,fe=Math.min(B?Q*.46:q*.46,8.5),ae=Math.min(ne*.58,4.6),we=Math.min(24,Math.max(8,B?Math.abs(G-N)-q*.5-o*.35:Math.abs(X-k)-Q*.5-o*.35));e.quaternion.identity(),B?(e.position.set(N+oe*(q*.5+.1),T+ae*.5+.1,k-Q*.16),e.scale.set(.24,ae,fe),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(N+oe*(q*.5+we*.5),le(N+oe*(q*.5+we*.5),k)+.08,k-Q*.16),e.scale.set(we,.08,fe*1.18)):(e.position.set(N-q*.16,T+ae*.5+.1,k+oe*(Q*.5+.1)),e.scale.set(fe,ae,.24),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(N-q*.16,le(N,k+oe*(Q*.5+we*.5))+.08,k+oe*(Q*.5+we*.5)),e.scale.set(fe*1.18,.08,we)),e.updateMatrix(),nt.push(e.matrix.clone()),e.position.set(N,T+.02,k),e.scale.set(q*1.58,.05,Q*1.58),e.updateMatrix(),qt.push(e.matrix.clone());for(let be=0;be<3;be++){const Ee=B?N+oe*(q*.55):N+(be-1)*q*.25,_e=B?k+(be-1)*Q*.28:k+oe*(Q*.55);e.position.set(Ee,le(Ee,_e)+.55,_e);const Le=.85+Math.random()*.75;e.scale.set(Le*1.35,Le,Le*1.35),e.updateMatrix(),rt.push(e.matrix.clone())}return Zt(ce,"residentialHouse"),!0}function F(N,k,q,Q,ne,ce="commercial"){if(In(N,k,q,Q))return!1;const T=Fa(N,k,q,Q)-.8;if(Hs(N,k,q,Q,T+ne+2,7))return!1;const z=new W({map:Qe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new U(new re(q,ne,Q),z);G.position.set(N,T+ne/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),B=new U(new re(q*.72,.32,Q*.18),X);B.position.set(N,T+ne*.38,k+Q*.18),B.rotation.z=.13,n.add(B);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let fe=5;fe<ne;fe+=9){const ae=new U(new re(q*1.02,.24,.22),oe);ae.position.set(N,T+fe,k+Q*.5+.14),n.add(ae)}return pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:T+ne+2}),Zt(ce,"parkingGarage"),!0}function R(N,k,q,Q,ne,ce="commercial"){if(In(N,k,q,Q))return!1;const T=Fa(N,k,q,Q)-.65;if(Hs(N,k,q,Q,T+ne+2,7))return!1;const z=new W({map:Xt[Math.random()*Xt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new U(new re(q,ne,Q),z);G.position.set(N,T+ne/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new U(new re(q*1.06,.9,Q*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,T+ne+.45,k),n.add(X);const B=t+Math.round((N-t)/r)*r,oe=s-Math.round((s-k)/r)*r,fe=Math.abs(N-B)<Math.abs(k-oe),ae=fe?B>N?1:-1:oe>k?1:-1,we=ys[(N+k|0)%ys.length]||"#ffd45b",be=new Ct({map:Pc(_s[(Math.abs(N)+Math.abs(k)|0)%_s.length],we),transparent:!0,side:At,depthWrite:!1}),Ee=new U(new Nt(Math.min(16,fe?Q*.82:q*.82),4.2),be);return fe?(Ee.position.set(N+ae*(q*.5+.2),T+ne*.66,k),Ee.rotation.y=ae>0?Math.PI/2:-Math.PI/2):(Ee.position.set(N,T+ne*.66,k+ae*(Q*.5+.2)),Ee.rotation.y=ae<0?Math.PI:0),n.add(Ee),Ws("storefront-sign",Ee.position.x,Ee.position.y,Ee.position.z),Ks.addSpot(fe?N+ae*(q*.5):N,T,fe?k:k+ae*(Q*.5),fe?ae>0?Math.PI/2:-Math.PI/2:ae<0?Math.PI:0,fe?Q:q),pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:T+ne+2}),Zt(ce,"brickStorefront"),!0}Ks.resetSpots();for(let N=t+r/2;N<=i-r/2;N+=r)for(let k=s-r/2;k>=a+r/2;k-=r){const q=En(N,k,c*.5).clearance;if(q<2)continue;const Q=k>40&&k<380&&N>-360&&N<360,ne=Q?"showcase":k<-920?"industrial":q>230||k<-430?"downtown":q<90?"residential":"commercial";if(q<90||Q){const ce=c/3;for(let T=0;T<3;T++)for(let z=0;z<3;z++){if(Math.random()<.08)continue;const G=N-c/2+ce*(T+.5)+(Math.random()-.5)*ce*.3,X=k-c/2+ce*(z+.5)+(Math.random()-.5)*ce*.3;if(En(G,X,8).clearance<1)continue;const B=ce*(.54+Math.random()*.24),oe=ce*(.54+Math.random()*.24);!Q&&Math.random()<.16?ot(G,X,B*.9,oe*.9,12+Math.random()*12,ne):St(G,X,B,oe,5+Math.random()*4.5,ne)}}else{const ce=q>230,T=ce?ue.clamp(58+q*1.15,68,205):ue.clamp(22+q*.3,22,66),z=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<z;G++){const X=15+Math.random()*Math.min(30,c*.46),B=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),fe=k+(Math.random()-.5)*(c-B);if(En(oe,fe,Math.hypot(X,B)*.5).clearance<2)continue;const ae=(18+Math.random()*(T-18))*(ce&&Math.random()<.24?1.35:1);!ce&&(Math.random()<.38&&R(oe,fe,Math.max(18,X*1.12),Math.max(18,B*1.08),12+Math.random()*14,ne)||Math.random()<.18&&F(oe,fe,Math.max(24,X*1.35),Math.max(24,B*1.28),24+Math.random()*24,ne))||ot(oe,fe,X,B,ae,ne)}}}x_(n,t,i,a,s,r,o,En),v_(n,t,i,a,s,r,o,En);for(let N=0;N<3;N++){if(!Me[N].length)continue;const k=new rn(pe,te[N],Me[N].length);for(let q=0;q<Me[N].length;q++)k.setMatrixAt(q,Me[N][q]);k.instanceMatrix.needsUpdate=!0,k.castShadow=!0,k.receiveShadow=!0,n.add(k)}if(Ze.length){const N=new W({color:2896696,roughness:.62,metalness:.34}),k=new rn(pe,N,Ze.length);for(let q=0;q<Ze.length;q++)k.setMatrixAt(q,Ze[q]);k.instanceMatrix.needsUpdate=!0,n.add(k)}if(I.length){const N=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),k=new rn(pe,N,I.length);for(let q=0;q<I.length;q++)k.setMatrixAt(q,I[q]),k.setColorAt(q,new at(De[q]));k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),n.add(k)}if(K.length){const N=new W({color:4891451,roughness:.88,metalness:.02}),k=new rn(pe,N,qt.length);for(let ae=0;ae<qt.length;ae++)k.setMatrixAt(ae,qt[ae]);k.instanceMatrix.needsUpdate=!0,k.receiveShadow=!0,n.add(k);const q=new W({color:12040883,roughness:.48,metalness:.05}),Q=new rn(pe,q,nt.length);for(let ae=0;ae<nt.length;ae++)Q.setMatrixAt(ae,nt[ae]);Q.instanceMatrix.needsUpdate=!0,Q.receiveShadow=!0,n.add(Q);const ne=new W({map:V,roughness:.78,metalness:.03}),ce=new rn(pe,ne,K.length);for(let ae=0;ae<K.length;ae++)ce.setMatrixAt(ae,K[ae]),ce.setColorAt(ae,new at(Ae[ae]));ce.instanceMatrix.needsUpdate=!0,ce.instanceColor&&(ce.instanceColor.needsUpdate=!0),ce.castShadow=!0,ce.receiveShadow=!0,n.add(ce);const T=new Fi(.72,1,4);T.rotateY(Math.PI/4);const z=new W({map:Pt,color:14314033,roughness:.72}),G=new rn(T,z,Fe.length);for(let ae=0;ae<Fe.length;ae++)G.setMatrixAt(ae,Fe[ae]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:Et,roughness:.38,metalness:.18}),B=new rn(pe,X,Be.length);for(let ae=0;ae<Be.length;ae++)B.setMatrixAt(ae,Be[ae]);B.instanceMatrix.needsUpdate=!0,n.add(B);const oe=new W({color:3112239,roughness:.88,metalness:.02}),fe=new rn(new Ot(1,8,6),oe,rt.length);for(let ae=0;ae<rt.length;ae++)fe.setMatrixAt(ae,rt[ae]);fe.instanceMatrix.needsUpdate=!0,fe.castShadow=!0,fe.receiveShadow=!0,n.add(fe)}const j=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(Se.length,34);N++){const k=Se[N],q=j[N%j.length],Q=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ne=new Ct({map:o0(q,Q),transparent:!0,side:At,depthWrite:!1}),ce=new U(new Nt(8,24),ne);ce.position.set(k.px,k.gy+Math.max(14,k.h*.58),k.pz+k.zSide*(k.d*.5+.25)),ce.rotation.y=k.zSide<0?Math.PI:0,n.add(ce),Ws("vertical-neon",ce.position.x,ce.position.y,ce.position.z)}for(let N=0;N<Math.min(Ie.length,48);N++){const k=Ie[N],q=_s[(N*5+2)%_s.length],Q=ys[(N*2+1)%ys.length],ne=new Ct({map:Pc(q,Q),transparent:!0,side:At,depthWrite:!1}),ce=Math.min(17,(k.axis==="x"?k.d:k.w)*.82),T=new U(new Nt(ce,4.7),ne),z=k.gy+Math.max(6.2,Math.min(k.h-3.5,k.h*(.28+N%3*.12)));k.axis==="x"?(T.position.set(k.px+k.side*(k.w*.5+.22),z,k.pz),T.rotation.y=k.side>0?Math.PI/2:-Math.PI/2):(T.position.set(k.px,z,k.pz+k.side*(k.d*.5+.22)),T.rotation.y=k.side<0?Math.PI:0),n.add(T),Ws("wall-sign",T.position.x,T.position.y,T.position.z)}for(let N=0;N<Math.min($.length,18);N++){const k=$[N],q=_s[(N*7+4)%_s.length],Q=yl[(N*5+3)%yl.length],ne=ys[(N+3)%ys.length],ce=new tt,T=new W({map:Af(q,Q,ne),color:16777215,roughness:.2,metalness:.06,emissive:new at(ne),emissiveIntensity:.34}),z=Math.min(18,(k.axis==="x"?k.d:k.w)*.86),G=new U(new re(z,5.2,.42),T);G.position.y=4.8,ce.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const B of[-z*.34,z*.34]){const oe=new U(new Xe(.13,.17,5,8),X);oe.position.set(B,2.25,-.2),ce.add(oe)}ce.position.set(k.px,k.gy+k.h+.7,k.pz),ce.rotation.y=k.axis==="x"?k.side>0?Math.PI/2:-Math.PI/2:k.side<0?Math.PI:0,n.add(ce),Ws("roof-billboard",ce.position.x,ce.position.y+4.8,ce.position.z)}const de=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ve=Fn([new re(2.2,.72,4.6).translate(0,.78,0),new re(1.7,.56,2.15).translate(0,1.42,-.22)]),se=Fn([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,k])=>new Xe(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,k))),et=130,ze=new rn(ve,new W({roughness:.42,metalness:.36}),et),it=new rn(se,new W({color:1512727,roughness:.9}),et);Ui.resetStatic();let $e=0,ye=0;for(;$e<et&&ye<et*6;){ye++;const N=Math.random()<.5,k=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),q=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.26);if(En(k,q,4).clearance<2)continue;const Q=le(k,q)+.06;e.position.set(k,Q,q),e.quaternion.setFromAxisAngle(on,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),ze.setMatrixAt($e,e.matrix),it.setMatrixAt($e,e.matrix),ze.setColorAt($e,new at(de[Math.random()*de.length|0])),yn.spots.push({x:k,z:q,yaw:N?0:-Math.PI/2,idx:$e,taken:!1}),Ui.addStatic(e.matrix,2.3,$e,yn.spots[yn.spots.length-1]),$e++}ze.count=$e,it.count=$e,ze.instanceMatrix.needsUpdate=!0,it.instanceMatrix.needsUpdate=!0,ze.instanceColor&&(ze.instanceColor.needsUpdate=!0),ze.castShadow=!0,yn.im=ze,yn.imW=it,n.add(ze),n.add(it);const Ue=new Map,pt=(N,k)=>`${Math.round(N)},${Math.round(k)}`;function ht(N,k){const q=((k+N.phase)%15.5+15.5)%15.5;return q<6.2?{green:"ns",yellow:null}:q<7.4?{green:null,yellow:"ns"}:q<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function qe(){$s.count=0,$s.sample.length=0;const N=[],k=[],q=M_(),Q=new W({color:1120028,roughness:.38,metalness:.62}),ne=new W({color:1382685,roughness:.34,metalness:.38}),ce=s_(),T=new Ct({map:ce,transparent:!0,side:At}),z=new W({color:5050642,roughness:.48,metalness:.12}),G=(be,Ee)=>new W({color:be,roughness:.16,metalness:.02,emissive:Ee,emissiveIntensity:.2}),X=(be,Ee,_e,Le,xt,vt,dt)=>{const mt=_e-.26,Ge=Le-.26,Dt=new U(new re(.3,.52,.3),ne);Dt.position.set(mt,2.55,Ge),be.add(Dt);const lt=new U(new re(.34,.06,.34),ne);lt.position.set(_e-.13,2.84,Le-.13),be.add(lt);const Ut=Jt=>new U(new Nt(.2,.2),Jt),xn=Ut(q.walk),Kt=Ut(q.hand),Vn=Ut(q.walk),Vt=Ut(q.hand);for(const Jt of[xn,Kt])Jt.position.set(mt-.16,2.55,Ge),Jt.rotation.y=-Math.PI/2,be.add(Jt);for(const Jt of[Vn,Vt])Jt.position.set(mt,2.55,Ge-.16),Jt.rotation.y=Math.PI,be.add(Jt);k.push({control:Ee,walkA:xn,handA:Kt,walkB:Vn,handB:Vt}),$s.count++,$s.sample.length<3&&$s.sample.push({x:+(xt+mt).toFixed(1),y:+(dt+2.55).toFixed(2),z:+(vt+Ge).toFixed(1)})},B=(be,Ee,_e,Le,xt,vt)=>{const dt=new tt,mt=new U(new re(1.15,2.85,.75),ne);dt.add(mt);const Ge=G(16724008,16717836),Dt=G(16767053,16757276),lt=G(4521842,1693789),Ut=[Ge,Dt,lt];for(let xn=0;xn<3;xn++){const Kt=new U(new Ot(.28,12,8),Ut[xn]);Kt.position.set(0,.78-xn*.78,-.42),dt.add(Kt)}dt.position.set(_e,Le,xt),dt.rotation.y=vt,be.add(dt),N.push({axis:Ee,red:Ge,yellow:Dt,green:lt,control:be.userData.control})},oe=(be,Ee,_e)=>{const Le=pt(be,Ee),xt={type:"signal",x:be,z:Ee,phase:_e%4*2.1};Ue.set(Le,xt);const vt=le(be,Ee),dt=new tt;dt.userData.control=xt;const mt=o*.72,Ge=o*.72,Dt=new U(new Xe(.18,.24,8.2,8),Q);Dt.position.set(mt,4.1,Ge),dt.add(Dt);const lt=new U(new re(o*1.65,.2,.2),Q);lt.position.set(mt-o*.72,8,Ge),dt.add(lt);const Ut=new U(new re(.2,.2,o*1.65),Q);Ut.position.set(mt,7.55,Ge-o*.72),dt.add(Ut),B(dt,"ns",mt-o*1.24,7.52,Ge,0),B(dt,"ns",mt-o*.18,7.52,-Ge,Math.PI),B(dt,"ew",mt,7.05,Ge-o*1.24,Math.PI/2),B(dt,"ew",-mt,7.05,Ge-o*.18,-Math.PI/2),X(dt,xt,mt,Ge,be,Ee,vt),dt.position.set(be,vt,Ee),dt.traverse(xn=>{xn.castShadow=!0,xn.receiveShadow=!0}),n.add(dt)},fe=(be,Ee,_e)=>{const Le=pt(be,Ee);Ue.set(Le,{type:"stop",x:be,z:Ee,phase:0});const xt=le(be,Ee),vt=new tt,dt=_e%2?-1:1,mt=_e%3?1:-1,Ge=new U(new Xe(.12,.16,4.2,7),Q);Ge.position.y=2.1,vt.add(Ge);const Dt=new U(new bn(1.04,8),z);Dt.position.y=4.55,Dt.rotation.y=Math.PI,vt.add(Dt);const lt=new U(new Nt(2.05,2.05),T);lt.position.set(0,4.55,-.04),vt.add(lt),vt.position.set(be+dt*o*.74,xt,Ee+mt*o*.74),vt.rotation.y=Math.atan2(dt,mt),vt.traverse(Ut=>{Ut.castShadow=!0,Ut.receiveShadow=!0}),n.add(vt)};let ae=0,we=0;for(let be=1;be<h.length-1;be++)for(let Ee=1;Ee<d.length-1;Ee++){const _e=h[be],Le=d[Ee];if(En(_e,Le,o*.9).clearance<2)continue;const xt=Math.abs(_e-80)<=r*1.05&&Le<=s&&Le>=-560,vt=Le<-260&&Le>-1180&&(be+Ee)%4===0,dt=Le>-360&&(be+Ee)%2===0;xt&&Ee%2===0||vt?oe(_e,Le,ae++):(dt||(be+Ee)%5===0&&Le>-820)&&fe(_e,Le,we++)}return mn(n,be=>{for(const _e of N){const Le=ht(_e.control,be);_e.red.emissiveIntensity=Le.green===_e.axis||Le.yellow===_e.axis?.12:2.3,_e.yellow.emissiveIntensity=Le.yellow===_e.axis?2.6:.12,_e.green.emissiveIntensity=Le.green===_e.axis?2.6:.1}let Ee=0;for(const _e of k){const Le=ht(_e.control,be),xt=Le.green==="ew",vt=Le.green==="ns";_e.walkA.visible=xt,_e.handA.visible=!xt,_e.walkB.visible=vt,_e.handB.visible=!vt,Ee+=(xt?1:0)+(vt?1:0)}ge.pedWalkFaces=Ee}),{trafficLights:ae,stopSigns:we}}const gt=qe();__(n,u,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:o,trafficControls:Ue}),ge.trafficLights=gt.trafficLights,ge.stopSigns=gt.stopSigns;const H=new Xe(.12,.16,7.2,7),He=new Ot(.46,10,8),Oe=new Nt(2.8,13),ke=new W({color:1581353,roughness:.42,metalness:.68}),Ce=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),me=new Ct({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:At,blending:li}),Je=QM(),Mt=new Il({map:Je,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:li}),Yt=132,Bt=new rn(H,ke,Yt),Bn=new rn(He,Ce,Yt),Pn=new rn(Oe,me,Yt);let ui=0;for(let N=0;N<Yt*2&&ui<Yt;N++){const k=Math.random()<.5,q=k?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),Q=k?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.58);if(En(q,Q,3).clearance<2)continue;const ne=le(q,Q);e.quaternion.identity(),e.position.set(q,ne+3.6,Q),e.scale.set(1,1,1),e.updateMatrix(),Bt.setMatrixAt(ui,e.matrix),e.position.set(q,ne+7.5,Q),e.updateMatrix(),Bn.setMatrixAt(ui,e.matrix);const ce=new xl(Mt);ce.position.set(q,ne+7.5,Q);const T=6.2+Math.random()*2.4;ce.scale.set(T,T,1),n.add(ce),Ss.streetGlowSprites++,e.position.set(q,ne+.72,Q),e.quaternion.setFromAxisAngle(new L(1,0,0),-Math.PI/2),e.rotateZ(k?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Pn.setMatrixAt(ui,e.matrix),ui++}Bt.count=ui,Bn.count=ui,Pn.count=ui,Bt.instanceMatrix.needsUpdate=!0,Bn.instanceMatrix.needsUpdate=!0,Pn.instanceMatrix.needsUpdate=!0,n.add(Bt,Bn,Pn),ge.streetLights=ui,n.add(new U(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),n.add(new U(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),n.add(new U(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new U(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const co=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const k=new U(new re(1.15,.09,13.5),co);k.position.set(80,le(80,N)+.9,N),k.receiveShadow=!0,n.add(k)}for(const N of[286,156,26,-104])for(let k=0;k<7;k++){const q=new U(new re(2,.08,11.8),f),Q=71.2+k*2.95;q.position.set(Q,le(Q,N)+.91,N),q.receiveShadow=!0,n.add(q),ms("roadDetails","openerCrosswalkStripes")}function rr(N,k,q,Q=!1){const ne=le(N,k),ce=new tt,T=new U(new Xe(.16,.22,9.5,8),ke);T.position.y=4.75,ce.add(T);const z=new U(new re(3.8,.22,.22),ke);z.position.set(q*1.75,8.95,0),ce.add(z);const G=new U(new Ot(.62,12,8),Ce);G.position.set(q*3.6,8.82,0),ce.add(G);const X=new xl(Mt.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),ce.add(X),Ss.streetGlowSprites++;const B=new U(new Nt(3.2,15),me.clone());if(B.position.set(q*2.8,.72,0),B.rotation.x=-Math.PI/2,B.scale.y=.7+Math.random()*.35,ce.add(B),Q){const oe=new _d(16762474,4.4,66,2);oe.position.copy(G.position),ce.add(oe)}ce.position.set(N,ne,k),n.add(ce),ge.streetLights++}let Ei=0;for(let N=340;N>=-700;N-=118)rr(63,N,1,Ei++%3===0),rr(97,N-42,-1,Ei++%3===0);function Ai(N,k,q,Q,ne=6010942){const ce=new W({color:ne,roughness:.92,metalness:.01}),T=new U(new re(q,.08,Q),ce);return T.position.set(N,le(N,k)+.06,k),T.receiveShadow=!0,n.add(T),ge.openerProps++,T}function Ci(N,k,q=1){const Q=le(N,k),ne=new tt,ce=new U(new Xe(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));ce.position.y=2.75,ne.add(ce);const T=new W({color:6065982,roughness:.86}),z=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[B,oe,fe,ae]=G[X],we=new U(new Ot(ae,12,8),X%2?z:T);we.position.set(B,oe,fe),we.scale.y=.78,we.castShadow=!0,ne.add(we)}return ne.position.set(N,Q,k),ne.scale.setScalar(q),n.add(ne),_i.push({kind:"tree",x:N,z:k,radius:3.4*q,maxY:Q+11*q}),ge.openerProps++,ne}function or(N,k,q=0){const Q=new tt,ne=new W({color:10970418,roughness:.64,metalness:.04}),ce=new W({color:1910317,roughness:.46,metalness:.5});for(const T of[1.05,1.55]){const z=new U(new re(6.8,.22,.44),ne);z.position.y=T,Q.add(z)}for(const T of[-2.7,2.7]){const z=new U(new re(.22,1.2,.35),ce);z.position.set(T,.62,0),Q.add(z)}Q.position.set(N,le(N,k),k),Q.rotation.y=q,n.add(Q),ge.openerProps++}function da(N,k){const q=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),Q=new tt,ne=new U(new Xe(.34,.42,1.25,12),q);ne.position.y=.65,Q.add(ne);const ce=new U(new Ot(.42,12,8),q);ce.position.y=1.32,Q.add(ce);const T=new U(new Xe(.16,.16,1.1,10),q);T.rotation.z=Math.PI/2,T.position.y=.9,Q.add(T),Q.position.set(N,le(N,k),k),n.add(Q),ge.openerProps++}function ho(N,k,q=0){const Q=new tt,ne=new W({color:1185821,roughness:.36,metalness:.68}),ce=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),T=new W({color:2370611,roughness:.42,metalness:.32}),z=new U(new re(8.5,.35,3.2),T);z.position.y=4.2,Q.add(z);for(const B of[-3.8,3.8]){const oe=new U(new Xe(.09,.11,4.1,7),ne);oe.position.set(B,2.05,-1.25),Q.add(oe)}const G=new U(new re(8,2.8,.08),ce);G.position.set(0,2.2,1.35),Q.add(G);const X=new U(new Nt(2.3,2.8),new Ct({map:Pc("BUS","#4ff3ff"),transparent:!0,side:At}));X.position.set(-2.4,2.2,1.42),Q.add(X),Q.position.set(N,le(N,k),k),Q.rotation.y=q,n.add(Q),Ws("bus-shelter-ad",N,le(N,k)+2.2,k),ge.openerProps++}function Mn(N,k,q,Q,ne,ce,T,z=null,G=0){if(In(N,k,q,Q,12))return!1;const X=le(N,k)-.45;if(Hs(N,k,q,Q,X+ne+2))return!1;const B=N<80?1:-1,oe=new W({map:Ia(192,512,T),color:ce,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),fe=new U(new re(q,ne,Q),oe);fe.position.set(N,X+ne/2,k),fe.castShadow=!1,fe.receiveShadow=!0,n.add(fe);const ae=new W({map:Ia(220,620,Math.min(.86,T+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:At}),we=new U(new Nt(Q*.78,ne*.74),ae);we.position.set(N+B*(q/2+.09),X+ne*.54,k),we.rotation.y=B>0?Math.PI/2:-Math.PI/2,n.add(we);for(const _e of[-1,1]){const Le=new U(new Nt(q*.82,ne*.72),ae.clone());Le.position.set(N,X+ne*.55,k+_e*(Q/2+.1)),Le.rotation.y=_e>0?0:Math.PI,n.add(Le)}const be=new U(new re(q*1.04,1.2,Q*1.04),new W({color:1778733,roughness:.34,metalness:.38}));be.position.set(N,X+ne+.7,k),n.add(be);const Ee=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const _e of[-1,1]){const Le=new U(new re(q*1.1,.22,.18),Ee);Le.position.set(N,X+ne+1.4,k+_e*(Q/2+.18)),n.add(Le)}if(z&&G){const _e=new Ct({map:o0(z,z==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:At,depthWrite:!1}),Le=new U(new Nt(7.5,24),_e);Le.position.set(N+G*(q/2+.3),X+Math.min(ne-8,ne*.58),k),Le.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Le),Ws("showcase-neon",Le.position.x,Le.position.y,Le.position.z)}return pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:X+ne+2}),Zt("showcase","glassTower"),!0}function uo(N,k,q,Q=3.2){const ne=N*.5+Q,ce=k*.5+Q,T=Math.max(2,Math.abs(ne-ce)*.72),z=N>=k?[-ne,0,-ce,ne,0,-ce,T,q,0,-ne,0,-ce,T,q,0,-T,q,0,ne,0,-ce,ne,0,ce,T,q,0,ne,0,ce,-ne,0,ce,-T,q,0,ne,0,ce,T,q,0,-T,q,0,-ne,0,ce,-ne,0,-ce,-T,q,0]:[-ne,0,-ce,ne,0,-ce,0,q,-T,ne,0,-ce,ne,0,ce,0,q,T,ne,0,-ce,0,q,T,0,q,-T,ne,0,ce,-ne,0,ce,0,q,T,-ne,0,ce,-ne,0,-ce,0,q,-T,-ne,0,ce,0,q,-T,0,q,T],G=new sn;return G.setAttribute("position",new Rt(z,3)),G.computeVertexNormals(),G}function lr(N,k,q,Q,ne,ce,T={}){if(In(N,k,q,Q,12))return!1;const z=le(N,k)-.3;if(Hs(N,k,q,Q,z+ne+(T.roofH??8.2)+1,6))return!1;const G=T.frontZ??-1,X=new W({map:V,color:T.wallColor??14734788,roughness:.68,metalness:.03}),B=new U(new re(q,ne,Q),X);B.position.set(N,z+ne/2,k),B.castShadow=!0,B.receiveShadow=!0,n.add(B);const oe=new W({map:Pt,color:ce,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),fe=T.roofH??8.2,ae=new U(uo(q,Q,fe),oe);ae.position.set(N,z+ne,k),ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae);const we=new W({color:15985112,roughness:.42,metalness:.05}),be=new U(new re(q+7,.42,1.2),we);be.position.set(N,z+ne+.12,k+G*(Q*.5+1.4)),n.add(be);const Ee=be.clone();Ee.position.z=k-G*(Q*.5+1.4),n.add(Ee);const _e=Math.min(18,q*.38),Le=new U(new re(_e,ne*.55,.32),new W({map:Et,roughness:.34,metalness:.2}));Le.position.set(N+q*.18,z+ne*.33,k+G*(Q*.5+.22)),n.add(Le);const xt=new U(new re(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));xt.position.set(N-q*.25,z+3.7,k+G*(Q/2+.24)),n.add(xt);const vt=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),dt=new W({color:3353638,roughness:.38});for(const Kt of[-q*.36,-q*.05,q*.38]){if(Math.abs(Kt-q*.18)<_e*.45)continue;const Vn=new U(new re(6.2,4.8,.26),dt);Vn.position.set(N+Kt,z+ne*.58,k+G*(Q*.5+.28)),n.add(Vn);const Vt=new U(new re(4.8,3.4,.3),vt);Vt.position.copy(Vn.position),Vt.position.z+=G*.04,n.add(Vt)}const mt=new W({color:12370619,roughness:.44,metalness:.04}),Ge=new U(new re(_e*1.18,.12,34),mt);Ge.position.set(N+q*.18,le(N+q*.18,k+G*(Q*.5+17))+.11,k+G*(Q*.5+17)),n.add(Ge);const Dt=new W({color:5679925,roughness:.86,metalness:.01}),lt=new U(new re(q+10,.08,Q+12),Dt);lt.position.set(N,le(N,k)-.18,k),lt.receiveShadow=!0,n.add(lt),lt.renderOrder=-1;const Ut=new W({color:3042609,roughness:.84}),xn=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let Kt=0;Kt<9;Kt++){const Vn=N-q*.44+Kt*(q*.11),Vt=k+G*(Q*.5+2.2+Kt%2*1.5),Jt=new U(new Ot(1.35+Kt%3*.22,10,7),Kt%4===0?xn[Kt%xn.length]:Ut);Jt.position.set(Vn,le(Vn,Vt)+.95,Vt),Jt.scale.y=.72,Jt.castShadow=!0,n.add(Jt)}return pn.push({x:N,z:k,hw:q*.5,hd:Q*.5,maxY:z+ne+5}),Zt("showcase","lowStorefront"),!0}return Ai(45,318,36,84,6404169),Ai(116,318,36,84,6074179),Ai(44,188,34,84,6798662),Ai(118,188,36,84,5941822),Ai(43,60,34,82,5679164),Ai(118,60,36,82,6864197),Mn(18,315,70,54,154,2311775,.72,"HOTEL",1),Mn(17,185,72,58,188,1522779,.78,null,0),Mn(31,55,44,56,138,2840688,.66,"OPEN",1),Mn(24,-75,52,64,182,1913933,.7,null,0),Mn(145,315,68,54,116,2776440,.72,null,0),Mn(146,185,70,58,146,2314602,.76,null,0),Mn(142,55,42,56,156,1590364,.68,"CAFE",-1),Mn(134,-75,48,64,114,3688540,.62,null,0),Mn(-70,315,52,52,146,2112085,.68,null,0),Mn(228,185,48,58,148,3235186,.66,null,0),Mn(-78,185,48,56,134,2181730,.68,null,0),Mn(236,315,44,54,104,3104884,.66,null,0),lr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),lr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),Mn(-48,-360,54,56,148,2439765,.58,null,0),Mn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Ci(112,227,1.35),Ci(104,221,1.05),Ci(121,233,1.15),or(112,217,0),Ci(50,292,1.2),Ci(111,316,.95),Ci(48,137,.9),Ci(116,102,1.05),or(47,248,Math.PI/2),da(57,226),ho(111,260,-Math.PI/2),Te.add(n),n}function If(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const o=_t(i),c=new L(o.tangent.x,0,o.tangent.z).normalize(),h=new L().crossVectors(on,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*ie.width*.5),u=t==="off"?1:-1,m=d.x+c.x*s*u+h.x*e*a,p=d.z+c.z*s*u+h.z*e*a,x=new L(m,le(m,p)+.4,p),_=t==="off"?d:x,g=t==="off"?x:d,f=26,y=[];for(let Y=0;Y<=f;Y++){const J=Y/f,te=J*J*(3-2*J),pe=t==="off"?1-(1-J)*(1-J):te;y.push(new L(ue.lerp(_.x,g.x,J),ue.lerp(_.y,g.y,pe),ue.lerp(_.z,g.z,J)))}const v=7.4,M=new L,E=new L,S=[],C=[];for(let Y=0;Y<=f;Y++)E.subVectors(y[Math.min(f,Y+1)],y[Math.max(0,Y-1)]),E.y=0,E.normalize(),M.crossVectors(on,E).normalize(),S.push(y[Y].clone().addScaledVector(M,-v)),C.push(y[Y].clone().addScaledVector(M,v));const A={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(Y=>Y.clone()),segments:[]};for(let Y=0;Y<f;Y++){const J=y[Y],te=y[Y+1],pe=te.x-J.x,Me=te.z-J.z,Ze=Math.max(1e-4,pe*pe+Me*Me);A.segments.push({a:J.clone(),b:te.clone(),abx:pe,abz:Me,lenSq:Ze,u0:Y/f,u1:(Y+1)/f})}ha.push(A);const w=[];for(let Y=0;Y<f;Y++){const J=S[Y],te=C[Y],pe=S[Y+1],Me=C[Y+1];w.push(J.x,J.y,J.z,te.x,te.y,te.z,Me.x,Me.y,Me.z),w.push(J.x,J.y,J.z,Me.x,Me.y,Me.z,pe.x,pe.y,pe.z)}const b=new sn;b.setAttribute("position",new Rt(w,3)),b.computeVertexNormals();const P=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:At});n.add(new U(b,P));const D=new W({color:12107972,roughness:.5,metalness:.4});for(let Y=0;Y<f;Y++)qn(n,S[Y].clone().setY(S[Y].y+1),S[Y+1].clone().setY(S[Y+1].y+1),.16,D),qn(n,C[Y].clone().setY(C[Y].y+1),C[Y+1].clone().setY(C[Y+1].y+1),.16,D);const O=new W({color:7173241,roughness:.82});for(let Y=3;Y<f;Y+=3){const J=y[Y],te=le(J.x,J.z),pe=J.y-te;if(pe<3||In(J.x,J.z,3.2,3.2,1.2))continue;const Me=new U(new Xe(.9,1.15,pe,8),O);Me.position.set(J.x,te+pe/2,J.z),n.add(Me),ri.push({x:J.x,z:J.z,hw:1.3,hd:1.3,maxY:J.y-.9})}const Z=new Ct({map:Cd(r),transparent:!0,side:At}),ee=new U(new Nt(12,3),Z);ee.position.copy(t==="off"?d:x).add(new L(0,t==="off"?6.2:5.5,0)),ee.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(ee);for(const Y of[-1,1]){const J=new U(new Xe(.2,.26,6,6),O),te=t==="off"?d:x;J.position.set(te.x+h.x*Y*5.4,te.y+3,te.z+h.z*Y*5.4),n.add(J)}}function b_(n,e=1){If(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function w_(n,e=-1){If(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function S_(){const n=new tt,e=[],t=new at(14170671),i=new at(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Ct({map:T_(),transparent:!0,side:At}),r=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:At}),h=12,d=[],u=[];let m=0;for(let x=0;x<ie.length;x+=h){if(Hi(x+h*.5)){m++;continue}const _=_t(x),g=_t(x+h),f=_.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:M}=is(_,g);for(const E of[-1,1]){const S=f.clone().addScaledVector(y,E*ie.width*.5).addScaledVector(v,.5);d.push(S),u.push(M),e.push(m%2===0?t:i)}if(m%16===8){const E=(m>>4)%2?1:-1,S=f.clone().addScaledVector(y,E*ie.width*.52).addScaledVector(v,.4),C=new tt,A=new U(new Nt(4.4,2.6),a);A.position.y=3.4,A.rotation.y=Math.PI,C.add(A);const w=new Xe(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const P=new U(w,s);P.position.set(b,1.7,0),C.add(P)}C.position.copy(S),C.quaternion.copy(M),n.add(C)}m++}for(let x=0;x<ie.length;x+=16){const _=_t(x),g=1+(Math.random()<.5?1:0);for(let f=0;f<g;f++){const y=Math.random()<.5?-1:1,v=ie.width/2+12+Math.random()*78,M=_.p.x+_.side.x*v*y+(Math.random()-.5)*16,E=_.p.z+_.side.z*v*y+(Math.random()-.5)*16;if(Bl(M,E,18)||In(M,E,12,12,3.5))continue;const S=le(M,E);if(Math.random()<.78){const C=.7+Math.random()*1.5,A=new tt,w=2.4+Math.random()*4.2,b=new U(new Xe(.26,.42,w,6),r);b.position.y=w/2,A.add(b);const P=2+Math.floor(Math.random()*3);for(let D=0;D<P;D++){const O=new U(new Fi(2.4+Math.random()*1.6-D*.2,4.6+Math.random()*2.4,7),o[(f+D+x)%o.length]);O.position.y=w+D*1.4+1.5,O.rotation.y=Math.random()*Math.PI,A.add(O)}A.position.set(M,S+.6,E),A.scale.setScalar(C),n.add(A)}else{const C=1.4+Math.random()*3.6,A=new U(new pd(C,0),c);A.position.set(M,S+C*.35,E),A.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),A.scale.set(1,.7+Math.random()*.4,1),n.add(A),ri.push({kind:"rock",x:M,z:E,radius:C*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const _=ie.length*x/3+6;if(Hi(_))continue;const g=_t(_),f=_t(_+h),y=g.p.clone().add(f.p).multiplyScalar(.5),{q:v}=is(g,f),M=ie.width*.5+1.2,E=9,S=new tt,C=new Xe(.4,.55,E,7);for(const D of[-1,1]){const O=new U(C,s);O.position.set(D*M,E/2,0),S.add(O)}const A=M*2,w=new U(new re(A,1.1,1.1),s);w.position.y=E,S.add(w);const b=new Ct({map:Cd(p[x]),transparent:!0,side:At}),P=new U(new Nt(A*.82,3),b);P.position.set(0,E-2,0),P.rotation.y=Math.PI,S.add(P),S.position.copy(y),S.quaternion.copy(v),n.add(S)}if(d.length){const x=new Xe(.18,.24,3,6);x.translate(0,1.5,0);const _=new Ot(.34,8,6);_.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),f=new W({roughness:.55}),y=new rn(x,g,d.length),v=new rn(_,f,d.length),M=new kt;for(let E=0;E<d.length;E++)M.position.copy(d[E]),M.quaternion.copy(u[E]),M.updateMatrix(),y.setMatrixAt(E,M.matrix),v.setMatrixAt(E,M.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return b_(n),w_(n),Te.add(n),n}function T_(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new en(n);return t.colorSpace=Lt,t}function Cd(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new en(e);return i.colorSpace=Lt,i}function E_(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const o=new en(t);return o.colorSpace=Lt,o}function A_(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new en(n);return i.colorSpace=Lt,i.wrapS=On,i.repeat.set(3,1),i}function an(n,e,t,i,s){const a=new U(new re(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function is(n,e){const t=e.p.clone().sub(n.p).normalize(),i=wd.crossVectors(on,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new os().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new Tt().makeBasis(i,s,t),o=new os().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:o}}function d0(n,e,t,i){const s=[],a=[],r=[],o=ie.width*.47;let c=0;for(let u=e;u<=t;u+=8){const m=_t(Math.min(u,t)),p=is(m,_t(m.s+2)),x=Math.sin(u*.018)*.04,_=m.p.clone().addScaledVector(p.sideways,-o).addScaledVector(p.normal,.46+x),g=m.p.clone().addScaledVector(p.sideways,o).addScaledVector(p.normal,.46-x);s.push(_.x,_.y,_.z,g.x,g.y,g.z);const f=(u-e)/64;if(a.push(0,f,1,f),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new sn;h.setAttribute("position",new Rt(s,3)),h.setAttribute("uv",new Rt(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new U(h,i);d.receiveShadow=!0,n.add(d)}function C_(n,e){let t=0;for(const i of ie.gaps)d0(n,t,Math.max(t,i.start-4),e),t=i.end+4;d0(n,t,ie.length,e)}function R_(n,e,t){const i=_t(e.s+2),{normal:s,q:a}=is(e,i),r=new tt;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const o=new U(new re(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,r.add(o);const c=new U(new re(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new U(new re(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function P_(){const n=new tt;Te.add(n),Uh=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new W({color:4935486,roughness:.92,metalness:.04}),m=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),_=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const f=new W({map:KM(),roughness:.74,metalness:.08}),y=new Ct({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;C_(n,f);function M(E,S=!1){if(Hi(E))return!1;const C=_t(E),A=_t(E+3),{sideways:w,normal:b,q:P}=is(C,A),D=C.p,O=le(D.x,D.z),Z=D.y-.95;if(Z-O<10)return!1;const ee=ie.width*(S?.43:.35),Y=Z,J=O+.25,te=S?.56:.42,pe=S?2.4:1.75,Me=S?.52:.36,Ze=[],I=[];for(const Ae of[-1,1])if(In(D.x+w.x*Ae*ee,D.z+w.z*Ae*ee,pe*2.2,pe*2.2,1.2))return!1;for(const Ae of[-1,1]){const Fe=D.clone().addScaledVector(w,Ae*ee).addScaledVector(b,-.85);Fe.y=Y;const Be=new L(Fe.x,J,Fe.z);qn(n,Be,Fe,te,a);const nt=new U(new Xe(pe,pe*1.12,Me,12),a);nt.position.set(Be.x,O+Me*.5,Be.z),nt.receiveShadow=!0,n.add(nt),Ze.push(Fe),I.push(Be),ri.push({x:Be.x,z:Be.z,hw:pe*.92,hd:pe*.92,maxY:Y-.7})}const De=D.clone().addScaledVector(b,-1.05);De.y=Y,an(n,new L(ie.width*.92,S?.58:.42,S?1.55:1.15),De,P,r);const Se=I[0].clone();Se.y+=(Y-J)*.28;const Ie=I[1].clone();Ie.y+=(Y-J)*.28;const $=Ze[0].clone();$.y-=1;const K=Ze[1].clone();if(K.y-=1,qn(n,Se,K,S?.18:.14,c),qn(n,Ie,$,S?.18:.14,c),S){const Ae=I[0].clone();Ae.y+=(Y-J)*.58;const Fe=I[1].clone();Fe.y+=(Y-J)*.58,qn(n,I[0].clone().setY(J+1.2),Fe,.16,c),qn(n,I[1].clone().setY(J+1.2),Ae,.16,c),qn(n,Ae,K,.16,c),qn(n,Fe,$,.16,c)}return Uh++,!0}for(let E=0;E<ie.length;E+=v){if(Hi(E+v*.5))continue;const S=_t(E),C=_t(E+v),A=S.p.clone().add(C.p).multiplyScalar(.5),{sideways:w,normal:b,q:P}=is(S,C),D=S.p.distanceTo(C.p)+.45,O=Math.floor(E/(v*2))%2?e:t;an(n,new L(ie.width,.62,D),A.clone().addScaledVector(b,-.05),P,O),an(n,new L(ie.width-2.8,.08,D*.86),A.clone().addScaledVector(b,.36),P,u),an(n,new L(.2,.1,D*.76),A.clone().addScaledVector(w,-ie.width*.19).addScaledVector(b,.43),P,u),an(n,new L(.2,.1,D*.76),A.clone().addScaledVector(w,ie.width*.19).addScaledVector(b,.43),P,u),E%48===0&&(an(n,new L(.14,.08,D*.62),A.clone().addScaledVector(w,-ie.width*.08).addScaledVector(b,.51),P,_),an(n,new L(.14,.08,D*.62),A.clone().addScaledVector(w,ie.width*.08).addScaledVector(b,.51),P,_)),E%120===0&&an(n,new L(ie.width*.42,.07,.72),A.clone().addScaledVector(b,.55),P,g),an(n,new L(ie.width+1.2,.35,D*.94),A.clone().addScaledVector(b,-.56),P,r),an(n,new L(.42,.42,D*.9),A.clone().addScaledVector(w,-ie.width*.36).addScaledVector(b,-.78),P,x),an(n,new L(.42,.42,D*.9),A.clone().addScaledVector(w,ie.width*.36).addScaledVector(b,-.78),P,x);const Z=A.clone().addScaledVector(w,-ie.width*.51),ee=A.clone().addScaledVector(w,ie.width*.51);if(an(n,new L(.32,.46,D),Z.clone().addScaledVector(b,.28),P,i),an(n,new L(.32,.46,D),ee.clone().addScaledVector(b,.28),P,i),an(n,new L(.26,.72,D*.94),Z.clone().addScaledVector(b,-.22),P,r),an(n,new L(.26,.72,D*.94),ee.clone().addScaledVector(b,-.22),P,r),E%36===0)for(const Y of[-ie.width*.39,-ie.width*.2,ie.width*.2,ie.width*.39]){const J=new U(new Xe(.16,.2,.12,10),o);J.position.copy(A).addScaledVector(w,Y).addScaledVector(b,.46),J.quaternion.copy(P),J.castShadow=!1,n.add(J)}if(E%72===0&&(an(n,new L(.34,1.56,3.4),A.clone().addScaledVector(w,-ie.width*.66).addScaledVector(b,1.16),P,s),an(n,new L(.34,1.56,3.4),A.clone().addScaledVector(w,ie.width*.66).addScaledVector(b,1.16),P,s),an(n,new L(.18,.18,4.4),A.clone().addScaledVector(w,-ie.width*.62).addScaledVector(b,1.94),P,s),an(n,new L(.18,.18,4.4),A.clone().addScaledVector(w,ie.width*.62).addScaledVector(b,1.94),P,s),an(n,new L(.12,.12,4),A.clone().addScaledVector(w,-ie.width*.62).addScaledVector(b,1.38),P,i),an(n,new L(.12,.12,4),A.clone().addScaledVector(w,ie.width*.62).addScaledVector(b,1.38),P,i),qn(n,A.clone().addScaledVector(w,-ie.width*.58).addScaledVector(b,-1.08),A.clone().addScaledVector(w,ie.width*.58).addScaledVector(b,-1.08),.11,c),qn(n,A.clone().addScaledVector(w,-ie.width*.48).addScaledVector(b,-1),A.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c),qn(n,A.clone().addScaledVector(w,ie.width*.48).addScaledVector(b,-1),A.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const Y=new U(new bn(1,28),y);Y.rotation.x=-Math.PI/2,Y.position.set(A.x,-4.72,A.z),Y.scale.set(ie.width*.9,Math.max(10,D*2.2),1),Y.rotation.z=Math.atan2(is(S,C).tangent.x,is(S,C).tangent.z),n.add(Y)}if(E%144===0){const Y=A.clone().addScaledVector(w,-ie.width*.74).addScaledVector(b,2),J=A.clone().addScaledVector(w,ie.width*.74).addScaledVector(b,2);qn(n,Y.clone().addScaledVector(b,-1.2),Y.clone().addScaledVector(b,1.1),.12,s),qn(n,J.clone().addScaledVector(b,-1.2),J.clone().addScaledVector(b,1.1),.12,s),an(n,new L(.46,.72,.46),Y.clone().addScaledVector(b,1.15),P,h),an(n,new L(.46,.72,.46),J.clone().addScaledVector(b,1.15),P,h)}if(E%288===0){const Y=A.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*ie.width*.92).addScaledVector(b,5.2);an(n,new L(.44,.44,.44),Y.clone(),P,m),qn(n,Y.clone().addScaledVector(b,-.2),A.clone().addScaledVector(b,1),.05,c)}E%48===0&&M(E+v*.5,!1),E%168===0&&!Hi(E+16)&&R_(n,_t(E+5),d)}for(const E of ie.gaps){const S=_t(E.start-3),C=_t(E.end+3);for(const A of[S,C]){const w=_t(A.s+2),{normal:b,q:P}=is(A,w);an(n,new L(ie.width-1.2,.08,4.6),A.p.clone().addScaledVector(b,.54),P,h),an(n,new L(ie.width*.62,.09,1.3),A.p.clone().addScaledVector(b,.62).addScaledVector(A.tangent,A===S?-6.3:6.3),P,g);for(const D of[-ie.width*.42,0,ie.width*.42]){const O=A.p.clone().addScaledVector(A.side,D).addScaledVector(b,2.35);an(n,new L(.46,.46,.46),O,P,D===0?p:h)}M(A.s+(A===S?-9:9),!0),M(A.s+(A===S?-24:24),!0)}}return n}function Ff(n=13710372,e=7740696){const t=new tt,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),u=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),m=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),p=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),_=new U(new bn(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const g=(M,E,S,C,A=null,w=null)=>{const b=new U(E,S);return b.name=M,b.position.copy(C),A&&b.rotation.set(A.x||0,A.y||0,A.z||0),w&&b.scale.copy(w),t.add(b),b},f=(M,E,S,C,A,w,b=0,P=0,D=0)=>g(M,new re(E.x,E.y,E.z),S,new L(C,A,w),new L(b,P,D));f("low black undertray",new L(5.25,.28,8.45),a,0,.45,-.08),f("wide wedge body tub",new L(4.85,.86,6.65),i,0,.98,.28,-.035),f("sloped front wedge nose",new L(3.7,.64,3.35),i,0,.83,-3.75,-.145),f("front black splitter",new L(5.25,.13,.78),a,0,.35,-5.6),f("left sculpted rocker panel",new L(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),f("right sculpted rocker panel",new L(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),f("left rear haunch",new L(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),f("right rear haunch",new L(.72,.74,2.55),i,2.53,1.18,2.08,-.04),f("left front fender flare",new L(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),f("right front fender flare",new L(.46,.54,1.38),i,2.55,.98,-2.78,-.04),f("black rear fascia",new L(4.72,.66,.2),r,0,1.02,4.04),f("deep rear bumper",new L(5.32,.38,.48),c,0,.58,4.23),f("front windshield",new L(2.8,.13,1.15),h,0,1.78,-1.25,-.48),f("roof glass",new L(2.34,.18,1.55),h,0,2.08,-.2,-.13),f("left side window",new L(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),f("right side window",new L(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),f("black a pillar left",new L(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),f("black a pillar right",new L(.12,.86,.14),x,1.46,1.75,-1.22,-.48),f("rear deck panel",new L(3.5,.18,2.18),i,0,1.7,2,-.2);for(let M=0;M<7;M++)f("black rear deck louver",new L(3.35,.12,.18),r,0,1.83+M*.015,1.1+M*.28,-.21);f("raised rear spoiler blade",new L(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const M of[-2.28,2.28])f("spoiler side endplate",new L(.24,.78,1.04),s,M,1.43,3.72,0,0,M<0?-.08:.08);for(const M of[-1.78,1.78])f("thin hood crease",new L(.08,.04,2.55),x,M*.36,1.27,-3.45,-.15),f("door seam",new L(.035,.68,1.75),x,M,1.16,-.2),f("side intake",new L(.09,.34,.9),r,Math.sign(M)*2.68,.86,1.42);for(const M of[-1.04,1.04])f("pop up headlight glass",new L(.62,.12,.18),m,M,1.02,-5.28,-.16);f("tail light backplate",new L(3.86,.46,.08),x,0,1.08,4.18);for(const M of[-1.42,-.62,.62,1.42])f("rectangular glowing tail lamp",new L(.54,.28,.1),Math.abs(M)>1?d:u,M,1.08,4.24);f("slim chrome beltline left",new L(.06,.08,4.75),o,-2.72,1.42,-.2),f("slim chrome beltline right",new L(.06,.08,4.75),o,2.72,1.42,-.2),f("left black roof rail",new L(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),f("right black roof rail",new L(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const M of[-2.86,2.86])f("angular side mirror arm",new L(.42,.08,.08),x,M,1.62,-1.55,0,0,M<0?-.14:.14),f("blue tinted side mirror",new L(.12,.34,.46),h,M*1.03,1.62,-1.65,0,M<0?.24:-.24),f("flush door handle",new L(.08,.11,.46),o,M*.94,1.28,.52);for(const M of[-2.65,2.42])f("left wheel arch shadow",new L(.08,.9,1.75),x,-2.82,.78,M),f("right wheel arch shadow",new L(.08,.9,1.75),x,2.82,.78,M);f("black license recess",new L(.9,.24,.08),r,0,.76,4.31);const y=[],v=(M,E,S=!1)=>{const C=new tt;C.name=S?"steering front wheel assembly":"rear wheel assembly",C.position.set(M,.54,E);const A=new U(new Xe(.88,.88,.62,28),a);A.name="wide performance tire",A.rotation.z=Math.PI/2,C.add(A);const w=new U(new Ps(.88,.06,10,32),a);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,C.add(w);const b=new U(new Xe(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,C.add(b);const P=new U(new Xe(.56,.56,.08,24),p);P.name="visible brake disc",P.rotation.z=Math.PI/2,P.position.x=M>0?-.05:.05,C.add(P);for(let Z=0;Z<8;Z++){const ee=new U(new re(.08,.055,.62),o);ee.name="thin wheel spoke",ee.rotation.x=Z/8*Math.PI*2,ee.position.set(M>0?.035:-.035,0,.22),C.add(ee)}const D=new U(new re(.1,.22,.18),u);D.name="small brake caliper",D.position.set(M>0?-.39:.39,.18,-.38),C.add(D);const O=new U(new Xe(.17,.17,.72,18),c);O.name="dark center cap",O.rotation.z=Math.PI/2,C.add(O),t.add(C),S&&y.push(C)};for(const M of[-2.4,2.4])v(M,-2.65,!0),v(M,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const M of[-.92,-.52,.52,.92]){const E=new U(new Xe(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(M,.43,4.52),t.add(E)}return t.traverse(M=>{M.castShadow=!0,M.receiveShadow=!0}),Te.add(t),t}function L_(){const n=new tt,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new U(new re(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new U(new re(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new U(new re(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const u=new U(new Nt(2.8,.82,1,1),r);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,n.add(u);const m=new U(new Ps(.36,.035,12,48),o);m.position.set(0,-.46,-1.02),m.rotation.x=Math.PI/2.75,n.add(m);for(let p=0;p<3;p++){const x=new U(new re(.34,.025,.035),i);x.position.copy(m.position),x.rotation.copy(m.rotation),x.rotation.z+=p/3*Math.PI*2,n.add(x)}for(let p=0;p<6;p++){const x=new U(new Xe(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),n.add(x)}for(const p of[-1.08,1.08]){const x=new U(new Xe(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),n.add(x);const _=new U(new Ps(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(p*.8,-.48,-1.74),_.rotation.x=Math.PI/2,n.add(_)}for(const p of[-1.14,-.84,.84,1.14]){const x=new U(new Xe(.035,.04,.028,8),i);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const p of[-.52,.52]){const x=new U(new Ot(.045,12,8),a);x.position.set(p,-.34,-1.22),n.add(x)}n.position.set(0,0,0),xe.add(n),fn=n}function D_(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:ZM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=_t(0),a=new Tt().makeBasis(s.side,on,s.tangent),r=new os().setFromRotationMatrix(a),o=new tt;for(const d of[-ie.width*.58,ie.width*.58]){const u=new U(new re(.8,11,.8),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(on,5.4),u.quaternion.copy(r),o.add(u)}const c=new U(new re(ie.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(on,11.2),c.quaternion.copy(r),o.add(c);const h=new U(new re(ie.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(on,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),o.add(h);for(const d of[-ie.width*.38,0,ie.width*.38]){const u=new U(new Ot(.32,16,10),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(on,10.25),o.add(u)}return Te.add(o),o}function Rd(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new U(new bn(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,u,m,p=null,x=null)=>{const _=new U(d,u);return _.name=h,_.position.copy(m),p&&_.rotation.set(p.x||0,p.y||0,p.z||0),x&&_.scale.copy(x),n.add(_),_},r=(h,d,u,m,p,x,_,g,f=0,y=0,v=0)=>a(h,new re(d,u,m),p,new L(x,_,g),{x:f,y,z:v}),o=[];function c(h,d,u,m=.88,p=.62){const x=new tt;x.name=u?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,m*.62+.18,d);const _=new U(new Xe(m,m,p,28),i.black);_.name="performance tire",_.rotation.z=Math.PI/2,x.add(_);const g=new U(new Ps(m,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const f=new U(new Xe(m*.48,m*.48,p+.04,24),i.chrome);f.name="chrome rim",f.rotation.z=Math.PI/2,x.add(f);const y=new U(new Xe(m*.62,m*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let M=0;M<8;M++){const E=new U(new re(.08,.055,p),i.chrome);E.name="wheel spoke",E.rotation.x=M/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,m*.25),x.add(E)}const v=new U(new Xe(.17,.17,p+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),u&&o.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:o}}function I_(n=15616818,e=2434871){const t=new tt,i=Rd(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const o=new U(new Xe(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(r,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function F_(n=4165830,e=15908108){const t=new tt,i=Rd(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const o=new U(new Xe(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(r,1.28,3.78),t.add(o)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const o=new U(new Xe(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(r*2.62,.55,.4),t.add(o),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function U_(n=16764159,e=526344){const t=new tt,i=Rd(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const o=new U(new Xe(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=r*.42,o.position.set(r*.75,1.85,.35),t.add(o),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new U(new Xe(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}const Ls=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Ff(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>I_()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>F_()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>U_()}];let Wi=ue.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function Ts(){return l.drivingStolen&&st?y0[st.type]||y0.compact:Ls[Wi].stats}const Uf=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],Zn=Uf.map((n,e)=>({...n,idx:e,mesh:Ff(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),z_=Zn[0].mesh;let Ht=Ls[Wi].build();function N_(n){Wi=ue.clamp(n,0,Ls.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Wi));const e=Ht.visible;Na(Ht),Ht=Ls[Wi].build(),Ht.visible=e,typeof Yh=="function"&&Yh()}for(const n of Zn)n.mesh.visible=!1,Te.add(n.mesh);function ao(n){for(const e of Zn)e.mesh.visible=n}const k_=[10,6,4,2];let $t=null;try{$t=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function ro(){return $t?.active?$t.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function zf(){localStorage.setItem("steel-ribbon-season",JSON.stringify($t))}function O_(){$t={division:ro(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},zf()}function Nf(n){return["One","Two","Three","Four"][ue.clamp(n,1,4)-1]}function kf(){return[{key:"you",label:"You",pts:$t?.points.you??0},...Uf.map(e=>({key:e.key,label:e.label,pts:$t?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Ht.visible=!1;o_();r_();ge.signs=0;wl.length=0;l_();c_();y_();let u0=null,f0=null,p0=null,fn=null,Fc=null;const nn=[];L_();function Ds(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Te.remove(n))}function Na(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Te.remove(n))}const Ha=[],$r=[];let m0=null;function B_(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new en(n);return t.colorSpace=Lt,t}function V_(n,e){if(Hi(n))return!0;for(const t of ie.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of ha)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function G_(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:At}),t=new Xe(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const o=new rn(t,i,Math.ceil(ie.length/12*2)+8),c=new kt;for(const h of[-1,1]){const d=h*(ie.width*.5+.55),u=[],m=x=>{if(!(x.length<2)){for(let _=0;_<x.length-1;_++){const g=x[_],f=x[_+1];u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.12,f.z,f.x,f.y+1.5,f.z),u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.5,f.z,g.x,g.y+1.5,g.z)}a++}};let p=[];for(let x=0;x<=ie.length;x+=s){if(V_(x%ie.length,h)){m(p),p=[];continue}const _=_t(x%ie.length);if(p.push(_.p.clone().addScaledVector(_.side,d).addScaledVector(on,.58)),x%12===0){const g=p[p.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(r++,c.matrix)}}if(m(p),u.length){const x=new sn;x.setAttribute("position",new Rt(u,3)),x.computeVertexNormals(),n.add(new U(x,e))}}o.count=r,o.instanceMatrix.needsUpdate=!0,n.add(o),ge.railRuns=a,ge.railPosts=r}function H_(){Ha.length=0,$r.length=0;const n=new tt,e=new Ct({map:B_(),transparent:!0,depthWrite:!1,side:At,blending:li,opacity:.9}),t=new Nt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<ie.length-60;c+=290){if(ie.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][Ha.length%3]*ie.width,d=_t(c),u=new U(t,e),m=new L().crossVectors(d.side,d.tangent).normalize();m.y<0&&m.multiplyScalar(-1);const p=new Tt().makeBasis(d.side,m,new L().crossVectors(d.side,m).normalize());u.quaternion.setFromRotationMatrix(p),u.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(m,.84),n.add(u),Ha.push({s:c,lat:h})}const i=new Ot(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(ie.length/24));{const c=new rn(i,s,a*2),h=new kt;let d=0;for(let u=0;u<a;u++){const m=u/a*ie.length;if(Hi(m))continue;const p=_t(m);for(const x of[-1,1])h.position.copy(p.p).addScaledVector(p.side,x*(ie.width*.5+.22)).addScaledVector(on,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new Xe(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of ie.gaps){const h=_t(Math.max(6,c.start-22));for(const d of[-1,1]){const u=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),m=new tt,p=new U(r,o),x=new U(new Ot(.3,10,8),u);p.position.y=.75,x.position.y=1.65,m.add(p),m.add(x),m.position.copy(h.p).addScaledVector(h.side,d*(ie.width*.5+.55)).addScaledVector(on,.55),n.add(m),$r.push(u)}}return G_(n),Te.add(n),n}mn(new kt,n=>{if(!$r.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of $r)t.emissiveIntensity=e});function oo(n){return As=ue.clamp(n,0,ra.length-1),ie=ra[As],ri.length=0,ha.length=0,Na(u0),Na(f0),Na(p0),Na(m0),u0=P_(),f0=D_(),p0=S_(),m0=H_(),Dd(),Ye.trackName.textContent=ie.name,Ye.courseName&&(Ye.courseName.textContent=ie.name),Ye.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===As)}),ie.name}oo(0);function W_(){Fc&&Te.remove(Fc),nn.length=0;const n=new tt,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Ct({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:At,blending:li}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=le(a.x,a.z)+4.2,o=new tt,c=new U(new Ps(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,o.add(c);const h=new U(new bn(4.7,32),t.clone());h.rotation.y=a.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const m of[-5.1,5.1]){const p=new U(new Xe(.11,.16,6.2,8),d);p.position.set(Math.cos(a.yaw)*m,-1.1,Math.sin(a.yaw)*m),o.add(p)}const u=new U(new Ot(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(a.x,r,a.z),o.userData.index=s,o.userData.baseY=r,o.userData.label=a.label,n.add(o),nn.push({...a,y:r,radius:8.5,marker:o,collected:!1})}mn(n,s=>{for(let a=0;a<nn.length;a++){const r=nn[a],o=a===l.objectiveIndex;r.marker.visible=!r.collected||o,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Te.add(n),Fc=n}W_();function X_(){const n=new tt,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(In(s,a,r*2+14,r*2+14,10)||En(s,a,r).clearance<-6||nn.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||oa.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||pn.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||_i.some(d=>{const u=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<u+r+2})||Va.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const o=le(s,a);if(Math.max(Math.abs(le(s+r,a)-o),Math.abs(le(s-r,a)-o),Math.abs(le(s,a+r)-o),Math.abs(le(s,a-r)-o))>1.7)continue;const c=new U(new Ul(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,a),c.renderOrder=-4,n.add(c);const h=new U(new bn(r,36),Rf(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,a),h.renderOrder=-3,n.add(h),Pf(s,a,r*.98),t++}ge.ponds=t,Te.add(n),Dd()}X_();const un=Ad(3375807,15905331);un.visible=!1,un.scale.setScalar(1.06),Te.add(un);const Xi=new L(0,0,0);let kh=0,he=null;function q_(){const n=new tt,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,u,m,p,x,_=0,g=0,f=0)=>{const y=new U(d,u);return y.name=h,y.position.set(m,p,x),y.rotation.set(_,g,f),n.add(y),y};r("cabin hull",new re(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new re(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new re(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new re(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new re(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new re(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new Xe(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new re(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new re(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new re(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new re(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new re(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new re(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new re(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new Xe(.22,.28,.5,10),s,0,3.95,-.2);const o=new tt;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new U(new re(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new tt;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new U(new re(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function Y_(){let n=null;for(let d=0;d<700&&!n;d++){const u=-520+Math.random()*1040,m=-1200+Math.random()*1500;if(Math.hypot(u-80,m-300)>(d<350?420:1200)||In(u,m,26,26,6))continue;const p=le(u,m);Math.max(Math.abs(le(u+11,m)-p),Math.abs(le(u-11,m)-p),Math.abs(le(u,m+11)-p),Math.abs(le(u,m-11)-p))>.8||pn.some(x=>Math.abs(x.x-u)<x.hw+13&&Math.abs(x.z-m)<x.hd+13)||Va.some(x=>Math.hypot(x.x-u,x.z-m)<(x.radius||4)+13)||oa.some(x=>Math.hypot(x.x-u,x.z-m)<x.rx+16)||nn.some(x=>Math.hypot(x.x-u,x.z-m)<24)||En(u,m,12).clearance<2||(n={x:u,z:m,y:p})}n||(n={x:150,z:330,y:le(150,330)});const e=new tt,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new U(new Xe(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new en(s);r.colorSpace=Lt;const o=new U(new bn(9.6,36),new Ct({map:r,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const u=d/8*Math.PI*2,m=new U(new Ot(.22,8,6),c);m.position.set(n.x+Math.cos(u)*10.2,n.y+.34,n.z+Math.sin(u)*10.2),e.add(m)}Te.add(e);const h=q_();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Te.add(h.mesh),he={pad:n,pos:new L(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new L,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},he.mesh.quaternion.setFromAxisAngle(on,-he.yaw),ge.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}Y_();var Ii=[],Of=null;function $_(n,e){if(!Ii)return 0;for(const t of Ii){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return Of=t,a/t.len*t.h}return 0}function Z_(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Ii.length<6;r++){const o=n[Ii.length%n.length],{len:c,h}=o,d=Math.random()<.5,u=Math.round((Ve.x1-Ve.x0)/Ve.pitch),m=(d?Ve.x0:Ve.zFar)+(Math.random()*(d?u:Math.round((Ve.zNear-Ve.zFar)/Ve.pitch))|0)*Ve.pitch,p=(Math.random()<.5?-1:1)*(Ve.streetW*.5+10+Math.random()*9),x=d?Ve.zFar+120+Math.random()*(Ve.zNear-Ve.zFar-240):Ve.x0+120+Math.random()*(Ve.x1-Ve.x0-240),_=d?m+p:x,g=d?x:m+p,f=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(f),v=-Math.cos(f),M=_+y*c,E=g+v*c;if(In(_,g,e+4,e+4,2)||In(M,E,e+4,e+4,2)||En(_,g,8).clearance<11||En(M,E,8).clearance<11||ta(_,g).depth>0||ta(M,E).depth>0||ta(M+y*40,E+v*40).depth>0||Math.abs(le(_,g)-le(M,E))>1.1||Ii.some(w=>Math.hypot(w.x-_,w.z-g)<150))continue;const S=(w,b,P,D)=>w.some(O=>Math.abs(b-O.x)<(O.hw??O.radius??0)+D&&Math.abs(P-O.z)<(O.hd??O.radius??0)+D);let C=!1;for(const[w,b,P]of[[_-y*45,g-v*45,6],[_-y*22,g-v*22,6],[_,g,7],[M,E,7],[M+y*45,E+v*45,9],[M+y*95,E+v*95,9]])if(S(pn,w,b,P)||S(_i,w,b,P)){C=!0;break}if(C)continue;const A={x:_,z:g,yaw:f,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const w=le(_,g)+h+13;A.hoop={x:M+y*28,y:w,z:E+v*28,r:7}}Ii.push(A)}for(const r of Ii){const o=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const A=new U(new Ps(r.hoop.r,.5,10,30),a);A.position.set(r.hoop.x,r.hoop.y,r.hoop.z),A.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Te.add(A)}const c=le(r.x,r.z)+.05,h=-r.fz,d=r.fx,u=r.w*.5,m=[r.x-h*u,c,r.z-d*u],p=[r.x+h*u,c,r.z+d*u],x=[r.x+r.fx*r.len-h*u,c,r.z+r.fz*r.len-d*u],_=[r.x+r.fx*r.len+h*u,c,r.z+r.fz*r.len+d*u],g=[x[0],c+r.h,x[2]],f=[_[0],c+r.h,_[2]],y=[...m,...p,...f,...m,...f,...g,...x,..._,...f,...x,...f,...g,...m,...g,...x,...p,..._,...f],v=new sn;v.setAttribute("position",new Rt(y,3)),v.computeVertexNormals();const M=new U(v,i);M.castShadow=!1,M.receiveShadow=!0,Te.add(M);const E=Math.hypot(r.len,r.h),S=new re(.26,.24,E),C=new U(new re(1.1,.1,E*.94),s);C.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),C.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Te.add(C);for(const A of[-1,1]){const w=new U(S,o),b=r.x+h*u*A,P=r.z+d*u*A,D=r.x+r.fx*r.len+h*u*A,O=r.z+r.fz*r.len+d*u*A;w.position.set((b+D)/2,c+r.h/2+.12,(P+O)/2),w.lookAt(D,c+r.h+.12,O),Te.add(w);const Z=new U(new Ot(.34,10,8),t);Z.position.set(D,c+r.h+.55,O),Te.add(Z)}}ge.stuntRamps=Ii.length}Z_();function K_(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];ge.propPlanes=0;for(const e of n){const t=new tt,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new U(new Xe(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new U(new Fi(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const o=new U(new Ot(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new U(new re(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new U(new re(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new U(new re(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const u=new tt,m=new re(.26,5.4,.12),p=new U(m,s),x=new U(m,s);x.rotation.z=Math.PI/2,u.add(p),u.add(x),u.position.z=-5.75,t.add(u),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Te.add(t);const _=Math.random()*Math.PI*2;mn(t,(g,f)=>{t.position.x+=e.dir*e.speed*f,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+_)*5,t.rotation.z=Math.sin(g*.22+_)*.14,u.rotation.z+=f*38}),ge.propPlanes++}}K_();const ct={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},Bf=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),Vf=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function lo(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),ct.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function Gf(){const n=so("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new U(new re(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new U(new re(.62,.24,.46),Bf),s=new U(new re(.62,.24,.46),Vf);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function x0(n,e){return pn.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||ta(n,e).depth>.35}function J_(){const n=Math.random()*Math.PI*2,e=ue.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=ue.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=Gf();Te.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return ct.cars.push(s),di("whoosh",.2,.8,.1),s}function Hf(n){Ds(n.mesh),ct.cars=ct.cars.filter(e=>e!==n)}function Wf(n){for(const e of n.meshes)Ds(e);ct.blocks=ct.blocks.filter(e=>e!==n)}function Pd(){for(const n of[...ct.cars])Hf(n);for(const n of[...ct.blocks])Wf(n);ct.evadeT=0,ct.nearest=1/0,ct.bustT=0,ct.blockCd=6,l.heat=0}function j_(){const n=Math.sin(l.roamYaw),e=-Math.cos(l.roamYaw),t=l.roamPos.x+n*215,i=l.roamPos.z+e*215,s=Ve.x0+Math.round((t-Ve.x0)/Ve.pitch)*Ve.pitch,a=Ve.zNear-Math.round((Ve.zNear-i)/Ve.pitch)*Ve.pitch,r=Math.abs(t-s),o=Math.abs(i-a);let c,h,d,u,m,p;if(r<=o&&r<Ve.streetW*.6)c=s,h=i,d=1,u=0,m=0,p=1;else if(o<Ve.streetW*.6)c=t,h=a,d=0,u=1,m=1,p=0;else return!1;if(c<Ve.x0||c>Ve.x1||h>Ve.zNear||h<Ve.zFar||ct.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=le(c,h),_=Ve.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),f=new U(new re(.9,.16,_),g);f.position.set(c,x+.1,h),f.lookAt(c+d,x+.1,h+u),Te.add(f);const y=[f];for(const v of[-1,1]){const M=Gf();M.position.set(c+d*v*(_*.32),x+.06,h+u*v*(_*.32)),M.rotation.y=Math.atan2(d,u)+v*.7,Te.add(M),y.push(M)}return ct.blocks.push({x:c,z:h,latX:d,latZ:u,fwX:m,fwZ:p,w:_,meshes:y,age:0,hitT:0}),l.message="ROADBLOCK AHEAD!",l.messageTimer=1.3,Cn(500,.2,"square",.1),!0}function Q_(){const n=Math.min(600,Math.round(l.score*.12)+150);l.score=Math.max(0,l.score-n),ge.busts=(ge.busts||0)+1,l.message=`BUSTED! -${n}`,l.messageTimer=2,l.cameraShake=.5,Cn(220,.5,"sawtooth",.14),Ke.state==="active"&&Zr("busted"),l.drivingStolen&&st&&(Gl(),l.vehicle="foot",l.speed=0,un.visible=!0,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,l.message="BUSTED! Ride confiscated"),Pd()}function ey(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),a=l.heat||0;let r=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(x0(n.x+o*17,n.z+c*17)){const u=n.yaw-.7,m=n.yaw+.7;r=!x0(n.x+Math.sin(u)*17,n.z-Math.cos(u)*17)?u:m}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=ue.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=ue.clamp(n.x,-800,800),n.z=ue.clamp(n.z,-1600,460),n.mesh.position.set(n.x,le(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const u of n.mesh.userData.wheels||[])u.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?(tp(new L(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,lo(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}mn(new kt,(n,e)=>{const t=Math.floor(n*3.4)%2;if(Bf.emissiveIntensity=t?2.6:.35,Vf.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){ct.cars.length&&Pd();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;ct.cars.length<s;)J_();for(;ct.cars.length>s;)Hf(ct.cars[ct.cars.length-1]);let a=1/0;for(const r of[...ct.cars])a=Math.min(a,ey(r,e));ct.nearest=a,i>0&&a<12&&Math.abs(l.speed)<8?(ct.bustT+=e,ct.bustT>2.2&&(ct.bustT=0,Q_())):ct.bustT=Math.max(0,ct.bustT-e*1.5),i>=4&&(ct.blockCd-=e,ct.blockCd<=0&&Math.abs(l.speed)>30&&(j_(),ct.blockCd=12));for(const r of[...ct.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&Wf(r);const o=l.roamPos.x-r.x,c=l.roamPos.z-r.z,h=o*r.latX+c*r.latZ,d=o*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!l.roamAir&&l.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,l.spikedT=3.5,l.speed*=.5,l.damage=ue.clamp(l.damage+6,0,100),l.message="SPIKE STRIP!",l.messageTimer=1.2,l.cameraShake=Math.max(l.cameraShake,.4),di("skid",.55,1.25,.1),lo(.15))}if(ct.panicTick-=e,ct.panicTick<=0&&i>0){ct.panicTick=.4;for(const r of Rn){const o=r.actor;if(!o||!o.type||o.stolen||o.panicT>0)continue;let c=Math.hypot(l.roamPos.x-r.x,l.roamPos.z-r.z)<45;if(!c){for(const h of ct.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(o.panicT=1.6)}}i>0&&(a>240?(ct.evadeT+=e,ct.evadeT>9&&(l.heat=Math.max(0,i-1),ct.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,Gi("+500 ESCAPED THE LAW"),Cn(980,.22),l.message="You lost them",l.messageTimer=1.4))):ct.evadeT=Math.max(0,ct.evadeT-e*.6)),ge.police=ct.cars.length});const Ke={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},g0=["van","boxTruck","taxi","pickup"];function Xf(n){const e=new U(new Xe(3.4,3.4,340,12,1,!0),new Ct({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:At,blending:li}));return e.frustumCulled=!1,Te.add(e),e}function qf(){for(const n of Ke.beacons)n.geometry.dispose(),n.material.dispose(),Te.remove(n);Ke.beacons=[]}function Oh(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?Ve.x0+(Math.random()*Math.round((Ve.x1-Ve.x0)/Ve.pitch)|0)*Ve.pitch:Ve.zNear-(Math.random()*Math.round((Ve.zNear-Ve.zFar)/Ve.pitch)|0)*Ve.pitch,a=(Math.random()<.5?-1:1)*(Ve.streetW*.5+6),r=i?Ve.zFar+100+Math.random()*(Ve.zNear-Ve.zFar-200):Ve.x0+100+Math.random()*(Ve.x1-Ve.x0-200),o=i?s+a:r,c=i?r:s+a,h=Math.hypot(o-l.roamPos.x,c-l.roamPos.z);if(!(h<n||h>e)&&!In(o,c,8,8,1)&&!(ta(o,c).depth>0)&&!pn.some(d=>Math.abs(o-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:o,z:c,yaw:i?0:Math.PI/2}}return null}function Yf(){const n=Oh(200,700);if(!n){Ke.cooldown=4;return}const e=g0[Math.random()*g0.length|0];Ke.type=e,Ke.mesh=so(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ke.mesh.userData.stolenYOff=.57,Ke.mesh.position.set(n.x,le(n.x,n.z)+.28,n.z),Ke.mesh.rotation.y=-n.yaw,Te.add(Ke.mesh),Ke.pickup=n;const t=Xf(3531007);t.position.set(n.x,le(n.x,n.z)+150,n.z),Ke.beacons.push(t),Ke.state="available",l.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,l.messageTimer=2}function ty(){if(Ke.state!=="available"||!Ke.mesh||l.roamPos.distanceTo(Ke.mesh.position)>6)return!1;Ud();const n=Ke.mesh;return st={mesh:n,type:Ke.type,actor:null,parked:null,parkedYaw:0,job:!0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.position.x,le(n.position.x,n.position.z)+kn,n.position.z),l.roamYaw=Ke.pickup.yaw,l.camYaw=l.roamYaw,l.speed=0,un.visible=!1,di("jack",.5,1,.08)||Cn(340,.18,"square",.1),ni(),ny(),!0}function ny(){const n=Oh(420,900)||Oh(250,1100);if(!n){Zr("no route");return}Ke.dest=n,Ke.timeLeft=Math.round(14+Math.hypot(n.x-l.roamPos.x,n.z-l.roamPos.z)*.062),qf();const e=Xf(16766720);e.position.set(n.x,le(n.x,n.z)+150,n.z),Ke.beacons.push(e),Ke.state="active",l.message=`Deliver the ${Ke.type.toUpperCase()} to the gold beacon — ${Ke.timeLeft}s`,l.messageTimer=2.2}function Ld(n){qf(),Object.assign(Ke,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Zr(n){Ke.state!=="idle"&&(st?.job?(Gl(),l.vehicle==="car"&&(l.vehicle="foot",un.visible=!0,l.speed=0,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05)):Ke.mesh&&Ds(Ke.mesh),Ld(9),n!=="silent"&&(l.message=`Delivery failed — ${n}`,l.messageTimer=1.6,Cn(240,.3,"sawtooth",.1)),ge.deliveryFails=(ge.deliveryFails||0)+1)}function iy(n){Ds(n),Ld(9),l.message="Delivery failed — vehicle abandoned",l.messageTimer=1.5,ge.deliveryFails=(ge.deliveryFails||0)+1}function sy(){const n=1200+Math.ceil(Ke.timeLeft)*10;l.score+=n,ge.deliveries=(ge.deliveries||0)+1,Gi(`+${n} DELIVERED`,!0),Cn(980,.18),setTimeout(()=>Cn(1320,.22),100);const e=st?.mesh;st=null,l.drivingStolen=!1,e&&Ds(e),l.vehicle="foot",l.speed=0,un.visible=!0,l.roamPos.x-=Math.cos(l.roamYaw)*3.4,l.roamPos.z-=Math.sin(l.roamYaw)*3.4,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,Ld(8),l.message="Delivered! Another job will turn up",l.messageTimer=1.8}mn(new kt,(n,e)=>{if(l.mode!=="roam"){Ke.state!=="idle"&&Zr("silent");return}Ke.state==="idle"?(Ke.cooldown-=e,Ke.cooldown<=0&&Yf()):Ke.state==="active"&&(Ke.timeLeft-=e,Ke.timeLeft<=0?Zr("time's up"):l.drivingStolen&&st?.job&&Math.hypot(l.roamPos.x-Ke.dest.x,l.roamPos.z-Ke.dest.z)<15&&Math.abs(l.speed)<26&&sy())});mn(new kt,(n,e)=>{if(!he)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;he.rpm+=(t-he.rpm)*Math.min(1,e*(t?1.4:.5)),he.rotor.rotation.y+=he.rpm*26*e,he.tailRotor.rotation.x+=he.rpm*42*e});const ay=new Ct({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),ll=Array.from({length:42},()=>{const n=new U(new Ot(.14,6,5),ay);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new L}}),ry=new Ct({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:At}),Bh=Array.from({length:14},()=>{const n=new U(new Ul(.82,1,28),ry.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1}});function $f(n,e,t=1){const i=Bh.find(s=>s.life<=0)||Bh[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,le(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function oy(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=ll.find(a=>a.life<=0)||ll[i%ll.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}$f(n.x,n.z,1.6)}mn(new kt,(n,e)=>{for(const t of ll)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of Bh)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const ar=new OM(ln);ar.addPass(new BM(Te,xe));const Zf=new Ja(new Ne(window.innerWidth,window.innerHeight),.4,.72,.86);ar.addPass(Zf);ar.addPass(new VM);const ly={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Tr=new bf(ly);ar.addPass(Tr);const cy=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Lr=Array.from({length:72},()=>{const n=new U(new Ot(.1,8,5),cy);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new L}}),hy=new Ct({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:At}),Dr=Array.from({length:90},()=>{const n=new U(new bn(1,18),hy.clone());return n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1,velocity:new L,spin:0}}),dy=new W({color:2962232,roughness:.58,metalness:.34}),Ir=Array.from({length:48},()=>{const n=new U(new re(.18,.08,.26),dy);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new L,spin:new L}});let Pe=null;function Kf(){if(Pe)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let A=0;A<1024;A++){const w=(A/511.5-1)*1.6;a[A]=4*w/(1+3*Math.abs(w))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const o=(A,w,b)=>{const P=n.createOscillator(),D=n.createGain();return P.type=A,D.gain.value=w,P.connect(D),D.connect(b),P.start(),{o:P,g:D}},c=o("sine",.5,t),h=o("sawtooth",.3,r),d=o("sawtooth",.3,r),u=o("triangle",.03,t),m=n.createOscillator(),p=n.createGain();m.type="sine",m.frequency.value=12,p.gain.value=0,m.connect(p),p.connect(r.gain),m.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),_=x.getChannelData(0);for(let A=0;A<_.length;A++)_[A]=Math.random()*2-1;const g=(A,w,b,P)=>{const D=n.createBufferSource(),O=n.createBiquadFilter(),Z=n.createGain();return D.buffer=x,D.loop=!0,D.playbackRate.value=P,O.type=A,O.frequency.value=w,O.Q.value=b,Z.gain.value=1e-4,D.connect(O),O.connect(Z),Z.connect(e),D.start(),{filter:O,gain:Z}},f=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),M=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const S=n.createOscillator(),C=n.createGain();S.type="triangle",S.frequency.value=660,C.gain.value=1e-4,S.connect(C),C.connect(e),S.start(),Pe={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:u,burble:{o:m,depth:p},siren:{o:S,g:C},rain:M,wind:f,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const Jf={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},uy=["interceptor","bullet","brawler","zephyr"];function jf(){return l.mode==="roam"&&l.drivingStolen&&st?Jf[st.type]?st.type:"compact":uy[Wi]||"interceptor"}function ls(){Pe||Kf(),Pe?.ctx.state==="suspended"&&Pe.ctx.resume().catch(()=>{}),gy()}function Wa(n){if(!Pe)return;const{ctx:e}=Pe,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Pe.master),t.start(),t.stop(e.currentTime+.24)}function fy(){if(!Pe||di("whoosh",.4,1,.1))return;const{ctx:n}=Pe,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Pe.master),e.start(),e.stop(n.currentTime+.6)}function py(){if(!Pe||di("splat",.6,1,.14))return;const n=Pe.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Qf(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Pe.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Pe.master),s.start(),s.stop(n.currentTime+.26)}let Uc=null;function Qf(){if(Uc)return Uc;const n=Pe.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return Uc=e}function my(n=1){if(!Pe||di("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Pe,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Qf(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Pe.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Qn={buffers:{},loops:{},loading:!1},xy=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function gy(){if(!(Qn.loading||!Pe)){Qn.loading=!0;for(const n of xy)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Pe.ctx.decodeAudioData(e)).then(e=>Qn.buffers[n]=e).catch(()=>{})}}function di(n,e=.5,t=1,i=.06){const s=Pe&&Qn.buffers[n];if(!s)return!1;const a=Pe.ctx,r=a.createBufferSource(),o=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,r.connect(o).connect(Pe.master),r.start(),!0}function zc(n,e,t=1e-4){if(Qn.loops[n])return Qn.loops[n];if(!Pe||!Qn.buffers[n])return null;const i=Pe.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Qn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Pe.master),s.start(),Qn.loops[n]={src:s,gain:a}}const v0={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function M0(n,e,t,i,s,a){const{ctx:r}=Pe,o=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Pe.musicGain),o.start(e),o.stop(e+t+.05)}function vy(){const{ctx:n}=Pe,e=60/92/2;for(Pe.nextNote<n.currentTime-1&&(Pe.nextNote=n.currentTime+.08);Pe.nextNote<n.currentTime+.35;){const t=Pe.beat%32,i=t/8|0;t%4===0&&M0(v0.bass[i],Pe.nextNote,.5,"triangle",.5,420),M0(v0.arps[i][t%4],Pe.nextNote,.19,"sawtooth",.16,1300),Pe.nextNote+=e,Pe.beat++}}function na(n,e=18){const t=Math.min(e,Lr.length);for(let i=0;i<t;i++){const s=Lr.find(a=>a.life<=0)||Lr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function ep(n,e=10,t=1){const i=Math.min(e,Dr.length);for(let s=0;s<i;s++){const a=Dr.find(r=>r.life<=0)||Dr[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new L((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function My(n,e=8,t=1){const i=Math.min(e,Ir.length);for(let s=0;s<i;s++){const a=Ir.find(r=>r.life<=0)||Ir[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new L((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function tp(n,e=Math.abs(l.speed),t="CRASH"){const i=ue.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=ue.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),na(n,Math.round(10+i*24)),ep(n,Math.round(5+i*12),i),My(n,Math.round(3+i*8),i),di("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||Wa(18+i*34)}function _y(n){for(const e of Lr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Dr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(xe.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Ir)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function yy(){if(!Pe)return;const{ctx:n}=Pe,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,a=ue.clamp((s-900)/6600,0,1),r=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=Jf[jf()],h=i?26+(he?.rpm||0)*14:(38+a*124)*c.fMul;Pe.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Pe.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Pe.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Pe.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Pe.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Pe.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Pe.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Pe.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Pe.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Pe.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Pe.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*o),e,.06),Pe.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*o),e,.07),Pe.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Pe.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,u=zc("skid");Pe.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(u?.05:.15):1e-4,e,.09),u&&u.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const m=zc("rotor");m&&(m.gain.gain.setTargetAtTime(i?.06+(he?.rpm||0)*.3:1e-4,e,i?.3:.15),m.src.playbackRate.setTargetAtTime(.65+(i&&he?.rpm||0)*.5,e,.4)),l.boosting&&!Pe.prevBoost&&fy(),Pe.prevBoost=!!l.boosting,Pe.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Pe.boost.filter.frequency.setTargetAtTime(l.boosting?420+r*3:260,e,.1),Pe.rain&&Pe.rain.gain.gain.setTargetAtTime(ja()>.02&&l.mode!=="menu"?ja()*.045:1e-4,e,.4);const p=l.mode==="roam"&&(l.heat||0)>0&&ct.nearest<460,x=p?Math.min(.06,(460-ct.nearest)/460*.075):1e-4;Pe.siren.g.gain.setTargetAtTime(x,e,.25),Pe.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const _=localStorage.getItem("steel-ribbon-music")!=="0",g=_?zc("music",Pe.musicGain,1):Qn.loops.music||null;Pe.musicGain.gain.setTargetAtTime(_?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),_&&!g&&vy()}function Kr(n=!1,e=!1,t=!1){Kf(),ls(),je.clear(),Qr(),Gl();const i=n||e;l.seasonRace=t&&!i;for(let a=0;a<Zn.length;a++){const r=Zn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=_t(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],Yy(),$y(),Ye.menu.classList.add("hidden"),Ye.result.classList.add("hidden"),Ye.resultStats.innerHTML="",Ye.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Ye.trackName.textContent=ie.name,Ht.visible=!1,fn&&(fn.visible=!0),document.body.classList.remove("roam-mode"),$i(),window.__freeCam=!1}function Tl(){ls(),l.mode="roam",l.practice=!0,l.freeRun=!1,je.clear(),Qr();let n=80,e=338;En(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,le(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Re.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",un.visible=!1,Zr("silent"),Gl(),Pd(),he&&(he.pos.set(he.pad.x,he.pad.y+.24,he.pad.z),he.vel.set(0,0,0),he.mesh.position.copy(he.pos));for(const s of nn)s.collected=!1;l.message="",l.messageTimer=0,ao(!1),Ht.visible=!0,fn&&(fn.visible=!1),document.body.classList.add("roam-mode"),$i(),window.__freeCam=!1,Ye.menu.classList.add("hidden"),Ye.result.classList.add("hidden"),Ye.position.textContent="FREE ROAM",Ye.trackName.textContent="City Streets",ni();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);xe.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),Xh(),xe.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),xe.fov=69,xe.updateProjectionMatrix()}function ni(){const n=Fd();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(on,-l.roamYaw),n.rotateZ(-l.wheelSteer*ue.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:ue.clamp(-l.roamVy*.014,-.3,.34):ue.clamp(l.roamSuspension,-.16,.22))}function np(n,e){let t=null;for(const s of ha)for(const a of s.segments){const r=n-a.a.x,o=e-a.a.z,c=ue.clamp((r*a.abx+o*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,u=Math.hypot(n-h,e-d);if(u>s.halfW+Un*1.15)continue;const m=ue.lerp(a.a.y,a.b.y,c),p=ue.lerp(a.u0,a.u1,c),x=u+Math.max(0,le(n,e)-m)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:m,u:p,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*ie.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function ip(n,e,t=le(n,e),i=!1){let s=null;const a=10;for(let o=0;o<ie.length;o+=a){if(Hi(o+a*.5))continue;const c=_t(o),h=_t(o+a),d=h.p.x-c.p.x,u=h.p.z-c.p.z,m=Math.max(1e-4,d*d+u*u),p=ue.clamp(((n-c.p.x)*d+(e-c.p.z)*u)/m,0,1),x=c.p.x+d*p,_=c.p.z+u*p,g=n-x,f=e-_,y=Math.hypot(g,f);if(y>ie.width*.5+Un*.45)continue;const v=ue.lerp(c.p.y,h.p.y,p)+.58;if(!i&&t<v-5)continue;const M=new L(u,0,-d).normalize(),E=ue.clamp(g*M.x+f*M.z,-ie.width*.44,ie.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+a*p,lateral:E,tangentX:d,tangentZ:u,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function Js(n,e,t=l.roamPos.y){const i=le(n,e),s=$_(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=np(n,e);r&&r.y>=i-1.2&&(a=r);const o=ip(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&o&&o.y>=a.y-.8&&(a=o),a}function _0(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=_t(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=ue.clamp(n.lateral??0,-ie.width*.32,ie.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=ue.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),ao(!1),Ht.visible=!1,fn&&(fn.visible=!0),document.body.classList.remove("roam-mode"),$i(),Ye.position.textContent="FREE RUN",Ye.trackName.textContent=ie.name,ni(),!0}function by(n,e,t){if(l.mode!=="race")return!1;const i=t.tangent.x,s=t.tangent.z,a=Math.max(1e-4,Math.hypot(i,s));l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(n,le(n,e)+kn,e),l.roamYaw=Math.atan2(i/a,-s/a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=ue.clamp(Math.abs(l.speed)*.6,12,70),l.grounded=!0,l.yVel=0,l.airtime=0,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.damage=ue.clamp(l.damage+10,0,100),l.cameraShake=Math.max(l.cameraShake,.8),l.message="Off the ribbon — welcome to the streets",l.messageTimer=1.8,di("land",.6,.92,.08)||Wa(30),na(new L(n,l.roamPos.y+.4,e),20),ao(!1),Ht.visible=!0,fn&&(fn.visible=!1),document.body.classList.add("roam-mode"),$i(),l.vehicle="car",un.visible=!1,Ye.position.textContent="FREE ROAM",Ye.trackName.textContent="City Streets",ni();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return xe.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),xe.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),xe.fov=69,xe.updateProjectionMatrix(),!0}function wy(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+kn,t.z+a*3.5),l.roamYaw=Math.atan2(s,-a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=ue.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),ao(!1),Ht.visible=!0,fn&&(fn.visible=!1),document.body.classList.add("roam-mode"),$i(),l.vehicle="car",un.visible=!1,Ye.position.textContent="FREE ROAM",Ye.trackName.textContent="City Streets",ni();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return xe.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),xe.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),xe.fov=69,xe.updateProjectionMatrix(),na(l.roamPos.clone().add(new L(0,.6,0)),10),!0}function Sy(){const n=Ol.set(0,0,-1).applyQuaternion(xe.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),roamView:ka,heat:+(l.heat||0).toFixed(2),police:ct.cars.length,policeNearest:ct.nearest===1/0?null:+ct.nearest.toFixed(1),roadblocks:ct.blocks.length,spikedT:+(l.spikedT||0).toFixed(2),rain:+ja().toFixed(2),job:{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1)},stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:ge.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&st?.type||null,altitude:+(l.roamPos.y-le(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Re.steer,throttle:Re.throttle,brake:Re.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var ia=document.createElement("canvas");ia.id="minimap",ia.width=256,ia.height=256;document.querySelector("#app")?.appendChild(ia);var Vh=null,Ty=0,js={cx:0,cz:-570,span:2180};function _n(n,e,t){return[((n-js.cx)/js.span+.5)*t,((e-js.cz)/js.span+.5)*t]}function Dd(){if(!js)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Ve.x0;s<=Ve.x1+1;s+=Ve.pitch){const[a,r]=_n(s,Ve.zNear,n),[o,c]=_n(s,Ve.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}for(let s=Ve.zNear;s>=Ve.zFar-1;s-=Ve.pitch){const[a,r]=_n(Ve.x0,s,n),[o,c]=_n(Ve.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Vl())if(s.courseIndex===As){const[a,r]=_n(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of oa){const[a,r]=_n(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/js.span*n),Math.max(3,s.rz/js.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Ii||[]){const[a,r]=_n(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}Vh=e}function Ey(){const n=l.mode==="roam";if((ia.style.display=n?"block":"none")&&!n||!n||!Vh||Ty++%2)return;const e=ia.width,t=ia.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(Vh,0,0,e,e);for(const a of ha)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[o,c]=_n(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<nn.length;a++){const r=nn[a],[o,c]=_n(r.x,r.z,e),h=a===l.objectiveIndex%nn.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(bl*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of Rn){const[r,o]=_n(a.x,a.z,e);t.fillRect(r-1.4,o-1.4,2.8,2.8)}if(he){const[a,r]=_n(he.pad.x,he.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),l.vehicle!=="heli"){const[o,c]=_n(he.pos.x,he.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[a,r]=_n(Xi.x,Xi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(st?.parked){const[a,r]=_n(st.parked.x,st.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of ct.cars){const[r,o]=_n(a.x,a.z,e);t.beginPath(),t.arc(r,o,3.2,0,Math.PI*2),t.fill()}for(const a of ct.blocks){const[r,o]=_n(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,o-1.4,8,2.8)}if(Ke.state==="available"&&Ke.pickup){const[a,r]=_n(Ke.pickup.x,Ke.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ke.state==="active"&&Ke.dest){const[a,r]=_n(Ke.dest.x,Ke.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=_n(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}Dd();let Li=null;function Ay(){Li||(Li=new U(new Xe(2.4,3.2,620,12,1,!0),new Ct({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:li,side:At,fog:!1})),Li.renderOrder=5,Te.add(Li));const n=l.mode==="roam"&&nn.length>0;if(Li.visible=n,!n)return;const e=nn[l.objectiveIndex%nn.length];Li.position.set(e.x,e.y+296,e.z),Li.material.opacity=.1+Math.sin(bl*3.1)*.04}let gs=null;function Id(){if(l.mode!=="roam"||nn.length===0){gs=null;return}const n=nn[l.objectiveIndex%nn.length];if(!n)return;const e=gs?.x??l.roamPos.x,t=gs?.z??l.roamPos.z,i=gs?.y??l.roamPos.y,s=l.roamPos.x-e,a=l.roamPos.z-t,r=s*s+a*a;if(gs??={x:0,y:0,z:0},gs.x=l.roamPos.x,gs.y=l.roamPos.y,gs.z=l.roamPos.z,r>4e4)return;const o=r>1e-6?ue.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*o-n.x,h=t+a*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),u=n.radius+1.2;c*c+h*h>u*u||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%nn.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,Gi(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),Cn(880,.16),setTimeout(()=>Cn(1245,.2),90),na(new L(n.x,n.y,n.z),18))}function sp(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Re.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Re.brake),s=ue.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Re.steer,-1,1)*Sf,a=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const M=l.speed<0?38:0;l.speed+=((a?70:42)*Ts().accel+M)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=ue.clamp(l.speed,-24,135*Ts().top*(l.spikedT>0?.62:1)),l.boosting=a,a?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*Ts().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n)),l.spikedT>0&&(l.spikedT-=n);const r=-l.wheelSteer*.55,o=Fd().userData.frontWheels;if(o&&(o[0].rotation.y=r,o[1].rotation.y=r),l.drivingStolen&&st)for(const M of st.mesh.userData.wheels||[])M.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=je.has("Space")&&!l.roamAir;if(c>Fh){const M=ue.clamp((c-Fh)/5,0,1),E=1-.36*ue.clamp((c-34)/85,0,1),S=WM*1.08*M*E*(h?1.85:1)*Ts().grip*(l.spikedT>0?.55:1)*(1-.26*ja());l.roamYaw+=l.wheelSteer*S*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=ue.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),u=Math.sin(d),m=-Math.cos(d),p=(l.speed-e)/Math.max(.001,n),x=ue.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-p-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(p)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const M=new L(l.roamPos.x-u*3.2,l.roamPos.y+.2,l.roamPos.z-m*3.2);ep(M,2,l.roamSlip)}const _=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(_/1.2));let f=!1,y=!1,v=Js(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let M=0;M<g;M++)l.roamPos.x+=u*l.speed*n/g,l.roamPos.z+=m*l.speed*n/g,v=Js(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+kn),Oy(l.roamPos,v)&&(y=!0),hp(l.roamPos,v)&&(f=!0),v=Js(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+kn);l.roamPos.x=ue.clamp(l.roamPos.x,-820,820),l.roamPos.z=ue.clamp(l.roamPos.z,-1620,480),f&&(l.collisionCooldown<=0&&(tp(new L(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,lo(.6)),lp(n,e),Iy(n,h,f),Uy(n,f),v=Js(l.roamPos.x,l.roamPos.z,l.roamPos.y),Fy(n,v),!(v.kind==="ramp"&&v.u>.72&&_0(v))&&(v.kind==="track"&&_0(v)||(Id(),ni(),je.has("KeyR")&&(Tl(),je.delete("KeyR"))))}const y0={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let st=null;const ap=[];function Fd(){return l.drivingStolen&&st?st.mesh:Ht}function Ud(){if(st){if(st.job){const n=st.mesh;st=null,iy(n);return}if(st.actor){const n=st.actor.collider,e=st.mesh.position;n.x=e.x,n.z=e.z}ap.push(st),st=null}}function Cy(n){Ud(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Te.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return st={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,le(n.mesh.position.x,n.mesh.position.z)+kn,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,un.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,lo(1),di("jack",.5,1,.08)||Cn(340,.18,"square",.1),ni(),!0}function Ry(n){if(Ud(),n.taken=!0,n.savedM=new Tt,yn.im){const t=new Tt().makeScale(1e-4,1e-4,1e-4);yn.im.getMatrixAt(n.idx,n.savedM),yn.im.setMatrixAt(n.idx,t),yn.imW.setMatrixAt(n.idx,t),yn.im.instanceMatrix.needsUpdate=!0,yn.imW.instanceMatrix.needsUpdate=!0}const e=so("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Te.add(e),st={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,le(n.x,n.z)+kn,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,un.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,lo(.7),di("jack",.45,1.05,.08)||Cn(300,.16,"square",.09),ni(),!0}function Py(){st.mesh.visible=!0,st.parked=l.roamPos.clone(),st.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,un.visible=!0,!0}function b0(){return!st?.parked||l.roamPos.distanceTo(st.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(st.parked),l.roamYaw=st.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,st.parked=null,un.visible=!1,ni(),!0)}function rp(){for(const n of Rn){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return Cy(e)}for(const n of yn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return Ry(n);return!1}function w0(n){if(n.actor)n.actor.stolen=!1;else{Ds(n.mesh);const e=n.spotRef;e?.savedM&&yn.im&&(yn.im.setMatrixAt(e.idx,e.savedM),yn.imW.setMatrixAt(e.idx,e.savedM),yn.im.instanceMatrix.needsUpdate=!0,yn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function Gl(){st&&(w0(st),st=null),ap.splice(0).forEach(w0),l.drivingStolen=!1}function Gh(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&st)return l.roamAir=!1,l.roamVy=0,Py(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;Xi.copy(l.roamPos),kh=l.roamYaw,Ht.visible=!0,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,un.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function Hh(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Xi)>7?!1:(l.vehicle="car",l.roamPos.copy(Xi),l.roamYaw=kh,l.camYaw=kh,l.speed=0,un.visible=!1,ni(),!0)}function op(){return l.vehicle!=="foot"||!he||l.roamPos.distanceTo(he.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(he.pos),l.roamYaw=he.yaw,l.camYaw=he.yaw,l.speed=0,he.vel.set(0,0,0),un.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function Wh(){if(l.vehicle!=="heli"||!he)return!1;const n=le(he.pos.x,he.pos.z);return he.pos.y-n>5.2||he.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",he.mesh.visible=!0,l.roamPos.x=he.pos.x+Math.cos(he.yaw)*-5.6,l.roamPos.z=he.pos.z+Math.sin(he.yaw)*-5.6,l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,un.visible=!0,!0)}function zd(){l.mode==="roam"&&(l.vehicle==="car"?Gh()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(Xi)<=(st?.parked?l.roamPos.distanceTo(st.parked):1/0)?Hh()||b0():b0()||Hh())||op()||ty()||rp():Wh())}function Ly(n){const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Re.throttle),t=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Re.brake),i=ue.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Re.steer,-1,1),s=je.has("ShiftLeft")||je.has("ShiftRight"),a=l.speed,r=(e-t)*(s?14.5:6.4);l.speed+=(r-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,hp(l.roamPos,{kind:"ground"}),l.roamPos.x=ue.clamp(l.roamPos.x,-820,820),l.roamPos.z=ue.clamp(l.roamPos.z,-1620,480),l.roamPos.y=le(l.roamPos.x,l.roamPos.z)+.05,lp(n,a),Id(),un.position.copy(l.roamPos),un.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*ue.clamp(Math.abs(l.speed)/5,0,1);for(const m of un.userData.limbs||[])m.mesh.rotation.x=h*m.amp*m.side*2.2,m.mesh.position.y=m.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Xi)<7,u=he&&l.roamPos.distanceTo(he.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):u&&(l.message="E — enter helicopter",l.messageTimer=.2))}function Dy(n){if(!he)return;const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Re.throttle)-Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Re.brake),t=ue.clamp((je.has("KeyA")||je.has("ArrowLeft")?1:0)-(je.has("KeyD")||je.has("ArrowRight")?1:0)-Re.steer,-1,1),i=he.rpm>.55,s=je.has("ShiftLeft")||je.has("ShiftRight"),a=ca?s?1:he.pos.y-le(he.pos.x,he.pos.z)>6?-.45:0:je.has("Space")?1:s?-1:0;he.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(he.yaw),o=-Math.cos(he.yaw);i&&(he.vel.x+=r*e*30*n,he.vel.z+=o*e*30*n,he.vel.y+=a*24*n,a===0&&(he.vel.y-=he.vel.y*1.6*n)),he.vel.x-=he.vel.x*.85*n,he.vel.z-=he.vel.z*.85*n,he.vel.y-=he.vel.y*1.1*n,he.pos.addScaledVector(he.vel,n);const c=le(he.pos.x,he.pos.z);he.pos.x=ue.clamp(he.pos.x,-1500,1500),he.pos.z=ue.clamp(he.pos.z,-1900,700),he.pos.y=Math.min(he.pos.y,300),he.pos.y<c+1.1&&(he.pos.y=c+1.1,he.vel.y=Math.max(0,he.vel.y)),(Fr(he.pos,pn)||Fr(he.pos,_i))&&(he.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=he.pos.x,l.roamPos.y=he.pos.y,l.roamPos.z=he.pos.z,l.roamYaw=he.yaw,l.speed=Math.hypot(he.vel.x,he.vel.z),he.mesh.position.copy(he.pos),he.mesh.quaternion.setFromAxisAngle(on,-he.yaw),he.mesh.rotateX(ue.clamp((he.vel.x*r+he.vel.z*o)*.008,-.24,.24)),he.mesh.rotateZ(ue.clamp(t*.14,-.2,.2)),Id()}function Iy(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),a=Math.round(l.driftAcc*s);l.score+=a,Gi(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),Cn(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function Fy(n,e){const t=e.y+kn,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=Of),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,di("whoosh",.38,1.2,.08))):(l.roamVy=ue.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const a=l.stuntRamp?.hoop;a&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-a.x,l.roamPos.y-a.y,l.roamPos.z-a.z)<a.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,Cn(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),di("land",Math.min(.62,s/42),1,.1)||Wa(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const a=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),r=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+a*140;r&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,ge.stunts=(ge.stunts||0)+1,Gi(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),Cn(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const a=Math.round(40+l.roamAirT*70);l.score+=a,Gi(`+${a} AIR`),Cn(760,.14)}}}l.roamPrevY=l.roamPos.y}const Un=2.6;function lp(n,e){const t=l.waterDepth||0;if(l.roamPos.y>le(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=ta(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(oy(l.roamPos.clone(),Math.abs(e)),my(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,$f(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function Uy(n,e){for(const t of Rn)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of Rn){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,a=l.roamPos.z-t.z,r=(t.hw+t.hd)*.5+Un+2.4;if(s*s+a*a<r*r&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,Gi("+45 NEAR MISS"),Cn(520,.12,"square",.07);break}}}function Fr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+kn+.45)continue;if(s.radius){const u=s.radius+Un,m=n.x-s.x,p=n.z-s.z,x=m*m+p*p;if(x>=u*u)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(x));n.x=s.x+m/_*u,n.z=s.z+p/_*u;continue}const a=s.hw+Un,r=s.hd+Un,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(o),d=r-Math.abs(c);h<d?n.x=s.x+(o<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function cp(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Ve.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=ue.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(ge.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function zy(n){let e=!1;for(let t=0;t<Rn.length;t++){const i=Rn[t];if(i.maxY!=null&&n.y>i.maxY+kn+.45)continue;const s=i.hw+Un,a=i.hd+Un,r=n.x-i.x,o=n.z-i.z;if(Math.abs(r)>=s||Math.abs(o)>=a)continue;e=!0,cp(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(o);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(o<0?-a:a)}return e}function Ny(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+kn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function ky(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,ge.splats++,py();const e=Ga.find(t=>!t.visible)||Ga[ge.splats%Math.max(1,Ga.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,le(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function Oy(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of Cs){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=Un+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(le(i.x,i.z)+kn))>3.2||(ky(i),t=!0)}return t}function hp(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=Fr(n,pn),a=e?.kind==="ground"?Fr(n,ri):!1,r=Fr(n,_i),o=e?.kind==="ground"?zy(n):!1;if(!s&&!a&&!r&&!o)break;t=!0}return t}function dp(n){const e=Re.lookX*1.18,t=Re.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Re.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function Nd(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=ue.lerp(n.x,e.x,a),o=ue.lerp(n.z,e.z,a),c=ue.lerp(n.y,e.y,a),h=le(r,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function By(n,e){const t=le(n,e);let i=null;const s=np(n,e);s&&s.y>t+4&&(i=s);const a=ip(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function El(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=ue.lerp(n.x,e.x,a),o=ue.lerp(n.z,e.z,a),c=ue.lerp(n.y,e.y,a),h=By(r,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function Xh(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=ue.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};xe.position.y+=Nd(a,xe.position,3.4),xe.position.y+=El(a,xe.position,4.2)}let ka=localStorage.getItem("steel-ribbon-roam-view")==="hood"?"hood":"chase";function Vy(){ka=ka==="chase"?"hood":"chase",localStorage.setItem("steel-ribbon-roam-view",ka),l.message=ka==="hood"?"First person":"Third person",l.messageTimer=.9}function up(){return l.vehicle==="heli"&&he?he.mesh:Fd()}function Gy(n){const e=up(),t=l.roamYaw+l.camLookYaw*.8,i=Math.sin(t),s=-Math.cos(t),a=l.vehicle==="heli",r=a?2.6:1.42,o=a?1.2:.85;if(e.visible=!1,xe.position.set(l.roamPos.x+i*o,l.roamPos.y+r-l.roamSuspension*.4,l.roamPos.z+s*o),l.cameraShake>.01){const h=l.cameraShake*.5;xe.position.x+=(Math.random()-.5)*h,xe.position.y+=(Math.random()-.5)*h*.6}cn.position.copy(xe.position),cn.lookAt(l.roamPos.x+i*30,l.roamPos.y+r+l.camLookPitch*16+(l.roamAir?l.roamVy*.06:0),l.roamPos.z+s*30),cn.rotateY(Math.PI),cn.rotateZ((l.roamAir&&l.stuntActive&&l.airRoll||0)-l.wheelSteer*.05),xe.quaternion.slerp(cn.quaternion,1-Math.pow(.001,n));const c=76+Math.min(14,Math.abs(l.speed)*.08);Math.abs(xe.fov-c)>.02&&(xe.fov+=(c-xe.fov)*(1-Math.pow(.01,n)),xe.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function fp(n){if(window.__freeCam)return;if(dp(n),Math.abs(l.speed)>Fh){let _=l.roamYaw-l.camYaw;_=Math.atan2(Math.sin(_),Math.cos(_)),l.camYaw+=_*(1-Math.pow(.08,n))}if(ka==="hood"&&l.vehicle!=="foot"){Gy(n);return}const e=up();e.visible||(e.visible=!0);const t=l.camYaw+l.camLookYaw,i=Math.sin(t),s=-Math.cos(t),a=l.roamPos,r=ue.clamp(l.cameraZoom,-.42,.9),o=ue.clamp(Math.abs(l.speed)/135,0,1),c=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},h=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*c.d,d=(7.2+o*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*c.h,u=Sd.set(a.x-i*h,a.y+d,a.z-s*h);if(l.cameraShake>.01||l.collisionDrama>.01){const _=l.cameraShake+l.collisionDrama*.42;u.x+=(Math.random()-.5)*_*1.2,u.y+=(Math.random()-.5)*_*.75,u.z+=(Math.random()-.5)*_*1.2}const m=Ol.set(a.x+i*(13+o*8-Math.min(r,0)*6),a.y+2.45+l.camLookPitch*13.5,a.z+s*(13+o*8-Math.min(r,0)*6));u.y=Math.max(u.y,le(u.x,u.z)+3.5),u.y+=Nd(m,u,3.4),u.y+=El(m,u,4.2);const p=l.roamSlip>.35?.006:.0026;xe.position.lerp(u,1-Math.pow(p,n)),xe.position.y+=El(m,xe.position,3.8)*.72,cn.position.copy(xe.position),cn.lookAt(m),cn.rotateY(Math.PI),cn.rotateZ(-l.wheelSteer*o*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),xe.quaternion.slerp(cn.quaternion,1-Math.pow(.05,n));const x=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(xe.fov-x)>.02&&(xe.fov+=(x-xe.fov)*(1-Math.pow(.01,n)),xe.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function Hy(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Ye.best.textContent=`Best score ${l.best}`,Ye.resultText.textContent=`${n} Score ${t}. Time ${Al(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?Al(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&$t?.active&&e){[{key:"you",metric:l.totalDistance+.001},...Zn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>$t.points[c.key]+=k_[h]??0),$t.raceIndex++;const r=$t.raceIndex>=4,o=kf();if(r){$t.active=!1;const c=o[0].key==="you";c&&$t.division>1?(localStorage.setItem("steel-ribbon-division",String($t.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Nf($t.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}zf(),s=`<span>Season — after race ${$t.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,Ye.againBtn.textContent=$t.active?"Next Race":"Back to Menu"}else Ye.againBtn.textContent="Race Again";Ye.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,Wl(),Number.isFinite(l.bestLap)&&l.bestLap>3&&Rp("lap",Math.round(1e6/l.bestLap),{time:+l.bestLap.toFixed(2),course:ie.name,car:Ls[Wi]?.label||""}),Ye.result.classList.remove("hidden")}function Nc(n="Craned back to the ribbon"){const e=_t(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function kd(n,e){return ue.clamp(e*n.tangent.y,-48,48)}function Wy(n=94){return ie.gaps.map(e=>{const t=_t(e.start),i=_t(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=kd(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(ue.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-o)*10)/10}})}function S0(n,e){l.grounded=!1,l.yVel=kd(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return kd(_t(n),e)},gapJumpReport(n){return Wy(n)},sceneryClearanceReport(){return a_()},setSpeed(n){return l.speed=ue.clamp(n,-14,156-l.damage*.42),Ur(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=_t(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=ue.clamp(t,-ie.width*.48,ie.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=ue.clamp(e,-14,156-l.damage*.42),Ur(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=ue.clamp(n,0,99),Ur(),l.damage},setCourse(n){return oo(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,xe.position.set(n,e,t),xe.lookAt(i,s,a),xe.fov=62,xe.updateProjectionMatrix(),"freecam"},listBoostPads(){return Ha.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return oa.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+ta(n,e).depth.toFixed(3),ground:+le(n,e).toFixed(2)}},activeGate(){const n=nn[l.objectiveIndex%nn.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:$t,division:ro(),position:Od(),seasonRace:!!l.seasonRace,rivals:Zn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),$t=null,Wl(),"reset"},renderInfo(){return{calls:ge.renderCalls||0,triangles:ge.renderTris||0,geometries:ln.info.memory.geometries,textures:ln.info.memory.textures,mobilePerf:ca,staticMerge:ge.staticMerge||null}},drawAudit(n=20){const e=new Map;return Te.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=Rn[0]?.actor?.mesh;return{colliders:Rn.length,wheels:n?.userData?.wheels?.length??0,pedestrians:ge.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of Rn){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Pe?{state:Pe.ctx.state,master:+Pe.master.gain.value.toFixed(2),engine:!!Pe.rumble&&!!Pe.growl&&!!Pe.whine,fx:!!Pe.wind&&!!Pe.skid&&!!Pe.boost,music:!!Pe.musicGain,beat:Pe.beat,samples:Object.keys(Qn.buffers).length,sampleLoops:Object.keys(Qn.loops),musicSample:!!Qn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:jf(),engineV2:!!Pe.growlB&&!!Pe.burble}:null},colliderAudit(){const n=[],e=[],t=Ve.streetW*.5;for(let a=Ve.x0;a<=Ve.x1+1;a+=Ve.pitch)n.push(Math.round(a));for(let a=Ve.zNear;a>=Ve.zFar-1;a-=Ve.pitch)e.push(Math.round(a));const i=[],s=(a,r,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=le(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const u of n)Math.abs(o.x-u)<t+c+Un&&o.z<Ve.zNear+h&&o.z>Ve.zFar-h&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${u}`,overlap:+(t+c+Un-Math.abs(o.x-u)).toFixed(1)});for(const u of e)Math.abs(o.z-u)<t+h+Un&&o.x<Ve.x1+c&&o.x>Ve.x0-c&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${u}`,overlap:+(t+h+Un-Math.abs(o.z-u)).toFixed(1)})}};return pn.forEach((a,r)=>s("Mn",r,a)),_i.forEach((a,r)=>s("Di",r,a)),ri.forEach((a,r)=>s("$n",r,a)),{total:pn.length+_i.length+ri.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&Tl(),n==="foot"?l.vehicle==="car"?Gh(!0):l.vehicle==="heli"&&Wh():n==="heli"&&he?(l.vehicle==="car"&&Gh(!0),l.roamPos.set(he.pos.x+3,le(he.pos.x+3,he.pos.z),he.pos.z),op()):n==="car"&&(l.vehicle==="heli"&&(he.pos.y=le(he.pos.x,he.pos.z)+1.1,he.vel.set(0,0,0),Wh()),l.vehicle==="foot"&&(l.roamPos.copy(Xi),Hh())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:un.visible,heli:he?{x:+he.pos.x.toFixed(1),y:+he.pos.y.toFixed(1),z:+he.pos.z.toFixed(1),rpm:+he.rpm.toFixed(2),scale:+he.mesh.scale.x.toFixed(2),pad:he.pad?{x:+he.pad.x.toFixed(1),z:+he.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Xi.x.toFixed(1),z:+Xi.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:st?{type:st.type,fromTraffic:!!st.actor,pos:{x:+st.mesh.position.x.toFixed(1),y:+st.mesh.position.y.toFixed(2),z:+st.mesh.position.z.toFixed(1)},visible:st.mesh.visible,inScene:st.mesh.parent===Te,parked:st.parked?{x:+st.parked.x.toFixed(1),z:+st.parked.z.toFixed(1)}:null}:null,parkedSpots:yn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?rp():!1},setHeat(n){return l.mode==="roam"&&(l.heat=ue.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:ct.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:ct.nearest===1/0?null:+ct.nearest.toFixed(1),evadeT:+ct.evadeT.toFixed(1),bustT:+ct.bustT.toFixed(2),blocks:ct.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:ge.busts||0}},policeTeleportNearest(n,e){const t=ct.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1),pickup:Ke.pickup?{x:+Ke.pickup.x.toFixed(1),z:+Ke.pickup.z.toFixed(1)}:null,dest:Ke.dest?{x:+Ke.dest.x.toFixed(1),z:+Ke.dest.z.toFixed(1)}:null,deliveries:ge.deliveries||0,fails:ge.deliveryFails||0}},jobSpawnNow(){return Ke.state==="idle"&&(Ke.cooldown=0,Yf()),Ke.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==hi&&(Gd(),localStorage.setItem("steel-ribbon-weather",hi)),hi},weatherInfo(){return{mode:hi,amt:+ja().toFixed(2),roadRoughness:+(vn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of Rn)e.actor?.panicT>0&&n++;return n},mpInfo(){return{connected:bt.connected,room:bt.room,id:bt.id,peers:[...bt.peers.values()].map(n=>({name:n.name,has:n.has,x:+(n.tx||0).toFixed(1),z:+(n.tz||0).toFixed(1)}))}},mpJoin(n,e){const t=document.querySelector("#mpRoom"),i=document.querySelector("#mpName");return t&&(t.value=n),i&&(i.value=e),Ip(),bt.room},mpLeave(){return Ll(!0),!bt.connected},boardsInfo(){return Cp(no).then(n=>({mode:no,rows:n?n.length:null,ok:n!==null}))},gamepadInfo(){return{active:Wn.active}},setTod(n){return Nr.includes(n)&&(Yn=n,localStorage.setItem("steel-ribbon-tod",n),Hd()),Yn},todInfo(){return{mode:Yn,day:+cl.toFixed(3),night:+hl.toFixed(3)}},listStuntRamps(){return(Ii||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of yn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&Tl(),l.roamPos.set(n,le(n,e)+kn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,ni(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...Ss,boostPads:Ha.length,gapBeacons:$r.length,railRuns:ge.railRuns||0,railPosts:ge.railPosts||0,ponds:oa.length,cityPonds:ge.ponds||0,cloudSprites:ge.cloudSprites||0,helipad:ge.helipad||null,stuntRamps:ge.stuntRamps||0,propPlanes:ge.propPlanes||0}},stats(){return{trafficCrashes:ge.trafficCrashes,splats:ge.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},detailReport(){return{plates:Ui.mesh?{atlasSlots:64,traffic:Ui.dynamics.length,parked:Ui.statics.length,uniqueTexts:new Set(Ui.texts).size,sample:Ui.texts.slice(0,5)}:null,drivers:{cars:Ua.length,withDriver:Ua.reduce((n,e)=>n+(e.mesh?.userData?.hasDriver?1:0),0)},taxis:{count:Ua.reduce((n,e)=>n+(e.type==="taxi"?1:0),0),signed:Nh.count()},storefronts:{spots:Ks.spots.length,dressed:Ks.dressedCount(),pool:Ks.pool,sample:Ks.spots.slice(0,2).map(n=>({x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),w:+n.w.toFixed(1)}))},furniture:{...Pi.counts,sample:Pi.sample.slice(0,4)},streetSigns:{poles:ai.poles,blades:ai.blades,sample:ai.sample.slice(0,3)},pedSignals:{count:$s.count,walking:ge.pedWalkFaces??0,sample:$s.sample.slice(0,2)},crowd:{stands:Ys.stands.length,promoted:Ys.active>=0?1:0,figures:Ys.active>=0?Ys.figures:0,sample:Ys.stands.slice(0,2).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),gy:+n.gy.toFixed(1),w:+n.w.toFixed(0)}))},peds:{pool:za.pool,promoted:za.promotedCount(),texting:(za.kits||[]).reduce((n,e)=>n+(e.ped&&e.texting?1:0),0),radius:zh,sample:(za.kits||[]).filter(n=>n.ped).slice(0,3).map(n=>{const e={x:+n.ped.x.toFixed(1),y:+n.ped.mesh.position.y.toFixed(2),z:+n.ped.z.toFixed(1),axis:n.ped.axis,dir:n.ped.dir,t:n.texting?1:0};if(n.texting){const t=n.phone.getWorldPosition(new L);e.phone={x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)}}return e})}}},viewInfo(){const n=_t(l.s),e=l.y-2.1;return{trackView:wi,mode:l.mode,carVisible:Ht.visible,cockpitVisible:!!(fn&&fn.visible),camY:+xe.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!ki,overheadY:+qh(xe.position.x,xe.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return wi=n==="cockpit"?"cockpit":"chase",$i(),wi},listCourses(){return ra.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:As,name:ie.name,length:ie.length,width:ie.width,laps:ie.laps}},probeDown(n,e){const t=new qx(new L(n,400,e),new L(0,-1,0),0,1e3);t.camera=xe;const i=t.intersectObjects(Te.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=Js(n,e,400);return{x:n,z:e,ground:+le(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return ha.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],o=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return pn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return ri.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=ri.filter(e=>e.hw);return{supports:Uh,pylonColliders:n.length,gaps:ie.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of pn){const i=Hs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:pn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of pn){const i=In(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:pn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return _i.concat(ri.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:ge.traffic,pedestrians:ge.pedestrians,pedestriansActive:Cs.filter(e=>e.active).length,turns:ge.turns,splats:ge.splats,trafficCrashes:ge.trafficCrashes,streetLights:ge.streetLights,trafficLights:ge.trafficLights,stopSigns:ge.stopSigns,signs:ge.signs,roadDetails:{...ge.roadDetails},buildingArchetypes:{...ge.buildingArchetypes},zones:{...ge.zones},openerProps:ge.openerProps,signSamples:wl.slice(0,n),types:{...ge.types},offRoadTraffic:Rn.filter(e=>!Bl(e.x,e.z,2)).length,trafficRoutes:Ua.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Rn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Cs.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...ge.roadDetails},e={...ge.buildingArchetypes},t={...ge.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,ge.signs/7)+Math.min(14,ge.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:ge.openerProps,signs:ge.signs,streetLights:ge.streetLights,streetGlowSprites:Ss.streetGlowSprites,waterBlockers:Ss.waterBlockers,lowFogDisks:Ss.lowFogDisks}},objectiveReport(){const n=nn[l.objectiveIndex%Math.max(1,nn.length)];return{total:nn.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:nn.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:Dr.filter(n=>n.life>0).length,debrisActive:Ir.filter(n=>n.life>0).length,sparksActive:Lr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Ht.userData.detailReport},racer:{...z_.userData.detailReport},namedParts:Ht.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Lf(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=_t(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=le(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,r+kn,s),l.roamYaw=a,l.camYaw=a,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Re.lookX=0,Re.lookY=0,Re.zoom=0,l.wheelSteer=0,l.speed=0,ni();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return xe.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),Xh(),xe.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),xe.fov=69,xe.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Js(n,e,l.roamPos.y);l.roamPos.set(n,i.y+kn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,ni();const s=Math.sin(l.roamYaw),a=-Math.cos(l.roamYaw);return xe.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-a*17),Xh(),xe.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+a*13),xe.fov=69,xe.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Re.zoom,i=30){Re.lookX=ue.clamp(n,-1,1),Re.lookY=ue.clamp(e,-1,1),Re.zoom=ue.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?fp(1/60):Bd(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Re.steer,throttle:Re.throttle,brake:Re.brake};Re.steer=ue.clamp(e,-1,1),Re.throttle=ue.clamp(t,0,1),Re.brake=ue.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const o=Math.min(a,r);if(sp(o),l.mode!=="roam")break;r-=o}return Re.steer=s.steer,Re.throttle=s.throttle,Re.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(pp(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=Sd.set(0,0,-1).applyQuaternion(Ht.quaternion).normalize(),t=Ol.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=Js(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+le(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+xe.position.x.toFixed(2),camY:+xe.position.y.toFixed(2),camZ:+xe.position.z.toFixed(2),fov:+xe.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+Nd({x:n.x,y:n.y+2.6,z:n.z},{x:xe.position.x,y:xe.position.y,z:xe.position.z},2.4).toFixed(3),elevatedCameraLift:+El({x:n.x,y:n.y+2.6,z:n.z},{x:xe.position.x,y:xe.position.y,z:xe.position.z},3.8).toFixed(3),colliders:pn.length+ri.length+_i.length+Rn.length,insideBuilding:pn.concat(ri,_i,Rn).some(s=>Ny(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Ht.userData.frontWheels?+Ht.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function pp(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Re.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Re.brake),s=ue.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Re.steer,-1,1)*Sf,a=t>.03&&!e,r=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&a&&l.grounded,o=_t(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(a){const v=l.speed<0?40:0;l.speed+=((r?68:40)*Ts().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=ue.clamp(l.speed,-16,156*Ts().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=r,r?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*Ts().boostRegen);const u=je.has("Space")&&l.grounded,m=(16+h*.13)*(u?1.45:1)*Ts().grip;l.lateralVel-=s*m*n,l.lateralVel-=l.lateralVel*(l.grounded?u?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const p=Hi(l.s),x=Math.abs(l.lateral)<ie.width*.52,_=!p&&x;if(l.grounded&&(!_||Math.abs(l.lateral)>ie.width*.5)&&S0(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=ue.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>ie.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&na(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*ie.width*.55).addScaledVector(on,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=_t(l.s),M=v.p.y+2.1;if(!Hi(l.s)&&Math.abs(l.lateral)<ie.width*.55&&l.y<=M&&l.yVel<0){const E=-l.yVel,S=Math.abs(l.lateral)<ie.width*.34&&E<30,C=Math.round(S?260+l.airtime*85:Math.max(30,120-E));l.y=M,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-ie.width*.36)*1.8,l.score+=C,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=S?"Clean landing":"Hard landing",l.messageTimer=.9,S?l.cleanLandings+=1:l.hardLandings+=1,Gi(`+${C} ${S?"CLEAN AIR":"LANDED"}`,S),S&&Cn(990,.14),Wa(E),na(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(on,.7),S?7:24),l.airtime=0}if(l.practice||l.freeRun){if(!l.grounded&&l.yVel<-6){const E=_t(l.s),S=E.p.x+E.side.x*l.lateral,C=E.p.z+E.side.z*l.lateral,A=le(S,C);l.y<=A+1.3&&by(S,C,E)}l.y<-55&&(l.damage+=28,Nc("Track crew recovery"))}else l.y<-55&&(l.damage+=28,Nc("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%ie.length+ie.length)%ie.length,Ky();const f=ha.find(v=>v.rampType==="off");if(l.freeRun&&f&&Rc(g,l.totalDistance,f.exitS)&&l.lateral*f.dirSel>ie.width*.2&&wy(f))return;const y=Math.floor(l.totalDistance/ie.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;Zy(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,Gi("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=ie.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>ie.laps&&(()=>{const M=Od();Hy(M===1?"You took the chequered gantry.":`You finished P${M}.`,M)})()}for(const v of ie.gaps)Rc(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&S0(_t(v.start),v.name));if(l.grounded){for(const v of Ha)if(Rc(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const M=_t(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,Gi("+90 BOOST"),Cn(640,.22,"sawtooth",.1),na(M.p.clone().addScaledVector(M.side,v.lat).addScaledVector(on,1),10),Wa(14);break}}l.damage=ue.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),Wa(40),l.damage=90),je.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),Nc("Manual reset"),je.delete("KeyR"))}function T0(n){const e=ie.length*ie.laps,t=1+.07*(4-ro());for(const i of Zn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=ue.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let u=i.base+d+h;i.key==="bishop"&&(u+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(u+=10*ue.clamp(i.distance/Math.max(1,e),0,1)),i.speed=ue.clamp(u*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%ie.length+ie.length)%ie.length;const s=_t(i.s),a=Math.abs(i.distance-l.totalDistance);let r=i.lane*ie.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(l.lateral>=0?-1:1)*ie.width*(.22+Math.abs(i.lane)*.4);r=ue.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(on,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new Tt().makeBasis(s.side,on,s.tangent));const o=a<26&&wi==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...Zn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%ie.length+ie.length)%ie.length}function Od(){return l.practice?1:1+Zn.filter(n=>n.distance>l.totalDistance).length}function Xy(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),xe.position.copy(i);const a=Math.abs(l.speed),r=68+Math.min(10,a*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(xe.fov-r)>.02&&(xe.fov+=(r-xe.fov)*(1-Math.pow(.004,n)),xe.updateProjectionMatrix());const o=_t(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,a/680),cn.position.copy(xe.position),cn.lookAt(c),cn.rotateY(Math.PI),cn.rotateY(-l.camLookYaw),cn.rotateZ(-e.bank*.72-l.lateralVel*.006),cn.rotateX(e.grade*.18+(l.grounded?0:ue.clamp(l.yVel,-30,30)*-.006)),xe.quaternion.slerp(cn.quaternion,1-Math.pow(8e-4,n))}function qh(n,e,t,i){let s=1/0;const a=ie.width*.5+2.2;for(const r of Vl()){if(r.courseIndex!==As||r.y<t||r.y>i||r.y>=s)continue;const o=n-r.x,c=e-r.z;o*o+c*c<a*a&&(s=r.y)}return s}function qy(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+ue.clamp(l.cameraZoom,-.42,.9)*8,a=4.6+t*.014+l.camLookPitch*10,r=_t(l.s-s),o=qh(r.p.x,r.p.z,i+5,i+64);o-1.5<r.p.y+2&&(s=6.4,a=2.7,r=_t(l.s-s),o=qh(r.p.x,r.p.z,i+5,i+64));let c=ue.lerp(r.p.y,i,.62)+a;const h=wd.set(r.p.x+r.side.x*l.lateral*.72,0,r.p.z+r.side.z*l.lateral*.72);if(c=Math.max(c,r.p.y+2.35,le(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const p=l.cameraShake;h.x+=(Math.random()-.5)*p*1.1,h.y+=(Math.random()-.5)*p*.6,h.z+=(Math.random()-.5)*p*1.1}xe.position.distanceTo(h)>70&&xe.position.copy(h),xe.position.lerp(h,1-Math.pow(2e-4,n)),xe.position.y=Math.max(xe.position.y,r.p.y+2.05),o<1/0&&(xe.position.y=Math.min(xe.position.y,o-1.4));const d=_t(l.s+17+t*.09),u=d.p.clone().addScaledVector(d.side,l.lateral*.55);u.y+=2.1+l.camLookPitch*12,l.grounded||(u.y=ue.lerp(u.y,l.y+1.2,.5)),cn.position.copy(xe.position),cn.lookAt(u),cn.rotateY(Math.PI),cn.rotateY(-l.camLookYaw),cn.rotateZ(-e.bank*.42-l.lateralVel*.0034),xe.quaternion.slerp(cn.quaternion,1-Math.pow(4e-4,n));const m=66+Math.min(11,t*.055)+(l.boosting?5:0)+ue.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(xe.fov-m)>.02&&(xe.fov+=(m-xe.fov)*(1-Math.pow(.004,n)),xe.updateProjectionMatrix())}let yi=null,ki=null,ns=0;function Yy(){try{ki=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+As)||"null")}catch{ki=null}ns=0}function $y(){yi&&Na(yi),yi=Ls[Wi].build(),yi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),yi.visible=!1}function Zy(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||ki&&n>=ki.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);ki={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+As,JSON.stringify(ki))}catch{}l.message=`Ghost saved — ${Al(n)}`,l.messageTimer=1.3,ns=0}function Ky(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function Jy(){if(!yi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&ki?.samples?.length>2&&!window.__freeCam;if(yi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,ki.time),t=ki.samples;for(e<(t[ns]?.[0]??0)&&(ns=0);ns<t.length-2&&t[ns+1][0]<e;)ns++;const i=t[ns],s=t[Math.min(ns+1,t.length-1)],a=ue.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=ue.lerp(i[1],s[1],Math.abs(s[1]-i[1])>ie.length*.5?0:a),o=ue.lerp(i[2],s[2],a),c=ue.lerp(i[3],s[3],a),h=_t((r%ie.length+ie.length)%ie.length);yi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),yi.quaternion.setFromRotationMatrix(new Tt().makeBasis(h.side,on,h.tangent))}function jy(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&wi==="chase"&&!window.__freeCam;if(fn&&(fn.visible=!e),Ht.visible!==e&&(Ht.visible=e),!e)return;const t=_t(l.s);Ht.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new Tt().makeBasis(t.side,on,t.tangent);Ht.quaternion.setFromRotationMatrix(i),l.grounded?(Ht.rotateX(-t.grade*.5),Ht.rotateZ(t.bank*.6+ue.clamp(l.lateralVel*.012,-.16,.16))):Ht.rotateX(ue.clamp(-l.yVel*.011,-.34,.4));const s=Ht.userData.frontWheels,a=ue.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let el=.6;function Qy(n){if(window.__freeCam)return;el+=n*.13;const e=80,t=300,i=le(e,t);Ht.visible=!0,fn&&(fn.visible=!1),Ht.position.set(e,i+.85,t),Ht.quaternion.setFromAxisAngle(on,Math.PI*.24);const s=16.5;xe.position.set(e+Math.cos(el)*s,i+5.3+Math.sin(el*.57)*1.1,t+Math.sin(el)*s),xe.lookAt(e,i+1.5,t),xe.rotateY(.3),Math.abs(xe.fov-58)>.1&&(xe.fov=58,xe.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function Bd(n){if(window.__freeCam)return;dp(n);const e=_t(l.s);wi==="chase"&&l.mode!=="menu"?qy(n,e):Xy(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=Ol.set(0,0,-1).applyQuaternion(xe.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Re.steer,throttle:Re.throttle,brake:Re.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const Qs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},yr=[28,54,82,110,134,156];function eb(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<yr.length;o++)n>yr[o]&&(e=o+2);e=Math.min(e,yr.length);const t=e===1?0:yr[e-2],i=yr[e-1],s=i>t?ue.clamp((n-t)/(i-t),0,1):0,a=e===1?Qs.idle:Qs.postShift;let r=a+s*(Qs.shift-a);return n<.4&&(r=Qs.idle),{gear:e,rpm:r}}let E0=performance.now(),kc=0,Oc=0;function mp(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function tb(n,e){const t=Ye.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=mp(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const _=x/h,g=o(_),f=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=f?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(f?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),f){const M=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),M[0],M[1])}}const d=ue.clamp(n/h,0,1),u=o(d),m=c(u,r-r*.06),p=c(u+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(p[0],p[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function nb(n,e){const t=Ye.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=mp(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke();const d=ue.clamp(n,0,1),u=n<.25;i.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let _=0;_<=h;_+=3){const g=_/h,f=o(g),y=_%6===0;i.strokeStyle=_>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(f,r-r*.02),M=c(f,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(M[0],M[1]),i.stroke(),y){const E=c(f,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(_),E[0],E[1])}}const m=o(d),p=c(m,r-r*.06),x=c(m+Math.PI,r*.14);i.strokeStyle=u?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function ib(n,e){const t=Ye.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const o=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=Qs.max,u=v=>Math.PI-v*Math.PI,m=(v,M)=>[o+Math.cos(v)*M,c-Math.sin(v)*M];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,u(1),u(0)),i.stroke();const p=Qs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,u(1),u(p)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const M=v/9,E=u(M),S=v*1e3>=Qs.redline;i.strokeStyle=S?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const C=m(E,h-h*.02),A=m(E,h-h*.18);i.beginPath(),i.moveTo(C[0],C[1]),i.lineTo(A[0],A[1]),i.stroke();const w=m(E,h-h*.34);if(i.fillStyle=S?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const b=u((v+.5)/9),P=m(b,h-h*.02),D=m(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(P[0],P[1]),i.lineTo(D[0],D[1]),i.stroke()}}const x=ue.clamp(n/d,0,1),_=u(x),g=m(_,h-h*.06),f=m(_+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(f[0],f[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function Ur(){ie.length*ie.laps;const n=r0(l.practice?l.totalDistance%ie.length:l.totalDistance),e=l.practice?"SOLO":`P${Od()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),Ye.damage.style.width=`${Math.round(l.damage)}%`,Ye.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,ie.laps)}/${ie.laps}`,Ye.timer.textContent=Al(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";Ye.score.textContent=t?`Gates ${l.objectiveHits}/${nn.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(Ye.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&st?`${st.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${ro()}`,t&&nn.length){const d=nn[l.objectiveIndex%nn.length];Ye.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(Ye.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),t&&Ke.state==="active"&&(Ye.trackName.textContent=`Deliver the ${Ke.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ke.timeLeft))}s`),Ye.hud.style.display=s?"flex":"none",Ye.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",Ye.touchControls.style.display=s?"":"none",Ye.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of Zn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:r0(d.distance))*100)}%`);const a=eb();l.gear=a.gear;const r=performance.now(),o=Math.min(.05,(r-E0)/1e3);E0=r;const c=1-Math.exp(-o*(a.rpm>l.tachRpm?10:6));l.tachRpm+=(a.rpm-l.tachRpm)*c,ib(l.tachRpm,a.gear);const h=Math.abs(l.speed)*2.25;kc+=(h-kc)*(1-Math.exp(-o*8)),Oc+=(l.boost-Oc)*(1-Math.exp(-o*9)),tb(kc,l.speed<-.5),nb(Oc,l.boosting),Ye.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),Ye.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(Ye.centerMessage.textContent="Paused",Ye.centerMessage.classList.remove("hidden")):l.messageTimer>0?(Ye.centerMessage.textContent=l.message,Ye.centerMessage.classList.remove("hidden")):Ye.centerMessage.classList.add("hidden")}function Al(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}const Wn={active:!1,prev:{}};function sb(){let n=null;if(navigator.getGamepads){for(const d of navigator.getGamepads())if(d&&d.connected){n=d;break}}if(!n){if(Wn.active){Wn.active=!1,Re.steer=0,Re.throttle=0,Re.brake=0;for(const d of["Space","ShiftLeft"])Wn.prev[d]&&(je.delete(d),Wn.prev[d]=!1)}return}const e=d=>Math.abs(d)<.14?0:d,t=e(n.axes[0]||0),i=Math.max(n.buttons[7]?.value||0,n.buttons[0]?.pressed?1:0),s=Math.max(n.buttons[6]?.value||0,n.buttons[1]?.pressed?1:0),a=!!n.buttons[2]?.pressed,r=!!n.buttons[3]?.pressed,o=!!n.buttons[5]?.pressed,c=!!n.buttons[9]?.pressed;if(!Wn.active&&!t&&!i&&!s&&!a&&!r&&!o&&!c)return;Wn.active||ls(),Wn.active=!0,Re.steer=t,Re.throttle=i,Re.brake=s;const h=(d,u)=>{u&&!Wn.prev[d]?je.add(d):!u&&Wn.prev[d]&&je.delete(d),Wn.prev[d]=u};h("Space",a),h("ShiftLeft",o),r&&!Wn.prev.actB&&l.mode==="roam"&&zd(),Wn.prev.actB=r,c&&!Wn.prev.startB&&window.dispatchEvent(new KeyboardEvent("keydown",{code:l.mode==="race"||l.mode==="paused"?"KeyP":"Escape"})),Wn.prev.startB=c}function xp(){ln.info.reset(),sb();const n=HM.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?Ly(e):l.vehicle==="heli"?Dy(e):sp(e),fp(e),Sy()):l.mode==="menu"?(T0(e),Qy(e)):(pp(e),T0(e),jy(),Jy(),Bd(e)),Ay(),Ey(),vi&&vi.position.copy(xe.position),_y(e),Lf(e),Ur(),yy(),Tr.uniforms.uTime.value+=e,Cf.forEach(i=>i.uniforms.uTime.value+=e),Tr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);Tr.uniforms.uBoost.value+=(t-Tr.uniforms.uBoost.value)*Math.min(1,e*6),ar.render(),ge.renderCalls=ln.info.render.calls,ge.renderTris=ln.info.render.triangles,requestAnimationFrame(xp)}window.addEventListener("keydown",n=>{je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused"?XM():l.mode==="roam"&&l.vehicle!=="foot"&&Vy()),n.code==="KeyE"&&zd(),n.code==="KeyN"&&Ep(),n.code==="KeyV"&&Gd(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",je.clear(),Qr()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",Qr(),Ht.visible=!1,fn&&(fn.visible=!0),document.body.classList.remove("roam-mode"),$i(),Ye.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>je.delete(n.code));window.addEventListener("resize",()=>{xe.aspect=window.innerWidth/window.innerHeight,xe.updateProjectionMatrix(),ln.setSize(window.innerWidth,window.innerHeight),ar.setSize(window.innerWidth,window.innerHeight),Zf.setSize(window.innerWidth,window.innerHeight)});const Cl=()=>{ls(),window.removeEventListener("pointerdown",Cl),window.removeEventListener("keydown",Cl)};window.addEventListener("pointerdown",Cl);window.addEventListener("keydown",Cl);const Jr=document.createElement("button");Jr.id="volBtn",Jr.type="button";function gp(){Jr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}gp();Jr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Pe&&Pe.master.gain.setTargetAtTime(e,Pe.ctx.currentTime,.05),gp()});const vp=document.querySelector("#menuToggles")||Ye.menu;vp.appendChild(Jr);const jr=document.createElement("button");jr.id="musicBtn",jr.type="button";function Mp(){jr.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}Mp();jr.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),ls(),Mp()});vp.appendChild(jr);const zr=document.createElement("button");zr.id="actionBtn",zr.type="button",zr.textContent="E";zr.addEventListener("pointerdown",n=>{n.preventDefault(),ls(),zd()});Ye.touchControls.appendChild(zr);const Hl=document.createElement("div");Hl.className="course-select";Hl.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Ye.freeRunBtn.parentNode.insertBefore(Hl,Ye.freeRunBtn);const _p=[];Ls.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>N_(e)),Hl.querySelector("#carButtons").appendChild(t),_p.push(t)});function Yh(){const n=Ls[Wi],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),_p.forEach((t,i)=>t.classList.toggle("active",i===Wi))}Yh();Ye.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+Zn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Ye.playerProgress=document.querySelector("#playerProgress");Zn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function Wl(){const n=ro();Ye.startBtn.textContent=$t?.active?`Continue Season — Race ${$t.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=kf();e.innerHTML=`<span>Division ${Nf(n)}${$t?.active?` — after race ${$t.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${$t?` — ${i.pts} pts`:""}</b>`).join("")}}function ab(){l.mode==="roam"&&l.score>800&&Rp("roam",l.score,{deliveries:ge.deliveries||0,stunts:ge.stunts||0,busts:ge.busts||0}),l.mode="menu",Qr(),Ht.visible=!1,fn&&(fn.visible=!0),ao(!1),document.body.classList.remove("roam-mode"),$i(),Wl(),Ye.result.classList.add("hidden"),Ye.menu.classList.remove("hidden")}Wl();Ye.startBtn.addEventListener("click",()=>{$t&&$t.active||O_(),oo(ue.clamp($t.raceIndex,0,3)),Kr(!1,!1,!0)});Ye.practiceBtn.addEventListener("click",()=>Kr(!0));Ye.freeRunBtn.addEventListener("click",()=>Kr(!0,!0));Ye.roamBtn.addEventListener("click",()=>Tl());Ye.againBtn.addEventListener("click",()=>{l.seasonRace&&$t?$t.active&&$t.raceIndex<4?(oo($t.raceIndex),Kr(!1,!1,!0)):ab():Kr(!1)});Ye.courseButtons.forEach(n=>{n.addEventListener("click",()=>oo(Number(n.dataset.course)))});function yp(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Qr(){Re.steer=0,Re.throttle=0,Re.brake=0,Re.lookX=0,Re.lookY=0,Re.zoom=0,Re.lookPointer=null,Re.drivePointer=null,Re.pinchStartDistance=0,Re.pinchStartZoom=0;for(const n of Ye.touchControls.querySelectorAll(".touch-stick"))yp(n)}function tl(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=ue.clamp(e.clientX-(t.left+t.width/2),-i,i),a=ue.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Re.lookX=ue.clamp(s/i,-1,1),Re.lookY=ue.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Re.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Re.lookY*i)}px`);else{const o=ue.clamp(s/i,-1,1),c=ue.clamp(-a/i,-1,1);Re.steer=o,Re.throttle=Math.max(0,c),Re.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function A0(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function C0(n,e){e==="look"?(Re.lookX=0,Re.lookY=0,Re.lookPointer=null):(Re.steer=0,Re.throttle=0,Re.brake=0,Re.drivePointer=null),yp(n)}function rb(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function bp(n,e=!1){if(n.touches.length<2){Re.pinchStartDistance=0;return}const t=rb(n.touches[0],n.touches[1]);if(e||!(Re.pinchStartDistance>0)){Re.pinchStartDistance=t,Re.pinchStartZoom=Re.zoom;return}const i=Math.max(.2,t/Re.pinchStartDistance);Re.zoom=ue.clamp(Re.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Ye.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),ls(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Re.lookPointer=s.pointerId),e==="drive"&&(Re.drivePointer=s.pointerId),tl(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Re.lookPointer:Re.drivePointer)===s.pointerId&&(s.preventDefault(),tl(n,s))},{passive:!1});const t=s=>{(e==="look"?Re.lookPointer:Re.drivePointer)===s.pointerId&&C0(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),ls(),l.mode==="paused"&&(l.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Re.lookPointer=a.identifier),e==="drive"&&(Re.drivePointer=a.identifier),tl(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Re.lookPointer:Re.drivePointer,r=A0(s,a);r&&(s.preventDefault(),tl(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Re.lookPointer:Re.drivePointer;A0(s,a)&&(s.preventDefault(),C0(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Ye.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),ls(),je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}ir.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),bp(n,!0))},{passive:!1});ir.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),bp(n))},{passive:!1});ir.addEventListener("touchend",n=>{n.touches.length<2&&(Re.pinchStartDistance=0)},{passive:!1});ir.addEventListener("touchcancel",()=>{Re.pinchStartDistance=0},{passive:!1});var Ri=0;function ja(){return Ri}let hi=localStorage.getItem("steel-ribbon-weather")||"clear";hi==="rain"||(hi="clear");const Vd=420,wp=[];for(let n=0;n<Vd;n++)wp.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const Rl=new sn;Rl.setAttribute("position",new Rt(new Float32Array(Vd*6),3));const Sp=new vl({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),ea=new ax(Rl,Sp);ea.frustumCulled=!1,ea.renderOrder=40,ea.visible=!1,Te.add(ea);mn(new kt,(n,e)=>{const t=hi==="rain"?1:0;if(Ri+=(t-Ri)*Math.min(1,e*1.3),t===0&&Ri<.01&&(Ri=0),ea.visible=Ri>.02,Sp.opacity=.34*Ri,ea.visible){ea.position.copy(xe.position);const i=Rl.attributes.position.array;for(let s=0;s<Vd;s++){const a=wp[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}Rl.attributes.position.needsUpdate=!0}vn.roadMat&&(vn.roadMat.roughness=.62-.37*Ri,vn.roadMat.metalness=.1+.26*Ri,vn.roadMat.envMapIntensity=.8+.9*Ri)});function Gd(){hi=hi==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",hi),Tp(),l.message=hi==="rain"?"Rain rolling in":"Skies clearing",l.messageTimer=1.2}const eo=document.createElement("button");eo.id="weatherBtn",eo.type="button";function Tp(){eo.textContent=hi==="rain"?"🌧 Rain":"☀ Clear"}Tp();eo.addEventListener("click",n=>{n.stopPropagation(),Gd()});(document.querySelector("#menuToggles")||Ye.menu).appendChild(eo);const Nr=["dusk","night","day","cycle"],ob={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let Yn=localStorage.getItem("steel-ribbon-tod")||"dusk";Nr.includes(Yn)||(Yn="dusk");let cl=0,hl=0,Bc=95;const lb=new at,$h=new at,cb=new at;function Vs(n,e,t,i,s){return cb.set(n).lerp(lb.set(e),i).lerp($h.set(t),s)}const vs=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Te.traverse(n=>{n.isSprite&&n.renderOrder===-50&&vn.cloudMats.push(n.material)});function hb(n,e){if(!vn.skyU)return;const t=ja();vn.skyU.uDay.value=n,vn.skyU.uNight.value=e,vn.skyU.uRain.value=t;const i=vn;i.hemi.color.copy(Vs(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(Vs(3097190,5925464,789534,n,e)),i.hemi.intensity=vs(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(Vs(7179775,13096432,2240591,n,e)),i.fill.intensity=vs(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(Vs(16752724,16774880,10336511,n,e)),i.key.intensity=vs(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=vs(.5,.3,.1,n,e)*(1-.4*t),Te.fog.color.copy(Vs(14719602,12834794,723741,n,e).lerp($h.set(5923950),.6*t)),Te.fog.near=vs(360,430,300,n,e)*(1-.45*t),Te.fog.far=vs(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(Vs(16764250,16777198,14542591,n,e)),i.sunMat.opacity=vs(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=vs(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=Vs(16777215,16777215,3687001,n,e).lerp($h.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}mn(new kt,(n,e)=>{let t=0,i=0;if(Yn==="day")t=1;else if(Yn==="night")i=1;else if(Yn==="cycle"){Bc=(Bc+e)%270;const a=Bc;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);cl+=(t-cl)*s,hl+=(i-hl)*s,hb(cl,hl)});function Ep(){Yn=Nr[(Nr.indexOf(Yn)+1)%Nr.length],localStorage.setItem("steel-ribbon-tod",Yn),Hd(),l.message=`Time of day: ${Yn.toUpperCase()}`,l.messageTimer=1.2}const to=document.createElement("button");to.id="todBtn",to.type="button";function Hd(){to.textContent=`${ob[Yn]} ${Yn[0].toUpperCase()}${Yn.slice(1)}`}Hd();to.addEventListener("click",n=>{n.stopPropagation(),Ep()});(document.querySelector("#menuToggles")||Ye.menu).appendChild(to);const R0=document.querySelector("#menuMain"),db=document.querySelector("#onlinePanel"),ub=document.querySelector("#scoresPanel");function Pl(n){R0&&(R0.classList.toggle("hidden",!!n),db.classList.toggle("hidden",n!=="online"),ub.classList.toggle("hidden",n!=="scores"))}const Ap={lap:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",roam:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1"},Zh="steel-ribbon-initials",Da=document.querySelector("#initials");Da&&(Da.value=localStorage.getItem(Zh)||"",Da.addEventListener("input",()=>{Da.value=Da.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,3),localStorage.setItem(Zh,Da.value)}));function fb(){return(localStorage.getItem(Zh)||"").slice(0,3)}let no="lap";async function Cp(n){try{const e=new AbortController,t=setTimeout(()=>e.abort(),7e3),i=await fetch(Ap[n],{signal:e.signal,cache:"no-store"});clearTimeout(t);const s=await i.json();return(Array.isArray(s)?s:s.scores||[]).filter(r=>Number(r.score)>0).sort((r,o)=>o.score-r.score).slice(0,12)}catch{return null}}async function Rp(n,e,t={}){const i=fb();if(!i||!(e>0))return!1;try{const s=new AbortController,a=setTimeout(()=>s.abort(),7e3);return await fetch(Ap[n],{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initials:i,score:Math.max(0,Math.floor(e)),extra:t}),signal:s.signal}),clearTimeout(a),ge.scoresPosted=(ge.scoresPosted||0)+1,!0}catch{return!1}}async function Pp(){const n=document.querySelector("#scoreBoard");if(!n)return;n.textContent="Loading…";const e=await Cp(no);if(!e){n.textContent="Leaderboard unreachable — try again later.";return}if(!e.length){n.textContent="No entries yet — set your initials and claim the first spot.";return}n.innerHTML=e.map((t,i)=>{const s=String(t.initials||t.name||"???").slice(0,3),a=no==="lap"?t.extra?.time?`${Number(t.extra.time).toFixed(2)}s — ${t.extra.course||"?"}`:Math.round(t.score):Math.round(t.score).toLocaleString();return`<div class="score-row"><i>${i+1}</i><b>${s}</b><span>${a}</span></div>`}).join("")}for(const[n,e]of[["#lapBoardBtn","lap"],["#roamBoardBtn","roam"]]){const t=document.querySelector(n);t&&t.addEventListener("click",()=>{no=e,document.querySelector("#lapBoardBtn")?.classList.toggle("active-board",e==="lap"),document.querySelector("#roamBoardBtn")?.classList.toggle("active-board",e==="roam"),Pp()})}document.querySelector("#scoresBtn")?.addEventListener("click",()=>(Pl("scores"),Pp()));document.querySelector("#scoresBackBtn")?.addEventListener("click",()=>Pl(null));const pb="wss://iron-ridge-online.jez237.workers.dev/ws",Lp="steel-ribbon-mp-room",Dp="steel-ribbon-mp-name",bt={ws:null,connected:!1,id:null,room:"",name:"",peers:new Map,lastState:0,lastPing:0,manual:!1},br=(n,e,t)=>String(n||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,t)||e;function mb(){const n="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let e="";const t=new Uint8Array(5);crypto.getRandomValues(t);for(const i of t)e+=n[i%n.length];return e}function Ms(n){const e=document.querySelector("#mpStatus");e&&(e.textContent=n)}function xb(n){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.clearRect(0,0,256,64),t.fillStyle="rgba(10, 16, 26, 0.78)",t.fillRect(14,10,228,42),t.strokeStyle="rgba(140, 200, 255, 0.9)",t.lineWidth=3,t.strokeRect(14,10,228,42),t.fillStyle="#d8ecff",t.font="800 24px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,32,208);const i=new en(e);i.colorSpace=Lt;const s=new xl(new Il({map:i,transparent:!0,depthTest:!1}));return s.scale.set(7.4,1.85,1),s}function P0(n,e){let t=bt.peers.get(n);return t||(t={id:n,name:e||"DRIVER",hue:[...n].reduce((i,s)=>i+s.charCodeAt(0),0),tx:0,ty:0,tz:0,tyaw:0,v:"car",has:!1,lastSeen:performance.now()},bt.peers.set(n,t)),e&&(t.name=e),t}function gb(n){n.car||(n.car=so("compact",[16739693,5163247,16770048,9498256,3531007][n.hue%5]),n.car.userData.stolenYOff=.57,Te.add(n.car),n.walker=Ad(9464783,4149685),n.walker.visible=!1,Te.add(n.walker),n.label=xb(n.name),Te.add(n.label))}function Wd(n){n.car&&Ds(n.car),n.walker&&Ds(n.walker),n.label&&(n.label.material.map?.dispose(),n.label.material.dispose(),Te.remove(n.label)),bt.peers.delete(n.id)}function Ll(n=!0){if(bt.manual=n,bt.ws)try{bt.ws.close(1e3,"leave")}catch{}bt.ws=null,bt.connected=!1,bt.id=null;for(const e of[...bt.peers.values()])Wd(e);Ms("Not connected."),Xd()}function Ip(){Ll(!0);const n=br(document.querySelector("#mpName")?.value,"DRIVER",12),e=br(document.querySelector("#mpRoom")?.value,"",10)||mb(),t=document.querySelector("#mpRoom");t&&(t.value=e),localStorage.setItem(Lp,e),localStorage.setItem(Dp,n),bt.room=e,bt.name=n,bt.manual=!1,Ms(`Connecting to ${e}…`);let i;try{i=new WebSocket(`${pb}/${encodeURIComponent(`SRR-${e}`)}`)}catch{Ms("Connection failed.");return}bt.ws=i,i.onopen=()=>{bt.connected=!0,i.send(JSON.stringify({type:"hello",name:n})),Ms(`Room ${e} — connected`),Xd()},i.onclose=()=>{bt.ws===i&&(Ll(!0),Ms(bt.manual?"Not connected.":"Connection dropped."))},i.onerror=()=>Ms("Connection failed — try again."),i.onmessage=s=>{let a;try{a=JSON.parse(s.data)}catch{return}if(a.type==="welcome"){bt.id=a.id,Ms(`Room ${bt.room} — ${Math.max(1,Number(a.count)||1)} cruising`);return}if(a.type==="peers"){const r=new Set((a.peers||[]).filter(o=>o.id!==bt.id).map(o=>o.id));for(const o of[...bt.peers.values()])r.has(o.id)||Wd(o);for(const o of a.peers||[]){if(!o.id||o.id===bt.id)continue;const c=bt.peers.has(o.id);P0(o.id,br(o.name,"DRIVER",12)),c||l.mode==="roam"&&(l.message=`${br(o.name,"DRIVER",12)} joined the cruise`,l.messageTimer=1.6)}Ms(`Room ${bt.room} — ${bt.peers.size+1} cruising`);return}if(!(!a.from||a.from===bt.id)&&a.type==="state"&&a.state){const r=P0(a.from,a.name&&br(a.name,"DRIVER",12));r.tx=Number(a.state.x)||0,r.ty=Number(a.state.y)||0,r.tz=Number(a.state.z)||0,r.tyaw=Number(a.state.yaw)||0,r.v=a.state.v==="foot"?"foot":"car",r.lastSeen=performance.now(),r.has||(gb(r),r.car.position.set(r.tx,r.ty,r.tz),r.has=!0)}}}function Xd(){const n=document.querySelector("#mpJoinBtn"),e=document.querySelector("#mpLeaveBtn");n&&(n.textContent=bt.connected?"Switch Room":"Join Room"),e&&e.classList.toggle("hidden",!bt.connected)}{const n=document.querySelector("#mpName"),e=document.querySelector("#mpRoom");n&&(n.value=localStorage.getItem(Dp)||""),e&&(e.value=localStorage.getItem(Lp)||""),document.querySelector("#onlineBtn")?.addEventListener("click",()=>Pl("online")),document.querySelector("#onlineBackBtn")?.addEventListener("click",()=>Pl(null)),document.querySelector("#mpJoinBtn")?.addEventListener("click",Ip),document.querySelector("#mpLeaveBtn")?.addEventListener("click",()=>Ll(!0)),Xd()}mn(new kt,(n,e)=>{if(!bt.connected)return;const t=performance.now();for(const i of[...bt.peers.values()]){if(!i.has)continue;if(t-i.lastSeen>12e3){Wd(i);continue}const s=1-Math.exp(-10*e),a=i.v!=="foot";i.car.visible=a,i.walker.visible=!a;const r=a?i.car:i.walker;if(r.position.lerp(Sd.set(i.tx,i.ty-(a?.25:.5),i.tz),s),r.rotation.y=-i.tyaw,i.label.position.set(r.position.x,r.position.y+(a?3.4:3),r.position.z),a)for(const o of i.car.userData.wheels||[])o.rotation.x-=20*e}t-bt.lastPing>5e3&&(bt.lastPing=t,bt.ws?.readyState===1&&bt.ws.send(JSON.stringify({type:"ping",t}))),l.mode==="roam"&&t-bt.lastState>95&&bt.ws?.readyState===1&&(bt.lastState=t,bt.ws.send(JSON.stringify({type:"state",name:bt.name,state:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1),yaw:+l.roamYaw.toFixed(2),v:l.vehicle==="foot"?"foot":"car"}}))),ge.mpPeers=bt.peers.size});function vb(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of Ed)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of nn)e(c.marker);e(Ht),e(un),typeof fn<"u"&&e(fn),typeof yi<"u"&&e(yi),he&&e(he.mesh),typeof vi<"u"&&e(vi),typeof Li<"u"&&Li&&e(Li);for(const c of Zn)e(c.mesh);const i=new Map;Te.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let p=c;p&&p!==Te;p=p.parent){if(n.has(p)||!p.visible)return;const x=p.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const u=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let m=i.get(u);m||i.set(u,m=[]),m.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(p=>{p.updateWorldMatrix(!0,!1);const x=p.geometry.clone().applyMatrix4(p.matrixWorld);for(const _ of Object.keys(x.attributes))_==="position"||_==="normal"||_==="uv"||x.deleteAttribute(_);return x}),d=Fn(h,!1);if(!d)continue;const u=c[0],m=new U(d,u.material);m.castShadow=u.castShadow,m.receiveShadow=u.receiveShadow,m.matrixAutoUpdate=!1,Te.add(m);for(const p of c)r.set(p.geometry.uuid,p.geometry),p.removeFromParent(),a++;s++}catch{}const o=new Set;Te.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of r)o.has(c)||h.dispose();ge.staticMerge={groups:s,meshesRemoved:a}}vb();const Mb=_t(l.s);l.y=Mb.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;Bd(.016);Ur();xp();const ft={active:!1,yaw:.6,pitch:.32,radius:9,target:new L,entryMode:null,_drag:null,_pinch:0};window.__photoRig=ft;const rs=document.createElement("button");rs.id="photoBtn",rs.type="button",rs.textContent="📷";rs.style.cssText="position:fixed;right:12px;bottom:96px;z-index:30;font-size:20px;padding:6px 10px;background:rgba(10,14,22,0.72);color:#cfe6ff;border:1px solid rgba(140,180,220,0.35);border-radius:10px;display:none;cursor:pointer;";document.body.appendChild(rs);const io=document.createElement("div");io.textContent="PHOTO MODE — drag to orbit · scroll/pinch to zoom · O or 📷 to exit";io.style.cssText="position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:30;font:600 12px/1.4 system-ui,sans-serif;color:#dff0ff;background:rgba(8,12,20,0.62);padding:6px 12px;border-radius:8px;display:none;pointer-events:none;letter-spacing:0.04em;";document.body.appendChild(io);function Xl(n){if(n!==ft.active)if(n){if(!(l.mode==="race"||l.mode==="roam"||l.mode==="paused"))return;ft.entryMode=l.mode,l.mode==="roam"?ft.target.set(l.roamPos.x,l.roamPos.y+1.1,l.roamPos.z):(Ht.getWorldPosition(ft.target),ft.target.y+=1),ft.minR=l.mode==="roam"&&l.vehicle==="foot"?2.2:5.4,ft.pitch=.3,ft.radius=9,ft.active=!0,window.__freeCam=!0,io.style.display="block",rs.textContent="✕"}else ft.active=!1,window.__freeCam=!1,io.style.display="none",rs.textContent="📷"}rs.addEventListener("click",n=>{n.stopPropagation(),Xl(!ft.active)});window.addEventListener("keydown",n=>{n.code==="KeyO"&&Xl(!ft.active)});window.addEventListener("pointerdown",n=>{ft.active&&n.target===ir&&(ft._drag={x:n.clientX,y:n.clientY})});window.addEventListener("pointermove",n=>{if(!ft.active||!ft._drag)return;const e=n.clientX-ft._drag.x,t=n.clientY-ft._drag.y;ft._drag={x:n.clientX,y:n.clientY},ft.yaw-=e*.005,ft.pitch=ue.clamp(ft.pitch+t*.004,-.15,1.25)});window.addEventListener("pointerup",()=>ft._drag=null);window.addEventListener("wheel",n=>{ft.active&&(ft.radius=ue.clamp(ft.radius*(1+Math.sign(n.deltaY)*.12),ft.minR??2.2,70))},{passive:!0});window.addEventListener("touchmove",n=>{if(!ft.active||n.touches.length!==2)return;const e=Math.hypot(n.touches[0].clientX-n.touches[1].clientX,n.touches[0].clientY-n.touches[1].clientY);ft._pinch>0&&(ft.radius=ue.clamp(ft.radius*(ft._pinch/e),ft.minR??2.2,70)),ft._pinch=e},{passive:!0});window.addEventListener("touchend",()=>ft._pinch=0);setInterval(()=>{rs.style.display=l.mode==="race"||l.mode==="roam"||l.mode==="paused"?"block":"none"},800);{const n=new kt;Te.add(n),mn(n,()=>{if(!ft.active)return;if(l.mode!==ft.entryMode){Xl(!1);return}const e=Math.max(ft.minR??2.2,ft.radius),t=Math.cos(ft.pitch);xe.position.set(ft.target.x+Math.sin(ft.yaw)*t*e,ft.target.y+Math.sin(ft.pitch)*e,ft.target.z+Math.cos(ft.yaw)*t*e),xe.lookAt(ft.target),window.__freeCam=!0})}window.__steelRibbonDebug.photoMode=function(n){return Xl(n??!ft.active),{active:ft.active,radius:ft.radius,yaw:+ft.yaw.toFixed(2),cam:{x:+xe.position.x.toFixed(1),y:+xe.position.y.toFixed(1),z:+xe.position.z.toFixed(1)}}};
