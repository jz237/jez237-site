(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Xl="181",xu=0,Ac=1,gu=2,Qh=1,ed=2,mi=3,Ni=0,dn=1,mt=2,ii=0,Us=1,Xn=2,Cc=3,Rc=4,vu=5,Ji=100,_u=101,Mu=102,Su=103,yu=104,wu=200,bu=201,Tu=202,Eu=203,Xo=204,qo=205,Au=206,Cu=207,Ru=208,Pu=209,Lu=210,Du=211,Iu=212,Uu=213,Fu=214,Yo=0,Zo=1,$o=2,Bs=3,Ko=4,Jo=5,jo=6,Qo=7,ql=0,Nu=1,zu=2,Fi=0,td=1,nd=2,id=3,Yl=4,sd=5,rd=6,ad=7,od=300,ks=301,Vs=302,el=303,tl=304,Xa=306,fn=1e3,vi=1001,nl=1002,Rn=1003,Ou=1004,Xr=1005,Fn=1006,eo=1007,Qi=1008,ai=1009,ld=1010,cd=1011,Er=1012,Zl=1013,os=1014,ei=1015,si=1016,$l=1017,Kl=1018,Ar=1020,hd=35902,dd=35899,ud=1021,fd=1022,qn=1023,Cr=1026,Rr=1027,Jl=1028,jl=1029,Ql=1030,ec=1031,tc=1033,Ta=33776,Ea=33777,Aa=33778,Ca=33779,il=35840,sl=35841,rl=35842,al=35843,ol=36196,ll=37492,cl=37496,hl=37808,dl=37809,ul=37810,fl=37811,pl=37812,ml=37813,xl=37814,gl=37815,vl=37816,_l=37817,Ml=37818,Sl=37819,yl=37820,wl=37821,bl=36492,Tl=36494,El=36495,Al=36283,Cl=36284,Rl=36285,Pl=36286,Bu=3200,ku=3201,nc=0,Vu=1,Di="",bt="srgb",Gs="srgb-linear",Ia="linear",Ft="srgb",fs=7680,Pc=519,Gu=512,Hu=513,Wu=514,pd=515,Xu=516,qu=517,Yu=518,Zu=519,Ll=35044,Lc="300 es",ti=2e3,Ua=2001;function md(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Fa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $u(){const i=Fa("canvas");return i.style.display="block",i}const Dc={};function Na(...i){const e="THREE."+i.shift();console.log(e,...i)}function lt(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Xt(...i){const e="THREE."+i.shift();console.error(e,...i)}function Pr(...i){const e=i.join(" ");e in Dc||(Dc[e]=!0,lt(...i))}function Ku(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Ys{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ic=1234567;const mr=Math.PI/180,Lr=180/Math.PI;function ri(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ln[i&255]+ln[i>>8&255]+ln[i>>16&255]+ln[i>>24&255]+"-"+ln[e&255]+ln[e>>8&255]+"-"+ln[e>>16&15|64]+ln[e>>24&255]+"-"+ln[t&63|128]+ln[t>>8&255]+"-"+ln[t>>16&255]+ln[t>>24&255]+ln[n&255]+ln[n>>8&255]+ln[n>>16&255]+ln[n>>24&255]).toLowerCase()}function vt(i,e,t){return Math.max(e,Math.min(t,i))}function ic(i,e){return(i%e+e)%e}function Ju(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function ju(i,e,t){return i!==e?(t-i)/(e-i):0}function xr(i,e,t){return(1-t)*i+t*e}function Qu(i,e,t,n){return xr(i,e,1-Math.exp(-t*n))}function ef(i,e=1){return e-Math.abs(ic(i,e*2)-e)}function tf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function nf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function sf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function rf(i,e){return i+Math.random()*(e-i)}function af(i){return i*(.5-Math.random())}function of(i){i!==void 0&&(Ic=i);let e=Ic+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function lf(i){return i*mr}function cf(i){return i*Lr}function hf(i){return(i&i-1)===0&&i!==0}function df(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function uf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ff(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),f=r((e-n)/2),p=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*f,l*p,o*c);break;case"YZY":i.set(l*p,o*u,l*f,o*c);break;case"ZXZ":i.set(l*f,l*p,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*u,o*c);break;default:lt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Wn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const De={DEG2RAD:mr,RAD2DEG:Lr,generateUUID:ri,clamp:vt,euclideanModulo:ic,mapLinear:Ju,inverseLerp:ju,lerp:xr,damp:Qu,pingpong:ef,smoothstep:tf,smootherstep:nf,randInt:sf,randFloat:rf,randFloatSpread:af,seededRandom:of,degToRad:lf,radToDeg:cf,isPowerOfTwo:hf,ceilPowerOfTwo:df,floorPowerOfTwo:uf,setQuaternionFromProperEuler:ff,normalize:Nt,denormalize:Wn};class Te{constructor(e=0,t=0){Te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Si{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],f=n[s+3],p=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==p||c!==m||u!==g){let x=l*p+c*m+u*g+f*_;x<0&&(p=-p,m=-m,g=-g,_=-_,x=-x);let d=1-o;if(x<.9995){const v=Math.acos(x),M=Math.sin(v);d=Math.sin(d*v)/M,o=Math.sin(o*v)/M,l=l*d+p*o,c=c*d+m*o,u=u*d+g*o,f=f*d+_*o}else{l=l*d+p*o,c=c*d+m*o,u=u*d+g*o,f=f*d+_*o;const v=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=v,c*=v,u*=v,f*=v}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],f=r[a],p=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+u*f+l*m-c*p,e[t+1]=l*g+u*p+c*f-o*m,e[t+2]=c*g+u*m+o*p-l*f,e[t+3]=u*g-o*f-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),f=o(r/2),p=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=p*u*f+c*m*g,this._y=c*m*f-p*u*g,this._z=c*u*g+p*m*f,this._w=c*u*f-p*m*g;break;case"YXZ":this._x=p*u*f+c*m*g,this._y=c*m*f-p*u*g,this._z=c*u*g-p*m*f,this._w=c*u*f+p*m*g;break;case"ZXY":this._x=p*u*f-c*m*g,this._y=c*m*f+p*u*g,this._z=c*u*g+p*m*f,this._w=c*u*f-p*m*g;break;case"ZYX":this._x=p*u*f-c*m*g,this._y=c*m*f+p*u*g,this._z=c*u*g-p*m*f,this._w=c*u*f+p*m*g;break;case"YZX":this._x=p*u*f+c*m*g,this._y=c*m*f+p*u*g,this._z=c*u*g-p*m*f,this._w=c*u*f-p*m*g;break;case"XZY":this._x=p*u*f-c*m*g,this._y=c*m*f-p*u*g,this._z=c*u*g+p*m*f,this._w=c*u*f+p*m*g;break;default:lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],p=n+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return to.copy(this).projectOnVector(e),this.sub(to)}reflect(e){return this.sub(to.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const to=new P,Uc=new Si;class pt{constructor(e,t,n,s,r,a,o,l,c){pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],p=n[2],m=n[5],g=n[8],_=s[0],x=s[3],d=s[6],v=s[1],M=s[4],y=s[7],E=s[2],T=s[5],R=s[8];return r[0]=a*_+o*v+l*E,r[3]=a*x+o*M+l*T,r[6]=a*d+o*y+l*R,r[1]=c*_+u*v+f*E,r[4]=c*x+u*M+f*T,r[7]=c*d+u*y+f*R,r[2]=p*_+m*v+g*E,r[5]=p*x+m*M+g*T,r[8]=p*d+m*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,p=o*l-u*r,m=c*r-a*l,g=t*f+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(s*c-u*n)*_,e[2]=(o*n-s*a)*_,e[3]=p*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(no.makeScale(e,t)),this}rotate(e){return this.premultiply(no.makeRotation(-e)),this}translate(e,t){return this.premultiply(no.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const no=new pt,Fc=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nc=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pf(){const i={enabled:!0,workingColorSpace:Gs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ft&&(s.r=_i(s.r),s.g=_i(s.g),s.b=_i(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ft&&(s.r=Fs(s.r),s.g=Fs(s.g),s.b=Fs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Di?Ia:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Pr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Pr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gs]:{primaries:e,whitePoint:n,transfer:Ia,toXYZ:Fc,fromXYZ:Nc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:Ft,toXYZ:Fc,fromXYZ:Nc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),i}const Ct=pf();function _i(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ps;class mf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ps===void 0&&(ps=Fa("canvas")),ps.width=e.width,ps.height=e.height;const s=ps.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ps}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Fa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=_i(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(_i(t[n]/255)*255):t[n]=_i(t[n]);return{data:t,width:e.width,height:e.height}}else return lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xf=0;class sc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=ri(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(io(s[a].image)):r.push(io(s[a]))}else r=io(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(lt("Texture: Unable to serialize Texture."),{})}let gf=0;const so=new P;class un extends Ys{constructor(e=un.DEFAULT_IMAGE,t=un.DEFAULT_MAPPING,n=vi,s=vi,r=Fn,a=Qi,o=qn,l=ai,c=un.DEFAULT_ANISOTROPY,u=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=ri(),this.name="",this.source=new sc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(so).x}get height(){return this.source.getSize(so).y}get depth(){return this.source.getSize(so).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){lt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==od)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fn:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case nl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fn:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case nl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=od;un.DEFAULT_ANISOTROPY=1;class zt{constructor(e=0,t=0,n=0,s=1){zt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],p=l[1],m=l[5],g=l[9],_=l[2],x=l[6],d=l[10];if(Math.abs(u-p)<.01&&Math.abs(f-_)<.01&&Math.abs(g-x)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+_)<.1&&Math.abs(g+x)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(m+1)/2,E=(d+1)/2,T=(u+p)/4,R=(f+_)/4,C=(g+x)/4;return M>y&&M>E?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=R/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=C/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=C/r),this.set(n,s,r,t),this}let v=Math.sqrt((x-g)*(x-g)+(f-_)*(f-_)+(p-u)*(p-u));return Math.abs(v)<.001&&(v=1),this.x=(x-g)/v,this.y=(f-_)/v,this.z=(p-u)/v,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this.w=vt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this.w=vt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vf extends Ys{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new zt(0,0,e,t),this.scissorTest=!1,this.viewport=new zt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new un(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Fn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new sc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zn extends vf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xd extends un{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class _f extends un{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hs{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Bn):Bn.fromBufferAttribute(r,a),Bn.applyMatrix4(e.matrixWorld),this.expandByPoint(Bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(e.matrixWorld),this.union(qr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bn),Bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qs),Yr.subVectors(this.max,Qs),ms.subVectors(e.a,Qs),xs.subVectors(e.b,Qs),gs.subVectors(e.c,Qs),yi.subVectors(xs,ms),wi.subVectors(gs,xs),ki.subVectors(ms,gs);let t=[0,-yi.z,yi.y,0,-wi.z,wi.y,0,-ki.z,ki.y,yi.z,0,-yi.x,wi.z,0,-wi.x,ki.z,0,-ki.x,-yi.y,yi.x,0,-wi.y,wi.x,0,-ki.y,ki.x,0];return!ro(t,ms,xs,gs,Yr)||(t=[1,0,0,0,1,0,0,0,1],!ro(t,ms,xs,gs,Yr))?!1:(Zr.crossVectors(yi,wi),t=[Zr.x,Zr.y,Zr.z],ro(t,ms,xs,gs,Yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ci=[new P,new P,new P,new P,new P,new P,new P,new P],Bn=new P,qr=new hs,ms=new P,xs=new P,gs=new P,yi=new P,wi=new P,ki=new P,Qs=new P,Yr=new P,Zr=new P,Vi=new P;function ro(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Vi.fromArray(i,r);const o=s.x*Math.abs(Vi.x)+s.y*Math.abs(Vi.y)+s.z*Math.abs(Vi.z),l=e.dot(Vi),c=t.dot(Vi),u=n.dot(Vi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Mf=new hs,er=new P,ao=new P;class Zs{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Mf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;er.subVectors(e,this.center);const t=er.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(er,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ao.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(er.copy(e.center).add(ao)),this.expandByPoint(er.copy(e.center).sub(ao))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const hi=new P,oo=new P,$r=new P,bi=new P,lo=new P,Kr=new P,co=new P;class rc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,t),hi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){oo.copy(e).add(t).multiplyScalar(.5),$r.copy(t).sub(e).normalize(),bi.copy(this.origin).sub(oo);const r=e.distanceTo(t)*.5,a=-this.direction.dot($r),o=bi.dot(this.direction),l=-bi.dot($r),c=bi.lengthSq(),u=Math.abs(1-a*a);let f,p,m,g;if(u>0)if(f=a*l-o,p=a*o-l,g=r*u,f>=0)if(p>=-g)if(p<=g){const _=1/u;f*=_,p*=_,m=f*(f+a*p+2*o)+p*(a*f+p+2*l)+c}else p=r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;else p=-r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;else p<=-g?(f=Math.max(0,-(-a*r+o)),p=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+p*(p+2*l)+c):p<=g?(f=0,p=Math.min(Math.max(-r,-l),r),m=p*(p+2*l)+c):(f=Math.max(0,-(a*r+o)),p=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+p*(p+2*l)+c);else p=a>0?-r:r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(oo).addScaledVector($r,p),m}intersectSphere(e,t){hi.subVectors(e.center,this.origin);const n=hi.dot(this.direction),s=hi.dot(hi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),u>=0?(r=(e.min.y-p.y)*u,a=(e.max.y-p.y)*u):(r=(e.max.y-p.y)*u,a=(e.min.y-p.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-p.z)*f,l=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,l=(e.min.z-p.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,t,n,s,r){lo.subVectors(t,e),Kr.subVectors(n,e),co.crossVectors(lo,Kr);let a=this.direction.dot(co),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;bi.subVectors(this.origin,e);const l=o*this.direction.dot(Kr.crossVectors(bi,Kr));if(l<0)return null;const c=o*this.direction.dot(lo.cross(bi));if(c<0||l+c>a)return null;const u=-o*bi.dot(co);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tt{constructor(e,t,n,s,r,a,o,l,c,u,f,p,m,g,_,x){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,f,p,m,g,_,x)}set(e,t,n,s,r,a,o,l,c,u,f,p,m,g,_,x){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=p,d[3]=m,d[7]=g,d[11]=_,d[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/vs.setFromMatrixColumn(e,0).length(),r=1/vs.setFromMatrixColumn(e,1).length(),a=1/vs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const p=a*u,m=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+g*c,t[5]=p-_*c,t[9]=-o*l,t[2]=_-p*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const p=l*u,m=l*f,g=c*u,_=c*f;t[0]=p+_*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=_+p*o,t[10]=a*l}else if(e.order==="ZXY"){const p=l*u,m=l*f,g=c*u,_=c*f;t[0]=p-_*o,t[4]=-a*f,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=_-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const p=a*u,m=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=g*c-m,t[8]=p*c+_,t[1]=l*f,t[5]=_*c+p,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const p=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-p*f,t[8]=g*f+m,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*f+g,t[10]=p-_*f}else if(e.order==="XZY"){const p=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=p*f+_,t[5]=a*u,t[9]=m*f-g,t[2]=g*f-m,t[6]=o*u,t[10]=_*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sf,e,yf)}lookAt(e,t,n){const s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Ti.crossVectors(n,En),Ti.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Ti.crossVectors(n,En)),Ti.normalize(),Jr.crossVectors(En,Ti),s[0]=Ti.x,s[4]=Jr.x,s[8]=En.x,s[1]=Ti.y,s[5]=Jr.y,s[9]=En.y,s[2]=Ti.z,s[6]=Jr.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],p=n[9],m=n[13],g=n[2],_=n[6],x=n[10],d=n[14],v=n[3],M=n[7],y=n[11],E=n[15],T=s[0],R=s[4],C=s[8],w=s[12],S=s[1],L=s[5],U=s[9],H=s[13],ee=s[2],te=s[6],W=s[10],j=s[14],ne=s[3],de=s[7],fe=s[11],Ve=s[15];return r[0]=a*T+o*S+l*ee+c*ne,r[4]=a*R+o*L+l*te+c*de,r[8]=a*C+o*U+l*W+c*fe,r[12]=a*w+o*H+l*j+c*Ve,r[1]=u*T+f*S+p*ee+m*ne,r[5]=u*R+f*L+p*te+m*de,r[9]=u*C+f*U+p*W+m*fe,r[13]=u*w+f*H+p*j+m*Ve,r[2]=g*T+_*S+x*ee+d*ne,r[6]=g*R+_*L+x*te+d*de,r[10]=g*C+_*U+x*W+d*fe,r[14]=g*w+_*H+x*j+d*Ve,r[3]=v*T+M*S+y*ee+E*ne,r[7]=v*R+M*L+y*te+E*de,r[11]=v*C+M*U+y*W+E*fe,r[15]=v*w+M*H+y*j+E*Ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],p=e[10],m=e[14],g=e[3],_=e[7],x=e[11],d=e[15];return g*(+r*l*f-s*c*f-r*o*p+n*c*p+s*o*m-n*l*m)+_*(+t*l*m-t*c*p+r*a*p-s*a*m+s*c*u-r*l*u)+x*(+t*c*f-t*o*m-r*a*f+n*a*m+r*o*u-n*c*u)+d*(-s*o*u-t*l*f+t*o*p+s*a*f-n*a*p+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],p=e[10],m=e[11],g=e[12],_=e[13],x=e[14],d=e[15],v=f*x*c-_*p*c+_*l*m-o*x*m-f*l*d+o*p*d,M=g*p*c-u*x*c-g*l*m+a*x*m+u*l*d-a*p*d,y=u*_*c-g*f*c+g*o*m-a*_*m-u*o*d+a*f*d,E=g*f*l-u*_*l-g*o*p+a*_*p+u*o*x-a*f*x,T=t*v+n*M+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=v*R,e[1]=(_*p*r-f*x*r-_*s*m+n*x*m+f*s*d-n*p*d)*R,e[2]=(o*x*r-_*l*r+_*s*c-n*x*c-o*s*d+n*l*d)*R,e[3]=(f*l*r-o*p*r-f*s*c+n*p*c+o*s*m-n*l*m)*R,e[4]=M*R,e[5]=(u*x*r-g*p*r+g*s*m-t*x*m-u*s*d+t*p*d)*R,e[6]=(g*l*r-a*x*r-g*s*c+t*x*c+a*s*d-t*l*d)*R,e[7]=(a*p*r-u*l*r+u*s*c-t*p*c-a*s*m+t*l*m)*R,e[8]=y*R,e[9]=(g*f*r-u*_*r-g*n*m+t*_*m+u*n*d-t*f*d)*R,e[10]=(a*_*r-g*o*r+g*n*c-t*_*c-a*n*d+t*o*d)*R,e[11]=(u*o*r-a*f*r-u*n*c+t*f*c+a*n*m-t*o*m)*R,e[12]=E*R,e[13]=(u*_*s-g*f*s+g*n*p-t*_*p-u*n*x+t*f*x)*R,e[14]=(g*o*s-a*_*s-g*n*l+t*_*l+a*n*x-t*o*x)*R,e[15]=(a*f*s-u*o*s+u*n*l-t*f*l-a*n*p+t*o*p)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,p=r*c,m=r*u,g=r*f,_=a*u,x=a*f,d=o*f,v=l*c,M=l*u,y=l*f,E=n.x,T=n.y,R=n.z;return s[0]=(1-(_+d))*E,s[1]=(m+y)*E,s[2]=(g-M)*E,s[3]=0,s[4]=(m-y)*T,s[5]=(1-(p+d))*T,s[6]=(x+v)*T,s[7]=0,s[8]=(g+M)*R,s[9]=(x-v)*R,s[10]=(1-(p+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=vs.set(s[0],s[1],s[2]).length();const a=vs.set(s[4],s[5],s[6]).length(),o=vs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],kn.copy(this);const c=1/r,u=1/a,f=1/o;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=u,kn.elements[5]*=u,kn.elements[6]*=u,kn.elements[8]*=f,kn.elements[9]*=f,kn.elements[10]*=f,t.setFromRotationMatrix(kn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=ti,l=!1){const c=this.elements,u=2*r/(t-e),f=2*r/(n-s),p=(t+e)/(t-e),m=(n+s)/(n-s);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===ti)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Ua)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=ti,l=!1){const c=this.elements,u=2/(t-e),f=2/(n-s),p=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===ti)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===Ua)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const vs=new P,kn=new Tt,Sf=new P(0,0,0),yf=new P(1,1,1),Ti=new P,Jr=new P,En=new P,zc=new Tt,Oc=new Si;class Kn{constructor(e=0,t=0,n=0,s=Kn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-vt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oc.setFromEuler(this),this.setFromQuaternion(Oc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Kn.DEFAULT_ORDER="XYZ";class ac{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wf=0;const Bc=new P,_s=new Si,di=new Tt,jr=new P,tr=new P,bf=new P,Tf=new Si,kc=new P(1,0,0),Vc=new P(0,1,0),Gc=new P(0,0,1),Hc={type:"added"},Ef={type:"removed"},Ms={type:"childadded",child:null},ho={type:"childremoved",child:null};class Vt extends Ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vt.DEFAULT_UP.clone();const e=new P,t=new Kn,n=new Si,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new pt}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=Vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ac,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.multiply(_s),this}rotateOnWorldAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.premultiply(_s),this}rotateX(e){return this.rotateOnAxis(kc,e)}rotateY(e){return this.rotateOnAxis(Vc,e)}rotateZ(e){return this.rotateOnAxis(Gc,e)}translateOnAxis(e,t){return Bc.copy(e).applyQuaternion(this.quaternion),this.position.add(Bc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(kc,e)}translateY(e){return this.translateOnAxis(Vc,e)}translateZ(e){return this.translateOnAxis(Gc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jr.copy(e):jr.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(tr,jr,this.up):di.lookAt(jr,tr,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),_s.setFromRotationMatrix(di),this.quaternion.premultiply(_s.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Xt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hc),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null):Xt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ef),ho.child=e,this.dispatchEvent(ho),ho.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hc),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,e,bf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,Tf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),p=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Vt.DEFAULT_UP=new P(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vn=new P,ui=new P,uo=new P,fi=new P,Ss=new P,ys=new P,Wc=new P,fo=new P,po=new P,mo=new P,xo=new zt,go=new zt,vo=new zt;class Un{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),ui.subVectors(n,t),uo.subVectors(e,t);const a=Vn.dot(Vn),o=Vn.dot(ui),l=Vn.dot(uo),c=ui.dot(ui),u=ui.dot(uo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const p=1/f,m=(c*l-o*u)*p,g=(a*u-o*l)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,fi.x),l.addScaledVector(a,fi.y),l.addScaledVector(o,fi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return xo.setScalar(0),go.setScalar(0),vo.setScalar(0),xo.fromBufferAttribute(e,t),go.fromBufferAttribute(e,n),vo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(xo,r.x),a.addScaledVector(go,r.y),a.addScaledVector(vo,r.z),a}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),ui.subVectors(e,t),Vn.cross(ui).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),Vn.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Un.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ss.subVectors(s,n),ys.subVectors(r,n),fo.subVectors(e,n);const l=Ss.dot(fo),c=ys.dot(fo);if(l<=0&&c<=0)return t.copy(n);po.subVectors(e,s);const u=Ss.dot(po),f=ys.dot(po);if(u>=0&&f<=u)return t.copy(s);const p=l*f-u*c;if(p<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ss,a);mo.subVectors(e,r);const m=Ss.dot(mo),g=ys.dot(mo);if(g>=0&&m<=g)return t.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ys,o);const x=u*g-m*f;if(x<=0&&f-u>=0&&m-g>=0)return Wc.subVectors(r,s),o=(f-u)/(f-u+(m-g)),t.copy(s).addScaledVector(Wc,o);const d=1/(x+_+p);return a=_*d,o=p*d,t.copy(n).addScaledVector(Ss,a).addScaledVector(ys,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const gd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},Qr={h:0,s:0,l:0};function _o(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class nt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ct.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ct.workingColorSpace){if(e=ic(e,1),t=vt(t,0,1),n=vt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=_o(a,r,e+1/3),this.g=_o(a,r,e),this.b=_o(a,r,e-1/3)}return Ct.colorSpaceToWorking(this,s),this}setStyle(e,t=bt){function n(r){r!==void 0&&parseFloat(r)<1&&lt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:lt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);lt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){const n=gd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):lt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}copyLinearToSRGB(e){return this.r=Fs(e.r),this.g=Fs(e.g),this.b=Fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return Ct.workingToColorSpace(cn.copy(this),e),Math.round(vt(cn.r*255,0,255))*65536+Math.round(vt(cn.g*255,0,255))*256+Math.round(vt(cn.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.workingToColorSpace(cn.copy(this),t);const n=cn.r,s=cn.g,r=cn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ct.workingColorSpace){return Ct.workingToColorSpace(cn.copy(this),t),e.r=cn.r,e.g=cn.g,e.b=cn.b,e}getStyle(e=bt){Ct.workingToColorSpace(cn.copy(this),e);const t=cn.r,n=cn.g,s=cn.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+t,Ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ei),e.getHSL(Qr);const n=xr(Ei.h,Qr.h,t),s=xr(Ei.s,Qr.s,t),r=xr(Ei.l,Qr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const cn=new nt;nt.NAMES=gd;let Af=0;class zi extends Ys{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=ri(),this.name="",this.type="Material",this.blending=Us,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xo,this.blendDst=qo,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){lt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(n.blending=this.blending),this.side!==Ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xo&&(n.blendSrc=this.blendSrc),this.blendDst!==qo&&(n.blendDst=this.blendDst),this.blendEquation!==Ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends zi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Jt=new P,ea=new Te;let Cf=0;class Nn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ll,this.updateRanges=[],this.gpuType=ei,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyMatrix3(e),this.setXY(t,ea.x,ea.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix3(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Wn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Wn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Wn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Wn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ll&&(e.usage=this.usage),e}}class vd extends Nn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class _d extends Nn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Et extends Nn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Rf=0;const Ln=new Tt,Mo=new Vt,ws=new P,An=new hs,nr=new hs,sn=new P;class Yt extends Ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(md(e)?_d:vd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new pt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ln.makeRotationFromQuaternion(e),this.applyMatrix4(Ln),this}rotateX(e){return Ln.makeRotationX(e),this.applyMatrix4(Ln),this}rotateY(e){return Ln.makeRotationY(e),this.applyMatrix4(Ln),this}rotateZ(e){return Ln.makeRotationZ(e),this.applyMatrix4(Ln),this}translate(e,t,n){return Ln.makeTranslation(e,t,n),this.applyMatrix4(Ln),this}scale(e,t,n){return Ln.makeScale(e,t,n),this.applyMatrix4(Ln),this}lookAt(e){return Mo.lookAt(e),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ws).negate(),this.translate(ws.x,ws.y,ws.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Et(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];nr.setFromBufferAttribute(o),this.morphTargetsRelative?(sn.addVectors(An.min,nr.min),An.expandByPoint(sn),sn.addVectors(An.max,nr.max),An.expandByPoint(sn)):(An.expandByPoint(nr.min),An.expandByPoint(nr.max))}An.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)sn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(sn));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)sn.fromBufferAttribute(o,c),l&&(ws.fromBufferAttribute(e,c),sn.add(ws)),s=Math.max(s,n.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Xt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Xt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new P,l[C]=new P;const c=new P,u=new P,f=new P,p=new Te,m=new Te,g=new Te,_=new P,x=new P;function d(C,w,S){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,w),f.fromBufferAttribute(n,S),p.fromBufferAttribute(r,C),m.fromBufferAttribute(r,w),g.fromBufferAttribute(r,S),u.sub(c),f.sub(c),m.sub(p),g.sub(p);const L=1/(m.x*g.y-g.x*m.y);isFinite(L)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(L),x.copy(f).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(L),o[C].add(_),o[w].add(_),o[S].add(_),l[C].add(x),l[w].add(x),l[S].add(x))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let C=0,w=v.length;C<w;++C){const S=v[C],L=S.start,U=S.count;for(let H=L,ee=L+U;H<ee;H+=3)d(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const M=new P,y=new P,E=new P,T=new P;function R(C){E.fromBufferAttribute(s,C),T.copy(E);const w=o[C];M.copy(w),M.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(T,w);const L=y.dot(l[C])<0?-1:1;a.setXYZW(C,M.x,M.y,M.z,L)}for(let C=0,w=v.length;C<w;++C){const S=v[C],L=S.start,U=S.count;for(let H=L,ee=L+U;H<ee;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const g=e.getX(p+0),_=e.getX(p+1),x=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,x),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,x),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)sn.fromBufferAttribute(e,t),sn.normalize(),e.setXYZ(t,sn.x,sn.y,sn.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,p=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,x=l.length;_<x;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*u;for(let d=0;d<u;d++)p[g++]=c[m++]}return new Nn(p,u,f)}if(this.index===null)return lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Yt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const p=c[u],m=e(p,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,p=c.length;f<p;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let p=0,m=f.length;p<m;p++)u.push(f[p].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Xc=new Tt,Gi=new rc,ta=new Zs,qc=new P,na=new P,ia=new P,sa=new P,So=new P,ra=new P,Yc=new P,aa=new P;class V extends Vt{constructor(e=new Yt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ra.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(So.fromBufferAttribute(f,e),a?ra.addScaledVector(So,u):ra.addScaledVector(So.sub(t),u))}t.add(ra)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ta.copy(n.boundingSphere),ta.applyMatrix4(r),Gi.copy(e.ray).recast(e.near),!(ta.containsPoint(Gi.origin)===!1&&(Gi.intersectSphere(ta,qc)===null||Gi.origin.distanceToSquared(qc)>(e.far-e.near)**2))&&(Xc.copy(r).invert(),Gi.copy(e.ray).applyMatrix4(Xc),!(n.boundingBox!==null&&Gi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Gi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const x=p[g],d=a[x.materialIndex],v=Math.max(x.start,m.start),M=Math.min(o.count,Math.min(x.start+x.count,m.start+m.count));for(let y=v,E=M;y<E;y+=3){const T=o.getX(y),R=o.getX(y+1),C=o.getX(y+2);s=oa(this,d,e,n,c,u,f,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let x=g,d=_;x<d;x+=3){const v=o.getX(x),M=o.getX(x+1),y=o.getX(x+2);s=oa(this,a,e,n,c,u,f,v,M,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const x=p[g],d=a[x.materialIndex],v=Math.max(x.start,m.start),M=Math.min(l.count,Math.min(x.start+x.count,m.start+m.count));for(let y=v,E=M;y<E;y+=3){const T=y,R=y+1,C=y+2;s=oa(this,d,e,n,c,u,f,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let x=g,d=_;x<d;x+=3){const v=x,M=x+1,y=x+2;s=oa(this,a,e,n,c,u,f,v,M,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function Pf(i,e,t,n,s,r,a,o){let l;if(e.side===dn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ni,o),l===null)return null;aa.copy(o),aa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(aa);return c<t.near||c>t.far?null:{distance:c,point:aa.clone(),object:i}}function oa(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,na),i.getVertexPosition(l,ia),i.getVertexPosition(c,sa);const u=Pf(i,e,t,n,na,ia,sa,Yc);if(u){const f=new P;Un.getBarycoord(Yc,na,ia,sa,f),s&&(u.uv=Un.getInterpolatedAttribute(s,o,l,c,f,new Te)),r&&(u.uv1=Un.getInterpolatedAttribute(r,o,l,c,f,new Te)),a&&(u.normal=Un.getInterpolatedAttribute(a,o,l,c,f,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new P,materialIndex:0};Un.getNormal(na,ia,sa,p.normal),u.face=p,u.barycoord=f}return u}class Ue extends Yt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let p=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Et(c,3)),this.setAttribute("normal",new Et(u,3)),this.setAttribute("uv",new Et(f,2));function g(_,x,d,v,M,y,E,T,R,C,w){const S=y/R,L=E/C,U=y/2,H=E/2,ee=T/2,te=R+1,W=C+1;let j=0,ne=0;const de=new P;for(let fe=0;fe<W;fe++){const Ve=fe*L-H;for(let I=0;I<te;I++){const Se=I*S-U;de[_]=Se*v,de[x]=Ve*M,de[d]=ee,c.push(de.x,de.y,de.z),de[_]=0,de[x]=0,de[d]=T>0?1:-1,u.push(de.x,de.y,de.z),f.push(I/R),f.push(1-fe/C),j+=1}}for(let fe=0;fe<C;fe++)for(let Ve=0;Ve<R;Ve++){const I=p+Ve+te*fe,Se=p+Ve+te*(fe+1),ge=p+(Ve+1)+te*(fe+1),ye=p+(Ve+1)+te*fe;l.push(I,Se,ye),l.push(Se,ge,ye),ne+=6}o.addGroup(m,ne,w),m+=ne,p+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ue(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Hs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function vn(i){const e={};for(let t=0;t<i.length;t++){const n=Hs(i[t]);for(const s in n)e[s]=n[s]}return e}function Lf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Md(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const Dr={clone:Hs,merge:vn};var Df=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,If=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends zi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Df,this.fragmentShader=If,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hs(e.uniforms),this.uniformsGroups=Lf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Sd extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ai=new P,Zc=new Te,$c=new Te;class Cn extends Sd{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Lr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lr*2*Math.atan(Math.tan(mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z)}getViewSize(e,t){return this.getViewBounds(e,Zc,$c),t.subVectors($c,Zc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(mr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const bs=-90,Ts=1;class Uf extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Cn(bs,Ts,e,t);s.layers=this.layers,this.add(s);const r=new Cn(bs,Ts,e,t);r.layers=this.layers,this.add(r);const a=new Cn(bs,Ts,e,t);a.layers=this.layers,this.add(a);const o=new Cn(bs,Ts,e,t);o.layers=this.layers,this.add(o);const l=new Cn(bs,Ts,e,t);l.layers=this.layers,this.add(l);const c=new Cn(bs,Ts,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===ti)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ua)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(f,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yd extends un{constructor(e=[],t=ks,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ff extends Zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new yd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ue(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:Hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:ii});r.uniforms.tEquirect.value=t;const a=new V(s,r),o=t.minFilter;return t.minFilter===Qi&&(t.minFilter=Fn),new Uf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class at extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nf={type:"move"};class yo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const x=t.getJointPose(_,n),d=this._getHandJoint(c,_);x!==null&&(d.matrix.fromArray(x.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=x.radius),d.visible=x!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=u.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&p>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class oc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new nt(e),this.near=t,this.far=n}clone(){return new oc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class wd extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kn,this.environmentIntensity=1,this.environmentRotation=new Kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class zf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ll,this.updateRanges=[],this.version=0,this.uuid=ri()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const gn=new P;class za{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix4(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gn.fromBufferAttribute(this,t),gn.applyNormalMatrix(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gn.fromBufferAttribute(this,t),gn.transformDirection(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Wn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Wn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Wn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Wn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array),r=Nt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Na("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new za(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Na("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class bd extends zi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new nt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Es;const ir=new P,As=new P,Cs=new P,Rs=new Te,sr=new Te,Td=new Tt,la=new P,rr=new P,ca=new P,Kc=new Te,wo=new Te,Jc=new Te;class jc extends Vt{constructor(e=new bd){if(super(),this.isSprite=!0,this.type="Sprite",Es===void 0){Es=new Yt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new zf(t,5);Es.setIndex([0,1,2,0,2,3]),Es.setAttribute("position",new za(n,3,0,!1)),Es.setAttribute("uv",new za(n,2,3,!1))}this.geometry=Es,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Xt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),As.setFromMatrixScale(this.matrixWorld),Td.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Cs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&As.multiplyScalar(-Cs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ha(la.set(-.5,-.5,0),Cs,a,As,s,r),ha(rr.set(.5,-.5,0),Cs,a,As,s,r),ha(ca.set(.5,.5,0),Cs,a,As,s,r),Kc.set(0,0),wo.set(1,0),Jc.set(1,1);let o=e.ray.intersectTriangle(la,rr,ca,!1,ir);if(o===null&&(ha(rr.set(-.5,.5,0),Cs,a,As,s,r),wo.set(0,1),o=e.ray.intersectTriangle(la,ca,rr,!1,ir),o===null))return;const l=e.ray.origin.distanceTo(ir);l<e.near||l>e.far||t.push({distance:l,point:ir.clone(),uv:Un.getInterpolation(ir,la,rr,ca,Kc,wo,Jc,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function ha(i,e,t,n,s,r){Rs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(sr.x=r*Rs.x-s*Rs.y,sr.y=s*Rs.x+r*Rs.y):sr.copy(Rs),i.copy(e),i.x+=sr.x,i.y+=sr.y,i.applyMatrix4(Td)}class Ed extends un{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Rn,u=Rn,f,p){super(null,a,o,l,c,u,s,r,f,p),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qc extends Nn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ps=new Tt,eh=new Tt,da=[],th=new hs,Of=new Tt,ar=new V,or=new Zs;class on extends V{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Qc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Of)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new hs),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ps),th.copy(e.boundingBox).applyMatrix4(Ps),this.boundingBox.union(th)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ps),or.copy(e.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),or.copy(this.boundingSphere),or.applyMatrix4(n),e.ray.intersectsSphere(or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ps),eh.multiplyMatrices(n,Ps),ar.matrixWorld=eh,ar.raycast(e,da);for(let a=0,o=da.length;a<o;a++){const l=da[a];l.instanceId=r,l.object=this,t.push(l)}da.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Qc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ed(new Float32Array(s*this.count),s,this.count,Jl,ei));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const bo=new P,Bf=new P,kf=new pt;class Yi{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=bo.subVectors(n,t).cross(Bf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(bo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||kf.getNormalMatrix(e),s=this.coplanarPoint(bo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hi=new Zs,Vf=new Te(.5,.5),ua=new P;class lc{constructor(e=new Yi,t=new Yi,n=new Yi,s=new Yi,r=new Yi,a=new Yi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ti,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],p=r[6],m=r[7],g=r[8],_=r[9],x=r[10],d=r[11],v=r[12],M=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,m-u,d-g,E-v).normalize(),s[1].setComponents(c+a,m+u,d+g,E+v).normalize(),s[2].setComponents(c+o,m+f,d+_,E+M).normalize(),s[3].setComponents(c-o,m-f,d-_,E-M).normalize(),n)s[4].setComponents(l,p,x,y).normalize(),s[5].setComponents(c-l,m-p,d-x,E-y).normalize();else if(s[4].setComponents(c-l,m-p,d-x,E-y).normalize(),t===ti)s[5].setComponents(c+l,m+p,d+x,E+y).normalize();else if(t===Ua)s[5].setComponents(l,p,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hi)}intersectsSprite(e){Hi.center.set(0,0,0);const t=Vf.distanceTo(e.center);return Hi.radius=.7071067811865476+t,Hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ua.x=s.normal.x>0?e.max.x:e.min.x,ua.y=s.normal.y>0?e.max.y:e.min.y,ua.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ua)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Dl extends zi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Oa=new P,Ba=new P,nh=new Tt,lr=new rc,fa=new Zs,To=new P,ih=new P;class sh extends Vt{constructor(e=new Yt,t=new Dl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Oa.fromBufferAttribute(t,s-1),Ba.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Oa.distanceTo(Ba);e.setAttribute("lineDistance",new Et(n,1))}else lt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(s),fa.radius+=r,e.ray.intersectsSphere(fa)===!1)return;nh.copy(s).invert(),lr.copy(e.ray).applyMatrix4(nh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,p=n.attributes.position;if(u!==null){const m=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=m,x=g-1;_<x;_+=c){const d=u.getX(_),v=u.getX(_+1),M=pa(this,e,lr,l,d,v,_);M&&t.push(M)}if(this.isLineLoop){const _=u.getX(g-1),x=u.getX(m),d=pa(this,e,lr,l,_,x,g-1);d&&t.push(d)}}else{const m=Math.max(0,a.start),g=Math.min(p.count,a.start+a.count);for(let _=m,x=g-1;_<x;_+=c){const d=pa(this,e,lr,l,_,_+1,_);d&&t.push(d)}if(this.isLineLoop){const _=pa(this,e,lr,l,g-1,m,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pa(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Oa.fromBufferAttribute(o,s),Ba.fromBufferAttribute(o,r),t.distanceSqToSegment(Oa,Ba,To,ih)>n)return;To.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(To);if(!(c<e.near||c>e.far))return{distance:c,point:ih.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Zt extends un{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ad extends un{constructor(e,t,n=os,s,r,a,o=Rn,l=Rn,c,u=Cr,f=1){if(u!==Cr&&u!==Rr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:f};super(p,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new sc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Cd extends un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class pn extends Yt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new P,u=new Te;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,p=3;f<=t;f++,p+=3){const m=n+f/t*s;c.x=e*Math.cos(m),c.y=e*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[p]/e+1)/2,u.y=(a[p+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Et(a,3)),this.setAttribute("normal",new Et(o,3)),this.setAttribute("uv",new Et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ct extends Yt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],p=[],m=[];let g=0;const _=[],x=n/2;let d=0;v(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new Et(f,3)),this.setAttribute("normal",new Et(p,3)),this.setAttribute("uv",new Et(m,2));function v(){const y=new P,E=new P;let T=0;const R=(t-e)/n;for(let C=0;C<=r;C++){const w=[],S=C/r,L=S*(t-e)+e;for(let U=0;U<=s;U++){const H=U/s,ee=H*l+o,te=Math.sin(ee),W=Math.cos(ee);E.x=L*te,E.y=-S*n+x,E.z=L*W,f.push(E.x,E.y,E.z),y.set(te,R,W).normalize(),p.push(y.x,y.y,y.z),m.push(H,1-S),w.push(g++)}_.push(w)}for(let C=0;C<s;C++)for(let w=0;w<r;w++){const S=_[w][C],L=_[w+1][C],U=_[w+1][C+1],H=_[w][C+1];(e>0||w!==0)&&(u.push(S,L,H),T+=3),(t>0||w!==r-1)&&(u.push(L,U,H),T+=3)}c.addGroup(d,T,0),d+=T}function M(y){const E=g,T=new Te,R=new P;let C=0;const w=y===!0?e:t,S=y===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,x*S,0),p.push(0,S,0),m.push(.5,.5),g++;const L=g;for(let U=0;U<=s;U++){const ee=U/s*l+o,te=Math.cos(ee),W=Math.sin(ee);R.x=w*W,R.y=x*S,R.z=w*te,f.push(R.x,R.y,R.z),p.push(0,S,0),T.x=te*.5+.5,T.y=W*.5*S+.5,m.push(T.x,T.y),g++}for(let U=0;U<s;U++){const H=E+U,ee=L+U;y===!0?u.push(ee,ee+1,H):u.push(ee+1,ee,H),C+=3}c.addGroup(d,C,y===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ct(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class is extends ct{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new is(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class qa extends Yt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new Et(r,3)),this.setAttribute("normal",new Et(r.slice(),3)),this.setAttribute("uv",new Et(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],M),m(t[T+1],y),m(t[T+2],E),l(M,y,E,v)}function l(v,M,y,E){const T=E+1,R=[];for(let C=0;C<=T;C++){R[C]=[];const w=v.clone().lerp(y,C/T),S=M.clone().lerp(y,C/T),L=T-C;for(let U=0;U<=L;U++)U===0&&C===T?R[C][U]=w:R[C][U]=w.clone().lerp(S,U/L)}for(let C=0;C<T;C++)for(let w=0;w<2*(T-C)-1;w++){const S=Math.floor(w/2);w%2===0?(p(R[C][S+1]),p(R[C+1][S]),p(R[C][S])):(p(R[C][S+1]),p(R[C+1][S+1]),p(R[C+1][S]))}}function c(v){const M=new P;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(v),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function u(){const v=new P;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const y=x(v)/2/Math.PI+.5,E=d(v)/Math.PI+.5;a.push(y,1-E)}g(),f()}function f(){for(let v=0;v<a.length;v+=6){const M=a[v+0],y=a[v+2],E=a[v+4],T=Math.max(M,y,E),R=Math.min(M,y,E);T>.9&&R<.1&&(M<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),E<.2&&(a[v+4]+=1))}}function p(v){r.push(v.x,v.y,v.z)}function m(v,M){const y=v*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function g(){const v=new P,M=new P,y=new P,E=new P,T=new Te,R=new Te,C=new Te;for(let w=0,S=0;w<r.length;w+=9,S+=6){v.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),T.set(a[S+0],a[S+1]),R.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),E.copy(v).add(M).add(y).divideScalar(3);const L=x(E);_(T,S+0,v,L),_(R,S+2,M,L),_(C,S+4,y,L)}}function _(v,M,y,E){E<0&&v.x===1&&(a[M]=v.x-1),y.x===0&&y.z===0&&(a[M]=E/2/Math.PI+.5)}function x(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qa(e.vertices,e.indices,e.radius,e.details)}}class cc extends qa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new cc(e.radius,e.detail)}}class oi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){lt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const u=n[s],p=n[s+1]-u,m=(a-u)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Te:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new P,s=[],r=[],a=[],o=new P,l=new Tt;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),p<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(vt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(vt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class hc extends oi{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=l-this.aX,m=c-this.aY;l=p*u-m*f+this.aX,c=p*f+m*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Gf extends hc{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function dc(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let p=(a-r)/c-(o-r)/(c+u)+(o-a)/u,m=(o-a)/u-(l-a)/(u+f)+(l-o)/f;p*=u,m*=u,s(a,o,p,m)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const ma=new P,Eo=new dc,Ao=new dc,Co=new dc;class Hf extends oi{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(ma.subVectors(s[0],s[1]).add(s[0]),c=ma);const f=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(ma.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ma),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),m),_=Math.pow(f.distanceToSquared(p),m),x=Math.pow(p.distanceToSquared(u),m);_<1e-4&&(_=1),g<1e-4&&(g=_),x<1e-4&&(x=_),Eo.initNonuniformCatmullRom(c.x,f.x,p.x,u.x,g,_,x),Ao.initNonuniformCatmullRom(c.y,f.y,p.y,u.y,g,_,x),Co.initNonuniformCatmullRom(c.z,f.z,p.z,u.z,g,_,x)}else this.curveType==="catmullrom"&&(Eo.initCatmullRom(c.x,f.x,p.x,u.x,this.tension),Ao.initCatmullRom(c.y,f.y,p.y,u.y,this.tension),Co.initCatmullRom(c.z,f.z,p.z,u.z,this.tension));return n.set(Eo.calc(l),Ao.calc(l),Co.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function rh(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Wf(i,e){const t=1-i;return t*t*e}function Xf(i,e){return 2*(1-i)*i*e}function qf(i,e){return i*i*e}function gr(i,e,t,n){return Wf(i,e)+Xf(i,t)+qf(i,n)}function Yf(i,e){const t=1-i;return t*t*t*e}function Zf(i,e){const t=1-i;return 3*t*t*i*e}function $f(i,e){return 3*(1-i)*i*i*e}function Kf(i,e){return i*i*i*e}function vr(i,e,t,n,s){return Yf(i,e)+Zf(i,t)+$f(i,n)+Kf(i,s)}class Rd extends oi{constructor(e=new Te,t=new Te,n=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vr(e,s.x,r.x,a.x,o.x),vr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Jf extends oi{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vr(e,s.x,r.x,a.x,o.x),vr(e,s.y,r.y,a.y,o.y),vr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Pd extends oi{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jf extends oi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ld extends oi{constructor(e=new Te,t=new Te,n=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(gr(e,s.x,r.x,a.x),gr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qf extends oi{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(gr(e,s.x,r.x,a.x),gr(e,s.y,r.y,a.y),gr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Dd extends oi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(rh(o,l.x,c.x,u.x,f.x),rh(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Te().fromArray(s))}return this}}var ah=Object.freeze({__proto__:null,ArcCurve:Gf,CatmullRomCurve3:Hf,CubicBezierCurve:Rd,CubicBezierCurve3:Jf,EllipseCurve:hc,LineCurve:Pd,LineCurve3:jf,QuadraticBezierCurve:Ld,QuadraticBezierCurve3:Qf,SplineCurve:Dd});class e0 extends oi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ah[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new ah[s.type]().fromJSON(s))}return this}}class oh extends e0{constructor(e){super(),this.type="Path",this.currentPoint=new Te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Pd(this.currentPoint.clone(),new Te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Ld(this.currentPoint.clone(),new Te(e,t),new Te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Rd(this.currentPoint.clone(),new Te(e,t),new Te(n,s),new Te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Dd(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new hc(e,t,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class uc extends oh{constructor(e){super(e),this.uuid=ri(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new oh().fromJSON(s))}return this}}function t0(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Id(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=a0(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let u=o,f=l;for(let p=t;p<s;p+=t){const m=i[p],g=i[p+1];m<o&&(o=m),g<l&&(l=g),m>u&&(u=m),g>f&&(f=g)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return Ir(r,a,t,o,l,c,0),a}function Id(i,e,t,n,s){let r;if(s===g0(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=lh(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=lh(a/n|0,i[a],i[a+1],r);return r&&Ws(r,r.next)&&(Fr(r),r=r.next),r}function ls(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ws(t,t.next)||qt(t.prev,t,t.next)===0)){if(Fr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ir(i,e,t,n,s,r,a){if(!i)return;!a&&r&&d0(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?i0(i,n,s,r):n0(i)){e.push(l.i,i.i,c.i),Fr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=s0(ls(i),e),Ir(i,e,t,n,s,r,2)):a===2&&r0(i,e,t,n,s,r):Ir(ls(i),e,t,n,s,r,1);break}}}function n0(i){const e=i.prev,t=i,n=i.next;if(qt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(s,r,a),f=Math.min(o,l,c),p=Math.max(s,r,a),m=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=p&&g.y>=f&&g.y<=m&&ur(s,o,r,l,a,c,g.x,g.y)&&qt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function i0(i,e,t,n){const s=i.prev,r=i,a=i.next;if(qt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,f=r.y,p=a.y,m=Math.min(o,l,c),g=Math.min(u,f,p),_=Math.max(o,l,c),x=Math.max(u,f,p),d=Il(m,g,e,t,n),v=Il(_,x,e,t,n);let M=i.prevZ,y=i.nextZ;for(;M&&M.z>=d&&y&&y.z<=v;){if(M.x>=m&&M.x<=_&&M.y>=g&&M.y<=x&&M!==s&&M!==a&&ur(o,u,l,f,c,p,M.x,M.y)&&qt(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=m&&y.x<=_&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&ur(o,u,l,f,c,p,y.x,y.y)&&qt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=d;){if(M.x>=m&&M.x<=_&&M.y>=g&&M.y<=x&&M!==s&&M!==a&&ur(o,u,l,f,c,p,M.x,M.y)&&qt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=v;){if(y.x>=m&&y.x<=_&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&ur(o,u,l,f,c,p,y.x,y.y)&&qt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function s0(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ws(n,s)&&Fd(n,t,t.next,s)&&Ur(n,s)&&Ur(s,n)&&(e.push(n.i,t.i,s.i),Fr(t),Fr(t.next),t=i=s),t=t.next}while(t!==i);return ls(t)}function r0(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&p0(a,o)){let l=Nd(a,o);a=ls(a,a.next),l=ls(l,l.next),Ir(a,e,t,n,s,r,0),Ir(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function a0(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Id(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(f0(c))}s.sort(o0);for(let r=0;r<s.length;r++)t=l0(s[r],t);return t}function o0(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function l0(i,e){const t=c0(i,e);if(!t)return e;const n=Nd(t,i);return ls(n,n.next),ls(t,t.next)}function c0(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ws(i,t))return t;do{if(Ws(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ud(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const f=Math.abs(s-t.y)/(n-t.x);Ur(t,i)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&h0(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function h0(i,e){return qt(i.prev,i,e.prev)<0&&qt(e.next,i,i.next)<0}function d0(i,e,t,n){let s=i;do s.z===0&&(s.z=Il(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,u0(s)}function u0(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Il(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function f0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ud(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ur(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Ud(i,e,t,n,s,r,a,o)}function p0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!m0(i,e)&&(Ur(i,e)&&Ur(e,i)&&x0(i,e)&&(qt(i.prev,i,e.prev)||qt(i,e.prev,e))||Ws(i,e)&&qt(i.prev,i,i.next)>0&&qt(e.prev,e,e.next)>0)}function qt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ws(i,e){return i.x===e.x&&i.y===e.y}function Fd(i,e,t,n){const s=ga(qt(i,e,t)),r=ga(qt(i,e,n)),a=ga(qt(t,n,i)),o=ga(qt(t,n,e));return!!(s!==r&&a!==o||s===0&&xa(i,t,e)||r===0&&xa(i,n,e)||a===0&&xa(t,i,n)||o===0&&xa(t,e,n))}function xa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ga(i){return i>0?1:i<0?-1:0}function m0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Fd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ur(i,e){return qt(i.prev,i,i.next)<0?qt(i,e,i.next)>=0&&qt(i,i.prev,e)>=0:qt(i,e,i.prev)<0||qt(i,i.next,e)<0}function x0(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Nd(i,e){const t=Ul(i.i,i.x,i.y),n=Ul(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function lh(i,e,t,n){const s=Ul(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Fr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ul(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function g0(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class v0{static triangulate(e,t,n=2){return t0(e,t,n)}}class _r{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return _r.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];ch(e),hh(n,e);let a=e.length;t.forEach(ch);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,hh(n,t[l]);const o=v0.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function ch(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function hh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class fc extends qa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new fc(e.radius,e.detail)}}class Bt extends Yt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,f=e/o,p=t/l,m=[],g=[],_=[],x=[];for(let d=0;d<u;d++){const v=d*p-a;for(let M=0;M<c;M++){const y=M*f-r;g.push(y,-v,0),_.push(0,0,1),x.push(M/o),x.push(1-d/l)}}for(let d=0;d<l;d++)for(let v=0;v<o;v++){const M=v+c*d,y=v+c*(d+1),E=v+1+c*(d+1),T=v+1+c*d;m.push(M,y,T),m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new Et(g,3)),this.setAttribute("normal",new Et(_,3)),this.setAttribute("uv",new Et(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ya extends Yt{constructor(e=new uc([new Te(0,.5),new Te(-.5,-.5),new Te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Et(s,3)),this.setAttribute("normal",new Et(r,3)),this.setAttribute("uv",new Et(a,2));function c(u){const f=s.length/3,p=u.extractPoints(t);let m=p.shape;const g=p.holes;_r.isClockWise(m)===!1&&(m=m.reverse());for(let x=0,d=g.length;x<d;x++){const v=g[x];_r.isClockWise(v)===!0&&(g[x]=v.reverse())}const _=_r.triangulateShape(m,g);for(let x=0,d=g.length;x<d;x++){const v=g[x];m=m.concat(v)}for(let x=0,d=m.length;x<d;x++){const v=m[x];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let x=0,d=_.length;x<d;x++){const v=_[x],M=v[0]+f,y=v[1]+f,E=v[2]+f;n.push(M,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return _0(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Ya(n,e.curveSegments)}}function _0(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Ht extends Yt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new P,p=new P,m=[],g=[],_=[],x=[];for(let d=0;d<=n;d++){const v=[],M=d/n;let y=0;d===0&&a===0?y=.5/t:d===n&&l===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+M*o),f.y=e*Math.cos(a+M*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+M*o),g.push(f.x,f.y,f.z),p.copy(f).normalize(),_.push(p.x,p.y,p.z),x.push(T+y,1-M),v.push(c++)}u.push(v)}for(let d=0;d<n;d++)for(let v=0;v<t;v++){const M=u[d][v+1],y=u[d][v],E=u[d+1][v],T=u[d+1][v+1];(d!==0||a>0)&&m.push(M,y,T),(d!==n-1||l<Math.PI)&&m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new Et(g,3)),this.setAttribute("normal",new Et(_,3)),this.setAttribute("uv",new Et(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ht(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Xs extends Yt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new P,f=new P,p=new P;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const _=g/s*r,x=m/n*Math.PI*2;f.x=(e+t*Math.cos(x))*Math.cos(_),f.y=(e+t*Math.cos(x))*Math.sin(_),f.z=t*Math.sin(x),o.push(f.x,f.y,f.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),p.subVectors(f,u).normalize(),l.push(p.x,p.y,p.z),c.push(g/s),c.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const _=(s+1)*m+g-1,x=(s+1)*(m-1)+g-1,d=(s+1)*(m-1)+g,v=(s+1)*m+g;a.push(_,x,v),a.push(x,d,v)}this.setIndex(a),this.setAttribute("position",new Et(o,3)),this.setAttribute("normal",new Et(l,3)),this.setAttribute("uv",new Et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class M0 extends hn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Y extends zi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class S0 extends zi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class y0 extends zi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class w0 extends zi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class pc extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new nt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class b0 extends pc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new nt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ro=new Tt,dh=new P,uh=new P;class zd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=ai,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new zt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;dh.setFromMatrixPosition(e.matrixWorld),t.position.copy(dh),uh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uh),t.updateMatrixWorld(),Ro.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ro,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ro)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const fh=new Tt,cr=new P,Po=new P;class T0 extends zd{constructor(){super(new Cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new zt(2,1,1,1),new zt(0,1,1,1),new zt(3,1,1,1),new zt(1,1,1,1),new zt(3,0,1,1),new zt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),cr.setFromMatrixPosition(e.matrixWorld),n.position.copy(cr),Po.copy(n.position),Po.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Po),n.updateMatrixWorld(),s.makeTranslation(-cr.x,-cr.y,-cr.z),fh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fh,n.coordinateSystem,n.reversedDepth)}}class mc extends pc{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new T0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class xc extends Sd{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class E0 extends zd{constructor(){super(new xc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lo extends pc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new E0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class A0 extends Cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Od{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const ph=new Tt;class C0{constructor(e,t,n=0,s=1/0){this.ray=new rc(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ac,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Xt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ph.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ph),this}intersectObject(e,t=!0,n=[]){return Fl(e,this,n,t),n.sort(mh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Fl(e[s],this,n,t);return n.sort(mh),n}}function mh(i,e){return i.distance-e.distance}function Fl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Fl(r[a],e,t,!0)}}function xh(i,e,t,n){const s=R0(n);switch(t){case ud:return i*e;case Jl:return i*e/s.components*s.byteLength;case jl:return i*e/s.components*s.byteLength;case Ql:return i*e*2/s.components*s.byteLength;case ec:return i*e*2/s.components*s.byteLength;case fd:return i*e*3/s.components*s.byteLength;case qn:return i*e*4/s.components*s.byteLength;case tc:return i*e*4/s.components*s.byteLength;case Ta:case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Aa:case Ca:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case sl:case al:return Math.max(i,16)*Math.max(e,8)/4;case il:case rl:return Math.max(i,8)*Math.max(e,8)/2;case ol:case ll:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case hl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case dl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ul:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case fl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case pl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ml:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case xl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case gl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case vl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case _l:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case yl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case wl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case bl:case Tl:case El:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Al:case Cl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Rl:case Pl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function R0(i){switch(i){case ai:case ld:return{byteLength:1,components:1};case Er:case cd:case si:return{byteLength:2,components:1};case $l:case Kl:return{byteLength:2,components:4};case os:case Zl:case ei:return{byteLength:4,components:1};case hd:case dd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Xl}}));typeof window<"u"&&(window.__THREE__?lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Xl);function Bd(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function P0(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<f.length;m++){const g=f[p],_=f[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,f[p]=_)}f.length=p+1;for(let m=0,g=f.length;m<g;m++){const _=f[m];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var L0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,D0=`#ifdef USE_ALPHAHASH
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
#endif`,I0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,U0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,F0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,N0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,z0=`#ifdef USE_AOMAP
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
#endif`,O0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,B0=`#ifdef USE_BATCHING
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
#endif`,k0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,V0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,G0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,H0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,W0=`#ifdef USE_IRIDESCENCE
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
#endif`,X0=`#ifdef USE_BUMPMAP
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
#endif`,q0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,K0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,J0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,j0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Q0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ep=`#define PI 3.141592653589793
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
} // validated`,tp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,np=`vec3 transformedNormal = objectNormal;
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
#endif`,ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ap=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,op="gl_FragColor = linearToOutputTexel( gl_FragColor );",lp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cp=`#ifdef USE_ENVMAP
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
#endif`,hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,dp=`#ifdef USE_ENVMAP
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
#endif`,up=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vp=`#ifdef USE_GRADIENTMAP
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
}`,_p=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yp=`uniform bool receiveShadow;
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
#endif`,wp=`#ifdef USE_ENVMAP
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
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ep=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cp=`PhysicalMaterial material;
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
#endif`,Rp=`uniform sampler2D dfgLUT;
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
}`,Pp=`
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
#endif`,Lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ip=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Np=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,zp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kp=`#if defined( USE_POINTS_UV )
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
#endif`,Vp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qp=`#ifdef USE_MORPHTARGETS
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
#endif`,Yp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,$p=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qp=`#ifdef USE_NORMALMAP
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
#endif`,em=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,im=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,am=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,mm=`float getShadowMask() {
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
}`,xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gm=`#ifdef USE_SKINNING
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
#endif`,vm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_m=`#ifdef USE_SKINNING
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
#endif`,Mm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bm=`#ifdef USE_TRANSMISSION
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
#endif`,Tm=`#ifdef USE_TRANSMISSION
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
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lm=`uniform sampler2D t2D;
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
}`,Dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nm=`#include <common>
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
}`,zm=`#if DEPTH_PACKING == 3200
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
}`,Om=`#define DISTANCE
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
}`,Bm=`#define DISTANCE
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
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gm=`uniform float scale;
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
}`,Hm=`uniform vec3 diffuse;
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
}`,Wm=`#include <common>
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
}`,Xm=`uniform vec3 diffuse;
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
}`,qm=`#define LAMBERT
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
}`,Ym=`#define LAMBERT
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
}`,Zm=`#define MATCAP
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
}`,$m=`#define MATCAP
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
}`,Km=`#define NORMAL
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
}`,Jm=`#define NORMAL
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
}`,jm=`#define PHONG
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
}`,Qm=`#define PHONG
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
}`,ex=`#define STANDARD
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
}`,tx=`#define STANDARD
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
}`,nx=`#define TOON
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
}`,ix=`#define TOON
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
}`,sx=`uniform float size;
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
}`,rx=`uniform vec3 diffuse;
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
}`,lx=`uniform float rotation;
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
}`,cx=`uniform vec3 diffuse;
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
}`,gt={alphahash_fragment:L0,alphahash_pars_fragment:D0,alphamap_fragment:I0,alphamap_pars_fragment:U0,alphatest_fragment:F0,alphatest_pars_fragment:N0,aomap_fragment:z0,aomap_pars_fragment:O0,batching_pars_vertex:B0,batching_vertex:k0,begin_vertex:V0,beginnormal_vertex:G0,bsdfs:H0,iridescence_fragment:W0,bumpmap_pars_fragment:X0,clipping_planes_fragment:q0,clipping_planes_pars_fragment:Y0,clipping_planes_pars_vertex:Z0,clipping_planes_vertex:$0,color_fragment:K0,color_pars_fragment:J0,color_pars_vertex:j0,color_vertex:Q0,common:ep,cube_uv_reflection_fragment:tp,defaultnormal_vertex:np,displacementmap_pars_vertex:ip,displacementmap_vertex:sp,emissivemap_fragment:rp,emissivemap_pars_fragment:ap,colorspace_fragment:op,colorspace_pars_fragment:lp,envmap_fragment:cp,envmap_common_pars_fragment:hp,envmap_pars_fragment:dp,envmap_pars_vertex:up,envmap_physical_pars_fragment:wp,envmap_vertex:fp,fog_vertex:pp,fog_pars_vertex:mp,fog_fragment:xp,fog_pars_fragment:gp,gradientmap_pars_fragment:vp,lightmap_pars_fragment:_p,lights_lambert_fragment:Mp,lights_lambert_pars_fragment:Sp,lights_pars_begin:yp,lights_toon_fragment:bp,lights_toon_pars_fragment:Tp,lights_phong_fragment:Ep,lights_phong_pars_fragment:Ap,lights_physical_fragment:Cp,lights_physical_pars_fragment:Rp,lights_fragment_begin:Pp,lights_fragment_maps:Lp,lights_fragment_end:Dp,logdepthbuf_fragment:Ip,logdepthbuf_pars_fragment:Up,logdepthbuf_pars_vertex:Fp,logdepthbuf_vertex:Np,map_fragment:zp,map_pars_fragment:Op,map_particle_fragment:Bp,map_particle_pars_fragment:kp,metalnessmap_fragment:Vp,metalnessmap_pars_fragment:Gp,morphinstance_vertex:Hp,morphcolor_vertex:Wp,morphnormal_vertex:Xp,morphtarget_pars_vertex:qp,morphtarget_vertex:Yp,normal_fragment_begin:Zp,normal_fragment_maps:$p,normal_pars_fragment:Kp,normal_pars_vertex:Jp,normal_vertex:jp,normalmap_pars_fragment:Qp,clearcoat_normal_fragment_begin:em,clearcoat_normal_fragment_maps:tm,clearcoat_pars_fragment:nm,iridescence_pars_fragment:im,opaque_fragment:sm,packing:rm,premultiplied_alpha_fragment:am,project_vertex:om,dithering_fragment:lm,dithering_pars_fragment:cm,roughnessmap_fragment:hm,roughnessmap_pars_fragment:dm,shadowmap_pars_fragment:um,shadowmap_pars_vertex:fm,shadowmap_vertex:pm,shadowmask_pars_fragment:mm,skinbase_vertex:xm,skinning_pars_vertex:gm,skinning_vertex:vm,skinnormal_vertex:_m,specularmap_fragment:Mm,specularmap_pars_fragment:Sm,tonemapping_fragment:ym,tonemapping_pars_fragment:wm,transmission_fragment:bm,transmission_pars_fragment:Tm,uv_pars_fragment:Em,uv_pars_vertex:Am,uv_vertex:Cm,worldpos_vertex:Rm,background_vert:Pm,background_frag:Lm,backgroundCube_vert:Dm,backgroundCube_frag:Im,cube_vert:Um,cube_frag:Fm,depth_vert:Nm,depth_frag:zm,distanceRGBA_vert:Om,distanceRGBA_frag:Bm,equirect_vert:km,equirect_frag:Vm,linedashed_vert:Gm,linedashed_frag:Hm,meshbasic_vert:Wm,meshbasic_frag:Xm,meshlambert_vert:qm,meshlambert_frag:Ym,meshmatcap_vert:Zm,meshmatcap_frag:$m,meshnormal_vert:Km,meshnormal_frag:Jm,meshphong_vert:jm,meshphong_frag:Qm,meshphysical_vert:ex,meshphysical_frag:tx,meshtoon_vert:nx,meshtoon_frag:ix,points_vert:sx,points_frag:rx,shadow_vert:ax,shadow_frag:ox,sprite_vert:lx,sprite_frag:cx},ze={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},jn={basic:{uniforms:vn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.fog]),vertexShader:gt.meshbasic_vert,fragmentShader:gt.meshbasic_frag},lambert:{uniforms:vn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new nt(0)}}]),vertexShader:gt.meshlambert_vert,fragmentShader:gt.meshlambert_frag},phong:{uniforms:vn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30}}]),vertexShader:gt.meshphong_vert,fragmentShader:gt.meshphong_frag},standard:{uniforms:vn([ze.common,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.roughnessmap,ze.metalnessmap,ze.fog,ze.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag},toon:{uniforms:vn([ze.common,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.gradientmap,ze.fog,ze.lights,{emissive:{value:new nt(0)}}]),vertexShader:gt.meshtoon_vert,fragmentShader:gt.meshtoon_frag},matcap:{uniforms:vn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,{matcap:{value:null}}]),vertexShader:gt.meshmatcap_vert,fragmentShader:gt.meshmatcap_frag},points:{uniforms:vn([ze.points,ze.fog]),vertexShader:gt.points_vert,fragmentShader:gt.points_frag},dashed:{uniforms:vn([ze.common,ze.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gt.linedashed_vert,fragmentShader:gt.linedashed_frag},depth:{uniforms:vn([ze.common,ze.displacementmap]),vertexShader:gt.depth_vert,fragmentShader:gt.depth_frag},normal:{uniforms:vn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,{opacity:{value:1}}]),vertexShader:gt.meshnormal_vert,fragmentShader:gt.meshnormal_frag},sprite:{uniforms:vn([ze.sprite,ze.fog]),vertexShader:gt.sprite_vert,fragmentShader:gt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gt.background_vert,fragmentShader:gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:gt.backgroundCube_vert,fragmentShader:gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gt.cube_vert,fragmentShader:gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gt.equirect_vert,fragmentShader:gt.equirect_frag},distanceRGBA:{uniforms:vn([ze.common,ze.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gt.distanceRGBA_vert,fragmentShader:gt.distanceRGBA_frag},shadow:{uniforms:vn([ze.lights,ze.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:gt.shadow_vert,fragmentShader:gt.shadow_frag}};jn.physical={uniforms:vn([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag};const va={r:0,b:0,g:0},Wi=new Kn,hx=new Tt;function dx(i,e,t,n,s,r,a){const o=new nt(0);let l=r===!0?0:1,c,u,f=null,p=0,m=null;function g(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?t:e).get(y)),y}function _(M){let y=!1;const E=g(M);E===null?d(o,l):E&&E.isColor&&(d(E,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(M,y){const E=g(y);E&&(E.isCubeTexture||E.mapping===Xa)?(u===void 0&&(u=new V(new Ue(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:Hs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Wi.copy(y.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(hx.makeRotationFromEuler(Wi)),u.material.toneMapped=Ct.getTransfer(E.colorSpace)!==Ft,(f!==E||p!==E.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,f=E,p=E.version,m=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new V(new Bt(2,2),new hn({name:"BackgroundMaterial",uniforms:Hs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ct.getTransfer(E.colorSpace)!==Ft,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=E,p=E.version,m=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,y){M.getRGB(va,Md(i)),n.buffers.color.setClear(va.r,va.g,va.b,y,a)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,y=1){o.set(M),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(o,l)},render:_,addToRenderList:x,dispose:v}}function ux(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(S,L,U,H,ee){let te=!1;const W=f(H,U,L);r!==W&&(r=W,c(r.object)),te=m(S,H,U,ee),te&&g(S,H,U,ee),ee!==null&&e.update(ee,i.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,y(S,L,U,H),ee!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(ee).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function f(S,L,U){const H=U.wireframe===!0;let ee=n[S.id];ee===void 0&&(ee={},n[S.id]=ee);let te=ee[L.id];te===void 0&&(te={},ee[L.id]=te);let W=te[H];return W===void 0&&(W=p(l()),te[H]=W),W}function p(S){const L=[],U=[],H=[];for(let ee=0;ee<t;ee++)L[ee]=0,U[ee]=0,H[ee]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:H,object:S,attributes:{},index:null}}function m(S,L,U,H){const ee=r.attributes,te=L.attributes;let W=0;const j=U.getAttributes();for(const ne in j)if(j[ne].location>=0){const fe=ee[ne];let Ve=te[ne];if(Ve===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(Ve=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(Ve=S.instanceColor)),fe===void 0||fe.attribute!==Ve||Ve&&fe.data!==Ve.data)return!0;W++}return r.attributesNum!==W||r.index!==H}function g(S,L,U,H){const ee={},te=L.attributes;let W=0;const j=U.getAttributes();for(const ne in j)if(j[ne].location>=0){let fe=te[ne];fe===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(fe=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(fe=S.instanceColor));const Ve={};Ve.attribute=fe,fe&&fe.data&&(Ve.data=fe.data),ee[ne]=Ve,W++}r.attributes=ee,r.attributesNum=W,r.index=H}function _(){const S=r.newAttributes;for(let L=0,U=S.length;L<U;L++)S[L]=0}function x(S){d(S,0)}function d(S,L){const U=r.newAttributes,H=r.enabledAttributes,ee=r.attributeDivisors;U[S]=1,H[S]===0&&(i.enableVertexAttribArray(S),H[S]=1),ee[S]!==L&&(i.vertexAttribDivisor(S,L),ee[S]=L)}function v(){const S=r.newAttributes,L=r.enabledAttributes;for(let U=0,H=L.length;U<H;U++)L[U]!==S[U]&&(i.disableVertexAttribArray(U),L[U]=0)}function M(S,L,U,H,ee,te,W){W===!0?i.vertexAttribIPointer(S,L,U,ee,te):i.vertexAttribPointer(S,L,U,H,ee,te)}function y(S,L,U,H){_();const ee=H.attributes,te=U.getAttributes(),W=L.defaultAttributeValues;for(const j in te){const ne=te[j];if(ne.location>=0){let de=ee[j];if(de===void 0&&(j==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),j==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const fe=de.normalized,Ve=de.itemSize,I=e.get(de);if(I===void 0)continue;const Se=I.buffer,ge=I.type,ye=I.bytesPerElement,$=ge===i.INT||ge===i.UNSIGNED_INT||de.gpuType===Zl;if(de.isInterleavedBufferAttribute){const K=de.data,Me=K.stride,we=de.offset;if(K.isInstancedInterleavedBuffer){for(let Ie=0;Ie<ne.locationSize;Ie++)d(ne.location+Ie,K.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ie=0;Ie<ne.locationSize;Ie++)x(ne.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,Se);for(let Ie=0;Ie<ne.locationSize;Ie++)M(ne.location+Ie,Ve/ne.locationSize,ge,fe,Me*ye,(we+Ve/ne.locationSize*Ie)*ye,$)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)d(ne.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ne.locationSize;K++)x(ne.location+K);i.bindBuffer(i.ARRAY_BUFFER,Se);for(let K=0;K<ne.locationSize;K++)M(ne.location+K,Ve/ne.locationSize,ge,fe,Ve*ye,Ve/ne.locationSize*K*ye,$)}}else if(W!==void 0){const fe=W[j];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(ne.location,fe);break;case 3:i.vertexAttrib3fv(ne.location,fe);break;case 4:i.vertexAttrib4fv(ne.location,fe);break;default:i.vertexAttrib1fv(ne.location,fe)}}}}v()}function E(){C();for(const S in n){const L=n[S];for(const U in L){const H=L[U];for(const ee in H)u(H[ee].object),delete H[ee];delete L[U]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const L=n[S.id];for(const U in L){const H=L[U];for(const ee in H)u(H[ee].object),delete H[ee];delete L[U]}delete n[S.id]}function R(S){for(const L in n){const U=n[L];if(U[S.id]===void 0)continue;const H=U[S.id];for(const ee in H)u(H[ee].object),delete H[ee];delete U[S.id]}}function C(){w(),a=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:x,disableUnusedAttributes:v}}function fx(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),t.update(u,n,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,f);let m=0;for(let g=0;g<f;g++)m+=u[g];t.update(m,n,1)}function l(c,u,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,p,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_]*p[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function px(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==qn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===si&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==ai&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ei&&!C)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(lt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:x,maxAttributes:d,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function mx(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Yi,o=new pt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||n!==0||s;return s=p,n=f.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){t=u(f,p,0)},this.setState=function(f,p,m){const g=f.clippingPlanes,_=f.clipIntersection,x=f.clipShadows,d=i.get(f);if(!s||g===null||g.length===0||r&&!x)r?u(null):c();else{const v=r?0:n,M=v*4;let y=d.clippingState||null;l.value=y,y=u(g,p,M,m);for(let E=0;E!==M;++E)y[E]=t[E];d.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,p,m,g){const _=f!==null?f.length:0;let x=null;if(_!==0){if(x=l.value,g!==!0||x===null){const d=m+_*4,v=p.matrixWorldInverse;o.getNormalMatrix(v),(x===null||x.length<d)&&(x=new Float32Array(d));for(let M=0,y=m;M!==_;++M,y+=4)a.copy(f[M]).applyMatrix4(v,o),a.normal.toArray(x,y),x[y+3]=a.constant}l.value=x,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,x}}function xx(i){let e=new WeakMap;function t(a,o){return o===el?a.mapping=ks:o===tl&&(a.mapping=Vs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===el||o===tl)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Ff(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ii=4,gh=[.125,.215,.35,.446,.526,.582],ji=20,gx=512,hr=new xc,vh=new nt;let Do=null,Io=0,Uo=0,Fo=!1;const vx=new P;class Nl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=vx}=r;Do=this._renderer.getRenderTarget(),Io=this._renderer.getActiveCubeFace(),Uo=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Do,Io,Uo),this._renderer.xr.enabled=Fo,e.scissorTest=!1,Ls(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ks||e.mapping===Vs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Do=this._renderer.getRenderTarget(),Io=this._renderer.getActiveCubeFace(),Uo=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Fn,minFilter:Fn,generateMipmaps:!1,type:si,format:qn,colorSpace:Gs,depthBuffer:!1},s=_h(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_h(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=_x(r)),this._blurMaterial=Sx(r,e,t)}return s}_compileMaterial(e){const t=new V(new Yt,e);this._renderer.compile(t,hr)}_sceneToCubeUV(e,t,n,s,r){const l=new Cn(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,m=f.toneMapping;f.getClearColor(vh),f.toneMapping=Fi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new V(new Ue,new Rt({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,x=_.material;let d=!1;const v=e.background;v?v.isColor&&(x.color.copy(v),e.background=null,d=!0):(x.color.copy(vh),d=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));const E=this._cubeSize;Ls(s,y*E,M>2?E:0,E,E),f.setRenderTarget(s),d&&f.render(_,l),f.render(e,l)}f.toneMapping=m,f.autoClear=p,e.background=v}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ks||e.mapping===Vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ls(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,hr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget;if(this._ggxMaterial===null){const v=3*Math.max(this._cubeSize,16),M=4*this._cubeSize;this._ggxMaterial=Mx(this._lodMax,v,M)}const a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),p=.05+c*.95,m=f*p,{_lodMax:g}=this,_=this._sizeLods[n],x=3*_*(n>g-Ii?n-g+Ii:0),d=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=g-t,Ls(r,x,d,3*_,2*_),s.setRenderTarget(r),s.render(o,hr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Ls(e,x,d,3*_,2*_),s.setRenderTarget(e),s.render(o,hr)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Xt("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[s];f.material=c;const p=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ji-1),_=r/g,x=isFinite(r)?1+Math.floor(u*_):ji;x>ji&&lt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${ji}`);const d=[];let v=0;for(let R=0;R<ji;++R){const C=R/_,w=Math.exp(-C*C/2);d.push(w),R===0?v+=w:R<x&&(v+=2*w)}for(let R=0;R<d.length;R++)d[R]=d[R]/v;p.envMap.value=e.texture,p.samples.value=x,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:M}=this;p.dTheta.value=g,p.mipInt.value=M-n;const y=this._sizeLods[s],E=3*y*(s>M-Ii?s-M+Ii:0),T=4*(this._cubeSize-y);Ls(t,E,T,3*y,2*y),l.setRenderTarget(t),l.render(f,hr)}}function _x(i){const e=[],t=[],n=[];let s=i;const r=i-Ii+1+gh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ii?l=gh[a-i+Ii-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,f=1+c,p=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,g=6,_=3,x=2,d=1,v=new Float32Array(_*g*m),M=new Float32Array(x*g*m),y=new Float32Array(d*g*m);for(let T=0;T<m;T++){const R=T%3*2/3-1,C=T>2?0:-1,w=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];v.set(w,_*g*T),M.set(p,x*g*T);const S=[T,T,T,T,T,T];y.set(S,d*g*T)}const E=new Yt;E.setAttribute("position",new Nn(v,_)),E.setAttribute("uv",new Nn(M,x)),E.setAttribute("faceIndex",new Nn(y,d)),n.push(new V(E,null)),s>Ii&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function _h(i,e,t){const n=new Zn(i,e,t);return n.texture.mapping=Xa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ls(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Mx(i,e,t){return new hn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:gx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Za(),fragmentShader:`

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
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Sx(i,e,t){const n=new Float32Array(ji),s=new P(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:ji,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Za(),fragmentShader:`

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
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Mh(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Za(),fragmentShader:`

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
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Sh(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Za(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Za(){return`

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
	`}function yx(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===el||l===tl,u=l===ks||l===Vs;if(c||u){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new Nl(i)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new Nl(i)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function wx(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Pr("WebGLRenderer: "+n+" extension not supported."),s}}}function bx(i,e,t,n){const s={},r=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function l(f){const p=f.attributes;for(const m in p)e.update(p[m],i.ARRAY_BUFFER)}function c(f){const p=[],m=f.index,g=f.attributes.position;let _=0;if(m!==null){const v=m.array;_=m.version;for(let M=0,y=v.length;M<y;M+=3){const E=v[M+0],T=v[M+1],R=v[M+2];p.push(E,T,T,R,R,E)}}else if(g!==void 0){const v=g.array;_=g.version;for(let M=0,y=v.length/3-1;M<y;M+=3){const E=M+0,T=M+1,R=M+2;p.push(E,T,T,R,R,E)}}else return;const x=new(md(p)?_d:vd)(p,1);x.version=_;const d=r.get(f);d&&e.remove(d),r.set(f,x)}function u(f){const p=r.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function Tx(i,e,t){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,m){i.drawElements(n,m,r,p*a),t.update(m,n,1)}function c(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,p*a,g),t.update(m,n,g))}function u(p,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,g);let x=0;for(let d=0;d<g;d++)x+=m[d];t.update(x,n,1)}function f(p,m,g,_){if(g===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let d=0;d<p.length;d++)c(p[d]/a,m[d],_[d]);else{x.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,_,0,g);let d=0;for(let v=0;v<g;v++)d+=m[v]*_[v];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Ex(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Xt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Ax(i,e,t){const n=new WeakMap,s=new zt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var m=S;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),x===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*T*4*f),C=new xd(R,E,T,f);C.type=ei,C.needsUpdate=!0;const w=y*4;for(let L=0;L<f;L++){const U=d[L],H=v[L],ee=M[L],te=E*T*4*L;for(let W=0;W<U.count;W++){const j=W*w;g===!0&&(s.fromBufferAttribute(U,W),R[te+j+0]=s.x,R[te+j+1]=s.y,R[te+j+2]=s.z,R[te+j+3]=0),_===!0&&(s.fromBufferAttribute(H,W),R[te+j+4]=s.x,R[te+j+5]=s.y,R[te+j+6]=s.z,R[te+j+7]=0),x===!0&&(s.fromBufferAttribute(ee,W),R[te+j+8]=s.x,R[te+j+9]=s.y,R[te+j+10]=s.z,R[te+j+11]=ee.itemSize===4?s.w:1)}}p={count:f,texture:C,size:new Te(E,T)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let x=0;x<c.length;x++)g+=c[x];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Cx(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const kd=new un,yh=new Ad(1,1),Vd=new xd,Gd=new _f,Hd=new yd,wh=[],bh=[],Th=new Float32Array(16),Eh=new Float32Array(9),Ah=new Float32Array(4);function $s(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=wh[s];if(r===void 0&&(r=new Float32Array(s),wh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function tn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function nn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $a(i,e){let t=bh[e];t===void 0&&(t=new Int32Array(e),bh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Rx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Px(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2fv(this.addr,e),nn(t,e)}}function Lx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;i.uniform3fv(this.addr,e),nn(t,e)}}function Dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4fv(this.addr,e),nn(t,e)}}function Ix(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Ah.set(n),i.uniformMatrix2fv(this.addr,!1,Ah),nn(t,n)}}function Ux(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Eh.set(n),i.uniformMatrix3fv(this.addr,!1,Eh),nn(t,n)}}function Fx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Th.set(n),i.uniformMatrix4fv(this.addr,!1,Th),nn(t,n)}}function Nx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function zx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2iv(this.addr,e),nn(t,e)}}function Ox(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3iv(this.addr,e),nn(t,e)}}function Bx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4iv(this.addr,e),nn(t,e)}}function kx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Vx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2uiv(this.addr,e),nn(t,e)}}function Gx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3uiv(this.addr,e),nn(t,e)}}function Hx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4uiv(this.addr,e),nn(t,e)}}function Wx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(yh.compareFunction=pd,r=yh):r=kd,t.setTexture2D(e||r,s)}function Xx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Gd,s)}function qx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Hd,s)}function Yx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Vd,s)}function Zx(i){switch(i){case 5126:return Rx;case 35664:return Px;case 35665:return Lx;case 35666:return Dx;case 35674:return Ix;case 35675:return Ux;case 35676:return Fx;case 5124:case 35670:return Nx;case 35667:case 35671:return zx;case 35668:case 35672:return Ox;case 35669:case 35673:return Bx;case 5125:return kx;case 36294:return Vx;case 36295:return Gx;case 36296:return Hx;case 35678:case 36198:case 36298:case 36306:case 35682:return Wx;case 35679:case 36299:case 36307:return Xx;case 35680:case 36300:case 36308:case 36293:return qx;case 36289:case 36303:case 36311:case 36292:return Yx}}function $x(i,e){i.uniform1fv(this.addr,e)}function Kx(i,e){const t=$s(e,this.size,2);i.uniform2fv(this.addr,t)}function Jx(i,e){const t=$s(e,this.size,3);i.uniform3fv(this.addr,t)}function jx(i,e){const t=$s(e,this.size,4);i.uniform4fv(this.addr,t)}function Qx(i,e){const t=$s(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function eg(i,e){const t=$s(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function tg(i,e){const t=$s(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ng(i,e){i.uniform1iv(this.addr,e)}function ig(i,e){i.uniform2iv(this.addr,e)}function sg(i,e){i.uniform3iv(this.addr,e)}function rg(i,e){i.uniform4iv(this.addr,e)}function ag(i,e){i.uniform1uiv(this.addr,e)}function og(i,e){i.uniform2uiv(this.addr,e)}function lg(i,e){i.uniform3uiv(this.addr,e)}function cg(i,e){i.uniform4uiv(this.addr,e)}function hg(i,e,t){const n=this.cache,s=e.length,r=$a(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||kd,r[a])}function dg(i,e,t){const n=this.cache,s=e.length,r=$a(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Gd,r[a])}function ug(i,e,t){const n=this.cache,s=e.length,r=$a(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Hd,r[a])}function fg(i,e,t){const n=this.cache,s=e.length,r=$a(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Vd,r[a])}function pg(i){switch(i){case 5126:return $x;case 35664:return Kx;case 35665:return Jx;case 35666:return jx;case 35674:return Qx;case 35675:return eg;case 35676:return tg;case 5124:case 35670:return ng;case 35667:case 35671:return ig;case 35668:case 35672:return sg;case 35669:case 35673:return rg;case 5125:return ag;case 36294:return og;case 36295:return lg;case 36296:return cg;case 35678:case 36198:case 36298:case 36306:case 35682:return hg;case 35679:case 36299:case 36307:return dg;case 35680:case 36300:case 36308:case 36293:return ug;case 36289:case 36303:case 36311:case 36292:return fg}}class mg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zx(t.type)}}class xg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pg(t.type)}}class gg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const No=/(\w+)(\])?(\[|\.)?/g;function Ch(i,e){i.seq.push(e),i.map[e.id]=e}function vg(i,e,t){const n=i.name,s=n.length;for(No.lastIndex=0;;){const r=No.exec(n),a=No.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ch(t,c===void 0?new mg(o,i,e):new xg(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new gg(o),Ch(t,f)),t=f}}}class Ra{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);vg(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Rh(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const _g=37297;let Mg=0;function Sg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Ph=new pt;function yg(i){Ct._getMatrix(Ph,Ct.workingColorSpace,i);const e=`mat3( ${Ph.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(i)){case Ia:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return lt("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Lh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Sg(i.getShaderSource(e),o)}else return r}function wg(i,e){const t=yg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function bg(i,e){let t;switch(e){case td:t="Linear";break;case nd:t="Reinhard";break;case id:t="Cineon";break;case Yl:t="ACESFilmic";break;case rd:t="AgX";break;case ad:t="Neutral";break;case sd:t="Custom";break;default:lt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const _a=new P;function Tg(){Ct.getLuminanceCoefficients(_a);const i=_a.x.toFixed(4),e=_a.y.toFixed(4),t=_a.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Eg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fr).join(`
`)}function Ag(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Cg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function fr(i){return i!==""}function Dh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ih(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rg=/^[ \t]*#include +<([\w\d./]+)>/gm;function zl(i){return i.replace(Rg,Lg)}const Pg=new Map;function Lg(i,e){let t=gt[e];if(t===void 0){const n=Pg.get(e);if(n!==void 0)t=gt[n],lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zl(t)}const Dg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uh(i){return i.replace(Dg,Ig)}function Ig(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Fh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ug(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Qh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ed?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function Fg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ks:case Vs:e="ENVMAP_TYPE_CUBE";break;case Xa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ng(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Vs&&(e="ENVMAP_MODE_REFRACTION"),e}function zg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ql:e="ENVMAP_BLENDING_MULTIPLY";break;case Nu:e="ENVMAP_BLENDING_MIX";break;case zu:e="ENVMAP_BLENDING_ADD";break}return e}function Og(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Bg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Ug(t),c=Fg(t),u=Ng(t),f=zg(t),p=Og(t),m=Eg(t),g=Ag(r),_=s.createProgram();let x,d,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fr).join(`
`),x.length>0&&(x+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fr).join(`
`),d.length>0&&(d+=`
`)):(x=[Fh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fr).join(`
`),d=[Fh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fi?"#define TONE_MAPPING":"",t.toneMapping!==Fi?gt.tonemapping_pars_fragment:"",t.toneMapping!==Fi?bg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",gt.colorspace_pars_fragment,wg("linearToOutputTexel",t.outputColorSpace),Tg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fr).join(`
`)),a=zl(a),a=Dh(a,t),a=Ih(a,t),o=zl(o),o=Dh(o,t),o=Ih(o,t),a=Uh(a),o=Uh(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,d=["#define varying in",t.glslVersion===Lc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const M=v+x+a,y=v+d+o,E=Rh(s,s.VERTEX_SHADER,M),T=Rh(s,s.FRAGMENT_SHADER,y);s.attachShader(_,E),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(L){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(_)||"",H=s.getShaderInfoLog(E)||"",ee=s.getShaderInfoLog(T)||"",te=U.trim(),W=H.trim(),j=ee.trim();let ne=!0,de=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,E,T);else{const fe=Lh(s,E,"vertex"),Ve=Lh(s,T,"fragment");Xt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+fe+`
`+Ve)}else te!==""?lt("WebGLProgram: Program Info Log:",te):(W===""||j==="")&&(de=!1);de&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:W,prefix:x},fragmentShader:{log:j,prefix:d}})}s.deleteShader(E),s.deleteShader(T),C=new Ra(s,_),w=Cg(s,_)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,_g)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Mg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let kg=0;class Vg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Gg(e),t.set(e,n)),n}}class Gg{constructor(e){this.id=kg++,this.code=e,this.usedTimes=0}}function Hg(i,e,t,n,s,r,a){const o=new ac,l=new Vg,c=new Set,u=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function x(w,S,L,U,H){const ee=U.fog,te=H.geometry,W=w.isMeshStandardMaterial?U.environment:null,j=(w.isMeshStandardMaterial?t:e).get(w.envMap||W),ne=j&&j.mapping===Xa?j.image.height:null,de=g[w.type];w.precision!==null&&(m=s.getMaxPrecision(w.precision),m!==w.precision&&lt("WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const fe=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ve=fe!==void 0?fe.length:0;let I=0;te.morphAttributes.position!==void 0&&(I=1),te.morphAttributes.normal!==void 0&&(I=2),te.morphAttributes.color!==void 0&&(I=3);let Se,ge,ye,$;if(de){const At=jn[de];Se=At.vertexShader,ge=At.fragmentShader}else Se=w.vertexShader,ge=w.fragmentShader,l.update(w),ye=l.getVertexShaderID(w),$=l.getFragmentShaderID(w);const K=i.getRenderTarget(),Me=i.state.buffers.depth.getReversed(),we=H.isInstancedMesh===!0,Ie=H.isBatchedMesh===!0,Ye=!!w.map,Dt=!!w.matcap,$e=!!j,Pt=!!w.aoMap,B=!!w.lightMap,ft=!!w.bumpMap,ht=!!w.normalMap,Lt=!!w.displacementMap,Xe=!!w.emissiveMap,It=!!w.metalnessMap,Ke=!!w.roughnessMap,ot=w.anisotropy>0,D=w.clearcoat>0,A=w.dispersion>0,J=w.iridescence>0,ce=w.sheen>0,ue=w.transmission>0,se=ot&&!!w.anisotropyMap,He=D&&!!w.clearcoatMap,Re=D&&!!w.clearcoatNormalMap,je=D&&!!w.clearcoatRoughnessMap,qe=J&&!!w.iridescenceMap,pe=J&&!!w.iridescenceThicknessMap,be=ce&&!!w.sheenColorMap,it=ce&&!!w.sheenRoughnessMap,Qe=!!w.specularMap,Be=!!w.specularColorMap,rt=!!w.specularIntensityMap,k=ue&&!!w.transmissionMap,Pe=ue&&!!w.thicknessMap,Ee=!!w.gradientMap,Ae=!!w.alphaMap,_e=w.alphaTest>0,he=!!w.alphaHash,ke=!!w.extensions;let st=Fi;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(st=i.toneMapping);const Ut={shaderID:de,shaderType:w.type,shaderName:w.name,vertexShader:Se,fragmentShader:ge,defines:w.defines,customVertexShaderID:ye,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:Ie,batchingColor:Ie&&H._colorsTexture!==null,instancing:we,instancingColor:we&&H.instanceColor!==null,instancingMorph:we&&H.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Gs,alphaToCoverage:!!w.alphaToCoverage,map:Ye,matcap:Dt,envMap:$e,envMapMode:$e&&j.mapping,envMapCubeUVHeight:ne,aoMap:Pt,lightMap:B,bumpMap:ft,normalMap:ht,displacementMap:p&&Lt,emissiveMap:Xe,normalMapObjectSpace:ht&&w.normalMapType===Vu,normalMapTangentSpace:ht&&w.normalMapType===nc,metalnessMap:It,roughnessMap:Ke,anisotropy:ot,anisotropyMap:se,clearcoat:D,clearcoatMap:He,clearcoatNormalMap:Re,clearcoatRoughnessMap:je,dispersion:A,iridescence:J,iridescenceMap:qe,iridescenceThicknessMap:pe,sheen:ce,sheenColorMap:be,sheenRoughnessMap:it,specularMap:Qe,specularColorMap:Be,specularIntensityMap:rt,transmission:ue,transmissionMap:k,thicknessMap:Pe,gradientMap:Ee,opaque:w.transparent===!1&&w.blending===Us&&w.alphaToCoverage===!1,alphaMap:Ae,alphaTest:_e,alphaHash:he,combine:w.combine,mapUv:Ye&&_(w.map.channel),aoMapUv:Pt&&_(w.aoMap.channel),lightMapUv:B&&_(w.lightMap.channel),bumpMapUv:ft&&_(w.bumpMap.channel),normalMapUv:ht&&_(w.normalMap.channel),displacementMapUv:Lt&&_(w.displacementMap.channel),emissiveMapUv:Xe&&_(w.emissiveMap.channel),metalnessMapUv:It&&_(w.metalnessMap.channel),roughnessMapUv:Ke&&_(w.roughnessMap.channel),anisotropyMapUv:se&&_(w.anisotropyMap.channel),clearcoatMapUv:He&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Re&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:je&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:qe&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:be&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:it&&_(w.sheenRoughnessMap.channel),specularMapUv:Qe&&_(w.specularMap.channel),specularColorMapUv:Be&&_(w.specularColorMap.channel),specularIntensityMapUv:rt&&_(w.specularIntensityMap.channel),transmissionMapUv:k&&_(w.transmissionMap.channel),thicknessMapUv:Pe&&_(w.thicknessMap.channel),alphaMapUv:Ae&&_(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(ht||ot),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!te.attributes.uv&&(Ye||Ae),fog:!!ee,useFog:w.fog===!0,fogExp2:!!ee&&ee.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Me,skinning:H.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,decodeVideoTexture:Ye&&w.map.isVideoTexture===!0&&Ct.getTransfer(w.map.colorSpace)===Ft,decodeVideoTextureEmissive:Xe&&w.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(w.emissiveMap.colorSpace)===Ft,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===mt,flipSided:w.side===dn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:ke&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&w.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ut.vertexUv1s=c.has(1),Ut.vertexUv2s=c.has(2),Ut.vertexUv3s=c.has(3),c.clear(),Ut}function d(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const L in w.defines)S.push(L),S.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(v(S,w),M(S,w),S.push(i.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function v(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function M(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),w.push(o.mask)}function y(w){const S=g[w.type];let L;if(S){const U=jn[S];L=Dr.clone(U.uniforms)}else L=w.uniforms;return L}function E(w,S){let L;for(let U=0,H=u.length;U<H;U++){const ee=u[U];if(ee.cacheKey===S){L=ee,++L.usedTimes;break}}return L===void 0&&(L=new Bg(i,S,w,r),u.push(L)),L}function T(w){if(--w.usedTimes===0){const S=u.indexOf(w);u[S]=u[u.length-1],u.pop(),w.destroy()}}function R(w){l.remove(w)}function C(){l.dispose()}return{getParameters:x,getProgramCacheKey:d,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:R,programs:u,dispose:C}}function Wg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Xg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Nh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function zh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f,p,m,g,_,x){let d=i[e];return d===void 0?(d={id:f.id,object:f,geometry:p,material:m,groupOrder:g,renderOrder:f.renderOrder,z:_,group:x},i[e]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=m,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=_,d.group=x),e++,d}function o(f,p,m,g,_,x){const d=a(f,p,m,g,_,x);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(f,p,m,g,_,x){const d=a(f,p,m,g,_,x);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(f,p){t.length>1&&t.sort(f||Xg),n.length>1&&n.sort(p||Nh),s.length>1&&s.sort(p||Nh)}function u(){for(let f=e,p=i.length;f<p;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function qg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new zh,i.set(n,[a])):s>=r.length?(a=new zh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Yg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new nt};break;case"SpotLight":t={position:new P,direction:new P,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":t={color:new nt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Zg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let $g=0;function Kg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Jg(i){const e=new Yg,t=Zg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new Tt,a=new Tt;function o(c){let u=0,f=0,p=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let m=0,g=0,_=0,x=0,d=0,v=0,M=0,y=0,E=0,T=0,R=0;c.sort(Kg);for(let w=0,S=c.length;w<S;w++){const L=c[w],U=L.color,H=L.intensity,ee=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=U.r*H,f+=U.g*H,p+=U.b*H;else if(L.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(L.sh.coefficients[W],H);R++}else if(L.isDirectionalLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const j=L.shadow,ne=t.get(L);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.directionalShadow[m]=ne,n.directionalShadowMap[m]=te,n.directionalShadowMatrix[m]=L.shadow.matrix,v++}n.directional[m]=W,m++}else if(L.isSpotLight){const W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(U).multiplyScalar(H),W.distance=ee,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,n.spot[_]=W;const j=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,j.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[_]=j.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.spotShadow[_]=ne,n.spotShadowMap[_]=te,y++}_++}else if(L.isRectAreaLight){const W=e.get(L);W.color.copy(U).multiplyScalar(H),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),n.rectArea[x]=W,x++}else if(L.isPointLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){const j=L.shadow,ne=t.get(L);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,ne.shadowCameraNear=j.camera.near,ne.shadowCameraFar=j.camera.far,n.pointShadow[g]=ne,n.pointShadowMap[g]=te,n.pointShadowMatrix[g]=L.shadow.matrix,M++}n.point[g]=W,g++}else if(L.isHemisphereLight){const W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(H),W.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[d]=W,d++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ze.LTC_FLOAT_1,n.rectAreaLTC2=ze.LTC_FLOAT_2):(n.rectAreaLTC1=ze.LTC_HALF_1,n.rectAreaLTC2=ze.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=p;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==x||C.hemiLength!==d||C.numDirectionalShadows!==v||C.numPointShadows!==M||C.numSpotShadows!==y||C.numSpotMaps!==E||C.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=x,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,C.directionalLength=m,C.pointLength=g,C.spotLength=_,C.rectAreaLength=x,C.hemiLength=d,C.numDirectionalShadows=v,C.numPointShadows=M,C.numSpotShadows=y,C.numSpotMaps=E,C.numLightProbes=R,n.version=$g++)}function l(c,u){let f=0,p=0,m=0,g=0,_=0;const x=u.matrixWorldInverse;for(let d=0,v=c.length;d<v;d++){const M=c[d];if(M.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),f++}else if(M.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(x),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),m++}else if(M.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(x),a.identity(),r.copy(M.matrixWorld),r.premultiply(x),a.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const y=n.point[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(x),p++}else if(M.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(x),_++}}}return{setup:o,setupView:l,state:n}}function Oh(i){const e=new Jg(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function jg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Oh(i),e.set(s,[o])):r>=a.length?(o=new Oh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Qg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,e1=`uniform sampler2D shadow_pass;
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
}`;function t1(i,e,t){let n=new lc;const s=new Te,r=new Te,a=new zt,o=new y0({depthPacking:ku}),l=new w0,c={},u=t.maxTextureSize,f={[Ni]:dn,[dn]:Ni,[mt]:mt},p=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Qg,fragmentShader:e1}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new Yt;g.setAttribute("position",new Nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new V(g,p),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qh;let d=this.type;this.render=function(T,R,C){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||T.length===0)return;const w=i.getRenderTarget(),S=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),U=i.state;U.setBlending(ii),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const H=d!==mi&&this.type===mi,ee=d===mi&&this.type!==mi;for(let te=0,W=T.length;te<W;te++){const j=T[te],ne=j.shadow;if(ne===void 0){lt("WebGLShadowMap:",j,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const de=ne.getFrameExtents();if(s.multiply(de),r.copy(ne.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/de.x),s.x=r.x*de.x,ne.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/de.y),s.y=r.y*de.y,ne.mapSize.y=r.y)),ne.map===null||H===!0||ee===!0){const Ve=this.type!==mi?{minFilter:Rn,magFilter:Rn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new Zn(s.x,s.y,Ve),ne.map.texture.name=j.name+".shadowMap",ne.camera.updateProjectionMatrix()}i.setRenderTarget(ne.map),i.clear();const fe=ne.getViewportCount();for(let Ve=0;Ve<fe;Ve++){const I=ne.getViewport(Ve);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),U.viewport(a),ne.updateMatrices(j,Ve),n=ne.getFrustum(),y(R,C,ne.camera,j,this.type)}ne.isPointLightShadow!==!0&&this.type===mi&&v(ne,C),ne.needsUpdate=!1}d=this.type,x.needsUpdate=!1,i.setRenderTarget(w,S,L)};function v(T,R){const C=e.update(_);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Zn(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,C,p,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,C,m,_,null)}function M(T,R,C,w){let S=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=C.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=S.uuid,H=R.uuid;let ee=c[U];ee===void 0&&(ee={},c[U]=ee);let te=ee[H];te===void 0&&(te=S.clone(),ee[H]=te,R.addEventListener("dispose",E)),S=te}if(S.visible=R.visible,S.wireframe=R.wireframe,w===mi?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:f[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const U=i.properties.get(S);U.light=C}return S}function y(T,R,C,w,S){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===mi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const H=e.update(T),ee=T.material;if(Array.isArray(ee)){const te=H.groups;for(let W=0,j=te.length;W<j;W++){const ne=te[W],de=ee[ne.materialIndex];if(de&&de.visible){const fe=M(T,de,w,S);T.onBeforeShadow(i,T,R,C,H,fe,ne),i.renderBufferDirect(C,null,H,fe,T,ne),T.onAfterShadow(i,T,R,C,H,fe,ne)}}}else if(ee.visible){const te=M(T,ee,w,S);T.onBeforeShadow(i,T,R,C,H,te,null),i.renderBufferDirect(C,null,H,te,T,null),T.onAfterShadow(i,T,R,C,H,te,null)}}const U=T.children;for(let H=0,ee=U.length;H<ee;H++)y(U[H],R,C,w,S)}function E(T){T.target.removeEventListener("dispose",E);for(const C in c){const w=c[C],S=T.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const n1={[Yo]:Zo,[$o]:jo,[Ko]:Qo,[Bs]:Jo,[Zo]:Yo,[jo]:$o,[Qo]:Ko,[Jo]:Bs};function i1(i,e){function t(){let k=!1;const Pe=new zt;let Ee=null;const Ae=new zt(0,0,0,0);return{setMask:function(_e){Ee!==_e&&!k&&(i.colorMask(_e,_e,_e,_e),Ee=_e)},setLocked:function(_e){k=_e},setClear:function(_e,he,ke,st,Ut){Ut===!0&&(_e*=st,he*=st,ke*=st),Pe.set(_e,he,ke,st),Ae.equals(Pe)===!1&&(i.clearColor(_e,he,ke,st),Ae.copy(Pe))},reset:function(){k=!1,Ee=null,Ae.set(-1,0,0,0)}}}function n(){let k=!1,Pe=!1,Ee=null,Ae=null,_e=null;return{setReversed:function(he){if(Pe!==he){const ke=e.get("EXT_clip_control");he?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),Pe=he;const st=_e;_e=null,this.setClear(st)}},getReversed:function(){return Pe},setTest:function(he){he?K(i.DEPTH_TEST):Me(i.DEPTH_TEST)},setMask:function(he){Ee!==he&&!k&&(i.depthMask(he),Ee=he)},setFunc:function(he){if(Pe&&(he=n1[he]),Ae!==he){switch(he){case Yo:i.depthFunc(i.NEVER);break;case Zo:i.depthFunc(i.ALWAYS);break;case $o:i.depthFunc(i.LESS);break;case Bs:i.depthFunc(i.LEQUAL);break;case Ko:i.depthFunc(i.EQUAL);break;case Jo:i.depthFunc(i.GEQUAL);break;case jo:i.depthFunc(i.GREATER);break;case Qo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ae=he}},setLocked:function(he){k=he},setClear:function(he){_e!==he&&(Pe&&(he=1-he),i.clearDepth(he),_e=he)},reset:function(){k=!1,Ee=null,Ae=null,_e=null,Pe=!1}}}function s(){let k=!1,Pe=null,Ee=null,Ae=null,_e=null,he=null,ke=null,st=null,Ut=null;return{setTest:function(At){k||(At?K(i.STENCIL_TEST):Me(i.STENCIL_TEST))},setMask:function(At){Pe!==At&&!k&&(i.stencilMask(At),Pe=At)},setFunc:function(At,$t,bn){(Ee!==At||Ae!==$t||_e!==bn)&&(i.stencilFunc(At,$t,bn),Ee=At,Ae=$t,_e=bn)},setOp:function(At,$t,bn){(he!==At||ke!==$t||st!==bn)&&(i.stencilOp(At,$t,bn),he=At,ke=$t,st=bn)},setLocked:function(At){k=At},setClear:function(At){Ut!==At&&(i.clearStencil(At),Ut=At)},reset:function(){k=!1,Pe=null,Ee=null,Ae=null,_e=null,he=null,ke=null,st=null,Ut=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},f={},p=new WeakMap,m=[],g=null,_=!1,x=null,d=null,v=null,M=null,y=null,E=null,T=null,R=new nt(0,0,0),C=0,w=!1,S=null,L=null,U=null,H=null,ee=null;const te=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,j=0;const ne=i.getParameter(i.VERSION);ne.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(ne)[1]),W=j>=1):ne.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),W=j>=2);let de=null,fe={};const Ve=i.getParameter(i.SCISSOR_BOX),I=i.getParameter(i.VIEWPORT),Se=new zt().fromArray(Ve),ge=new zt().fromArray(I);function ye(k,Pe,Ee,Ae){const _e=new Uint8Array(4),he=i.createTexture();i.bindTexture(k,he),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ke=0;ke<Ee;ke++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(Pe,0,i.RGBA,1,1,Ae,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(Pe+ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return he}const $={};$[i.TEXTURE_2D]=ye(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(i.DEPTH_TEST),a.setFunc(Bs),ft(!1),ht(Ac),K(i.CULL_FACE),Pt(ii);function K(k){u[k]!==!0&&(i.enable(k),u[k]=!0)}function Me(k){u[k]!==!1&&(i.disable(k),u[k]=!1)}function we(k,Pe){return f[k]!==Pe?(i.bindFramebuffer(k,Pe),f[k]=Pe,k===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=Pe),k===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=Pe),!0):!1}function Ie(k,Pe){let Ee=m,Ae=!1;if(k){Ee=p.get(Pe),Ee===void 0&&(Ee=[],p.set(Pe,Ee));const _e=k.textures;if(Ee.length!==_e.length||Ee[0]!==i.COLOR_ATTACHMENT0){for(let he=0,ke=_e.length;he<ke;he++)Ee[he]=i.COLOR_ATTACHMENT0+he;Ee.length=_e.length,Ae=!0}}else Ee[0]!==i.BACK&&(Ee[0]=i.BACK,Ae=!0);Ae&&i.drawBuffers(Ee)}function Ye(k){return g!==k?(i.useProgram(k),g=k,!0):!1}const Dt={[Ji]:i.FUNC_ADD,[_u]:i.FUNC_SUBTRACT,[Mu]:i.FUNC_REVERSE_SUBTRACT};Dt[Su]=i.MIN,Dt[yu]=i.MAX;const $e={[wu]:i.ZERO,[bu]:i.ONE,[Tu]:i.SRC_COLOR,[Xo]:i.SRC_ALPHA,[Lu]:i.SRC_ALPHA_SATURATE,[Ru]:i.DST_COLOR,[Au]:i.DST_ALPHA,[Eu]:i.ONE_MINUS_SRC_COLOR,[qo]:i.ONE_MINUS_SRC_ALPHA,[Pu]:i.ONE_MINUS_DST_COLOR,[Cu]:i.ONE_MINUS_DST_ALPHA,[Du]:i.CONSTANT_COLOR,[Iu]:i.ONE_MINUS_CONSTANT_COLOR,[Uu]:i.CONSTANT_ALPHA,[Fu]:i.ONE_MINUS_CONSTANT_ALPHA};function Pt(k,Pe,Ee,Ae,_e,he,ke,st,Ut,At){if(k===ii){_===!0&&(Me(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),k!==vu){if(k!==x||At!==w){if((d!==Ji||y!==Ji)&&(i.blendEquation(i.FUNC_ADD),d=Ji,y=Ji),At)switch(k){case Us:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xn:i.blendFunc(i.ONE,i.ONE);break;case Cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Rc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Xt("WebGLState: Invalid blending: ",k);break}else switch(k){case Us:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Cc:Xt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rc:Xt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xt("WebGLState: Invalid blending: ",k);break}v=null,M=null,E=null,T=null,R.set(0,0,0),C=0,x=k,w=At}return}_e=_e||Pe,he=he||Ee,ke=ke||Ae,(Pe!==d||_e!==y)&&(i.blendEquationSeparate(Dt[Pe],Dt[_e]),d=Pe,y=_e),(Ee!==v||Ae!==M||he!==E||ke!==T)&&(i.blendFuncSeparate($e[Ee],$e[Ae],$e[he],$e[ke]),v=Ee,M=Ae,E=he,T=ke),(st.equals(R)===!1||Ut!==C)&&(i.blendColor(st.r,st.g,st.b,Ut),R.copy(st),C=Ut),x=k,w=!1}function B(k,Pe){k.side===mt?Me(i.CULL_FACE):K(i.CULL_FACE);let Ee=k.side===dn;Pe&&(Ee=!Ee),ft(Ee),k.blending===Us&&k.transparent===!1?Pt(ii):Pt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Ae=k.stencilWrite;o.setTest(Ae),Ae&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Xe(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):Me(i.SAMPLE_ALPHA_TO_COVERAGE)}function ft(k){S!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),S=k)}function ht(k){k!==xu?(K(i.CULL_FACE),k!==L&&(k===Ac?i.cullFace(i.BACK):k===gu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Me(i.CULL_FACE),L=k}function Lt(k){k!==U&&(W&&i.lineWidth(k),U=k)}function Xe(k,Pe,Ee){k?(K(i.POLYGON_OFFSET_FILL),(H!==Pe||ee!==Ee)&&(i.polygonOffset(Pe,Ee),H=Pe,ee=Ee)):Me(i.POLYGON_OFFSET_FILL)}function It(k){k?K(i.SCISSOR_TEST):Me(i.SCISSOR_TEST)}function Ke(k){k===void 0&&(k=i.TEXTURE0+te-1),de!==k&&(i.activeTexture(k),de=k)}function ot(k,Pe,Ee){Ee===void 0&&(de===null?Ee=i.TEXTURE0+te-1:Ee=de);let Ae=fe[Ee];Ae===void 0&&(Ae={type:void 0,texture:void 0},fe[Ee]=Ae),(Ae.type!==k||Ae.texture!==Pe)&&(de!==Ee&&(i.activeTexture(Ee),de=Ee),i.bindTexture(k,Pe||$[k]),Ae.type=k,Ae.texture=Pe)}function D(){const k=fe[de];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function J(){try{i.compressedTexImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function ce(){try{i.texSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function ue(){try{i.texSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function se(){try{i.compressedTexSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function He(){try{i.compressedTexSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function Re(){try{i.texStorage2D(...arguments)}catch(k){k("WebGLState:",k)}}function je(){try{i.texStorage3D(...arguments)}catch(k){k("WebGLState:",k)}}function qe(){try{i.texImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function pe(){try{i.texImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function be(k){Se.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),Se.copy(k))}function it(k){ge.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),ge.copy(k))}function Qe(k,Pe){let Ee=c.get(Pe);Ee===void 0&&(Ee=new WeakMap,c.set(Pe,Ee));let Ae=Ee.get(k);Ae===void 0&&(Ae=i.getUniformBlockIndex(Pe,k.name),Ee.set(k,Ae))}function Be(k,Pe){const Ae=c.get(Pe).get(k);l.get(Pe)!==Ae&&(i.uniformBlockBinding(Pe,Ae,k.__bindingPointIndex),l.set(Pe,Ae))}function rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},de=null,fe={},f={},p=new WeakMap,m=[],g=null,_=!1,x=null,d=null,v=null,M=null,y=null,E=null,T=null,R=new nt(0,0,0),C=0,w=!1,S=null,L=null,U=null,H=null,ee=null,Se.set(0,0,i.canvas.width,i.canvas.height),ge.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:Me,bindFramebuffer:we,drawBuffers:Ie,useProgram:Ye,setBlending:Pt,setMaterial:B,setFlipSided:ft,setCullFace:ht,setLineWidth:Lt,setPolygonOffset:Xe,setScissorTest:It,activeTexture:Ke,bindTexture:ot,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:qe,texImage3D:pe,updateUBOMapping:Qe,uniformBlockBinding:Be,texStorage2D:Re,texStorage3D:je,texSubImage2D:ce,texSubImage3D:ue,compressedTexSubImage2D:se,compressedTexSubImage3D:He,scissor:be,viewport:it,reset:rt}}function s1(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Te,u=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,A){return m?new OffscreenCanvas(D,A):Fa("canvas")}function _(D,A,J){let ce=1;const ue=ot(D);if((ue.width>J||ue.height>J)&&(ce=J/Math.max(ue.width,ue.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const se=Math.floor(ce*ue.width),He=Math.floor(ce*ue.height);f===void 0&&(f=g(se,He));const Re=A?g(se,He):f;return Re.width=se,Re.height=He,Re.getContext("2d").drawImage(D,0,0,se,He),lt("WebGLRenderer: Texture has been resized from ("+ue.width+"x"+ue.height+") to ("+se+"x"+He+")."),Re}else return"data"in D&&lt("WebGLRenderer: Image in DataTexture is too big ("+ue.width+"x"+ue.height+")."),D;return D}function x(D){return D.generateMipmaps}function d(D){i.generateMipmap(D)}function v(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(D,A,J,ce,ue=!1){if(D!==null){if(i[D]!==void 0)return i[D];lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let se=A;if(A===i.RED&&(J===i.FLOAT&&(se=i.R32F),J===i.HALF_FLOAT&&(se=i.R16F),J===i.UNSIGNED_BYTE&&(se=i.R8)),A===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(se=i.R8UI),J===i.UNSIGNED_SHORT&&(se=i.R16UI),J===i.UNSIGNED_INT&&(se=i.R32UI),J===i.BYTE&&(se=i.R8I),J===i.SHORT&&(se=i.R16I),J===i.INT&&(se=i.R32I)),A===i.RG&&(J===i.FLOAT&&(se=i.RG32F),J===i.HALF_FLOAT&&(se=i.RG16F),J===i.UNSIGNED_BYTE&&(se=i.RG8)),A===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(se=i.RG8UI),J===i.UNSIGNED_SHORT&&(se=i.RG16UI),J===i.UNSIGNED_INT&&(se=i.RG32UI),J===i.BYTE&&(se=i.RG8I),J===i.SHORT&&(se=i.RG16I),J===i.INT&&(se=i.RG32I)),A===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(se=i.RGB8UI),J===i.UNSIGNED_SHORT&&(se=i.RGB16UI),J===i.UNSIGNED_INT&&(se=i.RGB32UI),J===i.BYTE&&(se=i.RGB8I),J===i.SHORT&&(se=i.RGB16I),J===i.INT&&(se=i.RGB32I)),A===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(se=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(se=i.RGBA16UI),J===i.UNSIGNED_INT&&(se=i.RGBA32UI),J===i.BYTE&&(se=i.RGBA8I),J===i.SHORT&&(se=i.RGBA16I),J===i.INT&&(se=i.RGBA32I)),A===i.RGB&&(J===i.UNSIGNED_INT_5_9_9_9_REV&&(se=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(se=i.R11F_G11F_B10F)),A===i.RGBA){const He=ue?Ia:Ct.getTransfer(ce);J===i.FLOAT&&(se=i.RGBA32F),J===i.HALF_FLOAT&&(se=i.RGBA16F),J===i.UNSIGNED_BYTE&&(se=He===Ft?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT_4_4_4_4&&(se=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(se=i.RGB5_A1)}return(se===i.R16F||se===i.R32F||se===i.RG16F||se===i.RG32F||se===i.RGBA16F||se===i.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function y(D,A){let J;return D?A===null||A===os||A===Ar?J=i.DEPTH24_STENCIL8:A===ei?J=i.DEPTH32F_STENCIL8:A===Er&&(J=i.DEPTH24_STENCIL8,lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===os||A===Ar?J=i.DEPTH_COMPONENT24:A===ei?J=i.DEPTH_COMPONENT32F:A===Er&&(J=i.DEPTH_COMPONENT16),J}function E(D,A){return x(D)===!0||D.isFramebufferTexture&&D.minFilter!==Rn&&D.minFilter!==Fn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),C(A),A.isVideoTexture&&u.delete(A)}function R(D){const A=D.target;A.removeEventListener("dispose",R),S(A)}function C(D){const A=n.get(D);if(A.__webglInit===void 0)return;const J=D.source,ce=p.get(J);if(ce){const ue=ce[A.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&w(D),Object.keys(ce).length===0&&p.delete(J)}n.remove(D)}function w(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const J=D.source,ce=p.get(J);delete ce[A.__cacheKey],a.memory.textures--}function S(D){const A=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(A.__webglFramebuffer[ce]))for(let ue=0;ue<A.__webglFramebuffer[ce].length;ue++)i.deleteFramebuffer(A.__webglFramebuffer[ce][ue]);else i.deleteFramebuffer(A.__webglFramebuffer[ce]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ce])}else{if(Array.isArray(A.__webglFramebuffer))for(let ce=0;ce<A.__webglFramebuffer.length;ce++)i.deleteFramebuffer(A.__webglFramebuffer[ce]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ce=0;ce<A.__webglColorRenderbuffer.length;ce++)A.__webglColorRenderbuffer[ce]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ce]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,ue=J.length;ce<ue;ce++){const se=n.get(J[ce]);se.__webglTexture&&(i.deleteTexture(se.__webglTexture),a.memory.textures--),n.remove(J[ce])}n.remove(D)}let L=0;function U(){L=0}function H(){const D=L;return D>=s.maxTextures&&lt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function ee(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function te(D,A){const J=n.get(D);if(D.isVideoTexture&&It(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)lt("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)lt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+A)}function W(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+A)}function j(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}t.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+A)}function ne(D,A){const J=n.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+A)}const de={[fn]:i.REPEAT,[vi]:i.CLAMP_TO_EDGE,[nl]:i.MIRRORED_REPEAT},fe={[Rn]:i.NEAREST,[Ou]:i.NEAREST_MIPMAP_NEAREST,[Xr]:i.NEAREST_MIPMAP_LINEAR,[Fn]:i.LINEAR,[eo]:i.LINEAR_MIPMAP_NEAREST,[Qi]:i.LINEAR_MIPMAP_LINEAR},Ve={[Gu]:i.NEVER,[Zu]:i.ALWAYS,[Hu]:i.LESS,[pd]:i.LEQUAL,[Wu]:i.EQUAL,[Yu]:i.GEQUAL,[Xu]:i.GREATER,[qu]:i.NOTEQUAL};function I(D,A){if(A.type===ei&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Fn||A.magFilter===eo||A.magFilter===Xr||A.magFilter===Qi||A.minFilter===Fn||A.minFilter===eo||A.minFilter===Xr||A.minFilter===Qi)&&lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,de[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,de[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,de[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,fe[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,fe[A.minFilter]),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ve[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Rn||A.minFilter!==Xr&&A.minFilter!==Qi||A.type===ei&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function Se(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const ce=A.source;let ue=p.get(ce);ue===void 0&&(ue={},p.set(ce,ue));const se=ee(A);if(se!==D.__cacheKey){ue[se]===void 0&&(ue[se]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,J=!0),ue[se].usedTimes++;const He=ue[D.__cacheKey];He!==void 0&&(ue[D.__cacheKey].usedTimes--,He.usedTimes===0&&w(A)),D.__cacheKey=se,D.__webglTexture=ue[se].texture}return J}function ge(D,A,J){return Math.floor(Math.floor(D/J)/A)}function ye(D,A,J,ce){const se=D.updateRanges;if(se.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,J,ce,A.data);else{se.sort((pe,be)=>pe.start-be.start);let He=0;for(let pe=1;pe<se.length;pe++){const be=se[He],it=se[pe],Qe=be.start+be.count,Be=ge(it.start,A.width,4),rt=ge(be.start,A.width,4);it.start<=Qe+1&&Be===rt&&ge(it.start+it.count-1,A.width,4)===Be?be.count=Math.max(be.count,it.start+it.count-be.start):(++He,se[He]=it)}se.length=He+1;const Re=i.getParameter(i.UNPACK_ROW_LENGTH),je=i.getParameter(i.UNPACK_SKIP_PIXELS),qe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let pe=0,be=se.length;pe<be;pe++){const it=se[pe],Qe=Math.floor(it.start/4),Be=Math.ceil(it.count/4),rt=Qe%A.width,k=Math.floor(Qe/A.width),Pe=Be,Ee=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,rt),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),t.texSubImage2D(i.TEXTURE_2D,0,rt,k,Pe,Ee,J,ce,A.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Re),i.pixelStorei(i.UNPACK_SKIP_PIXELS,je),i.pixelStorei(i.UNPACK_SKIP_ROWS,qe)}}function $(D,A,J){let ce=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ce=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ce=i.TEXTURE_3D);const ue=Se(D,A),se=A.source;t.bindTexture(ce,D.__webglTexture,i.TEXTURE0+J);const He=n.get(se);if(se.version!==He.__version||ue===!0){t.activeTexture(i.TEXTURE0+J);const Re=Ct.getPrimaries(Ct.workingColorSpace),je=A.colorSpace===Di?null:Ct.getPrimaries(A.colorSpace),qe=A.colorSpace===Di||Re===je?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let pe=_(A.image,!1,s.maxTextureSize);pe=Ke(A,pe);const be=r.convert(A.format,A.colorSpace),it=r.convert(A.type);let Qe=M(A.internalFormat,be,it,A.colorSpace,A.isVideoTexture);I(ce,A);let Be;const rt=A.mipmaps,k=A.isVideoTexture!==!0,Pe=He.__version===void 0||ue===!0,Ee=se.dataReady,Ae=E(A,pe);if(A.isDepthTexture)Qe=y(A.format===Rr,A.type),Pe&&(k?t.texStorage2D(i.TEXTURE_2D,1,Qe,pe.width,pe.height):t.texImage2D(i.TEXTURE_2D,0,Qe,pe.width,pe.height,0,be,it,null));else if(A.isDataTexture)if(rt.length>0){k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ae,Qe,rt[0].width,rt[0].height);for(let _e=0,he=rt.length;_e<he;_e++)Be=rt[_e],k?Ee&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Be.width,Be.height,be,it,Be.data):t.texImage2D(i.TEXTURE_2D,_e,Qe,Be.width,Be.height,0,be,it,Be.data);A.generateMipmaps=!1}else k?(Pe&&t.texStorage2D(i.TEXTURE_2D,Ae,Qe,pe.width,pe.height),Ee&&ye(A,pe,be,it)):t.texImage2D(i.TEXTURE_2D,0,Qe,pe.width,pe.height,0,be,it,pe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){k&&Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Qe,rt[0].width,rt[0].height,pe.depth);for(let _e=0,he=rt.length;_e<he;_e++)if(Be=rt[_e],A.format!==qn)if(be!==null)if(k){if(Ee)if(A.layerUpdates.size>0){const ke=xh(Be.width,Be.height,A.format,A.type);for(const st of A.layerUpdates){const Ut=Be.data.subarray(st*ke/Be.data.BYTES_PER_ELEMENT,(st+1)*ke/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,st,Be.width,Be.height,1,be,Ut)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Be.width,Be.height,pe.depth,be,Be.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,_e,Qe,Be.width,Be.height,pe.depth,0,Be.data,0,0);else lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Ee&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Be.width,Be.height,pe.depth,be,it,Be.data):t.texImage3D(i.TEXTURE_2D_ARRAY,_e,Qe,Be.width,Be.height,pe.depth,0,be,it,Be.data)}else{k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ae,Qe,rt[0].width,rt[0].height);for(let _e=0,he=rt.length;_e<he;_e++)Be=rt[_e],A.format!==qn?be!==null?k?Ee&&t.compressedTexSubImage2D(i.TEXTURE_2D,_e,0,0,Be.width,Be.height,be,Be.data):t.compressedTexImage2D(i.TEXTURE_2D,_e,Qe,Be.width,Be.height,0,Be.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Ee&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Be.width,Be.height,be,it,Be.data):t.texImage2D(i.TEXTURE_2D,_e,Qe,Be.width,Be.height,0,be,it,Be.data)}else if(A.isDataArrayTexture)if(k){if(Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Qe,pe.width,pe.height,pe.depth),Ee)if(A.layerUpdates.size>0){const _e=xh(pe.width,pe.height,A.format,A.type);for(const he of A.layerUpdates){const ke=pe.data.subarray(he*_e/pe.data.BYTES_PER_ELEMENT,(he+1)*_e/pe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,pe.width,pe.height,1,be,it,ke)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,be,it,pe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Qe,pe.width,pe.height,pe.depth,0,be,it,pe.data);else if(A.isData3DTexture)k?(Pe&&t.texStorage3D(i.TEXTURE_3D,Ae,Qe,pe.width,pe.height,pe.depth),Ee&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,be,it,pe.data)):t.texImage3D(i.TEXTURE_3D,0,Qe,pe.width,pe.height,pe.depth,0,be,it,pe.data);else if(A.isFramebufferTexture){if(Pe)if(k)t.texStorage2D(i.TEXTURE_2D,Ae,Qe,pe.width,pe.height);else{let _e=pe.width,he=pe.height;for(let ke=0;ke<Ae;ke++)t.texImage2D(i.TEXTURE_2D,ke,Qe,_e,he,0,be,it,null),_e>>=1,he>>=1}}else if(rt.length>0){if(k&&Pe){const _e=ot(rt[0]);t.texStorage2D(i.TEXTURE_2D,Ae,Qe,_e.width,_e.height)}for(let _e=0,he=rt.length;_e<he;_e++)Be=rt[_e],k?Ee&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,be,it,Be):t.texImage2D(i.TEXTURE_2D,_e,Qe,be,it,Be);A.generateMipmaps=!1}else if(k){if(Pe){const _e=ot(pe);t.texStorage2D(i.TEXTURE_2D,Ae,Qe,_e.width,_e.height)}Ee&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,it,pe)}else t.texImage2D(i.TEXTURE_2D,0,Qe,be,it,pe);x(A)&&d(ce),He.__version=se.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const ce=Se(D,A),ue=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+J);const se=n.get(ue);if(ue.version!==se.__version||ce===!0){t.activeTexture(i.TEXTURE0+J);const He=Ct.getPrimaries(Ct.workingColorSpace),Re=A.colorSpace===Di?null:Ct.getPrimaries(A.colorSpace),je=A.colorSpace===Di||He===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);const qe=A.isCompressedTexture||A.image[0].isCompressedTexture,pe=A.image[0]&&A.image[0].isDataTexture,be=[];for(let he=0;he<6;he++)!qe&&!pe?be[he]=_(A.image[he],!0,s.maxCubemapSize):be[he]=pe?A.image[he].image:A.image[he],be[he]=Ke(A,be[he]);const it=be[0],Qe=r.convert(A.format,A.colorSpace),Be=r.convert(A.type),rt=M(A.internalFormat,Qe,Be,A.colorSpace),k=A.isVideoTexture!==!0,Pe=se.__version===void 0||ce===!0,Ee=ue.dataReady;let Ae=E(A,it);I(i.TEXTURE_CUBE_MAP,A);let _e;if(qe){k&&Pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,rt,it.width,it.height);for(let he=0;he<6;he++){_e=be[he].mipmaps;for(let ke=0;ke<_e.length;ke++){const st=_e[ke];A.format!==qn?Qe!==null?k?Ee&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke,0,0,st.width,st.height,Qe,st.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke,rt,st.width,st.height,0,st.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke,0,0,st.width,st.height,Qe,Be,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke,rt,st.width,st.height,0,Qe,Be,st.data)}}}else{if(_e=A.mipmaps,k&&Pe){_e.length>0&&Ae++;const he=ot(be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,rt,he.width,he.height)}for(let he=0;he<6;he++)if(pe){k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,be[he].width,be[he].height,Qe,Be,be[he].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,rt,be[he].width,be[he].height,0,Qe,Be,be[he].data);for(let ke=0;ke<_e.length;ke++){const Ut=_e[ke].image[he].image;k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke+1,0,0,Ut.width,Ut.height,Qe,Be,Ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke+1,rt,Ut.width,Ut.height,0,Qe,Be,Ut.data)}}else{k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Qe,Be,be[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,rt,Qe,Be,be[he]);for(let ke=0;ke<_e.length;ke++){const st=_e[ke];k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke+1,0,0,Qe,Be,st.image[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ke+1,rt,Qe,Be,st.image[he])}}}x(A)&&d(i.TEXTURE_CUBE_MAP),se.__version=ue.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function Me(D,A,J,ce,ue,se){const He=r.convert(J.format,J.colorSpace),Re=r.convert(J.type),je=M(J.internalFormat,He,Re,J.colorSpace),qe=n.get(A),pe=n.get(J);if(pe.__renderTarget=A,!qe.__hasExternalTextures){const be=Math.max(1,A.width>>se),it=Math.max(1,A.height>>se);ue===i.TEXTURE_3D||ue===i.TEXTURE_2D_ARRAY?t.texImage3D(ue,se,je,be,it,A.depth,0,He,Re,null):t.texImage2D(ue,se,je,be,it,0,He,Re,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),Xe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,ue,pe.__webglTexture,0,Lt(A)):(ue===i.TEXTURE_2D||ue>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ce,ue,pe.__webglTexture,se),t.bindFramebuffer(i.FRAMEBUFFER,null)}function we(D,A,J){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer){const ce=A.depthTexture,ue=ce&&ce.isDepthTexture?ce.type:null,se=y(A.stencilBuffer,ue),He=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=Lt(A);Xe(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,se,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,se,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,se,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,He,i.RENDERBUFFER,D)}else{const ce=A.textures;for(let ue=0;ue<ce.length;ue++){const se=ce[ue],He=r.convert(se.format,se.colorSpace),Re=r.convert(se.type),je=M(se.internalFormat,He,Re,se.colorSpace),qe=Lt(A);J&&Xe(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,je,A.width,A.height):Xe(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qe,je,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,je,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=n.get(A.depthTexture);ce.__renderTarget=A,(!ce.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const ue=ce.__webglTexture,se=Lt(A);if(A.depthTexture.format===Cr)Xe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ue,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ue,0);else if(A.depthTexture.format===Rr)Xe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ue,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ue,0);else throw new Error("Unknown depthTexture format")}function Ye(D){const A=n.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ce){const ue=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ce.removeEventListener("dispose",ue)};ce.addEventListener("dispose",ue),A.__depthDisposeCallback=ue}A.__boundDepthTexture=ce}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Ie(A.__webglFramebuffer[0],D):Ie(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[ce]),A.__webglDepthbuffer[ce]===void 0)A.__webglDepthbuffer[ce]=i.createRenderbuffer(),we(A.__webglDepthbuffer[ce],D,!1);else{const ue=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=A.__webglDepthbuffer[ce];i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,se)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),we(A.__webglDepthbuffer,D,!1);else{const ue=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,se)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(D,A,J){const ce=n.get(D);A!==void 0&&Me(ce.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&Ye(D)}function $e(D){const A=D.texture,J=n.get(D),ce=n.get(A);D.addEventListener("dispose",R);const ue=D.textures,se=D.isWebGLCubeRenderTarget===!0,He=ue.length>1;if(He||(ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture()),ce.__version=A.version,a.memory.textures++),se){J.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Re]=[];for(let je=0;je<A.mipmaps.length;je++)J.__webglFramebuffer[Re][je]=i.createFramebuffer()}else J.__webglFramebuffer[Re]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Re=0;Re<A.mipmaps.length;Re++)J.__webglFramebuffer[Re]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(He)for(let Re=0,je=ue.length;Re<je;Re++){const qe=n.get(ue[Re]);qe.__webglTexture===void 0&&(qe.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&Xe(D)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Re=0;Re<ue.length;Re++){const je=ue[Re];J.__webglColorRenderbuffer[Re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[Re]);const qe=r.convert(je.format,je.colorSpace),pe=r.convert(je.type),be=M(je.internalFormat,qe,pe,je.colorSpace,D.isXRRenderTarget===!0),it=Lt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,it,be,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,J.__webglColorRenderbuffer[Re])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),we(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(se){t.bindTexture(i.TEXTURE_CUBE_MAP,ce.__webglTexture),I(i.TEXTURE_CUBE_MAP,A);for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)Me(J.__webglFramebuffer[Re][je],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,je);else Me(J.__webglFramebuffer[Re],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);x(A)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(He){for(let Re=0,je=ue.length;Re<je;Re++){const qe=ue[Re],pe=n.get(qe);let be=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(be=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,pe.__webglTexture),I(be,qe),Me(J.__webglFramebuffer,D,qe,i.COLOR_ATTACHMENT0+Re,be,0),x(qe)&&d(be)}t.unbindTexture()}else{let Re=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Re=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Re,ce.__webglTexture),I(Re,A),A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)Me(J.__webglFramebuffer[je],D,A,i.COLOR_ATTACHMENT0,Re,je);else Me(J.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,Re,0);x(A)&&d(Re),t.unbindTexture()}D.depthBuffer&&Ye(D)}function Pt(D){const A=D.textures;for(let J=0,ce=A.length;J<ce;J++){const ue=A[J];if(x(ue)){const se=v(D),He=n.get(ue).__webglTexture;t.bindTexture(se,He),d(se),t.unbindTexture()}}}const B=[],ft=[];function ht(D){if(D.samples>0){if(Xe(D)===!1){const A=D.textures,J=D.width,ce=D.height;let ue=i.COLOR_BUFFER_BIT;const se=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,He=n.get(D),Re=A.length>1;if(Re)for(let qe=0;qe<A.length;qe++)t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+qe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+qe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,He.__webglMultisampledFramebuffer);const je=D.texture.mipmaps;je&&je.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglFramebuffer);for(let qe=0;qe<A.length;qe++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ue|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ue|=i.STENCIL_BUFFER_BIT)),Re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,He.__webglColorRenderbuffer[qe]);const pe=n.get(A[qe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pe,0)}i.blitFramebuffer(0,0,J,ce,0,0,J,ce,ue,i.NEAREST),l===!0&&(B.length=0,ft.length=0,B.push(i.COLOR_ATTACHMENT0+qe),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(se),ft.push(se),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ft)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Re)for(let qe=0;qe<A.length;qe++){t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+qe,i.RENDERBUFFER,He.__webglColorRenderbuffer[qe]);const pe=n.get(A[qe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+qe,i.TEXTURE_2D,pe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const A=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function Lt(D){return Math.min(s.maxSamples,D.samples)}function Xe(D){const A=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function It(D){const A=a.render.frame;u.get(D)!==A&&(u.set(D,A),D.update())}function Ke(D,A){const J=D.colorSpace,ce=D.format,ue=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==Gs&&J!==Di&&(Ct.getTransfer(J)===Ft?(ce!==qn||ue!==ai)&&lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xt("WebGLTextures: Unsupported texture color space:",J)),A}function ot(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=U,this.setTexture2D=te,this.setTexture2DArray=W,this.setTexture3D=j,this.setTextureCube=ne,this.rebindTextures=Dt,this.setupRenderTarget=$e,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Xe}function r1(i,e){function t(n,s=Di){let r;const a=Ct.getTransfer(s);if(n===ai)return i.UNSIGNED_BYTE;if(n===$l)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Kl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ld)return i.BYTE;if(n===cd)return i.SHORT;if(n===Er)return i.UNSIGNED_SHORT;if(n===Zl)return i.INT;if(n===os)return i.UNSIGNED_INT;if(n===ei)return i.FLOAT;if(n===si)return i.HALF_FLOAT;if(n===ud)return i.ALPHA;if(n===fd)return i.RGB;if(n===qn)return i.RGBA;if(n===Cr)return i.DEPTH_COMPONENT;if(n===Rr)return i.DEPTH_STENCIL;if(n===Jl)return i.RED;if(n===jl)return i.RED_INTEGER;if(n===Ql)return i.RG;if(n===ec)return i.RG_INTEGER;if(n===tc)return i.RGBA_INTEGER;if(n===Ta||n===Ea||n===Aa||n===Ca)if(a===Ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ta)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ta)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ea)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ca)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===il||n===sl||n===rl||n===al)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===rl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ol||n===ll||n===cl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ol||n===ll)return a===Ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===cl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===hl||n===dl||n===ul||n===fl||n===pl||n===ml||n===xl||n===gl||n===vl||n===_l||n===Ml||n===Sl||n===yl||n===wl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===hl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===dl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ul)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===pl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ml)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_l)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ml)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Sl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===yl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===wl)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===bl||n===Tl||n===El)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===bl)return a===Ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Tl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===El)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Al||n===Cl||n===Rl||n===Pl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Al)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Pl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ar?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const a1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,o1=`
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

}`;class l1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Cd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new hn({vertexShader:a1,fragmentShader:o1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new V(new Bt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class c1 extends Ys{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,p=null,m=null,g=null;const _=typeof XRWebGLBinding<"u",x=new l1,d={},v=t.getContextAttributes();let M=null,y=null;const E=[],T=[],R=new Te;let C=null;const w=new Cn;w.viewport=new zt;const S=new Cn;S.viewport=new zt;const L=[w,S],U=new A0;let H=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new yo,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new yo,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new yo,E[$]=K),K.getHandSpace()};function te($){const K=T.indexOf($.inputSource);if(K===-1)return;const Me=E[K];Me!==void 0&&(Me.update($.inputSource,$.frame,c||a),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",j);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}H=null,ee=null,x.reset();for(const $ in d)delete d[$];e.setRenderTarget(M),m=null,p=null,f=null,s=null,y=null,ye.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",W),s.addEventListener("inputsourceschange",j),v.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,we=null,Ie=null;v.depth&&(Ie=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=v.stencil?Rr:Cr,we=v.stencil?Ar:os);const Ye={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:r};f=this.getBinding(),p=f.createProjectionLayer(Ye),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new Zn(p.textureWidth,p.textureHeight,{format:qn,type:ai,depthTexture:new Ad(p.textureWidth,p.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const Me={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Zn(m.framebufferWidth,m.framebufferHeight,{format:qn,type:ai,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ye.setContext(s),ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function j($){for(let K=0;K<$.removed.length;K++){const Me=$.removed[K],we=T.indexOf(Me);we>=0&&(T[we]=null,E[we].disconnect(Me))}for(let K=0;K<$.added.length;K++){const Me=$.added[K];let we=T.indexOf(Me);if(we===-1){for(let Ye=0;Ye<E.length;Ye++)if(Ye>=T.length){T.push(Me),we=Ye;break}else if(T[Ye]===null){T[Ye]=Me,we=Ye;break}if(we===-1)break}const Ie=E[we];Ie&&Ie.connect(Me)}}const ne=new P,de=new P;function fe($,K,Me){ne.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(Me.matrixWorld);const we=ne.distanceTo(de),Ie=K.projectionMatrix.elements,Ye=Me.projectionMatrix.elements,Dt=Ie[14]/(Ie[10]-1),$e=Ie[14]/(Ie[10]+1),Pt=(Ie[9]+1)/Ie[5],B=(Ie[9]-1)/Ie[5],ft=(Ie[8]-1)/Ie[0],ht=(Ye[8]+1)/Ye[0],Lt=Dt*ft,Xe=Dt*ht,It=we/(-ft+ht),Ke=It*-ft;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Ke),$.translateZ(It),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ie[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ot=Dt+It,D=$e+It,A=Lt-Ke,J=Xe+(we-Ke),ce=Pt*$e/D*ot,ue=B*$e/D*ot;$.projectionMatrix.makePerspective(A,J,ce,ue,ot,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ve($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,Me=$.far;x.texture!==null&&(x.depthNear>0&&(K=x.depthNear),x.depthFar>0&&(Me=x.depthFar)),U.near=S.near=w.near=K,U.far=S.far=w.far=Me,(H!==U.near||ee!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),H=U.near,ee=U.far),U.layers.mask=$.layers.mask|6,w.layers.mask=U.layers.mask&3,S.layers.mask=U.layers.mask&5;const we=$.parent,Ie=U.cameras;Ve(U,we);for(let Ye=0;Ye<Ie.length;Ye++)Ve(Ie[Ye],we);Ie.length===2?fe(U,w,S):U.projectionMatrix.copy(w.projectionMatrix),I($,U,we)};function I($,K,Me){Me===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Lr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function($){l=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(U)},this.getCameraTexture=function($){return d[$]};let Se=null;function ge($,K){if(u=K.getViewerPose(c||a),g=K,u!==null){const Me=u.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let we=!1;Me.length!==U.cameras.length&&(U.cameras.length=0,we=!0);for(let $e=0;$e<Me.length;$e++){const Pt=Me[$e];let B=null;if(m!==null)B=m.getViewport(Pt);else{const ht=f.getViewSubImage(p,Pt);B=ht.viewport,$e===0&&(e.setRenderTargetTextures(y,ht.colorTexture,ht.depthStencilTexture),e.setRenderTarget(y))}let ft=L[$e];ft===void 0&&(ft=new Cn,ft.layers.enable($e),ft.viewport=new zt,L[$e]=ft),ft.matrix.fromArray(Pt.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Pt.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(B.x,B.y,B.width,B.height),$e===0&&(U.matrix.copy(ft.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),we===!0&&U.cameras.push(ft)}const Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const $e=f.getDepthInformation(Me[0]);$e&&$e.isValid&&$e.texture&&x.init($e,s.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),f=n.getBinding();for(let $e=0;$e<Me.length;$e++){const Pt=Me[$e].camera;if(Pt){let B=d[Pt];B||(B=new Cd,d[Pt]=B);const ft=f.getCameraImage(Pt);B.sourceTexture=ft}}}}for(let Me=0;Me<E.length;Me++){const we=T[Me],Ie=E[Me];we!==null&&Ie!==void 0&&Ie.update(we,K,c||a)}Se&&Se($,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const ye=new Bd;ye.setAnimationLoop(ge),this.setAnimationLoop=function($){Se=$},this.dispose=function(){}}}const Xi=new Kn,h1=new Tt;function d1(i,e){function t(x,d){x.matrixAutoUpdate===!0&&x.updateMatrix(),d.value.copy(x.matrix)}function n(x,d){d.color.getRGB(x.fogColor.value,Md(i)),d.isFog?(x.fogNear.value=d.near,x.fogFar.value=d.far):d.isFogExp2&&(x.fogDensity.value=d.density)}function s(x,d,v,M,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(x,d):d.isMeshToonMaterial?(r(x,d),f(x,d)):d.isMeshPhongMaterial?(r(x,d),u(x,d)):d.isMeshStandardMaterial?(r(x,d),p(x,d),d.isMeshPhysicalMaterial&&m(x,d,y)):d.isMeshMatcapMaterial?(r(x,d),g(x,d)):d.isMeshDepthMaterial?r(x,d):d.isMeshDistanceMaterial?(r(x,d),_(x,d)):d.isMeshNormalMaterial?r(x,d):d.isLineBasicMaterial?(a(x,d),d.isLineDashedMaterial&&o(x,d)):d.isPointsMaterial?l(x,d,v,M):d.isSpriteMaterial?c(x,d):d.isShadowMaterial?(x.color.value.copy(d.color),x.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(x,d){x.opacity.value=d.opacity,d.color&&x.diffuse.value.copy(d.color),d.emissive&&x.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(x.map.value=d.map,t(d.map,x.mapTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,t(d.alphaMap,x.alphaMapTransform)),d.bumpMap&&(x.bumpMap.value=d.bumpMap,t(d.bumpMap,x.bumpMapTransform),x.bumpScale.value=d.bumpScale,d.side===dn&&(x.bumpScale.value*=-1)),d.normalMap&&(x.normalMap.value=d.normalMap,t(d.normalMap,x.normalMapTransform),x.normalScale.value.copy(d.normalScale),d.side===dn&&x.normalScale.value.negate()),d.displacementMap&&(x.displacementMap.value=d.displacementMap,t(d.displacementMap,x.displacementMapTransform),x.displacementScale.value=d.displacementScale,x.displacementBias.value=d.displacementBias),d.emissiveMap&&(x.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,x.emissiveMapTransform)),d.specularMap&&(x.specularMap.value=d.specularMap,t(d.specularMap,x.specularMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest);const v=e.get(d),M=v.envMap,y=v.envMapRotation;M&&(x.envMap.value=M,Xi.copy(y),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),x.envMapRotation.value.setFromMatrix4(h1.makeRotationFromEuler(Xi)),x.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=d.reflectivity,x.ior.value=d.ior,x.refractionRatio.value=d.refractionRatio),d.lightMap&&(x.lightMap.value=d.lightMap,x.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,x.lightMapTransform)),d.aoMap&&(x.aoMap.value=d.aoMap,x.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,x.aoMapTransform))}function a(x,d){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,d.map&&(x.map.value=d.map,t(d.map,x.mapTransform))}function o(x,d){x.dashSize.value=d.dashSize,x.totalSize.value=d.dashSize+d.gapSize,x.scale.value=d.scale}function l(x,d,v,M){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,x.size.value=d.size*v,x.scale.value=M*.5,d.map&&(x.map.value=d.map,t(d.map,x.uvTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,t(d.alphaMap,x.alphaMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest)}function c(x,d){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,x.rotation.value=d.rotation,d.map&&(x.map.value=d.map,t(d.map,x.mapTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,t(d.alphaMap,x.alphaMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest)}function u(x,d){x.specular.value.copy(d.specular),x.shininess.value=Math.max(d.shininess,1e-4)}function f(x,d){d.gradientMap&&(x.gradientMap.value=d.gradientMap)}function p(x,d){x.metalness.value=d.metalness,d.metalnessMap&&(x.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,x.metalnessMapTransform)),x.roughness.value=d.roughness,d.roughnessMap&&(x.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,x.roughnessMapTransform)),d.envMap&&(x.envMapIntensity.value=d.envMapIntensity)}function m(x,d,v){x.ior.value=d.ior,d.sheen>0&&(x.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),x.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(x.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,x.sheenColorMapTransform)),d.sheenRoughnessMap&&(x.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,x.sheenRoughnessMapTransform))),d.clearcoat>0&&(x.clearcoat.value=d.clearcoat,x.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(x.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,x.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(x.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===dn&&x.clearcoatNormalScale.value.negate())),d.dispersion>0&&(x.dispersion.value=d.dispersion),d.iridescence>0&&(x.iridescence.value=d.iridescence,x.iridescenceIOR.value=d.iridescenceIOR,x.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(x.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,x.iridescenceMapTransform)),d.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),d.transmission>0&&(x.transmission.value=d.transmission,x.transmissionSamplerMap.value=v.texture,x.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(x.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,x.transmissionMapTransform)),x.thickness.value=d.thickness,d.thicknessMap&&(x.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=d.attenuationDistance,x.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(x.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(x.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=d.specularIntensity,x.specularColor.value.copy(d.specularColor),d.specularColorMap&&(x.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,x.specularColorMapTransform)),d.specularIntensityMap&&(x.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,d){d.matcap&&(x.matcap.value=d.matcap)}function _(x,d){const v=e.get(d).light;x.referencePosition.value.setFromMatrixPosition(v.matrixWorld),x.nearDistance.value=v.shadow.camera.near,x.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function u1(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){const y=M.program;n.uniformBlockBinding(v,y)}function c(v,M){let y=s[v.id];y===void 0&&(g(v),y=u(v),s[v.id]=y,v.addEventListener("dispose",x));const E=M.program;n.updateUBOMapping(v,E);const T=e.render.frame;r[v.id]!==T&&(p(v),r[v.id]=T)}function u(v){const M=f();v.__bindingPointIndex=M;const y=i.createBuffer(),E=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,y),y}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Xt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(v){const M=s[v.id],y=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,R=y.length;T<R;T++){const C=Array.isArray(y[T])?y[T]:[y[T]];for(let w=0,S=C.length;w<S;w++){const L=C[w];if(m(L,T,w,E)===!0){const U=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let ee=0;for(let te=0;te<H.length;te++){const W=H[te],j=_(W);typeof W=="number"||typeof W=="boolean"?(L.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,U+ee,L.__data)):W.isMatrix3?(L.__data[0]=W.elements[0],L.__data[1]=W.elements[1],L.__data[2]=W.elements[2],L.__data[3]=0,L.__data[4]=W.elements[3],L.__data[5]=W.elements[4],L.__data[6]=W.elements[5],L.__data[7]=0,L.__data[8]=W.elements[6],L.__data[9]=W.elements[7],L.__data[10]=W.elements[8],L.__data[11]=0):(W.toArray(L.__data,ee),ee+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(v,M,y,E){const T=v.value,R=M+"_"+y;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const C=E[R];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[R]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(v){const M=v.uniforms;let y=0;const E=16;for(let R=0,C=M.length;R<C;R++){const w=Array.isArray(M[R])?M[R]:[M[R]];for(let S=0,L=w.length;S<L;S++){const U=w[S],H=Array.isArray(U.value)?U.value:[U.value];for(let ee=0,te=H.length;ee<te;ee++){const W=H[ee],j=_(W),ne=y%E,de=ne%j.boundary,fe=ne+de;y+=de,fe!==0&&E-fe<j.storage&&(y+=E-fe),U.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=y,y+=j.storage}}}const T=y%E;return T>0&&(y+=E-T),v.__size=y,v.__cache={},this}function _(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):lt("WebGLRenderer: Unsupported uniform value type.",v),M}function x(v){const M=v.target;M.removeEventListener("dispose",x);const y=a.indexOf(M.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function d(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const f1=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let pi=null;function p1(){return pi===null&&(pi=new Ed(f1,32,32,Ql,si),pi.minFilter=Fn,pi.magFilter=Fn,pi.wrapS=vi,pi.wrapT=vi,pi.generateMipmaps=!1,pi.needsUpdate=!0),pi}class m1{constructor(e={}){const{canvas:t=$u(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Set([tc,ec,jl]),_=new Set([ai,os,Er,Ar,$l,Kl]),x=new Uint32Array(4),d=new Int32Array(4);let v=null,M=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let R=!1;this._outputColorSpace=bt;let C=0,w=0,S=null,L=-1,U=null;const H=new zt,ee=new zt;let te=null;const W=new nt(0);let j=0,ne=t.width,de=t.height,fe=1,Ve=null,I=null;const Se=new zt(0,0,ne,de),ge=new zt(0,0,ne,de);let ye=!1;const $=new lc;let K=!1,Me=!1;const we=new Tt,Ie=new P,Ye=new zt,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function Pt(){return S===null?fe:1}let B=n;function ft(b,z){return t.getContext(b,z)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Xl}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",he,!1),t.addEventListener("webglcontextcreationerror",ke,!1),B===null){const z="webgl2";if(B=ft(z,b),B===null)throw ft(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw b("WebGLRenderer: "+b.message),b}let ht,Lt,Xe,It,Ke,ot,D,A,J,ce,ue,se,He,Re,je,qe,pe,be,it,Qe,Be,rt,k,Pe;function Ee(){ht=new wx(B),ht.init(),rt=new r1(B,ht),Lt=new px(B,ht,e,rt),Xe=new i1(B,ht),Lt.reversedDepthBuffer&&p&&Xe.buffers.depth.setReversed(!0),It=new Ex(B),Ke=new Wg,ot=new s1(B,ht,Xe,Ke,Lt,rt,It),D=new xx(T),A=new yx(T),J=new P0(B),k=new ux(B,J),ce=new bx(B,J,It,k),ue=new Cx(B,ce,J,It),it=new Ax(B,Lt,ot),qe=new mx(Ke),se=new Hg(T,D,A,ht,Lt,k,qe),He=new d1(T,Ke),Re=new qg,je=new jg(ht),be=new dx(T,D,A,Xe,ue,m,l),pe=new t1(T,ue,Lt),Pe=new u1(B,It,Lt,Xe),Qe=new fx(B,ht,It),Be=new Tx(B,ht,It),It.programs=se.programs,T.capabilities=Lt,T.extensions=ht,T.properties=Ke,T.renderLists=Re,T.shadowMap=pe,T.state=Xe,T.info=It}Ee();const Ae=new c1(T,B);this.xr=Ae,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const b=ht.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ht.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(b){b!==void 0&&(fe=b,this.setSize(ne,de,!1))},this.getSize=function(b){return b.set(ne,de)},this.setSize=function(b,z,G=!0){if(Ae.isPresenting){lt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=b,de=z,t.width=Math.floor(b*fe),t.height=Math.floor(z*fe),G===!0&&(t.style.width=b+"px",t.style.height=z+"px"),this.setViewport(0,0,b,z)},this.getDrawingBufferSize=function(b){return b.set(ne*fe,de*fe).floor()},this.setDrawingBufferSize=function(b,z,G){ne=b,de=z,fe=G,t.width=Math.floor(b*G),t.height=Math.floor(z*G),this.setViewport(0,0,b,z)},this.getCurrentViewport=function(b){return b.copy(H)},this.getViewport=function(b){return b.copy(Se)},this.setViewport=function(b,z,G,X){b.isVector4?Se.set(b.x,b.y,b.z,b.w):Se.set(b,z,G,X),Xe.viewport(H.copy(Se).multiplyScalar(fe).round())},this.getScissor=function(b){return b.copy(ge)},this.setScissor=function(b,z,G,X){b.isVector4?ge.set(b.x,b.y,b.z,b.w):ge.set(b,z,G,X),Xe.scissor(ee.copy(ge).multiplyScalar(fe).round())},this.getScissorTest=function(){return ye},this.setScissorTest=function(b){Xe.setScissorTest(ye=b)},this.setOpaqueSort=function(b){Ve=b},this.setTransparentSort=function(b){I=b},this.getClearColor=function(b){return b.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(b=!0,z=!0,G=!0){let X=0;if(b){let O=!1;if(S!==null){const Z=S.texture.format;O=g.has(Z)}if(O){const Z=S.texture.type,le=_.has(Z),me=be.getClearColor(),xe=be.getClearAlpha(),Ce=me.r,ve=me.g,Oe=me.b;le?(x[0]=Ce,x[1]=ve,x[2]=Oe,x[3]=xe,B.clearBufferuiv(B.COLOR,0,x)):(d[0]=Ce,d[1]=ve,d[2]=Oe,d[3]=xe,B.clearBufferiv(B.COLOR,0,d))}else X|=B.COLOR_BUFFER_BIT}z&&(X|=B.DEPTH_BUFFER_BIT),G&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",he,!1),t.removeEventListener("webglcontextcreationerror",ke,!1),be.dispose(),Re.dispose(),je.dispose(),Ke.dispose(),D.dispose(),A.dispose(),ue.dispose(),k.dispose(),Pe.dispose(),se.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",js),Ae.removeEventListener("sessionend",li),mn.stop()};function _e(b){b.preventDefault(),Na("WebGLRenderer: Context Lost."),R=!0}function he(){Na("WebGLRenderer: Context Restored."),R=!1;const b=It.autoReset,z=pe.enabled,G=pe.autoUpdate,X=pe.needsUpdate,O=pe.type;Ee(),It.autoReset=b,pe.enabled=z,pe.autoUpdate=G,pe.needsUpdate=X,pe.type=O}function ke(b){Xt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function st(b){const z=b.target;z.removeEventListener("dispose",st),Ut(z)}function Ut(b){At(b),Ke.remove(b)}function At(b){const z=Ke.get(b).programs;z!==void 0&&(z.forEach(function(G){se.releaseProgram(G)}),b.isShaderMaterial&&se.releaseShaderCache(b))}this.renderBufferDirect=function(b,z,G,X,O,Z){z===null&&(z=Dt);const le=O.isMesh&&O.matrixWorld.determinant()<0,me=q(b,z,G,X,O);Xe.setMaterial(X,le);let xe=G.index,Ce=1;if(X.wireframe===!0){if(xe=ce.getWireframeAttribute(G),xe===void 0)return;Ce=2}const ve=G.drawRange,Oe=G.attributes.position;let Je=ve.start*Ce,ut=(ve.start+ve.count)*Ce;Z!==null&&(Je=Math.max(Je,Z.start*Ce),ut=Math.min(ut,(Z.start+Z.count)*Ce)),xe!==null?(Je=Math.max(Je,0),ut=Math.min(ut,xe.count)):Oe!=null&&(Je=Math.max(Je,0),ut=Math.min(ut,Oe.count));const _t=ut-Je;if(_t<0||_t===1/0)return;k.setup(O,X,me,G,xe);let Mt,xt=Qe;if(xe!==null&&(Mt=J.get(xe),xt=Be,xt.setIndex(Mt)),O.isMesh)X.wireframe===!0?(Xe.setLineWidth(X.wireframeLinewidth*Pt()),xt.setMode(B.LINES)):xt.setMode(B.TRIANGLES);else if(O.isLine){let Ge=X.linewidth;Ge===void 0&&(Ge=1),Xe.setLineWidth(Ge*Pt()),O.isLineSegments?xt.setMode(B.LINES):O.isLineLoop?xt.setMode(B.LINE_LOOP):xt.setMode(B.LINE_STRIP)}else O.isPoints?xt.setMode(B.POINTS):O.isSprite&&xt.setMode(B.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Pr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(ht.get("WEBGL_multi_draw"))xt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ge=O._multiDrawStarts,St=O._multiDrawCounts,yt=O._multiDrawCount,Gt=xe?J.get(xe).bytesPerElement:1,Tn=Ke.get(X).currentProgram.getUniforms();for(let Kt=0;Kt<yt;Kt++)Tn.setValue(B,"_gl_DrawID",Kt),xt.render(Ge[Kt]/Gt,St[Kt])}else if(O.isInstancedMesh)xt.renderInstances(Je,_t,O.count);else if(G.isInstancedBufferGeometry){const Ge=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,St=Math.min(G.instanceCount,Ge);xt.renderInstances(Je,_t,St)}else xt.render(Je,_t)};function $t(b,z,G){b.transparent===!0&&b.side===mt&&b.forceSinglePass===!1?(b.side=dn,b.needsUpdate=!0,Oi(b,z,G),b.side=Ni,b.needsUpdate=!0,Oi(b,z,G),b.side=mt):Oi(b,z,G)}this.compile=function(b,z,G=null){G===null&&(G=b),M=je.get(G),M.init(z),E.push(M),G.traverseVisible(function(O){O.isLight&&O.layers.test(z.layers)&&(M.pushLight(O),O.castShadow&&M.pushShadow(O))}),b!==G&&b.traverseVisible(function(O){O.isLight&&O.layers.test(z.layers)&&(M.pushLight(O),O.castShadow&&M.pushShadow(O))}),M.setupLights();const X=new Set;return b.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const Z=O.material;if(Z)if(Array.isArray(Z))for(let le=0;le<Z.length;le++){const me=Z[le];$t(me,G,O),X.add(me)}else $t(Z,G,O),X.add(Z)}),M=E.pop(),X},this.compileAsync=function(b,z,G=null){const X=this.compile(b,z,G);return new Promise(O=>{function Z(){if(X.forEach(function(le){Ke.get(le).currentProgram.isReady()&&X.delete(le)}),X.size===0){O(b);return}setTimeout(Z,10)}ht.get("KHR_parallel_shader_compile")!==null?Z():setTimeout(Z,10)})};let bn=null;function Vr(b){bn&&bn(b)}function js(){mn.stop()}function li(){mn.start()}const mn=new Bd;mn.setAnimationLoop(Vr),typeof self<"u"&&mn.setContext(self),this.setAnimationLoop=function(b){bn=b,Ae.setAnimationLoop(b),b===null?mn.stop():mn.start()},Ae.addEventListener("sessionstart",js),Ae.addEventListener("sessionend",li),this.render=function(b,z){if(z!==void 0&&z.isCamera!==!0){Xt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(z),z=Ae.getCamera()),b.isScene===!0&&b.onBeforeRender(T,b,z,S),M=je.get(b,E.length),M.init(z),E.push(M),we.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),$.setFromProjectionMatrix(we,ti,z.reversedDepth),Me=this.localClippingEnabled,K=qe.init(this.clippingPlanes,Me),v=Re.get(b,y.length),v.init(),y.push(v),Ae.enabled===!0&&Ae.isPresenting===!0){const Z=T.xr.getDepthSensingMesh();Z!==null&&us(Z,z,-1/0,T.sortObjects)}us(b,z,0,T.sortObjects),v.finish(),T.sortObjects===!0&&v.sort(Ve,I),$e=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,$e&&be.addToRenderList(v,b),this.info.render.frame++,K===!0&&qe.beginShadows();const G=M.state.shadowsArray;pe.render(G,b,z),K===!0&&qe.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,O=v.transmissive;if(M.setupLights(),z.isArrayCamera){const Z=z.cameras;if(O.length>0)for(let le=0,me=Z.length;le<me;le++){const xe=Z[le];Hr(X,O,b,xe)}$e&&be.render(b);for(let le=0,me=Z.length;le<me;le++){const xe=Z[le];Gr(v,b,xe,xe.viewport)}}else O.length>0&&Hr(X,O,b,z),$e&&be.render(b),Gr(v,b,z);S!==null&&w===0&&(ot.updateMultisampleRenderTarget(S),ot.updateRenderTargetMipmap(S)),b.isScene===!0&&b.onAfterRender(T,b,z),k.resetDefaultState(),L=-1,U=null,E.pop(),E.length>0?(M=E[E.length-1],K===!0&&qe.setGlobalState(T.clippingPlanes,M.state.camera)):M=null,y.pop(),y.length>0?v=y[y.length-1]:v=null};function us(b,z,G,X){if(b.visible===!1)return;if(b.layers.test(z.layers)){if(b.isGroup)G=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(z);else if(b.isLight)M.pushLight(b),b.castShadow&&M.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||$.intersectsSprite(b)){X&&Ye.setFromMatrixPosition(b.matrixWorld).applyMatrix4(we);const le=ue.update(b),me=b.material;me.visible&&v.push(b,le,me,G,Ye.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||$.intersectsObject(b))){const le=ue.update(b),me=b.material;if(X&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ye.copy(b.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),Ye.copy(le.boundingSphere.center)),Ye.applyMatrix4(b.matrixWorld).applyMatrix4(we)),Array.isArray(me)){const xe=le.groups;for(let Ce=0,ve=xe.length;Ce<ve;Ce++){const Oe=xe[Ce],Je=me[Oe.materialIndex];Je&&Je.visible&&v.push(b,le,Je,G,Ye.z,Oe)}}else me.visible&&v.push(b,le,me,G,Ye.z,null)}}const Z=b.children;for(let le=0,me=Z.length;le<me;le++)us(Z[le],z,G,X)}function Gr(b,z,G,X){const{opaque:O,transmissive:Z,transparent:le}=b;M.setupLightsView(G),K===!0&&qe.setGlobalState(T.clippingPlanes,G),X&&Xe.viewport(H.copy(X)),O.length>0&&en(O,z,G),Z.length>0&&en(Z,z,G),le.length>0&&en(le,z,G),Xe.buffers.depth.setTest(!0),Xe.buffers.depth.setMask(!0),Xe.buffers.color.setMask(!0),Xe.setPolygonOffset(!1)}function Hr(b,z,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;M.state.transmissionRenderTarget[X.id]===void 0&&(M.state.transmissionRenderTarget[X.id]=new Zn(1,1,{generateMipmaps:!0,type:ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float")?si:ai,minFilter:Qi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const Z=M.state.transmissionRenderTarget[X.id],le=X.viewport||H;Z.setSize(le.z*T.transmissionResolutionScale,le.w*T.transmissionResolutionScale);const me=T.getRenderTarget(),xe=T.getActiveCubeFace(),Ce=T.getActiveMipmapLevel();T.setRenderTarget(Z),T.getClearColor(W),j=T.getClearAlpha(),j<1&&T.setClearColor(16777215,.5),T.clear(),$e&&be.render(G);const ve=T.toneMapping;T.toneMapping=Fi;const Oe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),M.setupLightsView(X),K===!0&&qe.setGlobalState(T.clippingPlanes,X),en(b,G,X),ot.updateMultisampleRenderTarget(Z),ot.updateRenderTargetMipmap(Z),ht.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let ut=0,_t=z.length;ut<_t;ut++){const Mt=z[ut],{object:xt,geometry:Ge,material:St,group:yt}=Mt;if(St.side===mt&&xt.layers.test(X.layers)){const Gt=St.side;St.side=dn,St.needsUpdate=!0,Wr(xt,G,X,Ge,St,yt),St.side=Gt,St.needsUpdate=!0,Je=!0}}Je===!0&&(ot.updateMultisampleRenderTarget(Z),ot.updateRenderTargetMipmap(Z))}T.setRenderTarget(me,xe,Ce),T.setClearColor(W,j),Oe!==void 0&&(X.viewport=Oe),T.toneMapping=ve}function en(b,z,G){const X=z.isScene===!0?z.overrideMaterial:null;for(let O=0,Z=b.length;O<Z;O++){const le=b[O],{object:me,geometry:xe,group:Ce}=le;let ve=le.material;ve.allowOverride===!0&&X!==null&&(ve=X),me.layers.test(G.layers)&&Wr(me,z,G,xe,ve,Ce)}}function Wr(b,z,G,X,O,Z){b.onBeforeRender(T,z,G,X,O,Z),b.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),O.onBeforeRender(T,z,G,X,b,Z),O.transparent===!0&&O.side===mt&&O.forceSinglePass===!1?(O.side=dn,O.needsUpdate=!0,T.renderBufferDirect(G,z,X,O,b,Z),O.side=Ni,O.needsUpdate=!0,T.renderBufferDirect(G,z,X,O,b,Z),O.side=mt):T.renderBufferDirect(G,z,X,O,b,Z),b.onAfterRender(T,z,G,X,O,Z)}function Oi(b,z,G){z.isScene!==!0&&(z=Dt);const X=Ke.get(b),O=M.state.lights,Z=M.state.shadowsArray,le=O.state.version,me=se.getParameters(b,O.state,Z,z,G),xe=se.getProgramCacheKey(me);let Ce=X.programs;X.environment=b.isMeshStandardMaterial?z.environment:null,X.fog=z.fog,X.envMap=(b.isMeshStandardMaterial?A:D).get(b.envMap||X.environment),X.envMapRotation=X.environment!==null&&b.envMap===null?z.environmentRotation:b.envMapRotation,Ce===void 0&&(b.addEventListener("dispose",st),Ce=new Map,X.programs=Ce);let ve=Ce.get(xe);if(ve!==void 0){if(X.currentProgram===ve&&X.lightsStateVersion===le)return N(b,me),ve}else me.uniforms=se.getUniforms(b),b.onBeforeCompile(me,T),ve=se.acquireProgram(me,xe),Ce.set(xe,ve),X.uniforms=me.uniforms;const Oe=X.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Oe.clippingPlanes=qe.uniform),N(b,me),X.needsLights=ie(b),X.lightsStateVersion=le,X.needsLights&&(Oe.ambientLightColor.value=O.state.ambient,Oe.lightProbe.value=O.state.probe,Oe.directionalLights.value=O.state.directional,Oe.directionalLightShadows.value=O.state.directionalShadow,Oe.spotLights.value=O.state.spot,Oe.spotLightShadows.value=O.state.spotShadow,Oe.rectAreaLights.value=O.state.rectArea,Oe.ltc_1.value=O.state.rectAreaLTC1,Oe.ltc_2.value=O.state.rectAreaLTC2,Oe.pointLights.value=O.state.point,Oe.pointLightShadows.value=O.state.pointShadow,Oe.hemisphereLights.value=O.state.hemi,Oe.directionalShadowMap.value=O.state.directionalShadowMap,Oe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Oe.spotShadowMap.value=O.state.spotShadowMap,Oe.spotLightMatrix.value=O.state.spotLightMatrix,Oe.spotLightMap.value=O.state.spotLightMap,Oe.pointShadowMap.value=O.state.pointShadowMap,Oe.pointShadowMatrix.value=O.state.pointShadowMatrix),X.currentProgram=ve,X.uniformsList=null,ve}function F(b){if(b.uniformsList===null){const z=b.currentProgram.getUniforms();b.uniformsList=Ra.seqWithValue(z.seq,b.uniforms)}return b.uniformsList}function N(b,z){const G=Ke.get(b);G.outputColorSpace=z.outputColorSpace,G.batching=z.batching,G.batchingColor=z.batchingColor,G.instancing=z.instancing,G.instancingColor=z.instancingColor,G.instancingMorph=z.instancingMorph,G.skinning=z.skinning,G.morphTargets=z.morphTargets,G.morphNormals=z.morphNormals,G.morphColors=z.morphColors,G.morphTargetsCount=z.morphTargetsCount,G.numClippingPlanes=z.numClippingPlanes,G.numIntersection=z.numClipIntersection,G.vertexAlphas=z.vertexAlphas,G.vertexTangents=z.vertexTangents,G.toneMapping=z.toneMapping}function q(b,z,G,X,O){z.isScene!==!0&&(z=Dt),ot.resetTextureUnits();const Z=z.fog,le=X.isMeshStandardMaterial?z.environment:null,me=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Gs,xe=(X.isMeshStandardMaterial?A:D).get(X.envMap||le),Ce=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Oe=!!G.morphAttributes.position,Je=!!G.morphAttributes.normal,ut=!!G.morphAttributes.color;let _t=Fi;X.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(_t=T.toneMapping);const Mt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,xt=Mt!==void 0?Mt.length:0,Ge=Ke.get(X),St=M.state.lights;if(K===!0&&(Me===!0||b!==U)){const xn=b===U&&X.id===L;qe.setState(X,b,xn)}let yt=!1;X.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==St.state.version||Ge.outputColorSpace!==me||O.isBatchedMesh&&Ge.batching===!1||!O.isBatchedMesh&&Ge.batching===!0||O.isBatchedMesh&&Ge.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ge.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ge.instancing===!1||!O.isInstancedMesh&&Ge.instancing===!0||O.isSkinnedMesh&&Ge.skinning===!1||!O.isSkinnedMesh&&Ge.skinning===!0||O.isInstancedMesh&&Ge.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ge.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ge.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ge.instancingMorph===!1&&O.morphTexture!==null||Ge.envMap!==xe||X.fog===!0&&Ge.fog!==Z||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==qe.numPlanes||Ge.numIntersection!==qe.numIntersection)||Ge.vertexAlphas!==Ce||Ge.vertexTangents!==ve||Ge.morphTargets!==Oe||Ge.morphNormals!==Je||Ge.morphColors!==ut||Ge.toneMapping!==_t||Ge.morphTargetsCount!==xt)&&(yt=!0):(yt=!0,Ge.__version=X.version);let Gt=Ge.currentProgram;yt===!0&&(Gt=Oi(X,z,O));let Tn=!1,Kt=!1,Jn=!1;const Wt=Gt.getUniforms(),Sn=Ge.uniforms;if(Xe.useProgram(Gt.program)&&(Tn=!0,Kt=!0,Jn=!0),X.id!==L&&(L=X.id,Kt=!0),Tn||U!==b){Xe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Wt.setValue(B,"projectionMatrix",b.projectionMatrix),Wt.setValue(B,"viewMatrix",b.matrixWorldInverse);const yn=Wt.map.cameraPosition;yn!==void 0&&yn.setValue(B,Ie.setFromMatrixPosition(b.matrixWorld)),Lt.logarithmicDepthBuffer&&Wt.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Wt.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),U!==b&&(U=b,Kt=!0,Jn=!0)}if(O.isSkinnedMesh){Wt.setOptional(B,O,"bindMatrix"),Wt.setOptional(B,O,"bindMatrixInverse");const xn=O.skeleton;xn&&(xn.boneTexture===null&&xn.computeBoneTexture(),Wt.setValue(B,"boneTexture",xn.boneTexture,ot))}O.isBatchedMesh&&(Wt.setOptional(B,O,"batchingTexture"),Wt.setValue(B,"batchingTexture",O._matricesTexture,ot),Wt.setOptional(B,O,"batchingIdTexture"),Wt.setValue(B,"batchingIdTexture",O._indirectTexture,ot),Wt.setOptional(B,O,"batchingColorTexture"),O._colorsTexture!==null&&Wt.setValue(B,"batchingColorTexture",O._colorsTexture,ot));const Pn=G.morphAttributes;if((Pn.position!==void 0||Pn.normal!==void 0||Pn.color!==void 0)&&it.update(O,G,Gt),(Kt||Ge.receiveShadow!==O.receiveShadow)&&(Ge.receiveShadow=O.receiveShadow,Wt.setValue(B,"receiveShadow",O.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Sn.envMap.value=xe,Sn.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&z.environment!==null&&(Sn.envMapIntensity.value=z.environmentIntensity),Sn.dfgLUT!==void 0&&(Sn.dfgLUT.value=p1()),Kt&&(Wt.setValue(B,"toneMappingExposure",T.toneMappingExposure),Ge.needsLights&&Q(Sn,Jn),Z&&X.fog===!0&&He.refreshFogUniforms(Sn,Z),He.refreshMaterialUniforms(Sn,X,fe,de,M.state.transmissionRenderTarget[b.id]),Ra.upload(B,F(Ge),Sn,ot)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Ra.upload(B,F(Ge),Sn,ot),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Wt.setValue(B,"center",O.center),Wt.setValue(B,"modelViewMatrix",O.modelViewMatrix),Wt.setValue(B,"normalMatrix",O.normalMatrix),Wt.setValue(B,"modelMatrix",O.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const xn=X.uniformsGroups;for(let yn=0,Qa=xn.length;yn<Qa;yn++){const Bi=xn[yn];Pe.update(Bi,Gt),Pe.bind(Bi,Gt)}}return Gt}function Q(b,z){b.ambientLightColor.needsUpdate=z,b.lightProbe.needsUpdate=z,b.directionalLights.needsUpdate=z,b.directionalLightShadows.needsUpdate=z,b.pointLights.needsUpdate=z,b.pointLightShadows.needsUpdate=z,b.spotLights.needsUpdate=z,b.spotLightShadows.needsUpdate=z,b.rectAreaLights.needsUpdate=z,b.hemisphereLights.needsUpdate=z}function ie(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(b,z,G){const X=Ke.get(b);X.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Ke.get(b.texture).__webglTexture=z,Ke.get(b.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,z){const G=Ke.get(b);G.__webglFramebuffer=z,G.__useDefaultFramebuffer=z===void 0};const oe=B.createFramebuffer();this.setRenderTarget=function(b,z=0,G=0){S=b,C=z,w=G;let X=!0,O=null,Z=!1,le=!1;if(b){const xe=Ke.get(b);if(xe.__useDefaultFramebuffer!==void 0)Xe.bindFramebuffer(B.FRAMEBUFFER,null),X=!1;else if(xe.__webglFramebuffer===void 0)ot.setupRenderTarget(b);else if(xe.__hasExternalTextures)ot.rebindTextures(b,Ke.get(b.texture).__webglTexture,Ke.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Oe=b.depthTexture;if(xe.__boundDepthTexture!==Oe){if(Oe!==null&&Ke.has(Oe)&&(b.width!==Oe.image.width||b.height!==Oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ot.setupDepthRenderbuffer(b)}}const Ce=b.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(le=!0);const ve=Ke.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ve[z])?O=ve[z][G]:O=ve[z],Z=!0):b.samples>0&&ot.useMultisampledRTT(b)===!1?O=Ke.get(b).__webglMultisampledFramebuffer:Array.isArray(ve)?O=ve[G]:O=ve,H.copy(b.viewport),ee.copy(b.scissor),te=b.scissorTest}else H.copy(Se).multiplyScalar(fe).floor(),ee.copy(ge).multiplyScalar(fe).floor(),te=ye;if(G!==0&&(O=oe),Xe.bindFramebuffer(B.FRAMEBUFFER,O)&&X&&Xe.drawBuffers(b,O),Xe.viewport(H),Xe.scissor(ee),Xe.setScissorTest(te),Z){const xe=Ke.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+z,xe.__webglTexture,G)}else if(le){const xe=z;for(let Ce=0;Ce<b.textures.length;Ce++){const ve=Ke.get(b.textures[Ce]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ce,ve.__webglTexture,G,xe)}}else if(b!==null&&G!==0){const xe=Ke.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,xe.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(b,z,G,X,O,Z,le,me=0){if(!(b&&b.isWebGLRenderTarget)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=Ke.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&le!==void 0&&(xe=xe[le]),xe){Xe.bindFramebuffer(B.FRAMEBUFFER,xe);try{const Ce=b.textures[me],ve=Ce.format,Oe=Ce.type;if(!Lt.textureFormatReadable(ve)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Lt.textureTypeReadable(Oe)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=b.width-X&&G>=0&&G<=b.height-O&&(b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me),B.readPixels(z,G,X,O,rt.convert(ve),rt.convert(Oe),Z))}finally{const Ce=S!==null?Ke.get(S).__webglFramebuffer:null;Xe.bindFramebuffer(B.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(b,z,G,X,O,Z,le,me=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=Ke.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&le!==void 0&&(xe=xe[le]),xe)if(z>=0&&z<=b.width-X&&G>=0&&G<=b.height-O){Xe.bindFramebuffer(B.FRAMEBUFFER,xe);const Ce=b.textures[me],ve=Ce.format,Oe=Ce.type;if(!Lt.textureFormatReadable(ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Lt.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Je),B.bufferData(B.PIXEL_PACK_BUFFER,Z.byteLength,B.STREAM_READ),b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me),B.readPixels(z,G,X,O,rt.convert(ve),rt.convert(Oe),0);const ut=S!==null?Ke.get(S).__webglFramebuffer:null;Xe.bindFramebuffer(B.FRAMEBUFFER,ut);const _t=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Ku(B,_t,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Je),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Z),B.deleteBuffer(Je),B.deleteSync(_t),Z}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,z=null,G=0){const X=Math.pow(2,-G),O=Math.floor(b.image.width*X),Z=Math.floor(b.image.height*X),le=z!==null?z.x:0,me=z!==null?z.y:0;ot.setTexture2D(b,0),B.copyTexSubImage2D(B.TEXTURE_2D,G,0,0,le,me,O,Z),Xe.unbindTexture()};const ae=B.createFramebuffer(),Ne=B.createFramebuffer();this.copyTextureToTexture=function(b,z,G=null,X=null,O=0,Z=null){Z===null&&(O!==0?(Pr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Z=O,O=0):Z=0);let le,me,xe,Ce,ve,Oe,Je,ut,_t;const Mt=b.isCompressedTexture?b.mipmaps[Z]:b.image;if(G!==null)le=G.max.x-G.min.x,me=G.max.y-G.min.y,xe=G.isBox3?G.max.z-G.min.z:1,Ce=G.min.x,ve=G.min.y,Oe=G.isBox3?G.min.z:0;else{const Pn=Math.pow(2,-O);le=Math.floor(Mt.width*Pn),me=Math.floor(Mt.height*Pn),b.isDataArrayTexture?xe=Mt.depth:b.isData3DTexture?xe=Math.floor(Mt.depth*Pn):xe=1,Ce=0,ve=0,Oe=0}X!==null?(Je=X.x,ut=X.y,_t=X.z):(Je=0,ut=0,_t=0);const xt=rt.convert(z.format),Ge=rt.convert(z.type);let St;z.isData3DTexture?(ot.setTexture3D(z,0),St=B.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(ot.setTexture2DArray(z,0),St=B.TEXTURE_2D_ARRAY):(ot.setTexture2D(z,0),St=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,z.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,z.unpackAlignment);const yt=B.getParameter(B.UNPACK_ROW_LENGTH),Gt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Tn=B.getParameter(B.UNPACK_SKIP_PIXELS),Kt=B.getParameter(B.UNPACK_SKIP_ROWS),Jn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Mt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Mt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Ce),B.pixelStorei(B.UNPACK_SKIP_ROWS,ve),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Oe);const Wt=b.isDataArrayTexture||b.isData3DTexture,Sn=z.isDataArrayTexture||z.isData3DTexture;if(b.isDepthTexture){const Pn=Ke.get(b),xn=Ke.get(z),yn=Ke.get(Pn.__renderTarget),Qa=Ke.get(xn.__renderTarget);Xe.bindFramebuffer(B.READ_FRAMEBUFFER,yn.__webglFramebuffer),Xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,Qa.__webglFramebuffer);for(let Bi=0;Bi<xe;Bi++)Wt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ke.get(b).__webglTexture,O,Oe+Bi),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ke.get(z).__webglTexture,Z,_t+Bi)),B.blitFramebuffer(Ce,ve,le,me,Je,ut,le,me,B.DEPTH_BUFFER_BIT,B.NEAREST);Xe.bindFramebuffer(B.READ_FRAMEBUFFER,null),Xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(O!==0||b.isRenderTargetTexture||Ke.has(b)){const Pn=Ke.get(b),xn=Ke.get(z);Xe.bindFramebuffer(B.READ_FRAMEBUFFER,ae),Xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ne);for(let yn=0;yn<xe;yn++)Wt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pn.__webglTexture,O,Oe+yn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Pn.__webglTexture,O),Sn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,xn.__webglTexture,Z,_t+yn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,xn.__webglTexture,Z),O!==0?B.blitFramebuffer(Ce,ve,le,me,Je,ut,le,me,B.COLOR_BUFFER_BIT,B.NEAREST):Sn?B.copyTexSubImage3D(St,Z,Je,ut,_t+yn,Ce,ve,le,me):B.copyTexSubImage2D(St,Z,Je,ut,Ce,ve,le,me);Xe.bindFramebuffer(B.READ_FRAMEBUFFER,null),Xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Sn?b.isDataTexture||b.isData3DTexture?B.texSubImage3D(St,Z,Je,ut,_t,le,me,xe,xt,Ge,Mt.data):z.isCompressedArrayTexture?B.compressedTexSubImage3D(St,Z,Je,ut,_t,le,me,xe,xt,Mt.data):B.texSubImage3D(St,Z,Je,ut,_t,le,me,xe,xt,Ge,Mt):b.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,Z,Je,ut,le,me,xt,Ge,Mt.data):b.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,Z,Je,ut,Mt.width,Mt.height,xt,Mt.data):B.texSubImage2D(B.TEXTURE_2D,Z,Je,ut,le,me,xt,Ge,Mt);B.pixelStorei(B.UNPACK_ROW_LENGTH,yt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Gt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Tn),B.pixelStorei(B.UNPACK_SKIP_ROWS,Kt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Jn),Z===0&&z.generateMipmaps&&B.generateMipmap(St),Xe.unbindTexture()},this.initRenderTarget=function(b){Ke.get(b).__webglFramebuffer===void 0&&ot.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ot.setTextureCube(b,0):b.isData3DTexture?ot.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ot.setTexture2DArray(b,0):ot.setTexture2D(b,0),Xe.unbindTexture()},this.resetState=function(){C=0,w=0,S=null,Xe.reset(),k.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}class x1 extends wd{constructor(){super();const e=new Ue;e.deleteAttribute("uv");const t=new Y({side:dn}),n=new Y,s=new mc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new V(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new on(e,n,6),o=new Vt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new V(e,Ds(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new V(e,Ds(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const u=new V(e,Ds(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);const f=new V(e,Ds(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new V(e,Ds(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new V(e,Ds(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ds(i){return new S0({color:0,emissive:16777215,emissiveIntensity:i})}const Pa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ks{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const g1=new xc(-1,1,1,-1,0,1);class v1 extends Yt{constructor(){super(),this.setAttribute("position",new Et([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Et([0,2,0,0,2,0],2))}}const _1=new v1;class gc{constructor(e){this._mesh=new V(_1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,g1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Wd extends Ks{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof hn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Dr.clone(e.uniforms),this.material=new hn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new gc(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Bh extends Ks{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class M1 extends Ks{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class S1{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Te);this._width=n.width,this._height=n.height,t=new Zn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:si}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Wd(Pa),this.copyPass.material.blending=ii,this.clock=new Od}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Bh!==void 0&&(a instanceof Bh?n=!0:a instanceof M1&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class y1 extends Ks{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new nt}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Ma={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class w1 extends Ks{constructor(){super(),this.uniforms=Dr.clone(Ma.uniforms),this.material=new M0({name:Ma.name,uniforms:this.uniforms,vertexShader:Ma.vertexShader,fragmentShader:Ma.fragmentShader}),this._fsQuad=new gc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ct.getTransfer(this._outputColorSpace)===Ft&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===td?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===nd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===id?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Yl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===rd?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ad?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===sd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const b1={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new nt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class qs extends Ks{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new nt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Zn(r,a,{type:si}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new Zn(r,a,{type:si});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new Zn(r,a,{type:si});p.texture.name="UnrealBloomPass.v"+u,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=b1;this.highPassUniforms=Dr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new hn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Dr.clone(Pa.uniforms),this.blendMaterial=new hn({uniforms:this.copyUniforms,vertexShader:Pa.vertexShader,fragmentShader:Pa.fragmentShader,blending:Xn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new nt,this._oldClearAlpha=1,this._basic=new Rt,this._fsQuad=new gc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=qs.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=qs.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new hn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new hn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}qs.BlurDirectionX=new Te(1,0);qs.BlurDirectionY=new Te(0,1);const Br=document.querySelector("#game"),an=new m1({canvas:Br,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});an.setPixelRatio(Math.min(window.devicePixelRatio,2));an.setSize(window.innerWidth,window.innerHeight);an.shadowMap.enabled=!0;an.shadowMap.type=ed;an.outputColorSpace=bt;an.toneMapping=Yl;an.toneMappingExposure=1.12;const tt=new wd;window.__steelRibbonScene=tt;tt.background=new nt(16764588);tt.fog=new oc(14719602,360,2150);const Xd=new Nl(an);Xd.compileEquirectangularShader();tt.environment=Xd.fromScene(new x1,.04).texture;tt.environmentIntensity=.58;const Fe=new Cn(69,window.innerWidth/window.innerHeight,.08,1800);tt.add(Fe);const et={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const wt=new Set,Le={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},T1=new Od,jt=new P(0,1,0),vc=new P,qd=new P,Ka=new P,rn=new Vt,Yd=.86,Ol=1.2,E1=.78,zn=.55,xi={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},cs=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Zd=Math.max(...cs.map(i=>i.width));let Mr=0,re=cs[0];const h={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};et.best.textContent=`Best score ${h.best}`;let Yn=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function ds(){const i=h.mode==="race"||h.mode==="paused"||h.mode==="result";document.body.classList.toggle("chase-mode",i&&Yn==="chase")}function A1(){Yn=Yn==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",Yn),ds(),h.message=Yn==="chase"?"Chase camera":"Cockpit camera",h.messageTimer=.9}const Sa=[];function Sr(i,e=!1){let t=Sa.find(s=>!s.busy);t||(Sa.length>=4?t=Sa[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Sa.push(t)));const n=t.node;n.classList.toggle("gold",e),n.textContent=i,n.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,n.style.top=`${33+Math.random()*9}%`,n.classList.remove("pop"),n.offsetWidth,n.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Nr(i=880,e=.16,t="triangle",n=.16){if(!$n)return;const{ctx:s}=$n,r=s.createOscillator(),a=s.createGain();r.type=t,r.frequency.setValueAtTime(i,s.currentTime),r.frequency.exponentialRampToValueAtTime(i*1.5,s.currentTime+e),a.gain.setValueAtTime(n,s.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),r.connect(a).connect(s.destination),r.start(),r.stop(s.currentTime+e+.06)}function C1(i){const e=De.clamp(i,0,1);return e*e*(3-2*e)}function R1(i,e){let t=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;e>=s&&e<=r?t+=n.rise*De.clamp((e-s)/(n.approach+n.carry),0,1):e>r&&e<=n.end?t+=n.rise:e>n.end&&e<=a&&(t+=n.rise*(1-C1((e-n.end)/n.settle)))}return t}function _c(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function $d(i,e){const{t,n}=_c(i,e),s=i.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=R1(i,n),r}function ya(i){const{x:e,z:t,n}=_c(re,i),s=$d(re,n);return new P(e,s,t)}function dt(i){const e=(i%re.length+re.length)%re.length,t=ya(e),n=ya(e+2).sub(t).normalize(),s=vc.crossVectors(jt,n).normalize(),r=ya(e-2).y,a=ya(e+2).y,o=Math.atan2(a-r,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,c=re.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:n,side:s.clone(),grade:o,bank:l,gap:c}}function Mi(i){const e=(i%re.length+re.length)%re.length;return re.gaps.some(t=>e>t.start&&e<t.end)}function kh(i){return De.clamp(i/(re.length*re.laps),0,1)}function zo(i,e,t){const n=Math.floor(i/re.length),s=Math.floor(e/re.length);for(let r=n;r<=s;r++){const a=r*re.length+t;if(i<a&&e>=a)return!0}return!1}function P1(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new Zt(t);return r.colorSpace=bt,r.wrapS=fn,r.wrapT=fn,r.repeat.set(3,1),r}function L1(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Zt(e);return s.colorSpace=bt,s.wrapS=fn,s.wrapT=fn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function D1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new Zt(e);return s.colorSpace=bt,s.wrapS=fn,s.wrapT=fn,s.repeat.set(18,18),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function I1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#263139"),n.addColorStop(.45,"#3a444a"),n.addColorStop(1,"#1b242c"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.32,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,l=10+Math.random()*56,c=t.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),c.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),c.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=c,t.beginPath(),t.ellipse(a,o,l,l*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,l=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*i,Math.random()*i,l,l)}const s=new Zt(e);return s.colorSpace=bt,s.wrapS=fn,s.wrapT=fn,s.repeat.set(9,16),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function U1(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(255, 255, 238, 1)"),n.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),n.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),n.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),n.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=n,t.fillRect(0,0,i,i);const s=new Zt(e);return s.colorSpace=bt,s}function Is(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new Zt(n);return r.colorSpace=bt,r}function F1(i=256,e=256,t="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,e),s.fillStyle="rgba(255,255,255,0.16)";for(let l=0;l<1700;l++){const c=180+Math.random()*60;s.fillStyle=`rgba(${c}, ${c}, ${c-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,i,e*.2);const a=(l,c,u,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(l,c,u,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(l,c,u,f),s.lineWidth=2,s.beginPath(),s.moveTo(l+u*.5,c+2),s.lineTo(l+u*.5,c+f-2),s.moveTo(l+2,c+f*.52),s.lineTo(l+u-2,c+f*.52),s.stroke()};a(i*.12,e*.24,i*.19,e*.2),a(i*.68,e*.25,i*.2,e*.2),a(i*.43,e*.5,i*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,e*.62,i*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new Zt(n);return o.colorSpace=bt,o.wrapS=fn,o.wrapT=fn,o.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),o}function N1(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<i+20;r+=26){t.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<i;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Zt(e);return s.colorSpace=bt,s.wrapS=fn,s.wrapT=fn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function z1(i=256,e=160){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d"),s=n.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,e),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<e;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,e-8);const r=new Zt(t);return r.colorSpace=bt,r}function Vh(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",n=!0){const s=document.createElement("canvas");s.width=n?128:384,s.height=n?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=n?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),n&&r.rotate(-Math.PI/2),r.font=`900 ${n?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(i,0,0),r.restore();const l=new Zt(s);return l.colorSpace=bt,l}const Ri=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],ka=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],Pi=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Kd(i,e,t="#4ff3ff"){const n=document.createElement("canvas");n.width=640,n.height=256;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new Zt(n);return a.colorSpace=bt,a.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),a}function Oo(i,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const n=t.getContext("2d");n.fillStyle="#151922",n.fillRect(0,0,384,128),n.fillStyle=e,n.fillRect(0,0,384,12),n.fillRect(0,116,384,12),n.strokeStyle="rgba(255,255,255,0.32)",n.lineWidth=4,n.strokeRect(12,16,360,96),n.shadowColor=e,n.shadowBlur=14,n.fillStyle="#f8fbff",n.font="900 38px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(i,192,64,330);const s=new Zt(t);return s.colorSpace=bt,s}function Bo(i=512,e=384,t="#9d4d3d",n="#2d86b7"){const s=document.createElement("canvas");s.width=i,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,i,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,i,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let l=18;l<e;l+=22){r.beginPath(),r.moveTo(0,l),r.lineTo(i,l),r.stroke();for(let c=Math.floor(l/22)%2*28;c<i;c+=56)r.beginPath(),r.moveTo(c,l-18),r.lineTo(c,l),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,i-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let l=58;l<i-48;l+=78)r.fillRect(l,e*.62,52,e*.19);r.fillStyle=n,r.fillRect(22,e*.49,i-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=n,r.shadowBlur=12,r.fillText("OPEN",i/2,e*.28,i*.76),r.shadowBlur=0;const o=new Zt(s);return o.colorSpace=bt,o.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),o}function O1(i=384,e=384){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.fillStyle="#868f96",n.fillRect(0,0,i,e);for(let r=18;r<e;r+=54)n.fillStyle="rgba(30, 38, 44, 0.62)",n.fillRect(22,r,i-44,24),n.fillStyle="rgba(215, 225, 232, 0.44)",n.fillRect(20,r+26,i-40,6);n.strokeStyle="rgba(255,255,255,0.22)",n.lineWidth=3;for(let r=0;r<i;r+=64)n.beginPath(),n.moveTo(r,0),n.lineTo(r,e),n.stroke();n.fillStyle="#ffffff",n.font="900 96px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("P",i*.5,e*.48);const s=new Zt(t);return s.colorSpace=bt,s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function B1(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=i/2,s=i/2,r=i*.43;t.clearRect(0,0,i,i),t.beginPath();for(let o=0;o<8;o++){const l=-Math.PI/8+o*Math.PI/4,c=n+Math.cos(l)*r,u=s+Math.sin(l)*r;o===0?t.moveTo(c,u):t.lineTo(c,u)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=i*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",n,s+i*.015);const a=new Zt(e);return a.colorSpace=bt,a}function We(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function es(i,e,t,n){const s=t*.5,r=n*.5;let a=We(i,e);for(const o of[-s,0,s])for(const l of[-r,0,r])a=Math.min(a,We(i+o,e+l));return a}function Ja(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:l}=xi;if(i<n-l||i>s+l||e<a-l||e>r+l)return!1;const c=Math.abs((i-n+o/2)%o-o/2),u=Math.abs((r-e+o/2)%o-o/2);return Math.min(c,u)<l*.5+t}const Ui={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Zi(i,e,t,n,s=8){const{x0:r,x1:a,zNear:o,zFar:l,pitch:c,streetW:u}=xi,f=t*.5,p=n*.5,m=u*.5+s;let g=null;const _=(x,d,v)=>{(!g||v>g.overlap)&&(g={axis:x,road:d,overlap:v})};for(let x=r;x<=a+1;x+=c){if(e+p<l-m||e-p>o+m)continue;const d=f+m-Math.abs(i-x);d>0&&_("x",Math.round(x),d)}for(let x=o;x>=l-1;x-=c){if(i+f<r-m||i-f>a+m)continue;const d=p+m-Math.abs(e-x);d>0&&_("z",Math.round(x),d)}return g}const La=[],ko=[],Jd=[];let Bl=0;function In(i,e){return Jd.push({obj:i,update:e}),i}function jd(i){Bl+=i;for(const e of Jd)e.update(Bl,i)}function Mc(){if(ko.length===0)for(let i=0;i<cs.length;i++){const e=cs[i];for(let t=0;t<e.length;t+=14){const n=_c(e,t);ko.push({x:n.x,y:$d(e,t),z:n.z,s:t,courseIndex:i})}}return ko}function Dn(i,e,t=0){let n=null,s=1/0;for(const r of Mc()){const a=i-r.x,o=e-r.z,l=Math.hypot(a,o);l<s&&(s=l,n=r)}return{clearance:s-t-Zd*.58,distance:s,nearestS:n?.s??0}}function $i(i,e,t,n,s,r=9){const a=t*.5,o=n*.5,l=Zd*.62+r;let c=null;for(const u of Mc()){const f=Math.max(Math.abs(u.x-i)-a,0),p=Math.max(Math.abs(u.z-e)-o,0),m=Math.hypot(f,p)-l;if(m>0)continue;const g=u.y-2.8,_=s-g;_<=0||(!c||_-m>c.score)&&(c={courseIndex:u.courseIndex,s:u.s,x:u.x,z:u.z,trackY:u.y,horizontalClearance:m,verticalIntrusion:_,score:_-m})}return c}function Gn(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(Dn(r.x,r.z,e).clearance>=t)return r}return null}function Hn(i,e,t,n,s){const r=Dn(e,t,n);La.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function k1(){const i=[...La].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:La.length,unsafe:La.filter(e=>e.clearance<e.margin),closest:i}}function _n(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new V(new ct(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(jt,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function V1(){const i=new b0(16757626,3097190,.66);tt.add(i);const e=new Lo(7179775,.6);e.position.set(260,145,-260),tt.add(e);const t=new Lo(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,tt.add(t);const n=new Lo(16742973,.5);n.position.set(-180,35,280),tt.add(n);const s=new mc(5556479,90,900,2);s.position.set(0,88,-920),tt.add(s)}let Li=null;function G1(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#141c3f"),t.addColorStop(.3,"#31437c"),t.addColorStop(.52,"#75689a"),t.addColorStop(.72,"#d1755a"),t.addColorStop(.86,"#f7ac68"),t.addColorStop(1,"#ffd9a4"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new Zt(i);n.colorSpace=bt,Li=new V(new Ht(1200,40,24),new Rt({map:n,side:dn,depthWrite:!1,fog:!1})),Li.renderOrder=-100,Li.frustumCulled=!1,tt.add(Li);const s=new P(-310,150,230).normalize(),r=new Rt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),a=new V(new pn(46,48),r);a.position.copy(s).multiplyScalar(1085),a.lookAt(0,0,0),Li.add(a);const o=new Rt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:Xn});for(const[l,c]of[[120,.2],[250,.085],[520,.035]]){const u=new V(new pn(l,48),o.clone());u.material.opacity=c,u.position.copy(s).multiplyScalar(1060),u.lookAt(0,0,0),Li.add(u)}}function H1(){const i=new Y({map:D1(),color:8231526,roughness:.98,metalness:.02}),e=new V(new Bt(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let g=0;g<t.count;g++){const _=t.getX(g),x=t.getY(g);t.setZ(g,We(_,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),tt.add(e);const n=new Y({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:mt});for(let g=0;g<3;g++){const _=150-g*190,x=-760-g*420,d=980,v=64+g*18,M=new V(new Bt(980,64+g*18,1,1),n.clone());M.rotation.x=-Math.PI/2,M.rotation.z=-.34+g*.03,M.position.set(_,es(_,x,d,v)-.55,x),M.renderOrder=-4,tt.add(M)}const s=[new Y({color:4352578,roughness:1}),new Y({color:6910014,roughness:1}),new Y({color:3562320,roughness:1})];for(let g=0;g<46;g++){const _=new V(new pn(28+Math.random()*90,9),s[g%s.length]);_.rotation.x=-Math.PI/2,_.rotation.z=Math.random()*Math.PI,_.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),_.scale.y=.32+Math.random()*.5,_.receiveShadow=!0,tt.add(_)}const r=new Rt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let g=0;g<32;g++){const _=new V(new pn(70+Math.random()*150,22),r.clone());_.material.opacity=.008+Math.random()*.014,_.rotation.x=-Math.PI/2,_.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),_.position.y<8&&Ui.lowFogDisks++,_.scale.y=.22+Math.random()*.26,_.renderOrder=-6,tt.add(_)}const a=[new Y({color:5991785,roughness:1}),new Y({color:7633254,roughness:1}),new Y({color:4874865,roughness:1})],o=new Y({color:15068905,roughness:.95});for(let g=0;g<52;g++){const _=78+Math.random()*180,x=52+Math.random()*115,d=Gn(M=>{const y=g/52*Math.PI*2+M*1.77,E=1380+Math.random()*820+M*18;return{x:Math.cos(y)*E,z:Math.sin(y)*E-1180}},x,480);if(!d)continue;const v=new V(new is(x,_,5+Math.floor(Math.random()*2)),a[g%a.length]);if(v.position.set(d.x,-9,d.z),v.rotation.y=Math.random()*Math.PI,v.castShadow=!0,v.receiveShadow=!0,tt.add(v),Hn("mountain",d.x,d.z,x,480),_>160){const M=new V(new is(x*.34,_*.22,5),o);M.position.copy(v.position).add(new P(0,_*.39,0)),M.rotation.y=v.rotation.y,tt.add(M)}}const l=new Y({color:4926748,roughness:.9}),c=[new Y({color:2055221,roughness:.92}),new Y({color:3109954,roughness:.95}),new Y({color:1589042,roughness:.9})];for(let g=0;g<185;g++){const _=.58+Math.random()*1.05,x=8*_,d=Gn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),x,145,40);if(!d)continue;const{x:v,z:M}=d;if(Ja(v,M,18))continue;const y=We(v,M)+.8,E=new at,T=2.2+Math.random()*3.8,R=new V(new ct(.28,.42,T,6),l);R.position.y=T/2,E.add(R);const C=2+Math.floor(Math.random()*3);for(let w=0;w<C;w++){const S=new V(new is(2.2+Math.random()*1.7-w*.22,4.8+Math.random()*2.6,7),c[(g+w)%c.length]);S.position.y=T+w*1.45+1.6,S.rotation.y=Math.random()*Math.PI,E.add(S)}E.position.set(v,y,M),E.scale.setScalar(_),tt.add(E),Hn("tree",v,M,x,145)}const u=new Y({color:16767433,roughness:.75,transparent:!0,opacity:.88,emissive:16747088,emissiveIntensity:.16});for(let g=0;g<38;g++){const _=new at,x=4+Math.floor(Math.random()*5);for(let d=0;d<x;d++){const v=new V(new Ht(12+Math.random()*18,14,8),u);v.position.set(d*18-x*9,Math.random()*8,Math.random()*12),v.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),_.add(v)}_.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),tt.add(_)}const f=[new Y({color:6186600,roughness:.68,metalness:.2}),new Y({color:7829101,roughness:.72,metalness:.18}),new Y({color:4544612,roughness:.62,metalness:.24})],p=new Y({color:2962232,roughness:.65,metalness:.35});for(let g=0;g<44;g++){const _=new at,x=20+Math.random()*95,d=8+Math.random()*18,v=8+Math.random()*18,M=new V(new Ue(d,x,v),f[g%f.length]);M.position.y=x/2,M.castShadow=!0,M.receiveShadow=!0,_.add(M);const y=Is(160,320,.28+Math.random()*.36),E=new Y({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const w of[-1,1]){const S=new V(new Bt(d*.82,x*.74),E);S.position.set(0,x*.53,w*(v/2+.08)),S.rotation.y=w<0?Math.PI:0,_.add(S)}const T=new V(new Ue(d*1.08,1.2,v*1.08),p);if(T.position.y=x+.7,_.add(T),Math.random()<.32){const w=new V(new ct(.18,.3,10+Math.random()*12,8),p);w.position.y=x+6.5,_.add(w)}const R=Math.hypot(d,v)*.65,C=Gn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),R,240,60);C&&(_.position.set(C.x,es(C.x,C.z,d,v)-.7,C.z),_.rotation.y=Math.random()*Math.PI,tt.add(_),Hn("building",C.x,C.z,R,240))}const m=new Y({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let g=0;g<18;g++){const _=new at,x=Ri[g%Ri.length],d=ka[(g*3+1)%ka.length],v=Pi[g%Pi.length],M=new Y({map:Kd(x,d,v),color:16777215,roughness:.22,metalness:.04,emissive:new nt(v),emissiveIntensity:.28}),y=22+Math.random()*18,E=8+Math.random()*4,T=new V(new Ue(y,E,.5),M);T.position.y=10,_.add(T);const R=new V(new Ue(y+1.2,.32,.75),m);R.position.y=10+E*.5+.25,_.add(R);for(const w of[-7,7]){const S=new V(new ct(.24,.32,10,8),m);S.position.set(w,5,-.2),_.add(S)}const C=Gn(()=>({x:-780+Math.random()*1560,z:-450-g*135+Math.random()*80-40}),22,175,50);C&&(_.position.set(C.x,We(C.x,C.z)+.5,C.z),_.rotation.y=-.35+Math.random()*.7,tt.add(_),Hn("billboard",C.x,C.z,22,175),Ki("roadside-billboard",C.x,_.position.y+10,C.z))}}function W1(){for(let d=0;d<3;d++){const v=[4012638,5326704,7035525][d],M=new Rt({color:v,transparent:!0,opacity:.6-d*.14,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Bt(E,360,y,1),R=T.attributes.position;for(let w=0;w<=y;w++){const S=w/y,L=(Math.sin(S*22+d*3)*.5+Math.sin(S*9+d)*.5)*70+120;R.setY(w,L),R.setY(w+y+1,-180)}R.needsUpdate=!0;const C=new V(T,M);C.position.set(0,40,-2300-d*360),tt.add(C)}const i=new Y({color:5583649,roughness:.9}),e=[new Y({color:3837754,roughness:.9}),new Y({color:7319100,roughness:.92}),new Y({color:13075258,roughness:.9}),new Y({color:15182276,roughness:.88})];for(let d=0;d<48;d++){const v=.7+Math.random()*1.2,M=9*v,y=Gn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),M,150,36);if(!y)continue;const{x:E,z:T}=y;if(Ja(E,T,18))continue;const R=We(E,T)+.6,C=new at,w=2.6+Math.random()*3.4,S=new V(new ct(.34,.5,w,6),i);S.position.y=w/2,C.add(S);const L=e[Math.floor(Math.random()*e.length)],U=3+Math.floor(Math.random()*3);for(let H=0;H<U;H++){const ee=2.4+Math.random()*1.8,te=new V(new Ht(ee,9,7),L);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,C.add(te)}C.position.set(E,R,T),C.scale.setScalar(v),tt.add(C),Hn("tree",E,T,M,150)}const t=[new Y({color:7762025,roughness:1,flatShading:!0,side:mt}),new Y({color:9077368,roughness:1,flatShading:!0,side:mt}),new Y({color:6249043,roughness:1,flatShading:!0,side:mt})];for(let d=0;d<70;d++){const v=2+Math.random()*7,M=Gn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),v,70,30);if(!M)continue;const{x:y,z:E}=M,T=new V(new fc(v,0),t[d%t.length]),R=T.geometry.attributes.position;for(let C=0;C<R.count;C++)R.setXYZ(C,R.getX(C)*(.8+Math.random()*.4),R.getY(C)*(.6+Math.random()*.4),R.getZ(C)*(.8+Math.random()*.4));R.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,We(y,E)+v*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,tt.add(T),ss.push({kind:"rock",x:y,z:E,radius:v*1.12}),Hn("rock",y,E,v,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let d=0;d<14;d++){const v=130+Math.random()*200,M=130+Math.random()*200,y=Gn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(v,M)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,R=new at,C=5+Math.floor(Math.random()*4),w=n[Math.floor(Math.random()*n.length)];for(let S=0;S<C;S++){const L=new Y({color:S%2?w:n[Math.floor(Math.random()*n.length)],roughness:1}),U=new V(new Bt(v,M/C),L);U.rotation.x=-Math.PI/2,U.position.set(0,.05,-M/2+(S+.5)*(M/C)),R.add(U)}R.position.set(E,We(E,T)+.05,T),R.rotation.y=Math.random()*Math.PI,tt.add(R),Hn("field",E,T,Math.max(v,M)*.5,40)}{const d=Gn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(d){const v=new Y({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.58,depthWrite:!1,side:mt}),M=new V(new pn(150,40),v);M.rotation.x=-Math.PI/2,M.position.set(d.x,es(d.x,d.z,450,300)+.08,d.z),M.scale.set(1.5,1,1),M.renderOrder=-4,tt.add(M),ss.push({kind:"water",x:d.x,z:d.z,radius:176,maxY:90}),Ui.waterBlockers++,Hn("lake",d.x,d.z,170,60),In(M,y=>{v.opacity=.52+Math.sin(y*.8)*.035,M.rotation.z=Math.sin(y*.2)*.02})}}const s=new Y({color:15922422,roughness:.5,metalness:.2});for(let d=0;d<9;d++){const v=d/9*Math.PI*2+.6,M=1500+Math.random()*700,y=Math.cos(v)*M,E=Math.sin(v)*M-1150,T=60+Math.random()*40,R=new at,C=new V(new ct(1.1,2.2,T,10),s);C.position.y=T/2,R.add(C);const w=new at;w.position.set(0,T,3);const S=new V(new Ue(3,3,7),s);w.add(S);const L=new at;L.position.z=3.5;for(let H=0;H<3;H++){const ee=new V(new Ue(1.1,26,.5),s);ee.position.y=13;const te=new at;te.add(ee),te.rotation.z=H/3*Math.PI*2,L.add(te)}w.add(L),R.add(w),R.position.set(y,-8,E),R.rotation.y=Math.random()*Math.PI,tt.add(R);const U=.5+Math.random()*.5;In(L,H=>{L.rotation.z=H*U})}const r=new Y({color:7041398,roughness:.6,metalness:.4}),a=new Dl({color:2764595,transparent:!0,opacity:.5});let o=null;for(let d=0;d<7;d++){const v=-1100+d*360,M=-1650-Math.sin(d*.7)*120,y=48,E=new at,T=6;for(const C of[-1,1])for(const w of[-1,1]){const S=new V(new ct(.4,.7,y,5),r);S.position.set(C*T,y/2,w*T),S.rotation.z=-C*.08,S.rotation.x=w*.08,E.add(S)}for(const C of[y*.6,y*.82,y]){const w=new V(new Ue(T*4,.8,.8),r);w.position.y=C,E.add(w)}E.position.set(v,We(v,M)-2,M),tt.add(E);const R=We(v,M)-2+y;if(o)for(const C of[-T*2,0,T*2]){const w=o.x+C,S=o.z,L=v+C,U=M,H=[],ee=12;for(let W=0;W<=ee;W++){const j=W/ee,ne=Math.sin(j*Math.PI)*6;H.push(new P(w+(L-w)*j,o.y-ne+(R-o.y)*j,S+(U-S)*j))}const te=new sh(new Yt().setFromPoints(H),a);tt.add(te)}o={x:v,y:R,z:M}}const l=new Y({color:11680302,roughness:.6,metalness:.3}),c=new Y({color:15263976,roughness:.6,metalness:.3});for(let d=0;d<5;d++){const v=Gn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!v)continue;const{x:M,z:y}=v,E=70+Math.random()*50,T=new at,R=8;for(let L=0;L<R;L++){const U=new V(new ct(.5,.7,E/R,4),L%2?c:l);U.position.y=(L+.5)*(E/R),U.rotation.y=Math.PI/4,T.add(U)}const C=new Y({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new V(new Ht(1.1,10,8),C);w.position.y=E+1,T.add(w),T.position.set(M,We(M,y),y),tt.add(T),Hn("mast",M,y,8,120);const S=Math.random()*Math.PI*2;In(w,L=>{C.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const u=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let d=0;d<6;d++){const v=new at,M=u[d%u.length],y=new Y({map:Q1(M[0],M[1]),roughness:.5,metalness:.05,emissive:new nt(M[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new V(new Ht(11,20,16),y);E.scale.y=1.25,v.add(E);const T=new V(new Ue(3.4,3,3.4),new Y({color:8014371,roughness:.9}));T.position.y=-17,v.add(T);const R=new Dl({color:3811866});for(const U of[-1,1])for(const H of[-1,1]){const ee=new sh(new Yt().setFromPoints([new P(U*1.6,-15.5,H*1.6),new P(U*7,-3,H*7)]),R);v.add(ee)}const C=-700+Math.random()*1400,w=-700-Math.random()*1200,S=280+Math.random()*100;v.position.set(C,S,w),tt.add(v);const L=Math.random()*Math.PI*2;In(v,U=>{v.position.y=S+Math.sin(U*.5+L)*6,v.position.x=C+Math.sin(U*.08+L)*90,v.rotation.z=Math.sin(U*.4+L)*.04})}const f=new Rt({color:2829104,side:mt,fog:!1});function p(){const d=new uc;return d.moveTo(0,0),d.lineTo(-2.6,1.1),d.lineTo(-2.2,.2),d.lineTo(0,.5),d.lineTo(2.2,.2),d.lineTo(2.6,1.1),d.lineTo(0,0),new V(new Ya(d),f)}for(let d=0;d<5;d++){const v=new at,M=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<M;L++){const U=p(),H=L%2?1:-1,ee=Math.ceil(L/2);U.position.set(H*ee*5,-ee*2.4,0),U.rotation.x=-Math.PI/2,v.add(U),y.push(U)}const E=150+Math.random()*120,T=-500-Math.random()*1400,R=18+Math.random()*14,C=1400,w=-700+Math.random()*1400;v.position.set(w,E,T),tt.add(v);const S=Math.random()*Math.PI*2;In(v,(L,U)=>{v.position.x+=R*U,v.position.x>C&&(v.position.x=-C);const H=Math.sin(L*6+S);for(const ee of y)ee.rotation.x=-Math.PI/2+H*.4})}{const d=new at,v=new Y({color:14673644,roughness:.4,metalness:.2}),M=new V(new Ht(20,20,16),v);M.scale.set(2.6,1,1),d.add(M);const y=new Y({color:13781835,roughness:.6});for(let w=0;w<3;w++){const S=new V(new Ue(10,9,.6),y);S.position.x=-46,S.rotation.x=w/3*Math.PI*2,d.add(S)}const E=new V(new Ue(10,4,4),new Y({color:3356475,roughness:.7}));E.position.y=-19,d.add(E);const T=new V(new Bt(40,10),new Rt({map:Sc("STEEL RIBBON"),transparent:!0,side:mt}));T.position.set(60,0,0),d.add(T);const R=900,C=240;d.position.set(0,C,-1200),tt.add(d),In(d,w=>{const S=w*.05;d.position.x=Math.cos(S)*R,d.position.z=-1200+Math.sin(S)*R*.5,d.position.y=C+Math.sin(w*.3)*8,d.rotation.y=-S+Math.PI/2})}const m=new Rt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let d=0;d<14;d++){const v=new V(new Bt(220+Math.random()*360,16+Math.random()*22),m.clone());v.material.opacity=.12+Math.random()*.18,v.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),v.rotation.x=-Math.PI/2.1,v.rotation.z=Math.random()*Math.PI,v.scale.y=.3,tt.add(v);const M=2+Math.random()*3;In(v,(y,E)=>{v.position.x+=M*E,v.position.x>1400&&(v.position.x=-1400)})}const g=new Y({color:13620954,roughness:.6,metalness:.2}),_=new Rt({map:ev(),side:mt});for(let d=0;d<4;d++){const v=Gn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!v)continue;const{x:M,z:y}=v,E=new at,T=60+Math.random()*40,R=new V(new Ue(T,1.4,26),g);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const C=new V(new Bt(T*.94,24),_);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const w of[-T/2,T/2]){const S=new V(new Ue(1.4,26,1.4),g);S.position.set(w,13,-8),E.add(S)}E.position.set(M,We(M,y),y),E.rotation.y=Math.atan2(-M,-y)+(Math.random()-.5)*.5,tt.add(E),Hn("grandstand",M,y,40,30)}const x=[16731486,16765503,16777215,11824127];for(let d=0;d<90;d++){const v=Gn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!v)continue;const{x:M,z:y}=v,E=new at,T=x[Math.floor(Math.random()*x.length)],R=new Rt({color:T,side:mt}),C=5+Math.floor(Math.random()*6);for(let w=0;w<C;w++){const S=new V(new pn(.5+Math.random()*.4,5),R);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(M,We(M,y),y),tt.add(E),Hn("flowers",M,y,3,20)}}const wn=[],Qn=[];let kl=0;const ss=[],kr=[],ni=[],Vl=[],zr=[],Ns=[],Ze={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},Va=[];function Ki(i,e,t,n){Ze.signs++,Va.length<160&&Va.push({kind:i,x:+e.toFixed(1),y:+t.toFixed(1),z:+n.toFixed(1)})}function Ci(i,e,t=1){Ze[i][e]=(Ze[i][e]||0)+t}function X1(i,e){const t=new at,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new Y({color:e,roughness:.34,metalness:.28}),a=new Y({color:new nt(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new Y({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),l=new Y({color:395016,roughness:.72,metalness:.02}),c=new Y({color:14147041,roughness:.2,metalness:.68}),u=new Y({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),f=new Y({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),p=new V(new Ue(s.w,s.h,s.l),i==="taxi"?new Y({color:16767293,roughness:.36,metalness:.24}):r);p.position.y=.95,t.add(p);const m=new V(new Ue(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),t.add(m),!s.bus){const x=new V(new Ue(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);x.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(x);for(const d of[-1,1]){const v=new V(new Ue(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);v.position.set(d*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(v)}}if(s.bed){const x=new V(new Ue(s.w*.94,.58,s.l*.38),a);x.position.set(0,1.2,1.35),t.add(x)}if(s.box){const x=new V(new Ue(s.box[0],s.box[1],s.box[2]),new Y({color:15130833,roughness:.62,metalness:.05}));x.position.set(0,1.55,1.25),t.add(x)}if(s.bus){const x=new V(new Ue(s.w+.06,.28,s.l*.86),a);x.position.set(0,1.38,0),t.add(x);for(let d=-2.8;d<=3.1;d+=1.2)for(const v of[-1,1]){const M=new V(new Ue(.08,.64,.72),o);M.position.set(v*(s.w*.5+.05),2.08,d),t.add(M)}}if(s.sign){const x=new V(new Ue(1,.24,.46),new Y({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));x.position.set(0,2.2,-.35),t.add(x)}const g=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],_=[];for(const x of g)for(const d of[-s.w*.54,s.w*.54]){const v=new V(new ct(.42,.42,.36,14),l);v.rotation.z=Math.PI/2,v.position.set(d,.45,x),t.add(v),_.push(v);const M=new V(new ct(.18,.18,.38,10),c);M.rotation.z=Math.PI/2,M.position.set(d,.45,x),t.add(M)}for(const x of[-s.w*.28,s.w*.28]){const d=new V(new Ue(.42,.2,.08),u);d.position.set(x,.95,-s.l*.52),t.add(d);const v=new V(new Ue(.36,.22,.08),f);v.position.set(x,.98,s.l*.52),t.add(v)}return t.userData={wheels:_,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(x=>{x.castShadow=!0,x.receiveShadow=!0}),t}function q1(i,e){const t=new at,n=new Y({color:12947299,roughness:.72}),s=new Y({color:i,roughness:.68}),r=new Y({color:e,roughness:.76}),a=new Y({color:1119001,roughness:.82}),o=new V(new ct(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const l=new V(new Ht(.24,10,8),n);l.position.y=2.02,t.add(l);const c=new V(new Ht(.25,8,5),a);c.scale.y=.5,c.position.y=2.17,t.add(c);const u=[];for(const f of[-.16,.16]){const p=new V(new ct(.075,.09,.78,6),r);p.position.set(f,.58,0),t.add(p),u.push({mesh:p,side:Math.sign(f),baseY:.58,amp:.28})}for(const f of[-.38,.38]){const p=new V(new ct(.055,.065,.72,6),n);p.position.set(f,1.33,0),p.rotation.z=f<0?-.18:.18,t.add(p),u.push({mesh:p,side:-Math.sign(f),baseY:1.33,amp:.34})}return t.userData.limbs=u,t.traverse(f=>{f.castShadow=!0,f.receiveShadow=!0}),t}function Y1(i,e,t){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:l,trafficControls:c=new Map}=t,u=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,g=[],_=[];for(let I=n;I<=s+1;I+=o)g.push(Math.round(I));for(let I=r;I>=a-1;I-=o)_.push(Math.round(I));_.sort((I,Se)=>I-Se);const x=g[0],d=g[g.length-1],v=_[0],M=_[_.length-1];ni.length=0,Vl.length=0,zr.length=0,Ns.length=0,Ze.traffic=0,Ze.pedestrians=0,Ze.types={},Ze.turns=0,Ze.splats=0,Ze.trafficCrashes=0,Ze.streetLights=0,Ze.trafficLights=0,Ze.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*l*.23,T=(I,Se)=>{let ge=0,ye=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-Se);K<ye&&(ye=K,ge=$)}return ge},R=(I,Se,ge)=>{const ye=I==="ns"?_:g;if(ge>0){for(const $ of ye)if($>Se+.05)return $;return ye[ye.length-1]}for(let $=ye.length-1;$>=0;$--)if(ye[$]<Se-.05)return ye[$];return ye[0]},C=I=>{const Se=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+Se,z:I.along}:{x:I.along,z:I.road+Se}},w=I=>{if(h.mode!=="roam")return null;const Se=C(I);if(Math.abs(h.roamPos.y-(We(Se.x,Se.z)+zn))>4.2)return null;const ge=I.axis==="ns"?0:I.dir,ye=I.axis==="ns"?I.dir:0,$=h.roamPos.x-Se.x,K=h.roamPos.z-Se.z,Me=$*ge+K*ye,we=I.axis==="ns"?$:K,Ie=Math.abs(we),Ye=Math.hypot($,K),Dt=I.mesh?.userData?.colliderHalfW||2,$e=I.mesh?.userData?.colliderHalfD||3;return Ye<On+Math.max(Dt,$e)*.55||Me>-1.5&&Me<$e+4.2&&Ie<On+Dt*.85?{crash:!0}:Me>0&&Me<30&&Ie<l*.36?{avoidOffset:(we>=0?-1:1)*I.maxAvoidOffset,stop:Me<13&&Ie<On+Dt*.95}:null},S=(I,Se)=>`${Math.round(I)},${Math.round(Se)}`,L=(I,Se)=>{const ge=((Se+I.phase)%15.5+15.5)%15.5;return ge<6.2?"ns":ge<7.4?"yellow-ns":ge<13.6?"ew":"yellow-ew"},U=(I,Se)=>{const ge=I.axis==="ns"?I.road:I.next,ye=I.axis==="ns"?I.next:I.road,$=S(ge,ye),K=c.get($);if(!K)return null;if(K.type==="signal"){const Me=L(K,Se),we=Me===`yellow-${I.axis}`;return Me===I.axis&&!we?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},H=(I,Se=!1)=>{const ge=I.axis,ye=I.along,$=ge==="ns"?g:_,K=I.road,Me=T($,K),we=[],Ie=ge==="ns"?v:x,Ye=ge==="ns"?M:d;!Se&&ye+I.dir*o>=Ie&&ye+I.dir*o<=Ye&&we.push({axis:ge,road:I.road,along:ye,dir:I.dir,turn:!1}),Me>0&&we.push({axis:ge==="ns"?"ew":"ns",road:ye,along:K,dir:-1,turn:!0}),Me<$.length-1&&we.push({axis:ge==="ns"?"ew":"ns",road:ye,along:K,dir:1,turn:!0}),we.length||we.push({axis:ge,road:I.road,along:ye,dir:-I.dir,turn:!0});const Dt=we.filter(Pt=>Pt.turn),$e=!Se&&Dt.length&&Math.random()<.42?y(Dt):y(we);($e.turn||$e.axis!==ge)&&Ze.turns++,I.axis=$e.axis,I.road=$e.road,I.along=$e.along,I.dir=$e.dir,I.laneOffset=E(I.dir),I.next=R(I.axis,I.along,I.dir),I.turnBlend=$e.turn?1:0,I.lastControlKey=null};for(let I=0;I<m;I++){const Se=Math.random()<.56?"ns":"ew",ge=f[I%f.length],ye=Math.random()<.5?-1:1,$=(ge==="bus"||ge==="boxTruck"?10:13)+Math.random()*9,K={axis:Se,dir:ye,road:y(Se==="ns"?g:_),laneOffset:E(ye),along:y(Se==="ns"?_:g),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:l*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:X1(ge,u[I*3%u.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=R(K.axis,K.along,K.dir),ni.push(K.collider),p.push(K),Vl.push(K),i.add(K.mesh),Ze.types[ge]=(Ze.types[ge]||0)+1}function ee(I,Se=0,ge=0){let ye=Math.max(0,I.speed*ge);const $=w(I);for($?.crash?(ou(I,h.roamPos),ye=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,ge*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),ye=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,ge*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-ge),ye=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-ge),ye=0);ye>0;){const B=U(I,Se);if(B){const ht=I.next-I.dir*(B.kind==="signal"?12:8),Lt=(ht-I.along)*I.dir;if(Lt>=-.35&&Lt<=ye+.25){I.along=ht,I.brakePulse=1,ye=0,B.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=B.key);break}}const ft=Math.abs(I.next-I.along);if(ye<ft)I.along+=I.dir*ye,ye=0;else{I.along=I.next,ye-=ft;const ht=I.next<=(I.axis==="ns"?v:x)+.05||I.next>=(I.axis==="ns"?M:d)-.05;H(I,ht)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-ge*3.2),I.turnBlend=Math.max(0,I.turnBlend-ge*3.2);const{x:K,z:Me}=C(I),we=I.axis==="ns"?0:I.dir,Ie=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,We(K,Me)+.28+Math.sin(Se*3.2+I.bob)*.035,Me);const Ye=Math.atan2(-we,-Ie),Dt=Math.atan2(Math.sin(Ye-I.mesh.rotation.y),Math.cos(Ye-I.mesh.rotation.y));I.mesh.rotation.y+=Dt*Math.min(1,ge*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(Se*22+I.bob)*.02);for(const B of I.mesh.userData.wheels||[])B.rotation.x-=I.dir*I.speed*ge*1.7;const $e=I.mesh.userData.colliderHalfD,Pt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=Me,I.collider.hw=I.axis==="ns"?Pt:$e,I.collider.hd=I.axis==="ns"?$e:Pt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of p)ee(I,0,0);Ze.traffic=p.length,In(i,(I,Se)=>{for(const ge of p)ee(ge,I,Se)});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],W=[2437188,3092787,4930093,2244434],j=[],ne=45;for(let I=0;I<ne;I++){const Se=Math.random()<.56?"ns":"ew",ge=e[Math.random()*e.length|0],ye=Math.abs(ge.z1-ge.z0)>Math.abs(ge.x1-ge.x0),$=Se==="ns"?ye?"ns":"ew":ye?"ew":"ns",K=Math.random()<.5?-1:1,Me=Math.random()<.5?-1:1,we={axis:$,dir:K,sideSign:Me,coord:y($==="ns"?g:_),along:$==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:q1(te[I%te.length],W[I*2%W.length])};I<14&&(we.axis="ns",we.coord=80,we.sideSign=I%2?-1:1,we.dir=I%3===0?1:-1,we.along=350-I*24,we.speed=1.5+I%4*.35),j.push(we),zr.push(we),i.add(we.mesh)}const de=new Rt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:mt}),fe=new Rt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:mt});for(let I=0;I<18;I++){const Se=new at,ge=new V(new pn(1,12),de.clone());ge.rotation.x=-Math.PI/2,Se.add(ge);for(let ye=0;ye<7;ye++){const $=new V(new pn(.25+Math.random()*.25,8),fe.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(ye)*(.6+Math.random()*1.2),.01,Math.sin(ye*1.7)*(.5+Math.random()*1.1)),Se.add($)}Se.visible=!1,Se.userData.life=0,Se.userData.maxLife=2.8,Se.position.y=-99,i.add(Se),Ns.push(Se)}function Ve(I,Se=0,ge=0){if(!I.active)if(I.respawn-=ge,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*ge,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<n-28&&(I.along=s+28),I.along>s+28&&(I.along=n-28));const ye=I.sideSign*(l*.66+1.2),$=I.axis==="ns"?I.coord+ye:I.along,K=I.axis==="ns"?I.along:I.coord+ye,Me=I.axis==="ns"?0:I.dir,we=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,We($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-Me,-we);const Ie=Math.sin(Se*7+I.phase);for(const Ye of I.mesh.userData.limbs||[])Ye.mesh.rotation.x=Ie*Ye.amp*Ye.side,Ye.mesh.position.y=Ye.baseY+Math.abs(Ie)*.025}for(const I of j)Ve(I,0,0);Ze.pedestrians=j.length,In(i,(I,Se)=>{for(const ge of j)Ve(ge,I,Se);for(const ge of Ns){if(!ge.visible)continue;ge.userData.life-=Se;const ye=ge.userData.life,$=De.clamp(ye/ge.userData.maxLife,0,1);ge.scale.setScalar(1+(1-$)*.35),ge.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),ye<=0&&(ge.visible=!1)}})}function Z1(){const i=new at,e=new Vt;new Si().setFromAxisAngle(new P(1,0,0),-Math.PI/2),Ze.roadDetails={},Ze.buildingArchetypes={},Ze.zones={},Ze.openerProps=0;const t=xi.x0,n=xi.x1,s=xi.zNear,r=xi.zFar,a=xi.pitch,o=xi.streetW,l=a-o,c=[],u=[];for(let F=t;F<=n+1;F+=a)c.push(Math.round(F));for(let F=s;F>=r-1;F-=a)u.push(Math.round(F));const f=[];for(const F of c)f.push({x0:F,z0:s,x1:F,z1:r});for(const F of u)f.push({x0:t,z0:F,x1:n,z1:F});function p(F,N){const q=F.x1-F.x0,Q=F.z1-F.z0,ie=Math.hypot(q,Q)||1,oe=-Q/ie,ae=q/ie;return{x0:F.x0+oe*N,z0:F.z0+ae*N,x1:F.x1+oe*N,z1:F.z1+ae*N}}function m(F,N,q){const Q=[],ie=[];for(const ae of F){const Ne=ae.x1-ae.x0,b=ae.z1-ae.z0,z=Math.hypot(Ne,b),G=Math.max(1,Math.round(z/14)),X=Ne/z,O=-(b/z),Z=X;let le=null,me=null;for(let xe=0;xe<=G;xe++){const Ce=xe/G,ve=Ce*z/68,Oe=ae.x0+Ne*Ce,Je=ae.z0+b*Ce,ut=Oe+O*N,_t=Je+Z*N,Mt=Oe-O*N,xt=Je-Z*N,Ge=[ut,We(ut,_t)+q,_t,ve],St=[Mt,We(Mt,xt)+q,xt,ve];le&&(Q.push(le[0],le[1],le[2],me[0],me[1],me[2],St[0],St[1],St[2]),Q.push(le[0],le[1],le[2],St[0],St[1],St[2],Ge[0],Ge[1],Ge[2]),ie.push(0,le[3],1,me[3],1,St[3]),ie.push(0,le[3],1,St[3],0,Ge[3])),le=Ge,me=St}}const oe=new Yt;return oe.setAttribute("position",new Et(Q,3)),oe.setAttribute("uv",new Et(ie,2)),oe.computeVertexNormals(),oe}const g=new Y({map:I1(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:mt}),_=new Y({color:11054244,roughness:.62,metalness:.04}),x=new Y({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),d=new Y({color:15855586,roughness:.48,metalness:.02,emissive:3158064,emissiveIntensity:.1}),v=new Y({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),M=new Y({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const F of f)y.push(p(F,o*.5+3.3),p(F,-13.3)),E.push(p(F,o*.5+.42),p(F,-10.42));const T=new V(m(y,2.9,.66),_);T.receiveShadow=!0,i.add(T);const R=new V(m(E,.28,.78),x);R.receiveShadow=!0,i.add(R),Ci("roadDetails","sidewalkRuns",y.length),Ci("roadDetails","curbRuns",E.length);const C=new V(m(f,o/2,.55),g);C.receiveShadow=!0,i.add(C);const w=new Y({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:mt});i.add(new V(m(f,.4,.62),w));let S=0,L=0,U=0;for(let F=1;F<c.length-1;F++)for(let N=1;N<u.length-1;N++){const q=c[F],Q=u[N];if(!(Dn(q,Q,o*.75).clearance<2))for(const ie of[-1,1]){const oe=new V(new Ue(o*.92,.07,1.15),d);oe.position.set(q,We(q,Q+ie*13)+.83,Q+ie*13),oe.receiveShadow=!0,i.add(oe);const ae=new V(new Ue(1.15,.07,o*.92),d);ae.position.set(q+ie*13,We(q+ie*13,Q)+.83,Q),ae.receiveShadow=!0,i.add(ae),S+=2}}const H=new uc;H.moveTo(0,5.8),H.lineTo(2.5,1.6),H.lineTo(.72,1.6),H.lineTo(.72,-5.2),H.lineTo(-.72,-5.2),H.lineTo(-.72,1.6),H.lineTo(-2.5,1.6),H.closePath();const ee=new Ya(H);ee.rotateX(-Math.PI/2);for(const F of f){const N=Math.abs(F.x1-F.x0)<Math.abs(F.z1-F.z0),q=Math.hypot(F.x1-F.x0,F.z1-F.z0),Q=Math.max(2,Math.floor(q/280));for(let ie=0;ie<Q;ie++){const oe=(ie+.5)/Q,ae=F.x0+(F.x1-F.x0)*oe,Ne=F.z0+(F.z1-F.z0)*oe;if(Dn(ae,Ne,4).clearance<2)continue;const b=new V(ee,v);if(b.position.set(ae,We(ae,Ne)+.86,Ne),b.rotation.y=N?0:Math.PI/2,b.scale.setScalar(.9),i.add(b),L++,ie%2===0){const z=new V(new ct(1.05,1.05,.08,24),M);z.position.set(ae+(N?3.8:0),We(ae,Ne)+.84,Ne+(N?0:3.8)),i.add(z),U++}}}Ci("roadDetails","crosswalks",S),Ci("roadDetails","laneArrows",L),Ci("roadDetails","manholes",U);const te=new Rt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:mt,blending:Xn}),W=new Rt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:mt,blending:Xn});for(let F=0;F<120;F++){const N=f[Math.random()*f.length|0],q=Math.random(),Q=N.x0+(N.x1-N.x0)*q,ie=N.z0+(N.z1-N.z0)*q;if(Dn(Q,ie,4).clearance<2)continue;const oe=new V(new pn(1,18),(F%4===0?W:te).clone());oe.rotation.x=-Math.PI/2,oe.rotation.z=Math.atan2(N.x1-N.x0,N.z1-N.z0)+(Math.random()-.5)*.35,oe.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),oe.position.set(Q+(Math.random()-.5)*o*.7,We(Q,ie)+.66,ie+(Math.random()-.5)*o*.7),i.add(oe)}const j=[Is(160,320,.5),Is(160,320,.62),Is(160,320,.42)],ne=[new Y({map:j[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:j[0],emissiveIntensity:.34}),new Y({map:j[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:j[1],emissiveIntensity:.32}),new Y({map:j[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:j[2],emissiveIntensity:.36})],de=new Ue(1,1,1),fe=[[],[],[]],Ve=[],I=[],Se=[],ge=[],ye=[],$=[],K=[],Me=[],we=[],Ie=[],Ye=[],Dt=[],$e=[],Pt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=F1(256,256,"#dbcdb8"),ft=N1(),ht=z1(),Lt=[Bo(512,384,"#944737","#2e95bf"),Bo(512,384,"#7e4d3e","#d04d65"),Bo(512,384,"#a65a35","#4fba6d")],Xe=O1();function It(F,N){Ci("zones",F),Ci("buildingArchetypes",N)}function Ke(F,N,q,Q,ie,oe="downtown"){if(Zi(F,N,q,Q))return!1;const ae=es(F,N,q,Q)-1.1;if($i(F,N,q,Q,ae+ie+2))return!1;if(e.position.set(F,ae+ie/2,N),e.quaternion.identity(),e.scale.set(q,ie,Q),e.updateMatrix(),fe[Math.random()*3|0].push(e.matrix.clone()),e.position.set(F,ae+ie+.6,N),e.scale.set(q*1.04,1.2,Q*1.04),e.updateMatrix(),Ve.push(e.matrix.clone()),ie>26){const Ne=Math.random()<.72?3790847:16730294;for(const b of[-1,1])e.position.set(F,ae+ie+1.35,N+b*(Q*.52+.12)),e.scale.set(q*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),Se.push(Ne);Math.random()<.34&&ge.push({px:F,pz:N,w:q,d:Q,h:ie,gy:ae,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const Ne=Math.random()<.5?"x":"z";ye.push({px:F,pz:N,w:q,d:Q,h:ie,gy:ae,axis:Ne,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const Ne=Math.random()<.5?"x":"z";$.push({px:F,pz:N,w:q,d:Q,h:ie,gy:ae,axis:Ne,side:Math.random()<.5?-1:1})}return wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:ae+ie+2}),It(oe,ie>64?"glassTower":"midrise"),!0}function ot(F,N,q,Q,ie,oe="residential"){if(Zi(F,N,q,Q))return!1;const ae=es(F,N,q,Q)-.55,Ne=2+Math.random()*2.4;if($i(F,N,q,Q,ae+ie+Ne+1.5,6))return!1;e.position.set(F,ae+ie/2,N),e.quaternion.identity(),e.scale.set(q,ie,Q),e.updateMatrix(),K.push(e.matrix.clone()),wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:ae+ie+Ne+1.5}),Me.push(Pt[Math.random()*Pt.length|0]),e.position.set(F,ae+ie+Ne/2,N),e.scale.set(q*.82,Ne,Q*.82),e.updateMatrix(),we.push(e.matrix.clone());const b=t+Math.round((F-t)/a)*a,z=s-Math.round((s-N)/a)*a,G=Math.abs(F-b)<Math.abs(N-z),X=G?b>F?1:-1:z>N?1:-1,O=Math.min(G?Q*.46:q*.46,8.5),Z=Math.min(ie*.58,4.6),le=Math.min(24,Math.max(8,G?Math.abs(b-F)-q*.5-o*.35:Math.abs(z-N)-Q*.5-o*.35));e.quaternion.identity(),G?(e.position.set(F+X*(q*.5+.1),ae+Z*.5+.1,N-Q*.16),e.scale.set(.24,Z,O),e.updateMatrix(),Ie.push(e.matrix.clone()),e.position.set(F+X*(q*.5+le*.5),We(F+X*(q*.5+le*.5),N)+.08,N-Q*.16),e.scale.set(le,.08,O*1.18)):(e.position.set(F-q*.16,ae+Z*.5+.1,N+X*(Q*.5+.1)),e.scale.set(O,Z,.24),e.updateMatrix(),Ie.push(e.matrix.clone()),e.position.set(F-q*.16,We(F,N+X*(Q*.5+le*.5))+.08,N+X*(Q*.5+le*.5)),e.scale.set(O*1.18,.08,le)),e.updateMatrix(),Ye.push(e.matrix.clone()),e.position.set(F,ae+.02,N),e.scale.set(q*1.58,.05,Q*1.58),e.updateMatrix(),Dt.push(e.matrix.clone());for(let me=0;me<3;me++){const xe=G?F+X*(q*.55):F+(me-1)*q*.25,Ce=G?N+(me-1)*Q*.28:N+X*(Q*.55);e.position.set(xe,We(xe,Ce)+.55,Ce);const ve=.85+Math.random()*.75;e.scale.set(ve*1.35,ve,ve*1.35),e.updateMatrix(),$e.push(e.matrix.clone())}return It(oe,"residentialHouse"),!0}function D(F,N,q,Q,ie,oe="commercial"){if(Zi(F,N,q,Q))return!1;const ae=es(F,N,q,Q)-.8;if($i(F,N,q,Q,ae+ie+2,7))return!1;const Ne=new Y({map:Xe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),b=new V(new Ue(q,ie,Q),Ne);b.position.set(F,ae+ie/2,N),b.castShadow=!0,b.receiveShadow=!0,i.add(b);const z=new Y({color:7502722,roughness:.52,metalness:.15}),G=new V(new Ue(q*.72,.32,Q*.18),z);G.position.set(F,ae+ie*.38,N+Q*.18),G.rotation.z=.13,i.add(G);const X=new Y({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let O=5;O<ie;O+=9){const Z=new V(new Ue(q*1.02,.24,.22),X);Z.position.set(F,ae+O,N+Q*.5+.14),i.add(Z)}return wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:ae+ie+2}),It(oe,"parkingGarage"),!0}function A(F,N,q,Q,ie,oe="commercial"){if(Zi(F,N,q,Q))return!1;const ae=es(F,N,q,Q)-.65;if($i(F,N,q,Q,ae+ie+2,7))return!1;const Ne=new Y({map:Lt[Math.random()*Lt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),b=new V(new Ue(q,ie,Q),Ne);b.position.set(F,ae+ie/2,N),b.castShadow=!0,b.receiveShadow=!0,i.add(b);const z=new V(new Ue(q*1.06,.9,Q*1.06),new Y({color:2237478,roughness:.56,metalness:.18}));z.position.set(F,ae+ie+.45,N),i.add(z);const G=t+Math.round((F-t)/a)*a,X=s-Math.round((s-N)/a)*a,O=Math.abs(F-G)<Math.abs(N-X),Z=O?G>F?1:-1:X>N?1:-1,le=Pi[(F+N|0)%Pi.length]||"#ffd45b",me=new Rt({map:Oo(Ri[(Math.abs(F)+Math.abs(N)|0)%Ri.length],le),transparent:!0,side:mt,depthWrite:!1}),xe=new V(new Bt(Math.min(16,O?Q*.82:q*.82),4.2),me);return O?(xe.position.set(F+Z*(q*.5+.2),ae+ie*.66,N),xe.rotation.y=Z>0?Math.PI/2:-Math.PI/2):(xe.position.set(F,ae+ie*.66,N+Z*(Q*.5+.2)),xe.rotation.y=Z<0?Math.PI:0),i.add(xe),Ki("storefront-sign",xe.position.x,xe.position.y,xe.position.z),wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:ae+ie+2}),It(oe,"brickStorefront"),!0}for(let F=t+a/2;F<=n-a/2;F+=a)for(let N=s-a/2;N>=r+a/2;N-=a){const q=Dn(F,N,l*.5).clearance;if(q<2)continue;const Q=N>40&&N<380&&F>-360&&F<360,ie=Q?"showcase":N<-920?"industrial":q>230||N<-430?"downtown":q<90?"residential":"commercial";if(q<90||Q){const oe=l/3;for(let ae=0;ae<3;ae++)for(let Ne=0;Ne<3;Ne++){if(Math.random()<.08)continue;const b=F-l/2+oe*(ae+.5)+(Math.random()-.5)*oe*.3,z=N-l/2+oe*(Ne+.5)+(Math.random()-.5)*oe*.3;if(Dn(b,z,8).clearance<1)continue;const G=oe*(.54+Math.random()*.24),X=oe*(.54+Math.random()*.24);!Q&&Math.random()<.16?Ke(b,z,G*.9,X*.9,12+Math.random()*12,ie):ot(b,z,G,X,5+Math.random()*4.5,ie)}}else{const oe=q>230,ae=oe?De.clamp(58+q*1.15,68,205):De.clamp(22+q*.3,22,66),Ne=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let b=0;b<Ne;b++){const z=15+Math.random()*Math.min(30,l*.46),G=15+Math.random()*Math.min(30,l*.46),X=F+(Math.random()-.5)*(l-z),O=N+(Math.random()-.5)*(l-G);if(Dn(X,O,Math.hypot(z,G)*.5).clearance<2)continue;const Z=(18+Math.random()*(ae-18))*(oe&&Math.random()<.24?1.35:1);!oe&&(Math.random()<.38&&A(X,O,Math.max(18,z*1.12),Math.max(18,G*1.08),12+Math.random()*14,ie)||Math.random()<.18&&D(X,O,Math.max(24,z*1.35),Math.max(24,G*1.28),24+Math.random()*24,ie))||Ke(X,O,z,G,Z,ie)}}}for(let F=0;F<3;F++){if(!fe[F].length)continue;const N=new on(de,ne[F],fe[F].length);for(let q=0;q<fe[F].length;q++)N.setMatrixAt(q,fe[F][q]);N.instanceMatrix.needsUpdate=!0,N.castShadow=!0,N.receiveShadow=!0,i.add(N)}if(Ve.length){const F=new Y({color:2896696,roughness:.62,metalness:.34}),N=new on(de,F,Ve.length);for(let q=0;q<Ve.length;q++)N.setMatrixAt(q,Ve[q]);N.instanceMatrix.needsUpdate=!0,i.add(N)}if(I.length){const F=new Y({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),N=new on(de,F,I.length);for(let q=0;q<I.length;q++)N.setMatrixAt(q,I[q]),N.setColorAt(q,new nt(Se[q]));N.instanceMatrix.needsUpdate=!0,N.instanceColor&&(N.instanceColor.needsUpdate=!0),i.add(N)}if(K.length){const F=new Y({color:4891451,roughness:.88,metalness:.02}),N=new on(de,F,Dt.length);for(let Z=0;Z<Dt.length;Z++)N.setMatrixAt(Z,Dt[Z]);N.instanceMatrix.needsUpdate=!0,N.receiveShadow=!0,i.add(N);const q=new Y({color:12040883,roughness:.48,metalness:.05}),Q=new on(de,q,Ye.length);for(let Z=0;Z<Ye.length;Z++)Q.setMatrixAt(Z,Ye[Z]);Q.instanceMatrix.needsUpdate=!0,Q.receiveShadow=!0,i.add(Q);const ie=new Y({map:B,roughness:.78,metalness:.03}),oe=new on(de,ie,K.length);for(let Z=0;Z<K.length;Z++)oe.setMatrixAt(Z,K[Z]),oe.setColorAt(Z,new nt(Me[Z]));oe.instanceMatrix.needsUpdate=!0,oe.instanceColor&&(oe.instanceColor.needsUpdate=!0),oe.castShadow=!0,oe.receiveShadow=!0,i.add(oe);const ae=new is(.72,1,4);ae.rotateY(Math.PI/4);const Ne=new Y({map:ft,color:14314033,roughness:.72}),b=new on(ae,Ne,we.length);for(let Z=0;Z<we.length;Z++)b.setMatrixAt(Z,we[Z]);b.instanceMatrix.needsUpdate=!0,b.castShadow=!0,i.add(b);const z=new Y({map:ht,roughness:.38,metalness:.18}),G=new on(de,z,Ie.length);for(let Z=0;Z<Ie.length;Z++)G.setMatrixAt(Z,Ie[Z]);G.instanceMatrix.needsUpdate=!0,i.add(G);const X=new Y({color:3112239,roughness:.88,metalness:.02}),O=new on(new Ht(1,8,6),X,$e.length);for(let Z=0;Z<$e.length;Z++)O.setMatrixAt(Z,$e[Z]);O.instanceMatrix.needsUpdate=!0,O.castShadow=!0,O.receiveShadow=!0,i.add(O)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let F=0;F<Math.min(ge.length,34);F++){const N=ge[F],q=J[F%J.length],Q=F%3===0?"#ff4fb7":F%3===1?"#4ff3ff":"#ffd45b",ie=new Rt({map:Vh(q,Q),transparent:!0,side:mt,depthWrite:!1}),oe=new V(new Bt(8,24),ie);oe.position.set(N.px,N.gy+Math.max(14,N.h*.58),N.pz+N.zSide*(N.d*.5+.25)),oe.rotation.y=N.zSide<0?Math.PI:0,i.add(oe),Ki("vertical-neon",oe.position.x,oe.position.y,oe.position.z)}for(let F=0;F<Math.min(ye.length,48);F++){const N=ye[F],q=Ri[(F*5+2)%Ri.length],Q=Pi[(F*2+1)%Pi.length],ie=new Rt({map:Oo(q,Q),transparent:!0,side:mt,depthWrite:!1}),oe=Math.min(17,(N.axis==="x"?N.d:N.w)*.82),ae=new V(new Bt(oe,4.7),ie),Ne=N.gy+Math.max(6.2,Math.min(N.h-3.5,N.h*(.28+F%3*.12)));N.axis==="x"?(ae.position.set(N.px+N.side*(N.w*.5+.22),Ne,N.pz),ae.rotation.y=N.side>0?Math.PI/2:-Math.PI/2):(ae.position.set(N.px,Ne,N.pz+N.side*(N.d*.5+.22)),ae.rotation.y=N.side<0?Math.PI:0),i.add(ae),Ki("wall-sign",ae.position.x,ae.position.y,ae.position.z)}for(let F=0;F<Math.min($.length,18);F++){const N=$[F],q=Ri[(F*7+4)%Ri.length],Q=ka[(F*5+3)%ka.length],ie=Pi[(F+3)%Pi.length],oe=new at,ae=new Y({map:Kd(q,Q,ie),color:16777215,roughness:.2,metalness:.06,emissive:new nt(ie),emissiveIntensity:.34}),Ne=Math.min(18,(N.axis==="x"?N.d:N.w)*.86),b=new V(new Ue(Ne,5.2,.42),ae);b.position.y=4.8,oe.add(b);const z=new Y({color:1053978,roughness:.44,metalness:.28});for(const G of[-Ne*.34,Ne*.34]){const X=new V(new ct(.13,.17,5,8),z);X.position.set(G,2.25,-.2),oe.add(X)}oe.position.set(N.px,N.gy+N.h+.7,N.pz),oe.rotation.y=N.axis==="x"?N.side>0?Math.PI/2:-Math.PI/2:N.side<0?Math.PI:0,i.add(oe),Ki("roof-billboard",oe.position.x,oe.position.y+4.8,oe.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ue=new Ue(2.2,1.4,4.6),se=130,He=new on(ue,new Y({roughness:.42,metalness:.36}),se);let Re=0,je=0;for(;Re<se&&je<se*6;){je++;const F=Math.random()<.5,N=F?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),q=F?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Dn(N,q,4).clearance<2)continue;const Q=We(N,q)+.7;e.position.set(N,Q,q),e.quaternion.setFromAxisAngle(jt,F?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),He.setMatrixAt(Re,e.matrix),He.setColorAt(Re,new nt(ce[Math.random()*ce.length|0])),Re++}He.count=Re,He.instanceMatrix.needsUpdate=!0,He.instanceColor&&(He.instanceColor.needsUpdate=!0),i.add(He);const qe=new Map,pe=(F,N)=>`${Math.round(F)},${Math.round(N)}`;function be(F,N){const q=((N+F.phase)%15.5+15.5)%15.5;return q<6.2?{green:"ns",yellow:null}:q<7.4?{green:null,yellow:"ns"}:q<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function it(){const F=[],N=new Y({color:1120028,roughness:.38,metalness:.62}),q=new Y({color:1382685,roughness:.34,metalness:.38}),Q=B1(),ie=new Rt({map:Q,transparent:!0,side:mt}),oe=new Y({color:5050642,roughness:.48,metalness:.12}),ae=(O,Z)=>new Y({color:O,roughness:.16,metalness:.02,emissive:Z,emissiveIntensity:.2}),Ne=(O,Z,le,me,xe,Ce)=>{const ve=new at,Oe=new V(new Ue(1.15,2.85,.75),q);ve.add(Oe);const Je=ae(16724008,16717836),ut=ae(16767053,16757276),_t=ae(4521842,1693789),Mt=[Je,ut,_t];for(let xt=0;xt<3;xt++){const Ge=new V(new Ht(.28,12,8),Mt[xt]);Ge.position.set(0,.78-xt*.78,-.42),ve.add(Ge)}ve.position.set(le,me,xe),ve.rotation.y=Ce,O.add(ve),F.push({axis:Z,red:Je,yellow:ut,green:_t,control:O.userData.control})},b=(O,Z,le)=>{const me=pe(O,Z),xe={type:"signal",x:O,z:Z,phase:le%4*2.1};qe.set(me,xe);const Ce=We(O,Z),ve=new at;ve.userData.control=xe;const Oe=o*.72,Je=o*.72,ut=new V(new ct(.18,.24,8.2,8),N);ut.position.set(Oe,4.1,Je),ve.add(ut);const _t=new V(new Ue(o*1.65,.2,.2),N);_t.position.set(Oe-o*.72,8,Je),ve.add(_t);const Mt=new V(new Ue(.2,.2,o*1.65),N);Mt.position.set(Oe,7.55,Je-o*.72),ve.add(Mt),Ne(ve,"ns",Oe-o*1.24,7.52,Je,0),Ne(ve,"ns",Oe-o*.18,7.52,-Je,Math.PI),Ne(ve,"ew",Oe,7.05,Je-o*1.24,Math.PI/2),Ne(ve,"ew",-Oe,7.05,Je-o*.18,-Math.PI/2),ve.position.set(O,Ce,Z),ve.traverse(xt=>{xt.castShadow=!0,xt.receiveShadow=!0}),i.add(ve)},z=(O,Z,le)=>{const me=pe(O,Z);qe.set(me,{type:"stop",x:O,z:Z,phase:0});const xe=We(O,Z),Ce=new at,ve=le%2?-1:1,Oe=le%3?1:-1,Je=new V(new ct(.12,.16,4.2,7),N);Je.position.y=2.1,Ce.add(Je);const ut=new V(new pn(1.04,8),oe);ut.position.y=4.55,ut.rotation.y=Math.PI,Ce.add(ut);const _t=new V(new Bt(2.05,2.05),ie);_t.position.set(0,4.55,-.04),Ce.add(_t),Ce.position.set(O+ve*o*.74,xe,Z+Oe*o*.74),Ce.rotation.y=Math.atan2(ve,Oe),Ce.traverse(Mt=>{Mt.castShadow=!0,Mt.receiveShadow=!0}),i.add(Ce)};let G=0,X=0;for(let O=1;O<c.length-1;O++)for(let Z=1;Z<u.length-1;Z++){const le=c[O],me=u[Z];if(Dn(le,me,o*.9).clearance<2)continue;const xe=Math.abs(le-80)<=a*1.05&&me<=s&&me>=-560,Ce=me<-260&&me>-1180&&(O+Z)%4===0,ve=me>-360&&(O+Z)%2===0;xe&&Z%2===0||Ce?b(le,me,G++):(ve||(O+Z)%5===0&&me>-820)&&z(le,me,X++)}return In(i,O=>{for(const Z of F){const le=be(Z.control,O);Z.red.emissiveIntensity=le.green===Z.axis||le.yellow===Z.axis?.12:2.3,Z.yellow.emissiveIntensity=le.yellow===Z.axis?2.6:.12,Z.green.emissiveIntensity=le.green===Z.axis?2.6:.1}}),{trafficLights:G,stopSigns:X}}const Qe=it();Y1(i,f,{X0:t,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:qe}),Ze.trafficLights=Qe.trafficLights,Ze.stopSigns=Qe.stopSigns;const Be=new ct(.12,.16,7.2,7),rt=new Ht(.46,10,8),k=new Bt(2.8,13),Pe=new Y({color:1581353,roughness:.42,metalness:.68}),Ee=new Y({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Ae=new Rt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:mt,blending:Xn}),_e=U1(),he=new bd({map:_e,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:Xn}),ke=132,st=new on(Be,Pe,ke),Ut=new on(rt,Ee,ke),At=new on(k,Ae,ke);let $t=0;for(let F=0;F<ke*2&&$t<ke;F++){const N=Math.random()<.5,q=N?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),Q=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Dn(q,Q,3).clearance<2)continue;const ie=We(q,Q);e.quaternion.identity(),e.position.set(q,ie+3.6,Q),e.scale.set(1,1,1),e.updateMatrix(),st.setMatrixAt($t,e.matrix),e.position.set(q,ie+7.5,Q),e.updateMatrix(),Ut.setMatrixAt($t,e.matrix);const oe=new jc(he);oe.position.set(q,ie+7.5,Q);const ae=6.2+Math.random()*2.4;oe.scale.set(ae,ae,1),i.add(oe),Ui.streetGlowSprites++,e.position.set(q,ie+.72,Q),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),At.setMatrixAt($t,e.matrix),$t++}st.count=$t,Ut.count=$t,At.count=$t,st.instanceMatrix.needsUpdate=!0,Ut.instanceMatrix.needsUpdate=!0,At.instanceMatrix.needsUpdate=!0,i.add(st,Ut,At),Ze.streetLights=$t,i.add(new V(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),i.add(new V(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),i.add(new V(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),x)),i.add(new V(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),g));const bn=new Y({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let F=330;F>=-700;F-=32){const N=new V(new Ue(1.15,.09,13.5),bn);N.position.set(80,We(80,F)+.9,F),N.receiveShadow=!0,i.add(N)}for(const F of[286,156,26,-104])for(let N=0;N<7;N++){const q=new V(new Ue(2,.08,11.8),d),Q=71.2+N*2.95;q.position.set(Q,We(Q,F)+.91,F),q.receiveShadow=!0,i.add(q),Ci("roadDetails","openerCrosswalkStripes")}function Vr(F,N,q,Q=!1){const ie=We(F,N),oe=new at,ae=new V(new ct(.16,.22,9.5,8),Pe);ae.position.y=4.75,oe.add(ae);const Ne=new V(new Ue(3.8,.22,.22),Pe);Ne.position.set(q*1.75,8.95,0),oe.add(Ne);const b=new V(new Ht(.62,12,8),Ee);b.position.set(q*3.6,8.82,0),oe.add(b);const z=new jc(he.clone());z.position.copy(b.position),z.material.opacity=.78+Math.random()*.12,z.scale.set(8.8,8.8,1),oe.add(z),Ui.streetGlowSprites++;const G=new V(new Bt(3.2,15),Ae.clone());if(G.position.set(q*2.8,.72,0),G.rotation.x=-Math.PI/2,G.scale.y=.7+Math.random()*.35,oe.add(G),Q){const X=new mc(16762474,4.4,66,2);X.position.copy(b.position),oe.add(X)}oe.position.set(F,ie,N),i.add(oe),Ze.streetLights++}let js=0;for(let F=340;F>=-700;F-=118)Vr(63,F,1,js++%3===0),Vr(97,F-42,-1,js++%3===0);function li(F,N,q,Q,ie=6010942){const oe=new Y({color:ie,roughness:.92,metalness:.01}),ae=new V(new Ue(q,.08,Q),oe);return ae.position.set(F,We(F,N)+.06,N),ae.receiveShadow=!0,i.add(ae),Ze.openerProps++,ae}function mn(F,N,q=1){const Q=We(F,N),ie=new at,oe=new V(new ct(.35,.55,5.5,8),new Y({color:6832160,roughness:.88}));oe.position.y=2.75,ie.add(oe);const ae=new Y({color:6065982,roughness:.86}),Ne=new Y({color:3959601,roughness:.9}),b=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let z=0;z<b.length;z++){const[G,X,O,Z]=b[z],le=new V(new Ht(Z,12,8),z%2?Ne:ae);le.position.set(G,X,O),le.scale.y=.78,le.castShadow=!0,ie.add(le)}return ie.position.set(F,Q,N),ie.scale.setScalar(q),i.add(ie),ss.push({kind:"tree",x:F,z:N,radius:3.4*q,maxY:Q+11*q}),Ze.openerProps++,ie}function us(F,N,q=0){const Q=new at,ie=new Y({color:10970418,roughness:.64,metalness:.04}),oe=new Y({color:1910317,roughness:.46,metalness:.5});for(const ae of[1.05,1.55]){const Ne=new V(new Ue(6.8,.22,.44),ie);Ne.position.y=ae,Q.add(Ne)}for(const ae of[-2.7,2.7]){const Ne=new V(new Ue(.22,1.2,.35),oe);Ne.position.set(ae,.62,0),Q.add(Ne)}Q.position.set(F,We(F,N),N),Q.rotation.y=q,i.add(Q),Ze.openerProps++}function Gr(F,N){const q=new Y({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),Q=new at,ie=new V(new ct(.34,.42,1.25,12),q);ie.position.y=.65,Q.add(ie);const oe=new V(new Ht(.42,12,8),q);oe.position.y=1.32,Q.add(oe);const ae=new V(new ct(.16,.16,1.1,10),q);ae.rotation.z=Math.PI/2,ae.position.y=.9,Q.add(ae),Q.position.set(F,We(F,N),N),i.add(Q),Ze.openerProps++}function Hr(F,N,q=0){const Q=new at,ie=new Y({color:1185821,roughness:.36,metalness:.68}),oe=new Y({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),ae=new Y({color:2370611,roughness:.42,metalness:.32}),Ne=new V(new Ue(8.5,.35,3.2),ae);Ne.position.y=4.2,Q.add(Ne);for(const G of[-3.8,3.8]){const X=new V(new ct(.09,.11,4.1,7),ie);X.position.set(G,2.05,-1.25),Q.add(X)}const b=new V(new Ue(8,2.8,.08),oe);b.position.set(0,2.2,1.35),Q.add(b);const z=new V(new Bt(2.3,2.8),new Rt({map:Oo("BUS","#4ff3ff"),transparent:!0,side:mt}));z.position.set(-2.4,2.2,1.42),Q.add(z),Q.position.set(F,We(F,N),N),Q.rotation.y=q,i.add(Q),Ki("bus-shelter-ad",F,We(F,N)+2.2,N),Ze.openerProps++}function en(F,N,q,Q,ie,oe,ae,Ne=null,b=0){if(Zi(F,N,q,Q,12))return!1;const z=We(F,N)-.45;if($i(F,N,q,Q,z+ie+2))return!1;const G=F<80?1:-1,X=new Y({map:Is(192,512,ae),color:oe,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),O=new V(new Ue(q,ie,Q),X);O.position.set(F,z+ie/2,N),O.castShadow=!1,O.receiveShadow=!0,i.add(O);const Z=new Y({map:Is(220,620,Math.min(.86,ae+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:mt}),le=new V(new Bt(Q*.78,ie*.74),Z);le.position.set(F+G*(q/2+.09),z+ie*.54,N),le.rotation.y=G>0?Math.PI/2:-Math.PI/2,i.add(le);for(const Ce of[-1,1]){const ve=new V(new Bt(q*.82,ie*.72),Z.clone());ve.position.set(F,z+ie*.55,N+Ce*(Q/2+.1)),ve.rotation.y=Ce>0?0:Math.PI,i.add(ve)}const me=new V(new Ue(q*1.04,1.2,Q*1.04),new Y({color:1778733,roughness:.34,metalness:.38}));me.position.set(F,z+ie+.7,N),i.add(me);const xe=new Y({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ce of[-1,1]){const ve=new V(new Ue(q*1.1,.22,.18),xe);ve.position.set(F,z+ie+1.4,N+Ce*(Q/2+.18)),i.add(ve)}if(Ne&&b){const Ce=new Rt({map:Vh(Ne,Ne==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:mt,depthWrite:!1}),ve=new V(new Bt(7.5,24),Ce);ve.position.set(F+b*(q/2+.3),z+Math.min(ie-8,ie*.58),N),ve.rotation.y=b>0?Math.PI/2:-Math.PI/2,i.add(ve),Ki("showcase-neon",ve.position.x,ve.position.y,ve.position.z)}return wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:z+ie+2}),It("showcase","glassTower"),!0}function Wr(F,N,q,Q=3.2){const ie=F*.5+Q,oe=N*.5+Q,ae=Math.max(2,Math.abs(ie-oe)*.72),Ne=F>=N?[-ie,0,-oe,ie,0,-oe,ae,q,0,-ie,0,-oe,ae,q,0,-ae,q,0,ie,0,-oe,ie,0,oe,ae,q,0,ie,0,oe,-ie,0,oe,-ae,q,0,ie,0,oe,ae,q,0,-ae,q,0,-ie,0,oe,-ie,0,-oe,-ae,q,0]:[-ie,0,-oe,ie,0,-oe,0,q,-ae,ie,0,-oe,ie,0,oe,0,q,ae,ie,0,-oe,0,q,ae,0,q,-ae,ie,0,oe,-ie,0,oe,0,q,ae,-ie,0,oe,-ie,0,-oe,0,q,-ae,-ie,0,oe,0,q,-ae,0,q,ae],b=new Yt;return b.setAttribute("position",new Et(Ne,3)),b.computeVertexNormals(),b}function Oi(F,N,q,Q,ie,oe,ae={}){if(Zi(F,N,q,Q,12))return!1;const Ne=We(F,N)-.3;if($i(F,N,q,Q,Ne+ie+(ae.roofH??8.2)+1,6))return!1;const b=ae.frontZ??-1,z=new Y({map:B,color:ae.wallColor??14734788,roughness:.68,metalness:.03}),G=new V(new Ue(q,ie,Q),z);G.position.set(F,Ne+ie/2,N),G.castShadow=!0,G.receiveShadow=!0,i.add(G);const X=new Y({map:ft,color:oe,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),O=ae.roofH??8.2,Z=new V(Wr(q,Q,O),X);Z.position.set(F,Ne+ie,N),Z.castShadow=!0,Z.receiveShadow=!0,i.add(Z);const le=new Y({color:15985112,roughness:.42,metalness:.05}),me=new V(new Ue(q+7,.42,1.2),le);me.position.set(F,Ne+ie+.12,N+b*(Q*.5+1.4)),i.add(me);const xe=me.clone();xe.position.z=N-b*(Q*.5+1.4),i.add(xe);const Ce=Math.min(18,q*.38),ve=new V(new Ue(Ce,ie*.55,.32),new Y({map:ht,roughness:.34,metalness:.2}));ve.position.set(F+q*.18,Ne+ie*.33,N+b*(Q*.5+.22)),i.add(ve);const Oe=new V(new Ue(5.2,7.2,.28),new Y({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Oe.position.set(F-q*.25,Ne+3.7,N+b*(Q/2+.24)),i.add(Oe);const Je=new Y({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),ut=new Y({color:3353638,roughness:.38});for(const Gt of[-q*.36,-q*.05,q*.38]){if(Math.abs(Gt-q*.18)<Ce*.45)continue;const Tn=new V(new Ue(6.2,4.8,.26),ut);Tn.position.set(F+Gt,Ne+ie*.58,N+b*(Q*.5+.28)),i.add(Tn);const Kt=new V(new Ue(4.8,3.4,.3),Je);Kt.position.copy(Tn.position),Kt.position.z+=b*.04,i.add(Kt)}const _t=new Y({color:12370619,roughness:.44,metalness:.04}),Mt=new V(new Ue(Ce*1.18,.12,34),_t);Mt.position.set(F+q*.18,We(F+q*.18,N+b*(Q*.5+17))+.11,N+b*(Q*.5+17)),i.add(Mt);const xt=new Y({color:5679925,roughness:.86,metalness:.01}),Ge=new V(new Ue(q+10,.08,Q+12),xt);Ge.position.set(F,We(F,N)-.18,N),Ge.receiveShadow=!0,i.add(Ge),Ge.renderOrder=-1;const St=new Y({color:3042609,roughness:.84}),yt=[new Y({color:16766544,roughness:.58}),new Y({color:16738974,roughness:.58}),new Y({color:16314584,roughness:.58})];for(let Gt=0;Gt<9;Gt++){const Tn=F-q*.44+Gt*(q*.11),Kt=N+b*(Q*.5+2.2+Gt%2*1.5),Jn=new V(new Ht(1.35+Gt%3*.22,10,7),Gt%4===0?yt[Gt%yt.length]:St);Jn.position.set(Tn,We(Tn,Kt)+.95,Kt),Jn.scale.y=.72,Jn.castShadow=!0,i.add(Jn)}return wn.push({x:F,z:N,hw:q*.5,hd:Q*.5,maxY:Ne+ie+5}),It("showcase","lowStorefront"),!0}return li(45,318,36,84,6404169),li(116,318,36,84,6074179),li(44,188,34,84,6798662),li(118,188,36,84,5941822),li(43,60,34,82,5679164),li(118,60,36,82,6864197),en(18,315,70,54,154,2311775,.72,"HOTEL",1),en(17,185,72,58,188,1522779,.78,null,0),en(31,55,44,56,138,2840688,.66,"OPEN",1),en(24,-75,52,64,182,1913933,.7,null,0),en(145,315,68,54,116,2776440,.72,null,0),en(146,185,70,58,146,2314602,.76,null,0),en(142,55,42,56,156,1590364,.68,"CAFE",-1),en(134,-75,48,64,114,3688540,.62,null,0),en(-70,315,52,52,146,2112085,.68,null,0),en(228,185,48,58,148,3235186,.66,null,0),en(-78,185,48,56,134,2181730,.68,null,0),en(236,315,44,54,104,3104884,.66,null,0),Oi(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Oi(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),en(-48,-360,54,56,148,2439765,.58,null,0),en(172,-430,50,56,132,3817032,.66,"OPEN",-1),mn(112,238,1.35),mn(104,231,1.05),mn(121,247,1.15),us(112,227,0),mn(50,292,1.2),mn(111,316,.95),mn(48,132,.9),mn(116,102,1.05),us(47,248,Math.PI/2),Gr(57,226),Hr(111,260,-Math.PI/2),tt.add(i),i}function Qd(i,{dirSel:e=1,rampType:t="on",merge:n=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=dt(n),l=new P(o.tangent.x,0,o.tangent.z).normalize(),c=new P().crossVectors(jt,l).normalize(),u=o.p.clone().addScaledVector(o.side,e*re.width*.5),f=t==="off"?1:-1,p=u.x+l.x*s*f+c.x*e*r,m=u.z+l.z*s*f+c.z*e*r,g=new P(p,We(p,m)+.4,m),_=t==="off"?u:g,x=t==="off"?g:u,d=26,v=[];for(let W=0;W<=d;W++){const j=W/d,ne=j*j*(3-2*j),de=t==="off"?1-(1-j)*(1-j):ne;v.push(new P(De.lerp(_.x,x.x,j),De.lerp(_.y,x.y,de),De.lerp(_.z,x.z,j)))}const M=7.4,y=new P,E=new P,T=[],R=[];for(let W=0;W<=d;W++)E.subVectors(v[Math.min(d,W+1)],v[Math.max(0,W-1)]),E.y=0,E.normalize(),y.crossVectors(jt,E).normalize(),T.push(v[W].clone().addScaledVector(y,-M)),R.push(v[W].clone().addScaledVector(y,M));const C={kind:"ramp",rampType:t,halfW:M,dirSel:e,mergeS:n,exitS:n,points:v.map(W=>W.clone()),segments:[]};for(let W=0;W<d;W++){const j=v[W],ne=v[W+1],de=ne.x-j.x,fe=ne.z-j.z,Ve=Math.max(1e-4,de*de+fe*fe);C.segments.push({a:j.clone(),b:ne.clone(),abx:de,abz:fe,lenSq:Ve,u0:W/d,u1:(W+1)/d})}kr.push(C);const w=[];for(let W=0;W<d;W++){const j=T[W],ne=R[W],de=T[W+1],fe=R[W+1];w.push(j.x,j.y,j.z,ne.x,ne.y,ne.z,fe.x,fe.y,fe.z),w.push(j.x,j.y,j.z,fe.x,fe.y,fe.z,de.x,de.y,de.z)}const S=new Yt;S.setAttribute("position",new Et(w,3)),S.computeVertexNormals();const L=new Y({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:mt});i.add(new V(S,L));const U=new Y({color:12107972,roughness:.5,metalness:.4});for(let W=0;W<d;W++)_n(i,T[W].clone().setY(T[W].y+1),T[W+1].clone().setY(T[W+1].y+1),.16,U),_n(i,R[W].clone().setY(R[W].y+1),R[W+1].clone().setY(R[W+1].y+1),.16,U);const H=new Y({color:7173241,roughness:.82});for(let W=3;W<d;W+=3){const j=v[W],ne=We(j.x,j.z),de=j.y-ne;if(de<3)continue;const fe=new V(new ct(.9,1.15,de,8),H);fe.position.set(j.x,ne+de/2,j.z),i.add(fe),Qn.push({x:j.x,z:j.z,hw:1.3,hd:1.3,maxY:j.y-.9})}const ee=new Rt({map:Sc(a),transparent:!0,side:mt}),te=new V(new Bt(12,3),ee);te.position.copy(t==="off"?u:g).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-l.x,-l.z)+(t==="off"?Math.PI:0),i.add(te);for(const W of[-1,1]){const j=new V(new ct(.2,.26,6,6),H),ne=t==="off"?u:g;j.position.set(ne.x+c.x*W*5.4,ne.y+3,ne.z+c.z*W*5.4),i.add(j)}}function $1(i,e=1){Qd(i,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function K1(i,e=-1){Qd(i,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function J1(){const i=new at,e=[],t=new nt(14170671),n=new nt(15922680),s=new Y({color:3883336,roughness:.6,metalness:.3}),r=new Rt({map:j1(),transparent:!0,side:mt}),a=new Y({color:4926748,roughness:.9}),o=[new Y({color:2055221,roughness:.92}),new Y({color:3109954,roughness:.95}),new Y({color:2583370,roughness:.9})],l=new Y({color:7040883,roughness:.95,side:mt}),c=12,u=[],f=[];let p=0;for(let g=0;g<re.length;g+=c){if(Mi(g+c*.5)){p++;continue}const _=dt(g),x=dt(g+c),d=_.p.clone().add(x.p).multiplyScalar(.5),{sideways:v,normal:M,q:y}=gi(_,x);for(const E of[-1,1]){const T=d.clone().addScaledVector(v,E*re.width*.5).addScaledVector(M,.5);u.push(T),f.push(y),e.push(p%2===0?t:n)}if(p%16===8){const E=(p>>4)%2?1:-1,T=d.clone().addScaledVector(v,E*re.width*.52).addScaledVector(M,.4),R=new at,C=new V(new Bt(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,R.add(C);const w=new ct(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new V(w,s);L.position.set(S,1.7,0),R.add(L)}R.position.copy(T),R.quaternion.copy(y),i.add(R)}p++}for(let g=0;g<re.length;g+=16){const _=dt(g),x=1+(Math.random()<.5?1:0);for(let d=0;d<x;d++){const v=Math.random()<.5?-1:1,M=re.width/2+12+Math.random()*78,y=_.p.x+_.side.x*M*v+(Math.random()-.5)*16,E=_.p.z+_.side.z*M*v+(Math.random()-.5)*16;if(Ja(y,E,18))continue;const T=We(y,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,C=new at,w=2.4+Math.random()*4.2,S=new V(new ct(.26,.42,w,6),a);S.position.y=w/2,C.add(S);const L=2+Math.floor(Math.random()*3);for(let U=0;U<L;U++){const H=new V(new is(2.4+Math.random()*1.6-U*.2,4.6+Math.random()*2.4,7),o[(d+U+g)%o.length]);H.position.y=w+U*1.4+1.5,H.rotation.y=Math.random()*Math.PI,C.add(H)}C.position.set(y,T+.6,E),C.scale.setScalar(R),i.add(C)}else{const R=1.4+Math.random()*3.6,C=new V(new cc(R,0),l);C.position.set(y,T+R*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),i.add(C),Qn.push({kind:"rock",x:y,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const _=re.length*g/3+6;if(Mi(_))continue;const x=dt(_),d=dt(_+c),v=x.p.clone().add(d.p).multiplyScalar(.5),{q:M}=gi(x,d),y=re.width*.5+1.2,E=9,T=new at,R=new ct(.4,.55,E,7);for(const U of[-1,1]){const H=new V(R,s);H.position.set(U*y,E/2,0),T.add(H)}const C=y*2,w=new V(new Ue(C,1.1,1.1),s);w.position.y=E,T.add(w);const S=new Rt({map:Sc(m[g]),transparent:!0,side:mt}),L=new V(new Bt(C*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(v),T.quaternion.copy(M),i.add(T)}if(u.length){const g=new ct(.18,.24,3,6);g.translate(0,1.5,0);const _=new Ht(.34,8,6);_.translate(0,3.2,0);const x=new Y({color:10134440,roughness:.7,metalness:.2}),d=new Y({roughness:.55}),v=new on(g,x,u.length),M=new on(_,d,u.length),y=new Vt;for(let E=0;E<u.length;E++)y.position.copy(u[E]),y.quaternion.copy(f[E]),y.updateMatrix(),v.setMatrixAt(E,y.matrix),M.setMatrixAt(E,y.matrix),M.setColorAt(E,e[E]);v.instanceMatrix.needsUpdate=!0,M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0),i.add(v),i.add(M)}return $1(i),K1(i),tt.add(i),i}function j1(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new Zt(i);return t.colorSpace=bt,t}function Sc(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new Zt(e);return n.colorSpace=bt,n}function Q1(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let l=0;l<a;l++)n.fillStyle=l%2?s:r,n.fillRect(l/a*t.width,0,t.width/a+1,t.height);const o=new Zt(t);return o.colorSpace=bt,o}function ev(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new Zt(i);return n.colorSpace=bt,n.wrapS=fn,n.repeat.set(3,1),n}function Ot(i,e,t,n,s){const r=new V(new Ue(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function gi(i,e){const t=e.p.clone().sub(i.p).normalize(),n=vc.crossVectors(jt,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const l=new Si().setFromAxisAngle(t,r);n.applyQuaternion(l),s.applyQuaternion(l)}const a=new Tt().makeBasis(n,s,t),o=new Si().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function Gh(i,e,t,n){const s=[],r=[],a=[],o=re.width*.47;let l=0;for(let f=e;f<=t;f+=8){const p=dt(Math.min(f,t)),m=gi(p,dt(p.s+2)),g=Math.sin(f*.018)*.04,_=p.p.clone().addScaledVector(m.sideways,-o).addScaledVector(m.normal,.46+g),x=p.p.clone().addScaledVector(m.sideways,o).addScaledVector(m.normal,.46-g);s.push(_.x,_.y,_.z,x.x,x.y,x.z);const d=(f-e)/64;if(r.push(0,d,1,d),l>0){const v=(l-1)*2,M=l*2;a.push(v,v+1,M,v+1,M+1,M)}l++}const c=new Yt;c.setAttribute("position",new Et(s,3)),c.setAttribute("uv",new Et(r,2)),c.setIndex(a),c.computeVertexNormals();const u=new V(c,n);u.receiveShadow=!0,i.add(u)}function tv(i,e){let t=0;for(const n of re.gaps)Gh(i,t,Math.max(t,n.start-4),e),t=n.end+4;Gh(i,t,re.length,e)}function nv(i,e,t){const n=dt(e.s+2),{normal:s,q:r}=gi(e,n),a=new at;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new V(new Ue(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const l=new V(new Ue(.55,.12,5.2),t);l.position.set(1.25,0,0),l.rotation.y=.62,a.add(l);const c=new V(new Ue(.42,.1,3.8),t);c.position.set(0,.01,-1.9),a.add(c),i.add(a)}function iv(){const i=new at;tt.add(i),kl=0;const e=new Y({color:12171149,roughness:.72,metalness:.08}),t=new Y({color:9869942,roughness:.78,metalness:.05}),n=new Y({color:15255629,roughness:.28,metalness:.72}),s=new Y({color:8204328,roughness:.3,metalness:.85}),r=new Y({color:6120040,roughness:.5,metalness:.6}),a=new Y({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new Y({color:14270570,roughness:.35,metalness:.65}),l=new Y({color:2435884,roughness:.48,metalness:.62}),c=new Y({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),u=new Y({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new Y({color:4935486,roughness:.92,metalness:.04}),p=new Y({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new Y({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new Y({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),_=new Y({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),x=new Y({color:15919561,roughness:.82,metalness:.02});new Y({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const d=new Y({map:L1(),roughness:.74,metalness:.08}),v=new Rt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),M=12;tv(i,d);function y(E,T=!1){if(Mi(E))return!1;const R=dt(E),C=dt(E+3),{sideways:w,normal:S,q:L}=gi(R,C),U=R.p,H=We(U.x,U.z),ee=U.y-.95;if(ee-H<10)return!1;const te=re.width*(T?.43:.35),W=ee,j=H+.25,ne=T?.56:.42,de=T?2.4:1.75,fe=T?.52:.36,Ve=[],I=[];for(const Me of[-1,1]){const we=U.clone().addScaledVector(w,Me*te).addScaledVector(S,-.85);we.y=W;const Ie=new P(we.x,j,we.z);_n(i,Ie,we,ne,r);const Ye=new V(new ct(de,de*1.12,fe,12),r);Ye.position.set(Ie.x,H+fe*.5,Ie.z),Ye.receiveShadow=!0,i.add(Ye),Ve.push(we),I.push(Ie),Qn.push({x:Ie.x,z:Ie.z,hw:de*.92,hd:de*.92,maxY:W-.7})}const Se=U.clone().addScaledVector(S,-1.05);Se.y=W,Ot(i,new P(re.width*.92,T?.58:.42,T?1.55:1.15),Se,L,a);const ge=I[0].clone();ge.y+=(W-j)*.28;const ye=I[1].clone();ye.y+=(W-j)*.28;const $=Ve[0].clone();$.y-=1;const K=Ve[1].clone();if(K.y-=1,_n(i,ge,K,T?.16:.1,l),_n(i,ye,$,T?.16:.1,l),T){const Me=I[0].clone();Me.y+=(W-j)*.58;const we=I[1].clone();we.y+=(W-j)*.58,_n(i,I[0].clone().setY(j+1.2),we,.13,l),_n(i,I[1].clone().setY(j+1.2),Me,.13,l),_n(i,Me,K,.13,l),_n(i,we,$,.13,l)}return kl++,!0}for(let E=0;E<re.length;E+=M){if(Mi(E+M*.5))continue;const T=dt(E),R=dt(E+M),C=T.p.clone().add(R.p).multiplyScalar(.5),{sideways:w,normal:S,q:L}=gi(T,R),U=T.p.distanceTo(R.p)+.45,H=Math.floor(E/(M*2))%2?e:t;Ot(i,new P(re.width,.62,U),C.clone().addScaledVector(S,-.05),L,H),Ot(i,new P(re.width-2.8,.08,U*.86),C.clone().addScaledVector(S,.36),L,f),Ot(i,new P(.2,.1,U*.76),C.clone().addScaledVector(w,-re.width*.19).addScaledVector(S,.43),L,f),Ot(i,new P(.2,.1,U*.76),C.clone().addScaledVector(w,re.width*.19).addScaledVector(S,.43),L,f),E%48===0&&(Ot(i,new P(.14,.08,U*.62),C.clone().addScaledVector(w,-re.width*.08).addScaledVector(S,.51),L,_),Ot(i,new P(.14,.08,U*.62),C.clone().addScaledVector(w,re.width*.08).addScaledVector(S,.51),L,_)),E%120===0&&Ot(i,new P(re.width*.42,.07,.72),C.clone().addScaledVector(S,.55),L,x),Ot(i,new P(re.width+1.2,.35,U*.94),C.clone().addScaledVector(S,-.56),L,a),Ot(i,new P(.42,.42,U*.9),C.clone().addScaledVector(w,-re.width*.36).addScaledVector(S,-.78),L,g),Ot(i,new P(.42,.42,U*.9),C.clone().addScaledVector(w,re.width*.36).addScaledVector(S,-.78),L,g);const ee=C.clone().addScaledVector(w,-re.width*.51),te=C.clone().addScaledVector(w,re.width*.51);if(Ot(i,new P(.32,.46,U),ee.clone().addScaledVector(S,.28),L,n),Ot(i,new P(.32,.46,U),te.clone().addScaledVector(S,.28),L,n),Ot(i,new P(.26,.72,U*.94),ee.clone().addScaledVector(S,-.22),L,a),Ot(i,new P(.26,.72,U*.94),te.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const W of[-re.width*.39,-re.width*.2,re.width*.2,re.width*.39]){const j=new V(new ct(.16,.2,.12,10),o);j.position.copy(C).addScaledVector(w,W).addScaledVector(S,.46),j.quaternion.copy(L),j.castShadow=!1,i.add(j)}if(E%72===0&&(Ot(i,new P(.34,1.56,3.4),C.clone().addScaledVector(w,-re.width*.66).addScaledVector(S,1.16),L,s),Ot(i,new P(.34,1.56,3.4),C.clone().addScaledVector(w,re.width*.66).addScaledVector(S,1.16),L,s),Ot(i,new P(.18,.18,4.4),C.clone().addScaledVector(w,-re.width*.62).addScaledVector(S,1.94),L,s),Ot(i,new P(.18,.18,4.4),C.clone().addScaledVector(w,re.width*.62).addScaledVector(S,1.94),L,s),Ot(i,new P(.12,.12,4),C.clone().addScaledVector(w,-re.width*.62).addScaledVector(S,1.38),L,n),Ot(i,new P(.12,.12,4),C.clone().addScaledVector(w,re.width*.62).addScaledVector(S,1.38),L,n),_n(i,C.clone().addScaledVector(w,-re.width*.58).addScaledVector(S,-1.08),C.clone().addScaledVector(w,re.width*.58).addScaledVector(S,-1.08),.11,l),_n(i,C.clone().addScaledVector(w,-re.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l),_n(i,C.clone().addScaledVector(w,re.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l)),E%96===0){const W=new V(new pn(1,28),v);W.rotation.x=-Math.PI/2,W.position.set(C.x,-4.72,C.z),W.scale.set(re.width*.9,Math.max(10,U*2.2),1),W.rotation.z=Math.atan2(gi(T,R).tangent.x,gi(T,R).tangent.z),i.add(W)}if(E%144===0){const W=C.clone().addScaledVector(w,-re.width*.74).addScaledVector(S,2),j=C.clone().addScaledVector(w,re.width*.74).addScaledVector(S,2);_n(i,W.clone().addScaledVector(S,-1.2),W.clone().addScaledVector(S,1.1),.12,s),_n(i,j.clone().addScaledVector(S,-1.2),j.clone().addScaledVector(S,1.1),.12,s),Ot(i,new P(.46,.72,.46),W.clone().addScaledVector(S,1.15),L,c),Ot(i,new P(.46,.72,.46),j.clone().addScaledVector(S,1.15),L,c)}if(E%288===0){const W=C.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*re.width*.92).addScaledVector(S,5.2);Ot(i,new P(.44,.44,.44),W.clone(),L,p),_n(i,W.clone().addScaledVector(S,-.2),C.clone().addScaledVector(S,1),.05,l)}E%48===0&&y(E+M*.5,!1),E%168===0&&!Mi(E+16)&&nv(i,dt(E+5),u)}for(const E of re.gaps){const T=dt(E.start-3),R=dt(E.end+3);for(const C of[T,R]){const w=dt(C.s+2),{normal:S,q:L}=gi(C,w);Ot(i,new P(re.width-1.2,.08,4.6),C.p.clone().addScaledVector(S,.54),L,c),Ot(i,new P(re.width*.62,.09,1.3),C.p.clone().addScaledVector(S,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,x);for(const U of[-re.width*.42,0,re.width*.42]){const H=C.p.clone().addScaledVector(C.side,U).addScaledVector(S,2.35);Ot(i,new P(.46,.46,.46),H,L,U===0?m:c)}y(C.s+(C===T?-9:9),!0),y(C.s+(C===T?-24:24),!0)}}return i}function eu(i=13710372,e=7740696){const t=new at,n=new Y({color:i,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new Y({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new Y({color:329225,roughness:.52,metalness:.12}),a=new Y({color:1053463,roughness:.38,metalness:.34}),o=new Y({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),l=new Y({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),c=new Y({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),u=new Y({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new Y({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new Y({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new Y({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),g=new Y({color:329225,roughness:.44,metalness:.22}),_=new V(new pn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const x=(y,E,T,R,C=null,w=null)=>{const S=new V(E,T);return S.name=y,S.position.copy(R),C&&S.rotation.set(C.x||0,C.y||0,C.z||0),w&&S.scale.copy(w),t.add(S),S},d=(y,E,T,R,C,w,S=0,L=0,U=0)=>x(y,new Ue(E.x,E.y,E.z),T,new P(R,C,w),new P(S,L,U));d("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),d("wide wedge body tub",new P(4.85,.86,6.65),n,0,.98,.28,-.035),d("sloped front wedge nose",new P(3.7,.64,3.35),n,0,.83,-3.75,-.145),d("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),d("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),d("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),d("left rear haunch",new P(.72,.74,2.55),n,-2.53,1.18,2.08,-.04),d("right rear haunch",new P(.72,.74,2.55),n,2.53,1.18,2.08,-.04),d("left front fender flare",new P(.46,.54,1.38),n,-2.55,.98,-2.78,-.04),d("right front fender flare",new P(.46,.54,1.38),n,2.55,.98,-2.78,-.04),d("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),d("deep rear bumper",new P(5.32,.38,.48),l,0,.58,4.23),d("front windshield",new P(2.8,.13,1.15),c,0,1.78,-1.25,-.48),d("roof glass",new P(2.34,.18,1.55),c,0,2.08,-.2,-.13),d("left side window",new P(.12,.78,1.9),c,-1.28,1.76,-.15,-.08,.04),d("right side window",new P(.12,.78,1.9),c,1.28,1.76,-.15,-.08,-.04),d("black a pillar left",new P(.12,.86,.14),g,-1.46,1.75,-1.22,-.48),d("black a pillar right",new P(.12,.86,.14),g,1.46,1.75,-1.22,-.48),d("rear deck panel",new P(3.5,.18,2.18),n,0,1.7,2,-.2);for(let y=0;y<7;y++)d("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);d("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])d("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])d("thin hood crease",new P(.08,.04,2.55),g,y*.36,1.27,-3.45,-.15),d("door seam",new P(.035,.68,1.75),g,y,1.16,-.2),d("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])d("pop up headlight glass",new P(.62,.12,.18),p,y,1.02,-5.28,-.16);d("tail light backplate",new P(3.86,.46,.08),g,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])d("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?u:f,y,1.08,4.24);d("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),d("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),d("left black roof rail",new P(.12,.12,2.72),g,-1.34,2.15,-.42,-.13),d("right black roof rail",new P(.12,.12,2.72),g,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])d("angular side mirror arm",new P(.42,.08,.08),g,y,1.62,-1.55,0,0,y<0?-.14:.14),d("blue tinted side mirror",new P(.12,.34,.46),c,y*1.03,1.62,-1.65,0,y<0?.24:-.24),d("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])d("left wheel arch shadow",new P(.08,.9,1.75),g,-2.82,.78,y),d("right wheel arch shadow",new P(.08,.9,1.75),g,2.82,.78,y);d("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const v=[],M=(y,E,T=!1)=>{const R=new at;R.name=T?"steering front wheel assembly":"rear wheel assembly",R.position.set(y,.54,E);const C=new V(new ct(.88,.88,.62,28),r);C.name="wide performance tire",C.rotation.z=Math.PI/2,R.add(C);const w=new V(new Xs(.88,.06,10,32),r);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,R.add(w);const S=new V(new ct(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,R.add(S);const L=new V(new ct(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,R.add(L);for(let ee=0;ee<8;ee++){const te=new V(new Ue(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=ee/8*Math.PI*2,te.position.set(y>0?.035:-.035,0,.22),R.add(te)}const U=new V(new Ue(.1,.22,.18),f);U.name="small brake caliper",U.position.set(y>0?-.39:.39,.18,-.38),R.add(U);const H=new V(new ct(.17,.17,.72,18),l);H.name="dark center cap",H.rotation.z=Math.PI/2,R.add(H),t.add(R),T&&v.push(R)};for(const y of[-2.4,2.4])M(y,-2.65,!0),M(y,2.42,!1);t.userData.frontWheels=v,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new V(new ct(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),tt.add(t),t}function sv(){const i=new at,e=new Y({color:3949112,roughness:.62,metalness:.3}),t=new Y({color:460551,roughness:.55}),n=new Y({color:3162419,roughness:.5,metalness:.42}),s=new Y({color:16767297,roughness:.38,metalness:.25}),r=new Y({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new Y({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new Y({color:1118995,roughness:.7,metalness:.05}),l=new V(new Ue(2.2,.24,2.2),e);l.position.set(0,-.78,-2.2),i.add(l);const c=new V(new Ue(.16,.028,1.92),n);c.position.set(0,-.64,-2.28),i.add(c);const u=new V(new Ue(2.55,.18,.52),t);u.position.set(0,-.48,-1.25),u.rotation.x=-.08,i.add(u);const f=new V(new Bt(2.8,.82,1,1),a);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,i.add(f);const p=new V(new Xs(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,i.add(p);for(let m=0;m<3;m++){const g=new V(new Ue(.34,.025,.035),n);g.position.copy(p.position),g.rotation.copy(p.rotation),g.rotation.z+=m/3*Math.PI*2,i.add(g)}for(let m=0;m<6;m++){const g=new V(new ct(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),i.add(g)}for(const m of[-1.08,1.08]){const g=new V(new ct(.34,.34,.25,18),t);g.rotation.z=Math.PI/2,g.position.set(m,-.68,-1.58),i.add(g);const _=new V(new Xs(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(m*.8,-.48,-1.74),_.rotation.x=Math.PI/2,i.add(_)}for(const m of[-1.14,-.84,.84,1.14]){const g=new V(new ct(.035,.04,.028,8),n);g.position.set(m,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const m of[-.52,.52]){const g=new V(new Ht(.045,12,8),r);g.position.set(m,-.34,-1.22),i.add(g)}i.position.set(0,0,0),Fe.add(i),Mn=i}function rv(){const i=new Y({color:16119285,roughness:.35,metalness:.25}),e=new Y({color:1184274,roughness:.45}),t=new Y({map:P1(),roughness:.42,metalness:.05}),n=new Y({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=dt(0),r=new Tt().makeBasis(s.side,jt,s.tangent),a=new Si().setFromRotationMatrix(r),o=new at;for(const u of[-re.width*.58,re.width*.58]){const f=new V(new Ue(.8,11,.8),i);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,5.4),f.quaternion.copy(a),o.add(f)}const l=new V(new Ue(re.width+3,.8,1),t);l.position.copy(s.p).addScaledVector(jt,11.2),l.quaternion.copy(a),o.add(l);const c=new V(new Ue(re.width+1.2,1.4,.18),e);c.position.copy(s.p).addScaledVector(jt,12.5).addScaledVector(s.tangent,-.55),c.quaternion.copy(a),o.add(c);for(const u of[-re.width*.38,0,re.width*.38]){const f=new V(new Ht(.32,16,10),n);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,10.25),o.add(f)}return tt.add(o),o}const rs=eu(),kt=eu(3108784,1916782);kt.visible=!1;G1();V1();Ze.signs=0;Va.length=0;H1();W1();Z1();let Hh=null,Wh=null,Xh=null,Mn=null,Vo=null;const Qt=[];sv();function wa(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),tt.remove(i))}const zs=[],Or=[];let qh=null;function av(){const i=document.createElement("canvas");i.width=128,i.height=192;const e=i.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const n of[36,96,156])e.beginPath(),e.moveTo(24,n+22),e.lineTo(64,n-22),e.lineTo(104,n+22),e.stroke();const t=new Zt(i);return t.colorSpace=bt,t}function ov(){zs.length=0,Or.length=0;const i=new at,e=new Rt({map:av(),transparent:!0,depthWrite:!1,side:mt,blending:Xn,opacity:.9}),t=new Bt(3.6,5.4);t.rotateX(-Math.PI/2);for(let l=170;l<re.length-60;l+=290){if(re.gaps.some(g=>l>g.start-70&&g.end+70>l))continue;const c=[-.24,0,.24][zs.length%3]*re.width,u=dt(l),f=new V(t,e),p=new P().crossVectors(u.side,u.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new Tt().makeBasis(u.side,p,new P().crossVectors(u.side,p).normalize());f.quaternion.setFromRotationMatrix(m),f.position.copy(u.p).addScaledVector(u.side,c).addScaledVector(p,.84),i.add(f),zs.push({s:l,lat:c})}const n=new Ht(.17,8,6),s=new Y({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),r=Math.max(60,Math.round(re.length/24));{const l=new on(n,s,r*2),c=new Vt;let u=0;for(let f=0;f<r;f++){const p=f/r*re.length;if(Mi(p))continue;const m=dt(p);for(const g of[-1,1])c.position.copy(m.p).addScaledVector(m.side,g*(re.width*.5+.22)).addScaledVector(jt,.78),c.updateMatrix(),l.setMatrixAt(u++,c.matrix)}l.count=u,l.instanceMatrix.needsUpdate=!0,i.add(l)}const a=new ct(.09,.12,1.5,8),o=new Y({color:2500134,roughness:.6,metalness:.4});for(const l of re.gaps){const c=dt(Math.max(6,l.start-22));for(const u of[-1,1]){const f=new Y({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new at,m=new V(a,o),g=new V(new Ht(.3,10,8),f);m.position.y=.75,g.position.y=1.65,p.add(m),p.add(g),p.position.copy(c.p).addScaledVector(c.side,u*(re.width*.5+.55)).addScaledVector(jt,.55),i.add(p),Or.push(f)}}return tt.add(i),i}In(new Vt,i=>{if(!Or.length)return;const e=Math.sin(i*8)>0?2.3:.3;for(const t of Or)t.emissiveIntensity=e});function yc(i){return Mr=De.clamp(i,0,cs.length-1),re=cs[Mr],Qn.length=0,kr.length=0,wa(Hh),wa(Wh),wa(Xh),wa(qh),Hh=iv(),Wh=rv(),Xh=J1(),qh=ov(),et.trackName.textContent=re.name,et.courseName&&(et.courseName.textContent=re.name),et.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Mr)}),re.name}yc(0);function lv(){Vo&&tt.remove(Vo),Qt.length=0;const i=new at,e=new Y({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Rt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:mt,blending:Xn}),n=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<n.length;s++){const r=n[s],a=We(r.x,r.z)+4.2,o=new at,l=new V(new Xs(5.6,.22,12,52),e.clone());l.rotation.y=r.yaw,o.add(l);const c=new V(new pn(4.7,32),t.clone());c.rotation.y=r.yaw,o.add(c);const u=new Y({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new V(new ct(.11,.16,6.2,8),u);m.position.set(Math.cos(r.yaw)*p,-1.1,Math.sin(r.yaw)*p),o.add(m)}const f=new V(new Ht(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,i.add(o),Qt.push({...r,y:a,radius:8.5,marker:o,collected:!1})}In(i,s=>{for(let r=0;r<Qt.length;r++){const a=Qt[r],o=r===h.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(l=>{l.material?.emissive&&(l.material.emissiveIntensity=o?2.4:.65)})}}),tt.add(i),Vo=i}lv();const Js=new S1(an);Js.addPass(new y1(tt,Fe));const tu=new qs(new Te(window.innerWidth,window.innerHeight),.4,.72,.86);Js.addPass(tu);Js.addPass(new w1);const cv={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},pr=new Wd(cv);Js.addPass(pr);const hv=new Y({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),yr=Array.from({length:72},()=>{const i=new V(new Ht(.1,8,5),hv);return i.visible=!1,tt.add(i),{mesh:i,life:0,velocity:new P}}),dv=new Rt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:mt}),wr=Array.from({length:90},()=>{const i=new V(new pn(1,18),dv.clone());return i.visible=!1,tt.add(i),{mesh:i,life:0,maxLife:1,velocity:new P,spin:0}}),uv=new Y({color:2962232,roughness:.58,metalness:.34}),br=Array.from({length:48},()=>{const i=new V(new Ue(.18,.08,.26),uv);return i.visible=!1,tt.add(i),{mesh:i,life:0,velocity:new P,spin:new P}});let $n=null;function nu(){if($n)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),$n={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function Ga(){$n||nu(),$n?.ctx.state==="suspended"&&$n.ctx.resume().catch(()=>{})}function Da(i){if(!$n)return;const{ctx:e}=$n,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function Os(i,e=18){const t=Math.min(e,yr.length);for(let n=0;n<t;n++){const s=yr.find(r=>r.life<=0)||yr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function iu(i,e=10,t=1){const n=Math.min(e,wr.length);for(let s=0;s<n;s++){const r=wr.find(a=>a.life<=0)||wr[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function fv(i,e=8,t=1){const n=Math.min(e,br.length);for(let s=0;s<n;s++){const r=br.find(a=>a.life<=0)||br[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function pv(i,e=Math.abs(h.speed),t="CRASH"){const n=De.clamp(Math.abs(e)/70,.18,1.45);h.collisionHits++,h.collisionDrama=Math.max(h.collisionDrama,n),h.cameraShake=Math.max(h.cameraShake,.25+n*.45),h.damage=De.clamp(h.damage+n*3.6,0,100),h.message=t,h.messageTimer=Math.max(h.messageTimer,.7),Os(i,Math.round(10+n*24)),iu(i,Math.round(5+n*12),n),fv(i,Math.round(3+n*8),n),Da(18+n*34)}function mv(i){for(const e of yr){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of wr){if(e.life<=0)continue;e.life-=i,e.mesh.position.addScaledVector(e.velocity,i),e.velocity.y+=.4*i,e.mesh.rotation.z+=e.spin*i;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+i*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Fe.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of br)e.life<=0||(e.life-=i,e.velocity.y-=24*i,e.mesh.position.addScaledVector(e.velocity,i),e.mesh.rotation.x+=e.spin.x*i,e.mesh.rotation.y+=e.spin.y*i,e.mesh.rotation.z+=e.spin.z*i,e.life<=0&&(e.mesh.visible=!1))}function xv(i){if(!$n)return;const{ctx:e,engine:t,engineGain:n,filter:s}=$n;t.frequency.setTargetAtTime(62+h.speed*2.9+(wt.has("ShiftLeft")||wt.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+h.speed*9,e.currentTime,.08);const r=h.mode==="race"||h.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(h.speed)/4200:1e-4,e.currentTime,.08)}function ja(i=!1,e=!1){nu(),wt.clear(),Wa();const t=i||e;Object.assign(h,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=dt(h.s);h.y=n.p.y+2.1,h.yVel=0,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.resultStats.innerHTML="",et.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",et.trackName.textContent=re.name,kt.visible=!1,Mn&&(Mn.visible=!0),document.body.classList.remove("roam-mode"),ds(),window.__freeCam=!1}function wc(){Ga(),h.mode="roam",h.practice=!0,h.freeRun=!1,wt.clear(),Wa();let i=80,e=338;Dn(i,e,6).clearance<6&&(i=80,e=320),h.roamPos.set(i,We(i,e),e),h.roamYaw=0,h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Le.zoom=0,h.wheelSteer=0,h.speed=0,h.boost=1,h.damage=0,h.cameraShake=0,h.collisionDrama=0,h.collisionHits=0,h.collisionCooldown=0,h.objectiveIndex=0,h.objectiveHits=0,h.objectiveLap=1;for(const s of Qt)s.collected=!1;h.message="",h.messageTimer=0,rs.visible=!1,kt.visible=!0,Mn&&(Mn.visible=!1),document.body.classList.add("roam-mode"),ds(),window.__freeCam=!1,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.position.textContent="FREE ROAM",et.trackName.textContent="City Streets",as();const t=Math.sin(h.roamYaw),n=-Math.cos(h.roamYaw);Fe.position.set(h.roamPos.x-t*17,h.roamPos.y+7.2,h.roamPos.z-n*17),Gl(),Fe.lookAt(h.roamPos.x+t*13,h.roamPos.y+2.45,h.roamPos.z+n*13),Fe.fov=69,Fe.updateProjectionMatrix()}function as(){kt.position.set(h.roamPos.x,h.roamPos.y+.3-h.roamSuspension*.45,h.roamPos.z),kt.quaternion.setFromAxisAngle(jt,-h.roamYaw),kt.rotateZ(-h.wheelSteer*De.clamp(Math.abs(h.speed)/90,0,1)*.1),kt.rotateX(De.clamp(h.roamSuspension,-.16,.22))}function su(i,e){let t=null;for(const s of kr)for(const r of s.segments){const a=i-r.a.x,o=e-r.a.z,l=De.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),c=r.a.x+r.abx*l,u=r.a.z+r.abz*l,f=Math.hypot(i-c,e-u);if(f>s.halfW+On*1.15)continue;const p=De.lerp(r.a.y,r.b.y,l),m=De.lerp(r.u0,r.u1,l),g=f+Math.max(0,We(i,e)-p)*.2;(!t||g<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*re.width*.34,score:g})}if(!t)return null;const n=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=n,t.tangentZ/=n,t}function ru(i,e,t=We(i,e),n=!1){let s=null;const r=10;for(let o=0;o<re.length;o+=r){if(Mi(o+r*.5))continue;const l=dt(o),c=dt(o+r),u=c.p.x-l.p.x,f=c.p.z-l.p.z,p=Math.max(1e-4,u*u+f*f),m=De.clamp(((i-l.p.x)*u+(e-l.p.z)*f)/p,0,1),g=l.p.x+u*m,_=l.p.z+f*m,x=i-g,d=e-_,v=Math.hypot(x,d);if(v>re.width*.5+On*.45)continue;const M=De.lerp(l.p.y,c.p.y,m)+.58;if(!n&&t<M-5)continue;const y=new P(f,0,-u).normalize(),E=De.clamp(x*y.x+d*y.z,-re.width*.44,re.width*.44);(!s||v<s.dist)&&(s={kind:"track",y:M,s:o+r*m,lateral:E,tangentX:u,tangentZ:f,dist:v})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function ts(i,e,t=h.roamPos.y){const n=We(i,e);let s={kind:"ground",y:n};const r=su(i,e);r&&r.y>=n-1.2&&(s=r);const a=ru(i,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function Yh(i){if(i.rampType==="off")return!1;const e=Math.sin(h.roamYaw)*i.tangentX+-Math.cos(h.roamYaw)*i.tangentZ;if(h.speed<10||e<.22)return!1;const t=(i.mergeS??i.s??22)+8,n=dt(t);return h.mode="race",h.practice=!0,h.freeRun=!0,h.breakdownTimer=0,h.s=n.s,h.totalDistance=n.s,h.lastSafeS=n.s,h.lastSafeDistance=n.s,h.lateral=De.clamp(i.lateral??0,-re.width*.32,re.width*.32),h.lateralVel=-Math.sign(h.lateral)*Math.min(4,Math.abs(h.speed)*.04),h.speed=De.clamp(Math.max(28,h.speed),18,112),h.grounded=!0,h.y=n.p.y+2.1,h.yVel=0,h.airtime=0,h.rivalS=-900,h.rivalDistance=-900,h.leadState="SOLO",h.message="Merged onto the ribbon",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.35),rs.visible=!1,kt.visible=!1,Mn&&(Mn.visible=!0),document.body.classList.remove("roam-mode"),ds(),et.position.textContent="FREE RUN",et.trackName.textContent=re.name,as(),!0}function gv(i){if(!i||h.mode!=="race")return!1;const e=i.segments[0],t=i.points[0],n=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/n,r=e.abz/n;h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(t.x+s*3.5,t.y+zn,t.z+r*3.5),h.roamYaw=Math.atan2(s,-r),h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,h.wheelSteer=0,h.speed=De.clamp(Math.max(24,Math.abs(h.speed)*.82),20,78),h.grounded=!0,h.yVel=0,h.airtime=0,h.message="Exited to city streets",h.messageTimer=1.25,h.cameraShake=Math.max(h.cameraShake,.22),rs.visible=!1,kt.visible=!0,Mn&&(Mn.visible=!1),document.body.classList.add("roam-mode"),ds(),et.position.textContent="FREE ROAM",et.trackName.textContent="City Streets",as();const a=Math.sin(h.roamYaw),o=-Math.cos(h.roamYaw);return Fe.position.set(h.roamPos.x-a*17,h.roamPos.y+7.2,h.roamPos.z-o*17),Fe.lookAt(h.roamPos.x+a*13,h.roamPos.y+2.45,h.roamPos.z+o*13),Fe.fov=69,Fe.updateProjectionMatrix(),Os(h.roamPos.clone().add(new P(0,.6,0)),10),!0}function vv(){const i=Ka.set(0,0,-1).applyQuaternion(Fe.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.roamPos.y,yVel:h.yVel,grounded:!0,objectiveHits:h.objectiveHits,roamPos:{x:h.roamPos.x,y:h.roamPos.y,z:h.roamPos.z},input:{steer:Le.steer,throttle:Le.throttle,brake:Le.brake},forwardWorld:{x:Math.sin(h.roamYaw),y:0,z:-Math.cos(h.roamYaw)},cameraWorld:{x:i.x,y:i.y,z:i.z}}}let qi=null;function _v(){qi||(qi=new V(new ct(2.4,3.2,620,12,1,!0),new Rt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:Xn,side:mt,fog:!1})),qi.renderOrder=5,tt.add(qi));const i=h.mode==="roam"&&Qt.length>0;if(qi.visible=i,!i)return;const e=Qt[h.objectiveIndex%Qt.length];qi.position.set(e.x,e.y+296,e.z),qi.material.opacity=.1+Math.sin(Bl*3.1)*.04}function Mv(){if(h.mode!=="roam"||Qt.length===0)return;const i=Qt[h.objectiveIndex%Qt.length];if(!i)return;const e=h.roamPos.x-i.x,t=h.roamPos.z-i.z,n=Math.abs(h.roamPos.y-i.y);e*e+t*t>i.radius*i.radius||n>8.5||(i.collected=!0,h.objectiveHits++,h.objectiveIndex=(h.objectiveIndex+1)%Qt.length,h.objectiveIndex===0&&h.objectiveLap++,h.score+=420+Math.round(Math.abs(h.speed)*5),h.boost=Math.min(1,h.boost+.32),h.cameraShake=Math.max(h.cameraShake,.18),h.message=i.label,h.messageTimer=1.05,Sr(`+${420+Math.round(Math.abs(h.speed)*5)} GATE`,!0),Nr(880,.16),setTimeout(()=>Nr(1245,.2),90),Os(new P(i.x,i.y,i.z),18))}function au(i){const e=h.speed;h.collisionCooldown=Math.max(0,h.collisionCooldown-i);const t=Math.max(wt.has("KeyW")||wt.has("ArrowUp")?1:0,Le.throttle),n=Math.max(wt.has("KeyS")||wt.has("ArrowDown")?1:0,Le.brake),s=De.clamp((wt.has("KeyD")||wt.has("ArrowRight")?1:0)-(wt.has("KeyA")||wt.has("ArrowLeft")?1:0)+Le.steer,-1,1)*Yd,r=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&t>.03;if(t>.03){const v=h.speed<0?38:0;h.speed+=((r?70:42)+v)*t*i}n>.03&&(h.speed-=(h.speed>1.2?78:32)*n*i),h.speed-=.00235*h.speed*Math.abs(h.speed)*i,Math.abs(h.speed)>.08?h.speed-=Math.sign(h.speed)*3.6*i:t<=.03&&n<=.03&&(h.speed=0),h.speed=De.clamp(h.speed,-24,135),h.boosting=r,r?h.boost=Math.max(0,h.boost-i*.22):h.boost=Math.min(1,h.boost+i*.05),h.wheelSteer+=(s-h.wheelSteer)*(1-Math.pow(1e-5,i));const a=-h.wheelSteer*.55,o=kt.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const l=Math.abs(h.speed);if(l>Ol){const v=De.clamp((l-Ol)/5,0,1),M=1-.36*De.clamp((l-34)/85,0,1),y=E1*1.08*v*M;h.roamYaw+=h.wheelSteer*y*i*Math.sign(h.speed)}const c=Math.sin(h.roamYaw),u=-Math.cos(h.roamYaw),f=(h.speed-e)/Math.max(.001,i),p=De.clamp(Math.abs(h.wheelSteer)*Math.max(0,l-18)/68+Math.max(0,-f-34)/90,0,1);if(h.roamSlip+=(p-h.roamSlip)*(1-Math.pow(.01,i)),h.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,l/540)+Math.abs(f)*.0018-h.roamSuspension)*(1-Math.pow(.018,i)),h.roamSlip>.38&&Math.random()<i*(3+h.roamSlip*7)){const v=new P(h.roamPos.x-c*3.2,h.roamPos.y+.2,h.roamPos.z-u*3.2);iu(v,2,h.roamSlip)}const m=Math.abs(h.speed)*i,g=Math.max(1,Math.ceil(m/1.2));let _=!1,x=!1,d=ts(h.roamPos.x,h.roamPos.z,h.roamPos.y);for(let v=0;v<g;v++)h.roamPos.x+=c*h.speed*i/g,h.roamPos.z+=u*h.speed*i/g,d=ts(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+zn,Tv(h.roamPos,d)&&(x=!0),Ev(h.roamPos,d)&&(_=!0),d=ts(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+zn;h.roamPos.x=De.clamp(h.roamPos.x,-820,820),h.roamPos.z=De.clamp(h.roamPos.z,-1620,480),_&&(h.collisionCooldown<=0&&(pv(new P(h.roamPos.x,h.roamPos.y+.8,h.roamPos.z),e,"IMPACT"),h.collisionCooldown=.38),h.speed*=.28),x&&(h.speed*=.62,h.cameraShake=Math.max(h.cameraShake,.22),h.message="SPLAT!",h.messageTimer=.9),Sv(i,_),d=ts(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamPos.y=d.y+zn,!(d.kind==="ramp"&&d.u>.72&&Yh(d))&&(d.kind==="track"&&Yh(d)||(Mv(),as(),wt.has("KeyR")&&(wc(),wt.delete("KeyR"))))}const On=2.6;function Sv(i,e){for(const t of ni)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=i);if(!(e||Math.abs(h.speed)<32||h.collisionCooldown>0))for(const t of ni){const n=t.actor;if(!n||(n.nearMissT||0)>0)continue;const s=h.roamPos.x-t.x,r=h.roamPos.z-t.z,a=(t.hw+t.hd)*.5+On+2.4;if(s*s+r*r<a*a&&Math.abs(h.roamPos.y-(t.maxY??h.roamPos.y))<7){n.nearMissT=1.8,h.score+=45,h.nearMisses+=1,Sr("+45 NEAR MISS"),Nr(520,.12,"square",.07);break}}}function Go(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.maxY!=null&&i.y>s.maxY+zn+.45)continue;if(s.radius){const f=s.radius+On,p=i.x-s.x,m=i.z-s.z,g=p*p+m*m;if(g>=f*f)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(g));i.x=s.x+p/_*f,i.z=s.z+m/_*f;continue}const r=s.hw+On,a=s.hd+On,o=i.x-s.x,l=i.z-s.z;if(Math.abs(o)>=r||Math.abs(l)>=a)continue;t=!0;const c=r-Math.abs(o),u=a-Math.abs(l);c<u?i.x=s.x+(o<0?-r:r):i.z=s.z+(l<0?-a:a)}return t}function ou(i,e=h.roamPos){if(!i)return;const t=(i.crashTimer||0)<=.05;i.crashTimer=Math.max(i.crashTimer||0,1.15+Math.random()*.45),i.waitTimer=Math.max(i.waitTimer||0,.55),i.brakePulse=1;const n=i.maxAvoidOffset||xi.streetW*.3,s=i.mesh?.position?.x??i.collider?.x??i.road,r=i.mesh?.position?.z??i.collider?.z??i.along,a=i.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;i.avoidOffset=De.clamp((i.avoidOffset||0)+a*n*.9,-n,n),t&&(Ze.trafficCrashes++,i.along-=i.dir*1.8,i.mesh&&(i.mesh.rotation.y+=a*.08),h.mode==="roam"&&(h.cameraShake=Math.max(h.cameraShake,.32),h.message="TRAFFIC CRASH",h.messageTimer=.85))}function yv(i){let e=!1;for(let t=0;t<ni.length;t++){const n=ni[t];if(n.maxY!=null&&i.y>n.maxY+zn+.45)continue;const s=n.hw+On,r=n.hd+On,a=i.x-n.x,o=i.z-n.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,ou(n.actor,i);const l=s-Math.abs(a),c=r-Math.abs(o);l<c?i.x=n.x+(a<0?-s:s):i.z=n.z+(o<0?-r:r)}return e}function wv(i,e,t=0){return e.maxY!=null&&i.y>e.maxY+zn+.45?!1:e.radius?Math.hypot(i.x-e.x,i.z-e.z)<e.radius+t:Math.abs(i.x-e.x)<e.hw+t&&Math.abs(i.z-e.z)<e.hd+t}function bv(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,Ze.splats++;const e=Ns.find(t=>!t.visible)||Ns[Ze.splats%Math.max(1,Ns.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(i.x,We(i.x,i.z)+.08,i.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function Tv(i,e=null){if(e?.kind!=="ground"||Math.abs(h.speed)<5)return!1;let t=!1;for(const n of zr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=On+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(We(n.x,n.z)+zn))>3.2||(bv(n),t=!0)}return t}function Ev(i,e=null){let t=!1;for(let n=0;n<2;n++){const s=Go(i,wn),r=e?.kind==="ground"?Go(i,Qn):!1,a=Go(i,ss),o=e?.kind==="ground"?yv(i):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function lu(i){const e=Le.lookX*1.18,t=Le.lookY*.58;h.camLookYaw+=(e-h.camLookYaw)*(1-Math.pow(.002,i)),h.camLookPitch+=(t-h.camLookPitch)*(1-Math.pow(.002,i)),h.cameraZoom+=(Le.zoom-h.cameraZoom)*(1-Math.pow(.018,i))}function bc(i,e,t=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=De.lerp(i.x,e.x,r),o=De.lerp(i.z,e.z,r),l=De.lerp(i.y,e.y,r),c=We(a,o)+t;c>l&&(n=Math.max(n,(c-l)/Math.max(.08,r)))}return n}function Av(i,e){const t=We(i,e);let n=null;const s=su(i,e);s&&s.y>t+4&&(n=s);const r=ru(i,e,1e3,!0);return r&&r.y>t+4&&(!n||r.y>n.y)&&(n=r),n}function Ha(i,e,t=4){let n=0;for(let s=2;s<=14;s++){const r=s/14,a=De.lerp(i.x,e.x,r),o=De.lerp(i.z,e.z,r),l=De.lerp(i.y,e.y,r),c=Av(a,o);if(!c||i.y<c.y-10)continue;const u=c.y+t-l;u>0&&(n=Math.max(n,u/Math.max(.16,r)))}return Math.min(54,n)}function Gl(){const i=h.camYaw+h.camLookYaw,e=Math.sin(i),t=-Math.cos(i),n=De.clamp(h.cameraZoom,-.42,.9),s=h.roamPos,r={x:s.x+e*(12-Math.min(n,0)*6),y:s.y+2.6+h.camLookPitch*13.5,z:s.z+t*(12-Math.min(n,0)*6)};Fe.position.y+=bc(r,Fe.position,3.4),Fe.position.y+=Ha(r,Fe.position,4.2)}function cu(i){if(window.__freeCam)return;if(lu(i),Math.abs(h.speed)>Ol){let m=h.roamYaw-h.camYaw;m=Math.atan2(Math.sin(m),Math.cos(m)),h.camYaw+=m*(1-Math.pow(.08,i))}const e=h.camYaw+h.camLookYaw,t=Math.sin(e),n=-Math.cos(e),s=h.roamPos,r=De.clamp(h.cameraZoom,-.42,.9),a=De.clamp(Math.abs(h.speed)/135,0,1),o=(17+Math.abs(h.speed)*.11+h.roamSlip*3)*(1+r*.72),l=7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+h.camLookPitch*5.8,c=qd.set(s.x-t*o,s.y+l,s.z-n*o);if(h.cameraShake>.01||h.collisionDrama>.01){const m=h.cameraShake+h.collisionDrama*.42;c.x+=(Math.random()-.5)*m*1.2,c.y+=(Math.random()-.5)*m*.75,c.z+=(Math.random()-.5)*m*1.2}const u=Ka.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+h.camLookPitch*13.5,s.z+n*(13+a*8-Math.min(r,0)*6));c.y=Math.max(c.y,We(c.x,c.z)+3.5),c.y+=bc(u,c,3.4),c.y+=Ha(u,c,4.2);const f=h.roamSlip>.35?.006:.0026;Fe.position.lerp(c,1-Math.pow(f,i)),Fe.position.y+=Ha(u,Fe.position,3.8)*.72,rn.position.copy(Fe.position),rn.lookAt(u),rn.rotateY(Math.PI),rn.rotateZ(-h.wheelSteer*a*.18+h.roamSlip*Math.sign(h.wheelSteer||1)*.05),Fe.quaternion.slerp(rn.quaternion,1-Math.pow(.05,i));const p=69+Math.min(13,Math.abs(h.speed)*.075)+h.roamSlip*2.5+r*10;Math.abs(Fe.fov-p)>.02&&(Fe.fov+=(p-Fe.fov)*(1-Math.pow(.01,i)),Fe.updateProjectionMatrix()),h.cameraShake=Math.max(0,h.cameraShake-i*2.4),h.collisionDrama=Math.max(0,h.collisionDrama-i*1.8)}function hu(i){if(h.mode==="result")return;h.mode="result";const e=Math.max(0,Math.round(h.score-h.damage*9+Math.max(0,220-h.time)*45));e>h.best&&(h.best=e,localStorage.setItem("steel-ribbon-best",String(e))),et.best.textContent=`Best score ${h.best}`,et.resultText.textContent=`${i} Score ${e}. Time ${Wl(h.time)}. Damage ${Math.round(h.damage)}%.`;const t=Number.isFinite(h.bestLap)?Wl(h.bestLap):"--:--.-";et.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${h.cleanLandings}</b>
    <b>Hard landings: ${h.hardLandings}</b>
    <b>Recoveries: ${h.recoveries}</b>
    <b>Near edges: ${Math.round(h.nearMisses)}</b>
  `,et.result.classList.remove("hidden")}function Zh(i="Craned back to the ribbon"){const e=dt(h.lastSafeS);h.s=h.lastSafeS,h.totalDistance=h.lastSafeDistance,h.lateral=0,h.lateralVel=0,h.y=e.p.y+2.1,h.yVel=0,h.speed=Math.max(16,h.speed*.32),h.grounded=!0,h.cameraShake=1.2,h.message=i,h.messageTimer=1.4,h.recoveries+=1}function Tc(i,e){return De.clamp(e*i.tangent.y,-48,48)}function Cv(i=94){return re.gaps.map(e=>{const t=dt(e.start),n=dt(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=Tc(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(De.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function $h(i,e){h.grounded=!1,h.yVel=Tc(i,h.speed),h.airtime=0,e&&(h.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return Tc(dt(i),e)},gapJumpReport(i){return Cv(i)},sceneryClearanceReport(){return k1()},setSpeed(i){return h.speed=De.clamp(i,-14,156-h.damage*.42),Tr(),h.speed},setTrackPosition(i,e=h.speed,t=0){const n=dt(i);return h.totalDistance=i,h.s=n.s,h.lastSafeS=n.s,h.lastSafeDistance=i,h.lateral=De.clamp(t,-re.width*.48,re.width*.48),h.lateralVel=0,h.y=n.p.y+2.1,h.yVel=0,h.grounded=!0,h.speed=De.clamp(e,-14,156-h.damage*.42),Tr(),{s:h.s,totalDistance:h.totalDistance,speed:h.speed,lateral:h.lateral,y:h.y}},setDamage(i){return h.damage=De.clamp(i,0,99),Tr(),h.damage},setCourse(i){return yc(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,Fe.position.set(i,e,t),Fe.lookAt(n,s,r),Fe.fov=62,Fe.updateProjectionMatrix(),"freecam"},listBoostPads(){return zs.map(i=>({s:i.s,lat:+i.lat.toFixed(2)}))},setRoamPos(i,e,t=0,n=0){return h.mode!=="roam"&&wc(),h.roamPos.set(i,We(i,e)+zn,e),h.roamYaw=t,h.camYaw=t,h.speed=n,as(),{x:h.roamPos.x,y:+h.roamPos.y.toFixed(2),z:h.roamPos.z}},sceneryCounters(){return{...Ui,boostPads:zs.length,gapBeacons:Or.length}},stats(){return{trafficCrashes:Ze.trafficCrashes,splats:Ze.splats,roamPos:{x:+h.roamPos.x.toFixed(1),y:+h.roamPos.y.toFixed(1),z:+h.roamPos.z.toFixed(1)},speed:+h.speed.toFixed(2),cooldown:+h.collisionCooldown.toFixed(2)}},viewInfo(){const i=dt(h.s),e=h.y-2.1;return{trackView:Yn,mode:h.mode,carVisible:kt.visible,cockpitVisible:!!(Mn&&Mn.visible),camY:+Fe.position.y.toFixed(2),deckY:+(i.p.y+.58).toFixed(2),carY:+h.y.toFixed(2),overheadY:+Hl(Fe.position.x,Fe.position.z,e+5,e+64).toFixed(2)}},setTrackView(i){return Yn=i==="cockpit"?"cockpit":"chase",ds(),Yn},listCourses(){return cs.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:Mr,name:re.name,length:re.length,width:re.width,laps:re.laps}},probeDown(i,e){const t=new C0(new P(i,400,e),new P(0,-1,0),0,1e3);t.camera=Fe;const n=t.intersectObjects(tt.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=ts(i,e,400);return{x:i,z:e,ground:+We(i,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return kr.map((i,e)=>{const t=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:i.rampType,mergeS:i.mergeS,exitS:i.exitS,dirSel:i.dirSel,halfW:i.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return wn.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Qn.filter(e=>e.hw).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const i=Qn.filter(e=>e.hw);return{supports:kl,pylonColliders:i.length,gaps:re.gaps.length,sample:i.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const e=[];for(const t of wn){const n=$i(t.x,t.z,t.hw*2,t.hd*2,t.maxY);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return e.sort((t,n)=>n.verticalIntrusion-t.verticalIntrusion),{totalBuildings:wn.length,conflicts:e.length,sample:e.slice(0,i)}},buildingStreetConflictReport(i=12){const e=[];for(const t of wn){const n=Zi(t.x,t.z,t.hw*2,t.hd*2,0);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:n.axis,road:n.road,overlap:+n.overlap.toFixed(1)})}return e.sort((t,n)=>n.overlap-t.overlap),{totalBuildings:wn.length,conflicts:e.length,sample:e.slice(0,i)}},rockColliderSample(i=8){return ss.concat(Qn.filter(e=>e.kind==="rock")).slice(0,i).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:Ze.traffic,pedestrians:Ze.pedestrians,pedestriansActive:zr.filter(e=>e.active).length,turns:Ze.turns,splats:Ze.splats,trafficCrashes:Ze.trafficCrashes,streetLights:Ze.streetLights,trafficLights:Ze.trafficLights,stopSigns:Ze.stopSigns,signs:Ze.signs,roadDetails:{...Ze.roadDetails},buildingArchetypes:{...Ze.buildingArchetypes},zones:{...Ze.zones},openerProps:Ze.openerProps,signSamples:Va.slice(0,i),types:{...Ze.types},offRoadTraffic:ni.filter(e=>!Ja(e.x,e.z,2)).length,trafficRoutes:Vl.slice(0,i).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:ni.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:zr.filter(e=>e.active).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const i={...Ze.roadDetails},e={...Ze.buildingArchetypes},t={...Ze.zones},n=Object.values(e).filter(r=>r>0).length,s=Object.values(t).filter(r=>r>0).length;return{score:+(Math.min(25,(i.crosswalks||0)/8)+Math.min(18,(i.laneArrows||0)/3)+Math.min(14,(i.manholes||0)/4)+Math.min(16,Ze.signs/7)+Math.min(14,Ze.openerProps*1.4)+Math.min(13,n*2.6)).toFixed(1),roadDetails:i,buildingArchetypes:e,zones:t,archetypeKinds:n,zoneKinds:s,openerProps:Ze.openerProps,signs:Ze.signs,streetLights:Ze.streetLights,streetGlowSprites:Ui.streetGlowSprites,waterBlockers:Ui.waterBlockers,lowFogDisks:Ui.lowFogDisks}},objectiveReport(){const i=Qt[h.objectiveIndex%Math.max(1,Qt.length)];return{total:Qt.length,hits:h.objectiveHits,index:h.objectiveIndex,lap:h.objectiveLap,next:i?{x:+i.x.toFixed(1),y:+i.y.toFixed(1),z:+i.z.toFixed(1),label:i.label}:null,collected:Qt.filter(e=>e.collected).length,score:Math.round(h.score),boost:+h.boost.toFixed(2)}},drivingFeelReport(){return{speed:+h.speed.toFixed(2),wheelSteer:+(h.wheelSteer||0).toFixed(3),slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),cameraShake:+(h.cameraShake||0).toFixed(3),collisionDrama:+(h.collisionDrama||0).toFixed(3),collisionHits:h.collisionHits,smokeActive:wr.filter(i=>i.life>0).length,debrisActive:br.filter(i=>i.life>0).length,sparksActive:yr.filter(i=>i.life>0).length}},vehicleDetailReport(){return{player:{...kt.userData.detailReport},racer:{...rs.userData.detailReport},namedParts:kt.children.filter(i=>i.name).map(i=>i.name).slice(0,24)}},advanceCityLife(i=1){const e=.03333333333333333;let t=Math.max(0,Math.min(i,60));for(;t>0;){const n=Math.min(e,t);jd(n),t-=n}return this.cityLifeReport(12)},setRoamUnderTrack(i=260,e=0){const t=dt(i),n=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,r=Math.atan2(t.tangent.x,-t.tangent.z),a=We(n,s);h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(n,a+zn,s),h.roamYaw=r,h.camYaw=r,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Le.lookX=0,Le.lookY=0,Le.zoom=0,h.wheelSteer=0,h.speed=0,as();const o=Math.sin(h.roamYaw),l=-Math.cos(h.roamYaw);return Fe.position.set(h.roamPos.x-o*17,h.roamPos.y+7.2,h.roamPos.z-l*17),Gl(),Fe.lookAt(h.roamPos.x+o*13,h.roamPos.y+2.45,h.roamPos.z+l*13),Fe.fov=69,Fe.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-h.roamPos.y).toFixed(2)}},setRoamPose(i,e,t){const n=ts(i,e,h.roamPos.y);h.roamPos.set(i,n.y+zn,e),h.roamYaw=t,h.camYaw=t,h.camLookYaw=0,h.camLookPitch=0,h.wheelSteer=0,h.speed=0,as();const s=Math.sin(h.roamYaw),r=-Math.cos(h.roamYaw);return Fe.position.set(h.roamPos.x-s*17,h.roamPos.y+7.2,h.roamPos.z-r*17),Gl(),Fe.lookAt(h.roamPos.x+s*13,h.roamPos.y+2.45,h.roamPos.z+r*13),Fe.fov=69,Fe.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,e=0,t=Le.zoom,n=30){Le.lookX=De.clamp(i,-1,1),Le.lookY=De.clamp(e,-1,1),Le.zoom=De.clamp(t,-.42,.9);for(let s=0;s<n;s++)h.mode==="roam"?cu(1/60):Ec(1/60);return this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(h.mode!=="roam")return this.roamReport();const s={steer:Le.steer,throttle:Le.throttle,brake:Le.brake};Le.steer=De.clamp(e,-1,1),Le.throttle=De.clamp(t,0,1),Le.brake=De.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(au(o),h.mode!=="roam")break;a-=o}return Le.steer=s.steer,Le.throttle=s.throttle,Le.brake=s.brake,this.roamReport()},simulateTrackDrive(i=1){if(h.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(i,8));for(;t>0;){const n=Math.min(e,t);if(du(n),h.mode!=="race")break;t-=n}return this.roamReport()},roamReport(){const i=h.roamPos,e=qd.set(0,0,-1).applyQuaternion(kt.quaternion).normalize(),t=Ka.set(Math.sin(h.roamYaw),0,-Math.cos(h.roamYaw)).normalize(),n=ts(i.x,i.z,i.y);return{mode:h.mode,s:+h.s.toFixed(2),totalDistance:+h.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+h.roamYaw.toFixed(3),camYaw:+h.camYaw.toFixed(3),speed:+h.speed.toFixed(2),groundXZ:+We(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+Fe.position.x.toFixed(2),camY:+Fe.position.y.toFixed(2),camZ:+Fe.position.z.toFixed(2),fov:+Fe.fov.toFixed(2),lookYaw:+h.camLookYaw.toFixed(3),lookPitch:+h.camLookPitch.toFixed(3),cameraZoom:+h.cameraZoom.toFixed(3),cameraSightLift:+bc({x:i.x,y:i.y+2.6,z:i.z},{x:Fe.position.x,y:Fe.position.y,z:Fe.position.z},2.4).toFixed(3),elevatedCameraLift:+Ha({x:i.x,y:i.y+2.6,z:i.z},{x:Fe.position.x,y:Fe.position.y,z:Fe.position.z},3.8).toFixed(3),colliders:wn.length+Qn.length+ss.length+ni.length,insideBuilding:wn.concat(Qn,ss,ni).some(s=>wv(i,s)),objectiveHits:h.objectiveHits,objectiveIndex:h.objectiveIndex,collisionHits:h.collisionHits,slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:kt.userData.frontWheels?+kt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function du(i){if(h.mode!=="race")return;h.time+=i,h.freeRun&&(h.damage=0);const e=h.breakdownTimer>0;e&&(h.breakdownTimer-=i,h.breakdownTimer<=0&&(h.damage=55,h.message="Patched up — back on it",h.messageTimer=1.2));const t=Math.max(wt.has("KeyW")||wt.has("ArrowUp")?1:0,Le.throttle),n=Math.max(wt.has("KeyS")||wt.has("ArrowDown")?1:0,Le.brake),s=De.clamp((wt.has("KeyD")||wt.has("ArrowRight")?1:0)-(wt.has("KeyA")||wt.has("ArrowLeft")?1:0)+Le.steer,-1,1)*Yd,r=t>.03&&!e,a=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&r&&h.grounded,o=dt(h.s),l=o.p.y+2.1,c=Math.abs(h.speed);if(r){const v=h.speed<0?40:0;h.speed+=((a?68:40)+v)*t*i}if(n>.03){const v=h.speed>1.2?70:26;h.speed-=v*n*i}const u=h.grounded?.0024:.0011;h.speed-=u*h.speed*c*i,c>.08?h.speed-=Math.sign(h.speed)*(h.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(h.speed=0),h.speed=De.clamp(h.speed,-16,156-h.damage*.8),e&&(h.speed=Math.min(h.speed,14)),h.boosting=a,a?(h.boost=Math.max(0,h.boost-i*.21),h.score+=28*i):h.boost=Math.min(1,h.boost+i*(h.grounded?.045:.018));const f=16+c*.13;h.lateralVel-=s*f*i,h.lateralVel-=h.lateralVel*(h.grounded?4.1:.7)*i,h.lateral+=h.lateralVel*i;const p=Mi(h.s),m=Math.abs(h.lateral)<re.width*.52,g=!p&&m;if(h.grounded&&(!g||Math.abs(h.lateral)>re.width*.5)&&$h(o,m?"":"Edge slip"),h.grounded){const v=Math.sin(h.time*18)*Math.min(.22,Math.abs(h.speed)/700);h.y=De.lerp(h.y,l+v,.5),h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.score+=Math.max(0,h.speed)*i*.34,Math.abs(h.lateral)>re.width*.42&&(h.damage+=i*(1.2+Math.abs(h.speed)*.035),h.cameraShake=Math.max(h.cameraShake,.24),h.nearMisses+=i*.8,Math.random()<i*5&&Os(o.p.clone().addScaledVector(o.side,Math.sign(h.lateral)*re.width*.55).addScaledVector(jt,1.2),4))}else{h.yVel-=31*i,h.y+=h.yVel*i,h.airtime+=i,h.score+=i*11;const v=dt(h.s),M=v.p.y+2.1;if(!Mi(h.s)&&Math.abs(h.lateral)<re.width*.55&&h.y<=M&&h.yVel<0){const y=-h.yVel,E=Math.abs(h.lateral)<re.width*.34&&y<30,T=Math.round(E?260+h.airtime*85:Math.max(30,120-y));h.y=M,h.grounded=!0,h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.damage+=Math.max(0,y-17)*.82+Math.max(0,Math.abs(h.lateral)-re.width*.36)*1.8,h.score+=T,h.cameraShake=Math.max(h.cameraShake,y/34),h.message=E?"Clean landing":"Hard landing",h.messageTimer=.9,E?h.cleanLandings+=1:h.hardLandings+=1,Sr(`+${T} ${E?"CLEAN AIR":"LANDED"}`,E),E&&Nr(990,.14),Da(y),Os(v.p.clone().addScaledVector(v.side,h.lateral).addScaledVector(jt,.7),E?7:24),h.airtime=0}h.y<-55&&(h.damage+=28,Zh("Track crew recovery"))}const _=h.totalDistance;h.totalDistance+=h.speed*i,h.s=(h.totalDistance%re.length+re.length)%re.length;const x=kr.find(v=>v.rampType==="off");if(h.freeRun&&x&&zo(_,h.totalDistance,x.exitS)&&h.lateral*x.dirSel>re.width*.2&&gv(x))return;const d=Math.floor(h.totalDistance/re.length)+1;if(d>h.lap){const v=h.time-h.lapStartTime;h.splitTimes.push(v),h.bestLap=Math.min(h.bestLap,v),h.lapStartTime=h.time,h.lap=d,h.score+=1200,Sr("+1200 LAP",!0),h.message=h.practice?`Lap ${h.lap}`:h.lap<=re.laps?`Lap ${h.lap}`:"Season race complete",h.messageTimer=1.4,!h.practice&&h.lap>re.laps&&hu(h.totalDistance>=h.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const v of re.gaps)zo(_,h.totalDistance,v.start)&&(h.message=v.name,h.messageTimer=1.1,h.grounded&&$h(dt(v.start),v.name));if(h.grounded){for(const v of zs)if(zo(_,h.totalDistance,v.s)&&Math.abs(h.lateral-v.lat)<3.4){const M=dt(v.s);h.boost=Math.min(1,h.boost+.45),h.speed=Math.min(h.speed+9,156-h.damage*.8),h.score+=90,h.cameraShake=Math.max(h.cameraShake,.16),h.message="BOOST PAD",h.messageTimer=.8,Sr("+90 BOOST"),Nr(640,.22,"sawtooth",.1),Os(M.p.clone().addScaledVector(M.side,v.lat).addScaledVector(jt,1),10),Da(14);break}}h.damage=De.clamp(h.damage,0,100),!h.freeRun&&h.damage>=90&&h.breakdownTimer<=0&&(h.breakdownTimer=2.6,h.message="Chassis cracked — limping to repair",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.8),Da(40),h.damage=90),wt.has("KeyR")&&(h.damage=Math.min(99,h.damage+8),Zh("Manual reset"),wt.delete("KeyR"))}function Rv(i){if(h.mode==="race"&&!h.practice){const o=h.totalDistance-h.rivalDistance,l=De.clamp(o*.06,-12,16),c=Math.sin(h.time*.6)*5;h.rivalSpeed=De.clamp(92+l+c,70,120),h.rivalDistance+=h.rivalSpeed*i,h.rivalDistance>=re.length*re.laps&&h.lap<=re.laps&&hu("Crowther reached the gantry first.")}h.rivalS=(h.rivalDistance%re.length+re.length)%re.length;const e=dt(h.rivalS),t=Math.abs(h.rivalDistance-h.totalDistance);let n=Math.sin(h.rivalS*.02)*1.4;if(t<14){const o=(h.lateral>=0?-1:1)*re.width*.26;n=De.lerp(o,n,t/14)}const s=e.p.clone().addScaledVector(jt,1.4).addScaledVector(e.side,n);rs.position.copy(s);const r=new Tt().makeBasis(e.side,jt,e.tangent);rs.quaternion.setFromRotationMatrix(r);const a=Math.abs(h.rivalDistance-h.totalDistance)<26&&Yn==="cockpit";rs.visible=(h.mode==="race"||h.mode==="paused")&&!h.practice&&!a}function Pv(i,e){const t=e.side.clone().multiplyScalar(h.lateral),n=e.p.clone().add(t);n.y=h.y;const s=h.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),Fe.position.copy(n);const r=Math.abs(h.speed),a=68+Math.min(10,r*.055)+(h.boosting?3:0)+h.cameraZoom*12;Math.abs(Fe.fov-a)>.02&&(Fe.fov+=(a-Fe.fov)*(1-Math.pow(.004,i)),Fe.updateProjectionMatrix());const o=dt(h.s+34+h.speed*.16),l=o.p.clone().addScaledVector(o.side,h.lateral*.45);l.y+=1.7+h.camLookPitch*12+Math.sin(h.time*8)*Math.min(.2,r/680),rn.position.copy(Fe.position),rn.lookAt(l),rn.rotateY(Math.PI),rn.rotateY(-h.camLookYaw),rn.rotateZ(-e.bank*.72-h.lateralVel*.006),rn.rotateX(e.grade*.18+(h.grounded?0:De.clamp(h.yVel,-30,30)*-.006)),Fe.quaternion.slerp(rn.quaternion,1-Math.pow(8e-4,i))}function Hl(i,e,t,n){let s=1/0;const r=re.width*.5+2.2;for(const a of Mc()){if(a.courseIndex!==Mr||a.y<t||a.y>n||a.y>=s)continue;const o=i-a.x,l=e-a.z;o*o+l*l<r*r&&(s=a.y)}return s}function Lv(i,e){const t=Math.abs(h.speed),n=h.y-2.1;let s=12.8+t*.05+De.clamp(h.cameraZoom,-.42,.9)*8,r=4.6+t*.014+h.camLookPitch*10,a=dt(h.s-s),o=Hl(a.p.x,a.p.z,n+5,n+64);o-1.5<a.p.y+2&&(s=6.4,r=2.7,a=dt(h.s-s),o=Hl(a.p.x,a.p.z,n+5,n+64));let l=De.lerp(a.p.y,n,.62)+r;const c=vc.set(a.p.x+a.side.x*h.lateral*.72,0,a.p.z+a.side.z*h.lateral*.72);if(l=Math.max(l,a.p.y+2.35,We(c.x,c.z)+2.8),o<1/0&&(l=Math.min(l,o-1.5)),c.y=l,h.cameraShake>.01){const m=h.cameraShake;c.x+=(Math.random()-.5)*m*1.1,c.y+=(Math.random()-.5)*m*.6,c.z+=(Math.random()-.5)*m*1.1}Fe.position.distanceTo(c)>70&&Fe.position.copy(c),Fe.position.lerp(c,1-Math.pow(2e-4,i)),Fe.position.y=Math.max(Fe.position.y,a.p.y+2.05),o<1/0&&(Fe.position.y=Math.min(Fe.position.y,o-1.4));const u=dt(h.s+17+t*.09),f=u.p.clone().addScaledVector(u.side,h.lateral*.55);f.y+=2.1+h.camLookPitch*12,h.grounded||(f.y=De.lerp(f.y,h.y+1.2,.5)),rn.position.copy(Fe.position),rn.lookAt(f),rn.rotateY(Math.PI),rn.rotateY(-h.camLookYaw),rn.rotateZ(-e.bank*.42-h.lateralVel*.0034),Fe.quaternion.slerp(rn.quaternion,1-Math.pow(4e-4,i));const p=66+Math.min(11,t*.055)+(h.boosting?5:0)+De.clamp(h.cameraZoom,-.42,.9)*10;Math.abs(Fe.fov-p)>.02&&(Fe.fov+=(p-Fe.fov)*(1-Math.pow(.004,i)),Fe.updateProjectionMatrix())}function Dv(){const i=h.mode==="race"||h.mode==="paused"||h.mode==="result",e=i&&Yn==="chase"&&!window.__freeCam;if(Mn&&(Mn.visible=!e),kt.visible!==e&&(kt.visible=e),!e)return;const t=dt(h.s);kt.position.set(t.p.x+t.side.x*h.lateral,h.y-.72,t.p.z+t.side.z*h.lateral);const n=new Tt().makeBasis(t.side,jt,t.tangent);kt.quaternion.setFromRotationMatrix(n),h.grounded?(kt.rotateX(-t.grade*.5),kt.rotateZ(t.bank*.6+De.clamp(h.lateralVel*.012,-.16,.16))):kt.rotateX(De.clamp(-h.yVel*.011,-.34,.4));const s=kt.userData.frontWheels,r=De.clamp(-h.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=r,s[1].rotation.y=r)}function Ec(i){if(window.__freeCam)return;lu(i);const e=dt(h.s);Yn==="chase"&&h.mode!=="menu"?Lv(i,e):Pv(i,e),h.cameraShake=Math.max(0,h.cameraShake-i*1.9);const t=Ka.set(0,0,-1).applyQuaternion(Fe.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.y,yVel:h.yVel,grounded:h.grounded,input:{steer:Le.steer,throttle:Le.throttle,brake:Le.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const ns={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},dr=[28,54,82,110,134,156];function Iv(){const i=Math.abs(h.speed);let e=1;for(let o=0;o<dr.length;o++)i>dr[o]&&(e=o+2);e=Math.min(e,dr.length);const t=e===1?0:dr[e-2],n=dr[e-1],s=n>t?De.clamp((i-t)/(n-t),0,1):0,r=e===1?ns.idle:ns.postShift;let a=r+s*(ns.shift-r);return i<.4&&(a=ns.idle),{gear:e,rpm:a}}let Kh=performance.now(),Ho=0,Wo=0;function uu(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:l=>Math.PI-l*Math.PI,at:(l,c)=>[r+Math.cos(l)*c,a-Math.sin(l)*c]}}function Uv(i,e){const t=et.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:l}=uu(t),c=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=c;g+=20){const _=g/c,x=o(_),d=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=d?Math.max(1.4,a*.035):Math.max(1,a*.02);const v=l(x,a-a*.02),M=l(x,a-a*(d?.18:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(M[0],M[1]),n.stroke(),d){const y=l(x,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),y[0],y[1])}}const u=De.clamp(i/c,0,1),f=o(u),p=l(f,a-a*.06),m=l(f+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(m[0],m[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function Fv(i,e){const t=et.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:l}=uu(t),c=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const u=De.clamp(i,0,1),f=i<.25;n.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(u),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let _=0;_<=c;_+=3){const x=_/c,d=o(x),v=_%6===0;n.strokeStyle=_>=c*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=v?Math.max(1.3,a*.03):Math.max(1,a*.018);const M=l(d,a-a*.02),y=l(d,a-a*(v?.17:.1));if(n.beginPath(),n.moveTo(M[0],M[1]),n.lineTo(y[0],y[1]),n.stroke(),v){const E=l(d,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(_),E[0],E[1])}}const p=o(u),m=l(p,a-a*.06),g=l(p+Math.PI,a*.14);n.strokeStyle=f?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function Nv(i,e){const t=et.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,l=a-a*.14,c=Math.min(r*.46,a*.9),u=ns.max,f=M=>Math.PI-M*Math.PI,p=(M,y)=>[o+Math.cos(M)*y,l-Math.sin(M)*y];n.lineCap="round",n.lineWidth=Math.max(2,c*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,l,c,f(1),f(0)),n.stroke();const m=ns.redline/u;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,l,c,f(1),f(m)),n.stroke(),n.font=`700 ${Math.max(7,c*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let M=0;M<=9;M++){const y=M/9,E=f(y),T=M*1e3>=ns.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,c*.035);const R=p(E,c-c*.02),C=p(E,c-c*.18);n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(C[0],C[1]),n.stroke();const w=p(E,c-c*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(M),w[0],w[1]),M<9){const S=f((M+.5)/9),L=p(S,c-c*.02),U=p(S,c-c*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,c*.02),n.beginPath(),n.moveTo(L[0],L[1]),n.lineTo(U[0],U[1]),n.stroke()}}const g=De.clamp(i/u,0,1),_=f(g),x=p(_,c-c*.06),d=p(_+Math.PI,c*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=c*.18,n.lineWidth=Math.max(1.8,c*.05),n.beginPath(),n.moveTo(d[0],d[1]),n.lineTo(x[0],x[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,c*.03),n.beginPath(),n.arc(o,l,c*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,c*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,l-c*.26);const v=h.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,c*.22)}px "Courier New", monospace`,n.fillText(v,o,l+c*.02)}function Tr(){re.length*re.laps;const i=kh(h.practice?h.totalDistance%re.length:h.totalDistance),e=h.practice?0:kh(h.rivalDistance),t=h.practice?"SOLO":h.totalDistance>=h.rivalDistance?"P1":"P2";t!==h.leadState&&h.mode==="race"&&(h.leadState=t,h.practice||(h.message=t==="P1"?"You took the lead":"Crowther ahead",h.messageTimer=.95)),et.damage.style.width=`${Math.round(h.damage)}%`,et.lap.textContent=h.practice?`LAP ${h.lap}`:`${Math.min(h.lap,re.laps)}/${re.laps}`,et.timer.textContent=Wl(h.time);const n=h.mode==="roam";et.score.textContent=n?`Gates ${h.objectiveHits}/${Qt.length}  Score ${Math.round(h.score)}`:`Score ${Math.round(h.score)}`;const s=h.mode==="race"||h.mode==="paused"||n;if(et.position.textContent=n?"FREE ROAM":h.freeRun?"FREE RUN":h.practice?"PRACTICE":`${t} DIV 4`,n&&Qt.length){const u=Qt[h.objectiveIndex%Qt.length];et.trackName.textContent=u?`Next: ${u.label}`:"City Streets"}et.hud.style.display=s?"flex":"none",et.raceStrip.style.display=h.mode==="race"||h.mode==="paused"?"grid":"none",et.touchControls.style.display=s?"":"none",et.playerProgress.style.width=`${Math.round(i*100)}%`,et.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=Iv();h.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-Kh)/1e3);Kh=a;const l=1-Math.exp(-o*(r.rpm>h.tachRpm?10:6));h.tachRpm+=(r.rpm-h.tachRpm)*l,Nv(h.tachRpm,r.gear);const c=Math.abs(h.speed)*2.25;Ho+=(c-Ho)*(1-Math.exp(-o*8)),Wo+=(h.boost-Wo)*(1-Math.exp(-o*9)),Uv(Ho,h.speed<-.5),Fv(Wo,h.boosting),et.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(h.speed)-44)/150)),et.damageFx.style.opacity=h.damage<18?0:Math.min(.72,(h.damage-18)/82),h.mode==="paused"?(et.centerMessage.textContent="Paused",et.centerMessage.classList.remove("hidden")):h.messageTimer>0?(et.centerMessage.textContent=h.message,et.centerMessage.classList.remove("hidden")):et.centerMessage.classList.add("hidden")}function Wl(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function fu(){const i=T1.getDelta(),e=Math.min(.033,i);h.messageTimer>0&&(h.messageTimer-=e),h.mode==="roam"?(au(e),cu(e),vv()):(du(e),Rv(e),Dv(),Ec(e)),_v(),Li&&Li.position.copy(Fe.position),mv(e),jd(e),Tr(),xv(),pr.uniforms.uTime.value+=e,pr.uniforms.uSpeed.value=Math.min(1,Math.abs(h.speed)/150);const t=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&(h.mode==="race"||h.mode==="roam")?1:Math.min(.75,h.roamSlip*.55+h.collisionDrama*.6);pr.uniforms.uBoost.value+=(t-pr.uniforms.uBoost.value)*Math.min(1,e*6),Js.render(),requestAnimationFrame(fu)}window.addEventListener("keydown",i=>{wt.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyC"&&(h.mode==="race"||h.mode==="paused")&&A1(),i.code==="KeyP"&&h.mode==="race"?(h.mode="paused",wt.clear(),Wa()):i.code==="KeyP"&&h.mode==="paused"?h.mode="race":i.code==="Escape"&&(h.mode==="race"||h.mode==="paused"||h.mode==="roam")&&(h.mode="menu",Wa(),kt.visible=!1,Mn&&(Mn.visible=!0),document.body.classList.remove("roam-mode"),ds(),et.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>wt.delete(i.code));window.addEventListener("resize",()=>{Fe.aspect=window.innerWidth/window.innerHeight,Fe.updateProjectionMatrix(),an.setSize(window.innerWidth,window.innerHeight),Js.setSize(window.innerWidth,window.innerHeight),tu.setSize(window.innerWidth,window.innerHeight)});et.startBtn.addEventListener("click",()=>ja(!1));et.practiceBtn.addEventListener("click",()=>ja(!0));et.freeRunBtn.addEventListener("click",()=>ja(!0,!0));et.roamBtn.addEventListener("click",()=>wc());et.againBtn.addEventListener("click",()=>ja(!1));et.courseButtons.forEach(i=>{i.addEventListener("click",()=>yc(Number(i.dataset.course)))});function pu(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function Wa(){Le.steer=0,Le.throttle=0,Le.brake=0,Le.lookX=0,Le.lookY=0,Le.zoom=0,Le.lookPointer=null,Le.drivePointer=null,Le.pinchStartDistance=0,Le.pinchStartZoom=0;for(const i of et.touchControls.querySelectorAll(".touch-stick"))pu(i)}function ba(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=De.clamp(e.clientX-(t.left+t.width/2),-n,n),r=De.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Le.lookX=De.clamp(s/n,-1,1),Le.lookY=De.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Le.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Le.lookY*n)}px`);else{const o=De.clamp(s/n,-1,1),l=De.clamp(-r/n,-1,1);Le.steer=o,Le.throttle=Math.max(0,l),Le.brake=Math.max(0,-l),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-l*n)}px`)}}function Jh(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function jh(i,e){e==="look"?(Le.lookX=0,Le.lookY=0,Le.lookPointer=null):(Le.steer=0,Le.throttle=0,Le.brake=0,Le.drivePointer=null),pu(i)}function zv(i,e){return Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY)}function mu(i,e=!1){if(i.touches.length<2){Le.pinchStartDistance=0;return}const t=zv(i.touches[0],i.touches[1]);if(e||!(Le.pinchStartDistance>0)){Le.pinchStartDistance=t,Le.pinchStartZoom=Le.zoom;return}const n=Math.max(.2,t/Le.pinchStartDistance);Le.zoom=De.clamp(Le.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of et.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),Ga(),h.mode==="paused"&&(h.mode="race"),e==="look"&&(Le.lookPointer=s.pointerId),e==="drive"&&(Le.drivePointer=s.pointerId),ba(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="look"?Le.lookPointer:Le.drivePointer)===s.pointerId&&(s.preventDefault(),ba(i,s))},{passive:!1});const t=s=>{(e==="look"?Le.lookPointer:Le.drivePointer)===s.pointerId&&jh(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),Ga(),h.mode==="paused"&&(h.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Le.lookPointer=r.identifier),e==="drive"&&(Le.drivePointer=r.identifier),ba(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="look"?Le.lookPointer:Le.drivePointer,a=Jh(s,r);a&&(s.preventDefault(),ba(i,a))},{passive:!1});const n=s=>{const r=e==="look"?Le.lookPointer:Le.drivePointer;Jh(s,r)&&(s.preventDefault(),jh(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of et.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),Ga(),wt.add(e),i.setPointerCapture(n.pointerId)});const t=()=>wt.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}Br.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),mu(i,!0))},{passive:!1});Br.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),mu(i))},{passive:!1});Br.addEventListener("touchend",i=>{i.touches.length<2&&(Le.pinchStartDistance=0)},{passive:!1});Br.addEventListener("touchcancel",()=>{Le.pinchStartDistance=0},{passive:!1});const Ov=dt(h.s);h.y=Ov.p.y+2.1;h.lastSafeS=h.s;h.lastSafeDistance=h.totalDistance;Ec(.016);Tr();fu();
