(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const cc="181",Zu=0,qc=1,Ku=2,bd=1,wd=2,yi=3,Gi=0,gn=1,pt=2,li=0,Os=1,Kn=2,Yc=3,$c=4,Ju=5,ts=100,ju=101,Qu=102,ef=103,tf=104,nf=200,sf=201,rf=202,af=203,ll=204,cl=205,of=206,lf=207,cf=208,hf=209,df=210,uf=211,ff=212,pf=213,mf=214,hl=0,dl=1,ul=2,Ws=3,fl=4,pl=5,ml=6,xl=7,hc=0,xf=1,gf=2,Vi=0,Td=1,Ed=2,Ad=3,dc=4,Cd=5,Rd=6,Pd=7,Ld=300,Xs=301,qs=302,gl=303,vl=304,so=306,_n=1e3,wi=1001,_l=1002,Ln=1003,vf=1004,ia=1005,Vn=1006,go=1007,is=1008,ui=1009,Dd=1010,Id=1011,Fr=1012,uc=1013,ds=1014,ai=1015,ci=1016,fc=1017,pc=1018,Nr=1020,Ud=35902,Fd=35899,Nd=1021,zd=1022,Jn=1023,zr=1026,Or=1027,mc=1028,xc=1029,gc=1030,vc=1031,_c=1033,Oa=33776,Ba=33777,ka=33778,Va=33779,Ml=35840,yl=35841,Sl=35842,bl=35843,wl=36196,Tl=37492,El=37496,Al=37808,Cl=37809,Rl=37810,Pl=37811,Ll=37812,Dl=37813,Il=37814,Ul=37815,Fl=37816,Nl=37817,zl=37818,Ol=37819,Bl=37820,kl=37821,Vl=36492,Gl=36494,Hl=36495,Wl=36283,Xl=36284,ql=36285,Yl=36286,_f=3200,Mf=3201,Mc=0,yf=1,Oi="",wt="srgb",Ys="srgb-linear",qa="linear",zt="srgb",gs=7680,Zc=519,Sf=512,bf=513,wf=514,Od=515,Tf=516,Ef=517,Af=518,Cf=519,$l=35044,Kc="300 es",oi=2e3,Ya=2001;function Bd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function $a(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Rf(){const n=$a("canvas");return n.style.display="block",n}const Jc={};function Za(...n){const e="THREE."+n.shift();console.log(e,...n)}function ht(...n){const e="THREE."+n.shift();console.warn(e,...n)}function Kt(...n){const e="THREE."+n.shift();console.error(e,...n)}function Br(...n){const e=n.join(" ");e in Jc||(Jc[e]=!0,ht(...n))}function Pf(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class er{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jc=1234567;const wr=Math.PI/180,kr=180/Math.PI;function hi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(pn[n&255]+pn[n>>8&255]+pn[n>>16&255]+pn[n>>24&255]+"-"+pn[e&255]+pn[e>>8&255]+"-"+pn[e>>16&15|64]+pn[e>>24&255]+"-"+pn[t&63|128]+pn[t>>8&255]+"-"+pn[t>>16&255]+pn[t>>24&255]+pn[i&255]+pn[i>>8&255]+pn[i>>16&255]+pn[i>>24&255]).toLowerCase()}function _t(n,e,t){return Math.max(e,Math.min(t,n))}function yc(n,e){return(n%e+e)%e}function Lf(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Df(n,e,t){return n!==e?(t-n)/(e-n):0}function Tr(n,e,t){return(1-t)*n+t*e}function If(n,e,t,i){return Tr(n,e,1-Math.exp(-t*i))}function Uf(n,e=1){return e-Math.abs(yc(n,e*2)-e)}function Ff(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Nf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function zf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Of(n,e){return n+Math.random()*(e-n)}function Bf(n){return n*(.5-Math.random())}function kf(n){n!==void 0&&(jc=n);let e=jc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vf(n){return n*wr}function Gf(n){return n*kr}function Hf(n){return(n&n-1)===0&&n!==0}function Wf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Xf(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function qf(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),f=r((e-i)/2),m=a((e-i)/2),p=r((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(o*u,l*f,l*m,o*c);break;case"YZY":n.set(l*m,o*u,l*f,o*c);break;case"ZXZ":n.set(l*f,l*m,o*u,o*c);break;case"XZX":n.set(o*u,l*x,l*p,o*c);break;case"YXY":n.set(l*p,o*u,l*x,o*c);break;case"ZYZ":n.set(l*x,l*p,o*u,o*c);break;default:ht("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ot(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Pe={DEG2RAD:wr,RAD2DEG:kr,generateUUID:hi,clamp:_t,euclideanModulo:yc,mapLinear:Lf,inverseLerp:Df,lerp:Tr,damp:If,pingpong:Uf,smoothstep:Ff,smootherstep:Nf,randInt:zf,randFloat:Of,randFloatSpread:Bf,seededRandom:kf,degToRad:Vf,radToDeg:Gf,isPowerOfTwo:Hf,ceilPowerOfTwo:Wf,floorPowerOfTwo:Xf,setQuaternionFromProperEuler:qf,normalize:Ot,denormalize:Zn};class Te{constructor(e=0,t=0){Te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(_t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ei{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3],m=r[a+0],p=r[a+1],x=r[a+2],_=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o>=1){e[t+0]=m,e[t+1]=p,e[t+2]=x,e[t+3]=_;return}if(f!==_||l!==m||c!==p||u!==x){let g=l*m+c*p+u*x+f*_;g<0&&(m=-m,p=-p,x=-x,_=-_,g=-g);let d=1-o;if(g<.9995){const v=Math.acos(g),M=Math.sin(v);d=Math.sin(d*v)/M,o=Math.sin(o*v)/M,l=l*d+m*o,c=c*d+p*o,u=u*d+x*o,f=f*d+_*o}else{l=l*d+m*o,c=c*d+p*o,u=u*d+x*o,f=f*d+_*o;const v=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=v,c*=v,u*=v,f*=v}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=r[a],m=r[a+1],p=r[a+2],x=r[a+3];return e[t]=o*x+u*f+l*p-c*m,e[t+1]=l*x+u*m+c*f-o*p,e[t+2]=c*x+u*p+o*m-l*f,e[t+3]=u*x-o*f-l*m-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(r/2),m=l(i/2),p=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=m*u*f+c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f-m*p*x;break;case"YXZ":this._x=m*u*f+c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f+m*p*x;break;case"ZXY":this._x=m*u*f-c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f-m*p*x;break;case"ZYX":this._x=m*u*f-c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f+m*p*x;break;case"YZX":this._x=m*u*f+c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f-m*p*x;break;case"XZY":this._x=m*u*f-c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f+m*p*x;break;default:ht("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],m=i+o+f;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>f){const p=2*Math.sqrt(1+i-o-f);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>f){const p=2*Math.sqrt(1+o-i-f);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(_t(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return vo.copy(this).projectOnVector(e),this.sub(vo)}reflect(e){return this.sub(vo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(_t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vo=new P,Qc=new Ei;class gt{constructor(e,t,i,s,r,a,o,l,c){gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],m=i[2],p=i[5],x=i[8],_=s[0],g=s[3],d=s[6],v=s[1],M=s[4],y=s[7],E=s[2],T=s[5],R=s[8];return r[0]=a*_+o*v+l*E,r[3]=a*g+o*M+l*T,r[6]=a*d+o*y+l*R,r[1]=c*_+u*v+f*E,r[4]=c*g+u*M+f*T,r[7]=c*d+u*y+f*R,r[2]=m*_+p*v+x*E,r[5]=m*g+p*M+x*T,r[8]=m*d+p*y+x*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,m=o*l-u*r,p=c*r-a*l,x=t*f+i*m+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=f*_,e[1]=(s*c-u*i)*_,e[2]=(o*i-s*a)*_,e[3]=m*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(_o.makeScale(e,t)),this}rotate(e){return this.premultiply(_o.makeRotation(-e)),this}translate(e,t){return this.premultiply(_o.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _o=new gt,eh=new gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),th=new gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yf(){const n={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===zt&&(s.r=Ti(s.r),s.g=Ti(s.g),s.b=Ti(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===zt&&(s.r=Bs(s.r),s.g=Bs(s.g),s.b=Bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Oi?qa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Br("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Br("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ys]:{primaries:e,whitePoint:i,transfer:qa,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wt},outputColorSpaceConfig:{drawingBufferColorSpace:wt}},[wt]:{primaries:e,whitePoint:i,transfer:zt,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wt}}}),n}const Ct=Yf();function Ti(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Bs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vs;class $f{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vs===void 0&&(vs=$a("canvas")),vs.width=e.width,vs.height=e.height;const s=vs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=vs}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$a("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ti(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ti(t[i]/255)*255):t[i]=Ti(t[i]);return{data:t,width:e.width,height:e.height}}else return ht("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zf=0;class Sc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Mo(s[a].image)):r.push(Mo(s[a]))}else r=Mo(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Mo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?$f.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ht("Texture: Unable to serialize Texture."),{})}let Kf=0;const yo=new P;class vn extends er{constructor(e=vn.DEFAULT_IMAGE,t=vn.DEFAULT_MAPPING,i=wi,s=wi,r=Vn,a=is,o=Jn,l=ui,c=vn.DEFAULT_ANISOTROPY,u=Oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=hi(),this.name="",this.source=new Sc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(yo).x}get height(){return this.source.getSize(yo).y}get depth(){return this.source.getSize(yo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){ht(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ht(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ld)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _n:e.x=e.x-Math.floor(e.x);break;case wi:e.x=e.x<0?0:1;break;case _l:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _n:e.y=e.y-Math.floor(e.y);break;case wi:e.y=e.y<0?0:1;break;case _l:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=Ld;vn.DEFAULT_ANISOTROPY=1;class kt{constructor(e=0,t=0,i=0,s=1){kt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],m=l[1],p=l[5],x=l[9],_=l[2],g=l[6],d=l[10];if(Math.abs(u-m)<.01&&Math.abs(f-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(u+m)<.1&&Math.abs(f+_)<.1&&Math.abs(x+g)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(p+1)/2,E=(d+1)/2,T=(u+m)/4,R=(f+_)/4,C=(x+g)/4;return M>y&&M>E?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=T/i,r=R/i):y>E?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=C/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=R/r,s=C/r),this.set(i,s,r,t),this}let v=Math.sqrt((g-x)*(g-x)+(f-_)*(f-_)+(m-u)*(m-u));return Math.abs(v)<.001&&(v=1),this.x=(g-x)/v,this.y=(f-_)/v,this.z=(m-u)/v,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this.w=_t(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this.w=_t(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jf extends er{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new kt(0,0,e,t),this.scissorTest=!1,this.viewport=new kt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new vn(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Sc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qn extends Jf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class kd extends vn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class jf extends vn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ps{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Wn):Wn.fromBufferAttribute(r,a),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),sa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sa.copy(i.boundingBox)),sa.applyMatrix4(e.matrixWorld),this.union(sa)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(lr),ra.subVectors(this.max,lr),_s.subVectors(e.a,lr),Ms.subVectors(e.b,lr),ys.subVectors(e.c,lr),Ci.subVectors(Ms,_s),Ri.subVectors(ys,Ms),Xi.subVectors(_s,ys);let t=[0,-Ci.z,Ci.y,0,-Ri.z,Ri.y,0,-Xi.z,Xi.y,Ci.z,0,-Ci.x,Ri.z,0,-Ri.x,Xi.z,0,-Xi.x,-Ci.y,Ci.x,0,-Ri.y,Ri.x,0,-Xi.y,Xi.x,0];return!So(t,_s,Ms,ys,ra)||(t=[1,0,0,0,1,0,0,0,1],!So(t,_s,Ms,ys,ra))?!1:(aa.crossVectors(Ci,Ri),t=[aa.x,aa.y,aa.z],So(t,_s,Ms,ys,ra))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const mi=[new P,new P,new P,new P,new P,new P,new P,new P],Wn=new P,sa=new ps,_s=new P,Ms=new P,ys=new P,Ci=new P,Ri=new P,Xi=new P,lr=new P,ra=new P,aa=new P,qi=new P;function So(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){qi.fromArray(n,r);const o=s.x*Math.abs(qi.x)+s.y*Math.abs(qi.y)+s.z*Math.abs(qi.z),l=e.dot(qi),c=t.dot(qi),u=i.dot(qi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Qf=new ps,cr=new P,bo=new P;class tr{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Qf.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;cr.subVectors(e,this.center);const t=cr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(cr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(cr.copy(e.center).add(bo)),this.expandByPoint(cr.copy(e.center).sub(bo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const xi=new P,wo=new P,oa=new P,Pi=new P,To=new P,la=new P,Eo=new P;class bc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){wo.copy(e).add(t).multiplyScalar(.5),oa.copy(t).sub(e).normalize(),Pi.copy(this.origin).sub(wo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(oa),o=Pi.dot(this.direction),l=-Pi.dot(oa),c=Pi.lengthSq(),u=Math.abs(1-a*a);let f,m,p,x;if(u>0)if(f=a*l-o,m=a*o-l,x=r*u,f>=0)if(m>=-x)if(m<=x){const _=1/u;f*=_,m*=_,p=f*(f+a*m+2*o)+m*(a*f+m+2*l)+c}else m=r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;else m=-r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;else m<=-x?(f=Math.max(0,-(-a*r+o)),m=f>0?-r:Math.min(Math.max(-r,-l),r),p=-f*f+m*(m+2*l)+c):m<=x?(f=0,m=Math.min(Math.max(-r,-l),r),p=m*(m+2*l)+c):(f=Math.max(0,-(a*r+o)),m=f>0?r:Math.min(Math.max(-r,-l),r),p=-f*f+m*(m+2*l)+c);else m=a>0?-r:r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(wo).addScaledVector(oa,m),p}intersectSphere(e,t){xi.subVectors(e.center,this.origin);const i=xi.dot(this.direction),s=xi.dot(xi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,m=this.origin;return c>=0?(i=(e.min.x-m.x)*c,s=(e.max.x-m.x)*c):(i=(e.max.x-m.x)*c,s=(e.min.x-m.x)*c),u>=0?(r=(e.min.y-m.y)*u,a=(e.max.y-m.y)*u):(r=(e.max.y-m.y)*u,a=(e.min.y-m.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-m.z)*f,l=(e.max.z-m.z)*f):(o=(e.max.z-m.z)*f,l=(e.min.z-m.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,i,s,r){To.subVectors(t,e),la.subVectors(i,e),Eo.crossVectors(To,la);let a=this.direction.dot(Eo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pi.subVectors(this.origin,e);const l=o*this.direction.dot(la.crossVectors(Pi,la));if(l<0)return null;const c=o*this.direction.dot(To.cross(Pi));if(c<0||l+c>a)return null;const u=-o*Pi.dot(Eo);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tt{constructor(e,t,i,s,r,a,o,l,c,u,f,m,p,x,_,g){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,f,m,p,x,_,g)}set(e,t,i,s,r,a,o,l,c,u,f,m,p,x,_,g){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=m,d[3]=p,d[7]=x,d[11]=_,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Ss.setFromMatrixColumn(e,0).length(),r=1/Ss.setFromMatrixColumn(e,1).length(),a=1/Ss.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const m=a*u,p=a*f,x=o*u,_=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=p+x*c,t[5]=m-_*c,t[9]=-o*l,t[2]=_-m*c,t[6]=x+p*c,t[10]=a*l}else if(e.order==="YXZ"){const m=l*u,p=l*f,x=c*u,_=c*f;t[0]=m+_*o,t[4]=x*o-p,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=p*o-x,t[6]=_+m*o,t[10]=a*l}else if(e.order==="ZXY"){const m=l*u,p=l*f,x=c*u,_=c*f;t[0]=m-_*o,t[4]=-a*f,t[8]=x+p*o,t[1]=p+x*o,t[5]=a*u,t[9]=_-m*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const m=a*u,p=a*f,x=o*u,_=o*f;t[0]=l*u,t[4]=x*c-p,t[8]=m*c+_,t[1]=l*f,t[5]=_*c+m,t[9]=p*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const m=a*l,p=a*c,x=o*l,_=o*c;t[0]=l*u,t[4]=_-m*f,t[8]=x*f+p,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*f+x,t[10]=m-_*f}else if(e.order==="XZY"){const m=a*l,p=a*c,x=o*l,_=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=m*f+_,t[5]=a*u,t[9]=p*f-x,t[2]=x*f-p,t[6]=o*u,t[10]=_*f+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(e0,e,t0)}lookAt(e,t,i){const s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Li.crossVectors(i,En),Li.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Li.crossVectors(i,En)),Li.normalize(),ca.crossVectors(En,Li),s[0]=Li.x,s[4]=ca.x,s[8]=En.x,s[1]=Li.y,s[5]=ca.y,s[9]=En.y,s[2]=Li.z,s[6]=ca.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],m=i[9],p=i[13],x=i[2],_=i[6],g=i[10],d=i[14],v=i[3],M=i[7],y=i[11],E=i[15],T=s[0],R=s[4],C=s[8],w=s[12],S=s[1],L=s[5],F=s[9],W=s[13],te=s[2],ee=s[6],X=s[10],Z=s[14],ne=s[3],de=s[7],pe=s[11],Ve=s[15];return r[0]=a*T+o*S+l*te+c*ne,r[4]=a*R+o*L+l*ee+c*de,r[8]=a*C+o*F+l*X+c*pe,r[12]=a*w+o*W+l*Z+c*Ve,r[1]=u*T+f*S+m*te+p*ne,r[5]=u*R+f*L+m*ee+p*de,r[9]=u*C+f*F+m*X+p*pe,r[13]=u*w+f*W+m*Z+p*Ve,r[2]=x*T+_*S+g*te+d*ne,r[6]=x*R+_*L+g*ee+d*de,r[10]=x*C+_*F+g*X+d*pe,r[14]=x*w+_*W+g*Z+d*Ve,r[3]=v*T+M*S+y*te+E*ne,r[7]=v*R+M*L+y*ee+E*de,r[11]=v*C+M*F+y*X+E*pe,r[15]=v*w+M*W+y*Z+E*Ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],m=e[10],p=e[14],x=e[3],_=e[7],g=e[11],d=e[15];return x*(+r*l*f-s*c*f-r*o*m+i*c*m+s*o*p-i*l*p)+_*(+t*l*p-t*c*m+r*a*m-s*a*p+s*c*u-r*l*u)+g*(+t*c*f-t*o*p-r*a*f+i*a*p+r*o*u-i*c*u)+d*(-s*o*u-t*l*f+t*o*m+s*a*f-i*a*m+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],m=e[10],p=e[11],x=e[12],_=e[13],g=e[14],d=e[15],v=f*g*c-_*m*c+_*l*p-o*g*p-f*l*d+o*m*d,M=x*m*c-u*g*c-x*l*p+a*g*p+u*l*d-a*m*d,y=u*_*c-x*f*c+x*o*p-a*_*p-u*o*d+a*f*d,E=x*f*l-u*_*l-x*o*m+a*_*m+u*o*g-a*f*g,T=t*v+i*M+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=v*R,e[1]=(_*m*r-f*g*r-_*s*p+i*g*p+f*s*d-i*m*d)*R,e[2]=(o*g*r-_*l*r+_*s*c-i*g*c-o*s*d+i*l*d)*R,e[3]=(f*l*r-o*m*r-f*s*c+i*m*c+o*s*p-i*l*p)*R,e[4]=M*R,e[5]=(u*g*r-x*m*r+x*s*p-t*g*p-u*s*d+t*m*d)*R,e[6]=(x*l*r-a*g*r-x*s*c+t*g*c+a*s*d-t*l*d)*R,e[7]=(a*m*r-u*l*r+u*s*c-t*m*c-a*s*p+t*l*p)*R,e[8]=y*R,e[9]=(x*f*r-u*_*r-x*i*p+t*_*p+u*i*d-t*f*d)*R,e[10]=(a*_*r-x*o*r+x*i*c-t*_*c-a*i*d+t*o*d)*R,e[11]=(u*o*r-a*f*r-u*i*c+t*f*c+a*i*p-t*o*p)*R,e[12]=E*R,e[13]=(u*_*s-x*f*s+x*i*m-t*_*m-u*i*g+t*f*g)*R,e[14]=(x*o*s-a*_*s-x*i*l+t*_*l+a*i*g-t*o*g)*R,e[15]=(a*f*s-u*o*s+u*i*l-t*f*l-a*i*m+t*o*m)*R,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,m=r*c,p=r*u,x=r*f,_=a*u,g=a*f,d=o*f,v=l*c,M=l*u,y=l*f,E=i.x,T=i.y,R=i.z;return s[0]=(1-(_+d))*E,s[1]=(p+y)*E,s[2]=(x-M)*E,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(m+d))*T,s[6]=(g+v)*T,s[7]=0,s[8]=(x+M)*R,s[9]=(g-v)*R,s[10]=(1-(m+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Ss.set(s[0],s[1],s[2]).length();const a=Ss.set(s[4],s[5],s[6]).length(),o=Ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Xn.copy(this);const c=1/r,u=1/a,f=1/o;return Xn.elements[0]*=c,Xn.elements[1]*=c,Xn.elements[2]*=c,Xn.elements[4]*=u,Xn.elements[5]*=u,Xn.elements[6]*=u,Xn.elements[8]*=f,Xn.elements[9]*=f,Xn.elements[10]*=f,t.setFromRotationMatrix(Xn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=oi,l=!1){const c=this.elements,u=2*r/(t-e),f=2*r/(i-s),m=(t+e)/(t-e),p=(i+s)/(i-s);let x,_;if(l)x=r/(a-r),_=a*r/(a-r);else if(o===oi)x=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Ya)x=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=f,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=oi,l=!1){const c=this.elements,u=2/(t-e),f=2/(i-s),m=-(t+e)/(t-e),p=-(i+s)/(i-s);let x,_;if(l)x=1/(a-r),_=a/(a-r);else if(o===oi)x=-2/(a-r),_=-(a+r)/(a-r);else if(o===Ya)x=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=f,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ss=new P,Xn=new Tt,e0=new P(0,0,0),t0=new P(1,1,1),Li=new P,ca=new P,En=new P,nh=new Tt,ih=new Ei;class ei{constructor(e=0,t=0,i=0,s=ei.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(_t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(_t(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-_t(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(_t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-_t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:ht("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return nh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ih.setFromEuler(this),this.setFromQuaternion(ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ei.DEFAULT_ORDER="XYZ";class wc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let n0=0;const sh=new P,bs=new Ei,gi=new Tt,ha=new P,hr=new P,i0=new P,s0=new Ei,rh=new P(1,0,0),ah=new P(0,1,0),oh=new P(0,0,1),lh={type:"added"},r0={type:"removed"},ws={type:"childadded",child:null},Ao={type:"childremoved",child:null};class Ht extends er{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:n0++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new P,t=new ei,i=new Ei,s=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new gt}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return bs.setFromAxisAngle(e,t),this.quaternion.multiply(bs),this}rotateOnWorldAxis(e,t){return bs.setFromAxisAngle(e,t),this.quaternion.premultiply(bs),this}rotateX(e){return this.rotateOnAxis(rh,e)}rotateY(e){return this.rotateOnAxis(ah,e)}rotateZ(e){return this.rotateOnAxis(oh,e)}translateOnAxis(e,t){return sh.copy(e).applyQuaternion(this.quaternion),this.position.add(sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rh,e)}translateY(e){return this.translateOnAxis(ah,e)}translateZ(e){return this.translateOnAxis(oh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ha.copy(e):ha.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(hr,ha,this.up):gi.lookAt(ha,hr,this.up),this.quaternion.setFromRotationMatrix(gi),s&&(gi.extractRotation(s.matrixWorld),bs.setFromRotationMatrix(gi),this.quaternion.premultiply(bs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Kt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lh),ws.child=e,this.dispatchEvent(ws),ws.child=null):Kt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(r0),Ao.child=e,this.dispatchEvent(Ao),Ao.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(gi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lh),ws.child=e,this.dispatchEvent(ws),ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,e,i0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,s0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),m=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ht.DEFAULT_UP=new P(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new P,vi=new P,Co=new P,_i=new P,Ts=new P,Es=new P,ch=new P,Ro=new P,Po=new P,Lo=new P,Do=new kt,Io=new kt,Uo=new kt;class kn{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),qn.subVectors(e,t),s.cross(qn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){qn.subVectors(s,t),vi.subVectors(i,t),Co.subVectors(e,t);const a=qn.dot(qn),o=qn.dot(vi),l=qn.dot(Co),c=vi.dot(vi),u=vi.dot(Co),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const m=1/f,p=(c*l-o*u)*m,x=(a*u-o*l)*m;return r.set(1-p-x,x,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,_i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,_i.x),l.addScaledVector(a,_i.y),l.addScaledVector(o,_i.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Do.setScalar(0),Io.setScalar(0),Uo.setScalar(0),Do.fromBufferAttribute(e,t),Io.fromBufferAttribute(e,i),Uo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Do,r.x),a.addScaledVector(Io,r.y),a.addScaledVector(Uo,r.z),a}static isFrontFacing(e,t,i,s){return qn.subVectors(i,t),vi.subVectors(e,t),qn.cross(vi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qn.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),qn.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return kn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return kn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Ts.subVectors(s,i),Es.subVectors(r,i),Ro.subVectors(e,i);const l=Ts.dot(Ro),c=Es.dot(Ro);if(l<=0&&c<=0)return t.copy(i);Po.subVectors(e,s);const u=Ts.dot(Po),f=Es.dot(Po);if(u>=0&&f<=u)return t.copy(s);const m=l*f-u*c;if(m<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(Ts,a);Lo.subVectors(e,r);const p=Ts.dot(Lo),x=Es.dot(Lo);if(x>=0&&p<=x)return t.copy(r);const _=p*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(i).addScaledVector(Es,o);const g=u*x-p*f;if(g<=0&&f-u>=0&&p-x>=0)return ch.subVectors(r,s),o=(f-u)/(f-u+(p-x)),t.copy(s).addScaledVector(ch,o);const d=1/(g+_+m);return a=_*d,o=m*d,t.copy(i).addScaledVector(Ts,a).addScaledVector(Es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Vd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},da={h:0,s:0,l:0};function Fo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class nt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ct.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ct.workingColorSpace){if(e=yc(e,1),t=_t(t,0,1),i=_t(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Fo(a,r,e+1/3),this.g=Fo(a,r,e),this.b=Fo(a,r,e-1/3)}return Ct.colorSpaceToWorking(this,s),this}setStyle(e,t=wt){function i(r){r!==void 0&&parseFloat(r)<1&&ht("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ht("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ht("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wt){const i=Vd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ht("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=Bs(e.r),this.g=Bs(e.g),this.b=Bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wt){return Ct.workingToColorSpace(mn.copy(this),e),Math.round(_t(mn.r*255,0,255))*65536+Math.round(_t(mn.g*255,0,255))*256+Math.round(_t(mn.b*255,0,255))}getHexString(e=wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.workingToColorSpace(mn.copy(this),t);const i=mn.r,s=mn.g,r=mn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ct.workingColorSpace){return Ct.workingToColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=wt){Ct.workingToColorSpace(mn.copy(this),e);const t=mn.r,i=mn.g,s=mn.b;return e!==wt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Di),this.setHSL(Di.h+e,Di.s+t,Di.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Di),e.getHSL(da);const i=Tr(Di.h,da.h,t),s=Tr(Di.s,da.s,t),r=Tr(Di.l,da.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const mn=new nt;nt.NAMES=Vd;let a0=0;class Hi extends er{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=Os,this.side=Gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=Ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gs,this.stencilZFail=gs,this.stencilZPass=gs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){ht(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ht(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Os&&(i.blending=this.blending),this.side!==Gi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ll&&(i.blendSrc=this.blendSrc),this.blendDst!==cl&&(i.blendDst=this.blendDst),this.blendEquation!==ts&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ws&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==gs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==gs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class bt extends Hi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=hc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const en=new P,ua=new Te;let o0=0;class Dn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:o0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=$l,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ua.fromBufferAttribute(this,t),ua.applyMatrix3(e),this.setXY(t,ua.x,ua.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyMatrix3(e),this.setXYZ(t,en.x,en.y,en.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyMatrix4(e),this.setXYZ(t,en.x,en.y,en.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyNormalMatrix(e),this.setXYZ(t,en.x,en.y,en.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.transformDirection(e),this.setXYZ(t,en.x,en.y,en.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Zn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ot(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),s=Ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==$l&&(e.usage=this.usage),e}}class Gd extends Dn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Hd extends Dn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Mt extends Dn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let l0=0;const Nn=new Tt,No=new Ht,As=new P,An=new ps,dr=new ps,ln=new P;class Wt extends er{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bd(e)?Hd:Gd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new gt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,i){return Nn.makeTranslation(e,t,i),this.applyMatrix4(Nn),this}scale(e,t,i){return Nn.makeScale(e,t,i),this.applyMatrix4(Nn),this}lookAt(e){return No.lookAt(e),No.updateMatrix(),this.applyMatrix4(No.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(As).negate(),this.translate(As.x,As.y,As.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Mt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ht("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];An.setFromBufferAttribute(r),this.morphTargetsRelative?(ln.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(ln),ln.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(ln)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Kt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];dr.setFromBufferAttribute(o),this.morphTargetsRelative?(ln.addVectors(An.min,dr.min),An.expandByPoint(ln),ln.addVectors(An.max,dr.max),An.expandByPoint(ln)):(An.expandByPoint(dr.min),An.expandByPoint(dr.max))}An.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)ln.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(ln));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ln.fromBufferAttribute(o,c),l&&(As.fromBufferAttribute(e,c),ln.add(As)),s=Math.max(s,i.distanceToSquared(ln))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Kt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Kt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new P,l[C]=new P;const c=new P,u=new P,f=new P,m=new Te,p=new Te,x=new Te,_=new P,g=new P;function d(C,w,S){c.fromBufferAttribute(i,C),u.fromBufferAttribute(i,w),f.fromBufferAttribute(i,S),m.fromBufferAttribute(r,C),p.fromBufferAttribute(r,w),x.fromBufferAttribute(r,S),u.sub(c),f.sub(c),p.sub(m),x.sub(m);const L=1/(p.x*x.y-x.x*p.y);isFinite(L)&&(_.copy(u).multiplyScalar(x.y).addScaledVector(f,-p.y).multiplyScalar(L),g.copy(f).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(L),o[C].add(_),o[w].add(_),o[S].add(_),l[C].add(g),l[w].add(g),l[S].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let C=0,w=v.length;C<w;++C){const S=v[C],L=S.start,F=S.count;for(let W=L,te=L+F;W<te;W+=3)d(e.getX(W+0),e.getX(W+1),e.getX(W+2))}const M=new P,y=new P,E=new P,T=new P;function R(C){E.fromBufferAttribute(s,C),T.copy(E);const w=o[C];M.copy(w),M.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(T,w);const L=y.dot(l[C])<0?-1:1;a.setXYZW(C,M.x,M.y,M.z,L)}for(let C=0,w=v.length;C<w;++C){const S=v[C],L=S.start,F=S.count;for(let W=L,te=L+F;W<te;W+=3)R(e.getX(W+0)),R(e.getX(W+1)),R(e.getX(W+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let m=0,p=e.count;m<p;m+=3){const x=e.getX(m+0),_=e.getX(m+1),g=e.getX(m+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),a.fromBufferAttribute(t,m+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),i.setXYZ(m+0,u.x,u.y,u.z),i.setXYZ(m+1,u.x,u.y,u.z),i.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ln.fromBufferAttribute(e,t),ln.normalize(),e.setXYZ(t,ln.x,ln.y,ln.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,m=new c.constructor(l.length*u);let p=0,x=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*u;for(let d=0;d<u;d++)m[x++]=c[p++]}return new Dn(m,u,f)}if(this.index===null)return ht("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const m=c[u],p=e(m,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,m=c.length;f<m;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let m=0,p=f.length;m<p;m++)u.push(f[m].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hh=new Tt,Yi=new bc,fa=new tr,dh=new P,pa=new P,ma=new P,xa=new P,zo=new P,ga=new P,uh=new P,va=new P;class V extends Ht{constructor(e=new Wt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ga.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(zo.fromBufferAttribute(f,e),a?ga.addScaledVector(zo,u):ga.addScaledVector(zo.sub(t),u))}t.add(ga)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fa.copy(i.boundingSphere),fa.applyMatrix4(r),Yi.copy(e.ray).recast(e.near),!(fa.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(fa,dh)===null||Yi.origin.distanceToSquared(dh)>(e.far-e.near)**2))&&(hh.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(hh),!(i.boundingBox!==null&&Yi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Yi)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,m=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=m.length;x<_;x++){const g=m[x],d=a[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let y=v,E=M;y<E;y+=3){const T=o.getX(y),R=o.getX(y+1),C=o.getX(y+2);s=_a(this,d,e,i,c,u,f,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let g=x,d=_;g<d;g+=3){const v=o.getX(g),M=o.getX(g+1),y=o.getX(g+2);s=_a(this,a,e,i,c,u,f,v,M,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,_=m.length;x<_;x++){const g=m[x],d=a[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let y=v,E=M;y<E;y+=3){const T=y,R=y+1,C=y+2;s=_a(this,d,e,i,c,u,f,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let g=x,d=_;g<d;g+=3){const v=g,M=g+1,y=g+2;s=_a(this,a,e,i,c,u,f,v,M,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function c0(n,e,t,i,s,r,a,o){let l;if(e.side===gn?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Gi,o),l===null)return null;va.copy(o),va.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(va);return c<t.near||c>t.far?null:{distance:c,point:va.clone(),object:n}}function _a(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,pa),n.getVertexPosition(l,ma),n.getVertexPosition(c,xa);const u=c0(n,e,t,i,pa,ma,xa,uh);if(u){const f=new P;kn.getBarycoord(uh,pa,ma,xa,f),s&&(u.uv=kn.getInterpolatedAttribute(s,o,l,c,f,new Te)),r&&(u.uv1=kn.getInterpolatedAttribute(r,o,l,c,f,new Te)),a&&(u.normal=kn.getInterpolatedAttribute(a,o,l,c,f,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const m={a:o,b:l,c,normal:new P,materialIndex:0};kn.getNormal(pa,ma,xa,m.normal),u.face=m,u.barycoord=f}return u}class De extends Wt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let m=0,p=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Mt(c,3)),this.setAttribute("normal",new Mt(u,3)),this.setAttribute("uv",new Mt(f,2));function x(_,g,d,v,M,y,E,T,R,C,w){const S=y/R,L=E/C,F=y/2,W=E/2,te=T/2,ee=R+1,X=C+1;let Z=0,ne=0;const de=new P;for(let pe=0;pe<X;pe++){const Ve=pe*L-W;for(let I=0;I<ee;I++){const Se=I*S-F;de[_]=Se*v,de[g]=Ve*M,de[d]=te,c.push(de.x,de.y,de.z),de[_]=0,de[g]=0,de[d]=T>0?1:-1,u.push(de.x,de.y,de.z),f.push(I/R),f.push(1-pe/C),Z+=1}}for(let pe=0;pe<C;pe++)for(let Ve=0;Ve<R;Ve++){const I=m+Ve+ee*pe,Se=m+Ve+ee*(pe+1),ge=m+(Ve+1)+ee*(pe+1),be=m+(Ve+1)+ee*pe;l.push(I,Se,be),l.push(Se,ge,be),ne+=6}o.addGroup(p,ne,w),p+=ne,m+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new De(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $s(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(ht("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function bn(n){const e={};for(let t=0;t<n.length;t++){const i=$s(n[t]);for(const s in i)e[s]=i[s]}return e}function h0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Wd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const Vr={clone:$s,merge:bn};var d0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,u0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dn extends Hi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=d0,this.fragmentShader=u0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$s(e.uniforms),this.uniformsGroups=h0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Xd extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=oi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ii=new P,fh=new Te,ph=new Te;class Rn extends Xd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=kr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return kr*2*Math.atan(Math.tan(wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z),Ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z)}getViewSize(e,t){return this.getViewBounds(e,fh,ph),t.subVectors(ph,fh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(wr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Cs=-90,Rs=1;class f0 extends Ht{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Rn(Cs,Rs,e,t);s.layers=this.layers,this.add(s);const r=new Rn(Cs,Rs,e,t);r.layers=this.layers,this.add(r);const a=new Rn(Cs,Rs,e,t);a.layers=this.layers,this.add(a);const o=new Rn(Cs,Rs,e,t);o.layers=this.layers,this.add(o);const l=new Rn(Cs,Rs,e,t);l.layers=this.layers,this.add(l);const c=new Rn(Cs,Rs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===oi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ya)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(f,m,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class qd extends vn{constructor(e=[],t=Xs,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class p0 extends Qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new qd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new De(5,5,5),r=new dn({name:"CubemapFromEquirect",uniforms:$s(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:gn,blending:li});r.uniforms.tEquirect.value=t;const a=new V(s,r),o=t.minFilter;return t.minFilter===is&&(t.minFilter=Vn),new f0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class st extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const m0={type:"move"};class Oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new st,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new st,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new st,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),d=this._getHandJoint(c,_);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],m=u.position.distanceTo(f.position),p=.02,x=.005;c.inputState.pinching&&m>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(m0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new st;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Tc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new nt(e),this.near=t,this.far=i}clone(){return new Tc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Yd extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class x0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=$l,this.updateRanges=[],this.version=0,this.uuid=hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Sn=new P;class Ka{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyMatrix4(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyNormalMatrix(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.transformDirection(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Zn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ot(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),s=Ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Za("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Dn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ka(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Za("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $d extends Hi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new nt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ps;const ur=new P,Ls=new P,Ds=new P,Is=new Te,fr=new Te,Zd=new Tt,Ma=new P,pr=new P,ya=new P,mh=new Te,Bo=new Te,xh=new Te;class gh extends Ht{constructor(e=new $d){if(super(),this.isSprite=!0,this.type="Sprite",Ps===void 0){Ps=new Wt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new x0(t,5);Ps.setIndex([0,1,2,0,2,3]),Ps.setAttribute("position",new Ka(i,3,0,!1)),Ps.setAttribute("uv",new Ka(i,2,3,!1))}this.geometry=Ps,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Kt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ls.setFromMatrixScale(this.matrixWorld),Zd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ds.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ls.multiplyScalar(-Ds.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Sa(Ma.set(-.5,-.5,0),Ds,a,Ls,s,r),Sa(pr.set(.5,-.5,0),Ds,a,Ls,s,r),Sa(ya.set(.5,.5,0),Ds,a,Ls,s,r),mh.set(0,0),Bo.set(1,0),xh.set(1,1);let o=e.ray.intersectTriangle(Ma,pr,ya,!1,ur);if(o===null&&(Sa(pr.set(-.5,.5,0),Ds,a,Ls,s,r),Bo.set(0,1),o=e.ray.intersectTriangle(Ma,ya,pr,!1,ur),o===null))return;const l=e.ray.origin.distanceTo(ur);l<e.near||l>e.far||t.push({distance:l,point:ur.clone(),uv:kn.getInterpolation(ur,Ma,pr,ya,mh,Bo,xh,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Sa(n,e,t,i,s,r){Is.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(fr.x=r*Is.x-s*Is.y,fr.y=s*Is.x+r*Is.y):fr.copy(Is),n.copy(e),n.x+=fr.x,n.y+=fr.y,n.applyMatrix4(Zd)}class Kd extends vn{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Ln,u=Ln,f,m){super(null,a,o,l,c,u,s,r,f,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vh extends Dn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Us=new Tt,_h=new Tt,ba=[],Mh=new ps,g0=new Tt,mr=new V,xr=new tr;class sn extends V{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new vh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,g0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ps),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Us),Mh.copy(e.boundingBox).applyMatrix4(Us),this.boundingBox.union(Mh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new tr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Us),xr.copy(e.boundingSphere).applyMatrix4(Us),this.boundingSphere.union(xr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(mr.geometry=this.geometry,mr.material=this.material,mr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xr.copy(this.boundingSphere),xr.applyMatrix4(i),e.ray.intersectsSphere(xr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Us),_h.multiplyMatrices(i,Us),mr.matrixWorld=_h,mr.raycast(e,ba);for(let a=0,o=ba.length;a<o;a++){const l=ba[a];l.instanceId=r,l.object=this,t.push(l)}ba.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new vh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Kd(new Float32Array(s*this.count),s,this.count,mc,ai));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ko=new P,v0=new P,_0=new gt;class ji{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ko.subVectors(i,t).cross(v0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(ko),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||_0.getNormalMatrix(e),s=this.coplanarPoint(ko).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $i=new tr,M0=new Te(.5,.5),wa=new P;class Ec{constructor(e=new ji,t=new ji,i=new ji,s=new ji,r=new ji,a=new ji){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=oi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],m=r[6],p=r[7],x=r[8],_=r[9],g=r[10],d=r[11],v=r[12],M=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,p-u,d-x,E-v).normalize(),s[1].setComponents(c+a,p+u,d+x,E+v).normalize(),s[2].setComponents(c+o,p+f,d+_,E+M).normalize(),s[3].setComponents(c-o,p-f,d-_,E-M).normalize(),i)s[4].setComponents(l,m,g,y).normalize(),s[5].setComponents(c-l,p-m,d-g,E-y).normalize();else if(s[4].setComponents(c-l,p-m,d-g,E-y).normalize(),t===oi)s[5].setComponents(c+l,p+m,d+g,E+y).normalize();else if(t===Ya)s[5].setComponents(l,m,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($i)}intersectsSprite(e){$i.center.set(0,0,0);const t=M0.distanceTo(e.center);return $i.radius=.7071067811865476+t,$i.applyMatrix4(e.matrixWorld),this.intersectsSphere($i)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(wa.x=s.normal.x>0?e.max.x:e.min.x,wa.y=s.normal.y>0?e.max.y:e.min.y,wa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(wa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Zl extends Hi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ja=new P,ja=new P,yh=new Tt,gr=new bc,Ta=new tr,Vo=new P,Sh=new P;class bh extends Ht{constructor(e=new Wt,t=new Zl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Ja.fromBufferAttribute(t,s-1),ja.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ja.distanceTo(ja);e.setAttribute("lineDistance",new Mt(i,1))}else ht("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ta.copy(i.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,e.ray.intersectsSphere(Ta)===!1)return;yh.copy(s).invert(),gr.copy(e.ray).applyMatrix4(yh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,m=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let _=p,g=x-1;_<g;_+=c){const d=u.getX(_),v=u.getX(_+1),M=Ea(this,e,gr,l,d,v,_);M&&t.push(M)}if(this.isLineLoop){const _=u.getX(x-1),g=u.getX(p),d=Ea(this,e,gr,l,_,g,x-1);d&&t.push(d)}}else{const p=Math.max(0,a.start),x=Math.min(m.count,a.start+a.count);for(let _=p,g=x-1;_<g;_+=c){const d=Ea(this,e,gr,l,_,_+1,_);d&&t.push(d)}if(this.isLineLoop){const _=Ea(this,e,gr,l,x-1,p,x-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ea(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Ja.fromBufferAttribute(o,s),ja.fromBufferAttribute(o,r),t.distanceSqToSegment(Ja,ja,Vo,Sh)>i)return;Vo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Vo);if(!(c<e.near||c>e.far))return{distance:c,point:Sh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}class Qt extends vn{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jd extends vn{constructor(e,t,i=ds,s,r,a,o=Ln,l=Ln,c,u=zr,f=1){if(u!==zr&&u!==Or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:f};super(m,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Sc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class jd extends vn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class un extends Wt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new P,u=new Te;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,m=3;f<=t;f++,m+=3){const p=i+f/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[m]/e+1)/2,u.y=(a[m+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Mt(a,3)),this.setAttribute("normal",new Mt(o,3)),this.setAttribute("uv",new Mt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new un(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ot extends Wt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],m=[],p=[];let x=0;const _=[],g=i/2;let d=0;v(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new Mt(f,3)),this.setAttribute("normal",new Mt(m,3)),this.setAttribute("uv",new Mt(p,2));function v(){const y=new P,E=new P;let T=0;const R=(t-e)/i;for(let C=0;C<=r;C++){const w=[],S=C/r,L=S*(t-e)+e;for(let F=0;F<=s;F++){const W=F/s,te=W*l+o,ee=Math.sin(te),X=Math.cos(te);E.x=L*ee,E.y=-S*i+g,E.z=L*X,f.push(E.x,E.y,E.z),y.set(ee,R,X).normalize(),m.push(y.x,y.y,y.z),p.push(W,1-S),w.push(x++)}_.push(w)}for(let C=0;C<s;C++)for(let w=0;w<r;w++){const S=_[w][C],L=_[w+1][C],F=_[w+1][C+1],W=_[w][C+1];(e>0||w!==0)&&(u.push(S,L,W),T+=3),(t>0||w!==r-1)&&(u.push(L,F,W),T+=3)}c.addGroup(d,T,0),d+=T}function M(y){const E=x,T=new Te,R=new P;let C=0;const w=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,g*S,0),m.push(0,S,0),p.push(.5,.5),x++;const L=x;for(let F=0;F<=s;F++){const te=F/s*l+o,ee=Math.cos(te),X=Math.sin(te);R.x=w*X,R.y=g*S,R.z=w*ee,f.push(R.x,R.y,R.z),m.push(0,S,0),T.x=ee*.5+.5,T.y=X*.5*S+.5,p.push(T.x,T.y),x++}for(let F=0;F<s;F++){const W=E+F,te=L+F;y===!0?u.push(te,te+1,W):u.push(te+1,te,W),C+=3}c.addGroup(d,C,y===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ot(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ls extends ot{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ls(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ro extends Wt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),u(),this.setAttribute("position",new Mt(r,3)),this.setAttribute("normal",new Mt(r.slice(),3)),this.setAttribute("uv",new Mt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)p(t[T+0],M),p(t[T+1],y),p(t[T+2],E),l(M,y,E,v)}function l(v,M,y,E){const T=E+1,R=[];for(let C=0;C<=T;C++){R[C]=[];const w=v.clone().lerp(y,C/T),S=M.clone().lerp(y,C/T),L=T-C;for(let F=0;F<=L;F++)F===0&&C===T?R[C][F]=w:R[C][F]=w.clone().lerp(S,F/L)}for(let C=0;C<T;C++)for(let w=0;w<2*(T-C)-1;w++){const S=Math.floor(w/2);w%2===0?(m(R[C][S+1]),m(R[C+1][S]),m(R[C][S])):(m(R[C][S+1]),m(R[C+1][S+1]),m(R[C+1][S]))}}function c(v){const M=new P;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(v),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function u(){const v=new P;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const y=g(v)/2/Math.PI+.5,E=d(v)/Math.PI+.5;a.push(y,1-E)}x(),f()}function f(){for(let v=0;v<a.length;v+=6){const M=a[v+0],y=a[v+2],E=a[v+4],T=Math.max(M,y,E),R=Math.min(M,y,E);T>.9&&R<.1&&(M<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),E<.2&&(a[v+4]+=1))}}function m(v){r.push(v.x,v.y,v.z)}function p(v,M){const y=v*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function x(){const v=new P,M=new P,y=new P,E=new P,T=new Te,R=new Te,C=new Te;for(let w=0,S=0;w<r.length;w+=9,S+=6){v.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),T.set(a[S+0],a[S+1]),R.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),E.copy(v).add(M).add(y).divideScalar(3);const L=g(E);_(T,S+0,v,L),_(R,S+2,M,L),_(C,S+4,y,L)}}function _(v,M,y,E){E<0&&v.x===1&&(a[M]=v.x-1),y.x===0&&y.z===0&&(a[M]=E/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ro(e.vertices,e.indices,e.radius,e.details)}}class Ac extends ro{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ac(e.radius,e.detail)}}class fi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ht("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const u=i[s],m=i[s+1]-u,p=(a-u)/m;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Te:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],r=[],a=[],o=new P,l=new Tt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),f=Math.abs(s[0].y),m=Math.abs(s[0].z);u<=c&&(c=u,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),m<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(_t(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,x))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(_t(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let x=1;x<=e;x++)r[x].applyMatrix4(l.makeRotationAxis(s[x],p*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Cc extends fi{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Te){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=l-this.aX,p=c-this.aY;l=m*u-p*f+this.aX,c=m*f+p*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class y0 extends Cc{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Rc(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let m=(a-r)/c-(o-r)/(c+u)+(o-a)/u,p=(o-a)/u-(l-a)/(u+f)+(l-o)/f;m*=u,p*=u,s(a,o,m,p)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const Aa=new P,Go=new Rc,Ho=new Rc,Wo=new Rc;class S0 extends fi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(Aa.subVectors(s[0],s[1]).add(s[0]),c=Aa);const f=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Aa.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Aa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(c.distanceToSquared(f),p),_=Math.pow(f.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(u),p);_<1e-4&&(_=1),x<1e-4&&(x=_),g<1e-4&&(g=_),Go.initNonuniformCatmullRom(c.x,f.x,m.x,u.x,x,_,g),Ho.initNonuniformCatmullRom(c.y,f.y,m.y,u.y,x,_,g),Wo.initNonuniformCatmullRom(c.z,f.z,m.z,u.z,x,_,g)}else this.curveType==="catmullrom"&&(Go.initCatmullRom(c.x,f.x,m.x,u.x,this.tension),Ho.initCatmullRom(c.y,f.y,m.y,u.y,this.tension),Wo.initCatmullRom(c.z,f.z,m.z,u.z,this.tension));return i.set(Go.calc(l),Ho.calc(l),Wo.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function wh(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function b0(n,e){const t=1-n;return t*t*e}function w0(n,e){return 2*(1-n)*n*e}function T0(n,e){return n*n*e}function Er(n,e,t,i){return b0(n,e)+w0(n,t)+T0(n,i)}function E0(n,e){const t=1-n;return t*t*t*e}function A0(n,e){const t=1-n;return 3*t*t*n*e}function C0(n,e){return 3*(1-n)*n*n*e}function R0(n,e){return n*n*n*e}function Ar(n,e,t,i,s){return E0(n,e)+A0(n,t)+C0(n,i)+R0(n,s)}class Qd extends fi{constructor(e=new Te,t=new Te,i=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Te){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Ar(e,s.x,r.x,a.x,o.x),Ar(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class P0 extends fi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Ar(e,s.x,r.x,a.x,o.x),Ar(e,s.y,r.y,a.y,o.y),Ar(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class eu extends fi{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class L0 extends fi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class tu extends fi{constructor(e=new Te,t=new Te,i=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Te){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Er(e,s.x,r.x,a.x),Er(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class D0 extends fi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Er(e,s.x,r.x,a.x),Er(e,s.y,r.y,a.y),Er(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class nu extends fi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return i.set(wh(o,l.x,c.x,u.x,f.x),wh(o,l.y,c.y,u.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Te().fromArray(s))}return this}}var Th=Object.freeze({__proto__:null,ArcCurve:y0,CatmullRomCurve3:S0,CubicBezierCurve:Qd,CubicBezierCurve3:P0,EllipseCurve:Cc,LineCurve:eu,LineCurve3:L0,QuadraticBezierCurve:tu,QuadraticBezierCurve3:D0,SplineCurve:nu});class I0 extends fi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Th[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Th[s.type]().fromJSON(s))}return this}}class Eh extends I0{constructor(e){super(),this.type="Path",this.currentPoint=new Te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new eu(this.currentPoint.clone(),new Te(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new tu(this.currentPoint.clone(),new Te(e,t),new Te(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Qd(this.currentPoint.clone(),new Te(e,t),new Te(i,s),new Te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new nu(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new Cc(e,t,i,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Pc extends Eh{constructor(e){super(e),this.uuid=hi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Eh().fromJSON(s))}return this}}function U0(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=iu(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=B0(n,e,r,t)),n.length>80*t){o=n[0],l=n[1];let u=o,f=l;for(let m=t;m<s;m+=t){const p=n[m],x=n[m+1];p<o&&(o=p),x<l&&(l=x),p>u&&(u=p),x>f&&(f=x)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return Gr(r,a,t,o,l,c,0),a}function iu(n,e,t,i,s){let r;if(s===K0(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=Ah(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=Ah(a/i|0,n[a],n[a+1],r);return r&&Zs(r,r.next)&&(Wr(r),r=r.next),r}function us(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Zs(t,t.next)||Jt(t.prev,t,t.next)===0)){if(Wr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Gr(n,e,t,i,s,r,a){if(!n)return;!a&&r&&W0(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?N0(n,i,s,r):F0(n)){e.push(l.i,n.i,c.i),Wr(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=z0(us(n),e),Gr(n,e,t,i,s,r,2)):a===2&&O0(n,e,t,i,s,r):Gr(us(n),e,t,i,s,r,1);break}}}function F0(n){const e=n.prev,t=n,i=n.next;if(Jt(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,u=Math.min(s,r,a),f=Math.min(o,l,c),m=Math.max(s,r,a),p=Math.max(o,l,c);let x=i.next;for(;x!==e;){if(x.x>=u&&x.x<=m&&x.y>=f&&x.y<=p&&yr(s,o,r,l,a,c,x.x,x.y)&&Jt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function N0(n,e,t,i){const s=n.prev,r=n,a=n.next;if(Jt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,f=r.y,m=a.y,p=Math.min(o,l,c),x=Math.min(u,f,m),_=Math.max(o,l,c),g=Math.max(u,f,m),d=Kl(p,x,e,t,i),v=Kl(_,g,e,t,i);let M=n.prevZ,y=n.nextZ;for(;M&&M.z>=d&&y&&y.z<=v;){if(M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==a&&yr(o,u,l,f,c,m,M.x,M.y)&&Jt(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=p&&y.x<=_&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&yr(o,u,l,f,c,m,y.x,y.y)&&Jt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=d;){if(M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==a&&yr(o,u,l,f,c,m,M.x,M.y)&&Jt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=v;){if(y.x>=p&&y.x<=_&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&yr(o,u,l,f,c,m,y.x,y.y)&&Jt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function z0(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Zs(i,s)&&ru(i,t,t.next,s)&&Hr(i,s)&&Hr(s,i)&&(e.push(i.i,t.i,s.i),Wr(t),Wr(t.next),t=n=s),t=t.next}while(t!==n);return us(t)}function O0(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Y0(a,o)){let l=au(a,o);a=us(a,a.next),l=us(l,l.next),Gr(a,e,t,i,s,r,0),Gr(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function B0(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=iu(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(q0(c))}s.sort(k0);for(let r=0;r<s.length;r++)t=V0(s[r],t);return t}function k0(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function V0(n,e){const t=G0(n,e);if(!t)return e;const i=au(t,n);return us(i,i.next),us(t,t.next)}function G0(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Zs(n,t))return t;do{if(Zs(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&su(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const f=Math.abs(s-t.y)/(i-t.x);Hr(t,n)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&H0(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function H0(n,e){return Jt(n.prev,n,e.prev)<0&&Jt(e.next,n,n.next)<0}function W0(n,e,t,i){let s=n;do s.z===0&&(s.z=Kl(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,X0(s)}function X0(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function Kl(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function q0(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function su(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function yr(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&su(n,e,t,i,s,r,a,o)}function Y0(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!$0(n,e)&&(Hr(n,e)&&Hr(e,n)&&Z0(n,e)&&(Jt(n.prev,n,e.prev)||Jt(n,e.prev,e))||Zs(n,e)&&Jt(n.prev,n,n.next)>0&&Jt(e.prev,e,e.next)>0)}function Jt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Zs(n,e){return n.x===e.x&&n.y===e.y}function ru(n,e,t,i){const s=Ra(Jt(n,e,t)),r=Ra(Jt(n,e,i)),a=Ra(Jt(t,i,n)),o=Ra(Jt(t,i,e));return!!(s!==r&&a!==o||s===0&&Ca(n,t,e)||r===0&&Ca(n,i,e)||a===0&&Ca(t,n,i)||o===0&&Ca(t,e,i))}function Ca(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ra(n){return n>0?1:n<0?-1:0}function $0(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&ru(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Hr(n,e){return Jt(n.prev,n,n.next)<0?Jt(n,e,n.next)>=0&&Jt(n,n.prev,e)>=0:Jt(n,e,n.prev)<0||Jt(n,n.next,e)<0}function Z0(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function au(n,e){const t=Jl(n.i,n.x,n.y),i=Jl(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function Ah(n,e,t,i){const s=Jl(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Wr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Jl(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function K0(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class J0{static triangulate(e,t,i=2){return U0(e,t,i)}}class Cr{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Cr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Ch(e),Rh(i,e);let a=e.length;t.forEach(Ch);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Rh(i,t[l]);const o=J0.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Ch(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Rh(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Lc extends ro{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Lc(e.radius,e.detail)}}class Gt extends Wt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=e/o,m=t/l,p=[],x=[],_=[],g=[];for(let d=0;d<u;d++){const v=d*m-a;for(let M=0;M<c;M++){const y=M*f-r;x.push(y,-v,0),_.push(0,0,1),g.push(M/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let v=0;v<o;v++){const M=v+c*d,y=v+c*(d+1),E=v+1+c*(d+1),T=v+1+c*d;p.push(M,y,T),p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new Mt(x,3)),this.setAttribute("normal",new Mt(_,3)),this.setAttribute("uv",new Mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gt(e.width,e.height,e.widthSegments,e.heightSegments)}}class ao extends Wt{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],u=[];let f=e;const m=(t-e)/s,p=new P,x=new Te;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){const d=r+g/i*a;p.x=f*Math.cos(d),p.y=f*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,u.push(x.x,x.y)}f+=m}for(let _=0;_<s;_++){const g=_*(i+1);for(let d=0;d<i;d++){const v=d+g,M=v,y=v+i+1,E=v+i+2,T=v+1;o.push(M,y,T),o.push(y,E,T)}}this.setIndex(o),this.setAttribute("position",new Mt(l,3)),this.setAttribute("normal",new Mt(c,3)),this.setAttribute("uv",new Mt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class oo extends Wt{constructor(e=new Pc([new Te(0,.5),new Te(-.5,-.5),new Te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new Mt(s,3)),this.setAttribute("normal",new Mt(r,3)),this.setAttribute("uv",new Mt(a,2));function c(u){const f=s.length/3,m=u.extractPoints(t);let p=m.shape;const x=m.holes;Cr.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,d=x.length;g<d;g++){const v=x[g];Cr.isClockWise(v)===!0&&(x[g]=v.reverse())}const _=Cr.triangulateShape(p,x);for(let g=0,d=x.length;g<d;g++){const v=x[g];p=p.concat(v)}for(let g=0,d=p.length;g<d;g++){const v=p[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,d=_.length;g<d;g++){const v=_[g],M=v[0]+f,y=v[1]+f,E=v[2]+f;i.push(M,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return j0(t,e)}static fromJSON(e,t){const i=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];i.push(a)}return new oo(i,e.curveSegments)}}function j0(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class qt extends Wt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new P,m=new P,p=[],x=[],_=[],g=[];for(let d=0;d<=i;d++){const v=[],M=d/i;let y=0;d===0&&a===0?y=.5/t:d===i&&l===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+M*o),f.y=e*Math.cos(a+M*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+M*o),x.push(f.x,f.y,f.z),m.copy(f).normalize(),_.push(m.x,m.y,m.z),g.push(T+y,1-M),v.push(c++)}u.push(v)}for(let d=0;d<i;d++)for(let v=0;v<t;v++){const M=u[d][v+1],y=u[d][v],E=u[d+1][v],T=u[d+1][v+1];(d!==0||a>0)&&p.push(M,y,T),(d!==i-1||l<Math.PI)&&p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new Mt(x,3)),this.setAttribute("normal",new Mt(_,3)),this.setAttribute("uv",new Mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ks extends Wt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new P,f=new P,m=new P;for(let p=0;p<=i;p++)for(let x=0;x<=s;x++){const _=x/s*r,g=p/i*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(_),f.y=(e+t*Math.cos(g))*Math.sin(_),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),m.subVectors(f,u).normalize(),l.push(m.x,m.y,m.z),c.push(x/s),c.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=s;x++){const _=(s+1)*p+x-1,g=(s+1)*(p-1)+x-1,d=(s+1)*(p-1)+x,v=(s+1)*p+x;a.push(_,g,v),a.push(g,d,v)}this.setIndex(a),this.setAttribute("position",new Mt(o,3)),this.setAttribute("normal",new Mt(l,3)),this.setAttribute("uv",new Mt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ks(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Q0 extends dn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Y extends Hi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ep extends Hi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=hc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class tp extends Hi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class np extends Hi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Dc extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new nt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class ip extends Dc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new nt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Xo=new Tt,Ph=new P,Lh=new P;class ou{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=ui,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ec,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Ph.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ph),Lh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lh),t.updateMatrixWorld(),Xo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Xo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Dh=new Tt,vr=new P,qo=new P;class sp extends ou{constructor(){super(new Rn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new kt(2,1,1,1),new kt(0,1,1,1),new kt(3,1,1,1),new kt(1,1,1,1),new kt(3,0,1,1),new kt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),vr.setFromMatrixPosition(e.matrixWorld),i.position.copy(vr),qo.copy(i.position),qo.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(qo),i.updateMatrixWorld(),s.makeTranslation(-vr.x,-vr.y,-vr.z),Dh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dh,i.coordinateSystem,i.reversedDepth)}}class Ic extends Dc{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new sp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Uc extends Xd{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class rp extends ou{constructor(){super(new Uc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Yo extends Dc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new rp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ap extends Rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class lu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Ih=new Tt;class op{constructor(e,t,i=0,s=1/0){this.ray=new bc(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new wc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Kt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ih.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ih),this}intersectObject(e,t=!0,i=[]){return jl(e,this,i,t),i.sort(Uh),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)jl(e[s],this,i,t);return i.sort(Uh),i}}function Uh(n,e){return n.distance-e.distance}function jl(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)jl(r[a],e,t,!0)}}function Fh(n,e,t,i){const s=lp(i);switch(t){case Nd:return n*e;case mc:return n*e/s.components*s.byteLength;case xc:return n*e/s.components*s.byteLength;case gc:return n*e*2/s.components*s.byteLength;case vc:return n*e*2/s.components*s.byteLength;case zd:return n*e*3/s.components*s.byteLength;case Jn:return n*e*4/s.components*s.byteLength;case _c:return n*e*4/s.components*s.byteLength;case Oa:case Ba:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ka:case Va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yl:case bl:return Math.max(n,16)*Math.max(e,8)/4;case Ml:case Sl:return Math.max(n,8)*Math.max(e,8)/2;case wl:case Tl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case El:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Al:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Il:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case zl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Bl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Vl:case Gl:case Hl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Wl:case Xl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ql:case Yl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function lp(n){switch(n){case ui:case Dd:return{byteLength:1,components:1};case Fr:case Id:case ci:return{byteLength:2,components:1};case fc:case pc:return{byteLength:2,components:4};case ds:case uc:case ai:return{byteLength:4,components:1};case Ud:case Fd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cc}}));typeof window<"u"&&(window.__THREE__?ht("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cc);function cu(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function cp(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,m=n.createBuffer();n.bindBuffer(l,m),n.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,u);else{f.sort((p,x)=>p.start-x.start);let m=0;for(let p=1;p<f.length;p++){const x=f[m],_=f[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++m,f[m]=_)}f.length=m+1;for(let p=0,x=f.length;p<x;p++){const _=f[p];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var hp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dp=`#ifdef USE_ALPHAHASH
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
#endif`,up=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xp=`#ifdef USE_AOMAP
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
#endif`,gp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vp=`#ifdef USE_BATCHING
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
#endif`,_p=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bp=`#ifdef USE_IRIDESCENCE
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
#endif`,wp=`#ifdef USE_BUMPMAP
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ip=`#define PI 3.141592653589793
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
} // validated`,Up=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fp=`vec3 transformedNormal = objectNormal;
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
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Op=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Wp=`#ifdef USE_ENVMAP
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
#endif`,Xp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$p=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jp=`#ifdef USE_GRADIENTMAP
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
}`,jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,em=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tm=`uniform bool receiveShadow;
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
#endif`,nm=`#ifdef USE_ENVMAP
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
#endif`,im=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,om=`PhysicalMaterial material;
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
#endif`,lm=`uniform sampler2D dfgLUT;
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
}`,cm=`
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
#endif`,hm=`#if defined( RE_IndirectDiffuse )
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
#endif`,dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,um=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_m=`#if defined( USE_POINTS_UV )
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
#endif`,Mm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ym=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tm=`#ifdef USE_MORPHTARGETS
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
#endif`,Em=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Am=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dm=`#ifdef USE_NORMALMAP
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
#endif`,Im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Um=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Om=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ym=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$m=`float getShadowMask() {
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
}`,Zm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Km=`#ifdef USE_SKINNING
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
#endif`,Jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jm=`#ifdef USE_SKINNING
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
#endif`,Qm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ex=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ix=`#ifdef USE_TRANSMISSION
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
#endif`,sx=`#ifdef USE_TRANSMISSION
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
#endif`,rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hx=`uniform sampler2D t2D;
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
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ux=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,px=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mx=`#include <common>
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
}`,xx=`#if DEPTH_PACKING == 3200
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
}`,gx=`#define DISTANCE
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
}`,vx=`#define DISTANCE
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
}`,_x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yx=`uniform float scale;
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
}`,Sx=`uniform vec3 diffuse;
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
}`,bx=`#include <common>
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
}`,wx=`uniform vec3 diffuse;
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
}`,Tx=`#define LAMBERT
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
}`,Ex=`#define LAMBERT
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
}`,Ax=`#define MATCAP
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
}`,Cx=`#define MATCAP
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
}`,Rx=`#define NORMAL
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
}`,Px=`#define NORMAL
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
}`,Lx=`#define PHONG
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
}`,Dx=`#define PHONG
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
}`,Ix=`#define STANDARD
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
}`,Ux=`#define STANDARD
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
}`,Fx=`#define TOON
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
}`,Nx=`#define TOON
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
}`,zx=`uniform float size;
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
}`,Ox=`uniform vec3 diffuse;
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
}`,Bx=`#include <common>
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
}`,kx=`uniform vec3 color;
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
}`,Vx=`uniform float rotation;
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
}`,Gx=`uniform vec3 diffuse;
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
}`,vt={alphahash_fragment:hp,alphahash_pars_fragment:dp,alphamap_fragment:up,alphamap_pars_fragment:fp,alphatest_fragment:pp,alphatest_pars_fragment:mp,aomap_fragment:xp,aomap_pars_fragment:gp,batching_pars_vertex:vp,batching_vertex:_p,begin_vertex:Mp,beginnormal_vertex:yp,bsdfs:Sp,iridescence_fragment:bp,bumpmap_pars_fragment:wp,clipping_planes_fragment:Tp,clipping_planes_pars_fragment:Ep,clipping_planes_pars_vertex:Ap,clipping_planes_vertex:Cp,color_fragment:Rp,color_pars_fragment:Pp,color_pars_vertex:Lp,color_vertex:Dp,common:Ip,cube_uv_reflection_fragment:Up,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Np,displacementmap_vertex:zp,emissivemap_fragment:Op,emissivemap_pars_fragment:Bp,colorspace_fragment:kp,colorspace_pars_fragment:Vp,envmap_fragment:Gp,envmap_common_pars_fragment:Hp,envmap_pars_fragment:Wp,envmap_pars_vertex:Xp,envmap_physical_pars_fragment:nm,envmap_vertex:qp,fog_vertex:Yp,fog_pars_vertex:$p,fog_fragment:Zp,fog_pars_fragment:Kp,gradientmap_pars_fragment:Jp,lightmap_pars_fragment:jp,lights_lambert_fragment:Qp,lights_lambert_pars_fragment:em,lights_pars_begin:tm,lights_toon_fragment:im,lights_toon_pars_fragment:sm,lights_phong_fragment:rm,lights_phong_pars_fragment:am,lights_physical_fragment:om,lights_physical_pars_fragment:lm,lights_fragment_begin:cm,lights_fragment_maps:hm,lights_fragment_end:dm,logdepthbuf_fragment:um,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:pm,logdepthbuf_vertex:mm,map_fragment:xm,map_pars_fragment:gm,map_particle_fragment:vm,map_particle_pars_fragment:_m,metalnessmap_fragment:Mm,metalnessmap_pars_fragment:ym,morphinstance_vertex:Sm,morphcolor_vertex:bm,morphnormal_vertex:wm,morphtarget_pars_vertex:Tm,morphtarget_vertex:Em,normal_fragment_begin:Am,normal_fragment_maps:Cm,normal_pars_fragment:Rm,normal_pars_vertex:Pm,normal_vertex:Lm,normalmap_pars_fragment:Dm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Um,clearcoat_pars_fragment:Fm,iridescence_pars_fragment:Nm,opaque_fragment:zm,packing:Om,premultiplied_alpha_fragment:Bm,project_vertex:km,dithering_fragment:Vm,dithering_pars_fragment:Gm,roughnessmap_fragment:Hm,roughnessmap_pars_fragment:Wm,shadowmap_pars_fragment:Xm,shadowmap_pars_vertex:qm,shadowmap_vertex:Ym,shadowmask_pars_fragment:$m,skinbase_vertex:Zm,skinning_pars_vertex:Km,skinning_vertex:Jm,skinnormal_vertex:jm,specularmap_fragment:Qm,specularmap_pars_fragment:ex,tonemapping_fragment:tx,tonemapping_pars_fragment:nx,transmission_fragment:ix,transmission_pars_fragment:sx,uv_pars_fragment:rx,uv_pars_vertex:ax,uv_vertex:ox,worldpos_vertex:lx,background_vert:cx,background_frag:hx,backgroundCube_vert:dx,backgroundCube_frag:ux,cube_vert:fx,cube_frag:px,depth_vert:mx,depth_frag:xx,distanceRGBA_vert:gx,distanceRGBA_frag:vx,equirect_vert:_x,equirect_frag:Mx,linedashed_vert:yx,linedashed_frag:Sx,meshbasic_vert:bx,meshbasic_frag:wx,meshlambert_vert:Tx,meshlambert_frag:Ex,meshmatcap_vert:Ax,meshmatcap_frag:Cx,meshnormal_vert:Rx,meshnormal_frag:Px,meshphong_vert:Lx,meshphong_frag:Dx,meshphysical_vert:Ix,meshphysical_frag:Ux,meshtoon_vert:Fx,meshtoon_frag:Nx,points_vert:zx,points_frag:Ox,shadow_vert:Bx,shadow_frag:kx,sprite_vert:Vx,sprite_frag:Gx},ze={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gt}},envmap:{envMap:{value:null},envMapRotation:{value:new gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gt},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0},uvTransform:{value:new gt}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}}},si={basic:{uniforms:bn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:bn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new nt(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:bn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:bn([ze.common,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.roughnessmap,ze.metalnessmap,ze.fog,ze.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:bn([ze.common,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.gradientmap,ze.fog,ze.lights,{emissive:{value:new nt(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:bn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:bn([ze.points,ze.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:bn([ze.common,ze.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:bn([ze.common,ze.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:bn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:bn([ze.sprite,ze.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:bn([ze.common,ze.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:bn([ze.lights,ze.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};si.physical={uniforms:bn([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gt},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gt},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gt},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gt},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gt},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Pa={r:0,b:0,g:0},Zi=new ei,Hx=new Tt;function Wx(n,e,t,i,s,r,a){const o=new nt(0);let l=r===!0?0:1,c,u,f=null,m=0,p=null;function x(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?t:e).get(y)),y}function _(M){let y=!1;const E=x(M);E===null?d(o,l):E&&E.isColor&&(d(E,1),y=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(M,y){const E=x(y);E&&(E.isCubeTexture||E.mapping===so)?(u===void 0&&(u=new V(new De(1,1,1),new dn({name:"BackgroundCubeMaterial",uniforms:$s(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Zi.copy(y.backgroundRotation),Zi.x*=-1,Zi.y*=-1,Zi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Zi.y*=-1,Zi.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Hx.makeRotationFromEuler(Zi)),u.material.toneMapped=Ct.getTransfer(E.colorSpace)!==zt,(f!==E||m!==E.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=E,m=E.version,p=n.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new V(new Gt(2,2),new dn({name:"BackgroundMaterial",uniforms:$s(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:Gi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ct.getTransfer(E.colorSpace)!==zt,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||m!==E.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=E,m=E.version,p=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,y){M.getRGB(Pa,Wd(n)),i.buffers.color.setClear(Pa.r,Pa.g,Pa.b,y,a)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,y=1){o.set(M),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(o,l)},render:_,addToRenderList:g,dispose:v}}function Xx(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null);let r=s,a=!1;function o(S,L,F,W,te){let ee=!1;const X=f(W,F,L);r!==X&&(r=X,c(r.object)),ee=p(S,W,F,te),ee&&x(S,W,F,te),te!==null&&e.update(te,n.ELEMENT_ARRAY_BUFFER),(ee||a)&&(a=!1,y(S,L,F,W),te!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function f(S,L,F){const W=F.wireframe===!0;let te=i[S.id];te===void 0&&(te={},i[S.id]=te);let ee=te[L.id];ee===void 0&&(ee={},te[L.id]=ee);let X=ee[W];return X===void 0&&(X=m(l()),ee[W]=X),X}function m(S){const L=[],F=[],W=[];for(let te=0;te<t;te++)L[te]=0,F[te]=0,W[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:W,object:S,attributes:{},index:null}}function p(S,L,F,W){const te=r.attributes,ee=L.attributes;let X=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){const pe=te[ne];let Ve=ee[ne];if(Ve===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(Ve=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(Ve=S.instanceColor)),pe===void 0||pe.attribute!==Ve||Ve&&pe.data!==Ve.data)return!0;X++}return r.attributesNum!==X||r.index!==W}function x(S,L,F,W){const te={},ee=L.attributes;let X=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){let pe=ee[ne];pe===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(pe=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(pe=S.instanceColor));const Ve={};Ve.attribute=pe,pe&&pe.data&&(Ve.data=pe.data),te[ne]=Ve,X++}r.attributes=te,r.attributesNum=X,r.index=W}function _(){const S=r.newAttributes;for(let L=0,F=S.length;L<F;L++)S[L]=0}function g(S){d(S,0)}function d(S,L){const F=r.newAttributes,W=r.enabledAttributes,te=r.attributeDivisors;F[S]=1,W[S]===0&&(n.enableVertexAttribArray(S),W[S]=1),te[S]!==L&&(n.vertexAttribDivisor(S,L),te[S]=L)}function v(){const S=r.newAttributes,L=r.enabledAttributes;for(let F=0,W=L.length;F<W;F++)L[F]!==S[F]&&(n.disableVertexAttribArray(F),L[F]=0)}function M(S,L,F,W,te,ee,X){X===!0?n.vertexAttribIPointer(S,L,F,te,ee):n.vertexAttribPointer(S,L,F,W,te,ee)}function y(S,L,F,W){_();const te=W.attributes,ee=F.getAttributes(),X=L.defaultAttributeValues;for(const Z in ee){const ne=ee[Z];if(ne.location>=0){let de=te[Z];if(de===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const pe=de.normalized,Ve=de.itemSize,I=e.get(de);if(I===void 0)continue;const Se=I.buffer,ge=I.type,be=I.bytesPerElement,$=ge===n.INT||ge===n.UNSIGNED_INT||de.gpuType===uc;if(de.isInterleavedBufferAttribute){const K=de.data,xe=K.stride,we=de.offset;if(K.isInstancedInterleavedBuffer){for(let Ue=0;Ue<ne.locationSize;Ue++)d(ne.location+Ue,K.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ue=0;Ue<ne.locationSize;Ue++)g(ne.location+Ue);n.bindBuffer(n.ARRAY_BUFFER,Se);for(let Ue=0;Ue<ne.locationSize;Ue++)M(ne.location+Ue,Ve/ne.locationSize,ge,pe,xe*be,(we+Ve/ne.locationSize*Ue)*be,$)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)d(ne.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,Se);for(let K=0;K<ne.locationSize;K++)M(ne.location+K,Ve/ne.locationSize,ge,pe,Ve*be,Ve/ne.locationSize*K*be,$)}}else if(X!==void 0){const pe=X[Z];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv(ne.location,pe);break;case 3:n.vertexAttrib3fv(ne.location,pe);break;case 4:n.vertexAttrib4fv(ne.location,pe);break;default:n.vertexAttrib1fv(ne.location,pe)}}}}v()}function E(){C();for(const S in i){const L=i[S];for(const F in L){const W=L[F];for(const te in W)u(W[te].object),delete W[te];delete L[F]}delete i[S]}}function T(S){if(i[S.id]===void 0)return;const L=i[S.id];for(const F in L){const W=L[F];for(const te in W)u(W[te].object),delete W[te];delete L[F]}delete i[S.id]}function R(S){for(const L in i){const F=i[L];if(F[S.id]===void 0)continue;const W=F[S.id];for(const te in W)u(W[te].object),delete W[te];delete F[S.id]}}function C(){w(),a=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function qx(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let p=0;for(let x=0;x<f;x++)p+=u[x];t.update(p,i,1)}function l(c,u,f,m){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)a(c[x],u[x],m[x]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,m,0,f);let x=0;for(let _=0;_<f;_++)x+=u[_]*m[_];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Yx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Jn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===ci&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==ui&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ai&&!C)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(ht("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function $x(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new ji,o=new gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){const p=f.length!==0||m||i!==0||s;return s=m,i=f.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,m){t=u(f,m,0)},this.setState=function(f,m,p){const x=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,d=n.get(f);if(!s||x===null||x.length===0||r&&!g)r?u(null):c();else{const v=r?0:i,M=v*4;let y=d.clippingState||null;l.value=y,y=u(x,m,M,p);for(let E=0;E!==M;++E)y[E]=t[E];d.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,m,p,x){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,x!==!0||g===null){const d=p+_*4,v=m.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<d)&&(g=new Float32Array(d));for(let M=0,y=p;M!==_;++M,y+=4)a.copy(f[M]).applyMatrix4(v,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Zx(n){let e=new WeakMap;function t(a,o){return o===gl?a.mapping=Xs:o===vl&&(a.mapping=qs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===gl||o===vl)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new p0(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Bi=4,Nh=[.125,.215,.35,.446,.526,.582],ns=20,Kx=512,_r=new Uc,zh=new nt;let $o=null,Zo=0,Ko=0,Jo=!1;const Jx=new P;class Ql{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Jx}=r;$o=this._renderer.getRenderTarget(),Zo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel(),Jo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget($o,Zo,Ko),this._renderer.xr.enabled=Jo,e.scissorTest=!1,Fs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xs||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$o=this._renderer.getRenderTarget(),Zo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel(),Jo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:ci,format:Jn,colorSpace:Ys,depthBuffer:!1},s=Oh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oh(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=jx(r)),this._blurMaterial=eg(r,e,t)}return s}_compileMaterial(e){const t=new V(new Wt,e);this._renderer.compile(t,_r)}_sceneToCubeUV(e,t,i,s,r){const l=new Rn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,p=f.toneMapping;f.getClearColor(zh),f.toneMapping=Vi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new V(new De,new bt({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let d=!1;const v=e.background;v?v.isColor&&(g.color.copy(v),e.background=null,d=!0):(g.color.copy(zh),d=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));const E=this._cubeSize;Fs(s,y*E,M>2?E:0,E,E),f.setRenderTarget(s),d&&f.render(_,l),f.render(e,l)}f.toneMapping=p,f.autoClear=m,e.background=v}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Xs||e.mapping===qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Fs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,_r)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget;if(this._ggxMaterial===null){const v=3*Math.max(this._cubeSize,16),M=4*this._cubeSize;this._ggxMaterial=Qx(this._lodMax,v,M)}const a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),m=.05+c*.95,p=f*m,{_lodMax:x}=this,_=this._sizeLods[i],g=3*_*(i>x-Bi?i-x+Bi:0),d=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=x-t,Fs(r,g,d,3*_,2*_),s.setRenderTarget(r),s.render(o,_r),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-i,Fs(e,g,d,3*_,2*_),s.setRenderTarget(e),s.render(o,_r)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Kt("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[s];f.material=c;const m=c.uniforms,p=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ns-1),_=r/x,g=isFinite(r)?1+Math.floor(u*_):ns;g>ns&&ht(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ns}`);const d=[];let v=0;for(let R=0;R<ns;++R){const C=R/_,w=Math.exp(-C*C/2);d.push(w),R===0?v+=w:R<g&&(v+=2*w)}for(let R=0;R<d.length;R++)d[R]=d[R]/v;m.envMap.value=e.texture,m.samples.value=g,m.weights.value=d,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:M}=this;m.dTheta.value=x,m.mipInt.value=M-i;const y=this._sizeLods[s],E=3*y*(s>M-Bi?s-M+Bi:0),T=4*(this._cubeSize-y);Fs(t,E,T,3*y,2*y),l.setRenderTarget(t),l.render(f,_r)}}function jx(n){const e=[],t=[],i=[];let s=n;const r=n-Bi+1+Nh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Bi?l=Nh[a-n+Bi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,f=1+c,m=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,x=6,_=3,g=2,d=1,v=new Float32Array(_*x*p),M=new Float32Array(g*x*p),y=new Float32Array(d*x*p);for(let T=0;T<p;T++){const R=T%3*2/3-1,C=T>2?0:-1,w=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];v.set(w,_*x*T),M.set(m,g*x*T);const S=[T,T,T,T,T,T];y.set(S,d*x*T)}const E=new Wt;E.setAttribute("position",new Dn(v,_)),E.setAttribute("uv",new Dn(M,g)),E.setAttribute("faceIndex",new Dn(y,d)),i.push(new V(E,null)),s>Bi&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Oh(n,e,t){const i=new Qn(n,e,t);return i.texture.mapping=so,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Qx(n,e,t){return new dn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Kx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:lo(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function eg(n,e,t){const i=new Float32Array(ns),s=new P(0,1,0);return new dn({name:"SphericalGaussianBlur",defines:{n:ns,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:lo(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function Bh(){return new dn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lo(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function kh(){return new dn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function lo(){return`

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
	`}function tg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===gl||l===vl,u=l===Xs||l===qs;if(c||u){let f=e.get(o);const m=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new Ql(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Ql(n)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function ng(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Br("WebGLRenderer: "+i+" extension not supported."),s}}}function ig(n,e,t,i){const s={},r=new WeakMap;function a(f){const m=f.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);m.removeEventListener("dispose",a),delete s[m.id];const p=r.get(m);p&&(e.remove(p),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(f,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,t.memory.geometries++),m}function l(f){const m=f.attributes;for(const p in m)e.update(m[p],n.ARRAY_BUFFER)}function c(f){const m=[],p=f.index,x=f.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let M=0,y=v.length;M<y;M+=3){const E=v[M+0],T=v[M+1],R=v[M+2];m.push(E,T,T,R,R,E)}}else if(x!==void 0){const v=x.array;_=x.version;for(let M=0,y=v.length/3-1;M<y;M+=3){const E=M+0,T=M+1,R=M+2;m.push(E,T,T,R,R,E)}}else return;const g=new(Bd(m)?Hd:Gd)(m,1);g.version=_;const d=r.get(f);d&&e.remove(d),r.set(f,g)}function u(f){const m=r.get(f);if(m){const p=f.index;p!==null&&m.version<p.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function sg(n,e,t){let i;function s(m){i=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function l(m,p){n.drawElements(i,p,r,m*a),t.update(p,i,1)}function c(m,p,x){x!==0&&(n.drawElementsInstanced(i,p,r,m*a,x),t.update(p,i,x))}function u(m,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,m,0,x);let g=0;for(let d=0;d<x;d++)g+=p[d];t.update(g,i,1)}function f(m,p,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<m.length;d++)c(m[d]/a,p[d],_[d]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,r,m,0,_,0,x);let d=0;for(let v=0;v<x;v++)d+=p[v]*_[v];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function rg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Kt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function ag(n,e,t){const i=new WeakMap,s=new kt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let m=i.get(o);if(m===void 0||m.count!==f){let S=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var p=S;m!==void 0&&m.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),_===!0&&(y=2),g===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*T*4*f),C=new kd(R,E,T,f);C.type=ai,C.needsUpdate=!0;const w=y*4;for(let L=0;L<f;L++){const F=d[L],W=v[L],te=M[L],ee=E*T*4*L;for(let X=0;X<F.count;X++){const Z=X*w;x===!0&&(s.fromBufferAttribute(F,X),R[ee+Z+0]=s.x,R[ee+Z+1]=s.y,R[ee+Z+2]=s.z,R[ee+Z+3]=0),_===!0&&(s.fromBufferAttribute(W,X),R[ee+Z+4]=s.x,R[ee+Z+5]=s.y,R[ee+Z+6]=s.z,R[ee+Z+7]=0),g===!0&&(s.fromBufferAttribute(te,X),R[ee+Z+8]=s.x,R[ee+Z+9]=s.y,R[ee+Z+10]=s.z,R[ee+Z+11]=te.itemSize===4?s.w:1)}}m={count:f,texture:C,size:new Te(E,T)},i.set(o,m),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let x=0;for(let g=0;g<c.length;g++)x+=c[g];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:r}}function og(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const hu=new vn,Vh=new Jd(1,1),du=new kd,uu=new jf,fu=new qd,Gh=[],Hh=[],Wh=new Float32Array(16),Xh=new Float32Array(9),qh=new Float32Array(4);function nr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Gh[s];if(r===void 0&&(r=new Float32Array(s),Gh[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function rn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function an(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function co(n,e){let t=Hh[e];t===void 0&&(t=new Int32Array(e),Hh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function lg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2fv(this.addr,e),an(t,e)}}function hg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;n.uniform3fv(this.addr,e),an(t,e)}}function dg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4fv(this.addr,e),an(t,e)}}function ug(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;qh.set(i),n.uniformMatrix2fv(this.addr,!1,qh),an(t,i)}}function fg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;Xh.set(i),n.uniformMatrix3fv(this.addr,!1,Xh),an(t,i)}}function pg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;Wh.set(i),n.uniformMatrix4fv(this.addr,!1,Wh),an(t,i)}}function mg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function xg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2iv(this.addr,e),an(t,e)}}function gg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;n.uniform3iv(this.addr,e),an(t,e)}}function vg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4iv(this.addr,e),an(t,e)}}function _g(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2uiv(this.addr,e),an(t,e)}}function yg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;n.uniform3uiv(this.addr,e),an(t,e)}}function Sg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4uiv(this.addr,e),an(t,e)}}function bg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Vh.compareFunction=Od,r=Vh):r=hu,t.setTexture2D(e||r,s)}function wg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||uu,s)}function Tg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||fu,s)}function Eg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||du,s)}function Ag(n){switch(n){case 5126:return lg;case 35664:return cg;case 35665:return hg;case 35666:return dg;case 35674:return ug;case 35675:return fg;case 35676:return pg;case 5124:case 35670:return mg;case 35667:case 35671:return xg;case 35668:case 35672:return gg;case 35669:case 35673:return vg;case 5125:return _g;case 36294:return Mg;case 36295:return yg;case 36296:return Sg;case 35678:case 36198:case 36298:case 36306:case 35682:return bg;case 35679:case 36299:case 36307:return wg;case 35680:case 36300:case 36308:case 36293:return Tg;case 36289:case 36303:case 36311:case 36292:return Eg}}function Cg(n,e){n.uniform1fv(this.addr,e)}function Rg(n,e){const t=nr(e,this.size,2);n.uniform2fv(this.addr,t)}function Pg(n,e){const t=nr(e,this.size,3);n.uniform3fv(this.addr,t)}function Lg(n,e){const t=nr(e,this.size,4);n.uniform4fv(this.addr,t)}function Dg(n,e){const t=nr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Ig(n,e){const t=nr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Ug(n,e){const t=nr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Fg(n,e){n.uniform1iv(this.addr,e)}function Ng(n,e){n.uniform2iv(this.addr,e)}function zg(n,e){n.uniform3iv(this.addr,e)}function Og(n,e){n.uniform4iv(this.addr,e)}function Bg(n,e){n.uniform1uiv(this.addr,e)}function kg(n,e){n.uniform2uiv(this.addr,e)}function Vg(n,e){n.uniform3uiv(this.addr,e)}function Gg(n,e){n.uniform4uiv(this.addr,e)}function Hg(n,e,t){const i=this.cache,s=e.length,r=co(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||hu,r[a])}function Wg(n,e,t){const i=this.cache,s=e.length,r=co(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||uu,r[a])}function Xg(n,e,t){const i=this.cache,s=e.length,r=co(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||fu,r[a])}function qg(n,e,t){const i=this.cache,s=e.length,r=co(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||du,r[a])}function Yg(n){switch(n){case 5126:return Cg;case 35664:return Rg;case 35665:return Pg;case 35666:return Lg;case 35674:return Dg;case 35675:return Ig;case 35676:return Ug;case 5124:case 35670:return Fg;case 35667:case 35671:return Ng;case 35668:case 35672:return zg;case 35669:case 35673:return Og;case 5125:return Bg;case 36294:return kg;case 36295:return Vg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Hg;case 35679:case 36299:case 36307:return Wg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return qg}}class $g{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ag(t.type)}}class Zg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Yg(t.type)}}class Kg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const jo=/(\w+)(\])?(\[|\.)?/g;function Yh(n,e){n.seq.push(e),n.map[e.id]=e}function Jg(n,e,t){const i=n.name,s=i.length;for(jo.lastIndex=0;;){const r=jo.exec(i),a=jo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Yh(t,c===void 0?new $g(o,n,e):new Zg(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new Kg(o),Yh(t,f)),t=f}}}class Ga{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Jg(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function $h(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const jg=37297;let Qg=0;function e1(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Zh=new gt;function t1(n){Ct._getMatrix(Zh,Ct.workingColorSpace,n);const e=`mat3( ${Zh.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(n)){case qa:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return ht("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Kh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+e1(n.getShaderSource(e),o)}else return r}function n1(n,e){const t=t1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function i1(n,e){let t;switch(e){case Td:t="Linear";break;case Ed:t="Reinhard";break;case Ad:t="Cineon";break;case dc:t="ACESFilmic";break;case Rd:t="AgX";break;case Pd:t="Neutral";break;case Cd:t="Custom";break;default:ht("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const La=new P;function s1(){Ct.getLuminanceCoefficients(La);const n=La.x.toFixed(4),e=La.y.toFixed(4),t=La.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function r1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sr).join(`
`)}function a1(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function o1(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Sr(n){return n!==""}function Jh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const l1=/^[ \t]*#include +<([\w\d./]+)>/gm;function ec(n){return n.replace(l1,h1)}const c1=new Map;function h1(n,e){let t=vt[e];if(t===void 0){const i=c1.get(e);if(i!==void 0)t=vt[i],ht('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ec(t)}const d1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qh(n){return n.replace(d1,u1)}function u1(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ed(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function f1(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===bd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===wd?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function p1(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Xs:case qs:e="ENVMAP_TYPE_CUBE";break;case so:e="ENVMAP_TYPE_CUBE_UV";break}return e}function m1(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===qs&&(e="ENVMAP_MODE_REFRACTION"),e}function x1(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hc:e="ENVMAP_BLENDING_MULTIPLY";break;case xf:e="ENVMAP_BLENDING_MIX";break;case gf:e="ENVMAP_BLENDING_ADD";break}return e}function g1(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function v1(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=f1(t),c=p1(t),u=m1(t),f=x1(t),m=g1(t),p=r1(t),x=a1(r),_=s.createProgram();let g,d,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Sr).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Sr).join(`
`),d.length>0&&(d+=`
`)):(g=[ed(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sr).join(`
`),d=[ed(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vi?"#define TONE_MAPPING":"",t.toneMapping!==Vi?vt.tonemapping_pars_fragment:"",t.toneMapping!==Vi?i1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,n1("linearToOutputTexel",t.outputColorSpace),s1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sr).join(`
`)),a=ec(a),a=Jh(a,t),a=jh(a,t),o=ec(o),o=Jh(o,t),o=jh(o,t),a=Qh(a),o=Qh(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",t.glslVersion===Kc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Kc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const M=v+g+a,y=v+d+o,E=$h(s,s.VERTEX_SHADER,M),T=$h(s,s.FRAGMENT_SHADER,y);s.attachShader(_,E),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(L){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",W=s.getShaderInfoLog(E)||"",te=s.getShaderInfoLog(T)||"",ee=F.trim(),X=W.trim(),Z=te.trim();let ne=!0,de=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,E,T);else{const pe=Kh(s,E,"vertex"),Ve=Kh(s,T,"fragment");Kt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+ee+`
`+pe+`
`+Ve)}else ee!==""?ht("WebGLProgram: Program Info Log:",ee):(X===""||Z==="")&&(de=!1);de&&(L.diagnostics={runnable:ne,programLog:ee,vertexShader:{log:X,prefix:g},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(E),s.deleteShader(T),C=new Ga(s,_),w=o1(s,_)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,jg)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Qg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let _1=0;class M1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new y1(e),t.set(e,i)),i}}class y1{constructor(e){this.id=_1++,this.code=e,this.usedTimes=0}}function S1(n,e,t,i,s,r,a){const o=new wc,l=new M1,c=new Set,u=[],f=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function g(w,S,L,F,W){const te=F.fog,ee=W.geometry,X=w.isMeshStandardMaterial?F.environment:null,Z=(w.isMeshStandardMaterial?t:e).get(w.envMap||X),ne=Z&&Z.mapping===so?Z.image.height:null,de=x[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&ht("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const pe=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,Ve=pe!==void 0?pe.length:0;let I=0;ee.morphAttributes.position!==void 0&&(I=1),ee.morphAttributes.normal!==void 0&&(I=2),ee.morphAttributes.color!==void 0&&(I=3);let Se,ge,be,$;if(de){const Et=si[de];Se=Et.vertexShader,ge=Et.fragmentShader}else Se=w.vertexShader,ge=w.fragmentShader,l.update(w),be=l.getVertexShaderID(w),$=l.getFragmentShaderID(w);const K=n.getRenderTarget(),xe=n.state.buffers.depth.getReversed(),we=W.isInstancedMesh===!0,Ue=W.isBatchedMesh===!0,Ze=!!w.map,Lt=!!w.matcap,Ke=!!Z,Rt=!!w.aoMap,O=!!w.lightMap,ft=!!w.bumpMap,ut=!!w.normalMap,Pt=!!w.displacementMap,qe=!!w.emissiveMap,Ut=!!w.metalnessMap,Qe=!!w.roughnessMap,ct=w.anisotropy>0,D=w.clearcoat>0,A=w.dispersion>0,J=w.iridescence>0,ce=w.sheen>0,fe=w.transmission>0,re=ct&&!!w.anisotropyMap,Ye=D&&!!w.clearcoatMap,Ee=D&&!!w.clearcoatNormalMap,Je=D&&!!w.clearcoatRoughnessMap,Ge=J&&!!w.iridescenceMap,me=J&&!!w.iridescenceThicknessMap,_e=ce&&!!w.sheenColorMap,tt=ce&&!!w.sheenRoughnessMap,et=!!w.specularMap,Be=!!w.specularColorMap,it=!!w.specularIntensityMap,G=fe&&!!w.transmissionMap,Ne=fe&&!!w.thicknessMap,Le=!!w.gradientMap,Ae=!!w.alphaMap,ve=w.alphaTest>0,ue=!!w.alphaHash,We=!!w.extensions;let rt=Vi;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(rt=n.toneMapping);const Dt={shaderID:de,shaderType:w.type,shaderName:w.name,vertexShader:Se,fragmentShader:ge,defines:w.defines,customVertexShaderID:be,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ue,batchingColor:Ue&&W._colorsTexture!==null,instancing:we,instancingColor:we&&W.instanceColor!==null,instancingMorph:we&&W.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ys,alphaToCoverage:!!w.alphaToCoverage,map:Ze,matcap:Lt,envMap:Ke,envMapMode:Ke&&Z.mapping,envMapCubeUVHeight:ne,aoMap:Rt,lightMap:O,bumpMap:ft,normalMap:ut,displacementMap:m&&Pt,emissiveMap:qe,normalMapObjectSpace:ut&&w.normalMapType===yf,normalMapTangentSpace:ut&&w.normalMapType===Mc,metalnessMap:Ut,roughnessMap:Qe,anisotropy:ct,anisotropyMap:re,clearcoat:D,clearcoatMap:Ye,clearcoatNormalMap:Ee,clearcoatRoughnessMap:Je,dispersion:A,iridescence:J,iridescenceMap:Ge,iridescenceThicknessMap:me,sheen:ce,sheenColorMap:_e,sheenRoughnessMap:tt,specularMap:et,specularColorMap:Be,specularIntensityMap:it,transmission:fe,transmissionMap:G,thicknessMap:Ne,gradientMap:Le,opaque:w.transparent===!1&&w.blending===Os&&w.alphaToCoverage===!1,alphaMap:Ae,alphaTest:ve,alphaHash:ue,combine:w.combine,mapUv:Ze&&_(w.map.channel),aoMapUv:Rt&&_(w.aoMap.channel),lightMapUv:O&&_(w.lightMap.channel),bumpMapUv:ft&&_(w.bumpMap.channel),normalMapUv:ut&&_(w.normalMap.channel),displacementMapUv:Pt&&_(w.displacementMap.channel),emissiveMapUv:qe&&_(w.emissiveMap.channel),metalnessMapUv:Ut&&_(w.metalnessMap.channel),roughnessMapUv:Qe&&_(w.roughnessMap.channel),anisotropyMapUv:re&&_(w.anisotropyMap.channel),clearcoatMapUv:Ye&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Ee&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Je&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ge&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:me&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:tt&&_(w.sheenRoughnessMap.channel),specularMapUv:et&&_(w.specularMap.channel),specularColorMapUv:Be&&_(w.specularColorMap.channel),specularIntensityMapUv:it&&_(w.specularIntensityMap.channel),transmissionMapUv:G&&_(w.transmissionMap.channel),thicknessMapUv:Ne&&_(w.thicknessMap.channel),alphaMapUv:Ae&&_(w.alphaMap.channel),vertexTangents:!!ee.attributes.tangent&&(ut||ct),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!ee.attributes.uv&&(Ze||Ae),fog:!!te,useFog:w.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:xe,skinning:W.isSkinnedMesh===!0,morphTargets:ee.morphAttributes.position!==void 0,morphNormals:ee.morphAttributes.normal!==void 0,morphColors:ee.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:rt,decodeVideoTexture:Ze&&w.map.isVideoTexture===!0&&Ct.getTransfer(w.map.colorSpace)===zt,decodeVideoTextureEmissive:qe&&w.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(w.emissiveMap.colorSpace)===zt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===pt,flipSided:w.side===gn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:We&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&w.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Dt.vertexUv1s=c.has(1),Dt.vertexUv2s=c.has(2),Dt.vertexUv3s=c.has(3),c.clear(),Dt}function d(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const L in w.defines)S.push(L),S.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(v(S,w),M(S,w),S.push(n.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function v(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function M(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),w.push(o.mask)}function y(w){const S=x[w.type];let L;if(S){const F=si[S];L=Vr.clone(F.uniforms)}else L=w.uniforms;return L}function E(w,S){let L;for(let F=0,W=u.length;F<W;F++){const te=u[F];if(te.cacheKey===S){L=te,++L.usedTimes;break}}return L===void 0&&(L=new v1(n,S,w,r),u.push(L)),L}function T(w){if(--w.usedTimes===0){const S=u.indexOf(w);u[S]=u[u.length-1],u.pop(),w.destroy()}}function R(w){l.remove(w)}function C(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:R,programs:u,dispose:C}}function b1(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function w1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function td(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function nd(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,m,p,x,_,g){let d=n[e];return d===void 0?(d={id:f.id,object:f,geometry:m,material:p,groupOrder:x,renderOrder:f.renderOrder,z:_,group:g},n[e]=d):(d.id=f.id,d.object=f,d.geometry=m,d.material=p,d.groupOrder=x,d.renderOrder=f.renderOrder,d.z=_,d.group=g),e++,d}function o(f,m,p,x,_,g){const d=a(f,m,p,x,_,g);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function l(f,m,p,x,_,g){const d=a(f,m,p,x,_,g);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function c(f,m){t.length>1&&t.sort(f||w1),i.length>1&&i.sort(m||td),s.length>1&&s.sort(m||td)}function u(){for(let f=e,m=n.length;f<m;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function T1(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new nd,n.set(i,[a])):s>=r.length?(a=new nd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function E1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new nt};break;case"SpotLight":t={position:new P,direction:new P,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":t={color:new nt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function A1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let C1=0;function R1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function P1(n){const e=new E1,t=A1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const s=new P,r=new Tt,a=new Tt;function o(c){let u=0,f=0,m=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,x=0,_=0,g=0,d=0,v=0,M=0,y=0,E=0,T=0,R=0;c.sort(R1);for(let w=0,S=c.length;w<S;w++){const L=c[w],F=L.color,W=L.intensity,te=L.distance,ee=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=F.r*W,f+=F.g*W,m+=F.b*W;else if(L.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(L.sh.coefficients[X],W);R++}else if(L.isDirectionalLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.directionalShadow[p]=ne,i.directionalShadowMap[p]=ee,i.directionalShadowMatrix[p]=L.shadow.matrix,v++}i.directional[p]=X,p++}else if(L.isSpotLight){const X=e.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(F).multiplyScalar(W),X.distance=te,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,i.spot[_]=X;const Z=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,Z.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[_]=Z.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.spotShadow[_]=ne,i.spotShadowMap[_]=ee,y++}_++}else if(L.isRectAreaLight){const X=e.get(L);X.color.copy(F).multiplyScalar(W),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=X,g++}else if(L.isPointLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,ne.shadowCameraNear=Z.camera.near,ne.shadowCameraFar=Z.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=ee,i.pointShadowMatrix[x]=L.shadow.matrix,M++}i.point[x]=X,x++}else if(L.isHemisphereLight){const X=e.get(L);X.skyColor.copy(L.color).multiplyScalar(W),X.groundColor.copy(L.groundColor).multiplyScalar(W),i.hemi[d]=X,d++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ze.LTC_FLOAT_1,i.rectAreaLTC2=ze.LTC_FLOAT_2):(i.rectAreaLTC1=ze.LTC_HALF_1,i.rectAreaLTC2=ze.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=m;const C=i.hash;(C.directionalLength!==p||C.pointLength!==x||C.spotLength!==_||C.rectAreaLength!==g||C.hemiLength!==d||C.numDirectionalShadows!==v||C.numPointShadows!==M||C.numSpotShadows!==y||C.numSpotMaps!==E||C.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=d,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=y+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,C.directionalLength=p,C.pointLength=x,C.spotLength=_,C.rectAreaLength=g,C.hemiLength=d,C.numDirectionalShadows=v,C.numPointShadows=M,C.numSpotShadows=y,C.numSpotMaps=E,C.numLightProbes=R,i.version=C1++)}function l(c,u){let f=0,m=0,p=0,x=0,_=0;const g=u.matrixWorldInverse;for(let d=0,v=c.length;d<v;d++){const M=c[d];if(M.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(M.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),p++}else if(M.isRectAreaLight){const y=i.rectArea[x];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(M.isPointLight){const y=i.point[m];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),m++}else if(M.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function id(n){const e=new P1(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function L1(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new id(n),e.set(s,[o])):r>=a.length?(o=new id(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const D1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,I1=`uniform sampler2D shadow_pass;
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
}`;function U1(n,e,t){let i=new Ec;const s=new Te,r=new Te,a=new kt,o=new tp({depthPacking:Mf}),l=new np,c={},u=t.maxTextureSize,f={[Gi]:gn,[gn]:Gi,[pt]:pt},m=new dn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:D1,fragmentShader:I1}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const x=new Wt;x.setAttribute("position",new Dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new V(x,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bd;let d=this.type;this.render=function(T,R,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const w=n.getRenderTarget(),S=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),F=n.state;F.setBlending(li),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const W=d!==yi&&this.type===yi,te=d===yi&&this.type!==yi;for(let ee=0,X=T.length;ee<X;ee++){const Z=T[ee],ne=Z.shadow;if(ne===void 0){ht("WebGLShadowMap:",Z,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const de=ne.getFrameExtents();if(s.multiply(de),r.copy(ne.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/de.x),s.x=r.x*de.x,ne.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/de.y),s.y=r.y*de.y,ne.mapSize.y=r.y)),ne.map===null||W===!0||te===!0){const Ve=this.type!==yi?{minFilter:Ln,magFilter:Ln}:{};ne.map!==null&&ne.map.dispose(),ne.map=new Qn(s.x,s.y,Ve),ne.map.texture.name=Z.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const pe=ne.getViewportCount();for(let Ve=0;Ve<pe;Ve++){const I=ne.getViewport(Ve);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),F.viewport(a),ne.updateMatrices(Z,Ve),i=ne.getFrustum(),y(R,C,ne.camera,Z,this.type)}ne.isPointLightShadow!==!0&&this.type===yi&&v(ne,C),ne.needsUpdate=!1}d=this.type,g.needsUpdate=!1,n.setRenderTarget(w,S,L)};function v(T,R){const C=e.update(_);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Qn(s.x,s.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(R,null,C,m,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(R,null,C,p,_,null)}function M(T,R,C,w){let S=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=C.isPointLight===!0?l:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=S.uuid,W=R.uuid;let te=c[F];te===void 0&&(te={},c[F]=te);let ee=te[W];ee===void 0&&(ee=S.clone(),te[W]=ee,R.addEventListener("dispose",E)),S=ee}if(S.visible=R.visible,S.wireframe=R.wireframe,w===yi?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:f[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=n.properties.get(S);F.light=C}return S}function y(T,R,C,w,S){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===yi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const W=e.update(T),te=T.material;if(Array.isArray(te)){const ee=W.groups;for(let X=0,Z=ee.length;X<Z;X++){const ne=ee[X],de=te[ne.materialIndex];if(de&&de.visible){const pe=M(T,de,w,S);T.onBeforeShadow(n,T,R,C,W,pe,ne),n.renderBufferDirect(C,null,W,pe,T,ne),T.onAfterShadow(n,T,R,C,W,pe,ne)}}}else if(te.visible){const ee=M(T,te,w,S);T.onBeforeShadow(n,T,R,C,W,ee,null),n.renderBufferDirect(C,null,W,ee,T,null),T.onAfterShadow(n,T,R,C,W,ee,null)}}const F=T.children;for(let W=0,te=F.length;W<te;W++)y(F[W],R,C,w,S)}function E(T){T.target.removeEventListener("dispose",E);for(const C in c){const w=c[C],S=T.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const F1={[hl]:dl,[ul]:ml,[fl]:xl,[Ws]:pl,[dl]:hl,[ml]:ul,[xl]:fl,[pl]:Ws};function N1(n,e){function t(){let G=!1;const Ne=new kt;let Le=null;const Ae=new kt(0,0,0,0);return{setMask:function(ve){Le!==ve&&!G&&(n.colorMask(ve,ve,ve,ve),Le=ve)},setLocked:function(ve){G=ve},setClear:function(ve,ue,We,rt,Dt){Dt===!0&&(ve*=rt,ue*=rt,We*=rt),Ne.set(ve,ue,We,rt),Ae.equals(Ne)===!1&&(n.clearColor(ve,ue,We,rt),Ae.copy(Ne))},reset:function(){G=!1,Le=null,Ae.set(-1,0,0,0)}}}function i(){let G=!1,Ne=!1,Le=null,Ae=null,ve=null;return{setReversed:function(ue){if(Ne!==ue){const We=e.get("EXT_clip_control");ue?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),Ne=ue;const rt=ve;ve=null,this.setClear(rt)}},getReversed:function(){return Ne},setTest:function(ue){ue?K(n.DEPTH_TEST):xe(n.DEPTH_TEST)},setMask:function(ue){Le!==ue&&!G&&(n.depthMask(ue),Le=ue)},setFunc:function(ue){if(Ne&&(ue=F1[ue]),Ae!==ue){switch(ue){case hl:n.depthFunc(n.NEVER);break;case dl:n.depthFunc(n.ALWAYS);break;case ul:n.depthFunc(n.LESS);break;case Ws:n.depthFunc(n.LEQUAL);break;case fl:n.depthFunc(n.EQUAL);break;case pl:n.depthFunc(n.GEQUAL);break;case ml:n.depthFunc(n.GREATER);break;case xl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ae=ue}},setLocked:function(ue){G=ue},setClear:function(ue){ve!==ue&&(Ne&&(ue=1-ue),n.clearDepth(ue),ve=ue)},reset:function(){G=!1,Le=null,Ae=null,ve=null,Ne=!1}}}function s(){let G=!1,Ne=null,Le=null,Ae=null,ve=null,ue=null,We=null,rt=null,Dt=null;return{setTest:function(Et){G||(Et?K(n.STENCIL_TEST):xe(n.STENCIL_TEST))},setMask:function(Et){Ne!==Et&&!G&&(n.stencilMask(Et),Ne=Et)},setFunc:function(Et,Mn,fn){(Le!==Et||Ae!==Mn||ve!==fn)&&(n.stencilFunc(Et,Mn,fn),Le=Et,Ae=Mn,ve=fn)},setOp:function(Et,Mn,fn){(ue!==Et||We!==Mn||rt!==fn)&&(n.stencilOp(Et,Mn,fn),ue=Et,We=Mn,rt=fn)},setLocked:function(Et){G=Et},setClear:function(Et){Dt!==Et&&(n.clearStencil(Et),Dt=Et)},reset:function(){G=!1,Ne=null,Le=null,Ae=null,ve=null,ue=null,We=null,rt=null,Dt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},f={},m=new WeakMap,p=[],x=null,_=!1,g=null,d=null,v=null,M=null,y=null,E=null,T=null,R=new nt(0,0,0),C=0,w=!1,S=null,L=null,F=null,W=null,te=null;const ee=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Z=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ne)[1]),X=Z>=1):ne.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),X=Z>=2);let de=null,pe={};const Ve=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),Se=new kt().fromArray(Ve),ge=new kt().fromArray(I);function be(G,Ne,Le,Ae){const ve=new Uint8Array(4),ue=n.createTexture();n.bindTexture(G,ue),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let We=0;We<Le;We++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(Ne,0,n.RGBA,1,1,Ae,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(Ne+We,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return ue}const $={};$[n.TEXTURE_2D]=be(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=be(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=be(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=be(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(n.DEPTH_TEST),a.setFunc(Ws),ft(!1),ut(qc),K(n.CULL_FACE),Rt(li);function K(G){u[G]!==!0&&(n.enable(G),u[G]=!0)}function xe(G){u[G]!==!1&&(n.disable(G),u[G]=!1)}function we(G,Ne){return f[G]!==Ne?(n.bindFramebuffer(G,Ne),f[G]=Ne,G===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Ne),G===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Ne),!0):!1}function Ue(G,Ne){let Le=p,Ae=!1;if(G){Le=m.get(Ne),Le===void 0&&(Le=[],m.set(Ne,Le));const ve=G.textures;if(Le.length!==ve.length||Le[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,We=ve.length;ue<We;ue++)Le[ue]=n.COLOR_ATTACHMENT0+ue;Le.length=ve.length,Ae=!0}}else Le[0]!==n.BACK&&(Le[0]=n.BACK,Ae=!0);Ae&&n.drawBuffers(Le)}function Ze(G){return x!==G?(n.useProgram(G),x=G,!0):!1}const Lt={[ts]:n.FUNC_ADD,[ju]:n.FUNC_SUBTRACT,[Qu]:n.FUNC_REVERSE_SUBTRACT};Lt[ef]=n.MIN,Lt[tf]=n.MAX;const Ke={[nf]:n.ZERO,[sf]:n.ONE,[rf]:n.SRC_COLOR,[ll]:n.SRC_ALPHA,[df]:n.SRC_ALPHA_SATURATE,[cf]:n.DST_COLOR,[of]:n.DST_ALPHA,[af]:n.ONE_MINUS_SRC_COLOR,[cl]:n.ONE_MINUS_SRC_ALPHA,[hf]:n.ONE_MINUS_DST_COLOR,[lf]:n.ONE_MINUS_DST_ALPHA,[uf]:n.CONSTANT_COLOR,[ff]:n.ONE_MINUS_CONSTANT_COLOR,[pf]:n.CONSTANT_ALPHA,[mf]:n.ONE_MINUS_CONSTANT_ALPHA};function Rt(G,Ne,Le,Ae,ve,ue,We,rt,Dt,Et){if(G===li){_===!0&&(xe(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),G!==Ju){if(G!==g||Et!==w){if((d!==ts||y!==ts)&&(n.blendEquation(n.FUNC_ADD),d=ts,y=ts),Et)switch(G){case Os:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kn:n.blendFunc(n.ONE,n.ONE);break;case Yc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $c:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Kt("WebGLState: Invalid blending: ",G);break}else switch(G){case Os:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Yc:Kt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $c:Kt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Kt("WebGLState: Invalid blending: ",G);break}v=null,M=null,E=null,T=null,R.set(0,0,0),C=0,g=G,w=Et}return}ve=ve||Ne,ue=ue||Le,We=We||Ae,(Ne!==d||ve!==y)&&(n.blendEquationSeparate(Lt[Ne],Lt[ve]),d=Ne,y=ve),(Le!==v||Ae!==M||ue!==E||We!==T)&&(n.blendFuncSeparate(Ke[Le],Ke[Ae],Ke[ue],Ke[We]),v=Le,M=Ae,E=ue,T=We),(rt.equals(R)===!1||Dt!==C)&&(n.blendColor(rt.r,rt.g,rt.b,Dt),R.copy(rt),C=Dt),g=G,w=!1}function O(G,Ne){G.side===pt?xe(n.CULL_FACE):K(n.CULL_FACE);let Le=G.side===gn;Ne&&(Le=!Le),ft(Le),G.blending===Os&&G.transparent===!1?Rt(li):Rt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);const Ae=G.stencilWrite;o.setTest(Ae),Ae&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),qe(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):xe(n.SAMPLE_ALPHA_TO_COVERAGE)}function ft(G){S!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),S=G)}function ut(G){G!==Zu?(K(n.CULL_FACE),G!==L&&(G===qc?n.cullFace(n.BACK):G===Ku?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):xe(n.CULL_FACE),L=G}function Pt(G){G!==F&&(X&&n.lineWidth(G),F=G)}function qe(G,Ne,Le){G?(K(n.POLYGON_OFFSET_FILL),(W!==Ne||te!==Le)&&(n.polygonOffset(Ne,Le),W=Ne,te=Le)):xe(n.POLYGON_OFFSET_FILL)}function Ut(G){G?K(n.SCISSOR_TEST):xe(n.SCISSOR_TEST)}function Qe(G){G===void 0&&(G=n.TEXTURE0+ee-1),de!==G&&(n.activeTexture(G),de=G)}function ct(G,Ne,Le){Le===void 0&&(de===null?Le=n.TEXTURE0+ee-1:Le=de);let Ae=pe[Le];Ae===void 0&&(Ae={type:void 0,texture:void 0},pe[Le]=Ae),(Ae.type!==G||Ae.texture!==Ne)&&(de!==Le&&(n.activeTexture(Le),de=Le),n.bindTexture(G,Ne||$[G]),Ae.type=G,Ae.texture=Ne)}function D(){const G=pe[de];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function ce(){try{n.texSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function fe(){try{n.texSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function Ye(){try{n.compressedTexSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function Ee(){try{n.texStorage2D(...arguments)}catch(G){G("WebGLState:",G)}}function Je(){try{n.texStorage3D(...arguments)}catch(G){G("WebGLState:",G)}}function Ge(){try{n.texImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function me(){try{n.texImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function _e(G){Se.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),Se.copy(G))}function tt(G){ge.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),ge.copy(G))}function et(G,Ne){let Le=c.get(Ne);Le===void 0&&(Le=new WeakMap,c.set(Ne,Le));let Ae=Le.get(G);Ae===void 0&&(Ae=n.getUniformBlockIndex(Ne,G.name),Le.set(G,Ae))}function Be(G,Ne){const Ae=c.get(Ne).get(G);l.get(Ne)!==Ae&&(n.uniformBlockBinding(Ne,Ae,G.__bindingPointIndex),l.set(Ne,Ae))}function it(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},de=null,pe={},f={},m=new WeakMap,p=[],x=null,_=!1,g=null,d=null,v=null,M=null,y=null,E=null,T=null,R=new nt(0,0,0),C=0,w=!1,S=null,L=null,F=null,W=null,te=null,Se.set(0,0,n.canvas.width,n.canvas.height),ge.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:xe,bindFramebuffer:we,drawBuffers:Ue,useProgram:Ze,setBlending:Rt,setMaterial:O,setFlipSided:ft,setCullFace:ut,setLineWidth:Pt,setPolygonOffset:qe,setScissorTest:Ut,activeTexture:Qe,bindTexture:ct,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:Ge,texImage3D:me,updateUBOMapping:et,uniformBlockBinding:Be,texStorage2D:Ee,texStorage3D:Je,texSubImage2D:ce,texSubImage3D:fe,compressedTexSubImage2D:re,compressedTexSubImage3D:Ye,scissor:_e,viewport:tt,reset:it}}function z1(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Te,u=new WeakMap;let f;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,A){return p?new OffscreenCanvas(D,A):$a("canvas")}function _(D,A,J){let ce=1;const fe=ct(D);if((fe.width>J||fe.height>J)&&(ce=J/Math.max(fe.width,fe.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const re=Math.floor(ce*fe.width),Ye=Math.floor(ce*fe.height);f===void 0&&(f=x(re,Ye));const Ee=A?x(re,Ye):f;return Ee.width=re,Ee.height=Ye,Ee.getContext("2d").drawImage(D,0,0,re,Ye),ht("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+re+"x"+Ye+")."),Ee}else return"data"in D&&ht("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),D;return D}function g(D){return D.generateMipmaps}function d(D){n.generateMipmap(D)}function v(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(D,A,J,ce,fe=!1){if(D!==null){if(n[D]!==void 0)return n[D];ht("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let re=A;if(A===n.RED&&(J===n.FLOAT&&(re=n.R32F),J===n.HALF_FLOAT&&(re=n.R16F),J===n.UNSIGNED_BYTE&&(re=n.R8)),A===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.R8UI),J===n.UNSIGNED_SHORT&&(re=n.R16UI),J===n.UNSIGNED_INT&&(re=n.R32UI),J===n.BYTE&&(re=n.R8I),J===n.SHORT&&(re=n.R16I),J===n.INT&&(re=n.R32I)),A===n.RG&&(J===n.FLOAT&&(re=n.RG32F),J===n.HALF_FLOAT&&(re=n.RG16F),J===n.UNSIGNED_BYTE&&(re=n.RG8)),A===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RG8UI),J===n.UNSIGNED_SHORT&&(re=n.RG16UI),J===n.UNSIGNED_INT&&(re=n.RG32UI),J===n.BYTE&&(re=n.RG8I),J===n.SHORT&&(re=n.RG16I),J===n.INT&&(re=n.RG32I)),A===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGB8UI),J===n.UNSIGNED_SHORT&&(re=n.RGB16UI),J===n.UNSIGNED_INT&&(re=n.RGB32UI),J===n.BYTE&&(re=n.RGB8I),J===n.SHORT&&(re=n.RGB16I),J===n.INT&&(re=n.RGB32I)),A===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),J===n.UNSIGNED_INT&&(re=n.RGBA32UI),J===n.BYTE&&(re=n.RGBA8I),J===n.SHORT&&(re=n.RGBA16I),J===n.INT&&(re=n.RGBA32I)),A===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),A===n.RGBA){const Ye=fe?qa:Ct.getTransfer(ce);J===n.FLOAT&&(re=n.RGBA32F),J===n.HALF_FLOAT&&(re=n.RGBA16F),J===n.UNSIGNED_BYTE&&(re=Ye===zt?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function y(D,A){let J;return D?A===null||A===ds||A===Nr?J=n.DEPTH24_STENCIL8:A===ai?J=n.DEPTH32F_STENCIL8:A===Fr&&(J=n.DEPTH24_STENCIL8,ht("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ds||A===Nr?J=n.DEPTH_COMPONENT24:A===ai?J=n.DEPTH_COMPONENT32F:A===Fr&&(J=n.DEPTH_COMPONENT16),J}function E(D,A){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==Ln&&D.minFilter!==Vn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),C(A),A.isVideoTexture&&u.delete(A)}function R(D){const A=D.target;A.removeEventListener("dispose",R),S(A)}function C(D){const A=i.get(D);if(A.__webglInit===void 0)return;const J=D.source,ce=m.get(J);if(ce){const fe=ce[A.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&w(D),Object.keys(ce).length===0&&m.delete(J)}i.remove(D)}function w(D){const A=i.get(D);n.deleteTexture(A.__webglTexture);const J=D.source,ce=m.get(J);delete ce[A.__cacheKey],a.memory.textures--}function S(D){const A=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(A.__webglFramebuffer[ce]))for(let fe=0;fe<A.__webglFramebuffer[ce].length;fe++)n.deleteFramebuffer(A.__webglFramebuffer[ce][fe]);else n.deleteFramebuffer(A.__webglFramebuffer[ce]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ce])}else{if(Array.isArray(A.__webglFramebuffer))for(let ce=0;ce<A.__webglFramebuffer.length;ce++)n.deleteFramebuffer(A.__webglFramebuffer[ce]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ce=0;ce<A.__webglColorRenderbuffer.length;ce++)A.__webglColorRenderbuffer[ce]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ce]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,fe=J.length;ce<fe;ce++){const re=i.get(J[ce]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),i.remove(J[ce])}i.remove(D)}let L=0;function F(){L=0}function W(){const D=L;return D>=s.maxTextures&&ht("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function te(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function ee(D,A){const J=i.get(D);if(D.isVideoTexture&&Ut(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)ht("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)ht("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+A)}function X(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+A)}function Z(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+A)}function ne(D,A){const J=i.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+A)}const de={[_n]:n.REPEAT,[wi]:n.CLAMP_TO_EDGE,[_l]:n.MIRRORED_REPEAT},pe={[Ln]:n.NEAREST,[vf]:n.NEAREST_MIPMAP_NEAREST,[ia]:n.NEAREST_MIPMAP_LINEAR,[Vn]:n.LINEAR,[go]:n.LINEAR_MIPMAP_NEAREST,[is]:n.LINEAR_MIPMAP_LINEAR},Ve={[Sf]:n.NEVER,[Cf]:n.ALWAYS,[bf]:n.LESS,[Od]:n.LEQUAL,[wf]:n.EQUAL,[Af]:n.GEQUAL,[Tf]:n.GREATER,[Ef]:n.NOTEQUAL};function I(D,A){if(A.type===ai&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Vn||A.magFilter===go||A.magFilter===ia||A.magFilter===is||A.minFilter===Vn||A.minFilter===go||A.minFilter===ia||A.minFilter===is)&&ht("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,de[A.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,de[A.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,de[A.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,pe[A.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,pe[A.minFilter]),A.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Ve[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Ln||A.minFilter!==ia&&A.minFilter!==is||A.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Se(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const ce=A.source;let fe=m.get(ce);fe===void 0&&(fe={},m.set(ce,fe));const re=te(A);if(re!==D.__cacheKey){fe[re]===void 0&&(fe[re]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),fe[re].usedTimes++;const Ye=fe[D.__cacheKey];Ye!==void 0&&(fe[D.__cacheKey].usedTimes--,Ye.usedTimes===0&&w(A)),D.__cacheKey=re,D.__webglTexture=fe[re].texture}return J}function ge(D,A,J){return Math.floor(Math.floor(D/J)/A)}function be(D,A,J,ce){const re=D.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,J,ce,A.data);else{re.sort((me,_e)=>me.start-_e.start);let Ye=0;for(let me=1;me<re.length;me++){const _e=re[Ye],tt=re[me],et=_e.start+_e.count,Be=ge(tt.start,A.width,4),it=ge(_e.start,A.width,4);tt.start<=et+1&&Be===it&&ge(tt.start+tt.count-1,A.width,4)===Be?_e.count=Math.max(_e.count,tt.start+tt.count-_e.start):(++Ye,re[Ye]=tt)}re.length=Ye+1;const Ee=n.getParameter(n.UNPACK_ROW_LENGTH),Je=n.getParameter(n.UNPACK_SKIP_PIXELS),Ge=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let me=0,_e=re.length;me<_e;me++){const tt=re[me],et=Math.floor(tt.start/4),Be=Math.ceil(tt.count/4),it=et%A.width,G=Math.floor(et/A.width),Ne=Be,Le=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,it),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),t.texSubImage2D(n.TEXTURE_2D,0,it,G,Ne,Le,J,ce,A.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Ee),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Je),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ge)}}function $(D,A,J){let ce=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ce=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ce=n.TEXTURE_3D);const fe=Se(D,A),re=A.source;t.bindTexture(ce,D.__webglTexture,n.TEXTURE0+J);const Ye=i.get(re);if(re.version!==Ye.__version||fe===!0){t.activeTexture(n.TEXTURE0+J);const Ee=Ct.getPrimaries(Ct.workingColorSpace),Je=A.colorSpace===Oi?null:Ct.getPrimaries(A.colorSpace),Ge=A.colorSpace===Oi||Ee===Je?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);let me=_(A.image,!1,s.maxTextureSize);me=Qe(A,me);const _e=r.convert(A.format,A.colorSpace),tt=r.convert(A.type);let et=M(A.internalFormat,_e,tt,A.colorSpace,A.isVideoTexture);I(ce,A);let Be;const it=A.mipmaps,G=A.isVideoTexture!==!0,Ne=Ye.__version===void 0||fe===!0,Le=re.dataReady,Ae=E(A,me);if(A.isDepthTexture)et=y(A.format===Or,A.type),Ne&&(G?t.texStorage2D(n.TEXTURE_2D,1,et,me.width,me.height):t.texImage2D(n.TEXTURE_2D,0,et,me.width,me.height,0,_e,tt,null));else if(A.isDataTexture)if(it.length>0){G&&Ne&&t.texStorage2D(n.TEXTURE_2D,Ae,et,it[0].width,it[0].height);for(let ve=0,ue=it.length;ve<ue;ve++)Be=it[ve],G?Le&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,_e,tt,Be.data):t.texImage2D(n.TEXTURE_2D,ve,et,Be.width,Be.height,0,_e,tt,Be.data);A.generateMipmaps=!1}else G?(Ne&&t.texStorage2D(n.TEXTURE_2D,Ae,et,me.width,me.height),Le&&be(A,me,_e,tt)):t.texImage2D(n.TEXTURE_2D,0,et,me.width,me.height,0,_e,tt,me.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){G&&Ne&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ae,et,it[0].width,it[0].height,me.depth);for(let ve=0,ue=it.length;ve<ue;ve++)if(Be=it[ve],A.format!==Jn)if(_e!==null)if(G){if(Le)if(A.layerUpdates.size>0){const We=Fh(Be.width,Be.height,A.format,A.type);for(const rt of A.layerUpdates){const Dt=Be.data.subarray(rt*We/Be.data.BYTES_PER_ELEMENT,(rt+1)*We/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,rt,Be.width,Be.height,1,_e,Dt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Be.width,Be.height,me.depth,_e,Be.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ve,et,Be.width,Be.height,me.depth,0,Be.data,0,0);else ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Le&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Be.width,Be.height,me.depth,_e,tt,Be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ve,et,Be.width,Be.height,me.depth,0,_e,tt,Be.data)}else{G&&Ne&&t.texStorage2D(n.TEXTURE_2D,Ae,et,it[0].width,it[0].height);for(let ve=0,ue=it.length;ve<ue;ve++)Be=it[ve],A.format!==Jn?_e!==null?G?Le&&t.compressedTexSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,_e,Be.data):t.compressedTexImage2D(n.TEXTURE_2D,ve,et,Be.width,Be.height,0,Be.data):ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Le&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,_e,tt,Be.data):t.texImage2D(n.TEXTURE_2D,ve,et,Be.width,Be.height,0,_e,tt,Be.data)}else if(A.isDataArrayTexture)if(G){if(Ne&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ae,et,me.width,me.height,me.depth),Le)if(A.layerUpdates.size>0){const ve=Fh(me.width,me.height,A.format,A.type);for(const ue of A.layerUpdates){const We=me.data.subarray(ue*ve/me.data.BYTES_PER_ELEMENT,(ue+1)*ve/me.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ue,me.width,me.height,1,_e,tt,We)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,_e,tt,me.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,et,me.width,me.height,me.depth,0,_e,tt,me.data);else if(A.isData3DTexture)G?(Ne&&t.texStorage3D(n.TEXTURE_3D,Ae,et,me.width,me.height,me.depth),Le&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,_e,tt,me.data)):t.texImage3D(n.TEXTURE_3D,0,et,me.width,me.height,me.depth,0,_e,tt,me.data);else if(A.isFramebufferTexture){if(Ne)if(G)t.texStorage2D(n.TEXTURE_2D,Ae,et,me.width,me.height);else{let ve=me.width,ue=me.height;for(let We=0;We<Ae;We++)t.texImage2D(n.TEXTURE_2D,We,et,ve,ue,0,_e,tt,null),ve>>=1,ue>>=1}}else if(it.length>0){if(G&&Ne){const ve=ct(it[0]);t.texStorage2D(n.TEXTURE_2D,Ae,et,ve.width,ve.height)}for(let ve=0,ue=it.length;ve<ue;ve++)Be=it[ve],G?Le&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,_e,tt,Be):t.texImage2D(n.TEXTURE_2D,ve,et,_e,tt,Be);A.generateMipmaps=!1}else if(G){if(Ne){const ve=ct(me);t.texStorage2D(n.TEXTURE_2D,Ae,et,ve.width,ve.height)}Le&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,_e,tt,me)}else t.texImage2D(n.TEXTURE_2D,0,et,_e,tt,me);g(A)&&d(ce),Ye.__version=re.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const ce=Se(D,A),fe=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+J);const re=i.get(fe);if(fe.version!==re.__version||ce===!0){t.activeTexture(n.TEXTURE0+J);const Ye=Ct.getPrimaries(Ct.workingColorSpace),Ee=A.colorSpace===Oi?null:Ct.getPrimaries(A.colorSpace),Je=A.colorSpace===Oi||Ye===Ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);const Ge=A.isCompressedTexture||A.image[0].isCompressedTexture,me=A.image[0]&&A.image[0].isDataTexture,_e=[];for(let ue=0;ue<6;ue++)!Ge&&!me?_e[ue]=_(A.image[ue],!0,s.maxCubemapSize):_e[ue]=me?A.image[ue].image:A.image[ue],_e[ue]=Qe(A,_e[ue]);const tt=_e[0],et=r.convert(A.format,A.colorSpace),Be=r.convert(A.type),it=M(A.internalFormat,et,Be,A.colorSpace),G=A.isVideoTexture!==!0,Ne=re.__version===void 0||ce===!0,Le=fe.dataReady;let Ae=E(A,tt);I(n.TEXTURE_CUBE_MAP,A);let ve;if(Ge){G&&Ne&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ae,it,tt.width,tt.height);for(let ue=0;ue<6;ue++){ve=_e[ue].mipmaps;for(let We=0;We<ve.length;We++){const rt=ve[We];A.format!==Jn?et!==null?G?Le&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,rt.width,rt.height,et,rt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,it,rt.width,rt.height,0,rt.data):ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,rt.width,rt.height,et,Be,rt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,it,rt.width,rt.height,0,et,Be,rt.data)}}}else{if(ve=A.mipmaps,G&&Ne){ve.length>0&&Ae++;const ue=ct(_e[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ae,it,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(me){G?Le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,_e[ue].width,_e[ue].height,et,Be,_e[ue].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,it,_e[ue].width,_e[ue].height,0,et,Be,_e[ue].data);for(let We=0;We<ve.length;We++){const Dt=ve[We].image[ue].image;G?Le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,Dt.width,Dt.height,et,Be,Dt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,it,Dt.width,Dt.height,0,et,Be,Dt.data)}}else{G?Le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,et,Be,_e[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,it,et,Be,_e[ue]);for(let We=0;We<ve.length;We++){const rt=ve[We];G?Le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,et,Be,rt.image[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,it,et,Be,rt.image[ue])}}}g(A)&&d(n.TEXTURE_CUBE_MAP),re.__version=fe.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function xe(D,A,J,ce,fe,re){const Ye=r.convert(J.format,J.colorSpace),Ee=r.convert(J.type),Je=M(J.internalFormat,Ye,Ee,J.colorSpace),Ge=i.get(A),me=i.get(J);if(me.__renderTarget=A,!Ge.__hasExternalTextures){const _e=Math.max(1,A.width>>re),tt=Math.max(1,A.height>>re);fe===n.TEXTURE_3D||fe===n.TEXTURE_2D_ARRAY?t.texImage3D(fe,re,Je,_e,tt,A.depth,0,Ye,Ee,null):t.texImage2D(fe,re,Je,_e,tt,0,Ye,Ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ce,fe,me.__webglTexture,0,Pt(A)):(fe===n.TEXTURE_2D||fe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ce,fe,me.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function we(D,A,J){if(n.bindRenderbuffer(n.RENDERBUFFER,D),A.depthBuffer){const ce=A.depthTexture,fe=ce&&ce.isDepthTexture?ce.type:null,re=y(A.stencilBuffer,fe),Ye=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=Pt(A);qe(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ee,re,A.width,A.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee,re,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ye,n.RENDERBUFFER,D)}else{const ce=A.textures;for(let fe=0;fe<ce.length;fe++){const re=ce[fe],Ye=r.convert(re.format,re.colorSpace),Ee=r.convert(re.type),Je=M(re.internalFormat,Ye,Ee,re.colorSpace),Ge=Pt(A);J&&qe(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ge,Je,A.width,A.height):qe(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ge,Je,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Je,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ue(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=i.get(A.depthTexture);ce.__renderTarget=A,(!ce.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),ee(A.depthTexture,0);const fe=ce.__webglTexture,re=Pt(A);if(A.depthTexture.format===zr)qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0);else if(A.depthTexture.format===Or)qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function Ze(D){const A=i.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ce){const fe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ce.removeEventListener("dispose",fe)};ce.addEventListener("dispose",fe),A.__depthDisposeCallback=fe}A.__boundDepthTexture=ce}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Ue(A.__webglFramebuffer[0],D):Ue(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ce]),A.__webglDepthbuffer[ce]===void 0)A.__webglDepthbuffer[ce]=n.createRenderbuffer(),we(A.__webglDepthbuffer[ce],D,!1);else{const fe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer[ce];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,re)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),we(A.__webglDepthbuffer,D,!1);else{const fe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Lt(D,A,J){const ce=i.get(D);A!==void 0&&xe(ce.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&Ze(D)}function Ke(D){const A=D.texture,J=i.get(D),ce=i.get(A);D.addEventListener("dispose",R);const fe=D.textures,re=D.isWebGLCubeRenderTarget===!0,Ye=fe.length>1;if(Ye||(ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture()),ce.__version=A.version,a.memory.textures++),re){J.__webglFramebuffer=[];for(let Ee=0;Ee<6;Ee++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Ee]=[];for(let Je=0;Je<A.mipmaps.length;Je++)J.__webglFramebuffer[Ee][Je]=n.createFramebuffer()}else J.__webglFramebuffer[Ee]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ee=0;Ee<A.mipmaps.length;Ee++)J.__webglFramebuffer[Ee]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Ye)for(let Ee=0,Je=fe.length;Ee<Je;Ee++){const Ge=i.get(fe[Ee]);Ge.__webglTexture===void 0&&(Ge.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&qe(D)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ee=0;Ee<fe.length;Ee++){const Je=fe[Ee];J.__webglColorRenderbuffer[Ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Ee]);const Ge=r.convert(Je.format,Je.colorSpace),me=r.convert(Je.type),_e=M(Je.internalFormat,Ge,me,Je.colorSpace,D.isXRRenderTarget===!0),tt=Pt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,_e,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ee,n.RENDERBUFFER,J.__webglColorRenderbuffer[Ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),we(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ce.__webglTexture),I(n.TEXTURE_CUBE_MAP,A);for(let Ee=0;Ee<6;Ee++)if(A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)xe(J.__webglFramebuffer[Ee][Je],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Je);else xe(J.__webglFramebuffer[Ee],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0);g(A)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ye){for(let Ee=0,Je=fe.length;Ee<Je;Ee++){const Ge=fe[Ee],me=i.get(Ge);let _e=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(_e=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(_e,me.__webglTexture),I(_e,Ge),xe(J.__webglFramebuffer,D,Ge,n.COLOR_ATTACHMENT0+Ee,_e,0),g(Ge)&&d(_e)}t.unbindTexture()}else{let Ee=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ee=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ee,ce.__webglTexture),I(Ee,A),A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)xe(J.__webglFramebuffer[Je],D,A,n.COLOR_ATTACHMENT0,Ee,Je);else xe(J.__webglFramebuffer,D,A,n.COLOR_ATTACHMENT0,Ee,0);g(A)&&d(Ee),t.unbindTexture()}D.depthBuffer&&Ze(D)}function Rt(D){const A=D.textures;for(let J=0,ce=A.length;J<ce;J++){const fe=A[J];if(g(fe)){const re=v(D),Ye=i.get(fe).__webglTexture;t.bindTexture(re,Ye),d(re),t.unbindTexture()}}}const O=[],ft=[];function ut(D){if(D.samples>0){if(qe(D)===!1){const A=D.textures,J=D.width,ce=D.height;let fe=n.COLOR_BUFFER_BIT;const re=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ye=i.get(D),Ee=A.length>1;if(Ee)for(let Ge=0;Ge<A.length;Ge++)t.bindFramebuffer(n.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer);const Je=D.texture.mipmaps;Je&&Je.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let Ge=0;Ge<A.length;Ge++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(fe|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(fe|=n.STENCIL_BUFFER_BIT)),Ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ye.__webglColorRenderbuffer[Ge]);const me=i.get(A[Ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,me,0)}n.blitFramebuffer(0,0,J,ce,0,0,J,ce,fe,n.NEAREST),l===!0&&(O.length=0,ft.length=0,O.push(n.COLOR_ATTACHMENT0+Ge),D.depthBuffer&&D.resolveDepthBuffer===!1&&(O.push(re),ft.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ft)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,O))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ee)for(let Ge=0;Ge<A.length;Ge++){t.bindFramebuffer(n.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,Ye.__webglColorRenderbuffer[Ge]);const me=i.get(A[Ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,me,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const A=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Pt(D){return Math.min(s.maxSamples,D.samples)}function qe(D){const A=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ut(D){const A=a.render.frame;u.get(D)!==A&&(u.set(D,A),D.update())}function Qe(D,A){const J=D.colorSpace,ce=D.format,fe=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==Ys&&J!==Oi&&(Ct.getTransfer(J)===zt?(ce!==Jn||fe!==ui)&&ht("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Kt("WebGLTextures: Unsupported texture color space:",J)),A}function ct(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=F,this.setTexture2D=ee,this.setTexture2DArray=X,this.setTexture3D=Z,this.setTextureCube=ne,this.rebindTextures=Lt,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=qe}function O1(n,e){function t(i,s=Oi){let r;const a=Ct.getTransfer(s);if(i===ui)return n.UNSIGNED_BYTE;if(i===fc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===pc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ud)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Fd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Dd)return n.BYTE;if(i===Id)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===uc)return n.INT;if(i===ds)return n.UNSIGNED_INT;if(i===ai)return n.FLOAT;if(i===ci)return n.HALF_FLOAT;if(i===Nd)return n.ALPHA;if(i===zd)return n.RGB;if(i===Jn)return n.RGBA;if(i===zr)return n.DEPTH_COMPONENT;if(i===Or)return n.DEPTH_STENCIL;if(i===mc)return n.RED;if(i===xc)return n.RED_INTEGER;if(i===gc)return n.RG;if(i===vc)return n.RG_INTEGER;if(i===_c)return n.RGBA_INTEGER;if(i===Oa||i===Ba||i===ka||i===Va)if(a===zt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Oa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Oa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ba)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ka)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Va)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ml||i===yl||i===Sl||i===bl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===wl||i===Tl||i===El)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===wl||i===Tl)return a===zt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===El)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Al||i===Cl||i===Rl||i===Pl||i===Ll||i===Dl||i===Il||i===Ul||i===Fl||i===Nl||i===zl||i===Ol||i===Bl||i===kl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Al)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ll)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Dl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Il)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ul)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ol)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Bl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kl)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vl||i===Gl||i===Hl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Vl)return a===zt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wl||i===Xl||i===ql||i===Yl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Wl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Xl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ql)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Yl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Nr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const B1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,k1=`
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

}`;class V1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new jd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new dn({vertexShader:B1,fragmentShader:k1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new V(new Gt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class G1 extends er{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,m=null,p=null,x=null;const _=typeof XRWebGLBinding<"u",g=new V1,d={},v=t.getContextAttributes();let M=null,y=null;const E=[],T=[],R=new Te;let C=null;const w=new Rn;w.viewport=new kt;const S=new Rn;S.viewport=new kt;const L=[w,S],F=new ap;let W=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new Oo,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new Oo,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new Oo,E[$]=K),K.getHandSpace()};function ee($){const K=T.indexOf($.inputSource);if(K===-1)return;const xe=E[K];xe!==void 0&&(xe.update($.inputSource,$.frame,c||a),xe.dispatchEvent({type:$.type,data:$.inputSource}))}function X(){s.removeEventListener("select",ee),s.removeEventListener("selectstart",ee),s.removeEventListener("selectend",ee),s.removeEventListener("squeeze",ee),s.removeEventListener("squeezestart",ee),s.removeEventListener("squeezeend",ee),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}W=null,te=null,g.reset();for(const $ in d)delete d[$];e.setRenderTarget(M),p=null,m=null,f=null,s=null,y=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&ht("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&ht("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",ee),s.addEventListener("selectstart",ee),s.addEventListener("selectend",ee),s.addEventListener("squeeze",ee),s.addEventListener("squeezestart",ee),s.addEventListener("squeezeend",ee),s.addEventListener("end",X),s.addEventListener("inputsourceschange",Z),v.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,we=null,Ue=null;v.depth&&(Ue=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=v.stencil?Or:zr,we=v.stencil?Nr:ds);const Ze={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};f=this.getBinding(),m=f.createProjectionLayer(Ze),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),y=new Qn(m.textureWidth,m.textureHeight,{format:Jn,type:ui,depthTexture:new Jd(m.textureWidth,m.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const xe={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,xe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Qn(p.framebufferWidth,p.framebufferHeight,{format:Jn,type:ui,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),be.setContext(s),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z($){for(let K=0;K<$.removed.length;K++){const xe=$.removed[K],we=T.indexOf(xe);we>=0&&(T[we]=null,E[we].disconnect(xe))}for(let K=0;K<$.added.length;K++){const xe=$.added[K];let we=T.indexOf(xe);if(we===-1){for(let Ze=0;Ze<E.length;Ze++)if(Ze>=T.length){T.push(xe),we=Ze;break}else if(T[Ze]===null){T[Ze]=xe,we=Ze;break}if(we===-1)break}const Ue=E[we];Ue&&Ue.connect(xe)}}const ne=new P,de=new P;function pe($,K,xe){ne.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(xe.matrixWorld);const we=ne.distanceTo(de),Ue=K.projectionMatrix.elements,Ze=xe.projectionMatrix.elements,Lt=Ue[14]/(Ue[10]-1),Ke=Ue[14]/(Ue[10]+1),Rt=(Ue[9]+1)/Ue[5],O=(Ue[9]-1)/Ue[5],ft=(Ue[8]-1)/Ue[0],ut=(Ze[8]+1)/Ze[0],Pt=Lt*ft,qe=Lt*ut,Ut=we/(-ft+ut),Qe=Ut*-ft;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Qe),$.translateZ(Ut),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ue[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ct=Lt+Ut,D=Ke+Ut,A=Pt-Qe,J=qe+(we-Qe),ce=Rt*Ke/D*ct,fe=O*Ke/D*ct;$.projectionMatrix.makePerspective(A,J,ce,fe,ct,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ve($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,xe=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(xe=g.depthFar)),F.near=S.near=w.near=K,F.far=S.far=w.far=xe,(W!==F.near||te!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),W=F.near,te=F.far),F.layers.mask=$.layers.mask|6,w.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const we=$.parent,Ue=F.cameras;Ve(F,we);for(let Ze=0;Ze<Ue.length;Ze++)Ve(Ue[Ze],we);Ue.length===2?pe(F,w,S):F.projectionMatrix.copy(w.projectionMatrix),I($,F,we)};function I($,K,xe){xe===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(xe.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=kr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(m===null&&p===null))return l},this.setFoveation=function($){l=$,m!==null&&(m.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function($){return d[$]};let Se=null;function ge($,K){if(u=K.getViewerPose(c||a),x=K,u!==null){const xe=u.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let we=!1;xe.length!==F.cameras.length&&(F.cameras.length=0,we=!0);for(let Ke=0;Ke<xe.length;Ke++){const Rt=xe[Ke];let O=null;if(p!==null)O=p.getViewport(Rt);else{const ut=f.getViewSubImage(m,Rt);O=ut.viewport,Ke===0&&(e.setRenderTargetTextures(y,ut.colorTexture,ut.depthStencilTexture),e.setRenderTarget(y))}let ft=L[Ke];ft===void 0&&(ft=new Rn,ft.layers.enable(Ke),ft.viewport=new kt,L[Ke]=ft),ft.matrix.fromArray(Rt.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Rt.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(O.x,O.y,O.width,O.height),Ke===0&&(F.matrix.copy(ft.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),we===!0&&F.cameras.push(ft)}const Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=i.getBinding();const Ke=f.getDepthInformation(xe[0]);Ke&&Ke.isValid&&Ke.texture&&g.init(Ke,s.renderState)}if(Ue&&Ue.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let Ke=0;Ke<xe.length;Ke++){const Rt=xe[Ke].camera;if(Rt){let O=d[Rt];O||(O=new jd,d[Rt]=O);const ft=f.getCameraImage(Rt);O.sourceTexture=ft}}}}for(let xe=0;xe<E.length;xe++){const we=T[xe],Ue=E[xe];we!==null&&Ue!==void 0&&Ue.update(we,K,c||a)}Se&&Se($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const be=new cu;be.setAnimationLoop(ge),this.setAnimationLoop=function($){Se=$},this.dispose=function(){}}}const Ki=new ei,H1=new Tt;function W1(n,e){function t(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,Wd(n)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,v,M,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),f(g,d)):d.isMeshPhongMaterial?(r(g,d),u(g,d)):d.isMeshStandardMaterial?(r(g,d),m(g,d),d.isMeshPhysicalMaterial&&p(g,d,y)):d.isMeshMatcapMaterial?(r(g,d),x(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),_(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,v,M):d.isSpriteMaterial?c(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,t(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===gn&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,t(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===gn&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,t(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,t(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const v=e.get(d),M=v.envMap,y=v.envMapRotation;M&&(g.envMap.value=M,Ki.copy(y),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),g.envMapRotation.value.setFromMatrix4(H1.makeRotationFromEuler(Ki)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,v,M){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*v,g.scale.value=M*.5,d.map&&(g.map.value=d.map,t(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function f(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function m(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function p(g,d,v){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===gn&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,d){d.matcap&&(g.matcap.value=d.matcap)}function _(g,d){const v=e.get(d).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function X1(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){const y=M.program;i.uniformBlockBinding(v,y)}function c(v,M){let y=s[v.id];y===void 0&&(x(v),y=u(v),s[v.id]=y,v.addEventListener("dispose",g));const E=M.program;i.updateUBOMapping(v,E);const T=e.render.frame;r[v.id]!==T&&(m(v),r[v.id]=T)}function u(v){const M=f();v.__bindingPointIndex=M;const y=n.createBuffer(),E=v.__size,T=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,y),y}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Kt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(v){const M=s[v.id],y=v.uniforms,E=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let T=0,R=y.length;T<R;T++){const C=Array.isArray(y[T])?y[T]:[y[T]];for(let w=0,S=C.length;w<S;w++){const L=C[w];if(p(L,T,w,E)===!0){const F=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let te=0;for(let ee=0;ee<W.length;ee++){const X=W[ee],Z=_(X);typeof X=="number"||typeof X=="boolean"?(L.__data[0]=X,n.bufferSubData(n.UNIFORM_BUFFER,F+te,L.__data)):X.isMatrix3?(L.__data[0]=X.elements[0],L.__data[1]=X.elements[1],L.__data[2]=X.elements[2],L.__data[3]=0,L.__data[4]=X.elements[3],L.__data[5]=X.elements[4],L.__data[6]=X.elements[5],L.__data[7]=0,L.__data[8]=X.elements[6],L.__data[9]=X.elements[7],L.__data[10]=X.elements[8],L.__data[11]=0):(X.toArray(L.__data,te),te+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(v,M,y,E){const T=v.value,R=M+"_"+y;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const C=E[R];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[R]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function x(v){const M=v.uniforms;let y=0;const E=16;for(let R=0,C=M.length;R<C;R++){const w=Array.isArray(M[R])?M[R]:[M[R]];for(let S=0,L=w.length;S<L;S++){const F=w[S],W=Array.isArray(F.value)?F.value:[F.value];for(let te=0,ee=W.length;te<ee;te++){const X=W[te],Z=_(X),ne=y%E,de=ne%Z.boundary,pe=ne+de;y+=de,pe!==0&&E-pe<Z.storage&&(y+=E-pe),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Z.storage}}}const T=y%E;return T>0&&(y+=E-T),v.__size=y,v.__cache={},this}function _(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?ht("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ht("WebGLRenderer: Unsupported uniform value type.",v),M}function g(v){const M=v.target;M.removeEventListener("dispose",g);const y=a.indexOf(M.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function d(){for(const v in s)n.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const q1=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Mi=null;function Y1(){return Mi===null&&(Mi=new Kd(q1,32,32,gc,ci),Mi.minFilter=Vn,Mi.magFilter=Vn,Mi.wrapS=wi,Mi.wrapT=wi,Mi.generateMipmaps=!1,Mi.needsUpdate=!0),Mi}class $1{constructor(e={}){const{canvas:t=Rf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=new Set([_c,vc,xc]),_=new Set([ui,ds,Fr,Nr,fc,pc]),g=new Uint32Array(4),d=new Int32Array(4);let v=null,M=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let R=!1;this._outputColorSpace=wt;let C=0,w=0,S=null,L=-1,F=null;const W=new kt,te=new kt;let ee=null;const X=new nt(0);let Z=0,ne=t.width,de=t.height,pe=1,Ve=null,I=null;const Se=new kt(0,0,ne,de),ge=new kt(0,0,ne,de);let be=!1;const $=new Ec;let K=!1,xe=!1;const we=new Tt,Ue=new P,Ze=new kt,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function Rt(){return S===null?pe:1}let O=i;function ft(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${cc}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",We,!1),O===null){const U="webgl2";if(O=ft(U,b),O===null)throw ft(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw b("WebGLRenderer: "+b.message),b}let ut,Pt,qe,Ut,Qe,ct,D,A,J,ce,fe,re,Ye,Ee,Je,Ge,me,_e,tt,et,Be,it,G,Ne;function Le(){ut=new ng(O),ut.init(),it=new O1(O,ut),Pt=new Yx(O,ut,e,it),qe=new N1(O,ut),Pt.reversedDepthBuffer&&m&&qe.buffers.depth.setReversed(!0),Ut=new rg(O),Qe=new b1,ct=new z1(O,ut,qe,Qe,Pt,it,Ut),D=new Zx(T),A=new tg(T),J=new cp(O),G=new Xx(O,J),ce=new ig(O,J,Ut,G),fe=new og(O,ce,J,Ut),tt=new ag(O,Pt,ct),Ge=new $x(Qe),re=new S1(T,D,A,ut,Pt,G,Ge),Ye=new W1(T,Qe),Ee=new T1,Je=new L1(ut),_e=new Wx(T,D,A,qe,fe,p,l),me=new U1(T,fe,Pt),Ne=new X1(O,Ut,Pt,qe),et=new qx(O,ut,Ut),Be=new sg(O,ut,Ut),Ut.programs=re.programs,T.capabilities=Pt,T.extensions=ut,T.properties=Qe,T.renderLists=Ee,T.shadowMap=me,T.state=qe,T.info=Ut}Le();const Ae=new G1(T,O);this.xr=Ae,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const b=ut.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ut.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return pe},this.setPixelRatio=function(b){b!==void 0&&(pe=b,this.setSize(ne,de,!1))},this.getSize=function(b){return b.set(ne,de)},this.setSize=function(b,U,k=!0){if(Ae.isPresenting){ht("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=b,de=U,t.width=Math.floor(b*pe),t.height=Math.floor(U*pe),k===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(ne*pe,de*pe).floor()},this.setDrawingBufferSize=function(b,U,k){ne=b,de=U,pe=k,t.width=Math.floor(b*k),t.height=Math.floor(U*k),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(W)},this.getViewport=function(b){return b.copy(Se)},this.setViewport=function(b,U,k,H){b.isVector4?Se.set(b.x,b.y,b.z,b.w):Se.set(b,U,k,H),qe.viewport(W.copy(Se).multiplyScalar(pe).round())},this.getScissor=function(b){return b.copy(ge)},this.setScissor=function(b,U,k,H){b.isVector4?ge.set(b.x,b.y,b.z,b.w):ge.set(b,U,k,H),qe.scissor(te.copy(ge).multiplyScalar(pe).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(b){qe.setScissorTest(be=b)},this.setOpaqueSort=function(b){Ve=b},this.setTransparentSort=function(b){I=b},this.getClearColor=function(b){return b.copy(_e.getClearColor())},this.setClearColor=function(){_e.setClearColor(...arguments)},this.getClearAlpha=function(){return _e.getClearAlpha()},this.setClearAlpha=function(){_e.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,k=!0){let H=0;if(b){let B=!1;if(S!==null){const oe=S.texture.format;B=x.has(oe)}if(B){const oe=S.texture.type,ae=_.has(oe),j=_e.getClearColor(),he=_e.getClearAlpha(),Me=j.r,Fe=j.g,ye=j.b;ae?(g[0]=Me,g[1]=Fe,g[2]=ye,g[3]=he,O.clearBufferuiv(O.COLOR,0,g)):(d[0]=Me,d[1]=Fe,d[2]=ye,d[3]=he,O.clearBufferiv(O.COLOR,0,d))}else H|=O.COLOR_BUFFER_BIT}U&&(H|=O.DEPTH_BUFFER_BIT),k&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",We,!1),_e.dispose(),Ee.dispose(),Je.dispose(),Qe.dispose(),D.dispose(),A.dispose(),fe.dispose(),G.dispose(),Ne.dispose(),re.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",ea),Ae.removeEventListener("sessionend",rr),ti.stop()};function ve(b){b.preventDefault(),Za("WebGLRenderer: Context Lost."),R=!0}function ue(){Za("WebGLRenderer: Context Restored."),R=!1;const b=Ut.autoReset,U=me.enabled,k=me.autoUpdate,H=me.needsUpdate,B=me.type;Le(),Ut.autoReset=b,me.enabled=U,me.autoUpdate=k,me.needsUpdate=H,me.type=B}function We(b){Kt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function rt(b){const U=b.target;U.removeEventListener("dispose",rt),Dt(U)}function Dt(b){Et(b),Qe.remove(b)}function Et(b){const U=Qe.get(b).programs;U!==void 0&&(U.forEach(function(k){re.releaseProgram(k)}),b.isShaderMaterial&&re.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,k,H,B,oe){U===null&&(U=Lt);const ae=B.isMesh&&B.matrixWorld.determinant()<0,j=N(b,U,k,H,B);qe.setMaterial(H,ae);let he=k.index,Me=1;if(H.wireframe===!0){if(he=ce.getWireframeAttribute(k),he===void 0)return;Me=2}const Fe=k.drawRange,ye=k.attributes.position;let Ce=Fe.start*Me,at=(Fe.start+Fe.count)*Me;oe!==null&&(Ce=Math.max(Ce,oe.start*Me),at=Math.min(at,(oe.start+oe.count)*Me)),he!==null?(Ce=Math.max(Ce,0),at=Math.min(at,he.count)):ye!=null&&(Ce=Math.max(Ce,0),at=Math.min(at,ye.count));const mt=at-Ce;if(mt<0||mt===1/0)return;G.setup(B,H,j,k,he);let yt,xt=et;if(he!==null&&(yt=J.get(he),xt=Be,xt.setIndex(yt)),B.isMesh)H.wireframe===!0?(qe.setLineWidth(H.wireframeLinewidth*Rt()),xt.setMode(O.LINES)):xt.setMode(O.TRIANGLES);else if(B.isLine){let He=H.linewidth;He===void 0&&(He=1),qe.setLineWidth(He*Rt()),B.isLineSegments?xt.setMode(O.LINES):B.isLineLoop?xt.setMode(O.LINE_LOOP):xt.setMode(O.LINE_STRIP)}else B.isPoints?xt.setMode(O.POINTS):B.isSprite&&xt.setMode(O.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Br("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(ut.get("WEBGL_multi_draw"))xt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const He=B._multiDrawStarts,St=B._multiDrawCounts,lt=B._multiDrawCount,Xt=he?J.get(he).bytesPerElement:1,pi=Qe.get(H).currentProgram.getUniforms();for(let Yt=0;Yt<lt;Yt++)pi.setValue(O,"_gl_DrawID",Yt),xt.render(He[Yt]/Xt,St[Yt])}else if(B.isInstancedMesh)xt.renderInstances(Ce,mt,B.count);else if(k.isInstancedBufferGeometry){const He=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,St=Math.min(k.instanceCount,He);xt.renderInstances(Ce,mt,St)}else xt.render(Ce,mt)};function Mn(b,U,k){b.transparent===!0&&b.side===pt&&b.forceSinglePass===!1?(b.side=gn,b.needsUpdate=!0,tn(b,U,k),b.side=Gi,b.needsUpdate=!0,tn(b,U,k),b.side=pt):tn(b,U,k)}this.compile=function(b,U,k=null){k===null&&(k=b),M=Je.get(k),M.init(U),E.push(M),k.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(M.pushLight(B),B.castShadow&&M.pushShadow(B))}),b!==k&&b.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(M.pushLight(B),B.castShadow&&M.pushShadow(B))}),M.setupLights();const H=new Set;return b.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const j=oe[ae];Mn(j,k,B),H.add(j)}else Mn(oe,k,B),H.add(oe)}),M=E.pop(),H},this.compileAsync=function(b,U,k=null){const H=this.compile(b,U,k);return new Promise(B=>{function oe(){if(H.forEach(function(ae){Qe.get(ae).currentProgram.isReady()&&H.delete(ae)}),H.size===0){B(b);return}setTimeout(oe,10)}ut.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let fn=null;function Hn(b){fn&&fn(b)}function ea(){ti.stop()}function rr(){ti.start()}const ti=new cu;ti.setAnimationLoop(Hn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(b){fn=b,Ae.setAnimationLoop(b),b===null?ti.stop():ti.start()},Ae.addEventListener("sessionstart",ea),Ae.addEventListener("sessionend",rr),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Kt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(U),U=Ae.getCamera()),b.isScene===!0&&b.onBeforeRender(T,b,U,S),M=Je.get(b,E.length),M.init(U),E.push(M),we.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(we,oi,U.reversedDepth),xe=this.localClippingEnabled,K=Ge.init(this.clippingPlanes,xe),v=Ee.get(b,y.length),v.init(),y.push(v),Ae.enabled===!0&&Ae.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&ni(oe,U,-1/0,T.sortObjects)}ni(b,U,0,T.sortObjects),v.finish(),T.sortObjects===!0&&v.sort(Ve,I),Ke=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,Ke&&_e.addToRenderList(v,b),this.info.render.frame++,K===!0&&Ge.beginShadows();const k=M.state.shadowsArray;me.render(k,b,U),K===!0&&Ge.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=v.opaque,B=v.transmissive;if(M.setupLights(),U.isArrayCamera){const oe=U.cameras;if(B.length>0)for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];ar(H,B,b,he)}Ke&&_e.render(b);for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];ii(v,b,he,he.viewport)}}else B.length>0&&ar(H,B,b,U),Ke&&_e.render(b),ii(v,b,U);S!==null&&w===0&&(ct.updateMultisampleRenderTarget(S),ct.updateRenderTargetMipmap(S)),b.isScene===!0&&b.onAfterRender(T,b,U),G.resetDefaultState(),L=-1,F=null,E.pop(),E.length>0?(M=E[E.length-1],K===!0&&Ge.setGlobalState(T.clippingPlanes,M.state.camera)):M=null,y.pop(),y.length>0?v=y[y.length-1]:v=null};function ni(b,U,k,H){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)k=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)M.pushLight(b),b.castShadow&&M.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||$.intersectsSprite(b)){H&&Ze.setFromMatrixPosition(b.matrixWorld).applyMatrix4(we);const ae=fe.update(b),j=b.material;j.visible&&v.push(b,ae,j,k,Ze.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||$.intersectsObject(b))){const ae=fe.update(b),j=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ze.copy(b.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Ze.copy(ae.boundingSphere.center)),Ze.applyMatrix4(b.matrixWorld).applyMatrix4(we)),Array.isArray(j)){const he=ae.groups;for(let Me=0,Fe=he.length;Me<Fe;Me++){const ye=he[Me],Ce=j[ye.materialIndex];Ce&&Ce.visible&&v.push(b,ae,Ce,k,Ze.z,ye)}}else j.visible&&v.push(b,ae,j,k,Ze.z,null)}}const oe=b.children;for(let ae=0,j=oe.length;ae<j;ae++)ni(oe[ae],U,k,H)}function ii(b,U,k,H){const{opaque:B,transmissive:oe,transparent:ae}=b;M.setupLightsView(k),K===!0&&Ge.setGlobalState(T.clippingPlanes,k),H&&qe.viewport(W.copy(H)),B.length>0&&xs(B,U,k),oe.length>0&&xs(oe,U,k),ae.length>0&&xs(ae,U,k),qe.buffers.depth.setTest(!0),qe.buffers.depth.setMask(!0),qe.buffers.color.setMask(!0),qe.setPolygonOffset(!1)}function ar(b,U,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;M.state.transmissionRenderTarget[H.id]===void 0&&(M.state.transmissionRenderTarget[H.id]=new Qn(1,1,{generateMipmaps:!0,type:ut.has("EXT_color_buffer_half_float")||ut.has("EXT_color_buffer_float")?ci:ui,minFilter:is,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const oe=M.state.transmissionRenderTarget[H.id],ae=H.viewport||W;oe.setSize(ae.z*T.transmissionResolutionScale,ae.w*T.transmissionResolutionScale);const j=T.getRenderTarget(),he=T.getActiveCubeFace(),Me=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(X),Z=T.getClearAlpha(),Z<1&&T.setClearColor(16777215,.5),T.clear(),Ke&&_e.render(k);const Fe=T.toneMapping;T.toneMapping=Vi;const ye=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),M.setupLightsView(H),K===!0&&Ge.setGlobalState(T.clippingPlanes,H),xs(b,k,H),ct.updateMultisampleRenderTarget(oe),ct.updateRenderTargetMipmap(oe),ut.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let at=0,mt=U.length;at<mt;at++){const yt=U[at],{object:xt,geometry:He,material:St,group:lt}=yt;if(St.side===pt&&xt.layers.test(H.layers)){const Xt=St.side;St.side=gn,St.needsUpdate=!0,ta(xt,k,H,He,St,lt),St.side=Xt,St.needsUpdate=!0,Ce=!0}}Ce===!0&&(ct.updateMultisampleRenderTarget(oe),ct.updateRenderTargetMipmap(oe))}T.setRenderTarget(j,he,Me),T.setClearColor(X,Z),ye!==void 0&&(H.viewport=ye),T.toneMapping=Fe}function xs(b,U,k){const H=U.isScene===!0?U.overrideMaterial:null;for(let B=0,oe=b.length;B<oe;B++){const ae=b[B],{object:j,geometry:he,group:Me}=ae;let Fe=ae.material;Fe.allowOverride===!0&&H!==null&&(Fe=H),j.layers.test(k.layers)&&ta(j,U,k,he,Fe,Me)}}function ta(b,U,k,H,B,oe){b.onBeforeRender(T,U,k,H,B,oe),b.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),B.onBeforeRender(T,U,k,H,b,oe),B.transparent===!0&&B.side===pt&&B.forceSinglePass===!1?(B.side=gn,B.needsUpdate=!0,T.renderBufferDirect(k,U,H,B,b,oe),B.side=Gi,B.needsUpdate=!0,T.renderBufferDirect(k,U,H,B,b,oe),B.side=pt):T.renderBufferDirect(k,U,H,B,b,oe),b.onAfterRender(T,U,k,H,B,oe)}function tn(b,U,k){U.isScene!==!0&&(U=Lt);const H=Qe.get(b),B=M.state.lights,oe=M.state.shadowsArray,ae=B.state.version,j=re.getParameters(b,B.state,oe,U,k),he=re.getProgramCacheKey(j);let Me=H.programs;H.environment=b.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(b.isMeshStandardMaterial?A:D).get(b.envMap||H.environment),H.envMapRotation=H.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Me===void 0&&(b.addEventListener("dispose",rt),Me=new Map,H.programs=Me);let Fe=Me.get(he);if(Fe!==void 0){if(H.currentProgram===Fe&&H.lightsStateVersion===ae)return or(b,j),Fe}else j.uniforms=re.getUniforms(b),b.onBeforeCompile(j,T),Fe=re.acquireProgram(j,he),Me.set(he,Fe),H.uniforms=j.uniforms;const ye=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(ye.clippingPlanes=Ge.uniform),or(b,j),H.needsLights=q(b),H.lightsStateVersion=ae,H.needsLights&&(ye.ambientLightColor.value=B.state.ambient,ye.lightProbe.value=B.state.probe,ye.directionalLights.value=B.state.directional,ye.directionalLightShadows.value=B.state.directionalShadow,ye.spotLights.value=B.state.spot,ye.spotLightShadows.value=B.state.spotShadow,ye.rectAreaLights.value=B.state.rectArea,ye.ltc_1.value=B.state.rectAreaLTC1,ye.ltc_2.value=B.state.rectAreaLTC2,ye.pointLights.value=B.state.point,ye.pointLightShadows.value=B.state.pointShadow,ye.hemisphereLights.value=B.state.hemi,ye.directionalShadowMap.value=B.state.directionalShadowMap,ye.directionalShadowMatrix.value=B.state.directionalShadowMatrix,ye.spotShadowMap.value=B.state.spotShadowMap,ye.spotLightMatrix.value=B.state.spotLightMatrix,ye.spotLightMap.value=B.state.spotLightMap,ye.pointShadowMap.value=B.state.pointShadowMap,ye.pointShadowMatrix.value=B.state.pointShadowMatrix),H.currentProgram=Fe,H.uniformsList=null,Fe}function na(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=Ga.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function or(b,U){const k=Qe.get(b);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function N(b,U,k,H,B){U.isScene!==!0&&(U=Lt),ct.resetTextureUnits();const oe=U.fog,ae=H.isMeshStandardMaterial?U.environment:null,j=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Ys,he=(H.isMeshStandardMaterial?A:D).get(H.envMap||ae),Me=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Fe=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),ye=!!k.morphAttributes.position,Ce=!!k.morphAttributes.normal,at=!!k.morphAttributes.color;let mt=Vi;H.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(mt=T.toneMapping);const yt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,xt=yt!==void 0?yt.length:0,He=Qe.get(H),St=M.state.lights;if(K===!0&&(xe===!0||b!==F)){const yn=b===F&&H.id===L;Ge.setState(H,b,yn)}let lt=!1;H.version===He.__version?(He.needsLights&&He.lightsStateVersion!==St.state.version||He.outputColorSpace!==j||B.isBatchedMesh&&He.batching===!1||!B.isBatchedMesh&&He.batching===!0||B.isBatchedMesh&&He.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&He.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&He.instancing===!1||!B.isInstancedMesh&&He.instancing===!0||B.isSkinnedMesh&&He.skinning===!1||!B.isSkinnedMesh&&He.skinning===!0||B.isInstancedMesh&&He.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&He.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&He.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&He.instancingMorph===!1&&B.morphTexture!==null||He.envMap!==he||H.fog===!0&&He.fog!==oe||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==Ge.numPlanes||He.numIntersection!==Ge.numIntersection)||He.vertexAlphas!==Me||He.vertexTangents!==Fe||He.morphTargets!==ye||He.morphNormals!==Ce||He.morphColors!==at||He.toneMapping!==mt||He.morphTargetsCount!==xt)&&(lt=!0):(lt=!0,He.__version=H.version);let Xt=He.currentProgram;lt===!0&&(Xt=tn(H,U,B));let pi=!1,Yt=!1,Un=!1;const Ft=Xt.getUniforms(),nn=He.uniforms;if(qe.useProgram(Xt.program)&&(pi=!0,Yt=!0,Un=!0),H.id!==L&&(L=H.id,Yt=!0),pi||F!==b){qe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Ft.setValue(O,"projectionMatrix",b.projectionMatrix),Ft.setValue(O,"viewMatrix",b.matrixWorldInverse);const Tn=Ft.map.cameraPosition;Tn!==void 0&&Tn.setValue(O,Ue.setFromMatrixPosition(b.matrixWorld)),Pt.logarithmicDepthBuffer&&Ft.setValue(O,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Ft.setValue(O,"isOrthographic",b.isOrthographicCamera===!0),F!==b&&(F=b,Yt=!0,Un=!0)}if(B.isSkinnedMesh){Ft.setOptional(O,B,"bindMatrix"),Ft.setOptional(O,B,"bindMatrixInverse");const yn=B.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),Ft.setValue(O,"boneTexture",yn.boneTexture,ct))}B.isBatchedMesh&&(Ft.setOptional(O,B,"batchingTexture"),Ft.setValue(O,"batchingTexture",B._matricesTexture,ct),Ft.setOptional(O,B,"batchingIdTexture"),Ft.setValue(O,"batchingIdTexture",B._indirectTexture,ct),Ft.setOptional(O,B,"batchingColorTexture"),B._colorsTexture!==null&&Ft.setValue(O,"batchingColorTexture",B._colorsTexture,ct));const Fn=k.morphAttributes;if((Fn.position!==void 0||Fn.normal!==void 0||Fn.color!==void 0)&&tt.update(B,k,Xt),(Yt||He.receiveShadow!==B.receiveShadow)&&(He.receiveShadow=B.receiveShadow,Ft.setValue(O,"receiveShadow",B.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(nn.envMap.value=he,nn.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(nn.envMapIntensity.value=U.environmentIntensity),nn.dfgLUT!==void 0&&(nn.dfgLUT.value=Y1()),Yt&&(Ft.setValue(O,"toneMappingExposure",T.toneMappingExposure),He.needsLights&&z(nn,Un),oe&&H.fog===!0&&Ye.refreshFogUniforms(nn,oe),Ye.refreshMaterialUniforms(nn,H,pe,de,M.state.transmissionRenderTarget[b.id]),Ga.upload(O,na(He),nn,ct)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ga.upload(O,na(He),nn,ct),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Ft.setValue(O,"center",B.center),Ft.setValue(O,"modelViewMatrix",B.modelViewMatrix),Ft.setValue(O,"normalMatrix",B.normalMatrix),Ft.setValue(O,"modelMatrix",B.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const yn=H.uniformsGroups;for(let Tn=0,xo=yn.length;Tn<xo;Tn++){const Wi=yn[Tn];Ne.update(Wi,Xt),Ne.bind(Wi,Xt)}}return Xt}function z(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function q(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(b,U,k){const H=Qe.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Qe.get(b.texture).__webglTexture=U,Qe.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const k=Qe.get(b);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const Q=O.createFramebuffer();this.setRenderTarget=function(b,U=0,k=0){S=b,C=U,w=k;let H=!0,B=null,oe=!1,ae=!1;if(b){const he=Qe.get(b);if(he.__useDefaultFramebuffer!==void 0)qe.bindFramebuffer(O.FRAMEBUFFER,null),H=!1;else if(he.__webglFramebuffer===void 0)ct.setupRenderTarget(b);else if(he.__hasExternalTextures)ct.rebindTextures(b,Qe.get(b.texture).__webglTexture,Qe.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const ye=b.depthTexture;if(he.__boundDepthTexture!==ye){if(ye!==null&&Qe.has(ye)&&(b.width!==ye.image.width||b.height!==ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ct.setupDepthRenderbuffer(b)}}const Me=b.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(ae=!0);const Fe=Qe.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Fe[U])?B=Fe[U][k]:B=Fe[U],oe=!0):b.samples>0&&ct.useMultisampledRTT(b)===!1?B=Qe.get(b).__webglMultisampledFramebuffer:Array.isArray(Fe)?B=Fe[k]:B=Fe,W.copy(b.viewport),te.copy(b.scissor),ee=b.scissorTest}else W.copy(Se).multiplyScalar(pe).floor(),te.copy(ge).multiplyScalar(pe).floor(),ee=be;if(k!==0&&(B=Q),qe.bindFramebuffer(O.FRAMEBUFFER,B)&&H&&qe.drawBuffers(b,B),qe.viewport(W),qe.scissor(te),qe.setScissorTest(ee),oe){const he=Qe.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,he.__webglTexture,k)}else if(ae){const he=U;for(let Me=0;Me<b.textures.length;Me++){const Fe=Qe.get(b.textures[Me]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Me,Fe.__webglTexture,k,he)}}else if(b!==null&&k!==0){const he=Qe.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,he.__webglTexture,k)}L=-1},this.readRenderTargetPixels=function(b,U,k,H,B,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=Qe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he){qe.bindFramebuffer(O.FRAMEBUFFER,he);try{const Me=b.textures[j],Fe=Me.format,ye=Me.type;if(!Pt.textureFormatReadable(Fe)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(ye)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-H&&k>=0&&k<=b.height-B&&(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+j),O.readPixels(U,k,H,B,it.convert(Fe),it.convert(ye),oe))}finally{const Me=S!==null?Qe.get(S).__webglFramebuffer:null;qe.bindFramebuffer(O.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(b,U,k,H,B,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=Qe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he)if(U>=0&&U<=b.width-H&&k>=0&&k<=b.height-B){qe.bindFramebuffer(O.FRAMEBUFFER,he);const Me=b.textures[j],Fe=Me.format,ye=Me.type;if(!Pt.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ce),O.bufferData(O.PIXEL_PACK_BUFFER,oe.byteLength,O.STREAM_READ),b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+j),O.readPixels(U,k,H,B,it.convert(Fe),it.convert(ye),0);const at=S!==null?Qe.get(S).__webglFramebuffer:null;qe.bindFramebuffer(O.FRAMEBUFFER,at);const mt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Pf(O,mt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ce),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,oe),O.deleteBuffer(Ce),O.deleteSync(mt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,k=0){const H=Math.pow(2,-k),B=Math.floor(b.image.width*H),oe=Math.floor(b.image.height*H),ae=U!==null?U.x:0,j=U!==null?U.y:0;ct.setTexture2D(b,0),O.copyTexSubImage2D(O.TEXTURE_2D,k,0,0,ae,j,B,oe),qe.unbindTexture()};const ie=O.createFramebuffer(),le=O.createFramebuffer();this.copyTextureToTexture=function(b,U,k=null,H=null,B=0,oe=null){oe===null&&(B!==0?(Br("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let ae,j,he,Me,Fe,ye,Ce,at,mt;const yt=b.isCompressedTexture?b.mipmaps[oe]:b.image;if(k!==null)ae=k.max.x-k.min.x,j=k.max.y-k.min.y,he=k.isBox3?k.max.z-k.min.z:1,Me=k.min.x,Fe=k.min.y,ye=k.isBox3?k.min.z:0;else{const Fn=Math.pow(2,-B);ae=Math.floor(yt.width*Fn),j=Math.floor(yt.height*Fn),b.isDataArrayTexture?he=yt.depth:b.isData3DTexture?he=Math.floor(yt.depth*Fn):he=1,Me=0,Fe=0,ye=0}H!==null?(Ce=H.x,at=H.y,mt=H.z):(Ce=0,at=0,mt=0);const xt=it.convert(U.format),He=it.convert(U.type);let St;U.isData3DTexture?(ct.setTexture3D(U,0),St=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ct.setTexture2DArray(U,0),St=O.TEXTURE_2D_ARRAY):(ct.setTexture2D(U,0),St=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const lt=O.getParameter(O.UNPACK_ROW_LENGTH),Xt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),pi=O.getParameter(O.UNPACK_SKIP_PIXELS),Yt=O.getParameter(O.UNPACK_SKIP_ROWS),Un=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,yt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,yt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Me),O.pixelStorei(O.UNPACK_SKIP_ROWS,Fe),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ye);const Ft=b.isDataArrayTexture||b.isData3DTexture,nn=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Fn=Qe.get(b),yn=Qe.get(U),Tn=Qe.get(Fn.__renderTarget),xo=Qe.get(yn.__renderTarget);qe.bindFramebuffer(O.READ_FRAMEBUFFER,Tn.__webglFramebuffer),qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,xo.__webglFramebuffer);for(let Wi=0;Wi<he;Wi++)Ft&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Qe.get(b).__webglTexture,B,ye+Wi),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Qe.get(U).__webglTexture,oe,mt+Wi)),O.blitFramebuffer(Me,Fe,ae,j,Ce,at,ae,j,O.DEPTH_BUFFER_BIT,O.NEAREST);qe.bindFramebuffer(O.READ_FRAMEBUFFER,null),qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(B!==0||b.isRenderTargetTexture||Qe.has(b)){const Fn=Qe.get(b),yn=Qe.get(U);qe.bindFramebuffer(O.READ_FRAMEBUFFER,ie),qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,le);for(let Tn=0;Tn<he;Tn++)Ft?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Fn.__webglTexture,B,ye+Tn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Fn.__webglTexture,B),nn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,yn.__webglTexture,oe,mt+Tn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,yn.__webglTexture,oe),B!==0?O.blitFramebuffer(Me,Fe,ae,j,Ce,at,ae,j,O.COLOR_BUFFER_BIT,O.NEAREST):nn?O.copyTexSubImage3D(St,oe,Ce,at,mt+Tn,Me,Fe,ae,j):O.copyTexSubImage2D(St,oe,Ce,at,Me,Fe,ae,j);qe.bindFramebuffer(O.READ_FRAMEBUFFER,null),qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else nn?b.isDataTexture||b.isData3DTexture?O.texSubImage3D(St,oe,Ce,at,mt,ae,j,he,xt,He,yt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(St,oe,Ce,at,mt,ae,j,he,xt,yt.data):O.texSubImage3D(St,oe,Ce,at,mt,ae,j,he,xt,He,yt):b.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,oe,Ce,at,ae,j,xt,He,yt.data):b.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,oe,Ce,at,yt.width,yt.height,xt,yt.data):O.texSubImage2D(O.TEXTURE_2D,oe,Ce,at,ae,j,xt,He,yt);O.pixelStorei(O.UNPACK_ROW_LENGTH,lt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Xt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,pi),O.pixelStorei(O.UNPACK_SKIP_ROWS,Yt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Un),oe===0&&U.generateMipmaps&&O.generateMipmap(St),qe.unbindTexture()},this.initRenderTarget=function(b){Qe.get(b).__webglFramebuffer===void 0&&ct.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ct.setTextureCube(b,0):b.isData3DTexture?ct.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ct.setTexture2DArray(b,0):ct.setTexture2D(b,0),qe.unbindTexture()},this.resetState=function(){C=0,w=0,S=null,qe.reset(),G.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}function sd(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,l=new Wt;let c=0;for(let u=0;u<n.length;++u){const f=n[u];let m=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in f.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(f.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in f.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(f.morphAttributes[p])}if(e){let p;if(t)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,u),c+=p}}if(t){let u=0;const f=[];for(let m=0;m<n.length;++m){const p=n[m].index;for(let x=0;x<p.count;++x)f.push(p.getX(x)+u);u+=n[m].attributes.position.count}l.setIndex(f)}for(const u in r){const f=rd(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(const u in a){const f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let m=0;m<f;++m){const p=[];for(let _=0;_<a[u].length;++_)p.push(a[u][_][m]);const x=rd(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(x)}}return l}function rd(n){let e,t,i,s=-1,r=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const a=new e(r),o=new Dn(a,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const f=l/t;for(let m=0,p=u.count;m<p;m++)for(let x=0;x<t;x++){const _=u.getComponent(m,x);o.setComponent(m+f,x,_)}}else a.set(u.array,l);l+=u.count*t}return s!==void 0&&(o.gpuType=s),o}class Z1 extends Yd{constructor(){super();const e=new De;e.deleteAttribute("uv");const t=new Y({side:gn}),i=new Y,s=new Ic(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new V(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new sn(e,i,6),o=new Ht;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new V(e,Ns(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new V(e,Ns(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const u=new V(e,Ns(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);const f=new V(e,Ns(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const m=new V(e,Ns(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new V(e,Ns(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ns(n){return new ep({color:0,emissive:16777215,emissiveIntensity:n})}const Ha={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ir{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const K1=new Uc(-1,1,1,-1,0,1);class J1 extends Wt{constructor(){super(),this.setAttribute("position",new Mt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Mt([0,2,0,0,2,0],2))}}const j1=new J1;class Fc{constructor(e){this._mesh=new V(j1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,K1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class pu extends ir{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof dn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Vr.clone(e.uniforms),this.material=new dn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Fc(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ad extends ir{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Q1 extends ir{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ev{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Te);this._width=i.width,this._height=i.height,t=new Qn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ci}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new pu(Ha),this.copyPass.material.blending=li,this.clock=new lu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ad!==void 0&&(a instanceof ad?i=!0:a instanceof Q1&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class tv extends ir{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new nt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Da={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class nv extends ir{constructor(){super(),this.uniforms=Vr.clone(Da.uniforms),this.material=new Q0({name:Da.name,uniforms:this.uniforms,vertexShader:Da.vertexShader,fragmentShader:Da.fragmentShader}),this._fsQuad=new Fc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ct.getTransfer(this._outputColorSpace)===zt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Td?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ed?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ad?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===dc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Rd?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Pd?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Cd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const iv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new nt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Js extends ir{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new nt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Qn(r,a,{type:ci}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new Qn(r,a,{type:ci});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const m=new Qn(r,a,{type:ci});m.texture.name="UnrealBloomPass.v"+u,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),a=Math.round(a/2)}const o=iv;this.highPassUniforms=Vr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new dn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Vr.clone(Ha.uniforms),this.blendMaterial=new dn({uniforms:this.copyUniforms,vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader,blending:Kn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new nt,this._oldClearAlpha=1,this._basic=new bt,this._fsQuad=new Fc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Js.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Js.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new dn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new dn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Js.BlurDirectionX=new Te(1,0);Js.BlurDirectionY=new Te(0,1);const Jr=document.querySelector("#game"),Zt=new $1({canvas:Jr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),Nc=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;Zt.setPixelRatio(Math.min(window.devicePixelRatio,Nc?1.5:2));Zt.setSize(window.innerWidth,window.innerHeight);Zt.shadowMap.enabled=!Nc;Zt.info.autoReset=!1;Zt.shadowMap.type=wd;Zt.outputColorSpace=wt;Zt.toneMapping=dc;Zt.toneMappingExposure=1.12;const je=new Yd;window.__steelRibbonScene=je;je.background=new nt(16764588);je.fog=new Tc(14719602,360,2150);const mu=new Ql(Zt);mu.compileEquirectangularShader();je.environment=mu.fromScene(new Z1,.04).texture;je.environmentIntensity=.58;const Re=new Rn(69,window.innerWidth/window.innerHeight,.08,1800);je.add(Re);const $e={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const At=new Set,Ie={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},sv=new lu,jt=new P(0,1,0),zc=new P,xu=new P,ho=new P,cn=new Ht,gu=.86,tc=1.2,rv=.78,Gn=.55,Nt={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},fs=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],vu=Math.max(...fs.map(n=>n.width));let ks=0,se=fs[0];const h={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};$e.best.textContent=`Best score ${h.best}`;let jn=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Ai(){const n=h.mode==="race"||h.mode==="paused"||h.mode==="result";document.body.classList.toggle("chase-mode",n&&jn==="chase"),document.body.classList.toggle("menu-mode",h.mode==="menu")}Ai();function av(){jn=jn==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",jn),Ai(),h.message=jn==="chase"?"Chase camera":"Cockpit camera",h.messageTimer=.9}const Ia=[];function Rr(n,e=!1){let t=Ia.find(s=>!s.busy);t||(Ia.length>=4?t=Ia[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Ia.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Xr(n=880,e=.16,t="triangle",i=.16){if(!Xe)return;const{ctx:s}=Xe,r=s.createOscillator(),a=s.createGain();r.type=t,r.frequency.setValueAtTime(n,s.currentTime),r.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),a.gain.setValueAtTime(i,s.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),r.connect(a).connect(Xe.master||s.destination),r.start(),r.stop(s.currentTime+e+.06)}function ov(n){const e=Pe.clamp(n,0,1);return e*e*(3-2*e)}function lv(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,r=i.start+i.carry,a=i.end+i.settle;e>=s&&e<=r?t+=i.rise*Pe.clamp((e-s)/(i.approach+i.carry),0,1):e>r&&e<=i.end?t+=i.rise:e>i.end&&e<=a&&(t+=i.rise*(1-ov((e-i.end)/i.settle)))}return t}function Oc(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,r=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,a=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:r,z:a,t:i,n:t}}function _u(n,e){const{t,n:i}=Oc(n,e),s=n.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of n.ramps){let o=i-a.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=lv(n,i),r}function Ua(n){const{x:e,z:t,n:i}=Oc(se,n),s=_u(se,i);return new P(e,s,t)}function dt(n){const e=(n%se.length+se.length)%se.length,t=Ua(e),i=Ua(e+2).sub(t).normalize(),s=zc.crossVectors(jt,i).normalize(),r=Ua(e-2).y,a=Ua(e+2).y,o=Math.atan2(a-r,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,c=se.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:l,gap:c}}function di(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function od(n){return Pe.clamp(n/(se.length*se.laps),0,1)}function Qo(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let r=i;r<=s;r++){const a=r*se.length+t;if(n<a&&e>=a)return!0}return!1}function cv(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)i.fillStyle=(o+a)%2?"#101318":"#f5f1df",i.fillRect(o*s,a*s,s,s);const r=new Qt(t);return r.colorSpace=wt,r.wrapS=_n,r.wrapT=_n,r.repeat.set(3,1),r}function hv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<n;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(n,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new Qt(e);return s.colorSpace=wt,s.wrapS=_n,s.wrapT=_n,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function dv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-n;r<n*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.65,n),t.stroke();const s=new Qt(e);return s.colorSpace=wt,s.wrapS=_n,s.wrapT=_n,s.repeat.set(18,18),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function uv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#263139"),i.addColorStop(.45,"#3a444a"),i.addColorStop(1,"#1b242c"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-n;r<n*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.32,n),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*n,o=Math.random()*n,l=10+Math.random()*56,c=t.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),c.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),c.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=c,t.beginPath(),t.ellipse(a,o,l,l*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*n,o=Math.random()*n;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,l=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*n,Math.random()*n,l,l)}const s=new Qt(e);return s.colorSpace=wt,s.wrapS=_n,s.wrapT=_n,s.repeat.set(9,16),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function fv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new Qt(e);return s.colorSpace=wt,s}function zs(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<n;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new Qt(i);return r.colorSpace=wt,r}function pv(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let l=0;l<1700;l++){const c=180+Math.random()*60;s.fillStyle=`rgba(${c}, ${c}, ${c-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const a=(l,c,u,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(l,c,u,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(l,c,u,f),s.lineWidth=2,s.beginPath(),s.moveTo(l+u*.5,c+2),s.lineTo(l+u*.5,c+f-2),s.moveTo(l+2,c+f*.52),s.lineTo(l+u-2,c+f*.52),s.stroke()};a(n*.12,e*.24,n*.19,e*.2),a(n*.68,e*.25,n*.2,e*.2),a(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new Qt(i);return o.colorSpace=wt,o.wrapS=_n,o.wrapT=_n,o.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),o}function mv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<n+20;r+=26){t.beginPath();for(let a=-10;a<n+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<n;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,n*.24,r-8,n*.58,r+7,n),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new Qt(e);return s.colorSpace=wt,s.wrapS=_n,s.wrapT=_n,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function xv(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let a=18;a<e;a+=24)i.beginPath(),i.moveTo(8,a),i.lineTo(n-8,a),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const r=new Qt(t);return r.colorSpace=wt,r}function ld(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=i?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),i&&r.rotate(-Math.PI/2),r.font=`900 ${i?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(n,0,0),r.restore();const l=new Qt(s);return l.colorSpace=wt,l}const Fi=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],Qa=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],Ni=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Mu(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new Qt(i);return a.colorSpace=wt,a.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),a}function el(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new Qt(t);return s.colorSpace=wt,s}function tl(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,n,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let l=18;l<e;l+=22){r.beginPath(),r.moveTo(0,l),r.lineTo(n,l),r.stroke();for(let c=Math.floor(l/22)%2*28;c<n;c+=56)r.beginPath(),r.moveTo(c,l-18),r.lineTo(c,l),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,n-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let l=58;l<n-48;l+=78)r.fillRect(l,e*.62,52,e*.19);r.fillStyle=i,r.fillRect(22,e*.49,n-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=i,r.shadowBlur=12,r.fillText("OPEN",n/2,e*.28,n*.76),r.shadowBlur=0;const o=new Qt(s);return o.colorSpace=wt,o.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),o}function gv(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let r=18;r<e;r+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,r,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,r+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let r=0;r<n;r+=64)i.beginPath(),i.moveTo(r,0),i.lineTo(r,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new Qt(t);return s.colorSpace=wt,s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function vv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,r=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const l=-Math.PI/8+o*Math.PI/4,c=i+Math.cos(l)*r,u=s+Math.sin(l)*r;o===0?t.moveTo(c,u):t.lineTo(c,u)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const a=new Qt(e);return a.colorSpace=wt,a}function Oe(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function ss(n,e,t,i){const s=t*.5,r=i*.5;let a=Oe(n,e);for(const o of[-s,0,s])for(const l of[-r,0,r])a=Math.min(a,Oe(n+o,e+l));return a}function uo(n,e,t=10){const{x0:i,x1:s,zNear:r,zFar:a,pitch:o,streetW:l}=Nt;if(n<i-l||n>s+l||e<a-l||e>r+l)return!1;const c=Math.abs((n-i+o/2)%o-o/2),u=Math.abs((r-e+o/2)%o-o/2);return Math.min(c,u)<l*.5+t}const ki={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function On(n,e,t,i,s=8){const{x0:r,x1:a,zNear:o,zFar:l,pitch:c,streetW:u}=Nt,f=t*.5,m=i*.5,p=u*.5+s;let x=null;const _=(g,d,v)=>{(!x||v>x.overlap)&&(x={axis:g,road:d,overlap:v})};for(let g=r;g<=a+1;g+=c){if(e+m<l-p||e-m>o+p)continue;const d=f+p-Math.abs(n-g);d>0&&_("x",Math.round(g),d)}for(let g=o;g>=l-1;g-=c){if(n+f<r-p||n-f>a+p)continue;const d=m+p-Math.abs(e-g);d>0&&_("z",Math.round(g),d)}return x}const js=[],yu=[];function Su(n=1){const e=new dn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return yu.push(e),e}function bu(n,e,t,i=t){js.push({x:n,z:e,rx:t,rz:i})}function _v(n,e){let t=0,i=null;for(const s of js){const r=(n-s.x)/s.rx,a=(e-s.z)/s.rz,o=r*r+a*a;if(o<1){const l=Math.pow(1-o,1.35);l>t&&(t=l,i=s)}}return{depth:t,pond:i}}const Pr=[],nl=[],wu=[];let eo=0;function Bn(n,e){return wu.push({obj:n,update:e}),n}function Tu(n){eo+=n;for(const e of wu)e.update(eo,n)}function fo(){if(nl.length===0)for(let n=0;n<fs.length;n++){const e=fs[n];for(let t=0;t<e.length;t+=14){const i=Oc(e,t);nl.push({x:i.x,y:_u(e,t),z:i.z,s:t,courseIndex:n})}}return nl}function Cn(n,e,t=0){let i=null,s=1/0;for(const r of fo()){const a=n-r.x,o=e-r.z,l=Math.hypot(a,o);l<s&&(s=l,i=r)}return{clearance:s-t-vu*.58,distance:s,nearestS:i?.s??0}}function Qi(n,e,t,i,s,r=9){const a=t*.5,o=i*.5,l=vu*.62+r;let c=null;for(const u of fo()){const f=Math.max(Math.abs(u.x-n)-a,0),m=Math.max(Math.abs(u.z-e)-o,0),p=Math.hypot(f,m)-l;if(p>0)continue;const x=u.y-2.8,_=s-x;_<=0||(!c||_-p>c.score)&&(c={courseIndex:u.courseIndex,s:u.s,x:u.x,z:u.z,trackY:u.y,horizontalClearance:p,verticalIntrusion:_,score:_-p})}return c}function Yn(n,e,t,i=96){for(let s=0;s<i;s++){const r=n(s);if(Cn(r.x,r.z,e).clearance>=t&&!On(r.x,r.z,e*2,e*2,2))return r}return null}function $n(n,e,t,i,s){const r=Cn(e,t,i);Pr.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Mv(){const n=[...Pr].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Pr.length,unsafe:Pr.filter(e=>e.clearance<e.margin),closest:n}}function wn(n,e,t,i,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new V(new ot(i,i,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(jt,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}function yv(){const n=new ip(16757626,3097190,.66);je.add(n);const e=new Yo(7179775,.6);e.position.set(260,145,-260),je.add(e);const t=new Yo(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,je.add(t);const i=new Yo(16742973,.5);i.position.set(-180,35,280),je.add(i);const s=new Ic(5556479,90,900,2);s.position.set(0,88,-920),je.add(s)}let zi=null;function Sv(){const n=document.createElement("canvas");n.width=32,n.height=512;const e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,n.height);t.addColorStop(0,"#141c3f"),t.addColorStop(.3,"#31437c"),t.addColorStop(.52,"#75689a"),t.addColorStop(.72,"#d1755a"),t.addColorStop(.86,"#f7ac68"),t.addColorStop(1,"#ffd9a4"),e.fillStyle=t,e.fillRect(0,0,n.width,n.height);const i=new Qt(n);i.colorSpace=wt,zi=new V(new qt(1200,40,24),new bt({map:i,side:gn,depthWrite:!1,fog:!1})),zi.renderOrder=-100,zi.frustumCulled=!1,je.add(zi);const s=new P(-310,150,230).normalize(),r=new bt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),a=new V(new un(46,48),r);a.position.copy(s).multiplyScalar(1085),a.lookAt(0,0,0),zi.add(a);const o=new bt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:Kn});for(const[l,c]of[[120,.2],[250,.085],[520,.035]]){const u=new V(new un(l,48),o.clone());u.material.opacity=c,u.position.copy(s).multiplyScalar(1060),u.lookAt(0,0,0),zi.add(u)}}function bv(){const n=new Y({map:dv(),color:8231526,roughness:.98,metalness:.02}),e=new V(new Gt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let x=0;x<t.count;x++){const _=t.getX(x),g=t.getY(x);t.setZ(x,Oe(_,-g)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),je.add(e);const i=new Y({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:pt});for(let x=0;x<3;x++){const _=150-x*190,g=-760-x*420,d=980,v=64+x*18,M=new V(new Gt(980,64+x*18,1,1),i.clone());M.rotation.x=-Math.PI/2,M.rotation.z=-.34+x*.03,M.position.set(_,ss(_,g,d,v)-.55,g),M.renderOrder=-4,je.add(M)}const s=[new Y({color:4352578,roughness:1}),new Y({color:6910014,roughness:1}),new Y({color:3562320,roughness:1})];for(let x=0;x<46;x++){const _=new V(new un(28+Math.random()*90,9),s[x%s.length]);_.rotation.x=-Math.PI/2,_.rotation.z=Math.random()*Math.PI,_.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),_.scale.y=.32+Math.random()*.5,_.receiveShadow=!0,je.add(_)}const r=new bt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let x=0;x<32;x++){const _=new V(new un(70+Math.random()*150,22),r.clone());_.material.opacity=.008+Math.random()*.014,_.rotation.x=-Math.PI/2,_.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),_.position.y<8&&ki.lowFogDisks++,_.scale.y=.22+Math.random()*.26,_.renderOrder=-6,je.add(_)}const a=[new Y({color:5991785,roughness:1}),new Y({color:7633254,roughness:1}),new Y({color:4874865,roughness:1})],o=new Y({color:15068905,roughness:.95});for(let x=0;x<52;x++){const _=78+Math.random()*180,g=52+Math.random()*115,d=Yn(M=>{const y=x/52*Math.PI*2+M*1.77,E=1380+Math.random()*820+M*18;return{x:Math.cos(y)*E,z:Math.sin(y)*E-1180}},g,480);if(!d)continue;const v=new V(new ls(g,_,5+Math.floor(Math.random()*2)),a[x%a.length]);if(v.position.set(d.x,-9,d.z),v.rotation.y=Math.random()*Math.PI,v.castShadow=!0,v.receiveShadow=!0,je.add(v),$n("mountain",d.x,d.z,g,480),_>160){const M=new V(new ls(g*.34,_*.22,5),o);M.position.copy(v.position).add(new P(0,_*.39,0)),M.rotation.y=v.rotation.y,je.add(M)}}const l=new Y({color:4926748,roughness:.9}),c=[new Y({color:2055221,roughness:.92}),new Y({color:3109954,roughness:.95}),new Y({color:1589042,roughness:.9})];for(let x=0;x<185;x++){const _=.58+Math.random()*1.05,g=8*_,d=Yn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),g,145,40);if(!d)continue;const{x:v,z:M}=d;if(uo(v,M,18))continue;const y=Oe(v,M)+.8,E=new st,T=2.2+Math.random()*3.8,R=new V(new ot(.28,.42,T,6),l);R.position.y=T/2,E.add(R);const C=2+Math.floor(Math.random()*3);for(let w=0;w<C;w++){const S=new V(new ls(2.2+Math.random()*1.7-w*.22,4.8+Math.random()*2.6,7),c[(x+w)%c.length]);S.position.y=T+w*1.45+1.6,S.rotation.y=Math.random()*Math.PI,E.add(S)}E.position.set(v,y,M),E.scale.setScalar(_),je.add(E),$n("tree",v,M,g,145)}const u=new Y({color:16767433,roughness:.75,transparent:!0,opacity:.88,emissive:16747088,emissiveIntensity:.16});for(let x=0;x<38;x++){const _=new st,g=4+Math.floor(Math.random()*5);for(let d=0;d<g;d++){const v=new V(new qt(12+Math.random()*18,14,8),u);v.position.set(d*18-g*9,Math.random()*8,Math.random()*12),v.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),_.add(v)}_.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),je.add(_)}const f=[new Y({color:6186600,roughness:.68,metalness:.2}),new Y({color:7829101,roughness:.72,metalness:.18}),new Y({color:4544612,roughness:.62,metalness:.24})],m=new Y({color:2962232,roughness:.65,metalness:.35});for(let x=0;x<44;x++){const _=new st,g=20+Math.random()*95,d=8+Math.random()*18,v=8+Math.random()*18,M=new V(new De(d,g,v),f[x%f.length]);M.position.y=g/2,M.castShadow=!0,M.receiveShadow=!0,_.add(M);const y=zs(160,320,.28+Math.random()*.36),E=new Y({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const w of[-1,1]){const S=new V(new Gt(d*.82,g*.74),E);S.position.set(0,g*.53,w*(v/2+.08)),S.rotation.y=w<0?Math.PI:0,_.add(S)}const T=new V(new De(d*1.08,1.2,v*1.08),m);if(T.position.y=g+.7,_.add(T),Math.random()<.32){const w=new V(new ot(.18,.3,10+Math.random()*12,8),m);w.position.y=g+6.5,_.add(w)}const R=Math.hypot(d,v)*.65,C=Yn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),R,240,60);C&&(_.position.set(C.x,ss(C.x,C.z,d,v)-.7,C.z),_.rotation.y=Math.random()*Math.PI,je.add(_),$n("building",C.x,C.z,R,240))}const p=new Y({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let x=0;x<18;x++){const _=new st,g=Fi[x%Fi.length],d=Qa[(x*3+1)%Qa.length],v=Ni[x%Ni.length],M=new Y({map:Mu(g,d,v),color:16777215,roughness:.22,metalness:.04,emissive:new nt(v),emissiveIntensity:.28}),y=22+Math.random()*18,E=8+Math.random()*4,T=new V(new De(y,E,.5),M);T.position.y=10,_.add(T);const R=new V(new De(y+1.2,.32,.75),p);R.position.y=10+E*.5+.25,_.add(R);for(const w of[-7,7]){const S=new V(new ot(.24,.32,10,8),p);S.position.set(w,5,-.2),_.add(S)}const C=Yn(()=>({x:-780+Math.random()*1560,z:-450-x*135+Math.random()*80-40}),22,175,50);C&&(_.position.set(C.x,Oe(C.x,C.z)+.5,C.z),_.rotation.y=-.35+Math.random()*.7,je.add(_),$n("billboard",C.x,C.z,22,175),es("roadside-billboard",C.x,_.position.y+10,C.z))}}function wv(){for(let d=0;d<3;d++){const v=[4012638,5326704,7035525][d],M=new bt({color:v,transparent:!0,opacity:.6-d*.14,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Gt(E,360,y,1),R=T.attributes.position;for(let w=0;w<=y;w++){const S=w/y,L=(Math.sin(S*22+d*3)*.5+Math.sin(S*9+d)*.5)*70+120;R.setY(w,L),R.setY(w+y+1,-180)}R.needsUpdate=!0;const C=new V(T,M);C.position.set(0,40,-2300-d*360),je.add(C)}const n=new Y({color:5583649,roughness:.9}),e=[new Y({color:3837754,roughness:.9}),new Y({color:7319100,roughness:.92}),new Y({color:13075258,roughness:.9}),new Y({color:15182276,roughness:.88})];for(let d=0;d<48;d++){const v=.7+Math.random()*1.2,M=9*v,y=Yn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),M,150,36);if(!y)continue;const{x:E,z:T}=y;if(uo(E,T,18))continue;const R=Oe(E,T)+.6,C=new st,w=2.6+Math.random()*3.4,S=new V(new ot(.34,.5,w,6),n);S.position.y=w/2,C.add(S);const L=e[Math.floor(Math.random()*e.length)],F=3+Math.floor(Math.random()*3);for(let W=0;W<F;W++){const te=2.4+Math.random()*1.8,ee=new V(new qt(te,9,7),L);ee.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),ee.scale.y=.82+Math.random()*.3,C.add(ee)}C.position.set(E,R,T),C.scale.setScalar(v),je.add(C),$n("tree",E,T,M,150)}const t=[new Y({color:7762025,roughness:1,flatShading:!0,side:pt}),new Y({color:9077368,roughness:1,flatShading:!0,side:pt}),new Y({color:6249043,roughness:1,flatShading:!0,side:pt})];for(let d=0;d<70;d++){const v=2+Math.random()*7,M=Yn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),v,70,30);if(!M)continue;const{x:y,z:E}=M,T=new V(new Lc(v,0),t[d%t.length]),R=T.geometry.attributes.position;for(let C=0;C<R.count;C++)R.setXYZ(C,R.getX(C)*(.8+Math.random()*.4),R.getY(C)*(.6+Math.random()*.4),R.getZ(C)*(.8+Math.random()*.4));R.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,Oe(y,E)+v*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,je.add(T),Si.push({kind:"rock",x:y,z:E,radius:v*1.12}),$n("rock",y,E,v,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let d=0;d<14;d++){const v=130+Math.random()*200,M=130+Math.random()*200,y=Yn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(v,M)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,R=new st,C=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let S=0;S<C;S++){const L=new Y({color:S%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),F=new V(new Gt(v,M/C),L);F.rotation.x=-Math.PI/2,F.position.set(0,.05,-M/2+(S+.5)*(M/C)),R.add(F)}R.position.set(E,Oe(E,T)+.05,T),R.rotation.y=Math.random()*Math.PI,je.add(R),$n("field",E,T,Math.max(v,M)*.5,40)}{const d=Yn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(d){const v=new V(new un(150,48),Su(9));v.rotation.x=-Math.PI/2,v.position.set(d.x,ss(d.x,d.z,450,300)+.08,d.z),v.scale.set(1.5,1,1),v.renderOrder=-4,je.add(v),bu(d.x,d.z,222,148),ki.waterBlockers++,$n("lake",d.x,d.z,170,60)}}const s=new Y({color:15922422,roughness:.5,metalness:.2});for(let d=0;d<9;d++){const v=d/9*Math.PI*2+.6,M=1500+Math.random()*700,y=Math.cos(v)*M,E=Math.sin(v)*M-1150,T=60+Math.random()*40,R=new st,C=new V(new ot(1.1,2.2,T,10),s);C.position.y=T/2,R.add(C);const w=new st;w.position.set(0,T,3);const S=new V(new De(3,3,7),s);w.add(S);const L=new st;L.position.z=3.5;for(let W=0;W<3;W++){const te=new V(new De(1.1,26,.5),s);te.position.y=13;const ee=new st;ee.add(te),ee.rotation.z=W/3*Math.PI*2,L.add(ee)}w.add(L),R.add(w),R.position.set(y,-8,E),R.rotation.y=Math.random()*Math.PI,je.add(R);const F=.5+Math.random()*.5;Bn(L,W=>{L.rotation.z=W*F})}const r=new Y({color:7041398,roughness:.6,metalness:.4}),a=new Zl({color:2764595,transparent:!0,opacity:.5});let o=null;for(let d=0;d<7;d++){const v=-1100+d*360,M=-1650-Math.sin(d*.7)*120,y=48,E=new st,T=6;for(const C of[-1,1])for(const w of[-1,1]){const S=new V(new ot(.4,.7,y,5),r);S.position.set(C*T,y/2,w*T),S.rotation.z=-C*.08,S.rotation.x=w*.08,E.add(S)}for(const C of[y*.6,y*.82,y]){const w=new V(new De(T*4,.8,.8),r);w.position.y=C,E.add(w)}E.position.set(v,Oe(v,M)-2,M),je.add(E);const R=Oe(v,M)-2+y;if(o)for(const C of[-T*2,0,T*2]){const w=o.x+C,S=o.z,L=v+C,F=M,W=[],te=12;for(let X=0;X<=te;X++){const Z=X/te,ne=Math.sin(Z*Math.PI)*6;W.push(new P(w+(L-w)*Z,o.y-ne+(R-o.y)*Z,S+(F-S)*Z))}const ee=new bh(new Wt().setFromPoints(W),a);je.add(ee)}o={x:v,y:R,z:M}}const l=new Y({color:11680302,roughness:.6,metalness:.3}),c=new Y({color:15263976,roughness:.6,metalness:.3});for(let d=0;d<5;d++){const v=Yn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!v)continue;const{x:M,z:y}=v,E=70+Math.random()*50,T=new st,R=8;for(let L=0;L<R;L++){const F=new V(new ot(.5,.7,E/R,4),L%2?c:l);F.position.y=(L+.5)*(E/R),F.rotation.y=Math.PI/4,T.add(F)}const C=new Y({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new V(new qt(1.1,10,8),C);w.position.y=E+1,T.add(w),T.position.set(M,Oe(M,y),y),je.add(T),$n("mast",M,y,8,120);const S=Math.random()*Math.PI*2;Bn(w,L=>{C.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const u=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let d=0;d<6;d++){const v=new st,M=u[d%u.length],y=new Y({map:Iv(M[0],M[1]),roughness:.5,metalness:.05,emissive:new nt(M[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new V(new qt(11,20,16),y);E.scale.y=1.25,v.add(E);const T=new V(new De(3.4,3,3.4),new Y({color:8014371,roughness:.9}));T.position.y=-17,v.add(T);const R=new Zl({color:3811866});for(const F of[-1,1])for(const W of[-1,1]){const te=new bh(new Wt().setFromPoints([new P(F*1.6,-15.5,W*1.6),new P(F*7,-3,W*7)]),R);v.add(te)}const C=-700+Math.random()*1400,w=-700-Math.random()*1200,S=280+Math.random()*100;v.position.set(C,S,w),je.add(v);const L=Math.random()*Math.PI*2;Bn(v,F=>{v.position.y=S+Math.sin(F*.5+L)*6,v.position.x=C+Math.sin(F*.08+L)*90,v.rotation.z=Math.sin(F*.4+L)*.04})}const f=new bt({color:2829104,side:pt,fog:!1});function m(){const d=new Pc;return d.moveTo(0,0),d.lineTo(-2.6,1.1),d.lineTo(-2.2,.2),d.lineTo(0,.5),d.lineTo(2.2,.2),d.lineTo(2.6,1.1),d.lineTo(0,0),new V(new oo(d),f)}for(let d=0;d<5;d++){const v=new st,M=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<M;L++){const F=m(),W=L%2?1:-1,te=Math.ceil(L/2);F.position.set(W*te*5,-te*2.4,0),F.rotation.x=-Math.PI/2,v.add(F),y.push(F)}const E=150+Math.random()*120,T=-500-Math.random()*1400,R=18+Math.random()*14,C=1400,w=-700+Math.random()*1400;v.position.set(w,E,T),je.add(v);const S=Math.random()*Math.PI*2;Bn(v,(L,F)=>{v.position.x+=R*F,v.position.x>C&&(v.position.x=-C);const W=Math.sin(L*6+S);for(const te of y)te.rotation.x=-Math.PI/2+W*.4})}{const d=new st,v=new Y({color:14673644,roughness:.4,metalness:.2}),M=new V(new qt(20,20,16),v);M.scale.set(2.6,1,1),d.add(M);const y=new Y({color:13781835,roughness:.6});for(let w=0;w<3;w++){const S=new V(new De(10,9,.6),y);S.position.x=-46,S.rotation.x=w/3*Math.PI*2,d.add(S)}const E=new V(new De(10,4,4),new Y({color:3356475,roughness:.7}));E.position.y=-19,d.add(E);const T=new V(new Gt(40,10),new bt({map:Bc("STEEL RIBBON"),transparent:!0,side:pt}));T.position.set(60,0,0),d.add(T);const R=900,C=240;d.position.set(0,C,-1200),je.add(d),Bn(d,w=>{const S=w*.05;d.position.x=Math.cos(S)*R,d.position.z=-1200+Math.sin(S)*R*.5,d.position.y=C+Math.sin(w*.3)*8,d.rotation.y=-S+Math.PI/2})}const p=new bt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let d=0;d<14;d++){const v=new V(new Gt(220+Math.random()*360,16+Math.random()*22),p.clone());v.material.opacity=.12+Math.random()*.18,v.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),v.rotation.x=-Math.PI/2.1,v.rotation.z=Math.random()*Math.PI,v.scale.y=.3,je.add(v);const M=2+Math.random()*3;Bn(v,(y,E)=>{v.position.x+=M*E,v.position.x>1400&&(v.position.x=-1400)})}const x=new Y({color:13620954,roughness:.6,metalness:.2}),_=new bt({map:Uv(),side:pt});for(let d=0;d<4;d++){const v=Yn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!v)continue;const{x:M,z:y}=v,E=new st,T=60+Math.random()*40,R=new V(new De(T,1.4,26),x);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const C=new V(new Gt(T*.94,24),_);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const w of[-T/2,T/2]){const S=new V(new De(1.4,26,1.4),x);S.position.set(w,13,-8),E.add(S)}E.position.set(M,Oe(M,y),y),E.rotation.y=Math.atan2(-M,-y)+(Math.random()-.5)*.5,je.add(E),$n("grandstand",M,y,40,30)}const g=[16731486,16765503,16777215,11824127];for(let d=0;d<90;d++){const v=Yn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!v)continue;const{x:M,z:y}=v,E=new st,T=g[Math.floor(Math.random()*g.length)],R=new bt({color:T,side:pt}),C=5+Math.floor(Math.random()*6);for(let w=0;w<C;w++){const S=new V(new un(.5+Math.random()*.4,5),R);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(M,Oe(M,y),y),je.add(E),$n("flowers",M,y,3,20)}}const hn=[],zn=[];let nc=0;const Si=[],ms=[],Pn=[],ic=[],qr=[],Vs=[],ke={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},to=[];function es(n,e,t,i){ke.signs++,to.length<160&&to.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function Ui(n,e,t=1){ke[n][e]=(ke[n][e]||0)+t}function Tv(n,e){const t=new st,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,r=new Y({color:e,roughness:.34,metalness:.28}),a=new Y({color:new nt(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new Y({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),l=new Y({color:395016,roughness:.72,metalness:.02}),c=new Y({color:14147041,roughness:.2,metalness:.68}),u=new Y({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:1.7}),f=new Y({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:1.45}),m=new V(new De(s.w,s.h,s.l),n==="taxi"?new Y({color:16767293,roughness:.36,metalness:.24}):r);m.position.y=.95,t.add(m);const p=new V(new De(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(p.position.set(0,1.65,s.cabinZ),t.add(p),!s.bus){const d=new V(new De(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);d.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(d);for(const v of[-1,1]){const M=new V(new De(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);M.position.set(v*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(M)}}if(s.bed){const d=new V(new De(s.w*.94,.58,s.l*.38),a);d.position.set(0,1.2,1.35),t.add(d)}if(s.box){const d=new V(new De(s.box[0],s.box[1],s.box[2]),new Y({color:15130833,roughness:.62,metalness:.05}));d.position.set(0,1.55,1.25),t.add(d)}if(s.bus){const d=new V(new De(s.w+.06,.28,s.l*.86),a);d.position.set(0,1.38,0),t.add(d);for(let v=-2.8;v<=3.1;v+=1.2)for(const M of[-1,1]){const y=new V(new De(.08,.64,.72),o);y.position.set(M*(s.w*.5+.05),2.08,v),t.add(y)}}if(s.sign){const d=new V(new De(1,.24,.46),new Y({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));d.position.set(0,2.2,-.35),t.add(d)}const x=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],_=[],g=new Y({color:1250072,roughness:.86,metalness:.04});for(const d of x)for(const v of[-s.w*.54,s.w*.54]){const M=new V(new ot(.42,.42,.36,14),l);M.rotation.z=Math.PI/2,M.position.set(v,.45,d),t.add(M),_.push(M);const y=new V(new ot(.18,.18,.38,10),c);y.rotation.z=Math.PI/2,y.position.set(v,.45,d),t.add(y);const E=new V(new De(.3,.34,1.12),g);E.position.set(v*1.02,.72,d),t.add(E)}for(const d of[-s.l*.5-.06,s.l*.5+.06]){const v=new V(new De(s.w*1.02,.24,.16),g);v.position.set(0,.62,d),t.add(v)}for(const d of[-s.w*.28,s.w*.28]){const v=new V(new De(.42,.2,.1),u);v.position.set(d,.95,-s.l*.52-.04),t.add(v);const M=new V(new De(.36,.22,.1),f);M.position.set(d,.98,s.l*.52+.04),t.add(M)}return t.userData={wheels:_,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(d=>{d.castShadow=!0,d.receiveShadow=!0}),t}function Ev(n,e){const t=new st,i=new Y({color:12947299,roughness:.72}),s=new Y({color:n,roughness:.68}),r=new Y({color:e,roughness:.76}),a=new Y({color:1119001,roughness:.82}),o=new V(new ot(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const l=new V(new qt(.24,10,8),i);l.position.y=2.02,t.add(l);const c=new V(new qt(.25,8,5),a);c.scale.y=.5,c.position.y=2.17,t.add(c);const u=[];for(const f of[-.16,.16]){const m=new V(new ot(.075,.09,.78,6),r);m.position.set(f,.58,0),t.add(m),u.push({mesh:m,side:Math.sign(f),baseY:.58,amp:.28})}for(const f of[-.38,.38]){const m=new V(new ot(.055,.065,.72,6),i);m.position.set(f,1.33,0),m.rotation.z=f<0?-.18:.18,t.add(m),u.push({mesh:m,side:-Math.sign(f),baseY:1.33,amp:.34})}return t.userData.limbs=u,t.traverse(f=>{f.castShadow=!0,f.receiveShadow=!0}),t}function Av(n,e,t){const{X0:i,X1:s,ZN:r,ZF:a,pitch:o,streetW:l,trafficControls:c=new Map}=t,u=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],m=[],p=30,x=[],_=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=r;I>=a-1;I-=o)_.push(Math.round(I));_.sort((I,Se)=>I-Se);const g=x[0],d=x[x.length-1],v=_[0],M=_[_.length-1];Pn.length=0,ic.length=0,qr.length=0,Vs.length=0,ke.traffic=0,ke.pedestrians=0,ke.types={},ke.turns=0,ke.splats=0,ke.trafficCrashes=0,ke.streetLights=0,ke.trafficLights=0,ke.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*l*.23,T=(I,Se)=>{let ge=0,be=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-Se);K<be&&(be=K,ge=$)}return ge},R=(I,Se,ge)=>{const be=I==="ns"?_:x;if(ge>0){for(const $ of be)if($>Se+.05)return $;return be[be.length-1]}for(let $=be.length-1;$>=0;$--)if(be[$]<Se-.05)return be[$];return be[0]},C=I=>{const Se=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+Se,z:I.along}:{x:I.along,z:I.road+Se}},w=I=>{if(h.mode!=="roam")return null;const Se=C(I);if(Math.abs(h.roamPos.y-(Oe(Se.x,Se.z)+Gn))>4.2)return null;const ge=I.axis==="ns"?0:I.dir,be=I.axis==="ns"?I.dir:0,$=h.roamPos.x-Se.x,K=h.roamPos.z-Se.z,xe=$*ge+K*be,we=I.axis==="ns"?$:K,Ue=Math.abs(we),Ze=Math.hypot($,K),Lt=I.mesh?.userData?.colliderHalfW||2,Ke=I.mesh?.userData?.colliderHalfD||3;return Ze<xn+Math.max(Lt,Ke)*.55||xe>-1.5&&xe<Ke+4.2&&Ue<xn+Lt*.85?{crash:!0}:xe>0&&xe<30&&Ue<l*.36?{avoidOffset:(we>=0?-1:1)*I.maxAvoidOffset,stop:xe<13&&Ue<xn+Lt*.95}:null},S=(I,Se)=>`${Math.round(I)},${Math.round(Se)}`,L=(I,Se)=>{const ge=((Se+I.phase)%15.5+15.5)%15.5;return ge<6.2?"ns":ge<7.4?"yellow-ns":ge<13.6?"ew":"yellow-ew"},F=(I,Se)=>{const ge=I.axis==="ns"?I.road:I.next,be=I.axis==="ns"?I.next:I.road,$=S(ge,be),K=c.get($);if(!K)return null;if(K.type==="signal"){const xe=L(K,Se),we=xe===`yellow-${I.axis}`;return xe===I.axis&&!we?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},W=(I,Se=!1)=>{const ge=I.axis,be=I.along,$=ge==="ns"?x:_,K=I.road,xe=T($,K),we=[],Ue=ge==="ns"?v:g,Ze=ge==="ns"?M:d;!Se&&be+I.dir*o>=Ue&&be+I.dir*o<=Ze&&we.push({axis:ge,road:I.road,along:be,dir:I.dir,turn:!1}),xe>0&&we.push({axis:ge==="ns"?"ew":"ns",road:be,along:K,dir:-1,turn:!0}),xe<$.length-1&&we.push({axis:ge==="ns"?"ew":"ns",road:be,along:K,dir:1,turn:!0}),we.length||we.push({axis:ge,road:I.road,along:be,dir:-I.dir,turn:!0});const Lt=we.filter(Rt=>Rt.turn),Ke=!Se&&Lt.length&&Math.random()<.42?y(Lt):y(we);(Ke.turn||Ke.axis!==ge)&&ke.turns++,I.axis=Ke.axis,I.road=Ke.road,I.along=Ke.along,I.dir=Ke.dir,I.laneOffset=E(I.dir),I.next=R(I.axis,I.along,I.dir),I.turnBlend=Ke.turn?1:0,I.lastControlKey=null};for(let I=0;I<p;I++){const Se=Math.random()<.56?"ns":"ew",ge=f[I%f.length],be=Math.random()<.5?-1:1,$=(ge==="bus"||ge==="boxTruck"?10:13)+Math.random()*9,K={axis:Se,dir:be,road:y(Se==="ns"?x:_),laneOffset:E(be),along:y(Se==="ns"?_:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:l*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Tv(ge,u[I*3%u.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=R(K.axis,K.along,K.dir),Pn.push(K.collider),m.push(K),ic.push(K),n.add(K.mesh),ke.types[ge]=(ke.types[ge]||0)+1}function te(I,Se=0,ge=0){let be=Math.max(0,I.speed*ge);const $=w(I);for($?.crash?(ku(I,h.roamPos),be=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,ge*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),be=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,ge*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-ge),be=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-ge),be=0);be>0;){const O=F(I,Se);if(O){const ut=I.next-I.dir*(O.kind==="signal"?12:8),Pt=(ut-I.along)*I.dir;if(Pt>=-.35&&Pt<=be+.25){I.along=ut,I.brakePulse=1,be=0,O.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=O.key);break}}const ft=Math.abs(I.next-I.along);if(be<ft)I.along+=I.dir*be,be=0;else{I.along=I.next,be-=ft;const ut=I.next<=(I.axis==="ns"?v:g)+.05||I.next>=(I.axis==="ns"?M:d)-.05;W(I,ut)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-ge*3.2),I.turnBlend=Math.max(0,I.turnBlend-ge*3.2);const{x:K,z:xe}=C(I),we=I.axis==="ns"?0:I.dir,Ue=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,Oe(K,xe)+.28+Math.sin(Se*3.2+I.bob)*.035,xe);const Ze=Math.atan2(-we,-Ue),Lt=Math.atan2(Math.sin(Ze-I.mesh.rotation.y),Math.cos(Ze-I.mesh.rotation.y));I.mesh.rotation.y+=Lt*Math.min(1,ge*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(Se*22+I.bob)*.02);for(const O of I.mesh.userData.wheels||[])O.rotation.x-=I.dir*I.speed*ge*1.7;const Ke=I.mesh.userData.colliderHalfD,Rt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=xe,I.collider.hw=I.axis==="ns"?Rt:Ke,I.collider.hd=I.axis==="ns"?Ke:Rt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of m)te(I,0,0);ke.traffic=m.length,Bn(n,(I,Se)=>{for(const ge of m)te(ge,I,Se)});const ee=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],X=[2437188,3092787,4930093,2244434],Z=[],ne=45;for(let I=0;I<ne;I++){const Se=Math.random()<.56?"ns":"ew",ge=e[Math.random()*e.length|0],be=Math.abs(ge.z1-ge.z0)>Math.abs(ge.x1-ge.x0),$=Se==="ns"?be?"ns":"ew":be?"ew":"ns",K=Math.random()<.5?-1:1,xe=Math.random()<.5?-1:1,we={axis:$,dir:K,sideSign:xe,coord:y($==="ns"?x:_),along:$==="ns"?a+Math.random()*(r-a):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Ev(ee[I%ee.length],X[I*2%X.length])};I<14&&(we.axis="ns",we.coord=80,we.sideSign=I%2?-1:1,we.dir=I%3===0?1:-1,we.along=350-I*24,we.speed=1.5+I%4*.35),Z.push(we),qr.push(we),n.add(we.mesh)}const de=new bt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:pt}),pe=new bt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:pt});for(let I=0;I<18;I++){const Se=new st,ge=new V(new un(1,12),de.clone());ge.rotation.x=-Math.PI/2,Se.add(ge);for(let be=0;be<7;be++){const $=new V(new un(.25+Math.random()*.25,8),pe.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(be)*(.6+Math.random()*1.2),.01,Math.sin(be*1.7)*(.5+Math.random()*1.1)),Se.add($)}Se.visible=!1,Se.userData.life=0,Se.userData.maxLife=2.8,Se.position.y=-99,n.add(Se),Vs.push(Se)}function Ve(I,Se=0,ge=0){if(!I.active)if(I.respawn-=ge,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*ge,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const be=I.sideSign*(l*.66+1.2),$=I.axis==="ns"?I.coord+be:I.along,K=I.axis==="ns"?I.along:I.coord+be,xe=I.axis==="ns"?0:I.dir,we=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,Oe($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-xe,-we);const Ue=Math.sin(Se*7+I.phase);for(const Ze of I.mesh.userData.limbs||[])Ze.mesh.rotation.x=Ue*Ze.amp*Ze.side,Ze.mesh.position.y=Ze.baseY+Math.abs(Ue)*.025}for(const I of Z)Ve(I,0,0);ke.pedestrians=Z.length,Bn(n,(I,Se)=>{for(const ge of Z)Ve(ge,I,Se);for(const ge of Vs){if(!ge.visible)continue;ge.userData.life-=Se;const be=ge.userData.life,$=Pe.clamp(be/ge.userData.maxLife,0,1);ge.scale.setScalar(1+(1-$)*.35),ge.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),be<=0&&(ge.visible=!1)}})}function Cv(){const n=new st,e=new Ht;new Ei().setFromAxisAngle(new P(1,0,0),-Math.PI/2),ke.roadDetails={},ke.buildingArchetypes={},ke.zones={},ke.openerProps=0;const t=Nt.x0,i=Nt.x1,s=Nt.zNear,r=Nt.zFar,a=Nt.pitch,o=Nt.streetW,l=a-o,c=[],u=[];for(let N=t;N<=i+1;N+=a)c.push(Math.round(N));for(let N=s;N>=r-1;N-=a)u.push(Math.round(N));const f=[];for(const N of c)f.push({x0:N,z0:s,x1:N,z1:r});for(const N of u)f.push({x0:t,z0:N,x1:i,z1:N});function m(N,z){const q=N.x1-N.x0,Q=N.z1-N.z0,ie=Math.hypot(q,Q)||1,le=-Q/ie,b=q/ie;return{x0:N.x0+le*z,z0:N.z0+b*z,x1:N.x1+le*z,z1:N.z1+b*z}}function p(N,z,q){const Q=[],ie=[];for(const b of N){const U=b.x1-b.x0,k=b.z1-b.z0,H=Math.hypot(U,k),B=Math.max(1,Math.round(H/14)),oe=U/H,ae=-(k/H),j=oe;let he=null,Me=null;for(let Fe=0;Fe<=B;Fe++){const ye=Fe/B,Ce=ye*H/68,at=b.x0+U*ye,mt=b.z0+k*ye,yt=at+ae*z,xt=mt+j*z,He=at-ae*z,St=mt-j*z,lt=[yt,Oe(yt,xt)+q,xt,Ce],Xt=[He,Oe(He,St)+q,St,Ce];he&&(Q.push(he[0],he[1],he[2],Me[0],Me[1],Me[2],Xt[0],Xt[1],Xt[2]),Q.push(he[0],he[1],he[2],Xt[0],Xt[1],Xt[2],lt[0],lt[1],lt[2]),ie.push(0,he[3],1,Me[3],1,Xt[3]),ie.push(0,he[3],1,Xt[3],0,lt[3])),he=lt,Me=Xt}}const le=new Wt;return le.setAttribute("position",new Mt(Q,3)),le.setAttribute("uv",new Mt(ie,2)),le.computeVertexNormals(),le}const x=new Y({map:uv(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:pt}),_=new Y({color:11054244,roughness:.62,metalness:.04}),g=new Y({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),d=new Y({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),v=new Y({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),M=new Y({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const N of f)y.push(m(N,o*.5+3.3),m(N,-13.3)),E.push(m(N,o*.5+.42),m(N,-10.42));const T=new V(p(y,2.9,.66),_);T.receiveShadow=!0,n.add(T);const R=new V(p(E,.28,.78),g);R.receiveShadow=!0,n.add(R),Ui("roadDetails","sidewalkRuns",y.length),Ui("roadDetails","curbRuns",E.length);const C=new V(p(f,o/2,.55),x);C.receiveShadow=!0,n.add(C);const w=new Y({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:pt});n.add(new V(p(f,.4,.62),w));let S=0,L=0,F=0;for(let N=1;N<c.length-1;N++)for(let z=1;z<u.length-1;z++){const q=c[N],Q=u[z];if(!(Cn(q,Q,o*.75).clearance<2))for(const ie of[-1,1]){const le=new V(new De(o*.92,.07,1.15),d);le.position.set(q,Oe(q,Q+ie*13)+.83,Q+ie*13),le.receiveShadow=!0,n.add(le);const b=new V(new De(1.15,.07,o*.92),d);b.position.set(q+ie*13,Oe(q+ie*13,Q)+.83,Q),b.receiveShadow=!0,n.add(b),S+=2}}const W=new Pc;W.moveTo(0,5.8),W.lineTo(2.5,1.6),W.lineTo(.72,1.6),W.lineTo(.72,-5.2),W.lineTo(-.72,-5.2),W.lineTo(-.72,1.6),W.lineTo(-2.5,1.6),W.closePath();const te=new oo(W);te.rotateX(-Math.PI/2);for(const N of f){const z=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),q=Math.hypot(N.x1-N.x0,N.z1-N.z0),Q=Math.max(2,Math.floor(q/280));for(let ie=0;ie<Q;ie++){const le=(ie+.5)/Q,b=N.x0+(N.x1-N.x0)*le,U=N.z0+(N.z1-N.z0)*le;if(Cn(b,U,4).clearance<2)continue;const k=new V(te,v);if(k.position.set(b,Oe(b,U)+.86,U),k.rotation.y=z?0:Math.PI/2,k.scale.setScalar(.9),n.add(k),L++,ie%2===0){const H=new V(new ot(1.05,1.05,.08,24),M);H.position.set(b+(z?3.8:0),Oe(b,U)+.84,U+(z?0:3.8)),n.add(H),F++}}}Ui("roadDetails","crosswalks",S),Ui("roadDetails","laneArrows",L),Ui("roadDetails","manholes",F);const ee=new bt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:pt,blending:Kn}),X=new bt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:pt,blending:Kn});for(let N=0;N<120;N++){const z=f[Math.random()*f.length|0],q=Math.random(),Q=z.x0+(z.x1-z.x0)*q,ie=z.z0+(z.z1-z.z0)*q;if(Cn(Q,ie,4).clearance<2)continue;const le=new V(new un(1,18),(N%4===0?X:ee).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(Q+(Math.random()-.5)*o*.7,Oe(Q,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const Z=[zs(160,320,.5),zs(160,320,.62),zs(160,320,.42)],ne=[new Y({map:Z[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:Z[0],emissiveIntensity:.34}),new Y({map:Z[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:Z[1],emissiveIntensity:.32}),new Y({map:Z[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:Z[2],emissiveIntensity:.36})],de=new De(1,1,1),pe=[[],[],[]],Ve=[],I=[],Se=[],ge=[],be=[],$=[],K=[],xe=[],we=[],Ue=[],Ze=[],Lt=[],Ke=[],Rt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],O=pv(256,256,"#dbcdb8"),ft=mv(),ut=xv(),Pt=[tl(512,384,"#944737","#2e95bf"),tl(512,384,"#7e4d3e","#d04d65"),tl(512,384,"#a65a35","#4fba6d")],qe=gv();function Ut(N,z){Ui("zones",N),Ui("buildingArchetypes",z)}function Qe(N,z,q,Q,ie,le="downtown"){if(On(N,z,q,Q))return!1;const b=ss(N,z,q,Q)-1.1;if(Qi(N,z,q,Q,b+ie+2))return!1;if(e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(q,ie,Q),e.updateMatrix(),pe[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,b+ie+.6,z),e.scale.set(q*1.04,1.2,Q*1.04),e.updateMatrix(),Ve.push(e.matrix.clone()),ie>26){const U=Math.random()<.72?3790847:16730294;for(const k of[-1,1])e.position.set(N,b+ie+1.35,z+k*(Q*.52+.12)),e.scale.set(q*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),Se.push(U);Math.random()<.34&&ge.push({px:N,pz:z,w:q,d:Q,h:ie,gy:b,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const U=Math.random()<.5?"x":"z";be.push({px:N,pz:z,w:q,d:Q,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const U=Math.random()<.5?"x":"z";$.push({px:N,pz:z,w:q,d:Q,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}return hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:b+ie+2}),Ut(le,ie>64?"glassTower":"midrise"),!0}function ct(N,z,q,Q,ie,le="residential"){if(On(N,z,q,Q))return!1;const b=ss(N,z,q,Q)-.55,U=2+Math.random()*2.4;if(Qi(N,z,q,Q,b+ie+U+1.5,6))return!1;e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(q,ie,Q),e.updateMatrix(),K.push(e.matrix.clone()),hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:b+ie+U+1.5}),xe.push(Rt[Math.random()*Rt.length|0]),e.position.set(N,b+ie+U/2,z),e.scale.set(q*.82,U,Q*.82),e.updateMatrix(),we.push(e.matrix.clone());const k=t+Math.round((N-t)/a)*a,H=s-Math.round((s-z)/a)*a,B=Math.abs(N-k)<Math.abs(z-H),oe=B?k>N?1:-1:H>z?1:-1,ae=Math.min(B?Q*.46:q*.46,8.5),j=Math.min(ie*.58,4.6),he=Math.min(24,Math.max(8,B?Math.abs(k-N)-q*.5-o*.35:Math.abs(H-z)-Q*.5-o*.35));e.quaternion.identity(),B?(e.position.set(N+oe*(q*.5+.1),b+j*.5+.1,z-Q*.16),e.scale.set(.24,j,ae),e.updateMatrix(),Ue.push(e.matrix.clone()),e.position.set(N+oe*(q*.5+he*.5),Oe(N+oe*(q*.5+he*.5),z)+.08,z-Q*.16),e.scale.set(he,.08,ae*1.18)):(e.position.set(N-q*.16,b+j*.5+.1,z+oe*(Q*.5+.1)),e.scale.set(ae,j,.24),e.updateMatrix(),Ue.push(e.matrix.clone()),e.position.set(N-q*.16,Oe(N,z+oe*(Q*.5+he*.5))+.08,z+oe*(Q*.5+he*.5)),e.scale.set(ae*1.18,.08,he)),e.updateMatrix(),Ze.push(e.matrix.clone()),e.position.set(N,b+.02,z),e.scale.set(q*1.58,.05,Q*1.58),e.updateMatrix(),Lt.push(e.matrix.clone());for(let Me=0;Me<3;Me++){const Fe=B?N+oe*(q*.55):N+(Me-1)*q*.25,ye=B?z+(Me-1)*Q*.28:z+oe*(Q*.55);e.position.set(Fe,Oe(Fe,ye)+.55,ye);const Ce=.85+Math.random()*.75;e.scale.set(Ce*1.35,Ce,Ce*1.35),e.updateMatrix(),Ke.push(e.matrix.clone())}return Ut(le,"residentialHouse"),!0}function D(N,z,q,Q,ie,le="commercial"){if(On(N,z,q,Q))return!1;const b=ss(N,z,q,Q)-.8;if(Qi(N,z,q,Q,b+ie+2,7))return!1;const U=new Y({map:qe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),k=new V(new De(q,ie,Q),U);k.position.set(N,b+ie/2,z),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const H=new Y({color:7502722,roughness:.52,metalness:.15}),B=new V(new De(q*.72,.32,Q*.18),H);B.position.set(N,b+ie*.38,z+Q*.18),B.rotation.z=.13,n.add(B);const oe=new Y({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const j=new V(new De(q*1.02,.24,.22),oe);j.position.set(N,b+ae,z+Q*.5+.14),n.add(j)}return hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:b+ie+2}),Ut(le,"parkingGarage"),!0}function A(N,z,q,Q,ie,le="commercial"){if(On(N,z,q,Q))return!1;const b=ss(N,z,q,Q)-.65;if(Qi(N,z,q,Q,b+ie+2,7))return!1;const U=new Y({map:Pt[Math.random()*Pt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),k=new V(new De(q,ie,Q),U);k.position.set(N,b+ie/2,z),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const H=new V(new De(q*1.06,.9,Q*1.06),new Y({color:2237478,roughness:.56,metalness:.18}));H.position.set(N,b+ie+.45,z),n.add(H);const B=t+Math.round((N-t)/a)*a,oe=s-Math.round((s-z)/a)*a,ae=Math.abs(N-B)<Math.abs(z-oe),j=ae?B>N?1:-1:oe>z?1:-1,he=Ni[(N+z|0)%Ni.length]||"#ffd45b",Me=new bt({map:el(Fi[(Math.abs(N)+Math.abs(z)|0)%Fi.length],he),transparent:!0,side:pt,depthWrite:!1}),Fe=new V(new Gt(Math.min(16,ae?Q*.82:q*.82),4.2),Me);return ae?(Fe.position.set(N+j*(q*.5+.2),b+ie*.66,z),Fe.rotation.y=j>0?Math.PI/2:-Math.PI/2):(Fe.position.set(N,b+ie*.66,z+j*(Q*.5+.2)),Fe.rotation.y=j<0?Math.PI:0),n.add(Fe),es("storefront-sign",Fe.position.x,Fe.position.y,Fe.position.z),hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:b+ie+2}),Ut(le,"brickStorefront"),!0}for(let N=t+a/2;N<=i-a/2;N+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const q=Cn(N,z,l*.5).clearance;if(q<2)continue;const Q=z>40&&z<380&&N>-360&&N<360,ie=Q?"showcase":z<-920?"industrial":q>230||z<-430?"downtown":q<90?"residential":"commercial";if(q<90||Q){const le=l/3;for(let b=0;b<3;b++)for(let U=0;U<3;U++){if(Math.random()<.08)continue;const k=N-l/2+le*(b+.5)+(Math.random()-.5)*le*.3,H=z-l/2+le*(U+.5)+(Math.random()-.5)*le*.3;if(Cn(k,H,8).clearance<1)continue;const B=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!Q&&Math.random()<.16?Qe(k,H,B*.9,oe*.9,12+Math.random()*12,ie):ct(k,H,B,oe,5+Math.random()*4.5,ie)}}else{const le=q>230,b=le?Pe.clamp(58+q*1.15,68,205):Pe.clamp(22+q*.3,22,66),U=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let k=0;k<U;k++){const H=15+Math.random()*Math.min(30,l*.46),B=15+Math.random()*Math.min(30,l*.46),oe=N+(Math.random()-.5)*(l-H),ae=z+(Math.random()-.5)*(l-B);if(Cn(oe,ae,Math.hypot(H,B)*.5).clearance<2)continue;const j=(18+Math.random()*(b-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&A(oe,ae,Math.max(18,H*1.12),Math.max(18,B*1.08),12+Math.random()*14,ie)||Math.random()<.18&&D(oe,ae,Math.max(24,H*1.35),Math.max(24,B*1.28),24+Math.random()*24,ie))||Qe(oe,ae,H,B,j,ie)}}}for(let N=0;N<3;N++){if(!pe[N].length)continue;const z=new sn(de,ne[N],pe[N].length);for(let q=0;q<pe[N].length;q++)z.setMatrixAt(q,pe[N][q]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,n.add(z)}if(Ve.length){const N=new Y({color:2896696,roughness:.62,metalness:.34}),z=new sn(de,N,Ve.length);for(let q=0;q<Ve.length;q++)z.setMatrixAt(q,Ve[q]);z.instanceMatrix.needsUpdate=!0,n.add(z)}if(I.length){const N=new Y({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new sn(de,N,I.length);for(let q=0;q<I.length;q++)z.setMatrixAt(q,I[q]),z.setColorAt(q,new nt(Se[q]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),n.add(z)}if(K.length){const N=new Y({color:4891451,roughness:.88,metalness:.02}),z=new sn(de,N,Lt.length);for(let j=0;j<Lt.length;j++)z.setMatrixAt(j,Lt[j]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,n.add(z);const q=new Y({color:12040883,roughness:.48,metalness:.05}),Q=new sn(de,q,Ze.length);for(let j=0;j<Ze.length;j++)Q.setMatrixAt(j,Ze[j]);Q.instanceMatrix.needsUpdate=!0,Q.receiveShadow=!0,n.add(Q);const ie=new Y({map:O,roughness:.78,metalness:.03}),le=new sn(de,ie,K.length);for(let j=0;j<K.length;j++)le.setMatrixAt(j,K[j]),le.setColorAt(j,new nt(xe[j]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const b=new ls(.72,1,4);b.rotateY(Math.PI/4);const U=new Y({map:ft,color:14314033,roughness:.72}),k=new sn(b,U,we.length);for(let j=0;j<we.length;j++)k.setMatrixAt(j,we[j]);k.instanceMatrix.needsUpdate=!0,k.castShadow=!0,n.add(k);const H=new Y({map:ut,roughness:.38,metalness:.18}),B=new sn(de,H,Ue.length);for(let j=0;j<Ue.length;j++)B.setMatrixAt(j,Ue[j]);B.instanceMatrix.needsUpdate=!0,n.add(B);const oe=new Y({color:3112239,roughness:.88,metalness:.02}),ae=new sn(new qt(1,8,6),oe,Ke.length);for(let j=0;j<Ke.length;j++)ae.setMatrixAt(j,Ke[j]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(ge.length,34);N++){const z=ge[N],q=J[N%J.length],Q=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new bt({map:ld(q,Q),transparent:!0,side:pt,depthWrite:!1}),le=new V(new Gt(8,24),ie);le.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),le.rotation.y=z.zSide<0?Math.PI:0,n.add(le),es("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let N=0;N<Math.min(be.length,48);N++){const z=be[N],q=Fi[(N*5+2)%Fi.length],Q=Ni[(N*2+1)%Ni.length],ie=new bt({map:el(q,Q),transparent:!0,side:pt,depthWrite:!1}),le=Math.min(17,(z.axis==="x"?z.d:z.w)*.82),b=new V(new Gt(le,4.7),ie),U=z.gy+Math.max(6.2,Math.min(z.h-3.5,z.h*(.28+N%3*.12)));z.axis==="x"?(b.position.set(z.px+z.side*(z.w*.5+.22),U,z.pz),b.rotation.y=z.side>0?Math.PI/2:-Math.PI/2):(b.position.set(z.px,U,z.pz+z.side*(z.d*.5+.22)),b.rotation.y=z.side<0?Math.PI:0),n.add(b),es("wall-sign",b.position.x,b.position.y,b.position.z)}for(let N=0;N<Math.min($.length,18);N++){const z=$[N],q=Fi[(N*7+4)%Fi.length],Q=Qa[(N*5+3)%Qa.length],ie=Ni[(N+3)%Ni.length],le=new st,b=new Y({map:Mu(q,Q,ie),color:16777215,roughness:.2,metalness:.06,emissive:new nt(ie),emissiveIntensity:.34}),U=Math.min(18,(z.axis==="x"?z.d:z.w)*.86),k=new V(new De(U,5.2,.42),b);k.position.y=4.8,le.add(k);const H=new Y({color:1053978,roughness:.44,metalness:.28});for(const B of[-U*.34,U*.34]){const oe=new V(new ot(.13,.17,5,8),H);oe.position.set(B,2.25,-.2),le.add(oe)}le.position.set(z.px,z.gy+z.h+.7,z.pz),le.rotation.y=z.axis==="x"?z.side>0?Math.PI/2:-Math.PI/2:z.side<0?Math.PI:0,n.add(le),es("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],fe=sd([new De(2.2,.72,4.6).translate(0,.78,0),new De(1.7,.56,2.15).translate(0,1.42,-.22)]),re=sd([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,z])=>new ot(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,z))),Ye=130,Ee=new sn(fe,new Y({roughness:.42,metalness:.36}),Ye),Je=new sn(re,new Y({color:1512727,roughness:.9}),Ye);let Ge=0,me=0;for(;Ge<Ye&&me<Ye*6;){me++;const N=Math.random()<.5,z=N?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),q=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Cn(z,q,4).clearance<2)continue;const Q=Oe(z,q)+.06;e.position.set(z,Q,q),e.quaternion.setFromAxisAngle(jt,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ee.setMatrixAt(Ge,e.matrix),Je.setMatrixAt(Ge,e.matrix),Ee.setColorAt(Ge,new nt(ce[Math.random()*ce.length|0])),Ge++}Ee.count=Ge,Je.count=Ge,Ee.instanceMatrix.needsUpdate=!0,Je.instanceMatrix.needsUpdate=!0,Ee.instanceColor&&(Ee.instanceColor.needsUpdate=!0),Ee.castShadow=!0,n.add(Ee),n.add(Je);const _e=new Map,tt=(N,z)=>`${Math.round(N)},${Math.round(z)}`;function et(N,z){const q=((z+N.phase)%15.5+15.5)%15.5;return q<6.2?{green:"ns",yellow:null}:q<7.4?{green:null,yellow:"ns"}:q<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Be(){const N=[],z=new Y({color:1120028,roughness:.38,metalness:.62}),q=new Y({color:1382685,roughness:.34,metalness:.38}),Q=vv(),ie=new bt({map:Q,transparent:!0,side:pt}),le=new Y({color:5050642,roughness:.48,metalness:.12}),b=(ae,j)=>new Y({color:ae,roughness:.16,metalness:.02,emissive:j,emissiveIntensity:.2}),U=(ae,j,he,Me,Fe,ye)=>{const Ce=new st,at=new V(new De(1.15,2.85,.75),q);Ce.add(at);const mt=b(16724008,16717836),yt=b(16767053,16757276),xt=b(4521842,1693789),He=[mt,yt,xt];for(let St=0;St<3;St++){const lt=new V(new qt(.28,12,8),He[St]);lt.position.set(0,.78-St*.78,-.42),Ce.add(lt)}Ce.position.set(he,Me,Fe),Ce.rotation.y=ye,ae.add(Ce),N.push({axis:j,red:mt,yellow:yt,green:xt,control:ae.userData.control})},k=(ae,j,he)=>{const Me=tt(ae,j),Fe={type:"signal",x:ae,z:j,phase:he%4*2.1};_e.set(Me,Fe);const ye=Oe(ae,j),Ce=new st;Ce.userData.control=Fe;const at=o*.72,mt=o*.72,yt=new V(new ot(.18,.24,8.2,8),z);yt.position.set(at,4.1,mt),Ce.add(yt);const xt=new V(new De(o*1.65,.2,.2),z);xt.position.set(at-o*.72,8,mt),Ce.add(xt);const He=new V(new De(.2,.2,o*1.65),z);He.position.set(at,7.55,mt-o*.72),Ce.add(He),U(Ce,"ns",at-o*1.24,7.52,mt,0),U(Ce,"ns",at-o*.18,7.52,-mt,Math.PI),U(Ce,"ew",at,7.05,mt-o*1.24,Math.PI/2),U(Ce,"ew",-at,7.05,mt-o*.18,-Math.PI/2),Ce.position.set(ae,ye,j),Ce.traverse(St=>{St.castShadow=!0,St.receiveShadow=!0}),n.add(Ce)},H=(ae,j,he)=>{const Me=tt(ae,j);_e.set(Me,{type:"stop",x:ae,z:j,phase:0});const Fe=Oe(ae,j),ye=new st,Ce=he%2?-1:1,at=he%3?1:-1,mt=new V(new ot(.12,.16,4.2,7),z);mt.position.y=2.1,ye.add(mt);const yt=new V(new un(1.04,8),le);yt.position.y=4.55,yt.rotation.y=Math.PI,ye.add(yt);const xt=new V(new Gt(2.05,2.05),ie);xt.position.set(0,4.55,-.04),ye.add(xt),ye.position.set(ae+Ce*o*.74,Fe,j+at*o*.74),ye.rotation.y=Math.atan2(Ce,at),ye.traverse(He=>{He.castShadow=!0,He.receiveShadow=!0}),n.add(ye)};let B=0,oe=0;for(let ae=1;ae<c.length-1;ae++)for(let j=1;j<u.length-1;j++){const he=c[ae],Me=u[j];if(Cn(he,Me,o*.9).clearance<2)continue;const Fe=Math.abs(he-80)<=a*1.05&&Me<=s&&Me>=-560,ye=Me<-260&&Me>-1180&&(ae+j)%4===0,Ce=Me>-360&&(ae+j)%2===0;Fe&&j%2===0||ye?k(he,Me,B++):(Ce||(ae+j)%5===0&&Me>-820)&&H(he,Me,oe++)}return Bn(n,ae=>{for(const j of N){const he=et(j.control,ae);j.red.emissiveIntensity=he.green===j.axis||he.yellow===j.axis?.12:2.3,j.yellow.emissiveIntensity=he.yellow===j.axis?2.6:.12,j.green.emissiveIntensity=he.green===j.axis?2.6:.1}}),{trafficLights:B,stopSigns:oe}}const it=Be();Av(n,f,{X0:t,X1:i,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:_e}),ke.trafficLights=it.trafficLights,ke.stopSigns=it.stopSigns;const G=new ot(.12,.16,7.2,7),Ne=new qt(.46,10,8),Le=new Gt(2.8,13),Ae=new Y({color:1581353,roughness:.42,metalness:.68}),ve=new Y({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),ue=new bt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:pt,blending:Kn}),We=fv(),rt=new $d({map:We,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:Kn}),Dt=132,Et=new sn(G,Ae,Dt),Mn=new sn(Ne,ve,Dt),fn=new sn(Le,ue,Dt);let Hn=0;for(let N=0;N<Dt*2&&Hn<Dt;N++){const z=Math.random()<.5,q=z?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),Q=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Cn(q,Q,3).clearance<2)continue;const ie=Oe(q,Q);e.quaternion.identity(),e.position.set(q,ie+3.6,Q),e.scale.set(1,1,1),e.updateMatrix(),Et.setMatrixAt(Hn,e.matrix),e.position.set(q,ie+7.5,Q),e.updateMatrix(),Mn.setMatrixAt(Hn,e.matrix);const le=new gh(rt);le.position.set(q,ie+7.5,Q);const b=6.2+Math.random()*2.4;le.scale.set(b,b,1),n.add(le),ki.streetGlowSprites++,e.position.set(q,ie+.72,Q),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),fn.setMatrixAt(Hn,e.matrix),Hn++}Et.count=Hn,Mn.count=Hn,fn.count=Hn,Et.instanceMatrix.needsUpdate=!0,Mn.instanceMatrix.needsUpdate=!0,fn.instanceMatrix.needsUpdate=!0,n.add(Et,Mn,fn),ke.streetLights=Hn,n.add(new V(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),n.add(new V(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),n.add(new V(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new V(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const ea=new Y({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const z=new V(new De(1.15,.09,13.5),ea);z.position.set(80,Oe(80,N)+.9,N),z.receiveShadow=!0,n.add(z)}for(const N of[286,156,26,-104])for(let z=0;z<7;z++){const q=new V(new De(2,.08,11.8),d),Q=71.2+z*2.95;q.position.set(Q,Oe(Q,N)+.91,N),q.receiveShadow=!0,n.add(q),Ui("roadDetails","openerCrosswalkStripes")}function rr(N,z,q,Q=!1){const ie=Oe(N,z),le=new st,b=new V(new ot(.16,.22,9.5,8),Ae);b.position.y=4.75,le.add(b);const U=new V(new De(3.8,.22,.22),Ae);U.position.set(q*1.75,8.95,0),le.add(U);const k=new V(new qt(.62,12,8),ve);k.position.set(q*3.6,8.82,0),le.add(k);const H=new gh(rt.clone());H.position.copy(k.position),H.material.opacity=.78+Math.random()*.12,H.scale.set(8.8,8.8,1),le.add(H),ki.streetGlowSprites++;const B=new V(new Gt(3.2,15),ue.clone());if(B.position.set(q*2.8,.72,0),B.rotation.x=-Math.PI/2,B.scale.y=.7+Math.random()*.35,le.add(B),Q){const oe=new Ic(16762474,4.4,66,2);oe.position.copy(k.position),le.add(oe)}le.position.set(N,ie,z),n.add(le),ke.streetLights++}let ti=0;for(let N=340;N>=-700;N-=118)rr(63,N,1,ti++%3===0),rr(97,N-42,-1,ti++%3===0);function ni(N,z,q,Q,ie=6010942){const le=new Y({color:ie,roughness:.92,metalness:.01}),b=new V(new De(q,.08,Q),le);return b.position.set(N,Oe(N,z)+.06,z),b.receiveShadow=!0,n.add(b),ke.openerProps++,b}function ii(N,z,q=1){const Q=Oe(N,z),ie=new st,le=new V(new ot(.35,.55,5.5,8),new Y({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const b=new Y({color:6065982,roughness:.86}),U=new Y({color:3959601,roughness:.9}),k=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let H=0;H<k.length;H++){const[B,oe,ae,j]=k[H],he=new V(new qt(j,12,8),H%2?U:b);he.position.set(B,oe,ae),he.scale.y=.78,he.castShadow=!0,ie.add(he)}return ie.position.set(N,Q,z),ie.scale.setScalar(q),n.add(ie),Si.push({kind:"tree",x:N,z,radius:3.4*q,maxY:Q+11*q}),ke.openerProps++,ie}function ar(N,z,q=0){const Q=new st,ie=new Y({color:10970418,roughness:.64,metalness:.04}),le=new Y({color:1910317,roughness:.46,metalness:.5});for(const b of[1.05,1.55]){const U=new V(new De(6.8,.22,.44),ie);U.position.y=b,Q.add(U)}for(const b of[-2.7,2.7]){const U=new V(new De(.22,1.2,.35),le);U.position.set(b,.62,0),Q.add(U)}Q.position.set(N,Oe(N,z),z),Q.rotation.y=q,n.add(Q),ke.openerProps++}function xs(N,z){const q=new Y({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),Q=new st,ie=new V(new ot(.34,.42,1.25,12),q);ie.position.y=.65,Q.add(ie);const le=new V(new qt(.42,12,8),q);le.position.y=1.32,Q.add(le);const b=new V(new ot(.16,.16,1.1,10),q);b.rotation.z=Math.PI/2,b.position.y=.9,Q.add(b),Q.position.set(N,Oe(N,z),z),n.add(Q),ke.openerProps++}function ta(N,z,q=0){const Q=new st,ie=new Y({color:1185821,roughness:.36,metalness:.68}),le=new Y({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),b=new Y({color:2370611,roughness:.42,metalness:.32}),U=new V(new De(8.5,.35,3.2),b);U.position.y=4.2,Q.add(U);for(const B of[-3.8,3.8]){const oe=new V(new ot(.09,.11,4.1,7),ie);oe.position.set(B,2.05,-1.25),Q.add(oe)}const k=new V(new De(8,2.8,.08),le);k.position.set(0,2.2,1.35),Q.add(k);const H=new V(new Gt(2.3,2.8),new bt({map:el("BUS","#4ff3ff"),transparent:!0,side:pt}));H.position.set(-2.4,2.2,1.42),Q.add(H),Q.position.set(N,Oe(N,z),z),Q.rotation.y=q,n.add(Q),es("bus-shelter-ad",N,Oe(N,z)+2.2,z),ke.openerProps++}function tn(N,z,q,Q,ie,le,b,U=null,k=0){if(On(N,z,q,Q,12))return!1;const H=Oe(N,z)-.45;if(Qi(N,z,q,Q,H+ie+2))return!1;const B=N<80?1:-1,oe=new Y({map:zs(192,512,b),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new V(new De(q,ie,Q),oe);ae.position.set(N,H+ie/2,z),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const j=new Y({map:zs(220,620,Math.min(.86,b+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:pt}),he=new V(new Gt(Q*.78,ie*.74),j);he.position.set(N+B*(q/2+.09),H+ie*.54,z),he.rotation.y=B>0?Math.PI/2:-Math.PI/2,n.add(he);for(const ye of[-1,1]){const Ce=new V(new Gt(q*.82,ie*.72),j.clone());Ce.position.set(N,H+ie*.55,z+ye*(Q/2+.1)),Ce.rotation.y=ye>0?0:Math.PI,n.add(Ce)}const Me=new V(new De(q*1.04,1.2,Q*1.04),new Y({color:1778733,roughness:.34,metalness:.38}));Me.position.set(N,H+ie+.7,z),n.add(Me);const Fe=new Y({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const ye of[-1,1]){const Ce=new V(new De(q*1.1,.22,.18),Fe);Ce.position.set(N,H+ie+1.4,z+ye*(Q/2+.18)),n.add(Ce)}if(U&&k){const ye=new bt({map:ld(U,U==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:pt,depthWrite:!1}),Ce=new V(new Gt(7.5,24),ye);Ce.position.set(N+k*(q/2+.3),H+Math.min(ie-8,ie*.58),z),Ce.rotation.y=k>0?Math.PI/2:-Math.PI/2,n.add(Ce),es("showcase-neon",Ce.position.x,Ce.position.y,Ce.position.z)}return hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:H+ie+2}),Ut("showcase","glassTower"),!0}function na(N,z,q,Q=3.2){const ie=N*.5+Q,le=z*.5+Q,b=Math.max(2,Math.abs(ie-le)*.72),U=N>=z?[-ie,0,-le,ie,0,-le,b,q,0,-ie,0,-le,b,q,0,-b,q,0,ie,0,-le,ie,0,le,b,q,0,ie,0,le,-ie,0,le,-b,q,0,ie,0,le,b,q,0,-b,q,0,-ie,0,le,-ie,0,-le,-b,q,0]:[-ie,0,-le,ie,0,-le,0,q,-b,ie,0,-le,ie,0,le,0,q,b,ie,0,-le,0,q,b,0,q,-b,ie,0,le,-ie,0,le,0,q,b,-ie,0,le,-ie,0,-le,0,q,-b,-ie,0,le,0,q,-b,0,q,b],k=new Wt;return k.setAttribute("position",new Mt(U,3)),k.computeVertexNormals(),k}function or(N,z,q,Q,ie,le,b={}){if(On(N,z,q,Q,12))return!1;const U=Oe(N,z)-.3;if(Qi(N,z,q,Q,U+ie+(b.roofH??8.2)+1,6))return!1;const k=b.frontZ??-1,H=new Y({map:O,color:b.wallColor??14734788,roughness:.68,metalness:.03}),B=new V(new De(q,ie,Q),H);B.position.set(N,U+ie/2,z),B.castShadow=!0,B.receiveShadow=!0,n.add(B);const oe=new Y({map:ft,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=b.roofH??8.2,j=new V(na(q,Q,ae),oe);j.position.set(N,U+ie,z),j.castShadow=!0,j.receiveShadow=!0,n.add(j);const he=new Y({color:15985112,roughness:.42,metalness:.05}),Me=new V(new De(q+7,.42,1.2),he);Me.position.set(N,U+ie+.12,z+k*(Q*.5+1.4)),n.add(Me);const Fe=Me.clone();Fe.position.z=z-k*(Q*.5+1.4),n.add(Fe);const ye=Math.min(18,q*.38),Ce=new V(new De(ye,ie*.55,.32),new Y({map:ut,roughness:.34,metalness:.2}));Ce.position.set(N+q*.18,U+ie*.33,z+k*(Q*.5+.22)),n.add(Ce);const at=new V(new De(5.2,7.2,.28),new Y({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));at.position.set(N-q*.25,U+3.7,z+k*(Q/2+.24)),n.add(at);const mt=new Y({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),yt=new Y({color:3353638,roughness:.38});for(const Yt of[-q*.36,-q*.05,q*.38]){if(Math.abs(Yt-q*.18)<ye*.45)continue;const Un=new V(new De(6.2,4.8,.26),yt);Un.position.set(N+Yt,U+ie*.58,z+k*(Q*.5+.28)),n.add(Un);const Ft=new V(new De(4.8,3.4,.3),mt);Ft.position.copy(Un.position),Ft.position.z+=k*.04,n.add(Ft)}const xt=new Y({color:12370619,roughness:.44,metalness:.04}),He=new V(new De(ye*1.18,.12,34),xt);He.position.set(N+q*.18,Oe(N+q*.18,z+k*(Q*.5+17))+.11,z+k*(Q*.5+17)),n.add(He);const St=new Y({color:5679925,roughness:.86,metalness:.01}),lt=new V(new De(q+10,.08,Q+12),St);lt.position.set(N,Oe(N,z)-.18,z),lt.receiveShadow=!0,n.add(lt),lt.renderOrder=-1;const Xt=new Y({color:3042609,roughness:.84}),pi=[new Y({color:16766544,roughness:.58}),new Y({color:16738974,roughness:.58}),new Y({color:16314584,roughness:.58})];for(let Yt=0;Yt<9;Yt++){const Un=N-q*.44+Yt*(q*.11),Ft=z+k*(Q*.5+2.2+Yt%2*1.5),nn=new V(new qt(1.35+Yt%3*.22,10,7),Yt%4===0?pi[Yt%pi.length]:Xt);nn.position.set(Un,Oe(Un,Ft)+.95,Ft),nn.scale.y=.72,nn.castShadow=!0,n.add(nn)}return hn.push({x:N,z,hw:q*.5,hd:Q*.5,maxY:U+ie+5}),Ut("showcase","lowStorefront"),!0}return ni(45,318,36,84,6404169),ni(116,318,36,84,6074179),ni(44,188,34,84,6798662),ni(118,188,36,84,5941822),ni(43,60,34,82,5679164),ni(118,60,36,82,6864197),tn(18,315,70,54,154,2311775,.72,"HOTEL",1),tn(17,185,72,58,188,1522779,.78,null,0),tn(31,55,44,56,138,2840688,.66,"OPEN",1),tn(24,-75,52,64,182,1913933,.7,null,0),tn(145,315,68,54,116,2776440,.72,null,0),tn(146,185,70,58,146,2314602,.76,null,0),tn(142,55,42,56,156,1590364,.68,"CAFE",-1),tn(134,-75,48,64,114,3688540,.62,null,0),tn(-70,315,52,52,146,2112085,.68,null,0),tn(228,185,48,58,148,3235186,.66,null,0),tn(-78,185,48,56,134,2181730,.68,null,0),tn(236,315,44,54,104,3104884,.66,null,0),or(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),or(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),tn(-48,-360,54,56,148,2439765,.58,null,0),tn(172,-430,50,56,132,3817032,.66,"OPEN",-1),ii(112,227,1.35),ii(104,221,1.05),ii(121,233,1.15),ar(112,217,0),ii(50,292,1.2),ii(111,316,.95),ii(48,137,.9),ii(116,102,1.05),ar(47,248,Math.PI/2),xs(57,226),ta(111,260,-Math.PI/2),je.add(n),n}function Eu(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=dt(i),l=new P(o.tangent.x,0,o.tangent.z).normalize(),c=new P().crossVectors(jt,l).normalize(),u=o.p.clone().addScaledVector(o.side,e*se.width*.5),f=t==="off"?1:-1,m=u.x+l.x*s*f+c.x*e*r,p=u.z+l.z*s*f+c.z*e*r,x=new P(m,Oe(m,p)+.4,p),_=t==="off"?u:x,g=t==="off"?x:u,d=26,v=[];for(let X=0;X<=d;X++){const Z=X/d,ne=Z*Z*(3-2*Z),de=t==="off"?1-(1-Z)*(1-Z):ne;v.push(new P(Pe.lerp(_.x,g.x,Z),Pe.lerp(_.y,g.y,de),Pe.lerp(_.z,g.z,Z)))}const M=7.4,y=new P,E=new P,T=[],R=[];for(let X=0;X<=d;X++)E.subVectors(v[Math.min(d,X+1)],v[Math.max(0,X-1)]),E.y=0,E.normalize(),y.crossVectors(jt,E).normalize(),T.push(v[X].clone().addScaledVector(y,-M)),R.push(v[X].clone().addScaledVector(y,M));const C={kind:"ramp",rampType:t,halfW:M,dirSel:e,mergeS:i,exitS:i,points:v.map(X=>X.clone()),segments:[]};for(let X=0;X<d;X++){const Z=v[X],ne=v[X+1],de=ne.x-Z.x,pe=ne.z-Z.z,Ve=Math.max(1e-4,de*de+pe*pe);C.segments.push({a:Z.clone(),b:ne.clone(),abx:de,abz:pe,lenSq:Ve,u0:X/d,u1:(X+1)/d})}ms.push(C);const w=[];for(let X=0;X<d;X++){const Z=T[X],ne=R[X],de=T[X+1],pe=R[X+1];w.push(Z.x,Z.y,Z.z,ne.x,ne.y,ne.z,pe.x,pe.y,pe.z),w.push(Z.x,Z.y,Z.z,pe.x,pe.y,pe.z,de.x,de.y,de.z)}const S=new Wt;S.setAttribute("position",new Mt(w,3)),S.computeVertexNormals();const L=new Y({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:pt});n.add(new V(S,L));const F=new Y({color:12107972,roughness:.5,metalness:.4});for(let X=0;X<d;X++)wn(n,T[X].clone().setY(T[X].y+1),T[X+1].clone().setY(T[X+1].y+1),.16,F),wn(n,R[X].clone().setY(R[X].y+1),R[X+1].clone().setY(R[X+1].y+1),.16,F);const W=new Y({color:7173241,roughness:.82});for(let X=3;X<d;X+=3){const Z=v[X],ne=Oe(Z.x,Z.z),de=Z.y-ne;if(de<3||On(Z.x,Z.z,3.2,3.2,1.2))continue;const pe=new V(new ot(.9,1.15,de,8),W);pe.position.set(Z.x,ne+de/2,Z.z),n.add(pe),zn.push({x:Z.x,z:Z.z,hw:1.3,hd:1.3,maxY:Z.y-.9})}const te=new bt({map:Bc(a),transparent:!0,side:pt}),ee=new V(new Gt(12,3),te);ee.position.copy(t==="off"?u:x).add(new P(0,t==="off"?6.2:5.5,0)),ee.rotation.y=Math.atan2(-l.x,-l.z)+(t==="off"?Math.PI:0),n.add(ee);for(const X of[-1,1]){const Z=new V(new ot(.2,.26,6,6),W),ne=t==="off"?u:x;Z.position.set(ne.x+c.x*X*5.4,ne.y+3,ne.z+c.z*X*5.4),n.add(Z)}}function Rv(n,e=1){Eu(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function Pv(n,e=-1){Eu(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function Lv(){const n=new st,e=[],t=new nt(14170671),i=new nt(15922680),s=new Y({color:3883336,roughness:.6,metalness:.3}),r=new bt({map:Dv(),transparent:!0,side:pt}),a=new Y({color:4926748,roughness:.9}),o=[new Y({color:2055221,roughness:.92}),new Y({color:3109954,roughness:.95}),new Y({color:2583370,roughness:.9})],l=new Y({color:7040883,roughness:.95,side:pt}),c=12,u=[],f=[];let m=0;for(let x=0;x<se.length;x+=c){if(di(x+c*.5)){m++;continue}const _=dt(x),g=dt(x+c),d=_.p.clone().add(g.p).multiplyScalar(.5),{sideways:v,normal:M,q:y}=bi(_,g);for(const E of[-1,1]){const T=d.clone().addScaledVector(v,E*se.width*.5).addScaledVector(M,.5);u.push(T),f.push(y),e.push(m%2===0?t:i)}if(m%16===8){const E=(m>>4)%2?1:-1,T=d.clone().addScaledVector(v,E*se.width*.52).addScaledVector(M,.4),R=new st,C=new V(new Gt(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,R.add(C);const w=new ot(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new V(w,s);L.position.set(S,1.7,0),R.add(L)}R.position.copy(T),R.quaternion.copy(y),n.add(R)}m++}for(let x=0;x<se.length;x+=16){const _=dt(x),g=1+(Math.random()<.5?1:0);for(let d=0;d<g;d++){const v=Math.random()<.5?-1:1,M=se.width/2+12+Math.random()*78,y=_.p.x+_.side.x*M*v+(Math.random()-.5)*16,E=_.p.z+_.side.z*M*v+(Math.random()-.5)*16;if(uo(y,E,18)||On(y,E,12,12,1.5))continue;const T=Oe(y,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,C=new st,w=2.4+Math.random()*4.2,S=new V(new ot(.26,.42,w,6),a);S.position.y=w/2,C.add(S);const L=2+Math.floor(Math.random()*3);for(let F=0;F<L;F++){const W=new V(new ls(2.4+Math.random()*1.6-F*.2,4.6+Math.random()*2.4,7),o[(d+F+x)%o.length]);W.position.y=w+F*1.4+1.5,W.rotation.y=Math.random()*Math.PI,C.add(W)}C.position.set(y,T+.6,E),C.scale.setScalar(R),n.add(C)}else{const R=1.4+Math.random()*3.6,C=new V(new Ac(R,0),l);C.position.set(y,T+R*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),n.add(C),zn.push({kind:"rock",x:y,z:E,radius:R*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const _=se.length*x/3+6;if(di(_))continue;const g=dt(_),d=dt(_+c),v=g.p.clone().add(d.p).multiplyScalar(.5),{q:M}=bi(g,d),y=se.width*.5+1.2,E=9,T=new st,R=new ot(.4,.55,E,7);for(const F of[-1,1]){const W=new V(R,s);W.position.set(F*y,E/2,0),T.add(W)}const C=y*2,w=new V(new De(C,1.1,1.1),s);w.position.y=E,T.add(w);const S=new bt({map:Bc(p[x]),transparent:!0,side:pt}),L=new V(new Gt(C*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(v),T.quaternion.copy(M),n.add(T)}if(u.length){const x=new ot(.18,.24,3,6);x.translate(0,1.5,0);const _=new qt(.34,8,6);_.translate(0,3.2,0);const g=new Y({color:10134440,roughness:.7,metalness:.2}),d=new Y({roughness:.55}),v=new sn(x,g,u.length),M=new sn(_,d,u.length),y=new Ht;for(let E=0;E<u.length;E++)y.position.copy(u[E]),y.quaternion.copy(f[E]),y.updateMatrix(),v.setMatrixAt(E,y.matrix),M.setMatrixAt(E,y.matrix),M.setColorAt(E,e[E]);v.instanceMatrix.needsUpdate=!0,M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0),n.add(v),n.add(M)}return Rv(n),Pv(n),je.add(n),n}function Dv(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new Qt(n);return t.colorSpace=wt,t}function Bc(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new Qt(e);return i.colorSpace=wt,i}function Iv(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let l=0;l<a;l++)i.fillStyle=l%2?s:r,i.fillRect(l/a*t.width,0,t.width/a+1,t.height);const o=new Qt(t);return o.colorSpace=wt,o}function Uv(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*n.width,a=Math.random()*n.height;e.fillRect(r,a,2.4,2.4)}const i=new Qt(n);return i.colorSpace=wt,i.wrapS=_n,i.repeat.set(3,1),i}function Vt(n,e,t,i,s){const r=new V(new De(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(i),r.castShadow=!1,r.receiveShadow=!0,n.add(r),r}function bi(n,e){const t=e.p.clone().sub(n.p).normalize(),i=zc.crossVectors(jt,t).normalize();let s=t.clone().cross(i).normalize();const r=(n.bank+e.bank)*.5;if(Math.abs(r)>.001){const l=new Ei().setFromAxisAngle(t,r);i.applyQuaternion(l),s.applyQuaternion(l)}const a=new Tt().makeBasis(i,s,t),o=new Ei().setFromRotationMatrix(a);return{tangent:t,sideways:i,normal:s,q:o}}function cd(n,e,t,i){const s=[],r=[],a=[],o=se.width*.47;let l=0;for(let f=e;f<=t;f+=8){const m=dt(Math.min(f,t)),p=bi(m,dt(m.s+2)),x=Math.sin(f*.018)*.04,_=m.p.clone().addScaledVector(p.sideways,-o).addScaledVector(p.normal,.46+x),g=m.p.clone().addScaledVector(p.sideways,o).addScaledVector(p.normal,.46-x);s.push(_.x,_.y,_.z,g.x,g.y,g.z);const d=(f-e)/64;if(r.push(0,d,1,d),l>0){const v=(l-1)*2,M=l*2;a.push(v,v+1,M,v+1,M+1,M)}l++}const c=new Wt;c.setAttribute("position",new Mt(s,3)),c.setAttribute("uv",new Mt(r,2)),c.setIndex(a),c.computeVertexNormals();const u=new V(c,i);u.receiveShadow=!0,n.add(u)}function Fv(n,e){let t=0;for(const i of se.gaps)cd(n,t,Math.max(t,i.start-4),e),t=i.end+4;cd(n,t,se.length,e)}function Nv(n,e,t){const i=dt(e.s+2),{normal:s,q:r}=bi(e,i),a=new st;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new V(new De(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const l=new V(new De(.55,.12,5.2),t);l.position.set(1.25,0,0),l.rotation.y=.62,a.add(l);const c=new V(new De(.42,.1,3.8),t);c.position.set(0,.01,-1.9),a.add(c),n.add(a)}function zv(){const n=new st;je.add(n),nc=0;const e=new Y({color:12171149,roughness:.72,metalness:.08}),t=new Y({color:9869942,roughness:.78,metalness:.05}),i=new Y({color:15255629,roughness:.28,metalness:.72}),s=new Y({color:8204328,roughness:.3,metalness:.85}),r=new Y({color:6120040,roughness:.5,metalness:.6}),a=new Y({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new Y({color:14270570,roughness:.35,metalness:.65}),l=new Y({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),c=new Y({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),u=new Y({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new Y({color:4935486,roughness:.92,metalness:.04}),m=new Y({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new Y({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new Y({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),_=new Y({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new Y({color:15919561,roughness:.82,metalness:.02});new Y({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const d=new Y({map:hv(),roughness:.74,metalness:.08}),v=new bt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),M=12;Fv(n,d);function y(E,T=!1){if(di(E))return!1;const R=dt(E),C=dt(E+3),{sideways:w,normal:S,q:L}=bi(R,C),F=R.p,W=Oe(F.x,F.z),te=F.y-.95;if(te-W<10)return!1;const ee=se.width*(T?.43:.35),X=te,Z=W+.25,ne=T?.56:.42,de=T?2.4:1.75,pe=T?.52:.36,Ve=[],I=[];for(const xe of[-1,1])if(On(F.x+w.x*xe*ee,F.z+w.z*xe*ee,de*2.2,de*2.2,1.2))return!1;for(const xe of[-1,1]){const we=F.clone().addScaledVector(w,xe*ee).addScaledVector(S,-.85);we.y=X;const Ue=new P(we.x,Z,we.z);wn(n,Ue,we,ne,r);const Ze=new V(new ot(de,de*1.12,pe,12),r);Ze.position.set(Ue.x,W+pe*.5,Ue.z),Ze.receiveShadow=!0,n.add(Ze),Ve.push(we),I.push(Ue),zn.push({x:Ue.x,z:Ue.z,hw:de*.92,hd:de*.92,maxY:X-.7})}const Se=F.clone().addScaledVector(S,-1.05);Se.y=X,Vt(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Se,L,a);const ge=I[0].clone();ge.y+=(X-Z)*.28;const be=I[1].clone();be.y+=(X-Z)*.28;const $=Ve[0].clone();$.y-=1;const K=Ve[1].clone();if(K.y-=1,wn(n,ge,K,T?.18:.14,l),wn(n,be,$,T?.18:.14,l),T){const xe=I[0].clone();xe.y+=(X-Z)*.58;const we=I[1].clone();we.y+=(X-Z)*.58,wn(n,I[0].clone().setY(Z+1.2),we,.16,l),wn(n,I[1].clone().setY(Z+1.2),xe,.16,l),wn(n,xe,K,.16,l),wn(n,we,$,.16,l)}return nc++,!0}for(let E=0;E<se.length;E+=M){if(di(E+M*.5))continue;const T=dt(E),R=dt(E+M),C=T.p.clone().add(R.p).multiplyScalar(.5),{sideways:w,normal:S,q:L}=bi(T,R),F=T.p.distanceTo(R.p)+.45,W=Math.floor(E/(M*2))%2?e:t;Vt(n,new P(se.width,.62,F),C.clone().addScaledVector(S,-.05),L,W),Vt(n,new P(se.width-2.8,.08,F*.86),C.clone().addScaledVector(S,.36),L,f),Vt(n,new P(.2,.1,F*.76),C.clone().addScaledVector(w,-se.width*.19).addScaledVector(S,.43),L,f),Vt(n,new P(.2,.1,F*.76),C.clone().addScaledVector(w,se.width*.19).addScaledVector(S,.43),L,f),E%48===0&&(Vt(n,new P(.14,.08,F*.62),C.clone().addScaledVector(w,-se.width*.08).addScaledVector(S,.51),L,_),Vt(n,new P(.14,.08,F*.62),C.clone().addScaledVector(w,se.width*.08).addScaledVector(S,.51),L,_)),E%120===0&&Vt(n,new P(se.width*.42,.07,.72),C.clone().addScaledVector(S,.55),L,g),Vt(n,new P(se.width+1.2,.35,F*.94),C.clone().addScaledVector(S,-.56),L,a),Vt(n,new P(.42,.42,F*.9),C.clone().addScaledVector(w,-se.width*.36).addScaledVector(S,-.78),L,x),Vt(n,new P(.42,.42,F*.9),C.clone().addScaledVector(w,se.width*.36).addScaledVector(S,-.78),L,x);const te=C.clone().addScaledVector(w,-se.width*.51),ee=C.clone().addScaledVector(w,se.width*.51);if(Vt(n,new P(.32,.46,F),te.clone().addScaledVector(S,.28),L,i),Vt(n,new P(.32,.46,F),ee.clone().addScaledVector(S,.28),L,i),Vt(n,new P(.26,.72,F*.94),te.clone().addScaledVector(S,-.22),L,a),Vt(n,new P(.26,.72,F*.94),ee.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const X of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const Z=new V(new ot(.16,.2,.12,10),o);Z.position.copy(C).addScaledVector(w,X).addScaledVector(S,.46),Z.quaternion.copy(L),Z.castShadow=!1,n.add(Z)}if(E%72===0&&(Vt(n,new P(.34,1.56,3.4),C.clone().addScaledVector(w,-se.width*.66).addScaledVector(S,1.16),L,s),Vt(n,new P(.34,1.56,3.4),C.clone().addScaledVector(w,se.width*.66).addScaledVector(S,1.16),L,s),Vt(n,new P(.18,.18,4.4),C.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.94),L,s),Vt(n,new P(.18,.18,4.4),C.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.94),L,s),Vt(n,new P(.12,.12,4),C.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.38),L,i),Vt(n,new P(.12,.12,4),C.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.38),L,i),wn(n,C.clone().addScaledVector(w,-se.width*.58).addScaledVector(S,-1.08),C.clone().addScaledVector(w,se.width*.58).addScaledVector(S,-1.08),.11,l),wn(n,C.clone().addScaledVector(w,-se.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l),wn(n,C.clone().addScaledVector(w,se.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l)),E%96===0){const X=new V(new un(1,28),v);X.rotation.x=-Math.PI/2,X.position.set(C.x,-4.72,C.z),X.scale.set(se.width*.9,Math.max(10,F*2.2),1),X.rotation.z=Math.atan2(bi(T,R).tangent.x,bi(T,R).tangent.z),n.add(X)}if(E%144===0){const X=C.clone().addScaledVector(w,-se.width*.74).addScaledVector(S,2),Z=C.clone().addScaledVector(w,se.width*.74).addScaledVector(S,2);wn(n,X.clone().addScaledVector(S,-1.2),X.clone().addScaledVector(S,1.1),.12,s),wn(n,Z.clone().addScaledVector(S,-1.2),Z.clone().addScaledVector(S,1.1),.12,s),Vt(n,new P(.46,.72,.46),X.clone().addScaledVector(S,1.15),L,c),Vt(n,new P(.46,.72,.46),Z.clone().addScaledVector(S,1.15),L,c)}if(E%288===0){const X=C.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(S,5.2);Vt(n,new P(.44,.44,.44),X.clone(),L,m),wn(n,X.clone().addScaledVector(S,-.2),C.clone().addScaledVector(S,1),.05,l)}E%48===0&&y(E+M*.5,!1),E%168===0&&!di(E+16)&&Nv(n,dt(E+5),u)}for(const E of se.gaps){const T=dt(E.start-3),R=dt(E.end+3);for(const C of[T,R]){const w=dt(C.s+2),{normal:S,q:L}=bi(C,w);Vt(n,new P(se.width-1.2,.08,4.6),C.p.clone().addScaledVector(S,.54),L,c),Vt(n,new P(se.width*.62,.09,1.3),C.p.clone().addScaledVector(S,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,g);for(const F of[-se.width*.42,0,se.width*.42]){const W=C.p.clone().addScaledVector(C.side,F).addScaledVector(S,2.35);Vt(n,new P(.46,.46,.46),W,L,F===0?p:c)}y(C.s+(C===T?-9:9),!0),y(C.s+(C===T?-24:24),!0)}}return n}function Au(n=13710372,e=7740696){const t=new st,i=new Y({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new Y({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new Y({color:329225,roughness:.52,metalness:.12}),a=new Y({color:1053463,roughness:.38,metalness:.34}),o=new Y({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),l=new Y({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),c=new Y({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),u=new Y({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new Y({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),m=new Y({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),p=new Y({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new Y({color:329225,roughness:.44,metalness:.22}),_=new V(new un(3.65,36),new bt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const g=(y,E,T,R,C=null,w=null)=>{const S=new V(E,T);return S.name=y,S.position.copy(R),C&&S.rotation.set(C.x||0,C.y||0,C.z||0),w&&S.scale.copy(w),t.add(S),S},d=(y,E,T,R,C,w,S=0,L=0,F=0)=>g(y,new De(E.x,E.y,E.z),T,new P(R,C,w),new P(S,L,F));d("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),d("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),d("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),d("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),d("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),d("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),d("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),d("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),d("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),d("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),d("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),d("deep rear bumper",new P(5.32,.38,.48),l,0,.58,4.23),d("front windshield",new P(2.8,.13,1.15),c,0,1.78,-1.25,-.48),d("roof glass",new P(2.34,.18,1.55),c,0,2.08,-.2,-.13),d("left side window",new P(.12,.78,1.9),c,-1.28,1.76,-.15,-.08,.04),d("right side window",new P(.12,.78,1.9),c,1.28,1.76,-.15,-.08,-.04),d("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),d("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),d("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let y=0;y<7;y++)d("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);d("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])d("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])d("thin hood crease",new P(.08,.04,2.55),x,y*.36,1.27,-3.45,-.15),d("door seam",new P(.035,.68,1.75),x,y,1.16,-.2),d("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])d("pop up headlight glass",new P(.62,.12,.18),m,y,1.02,-5.28,-.16);d("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])d("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?u:f,y,1.08,4.24);d("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),d("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),d("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),d("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])d("angular side mirror arm",new P(.42,.08,.08),x,y,1.62,-1.55,0,0,y<0?-.14:.14),d("blue tinted side mirror",new P(.12,.34,.46),c,y*1.03,1.62,-1.65,0,y<0?.24:-.24),d("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])d("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,y),d("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,y);d("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const v=[],M=(y,E,T=!1)=>{const R=new st;R.name=T?"steering front wheel assembly":"rear wheel assembly",R.position.set(y,.54,E);const C=new V(new ot(.88,.88,.62,28),r);C.name="wide performance tire",C.rotation.z=Math.PI/2,R.add(C);const w=new V(new Ks(.88,.06,10,32),r);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,R.add(w);const S=new V(new ot(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,R.add(S);const L=new V(new ot(.56,.56,.08,24),p);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,R.add(L);for(let te=0;te<8;te++){const ee=new V(new De(.08,.055,.62),o);ee.name="thin wheel spoke",ee.rotation.x=te/8*Math.PI*2,ee.position.set(y>0?.035:-.035,0,.22),R.add(ee)}const F=new V(new De(.1,.22,.18),f);F.name="small brake caliper",F.position.set(y>0?-.39:.39,.18,-.38),R.add(F);const W=new V(new ot(.17,.17,.72,18),l);W.name="dark center cap",W.rotation.z=Math.PI/2,R.add(W),t.add(R),T&&v.push(R)};for(const y of[-2.4,2.4])M(y,-2.65,!0),M(y,2.42,!1);t.userData.frontWheels=v,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new V(new ot(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),je.add(t),t}function Ov(){const n=new st,e=new Y({color:3949112,roughness:.62,metalness:.3}),t=new Y({color:460551,roughness:.55}),i=new Y({color:3162419,roughness:.5,metalness:.42}),s=new Y({color:16767297,roughness:.38,metalness:.25}),r=new Y({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new Y({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new Y({color:1118995,roughness:.7,metalness:.05}),l=new V(new De(2.2,.24,2.2),e);l.position.set(0,-.78,-2.2),n.add(l);const c=new V(new De(.16,.028,1.92),i);c.position.set(0,-.64,-2.28),n.add(c);const u=new V(new De(2.55,.18,.52),t);u.position.set(0,-.48,-1.25),u.rotation.x=-.08,n.add(u);const f=new V(new Gt(2.8,.82,1,1),a);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,n.add(f);const m=new V(new Ks(.36,.035,12,48),o);m.position.set(0,-.46,-1.02),m.rotation.x=Math.PI/2.75,n.add(m);for(let p=0;p<3;p++){const x=new V(new De(.34,.025,.035),i);x.position.copy(m.position),x.rotation.copy(m.rotation),x.rotation.z+=p/3*Math.PI*2,n.add(x)}for(let p=0;p<6;p++){const x=new V(new ot(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),n.add(x)}for(const p of[-1.08,1.08]){const x=new V(new ot(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),n.add(x);const _=new V(new Ks(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(p*.8,-.48,-1.74),_.rotation.x=Math.PI/2,n.add(_)}for(const p of[-1.14,-.84,.84,1.14]){const x=new V(new ot(.035,.04,.028,8),i);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const p of[-.52,.52]){const x=new V(new qt(.045,12,8),r);x.position.set(p,-.34,-1.22),n.add(x)}n.position.set(0,0,0),Re.add(n),on=n}function Bv(){const n=new Y({color:16119285,roughness:.35,metalness:.25}),e=new Y({color:1184274,roughness:.45}),t=new Y({map:cv(),roughness:.42,metalness:.05}),i=new Y({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=dt(0),r=new Tt().makeBasis(s.side,jt,s.tangent),a=new Ei().setFromRotationMatrix(r),o=new st;for(const u of[-se.width*.58,se.width*.58]){const f=new V(new De(.8,11,.8),n);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,5.4),f.quaternion.copy(a),o.add(f)}const l=new V(new De(se.width+3,.8,1),t);l.position.copy(s.p).addScaledVector(jt,11.2),l.quaternion.copy(a),o.add(l);const c=new V(new De(se.width+1.2,1.4,.18),e);c.position.copy(s.p).addScaledVector(jt,12.5).addScaledVector(s.tangent,-.55),c.quaternion.copy(a),o.add(c);for(const u of[-se.width*.38,0,se.width*.38]){const f=new V(new qt(.32,16,10),i);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,10.25),o.add(f)}return je.add(o),o}const Cu=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],In=Cu.map((n,e)=>({...n,idx:e,mesh:Au(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),kv=In[0].mesh,Bt=Au(3108784,1916782);for(const n of In)n.mesh.visible=!1,je.add(n.mesh);function po(n){for(const e of In)e.mesh.visible=n}const Vv=[10,6,4,2];let It=null;try{It=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function jr(){return It?.active?It.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Ru(){localStorage.setItem("steel-ribbon-season",JSON.stringify(It))}function Gv(){It={division:jr(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Ru()}function Pu(n){return["One","Two","Three","Four"][Pe.clamp(n,1,4)-1]}function Lu(){return[{key:"you",label:"You",pts:It?.points.you??0},...Cu.map(e=>({key:e.key,label:e.label,pts:It?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Bt.visible=!1;Sv();yv();ke.signs=0;to.length=0;bv();wv();Cv();let hd=null,dd=null,ud=null,on=null,il=null;const $t=[];Ov();function Fa(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),je.remove(n))}const Gs=[],Yr=[];let fd=null;function Hv(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new Qt(n);return t.colorSpace=wt,t}function Wv(n,e){if(di(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of ms)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function Xv(n){const e=new Y({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:pt}),t=new ot(.09,.12,1.05,6),i=new Y({color:4210757,roughness:.55,metalness:.5}),s=6;let r=0,a=0;const o=new sn(t,i,Math.ceil(se.length/12*2)+8),l=new Ht;for(const c of[-1,1]){const u=c*(se.width*.5+.55),f=[],m=x=>{if(!(x.length<2)){for(let _=0;_<x.length-1;_++){const g=x[_],d=x[_+1];f.push(g.x,g.y+1.12,g.z,d.x,d.y+1.12,d.z,d.x,d.y+1.5,d.z),f.push(g.x,g.y+1.12,g.z,d.x,d.y+1.5,d.z,g.x,g.y+1.5,g.z)}r++}};let p=[];for(let x=0;x<=se.length;x+=s){if(Wv(x%se.length,c)){m(p),p=[];continue}const _=dt(x%se.length);if(p.push(_.p.clone().addScaledVector(_.side,u).addScaledVector(jt,.58)),x%12===0){const g=p[p.length-1];l.position.set(g.x,g.y+.95,g.z),l.updateMatrix(),o.setMatrixAt(a++,l.matrix)}}if(m(p),f.length){const x=new Wt;x.setAttribute("position",new Mt(f,3)),x.computeVertexNormals(),n.add(new V(x,e))}}o.count=a,o.instanceMatrix.needsUpdate=!0,n.add(o),ke.railRuns=r,ke.railPosts=a}function qv(){Gs.length=0,Yr.length=0;const n=new st,e=new bt({map:Hv(),transparent:!0,depthWrite:!1,side:pt,blending:Kn,opacity:.9}),t=new Gt(3.6,5.4);t.rotateX(-Math.PI/2);for(let l=170;l<se.length-60;l+=290){if(se.gaps.some(x=>l>x.start-70&&x.end+70>l))continue;const c=[-.24,0,.24][Gs.length%3]*se.width,u=dt(l),f=new V(t,e),m=new P().crossVectors(u.side,u.tangent).normalize();m.y<0&&m.multiplyScalar(-1);const p=new Tt().makeBasis(u.side,m,new P().crossVectors(u.side,m).normalize());f.quaternion.setFromRotationMatrix(p),f.position.copy(u.p).addScaledVector(u.side,c).addScaledVector(m,.84),n.add(f),Gs.push({s:l,lat:c})}const i=new qt(.17,8,6),s=new Y({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),r=Math.max(60,Math.round(se.length/24));{const l=new sn(i,s,r*2),c=new Ht;let u=0;for(let f=0;f<r;f++){const m=f/r*se.length;if(di(m))continue;const p=dt(m);for(const x of[-1,1])c.position.copy(p.p).addScaledVector(p.side,x*(se.width*.5+.22)).addScaledVector(jt,.78),c.updateMatrix(),l.setMatrixAt(u++,c.matrix)}l.count=u,l.instanceMatrix.needsUpdate=!0,n.add(l)}const a=new ot(.09,.12,1.5,8),o=new Y({color:2500134,roughness:.6,metalness:.4});for(const l of se.gaps){const c=dt(Math.max(6,l.start-22));for(const u of[-1,1]){const f=new Y({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),m=new st,p=new V(a,o),x=new V(new qt(.3,10,8),f);p.position.y=.75,x.position.y=1.65,m.add(p),m.add(x),m.position.copy(c.p).addScaledVector(c.side,u*(se.width*.5+.55)).addScaledVector(jt,.55),n.add(m),Yr.push(f)}}return Xv(n),je.add(n),n}Bn(new Ht,n=>{if(!Yr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Yr)t.emissiveIntensity=e});function Qr(n){return ks=Pe.clamp(n,0,fs.length-1),se=fs[ks],zn.length=0,ms.length=0,Fa(hd),Fa(dd),Fa(ud),Fa(fd),hd=zv(),dd=Bv(),ud=Lv(),fd=qv(),Vc(),$e.trackName.textContent=se.name,$e.courseName&&($e.courseName.textContent=se.name),$e.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ks)}),se.name}Qr(0);function Yv(){il&&je.remove(il),$t.length=0;const n=new st,e=new Y({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new bt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:pt,blending:Kn}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const r=i[s],a=Oe(r.x,r.z)+4.2,o=new st,l=new V(new Ks(5.6,.22,12,52),e.clone());l.rotation.y=r.yaw,o.add(l);const c=new V(new un(4.7,32),t.clone());c.rotation.y=r.yaw,o.add(c);const u=new Y({color:1120288,roughness:.42,metalness:.55});for(const m of[-5.1,5.1]){const p=new V(new ot(.11,.16,6.2,8),u);p.position.set(Math.cos(r.yaw)*m,-1.1,Math.sin(r.yaw)*m),o.add(p)}const f=new V(new qt(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,n.add(o),$t.push({...r,y:a,radius:8.5,marker:o,collected:!1})}Bn(n,s=>{for(let r=0;r<$t.length;r++){const a=$t[r],o=r===h.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(l=>{l.material?.emissive&&(l.material.emissiveIntensity=o?2.4:.65)})}}),je.add(n),il=n}Yv();function $v(){const n=new st,e=new Y({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,r=-1330+Math.random()*1620,a=15+Math.random()*12;if(On(s,r,a*2+14,a*2+14,10)||Cn(s,r,a).clearance<-6||$t.some(u=>Math.hypot(u.x-s,u.z-r)<a+26)||js.some(u=>Math.hypot(u.x-s,u.z-r)<u.rx+a+60)||hn.some(u=>Math.abs(u.x-s)<u.hw+a+2&&Math.abs(u.z-r)<u.hd+a+2)||Si.some(u=>{const f=u.radius!=null?u.radius:Math.max(u.hw??0,u.hd??0);return Math.hypot(u.x-s,u.z-r)<f+a+2})||Pr.some(u=>Math.hypot(u.x-s,u.z-r)<(u.radius||4)+a+2))continue;const o=Oe(s,r);if(Math.max(Math.abs(Oe(s+a,r)-o),Math.abs(Oe(s-a,r)-o),Math.abs(Oe(s,r+a)-o),Math.abs(Oe(s,r-a)-o))>1.7)continue;const l=new V(new ao(a*.96,a*1.18,36),e);l.rotation.x=-Math.PI/2,l.position.set(s,o+.09,r),l.renderOrder=-4,n.add(l);const c=new V(new un(a,36),Su(Math.max(1.2,a/13)));c.rotation.x=-Math.PI/2,c.position.set(s,o+.15,r),c.renderOrder=-3,n.add(c),bu(s,r,a*.98),t++}ke.ponds=t,je.add(n),Vc()}$v();const Zv=new bt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),Wa=Array.from({length:42},()=>{const n=new V(new qt(.14,6,5),Zv);return n.visible=!1,je.add(n),{mesh:n,life:0,velocity:new P}}),Kv=new bt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:pt}),sc=Array.from({length:14},()=>{const n=new V(new ao(.82,1,28),Kv.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,je.add(n),{mesh:n,life:0,maxLife:1}});function Du(n,e,t=1){const i=sc.find(s=>s.life<=0)||sc[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,Oe(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function Jv(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=Wa.find(r=>r.life<=0)||Wa[i%Wa.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}Du(n.x,n.z,1.6)}Bn(new Ht,(n,e)=>{for(const t of Wa)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of sc)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const sr=new ev(Zt);sr.addPass(new tv(je,Re));const Iu=new Js(new Te(window.innerWidth,window.innerHeight),.4,.72,.86);sr.addPass(Iu);sr.addPass(new nv);const jv={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},br=new pu(jv);sr.addPass(br);const Qv=new Y({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Lr=Array.from({length:72},()=>{const n=new V(new qt(.1,8,5),Qv);return n.visible=!1,je.add(n),{mesh:n,life:0,velocity:new P}}),e_=new bt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:pt}),Dr=Array.from({length:90},()=>{const n=new V(new un(1,18),e_.clone());return n.visible=!1,je.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),t_=new Y({color:2962232,roughness:.58,metalness:.34}),Ir=Array.from({length:48},()=>{const n=new V(new De(.18,.08,.26),t_);return n.visible=!1,je.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Xe=null;function Uu(){if(Xe)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=(_,g)=>{const d=n.createOscillator(),v=n.createGain();return d.type=_,v.gain.value=g,d.connect(v),v.connect(t),d.start(),{o:d,g:v}},r=s("sawtooth",.5),a=s("square",.26),o=s("triangle",.1),l=n.createBuffer(1,n.sampleRate*2,n.sampleRate),c=l.getChannelData(0);for(let _=0;_<c.length;_++)c[_]=Math.random()*2-1;const u=(_,g,d,v)=>{const M=n.createBufferSource(),y=n.createBiquadFilter(),E=n.createGain();return M.buffer=l,M.loop=!0,M.playbackRate.value=v,y.type=_,y.frequency.value=g,y.Q.value=d,E.gain.value=1e-4,M.connect(y),y.connect(E),E.connect(e),M.start(),{filter:y,gain:E}},f=u("bandpass",900,.6,1),m=u("highpass",1800,.8,.82),p=u("bandpass",300,1.4,.5),x=n.createGain();x.gain.value=1e-4,x.connect(e),Xe={ctx:n,master:e,engine:r.o,engineGain:i,filter:t,rumble:r,growl:a,whine:o,wind:f,skid:m,boost:p,musicGain:x,nextNote:0,beat:0,prevBoost:!1}}function Qs(){Xe||Uu(),Xe?.ctx.state==="suspended"&&Xe.ctx.resume().catch(()=>{})}function Xa(n){if(!Xe)return;const{ctx:e}=Xe,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Xe.master),t.start(),t.stop(e.currentTime+.24)}function n_(){if(!Xe)return;const{ctx:n}=Xe,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Xe.master),e.start(),e.stop(n.currentTime+.6)}function i_(){if(!Xe)return;const n=Xe.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Fu(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Xe.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),r=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),r.gain.setValueAtTime(.22,n.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(r).connect(Xe.master),s.start(),s.stop(n.currentTime+.26)}let sl=null;function Fu(){if(sl)return sl;const n=Xe.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return sl=e}function s_(n=1){if(!Xe)return;const{ctx:e}=Xe,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Fu(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Xe.master),t.start(e.currentTime,Math.random()*1.2,.36)}const pd={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function md(n,e,t,i,s,r){const{ctx:a}=Xe,o=a.createOscillator(),l=a.createBiquadFilter(),c=a.createGain();o.type=i,o.frequency.value=n,l.type="lowpass",l.frequency.value=r,c.gain.setValueAtTime(1e-4,e),c.gain.linearRampToValueAtTime(s,e+.02),c.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(l),l.connect(c),c.connect(Xe.musicGain),o.start(e),o.stop(e+t+.05)}function r_(){const{ctx:n}=Xe,e=60/92/2;for(Xe.nextNote<n.currentTime-1&&(Xe.nextNote=n.currentTime+.08);Xe.nextNote<n.currentTime+.35;){const t=Xe.beat%32,i=t/8|0;t%4===0&&md(pd.bass[i],Xe.nextNote,.5,"triangle",.5,420),md(pd.arps[i][t%4],Xe.nextNote,.19,"sawtooth",.16,1300),Xe.nextNote+=e,Xe.beat++}}function Hs(n,e=18){const t=Math.min(e,Lr.length);for(let i=0;i<t;i++){const s=Lr.find(r=>r.life<=0)||Lr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Nu(n,e=10,t=1){const i=Math.min(e,Dr.length);for(let s=0;s<i;s++){const r=Dr.find(a=>a.life<=0)||Dr[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function a_(n,e=8,t=1){const i=Math.min(e,Ir.length);for(let s=0;s<i;s++){const r=Ir.find(a=>a.life<=0)||Ir[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function o_(n,e=Math.abs(h.speed),t="CRASH"){const i=Pe.clamp(Math.abs(e)/70,.18,1.45);h.collisionHits++,h.collisionDrama=Math.max(h.collisionDrama,i),h.cameraShake=Math.max(h.cameraShake,.25+i*.45),h.damage=Pe.clamp(h.damage+i*3.6,0,100),h.message=t,h.messageTimer=Math.max(h.messageTimer,.7),Hs(n,Math.round(10+i*24)),Nu(n,Math.round(5+i*12),i),a_(n,Math.round(3+i*8),i),Xa(18+i*34)}function l_(n){for(const e of Lr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Dr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Re.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Ir)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function c_(){if(!Xe)return;const{ctx:n}=Xe,e=n.currentTime,t=h.mode==="race"||h.mode==="roam"||h.mode==="paused",i=h.tachRpm||900,s=Pe.clamp((i-900)/6600,0,1),r=Math.abs(h.speed),a=h.mode==="roam"&&h.waterDepth||0,o=46+s*142;Xe.rumble.o.frequency.setTargetAtTime(o,e,.03),Xe.growl.o.frequency.setTargetAtTime(o*1.5+3.2,e,.03),Xe.whine.o.frequency.setTargetAtTime(o*4.03,e,.03),Xe.whine.g.gain.setTargetAtTime(.04+s*.17,e,.08),Xe.filter.frequency.setTargetAtTime((420+s*2400+r*5)*(1-.6*a),e,.06),Xe.engineGain.gain.setTargetAtTime((t&&h.mode!=="paused"?.05+s*.052:1e-4)*(1-.42*a),e,.07),Xe.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Xe.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const l=h.mode==="roam"?h.roamSlip:h.grounded?Math.min(1,Math.abs(h.lateralVel)/15):0;Xe.skid.gain.gain.setTargetAtTime(t&&l>.32?(l-.32)*.15:1e-4,e,.09),h.boosting&&!Xe.prevBoost&&n_(),Xe.prevBoost=!!h.boosting,Xe.boost.gain.gain.setTargetAtTime(t&&h.boosting?.15:1e-4,e,h.boosting?.05:.22),Xe.boost.filter.frequency.setTargetAtTime(h.boosting?420+r*3:260,e,.1),Xe.musicGain.gain.setTargetAtTime(h.mode==="menu"?.16:.028,e,.5),r_()}function $r(n=!1,e=!1,t=!1){Uu(),Qs(),At.clear(),Kr();const i=n||e;h.seasonRace=t&&!i;for(let r=0;r<In.length;r++){const a=In[r];a.distance=i?-900:-26-r*7,a.finished=0,a.mesh.visible=!i}Object.assign(h,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=dt(h.s);h.y=s.p.y+2.1,h.yVel=0,$e.menu.classList.add("hidden"),$e.result.classList.add("hidden"),$e.resultStats.innerHTML="",$e.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",$e.trackName.textContent=se.name,Bt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Ai(),window.__freeCam=!1}function kc(){Qs(),h.mode="roam",h.practice=!0,h.freeRun=!1,At.clear(),Kr();let n=80,e=338;Cn(n,e,6).clearance<6&&(n=80,e=320),h.roamPos.set(n,Oe(n,e),e),h.roamYaw=0,h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Ie.zoom=0,h.wheelSteer=0,h.speed=0,h.boost=1,h.damage=0,h.cameraShake=0,h.collisionDrama=0,h.collisionHits=0,h.collisionCooldown=0,h.objectiveIndex=0,h.objectiveHits=0,h.objectiveLap=1;for(const s of $t)s.collected=!1;h.message="",h.messageTimer=0,po(!1),Bt.visible=!0,on&&(on.visible=!1),document.body.classList.add("roam-mode"),Ai(),window.__freeCam=!1,$e.menu.classList.add("hidden"),$e.result.classList.add("hidden"),$e.position.textContent="FREE ROAM",$e.trackName.textContent="City Streets",cs();const t=Math.sin(h.roamYaw),i=-Math.cos(h.roamYaw);Re.position.set(h.roamPos.x-t*17,h.roamPos.y+7.2,h.roamPos.z-i*17),ac(),Re.lookAt(h.roamPos.x+t*13,h.roamPos.y+2.45,h.roamPos.z+i*13),Re.fov=69,Re.updateProjectionMatrix()}function cs(){Bt.position.set(h.roamPos.x,h.roamPos.y+.3-h.roamSuspension*.45-(h.waterDepth||0)*.38,h.roamPos.z),Bt.quaternion.setFromAxisAngle(jt,-h.roamYaw),Bt.rotateZ(-h.wheelSteer*Pe.clamp(Math.abs(h.speed)/90,0,1)*.1),Bt.rotateX(Pe.clamp(h.roamSuspension,-.16,.22))}function zu(n,e){let t=null;for(const s of ms)for(const r of s.segments){const a=n-r.a.x,o=e-r.a.z,l=Pe.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),c=r.a.x+r.abx*l,u=r.a.z+r.abz*l,f=Math.hypot(n-c,e-u);if(f>s.halfW+xn*1.15)continue;const m=Pe.lerp(r.a.y,r.b.y,l),p=Pe.lerp(r.u0,r.u1,l),x=f+Math.max(0,Oe(n,e)-m)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:m,u:p,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function Ou(n,e,t=Oe(n,e),i=!1){let s=null;const r=10;for(let o=0;o<se.length;o+=r){if(di(o+r*.5))continue;const l=dt(o),c=dt(o+r),u=c.p.x-l.p.x,f=c.p.z-l.p.z,m=Math.max(1e-4,u*u+f*f),p=Pe.clamp(((n-l.p.x)*u+(e-l.p.z)*f)/m,0,1),x=l.p.x+u*p,_=l.p.z+f*p,g=n-x,d=e-_,v=Math.hypot(g,d);if(v>se.width*.5+xn*.45)continue;const M=Pe.lerp(l.p.y,c.p.y,p)+.58;if(!i&&t<M-5)continue;const y=new P(f,0,-u).normalize(),E=Pe.clamp(g*y.x+d*y.z,-se.width*.44,se.width*.44);(!s||v<s.dist)&&(s={kind:"track",y:M,s:o+r*p,lateral:E,tangentX:u,tangentZ:f,dist:v})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function rs(n,e,t=h.roamPos.y){const i=Oe(n,e);let s={kind:"ground",y:i};const r=zu(n,e);r&&r.y>=i-1.2&&(s=r);const a=Ou(n,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function xd(n){if(n.rampType==="off")return!1;const e=Math.sin(h.roamYaw)*n.tangentX+-Math.cos(h.roamYaw)*n.tangentZ;if(h.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=dt(t);return h.mode="race",h.practice=!0,h.freeRun=!0,h.breakdownTimer=0,h.s=i.s,h.totalDistance=i.s,h.lastSafeS=i.s,h.lastSafeDistance=i.s,h.lateral=Pe.clamp(n.lateral??0,-se.width*.32,se.width*.32),h.lateralVel=-Math.sign(h.lateral)*Math.min(4,Math.abs(h.speed)*.04),h.speed=Pe.clamp(Math.max(28,h.speed),18,112),h.grounded=!0,h.y=i.p.y+2.1,h.yVel=0,h.airtime=0,h.rivalS=-900,h.rivalDistance=-900,h.leadState="SOLO",h.message="Merged onto the ribbon",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.35),po(!1),Bt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Ai(),$e.position.textContent="FREE RUN",$e.trackName.textContent=se.name,cs(),!0}function h_(n){if(!n||h.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,r=e.abz/i;h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(t.x+s*3.5,t.y+Gn,t.z+r*3.5),h.roamYaw=Math.atan2(s,-r),h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,h.wheelSteer=0,h.speed=Pe.clamp(Math.max(24,Math.abs(h.speed)*.82),20,78),h.grounded=!0,h.yVel=0,h.airtime=0,h.message="Exited to city streets",h.messageTimer=1.25,h.cameraShake=Math.max(h.cameraShake,.22),po(!1),Bt.visible=!0,on&&(on.visible=!1),document.body.classList.add("roam-mode"),Ai(),$e.position.textContent="FREE ROAM",$e.trackName.textContent="City Streets",cs();const a=Math.sin(h.roamYaw),o=-Math.cos(h.roamYaw);return Re.position.set(h.roamPos.x-a*17,h.roamPos.y+7.2,h.roamPos.z-o*17),Re.lookAt(h.roamPos.x+a*13,h.roamPos.y+2.45,h.roamPos.z+o*13),Re.fov=69,Re.updateProjectionMatrix(),Hs(h.roamPos.clone().add(new P(0,.6,0)),10),!0}function d_(){const n=ho.set(0,0,-1).applyQuaternion(Re.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.roamPos.y,yVel:h.yVel,grounded:!0,objectiveHits:h.objectiveHits,waterDepth:+(h.waterDepth||0).toFixed(3),roamPos:{x:h.roamPos.x,y:h.roamPos.y,z:h.roamPos.z},input:{steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake},forwardWorld:{x:Math.sin(h.roamYaw),y:0,z:-Math.cos(h.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var hs=document.createElement("canvas");hs.id="minimap",hs.width=256,hs.height=256;document.querySelector("#app")?.appendChild(hs);var rc=null,u_=0,as={cx:0,cz:-570,span:2180};function ri(n,e,t){return[((n-as.cx)/as.span+.5)*t,((e-as.cz)/as.span+.5)*t]}function Vc(){if(!as)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Nt.x0;s<=Nt.x1+1;s+=Nt.pitch){const[r,a]=ri(s,Nt.zNear,n),[o,l]=ri(s,Nt.zFar,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,l),t.stroke()}for(let s=Nt.zNear;s>=Nt.zFar-1;s-=Nt.pitch){const[r,a]=ri(Nt.x0,s,n),[o,l]=ri(Nt.x1,s,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,l),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of fo())if(s.courseIndex===ks){const[r,a]=ri(s.x,s.z,n);i?t.moveTo(r,a):t.lineTo(r,a),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of js){const[r,a]=ri(s.x,s.z,n);t.beginPath(),t.ellipse(r,a,Math.max(3,s.rx/as.span*n),Math.max(3,s.rz/as.span*n),0,0,Math.PI*2),t.fill()}rc=e}function f_(){const n=h.mode==="roam";if((hs.style.display=n?"block":"none")&&!n||!n||!rc||u_++%2)return;const e=hs.width,t=hs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(rc,0,0,e,e);for(const r of ms)if(r.rampType==="on"&&r.points?.length){const a=r.points[0],[o,l]=ri(a.x,a.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,l,4,0,Math.PI*2),t.fill()}for(let r=0;r<$t.length;r++){const a=$t[r],[o,l]=ri(a.x,a.z,e),c=r===h.objectiveIndex%$t.length;t.fillStyle=c?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,l,c?5.5+Math.sin(eo*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const r of Pn){const[a,o]=ri(r.x,r.z,e);t.fillRect(a-1.4,o-1.4,2.8,2.8)}const[i,s]=ri(h.roamPos.x,h.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(h.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}Vc();let Ji=null;function p_(){Ji||(Ji=new V(new ot(2.4,3.2,620,12,1,!0),new bt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:Kn,side:pt,fog:!1})),Ji.renderOrder=5,je.add(Ji));const n=h.mode==="roam"&&$t.length>0;if(Ji.visible=n,!n)return;const e=$t[h.objectiveIndex%$t.length];Ji.position.set(e.x,e.y+296,e.z),Ji.material.opacity=.1+Math.sin(eo*3.1)*.04}function m_(){if(h.mode!=="roam"||$t.length===0)return;const n=$t[h.objectiveIndex%$t.length];if(!n)return;const e=h.roamPos.x-n.x,t=h.roamPos.z-n.z,i=Math.abs(h.roamPos.y-n.y);e*e+t*t>n.radius*n.radius||i>8.5||(n.collected=!0,h.objectiveHits++,h.objectiveIndex=(h.objectiveIndex+1)%$t.length,h.objectiveIndex===0&&h.objectiveLap++,h.score+=420+Math.round(Math.abs(h.speed)*5),h.boost=Math.min(1,h.boost+.32),h.cameraShake=Math.max(h.cameraShake,.18),h.message=n.label,h.messageTimer=1.05,Rr(`+${420+Math.round(Math.abs(h.speed)*5)} GATE`,!0),Xr(880,.16),setTimeout(()=>Xr(1245,.2),90),Hs(new P(n.x,n.y,n.z),18))}function Bu(n){const e=h.speed;h.collisionCooldown=Math.max(0,h.collisionCooldown-n);const t=Math.max(At.has("KeyW")||At.has("ArrowUp")?1:0,Ie.throttle),i=Math.max(At.has("KeyS")||At.has("ArrowDown")?1:0,Ie.brake),s=Pe.clamp((At.has("KeyD")||At.has("ArrowRight")?1:0)-(At.has("KeyA")||At.has("ArrowLeft")?1:0)+Ie.steer,-1,1)*gu,r=(At.has("ShiftLeft")||At.has("ShiftRight"))&&h.boost>.02&&t>.03;if(t>.03){const v=h.speed<0?38:0;h.speed+=((r?70:42)+v)*t*n}i>.03&&(h.speed-=(h.speed>1.2?78:32)*i*n),h.speed-=.00235*h.speed*Math.abs(h.speed)*n,Math.abs(h.speed)>.08?h.speed-=Math.sign(h.speed)*3.6*n:t<=.03&&i<=.03&&(h.speed=0),h.speed=Pe.clamp(h.speed,-24,135),h.boosting=r,r?h.boost=Math.max(0,h.boost-n*.22):h.boost=Math.min(1,h.boost+n*.05),h.wheelSteer+=(s-h.wheelSteer)*(1-Math.pow(1e-5,n));const a=-h.wheelSteer*.55,o=Bt.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const l=Math.abs(h.speed);if(l>tc){const v=Pe.clamp((l-tc)/5,0,1),M=1-.36*Pe.clamp((l-34)/85,0,1),y=rv*1.08*v*M;h.roamYaw+=h.wheelSteer*y*n*Math.sign(h.speed)}const c=Math.sin(h.roamYaw),u=-Math.cos(h.roamYaw),f=(h.speed-e)/Math.max(.001,n),m=Pe.clamp(Math.abs(h.wheelSteer)*Math.max(0,l-18)/68+Math.max(0,-f-34)/90,0,1);if(h.roamSlip+=(m-h.roamSlip)*(1-Math.pow(.01,n)),h.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,l/540)+Math.abs(f)*.0018-h.roamSuspension)*(1-Math.pow(.018,n)),h.roamSlip>.38&&Math.random()<n*(3+h.roamSlip*7)){const v=new P(h.roamPos.x-c*3.2,h.roamPos.y+.2,h.roamPos.z-u*3.2);Nu(v,2,h.roamSlip)}const p=Math.abs(h.speed)*n,x=Math.max(1,Math.ceil(p/1.2));let _=!1,g=!1,d=rs(h.roamPos.x,h.roamPos.z,h.roamPos.y);for(let v=0;v<x;v++)h.roamPos.x+=c*h.speed*n/x,h.roamPos.z+=u*h.speed*n/x,d=rs(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+Gn,y_(h.roamPos,d)&&(g=!0),S_(h.roamPos,d)&&(_=!0),d=rs(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+Gn;h.roamPos.x=Pe.clamp(h.roamPos.x,-820,820),h.roamPos.z=Pe.clamp(h.roamPos.z,-1620,480),_&&(h.collisionCooldown<=0&&(o_(new P(h.roamPos.x,h.roamPos.y+.8,h.roamPos.z),e,"IMPACT"),h.collisionCooldown=.38),h.speed*=.28),g&&(h.speed*=.62,h.cameraShake=Math.max(h.cameraShake,.22),h.message="SPLAT!",h.messageTimer=.9),x_(n,e),g_(n,_),d=rs(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+Gn,!(d.kind==="ramp"&&d.u>.72&&xd(d))&&(d.kind==="track"&&xd(d)||(m_(),cs(),At.has("KeyR")&&(kc(),At.delete("KeyR"))))}const xn=2.6;function x_(n,e){const t=h.waterDepth||0;if(h.roamPos.y>Oe(h.roamPos.x,h.roamPos.z)+2.5){h.waterDepth=0;return}const i=_v(h.roamPos.x,h.roamPos.z);h.waterDepth=i.depth,!(i.depth<=.02)&&(h.speed-=h.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(Jv(h.roamPos.clone(),Math.abs(e)),s_(Math.abs(e)/60),h.cameraShake=Math.max(h.cameraShake,.16),h.message="SPLASH",h.messageTimer=.7),h.wakeT=(h.wakeT??0)-n,Math.abs(h.speed)>5&&h.wakeT<=0&&(h.wakeT=.15,Du(h.roamPos.x-Math.sin(h.roamYaw)*1.5,h.roamPos.z+Math.cos(h.roamYaw)*1.5,.8+Math.abs(h.speed)*.012)))}function g_(n,e){for(const t of Pn)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(h.speed)<32||h.collisionCooldown>0))for(const t of Pn){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=h.roamPos.x-t.x,r=h.roamPos.z-t.z,a=(t.hw+t.hd)*.5+xn+2.4;if(s*s+r*r<a*a&&Math.abs(h.roamPos.y-(t.maxY??h.roamPos.y))<7){i.nearMissT=1.8,h.score+=45,h.nearMisses+=1,Rr("+45 NEAR MISS"),Xr(520,.12,"square",.07);break}}}function rl(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Gn+.45)continue;if(s.radius){const f=s.radius+xn,m=n.x-s.x,p=n.z-s.z,x=m*m+p*p;if(x>=f*f)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(x));n.x=s.x+m/_*f,n.z=s.z+p/_*f;continue}const r=s.hw+xn,a=s.hd+xn,o=n.x-s.x,l=n.z-s.z;if(Math.abs(o)>=r||Math.abs(l)>=a)continue;t=!0;const c=r-Math.abs(o),u=a-Math.abs(l);c<u?n.x=s.x+(o<0?-r:r):n.z=s.z+(l<0?-a:a)}return t}function ku(n,e=h.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Nt.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,r=n.mesh?.position?.z??n.collider?.z??n.along,a=n.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;n.avoidOffset=Pe.clamp((n.avoidOffset||0)+a*i*.9,-i,i),t&&(ke.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=a*.08),h.mode==="roam"&&(h.cameraShake=Math.max(h.cameraShake,.32),h.message="TRAFFIC CRASH",h.messageTimer=.85))}function v_(n){let e=!1;for(let t=0;t<Pn.length;t++){const i=Pn[t];if(i.maxY!=null&&n.y>i.maxY+Gn+.45)continue;const s=i.hw+xn,r=i.hd+xn,a=n.x-i.x,o=n.z-i.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,ku(i.actor,n);const l=s-Math.abs(a),c=r-Math.abs(o);l<c?n.x=i.x+(a<0?-s:s):n.z=i.z+(o<0?-r:r)}return e}function __(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Gn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function M_(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,ke.splats++,i_();const e=Vs.find(t=>!t.visible)||Vs[ke.splats%Math.max(1,Vs.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,Oe(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function y_(n,e=null){if(e?.kind!=="ground"||Math.abs(h.speed)<5)return!1;let t=!1;for(const i of qr){if(!i.active)continue;const s=n.x-i.x,r=n.z-i.z,a=xn+i.hitRadius;s*s+r*r>a*a||Math.abs(n.y-(Oe(i.x,i.z)+Gn))>3.2||(M_(i),t=!0)}return t}function S_(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=rl(n,hn),r=e?.kind==="ground"?rl(n,zn):!1,a=rl(n,Si),o=e?.kind==="ground"?v_(n):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function Vu(n){const e=Ie.lookX*1.18,t=Ie.lookY*.58;h.camLookYaw+=(e-h.camLookYaw)*(1-Math.pow(.002,n)),h.camLookPitch+=(t-h.camLookPitch)*(1-Math.pow(.002,n)),h.cameraZoom+=(Ie.zoom-h.cameraZoom)*(1-Math.pow(.018,n))}function Gc(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const r=s/10,a=Pe.lerp(n.x,e.x,r),o=Pe.lerp(n.z,e.z,r),l=Pe.lerp(n.y,e.y,r),c=Oe(a,o)+t;c>l&&(i=Math.max(i,(c-l)/Math.max(.08,r)))}return i}function b_(n,e){const t=Oe(n,e);let i=null;const s=zu(n,e);s&&s.y>t+4&&(i=s);const r=Ou(n,e,1e3,!0);return r&&r.y>t+4&&(!i||r.y>i.y)&&(i=r),i}function no(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const r=s/14,a=Pe.lerp(n.x,e.x,r),o=Pe.lerp(n.z,e.z,r),l=Pe.lerp(n.y,e.y,r),c=b_(a,o);if(!c||n.y<c.y-10)continue;const u=c.y+t-l;u>0&&(i=Math.max(i,u/Math.max(.16,r)))}return Math.min(54,i)}function ac(){const n=h.camYaw+h.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=Pe.clamp(h.cameraZoom,-.42,.9),s=h.roamPos,r={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+h.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};Re.position.y+=Gc(r,Re.position,3.4),Re.position.y+=no(r,Re.position,4.2)}function Gu(n){if(window.__freeCam)return;if(Vu(n),Math.abs(h.speed)>tc){let p=h.roamYaw-h.camYaw;p=Math.atan2(Math.sin(p),Math.cos(p)),h.camYaw+=p*(1-Math.pow(.08,n))}const e=h.camYaw+h.camLookYaw,t=Math.sin(e),i=-Math.cos(e),s=h.roamPos,r=Pe.clamp(h.cameraZoom,-.42,.9),a=Pe.clamp(Math.abs(h.speed)/135,0,1),o=(17+Math.abs(h.speed)*.11+h.roamSlip*3)*(1+r*.72),l=7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+h.camLookPitch*5.8,c=xu.set(s.x-t*o,s.y+l,s.z-i*o);if(h.cameraShake>.01||h.collisionDrama>.01){const p=h.cameraShake+h.collisionDrama*.42;c.x+=(Math.random()-.5)*p*1.2,c.y+=(Math.random()-.5)*p*.75,c.z+=(Math.random()-.5)*p*1.2}const u=ho.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+h.camLookPitch*13.5,s.z+i*(13+a*8-Math.min(r,0)*6));c.y=Math.max(c.y,Oe(c.x,c.z)+3.5),c.y+=Gc(u,c,3.4),c.y+=no(u,c,4.2);const f=h.roamSlip>.35?.006:.0026;Re.position.lerp(c,1-Math.pow(f,n)),Re.position.y+=no(u,Re.position,3.8)*.72,cn.position.copy(Re.position),cn.lookAt(u),cn.rotateY(Math.PI),cn.rotateZ(-h.wheelSteer*a*.18+h.roamSlip*Math.sign(h.wheelSteer||1)*.05),Re.quaternion.slerp(cn.quaternion,1-Math.pow(.05,n));const m=69+Math.min(13,Math.abs(h.speed)*.075)+h.roamSlip*2.5+r*10;Math.abs(Re.fov-m)>.02&&(Re.fov+=(m-Re.fov)*(1-Math.pow(.01,n)),Re.updateProjectionMatrix()),h.cameraShake=Math.max(0,h.cameraShake-n*2.4),h.collisionDrama=Math.max(0,h.collisionDrama-n*1.8)}function w_(n,e=null){if(h.mode==="result")return;h.mode="result";const t=Math.max(0,Math.round(h.score-h.damage*9+Math.max(0,220-h.time)*45));t>h.best&&(h.best=t,localStorage.setItem("steel-ribbon-best",String(t))),$e.best.textContent=`Best score ${h.best}`,$e.resultText.textContent=`${n} Score ${t}. Time ${lc(h.time)}. Damage ${Math.round(h.damage)}%.`;const i=Number.isFinite(h.bestLap)?lc(h.bestLap):"--:--.-";let s="";if(h.seasonRace&&It?.active&&e){[{key:"you",metric:h.totalDistance+.001},...In.map(l=>({key:l.key,metric:l.distance}))].sort((l,c)=>c.metric-l.metric).forEach((l,c)=>It.points[l.key]+=Vv[c]??0),It.raceIndex++;const a=It.raceIndex>=4,o=Lu();if(a){It.active=!1;const l=o[0].key==="you";l&&It.division>1?(localStorage.setItem("steel-ribbon-division",String(It.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Pu(It.division-1)}!</b>`):s+=l?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Ru(),s=`<span>Season — after race ${It.raceIndex}/4</span>`+o.map((l,c)=>`<b>${c+1}. ${l.label} — ${l.pts} pts</b>`).join("")+s,$e.againBtn.textContent=It.active?"Next Race":"Back to Menu"}else $e.againBtn.textContent="Race Again";$e.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${h.cleanLandings}</b>
    <b>Hard landings: ${h.hardLandings}</b>
    <b>Recoveries: ${h.recoveries}</b>
    <b>Near edges: ${Math.round(h.nearMisses)}</b>
    ${s}
  `,mo(),$e.result.classList.remove("hidden")}function gd(n="Craned back to the ribbon"){const e=dt(h.lastSafeS);h.s=h.lastSafeS,h.totalDistance=h.lastSafeDistance,h.lateral=0,h.lateralVel=0,h.y=e.p.y+2.1,h.yVel=0,h.speed=Math.max(16,h.speed*.32),h.grounded=!0,h.cameraShake=1.2,h.message=n,h.messageTimer=1.4,h.recoveries+=1}function Hc(n,e){return Pe.clamp(e*n.tangent.y,-48,48)}function T_(n=94){return se.gaps.map(e=>{const t=dt(e.start),i=dt(e.end+3),s=(e.end-e.start)/Math.max(1,n),r=Hc(t,n),a=t.p.y+2.1+r*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Pe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function vd(n,e){h.grounded=!1,h.yVel=Hc(n,h.speed),h.airtime=0,e&&(h.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Hc(dt(n),e)},gapJumpReport(n){return T_(n)},sceneryClearanceReport(){return Mv()},setSpeed(n){return h.speed=Pe.clamp(n,-14,156-h.damage*.42),Ur(),h.speed},setTrackPosition(n,e=h.speed,t=0){const i=dt(n);return h.totalDistance=n,h.s=i.s,h.lastSafeS=i.s,h.lastSafeDistance=n,h.lateral=Pe.clamp(t,-se.width*.48,se.width*.48),h.lateralVel=0,h.y=i.p.y+2.1,h.yVel=0,h.grounded=!0,h.speed=Pe.clamp(e,-14,156-h.damage*.42),Ur(),{s:h.s,totalDistance:h.totalDistance,speed:h.speed,lateral:h.lateral,y:h.y}},setDamage(n){return h.damage=Pe.clamp(n,0,99),Ur(),h.damage},setCourse(n){return Qr(n)},flyCam(n,e,t,i,s,r){return window.__freeCam=!0,Re.position.set(n,e,t),Re.lookAt(i,s,r),Re.fov=62,Re.updateProjectionMatrix(),"freecam"},listBoostPads(){return Gs.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return js.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1)}))},seasonInfo(){return{season:It,division:jr(),position:Wc(),seasonRace:!!h.seasonRace,rivals:In.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),It=null,mo(),"reset"},renderInfo(){return{calls:ke.renderCalls||0,triangles:ke.renderTris||0,geometries:Zt.info.memory.geometries,textures:Zt.info.memory.textures,mobilePerf:Nc}},trafficInfo(){const n=Pn[0]?.actor?.mesh;return{colliders:Pn.length,wheels:n?.userData?.wheels?.length??0,pedestrians:ke.pedestrians||0}},audioInfo(){return Xe?{state:Xe.ctx.state,master:+Xe.master.gain.value.toFixed(2),engine:!!Xe.rumble&&!!Xe.growl&&!!Xe.whine,fx:!!Xe.wind&&!!Xe.skid&&!!Xe.boost,music:!!Xe.musicGain,beat:Xe.beat}:null},colliderAudit(){const n=[],e=[],t=Nt.streetW*.5;for(let r=Nt.x0;r<=Nt.x1+1;r+=Nt.pitch)n.push(Math.round(r));for(let r=Nt.zNear;r>=Nt.zFar-1;r-=Nt.pitch)e.push(Math.round(r));const i=[],s=(r,a,o)=>{const l=o.radius!=null?o.radius:o.hw??0,c=o.radius!=null?o.radius:o.hd??0,u=Oe(o.x,o.z);if(!(o.maxY!=null&&o.maxY<u+1.05)){for(const f of n)Math.abs(o.x-f)<t+l+xn&&o.z<Nt.zNear+c&&o.z>Nt.zFar-c&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(l,c).toFixed(1),road:`x=${f}`,overlap:+(t+l+xn-Math.abs(o.x-f)).toFixed(1)});for(const f of e)Math.abs(o.z-f)<t+c+xn&&o.x<Nt.x1+l&&o.x>Nt.x0-l&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(l,c).toFixed(1),road:`z=${f}`,overlap:+(t+c+xn-Math.abs(o.z-f)).toFixed(1)})}};return hn.forEach((r,a)=>s("Mn",a,r)),Si.forEach((r,a)=>s("Di",a,r)),zn.forEach((r,a)=>s("$n",a,r)),{total:hn.length+Si.length+zn.length,blockers:i}},setRoamPos(n,e,t=0,i=0){return h.mode!=="roam"&&kc(),h.roamPos.set(n,Oe(n,e)+Gn,e),h.roamYaw=t,h.camYaw=t,h.speed=i,cs(),{x:h.roamPos.x,y:+h.roamPos.y.toFixed(2),z:h.roamPos.z}},sceneryCounters(){return{...ki,boostPads:Gs.length,gapBeacons:Yr.length,railRuns:ke.railRuns||0,railPosts:ke.railPosts||0,ponds:js.length,cityPonds:ke.ponds||0}},stats(){return{trafficCrashes:ke.trafficCrashes,splats:ke.splats,roamPos:{x:+h.roamPos.x.toFixed(1),y:+h.roamPos.y.toFixed(1),z:+h.roamPos.z.toFixed(1)},speed:+h.speed.toFixed(2),cooldown:+h.collisionCooldown.toFixed(2)}},viewInfo(){const n=dt(h.s),e=h.y-2.1;return{trackView:jn,mode:h.mode,carVisible:Bt.visible,cockpitVisible:!!(on&&on.visible),camY:+Re.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+h.y.toFixed(2),overheadY:+oc(Re.position.x,Re.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return jn=n==="cockpit"?"cockpit":"chase",Ai(),jn},listCourses(){return fs.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:ks,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new op(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=Re;const i=t.intersectObjects(je.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=rs(n,e,400);return{x:n,z:e,ground:+Oe(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return ms.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],r=n.segments[0],a=n.segments[n.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(n=8){return hn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return zn.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=zn.filter(e=>e.hw);return{supports:nc,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of hn){const i=Qi(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:hn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of hn){const i=On(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:hn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return Si.concat(zn.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:ke.traffic,pedestrians:ke.pedestrians,pedestriansActive:qr.filter(e=>e.active).length,turns:ke.turns,splats:ke.splats,trafficCrashes:ke.trafficCrashes,streetLights:ke.streetLights,trafficLights:ke.trafficLights,stopSigns:ke.stopSigns,signs:ke.signs,roadDetails:{...ke.roadDetails},buildingArchetypes:{...ke.buildingArchetypes},zones:{...ke.zones},openerProps:ke.openerProps,signSamples:to.slice(0,n),types:{...ke.types},offRoadTraffic:Pn.filter(e=>!uo(e.x,e.z,2)).length,trafficRoutes:ic.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Pn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:qr.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...ke.roadDetails},e={...ke.buildingArchetypes},t={...ke.zones},i=Object.values(e).filter(r=>r>0).length,s=Object.values(t).filter(r=>r>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,ke.signs/7)+Math.min(14,ke.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:ke.openerProps,signs:ke.signs,streetLights:ke.streetLights,streetGlowSprites:ki.streetGlowSprites,waterBlockers:ki.waterBlockers,lowFogDisks:ki.lowFogDisks}},objectiveReport(){const n=$t[h.objectiveIndex%Math.max(1,$t.length)];return{total:$t.length,hits:h.objectiveHits,index:h.objectiveIndex,lap:h.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:$t.filter(e=>e.collected).length,score:Math.round(h.score),boost:+h.boost.toFixed(2)}},drivingFeelReport(){return{speed:+h.speed.toFixed(2),wheelSteer:+(h.wheelSteer||0).toFixed(3),slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),cameraShake:+(h.cameraShake||0).toFixed(3),collisionDrama:+(h.collisionDrama||0).toFixed(3),collisionHits:h.collisionHits,smokeActive:Dr.filter(n=>n.life>0).length,debrisActive:Ir.filter(n=>n.life>0).length,sparksActive:Lr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Bt.userData.detailReport},racer:{...kv.userData.detailReport},namedParts:Bt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Tu(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=dt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,r=Math.atan2(t.tangent.x,-t.tangent.z),a=Oe(i,s);h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(i,a+Gn,s),h.roamYaw=r,h.camYaw=r,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Ie.lookX=0,Ie.lookY=0,Ie.zoom=0,h.wheelSteer=0,h.speed=0,cs();const o=Math.sin(h.roamYaw),l=-Math.cos(h.roamYaw);return Re.position.set(h.roamPos.x-o*17,h.roamPos.y+7.2,h.roamPos.z-l*17),ac(),Re.lookAt(h.roamPos.x+o*13,h.roamPos.y+2.45,h.roamPos.z+l*13),Re.fov=69,Re.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-h.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=rs(n,e,h.roamPos.y);h.roamPos.set(n,i.y+Gn,e),h.roamYaw=t,h.camYaw=t,h.camLookYaw=0,h.camLookPitch=0,h.wheelSteer=0,h.speed=0,cs();const s=Math.sin(h.roamYaw),r=-Math.cos(h.roamYaw);return Re.position.set(h.roamPos.x-s*17,h.roamPos.y+7.2,h.roamPos.z-r*17),ac(),Re.lookAt(h.roamPos.x+s*13,h.roamPos.y+2.45,h.roamPos.z+r*13),Re.fov=69,Re.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ie.zoom,i=30){Ie.lookX=Pe.clamp(n,-1,1),Ie.lookY=Pe.clamp(e,-1,1),Ie.zoom=Pe.clamp(t,-.42,.9);for(let s=0;s<i;s++)h.mode==="roam"?Gu(1/60):Xc(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(h.mode!=="roam")return this.roamReport();const s={steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake};Ie.steer=Pe.clamp(e,-1,1),Ie.throttle=Pe.clamp(t,0,1),Ie.brake=Pe.clamp(i,0,1);const r=1/60;let a=Math.max(0,Math.min(n,8));for(;a>0;){const o=Math.min(r,a);if(Bu(o),h.mode!=="roam")break;a-=o}return Ie.steer=s.steer,Ie.throttle=s.throttle,Ie.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(h.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(Hu(i),h.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=h.roamPos,e=xu.set(0,0,-1).applyQuaternion(Bt.quaternion).normalize(),t=ho.set(Math.sin(h.roamYaw),0,-Math.cos(h.roamYaw)).normalize(),i=rs(n.x,n.z,n.y);return{mode:h.mode,s:+h.s.toFixed(2),totalDistance:+h.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+h.roamYaw.toFixed(3),camYaw:+h.camYaw.toFixed(3),speed:+h.speed.toFixed(2),groundXZ:+Oe(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+Re.position.x.toFixed(2),camY:+Re.position.y.toFixed(2),camZ:+Re.position.z.toFixed(2),fov:+Re.fov.toFixed(2),lookYaw:+h.camLookYaw.toFixed(3),lookPitch:+h.camLookPitch.toFixed(3),cameraZoom:+h.cameraZoom.toFixed(3),cameraSightLift:+Gc({x:n.x,y:n.y+2.6,z:n.z},{x:Re.position.x,y:Re.position.y,z:Re.position.z},2.4).toFixed(3),elevatedCameraLift:+no({x:n.x,y:n.y+2.6,z:n.z},{x:Re.position.x,y:Re.position.y,z:Re.position.z},3.8).toFixed(3),colliders:hn.length+zn.length+Si.length+Pn.length,insideBuilding:hn.concat(zn,Si,Pn).some(s=>__(n,s)),objectiveHits:h.objectiveHits,objectiveIndex:h.objectiveIndex,collisionHits:h.collisionHits,slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Bt.userData.frontWheels?+Bt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function Hu(n){if(h.mode!=="race")return;h.time+=n,h.freeRun&&(h.damage=0);const e=h.breakdownTimer>0;e&&(h.breakdownTimer-=n,h.breakdownTimer<=0&&(h.damage=55,h.message="Patched up — back on it",h.messageTimer=1.2));const t=Math.max(At.has("KeyW")||At.has("ArrowUp")?1:0,Ie.throttle),i=Math.max(At.has("KeyS")||At.has("ArrowDown")?1:0,Ie.brake),s=Pe.clamp((At.has("KeyD")||At.has("ArrowRight")?1:0)-(At.has("KeyA")||At.has("ArrowLeft")?1:0)+Ie.steer,-1,1)*gu,r=t>.03&&!e,a=(At.has("ShiftLeft")||At.has("ShiftRight"))&&h.boost>.02&&r&&h.grounded,o=dt(h.s),l=o.p.y+2.1,c=Math.abs(h.speed);if(r){const v=h.speed<0?40:0;h.speed+=((a?68:40)+v)*t*n}if(i>.03){const v=h.speed>1.2?70:26;h.speed-=v*i*n}const u=h.grounded?.0024:.0011;h.speed-=u*h.speed*c*n,c>.08?h.speed-=Math.sign(h.speed)*(h.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(h.speed=0),h.speed=Pe.clamp(h.speed,-16,156-h.damage*.8),e&&(h.speed=Math.min(h.speed,14)),h.boosting=a,a?(h.boost=Math.max(0,h.boost-n*.21),h.score+=28*n):h.boost=Math.min(1,h.boost+n*(h.grounded?.045:.018));const f=16+c*.13;h.lateralVel-=s*f*n,h.lateralVel-=h.lateralVel*(h.grounded?4.1:.7)*n,h.lateral+=h.lateralVel*n;const m=di(h.s),p=Math.abs(h.lateral)<se.width*.52,x=!m&&p;if(h.grounded&&(!x||Math.abs(h.lateral)>se.width*.5)&&vd(o,p?"":"Edge slip"),h.grounded){const v=Math.sin(h.time*18)*Math.min(.22,Math.abs(h.speed)/700);h.y=Pe.lerp(h.y,l+v,.5),h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.score+=Math.max(0,h.speed)*n*.34,Math.abs(h.lateral)>se.width*.42&&(h.damage+=n*(1.2+Math.abs(h.speed)*.035),h.cameraShake=Math.max(h.cameraShake,.24),h.nearMisses+=n*.8,Math.random()<n*5&&Hs(o.p.clone().addScaledVector(o.side,Math.sign(h.lateral)*se.width*.55).addScaledVector(jt,1.2),4))}else{h.yVel-=31*n,h.y+=h.yVel*n,h.airtime+=n,h.score+=n*11;const v=dt(h.s),M=v.p.y+2.1;if(!di(h.s)&&Math.abs(h.lateral)<se.width*.55&&h.y<=M&&h.yVel<0){const y=-h.yVel,E=Math.abs(h.lateral)<se.width*.34&&y<30,T=Math.round(E?260+h.airtime*85:Math.max(30,120-y));h.y=M,h.grounded=!0,h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.damage+=Math.max(0,y-17)*.82+Math.max(0,Math.abs(h.lateral)-se.width*.36)*1.8,h.score+=T,h.cameraShake=Math.max(h.cameraShake,y/34),h.message=E?"Clean landing":"Hard landing",h.messageTimer=.9,E?h.cleanLandings+=1:h.hardLandings+=1,Rr(`+${T} ${E?"CLEAN AIR":"LANDED"}`,E),E&&Xr(990,.14),Xa(y),Hs(v.p.clone().addScaledVector(v.side,h.lateral).addScaledVector(jt,.7),E?7:24),h.airtime=0}h.y<-55&&(h.damage+=28,gd("Track crew recovery"))}const _=h.totalDistance;h.totalDistance+=h.speed*n,h.s=(h.totalDistance%se.length+se.length)%se.length;const g=ms.find(v=>v.rampType==="off");if(h.freeRun&&g&&Qo(_,h.totalDistance,g.exitS)&&h.lateral*g.dirSel>se.width*.2&&h_(g))return;const d=Math.floor(h.totalDistance/se.length)+1;if(d>h.lap){const v=h.time-h.lapStartTime;h.splitTimes.push(v),h.bestLap=Math.min(h.bestLap,v),h.lapStartTime=h.time,h.lap=d,h.score+=1200,Rr("+1200 LAP",!0),h.message=h.practice?`Lap ${h.lap}`:h.lap<=se.laps?`Lap ${h.lap}`:"Season race complete",h.messageTimer=1.4,!h.practice&&h.lap>se.laps&&(()=>{const M=Wc();w_(M===1?"You took the chequered gantry.":`You finished P${M}.`,M)})()}for(const v of se.gaps)Qo(_,h.totalDistance,v.start)&&(h.message=v.name,h.messageTimer=1.1,h.grounded&&vd(dt(v.start),v.name));if(h.grounded){for(const v of Gs)if(Qo(_,h.totalDistance,v.s)&&Math.abs(h.lateral-v.lat)<3.4){const M=dt(v.s);h.boost=Math.min(1,h.boost+.45),h.speed=Math.min(h.speed+9,156-h.damage*.8),h.score+=90,h.cameraShake=Math.max(h.cameraShake,.16),h.message="BOOST PAD",h.messageTimer=.8,Rr("+90 BOOST"),Xr(640,.22,"sawtooth",.1),Hs(M.p.clone().addScaledVector(M.side,v.lat).addScaledVector(jt,1),10),Xa(14);break}}h.damage=Pe.clamp(h.damage,0,100),!h.freeRun&&h.damage>=90&&h.breakdownTimer<=0&&(h.breakdownTimer=2.6,h.message="Chassis cracked — limping to repair",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.8),Xa(40),h.damage=90),At.has("KeyR")&&(h.damage=Math.min(99,h.damage+8),gd("Manual reset"),At.delete("KeyR"))}function _d(n){const e=se.length*se.laps,t=1+.07*(4-jr());for(const i of In){if(h.mode==="race"&&!h.practice){const l=h.totalDistance-i.distance,c=Pe.clamp(l*.055,-11,15),u=Math.sin(h.time*i.waveFreq+i.phase)*i.wave;let f=i.base+u+c;i.key==="bishop"&&(f+=11*Math.exp(-h.time/22)),i.key==="maddock"&&(f+=10*Pe.clamp(i.distance/Math.max(1,e),0,1)),i.speed=Pe.clamp(f*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=h.time,h.message=`${i.label} takes the flag`,h.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=dt(i.s),r=Math.abs(i.distance-h.totalDistance);let a=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(r<14){const l=(h.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);a=Pe.lerp(l,a,r/14)}i.mesh.position.copy(s.p).addScaledVector(jt,1.4).addScaledVector(s.side,a),i.mesh.quaternion.setFromRotationMatrix(new Tt().makeBasis(s.side,jt,s.tangent));const o=r<26&&jn==="cockpit";i.mesh.visible=(h.mode==="race"||h.mode==="paused"||h.mode==="result")&&!h.practice&&!o}h.rivalDistance=Math.max(...In.map(i=>i.distance)),h.rivalS=(h.rivalDistance%se.length+se.length)%se.length}function Wc(){return h.practice?1:1+In.filter(n=>n.distance>h.totalDistance).length}function E_(n,e){const t=e.side.clone().multiplyScalar(h.lateral),i=e.p.clone().add(t);i.y=h.y;const s=h.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),Re.position.copy(i);const r=Math.abs(h.speed),a=68+Math.min(10,r*.055)+(h.boosting?3:0)+h.cameraZoom*12;Math.abs(Re.fov-a)>.02&&(Re.fov+=(a-Re.fov)*(1-Math.pow(.004,n)),Re.updateProjectionMatrix());const o=dt(h.s+34+h.speed*.16),l=o.p.clone().addScaledVector(o.side,h.lateral*.45);l.y+=1.7+h.camLookPitch*12+Math.sin(h.time*8)*Math.min(.2,r/680),cn.position.copy(Re.position),cn.lookAt(l),cn.rotateY(Math.PI),cn.rotateY(-h.camLookYaw),cn.rotateZ(-e.bank*.72-h.lateralVel*.006),cn.rotateX(e.grade*.18+(h.grounded?0:Pe.clamp(h.yVel,-30,30)*-.006)),Re.quaternion.slerp(cn.quaternion,1-Math.pow(8e-4,n))}function oc(n,e,t,i){let s=1/0;const r=se.width*.5+2.2;for(const a of fo()){if(a.courseIndex!==ks||a.y<t||a.y>i||a.y>=s)continue;const o=n-a.x,l=e-a.z;o*o+l*l<r*r&&(s=a.y)}return s}function A_(n,e){const t=Math.abs(h.speed),i=h.y-2.1;let s=12.8+t*.05+Pe.clamp(h.cameraZoom,-.42,.9)*8,r=4.6+t*.014+h.camLookPitch*10,a=dt(h.s-s),o=oc(a.p.x,a.p.z,i+5,i+64);o-1.5<a.p.y+2&&(s=6.4,r=2.7,a=dt(h.s-s),o=oc(a.p.x,a.p.z,i+5,i+64));let l=Pe.lerp(a.p.y,i,.62)+r;const c=zc.set(a.p.x+a.side.x*h.lateral*.72,0,a.p.z+a.side.z*h.lateral*.72);if(l=Math.max(l,a.p.y+2.35,Oe(c.x,c.z)+2.8),o<1/0&&(l=Math.min(l,o-1.5)),c.y=l,h.cameraShake>.01){const p=h.cameraShake;c.x+=(Math.random()-.5)*p*1.1,c.y+=(Math.random()-.5)*p*.6,c.z+=(Math.random()-.5)*p*1.1}Re.position.distanceTo(c)>70&&Re.position.copy(c),Re.position.lerp(c,1-Math.pow(2e-4,n)),Re.position.y=Math.max(Re.position.y,a.p.y+2.05),o<1/0&&(Re.position.y=Math.min(Re.position.y,o-1.4));const u=dt(h.s+17+t*.09),f=u.p.clone().addScaledVector(u.side,h.lateral*.55);f.y+=2.1+h.camLookPitch*12,h.grounded||(f.y=Pe.lerp(f.y,h.y+1.2,.5)),cn.position.copy(Re.position),cn.lookAt(f),cn.rotateY(Math.PI),cn.rotateY(-h.camLookYaw),cn.rotateZ(-e.bank*.42-h.lateralVel*.0034),Re.quaternion.slerp(cn.quaternion,1-Math.pow(4e-4,n));const m=66+Math.min(11,t*.055)+(h.boosting?5:0)+Pe.clamp(h.cameraZoom,-.42,.9)*10;Math.abs(Re.fov-m)>.02&&(Re.fov+=(m-Re.fov)*(1-Math.pow(.004,n)),Re.updateProjectionMatrix())}function C_(){const n=h.mode==="race"||h.mode==="paused"||h.mode==="result",e=n&&jn==="chase"&&!window.__freeCam;if(on&&(on.visible=!e),Bt.visible!==e&&(Bt.visible=e),!e)return;const t=dt(h.s);Bt.position.set(t.p.x+t.side.x*h.lateral,h.y-.72,t.p.z+t.side.z*h.lateral);const i=new Tt().makeBasis(t.side,jt,t.tangent);Bt.quaternion.setFromRotationMatrix(i),h.grounded?(Bt.rotateX(-t.grade*.5),Bt.rotateZ(t.bank*.6+Pe.clamp(h.lateralVel*.012,-.16,.16))):Bt.rotateX(Pe.clamp(-h.yVel*.011,-.34,.4));const s=Bt.userData.frontWheels,r=Pe.clamp(-h.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=r,s[1].rotation.y=r)}let Na=.6;function R_(n){if(window.__freeCam)return;Na+=n*.13;const e=80,t=300,i=Oe(e,t);Bt.visible=!0,on&&(on.visible=!1),Bt.position.set(e,i+.85,t),Bt.quaternion.setFromAxisAngle(jt,Math.PI*.24);const s=16.5;Re.position.set(e+Math.cos(Na)*s,i+5.3+Math.sin(Na*.57)*1.1,t+Math.sin(Na)*s),Re.lookAt(e,i+1.5,t),Re.rotateY(.3),Math.abs(Re.fov-58)>.1&&(Re.fov=58,Re.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=h.mode)}function Xc(n){if(window.__freeCam)return;Vu(n);const e=dt(h.s);jn==="chase"&&h.mode!=="menu"?A_(n,e):E_(n,e),h.cameraShake=Math.max(0,h.cameraShake-n*1.9);const t=ho.set(0,0,-1).applyQuaternion(Re.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.y,yVel:h.yVel,grounded:h.grounded,input:{steer:Ie.steer,throttle:Ie.throttle,brake:Ie.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const os={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Mr=[28,54,82,110,134,156];function P_(){const n=Math.abs(h.speed);let e=1;for(let o=0;o<Mr.length;o++)n>Mr[o]&&(e=o+2);e=Math.min(e,Mr.length);const t=e===1?0:Mr[e-2],i=Mr[e-1],s=i>t?Pe.clamp((n-t)/(i-t),0,1):0,r=e===1?os.idle:os.postShift;let a=r+s*(os.shift-r);return n<.4&&(a=os.idle),{gear:e,rpm:a}}let Md=performance.now(),al=0,ol=0;function Wu(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const r=i/2,a=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:r,cy:a,R:o,aFor:l=>Math.PI-l*Math.PI,at:(l,c)=>[r+Math.cos(l)*c,a-Math.sin(l)*c]}}function L_(n,e){const t=$e.speedo;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:l}=Wu(t),c=360;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=c;x+=20){const _=x/c,g=o(_),d=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=d?Math.max(1.4,a*.035):Math.max(1,a*.02);const v=l(g,a-a*.02),M=l(g,a-a*(d?.18:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(M[0],M[1]),i.stroke(),d){const y=l(g,a-a*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),y[0],y[1])}}const u=Pe.clamp(n/c,0,1),f=o(u),m=l(f,a-a*.06),p=l(f+Math.PI,a*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=a*.18,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(p[0],p[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,r-a*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,r+a*.02)}function D_(n,e){const t=$e.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:l}=Wu(t),c=18;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke();const u=Pe.clamp(n,0,1),f=n<.25;i.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?a*.25:a*.1,i.lineWidth=Math.max(2,a*.07),i.beginPath(),i.arc(s,r,a,o(u),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let _=0;_<=c;_+=3){const g=_/c,d=o(g),v=_%6===0;i.strokeStyle=_>=c*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=v?Math.max(1.3,a*.03):Math.max(1,a*.018);const M=l(d,a-a*.02),y=l(d,a-a*(v?.17:.1));if(i.beginPath(),i.moveTo(M[0],M[1]),i.lineTo(y[0],y[1]),i.stroke(),v){const E=l(d,a-a*.33);i.fillStyle="#cfeeff",i.fillText(String(_),E[0],E[1])}}const m=o(u),p=l(m,a-a*.06),x=l(m+Math.PI,a*.14);i.strokeStyle=f?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=a*.16,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,r-a*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=a*.3,i.beginPath(),i.arc(s,r+a*.02,a*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function I_(n,e){const t=$e.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,r,a);const o=r/2,l=a-a*.14,c=Math.min(r*.46,a*.9),u=os.max,f=M=>Math.PI-M*Math.PI,m=(M,y)=>[o+Math.cos(M)*y,l-Math.sin(M)*y];i.lineCap="round",i.lineWidth=Math.max(2,c*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,l,c,f(1),f(0)),i.stroke();const p=os.redline/u;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,l,c,f(1),f(p)),i.stroke(),i.font=`700 ${Math.max(7,c*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=9;M++){const y=M/9,E=f(y),T=M*1e3>=os.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,c*.035);const R=m(E,c-c*.02),C=m(E,c-c*.18);i.beginPath(),i.moveTo(R[0],R[1]),i.lineTo(C[0],C[1]),i.stroke();const w=m(E,c-c*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(M),w[0],w[1]),M<9){const S=f((M+.5)/9),L=m(S,c-c*.02),F=m(S,c-c*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,c*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(F[0],F[1]),i.stroke()}}const x=Pe.clamp(n/u,0,1),_=f(x),g=m(_,c-c*.06),d=m(_+Math.PI,c*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=c*.18,i.lineWidth=Math.max(1.8,c*.05),i.beginPath(),i.moveTo(d[0],d[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,c*.03),i.beginPath(),i.arc(o,l,c*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,c*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,l-c*.26);const v=h.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,c*.22)}px "Courier New", monospace`,i.fillText(v,o,l+c*.02)}function Ur(){se.length*se.laps;const n=od(h.practice?h.totalDistance%se.length:h.totalDistance),e=h.practice?"SOLO":`P${Wc()}`;e!==h.leadState&&h.mode==="race"&&(h.leadState=e,h.practice||(h.message=e==="P1"?"You took the lead":`Now ${e}`,h.messageTimer=.95)),$e.damage.style.width=`${Math.round(h.damage)}%`,$e.lap.textContent=h.practice?`LAP ${h.lap}`:`${Math.min(h.lap,se.laps)}/${se.laps}`,$e.timer.textContent=lc(h.time);const t=h.mode==="roam";$e.score.textContent=t?`Gates ${h.objectiveHits}/${$t.length}  Score ${Math.round(h.score)}`:`Score ${Math.round(h.score)}`;const i=h.mode==="race"||h.mode==="paused"||t;if($e.position.textContent=t?"FREE ROAM":h.freeRun?"FREE RUN":h.practice?"PRACTICE":`${e} DIV ${jr()}`,t&&$t.length){const c=$t[h.objectiveIndex%$t.length];$e.trackName.textContent=c?`Next: ${c.label}`:"City Streets"}$e.hud.style.display=i?"flex":"none",$e.raceStrip.style.display=h.mode==="race"||h.mode==="paused"?"grid":"none",$e.touchControls.style.display=i?"":"none",$e.playerProgress.style.width=`${Math.round(n*100)}%`;for(const c of In)c.progEl&&(c.progEl.style.width=`${Math.round((h.practice?0:od(c.distance))*100)}%`);const s=P_();h.gear=s.gear;const r=performance.now(),a=Math.min(.05,(r-Md)/1e3);Md=r;const o=1-Math.exp(-a*(s.rpm>h.tachRpm?10:6));h.tachRpm+=(s.rpm-h.tachRpm)*o,I_(h.tachRpm,s.gear);const l=Math.abs(h.speed)*2.25;al+=(l-al)*(1-Math.exp(-a*8)),ol+=(h.boost-ol)*(1-Math.exp(-a*9)),L_(al,h.speed<-.5),D_(ol,h.boosting),$e.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(h.speed)-44)/150)),$e.damageFx.style.opacity=h.damage<18?0:Math.min(.72,(h.damage-18)/82),h.mode==="paused"?($e.centerMessage.textContent="Paused",$e.centerMessage.classList.remove("hidden")):h.messageTimer>0?($e.centerMessage.textContent=h.message,$e.centerMessage.classList.remove("hidden")):$e.centerMessage.classList.add("hidden")}function lc(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function Xu(){Zt.info.reset();const n=sv.getDelta(),e=Math.min(.033,n);h.messageTimer>0&&(h.messageTimer-=e),h.mode==="roam"?(Bu(e),Gu(e),d_()):h.mode==="menu"?(_d(e),R_(e)):(Hu(e),_d(e),C_(),Xc(e)),p_(),f_(),zi&&zi.position.copy(Re.position),l_(e),Tu(e),Ur(),c_(),br.uniforms.uTime.value+=e,yu.forEach(i=>i.uniforms.uTime.value+=e),br.uniforms.uSpeed.value=Math.min(1,Math.abs(h.speed)/150);const t=(At.has("ShiftLeft")||At.has("ShiftRight"))&&h.boost>.02&&(h.mode==="race"||h.mode==="roam")?1:Math.min(.75,h.roamSlip*.55+h.collisionDrama*.6);br.uniforms.uBoost.value+=(t-br.uniforms.uBoost.value)*Math.min(1,e*6),sr.render(),ke.renderCalls=Zt.info.render.calls,ke.renderTris=Zt.info.render.triangles,requestAnimationFrame(Xu)}window.addEventListener("keydown",n=>{At.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(h.mode==="race"||h.mode==="paused")&&av(),n.code==="KeyP"&&h.mode==="race"?(h.mode="paused",At.clear(),Kr()):n.code==="KeyP"&&h.mode==="paused"?h.mode="race":n.code==="Escape"&&(h.mode==="race"||h.mode==="paused"||h.mode==="roam")&&(h.mode="menu",Kr(),Bt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Ai(),$e.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>At.delete(n.code));window.addEventListener("resize",()=>{Re.aspect=window.innerWidth/window.innerHeight,Re.updateProjectionMatrix(),Zt.setSize(window.innerWidth,window.innerHeight),sr.setSize(window.innerWidth,window.innerHeight),Iu.setSize(window.innerWidth,window.innerHeight)});const io=()=>{Qs(),window.removeEventListener("pointerdown",io),window.removeEventListener("keydown",io)};window.addEventListener("pointerdown",io);window.addEventListener("keydown",io);const Zr=document.createElement("button");Zr.id="volBtn",Zr.type="button";function qu(){Zr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}qu();Zr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Xe&&Xe.master.gain.setTargetAtTime(e,Xe.ctx.currentTime,.05),qu()});$e.menu.appendChild(Zr);$e.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+In.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");$e.playerProgress=document.querySelector("#playerProgress");In.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function mo(){const n=jr();$e.startBtn.textContent=It?.active?`Continue Season — Race ${It.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Lu();e.innerHTML=`<span>Division ${Pu(n)}${It?.active?` — after race ${It.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${It?` — ${i.pts} pts`:""}</b>`).join("")}}function U_(){h.mode="menu",Kr(),Bt.visible=!1,on&&(on.visible=!0),po(!1),document.body.classList.remove("roam-mode"),Ai(),mo(),$e.result.classList.add("hidden"),$e.menu.classList.remove("hidden")}mo();$e.startBtn.addEventListener("click",()=>{It&&It.active||Gv(),Qr(Pe.clamp(It.raceIndex,0,3)),$r(!1,!1,!0)});$e.practiceBtn.addEventListener("click",()=>$r(!0));$e.freeRunBtn.addEventListener("click",()=>$r(!0,!0));$e.roamBtn.addEventListener("click",()=>kc());$e.againBtn.addEventListener("click",()=>{h.seasonRace&&It?It.active&&It.raceIndex<4?(Qr(It.raceIndex),$r(!1,!1,!0)):U_():$r(!1)});$e.courseButtons.forEach(n=>{n.addEventListener("click",()=>Qr(Number(n.dataset.course)))});function Yu(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Kr(){Ie.steer=0,Ie.throttle=0,Ie.brake=0,Ie.lookX=0,Ie.lookY=0,Ie.zoom=0,Ie.lookPointer=null,Ie.drivePointer=null,Ie.pinchStartDistance=0,Ie.pinchStartZoom=0;for(const n of $e.touchControls.querySelectorAll(".touch-stick"))Yu(n)}function za(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=Pe.clamp(e.clientX-(t.left+t.width/2),-i,i),r=Pe.clamp(e.clientY-(t.top+t.height/2),-i,i),a=n.dataset.stick;if(n.classList.add("active"),a==="look")Ie.lookX=Pe.clamp(s/i,-1,1),Ie.lookY=Pe.clamp(-r/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ie.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ie.lookY*i)}px`);else{const o=Pe.clamp(s/i,-1,1),l=Pe.clamp(-r/i,-1,1);Ie.steer=o,Ie.throttle=Math.max(0,l),Ie.brake=Math.max(0,-l),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-l*i)}px`)}}function yd(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function Sd(n,e){e==="look"?(Ie.lookX=0,Ie.lookY=0,Ie.lookPointer=null):(Ie.steer=0,Ie.throttle=0,Ie.brake=0,Ie.drivePointer=null),Yu(n)}function F_(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function $u(n,e=!1){if(n.touches.length<2){Ie.pinchStartDistance=0;return}const t=F_(n.touches[0],n.touches[1]);if(e||!(Ie.pinchStartDistance>0)){Ie.pinchStartDistance=t,Ie.pinchStartZoom=Ie.zoom;return}const i=Math.max(.2,t/Ie.pinchStartDistance);Ie.zoom=Pe.clamp(Ie.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of $e.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),Qs(),h.mode==="paused"&&(h.mode="race"),e==="look"&&(Ie.lookPointer=s.pointerId),e==="drive"&&(Ie.drivePointer=s.pointerId),za(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ie.lookPointer:Ie.drivePointer)===s.pointerId&&(s.preventDefault(),za(n,s))},{passive:!1});const t=s=>{(e==="look"?Ie.lookPointer:Ie.drivePointer)===s.pointerId&&Sd(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),Qs(),h.mode==="paused"&&(h.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Ie.lookPointer=r.identifier),e==="drive"&&(Ie.drivePointer=r.identifier),za(n,r))},{passive:!1}),n.addEventListener("touchmove",s=>{const r=e==="look"?Ie.lookPointer:Ie.drivePointer,a=yd(s,r);a&&(s.preventDefault(),za(n,a))},{passive:!1});const i=s=>{const r=e==="look"?Ie.lookPointer:Ie.drivePointer;yd(s,r)&&(s.preventDefault(),Sd(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of $e.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),Qs(),At.add(e),n.setPointerCapture(i.pointerId)});const t=()=>At.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Jr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),$u(n,!0))},{passive:!1});Jr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),$u(n))},{passive:!1});Jr.addEventListener("touchend",n=>{n.touches.length<2&&(Ie.pinchStartDistance=0)},{passive:!1});Jr.addEventListener("touchcancel",()=>{Ie.pinchStartDistance=0},{passive:!1});const N_=dt(h.s);h.y=N_.p.y+2.1;h.lastSafeS=h.s;h.lastSafeDistance=h.totalDistance;Xc(.016);Ur();Xu();
