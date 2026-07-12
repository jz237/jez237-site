(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Uh="181",vp=0,Ld=1,Mp=2,gf=1,vf=2,Ji=3,Ts=0,In=1,yt=2,Ui=0,Pa=1,si=2,Dd=3,Id=4,_p=5,Vs=100,yp=101,bp=102,wp=103,Sp=104,Tp=200,Ep=201,Ap=202,Cp=203,Sc=204,Tc=205,Rp=206,Pp=207,Lp=208,Dp=209,Ip=210,Up=211,Fp=212,zp=213,Np=214,Ec=0,Ac=1,Cc=2,za=3,Rc=4,Pc=5,Lc=6,Dc=7,Fh=0,Op=1,kp=2,bs=0,Mf=1,_f=2,yf=3,zh=4,bf=5,wf=6,Sf=7,Tf=300,Na=301,Oa=302,Ic=303,Uc=304,xl=306,zn=1e3,es=1001,Fc=1002,Kn=1003,Bp=1004,no=1005,ai=1006,Pl=1007,Hs=1008,Vi=1009,Ef=1010,Af=1011,Ar=1012,Nh=1013,Js=1014,Li=1015,Fi=1016,Oh=1017,kh=1018,Cr=1020,Cf=35902,Rf=35899,Pf=1021,Lf=1022,vi=1023,Rr=1026,Pr=1027,Bh=1028,Vh=1029,Gh=1030,Hh=1031,Wh=1033,Go=33776,Ho=33777,Wo=33778,Xo=33779,zc=35840,Nc=35841,Oc=35842,kc=35843,Bc=36196,Vc=37492,Gc=37496,Hc=37808,Wc=37809,Xc=37810,qc=37811,Yc=37812,$c=37813,Zc=37814,Kc=37815,Jc=37816,jc=37817,Qc=37818,eh=37819,th=37820,nh=37821,ih=36492,sh=36494,ah=36495,rh=36283,oh=36284,lh=36285,ch=36286,Vp=3200,Gp=3201,Xh=0,Hp=1,vs="",Pt="srgb",ka="srgb-linear",Jo="linear",Xt="srgb",sa=7680,Ud=519,Wp=512,Xp=513,qp=514,Df=515,Yp=516,$p=517,Zp=518,Kp=519,hh=35044,Fd="300 es",Di=2e3,jo=2001;function If(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Qo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Jp(){const n=Qo("canvas");return n.style.display="block",n}const zd={};function el(...n){const e="THREE."+n.shift();console.log(e,...n)}function gt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function rn(...n){const e="THREE."+n.shift();console.error(e,...n)}function Lr(...n){const e=n.join(" ");e in zd||(zd[e]=!0,gt(...n))}function jp(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class Wa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nd=1234567;const mr=Math.PI/180,Dr=180/Math.PI;function zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Cn[n&255]+Cn[n>>8&255]+Cn[n>>16&255]+Cn[n>>24&255]+"-"+Cn[e&255]+Cn[e>>8&255]+"-"+Cn[e>>16&15|64]+Cn[e>>24&255]+"-"+Cn[t&63|128]+Cn[t>>8&255]+"-"+Cn[t>>16&255]+Cn[t>>24&255]+Cn[i&255]+Cn[i>>8&255]+Cn[i>>16&255]+Cn[i>>24&255]).toLowerCase()}function Rt(n,e,t){return Math.max(e,Math.min(t,n))}function qh(n,e){return(n%e+e)%e}function Qp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function em(n,e,t){return n!==e?(t-n)/(e-n):0}function xr(n,e,t){return(1-t)*n+t*e}function tm(n,e,t,i){return xr(n,e,1-Math.exp(-t*i))}function nm(n,e=1){return e-Math.abs(qh(n,e*2)-e)}function im(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function sm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function am(n,e){return n+Math.floor(Math.random()*(e-n+1))}function rm(n,e){return n+Math.random()*(e-n)}function om(n){return n*(.5-Math.random())}function lm(n){n!==void 0&&(Nd=n);let e=Nd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function cm(n){return n*mr}function hm(n){return n*Dr}function dm(n){return(n&n-1)===0&&n!==0}function um(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function fm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function pm(n,e,t,i,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),u=a((e-i)/2),p=r((e-i)/2),m=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(o*d,c*u,c*p,o*h);break;case"YZY":n.set(c*p,o*d,c*u,o*h);break;case"ZXZ":n.set(c*u,c*p,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*m,o*h);break;case"YXY":n.set(c*m,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*m,o*d,o*h);break;default:gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const xe={DEG2RAD:mr,RAD2DEG:Dr,generateUUID:zi,clamp:Rt,euclideanModulo:qh,mapLinear:Qp,inverseLerp:em,lerp:xr,damp:tm,pingpong:nm,smoothstep:im,smootherstep:sm,randInt:am,randFloat:rm,randFloatSpread:om,seededRandom:lm,degToRad:cm,radToDeg:hm,isPowerOfTwo:dm,ceilPowerOfTwo:um,floorPowerOfTwo:fm,setQuaternionFromProperEuler:pm,normalize:qt,denormalize:mi};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Rt(this.x,e.x,t.x),this.y=Rt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Rt(this.x,e,t),this.y=Rt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class is{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let c=i[s+0],h=i[s+1],d=i[s+2],u=i[s+3],p=a[r+0],m=a[r+1],x=a[r+2],M=a[r+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(u!==M||c!==p||h!==m||d!==x){let g=c*p+h*m+d*x+u*M;g<0&&(p=-p,m=-m,x=-x,M=-M,g=-g);let f=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);f=Math.sin(f*y)/v,o=Math.sin(o*y)/v,c=c*f+p*o,h=h*f+m*o,d=d*f+x*o,u=u*f+M*o}else{c=c*f+p*o,h=h*f+m*o,d=d*f+x*o,u=u*f+M*o;const y=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=y,h*=y,d*=y,u*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],u=a[r],p=a[r+1],m=a[r+2],x=a[r+3];return e[t]=o*x+d*u+c*m-h*p,e[t+1]=c*x+d*p+h*u-o*m,e[t+2]=h*x+d*m+o*p-c*u,e[t+3]=d*x-o*u-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),u=o(a/2),p=c(i/2),m=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"YXZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"ZXY":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"ZYX":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"YZX":this._x=p*d*u+h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u-p*m*x;break;case"XZY":this._x=p*d*u-h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u+p*m*x;break;default:gt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],h=t[2],d=t[6],u=t[10],p=i+o+u;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(a-h)*m,this._z=(r-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+h)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(a-h)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(r-s)/m,this._x=(a+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*o+s*h-a*c,this._y=s*d+r*c+a*o-i*h,this._z=a*d+r*h+i*c-s*o,this._w=r*d-i*o-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Od.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Od.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,h=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+c*h+r*u-o*d,this.y=i+c*d+o*h-a*u,this.z=s+c*u+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Rt(this.x,e.x,t.x),this.y=Rt(this.y,e.y,t.y),this.z=Rt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Rt(this.x,e,t),this.y=Rt(this.y,e,t),this.z=Rt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ll.copy(this).projectOnVector(e),this.sub(Ll)}reflect(e){return this.sub(Ll.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ll=new P,Od=new is;class Et{constructor(e,t,i,s,a,r,o,c,h){Et.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h)}set(e,t,i,s,a,r,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],c=i[6],h=i[1],d=i[4],u=i[7],p=i[2],m=i[5],x=i[8],M=s[0],g=s[3],f=s[6],y=s[1],v=s[4],_=s[7],E=s[2],T=s[5],A=s[8];return a[0]=r*M+o*y+c*E,a[3]=r*g+o*v+c*T,a[6]=r*f+o*_+c*A,a[1]=h*M+d*y+u*E,a[4]=h*g+d*v+u*T,a[7]=h*f+d*_+u*A,a[2]=p*M+m*y+x*E,a[5]=p*g+m*v+x*T,a[8]=p*f+m*_+x*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*o*h-i*a*d+i*o*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=d*r-o*h,p=o*c-d*a,m=h*a-r*c,x=t*u+i*p+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=u*M,e[1]=(s*h-d*i)*M,e[2]=(o*i-s*r)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*a-o*t)*M,e[6]=m*M,e[7]=(i*c-h*t)*M,e[8]=(r*t-i*a)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*o)+r+e,-s*h,s*c,-s*(-h*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Dl.makeScale(e,t)),this}rotate(e){return this.premultiply(Dl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Dl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Dl=new Et,kd=new Et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bd=new Et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mm(){const n={enabled:!0,workingColorSpace:ka,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===Xt&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Xt&&(s.r=La(s.r),s.g=La(s.g),s.b=La(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vs?Jo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Lr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Lr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ka]:{primaries:e,whitePoint:i,transfer:Jo,toXYZ:kd,fromXYZ:Bd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Pt},outputColorSpaceConfig:{drawingBufferColorSpace:Pt}},[Pt]:{primaries:e,whitePoint:i,transfer:Xt,toXYZ:kd,fromXYZ:Bd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Pt}}}),n}const Ft=mm();function ts(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function La(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let aa;class xm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{aa===void 0&&(aa=Qo("canvas")),aa.width=e.width,aa.height=e.height;const s=aa.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=aa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Qo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=ts(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ts(t[i]/255)*255):t[i]=ts(t[i]);return{data:t,width:e.width,height:e.height}}else return gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gm=0;class Yh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Il(s[r].image)):a.push(Il(s[r]))}else a=Il(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Il(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?xm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(gt("Texture: Unable to serialize Texture."),{})}let vm=0;const Ul=new P;class Un extends Wa{constructor(e=Un.DEFAULT_IMAGE,t=Un.DEFAULT_MAPPING,i=es,s=es,a=ai,r=Hs,o=vi,c=Vi,h=Un.DEFAULT_ANISOTROPY,d=vs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=zi(),this.name="",this.source=new Yh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ul).x}get height(){return this.source.getSize(Ul).y}get depth(){return this.source.getSize(Ul).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){gt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){gt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Tf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case es:e.x=e.x<0?0:1;break;case Fc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case es:e.y=e.y<0?0:1;break;case Fc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Un.DEFAULT_IMAGE=null;Un.DEFAULT_MAPPING=Tf;Un.DEFAULT_ANISOTROPY=1;class $t{constructor(e=0,t=0,i=0,s=1){$t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],u=c[8],p=c[1],m=c[5],x=c[9],M=c[2],g=c[6],f=c[10];if(Math.abs(d-p)<.01&&Math.abs(u-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(u+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,_=(m+1)/2,E=(f+1)/2,T=(d+p)/4,A=(u+M)/4,R=(x+g)/4;return v>_&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=T/i,a=A/i):_>E?_<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),i=T/s,a=R/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=A/a,s=R/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(u-M)*(u-M)+(p-d)*(p-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(u-M)/y,this.z=(p-d)/y,this.w=Math.acos((h+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Rt(this.x,e.x,t.x),this.y=Rt(this.y,e.y,t.y),this.z=Rt(this.z,e.z,t.z),this.w=Rt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Rt(this.x,e,t),this.y=Rt(this.y,e,t),this.z=Rt(this.z,e,t),this.w=Rt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Mm extends Wa{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ai,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new $t(0,0,e,t),this.scissorTest=!1,this.viewport=new $t(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Un(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ai,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Yh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _i extends Mm{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Uf extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class _m extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ta{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ci.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ci.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ci.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,ci):ci.fromBufferAttribute(a,r),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),io.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),io.copy(i.boundingBox)),io.applyMatrix4(e.matrixWorld),this.union(io)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ja),so.subVectors(this.max,ja),ra.subVectors(e.a,ja),oa.subVectors(e.b,ja),la.subVectors(e.c,ja),as.subVectors(oa,ra),rs.subVectors(la,oa),Ls.subVectors(ra,la);let t=[0,-as.z,as.y,0,-rs.z,rs.y,0,-Ls.z,Ls.y,as.z,0,-as.x,rs.z,0,-rs.x,Ls.z,0,-Ls.x,-as.y,as.x,0,-rs.y,rs.x,0,-Ls.y,Ls.x,0];return!Fl(t,ra,oa,la,so)||(t=[1,0,0,0,1,0,0,0,1],!Fl(t,ra,oa,la,so))?!1:(ao.crossVectors(as,rs),t=[ao.x,ao.y,ao.z],Fl(t,ra,oa,la,so))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xi=[new P,new P,new P,new P,new P,new P,new P,new P],ci=new P,io=new ta,ra=new P,oa=new P,la=new P,as=new P,rs=new P,Ls=new P,ja=new P,so=new P,ao=new P,Ds=new P;function Fl(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Ds.fromArray(n,a);const o=s.x*Math.abs(Ds.x)+s.y*Math.abs(Ds.y)+s.z*Math.abs(Ds.z),c=e.dot(Ds),h=t.dot(Ds),d=i.dot(Ds);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const ym=new ta,Qa=new P,zl=new P;class Xa{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ym.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qa.subVectors(e,this.center);const t=Qa.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Qa,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qa.copy(e.center).add(zl)),this.expandByPoint(Qa.copy(e.center).sub(zl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const qi=new P,Nl=new P,ro=new P,os=new P,Ol=new P,oo=new P,kl=new P;class $h{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Nl.copy(e).add(t).multiplyScalar(.5),ro.copy(t).sub(e).normalize(),os.copy(this.origin).sub(Nl);const a=e.distanceTo(t)*.5,r=-this.direction.dot(ro),o=os.dot(this.direction),c=-os.dot(ro),h=os.lengthSq(),d=Math.abs(1-r*r);let u,p,m,x;if(d>0)if(u=r*c-o,p=r*o-c,x=a*d,u>=0)if(p>=-x)if(p<=x){const M=1/d;u*=M,p*=M,m=u*(u+r*p+2*o)+p*(r*u+p+2*c)+h}else p=a,u=Math.max(0,-(r*p+o)),m=-u*u+p*(p+2*c)+h;else p=-a,u=Math.max(0,-(r*p+o)),m=-u*u+p*(p+2*c)+h;else p<=-x?(u=Math.max(0,-(-r*a+o)),p=u>0?-a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h):p<=x?(u=0,p=Math.min(Math.max(-a,-c),a),m=p*(p+2*c)+h):(u=Math.max(0,-(r*a+o)),p=u>0?a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h);else p=r>0?-a:a,u=Math.max(0,-(r*p+o)),m=-u*u+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Nl).addScaledVector(ro,p),m}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const i=qi.dot(this.direction),s=qi.dot(qi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),d>=0?(a=(e.min.y-p.y)*d,r=(e.max.y-p.y)*d):(a=(e.max.y-p.y)*d,r=(e.min.y-p.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(o=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,i,s,a){Ol.subVectors(t,e),oo.subVectors(i,e),kl.crossVectors(Ol,oo);let r=this.direction.dot(kl),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;os.subVectors(this.origin,e);const c=o*this.direction.dot(oo.crossVectors(os,oo));if(c<0)return null;const h=o*this.direction.dot(Ol.cross(os));if(h<0||c+h>r)return null;const d=-o*os.dot(kl);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _t{constructor(e,t,i,s,a,r,o,c,h,d,u,p,m,x,M,g){_t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h,d,u,p,m,x,M,g)}set(e,t,i,s,a,r,o,c,h,d,u,p,m,x,M,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=h,f[6]=d,f[10]=u,f[14]=p,f[3]=m,f[7]=x,f[11]=M,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/ca.setFromMatrixColumn(e,0).length(),a=1/ca.setFromMatrixColumn(e,1).length(),r=1/ca.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const p=r*d,m=r*u,x=o*d,M=o*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=m+x*h,t[5]=p-M*h,t[9]=-o*c,t[2]=M-p*h,t[6]=x+m*h,t[10]=r*c}else if(e.order==="YXZ"){const p=c*d,m=c*u,x=h*d,M=h*u;t[0]=p+M*o,t[4]=x*o-m,t[8]=r*h,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=m*o-x,t[6]=M+p*o,t[10]=r*c}else if(e.order==="ZXY"){const p=c*d,m=c*u,x=h*d,M=h*u;t[0]=p-M*o,t[4]=-r*u,t[8]=x+m*o,t[1]=m+x*o,t[5]=r*d,t[9]=M-p*o,t[2]=-r*h,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const p=r*d,m=r*u,x=o*d,M=o*u;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+M,t[1]=c*u,t[5]=M*h+p,t[9]=m*h-x,t[2]=-h,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const p=r*c,m=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=M-p*u,t[8]=x*u+m,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-h*d,t[6]=m*u+x,t[10]=p-M*u}else if(e.order==="XZY"){const p=r*c,m=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=p*u+M,t[5]=r*d,t[9]=m*u-x,t[2]=x*u-m,t[6]=o*d,t[10]=M*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bm,e,wm)}lookAt(e,t,i){const s=this.elements;return qn.subVectors(e,t),qn.lengthSq()===0&&(qn.z=1),qn.normalize(),ls.crossVectors(i,qn),ls.lengthSq()===0&&(Math.abs(i.z)===1?qn.x+=1e-4:qn.z+=1e-4,qn.normalize(),ls.crossVectors(i,qn)),ls.normalize(),lo.crossVectors(qn,ls),s[0]=ls.x,s[4]=lo.x,s[8]=qn.x,s[1]=ls.y,s[5]=lo.y,s[9]=qn.y,s[2]=ls.z,s[6]=lo.z,s[10]=qn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],c=i[8],h=i[12],d=i[1],u=i[5],p=i[9],m=i[13],x=i[2],M=i[6],g=i[10],f=i[14],y=i[3],v=i[7],_=i[11],E=i[15],T=s[0],A=s[4],R=s[8],S=s[12],b=s[1],L=s[5],I=s[9],V=s[13],j=s[2],te=s[6],q=s[10],K=s[14],ne=s[3],fe=s[7],ve=s[11],Ye=s[15];return a[0]=r*T+o*b+c*j+h*ne,a[4]=r*A+o*L+c*te+h*fe,a[8]=r*R+o*I+c*q+h*ve,a[12]=r*S+o*V+c*K+h*Ye,a[1]=d*T+u*b+p*j+m*ne,a[5]=d*A+u*L+p*te+m*fe,a[9]=d*R+u*I+p*q+m*ve,a[13]=d*S+u*V+p*K+m*Ye,a[2]=x*T+M*b+g*j+f*ne,a[6]=x*A+M*L+g*te+f*fe,a[10]=x*R+M*I+g*q+f*ve,a[14]=x*S+M*V+g*K+f*Ye,a[3]=y*T+v*b+_*j+E*ne,a[7]=y*A+v*L+_*te+E*fe,a[11]=y*R+v*I+_*q+E*ve,a[15]=y*S+v*V+_*K+E*Ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],h=e[13],d=e[2],u=e[6],p=e[10],m=e[14],x=e[3],M=e[7],g=e[11],f=e[15];return x*(+a*c*u-s*h*u-a*o*p+i*h*p+s*o*m-i*c*m)+M*(+t*c*m-t*h*p+a*r*p-s*r*m+s*h*d-a*c*d)+g*(+t*h*u-t*o*m-a*r*u+i*r*m+a*o*d-i*h*d)+f*(-s*o*d-t*c*u+t*o*p+s*r*u-i*r*p+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=e[9],p=e[10],m=e[11],x=e[12],M=e[13],g=e[14],f=e[15],y=u*g*h-M*p*h+M*c*m-o*g*m-u*c*f+o*p*f,v=x*p*h-d*g*h-x*c*m+r*g*m+d*c*f-r*p*f,_=d*M*h-x*u*h+x*o*m-r*M*m-d*o*f+r*u*f,E=x*u*c-d*M*c-x*o*p+r*M*p+d*o*g-r*u*g,T=t*y+i*v+s*_+a*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=y*A,e[1]=(M*p*a-u*g*a-M*s*m+i*g*m+u*s*f-i*p*f)*A,e[2]=(o*g*a-M*c*a+M*s*h-i*g*h-o*s*f+i*c*f)*A,e[3]=(u*c*a-o*p*a-u*s*h+i*p*h+o*s*m-i*c*m)*A,e[4]=v*A,e[5]=(d*g*a-x*p*a+x*s*m-t*g*m-d*s*f+t*p*f)*A,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*f-t*c*f)*A,e[7]=(r*p*a-d*c*a+d*s*h-t*p*h-r*s*m+t*c*m)*A,e[8]=_*A,e[9]=(x*u*a-d*M*a-x*i*m+t*M*m+d*i*f-t*u*f)*A,e[10]=(r*M*a-x*o*a+x*i*h-t*M*h-r*i*f+t*o*f)*A,e[11]=(d*o*a-r*u*a-d*i*h+t*u*h+r*i*m-t*o*m)*A,e[12]=E*A,e[13]=(d*M*s-x*u*s+x*i*p-t*M*p-d*i*g+t*u*g)*A,e[14]=(x*o*s-r*M*s-x*i*c+t*M*c+r*i*g-t*o*g)*A,e[15]=(r*u*s-d*o*s+d*i*c-t*u*c-r*i*p+t*o*p)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,c=e.z,h=a*r,d=a*o;return this.set(h*r+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*r,0,h*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,h=a+a,d=r+r,u=o+o,p=a*h,m=a*d,x=a*u,M=r*d,g=r*u,f=o*u,y=c*h,v=c*d,_=c*u,E=i.x,T=i.y,A=i.z;return s[0]=(1-(M+f))*E,s[1]=(m+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-_)*T,s[5]=(1-(p+f))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(x+v)*A,s[9]=(g-y)*A,s[10]=(1-(p+M))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=ca.set(s[0],s[1],s[2]).length();const r=ca.set(s[4],s[5],s[6]).length(),o=ca.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],hi.copy(this);const h=1/a,d=1/r,u=1/o;return hi.elements[0]*=h,hi.elements[1]*=h,hi.elements[2]*=h,hi.elements[4]*=d,hi.elements[5]*=d,hi.elements[6]*=d,hi.elements[8]*=u,hi.elements[9]*=u,hi.elements[10]*=u,t.setFromRotationMatrix(hi),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=Di,c=!1){const h=this.elements,d=2*a/(t-e),u=2*a/(i-s),p=(t+e)/(t-e),m=(i+s)/(i-s);let x,M;if(c)x=a/(r-a),M=r*a/(r-a);else if(o===Di)x=-(r+a)/(r-a),M=-2*r*a/(r-a);else if(o===jo)x=-r/(r-a),M=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=u,h[9]=m,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Di,c=!1){const h=this.elements,d=2/(t-e),u=2/(i-s),p=-(t+e)/(t-e),m=-(i+s)/(i-s);let x,M;if(c)x=1/(r-a),M=r/(r-a);else if(o===Di)x=-2/(r-a),M=-(r+a)/(r-a);else if(o===jo)x=-1/(r-a),M=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=u,h[9]=0,h[13]=m,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ca=new P,hi=new _t,bm=new P(0,0,0),wm=new P(1,1,1),ls=new P,lo=new P,qn=new P,Vd=new _t,Gd=new is;class yi{constructor(e=0,t=0,i=0,s=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],h=s[5],d=s[9],u=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Rt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Rt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(Rt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Rt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Vd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gd.setFromEuler(this),this.setFromQuaternion(Gd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class Zh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Sm=0;const Hd=new P,ha=new is,Yi=new _t,co=new P,er=new P,Tm=new P,Em=new is,Wd=new P(1,0,0),Xd=new P(0,1,0),qd=new P(0,0,1),Yd={type:"added"},Am={type:"removed"},da={type:"childadded",child:null},Bl={type:"childremoved",child:null};class It extends Wa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new P,t=new yi,i=new is,s=new P(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new Et}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ha.setFromAxisAngle(e,t),this.quaternion.multiply(ha),this}rotateOnWorldAxis(e,t){return ha.setFromAxisAngle(e,t),this.quaternion.premultiply(ha),this}rotateX(e){return this.rotateOnAxis(Wd,e)}rotateY(e){return this.rotateOnAxis(Xd,e)}rotateZ(e){return this.rotateOnAxis(qd,e)}translateOnAxis(e,t){return Hd.copy(e).applyQuaternion(this.quaternion),this.position.add(Hd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wd,e)}translateY(e){return this.translateOnAxis(Xd,e)}translateZ(e){return this.translateOnAxis(qd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?co.copy(e):co.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(er,co,this.up):Yi.lookAt(co,er,this.up),this.quaternion.setFromRotationMatrix(Yi),s&&(Yi.extractRotation(s.matrixWorld),ha.setFromRotationMatrix(Yi),this.quaternion.premultiply(ha.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(rn("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yd),da.child=e,this.dispatchEvent(da),da.child=null):rn("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Am),Bl.child=e,this.dispatchEvent(Bl),Bl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yd),da.child=e,this.dispatchEvent(da),da.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,Tm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Em,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),u=r(e.shapes),p=r(e.skeletons),m=r(e.animations),x=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}It.DEFAULT_UP=new P(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const di=new P,$i=new P,Vl=new P,Zi=new P,ua=new P,fa=new P,$d=new P,Gl=new P,Hl=new P,Wl=new P,Xl=new $t,ql=new $t,Yl=new $t;class ii{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),di.subVectors(e,t),s.cross(di);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){di.subVectors(s,t),$i.subVectors(i,t),Vl.subVectors(e,t);const r=di.dot(di),o=di.dot($i),c=di.dot(Vl),h=$i.dot($i),d=$i.dot(Vl),u=r*h-o*o;if(u===0)return a.set(0,0,0),null;const p=1/u,m=(h*c-o*d)*p,x=(r*d-o*c)*p;return a.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(e,t,i,s,a,r,o,c){return this.getBarycoord(e,t,i,s,Zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Zi.x),c.addScaledVector(r,Zi.y),c.addScaledVector(o,Zi.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return Xl.setScalar(0),ql.setScalar(0),Yl.setScalar(0),Xl.fromBufferAttribute(e,t),ql.fromBufferAttribute(e,i),Yl.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Xl,a.x),r.addScaledVector(ql,a.y),r.addScaledVector(Yl,a.z),r}static isFrontFacing(e,t,i,s){return di.subVectors(i,t),$i.subVectors(e,t),di.cross($i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return di.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),di.cross($i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ii.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ii.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return ii.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return ii.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ii.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;ua.subVectors(s,i),fa.subVectors(a,i),Gl.subVectors(e,i);const c=ua.dot(Gl),h=fa.dot(Gl);if(c<=0&&h<=0)return t.copy(i);Hl.subVectors(e,s);const d=ua.dot(Hl),u=fa.dot(Hl);if(d>=0&&u<=d)return t.copy(s);const p=c*u-d*h;if(p<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(ua,r);Wl.subVectors(e,a);const m=ua.dot(Wl),x=fa.dot(Wl);if(x>=0&&m<=x)return t.copy(a);const M=m*h-c*x;if(M<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(fa,o);const g=d*x-m*u;if(g<=0&&u-d>=0&&m-x>=0)return $d.subVectors(a,s),o=(u-d)/(u-d+(m-x)),t.copy(s).addScaledVector($d,o);const f=1/(g+M+p);return r=M*f,o=p*f,t.copy(i).addScaledVector(ua,r).addScaledVector(fa,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ff={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cs={h:0,s:0,l:0},ho={h:0,s:0,l:0};function $l(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ft.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ft.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ft.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ft.workingColorSpace){if(e=qh(e,1),t=Rt(t,0,1),i=Rt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=$l(r,a,e+1/3),this.g=$l(r,a,e),this.b=$l(r,a,e-1/3)}return Ft.colorSpaceToWorking(this,s),this}setStyle(e,t=Pt){function i(a){a!==void 0&&parseFloat(a)<1&&gt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:gt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);gt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const i=Ff[e.toLowerCase()];return i!==void 0?this.setHex(i,t):gt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}copyLinearToSRGB(e){return this.r=La(e.r),this.g=La(e.g),this.b=La(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return Ft.workingToColorSpace(Rn.copy(this),e),Math.round(Rt(Rn.r*255,0,255))*65536+Math.round(Rt(Rn.g*255,0,255))*256+Math.round(Rt(Rn.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ft.workingColorSpace){Ft.workingToColorSpace(Rn.copy(this),t);const i=Rn.r,s=Rn.g,a=Rn.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,h;const d=(o+r)/2;if(o===r)c=0,h=0;else{const u=r-o;switch(h=d<=.5?u/(r+o):u/(2-r-o),r){case i:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-i)/u+2;break;case a:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=Ft.workingColorSpace){return Ft.workingToColorSpace(Rn.copy(this),t),e.r=Rn.r,e.g=Rn.g,e.b=Rn.b,e}getStyle(e=Pt){Ft.workingToColorSpace(Rn.copy(this),e);const t=Rn.r,i=Rn.g,s=Rn.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(cs),this.setHSL(cs.h+e,cs.s+t,cs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(cs),e.getHSL(ho);const i=xr(cs.h,ho.h,t),s=xr(cs.s,ho.s,t),a=xr(cs.l,ho.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rn=new rt;rt.NAMES=Ff;let Cm=0;class Rs extends Wa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Pa,this.side=Ts,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sc,this.blendDst=Tc,this.blendEquation=Vs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=za,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ud,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=sa,this.stencilZFail=sa,this.stencilZPass=sa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){gt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){gt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pa&&(i.blending=this.blending),this.side!==Ts&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Sc&&(i.blendSrc=this.blendSrc),this.blendDst!==Tc&&(i.blendDst=this.blendDst),this.blendEquation!==Vs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==za&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ud&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==sa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==sa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==sa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ct extends Rs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fn=new P,uo=new Fe;let Rm=0;class Jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Rm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=hh,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)uo.fromBufferAttribute(this,t),uo.applyMatrix3(e),this.setXY(t,uo.x,uo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix3(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mi(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mi(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mi(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array),a=qt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==hh&&(e.usage=this.usage),e}}class zf extends Jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Nf extends Jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class bt extends Jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Pm=0;const ti=new _t,Zl=new It,pa=new P,Yn=new ta,tr=new ta,wn=new P;class Kt extends Wa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(If(e)?Nf:zf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Et().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,i){return ti.makeTranslation(e,t,i),this.applyMatrix4(ti),this}scale(e,t,i){return ti.makeScale(e,t,i),this.applyMatrix4(ti),this}lookAt(e){return Zl.lookAt(e),Zl.updateMatrix(),this.applyMatrix4(Zl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pa).negate(),this.translate(pa.x,pa.y,pa.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new bt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ta);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rn("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Yn.setFromBufferAttribute(a),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&rn('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rn("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Yn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];tr.setFromBufferAttribute(o),this.morphTargetsRelative?(wn.addVectors(Yn.min,tr.min),Yn.expandByPoint(wn),wn.addVectors(Yn.max,tr.max),Yn.expandByPoint(wn)):(Yn.expandByPoint(tr.min),Yn.expandByPoint(tr.max))}Yn.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)wn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(wn));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)wn.fromBufferAttribute(o,h),c&&(pa.fromBufferAttribute(e,h),wn.add(pa)),s=Math.max(s,i.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&rn('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){rn("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new P,c[R]=new P;const h=new P,d=new P,u=new P,p=new Fe,m=new Fe,x=new Fe,M=new P,g=new P;function f(R,S,b){h.fromBufferAttribute(i,R),d.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),p.fromBufferAttribute(a,R),m.fromBufferAttribute(a,S),x.fromBufferAttribute(a,b),d.sub(h),u.sub(h),m.sub(p),x.sub(p);const L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(u,-m.y).multiplyScalar(L),g.copy(u).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),o[R].add(M),o[S].add(M),o[b].add(M),c[R].add(g),c[S].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,S=y.length;R<S;++R){const b=y[R],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new P,_=new P,E=new P,T=new P;function A(R){E.fromBufferAttribute(s,R),T.copy(E);const S=o[R];v.copy(S),v.sub(E.multiplyScalar(E.dot(S))).normalize(),_.crossVectors(T,S);const L=_.dot(c[R])<0?-1:1;r.setXYZW(R,v.x,v.y,v.z,L)}for(let R=0,S=y.length;R<S;++R){const b=y[R],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const s=new P,a=new P,r=new P,o=new P,c=new P,h=new P,d=new P,u=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,M),r.fromBufferAttribute(t,g),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),a.fromBufferAttribute(t,p+1),r.fromBufferAttribute(t,p+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(p+0,d.x,d.y,d.z),i.setXYZ(p+1,d.x,d.y,d.z),i.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wn.fromBufferAttribute(e,t),wn.normalize(),e.setXYZ(t,wn.x,wn.y,wn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,u=o.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let M=0,g=c.length;M<g;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*d;for(let f=0;f<d;f++)p[x++]=h[m++]}return new Jn(p,d,u)}if(this.index===null)return gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Kt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const c=[],h=a[o];for(let d=0,u=h.length;d<u;d++){const p=h[d],m=e(p,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const h=r[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,p=h.length;u<p;u++){const m=h[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let p=0,m=u.length;p<m;p++)d.push(u[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zd=new _t,Is=new $h,fo=new Xa,Kd=new P,po=new P,mo=new P,xo=new P,Kl=new P,go=new P,Jd=new P,vo=new P;class z extends It{constructor(e=new Kt,t=new Ct){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){go.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=o[c],u=a[c];d!==0&&(Kl.fromBufferAttribute(u,e),r?go.addScaledVector(Kl,d):go.addScaledVector(Kl.sub(t),d))}t.add(go)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fo.copy(i.boundingSphere),fo.applyMatrix4(a),Is.copy(e.ray).recast(e.near),!(fo.containsPoint(Is.origin)===!1&&(Is.intersectSphere(fo,Kd)===null||Is.origin.distanceToSquared(Kd)>(e.far-e.near)**2))&&(Zd.copy(a).invert(),Is.copy(e.ray).applyMatrix4(Zd),!(i.boundingBox!==null&&Is.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Is)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,p=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],f=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=Mo(this,f,e,i,h,d,u,T,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let g=x,f=M;g<f;g+=3){const y=o.getX(g),v=o.getX(g+1),_=o.getX(g+2);s=Mo(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],f=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=_,A=_+1,R=_+2;s=Mo(this,f,e,i,h,d,u,T,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let g=x,f=M;g<f;g+=3){const y=g,v=g+1,_=g+2;s=Mo(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Lm(n,e,t,i,s,a,r,o){let c;if(e.side===In?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,e.side===Ts,o),c===null)return null;vo.copy(o),vo.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(vo);return h<t.near||h>t.far?null:{distance:h,point:vo.clone(),object:n}}function Mo(n,e,t,i,s,a,r,o,c,h){n.getVertexPosition(o,po),n.getVertexPosition(c,mo),n.getVertexPosition(h,xo);const d=Lm(n,e,t,i,po,mo,xo,Jd);if(d){const u=new P;ii.getBarycoord(Jd,po,mo,xo,u),s&&(d.uv=ii.getInterpolatedAttribute(s,o,c,h,u,new Fe)),a&&(d.uv1=ii.getInterpolatedAttribute(a,o,c,h,u,new Fe)),r&&(d.normal=ii.getInterpolatedAttribute(r,o,c,h,u,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new P,materialIndex:0};ii.getNormal(po,mo,xo,p.normal),d.face=p,d.barycoord=u}return d}class me extends Kt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],u=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new bt(h,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(u,2));function x(M,g,f,y,v,_,E,T,A,R,S){const b=_/A,L=E/R,I=_/2,V=E/2,j=T/2,te=A+1,q=R+1;let K=0,ne=0;const fe=new P;for(let ve=0;ve<q;ve++){const Ye=ve*L-V;for(let D=0;D<te;D++){const Ce=D*b-I;fe[M]=Ce*y,fe[g]=Ye*v,fe[f]=j,h.push(fe.x,fe.y,fe.z),fe[M]=0,fe[g]=0,fe[f]=T>0?1:-1,d.push(fe.x,fe.y,fe.z),u.push(D/A),u.push(1-ve/R),K+=1}}for(let ve=0;ve<R;ve++)for(let Ye=0;Ye<A;Ye++){const D=p+Ye+te*ve,Ce=p+Ye+te*(ve+1),be=p+(Ye+1)+te*(ve+1),Re=p+(Ye+1)+te*ve;c.push(D,Ce,Re),c.push(Ce,be,Re),ne+=6}o.addGroup(m,ne,S),m+=ne,p+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new me(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ba(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Vn(n){const e={};for(let t=0;t<n.length;t++){const i=Ba(n[t]);for(const s in i)e[s]=i[s]}return e}function Dm(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Of(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ft.workingColorSpace}const Ir={clone:Ba,merge:Vn};var Im=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends Rs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Im,this.fragmentShader=Um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ba(e.uniforms),this.uniformsGroups=Dm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class kf extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const hs=new P,jd=new Fe,Qd=new Fe;class $n extends kf{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Dr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Dr*2*Math.atan(Math.tan(mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){hs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hs.x,hs.y).multiplyScalar(-e/hs.z),hs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hs.x,hs.y).multiplyScalar(-e/hs.z)}getViewSize(e,t){return this.getViewBounds(e,jd,Qd),t.subVectors(Qd,jd)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(mr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ma=-90,xa=1;class Fm extends It{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $n(ma,xa,e,t);s.layers=this.layers,this.add(s);const a=new $n(ma,xa,e,t);a.layers=this.layers,this.add(a);const r=new $n(ma,xa,e,t);r.layers=this.layers,this.add(r);const o=new $n(ma,xa,e,t);o.layers=this.layers,this.add(o);const c=new $n(ma,xa,e,t);c.layers=this.layers,this.add(c);const h=new $n(ma,xa,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,c]=t;for(const h of t)this.remove(h);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===jo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,h,d]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,p,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Bf extends Un{constructor(e=[],t=Na,i,s,a,r,o,c,h,d){super(e,t,i,s,a,r,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zm extends _i{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new me(5,5,5),a=new Sn({name:"CubemapFromEquirect",uniforms:Ba(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:In,blending:Ui});a.uniforms.tEquirect.value=t;const r=new z(s,a),o=t.minFilter;return t.minFilter===Hs&&(t.minFilter=ai),new Fm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class nt extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nm={type:"move"};class Jl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),f=this._getHandJoint(h,M);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],p=d.position.distanceTo(u.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new nt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Kh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new Kh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Vf extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Om{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=hh,this.updateRanges=[],this.version=0,this.uuid=zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kn=new P;class tl{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.applyMatrix4(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.applyNormalMatrix(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.transformDirection(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array),a=qt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){el("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new Jn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new tl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){el("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class gl extends Rs{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ga;const nr=new P,va=new P,Ma=new P,_a=new Fe,ir=new Fe,Gf=new _t,_o=new P,sr=new P,yo=new P,eu=new Fe,jl=new Fe,tu=new Fe;class nl extends It{constructor(e=new gl){if(super(),this.isSprite=!0,this.type="Sprite",ga===void 0){ga=new Kt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Om(t,5);ga.setIndex([0,1,2,0,2,3]),ga.setAttribute("position",new tl(i,3,0,!1)),ga.setAttribute("uv",new tl(i,2,3,!1))}this.geometry=ga,this.material=e,this.center=new Fe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&rn('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),va.setFromMatrixScale(this.matrixWorld),Gf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ma.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&va.multiplyScalar(-Ma.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;bo(_o.set(-.5,-.5,0),Ma,r,va,s,a),bo(sr.set(.5,-.5,0),Ma,r,va,s,a),bo(yo.set(.5,.5,0),Ma,r,va,s,a),eu.set(0,0),jl.set(1,0),tu.set(1,1);let o=e.ray.intersectTriangle(_o,sr,yo,!1,nr);if(o===null&&(bo(sr.set(-.5,.5,0),Ma,r,va,s,a),jl.set(0,1),o=e.ray.intersectTriangle(_o,yo,sr,!1,nr),o===null))return;const c=e.ray.origin.distanceTo(nr);c<e.near||c>e.far||t.push({distance:c,point:nr.clone(),uv:ii.getInterpolation(nr,_o,sr,yo,eu,jl,tu,new Fe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function bo(n,e,t,i,s,a){_a.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(ir.x=a*_a.x-s*_a.y,ir.y=s*_a.x+a*_a.y):ir.copy(_a),n.copy(e),n.x+=ir.x,n.y+=ir.y,n.applyMatrix4(Gf)}class Hf extends Un{constructor(e=null,t=1,i=1,s,a,r,o,c,h=Kn,d=Kn,u,p){super(null,r,o,c,h,d,s,a,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dh extends Jn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ya=new _t,nu=new _t,wo=[],iu=new ta,km=new _t,ar=new z,rr=new Xa;class dn extends z{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,km)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ta),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ya),iu.copy(e.boundingBox).applyMatrix4(ya),this.boundingBox.union(iu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Xa),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ya),rr.copy(e.boundingSphere).applyMatrix4(ya),this.boundingSphere.union(rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(i),e.ray.intersectsSphere(rr)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,ya),nu.multiplyMatrices(i,ya),ar.matrixWorld=nu,ar.raycast(e,wo);for(let r=0,o=wo.length;r<o;r++){const c=wo[r];c.instanceId=a,c.object=this,t.push(c)}wo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new dh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Hf(new Float32Array(s*this.count),s,this.count,Bh,Li));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=o,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ql=new P,Bm=new P,Vm=new Et;class Os{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Ql.subVectors(i,t).cross(Bm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ql),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Vm.getNormalMatrix(e),s=this.coplanarPoint(Ql).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Us=new Xa,Gm=new Fe(.5,.5),So=new P;class Jh{constructor(e=new Os,t=new Os,i=new Os,s=new Os,a=new Os,r=new Os){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],h=a[3],d=a[4],u=a[5],p=a[6],m=a[7],x=a[8],M=a[9],g=a[10],f=a[11],y=a[12],v=a[13],_=a[14],E=a[15];if(s[0].setComponents(h-r,m-d,f-x,E-y).normalize(),s[1].setComponents(h+r,m+d,f+x,E+y).normalize(),s[2].setComponents(h+o,m+u,f+M,E+v).normalize(),s[3].setComponents(h-o,m-u,f-M,E-v).normalize(),i)s[4].setComponents(c,p,g,_).normalize(),s[5].setComponents(h-c,m-p,f-g,E-_).normalize();else if(s[4].setComponents(h-c,m-p,f-g,E-_).normalize(),t===Di)s[5].setComponents(h+c,m+p,f+g,E+_).normalize();else if(t===jo)s[5].setComponents(c,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Us.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Us)}intersectsSprite(e){Us.center.set(0,0,0);const t=Gm.distanceTo(e.center);return Us.radius=.7071067811865476+t,Us.applyMatrix4(e.matrixWorld),this.intersectsSphere(Us)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(So.x=s.normal.x>0?e.max.x:e.min.x,So.y=s.normal.y>0?e.max.y:e.min.y,So.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(So)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class il extends Rs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const sl=new P,al=new P,su=new _t,or=new $h,To=new Xa,ec=new P,au=new P;class uh extends It{constructor(e=new Kt,t=new il){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)sl.fromBufferAttribute(t,s-1),al.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=sl.distanceTo(al);e.setAttribute("lineDistance",new bt(i,1))}else gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),To.copy(i.boundingSphere),To.applyMatrix4(s),To.radius+=a,e.ray.intersectsSphere(To)===!1)return;su.copy(s).invert(),or.copy(e.ray).applyMatrix4(su);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,p=i.attributes.position;if(d!==null){const m=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const f=d.getX(M),y=d.getX(M+1),v=Eo(this,e,or,c,f,y,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(m),f=Eo(this,e,or,c,M,g,x-1);f&&t.push(f)}}else{const m=Math.max(0,r.start),x=Math.min(p.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const f=Eo(this,e,or,c,M,M+1,M);f&&t.push(f)}if(this.isLineLoop){const M=Eo(this,e,or,c,x-1,m,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Eo(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(sl.fromBufferAttribute(o,s),al.fromBufferAttribute(o,a),t.distanceSqToSegment(sl,al,ec,au)>i)return;ec.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(ec);if(!(h<e.near||h>e.far))return{distance:h,point:au.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const ru=new P,ou=new P;class Hm extends uh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)ru.fromBufferAttribute(t,s),ou.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ru.distanceTo(ou);e.setAttribute("lineDistance",new bt(i,1))}else gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class tn extends Un{constructor(e,t,i,s,a,r,o,c,h){super(e,t,i,s,a,r,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Wf extends Un{constructor(e,t,i=Js,s,a,r,o=Kn,c=Kn,h,d=Rr,u=1){if(d!==Rr&&d!==Pr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,a,r,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Xf extends Un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _n extends Kt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],h=new P,d=new Fe;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const m=i+u/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),r.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(r[p]/e+1)/2,d.y=(r[p+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new bt(r,3)),this.setAttribute("normal",new bt(o,3)),this.setAttribute("uv",new bt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _n(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Qe extends Kt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],p=[],m=[];let x=0;const M=[],g=i/2;let f=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new bt(u,3)),this.setAttribute("normal",new bt(p,3)),this.setAttribute("uv",new bt(m,2));function y(){const _=new P,E=new P;let T=0;const A=(t-e)/i;for(let R=0;R<=a;R++){const S=[],b=R/a,L=b*(t-e)+e;for(let I=0;I<=s;I++){const V=I/s,j=V*c+o,te=Math.sin(j),q=Math.cos(j);E.x=L*te,E.y=-b*i+g,E.z=L*q,u.push(E.x,E.y,E.z),_.set(te,A,q).normalize(),p.push(_.x,_.y,_.z),m.push(V,1-b),S.push(x++)}M.push(S)}for(let R=0;R<s;R++)for(let S=0;S<a;S++){const b=M[S][R],L=M[S+1][R],I=M[S+1][R+1],V=M[S][R+1];(e>0||S!==0)&&(d.push(b,L,V),T+=3),(t>0||S!==a-1)&&(d.push(L,I,V),T+=3)}h.addGroup(f,T,0),f+=T}function v(_){const E=x,T=new Fe,A=new P;let R=0;const S=_===!0?e:t,b=_===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,g*b,0),p.push(0,b,0),m.push(.5,.5),x++;const L=x;for(let I=0;I<=s;I++){const j=I/s*c+o,te=Math.cos(j),q=Math.sin(j);A.x=S*q,A.y=g*b,A.z=S*te,u.push(A.x,A.y,A.z),p.push(0,b,0),T.x=te*.5+.5,T.y=q*.5*b+.5,m.push(T.x,T.y),x++}for(let I=0;I<s;I++){const V=E+I,j=L+I;_===!0?d.push(j,j+1,V):d.push(j+1,j,V),R+=3}h.addGroup(f,R,_===!0?1:2),f+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ri extends Qe{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new Ri(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vl extends Kt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),h(i),d(),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(a.slice(),3)),this.setAttribute("uv",new bt(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new P,_=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],_),m(t[T+2],E),c(v,_,E,y)}function c(y,v,_,E){const T=E+1,A=[];for(let R=0;R<=T;R++){A[R]=[];const S=y.clone().lerp(_,R/T),b=v.clone().lerp(_,R/T),L=T-R;for(let I=0;I<=L;I++)I===0&&R===T?A[R][I]=S:A[R][I]=S.clone().lerp(b,I/L)}for(let R=0;R<T;R++)for(let S=0;S<2*(T-R)-1;S++){const b=Math.floor(S/2);S%2===0?(p(A[R][b+1]),p(A[R+1][b]),p(A[R][b])):(p(A[R][b+1]),p(A[R+1][b+1]),p(A[R+1][b]))}}function h(y){const v=new P;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(y),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function d(){const y=new P;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const _=g(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;r.push(_,1-E)}x(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],_=r[y+2],E=r[y+4],T=Math.max(v,_,E),A=Math.min(v,_,E);T>.9&&A<.1&&(v<.2&&(r[y+0]+=1),_<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function p(y){a.push(y.x,y.y,y.z)}function m(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){const y=new P,v=new P,_=new P,E=new P,T=new Fe,A=new Fe,R=new Fe;for(let S=0,b=0;S<a.length;S+=9,b+=6){y.set(a[S+0],a[S+1],a[S+2]),v.set(a[S+3],a[S+4],a[S+5]),_.set(a[S+6],a[S+7],a[S+8]),T.set(r[b+0],r[b+1]),A.set(r[b+2],r[b+3]),R.set(r[b+4],r[b+5]),E.copy(y).add(v).add(_).divideScalar(3);const L=g(E);M(T,b+0,y,L),M(A,b+2,v,L),M(R,b+4,_,L)}}function M(y,v,_,E){E<0&&y.x===1&&(r[v]=y.x-1),_.x===0&&_.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vl(e.vertices,e.indices,e.radius,e.details)}}class jh extends vl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new jh(e.radius,e.detail)}}class Gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){gt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,c=a-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-r,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],p=i[s+1]-d,m=(r-d)/p;return(s+m)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=t||(r.isVector2?new Fe:new P);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],a=[],r=[],o=new P,c=new _t;for(let m=0;m<=e;m++){const x=m/e;s[m]=this.getTangentAt(x,new P)}a[0]=new P,r[0]=new P;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),p<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let m=1;m<=e;m++){if(a[m]=a[m-1].clone(),r[m]=r[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(Rt(s[m-1].dot(s[m]),-1,1));a[m].applyMatrix4(c.makeRotationAxis(o,x))}r[m].crossVectors(s[m],a[m])}if(t===!0){let m=Math.acos(Rt(a[0].dot(a[e]),-1,1));m/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(m=-m);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],m*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Qh extends Gi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Fe){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=c-this.aX,m=h-this.aY;c=p*d-m*u+this.aX,h=p*u+m*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Wm extends Qh{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function ed(){let n=0,e=0,t=0,i=0;function s(a,r,o,c){n=a,e=o,t=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,h){s(r,o,h*(o-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,h,d,u){let p=(r-a)/h-(o-a)/(h+d)+(o-r)/d,m=(o-r)/d-(c-r)/(d+u)+(c-o)/u;p*=d,m*=d,s(r,o,p,m)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const Ao=new P,tc=new ed,nc=new ed,ic=new ed;class Xm extends Gi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%a]:(Ao.subVectors(s[0],s[1]).add(s[0]),h=Ao);const u=s[o%a],p=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(Ao.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=Ao),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(u),m),M=Math.pow(u.distanceToSquared(p),m),g=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),tc.initNonuniformCatmullRom(h.x,u.x,p.x,d.x,x,M,g),nc.initNonuniformCatmullRom(h.y,u.y,p.y,d.y,x,M,g),ic.initNonuniformCatmullRom(h.z,u.z,p.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(tc.initCatmullRom(h.x,u.x,p.x,d.x,this.tension),nc.initCatmullRom(h.y,u.y,p.y,d.y,this.tension),ic.initCatmullRom(h.z,u.z,p.z,d.z,this.tension));return i.set(tc.calc(c),nc.calc(c),ic.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function lu(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*o+a*n+t}function qm(n,e){const t=1-n;return t*t*e}function Ym(n,e){return 2*(1-n)*n*e}function $m(n,e){return n*n*e}function gr(n,e,t,i){return qm(n,e)+Ym(n,t)+$m(n,i)}function Zm(n,e){const t=1-n;return t*t*t*e}function Km(n,e){const t=1-n;return 3*t*t*n*e}function Jm(n,e){return 3*(1-n)*n*n*e}function jm(n,e){return n*n*n*e}function vr(n,e,t,i,s){return Zm(n,e)+Km(n,t)+Jm(n,i)+jm(n,s)}class qf extends Gi{constructor(e=new Fe,t=new Fe,i=new Fe,s=new Fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Fe){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(vr(e,s.x,a.x,r.x,o.x),vr(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Qm extends Gi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(vr(e,s.x,a.x,r.x,o.x),vr(e,s.y,a.y,r.y,o.y),vr(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Yf extends Gi{constructor(e=new Fe,t=new Fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Fe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ex extends Gi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $f extends Gi{constructor(e=new Fe,t=new Fe,i=new Fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Fe){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(gr(e,s.x,a.x,r.x),gr(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class tx extends Gi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(gr(e,s.x,a.x,r.x),gr(e,s.y,a.y,r.y),gr(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zf extends Gi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Fe){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(lu(o,c.x,h.x,d.x,u.x),lu(o,c.y,h.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Fe().fromArray(s))}return this}}var cu=Object.freeze({__proto__:null,ArcCurve:Wm,CatmullRomCurve3:Xm,CubicBezierCurve:qf,CubicBezierCurve3:Qm,EllipseCurve:Qh,LineCurve:Yf,LineCurve3:ex,QuadraticBezierCurve:$f,QuadraticBezierCurve3:tx,SplineCurve:Zf});class nx extends Gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new cu[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),h=c===0?0:1-r/c;return o.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new cu[s.type]().fromJSON(s))}return this}}class hu extends nx{constructor(e){super(),this.type="Path",this.currentPoint=new Fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Yf(this.currentPoint.clone(),new Fe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new $f(this.currentPoint.clone(),new Fe(e,t),new Fe(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new qf(this.currentPoint.clone(),new Fe(e,t),new Fe(i,s),new Fe(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Zf(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,o,c),this}absellipse(e,t,i,s,a,r,o,c){const h=new Qh(e,t,i,s,a,r,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class td extends hu{constructor(e){super(e),this.uuid=zi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new hu().fromJSON(s))}return this}}function ix(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=Kf(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,h;if(i&&(a=lx(n,e,a,t)),n.length>80*t){o=n[0],c=n[1];let d=o,u=c;for(let p=t;p<s;p+=t){const m=n[p],x=n[p+1];m<o&&(o=m),x<c&&(c=x),m>d&&(d=m),x>u&&(u=x)}h=Math.max(d-o,u-c),h=h!==0?32767/h:0}return Ur(a,r,t,o,c,h,0),r}function Kf(n,e,t,i,s){let a;if(s===Mx(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=du(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=du(r/i|0,n[r],n[r+1],a);return a&&Va(a,a.next)&&(zr(a),a=a.next),a}function js(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Va(t,t.next)||on(t.prev,t,t.next)===0)){if(zr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ur(n,e,t,i,s,a,r){if(!n)return;!r&&a&&fx(n,i,s,a);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?ax(n,i,s,a):sx(n)){e.push(c.i,n.i,h.i),zr(n),n=h.next,o=h.next;continue}if(n=h,n===o){r?r===1?(n=rx(js(n),e),Ur(n,e,t,i,s,a,2)):r===2&&ox(n,e,t,i,s,a):Ur(js(n),e,t,i,s,a,1);break}}}function sx(n){const e=n.prev,t=n,i=n.next;if(on(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),u=Math.min(o,c,h),p=Math.max(s,a,r),m=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=p&&x.y>=u&&x.y<=m&&ur(s,o,a,c,r,h,x.x,x.y)&&on(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function ax(n,e,t,i){const s=n.prev,a=n,r=n.next;if(on(s,a,r)>=0)return!1;const o=s.x,c=a.x,h=r.x,d=s.y,u=a.y,p=r.y,m=Math.min(o,c,h),x=Math.min(d,u,p),M=Math.max(o,c,h),g=Math.max(d,u,p),f=fh(m,x,e,t,i),y=fh(M,g,e,t,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=f&&_&&_.z<=y;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&ur(o,d,c,u,h,p,v.x,v.y)&&on(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&ur(o,d,c,u,h,p,_.x,_.y)&&on(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=f;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&ur(o,d,c,u,h,p,v.x,v.y)&&on(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&ur(o,d,c,u,h,p,_.x,_.y)&&on(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function rx(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Va(i,s)&&jf(i,t,t.next,s)&&Fr(i,s)&&Fr(s,i)&&(e.push(i.i,t.i,s.i),zr(t),zr(t.next),t=n=s),t=t.next}while(t!==n);return js(t)}function ox(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&xx(r,o)){let c=Qf(r,o);r=js(r,r.next),c=js(c,c.next),Ur(r,e,t,i,s,a,0),Ur(c,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function lx(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=Kf(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(mx(h))}s.sort(cx);for(let a=0;a<s.length;a++)t=hx(s[a],t);return t}function cx(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function hx(n,e){const t=dx(n,e);if(!t)return e;const i=Qf(t,n);return js(i,i.next),js(t,t.next)}function dx(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(Va(n,t))return t;do{if(Va(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&Jf(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Fr(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&ux(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function ux(n,e){return on(n.prev,n,e.prev)<0&&on(e.next,n,n.next)<0}function fx(n,e,t,i){let s=n;do s.z===0&&(s.z=fh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,px(s)}function px(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let h=0;h<t&&(o++,r=r.nextZ,!!r);h++);let c=t;for(;o>0||c>0&&r;)o!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function fh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function mx(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Jf(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function ur(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&Jf(n,e,t,i,s,a,r,o)}function xx(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!gx(n,e)&&(Fr(n,e)&&Fr(e,n)&&vx(n,e)&&(on(n.prev,n,e.prev)||on(n,e.prev,e))||Va(n,e)&&on(n.prev,n,n.next)>0&&on(e.prev,e,e.next)>0)}function on(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Va(n,e){return n.x===e.x&&n.y===e.y}function jf(n,e,t,i){const s=Ro(on(n,e,t)),a=Ro(on(n,e,i)),r=Ro(on(t,i,n)),o=Ro(on(t,i,e));return!!(s!==a&&r!==o||s===0&&Co(n,t,e)||a===0&&Co(n,i,e)||r===0&&Co(t,n,i)||o===0&&Co(t,e,i))}function Co(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ro(n){return n>0?1:n<0?-1:0}function gx(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&jf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Fr(n,e){return on(n.prev,n,n.next)<0?on(n,e,n.next)>=0&&on(n,n.prev,e)>=0:on(n,e,n.prev)<0||on(n,n.next,e)<0}function vx(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Qf(n,e){const t=ph(n.i,n.x,n.y),i=ph(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function du(n,e,t,i){const s=ph(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function zr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ph(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mx(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class _x{static triangulate(e,t,i=2){return ix(e,t,i)}}class Mr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return Mr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];uu(e),fu(i,e);let r=e.length;t.forEach(uu);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,fu(i,t[c]);const o=_x.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function uu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function fu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class nd extends vl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new nd(e.radius,e.detail)}}class Yt extends Kt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,u=e/o,p=t/c,m=[],x=[],M=[],g=[];for(let f=0;f<d;f++){const y=f*p-r;for(let v=0;v<h;v++){const _=v*u-a;x.push(_,-y,0),M.push(0,0,1),g.push(v/o),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){const v=y+h*f,_=y+h*(f+1),E=y+1+h*(f+1),T=y+1+h*f;m.push(v,_,T),m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ml extends Kt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let u=e;const p=(t-e)/s,m=new P,x=new Fe;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const f=a+g/i*r;m.x=u*Math.cos(f),m.y=u*Math.sin(f),c.push(m.x,m.y,m.z),h.push(0,0,1),x.x=(m.x/t+1)/2,x.y=(m.y/t+1)/2,d.push(x.x,x.y)}u+=p}for(let M=0;M<s;M++){const g=M*(i+1);for(let f=0;f<i;f++){const y=f+g,v=y,_=y+i+1,E=y+i+2,T=y+1;o.push(v,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new bt(c,3)),this.setAttribute("normal",new bt(h,3)),this.setAttribute("uv",new bt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ml(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class _l extends Kt{constructor(e=new td([new Fe(0,.5),new Fe(-.5,-.5),new Fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(a,3)),this.setAttribute("uv",new bt(r,2));function h(d){const u=s.length/3,p=d.extractPoints(t);let m=p.shape;const x=p.holes;Mr.isClockWise(m)===!1&&(m=m.reverse());for(let g=0,f=x.length;g<f;g++){const y=x[g];Mr.isClockWise(y)===!0&&(x[g]=y.reverse())}const M=Mr.triangulateShape(m,x);for(let g=0,f=x.length;g<f;g++){const y=x[g];m=m.concat(y)}for(let g=0,f=m.length;g<f;g++){const y=m[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,f=M.length;g<f;g++){const y=M[g],v=y[0]+u,_=y[1]+u,E=y[2]+u;i.push(v,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return yx(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new _l(i,e.curveSegments)}}function yx(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Wt extends Kt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let h=0;const d=[],u=new P,p=new P,m=[],x=[],M=[],g=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let _=0;f===0&&r===0?_=.5/t:f===i&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*a)*Math.sin(r+v*o),u.y=e*Math.cos(r+v*o),u.z=e*Math.sin(s+T*a)*Math.sin(r+v*o),x.push(u.x,u.y,u.z),p.copy(u).normalize(),M.push(p.x,p.y,p.z),g.push(T+_,1-v),y.push(h++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],_=d[f][y],E=d[f+1][y],T=d[f+1][y+1];(f!==0||r>0)&&m.push(v,_,T),(f!==i-1||c<Math.PI)&&m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Es extends Kt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],h=[],d=new P,u=new P,p=new P;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const M=x/s*a,g=m/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(M),u.y=(e+t*Math.cos(g))*Math.sin(M),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/s),h.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const M=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,f=(s+1)*(m-1)+x,y=(s+1)*m+x;r.push(M,g,y),r.push(g,f,y)}this.setIndex(r),this.setAttribute("position",new bt(o,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Es(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class bx extends Sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Rs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xh,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wx extends Rs{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xh,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Sx extends Rs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Tx extends Rs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class id extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ex extends id{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const sc=new _t,pu=new P,mu=new P;class e0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=Vi,this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jh,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new $t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;pu.setFromMatrixPosition(e.matrixWorld),t.position.copy(pu),mu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mu),t.updateMatrixWorld(),sc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(sc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const xu=new _t,lr=new P,ac=new P;class Ax extends e0{constructor(){super(new $n(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Fe(4,2),this._viewportCount=6,this._viewports=[new $t(2,1,1,1),new $t(0,1,1,1),new $t(3,1,1,1),new $t(1,1,1,1),new $t(3,0,1,1),new $t(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),lr.setFromMatrixPosition(e.matrixWorld),i.position.copy(lr),ac.copy(i.position),ac.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(ac),i.updateMatrixWorld(),s.makeTranslation(-lr.x,-lr.y,-lr.z),xu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xu,i.coordinateSystem,i.reversedDepth)}}class sd extends id{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ax}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class ad extends kf{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Cx extends e0{constructor(){super(new ad(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rc extends id{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new Cx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Rx extends $n{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class t0{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const gu=new _t;class Px{constructor(e,t,i=0,s=1/0){this.ray=new $h(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Zh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):rn("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return gu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gu),this}intersectObject(e,t=!0,i=[]){return mh(e,this,i,t),i.sort(vu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)mh(e[s],this,i,t);return i.sort(vu),i}}function vu(n,e){return n.distance-e.distance}function mh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)mh(a[r],e,t,!0)}}function Mu(n,e,t,i){const s=Lx(i);switch(t){case Pf:return n*e;case Bh:return n*e/s.components*s.byteLength;case Vh:return n*e/s.components*s.byteLength;case Gh:return n*e*2/s.components*s.byteLength;case Hh:return n*e*2/s.components*s.byteLength;case Lf:return n*e*3/s.components*s.byteLength;case vi:return n*e*4/s.components*s.byteLength;case Wh:return n*e*4/s.components*s.byteLength;case Go:case Ho:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wo:case Xo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nc:case kc:return Math.max(n,16)*Math.max(e,8)/4;case zc:case Oc:return Math.max(n,8)*Math.max(e,8)/2;case Bc:case Vc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Gc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Hc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Xc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case $c:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Zc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Kc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Jc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case jc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case eh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case th:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case nh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ih:case sh:case ah:return Math.ceil(n/4)*Math.ceil(e/4)*16;case rh:case oh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case lh:case ch:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Lx(n){switch(n){case Vi:case Ef:return{byteLength:1,components:1};case Ar:case Af:case Fi:return{byteLength:2,components:1};case Oh:case kh:return{byteLength:2,components:4};case Js:case Nh:case Li:return{byteLength:4,components:1};case Cf:case Rf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uh}}));typeof window<"u"&&(window.__THREE__?gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uh);function n0(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Dx(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,u=h.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,h,d),o.onUploadCallback();let m;if(h instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)m=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=n.SHORT;else if(h instanceof Uint32Array)m=n.UNSIGNED_INT;else if(h instanceof Int32Array)m=n.INT;else if(h instanceof Int8Array)m=n.BYTE;else if(h instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){const d=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,d);else{u.sort((m,x)=>m.start-x.start);let p=0;for(let m=1;m<u.length;m++){const x=u[p],M=u[m];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++p,u[p]=M)}u.length=p+1;for(let m=0,x=u.length;m<x;m++){const M=u[m];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:a,update:r}}var Ix=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ux=`#ifdef USE_ALPHAHASH
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
#endif`,Fx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ox=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kx=`#ifdef USE_AOMAP
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
#endif`,Bx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vx=`#ifdef USE_BATCHING
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
#endif`,Gx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qx=`#ifdef USE_IRIDESCENCE
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
#endif`,Yx=`#ifdef USE_BUMPMAP
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
#endif`,$x=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,tg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ng=`#define PI 3.141592653589793
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
} // validated`,ig=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sg=`vec3 transformedNormal = objectNormal;
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
#endif`,ag=`#ifdef USE_DISPLACEMENTMAP
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
#endif`,lg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cg="gl_FragColor = linearToOutputTexel( gl_FragColor );",hg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dg=`#ifdef USE_ENVMAP
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
#endif`,pg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mg=`#ifdef USE_ENVMAP
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
#endif`,xg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_g=`#ifdef USE_GRADIENTMAP
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
}`,yg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
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
#endif`,Tg=`#ifdef USE_ENVMAP
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
#endif`,Eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cg=`BlinnPhongMaterial material;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pg=`PhysicalMaterial material;
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
#endif`,Lg=`uniform sampler2D dfgLUT;
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
}`,Dg=`
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
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ug=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gg=`#if defined( USE_POINTS_UV )
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
#endif`,Hg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$g=`#ifdef USE_MORPHTARGETS
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
#endif`,Kg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
#endif`,jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,t1=`#ifdef USE_NORMALMAP
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
#endif`,n1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,i1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,s1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,a1=`#ifdef USE_IRIDESCENCEMAP
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
}`,l1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,c1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,h1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,d1=`#ifdef DITHERING
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
#endif`,p1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,m1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,x1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
}`,v1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,M1=`#ifdef USE_SKINNING
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
#endif`,_1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,y1=`#ifdef USE_SKINNING
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
#endif`,b1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,w1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,S1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,T1=`#ifndef saturate
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
#endif`,A1=`#ifdef USE_TRANSMISSION
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
#endif`,C1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,L1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const D1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,I1=`uniform sampler2D t2D;
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
}`,U1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,F1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,z1=`varying vec3 vWorldDirection;
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
}`,O1=`#include <common>
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
}`,k1=`#if DEPTH_PACKING == 3200
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
}`,B1=`#define DISTANCE
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
}`,V1=`#define DISTANCE
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
}`,G1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,H1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W1=`uniform float scale;
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
}`,X1=`uniform vec3 diffuse;
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
}`,q1=`#include <common>
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
}`,Y1=`uniform vec3 diffuse;
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
}`,$1=`#define LAMBERT
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
}`,K1=`#define MATCAP
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
}`,j1=`#define NORMAL
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
}`,Q1=`#define NORMAL
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
}`,e2=`#define PHONG
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
}`,t2=`#define PHONG
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
}`,n2=`#define STANDARD
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
}`,i2=`#define STANDARD
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
}`,s2=`#define TOON
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
}`,a2=`#define TOON
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
}`,r2=`uniform float size;
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
}`,o2=`uniform vec3 diffuse;
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
}`,l2=`#include <common>
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
}`,c2=`uniform vec3 color;
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
}`,h2=`uniform float rotation;
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
}`,d2=`uniform vec3 diffuse;
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
}`,At={alphahash_fragment:Ix,alphahash_pars_fragment:Ux,alphamap_fragment:Fx,alphamap_pars_fragment:zx,alphatest_fragment:Nx,alphatest_pars_fragment:Ox,aomap_fragment:kx,aomap_pars_fragment:Bx,batching_pars_vertex:Vx,batching_vertex:Gx,begin_vertex:Hx,beginnormal_vertex:Wx,bsdfs:Xx,iridescence_fragment:qx,bumpmap_pars_fragment:Yx,clipping_planes_fragment:$x,clipping_planes_pars_fragment:Zx,clipping_planes_pars_vertex:Kx,clipping_planes_vertex:Jx,color_fragment:jx,color_pars_fragment:Qx,color_pars_vertex:eg,color_vertex:tg,common:ng,cube_uv_reflection_fragment:ig,defaultnormal_vertex:sg,displacementmap_pars_vertex:ag,displacementmap_vertex:rg,emissivemap_fragment:og,emissivemap_pars_fragment:lg,colorspace_fragment:cg,colorspace_pars_fragment:hg,envmap_fragment:dg,envmap_common_pars_fragment:ug,envmap_pars_fragment:fg,envmap_pars_vertex:pg,envmap_physical_pars_fragment:Tg,envmap_vertex:mg,fog_vertex:xg,fog_pars_vertex:gg,fog_fragment:vg,fog_pars_fragment:Mg,gradientmap_pars_fragment:_g,lightmap_pars_fragment:yg,lights_lambert_fragment:bg,lights_lambert_pars_fragment:wg,lights_pars_begin:Sg,lights_toon_fragment:Eg,lights_toon_pars_fragment:Ag,lights_phong_fragment:Cg,lights_phong_pars_fragment:Rg,lights_physical_fragment:Pg,lights_physical_pars_fragment:Lg,lights_fragment_begin:Dg,lights_fragment_maps:Ig,lights_fragment_end:Ug,logdepthbuf_fragment:Fg,logdepthbuf_pars_fragment:zg,logdepthbuf_pars_vertex:Ng,logdepthbuf_vertex:Og,map_fragment:kg,map_pars_fragment:Bg,map_particle_fragment:Vg,map_particle_pars_fragment:Gg,metalnessmap_fragment:Hg,metalnessmap_pars_fragment:Wg,morphinstance_vertex:Xg,morphcolor_vertex:qg,morphnormal_vertex:Yg,morphtarget_pars_vertex:$g,morphtarget_vertex:Zg,normal_fragment_begin:Kg,normal_fragment_maps:Jg,normal_pars_fragment:jg,normal_pars_vertex:Qg,normal_vertex:e1,normalmap_pars_fragment:t1,clearcoat_normal_fragment_begin:n1,clearcoat_normal_fragment_maps:i1,clearcoat_pars_fragment:s1,iridescence_pars_fragment:a1,opaque_fragment:r1,packing:o1,premultiplied_alpha_fragment:l1,project_vertex:c1,dithering_fragment:h1,dithering_pars_fragment:d1,roughnessmap_fragment:u1,roughnessmap_pars_fragment:f1,shadowmap_pars_fragment:p1,shadowmap_pars_vertex:m1,shadowmap_vertex:x1,shadowmask_pars_fragment:g1,skinbase_vertex:v1,skinning_pars_vertex:M1,skinning_vertex:_1,skinnormal_vertex:y1,specularmap_fragment:b1,specularmap_pars_fragment:w1,tonemapping_fragment:S1,tonemapping_pars_fragment:T1,transmission_fragment:E1,transmission_pars_fragment:A1,uv_pars_fragment:C1,uv_pars_vertex:R1,uv_vertex:P1,worldpos_vertex:L1,background_vert:D1,background_frag:I1,backgroundCube_vert:U1,backgroundCube_frag:F1,cube_vert:z1,cube_frag:N1,depth_vert:O1,depth_frag:k1,distanceRGBA_vert:B1,distanceRGBA_frag:V1,equirect_vert:G1,equirect_frag:H1,linedashed_vert:W1,linedashed_frag:X1,meshbasic_vert:q1,meshbasic_frag:Y1,meshlambert_vert:$1,meshlambert_frag:Z1,meshmatcap_vert:K1,meshmatcap_frag:J1,meshnormal_vert:j1,meshnormal_frag:Q1,meshphong_vert:e2,meshphong_frag:t2,meshphysical_vert:n2,meshphysical_frag:i2,meshtoon_vert:s2,meshtoon_frag:a2,points_vert:r2,points_frag:o2,shadow_vert:l2,shadow_frag:c2,sprite_vert:h2,sprite_frag:d2},He={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Et},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Et}},envmap:{envMap:{value:null},envMapRotation:{value:new Et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Et},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0},uvTransform:{value:new Et}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Et},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0}}},Ai={basic:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:At.meshbasic_vert,fragmentShader:At.meshbasic_frag},lambert:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:At.meshlambert_vert,fragmentShader:At.meshlambert_frag},phong:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:At.meshphong_vert,fragmentShader:At.meshphong_frag},standard:{uniforms:Vn([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag},toon:{uniforms:Vn([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:At.meshtoon_vert,fragmentShader:At.meshtoon_frag},matcap:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:At.meshmatcap_vert,fragmentShader:At.meshmatcap_frag},points:{uniforms:Vn([He.points,He.fog]),vertexShader:At.points_vert,fragmentShader:At.points_frag},dashed:{uniforms:Vn([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:At.linedashed_vert,fragmentShader:At.linedashed_frag},depth:{uniforms:Vn([He.common,He.displacementmap]),vertexShader:At.depth_vert,fragmentShader:At.depth_frag},normal:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:At.meshnormal_vert,fragmentShader:At.meshnormal_frag},sprite:{uniforms:Vn([He.sprite,He.fog]),vertexShader:At.sprite_vert,fragmentShader:At.sprite_frag},background:{uniforms:{uvTransform:{value:new Et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:At.background_vert,fragmentShader:At.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Et}},vertexShader:At.backgroundCube_vert,fragmentShader:At.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:At.cube_vert,fragmentShader:At.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:At.equirect_vert,fragmentShader:At.equirect_frag},distanceRGBA:{uniforms:Vn([He.common,He.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:At.distanceRGBA_vert,fragmentShader:At.distanceRGBA_frag},shadow:{uniforms:Vn([He.lights,He.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:At.shadow_vert,fragmentShader:At.shadow_frag}};Ai.physical={uniforms:Vn([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Et},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Et},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Et},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Et},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Et},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Et}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag};const Po={r:0,b:0,g:0},Fs=new yi,u2=new _t;function f2(n,e,t,i,s,a,r){const o=new rt(0);let c=a===!0?0:1,h,d,u=null,p=0,m=null;function x(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function M(v){let _=!1;const E=x(v);E===null?f(o,c):E&&E.isColor&&(f(E,1),_=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,_){const E=x(_);E&&(E.isCubeTexture||E.mapping===xl)?(d===void 0&&(d=new z(new me(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:Ba(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Fs.copy(_.backgroundRotation),Fs.x*=-1,Fs.y*=-1,Fs.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Fs.y*=-1,Fs.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(u2.makeRotationFromEuler(Fs)),d.material.toneMapped=Ft.getTransfer(E.colorSpace)!==Xt,(u!==E||p!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,p=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new z(new Yt(2,2),new Sn({name:"BackgroundMaterial",uniforms:Ba(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:Ts,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=Ft.getTransfer(E.colorSpace)!==Xt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||p!==E.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,p=E.version,m=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function f(v,_){v.getRGB(Po,Of(n)),i.buffers.color.setClear(Po.r,Po.g,Po.b,_,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),c=_,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(o,c)},render:M,addToRenderList:g,dispose:y}}function p2(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let a=s,r=!1;function o(b,L,I,V,j){let te=!1;const q=u(V,I,L);a!==q&&(a=q,h(a.object)),te=m(b,V,I,j),te&&x(b,V,I,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(te||r)&&(r=!1,_(b,L,I,V),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,L,I){const V=I.wireframe===!0;let j=i[b.id];j===void 0&&(j={},i[b.id]=j);let te=j[L.id];te===void 0&&(te={},j[L.id]=te);let q=te[V];return q===void 0&&(q=p(c()),te[V]=q),q}function p(b){const L=[],I=[],V=[];for(let j=0;j<t;j++)L[j]=0,I[j]=0,V[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:I,attributeDivisors:V,object:b,attributes:{},index:null}}function m(b,L,I,V){const j=a.attributes,te=L.attributes;let q=0;const K=I.getAttributes();for(const ne in K)if(K[ne].location>=0){const ve=j[ne];let Ye=te[ne];if(Ye===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(Ye=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(Ye=b.instanceColor)),ve===void 0||ve.attribute!==Ye||Ye&&ve.data!==Ye.data)return!0;q++}return a.attributesNum!==q||a.index!==V}function x(b,L,I,V){const j={},te=L.attributes;let q=0;const K=I.getAttributes();for(const ne in K)if(K[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const Ye={};Ye.attribute=ve,ve&&ve.data&&(Ye.data=ve.data),j[ne]=Ye,q++}a.attributes=j,a.attributesNum=q,a.index=V}function M(){const b=a.newAttributes;for(let L=0,I=b.length;L<I;L++)b[L]=0}function g(b){f(b,0)}function f(b,L){const I=a.newAttributes,V=a.enabledAttributes,j=a.attributeDivisors;I[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),j[b]!==L&&(n.vertexAttribDivisor(b,L),j[b]=L)}function y(){const b=a.newAttributes,L=a.enabledAttributes;for(let I=0,V=L.length;I<V;I++)L[I]!==b[I]&&(n.disableVertexAttribArray(I),L[I]=0)}function v(b,L,I,V,j,te,q){q===!0?n.vertexAttribIPointer(b,L,I,j,te):n.vertexAttribPointer(b,L,I,V,j,te)}function _(b,L,I,V){M();const j=V.attributes,te=I.getAttributes(),q=L.defaultAttributeValues;for(const K in te){const ne=te[K];if(ne.location>=0){let fe=j[K];if(fe===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(fe=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(fe=b.instanceColor)),fe!==void 0){const ve=fe.normalized,Ye=fe.itemSize,D=e.get(fe);if(D===void 0)continue;const Ce=D.buffer,be=D.type,Re=D.bytesPerElement,$=be===n.INT||be===n.UNSIGNED_INT||fe.gpuType===Nh;if(fe.isInterleavedBufferAttribute){const Z=fe.data,we=Z.stride,Pe=fe.offset;if(Z.isInstancedInterleavedBuffer){for(let ke=0;ke<ne.locationSize;ke++)f(ne.location+ke,Z.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ke=0;ke<ne.locationSize;ke++)g(ne.location+ke);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let ke=0;ke<ne.locationSize;ke++)v(ne.location+ke,Ye/ne.locationSize,be,ve,we*Re,(Pe+Ye/ne.locationSize*ke)*Re,$)}else{if(fe.isInstancedBufferAttribute){for(let Z=0;Z<ne.locationSize;Z++)f(ne.location+Z,fe.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Z=0;Z<ne.locationSize;Z++)g(ne.location+Z);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let Z=0;Z<ne.locationSize;Z++)v(ne.location+Z,Ye/ne.locationSize,be,ve,Ye*Re,Ye/ne.locationSize*Z*Re,$)}}else if(q!==void 0){const ve=q[K];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){R();for(const b in i){const L=i[b];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b.id]}function A(b){for(const L in i){const I=i[L];if(I[b.id]===void 0)continue;const V=I[b.id];for(const j in V)d(V[j].object),delete V[j];delete I[b.id]}}function R(){S(),r=!0,a!==s&&(a=s,h(a.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:S,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:g,disableUnusedAttributes:y}}function m2(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,u){u!==0&&(n.drawArraysInstanced(i,h,d,u),t.update(d,i,u))}function o(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=d[x];t.update(m,i,1)}function c(h,d,u,p){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)r(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,d,0,p,0,u);let x=0;for(let M=0;M<u;M++)x+=d[M]*p[M];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function x2(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==vi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Fi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Vi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Li&&!R)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(gt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function g2(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Os,o=new Et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const m=u.length!==0||p||i!==0||s;return s=p,i=u.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,p){t=d(u,p,0)},this.setState=function(u,p,m){const x=u.clippingPlanes,M=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let _=f.clippingState||null;c.value=_,_=d(x,p,v,m);for(let E=0;E!==v;++E)_[E]=t[E];f.clippingState=_,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,p,m,x){const M=u!==null?u.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const f=m+M*4,y=p.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,_=m;v!==M;++v,_+=4)r.copy(u[v]).applyMatrix4(y,o),r.normal.toArray(g,_),g[_+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function v2(n){let e=new WeakMap;function t(r,o){return o===Ic?r.mapping=Na:o===Uc&&(r.mapping=Oa),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Ic||o===Uc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new zm(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const Ms=4,_u=[.125,.215,.35,.446,.526,.582],Gs=20,M2=512,cr=new ad,yu=new rt;let oc=null,lc=0,cc=0,hc=!1;const _2=new P;class xh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=_2}=a;oc=this._renderer.getRenderTarget(),lc=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(oc,lc,cc),this._renderer.xr.enabled=hc,e.scissorTest=!1,ba(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Na||e.mapping===Oa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oc=this._renderer.getRenderTarget(),lc=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ai,minFilter:ai,generateMipmaps:!1,type:Fi,format:vi,colorSpace:ka,depthBuffer:!1},s=bu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bu(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=y2(a)),this._blurMaterial=w2(a,e,t)}return s}_compileMaterial(e){const t=new z(new Kt,e);this._renderer.compile(t,cr)}_sceneToCubeUV(e,t,i,s,a){const c=new $n(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,m=u.toneMapping;u.getClearColor(yu),u.toneMapping=bs,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new z(new me,new Ct({name:"PMREM.Background",side:In,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let f=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,f=!0):(g.color.copy(yu),f=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):_===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;ba(s,_*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(M,c),u.render(e,c)}u.toneMapping=m,u.autoClear=p,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Na||e.mapping===Oa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Su()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wu());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;ba(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,cr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=b2(this._lodMax,y,v)}const r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-d*d),p=.05+h*.95,m=u*p,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-Ms?i-x+Ms:0),f=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,ba(a,g,f,3*M,2*M),s.setRenderTarget(a),s.render(o,cr),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,ba(e,g,f,3*M,2*M),s.setRenderTarget(e),s.render(o,cr)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&rn("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=h;const p=h.uniforms,m=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Gs-1),M=a/x,g=isFinite(a)?1+Math.floor(d*M):Gs;g>Gs&&gt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Gs}`);const f=[];let y=0;for(let A=0;A<Gs;++A){const R=A/M,S=Math.exp(-R*R/2);f.push(S),A===0?y+=S:A<g&&(y+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/y;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=f,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const _=this._sizeLods[s],E=3*_*(s>v-Ms?s-v+Ms:0),T=4*(this._cubeSize-_);ba(t,E,T,3*_,2*_),c.setRenderTarget(t),c.render(u,cr)}}function y2(n){const e=[],t=[],i=[];let s=n;const a=n-Ms+1+_u.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-Ms?c=_u[r-n+Ms-1]:r===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,u=1+h,p=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,x=6,M=3,g=2,f=1,y=new Float32Array(M*x*m),v=new Float32Array(g*x*m),_=new Float32Array(f*x*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,R=T>2?0:-1,S=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(S,M*x*T),v.set(p,g*x*T);const b=[T,T,T,T,T,T];_.set(b,f*x*T)}const E=new Kt;E.setAttribute("position",new Jn(y,M)),E.setAttribute("uv",new Jn(v,g)),E.setAttribute("faceIndex",new Jn(_,f)),i.push(new z(E,null)),s>Ms&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function bu(n,e,t){const i=new _i(n,e,t);return i.texture.mapping=xl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ba(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function b2(n,e,t){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:M2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:yl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function w2(n,e,t){const i=new Float32Array(Gs),s=new P(0,1,0);return new Sn({name:"SphericalGaussianBlur",defines:{n:Gs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:yl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function wu(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function Su(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function yl(){return`

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
	`}function S2(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===Ic||c===Uc,d=c===Na||c===Oa;if(h||d){let u=e.get(o);const p=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new xh(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return h&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new xh(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function a(o){const c=o.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function T2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Lr("WebGLRenderer: "+i+" extension not supported."),s}}}function E2(n,e,t,i){const s={},a=new WeakMap;function r(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",r),delete s[p.id];const m=a.get(p);m&&(e.remove(m),a.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function h(u){const p=[],m=u.index,x=u.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],T=y[v+1],A=y[v+2];p.push(E,T,T,A,A,E)}}else if(x!==void 0){const y=x.array;M=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,T=v+1,A=v+2;p.push(E,T,T,A,A,E)}}else return;const g=new(If(p)?Nf:zf)(p,1);g.version=M;const f=a.get(u);f&&e.remove(f),a.set(u,g)}function d(u){const p=a.get(u);if(p){const m=u.index;m!==null&&p.version<m.version&&h(u)}else h(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function A2(n,e,t){let i;function s(p){i=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,m){n.drawElements(i,m,a,p*r),t.update(m,i,1)}function h(p,m,x){x!==0&&(n.drawElementsInstanced(i,m,a,p*r,x),t.update(m,i,x))}function d(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,a,p,0,x);let g=0;for(let f=0;f<x;f++)g+=m[f];t.update(g,i,1)}function u(p,m,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<p.length;f++)h(p[f]/r,m[f],M[f]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,a,p,0,M,0,x);let f=0;for(let y=0;y<x;y++)f+=m[y]*M[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function C2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:rn("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function R2(n,e,t){const i=new WeakMap,s=new $t;function a(r,o,c){const h=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let p=i.get(o);if(p===void 0||p.count!==u){let b=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;p!==void 0&&p.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;x===!0&&(_=1),M===!0&&(_=2),g===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*u),R=new Uf(A,E,T,u);R.type=Li,R.needsUpdate=!0;const S=_*4;for(let L=0;L<u;L++){const I=f[L],V=y[L],j=v[L],te=E*T*4*L;for(let q=0;q<I.count;q++){const K=q*S;x===!0&&(s.fromBufferAttribute(I,q),A[te+K+0]=s.x,A[te+K+1]=s.y,A[te+K+2]=s.z,A[te+K+3]=0),M===!0&&(s.fromBufferAttribute(V,q),A[te+K+4]=s.x,A[te+K+5]=s.y,A[te+K+6]=s.z,A[te+K+7]=0),g===!0&&(s.fromBufferAttribute(j,q),A[te+K+8]=s.x,A[te+K+9]=s.y,A[te+K+10]=s.z,A[te+K+11]=j.itemSize===4?s.w:1)}}p={count:u,texture:R,size:new Fe(E,T)},i.set(o,p),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:a}}function P2(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return u}function r(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const i0=new Un,Tu=new Wf(1,1),s0=new Uf,a0=new _m,r0=new Bf,Eu=[],Au=[],Cu=new Float32Array(16),Ru=new Float32Array(9),Pu=new Float32Array(4);function qa(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Eu[s];if(a===void 0&&(a=new Float32Array(s),Eu[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function yn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function bl(n,e){let t=Au[e];t===void 0&&(t=new Int32Array(e),Au[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function L2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function D2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2fv(this.addr,e),bn(t,e)}}function I2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;n.uniform3fv(this.addr,e),bn(t,e)}}function U2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4fv(this.addr,e),bn(t,e)}}function F2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Pu.set(i),n.uniformMatrix2fv(this.addr,!1,Pu),bn(t,i)}}function z2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Ru.set(i),n.uniformMatrix3fv(this.addr,!1,Ru),bn(t,i)}}function N2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Cu.set(i),n.uniformMatrix4fv(this.addr,!1,Cu),bn(t,i)}}function O2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function k2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2iv(this.addr,e),bn(t,e)}}function B2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3iv(this.addr,e),bn(t,e)}}function V2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4iv(this.addr,e),bn(t,e)}}function G2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function H2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2uiv(this.addr,e),bn(t,e)}}function W2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3uiv(this.addr,e),bn(t,e)}}function X2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4uiv(this.addr,e),bn(t,e)}}function q2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Tu.compareFunction=Df,a=Tu):a=i0,t.setTexture2D(e||a,s)}function Y2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||a0,s)}function $2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||r0,s)}function Z2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||s0,s)}function K2(n){switch(n){case 5126:return L2;case 35664:return D2;case 35665:return I2;case 35666:return U2;case 35674:return F2;case 35675:return z2;case 35676:return N2;case 5124:case 35670:return O2;case 35667:case 35671:return k2;case 35668:case 35672:return B2;case 35669:case 35673:return V2;case 5125:return G2;case 36294:return H2;case 36295:return W2;case 36296:return X2;case 35678:case 36198:case 36298:case 36306:case 35682:return q2;case 35679:case 36299:case 36307:return Y2;case 35680:case 36300:case 36308:case 36293:return $2;case 36289:case 36303:case 36311:case 36292:return Z2}}function J2(n,e){n.uniform1fv(this.addr,e)}function j2(n,e){const t=qa(e,this.size,2);n.uniform2fv(this.addr,t)}function Q2(n,e){const t=qa(e,this.size,3);n.uniform3fv(this.addr,t)}function ev(n,e){const t=qa(e,this.size,4);n.uniform4fv(this.addr,t)}function tv(n,e){const t=qa(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function nv(n,e){const t=qa(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function iv(n,e){const t=qa(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function sv(n,e){n.uniform1iv(this.addr,e)}function av(n,e){n.uniform2iv(this.addr,e)}function rv(n,e){n.uniform3iv(this.addr,e)}function ov(n,e){n.uniform4iv(this.addr,e)}function lv(n,e){n.uniform1uiv(this.addr,e)}function cv(n,e){n.uniform2uiv(this.addr,e)}function hv(n,e){n.uniform3uiv(this.addr,e)}function dv(n,e){n.uniform4uiv(this.addr,e)}function uv(n,e,t){const i=this.cache,s=e.length,a=bl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||i0,a[r])}function fv(n,e,t){const i=this.cache,s=e.length,a=bl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||a0,a[r])}function pv(n,e,t){const i=this.cache,s=e.length,a=bl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||r0,a[r])}function mv(n,e,t){const i=this.cache,s=e.length,a=bl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||s0,a[r])}function xv(n){switch(n){case 5126:return J2;case 35664:return j2;case 35665:return Q2;case 35666:return ev;case 35674:return tv;case 35675:return nv;case 35676:return iv;case 5124:case 35670:return sv;case 35667:case 35671:return av;case 35668:case 35672:return rv;case 35669:case 35673:return ov;case 5125:return lv;case 36294:return cv;case 36295:return hv;case 36296:return dv;case 35678:case 36198:case 36298:case 36306:case 35682:return uv;case 35679:case 36299:case 36307:return fv;case 35680:case 36300:case 36308:case 36293:return pv;case 36289:case 36303:case 36311:case 36292:return mv}}class gv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=K2(t.type)}}class vv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xv(t.type)}}class Mv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const dc=/(\w+)(\])?(\[|\.)?/g;function Lu(n,e){n.seq.push(e),n.map[e.id]=e}function _v(n,e,t){const i=n.name,s=i.length;for(dc.lastIndex=0;;){const a=dc.exec(i),r=dc.lastIndex;let o=a[1];const c=a[2]==="]",h=a[3];if(c&&(o=o|0),h===void 0||h==="["&&r+2===s){Lu(t,h===void 0?new gv(o,n,e):new vv(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Mv(o),Lu(t,u)),t=u}}}class qo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);_v(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Du(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const yv=37297;let bv=0;function wv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Iu=new Et;function Sv(n){Ft._getMatrix(Iu,Ft.workingColorSpace,n);const e=`mat3( ${Iu.elements.map(t=>t.toFixed(4))} )`;switch(Ft.getTransfer(n)){case Jo:return[e,"LinearTransferOETF"];case Xt:return[e,"sRGBTransferOETF"];default:return gt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Uu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+wv(n.getShaderSource(e),o)}else return a}function Tv(n,e){const t=Sv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ev(n,e){let t;switch(e){case Mf:t="Linear";break;case _f:t="Reinhard";break;case yf:t="Cineon";break;case zh:t="ACESFilmic";break;case wf:t="AgX";break;case Sf:t="Neutral";break;case bf:t="Custom";break;default:gt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Lo=new P;function Av(){Ft.getLuminanceCoefficients(Lo);const n=Lo.x.toFixed(4),e=Lo.y.toFixed(4),t=Lo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fr).join(`
`)}function Rv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Pv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function fr(n){return n!==""}function Fu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function zu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Lv=/^[ \t]*#include +<([\w\d./]+)>/gm;function gh(n){return n.replace(Lv,Iv)}const Dv=new Map;function Iv(n,e){let t=At[e];if(t===void 0){const i=Dv.get(e);if(i!==void 0)t=At[i],gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return gh(t)}const Uv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nu(n){return n.replace(Uv,Fv)}function Fv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Ou(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function zv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===gf?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===vf?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ji&&(e="SHADOWMAP_TYPE_VSM"),e}function Nv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Na:case Oa:e="ENVMAP_TYPE_CUBE";break;case xl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ov(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Oa&&(e="ENVMAP_MODE_REFRACTION"),e}function kv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Fh:e="ENVMAP_BLENDING_MULTIPLY";break;case Op:e="ENVMAP_BLENDING_MIX";break;case kp:e="ENVMAP_BLENDING_ADD";break}return e}function Bv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Vv(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=zv(t),h=Nv(t),d=Ov(t),u=kv(t),p=Bv(t),m=Cv(t),x=Rv(a),M=s.createProgram();let g,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(fr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(fr).join(`
`),f.length>0&&(f+=`
`)):(g=[Ou(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fr).join(`
`),f=[Ou(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bs?"#define TONE_MAPPING":"",t.toneMapping!==bs?At.tonemapping_pars_fragment:"",t.toneMapping!==bs?Ev("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",At.colorspace_pars_fragment,Tv("linearToOutputTexel",t.outputColorSpace),Av(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fr).join(`
`)),r=gh(r),r=Fu(r,t),r=zu(r,t),o=gh(o),o=Fu(o,t),o=zu(o,t),r=Nu(r),o=Nu(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Fd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+g+r,_=y+f+o,E=Du(s,s.VERTEX_SHADER,v),T=Du(s,s.FRAGMENT_SHADER,_);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function A(L){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(E)||"",j=s.getShaderInfoLog(T)||"",te=I.trim(),q=V.trim(),K=j.trim();let ne=!0,fe=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const ve=Uu(s,E,"vertex"),Ye=Uu(s,T,"fragment");rn("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+ve+`
`+Ye)}else te!==""?gt("WebGLProgram: Program Info Log:",te):(q===""||K==="")&&(fe=!1);fe&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:K,prefix:f}})}s.deleteShader(E),s.deleteShader(T),R=new qo(s,M),S=Pv(s,M)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,yv)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bv++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let Gv=0;class Hv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Wv(e),t.set(e,i)),i}}class Wv{constructor(e){this.id=Gv++,this.code=e,this.usedTimes=0}}function Xv(n,e,t,i,s,a,r){const o=new Zh,c=new Hv,h=new Set,d=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(S){return h.add(S),S===0?"uv":`uv${S}`}function g(S,b,L,I,V){const j=I.fog,te=V.geometry,q=S.isMeshStandardMaterial?I.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||q),ne=K&&K.mapping===xl?K.image.height:null,fe=x[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&gt("WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ye=ve!==void 0?ve.length:0;let D=0;te.morphAttributes.position!==void 0&&(D=1),te.morphAttributes.normal!==void 0&&(D=2),te.morphAttributes.color!==void 0&&(D=3);let Ce,be,Re,$;if(fe){const Ut=Ai[fe];Ce=Ut.vertexShader,be=Ut.fragmentShader}else Ce=S.vertexShader,be=S.fragmentShader,c.update(S),Re=c.getVertexShaderID(S),$=c.getFragmentShaderID(S);const Z=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Pe=V.isInstancedMesh===!0,ke=V.isBatchedMesh===!0,tt=!!S.map,kt=!!S.matcap,at=!!K,zt=!!S.aoMap,k=!!S.lightMap,wt=!!S.bumpMap,Mt=!!S.normalMap,Nt=!!S.displacementMap,je=!!S.emissiveMap,Gt=!!S.metalnessMap,ot=!!S.roughnessMap,vt=S.anisotropy>0,U=S.clearcoat>0,C=S.dispersion>0,J=S.iridescence>0,de=S.sheen>0,ge=S.transmission>0,ae=vt&&!!S.anisotropyMap,et=U&&!!S.clearcoatMap,Ue=U&&!!S.clearcoatNormalMap,it=U&&!!S.clearcoatRoughnessMap,qe=J&&!!S.iridescenceMap,_e=J&&!!S.iridescenceThicknessMap,Le=de&&!!S.sheenColorMap,ht=de&&!!S.sheenRoughnessMap,ct=!!S.specularMap,We=!!S.specularColorMap,dt=!!S.specularIntensityMap,H=ge&&!!S.transmissionMap,Ge=ge&&!!S.thicknessMap,Oe=!!S.gradientMap,ze=!!S.alphaMap,Se=S.alphaTest>0,pe=!!S.alphaHash,Ke=!!S.extensions;let ut=bs;S.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ut=n.toneMapping);const Bt={shaderID:fe,shaderType:S.type,shaderName:S.name,vertexShader:Ce,fragmentShader:be,defines:S.defines,customVertexShaderID:Re,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:ke,batchingColor:ke&&V._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&V.instanceColor!==null,instancingMorph:Pe&&V.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:ka,alphaToCoverage:!!S.alphaToCoverage,map:tt,matcap:kt,envMap:at,envMapMode:at&&K.mapping,envMapCubeUVHeight:ne,aoMap:zt,lightMap:k,bumpMap:wt,normalMap:Mt,displacementMap:p&&Nt,emissiveMap:je,normalMapObjectSpace:Mt&&S.normalMapType===Hp,normalMapTangentSpace:Mt&&S.normalMapType===Xh,metalnessMap:Gt,roughnessMap:ot,anisotropy:vt,anisotropyMap:ae,clearcoat:U,clearcoatMap:et,clearcoatNormalMap:Ue,clearcoatRoughnessMap:it,dispersion:C,iridescence:J,iridescenceMap:qe,iridescenceThicknessMap:_e,sheen:de,sheenColorMap:Le,sheenRoughnessMap:ht,specularMap:ct,specularColorMap:We,specularIntensityMap:dt,transmission:ge,transmissionMap:H,thicknessMap:Ge,gradientMap:Oe,opaque:S.transparent===!1&&S.blending===Pa&&S.alphaToCoverage===!1,alphaMap:ze,alphaTest:Se,alphaHash:pe,combine:S.combine,mapUv:tt&&M(S.map.channel),aoMapUv:zt&&M(S.aoMap.channel),lightMapUv:k&&M(S.lightMap.channel),bumpMapUv:wt&&M(S.bumpMap.channel),normalMapUv:Mt&&M(S.normalMap.channel),displacementMapUv:Nt&&M(S.displacementMap.channel),emissiveMapUv:je&&M(S.emissiveMap.channel),metalnessMapUv:Gt&&M(S.metalnessMap.channel),roughnessMapUv:ot&&M(S.roughnessMap.channel),anisotropyMapUv:ae&&M(S.anisotropyMap.channel),clearcoatMapUv:et&&M(S.clearcoatMap.channel),clearcoatNormalMapUv:Ue&&M(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&M(S.clearcoatRoughnessMap.channel),iridescenceMapUv:qe&&M(S.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&M(S.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&M(S.sheenColorMap.channel),sheenRoughnessMapUv:ht&&M(S.sheenRoughnessMap.channel),specularMapUv:ct&&M(S.specularMap.channel),specularColorMapUv:We&&M(S.specularColorMap.channel),specularIntensityMapUv:dt&&M(S.specularIntensityMap.channel),transmissionMapUv:H&&M(S.transmissionMap.channel),thicknessMapUv:Ge&&M(S.thicknessMap.channel),alphaMapUv:ze&&M(S.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(Mt||vt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!te.attributes.uv&&(tt||ze),fog:!!j,useFog:S.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:V.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Ye,morphTextureStride:D,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:ut,decodeVideoTexture:tt&&S.map.isVideoTexture===!0&&Ft.getTransfer(S.map.colorSpace)===Xt,decodeVideoTextureEmissive:je&&S.emissiveMap.isVideoTexture===!0&&Ft.getTransfer(S.emissiveMap.colorSpace)===Xt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===yt,flipSided:S.side===In,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ke&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ke&&S.extensions.multiDraw===!0||ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Bt.vertexUv1s=h.has(1),Bt.vertexUv2s=h.has(2),Bt.vertexUv3s=h.has(3),h.clear(),Bt}function f(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)b.push(L),b.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(y(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function _(S){const b=x[S.type];let L;if(b){const I=Ai[b];L=Ir.clone(I.uniforms)}else L=S.uniforms;return L}function E(S,b){let L;for(let I=0,V=d.length;I<V;I++){const j=d[I];if(j.cacheKey===b){L=j,++L.usedTimes;break}}return L===void 0&&(L=new Vv(n,b,S,a),d.push(L)),L}function T(S){if(--S.usedTimes===0){const b=d.indexOf(S);d[b]=d[d.length-1],d.pop(),S.destroy()}}function A(S){c.remove(S)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:R}}function qv(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Yv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function ku(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Bu(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,p,m,x,M,g){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:p,material:m,groupOrder:x,renderOrder:u.renderOrder,z:M,group:g},n[e]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=m,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=M,f.group=g),e++,f}function o(u,p,m,x,M,g){const f=r(u,p,m,x,M,g);m.transmission>0?i.push(f):m.transparent===!0?s.push(f):t.push(f)}function c(u,p,m,x,M,g){const f=r(u,p,m,x,M,g);m.transmission>0?i.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,p){t.length>1&&t.sort(u||Yv),i.length>1&&i.sort(p||ku),s.length>1&&s.sort(p||ku)}function d(){for(let u=e,p=n.length;u<p;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:h}}function $v(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new Bu,n.set(i,[r])):s>=a.length?(r=new Bu,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Zv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new rt};break;case"SpotLight":t={position:new P,direction:new P,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function Kv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Jv=0;function jv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Qv(n){const e=new Zv,t=Kv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);const s=new P,a=new _t,r=new _t;function o(h){let d=0,u=0,p=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let m=0,x=0,M=0,g=0,f=0,y=0,v=0,_=0,E=0,T=0,A=0;h.sort(jv);for(let S=0,b=h.length;S<b;S++){const L=h[S],I=L.color,V=L.intensity,j=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=I.r*V,u+=I.g*V,p+=I.b*V;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],V);A++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=te,i.directionalShadowMatrix[m]=L.shadow.matrix,y++}i.directional[m]=q,m++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(I).multiplyScalar(V),q.distance=j,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const K=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,K.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=K.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,_++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(I).multiplyScalar(V),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,ne.shadowCameraNear=K.camera.near,ne.shadowCameraFar=K.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(V),q.groundColor.copy(L.groundColor).multiplyScalar(V),i.hemi[f]=q,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=He.LTC_FLOAT_1,i.rectAreaLTC2=He.LTC_FLOAT_2):(i.rectAreaLTC1=He.LTC_HALF_1,i.rectAreaLTC2=He.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=p;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==M||R.rectAreaLength!==g||R.hemiLength!==f||R.numDirectionalShadows!==y||R.numPointShadows!==v||R.numSpotShadows!==_||R.numSpotMaps!==E||R.numLightProbes!==A)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,R.directionalLength=m,R.pointLength=x,R.spotLength=M,R.rectAreaLength=g,R.hemiLength=f,R.numDirectionalShadows=y,R.numPointShadows=v,R.numSpotShadows=_,R.numSpotMaps=E,R.numLightProbes=A,i.version=Jv++)}function c(h,d){let u=0,p=0,m=0,x=0,M=0;const g=d.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){const v=h[f];if(v.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(v.isSpotLight){const _=i.spot[m];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const _=i.rectArea[x];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const _=i.point[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const _=i.hemi[M];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(g),M++}}}return{setup:o,setupView:c,state:i}}function Vu(n){const e=new Qv(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function eM(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new Vu(n),e.set(s,[o])):a>=r.length?(o=new Vu(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const tM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nM=`uniform sampler2D shadow_pass;
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
}`;function iM(n,e,t){let i=new Jh;const s=new Fe,a=new Fe,r=new $t,o=new Sx({depthPacking:Gp}),c=new Tx,h={},d=t.maxTextureSize,u={[Ts]:In,[In]:Ts,[yt]:yt},p=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:tM,fragmentShader:nM}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Kt;x.setAttribute("position",new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new z(x,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gf;let f=this.type;this.render=function(T,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const S=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Ui),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const V=f!==Ji&&this.type===Ji,j=f===Ji&&this.type!==Ji;for(let te=0,q=T.length;te<q;te++){const K=T[te],ne=K.shadow;if(ne===void 0){gt("WebGLShadowMap:",K,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const fe=ne.getFrameExtents();if(s.multiply(fe),a.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/fe.x),s.x=a.x*fe.x,ne.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/fe.y),s.y=a.y*fe.y,ne.mapSize.y=a.y)),ne.map===null||V===!0||j===!0){const Ye=this.type!==Ji?{minFilter:Kn,magFilter:Kn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new _i(s.x,s.y,Ye),ne.map.texture.name=K.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let Ye=0;Ye<ve;Ye++){const D=ne.getViewport(Ye);r.set(a.x*D.x,a.y*D.y,a.x*D.z,a.y*D.w),I.viewport(r),ne.updateMatrices(K,Ye),i=ne.getFrustum(),_(A,R,ne.camera,K,this.type)}ne.isPointLightShadow!==!0&&this.type===Ji&&y(ne,R),ne.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(S,b,L)};function y(T,A){const R=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new _i(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,R,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,R,m,M,null)}function v(T,A,R,S){let b=null;const L=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)b=L;else if(b=R.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const I=b.uuid,V=A.uuid;let j=h[I];j===void 0&&(j={},h[I]=j);let te=j[V];te===void 0&&(te=b.clone(),j[V]=te,A.addEventListener("dispose",E)),b=te}if(b.visible=A.visible,b.wireframe=A.wireframe,S===Ji?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=R}return b}function _(T,A,R,S,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Ji)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const V=e.update(T),j=T.material;if(Array.isArray(j)){const te=V.groups;for(let q=0,K=te.length;q<K;q++){const ne=te[q],fe=j[ne.materialIndex];if(fe&&fe.visible){const ve=v(T,fe,S,b);T.onBeforeShadow(n,T,A,R,V,ve,ne),n.renderBufferDirect(R,null,V,ve,T,ne),T.onAfterShadow(n,T,A,R,V,ve,ne)}}}else if(j.visible){const te=v(T,j,S,b);T.onBeforeShadow(n,T,A,R,V,te,null),n.renderBufferDirect(R,null,V,te,T,null),T.onAfterShadow(n,T,A,R,V,te,null)}}const I=T.children;for(let V=0,j=I.length;V<j;V++)_(I[V],A,R,S,b)}function E(T){T.target.removeEventListener("dispose",E);for(const R in h){const S=h[R],b=T.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const sM={[Ec]:Ac,[Cc]:Lc,[Rc]:Dc,[za]:Pc,[Ac]:Ec,[Lc]:Cc,[Dc]:Rc,[Pc]:za};function aM(n,e){function t(){let H=!1;const Ge=new $t;let Oe=null;const ze=new $t(0,0,0,0);return{setMask:function(Se){Oe!==Se&&!H&&(n.colorMask(Se,Se,Se,Se),Oe=Se)},setLocked:function(Se){H=Se},setClear:function(Se,pe,Ke,ut,Bt){Bt===!0&&(Se*=ut,pe*=ut,Ke*=ut),Ge.set(Se,pe,Ke,ut),ze.equals(Ge)===!1&&(n.clearColor(Se,pe,Ke,ut),ze.copy(Ge))},reset:function(){H=!1,Oe=null,ze.set(-1,0,0,0)}}}function i(){let H=!1,Ge=!1,Oe=null,ze=null,Se=null;return{setReversed:function(pe){if(Ge!==pe){const Ke=e.get("EXT_clip_control");pe?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ge=pe;const ut=Se;Se=null,this.setClear(ut)}},getReversed:function(){return Ge},setTest:function(pe){pe?Z(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(pe){Oe!==pe&&!H&&(n.depthMask(pe),Oe=pe)},setFunc:function(pe){if(Ge&&(pe=sM[pe]),ze!==pe){switch(pe){case Ec:n.depthFunc(n.NEVER);break;case Ac:n.depthFunc(n.ALWAYS);break;case Cc:n.depthFunc(n.LESS);break;case za:n.depthFunc(n.LEQUAL);break;case Rc:n.depthFunc(n.EQUAL);break;case Pc:n.depthFunc(n.GEQUAL);break;case Lc:n.depthFunc(n.GREATER);break;case Dc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ze=pe}},setLocked:function(pe){H=pe},setClear:function(pe){Se!==pe&&(Ge&&(pe=1-pe),n.clearDepth(pe),Se=pe)},reset:function(){H=!1,Oe=null,ze=null,Se=null,Ge=!1}}}function s(){let H=!1,Ge=null,Oe=null,ze=null,Se=null,pe=null,Ke=null,ut=null,Bt=null;return{setTest:function(Ut){H||(Ut?Z(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Ut){Ge!==Ut&&!H&&(n.stencilMask(Ut),Ge=Ut)},setFunc:function(Ut,Nn,An){(Oe!==Ut||ze!==Nn||Se!==An)&&(n.stencilFunc(Ut,Nn,An),Oe=Ut,ze=Nn,Se=An)},setOp:function(Ut,Nn,An){(pe!==Ut||Ke!==Nn||ut!==An)&&(n.stencilOp(Ut,Nn,An),pe=Ut,Ke=Nn,ut=An)},setLocked:function(Ut){H=Ut},setClear:function(Ut){Bt!==Ut&&(n.clearStencil(Ut),Bt=Ut)},reset:function(){H=!1,Ge=null,Oe=null,ze=null,Se=null,pe=null,Ke=null,ut=null,Bt=null}}}const a=new t,r=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},u={},p=new WeakMap,m=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,A=new rt(0,0,0),R=0,S=!1,b=null,L=null,I=null,V=null,j=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,K=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=K>=1):ne.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=K>=2);let fe=null,ve={};const Ye=n.getParameter(n.SCISSOR_BOX),D=n.getParameter(n.VIEWPORT),Ce=new $t().fromArray(Ye),be=new $t().fromArray(D);function Re(H,Ge,Oe,ze){const Se=new Uint8Array(4),pe=n.createTexture();n.bindTexture(H,pe),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ke=0;Ke<Oe;Ke++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ge,0,n.RGBA,1,1,ze,0,n.RGBA,n.UNSIGNED_BYTE,Se):n.texImage2D(Ge+Ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Se);return pe}const $={};$[n.TEXTURE_2D]=Re(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Z(n.DEPTH_TEST),r.setFunc(za),wt(!1),Mt(Ld),Z(n.CULL_FACE),zt(Ui);function Z(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function we(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Pe(H,Ge){return u[H]!==Ge?(n.bindFramebuffer(H,Ge),u[H]=Ge,H===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ge),H===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ge),!0):!1}function ke(H,Ge){let Oe=m,ze=!1;if(H){Oe=p.get(Ge),Oe===void 0&&(Oe=[],p.set(Ge,Oe));const Se=H.textures;if(Oe.length!==Se.length||Oe[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,Ke=Se.length;pe<Ke;pe++)Oe[pe]=n.COLOR_ATTACHMENT0+pe;Oe.length=Se.length,ze=!0}}else Oe[0]!==n.BACK&&(Oe[0]=n.BACK,ze=!0);ze&&n.drawBuffers(Oe)}function tt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const kt={[Vs]:n.FUNC_ADD,[yp]:n.FUNC_SUBTRACT,[bp]:n.FUNC_REVERSE_SUBTRACT};kt[wp]=n.MIN,kt[Sp]=n.MAX;const at={[Tp]:n.ZERO,[Ep]:n.ONE,[Ap]:n.SRC_COLOR,[Sc]:n.SRC_ALPHA,[Ip]:n.SRC_ALPHA_SATURATE,[Lp]:n.DST_COLOR,[Rp]:n.DST_ALPHA,[Cp]:n.ONE_MINUS_SRC_COLOR,[Tc]:n.ONE_MINUS_SRC_ALPHA,[Dp]:n.ONE_MINUS_DST_COLOR,[Pp]:n.ONE_MINUS_DST_ALPHA,[Up]:n.CONSTANT_COLOR,[Fp]:n.ONE_MINUS_CONSTANT_COLOR,[zp]:n.CONSTANT_ALPHA,[Np]:n.ONE_MINUS_CONSTANT_ALPHA};function zt(H,Ge,Oe,ze,Se,pe,Ke,ut,Bt,Ut){if(H===Ui){M===!0&&(we(n.BLEND),M=!1);return}if(M===!1&&(Z(n.BLEND),M=!0),H!==_p){if(H!==g||Ut!==S){if((f!==Vs||_!==Vs)&&(n.blendEquation(n.FUNC_ADD),f=Vs,_=Vs),Ut)switch(H){case Pa:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case si:n.blendFunc(n.ONE,n.ONE);break;case Dd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Id:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:rn("WebGLState: Invalid blending: ",H);break}else switch(H){case Pa:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case si:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Dd:rn("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Id:rn("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:rn("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,T=null,A.set(0,0,0),R=0,g=H,S=Ut}return}Se=Se||Ge,pe=pe||Oe,Ke=Ke||ze,(Ge!==f||Se!==_)&&(n.blendEquationSeparate(kt[Ge],kt[Se]),f=Ge,_=Se),(Oe!==y||ze!==v||pe!==E||Ke!==T)&&(n.blendFuncSeparate(at[Oe],at[ze],at[pe],at[Ke]),y=Oe,v=ze,E=pe,T=Ke),(ut.equals(A)===!1||Bt!==R)&&(n.blendColor(ut.r,ut.g,ut.b,Bt),A.copy(ut),R=Bt),g=H,S=!1}function k(H,Ge){H.side===yt?we(n.CULL_FACE):Z(n.CULL_FACE);let Oe=H.side===In;Ge&&(Oe=!Oe),wt(Oe),H.blending===Pa&&H.transparent===!1?zt(Ui):zt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const ze=H.stencilWrite;o.setTest(ze),ze&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),je(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function wt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function Mt(H){H!==vp?(Z(n.CULL_FACE),H!==L&&(H===Ld?n.cullFace(n.BACK):H===Mp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),L=H}function Nt(H){H!==I&&(q&&n.lineWidth(H),I=H)}function je(H,Ge,Oe){H?(Z(n.POLYGON_OFFSET_FILL),(V!==Ge||j!==Oe)&&(n.polygonOffset(Ge,Oe),V=Ge,j=Oe)):we(n.POLYGON_OFFSET_FILL)}function Gt(H){H?Z(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+te-1),fe!==H&&(n.activeTexture(H),fe=H)}function vt(H,Ge,Oe){Oe===void 0&&(fe===null?Oe=n.TEXTURE0+te-1:Oe=fe);let ze=ve[Oe];ze===void 0&&(ze={type:void 0,texture:void 0},ve[Oe]=ze),(ze.type!==H||ze.texture!==Ge)&&(fe!==Oe&&(n.activeTexture(Oe),fe=Oe),n.bindTexture(H,Ge||$[H]),ze.type=H,ze.texture=Ge)}function U(){const H=ve[fe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function C(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function de(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ae(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ue(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function it(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function qe(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function _e(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Le(H){Ce.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Ce.copy(H))}function ht(H){be.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),be.copy(H))}function ct(H,Ge){let Oe=h.get(Ge);Oe===void 0&&(Oe=new WeakMap,h.set(Ge,Oe));let ze=Oe.get(H);ze===void 0&&(ze=n.getUniformBlockIndex(Ge,H.name),Oe.set(H,ze))}function We(H,Ge){const ze=h.get(Ge).get(H);c.get(Ge)!==ze&&(n.uniformBlockBinding(Ge,ze,H.__bindingPointIndex),c.set(Ge,ze))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},fe=null,ve={},u={},p=new WeakMap,m=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,A=new rt(0,0,0),R=0,S=!1,b=null,L=null,I=null,V=null,j=null,Ce.set(0,0,n.canvas.width,n.canvas.height),be.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:Z,disable:we,bindFramebuffer:Pe,drawBuffers:ke,useProgram:tt,setBlending:zt,setMaterial:k,setFlipSided:wt,setCullFace:Mt,setLineWidth:Nt,setPolygonOffset:je,setScissorTest:Gt,activeTexture:ot,bindTexture:vt,unbindTexture:U,compressedTexImage2D:C,compressedTexImage3D:J,texImage2D:qe,texImage3D:_e,updateUBOMapping:ct,uniformBlockBinding:We,texStorage2D:Ue,texStorage3D:it,texSubImage2D:de,texSubImage3D:ge,compressedTexSubImage2D:ae,compressedTexSubImage3D:et,scissor:Le,viewport:ht,reset:dt}}function rM(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Fe,d=new WeakMap;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(U,C){return m?new OffscreenCanvas(U,C):Qo("canvas")}function M(U,C,J){let de=1;const ge=vt(U);if((ge.width>J||ge.height>J)&&(de=J/Math.max(ge.width,ge.height)),de<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ae=Math.floor(de*ge.width),et=Math.floor(de*ge.height);u===void 0&&(u=x(ae,et));const Ue=C?x(ae,et):u;return Ue.width=ae,Ue.height=et,Ue.getContext("2d").drawImage(U,0,0,ae,et),gt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+ae+"x"+et+")."),Ue}else return"data"in U&&gt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),U;return U}function g(U){return U.generateMipmaps}function f(U){n.generateMipmap(U)}function y(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(U,C,J,de,ge=!1){if(U!==null){if(n[U]!==void 0)return n[U];gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ae=C;if(C===n.RED&&(J===n.FLOAT&&(ae=n.R32F),J===n.HALF_FLOAT&&(ae=n.R16F),J===n.UNSIGNED_BYTE&&(ae=n.R8)),C===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.R8UI),J===n.UNSIGNED_SHORT&&(ae=n.R16UI),J===n.UNSIGNED_INT&&(ae=n.R32UI),J===n.BYTE&&(ae=n.R8I),J===n.SHORT&&(ae=n.R16I),J===n.INT&&(ae=n.R32I)),C===n.RG&&(J===n.FLOAT&&(ae=n.RG32F),J===n.HALF_FLOAT&&(ae=n.RG16F),J===n.UNSIGNED_BYTE&&(ae=n.RG8)),C===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RG8UI),J===n.UNSIGNED_SHORT&&(ae=n.RG16UI),J===n.UNSIGNED_INT&&(ae=n.RG32UI),J===n.BYTE&&(ae=n.RG8I),J===n.SHORT&&(ae=n.RG16I),J===n.INT&&(ae=n.RG32I)),C===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGB8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGB16UI),J===n.UNSIGNED_INT&&(ae=n.RGB32UI),J===n.BYTE&&(ae=n.RGB8I),J===n.SHORT&&(ae=n.RGB16I),J===n.INT&&(ae=n.RGB32I)),C===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGBA16UI),J===n.UNSIGNED_INT&&(ae=n.RGBA32UI),J===n.BYTE&&(ae=n.RGBA8I),J===n.SHORT&&(ae=n.RGBA16I),J===n.INT&&(ae=n.RGBA32I)),C===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(ae=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(ae=n.R11F_G11F_B10F)),C===n.RGBA){const et=ge?Jo:Ft.getTransfer(de);J===n.FLOAT&&(ae=n.RGBA32F),J===n.HALF_FLOAT&&(ae=n.RGBA16F),J===n.UNSIGNED_BYTE&&(ae=et===Xt?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(ae=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(ae=n.RGB5_A1)}return(ae===n.R16F||ae===n.R32F||ae===n.RG16F||ae===n.RG32F||ae===n.RGBA16F||ae===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function _(U,C){let J;return U?C===null||C===Js||C===Cr?J=n.DEPTH24_STENCIL8:C===Li?J=n.DEPTH32F_STENCIL8:C===Ar&&(J=n.DEPTH24_STENCIL8,gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===Js||C===Cr?J=n.DEPTH_COMPONENT24:C===Li?J=n.DEPTH_COMPONENT32F:C===Ar&&(J=n.DEPTH_COMPONENT16),J}function E(U,C){return g(U)===!0||U.isFramebufferTexture&&U.minFilter!==Kn&&U.minFilter!==ai?Math.log2(Math.max(C.width,C.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?C.mipmaps.length:1}function T(U){const C=U.target;C.removeEventListener("dispose",T),R(C),C.isVideoTexture&&d.delete(C)}function A(U){const C=U.target;C.removeEventListener("dispose",A),b(C)}function R(U){const C=i.get(U);if(C.__webglInit===void 0)return;const J=U.source,de=p.get(J);if(de){const ge=de[C.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&S(U),Object.keys(de).length===0&&p.delete(J)}i.remove(U)}function S(U){const C=i.get(U);n.deleteTexture(C.__webglTexture);const J=U.source,de=p.get(J);delete de[C.__cacheKey],r.memory.textures--}function b(U){const C=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(C.__webglFramebuffer[de]))for(let ge=0;ge<C.__webglFramebuffer[de].length;ge++)n.deleteFramebuffer(C.__webglFramebuffer[de][ge]);else n.deleteFramebuffer(C.__webglFramebuffer[de]);C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer[de])}else{if(Array.isArray(C.__webglFramebuffer))for(let de=0;de<C.__webglFramebuffer.length;de++)n.deleteFramebuffer(C.__webglFramebuffer[de]);else n.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&n.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let de=0;de<C.__webglColorRenderbuffer.length;de++)C.__webglColorRenderbuffer[de]&&n.deleteRenderbuffer(C.__webglColorRenderbuffer[de]);C.__webglDepthRenderbuffer&&n.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const J=U.textures;for(let de=0,ge=J.length;de<ge;de++){const ae=i.get(J[de]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),r.memory.textures--),i.remove(J[de])}i.remove(U)}let L=0;function I(){L=0}function V(){const U=L;return U>=s.maxTextures&&gt("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),L+=1,U}function j(U){const C=[];return C.push(U.wrapS),C.push(U.wrapT),C.push(U.wrapR||0),C.push(U.magFilter),C.push(U.minFilter),C.push(U.anisotropy),C.push(U.internalFormat),C.push(U.format),C.push(U.type),C.push(U.generateMipmaps),C.push(U.premultiplyAlpha),C.push(U.flipY),C.push(U.unpackAlignment),C.push(U.colorSpace),C.join()}function te(U,C){const J=i.get(U);if(U.isVideoTexture&&Gt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&J.__version!==U.version){const de=U.image;if(de===null)gt("WebGLRenderer: Texture marked for update but no image data found.");else if(de.complete===!1)gt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,U,C);return}}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+C)}function q(U,C){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,C);return}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+C)}function K(U,C){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,C);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+C)}function ne(U,C){const J=i.get(U);if(U.version>0&&J.__version!==U.version){Z(J,U,C);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+C)}const fe={[zn]:n.REPEAT,[es]:n.CLAMP_TO_EDGE,[Fc]:n.MIRRORED_REPEAT},ve={[Kn]:n.NEAREST,[Bp]:n.NEAREST_MIPMAP_NEAREST,[no]:n.NEAREST_MIPMAP_LINEAR,[ai]:n.LINEAR,[Pl]:n.LINEAR_MIPMAP_NEAREST,[Hs]:n.LINEAR_MIPMAP_LINEAR},Ye={[Wp]:n.NEVER,[Kp]:n.ALWAYS,[Xp]:n.LESS,[Df]:n.LEQUAL,[qp]:n.EQUAL,[Zp]:n.GEQUAL,[Yp]:n.GREATER,[$p]:n.NOTEQUAL};function D(U,C){if(C.type===Li&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===ai||C.magFilter===Pl||C.magFilter===no||C.magFilter===Hs||C.minFilter===ai||C.minFilter===Pl||C.minFilter===no||C.minFilter===Hs)&&gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,fe[C.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,fe[C.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,fe[C.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,ve[C.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,ve[C.minFilter]),C.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,Ye[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Kn||C.minFilter!==no&&C.minFilter!==Hs||C.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(U,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function Ce(U,C){let J=!1;U.__webglInit===void 0&&(U.__webglInit=!0,C.addEventListener("dispose",T));const de=C.source;let ge=p.get(de);ge===void 0&&(ge={},p.set(de,ge));const ae=j(C);if(ae!==U.__cacheKey){ge[ae]===void 0&&(ge[ae]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,J=!0),ge[ae].usedTimes++;const et=ge[U.__cacheKey];et!==void 0&&(ge[U.__cacheKey].usedTimes--,et.usedTimes===0&&S(C)),U.__cacheKey=ae,U.__webglTexture=ge[ae].texture}return J}function be(U,C,J){return Math.floor(Math.floor(U/J)/C)}function Re(U,C,J,de){const ae=U.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,C.width,C.height,J,de,C.data);else{ae.sort((_e,Le)=>_e.start-Le.start);let et=0;for(let _e=1;_e<ae.length;_e++){const Le=ae[et],ht=ae[_e],ct=Le.start+Le.count,We=be(ht.start,C.width,4),dt=be(Le.start,C.width,4);ht.start<=ct+1&&We===dt&&be(ht.start+ht.count-1,C.width,4)===We?Le.count=Math.max(Le.count,ht.start+ht.count-Le.start):(++et,ae[et]=ht)}ae.length=et+1;const Ue=n.getParameter(n.UNPACK_ROW_LENGTH),it=n.getParameter(n.UNPACK_SKIP_PIXELS),qe=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,C.width);for(let _e=0,Le=ae.length;_e<Le;_e++){const ht=ae[_e],ct=Math.floor(ht.start/4),We=Math.ceil(ht.count/4),dt=ct%C.width,H=Math.floor(ct/C.width),Ge=We,Oe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,dt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,dt,H,Ge,Oe,J,de,C.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Ue),n.pixelStorei(n.UNPACK_SKIP_PIXELS,it),n.pixelStorei(n.UNPACK_SKIP_ROWS,qe)}}function $(U,C,J){let de=n.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(de=n.TEXTURE_2D_ARRAY),C.isData3DTexture&&(de=n.TEXTURE_3D);const ge=Ce(U,C),ae=C.source;t.bindTexture(de,U.__webglTexture,n.TEXTURE0+J);const et=i.get(ae);if(ae.version!==et.__version||ge===!0){t.activeTexture(n.TEXTURE0+J);const Ue=Ft.getPrimaries(Ft.workingColorSpace),it=C.colorSpace===vs?null:Ft.getPrimaries(C.colorSpace),qe=C.colorSpace===vs||Ue===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let _e=M(C.image,!1,s.maxTextureSize);_e=ot(C,_e);const Le=a.convert(C.format,C.colorSpace),ht=a.convert(C.type);let ct=v(C.internalFormat,Le,ht,C.colorSpace,C.isVideoTexture);D(de,C);let We;const dt=C.mipmaps,H=C.isVideoTexture!==!0,Ge=et.__version===void 0||ge===!0,Oe=ae.dataReady,ze=E(C,_e);if(C.isDepthTexture)ct=_(C.format===Pr,C.type),Ge&&(H?t.texStorage2D(n.TEXTURE_2D,1,ct,_e.width,_e.height):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,null));else if(C.isDataTexture)if(dt.length>0){H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Le,ht,We.data):t.texImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,Le,ht,We.data);C.generateMipmaps=!1}else H?(Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height),Oe&&Re(C,_e,Le,ht)):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,_e.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){H&&Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,dt[0].width,dt[0].height,_e.depth);for(let Se=0,pe=dt.length;Se<pe;Se++)if(We=dt[Se],C.format!==vi)if(Le!==null)if(H){if(Oe)if(C.layerUpdates.size>0){const Ke=Mu(We.width,We.height,C.format,C.type);for(const ut of C.layerUpdates){const Bt=We.data.subarray(ut*Ke/We.data.BYTES_PER_ELEMENT,(ut+1)*Ke/We.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,ut,We.width,We.height,1,Le,Bt)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,We.width,We.height,_e.depth,Le,We.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Se,ct,We.width,We.height,_e.depth,0,We.data,0,0);else gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Oe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,We.width,We.height,_e.depth,Le,ht,We.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Se,ct,We.width,We.height,_e.depth,0,Le,ht,We.data)}else{H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],C.format!==vi?Le!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Le,We.data):t.compressedTexImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,We.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Le,ht,We.data):t.texImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,Le,ht,We.data)}else if(C.isDataArrayTexture)if(H){if(Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,_e.width,_e.height,_e.depth),Oe)if(C.layerUpdates.size>0){const Se=Mu(_e.width,_e.height,C.format,C.type);for(const pe of C.layerUpdates){const Ke=_e.data.subarray(pe*Se/_e.data.BYTES_PER_ELEMENT,(pe+1)*Se/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,_e.width,_e.height,1,Le,ht,Ke)}C.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(C.isData3DTexture)H?(Ge&&t.texStorage3D(n.TEXTURE_3D,ze,ct,_e.width,_e.height,_e.depth),Oe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)):t.texImage3D(n.TEXTURE_3D,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(C.isFramebufferTexture){if(Ge)if(H)t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height);else{let Se=_e.width,pe=_e.height;for(let Ke=0;Ke<ze;Ke++)t.texImage2D(n.TEXTURE_2D,Ke,ct,Se,pe,0,Le,ht,null),Se>>=1,pe>>=1}}else if(dt.length>0){if(H&&Ge){const Se=vt(dt[0]);t.texStorage2D(n.TEXTURE_2D,ze,ct,Se.width,Se.height)}for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,Le,ht,We):t.texImage2D(n.TEXTURE_2D,Se,ct,Le,ht,We);C.generateMipmaps=!1}else if(H){if(Ge){const Se=vt(_e);t.texStorage2D(n.TEXTURE_2D,ze,ct,Se.width,Se.height)}Oe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Le,ht,_e)}else t.texImage2D(n.TEXTURE_2D,0,ct,Le,ht,_e);g(C)&&f(de),et.__version=ae.version,C.onUpdate&&C.onUpdate(C)}U.__version=C.version}function Z(U,C,J){if(C.image.length!==6)return;const de=Ce(U,C),ge=C.source;t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+J);const ae=i.get(ge);if(ge.version!==ae.__version||de===!0){t.activeTexture(n.TEXTURE0+J);const et=Ft.getPrimaries(Ft.workingColorSpace),Ue=C.colorSpace===vs?null:Ft.getPrimaries(C.colorSpace),it=C.colorSpace===vs||et===Ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);const qe=C.isCompressedTexture||C.image[0].isCompressedTexture,_e=C.image[0]&&C.image[0].isDataTexture,Le=[];for(let pe=0;pe<6;pe++)!qe&&!_e?Le[pe]=M(C.image[pe],!0,s.maxCubemapSize):Le[pe]=_e?C.image[pe].image:C.image[pe],Le[pe]=ot(C,Le[pe]);const ht=Le[0],ct=a.convert(C.format,C.colorSpace),We=a.convert(C.type),dt=v(C.internalFormat,ct,We,C.colorSpace),H=C.isVideoTexture!==!0,Ge=ae.__version===void 0||de===!0,Oe=ge.dataReady;let ze=E(C,ht);D(n.TEXTURE_CUBE_MAP,C);let Se;if(qe){H&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,ht.width,ht.height);for(let pe=0;pe<6;pe++){Se=Le[pe].mipmaps;for(let Ke=0;Ke<Se.length;Ke++){const ut=Se[Ke];C.format!==vi?ct!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,ut.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ut.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,We,ut.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ct,We,ut.data)}}}else{if(Se=C.mipmaps,H&&Ge){Se.length>0&&ze++;const pe=vt(Le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(_e){H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Le[pe].width,Le[pe].height,ct,We,Le[pe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,Le[pe].width,Le[pe].height,0,ct,We,Le[pe].data);for(let Ke=0;Ke<Se.length;Ke++){const Bt=Se[Ke].image[pe].image;H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,Bt.width,Bt.height,ct,We,Bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,Bt.width,Bt.height,0,ct,We,Bt.data)}}else{H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ct,We,Le[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,ct,We,Le[pe]);for(let Ke=0;Ke<Se.length;Ke++){const ut=Se[Ke];H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,ct,We,ut.image[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,ct,We,ut.image[pe])}}}g(C)&&f(n.TEXTURE_CUBE_MAP),ae.__version=ge.version,C.onUpdate&&C.onUpdate(C)}U.__version=C.version}function we(U,C,J,de,ge,ae){const et=a.convert(J.format,J.colorSpace),Ue=a.convert(J.type),it=v(J.internalFormat,et,Ue,J.colorSpace),qe=i.get(C),_e=i.get(J);if(_e.__renderTarget=C,!qe.__hasExternalTextures){const Le=Math.max(1,C.width>>ae),ht=Math.max(1,C.height>>ae);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,ae,it,Le,ht,C.depth,0,et,Ue,null):t.texImage2D(ge,ae,it,Le,ht,0,et,Ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,U),je(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ge,_e.__webglTexture,0,Nt(C)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,de,ge,_e.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(U,C,J){if(n.bindRenderbuffer(n.RENDERBUFFER,U),C.depthBuffer){const de=C.depthTexture,ge=de&&de.isDepthTexture?de.type:null,ae=_(C.stencilBuffer,ge),et=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ue=Nt(C);je(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ue,ae,C.width,C.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ue,ae,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,ae,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,U)}else{const de=C.textures;for(let ge=0;ge<de.length;ge++){const ae=de[ge],et=a.convert(ae.format,ae.colorSpace),Ue=a.convert(ae.type),it=v(ae.internalFormat,et,Ue,ae.colorSpace),qe=Nt(C);J&&je(C)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,qe,it,C.width,C.height):je(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,qe,it,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,it,C.width,C.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ke(U,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,U),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const de=i.get(C.depthTexture);de.__renderTarget=C,(!de.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),te(C.depthTexture,0);const ge=de.__webglTexture,ae=Nt(C);if(C.depthTexture.format===Rr)je(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(C.depthTexture.format===Pr)je(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function tt(U){const C=i.get(U),J=U.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==U.depthTexture){const de=U.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),de){const ge=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,de.removeEventListener("dispose",ge)};de.addEventListener("dispose",ge),C.__depthDisposeCallback=ge}C.__boundDepthTexture=de}if(U.depthTexture&&!C.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const de=U.texture.mipmaps;de&&de.length>0?ke(C.__webglFramebuffer[0],U):ke(C.__webglFramebuffer,U)}else if(J){C.__webglDepthbuffer=[];for(let de=0;de<6;de++)if(t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[de]),C.__webglDepthbuffer[de]===void 0)C.__webglDepthbuffer[de]=n.createRenderbuffer(),Pe(C.__webglDepthbuffer[de],U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=C.__webglDepthbuffer[de];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}else{const de=U.texture.mipmaps;if(de&&de.length>0?t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=n.createRenderbuffer(),Pe(C.__webglDepthbuffer,U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=C.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function kt(U,C,J){const de=i.get(U);C!==void 0&&we(de.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&tt(U)}function at(U){const C=U.texture,J=i.get(U),de=i.get(C);U.addEventListener("dispose",A);const ge=U.textures,ae=U.isWebGLCubeRenderTarget===!0,et=ge.length>1;if(et||(de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture()),de.__version=C.version,r.memory.textures++),ae){J.__webglFramebuffer=[];for(let Ue=0;Ue<6;Ue++)if(C.mipmaps&&C.mipmaps.length>0){J.__webglFramebuffer[Ue]=[];for(let it=0;it<C.mipmaps.length;it++)J.__webglFramebuffer[Ue][it]=n.createFramebuffer()}else J.__webglFramebuffer[Ue]=n.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ue=0;Ue<C.mipmaps.length;Ue++)J.__webglFramebuffer[Ue]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(et)for(let Ue=0,it=ge.length;Ue<it;Ue++){const qe=i.get(ge[Ue]);qe.__webglTexture===void 0&&(qe.__webglTexture=n.createTexture(),r.memory.textures++)}if(U.samples>0&&je(U)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ue=0;Ue<ge.length;Ue++){const it=ge[Ue];J.__webglColorRenderbuffer[Ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Ue]);const qe=a.convert(it.format,it.colorSpace),_e=a.convert(it.type),Le=v(it.internalFormat,qe,_e,it.colorSpace,U.isXRRenderTarget===!0),ht=Nt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,Le,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ue,n.RENDERBUFFER,J.__webglColorRenderbuffer[Ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(J.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,de.__webglTexture),D(n.TEXTURE_CUBE_MAP,C);for(let Ue=0;Ue<6;Ue++)if(C.mipmaps&&C.mipmaps.length>0)for(let it=0;it<C.mipmaps.length;it++)we(J.__webglFramebuffer[Ue][it],U,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,it);else we(J.__webglFramebuffer[Ue],U,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0);g(C)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(et){for(let Ue=0,it=ge.length;Ue<it;Ue++){const qe=ge[Ue],_e=i.get(qe);let Le=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Le=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,_e.__webglTexture),D(Le,qe),we(J.__webglFramebuffer,U,qe,n.COLOR_ATTACHMENT0+Ue,Le,0),g(qe)&&f(Le)}t.unbindTexture()}else{let Ue=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ue=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ue,de.__webglTexture),D(Ue,C),C.mipmaps&&C.mipmaps.length>0)for(let it=0;it<C.mipmaps.length;it++)we(J.__webglFramebuffer[it],U,C,n.COLOR_ATTACHMENT0,Ue,it);else we(J.__webglFramebuffer,U,C,n.COLOR_ATTACHMENT0,Ue,0);g(C)&&f(Ue),t.unbindTexture()}U.depthBuffer&&tt(U)}function zt(U){const C=U.textures;for(let J=0,de=C.length;J<de;J++){const ge=C[J];if(g(ge)){const ae=y(U),et=i.get(ge).__webglTexture;t.bindTexture(ae,et),f(ae),t.unbindTexture()}}}const k=[],wt=[];function Mt(U){if(U.samples>0){if(je(U)===!1){const C=U.textures,J=U.width,de=U.height;let ge=n.COLOR_BUFFER_BIT;const ae=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=i.get(U),Ue=C.length>1;if(Ue)for(let qe=0;qe<C.length;qe++)t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer);const it=U.texture.mipmaps;it&&it.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let qe=0;qe<C.length;qe++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),Ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,et.__webglColorRenderbuffer[qe]);const _e=i.get(C[qe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,J,de,0,0,J,de,ge,n.NEAREST),c===!0&&(k.length=0,wt.length=0,k.push(n.COLOR_ATTACHMENT0+qe),U.depthBuffer&&U.resolveDepthBuffer===!1&&(k.push(ae),wt.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,wt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,k))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ue)for(let qe=0;qe<C.length;qe++){t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.RENDERBUFFER,et.__webglColorRenderbuffer[qe]);const _e=i.get(C[qe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const C=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[C])}}}function Nt(U){return Math.min(s.maxSamples,U.samples)}function je(U){const C=i.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Gt(U){const C=r.render.frame;d.get(U)!==C&&(d.set(U,C),U.update())}function ot(U,C){const J=U.colorSpace,de=U.format,ge=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||J!==ka&&J!==vs&&(Ft.getTransfer(J)===Xt?(de!==vi||ge!==Vi)&&gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):rn("WebGLTextures: Unsupported texture color space:",J)),C}function vt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=I,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=ne,this.rebindTextures=kt,this.setupRenderTarget=at,this.updateRenderTargetMipmap=zt,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=we,this.useMultisampledRTT=je}function oM(n,e){function t(i,s=vs){let a;const r=Ft.getTransfer(s);if(i===Vi)return n.UNSIGNED_BYTE;if(i===Oh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===kh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Cf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Rf)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ef)return n.BYTE;if(i===Af)return n.SHORT;if(i===Ar)return n.UNSIGNED_SHORT;if(i===Nh)return n.INT;if(i===Js)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===Fi)return n.HALF_FLOAT;if(i===Pf)return n.ALPHA;if(i===Lf)return n.RGB;if(i===vi)return n.RGBA;if(i===Rr)return n.DEPTH_COMPONENT;if(i===Pr)return n.DEPTH_STENCIL;if(i===Bh)return n.RED;if(i===Vh)return n.RED_INTEGER;if(i===Gh)return n.RG;if(i===Hh)return n.RG_INTEGER;if(i===Wh)return n.RGBA_INTEGER;if(i===Go||i===Ho||i===Wo||i===Xo)if(r===Xt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Go)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ho)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Wo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Xo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Go)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ho)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Wo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Xo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===zc||i===Nc||i===Oc||i===kc)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===zc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Nc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Oc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===kc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Bc||i===Vc||i===Gc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Bc||i===Vc)return r===Xt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Gc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Hc||i===Wc||i===Xc||i===qc||i===Yc||i===$c||i===Zc||i===Kc||i===Jc||i===jc||i===Qc||i===eh||i===th||i===nh)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Hc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Yc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===$c)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Zc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Kc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Qc)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===eh)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===th)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===nh)return r===Xt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ih||i===sh||i===ah)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===ih)return r===Xt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ah)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===rh||i===oh||i===lh||i===ch)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===rh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===oh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===lh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ch)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const lM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cM=`
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

}`;class hM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Xf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Sn({vertexShader:lM,fragmentShader:cM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new z(new Yt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dM extends Wa{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,h=null,d=null,u=null,p=null,m=null,x=null;const M=typeof XRWebGLBinding<"u",g=new hM,f={},y=t.getContextAttributes();let v=null,_=null;const E=[],T=[],A=new Fe;let R=null;const S=new $n;S.viewport=new $t;const b=new $n;b.viewport=new $t;const L=[S,b],I=new Rx;let V=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=E[$];return Z===void 0&&(Z=new Jl,E[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=E[$];return Z===void 0&&(Z=new Jl,E[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=E[$];return Z===void 0&&(Z=new Jl,E[$]=Z),Z.getHandSpace()};function te($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const we=E[Z];we!==void 0&&(we.update($.inputSource,$.frame,h||r),we.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",K);for(let $=0;$<E.length;$++){const Z=T[$];Z!==null&&(T[$]=null,E[$].disconnect(Z))}V=null,j=null,g.reset();for(const $ in f)delete f[$];e.setRenderTarget(v),m=null,p=null,u=null,s=null,_=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",K),y.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Pe=null,ke=null;y.depth&&(ke=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=y.stencil?Pr:Rr,Pe=y.stencil?Cr:Js);const tt={colorFormat:t.RGBA8,depthFormat:ke,scaleFactor:a};u=this.getBinding(),p=u.createProjectionLayer(tt),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new _i(p.textureWidth,p.textureHeight,{format:vi,type:Vi,depthTexture:new Wf(p.textureWidth,p.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const we={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new _i(m.framebufferWidth,m.framebufferHeight,{format:vi,type:Vi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const we=$.removed[Z],Pe=T.indexOf(we);Pe>=0&&(T[Pe]=null,E[Pe].disconnect(we))}for(let Z=0;Z<$.added.length;Z++){const we=$.added[Z];let Pe=T.indexOf(we);if(Pe===-1){for(let tt=0;tt<E.length;tt++)if(tt>=T.length){T.push(we),Pe=tt;break}else if(T[tt]===null){T[tt]=we,Pe=tt;break}if(Pe===-1)break}const ke=E[Pe];ke&&ke.connect(we)}}const ne=new P,fe=new P;function ve($,Z,we){ne.setFromMatrixPosition(Z.matrixWorld),fe.setFromMatrixPosition(we.matrixWorld);const Pe=ne.distanceTo(fe),ke=Z.projectionMatrix.elements,tt=we.projectionMatrix.elements,kt=ke[14]/(ke[10]-1),at=ke[14]/(ke[10]+1),zt=(ke[9]+1)/ke[5],k=(ke[9]-1)/ke[5],wt=(ke[8]-1)/ke[0],Mt=(tt[8]+1)/tt[0],Nt=kt*wt,je=kt*Mt,Gt=Pe/(-wt+Mt),ot=Gt*-wt;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(Gt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),ke[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const vt=kt+Gt,U=at+Gt,C=Nt-ot,J=je+(Pe-ot),de=zt*at/U*vt,ge=k*at/U*vt;$.projectionMatrix.makePerspective(C,J,de,ge,vt,U),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ye($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Z=$.near,we=$.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(we=g.depthFar)),I.near=b.near=S.near=Z,I.far=b.far=S.far=we,(V!==I.near||j!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),V=I.near,j=I.far),I.layers.mask=$.layers.mask|6,S.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const Pe=$.parent,ke=I.cameras;Ye(I,Pe);for(let tt=0;tt<ke.length;tt++)Ye(ke[tt],Pe);ke.length===2?ve(I,S,b):I.projectionMatrix.copy(S.projectionMatrix),D($,I,Pe)};function D($,Z,we){we===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(we.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Dr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function($){return f[$]};let Ce=null;function be($,Z){if(d=Z.getViewerPose(h||r),x=Z,d!==null){const we=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let Pe=!1;we.length!==I.cameras.length&&(I.cameras.length=0,Pe=!0);for(let at=0;at<we.length;at++){const zt=we[at];let k=null;if(m!==null)k=m.getViewport(zt);else{const Mt=u.getViewSubImage(p,zt);k=Mt.viewport,at===0&&(e.setRenderTargetTextures(_,Mt.colorTexture,Mt.depthStencilTexture),e.setRenderTarget(_))}let wt=L[at];wt===void 0&&(wt=new $n,wt.layers.enable(at),wt.viewport=new $t,L[at]=wt),wt.matrix.fromArray(zt.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(zt.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(k.x,k.y,k.width,k.height),at===0&&(I.matrix.copy(wt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Pe===!0&&I.cameras.push(wt)}const ke=s.enabledFeatures;if(ke&&ke.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=i.getBinding();const at=u.getDepthInformation(we[0]);at&&at.isValid&&at.texture&&g.init(at,s.renderState)}if(ke&&ke.includes("camera-access")&&M){e.state.unbindTexture(),u=i.getBinding();for(let at=0;at<we.length;at++){const zt=we[at].camera;if(zt){let k=f[zt];k||(k=new Xf,f[zt]=k);const wt=u.getCameraImage(zt);k.sourceTexture=wt}}}}for(let we=0;we<E.length;we++){const Pe=T[we],ke=E[we];Pe!==null&&ke!==void 0&&ke.update(Pe,Z,h||r)}Ce&&Ce($,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),x=null}const Re=new n0;Re.setAnimationLoop(be),this.setAnimationLoop=function($){Ce=$},this.dispose=function(){}}}const zs=new yi,uM=new _t;function fM(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,Of(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,v,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),u(g,f)):f.isMeshPhongMaterial?(a(g,f),d(g,f)):f.isMeshStandardMaterial?(a(g,f),p(g,f),f.isMeshPhysicalMaterial&&m(g,f,_)):f.isMeshMatcapMaterial?(a(g,f),x(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),M(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?c(g,f,y,v):f.isSpriteMaterial?h(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===In&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===In&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,_=y.envMapRotation;v&&(g.envMap.value=v,zs.copy(_),zs.x*=-1,zs.y*=-1,zs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(zs.y*=-1,zs.z*=-1),g.envMapRotation.value.setFromMatrix4(uM.makeRotationFromEuler(zs)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,y,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=v*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function p(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function m(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===In&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,f){f.matcap&&(g.matcap.value=f.matcap)}function M(g,f){const y=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function pM(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function h(y,v){let _=s[y.id];_===void 0&&(x(y),_=d(y),s[y.id]=_,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;a[y.id]!==T&&(p(y),a[y.id]=T)}function d(y){const v=u();y.__bindingPointIndex=v;const _=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function u(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return rn("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(y){const v=s[y.id],_=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=_.length;T<A;T++){const R=Array.isArray(_[T])?_[T]:[_[T]];for(let S=0,b=R.length;S<b;S++){const L=R[S];if(m(L,T,S,E)===!0){const I=L.__offset,V=Array.isArray(L.value)?L.value:[L.value];let j=0;for(let te=0;te<V.length;te++){const q=V[te],K=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,I+j,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,j),j+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,_,E){const T=y.value,A=v+"_"+_;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const R=E[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(y){const v=y.uniforms;let _=0;const E=16;for(let A=0,R=v.length;A<R;A++){const S=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,L=S.length;b<L;b++){const I=S[b],V=Array.isArray(I.value)?I.value:[I.value];for(let j=0,te=V.length;j<te;j++){const q=V[j],K=M(q),ne=_%E,fe=ne%K.boundary,ve=ne+fe;_+=fe,ve!==0&&E-ve<K.storage&&(_+=E-ve),I.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=K.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function M(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):gt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const _=r.indexOf(v.__bindingPointIndex);r.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:f}}const mM=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Ki=null;function xM(){return Ki===null&&(Ki=new Hf(mM,32,32,Gh,Fi),Ki.minFilter=ai,Ki.magFilter=ai,Ki.wrapS=es,Ki.wrapT=es,Ki.generateMipmaps=!1,Ki.needsUpdate=!0),Ki}class gM{constructor(e={}){const{canvas:t=Jp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const x=new Set([Wh,Hh,Vh]),M=new Set([Vi,Js,Ar,Cr,Oh,kh]),g=new Uint32Array(4),f=new Int32Array(4);let y=null,v=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let A=!1;this._outputColorSpace=Pt;let R=0,S=0,b=null,L=-1,I=null;const V=new $t,j=new $t;let te=null;const q=new rt(0);let K=0,ne=t.width,fe=t.height,ve=1,Ye=null,D=null;const Ce=new $t(0,0,ne,fe),be=new $t(0,0,ne,fe);let Re=!1;const $=new Jh;let Z=!1,we=!1;const Pe=new _t,ke=new P,tt=new $t,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function zt(){return b===null?ve:1}let k=i;function wt(w,F){return t.getContext(w,F)}try{const w={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Uh}`),t.addEventListener("webglcontextlost",Se,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",Ke,!1),k===null){const F="webgl2";if(k=wt(F,w),k===null)throw wt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let Mt,Nt,je,Gt,ot,vt,U,C,J,de,ge,ae,et,Ue,it,qe,_e,Le,ht,ct,We,dt,H,Ge;function Oe(){Mt=new T2(k),Mt.init(),dt=new oM(k,Mt),Nt=new x2(k,Mt,e,dt),je=new aM(k,Mt),Nt.reversedDepthBuffer&&p&&je.buffers.depth.setReversed(!0),Gt=new C2(k),ot=new qv,vt=new rM(k,Mt,je,ot,Nt,dt,Gt),U=new v2(T),C=new S2(T),J=new Dx(k),H=new p2(k,J),de=new E2(k,J,Gt,H),ge=new P2(k,de,J,Gt),ht=new R2(k,Nt,vt),qe=new g2(ot),ae=new Xv(T,U,C,Mt,Nt,H,qe),et=new fM(T,ot),Ue=new $v,it=new eM(Mt),Le=new f2(T,U,C,je,ge,m,c),_e=new iM(T,ge,Nt),Ge=new pM(k,Gt,Nt,je),ct=new m2(k,Mt,Gt),We=new A2(k,Mt,Gt),Gt.programs=ae.programs,T.capabilities=Nt,T.extensions=Mt,T.properties=ot,T.renderLists=Ue,T.shadowMap=_e,T.state=je,T.info=Gt}Oe();const ze=new dM(T,k);this.xr=ze,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const w=Mt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Mt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(w){w!==void 0&&(ve=w,this.setSize(ne,fe,!1))},this.getSize=function(w){return w.set(ne,fe)},this.setSize=function(w,F,G=!0){if(ze.isPresenting){gt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=w,fe=F,t.width=Math.floor(w*ve),t.height=Math.floor(F*ve),G===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(ne*ve,fe*ve).floor()},this.setDrawingBufferSize=function(w,F,G){ne=w,fe=F,ve=G,t.width=Math.floor(w*G),t.height=Math.floor(F*G),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(V)},this.getViewport=function(w){return w.copy(Ce)},this.setViewport=function(w,F,G,X){w.isVector4?Ce.set(w.x,w.y,w.z,w.w):Ce.set(w,F,G,X),je.viewport(V.copy(Ce).multiplyScalar(ve).round())},this.getScissor=function(w){return w.copy(be)},this.setScissor=function(w,F,G,X){w.isVector4?be.set(w.x,w.y,w.z,w.w):be.set(w,F,G,X),je.scissor(j.copy(be).multiplyScalar(ve).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(w){je.setScissorTest(Re=w)},this.setOpaqueSort=function(w){Ye=w},this.setTransparentSort=function(w){D=w},this.getClearColor=function(w){return w.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,G=!0){let X=0;if(w){let B=!1;if(b!==null){const oe=b.texture.format;B=x.has(oe)}if(B){const oe=b.texture.type,re=M.has(oe),Q=Le.getClearColor(),ue=Le.getClearAlpha(),De=Q.r,Ve=Q.g,Ie=Q.b;re?(g[0]=De,g[1]=Ve,g[2]=Ie,g[3]=ue,k.clearBufferuiv(k.COLOR,0,g)):(f[0]=De,f[1]=Ve,f[2]=Ie,f[3]=ue,k.clearBufferiv(k.COLOR,0,f))}else X|=k.COLOR_BUFFER_BIT}F&&(X|=k.DEPTH_BUFFER_BIT),G&&(X|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Se,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",Ke,!1),Le.dispose(),Ue.dispose(),it.dispose(),ot.dispose(),U.dispose(),C.dispose(),ge.dispose(),H.dispose(),Ge.dispose(),ae.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",Qr),ze.removeEventListener("sessionend",Za),bi.stop()};function Se(w){w.preventDefault(),el("WebGLRenderer: Context Lost."),A=!0}function pe(){el("WebGLRenderer: Context Restored."),A=!1;const w=Gt.autoReset,F=_e.enabled,G=_e.autoUpdate,X=_e.needsUpdate,B=_e.type;Oe(),Gt.autoReset=w,_e.enabled=F,_e.autoUpdate=G,_e.needsUpdate=X,_e.type=B}function Ke(w){rn("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ut(w){const F=w.target;F.removeEventListener("dispose",ut),Bt(F)}function Bt(w){Ut(w),ot.remove(w)}function Ut(w){const F=ot.get(w).programs;F!==void 0&&(F.forEach(function(G){ae.releaseProgram(G)}),w.isShaderMaterial&&ae.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,G,X,B,oe){F===null&&(F=kt);const re=B.isMesh&&B.matrixWorld.determinant()<0,Q=N(w,F,G,X,B);je.setMaterial(X,re);let ue=G.index,De=1;if(X.wireframe===!0){if(ue=de.getWireframeAttribute(G),ue===void 0)return;De=2}const Ve=G.drawRange,Ie=G.attributes.position;let Ne=Ve.start*De,ft=(Ve.start+Ve.count)*De;oe!==null&&(Ne=Math.max(Ne,oe.start*De),ft=Math.min(ft,(oe.start+oe.count)*De)),ue!==null?(Ne=Math.max(Ne,0),ft=Math.min(ft,ue.count)):Ie!=null&&(Ne=Math.max(Ne,0),ft=Math.min(ft,Ie.count));const St=ft-Ne;if(St<0||St===1/0)return;H.setup(B,X,Q,G,ue);let Lt,Tt=ct;if(ue!==null&&(Lt=J.get(ue),Tt=We,Tt.setIndex(Lt)),B.isMesh)X.wireframe===!0?(je.setLineWidth(X.wireframeLinewidth*zt()),Tt.setMode(k.LINES)):Tt.setMode(k.TRIANGLES);else if(B.isLine){let $e=X.linewidth;$e===void 0&&($e=1),je.setLineWidth($e*zt()),B.isLineSegments?Tt.setMode(k.LINES):B.isLineLoop?Tt.setMode(k.LINE_LOOP):Tt.setMode(k.LINE_STRIP)}else B.isPoints?Tt.setMode(k.POINTS):B.isSprite&&Tt.setMode(k.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Lr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Tt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Mt.get("WEBGL_multi_draw"))Tt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const $e=B._multiDrawStarts,Dt=B._multiDrawCounts,mt=B._multiDrawCount,Qt=ue?J.get(ue).bytesPerElement:1,Wi=ot.get(X).currentProgram.getUniforms();for(let nn=0;nn<mt;nn++)Wi.setValue(k,"_gl_DrawID",nn),Tt.render($e[nn]/Qt,Dt[nn])}else if(B.isInstancedMesh)Tt.renderInstances(Ne,St,B.count);else if(G.isInstancedBufferGeometry){const $e=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Dt=Math.min(G.instanceCount,$e);Tt.renderInstances(Ne,St,Dt)}else Tt.render(Ne,St)};function Nn(w,F,G){w.transparent===!0&&w.side===yt&&w.forceSinglePass===!1?(w.side=In,w.needsUpdate=!0,xn(w,F,G),w.side=Ts,w.needsUpdate=!0,xn(w,F,G),w.side=yt):xn(w,F,G)}this.compile=function(w,F,G=null){G===null&&(G=w),v=it.get(G),v.init(F),E.push(v),G.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),w!==G&&w.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const X=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let re=0;re<oe.length;re++){const Q=oe[re];Nn(Q,G,B),X.add(Q)}else Nn(oe,G,B),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(w,F,G=null){const X=this.compile(w,F,G);return new Promise(B=>{function oe(){if(X.forEach(function(re){ot.get(re).currentProgram.isReady()&&X.delete(re)}),X.size===0){B(w);return}setTimeout(oe,10)}Mt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let An=null;function li(w){An&&An(w)}function Qr(){bi.stop()}function Za(){bi.start()}const bi=new n0;bi.setAnimationLoop(li),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(w){An=w,ze.setAnimationLoop(w),w===null?bi.stop():bi.start()},ze.addEventListener("sessionstart",Qr),ze.addEventListener("sessionend",Za),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){rn("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(F),F=ze.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,F,b),v=it.get(w,E.length),v.init(F),E.push(v),Pe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Pe,Di,F.reversedDepth),we=this.localClippingEnabled,Z=qe.init(this.clippingPlanes,we),y=Ue.get(w,_.length),y.init(),_.push(y),ze.enabled===!0&&ze.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&wi(oe,F,-1/0,T.sortObjects)}wi(w,F,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort(Ye,D),at=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,at&&Le.addToRenderList(y,w),this.info.render.frame++,Z===!0&&qe.beginShadows();const G=v.state.shadowsArray;_e.render(G,w,F),Z===!0&&qe.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,B=y.transmissive;if(v.setupLights(),F.isArrayCamera){const oe=F.cameras;if(B.length>0)for(let re=0,Q=oe.length;re<Q;re++){const ue=oe[re];Ka(X,B,w,ue)}at&&Le.render(w);for(let re=0,Q=oe.length;re<Q;re++){const ue=oe[re];Si(y,w,ue,ue.viewport)}}else B.length>0&&Ka(X,B,w,F),at&&Le.render(w),Si(y,w,F);b!==null&&S===0&&(vt.updateMultisampleRenderTarget(b),vt.updateRenderTargetMipmap(b)),w.isScene===!0&&w.onAfterRender(T,w,F),H.resetDefaultState(),L=-1,I=null,E.pop(),E.length>0?(v=E[E.length-1],Z===!0&&qe.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?y=_[_.length-1]:y=null};function wi(w,F,G,X){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){X&&tt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Pe);const re=ge.update(w),Q=w.material;Q.visible&&y.push(w,re,Q,G,tt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){const re=ge.update(w),Q=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),tt.copy(w.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),tt.copy(re.boundingSphere.center)),tt.applyMatrix4(w.matrixWorld).applyMatrix4(Pe)),Array.isArray(Q)){const ue=re.groups;for(let De=0,Ve=ue.length;De<Ve;De++){const Ie=ue[De],Ne=Q[Ie.materialIndex];Ne&&Ne.visible&&y.push(w,re,Ne,G,tt.z,Ie)}}else Q.visible&&y.push(w,re,Q,G,tt.z,null)}}const oe=w.children;for(let re=0,Q=oe.length;re<Q;re++)wi(oe[re],F,G,X)}function Si(w,F,G,X){const{opaque:B,transmissive:oe,transparent:re}=w;v.setupLightsView(G),Z===!0&&qe.setGlobalState(T.clippingPlanes,G),X&&je.viewport(V.copy(X)),B.length>0&&ia(B,F,G),oe.length>0&&ia(oe,F,G),re.length>0&&ia(re,F,G),je.buffers.depth.setTest(!0),je.buffers.depth.setMask(!0),je.buffers.color.setMask(!0),je.setPolygonOffset(!1)}function Ka(w,F,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new _i(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")||Mt.has("EXT_color_buffer_float")?Fi:Vi,minFilter:Hs,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ft.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],re=X.viewport||V;oe.setSize(re.z*T.transmissionResolutionScale,re.w*T.transmissionResolutionScale);const Q=T.getRenderTarget(),ue=T.getActiveCubeFace(),De=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),K=T.getClearAlpha(),K<1&&T.setClearColor(16777215,.5),T.clear(),at&&Le.render(G);const Ve=T.toneMapping;T.toneMapping=bs;const Ie=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),Z===!0&&qe.setGlobalState(T.clippingPlanes,X),ia(w,G,X),vt.updateMultisampleRenderTarget(oe),vt.updateRenderTargetMipmap(oe),Mt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let ft=0,St=F.length;ft<St;ft++){const Lt=F[ft],{object:Tt,geometry:$e,material:Dt,group:mt}=Lt;if(Dt.side===yt&&Tt.layers.test(X.layers)){const Qt=Dt.side;Dt.side=In,Dt.needsUpdate=!0,eo(Tt,G,X,$e,Dt,mt),Dt.side=Qt,Dt.needsUpdate=!0,Ne=!0}}Ne===!0&&(vt.updateMultisampleRenderTarget(oe),vt.updateRenderTargetMipmap(oe))}T.setRenderTarget(Q,ue,De),T.setClearColor(q,K),Ie!==void 0&&(X.viewport=Ie),T.toneMapping=Ve}function ia(w,F,G){const X=F.isScene===!0?F.overrideMaterial:null;for(let B=0,oe=w.length;B<oe;B++){const re=w[B],{object:Q,geometry:ue,group:De}=re;let Ve=re.material;Ve.allowOverride===!0&&X!==null&&(Ve=X),Q.layers.test(G.layers)&&eo(Q,F,G,ue,Ve,De)}}function eo(w,F,G,X,B,oe){w.onBeforeRender(T,F,G,X,B,oe),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(T,F,G,X,w,oe),B.transparent===!0&&B.side===yt&&B.forceSinglePass===!1?(B.side=In,B.needsUpdate=!0,T.renderBufferDirect(G,F,X,B,w,oe),B.side=Ts,B.needsUpdate=!0,T.renderBufferDirect(G,F,X,B,w,oe),B.side=yt):T.renderBufferDirect(G,F,X,B,w,oe),w.onAfterRender(T,F,G,X,B,oe)}function xn(w,F,G){F.isScene!==!0&&(F=kt);const X=ot.get(w),B=v.state.lights,oe=v.state.shadowsArray,re=B.state.version,Q=ae.getParameters(w,B.state,oe,F,G),ue=ae.getProgramCacheKey(Q);let De=X.programs;X.environment=w.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(w.isMeshStandardMaterial?C:U).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,De===void 0&&(w.addEventListener("dispose",ut),De=new Map,X.programs=De);let Ve=De.get(ue);if(Ve!==void 0){if(X.currentProgram===Ve&&X.lightsStateVersion===re)return Ja(w,Q),Ve}else Q.uniforms=ae.getUniforms(w),w.onBeforeCompile(Q,T),Ve=ae.acquireProgram(Q,ue),De.set(ue,Ve),X.uniforms=Q.uniforms;const Ie=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ie.clippingPlanes=qe.uniform),Ja(w,Q),X.needsLights=Y(w),X.lightsStateVersion=re,X.needsLights&&(Ie.ambientLightColor.value=B.state.ambient,Ie.lightProbe.value=B.state.probe,Ie.directionalLights.value=B.state.directional,Ie.directionalLightShadows.value=B.state.directionalShadow,Ie.spotLights.value=B.state.spot,Ie.spotLightShadows.value=B.state.spotShadow,Ie.rectAreaLights.value=B.state.rectArea,Ie.ltc_1.value=B.state.rectAreaLTC1,Ie.ltc_2.value=B.state.rectAreaLTC2,Ie.pointLights.value=B.state.point,Ie.pointLightShadows.value=B.state.pointShadow,Ie.hemisphereLights.value=B.state.hemi,Ie.directionalShadowMap.value=B.state.directionalShadowMap,Ie.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Ie.spotShadowMap.value=B.state.spotShadowMap,Ie.spotLightMatrix.value=B.state.spotLightMatrix,Ie.spotLightMap.value=B.state.spotLightMap,Ie.pointShadowMap.value=B.state.pointShadowMap,Ie.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Ve,X.uniformsList=null,Ve}function to(w){if(w.uniformsList===null){const F=w.currentProgram.getUniforms();w.uniformsList=qo.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function Ja(w,F){const G=ot.get(w);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function N(w,F,G,X,B){F.isScene!==!0&&(F=kt),vt.resetTextureUnits();const oe=F.fog,re=X.isMeshStandardMaterial?F.environment:null,Q=b===null?T.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:ka,ue=(X.isMeshStandardMaterial?C:U).get(X.envMap||re),De=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ie=!!G.morphAttributes.position,Ne=!!G.morphAttributes.normal,ft=!!G.morphAttributes.color;let St=bs;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(St=T.toneMapping);const Lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Tt=Lt!==void 0?Lt.length:0,$e=ot.get(X),Dt=v.state.lights;if(Z===!0&&(we===!0||w!==I)){const On=w===I&&X.id===L;qe.setState(X,w,On)}let mt=!1;X.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==Dt.state.version||$e.outputColorSpace!==Q||B.isBatchedMesh&&$e.batching===!1||!B.isBatchedMesh&&$e.batching===!0||B.isBatchedMesh&&$e.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&$e.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&$e.instancing===!1||!B.isInstancedMesh&&$e.instancing===!0||B.isSkinnedMesh&&$e.skinning===!1||!B.isSkinnedMesh&&$e.skinning===!0||B.isInstancedMesh&&$e.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&$e.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&$e.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&$e.instancingMorph===!1&&B.morphTexture!==null||$e.envMap!==ue||X.fog===!0&&$e.fog!==oe||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==qe.numPlanes||$e.numIntersection!==qe.numIntersection)||$e.vertexAlphas!==De||$e.vertexTangents!==Ve||$e.morphTargets!==Ie||$e.morphNormals!==Ne||$e.morphColors!==ft||$e.toneMapping!==St||$e.morphTargetsCount!==Tt)&&(mt=!0):(mt=!0,$e.__version=X.version);let Qt=$e.currentProgram;mt===!0&&(Qt=xn(X,F,B));let Wi=!1,nn=!1,Qn=!1;const Ht=Qt.getUniforms(),gn=$e.uniforms;if(je.useProgram(Qt.program)&&(Wi=!0,nn=!0,Qn=!0),X.id!==L&&(L=X.id,nn=!0),Wi||I!==w){je.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Ht.setValue(k,"projectionMatrix",w.projectionMatrix),Ht.setValue(k,"viewMatrix",w.matrixWorldInverse);const Wn=Ht.map.cameraPosition;Wn!==void 0&&Wn.setValue(k,ke.setFromMatrixPosition(w.matrixWorld)),Nt.logarithmicDepthBuffer&&Ht.setValue(k,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ht.setValue(k,"isOrthographic",w.isOrthographicCamera===!0),I!==w&&(I=w,nn=!0,Qn=!0)}if(B.isSkinnedMesh){Ht.setOptional(k,B,"bindMatrix"),Ht.setOptional(k,B,"bindMatrixInverse");const On=B.skeleton;On&&(On.boneTexture===null&&On.computeBoneTexture(),Ht.setValue(k,"boneTexture",On.boneTexture,vt))}B.isBatchedMesh&&(Ht.setOptional(k,B,"batchingTexture"),Ht.setValue(k,"batchingTexture",B._matricesTexture,vt),Ht.setOptional(k,B,"batchingIdTexture"),Ht.setValue(k,"batchingIdTexture",B._indirectTexture,vt),Ht.setOptional(k,B,"batchingColorTexture"),B._colorsTexture!==null&&Ht.setValue(k,"batchingColorTexture",B._colorsTexture,vt));const ei=G.morphAttributes;if((ei.position!==void 0||ei.normal!==void 0||ei.color!==void 0)&&ht.update(B,G,Qt),(nn||$e.receiveShadow!==B.receiveShadow)&&($e.receiveShadow=B.receiveShadow,Ht.setValue(k,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(gn.envMap.value=ue,gn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(gn.envMapIntensity.value=F.environmentIntensity),gn.dfgLUT!==void 0&&(gn.dfgLUT.value=xM()),nn&&(Ht.setValue(k,"toneMappingExposure",T.toneMappingExposure),$e.needsLights&&O(gn,Qn),oe&&X.fog===!0&&et.refreshFogUniforms(gn,oe),et.refreshMaterialUniforms(gn,X,ve,fe,v.state.transmissionRenderTarget[w.id]),qo.upload(k,to($e),gn,vt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(qo.upload(k,to($e),gn,vt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ht.setValue(k,"center",B.center),Ht.setValue(k,"modelViewMatrix",B.modelViewMatrix),Ht.setValue(k,"normalMatrix",B.normalMatrix),Ht.setValue(k,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const On=X.uniformsGroups;for(let Wn=0,Rl=On.length;Wn<Rl;Wn++){const Ps=On[Wn];Ge.update(Ps,Qt),Ge.bind(Ps,Qt)}}return Qt}function O(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function Y(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(w,F,G){const X=ot.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(w.texture).__webglTexture=F,ot.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){const G=ot.get(w);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};const ee=k.createFramebuffer();this.setRenderTarget=function(w,F=0,G=0){b=w,R=F,S=G;let X=!0,B=null,oe=!1,re=!1;if(w){const ue=ot.get(w);if(ue.__useDefaultFramebuffer!==void 0)je.bindFramebuffer(k.FRAMEBUFFER,null),X=!1;else if(ue.__webglFramebuffer===void 0)vt.setupRenderTarget(w);else if(ue.__hasExternalTextures)vt.rebindTextures(w,ot.get(w.texture).__webglTexture,ot.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ie=w.depthTexture;if(ue.__boundDepthTexture!==Ie){if(Ie!==null&&ot.has(Ie)&&(w.width!==Ie.image.width||w.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");vt.setupDepthRenderbuffer(w)}}const De=w.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(re=!0);const Ve=ot.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ve[F])?B=Ve[F][G]:B=Ve[F],oe=!0):w.samples>0&&vt.useMultisampledRTT(w)===!1?B=ot.get(w).__webglMultisampledFramebuffer:Array.isArray(Ve)?B=Ve[G]:B=Ve,V.copy(w.viewport),j.copy(w.scissor),te=w.scissorTest}else V.copy(Ce).multiplyScalar(ve).floor(),j.copy(be).multiplyScalar(ve).floor(),te=Re;if(G!==0&&(B=ee),je.bindFramebuffer(k.FRAMEBUFFER,B)&&X&&je.drawBuffers(w,B),je.viewport(V),je.scissor(j),je.setScissorTest(te),oe){const ue=ot.get(w.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,ue.__webglTexture,G)}else if(re){const ue=F;for(let De=0;De<w.textures.length;De++){const Ve=ot.get(w.textures[De]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+De,Ve.__webglTexture,G,ue)}}else if(w!==null&&G!==0){const ue=ot.get(w.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ue.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(w,F,G,X,B,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget)){rn("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue){je.bindFramebuffer(k.FRAMEBUFFER,ue);try{const De=w.textures[Q],Ve=De.format,Ie=De.type;if(!Nt.textureFormatReadable(Ve)){rn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(Ie)){rn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-X&&G>=0&&G<=w.height-B&&(w.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Q),k.readPixels(F,G,X,B,dt.convert(Ve),dt.convert(Ie),oe))}finally{const De=b!==null?ot.get(b).__webglFramebuffer:null;je.bindFramebuffer(k.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(w,F,G,X,B,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue)if(F>=0&&F<=w.width-X&&G>=0&&G<=w.height-B){je.bindFramebuffer(k.FRAMEBUFFER,ue);const De=w.textures[Q],Ve=De.format,Ie=De.type;if(!Nt.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ne),k.bufferData(k.PIXEL_PACK_BUFFER,oe.byteLength,k.STREAM_READ),w.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Q),k.readPixels(F,G,X,B,dt.convert(Ve),dt.convert(Ie),0);const ft=b!==null?ot.get(b).__webglFramebuffer:null;je.bindFramebuffer(k.FRAMEBUFFER,ft);const St=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await jp(k,St,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ne),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,oe),k.deleteBuffer(Ne),k.deleteSync(St),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,G=0){const X=Math.pow(2,-G),B=Math.floor(w.image.width*X),oe=Math.floor(w.image.height*X),re=F!==null?F.x:0,Q=F!==null?F.y:0;vt.setTexture2D(w,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,re,Q,B,oe),je.unbindTexture()};const ie=k.createFramebuffer(),le=k.createFramebuffer();this.copyTextureToTexture=function(w,F,G=null,X=null,B=0,oe=null){oe===null&&(B!==0?(Lr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let re,Q,ue,De,Ve,Ie,Ne,ft,St;const Lt=w.isCompressedTexture?w.mipmaps[oe]:w.image;if(G!==null)re=G.max.x-G.min.x,Q=G.max.y-G.min.y,ue=G.isBox3?G.max.z-G.min.z:1,De=G.min.x,Ve=G.min.y,Ie=G.isBox3?G.min.z:0;else{const ei=Math.pow(2,-B);re=Math.floor(Lt.width*ei),Q=Math.floor(Lt.height*ei),w.isDataArrayTexture?ue=Lt.depth:w.isData3DTexture?ue=Math.floor(Lt.depth*ei):ue=1,De=0,Ve=0,Ie=0}X!==null?(Ne=X.x,ft=X.y,St=X.z):(Ne=0,ft=0,St=0);const Tt=dt.convert(F.format),$e=dt.convert(F.type);let Dt;F.isData3DTexture?(vt.setTexture3D(F,0),Dt=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(vt.setTexture2DArray(F,0),Dt=k.TEXTURE_2D_ARRAY):(vt.setTexture2D(F,0),Dt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const mt=k.getParameter(k.UNPACK_ROW_LENGTH),Qt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Wi=k.getParameter(k.UNPACK_SKIP_PIXELS),nn=k.getParameter(k.UNPACK_SKIP_ROWS),Qn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Lt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Lt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,De),k.pixelStorei(k.UNPACK_SKIP_ROWS,Ve),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Ie);const Ht=w.isDataArrayTexture||w.isData3DTexture,gn=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){const ei=ot.get(w),On=ot.get(F),Wn=ot.get(ei.__renderTarget),Rl=ot.get(On.__renderTarget);je.bindFramebuffer(k.READ_FRAMEBUFFER,Wn.__webglFramebuffer),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,Rl.__webglFramebuffer);for(let Ps=0;Ps<ue;Ps++)Ht&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ot.get(w).__webglTexture,B,Ie+Ps),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ot.get(F).__webglTexture,oe,St+Ps)),k.blitFramebuffer(De,Ve,re,Q,Ne,ft,re,Q,k.DEPTH_BUFFER_BIT,k.NEAREST);je.bindFramebuffer(k.READ_FRAMEBUFFER,null),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||ot.has(w)){const ei=ot.get(w),On=ot.get(F);je.bindFramebuffer(k.READ_FRAMEBUFFER,ie),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,le);for(let Wn=0;Wn<ue;Wn++)Ht?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ei.__webglTexture,B,Ie+Wn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ei.__webglTexture,B),gn?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,On.__webglTexture,oe,St+Wn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,On.__webglTexture,oe),B!==0?k.blitFramebuffer(De,Ve,re,Q,Ne,ft,re,Q,k.COLOR_BUFFER_BIT,k.NEAREST):gn?k.copyTexSubImage3D(Dt,oe,Ne,ft,St+Wn,De,Ve,re,Q):k.copyTexSubImage2D(Dt,oe,Ne,ft,De,Ve,re,Q);je.bindFramebuffer(k.READ_FRAMEBUFFER,null),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else gn?w.isDataTexture||w.isData3DTexture?k.texSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,$e,Lt.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,Lt.data):k.texSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,$e,Lt):w.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,oe,Ne,ft,re,Q,Tt,$e,Lt.data):w.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,oe,Ne,ft,Lt.width,Lt.height,Tt,Lt.data):k.texSubImage2D(k.TEXTURE_2D,oe,Ne,ft,re,Q,Tt,$e,Lt);k.pixelStorei(k.UNPACK_ROW_LENGTH,mt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Qt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Wi),k.pixelStorei(k.UNPACK_SKIP_ROWS,nn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Qn),oe===0&&F.generateMipmaps&&k.generateMipmap(Dt),je.unbindTexture()},this.initRenderTarget=function(w){ot.get(w).__webglFramebuffer===void 0&&vt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?vt.setTextureCube(w,0):w.isData3DTexture?vt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?vt.setTexture2DArray(w,0):vt.setTexture2D(w,0),je.unbindTexture()},this.resetState=function(){R=0,S=0,b=null,je.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ft._getUnpackColorSpace()}}function ns(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},o=n[0].morphTargetsRelative,c=new Kt;let h=0;for(let d=0;d<n.length;++d){const u=n[d];let p=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;a[m]===void 0&&(a[m]=[]),a[m].push(u.attributes[m]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.morphAttributes[m])}if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,m,d),h+=m}}if(t){let d=0;const u=[];for(let p=0;p<n.length;++p){const m=n[p].index;for(let x=0;x<m.count;++x)u.push(m.getX(x)+d);d+=n[p].attributes.position.count}c.setIndex(u)}for(const d in a){const u=Gu(a[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<u;++p){const m=[];for(let M=0;M<r[d].length;++M)m.push(r[d][M][p]);const x=Gu(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function Gu(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),o=new Jn(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const u=c/t;for(let p=0,m=d.count;p<m;p++)for(let x=0;x<t;x++){const M=d.getComponent(p,x);o.setComponent(p+u,x,M)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class vM extends Vf{constructor(){super();const e=new me;e.deleteAttribute("uv");const t=new W({side:In}),i=new W,s=new sd(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new z(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new dn(e,i,6),o=new It;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new z(e,wa(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new z(e,wa(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new z(e,wa(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new z(e,wa(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const p=new z(e,wa(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new z(e,wa(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function wa(n){return new wx({color:0,emissive:16777215,emissiveIntensity:n})}const Yo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ya{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const MM=new ad(-1,1,1,-1,0,1);class _M extends Kt{constructor(){super(),this.setAttribute("position",new bt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bt([0,2,0,0,2,0],2))}}const yM=new _M;class rd{constructor(e){this._mesh=new z(yM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,MM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class o0 extends Ya{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Sn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ir.clone(e.uniforms),this.material=new Sn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new rd(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Hu extends Ya{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class bM extends Ya{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class wM{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Fe);this._width=i.width,this._height=i.height,t=new _i(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new o0(Yo),this.copyPass.material.blending=Ui,this.clock=new t0}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Hu!==void 0&&(r instanceof Hu?i=!0:r instanceof bM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Fe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class SM extends Ya{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const Do={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class TM extends Ya{constructor(){super(),this.uniforms=Ir.clone(Do.uniforms),this.material=new bx({name:Do.name,uniforms:this.uniforms,vertexShader:Do.vertexShader,fragmentShader:Do.fragmentShader}),this._fsQuad=new rd(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ft.getTransfer(this._outputColorSpace)===Xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Mf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===_f?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===yf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===zh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===wf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Sf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===bf&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const EM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ga extends Ya{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Fe(e.x,e.y):new Fe(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new _i(a,r,{type:Fi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new _i(a,r,{type:Fi});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const p=new _i(a,r,{type:Fi});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),r=Math.round(r/2)}const o=EM;this.highPassUniforms=Ir.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Sn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Fe(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ir.clone(Yo.uniforms),this.blendMaterial=new Sn({uniforms:this.copyUniforms,vertexShader:Yo.vertexShader,fragmentShader:Yo.fragmentShader,blending:si,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Ct,this._fsQuad=new rd(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Fe(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ga.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ga.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new Sn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Fe(.5,.5)},direction:{value:new Fe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ga.BlurDirectionX=new Fe(1,0);Ga.BlurDirectionY=new Fe(0,1);const qr=document.querySelector("#game"),sn=new gM({canvas:qr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),Yr=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;sn.setPixelRatio(Math.min(window.devicePixelRatio,Yr?1.5:2));sn.setSize(window.innerWidth,window.innerHeight);sn.shadowMap.enabled=!Yr;sn.info.autoReset=!1;sn.shadowMap.type=vf;sn.outputColorSpace=Pt;sn.toneMapping=zh;sn.toneMappingExposure=1.12;const Te=new Vf;window.__steelRibbonScene=Te;Te.background=new rt(16764588);Te.fog=new Kh(14719602,360,2150);const l0=new xh(sn);l0.compileEquirectangularShader();Te.environment=l0.fromScene(new vM,.04).texture;Te.environmentIntensity=.58;const ye=new $n(69,window.innerWidth/window.innerHeight,.08,1800);Te.add(ye);const Xe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const Je=new Set,Ee={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},AM=new t0,en=new P(0,1,0),od=new P,ld=new P,wl=new P,an=new It,c0=.86,vh=1.2,CM=.78,Fn=.55,Be={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},Qs=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],h0=Math.max(...Qs.map(n=>n.width));let ws=0,se=Qs[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Xe.best.textContent=`Best score ${l.best}`;let Mi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Hi(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&Mi==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}Hi();function RM(){Mi=Mi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",Mi),Hi(),l.message=Mi==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const Io=[];function Ni(n,e=!1){let t=Io.find(s=>!s.busy);t||(Io.length>=4?t=Io[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Io.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Tn(n=880,e=.16,t="triangle",i=.16){if(!Ae)return;const{ctx:s}=Ae,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Ae.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let Wu=0;function PM(){if(!Ae||Ae.ctx.currentTime-Wu<.45)return;Wu=Ae.ctx.currentTime;const{ctx:n}=Ae,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),o=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,o),r.gain.linearRampToValueAtTime(.05,o+.015),r.gain.setValueAtTime(.05,o+i),r.gain.exponentialRampToValueAtTime(1e-4,o+i+.04),s.connect(r),a.connect(r),r.connect(Ae.master),s.start(o),a.start(o),s.stop(o+i+.05),a.stop(o+i+.05)}}function LM(n){const e=xe.clamp(n,0,1);return e*e*(3-2*e)}function DM(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*xe.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-LM((e-i.end)/i.settle)))}return t}function cd(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function d0(n,e){const{t,n:i}=cd(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let o=i-r.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),a+=r.amp*Math.exp(-(o*o)/(r.width*r.width))}return a+=DM(n,i),a}function Uo(n){const{x:e,z:t,n:i}=cd(se,n),s=d0(se,i);return new P(e,s,t)}function pt(n){const e=(n%se.length+se.length)%se.length,t=Uo(e),i=Uo(e+2).sub(t).normalize(),s=od.crossVectors(en,i).normalize(),a=Uo(e-2).y,r=Uo(e+2).y,o=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Oi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Xu(n){return xe.clamp(n/(se.length*se.laps),0,1)}function uc(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let a=i;a<=s;a++){const r=a*se.length+t;if(n<r&&e>=r)return!0}return!1}function IM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let o=0;o<e;o++)i.fillStyle=(o+r)%2?"#101318":"#f5f1df",i.fillRect(o*s,r*s,s,s);const a=new tn(t);return a.colorSpace=Pt,a.wrapS=zn,a.wrapT=zn,a.repeat.set(3,1),a}function UM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(r,o),t.bezierCurveTo(r+Math.random()*22-11,o+36,r+Math.random()*22-11,o+82,r+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new tn(e);return s.colorSpace=Pt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function FM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,o,0,r,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,o,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new tn(e);return s.colorSpace=Pt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(18,18),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function zM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(r,o);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(r,o);t.stroke()}const s=new tn(e);return s.colorSpace=Pt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(9,16),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function NM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new tn(e);return s.colorSpace=Pt,s}function Ta(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new tn(i);return a.colorSpace=Pt,a}function OM(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+u-2),s.moveTo(c+2,h+u*.52),s.lineTo(c+d-2,h+u*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new tn(i);return o.colorSpace=Pt,o.wrapS=zn,o.wrapT=zn,o.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),o}function kM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const o=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,o):t.lineTo(r,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new tn(e);return s.colorSpace=Pt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function BM(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new tn(t);return a.colorSpace=Pt,a}function qu(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:o}=s;a.fillStyle=t,a.fillRect(0,0,r,o),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,o-16),a.save(),a.translate(r/2,o/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new tn(s);return c.colorSpace=Pt,c}const xs=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],rl=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],gs=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function u0(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new tn(i);return r.colorSpace=Pt,r.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),r}function fc(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new tn(t);return s.colorSpace=Pt,s}function pc(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const o=new tn(s);return o.colorSpace=Pt,o.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),o}function VM(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new tn(t);return s.colorSpace=Pt,s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function GM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new tn(e);return r.colorSpace=Pt,r}function ce(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function Ea(n,e,t,i){const s=t*.5,a=i*.5;let r=ce(n,e);for(const o of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,ce(n+o,e+c));return r}function Sl(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:o,streetW:c}=Be;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((a-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const _s={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Ln(n,e,t,i,s=8){const{x0:a,x1:r,zNear:o,zFar:c,pitch:h,streetW:d}=Be,u=t*.5,p=i*.5,m=d*.5+s;let x=null;const M=(g,f,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:f,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+p<c-m||e-p>o+m)continue;const f=u+m-Math.abs(n-g);f>0&&M("x",Math.round(g),f)}for(let g=o;g>=c-1;g-=h){if(n+u<a-m||n-u>r+m)continue;const f=p+m-Math.abs(e-g);f>0&&M("z",Math.round(g),f)}return x}const ea=[],f0=[],Mn={spots:[],im:null,imW:null};function p0(n=1){const e=new Sn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return f0.push(e),e}function m0(n,e,t,i=t,s=null){ea.push({x:n,z:e,rx:t,rz:i,waterY:s})}function $s(n,e){let t=0,i=null;for(const s of ea){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,o=a*a+r*r;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=xe.clamp((s.waterY-ce(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const Da=[],mc=[],hd=[];let ol=0;function pn(n,e){return hd.push({obj:n,update:e}),n}function x0(n){ol+=n;for(const e of hd)e.update(ol,n)}function Tl(){if(mc.length===0)for(let n=0;n<Qs.length;n++){const e=Qs[n];for(let t=0;t<e.length;t+=14){const i=cd(e,t);mc.push({x:i.x,y:d0(e,t),z:i.z,s:t,courseIndex:n})}}return mc}function Pn(n,e,t=0){let i=null,s=1/0;for(const a of Tl()){const r=n-a.x,o=e-a.z,c=Math.hypot(r,o);c<s&&(s=c,i=a)}return{clearance:s-t-h0*.58,distance:s,nearestS:i?.s??0}}function ks(n,e,t,i,s,a=9){const r=t*.5,o=i*.5,c=h0*.62+a;let h=null;for(const d of Tl()){const u=Math.max(Math.abs(d.x-n)-r,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(u,p)-c;if(m>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-m>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return h}function ui(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(Pn(a.x,a.z,e).clearance>=t&&!Ln(a.x,a.z,e*2,e*2,3.5))return a}return null}function fi(n,e,t,i,s){const a=Pn(e,t,i);Da.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function HM(){const n=[...Da].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Da.length,unsafe:Da.filter(e=>e.clearance<e.margin),closest:n}}function Gn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),o=new z(new Qe(i,i,r.length(),8),s);return o.position.copy(a),o.quaternion.setFromUnitVectors(en,r.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const mn={cloudMats:[],glowMats:[]};function WM(){const n=new Ex(16757626,3097190,.66);Te.add(n);const e=new rc(7179775,.6);e.position.set(260,145,-260),Te.add(e);const t=new rc(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Te.add(t);const i=new rc(16742973,.5);i.position.set(-180,35,280),Te.add(i);const s=new sd(5556479,90,900,2);s.position.set(0,88,-920),Te.add(s),mn.hemi=n,mn.fill=e,mn.key=t,mn.rim=i}let pi=null;function XM(){const n=new P(-310,150,230).normalize();pi=new z(new Wt(1200,48,32),new Sn({side:In,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
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
        }`})),pi.renderOrder=-100,pi.frustumCulled=!1,Te.add(pi);const e=n,t=new Ct({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new z(new _n(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),pi.add(i);const s=new Ct({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:si});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const o=new z(new _n(a,48),s.clone());o.material.opacity=r,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),pi.add(o),mn.glowMats.push({mat:o.material,dusk:r})}mn.skyU=pi.material.uniforms,mn.sunMat=t}function qM(){const n=new W({map:FM(),color:8231526,roughness:.98,metalness:.02}),e=new z(new Yt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const m=t.getX(p),x=t.getY(p);t.setZ(p,ce(m,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Te.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:yt});for(let p=0;p<3;p++){const m=150-p*190,x=-760-p*420,M=980,g=64+p*18,f=new z(new Yt(980,64+p*18,1,1),i.clone());f.rotation.x=-Math.PI/2,f.rotation.z=-.34+p*.03,f.position.set(m,Ea(m,x,M,g)-.55,x),f.renderOrder=-4,Te.add(f)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let p=0;p<46;p++){const m=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[ce(x,M)];for(let y=0;y<6;y++)g.push(ce(x+Math.cos(y)*m*.9,M+Math.sin(y*1.9)*m*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const f=new z(new _n(m,9),s[p%s.length]);f.rotation.x=-Math.PI/2,f.rotation.z=Math.random()*Math.PI,f.position.set(x,Math.max(...g)+.07,M),f.scale.y=.32+Math.random()*.5,f.receiveShadow=!0,Te.add(f)}const a=new Ct({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const m=new z(new _n(70+Math.random()*150,22),a.clone());m.material.opacity=.008+Math.random()*.014,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),m.position.y<8&&_s.lowFogDisks++,m.scale.y=.22+Math.random()*.26,m.renderOrder=-6,Te.add(m)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let p=0;p<52;p++){const m=78+Math.random()*180,x=52+Math.random()*115,M=ui(f=>{const y=p/52*Math.PI*2+f*1.77,v=1380+Math.random()*820+f*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!M)continue;const g=new z(new Ri(x,m,5+Math.floor(Math.random()*2)),r[p%r.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Te.add(g),fi("mountain",M.x,M.z,x,480),m>160){const f=new z(new Ri(x*.34,m*.22,5),o);f.position.copy(g.position).add(new P(0,m*.39,0)),f.rotation.y=g.rotation.y,Te.add(f)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const p=new Qe(.28,.42,1,6).translate(0,.5,0),m=ns([new Ri(2.7,5.4,7).translate(0,1.9,0),new Ri(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Ri(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),M=new dn(p,c,185),g=new dn(m,new W({roughness:.92}),185),f=new It;let y=0;for(let v=0;v<185;v++){const _=.58+Math.random()*1.05,E=8*_,T=ui(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:A,z:R}=T;if(Sl(A,R,18))continue;const S=ce(A,R)+.8,b=2.2+Math.random()*3.8;f.position.set(A,S,R),f.rotation.y=Math.random()*Math.PI,f.scale.set(_,b,_),f.updateMatrix(),M.setMatrixAt(y,f.matrix),f.position.set(A,S+b,R),f.scale.set(_,_,_),f.updateMatrix(),g.setMatrixAt(y,f.matrix),g.setColorAt(y,x[v%3]),y++,fi("tree",A,R,E,145)}M.count=y,g.count=y,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Te.add(M),Te.add(g)}{const p=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),f=(v,_)=>Math.sin(x*_+v*37.7)*.5+.5;for(let v=0;v<16;v++){const _=v/15,E=Math.sin(_*Math.PI),T=24+_*208,A=66+(f(v,53)-.5)*22*E,R=(18+f(v,29)*22)*(.45+E*.75),S=g.createRadialGradient(T,A-R*.18,0,T,A,R);S.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),S.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),S.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=S,g.beginPath(),g.arc(T,A,R,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const _=.12+v/9*.76,E=_*256,T=20+f(v,71)*16,A=g.createRadialGradient(E,92,0,E,92,T);A.addColorStop(0,"rgba(255, 176, 128, 0.22)"),A.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=A,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const y=new tn(M);return y.colorSpace=Pt,y},m=[p(1),p(2),p(3)];Me.cloudSprites=0;for(let x=0;x<44;x++){const M=new gl({map:m[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new nl(M),f=170+Math.random()*280;g.scale.set(f,f*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Te.add(g),Me.cloudSprites++,pn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const m=new nt,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,f=new z(new me(M,x,g),h[p%h.length]);f.position.y=x/2,f.castShadow=!0,f.receiveShadow=!0,m.add(f);const y=Ta(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const A of[-1,1]){const R=new z(new Yt(M*.82,x*.74),v);R.position.set(0,x*.53,A*(g/2+.08)),R.rotation.y=A<0?Math.PI:0,m.add(R)}const _=new z(new me(M*1.08,1.2,g*1.08),d);if(_.position.y=x+.7,m.add(_),Math.random()<.32){const A=new z(new Qe(.18,.3,10+Math.random()*12,8),d);A.position.y=x+6.5,m.add(A)}const E=Math.hypot(M,g)*.65,T=ui(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(m.position.set(T.x,Ea(T.x,T.z,M,g)-.7,T.z),m.rotation.y=Math.random()*Math.PI,Te.add(m),fi("building",T.x,T.z,E,240))}const u=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const m=new nt,x=xs[p%xs.length],M=rl[(p*3+1)%rl.length],g=gs[p%gs.length],f=new W({map:u0(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,_=new z(new me(y,v,.5),f);_.position.y=10,m.add(_);const E=new z(new me(y+1.2,.32,.75),u);E.position.y=10+v*.5+.25,m.add(E);for(const A of[-7,7]){const R=new z(new Qe(.24,.32,10,8),u);R.position.set(A,5,-.2),m.add(R)}const T=ui(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);T&&(m.position.set(T.x,ce(T.x,T.z)+.5,T.z),m.rotation.y=-.35+Math.random()*.7,Te.add(m),fi("billboard",T.x,T.z,22,175),Bs("roadside-billboard",T.x,m.position.y+10,T.z))}}function YM(){for(let f=0;f<3;f++){const y=[4012638,5326704,7035525][f],v=new Ct({color:y,transparent:!0,opacity:.6-f*.14,depthWrite:!1,fog:!1}),_=60,E=5200,T=new Yt(E,360,_,1),A=T.attributes.position;for(let S=0;S<=_;S++){const b=S/_,L=(Math.sin(b*22+f*3)*.5+Math.sin(b*9+f)*.5)*70+120;A.setY(S,L),A.setY(S+_+1,-180)}A.needsUpdate=!0;const R=new z(T,v);R.position.set(0,40,-2300-f*360),Te.add(R)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let f=0;f<48;f++){const y=.7+Math.random()*1.2,v=9*y,_=ui(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!_)continue;const{x:E,z:T}=_;if(Sl(E,T,18))continue;const A=ce(E,T)+.6,R=new nt,S=2.6+Math.random()*3.4,b=new z(new Qe(.34,.5,S,6),n);b.position.y=S/2,R.add(b);const L=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let V=0;V<I;V++){const j=2.4+Math.random()*1.8,te=new z(new Wt(j,9,7),L);te.position.set((Math.random()-.5)*3,S+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,R.add(te)}R.position.set(E,A,T),R.scale.setScalar(y),Te.add(R),fi("tree",E,T,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:yt}),new W({color:9077368,roughness:1,flatShading:!0,side:yt}),new W({color:6249043,roughness:1,flatShading:!0,side:yt})];for(let f=0;f<70;f++){const y=2+Math.random()*7,v=ui(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:_,z:E}=v,T=new z(new nd(y,0),t[f%t.length]),A=T.geometry.attributes.position;for(let R=0;R<A.count;R++)A.setXYZ(R,A.getX(R)*(.8+Math.random()*.4),A.getY(R)*(.6+Math.random()*.4),A.getZ(R)*(.8+Math.random()*.4));A.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(_,ce(_,E)+y*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Te.add(T),xi.push({kind:"rock",x:_,z:E,radius:y*1.12}),fi("rock",_,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let f=0;f<14;f++){const y=130+Math.random()*200,v=130+Math.random()*200,_=ui(()=>{for(let L=0;L<6;L++){const I=-1500+Math.random()*3e3,V=-700-Math.random()*1700,j=[ce(I,V),ce(I+y*.45,V+v*.45),ce(I-y*.45,V+v*.45),ce(I+y*.45,V-v*.45),ce(I-y*.45,V-v*.45)];if(Math.max(...j)-Math.min(...j)<1)return{x:I,z:V}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!_||_.x>9e4)continue;const{x:E,z:T}=_,A=new nt,R=5+Math.floor(Math.random()*4),S=i[Math.floor(Math.random()*i.length)];for(let L=0;L<R;L++){const I=new W({color:L%2?S:i[Math.floor(Math.random()*i.length)],roughness:1}),V=new z(new Yt(y,v/R),I);V.rotation.x=-Math.PI/2,V.position.set(0,.05,-v/2+(L+.5)*(v/R)),A.add(V)}const b=Math.max(ce(E,T),ce(E+y*.45,T+v*.45),ce(E-y*.45,T+v*.45),ce(E+y*.45,T-v*.45),ce(E-y*.45,T-v*.45));A.position.set(E,b+.06,T),A.rotation.y=Math.random()*Math.PI,Te.add(A),fi("field",E,T,Math.max(y,v)*.5,40)}{const f=ui(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(f){const y=[ce(f.x,f.z)];for(let E=0;E<8;E++)y.push(ce(f.x+Math.cos(E/8*Math.PI*2)*110,f.z+Math.sin(E/8*Math.PI*2)*74),ce(f.x+Math.cos(E/8*Math.PI*2)*200,f.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,T)=>E-T);const v=y[4]+.4,_=new z(new _n(150,48),p0(9));_.rotation.x=-Math.PI/2,_.position.set(f.x,v,f.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Te.add(_),m0(f.x,f.z,222,148,v),_s.waterBlockers++,fi("lake",f.x,f.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let f=0;f<9;f++){const y=f/9*Math.PI*2+.6,v=1500+Math.random()*700,_=Math.cos(y)*v,E=Math.sin(y)*v-1150,T=60+Math.random()*40,A=new nt,R=new z(new Qe(1.1,2.2,T,10),s);R.position.y=T/2,A.add(R);const S=new nt;S.position.set(0,T,3);const b=new z(new me(3,3,7),s);S.add(b);const L=new nt;L.position.z=3.5;for(let V=0;V<3;V++){const j=new z(new me(1.1,26,.5),s);j.position.y=13;const te=new nt;te.add(j),te.rotation.z=V/3*Math.PI*2,L.add(te)}S.add(L),A.add(S),A.position.set(_,-8,E),A.rotation.y=Math.random()*Math.PI,Te.add(A);const I=.5+Math.random()*.5;pn(L,V=>{L.rotation.z=V*I})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new il({color:2764595,transparent:!0,opacity:.5});let o=null;for(let f=0;f<7;f++){const y=-1100+f*360,v=-1650-Math.sin(f*.7)*120,_=48,E=new nt,T=6;for(const R of[-1,1])for(const S of[-1,1]){const b=new z(new Qe(.4,.7,_,5),a);b.position.set(R*T,_/2,S*T),b.rotation.z=-R*.08,b.rotation.x=S*.08,E.add(b)}for(const R of[_*.6,_*.82,_]){const S=new z(new me(T*4,.8,.8),a);S.position.y=R,E.add(S)}E.position.set(y,ce(y,v)-2,v),Te.add(E);const A=ce(y,v)-2+_;if(o)for(const R of[-T*2,0,T*2]){const S=o.x+R,b=o.z,L=y+R,I=v,V=[],j=12;for(let q=0;q<=j;q++){const K=q/j,ne=Math.sin(K*Math.PI)*6;V.push(new P(S+(L-S)*K,o.y-ne+(A-o.y)*K,b+(I-b)*K))}const te=new uh(new Kt().setFromPoints(V),r);Te.add(te)}o={x:y,y:A,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let f=0;f<5;f++){const y=ui(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:_}=y,E=70+Math.random()*50,T=new nt,A=8;for(let L=0;L<A;L++){const I=new z(new Qe(.5,.7,E/A,4),L%2?h:c);I.position.y=(L+.5)*(E/A),I.rotation.y=Math.PI/4,T.add(I)}const R=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),S=new z(new Wt(1.1,10,8),R);S.position.y=E+1,T.add(S),T.position.set(v,ce(v,_),_),Te.add(T),fi("mast",v,_,8,120);const b=Math.random()*Math.PI*2;pn(S,L=>{R.emissiveIntensity=Math.sin(L*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let f=0;f<6;f++){const y=new nt,v=d[f%d.length],_=new W({map:a_(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new z(new Wt(11,20,16),_);E.scale.y=1.25,y.add(E);const T=new z(new me(3.4,3,3.4),new W({color:8014371,roughness:.9}));T.position.y=-17,y.add(T);const A=new il({color:3811866});for(const I of[-1,1])for(const V of[-1,1]){const j=new uh(new Kt().setFromPoints([new P(I*1.6,-15.5,V*1.6),new P(I*7,-3,V*7)]),A);y.add(j)}const R=-700+Math.random()*1400,S=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(R,b,S),Te.add(y);const L=Math.random()*Math.PI*2;pn(y,I=>{y.position.y=b+Math.sin(I*.5+L)*6,y.position.x=R+Math.sin(I*.08+L)*90,y.rotation.z=Math.sin(I*.4+L)*.04})}const u=new Ct({color:2829104,side:yt,fog:!1});function p(){const f=new td;return f.moveTo(0,0),f.lineTo(-2.6,1.1),f.lineTo(-2.2,.2),f.lineTo(0,.5),f.lineTo(2.2,.2),f.lineTo(2.6,1.1),f.lineTo(0,0),new z(new _l(f),u)}for(let f=0;f<5;f++){const y=new nt,v=5+Math.floor(Math.random()*5),_=[];for(let L=0;L<v;L++){const I=p(),V=L%2?1:-1,j=Math.ceil(L/2);I.position.set(V*j*5,-j*2.4,0),I.rotation.x=-Math.PI/2,y.add(I),_.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,A=18+Math.random()*14,R=1400,S=-700+Math.random()*1400;y.position.set(S,E,T),Te.add(y);const b=Math.random()*Math.PI*2;pn(y,(L,I)=>{y.position.x+=A*I,y.position.x>R&&(y.position.x=-R);const V=Math.sin(L*6+b);for(const j of _)j.rotation.x=-Math.PI/2+V*.4})}{const f=new nt,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new z(new Wt(20,20,16),y);v.scale.set(2.6,1,1),f.add(v);const _=new W({color:13781835,roughness:.6});for(let S=0;S<3;S++){const b=new z(new me(10,9,.6),_);b.position.x=-46,b.rotation.x=S/3*Math.PI*2,f.add(b)}const E=new z(new me(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,f.add(E);const T=new z(new Yt(40,10),new Ct({map:fd("STEEL RIBBON"),transparent:!0,side:yt}));T.position.set(60,0,0),f.add(T);const A=900,R=240;f.position.set(0,R,-1200),Te.add(f),pn(f,S=>{const b=S*.05;f.position.x=Math.cos(b)*A,f.position.z=-1200+Math.sin(b)*A*.5,f.position.y=R+Math.sin(S*.3)*8,f.rotation.y=-b+Math.PI/2})}const m=new Ct({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let f=0;f<14;f++){const y=new z(new Yt(220+Math.random()*360,16+Math.random()*22),m.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Te.add(y);const v=2+Math.random()*3;pn(y,(_,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),M=new Ct({map:r_(),side:yt});for(let f=0;f<4;f++){const y=ui(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:_}=y,E=new nt,T=60+Math.random()*40,A=new z(new me(T,1.4,26),x);A.position.set(0,26,-4),A.rotation.x=-.32,E.add(A);const R=new z(new Yt(T*.94,24),M);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const S of[-T/2,T/2]){const b=new z(new me(1.4,26,1.4),x);b.position.set(S,13,-8),E.add(b)}E.position.set(v,ce(v,_),_),E.rotation.y=Math.atan2(-v,-_)+(Math.random()-.5)*.5,Te.add(E),fi("grandstand",v,_,40,30)}const g=[16731486,16765503,16777215,11824127];for(let f=0;f<90;f++){const y=ui(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:_}=y,E=new nt,T=g[Math.floor(Math.random()*g.length)],A=new Ct({color:T,side:yt}),R=5+Math.floor(Math.random()*6);for(let S=0;S<R;S++){const b=new z(new _n(.5+Math.random()*.4,5),A);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,ce(v,_),_),Te.add(E),fi("flowers",v,_,3,20)}}const un=[],ni=[];let Mh=0;const xi=[],na=[],En=[],_h=[],Ss=[],Ia=[],Me={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},ll=[];function Bs(n,e,t,i){Me.signs++,ll.length<160&&ll.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function ds(n,e,t=1){Me[n][e]=(Me[n][e]||0)+t}let Fo=null,Yu=null;function dd(){return Fo||(Fo=new W({vertexColors:!0,roughness:.42,metalness:.22}),Fo.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},Yu=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:Fo,glass:Yu}}const us=new rt;function jt(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,o=new Float32Array(r*3),c=new Float32Array(r*3);us.set(t??16777215);for(let h=0;h<r;h++)o[h*3]=us.r,o[h*3+1]=us.g,o[h*3+2]=us.b;if(i){us.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=us.r,c[h*3+1]=us.g,c[h*3+2]=us.b}return a.setAttribute("color",new bt(o,3)),a.setAttribute("aEmissive",new bt(c,3)),a}function hn(n,e,t,i=0){return(i?new _t().makeRotationZ(i):new _t).setPosition(n,e,t)}function $r(n,e){const t=new nt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=dd(),o=n==="taxi"?16767293:e,c=new rt(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(jt(new me(s.w,s.h,s.l),hn(0,.95,0),o)),(s.bus?d:h).push(jt(new me(s.cabin[0],s.cabin[1],s.cabin[2]),hn(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(jt(new me(s.cabin[0]*.78,s.cabin[1]*.55,.08),hn(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(jt(new me(.08,s.cabin[1]*.5,s.cabin[2]*.48),hn(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(jt(new me(s.w*.94,.58,s.l*.38),hn(0,1.2,1.35),c)),s.box&&h.push(jt(new me(s.box[0],s.box[1],s.box[2]),hn(0,1.55,1.25),15130833)),s.bus){h.push(jt(new me(s.w+.06,.28,s.l*.86),hn(0,1.38,0),c));const y=new me(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const _ of[-1,1])d.push(jt(y,hn(_*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(jt(new me(1,.24,.46),hn(0,2.2,-.35),16774310,16765773,.9));const u=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],p=[],m=ns([jt(new Qe(.42,.42,.36,14),hn(0,0,0,Math.PI/2),395016),jt(new Qe(.18,.18,.38,10),hn(0,0,0,Math.PI/2),14147041)],!1),x=new me(.3,.34,1.12);for(const y of u)for(const v of[-s.w*.54,s.w*.54]){const _=new z(m,a);_.position.set(v,.45,y),t.add(_),p.push(_),h.push(jt(x,hn(v*1.02,.72,y),1250072))}const M=new me(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(jt(M,hn(0,.62,y),1250072));const g=new me(.42,.2,.1),f=new me(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(jt(g,hn(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(jt(f,hn(y,.98,s.l*.52+.04),16725033,16717325,1.45));return t.add(new z(ns(h,!1),a)),d.length&&t.add(new z(ns(d,!1),r)),t.userData={wheels:p,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55,plateHalfL:s.l/2},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function ud(n,e){const t=new nt,{opaque:i}=dd(),s=new Wt(.25,8,5);s.scale(1,.5,1),t.add(new z(ns([jt(new Qe(.28,.34,.95,8),hn(0,1.35,0),n),jt(new Wt(.24,10,8),hn(0,2.02,0),12947299),jt(s,hn(0,2.17,0),1119001)],!1),i));const a=[],r=jt(new Qe(.075,.09,.78,6),null,e),o=jt(new Qe(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new z(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new z(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}const $u="BCDFGHJKLMNPRSTVWXZ",$M=["FCK","SHT","DCK","CNT","KKK","WTF","FML","NGR","FGT","SLT","DMN","BTC","JZZ"],zo=340;function ZM(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}let No=null;function KM(){if(No)return No;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<64;s++){const a=ZM(335585+s*2654435761);let r="";do{r="";for(let d=0;d<3;d++)r+=$u[a()*$u.length|0]}while($M.includes(r));r+=" ";for(let d=0;d<3;d++)r+=a()*10|0;t.push(r);const o=s%8*128,c=(s/8|0)*64,h=s%9===3;e.fillStyle=h?"#f3d268":"#ece9dc",e.fillRect(o+6,c+8,116,48),e.strokeStyle="#25304d",e.lineWidth=3,e.strokeRect(o+7.5,c+9.5,113,45),e.fillStyle="#1c2848",e.textAlign="center",e.textBaseline="middle",e.font="bold 30px 'Courier New', monospace",e.fillText(r,o+64,c+38),e.font="bold 10px sans-serif",e.fillText("STEEL STATE",o+64,c+17)}const i=new tn(n);return i.colorSpace=Pt,i.anisotropy=4,No={texture:i,texts:t},No}const JM=new P(1,1,1),xc=new _t,Oo=new _t,Pi={mesh:null,texts:null,statics:[],dynamics:[],_zero:new _t().makeScale(0,0,0),ensure(){if(this.mesh)return;const{texture:n,texts:e}=KM();this.texts=e;const t=new Yt(.55,.17);t.setAttribute("aPlateSlot",new dh(new Float32Array(zo*2),2));const i=new Ct({map:n});i.customProgramCacheKey=()=>"plate-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aPlateSlot;
varying vec2 vPlateUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPlateUv = uv * 0.125 + aPlateSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vPlateUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vPlateUv );")},this.mesh=new dn(t,i,zo),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;for(let s=0;s<zo;s++)this.mesh.setMatrixAt(s,this._zero);Te.add(this.mesh)},_slot(n){const e=n%64;return{u:e%8*.125,v:(7-(e/8|0))*.125,s:e}},_offsets(n,e=.03){return{offF:new _t().makeRotationY(Math.PI).setPosition(0,.62,-(n+e)),offR:new _t().setPosition(0,.62,n+e)}},resetStatic(){this.ensure(),this.statics.length=0;for(let n=0;n<260;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},resetDynamic(){this.ensure(),this.dynamics.length=0;for(let n=260;n<zo;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},addStatic(n,e,t,i){if(this.ensure(),this.statics.length>=130)return;const s=this.statics.length*2,{u:a,v:r,s:o}=this._slot(t*13+29),c={matrix:n.clone(),spot:i,wasTaken:null,iF:s,iR:s+1,slot:o,...this._offsets(e)},h=this.mesh.geometry.getAttribute("aPlateSlot");h.setXY(c.iF,a,r),h.setXY(c.iR,a,r),h.needsUpdate=!0,this.statics.push(c),this._applyStatic(c)},_applyStatic(n){n.wasTaken=!!(n.spot&&n.spot.taken),n.wasTaken?(this.mesh.setMatrixAt(n.iF,this._zero),this.mesh.setMatrixAt(n.iR,this._zero)):(this.mesh.setMatrixAt(n.iF,Oo.multiplyMatrices(n.matrix,n.offF)),this.mesh.setMatrixAt(n.iR,Oo.multiplyMatrices(n.matrix,n.offR))),this.mesh.instanceMatrix.needsUpdate=!0},addDynamic(n,e){if(this.ensure(),this.dynamics.length>=40)return;const t=260+this.dynamics.length*2,{u:i,v:s,s:a}=this._slot(e*37+11),r=this.mesh.geometry.getAttribute("aPlateSlot");r.setXY(t,i,s),r.setXY(t+1,i,s),r.needsUpdate=!0,this.dynamics.push({carMesh:n,iF:t,iR:t+1,slot:a,...this._offsets(n.userData.plateHalfL||2.2,.155)})},update(){if(!(!this.mesh||!this.dynamics.length)){for(const n of this.dynamics)xc.compose(n.carMesh.position,n.carMesh.quaternion,JM),this.mesh.setMatrixAt(n.iF,Oo.multiplyMatrices(xc,n.offF)),this.mesh.setMatrixAt(n.iR,Oo.multiplyMatrices(xc,n.offR));for(const n of this.statics)!!(n.spot&&n.spot.taken)!==n.wasTaken&&this._applyStatic(n);this.mesh.instanceMatrix.needsUpdate=!0}}},yh=40,Zu=[[["running late again","me"],["the ribbon jam??","them"],["every. time.","me"]],[["pizza tonight?","them"],["obviously","me"],["extra olives","them"]],[["did u see that stunt","me"],["the triple flip?!","them"],["unreal","me"]],[["buy milk pls","them"],["on it","me"],["and cookies","them"]],[["gate 8 is glowing","me"],["on my way!!","them"]],[["new high score","me"],["screenshot or it","them"],["didn't happen","them"]],[["taxi 27 honked at me","me"],["classic 27","them"]],[["lost my parking spot","me"],["someone STOLE it??","them"],["drove right off","me"]]];let ko=null;function jM(){if(ko)return ko;const n=document.createElement("canvas");n.width=512,n.height=512;const e=n.getContext("2d");for(let i=0;i<8;i++){const s=i%4*128,a=(i/4|0)*256,r=Zu[i%Zu.length];e.fillStyle="#101823",e.fillRect(s,a,128,256),e.fillStyle="#1c2a3a",e.fillRect(s,a,128,26),e.fillStyle="#9fd6ff",e.font="bold 14px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("chat",s+64,a+14),e.font="bold 16px sans-serif",e.textAlign="left";let o=a+42;for(const[c,h]of r){const d=h==="me",u=Math.min(116,e.measureText(c).width+14),p=d?s+124-u:s+4;e.fillStyle=d?"#2f7fd4":"#2a3546",e.beginPath(),e.roundRect(p,o,u,34,10),e.fill(),e.fillStyle="#eaf4ff",e.fillText(c,p+7,o+18),o+=42}}const t=new tn(n);return t.colorSpace=Pt,t.anisotropy=4,ko={texture:t,mat:new Ct({map:t})},ko}const Aa={kits:null,pool:0,_timer:0,ensure(){if(this.kits)return;this.pool=Yr?4:8;const{opaque:n}=dd(),e=[1976625,3153952,5985575,2503224,4400680,1710618,5124895,3355970],t=[9067082,7952701,10707786,8341813,9067082,7952701,10707786,8341813],i=[3087378,1975326,4022546,3087378,1975326,4022546,3087378,1975326];this.kits=[];for(let s=0;s<this.pool;s++){const a=[],r=new Wt(.038,6,5),o=new me(.078,.02,.02),c=new Wt(.03,6,5),h=new me(.09,.022,.02);for(const b of[-.085,.085])a.push(jt(r,hn(b,2.06,-.198),1842476)),a.push(jt(o,hn(b,2.118,-.207),i[s%i.length]));a.push(jt(c,hn(0,2,-.229),11893070)),a.push(jt(h,hn(0,1.935,-.216),t[s%t.length]));const d=new z(ns(a,!1),n),u=jt(new Wt(.056,6,5),null,12947299),p=jt(new me(.13,.07,.24),null,e[s%e.length]),m=new z(u,n),x=new z(u,n),M=new z(p,n),g=new z(p,n);m.position.set(0,-.38,0),x.position.set(0,-.38,0),M.position.set(0,-.42,-.045),g.position.set(0,-.42,-.045);const f=jM(),y=new nt,v=new z(jt(new me(.075,.15,.014),null,1315356),n),_=new Yt(.062,.128),E=s%4*.25,T=1-((s/4|0)+1)*.5,A=_.attributes.uv;for(let b=0;b<A.count;b++)A.setXY(b,E+A.getX(b)*.25,T+A.getY(b)*.5);const R=new z(_,f.mat);R.position.z=.0095,y.add(v),y.add(R),y.position.set(.34,1.47,-.36),y.quaternion.setFromUnitVectors(new P(0,0,1),new P(-.34,.55,.36).normalize());const S={face:d,handL:m,handR:x,shoeL:M,shoeR:g,phone:y,texting:!1,ped:null};for(const b of[d,m,x,M,g,y,v,R])b.userData.kitPart=!0,b.castShadow=!1,b.receiveShadow=!0;this.kits.push(S)}},attach(n,e,t){const i=e.mesh,s=i.userData.limbs||[];i.add(n.face),s[0]?.mesh.add(n.shoeL),s[1]?.mesh.add(n.shoeR),s[2]?.mesh.add(n.handL),s[3]?.mesh.add(n.handR),n.texting=!!t,n.texting&&i.add(n.phone),n.ped=e},detach(n){for(const e of[n.face,n.handL,n.handR,n.shoeL,n.shoeR,n.phone])e.removeFromParent();n.ped=null,n.texting=!1},reset(){if(this.kits)for(const n of this.kits)n.ped&&this.detach(n)},promotedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.ped?1:0),0):0},update(n){if(!Ss.length){this.reset();return}if(this.kits){for(const o of this.kits)if(o.ped&&o.texting){const c=o.ped.mesh.userData.limbs?.[3]?.mesh;c&&(c.rotation.x=-2.05,c.position.y=1.33)}}if(this._timer-=n,this._timer>0)return;this._timer=.35,this.ensure();const e=ye.position.x,t=ye.position.z,i=yh*yh,s=[];for(let o=0;o<Ss.length;o++){const c=Ss[o];if(!c.active||!c.mesh.visible)continue;const h=c.x-e,d=c.z-t,u=h*h+d*d;u<i&&s.push({a:c,idx:o,d2:u})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool),r=new Set(a.map(o=>o.a));for(const o of this.kits)o.ped&&(!r.has(o.ped)||!o.ped.active||!o.ped.mesh.visible)&&this.detach(o);for(const o of a){const c=this.kits[o.idx%this.pool];c.ped!==o.a&&(c.ped&&r.has(c.ped)||(c.ped&&this.detach(c),this.attach(c,o.a,o.idx%3===0)))}}};function QM(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,x=[],M=[];for(let D=i;D<=s+1;D+=o)x.push(Math.round(D));for(let D=a;D>=r-1;D-=o)M.push(Math.round(D));M.sort((D,Ce)=>D-Ce);const g=x[0],f=x[x.length-1],y=M[0],v=M[M.length-1];En.length=0,_h.length=0,Ss.length=0,Ia.length=0,Me.traffic=0,Me.pedestrians=0,Me.types={},Me.turns=0,Me.splats=0,Me.trafficCrashes=0,Me.streetLights=0,Me.trafficLights=0,Me.stopSigns=0,Pi.resetDynamic(),Aa.reset();const _=D=>D[Math.random()*D.length|0],E=D=>(D>0?-1:1)*c*.23,T=(D,Ce)=>{let be=0,Re=1/0;for(let $=0;$<D.length;$++){const Z=Math.abs(D[$]-Ce);Z<Re&&(Re=Z,be=$)}return be},A=(D,Ce,be)=>{const Re=D==="ns"?M:x;if(be>0){for(const $ of Re)if($>Ce+.05)return $;return Re[Re.length-1]}for(let $=Re.length-1;$>=0;$--)if(Re[$]<Ce-.05)return Re[$];return Re[0]},R=D=>{const Ce=D.laneOffset+(D.avoidOffset||0);return D.axis==="ns"?{x:D.road+Ce,z:D.along}:{x:D.along,z:D.road+Ce}},S=D=>{if(l.mode!=="roam")return null;const Ce=R(D);if(Math.abs(l.roamPos.y-(ce(Ce.x,Ce.z)+Fn))>4.2)return null;const be=D.axis==="ns"?0:D.dir,Re=D.axis==="ns"?D.dir:0,$=l.roamPos.x-Ce.x,Z=l.roamPos.z-Ce.z,we=$*be+Z*Re,Pe=D.axis==="ns"?$:Z,ke=Math.abs(Pe),tt=Math.hypot($,Z),kt=D.mesh?.userData?.colliderHalfW||2,at=D.mesh?.userData?.colliderHalfD||3;return tt<Dn+Math.max(kt,at)*.55||we>-1.5&&we<at+4.2&&ke<Dn+kt*.85?{crash:!0}:we>0&&we<30&&ke<c*.36?{avoidOffset:(Pe>=0?-1:1)*D.maxAvoidOffset,stop:we<13&&ke<Dn+kt*.95}:null},b=(D,Ce)=>`${Math.round(D)},${Math.round(Ce)}`,L=(D,Ce)=>{const be=((Ce+D.phase)%15.5+15.5)%15.5;return be<6.2?"ns":be<7.4?"yellow-ns":be<13.6?"ew":"yellow-ew"},I=(D,Ce)=>{const be=D.axis==="ns"?D.road:D.next,Re=D.axis==="ns"?D.next:D.road,$=b(be,Re),Z=h.get($);if(!Z)return null;if(Z.type==="signal"){const we=L(Z,Ce),Pe=we===`yellow-${D.axis}`;return we===D.axis&&!Pe?null:{control:Z,key:$,kind:"signal"}}return Z.type==="stop"&&D.lastControlKey!==$?{control:Z,key:$,kind:"stop"}:null},V=(D,Ce=!1)=>{const be=D.axis,Re=D.along,$=be==="ns"?x:M,Z=D.road,we=T($,Z),Pe=[],ke=be==="ns"?y:g,tt=be==="ns"?v:f;!Ce&&Re+D.dir*o>=ke&&Re+D.dir*o<=tt&&Pe.push({axis:be,road:D.road,along:Re,dir:D.dir,turn:!1}),we>0&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:Z,dir:-1,turn:!0}),we<$.length-1&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:Z,dir:1,turn:!0}),Pe.length||Pe.push({axis:be,road:D.road,along:Re,dir:-D.dir,turn:!0});const kt=Pe.filter(zt=>zt.turn),at=!Ce&&kt.length&&Math.random()<.42?_(kt):_(Pe);(at.turn||at.axis!==be)&&Me.turns++,D.axis=at.axis,D.road=at.road,D.along=at.along,D.dir=at.dir,D.laneOffset=E(D.dir),D.next=A(D.axis,D.along,D.dir),D.turnBlend=at.turn?1:0,D.lastControlKey=null};for(let D=0;D<m;D++){const Ce=Math.random()<.56?"ns":"ew",be=u[D%u.length],Re=Math.random()<.5?-1:1,$=(be==="bus"||be==="boxTruck"?10:13)+Math.random()*9,Z={axis:Ce,dir:Re,type:be,road:_(Ce==="ns"?x:M),laneOffset:E(Re),along:_(Ce==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:$r(be,d[D*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};Z.collider.actor=Z,D<8&&(Z.axis="ns",Z.dir=-1,Z.laneOffset=E(Z.dir),Z.road=[210,-50,210,-50][D%4],Z.along=318-D*54,Z.speed+=3),Z.next=A(Z.axis,Z.along,Z.dir),En.push(Z.collider),p.push(Z),_h.push(Z),n.add(Z.mesh),Pi.addDynamic(Z.mesh,D),Me.types[be]=(Me.types[be]||0)+1}function j(D,Ce=0,be=0){if(D.stolen)return;let Re=Math.max(0,D.speed*be);D.panicT>0?(D.panicT-=be,Re*=.32,D.brakePulse=1,D.avoidOffset+=(Math.sign(D.laneOffset||1)*2.1-D.avoidOffset)*Math.min(1,be*3),D.honked||(D.honked=!0,PM())):D.honked=!1;const $=S(D);for($?.crash?(Y0(D,l.roamPos),Re=0):$?(D.avoidOffset+=($.avoidOffset-D.avoidOffset)*Math.min(1,be*4.5),D.brakePulse=Math.max(D.brakePulse||0,$.stop?1:.35),$.stop&&(D.waitTimer=Math.max(D.waitTimer,.22),Re=0)):D.avoidOffset+=(0-D.avoidOffset)*Math.min(1,be*1.8),D.crashTimer>0&&(D.crashTimer=Math.max(0,D.crashTimer-be),Re=0),D.waitTimer>0&&(D.waitTimer=Math.max(0,D.waitTimer-be),Re=0);Re>0;){const k=I(D,Ce);if(k){const Mt=D.next-D.dir*(k.kind==="signal"?12:8),Nt=(Mt-D.along)*D.dir;if(Nt>=-.35&&Nt<=Re+.25){D.along=Mt,D.brakePulse=1,Re=0,k.kind==="stop"&&(D.waitTimer=.65+Math.random()*.4,D.lastControlKey=k.key);break}}const wt=Math.abs(D.next-D.along);if(Re<wt)D.along+=D.dir*Re,Re=0;else{D.along=D.next,Re-=wt;const Mt=D.next<=(D.axis==="ns"?y:g)+.05||D.next>=(D.axis==="ns"?v:f)-.05;V(D,Mt)}}D.brakePulse=Math.max(0,(D.brakePulse||0)-be*3.2),D.turnBlend=Math.max(0,D.turnBlend-be*3.2);const{x:Z,z:we}=R(D),Pe=D.axis==="ns"?0:D.dir,ke=D.axis==="ns"?D.dir:0;D.mesh.position.set(Z,ce(Z,we)+.28+Math.sin(Ce*3.2+D.bob)*.035,we);const tt=Math.atan2(-Pe,-ke),kt=Math.atan2(Math.sin(tt-D.mesh.rotation.y),Math.cos(tt-D.mesh.rotation.y));D.mesh.rotation.y+=kt*Math.min(1,be*7+D.turnBlend*.55),D.crashTimer>0&&(D.mesh.rotation.y+=Math.sin(Ce*22+D.bob)*.02);for(const k of D.mesh.userData.wheels||[])k.rotation.x-=D.dir*D.speed*be*1.7;const at=D.mesh.userData.colliderHalfD,zt=D.mesh.userData.colliderHalfW;D.collider.x=Z,D.collider.z=we,D.collider.hw=D.axis==="ns"?zt:at,D.collider.hd=D.axis==="ns"?at:zt,D.collider.maxY=D.mesh.position.y+3.2}for(const D of p)j(D,0,0);Me.traffic=p.length,pn(n,(D,Ce)=>{for(const be of p)j(be,D,Ce);Pi.update()});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],K=[],ne=45;for(let D=0;D<ne;D++){const Ce=Math.random()<.56?"ns":"ew",be=e[Math.random()*e.length|0],Re=Math.abs(be.z1-be.z0)>Math.abs(be.x1-be.x0),$=Ce==="ns"?Re?"ns":"ew":Re?"ew":"ns",Z=Math.random()<.5?-1:1,we=Math.random()<.5?-1:1,Pe={axis:$,dir:Z,sideSign:we,coord:_($==="ns"?x:M),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:ud(te[D%te.length],q[D*2%q.length])};D<14&&(Pe.axis="ns",Pe.coord=80,Pe.sideSign=D%2?-1:1,Pe.dir=D%3===0?1:-1,Pe.along=350-D*24,Pe.speed=1.5+D%4*.35),K.push(Pe),Ss.push(Pe),Pe.mesh.traverse(ke=>ke.castShadow=!1),n.add(Pe.mesh)}const fe=new Ct({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:yt}),ve=new Ct({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:yt});for(let D=0;D<18;D++){const Ce=new nt,be=new z(new _n(1,12),fe.clone());be.rotation.x=-Math.PI/2,Ce.add(be);for(let Re=0;Re<7;Re++){const $=new z(new _n(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Re)*(.6+Math.random()*1.2),.01,Math.sin(Re*1.7)*(.5+Math.random()*1.1)),Ce.add($)}Ce.visible=!1,Ce.userData.life=0,Ce.userData.maxLife=2.8,Ce.position.y=-99,n.add(Ce),Ia.push(Ce)}function Ye(D,Ce=0,be=0){if(!D.active)if(D.respawn-=be,D.respawn<=0)D.active=!0,D.mesh.visible=!0,D.along+=D.dir*50;else return;D.along+=D.dir*D.speed*be,D.axis==="ns"?(D.along<r-28&&(D.along=a+28),D.along>a+28&&(D.along=r-28)):(D.along<i-28&&(D.along=s+28),D.along>s+28&&(D.along=i-28));const Re=D.sideSign*(c*.66+1.2),$=D.axis==="ns"?D.coord+Re:D.along,Z=D.axis==="ns"?D.along:D.coord+Re,we=D.axis==="ns"?0:D.dir,Pe=D.axis==="ns"?D.dir:0;D.x=$,D.z=Z,D.mesh.position.set($,ce($,Z)+.08,Z),D.mesh.rotation.y=Math.atan2(-we,-Pe);const ke=Math.sin(Ce*7+D.phase);for(const tt of D.mesh.userData.limbs||[])tt.mesh.rotation.x=ke*tt.amp*tt.side,tt.mesh.position.y=tt.baseY+Math.abs(ke)*.025}for(const D of K)Ye(D,0,0);Me.pedestrians=K.length,pn(n,(D,Ce)=>{for(const be of K)Ye(be,D,Ce);Aa.update(Ce);for(const be of Ia){if(!be.visible)continue;be.userData.life-=Ce;const Re=be.userData.life,$=xe.clamp(Re/be.userData.maxLife,0,1);be.scale.setScalar(1+(1-$)*.35),be.traverse(Z=>{Z.material&&(Z.material.opacity=Math.min(.78,$*1.2))}),Re<=0&&(be.visible=!1)}})}function e_(){const n=new nt,e=new It;new is().setFromAxisAngle(new P(1,0,0),-Math.PI/2),Me.roadDetails={},Me.buildingArchetypes={},Me.zones={},Me.openerProps=0;const t=Be.x0,i=Be.x1,s=Be.zNear,a=Be.zFar,r=Be.pitch,o=Be.streetW,c=r-o,h=[],d=[];for(let N=t;N<=i+1;N+=r)h.push(Math.round(N));for(let N=s;N>=a-1;N-=r)d.push(Math.round(N));const u=[];for(const N of h)u.push({x0:N,z0:s,x1:N,z1:a});for(const N of d)u.push({x0:t,z0:N,x1:i,z1:N});function p(N,O){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,w=Y/ie;return{x0:N.x0+le*O,z0:N.z0+w*O,x1:N.x1+le*O,z1:N.z1+w*O}}function m(N,O,Y){const ee=[],ie=[];for(const w of N){const F=w.x1-w.x0,G=w.z1-w.z0,X=Math.hypot(F,G),B=Math.max(1,Math.round(X/14)),oe=F/X,re=-(G/X),Q=oe;let ue=null,De=null;for(let Ve=0;Ve<=B;Ve++){const Ie=Ve/B,Ne=Ie*X/68,ft=w.x0+F*Ie,St=w.z0+G*Ie,Lt=ft+re*O,Tt=St+Q*O,$e=ft-re*O,Dt=St-Q*O,mt=[Lt,ce(Lt,Tt)+Y,Tt,Ne],Qt=[$e,ce($e,Dt)+Y,Dt,Ne];ue&&(ee.push(ue[0],ue[1],ue[2],De[0],De[1],De[2],Qt[0],Qt[1],Qt[2]),ee.push(ue[0],ue[1],ue[2],Qt[0],Qt[1],Qt[2],mt[0],mt[1],mt[2]),ie.push(0,ue[3],1,De[3],1,Qt[3]),ie.push(0,ue[3],1,Qt[3],0,mt[3])),ue=mt,De=Qt}}const le=new Kt;return le.setAttribute("position",new bt(ee,3)),le.setAttribute("uv",new bt(ie,2)),le.computeVertexNormals(),le}const x=(mn.roadMat=new W({map:zM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:yt}),mn.roadMat),M=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),f=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),_=[],E=[];for(const N of u)_.push(p(N,o*.5+3.3),p(N,-13.3)),E.push(p(N,o*.5+.42),p(N,-10.42));const T=new z(m(_,2.9,.66),M);T.receiveShadow=!0,n.add(T);const A=new z(m(E,.28,.78),g);A.receiveShadow=!0,n.add(A),ds("roadDetails","sidewalkRuns",_.length),ds("roadDetails","curbRuns",E.length);const R=new z(m(u,o/2,.55),x);R.receiveShadow=!0,n.add(R);const S=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:yt});n.add(new z(m(u,.4,.62),S));let b=0,L=0,I=0;for(let N=1;N<h.length-1;N++)for(let O=1;O<d.length-1;O++){const Y=h[N],ee=d[O];if(!(Pn(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const le=new z(new me(o*.92,.07,1.15),f);le.position.set(Y,ce(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const w=new z(new me(1.15,.07,o*.92),f);w.position.set(Y+ie*13,ce(Y+ie*13,ee)+.83,ee),w.receiveShadow=!0,n.add(w),b+=2}}const V=new td;V.moveTo(0,5.8),V.lineTo(2.5,1.6),V.lineTo(.72,1.6),V.lineTo(.72,-5.2),V.lineTo(-.72,-5.2),V.lineTo(-.72,1.6),V.lineTo(-2.5,1.6),V.closePath();const j=new _l(V);j.rotateX(-Math.PI/2);for(const N of u){const O=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,w=N.x0+(N.x1-N.x0)*le,F=N.z0+(N.z1-N.z0)*le;if(Pn(w,F,4).clearance<2)continue;const G=new z(j,y);if(G.position.set(w,ce(w,F)+.86,F),G.rotation.y=O?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),L++,ie%2===0){const X=new z(new Qe(1.05,1.05,.08,24),v);X.position.set(w+(O?3.8:0),ce(w,F)+.84,F+(O?0:3.8)),n.add(X),I++}}}ds("roadDetails","crosswalks",b),ds("roadDetails","laneArrows",L),ds("roadDetails","manholes",I);const te=new Ct({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:yt,blending:si}),q=new Ct({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:yt,blending:si});for(let N=0;N<120;N++){const O=u[Math.random()*u.length|0],Y=Math.random(),ee=O.x0+(O.x1-O.x0)*Y,ie=O.z0+(O.z1-O.z0)*Y;if(Pn(ee,ie,4).clearance<2)continue;const le=new z(new _n(1,18),(N%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(O.x1-O.x0,O.z1-O.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*o*.7,ce(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const K=[Ta(160,320,.5),Ta(160,320,.62),Ta(160,320,.42)],ne=[new W({map:K[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:K[0],emissiveIntensity:.34}),new W({map:K[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:K[1],emissiveIntensity:.32}),new W({map:K[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:K[2],emissiveIntensity:.36})],fe=new me(1,1,1),ve=[[],[],[]],Ye=[],D=[],Ce=[],be=[],Re=[],$=[],Z=[],we=[],Pe=[],ke=[],tt=[],kt=[],at=[],zt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],k=OM(256,256,"#dbcdb8"),wt=kM(),Mt=BM(),Nt=[pc(512,384,"#944737","#2e95bf"),pc(512,384,"#7e4d3e","#d04d65"),pc(512,384,"#a65a35","#4fba6d")],je=VM();function Gt(N,O){ds("zones",N),ds("buildingArchetypes",O)}function ot(N,O,Y,ee,ie,le="downtown"){if(Ln(N,O,Y,ee))return!1;const w=Ea(N,O,Y,ee)-1.1;if(ks(N,O,Y,ee,w+ie+2))return!1;if(e.position.set(N,w+ie/2,O),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,w+ie+.6,O),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),Ye.push(e.matrix.clone()),ie>26){const F=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(N,w+ie+1.35,O+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),D.push(e.matrix.clone()),Ce.push(F);Math.random()<.34&&be.push({px:N,pz:O,w:Y,d:ee,h:ie,gy:w,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const F=Math.random()<.5?"x":"z";Re.push({px:N,pz:O,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const F=Math.random()<.5?"x":"z";$.push({px:N,pz:O,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}return un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,ie>64?"glassTower":"midrise"),!0}function vt(N,O,Y,ee,ie,le="residential"){if(Ln(N,O,Y,ee))return!1;const w=Ea(N,O,Y,ee)-.55,F=2+Math.random()*2.4;if(ks(N,O,Y,ee,w+ie+F+1.5,6))return!1;e.position.set(N,w+ie/2,O),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),Z.push(e.matrix.clone()),un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:w+ie+F+1.5}),we.push(zt[Math.random()*zt.length|0]),e.position.set(N,w+ie+F/2,O),e.scale.set(Y*.82,F,ee*.82),e.updateMatrix(),Pe.push(e.matrix.clone());const G=t+Math.round((N-t)/r)*r,X=s-Math.round((s-O)/r)*r,B=Math.abs(N-G)<Math.abs(O-X),oe=B?G>N?1:-1:X>O?1:-1,re=Math.min(B?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),ue=Math.min(24,Math.max(8,B?Math.abs(G-N)-Y*.5-o*.35:Math.abs(X-O)-ee*.5-o*.35));e.quaternion.identity(),B?(e.position.set(N+oe*(Y*.5+.1),w+Q*.5+.1,O-ee*.16),e.scale.set(.24,Q,re),e.updateMatrix(),ke.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+ue*.5),ce(N+oe*(Y*.5+ue*.5),O)+.08,O-ee*.16),e.scale.set(ue,.08,re*1.18)):(e.position.set(N-Y*.16,w+Q*.5+.1,O+oe*(ee*.5+.1)),e.scale.set(re,Q,.24),e.updateMatrix(),ke.push(e.matrix.clone()),e.position.set(N-Y*.16,ce(N,O+oe*(ee*.5+ue*.5))+.08,O+oe*(ee*.5+ue*.5)),e.scale.set(re*1.18,.08,ue)),e.updateMatrix(),tt.push(e.matrix.clone()),e.position.set(N,w+.02,O),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),kt.push(e.matrix.clone());for(let De=0;De<3;De++){const Ve=B?N+oe*(Y*.55):N+(De-1)*Y*.25,Ie=B?O+(De-1)*ee*.28:O+oe*(ee*.55);e.position.set(Ve,ce(Ve,Ie)+.55,Ie);const Ne=.85+Math.random()*.75;e.scale.set(Ne*1.35,Ne,Ne*1.35),e.updateMatrix(),at.push(e.matrix.clone())}return Gt(le,"residentialHouse"),!0}function U(N,O,Y,ee,ie,le="commercial"){if(Ln(N,O,Y,ee))return!1;const w=Ea(N,O,Y,ee)-.8;if(ks(N,O,Y,ee,w+ie+2,7))return!1;const F=new W({map:je,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new z(new me(Y,ie,ee),F);G.position.set(N,w+ie/2,O),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),B=new z(new me(Y*.72,.32,ee*.18),X);B.position.set(N,w+ie*.38,O+ee*.18),B.rotation.z=.13,n.add(B);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let re=5;re<ie;re+=9){const Q=new z(new me(Y*1.02,.24,.22),oe);Q.position.set(N,w+re,O+ee*.5+.14),n.add(Q)}return un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,"parkingGarage"),!0}function C(N,O,Y,ee,ie,le="commercial"){if(Ln(N,O,Y,ee))return!1;const w=Ea(N,O,Y,ee)-.65;if(ks(N,O,Y,ee,w+ie+2,7))return!1;const F=new W({map:Nt[Math.random()*Nt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new z(new me(Y,ie,ee),F);G.position.set(N,w+ie/2,O),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new z(new me(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,w+ie+.45,O),n.add(X);const B=t+Math.round((N-t)/r)*r,oe=s-Math.round((s-O)/r)*r,re=Math.abs(N-B)<Math.abs(O-oe),Q=re?B>N?1:-1:oe>O?1:-1,ue=gs[(N+O|0)%gs.length]||"#ffd45b",De=new Ct({map:fc(xs[(Math.abs(N)+Math.abs(O)|0)%xs.length],ue),transparent:!0,side:yt,depthWrite:!1}),Ve=new z(new Yt(Math.min(16,re?ee*.82:Y*.82),4.2),De);return re?(Ve.position.set(N+Q*(Y*.5+.2),w+ie*.66,O),Ve.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(Ve.position.set(N,w+ie*.66,O+Q*(ee*.5+.2)),Ve.rotation.y=Q<0?Math.PI:0),n.add(Ve),Bs("storefront-sign",Ve.position.x,Ve.position.y,Ve.position.z),un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,"brickStorefront"),!0}for(let N=t+r/2;N<=i-r/2;N+=r)for(let O=s-r/2;O>=a+r/2;O-=r){const Y=Pn(N,O,c*.5).clearance;if(Y<2)continue;const ee=O>40&&O<380&&N>-360&&N<360,ie=ee?"showcase":O<-920?"industrial":Y>230||O<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=c/3;for(let w=0;w<3;w++)for(let F=0;F<3;F++){if(Math.random()<.08)continue;const G=N-c/2+le*(w+.5)+(Math.random()-.5)*le*.3,X=O-c/2+le*(F+.5)+(Math.random()-.5)*le*.3;if(Pn(G,X,8).clearance<1)continue;const B=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?ot(G,X,B*.9,oe*.9,12+Math.random()*12,ie):vt(G,X,B,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,w=le?xe.clamp(58+Y*1.15,68,205):xe.clamp(22+Y*.3,22,66),F=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<F;G++){const X=15+Math.random()*Math.min(30,c*.46),B=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),re=O+(Math.random()-.5)*(c-B);if(Pn(oe,re,Math.hypot(X,B)*.5).clearance<2)continue;const Q=(18+Math.random()*(w-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&C(oe,re,Math.max(18,X*1.12),Math.max(18,B*1.08),12+Math.random()*14,ie)||Math.random()<.18&&U(oe,re,Math.max(24,X*1.35),Math.max(24,B*1.28),24+Math.random()*24,ie))||ot(oe,re,X,B,Q,ie)}}}for(let N=0;N<3;N++){if(!ve[N].length)continue;const O=new dn(fe,ne[N],ve[N].length);for(let Y=0;Y<ve[N].length;Y++)O.setMatrixAt(Y,ve[N][Y]);O.instanceMatrix.needsUpdate=!0,O.castShadow=!0,O.receiveShadow=!0,n.add(O)}if(Ye.length){const N=new W({color:2896696,roughness:.62,metalness:.34}),O=new dn(fe,N,Ye.length);for(let Y=0;Y<Ye.length;Y++)O.setMatrixAt(Y,Ye[Y]);O.instanceMatrix.needsUpdate=!0,n.add(O)}if(D.length){const N=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),O=new dn(fe,N,D.length);for(let Y=0;Y<D.length;Y++)O.setMatrixAt(Y,D[Y]),O.setColorAt(Y,new rt(Ce[Y]));O.instanceMatrix.needsUpdate=!0,O.instanceColor&&(O.instanceColor.needsUpdate=!0),n.add(O)}if(Z.length){const N=new W({color:4891451,roughness:.88,metalness:.02}),O=new dn(fe,N,kt.length);for(let Q=0;Q<kt.length;Q++)O.setMatrixAt(Q,kt[Q]);O.instanceMatrix.needsUpdate=!0,O.receiveShadow=!0,n.add(O);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new dn(fe,Y,tt.length);for(let Q=0;Q<tt.length;Q++)ee.setMatrixAt(Q,tt[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:k,roughness:.78,metalness:.03}),le=new dn(fe,ie,Z.length);for(let Q=0;Q<Z.length;Q++)le.setMatrixAt(Q,Z[Q]),le.setColorAt(Q,new rt(we[Q]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const w=new Ri(.72,1,4);w.rotateY(Math.PI/4);const F=new W({map:wt,color:14314033,roughness:.72}),G=new dn(w,F,Pe.length);for(let Q=0;Q<Pe.length;Q++)G.setMatrixAt(Q,Pe[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:Mt,roughness:.38,metalness:.18}),B=new dn(fe,X,ke.length);for(let Q=0;Q<ke.length;Q++)B.setMatrixAt(Q,ke[Q]);B.instanceMatrix.needsUpdate=!0,n.add(B);const oe=new W({color:3112239,roughness:.88,metalness:.02}),re=new dn(new Wt(1,8,6),oe,at.length);for(let Q=0;Q<at.length;Q++)re.setMatrixAt(Q,at[Q]);re.instanceMatrix.needsUpdate=!0,re.castShadow=!0,re.receiveShadow=!0,n.add(re)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(be.length,34);N++){const O=be[N],Y=J[N%J.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new Ct({map:qu(Y,ee),transparent:!0,side:yt,depthWrite:!1}),le=new z(new Yt(8,24),ie);le.position.set(O.px,O.gy+Math.max(14,O.h*.58),O.pz+O.zSide*(O.d*.5+.25)),le.rotation.y=O.zSide<0?Math.PI:0,n.add(le),Bs("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let N=0;N<Math.min(Re.length,48);N++){const O=Re[N],Y=xs[(N*5+2)%xs.length],ee=gs[(N*2+1)%gs.length],ie=new Ct({map:fc(Y,ee),transparent:!0,side:yt,depthWrite:!1}),le=Math.min(17,(O.axis==="x"?O.d:O.w)*.82),w=new z(new Yt(le,4.7),ie),F=O.gy+Math.max(6.2,Math.min(O.h-3.5,O.h*(.28+N%3*.12)));O.axis==="x"?(w.position.set(O.px+O.side*(O.w*.5+.22),F,O.pz),w.rotation.y=O.side>0?Math.PI/2:-Math.PI/2):(w.position.set(O.px,F,O.pz+O.side*(O.d*.5+.22)),w.rotation.y=O.side<0?Math.PI:0),n.add(w),Bs("wall-sign",w.position.x,w.position.y,w.position.z)}for(let N=0;N<Math.min($.length,18);N++){const O=$[N],Y=xs[(N*7+4)%xs.length],ee=rl[(N*5+3)%rl.length],ie=gs[(N+3)%gs.length],le=new nt,w=new W({map:u0(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),F=Math.min(18,(O.axis==="x"?O.d:O.w)*.86),G=new z(new me(F,5.2,.42),w);G.position.y=4.8,le.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const B of[-F*.34,F*.34]){const oe=new z(new Qe(.13,.17,5,8),X);oe.position.set(B,2.25,-.2),le.add(oe)}le.position.set(O.px,O.gy+O.h+.7,O.pz),le.rotation.y=O.axis==="x"?O.side>0?Math.PI/2:-Math.PI/2:O.side<0?Math.PI:0,n.add(le),Bs("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const de=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=ns([new me(2.2,.72,4.6).translate(0,.78,0),new me(1.7,.56,2.15).translate(0,1.42,-.22)]),ae=ns([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,O])=>new Qe(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,O))),et=130,Ue=new dn(ge,new W({roughness:.42,metalness:.36}),et),it=new dn(ae,new W({color:1512727,roughness:.9}),et);Pi.resetStatic();let qe=0,_e=0;for(;qe<et&&_e<et*6;){_e++;const N=Math.random()<.5,O=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.26);if(Pn(O,Y,4).clearance<2)continue;const ee=ce(O,Y)+.06;e.position.set(O,ee,Y),e.quaternion.setFromAxisAngle(en,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ue.setMatrixAt(qe,e.matrix),it.setMatrixAt(qe,e.matrix),Ue.setColorAt(qe,new rt(de[Math.random()*de.length|0])),Mn.spots.push({x:O,z:Y,yaw:N?0:-Math.PI/2,idx:qe,taken:!1}),Pi.addStatic(e.matrix,2.3,qe,Mn.spots[Mn.spots.length-1]),qe++}Ue.count=qe,it.count=qe,Ue.instanceMatrix.needsUpdate=!0,it.instanceMatrix.needsUpdate=!0,Ue.instanceColor&&(Ue.instanceColor.needsUpdate=!0),Ue.castShadow=!0,Mn.im=Ue,Mn.imW=it,n.add(Ue),n.add(it);const Le=new Map,ht=(N,O)=>`${Math.round(N)},${Math.round(O)}`;function ct(N,O){const Y=((O+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function We(){const N=[],O=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=GM(),ie=new Ct({map:ee,transparent:!0,side:yt}),le=new W({color:5050642,roughness:.48,metalness:.12}),w=(re,Q)=>new W({color:re,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),F=(re,Q,ue,De,Ve,Ie)=>{const Ne=new nt,ft=new z(new me(1.15,2.85,.75),Y);Ne.add(ft);const St=w(16724008,16717836),Lt=w(16767053,16757276),Tt=w(4521842,1693789),$e=[St,Lt,Tt];for(let Dt=0;Dt<3;Dt++){const mt=new z(new Wt(.28,12,8),$e[Dt]);mt.position.set(0,.78-Dt*.78,-.42),Ne.add(mt)}Ne.position.set(ue,De,Ve),Ne.rotation.y=Ie,re.add(Ne),N.push({axis:Q,red:St,yellow:Lt,green:Tt,control:re.userData.control})},G=(re,Q,ue)=>{const De=ht(re,Q),Ve={type:"signal",x:re,z:Q,phase:ue%4*2.1};Le.set(De,Ve);const Ie=ce(re,Q),Ne=new nt;Ne.userData.control=Ve;const ft=o*.72,St=o*.72,Lt=new z(new Qe(.18,.24,8.2,8),O);Lt.position.set(ft,4.1,St),Ne.add(Lt);const Tt=new z(new me(o*1.65,.2,.2),O);Tt.position.set(ft-o*.72,8,St),Ne.add(Tt);const $e=new z(new me(.2,.2,o*1.65),O);$e.position.set(ft,7.55,St-o*.72),Ne.add($e),F(Ne,"ns",ft-o*1.24,7.52,St,0),F(Ne,"ns",ft-o*.18,7.52,-St,Math.PI),F(Ne,"ew",ft,7.05,St-o*1.24,Math.PI/2),F(Ne,"ew",-ft,7.05,St-o*.18,-Math.PI/2),Ne.position.set(re,Ie,Q),Ne.traverse(Dt=>{Dt.castShadow=!0,Dt.receiveShadow=!0}),n.add(Ne)},X=(re,Q,ue)=>{const De=ht(re,Q);Le.set(De,{type:"stop",x:re,z:Q,phase:0});const Ve=ce(re,Q),Ie=new nt,Ne=ue%2?-1:1,ft=ue%3?1:-1,St=new z(new Qe(.12,.16,4.2,7),O);St.position.y=2.1,Ie.add(St);const Lt=new z(new _n(1.04,8),le);Lt.position.y=4.55,Lt.rotation.y=Math.PI,Ie.add(Lt);const Tt=new z(new Yt(2.05,2.05),ie);Tt.position.set(0,4.55,-.04),Ie.add(Tt),Ie.position.set(re+Ne*o*.74,Ve,Q+ft*o*.74),Ie.rotation.y=Math.atan2(Ne,ft),Ie.traverse($e=>{$e.castShadow=!0,$e.receiveShadow=!0}),n.add(Ie)};let B=0,oe=0;for(let re=1;re<h.length-1;re++)for(let Q=1;Q<d.length-1;Q++){const ue=h[re],De=d[Q];if(Pn(ue,De,o*.9).clearance<2)continue;const Ve=Math.abs(ue-80)<=r*1.05&&De<=s&&De>=-560,Ie=De<-260&&De>-1180&&(re+Q)%4===0,Ne=De>-360&&(re+Q)%2===0;Ve&&Q%2===0||Ie?G(ue,De,B++):(Ne||(re+Q)%5===0&&De>-820)&&X(ue,De,oe++)}return pn(n,re=>{for(const Q of N){const ue=ct(Q.control,re);Q.red.emissiveIntensity=ue.green===Q.axis||ue.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=ue.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=ue.green===Q.axis?2.6:.1}}),{trafficLights:B,stopSigns:oe}}const dt=We();QM(n,u,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:o,trafficControls:Le}),Me.trafficLights=dt.trafficLights,Me.stopSigns=dt.stopSigns;const H=new Qe(.12,.16,7.2,7),Ge=new Wt(.46,10,8),Oe=new Yt(2.8,13),ze=new W({color:1581353,roughness:.42,metalness:.68}),Se=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),pe=new Ct({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:yt,blending:si}),Ke=NM(),ut=new gl({map:Ke,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:si}),Bt=132,Ut=new dn(H,ze,Bt),Nn=new dn(Ge,Se,Bt),An=new dn(Oe,pe,Bt);let li=0;for(let N=0;N<Bt*2&&li<Bt;N++){const O=Math.random()<.5,Y=O?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=O?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.58);if(Pn(Y,ee,3).clearance<2)continue;const ie=ce(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Ut.setMatrixAt(li,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Nn.setMatrixAt(li,e.matrix);const le=new nl(ut);le.position.set(Y,ie+7.5,ee);const w=6.2+Math.random()*2.4;le.scale.set(w,w,1),n.add(le),_s.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(O?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),An.setMatrixAt(li,e.matrix),li++}Ut.count=li,Nn.count=li,An.count=li,Ut.instanceMatrix.needsUpdate=!0,Nn.instanceMatrix.needsUpdate=!0,An.instanceMatrix.needsUpdate=!0,n.add(Ut,Nn,An),Me.streetLights=li,n.add(new z(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new z(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new z(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new z(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const Qr=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const O=new z(new me(1.15,.09,13.5),Qr);O.position.set(80,ce(80,N)+.9,N),O.receiveShadow=!0,n.add(O)}for(const N of[286,156,26,-104])for(let O=0;O<7;O++){const Y=new z(new me(2,.08,11.8),f),ee=71.2+O*2.95;Y.position.set(ee,ce(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),ds("roadDetails","openerCrosswalkStripes")}function Za(N,O,Y,ee=!1){const ie=ce(N,O),le=new nt,w=new z(new Qe(.16,.22,9.5,8),ze);w.position.y=4.75,le.add(w);const F=new z(new me(3.8,.22,.22),ze);F.position.set(Y*1.75,8.95,0),le.add(F);const G=new z(new Wt(.62,12,8),Se);G.position.set(Y*3.6,8.82,0),le.add(G);const X=new nl(ut.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),le.add(X),_s.streetGlowSprites++;const B=new z(new Yt(3.2,15),pe.clone());if(B.position.set(Y*2.8,.72,0),B.rotation.x=-Math.PI/2,B.scale.y=.7+Math.random()*.35,le.add(B),ee){const oe=new sd(16762474,4.4,66,2);oe.position.copy(G.position),le.add(oe)}le.position.set(N,ie,O),n.add(le),Me.streetLights++}let bi=0;for(let N=340;N>=-700;N-=118)Za(63,N,1,bi++%3===0),Za(97,N-42,-1,bi++%3===0);function wi(N,O,Y,ee,ie=6010942){const le=new W({color:ie,roughness:.92,metalness:.01}),w=new z(new me(Y,.08,ee),le);return w.position.set(N,ce(N,O)+.06,O),w.receiveShadow=!0,n.add(w),Me.openerProps++,w}function Si(N,O,Y=1){const ee=ce(N,O),ie=new nt,le=new z(new Qe(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const w=new W({color:6065982,roughness:.86}),F=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[B,oe,re,Q]=G[X],ue=new z(new Wt(Q,12,8),X%2?F:w);ue.position.set(B,oe,re),ue.scale.y=.78,ue.castShadow=!0,ie.add(ue)}return ie.position.set(N,ee,O),ie.scale.setScalar(Y),n.add(ie),xi.push({kind:"tree",x:N,z:O,radius:3.4*Y,maxY:ee+11*Y}),Me.openerProps++,ie}function Ka(N,O,Y=0){const ee=new nt,ie=new W({color:10970418,roughness:.64,metalness:.04}),le=new W({color:1910317,roughness:.46,metalness:.5});for(const w of[1.05,1.55]){const F=new z(new me(6.8,.22,.44),ie);F.position.y=w,ee.add(F)}for(const w of[-2.7,2.7]){const F=new z(new me(.22,1.2,.35),le);F.position.set(w,.62,0),ee.add(F)}ee.position.set(N,ce(N,O),O),ee.rotation.y=Y,n.add(ee),Me.openerProps++}function ia(N,O){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new nt,ie=new z(new Qe(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new z(new Wt(.42,12,8),Y);le.position.y=1.32,ee.add(le);const w=new z(new Qe(.16,.16,1.1,10),Y);w.rotation.z=Math.PI/2,w.position.y=.9,ee.add(w),ee.position.set(N,ce(N,O),O),n.add(ee),Me.openerProps++}function eo(N,O,Y=0){const ee=new nt,ie=new W({color:1185821,roughness:.36,metalness:.68}),le=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),w=new W({color:2370611,roughness:.42,metalness:.32}),F=new z(new me(8.5,.35,3.2),w);F.position.y=4.2,ee.add(F);for(const B of[-3.8,3.8]){const oe=new z(new Qe(.09,.11,4.1,7),ie);oe.position.set(B,2.05,-1.25),ee.add(oe)}const G=new z(new me(8,2.8,.08),le);G.position.set(0,2.2,1.35),ee.add(G);const X=new z(new Yt(2.3,2.8),new Ct({map:fc("BUS","#4ff3ff"),transparent:!0,side:yt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(N,ce(N,O),O),ee.rotation.y=Y,n.add(ee),Bs("bus-shelter-ad",N,ce(N,O)+2.2,O),Me.openerProps++}function xn(N,O,Y,ee,ie,le,w,F=null,G=0){if(Ln(N,O,Y,ee,12))return!1;const X=ce(N,O)-.45;if(ks(N,O,Y,ee,X+ie+2))return!1;const B=N<80?1:-1,oe=new W({map:Ta(192,512,w),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),re=new z(new me(Y,ie,ee),oe);re.position.set(N,X+ie/2,O),re.castShadow=!1,re.receiveShadow=!0,n.add(re);const Q=new W({map:Ta(220,620,Math.min(.86,w+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:yt}),ue=new z(new Yt(ee*.78,ie*.74),Q);ue.position.set(N+B*(Y/2+.09),X+ie*.54,O),ue.rotation.y=B>0?Math.PI/2:-Math.PI/2,n.add(ue);for(const Ie of[-1,1]){const Ne=new z(new Yt(Y*.82,ie*.72),Q.clone());Ne.position.set(N,X+ie*.55,O+Ie*(ee/2+.1)),Ne.rotation.y=Ie>0?0:Math.PI,n.add(Ne)}const De=new z(new me(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));De.position.set(N,X+ie+.7,O),n.add(De);const Ve=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ie of[-1,1]){const Ne=new z(new me(Y*1.1,.22,.18),Ve);Ne.position.set(N,X+ie+1.4,O+Ie*(ee/2+.18)),n.add(Ne)}if(F&&G){const Ie=new Ct({map:qu(F,F==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:yt,depthWrite:!1}),Ne=new z(new Yt(7.5,24),Ie);Ne.position.set(N+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),O),Ne.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Ne),Bs("showcase-neon",Ne.position.x,Ne.position.y,Ne.position.z)}return un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),Gt("showcase","glassTower"),!0}function to(N,O,Y,ee=3.2){const ie=N*.5+ee,le=O*.5+ee,w=Math.max(2,Math.abs(ie-le)*.72),F=N>=O?[-ie,0,-le,ie,0,-le,w,Y,0,-ie,0,-le,w,Y,0,-w,Y,0,ie,0,-le,ie,0,le,w,Y,0,ie,0,le,-ie,0,le,-w,Y,0,ie,0,le,w,Y,0,-w,Y,0,-ie,0,le,-ie,0,-le,-w,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-w,ie,0,-le,ie,0,le,0,Y,w,ie,0,-le,0,Y,w,0,Y,-w,ie,0,le,-ie,0,le,0,Y,w,-ie,0,le,-ie,0,-le,0,Y,-w,-ie,0,le,0,Y,-w,0,Y,w],G=new Kt;return G.setAttribute("position",new bt(F,3)),G.computeVertexNormals(),G}function Ja(N,O,Y,ee,ie,le,w={}){if(Ln(N,O,Y,ee,12))return!1;const F=ce(N,O)-.3;if(ks(N,O,Y,ee,F+ie+(w.roofH??8.2)+1,6))return!1;const G=w.frontZ??-1,X=new W({map:k,color:w.wallColor??14734788,roughness:.68,metalness:.03}),B=new z(new me(Y,ie,ee),X);B.position.set(N,F+ie/2,O),B.castShadow=!0,B.receiveShadow=!0,n.add(B);const oe=new W({map:wt,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),re=w.roofH??8.2,Q=new z(to(Y,ee,re),oe);Q.position.set(N,F+ie,O),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const ue=new W({color:15985112,roughness:.42,metalness:.05}),De=new z(new me(Y+7,.42,1.2),ue);De.position.set(N,F+ie+.12,O+G*(ee*.5+1.4)),n.add(De);const Ve=De.clone();Ve.position.z=O-G*(ee*.5+1.4),n.add(Ve);const Ie=Math.min(18,Y*.38),Ne=new z(new me(Ie,ie*.55,.32),new W({map:Mt,roughness:.34,metalness:.2}));Ne.position.set(N+Y*.18,F+ie*.33,O+G*(ee*.5+.22)),n.add(Ne);const ft=new z(new me(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ft.position.set(N-Y*.25,F+3.7,O+G*(ee/2+.24)),n.add(ft);const St=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Lt=new W({color:3353638,roughness:.38});for(const nn of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(nn-Y*.18)<Ie*.45)continue;const Qn=new z(new me(6.2,4.8,.26),Lt);Qn.position.set(N+nn,F+ie*.58,O+G*(ee*.5+.28)),n.add(Qn);const Ht=new z(new me(4.8,3.4,.3),St);Ht.position.copy(Qn.position),Ht.position.z+=G*.04,n.add(Ht)}const Tt=new W({color:12370619,roughness:.44,metalness:.04}),$e=new z(new me(Ie*1.18,.12,34),Tt);$e.position.set(N+Y*.18,ce(N+Y*.18,O+G*(ee*.5+17))+.11,O+G*(ee*.5+17)),n.add($e);const Dt=new W({color:5679925,roughness:.86,metalness:.01}),mt=new z(new me(Y+10,.08,ee+12),Dt);mt.position.set(N,ce(N,O)-.18,O),mt.receiveShadow=!0,n.add(mt),mt.renderOrder=-1;const Qt=new W({color:3042609,roughness:.84}),Wi=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let nn=0;nn<9;nn++){const Qn=N-Y*.44+nn*(Y*.11),Ht=O+G*(ee*.5+2.2+nn%2*1.5),gn=new z(new Wt(1.35+nn%3*.22,10,7),nn%4===0?Wi[nn%Wi.length]:Qt);gn.position.set(Qn,ce(Qn,Ht)+.95,Ht),gn.scale.y=.72,gn.castShadow=!0,n.add(gn)}return un.push({x:N,z:O,hw:Y*.5,hd:ee*.5,maxY:F+ie+5}),Gt("showcase","lowStorefront"),!0}return wi(45,318,36,84,6404169),wi(116,318,36,84,6074179),wi(44,188,34,84,6798662),wi(118,188,36,84,5941822),wi(43,60,34,82,5679164),wi(118,60,36,82,6864197),xn(18,315,70,54,154,2311775,.72,"HOTEL",1),xn(17,185,72,58,188,1522779,.78,null,0),xn(31,55,44,56,138,2840688,.66,"OPEN",1),xn(24,-75,52,64,182,1913933,.7,null,0),xn(145,315,68,54,116,2776440,.72,null,0),xn(146,185,70,58,146,2314602,.76,null,0),xn(142,55,42,56,156,1590364,.68,"CAFE",-1),xn(134,-75,48,64,114,3688540,.62,null,0),xn(-70,315,52,52,146,2112085,.68,null,0),xn(228,185,48,58,148,3235186,.66,null,0),xn(-78,185,48,56,134,2181730,.68,null,0),xn(236,315,44,54,104,3104884,.66,null,0),Ja(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Ja(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),xn(-48,-360,54,56,148,2439765,.58,null,0),xn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Si(112,227,1.35),Si(104,221,1.05),Si(121,233,1.15),Ka(112,217,0),Si(50,292,1.2),Si(111,316,.95),Si(48,137,.9),Si(116,102,1.05),Ka(47,248,Math.PI/2),ia(57,226),eo(111,260,-Math.PI/2),Te.add(n),n}function g0(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const o=pt(i),c=new P(o.tangent.x,0,o.tangent.z).normalize(),h=new P().crossVectors(en,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),u=t==="off"?1:-1,p=d.x+c.x*s*u+h.x*e*a,m=d.z+c.z*s*u+h.z*e*a,x=new P(p,ce(p,m)+.4,m),M=t==="off"?d:x,g=t==="off"?x:d,f=26,y=[];for(let q=0;q<=f;q++){const K=q/f,ne=K*K*(3-2*K),fe=t==="off"?1-(1-K)*(1-K):ne;y.push(new P(xe.lerp(M.x,g.x,K),xe.lerp(M.y,g.y,fe),xe.lerp(M.z,g.z,K)))}const v=7.4,_=new P,E=new P,T=[],A=[];for(let q=0;q<=f;q++)E.subVectors(y[Math.min(f,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),_.crossVectors(en,E).normalize(),T.push(y[q].clone().addScaledVector(_,-v)),A.push(y[q].clone().addScaledVector(_,v));const R={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<f;q++){const K=y[q],ne=y[q+1],fe=ne.x-K.x,ve=ne.z-K.z,Ye=Math.max(1e-4,fe*fe+ve*ve);R.segments.push({a:K.clone(),b:ne.clone(),abx:fe,abz:ve,lenSq:Ye,u0:q/f,u1:(q+1)/f})}na.push(R);const S=[];for(let q=0;q<f;q++){const K=T[q],ne=A[q],fe=T[q+1],ve=A[q+1];S.push(K.x,K.y,K.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),S.push(K.x,K.y,K.z,ve.x,ve.y,ve.z,fe.x,fe.y,fe.z)}const b=new Kt;b.setAttribute("position",new bt(S,3)),b.computeVertexNormals();const L=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:yt});n.add(new z(b,L));const I=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<f;q++)Gn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,I),Gn(n,A[q].clone().setY(A[q].y+1),A[q+1].clone().setY(A[q+1].y+1),.16,I);const V=new W({color:7173241,roughness:.82});for(let q=3;q<f;q+=3){const K=y[q],ne=ce(K.x,K.z),fe=K.y-ne;if(fe<3||Ln(K.x,K.z,3.2,3.2,1.2))continue;const ve=new z(new Qe(.9,1.15,fe,8),V);ve.position.set(K.x,ne+fe/2,K.z),n.add(ve),ni.push({x:K.x,z:K.z,hw:1.3,hd:1.3,maxY:K.y-.9})}const j=new Ct({map:fd(r),transparent:!0,side:yt}),te=new z(new Yt(12,3),j);te.position.copy(t==="off"?d:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const K=new z(new Qe(.2,.26,6,6),V),ne=t==="off"?d:x;K.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(K)}}function t_(n,e=1){g0(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function n_(n,e=-1){g0(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function i_(){const n=new nt,e=[],t=new rt(14170671),i=new rt(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Ct({map:s_(),transparent:!0,side:yt}),r=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:yt}),h=12,d=[],u=[];let p=0;for(let x=0;x<se.length;x+=h){if(Oi(x+h*.5)){p++;continue}const M=pt(x),g=pt(x+h),f=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:_}=Qi(M,g);for(const E of[-1,1]){const T=f.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(T),u.push(_),e.push(p%2===0?t:i)}if(p%16===8){const E=(p>>4)%2?1:-1,T=f.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),A=new nt,R=new z(new Yt(4.4,2.6),a);R.position.y=3.4,R.rotation.y=Math.PI,A.add(R);const S=new Qe(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const L=new z(S,s);L.position.set(b,1.7,0),A.add(L)}A.position.copy(T),A.quaternion.copy(_),n.add(A)}p++}for(let x=0;x<se.length;x+=16){const M=pt(x),g=1+(Math.random()<.5?1:0);for(let f=0;f<g;f++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,_=M.p.x+M.side.x*v*y+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*y+(Math.random()-.5)*16;if(Sl(_,E,18)||Ln(_,E,12,12,3.5))continue;const T=ce(_,E);if(Math.random()<.78){const A=.7+Math.random()*1.5,R=new nt,S=2.4+Math.random()*4.2,b=new z(new Qe(.26,.42,S,6),r);b.position.y=S/2,R.add(b);const L=2+Math.floor(Math.random()*3);for(let I=0;I<L;I++){const V=new z(new Ri(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(f+I+x)%o.length]);V.position.y=S+I*1.4+1.5,V.rotation.y=Math.random()*Math.PI,R.add(V)}R.position.set(_,T+.6,E),R.scale.setScalar(A),n.add(R)}else{const A=1.4+Math.random()*3.6,R=new z(new jh(A,0),c);R.position.set(_,T+A*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),n.add(R),ni.push({kind:"rock",x:_,z:E,radius:A*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(Oi(M))continue;const g=pt(M),f=pt(M+h),y=g.p.clone().add(f.p).multiplyScalar(.5),{q:v}=Qi(g,f),_=se.width*.5+1.2,E=9,T=new nt,A=new Qe(.4,.55,E,7);for(const I of[-1,1]){const V=new z(A,s);V.position.set(I*_,E/2,0),T.add(V)}const R=_*2,S=new z(new me(R,1.1,1.1),s);S.position.y=E,T.add(S);const b=new Ct({map:fd(m[x]),transparent:!0,side:yt}),L=new z(new Yt(R*.82,3),b);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(y),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new Qe(.18,.24,3,6);x.translate(0,1.5,0);const M=new Wt(.34,8,6);M.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),f=new W({roughness:.55}),y=new dn(x,g,d.length),v=new dn(M,f,d.length),_=new It;for(let E=0;E<d.length;E++)_.position.copy(d[E]),_.quaternion.copy(u[E]),_.updateMatrix(),y.setMatrixAt(E,_.matrix),v.setMatrixAt(E,_.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return t_(n),n_(n),Te.add(n),n}function s_(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new tn(n);return t.colorSpace=Pt,t}function fd(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new tn(e);return i.colorSpace=Pt,i}function a_(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const o=new tn(t);return o.colorSpace=Pt,o}function r_(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new tn(n);return i.colorSpace=Pt,i.wrapS=zn,i.repeat.set(3,1),i}function Jt(n,e,t,i,s){const a=new z(new me(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function Qi(n,e){const t=e.p.clone().sub(n.p).normalize(),i=od.crossVectors(en,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new is().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new _t().makeBasis(i,s,t),o=new is().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:o}}function Ku(n,e,t,i){const s=[],a=[],r=[],o=se.width*.47;let c=0;for(let u=e;u<=t;u+=8){const p=pt(Math.min(u,t)),m=Qi(p,pt(p.s+2)),x=Math.sin(u*.018)*.04,M=p.p.clone().addScaledVector(m.sideways,-o).addScaledVector(m.normal,.46+x),g=p.p.clone().addScaledVector(m.sideways,o).addScaledVector(m.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const f=(u-e)/64;if(a.push(0,f,1,f),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new Kt;h.setAttribute("position",new bt(s,3)),h.setAttribute("uv",new bt(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new z(h,i);d.receiveShadow=!0,n.add(d)}function o_(n,e){let t=0;for(const i of se.gaps)Ku(n,t,Math.max(t,i.start-4),e),t=i.end+4;Ku(n,t,se.length,e)}function l_(n,e,t){const i=pt(e.s+2),{normal:s,q:a}=Qi(e,i),r=new nt;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const o=new z(new me(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,r.add(o);const c=new z(new me(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new z(new me(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function c_(){const n=new nt;Te.add(n),Mh=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new W({color:4935486,roughness:.92,metalness:.04}),p=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const f=new W({map:UM(),roughness:.74,metalness:.08}),y=new Ct({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;o_(n,f);function _(E,T=!1){if(Oi(E))return!1;const A=pt(E),R=pt(E+3),{sideways:S,normal:b,q:L}=Qi(A,R),I=A.p,V=ce(I.x,I.z),j=I.y-.95;if(j-V<10)return!1;const te=se.width*(T?.43:.35),q=j,K=V+.25,ne=T?.56:.42,fe=T?2.4:1.75,ve=T?.52:.36,Ye=[],D=[];for(const we of[-1,1])if(Ln(I.x+S.x*we*te,I.z+S.z*we*te,fe*2.2,fe*2.2,1.2))return!1;for(const we of[-1,1]){const Pe=I.clone().addScaledVector(S,we*te).addScaledVector(b,-.85);Pe.y=q;const ke=new P(Pe.x,K,Pe.z);Gn(n,ke,Pe,ne,a);const tt=new z(new Qe(fe,fe*1.12,ve,12),a);tt.position.set(ke.x,V+ve*.5,ke.z),tt.receiveShadow=!0,n.add(tt),Ye.push(Pe),D.push(ke),ni.push({x:ke.x,z:ke.z,hw:fe*.92,hd:fe*.92,maxY:q-.7})}const Ce=I.clone().addScaledVector(b,-1.05);Ce.y=q,Jt(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Ce,L,r);const be=D[0].clone();be.y+=(q-K)*.28;const Re=D[1].clone();Re.y+=(q-K)*.28;const $=Ye[0].clone();$.y-=1;const Z=Ye[1].clone();if(Z.y-=1,Gn(n,be,Z,T?.18:.14,c),Gn(n,Re,$,T?.18:.14,c),T){const we=D[0].clone();we.y+=(q-K)*.58;const Pe=D[1].clone();Pe.y+=(q-K)*.58,Gn(n,D[0].clone().setY(K+1.2),Pe,.16,c),Gn(n,D[1].clone().setY(K+1.2),we,.16,c),Gn(n,we,Z,.16,c),Gn(n,Pe,$,.16,c)}return Mh++,!0}for(let E=0;E<se.length;E+=v){if(Oi(E+v*.5))continue;const T=pt(E),A=pt(E+v),R=T.p.clone().add(A.p).multiplyScalar(.5),{sideways:S,normal:b,q:L}=Qi(T,A),I=T.p.distanceTo(A.p)+.45,V=Math.floor(E/(v*2))%2?e:t;Jt(n,new P(se.width,.62,I),R.clone().addScaledVector(b,-.05),L,V),Jt(n,new P(se.width-2.8,.08,I*.86),R.clone().addScaledVector(b,.36),L,u),Jt(n,new P(.2,.1,I*.76),R.clone().addScaledVector(S,-se.width*.19).addScaledVector(b,.43),L,u),Jt(n,new P(.2,.1,I*.76),R.clone().addScaledVector(S,se.width*.19).addScaledVector(b,.43),L,u),E%48===0&&(Jt(n,new P(.14,.08,I*.62),R.clone().addScaledVector(S,-se.width*.08).addScaledVector(b,.51),L,M),Jt(n,new P(.14,.08,I*.62),R.clone().addScaledVector(S,se.width*.08).addScaledVector(b,.51),L,M)),E%120===0&&Jt(n,new P(se.width*.42,.07,.72),R.clone().addScaledVector(b,.55),L,g),Jt(n,new P(se.width+1.2,.35,I*.94),R.clone().addScaledVector(b,-.56),L,r),Jt(n,new P(.42,.42,I*.9),R.clone().addScaledVector(S,-se.width*.36).addScaledVector(b,-.78),L,x),Jt(n,new P(.42,.42,I*.9),R.clone().addScaledVector(S,se.width*.36).addScaledVector(b,-.78),L,x);const j=R.clone().addScaledVector(S,-se.width*.51),te=R.clone().addScaledVector(S,se.width*.51);if(Jt(n,new P(.32,.46,I),j.clone().addScaledVector(b,.28),L,i),Jt(n,new P(.32,.46,I),te.clone().addScaledVector(b,.28),L,i),Jt(n,new P(.26,.72,I*.94),j.clone().addScaledVector(b,-.22),L,r),Jt(n,new P(.26,.72,I*.94),te.clone().addScaledVector(b,-.22),L,r),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const K=new z(new Qe(.16,.2,.12,10),o);K.position.copy(R).addScaledVector(S,q).addScaledVector(b,.46),K.quaternion.copy(L),K.castShadow=!1,n.add(K)}if(E%72===0&&(Jt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(S,-se.width*.66).addScaledVector(b,1.16),L,s),Jt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(S,se.width*.66).addScaledVector(b,1.16),L,s),Jt(n,new P(.18,.18,4.4),R.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.94),L,s),Jt(n,new P(.18,.18,4.4),R.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.94),L,s),Jt(n,new P(.12,.12,4),R.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.38),L,i),Jt(n,new P(.12,.12,4),R.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.38),L,i),Gn(n,R.clone().addScaledVector(S,-se.width*.58).addScaledVector(b,-1.08),R.clone().addScaledVector(S,se.width*.58).addScaledVector(b,-1.08),.11,c),Gn(n,R.clone().addScaledVector(S,-se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c),Gn(n,R.clone().addScaledVector(S,se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new z(new _n(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(R.x,-4.72,R.z),q.scale.set(se.width*.9,Math.max(10,I*2.2),1),q.rotation.z=Math.atan2(Qi(T,A).tangent.x,Qi(T,A).tangent.z),n.add(q)}if(E%144===0){const q=R.clone().addScaledVector(S,-se.width*.74).addScaledVector(b,2),K=R.clone().addScaledVector(S,se.width*.74).addScaledVector(b,2);Gn(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Gn(n,K.clone().addScaledVector(b,-1.2),K.clone().addScaledVector(b,1.1),.12,s),Jt(n,new P(.46,.72,.46),q.clone().addScaledVector(b,1.15),L,h),Jt(n,new P(.46,.72,.46),K.clone().addScaledVector(b,1.15),L,h)}if(E%288===0){const q=R.clone().addScaledVector(S,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);Jt(n,new P(.44,.44,.44),q.clone(),L,p),Gn(n,q.clone().addScaledVector(b,-.2),R.clone().addScaledVector(b,1),.05,c)}E%48===0&&_(E+v*.5,!1),E%168===0&&!Oi(E+16)&&l_(n,pt(E+5),d)}for(const E of se.gaps){const T=pt(E.start-3),A=pt(E.end+3);for(const R of[T,A]){const S=pt(R.s+2),{normal:b,q:L}=Qi(R,S);Jt(n,new P(se.width-1.2,.08,4.6),R.p.clone().addScaledVector(b,.54),L,h),Jt(n,new P(se.width*.62,.09,1.3),R.p.clone().addScaledVector(b,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),L,g);for(const I of[-se.width*.42,0,se.width*.42]){const V=R.p.clone().addScaledVector(R.side,I).addScaledVector(b,2.35);Jt(n,new P(.46,.46,.46),V,L,I===0?m:h)}_(R.s+(R===T?-9:9),!0),_(R.s+(R===T?-24:24),!0)}}return n}function v0(n=13710372,e=7740696){const t=new nt,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),u=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),M=new z(new _n(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(_,E,T,A,R=null,S=null)=>{const b=new z(E,T);return b.name=_,b.position.copy(A),R&&b.rotation.set(R.x||0,R.y||0,R.z||0),S&&b.scale.copy(S),t.add(b),b},f=(_,E,T,A,R,S,b=0,L=0,I=0)=>g(_,new me(E.x,E.y,E.z),T,new P(A,R,S),new P(b,L,I));f("low black undertray",new P(5.25,.28,8.45),a,0,.45,-.08),f("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),f("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),f("front black splitter",new P(5.25,.13,.78),a,0,.35,-5.6),f("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),f("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),f("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),f("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),f("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),f("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),f("black rear fascia",new P(4.72,.66,.2),r,0,1.02,4.04),f("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),f("front windshield",new P(2.8,.13,1.15),h,0,1.78,-1.25,-.48),f("roof glass",new P(2.34,.18,1.55),h,0,2.08,-.2,-.13),f("left side window",new P(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),f("right side window",new P(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),f("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),f("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),f("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let _=0;_<7;_++)f("black rear deck louver",new P(3.35,.12,.18),r,0,1.83+_*.015,1.1+_*.28,-.21);f("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const _ of[-2.28,2.28])f("spoiler side endplate",new P(.24,.78,1.04),s,_,1.43,3.72,0,0,_<0?-.08:.08);for(const _ of[-1.78,1.78])f("thin hood crease",new P(.08,.04,2.55),x,_*.36,1.27,-3.45,-.15),f("door seam",new P(.035,.68,1.75),x,_,1.16,-.2),f("side intake",new P(.09,.34,.9),r,Math.sign(_)*2.68,.86,1.42);for(const _ of[-1.04,1.04])f("pop up headlight glass",new P(.62,.12,.18),p,_,1.02,-5.28,-.16);f("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const _ of[-1.42,-.62,.62,1.42])f("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(_)>1?d:u,_,1.08,4.24);f("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),f("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),f("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),f("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const _ of[-2.86,2.86])f("angular side mirror arm",new P(.42,.08,.08),x,_,1.62,-1.55,0,0,_<0?-.14:.14),f("blue tinted side mirror",new P(.12,.34,.46),h,_*1.03,1.62,-1.65,0,_<0?.24:-.24),f("flush door handle",new P(.08,.11,.46),o,_*.94,1.28,.52);for(const _ of[-2.65,2.42])f("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,_),f("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,_);f("black license recess",new P(.9,.24,.08),r,0,.76,4.31);const y=[],v=(_,E,T=!1)=>{const A=new nt;A.name=T?"steering front wheel assembly":"rear wheel assembly",A.position.set(_,.54,E);const R=new z(new Qe(.88,.88,.62,28),a);R.name="wide performance tire",R.rotation.z=Math.PI/2,A.add(R);const S=new z(new Es(.88,.06,10,32),a);S.name="rounded tire sidewall",S.rotation.y=Math.PI/2,A.add(S);const b=new z(new Qe(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,A.add(b);const L=new z(new Qe(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=_>0?-.05:.05,A.add(L);for(let j=0;j<8;j++){const te=new z(new me(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=j/8*Math.PI*2,te.position.set(_>0?.035:-.035,0,.22),A.add(te)}const I=new z(new me(.1,.22,.18),u);I.name="small brake caliper",I.position.set(_>0?-.39:.39,.18,-.38),A.add(I);const V=new z(new Qe(.17,.17,.72,18),c);V.name="dark center cap",V.rotation.z=Math.PI/2,A.add(V),t.add(A),T&&y.push(A)};for(const _ of[-2.4,2.4])v(_,-2.65,!0),v(_,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const _ of[-.92,-.52,.52,.92]){const E=new z(new Qe(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(_,.43,4.52),t.add(E)}return t.traverse(_=>{_.castShadow=!0,_.receiveShadow=!0}),Te.add(t),t}function h_(){const n=new nt,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new z(new me(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new z(new me(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new z(new me(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const u=new z(new Yt(2.8,.82,1,1),r);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,n.add(u);const p=new z(new Es(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,n.add(p);for(let m=0;m<3;m++){const x=new z(new me(.34,.025,.035),i);x.position.copy(p.position),x.rotation.copy(p.rotation),x.rotation.z+=m/3*Math.PI*2,n.add(x)}for(let m=0;m<6;m++){const x=new z(new Qe(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),n.add(x)}for(const m of[-1.08,1.08]){const x=new z(new Qe(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(m,-.68,-1.58),n.add(x);const M=new z(new Es(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const x=new z(new Qe(.035,.04,.028,8),i);x.position.set(m,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const m of[-.52,.52]){const x=new z(new Wt(.045,12,8),a);x.position.set(m,-.34,-1.22),n.add(x)}n.position.set(0,0,0),ye.add(n),cn=n}function d_(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:IM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=pt(0),a=new _t().makeBasis(s.side,en,s.tangent),r=new is().setFromRotationMatrix(a),o=new nt;for(const d of[-se.width*.58,se.width*.58]){const u=new z(new me(.8,11,.8),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(en,5.4),u.quaternion.copy(r),o.add(u)}const c=new z(new me(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(en,11.2),c.quaternion.copy(r),o.add(c);const h=new z(new me(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(en,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const u=new z(new Wt(.32,16,10),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(en,10.25),o.add(u)}return Te.add(o),o}function pd(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new z(new _n(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,u,p,m=null,x=null)=>{const M=new z(d,u);return M.name=h,M.position.copy(p),m&&M.rotation.set(m.x||0,m.y||0,m.z||0),x&&M.scale.copy(x),n.add(M),M},r=(h,d,u,p,m,x,M,g,f=0,y=0,v=0)=>a(h,new me(d,u,p),m,new P(x,M,g),{x:f,y,z:v}),o=[];function c(h,d,u,p=.88,m=.62){const x=new nt;x.name=u?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,p*.62+.18,d);const M=new z(new Qe(p,p,m,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new z(new Es(p,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const f=new z(new Qe(p*.48,p*.48,m+.04,24),i.chrome);f.name="chrome rim",f.rotation.z=Math.PI/2,x.add(f);const y=new z(new Qe(p*.62,p*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let _=0;_<8;_++){const E=new z(new me(.08,.055,m),i.chrome);E.name="wheel spoke",E.rotation.x=_/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,p*.25),x.add(E)}const v=new z(new Qe(.17,.17,m+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),u&&o.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:o}}function u_(n=15616818,e=2434871){const t=new nt,i=pd(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const o=new z(new Qe(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(r,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function f_(n=4165830,e=15908108){const t=new nt,i=pd(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const o=new z(new Qe(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(r,1.28,3.78),t.add(o)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const o=new z(new Qe(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(r*2.62,.55,.4),t.add(o),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function p_(n=16764159,e=526344){const t=new nt,i=pd(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const o=new z(new Qe(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=r*.42,o.position.set(r*.75,1.85,.35),t.add(o),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new z(new Qe(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}const As=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>v0(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>u_()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>f_()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>p_()}];let ki=xe.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function ys(){return l.drivingStolen&&st?of[st.type]||of.compact:As[ki].stats}const M0=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],Xn=M0.map((n,e)=>({...n,idx:e,mesh:v0(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),m_=Xn[0].mesh;let Ot=As[ki].build();function x_(n){ki=xe.clamp(n,0,As.length-1),localStorage.setItem("steel-ribbon-carmodel",String(ki));const e=Ot.visible;Ca(Ot),Ot=As[ki].build(),Ot.visible=e,typeof Lh=="function"&&Lh()}for(const n of Xn)n.mesh.visible=!1,Te.add(n.mesh);function Zr(n){for(const e of Xn)e.mesh.visible=n}const g_=[10,6,4,2];let Vt=null;try{Vt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function Kr(){return Vt?.active?Vt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function _0(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Vt))}function v_(){Vt={division:Kr(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},_0()}function y0(n){return["One","Two","Three","Four"][xe.clamp(n,1,4)-1]}function b0(){return[{key:"you",label:"You",pts:Vt?.points.you??0},...M0.map(e=>({key:e.key,label:e.label,pts:Vt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Ot.visible=!1;XM();WM();Me.signs=0;ll.length=0;qM();YM();e_();let Ju=null,ju=null,Qu=null,cn=null,gc=null;const Zt=[];h_();function Cs(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Te.remove(n))}function Ca(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Te.remove(n))}const Ua=[],Nr=[];let ef=null;function M_(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new tn(n);return t.colorSpace=Pt,t}function __(n,e){if(Oi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of na)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function y_(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:yt}),t=new Qe(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const o=new dn(t,i,Math.ceil(se.length/12*2)+8),c=new It;for(const h of[-1,1]){const d=h*(se.width*.5+.55),u=[],p=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],f=x[M+1];u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.12,f.z,f.x,f.y+1.5,f.z),u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.5,f.z,g.x,g.y+1.5,g.z)}a++}};let m=[];for(let x=0;x<=se.length;x+=s){if(__(x%se.length,h)){p(m),m=[];continue}const M=pt(x%se.length);if(m.push(M.p.clone().addScaledVector(M.side,d).addScaledVector(en,.58)),x%12===0){const g=m[m.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(r++,c.matrix)}}if(p(m),u.length){const x=new Kt;x.setAttribute("position",new bt(u,3)),x.computeVertexNormals(),n.add(new z(x,e))}}o.count=r,o.instanceMatrix.needsUpdate=!0,n.add(o),Me.railRuns=a,Me.railPosts=r}function b_(){Ua.length=0,Nr.length=0;const n=new nt,e=new Ct({map:M_(),transparent:!0,depthWrite:!1,side:yt,blending:si,opacity:.9}),t=new Yt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][Ua.length%3]*se.width,d=pt(c),u=new z(t,e),p=new P().crossVectors(d.side,d.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new _t().makeBasis(d.side,p,new P().crossVectors(d.side,p).normalize());u.quaternion.setFromRotationMatrix(m),u.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(p,.84),n.add(u),Ua.push({s:c,lat:h})}const i=new Wt(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(se.length/24));{const c=new dn(i,s,a*2),h=new It;let d=0;for(let u=0;u<a;u++){const p=u/a*se.length;if(Oi(p))continue;const m=pt(p);for(const x of[-1,1])h.position.copy(m.p).addScaledVector(m.side,x*(se.width*.5+.22)).addScaledVector(en,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new Qe(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=pt(Math.max(6,c.start-22));for(const d of[-1,1]){const u=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new nt,m=new z(r,o),x=new z(new Wt(.3,10,8),u);m.position.y=.75,x.position.y=1.65,p.add(m),p.add(x),p.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(en,.55),n.add(p),Nr.push(u)}}return y_(n),Te.add(n),n}pn(new It,n=>{if(!Nr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Nr)t.emissiveIntensity=e});function Jr(n){return ws=xe.clamp(n,0,Qs.length-1),se=Qs[ws],ni.length=0,na.length=0,Ca(Ju),Ca(ju),Ca(Qu),Ca(ef),Ju=c_(),ju=d_(),Qu=i_(),ef=b_(),gd(),Xe.trackName.textContent=se.name,Xe.courseName&&(Xe.courseName.textContent=se.name),Xe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ws)}),se.name}Jr(0);function w_(){gc&&Te.remove(gc),Zt.length=0;const n=new nt,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Ct({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:yt,blending:si}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=ce(a.x,a.z)+4.2,o=new nt,c=new z(new Es(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,o.add(c);const h=new z(new _n(4.7,32),t.clone());h.rotation.y=a.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new z(new Qe(.11,.16,6.2,8),d);m.position.set(Math.cos(a.yaw)*p,-1.1,Math.sin(a.yaw)*p),o.add(m)}const u=new z(new Wt(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(a.x,r,a.z),o.userData.index=s,o.userData.baseY=r,o.userData.label=a.label,n.add(o),Zt.push({...a,y:r,radius:8.5,marker:o,collected:!1})}pn(n,s=>{for(let a=0;a<Zt.length;a++){const r=Zt[a],o=a===l.objectiveIndex;r.marker.visible=!r.collected||o,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Te.add(n),gc=n}w_();function S_(){const n=new nt,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(Ln(s,a,r*2+14,r*2+14,10)||Pn(s,a,r).clearance<-6||Zt.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||ea.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||un.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||xi.some(d=>{const u=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<u+r+2})||Da.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const o=ce(s,a);if(Math.max(Math.abs(ce(s+r,a)-o),Math.abs(ce(s-r,a)-o),Math.abs(ce(s,a+r)-o),Math.abs(ce(s,a-r)-o))>1.7)continue;const c=new z(new Ml(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,a),c.renderOrder=-4,n.add(c);const h=new z(new _n(r,36),p0(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,a),h.renderOrder=-3,n.add(h),m0(s,a,r*.98),t++}Me.ponds=t,Te.add(n),gd()}S_();const ln=ud(3375807,15905331);ln.visible=!1,ln.scale.setScalar(1.06),Te.add(ln);const Bi=new P(0,0,0);let bh=0,he=null;function T_(){const n=new nt,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,u,p,m,x,M=0,g=0,f=0)=>{const y=new z(d,u);return y.name=h,y.position.set(p,m,x),y.rotation.set(M,g,f),n.add(y),y};r("cabin hull",new me(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new me(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new me(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new me(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new me(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new me(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new Qe(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new me(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new me(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new me(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new me(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new me(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new me(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new me(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new Qe(.22,.28,.5,10),s,0,3.95,-.2);const o=new nt;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new z(new me(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new nt;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new z(new me(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function E_(){let n=null;for(let d=0;d<700&&!n;d++){const u=-520+Math.random()*1040,p=-1200+Math.random()*1500;if(Math.hypot(u-80,p-300)>(d<350?420:1200)||Ln(u,p,26,26,6))continue;const m=ce(u,p);Math.max(Math.abs(ce(u+11,p)-m),Math.abs(ce(u-11,p)-m),Math.abs(ce(u,p+11)-m),Math.abs(ce(u,p-11)-m))>.8||un.some(x=>Math.abs(x.x-u)<x.hw+13&&Math.abs(x.z-p)<x.hd+13)||Da.some(x=>Math.hypot(x.x-u,x.z-p)<(x.radius||4)+13)||ea.some(x=>Math.hypot(x.x-u,x.z-p)<x.rx+16)||Zt.some(x=>Math.hypot(x.x-u,x.z-p)<24)||Pn(u,p,12).clearance<2||(n={x:u,z:p,y:m})}n||(n={x:150,z:330,y:ce(150,330)});const e=new nt,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new z(new Qe(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new tn(s);r.colorSpace=Pt;const o=new z(new _n(9.6,36),new Ct({map:r,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const u=d/8*Math.PI*2,p=new z(new Wt(.22,8,6),c);p.position.set(n.x+Math.cos(u)*10.2,n.y+.34,n.z+Math.sin(u)*10.2),e.add(p)}Te.add(e);const h=T_();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Te.add(h.mesh),he={pad:n,pos:new P(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new P,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},he.mesh.quaternion.setFromAxisAngle(en,-he.yaw),Me.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}E_();var Ci=[],w0=null;function A_(n,e){if(!Ci)return 0;for(const t of Ci){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return w0=t,a/t.len*t.h}return 0}function C_(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Ci.length<6;r++){const o=n[Ci.length%n.length],{len:c,h}=o,d=Math.random()<.5,u=Math.round((Be.x1-Be.x0)/Be.pitch),p=(d?Be.x0:Be.zFar)+(Math.random()*(d?u:Math.round((Be.zNear-Be.zFar)/Be.pitch))|0)*Be.pitch,m=(Math.random()<.5?-1:1)*(Be.streetW*.5+10+Math.random()*9),x=d?Be.zFar+120+Math.random()*(Be.zNear-Be.zFar-240):Be.x0+120+Math.random()*(Be.x1-Be.x0-240),M=d?p+m:x,g=d?x:p+m,f=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(f),v=-Math.cos(f),_=M+y*c,E=g+v*c;if(Ln(M,g,e+4,e+4,2)||Ln(_,E,e+4,e+4,2)||Pn(M,g,8).clearance<11||Pn(_,E,8).clearance<11||$s(M,g).depth>0||$s(_,E).depth>0||$s(_+y*40,E+v*40).depth>0||Math.abs(ce(M,g)-ce(_,E))>1.1||Ci.some(S=>Math.hypot(S.x-M,S.z-g)<150))continue;const T=(S,b,L,I)=>S.some(V=>Math.abs(b-V.x)<(V.hw??V.radius??0)+I&&Math.abs(L-V.z)<(V.hd??V.radius??0)+I);let A=!1;for(const[S,b,L]of[[M-y*45,g-v*45,6],[M-y*22,g-v*22,6],[M,g,7],[_,E,7],[_+y*45,E+v*45,9],[_+y*95,E+v*95,9]])if(T(un,S,b,L)||T(xi,S,b,L)){A=!0;break}if(A)continue;const R={x:M,z:g,yaw:f,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const S=ce(M,g)+h+13;R.hoop={x:_+y*28,y:S,z:E+v*28,r:7}}Ci.push(R)}for(const r of Ci){const o=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const R=new z(new Es(r.hoop.r,.5,10,30),a);R.position.set(r.hoop.x,r.hoop.y,r.hoop.z),R.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Te.add(R)}const c=ce(r.x,r.z)+.05,h=-r.fz,d=r.fx,u=r.w*.5,p=[r.x-h*u,c,r.z-d*u],m=[r.x+h*u,c,r.z+d*u],x=[r.x+r.fx*r.len-h*u,c,r.z+r.fz*r.len-d*u],M=[r.x+r.fx*r.len+h*u,c,r.z+r.fz*r.len+d*u],g=[x[0],c+r.h,x[2]],f=[M[0],c+r.h,M[2]],y=[...p,...m,...f,...p,...f,...g,...x,...M,...f,...x,...f,...g,...p,...g,...x,...m,...M,...f],v=new Kt;v.setAttribute("position",new bt(y,3)),v.computeVertexNormals();const _=new z(v,i);_.castShadow=!1,_.receiveShadow=!0,Te.add(_);const E=Math.hypot(r.len,r.h),T=new me(.26,.24,E),A=new z(new me(1.1,.1,E*.94),s);A.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),A.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Te.add(A);for(const R of[-1,1]){const S=new z(T,o),b=r.x+h*u*R,L=r.z+d*u*R,I=r.x+r.fx*r.len+h*u*R,V=r.z+r.fz*r.len+d*u*R;S.position.set((b+I)/2,c+r.h/2+.12,(L+V)/2),S.lookAt(I,c+r.h+.12,V),Te.add(S);const j=new z(new Wt(.34,10,8),t);j.position.set(I,c+r.h+.55,V),Te.add(j)}}Me.stuntRamps=Ci.length}C_();function R_(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];Me.propPlanes=0;for(const e of n){const t=new nt,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new z(new Qe(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new z(new Ri(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const o=new z(new Wt(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new z(new me(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new z(new me(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new z(new me(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const u=new nt,p=new me(.26,5.4,.12),m=new z(p,s),x=new z(p,s);x.rotation.z=Math.PI/2,u.add(m),u.add(x),u.position.z=-5.75,t.add(u),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Te.add(t);const M=Math.random()*Math.PI*2;pn(t,(g,f)=>{t.position.x+=e.dir*e.speed*f,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+M)*5,t.rotation.z=Math.sin(g*.22+M)*.14,u.rotation.z+=f*38}),Me.propPlanes++}}R_();const lt={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},S0=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),T0=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function jr(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),lt.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function E0(){const n=$r("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new z(new me(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new z(new me(.62,.24,.46),S0),s=new z(new me(.62,.24,.46),T0);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function tf(n,e){return un.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||$s(n,e).depth>.35}function P_(){const n=Math.random()*Math.PI*2,e=xe.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=xe.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=E0();Te.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return lt.cars.push(s),oi("whoosh",.2,.8,.1),s}function A0(n){Cs(n.mesh),lt.cars=lt.cars.filter(e=>e!==n)}function C0(n){for(const e of n.meshes)Cs(e);lt.blocks=lt.blocks.filter(e=>e!==n)}function md(){for(const n of[...lt.cars])A0(n);for(const n of[...lt.blocks])C0(n);lt.evadeT=0,lt.nearest=1/0,lt.bustT=0,lt.blockCd=6,l.heat=0}function L_(){const n=Math.sin(l.roamYaw),e=-Math.cos(l.roamYaw),t=l.roamPos.x+n*215,i=l.roamPos.z+e*215,s=Be.x0+Math.round((t-Be.x0)/Be.pitch)*Be.pitch,a=Be.zNear-Math.round((Be.zNear-i)/Be.pitch)*Be.pitch,r=Math.abs(t-s),o=Math.abs(i-a);let c,h,d,u,p,m;if(r<=o&&r<Be.streetW*.6)c=s,h=i,d=1,u=0,p=0,m=1;else if(o<Be.streetW*.6)c=t,h=a,d=0,u=1,p=1,m=0;else return!1;if(c<Be.x0||c>Be.x1||h>Be.zNear||h<Be.zFar||lt.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=ce(c,h),M=Be.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),f=new z(new me(.9,.16,M),g);f.position.set(c,x+.1,h),f.lookAt(c+d,x+.1,h+u),Te.add(f);const y=[f];for(const v of[-1,1]){const _=E0();_.position.set(c+d*v*(M*.32),x+.06,h+u*v*(M*.32)),_.rotation.y=Math.atan2(d,u)+v*.7,Te.add(_),y.push(_)}return lt.blocks.push({x:c,z:h,latX:d,latZ:u,fwX:p,fwZ:m,w:M,meshes:y,age:0,hitT:0}),l.message="ROADBLOCK AHEAD!",l.messageTimer=1.3,Tn(500,.2,"square",.1),!0}function D_(){const n=Math.min(600,Math.round(l.score*.12)+150);l.score=Math.max(0,l.score-n),Me.busts=(Me.busts||0)+1,l.message=`BUSTED! -${n}`,l.messageTimer=2,l.cameraShake=.5,Tn(220,.5,"sawtooth",.14),Ze.state==="active"&&Or("busted"),l.drivingStolen&&st&&(El(),l.vehicle="foot",l.speed=0,ln.visible=!0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.message="BUSTED! Ride confiscated"),md()}function I_(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),a=l.heat||0;let r=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(tf(n.x+o*17,n.z+c*17)){const u=n.yaw-.7,p=n.yaw+.7;r=!tf(n.x+Math.sin(u)*17,n.z-Math.cos(u)*17)?u:p}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=xe.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=xe.clamp(n.x,-800,800),n.z=xe.clamp(n.z,-1600,460),n.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const u of n.mesh.userData.wheels||[])u.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?(k0(new P(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,jr(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}pn(new It,(n,e)=>{const t=Math.floor(n*3.4)%2;if(S0.emissiveIntensity=t?2.6:.35,T0.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){lt.cars.length&&md();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;lt.cars.length<s;)P_();for(;lt.cars.length>s;)A0(lt.cars[lt.cars.length-1]);let a=1/0;for(const r of[...lt.cars])a=Math.min(a,I_(r,e));lt.nearest=a,i>0&&a<12&&Math.abs(l.speed)<8?(lt.bustT+=e,lt.bustT>2.2&&(lt.bustT=0,D_())):lt.bustT=Math.max(0,lt.bustT-e*1.5),i>=4&&(lt.blockCd-=e,lt.blockCd<=0&&Math.abs(l.speed)>30&&(L_(),lt.blockCd=12));for(const r of[...lt.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&C0(r);const o=l.roamPos.x-r.x,c=l.roamPos.z-r.z,h=o*r.latX+c*r.latZ,d=o*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!l.roamAir&&l.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,l.spikedT=3.5,l.speed*=.5,l.damage=xe.clamp(l.damage+6,0,100),l.message="SPIKE STRIP!",l.messageTimer=1.2,l.cameraShake=Math.max(l.cameraShake,.4),oi("skid",.55,1.25,.1),jr(.15))}if(lt.panicTick-=e,lt.panicTick<=0&&i>0){lt.panicTick=.4;for(const r of En){const o=r.actor;if(!o||!o.type||o.stolen||o.panicT>0)continue;let c=Math.hypot(l.roamPos.x-r.x,l.roamPos.z-r.z)<45;if(!c){for(const h of lt.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(o.panicT=1.6)}}i>0&&(a>240?(lt.evadeT+=e,lt.evadeT>9&&(l.heat=Math.max(0,i-1),lt.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,Ni("+500 ESCAPED THE LAW"),Tn(980,.22),l.message="You lost them",l.messageTimer=1.4))):lt.evadeT=Math.max(0,lt.evadeT-e*.6)),Me.police=lt.cars.length});const Ze={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},nf=["van","boxTruck","taxi","pickup"];function R0(n){const e=new z(new Qe(3.4,3.4,340,12,1,!0),new Ct({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:yt,blending:si}));return e.frustumCulled=!1,Te.add(e),e}function P0(){for(const n of Ze.beacons)n.geometry.dispose(),n.material.dispose(),Te.remove(n);Ze.beacons=[]}function wh(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?Be.x0+(Math.random()*Math.round((Be.x1-Be.x0)/Be.pitch)|0)*Be.pitch:Be.zNear-(Math.random()*Math.round((Be.zNear-Be.zFar)/Be.pitch)|0)*Be.pitch,a=(Math.random()<.5?-1:1)*(Be.streetW*.5+6),r=i?Be.zFar+100+Math.random()*(Be.zNear-Be.zFar-200):Be.x0+100+Math.random()*(Be.x1-Be.x0-200),o=i?s+a:r,c=i?r:s+a,h=Math.hypot(o-l.roamPos.x,c-l.roamPos.z);if(!(h<n||h>e)&&!Ln(o,c,8,8,1)&&!($s(o,c).depth>0)&&!un.some(d=>Math.abs(o-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:o,z:c,yaw:i?0:Math.PI/2}}return null}function L0(){const n=wh(200,700);if(!n){Ze.cooldown=4;return}const e=nf[Math.random()*nf.length|0];Ze.type=e,Ze.mesh=$r(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ze.mesh.userData.stolenYOff=.57,Ze.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),Ze.mesh.rotation.y=-n.yaw,Te.add(Ze.mesh),Ze.pickup=n;const t=R0(3531007);t.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(t),Ze.state="available",l.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,l.messageTimer=2}function U_(){if(Ze.state!=="available"||!Ze.mesh||l.roamPos.distanceTo(Ze.mesh.position)>6)return!1;_d();const n=Ze.mesh;return st={mesh:n,type:Ze.type,actor:null,parked:null,parkedYaw:0,job:!0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.position.x,ce(n.position.x,n.position.z)+Fn,n.position.z),l.roamYaw=Ze.pickup.yaw,l.camYaw=l.roamYaw,l.speed=0,ln.visible=!1,oi("jack",.5,1,.08)||Tn(340,.18,"square",.1),jn(),F_(),!0}function F_(){const n=wh(420,900)||wh(250,1100);if(!n){Or("no route");return}Ze.dest=n,Ze.timeLeft=Math.round(14+Math.hypot(n.x-l.roamPos.x,n.z-l.roamPos.z)*.062),P0();const e=R0(16766720);e.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(e),Ze.state="active",l.message=`Deliver the ${Ze.type.toUpperCase()} to the gold beacon — ${Ze.timeLeft}s`,l.messageTimer=2.2}function xd(n){P0(),Object.assign(Ze,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Or(n){Ze.state!=="idle"&&(st?.job?(El(),l.vehicle==="car"&&(l.vehicle="foot",ln.visible=!0,l.speed=0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05)):Ze.mesh&&Cs(Ze.mesh),xd(9),n!=="silent"&&(l.message=`Delivery failed — ${n}`,l.messageTimer=1.6,Tn(240,.3,"sawtooth",.1)),Me.deliveryFails=(Me.deliveryFails||0)+1)}function z_(n){Cs(n),xd(9),l.message="Delivery failed — vehicle abandoned",l.messageTimer=1.5,Me.deliveryFails=(Me.deliveryFails||0)+1}function N_(){const n=1200+Math.ceil(Ze.timeLeft)*10;l.score+=n,Me.deliveries=(Me.deliveries||0)+1,Ni(`+${n} DELIVERED`,!0),Tn(980,.18),setTimeout(()=>Tn(1320,.22),100);const e=st?.mesh;st=null,l.drivingStolen=!1,e&&Cs(e),l.vehicle="foot",l.speed=0,ln.visible=!0,l.roamPos.x-=Math.cos(l.roamYaw)*3.4,l.roamPos.z-=Math.sin(l.roamYaw)*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,xd(8),l.message="Delivered! Another job will turn up",l.messageTimer=1.8}pn(new It,(n,e)=>{if(l.mode!=="roam"){Ze.state!=="idle"&&Or("silent");return}Ze.state==="idle"?(Ze.cooldown-=e,Ze.cooldown<=0&&L0()):Ze.state==="active"&&(Ze.timeLeft-=e,Ze.timeLeft<=0?Or("time's up"):l.drivingStolen&&st?.job&&Math.hypot(l.roamPos.x-Ze.dest.x,l.roamPos.z-Ze.dest.z)<15&&Math.abs(l.speed)<26&&N_())});pn(new It,(n,e)=>{if(!he)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;he.rpm+=(t-he.rpm)*Math.min(1,e*(t?1.4:.5)),he.rotor.rotation.y+=he.rpm*26*e,he.tailRotor.rotation.x+=he.rpm*42*e});const O_=new Ct({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),$o=Array.from({length:42},()=>{const n=new z(new Wt(.14,6,5),O_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),k_=new Ct({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:yt}),Sh=Array.from({length:14},()=>{const n=new z(new Ml(.82,1,28),k_.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1}});function D0(n,e,t=1){const i=Sh.find(s=>s.life<=0)||Sh[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ce(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function B_(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=$o.find(a=>a.life<=0)||$o[i%$o.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}D0(n.x,n.z,1.6)}pn(new It,(n,e)=>{for(const t of $o)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of Sh)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const $a=new wM(sn);$a.addPass(new SM(Te,ye));const I0=new Ga(new Fe(window.innerWidth,window.innerHeight),.4,.72,.86);$a.addPass(I0);$a.addPass(new TM);const V_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},pr=new o0(V_);$a.addPass(pr);const G_=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),_r=Array.from({length:72},()=>{const n=new z(new Wt(.1,8,5),G_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),H_=new Ct({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:yt}),yr=Array.from({length:90},()=>{const n=new z(new _n(1,18),H_.clone());return n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),W_=new W({color:2962232,roughness:.58,metalness:.34}),br=Array.from({length:48},()=>{const n=new z(new me(.18,.08,.26),W_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Ae=null;function U0(){if(Ae)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let R=0;R<1024;R++){const S=(R/511.5-1)*1.6;a[R]=4*S/(1+3*Math.abs(S))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const o=(R,S,b)=>{const L=n.createOscillator(),I=n.createGain();return L.type=R,I.gain.value=S,L.connect(I),I.connect(b),L.start(),{o:L,g:I}},c=o("sine",.5,t),h=o("sawtooth",.3,r),d=o("sawtooth",.3,r),u=o("triangle",.03,t),p=n.createOscillator(),m=n.createGain();p.type="sine",p.frequency.value=12,m.gain.value=0,p.connect(m),m.connect(r.gain),p.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),M=x.getChannelData(0);for(let R=0;R<M.length;R++)M[R]=Math.random()*2-1;const g=(R,S,b,L)=>{const I=n.createBufferSource(),V=n.createBiquadFilter(),j=n.createGain();return I.buffer=x,I.loop=!0,I.playbackRate.value=L,V.type=R,V.frequency.value=S,V.Q.value=b,j.gain.value=1e-4,I.connect(V),V.connect(j),j.connect(e),I.start(),{filter:V,gain:j}},f=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),_=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const T=n.createOscillator(),A=n.createGain();T.type="triangle",T.frequency.value=660,A.gain.value=1e-4,T.connect(A),A.connect(e),T.start(),Ae={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:u,burble:{o:p,depth:m},siren:{o:T,g:A},rain:_,wind:f,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const F0={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},X_=["interceptor","bullet","brawler","zephyr"];function z0(){return l.mode==="roam"&&l.drivingStolen&&st?F0[st.type]?st.type:"compact":X_[ki]||"interceptor"}function ss(){Ae||U0(),Ae?.ctx.state==="suspended"&&Ae.ctx.resume().catch(()=>{}),K_()}function Fa(n){if(!Ae)return;const{ctx:e}=Ae,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Ae.master),t.start(),t.stop(e.currentTime+.24)}function q_(){if(!Ae||oi("whoosh",.4,1,.1))return;const{ctx:n}=Ae,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Ae.master),e.start(),e.stop(n.currentTime+.6)}function Y_(){if(!Ae||oi("splat",.6,1,.14))return;const n=Ae.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=N0(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Ae.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Ae.master),s.start(),s.stop(n.currentTime+.26)}let vc=null;function N0(){if(vc)return vc;const n=Ae.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return vc=e}function $_(n=1){if(!Ae||oi("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Ae,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=N0(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Ae.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Zn={buffers:{},loops:{},loading:!1},Z_=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function K_(){if(!(Zn.loading||!Ae)){Zn.loading=!0;for(const n of Z_)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Ae.ctx.decodeAudioData(e)).then(e=>Zn.buffers[n]=e).catch(()=>{})}}function oi(n,e=.5,t=1,i=.06){const s=Ae&&Zn.buffers[n];if(!s)return!1;const a=Ae.ctx,r=a.createBufferSource(),o=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,r.connect(o).connect(Ae.master),r.start(),!0}function Mc(n,e,t=1e-4){if(Zn.loops[n])return Zn.loops[n];if(!Ae||!Zn.buffers[n])return null;const i=Ae.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Zn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Ae.master),s.start(),Zn.loops[n]={src:s,gain:a}}const sf={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function af(n,e,t,i,s,a){const{ctx:r}=Ae,o=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Ae.musicGain),o.start(e),o.stop(e+t+.05)}function J_(){const{ctx:n}=Ae,e=60/92/2;for(Ae.nextNote<n.currentTime-1&&(Ae.nextNote=n.currentTime+.08);Ae.nextNote<n.currentTime+.35;){const t=Ae.beat%32,i=t/8|0;t%4===0&&af(sf.bass[i],Ae.nextNote,.5,"triangle",.5,420),af(sf.arps[i][t%4],Ae.nextNote,.19,"sawtooth",.16,1300),Ae.nextNote+=e,Ae.beat++}}function Zs(n,e=18){const t=Math.min(e,_r.length);for(let i=0;i<t;i++){const s=_r.find(a=>a.life<=0)||_r[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function O0(n,e=10,t=1){const i=Math.min(e,yr.length);for(let s=0;s<i;s++){const a=yr.find(r=>r.life<=0)||yr[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function j_(n,e=8,t=1){const i=Math.min(e,br.length);for(let s=0;s<i;s++){const a=br.find(r=>r.life<=0)||br[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function k0(n,e=Math.abs(l.speed),t="CRASH"){const i=xe.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=xe.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),Zs(n,Math.round(10+i*24)),O0(n,Math.round(5+i*12),i),j_(n,Math.round(3+i*8),i),oi("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||Fa(18+i*34)}function Q_(n){for(const e of _r){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of yr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(ye.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of br)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function ey(){if(!Ae)return;const{ctx:n}=Ae,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,a=xe.clamp((s-900)/6600,0,1),r=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=F0[z0()],h=i?26+(he?.rpm||0)*14:(38+a*124)*c.fMul;Ae.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Ae.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Ae.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Ae.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Ae.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Ae.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Ae.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Ae.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Ae.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Ae.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Ae.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*o),e,.06),Ae.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*o),e,.07),Ae.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Ae.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,u=Mc("skid");Ae.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(u?.05:.15):1e-4,e,.09),u&&u.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const p=Mc("rotor");p&&(p.gain.gain.setTargetAtTime(i?.06+(he?.rpm||0)*.3:1e-4,e,i?.3:.15),p.src.playbackRate.setTargetAtTime(.65+(i&&he?.rpm||0)*.5,e,.4)),l.boosting&&!Ae.prevBoost&&q_(),Ae.prevBoost=!!l.boosting,Ae.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Ae.boost.filter.frequency.setTargetAtTime(l.boosting?420+r*3:260,e,.1),Ae.rain&&Ae.rain.gain.gain.setTargetAtTime(Ha()>.02&&l.mode!=="menu"?Ha()*.045:1e-4,e,.4);const m=l.mode==="roam"&&(l.heat||0)>0&&lt.nearest<460,x=m?Math.min(.06,(460-lt.nearest)/460*.075):1e-4;Ae.siren.g.gain.setTargetAtTime(x,e,.25),Ae.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const M=localStorage.getItem("steel-ribbon-music")!=="0",g=M?Mc("music",Ae.musicGain,1):Zn.loops.music||null;Ae.musicGain.gain.setTargetAtTime(M?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),M&&!g&&J_()}function kr(n=!1,e=!1,t=!1){U0(),ss(),Je.clear(),Gr(),El();const i=n||e;l.seasonRace=t&&!i;for(let a=0;a<Xn.length;a++){const r=Xn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=pt(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],Ey(),Ay(),Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.resultStats.innerHTML="",Xe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Xe.trackName.textContent=se.name,Ot.visible=!1,cn&&(cn.visible=!0),document.body.classList.remove("roam-mode"),Hi(),window.__freeCam=!1}function cl(){ss(),l.mode="roam",l.practice=!0,l.freeRun=!1,Je.clear(),Gr();let n=80,e=338;Pn(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,ce(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",ln.visible=!1,Or("silent"),El(),md(),he&&(he.pos.set(he.pad.x,he.pad.y+.24,he.pad.z),he.vel.set(0,0,0),he.mesh.position.copy(he.pos));for(const s of Zt)s.collected=!1;l.message="",l.messageTimer=0,Zr(!1),Ot.visible=!0,cn&&(cn.visible=!1),document.body.classList.add("roam-mode"),Hi(),window.__freeCam=!1,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);ye.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),Rh(),ye.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),ye.fov=69,ye.updateProjectionMatrix()}function jn(){const n=Md();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(en,-l.roamYaw),n.rotateZ(-l.wheelSteer*xe.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:xe.clamp(-l.roamVy*.014,-.3,.34):xe.clamp(l.roamSuspension,-.16,.22))}function B0(n,e){let t=null;for(const s of na)for(const a of s.segments){const r=n-a.a.x,o=e-a.a.z,c=xe.clamp((r*a.abx+o*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,u=Math.hypot(n-h,e-d);if(u>s.halfW+Dn*1.15)continue;const p=xe.lerp(a.a.y,a.b.y,c),m=xe.lerp(a.u0,a.u1,c),x=u+Math.max(0,ce(n,e)-p)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function V0(n,e,t=ce(n,e),i=!1){let s=null;const a=10;for(let o=0;o<se.length;o+=a){if(Oi(o+a*.5))continue;const c=pt(o),h=pt(o+a),d=h.p.x-c.p.x,u=h.p.z-c.p.z,p=Math.max(1e-4,d*d+u*u),m=xe.clamp(((n-c.p.x)*d+(e-c.p.z)*u)/p,0,1),x=c.p.x+d*m,M=c.p.z+u*m,g=n-x,f=e-M,y=Math.hypot(g,f);if(y>se.width*.5+Dn*.45)continue;const v=xe.lerp(c.p.y,h.p.y,m)+.58;if(!i&&t<v-5)continue;const _=new P(u,0,-d).normalize(),E=xe.clamp(g*_.x+f*_.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+a*m,lateral:E,tangentX:d,tangentZ:u,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function Ws(n,e,t=l.roamPos.y){const i=ce(n,e),s=A_(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=B0(n,e);r&&r.y>=i-1.2&&(a=r);const o=V0(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&o&&o.y>=a.y-.8&&(a=o),a}function rf(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=pt(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=xe.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=xe.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),Zr(!1),Ot.visible=!1,cn&&(cn.visible=!0),document.body.classList.remove("roam-mode"),Hi(),Xe.position.textContent="FREE RUN",Xe.trackName.textContent=se.name,jn(),!0}function ty(n,e,t){if(l.mode!=="race")return!1;const i=t.tangent.x,s=t.tangent.z,a=Math.max(1e-4,Math.hypot(i,s));l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(n,ce(n,e)+Fn,e),l.roamYaw=Math.atan2(i/a,-s/a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.abs(l.speed)*.6,12,70),l.grounded=!0,l.yVel=0,l.airtime=0,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.damage=xe.clamp(l.damage+10,0,100),l.cameraShake=Math.max(l.cameraShake,.8),l.message="Off the ribbon — welcome to the streets",l.messageTimer=1.8,oi("land",.6,.92,.08)||Fa(30),Zs(new P(n,l.roamPos.y+.4,e),20),Zr(!1),Ot.visible=!0,cn&&(cn.visible=!1),document.body.classList.add("roam-mode"),Hi(),l.vehicle="car",ln.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),!0}function ny(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+Fn,t.z+a*3.5),l.roamYaw=Math.atan2(s,-a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),Zr(!1),Ot.visible=!0,cn&&(cn.visible=!1),document.body.classList.add("roam-mode"),Hi(),l.vehicle="car",ln.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),Zs(l.roamPos.clone().add(new P(0,.6,0)),10),!0}function iy(){const n=wl.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),roamView:Ra,heat:+(l.heat||0).toFixed(2),police:lt.cars.length,policeNearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),roadblocks:lt.blocks.length,spikedT:+(l.spikedT||0).toFixed(2),rain:+Ha().toFixed(2),job:{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1)},stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:Me.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&st?.type||null,altitude:+(l.roamPos.y-ce(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var Ks=document.createElement("canvas");Ks.id="minimap",Ks.width=256,Ks.height=256;document.querySelector("#app")?.appendChild(Ks);var Th=null,sy=0,Xs={cx:0,cz:-570,span:2180};function vn(n,e,t){return[((n-Xs.cx)/Xs.span+.5)*t,((e-Xs.cz)/Xs.span+.5)*t]}function gd(){if(!Xs)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Be.x0;s<=Be.x1+1;s+=Be.pitch){const[a,r]=vn(s,Be.zNear,n),[o,c]=vn(s,Be.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}for(let s=Be.zNear;s>=Be.zFar-1;s-=Be.pitch){const[a,r]=vn(Be.x0,s,n),[o,c]=vn(Be.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Tl())if(s.courseIndex===ws){const[a,r]=vn(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of ea){const[a,r]=vn(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/Xs.span*n),Math.max(3,s.rz/Xs.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Ci||[]){const[a,r]=vn(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}Th=e}function ay(){const n=l.mode==="roam";if((Ks.style.display=n?"block":"none")&&!n||!n||!Th||sy++%2)return;const e=Ks.width,t=Ks.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(Th,0,0,e,e);for(const a of na)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[o,c]=vn(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<Zt.length;a++){const r=Zt[a],[o,c]=vn(r.x,r.z,e),h=a===l.objectiveIndex%Zt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(ol*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of En){const[r,o]=vn(a.x,a.z,e);t.fillRect(r-1.4,o-1.4,2.8,2.8)}if(he){const[a,r]=vn(he.pad.x,he.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),l.vehicle!=="heli"){const[o,c]=vn(he.pos.x,he.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[a,r]=vn(Bi.x,Bi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(st?.parked){const[a,r]=vn(st.parked.x,st.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of lt.cars){const[r,o]=vn(a.x,a.z,e);t.beginPath(),t.arc(r,o,3.2,0,Math.PI*2),t.fill()}for(const a of lt.blocks){const[r,o]=vn(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,o-1.4,8,2.8)}if(Ze.state==="available"&&Ze.pickup){const[a,r]=vn(Ze.pickup.x,Ze.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ze.state==="active"&&Ze.dest){const[a,r]=vn(Ze.dest.x,Ze.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=vn(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}gd();let Ei=null;function ry(){Ei||(Ei=new z(new Qe(2.4,3.2,620,12,1,!0),new Ct({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:si,side:yt,fog:!1})),Ei.renderOrder=5,Te.add(Ei));const n=l.mode==="roam"&&Zt.length>0;if(Ei.visible=n,!n)return;const e=Zt[l.objectiveIndex%Zt.length];Ei.position.set(e.x,e.y+296,e.z),Ei.material.opacity=.1+Math.sin(ol*3.1)*.04}let fs=null;function vd(){if(l.mode!=="roam"||Zt.length===0){fs=null;return}const n=Zt[l.objectiveIndex%Zt.length];if(!n)return;const e=fs?.x??l.roamPos.x,t=fs?.z??l.roamPos.z,i=fs?.y??l.roamPos.y,s=l.roamPos.x-e,a=l.roamPos.z-t,r=s*s+a*a;if(fs??={x:0,y:0,z:0},fs.x=l.roamPos.x,fs.y=l.roamPos.y,fs.z=l.roamPos.z,r>4e4)return;const o=r>1e-6?xe.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*o-n.x,h=t+a*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),u=n.radius+1.2;c*c+h*h>u*u||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%Zt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,Ni(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),Tn(880,.16),setTimeout(()=>Tn(1245,.2),90),Zs(new P(n.x,n.y,n.z),18))}function G0(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*c0,a=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const _=l.speed<0?38:0;l.speed+=((a?70:42)*ys().accel+_)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-24,135*ys().top*(l.spikedT>0?.62:1)),l.boosting=a,a?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*ys().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n)),l.spikedT>0&&(l.spikedT-=n);const r=-l.wheelSteer*.55,o=Md().userData.frontWheels;if(o&&(o[0].rotation.y=r,o[1].rotation.y=r),l.drivingStolen&&st)for(const _ of st.mesh.userData.wheels||[])_.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=Je.has("Space")&&!l.roamAir;if(c>vh){const _=xe.clamp((c-vh)/5,0,1),E=1-.36*xe.clamp((c-34)/85,0,1),T=CM*1.08*_*E*(h?1.85:1)*ys().grip*(l.spikedT>0?.55:1)*(1-.26*Ha());l.roamYaw+=l.wheelSteer*T*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=xe.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),u=Math.sin(d),p=-Math.cos(d),m=(l.speed-e)/Math.max(.001,n),x=xe.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-m-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(m)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const _=new P(l.roamPos.x-u*3.2,l.roamPos.y+.2,l.roamPos.z-p*3.2);O0(_,2,l.roamSlip)}const M=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let f=!1,y=!1,v=Ws(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let _=0;_<g;_++)l.roamPos.x+=u*l.speed*n/g,l.roamPos.z+=p*l.speed*n/g,v=Ws(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Fn),vy(l.roamPos,v)&&(y=!0),$0(l.roamPos,v)&&(f=!0),v=Ws(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Fn);l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),f&&(l.collisionCooldown<=0&&(k0(new P(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,jr(.6)),q0(n,e),uy(n,h,f),py(n,f),v=Ws(l.roamPos.x,l.roamPos.z,l.roamPos.y),fy(n,v),!(v.kind==="ramp"&&v.u>.72&&rf(v))&&(v.kind==="track"&&rf(v)||(vd(),jn(),Je.has("KeyR")&&(cl(),Je.delete("KeyR"))))}const of={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let st=null;const H0=[];function Md(){return l.drivingStolen&&st?st.mesh:Ot}function _d(){if(st){if(st.job){const n=st.mesh;st=null,z_(n);return}if(st.actor){const n=st.actor.collider,e=st.mesh.position;n.x=e.x,n.z=e.z}H0.push(st),st=null}}function oy(n){_d(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Te.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return st={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,ce(n.mesh.position.x,n.mesh.position.z)+Fn,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,ln.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,jr(1),oi("jack",.5,1,.08)||Tn(340,.18,"square",.1),jn(),!0}function ly(n){if(_d(),n.taken=!0,n.savedM=new _t,Mn.im){const t=new _t().makeScale(1e-4,1e-4,1e-4);Mn.im.getMatrixAt(n.idx,n.savedM),Mn.im.setMatrixAt(n.idx,t),Mn.imW.setMatrixAt(n.idx,t),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0}const e=$r("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Te.add(e),st={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,ce(n.x,n.z)+Fn,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,ln.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,jr(.7),oi("jack",.45,1.05,.08)||Tn(300,.16,"square",.09),jn(),!0}function cy(){st.mesh.visible=!0,st.parked=l.roamPos.clone(),st.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,ln.visible=!0,!0}function lf(){return!st?.parked||l.roamPos.distanceTo(st.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(st.parked),l.roamYaw=st.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,st.parked=null,ln.visible=!1,jn(),!0)}function W0(){for(const n of En){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return oy(e)}for(const n of Mn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return ly(n);return!1}function cf(n){if(n.actor)n.actor.stolen=!1;else{Cs(n.mesh);const e=n.spotRef;e?.savedM&&Mn.im&&(Mn.im.setMatrixAt(e.idx,e.savedM),Mn.imW.setMatrixAt(e.idx,e.savedM),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function El(){st&&(cf(st),st=null),H0.splice(0).forEach(cf),l.drivingStolen=!1}function Eh(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&st)return l.roamAir=!1,l.roamVy=0,cy(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;Bi.copy(l.roamPos),bh=l.roamYaw,Ot.visible=!0,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,ln.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function Ah(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Bi)>7?!1:(l.vehicle="car",l.roamPos.copy(Bi),l.roamYaw=bh,l.camYaw=bh,l.speed=0,ln.visible=!1,jn(),!0)}function X0(){return l.vehicle!=="foot"||!he||l.roamPos.distanceTo(he.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(he.pos),l.roamYaw=he.yaw,l.camYaw=he.yaw,l.speed=0,he.vel.set(0,0,0),ln.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function Ch(){if(l.vehicle!=="heli"||!he)return!1;const n=ce(he.pos.x,he.pos.z);return he.pos.y-n>5.2||he.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",he.mesh.visible=!0,l.roamPos.x=he.pos.x+Math.cos(he.yaw)*-5.6,l.roamPos.z=he.pos.z+Math.sin(he.yaw)*-5.6,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,ln.visible=!0,!0)}function yd(){l.mode==="roam"&&(l.vehicle==="car"?Eh()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(Bi)<=(st?.parked?l.roamPos.distanceTo(st.parked):1/0)?Ah()||lf():lf()||Ah())||X0()||U_()||W0():Ch())}function hy(n){const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),t=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),i=xe.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1),s=Je.has("ShiftLeft")||Je.has("ShiftRight"),a=l.speed,r=(e-t)*(s?14.5:6.4);l.speed+=(r-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,$0(l.roamPos,{kind:"ground"}),l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,q0(n,a),vd(),ln.position.copy(l.roamPos),ln.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*xe.clamp(Math.abs(l.speed)/5,0,1);for(const p of ln.userData.limbs||[])p.mesh.rotation.x=h*p.amp*p.side*2.2,p.mesh.position.y=p.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Bi)<7,u=he&&l.roamPos.distanceTo(he.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):u&&(l.message="E — enter helicopter",l.messageTimer=.2))}function dy(n){if(!he)return;const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle)-Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),t=xe.clamp((Je.has("KeyA")||Je.has("ArrowLeft")?1:0)-(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-Ee.steer,-1,1),i=he.rpm>.55,s=Je.has("ShiftLeft")||Je.has("ShiftRight"),a=Yr?s?1:he.pos.y-ce(he.pos.x,he.pos.z)>6?-.45:0:Je.has("Space")?1:s?-1:0;he.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(he.yaw),o=-Math.cos(he.yaw);i&&(he.vel.x+=r*e*30*n,he.vel.z+=o*e*30*n,he.vel.y+=a*24*n,a===0&&(he.vel.y-=he.vel.y*1.6*n)),he.vel.x-=he.vel.x*.85*n,he.vel.z-=he.vel.z*.85*n,he.vel.y-=he.vel.y*1.1*n,he.pos.addScaledVector(he.vel,n);const c=ce(he.pos.x,he.pos.z);he.pos.x=xe.clamp(he.pos.x,-1500,1500),he.pos.z=xe.clamp(he.pos.z,-1900,700),he.pos.y=Math.min(he.pos.y,300),he.pos.y<c+1.1&&(he.pos.y=c+1.1,he.vel.y=Math.max(0,he.vel.y)),(wr(he.pos,un)||wr(he.pos,xi))&&(he.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=he.pos.x,l.roamPos.y=he.pos.y,l.roamPos.z=he.pos.z,l.roamYaw=he.yaw,l.speed=Math.hypot(he.vel.x,he.vel.z),he.mesh.position.copy(he.pos),he.mesh.quaternion.setFromAxisAngle(en,-he.yaw),he.mesh.rotateX(xe.clamp((he.vel.x*r+he.vel.z*o)*.008,-.24,.24)),he.mesh.rotateZ(xe.clamp(t*.14,-.2,.2)),vd()}function uy(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),a=Math.round(l.driftAcc*s);l.score+=a,Ni(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),Tn(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function fy(n,e){const t=e.y+Fn,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=w0),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,oi("whoosh",.38,1.2,.08))):(l.roamVy=xe.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const a=l.stuntRamp?.hoop;a&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-a.x,l.roamPos.y-a.y,l.roamPos.z-a.z)<a.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,Tn(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),oi("land",Math.min(.62,s/42),1,.1)||Fa(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const a=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),r=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+a*140;r&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,Me.stunts=(Me.stunts||0)+1,Ni(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),Tn(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const a=Math.round(40+l.roamAirT*70);l.score+=a,Ni(`+${a} AIR`),Tn(760,.14)}}}l.roamPrevY=l.roamPos.y}const Dn=2.6;function q0(n,e){const t=l.waterDepth||0;if(l.roamPos.y>ce(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=$s(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(B_(l.roamPos.clone(),Math.abs(e)),$_(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,D0(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function py(n,e){for(const t of En)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of En){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,a=l.roamPos.z-t.z,r=(t.hw+t.hd)*.5+Dn+2.4;if(s*s+a*a<r*r&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,Ni("+45 NEAR MISS"),Tn(520,.12,"square",.07);break}}}function wr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Fn+.45)continue;if(s.radius){const u=s.radius+Dn,p=n.x-s.x,m=n.z-s.z,x=p*p+m*m;if(x>=u*u)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+p/M*u,n.z=s.z+m/M*u;continue}const a=s.hw+Dn,r=s.hd+Dn,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(o),d=r-Math.abs(c);h<d?n.x=s.x+(o<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function Y0(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Be.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=xe.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(Me.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function my(n){let e=!1;for(let t=0;t<En.length;t++){const i=En[t];if(i.maxY!=null&&n.y>i.maxY+Fn+.45)continue;const s=i.hw+Dn,a=i.hd+Dn,r=n.x-i.x,o=n.z-i.z;if(Math.abs(r)>=s||Math.abs(o)>=a)continue;e=!0,Y0(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(o);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(o<0?-a:a)}return e}function xy(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Fn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function gy(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,Me.splats++,Y_();const e=Ia.find(t=>!t.visible)||Ia[Me.splats%Math.max(1,Ia.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ce(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function vy(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of Ss){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=Dn+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(ce(i.x,i.z)+Fn))>3.2||(gy(i),t=!0)}return t}function $0(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=wr(n,un),a=e?.kind==="ground"?wr(n,ni):!1,r=wr(n,xi),o=e?.kind==="ground"?my(n):!1;if(!s&&!a&&!r&&!o)break;t=!0}return t}function Z0(n){const e=Ee.lookX*1.18,t=Ee.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Ee.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function bd(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=ce(r,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function My(n,e){const t=ce(n,e);let i=null;const s=B0(n,e);s&&s.y>t+4&&(i=s);const a=V0(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function hl(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=My(r,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function Rh(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=xe.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};ye.position.y+=bd(a,ye.position,3.4),ye.position.y+=hl(a,ye.position,4.2)}let Ra=localStorage.getItem("steel-ribbon-roam-view")==="hood"?"hood":"chase";function _y(){Ra=Ra==="chase"?"hood":"chase",localStorage.setItem("steel-ribbon-roam-view",Ra),l.message=Ra==="hood"?"First person":"Third person",l.messageTimer=.9}function K0(){return l.vehicle==="heli"&&he?he.mesh:Md()}function yy(n){const e=K0(),t=l.roamYaw+l.camLookYaw*.8,i=Math.sin(t),s=-Math.cos(t),a=l.vehicle==="heli",r=a?2.6:1.42,o=a?1.2:.85;if(e.visible=!1,ye.position.set(l.roamPos.x+i*o,l.roamPos.y+r-l.roamSuspension*.4,l.roamPos.z+s*o),l.cameraShake>.01){const h=l.cameraShake*.5;ye.position.x+=(Math.random()-.5)*h,ye.position.y+=(Math.random()-.5)*h*.6}an.position.copy(ye.position),an.lookAt(l.roamPos.x+i*30,l.roamPos.y+r+l.camLookPitch*16+(l.roamAir?l.roamVy*.06:0),l.roamPos.z+s*30),an.rotateY(Math.PI),an.rotateZ((l.roamAir&&l.stuntActive&&l.airRoll||0)-l.wheelSteer*.05),ye.quaternion.slerp(an.quaternion,1-Math.pow(.001,n));const c=76+Math.min(14,Math.abs(l.speed)*.08);Math.abs(ye.fov-c)>.02&&(ye.fov+=(c-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function J0(n){if(window.__freeCam)return;if(Z0(n),Math.abs(l.speed)>vh){let M=l.roamYaw-l.camYaw;M=Math.atan2(Math.sin(M),Math.cos(M)),l.camYaw+=M*(1-Math.pow(.08,n))}if(Ra==="hood"&&l.vehicle!=="foot"){yy(n);return}const e=K0();e.visible||(e.visible=!0);const t=l.camYaw+l.camLookYaw,i=Math.sin(t),s=-Math.cos(t),a=l.roamPos,r=xe.clamp(l.cameraZoom,-.42,.9),o=xe.clamp(Math.abs(l.speed)/135,0,1),c=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},h=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*c.d,d=(7.2+o*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*c.h,u=ld.set(a.x-i*h,a.y+d,a.z-s*h);if(l.cameraShake>.01||l.collisionDrama>.01){const M=l.cameraShake+l.collisionDrama*.42;u.x+=(Math.random()-.5)*M*1.2,u.y+=(Math.random()-.5)*M*.75,u.z+=(Math.random()-.5)*M*1.2}const p=wl.set(a.x+i*(13+o*8-Math.min(r,0)*6),a.y+2.45+l.camLookPitch*13.5,a.z+s*(13+o*8-Math.min(r,0)*6));u.y=Math.max(u.y,ce(u.x,u.z)+3.5),u.y+=bd(p,u,3.4),u.y+=hl(p,u,4.2);const m=l.roamSlip>.35?.006:.0026;ye.position.lerp(u,1-Math.pow(m,n)),ye.position.y+=hl(p,ye.position,3.8)*.72,an.position.copy(ye.position),an.lookAt(p),an.rotateY(Math.PI),an.rotateZ(-l.wheelSteer*o*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),ye.quaternion.slerp(an.quaternion,1-Math.pow(.05,n));const x=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(ye.fov-x)>.02&&(ye.fov+=(x-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function by(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Xe.best.textContent=`Best score ${l.best}`,Xe.resultText.textContent=`${n} Score ${t}. Time ${dl(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?dl(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Vt?.active&&e){[{key:"you",metric:l.totalDistance+.001},...Xn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Vt.points[c.key]+=g_[h]??0),Vt.raceIndex++;const r=Vt.raceIndex>=4,o=b0();if(r){Vt.active=!1;const c=o[0].key==="you";c&&Vt.division>1?(localStorage.setItem("steel-ribbon-division",String(Vt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${y0(Vt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}_0(),s=`<span>Season — after race ${Vt.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,Xe.againBtn.textContent=Vt.active?"Next Race":"Back to Menu"}else Xe.againBtn.textContent="Race Again";Xe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,Cl(),Number.isFinite(l.bestLap)&&l.bestLap>3&&fp("lap",Math.round(1e6/l.bestLap),{time:+l.bestLap.toFixed(2),course:se.name,car:As[ki]?.label||""}),Xe.result.classList.remove("hidden")}function _c(n="Craned back to the ribbon"){const e=pt(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function wd(n,e){return xe.clamp(e*n.tangent.y,-48,48)}function wy(n=94){return se.gaps.map(e=>{const t=pt(e.start),i=pt(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=wd(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(xe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-o)*10)/10}})}function hf(n,e){l.grounded=!1,l.yVel=wd(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return wd(pt(n),e)},gapJumpReport(n){return wy(n)},sceneryClearanceReport(){return HM()},setSpeed(n){return l.speed=xe.clamp(n,-14,156-l.damage*.42),Sr(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=pt(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=xe.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=xe.clamp(e,-14,156-l.damage*.42),Sr(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=xe.clamp(n,0,99),Sr(),l.damage},setCourse(n){return Jr(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,ye.position.set(n,e,t),ye.lookAt(i,s,a),ye.fov=62,ye.updateProjectionMatrix(),"freecam"},listBoostPads(){return Ua.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return ea.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+$s(n,e).depth.toFixed(3),ground:+ce(n,e).toFixed(2)}},activeGate(){const n=Zt[l.objectiveIndex%Zt.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Vt,division:Kr(),position:Sd(),seasonRace:!!l.seasonRace,rivals:Xn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Vt=null,Cl(),"reset"},renderInfo(){return{calls:Me.renderCalls||0,triangles:Me.renderTris||0,geometries:sn.info.memory.geometries,textures:sn.info.memory.textures,mobilePerf:Yr,staticMerge:Me.staticMerge||null}},drawAudit(n=20){const e=new Map;return Te.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=En[0]?.actor?.mesh;return{colliders:En.length,wheels:n?.userData?.wheels?.length??0,pedestrians:Me.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of En){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Ae?{state:Ae.ctx.state,master:+Ae.master.gain.value.toFixed(2),engine:!!Ae.rumble&&!!Ae.growl&&!!Ae.whine,fx:!!Ae.wind&&!!Ae.skid&&!!Ae.boost,music:!!Ae.musicGain,beat:Ae.beat,samples:Object.keys(Zn.buffers).length,sampleLoops:Object.keys(Zn.loops),musicSample:!!Zn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:z0(),engineV2:!!Ae.growlB&&!!Ae.burble}:null},colliderAudit(){const n=[],e=[],t=Be.streetW*.5;for(let a=Be.x0;a<=Be.x1+1;a+=Be.pitch)n.push(Math.round(a));for(let a=Be.zNear;a>=Be.zFar-1;a-=Be.pitch)e.push(Math.round(a));const i=[],s=(a,r,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=ce(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const u of n)Math.abs(o.x-u)<t+c+Dn&&o.z<Be.zNear+h&&o.z>Be.zFar-h&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${u}`,overlap:+(t+c+Dn-Math.abs(o.x-u)).toFixed(1)});for(const u of e)Math.abs(o.z-u)<t+h+Dn&&o.x<Be.x1+c&&o.x>Be.x0-c&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${u}`,overlap:+(t+h+Dn-Math.abs(o.z-u)).toFixed(1)})}};return un.forEach((a,r)=>s("Mn",r,a)),xi.forEach((a,r)=>s("Di",r,a)),ni.forEach((a,r)=>s("$n",r,a)),{total:un.length+xi.length+ni.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&cl(),n==="foot"?l.vehicle==="car"?Eh(!0):l.vehicle==="heli"&&Ch():n==="heli"&&he?(l.vehicle==="car"&&Eh(!0),l.roamPos.set(he.pos.x+3,ce(he.pos.x+3,he.pos.z),he.pos.z),X0()):n==="car"&&(l.vehicle==="heli"&&(he.pos.y=ce(he.pos.x,he.pos.z)+1.1,he.vel.set(0,0,0),Ch()),l.vehicle==="foot"&&(l.roamPos.copy(Bi),Ah())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:ln.visible,heli:he?{x:+he.pos.x.toFixed(1),y:+he.pos.y.toFixed(1),z:+he.pos.z.toFixed(1),rpm:+he.rpm.toFixed(2),scale:+he.mesh.scale.x.toFixed(2),pad:he.pad?{x:+he.pad.x.toFixed(1),z:+he.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Bi.x.toFixed(1),z:+Bi.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:st?{type:st.type,fromTraffic:!!st.actor,pos:{x:+st.mesh.position.x.toFixed(1),y:+st.mesh.position.y.toFixed(2),z:+st.mesh.position.z.toFixed(1)},visible:st.mesh.visible,inScene:st.mesh.parent===Te,parked:st.parked?{x:+st.parked.x.toFixed(1),z:+st.parked.z.toFixed(1)}:null}:null,parkedSpots:Mn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?W0():!1},setHeat(n){return l.mode==="roam"&&(l.heat=xe.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:lt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),evadeT:+lt.evadeT.toFixed(1),bustT:+lt.bustT.toFixed(2),blocks:lt.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:Me.busts||0}},policeTeleportNearest(n,e){const t=lt.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1),pickup:Ze.pickup?{x:+Ze.pickup.x.toFixed(1),z:+Ze.pickup.z.toFixed(1)}:null,dest:Ze.dest?{x:+Ze.dest.x.toFixed(1),z:+Ze.dest.z.toFixed(1)}:null,deliveries:Me.deliveries||0,fails:Me.deliveryFails||0}},jobSpawnNow(){return Ze.state==="idle"&&(Ze.cooldown=0,L0()),Ze.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==ri&&(Ad(),localStorage.setItem("steel-ribbon-weather",ri)),ri},weatherInfo(){return{mode:ri,amt:+Ha().toFixed(2),roadRoughness:+(mn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of En)e.actor?.panicT>0&&n++;return n},mpInfo(){return{connected:xt.connected,room:xt.room,id:xt.id,peers:[...xt.peers.values()].map(n=>({name:n.name,has:n.has,x:+(n.tx||0).toFixed(1),z:+(n.tz||0).toFixed(1)}))}},mpJoin(n,e){const t=document.querySelector("#mpRoom"),i=document.querySelector("#mpName");return t&&(t.value=n),i&&(i.value=e),gp(),xt.room},mpLeave(){return ml(!0),!xt.connected},boardsInfo(){return up(Xr).then(n=>({mode:Xr,rows:n?n.length:null,ok:n!==null}))},gamepadInfo(){return{active:Bn.active}},setTod(n){return Er.includes(n)&&(Hn=n,localStorage.setItem("steel-ribbon-tod",n),Cd()),Hn},todInfo(){return{mode:Hn,day:+Zo.toFixed(3),night:+Ko.toFixed(3)}},listStuntRamps(){return(Ci||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of Mn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&cl(),l.roamPos.set(n,ce(n,e)+Fn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,jn(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{..._s,boostPads:Ua.length,gapBeacons:Nr.length,railRuns:Me.railRuns||0,railPosts:Me.railPosts||0,ponds:ea.length,cityPonds:Me.ponds||0,cloudSprites:Me.cloudSprites||0,helipad:Me.helipad||null,stuntRamps:Me.stuntRamps||0,propPlanes:Me.propPlanes||0}},stats(){return{trafficCrashes:Me.trafficCrashes,splats:Me.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},detailReport(){return{plates:Pi.mesh?{atlasSlots:64,traffic:Pi.dynamics.length,parked:Pi.statics.length,uniqueTexts:new Set(Pi.texts).size,sample:Pi.texts.slice(0,5)}:null,peds:{pool:Aa.pool,promoted:Aa.promotedCount(),texting:(Aa.kits||[]).reduce((n,e)=>n+(e.ped&&e.texting?1:0),0),radius:yh,sample:(Aa.kits||[]).filter(n=>n.ped).slice(0,3).map(n=>{const e={x:+n.ped.x.toFixed(1),y:+n.ped.mesh.position.y.toFixed(2),z:+n.ped.z.toFixed(1),axis:n.ped.axis,dir:n.ped.dir,t:n.texting?1:0};if(n.texting){const t=n.phone.getWorldPosition(new P);e.phone={x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)}}return e})}}},viewInfo(){const n=pt(l.s),e=l.y-2.1;return{trackView:Mi,mode:l.mode,carVisible:Ot.visible,cockpitVisible:!!(cn&&cn.visible),camY:+ye.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!Ii,overheadY:+Ph(ye.position.x,ye.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return Mi=n==="cockpit"?"cockpit":"chase",Hi(),Mi},listCourses(){return Qs.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:ws,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Px(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=ye;const i=t.intersectObjects(Te.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=Ws(n,e,400);return{x:n,z:e,ground:+ce(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return na.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],o=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return un.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return ni.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=ni.filter(e=>e.hw);return{supports:Mh,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of un){const i=ks(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of un){const i=Ln(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return xi.concat(ni.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:Me.traffic,pedestrians:Me.pedestrians,pedestriansActive:Ss.filter(e=>e.active).length,turns:Me.turns,splats:Me.splats,trafficCrashes:Me.trafficCrashes,streetLights:Me.streetLights,trafficLights:Me.trafficLights,stopSigns:Me.stopSigns,signs:Me.signs,roadDetails:{...Me.roadDetails},buildingArchetypes:{...Me.buildingArchetypes},zones:{...Me.zones},openerProps:Me.openerProps,signSamples:ll.slice(0,n),types:{...Me.types},offRoadTraffic:En.filter(e=>!Sl(e.x,e.z,2)).length,trafficRoutes:_h.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:En.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Ss.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...Me.roadDetails},e={...Me.buildingArchetypes},t={...Me.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,Me.signs/7)+Math.min(14,Me.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:Me.openerProps,signs:Me.signs,streetLights:Me.streetLights,streetGlowSprites:_s.streetGlowSprites,waterBlockers:_s.waterBlockers,lowFogDisks:_s.lowFogDisks}},objectiveReport(){const n=Zt[l.objectiveIndex%Math.max(1,Zt.length)];return{total:Zt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:Zt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:yr.filter(n=>n.life>0).length,debrisActive:br.filter(n=>n.life>0).length,sparksActive:_r.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Ot.userData.detailReport},racer:{...m_.userData.detailReport},namedParts:Ot.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);x0(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=pt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=ce(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,r+Fn,s),l.roamYaw=a,l.camYaw=a,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,jn();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),Rh(),ye.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),ye.fov=69,ye.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Ws(n,e,l.roamPos.y);l.roamPos.set(n,i.y+Fn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,jn();const s=Math.sin(l.roamYaw),a=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-a*17),Rh(),ye.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+a*13),ye.fov=69,ye.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ee.zoom,i=30){Ee.lookX=xe.clamp(n,-1,1),Ee.lookY=xe.clamp(e,-1,1),Ee.zoom=xe.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?J0(1/60):Td(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake};Ee.steer=xe.clamp(e,-1,1),Ee.throttle=xe.clamp(t,0,1),Ee.brake=xe.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const o=Math.min(a,r);if(G0(o),l.mode!=="roam")break;r-=o}return Ee.steer=s.steer,Ee.throttle=s.throttle,Ee.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(j0(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=ld.set(0,0,-1).applyQuaternion(Ot.quaternion).normalize(),t=wl.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=Ws(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+ce(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+ye.position.x.toFixed(2),camY:+ye.position.y.toFixed(2),camZ:+ye.position.z.toFixed(2),fov:+ye.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+bd({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},2.4).toFixed(3),elevatedCameraLift:+hl({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},3.8).toFixed(3),colliders:un.length+ni.length+xi.length+En.length,insideBuilding:un.concat(ni,xi,En).some(s=>xy(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Ot.userData.frontWheels?+Ot.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function j0(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*c0,a=t>.03&&!e,r=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&a&&l.grounded,o=pt(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(a){const v=l.speed<0?40:0;l.speed+=((r?68:40)*ys().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-16,156*ys().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=r,r?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*ys().boostRegen);const u=Je.has("Space")&&l.grounded,p=(16+h*.13)*(u?1.45:1)*ys().grip;l.lateralVel-=s*p*n,l.lateralVel-=l.lateralVel*(l.grounded?u?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const m=Oi(l.s),x=Math.abs(l.lateral)<se.width*.52,M=!m&&x;if(l.grounded&&(!M||Math.abs(l.lateral)>se.width*.5)&&hf(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=xe.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&Zs(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector(en,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=pt(l.s),_=v.p.y+2.1;if(!Oi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=_&&l.yVel<0){const E=-l.yVel,T=Math.abs(l.lateral)<se.width*.34&&E<30,A=Math.round(T?260+l.airtime*85:Math.max(30,120-E));l.y=_,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=A,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=T?"Clean landing":"Hard landing",l.messageTimer=.9,T?l.cleanLandings+=1:l.hardLandings+=1,Ni(`+${A} ${T?"CLEAN AIR":"LANDED"}`,T),T&&Tn(990,.14),Fa(E),Zs(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(en,.7),T?7:24),l.airtime=0}if(l.practice||l.freeRun){if(!l.grounded&&l.yVel<-6){const E=pt(l.s),T=E.p.x+E.side.x*l.lateral,A=E.p.z+E.side.z*l.lateral,R=ce(T,A);l.y<=R+1.3&&ty(T,A,E)}l.y<-55&&(l.damage+=28,_c("Track crew recovery"))}else l.y<-55&&(l.damage+=28,_c("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,Ry();const f=na.find(v=>v.rampType==="off");if(l.freeRun&&f&&uc(g,l.totalDistance,f.exitS)&&l.lateral*f.dirSel>se.width*.2&&ny(f))return;const y=Math.floor(l.totalDistance/se.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;Cy(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,Ni("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const _=Sd();by(_===1?"You took the chequered gantry.":`You finished P${_}.`,_)})()}for(const v of se.gaps)uc(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&hf(pt(v.start),v.name));if(l.grounded){for(const v of Ua)if(uc(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const _=pt(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,Ni("+90 BOOST"),Tn(640,.22,"sawtooth",.1),Zs(_.p.clone().addScaledVector(_.side,v.lat).addScaledVector(en,1),10),Fa(14);break}}l.damage=xe.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),Fa(40),l.damage=90),Je.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),_c("Manual reset"),Je.delete("KeyR"))}function df(n){const e=se.length*se.laps,t=1+.07*(4-Kr());for(const i of Xn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=xe.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let u=i.base+d+h;i.key==="bishop"&&(u+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(u+=10*xe.clamp(i.distance/Math.max(1,e),0,1)),i.speed=xe.clamp(u*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=pt(i.s),a=Math.abs(i.distance-l.totalDistance);let r=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);r=xe.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(en,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new _t().makeBasis(s.side,en,s.tangent));const o=a<26&&Mi==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...Xn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function Sd(){return l.practice?1:1+Xn.filter(n=>n.distance>l.totalDistance).length}function Sy(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),ye.position.copy(i);const a=Math.abs(l.speed),r=68+Math.min(10,a*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(ye.fov-r)>.02&&(ye.fov+=(r-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix());const o=pt(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,a/680),an.position.copy(ye.position),an.lookAt(c),an.rotateY(Math.PI),an.rotateY(-l.camLookYaw),an.rotateZ(-e.bank*.72-l.lateralVel*.006),an.rotateX(e.grade*.18+(l.grounded?0:xe.clamp(l.yVel,-30,30)*-.006)),ye.quaternion.slerp(an.quaternion,1-Math.pow(8e-4,n))}function Ph(n,e,t,i){let s=1/0;const a=se.width*.5+2.2;for(const r of Tl()){if(r.courseIndex!==ws||r.y<t||r.y>i||r.y>=s)continue;const o=n-r.x,c=e-r.z;o*o+c*c<a*a&&(s=r.y)}return s}function Ty(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+xe.clamp(l.cameraZoom,-.42,.9)*8,a=4.6+t*.014+l.camLookPitch*10,r=pt(l.s-s),o=Ph(r.p.x,r.p.z,i+5,i+64);o-1.5<r.p.y+2&&(s=6.4,a=2.7,r=pt(l.s-s),o=Ph(r.p.x,r.p.z,i+5,i+64));let c=xe.lerp(r.p.y,i,.62)+a;const h=od.set(r.p.x+r.side.x*l.lateral*.72,0,r.p.z+r.side.z*l.lateral*.72);if(c=Math.max(c,r.p.y+2.35,ce(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const m=l.cameraShake;h.x+=(Math.random()-.5)*m*1.1,h.y+=(Math.random()-.5)*m*.6,h.z+=(Math.random()-.5)*m*1.1}ye.position.distanceTo(h)>70&&ye.position.copy(h),ye.position.lerp(h,1-Math.pow(2e-4,n)),ye.position.y=Math.max(ye.position.y,r.p.y+2.05),o<1/0&&(ye.position.y=Math.min(ye.position.y,o-1.4));const d=pt(l.s+17+t*.09),u=d.p.clone().addScaledVector(d.side,l.lateral*.55);u.y+=2.1+l.camLookPitch*12,l.grounded||(u.y=xe.lerp(u.y,l.y+1.2,.5)),an.position.copy(ye.position),an.lookAt(u),an.rotateY(Math.PI),an.rotateY(-l.camLookYaw),an.rotateZ(-e.bank*.42-l.lateralVel*.0034),ye.quaternion.slerp(an.quaternion,1-Math.pow(4e-4,n));const p=66+Math.min(11,t*.055)+(l.boosting?5:0)+xe.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(ye.fov-p)>.02&&(ye.fov+=(p-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix())}let gi=null,Ii=null,ji=0;function Ey(){try{Ii=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+ws)||"null")}catch{Ii=null}ji=0}function Ay(){gi&&Ca(gi),gi=As[ki].build(),gi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),gi.visible=!1}function Cy(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||Ii&&n>=Ii.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);Ii={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+ws,JSON.stringify(Ii))}catch{}l.message=`Ghost saved — ${dl(n)}`,l.messageTimer=1.3,ji=0}function Ry(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function Py(){if(!gi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&Ii?.samples?.length>2&&!window.__freeCam;if(gi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,Ii.time),t=Ii.samples;for(e<(t[ji]?.[0]??0)&&(ji=0);ji<t.length-2&&t[ji+1][0]<e;)ji++;const i=t[ji],s=t[Math.min(ji+1,t.length-1)],a=xe.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=xe.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:a),o=xe.lerp(i[2],s[2],a),c=xe.lerp(i[3],s[3],a),h=pt((r%se.length+se.length)%se.length);gi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),gi.quaternion.setFromRotationMatrix(new _t().makeBasis(h.side,en,h.tangent))}function Ly(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&Mi==="chase"&&!window.__freeCam;if(cn&&(cn.visible=!e),Ot.visible!==e&&(Ot.visible=e),!e)return;const t=pt(l.s);Ot.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new _t().makeBasis(t.side,en,t.tangent);Ot.quaternion.setFromRotationMatrix(i),l.grounded?(Ot.rotateX(-t.grade*.5),Ot.rotateZ(t.bank*.6+xe.clamp(l.lateralVel*.012,-.16,.16))):Ot.rotateX(xe.clamp(-l.yVel*.011,-.34,.4));const s=Ot.userData.frontWheels,a=xe.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let Bo=.6;function Dy(n){if(window.__freeCam)return;Bo+=n*.13;const e=80,t=300,i=ce(e,t);Ot.visible=!0,cn&&(cn.visible=!1),Ot.position.set(e,i+.85,t),Ot.quaternion.setFromAxisAngle(en,Math.PI*.24);const s=16.5;ye.position.set(e+Math.cos(Bo)*s,i+5.3+Math.sin(Bo*.57)*1.1,t+Math.sin(Bo)*s),ye.lookAt(e,i+1.5,t),ye.rotateY(.3),Math.abs(ye.fov-58)>.1&&(ye.fov=58,ye.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function Td(n){if(window.__freeCam)return;Z0(n);const e=pt(l.s);Mi==="chase"&&l.mode!=="menu"?Ty(n,e):Sy(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=wl.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const qs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},hr=[28,54,82,110,134,156];function Iy(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<hr.length;o++)n>hr[o]&&(e=o+2);e=Math.min(e,hr.length);const t=e===1?0:hr[e-2],i=hr[e-1],s=i>t?xe.clamp((n-t)/(i-t),0,1):0,a=e===1?qs.idle:qs.postShift;let r=a+s*(qs.shift-a);return n<.4&&(r=qs.idle),{gear:e,rpm:r}}let uf=performance.now(),yc=0,bc=0;function Q0(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function Uy(n,e){const t=Xe.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=Q0(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=o(M),f=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=f?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(f?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),f){const _=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),_[0],_[1])}}const d=xe.clamp(n/h,0,1),u=o(d),p=c(u,r-r*.06),m=c(u+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(m[0],m[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function Fy(n,e){const t=Xe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=Q0(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke();const d=xe.clamp(n,0,1),u=n<.25;i.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,f=o(g),y=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(f,r-r*.02),_=c(f,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(_[0],_[1]),i.stroke(),y){const E=c(f,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const p=o(d),m=c(p,r-r*.06),x=c(p+Math.PI,r*.14);i.strokeStyle=u?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function zy(n,e){const t=Xe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const o=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=qs.max,u=v=>Math.PI-v*Math.PI,p=(v,_)=>[o+Math.cos(v)*_,c-Math.sin(v)*_];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,u(1),u(0)),i.stroke();const m=qs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,u(1),u(m)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const _=v/9,E=u(_),T=v*1e3>=qs.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const A=p(E,h-h*.02),R=p(E,h-h*.18);i.beginPath(),i.moveTo(A[0],A[1]),i.lineTo(R[0],R[1]),i.stroke();const S=p(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),S[0],S[1]),v<9){const b=u((v+.5)/9),L=p(b,h-h*.02),I=p(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(I[0],I[1]),i.stroke()}}const x=xe.clamp(n/d,0,1),M=u(x),g=p(M,h-h*.06),f=p(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(f[0],f[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function Sr(){se.length*se.laps;const n=Xu(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${Sd()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),Xe.damage.style.width=`${Math.round(l.damage)}%`,Xe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,Xe.timer.textContent=dl(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";Xe.score.textContent=t?`Gates ${l.objectiveHits}/${Zt.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(Xe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&st?`${st.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${Kr()}`,t&&Zt.length){const d=Zt[l.objectiveIndex%Zt.length];Xe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(Xe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),t&&Ze.state==="active"&&(Xe.trackName.textContent=`Deliver the ${Ze.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ze.timeLeft))}s`),Xe.hud.style.display=s?"flex":"none",Xe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",Xe.touchControls.style.display=s?"":"none",Xe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of Xn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:Xu(d.distance))*100)}%`);const a=Iy();l.gear=a.gear;const r=performance.now(),o=Math.min(.05,(r-uf)/1e3);uf=r;const c=1-Math.exp(-o*(a.rpm>l.tachRpm?10:6));l.tachRpm+=(a.rpm-l.tachRpm)*c,zy(l.tachRpm,a.gear);const h=Math.abs(l.speed)*2.25;yc+=(h-yc)*(1-Math.exp(-o*8)),bc+=(l.boost-bc)*(1-Math.exp(-o*9)),Uy(yc,l.speed<-.5),Fy(bc,l.boosting),Xe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),Xe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(Xe.centerMessage.textContent="Paused",Xe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(Xe.centerMessage.textContent=l.message,Xe.centerMessage.classList.remove("hidden")):Xe.centerMessage.classList.add("hidden")}function dl(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}const Bn={active:!1,prev:{}};function Ny(){let n=null;if(navigator.getGamepads){for(const d of navigator.getGamepads())if(d&&d.connected){n=d;break}}if(!n){if(Bn.active){Bn.active=!1,Ee.steer=0,Ee.throttle=0,Ee.brake=0;for(const d of["Space","ShiftLeft"])Bn.prev[d]&&(Je.delete(d),Bn.prev[d]=!1)}return}const e=d=>Math.abs(d)<.14?0:d,t=e(n.axes[0]||0),i=Math.max(n.buttons[7]?.value||0,n.buttons[0]?.pressed?1:0),s=Math.max(n.buttons[6]?.value||0,n.buttons[1]?.pressed?1:0),a=!!n.buttons[2]?.pressed,r=!!n.buttons[3]?.pressed,o=!!n.buttons[5]?.pressed,c=!!n.buttons[9]?.pressed;if(!Bn.active&&!t&&!i&&!s&&!a&&!r&&!o&&!c)return;Bn.active||ss(),Bn.active=!0,Ee.steer=t,Ee.throttle=i,Ee.brake=s;const h=(d,u)=>{u&&!Bn.prev[d]?Je.add(d):!u&&Bn.prev[d]&&Je.delete(d),Bn.prev[d]=u};h("Space",a),h("ShiftLeft",o),r&&!Bn.prev.actB&&l.mode==="roam"&&yd(),Bn.prev.actB=r,c&&!Bn.prev.startB&&window.dispatchEvent(new KeyboardEvent("keydown",{code:l.mode==="race"||l.mode==="paused"?"KeyP":"Escape"})),Bn.prev.startB=c}function ep(){sn.info.reset(),Ny();const n=AM.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?hy(e):l.vehicle==="heli"?dy(e):G0(e),J0(e),iy()):l.mode==="menu"?(df(e),Dy(e)):(j0(e),df(e),Ly(),Py(),Td(e)),ry(),ay(),pi&&pi.position.copy(ye.position),Q_(e),x0(e),Sr(),ey(),pr.uniforms.uTime.value+=e,f0.forEach(i=>i.uniforms.uTime.value+=e),pr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);pr.uniforms.uBoost.value+=(t-pr.uniforms.uBoost.value)*Math.min(1,e*6),$a.render(),Me.renderCalls=sn.info.render.calls,Me.renderTris=sn.info.render.triangles,requestAnimationFrame(ep)}window.addEventListener("keydown",n=>{Je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused"?RM():l.mode==="roam"&&l.vehicle!=="foot"&&_y()),n.code==="KeyE"&&yd(),n.code==="KeyN"&&hp(),n.code==="KeyV"&&Ad(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",Je.clear(),Gr()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",Gr(),Ot.visible=!1,cn&&(cn.visible=!0),document.body.classList.remove("roam-mode"),Hi(),Xe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>Je.delete(n.code));window.addEventListener("resize",()=>{ye.aspect=window.innerWidth/window.innerHeight,ye.updateProjectionMatrix(),sn.setSize(window.innerWidth,window.innerHeight),$a.setSize(window.innerWidth,window.innerHeight),I0.setSize(window.innerWidth,window.innerHeight)});const ul=()=>{ss(),window.removeEventListener("pointerdown",ul),window.removeEventListener("keydown",ul)};window.addEventListener("pointerdown",ul);window.addEventListener("keydown",ul);const Br=document.createElement("button");Br.id="volBtn",Br.type="button";function tp(){Br.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}tp();Br.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Ae&&Ae.master.gain.setTargetAtTime(e,Ae.ctx.currentTime,.05),tp()});const np=document.querySelector("#menuToggles")||Xe.menu;np.appendChild(Br);const Vr=document.createElement("button");Vr.id="musicBtn",Vr.type="button";function ip(){Vr.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}ip();Vr.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),ss(),ip()});np.appendChild(Vr);const Tr=document.createElement("button");Tr.id="actionBtn",Tr.type="button",Tr.textContent="E";Tr.addEventListener("pointerdown",n=>{n.preventDefault(),ss(),yd()});Xe.touchControls.appendChild(Tr);const Al=document.createElement("div");Al.className="course-select";Al.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Xe.freeRunBtn.parentNode.insertBefore(Al,Xe.freeRunBtn);const sp=[];As.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>x_(e)),Al.querySelector("#carButtons").appendChild(t),sp.push(t)});function Lh(){const n=As[ki],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),sp.forEach((t,i)=>t.classList.toggle("active",i===ki))}Lh();Xe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+Xn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Xe.playerProgress=document.querySelector("#playerProgress");Xn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function Cl(){const n=Kr();Xe.startBtn.textContent=Vt?.active?`Continue Season — Race ${Vt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=b0();e.innerHTML=`<span>Division ${y0(n)}${Vt?.active?` — after race ${Vt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Vt?` — ${i.pts} pts`:""}</b>`).join("")}}function Oy(){l.mode==="roam"&&l.score>800&&fp("roam",l.score,{deliveries:Me.deliveries||0,stunts:Me.stunts||0,busts:Me.busts||0}),l.mode="menu",Gr(),Ot.visible=!1,cn&&(cn.visible=!0),Zr(!1),document.body.classList.remove("roam-mode"),Hi(),Cl(),Xe.result.classList.add("hidden"),Xe.menu.classList.remove("hidden")}Cl();Xe.startBtn.addEventListener("click",()=>{Vt&&Vt.active||v_(),Jr(xe.clamp(Vt.raceIndex,0,3)),kr(!1,!1,!0)});Xe.practiceBtn.addEventListener("click",()=>kr(!0));Xe.freeRunBtn.addEventListener("click",()=>kr(!0,!0));Xe.roamBtn.addEventListener("click",()=>cl());Xe.againBtn.addEventListener("click",()=>{l.seasonRace&&Vt?Vt.active&&Vt.raceIndex<4?(Jr(Vt.raceIndex),kr(!1,!1,!0)):Oy():kr(!1)});Xe.courseButtons.forEach(n=>{n.addEventListener("click",()=>Jr(Number(n.dataset.course)))});function ap(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Gr(){Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,Ee.lookPointer=null,Ee.drivePointer=null,Ee.pinchStartDistance=0,Ee.pinchStartZoom=0;for(const n of Xe.touchControls.querySelectorAll(".touch-stick"))ap(n)}function Vo(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=xe.clamp(e.clientX-(t.left+t.width/2),-i,i),a=xe.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Ee.lookX=xe.clamp(s/i,-1,1),Ee.lookY=xe.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ee.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ee.lookY*i)}px`);else{const o=xe.clamp(s/i,-1,1),c=xe.clamp(-a/i,-1,1);Ee.steer=o,Ee.throttle=Math.max(0,c),Ee.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function ff(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function pf(n,e){e==="look"?(Ee.lookX=0,Ee.lookY=0,Ee.lookPointer=null):(Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.drivePointer=null),ap(n)}function ky(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function rp(n,e=!1){if(n.touches.length<2){Ee.pinchStartDistance=0;return}const t=ky(n.touches[0],n.touches[1]);if(e||!(Ee.pinchStartDistance>0)){Ee.pinchStartDistance=t,Ee.pinchStartZoom=Ee.zoom;return}const i=Math.max(.2,t/Ee.pinchStartDistance);Ee.zoom=xe.clamp(Ee.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Xe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),ss(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Ee.lookPointer=s.pointerId),e==="drive"&&(Ee.drivePointer=s.pointerId),Vo(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&(s.preventDefault(),Vo(n,s))},{passive:!1});const t=s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&pf(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),ss(),l.mode==="paused"&&(l.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Ee.lookPointer=a.identifier),e==="drive"&&(Ee.drivePointer=a.identifier),Vo(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer,r=ff(s,a);r&&(s.preventDefault(),Vo(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer;ff(s,a)&&(s.preventDefault(),pf(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Xe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),ss(),Je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>Je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}qr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),rp(n,!0))},{passive:!1});qr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),rp(n))},{passive:!1});qr.addEventListener("touchend",n=>{n.touches.length<2&&(Ee.pinchStartDistance=0)},{passive:!1});qr.addEventListener("touchcancel",()=>{Ee.pinchStartDistance=0},{passive:!1});var Ti=0;function Ha(){return Ti}let ri=localStorage.getItem("steel-ribbon-weather")||"clear";ri==="rain"||(ri="clear");const Ed=420,op=[];for(let n=0;n<Ed;n++)op.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const fl=new Kt;fl.setAttribute("position",new bt(new Float32Array(Ed*6),3));const lp=new il({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),Ys=new Hm(fl,lp);Ys.frustumCulled=!1,Ys.renderOrder=40,Ys.visible=!1,Te.add(Ys);pn(new It,(n,e)=>{const t=ri==="rain"?1:0;if(Ti+=(t-Ti)*Math.min(1,e*1.3),t===0&&Ti<.01&&(Ti=0),Ys.visible=Ti>.02,lp.opacity=.34*Ti,Ys.visible){Ys.position.copy(ye.position);const i=fl.attributes.position.array;for(let s=0;s<Ed;s++){const a=op[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}fl.attributes.position.needsUpdate=!0}mn.roadMat&&(mn.roadMat.roughness=.62-.37*Ti,mn.roadMat.metalness=.1+.26*Ti,mn.roadMat.envMapIntensity=.8+.9*Ti)});function Ad(){ri=ri==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",ri),cp(),l.message=ri==="rain"?"Rain rolling in":"Skies clearing",l.messageTimer=1.2}const Hr=document.createElement("button");Hr.id="weatherBtn",Hr.type="button";function cp(){Hr.textContent=ri==="rain"?"🌧 Rain":"☀ Clear"}cp();Hr.addEventListener("click",n=>{n.stopPropagation(),Ad()});(document.querySelector("#menuToggles")||Xe.menu).appendChild(Hr);const Er=["dusk","night","day","cycle"],By={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let Hn=localStorage.getItem("steel-ribbon-tod")||"dusk";Er.includes(Hn)||(Hn="dusk");let Zo=0,Ko=0,wc=95;const Vy=new rt,Dh=new rt,Gy=new rt;function Ns(n,e,t,i,s){return Gy.set(n).lerp(Vy.set(e),i).lerp(Dh.set(t),s)}const ps=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Te.traverse(n=>{n.isSprite&&n.renderOrder===-50&&mn.cloudMats.push(n.material)});function Hy(n,e){if(!mn.skyU)return;const t=Ha();mn.skyU.uDay.value=n,mn.skyU.uNight.value=e,mn.skyU.uRain.value=t;const i=mn;i.hemi.color.copy(Ns(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(Ns(3097190,5925464,789534,n,e)),i.hemi.intensity=ps(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(Ns(7179775,13096432,2240591,n,e)),i.fill.intensity=ps(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(Ns(16752724,16774880,10336511,n,e)),i.key.intensity=ps(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=ps(.5,.3,.1,n,e)*(1-.4*t),Te.fog.color.copy(Ns(14719602,12834794,723741,n,e).lerp(Dh.set(5923950),.6*t)),Te.fog.near=ps(360,430,300,n,e)*(1-.45*t),Te.fog.far=ps(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(Ns(16764250,16777198,14542591,n,e)),i.sunMat.opacity=ps(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=ps(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=Ns(16777215,16777215,3687001,n,e).lerp(Dh.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}pn(new It,(n,e)=>{let t=0,i=0;if(Hn==="day")t=1;else if(Hn==="night")i=1;else if(Hn==="cycle"){wc=(wc+e)%270;const a=wc;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);Zo+=(t-Zo)*s,Ko+=(i-Ko)*s,Hy(Zo,Ko)});function hp(){Hn=Er[(Er.indexOf(Hn)+1)%Er.length],localStorage.setItem("steel-ribbon-tod",Hn),Cd(),l.message=`Time of day: ${Hn.toUpperCase()}`,l.messageTimer=1.2}const Wr=document.createElement("button");Wr.id="todBtn",Wr.type="button";function Cd(){Wr.textContent=`${By[Hn]} ${Hn[0].toUpperCase()}${Hn.slice(1)}`}Cd();Wr.addEventListener("click",n=>{n.stopPropagation(),hp()});(document.querySelector("#menuToggles")||Xe.menu).appendChild(Wr);const mf=document.querySelector("#menuMain"),Wy=document.querySelector("#onlinePanel"),Xy=document.querySelector("#scoresPanel");function pl(n){mf&&(mf.classList.toggle("hidden",!!n),Wy.classList.toggle("hidden",n!=="online"),Xy.classList.toggle("hidden",n!=="scores"))}const dp={lap:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",roam:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1"},Ih="steel-ribbon-initials",Sa=document.querySelector("#initials");Sa&&(Sa.value=localStorage.getItem(Ih)||"",Sa.addEventListener("input",()=>{Sa.value=Sa.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,3),localStorage.setItem(Ih,Sa.value)}));function qy(){return(localStorage.getItem(Ih)||"").slice(0,3)}let Xr="lap";async function up(n){try{const e=new AbortController,t=setTimeout(()=>e.abort(),7e3),i=await fetch(dp[n],{signal:e.signal,cache:"no-store"});clearTimeout(t);const s=await i.json();return(Array.isArray(s)?s:s.scores||[]).filter(r=>Number(r.score)>0).sort((r,o)=>o.score-r.score).slice(0,12)}catch{return null}}async function fp(n,e,t={}){const i=qy();if(!i||!(e>0))return!1;try{const s=new AbortController,a=setTimeout(()=>s.abort(),7e3);return await fetch(dp[n],{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initials:i,score:Math.max(0,Math.floor(e)),extra:t}),signal:s.signal}),clearTimeout(a),Me.scoresPosted=(Me.scoresPosted||0)+1,!0}catch{return!1}}async function pp(){const n=document.querySelector("#scoreBoard");if(!n)return;n.textContent="Loading…";const e=await up(Xr);if(!e){n.textContent="Leaderboard unreachable — try again later.";return}if(!e.length){n.textContent="No entries yet — set your initials and claim the first spot.";return}n.innerHTML=e.map((t,i)=>{const s=String(t.initials||t.name||"???").slice(0,3),a=Xr==="lap"?t.extra?.time?`${Number(t.extra.time).toFixed(2)}s — ${t.extra.course||"?"}`:Math.round(t.score):Math.round(t.score).toLocaleString();return`<div class="score-row"><i>${i+1}</i><b>${s}</b><span>${a}</span></div>`}).join("")}for(const[n,e]of[["#lapBoardBtn","lap"],["#roamBoardBtn","roam"]]){const t=document.querySelector(n);t&&t.addEventListener("click",()=>{Xr=e,document.querySelector("#lapBoardBtn")?.classList.toggle("active-board",e==="lap"),document.querySelector("#roamBoardBtn")?.classList.toggle("active-board",e==="roam"),pp()})}document.querySelector("#scoresBtn")?.addEventListener("click",()=>(pl("scores"),pp()));document.querySelector("#scoresBackBtn")?.addEventListener("click",()=>pl(null));const Yy="wss://iron-ridge-online.jez237.workers.dev/ws",mp="steel-ribbon-mp-room",xp="steel-ribbon-mp-name",xt={ws:null,connected:!1,id:null,room:"",name:"",peers:new Map,lastState:0,lastPing:0,manual:!1},dr=(n,e,t)=>String(n||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,t)||e;function $y(){const n="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let e="";const t=new Uint8Array(5);crypto.getRandomValues(t);for(const i of t)e+=n[i%n.length];return e}function ms(n){const e=document.querySelector("#mpStatus");e&&(e.textContent=n)}function Zy(n){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.clearRect(0,0,256,64),t.fillStyle="rgba(10, 16, 26, 0.78)",t.fillRect(14,10,228,42),t.strokeStyle="rgba(140, 200, 255, 0.9)",t.lineWidth=3,t.strokeRect(14,10,228,42),t.fillStyle="#d8ecff",t.font="800 24px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,32,208);const i=new tn(e);i.colorSpace=Pt;const s=new nl(new gl({map:i,transparent:!0,depthTest:!1}));return s.scale.set(7.4,1.85,1),s}function xf(n,e){let t=xt.peers.get(n);return t||(t={id:n,name:e||"DRIVER",hue:[...n].reduce((i,s)=>i+s.charCodeAt(0),0),tx:0,ty:0,tz:0,tyaw:0,v:"car",has:!1,lastSeen:performance.now()},xt.peers.set(n,t)),e&&(t.name=e),t}function Ky(n){n.car||(n.car=$r("compact",[16739693,5163247,16770048,9498256,3531007][n.hue%5]),n.car.userData.stolenYOff=.57,Te.add(n.car),n.walker=ud(9464783,4149685),n.walker.visible=!1,Te.add(n.walker),n.label=Zy(n.name),Te.add(n.label))}function Rd(n){n.car&&Cs(n.car),n.walker&&Cs(n.walker),n.label&&(n.label.material.map?.dispose(),n.label.material.dispose(),Te.remove(n.label)),xt.peers.delete(n.id)}function ml(n=!0){if(xt.manual=n,xt.ws)try{xt.ws.close(1e3,"leave")}catch{}xt.ws=null,xt.connected=!1,xt.id=null;for(const e of[...xt.peers.values()])Rd(e);ms("Not connected."),Pd()}function gp(){ml(!0);const n=dr(document.querySelector("#mpName")?.value,"DRIVER",12),e=dr(document.querySelector("#mpRoom")?.value,"",10)||$y(),t=document.querySelector("#mpRoom");t&&(t.value=e),localStorage.setItem(mp,e),localStorage.setItem(xp,n),xt.room=e,xt.name=n,xt.manual=!1,ms(`Connecting to ${e}…`);let i;try{i=new WebSocket(`${Yy}/${encodeURIComponent(`SRR-${e}`)}`)}catch{ms("Connection failed.");return}xt.ws=i,i.onopen=()=>{xt.connected=!0,i.send(JSON.stringify({type:"hello",name:n})),ms(`Room ${e} — connected`),Pd()},i.onclose=()=>{xt.ws===i&&(ml(!0),ms(xt.manual?"Not connected.":"Connection dropped."))},i.onerror=()=>ms("Connection failed — try again."),i.onmessage=s=>{let a;try{a=JSON.parse(s.data)}catch{return}if(a.type==="welcome"){xt.id=a.id,ms(`Room ${xt.room} — ${Math.max(1,Number(a.count)||1)} cruising`);return}if(a.type==="peers"){const r=new Set((a.peers||[]).filter(o=>o.id!==xt.id).map(o=>o.id));for(const o of[...xt.peers.values()])r.has(o.id)||Rd(o);for(const o of a.peers||[]){if(!o.id||o.id===xt.id)continue;const c=xt.peers.has(o.id);xf(o.id,dr(o.name,"DRIVER",12)),c||l.mode==="roam"&&(l.message=`${dr(o.name,"DRIVER",12)} joined the cruise`,l.messageTimer=1.6)}ms(`Room ${xt.room} — ${xt.peers.size+1} cruising`);return}if(!(!a.from||a.from===xt.id)&&a.type==="state"&&a.state){const r=xf(a.from,a.name&&dr(a.name,"DRIVER",12));r.tx=Number(a.state.x)||0,r.ty=Number(a.state.y)||0,r.tz=Number(a.state.z)||0,r.tyaw=Number(a.state.yaw)||0,r.v=a.state.v==="foot"?"foot":"car",r.lastSeen=performance.now(),r.has||(Ky(r),r.car.position.set(r.tx,r.ty,r.tz),r.has=!0)}}}function Pd(){const n=document.querySelector("#mpJoinBtn"),e=document.querySelector("#mpLeaveBtn");n&&(n.textContent=xt.connected?"Switch Room":"Join Room"),e&&e.classList.toggle("hidden",!xt.connected)}{const n=document.querySelector("#mpName"),e=document.querySelector("#mpRoom");n&&(n.value=localStorage.getItem(xp)||""),e&&(e.value=localStorage.getItem(mp)||""),document.querySelector("#onlineBtn")?.addEventListener("click",()=>pl("online")),document.querySelector("#onlineBackBtn")?.addEventListener("click",()=>pl(null)),document.querySelector("#mpJoinBtn")?.addEventListener("click",gp),document.querySelector("#mpLeaveBtn")?.addEventListener("click",()=>ml(!0)),Pd()}pn(new It,(n,e)=>{if(!xt.connected)return;const t=performance.now();for(const i of[...xt.peers.values()]){if(!i.has)continue;if(t-i.lastSeen>12e3){Rd(i);continue}const s=1-Math.exp(-10*e),a=i.v!=="foot";i.car.visible=a,i.walker.visible=!a;const r=a?i.car:i.walker;if(r.position.lerp(ld.set(i.tx,i.ty-(a?.25:.5),i.tz),s),r.rotation.y=-i.tyaw,i.label.position.set(r.position.x,r.position.y+(a?3.4:3),r.position.z),a)for(const o of i.car.userData.wheels||[])o.rotation.x-=20*e}t-xt.lastPing>5e3&&(xt.lastPing=t,xt.ws?.readyState===1&&xt.ws.send(JSON.stringify({type:"ping",t}))),l.mode==="roam"&&t-xt.lastState>95&&xt.ws?.readyState===1&&(xt.lastState=t,xt.ws.send(JSON.stringify({type:"state",name:xt.name,state:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1),yaw:+l.roamYaw.toFixed(2),v:l.vehicle==="foot"?"foot":"car"}}))),Me.mpPeers=xt.peers.size});function Jy(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of hd)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of Zt)e(c.marker);e(Ot),e(ln),typeof cn<"u"&&e(cn),typeof gi<"u"&&e(gi),he&&e(he.mesh),typeof pi<"u"&&e(pi),typeof Ei<"u"&&Ei&&e(Ei);for(const c of Xn)e(c.mesh);const i=new Map;Te.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let m=c;m&&m!==Te;m=m.parent){if(n.has(m)||!m.visible)return;const x=m.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const u=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let p=i.get(u);p||i.set(u,p=[]),p.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(m=>{m.updateWorldMatrix(!0,!1);const x=m.geometry.clone().applyMatrix4(m.matrixWorld);for(const M of Object.keys(x.attributes))M==="position"||M==="normal"||M==="uv"||x.deleteAttribute(M);return x}),d=ns(h,!1);if(!d)continue;const u=c[0],p=new z(d,u.material);p.castShadow=u.castShadow,p.receiveShadow=u.receiveShadow,p.matrixAutoUpdate=!1,Te.add(p);for(const m of c)r.set(m.geometry.uuid,m.geometry),m.removeFromParent(),a++;s++}catch{}const o=new Set;Te.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of r)o.has(c)||h.dispose();Me.staticMerge={groups:s,meshesRemoved:a}}Jy();const jy=pt(l.s);l.y=jy.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;Td(.016);Sr();ep();
