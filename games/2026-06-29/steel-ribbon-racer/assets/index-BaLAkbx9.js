(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const fh="181",B0=0,sd=1,k0=2,Vu=1,Gu=2,qi=3,Ms=0,Dn=1,Mt=2,Li=0,_a=1,ti=2,ad=3,rd=4,V0=5,Us=100,G0=101,H0=102,W0=103,X0=104,q0=200,Y0=201,$0=202,Z0=203,ac=204,rc=205,K0=206,J0=207,j0=208,Q0=209,ep=210,tp=211,np=212,ip=213,sp=214,oc=0,lc=1,cc=2,Ea=3,hc=4,dc=5,uc=6,fc=7,ph=0,ap=1,rp=2,xs=0,Hu=1,Wu=2,Xu=3,mh=4,qu=5,Yu=6,$u=7,Zu=300,Aa=301,Ca=302,pc=303,mc=304,Jo=306,Un=1e3,Zi=1001,xc=1002,$n=1003,op=1004,Wr=1005,ni=1006,fl=1007,zs=1008,Ni=1009,Ku=1010,Ju=1011,vr=1012,xh=1013,Hs=1014,Ci=1015,Di=1016,gh=1017,vh=1018,Mr=1020,ju=35902,Qu=35899,ef=1021,tf=1022,mi=1023,_r=1026,yr=1027,Mh=1028,_h=1029,yh=1030,bh=1031,wh=1033,Eo=33776,Ao=33777,Co=33778,Ro=33779,gc=35840,vc=35841,Mc=35842,_c=35843,yc=36196,bc=37492,wc=37496,Sc=37808,Tc=37809,Ec=37810,Ac=37811,Cc=37812,Rc=37813,Pc=37814,Lc=37815,Dc=37816,Ic=37817,Uc=37818,Fc=37819,zc=37820,Nc=37821,Oc=36492,Bc=36494,kc=36495,Vc=36283,Gc=36284,Hc=36285,Wc=36286,lp=3200,cp=3201,Sh=0,hp=1,us="",Lt="srgb",Ra="srgb-linear",Fo="linear",Ht="srgb",Js=7680,od=519,dp=512,up=513,fp=514,nf=515,pp=516,mp=517,xp=518,gp=519,Xc=35044,ld="300 es",Ri=2e3,zo=2001;function sf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function No(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function vp(){const n=No("canvas");return n.style.display="block",n}const cd={};function Oo(...n){const e="THREE."+n.shift();console.log(e,...n)}function mt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function tn(...n){const e="THREE."+n.shift();console.error(e,...n)}function br(...n){const e=n.join(" ");e in cd||(cd[e]=!0,mt(...n))}function Mp(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class Ua{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const An=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hd=1234567;const ar=Math.PI/180,wr=180/Math.PI;function Ii(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(An[n&255]+An[n>>8&255]+An[n>>16&255]+An[n>>24&255]+"-"+An[e&255]+An[e>>8&255]+"-"+An[e>>16&15|64]+An[e>>24&255]+"-"+An[t&63|128]+An[t>>8&255]+"-"+An[t>>16&255]+An[t>>24&255]+An[i&255]+An[i>>8&255]+An[i>>16&255]+An[i>>24&255]).toLowerCase()}function At(n,e,t){return Math.max(e,Math.min(t,n))}function Th(n,e){return(n%e+e)%e}function _p(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function yp(n,e,t){return n!==e?(t-n)/(e-n):0}function rr(n,e,t){return(1-t)*n+t*e}function bp(n,e,t,i){return rr(n,e,1-Math.exp(-t*i))}function wp(n,e=1){return e-Math.abs(Th(n,e*2)-e)}function Sp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Tp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Ep(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Ap(n,e){return n+Math.random()*(e-n)}function Cp(n){return n*(.5-Math.random())}function Rp(n){n!==void 0&&(hd=n);let e=hd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Pp(n){return n*ar}function Lp(n){return n*wr}function Dp(n){return(n&n-1)===0&&n!==0}function Ip(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Up(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Fp(n,e,t,i,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),f=a((e-i)/2),p=r((e-i)/2),m=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(o*d,c*f,c*p,o*h);break;case"YZY":n.set(c*p,o*d,c*f,o*h);break;case"ZXZ":n.set(c*f,c*p,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*m,o*h);break;case"YXY":n.set(c*m,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*m,o*d,o*h);break;default:mt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ui(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const me={DEG2RAD:ar,RAD2DEG:wr,generateUUID:Ii,clamp:At,euclideanModulo:Th,mapLinear:_p,inverseLerp:yp,lerp:rr,damp:bp,pingpong:wp,smoothstep:Sp,smootherstep:Tp,randInt:Ep,randFloat:Ap,randFloatSpread:Cp,seededRandom:Rp,degToRad:Pp,radToDeg:Lp,isPowerOfTwo:Dp,ceilPowerOfTwo:Ip,floorPowerOfTwo:Up,setQuaternionFromProperEuler:Fp,normalize:Wt,denormalize:ui};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(At(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ji{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let c=i[s+0],h=i[s+1],d=i[s+2],f=i[s+3],p=a[r+0],m=a[r+1],x=a[r+2],M=a[r+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(f!==M||c!==p||h!==m||d!==x){let g=c*p+h*m+d*x+f*M;g<0&&(p=-p,m=-m,x=-x,M=-M,g=-g);let u=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);u=Math.sin(u*y)/v,o=Math.sin(o*y)/v,c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o}else{c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o;const y=1/Math.sqrt(c*c+h*h+d*d+f*f);c*=y,h*=y,d*=y,f*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],f=a[r],p=a[r+1],m=a[r+2],x=a[r+3];return e[t]=o*x+d*f+c*m-h*p,e[t+1]=c*x+d*p+h*f-o*m,e[t+2]=h*x+d*m+o*p-c*f,e[t+3]=d*x-o*f-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),f=o(a/2),p=c(i/2),m=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"YXZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"ZXY":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"ZYX":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"YZX":this._x=p*d*f+h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f-p*m*x;break;case"XZY":this._x=p*d*f-h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f+p*m*x;break;default:mt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],h=t[2],d=t[6],f=t[10],p=i+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(a-h)*m,this._z=(r-s)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(d-c)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+h)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(a-h)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(r-s)/m,this._x=(a+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*o+s*h-a*c,this._y=s*d+r*c+a*o-i*h,this._z=a*d+r*h+i*c-s*o,this._w=r*d-i*o-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(dd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(dd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,h=2*(r*s-o*i),d=2*(o*t-a*s),f=2*(a*i-r*t);return this.x=t+c*h+r*f-o*d,this.y=i+c*d+o*h-a*f,this.z=s+c*f+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this.z=At(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this.z=At(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(At(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return pl.copy(this).projectOnVector(e),this.sub(pl)}reflect(e){return this.sub(pl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pl=new P,dd=new ji;class St{constructor(e,t,i,s,a,r,o,c,h){St.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h)}set(e,t,i,s,a,r,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],c=i[6],h=i[1],d=i[4],f=i[7],p=i[2],m=i[5],x=i[8],M=s[0],g=s[3],u=s[6],y=s[1],v=s[4],_=s[7],E=s[2],T=s[5],R=s[8];return a[0]=r*M+o*y+c*E,a[3]=r*g+o*v+c*T,a[6]=r*u+o*_+c*R,a[1]=h*M+d*y+f*E,a[4]=h*g+d*v+f*T,a[7]=h*u+d*_+f*R,a[2]=p*M+m*y+x*E,a[5]=p*g+m*v+x*T,a[8]=p*u+m*_+x*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*o*h-i*a*d+i*o*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=d*r-o*h,p=o*c-d*a,m=h*a-r*c,x=t*f+i*p+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=f*M,e[1]=(s*h-d*i)*M,e[2]=(o*i-s*r)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*a-o*t)*M,e[6]=m*M,e[7]=(i*c-h*t)*M,e[8]=(r*t-i*a)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*o)+r+e,-s*h,s*c,-s*(-h*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ml.makeScale(e,t)),this}rotate(e){return this.premultiply(ml.makeRotation(-e)),this}translate(e,t){return this.premultiply(ml.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ml=new St,ud=new St().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fd=new St().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zp(){const n={enabled:!0,workingColorSpace:Ra,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===Ht&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Ht&&(s.r=ya(s.r),s.g=ya(s.g),s.b=ya(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===us?Fo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return br("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return br("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ra]:{primaries:e,whitePoint:i,transfer:Fo,toXYZ:ud,fromXYZ:fd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:Ht,toXYZ:ud,fromXYZ:fd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}const It=zp();function Ki(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ya(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let js;class Np{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{js===void 0&&(js=No("canvas")),js.width=e.width,js.height=e.height;const s=js.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=js}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=No("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Ki(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ki(t[i]/255)*255):t[i]=Ki(t[i]);return{data:t,width:e.width,height:e.height}}else return mt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Op=0;class Eh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=Ii(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(xl(s[r].image)):a.push(xl(s[r]))}else a=xl(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function xl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Np.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(mt("Texture: Unable to serialize Texture."),{})}let Bp=0;const gl=new P;class In extends Ua{constructor(e=In.DEFAULT_IMAGE,t=In.DEFAULT_MAPPING,i=Zi,s=Zi,a=ni,r=zs,o=mi,c=Ni,h=In.DEFAULT_ANISOTROPY,d=us){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=Ii(),this.name="",this.source=new Eh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new St,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(gl).x}get height(){return this.source.getSize(gl).y}get depth(){return this.source.getSize(gl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){mt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){mt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Un:e.x=e.x-Math.floor(e.x);break;case Zi:e.x=e.x<0?0:1;break;case xc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Un:e.y=e.y-Math.floor(e.y);break;case Zi:e.y=e.y<0?0:1;break;case xc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}In.DEFAULT_IMAGE=null;In.DEFAULT_MAPPING=Zu;In.DEFAULT_ANISOTROPY=1;class Xt{constructor(e=0,t=0,i=0,s=1){Xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],f=c[8],p=c[1],m=c[5],x=c[9],M=c[2],g=c[6],u=c[10];if(Math.abs(d-p)<.01&&Math.abs(f-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(f+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,_=(m+1)/2,E=(u+1)/2,T=(d+p)/4,R=(f+M)/4,C=(x+g)/4;return v>_&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=T/i,a=R/i):_>E?_<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),i=T/s,a=C/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=R/a,s=C/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(f-M)*(f-M)+(p-d)*(p-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(f-M)/y,this.z=(p-d)/y,this.w=Math.acos((h+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this.z=At(this.z,e.z,t.z),this.w=At(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this.z=At(this.z,e,t),this.w=At(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(At(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kp extends Ua{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Xt(0,0,e,t),this.scissorTest=!1,this.viewport=new Xt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new In(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ni,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Eh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gi extends kp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class af extends In{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=$n,this.minFilter=$n,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vp extends In{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=$n,this.minFilter=$n,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $s{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,ri):ri.fromBufferAttribute(a,r),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xr.copy(i.boundingBox)),Xr.applyMatrix4(e.matrixWorld),this.union(Xr)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ha),qr.subVectors(this.max,Ha),Qs.subVectors(e.a,Ha),ea.subVectors(e.b,Ha),ta.subVectors(e.c,Ha),es.subVectors(ea,Qs),ts.subVectors(ta,ea),Ss.subVectors(Qs,ta);let t=[0,-es.z,es.y,0,-ts.z,ts.y,0,-Ss.z,Ss.y,es.z,0,-es.x,ts.z,0,-ts.x,Ss.z,0,-Ss.x,-es.y,es.x,0,-ts.y,ts.x,0,-Ss.y,Ss.x,0];return!vl(t,Qs,ea,ta,qr)||(t=[1,0,0,0,1,0,0,0,1],!vl(t,Qs,ea,ta,qr))?!1:(Yr.crossVectors(es,ts),t=[Yr.x,Yr.y,Yr.z],vl(t,Qs,ea,ta,qr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ki[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ki[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ki[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ki[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ki[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ki[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ki[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ki[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ki),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ki=[new P,new P,new P,new P,new P,new P,new P,new P],ri=new P,Xr=new $s,Qs=new P,ea=new P,ta=new P,es=new P,ts=new P,Ss=new P,Ha=new P,qr=new P,Yr=new P,Ts=new P;function vl(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Ts.fromArray(n,a);const o=s.x*Math.abs(Ts.x)+s.y*Math.abs(Ts.y)+s.z*Math.abs(Ts.z),c=e.dot(Ts),h=t.dot(Ts),d=i.dot(Ts);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const Gp=new $s,Wa=new P,Ml=new P;class Fa{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Gp.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wa.subVectors(e,this.center);const t=Wa.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Wa,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ml.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wa.copy(e.center).add(Ml)),this.expandByPoint(Wa.copy(e.center).sub(Ml))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Vi=new P,_l=new P,$r=new P,ns=new P,yl=new P,Zr=new P,bl=new P;class Ah{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Vi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vi.copy(this.origin).addScaledVector(this.direction,t),Vi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){_l.copy(e).add(t).multiplyScalar(.5),$r.copy(t).sub(e).normalize(),ns.copy(this.origin).sub(_l);const a=e.distanceTo(t)*.5,r=-this.direction.dot($r),o=ns.dot(this.direction),c=-ns.dot($r),h=ns.lengthSq(),d=Math.abs(1-r*r);let f,p,m,x;if(d>0)if(f=r*c-o,p=r*o-c,x=a*d,f>=0)if(p>=-x)if(p<=x){const M=1/d;f*=M,p*=M,m=f*(f+r*p+2*o)+p*(r*f+p+2*c)+h}else p=a,f=Math.max(0,-(r*p+o)),m=-f*f+p*(p+2*c)+h;else p=-a,f=Math.max(0,-(r*p+o)),m=-f*f+p*(p+2*c)+h;else p<=-x?(f=Math.max(0,-(-r*a+o)),p=f>0?-a:Math.min(Math.max(-a,-c),a),m=-f*f+p*(p+2*c)+h):p<=x?(f=0,p=Math.min(Math.max(-a,-c),a),m=p*(p+2*c)+h):(f=Math.max(0,-(r*a+o)),p=f>0?a:Math.min(Math.max(-a,-c),a),m=-f*f+p*(p+2*c)+h);else p=r>0?-a:a,f=Math.max(0,-(r*p+o)),m=-f*f+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(_l).addScaledVector($r,p),m}intersectSphere(e,t){Vi.subVectors(e.center,this.origin);const i=Vi.dot(this.direction),s=Vi.dot(Vi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,c;const h=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),d>=0?(a=(e.min.y-p.y)*d,r=(e.max.y-p.y)*d):(a=(e.max.y-p.y)*d,r=(e.min.y-p.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(e.min.z-p.z)*f,c=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,c=(e.min.z-p.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Vi)!==null}intersectTriangle(e,t,i,s,a){yl.subVectors(t,e),Zr.subVectors(i,e),bl.crossVectors(yl,Zr);let r=this.direction.dot(bl),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ns.subVectors(this.origin,e);const c=o*this.direction.dot(Zr.crossVectors(ns,Zr));if(c<0)return null;const h=o*this.direction.dot(yl.cross(ns));if(h<0||c+h>r)return null;const d=-o*ns.dot(bl);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,t,i,s,a,r,o,c,h,d,f,p,m,x,M,g){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h,d,f,p,m,x,M,g)}set(e,t,i,s,a,r,o,c,h,d,f,p,m,x,M,g){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=c,u[2]=h,u[6]=d,u[10]=f,u[14]=p,u[3]=m,u[7]=x,u[11]=M,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/na.setFromMatrixColumn(e,0).length(),a=1/na.setFromMatrixColumn(e,1).length(),r=1/na.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const p=r*d,m=r*f,x=o*d,M=o*f;t[0]=c*d,t[4]=-c*f,t[8]=h,t[1]=m+x*h,t[5]=p-M*h,t[9]=-o*c,t[2]=M-p*h,t[6]=x+m*h,t[10]=r*c}else if(e.order==="YXZ"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p+M*o,t[4]=x*o-m,t[8]=r*h,t[1]=r*f,t[5]=r*d,t[9]=-o,t[2]=m*o-x,t[6]=M+p*o,t[10]=r*c}else if(e.order==="ZXY"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p-M*o,t[4]=-r*f,t[8]=x+m*o,t[1]=m+x*o,t[5]=r*d,t[9]=M-p*o,t[2]=-r*h,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const p=r*d,m=r*f,x=o*d,M=o*f;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+M,t[1]=c*f,t[5]=M*h+p,t[9]=m*h-x,t[2]=-h,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const p=r*c,m=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=M-p*f,t[8]=x*f+m,t[1]=f,t[5]=r*d,t[9]=-o*d,t[2]=-h*d,t[6]=m*f+x,t[10]=p-M*f}else if(e.order==="XZY"){const p=r*c,m=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=-f,t[8]=h*d,t[1]=p*f+M,t[5]=r*d,t[9]=m*f-x,t[2]=x*f-m,t[6]=o*d,t[10]=M*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Hp,e,Wp)}lookAt(e,t,i){const s=this.elements;return Wn.subVectors(e,t),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),is.crossVectors(i,Wn),is.lengthSq()===0&&(Math.abs(i.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),is.crossVectors(i,Wn)),is.normalize(),Kr.crossVectors(Wn,is),s[0]=is.x,s[4]=Kr.x,s[8]=Wn.x,s[1]=is.y,s[5]=Kr.y,s[9]=Wn.y,s[2]=is.z,s[6]=Kr.z,s[10]=Wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],c=i[8],h=i[12],d=i[1],f=i[5],p=i[9],m=i[13],x=i[2],M=i[6],g=i[10],u=i[14],y=i[3],v=i[7],_=i[11],E=i[15],T=s[0],R=s[4],C=s[8],S=s[12],b=s[1],L=s[5],I=s[9],V=s[13],j=s[2],te=s[6],q=s[10],Z=s[14],ne=s[3],fe=s[7],ve=s[11],qe=s[15];return a[0]=r*T+o*b+c*j+h*ne,a[4]=r*R+o*L+c*te+h*fe,a[8]=r*C+o*I+c*q+h*ve,a[12]=r*S+o*V+c*Z+h*qe,a[1]=d*T+f*b+p*j+m*ne,a[5]=d*R+f*L+p*te+m*fe,a[9]=d*C+f*I+p*q+m*ve,a[13]=d*S+f*V+p*Z+m*qe,a[2]=x*T+M*b+g*j+u*ne,a[6]=x*R+M*L+g*te+u*fe,a[10]=x*C+M*I+g*q+u*ve,a[14]=x*S+M*V+g*Z+u*qe,a[3]=y*T+v*b+_*j+E*ne,a[7]=y*R+v*L+_*te+E*fe,a[11]=y*C+v*I+_*q+E*ve,a[15]=y*S+v*V+_*Z+E*qe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],h=e[13],d=e[2],f=e[6],p=e[10],m=e[14],x=e[3],M=e[7],g=e[11],u=e[15];return x*(+a*c*f-s*h*f-a*o*p+i*h*p+s*o*m-i*c*m)+M*(+t*c*m-t*h*p+a*r*p-s*r*m+s*h*d-a*c*d)+g*(+t*h*f-t*o*m-a*r*f+i*r*m+a*o*d-i*h*d)+u*(-s*o*d-t*c*f+t*o*p+s*r*f-i*r*p+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=e[9],p=e[10],m=e[11],x=e[12],M=e[13],g=e[14],u=e[15],y=f*g*h-M*p*h+M*c*m-o*g*m-f*c*u+o*p*u,v=x*p*h-d*g*h-x*c*m+r*g*m+d*c*u-r*p*u,_=d*M*h-x*f*h+x*o*m-r*M*m-d*o*u+r*f*u,E=x*f*c-d*M*c-x*o*p+r*M*p+d*o*g-r*f*g,T=t*y+i*v+s*_+a*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=y*R,e[1]=(M*p*a-f*g*a-M*s*m+i*g*m+f*s*u-i*p*u)*R,e[2]=(o*g*a-M*c*a+M*s*h-i*g*h-o*s*u+i*c*u)*R,e[3]=(f*c*a-o*p*a-f*s*h+i*p*h+o*s*m-i*c*m)*R,e[4]=v*R,e[5]=(d*g*a-x*p*a+x*s*m-t*g*m-d*s*u+t*p*u)*R,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*u-t*c*u)*R,e[7]=(r*p*a-d*c*a+d*s*h-t*p*h-r*s*m+t*c*m)*R,e[8]=_*R,e[9]=(x*f*a-d*M*a-x*i*m+t*M*m+d*i*u-t*f*u)*R,e[10]=(r*M*a-x*o*a+x*i*h-t*M*h-r*i*u+t*o*u)*R,e[11]=(d*o*a-r*f*a-d*i*h+t*f*h+r*i*m-t*o*m)*R,e[12]=E*R,e[13]=(d*M*s-x*f*s+x*i*p-t*M*p-d*i*g+t*f*g)*R,e[14]=(x*o*s-r*M*s-x*i*c+t*M*c+r*i*g-t*o*g)*R,e[15]=(r*f*s-d*o*s+d*i*c-t*f*c-r*i*p+t*o*p)*R,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,c=e.z,h=a*r,d=a*o;return this.set(h*r+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*r,0,h*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,h=a+a,d=r+r,f=o+o,p=a*h,m=a*d,x=a*f,M=r*d,g=r*f,u=o*f,y=c*h,v=c*d,_=c*f,E=i.x,T=i.y,R=i.z;return s[0]=(1-(M+u))*E,s[1]=(m+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-_)*T,s[5]=(1-(p+u))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(x+v)*R,s[9]=(g-y)*R,s[10]=(1-(p+M))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=na.set(s[0],s[1],s[2]).length();const r=na.set(s[4],s[5],s[6]).length(),o=na.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],oi.copy(this);const h=1/a,d=1/r,f=1/o;return oi.elements[0]*=h,oi.elements[1]*=h,oi.elements[2]*=h,oi.elements[4]*=d,oi.elements[5]*=d,oi.elements[6]*=d,oi.elements[8]*=f,oi.elements[9]*=f,oi.elements[10]*=f,t.setFromRotationMatrix(oi),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=Ri,c=!1){const h=this.elements,d=2*a/(t-e),f=2*a/(i-s),p=(t+e)/(t-e),m=(i+s)/(i-s);let x,M;if(c)x=a/(r-a),M=r*a/(r-a);else if(o===Ri)x=-(r+a)/(r-a),M=-2*r*a/(r-a);else if(o===zo)x=-r/(r-a),M=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=f,h[9]=m,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Ri,c=!1){const h=this.elements,d=2/(t-e),f=2/(i-s),p=-(t+e)/(t-e),m=-(i+s)/(i-s);let x,M;if(c)x=1/(r-a),M=r/(r-a);else if(o===Ri)x=-2/(r-a),M=-(r+a)/(r-a);else if(o===zo)x=-1/(r-a),M=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=f,h[9]=0,h[13]=m,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const na=new P,oi=new Et,Hp=new P(0,0,0),Wp=new P(1,1,1),is=new P,Kr=new P,Wn=new P,pd=new Et,md=new ji;class vi{constructor(e=0,t=0,i=0,s=vi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],h=s[5],d=s[9],f=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(At(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-At(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(At(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-At(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(At(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-At(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:mt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return pd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(pd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return md.setFromEuler(this),this.setFromQuaternion(md,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vi.DEFAULT_ORDER="XYZ";class Ch{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Xp=0;const xd=new P,ia=new ji,Gi=new Et,Jr=new P,Xa=new P,qp=new P,Yp=new ji,gd=new P(1,0,0),vd=new P(0,1,0),Md=new P(0,0,1),_d={type:"added"},$p={type:"removed"},sa={type:"childadded",child:null},wl={type:"childremoved",child:null};class Ut extends Ua{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ut.DEFAULT_UP.clone();const e=new P,t=new vi,i=new ji,s=new P(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Et},normalMatrix:{value:new St}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=Ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ch,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.multiply(ia),this}rotateOnWorldAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.premultiply(ia),this}rotateX(e){return this.rotateOnAxis(gd,e)}rotateY(e){return this.rotateOnAxis(vd,e)}rotateZ(e){return this.rotateOnAxis(Md,e)}translateOnAxis(e,t){return xd.copy(e).applyQuaternion(this.quaternion),this.position.add(xd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gd,e)}translateY(e){return this.translateOnAxis(vd,e)}translateZ(e){return this.translateOnAxis(Md,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Jr.copy(e):Jr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Xa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gi.lookAt(Xa,Jr,this.up):Gi.lookAt(Jr,Xa,this.up),this.quaternion.setFromRotationMatrix(Gi),s&&(Gi.extractRotation(s.matrixWorld),ia.setFromRotationMatrix(Gi),this.quaternion.premultiply(ia.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(tn("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_d),sa.child=e,this.dispatchEvent(sa),sa.child=null):tn("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($p),wl.child=e,this.dispatchEvent(wl),wl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_d),sa.child=e,this.dispatchEvent(sa),sa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,e,qp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,Yp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const f=c[h];a(e.shapes,f)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),f=r(e.shapes),p=r(e.skeletons),m=r(e.animations),x=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ut.DEFAULT_UP=new P(0,1,0);Ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const li=new P,Hi=new P,Sl=new P,Wi=new P,aa=new P,ra=new P,yd=new P,Tl=new P,El=new P,Al=new P,Cl=new Xt,Rl=new Xt,Pl=new Xt;class ei{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),li.subVectors(e,t),s.cross(li);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){li.subVectors(s,t),Hi.subVectors(i,t),Sl.subVectors(e,t);const r=li.dot(li),o=li.dot(Hi),c=li.dot(Sl),h=Hi.dot(Hi),d=Hi.dot(Sl),f=r*h-o*o;if(f===0)return a.set(0,0,0),null;const p=1/f,m=(h*c-o*d)*p,x=(r*d-o*c)*p;return a.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Wi)===null?!1:Wi.x>=0&&Wi.y>=0&&Wi.x+Wi.y<=1}static getInterpolation(e,t,i,s,a,r,o,c){return this.getBarycoord(e,t,i,s,Wi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Wi.x),c.addScaledVector(r,Wi.y),c.addScaledVector(o,Wi.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return Cl.setScalar(0),Rl.setScalar(0),Pl.setScalar(0),Cl.fromBufferAttribute(e,t),Rl.fromBufferAttribute(e,i),Pl.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Cl,a.x),r.addScaledVector(Rl,a.y),r.addScaledVector(Pl,a.z),r}static isFrontFacing(e,t,i,s){return li.subVectors(i,t),Hi.subVectors(e,t),li.cross(Hi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return li.subVectors(this.c,this.b),Hi.subVectors(this.a,this.b),li.cross(Hi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ei.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ei.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return ei.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return ei.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ei.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;aa.subVectors(s,i),ra.subVectors(a,i),Tl.subVectors(e,i);const c=aa.dot(Tl),h=ra.dot(Tl);if(c<=0&&h<=0)return t.copy(i);El.subVectors(e,s);const d=aa.dot(El),f=ra.dot(El);if(d>=0&&f<=d)return t.copy(s);const p=c*f-d*h;if(p<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(aa,r);Al.subVectors(e,a);const m=aa.dot(Al),x=ra.dot(Al);if(x>=0&&m<=x)return t.copy(a);const M=m*h-c*x;if(M<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(ra,o);const g=d*x-m*f;if(g<=0&&f-d>=0&&m-x>=0)return yd.subVectors(a,s),o=(f-d)/(f-d+(m-x)),t.copy(s).addScaledVector(yd,o);const u=1/(g+M+p);return r=M*u,o=p*u,t.copy(i).addScaledVector(aa,r).addScaledVector(ra,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const rf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ss={h:0,s:0,l:0},jr={h:0,s:0,l:0};function Ll(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,It.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=It.workingColorSpace){return this.r=e,this.g=t,this.b=i,It.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=It.workingColorSpace){if(e=Th(e,1),t=At(t,0,1),i=At(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=Ll(r,a,e+1/3),this.g=Ll(r,a,e),this.b=Ll(r,a,e-1/3)}return It.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(a){a!==void 0&&parseFloat(a)<1&&mt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:mt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);mt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const i=rf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):mt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}copyLinearToSRGB(e){return this.r=ya(e.r),this.g=ya(e.g),this.b=ya(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return It.workingToColorSpace(Cn.copy(this),e),Math.round(At(Cn.r*255,0,255))*65536+Math.round(At(Cn.g*255,0,255))*256+Math.round(At(Cn.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=It.workingColorSpace){It.workingToColorSpace(Cn.copy(this),t);const i=Cn.r,s=Cn.g,a=Cn.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,h;const d=(o+r)/2;if(o===r)c=0,h=0;else{const f=r-o;switch(h=d<=.5?f/(r+o):f/(2-r-o),r){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=It.workingColorSpace){return It.workingToColorSpace(Cn.copy(this),t),e.r=Cn.r,e.g=Cn.g,e.b=Cn.b,e}getStyle(e=Lt){It.workingToColorSpace(Cn.copy(this),e);const t=Cn.r,i=Cn.g,s=Cn.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ss),this.setHSL(ss.h+e,ss.s+t,ss.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ss),e.getHSL(jr);const i=rr(ss.h,jr.h,t),s=rr(ss.s,jr.s,t),a=rr(ss.l,jr.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Cn=new rt;rt.NAMES=rf;let Zp=0;class bs extends Ua{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Ii(),this.name="",this.type="Material",this.blending=_a,this.side=Ms,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ac,this.blendDst=rc,this.blendEquation=Us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ea,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=od,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Js,this.stencilZFail=Js,this.stencilZPass=Js,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){mt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){mt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==_a&&(i.blending=this.blending),this.side!==Ms&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ac&&(i.blendSrc=this.blendSrc),this.blendDst!==rc&&(i.blendDst=this.blendDst),this.blendEquation!==Us&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ea&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==od&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Js&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Js&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Js&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends bs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const cn=new P,Qr=new Ue;let Kp=0;class Zn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Kp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Xc,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Qr.fromBufferAttribute(this,t),Qr.applyMatrix3(e),this.setXY(t,Qr.x,Qr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix3(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ui(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ui(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ui(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ui(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array),a=Wt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xc&&(e.usage=this.usage),e}}class of extends Zn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class lf extends Zn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class _t extends Zn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Jp=0;const jn=new Et,Dl=new Ut,oa=new P,Xn=new $s,qa=new $s,Mn=new P;class Yt extends Ua{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sf(e)?lf:of)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new St().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return jn.makeRotationFromQuaternion(e),this.applyMatrix4(jn),this}rotateX(e){return jn.makeRotationX(e),this.applyMatrix4(jn),this}rotateY(e){return jn.makeRotationY(e),this.applyMatrix4(jn),this}rotateZ(e){return jn.makeRotationZ(e),this.applyMatrix4(jn),this}translate(e,t,i){return jn.makeTranslation(e,t,i),this.applyMatrix4(jn),this}scale(e,t,i){return jn.makeScale(e,t,i),this.applyMatrix4(jn),this}lookAt(e){return Dl.lookAt(e),Dl.updateMatrix(),this.applyMatrix4(Dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(oa).negate(),this.translate(oa.x,oa.y,oa.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new _t(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&mt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tn("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Xn.setFromBufferAttribute(a),this.morphTargetsRelative?(Mn.addVectors(this.boundingBox.min,Xn.min),this.boundingBox.expandByPoint(Mn),Mn.addVectors(this.boundingBox.max,Xn.max),this.boundingBox.expandByPoint(Mn)):(this.boundingBox.expandByPoint(Xn.min),this.boundingBox.expandByPoint(Xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&tn('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tn("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Xn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];qa.setFromBufferAttribute(o),this.morphTargetsRelative?(Mn.addVectors(Xn.min,qa.min),Xn.expandByPoint(Mn),Mn.addVectors(Xn.max,qa.max),Xn.expandByPoint(Mn)):(Xn.expandByPoint(qa.min),Xn.expandByPoint(qa.max))}Xn.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Mn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Mn));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)Mn.fromBufferAttribute(o,h),c&&(oa.fromBufferAttribute(e,h),Mn.add(oa)),s=Math.max(s,i.distanceToSquared(Mn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&tn('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){tn("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<i.count;C++)o[C]=new P,c[C]=new P;const h=new P,d=new P,f=new P,p=new Ue,m=new Ue,x=new Ue,M=new P,g=new P;function u(C,S,b){h.fromBufferAttribute(i,C),d.fromBufferAttribute(i,S),f.fromBufferAttribute(i,b),p.fromBufferAttribute(a,C),m.fromBufferAttribute(a,S),x.fromBufferAttribute(a,b),d.sub(h),f.sub(h),m.sub(p),x.sub(p);const L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(f,-m.y).multiplyScalar(L),g.copy(f).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),o[C].add(M),o[S].add(M),o[b].add(M),c[C].add(g),c[S].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let C=0,S=y.length;C<S;++C){const b=y[C],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)u(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new P,_=new P,E=new P,T=new P;function R(C){E.fromBufferAttribute(s,C),T.copy(E);const S=o[C];v.copy(S),v.sub(E.multiplyScalar(E.dot(S))).normalize(),_.crossVectors(T,S);const L=_.dot(c[C])<0?-1:1;r.setXYZW(C,v.x,v.y,v.z,L)}for(let C=0,S=y.length;C<S;++C){const b=y[C],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Zn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const s=new P,a=new P,r=new P,o=new P,c=new P,h=new P,d=new P,f=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,M),r.fromBufferAttribute(t,g),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),a.fromBufferAttribute(t,p+1),r.fromBufferAttribute(t,p+2),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),i.setXYZ(p+0,d.x,d.y,d.z),i.setXYZ(p+1,d.x,d.y,d.z),i.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Mn.fromBufferAttribute(e,t),Mn.normalize(),e.setXYZ(t,Mn.x,Mn.y,Mn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,f=o.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let M=0,g=c.length;M<g;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*d;for(let u=0;u<d;u++)p[x++]=h[m++]}return new Zn(p,d,f)}if(this.index===null)return mt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Yt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const c=[],h=a[o];for(let d=0,f=h.length;d<f;d++){const p=h[d],m=e(p,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const h=r[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let f=0,p=h.length;f<p;f++){const m=h[f];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],f=a[h];for(let p=0,m=f.length;p<m;p++)d.push(f[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const f=r[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bd=new Et,Es=new Ah,eo=new Fa,wd=new P,to=new P,no=new P,io=new P,Il=new P,so=new P,Sd=new P,ao=new P;class O extends Ut{constructor(e=new Yt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){so.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=o[c],f=a[c];d!==0&&(Il.fromBufferAttribute(f,e),r?so.addScaledVector(Il,d):so.addScaledVector(Il.sub(t),d))}t.add(so)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),eo.copy(i.boundingSphere),eo.applyMatrix4(a),Es.copy(e.ray).recast(e.near),!(eo.containsPoint(Es.origin)===!1&&(Es.intersectSphere(eo,wd)===null||Es.origin.distanceToSquared(wd)>(e.far-e.near)**2))&&(bd.copy(a).invert(),Es.copy(e.ray).applyMatrix4(bd),!(i.boundingBox!==null&&Es.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Es)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,p=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=o.getX(_),R=o.getX(_+1),C=o.getX(_+2);s=ro(this,u,e,i,h,d,f,T,R,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const y=o.getX(g),v=o.getX(g+1),_=o.getX(g+2);s=ro(this,r,e,i,h,d,f,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=_,R=_+1,C=_+2;s=ro(this,u,e,i,h,d,f,T,R,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const y=g,v=g+1,_=g+2;s=ro(this,r,e,i,h,d,f,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function jp(n,e,t,i,s,a,r,o){let c;if(e.side===Dn?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,e.side===Ms,o),c===null)return null;ao.copy(o),ao.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(ao);return h<t.near||h>t.far?null:{distance:h,point:ao.clone(),object:n}}function ro(n,e,t,i,s,a,r,o,c,h){n.getVertexPosition(o,to),n.getVertexPosition(c,no),n.getVertexPosition(h,io);const d=jp(n,e,t,i,to,no,io,Sd);if(d){const f=new P;ei.getBarycoord(Sd,to,no,io,f),s&&(d.uv=ei.getInterpolatedAttribute(s,o,c,h,f,new Ue)),a&&(d.uv1=ei.getInterpolatedAttribute(a,o,c,h,f,new Ue)),r&&(d.normal=ei.getInterpolatedAttribute(r,o,c,h,f,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new P,materialIndex:0};ei.getNormal(to,no,io,p.normal),d.face=p,d.barycoord=f}return d}class xe extends Yt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],f=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new _t(h,3)),this.setAttribute("normal",new _t(d,3)),this.setAttribute("uv",new _t(f,2));function x(M,g,u,y,v,_,E,T,R,C,S){const b=_/R,L=E/C,I=_/2,V=E/2,j=T/2,te=R+1,q=C+1;let Z=0,ne=0;const fe=new P;for(let ve=0;ve<q;ve++){const qe=ve*L-V;for(let D=0;D<te;D++){const Le=D*b-I;fe[M]=Le*y,fe[g]=qe*v,fe[u]=j,h.push(fe.x,fe.y,fe.z),fe[M]=0,fe[g]=0,fe[u]=T>0?1:-1,d.push(fe.x,fe.y,fe.z),f.push(D/R),f.push(1-ve/C),Z+=1}}for(let ve=0;ve<C;ve++)for(let qe=0;qe<R;qe++){const D=p+qe+te*ve,Le=p+qe+te*(ve+1),_e=p+(qe+1)+te*(ve+1),Ee=p+(qe+1)+te*ve;c.push(D,Le,Ee),c.push(Le,_e,Ee),ne+=6}o.addGroup(m,ne,S),m+=ne,p+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Pa(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(mt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function On(n){const e={};for(let t=0;t<n.length;t++){const i=Pa(n[t]);for(const s in i)e[s]=i[s]}return e}function Qp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function cf(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:It.workingColorSpace}const Sr={clone:Pa,merge:On};var em=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends bs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=em,this.fragmentShader=tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pa(e.uniforms),this.uniformsGroups=Qp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class hf extends Ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=Ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const as=new P,Td=new Ue,Ed=new Ue;class qn extends hf{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=wr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wr*2*Math.atan(Math.tan(ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){as.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(as.x,as.y).multiplyScalar(-e/as.z),as.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(as.x,as.y).multiplyScalar(-e/as.z)}getViewSize(e,t){return this.getViewBounds(e,Td,Ed),t.subVectors(Ed,Td)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ar*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const la=-90,ca=1;class nm extends Ut{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new qn(la,ca,e,t);s.layers=this.layers,this.add(s);const a=new qn(la,ca,e,t);a.layers=this.layers,this.add(a);const r=new qn(la,ca,e,t);r.layers=this.layers,this.add(r);const o=new qn(la,ca,e,t);o.layers=this.layers,this.add(o);const c=new qn(la,ca,e,t);c.layers=this.layers,this.add(c);const h=new qn(la,ca,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,c]=t;for(const h of t)this.remove(h);if(e===Ri)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===zo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,h,d]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(f,p,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class df extends In{constructor(e=[],t=Aa,i,s,a,r,o,c,h,d){super(e,t,i,s,a,r,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class im extends gi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new df(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xe(5,5,5),a=new bn({name:"CubemapFromEquirect",uniforms:Pa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Dn,blending:Li});a.uniforms.tEquirect.value=t;const r=new O(s,a),o=t.minFilter;return t.minFilter===zs&&(t.minFilter=ni),new nm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class it extends Ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sm={type:"move"};class Ul{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new it,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new it,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new it,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),u=this._getHandJoint(h,M);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const d=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=d.position.distanceTo(f.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new it;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Rh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new Rh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class uf extends Ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vi,this.environmentIntensity=1,this.environmentRotation=new vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class am{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Xc,this.updateRanges=[],this.version=0,this.uuid=Ii()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Nn=new P;class Bo{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix4(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.applyNormalMatrix(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.transformDirection(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ui(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ui(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ui(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ui(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array),a=Wt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){Oo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new Zn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Bo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Oo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ph extends bs{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ha;const Ya=new P,da=new P,ua=new P,fa=new Ue,$a=new Ue,ff=new Et,oo=new P,Za=new P,lo=new P,Ad=new Ue,Fl=new Ue,Cd=new Ue;class qc extends Ut{constructor(e=new Ph){if(super(),this.isSprite=!0,this.type="Sprite",ha===void 0){ha=new Yt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new am(t,5);ha.setIndex([0,1,2,0,2,3]),ha.setAttribute("position",new Bo(i,3,0,!1)),ha.setAttribute("uv",new Bo(i,2,3,!1))}this.geometry=ha,this.material=e,this.center=new Ue(.5,.5),this.count=1}raycast(e,t){e.camera===null&&tn('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),da.setFromMatrixScale(this.matrixWorld),ff.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ua.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&da.multiplyScalar(-ua.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;co(oo.set(-.5,-.5,0),ua,r,da,s,a),co(Za.set(.5,-.5,0),ua,r,da,s,a),co(lo.set(.5,.5,0),ua,r,da,s,a),Ad.set(0,0),Fl.set(1,0),Cd.set(1,1);let o=e.ray.intersectTriangle(oo,Za,lo,!1,Ya);if(o===null&&(co(Za.set(-.5,.5,0),ua,r,da,s,a),Fl.set(0,1),o=e.ray.intersectTriangle(oo,lo,Za,!1,Ya),o===null))return;const c=e.ray.origin.distanceTo(Ya);c<e.near||c>e.far||t.push({distance:c,point:Ya.clone(),uv:ei.getInterpolation(Ya,oo,Za,lo,Ad,Fl,Cd,new Ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function co(n,e,t,i,s,a){fa.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?($a.x=a*fa.x-s*fa.y,$a.y=s*fa.x+a*fa.y):$a.copy(fa),n.copy(e),n.x+=$a.x,n.y+=$a.y,n.applyMatrix4(ff)}class pf extends In{constructor(e=null,t=1,i=1,s,a,r,o,c,h=$n,d=$n,f,p){super(null,r,o,c,h,d,s,a,f,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rd extends Zn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const pa=new Et,Pd=new Et,ho=[],Ld=new $s,rm=new Et,Ka=new O,Ja=new Fa;class on extends O{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Rd(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,rm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $s),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,pa),Ld.copy(e.boundingBox).applyMatrix4(pa),this.boundingBox.union(Ld)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fa),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,pa),Ja.copy(e.boundingSphere).applyMatrix4(pa),this.boundingSphere.union(Ja)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Ka.geometry=this.geometry,Ka.material=this.material,Ka.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ja.copy(this.boundingSphere),Ja.applyMatrix4(i),e.ray.intersectsSphere(Ja)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,pa),Pd.multiplyMatrices(i,pa),Ka.matrixWorld=Pd,Ka.raycast(e,ho);for(let r=0,o=ho.length;r<o;r++){const c=ho[r];c.instanceId=a,c.object=this,t.push(c)}ho.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Rd(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new pf(new Float32Array(s*this.count),s,this.count,Mh,Ci));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=o,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const zl=new P,om=new P,lm=new St;class Ls{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=zl.subVectors(i,t).cross(om.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(zl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||lm.getNormalMatrix(e),s=this.coplanarPoint(zl).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const As=new Fa,cm=new Ue(.5,.5),uo=new P;class Lh{constructor(e=new Ls,t=new Ls,i=new Ls,s=new Ls,a=new Ls,r=new Ls){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ri,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],h=a[3],d=a[4],f=a[5],p=a[6],m=a[7],x=a[8],M=a[9],g=a[10],u=a[11],y=a[12],v=a[13],_=a[14],E=a[15];if(s[0].setComponents(h-r,m-d,u-x,E-y).normalize(),s[1].setComponents(h+r,m+d,u+x,E+y).normalize(),s[2].setComponents(h+o,m+f,u+M,E+v).normalize(),s[3].setComponents(h-o,m-f,u-M,E-v).normalize(),i)s[4].setComponents(c,p,g,_).normalize(),s[5].setComponents(h-c,m-p,u-g,E-_).normalize();else if(s[4].setComponents(h-c,m-p,u-g,E-_).normalize(),t===Ri)s[5].setComponents(h+c,m+p,u+g,E+_).normalize();else if(t===zo)s[5].setComponents(c,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),As.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),As.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(As)}intersectsSprite(e){As.center.set(0,0,0);const t=cm.distanceTo(e.center);return As.radius=.7071067811865476+t,As.applyMatrix4(e.matrixWorld),this.intersectsSphere(As)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(uo.x=s.normal.x>0?e.max.x:e.min.x,uo.y=s.normal.y>0?e.max.y:e.min.y,uo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(uo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ko extends bs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Vo=new P,Go=new P,Dd=new Et,ja=new Ah,fo=new Fa,Nl=new P,Id=new P;class Yc extends Ut{constructor(e=new Yt,t=new ko){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)Vo.fromBufferAttribute(t,s-1),Go.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Vo.distanceTo(Go);e.setAttribute("lineDistance",new _t(i,1))}else mt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),fo.copy(i.boundingSphere),fo.applyMatrix4(s),fo.radius+=a,e.ray.intersectsSphere(fo)===!1)return;Dd.copy(s).invert(),ja.copy(e.ray).applyMatrix4(Dd);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,p=i.attributes.position;if(d!==null){const m=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const u=d.getX(M),y=d.getX(M+1),v=po(this,e,ja,c,u,y,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(m),u=po(this,e,ja,c,M,g,x-1);u&&t.push(u)}}else{const m=Math.max(0,r.start),x=Math.min(p.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const u=po(this,e,ja,c,M,M+1,M);u&&t.push(u)}if(this.isLineLoop){const M=po(this,e,ja,c,x-1,m,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function po(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(Vo.fromBufferAttribute(o,s),Go.fromBufferAttribute(o,a),t.distanceSqToSegment(Vo,Go,Nl,Id)>i)return;Nl.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(Nl);if(!(h<e.near||h>e.far))return{distance:h,point:Id.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const Ud=new P,Fd=new P;class hm extends Yc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)Ud.fromBufferAttribute(t,s),Fd.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ud.distanceTo(Fd);e.setAttribute("lineDistance",new _t(i,1))}else mt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class rn extends In{constructor(e,t,i,s,a,r,o,c,h){super(e,t,i,s,a,r,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mf extends In{constructor(e,t,i=Hs,s,a,r,o=$n,c=$n,h,d=_r,f=1){if(d!==_r&&d!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:f};super(p,s,a,r,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Eh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class xf extends In{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class xn extends Yt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],h=new P,d=new Ue;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,p=3;f<=t;f++,p+=3){const m=i+f/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),r.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(r[p]/e+1)/2,d.y=(r[p+1]/e+1)/2,c.push(d.x,d.y)}for(let f=1;f<=t;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new _t(r,3)),this.setAttribute("normal",new _t(o,3)),this.setAttribute("uv",new _t(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class je extends Yt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],f=[],p=[],m=[];let x=0;const M=[],g=i/2;let u=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new _t(f,3)),this.setAttribute("normal",new _t(p,3)),this.setAttribute("uv",new _t(m,2));function y(){const _=new P,E=new P;let T=0;const R=(t-e)/i;for(let C=0;C<=a;C++){const S=[],b=C/a,L=b*(t-e)+e;for(let I=0;I<=s;I++){const V=I/s,j=V*c+o,te=Math.sin(j),q=Math.cos(j);E.x=L*te,E.y=-b*i+g,E.z=L*q,f.push(E.x,E.y,E.z),_.set(te,R,q).normalize(),p.push(_.x,_.y,_.z),m.push(V,1-b),S.push(x++)}M.push(S)}for(let C=0;C<s;C++)for(let S=0;S<a;S++){const b=M[S][C],L=M[S+1][C],I=M[S+1][C+1],V=M[S][C+1];(e>0||S!==0)&&(d.push(b,L,V),T+=3),(t>0||S!==a-1)&&(d.push(L,I,V),T+=3)}h.addGroup(u,T,0),u+=T}function v(_){const E=x,T=new Ue,R=new P;let C=0;const S=_===!0?e:t,b=_===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*b,0),p.push(0,b,0),m.push(.5,.5),x++;const L=x;for(let I=0;I<=s;I++){const j=I/s*c+o,te=Math.cos(j),q=Math.sin(j);R.x=S*q,R.y=g*b,R.z=S*te,f.push(R.x,R.y,R.z),p.push(0,b,0),T.x=te*.5+.5,T.y=q*.5*b+.5,m.push(T.x,T.y),x++}for(let I=0;I<s;I++){const V=E+I,j=L+I;_===!0?d.push(j,j+1,V):d.push(j+1,j,V),C+=3}h.addGroup(u,C,_===!0?1:2),u+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new je(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ai extends je{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new Ai(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class jo extends Yt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),h(i),d(),this.setAttribute("position",new _t(a,3)),this.setAttribute("normal",new _t(a.slice(),3)),this.setAttribute("uv",new _t(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new P,_=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],_),m(t[T+2],E),c(v,_,E,y)}function c(y,v,_,E){const T=E+1,R=[];for(let C=0;C<=T;C++){R[C]=[];const S=y.clone().lerp(_,C/T),b=v.clone().lerp(_,C/T),L=T-C;for(let I=0;I<=L;I++)I===0&&C===T?R[C][I]=S:R[C][I]=S.clone().lerp(b,I/L)}for(let C=0;C<T;C++)for(let S=0;S<2*(T-C)-1;S++){const b=Math.floor(S/2);S%2===0?(p(R[C][b+1]),p(R[C+1][b]),p(R[C][b])):(p(R[C][b+1]),p(R[C+1][b+1]),p(R[C+1][b]))}}function h(y){const v=new P;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(y),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function d(){const y=new P;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const _=g(y)/2/Math.PI+.5,E=u(y)/Math.PI+.5;r.push(_,1-E)}x(),f()}function f(){for(let y=0;y<r.length;y+=6){const v=r[y+0],_=r[y+2],E=r[y+4],T=Math.max(v,_,E),R=Math.min(v,_,E);T>.9&&R<.1&&(v<.2&&(r[y+0]+=1),_<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function p(y){a.push(y.x,y.y,y.z)}function m(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){const y=new P,v=new P,_=new P,E=new P,T=new Ue,R=new Ue,C=new Ue;for(let S=0,b=0;S<a.length;S+=9,b+=6){y.set(a[S+0],a[S+1],a[S+2]),v.set(a[S+3],a[S+4],a[S+5]),_.set(a[S+6],a[S+7],a[S+8]),T.set(r[b+0],r[b+1]),R.set(r[b+2],r[b+3]),C.set(r[b+4],r[b+5]),E.copy(y).add(v).add(_).divideScalar(3);const L=g(E);M(T,b+0,y,L),M(R,b+2,v,L),M(C,b+4,_,L)}}function M(y,v,_,E){E<0&&y.x===1&&(r[v]=y.x-1),_.x===0&&_.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jo(e.vertices,e.indices,e.radius,e.details)}}class Dh extends jo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Dh(e.radius,e.detail)}}class Oi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){mt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,c=a-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-r,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],p=i[s+1]-d,m=(r-d)/p;return(s+m)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=t||(r.isVector2?new Ue:new P);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],a=[],r=[],o=new P,c=new Et;for(let m=0;m<=e;m++){const x=m/e;s[m]=this.getTangentAt(x,new P)}a[0]=new P,r[0]=new P;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),f<=h&&(h=f,i.set(0,1,0)),p<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let m=1;m<=e;m++){if(a[m]=a[m-1].clone(),r[m]=r[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(At(s[m-1].dot(s[m]),-1,1));a[m].applyMatrix4(c.makeRotationAxis(o,x))}r[m].crossVectors(s[m],a[m])}if(t===!0){let m=Math.acos(At(a[0].dot(a[e]),-1,1));m/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(m=-m);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],m*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Ih extends Oi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ue){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=c-this.aX,m=h-this.aY;c=p*d-m*f+this.aX,h=p*f+m*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class dm extends Ih{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Uh(){let n=0,e=0,t=0,i=0;function s(a,r,o,c){n=a,e=o,t=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,h){s(r,o,h*(o-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,h,d,f){let p=(r-a)/h-(o-a)/(h+d)+(o-r)/d,m=(o-r)/d-(c-r)/(d+f)+(c-o)/f;p*=d,m*=d,s(r,o,p,m)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const mo=new P,Ol=new Uh,Bl=new Uh,kl=new Uh;class um extends Oi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%a]:(mo.subVectors(s[0],s[1]).add(s[0]),h=mo);const f=s[o%a],p=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(mo.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=mo),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(f),m),M=Math.pow(f.distanceToSquared(p),m),g=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),Ol.initNonuniformCatmullRom(h.x,f.x,p.x,d.x,x,M,g),Bl.initNonuniformCatmullRom(h.y,f.y,p.y,d.y,x,M,g),kl.initNonuniformCatmullRom(h.z,f.z,p.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(Ol.initCatmullRom(h.x,f.x,p.x,d.x,this.tension),Bl.initCatmullRom(h.y,f.y,p.y,d.y,this.tension),kl.initCatmullRom(h.z,f.z,p.z,d.z,this.tension));return i.set(Ol.calc(c),Bl.calc(c),kl.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function zd(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*o+a*n+t}function fm(n,e){const t=1-n;return t*t*e}function pm(n,e){return 2*(1-n)*n*e}function mm(n,e){return n*n*e}function or(n,e,t,i){return fm(n,e)+pm(n,t)+mm(n,i)}function xm(n,e){const t=1-n;return t*t*t*e}function gm(n,e){const t=1-n;return 3*t*t*n*e}function vm(n,e){return 3*(1-n)*n*n*e}function Mm(n,e){return n*n*n*e}function lr(n,e,t,i,s){return xm(n,e)+gm(n,t)+vm(n,i)+Mm(n,s)}class gf extends Oi{constructor(e=new Ue,t=new Ue,i=new Ue,s=new Ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(lr(e,s.x,a.x,r.x,o.x),lr(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class _m extends Oi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(lr(e,s.x,a.x,r.x,o.x),lr(e,s.y,a.y,r.y,o.y),lr(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class vf extends Oi{constructor(e=new Ue,t=new Ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ue){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ym extends Oi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Mf extends Oi{constructor(e=new Ue,t=new Ue,i=new Ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(or(e,s.x,a.x,r.x),or(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class bm extends Oi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(or(e,s.x,a.x,r.x),or(e,s.y,a.y,r.y),or(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _f extends Oi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ue){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],f=s[r>s.length-3?s.length-1:r+2];return i.set(zd(o,c.x,h.x,d.x,f.x),zd(o,c.y,h.y,d.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Ue().fromArray(s))}return this}}var Nd=Object.freeze({__proto__:null,ArcCurve:dm,CatmullRomCurve3:um,CubicBezierCurve:gf,CubicBezierCurve3:_m,EllipseCurve:Ih,LineCurve:vf,LineCurve3:ym,QuadraticBezierCurve:Mf,QuadraticBezierCurve3:bm,SplineCurve:_f});class wm extends Oi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nd[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),h=c===0?0:1-r/c;return o.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Nd[s.type]().fromJSON(s))}return this}}class Od extends wm{constructor(e){super(),this.type="Path",this.currentPoint=new Ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new vf(this.currentPoint.clone(),new Ue(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new Mf(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new gf(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s),new Ue(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new _f(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,o,c),this}absellipse(e,t,i,s,a,r,o,c){const h=new Ih(e,t,i,s,a,r,o,c);if(this.curves.length>0){const f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Fh extends Od{constructor(e){super(e),this.uuid=Ii(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Od().fromJSON(s))}return this}}function Sm(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=yf(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,h;if(i&&(a=Rm(n,e,a,t)),n.length>80*t){o=n[0],c=n[1];let d=o,f=c;for(let p=t;p<s;p+=t){const m=n[p],x=n[p+1];m<o&&(o=m),x<c&&(c=x),m>d&&(d=m),x>f&&(f=x)}h=Math.max(d-o,f-c),h=h!==0?32767/h:0}return Tr(a,r,t,o,c,h,0),r}function yf(n,e,t,i,s){let a;if(s===km(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=Bd(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=Bd(r/i|0,n[r],n[r+1],a);return a&&La(a,a.next)&&(Ar(a),a=a.next),a}function Ws(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(La(t,t.next)||nn(t.prev,t,t.next)===0)){if(Ar(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Tr(n,e,t,i,s,a,r){if(!n)return;!r&&a&&Um(n,i,s,a);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?Em(n,i,s,a):Tm(n)){e.push(c.i,n.i,h.i),Ar(n),n=h.next,o=h.next;continue}if(n=h,n===o){r?r===1?(n=Am(Ws(n),e),Tr(n,e,t,i,s,a,2)):r===2&&Cm(n,e,t,i,s,a):Tr(Ws(n),e,t,i,s,a,1);break}}}function Tm(n){const e=n.prev,t=n,i=n.next;if(nn(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),f=Math.min(o,c,h),p=Math.max(s,a,r),m=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=p&&x.y>=f&&x.y<=m&&nr(s,o,a,c,r,h,x.x,x.y)&&nn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Em(n,e,t,i){const s=n.prev,a=n,r=n.next;if(nn(s,a,r)>=0)return!1;const o=s.x,c=a.x,h=r.x,d=s.y,f=a.y,p=r.y,m=Math.min(o,c,h),x=Math.min(d,f,p),M=Math.max(o,c,h),g=Math.max(d,f,p),u=$c(m,x,e,t,i),y=$c(M,g,e,t,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=u&&_&&_.z<=y;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&nr(o,d,c,f,h,p,v.x,v.y)&&nn(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&nr(o,d,c,f,h,p,_.x,_.y)&&nn(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=u;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&nr(o,d,c,f,h,p,v.x,v.y)&&nn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&nr(o,d,c,f,h,p,_.x,_.y)&&nn(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Am(n,e){let t=n;do{const i=t.prev,s=t.next.next;!La(i,s)&&wf(i,t,t.next,s)&&Er(i,s)&&Er(s,i)&&(e.push(i.i,t.i,s.i),Ar(t),Ar(t.next),t=n=s),t=t.next}while(t!==n);return Ws(t)}function Cm(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&Nm(r,o)){let c=Sf(r,o);r=Ws(r,r.next),c=Ws(c,c.next),Tr(r,e,t,i,s,a,0),Tr(c,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function Rm(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=yf(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(zm(h))}s.sort(Pm);for(let a=0;a<s.length;a++)t=Lm(s[a],t);return t}function Pm(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Lm(n,e){const t=Dm(n,e);if(!t)return e;const i=Sf(t,n);return Ws(i,i.next),Ws(t,t.next)}function Dm(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(La(n,t))return t;do{if(La(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>a&&(a=f,r=t.x<t.next.x?t:t.next,f===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&bf(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const f=Math.abs(s-t.y)/(i-t.x);Er(t,n)&&(f<d||f===d&&(t.x>r.x||t.x===r.x&&Im(r,t)))&&(r=t,d=f)}t=t.next}while(t!==o);return r}function Im(n,e){return nn(n.prev,n,e.prev)<0&&nn(e.next,n,n.next)<0}function Um(n,e,t,i){let s=n;do s.z===0&&(s.z=$c(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Fm(s)}function Fm(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let h=0;h<t&&(o++,r=r.nextZ,!!r);h++);let c=t;for(;o>0||c>0&&r;)o!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function $c(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function zm(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function bf(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function nr(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&bf(n,e,t,i,s,a,r,o)}function Nm(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Om(n,e)&&(Er(n,e)&&Er(e,n)&&Bm(n,e)&&(nn(n.prev,n,e.prev)||nn(n,e.prev,e))||La(n,e)&&nn(n.prev,n,n.next)>0&&nn(e.prev,e,e.next)>0)}function nn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function La(n,e){return n.x===e.x&&n.y===e.y}function wf(n,e,t,i){const s=go(nn(n,e,t)),a=go(nn(n,e,i)),r=go(nn(t,i,n)),o=go(nn(t,i,e));return!!(s!==a&&r!==o||s===0&&xo(n,t,e)||a===0&&xo(n,i,e)||r===0&&xo(t,n,i)||o===0&&xo(t,e,i))}function xo(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function go(n){return n>0?1:n<0?-1:0}function Om(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&wf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Er(n,e){return nn(n.prev,n,n.next)<0?nn(n,e,n.next)>=0&&nn(n,n.prev,e)>=0:nn(n,e,n.prev)<0||nn(n,n.next,e)<0}function Bm(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Sf(n,e){const t=Zc(n.i,n.x,n.y),i=Zc(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function Bd(n,e,t,i){const s=Zc(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ar(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Zc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function km(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class Vm{static triangulate(e,t,i=2){return Sm(e,t,i)}}class cr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return cr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];kd(e),Vd(i,e);let r=e.length;t.forEach(kd);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,Vd(i,t[c]);const o=Vm.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function kd(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Vd(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class zh extends jo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zh(e.radius,e.detail)}}class Zt extends Yt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,f=e/o,p=t/c,m=[],x=[],M=[],g=[];for(let u=0;u<d;u++){const y=u*p-r;for(let v=0;v<h;v++){const _=v*f-a;x.push(_,-y,0),M.push(0,0,1),g.push(v/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let y=0;y<o;y++){const v=y+h*u,_=y+h*(u+1),E=y+1+h*(u+1),T=y+1+h*u;m.push(v,_,T),m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new _t(x,3)),this.setAttribute("normal",new _t(M,3)),this.setAttribute("uv",new _t(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qo extends Yt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let f=e;const p=(t-e)/s,m=new P,x=new Ue;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const u=a+g/i*r;m.x=f*Math.cos(u),m.y=f*Math.sin(u),c.push(m.x,m.y,m.z),h.push(0,0,1),x.x=(m.x/t+1)/2,x.y=(m.y/t+1)/2,d.push(x.x,x.y)}f+=p}for(let M=0;M<s;M++){const g=M*(i+1);for(let u=0;u<i;u++){const y=u+g,v=y,_=y+i+1,E=y+i+2,T=y+1;o.push(v,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new _t(c,3)),this.setAttribute("normal",new _t(h,3)),this.setAttribute("uv",new _t(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class el extends Yt{constructor(e=new Fh([new Ue(0,.5),new Ue(-.5,-.5),new Ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new _t(s,3)),this.setAttribute("normal",new _t(a,3)),this.setAttribute("uv",new _t(r,2));function h(d){const f=s.length/3,p=d.extractPoints(t);let m=p.shape;const x=p.holes;cr.isClockWise(m)===!1&&(m=m.reverse());for(let g=0,u=x.length;g<u;g++){const y=x[g];cr.isClockWise(y)===!0&&(x[g]=y.reverse())}const M=cr.triangulateShape(m,x);for(let g=0,u=x.length;g<u;g++){const y=x[g];m=m.concat(y)}for(let g=0,u=m.length;g<u;g++){const y=m[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,u=M.length;g<u;g++){const y=M[g],v=y[0]+f,_=y[1]+f,E=y[2]+f;i.push(v,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Gm(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new el(i,e.curveSegments)}}function Gm(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Kt extends Yt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let h=0;const d=[],f=new P,p=new P,m=[],x=[],M=[],g=[];for(let u=0;u<=i;u++){const y=[],v=u/i;let _=0;u===0&&r===0?_=.5/t:u===i&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*a)*Math.sin(r+v*o),f.y=e*Math.cos(r+v*o),f.z=e*Math.sin(s+T*a)*Math.sin(r+v*o),x.push(f.x,f.y,f.z),p.copy(f).normalize(),M.push(p.x,p.y,p.z),g.push(T+_,1-v),y.push(h++)}d.push(y)}for(let u=0;u<i;u++)for(let y=0;y<t;y++){const v=d[u][y+1],_=d[u][y],E=d[u+1][y],T=d[u+1][y+1];(u!==0||r>0)&&m.push(v,_,T),(u!==i-1||c<Math.PI)&&m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new _t(x,3)),this.setAttribute("normal",new _t(M,3)),this.setAttribute("uv",new _t(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class _s extends Yt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],h=[],d=new P,f=new P,p=new P;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const M=x/s*a,g=m/i*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(f,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/s),h.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const M=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,u=(s+1)*(m-1)+x,y=(s+1)*m+x;r.push(M,g,y),r.push(g,u,y)}this.setIndex(r),this.setAttribute("position",new _t(o,3)),this.setAttribute("normal",new _t(c,3)),this.setAttribute("uv",new _t(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Hm extends bn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends bs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sh,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wm extends bs{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sh,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xm extends bs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qm extends bs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Nh extends Ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ym extends Nh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Vl=new Et,Gd=new P,Hd=new P;class Tf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=Ni,this.map=null,this.mapPass=null,this.matrix=new Et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lh,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Gd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Gd),Hd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Hd),t.updateMatrixWorld(),Vl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Wd=new Et,Qa=new P,Gl=new P;class $m extends Tf{constructor(){super(new qn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new Xt(2,1,1,1),new Xt(0,1,1,1),new Xt(3,1,1,1),new Xt(1,1,1,1),new Xt(3,0,1,1),new Xt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),Qa.setFromMatrixPosition(e.matrixWorld),i.position.copy(Qa),Gl.copy(i.position),Gl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Gl),i.updateMatrixWorld(),s.makeTranslation(-Qa.x,-Qa.y,-Qa.z),Wd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wd,i.coordinateSystem,i.reversedDepth)}}class Oh extends Nh{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new $m}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Bh extends hf{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Zm extends Tf{constructor(){super(new Bh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hl extends Nh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.shadow=new Zm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Km extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Ef{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Xd=new Et;class Jm{constructor(e,t,i=0,s=1/0){this.ray=new Ah(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Ch,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):tn("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xd),this}intersectObject(e,t=!0,i=[]){return Kc(e,this,i,t),i.sort(qd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)Kc(e[s],this,i,t);return i.sort(qd),i}}function qd(n,e){return n.distance-e.distance}function Kc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Kc(a[r],e,t,!0)}}function Yd(n,e,t,i){const s=jm(i);switch(t){case ef:return n*e;case Mh:return n*e/s.components*s.byteLength;case _h:return n*e/s.components*s.byteLength;case yh:return n*e*2/s.components*s.byteLength;case bh:return n*e*2/s.components*s.byteLength;case tf:return n*e*3/s.components*s.byteLength;case mi:return n*e*4/s.components*s.byteLength;case wh:return n*e*4/s.components*s.byteLength;case Eo:case Ao:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Co:case Ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vc:case _c:return Math.max(n,16)*Math.max(e,8)/4;case gc:case Mc:return Math.max(n,8)*Math.max(e,8)/2;case yc:case bc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case wc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Sc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Tc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ec:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ac:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Cc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Rc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Lc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Dc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ic:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Uc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Fc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case zc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Nc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Oc:case Bc:case kc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Vc:case Gc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Hc:case Wc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jm(n){switch(n){case Ni:case Ku:return{byteLength:1,components:1};case vr:case Ju:case Di:return{byteLength:2,components:1};case gh:case vh:return{byteLength:2,components:4};case Hs:case xh:case Ci:return{byteLength:4,components:1};case ju:case Qu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fh}}));typeof window<"u"&&(window.__THREE__?mt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fh);function Af(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Qm(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,f=h.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,h,d),o.onUploadCallback();let m;if(h instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)m=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=n.SHORT;else if(h instanceof Uint32Array)m=n.UNSIGNED_INT;else if(h instanceof Int32Array)m=n.INT;else if(h instanceof Int8Array)m=n.BYTE;else if(h instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,h){const d=c.array,f=c.updateRanges;if(n.bindBuffer(h,o),f.length===0)n.bufferSubData(h,0,d);else{f.sort((m,x)=>m.start-x.start);let p=0;for(let m=1;m<f.length;m++){const x=f[p],M=f[m];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++p,f[p]=M)}f.length=p+1;for(let m=0,x=f.length;m<x;m++){const M=f[m];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:a,update:r}}var ex=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tx=`#ifdef USE_ALPHAHASH
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
#endif`,nx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ix=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ax=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rx=`#ifdef USE_AOMAP
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
#endif`,ox=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lx=`#ifdef USE_BATCHING
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
#endif`,cx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ux=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fx=`#ifdef USE_IRIDESCENCE
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
#endif`,px=`#ifdef USE_BUMPMAP
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
#endif`,mx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_x=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,bx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,wx=`#define PI 3.141592653589793
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
} // validated`,Sx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Tx=`vec3 transformedNormal = objectNormal;
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
#endif`,Ex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ax=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Px="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dx=`#ifdef USE_ENVMAP
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
#endif`,Ix=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ux=`#ifdef USE_ENVMAP
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
#endif`,Fx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zx=`#ifdef USE_ENVMAP
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
#endif`,Nx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ox=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vx=`#ifdef USE_GRADIENTMAP
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
}`,Gx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xx=`uniform bool receiveShadow;
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
#endif`,qx=`#ifdef USE_ENVMAP
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
#endif`,Yx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$x=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jx=`PhysicalMaterial material;
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
#endif`,jx=`uniform sampler2D dfgLUT;
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
}`,Qx=`
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
#endif`,eg=`#if defined( RE_IndirectDiffuse )
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
#endif`,tg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ng=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ig=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ag=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,og=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cg=`#if defined( USE_POINTS_UV )
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
#endif`,hg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ug=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mg=`#ifdef USE_MORPHTARGETS
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
#endif`,xg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Mg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bg=`#ifdef USE_NORMALMAP
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
#endif`,wg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ag=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Rg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ig=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ug=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ng=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Og=`float getShadowMask() {
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
}`,Bg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kg=`#ifdef USE_SKINNING
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
#endif`,Vg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gg=`#ifdef USE_SKINNING
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
#endif`,Hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yg=`#ifdef USE_TRANSMISSION
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
#endif`,$g=`#ifdef USE_TRANSMISSION
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
#endif`,Zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,e1=`uniform sampler2D t2D;
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
}`,t1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,i1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,s1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a1=`#include <common>
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
}`,r1=`#if DEPTH_PACKING == 3200
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
}`,o1=`#define DISTANCE
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
}`,l1=`#define DISTANCE
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
}`,c1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,h1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d1=`uniform float scale;
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
}`,u1=`uniform vec3 diffuse;
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
}`,f1=`#include <common>
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
}`,p1=`uniform vec3 diffuse;
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
}`,m1=`#define LAMBERT
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
}`,x1=`#define LAMBERT
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
}`,g1=`#define MATCAP
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
}`,v1=`#define MATCAP
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
}`,M1=`#define NORMAL
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
}`,_1=`#define NORMAL
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
}`,y1=`#define PHONG
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
}`,b1=`#define PHONG
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
}`,w1=`#define STANDARD
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
}`,S1=`#define STANDARD
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
}`,T1=`#define TOON
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
}`,E1=`#define TOON
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
}`,A1=`uniform float size;
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
}`,C1=`uniform vec3 diffuse;
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
}`,R1=`#include <common>
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
}`,P1=`uniform vec3 color;
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
}`,L1=`uniform float rotation;
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
}`,D1=`uniform vec3 diffuse;
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
}`,Tt={alphahash_fragment:ex,alphahash_pars_fragment:tx,alphamap_fragment:nx,alphamap_pars_fragment:ix,alphatest_fragment:sx,alphatest_pars_fragment:ax,aomap_fragment:rx,aomap_pars_fragment:ox,batching_pars_vertex:lx,batching_vertex:cx,begin_vertex:hx,beginnormal_vertex:dx,bsdfs:ux,iridescence_fragment:fx,bumpmap_pars_fragment:px,clipping_planes_fragment:mx,clipping_planes_pars_fragment:xx,clipping_planes_pars_vertex:gx,clipping_planes_vertex:vx,color_fragment:Mx,color_pars_fragment:_x,color_pars_vertex:yx,color_vertex:bx,common:wx,cube_uv_reflection_fragment:Sx,defaultnormal_vertex:Tx,displacementmap_pars_vertex:Ex,displacementmap_vertex:Ax,emissivemap_fragment:Cx,emissivemap_pars_fragment:Rx,colorspace_fragment:Px,colorspace_pars_fragment:Lx,envmap_fragment:Dx,envmap_common_pars_fragment:Ix,envmap_pars_fragment:Ux,envmap_pars_vertex:Fx,envmap_physical_pars_fragment:qx,envmap_vertex:zx,fog_vertex:Nx,fog_pars_vertex:Ox,fog_fragment:Bx,fog_pars_fragment:kx,gradientmap_pars_fragment:Vx,lightmap_pars_fragment:Gx,lights_lambert_fragment:Hx,lights_lambert_pars_fragment:Wx,lights_pars_begin:Xx,lights_toon_fragment:Yx,lights_toon_pars_fragment:$x,lights_phong_fragment:Zx,lights_phong_pars_fragment:Kx,lights_physical_fragment:Jx,lights_physical_pars_fragment:jx,lights_fragment_begin:Qx,lights_fragment_maps:eg,lights_fragment_end:tg,logdepthbuf_fragment:ng,logdepthbuf_pars_fragment:ig,logdepthbuf_pars_vertex:sg,logdepthbuf_vertex:ag,map_fragment:rg,map_pars_fragment:og,map_particle_fragment:lg,map_particle_pars_fragment:cg,metalnessmap_fragment:hg,metalnessmap_pars_fragment:dg,morphinstance_vertex:ug,morphcolor_vertex:fg,morphnormal_vertex:pg,morphtarget_pars_vertex:mg,morphtarget_vertex:xg,normal_fragment_begin:gg,normal_fragment_maps:vg,normal_pars_fragment:Mg,normal_pars_vertex:_g,normal_vertex:yg,normalmap_pars_fragment:bg,clearcoat_normal_fragment_begin:wg,clearcoat_normal_fragment_maps:Sg,clearcoat_pars_fragment:Tg,iridescence_pars_fragment:Eg,opaque_fragment:Ag,packing:Cg,premultiplied_alpha_fragment:Rg,project_vertex:Pg,dithering_fragment:Lg,dithering_pars_fragment:Dg,roughnessmap_fragment:Ig,roughnessmap_pars_fragment:Ug,shadowmap_pars_fragment:Fg,shadowmap_pars_vertex:zg,shadowmap_vertex:Ng,shadowmask_pars_fragment:Og,skinbase_vertex:Bg,skinning_pars_vertex:kg,skinning_vertex:Vg,skinnormal_vertex:Gg,specularmap_fragment:Hg,specularmap_pars_fragment:Wg,tonemapping_fragment:Xg,tonemapping_pars_fragment:qg,transmission_fragment:Yg,transmission_pars_fragment:$g,uv_pars_fragment:Zg,uv_pars_vertex:Kg,uv_vertex:Jg,worldpos_vertex:jg,background_vert:Qg,background_frag:e1,backgroundCube_vert:t1,backgroundCube_frag:n1,cube_vert:i1,cube_frag:s1,depth_vert:a1,depth_frag:r1,distanceRGBA_vert:o1,distanceRGBA_frag:l1,equirect_vert:c1,equirect_frag:h1,linedashed_vert:d1,linedashed_frag:u1,meshbasic_vert:f1,meshbasic_frag:p1,meshlambert_vert:m1,meshlambert_frag:x1,meshmatcap_vert:g1,meshmatcap_frag:v1,meshnormal_vert:M1,meshnormal_frag:_1,meshphong_vert:y1,meshphong_frag:b1,meshphysical_vert:w1,meshphysical_frag:S1,meshtoon_vert:T1,meshtoon_frag:E1,points_vert:A1,points_frag:C1,shadow_vert:R1,shadow_frag:P1,sprite_vert:L1,sprite_frag:D1},He={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new St},alphaMap:{value:null},alphaMapTransform:{value:new St},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new St}},envmap:{envMap:{value:null},envMapRotation:{value:new St},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new St}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new St}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new St},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new St},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new St},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new St}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new St}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new St}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new St},alphaTest:{value:0},uvTransform:{value:new St}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new St},alphaMap:{value:null},alphaMapTransform:{value:new St},alphaTest:{value:0}}},Ti={basic:{uniforms:On([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:Tt.meshbasic_vert,fragmentShader:Tt.meshbasic_frag},lambert:{uniforms:On([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Tt.meshlambert_vert,fragmentShader:Tt.meshlambert_frag},phong:{uniforms:On([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:Tt.meshphong_vert,fragmentShader:Tt.meshphong_frag},standard:{uniforms:On([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag},toon:{uniforms:On([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Tt.meshtoon_vert,fragmentShader:Tt.meshtoon_frag},matcap:{uniforms:On([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:Tt.meshmatcap_vert,fragmentShader:Tt.meshmatcap_frag},points:{uniforms:On([He.points,He.fog]),vertexShader:Tt.points_vert,fragmentShader:Tt.points_frag},dashed:{uniforms:On([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Tt.linedashed_vert,fragmentShader:Tt.linedashed_frag},depth:{uniforms:On([He.common,He.displacementmap]),vertexShader:Tt.depth_vert,fragmentShader:Tt.depth_frag},normal:{uniforms:On([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:Tt.meshnormal_vert,fragmentShader:Tt.meshnormal_frag},sprite:{uniforms:On([He.sprite,He.fog]),vertexShader:Tt.sprite_vert,fragmentShader:Tt.sprite_frag},background:{uniforms:{uvTransform:{value:new St},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Tt.background_vert,fragmentShader:Tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new St}},vertexShader:Tt.backgroundCube_vert,fragmentShader:Tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Tt.cube_vert,fragmentShader:Tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Tt.equirect_vert,fragmentShader:Tt.equirect_frag},distanceRGBA:{uniforms:On([He.common,He.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Tt.distanceRGBA_vert,fragmentShader:Tt.distanceRGBA_frag},shadow:{uniforms:On([He.lights,He.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Tt.shadow_vert,fragmentShader:Tt.shadow_frag}};Ti.physical={uniforms:On([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new St},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new St},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new St},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new St},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new St},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new St},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new St},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new St},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new St},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new St},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new St},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new St}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag};const vo={r:0,b:0,g:0},Cs=new vi,I1=new Et;function U1(n,e,t,i,s,a,r){const o=new rt(0);let c=a===!0?0:1,h,d,f=null,p=0,m=null;function x(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function M(v){let _=!1;const E=x(v);E===null?u(o,c):E&&E.isColor&&(u(E,1),_=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,_){const E=x(_);E&&(E.isCubeTexture||E.mapping===Jo)?(d===void 0&&(d=new O(new xe(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Pa(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Cs.copy(_.backgroundRotation),Cs.x*=-1,Cs.y*=-1,Cs.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Cs.y*=-1,Cs.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(I1.makeRotationFromEuler(Cs)),d.material.toneMapped=It.getTransfer(E.colorSpace)!==Ht,(f!==E||p!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new O(new Zt(2,2),new bn({name:"BackgroundMaterial",uniforms:Pa(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:Ms,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=It.getTransfer(E.colorSpace)!==Ht,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function u(v,_){v.getRGB(vo,cf(n)),i.buffers.color.setClear(vo.r,vo.g,vo.b,_,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),c=_,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,u(o,c)},render:M,addToRenderList:g,dispose:y}}function F1(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let a=s,r=!1;function o(b,L,I,V,j){let te=!1;const q=f(V,I,L);a!==q&&(a=q,h(a.object)),te=m(b,V,I,j),te&&x(b,V,I,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(te||r)&&(r=!1,_(b,L,I,V),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function f(b,L,I){const V=I.wireframe===!0;let j=i[b.id];j===void 0&&(j={},i[b.id]=j);let te=j[L.id];te===void 0&&(te={},j[L.id]=te);let q=te[V];return q===void 0&&(q=p(c()),te[V]=q),q}function p(b){const L=[],I=[],V=[];for(let j=0;j<t;j++)L[j]=0,I[j]=0,V[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:I,attributeDivisors:V,object:b,attributes:{},index:null}}function m(b,L,I,V){const j=a.attributes,te=L.attributes;let q=0;const Z=I.getAttributes();for(const ne in Z)if(Z[ne].location>=0){const ve=j[ne];let qe=te[ne];if(qe===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(qe=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(qe=b.instanceColor)),ve===void 0||ve.attribute!==qe||qe&&ve.data!==qe.data)return!0;q++}return a.attributesNum!==q||a.index!==V}function x(b,L,I,V){const j={},te=L.attributes;let q=0;const Z=I.getAttributes();for(const ne in Z)if(Z[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const qe={};qe.attribute=ve,ve&&ve.data&&(qe.data=ve.data),j[ne]=qe,q++}a.attributes=j,a.attributesNum=q,a.index=V}function M(){const b=a.newAttributes;for(let L=0,I=b.length;L<I;L++)b[L]=0}function g(b){u(b,0)}function u(b,L){const I=a.newAttributes,V=a.enabledAttributes,j=a.attributeDivisors;I[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),j[b]!==L&&(n.vertexAttribDivisor(b,L),j[b]=L)}function y(){const b=a.newAttributes,L=a.enabledAttributes;for(let I=0,V=L.length;I<V;I++)L[I]!==b[I]&&(n.disableVertexAttribArray(I),L[I]=0)}function v(b,L,I,V,j,te,q){q===!0?n.vertexAttribIPointer(b,L,I,j,te):n.vertexAttribPointer(b,L,I,V,j,te)}function _(b,L,I,V){M();const j=V.attributes,te=I.getAttributes(),q=L.defaultAttributeValues;for(const Z in te){const ne=te[Z];if(ne.location>=0){let fe=j[Z];if(fe===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(fe=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(fe=b.instanceColor)),fe!==void 0){const ve=fe.normalized,qe=fe.itemSize,D=e.get(fe);if(D===void 0)continue;const Le=D.buffer,_e=D.type,Ee=D.bytesPerElement,$=_e===n.INT||_e===n.UNSIGNED_INT||fe.gpuType===xh;if(fe.isInterleavedBufferAttribute){const K=fe.data,be=K.stride,Ae=fe.offset;if(K.isInstancedInterleavedBuffer){for(let Be=0;Be<ne.locationSize;Be++)u(ne.location+Be,K.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Be=0;Be<ne.locationSize;Be++)g(ne.location+Be);n.bindBuffer(n.ARRAY_BUFFER,Le);for(let Be=0;Be<ne.locationSize;Be++)v(ne.location+Be,qe/ne.locationSize,_e,ve,be*Ee,(Ae+qe/ne.locationSize*Be)*Ee,$)}else{if(fe.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)u(ne.location+K,fe.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,Le);for(let K=0;K<ne.locationSize;K++)v(ne.location+K,qe/ne.locationSize,_e,ve,qe*Ee,qe/ne.locationSize*K*Ee,$)}}else if(q!==void 0){const ve=q[Z];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){C();for(const b in i){const L=i[b];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b.id]}function R(b){for(const L in i){const I=i[L];if(I[b.id]===void 0)continue;const V=I[b.id];for(const j in V)d(V[j].object),delete V[j];delete I[b.id]}}function C(){S(),r=!0,a!==s&&(a=s,h(a.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:S,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:g,disableUnusedAttributes:y}}function z1(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,f){f!==0&&(n.drawArraysInstanced(i,h,d,f),t.update(d,i,f))}function o(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,f);let m=0;for(let x=0;x<f;x++)m+=d[x];t.update(m,i,1)}function c(h,d,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)r(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,d,0,p,0,f);let x=0;for(let M=0;M<f;M++)x+=d[M]*p[M];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function N1(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(R){return!(R!==mi&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===Di&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ni&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ci&&!C)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(mt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const f=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function O1(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Ls,o=new St,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||i!==0||s;return s=p,i=f.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,p){t=d(f,p,0)},this.setState=function(f,p,m){const x=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,u=n.get(f);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let _=u.clippingState||null;c.value=_,_=d(x,p,v,m);for(let E=0;E!==v;++E)_[E]=t[E];u.clippingState=_,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,p,m,x){const M=f!==null?f.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const u=m+M*4,y=p.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<u)&&(g=new Float32Array(u));for(let v=0,_=m;v!==M;++v,_+=4)r.copy(f[v]).applyMatrix4(y,o),r.normal.toArray(g,_),g[_+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function B1(n){let e=new WeakMap;function t(r,o){return o===pc?r.mapping=Aa:o===mc&&(r.mapping=Ca),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===pc||o===mc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new im(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const fs=4,$d=[.125,.215,.35,.446,.526,.582],Fs=20,k1=512,er=new Bh,Zd=new rt;let Wl=null,Xl=0,ql=0,Yl=!1;const V1=new P;class Jc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=V1}=a;Wl=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),ql=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Wl,Xl,ql),this._renderer.xr.enabled=Yl,e.scissorTest=!1,ma(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Aa||e.mapping===Ca?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wl=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),ql=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:Di,format:mi,colorSpace:Ra,depthBuffer:!1},s=Kd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kd(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=G1(a)),this._blurMaterial=W1(a,e,t)}return s}_compileMaterial(e){const t=new O(new Yt,e);this._renderer.compile(t,er)}_sceneToCubeUV(e,t,i,s,a){const c=new qn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,m=f.toneMapping;f.getClearColor(Zd),f.toneMapping=xs,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new O(new xe,new Rt({name:"PMREM.Background",side:Dn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let u=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,u=!0):(g.color.copy(Zd),u=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):_===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;ma(s,_*E,v>2?E:0,E,E),f.setRenderTarget(s),u&&f.render(M,c),f.render(e,c)}f.toneMapping=m,f.autoClear=p,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Aa||e.mapping===Ca;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=jd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jd());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;ma(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,er)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=H1(this._lodMax,y,v)}const r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(h*h-d*d),p=.05+h*.95,m=f*p,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-fs?i-x+fs:0),u=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,ma(a,g,u,3*M,2*M),s.setRenderTarget(a),s.render(o,er),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,ma(e,g,u,3*M,2*M),s.setRenderTarget(e),s.render(o,er)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&tn("blur direction must be either latitudinal or longitudinal!");const d=3,f=this._lodMeshes[s];f.material=h;const p=h.uniforms,m=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Fs-1),M=a/x,g=isFinite(a)?1+Math.floor(d*M):Fs;g>Fs&&mt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Fs}`);const u=[];let y=0;for(let R=0;R<Fs;++R){const C=R/M,S=Math.exp(-C*C/2);u.push(S),R===0?y+=S:R<g&&(y+=2*S)}for(let R=0;R<u.length;R++)u[R]=u[R]/y;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=u,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const _=this._sizeLods[s],E=3*_*(s>v-fs?s-v+fs:0),T=4*(this._cubeSize-_);ma(t,E,T,3*_,2*_),c.setRenderTarget(t),c.render(f,er)}}function G1(n){const e=[],t=[],i=[];let s=n;const a=n-fs+1+$d.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-fs?c=$d[r-n+fs-1]:r===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,f=1+h,p=[d,d,f,d,f,f,d,d,f,f,d,f],m=6,x=6,M=3,g=2,u=1,y=new Float32Array(M*x*m),v=new Float32Array(g*x*m),_=new Float32Array(u*x*m);for(let T=0;T<m;T++){const R=T%3*2/3-1,C=T>2?0:-1,S=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];y.set(S,M*x*T),v.set(p,g*x*T);const b=[T,T,T,T,T,T];_.set(b,u*x*T)}const E=new Yt;E.setAttribute("position",new Zn(y,M)),E.setAttribute("uv",new Zn(v,g)),E.setAttribute("faceIndex",new Zn(_,u)),i.push(new O(E,null)),s>fs&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Kd(n,e,t){const i=new gi(n,e,t);return i.texture.mapping=Jo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ma(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function H1(n,e,t){return new bn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:k1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:tl(),fragmentShader:`

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
		`,blending:Li,depthTest:!1,depthWrite:!1})}function W1(n,e,t){const i=new Float32Array(Fs),s=new P(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Fs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:tl(),fragmentShader:`

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
		`,blending:Li,depthTest:!1,depthWrite:!1})}function Jd(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tl(),fragmentShader:`

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
		`,blending:Li,depthTest:!1,depthWrite:!1})}function jd(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Li,depthTest:!1,depthWrite:!1})}function tl(){return`

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
	`}function X1(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===pc||c===mc,d=c===Aa||c===Ca;if(h||d){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new Jc(n)),f=h?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return h&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Jc(n)),f=h?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function a(o){const c=o.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function q1(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&br("WebGLRenderer: "+i+" extension not supported."),s}}}function Y1(n,e,t,i){const s={},a=new WeakMap;function r(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",r),delete s[p.id];const m=a.get(p);m&&(e.remove(m),a.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,t.memory.geometries++),p}function c(f){const p=f.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function h(f){const p=[],m=f.index,x=f.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],T=y[v+1],R=y[v+2];p.push(E,T,T,R,R,E)}}else if(x!==void 0){const y=x.array;M=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,T=v+1,R=v+2;p.push(E,T,T,R,R,E)}}else return;const g=new(sf(p)?lf:of)(p,1);g.version=M;const u=a.get(f);u&&e.remove(u),a.set(f,g)}function d(f){const p=a.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&h(f)}else h(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:d}}function $1(n,e,t){let i;function s(p){i=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,m){n.drawElements(i,m,a,p*r),t.update(m,i,1)}function h(p,m,x){x!==0&&(n.drawElementsInstanced(i,m,a,p*r,x),t.update(m,i,x))}function d(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,a,p,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];t.update(g,i,1)}function f(p,m,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<p.length;u++)h(p[u]/r,m[u],M[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,a,p,0,M,0,x);let u=0;for(let y=0;y<x;y++)u+=m[y]*M[y];t.update(u,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function Z1(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:tn("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function K1(n,e,t){const i=new WeakMap,s=new Xt;function a(r,o,c){const h=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let p=i.get(o);if(p===void 0||p.count!==f){let b=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;p!==void 0&&p.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;x===!0&&(_=1),M===!0&&(_=2),g===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*T*4*f),C=new af(R,E,T,f);C.type=Ci,C.needsUpdate=!0;const S=_*4;for(let L=0;L<f;L++){const I=u[L],V=y[L],j=v[L],te=E*T*4*L;for(let q=0;q<I.count;q++){const Z=q*S;x===!0&&(s.fromBufferAttribute(I,q),R[te+Z+0]=s.x,R[te+Z+1]=s.y,R[te+Z+2]=s.z,R[te+Z+3]=0),M===!0&&(s.fromBufferAttribute(V,q),R[te+Z+4]=s.x,R[te+Z+5]=s.y,R[te+Z+6]=s.z,R[te+Z+7]=0),g===!0&&(s.fromBufferAttribute(j,q),R[te+Z+8]=s.x,R[te+Z+9]=s.y,R[te+Z+10]=s.z,R[te+Z+11]=j.itemSize===4?s.w:1)}}p={count:f,texture:C,size:new Ue(E,T)},i.set(o,p),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:a}}function J1(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==h&&(e.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return f}function r(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const Cf=new In,Qd=new mf(1,1),Rf=new af,Pf=new Vp,Lf=new df,eu=[],tu=[],nu=new Float32Array(16),iu=new Float32Array(9),su=new Float32Array(4);function za(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=eu[s];if(a===void 0&&(a=new Float32Array(s),eu[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function gn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function nl(n,e){let t=tu[e];t===void 0&&(t=new Int32Array(e),tu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function j1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Q1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2fv(this.addr,e),vn(t,e)}}function e2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gn(t,e))return;n.uniform3fv(this.addr,e),vn(t,e)}}function t2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4fv(this.addr,e),vn(t,e)}}function n2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;su.set(i),n.uniformMatrix2fv(this.addr,!1,su),vn(t,i)}}function i2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;iu.set(i),n.uniformMatrix3fv(this.addr,!1,iu),vn(t,i)}}function s2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;nu.set(i),n.uniformMatrix4fv(this.addr,!1,nu),vn(t,i)}}function a2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function r2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2iv(this.addr,e),vn(t,e)}}function o2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gn(t,e))return;n.uniform3iv(this.addr,e),vn(t,e)}}function l2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4iv(this.addr,e),vn(t,e)}}function c2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function h2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2uiv(this.addr,e),vn(t,e)}}function d2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gn(t,e))return;n.uniform3uiv(this.addr,e),vn(t,e)}}function u2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4uiv(this.addr,e),vn(t,e)}}function f2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Qd.compareFunction=nf,a=Qd):a=Cf,t.setTexture2D(e||a,s)}function p2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Pf,s)}function m2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Lf,s)}function x2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Rf,s)}function g2(n){switch(n){case 5126:return j1;case 35664:return Q1;case 35665:return e2;case 35666:return t2;case 35674:return n2;case 35675:return i2;case 35676:return s2;case 5124:case 35670:return a2;case 35667:case 35671:return r2;case 35668:case 35672:return o2;case 35669:case 35673:return l2;case 5125:return c2;case 36294:return h2;case 36295:return d2;case 36296:return u2;case 35678:case 36198:case 36298:case 36306:case 35682:return f2;case 35679:case 36299:case 36307:return p2;case 35680:case 36300:case 36308:case 36293:return m2;case 36289:case 36303:case 36311:case 36292:return x2}}function v2(n,e){n.uniform1fv(this.addr,e)}function M2(n,e){const t=za(e,this.size,2);n.uniform2fv(this.addr,t)}function _2(n,e){const t=za(e,this.size,3);n.uniform3fv(this.addr,t)}function y2(n,e){const t=za(e,this.size,4);n.uniform4fv(this.addr,t)}function b2(n,e){const t=za(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function w2(n,e){const t=za(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function S2(n,e){const t=za(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function T2(n,e){n.uniform1iv(this.addr,e)}function E2(n,e){n.uniform2iv(this.addr,e)}function A2(n,e){n.uniform3iv(this.addr,e)}function C2(n,e){n.uniform4iv(this.addr,e)}function R2(n,e){n.uniform1uiv(this.addr,e)}function P2(n,e){n.uniform2uiv(this.addr,e)}function L2(n,e){n.uniform3uiv(this.addr,e)}function D2(n,e){n.uniform4uiv(this.addr,e)}function I2(n,e,t){const i=this.cache,s=e.length,a=nl(t,s);gn(i,a)||(n.uniform1iv(this.addr,a),vn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||Cf,a[r])}function U2(n,e,t){const i=this.cache,s=e.length,a=nl(t,s);gn(i,a)||(n.uniform1iv(this.addr,a),vn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||Pf,a[r])}function F2(n,e,t){const i=this.cache,s=e.length,a=nl(t,s);gn(i,a)||(n.uniform1iv(this.addr,a),vn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||Lf,a[r])}function z2(n,e,t){const i=this.cache,s=e.length,a=nl(t,s);gn(i,a)||(n.uniform1iv(this.addr,a),vn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Rf,a[r])}function N2(n){switch(n){case 5126:return v2;case 35664:return M2;case 35665:return _2;case 35666:return y2;case 35674:return b2;case 35675:return w2;case 35676:return S2;case 5124:case 35670:return T2;case 35667:case 35671:return E2;case 35668:case 35672:return A2;case 35669:case 35673:return C2;case 5125:return R2;case 36294:return P2;case 36295:return L2;case 36296:return D2;case 35678:case 36198:case 36298:case 36306:case 35682:return I2;case 35679:case 36299:case 36307:return U2;case 35680:case 36300:case 36308:case 36293:return F2;case 36289:case 36303:case 36311:case 36292:return z2}}class O2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=g2(t.type)}}class B2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=N2(t.type)}}class k2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const $l=/(\w+)(\])?(\[|\.)?/g;function au(n,e){n.seq.push(e),n.map[e.id]=e}function V2(n,e,t){const i=n.name,s=i.length;for($l.lastIndex=0;;){const a=$l.exec(i),r=$l.lastIndex;let o=a[1];const c=a[2]==="]",h=a[3];if(c&&(o=o|0),h===void 0||h==="["&&r+2===s){au(t,h===void 0?new O2(o,n,e):new B2(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new k2(o),au(t,f)),t=f}}}class Po{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);V2(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function ru(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const G2=37297;let H2=0;function W2(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const ou=new St;function X2(n){It._getMatrix(ou,It.workingColorSpace,n);const e=`mat3( ${ou.elements.map(t=>t.toFixed(4))} )`;switch(It.getTransfer(n)){case Fo:return[e,"LinearTransferOETF"];case Ht:return[e,"sRGBTransferOETF"];default:return mt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function lu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+W2(n.getShaderSource(e),o)}else return a}function q2(n,e){const t=X2(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Y2(n,e){let t;switch(e){case Hu:t="Linear";break;case Wu:t="Reinhard";break;case Xu:t="Cineon";break;case mh:t="ACESFilmic";break;case Yu:t="AgX";break;case $u:t="Neutral";break;case qu:t="Custom";break;default:mt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Mo=new P;function $2(){It.getLuminanceCoefficients(Mo);const n=Mo.x.toFixed(4),e=Mo.y.toFixed(4),t=Mo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Z2(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ir).join(`
`)}function K2(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function J2(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function ir(n){return n!==""}function cu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const j2=/^[ \t]*#include +<([\w\d./]+)>/gm;function jc(n){return n.replace(j2,ev)}const Q2=new Map;function ev(n,e){let t=Tt[e];if(t===void 0){const i=Q2.get(e);if(i!==void 0)t=Tt[i],mt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return jc(t)}const tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function du(n){return n.replace(tv,nv)}function nv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function uu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function iv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Vu?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Gu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===qi&&(e="SHADOWMAP_TYPE_VSM"),e}function sv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Aa:case Ca:e="ENVMAP_TYPE_CUBE";break;case Jo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function av(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Ca&&(e="ENVMAP_MODE_REFRACTION"),e}function rv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ph:e="ENVMAP_BLENDING_MULTIPLY";break;case ap:e="ENVMAP_BLENDING_MIX";break;case rp:e="ENVMAP_BLENDING_ADD";break}return e}function ov(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function lv(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=iv(t),h=sv(t),d=av(t),f=rv(t),p=ov(t),m=Z2(t),x=K2(a),M=s.createProgram();let g,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ir).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ir).join(`
`),u.length>0&&(u+=`
`)):(g=[uu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ir).join(`
`),u=[uu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==xs?"#define TONE_MAPPING":"",t.toneMapping!==xs?Tt.tonemapping_pars_fragment:"",t.toneMapping!==xs?Y2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Tt.colorspace_pars_fragment,q2("linearToOutputTexel",t.outputColorSpace),$2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ir).join(`
`)),r=jc(r),r=cu(r,t),r=hu(r,t),o=jc(o),o=cu(o,t),o=hu(o,t),r=du(r),o=du(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",t.glslVersion===ld?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ld?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const v=y+g+r,_=y+u+o,E=ru(s,s.VERTEX_SHADER,v),T=ru(s,s.FRAGMENT_SHADER,_);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function R(L){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(E)||"",j=s.getShaderInfoLog(T)||"",te=I.trim(),q=V.trim(),Z=j.trim();let ne=!0,fe=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const ve=lu(s,E,"vertex"),qe=lu(s,T,"fragment");tn("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+ve+`
`+qe)}else te!==""?mt("WebGLProgram: Program Info Log:",te):(q===""||Z==="")&&(fe=!1);fe&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:Z,prefix:u}})}s.deleteShader(E),s.deleteShader(T),C=new Po(s,M),S=J2(s,M)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,G2)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=H2++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let cv=0;class hv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new dv(e),t.set(e,i)),i}}class dv{constructor(e){this.id=cv++,this.code=e,this.usedTimes=0}}function uv(n,e,t,i,s,a,r){const o=new Ch,c=new hv,h=new Set,d=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(S){return h.add(S),S===0?"uv":`uv${S}`}function g(S,b,L,I,V){const j=I.fog,te=V.geometry,q=S.isMeshStandardMaterial?I.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||q),ne=Z&&Z.mapping===Jo?Z.image.height:null,fe=x[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&mt("WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,qe=ve!==void 0?ve.length:0;let D=0;te.morphAttributes.position!==void 0&&(D=1),te.morphAttributes.normal!==void 0&&(D=2),te.morphAttributes.color!==void 0&&(D=3);let Le,_e,Ee,$;if(fe){const Dt=Ti[fe];Le=Dt.vertexShader,_e=Dt.fragmentShader}else Le=S.vertexShader,_e=S.fragmentShader,c.update(S),Ee=c.getVertexShaderID(S),$=c.getFragmentShaderID(S);const K=n.getRenderTarget(),be=n.state.buffers.depth.getReversed(),Ae=V.isInstancedMesh===!0,Be=V.isBatchedMesh===!0,tt=!!S.map,Nt=!!S.matcap,st=!!Z,Ft=!!S.aoMap,B=!!S.lightMap,yt=!!S.bumpMap,vt=!!S.normalMap,zt=!!S.displacementMap,Je=!!S.emissiveMap,kt=!!S.metalnessMap,ot=!!S.roughnessMap,gt=S.anisotropy>0,U=S.clearcoat>0,A=S.dispersion>0,J=S.iridescence>0,he=S.sheen>0,ge=S.transmission>0,ae=gt&&!!S.anisotropyMap,Qe=U&&!!S.clearcoatMap,De=U&&!!S.clearcoatNormalMap,nt=U&&!!S.clearcoatRoughnessMap,Ye=J&&!!S.iridescenceMap,Me=J&&!!S.iridescenceThicknessMap,Ce=he&&!!S.sheenColorMap,ht=he&&!!S.sheenRoughnessMap,ct=!!S.specularMap,We=!!S.specularColorMap,dt=!!S.specularIntensityMap,H=ge&&!!S.transmissionMap,Ge=ge&&!!S.thicknessMap,Oe=!!S.gradientMap,Fe=!!S.alphaMap,we=S.alphaTest>0,pe=!!S.alphaHash,Ke=!!S.extensions;let ut=xs;S.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(ut=n.toneMapping);const Ot={shaderID:fe,shaderType:S.type,shaderName:S.name,vertexShader:Le,fragmentShader:_e,defines:S.defines,customVertexShaderID:Ee,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Be,batchingColor:Be&&V._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&V.instanceColor!==null,instancingMorph:Ae&&V.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ra,alphaToCoverage:!!S.alphaToCoverage,map:tt,matcap:Nt,envMap:st,envMapMode:st&&Z.mapping,envMapCubeUVHeight:ne,aoMap:Ft,lightMap:B,bumpMap:yt,normalMap:vt,displacementMap:p&&zt,emissiveMap:Je,normalMapObjectSpace:vt&&S.normalMapType===hp,normalMapTangentSpace:vt&&S.normalMapType===Sh,metalnessMap:kt,roughnessMap:ot,anisotropy:gt,anisotropyMap:ae,clearcoat:U,clearcoatMap:Qe,clearcoatNormalMap:De,clearcoatRoughnessMap:nt,dispersion:A,iridescence:J,iridescenceMap:Ye,iridescenceThicknessMap:Me,sheen:he,sheenColorMap:Ce,sheenRoughnessMap:ht,specularMap:ct,specularColorMap:We,specularIntensityMap:dt,transmission:ge,transmissionMap:H,thicknessMap:Ge,gradientMap:Oe,opaque:S.transparent===!1&&S.blending===_a&&S.alphaToCoverage===!1,alphaMap:Fe,alphaTest:we,alphaHash:pe,combine:S.combine,mapUv:tt&&M(S.map.channel),aoMapUv:Ft&&M(S.aoMap.channel),lightMapUv:B&&M(S.lightMap.channel),bumpMapUv:yt&&M(S.bumpMap.channel),normalMapUv:vt&&M(S.normalMap.channel),displacementMapUv:zt&&M(S.displacementMap.channel),emissiveMapUv:Je&&M(S.emissiveMap.channel),metalnessMapUv:kt&&M(S.metalnessMap.channel),roughnessMapUv:ot&&M(S.roughnessMap.channel),anisotropyMapUv:ae&&M(S.anisotropyMap.channel),clearcoatMapUv:Qe&&M(S.clearcoatMap.channel),clearcoatNormalMapUv:De&&M(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&M(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&M(S.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&M(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&M(S.sheenColorMap.channel),sheenRoughnessMapUv:ht&&M(S.sheenRoughnessMap.channel),specularMapUv:ct&&M(S.specularMap.channel),specularColorMapUv:We&&M(S.specularColorMap.channel),specularIntensityMapUv:dt&&M(S.specularIntensityMap.channel),transmissionMapUv:H&&M(S.transmissionMap.channel),thicknessMapUv:Ge&&M(S.thicknessMap.channel),alphaMapUv:Fe&&M(S.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(vt||gt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!te.attributes.uv&&(tt||Fe),fog:!!j,useFog:S.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:be,skinning:V.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:qe,morphTextureStride:D,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:ut,decodeVideoTexture:tt&&S.map.isVideoTexture===!0&&It.getTransfer(S.map.colorSpace)===Ht,decodeVideoTextureEmissive:Je&&S.emissiveMap.isVideoTexture===!0&&It.getTransfer(S.emissiveMap.colorSpace)===Ht,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Mt,flipSided:S.side===Dn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ke&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ke&&S.extensions.multiDraw===!0||Be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ot.vertexUv1s=h.has(1),Ot.vertexUv2s=h.has(2),Ot.vertexUv3s=h.has(3),h.clear(),Ot}function u(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)b.push(L),b.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(y(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function _(S){const b=x[S.type];let L;if(b){const I=Ti[b];L=Sr.clone(I.uniforms)}else L=S.uniforms;return L}function E(S,b){let L;for(let I=0,V=d.length;I<V;I++){const j=d[I];if(j.cacheKey===b){L=j,++L.usedTimes;break}}return L===void 0&&(L=new lv(n,b,S,a),d.push(L)),L}function T(S){if(--S.usedTimes===0){const b=d.indexOf(S);d[b]=d[d.length-1],d.pop(),S.destroy()}}function R(S){c.remove(S)}function C(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:R,programs:d,dispose:C}}function fv(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function pv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function fu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function pu(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(f,p,m,x,M,g){let u=n[e];return u===void 0?(u={id:f.id,object:f,geometry:p,material:m,groupOrder:x,renderOrder:f.renderOrder,z:M,group:g},n[e]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=m,u.groupOrder=x,u.renderOrder=f.renderOrder,u.z=M,u.group=g),e++,u}function o(f,p,m,x,M,g){const u=r(f,p,m,x,M,g);m.transmission>0?i.push(u):m.transparent===!0?s.push(u):t.push(u)}function c(f,p,m,x,M,g){const u=r(f,p,m,x,M,g);m.transmission>0?i.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function h(f,p){t.length>1&&t.sort(f||pv),i.length>1&&i.sort(p||fu),s.length>1&&s.sort(p||fu)}function d(){for(let f=e,p=n.length;f<p;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:h}}function mv(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new pu,n.set(i,[r])):s>=a.length?(r=new pu,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function xv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new rt};break;case"SpotLight":t={position:new P,direction:new P,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function gv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let vv=0;function Mv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function _v(n){const e=new xv,t=gv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);const s=new P,a=new Et,r=new Et;function o(h){let d=0,f=0,p=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let m=0,x=0,M=0,g=0,u=0,y=0,v=0,_=0,E=0,T=0,R=0;h.sort(Mv);for(let S=0,b=h.length;S<b;S++){const L=h[S],I=L.color,V=L.intensity,j=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=I.r*V,f+=I.g*V,p+=I.b*V;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],V);R++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=te,i.directionalShadowMatrix[m]=L.shadow.matrix,y++}i.directional[m]=q,m++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(I).multiplyScalar(V),q.distance=j,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const Z=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,Z.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=Z.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,_++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(I).multiplyScalar(V),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,ne.shadowCameraNear=Z.camera.near,ne.shadowCameraFar=Z.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(V),q.groundColor.copy(L.groundColor).multiplyScalar(V),i.hemi[u]=q,u++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=He.LTC_FLOAT_1,i.rectAreaLTC2=He.LTC_FLOAT_2):(i.rectAreaLTC1=He.LTC_HALF_1,i.rectAreaLTC2=He.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=p;const C=i.hash;(C.directionalLength!==m||C.pointLength!==x||C.spotLength!==M||C.rectAreaLength!==g||C.hemiLength!==u||C.numDirectionalShadows!==y||C.numPointShadows!==v||C.numSpotShadows!==_||C.numSpotMaps!==E||C.numLightProbes!==R)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,C.directionalLength=m,C.pointLength=x,C.spotLength=M,C.rectAreaLength=g,C.hemiLength=u,C.numDirectionalShadows=y,C.numPointShadows=v,C.numSpotShadows=_,C.numSpotMaps=E,C.numLightProbes=R,i.version=vv++)}function c(h,d){let f=0,p=0,m=0,x=0,M=0;const g=d.matrixWorldInverse;for(let u=0,y=h.length;u<y;u++){const v=h[u];if(v.isDirectionalLight){const _=i.directional[f];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(v.isSpotLight){const _=i.spot[m];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const _=i.rectArea[x];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const _=i.point[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const _=i.hemi[M];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(g),M++}}}return{setup:o,setupView:c,state:i}}function mu(n){const e=new _v(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function yv(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new mu(n),e.set(s,[o])):a>=r.length?(o=new mu(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wv=`uniform sampler2D shadow_pass;
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
}`;function Sv(n,e,t){let i=new Lh;const s=new Ue,a=new Ue,r=new Xt,o=new Xm({depthPacking:cp}),c=new qm,h={},d=t.maxTextureSize,f={[Ms]:Dn,[Dn]:Ms,[Mt]:Mt},p=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:bv,fragmentShader:wv}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Yt;x.setAttribute("position",new Zn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new O(x,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vu;let u=this.type;this.render=function(T,R,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const S=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Li),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const V=u!==qi&&this.type===qi,j=u===qi&&this.type!==qi;for(let te=0,q=T.length;te<q;te++){const Z=T[te],ne=Z.shadow;if(ne===void 0){mt("WebGLShadowMap:",Z,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const fe=ne.getFrameExtents();if(s.multiply(fe),a.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/fe.x),s.x=a.x*fe.x,ne.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/fe.y),s.y=a.y*fe.y,ne.mapSize.y=a.y)),ne.map===null||V===!0||j===!0){const qe=this.type!==qi?{minFilter:$n,magFilter:$n}:{};ne.map!==null&&ne.map.dispose(),ne.map=new gi(s.x,s.y,qe),ne.map.texture.name=Z.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let qe=0;qe<ve;qe++){const D=ne.getViewport(qe);r.set(a.x*D.x,a.y*D.y,a.x*D.z,a.y*D.w),I.viewport(r),ne.updateMatrices(Z,qe),i=ne.getFrustum(),_(R,C,ne.camera,Z,this.type)}ne.isPointLightShadow!==!0&&this.type===qi&&y(ne,C),ne.needsUpdate=!1}u=this.type,g.needsUpdate=!1,n.setRenderTarget(S,b,L)};function y(T,R){const C=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new gi(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(R,null,C,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(R,null,C,m,M,null)}function v(T,R,C,S){let b=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)b=L;else if(b=C.isPointLight===!0?c:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=b.uuid,V=R.uuid;let j=h[I];j===void 0&&(j={},h[I]=j);let te=j[V];te===void 0&&(te=b.clone(),j[V]=te,R.addEventListener("dispose",E)),b=te}if(b.visible=R.visible,b.wireframe=R.wireframe,S===qi?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:f[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=C}return b}function _(T,R,C,S,b){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===qi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const V=e.update(T),j=T.material;if(Array.isArray(j)){const te=V.groups;for(let q=0,Z=te.length;q<Z;q++){const ne=te[q],fe=j[ne.materialIndex];if(fe&&fe.visible){const ve=v(T,fe,S,b);T.onBeforeShadow(n,T,R,C,V,ve,ne),n.renderBufferDirect(C,null,V,ve,T,ne),T.onAfterShadow(n,T,R,C,V,ve,ne)}}}else if(j.visible){const te=v(T,j,S,b);T.onBeforeShadow(n,T,R,C,V,te,null),n.renderBufferDirect(C,null,V,te,T,null),T.onAfterShadow(n,T,R,C,V,te,null)}}const I=T.children;for(let V=0,j=I.length;V<j;V++)_(I[V],R,C,S,b)}function E(T){T.target.removeEventListener("dispose",E);for(const C in h){const S=h[C],b=T.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const Tv={[oc]:lc,[cc]:uc,[hc]:fc,[Ea]:dc,[lc]:oc,[uc]:cc,[fc]:hc,[dc]:Ea};function Ev(n,e){function t(){let H=!1;const Ge=new Xt;let Oe=null;const Fe=new Xt(0,0,0,0);return{setMask:function(we){Oe!==we&&!H&&(n.colorMask(we,we,we,we),Oe=we)},setLocked:function(we){H=we},setClear:function(we,pe,Ke,ut,Ot){Ot===!0&&(we*=ut,pe*=ut,Ke*=ut),Ge.set(we,pe,Ke,ut),Fe.equals(Ge)===!1&&(n.clearColor(we,pe,Ke,ut),Fe.copy(Ge))},reset:function(){H=!1,Oe=null,Fe.set(-1,0,0,0)}}}function i(){let H=!1,Ge=!1,Oe=null,Fe=null,we=null;return{setReversed:function(pe){if(Ge!==pe){const Ke=e.get("EXT_clip_control");pe?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ge=pe;const ut=we;we=null,this.setClear(ut)}},getReversed:function(){return Ge},setTest:function(pe){pe?K(n.DEPTH_TEST):be(n.DEPTH_TEST)},setMask:function(pe){Oe!==pe&&!H&&(n.depthMask(pe),Oe=pe)},setFunc:function(pe){if(Ge&&(pe=Tv[pe]),Fe!==pe){switch(pe){case oc:n.depthFunc(n.NEVER);break;case lc:n.depthFunc(n.ALWAYS);break;case cc:n.depthFunc(n.LESS);break;case Ea:n.depthFunc(n.LEQUAL);break;case hc:n.depthFunc(n.EQUAL);break;case dc:n.depthFunc(n.GEQUAL);break;case uc:n.depthFunc(n.GREATER);break;case fc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Fe=pe}},setLocked:function(pe){H=pe},setClear:function(pe){we!==pe&&(Ge&&(pe=1-pe),n.clearDepth(pe),we=pe)},reset:function(){H=!1,Oe=null,Fe=null,we=null,Ge=!1}}}function s(){let H=!1,Ge=null,Oe=null,Fe=null,we=null,pe=null,Ke=null,ut=null,Ot=null;return{setTest:function(Dt){H||(Dt?K(n.STENCIL_TEST):be(n.STENCIL_TEST))},setMask:function(Dt){Ge!==Dt&&!H&&(n.stencilMask(Dt),Ge=Dt)},setFunc:function(Dt,Fn,En){(Oe!==Dt||Fe!==Fn||we!==En)&&(n.stencilFunc(Dt,Fn,En),Oe=Dt,Fe=Fn,we=En)},setOp:function(Dt,Fn,En){(pe!==Dt||Ke!==Fn||ut!==En)&&(n.stencilOp(Dt,Fn,En),pe=Dt,Ke=Fn,ut=En)},setLocked:function(Dt){H=Dt},setClear:function(Dt){Ot!==Dt&&(n.clearStencil(Dt),Ot=Dt)},reset:function(){H=!1,Ge=null,Oe=null,Fe=null,we=null,pe=null,Ke=null,ut=null,Ot=null}}}const a=new t,r=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,y=null,v=null,_=null,E=null,T=null,R=new rt(0,0,0),C=0,S=!1,b=null,L=null,I=null,V=null,j=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Z=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=Z>=1):ne.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=Z>=2);let fe=null,ve={};const qe=n.getParameter(n.SCISSOR_BOX),D=n.getParameter(n.VIEWPORT),Le=new Xt().fromArray(qe),_e=new Xt().fromArray(D);function Ee(H,Ge,Oe,Fe){const we=new Uint8Array(4),pe=n.createTexture();n.bindTexture(H,pe),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ke=0;Ke<Oe;Ke++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ge,0,n.RGBA,1,1,Fe,0,n.RGBA,n.UNSIGNED_BYTE,we):n.texImage2D(Ge+Ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,we);return pe}const $={};$[n.TEXTURE_2D]=Ee(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Ee(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Ee(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Ee(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(Ea),yt(!1),vt(sd),K(n.CULL_FACE),Ft(Li);function K(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function be(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Ae(H,Ge){return f[H]!==Ge?(n.bindFramebuffer(H,Ge),f[H]=Ge,H===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Ge),H===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Ge),!0):!1}function Be(H,Ge){let Oe=m,Fe=!1;if(H){Oe=p.get(Ge),Oe===void 0&&(Oe=[],p.set(Ge,Oe));const we=H.textures;if(Oe.length!==we.length||Oe[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,Ke=we.length;pe<Ke;pe++)Oe[pe]=n.COLOR_ATTACHMENT0+pe;Oe.length=we.length,Fe=!0}}else Oe[0]!==n.BACK&&(Oe[0]=n.BACK,Fe=!0);Fe&&n.drawBuffers(Oe)}function tt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const Nt={[Us]:n.FUNC_ADD,[G0]:n.FUNC_SUBTRACT,[H0]:n.FUNC_REVERSE_SUBTRACT};Nt[W0]=n.MIN,Nt[X0]=n.MAX;const st={[q0]:n.ZERO,[Y0]:n.ONE,[$0]:n.SRC_COLOR,[ac]:n.SRC_ALPHA,[ep]:n.SRC_ALPHA_SATURATE,[j0]:n.DST_COLOR,[K0]:n.DST_ALPHA,[Z0]:n.ONE_MINUS_SRC_COLOR,[rc]:n.ONE_MINUS_SRC_ALPHA,[Q0]:n.ONE_MINUS_DST_COLOR,[J0]:n.ONE_MINUS_DST_ALPHA,[tp]:n.CONSTANT_COLOR,[np]:n.ONE_MINUS_CONSTANT_COLOR,[ip]:n.CONSTANT_ALPHA,[sp]:n.ONE_MINUS_CONSTANT_ALPHA};function Ft(H,Ge,Oe,Fe,we,pe,Ke,ut,Ot,Dt){if(H===Li){M===!0&&(be(n.BLEND),M=!1);return}if(M===!1&&(K(n.BLEND),M=!0),H!==V0){if(H!==g||Dt!==S){if((u!==Us||_!==Us)&&(n.blendEquation(n.FUNC_ADD),u=Us,_=Us),Dt)switch(H){case _a:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ti:n.blendFunc(n.ONE,n.ONE);break;case ad:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:tn("WebGLState: Invalid blending: ",H);break}else switch(H){case _a:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ti:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ad:tn("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rd:tn("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tn("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,T=null,R.set(0,0,0),C=0,g=H,S=Dt}return}we=we||Ge,pe=pe||Oe,Ke=Ke||Fe,(Ge!==u||we!==_)&&(n.blendEquationSeparate(Nt[Ge],Nt[we]),u=Ge,_=we),(Oe!==y||Fe!==v||pe!==E||Ke!==T)&&(n.blendFuncSeparate(st[Oe],st[Fe],st[pe],st[Ke]),y=Oe,v=Fe,E=pe,T=Ke),(ut.equals(R)===!1||Ot!==C)&&(n.blendColor(ut.r,ut.g,ut.b,Ot),R.copy(ut),C=Ot),g=H,S=!1}function B(H,Ge){H.side===Mt?be(n.CULL_FACE):K(n.CULL_FACE);let Oe=H.side===Dn;Ge&&(Oe=!Oe),yt(Oe),H.blending===_a&&H.transparent===!1?Ft(Li):Ft(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const Fe=H.stencilWrite;o.setTest(Fe),Fe&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Je(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):be(n.SAMPLE_ALPHA_TO_COVERAGE)}function yt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function vt(H){H!==B0?(K(n.CULL_FACE),H!==L&&(H===sd?n.cullFace(n.BACK):H===k0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):be(n.CULL_FACE),L=H}function zt(H){H!==I&&(q&&n.lineWidth(H),I=H)}function Je(H,Ge,Oe){H?(K(n.POLYGON_OFFSET_FILL),(V!==Ge||j!==Oe)&&(n.polygonOffset(Ge,Oe),V=Ge,j=Oe)):be(n.POLYGON_OFFSET_FILL)}function kt(H){H?K(n.SCISSOR_TEST):be(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+te-1),fe!==H&&(n.activeTexture(H),fe=H)}function gt(H,Ge,Oe){Oe===void 0&&(fe===null?Oe=n.TEXTURE0+te-1:Oe=fe);let Fe=ve[Oe];Fe===void 0&&(Fe={type:void 0,texture:void 0},ve[Oe]=Fe),(Fe.type!==H||Fe.texture!==Ge)&&(fe!==Oe&&(n.activeTexture(Oe),fe=Oe),n.bindTexture(H,Ge||$[H]),Fe.type=H,Fe.texture=Ge)}function U(){const H=ve[fe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function he(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ae(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function Qe(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function De(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function nt(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ye(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function Me(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ce(H){Le.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Le.copy(H))}function ht(H){_e.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),_e.copy(H))}function ct(H,Ge){let Oe=h.get(Ge);Oe===void 0&&(Oe=new WeakMap,h.set(Ge,Oe));let Fe=Oe.get(H);Fe===void 0&&(Fe=n.getUniformBlockIndex(Ge,H.name),Oe.set(H,Fe))}function We(H,Ge){const Fe=h.get(Ge).get(H);c.get(Ge)!==Fe&&(n.uniformBlockBinding(Ge,Fe,H.__bindingPointIndex),c.set(Ge,Fe))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},fe=null,ve={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,y=null,v=null,_=null,E=null,T=null,R=new rt(0,0,0),C=0,S=!1,b=null,L=null,I=null,V=null,j=null,Le.set(0,0,n.canvas.width,n.canvas.height),_e.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:be,bindFramebuffer:Ae,drawBuffers:Be,useProgram:tt,setBlending:Ft,setMaterial:B,setFlipSided:yt,setCullFace:vt,setLineWidth:zt,setPolygonOffset:Je,setScissorTest:kt,activeTexture:ot,bindTexture:gt,unbindTexture:U,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:Ye,texImage3D:Me,updateUBOMapping:ct,uniformBlockBinding:We,texStorage2D:De,texStorage3D:nt,texSubImage2D:he,texSubImage3D:ge,compressedTexSubImage2D:ae,compressedTexSubImage3D:Qe,scissor:Ce,viewport:ht,reset:dt}}function Av(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ue,d=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(U,A){return m?new OffscreenCanvas(U,A):No("canvas")}function M(U,A,J){let he=1;const ge=gt(U);if((ge.width>J||ge.height>J)&&(he=J/Math.max(ge.width,ge.height)),he<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ae=Math.floor(he*ge.width),Qe=Math.floor(he*ge.height);f===void 0&&(f=x(ae,Qe));const De=A?x(ae,Qe):f;return De.width=ae,De.height=Qe,De.getContext("2d").drawImage(U,0,0,ae,Qe),mt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+ae+"x"+Qe+")."),De}else return"data"in U&&mt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),U;return U}function g(U){return U.generateMipmaps}function u(U){n.generateMipmap(U)}function y(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(U,A,J,he,ge=!1){if(U!==null){if(n[U]!==void 0)return n[U];mt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ae=A;if(A===n.RED&&(J===n.FLOAT&&(ae=n.R32F),J===n.HALF_FLOAT&&(ae=n.R16F),J===n.UNSIGNED_BYTE&&(ae=n.R8)),A===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.R8UI),J===n.UNSIGNED_SHORT&&(ae=n.R16UI),J===n.UNSIGNED_INT&&(ae=n.R32UI),J===n.BYTE&&(ae=n.R8I),J===n.SHORT&&(ae=n.R16I),J===n.INT&&(ae=n.R32I)),A===n.RG&&(J===n.FLOAT&&(ae=n.RG32F),J===n.HALF_FLOAT&&(ae=n.RG16F),J===n.UNSIGNED_BYTE&&(ae=n.RG8)),A===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RG8UI),J===n.UNSIGNED_SHORT&&(ae=n.RG16UI),J===n.UNSIGNED_INT&&(ae=n.RG32UI),J===n.BYTE&&(ae=n.RG8I),J===n.SHORT&&(ae=n.RG16I),J===n.INT&&(ae=n.RG32I)),A===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGB8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGB16UI),J===n.UNSIGNED_INT&&(ae=n.RGB32UI),J===n.BYTE&&(ae=n.RGB8I),J===n.SHORT&&(ae=n.RGB16I),J===n.INT&&(ae=n.RGB32I)),A===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGBA16UI),J===n.UNSIGNED_INT&&(ae=n.RGBA32UI),J===n.BYTE&&(ae=n.RGBA8I),J===n.SHORT&&(ae=n.RGBA16I),J===n.INT&&(ae=n.RGBA32I)),A===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(ae=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(ae=n.R11F_G11F_B10F)),A===n.RGBA){const Qe=ge?Fo:It.getTransfer(he);J===n.FLOAT&&(ae=n.RGBA32F),J===n.HALF_FLOAT&&(ae=n.RGBA16F),J===n.UNSIGNED_BYTE&&(ae=Qe===Ht?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(ae=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(ae=n.RGB5_A1)}return(ae===n.R16F||ae===n.R32F||ae===n.RG16F||ae===n.RG32F||ae===n.RGBA16F||ae===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function _(U,A){let J;return U?A===null||A===Hs||A===Mr?J=n.DEPTH24_STENCIL8:A===Ci?J=n.DEPTH32F_STENCIL8:A===vr&&(J=n.DEPTH24_STENCIL8,mt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Hs||A===Mr?J=n.DEPTH_COMPONENT24:A===Ci?J=n.DEPTH_COMPONENT32F:A===vr&&(J=n.DEPTH_COMPONENT16),J}function E(U,A){return g(U)===!0||U.isFramebufferTexture&&U.minFilter!==$n&&U.minFilter!==ni?Math.log2(Math.max(A.width,A.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?A.mipmaps.length:1}function T(U){const A=U.target;A.removeEventListener("dispose",T),C(A),A.isVideoTexture&&d.delete(A)}function R(U){const A=U.target;A.removeEventListener("dispose",R),b(A)}function C(U){const A=i.get(U);if(A.__webglInit===void 0)return;const J=U.source,he=p.get(J);if(he){const ge=he[A.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&S(U),Object.keys(he).length===0&&p.delete(J)}i.remove(U)}function S(U){const A=i.get(U);n.deleteTexture(A.__webglTexture);const J=U.source,he=p.get(J);delete he[A.__cacheKey],r.memory.textures--}function b(U){const A=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let he=0;he<6;he++){if(Array.isArray(A.__webglFramebuffer[he]))for(let ge=0;ge<A.__webglFramebuffer[he].length;ge++)n.deleteFramebuffer(A.__webglFramebuffer[he][ge]);else n.deleteFramebuffer(A.__webglFramebuffer[he]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[he])}else{if(Array.isArray(A.__webglFramebuffer))for(let he=0;he<A.__webglFramebuffer.length;he++)n.deleteFramebuffer(A.__webglFramebuffer[he]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let he=0;he<A.__webglColorRenderbuffer.length;he++)A.__webglColorRenderbuffer[he]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[he]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=U.textures;for(let he=0,ge=J.length;he<ge;he++){const ae=i.get(J[he]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),r.memory.textures--),i.remove(J[he])}i.remove(U)}let L=0;function I(){L=0}function V(){const U=L;return U>=s.maxTextures&&mt("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),L+=1,U}function j(U){const A=[];return A.push(U.wrapS),A.push(U.wrapT),A.push(U.wrapR||0),A.push(U.magFilter),A.push(U.minFilter),A.push(U.anisotropy),A.push(U.internalFormat),A.push(U.format),A.push(U.type),A.push(U.generateMipmaps),A.push(U.premultiplyAlpha),A.push(U.flipY),A.push(U.unpackAlignment),A.push(U.colorSpace),A.join()}function te(U,A){const J=i.get(U);if(U.isVideoTexture&&kt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&J.__version!==U.version){const he=U.image;if(he===null)mt("WebGLRenderer: Texture marked for update but no image data found.");else if(he.complete===!1)mt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,U,A);return}}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+A)}function q(U,A){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,A);return}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+A)}function Z(U,A){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,A);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+A)}function ne(U,A){const J=i.get(U);if(U.version>0&&J.__version!==U.version){K(J,U,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+A)}const fe={[Un]:n.REPEAT,[Zi]:n.CLAMP_TO_EDGE,[xc]:n.MIRRORED_REPEAT},ve={[$n]:n.NEAREST,[op]:n.NEAREST_MIPMAP_NEAREST,[Wr]:n.NEAREST_MIPMAP_LINEAR,[ni]:n.LINEAR,[fl]:n.LINEAR_MIPMAP_NEAREST,[zs]:n.LINEAR_MIPMAP_LINEAR},qe={[dp]:n.NEVER,[gp]:n.ALWAYS,[up]:n.LESS,[nf]:n.LEQUAL,[fp]:n.EQUAL,[xp]:n.GEQUAL,[pp]:n.GREATER,[mp]:n.NOTEQUAL};function D(U,A){if(A.type===Ci&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===ni||A.magFilter===fl||A.magFilter===Wr||A.magFilter===zs||A.minFilter===ni||A.minFilter===fl||A.minFilter===Wr||A.minFilter===zs)&&mt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,fe[A.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,fe[A.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,fe[A.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,ve[A.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,ve[A.minFilter]),A.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,qe[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===$n||A.minFilter!==Wr&&A.minFilter!==zs||A.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(U,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Le(U,A){let J=!1;U.__webglInit===void 0&&(U.__webglInit=!0,A.addEventListener("dispose",T));const he=A.source;let ge=p.get(he);ge===void 0&&(ge={},p.set(he,ge));const ae=j(A);if(ae!==U.__cacheKey){ge[ae]===void 0&&(ge[ae]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,J=!0),ge[ae].usedTimes++;const Qe=ge[U.__cacheKey];Qe!==void 0&&(ge[U.__cacheKey].usedTimes--,Qe.usedTimes===0&&S(A)),U.__cacheKey=ae,U.__webglTexture=ge[ae].texture}return J}function _e(U,A,J){return Math.floor(Math.floor(U/J)/A)}function Ee(U,A,J,he){const ae=U.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,J,he,A.data);else{ae.sort((Me,Ce)=>Me.start-Ce.start);let Qe=0;for(let Me=1;Me<ae.length;Me++){const Ce=ae[Qe],ht=ae[Me],ct=Ce.start+Ce.count,We=_e(ht.start,A.width,4),dt=_e(Ce.start,A.width,4);ht.start<=ct+1&&We===dt&&_e(ht.start+ht.count-1,A.width,4)===We?Ce.count=Math.max(Ce.count,ht.start+ht.count-Ce.start):(++Qe,ae[Qe]=ht)}ae.length=Qe+1;const De=n.getParameter(n.UNPACK_ROW_LENGTH),nt=n.getParameter(n.UNPACK_SKIP_PIXELS),Ye=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let Me=0,Ce=ae.length;Me<Ce;Me++){const ht=ae[Me],ct=Math.floor(ht.start/4),We=Math.ceil(ht.count/4),dt=ct%A.width,H=Math.floor(ct/A.width),Ge=We,Oe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,dt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,dt,H,Ge,Oe,J,he,A.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,De),n.pixelStorei(n.UNPACK_SKIP_PIXELS,nt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ye)}}function $(U,A,J){let he=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(he=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(he=n.TEXTURE_3D);const ge=Le(U,A),ae=A.source;t.bindTexture(he,U.__webglTexture,n.TEXTURE0+J);const Qe=i.get(ae);if(ae.version!==Qe.__version||ge===!0){t.activeTexture(n.TEXTURE0+J);const De=It.getPrimaries(It.workingColorSpace),nt=A.colorSpace===us?null:It.getPrimaries(A.colorSpace),Ye=A.colorSpace===us||De===nt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let Me=M(A.image,!1,s.maxTextureSize);Me=ot(A,Me);const Ce=a.convert(A.format,A.colorSpace),ht=a.convert(A.type);let ct=v(A.internalFormat,Ce,ht,A.colorSpace,A.isVideoTexture);D(he,A);let We;const dt=A.mipmaps,H=A.isVideoTexture!==!0,Ge=Qe.__version===void 0||ge===!0,Oe=ae.dataReady,Fe=E(A,Me);if(A.isDepthTexture)ct=_(A.format===yr,A.type),Ge&&(H?t.texStorage2D(n.TEXTURE_2D,1,ct,Me.width,Me.height):t.texImage2D(n.TEXTURE_2D,0,ct,Me.width,Me.height,0,Ce,ht,null));else if(A.isDataTexture)if(dt.length>0){H&&Ge&&t.texStorage2D(n.TEXTURE_2D,Fe,ct,dt[0].width,dt[0].height);for(let we=0,pe=dt.length;we<pe;we++)We=dt[we],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,we,0,0,We.width,We.height,Ce,ht,We.data):t.texImage2D(n.TEXTURE_2D,we,ct,We.width,We.height,0,Ce,ht,We.data);A.generateMipmaps=!1}else H?(Ge&&t.texStorage2D(n.TEXTURE_2D,Fe,ct,Me.width,Me.height),Oe&&Ee(A,Me,Ce,ht)):t.texImage2D(n.TEXTURE_2D,0,ct,Me.width,Me.height,0,Ce,ht,Me.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){H&&Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,ct,dt[0].width,dt[0].height,Me.depth);for(let we=0,pe=dt.length;we<pe;we++)if(We=dt[we],A.format!==mi)if(Ce!==null)if(H){if(Oe)if(A.layerUpdates.size>0){const Ke=Yd(We.width,We.height,A.format,A.type);for(const ut of A.layerUpdates){const Ot=We.data.subarray(ut*Ke/We.data.BYTES_PER_ELEMENT,(ut+1)*Ke/We.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,we,0,0,ut,We.width,We.height,1,Ce,Ot)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,we,0,0,0,We.width,We.height,Me.depth,Ce,We.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,we,ct,We.width,We.height,Me.depth,0,We.data,0,0);else mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Oe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,we,0,0,0,We.width,We.height,Me.depth,Ce,ht,We.data):t.texImage3D(n.TEXTURE_2D_ARRAY,we,ct,We.width,We.height,Me.depth,0,Ce,ht,We.data)}else{H&&Ge&&t.texStorage2D(n.TEXTURE_2D,Fe,ct,dt[0].width,dt[0].height);for(let we=0,pe=dt.length;we<pe;we++)We=dt[we],A.format!==mi?Ce!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_2D,we,0,0,We.width,We.height,Ce,We.data):t.compressedTexImage2D(n.TEXTURE_2D,we,ct,We.width,We.height,0,We.data):mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Oe&&t.texSubImage2D(n.TEXTURE_2D,we,0,0,We.width,We.height,Ce,ht,We.data):t.texImage2D(n.TEXTURE_2D,we,ct,We.width,We.height,0,Ce,ht,We.data)}else if(A.isDataArrayTexture)if(H){if(Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,ct,Me.width,Me.height,Me.depth),Oe)if(A.layerUpdates.size>0){const we=Yd(Me.width,Me.height,A.format,A.type);for(const pe of A.layerUpdates){const Ke=Me.data.subarray(pe*we/Me.data.BYTES_PER_ELEMENT,(pe+1)*we/Me.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,Me.width,Me.height,1,Ce,ht,Ke)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Me.width,Me.height,Me.depth,Ce,ht,Me.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,Me.width,Me.height,Me.depth,0,Ce,ht,Me.data);else if(A.isData3DTexture)H?(Ge&&t.texStorage3D(n.TEXTURE_3D,Fe,ct,Me.width,Me.height,Me.depth),Oe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Me.width,Me.height,Me.depth,Ce,ht,Me.data)):t.texImage3D(n.TEXTURE_3D,0,ct,Me.width,Me.height,Me.depth,0,Ce,ht,Me.data);else if(A.isFramebufferTexture){if(Ge)if(H)t.texStorage2D(n.TEXTURE_2D,Fe,ct,Me.width,Me.height);else{let we=Me.width,pe=Me.height;for(let Ke=0;Ke<Fe;Ke++)t.texImage2D(n.TEXTURE_2D,Ke,ct,we,pe,0,Ce,ht,null),we>>=1,pe>>=1}}else if(dt.length>0){if(H&&Ge){const we=gt(dt[0]);t.texStorage2D(n.TEXTURE_2D,Fe,ct,we.width,we.height)}for(let we=0,pe=dt.length;we<pe;we++)We=dt[we],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,we,0,0,Ce,ht,We):t.texImage2D(n.TEXTURE_2D,we,ct,Ce,ht,We);A.generateMipmaps=!1}else if(H){if(Ge){const we=gt(Me);t.texStorage2D(n.TEXTURE_2D,Fe,ct,we.width,we.height)}Oe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ce,ht,Me)}else t.texImage2D(n.TEXTURE_2D,0,ct,Ce,ht,Me);g(A)&&u(he),Qe.__version=ae.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function K(U,A,J){if(A.image.length!==6)return;const he=Le(U,A),ge=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+J);const ae=i.get(ge);if(ge.version!==ae.__version||he===!0){t.activeTexture(n.TEXTURE0+J);const Qe=It.getPrimaries(It.workingColorSpace),De=A.colorSpace===us?null:It.getPrimaries(A.colorSpace),nt=A.colorSpace===us||Qe===De?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);const Ye=A.isCompressedTexture||A.image[0].isCompressedTexture,Me=A.image[0]&&A.image[0].isDataTexture,Ce=[];for(let pe=0;pe<6;pe++)!Ye&&!Me?Ce[pe]=M(A.image[pe],!0,s.maxCubemapSize):Ce[pe]=Me?A.image[pe].image:A.image[pe],Ce[pe]=ot(A,Ce[pe]);const ht=Ce[0],ct=a.convert(A.format,A.colorSpace),We=a.convert(A.type),dt=v(A.internalFormat,ct,We,A.colorSpace),H=A.isVideoTexture!==!0,Ge=ae.__version===void 0||he===!0,Oe=ge.dataReady;let Fe=E(A,ht);D(n.TEXTURE_CUBE_MAP,A);let we;if(Ye){H&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,dt,ht.width,ht.height);for(let pe=0;pe<6;pe++){we=Ce[pe].mipmaps;for(let Ke=0;Ke<we.length;Ke++){const ut=we[Ke];A.format!==mi?ct!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,ut.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ut.data):mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,We,ut.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ct,We,ut.data)}}}else{if(we=A.mipmaps,H&&Ge){we.length>0&&Fe++;const pe=gt(Ce[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,dt,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Me){H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Ce[pe].width,Ce[pe].height,ct,We,Ce[pe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,Ce[pe].width,Ce[pe].height,0,ct,We,Ce[pe].data);for(let Ke=0;Ke<we.length;Ke++){const Ot=we[Ke].image[pe].image;H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,Ot.width,Ot.height,ct,We,Ot.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,Ot.width,Ot.height,0,ct,We,Ot.data)}}else{H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ct,We,Ce[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,ct,We,Ce[pe]);for(let Ke=0;Ke<we.length;Ke++){const ut=we[Ke];H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,ct,We,ut.image[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,ct,We,ut.image[pe])}}}g(A)&&u(n.TEXTURE_CUBE_MAP),ae.__version=ge.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function be(U,A,J,he,ge,ae){const Qe=a.convert(J.format,J.colorSpace),De=a.convert(J.type),nt=v(J.internalFormat,Qe,De,J.colorSpace),Ye=i.get(A),Me=i.get(J);if(Me.__renderTarget=A,!Ye.__hasExternalTextures){const Ce=Math.max(1,A.width>>ae),ht=Math.max(1,A.height>>ae);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,ae,nt,Ce,ht,A.depth,0,Qe,De,null):t.texImage2D(ge,ae,nt,Ce,ht,0,Qe,De,null)}t.bindFramebuffer(n.FRAMEBUFFER,U),Je(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,ge,Me.__webglTexture,0,zt(A)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,he,ge,Me.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ae(U,A,J){if(n.bindRenderbuffer(n.RENDERBUFFER,U),A.depthBuffer){const he=A.depthTexture,ge=he&&he.isDepthTexture?he.type:null,ae=_(A.stencilBuffer,ge),Qe=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,De=zt(A);Je(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,De,ae,A.width,A.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,De,ae,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,ae,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Qe,n.RENDERBUFFER,U)}else{const he=A.textures;for(let ge=0;ge<he.length;ge++){const ae=he[ge],Qe=a.convert(ae.format,ae.colorSpace),De=a.convert(ae.type),nt=v(ae.internalFormat,Qe,De,ae.colorSpace),Ye=zt(A);J&&Je(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ye,nt,A.width,A.height):Je(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ye,nt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,nt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(U,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,U),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const he=i.get(A.depthTexture);he.__renderTarget=A,(!he.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const ge=he.__webglTexture,ae=zt(A);if(A.depthTexture.format===_r)Je(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(A.depthTexture.format===yr)Je(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function tt(U){const A=i.get(U),J=U.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==U.depthTexture){const he=U.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),he){const ge=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,he.removeEventListener("dispose",ge)};he.addEventListener("dispose",ge),A.__depthDisposeCallback=ge}A.__boundDepthTexture=he}if(U.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const he=U.texture.mipmaps;he&&he.length>0?Be(A.__webglFramebuffer[0],U):Be(A.__webglFramebuffer,U)}else if(J){A.__webglDepthbuffer=[];for(let he=0;he<6;he++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[he]),A.__webglDepthbuffer[he]===void 0)A.__webglDepthbuffer[he]=n.createRenderbuffer(),Ae(A.__webglDepthbuffer[he],U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer[he];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}else{const he=U.texture.mipmaps;if(he&&he.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),Ae(A.__webglDepthbuffer,U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Nt(U,A,J){const he=i.get(U);A!==void 0&&be(he.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&tt(U)}function st(U){const A=U.texture,J=i.get(U),he=i.get(A);U.addEventListener("dispose",R);const ge=U.textures,ae=U.isWebGLCubeRenderTarget===!0,Qe=ge.length>1;if(Qe||(he.__webglTexture===void 0&&(he.__webglTexture=n.createTexture()),he.__version=A.version,r.memory.textures++),ae){J.__webglFramebuffer=[];for(let De=0;De<6;De++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[De]=[];for(let nt=0;nt<A.mipmaps.length;nt++)J.__webglFramebuffer[De][nt]=n.createFramebuffer()}else J.__webglFramebuffer[De]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let De=0;De<A.mipmaps.length;De++)J.__webglFramebuffer[De]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Qe)for(let De=0,nt=ge.length;De<nt;De++){const Ye=i.get(ge[De]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=n.createTexture(),r.memory.textures++)}if(U.samples>0&&Je(U)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let De=0;De<ge.length;De++){const nt=ge[De];J.__webglColorRenderbuffer[De]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[De]);const Ye=a.convert(nt.format,nt.colorSpace),Me=a.convert(nt.type),Ce=v(nt.internalFormat,Ye,Me,nt.colorSpace,U.isXRRenderTarget===!0),ht=zt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,Ce,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+De,n.RENDERBUFFER,J.__webglColorRenderbuffer[De])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Ae(J.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,he.__webglTexture),D(n.TEXTURE_CUBE_MAP,A);for(let De=0;De<6;De++)if(A.mipmaps&&A.mipmaps.length>0)for(let nt=0;nt<A.mipmaps.length;nt++)be(J.__webglFramebuffer[De][nt],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+De,nt);else be(J.__webglFramebuffer[De],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+De,0);g(A)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Qe){for(let De=0,nt=ge.length;De<nt;De++){const Ye=ge[De],Me=i.get(Ye);let Ce=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ce=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ce,Me.__webglTexture),D(Ce,Ye),be(J.__webglFramebuffer,U,Ye,n.COLOR_ATTACHMENT0+De,Ce,0),g(Ye)&&u(Ce)}t.unbindTexture()}else{let De=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(De=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(De,he.__webglTexture),D(De,A),A.mipmaps&&A.mipmaps.length>0)for(let nt=0;nt<A.mipmaps.length;nt++)be(J.__webglFramebuffer[nt],U,A,n.COLOR_ATTACHMENT0,De,nt);else be(J.__webglFramebuffer,U,A,n.COLOR_ATTACHMENT0,De,0);g(A)&&u(De),t.unbindTexture()}U.depthBuffer&&tt(U)}function Ft(U){const A=U.textures;for(let J=0,he=A.length;J<he;J++){const ge=A[J];if(g(ge)){const ae=y(U),Qe=i.get(ge).__webglTexture;t.bindTexture(ae,Qe),u(ae),t.unbindTexture()}}}const B=[],yt=[];function vt(U){if(U.samples>0){if(Je(U)===!1){const A=U.textures,J=U.width,he=U.height;let ge=n.COLOR_BUFFER_BIT;const ae=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Qe=i.get(U),De=A.length>1;if(De)for(let Ye=0;Ye<A.length;Ye++)t.bindFramebuffer(n.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Qe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer);const nt=U.texture.mipmaps;nt&&nt.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer);for(let Ye=0;Ye<A.length;Ye++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),De){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Qe.__webglColorRenderbuffer[Ye]);const Me=i.get(A[Ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Me,0)}n.blitFramebuffer(0,0,J,he,0,0,J,he,ge,n.NEAREST),c===!0&&(B.length=0,yt.length=0,B.push(n.COLOR_ATTACHMENT0+Ye),U.depthBuffer&&U.resolveDepthBuffer===!1&&(B.push(ae),yt.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,yt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),De)for(let Ye=0;Ye<A.length;Ye++){t.bindFramebuffer(n.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,Qe.__webglColorRenderbuffer[Ye]);const Me=i.get(A[Ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Qe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,Me,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const A=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function zt(U){return Math.min(s.maxSamples,U.samples)}function Je(U){const A=i.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function kt(U){const A=r.render.frame;d.get(U)!==A&&(d.set(U,A),U.update())}function ot(U,A){const J=U.colorSpace,he=U.format,ge=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||J!==Ra&&J!==us&&(It.getTransfer(J)===Ht?(he!==mi||ge!==Ni)&&mt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tn("WebGLTextures: Unsupported texture color space:",J)),A}function gt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=I,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=ne,this.rebindTextures=Nt,this.setupRenderTarget=st,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Je}function Cv(n,e){function t(i,s=us){let a;const r=It.getTransfer(s);if(i===Ni)return n.UNSIGNED_BYTE;if(i===gh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===vh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ju)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Qu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ku)return n.BYTE;if(i===Ju)return n.SHORT;if(i===vr)return n.UNSIGNED_SHORT;if(i===xh)return n.INT;if(i===Hs)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===Di)return n.HALF_FLOAT;if(i===ef)return n.ALPHA;if(i===tf)return n.RGB;if(i===mi)return n.RGBA;if(i===_r)return n.DEPTH_COMPONENT;if(i===yr)return n.DEPTH_STENCIL;if(i===Mh)return n.RED;if(i===_h)return n.RED_INTEGER;if(i===yh)return n.RG;if(i===bh)return n.RG_INTEGER;if(i===wh)return n.RGBA_INTEGER;if(i===Eo||i===Ao||i===Co||i===Ro)if(r===Ht)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Eo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ao)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Co)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ro)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Eo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ao)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Co)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ro)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gc||i===vc||i===Mc||i===_c)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===gc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Mc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_c)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yc||i===bc||i===wc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===yc||i===bc)return r===Ht?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===wc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Sc||i===Tc||i===Ec||i===Ac||i===Cc||i===Rc||i===Pc||i===Lc||i===Dc||i===Ic||i===Uc||i===Fc||i===zc||i===Nc)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Sc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Tc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ec)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ac)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Rc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Lc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ic)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===zc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Nc)return r===Ht?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Oc||i===Bc||i===kc)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===Oc)return r===Ht?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Bc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===kc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vc||i===Gc||i===Hc||i===Wc)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===Vc)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Gc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Hc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Mr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Rv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pv=`
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

}`;class Lv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new xf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new bn({vertexShader:Rv,fragmentShader:Pv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new O(new Zt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Dv extends Ua{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,h=null,d=null,f=null,p=null,m=null,x=null;const M=typeof XRWebGLBinding<"u",g=new Lv,u={},y=t.getContextAttributes();let v=null,_=null;const E=[],T=[],R=new Ue;let C=null;const S=new qn;S.viewport=new Xt;const b=new qn;b.viewport=new Xt;const L=[S,b],I=new Km;let V=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new Ul,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new Ul,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new Ul,E[$]=K),K.getHandSpace()};function te($){const K=T.indexOf($.inputSource);if(K===-1)return;const be=E[K];be!==void 0&&(be.update($.inputSource,$.frame,h||r),be.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}V=null,j=null,g.reset();for(const $ in u)delete u[$];e.setRenderTarget(v),m=null,p=null,f=null,s=null,_=null,Ee.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&mt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&mt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),y.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,Ae=null,Be=null;y.depth&&(Be=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=y.stencil?yr:_r,Ae=y.stencil?Mr:Hs);const tt={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:a};f=this.getBinding(),p=f.createProjectionLayer(tt),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new gi(p.textureWidth,p.textureHeight,{format:mi,type:Ni,depthTexture:new mf(p.textureWidth,p.textureHeight,Ae,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const be={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new gi(m.framebufferWidth,m.framebufferHeight,{format:mi,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(o),Ee.setContext(s),Ee.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z($){for(let K=0;K<$.removed.length;K++){const be=$.removed[K],Ae=T.indexOf(be);Ae>=0&&(T[Ae]=null,E[Ae].disconnect(be))}for(let K=0;K<$.added.length;K++){const be=$.added[K];let Ae=T.indexOf(be);if(Ae===-1){for(let tt=0;tt<E.length;tt++)if(tt>=T.length){T.push(be),Ae=tt;break}else if(T[tt]===null){T[tt]=be,Ae=tt;break}if(Ae===-1)break}const Be=E[Ae];Be&&Be.connect(be)}}const ne=new P,fe=new P;function ve($,K,be){ne.setFromMatrixPosition(K.matrixWorld),fe.setFromMatrixPosition(be.matrixWorld);const Ae=ne.distanceTo(fe),Be=K.projectionMatrix.elements,tt=be.projectionMatrix.elements,Nt=Be[14]/(Be[10]-1),st=Be[14]/(Be[10]+1),Ft=(Be[9]+1)/Be[5],B=(Be[9]-1)/Be[5],yt=(Be[8]-1)/Be[0],vt=(tt[8]+1)/tt[0],zt=Nt*yt,Je=Nt*vt,kt=Ae/(-yt+vt),ot=kt*-yt;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(kt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Be[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const gt=Nt+kt,U=st+kt,A=zt-ot,J=Je+(Ae-ot),he=Ft*st/U*gt,ge=B*st/U*gt;$.projectionMatrix.makePerspective(A,J,he,ge,gt,U),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function qe($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,be=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(be=g.depthFar)),I.near=b.near=S.near=K,I.far=b.far=S.far=be,(V!==I.near||j!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),V=I.near,j=I.far),I.layers.mask=$.layers.mask|6,S.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const Ae=$.parent,Be=I.cameras;qe(I,Ae);for(let tt=0;tt<Be.length;tt++)qe(Be[tt],Ae);Be.length===2?ve(I,S,b):I.projectionMatrix.copy(S.projectionMatrix),D($,I,Ae)};function D($,K,be){be===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(be.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=wr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function($){return u[$]};let Le=null;function _e($,K){if(d=K.getViewerPose(h||r),x=K,d!==null){const be=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let Ae=!1;be.length!==I.cameras.length&&(I.cameras.length=0,Ae=!0);for(let st=0;st<be.length;st++){const Ft=be[st];let B=null;if(m!==null)B=m.getViewport(Ft);else{const vt=f.getViewSubImage(p,Ft);B=vt.viewport,st===0&&(e.setRenderTargetTextures(_,vt.colorTexture,vt.depthStencilTexture),e.setRenderTarget(_))}let yt=L[st];yt===void 0&&(yt=new qn,yt.layers.enable(st),yt.viewport=new Xt,L[st]=yt),yt.matrix.fromArray(Ft.transform.matrix),yt.matrix.decompose(yt.position,yt.quaternion,yt.scale),yt.projectionMatrix.fromArray(Ft.projectionMatrix),yt.projectionMatrixInverse.copy(yt.projectionMatrix).invert(),yt.viewport.set(B.x,B.y,B.width,B.height),st===0&&(I.matrix.copy(yt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ae===!0&&I.cameras.push(yt)}const Be=s.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=i.getBinding();const st=f.getDepthInformation(be[0]);st&&st.isValid&&st.texture&&g.init(st,s.renderState)}if(Be&&Be.includes("camera-access")&&M){e.state.unbindTexture(),f=i.getBinding();for(let st=0;st<be.length;st++){const Ft=be[st].camera;if(Ft){let B=u[Ft];B||(B=new xf,u[Ft]=B);const yt=f.getCameraImage(Ft);B.sourceTexture=yt}}}}for(let be=0;be<E.length;be++){const Ae=T[be],Be=E[be];Ae!==null&&Be!==void 0&&Be.update(Ae,K,h||r)}Le&&Le($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Ee=new Af;Ee.setAnimationLoop(_e),this.setAnimationLoop=function($){Le=$},this.dispose=function(){}}}const Rs=new vi,Iv=new Et;function Uv(n,e){function t(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,cf(n)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function s(g,u,y,v,_){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(g,u):u.isMeshToonMaterial?(a(g,u),f(g,u)):u.isMeshPhongMaterial?(a(g,u),d(g,u)):u.isMeshStandardMaterial?(a(g,u),p(g,u),u.isMeshPhysicalMaterial&&m(g,u,_)):u.isMeshMatcapMaterial?(a(g,u),x(g,u)):u.isMeshDepthMaterial?a(g,u):u.isMeshDistanceMaterial?(a(g,u),M(g,u)):u.isMeshNormalMaterial?a(g,u):u.isLineBasicMaterial?(r(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,y,v):u.isSpriteMaterial?h(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,t(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===Dn&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,t(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===Dn&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,t(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,t(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const y=e.get(u),v=y.envMap,_=y.envMapRotation;v&&(g.envMap.value=v,Rs.copy(_),Rs.x*=-1,Rs.y*=-1,Rs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Rs.y*=-1,Rs.z*=-1),g.envMapRotation.value.setFromMatrix4(Iv.makeRotationFromEuler(Rs)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,g.aoMapTransform))}function r(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,y,v){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*y,g.scale.value=v*.5,u.map&&(g.map.value=u.map,t(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function d(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function f(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function p(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,y){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Dn&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function M(g,u){const y=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Fv(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function h(y,v){let _=s[y.id];_===void 0&&(x(y),_=d(y),s[y.id]=_,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;a[y.id]!==T&&(p(y),a[y.id]=T)}function d(y){const v=f();y.__bindingPointIndex=v;const _=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function f(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return tn("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(y){const v=s[y.id],_=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,R=_.length;T<R;T++){const C=Array.isArray(_[T])?_[T]:[_[T]];for(let S=0,b=C.length;S<b;S++){const L=C[S];if(m(L,T,S,E)===!0){const I=L.__offset,V=Array.isArray(L.value)?L.value:[L.value];let j=0;for(let te=0;te<V.length;te++){const q=V[te],Z=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,I+j,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,j),j+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,_,E){const T=y.value,R=v+"_"+_;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const C=E[R];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[R]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function x(y){const v=y.uniforms;let _=0;const E=16;for(let R=0,C=v.length;R<C;R++){const S=Array.isArray(v[R])?v[R]:[v[R]];for(let b=0,L=S.length;b<L;b++){const I=S[b],V=Array.isArray(I.value)?I.value:[I.value];for(let j=0,te=V.length;j<te;j++){const q=V[j],Z=M(q),ne=_%E,fe=ne%Z.boundary,ve=ne+fe;_+=fe,ve!==0&&E-ve<Z.storage&&(_+=E-ve),I.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=Z.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function M(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?mt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):mt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const _=r.indexOf(v.__bindingPointIndex);r.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function u(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:u}}const zv=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Xi=null;function Nv(){return Xi===null&&(Xi=new pf(zv,32,32,yh,Di),Xi.minFilter=ni,Xi.magFilter=ni,Xi.wrapS=Zi,Xi.wrapT=Zi,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}class Ov{constructor(e={}){const{canvas:t=vp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const x=new Set([wh,bh,_h]),M=new Set([Ni,Hs,vr,Mr,gh,vh]),g=new Uint32Array(4),u=new Int32Array(4);let y=null,v=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=xs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let R=!1;this._outputColorSpace=Lt;let C=0,S=0,b=null,L=-1,I=null;const V=new Xt,j=new Xt;let te=null;const q=new rt(0);let Z=0,ne=t.width,fe=t.height,ve=1,qe=null,D=null;const Le=new Xt(0,0,ne,fe),_e=new Xt(0,0,ne,fe);let Ee=!1;const $=new Lh;let K=!1,be=!1;const Ae=new Et,Be=new P,tt=new Xt,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function Ft(){return b===null?ve:1}let B=i;function yt(w,F){return t.getContext(w,F)}try{const w={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${fh}`),t.addEventListener("webglcontextlost",we,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",Ke,!1),B===null){const F="webgl2";if(B=yt(F,w),B===null)throw yt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let vt,zt,Je,kt,ot,gt,U,A,J,he,ge,ae,Qe,De,nt,Ye,Me,Ce,ht,ct,We,dt,H,Ge;function Oe(){vt=new q1(B),vt.init(),dt=new Cv(B,vt),zt=new N1(B,vt,e,dt),Je=new Ev(B,vt),zt.reversedDepthBuffer&&p&&Je.buffers.depth.setReversed(!0),kt=new Z1(B),ot=new fv,gt=new Av(B,vt,Je,ot,zt,dt,kt),U=new B1(T),A=new X1(T),J=new Qm(B),H=new F1(B,J),he=new Y1(B,J,kt,H),ge=new J1(B,he,J,kt),ht=new K1(B,zt,gt),Ye=new O1(ot),ae=new uv(T,U,A,vt,zt,H,Ye),Qe=new Uv(T,ot),De=new mv,nt=new yv(vt),Ce=new U1(T,U,A,Je,ge,m,c),Me=new Sv(T,ge,zt),Ge=new Fv(B,kt,zt,Je),ct=new z1(B,vt,kt),We=new $1(B,vt,kt),kt.programs=ae.programs,T.capabilities=zt,T.extensions=vt,T.properties=ot,T.renderLists=De,T.shadowMap=Me,T.state=Je,T.info=kt}Oe();const Fe=new Dv(T,B);this.xr=Fe,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const w=vt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=vt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(w){w!==void 0&&(ve=w,this.setSize(ne,fe,!1))},this.getSize=function(w){return w.set(ne,fe)},this.setSize=function(w,F,G=!0){if(Fe.isPresenting){mt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=w,fe=F,t.width=Math.floor(w*ve),t.height=Math.floor(F*ve),G===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(ne*ve,fe*ve).floor()},this.setDrawingBufferSize=function(w,F,G){ne=w,fe=F,ve=G,t.width=Math.floor(w*G),t.height=Math.floor(F*G),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(V)},this.getViewport=function(w){return w.copy(Le)},this.setViewport=function(w,F,G,X){w.isVector4?Le.set(w.x,w.y,w.z,w.w):Le.set(w,F,G,X),Je.viewport(V.copy(Le).multiplyScalar(ve).round())},this.getScissor=function(w){return w.copy(_e)},this.setScissor=function(w,F,G,X){w.isVector4?_e.set(w.x,w.y,w.z,w.w):_e.set(w,F,G,X),Je.scissor(j.copy(_e).multiplyScalar(ve).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(w){Je.setScissorTest(Ee=w)},this.setOpaqueSort=function(w){qe=w},this.setTransparentSort=function(w){D=w},this.getClearColor=function(w){return w.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,G=!0){let X=0;if(w){let k=!1;if(b!==null){const oe=b.texture.format;k=x.has(oe)}if(k){const oe=b.texture.type,re=M.has(oe),Q=Ce.getClearColor(),de=Ce.getClearAlpha(),Re=Q.r,Ve=Q.g,Pe=Q.b;re?(g[0]=Re,g[1]=Ve,g[2]=Pe,g[3]=de,B.clearBufferuiv(B.COLOR,0,g)):(u[0]=Re,u[1]=Ve,u[2]=Pe,u[3]=de,B.clearBufferiv(B.COLOR,0,u))}else X|=B.COLOR_BUFFER_BIT}F&&(X|=B.DEPTH_BUFFER_BIT),G&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",we,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",Ke,!1),Ce.dispose(),De.dispose(),nt.dispose(),ot.dispose(),U.dispose(),A.dispose(),ge.dispose(),H.dispose(),Ge.dispose(),ae.dispose(),Fe.dispose(),Fe.removeEventListener("sessionstart",Vr),Fe.removeEventListener("sessionend",ka),_i.stop()};function we(w){w.preventDefault(),Oo("WebGLRenderer: Context Lost."),R=!0}function pe(){Oo("WebGLRenderer: Context Restored."),R=!1;const w=kt.autoReset,F=Me.enabled,G=Me.autoUpdate,X=Me.needsUpdate,k=Me.type;Oe(),kt.autoReset=w,Me.enabled=F,Me.autoUpdate=G,Me.needsUpdate=X,Me.type=k}function Ke(w){tn("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ut(w){const F=w.target;F.removeEventListener("dispose",ut),Ot(F)}function Ot(w){Dt(w),ot.remove(w)}function Dt(w){const F=ot.get(w).programs;F!==void 0&&(F.forEach(function(G){ae.releaseProgram(G)}),w.isShaderMaterial&&ae.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,G,X,k,oe){F===null&&(F=Nt);const re=k.isMesh&&k.matrixWorld.determinant()<0,Q=z(w,F,G,X,k);Je.setMaterial(X,re);let de=G.index,Re=1;if(X.wireframe===!0){if(de=he.getWireframeAttribute(G),de===void 0)return;Re=2}const Ve=G.drawRange,Pe=G.attributes.position;let ze=Ve.start*Re,ft=(Ve.start+Ve.count)*Re;oe!==null&&(ze=Math.max(ze,oe.start*Re),ft=Math.min(ft,(oe.start+oe.count)*Re)),de!==null?(ze=Math.max(ze,0),ft=Math.min(ft,de.count)):Pe!=null&&(ze=Math.max(ze,0),ft=Math.min(ft,Pe.count));const bt=ft-ze;if(bt<0||bt===1/0)return;H.setup(k,X,Q,G,de);let Ct,wt=ct;if(de!==null&&(Ct=J.get(de),wt=We,wt.setIndex(Ct)),k.isMesh)X.wireframe===!0?(Je.setLineWidth(X.wireframeLinewidth*Ft()),wt.setMode(B.LINES)):wt.setMode(B.TRIANGLES);else if(k.isLine){let $e=X.linewidth;$e===void 0&&($e=1),Je.setLineWidth($e*Ft()),k.isLineSegments?wt.setMode(B.LINES):k.isLineLoop?wt.setMode(B.LINE_LOOP):wt.setMode(B.LINE_STRIP)}else k.isPoints?wt.setMode(B.POINTS):k.isSprite&&wt.setMode(B.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)br("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),wt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(vt.get("WEBGL_multi_draw"))wt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const $e=k._multiDrawStarts,Pt=k._multiDrawCounts,pt=k._multiDrawCount,Jt=de?J.get(de).bytesPerElement:1,Bi=ot.get(X).currentProgram.getUniforms();for(let Qt=0;Qt<pt;Qt++)Bi.setValue(B,"_gl_DrawID",Qt),wt.render($e[Qt]/Jt,Pt[Qt])}else if(k.isInstancedMesh)wt.renderInstances(ze,bt,k.count);else if(G.isInstancedBufferGeometry){const $e=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Pt=Math.min(G.instanceCount,$e);wt.renderInstances(ze,bt,Pt)}else wt.render(ze,bt)};function Fn(w,F,G){w.transparent===!0&&w.side===Mt&&w.forceSinglePass===!1?(w.side=Dn,w.needsUpdate=!0,un(w,F,G),w.side=Ms,w.needsUpdate=!0,un(w,F,G),w.side=Mt):un(w,F,G)}this.compile=function(w,F,G=null){G===null&&(G=w),v=nt.get(G),v.init(F),E.push(v),G.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),w!==G&&w.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),v.setupLights();const X=new Set;return w.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const oe=k.material;if(oe)if(Array.isArray(oe))for(let re=0;re<oe.length;re++){const Q=oe[re];Fn(Q,G,k),X.add(Q)}else Fn(oe,G,k),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(w,F,G=null){const X=this.compile(w,F,G);return new Promise(k=>{function oe(){if(X.forEach(function(re){ot.get(re).currentProgram.isReady()&&X.delete(re)}),X.size===0){k(w);return}setTimeout(oe,10)}vt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let En=null;function ai(w){En&&En(w)}function Vr(){_i.stop()}function ka(){_i.start()}const _i=new Af;_i.setAnimationLoop(ai),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(w){En=w,Fe.setAnimationLoop(w),w===null?_i.stop():_i.start()},Fe.addEventListener("sessionstart",Vr),Fe.addEventListener("sessionend",ka),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){tn("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Fe.enabled===!0&&Fe.isPresenting===!0&&(Fe.cameraAutoUpdate===!0&&Fe.updateCamera(F),F=Fe.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,F,b),v=nt.get(w,E.length),v.init(F),E.push(v),Ae.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Ae,Ri,F.reversedDepth),be=this.localClippingEnabled,K=Ye.init(this.clippingPlanes,be),y=De.get(w,_.length),y.init(),_.push(y),Fe.enabled===!0&&Fe.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&yi(oe,F,-1/0,T.sortObjects)}yi(w,F,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort(qe,D),st=Fe.enabled===!1||Fe.isPresenting===!1||Fe.hasDepthSensing()===!1,st&&Ce.addToRenderList(y,w),this.info.render.frame++,K===!0&&Ye.beginShadows();const G=v.state.shadowsArray;Me.render(G,w,F),K===!0&&Ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,k=y.transmissive;if(v.setupLights(),F.isArrayCamera){const oe=F.cameras;if(k.length>0)for(let re=0,Q=oe.length;re<Q;re++){const de=oe[re];Va(X,k,w,de)}st&&Ce.render(w);for(let re=0,Q=oe.length;re<Q;re++){const de=oe[re];bi(y,w,de,de.viewport)}}else k.length>0&&Va(X,k,w,F),st&&Ce.render(w),bi(y,w,F);b!==null&&S===0&&(gt.updateMultisampleRenderTarget(b),gt.updateRenderTargetMipmap(b)),w.isScene===!0&&w.onAfterRender(T,w,F),H.resetDefaultState(),L=-1,I=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&Ye.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?y=_[_.length-1]:y=null};function yi(w,F,G,X){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){X&&tt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ae);const re=ge.update(w),Q=w.material;Q.visible&&y.push(w,re,Q,G,tt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){const re=ge.update(w),Q=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),tt.copy(w.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),tt.copy(re.boundingSphere.center)),tt.applyMatrix4(w.matrixWorld).applyMatrix4(Ae)),Array.isArray(Q)){const de=re.groups;for(let Re=0,Ve=de.length;Re<Ve;Re++){const Pe=de[Re],ze=Q[Pe.materialIndex];ze&&ze.visible&&y.push(w,re,ze,G,tt.z,Pe)}}else Q.visible&&y.push(w,re,Q,G,tt.z,null)}}const oe=w.children;for(let re=0,Q=oe.length;re<Q;re++)yi(oe[re],F,G,X)}function bi(w,F,G,X){const{opaque:k,transmissive:oe,transparent:re}=w;v.setupLightsView(G),K===!0&&Ye.setGlobalState(T.clippingPlanes,G),X&&Je.viewport(V.copy(X)),k.length>0&&Ks(k,F,G),oe.length>0&&Ks(oe,F,G),re.length>0&&Ks(re,F,G),Je.buffers.depth.setTest(!0),Je.buffers.depth.setMask(!0),Je.buffers.color.setMask(!0),Je.setPolygonOffset(!1)}function Va(w,F,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new gi(1,1,{generateMipmaps:!0,type:vt.has("EXT_color_buffer_half_float")||vt.has("EXT_color_buffer_float")?Di:Ni,minFilter:zs,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:It.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],re=X.viewport||V;oe.setSize(re.z*T.transmissionResolutionScale,re.w*T.transmissionResolutionScale);const Q=T.getRenderTarget(),de=T.getActiveCubeFace(),Re=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),Z=T.getClearAlpha(),Z<1&&T.setClearColor(16777215,.5),T.clear(),st&&Ce.render(G);const Ve=T.toneMapping;T.toneMapping=xs;const Pe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&Ye.setGlobalState(T.clippingPlanes,X),Ks(w,G,X),gt.updateMultisampleRenderTarget(oe),gt.updateRenderTargetMipmap(oe),vt.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let ft=0,bt=F.length;ft<bt;ft++){const Ct=F[ft],{object:wt,geometry:$e,material:Pt,group:pt}=Ct;if(Pt.side===Mt&&wt.layers.test(X.layers)){const Jt=Pt.side;Pt.side=Dn,Pt.needsUpdate=!0,Gr(wt,G,X,$e,Pt,pt),Pt.side=Jt,Pt.needsUpdate=!0,ze=!0}}ze===!0&&(gt.updateMultisampleRenderTarget(oe),gt.updateRenderTargetMipmap(oe))}T.setRenderTarget(Q,de,Re),T.setClearColor(q,Z),Pe!==void 0&&(X.viewport=Pe),T.toneMapping=Ve}function Ks(w,F,G){const X=F.isScene===!0?F.overrideMaterial:null;for(let k=0,oe=w.length;k<oe;k++){const re=w[k],{object:Q,geometry:de,group:Re}=re;let Ve=re.material;Ve.allowOverride===!0&&X!==null&&(Ve=X),Q.layers.test(G.layers)&&Gr(Q,F,G,de,Ve,Re)}}function Gr(w,F,G,X,k,oe){w.onBeforeRender(T,F,G,X,k,oe),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),k.onBeforeRender(T,F,G,X,w,oe),k.transparent===!0&&k.side===Mt&&k.forceSinglePass===!1?(k.side=Dn,k.needsUpdate=!0,T.renderBufferDirect(G,F,X,k,w,oe),k.side=Ms,k.needsUpdate=!0,T.renderBufferDirect(G,F,X,k,w,oe),k.side=Mt):T.renderBufferDirect(G,F,X,k,w,oe),w.onAfterRender(T,F,G,X,k,oe)}function un(w,F,G){F.isScene!==!0&&(F=Nt);const X=ot.get(w),k=v.state.lights,oe=v.state.shadowsArray,re=k.state.version,Q=ae.getParameters(w,k.state,oe,F,G),de=ae.getProgramCacheKey(Q);let Re=X.programs;X.environment=w.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(w.isMeshStandardMaterial?A:U).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Re===void 0&&(w.addEventListener("dispose",ut),Re=new Map,X.programs=Re);let Ve=Re.get(de);if(Ve!==void 0){if(X.currentProgram===Ve&&X.lightsStateVersion===re)return Ga(w,Q),Ve}else Q.uniforms=ae.getUniforms(w),w.onBeforeCompile(Q,T),Ve=ae.acquireProgram(Q,de),Re.set(de,Ve),X.uniforms=Q.uniforms;const Pe=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pe.clippingPlanes=Ye.uniform),Ga(w,Q),X.needsLights=Y(w),X.lightsStateVersion=re,X.needsLights&&(Pe.ambientLightColor.value=k.state.ambient,Pe.lightProbe.value=k.state.probe,Pe.directionalLights.value=k.state.directional,Pe.directionalLightShadows.value=k.state.directionalShadow,Pe.spotLights.value=k.state.spot,Pe.spotLightShadows.value=k.state.spotShadow,Pe.rectAreaLights.value=k.state.rectArea,Pe.ltc_1.value=k.state.rectAreaLTC1,Pe.ltc_2.value=k.state.rectAreaLTC2,Pe.pointLights.value=k.state.point,Pe.pointLightShadows.value=k.state.pointShadow,Pe.hemisphereLights.value=k.state.hemi,Pe.directionalShadowMap.value=k.state.directionalShadowMap,Pe.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Pe.spotShadowMap.value=k.state.spotShadowMap,Pe.spotLightMatrix.value=k.state.spotLightMatrix,Pe.spotLightMap.value=k.state.spotLightMap,Pe.pointShadowMap.value=k.state.pointShadowMap,Pe.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=Ve,X.uniformsList=null,Ve}function Hr(w){if(w.uniformsList===null){const F=w.currentProgram.getUniforms();w.uniformsList=Po.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function Ga(w,F){const G=ot.get(w);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function z(w,F,G,X,k){F.isScene!==!0&&(F=Nt),gt.resetTextureUnits();const oe=F.fog,re=X.isMeshStandardMaterial?F.environment:null,Q=b===null?T.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Ra,de=(X.isMeshStandardMaterial?A:U).get(X.envMap||re),Re=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Pe=!!G.morphAttributes.position,ze=!!G.morphAttributes.normal,ft=!!G.morphAttributes.color;let bt=xs;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(bt=T.toneMapping);const Ct=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,wt=Ct!==void 0?Ct.length:0,$e=ot.get(X),Pt=v.state.lights;if(K===!0&&(be===!0||w!==I)){const zn=w===I&&X.id===L;Ye.setState(X,w,zn)}let pt=!1;X.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==Pt.state.version||$e.outputColorSpace!==Q||k.isBatchedMesh&&$e.batching===!1||!k.isBatchedMesh&&$e.batching===!0||k.isBatchedMesh&&$e.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&$e.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&$e.instancing===!1||!k.isInstancedMesh&&$e.instancing===!0||k.isSkinnedMesh&&$e.skinning===!1||!k.isSkinnedMesh&&$e.skinning===!0||k.isInstancedMesh&&$e.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&$e.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&$e.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&$e.instancingMorph===!1&&k.morphTexture!==null||$e.envMap!==de||X.fog===!0&&$e.fog!==oe||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==Ye.numPlanes||$e.numIntersection!==Ye.numIntersection)||$e.vertexAlphas!==Re||$e.vertexTangents!==Ve||$e.morphTargets!==Pe||$e.morphNormals!==ze||$e.morphColors!==ft||$e.toneMapping!==bt||$e.morphTargetsCount!==wt)&&(pt=!0):(pt=!0,$e.__version=X.version);let Jt=$e.currentProgram;pt===!0&&(Jt=un(X,F,k));let Bi=!1,Qt=!1,Kn=!1;const Vt=Jt.getUniforms(),fn=$e.uniforms;if(Je.useProgram(Jt.program)&&(Bi=!0,Qt=!0,Kn=!0),X.id!==L&&(L=X.id,Qt=!0),Bi||I!==w){Je.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Vt.setValue(B,"projectionMatrix",w.projectionMatrix),Vt.setValue(B,"viewMatrix",w.matrixWorldInverse);const Gn=Vt.map.cameraPosition;Gn!==void 0&&Gn.setValue(B,Be.setFromMatrixPosition(w.matrixWorld)),zt.logarithmicDepthBuffer&&Vt.setValue(B,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Vt.setValue(B,"isOrthographic",w.isOrthographicCamera===!0),I!==w&&(I=w,Qt=!0,Kn=!0)}if(k.isSkinnedMesh){Vt.setOptional(B,k,"bindMatrix"),Vt.setOptional(B,k,"bindMatrixInverse");const zn=k.skeleton;zn&&(zn.boneTexture===null&&zn.computeBoneTexture(),Vt.setValue(B,"boneTexture",zn.boneTexture,gt))}k.isBatchedMesh&&(Vt.setOptional(B,k,"batchingTexture"),Vt.setValue(B,"batchingTexture",k._matricesTexture,gt),Vt.setOptional(B,k,"batchingIdTexture"),Vt.setValue(B,"batchingIdTexture",k._indirectTexture,gt),Vt.setOptional(B,k,"batchingColorTexture"),k._colorsTexture!==null&&Vt.setValue(B,"batchingColorTexture",k._colorsTexture,gt));const Jn=G.morphAttributes;if((Jn.position!==void 0||Jn.normal!==void 0||Jn.color!==void 0)&&ht.update(k,G,Jt),(Qt||$e.receiveShadow!==k.receiveShadow)&&($e.receiveShadow=k.receiveShadow,Vt.setValue(B,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(fn.envMap.value=de,fn.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(fn.envMapIntensity.value=F.environmentIntensity),fn.dfgLUT!==void 0&&(fn.dfgLUT.value=Nv()),Qt&&(Vt.setValue(B,"toneMappingExposure",T.toneMappingExposure),$e.needsLights&&N(fn,Kn),oe&&X.fog===!0&&Qe.refreshFogUniforms(fn,oe),Qe.refreshMaterialUniforms(fn,X,ve,fe,v.state.transmissionRenderTarget[w.id]),Po.upload(B,Hr($e),fn,gt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Po.upload(B,Hr($e),fn,gt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Vt.setValue(B,"center",k.center),Vt.setValue(B,"modelViewMatrix",k.modelViewMatrix),Vt.setValue(B,"normalMatrix",k.normalMatrix),Vt.setValue(B,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const zn=X.uniformsGroups;for(let Gn=0,ul=zn.length;Gn<ul;Gn++){const ws=zn[Gn];Ge.update(ws,Jt),Ge.bind(ws,Jt)}}return Jt}function N(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function Y(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(w,F,G){const X=ot.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(w.texture).__webglTexture=F,ot.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){const G=ot.get(w);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(w,F=0,G=0){b=w,C=F,S=G;let X=!0,k=null,oe=!1,re=!1;if(w){const de=ot.get(w);if(de.__useDefaultFramebuffer!==void 0)Je.bindFramebuffer(B.FRAMEBUFFER,null),X=!1;else if(de.__webglFramebuffer===void 0)gt.setupRenderTarget(w);else if(de.__hasExternalTextures)gt.rebindTextures(w,ot.get(w.texture).__webglTexture,ot.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Pe=w.depthTexture;if(de.__boundDepthTexture!==Pe){if(Pe!==null&&ot.has(Pe)&&(w.width!==Pe.image.width||w.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(w)}}const Re=w.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(re=!0);const Ve=ot.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ve[F])?k=Ve[F][G]:k=Ve[F],oe=!0):w.samples>0&&gt.useMultisampledRTT(w)===!1?k=ot.get(w).__webglMultisampledFramebuffer:Array.isArray(Ve)?k=Ve[G]:k=Ve,V.copy(w.viewport),j.copy(w.scissor),te=w.scissorTest}else V.copy(Le).multiplyScalar(ve).floor(),j.copy(_e).multiplyScalar(ve).floor(),te=Ee;if(G!==0&&(k=ee),Je.bindFramebuffer(B.FRAMEBUFFER,k)&&X&&Je.drawBuffers(w,k),Je.viewport(V),Je.scissor(j),Je.setScissorTest(te),oe){const de=ot.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+F,de.__webglTexture,G)}else if(re){const de=F;for(let Re=0;Re<w.textures.length;Re++){const Ve=ot.get(w.textures[Re]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Re,Ve.__webglTexture,G,de)}}else if(w!==null&&G!==0){const de=ot.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,de.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(w,F,G,X,k,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget)){tn("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(de=de[re]),de){Je.bindFramebuffer(B.FRAMEBUFFER,de);try{const Re=w.textures[Q],Ve=Re.format,Pe=Re.type;if(!zt.textureFormatReadable(Ve)){tn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!zt.textureTypeReadable(Pe)){tn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-X&&G>=0&&G<=w.height-k&&(w.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(F,G,X,k,dt.convert(Ve),dt.convert(Pe),oe))}finally{const Re=b!==null?ot.get(b).__webglFramebuffer:null;Je.bindFramebuffer(B.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(w,F,G,X,k,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(de=de[re]),de)if(F>=0&&F<=w.width-X&&G>=0&&G<=w.height-k){Je.bindFramebuffer(B.FRAMEBUFFER,de);const Re=w.textures[Q],Ve=Re.format,Pe=Re.type;if(!zt.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!zt.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ze=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,ze),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),w.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(F,G,X,k,dt.convert(Ve),dt.convert(Pe),0);const ft=b!==null?ot.get(b).__webglFramebuffer:null;Je.bindFramebuffer(B.FRAMEBUFFER,ft);const bt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Mp(B,bt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,ze),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.deleteBuffer(ze),B.deleteSync(bt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,G=0){const X=Math.pow(2,-G),k=Math.floor(w.image.width*X),oe=Math.floor(w.image.height*X),re=F!==null?F.x:0,Q=F!==null?F.y:0;gt.setTexture2D(w,0),B.copyTexSubImage2D(B.TEXTURE_2D,G,0,0,re,Q,k,oe),Je.unbindTexture()};const ie=B.createFramebuffer(),le=B.createFramebuffer();this.copyTextureToTexture=function(w,F,G=null,X=null,k=0,oe=null){oe===null&&(k!==0?(br("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=k,k=0):oe=0);let re,Q,de,Re,Ve,Pe,ze,ft,bt;const Ct=w.isCompressedTexture?w.mipmaps[oe]:w.image;if(G!==null)re=G.max.x-G.min.x,Q=G.max.y-G.min.y,de=G.isBox3?G.max.z-G.min.z:1,Re=G.min.x,Ve=G.min.y,Pe=G.isBox3?G.min.z:0;else{const Jn=Math.pow(2,-k);re=Math.floor(Ct.width*Jn),Q=Math.floor(Ct.height*Jn),w.isDataArrayTexture?de=Ct.depth:w.isData3DTexture?de=Math.floor(Ct.depth*Jn):de=1,Re=0,Ve=0,Pe=0}X!==null?(ze=X.x,ft=X.y,bt=X.z):(ze=0,ft=0,bt=0);const wt=dt.convert(F.format),$e=dt.convert(F.type);let Pt;F.isData3DTexture?(gt.setTexture3D(F,0),Pt=B.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(gt.setTexture2DArray(F,0),Pt=B.TEXTURE_2D_ARRAY):(gt.setTexture2D(F,0),Pt=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,F.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,F.unpackAlignment);const pt=B.getParameter(B.UNPACK_ROW_LENGTH),Jt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Bi=B.getParameter(B.UNPACK_SKIP_PIXELS),Qt=B.getParameter(B.UNPACK_SKIP_ROWS),Kn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Ct.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ct.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Re),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ve),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Pe);const Vt=w.isDataArrayTexture||w.isData3DTexture,fn=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){const Jn=ot.get(w),zn=ot.get(F),Gn=ot.get(Jn.__renderTarget),ul=ot.get(zn.__renderTarget);Je.bindFramebuffer(B.READ_FRAMEBUFFER,Gn.__webglFramebuffer),Je.bindFramebuffer(B.DRAW_FRAMEBUFFER,ul.__webglFramebuffer);for(let ws=0;ws<de;ws++)Vt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ot.get(w).__webglTexture,k,Pe+ws),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ot.get(F).__webglTexture,oe,bt+ws)),B.blitFramebuffer(Re,Ve,re,Q,ze,ft,re,Q,B.DEPTH_BUFFER_BIT,B.NEAREST);Je.bindFramebuffer(B.READ_FRAMEBUFFER,null),Je.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(k!==0||w.isRenderTargetTexture||ot.has(w)){const Jn=ot.get(w),zn=ot.get(F);Je.bindFramebuffer(B.READ_FRAMEBUFFER,ie),Je.bindFramebuffer(B.DRAW_FRAMEBUFFER,le);for(let Gn=0;Gn<de;Gn++)Vt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Jn.__webglTexture,k,Pe+Gn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Jn.__webglTexture,k),fn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,zn.__webglTexture,oe,bt+Gn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,zn.__webglTexture,oe),k!==0?B.blitFramebuffer(Re,Ve,re,Q,ze,ft,re,Q,B.COLOR_BUFFER_BIT,B.NEAREST):fn?B.copyTexSubImage3D(Pt,oe,ze,ft,bt+Gn,Re,Ve,re,Q):B.copyTexSubImage2D(Pt,oe,ze,ft,Re,Ve,re,Q);Je.bindFramebuffer(B.READ_FRAMEBUFFER,null),Je.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else fn?w.isDataTexture||w.isData3DTexture?B.texSubImage3D(Pt,oe,ze,ft,bt,re,Q,de,wt,$e,Ct.data):F.isCompressedArrayTexture?B.compressedTexSubImage3D(Pt,oe,ze,ft,bt,re,Q,de,wt,Ct.data):B.texSubImage3D(Pt,oe,ze,ft,bt,re,Q,de,wt,$e,Ct):w.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,ze,ft,re,Q,wt,$e,Ct.data):w.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,ze,ft,Ct.width,Ct.height,wt,Ct.data):B.texSubImage2D(B.TEXTURE_2D,oe,ze,ft,re,Q,wt,$e,Ct);B.pixelStorei(B.UNPACK_ROW_LENGTH,pt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Jt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Bi),B.pixelStorei(B.UNPACK_SKIP_ROWS,Qt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Kn),oe===0&&F.generateMipmaps&&B.generateMipmap(Pt),Je.unbindTexture()},this.initRenderTarget=function(w){ot.get(w).__webglFramebuffer===void 0&&gt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?gt.setTextureCube(w,0):w.isData3DTexture?gt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?gt.setTexture2DArray(w,0):gt.setTexture2D(w,0),Je.unbindTexture()},this.resetState=function(){C=0,S=0,b=null,Je.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=It._getDrawingBufferColorSpace(e),t.unpackColorSpace=It._getUnpackColorSpace()}}function gs(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},o=n[0].morphTargetsRelative,c=new Yt;let h=0;for(let d=0;d<n.length;++d){const f=n[d];let p=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in f.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.attributes[m]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in f.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.morphAttributes[m])}if(e){let m;if(t)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,m,d),h+=m}}if(t){let d=0;const f=[];for(let p=0;p<n.length;++p){const m=n[p].index;for(let x=0;x<m.count;++x)f.push(m.getX(x)+d);d+=n[p].attributes.position.count}c.setIndex(f)}for(const d in a){const f=xu(a[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,f)}for(const d in r){const f=r[d][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<f;++p){const m=[];for(let M=0;M<r[d].length;++M)m.push(r[d][M][p]);const x=xu(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function xu(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),o=new Zn(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const f=c/t;for(let p=0,m=d.count;p<m;p++)for(let x=0;x<t;x++){const M=d.getComponent(p,x);o.setComponent(p+f,x,M)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class Bv extends uf{constructor(){super();const e=new xe;e.deleteAttribute("uv");const t=new W({side:Dn}),i=new W,s=new Oh(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new O(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new on(e,i,6),o=new Ut;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new O(e,xa(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new O(e,xa(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new O(e,xa(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const f=new O(e,xa(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new O(e,xa(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new O(e,xa(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function xa(n){return new Wm({color:0,emissive:16777215,emissiveIntensity:n})}const Lo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Na{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const kv=new Bh(-1,1,1,-1,0,1);class Vv extends Yt{constructor(){super(),this.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new _t([0,2,0,0,2,0],2))}}const Gv=new Vv;class kh{constructor(e){this._mesh=new O(Gv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,kv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Df extends Na{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof bn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Sr.clone(e.uniforms),this.material=new bn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new kh(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class gu extends Na{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class Hv extends Na{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Wv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ue);this._width=i.width,this._height=i.height,t=new gi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Di}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Df(Lo),this.copyPass.material.blending=Li,this.clock=new Ef}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gu!==void 0&&(r instanceof gu?i=!0:r instanceof Hv&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Xv extends Na{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const _o={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class qv extends Na{constructor(){super(),this.uniforms=Sr.clone(_o.uniforms),this.material=new Hm({name:_o.name,uniforms:this.uniforms,vertexShader:_o.vertexShader,fragmentShader:_o.fragmentShader}),this._fsQuad=new kh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},It.getTransfer(this._outputColorSpace)===Ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Hu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Wu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Xu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===mh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Yu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$u?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===qu&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Yv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Da extends Na{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ue(e.x,e.y):new Ue(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new gi(a,r,{type:Di}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const f=new gi(a,r,{type:Di});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new gi(a,r,{type:Di});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),r=Math.round(r/2)}const o=Yv;this.highPassUniforms=Sr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new bn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ue(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Sr.clone(Lo.uniforms),this.blendMaterial=new bn({uniforms:this.copyUniforms,vertexShader:Lo.vertexShader,fragmentShader:Lo.fragmentShader,blending:ti,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Rt,this._fsQuad=new kh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Ue(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Da.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Da.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new bn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ue(.5,.5)},direction:{value:new Ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new bn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Da.BlurDirectionX=new Ue(1,0);Da.BlurDirectionY=new Ue(0,1);const Nr=document.querySelector("#game"),en=new Ov({canvas:Nr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),il=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;en.setPixelRatio(Math.min(window.devicePixelRatio,il?1.5:2));en.setSize(window.innerWidth,window.innerHeight);en.shadowMap.enabled=!il;en.info.autoReset=!1;en.shadowMap.type=Gu;en.outputColorSpace=Lt;en.toneMapping=mh;en.toneMappingExposure=1.12;const Te=new uf;window.__steelRibbonScene=Te;Te.background=new rt(16764588);Te.fog=new Rh(14719602,360,2150);const If=new Jc(en);If.compileEquirectangularShader();Te.environment=If.fromScene(new Bv,.04).texture;Te.environmentIntensity=.58;const Ne=new qn(69,window.innerWidth/window.innerHeight,.08,1800);Te.add(Ne);const Xe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const et=new Set,Ie={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},$v=new Ef,jt=new P(0,1,0),Vh=new P,Uf=new P,sl=new P,yn=new Ut,Ff=.86,Qc=1.2,Zv=.78,Vn=.55,ke={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},Xs=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],zf=Math.max(...Xs.map(n=>n.width));let vs=0,se=Xs[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Xe.best.textContent=`Best score ${l.best}`;let xi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Qi(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&xi==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}Qi();function Kv(){xi=xi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",xi),Qi(),l.message=xi==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const yo=[];function Ui(n,e=!1){let t=yo.find(s=>!s.busy);t||(yo.length>=4?t=yo[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),yo.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function wn(n=880,e=.16,t="triangle",i=.16){if(!Se)return;const{ctx:s}=Se,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Se.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let vu=0;function Jv(){if(!Se||Se.ctx.currentTime-vu<.45)return;vu=Se.ctx.currentTime;const{ctx:n}=Se,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),o=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,o),r.gain.linearRampToValueAtTime(.05,o+.015),r.gain.setValueAtTime(.05,o+i),r.gain.exponentialRampToValueAtTime(1e-4,o+i+.04),s.connect(r),a.connect(r),r.connect(Se.master),s.start(o),a.start(o),s.stop(o+i+.05),a.stop(o+i+.05)}}function jv(n){const e=me.clamp(n,0,1);return e*e*(3-2*e)}function Qv(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*me.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-jv((e-i.end)/i.settle)))}return t}function Gh(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function Nf(n,e){const{t,n:i}=Gh(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let o=i-r.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),a+=r.amp*Math.exp(-(o*o)/(r.width*r.width))}return a+=Qv(n,i),a}function bo(n){const{x:e,z:t,n:i}=Gh(se,n),s=Nf(se,i);return new P(e,s,t)}function xt(n){const e=(n%se.length+se.length)%se.length,t=bo(e),i=bo(e+2).sub(t).normalize(),s=Vh.crossVectors(jt,i).normalize(),a=bo(e-2).y,r=bo(e+2).y,o=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Fi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Mu(n){return me.clamp(n/(se.length*se.laps),0,1)}function Zl(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let a=i;a<=s;a++){const r=a*se.length+t;if(n<r&&e>=r)return!0}return!1}function eM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let o=0;o<e;o++)i.fillStyle=(o+r)%2?"#101318":"#f5f1df",i.fillRect(o*s,r*s,s,s);const a=new rn(t);return a.colorSpace=Lt,a.wrapS=Un,a.wrapT=Un,a.repeat.set(3,1),a}function tM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(r,o),t.bezierCurveTo(r+Math.random()*22-11,o+36,r+Math.random()*22-11,o+82,r+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new rn(e);return s.colorSpace=Lt,s.wrapS=Un,s.wrapT=Un,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),s}function nM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,o,0,r,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,o,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new rn(e);return s.colorSpace=Lt,s.wrapS=Un,s.wrapT=Un,s.repeat.set(18,18),s.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),s}function iM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(r,o);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(r,o);t.stroke()}const s=new rn(e);return s.colorSpace=Lt,s.wrapS=Un,s.wrapT=Un,s.repeat.set(9,16),s.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),s}function sM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new rn(e);return s.colorSpace=Lt,s}function ga(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new rn(i);return a.colorSpace=Lt,a}function aM(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,f),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+f-2),s.moveTo(c+2,h+f*.52),s.lineTo(c+d-2,h+f*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new rn(i);return o.colorSpace=Lt,o.wrapS=Un,o.wrapT=Un,o.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),o}function rM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const o=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,o):t.lineTo(r,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new rn(e);return s.colorSpace=Lt,s.wrapS=Un,s.wrapT=Un,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),s}function oM(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new rn(t);return a.colorSpace=Lt,a}function _u(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:o}=s;a.fillStyle=t,a.fillRect(0,0,r,o),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,o-16),a.save(),a.translate(r/2,o/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new rn(s);return c.colorSpace=Lt,c}const hs=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],Ho=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],ds=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Of(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new rn(i);return r.colorSpace=Lt,r.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),r}function Kl(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new rn(t);return s.colorSpace=Lt,s}function Jl(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const o=new rn(s);return o.colorSpace=Lt,o.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),o}function lM(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new rn(t);return s.colorSpace=Lt,s.anisotropy=Math.min(16,en.capabilities.getMaxAnisotropy()),s}function cM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new rn(e);return r.colorSpace=Lt,r}function ce(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function va(n,e,t,i){const s=t*.5,a=i*.5;let r=ce(n,e);for(const o of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,ce(n+o,e+c));return r}function al(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:o,streetW:c}=ke;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((a-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const ps={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Pn(n,e,t,i,s=8){const{x0:a,x1:r,zNear:o,zFar:c,pitch:h,streetW:d}=ke,f=t*.5,p=i*.5,m=d*.5+s;let x=null;const M=(g,u,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:u,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+p<c-m||e-p>o+m)continue;const u=f+m-Math.abs(n-g);u>0&&M("x",Math.round(g),u)}for(let g=o;g>=c-1;g-=h){if(n+f<a-m||n-f>r+m)continue;const u=p+m-Math.abs(e-g);u>0&&M("z",Math.round(g),u)}return x}const qs=[],Bf=[],Tn={spots:[],im:null,imW:null};function kf(n=1){const e=new bn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return Bf.push(e),e}function Vf(n,e,t,i=t,s=null){qs.push({x:n,z:e,rx:t,rz:i,waterY:s})}function Vs(n,e){let t=0,i=null;for(const s of qs){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,o=a*a+r*r;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=me.clamp((s.waterY-ce(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const ba=[],jl=[],Hh=[];let Wo=0;function mn(n,e){return Hh.push({obj:n,update:e}),n}function Gf(n){Wo+=n;for(const e of Hh)e.update(Wo,n)}function rl(){if(jl.length===0)for(let n=0;n<Xs.length;n++){const e=Xs[n];for(let t=0;t<e.length;t+=14){const i=Gh(e,t);jl.push({x:i.x,y:Nf(e,t),z:i.z,s:t,courseIndex:n})}}return jl}function Rn(n,e,t=0){let i=null,s=1/0;for(const a of rl()){const r=n-a.x,o=e-a.z,c=Math.hypot(r,o);c<s&&(s=c,i=a)}return{clearance:s-t-zf*.58,distance:s,nearestS:i?.s??0}}function Ds(n,e,t,i,s,a=9){const r=t*.5,o=i*.5,c=zf*.62+a;let h=null;for(const d of rl()){const f=Math.max(Math.abs(d.x-n)-r,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(f,p)-c;if(m>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-m>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return h}function ci(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(Rn(a.x,a.z,e).clearance>=t&&!Pn(a.x,a.z,e*2,e*2,3.5))return a}return null}function hi(n,e,t,i,s){const a=Rn(e,t,i);ba.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function hM(){const n=[...ba].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:ba.length,unsafe:ba.filter(e=>e.clearance<e.margin),closest:n}}function Bn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),o=new O(new je(i,i,r.length(),8),s);return o.position.copy(a),o.quaternion.setFromUnitVectors(jt,r.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const dn={cloudMats:[],glowMats:[]};function dM(){const n=new Ym(16757626,3097190,.66);Te.add(n);const e=new Hl(7179775,.6);e.position.set(260,145,-260),Te.add(e);const t=new Hl(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Te.add(t);const i=new Hl(16742973,.5);i.position.set(-180,35,280),Te.add(i);const s=new Oh(5556479,90,900,2);s.position.set(0,88,-920),Te.add(s),dn.hemi=n,dn.fill=e,dn.key=t,dn.rim=i}let di=null;function uM(){const n=new P(-310,150,230).normalize();di=new O(new Kt(1200,48,32),new bn({side:Dn,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
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
        }`})),di.renderOrder=-100,di.frustumCulled=!1,Te.add(di);const e=n,t=new Rt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new O(new xn(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),di.add(i);const s=new Rt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:ti});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const o=new O(new xn(a,48),s.clone());o.material.opacity=r,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),di.add(o),dn.glowMats.push({mat:o.material,dusk:r})}dn.skyU=di.material.uniforms,dn.sunMat=t}function fM(){const n=new W({map:nM(),color:8231526,roughness:.98,metalness:.02}),e=new O(new Zt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const m=t.getX(p),x=t.getY(p);t.setZ(p,ce(m,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Te.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:Mt});for(let p=0;p<3;p++){const m=150-p*190,x=-760-p*420,M=980,g=64+p*18,u=new O(new Zt(980,64+p*18,1,1),i.clone());u.rotation.x=-Math.PI/2,u.rotation.z=-.34+p*.03,u.position.set(m,va(m,x,M,g)-.55,x),u.renderOrder=-4,Te.add(u)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let p=0;p<46;p++){const m=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[ce(x,M)];for(let y=0;y<6;y++)g.push(ce(x+Math.cos(y)*m*.9,M+Math.sin(y*1.9)*m*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const u=new O(new xn(m,9),s[p%s.length]);u.rotation.x=-Math.PI/2,u.rotation.z=Math.random()*Math.PI,u.position.set(x,Math.max(...g)+.07,M),u.scale.y=.32+Math.random()*.5,u.receiveShadow=!0,Te.add(u)}const a=new Rt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const m=new O(new xn(70+Math.random()*150,22),a.clone());m.material.opacity=.008+Math.random()*.014,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),m.position.y<8&&ps.lowFogDisks++,m.scale.y=.22+Math.random()*.26,m.renderOrder=-6,Te.add(m)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let p=0;p<52;p++){const m=78+Math.random()*180,x=52+Math.random()*115,M=ci(u=>{const y=p/52*Math.PI*2+u*1.77,v=1380+Math.random()*820+u*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!M)continue;const g=new O(new Ai(x,m,5+Math.floor(Math.random()*2)),r[p%r.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Te.add(g),hi("mountain",M.x,M.z,x,480),m>160){const u=new O(new Ai(x*.34,m*.22,5),o);u.position.copy(g.position).add(new P(0,m*.39,0)),u.rotation.y=g.rotation.y,Te.add(u)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const p=new je(.28,.42,1,6).translate(0,.5,0),m=gs([new Ai(2.7,5.4,7).translate(0,1.9,0),new Ai(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Ai(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),M=new on(p,c,185),g=new on(m,new W({roughness:.92}),185),u=new Ut;let y=0;for(let v=0;v<185;v++){const _=.58+Math.random()*1.05,E=8*_,T=ci(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:R,z:C}=T;if(al(R,C,18))continue;const S=ce(R,C)+.8,b=2.2+Math.random()*3.8;u.position.set(R,S,C),u.rotation.y=Math.random()*Math.PI,u.scale.set(_,b,_),u.updateMatrix(),M.setMatrixAt(y,u.matrix),u.position.set(R,S+b,C),u.scale.set(_,_,_),u.updateMatrix(),g.setMatrixAt(y,u.matrix),g.setColorAt(y,x[v%3]),y++,hi("tree",R,C,E,145)}M.count=y,g.count=y,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Te.add(M),Te.add(g)}{const p=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),u=(v,_)=>Math.sin(x*_+v*37.7)*.5+.5;for(let v=0;v<16;v++){const _=v/15,E=Math.sin(_*Math.PI),T=24+_*208,R=66+(u(v,53)-.5)*22*E,C=(18+u(v,29)*22)*(.45+E*.75),S=g.createRadialGradient(T,R-C*.18,0,T,R,C);S.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),S.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),S.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=S,g.beginPath(),g.arc(T,R,C,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const _=.12+v/9*.76,E=_*256,T=20+u(v,71)*16,R=g.createRadialGradient(E,92,0,E,92,T);R.addColorStop(0,"rgba(255, 176, 128, 0.22)"),R.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=R,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const y=new rn(M);return y.colorSpace=Lt,y},m=[p(1),p(2),p(3)];ye.cloudSprites=0;for(let x=0;x<44;x++){const M=new Ph({map:m[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new qc(M),u=170+Math.random()*280;g.scale.set(u,u*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Te.add(g),ye.cloudSprites++,mn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const m=new it,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,u=new O(new xe(M,x,g),h[p%h.length]);u.position.y=x/2,u.castShadow=!0,u.receiveShadow=!0,m.add(u);const y=ga(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const R of[-1,1]){const C=new O(new Zt(M*.82,x*.74),v);C.position.set(0,x*.53,R*(g/2+.08)),C.rotation.y=R<0?Math.PI:0,m.add(C)}const _=new O(new xe(M*1.08,1.2,g*1.08),d);if(_.position.y=x+.7,m.add(_),Math.random()<.32){const R=new O(new je(.18,.3,10+Math.random()*12,8),d);R.position.y=x+6.5,m.add(R)}const E=Math.hypot(M,g)*.65,T=ci(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(m.position.set(T.x,va(T.x,T.z,M,g)-.7,T.z),m.rotation.y=Math.random()*Math.PI,Te.add(m),hi("building",T.x,T.z,E,240))}const f=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const m=new it,x=hs[p%hs.length],M=Ho[(p*3+1)%Ho.length],g=ds[p%ds.length],u=new W({map:Of(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,_=new O(new xe(y,v,.5),u);_.position.y=10,m.add(_);const E=new O(new xe(y+1.2,.32,.75),f);E.position.y=10+v*.5+.25,m.add(E);for(const R of[-7,7]){const C=new O(new je(.24,.32,10,8),f);C.position.set(R,5,-.2),m.add(C)}const T=ci(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);T&&(m.position.set(T.x,ce(T.x,T.z)+.5,T.z),m.rotation.y=-.35+Math.random()*.7,Te.add(m),hi("billboard",T.x,T.z,22,175),Is("roadside-billboard",T.x,m.position.y+10,T.z))}}function pM(){for(let u=0;u<3;u++){const y=[4012638,5326704,7035525][u],v=new Rt({color:y,transparent:!0,opacity:.6-u*.14,depthWrite:!1,fog:!1}),_=60,E=5200,T=new Zt(E,360,_,1),R=T.attributes.position;for(let S=0;S<=_;S++){const b=S/_,L=(Math.sin(b*22+u*3)*.5+Math.sin(b*9+u)*.5)*70+120;R.setY(S,L),R.setY(S+_+1,-180)}R.needsUpdate=!0;const C=new O(T,v);C.position.set(0,40,-2300-u*360),Te.add(C)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let u=0;u<48;u++){const y=.7+Math.random()*1.2,v=9*y,_=ci(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!_)continue;const{x:E,z:T}=_;if(al(E,T,18))continue;const R=ce(E,T)+.6,C=new it,S=2.6+Math.random()*3.4,b=new O(new je(.34,.5,S,6),n);b.position.y=S/2,C.add(b);const L=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let V=0;V<I;V++){const j=2.4+Math.random()*1.8,te=new O(new Kt(j,9,7),L);te.position.set((Math.random()-.5)*3,S+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,C.add(te)}C.position.set(E,R,T),C.scale.setScalar(y),Te.add(C),hi("tree",E,T,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:Mt}),new W({color:9077368,roughness:1,flatShading:!0,side:Mt}),new W({color:6249043,roughness:1,flatShading:!0,side:Mt})];for(let u=0;u<70;u++){const y=2+Math.random()*7,v=ci(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:_,z:E}=v,T=new O(new zh(y,0),t[u%t.length]),R=T.geometry.attributes.position;for(let C=0;C<R.count;C++)R.setXYZ(C,R.getX(C)*(.8+Math.random()*.4),R.getY(C)*(.6+Math.random()*.4),R.getZ(C)*(.8+Math.random()*.4));R.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(_,ce(_,E)+y*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Te.add(T),fi.push({kind:"rock",x:_,z:E,radius:y*1.12}),hi("rock",_,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let u=0;u<14;u++){const y=130+Math.random()*200,v=130+Math.random()*200,_=ci(()=>{for(let L=0;L<6;L++){const I=-1500+Math.random()*3e3,V=-700-Math.random()*1700,j=[ce(I,V),ce(I+y*.45,V+v*.45),ce(I-y*.45,V+v*.45),ce(I+y*.45,V-v*.45),ce(I-y*.45,V-v*.45)];if(Math.max(...j)-Math.min(...j)<1)return{x:I,z:V}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!_||_.x>9e4)continue;const{x:E,z:T}=_,R=new it,C=5+Math.floor(Math.random()*4),S=i[Math.floor(Math.random()*i.length)];for(let L=0;L<C;L++){const I=new W({color:L%2?S:i[Math.floor(Math.random()*i.length)],roughness:1}),V=new O(new Zt(y,v/C),I);V.rotation.x=-Math.PI/2,V.position.set(0,.05,-v/2+(L+.5)*(v/C)),R.add(V)}const b=Math.max(ce(E,T),ce(E+y*.45,T+v*.45),ce(E-y*.45,T+v*.45),ce(E+y*.45,T-v*.45),ce(E-y*.45,T-v*.45));R.position.set(E,b+.06,T),R.rotation.y=Math.random()*Math.PI,Te.add(R),hi("field",E,T,Math.max(y,v)*.5,40)}{const u=ci(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(u){const y=[ce(u.x,u.z)];for(let E=0;E<8;E++)y.push(ce(u.x+Math.cos(E/8*Math.PI*2)*110,u.z+Math.sin(E/8*Math.PI*2)*74),ce(u.x+Math.cos(E/8*Math.PI*2)*200,u.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,T)=>E-T);const v=y[4]+.4,_=new O(new xn(150,48),kf(9));_.rotation.x=-Math.PI/2,_.position.set(u.x,v,u.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Te.add(_),Vf(u.x,u.z,222,148,v),ps.waterBlockers++,hi("lake",u.x,u.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let u=0;u<9;u++){const y=u/9*Math.PI*2+.6,v=1500+Math.random()*700,_=Math.cos(y)*v,E=Math.sin(y)*v-1150,T=60+Math.random()*40,R=new it,C=new O(new je(1.1,2.2,T,10),s);C.position.y=T/2,R.add(C);const S=new it;S.position.set(0,T,3);const b=new O(new xe(3,3,7),s);S.add(b);const L=new it;L.position.z=3.5;for(let V=0;V<3;V++){const j=new O(new xe(1.1,26,.5),s);j.position.y=13;const te=new it;te.add(j),te.rotation.z=V/3*Math.PI*2,L.add(te)}S.add(L),R.add(S),R.position.set(_,-8,E),R.rotation.y=Math.random()*Math.PI,Te.add(R);const I=.5+Math.random()*.5;mn(L,V=>{L.rotation.z=V*I})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new ko({color:2764595,transparent:!0,opacity:.5});let o=null;for(let u=0;u<7;u++){const y=-1100+u*360,v=-1650-Math.sin(u*.7)*120,_=48,E=new it,T=6;for(const C of[-1,1])for(const S of[-1,1]){const b=new O(new je(.4,.7,_,5),a);b.position.set(C*T,_/2,S*T),b.rotation.z=-C*.08,b.rotation.x=S*.08,E.add(b)}for(const C of[_*.6,_*.82,_]){const S=new O(new xe(T*4,.8,.8),a);S.position.y=C,E.add(S)}E.position.set(y,ce(y,v)-2,v),Te.add(E);const R=ce(y,v)-2+_;if(o)for(const C of[-T*2,0,T*2]){const S=o.x+C,b=o.z,L=y+C,I=v,V=[],j=12;for(let q=0;q<=j;q++){const Z=q/j,ne=Math.sin(Z*Math.PI)*6;V.push(new P(S+(L-S)*Z,o.y-ne+(R-o.y)*Z,b+(I-b)*Z))}const te=new Yc(new Yt().setFromPoints(V),r);Te.add(te)}o={x:y,y:R,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let u=0;u<5;u++){const y=ci(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:_}=y,E=70+Math.random()*50,T=new it,R=8;for(let L=0;L<R;L++){const I=new O(new je(.5,.7,E/R,4),L%2?h:c);I.position.y=(L+.5)*(E/R),I.rotation.y=Math.PI/4,T.add(I)}const C=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),S=new O(new Kt(1.1,10,8),C);S.position.y=E+1,T.add(S),T.position.set(v,ce(v,_),_),Te.add(T),hi("mast",v,_,8,120);const b=Math.random()*Math.PI*2;mn(S,L=>{C.emissiveIntensity=Math.sin(L*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let u=0;u<6;u++){const y=new it,v=d[u%d.length],_=new W({map:yM(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new O(new Kt(11,20,16),_);E.scale.y=1.25,y.add(E);const T=new O(new xe(3.4,3,3.4),new W({color:8014371,roughness:.9}));T.position.y=-17,y.add(T);const R=new ko({color:3811866});for(const I of[-1,1])for(const V of[-1,1]){const j=new Yc(new Yt().setFromPoints([new P(I*1.6,-15.5,V*1.6),new P(I*7,-3,V*7)]),R);y.add(j)}const C=-700+Math.random()*1400,S=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(C,b,S),Te.add(y);const L=Math.random()*Math.PI*2;mn(y,I=>{y.position.y=b+Math.sin(I*.5+L)*6,y.position.x=C+Math.sin(I*.08+L)*90,y.rotation.z=Math.sin(I*.4+L)*.04})}const f=new Rt({color:2829104,side:Mt,fog:!1});function p(){const u=new Fh;return u.moveTo(0,0),u.lineTo(-2.6,1.1),u.lineTo(-2.2,.2),u.lineTo(0,.5),u.lineTo(2.2,.2),u.lineTo(2.6,1.1),u.lineTo(0,0),new O(new el(u),f)}for(let u=0;u<5;u++){const y=new it,v=5+Math.floor(Math.random()*5),_=[];for(let L=0;L<v;L++){const I=p(),V=L%2?1:-1,j=Math.ceil(L/2);I.position.set(V*j*5,-j*2.4,0),I.rotation.x=-Math.PI/2,y.add(I),_.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,R=18+Math.random()*14,C=1400,S=-700+Math.random()*1400;y.position.set(S,E,T),Te.add(y);const b=Math.random()*Math.PI*2;mn(y,(L,I)=>{y.position.x+=R*I,y.position.x>C&&(y.position.x=-C);const V=Math.sin(L*6+b);for(const j of _)j.rotation.x=-Math.PI/2+V*.4})}{const u=new it,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new O(new Kt(20,20,16),y);v.scale.set(2.6,1,1),u.add(v);const _=new W({color:13781835,roughness:.6});for(let S=0;S<3;S++){const b=new O(new xe(10,9,.6),_);b.position.x=-46,b.rotation.x=S/3*Math.PI*2,u.add(b)}const E=new O(new xe(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,u.add(E);const T=new O(new Zt(40,10),new Rt({map:Wh("STEEL RIBBON"),transparent:!0,side:Mt}));T.position.set(60,0,0),u.add(T);const R=900,C=240;u.position.set(0,C,-1200),Te.add(u),mn(u,S=>{const b=S*.05;u.position.x=Math.cos(b)*R,u.position.z=-1200+Math.sin(b)*R*.5,u.position.y=C+Math.sin(S*.3)*8,u.rotation.y=-b+Math.PI/2})}const m=new Rt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let u=0;u<14;u++){const y=new O(new Zt(220+Math.random()*360,16+Math.random()*22),m.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Te.add(y);const v=2+Math.random()*3;mn(y,(_,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),M=new Rt({map:bM(),side:Mt});for(let u=0;u<4;u++){const y=ci(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:_}=y,E=new it,T=60+Math.random()*40,R=new O(new xe(T,1.4,26),x);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const C=new O(new Zt(T*.94,24),M);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const S of[-T/2,T/2]){const b=new O(new xe(1.4,26,1.4),x);b.position.set(S,13,-8),E.add(b)}E.position.set(v,ce(v,_),_),E.rotation.y=Math.atan2(-v,-_)+(Math.random()-.5)*.5,Te.add(E),hi("grandstand",v,_,40,30)}const g=[16731486,16765503,16777215,11824127];for(let u=0;u<90;u++){const y=ci(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:_}=y,E=new it,T=g[Math.floor(Math.random()*g.length)],R=new Rt({color:T,side:Mt}),C=5+Math.floor(Math.random()*6);for(let S=0;S<C;S++){const b=new O(new xn(.5+Math.random()*.4,5),R);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,ce(v,_),_),Te.add(E),hi("flowers",v,_,3,20)}}const sn=[],Qn=[];let eh=0;const fi=[],Zs=[],Sn=[],th=[],Cr=[],wa=[],ye={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},Xo=[];function Is(n,e,t,i){ye.signs++,Xo.length<160&&Xo.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function rs(n,e,t=1){ye[n][e]=(ye[n][e]||0)+t}let wo=null,yu=null;function Hf(){return wo||(wo=new W({vertexColors:!0,roughness:.42,metalness:.22}),wo.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},yu=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:wo,glass:yu}}const os=new rt;function hn(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,o=new Float32Array(r*3),c=new Float32Array(r*3);os.set(t??16777215);for(let h=0;h<r;h++)o[h*3]=os.r,o[h*3+1]=os.g,o[h*3+2]=os.b;if(i){os.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=os.r,c[h*3+1]=os.g,c[h*3+2]=os.b}return a.setAttribute("color",new _t(o,3)),a.setAttribute("aEmissive",new _t(c,3)),a}function _n(n,e,t,i=0){return(i?new Et().makeRotationZ(i):new Et).setPosition(n,e,t)}function ol(n,e){const t=new it,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=Hf(),o=n==="taxi"?16767293:e,c=new rt(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(hn(new xe(s.w,s.h,s.l),_n(0,.95,0),o)),(s.bus?d:h).push(hn(new xe(s.cabin[0],s.cabin[1],s.cabin[2]),_n(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(hn(new xe(s.cabin[0]*.78,s.cabin[1]*.55,.08),_n(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(hn(new xe(.08,s.cabin[1]*.5,s.cabin[2]*.48),_n(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(hn(new xe(s.w*.94,.58,s.l*.38),_n(0,1.2,1.35),c)),s.box&&h.push(hn(new xe(s.box[0],s.box[1],s.box[2]),_n(0,1.55,1.25),15130833)),s.bus){h.push(hn(new xe(s.w+.06,.28,s.l*.86),_n(0,1.38,0),c));const y=new xe(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const _ of[-1,1])d.push(hn(y,_n(_*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(hn(new xe(1,.24,.46),_n(0,2.2,-.35),16774310,16765773,.9));const f=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],p=[],m=gs([hn(new je(.42,.42,.36,14),_n(0,0,0,Math.PI/2),395016),hn(new je(.18,.18,.38,10),_n(0,0,0,Math.PI/2),14147041)],!1),x=new xe(.3,.34,1.12);for(const y of f)for(const v of[-s.w*.54,s.w*.54]){const _=new O(m,a);_.position.set(v,.45,y),t.add(_),p.push(_),h.push(hn(x,_n(v*1.02,.72,y),1250072))}const M=new xe(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(hn(M,_n(0,.62,y),1250072));const g=new xe(.42,.2,.1),u=new xe(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(hn(g,_n(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(hn(u,_n(y,.98,s.l*.52+.04),16725033,16717325,1.45));return t.add(new O(gs(h,!1),a)),d.length&&t.add(new O(gs(d,!1),r)),t.userData={wheels:p,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function Wf(n,e){const t=new it,{opaque:i}=Hf(),s=new Kt(.25,8,5);s.scale(1,.5,1),t.add(new O(gs([hn(new je(.28,.34,.95,8),_n(0,1.35,0),n),hn(new Kt(.24,10,8),_n(0,2.02,0),12947299),hn(s,_n(0,2.17,0),1119001)],!1),i));const a=[],r=hn(new je(.075,.09,.78,6),null,e),o=hn(new je(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new O(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new O(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}function mM(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,x=[],M=[];for(let D=i;D<=s+1;D+=o)x.push(Math.round(D));for(let D=a;D>=r-1;D-=o)M.push(Math.round(D));M.sort((D,Le)=>D-Le);const g=x[0],u=x[x.length-1],y=M[0],v=M[M.length-1];Sn.length=0,th.length=0,Cr.length=0,wa.length=0,ye.traffic=0,ye.pedestrians=0,ye.types={},ye.turns=0,ye.splats=0,ye.trafficCrashes=0,ye.streetLights=0,ye.trafficLights=0,ye.stopSigns=0;const _=D=>D[Math.random()*D.length|0],E=D=>(D>0?-1:1)*c*.23,T=(D,Le)=>{let _e=0,Ee=1/0;for(let $=0;$<D.length;$++){const K=Math.abs(D[$]-Le);K<Ee&&(Ee=K,_e=$)}return _e},R=(D,Le,_e)=>{const Ee=D==="ns"?M:x;if(_e>0){for(const $ of Ee)if($>Le+.05)return $;return Ee[Ee.length-1]}for(let $=Ee.length-1;$>=0;$--)if(Ee[$]<Le-.05)return Ee[$];return Ee[0]},C=D=>{const Le=D.laneOffset+(D.avoidOffset||0);return D.axis==="ns"?{x:D.road+Le,z:D.along}:{x:D.along,z:D.road+Le}},S=D=>{if(l.mode!=="roam")return null;const Le=C(D);if(Math.abs(l.roamPos.y-(ce(Le.x,Le.z)+Vn))>4.2)return null;const _e=D.axis==="ns"?0:D.dir,Ee=D.axis==="ns"?D.dir:0,$=l.roamPos.x-Le.x,K=l.roamPos.z-Le.z,be=$*_e+K*Ee,Ae=D.axis==="ns"?$:K,Be=Math.abs(Ae),tt=Math.hypot($,K),Nt=D.mesh?.userData?.colliderHalfW||2,st=D.mesh?.userData?.colliderHalfD||3;return tt<Ln+Math.max(Nt,st)*.55||be>-1.5&&be<st+4.2&&Be<Ln+Nt*.85?{crash:!0}:be>0&&be<30&&Be<c*.36?{avoidOffset:(Ae>=0?-1:1)*D.maxAvoidOffset,stop:be<13&&Be<Ln+Nt*.95}:null},b=(D,Le)=>`${Math.round(D)},${Math.round(Le)}`,L=(D,Le)=>{const _e=((Le+D.phase)%15.5+15.5)%15.5;return _e<6.2?"ns":_e<7.4?"yellow-ns":_e<13.6?"ew":"yellow-ew"},I=(D,Le)=>{const _e=D.axis==="ns"?D.road:D.next,Ee=D.axis==="ns"?D.next:D.road,$=b(_e,Ee),K=h.get($);if(!K)return null;if(K.type==="signal"){const be=L(K,Le),Ae=be===`yellow-${D.axis}`;return be===D.axis&&!Ae?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&D.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},V=(D,Le=!1)=>{const _e=D.axis,Ee=D.along,$=_e==="ns"?x:M,K=D.road,be=T($,K),Ae=[],Be=_e==="ns"?y:g,tt=_e==="ns"?v:u;!Le&&Ee+D.dir*o>=Be&&Ee+D.dir*o<=tt&&Ae.push({axis:_e,road:D.road,along:Ee,dir:D.dir,turn:!1}),be>0&&Ae.push({axis:_e==="ns"?"ew":"ns",road:Ee,along:K,dir:-1,turn:!0}),be<$.length-1&&Ae.push({axis:_e==="ns"?"ew":"ns",road:Ee,along:K,dir:1,turn:!0}),Ae.length||Ae.push({axis:_e,road:D.road,along:Ee,dir:-D.dir,turn:!0});const Nt=Ae.filter(Ft=>Ft.turn),st=!Le&&Nt.length&&Math.random()<.42?_(Nt):_(Ae);(st.turn||st.axis!==_e)&&ye.turns++,D.axis=st.axis,D.road=st.road,D.along=st.along,D.dir=st.dir,D.laneOffset=E(D.dir),D.next=R(D.axis,D.along,D.dir),D.turnBlend=st.turn?1:0,D.lastControlKey=null};for(let D=0;D<m;D++){const Le=Math.random()<.56?"ns":"ew",_e=f[D%f.length],Ee=Math.random()<.5?-1:1,$=(_e==="bus"||_e==="boxTruck"?10:13)+Math.random()*9,K={axis:Le,dir:Ee,type:_e,road:_(Le==="ns"?x:M),laneOffset:E(Ee),along:_(Le==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:ol(_e,d[D*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,D<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][D%4],K.along=318-D*54,K.speed+=3),K.next=R(K.axis,K.along,K.dir),Sn.push(K.collider),p.push(K),th.push(K),n.add(K.mesh),ye.types[_e]=(ye.types[_e]||0)+1}function j(D,Le=0,_e=0){if(D.stolen)return;let Ee=Math.max(0,D.speed*_e);D.panicT>0?(D.panicT-=_e,Ee*=.32,D.brakePulse=1,D.avoidOffset+=(Math.sign(D.laneOffset||1)*2.1-D.avoidOffset)*Math.min(1,_e*3),D.honked||(D.honked=!0,Jv())):D.honked=!1;const $=S(D);for($?.crash?(w0(D,l.roamPos),Ee=0):$?(D.avoidOffset+=($.avoidOffset-D.avoidOffset)*Math.min(1,_e*4.5),D.brakePulse=Math.max(D.brakePulse||0,$.stop?1:.35),$.stop&&(D.waitTimer=Math.max(D.waitTimer,.22),Ee=0)):D.avoidOffset+=(0-D.avoidOffset)*Math.min(1,_e*1.8),D.crashTimer>0&&(D.crashTimer=Math.max(0,D.crashTimer-_e),Ee=0),D.waitTimer>0&&(D.waitTimer=Math.max(0,D.waitTimer-_e),Ee=0);Ee>0;){const B=I(D,Le);if(B){const vt=D.next-D.dir*(B.kind==="signal"?12:8),zt=(vt-D.along)*D.dir;if(zt>=-.35&&zt<=Ee+.25){D.along=vt,D.brakePulse=1,Ee=0,B.kind==="stop"&&(D.waitTimer=.65+Math.random()*.4,D.lastControlKey=B.key);break}}const yt=Math.abs(D.next-D.along);if(Ee<yt)D.along+=D.dir*Ee,Ee=0;else{D.along=D.next,Ee-=yt;const vt=D.next<=(D.axis==="ns"?y:g)+.05||D.next>=(D.axis==="ns"?v:u)-.05;V(D,vt)}}D.brakePulse=Math.max(0,(D.brakePulse||0)-_e*3.2),D.turnBlend=Math.max(0,D.turnBlend-_e*3.2);const{x:K,z:be}=C(D),Ae=D.axis==="ns"?0:D.dir,Be=D.axis==="ns"?D.dir:0;D.mesh.position.set(K,ce(K,be)+.28+Math.sin(Le*3.2+D.bob)*.035,be);const tt=Math.atan2(-Ae,-Be),Nt=Math.atan2(Math.sin(tt-D.mesh.rotation.y),Math.cos(tt-D.mesh.rotation.y));D.mesh.rotation.y+=Nt*Math.min(1,_e*7+D.turnBlend*.55),D.crashTimer>0&&(D.mesh.rotation.y+=Math.sin(Le*22+D.bob)*.02);for(const B of D.mesh.userData.wheels||[])B.rotation.x-=D.dir*D.speed*_e*1.7;const st=D.mesh.userData.colliderHalfD,Ft=D.mesh.userData.colliderHalfW;D.collider.x=K,D.collider.z=be,D.collider.hw=D.axis==="ns"?Ft:st,D.collider.hd=D.axis==="ns"?st:Ft,D.collider.maxY=D.mesh.position.y+3.2}for(const D of p)j(D,0,0);ye.traffic=p.length,mn(n,(D,Le)=>{for(const _e of p)j(_e,D,Le)});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],Z=[],ne=45;for(let D=0;D<ne;D++){const Le=Math.random()<.56?"ns":"ew",_e=e[Math.random()*e.length|0],Ee=Math.abs(_e.z1-_e.z0)>Math.abs(_e.x1-_e.x0),$=Le==="ns"?Ee?"ns":"ew":Ee?"ew":"ns",K=Math.random()<.5?-1:1,be=Math.random()<.5?-1:1,Ae={axis:$,dir:K,sideSign:be,coord:_($==="ns"?x:M),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Wf(te[D%te.length],q[D*2%q.length])};D<14&&(Ae.axis="ns",Ae.coord=80,Ae.sideSign=D%2?-1:1,Ae.dir=D%3===0?1:-1,Ae.along=350-D*24,Ae.speed=1.5+D%4*.35),Z.push(Ae),Cr.push(Ae),Ae.mesh.traverse(Be=>Be.castShadow=!1),n.add(Ae.mesh)}const fe=new Rt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:Mt}),ve=new Rt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:Mt});for(let D=0;D<18;D++){const Le=new it,_e=new O(new xn(1,12),fe.clone());_e.rotation.x=-Math.PI/2,Le.add(_e);for(let Ee=0;Ee<7;Ee++){const $=new O(new xn(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Ee)*(.6+Math.random()*1.2),.01,Math.sin(Ee*1.7)*(.5+Math.random()*1.1)),Le.add($)}Le.visible=!1,Le.userData.life=0,Le.userData.maxLife=2.8,Le.position.y=-99,n.add(Le),wa.push(Le)}function qe(D,Le=0,_e=0){if(!D.active)if(D.respawn-=_e,D.respawn<=0)D.active=!0,D.mesh.visible=!0,D.along+=D.dir*50;else return;D.along+=D.dir*D.speed*_e,D.axis==="ns"?(D.along<r-28&&(D.along=a+28),D.along>a+28&&(D.along=r-28)):(D.along<i-28&&(D.along=s+28),D.along>s+28&&(D.along=i-28));const Ee=D.sideSign*(c*.66+1.2),$=D.axis==="ns"?D.coord+Ee:D.along,K=D.axis==="ns"?D.along:D.coord+Ee,be=D.axis==="ns"?0:D.dir,Ae=D.axis==="ns"?D.dir:0;D.x=$,D.z=K,D.mesh.position.set($,ce($,K)+.08,K),D.mesh.rotation.y=Math.atan2(-be,-Ae);const Be=Math.sin(Le*7+D.phase);for(const tt of D.mesh.userData.limbs||[])tt.mesh.rotation.x=Be*tt.amp*tt.side,tt.mesh.position.y=tt.baseY+Math.abs(Be)*.025}for(const D of Z)qe(D,0,0);ye.pedestrians=Z.length,mn(n,(D,Le)=>{for(const _e of Z)qe(_e,D,Le);for(const _e of wa){if(!_e.visible)continue;_e.userData.life-=Le;const Ee=_e.userData.life,$=me.clamp(Ee/_e.userData.maxLife,0,1);_e.scale.setScalar(1+(1-$)*.35),_e.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Ee<=0&&(_e.visible=!1)}})}function xM(){const n=new it,e=new Ut;new ji().setFromAxisAngle(new P(1,0,0),-Math.PI/2),ye.roadDetails={},ye.buildingArchetypes={},ye.zones={},ye.openerProps=0;const t=ke.x0,i=ke.x1,s=ke.zNear,a=ke.zFar,r=ke.pitch,o=ke.streetW,c=r-o,h=[],d=[];for(let z=t;z<=i+1;z+=r)h.push(Math.round(z));for(let z=s;z>=a-1;z-=r)d.push(Math.round(z));const f=[];for(const z of h)f.push({x0:z,z0:s,x1:z,z1:a});for(const z of d)f.push({x0:t,z0:z,x1:i,z1:z});function p(z,N){const Y=z.x1-z.x0,ee=z.z1-z.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,w=Y/ie;return{x0:z.x0+le*N,z0:z.z0+w*N,x1:z.x1+le*N,z1:z.z1+w*N}}function m(z,N,Y){const ee=[],ie=[];for(const w of z){const F=w.x1-w.x0,G=w.z1-w.z0,X=Math.hypot(F,G),k=Math.max(1,Math.round(X/14)),oe=F/X,re=-(G/X),Q=oe;let de=null,Re=null;for(let Ve=0;Ve<=k;Ve++){const Pe=Ve/k,ze=Pe*X/68,ft=w.x0+F*Pe,bt=w.z0+G*Pe,Ct=ft+re*N,wt=bt+Q*N,$e=ft-re*N,Pt=bt-Q*N,pt=[Ct,ce(Ct,wt)+Y,wt,ze],Jt=[$e,ce($e,Pt)+Y,Pt,ze];de&&(ee.push(de[0],de[1],de[2],Re[0],Re[1],Re[2],Jt[0],Jt[1],Jt[2]),ee.push(de[0],de[1],de[2],Jt[0],Jt[1],Jt[2],pt[0],pt[1],pt[2]),ie.push(0,de[3],1,Re[3],1,Jt[3]),ie.push(0,de[3],1,Jt[3],0,pt[3])),de=pt,Re=Jt}}const le=new Yt;return le.setAttribute("position",new _t(ee,3)),le.setAttribute("uv",new _t(ie,2)),le.computeVertexNormals(),le}const x=(dn.roadMat=new W({map:iM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:Mt}),dn.roadMat),M=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),u=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),_=[],E=[];for(const z of f)_.push(p(z,o*.5+3.3),p(z,-13.3)),E.push(p(z,o*.5+.42),p(z,-10.42));const T=new O(m(_,2.9,.66),M);T.receiveShadow=!0,n.add(T);const R=new O(m(E,.28,.78),g);R.receiveShadow=!0,n.add(R),rs("roadDetails","sidewalkRuns",_.length),rs("roadDetails","curbRuns",E.length);const C=new O(m(f,o/2,.55),x);C.receiveShadow=!0,n.add(C);const S=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:Mt});n.add(new O(m(f,.4,.62),S));let b=0,L=0,I=0;for(let z=1;z<h.length-1;z++)for(let N=1;N<d.length-1;N++){const Y=h[z],ee=d[N];if(!(Rn(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const le=new O(new xe(o*.92,.07,1.15),u);le.position.set(Y,ce(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const w=new O(new xe(1.15,.07,o*.92),u);w.position.set(Y+ie*13,ce(Y+ie*13,ee)+.83,ee),w.receiveShadow=!0,n.add(w),b+=2}}const V=new Fh;V.moveTo(0,5.8),V.lineTo(2.5,1.6),V.lineTo(.72,1.6),V.lineTo(.72,-5.2),V.lineTo(-.72,-5.2),V.lineTo(-.72,1.6),V.lineTo(-2.5,1.6),V.closePath();const j=new el(V);j.rotateX(-Math.PI/2);for(const z of f){const N=Math.abs(z.x1-z.x0)<Math.abs(z.z1-z.z0),Y=Math.hypot(z.x1-z.x0,z.z1-z.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,w=z.x0+(z.x1-z.x0)*le,F=z.z0+(z.z1-z.z0)*le;if(Rn(w,F,4).clearance<2)continue;const G=new O(j,y);if(G.position.set(w,ce(w,F)+.86,F),G.rotation.y=N?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),L++,ie%2===0){const X=new O(new je(1.05,1.05,.08,24),v);X.position.set(w+(N?3.8:0),ce(w,F)+.84,F+(N?0:3.8)),n.add(X),I++}}}rs("roadDetails","crosswalks",b),rs("roadDetails","laneArrows",L),rs("roadDetails","manholes",I);const te=new Rt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:Mt,blending:ti}),q=new Rt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:Mt,blending:ti});for(let z=0;z<120;z++){const N=f[Math.random()*f.length|0],Y=Math.random(),ee=N.x0+(N.x1-N.x0)*Y,ie=N.z0+(N.z1-N.z0)*Y;if(Rn(ee,ie,4).clearance<2)continue;const le=new O(new xn(1,18),(z%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(N.x1-N.x0,N.z1-N.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*o*.7,ce(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const Z=[ga(160,320,.5),ga(160,320,.62),ga(160,320,.42)],ne=[new W({map:Z[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:Z[0],emissiveIntensity:.34}),new W({map:Z[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:Z[1],emissiveIntensity:.32}),new W({map:Z[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:Z[2],emissiveIntensity:.36})],fe=new xe(1,1,1),ve=[[],[],[]],qe=[],D=[],Le=[],_e=[],Ee=[],$=[],K=[],be=[],Ae=[],Be=[],tt=[],Nt=[],st=[],Ft=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=aM(256,256,"#dbcdb8"),yt=rM(),vt=oM(),zt=[Jl(512,384,"#944737","#2e95bf"),Jl(512,384,"#7e4d3e","#d04d65"),Jl(512,384,"#a65a35","#4fba6d")],Je=lM();function kt(z,N){rs("zones",z),rs("buildingArchetypes",N)}function ot(z,N,Y,ee,ie,le="downtown"){if(Pn(z,N,Y,ee))return!1;const w=va(z,N,Y,ee)-1.1;if(Ds(z,N,Y,ee,w+ie+2))return!1;if(e.position.set(z,w+ie/2,N),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(z,w+ie+.6,N),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),qe.push(e.matrix.clone()),ie>26){const F=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(z,w+ie+1.35,N+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),D.push(e.matrix.clone()),Le.push(F);Math.random()<.34&&_e.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const F=Math.random()<.5?"x":"z";Ee.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const F=Math.random()<.5?"x":"z";$.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}return sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),kt(le,ie>64?"glassTower":"midrise"),!0}function gt(z,N,Y,ee,ie,le="residential"){if(Pn(z,N,Y,ee))return!1;const w=va(z,N,Y,ee)-.55,F=2+Math.random()*2.4;if(Ds(z,N,Y,ee,w+ie+F+1.5,6))return!1;e.position.set(z,w+ie/2,N),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),K.push(e.matrix.clone()),sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+F+1.5}),be.push(Ft[Math.random()*Ft.length|0]),e.position.set(z,w+ie+F/2,N),e.scale.set(Y*.82,F,ee*.82),e.updateMatrix(),Ae.push(e.matrix.clone());const G=t+Math.round((z-t)/r)*r,X=s-Math.round((s-N)/r)*r,k=Math.abs(z-G)<Math.abs(N-X),oe=k?G>z?1:-1:X>N?1:-1,re=Math.min(k?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),de=Math.min(24,Math.max(8,k?Math.abs(G-z)-Y*.5-o*.35:Math.abs(X-N)-ee*.5-o*.35));e.quaternion.identity(),k?(e.position.set(z+oe*(Y*.5+.1),w+Q*.5+.1,N-ee*.16),e.scale.set(.24,Q,re),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(z+oe*(Y*.5+de*.5),ce(z+oe*(Y*.5+de*.5),N)+.08,N-ee*.16),e.scale.set(de,.08,re*1.18)):(e.position.set(z-Y*.16,w+Q*.5+.1,N+oe*(ee*.5+.1)),e.scale.set(re,Q,.24),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(z-Y*.16,ce(z,N+oe*(ee*.5+de*.5))+.08,N+oe*(ee*.5+de*.5)),e.scale.set(re*1.18,.08,de)),e.updateMatrix(),tt.push(e.matrix.clone()),e.position.set(z,w+.02,N),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),Nt.push(e.matrix.clone());for(let Re=0;Re<3;Re++){const Ve=k?z+oe*(Y*.55):z+(Re-1)*Y*.25,Pe=k?N+(Re-1)*ee*.28:N+oe*(ee*.55);e.position.set(Ve,ce(Ve,Pe)+.55,Pe);const ze=.85+Math.random()*.75;e.scale.set(ze*1.35,ze,ze*1.35),e.updateMatrix(),st.push(e.matrix.clone())}return kt(le,"residentialHouse"),!0}function U(z,N,Y,ee,ie,le="commercial"){if(Pn(z,N,Y,ee))return!1;const w=va(z,N,Y,ee)-.8;if(Ds(z,N,Y,ee,w+ie+2,7))return!1;const F=new W({map:Je,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(z,w+ie/2,N),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),k=new O(new xe(Y*.72,.32,ee*.18),X);k.position.set(z,w+ie*.38,N+ee*.18),k.rotation.z=.13,n.add(k);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let re=5;re<ie;re+=9){const Q=new O(new xe(Y*1.02,.24,.22),oe);Q.position.set(z,w+re,N+ee*.5+.14),n.add(Q)}return sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),kt(le,"parkingGarage"),!0}function A(z,N,Y,ee,ie,le="commercial"){if(Pn(z,N,Y,ee))return!1;const w=va(z,N,Y,ee)-.65;if(Ds(z,N,Y,ee,w+ie+2,7))return!1;const F=new W({map:zt[Math.random()*zt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(z,w+ie/2,N),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new O(new xe(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(z,w+ie+.45,N),n.add(X);const k=t+Math.round((z-t)/r)*r,oe=s-Math.round((s-N)/r)*r,re=Math.abs(z-k)<Math.abs(N-oe),Q=re?k>z?1:-1:oe>N?1:-1,de=ds[(z+N|0)%ds.length]||"#ffd45b",Re=new Rt({map:Kl(hs[(Math.abs(z)+Math.abs(N)|0)%hs.length],de),transparent:!0,side:Mt,depthWrite:!1}),Ve=new O(new Zt(Math.min(16,re?ee*.82:Y*.82),4.2),Re);return re?(Ve.position.set(z+Q*(Y*.5+.2),w+ie*.66,N),Ve.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(Ve.position.set(z,w+ie*.66,N+Q*(ee*.5+.2)),Ve.rotation.y=Q<0?Math.PI:0),n.add(Ve),Is("storefront-sign",Ve.position.x,Ve.position.y,Ve.position.z),sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),kt(le,"brickStorefront"),!0}for(let z=t+r/2;z<=i-r/2;z+=r)for(let N=s-r/2;N>=a+r/2;N-=r){const Y=Rn(z,N,c*.5).clearance;if(Y<2)continue;const ee=N>40&&N<380&&z>-360&&z<360,ie=ee?"showcase":N<-920?"industrial":Y>230||N<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=c/3;for(let w=0;w<3;w++)for(let F=0;F<3;F++){if(Math.random()<.08)continue;const G=z-c/2+le*(w+.5)+(Math.random()-.5)*le*.3,X=N-c/2+le*(F+.5)+(Math.random()-.5)*le*.3;if(Rn(G,X,8).clearance<1)continue;const k=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?ot(G,X,k*.9,oe*.9,12+Math.random()*12,ie):gt(G,X,k,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,w=le?me.clamp(58+Y*1.15,68,205):me.clamp(22+Y*.3,22,66),F=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<F;G++){const X=15+Math.random()*Math.min(30,c*.46),k=15+Math.random()*Math.min(30,c*.46),oe=z+(Math.random()-.5)*(c-X),re=N+(Math.random()-.5)*(c-k);if(Rn(oe,re,Math.hypot(X,k)*.5).clearance<2)continue;const Q=(18+Math.random()*(w-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&A(oe,re,Math.max(18,X*1.12),Math.max(18,k*1.08),12+Math.random()*14,ie)||Math.random()<.18&&U(oe,re,Math.max(24,X*1.35),Math.max(24,k*1.28),24+Math.random()*24,ie))||ot(oe,re,X,k,Q,ie)}}}for(let z=0;z<3;z++){if(!ve[z].length)continue;const N=new on(fe,ne[z],ve[z].length);for(let Y=0;Y<ve[z].length;Y++)N.setMatrixAt(Y,ve[z][Y]);N.instanceMatrix.needsUpdate=!0,N.castShadow=!0,N.receiveShadow=!0,n.add(N)}if(qe.length){const z=new W({color:2896696,roughness:.62,metalness:.34}),N=new on(fe,z,qe.length);for(let Y=0;Y<qe.length;Y++)N.setMatrixAt(Y,qe[Y]);N.instanceMatrix.needsUpdate=!0,n.add(N)}if(D.length){const z=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),N=new on(fe,z,D.length);for(let Y=0;Y<D.length;Y++)N.setMatrixAt(Y,D[Y]),N.setColorAt(Y,new rt(Le[Y]));N.instanceMatrix.needsUpdate=!0,N.instanceColor&&(N.instanceColor.needsUpdate=!0),n.add(N)}if(K.length){const z=new W({color:4891451,roughness:.88,metalness:.02}),N=new on(fe,z,Nt.length);for(let Q=0;Q<Nt.length;Q++)N.setMatrixAt(Q,Nt[Q]);N.instanceMatrix.needsUpdate=!0,N.receiveShadow=!0,n.add(N);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new on(fe,Y,tt.length);for(let Q=0;Q<tt.length;Q++)ee.setMatrixAt(Q,tt[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:B,roughness:.78,metalness:.03}),le=new on(fe,ie,K.length);for(let Q=0;Q<K.length;Q++)le.setMatrixAt(Q,K[Q]),le.setColorAt(Q,new rt(be[Q]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const w=new Ai(.72,1,4);w.rotateY(Math.PI/4);const F=new W({map:yt,color:14314033,roughness:.72}),G=new on(w,F,Ae.length);for(let Q=0;Q<Ae.length;Q++)G.setMatrixAt(Q,Ae[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:vt,roughness:.38,metalness:.18}),k=new on(fe,X,Be.length);for(let Q=0;Q<Be.length;Q++)k.setMatrixAt(Q,Be[Q]);k.instanceMatrix.needsUpdate=!0,n.add(k);const oe=new W({color:3112239,roughness:.88,metalness:.02}),re=new on(new Kt(1,8,6),oe,st.length);for(let Q=0;Q<st.length;Q++)re.setMatrixAt(Q,st[Q]);re.instanceMatrix.needsUpdate=!0,re.castShadow=!0,re.receiveShadow=!0,n.add(re)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let z=0;z<Math.min(_e.length,34);z++){const N=_e[z],Y=J[z%J.length],ee=z%3===0?"#ff4fb7":z%3===1?"#4ff3ff":"#ffd45b",ie=new Rt({map:_u(Y,ee),transparent:!0,side:Mt,depthWrite:!1}),le=new O(new Zt(8,24),ie);le.position.set(N.px,N.gy+Math.max(14,N.h*.58),N.pz+N.zSide*(N.d*.5+.25)),le.rotation.y=N.zSide<0?Math.PI:0,n.add(le),Is("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let z=0;z<Math.min(Ee.length,48);z++){const N=Ee[z],Y=hs[(z*5+2)%hs.length],ee=ds[(z*2+1)%ds.length],ie=new Rt({map:Kl(Y,ee),transparent:!0,side:Mt,depthWrite:!1}),le=Math.min(17,(N.axis==="x"?N.d:N.w)*.82),w=new O(new Zt(le,4.7),ie),F=N.gy+Math.max(6.2,Math.min(N.h-3.5,N.h*(.28+z%3*.12)));N.axis==="x"?(w.position.set(N.px+N.side*(N.w*.5+.22),F,N.pz),w.rotation.y=N.side>0?Math.PI/2:-Math.PI/2):(w.position.set(N.px,F,N.pz+N.side*(N.d*.5+.22)),w.rotation.y=N.side<0?Math.PI:0),n.add(w),Is("wall-sign",w.position.x,w.position.y,w.position.z)}for(let z=0;z<Math.min($.length,18);z++){const N=$[z],Y=hs[(z*7+4)%hs.length],ee=Ho[(z*5+3)%Ho.length],ie=ds[(z+3)%ds.length],le=new it,w=new W({map:Of(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),F=Math.min(18,(N.axis==="x"?N.d:N.w)*.86),G=new O(new xe(F,5.2,.42),w);G.position.y=4.8,le.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const k of[-F*.34,F*.34]){const oe=new O(new je(.13,.17,5,8),X);oe.position.set(k,2.25,-.2),le.add(oe)}le.position.set(N.px,N.gy+N.h+.7,N.pz),le.rotation.y=N.axis==="x"?N.side>0?Math.PI/2:-Math.PI/2:N.side<0?Math.PI:0,n.add(le),Is("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const he=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=gs([new xe(2.2,.72,4.6).translate(0,.78,0),new xe(1.7,.56,2.15).translate(0,1.42,-.22)]),ae=gs([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([z,N])=>new je(.36,.36,.3,10).rotateZ(Math.PI/2).translate(z,.38,N))),Qe=130,De=new on(ge,new W({roughness:.42,metalness:.36}),Qe),nt=new on(ae,new W({color:1512727,roughness:.9}),Qe);let Ye=0,Me=0;for(;Ye<Qe&&Me<Qe*6;){Me++;const z=Math.random()<.5,N=z?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=z?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.26);if(Rn(N,Y,4).clearance<2)continue;const ee=ce(N,Y)+.06;e.position.set(N,ee,Y),e.quaternion.setFromAxisAngle(jt,z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),De.setMatrixAt(Ye,e.matrix),nt.setMatrixAt(Ye,e.matrix),De.setColorAt(Ye,new rt(he[Math.random()*he.length|0])),Tn.spots.push({x:N,z:Y,yaw:z?0:-Math.PI/2,idx:Ye,taken:!1}),Ye++}De.count=Ye,nt.count=Ye,De.instanceMatrix.needsUpdate=!0,nt.instanceMatrix.needsUpdate=!0,De.instanceColor&&(De.instanceColor.needsUpdate=!0),De.castShadow=!0,Tn.im=De,Tn.imW=nt,n.add(De),n.add(nt);const Ce=new Map,ht=(z,N)=>`${Math.round(z)},${Math.round(N)}`;function ct(z,N){const Y=((N+z.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function We(){const z=[],N=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=cM(),ie=new Rt({map:ee,transparent:!0,side:Mt}),le=new W({color:5050642,roughness:.48,metalness:.12}),w=(re,Q)=>new W({color:re,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),F=(re,Q,de,Re,Ve,Pe)=>{const ze=new it,ft=new O(new xe(1.15,2.85,.75),Y);ze.add(ft);const bt=w(16724008,16717836),Ct=w(16767053,16757276),wt=w(4521842,1693789),$e=[bt,Ct,wt];for(let Pt=0;Pt<3;Pt++){const pt=new O(new Kt(.28,12,8),$e[Pt]);pt.position.set(0,.78-Pt*.78,-.42),ze.add(pt)}ze.position.set(de,Re,Ve),ze.rotation.y=Pe,re.add(ze),z.push({axis:Q,red:bt,yellow:Ct,green:wt,control:re.userData.control})},G=(re,Q,de)=>{const Re=ht(re,Q),Ve={type:"signal",x:re,z:Q,phase:de%4*2.1};Ce.set(Re,Ve);const Pe=ce(re,Q),ze=new it;ze.userData.control=Ve;const ft=o*.72,bt=o*.72,Ct=new O(new je(.18,.24,8.2,8),N);Ct.position.set(ft,4.1,bt),ze.add(Ct);const wt=new O(new xe(o*1.65,.2,.2),N);wt.position.set(ft-o*.72,8,bt),ze.add(wt);const $e=new O(new xe(.2,.2,o*1.65),N);$e.position.set(ft,7.55,bt-o*.72),ze.add($e),F(ze,"ns",ft-o*1.24,7.52,bt,0),F(ze,"ns",ft-o*.18,7.52,-bt,Math.PI),F(ze,"ew",ft,7.05,bt-o*1.24,Math.PI/2),F(ze,"ew",-ft,7.05,bt-o*.18,-Math.PI/2),ze.position.set(re,Pe,Q),ze.traverse(Pt=>{Pt.castShadow=!0,Pt.receiveShadow=!0}),n.add(ze)},X=(re,Q,de)=>{const Re=ht(re,Q);Ce.set(Re,{type:"stop",x:re,z:Q,phase:0});const Ve=ce(re,Q),Pe=new it,ze=de%2?-1:1,ft=de%3?1:-1,bt=new O(new je(.12,.16,4.2,7),N);bt.position.y=2.1,Pe.add(bt);const Ct=new O(new xn(1.04,8),le);Ct.position.y=4.55,Ct.rotation.y=Math.PI,Pe.add(Ct);const wt=new O(new Zt(2.05,2.05),ie);wt.position.set(0,4.55,-.04),Pe.add(wt),Pe.position.set(re+ze*o*.74,Ve,Q+ft*o*.74),Pe.rotation.y=Math.atan2(ze,ft),Pe.traverse($e=>{$e.castShadow=!0,$e.receiveShadow=!0}),n.add(Pe)};let k=0,oe=0;for(let re=1;re<h.length-1;re++)for(let Q=1;Q<d.length-1;Q++){const de=h[re],Re=d[Q];if(Rn(de,Re,o*.9).clearance<2)continue;const Ve=Math.abs(de-80)<=r*1.05&&Re<=s&&Re>=-560,Pe=Re<-260&&Re>-1180&&(re+Q)%4===0,ze=Re>-360&&(re+Q)%2===0;Ve&&Q%2===0||Pe?G(de,Re,k++):(ze||(re+Q)%5===0&&Re>-820)&&X(de,Re,oe++)}return mn(n,re=>{for(const Q of z){const de=ct(Q.control,re);Q.red.emissiveIntensity=de.green===Q.axis||de.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=de.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=de.green===Q.axis?2.6:.1}}),{trafficLights:k,stopSigns:oe}}const dt=We();mM(n,f,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:o,trafficControls:Ce}),ye.trafficLights=dt.trafficLights,ye.stopSigns=dt.stopSigns;const H=new je(.12,.16,7.2,7),Ge=new Kt(.46,10,8),Oe=new Zt(2.8,13),Fe=new W({color:1581353,roughness:.42,metalness:.68}),we=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),pe=new Rt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:Mt,blending:ti}),Ke=sM(),ut=new Ph({map:Ke,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:ti}),Ot=132,Dt=new on(H,Fe,Ot),Fn=new on(Ge,we,Ot),En=new on(Oe,pe,Ot);let ai=0;for(let z=0;z<Ot*2&&ai<Ot;z++){const N=Math.random()<.5,Y=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.58);if(Rn(Y,ee,3).clearance<2)continue;const ie=ce(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Dt.setMatrixAt(ai,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Fn.setMatrixAt(ai,e.matrix);const le=new qc(ut);le.position.set(Y,ie+7.5,ee);const w=6.2+Math.random()*2.4;le.scale.set(w,w,1),n.add(le),ps.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),En.setMatrixAt(ai,e.matrix),ai++}Dt.count=ai,Fn.count=ai,En.count=ai,Dt.instanceMatrix.needsUpdate=!0,Fn.instanceMatrix.needsUpdate=!0,En.instanceMatrix.needsUpdate=!0,n.add(Dt,Fn,En),ye.streetLights=ai,n.add(new O(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new O(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const Vr=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let z=330;z>=-700;z-=32){const N=new O(new xe(1.15,.09,13.5),Vr);N.position.set(80,ce(80,z)+.9,z),N.receiveShadow=!0,n.add(N)}for(const z of[286,156,26,-104])for(let N=0;N<7;N++){const Y=new O(new xe(2,.08,11.8),u),ee=71.2+N*2.95;Y.position.set(ee,ce(ee,z)+.91,z),Y.receiveShadow=!0,n.add(Y),rs("roadDetails","openerCrosswalkStripes")}function ka(z,N,Y,ee=!1){const ie=ce(z,N),le=new it,w=new O(new je(.16,.22,9.5,8),Fe);w.position.y=4.75,le.add(w);const F=new O(new xe(3.8,.22,.22),Fe);F.position.set(Y*1.75,8.95,0),le.add(F);const G=new O(new Kt(.62,12,8),we);G.position.set(Y*3.6,8.82,0),le.add(G);const X=new qc(ut.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),le.add(X),ps.streetGlowSprites++;const k=new O(new Zt(3.2,15),pe.clone());if(k.position.set(Y*2.8,.72,0),k.rotation.x=-Math.PI/2,k.scale.y=.7+Math.random()*.35,le.add(k),ee){const oe=new Oh(16762474,4.4,66,2);oe.position.copy(G.position),le.add(oe)}le.position.set(z,ie,N),n.add(le),ye.streetLights++}let _i=0;for(let z=340;z>=-700;z-=118)ka(63,z,1,_i++%3===0),ka(97,z-42,-1,_i++%3===0);function yi(z,N,Y,ee,ie=6010942){const le=new W({color:ie,roughness:.92,metalness:.01}),w=new O(new xe(Y,.08,ee),le);return w.position.set(z,ce(z,N)+.06,N),w.receiveShadow=!0,n.add(w),ye.openerProps++,w}function bi(z,N,Y=1){const ee=ce(z,N),ie=new it,le=new O(new je(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const w=new W({color:6065982,roughness:.86}),F=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[k,oe,re,Q]=G[X],de=new O(new Kt(Q,12,8),X%2?F:w);de.position.set(k,oe,re),de.scale.y=.78,de.castShadow=!0,ie.add(de)}return ie.position.set(z,ee,N),ie.scale.setScalar(Y),n.add(ie),fi.push({kind:"tree",x:z,z:N,radius:3.4*Y,maxY:ee+11*Y}),ye.openerProps++,ie}function Va(z,N,Y=0){const ee=new it,ie=new W({color:10970418,roughness:.64,metalness:.04}),le=new W({color:1910317,roughness:.46,metalness:.5});for(const w of[1.05,1.55]){const F=new O(new xe(6.8,.22,.44),ie);F.position.y=w,ee.add(F)}for(const w of[-2.7,2.7]){const F=new O(new xe(.22,1.2,.35),le);F.position.set(w,.62,0),ee.add(F)}ee.position.set(z,ce(z,N),N),ee.rotation.y=Y,n.add(ee),ye.openerProps++}function Ks(z,N){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new it,ie=new O(new je(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new O(new Kt(.42,12,8),Y);le.position.y=1.32,ee.add(le);const w=new O(new je(.16,.16,1.1,10),Y);w.rotation.z=Math.PI/2,w.position.y=.9,ee.add(w),ee.position.set(z,ce(z,N),N),n.add(ee),ye.openerProps++}function Gr(z,N,Y=0){const ee=new it,ie=new W({color:1185821,roughness:.36,metalness:.68}),le=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),w=new W({color:2370611,roughness:.42,metalness:.32}),F=new O(new xe(8.5,.35,3.2),w);F.position.y=4.2,ee.add(F);for(const k of[-3.8,3.8]){const oe=new O(new je(.09,.11,4.1,7),ie);oe.position.set(k,2.05,-1.25),ee.add(oe)}const G=new O(new xe(8,2.8,.08),le);G.position.set(0,2.2,1.35),ee.add(G);const X=new O(new Zt(2.3,2.8),new Rt({map:Kl("BUS","#4ff3ff"),transparent:!0,side:Mt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(z,ce(z,N),N),ee.rotation.y=Y,n.add(ee),Is("bus-shelter-ad",z,ce(z,N)+2.2,N),ye.openerProps++}function un(z,N,Y,ee,ie,le,w,F=null,G=0){if(Pn(z,N,Y,ee,12))return!1;const X=ce(z,N)-.45;if(Ds(z,N,Y,ee,X+ie+2))return!1;const k=z<80?1:-1,oe=new W({map:ga(192,512,w),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),re=new O(new xe(Y,ie,ee),oe);re.position.set(z,X+ie/2,N),re.castShadow=!1,re.receiveShadow=!0,n.add(re);const Q=new W({map:ga(220,620,Math.min(.86,w+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:Mt}),de=new O(new Zt(ee*.78,ie*.74),Q);de.position.set(z+k*(Y/2+.09),X+ie*.54,N),de.rotation.y=k>0?Math.PI/2:-Math.PI/2,n.add(de);for(const Pe of[-1,1]){const ze=new O(new Zt(Y*.82,ie*.72),Q.clone());ze.position.set(z,X+ie*.55,N+Pe*(ee/2+.1)),ze.rotation.y=Pe>0?0:Math.PI,n.add(ze)}const Re=new O(new xe(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));Re.position.set(z,X+ie+.7,N),n.add(Re);const Ve=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Pe of[-1,1]){const ze=new O(new xe(Y*1.1,.22,.18),Ve);ze.position.set(z,X+ie+1.4,N+Pe*(ee/2+.18)),n.add(ze)}if(F&&G){const Pe=new Rt({map:_u(F,F==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:Mt,depthWrite:!1}),ze=new O(new Zt(7.5,24),Pe);ze.position.set(z+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),N),ze.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(ze),Is("showcase-neon",ze.position.x,ze.position.y,ze.position.z)}return sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),kt("showcase","glassTower"),!0}function Hr(z,N,Y,ee=3.2){const ie=z*.5+ee,le=N*.5+ee,w=Math.max(2,Math.abs(ie-le)*.72),F=z>=N?[-ie,0,-le,ie,0,-le,w,Y,0,-ie,0,-le,w,Y,0,-w,Y,0,ie,0,-le,ie,0,le,w,Y,0,ie,0,le,-ie,0,le,-w,Y,0,ie,0,le,w,Y,0,-w,Y,0,-ie,0,le,-ie,0,-le,-w,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-w,ie,0,-le,ie,0,le,0,Y,w,ie,0,-le,0,Y,w,0,Y,-w,ie,0,le,-ie,0,le,0,Y,w,-ie,0,le,-ie,0,-le,0,Y,-w,-ie,0,le,0,Y,-w,0,Y,w],G=new Yt;return G.setAttribute("position",new _t(F,3)),G.computeVertexNormals(),G}function Ga(z,N,Y,ee,ie,le,w={}){if(Pn(z,N,Y,ee,12))return!1;const F=ce(z,N)-.3;if(Ds(z,N,Y,ee,F+ie+(w.roofH??8.2)+1,6))return!1;const G=w.frontZ??-1,X=new W({map:B,color:w.wallColor??14734788,roughness:.68,metalness:.03}),k=new O(new xe(Y,ie,ee),X);k.position.set(z,F+ie/2,N),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const oe=new W({map:yt,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),re=w.roofH??8.2,Q=new O(Hr(Y,ee,re),oe);Q.position.set(z,F+ie,N),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const de=new W({color:15985112,roughness:.42,metalness:.05}),Re=new O(new xe(Y+7,.42,1.2),de);Re.position.set(z,F+ie+.12,N+G*(ee*.5+1.4)),n.add(Re);const Ve=Re.clone();Ve.position.z=N-G*(ee*.5+1.4),n.add(Ve);const Pe=Math.min(18,Y*.38),ze=new O(new xe(Pe,ie*.55,.32),new W({map:vt,roughness:.34,metalness:.2}));ze.position.set(z+Y*.18,F+ie*.33,N+G*(ee*.5+.22)),n.add(ze);const ft=new O(new xe(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ft.position.set(z-Y*.25,F+3.7,N+G*(ee/2+.24)),n.add(ft);const bt=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Ct=new W({color:3353638,roughness:.38});for(const Qt of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(Qt-Y*.18)<Pe*.45)continue;const Kn=new O(new xe(6.2,4.8,.26),Ct);Kn.position.set(z+Qt,F+ie*.58,N+G*(ee*.5+.28)),n.add(Kn);const Vt=new O(new xe(4.8,3.4,.3),bt);Vt.position.copy(Kn.position),Vt.position.z+=G*.04,n.add(Vt)}const wt=new W({color:12370619,roughness:.44,metalness:.04}),$e=new O(new xe(Pe*1.18,.12,34),wt);$e.position.set(z+Y*.18,ce(z+Y*.18,N+G*(ee*.5+17))+.11,N+G*(ee*.5+17)),n.add($e);const Pt=new W({color:5679925,roughness:.86,metalness:.01}),pt=new O(new xe(Y+10,.08,ee+12),Pt);pt.position.set(z,ce(z,N)-.18,N),pt.receiveShadow=!0,n.add(pt),pt.renderOrder=-1;const Jt=new W({color:3042609,roughness:.84}),Bi=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let Qt=0;Qt<9;Qt++){const Kn=z-Y*.44+Qt*(Y*.11),Vt=N+G*(ee*.5+2.2+Qt%2*1.5),fn=new O(new Kt(1.35+Qt%3*.22,10,7),Qt%4===0?Bi[Qt%Bi.length]:Jt);fn.position.set(Kn,ce(Kn,Vt)+.95,Vt),fn.scale.y=.72,fn.castShadow=!0,n.add(fn)}return sn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:F+ie+5}),kt("showcase","lowStorefront"),!0}return yi(45,318,36,84,6404169),yi(116,318,36,84,6074179),yi(44,188,34,84,6798662),yi(118,188,36,84,5941822),yi(43,60,34,82,5679164),yi(118,60,36,82,6864197),un(18,315,70,54,154,2311775,.72,"HOTEL",1),un(17,185,72,58,188,1522779,.78,null,0),un(31,55,44,56,138,2840688,.66,"OPEN",1),un(24,-75,52,64,182,1913933,.7,null,0),un(145,315,68,54,116,2776440,.72,null,0),un(146,185,70,58,146,2314602,.76,null,0),un(142,55,42,56,156,1590364,.68,"CAFE",-1),un(134,-75,48,64,114,3688540,.62,null,0),un(-70,315,52,52,146,2112085,.68,null,0),un(228,185,48,58,148,3235186,.66,null,0),un(-78,185,48,56,134,2181730,.68,null,0),un(236,315,44,54,104,3104884,.66,null,0),Ga(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Ga(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),un(-48,-360,54,56,148,2439765,.58,null,0),un(172,-430,50,56,132,3817032,.66,"OPEN",-1),bi(112,227,1.35),bi(104,221,1.05),bi(121,233,1.15),Va(112,217,0),bi(50,292,1.2),bi(111,316,.95),bi(48,137,.9),bi(116,102,1.05),Va(47,248,Math.PI/2),Ks(57,226),Gr(111,260,-Math.PI/2),Te.add(n),n}function Xf(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const o=xt(i),c=new P(o.tangent.x,0,o.tangent.z).normalize(),h=new P().crossVectors(jt,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),f=t==="off"?1:-1,p=d.x+c.x*s*f+h.x*e*a,m=d.z+c.z*s*f+h.z*e*a,x=new P(p,ce(p,m)+.4,m),M=t==="off"?d:x,g=t==="off"?x:d,u=26,y=[];for(let q=0;q<=u;q++){const Z=q/u,ne=Z*Z*(3-2*Z),fe=t==="off"?1-(1-Z)*(1-Z):ne;y.push(new P(me.lerp(M.x,g.x,Z),me.lerp(M.y,g.y,fe),me.lerp(M.z,g.z,Z)))}const v=7.4,_=new P,E=new P,T=[],R=[];for(let q=0;q<=u;q++)E.subVectors(y[Math.min(u,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),_.crossVectors(jt,E).normalize(),T.push(y[q].clone().addScaledVector(_,-v)),R.push(y[q].clone().addScaledVector(_,v));const C={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<u;q++){const Z=y[q],ne=y[q+1],fe=ne.x-Z.x,ve=ne.z-Z.z,qe=Math.max(1e-4,fe*fe+ve*ve);C.segments.push({a:Z.clone(),b:ne.clone(),abx:fe,abz:ve,lenSq:qe,u0:q/u,u1:(q+1)/u})}Zs.push(C);const S=[];for(let q=0;q<u;q++){const Z=T[q],ne=R[q],fe=T[q+1],ve=R[q+1];S.push(Z.x,Z.y,Z.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),S.push(Z.x,Z.y,Z.z,ve.x,ve.y,ve.z,fe.x,fe.y,fe.z)}const b=new Yt;b.setAttribute("position",new _t(S,3)),b.computeVertexNormals();const L=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:Mt});n.add(new O(b,L));const I=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<u;q++)Bn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,I),Bn(n,R[q].clone().setY(R[q].y+1),R[q+1].clone().setY(R[q+1].y+1),.16,I);const V=new W({color:7173241,roughness:.82});for(let q=3;q<u;q+=3){const Z=y[q],ne=ce(Z.x,Z.z),fe=Z.y-ne;if(fe<3||Pn(Z.x,Z.z,3.2,3.2,1.2))continue;const ve=new O(new je(.9,1.15,fe,8),V);ve.position.set(Z.x,ne+fe/2,Z.z),n.add(ve),Qn.push({x:Z.x,z:Z.z,hw:1.3,hd:1.3,maxY:Z.y-.9})}const j=new Rt({map:Wh(r),transparent:!0,side:Mt}),te=new O(new Zt(12,3),j);te.position.copy(t==="off"?d:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const Z=new O(new je(.2,.26,6,6),V),ne=t==="off"?d:x;Z.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(Z)}}function gM(n,e=1){Xf(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function vM(n,e=-1){Xf(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function MM(){const n=new it,e=[],t=new rt(14170671),i=new rt(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Rt({map:_M(),transparent:!0,side:Mt}),r=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:Mt}),h=12,d=[],f=[];let p=0;for(let x=0;x<se.length;x+=h){if(Fi(x+h*.5)){p++;continue}const M=xt(x),g=xt(x+h),u=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:_}=$i(M,g);for(const E of[-1,1]){const T=u.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(T),f.push(_),e.push(p%2===0?t:i)}if(p%16===8){const E=(p>>4)%2?1:-1,T=u.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),R=new it,C=new O(new Zt(4.4,2.6),a);C.position.y=3.4,C.rotation.y=Math.PI,R.add(C);const S=new je(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const L=new O(S,s);L.position.set(b,1.7,0),R.add(L)}R.position.copy(T),R.quaternion.copy(_),n.add(R)}p++}for(let x=0;x<se.length;x+=16){const M=xt(x),g=1+(Math.random()<.5?1:0);for(let u=0;u<g;u++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,_=M.p.x+M.side.x*v*y+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*y+(Math.random()-.5)*16;if(al(_,E,18)||Pn(_,E,12,12,3.5))continue;const T=ce(_,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,C=new it,S=2.4+Math.random()*4.2,b=new O(new je(.26,.42,S,6),r);b.position.y=S/2,C.add(b);const L=2+Math.floor(Math.random()*3);for(let I=0;I<L;I++){const V=new O(new Ai(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(u+I+x)%o.length]);V.position.y=S+I*1.4+1.5,V.rotation.y=Math.random()*Math.PI,C.add(V)}C.position.set(_,T+.6,E),C.scale.setScalar(R),n.add(C)}else{const R=1.4+Math.random()*3.6,C=new O(new Dh(R,0),c);C.position.set(_,T+R*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),n.add(C),Qn.push({kind:"rock",x:_,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(Fi(M))continue;const g=xt(M),u=xt(M+h),y=g.p.clone().add(u.p).multiplyScalar(.5),{q:v}=$i(g,u),_=se.width*.5+1.2,E=9,T=new it,R=new je(.4,.55,E,7);for(const I of[-1,1]){const V=new O(R,s);V.position.set(I*_,E/2,0),T.add(V)}const C=_*2,S=new O(new xe(C,1.1,1.1),s);S.position.y=E,T.add(S);const b=new Rt({map:Wh(m[x]),transparent:!0,side:Mt}),L=new O(new Zt(C*.82,3),b);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(y),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new je(.18,.24,3,6);x.translate(0,1.5,0);const M=new Kt(.34,8,6);M.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),u=new W({roughness:.55}),y=new on(x,g,d.length),v=new on(M,u,d.length),_=new Ut;for(let E=0;E<d.length;E++)_.position.copy(d[E]),_.quaternion.copy(f[E]),_.updateMatrix(),y.setMatrixAt(E,_.matrix),v.setMatrixAt(E,_.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return gM(n),vM(n),Te.add(n),n}function _M(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new rn(n);return t.colorSpace=Lt,t}function Wh(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new rn(e);return i.colorSpace=Lt,i}function yM(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const o=new rn(t);return o.colorSpace=Lt,o}function bM(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new rn(n);return i.colorSpace=Lt,i.wrapS=Un,i.repeat.set(3,1),i}function $t(n,e,t,i,s){const a=new O(new xe(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function $i(n,e){const t=e.p.clone().sub(n.p).normalize(),i=Vh.crossVectors(jt,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new ji().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new Et().makeBasis(i,s,t),o=new ji().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:o}}function bu(n,e,t,i){const s=[],a=[],r=[],o=se.width*.47;let c=0;for(let f=e;f<=t;f+=8){const p=xt(Math.min(f,t)),m=$i(p,xt(p.s+2)),x=Math.sin(f*.018)*.04,M=p.p.clone().addScaledVector(m.sideways,-o).addScaledVector(m.normal,.46+x),g=p.p.clone().addScaledVector(m.sideways,o).addScaledVector(m.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const u=(f-e)/64;if(a.push(0,u,1,u),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new Yt;h.setAttribute("position",new _t(s,3)),h.setAttribute("uv",new _t(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new O(h,i);d.receiveShadow=!0,n.add(d)}function wM(n,e){let t=0;for(const i of se.gaps)bu(n,t,Math.max(t,i.start-4),e),t=i.end+4;bu(n,t,se.length,e)}function SM(n,e,t){const i=xt(e.s+2),{normal:s,q:a}=$i(e,i),r=new it;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const o=new O(new xe(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,r.add(o);const c=new O(new xe(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new O(new xe(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function TM(){const n=new it;Te.add(n),eh=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new W({color:4935486,roughness:.92,metalness:.04}),p=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const u=new W({map:tM(),roughness:.74,metalness:.08}),y=new Rt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;wM(n,u);function _(E,T=!1){if(Fi(E))return!1;const R=xt(E),C=xt(E+3),{sideways:S,normal:b,q:L}=$i(R,C),I=R.p,V=ce(I.x,I.z),j=I.y-.95;if(j-V<10)return!1;const te=se.width*(T?.43:.35),q=j,Z=V+.25,ne=T?.56:.42,fe=T?2.4:1.75,ve=T?.52:.36,qe=[],D=[];for(const be of[-1,1])if(Pn(I.x+S.x*be*te,I.z+S.z*be*te,fe*2.2,fe*2.2,1.2))return!1;for(const be of[-1,1]){const Ae=I.clone().addScaledVector(S,be*te).addScaledVector(b,-.85);Ae.y=q;const Be=new P(Ae.x,Z,Ae.z);Bn(n,Be,Ae,ne,a);const tt=new O(new je(fe,fe*1.12,ve,12),a);tt.position.set(Be.x,V+ve*.5,Be.z),tt.receiveShadow=!0,n.add(tt),qe.push(Ae),D.push(Be),Qn.push({x:Be.x,z:Be.z,hw:fe*.92,hd:fe*.92,maxY:q-.7})}const Le=I.clone().addScaledVector(b,-1.05);Le.y=q,$t(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Le,L,r);const _e=D[0].clone();_e.y+=(q-Z)*.28;const Ee=D[1].clone();Ee.y+=(q-Z)*.28;const $=qe[0].clone();$.y-=1;const K=qe[1].clone();if(K.y-=1,Bn(n,_e,K,T?.18:.14,c),Bn(n,Ee,$,T?.18:.14,c),T){const be=D[0].clone();be.y+=(q-Z)*.58;const Ae=D[1].clone();Ae.y+=(q-Z)*.58,Bn(n,D[0].clone().setY(Z+1.2),Ae,.16,c),Bn(n,D[1].clone().setY(Z+1.2),be,.16,c),Bn(n,be,K,.16,c),Bn(n,Ae,$,.16,c)}return eh++,!0}for(let E=0;E<se.length;E+=v){if(Fi(E+v*.5))continue;const T=xt(E),R=xt(E+v),C=T.p.clone().add(R.p).multiplyScalar(.5),{sideways:S,normal:b,q:L}=$i(T,R),I=T.p.distanceTo(R.p)+.45,V=Math.floor(E/(v*2))%2?e:t;$t(n,new P(se.width,.62,I),C.clone().addScaledVector(b,-.05),L,V),$t(n,new P(se.width-2.8,.08,I*.86),C.clone().addScaledVector(b,.36),L,f),$t(n,new P(.2,.1,I*.76),C.clone().addScaledVector(S,-se.width*.19).addScaledVector(b,.43),L,f),$t(n,new P(.2,.1,I*.76),C.clone().addScaledVector(S,se.width*.19).addScaledVector(b,.43),L,f),E%48===0&&($t(n,new P(.14,.08,I*.62),C.clone().addScaledVector(S,-se.width*.08).addScaledVector(b,.51),L,M),$t(n,new P(.14,.08,I*.62),C.clone().addScaledVector(S,se.width*.08).addScaledVector(b,.51),L,M)),E%120===0&&$t(n,new P(se.width*.42,.07,.72),C.clone().addScaledVector(b,.55),L,g),$t(n,new P(se.width+1.2,.35,I*.94),C.clone().addScaledVector(b,-.56),L,r),$t(n,new P(.42,.42,I*.9),C.clone().addScaledVector(S,-se.width*.36).addScaledVector(b,-.78),L,x),$t(n,new P(.42,.42,I*.9),C.clone().addScaledVector(S,se.width*.36).addScaledVector(b,-.78),L,x);const j=C.clone().addScaledVector(S,-se.width*.51),te=C.clone().addScaledVector(S,se.width*.51);if($t(n,new P(.32,.46,I),j.clone().addScaledVector(b,.28),L,i),$t(n,new P(.32,.46,I),te.clone().addScaledVector(b,.28),L,i),$t(n,new P(.26,.72,I*.94),j.clone().addScaledVector(b,-.22),L,r),$t(n,new P(.26,.72,I*.94),te.clone().addScaledVector(b,-.22),L,r),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const Z=new O(new je(.16,.2,.12,10),o);Z.position.copy(C).addScaledVector(S,q).addScaledVector(b,.46),Z.quaternion.copy(L),Z.castShadow=!1,n.add(Z)}if(E%72===0&&($t(n,new P(.34,1.56,3.4),C.clone().addScaledVector(S,-se.width*.66).addScaledVector(b,1.16),L,s),$t(n,new P(.34,1.56,3.4),C.clone().addScaledVector(S,se.width*.66).addScaledVector(b,1.16),L,s),$t(n,new P(.18,.18,4.4),C.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.94),L,s),$t(n,new P(.18,.18,4.4),C.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.94),L,s),$t(n,new P(.12,.12,4),C.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.38),L,i),$t(n,new P(.12,.12,4),C.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.38),L,i),Bn(n,C.clone().addScaledVector(S,-se.width*.58).addScaledVector(b,-1.08),C.clone().addScaledVector(S,se.width*.58).addScaledVector(b,-1.08),.11,c),Bn(n,C.clone().addScaledVector(S,-se.width*.48).addScaledVector(b,-1),C.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c),Bn(n,C.clone().addScaledVector(S,se.width*.48).addScaledVector(b,-1),C.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new O(new xn(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(C.x,-4.72,C.z),q.scale.set(se.width*.9,Math.max(10,I*2.2),1),q.rotation.z=Math.atan2($i(T,R).tangent.x,$i(T,R).tangent.z),n.add(q)}if(E%144===0){const q=C.clone().addScaledVector(S,-se.width*.74).addScaledVector(b,2),Z=C.clone().addScaledVector(S,se.width*.74).addScaledVector(b,2);Bn(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Bn(n,Z.clone().addScaledVector(b,-1.2),Z.clone().addScaledVector(b,1.1),.12,s),$t(n,new P(.46,.72,.46),q.clone().addScaledVector(b,1.15),L,h),$t(n,new P(.46,.72,.46),Z.clone().addScaledVector(b,1.15),L,h)}if(E%288===0){const q=C.clone().addScaledVector(S,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);$t(n,new P(.44,.44,.44),q.clone(),L,p),Bn(n,q.clone().addScaledVector(b,-.2),C.clone().addScaledVector(b,1),.05,c)}E%48===0&&_(E+v*.5,!1),E%168===0&&!Fi(E+16)&&SM(n,xt(E+5),d)}for(const E of se.gaps){const T=xt(E.start-3),R=xt(E.end+3);for(const C of[T,R]){const S=xt(C.s+2),{normal:b,q:L}=$i(C,S);$t(n,new P(se.width-1.2,.08,4.6),C.p.clone().addScaledVector(b,.54),L,h),$t(n,new P(se.width*.62,.09,1.3),C.p.clone().addScaledVector(b,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,g);for(const I of[-se.width*.42,0,se.width*.42]){const V=C.p.clone().addScaledVector(C.side,I).addScaledVector(b,2.35);$t(n,new P(.46,.46,.46),V,L,I===0?m:h)}_(C.s+(C===T?-9:9),!0),_(C.s+(C===T?-24:24),!0)}}return n}function qf(n=13710372,e=7740696){const t=new it,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),M=new O(new xn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(_,E,T,R,C=null,S=null)=>{const b=new O(E,T);return b.name=_,b.position.copy(R),C&&b.rotation.set(C.x||0,C.y||0,C.z||0),S&&b.scale.copy(S),t.add(b),b},u=(_,E,T,R,C,S,b=0,L=0,I=0)=>g(_,new xe(E.x,E.y,E.z),T,new P(R,C,S),new P(b,L,I));u("low black undertray",new P(5.25,.28,8.45),a,0,.45,-.08),u("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),u("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),u("front black splitter",new P(5.25,.13,.78),a,0,.35,-5.6),u("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),u("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),u("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),u("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),u("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),u("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),u("black rear fascia",new P(4.72,.66,.2),r,0,1.02,4.04),u("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),u("front windshield",new P(2.8,.13,1.15),h,0,1.78,-1.25,-.48),u("roof glass",new P(2.34,.18,1.55),h,0,2.08,-.2,-.13),u("left side window",new P(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),u("right side window",new P(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),u("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),u("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),u("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let _=0;_<7;_++)u("black rear deck louver",new P(3.35,.12,.18),r,0,1.83+_*.015,1.1+_*.28,-.21);u("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const _ of[-2.28,2.28])u("spoiler side endplate",new P(.24,.78,1.04),s,_,1.43,3.72,0,0,_<0?-.08:.08);for(const _ of[-1.78,1.78])u("thin hood crease",new P(.08,.04,2.55),x,_*.36,1.27,-3.45,-.15),u("door seam",new P(.035,.68,1.75),x,_,1.16,-.2),u("side intake",new P(.09,.34,.9),r,Math.sign(_)*2.68,.86,1.42);for(const _ of[-1.04,1.04])u("pop up headlight glass",new P(.62,.12,.18),p,_,1.02,-5.28,-.16);u("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const _ of[-1.42,-.62,.62,1.42])u("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(_)>1?d:f,_,1.08,4.24);u("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),u("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),u("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),u("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const _ of[-2.86,2.86])u("angular side mirror arm",new P(.42,.08,.08),x,_,1.62,-1.55,0,0,_<0?-.14:.14),u("blue tinted side mirror",new P(.12,.34,.46),h,_*1.03,1.62,-1.65,0,_<0?.24:-.24),u("flush door handle",new P(.08,.11,.46),o,_*.94,1.28,.52);for(const _ of[-2.65,2.42])u("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,_),u("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,_);u("black license recess",new P(.9,.24,.08),r,0,.76,4.31);const y=[],v=(_,E,T=!1)=>{const R=new it;R.name=T?"steering front wheel assembly":"rear wheel assembly",R.position.set(_,.54,E);const C=new O(new je(.88,.88,.62,28),a);C.name="wide performance tire",C.rotation.z=Math.PI/2,R.add(C);const S=new O(new _s(.88,.06,10,32),a);S.name="rounded tire sidewall",S.rotation.y=Math.PI/2,R.add(S);const b=new O(new je(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,R.add(b);const L=new O(new je(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=_>0?-.05:.05,R.add(L);for(let j=0;j<8;j++){const te=new O(new xe(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=j/8*Math.PI*2,te.position.set(_>0?.035:-.035,0,.22),R.add(te)}const I=new O(new xe(.1,.22,.18),f);I.name="small brake caliper",I.position.set(_>0?-.39:.39,.18,-.38),R.add(I);const V=new O(new je(.17,.17,.72,18),c);V.name="dark center cap",V.rotation.z=Math.PI/2,R.add(V),t.add(R),T&&y.push(R)};for(const _ of[-2.4,2.4])v(_,-2.65,!0),v(_,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const _ of[-.92,-.52,.52,.92]){const E=new O(new je(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(_,.43,4.52),t.add(E)}return t.traverse(_=>{_.castShadow=!0,_.receiveShadow=!0}),Te.add(t),t}function EM(){const n=new it,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new O(new xe(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new O(new xe(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new O(new xe(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const f=new O(new Zt(2.8,.82,1,1),r);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,n.add(f);const p=new O(new _s(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,n.add(p);for(let m=0;m<3;m++){const x=new O(new xe(.34,.025,.035),i);x.position.copy(p.position),x.rotation.copy(p.rotation),x.rotation.z+=m/3*Math.PI*2,n.add(x)}for(let m=0;m<6;m++){const x=new O(new je(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),n.add(x)}for(const m of[-1.08,1.08]){const x=new O(new je(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(m,-.68,-1.58),n.add(x);const M=new O(new _s(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const x=new O(new je(.035,.04,.028,8),i);x.position.set(m,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const m of[-.52,.52]){const x=new O(new Kt(.045,12,8),a);x.position.set(m,-.34,-1.22),n.add(x)}n.position.set(0,0,0),Ne.add(n),ln=n}function AM(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:eM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=xt(0),a=new Et().makeBasis(s.side,jt,s.tangent),r=new ji().setFromRotationMatrix(a),o=new it;for(const d of[-se.width*.58,se.width*.58]){const f=new O(new xe(.8,11,.8),n);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(jt,5.4),f.quaternion.copy(r),o.add(f)}const c=new O(new xe(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(jt,11.2),c.quaternion.copy(r),o.add(c);const h=new O(new xe(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(jt,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const f=new O(new Kt(.32,16,10),i);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(jt,10.25),o.add(f)}return Te.add(o),o}function Xh(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new O(new xn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,f,p,m=null,x=null)=>{const M=new O(d,f);return M.name=h,M.position.copy(p),m&&M.rotation.set(m.x||0,m.y||0,m.z||0),x&&M.scale.copy(x),n.add(M),M},r=(h,d,f,p,m,x,M,g,u=0,y=0,v=0)=>a(h,new xe(d,f,p),m,new P(x,M,g),{x:u,y,z:v}),o=[];function c(h,d,f,p=.88,m=.62){const x=new it;x.name=f?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,p*.62+.18,d);const M=new O(new je(p,p,m,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new O(new _s(p,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const u=new O(new je(p*.48,p*.48,m+.04,24),i.chrome);u.name="chrome rim",u.rotation.z=Math.PI/2,x.add(u);const y=new O(new je(p*.62,p*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let _=0;_<8;_++){const E=new O(new xe(.08,.055,m),i.chrome);E.name="wheel spoke",E.rotation.x=_/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,p*.25),x.add(E)}const v=new O(new je(.17,.17,m+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),f&&o.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:o}}function CM(n=15616818,e=2434871){const t=new it,i=Xh(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const o=new O(new je(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(r,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function RM(n=4165830,e=15908108){const t=new it,i=Xh(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const o=new O(new je(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(r,1.28,3.78),t.add(o)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const o=new O(new je(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(r*2.62,.55,.4),t.add(o),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function PM(n=16764159,e=526344){const t=new it,i=Xh(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const o=new O(new je(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=r*.42,o.position.set(r*.75,1.85,.35),t.add(o),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new O(new je(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}const Ys=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>qf(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>CM()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>RM()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>PM()}];let Ji=me.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function ms(){return l.drivingStolen&&at?Du[at.type]||Du.compact:Ys[Ji].stats}const Yf=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],Hn=Yf.map((n,e)=>({...n,idx:e,mesh:qf(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),LM=Hn[0].mesh;let Gt=Ys[Ji].build();function DM(n){Ji=me.clamp(n,0,Ys.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Ji));const e=Gt.visible;Ma(Gt),Gt=Ys[Ji].build(),Gt.visible=e,typeof dh=="function"&&dh()}for(const n of Hn)n.mesh.visible=!1,Te.add(n.mesh);function ll(n){for(const e of Hn)e.mesh.visible=n}const IM=[10,6,4,2];let Bt=null;try{Bt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function Or(){return Bt?.active?Bt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function $f(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Bt))}function UM(){Bt={division:Or(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},$f()}function Zf(n){return["One","Two","Three","Four"][me.clamp(n,1,4)-1]}function Kf(){return[{key:"you",label:"You",pts:Bt?.points.you??0},...Yf.map(e=>({key:e.key,label:e.label,pts:Bt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Gt.visible=!1;uM();dM();ye.signs=0;Xo.length=0;fM();pM();xM();let wu=null,Su=null,Tu=null,ln=null,Ql=null;const qt=[];EM();function Oa(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Te.remove(n))}function Ma(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Te.remove(n))}const Sa=[],Rr=[];let Eu=null;function FM(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new rn(n);return t.colorSpace=Lt,t}function zM(n,e){if(Fi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of Zs)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function NM(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:Mt}),t=new je(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const o=new on(t,i,Math.ceil(se.length/12*2)+8),c=new Ut;for(const h of[-1,1]){const d=h*(se.width*.5+.55),f=[],p=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],u=x[M+1];f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.12,u.z,u.x,u.y+1.5,u.z),f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.5,u.z,g.x,g.y+1.5,g.z)}a++}};let m=[];for(let x=0;x<=se.length;x+=s){if(zM(x%se.length,h)){p(m),m=[];continue}const M=xt(x%se.length);if(m.push(M.p.clone().addScaledVector(M.side,d).addScaledVector(jt,.58)),x%12===0){const g=m[m.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(r++,c.matrix)}}if(p(m),f.length){const x=new Yt;x.setAttribute("position",new _t(f,3)),x.computeVertexNormals(),n.add(new O(x,e))}}o.count=r,o.instanceMatrix.needsUpdate=!0,n.add(o),ye.railRuns=a,ye.railPosts=r}function OM(){Sa.length=0,Rr.length=0;const n=new it,e=new Rt({map:FM(),transparent:!0,depthWrite:!1,side:Mt,blending:ti,opacity:.9}),t=new Zt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][Sa.length%3]*se.width,d=xt(c),f=new O(t,e),p=new P().crossVectors(d.side,d.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new Et().makeBasis(d.side,p,new P().crossVectors(d.side,p).normalize());f.quaternion.setFromRotationMatrix(m),f.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(p,.84),n.add(f),Sa.push({s:c,lat:h})}const i=new Kt(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(se.length/24));{const c=new on(i,s,a*2),h=new Ut;let d=0;for(let f=0;f<a;f++){const p=f/a*se.length;if(Fi(p))continue;const m=xt(p);for(const x of[-1,1])h.position.copy(m.p).addScaledVector(m.side,x*(se.width*.5+.22)).addScaledVector(jt,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new je(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=xt(Math.max(6,c.start-22));for(const d of[-1,1]){const f=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new it,m=new O(r,o),x=new O(new Kt(.3,10,8),f);m.position.y=.75,x.position.y=1.65,p.add(m),p.add(x),p.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(jt,.55),n.add(p),Rr.push(f)}}return NM(n),Te.add(n),n}mn(new Ut,n=>{if(!Rr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Rr)t.emissiveIntensity=e});function Br(n){return vs=me.clamp(n,0,Xs.length-1),se=Xs[vs],Qn.length=0,Zs.length=0,Ma(wu),Ma(Su),Ma(Tu),Ma(Eu),wu=TM(),Su=AM(),Tu=MM(),Eu=OM(),$h(),Xe.trackName.textContent=se.name,Xe.courseName&&(Xe.courseName.textContent=se.name),Xe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===vs)}),se.name}Br(0);function BM(){Ql&&Te.remove(Ql),qt.length=0;const n=new it,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Rt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:Mt,blending:ti}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=ce(a.x,a.z)+4.2,o=new it,c=new O(new _s(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,o.add(c);const h=new O(new xn(4.7,32),t.clone());h.rotation.y=a.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new O(new je(.11,.16,6.2,8),d);m.position.set(Math.cos(a.yaw)*p,-1.1,Math.sin(a.yaw)*p),o.add(m)}const f=new O(new Kt(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(a.x,r,a.z),o.userData.index=s,o.userData.baseY=r,o.userData.label=a.label,n.add(o),qt.push({...a,y:r,radius:8.5,marker:o,collected:!1})}mn(n,s=>{for(let a=0;a<qt.length;a++){const r=qt[a],o=a===l.objectiveIndex;r.marker.visible=!r.collected||o,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Te.add(n),Ql=n}BM();function kM(){const n=new it,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(Pn(s,a,r*2+14,r*2+14,10)||Rn(s,a,r).clearance<-6||qt.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||qs.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||sn.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||fi.some(d=>{const f=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<f+r+2})||ba.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const o=ce(s,a);if(Math.max(Math.abs(ce(s+r,a)-o),Math.abs(ce(s-r,a)-o),Math.abs(ce(s,a+r)-o),Math.abs(ce(s,a-r)-o))>1.7)continue;const c=new O(new Qo(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,a),c.renderOrder=-4,n.add(c);const h=new O(new xn(r,36),kf(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,a),h.renderOrder=-3,n.add(h),Vf(s,a,r*.98),t++}ye.ponds=t,Te.add(n),$h()}kM();const an=Wf(3375807,15905331);an.visible=!1,an.scale.setScalar(1.06),Te.add(an);const zi=new P(0,0,0);let nh=0,ue=null;function VM(){const n=new it,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,f,p,m,x,M=0,g=0,u=0)=>{const y=new O(d,f);return y.name=h,y.position.set(p,m,x),y.rotation.set(M,g,u),n.add(y),y};r("cabin hull",new xe(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new xe(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new xe(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new xe(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new xe(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new xe(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new je(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new xe(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new xe(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new xe(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new xe(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new xe(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new xe(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new xe(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new je(.22,.28,.5,10),s,0,3.95,-.2);const o=new it;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new it;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function GM(){let n=null;for(let d=0;d<700&&!n;d++){const f=-520+Math.random()*1040,p=-1200+Math.random()*1500;if(Math.hypot(f-80,p-300)>(d<350?420:1200)||Pn(f,p,26,26,6))continue;const m=ce(f,p);Math.max(Math.abs(ce(f+11,p)-m),Math.abs(ce(f-11,p)-m),Math.abs(ce(f,p+11)-m),Math.abs(ce(f,p-11)-m))>.8||sn.some(x=>Math.abs(x.x-f)<x.hw+13&&Math.abs(x.z-p)<x.hd+13)||ba.some(x=>Math.hypot(x.x-f,x.z-p)<(x.radius||4)+13)||qs.some(x=>Math.hypot(x.x-f,x.z-p)<x.rx+16)||qt.some(x=>Math.hypot(x.x-f,x.z-p)<24)||Rn(f,p,12).clearance<2||(n={x:f,z:p,y:m})}n||(n={x:150,z:330,y:ce(150,330)});const e=new it,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new O(new je(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new rn(s);r.colorSpace=Lt;const o=new O(new xn(9.6,36),new Rt({map:r,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const f=d/8*Math.PI*2,p=new O(new Kt(.22,8,6),c);p.position.set(n.x+Math.cos(f)*10.2,n.y+.34,n.z+Math.sin(f)*10.2),e.add(p)}Te.add(e);const h=VM();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Te.add(h.mesh),ue={pad:n,pos:new P(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new P,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},ue.mesh.quaternion.setFromAxisAngle(jt,-ue.yaw),ye.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}GM();var Ei=[],Jf=null;function HM(n,e){if(!Ei)return 0;for(const t of Ei){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return Jf=t,a/t.len*t.h}return 0}function WM(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Ei.length<6;r++){const o=n[Ei.length%n.length],{len:c,h}=o,d=Math.random()<.5,f=Math.round((ke.x1-ke.x0)/ke.pitch),p=(d?ke.x0:ke.zFar)+(Math.random()*(d?f:Math.round((ke.zNear-ke.zFar)/ke.pitch))|0)*ke.pitch,m=(Math.random()<.5?-1:1)*(ke.streetW*.5+10+Math.random()*9),x=d?ke.zFar+120+Math.random()*(ke.zNear-ke.zFar-240):ke.x0+120+Math.random()*(ke.x1-ke.x0-240),M=d?p+m:x,g=d?x:p+m,u=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(u),v=-Math.cos(u),_=M+y*c,E=g+v*c;if(Pn(M,g,e+4,e+4,2)||Pn(_,E,e+4,e+4,2)||Rn(M,g,8).clearance<11||Rn(_,E,8).clearance<11||Vs(M,g).depth>0||Vs(_,E).depth>0||Vs(_+y*40,E+v*40).depth>0||Math.abs(ce(M,g)-ce(_,E))>1.1||Ei.some(S=>Math.hypot(S.x-M,S.z-g)<150))continue;const T=(S,b,L,I)=>S.some(V=>Math.abs(b-V.x)<(V.hw??V.radius??0)+I&&Math.abs(L-V.z)<(V.hd??V.radius??0)+I);let R=!1;for(const[S,b,L]of[[M-y*45,g-v*45,6],[M-y*22,g-v*22,6],[M,g,7],[_,E,7],[_+y*45,E+v*45,9],[_+y*95,E+v*95,9]])if(T(sn,S,b,L)||T(fi,S,b,L)){R=!0;break}if(R)continue;const C={x:M,z:g,yaw:u,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const S=ce(M,g)+h+13;C.hoop={x:_+y*28,y:S,z:E+v*28,r:7}}Ei.push(C)}for(const r of Ei){const o=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const C=new O(new _s(r.hoop.r,.5,10,30),a);C.position.set(r.hoop.x,r.hoop.y,r.hoop.z),C.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Te.add(C)}const c=ce(r.x,r.z)+.05,h=-r.fz,d=r.fx,f=r.w*.5,p=[r.x-h*f,c,r.z-d*f],m=[r.x+h*f,c,r.z+d*f],x=[r.x+r.fx*r.len-h*f,c,r.z+r.fz*r.len-d*f],M=[r.x+r.fx*r.len+h*f,c,r.z+r.fz*r.len+d*f],g=[x[0],c+r.h,x[2]],u=[M[0],c+r.h,M[2]],y=[...p,...m,...u,...p,...u,...g,...x,...M,...u,...x,...u,...g,...p,...g,...x,...m,...M,...u],v=new Yt;v.setAttribute("position",new _t(y,3)),v.computeVertexNormals();const _=new O(v,i);_.castShadow=!1,_.receiveShadow=!0,Te.add(_);const E=Math.hypot(r.len,r.h),T=new xe(.26,.24,E),R=new O(new xe(1.1,.1,E*.94),s);R.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),R.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Te.add(R);for(const C of[-1,1]){const S=new O(T,o),b=r.x+h*f*C,L=r.z+d*f*C,I=r.x+r.fx*r.len+h*f*C,V=r.z+r.fz*r.len+d*f*C;S.position.set((b+I)/2,c+r.h/2+.12,(L+V)/2),S.lookAt(I,c+r.h+.12,V),Te.add(S);const j=new O(new Kt(.34,10,8),t);j.position.set(I,c+r.h+.55,V),Te.add(j)}}ye.stuntRamps=Ei.length}WM();function XM(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];ye.propPlanes=0;for(const e of n){const t=new it,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new O(new je(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new O(new Ai(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const o=new O(new Kt(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new O(new xe(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new O(new xe(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new O(new xe(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const f=new it,p=new xe(.26,5.4,.12),m=new O(p,s),x=new O(p,s);x.rotation.z=Math.PI/2,f.add(m),f.add(x),f.position.z=-5.75,t.add(f),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Te.add(t);const M=Math.random()*Math.PI*2;mn(t,(g,u)=>{t.position.x+=e.dir*e.speed*u,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+M)*5,t.rotation.z=Math.sin(g*.22+M)*.14,f.rotation.z+=u*38}),ye.propPlanes++}}XM();const lt={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},jf=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),Qf=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function kr(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),lt.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function e0(){const n=ol("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new O(new xe(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new O(new xe(.62,.24,.46),jf),s=new O(new xe(.62,.24,.46),Qf);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function Au(n,e){return sn.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||Vs(n,e).depth>.35}function qM(){const n=Math.random()*Math.PI*2,e=me.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=me.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=e0();Te.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return lt.cars.push(s),Mi("whoosh",.2,.8,.1),s}function t0(n){Oa(n.mesh),lt.cars=lt.cars.filter(e=>e!==n)}function n0(n){for(const e of n.meshes)Oa(e);lt.blocks=lt.blocks.filter(e=>e!==n)}function qh(){for(const n of[...lt.cars])t0(n);for(const n of[...lt.blocks])n0(n);lt.evadeT=0,lt.nearest=1/0,lt.bustT=0,lt.blockCd=6,l.heat=0}function YM(){const n=Math.sin(l.roamYaw),e=-Math.cos(l.roamYaw),t=l.roamPos.x+n*215,i=l.roamPos.z+e*215,s=ke.x0+Math.round((t-ke.x0)/ke.pitch)*ke.pitch,a=ke.zNear-Math.round((ke.zNear-i)/ke.pitch)*ke.pitch,r=Math.abs(t-s),o=Math.abs(i-a);let c,h,d,f,p,m;if(r<=o&&r<ke.streetW*.6)c=s,h=i,d=1,f=0,p=0,m=1;else if(o<ke.streetW*.6)c=t,h=a,d=0,f=1,p=1,m=0;else return!1;if(c<ke.x0||c>ke.x1||h>ke.zNear||h<ke.zFar||lt.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=ce(c,h),M=ke.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),u=new O(new xe(.9,.16,M),g);u.position.set(c,x+.1,h),u.lookAt(c+d,x+.1,h+f),Te.add(u);const y=[u];for(const v of[-1,1]){const _=e0();_.position.set(c+d*v*(M*.32),x+.06,h+f*v*(M*.32)),_.rotation.y=Math.atan2(d,f)+v*.7,Te.add(_),y.push(_)}return lt.blocks.push({x:c,z:h,latX:d,latZ:f,fwX:p,fwZ:m,w:M,meshes:y,age:0,hitT:0}),l.message="ROADBLOCK AHEAD!",l.messageTimer=1.3,wn(500,.2,"square",.1),!0}function $M(){const n=Math.min(600,Math.round(l.score*.12)+150);l.score=Math.max(0,l.score-n),ye.busts=(ye.busts||0)+1,l.message=`BUSTED! -${n}`,l.messageTimer=2,l.cameraShake=.5,wn(220,.5,"sawtooth",.14),Ze.state==="active"&&Pr("busted"),l.drivingStolen&&at&&(cl(),l.vehicle="foot",l.speed=0,an.visible=!0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.message="BUSTED! Ride confiscated"),qh()}function ZM(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),a=l.heat||0;let r=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(Au(n.x+o*17,n.z+c*17)){const f=n.yaw-.7,p=n.yaw+.7;r=!Au(n.x+Math.sin(f)*17,n.z-Math.cos(f)*17)?f:p}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=me.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=me.clamp(n.x,-800,800),n.z=me.clamp(n.z,-1600,460),n.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const f of n.mesh.userData.wheels||[])f.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?(f0(new P(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,kr(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}mn(new Ut,(n,e)=>{const t=Math.floor(n*3.4)%2;if(jf.emissiveIntensity=t?2.6:.35,Qf.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){lt.cars.length&&qh();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;lt.cars.length<s;)qM();for(;lt.cars.length>s;)t0(lt.cars[lt.cars.length-1]);let a=1/0;for(const r of[...lt.cars])a=Math.min(a,ZM(r,e));lt.nearest=a,i>0&&a<12&&Math.abs(l.speed)<8?(lt.bustT+=e,lt.bustT>2.2&&(lt.bustT=0,$M())):lt.bustT=Math.max(0,lt.bustT-e*1.5),i>=4&&(lt.blockCd-=e,lt.blockCd<=0&&Math.abs(l.speed)>30&&(YM(),lt.blockCd=12));for(const r of[...lt.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&n0(r);const o=l.roamPos.x-r.x,c=l.roamPos.z-r.z,h=o*r.latX+c*r.latZ,d=o*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!l.roamAir&&l.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,l.spikedT=3.5,l.speed*=.5,l.damage=me.clamp(l.damage+6,0,100),l.message="SPIKE STRIP!",l.messageTimer=1.2,l.cameraShake=Math.max(l.cameraShake,.4),Mi("skid",.55,1.25,.1),kr(.15))}if(lt.panicTick-=e,lt.panicTick<=0&&i>0){lt.panicTick=.4;for(const r of Sn){const o=r.actor;if(!o||!o.type||o.stolen||o.panicT>0)continue;let c=Math.hypot(l.roamPos.x-r.x,l.roamPos.z-r.z)<45;if(!c){for(const h of lt.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(o.panicT=1.6)}}i>0&&(a>240?(lt.evadeT+=e,lt.evadeT>9&&(l.heat=Math.max(0,i-1),lt.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,Ui("+500 ESCAPED THE LAW"),wn(980,.22),l.message="You lost them",l.messageTimer=1.4))):lt.evadeT=Math.max(0,lt.evadeT-e*.6)),ye.police=lt.cars.length});const Ze={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},Cu=["van","boxTruck","taxi","pickup"];function i0(n){const e=new O(new je(3.4,3.4,340,12,1,!0),new Rt({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:Mt,blending:ti}));return e.frustumCulled=!1,Te.add(e),e}function s0(){for(const n of Ze.beacons)n.geometry.dispose(),n.material.dispose(),Te.remove(n);Ze.beacons=[]}function ih(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?ke.x0+(Math.random()*Math.round((ke.x1-ke.x0)/ke.pitch)|0)*ke.pitch:ke.zNear-(Math.random()*Math.round((ke.zNear-ke.zFar)/ke.pitch)|0)*ke.pitch,a=(Math.random()<.5?-1:1)*(ke.streetW*.5+6),r=i?ke.zFar+100+Math.random()*(ke.zNear-ke.zFar-200):ke.x0+100+Math.random()*(ke.x1-ke.x0-200),o=i?s+a:r,c=i?r:s+a,h=Math.hypot(o-l.roamPos.x,c-l.roamPos.z);if(!(h<n||h>e)&&!Pn(o,c,8,8,1)&&!(Vs(o,c).depth>0)&&!sn.some(d=>Math.abs(o-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:o,z:c,yaw:i?0:Math.PI/2}}return null}function a0(){const n=ih(200,700);if(!n){Ze.cooldown=4;return}const e=Cu[Math.random()*Cu.length|0];Ze.type=e,Ze.mesh=ol(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ze.mesh.userData.stolenYOff=.57,Ze.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),Ze.mesh.rotation.y=-n.yaw,Te.add(Ze.mesh),Ze.pickup=n;const t=i0(3531007);t.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(t),Ze.state="available",l.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,l.messageTimer=2}function KM(){if(Ze.state!=="available"||!Ze.mesh||l.roamPos.distanceTo(Ze.mesh.position)>6)return!1;Kh();const n=Ze.mesh;return at={mesh:n,type:Ze.type,actor:null,parked:null,parkedYaw:0,job:!0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.position.x,ce(n.position.x,n.position.z)+Vn,n.position.z),l.roamYaw=Ze.pickup.yaw,l.camYaw=l.roamYaw,l.speed=0,an.visible=!1,Mi("jack",.5,1,.08)||wn(340,.18,"square",.1),si(),JM(),!0}function JM(){const n=ih(420,900)||ih(250,1100);if(!n){Pr("no route");return}Ze.dest=n,Ze.timeLeft=Math.round(14+Math.hypot(n.x-l.roamPos.x,n.z-l.roamPos.z)*.062),s0();const e=i0(16766720);e.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(e),Ze.state="active",l.message=`Deliver the ${Ze.type.toUpperCase()} to the gold beacon — ${Ze.timeLeft}s`,l.messageTimer=2.2}function Yh(n){s0(),Object.assign(Ze,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Pr(n){Ze.state!=="idle"&&(at?.job?(cl(),l.vehicle==="car"&&(l.vehicle="foot",an.visible=!0,l.speed=0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05)):Ze.mesh&&Oa(Ze.mesh),Yh(9),n!=="silent"&&(l.message=`Delivery failed — ${n}`,l.messageTimer=1.6,wn(240,.3,"sawtooth",.1)),ye.deliveryFails=(ye.deliveryFails||0)+1)}function jM(n){Oa(n),Yh(9),l.message="Delivery failed — vehicle abandoned",l.messageTimer=1.5,ye.deliveryFails=(ye.deliveryFails||0)+1}function QM(){const n=1200+Math.ceil(Ze.timeLeft)*10;l.score+=n,ye.deliveries=(ye.deliveries||0)+1,Ui(`+${n} DELIVERED`,!0),wn(980,.18),setTimeout(()=>wn(1320,.22),100);const e=at?.mesh;at=null,l.drivingStolen=!1,e&&Oa(e),l.vehicle="foot",l.speed=0,an.visible=!0,l.roamPos.x-=Math.cos(l.roamYaw)*3.4,l.roamPos.z-=Math.sin(l.roamYaw)*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,Yh(8),l.message="Delivered! Another job will turn up",l.messageTimer=1.8}mn(new Ut,(n,e)=>{if(l.mode!=="roam"){Ze.state!=="idle"&&Pr("silent");return}Ze.state==="idle"?(Ze.cooldown-=e,Ze.cooldown<=0&&a0()):Ze.state==="active"&&(Ze.timeLeft-=e,Ze.timeLeft<=0?Pr("time's up"):l.drivingStolen&&at?.job&&Math.hypot(l.roamPos.x-Ze.dest.x,l.roamPos.z-Ze.dest.z)<15&&Math.abs(l.speed)<26&&QM())});mn(new Ut,(n,e)=>{if(!ue)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;ue.rpm+=(t-ue.rpm)*Math.min(1,e*(t?1.4:.5)),ue.rotor.rotation.y+=ue.rpm*26*e,ue.tailRotor.rotation.x+=ue.rpm*42*e});const e_=new Rt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),Do=Array.from({length:42},()=>{const n=new O(new Kt(.14,6,5),e_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),t_=new Rt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:Mt}),sh=Array.from({length:14},()=>{const n=new O(new Qo(.82,1,28),t_.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1}});function r0(n,e,t=1){const i=sh.find(s=>s.life<=0)||sh[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ce(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function n_(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=Do.find(a=>a.life<=0)||Do[i%Do.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}r0(n.x,n.z,1.6)}mn(new Ut,(n,e)=>{for(const t of Do)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of sh)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const Ba=new Wv(en);Ba.addPass(new Xv(Te,Ne));const o0=new Da(new Ue(window.innerWidth,window.innerHeight),.4,.72,.86);Ba.addPass(o0);Ba.addPass(new qv);const i_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},sr=new Df(i_);Ba.addPass(sr);const s_=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),hr=Array.from({length:72},()=>{const n=new O(new Kt(.1,8,5),s_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),a_=new Rt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:Mt}),dr=Array.from({length:90},()=>{const n=new O(new xn(1,18),a_.clone());return n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),r_=new W({color:2962232,roughness:.58,metalness:.34}),ur=Array.from({length:48},()=>{const n=new O(new xe(.18,.08,.26),r_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Se=null;function l0(){if(Se)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let C=0;C<1024;C++){const S=(C/511.5-1)*1.6;a[C]=4*S/(1+3*Math.abs(S))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const o=(C,S,b)=>{const L=n.createOscillator(),I=n.createGain();return L.type=C,I.gain.value=S,L.connect(I),I.connect(b),L.start(),{o:L,g:I}},c=o("sine",.5,t),h=o("sawtooth",.3,r),d=o("sawtooth",.3,r),f=o("triangle",.03,t),p=n.createOscillator(),m=n.createGain();p.type="sine",p.frequency.value=12,m.gain.value=0,p.connect(m),m.connect(r.gain),p.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),M=x.getChannelData(0);for(let C=0;C<M.length;C++)M[C]=Math.random()*2-1;const g=(C,S,b,L)=>{const I=n.createBufferSource(),V=n.createBiquadFilter(),j=n.createGain();return I.buffer=x,I.loop=!0,I.playbackRate.value=L,V.type=C,V.frequency.value=S,V.Q.value=b,j.gain.value=1e-4,I.connect(V),V.connect(j),j.connect(e),I.start(),{filter:V,gain:j}},u=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),_=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const T=n.createOscillator(),R=n.createGain();T.type="triangle",T.frequency.value=660,R.gain.value=1e-4,T.connect(R),R.connect(e),T.start(),Se={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:f,burble:{o:p,depth:m},siren:{o:T,g:R},rain:_,wind:u,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const c0={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},o_=["interceptor","bullet","brawler","zephyr"];function h0(){return l.mode==="roam"&&l.drivingStolen&&at?c0[at.type]?at.type:"compact":o_[Ji]||"interceptor"}function ys(){Se||l0(),Se?.ctx.state==="suspended"&&Se.ctx.resume().catch(()=>{}),u_()}function fr(n){if(!Se)return;const{ctx:e}=Se,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Se.master),t.start(),t.stop(e.currentTime+.24)}function l_(){if(!Se||Mi("whoosh",.4,1,.1))return;const{ctx:n}=Se,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Se.master),e.start(),e.stop(n.currentTime+.6)}function c_(){if(!Se||Mi("splat",.6,1,.14))return;const n=Se.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=d0(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Se.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Se.master),s.start(),s.stop(n.currentTime+.26)}let ec=null;function d0(){if(ec)return ec;const n=Se.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return ec=e}function h_(n=1){if(!Se||Mi("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Se,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=d0(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Se.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Yn={buffers:{},loops:{},loading:!1},d_=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function u_(){if(!(Yn.loading||!Se)){Yn.loading=!0;for(const n of d_)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Se.ctx.decodeAudioData(e)).then(e=>Yn.buffers[n]=e).catch(()=>{})}}function Mi(n,e=.5,t=1,i=.06){const s=Se&&Yn.buffers[n];if(!s)return!1;const a=Se.ctx,r=a.createBufferSource(),o=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,r.connect(o).connect(Se.master),r.start(),!0}function tc(n,e,t=1e-4){if(Yn.loops[n])return Yn.loops[n];if(!Se||!Yn.buffers[n])return null;const i=Se.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Yn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Se.master),s.start(),Yn.loops[n]={src:s,gain:a}}const Ru={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function Pu(n,e,t,i,s,a){const{ctx:r}=Se,o=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Se.musicGain),o.start(e),o.stop(e+t+.05)}function f_(){const{ctx:n}=Se,e=60/92/2;for(Se.nextNote<n.currentTime-1&&(Se.nextNote=n.currentTime+.08);Se.nextNote<n.currentTime+.35;){const t=Se.beat%32,i=t/8|0;t%4===0&&Pu(Ru.bass[i],Se.nextNote,.5,"triangle",.5,420),Pu(Ru.arps[i][t%4],Se.nextNote,.19,"sawtooth",.16,1300),Se.nextNote+=e,Se.beat++}}function Ta(n,e=18){const t=Math.min(e,hr.length);for(let i=0;i<t;i++){const s=hr.find(a=>a.life<=0)||hr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function u0(n,e=10,t=1){const i=Math.min(e,dr.length);for(let s=0;s<i;s++){const a=dr.find(r=>r.life<=0)||dr[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function p_(n,e=8,t=1){const i=Math.min(e,ur.length);for(let s=0;s<i;s++){const a=ur.find(r=>r.life<=0)||ur[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function f0(n,e=Math.abs(l.speed),t="CRASH"){const i=me.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=me.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),Ta(n,Math.round(10+i*24)),u0(n,Math.round(5+i*12),i),p_(n,Math.round(3+i*8),i),Mi("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||fr(18+i*34)}function m_(n){for(const e of hr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of dr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Ne.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of ur)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function x_(){if(!Se)return;const{ctx:n}=Se,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,a=me.clamp((s-900)/6600,0,1),r=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=c0[h0()],h=i?26+(ue?.rpm||0)*14:(38+a*124)*c.fMul;Se.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Se.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Se.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Se.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Se.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Se.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Se.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Se.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Se.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Se.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Se.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*o),e,.06),Se.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*o),e,.07),Se.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Se.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,f=tc("skid");Se.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(f?.05:.15):1e-4,e,.09),f&&f.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const p=tc("rotor");p&&(p.gain.gain.setTargetAtTime(i?.06+(ue?.rpm||0)*.3:1e-4,e,i?.3:.15),p.src.playbackRate.setTargetAtTime(.65+(i&&ue?.rpm||0)*.5,e,.4)),l.boosting&&!Se.prevBoost&&l_(),Se.prevBoost=!!l.boosting,Se.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Se.boost.filter.frequency.setTargetAtTime(l.boosting?420+r*3:260,e,.1),Se.rain&&Se.rain.gain.gain.setTargetAtTime(Ia()>.02&&l.mode!=="menu"?Ia()*.045:1e-4,e,.4);const m=l.mode==="roam"&&(l.heat||0)>0&&lt.nearest<460,x=m?Math.min(.06,(460-lt.nearest)/460*.075):1e-4;Se.siren.g.gain.setTargetAtTime(x,e,.25),Se.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const M=localStorage.getItem("steel-ribbon-music")!=="0",g=M?tc("music",Se.musicGain,1):Yn.loops.music||null;Se.musicGain.gain.setTargetAtTime(M?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),M&&!g&&f_()}function Lr(n=!1,e=!1,t=!1){l0(),ys(),et.clear(),Ur(),cl();const i=n||e;l.seasonRace=t&&!i;for(let a=0;a<Hn.length;a++){const r=Hn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=xt(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],B_(),k_(),Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.resultStats.innerHTML="",Xe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Xe.trackName.textContent=se.name,Gt.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Qi(),window.__freeCam=!1}function qo(){ys(),l.mode="roam",l.practice=!0,l.freeRun=!1,et.clear(),Ur();let n=80,e=338;Rn(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,ce(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ie.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",an.visible=!1,Pr("silent"),cl(),qh(),ue&&(ue.pos.set(ue.pad.x,ue.pad.y+.24,ue.pad.z),ue.vel.set(0,0,0),ue.mesh.position.copy(ue.pos));for(const s of qt)s.collected=!1;l.message="",l.messageTimer=0,ll(!1),Gt.visible=!0,ln&&(ln.visible=!1),document.body.classList.add("roam-mode"),Qi(),window.__freeCam=!1,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",si();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);Ne.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),ch(),Ne.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),Ne.fov=69,Ne.updateProjectionMatrix()}function si(){const n=v0();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(jt,-l.roamYaw),n.rotateZ(-l.wheelSteer*me.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:me.clamp(-l.roamVy*.014,-.3,.34):me.clamp(l.roamSuspension,-.16,.22))}function p0(n,e){let t=null;for(const s of Zs)for(const a of s.segments){const r=n-a.a.x,o=e-a.a.z,c=me.clamp((r*a.abx+o*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,f=Math.hypot(n-h,e-d);if(f>s.halfW+Ln*1.15)continue;const p=me.lerp(a.a.y,a.b.y,c),m=me.lerp(a.u0,a.u1,c),x=f+Math.max(0,ce(n,e)-p)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function m0(n,e,t=ce(n,e),i=!1){let s=null;const a=10;for(let o=0;o<se.length;o+=a){if(Fi(o+a*.5))continue;const c=xt(o),h=xt(o+a),d=h.p.x-c.p.x,f=h.p.z-c.p.z,p=Math.max(1e-4,d*d+f*f),m=me.clamp(((n-c.p.x)*d+(e-c.p.z)*f)/p,0,1),x=c.p.x+d*m,M=c.p.z+f*m,g=n-x,u=e-M,y=Math.hypot(g,u);if(y>se.width*.5+Ln*.45)continue;const v=me.lerp(c.p.y,h.p.y,m)+.58;if(!i&&t<v-5)continue;const _=new P(f,0,-d).normalize(),E=me.clamp(g*_.x+u*_.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+a*m,lateral:E,tangentX:d,tangentZ:f,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function Ns(n,e,t=l.roamPos.y){const i=ce(n,e),s=HM(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=p0(n,e);r&&r.y>=i-1.2&&(a=r);const o=m0(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&o&&o.y>=a.y-.8&&(a=o),a}function Lu(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=xt(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=me.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=me.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),ll(!1),Gt.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Qi(),Xe.position.textContent="FREE RUN",Xe.trackName.textContent=se.name,si(),!0}function g_(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+Vn,t.z+a*3.5),l.roamYaw=Math.atan2(s,-a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=me.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),ll(!1),Gt.visible=!0,ln&&(ln.visible=!1),document.body.classList.add("roam-mode"),Qi(),l.vehicle="car",an.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",si();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),Ne.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),Ne.fov=69,Ne.updateProjectionMatrix(),Ta(l.roamPos.clone().add(new P(0,.6,0)),10),!0}function v_(){const n=sl.set(0,0,-1).applyQuaternion(Ne.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),heat:+(l.heat||0).toFixed(2),police:lt.cars.length,policeNearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),roadblocks:lt.blocks.length,spikedT:+(l.spikedT||0).toFixed(2),rain:+Ia().toFixed(2),job:{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1)},stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:ye.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&at?.type||null,altitude:+(l.roamPos.y-ce(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var Gs=document.createElement("canvas");Gs.id="minimap",Gs.width=256,Gs.height=256;document.querySelector("#app")?.appendChild(Gs);var ah=null,M_=0,Os={cx:0,cz:-570,span:2180};function pn(n,e,t){return[((n-Os.cx)/Os.span+.5)*t,((e-Os.cz)/Os.span+.5)*t]}function $h(){if(!Os)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=ke.x0;s<=ke.x1+1;s+=ke.pitch){const[a,r]=pn(s,ke.zNear,n),[o,c]=pn(s,ke.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}for(let s=ke.zNear;s>=ke.zFar-1;s-=ke.pitch){const[a,r]=pn(ke.x0,s,n),[o,c]=pn(ke.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of rl())if(s.courseIndex===vs){const[a,r]=pn(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of qs){const[a,r]=pn(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/Os.span*n),Math.max(3,s.rz/Os.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Ei||[]){const[a,r]=pn(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}ah=e}function __(){const n=l.mode==="roam";if((Gs.style.display=n?"block":"none")&&!n||!n||!ah||M_++%2)return;const e=Gs.width,t=Gs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(ah,0,0,e,e);for(const a of Zs)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[o,c]=pn(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<qt.length;a++){const r=qt[a],[o,c]=pn(r.x,r.z,e),h=a===l.objectiveIndex%qt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(Wo*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of Sn){const[r,o]=pn(a.x,a.z,e);t.fillRect(r-1.4,o-1.4,2.8,2.8)}if(ue){const[a,r]=pn(ue.pad.x,ue.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),l.vehicle!=="heli"){const[o,c]=pn(ue.pos.x,ue.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[a,r]=pn(zi.x,zi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(at?.parked){const[a,r]=pn(at.parked.x,at.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of lt.cars){const[r,o]=pn(a.x,a.z,e);t.beginPath(),t.arc(r,o,3.2,0,Math.PI*2),t.fill()}for(const a of lt.blocks){const[r,o]=pn(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,o-1.4,8,2.8)}if(Ze.state==="available"&&Ze.pickup){const[a,r]=pn(Ze.pickup.x,Ze.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ze.state==="active"&&Ze.dest){const[a,r]=pn(Ze.dest.x,Ze.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=pn(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}$h();let Si=null;function y_(){Si||(Si=new O(new je(2.4,3.2,620,12,1,!0),new Rt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:ti,side:Mt,fog:!1})),Si.renderOrder=5,Te.add(Si));const n=l.mode==="roam"&&qt.length>0;if(Si.visible=n,!n)return;const e=qt[l.objectiveIndex%qt.length];Si.position.set(e.x,e.y+296,e.z),Si.material.opacity=.1+Math.sin(Wo*3.1)*.04}let ls=null;function Zh(){if(l.mode!=="roam"||qt.length===0){ls=null;return}const n=qt[l.objectiveIndex%qt.length];if(!n)return;const e=ls?.x??l.roamPos.x,t=ls?.z??l.roamPos.z,i=ls?.y??l.roamPos.y,s=l.roamPos.x-e,a=l.roamPos.z-t,r=s*s+a*a;if(ls??={x:0,y:0,z:0},ls.x=l.roamPos.x,ls.y=l.roamPos.y,ls.z=l.roamPos.z,r>4e4)return;const o=r>1e-6?me.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*o-n.x,h=t+a*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),f=n.radius+1.2;c*c+h*h>f*f||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%qt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,Ui(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),wn(880,.16),setTimeout(()=>wn(1245,.2),90),Ta(new P(n.x,n.y,n.z),18))}function x0(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,Ie.throttle),i=Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,Ie.brake),s=me.clamp((et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0)+Ie.steer,-1,1)*Ff,a=(et.has("ShiftLeft")||et.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const _=l.speed<0?38:0;l.speed+=((a?70:42)*ms().accel+_)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=me.clamp(l.speed,-24,135*ms().top*(l.spikedT>0?.62:1)),l.boosting=a,a?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*ms().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n)),l.spikedT>0&&(l.spikedT-=n);const r=-l.wheelSteer*.55,o=v0().userData.frontWheels;if(o&&(o[0].rotation.y=r,o[1].rotation.y=r),l.drivingStolen&&at)for(const _ of at.mesh.userData.wheels||[])_.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=et.has("Space")&&!l.roamAir;if(c>Qc){const _=me.clamp((c-Qc)/5,0,1),E=1-.36*me.clamp((c-34)/85,0,1),T=Zv*1.08*_*E*(h?1.85:1)*ms().grip*(l.spikedT>0?.55:1)*(1-.26*Ia());l.roamYaw+=l.wheelSteer*T*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=me.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),f=Math.sin(d),p=-Math.cos(d),m=(l.speed-e)/Math.max(.001,n),x=me.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-m-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(m)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const _=new P(l.roamPos.x-f*3.2,l.roamPos.y+.2,l.roamPos.z-p*3.2);u0(_,2,l.roamSlip)}const M=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let u=!1,y=!1,v=Ns(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let _=0;_<g;_++)l.roamPos.x+=f*l.speed*n/g,l.roamPos.z+=p*l.speed*n/g,v=Ns(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Vn),I_(l.roamPos,v)&&(y=!0),S0(l.roamPos,v)&&(u=!0),v=Ns(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Vn);l.roamPos.x=me.clamp(l.roamPos.x,-820,820),l.roamPos.z=me.clamp(l.roamPos.z,-1620,480),u&&(l.collisionCooldown<=0&&(f0(new P(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,kr(.6)),b0(n,e),A_(n,h,u),R_(n,u),v=Ns(l.roamPos.x,l.roamPos.z,l.roamPos.y),C_(n,v),!(v.kind==="ramp"&&v.u>.72&&Lu(v))&&(v.kind==="track"&&Lu(v)||(Zh(),si(),et.has("KeyR")&&(qo(),et.delete("KeyR"))))}const Du={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let at=null;const g0=[];function v0(){return l.drivingStolen&&at?at.mesh:Gt}function Kh(){if(at){if(at.job){const n=at.mesh;at=null,jM(n);return}if(at.actor){const n=at.actor.collider,e=at.mesh.position;n.x=e.x,n.z=e.z}g0.push(at),at=null}}function b_(n){Kh(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Te.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return at={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,ce(n.mesh.position.x,n.mesh.position.z)+Vn,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,an.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,kr(1),Mi("jack",.5,1,.08)||wn(340,.18,"square",.1),si(),!0}function w_(n){if(Kh(),n.taken=!0,n.savedM=new Et,Tn.im){const t=new Et().makeScale(1e-4,1e-4,1e-4);Tn.im.getMatrixAt(n.idx,n.savedM),Tn.im.setMatrixAt(n.idx,t),Tn.imW.setMatrixAt(n.idx,t),Tn.im.instanceMatrix.needsUpdate=!0,Tn.imW.instanceMatrix.needsUpdate=!0}const e=ol("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Te.add(e),at={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,ce(n.x,n.z)+Vn,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,an.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,kr(.7),Mi("jack",.45,1.05,.08)||wn(300,.16,"square",.09),si(),!0}function S_(){at.parked=l.roamPos.clone(),at.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,an.visible=!0,!0}function Iu(){return!at?.parked||l.roamPos.distanceTo(at.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(at.parked),l.roamYaw=at.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,at.parked=null,an.visible=!1,si(),!0)}function M0(){for(const n of Sn){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return b_(e)}for(const n of Tn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return w_(n);return!1}function Uu(n){if(n.actor)n.actor.stolen=!1;else{Oa(n.mesh);const e=n.spotRef;e?.savedM&&Tn.im&&(Tn.im.setMatrixAt(e.idx,e.savedM),Tn.imW.setMatrixAt(e.idx,e.savedM),Tn.im.instanceMatrix.needsUpdate=!0,Tn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function cl(){at&&(Uu(at),at=null),g0.splice(0).forEach(Uu),l.drivingStolen=!1}function rh(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&at)return l.roamAir=!1,l.roamVy=0,S_(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;zi.copy(l.roamPos),nh=l.roamYaw,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,an.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function oh(){return l.vehicle!=="foot"||l.roamPos.distanceTo(zi)>7?!1:(l.vehicle="car",l.roamPos.copy(zi),l.roamYaw=nh,l.camYaw=nh,l.speed=0,an.visible=!1,si(),!0)}function _0(){return l.vehicle!=="foot"||!ue||l.roamPos.distanceTo(ue.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(ue.pos),l.roamYaw=ue.yaw,l.camYaw=ue.yaw,l.speed=0,ue.vel.set(0,0,0),an.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function lh(){if(l.vehicle!=="heli"||!ue)return!1;const n=ce(ue.pos.x,ue.pos.z);return ue.pos.y-n>5.2||ue.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",l.roamPos.x=ue.pos.x+Math.cos(ue.yaw)*-5.6,l.roamPos.z=ue.pos.z+Math.sin(ue.yaw)*-5.6,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,an.visible=!0,!0)}function y0(){l.mode==="roam"&&(l.vehicle==="car"?rh()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(zi)<=(at?.parked?l.roamPos.distanceTo(at.parked):1/0)?oh()||Iu():Iu()||oh())||_0()||KM()||M0():lh())}function T_(n){const e=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,Ie.throttle),t=Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,Ie.brake),i=me.clamp((et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0)+Ie.steer,-1,1),s=et.has("ShiftLeft")||et.has("ShiftRight"),a=l.speed,r=(e-t)*(s?14.5:6.4);l.speed+=(r-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,S0(l.roamPos,{kind:"ground"}),l.roamPos.x=me.clamp(l.roamPos.x,-820,820),l.roamPos.z=me.clamp(l.roamPos.z,-1620,480),l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,b0(n,a),Zh(),an.position.copy(l.roamPos),an.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*me.clamp(Math.abs(l.speed)/5,0,1);for(const p of an.userData.limbs||[])p.mesh.rotation.x=h*p.amp*p.side*2.2,p.mesh.position.y=p.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(zi)<7,f=ue&&l.roamPos.distanceTo(ue.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):f&&(l.message="E — enter helicopter",l.messageTimer=.2))}function E_(n){if(!ue)return;const e=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,Ie.throttle)-Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,Ie.brake),t=me.clamp((et.has("KeyA")||et.has("ArrowLeft")?1:0)-(et.has("KeyD")||et.has("ArrowRight")?1:0)-Ie.steer,-1,1),i=ue.rpm>.55,s=et.has("ShiftLeft")||et.has("ShiftRight"),a=il?s?1:ue.pos.y-ce(ue.pos.x,ue.pos.z)>6?-.45:0:et.has("Space")?1:s?-1:0;ue.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(ue.yaw),o=-Math.cos(ue.yaw);i&&(ue.vel.x+=r*e*30*n,ue.vel.z+=o*e*30*n,ue.vel.y+=a*24*n,a===0&&(ue.vel.y-=ue.vel.y*1.6*n)),ue.vel.x-=ue.vel.x*.85*n,ue.vel.z-=ue.vel.z*.85*n,ue.vel.y-=ue.vel.y*1.1*n,ue.pos.addScaledVector(ue.vel,n);const c=ce(ue.pos.x,ue.pos.z);ue.pos.x=me.clamp(ue.pos.x,-1500,1500),ue.pos.z=me.clamp(ue.pos.z,-1900,700),ue.pos.y=Math.min(ue.pos.y,300),ue.pos.y<c+1.1&&(ue.pos.y=c+1.1,ue.vel.y=Math.max(0,ue.vel.y)),(pr(ue.pos,sn)||pr(ue.pos,fi))&&(ue.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=ue.pos.x,l.roamPos.y=ue.pos.y,l.roamPos.z=ue.pos.z,l.roamYaw=ue.yaw,l.speed=Math.hypot(ue.vel.x,ue.vel.z),ue.mesh.position.copy(ue.pos),ue.mesh.quaternion.setFromAxisAngle(jt,-ue.yaw),ue.mesh.rotateX(me.clamp((ue.vel.x*r+ue.vel.z*o)*.008,-.24,.24)),ue.mesh.rotateZ(me.clamp(t*.14,-.2,.2)),Zh()}function A_(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),a=Math.round(l.driftAcc*s);l.score+=a,Ui(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),wn(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function C_(n,e){const t=e.y+Vn,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=Jf),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,Mi("whoosh",.38,1.2,.08))):(l.roamVy=me.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const a=l.stuntRamp?.hoop;a&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-a.x,l.roamPos.y-a.y,l.roamPos.z-a.z)<a.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,wn(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),Mi("land",Math.min(.62,s/42),1,.1)||fr(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const a=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),r=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+a*140;r&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,ye.stunts=(ye.stunts||0)+1,Ui(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),wn(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const a=Math.round(40+l.roamAirT*70);l.score+=a,Ui(`+${a} AIR`),wn(760,.14)}}}l.roamPrevY=l.roamPos.y}const Ln=2.6;function b0(n,e){const t=l.waterDepth||0;if(l.roamPos.y>ce(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=Vs(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(n_(l.roamPos.clone(),Math.abs(e)),h_(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,r0(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function R_(n,e){for(const t of Sn)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of Sn){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,a=l.roamPos.z-t.z,r=(t.hw+t.hd)*.5+Ln+2.4;if(s*s+a*a<r*r&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,Ui("+45 NEAR MISS"),wn(520,.12,"square",.07);break}}}function pr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Vn+.45)continue;if(s.radius){const f=s.radius+Ln,p=n.x-s.x,m=n.z-s.z,x=p*p+m*m;if(x>=f*f)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+p/M*f,n.z=s.z+m/M*f;continue}const a=s.hw+Ln,r=s.hd+Ln,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(o),d=r-Math.abs(c);h<d?n.x=s.x+(o<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function w0(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||ke.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=me.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(ye.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function P_(n){let e=!1;for(let t=0;t<Sn.length;t++){const i=Sn[t];if(i.maxY!=null&&n.y>i.maxY+Vn+.45)continue;const s=i.hw+Ln,a=i.hd+Ln,r=n.x-i.x,o=n.z-i.z;if(Math.abs(r)>=s||Math.abs(o)>=a)continue;e=!0,w0(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(o);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(o<0?-a:a)}return e}function L_(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Vn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function D_(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,ye.splats++,c_();const e=wa.find(t=>!t.visible)||wa[ye.splats%Math.max(1,wa.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ce(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function I_(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of Cr){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=Ln+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(ce(i.x,i.z)+Vn))>3.2||(D_(i),t=!0)}return t}function S0(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=pr(n,sn),a=e?.kind==="ground"?pr(n,Qn):!1,r=pr(n,fi),o=e?.kind==="ground"?P_(n):!1;if(!s&&!a&&!r&&!o)break;t=!0}return t}function T0(n){const e=Ie.lookX*1.18,t=Ie.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Ie.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function Jh(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=me.lerp(n.x,e.x,a),o=me.lerp(n.z,e.z,a),c=me.lerp(n.y,e.y,a),h=ce(r,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function U_(n,e){const t=ce(n,e);let i=null;const s=p0(n,e);s&&s.y>t+4&&(i=s);const a=m0(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function Yo(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=me.lerp(n.x,e.x,a),o=me.lerp(n.z,e.z,a),c=me.lerp(n.y,e.y,a),h=U_(r,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function ch(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=me.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};Ne.position.y+=Jh(a,Ne.position,3.4),Ne.position.y+=Yo(a,Ne.position,4.2)}function E0(n){if(window.__freeCam)return;if(T0(n),Math.abs(l.speed)>Qc){let x=l.roamYaw-l.camYaw;x=Math.atan2(Math.sin(x),Math.cos(x)),l.camYaw+=x*(1-Math.pow(.08,n))}const e=l.camYaw+l.camLookYaw,t=Math.sin(e),i=-Math.cos(e),s=l.roamPos,a=me.clamp(l.cameraZoom,-.42,.9),r=me.clamp(Math.abs(l.speed)/135,0,1),o=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},c=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+a*.72)*o.d,h=(7.2+r*2.1+Math.max(0,a)*4.4-Math.min(0,a)*2+l.camLookPitch*5.8)*o.h,d=Uf.set(s.x-t*c,s.y+h,s.z-i*c);if(l.cameraShake>.01||l.collisionDrama>.01){const x=l.cameraShake+l.collisionDrama*.42;d.x+=(Math.random()-.5)*x*1.2,d.y+=(Math.random()-.5)*x*.75,d.z+=(Math.random()-.5)*x*1.2}const f=sl.set(s.x+t*(13+r*8-Math.min(a,0)*6),s.y+2.45+l.camLookPitch*13.5,s.z+i*(13+r*8-Math.min(a,0)*6));d.y=Math.max(d.y,ce(d.x,d.z)+3.5),d.y+=Jh(f,d,3.4),d.y+=Yo(f,d,4.2);const p=l.roamSlip>.35?.006:.0026;Ne.position.lerp(d,1-Math.pow(p,n)),Ne.position.y+=Yo(f,Ne.position,3.8)*.72,yn.position.copy(Ne.position),yn.lookAt(f),yn.rotateY(Math.PI),yn.rotateZ(-l.wheelSteer*r*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),Ne.quaternion.slerp(yn.quaternion,1-Math.pow(.05,n));const m=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+a*10;Math.abs(Ne.fov-m)>.02&&(Ne.fov+=(m-Ne.fov)*(1-Math.pow(.01,n)),Ne.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function F_(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Xe.best.textContent=`Best score ${l.best}`,Xe.resultText.textContent=`${n} Score ${t}. Time ${$o(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?$o(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Bt?.active&&e){[{key:"you",metric:l.totalDistance+.001},...Hn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Bt.points[c.key]+=IM[h]??0),Bt.raceIndex++;const r=Bt.raceIndex>=4,o=Kf();if(r){Bt.active=!1;const c=o[0].key==="you";c&&Bt.division>1?(localStorage.setItem("steel-ribbon-division",String(Bt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Zf(Bt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}$f(),s=`<span>Season — after race ${Bt.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,Xe.againBtn.textContent=Bt.active?"Next Race":"Back to Menu"}else Xe.againBtn.textContent="Race Again";Xe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,dl(),Xe.result.classList.remove("hidden")}function Fu(n="Craned back to the ribbon"){const e=xt(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function jh(n,e){return me.clamp(e*n.tangent.y,-48,48)}function z_(n=94){return se.gaps.map(e=>{const t=xt(e.start),i=xt(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=jh(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(me.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-o)*10)/10}})}function zu(n,e){l.grounded=!1,l.yVel=jh(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return jh(xt(n),e)},gapJumpReport(n){return z_(n)},sceneryClearanceReport(){return hM()},setSpeed(n){return l.speed=me.clamp(n,-14,156-l.damage*.42),mr(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=xt(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=me.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=me.clamp(e,-14,156-l.damage*.42),mr(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=me.clamp(n,0,99),mr(),l.damage},setCourse(n){return Br(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,Ne.position.set(n,e,t),Ne.lookAt(i,s,a),Ne.fov=62,Ne.updateProjectionMatrix(),"freecam"},listBoostPads(){return Sa.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return qs.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+Vs(n,e).depth.toFixed(3),ground:+ce(n,e).toFixed(2)}},activeGate(){const n=qt[l.objectiveIndex%qt.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Bt,division:Or(),position:Qh(),seasonRace:!!l.seasonRace,rivals:Hn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Bt=null,dl(),"reset"},renderInfo(){return{calls:ye.renderCalls||0,triangles:ye.renderTris||0,geometries:en.info.memory.geometries,textures:en.info.memory.textures,mobilePerf:il,staticMerge:ye.staticMerge||null}},drawAudit(n=20){const e=new Map;return Te.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=Sn[0]?.actor?.mesh;return{colliders:Sn.length,wheels:n?.userData?.wheels?.length??0,pedestrians:ye.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of Sn){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Se?{state:Se.ctx.state,master:+Se.master.gain.value.toFixed(2),engine:!!Se.rumble&&!!Se.growl&&!!Se.whine,fx:!!Se.wind&&!!Se.skid&&!!Se.boost,music:!!Se.musicGain,beat:Se.beat,samples:Object.keys(Yn.buffers).length,sampleLoops:Object.keys(Yn.loops),musicSample:!!Yn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:h0(),engineV2:!!Se.growlB&&!!Se.burble}:null},colliderAudit(){const n=[],e=[],t=ke.streetW*.5;for(let a=ke.x0;a<=ke.x1+1;a+=ke.pitch)n.push(Math.round(a));for(let a=ke.zNear;a>=ke.zFar-1;a-=ke.pitch)e.push(Math.round(a));const i=[],s=(a,r,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=ce(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const f of n)Math.abs(o.x-f)<t+c+Ln&&o.z<ke.zNear+h&&o.z>ke.zFar-h&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${f}`,overlap:+(t+c+Ln-Math.abs(o.x-f)).toFixed(1)});for(const f of e)Math.abs(o.z-f)<t+h+Ln&&o.x<ke.x1+c&&o.x>ke.x0-c&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${f}`,overlap:+(t+h+Ln-Math.abs(o.z-f)).toFixed(1)})}};return sn.forEach((a,r)=>s("Mn",r,a)),fi.forEach((a,r)=>s("Di",r,a)),Qn.forEach((a,r)=>s("$n",r,a)),{total:sn.length+fi.length+Qn.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&qo(),n==="foot"?l.vehicle==="car"?rh(!0):l.vehicle==="heli"&&lh():n==="heli"&&ue?(l.vehicle==="car"&&rh(!0),l.roamPos.set(ue.pos.x+3,ce(ue.pos.x+3,ue.pos.z),ue.pos.z),_0()):n==="car"&&(l.vehicle==="heli"&&(ue.pos.y=ce(ue.pos.x,ue.pos.z)+1.1,ue.vel.set(0,0,0),lh()),l.vehicle==="foot"&&(l.roamPos.copy(zi),oh())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:an.visible,heli:ue?{x:+ue.pos.x.toFixed(1),y:+ue.pos.y.toFixed(1),z:+ue.pos.z.toFixed(1),rpm:+ue.rpm.toFixed(2),scale:+ue.mesh.scale.x.toFixed(2),pad:ue.pad?{x:+ue.pad.x.toFixed(1),z:+ue.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+zi.x.toFixed(1),z:+zi.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:at?{type:at.type,fromTraffic:!!at.actor,pos:{x:+at.mesh.position.x.toFixed(1),y:+at.mesh.position.y.toFixed(2),z:+at.mesh.position.z.toFixed(1)},visible:at.mesh.visible,inScene:at.mesh.parent===Te,parked:at.parked?{x:+at.parked.x.toFixed(1),z:+at.parked.z.toFixed(1)}:null}:null,parkedSpots:Tn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?M0():!1},setHeat(n){return l.mode==="roam"&&(l.heat=me.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:lt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),evadeT:+lt.evadeT.toFixed(1),bustT:+lt.bustT.toFixed(2),blocks:lt.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:ye.busts||0}},policeTeleportNearest(n,e){const t=lt.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1),pickup:Ze.pickup?{x:+Ze.pickup.x.toFixed(1),z:+Ze.pickup.z.toFixed(1)}:null,dest:Ze.dest?{x:+Ze.dest.x.toFixed(1),z:+Ze.dest.z.toFixed(1)}:null,deliveries:ye.deliveries||0,fails:ye.deliveryFails||0}},jobSpawnNow(){return Ze.state==="idle"&&(Ze.cooldown=0,a0()),Ze.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==ii&&(nd(),localStorage.setItem("steel-ribbon-weather",ii)),ii},weatherInfo(){return{mode:ii,amt:+Ia().toFixed(2),roadRoughness:+(dn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of Sn)e.actor?.panicT>0&&n++;return n},setTod(n){return gr.includes(n)&&(kn=n,localStorage.setItem("steel-ribbon-tod",n),id()),kn},todInfo(){return{mode:kn,day:+Io.toFixed(3),night:+Uo.toFixed(3)}},listStuntRamps(){return(Ei||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of Tn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&qo(),l.roamPos.set(n,ce(n,e)+Vn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,si(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...ps,boostPads:Sa.length,gapBeacons:Rr.length,railRuns:ye.railRuns||0,railPosts:ye.railPosts||0,ponds:qs.length,cityPonds:ye.ponds||0,cloudSprites:ye.cloudSprites||0,helipad:ye.helipad||null,stuntRamps:ye.stuntRamps||0,propPlanes:ye.propPlanes||0}},stats(){return{trafficCrashes:ye.trafficCrashes,splats:ye.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},viewInfo(){const n=xt(l.s),e=l.y-2.1;return{trackView:xi,mode:l.mode,carVisible:Gt.visible,cockpitVisible:!!(ln&&ln.visible),camY:+Ne.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!Pi,overheadY:+hh(Ne.position.x,Ne.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return xi=n==="cockpit"?"cockpit":"chase",Qi(),xi},listCourses(){return Xs.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:vs,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Jm(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=Ne;const i=t.intersectObjects(Te.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=Ns(n,e,400);return{x:n,z:e,ground:+ce(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return Zs.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],o=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return sn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return Qn.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=Qn.filter(e=>e.hw);return{supports:eh,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of sn){const i=Ds(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:sn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of sn){const i=Pn(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:sn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return fi.concat(Qn.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:ye.traffic,pedestrians:ye.pedestrians,pedestriansActive:Cr.filter(e=>e.active).length,turns:ye.turns,splats:ye.splats,trafficCrashes:ye.trafficCrashes,streetLights:ye.streetLights,trafficLights:ye.trafficLights,stopSigns:ye.stopSigns,signs:ye.signs,roadDetails:{...ye.roadDetails},buildingArchetypes:{...ye.buildingArchetypes},zones:{...ye.zones},openerProps:ye.openerProps,signSamples:Xo.slice(0,n),types:{...ye.types},offRoadTraffic:Sn.filter(e=>!al(e.x,e.z,2)).length,trafficRoutes:th.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Sn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Cr.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...ye.roadDetails},e={...ye.buildingArchetypes},t={...ye.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,ye.signs/7)+Math.min(14,ye.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:ye.openerProps,signs:ye.signs,streetLights:ye.streetLights,streetGlowSprites:ps.streetGlowSprites,waterBlockers:ps.waterBlockers,lowFogDisks:ps.lowFogDisks}},objectiveReport(){const n=qt[l.objectiveIndex%Math.max(1,qt.length)];return{total:qt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:qt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:dr.filter(n=>n.life>0).length,debrisActive:ur.filter(n=>n.life>0).length,sparksActive:hr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Gt.userData.detailReport},racer:{...LM.userData.detailReport},namedParts:Gt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Gf(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=xt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=ce(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,r+Vn,s),l.roamYaw=a,l.camYaw=a,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ie.lookX=0,Ie.lookY=0,Ie.zoom=0,l.wheelSteer=0,l.speed=0,si();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),ch(),Ne.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),Ne.fov=69,Ne.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Ns(n,e,l.roamPos.y);l.roamPos.set(n,i.y+Vn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,si();const s=Math.sin(l.roamYaw),a=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-a*17),ch(),Ne.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+a*13),Ne.fov=69,Ne.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ie.zoom,i=30){Ie.lookX=me.clamp(n,-1,1),Ie.lookY=me.clamp(e,-1,1),Ie.zoom=me.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?E0(1/60):ed(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake};Ie.steer=me.clamp(e,-1,1),Ie.throttle=me.clamp(t,0,1),Ie.brake=me.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const o=Math.min(a,r);if(x0(o),l.mode!=="roam")break;r-=o}return Ie.steer=s.steer,Ie.throttle=s.throttle,Ie.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(A0(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=Uf.set(0,0,-1).applyQuaternion(Gt.quaternion).normalize(),t=sl.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=Ns(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+ce(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+Ne.position.x.toFixed(2),camY:+Ne.position.y.toFixed(2),camZ:+Ne.position.z.toFixed(2),fov:+Ne.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+Jh({x:n.x,y:n.y+2.6,z:n.z},{x:Ne.position.x,y:Ne.position.y,z:Ne.position.z},2.4).toFixed(3),elevatedCameraLift:+Yo({x:n.x,y:n.y+2.6,z:n.z},{x:Ne.position.x,y:Ne.position.y,z:Ne.position.z},3.8).toFixed(3),colliders:sn.length+Qn.length+fi.length+Sn.length,insideBuilding:sn.concat(Qn,fi,Sn).some(s=>L_(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Gt.userData.frontWheels?+Gt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function A0(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,Ie.throttle),i=Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,Ie.brake),s=me.clamp((et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0)+Ie.steer,-1,1)*Ff,a=t>.03&&!e,r=(et.has("ShiftLeft")||et.has("ShiftRight"))&&l.boost>.02&&a&&l.grounded,o=xt(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(a){const v=l.speed<0?40:0;l.speed+=((r?68:40)*ms().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=me.clamp(l.speed,-16,156*ms().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=r,r?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*ms().boostRegen);const f=et.has("Space")&&l.grounded,p=(16+h*.13)*(f?1.45:1)*ms().grip;l.lateralVel-=s*p*n,l.lateralVel-=l.lateralVel*(l.grounded?f?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const m=Fi(l.s),x=Math.abs(l.lateral)<se.width*.52,M=!m&&x;if(l.grounded&&(!M||Math.abs(l.lateral)>se.width*.5)&&zu(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=me.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&Ta(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector(jt,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=xt(l.s),_=v.p.y+2.1;if(!Fi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=_&&l.yVel<0){const E=-l.yVel,T=Math.abs(l.lateral)<se.width*.34&&E<30,R=Math.round(T?260+l.airtime*85:Math.max(30,120-E));l.y=_,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=R,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=T?"Clean landing":"Hard landing",l.messageTimer=.9,T?l.cleanLandings+=1:l.hardLandings+=1,Ui(`+${R} ${T?"CLEAN AIR":"LANDED"}`,T),T&&wn(990,.14),fr(E),Ta(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(jt,.7),T?7:24),l.airtime=0}l.y<-55&&(l.damage+=28,Fu("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,G_();const u=Zs.find(v=>v.rampType==="off");if(l.freeRun&&u&&Zl(g,l.totalDistance,u.exitS)&&l.lateral*u.dirSel>se.width*.2&&g_(u))return;const y=Math.floor(l.totalDistance/se.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;V_(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,Ui("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const _=Qh();F_(_===1?"You took the chequered gantry.":`You finished P${_}.`,_)})()}for(const v of se.gaps)Zl(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&zu(xt(v.start),v.name));if(l.grounded){for(const v of Sa)if(Zl(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const _=xt(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,Ui("+90 BOOST"),wn(640,.22,"sawtooth",.1),Ta(_.p.clone().addScaledVector(_.side,v.lat).addScaledVector(jt,1),10),fr(14);break}}l.damage=me.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),fr(40),l.damage=90),et.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),Fu("Manual reset"),et.delete("KeyR"))}function Nu(n){const e=se.length*se.laps,t=1+.07*(4-Or());for(const i of Hn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=me.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let f=i.base+d+h;i.key==="bishop"&&(f+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(f+=10*me.clamp(i.distance/Math.max(1,e),0,1)),i.speed=me.clamp(f*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=xt(i.s),a=Math.abs(i.distance-l.totalDistance);let r=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);r=me.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(jt,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new Et().makeBasis(s.side,jt,s.tangent));const o=a<26&&xi==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...Hn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function Qh(){return l.practice?1:1+Hn.filter(n=>n.distance>l.totalDistance).length}function N_(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),Ne.position.copy(i);const a=Math.abs(l.speed),r=68+Math.min(10,a*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(Ne.fov-r)>.02&&(Ne.fov+=(r-Ne.fov)*(1-Math.pow(.004,n)),Ne.updateProjectionMatrix());const o=xt(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,a/680),yn.position.copy(Ne.position),yn.lookAt(c),yn.rotateY(Math.PI),yn.rotateY(-l.camLookYaw),yn.rotateZ(-e.bank*.72-l.lateralVel*.006),yn.rotateX(e.grade*.18+(l.grounded?0:me.clamp(l.yVel,-30,30)*-.006)),Ne.quaternion.slerp(yn.quaternion,1-Math.pow(8e-4,n))}function hh(n,e,t,i){let s=1/0;const a=se.width*.5+2.2;for(const r of rl()){if(r.courseIndex!==vs||r.y<t||r.y>i||r.y>=s)continue;const o=n-r.x,c=e-r.z;o*o+c*c<a*a&&(s=r.y)}return s}function O_(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+me.clamp(l.cameraZoom,-.42,.9)*8,a=4.6+t*.014+l.camLookPitch*10,r=xt(l.s-s),o=hh(r.p.x,r.p.z,i+5,i+64);o-1.5<r.p.y+2&&(s=6.4,a=2.7,r=xt(l.s-s),o=hh(r.p.x,r.p.z,i+5,i+64));let c=me.lerp(r.p.y,i,.62)+a;const h=Vh.set(r.p.x+r.side.x*l.lateral*.72,0,r.p.z+r.side.z*l.lateral*.72);if(c=Math.max(c,r.p.y+2.35,ce(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const m=l.cameraShake;h.x+=(Math.random()-.5)*m*1.1,h.y+=(Math.random()-.5)*m*.6,h.z+=(Math.random()-.5)*m*1.1}Ne.position.distanceTo(h)>70&&Ne.position.copy(h),Ne.position.lerp(h,1-Math.pow(2e-4,n)),Ne.position.y=Math.max(Ne.position.y,r.p.y+2.05),o<1/0&&(Ne.position.y=Math.min(Ne.position.y,o-1.4));const d=xt(l.s+17+t*.09),f=d.p.clone().addScaledVector(d.side,l.lateral*.55);f.y+=2.1+l.camLookPitch*12,l.grounded||(f.y=me.lerp(f.y,l.y+1.2,.5)),yn.position.copy(Ne.position),yn.lookAt(f),yn.rotateY(Math.PI),yn.rotateY(-l.camLookYaw),yn.rotateZ(-e.bank*.42-l.lateralVel*.0034),Ne.quaternion.slerp(yn.quaternion,1-Math.pow(4e-4,n));const p=66+Math.min(11,t*.055)+(l.boosting?5:0)+me.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(Ne.fov-p)>.02&&(Ne.fov+=(p-Ne.fov)*(1-Math.pow(.004,n)),Ne.updateProjectionMatrix())}let pi=null,Pi=null,Yi=0;function B_(){try{Pi=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+vs)||"null")}catch{Pi=null}Yi=0}function k_(){pi&&Ma(pi),pi=Ys[Ji].build(),pi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),pi.visible=!1}function V_(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||Pi&&n>=Pi.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);Pi={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+vs,JSON.stringify(Pi))}catch{}l.message=`Ghost saved — ${$o(n)}`,l.messageTimer=1.3,Yi=0}function G_(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function H_(){if(!pi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&Pi?.samples?.length>2&&!window.__freeCam;if(pi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,Pi.time),t=Pi.samples;for(e<(t[Yi]?.[0]??0)&&(Yi=0);Yi<t.length-2&&t[Yi+1][0]<e;)Yi++;const i=t[Yi],s=t[Math.min(Yi+1,t.length-1)],a=me.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=me.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:a),o=me.lerp(i[2],s[2],a),c=me.lerp(i[3],s[3],a),h=xt((r%se.length+se.length)%se.length);pi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),pi.quaternion.setFromRotationMatrix(new Et().makeBasis(h.side,jt,h.tangent))}function W_(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&xi==="chase"&&!window.__freeCam;if(ln&&(ln.visible=!e),Gt.visible!==e&&(Gt.visible=e),!e)return;const t=xt(l.s);Gt.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new Et().makeBasis(t.side,jt,t.tangent);Gt.quaternion.setFromRotationMatrix(i),l.grounded?(Gt.rotateX(-t.grade*.5),Gt.rotateZ(t.bank*.6+me.clamp(l.lateralVel*.012,-.16,.16))):Gt.rotateX(me.clamp(-l.yVel*.011,-.34,.4));const s=Gt.userData.frontWheels,a=me.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let So=.6;function X_(n){if(window.__freeCam)return;So+=n*.13;const e=80,t=300,i=ce(e,t);Gt.visible=!0,ln&&(ln.visible=!1),Gt.position.set(e,i+.85,t),Gt.quaternion.setFromAxisAngle(jt,Math.PI*.24);const s=16.5;Ne.position.set(e+Math.cos(So)*s,i+5.3+Math.sin(So*.57)*1.1,t+Math.sin(So)*s),Ne.lookAt(e,i+1.5,t),Ne.rotateY(.3),Math.abs(Ne.fov-58)>.1&&(Ne.fov=58,Ne.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function ed(n){if(window.__freeCam)return;T0(n);const e=xt(l.s);xi==="chase"&&l.mode!=="menu"?O_(n,e):N_(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=sl.set(0,0,-1).applyQuaternion(Ne.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const Bs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},tr=[28,54,82,110,134,156];function q_(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<tr.length;o++)n>tr[o]&&(e=o+2);e=Math.min(e,tr.length);const t=e===1?0:tr[e-2],i=tr[e-1],s=i>t?me.clamp((n-t)/(i-t),0,1):0,a=e===1?Bs.idle:Bs.postShift;let r=a+s*(Bs.shift-a);return n<.4&&(r=Bs.idle),{gear:e,rpm:r}}let Ou=performance.now(),nc=0,ic=0;function C0(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function Y_(n,e){const t=Xe.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=C0(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=o(M),u=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=u?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(u?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),u){const _=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),_[0],_[1])}}const d=me.clamp(n/h,0,1),f=o(d),p=c(f,r-r*.06),m=c(f+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(m[0],m[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function $_(n,e){const t=Xe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=C0(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke();const d=me.clamp(n,0,1),f=n<.25;i.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,u=o(g),y=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(u,r-r*.02),_=c(u,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(_[0],_[1]),i.stroke(),y){const E=c(u,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const p=o(d),m=c(p,r-r*.06),x=c(p+Math.PI,r*.14);i.strokeStyle=f?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function Z_(n,e){const t=Xe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const o=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=Bs.max,f=v=>Math.PI-v*Math.PI,p=(v,_)=>[o+Math.cos(v)*_,c-Math.sin(v)*_];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,f(1),f(0)),i.stroke();const m=Bs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,f(1),f(m)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const _=v/9,E=f(_),T=v*1e3>=Bs.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const R=p(E,h-h*.02),C=p(E,h-h*.18);i.beginPath(),i.moveTo(R[0],R[1]),i.lineTo(C[0],C[1]),i.stroke();const S=p(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),S[0],S[1]),v<9){const b=f((v+.5)/9),L=p(b,h-h*.02),I=p(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(I[0],I[1]),i.stroke()}}const x=me.clamp(n/d,0,1),M=f(x),g=p(M,h-h*.06),u=p(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(u[0],u[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function mr(){se.length*se.laps;const n=Mu(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${Qh()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),Xe.damage.style.width=`${Math.round(l.damage)}%`,Xe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,Xe.timer.textContent=$o(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";Xe.score.textContent=t?`Gates ${l.objectiveHits}/${qt.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(Xe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&at?`${at.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${Or()}`,t&&qt.length){const d=qt[l.objectiveIndex%qt.length];Xe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(Xe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),t&&Ze.state==="active"&&(Xe.trackName.textContent=`Deliver the ${Ze.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ze.timeLeft))}s`),Xe.hud.style.display=s?"flex":"none",Xe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",Xe.touchControls.style.display=s?"":"none",Xe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of Hn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:Mu(d.distance))*100)}%`);const a=q_();l.gear=a.gear;const r=performance.now(),o=Math.min(.05,(r-Ou)/1e3);Ou=r;const c=1-Math.exp(-o*(a.rpm>l.tachRpm?10:6));l.tachRpm+=(a.rpm-l.tachRpm)*c,Z_(l.tachRpm,a.gear);const h=Math.abs(l.speed)*2.25;nc+=(h-nc)*(1-Math.exp(-o*8)),ic+=(l.boost-ic)*(1-Math.exp(-o*9)),Y_(nc,l.speed<-.5),$_(ic,l.boosting),Xe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),Xe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(Xe.centerMessage.textContent="Paused",Xe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(Xe.centerMessage.textContent=l.message,Xe.centerMessage.classList.remove("hidden")):Xe.centerMessage.classList.add("hidden")}function $o(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function R0(){en.info.reset();const n=$v.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?T_(e):l.vehicle==="heli"?E_(e):x0(e),E0(e),v_()):l.mode==="menu"?(Nu(e),X_(e)):(A0(e),Nu(e),W_(),H_(),ed(e)),y_(),__(),di&&di.position.copy(Ne.position),m_(e),Gf(e),mr(),x_(),sr.uniforms.uTime.value+=e,Bf.forEach(i=>i.uniforms.uTime.value+=e),sr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(et.has("ShiftLeft")||et.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);sr.uniforms.uBoost.value+=(t-sr.uniforms.uBoost.value)*Math.min(1,e*6),Ba.render(),ye.renderCalls=en.info.render.calls,ye.renderTris=en.info.render.triangles,requestAnimationFrame(R0)}window.addEventListener("keydown",n=>{et.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused")&&Kv(),n.code==="KeyE"&&y0(),n.code==="KeyN"&&O0(),n.code==="KeyV"&&nd(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",et.clear(),Ur()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",Ur(),Gt.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Qi(),Xe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>et.delete(n.code));window.addEventListener("resize",()=>{Ne.aspect=window.innerWidth/window.innerHeight,Ne.updateProjectionMatrix(),en.setSize(window.innerWidth,window.innerHeight),Ba.setSize(window.innerWidth,window.innerHeight),o0.setSize(window.innerWidth,window.innerHeight)});const Zo=()=>{ys(),window.removeEventListener("pointerdown",Zo),window.removeEventListener("keydown",Zo)};window.addEventListener("pointerdown",Zo);window.addEventListener("keydown",Zo);const Dr=document.createElement("button");Dr.id="volBtn",Dr.type="button";function P0(){Dr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}P0();Dr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Se&&Se.master.gain.setTargetAtTime(e,Se.ctx.currentTime,.05),P0()});Xe.menu.appendChild(Dr);const Ir=document.createElement("button");Ir.id="musicBtn",Ir.type="button";function L0(){Ir.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}L0();Ir.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),ys(),L0()});Xe.menu.appendChild(Ir);const xr=document.createElement("button");xr.id="actionBtn",xr.type="button",xr.textContent="E";xr.addEventListener("pointerdown",n=>{n.preventDefault(),ys(),y0()});Xe.touchControls.appendChild(xr);const hl=document.createElement("div");hl.className="course-select";hl.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Xe.freeRunBtn.parentNode.insertBefore(hl,Xe.freeRunBtn);const D0=[];Ys.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>DM(e)),hl.querySelector("#carButtons").appendChild(t),D0.push(t)});function dh(){const n=Ys[Ji],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),D0.forEach((t,i)=>t.classList.toggle("active",i===Ji))}dh();Xe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+Hn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Xe.playerProgress=document.querySelector("#playerProgress");Hn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function dl(){const n=Or();Xe.startBtn.textContent=Bt?.active?`Continue Season — Race ${Bt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Kf();e.innerHTML=`<span>Division ${Zf(n)}${Bt?.active?` — after race ${Bt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Bt?` — ${i.pts} pts`:""}</b>`).join("")}}function K_(){l.mode="menu",Ur(),Gt.visible=!1,ln&&(ln.visible=!0),ll(!1),document.body.classList.remove("roam-mode"),Qi(),dl(),Xe.result.classList.add("hidden"),Xe.menu.classList.remove("hidden")}dl();Xe.startBtn.addEventListener("click",()=>{Bt&&Bt.active||UM(),Br(me.clamp(Bt.raceIndex,0,3)),Lr(!1,!1,!0)});Xe.practiceBtn.addEventListener("click",()=>Lr(!0));Xe.freeRunBtn.addEventListener("click",()=>Lr(!0,!0));Xe.roamBtn.addEventListener("click",()=>qo());Xe.againBtn.addEventListener("click",()=>{l.seasonRace&&Bt?Bt.active&&Bt.raceIndex<4?(Br(Bt.raceIndex),Lr(!1,!1,!0)):K_():Lr(!1)});Xe.courseButtons.forEach(n=>{n.addEventListener("click",()=>Br(Number(n.dataset.course)))});function I0(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Ur(){Ie.steer=0,Ie.throttle=0,Ie.brake=0,Ie.lookX=0,Ie.lookY=0,Ie.zoom=0,Ie.lookPointer=null,Ie.drivePointer=null,Ie.pinchStartDistance=0,Ie.pinchStartZoom=0;for(const n of Xe.touchControls.querySelectorAll(".touch-stick"))I0(n)}function To(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=me.clamp(e.clientX-(t.left+t.width/2),-i,i),a=me.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Ie.lookX=me.clamp(s/i,-1,1),Ie.lookY=me.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ie.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ie.lookY*i)}px`);else{const o=me.clamp(s/i,-1,1),c=me.clamp(-a/i,-1,1);Ie.steer=o,Ie.throttle=Math.max(0,c),Ie.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function Bu(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function ku(n,e){e==="look"?(Ie.lookX=0,Ie.lookY=0,Ie.lookPointer=null):(Ie.steer=0,Ie.throttle=0,Ie.brake=0,Ie.drivePointer=null),I0(n)}function J_(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function U0(n,e=!1){if(n.touches.length<2){Ie.pinchStartDistance=0;return}const t=J_(n.touches[0],n.touches[1]);if(e||!(Ie.pinchStartDistance>0)){Ie.pinchStartDistance=t,Ie.pinchStartZoom=Ie.zoom;return}const i=Math.max(.2,t/Ie.pinchStartDistance);Ie.zoom=me.clamp(Ie.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Xe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),ys(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Ie.lookPointer=s.pointerId),e==="drive"&&(Ie.drivePointer=s.pointerId),To(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ie.lookPointer:Ie.drivePointer)===s.pointerId&&(s.preventDefault(),To(n,s))},{passive:!1});const t=s=>{(e==="look"?Ie.lookPointer:Ie.drivePointer)===s.pointerId&&ku(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),ys(),l.mode==="paused"&&(l.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Ie.lookPointer=a.identifier),e==="drive"&&(Ie.drivePointer=a.identifier),To(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Ie.lookPointer:Ie.drivePointer,r=Bu(s,a);r&&(s.preventDefault(),To(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Ie.lookPointer:Ie.drivePointer;Bu(s,a)&&(s.preventDefault(),ku(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Xe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),ys(),et.add(e),n.setPointerCapture(i.pointerId)});const t=()=>et.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Nr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),U0(n,!0))},{passive:!1});Nr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),U0(n))},{passive:!1});Nr.addEventListener("touchend",n=>{n.touches.length<2&&(Ie.pinchStartDistance=0)},{passive:!1});Nr.addEventListener("touchcancel",()=>{Ie.pinchStartDistance=0},{passive:!1});var wi=0;function Ia(){return wi}let ii=localStorage.getItem("steel-ribbon-weather")||"clear";ii==="rain"||(ii="clear");const td=420,F0=[];for(let n=0;n<td;n++)F0.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const Ko=new Yt;Ko.setAttribute("position",new _t(new Float32Array(td*6),3));const z0=new ko({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),ks=new hm(Ko,z0);ks.frustumCulled=!1,ks.renderOrder=40,ks.visible=!1,Te.add(ks);mn(new Ut,(n,e)=>{const t=ii==="rain"?1:0;if(wi+=(t-wi)*Math.min(1,e*1.3),t===0&&wi<.01&&(wi=0),ks.visible=wi>.02,z0.opacity=.34*wi,ks.visible){ks.position.copy(Ne.position);const i=Ko.attributes.position.array;for(let s=0;s<td;s++){const a=F0[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}Ko.attributes.position.needsUpdate=!0}dn.roadMat&&(dn.roadMat.roughness=.62-.37*wi,dn.roadMat.metalness=.1+.26*wi,dn.roadMat.envMapIntensity=.8+.9*wi)});function nd(){ii=ii==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",ii),N0(),l.message=ii==="rain"?"Rain rolling in":"Skies clearing",l.messageTimer=1.2}const Fr=document.createElement("button");Fr.id="weatherBtn",Fr.type="button";function N0(){Fr.textContent=ii==="rain"?"🌧 Rain":"☀ Clear"}N0();Fr.addEventListener("click",n=>{n.stopPropagation(),nd()});Xe.menu.appendChild(Fr);const gr=["dusk","night","day","cycle"],j_={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let kn=localStorage.getItem("steel-ribbon-tod")||"dusk";gr.includes(kn)||(kn="dusk");let Io=0,Uo=0,sc=95;const Q_=new rt,uh=new rt,ey=new rt;function Ps(n,e,t,i,s){return ey.set(n).lerp(Q_.set(e),i).lerp(uh.set(t),s)}const cs=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Te.traverse(n=>{n.isSprite&&n.renderOrder===-50&&dn.cloudMats.push(n.material)});function ty(n,e){if(!dn.skyU)return;const t=Ia();dn.skyU.uDay.value=n,dn.skyU.uNight.value=e,dn.skyU.uRain.value=t;const i=dn;i.hemi.color.copy(Ps(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(Ps(3097190,5925464,789534,n,e)),i.hemi.intensity=cs(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(Ps(7179775,13096432,2240591,n,e)),i.fill.intensity=cs(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(Ps(16752724,16774880,10336511,n,e)),i.key.intensity=cs(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=cs(.5,.3,.1,n,e)*(1-.4*t),Te.fog.color.copy(Ps(14719602,12834794,723741,n,e).lerp(uh.set(5923950),.6*t)),Te.fog.near=cs(360,430,300,n,e)*(1-.45*t),Te.fog.far=cs(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(Ps(16764250,16777198,14542591,n,e)),i.sunMat.opacity=cs(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=cs(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=Ps(16777215,16777215,3687001,n,e).lerp(uh.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}mn(new Ut,(n,e)=>{let t=0,i=0;if(kn==="day")t=1;else if(kn==="night")i=1;else if(kn==="cycle"){sc=(sc+e)%270;const a=sc;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);Io+=(t-Io)*s,Uo+=(i-Uo)*s,ty(Io,Uo)});function O0(){kn=gr[(gr.indexOf(kn)+1)%gr.length],localStorage.setItem("steel-ribbon-tod",kn),id(),l.message=`Time of day: ${kn.toUpperCase()}`,l.messageTimer=1.2}const zr=document.createElement("button");zr.id="todBtn",zr.type="button";function id(){zr.textContent=`${j_[kn]} ${kn[0].toUpperCase()}${kn.slice(1)}`}id();zr.addEventListener("click",n=>{n.stopPropagation(),O0()});Xe.menu.appendChild(zr);function ny(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of Hh)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of qt)e(c.marker);e(Gt),e(an),typeof ln<"u"&&e(ln),typeof pi<"u"&&e(pi),ue&&e(ue.mesh),typeof di<"u"&&e(di),typeof Si<"u"&&Si&&e(Si);for(const c of Hn)e(c.mesh);const i=new Map;Te.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let m=c;m&&m!==Te;m=m.parent){if(n.has(m)||!m.visible)return;const x=m.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const f=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let p=i.get(f);p||i.set(f,p=[]),p.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(m=>{m.updateWorldMatrix(!0,!1);const x=m.geometry.clone().applyMatrix4(m.matrixWorld);for(const M of Object.keys(x.attributes))M==="position"||M==="normal"||M==="uv"||x.deleteAttribute(M);return x}),d=gs(h,!1);if(!d)continue;const f=c[0],p=new O(d,f.material);p.castShadow=f.castShadow,p.receiveShadow=f.receiveShadow,p.matrixAutoUpdate=!1,Te.add(p);for(const m of c)r.set(m.geometry.uuid,m.geometry),m.removeFromParent(),a++;s++}catch{}const o=new Set;Te.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of r)o.has(c)||h.dispose();ye.staticMerge={groups:s,meshesRemoved:a}}ny();const iy=xt(l.s);l.y=iy.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;ed(.016);mr();R0();
