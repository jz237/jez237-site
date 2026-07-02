(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Qc="181",p0=0,kh=1,m0=2,_u=1,yu=2,Vi=3,xs=0,An=1,vt=2,Ai=0,mr=1,di=2,Vh=3,Gh=4,x0=5,Ls=100,g0=101,v0=102,M0=103,_0=104,y0=200,b0=201,S0=202,w0=203,Yl=204,$l=205,T0=206,E0=207,A0=208,C0=209,R0=210,P0=211,L0=212,D0=213,I0=214,Zl=0,Kl=1,Jl=2,br=3,jl=4,Ql=5,ec=6,tc=7,eh=0,U0=1,F0=2,fs=0,bu=1,Su=2,wu=3,th=4,Tu=5,Eu=6,Au=7,Cu=300,Sr=301,wr=302,nc=303,ic=304,ko=306,Rn=1e3,Wi=1001,sc=1002,Xn=1003,N0=1004,Fa=1005,jn=1006,tl=1007,Is=1008,Di=1009,Ru=1010,Pu=1011,ua=1012,nh=1013,Os=1014,wi=1015,Ci=1016,ih=1017,sh=1018,fa=1020,Lu=35902,Du=35899,Iu=1021,Uu=1022,ui=1023,pa=1026,ma=1027,rh=1028,ah=1029,oh=1030,lh=1031,ch=1033,go=33776,vo=33777,Mo=33778,_o=33779,rc=35840,ac=35841,oc=35842,lc=35843,cc=36196,hc=37492,dc=37496,uc=37808,fc=37809,pc=37810,mc=37811,xc=37812,gc=37813,vc=37814,Mc=37815,_c=37816,yc=37817,bc=37818,Sc=37819,wc=37820,Tc=37821,Ec=36492,Ac=36494,Cc=36495,Rc=36283,Pc=36284,Lc=36285,Dc=36286,z0=3200,O0=3201,hh=0,B0=1,cs="",Rt="srgb",Tr="srgb-linear",Eo="linear",Gt="srgb",qs=7680,Hh=519,k0=512,V0=513,G0=514,Fu=515,H0=516,W0=517,X0=518,q0=519,Ic=35044,Wh="300 es",Ti=2e3,Ao=2001;function Nu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Co(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Y0(){const n=Co("canvas");return n.style.display="block",n}const Xh={};function Ro(...n){const e="THREE."+n.shift();console.log(e,...n)}function mt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function en(...n){const e="THREE."+n.shift();console.error(e,...n)}function xa(...n){const e=n.join(" ");e in Xh||(Xh[e]=!0,mt(...n))}function $0(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class Rr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const bn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let qh=1234567;const Qr=Math.PI/180,ga=180/Math.PI;function Ri(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(bn[n&255]+bn[n>>8&255]+bn[n>>16&255]+bn[n>>24&255]+"-"+bn[e&255]+bn[e>>8&255]+"-"+bn[e>>16&15|64]+bn[e>>24&255]+"-"+bn[t&63|128]+bn[t>>8&255]+"-"+bn[t>>16&255]+bn[t>>24&255]+bn[i&255]+bn[i>>8&255]+bn[i>>16&255]+bn[i>>24&255]).toLowerCase()}function Tt(n,e,t){return Math.max(e,Math.min(t,n))}function dh(n,e){return(n%e+e)%e}function Z0(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function K0(n,e,t){return n!==e?(t-n)/(e-n):0}function ea(n,e,t){return(1-t)*n+t*e}function J0(n,e,t,i){return ea(n,e,1-Math.exp(-t*i))}function j0(n,e=1){return e-Math.abs(dh(n,e*2)-e)}function Q0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function ep(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function tp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function np(n,e){return n+Math.random()*(e-n)}function ip(n){return n*(.5-Math.random())}function sp(n){n!==void 0&&(qh=n);let e=qh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function rp(n){return n*Qr}function ap(n){return n*ga}function op(n){return(n&n-1)===0&&n!==0}function lp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function cp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function hp(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),h=r((e+i)/2),d=a((e+i)/2),f=r((e-i)/2),p=a((e-i)/2),m=r((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(o*d,c*f,c*p,o*h);break;case"YZY":n.set(c*p,o*d,c*f,o*h);break;case"ZXZ":n.set(c*f,c*p,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*m,o*h);break;case"YXY":n.set(c*m,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*m,o*d,o*h);break;default:mt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function li(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ht(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const me={DEG2RAD:Qr,RAD2DEG:ga,generateUUID:Ri,clamp:Tt,euclideanModulo:dh,mapLinear:Z0,inverseLerp:K0,lerp:ea,damp:J0,pingpong:j0,smoothstep:Q0,smootherstep:ep,randInt:tp,randFloat:np,randFloatSpread:ip,seededRandom:sp,degToRad:rp,radToDeg:ap,isPowerOfTwo:op,ceilPowerOfTwo:lp,floorPowerOfTwo:cp,setQuaternionFromProperEuler:hp,normalize:Ht,denormalize:li};class De{constructor(e=0,t=0){De.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $i{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],h=i[s+1],d=i[s+2],f=i[s+3],p=r[a+0],m=r[a+1],x=r[a+2],M=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(f!==M||c!==p||h!==m||d!==x){let g=c*p+h*m+d*x+f*M;g<0&&(p=-p,m=-m,x=-x,M=-M,g=-g);let u=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);u=Math.sin(u*y)/v,o=Math.sin(o*y)/v,c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o}else{c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o;const y=1/Math.sqrt(c*c+h*h+d*d+f*f);c*=y,h*=y,d*=y,f*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],f=r[a],p=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+d*f+c*m-h*p,e[t+1]=c*x+d*p+h*f-o*m,e[t+2]=h*x+d*m+o*p-c*f,e[t+3]=d*x-o*f-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),f=o(r/2),p=c(i/2),m=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"YXZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"ZXY":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"ZYX":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"YZX":this._x=p*d*f+h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f-p*m*x;break;case"XZY":this._x=p*d*f-h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f+p*m*x;break;default:mt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],d=t[6],f=t[10],p=i+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-h)*m,this._z=(a-s)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+h)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(r-h)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-s)/m,this._x=(r+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Tt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+a*o+s*h-r*c,this._y=s*d+a*c+r*o-i*h,this._z=r*d+a*h+i*c-s*o,this._w=a*d-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Yh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Yh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*i),d=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+c*h+a*f-o*d,this.y=i+c*d+o*h-r*f,this.z=s+c*f+r*d-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this.z=Tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this.z=Tt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return nl.copy(this).projectOnVector(e),this.sub(nl)}reflect(e){return this.sub(nl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nl=new L,Yh=new $i;class yt{constructor(e,t,i,s,r,a,o,c,h){yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h)}set(e,t,i,s,r,a,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=i,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],d=i[4],f=i[7],p=i[2],m=i[5],x=i[8],M=s[0],g=s[3],u=s[6],y=s[1],v=s[4],_=s[7],E=s[2],T=s[5],A=s[8];return r[0]=a*M+o*y+c*E,r[3]=a*g+o*v+c*T,r[6]=a*u+o*_+c*A,r[1]=h*M+d*y+f*E,r[4]=h*g+d*v+f*T,r[7]=h*u+d*_+f*A,r[2]=p*M+m*y+x*E,r[5]=p*g+m*v+x*T,r[8]=p*u+m*_+x*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*a*d-t*o*h-i*r*d+i*o*c+s*r*h-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=d*a-o*h,p=o*c-d*r,m=h*r-a*c,x=t*f+i*p+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=f*M,e[1]=(s*h-d*i)*M,e[2]=(o*i-s*a)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*r-o*t)*M,e[6]=m*M,e[7]=(i*c-h*t)*M,e[8]=(a*t-i*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(il.makeScale(e,t)),this}rotate(e){return this.premultiply(il.makeRotation(-e)),this}translate(e,t){return this.premultiply(il.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const il=new yt,$h=new yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zh=new yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dp(){const n={enabled:!0,workingColorSpace:Tr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Gt&&(s.r=Xi(s.r),s.g=Xi(s.g),s.b=Xi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Gt&&(s.r=xr(s.r),s.g=xr(s.g),s.b=xr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===cs?Eo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xa("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xa("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Tr]:{primaries:e,whitePoint:i,transfer:Eo,toXYZ:$h,fromXYZ:Zh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:i,transfer:Gt,toXYZ:$h,fromXYZ:Zh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),n}const Lt=dp();function Xi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ys;class up{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ys===void 0&&(Ys=Co("canvas")),Ys.width=e.width,Ys.height=e.height;const s=Ys.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ys}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Co("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Xi(t[i]/255)*255):t[i]=Xi(t[i]);return{data:t,width:e.width,height:e.height}}else return mt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let fp=0;class uh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=Ri(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(sl(s[a].image)):r.push(sl(s[a]))}else r=sl(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function sl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?up.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(mt("Texture: Unable to serialize Texture."),{})}let pp=0;const rl=new L;class Cn extends Rr{constructor(e=Cn.DEFAULT_IMAGE,t=Cn.DEFAULT_MAPPING,i=Wi,s=Wi,r=jn,a=Is,o=ui,c=Di,h=Cn.DEFAULT_ANISOTROPY,d=cs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=Ri(),this.name="",this.source=new uh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new De(0,0),this.repeat=new De(1,1),this.center=new De(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(rl).x}get height(){return this.source.getSize(rl).y}get depth(){return this.source.getSize(rl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){mt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){mt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Rn:e.x=e.x-Math.floor(e.x);break;case Wi:e.x=e.x<0?0:1;break;case sc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Rn:e.y=e.y-Math.floor(e.y);break;case Wi:e.y=e.y<0?0:1;break;case sc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Cn.DEFAULT_IMAGE=null;Cn.DEFAULT_MAPPING=Cu;Cn.DEFAULT_ANISOTROPY=1;class Wt{constructor(e=0,t=0,i=0,s=1){Wt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,h=c[0],d=c[4],f=c[8],p=c[1],m=c[5],x=c[9],M=c[2],g=c[6],u=c[10];if(Math.abs(d-p)<.01&&Math.abs(f-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(f+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,_=(m+1)/2,E=(u+1)/2,T=(d+p)/4,A=(f+M)/4,R=(x+g)/4;return v>_&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=A/i):_>E?_<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),i=T/s,r=R/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=A/r,s=R/r),this.set(i,s,r,t),this}let y=Math.sqrt((g-x)*(g-x)+(f-M)*(f-M)+(p-d)*(p-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(f-M)/y,this.z=(p-d)/y,this.w=Math.acos((h+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this.z=Tt(this.z,e.z,t.z),this.w=Tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this.z=Tt(this.z,e,t),this.w=Tt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mp extends Rr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Wt(0,0,e,t),this.scissorTest=!1,this.viewport=new Wt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Cn(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:jn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new uh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pi extends mp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class zu extends Cn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=Wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xp extends Cn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=Wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hs{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ni.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ni.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ni.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ni):ni.fromBufferAttribute(r,a),ni.applyMatrix4(e.matrixWorld),this.expandByPoint(ni);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Na.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Na.copy(i.boundingBox)),Na.applyMatrix4(e.matrixWorld),this.union(Na)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ni),ni.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zr),za.subVectors(this.max,zr),$s.subVectors(e.a,zr),Zs.subVectors(e.b,zr),Ks.subVectors(e.c,zr),Ji.subVectors(Zs,$s),ji.subVectors(Ks,Zs),ys.subVectors($s,Ks);let t=[0,-Ji.z,Ji.y,0,-ji.z,ji.y,0,-ys.z,ys.y,Ji.z,0,-Ji.x,ji.z,0,-ji.x,ys.z,0,-ys.x,-Ji.y,Ji.x,0,-ji.y,ji.x,0,-ys.y,ys.x,0];return!al(t,$s,Zs,Ks,za)||(t=[1,0,0,0,1,0,0,0,1],!al(t,$s,Zs,Ks,za))?!1:(Oa.crossVectors(Ji,ji),t=[Oa.x,Oa.y,Oa.z],al(t,$s,Zs,Ks,za))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ni).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ni).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Fi=[new L,new L,new L,new L,new L,new L,new L,new L],ni=new L,Na=new Hs,$s=new L,Zs=new L,Ks=new L,Ji=new L,ji=new L,ys=new L,zr=new L,za=new L,Oa=new L,bs=new L;function al(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){bs.fromArray(n,r);const o=s.x*Math.abs(bs.x)+s.y*Math.abs(bs.y)+s.z*Math.abs(bs.z),c=e.dot(bs),h=t.dot(bs),d=i.dot(bs);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const gp=new Hs,Or=new L,ol=new L;class Pr{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):gp.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Or.subVectors(e,this.center);const t=Or.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Or,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Or.copy(e.center).add(ol)),this.expandByPoint(Or.copy(e.center).sub(ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ni=new L,ll=new L,Ba=new L,Qi=new L,cl=new L,ka=new L,hl=new L;class fh{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ni.copy(this.origin).addScaledVector(this.direction,t),Ni.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ll.copy(e).add(t).multiplyScalar(.5),Ba.copy(t).sub(e).normalize(),Qi.copy(this.origin).sub(ll);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ba),o=Qi.dot(this.direction),c=-Qi.dot(Ba),h=Qi.lengthSq(),d=Math.abs(1-a*a);let f,p,m,x;if(d>0)if(f=a*c-o,p=a*o-c,x=r*d,f>=0)if(p>=-x)if(p<=x){const M=1/d;f*=M,p*=M,m=f*(f+a*p+2*o)+p*(a*f+p+2*c)+h}else p=r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p=-r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p<=-x?(f=Math.max(0,-(-a*r+o)),p=f>0?-r:Math.min(Math.max(-r,-c),r),m=-f*f+p*(p+2*c)+h):p<=x?(f=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+h):(f=Math.max(0,-(a*r+o)),p=f>0?r:Math.min(Math.max(-r,-c),r),m=-f*f+p*(p+2*c)+h);else p=a>0?-r:r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ll).addScaledVector(Ba,p),m}intersectSphere(e,t){Ni.subVectors(e.center,this.origin);const i=Ni.dot(this.direction),s=Ni.dot(Ni)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c;const h=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),d>=0?(r=(e.min.y-p.y)*d,a=(e.max.y-p.y)*d):(r=(e.max.y-p.y)*d,a=(e.min.y-p.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-p.z)*f,c=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,c=(e.min.z-p.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ni)!==null}intersectTriangle(e,t,i,s,r){cl.subVectors(t,e),ka.subVectors(i,e),hl.crossVectors(cl,ka);let a=this.direction.dot(hl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Qi.subVectors(this.origin,e);const c=o*this.direction.dot(ka.crossVectors(Qi,ka));if(c<0)return null;const h=o*this.direction.dot(cl.cross(Qi));if(h<0||c+h>a)return null;const d=-o*Qi.dot(hl);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wt{constructor(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g){wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g)}set(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=c,u[2]=h,u[6]=d,u[10]=f,u[14]=p,u[3]=m,u[7]=x,u[11]=M,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new wt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Js.setFromMatrixColumn(e,0).length(),r=1/Js.setFromMatrixColumn(e,1).length(),a=1/Js.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const p=a*d,m=a*f,x=o*d,M=o*f;t[0]=c*d,t[4]=-c*f,t[8]=h,t[1]=m+x*h,t[5]=p-M*h,t[9]=-o*c,t[2]=M-p*h,t[6]=x+m*h,t[10]=a*c}else if(e.order==="YXZ"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p+M*o,t[4]=x*o-m,t[8]=a*h,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=m*o-x,t[6]=M+p*o,t[10]=a*c}else if(e.order==="ZXY"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p-M*o,t[4]=-a*f,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*d,t[9]=M-p*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const p=a*d,m=a*f,x=o*d,M=o*f;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+M,t[1]=c*f,t[5]=M*h+p,t[9]=m*h-x,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const p=a*c,m=a*h,x=o*c,M=o*h;t[0]=c*d,t[4]=M-p*f,t[8]=x*f+m,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-h*d,t[6]=m*f+x,t[10]=p-M*f}else if(e.order==="XZY"){const p=a*c,m=a*h,x=o*c,M=o*h;t[0]=c*d,t[4]=-f,t[8]=h*d,t[1]=p*f+M,t[5]=a*d,t[9]=m*f-x,t[2]=x*f-m,t[6]=o*d,t[10]=M*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vp,e,Mp)}lookAt(e,t,i){const s=this.elements;return Vn.subVectors(e,t),Vn.lengthSq()===0&&(Vn.z=1),Vn.normalize(),es.crossVectors(i,Vn),es.lengthSq()===0&&(Math.abs(i.z)===1?Vn.x+=1e-4:Vn.z+=1e-4,Vn.normalize(),es.crossVectors(i,Vn)),es.normalize(),Va.crossVectors(Vn,es),s[0]=es.x,s[4]=Va.x,s[8]=Vn.x,s[1]=es.y,s[5]=Va.y,s[9]=Vn.y,s[2]=es.z,s[6]=Va.z,s[10]=Vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],d=i[1],f=i[5],p=i[9],m=i[13],x=i[2],M=i[6],g=i[10],u=i[14],y=i[3],v=i[7],_=i[11],E=i[15],T=s[0],A=s[4],R=s[8],w=s[12],b=s[1],P=s[5],I=s[9],V=s[13],j=s[2],te=s[6],q=s[10],Z=s[14],ne=s[3],ue=s[7],ve=s[11],We=s[15];return r[0]=a*T+o*b+c*j+h*ne,r[4]=a*A+o*P+c*te+h*ue,r[8]=a*R+o*I+c*q+h*ve,r[12]=a*w+o*V+c*Z+h*We,r[1]=d*T+f*b+p*j+m*ne,r[5]=d*A+f*P+p*te+m*ue,r[9]=d*R+f*I+p*q+m*ve,r[13]=d*w+f*V+p*Z+m*We,r[2]=x*T+M*b+g*j+u*ne,r[6]=x*A+M*P+g*te+u*ue,r[10]=x*R+M*I+g*q+u*ve,r[14]=x*w+M*V+g*Z+u*We,r[3]=y*T+v*b+_*j+E*ne,r[7]=y*A+v*P+_*te+E*ue,r[11]=y*R+v*I+_*q+E*ve,r[15]=y*w+v*V+_*Z+E*We,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],d=e[2],f=e[6],p=e[10],m=e[14],x=e[3],M=e[7],g=e[11],u=e[15];return x*(+r*c*f-s*h*f-r*o*p+i*h*p+s*o*m-i*c*m)+M*(+t*c*m-t*h*p+r*a*p-s*a*m+s*h*d-r*c*d)+g*(+t*h*f-t*o*m-r*a*f+i*a*m+r*o*d-i*h*d)+u*(-s*o*d-t*c*f+t*o*p+s*a*f-i*a*p+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=e[9],p=e[10],m=e[11],x=e[12],M=e[13],g=e[14],u=e[15],y=f*g*h-M*p*h+M*c*m-o*g*m-f*c*u+o*p*u,v=x*p*h-d*g*h-x*c*m+a*g*m+d*c*u-a*p*u,_=d*M*h-x*f*h+x*o*m-a*M*m-d*o*u+a*f*u,E=x*f*c-d*M*c-x*o*p+a*M*p+d*o*g-a*f*g,T=t*y+i*v+s*_+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=y*A,e[1]=(M*p*r-f*g*r-M*s*m+i*g*m+f*s*u-i*p*u)*A,e[2]=(o*g*r-M*c*r+M*s*h-i*g*h-o*s*u+i*c*u)*A,e[3]=(f*c*r-o*p*r-f*s*h+i*p*h+o*s*m-i*c*m)*A,e[4]=v*A,e[5]=(d*g*r-x*p*r+x*s*m-t*g*m-d*s*u+t*p*u)*A,e[6]=(x*c*r-a*g*r-x*s*h+t*g*h+a*s*u-t*c*u)*A,e[7]=(a*p*r-d*c*r+d*s*h-t*p*h-a*s*m+t*c*m)*A,e[8]=_*A,e[9]=(x*f*r-d*M*r-x*i*m+t*M*m+d*i*u-t*f*u)*A,e[10]=(a*M*r-x*o*r+x*i*h-t*M*h-a*i*u+t*o*u)*A,e[11]=(d*o*r-a*f*r-d*i*h+t*f*h+a*i*m-t*o*m)*A,e[12]=E*A,e[13]=(d*M*s-x*f*s+x*i*p-t*M*p-d*i*g+t*f*g)*A,e[14]=(x*o*s-a*M*s-x*i*c+t*M*c+a*i*g-t*o*g)*A,e[15]=(a*f*s-d*o*s+d*i*c-t*f*c-a*i*p+t*o*p)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,h=r*a,d=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*a,0,h*c-s*o,d*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,d=a+a,f=o+o,p=r*h,m=r*d,x=r*f,M=a*d,g=a*f,u=o*f,y=c*h,v=c*d,_=c*f,E=i.x,T=i.y,A=i.z;return s[0]=(1-(M+u))*E,s[1]=(m+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-_)*T,s[5]=(1-(p+u))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(x+v)*A,s[9]=(g-y)*A,s[10]=(1-(p+M))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Js.set(s[0],s[1],s[2]).length();const a=Js.set(s[4],s[5],s[6]).length(),o=Js.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ii.copy(this);const h=1/r,d=1/a,f=1/o;return ii.elements[0]*=h,ii.elements[1]*=h,ii.elements[2]*=h,ii.elements[4]*=d,ii.elements[5]*=d,ii.elements[6]*=d,ii.elements[8]*=f,ii.elements[9]*=f,ii.elements[10]*=f,t.setFromRotationMatrix(ii),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=Ti,c=!1){const h=this.elements,d=2*r/(t-e),f=2*r/(i-s),p=(t+e)/(t-e),m=(i+s)/(i-s);let x,M;if(c)x=r/(a-r),M=a*r/(a-r);else if(o===Ti)x=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===Ao)x=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=f,h[9]=m,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Ti,c=!1){const h=this.elements,d=2/(t-e),f=2/(i-s),p=-(t+e)/(t-e),m=-(i+s)/(i-s);let x,M;if(c)x=1/(a-r),M=a/(a-r);else if(o===Ti)x=-2/(a-r),M=-(a+r)/(a-r);else if(o===Ao)x=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=f,h[9]=0,h[13]=m,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Js=new L,ii=new wt,vp=new L(0,0,0),Mp=new L(1,1,1),es=new L,Va=new L,Vn=new L,Kh=new wt,Jh=new $i;class xi{constructor(e=0,t=0,i=0,s=xi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],d=s[9],f=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Tt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Tt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Tt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:mt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Kh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jh.setFromEuler(this),this.setFromQuaternion(Jh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xi.DEFAULT_ORDER="XYZ";class ph{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _p=0;const jh=new L,js=new $i,zi=new wt,Ga=new L,Br=new L,yp=new L,bp=new $i,Qh=new L(1,0,0),ed=new L(0,1,0),td=new L(0,0,1),nd={type:"added"},Sp={type:"removed"},Qs={type:"childadded",child:null},dl={type:"childremoved",child:null};class zt extends Rr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new L,t=new xi,i=new $i,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new wt},normalMatrix:{value:new yt}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.multiply(js),this}rotateOnWorldAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.premultiply(js),this}rotateX(e){return this.rotateOnAxis(Qh,e)}rotateY(e){return this.rotateOnAxis(ed,e)}rotateZ(e){return this.rotateOnAxis(td,e)}translateOnAxis(e,t){return jh.copy(e).applyQuaternion(this.quaternion),this.position.add(jh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qh,e)}translateY(e){return this.translateOnAxis(ed,e)}translateZ(e){return this.translateOnAxis(td,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(zi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ga.copy(e):Ga.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zi.lookAt(Br,Ga,this.up):zi.lookAt(Ga,Br,this.up),this.quaternion.setFromRotationMatrix(zi),s&&(zi.extractRotation(s.matrixWorld),js.setFromRotationMatrix(zi),this.quaternion.premultiply(js.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(en("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(nd),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null):en("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sp),dl.child=e,this.dispatchEvent(dl),dl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),zi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),zi.multiply(e.parent.matrixWorld)),e.applyMatrix4(zi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(nd),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,e,yp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,bp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const f=c[h];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),h=a(e.textures),d=a(e.images),f=a(e.shapes),p=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}zt.DEFAULT_UP=new L(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new L,Oi=new L,ul=new L,Bi=new L,er=new L,tr=new L,id=new L,fl=new L,pl=new L,ml=new L,xl=new Wt,gl=new Wt,vl=new Wt;class Jn{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),si.subVectors(e,t),s.cross(si);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){si.subVectors(s,t),Oi.subVectors(i,t),ul.subVectors(e,t);const a=si.dot(si),o=si.dot(Oi),c=si.dot(ul),h=Oi.dot(Oi),d=Oi.dot(ul),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;const p=1/f,m=(h*c-o*d)*p,x=(a*d-o*c)*p;return r.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,Bi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bi.x),c.addScaledVector(a,Bi.y),c.addScaledVector(o,Bi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return xl.setScalar(0),gl.setScalar(0),vl.setScalar(0),xl.fromBufferAttribute(e,t),gl.fromBufferAttribute(e,i),vl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(xl,r.x),a.addScaledVector(gl,r.y),a.addScaledVector(vl,r.z),a}static isFrontFacing(e,t,i,s){return si.subVectors(i,t),Oi.subVectors(e,t),si.cross(Oi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return si.subVectors(this.c,this.b),Oi.subVectors(this.a,this.b),si.cross(Oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Jn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;er.subVectors(s,i),tr.subVectors(r,i),fl.subVectors(e,i);const c=er.dot(fl),h=tr.dot(fl);if(c<=0&&h<=0)return t.copy(i);pl.subVectors(e,s);const d=er.dot(pl),f=tr.dot(pl);if(d>=0&&f<=d)return t.copy(s);const p=c*f-d*h;if(p<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(i).addScaledVector(er,a);ml.subVectors(e,r);const m=er.dot(ml),x=tr.dot(ml);if(x>=0&&m<=x)return t.copy(r);const M=m*h-c*x;if(M<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(tr,o);const g=d*x-m*f;if(g<=0&&f-d>=0&&m-x>=0)return id.subVectors(r,s),o=(f-d)/(f-d+(m-x)),t.copy(s).addScaledVector(id,o);const u=1/(g+M+p);return a=M*u,o=p*u,t.copy(i).addScaledVector(er,a).addScaledVector(tr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ts={h:0,s:0,l:0},Ha={h:0,s:0,l:0};function Ml(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class it{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Lt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Lt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Lt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Lt.workingColorSpace){if(e=dh(e,1),t=Tt(t,0,1),i=Tt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Ml(a,r,e+1/3),this.g=Ml(a,r,e),this.b=Ml(a,r,e-1/3)}return Lt.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function i(r){r!==void 0&&parseFloat(r)<1&&mt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:mt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);mt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){const i=Ou[e.toLowerCase()];return i!==void 0?this.setHex(i,t):mt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}copyLinearToSRGB(e){return this.r=xr(e.r),this.g=xr(e.g),this.b=xr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return Lt.workingToColorSpace(Sn.copy(this),e),Math.round(Tt(Sn.r*255,0,255))*65536+Math.round(Tt(Sn.g*255,0,255))*256+Math.round(Tt(Sn.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Lt.workingColorSpace){Lt.workingToColorSpace(Sn.copy(this),t);const i=Sn.r,s=Sn.g,r=Sn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,h;const d=(o+a)/2;if(o===a)c=0,h=0;else{const f=a-o;switch(h=d<=.5?f/(a+o):f/(2-a-o),a){case i:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-i)/f+2;break;case r:c=(i-s)/f+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=Lt.workingColorSpace){return Lt.workingToColorSpace(Sn.copy(this),t),e.r=Sn.r,e.g=Sn.g,e.b=Sn.b,e}getStyle(e=Rt){Lt.workingToColorSpace(Sn.copy(this),e);const t=Sn.r,i=Sn.g,s=Sn.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ts),this.setHSL(ts.h+e,ts.s+t,ts.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ts),e.getHSL(Ha);const i=ea(ts.h,Ha.h,t),s=ea(ts.s,Ha.s,t),r=ea(ts.l,Ha.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Sn=new it;it.NAMES=Ou;let wp=0;class Ms extends Rr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wp++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=mr,this.side=xs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yl,this.blendDst=$l,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=br,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qs,this.stencilZFail=qs,this.stencilZPass=qs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){mt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){mt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==mr&&(i.blending=this.blending),this.side!==xs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yl&&(i.blendSrc=this.blendSrc),this.blendDst!==$l&&(i.blendDst=this.blendDst),this.blendEquation!==Ls&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==br&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==qs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==qs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ct extends Ms{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const on=new L,Wa=new De;let Tp=0;class qn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ic,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Wa.fromBufferAttribute(this,t),Wa.applyMatrix3(e),this.setXY(t,Wa.x,Wa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyMatrix3(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyMatrix4(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyNormalMatrix(e),this.setXYZ(t,on.x,on.y,on.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.transformDirection(e),this.setXYZ(t,on.x,on.y,on.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=li(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ht(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=li(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=li(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=li(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array),s=Ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array),s=Ht(s,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ic&&(e.usage=this.usage),e}}class Bu extends qn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ku extends qn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class bt extends qn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Ep=0;const Zn=new wt,_l=new zt,nr=new L,Gn=new Hs,kr=new Hs,pn=new L;class Zt extends Rr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ep++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nu(e)?ku:Bu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new yt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Zn.makeRotationFromQuaternion(e),this.applyMatrix4(Zn),this}rotateX(e){return Zn.makeRotationX(e),this.applyMatrix4(Zn),this}rotateY(e){return Zn.makeRotationY(e),this.applyMatrix4(Zn),this}rotateZ(e){return Zn.makeRotationZ(e),this.applyMatrix4(Zn),this}translate(e,t,i){return Zn.makeTranslation(e,t,i),this.applyMatrix4(Zn),this}scale(e,t,i){return Zn.makeScale(e,t,i),this.applyMatrix4(Zn),this}lookAt(e){return _l.lookAt(e),_l.updateMatrix(),this.applyMatrix4(_l.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(nr).negate(),this.translate(nr.x,nr.y,nr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new bt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&mt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){en("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Gn.setFromBufferAttribute(r),this.morphTargetsRelative?(pn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(pn),pn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(pn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&en('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){en("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Gn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];kr.setFromBufferAttribute(o),this.morphTargetsRelative?(pn.addVectors(Gn.min,kr.min),Gn.expandByPoint(pn),pn.addVectors(Gn.max,kr.max),Gn.expandByPoint(pn)):(Gn.expandByPoint(kr.min),Gn.expandByPoint(kr.max))}Gn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)pn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(pn));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)pn.fromBufferAttribute(o,h),c&&(nr.fromBufferAttribute(e,h),pn.add(nr)),s=Math.max(s,i.distanceToSquared(pn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&en('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){en("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new L,c[R]=new L;const h=new L,d=new L,f=new L,p=new De,m=new De,x=new De,M=new L,g=new L;function u(R,w,b){h.fromBufferAttribute(i,R),d.fromBufferAttribute(i,w),f.fromBufferAttribute(i,b),p.fromBufferAttribute(r,R),m.fromBufferAttribute(r,w),x.fromBufferAttribute(r,b),d.sub(h),f.sub(h),m.sub(p),x.sub(p);const P=1/(m.x*x.y-x.x*m.y);isFinite(P)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(f,-m.y).multiplyScalar(P),g.copy(f).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(P),o[R].add(M),o[w].add(M),o[b].add(M),c[R].add(g),c[w].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,w=y.length;R<w;++R){const b=y[R],P=b.start,I=b.count;for(let V=P,j=P+I;V<j;V+=3)u(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new L,_=new L,E=new L,T=new L;function A(R){E.fromBufferAttribute(s,R),T.copy(E);const w=o[R];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),_.crossVectors(T,w);const P=_.dot(c[R])<0?-1:1;a.setXYZW(R,v.x,v.y,v.z,P)}for(let R=0,w=y.length;R<w;++R){const b=y[R],P=b.start,I=b.count;for(let V=P,j=P+I;V<j;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new qn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const s=new L,r=new L,a=new L,o=new L,c=new L,h=new L,d=new L,f=new L;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),i.setXYZ(p+0,d.x,d.y,d.z),i.setXYZ(p+1,d.x,d.y,d.z),i.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)pn.fromBufferAttribute(e,t),pn.normalize(),e.setXYZ(t,pn.x,pn.y,pn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,f=o.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let M=0,g=c.length;M<g;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*d;for(let u=0;u<d;u++)p[x++]=h[m++]}return new qn(p,d,f)}if(this.index===null)return mt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let d=0,f=h.length;d<f;d++){const p=h[d],m=e(p,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let f=0,p=h.length;f<p;f++){const m=h[f];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const r=e.morphAttributes;for(const h in r){const d=[],f=r[h];for(let p=0,m=f.length;p<m;p++)d.push(f[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,d=a.length;h<d;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sd=new wt,Ss=new fh,Xa=new Pr,rd=new L,qa=new L,Ya=new L,$a=new L,yl=new L,Za=new L,ad=new L,Ka=new L;class O extends zt{constructor(e=new Zt,t=new Ct){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Za.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=o[c],f=r[c];d!==0&&(yl.fromBufferAttribute(f,e),a?Za.addScaledVector(yl,d):Za.addScaledVector(yl.sub(t),d))}t.add(Za)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xa.copy(i.boundingSphere),Xa.applyMatrix4(r),Ss.copy(e.ray).recast(e.near),!(Xa.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(Xa,rd)===null||Ss.origin.distanceToSquared(rd)>(e.far-e.near)**2))&&(sd.copy(r).invert(),Ss.copy(e.ray).applyMatrix4(sd),!(i.boundingBox!==null&&Ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ss)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=a[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=Ja(this,u,e,i,h,d,f,T,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const y=o.getX(g),v=o.getX(g+1),_=o.getX(g+2);s=Ja(this,a,e,i,h,d,f,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=a[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=_,A=_+1,R=_+2;s=Ja(this,u,e,i,h,d,f,T,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const y=g,v=g+1,_=g+2;s=Ja(this,a,e,i,h,d,f,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Ap(n,e,t,i,s,r,a,o){let c;if(e.side===An?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===xs,o),c===null)return null;Ka.copy(o),Ka.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(Ka);return h<t.near||h>t.far?null:{distance:h,point:Ka.clone(),object:n}}function Ja(n,e,t,i,s,r,a,o,c,h){n.getVertexPosition(o,qa),n.getVertexPosition(c,Ya),n.getVertexPosition(h,$a);const d=Ap(n,e,t,i,qa,Ya,$a,ad);if(d){const f=new L;Jn.getBarycoord(ad,qa,Ya,$a,f),s&&(d.uv=Jn.getInterpolatedAttribute(s,o,c,h,f,new De)),r&&(d.uv1=Jn.getInterpolatedAttribute(r,o,c,h,f,new De)),a&&(d.normal=Jn.getInterpolatedAttribute(a,o,c,h,f,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new L,materialIndex:0};Jn.getNormal(qa,Ya,$a,p.normal),d.face=p,d.barycoord=f}return d}class xe extends Zt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],f=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new bt(h,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(f,2));function x(M,g,u,y,v,_,E,T,A,R,w){const b=_/A,P=E/R,I=_/2,V=E/2,j=T/2,te=A+1,q=R+1;let Z=0,ne=0;const ue=new L;for(let ve=0;ve<q;ve++){const We=ve*P-V;for(let U=0;U<te;U++){const Ce=U*b-I;ue[M]=Ce*y,ue[g]=We*v,ue[u]=j,h.push(ue.x,ue.y,ue.z),ue[M]=0,ue[g]=0,ue[u]=T>0?1:-1,d.push(ue.x,ue.y,ue.z),f.push(U/A),f.push(1-ve/R),Z+=1}}for(let ve=0;ve<R;ve++)for(let We=0;We<A;We++){const U=p+We+te*ve,Ce=p+We+te*(ve+1),_e=p+(We+1)+te*(ve+1),Re=p+(We+1)+te*ve;c.push(U,Ce,Re),c.push(Ce,_e,Re),ne+=6}o.addGroup(m,ne,w),m+=ne,p+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Er(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(mt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function In(n){const e={};for(let t=0;t<n.length;t++){const i=Er(n[t]);for(const s in i)e[s]=i[s]}return e}function Cp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Vu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Lt.workingColorSpace}const va={clone:Er,merge:In};var Rp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gn extends Ms{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rp,this.fragmentShader=Pp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Er(e.uniforms),this.uniformsGroups=Cp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Gu extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=Ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ns=new L,od=new De,ld=new De;class Hn extends Gu{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ga*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ga*2*Math.atan(Math.tan(Qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,od,ld),t.subVectors(ld,od)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ir=-90,sr=1;class Lp extends zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Hn(ir,sr,e,t);s.layers=this.layers,this.add(s);const r=new Hn(ir,sr,e,t);r.layers=this.layers,this.add(r);const a=new Hn(ir,sr,e,t);a.layers=this.layers,this.add(a);const o=new Hn(ir,sr,e,t);o.layers=this.layers,this.add(o);const c=new Hn(ir,sr,e,t);c.layers=this.layers,this.add(c);const h=new Hn(ir,sr,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(const h of t)this.remove(h);if(e===Ti)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ao)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,d]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(f,p,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Hu extends Cn{constructor(e=[],t=Sr,i,s,r,a,o,c,h,d){super(e,t,i,s,r,a,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Dp extends pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Hu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xe(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:Er(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:An,blending:Ai});r.uniforms.tEquirect.value=t;const a=new O(s,r),o=t.minFilter;return t.minFilter===Is&&(t.minFilter=jn),new Lp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class tt extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ip={type:"move"};class bl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),u=this._getHandJoint(h,M);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const d=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=d.position.distanceTo(f.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ip)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new tt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class mh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new it(e),this.near=t,this.far=i}clone(){return new mh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Wu extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xi,this.environmentIntensity=1,this.environmentRotation=new xi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Up{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ic,this.updateRanges=[],this.version=0,this.uuid=Ri()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Dn=new L;class Po{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.applyMatrix4(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.applyNormalMatrix(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.transformDirection(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=li(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ht(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=li(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=li(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=li(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=li(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array),s=Ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),i=Ht(i,this.array),s=Ht(s,this.array),r=Ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ro("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new qn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Po(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ro("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class xh extends Ms{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new it(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let rr;const Vr=new L,ar=new L,or=new L,lr=new De,Gr=new De,Xu=new wt,ja=new L,Hr=new L,Qa=new L,cd=new De,Sl=new De,hd=new De;class Uc extends zt{constructor(e=new xh){if(super(),this.isSprite=!0,this.type="Sprite",rr===void 0){rr=new Zt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Up(t,5);rr.setIndex([0,1,2,0,2,3]),rr.setAttribute("position",new Po(i,3,0,!1)),rr.setAttribute("uv",new Po(i,2,3,!1))}this.geometry=rr,this.material=e,this.center=new De(.5,.5),this.count=1}raycast(e,t){e.camera===null&&en('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ar.setFromMatrixScale(this.matrixWorld),Xu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),or.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ar.multiplyScalar(-or.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;eo(ja.set(-.5,-.5,0),or,a,ar,s,r),eo(Hr.set(.5,-.5,0),or,a,ar,s,r),eo(Qa.set(.5,.5,0),or,a,ar,s,r),cd.set(0,0),Sl.set(1,0),hd.set(1,1);let o=e.ray.intersectTriangle(ja,Hr,Qa,!1,Vr);if(o===null&&(eo(Hr.set(-.5,.5,0),or,a,ar,s,r),Sl.set(0,1),o=e.ray.intersectTriangle(ja,Qa,Hr,!1,Vr),o===null))return;const c=e.ray.origin.distanceTo(Vr);c<e.near||c>e.far||t.push({distance:c,point:Vr.clone(),uv:Jn.getInterpolation(Vr,ja,Hr,Qa,cd,Sl,hd,new De),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function eo(n,e,t,i,s,r){lr.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(Gr.x=r*lr.x-s*lr.y,Gr.y=s*lr.x+r*lr.y):Gr.copy(lr),n.copy(e),n.x+=Gr.x,n.y+=Gr.y,n.applyMatrix4(Xu)}class qu extends Cn{constructor(e=null,t=1,i=1,s,r,a,o,c,h=Xn,d=Xn,f,p){super(null,a,o,c,h,d,s,r,f,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dd extends qn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const cr=new wt,ud=new wt,to=[],fd=new Hs,Fp=new wt,Wr=new O,Xr=new Pr;class sn extends O{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dd(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Fp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Hs),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,cr),fd.copy(e.boundingBox).applyMatrix4(cr),this.boundingBox.union(fd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,cr),Xr.copy(e.boundingSphere).applyMatrix4(cr),this.boundingSphere.union(Xr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Wr.geometry=this.geometry,Wr.material=this.material,Wr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xr.copy(this.boundingSphere),Xr.applyMatrix4(i),e.ray.intersectsSphere(Xr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,cr),ud.multiplyMatrices(i,cr),Wr.matrixWorld=ud,Wr.raycast(e,to);for(let a=0,o=to.length;a<o;a++){const c=to[a];c.instanceId=r,c.object=this,t.push(c)}to.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new dd(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new qu(new Float32Array(s*this.count),s,this.count,rh,wi));const r=this.morphTexture.source.data.data;let a=0;for(let h=0;h<i.length;h++)a+=i[h];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const wl=new L,Np=new L,zp=new yt;class Cs{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=wl.subVectors(i,t).cross(Np.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(wl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||zp.getNormalMatrix(e),s=this.coplanarPoint(wl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ws=new Pr,Op=new De(.5,.5),no=new L;class gh{constructor(e=new Cs,t=new Cs,i=new Cs,s=new Cs,r=new Cs,a=new Cs){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ti,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],h=r[3],d=r[4],f=r[5],p=r[6],m=r[7],x=r[8],M=r[9],g=r[10],u=r[11],y=r[12],v=r[13],_=r[14],E=r[15];if(s[0].setComponents(h-a,m-d,u-x,E-y).normalize(),s[1].setComponents(h+a,m+d,u+x,E+y).normalize(),s[2].setComponents(h+o,m+f,u+M,E+v).normalize(),s[3].setComponents(h-o,m-f,u-M,E-v).normalize(),i)s[4].setComponents(c,p,g,_).normalize(),s[5].setComponents(h-c,m-p,u-g,E-_).normalize();else if(s[4].setComponents(h-c,m-p,u-g,E-_).normalize(),t===Ti)s[5].setComponents(h+c,m+p,u+g,E+_).normalize();else if(t===Ao)s[5].setComponents(c,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){ws.center.set(0,0,0);const t=Op.distanceTo(e.center);return ws.radius=.7071067811865476+t,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(no.x=s.normal.x>0?e.max.x:e.min.x,no.y=s.normal.y>0?e.max.y:e.min.y,no.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(no)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Fc extends Ms{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new it(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Lo=new L,Do=new L,pd=new wt,qr=new fh,io=new Pr,Tl=new L,md=new L;class xd extends zt{constructor(e=new Zt,t=new Fc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Lo.fromBufferAttribute(t,s-1),Do.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Lo.distanceTo(Do);e.setAttribute("lineDistance",new bt(i,1))}else mt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),io.copy(i.boundingSphere),io.applyMatrix4(s),io.radius+=r,e.ray.intersectsSphere(io)===!1)return;pd.copy(s).invert(),qr.copy(e.ray).applyMatrix4(pd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,p=i.attributes.position;if(d!==null){const m=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let M=m,g=x-1;M<g;M+=h){const u=d.getX(M),y=d.getX(M+1),v=so(this,e,qr,c,u,y,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(m),u=so(this,e,qr,c,M,g,x-1);u&&t.push(u)}}else{const m=Math.max(0,a.start),x=Math.min(p.count,a.start+a.count);for(let M=m,g=x-1;M<g;M+=h){const u=so(this,e,qr,c,M,M+1,M);u&&t.push(u)}if(this.isLineLoop){const M=so(this,e,qr,c,x-1,m,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function so(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Lo.fromBufferAttribute(o,s),Do.fromBufferAttribute(o,r),t.distanceSqToSegment(Lo,Do,Tl,md)>i)return;Tl.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(Tl);if(!(h<e.near||h>e.far))return{distance:h,point:md.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}class nn extends Cn{constructor(e,t,i,s,r,a,o,c,h){super(e,t,i,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Yu extends Cn{constructor(e,t,i=Os,s,r,a,o=Xn,c=Xn,h,d=pa,f=1){if(d!==pa&&d!==ma)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:f};super(p,s,r,a,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new uh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class $u extends Cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class dn extends Zt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],h=new L,d=new De;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,p=3;f<=t;f++,p+=3){const m=i+f/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),a.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(a[p]/e+1)/2,d.y=(a[p+1]/e+1)/2,c.push(d.x,d.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(o,3)),this.setAttribute("uv",new bt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class je extends Zt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],f=[],p=[],m=[];let x=0;const M=[],g=i/2;let u=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new bt(f,3)),this.setAttribute("normal",new bt(p,3)),this.setAttribute("uv",new bt(m,2));function y(){const _=new L,E=new L;let T=0;const A=(t-e)/i;for(let R=0;R<=r;R++){const w=[],b=R/r,P=b*(t-e)+e;for(let I=0;I<=s;I++){const V=I/s,j=V*c+o,te=Math.sin(j),q=Math.cos(j);E.x=P*te,E.y=-b*i+g,E.z=P*q,f.push(E.x,E.y,E.z),_.set(te,A,q).normalize(),p.push(_.x,_.y,_.z),m.push(V,1-b),w.push(x++)}M.push(w)}for(let R=0;R<s;R++)for(let w=0;w<r;w++){const b=M[w][R],P=M[w+1][R],I=M[w+1][R+1],V=M[w][R+1];(e>0||w!==0)&&(d.push(b,P,V),T+=3),(t>0||w!==r-1)&&(d.push(P,I,V),T+=3)}h.addGroup(u,T,0),u+=T}function v(_){const E=x,T=new De,A=new L;let R=0;const w=_===!0?e:t,b=_===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*b,0),p.push(0,b,0),m.push(.5,.5),x++;const P=x;for(let I=0;I<=s;I++){const j=I/s*c+o,te=Math.cos(j),q=Math.sin(j);A.x=w*q,A.y=g*b,A.z=w*te,f.push(A.x,A.y,A.z),p.push(0,b,0),T.x=te*.5+.5,T.y=q*.5*b+.5,m.push(T.x,T.y),x++}for(let I=0;I<s;I++){const V=E+I,j=P+I;_===!0?d.push(j,j+1,V):d.push(j+1,j,V),R+=3}h.addGroup(u,R,_===!0?1:2),u+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new je(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Si extends je{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Si(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vo extends Zt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),h(i),d(),this.setAttribute("position",new bt(r,3)),this.setAttribute("normal",new bt(r.slice(),3)),this.setAttribute("uv",new bt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new L,_=new L,E=new L;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],_),m(t[T+2],E),c(v,_,E,y)}function c(y,v,_,E){const T=E+1,A=[];for(let R=0;R<=T;R++){A[R]=[];const w=y.clone().lerp(_,R/T),b=v.clone().lerp(_,R/T),P=T-R;for(let I=0;I<=P;I++)I===0&&R===T?A[R][I]=w:A[R][I]=w.clone().lerp(b,I/P)}for(let R=0;R<T;R++)for(let w=0;w<2*(T-R)-1;w++){const b=Math.floor(w/2);w%2===0?(p(A[R][b+1]),p(A[R+1][b]),p(A[R][b])):(p(A[R][b+1]),p(A[R+1][b+1]),p(A[R+1][b]))}}function h(y){const v=new L;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(y),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function d(){const y=new L;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];const _=g(y)/2/Math.PI+.5,E=u(y)/Math.PI+.5;a.push(_,1-E)}x(),f()}function f(){for(let y=0;y<a.length;y+=6){const v=a[y+0],_=a[y+2],E=a[y+4],T=Math.max(v,_,E),A=Math.min(v,_,E);T>.9&&A<.1&&(v<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function p(y){r.push(y.x,y.y,y.z)}function m(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){const y=new L,v=new L,_=new L,E=new L,T=new De,A=new De,R=new De;for(let w=0,b=0;w<r.length;w+=9,b+=6){y.set(r[w+0],r[w+1],r[w+2]),v.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),T.set(a[b+0],a[b+1]),A.set(a[b+2],a[b+3]),R.set(a[b+4],a[b+5]),E.copy(y).add(v).add(_).divideScalar(3);const P=g(E);M(T,b+0,y,P),M(A,b+2,v,P),M(R,b+4,_,P)}}function M(y,v,_,E){E<0&&y.x===1&&(a[v]=y.x-1),_.x===0&&_.z===0&&(a[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vo(e.vertices,e.indices,e.radius,e.details)}}class vh extends Vo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new vh(e.radius,e.detail)}}class Ii{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){mt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const d=i[s],p=i[s+1]-d,m=(a-d)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new De:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,s=[],r=[],a=[],o=new L,c=new wt;for(let m=0;m<=e;m++){const x=m/e;s[m]=this.getTangentAt(x,new L)}r[0]=new L,a[0]=new L;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),f<=h&&(h=f,i.set(0,1,0)),p<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(Tt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,x))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(Tt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let x=1;x<=e;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],m*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Mh extends Ii{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new De){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=c-this.aX,m=h-this.aY;c=p*d-m*f+this.aX,h=p*f+m*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Bp extends Mh{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function _h(){let n=0,e=0,t=0,i=0;function s(r,a,o,c){n=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,d,f){let p=(a-r)/h-(o-r)/(h+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+f)+(c-o)/f;p*=d,m*=d,s(a,o,p,m)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const ro=new L,El=new _h,Al=new _h,Cl=new _h;class kp extends Ii{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%r]:(ro.subVectors(s[0],s[1]).add(s[0]),h=ro);const f=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(ro.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=ro),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(f),m),M=Math.pow(f.distanceToSquared(p),m),g=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),El.initNonuniformCatmullRom(h.x,f.x,p.x,d.x,x,M,g),Al.initNonuniformCatmullRom(h.y,f.y,p.y,d.y,x,M,g),Cl.initNonuniformCatmullRom(h.z,f.z,p.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(El.initCatmullRom(h.x,f.x,p.x,d.x,this.tension),Al.initCatmullRom(h.y,f.y,p.y,d.y,this.tension),Cl.initCatmullRom(h.z,f.z,p.z,d.z,this.tension));return i.set(El.calc(c),Al.calc(c),Cl.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function gd(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+r+a)*c+(-3*t+3*i-2*r-a)*o+r*n+t}function Vp(n,e){const t=1-n;return t*t*e}function Gp(n,e){return 2*(1-n)*n*e}function Hp(n,e){return n*n*e}function ta(n,e,t,i){return Vp(n,e)+Gp(n,t)+Hp(n,i)}function Wp(n,e){const t=1-n;return t*t*t*e}function Xp(n,e){const t=1-n;return 3*t*t*n*e}function qp(n,e){return 3*(1-n)*n*n*e}function Yp(n,e){return n*n*n*e}function na(n,e,t,i,s){return Wp(n,e)+Xp(n,t)+qp(n,i)+Yp(n,s)}class Zu extends Ii{constructor(e=new De,t=new De,i=new De,s=new De){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new De){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(na(e,s.x,r.x,a.x,o.x),na(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class $p extends Ii{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(na(e,s.x,r.x,a.x,o.x),na(e,s.y,r.y,a.y,o.y),na(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ku extends Ii{constructor(e=new De,t=new De){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new De){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new De){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zp extends Ii{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ju extends Ii{constructor(e=new De,t=new De,i=new De){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new De){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(ta(e,s.x,r.x,a.x),ta(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Kp extends Ii{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(ta(e,s.x,r.x,a.x),ta(e,s.y,r.y,a.y),ta(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ju extends Ii{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new De){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],d=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return i.set(gd(o,c.x,h.x,d.x,f.x),gd(o,c.y,h.y,d.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new De().fromArray(s))}return this}}var vd=Object.freeze({__proto__:null,ArcCurve:Bp,CatmullRomCurve3:kp,CubicBezierCurve:Zu,CubicBezierCurve3:$p,EllipseCurve:Mh,LineCurve:Ku,LineCurve3:Zp,QuadraticBezierCurve:Ju,QuadraticBezierCurve3:Kp,SplineCurve:ju});class Jp extends Ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new vd[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new vd[s.type]().fromJSON(s))}return this}}class Md extends Jp{constructor(e){super(),this.type="Path",this.currentPoint=new De,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Ku(this.currentPoint.clone(),new De(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new Ju(this.currentPoint.clone(),new De(e,t),new De(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Zu(this.currentPoint.clone(),new De(e,t),new De(i,s),new De(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new ju(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,r,a,o,c),this}absellipse(e,t,i,s,r,a,o,c){const h=new Mh(e,t,i,s,r,a,o,c);if(this.curves.length>0){const f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class yh extends Md{constructor(e){super(e),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Md().fromJSON(s))}return this}}function jp(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=Qu(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,h;if(i&&(r=im(n,e,r,t)),n.length>80*t){o=n[0],c=n[1];let d=o,f=c;for(let p=t;p<s;p+=t){const m=n[p],x=n[p+1];m<o&&(o=m),x<c&&(c=x),m>d&&(d=m),x>f&&(f=x)}h=Math.max(d-o,f-c),h=h!==0?32767/h:0}return Ma(r,a,t,o,c,h,0),a}function Qu(n,e,t,i,s){let r;if(s===pm(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=_d(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=_d(a/i|0,n[a],n[a+1],r);return r&&Ar(r,r.next)&&(ya(r),r=r.next),r}function Bs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ar(t,t.next)||tn(t.prev,t,t.next)===0)){if(ya(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ma(n,e,t,i,s,r,a){if(!n)return;!a&&r&&lm(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(r?em(n,i,s,r):Qp(n)){e.push(c.i,n.i,h.i),ya(n),n=h.next,o=h.next;continue}if(n=h,n===o){a?a===1?(n=tm(Bs(n),e),Ma(n,e,t,i,s,r,2)):a===2&&nm(n,e,t,i,s,r):Ma(Bs(n),e,t,i,s,r,1);break}}}function Qp(n){const e=n.prev,t=n,i=n.next;if(tn(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,r,a),f=Math.min(o,c,h),p=Math.max(s,r,a),m=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=p&&x.y>=f&&x.y<=m&&Kr(s,o,r,c,a,h,x.x,x.y)&&tn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function em(n,e,t,i){const s=n.prev,r=n,a=n.next;if(tn(s,r,a)>=0)return!1;const o=s.x,c=r.x,h=a.x,d=s.y,f=r.y,p=a.y,m=Math.min(o,c,h),x=Math.min(d,f,p),M=Math.max(o,c,h),g=Math.max(d,f,p),u=Nc(m,x,e,t,i),y=Nc(M,g,e,t,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=u&&_&&_.z<=y;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Kr(o,d,c,f,h,p,v.x,v.y)&&tn(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==a&&Kr(o,d,c,f,h,p,_.x,_.y)&&tn(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=u;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Kr(o,d,c,f,h,p,v.x,v.y)&&tn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==a&&Kr(o,d,c,f,h,p,_.x,_.y)&&tn(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function tm(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Ar(i,s)&&tf(i,t,t.next,s)&&_a(i,s)&&_a(s,i)&&(e.push(i.i,t.i,s.i),ya(t),ya(t.next),t=n=s),t=t.next}while(t!==n);return Bs(t)}function nm(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&dm(a,o)){let c=nf(a,o);a=Bs(a,a.next),c=Bs(c,c.next),Ma(a,e,t,i,s,r,0),Ma(c,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function im(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:n.length,h=Qu(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(hm(h))}s.sort(sm);for(let r=0;r<s.length;r++)t=rm(s[r],t);return t}function sm(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function rm(n,e){const t=am(n,e);if(!t)return e;const i=nf(t,n);return Bs(i,i.next),Bs(t,t.next)}function am(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Ar(n,t))return t;do{if(Ar(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,h=a.y;let d=1/0;t=a;do{if(i>=t.x&&t.x>=c&&i!==t.x&&ef(s<h?i:r,s,c,h,s<h?r:i,s,t.x,t.y)){const f=Math.abs(s-t.y)/(i-t.x);_a(t,n)&&(f<d||f===d&&(t.x>a.x||t.x===a.x&&om(a,t)))&&(a=t,d=f)}t=t.next}while(t!==o);return a}function om(n,e){return tn(n.prev,n,e.prev)<0&&tn(e.next,n,n.next)<0}function lm(n,e,t,i){let s=n;do s.z===0&&(s.z=Nc(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,cm(s)}function cm(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let h=0;h<t&&(o++,a=a.nextZ,!!a);h++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function Nc(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function hm(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function ef(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function Kr(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&ef(n,e,t,i,s,r,a,o)}function dm(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!um(n,e)&&(_a(n,e)&&_a(e,n)&&fm(n,e)&&(tn(n.prev,n,e.prev)||tn(n,e.prev,e))||Ar(n,e)&&tn(n.prev,n,n.next)>0&&tn(e.prev,e,e.next)>0)}function tn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ar(n,e){return n.x===e.x&&n.y===e.y}function tf(n,e,t,i){const s=oo(tn(n,e,t)),r=oo(tn(n,e,i)),a=oo(tn(t,i,n)),o=oo(tn(t,i,e));return!!(s!==r&&a!==o||s===0&&ao(n,t,e)||r===0&&ao(n,i,e)||a===0&&ao(t,n,i)||o===0&&ao(t,e,i))}function ao(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function oo(n){return n>0?1:n<0?-1:0}function um(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&tf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function _a(n,e){return tn(n.prev,n,n.next)<0?tn(n,e,n.next)>=0&&tn(n,n.prev,e)>=0:tn(n,e,n.prev)<0||tn(n,n.next,e)<0}function fm(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function nf(n,e){const t=zc(n.i,n.x,n.y),i=zc(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function _d(n,e,t,i){const s=zc(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function ya(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function zc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function pm(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class mm{static triangulate(e,t,i=2){return jp(e,t,i)}}class ia{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return ia.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];yd(e),bd(i,e);let a=e.length;t.forEach(yd);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,bd(i,t[c]);const o=mm.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function yd(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function bd(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class bh extends Vo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new bh(e.radius,e.detail)}}class Yt extends Zt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,f=e/o,p=t/c,m=[],x=[],M=[],g=[];for(let u=0;u<d;u++){const y=u*p-a;for(let v=0;v<h;v++){const _=v*f-r;x.push(_,-y,0),M.push(0,0,1),g.push(v/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let y=0;y<o;y++){const v=y+h*u,_=y+h*(u+1),E=y+1+h*(u+1),T=y+1+h*u;m.push(v,_,T),m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Go extends Zt{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let f=e;const p=(t-e)/s,m=new L,x=new De;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const u=r+g/i*a;m.x=f*Math.cos(u),m.y=f*Math.sin(u),c.push(m.x,m.y,m.z),h.push(0,0,1),x.x=(m.x/t+1)/2,x.y=(m.y/t+1)/2,d.push(x.x,x.y)}f+=p}for(let M=0;M<s;M++){const g=M*(i+1);for(let u=0;u<i;u++){const y=u+g,v=y,_=y+i+1,E=y+i+2,T=y+1;o.push(v,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new bt(c,3)),this.setAttribute("normal",new bt(h,3)),this.setAttribute("uv",new bt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Go(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ho extends Zt{constructor(e=new yh([new De(0,.5),new De(-.5,-.5),new De(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(r,3)),this.setAttribute("uv",new bt(a,2));function h(d){const f=s.length/3,p=d.extractPoints(t);let m=p.shape;const x=p.holes;ia.isClockWise(m)===!1&&(m=m.reverse());for(let g=0,u=x.length;g<u;g++){const y=x[g];ia.isClockWise(y)===!0&&(x[g]=y.reverse())}const M=ia.triangulateShape(m,x);for(let g=0,u=x.length;g<u;g++){const y=x[g];m=m.concat(y)}for(let g=0,u=m.length;g<u;g++){const y=m[g];s.push(y.x,y.y,0),r.push(0,0,1),a.push(y.x,y.y)}for(let g=0,u=M.length;g<u;g++){const y=M[g],v=y[0]+f,_=y[1]+f,E=y[2]+f;i.push(v,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return xm(t,e)}static fromJSON(e,t){const i=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];i.push(a)}return new Ho(i,e.curveSegments)}}function xm(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class $t extends Zt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let h=0;const d=[],f=new L,p=new L,m=[],x=[],M=[],g=[];for(let u=0;u<=i;u++){const y=[],v=u/i;let _=0;u===0&&a===0?_=.5/t:u===i&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),f.y=e*Math.cos(a+v*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),x.push(f.x,f.y,f.z),p.copy(f).normalize(),M.push(p.x,p.y,p.z),g.push(T+_,1-v),y.push(h++)}d.push(y)}for(let u=0;u<i;u++)for(let y=0;y<t;y++){const v=d[u][y+1],_=d[u][y],E=d[u+1][y],T=d[u+1][y+1];(u!==0||a>0)&&m.push(v,_,T),(u!==i-1||c<Math.PI)&&m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gs extends Zt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],h=[],d=new L,f=new L,p=new L;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const M=x/s*r,g=m/i*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(f,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/s),h.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const M=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,u=(s+1)*(m-1)+x,y=(s+1)*m+x;a.push(M,g,y),a.push(g,u,y)}this.setIndex(a),this.setAttribute("position",new bt(o,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class gm extends gn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Ms{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hh,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class vm extends Ms{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hh,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Mm extends Ms{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=z0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _m extends Ms{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Sh extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class ym extends Sh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new it(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Rl=new wt,Sd=new L,wd=new L;class sf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new De(512,512),this.mapType=Di,this.map=null,this.mapPass=null,this.matrix=new wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gh,this._frameExtents=new De(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Sd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sd),wd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wd),t.updateMatrixWorld(),Rl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Rl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Td=new wt,Yr=new L,Pl=new L;class bm extends sf{constructor(){super(new Hn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new De(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Yr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Yr),Pl.copy(i.position),Pl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Pl),i.updateMatrixWorld(),s.makeTranslation(-Yr.x,-Yr.y,-Yr.z),Td.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Td,i.coordinateSystem,i.reversedDepth)}}class wh extends Sh{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new bm}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Th extends Gu{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Sm extends sf{constructor(){super(new Th(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ll extends Sh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new Sm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wm extends Hn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class rf{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Ed=new wt;class Tm{constructor(e,t,i=0,s=1/0){this.ray=new fh(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new ph,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):en("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ed.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ed),this}intersectObject(e,t=!0,i=[]){return Oc(e,this,i,t),i.sort(Ad),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Oc(e[s],this,i,t);return i.sort(Ad),i}}function Ad(n,e){return n.distance-e.distance}function Oc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)Oc(r[a],e,t,!0)}}function Cd(n,e,t,i){const s=Em(i);switch(t){case Iu:return n*e;case rh:return n*e/s.components*s.byteLength;case ah:return n*e/s.components*s.byteLength;case oh:return n*e*2/s.components*s.byteLength;case lh:return n*e*2/s.components*s.byteLength;case Uu:return n*e*3/s.components*s.byteLength;case ui:return n*e*4/s.components*s.byteLength;case ch:return n*e*4/s.components*s.byteLength;case go:case vo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Mo:case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ac:case lc:return Math.max(n,16)*Math.max(e,8)/4;case rc:case oc:return Math.max(n,8)*Math.max(e,8)/2;case cc:case hc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case dc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case fc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case pc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case mc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case xc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case gc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case vc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Mc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case _c:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case yc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case bc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Sc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case wc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Tc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ec:case Ac:case Cc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Rc:case Pc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Lc:case Dc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Em(n){switch(n){case Di:case Ru:return{byteLength:1,components:1};case ua:case Pu:case Ci:return{byteLength:2,components:1};case ih:case sh:return{byteLength:2,components:4};case Os:case nh:case wi:return{byteLength:4,components:1};case Lu:case Du:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qc}}));typeof window<"u"&&(window.__THREE__?mt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qc);function af(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Am(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,f=h.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,h,d),o.onUploadCallback();let m;if(h instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)m=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=n.SHORT;else if(h instanceof Uint32Array)m=n.UNSIGNED_INT;else if(h instanceof Int32Array)m=n.INT;else if(h instanceof Int8Array)m=n.BYTE;else if(h instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,h){const d=c.array,f=c.updateRanges;if(n.bindBuffer(h,o),f.length===0)n.bufferSubData(h,0,d);else{f.sort((m,x)=>m.start-x.start);let p=0;for(let m=1;m<f.length;m++){const x=f[p],M=f[m];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++p,f[p]=M)}f.length=p+1;for(let m=0,x=f.length;m<x;m++){const M=f[m];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Cm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rm=`#ifdef USE_ALPHAHASH
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
#endif`,Pm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Im=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Um=`#ifdef USE_AOMAP
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
#endif`,Fm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nm=`#ifdef USE_BATCHING
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
#endif`,Om=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,km=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Vm=`#ifdef USE_IRIDESCENCE
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
#endif`,Gm=`#ifdef USE_BUMPMAP
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
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ym=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Zm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Km=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Jm=`#define PI 3.141592653589793
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
} // validated`,jm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Qm=`vec3 transformedNormal = objectNormal;
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
#endif`,ex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,tx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ix=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sx="gl_FragColor = linearToOutputTexel( gl_FragColor );",rx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ax=`#ifdef USE_ENVMAP
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
#endif`,ox=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,lx=`#ifdef USE_ENVMAP
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
#endif`,cx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hx=`#ifdef USE_ENVMAP
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
#endif`,dx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ux=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,px=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mx=`#ifdef USE_GRADIENTMAP
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
}`,xx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mx=`uniform bool receiveShadow;
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
#endif`,_x=`#ifdef USE_ENVMAP
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
#endif`,yx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tx=`PhysicalMaterial material;
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
#endif`,Ex=`uniform sampler2D dfgLUT;
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
}`,Ax=`
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
#endif`,Cx=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Px=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ix=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ux=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zx=`#if defined( USE_POINTS_UV )
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
#endif`,Ox=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hx=`#ifdef USE_MORPHTARGETS
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
#endif`,Wx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$x=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kx=`#ifdef USE_NORMALMAP
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
#endif`,Jx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ng=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ig=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ag=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,og=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ug=`float getShadowMask() {
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
}`,fg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pg=`#ifdef USE_SKINNING
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
#endif`,mg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xg=`#ifdef USE_SKINNING
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
#endif`,gg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_g=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yg=`#ifdef USE_TRANSMISSION
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
#endif`,bg=`#ifdef USE_TRANSMISSION
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
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Eg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ag=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cg=`uniform sampler2D t2D;
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
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ig=`#include <common>
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
}`,Ug=`#if DEPTH_PACKING == 3200
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
}`,Fg=`#define DISTANCE
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
}`,Ng=`#define DISTANCE
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
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Og=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bg=`uniform float scale;
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
}`,kg=`uniform vec3 diffuse;
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
}`,Vg=`#include <common>
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
}`,Gg=`uniform vec3 diffuse;
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
}`,Hg=`#define LAMBERT
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
}`,Wg=`#define LAMBERT
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
}`,Xg=`#define MATCAP
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
}`,qg=`#define MATCAP
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
}`,Yg=`#define NORMAL
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
}`,$g=`#define NORMAL
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
}`,Zg=`#define PHONG
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
}`,Kg=`#define PHONG
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
}`,Jg=`#define STANDARD
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
}`,jg=`#define STANDARD
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
}`,Qg=`#define TOON
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
}`,e1=`#define TOON
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
}`,t1=`uniform float size;
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
}`,n1=`uniform vec3 diffuse;
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
}`,i1=`#include <common>
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
}`,s1=`uniform vec3 color;
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
}`,r1=`uniform float rotation;
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
}`,a1=`uniform vec3 diffuse;
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
}`,St={alphahash_fragment:Cm,alphahash_pars_fragment:Rm,alphamap_fragment:Pm,alphamap_pars_fragment:Lm,alphatest_fragment:Dm,alphatest_pars_fragment:Im,aomap_fragment:Um,aomap_pars_fragment:Fm,batching_pars_vertex:Nm,batching_vertex:zm,begin_vertex:Om,beginnormal_vertex:Bm,bsdfs:km,iridescence_fragment:Vm,bumpmap_pars_fragment:Gm,clipping_planes_fragment:Hm,clipping_planes_pars_fragment:Wm,clipping_planes_pars_vertex:Xm,clipping_planes_vertex:qm,color_fragment:Ym,color_pars_fragment:$m,color_pars_vertex:Zm,color_vertex:Km,common:Jm,cube_uv_reflection_fragment:jm,defaultnormal_vertex:Qm,displacementmap_pars_vertex:ex,displacementmap_vertex:tx,emissivemap_fragment:nx,emissivemap_pars_fragment:ix,colorspace_fragment:sx,colorspace_pars_fragment:rx,envmap_fragment:ax,envmap_common_pars_fragment:ox,envmap_pars_fragment:lx,envmap_pars_vertex:cx,envmap_physical_pars_fragment:_x,envmap_vertex:hx,fog_vertex:dx,fog_pars_vertex:ux,fog_fragment:fx,fog_pars_fragment:px,gradientmap_pars_fragment:mx,lightmap_pars_fragment:xx,lights_lambert_fragment:gx,lights_lambert_pars_fragment:vx,lights_pars_begin:Mx,lights_toon_fragment:yx,lights_toon_pars_fragment:bx,lights_phong_fragment:Sx,lights_phong_pars_fragment:wx,lights_physical_fragment:Tx,lights_physical_pars_fragment:Ex,lights_fragment_begin:Ax,lights_fragment_maps:Cx,lights_fragment_end:Rx,logdepthbuf_fragment:Px,logdepthbuf_pars_fragment:Lx,logdepthbuf_pars_vertex:Dx,logdepthbuf_vertex:Ix,map_fragment:Ux,map_pars_fragment:Fx,map_particle_fragment:Nx,map_particle_pars_fragment:zx,metalnessmap_fragment:Ox,metalnessmap_pars_fragment:Bx,morphinstance_vertex:kx,morphcolor_vertex:Vx,morphnormal_vertex:Gx,morphtarget_pars_vertex:Hx,morphtarget_vertex:Wx,normal_fragment_begin:Xx,normal_fragment_maps:qx,normal_pars_fragment:Yx,normal_pars_vertex:$x,normal_vertex:Zx,normalmap_pars_fragment:Kx,clearcoat_normal_fragment_begin:Jx,clearcoat_normal_fragment_maps:jx,clearcoat_pars_fragment:Qx,iridescence_pars_fragment:eg,opaque_fragment:tg,packing:ng,premultiplied_alpha_fragment:ig,project_vertex:sg,dithering_fragment:rg,dithering_pars_fragment:ag,roughnessmap_fragment:og,roughnessmap_pars_fragment:lg,shadowmap_pars_fragment:cg,shadowmap_pars_vertex:hg,shadowmap_vertex:dg,shadowmask_pars_fragment:ug,skinbase_vertex:fg,skinning_pars_vertex:pg,skinning_vertex:mg,skinnormal_vertex:xg,specularmap_fragment:gg,specularmap_pars_fragment:vg,tonemapping_fragment:Mg,tonemapping_pars_fragment:_g,transmission_fragment:yg,transmission_pars_fragment:bg,uv_pars_fragment:Sg,uv_pars_vertex:wg,uv_vertex:Tg,worldpos_vertex:Eg,background_vert:Ag,background_frag:Cg,backgroundCube_vert:Rg,backgroundCube_frag:Pg,cube_vert:Lg,cube_frag:Dg,depth_vert:Ig,depth_frag:Ug,distanceRGBA_vert:Fg,distanceRGBA_frag:Ng,equirect_vert:zg,equirect_frag:Og,linedashed_vert:Bg,linedashed_frag:kg,meshbasic_vert:Vg,meshbasic_frag:Gg,meshlambert_vert:Hg,meshlambert_frag:Wg,meshmatcap_vert:Xg,meshmatcap_frag:qg,meshnormal_vert:Yg,meshnormal_frag:$g,meshphong_vert:Zg,meshphong_frag:Kg,meshphysical_vert:Jg,meshphysical_frag:jg,meshtoon_vert:Qg,meshtoon_frag:e1,points_vert:t1,points_frag:n1,shadow_vert:i1,shadow_frag:s1,sprite_vert:r1,sprite_frag:a1},Ge={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new yt}},envmap:{envMap:{value:null},envMapRotation:{value:new yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new yt},normalScale:{value:new De(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new De(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}}},yi={basic:{uniforms:In([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:St.meshbasic_vert,fragmentShader:St.meshbasic_frag},lambert:{uniforms:In([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new it(0)}}]),vertexShader:St.meshlambert_vert,fragmentShader:St.meshlambert_frag},phong:{uniforms:In([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30}}]),vertexShader:St.meshphong_vert,fragmentShader:St.meshphong_frag},standard:{uniforms:In([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:St.meshphysical_vert,fragmentShader:St.meshphysical_frag},toon:{uniforms:In([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new it(0)}}]),vertexShader:St.meshtoon_vert,fragmentShader:St.meshtoon_frag},matcap:{uniforms:In([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:St.meshmatcap_vert,fragmentShader:St.meshmatcap_frag},points:{uniforms:In([Ge.points,Ge.fog]),vertexShader:St.points_vert,fragmentShader:St.points_frag},dashed:{uniforms:In([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:St.linedashed_vert,fragmentShader:St.linedashed_frag},depth:{uniforms:In([Ge.common,Ge.displacementmap]),vertexShader:St.depth_vert,fragmentShader:St.depth_frag},normal:{uniforms:In([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:St.meshnormal_vert,fragmentShader:St.meshnormal_frag},sprite:{uniforms:In([Ge.sprite,Ge.fog]),vertexShader:St.sprite_vert,fragmentShader:St.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:St.background_vert,fragmentShader:St.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new yt}},vertexShader:St.backgroundCube_vert,fragmentShader:St.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:St.cube_vert,fragmentShader:St.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:St.equirect_vert,fragmentShader:St.equirect_frag},distanceRGBA:{uniforms:In([Ge.common,Ge.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:St.distanceRGBA_vert,fragmentShader:St.distanceRGBA_frag},shadow:{uniforms:In([Ge.lights,Ge.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:St.shadow_vert,fragmentShader:St.shadow_frag}};yi.physical={uniforms:In([yi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new yt},clearcoatNormalScale:{value:new De(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new yt},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new yt},transmissionSamplerSize:{value:new De},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new yt},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new yt},anisotropyVector:{value:new De},anisotropyMap:{value:null},anisotropyMapTransform:{value:new yt}}]),vertexShader:St.meshphysical_vert,fragmentShader:St.meshphysical_frag};const lo={r:0,b:0,g:0},Ts=new xi,o1=new wt;function l1(n,e,t,i,s,r,a){const o=new it(0);let c=r===!0?0:1,h,d,f=null,p=0,m=null;function x(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function M(v){let _=!1;const E=x(v);E===null?u(o,c):E&&E.isColor&&(u(E,1),_=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,_){const E=x(_);E&&(E.isCubeTexture||E.mapping===ko)?(d===void 0&&(d=new O(new xe(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Er(yi.backgroundCube.uniforms),vertexShader:yi.backgroundCube.vertexShader,fragmentShader:yi.backgroundCube.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Ts.copy(_.backgroundRotation),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(o1.makeRotationFromEuler(Ts)),d.material.toneMapped=Lt.getTransfer(E.colorSpace)!==Gt,(f!==E||p!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new O(new Yt(2,2),new gn({name:"BackgroundMaterial",uniforms:Er(yi.background.uniforms),vertexShader:yi.background.vertexShader,fragmentShader:yi.background.fragmentShader,side:xs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=Lt.getTransfer(E.colorSpace)!==Gt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function u(v,_){v.getRGB(lo,Vu(n)),i.buffers.color.setClear(lo.r,lo.g,lo.b,_,a)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),c=_,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,u(o,c)},render:M,addToRenderList:g,dispose:y}}function c1(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let r=s,a=!1;function o(b,P,I,V,j){let te=!1;const q=f(V,I,P);r!==q&&(r=q,h(r.object)),te=m(b,V,I,j),te&&x(b,V,I,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,_(b,P,I,V),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function f(b,P,I){const V=I.wireframe===!0;let j=i[b.id];j===void 0&&(j={},i[b.id]=j);let te=j[P.id];te===void 0&&(te={},j[P.id]=te);let q=te[V];return q===void 0&&(q=p(c()),te[V]=q),q}function p(b){const P=[],I=[],V=[];for(let j=0;j<t;j++)P[j]=0,I[j]=0,V[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:I,attributeDivisors:V,object:b,attributes:{},index:null}}function m(b,P,I,V){const j=r.attributes,te=P.attributes;let q=0;const Z=I.getAttributes();for(const ne in Z)if(Z[ne].location>=0){const ve=j[ne];let We=te[ne];if(We===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(We=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(We=b.instanceColor)),ve===void 0||ve.attribute!==We||We&&ve.data!==We.data)return!0;q++}return r.attributesNum!==q||r.index!==V}function x(b,P,I,V){const j={},te=P.attributes;let q=0;const Z=I.getAttributes();for(const ne in Z)if(Z[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const We={};We.attribute=ve,ve&&ve.data&&(We.data=ve.data),j[ne]=We,q++}r.attributes=j,r.attributesNum=q,r.index=V}function M(){const b=r.newAttributes;for(let P=0,I=b.length;P<I;P++)b[P]=0}function g(b){u(b,0)}function u(b,P){const I=r.newAttributes,V=r.enabledAttributes,j=r.attributeDivisors;I[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),j[b]!==P&&(n.vertexAttribDivisor(b,P),j[b]=P)}function y(){const b=r.newAttributes,P=r.enabledAttributes;for(let I=0,V=P.length;I<V;I++)P[I]!==b[I]&&(n.disableVertexAttribArray(I),P[I]=0)}function v(b,P,I,V,j,te,q){q===!0?n.vertexAttribIPointer(b,P,I,j,te):n.vertexAttribPointer(b,P,I,V,j,te)}function _(b,P,I,V){M();const j=V.attributes,te=I.getAttributes(),q=P.defaultAttributeValues;for(const Z in te){const ne=te[Z];if(ne.location>=0){let ue=j[Z];if(ue===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(ue=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(ue=b.instanceColor)),ue!==void 0){const ve=ue.normalized,We=ue.itemSize,U=e.get(ue);if(U===void 0)continue;const Ce=U.buffer,_e=U.type,Re=U.bytesPerElement,$=_e===n.INT||_e===n.UNSIGNED_INT||ue.gpuType===nh;if(ue.isInterleavedBufferAttribute){const K=ue.data,ye=K.stride,Se=ue.offset;if(K.isInstancedInterleavedBuffer){for(let Be=0;Be<ne.locationSize;Be++)u(ne.location+Be,K.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Be=0;Be<ne.locationSize;Be++)g(ne.location+Be);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let Be=0;Be<ne.locationSize;Be++)v(ne.location+Be,We/ne.locationSize,_e,ve,ye*Re,(Se+We/ne.locationSize*Be)*Re,$)}else{if(ue.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)u(ne.location+K,ue.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let K=0;K<ne.locationSize;K++)v(ne.location+K,We/ne.locationSize,_e,ve,We*Re,We/ne.locationSize*K*Re,$)}}else if(q!==void 0){const ve=q[Z];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){R();for(const b in i){const P=i[b];for(const I in P){const V=P[I];for(const j in V)d(V[j].object),delete V[j];delete P[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const I in P){const V=P[I];for(const j in V)d(V[j].object),delete V[j];delete P[I]}delete i[b.id]}function A(b){for(const P in i){const I=i[P];if(I[b.id]===void 0)continue;const V=I[b.id];for(const j in V)d(V[j].object),delete V[j];delete I[b.id]}}function R(){w(),a=!0,r!==s&&(r=s,h(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:g,disableUnusedAttributes:y}}function h1(n,e,t){let i;function s(h){i=h}function r(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function a(h,d,f){f!==0&&(n.drawArraysInstanced(i,h,d,f),t.update(d,i,f))}function o(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,f);let m=0;for(let x=0;x<f;x++)m+=d[x];t.update(m,i,1)}function c(h,d,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)a(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,d,0,p,0,f);let x=0;for(let M=0;M<f;M++)x+=d[M]*p[M];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function d1(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==ui&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Ci&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Di&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==wi&&!R)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(mt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const f=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function u1(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Cs,o=new yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||i!==0||s;return s=p,i=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){t=d(f,p,0)},this.setState=function(f,p,m){const x=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,u=n.get(f);if(!s||x===null||x.length===0||r&&!g)r?d(null):h();else{const y=r?0:i,v=y*4;let _=u.clippingState||null;c.value=_,_=d(x,p,v,m);for(let E=0;E!==v;++E)_[E]=t[E];u.clippingState=_,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,p,m,x){const M=f!==null?f.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const u=m+M*4,y=p.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<u)&&(g=new Float32Array(u));for(let v=0,_=m;v!==M;++v,_+=4)a.copy(f[v]).applyMatrix4(y,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function f1(n){let e=new WeakMap;function t(a,o){return o===nc?a.mapping=Sr:o===ic&&(a.mapping=wr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===nc||o===ic)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new Dp(c.height);return h.fromEquirectangularTexture(n,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const hs=4,Rd=[.125,.215,.35,.446,.526,.582],Ds=20,p1=512,$r=new Th,Pd=new it;let Dl=null,Il=0,Ul=0,Fl=!1;const m1=new L;class Bc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=m1}=r;Dl=this._renderer.getRenderTarget(),Il=this._renderer.getActiveCubeFace(),Ul=this._renderer.getActiveMipmapLevel(),Fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Id(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dl,Il,Ul),this._renderer.xr.enabled=Fl,e.scissorTest=!1,hr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Sr||e.mapping===wr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dl=this._renderer.getRenderTarget(),Il=this._renderer.getActiveCubeFace(),Ul=this._renderer.getActiveMipmapLevel(),Fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:jn,minFilter:jn,generateMipmaps:!1,type:Ci,format:ui,colorSpace:Tr,depthBuffer:!1},s=Ld(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ld(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=x1(r)),this._blurMaterial=v1(r,e,t)}return s}_compileMaterial(e){const t=new O(new Zt,e);this._renderer.compile(t,$r)}_sceneToCubeUV(e,t,i,s,r){const c=new Hn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,m=f.toneMapping;f.getClearColor(Pd),f.toneMapping=fs,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new O(new xe,new Ct({name:"PMREM.Background",side:An,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let u=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,u=!0):(g.color.copy(Pd),u=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[v],r.y,r.z)):_===1?(c.up.set(0,0,h[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[v],r.z)):(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;hr(s,_*E,v>2?E:0,E,E),f.setRenderTarget(s),u&&f.render(M,c),f.render(e,c)}f.toneMapping=m,f.autoClear=p,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Sr||e.mapping===wr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Id()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;hr(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,$r)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=g1(this._lodMax,y,v)}const a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(h*h-d*d),p=.05+h*.95,m=f*p,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-hs?i-x+hs:0),u=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,hr(r,g,u,3*M,2*M),s.setRenderTarget(r),s.render(o,$r),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=x-i,hr(e,g,u,3*M,2*M),s.setRenderTarget(e),s.render(o,$r)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&en("blur direction must be either latitudinal or longitudinal!");const d=3,f=this._lodMeshes[s];f.material=h;const p=h.uniforms,m=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ds-1),M=r/x,g=isFinite(r)?1+Math.floor(d*M):Ds;g>Ds&&mt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ds}`);const u=[];let y=0;for(let A=0;A<Ds;++A){const R=A/M,w=Math.exp(-R*R/2);u.push(w),A===0?y+=w:A<g&&(y+=2*w)}for(let A=0;A<u.length;A++)u[A]=u[A]/y;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=u,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const _=this._sizeLods[s],E=3*_*(s>v-hs?s-v+hs:0),T=4*(this._cubeSize-_);hr(t,E,T,3*_,2*_),c.setRenderTarget(t),c.render(f,$r)}}function x1(n){const e=[],t=[],i=[];let s=n;const r=n-hs+1+Rd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-hs?c=Rd[a-n+hs-1]:a===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,f=1+h,p=[d,d,f,d,f,f,d,d,f,f,d,f],m=6,x=6,M=3,g=2,u=1,y=new Float32Array(M*x*m),v=new Float32Array(g*x*m),_=new Float32Array(u*x*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,R=T>2?0:-1,w=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(w,M*x*T),v.set(p,g*x*T);const b=[T,T,T,T,T,T];_.set(b,u*x*T)}const E=new Zt;E.setAttribute("position",new qn(y,M)),E.setAttribute("uv",new qn(v,g)),E.setAttribute("faceIndex",new qn(_,u)),i.push(new O(E,null)),s>hs&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Ld(n,e,t){const i=new pi(n,e,t);return i.texture.mapping=ko,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function hr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function g1(n,e,t){return new gn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:p1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wo(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function v1(n,e,t){const i=new Float32Array(Ds),s=new L(0,1,0);return new gn({name:"SphericalGaussianBlur",defines:{n:Ds,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Wo(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Dd(){return new gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wo(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Id(){return new gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Wo(){return`

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
	`}function M1(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===nc||c===ic,d=c===Sr||c===wr;if(h||d){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new Bc(n)),f=h?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return h&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Bc(n)),f=h?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function _1(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&xa("WebGLRenderer: "+i+" extension not supported."),s}}}function y1(n,e,t,i){const s={},r=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function c(f){const p=f.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function h(f){const p=[],m=f.index,x=f.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],T=y[v+1],A=y[v+2];p.push(E,T,T,A,A,E)}}else if(x!==void 0){const y=x.array;M=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,T=v+1,A=v+2;p.push(E,T,T,A,A,E)}}else return;const g=new(Nu(p)?ku:Bu)(p,1);g.version=M;const u=r.get(f);u&&e.remove(u),r.set(f,g)}function d(f){const p=r.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:d}}function b1(n,e,t){let i;function s(p){i=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,m){n.drawElements(i,m,r,p*a),t.update(m,i,1)}function h(p,m,x){x!==0&&(n.drawElementsInstanced(i,m,r,p*a,x),t.update(m,i,x))}function d(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,p,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];t.update(g,i,1)}function f(p,m,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<p.length;u++)h(p[u]/a,m[u],M[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,r,p,0,M,0,x);let u=0;for(let y=0;y<x;y++)u+=m[y]*M[y];t.update(u,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function S1(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:en("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function w1(n,e,t){const i=new WeakMap,s=new Wt;function r(a,o,c){const h=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let p=i.get(o);if(p===void 0||p.count!==f){let b=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;p!==void 0&&p.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;x===!0&&(_=1),M===!0&&(_=2),g===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*f),R=new zu(A,E,T,f);R.type=wi,R.needsUpdate=!0;const w=_*4;for(let P=0;P<f;P++){const I=u[P],V=y[P],j=v[P],te=E*T*4*P;for(let q=0;q<I.count;q++){const Z=q*w;x===!0&&(s.fromBufferAttribute(I,q),A[te+Z+0]=s.x,A[te+Z+1]=s.y,A[te+Z+2]=s.z,A[te+Z+3]=0),M===!0&&(s.fromBufferAttribute(V,q),A[te+Z+4]=s.x,A[te+Z+5]=s.y,A[te+Z+6]=s.z,A[te+Z+7]=0),g===!0&&(s.fromBufferAttribute(j,q),A[te+Z+8]=s.x,A[te+Z+9]=s.y,A[te+Z+10]=s.z,A[te+Z+11]=j.itemSize===4?s.w:1)}}p={count:f,texture:R,size:new De(E,T)},i.set(o,p),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:r}}function T1(n,e,t,i){let s=new WeakMap;function r(c){const h=i.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==h&&(e.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return f}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}const of=new Cn,Ud=new Yu(1,1),lf=new zu,cf=new xp,hf=new Hu,Fd=[],Nd=[],zd=new Float32Array(16),Od=new Float32Array(9),Bd=new Float32Array(4);function Lr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Fd[s];if(r===void 0&&(r=new Float32Array(s),Fd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function un(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function fn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Xo(n,e){let t=Nd[e];t===void 0&&(t=new Int32Array(e),Nd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function E1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function A1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2fv(this.addr,e),fn(t,e)}}function C1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(un(t,e))return;n.uniform3fv(this.addr,e),fn(t,e)}}function R1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4fv(this.addr,e),fn(t,e)}}function P1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),fn(t,e)}else{if(un(t,i))return;Bd.set(i),n.uniformMatrix2fv(this.addr,!1,Bd),fn(t,i)}}function L1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),fn(t,e)}else{if(un(t,i))return;Od.set(i),n.uniformMatrix3fv(this.addr,!1,Od),fn(t,i)}}function D1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),fn(t,e)}else{if(un(t,i))return;zd.set(i),n.uniformMatrix4fv(this.addr,!1,zd),fn(t,i)}}function I1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function U1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2iv(this.addr,e),fn(t,e)}}function F1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;n.uniform3iv(this.addr,e),fn(t,e)}}function N1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4iv(this.addr,e),fn(t,e)}}function z1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function O1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2uiv(this.addr,e),fn(t,e)}}function B1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;n.uniform3uiv(this.addr,e),fn(t,e)}}function k1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4uiv(this.addr,e),fn(t,e)}}function V1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ud.compareFunction=Fu,r=Ud):r=of,t.setTexture2D(e||r,s)}function G1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||cf,s)}function H1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||hf,s)}function W1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||lf,s)}function X1(n){switch(n){case 5126:return E1;case 35664:return A1;case 35665:return C1;case 35666:return R1;case 35674:return P1;case 35675:return L1;case 35676:return D1;case 5124:case 35670:return I1;case 35667:case 35671:return U1;case 35668:case 35672:return F1;case 35669:case 35673:return N1;case 5125:return z1;case 36294:return O1;case 36295:return B1;case 36296:return k1;case 35678:case 36198:case 36298:case 36306:case 35682:return V1;case 35679:case 36299:case 36307:return G1;case 35680:case 36300:case 36308:case 36293:return H1;case 36289:case 36303:case 36311:case 36292:return W1}}function q1(n,e){n.uniform1fv(this.addr,e)}function Y1(n,e){const t=Lr(e,this.size,2);n.uniform2fv(this.addr,t)}function $1(n,e){const t=Lr(e,this.size,3);n.uniform3fv(this.addr,t)}function Z1(n,e){const t=Lr(e,this.size,4);n.uniform4fv(this.addr,t)}function K1(n,e){const t=Lr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function J1(n,e){const t=Lr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function j1(n,e){const t=Lr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Q1(n,e){n.uniform1iv(this.addr,e)}function e2(n,e){n.uniform2iv(this.addr,e)}function t2(n,e){n.uniform3iv(this.addr,e)}function n2(n,e){n.uniform4iv(this.addr,e)}function i2(n,e){n.uniform1uiv(this.addr,e)}function s2(n,e){n.uniform2uiv(this.addr,e)}function r2(n,e){n.uniform3uiv(this.addr,e)}function a2(n,e){n.uniform4uiv(this.addr,e)}function o2(n,e,t){const i=this.cache,s=e.length,r=Xo(t,s);un(i,r)||(n.uniform1iv(this.addr,r),fn(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||of,r[a])}function l2(n,e,t){const i=this.cache,s=e.length,r=Xo(t,s);un(i,r)||(n.uniform1iv(this.addr,r),fn(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||cf,r[a])}function c2(n,e,t){const i=this.cache,s=e.length,r=Xo(t,s);un(i,r)||(n.uniform1iv(this.addr,r),fn(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||hf,r[a])}function h2(n,e,t){const i=this.cache,s=e.length,r=Xo(t,s);un(i,r)||(n.uniform1iv(this.addr,r),fn(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||lf,r[a])}function d2(n){switch(n){case 5126:return q1;case 35664:return Y1;case 35665:return $1;case 35666:return Z1;case 35674:return K1;case 35675:return J1;case 35676:return j1;case 5124:case 35670:return Q1;case 35667:case 35671:return e2;case 35668:case 35672:return t2;case 35669:case 35673:return n2;case 5125:return i2;case 36294:return s2;case 36295:return r2;case 36296:return a2;case 35678:case 36198:case 36298:case 36306:case 35682:return o2;case 35679:case 36299:case 36307:return l2;case 35680:case 36300:case 36308:case 36293:return c2;case 36289:case 36303:case 36311:case 36292:return h2}}class u2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=X1(t.type)}}class f2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=d2(t.type)}}class p2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Nl=/(\w+)(\])?(\[|\.)?/g;function kd(n,e){n.seq.push(e),n.map[e.id]=e}function m2(n,e,t){const i=n.name,s=i.length;for(Nl.lastIndex=0;;){const r=Nl.exec(i),a=Nl.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){kd(t,h===void 0?new u2(o,n,e):new f2(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new p2(o),kd(t,f)),t=f}}}class yo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);m2(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Vd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const x2=37297;let g2=0;function v2(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Gd=new yt;function M2(n){Lt._getMatrix(Gd,Lt.workingColorSpace,n);const e=`mat3( ${Gd.elements.map(t=>t.toFixed(4))} )`;switch(Lt.getTransfer(n)){case Eo:return[e,"LinearTransferOETF"];case Gt:return[e,"sRGBTransferOETF"];default:return mt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Hd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+v2(n.getShaderSource(e),o)}else return r}function _2(n,e){const t=M2(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function y2(n,e){let t;switch(e){case bu:t="Linear";break;case Su:t="Reinhard";break;case wu:t="Cineon";break;case th:t="ACESFilmic";break;case Eu:t="AgX";break;case Au:t="Neutral";break;case Tu:t="Custom";break;default:mt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const co=new L;function b2(){Lt.getLuminanceCoefficients(co);const n=co.x.toFixed(4),e=co.y.toFixed(4),t=co.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function S2(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jr).join(`
`)}function w2(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function T2(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Jr(n){return n!==""}function Wd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const E2=/^[ \t]*#include +<([\w\d./]+)>/gm;function kc(n){return n.replace(E2,C2)}const A2=new Map;function C2(n,e){let t=St[e];if(t===void 0){const i=A2.get(e);if(i!==void 0)t=St[i],mt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return kc(t)}const R2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qd(n){return n.replace(R2,P2)}function P2(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Yd(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function L2(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===_u?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===yu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vi&&(e="SHADOWMAP_TYPE_VSM"),e}function D2(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Sr:case wr:e="ENVMAP_TYPE_CUBE";break;case ko:e="ENVMAP_TYPE_CUBE_UV";break}return e}function I2(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===wr&&(e="ENVMAP_MODE_REFRACTION"),e}function U2(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case eh:e="ENVMAP_BLENDING_MULTIPLY";break;case U0:e="ENVMAP_BLENDING_MIX";break;case F0:e="ENVMAP_BLENDING_ADD";break}return e}function F2(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function N2(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=L2(t),h=D2(t),d=I2(t),f=U2(t),p=F2(t),m=S2(t),x=w2(r),M=s.createProgram();let g,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Jr).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Jr).join(`
`),u.length>0&&(u+=`
`)):(g=[Yd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jr).join(`
`),u=[Yd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fs?"#define TONE_MAPPING":"",t.toneMapping!==fs?St.tonemapping_pars_fragment:"",t.toneMapping!==fs?y2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",St.colorspace_pars_fragment,_2("linearToOutputTexel",t.outputColorSpace),b2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jr).join(`
`)),a=kc(a),a=Wd(a,t),a=Xd(a,t),o=kc(o),o=Wd(o,t),o=Xd(o,t),a=qd(a),o=qd(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",t.glslVersion===Wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const v=y+g+a,_=y+u+o,E=Vd(s,s.VERTEX_SHADER,v),T=Vd(s,s.FRAGMENT_SHADER,_);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function A(P){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(E)||"",j=s.getShaderInfoLog(T)||"",te=I.trim(),q=V.trim(),Z=j.trim();let ne=!0,ue=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const ve=Hd(s,E,"vertex"),We=Hd(s,T,"fragment");en("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+te+`
`+ve+`
`+We)}else te!==""?mt("WebGLProgram: Program Info Log:",te):(q===""||Z==="")&&(ue=!1);ue&&(P.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:Z,prefix:u}})}s.deleteShader(E),s.deleteShader(T),R=new yo(s,M),w=T2(s,M)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,x2)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=g2++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let z2=0;class O2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new B2(e),t.set(e,i)),i}}class B2{constructor(e){this.id=z2++,this.code=e,this.usedTimes=0}}function k2(n,e,t,i,s,r,a){const o=new ph,c=new O2,h=new Set,d=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(w){return h.add(w),w===0?"uv":`uv${w}`}function g(w,b,P,I,V){const j=I.fog,te=V.geometry,q=w.isMeshStandardMaterial?I.environment:null,Z=(w.isMeshStandardMaterial?t:e).get(w.envMap||q),ne=Z&&Z.mapping===ko?Z.image.height:null,ue=x[w.type];w.precision!==null&&(m=s.getMaxPrecision(w.precision),m!==w.precision&&mt("WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,We=ve!==void 0?ve.length:0;let U=0;te.morphAttributes.position!==void 0&&(U=1),te.morphAttributes.normal!==void 0&&(U=2),te.morphAttributes.color!==void 0&&(U=3);let Ce,_e,Re,$;if(ue){const Pt=yi[ue];Ce=Pt.vertexShader,_e=Pt.fragmentShader}else Ce=w.vertexShader,_e=w.fragmentShader,c.update(w),Re=c.getVertexShaderID(w),$=c.getFragmentShaderID(w);const K=n.getRenderTarget(),ye=n.state.buffers.depth.getReversed(),Se=V.isInstancedMesh===!0,Be=V.isBatchedMesh===!0,Qe=!!w.map,Ut=!!w.matcap,nt=!!Z,Dt=!!w.aoMap,B=!!w.lightMap,gt=!!w.bumpMap,xt=!!w.normalMap,It=!!w.displacementMap,Ze=!!w.emissiveMap,Ot=!!w.metalnessMap,st=!!w.roughnessMap,pt=w.anisotropy>0,D=w.clearcoat>0,C=w.dispersion>0,J=w.iridescence>0,ce=w.sheen>0,ge=w.transmission>0,re=pt&&!!w.anisotropyMap,Ke=D&&!!w.clearcoatMap,Pe=D&&!!w.clearcoatNormalMap,et=D&&!!w.clearcoatRoughnessMap,Xe=J&&!!w.iridescenceMap,Me=J&&!!w.iridescenceThicknessMap,we=ce&&!!w.sheenColorMap,at=ce&&!!w.sheenRoughnessMap,rt=!!w.specularMap,He=!!w.specularColorMap,ot=!!w.specularIntensityMap,H=ge&&!!w.transmissionMap,Ve=ge&&!!w.thicknessMap,Oe=!!w.gradientMap,Ie=!!w.alphaMap,be=w.alphaTest>0,fe=!!w.alphaHash,$e=!!w.extensions;let lt=fs;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(lt=n.toneMapping);const Ft={shaderID:ue,shaderType:w.type,shaderName:w.name,vertexShader:Ce,fragmentShader:_e,defines:w.defines,customVertexShaderID:Re,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:Be,batchingColor:Be&&V._colorsTexture!==null,instancing:Se,instancingColor:Se&&V.instanceColor!==null,instancingMorph:Se&&V.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Tr,alphaToCoverage:!!w.alphaToCoverage,map:Qe,matcap:Ut,envMap:nt,envMapMode:nt&&Z.mapping,envMapCubeUVHeight:ne,aoMap:Dt,lightMap:B,bumpMap:gt,normalMap:xt,displacementMap:p&&It,emissiveMap:Ze,normalMapObjectSpace:xt&&w.normalMapType===B0,normalMapTangentSpace:xt&&w.normalMapType===hh,metalnessMap:Ot,roughnessMap:st,anisotropy:pt,anisotropyMap:re,clearcoat:D,clearcoatMap:Ke,clearcoatNormalMap:Pe,clearcoatRoughnessMap:et,dispersion:C,iridescence:J,iridescenceMap:Xe,iridescenceThicknessMap:Me,sheen:ce,sheenColorMap:we,sheenRoughnessMap:at,specularMap:rt,specularColorMap:He,specularIntensityMap:ot,transmission:ge,transmissionMap:H,thicknessMap:Ve,gradientMap:Oe,opaque:w.transparent===!1&&w.blending===mr&&w.alphaToCoverage===!1,alphaMap:Ie,alphaTest:be,alphaHash:fe,combine:w.combine,mapUv:Qe&&M(w.map.channel),aoMapUv:Dt&&M(w.aoMap.channel),lightMapUv:B&&M(w.lightMap.channel),bumpMapUv:gt&&M(w.bumpMap.channel),normalMapUv:xt&&M(w.normalMap.channel),displacementMapUv:It&&M(w.displacementMap.channel),emissiveMapUv:Ze&&M(w.emissiveMap.channel),metalnessMapUv:Ot&&M(w.metalnessMap.channel),roughnessMapUv:st&&M(w.roughnessMap.channel),anisotropyMapUv:re&&M(w.anisotropyMap.channel),clearcoatMapUv:Ke&&M(w.clearcoatMap.channel),clearcoatNormalMapUv:Pe&&M(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&M(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Xe&&M(w.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&M(w.iridescenceThicknessMap.channel),sheenColorMapUv:we&&M(w.sheenColorMap.channel),sheenRoughnessMapUv:at&&M(w.sheenRoughnessMap.channel),specularMapUv:rt&&M(w.specularMap.channel),specularColorMapUv:He&&M(w.specularColorMap.channel),specularIntensityMapUv:ot&&M(w.specularIntensityMap.channel),transmissionMapUv:H&&M(w.transmissionMap.channel),thicknessMapUv:Ve&&M(w.thicknessMap.channel),alphaMapUv:Ie&&M(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(xt||pt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!te.attributes.uv&&(Qe||Ie),fog:!!j,useFog:w.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ye,skinning:V.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:We,morphTextureStride:U,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:lt,decodeVideoTexture:Qe&&w.map.isVideoTexture===!0&&Lt.getTransfer(w.map.colorSpace)===Gt,decodeVideoTextureEmissive:Ze&&w.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(w.emissiveMap.colorSpace)===Gt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===vt,flipSided:w.side===An,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:$e&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($e&&w.extensions.multiDraw===!0||Be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ft.vertexUv1s=h.has(1),Ft.vertexUv2s=h.has(2),Ft.vertexUv3s=h.has(3),h.clear(),Ft}function u(w){const b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)b.push(P),b.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(y(b,w),v(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function y(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function v(w,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),w.push(o.mask)}function _(w){const b=x[w.type];let P;if(b){const I=yi[b];P=va.clone(I.uniforms)}else P=w.uniforms;return P}function E(w,b){let P;for(let I=0,V=d.length;I<V;I++){const j=d[I];if(j.cacheKey===b){P=j,++P.usedTimes;break}}return P===void 0&&(P=new N2(n,b,w,r),d.push(P)),P}function T(w){if(--w.usedTimes===0){const b=d.indexOf(w);d[b]=d[d.length-1],d.pop(),w.destroy()}}function A(w){c.remove(w)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:R}}function V2(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function G2(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function $d(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Zd(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,p,m,x,M,g){let u=n[e];return u===void 0?(u={id:f.id,object:f,geometry:p,material:m,groupOrder:x,renderOrder:f.renderOrder,z:M,group:g},n[e]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=m,u.groupOrder=x,u.renderOrder=f.renderOrder,u.z=M,u.group=g),e++,u}function o(f,p,m,x,M,g){const u=a(f,p,m,x,M,g);m.transmission>0?i.push(u):m.transparent===!0?s.push(u):t.push(u)}function c(f,p,m,x,M,g){const u=a(f,p,m,x,M,g);m.transmission>0?i.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function h(f,p){t.length>1&&t.sort(f||G2),i.length>1&&i.sort(p||$d),s.length>1&&s.sort(p||$d)}function d(){for(let f=e,p=n.length;f<p;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:d,sort:h}}function H2(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Zd,n.set(i,[a])):s>=r.length?(a=new Zd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function W2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new it};break;case"SpotLight":t={position:new L,direction:new L,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function X2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let q2=0;function Y2(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function $2(n){const e=new W2,t=X2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new L);const s=new L,r=new wt,a=new wt;function o(h){let d=0,f=0,p=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let m=0,x=0,M=0,g=0,u=0,y=0,v=0,_=0,E=0,T=0,A=0;h.sort(Y2);for(let w=0,b=h.length;w<b;w++){const P=h[w],I=P.color,V=P.intensity,j=P.distance,te=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=I.r*V,f+=I.g*V,p+=I.b*V;else if(P.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(P.sh.coefficients[q],V);A++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,ne=t.get(P);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=te,i.directionalShadowMatrix[m]=P.shadow.matrix,y++}i.directional[m]=q,m++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(I).multiplyScalar(V),q.distance=j,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,i.spot[M]=q;const Z=P.shadow;if(P.map&&(i.spotLightMap[E]=P.map,E++,Z.updateMatrices(P),P.castShadow&&T++),i.spotLightMatrix[M]=Z.matrix,P.castShadow){const ne=t.get(P);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,_++}M++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(I).multiplyScalar(V),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=q,g++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const Z=P.shadow,ne=t.get(P);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,ne.shadowCameraNear=Z.camera.near,ne.shadowCameraFar=Z.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=P.shadow.matrix,v++}i.point[x]=q,x++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(V),q.groundColor.copy(P.groundColor).multiplyScalar(V),i.hemi[u]=q,u++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ge.LTC_FLOAT_1,i.rectAreaLTC2=Ge.LTC_FLOAT_2):(i.rectAreaLTC1=Ge.LTC_HALF_1,i.rectAreaLTC2=Ge.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=p;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==M||R.rectAreaLength!==g||R.hemiLength!==u||R.numDirectionalShadows!==y||R.numPointShadows!==v||R.numSpotShadows!==_||R.numSpotMaps!==E||R.numLightProbes!==A)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,R.directionalLength=m,R.pointLength=x,R.spotLength=M,R.rectAreaLength=g,R.hemiLength=u,R.numDirectionalShadows=y,R.numPointShadows=v,R.numSpotShadows=_,R.numSpotMaps=E,R.numLightProbes=A,i.version=q2++)}function c(h,d){let f=0,p=0,m=0,x=0,M=0;const g=d.matrixWorldInverse;for(let u=0,y=h.length;u<y;u++){const v=h[u];if(v.isDirectionalLight){const _=i.directional[f];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(v.isSpotLight){const _=i.spot[m];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const _=i.rectArea[x];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(v.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){const _=i.point[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const _=i.hemi[M];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(g),M++}}}return{setup:o,setupView:c,state:i}}function Kd(n){const e=new $2(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function r(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Z2(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Kd(n),e.set(s,[o])):r>=a.length?(o=new Kd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const K2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J2=`uniform sampler2D shadow_pass;
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
}`;function j2(n,e,t){let i=new gh;const s=new De,r=new De,a=new Wt,o=new Mm({depthPacking:O0}),c=new _m,h={},d=t.maxTextureSize,f={[xs]:An,[An]:xs,[vt]:vt},p=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new De},radius:{value:4}},vertexShader:K2,fragmentShader:J2}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Zt;x.setAttribute("position",new qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new O(x,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_u;let u=this.type;this.render=function(T,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const w=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Ai),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const V=u!==Vi&&this.type===Vi,j=u===Vi&&this.type!==Vi;for(let te=0,q=T.length;te<q;te++){const Z=T[te],ne=Z.shadow;if(ne===void 0){mt("WebGLShadowMap:",Z,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const ue=ne.getFrameExtents();if(s.multiply(ue),r.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ue.x),s.x=r.x*ue.x,ne.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ue.y),s.y=r.y*ue.y,ne.mapSize.y=r.y)),ne.map===null||V===!0||j===!0){const We=this.type!==Vi?{minFilter:Xn,magFilter:Xn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new pi(s.x,s.y,We),ne.map.texture.name=Z.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let We=0;We<ve;We++){const U=ne.getViewport(We);a.set(r.x*U.x,r.y*U.y,r.x*U.z,r.y*U.w),I.viewport(a),ne.updateMatrices(Z,We),i=ne.getFrustum(),_(A,R,ne.camera,Z,this.type)}ne.isPointLightShadow!==!0&&this.type===Vi&&y(ne,R),ne.needsUpdate=!1}u=this.type,g.needsUpdate=!1,n.setRenderTarget(w,b,P)};function y(T,A){const R=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new pi(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,R,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,R,m,M,null)}function v(T,A,R,w){let b=null;const P=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)b=P;else if(b=R.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const I=b.uuid,V=A.uuid;let j=h[I];j===void 0&&(j={},h[I]=j);let te=j[V];te===void 0&&(te=b.clone(),j[V]=te,A.addEventListener("dispose",E)),b=te}if(b.visible=A.visible,b.wireframe=A.wireframe,w===Vi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:f[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=R}return b}function _(T,A,R,w,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Vi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const V=e.update(T),j=T.material;if(Array.isArray(j)){const te=V.groups;for(let q=0,Z=te.length;q<Z;q++){const ne=te[q],ue=j[ne.materialIndex];if(ue&&ue.visible){const ve=v(T,ue,w,b);T.onBeforeShadow(n,T,A,R,V,ve,ne),n.renderBufferDirect(R,null,V,ve,T,ne),T.onAfterShadow(n,T,A,R,V,ve,ne)}}}else if(j.visible){const te=v(T,j,w,b);T.onBeforeShadow(n,T,A,R,V,te,null),n.renderBufferDirect(R,null,V,te,T,null),T.onAfterShadow(n,T,A,R,V,te,null)}}const I=T.children;for(let V=0,j=I.length;V<j;V++)_(I[V],A,R,w,b)}function E(T){T.target.removeEventListener("dispose",E);for(const R in h){const w=h[R],b=T.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}const Q2={[Zl]:Kl,[Jl]:ec,[jl]:tc,[br]:Ql,[Kl]:Zl,[ec]:Jl,[tc]:jl,[Ql]:br};function ev(n,e){function t(){let H=!1;const Ve=new Wt;let Oe=null;const Ie=new Wt(0,0,0,0);return{setMask:function(be){Oe!==be&&!H&&(n.colorMask(be,be,be,be),Oe=be)},setLocked:function(be){H=be},setClear:function(be,fe,$e,lt,Ft){Ft===!0&&(be*=lt,fe*=lt,$e*=lt),Ve.set(be,fe,$e,lt),Ie.equals(Ve)===!1&&(n.clearColor(be,fe,$e,lt),Ie.copy(Ve))},reset:function(){H=!1,Oe=null,Ie.set(-1,0,0,0)}}}function i(){let H=!1,Ve=!1,Oe=null,Ie=null,be=null;return{setReversed:function(fe){if(Ve!==fe){const $e=e.get("EXT_clip_control");fe?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT),Ve=fe;const lt=be;be=null,this.setClear(lt)}},getReversed:function(){return Ve},setTest:function(fe){fe?K(n.DEPTH_TEST):ye(n.DEPTH_TEST)},setMask:function(fe){Oe!==fe&&!H&&(n.depthMask(fe),Oe=fe)},setFunc:function(fe){if(Ve&&(fe=Q2[fe]),Ie!==fe){switch(fe){case Zl:n.depthFunc(n.NEVER);break;case Kl:n.depthFunc(n.ALWAYS);break;case Jl:n.depthFunc(n.LESS);break;case br:n.depthFunc(n.LEQUAL);break;case jl:n.depthFunc(n.EQUAL);break;case Ql:n.depthFunc(n.GEQUAL);break;case ec:n.depthFunc(n.GREATER);break;case tc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ie=fe}},setLocked:function(fe){H=fe},setClear:function(fe){be!==fe&&(Ve&&(fe=1-fe),n.clearDepth(fe),be=fe)},reset:function(){H=!1,Oe=null,Ie=null,be=null,Ve=!1}}}function s(){let H=!1,Ve=null,Oe=null,Ie=null,be=null,fe=null,$e=null,lt=null,Ft=null;return{setTest:function(Pt){H||(Pt?K(n.STENCIL_TEST):ye(n.STENCIL_TEST))},setMask:function(Pt){Ve!==Pt&&!H&&(n.stencilMask(Pt),Ve=Pt)},setFunc:function(Pt,Pn,yn){(Oe!==Pt||Ie!==Pn||be!==yn)&&(n.stencilFunc(Pt,Pn,yn),Oe=Pt,Ie=Pn,be=yn)},setOp:function(Pt,Pn,yn){(fe!==Pt||$e!==Pn||lt!==yn)&&(n.stencilOp(Pt,Pn,yn),fe=Pt,$e=Pn,lt=yn)},setLocked:function(Pt){H=Pt},setClear:function(Pt){Ft!==Pt&&(n.clearStencil(Pt),Ft=Pt)},reset:function(){H=!1,Ve=null,Oe=null,Ie=null,be=null,fe=null,$e=null,lt=null,Ft=null}}}const r=new t,a=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,y=null,v=null,_=null,E=null,T=null,A=new it(0,0,0),R=0,w=!1,b=null,P=null,I=null,V=null,j=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Z=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=Z>=1):ne.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=Z>=2);let ue=null,ve={};const We=n.getParameter(n.SCISSOR_BOX),U=n.getParameter(n.VIEWPORT),Ce=new Wt().fromArray(We),_e=new Wt().fromArray(U);function Re(H,Ve,Oe,Ie){const be=new Uint8Array(4),fe=n.createTexture();n.bindTexture(H,fe),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let $e=0;$e<Oe;$e++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ve,0,n.RGBA,1,1,Ie,0,n.RGBA,n.UNSIGNED_BYTE,be):n.texImage2D(Ve+$e,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,be);return fe}const $={};$[n.TEXTURE_2D]=Re(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(n.DEPTH_TEST),a.setFunc(br),gt(!1),xt(kh),K(n.CULL_FACE),Dt(Ai);function K(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function ye(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Se(H,Ve){return f[H]!==Ve?(n.bindFramebuffer(H,Ve),f[H]=Ve,H===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Ve),H===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Ve),!0):!1}function Be(H,Ve){let Oe=m,Ie=!1;if(H){Oe=p.get(Ve),Oe===void 0&&(Oe=[],p.set(Ve,Oe));const be=H.textures;if(Oe.length!==be.length||Oe[0]!==n.COLOR_ATTACHMENT0){for(let fe=0,$e=be.length;fe<$e;fe++)Oe[fe]=n.COLOR_ATTACHMENT0+fe;Oe.length=be.length,Ie=!0}}else Oe[0]!==n.BACK&&(Oe[0]=n.BACK,Ie=!0);Ie&&n.drawBuffers(Oe)}function Qe(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const Ut={[Ls]:n.FUNC_ADD,[g0]:n.FUNC_SUBTRACT,[v0]:n.FUNC_REVERSE_SUBTRACT};Ut[M0]=n.MIN,Ut[_0]=n.MAX;const nt={[y0]:n.ZERO,[b0]:n.ONE,[S0]:n.SRC_COLOR,[Yl]:n.SRC_ALPHA,[R0]:n.SRC_ALPHA_SATURATE,[A0]:n.DST_COLOR,[T0]:n.DST_ALPHA,[w0]:n.ONE_MINUS_SRC_COLOR,[$l]:n.ONE_MINUS_SRC_ALPHA,[C0]:n.ONE_MINUS_DST_COLOR,[E0]:n.ONE_MINUS_DST_ALPHA,[P0]:n.CONSTANT_COLOR,[L0]:n.ONE_MINUS_CONSTANT_COLOR,[D0]:n.CONSTANT_ALPHA,[I0]:n.ONE_MINUS_CONSTANT_ALPHA};function Dt(H,Ve,Oe,Ie,be,fe,$e,lt,Ft,Pt){if(H===Ai){M===!0&&(ye(n.BLEND),M=!1);return}if(M===!1&&(K(n.BLEND),M=!0),H!==x0){if(H!==g||Pt!==w){if((u!==Ls||_!==Ls)&&(n.blendEquation(n.FUNC_ADD),u=Ls,_=Ls),Pt)switch(H){case mr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case di:n.blendFunc(n.ONE,n.ONE);break;case Vh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Gh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:en("WebGLState: Invalid blending: ",H);break}else switch(H){case mr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case di:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Vh:en("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gh:en("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:en("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,T=null,A.set(0,0,0),R=0,g=H,w=Pt}return}be=be||Ve,fe=fe||Oe,$e=$e||Ie,(Ve!==u||be!==_)&&(n.blendEquationSeparate(Ut[Ve],Ut[be]),u=Ve,_=be),(Oe!==y||Ie!==v||fe!==E||$e!==T)&&(n.blendFuncSeparate(nt[Oe],nt[Ie],nt[fe],nt[$e]),y=Oe,v=Ie,E=fe,T=$e),(lt.equals(A)===!1||Ft!==R)&&(n.blendColor(lt.r,lt.g,lt.b,Ft),A.copy(lt),R=Ft),g=H,w=!1}function B(H,Ve){H.side===vt?ye(n.CULL_FACE):K(n.CULL_FACE);let Oe=H.side===An;Ve&&(Oe=!Oe),gt(Oe),H.blending===mr&&H.transparent===!1?Dt(Ai):Dt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),r.setMask(H.colorWrite);const Ie=H.stencilWrite;o.setTest(Ie),Ie&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Ze(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):ye(n.SAMPLE_ALPHA_TO_COVERAGE)}function gt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function xt(H){H!==p0?(K(n.CULL_FACE),H!==P&&(H===kh?n.cullFace(n.BACK):H===m0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ye(n.CULL_FACE),P=H}function It(H){H!==I&&(q&&n.lineWidth(H),I=H)}function Ze(H,Ve,Oe){H?(K(n.POLYGON_OFFSET_FILL),(V!==Ve||j!==Oe)&&(n.polygonOffset(Ve,Oe),V=Ve,j=Oe)):ye(n.POLYGON_OFFSET_FILL)}function Ot(H){H?K(n.SCISSOR_TEST):ye(n.SCISSOR_TEST)}function st(H){H===void 0&&(H=n.TEXTURE0+te-1),ue!==H&&(n.activeTexture(H),ue=H)}function pt(H,Ve,Oe){Oe===void 0&&(ue===null?Oe=n.TEXTURE0+te-1:Oe=ue);let Ie=ve[Oe];Ie===void 0&&(Ie={type:void 0,texture:void 0},ve[Oe]=Ie),(Ie.type!==H||Ie.texture!==Ve)&&(ue!==Oe&&(n.activeTexture(Oe),ue=Oe),n.bindTexture(H,Ve||$[H]),Ie.type=H,Ie.texture=Ve)}function D(){const H=ve[ue];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function C(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ce(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function Ke(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Pe(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Xe(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function Me(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function we(H){Ce.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Ce.copy(H))}function at(H){_e.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),_e.copy(H))}function rt(H,Ve){let Oe=h.get(Ve);Oe===void 0&&(Oe=new WeakMap,h.set(Ve,Oe));let Ie=Oe.get(H);Ie===void 0&&(Ie=n.getUniformBlockIndex(Ve,H.name),Oe.set(H,Ie))}function He(H,Ve){const Ie=h.get(Ve).get(H);c.get(Ve)!==Ie&&(n.uniformBlockBinding(Ve,Ie,H.__bindingPointIndex),c.set(Ve,Ie))}function ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},ue=null,ve={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,y=null,v=null,_=null,E=null,T=null,A=new it(0,0,0),R=0,w=!1,b=null,P=null,I=null,V=null,j=null,Ce.set(0,0,n.canvas.width,n.canvas.height),_e.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:ye,bindFramebuffer:Se,drawBuffers:Be,useProgram:Qe,setBlending:Dt,setMaterial:B,setFlipSided:gt,setCullFace:xt,setLineWidth:It,setPolygonOffset:Ze,setScissorTest:Ot,activeTexture:st,bindTexture:pt,unbindTexture:D,compressedTexImage2D:C,compressedTexImage3D:J,texImage2D:Xe,texImage3D:Me,updateUBOMapping:rt,uniformBlockBinding:He,texStorage2D:Pe,texStorage3D:et,texSubImage2D:ce,texSubImage3D:ge,compressedTexSubImage2D:re,compressedTexSubImage3D:Ke,scissor:we,viewport:at,reset:ot}}function tv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new De,d=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,C){return m?new OffscreenCanvas(D,C):Co("canvas")}function M(D,C,J){let ce=1;const ge=pt(D);if((ge.width>J||ge.height>J)&&(ce=J/Math.max(ge.width,ge.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const re=Math.floor(ce*ge.width),Ke=Math.floor(ce*ge.height);f===void 0&&(f=x(re,Ke));const Pe=C?x(re,Ke):f;return Pe.width=re,Pe.height=Ke,Pe.getContext("2d").drawImage(D,0,0,re,Ke),mt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+re+"x"+Ke+")."),Pe}else return"data"in D&&mt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),D;return D}function g(D){return D.generateMipmaps}function u(D){n.generateMipmap(D)}function y(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(D,C,J,ce,ge=!1){if(D!==null){if(n[D]!==void 0)return n[D];mt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let re=C;if(C===n.RED&&(J===n.FLOAT&&(re=n.R32F),J===n.HALF_FLOAT&&(re=n.R16F),J===n.UNSIGNED_BYTE&&(re=n.R8)),C===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.R8UI),J===n.UNSIGNED_SHORT&&(re=n.R16UI),J===n.UNSIGNED_INT&&(re=n.R32UI),J===n.BYTE&&(re=n.R8I),J===n.SHORT&&(re=n.R16I),J===n.INT&&(re=n.R32I)),C===n.RG&&(J===n.FLOAT&&(re=n.RG32F),J===n.HALF_FLOAT&&(re=n.RG16F),J===n.UNSIGNED_BYTE&&(re=n.RG8)),C===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RG8UI),J===n.UNSIGNED_SHORT&&(re=n.RG16UI),J===n.UNSIGNED_INT&&(re=n.RG32UI),J===n.BYTE&&(re=n.RG8I),J===n.SHORT&&(re=n.RG16I),J===n.INT&&(re=n.RG32I)),C===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGB8UI),J===n.UNSIGNED_SHORT&&(re=n.RGB16UI),J===n.UNSIGNED_INT&&(re=n.RGB32UI),J===n.BYTE&&(re=n.RGB8I),J===n.SHORT&&(re=n.RGB16I),J===n.INT&&(re=n.RGB32I)),C===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),J===n.UNSIGNED_INT&&(re=n.RGBA32UI),J===n.BYTE&&(re=n.RGBA8I),J===n.SHORT&&(re=n.RGBA16I),J===n.INT&&(re=n.RGBA32I)),C===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),C===n.RGBA){const Ke=ge?Eo:Lt.getTransfer(ce);J===n.FLOAT&&(re=n.RGBA32F),J===n.HALF_FLOAT&&(re=n.RGBA16F),J===n.UNSIGNED_BYTE&&(re=Ke===Gt?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function _(D,C){let J;return D?C===null||C===Os||C===fa?J=n.DEPTH24_STENCIL8:C===wi?J=n.DEPTH32F_STENCIL8:C===ua&&(J=n.DEPTH24_STENCIL8,mt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===Os||C===fa?J=n.DEPTH_COMPONENT24:C===wi?J=n.DEPTH_COMPONENT32F:C===ua&&(J=n.DEPTH_COMPONENT16),J}function E(D,C){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==Xn&&D.minFilter!==jn?Math.log2(Math.max(C.width,C.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?C.mipmaps.length:1}function T(D){const C=D.target;C.removeEventListener("dispose",T),R(C),C.isVideoTexture&&d.delete(C)}function A(D){const C=D.target;C.removeEventListener("dispose",A),b(C)}function R(D){const C=i.get(D);if(C.__webglInit===void 0)return;const J=D.source,ce=p.get(J);if(ce){const ge=ce[C.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&w(D),Object.keys(ce).length===0&&p.delete(J)}i.remove(D)}function w(D){const C=i.get(D);n.deleteTexture(C.__webglTexture);const J=D.source,ce=p.get(J);delete ce[C.__cacheKey],a.memory.textures--}function b(D){const C=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(C.__webglFramebuffer[ce]))for(let ge=0;ge<C.__webglFramebuffer[ce].length;ge++)n.deleteFramebuffer(C.__webglFramebuffer[ce][ge]);else n.deleteFramebuffer(C.__webglFramebuffer[ce]);C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer[ce])}else{if(Array.isArray(C.__webglFramebuffer))for(let ce=0;ce<C.__webglFramebuffer.length;ce++)n.deleteFramebuffer(C.__webglFramebuffer[ce]);else n.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&n.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let ce=0;ce<C.__webglColorRenderbuffer.length;ce++)C.__webglColorRenderbuffer[ce]&&n.deleteRenderbuffer(C.__webglColorRenderbuffer[ce]);C.__webglDepthRenderbuffer&&n.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,ge=J.length;ce<ge;ce++){const re=i.get(J[ce]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),i.remove(J[ce])}i.remove(D)}let P=0;function I(){P=0}function V(){const D=P;return D>=s.maxTextures&&mt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),P+=1,D}function j(D){const C=[];return C.push(D.wrapS),C.push(D.wrapT),C.push(D.wrapR||0),C.push(D.magFilter),C.push(D.minFilter),C.push(D.anisotropy),C.push(D.internalFormat),C.push(D.format),C.push(D.type),C.push(D.generateMipmaps),C.push(D.premultiplyAlpha),C.push(D.flipY),C.push(D.unpackAlignment),C.push(D.colorSpace),C.join()}function te(D,C){const J=i.get(D);if(D.isVideoTexture&&Ot(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)mt("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)mt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,C);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+C)}function q(D,C){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,C);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+C)}function Z(D,C){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,C);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+C)}function ne(D,C){const J=i.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,C);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+C)}const ue={[Rn]:n.REPEAT,[Wi]:n.CLAMP_TO_EDGE,[sc]:n.MIRRORED_REPEAT},ve={[Xn]:n.NEAREST,[N0]:n.NEAREST_MIPMAP_NEAREST,[Fa]:n.NEAREST_MIPMAP_LINEAR,[jn]:n.LINEAR,[tl]:n.LINEAR_MIPMAP_NEAREST,[Is]:n.LINEAR_MIPMAP_LINEAR},We={[k0]:n.NEVER,[q0]:n.ALWAYS,[V0]:n.LESS,[Fu]:n.LEQUAL,[G0]:n.EQUAL,[X0]:n.GEQUAL,[H0]:n.GREATER,[W0]:n.NOTEQUAL};function U(D,C){if(C.type===wi&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===jn||C.magFilter===tl||C.magFilter===Fa||C.magFilter===Is||C.minFilter===jn||C.minFilter===tl||C.minFilter===Fa||C.minFilter===Is)&&mt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,ue[C.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,ue[C.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,ue[C.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,ve[C.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,ve[C.minFilter]),C.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,We[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Xn||C.minFilter!==Fa&&C.minFilter!==Is||C.type===wi&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function Ce(D,C){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,C.addEventListener("dispose",T));const ce=C.source;let ge=p.get(ce);ge===void 0&&(ge={},p.set(ce,ge));const re=j(C);if(re!==D.__cacheKey){ge[re]===void 0&&(ge[re]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),ge[re].usedTimes++;const Ke=ge[D.__cacheKey];Ke!==void 0&&(ge[D.__cacheKey].usedTimes--,Ke.usedTimes===0&&w(C)),D.__cacheKey=re,D.__webglTexture=ge[re].texture}return J}function _e(D,C,J){return Math.floor(Math.floor(D/J)/C)}function Re(D,C,J,ce){const re=D.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,C.width,C.height,J,ce,C.data);else{re.sort((Me,we)=>Me.start-we.start);let Ke=0;for(let Me=1;Me<re.length;Me++){const we=re[Ke],at=re[Me],rt=we.start+we.count,He=_e(at.start,C.width,4),ot=_e(we.start,C.width,4);at.start<=rt+1&&He===ot&&_e(at.start+at.count-1,C.width,4)===He?we.count=Math.max(we.count,at.start+at.count-we.start):(++Ke,re[Ke]=at)}re.length=Ke+1;const Pe=n.getParameter(n.UNPACK_ROW_LENGTH),et=n.getParameter(n.UNPACK_SKIP_PIXELS),Xe=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,C.width);for(let Me=0,we=re.length;Me<we;Me++){const at=re[Me],rt=Math.floor(at.start/4),He=Math.ceil(at.count/4),ot=rt%C.width,H=Math.floor(rt/C.width),Ve=He,Oe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ot),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,ot,H,Ve,Oe,J,ce,C.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Pe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,et),n.pixelStorei(n.UNPACK_SKIP_ROWS,Xe)}}function $(D,C,J){let ce=n.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(ce=n.TEXTURE_2D_ARRAY),C.isData3DTexture&&(ce=n.TEXTURE_3D);const ge=Ce(D,C),re=C.source;t.bindTexture(ce,D.__webglTexture,n.TEXTURE0+J);const Ke=i.get(re);if(re.version!==Ke.__version||ge===!0){t.activeTexture(n.TEXTURE0+J);const Pe=Lt.getPrimaries(Lt.workingColorSpace),et=C.colorSpace===cs?null:Lt.getPrimaries(C.colorSpace),Xe=C.colorSpace===cs||Pe===et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);let Me=M(C.image,!1,s.maxTextureSize);Me=st(C,Me);const we=r.convert(C.format,C.colorSpace),at=r.convert(C.type);let rt=v(C.internalFormat,we,at,C.colorSpace,C.isVideoTexture);U(ce,C);let He;const ot=C.mipmaps,H=C.isVideoTexture!==!0,Ve=Ke.__version===void 0||ge===!0,Oe=re.dataReady,Ie=E(C,Me);if(C.isDepthTexture)rt=_(C.format===ma,C.type),Ve&&(H?t.texStorage2D(n.TEXTURE_2D,1,rt,Me.width,Me.height):t.texImage2D(n.TEXTURE_2D,0,rt,Me.width,Me.height,0,we,at,null));else if(C.isDataTexture)if(ot.length>0){H&&Ve&&t.texStorage2D(n.TEXTURE_2D,Ie,rt,ot[0].width,ot[0].height);for(let be=0,fe=ot.length;be<fe;be++)He=ot[be],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,be,0,0,He.width,He.height,we,at,He.data):t.texImage2D(n.TEXTURE_2D,be,rt,He.width,He.height,0,we,at,He.data);C.generateMipmaps=!1}else H?(Ve&&t.texStorage2D(n.TEXTURE_2D,Ie,rt,Me.width,Me.height),Oe&&Re(C,Me,we,at)):t.texImage2D(n.TEXTURE_2D,0,rt,Me.width,Me.height,0,we,at,Me.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){H&&Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ie,rt,ot[0].width,ot[0].height,Me.depth);for(let be=0,fe=ot.length;be<fe;be++)if(He=ot[be],C.format!==ui)if(we!==null)if(H){if(Oe)if(C.layerUpdates.size>0){const $e=Cd(He.width,He.height,C.format,C.type);for(const lt of C.layerUpdates){const Ft=He.data.subarray(lt*$e/He.data.BYTES_PER_ELEMENT,(lt+1)*$e/He.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,be,0,0,lt,He.width,He.height,1,we,Ft)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,be,0,0,0,He.width,He.height,Me.depth,we,He.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,be,rt,He.width,He.height,Me.depth,0,He.data,0,0);else mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Oe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,be,0,0,0,He.width,He.height,Me.depth,we,at,He.data):t.texImage3D(n.TEXTURE_2D_ARRAY,be,rt,He.width,He.height,Me.depth,0,we,at,He.data)}else{H&&Ve&&t.texStorage2D(n.TEXTURE_2D,Ie,rt,ot[0].width,ot[0].height);for(let be=0,fe=ot.length;be<fe;be++)He=ot[be],C.format!==ui?we!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_2D,be,0,0,He.width,He.height,we,He.data):t.compressedTexImage2D(n.TEXTURE_2D,be,rt,He.width,He.height,0,He.data):mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Oe&&t.texSubImage2D(n.TEXTURE_2D,be,0,0,He.width,He.height,we,at,He.data):t.texImage2D(n.TEXTURE_2D,be,rt,He.width,He.height,0,we,at,He.data)}else if(C.isDataArrayTexture)if(H){if(Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ie,rt,Me.width,Me.height,Me.depth),Oe)if(C.layerUpdates.size>0){const be=Cd(Me.width,Me.height,C.format,C.type);for(const fe of C.layerUpdates){const $e=Me.data.subarray(fe*be/Me.data.BYTES_PER_ELEMENT,(fe+1)*be/Me.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,fe,Me.width,Me.height,1,we,at,$e)}C.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Me.width,Me.height,Me.depth,we,at,Me.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,rt,Me.width,Me.height,Me.depth,0,we,at,Me.data);else if(C.isData3DTexture)H?(Ve&&t.texStorage3D(n.TEXTURE_3D,Ie,rt,Me.width,Me.height,Me.depth),Oe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Me.width,Me.height,Me.depth,we,at,Me.data)):t.texImage3D(n.TEXTURE_3D,0,rt,Me.width,Me.height,Me.depth,0,we,at,Me.data);else if(C.isFramebufferTexture){if(Ve)if(H)t.texStorage2D(n.TEXTURE_2D,Ie,rt,Me.width,Me.height);else{let be=Me.width,fe=Me.height;for(let $e=0;$e<Ie;$e++)t.texImage2D(n.TEXTURE_2D,$e,rt,be,fe,0,we,at,null),be>>=1,fe>>=1}}else if(ot.length>0){if(H&&Ve){const be=pt(ot[0]);t.texStorage2D(n.TEXTURE_2D,Ie,rt,be.width,be.height)}for(let be=0,fe=ot.length;be<fe;be++)He=ot[be],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,be,0,0,we,at,He):t.texImage2D(n.TEXTURE_2D,be,rt,we,at,He);C.generateMipmaps=!1}else if(H){if(Ve){const be=pt(Me);t.texStorage2D(n.TEXTURE_2D,Ie,rt,be.width,be.height)}Oe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,we,at,Me)}else t.texImage2D(n.TEXTURE_2D,0,rt,we,at,Me);g(C)&&u(ce),Ke.__version=re.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function K(D,C,J){if(C.image.length!==6)return;const ce=Ce(D,C),ge=C.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+J);const re=i.get(ge);if(ge.version!==re.__version||ce===!0){t.activeTexture(n.TEXTURE0+J);const Ke=Lt.getPrimaries(Lt.workingColorSpace),Pe=C.colorSpace===cs?null:Lt.getPrimaries(C.colorSpace),et=C.colorSpace===cs||Ke===Pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const Xe=C.isCompressedTexture||C.image[0].isCompressedTexture,Me=C.image[0]&&C.image[0].isDataTexture,we=[];for(let fe=0;fe<6;fe++)!Xe&&!Me?we[fe]=M(C.image[fe],!0,s.maxCubemapSize):we[fe]=Me?C.image[fe].image:C.image[fe],we[fe]=st(C,we[fe]);const at=we[0],rt=r.convert(C.format,C.colorSpace),He=r.convert(C.type),ot=v(C.internalFormat,rt,He,C.colorSpace),H=C.isVideoTexture!==!0,Ve=re.__version===void 0||ce===!0,Oe=ge.dataReady;let Ie=E(C,at);U(n.TEXTURE_CUBE_MAP,C);let be;if(Xe){H&&Ve&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,ot,at.width,at.height);for(let fe=0;fe<6;fe++){be=we[fe].mipmaps;for(let $e=0;$e<be.length;$e++){const lt=be[$e];C.format!==ui?rt!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e,0,0,lt.width,lt.height,rt,lt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e,ot,lt.width,lt.height,0,lt.data):mt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e,0,0,lt.width,lt.height,rt,He,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e,ot,lt.width,lt.height,0,rt,He,lt.data)}}}else{if(be=C.mipmaps,H&&Ve){be.length>0&&Ie++;const fe=pt(we[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,ot,fe.width,fe.height)}for(let fe=0;fe<6;fe++)if(Me){H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,0,0,we[fe].width,we[fe].height,rt,He,we[fe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ot,we[fe].width,we[fe].height,0,rt,He,we[fe].data);for(let $e=0;$e<be.length;$e++){const Ft=be[$e].image[fe].image;H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e+1,0,0,Ft.width,Ft.height,rt,He,Ft.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e+1,ot,Ft.width,Ft.height,0,rt,He,Ft.data)}}else{H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,0,0,rt,He,we[fe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ot,rt,He,we[fe]);for(let $e=0;$e<be.length;$e++){const lt=be[$e];H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e+1,0,0,rt,He,lt.image[fe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,$e+1,ot,rt,He,lt.image[fe])}}}g(C)&&u(n.TEXTURE_CUBE_MAP),re.__version=ge.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function ye(D,C,J,ce,ge,re){const Ke=r.convert(J.format,J.colorSpace),Pe=r.convert(J.type),et=v(J.internalFormat,Ke,Pe,J.colorSpace),Xe=i.get(C),Me=i.get(J);if(Me.__renderTarget=C,!Xe.__hasExternalTextures){const we=Math.max(1,C.width>>re),at=Math.max(1,C.height>>re);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,re,et,we,at,C.depth,0,Ke,Pe,null):t.texImage2D(ge,re,et,we,at,0,Ke,Pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),Ze(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ce,ge,Me.__webglTexture,0,It(C)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ce,ge,Me.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Se(D,C,J){if(n.bindRenderbuffer(n.RENDERBUFFER,D),C.depthBuffer){const ce=C.depthTexture,ge=ce&&ce.isDepthTexture?ce.type:null,re=_(C.stencilBuffer,ge),Ke=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=It(C);Ze(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Pe,re,C.width,C.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Pe,re,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,re,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ke,n.RENDERBUFFER,D)}else{const ce=C.textures;for(let ge=0;ge<ce.length;ge++){const re=ce[ge],Ke=r.convert(re.format,re.colorSpace),Pe=r.convert(re.type),et=v(re.internalFormat,Ke,Pe,re.colorSpace),Xe=It(C);J&&Ze(C)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xe,et,C.width,C.height):Ze(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xe,et,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,et,C.width,C.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(D,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=i.get(C.depthTexture);ce.__renderTarget=C,(!ce.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),te(C.depthTexture,0);const ge=ce.__webglTexture,re=It(C);if(C.depthTexture.format===pa)Ze(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(C.depthTexture.format===ma)Ze(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function Qe(D){const C=i.get(D),J=D.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),ce){const ge=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,ce.removeEventListener("dispose",ge)};ce.addEventListener("dispose",ge),C.__depthDisposeCallback=ge}C.__boundDepthTexture=ce}if(D.depthTexture&&!C.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Be(C.__webglFramebuffer[0],D):Be(C.__webglFramebuffer,D)}else if(J){C.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[ce]),C.__webglDepthbuffer[ce]===void 0)C.__webglDepthbuffer[ce]=n.createRenderbuffer(),Se(C.__webglDepthbuffer[ce],D,!1);else{const ge=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=C.__webglDepthbuffer[ce];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=n.createRenderbuffer(),Se(C.__webglDepthbuffer,D,!1);else{const ge=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=C.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(D,C,J){const ce=i.get(D);C!==void 0&&ye(ce.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&Qe(D)}function nt(D){const C=D.texture,J=i.get(D),ce=i.get(C);D.addEventListener("dispose",A);const ge=D.textures,re=D.isWebGLCubeRenderTarget===!0,Ke=ge.length>1;if(Ke||(ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture()),ce.__version=C.version,a.memory.textures++),re){J.__webglFramebuffer=[];for(let Pe=0;Pe<6;Pe++)if(C.mipmaps&&C.mipmaps.length>0){J.__webglFramebuffer[Pe]=[];for(let et=0;et<C.mipmaps.length;et++)J.__webglFramebuffer[Pe][et]=n.createFramebuffer()}else J.__webglFramebuffer[Pe]=n.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){J.__webglFramebuffer=[];for(let Pe=0;Pe<C.mipmaps.length;Pe++)J.__webglFramebuffer[Pe]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Ke)for(let Pe=0,et=ge.length;Pe<et;Pe++){const Xe=i.get(ge[Pe]);Xe.__webglTexture===void 0&&(Xe.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&Ze(D)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Pe=0;Pe<ge.length;Pe++){const et=ge[Pe];J.__webglColorRenderbuffer[Pe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Pe]);const Xe=r.convert(et.format,et.colorSpace),Me=r.convert(et.type),we=v(et.internalFormat,Xe,Me,et.colorSpace,D.isXRRenderTarget===!0),at=It(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,at,we,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Pe,n.RENDERBUFFER,J.__webglColorRenderbuffer[Pe])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Se(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ce.__webglTexture),U(n.TEXTURE_CUBE_MAP,C);for(let Pe=0;Pe<6;Pe++)if(C.mipmaps&&C.mipmaps.length>0)for(let et=0;et<C.mipmaps.length;et++)ye(J.__webglFramebuffer[Pe][et],D,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,et);else ye(J.__webglFramebuffer[Pe],D,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0);g(C)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ke){for(let Pe=0,et=ge.length;Pe<et;Pe++){const Xe=ge[Pe],Me=i.get(Xe);let we=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(we=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(we,Me.__webglTexture),U(we,Xe),ye(J.__webglFramebuffer,D,Xe,n.COLOR_ATTACHMENT0+Pe,we,0),g(Xe)&&u(we)}t.unbindTexture()}else{let Pe=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Pe=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Pe,ce.__webglTexture),U(Pe,C),C.mipmaps&&C.mipmaps.length>0)for(let et=0;et<C.mipmaps.length;et++)ye(J.__webglFramebuffer[et],D,C,n.COLOR_ATTACHMENT0,Pe,et);else ye(J.__webglFramebuffer,D,C,n.COLOR_ATTACHMENT0,Pe,0);g(C)&&u(Pe),t.unbindTexture()}D.depthBuffer&&Qe(D)}function Dt(D){const C=D.textures;for(let J=0,ce=C.length;J<ce;J++){const ge=C[J];if(g(ge)){const re=y(D),Ke=i.get(ge).__webglTexture;t.bindTexture(re,Ke),u(re),t.unbindTexture()}}}const B=[],gt=[];function xt(D){if(D.samples>0){if(Ze(D)===!1){const C=D.textures,J=D.width,ce=D.height;let ge=n.COLOR_BUFFER_BIT;const re=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ke=i.get(D),Pe=C.length>1;if(Pe)for(let Xe=0;Xe<C.length;Xe++)t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ke.__webglMultisampledFramebuffer);const et=D.texture.mipmaps;et&&et.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer);for(let Xe=0;Xe<C.length;Xe++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),Pe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ke.__webglColorRenderbuffer[Xe]);const Me=i.get(C[Xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Me,0)}n.blitFramebuffer(0,0,J,ce,0,0,J,ce,ge,n.NEAREST),c===!0&&(B.length=0,gt.length=0,B.push(n.COLOR_ATTACHMENT0+Xe),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(re),gt.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,gt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Pe)for(let Xe=0;Xe<C.length;Xe++){t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Xe,n.RENDERBUFFER,Ke.__webglColorRenderbuffer[Xe]);const Me=i.get(C[Xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Xe,n.TEXTURE_2D,Me,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const C=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[C])}}}function It(D){return Math.min(s.maxSamples,D.samples)}function Ze(D){const C=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Ot(D){const C=a.render.frame;d.get(D)!==C&&(d.set(D,C),D.update())}function st(D,C){const J=D.colorSpace,ce=D.format,ge=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==Tr&&J!==cs&&(Lt.getTransfer(J)===Gt?(ce!==ui||ge!==Di)&&mt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):en("WebGLTextures: Unsupported texture color space:",J)),C}function pt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(h.width=D.naturalWidth||D.width,h.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(h.width=D.displayWidth,h.height=D.displayHeight):(h.width=D.width,h.height=D.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=I,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=ne,this.rebindTextures=Ut,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Qe,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=Ze}function nv(n,e){function t(i,s=cs){let r;const a=Lt.getTransfer(s);if(i===Di)return n.UNSIGNED_BYTE;if(i===ih)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Lu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Du)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ru)return n.BYTE;if(i===Pu)return n.SHORT;if(i===ua)return n.UNSIGNED_SHORT;if(i===nh)return n.INT;if(i===Os)return n.UNSIGNED_INT;if(i===wi)return n.FLOAT;if(i===Ci)return n.HALF_FLOAT;if(i===Iu)return n.ALPHA;if(i===Uu)return n.RGB;if(i===ui)return n.RGBA;if(i===pa)return n.DEPTH_COMPONENT;if(i===ma)return n.DEPTH_STENCIL;if(i===rh)return n.RED;if(i===ah)return n.RED_INTEGER;if(i===oh)return n.RG;if(i===lh)return n.RG_INTEGER;if(i===ch)return n.RGBA_INTEGER;if(i===go||i===vo||i===Mo||i===_o)if(a===Gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===go)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===_o)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===go)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Mo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===_o)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rc||i===ac||i===oc||i===lc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ac)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===oc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cc||i===hc||i===dc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cc||i===hc)return a===Gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===dc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===uc||i===fc||i===pc||i===mc||i===xc||i===gc||i===vc||i===Mc||i===_c||i===yc||i===bc||i===Sc||i===wc||i===Tc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===uc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===fc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===pc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===mc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===vc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Mc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_c)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===yc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tc)return a===Gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ec||i===Ac||i===Cc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ec)return a===Gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ac)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Cc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Rc||i===Pc||i===Lc||i===Dc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Rc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Pc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Lc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===fa?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sv=`
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

}`;class rv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new $u(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gn({vertexShader:iv,fragmentShader:sv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new O(new Yt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class av extends Rr{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,d=null,f=null,p=null,m=null,x=null;const M=typeof XRWebGLBinding<"u",g=new rv,u={},y=t.getContextAttributes();let v=null,_=null;const E=[],T=[],A=new De;let R=null;const w=new Hn;w.viewport=new Wt;const b=new Hn;b.viewport=new Wt;const P=[w,b],I=new wm;let V=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new bl,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new bl,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new bl,E[$]=K),K.getHandSpace()};function te($){const K=T.indexOf($.inputSource);if(K===-1)return;const ye=E[K];ye!==void 0&&(ye.update($.inputSource,$.frame,h||a),ye.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}V=null,j=null,g.reset();for(const $ in u)delete u[$];e.setRenderTarget(v),m=null,p=null,f=null,s=null,_=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&mt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&mt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),y.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,Se=null,Be=null;y.depth&&(Be=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=y.stencil?ma:pa,Se=y.stencil?fa:Os);const Qe={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:r};f=this.getBinding(),p=f.createProjectionLayer(Qe),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new pi(p.textureWidth,p.textureHeight,{format:ui,type:Di,depthTexture:new Yu(p.textureWidth,p.textureHeight,Se,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const ye={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,ye),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new pi(m.framebufferWidth,m.framebufferHeight,{format:ui,type:Di,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z($){for(let K=0;K<$.removed.length;K++){const ye=$.removed[K],Se=T.indexOf(ye);Se>=0&&(T[Se]=null,E[Se].disconnect(ye))}for(let K=0;K<$.added.length;K++){const ye=$.added[K];let Se=T.indexOf(ye);if(Se===-1){for(let Qe=0;Qe<E.length;Qe++)if(Qe>=T.length){T.push(ye),Se=Qe;break}else if(T[Qe]===null){T[Qe]=ye,Se=Qe;break}if(Se===-1)break}const Be=E[Se];Be&&Be.connect(ye)}}const ne=new L,ue=new L;function ve($,K,ye){ne.setFromMatrixPosition(K.matrixWorld),ue.setFromMatrixPosition(ye.matrixWorld);const Se=ne.distanceTo(ue),Be=K.projectionMatrix.elements,Qe=ye.projectionMatrix.elements,Ut=Be[14]/(Be[10]-1),nt=Be[14]/(Be[10]+1),Dt=(Be[9]+1)/Be[5],B=(Be[9]-1)/Be[5],gt=(Be[8]-1)/Be[0],xt=(Qe[8]+1)/Qe[0],It=Ut*gt,Ze=Ut*xt,Ot=Se/(-gt+xt),st=Ot*-gt;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(st),$.translateZ(Ot),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Be[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const pt=Ut+Ot,D=nt+Ot,C=It-st,J=Ze+(Se-st),ce=Dt*nt/D*pt,ge=B*nt/D*pt;$.projectionMatrix.makePerspective(C,J,ce,ge,pt,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function We($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,ye=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(ye=g.depthFar)),I.near=b.near=w.near=K,I.far=b.far=w.far=ye,(V!==I.near||j!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),V=I.near,j=I.far),I.layers.mask=$.layers.mask|6,w.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const Se=$.parent,Be=I.cameras;We(I,Se);for(let Qe=0;Qe<Be.length;Qe++)We(Be[Qe],Se);Be.length===2?ve(I,w,b):I.projectionMatrix.copy(w.projectionMatrix),U($,I,Se)};function U($,K,ye){ye===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(ye.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ga*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function($){return u[$]};let Ce=null;function _e($,K){if(d=K.getViewerPose(h||a),x=K,d!==null){const ye=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let Se=!1;ye.length!==I.cameras.length&&(I.cameras.length=0,Se=!0);for(let nt=0;nt<ye.length;nt++){const Dt=ye[nt];let B=null;if(m!==null)B=m.getViewport(Dt);else{const xt=f.getViewSubImage(p,Dt);B=xt.viewport,nt===0&&(e.setRenderTargetTextures(_,xt.colorTexture,xt.depthStencilTexture),e.setRenderTarget(_))}let gt=P[nt];gt===void 0&&(gt=new Hn,gt.layers.enable(nt),gt.viewport=new Wt,P[nt]=gt),gt.matrix.fromArray(Dt.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(Dt.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(B.x,B.y,B.width,B.height),nt===0&&(I.matrix.copy(gt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Se===!0&&I.cameras.push(gt)}const Be=s.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=i.getBinding();const nt=f.getDepthInformation(ye[0]);nt&&nt.isValid&&nt.texture&&g.init(nt,s.renderState)}if(Be&&Be.includes("camera-access")&&M){e.state.unbindTexture(),f=i.getBinding();for(let nt=0;nt<ye.length;nt++){const Dt=ye[nt].camera;if(Dt){let B=u[Dt];B||(B=new $u,u[Dt]=B);const gt=f.getCameraImage(Dt);B.sourceTexture=gt}}}}for(let ye=0;ye<E.length;ye++){const Se=T[ye],Be=E[ye];Se!==null&&Be!==void 0&&Be.update(Se,K,h||a)}Ce&&Ce($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Re=new af;Re.setAnimationLoop(_e),this.setAnimationLoop=function($){Ce=$},this.dispose=function(){}}}const Es=new xi,ov=new wt;function lv(n,e){function t(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,Vu(n)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function s(g,u,y,v,_){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(g,u):u.isMeshToonMaterial?(r(g,u),f(g,u)):u.isMeshPhongMaterial?(r(g,u),d(g,u)):u.isMeshStandardMaterial?(r(g,u),p(g,u),u.isMeshPhysicalMaterial&&m(g,u,_)):u.isMeshMatcapMaterial?(r(g,u),x(g,u)):u.isMeshDepthMaterial?r(g,u):u.isMeshDistanceMaterial?(r(g,u),M(g,u)):u.isMeshNormalMaterial?r(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,y,v):u.isSpriteMaterial?h(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,t(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===An&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,t(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===An&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,t(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,t(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const y=e.get(u),v=y.envMap,_=y.envMapRotation;v&&(g.envMap.value=v,Es.copy(_),Es.x*=-1,Es.y*=-1,Es.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Es.y*=-1,Es.z*=-1),g.envMapRotation.value.setFromMatrix4(ov.makeRotationFromEuler(Es)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,y,v){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*y,g.scale.value=v*.5,u.map&&(g.map.value=u.map,t(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function d(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function f(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function p(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,y){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===An&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function M(g,u){const y=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function cv(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function h(y,v){let _=s[y.id];_===void 0&&(x(y),_=d(y),s[y.id]=_,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;r[y.id]!==T&&(p(y),r[y.id]=T)}function d(y){const v=f();y.__bindingPointIndex=v;const _=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return en("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(y){const v=s[y.id],_=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=_.length;T<A;T++){const R=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,b=R.length;w<b;w++){const P=R[w];if(m(P,T,w,E)===!0){const I=P.__offset,V=Array.isArray(P.value)?P.value:[P.value];let j=0;for(let te=0;te<V.length;te++){const q=V[te],Z=M(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,I+j,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,j),j+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,_,E){const T=y.value,A=v+"_"+_;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const R=E[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(y){const v=y.uniforms;let _=0;const E=16;for(let A=0,R=v.length;A<R;A++){const w=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,P=w.length;b<P;b++){const I=w[b],V=Array.isArray(I.value)?I.value:[I.value];for(let j=0,te=V.length;j<te;j++){const q=V[j],Z=M(q),ne=_%E,ue=ne%Z.boundary,ve=ne+ue;_+=ue,ve!==0&&E-ve<Z.storage&&(_+=E-ve),I.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=Z.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function M(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?mt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):mt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const _=a.indexOf(v.__bindingPointIndex);a.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function u(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:c,update:h,dispose:u}}const hv=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let ki=null;function dv(){return ki===null&&(ki=new qu(hv,32,32,oh,Ci),ki.minFilter=jn,ki.magFilter=jn,ki.wrapS=Wi,ki.wrapT=Wi,ki.generateMipmaps=!1,ki.needsUpdate=!0),ki}class uv{constructor(e={}){const{canvas:t=Y0(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=new Set([ch,lh,ah]),M=new Set([Di,Os,ua,fa,ih,sh]),g=new Uint32Array(4),u=new Int32Array(4);let y=null,v=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let A=!1;this._outputColorSpace=Rt;let R=0,w=0,b=null,P=-1,I=null;const V=new Wt,j=new Wt;let te=null;const q=new it(0);let Z=0,ne=t.width,ue=t.height,ve=1,We=null,U=null;const Ce=new Wt(0,0,ne,ue),_e=new Wt(0,0,ne,ue);let Re=!1;const $=new gh;let K=!1,ye=!1;const Se=new wt,Be=new L,Qe=new Wt,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function Dt(){return b===null?ve:1}let B=i;function gt(S,F){return t.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Qc}`),t.addEventListener("webglcontextlost",be,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",$e,!1),B===null){const F="webgl2";if(B=gt(F,S),B===null)throw gt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw S("WebGLRenderer: "+S.message),S}let xt,It,Ze,Ot,st,pt,D,C,J,ce,ge,re,Ke,Pe,et,Xe,Me,we,at,rt,He,ot,H,Ve;function Oe(){xt=new _1(B),xt.init(),ot=new nv(B,xt),It=new d1(B,xt,e,ot),Ze=new ev(B,xt),It.reversedDepthBuffer&&p&&Ze.buffers.depth.setReversed(!0),Ot=new S1(B),st=new V2,pt=new tv(B,xt,Ze,st,It,ot,Ot),D=new f1(T),C=new M1(T),J=new Am(B),H=new c1(B,J),ce=new y1(B,J,Ot,H),ge=new T1(B,ce,J,Ot),at=new w1(B,It,pt),Xe=new u1(st),re=new k2(T,D,C,xt,It,H,Xe),Ke=new lv(T,st),Pe=new H2,et=new Z2(xt),we=new l1(T,D,C,Ze,ge,m,c),Me=new j2(T,ge,It),Ve=new cv(B,Ot,It,Ze),rt=new h1(B,xt,Ot),He=new b1(B,xt,Ot),Ot.programs=re.programs,T.capabilities=It,T.extensions=xt,T.properties=st,T.renderLists=Pe,T.shadowMap=Me,T.state=Ze,T.info=Ot}Oe();const Ie=new av(T,B);this.xr=Ie,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const S=xt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=xt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(S){S!==void 0&&(ve=S,this.setSize(ne,ue,!1))},this.getSize=function(S){return S.set(ne,ue)},this.setSize=function(S,F,G=!0){if(Ie.isPresenting){mt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=S,ue=F,t.width=Math.floor(S*ve),t.height=Math.floor(F*ve),G===!0&&(t.style.width=S+"px",t.style.height=F+"px"),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(ne*ve,ue*ve).floor()},this.setDrawingBufferSize=function(S,F,G){ne=S,ue=F,ve=G,t.width=Math.floor(S*G),t.height=Math.floor(F*G),this.setViewport(0,0,S,F)},this.getCurrentViewport=function(S){return S.copy(V)},this.getViewport=function(S){return S.copy(Ce)},this.setViewport=function(S,F,G,X){S.isVector4?Ce.set(S.x,S.y,S.z,S.w):Ce.set(S,F,G,X),Ze.viewport(V.copy(Ce).multiplyScalar(ve).round())},this.getScissor=function(S){return S.copy(_e)},this.setScissor=function(S,F,G,X){S.isVector4?_e.set(S.x,S.y,S.z,S.w):_e.set(S,F,G,X),Ze.scissor(j.copy(_e).multiplyScalar(ve).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(S){Ze.setScissorTest(Re=S)},this.setOpaqueSort=function(S){We=S},this.setTransparentSort=function(S){U=S},this.getClearColor=function(S){return S.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,G=!0){let X=0;if(S){let k=!1;if(b!==null){const oe=b.texture.format;k=x.has(oe)}if(k){const oe=b.texture.type,ae=M.has(oe),Q=we.getClearColor(),he=we.getClearAlpha(),Te=Q.r,ke=Q.g,Ee=Q.b;ae?(g[0]=Te,g[1]=ke,g[2]=Ee,g[3]=he,B.clearBufferuiv(B.COLOR,0,g)):(u[0]=Te,u[1]=ke,u[2]=Ee,u[3]=he,B.clearBufferiv(B.COLOR,0,u))}else X|=B.COLOR_BUFFER_BIT}F&&(X|=B.DEPTH_BUFFER_BIT),G&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",be,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",$e,!1),we.dispose(),Pe.dispose(),et.dispose(),st.dispose(),D.dispose(),C.dispose(),ge.dispose(),H.dispose(),Ve.dispose(),re.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",Da),Ie.removeEventListener("sessionend",Ur),gi.stop()};function be(S){S.preventDefault(),Ro("WebGLRenderer: Context Lost."),A=!0}function fe(){Ro("WebGLRenderer: Context Restored."),A=!1;const S=Ot.autoReset,F=Me.enabled,G=Me.autoUpdate,X=Me.needsUpdate,k=Me.type;Oe(),Ot.autoReset=S,Me.enabled=F,Me.autoUpdate=G,Me.needsUpdate=X,Me.type=k}function $e(S){en("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function lt(S){const F=S.target;F.removeEventListener("dispose",lt),Ft(F)}function Ft(S){Pt(S),st.remove(S)}function Pt(S){const F=st.get(S).programs;F!==void 0&&(F.forEach(function(G){re.releaseProgram(G)}),S.isShaderMaterial&&re.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,G,X,k,oe){F===null&&(F=Ut);const ae=k.isMesh&&k.matrixWorld.determinant()<0,Q=N(S,F,G,X,k);Ze.setMaterial(X,ae);let he=G.index,Te=1;if(X.wireframe===!0){if(he=ce.getWireframeAttribute(G),he===void 0)return;Te=2}const ke=G.drawRange,Ee=G.attributes.position;let Ue=ke.start*Te,ct=(ke.start+ke.count)*Te;oe!==null&&(Ue=Math.max(Ue,oe.start*Te),ct=Math.min(ct,(oe.start+oe.count)*Te)),he!==null?(Ue=Math.max(Ue,0),ct=Math.min(ct,he.count)):Ee!=null&&(Ue=Math.max(Ue,0),ct=Math.min(ct,Ee.count));const Mt=ct-Ue;if(Mt<0||Mt===1/0)return;H.setup(k,X,Q,G,he);let Et,_t=rt;if(he!==null&&(Et=J.get(he),_t=He,_t.setIndex(Et)),k.isMesh)X.wireframe===!0?(Ze.setLineWidth(X.wireframeLinewidth*Dt()),_t.setMode(B.LINES)):_t.setMode(B.TRIANGLES);else if(k.isLine){let Ye=X.linewidth;Ye===void 0&&(Ye=1),Ze.setLineWidth(Ye*Dt()),k.isLineSegments?_t.setMode(B.LINES):k.isLineLoop?_t.setMode(B.LINE_LOOP):_t.setMode(B.LINE_STRIP)}else k.isPoints?_t.setMode(B.POINTS):k.isSprite&&_t.setMode(B.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)xa("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_t.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(xt.get("WEBGL_multi_draw"))_t.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ye=k._multiDrawStarts,At=k._multiDrawCounts,dt=k._multiDrawCount,Kt=he?J.get(he).bytesPerElement:1,Ui=st.get(X).currentProgram.getUniforms();for(let jt=0;jt<dt;jt++)Ui.setValue(B,"_gl_DrawID",jt),_t.render(Ye[jt]/Kt,At[jt])}else if(k.isInstancedMesh)_t.renderInstances(Ue,Mt,k.count);else if(G.isInstancedBufferGeometry){const Ye=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,At=Math.min(G.instanceCount,Ye);_t.renderInstances(Ue,Mt,At)}else _t.render(Ue,Mt)};function Pn(S,F,G){S.transparent===!0&&S.side===vt&&S.forceSinglePass===!1?(S.side=An,S.needsUpdate=!0,cn(S,F,G),S.side=xs,S.needsUpdate=!0,cn(S,F,G),S.side=vt):cn(S,F,G)}this.compile=function(S,F,G=null){G===null&&(G=S),v=et.get(G),v.init(F),E.push(v),G.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),S!==G&&S.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),v.setupLights();const X=new Set;return S.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const oe=k.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const Q=oe[ae];Pn(Q,G,k),X.add(Q)}else Pn(oe,G,k),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(S,F,G=null){const X=this.compile(S,F,G);return new Promise(k=>{function oe(){if(X.forEach(function(ae){st.get(ae).currentProgram.isReady()&&X.delete(ae)}),X.size===0){k(S);return}setTimeout(oe,10)}xt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let yn=null;function ti(S){yn&&yn(S)}function Da(){gi.stop()}function Ur(){gi.start()}const gi=new af;gi.setAnimationLoop(ti),typeof self<"u"&&gi.setContext(self),this.setAnimationLoop=function(S){yn=S,Ie.setAnimationLoop(S),S===null?gi.stop():gi.start()},Ie.addEventListener("sessionstart",Da),Ie.addEventListener("sessionend",Ur),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){en("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(F),F=Ie.getCamera()),S.isScene===!0&&S.onBeforeRender(T,S,F,b),v=et.get(S,E.length),v.init(F),E.push(v),Se.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Se,Ti,F.reversedDepth),ye=this.localClippingEnabled,K=Xe.init(this.clippingPlanes,ye),y=Pe.get(S,_.length),y.init(),_.push(y),Ie.enabled===!0&&Ie.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&vi(oe,F,-1/0,T.sortObjects)}vi(S,F,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort(We,U),nt=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,nt&&we.addToRenderList(y,S),this.info.render.frame++,K===!0&&Xe.beginShadows();const G=v.state.shadowsArray;Me.render(G,S,F),K===!0&&Xe.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,k=y.transmissive;if(v.setupLights(),F.isArrayCamera){const oe=F.cameras;if(k.length>0)for(let ae=0,Q=oe.length;ae<Q;ae++){const he=oe[ae];Fr(X,k,S,he)}nt&&we.render(S);for(let ae=0,Q=oe.length;ae<Q;ae++){const he=oe[ae];Mi(y,S,he,he.viewport)}}else k.length>0&&Fr(X,k,S,F),nt&&we.render(S),Mi(y,S,F);b!==null&&w===0&&(pt.updateMultisampleRenderTarget(b),pt.updateRenderTargetMipmap(b)),S.isScene===!0&&S.onAfterRender(T,S,F),H.resetDefaultState(),P=-1,I=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&Xe.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?y=_[_.length-1]:y=null};function vi(S,F,G,X){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLight)v.pushLight(S),S.castShadow&&v.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||$.intersectsSprite(S)){X&&Qe.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Se);const ae=ge.update(S),Q=S.material;Q.visible&&y.push(S,ae,Q,G,Qe.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||$.intersectsObject(S))){const ae=ge.update(S),Q=S.material;if(X&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Qe.copy(S.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Qe.copy(ae.boundingSphere.center)),Qe.applyMatrix4(S.matrixWorld).applyMatrix4(Se)),Array.isArray(Q)){const he=ae.groups;for(let Te=0,ke=he.length;Te<ke;Te++){const Ee=he[Te],Ue=Q[Ee.materialIndex];Ue&&Ue.visible&&y.push(S,ae,Ue,G,Qe.z,Ee)}}else Q.visible&&y.push(S,ae,Q,G,Qe.z,null)}}const oe=S.children;for(let ae=0,Q=oe.length;ae<Q;ae++)vi(oe[ae],F,G,X)}function Mi(S,F,G,X){const{opaque:k,transmissive:oe,transparent:ae}=S;v.setupLightsView(G),K===!0&&Xe.setGlobalState(T.clippingPlanes,G),X&&Ze.viewport(V.copy(X)),k.length>0&&Xs(k,F,G),oe.length>0&&Xs(oe,F,G),ae.length>0&&Xs(ae,F,G),Ze.buffers.depth.setTest(!0),Ze.buffers.depth.setMask(!0),Ze.buffers.color.setMask(!0),Ze.setPolygonOffset(!1)}function Fr(S,F,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new pi(1,1,{generateMipmaps:!0,type:xt.has("EXT_color_buffer_half_float")||xt.has("EXT_color_buffer_float")?Ci:Di,minFilter:Is,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],ae=X.viewport||V;oe.setSize(ae.z*T.transmissionResolutionScale,ae.w*T.transmissionResolutionScale);const Q=T.getRenderTarget(),he=T.getActiveCubeFace(),Te=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),Z=T.getClearAlpha(),Z<1&&T.setClearColor(16777215,.5),T.clear(),nt&&we.render(G);const ke=T.toneMapping;T.toneMapping=fs;const Ee=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&Xe.setGlobalState(T.clippingPlanes,X),Xs(S,G,X),pt.updateMultisampleRenderTarget(oe),pt.updateRenderTargetMipmap(oe),xt.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let ct=0,Mt=F.length;ct<Mt;ct++){const Et=F[ct],{object:_t,geometry:Ye,material:At,group:dt}=Et;if(At.side===vt&&_t.layers.test(X.layers)){const Kt=At.side;At.side=An,At.needsUpdate=!0,Ia(_t,G,X,Ye,At,dt),At.side=Kt,At.needsUpdate=!0,Ue=!0}}Ue===!0&&(pt.updateMultisampleRenderTarget(oe),pt.updateRenderTargetMipmap(oe))}T.setRenderTarget(Q,he,Te),T.setClearColor(q,Z),Ee!==void 0&&(X.viewport=Ee),T.toneMapping=ke}function Xs(S,F,G){const X=F.isScene===!0?F.overrideMaterial:null;for(let k=0,oe=S.length;k<oe;k++){const ae=S[k],{object:Q,geometry:he,group:Te}=ae;let ke=ae.material;ke.allowOverride===!0&&X!==null&&(ke=X),Q.layers.test(G.layers)&&Ia(Q,F,G,he,ke,Te)}}function Ia(S,F,G,X,k,oe){S.onBeforeRender(T,F,G,X,k,oe),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),k.onBeforeRender(T,F,G,X,S,oe),k.transparent===!0&&k.side===vt&&k.forceSinglePass===!1?(k.side=An,k.needsUpdate=!0,T.renderBufferDirect(G,F,X,k,S,oe),k.side=xs,k.needsUpdate=!0,T.renderBufferDirect(G,F,X,k,S,oe),k.side=vt):T.renderBufferDirect(G,F,X,k,S,oe),S.onAfterRender(T,F,G,X,k,oe)}function cn(S,F,G){F.isScene!==!0&&(F=Ut);const X=st.get(S),k=v.state.lights,oe=v.state.shadowsArray,ae=k.state.version,Q=re.getParameters(S,k.state,oe,F,G),he=re.getProgramCacheKey(Q);let Te=X.programs;X.environment=S.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(S.isMeshStandardMaterial?C:D).get(S.envMap||X.environment),X.envMapRotation=X.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Te===void 0&&(S.addEventListener("dispose",lt),Te=new Map,X.programs=Te);let ke=Te.get(he);if(ke!==void 0){if(X.currentProgram===ke&&X.lightsStateVersion===ae)return Nr(S,Q),ke}else Q.uniforms=re.getUniforms(S),S.onBeforeCompile(Q,T),ke=re.acquireProgram(Q,he),Te.set(he,ke),X.uniforms=Q.uniforms;const Ee=X.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ee.clippingPlanes=Xe.uniform),Nr(S,Q),X.needsLights=Y(S),X.lightsStateVersion=ae,X.needsLights&&(Ee.ambientLightColor.value=k.state.ambient,Ee.lightProbe.value=k.state.probe,Ee.directionalLights.value=k.state.directional,Ee.directionalLightShadows.value=k.state.directionalShadow,Ee.spotLights.value=k.state.spot,Ee.spotLightShadows.value=k.state.spotShadow,Ee.rectAreaLights.value=k.state.rectArea,Ee.ltc_1.value=k.state.rectAreaLTC1,Ee.ltc_2.value=k.state.rectAreaLTC2,Ee.pointLights.value=k.state.point,Ee.pointLightShadows.value=k.state.pointShadow,Ee.hemisphereLights.value=k.state.hemi,Ee.directionalShadowMap.value=k.state.directionalShadowMap,Ee.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ee.spotShadowMap.value=k.state.spotShadowMap,Ee.spotLightMatrix.value=k.state.spotLightMatrix,Ee.spotLightMap.value=k.state.spotLightMap,Ee.pointShadowMap.value=k.state.pointShadowMap,Ee.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=ke,X.uniformsList=null,ke}function Ua(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=yo.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Nr(S,F){const G=st.get(S);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function N(S,F,G,X,k){F.isScene!==!0&&(F=Ut),pt.resetTextureUnits();const oe=F.fog,ae=X.isMeshStandardMaterial?F.environment:null,Q=b===null?T.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Tr,he=(X.isMeshStandardMaterial?C:D).get(X.envMap||ae),Te=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ke=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ee=!!G.morphAttributes.position,Ue=!!G.morphAttributes.normal,ct=!!G.morphAttributes.color;let Mt=fs;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(Mt=T.toneMapping);const Et=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,_t=Et!==void 0?Et.length:0,Ye=st.get(X),At=v.state.lights;if(K===!0&&(ye===!0||S!==I)){const Ln=S===I&&X.id===P;Xe.setState(X,S,Ln)}let dt=!1;X.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==At.state.version||Ye.outputColorSpace!==Q||k.isBatchedMesh&&Ye.batching===!1||!k.isBatchedMesh&&Ye.batching===!0||k.isBatchedMesh&&Ye.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ye.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ye.instancing===!1||!k.isInstancedMesh&&Ye.instancing===!0||k.isSkinnedMesh&&Ye.skinning===!1||!k.isSkinnedMesh&&Ye.skinning===!0||k.isInstancedMesh&&Ye.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ye.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ye.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ye.instancingMorph===!1&&k.morphTexture!==null||Ye.envMap!==he||X.fog===!0&&Ye.fog!==oe||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==Xe.numPlanes||Ye.numIntersection!==Xe.numIntersection)||Ye.vertexAlphas!==Te||Ye.vertexTangents!==ke||Ye.morphTargets!==Ee||Ye.morphNormals!==Ue||Ye.morphColors!==ct||Ye.toneMapping!==Mt||Ye.morphTargetsCount!==_t)&&(dt=!0):(dt=!0,Ye.__version=X.version);let Kt=Ye.currentProgram;dt===!0&&(Kt=cn(X,F,k));let Ui=!1,jt=!1,Yn=!1;const Bt=Kt.getUniforms(),hn=Ye.uniforms;if(Ze.useProgram(Kt.program)&&(Ui=!0,jt=!0,Yn=!0),X.id!==P&&(P=X.id,jt=!0),Ui||I!==S){Ze.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Bt.setValue(B,"projectionMatrix",S.projectionMatrix),Bt.setValue(B,"viewMatrix",S.matrixWorldInverse);const On=Bt.map.cameraPosition;On!==void 0&&On.setValue(B,Be.setFromMatrixPosition(S.matrixWorld)),It.logarithmicDepthBuffer&&Bt.setValue(B,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Bt.setValue(B,"isOrthographic",S.isOrthographicCamera===!0),I!==S&&(I=S,jt=!0,Yn=!0)}if(k.isSkinnedMesh){Bt.setOptional(B,k,"bindMatrix"),Bt.setOptional(B,k,"bindMatrixInverse");const Ln=k.skeleton;Ln&&(Ln.boneTexture===null&&Ln.computeBoneTexture(),Bt.setValue(B,"boneTexture",Ln.boneTexture,pt))}k.isBatchedMesh&&(Bt.setOptional(B,k,"batchingTexture"),Bt.setValue(B,"batchingTexture",k._matricesTexture,pt),Bt.setOptional(B,k,"batchingIdTexture"),Bt.setValue(B,"batchingIdTexture",k._indirectTexture,pt),Bt.setOptional(B,k,"batchingColorTexture"),k._colorsTexture!==null&&Bt.setValue(B,"batchingColorTexture",k._colorsTexture,pt));const $n=G.morphAttributes;if(($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)&&at.update(k,G,Kt),(jt||Ye.receiveShadow!==k.receiveShadow)&&(Ye.receiveShadow=k.receiveShadow,Bt.setValue(B,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(hn.envMap.value=he,hn.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(hn.envMapIntensity.value=F.environmentIntensity),hn.dfgLUT!==void 0&&(hn.dfgLUT.value=dv()),jt&&(Bt.setValue(B,"toneMappingExposure",T.toneMappingExposure),Ye.needsLights&&z(hn,Yn),oe&&X.fog===!0&&Ke.refreshFogUniforms(hn,oe),Ke.refreshMaterialUniforms(hn,X,ve,ue,v.state.transmissionRenderTarget[S.id]),yo.upload(B,Ua(Ye),hn,pt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(yo.upload(B,Ua(Ye),hn,pt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Bt.setValue(B,"center",k.center),Bt.setValue(B,"modelViewMatrix",k.modelViewMatrix),Bt.setValue(B,"normalMatrix",k.normalMatrix),Bt.setValue(B,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Ln=X.uniformsGroups;for(let On=0,el=Ln.length;On<el;On++){const _s=Ln[On];Ve.update(_s,Kt),Ve.bind(_s,Kt)}}return Kt}function z(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Y(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(S,F,G){const X=st.get(S);X.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),st.get(S.texture).__webglTexture=F,st.get(S.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){const G=st.get(S);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(S,F=0,G=0){b=S,R=F,w=G;let X=!0,k=null,oe=!1,ae=!1;if(S){const he=st.get(S);if(he.__useDefaultFramebuffer!==void 0)Ze.bindFramebuffer(B.FRAMEBUFFER,null),X=!1;else if(he.__webglFramebuffer===void 0)pt.setupRenderTarget(S);else if(he.__hasExternalTextures)pt.rebindTextures(S,st.get(S.texture).__webglTexture,st.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ee=S.depthTexture;if(he.__boundDepthTexture!==Ee){if(Ee!==null&&st.has(Ee)&&(S.width!==Ee.image.width||S.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");pt.setupDepthRenderbuffer(S)}}const Te=S.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ae=!0);const ke=st.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(ke[F])?k=ke[F][G]:k=ke[F],oe=!0):S.samples>0&&pt.useMultisampledRTT(S)===!1?k=st.get(S).__webglMultisampledFramebuffer:Array.isArray(ke)?k=ke[G]:k=ke,V.copy(S.viewport),j.copy(S.scissor),te=S.scissorTest}else V.copy(Ce).multiplyScalar(ve).floor(),j.copy(_e).multiplyScalar(ve).floor(),te=Re;if(G!==0&&(k=ee),Ze.bindFramebuffer(B.FRAMEBUFFER,k)&&X&&Ze.drawBuffers(S,k),Ze.viewport(V),Ze.scissor(j),Ze.setScissorTest(te),oe){const he=st.get(S.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+F,he.__webglTexture,G)}else if(ae){const he=F;for(let Te=0;Te<S.textures.length;Te++){const ke=st.get(S.textures[Te]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Te,ke.__webglTexture,G,he)}}else if(S!==null&&G!==0){const he=st.get(S.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,he.__webglTexture,G)}P=-1},this.readRenderTargetPixels=function(S,F,G,X,k,oe,ae,Q=0){if(!(S&&S.isWebGLRenderTarget)){en("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=st.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he){Ze.bindFramebuffer(B.FRAMEBUFFER,he);try{const Te=S.textures[Q],ke=Te.format,Ee=Te.type;if(!It.textureFormatReadable(ke)){en("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(Ee)){en("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-X&&G>=0&&G<=S.height-k&&(S.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(F,G,X,k,ot.convert(ke),ot.convert(Ee),oe))}finally{const Te=b!==null?st.get(b).__webglFramebuffer:null;Ze.bindFramebuffer(B.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(S,F,G,X,k,oe,ae,Q=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=st.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he)if(F>=0&&F<=S.width-X&&G>=0&&G<=S.height-k){Ze.bindFramebuffer(B.FRAMEBUFFER,he);const Te=S.textures[Q],ke=Te.format,Ee=Te.type;if(!It.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ue=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ue),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),S.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(F,G,X,k,ot.convert(ke),ot.convert(Ee),0);const ct=b!==null?st.get(b).__webglFramebuffer:null;Ze.bindFramebuffer(B.FRAMEBUFFER,ct);const Mt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await $0(B,Mt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ue),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.deleteBuffer(Ue),B.deleteSync(Mt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,G=0){const X=Math.pow(2,-G),k=Math.floor(S.image.width*X),oe=Math.floor(S.image.height*X),ae=F!==null?F.x:0,Q=F!==null?F.y:0;pt.setTexture2D(S,0),B.copyTexSubImage2D(B.TEXTURE_2D,G,0,0,ae,Q,k,oe),Ze.unbindTexture()};const ie=B.createFramebuffer(),le=B.createFramebuffer();this.copyTextureToTexture=function(S,F,G=null,X=null,k=0,oe=null){oe===null&&(k!==0?(xa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=k,k=0):oe=0);let ae,Q,he,Te,ke,Ee,Ue,ct,Mt;const Et=S.isCompressedTexture?S.mipmaps[oe]:S.image;if(G!==null)ae=G.max.x-G.min.x,Q=G.max.y-G.min.y,he=G.isBox3?G.max.z-G.min.z:1,Te=G.min.x,ke=G.min.y,Ee=G.isBox3?G.min.z:0;else{const $n=Math.pow(2,-k);ae=Math.floor(Et.width*$n),Q=Math.floor(Et.height*$n),S.isDataArrayTexture?he=Et.depth:S.isData3DTexture?he=Math.floor(Et.depth*$n):he=1,Te=0,ke=0,Ee=0}X!==null?(Ue=X.x,ct=X.y,Mt=X.z):(Ue=0,ct=0,Mt=0);const _t=ot.convert(F.format),Ye=ot.convert(F.type);let At;F.isData3DTexture?(pt.setTexture3D(F,0),At=B.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(pt.setTexture2DArray(F,0),At=B.TEXTURE_2D_ARRAY):(pt.setTexture2D(F,0),At=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,F.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,F.unpackAlignment);const dt=B.getParameter(B.UNPACK_ROW_LENGTH),Kt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Ui=B.getParameter(B.UNPACK_SKIP_PIXELS),jt=B.getParameter(B.UNPACK_SKIP_ROWS),Yn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Et.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Et.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Te),B.pixelStorei(B.UNPACK_SKIP_ROWS,ke),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ee);const Bt=S.isDataArrayTexture||S.isData3DTexture,hn=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){const $n=st.get(S),Ln=st.get(F),On=st.get($n.__renderTarget),el=st.get(Ln.__renderTarget);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,On.__webglFramebuffer),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,el.__webglFramebuffer);for(let _s=0;_s<he;_s++)Bt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,st.get(S).__webglTexture,k,Ee+_s),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,st.get(F).__webglTexture,oe,Mt+_s)),B.blitFramebuffer(Te,ke,ae,Q,Ue,ct,ae,Q,B.DEPTH_BUFFER_BIT,B.NEAREST);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(k!==0||S.isRenderTargetTexture||st.has(S)){const $n=st.get(S),Ln=st.get(F);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,ie),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,le);for(let On=0;On<he;On++)Bt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,$n.__webglTexture,k,Ee+On):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,$n.__webglTexture,k),hn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ln.__webglTexture,oe,Mt+On):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ln.__webglTexture,oe),k!==0?B.blitFramebuffer(Te,ke,ae,Q,Ue,ct,ae,Q,B.COLOR_BUFFER_BIT,B.NEAREST):hn?B.copyTexSubImage3D(At,oe,Ue,ct,Mt+On,Te,ke,ae,Q):B.copyTexSubImage2D(At,oe,Ue,ct,Te,ke,ae,Q);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else hn?S.isDataTexture||S.isData3DTexture?B.texSubImage3D(At,oe,Ue,ct,Mt,ae,Q,he,_t,Ye,Et.data):F.isCompressedArrayTexture?B.compressedTexSubImage3D(At,oe,Ue,ct,Mt,ae,Q,he,_t,Et.data):B.texSubImage3D(At,oe,Ue,ct,Mt,ae,Q,he,_t,Ye,Et):S.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,Ue,ct,ae,Q,_t,Ye,Et.data):S.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,Ue,ct,Et.width,Et.height,_t,Et.data):B.texSubImage2D(B.TEXTURE_2D,oe,Ue,ct,ae,Q,_t,Ye,Et);B.pixelStorei(B.UNPACK_ROW_LENGTH,dt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Kt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Ui),B.pixelStorei(B.UNPACK_SKIP_ROWS,jt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Yn),oe===0&&F.generateMipmaps&&B.generateMipmap(At),Ze.unbindTexture()},this.initRenderTarget=function(S){st.get(S).__webglFramebuffer===void 0&&pt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?pt.setTextureCube(S,0):S.isData3DTexture?pt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?pt.setTexture2DArray(S,0):pt.setTexture2D(S,0),Ze.unbindTexture()},this.resetState=function(){R=0,w=0,b=null,Ze.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Lt._getUnpackColorSpace()}}function ps(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new Zt;let h=0;for(let d=0;d<n.length;++d){const f=n[d];let p=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in f.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.attributes[m]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in f.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.morphAttributes[m])}if(e){let m;if(t)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,m,d),h+=m}}if(t){let d=0;const f=[];for(let p=0;p<n.length;++p){const m=n[p].index;for(let x=0;x<m.count;++x)f.push(m.getX(x)+d);d+=n[p].attributes.position.count}c.setIndex(f)}for(const d in r){const f=Jd(r[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,f)}for(const d in a){const f=a[d][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<f;++p){const m=[];for(let M=0;M<a[d].length;++M)m.push(a[d][M][p]);const x=Jd(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function Jd(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=d.count*t}const a=new e(r),o=new qn(a,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const f=c/t;for(let p=0,m=d.count;p<m;p++)for(let x=0;x<t;x++){const M=d.getComponent(p,x);o.setComponent(p+f,x,M)}}else a.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class fv extends Wu{constructor(){super();const e=new xe;e.deleteAttribute("uv");const t=new W({side:An}),i=new W,s=new wh(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new O(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new sn(e,i,6),o=new zt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new O(e,dr(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new O(e,dr(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new O(e,dr(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const f=new O(e,dr(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new O(e,dr(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new O(e,dr(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function dr(n){return new vm({color:0,emissive:16777215,emissiveIntensity:n})}const bo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Dr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const pv=new Th(-1,1,1,-1,0,1);class mv extends Zt{constructor(){super(),this.setAttribute("position",new bt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bt([0,2,0,0,2,0],2))}}const xv=new mv;class Eh{constructor(e){this._mesh=new O(xv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,pv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class df extends Dr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof gn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=va.clone(e.uniforms),this.material=new gn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Eh(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class jd extends Dr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class gv extends Dr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class vv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new De);this._width=i.width,this._height=i.height,t=new pi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ci}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new df(bo),this.copyPass.material.blending=Ai,this.clock=new rf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}jd!==void 0&&(a instanceof jd?i=!0:a instanceof gv&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new De);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Mv extends Dr{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new it}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const ho={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class _v extends Dr{constructor(){super(),this.uniforms=va.clone(ho.uniforms),this.material=new gm({name:ho.name,uniforms:this.uniforms,vertexShader:ho.vertexShader,fragmentShader:ho.fragmentShader}),this._fsQuad=new Eh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Lt.getTransfer(this._outputColorSpace)===Gt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===bu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Su?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===wu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===th?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Eu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Au?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Tu&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const yv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new it(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Cr extends Dr{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new De(e.x,e.y):new De(256,256),this.clearColor=new it(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new pi(r,a,{type:Ci}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const f=new pi(r,a,{type:Ci});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new pi(r,a,{type:Ci});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=yv;this.highPassUniforms=va.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new gn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new De(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=va.clone(bo.uniforms),this.blendMaterial=new gn({uniforms:this.copyUniforms,vertexShader:bo.vertexShader,fragmentShader:bo.fragmentShader,blending:di,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new it,this._oldClearAlpha=1,this._basic=new Ct,this._fsQuad=new Eh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new De(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Cr.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Cr.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new gn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new De(.5,.5)},direction:{value:new De(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new gn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Cr.BlurDirectionX=new De(1,0);Cr.BlurDirectionY=new De(0,1);const Ra=document.querySelector("#game"),Qt=new uv({canvas:Ra,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),qo=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;Qt.setPixelRatio(Math.min(window.devicePixelRatio,qo?1.5:2));Qt.setSize(window.innerWidth,window.innerHeight);Qt.shadowMap.enabled=!qo;Qt.info.autoReset=!1;Qt.shadowMap.type=yu;Qt.outputColorSpace=Rt;Qt.toneMapping=th;Qt.toneMappingExposure=1.12;const Fe=new Wu;window.__steelRibbonScene=Fe;Fe.background=new it(16764588);Fe.fog=new mh(14719602,360,2150);const uf=new Bc(Qt);uf.compileEquirectangularShader();Fe.environment=uf.fromScene(new fv,.04).texture;Fe.environmentIntensity=.58;const Ne=new Hn(69,window.innerWidth/window.innerHeight,.08,1800);Fe.add(Ne);const qe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const Je=new Set,Le={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},bv=new rf,Jt=new L(0,1,0),Ah=new L,ff=new L,Yo=new L,xn=new zt,pf=.86,Vc=1.2,Sv=.78,Bn=.55,ut={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ks=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],mf=Math.max(...ks.map(n=>n.width));let ms=0,se=ks[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new L,best:Number(localStorage.getItem("steel-ribbon-best")||0)};qe.best.textContent=`Best score ${l.best}`;let fi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Ki(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&fi==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}Ki();function wv(){fi=fi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",fi),Ki(),l.message=fi==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const uo=[];function qi(n,e=!1){let t=uo.find(s=>!s.busy);t||(uo.length>=4?t=uo[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),uo.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function ei(n=880,e=.16,t="triangle",i=.16){if(!ze)return;const{ctx:s}=ze,r=s.createOscillator(),a=s.createGain();r.type=t,r.frequency.setValueAtTime(n,s.currentTime),r.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),a.gain.setValueAtTime(i,s.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),r.connect(a).connect(ze.master||s.destination),r.start(),r.stop(s.currentTime+e+.06)}function Tv(n){const e=me.clamp(n,0,1);return e*e*(3-2*e)}function Ev(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,r=i.start+i.carry,a=i.end+i.settle;e>=s&&e<=r?t+=i.rise*me.clamp((e-s)/(i.approach+i.carry),0,1):e>r&&e<=i.end?t+=i.rise:e>i.end&&e<=a&&(t+=i.rise*(1-Tv((e-i.end)/i.settle)))}return t}function Ch(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,r=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,a=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:r,z:a,t:i,n:t}}function xf(n,e){const{t,n:i}=Ch(n,e),s=n.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of n.ramps){let o=i-a.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=Ev(n,i),r}function fo(n){const{x:e,z:t,n:i}=Ch(se,n),s=xf(se,i);return new L(e,s,t)}function ft(n){const e=(n%se.length+se.length)%se.length,t=fo(e),i=fo(e+2).sub(t).normalize(),s=Ah.crossVectors(Jt,i).normalize(),r=fo(e-2).y,a=fo(e+2).y,o=Math.atan2(a-r,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Pi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Qd(n){return me.clamp(n/(se.length*se.laps),0,1)}function zl(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let r=i;r<=s;r++){const a=r*se.length+t;if(n<a&&e>=a)return!0}return!1}function Av(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)i.fillStyle=(o+a)%2?"#101318":"#f5f1df",i.fillRect(o*s,a*s,s,s);const r=new nn(t);return r.colorSpace=Rt,r.wrapS=Rn,r.wrapT=Rn,r.repeat.set(3,1),r}function Cv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<n;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(n,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new nn(e);return s.colorSpace=Rt,s.wrapS=Rn,s.wrapT=Rn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Rv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<120;r++){const a=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(a,o,0,a,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(a,o,c,0,Math.PI*2),t.fill()}for(let r=0;r<9e3;r++){const a=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${a})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let r=-n;r<n*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.65,n),t.stroke();const s=new nn(e);return s.colorSpace=Rt,s.wrapS=Rn,s.wrapT=Rn,s.repeat.set(18,18),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Pv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<26e3;r++){const a=Math.random()<.48;t.fillStyle=a?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let r=0;r<24;r++){let a=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(a,o);for(let c=0;c<7;c++)a+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(a,o);t.stroke()}const s=new nn(e);return s.colorSpace=Rt,s.wrapS=Rn,s.wrapT=Rn,s.repeat.set(9,16),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Lv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new nn(e);return s.colorSpace=Rt,s}function ur(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<n;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new nn(i);return r.colorSpace=Rt,r}function Dv(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const a=(c,h,d,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,f),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+f-2),s.moveTo(c+2,h+f*.52),s.lineTo(c+d-2,h+f*.52),s.stroke()};a(n*.12,e*.24,n*.19,e*.2),a(n*.68,e*.25,n*.2,e*.2),a(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new nn(i);return o.colorSpace=Rt,o.wrapS=Rn,o.wrapT=Rn,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function Iv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<n+20;r+=26){t.beginPath();for(let a=-10;a<n+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<n;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,n*.24,r-8,n*.58,r+7,n),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new nn(e);return s.colorSpace=Rt,s.wrapS=Rn,s.wrapT=Rn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Uv(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let a=18;a<e;a+=24)i.beginPath(),i.moveTo(8,a),i.lineTo(n-8,a),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const r=new nn(t);return r.colorSpace=Rt,r}function eu(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=i?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),i&&r.rotate(-Math.PI/2),r.font=`900 ${i?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(n,0,0),r.restore();const c=new nn(s);return c.colorSpace=Rt,c}const os=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],Io=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],ls=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function gf(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new nn(i);return a.colorSpace=Rt,a.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),a}function Ol(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new nn(t);return s.colorSpace=Rt,s}function Bl(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,n,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let c=18;c<e;c+=22){r.beginPath(),r.moveTo(0,c),r.lineTo(n,c),r.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)r.beginPath(),r.moveTo(h,c-18),r.lineTo(h,c),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,n-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)r.fillRect(c,e*.62,52,e*.19);r.fillStyle=i,r.fillRect(22,e*.49,n-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=i,r.shadowBlur=12,r.fillText("OPEN",n/2,e*.28,n*.76),r.shadowBlur=0;const o=new nn(s);return o.colorSpace=Rt,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function Fv(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let r=18;r<e;r+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,r,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,r+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let r=0;r<n;r+=64)i.beginPath(),i.moveTo(r,0),i.lineTo(r,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new nn(t);return s.colorSpace=Rt,s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Nv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,r=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const a=new nn(e);return a.colorSpace=Rt,a}function pe(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function fr(n,e,t,i){const s=t*.5,r=i*.5;let a=pe(n,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,pe(n+o,e+c));return a}function $o(n,e,t=10){const{x0:i,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=ut;if(n<i-c||n>s+c||e<a-c||e>r+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const ds={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Nn(n,e,t,i,s=8){const{x0:r,x1:a,zNear:o,zFar:c,pitch:h,streetW:d}=ut,f=t*.5,p=i*.5,m=d*.5+s;let x=null;const M=(g,u,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:u,overlap:y})};for(let g=r;g<=a+1;g+=h){if(e+p<c-m||e-p>o+m)continue;const u=f+m-Math.abs(n-g);u>0&&M("x",Math.round(g),u)}for(let g=o;g>=c-1;g-=h){if(n+f<r-m||n-f>a+m)continue;const u=p+m-Math.abs(e-g);u>0&&M("z",Math.round(g),u)}return x}const Vs=[],vf=[],Mn={spots:[],im:null,imW:null};function Mf(n=1){const e=new gn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return vf.push(e),e}function _f(n,e,t,i=t,s=null){Vs.push({x:n,z:e,rx:t,rz:i,waterY:s})}function gr(n,e){let t=0,i=null;for(const s of Vs){const r=(n-s.x)/s.rx,a=(e-s.z)/s.rz,o=r*r+a*a;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=me.clamp((s.waterY-pe(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const vr=[],kl=[],Rh=[];let Uo=0;function _n(n,e){return Rh.push({obj:n,update:e}),n}function yf(n){Uo+=n;for(const e of Rh)e.update(Uo,n)}function Zo(){if(kl.length===0)for(let n=0;n<ks.length;n++){const e=ks[n];for(let t=0;t<e.length;t+=14){const i=Ch(e,t);kl.push({x:i.x,y:xf(e,t),z:i.z,s:t,courseIndex:n})}}return kl}function wn(n,e,t=0){let i=null,s=1/0;for(const r of Zo()){const a=n-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,i=r)}return{clearance:s-t-mf*.58,distance:s,nearestS:i?.s??0}}function Rs(n,e,t,i,s,r=9){const a=t*.5,o=i*.5,c=mf*.62+r;let h=null;for(const d of Zo()){const f=Math.max(Math.abs(d.x-n)-a,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(f,p)-c;if(m>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-m>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return h}function ri(n,e,t,i=96){for(let s=0;s<i;s++){const r=n(s);if(wn(r.x,r.z,e).clearance>=t&&!Nn(r.x,r.z,e*2,e*2,3.5))return r}return null}function ai(n,e,t,i,s){const r=wn(e,t,i);vr.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function zv(){const n=[...vr].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:vr.length,unsafe:vr.filter(e=>e.clearance<e.margin),closest:n}}function Un(n,e,t,i,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new O(new je(i,i,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(Jt,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const Qn={cloudMats:[],glowMats:[]};function Ov(){const n=new ym(16757626,3097190,.66);Fe.add(n);const e=new Ll(7179775,.6);e.position.set(260,145,-260),Fe.add(e);const t=new Ll(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Fe.add(t);const i=new Ll(16742973,.5);i.position.set(-180,35,280),Fe.add(i);const s=new wh(5556479,90,900,2);s.position.set(0,88,-920),Fe.add(s),Qn.hemi=n,Qn.fill=e,Qn.key=t,Qn.rim=i}let oi=null;function Bv(){const n=new L(-310,150,230).normalize();oi=new O(new $t(1200,48,32),new gn({side:An,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0}},vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,fragmentShader:`
        varying vec3 vDir;
        uniform vec3 uSunDir;
        uniform float uDay;
        uniform float uNight;
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
          gl_FragColor = vec4(col, 1.0);
        }`})),oi.renderOrder=-100,oi.frustumCulled=!1,Fe.add(oi);const e=n,t=new Ct({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new O(new dn(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),oi.add(i);const s=new Ct({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:di});for(const[r,a]of[[120,.2],[250,.085],[520,.035]]){const o=new O(new dn(r,48),s.clone());o.material.opacity=a,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),oi.add(o),Qn.glowMats.push({mat:o.material,dusk:a})}Qn.skyU=oi.material.uniforms,Qn.sunMat=t}function kv(){const n=new W({map:Rv(),color:8231526,roughness:.98,metalness:.02}),e=new O(new Yt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const m=t.getX(p),x=t.getY(p);t.setZ(p,pe(m,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Fe.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:vt});for(let p=0;p<3;p++){const m=150-p*190,x=-760-p*420,M=980,g=64+p*18,u=new O(new Yt(980,64+p*18,1,1),i.clone());u.rotation.x=-Math.PI/2,u.rotation.z=-.34+p*.03,u.position.set(m,fr(m,x,M,g)-.55,x),u.renderOrder=-4,Fe.add(u)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let p=0;p<46;p++){const m=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[pe(x,M)];for(let y=0;y<6;y++)g.push(pe(x+Math.cos(y)*m*.9,M+Math.sin(y*1.9)*m*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const u=new O(new dn(m,9),s[p%s.length]);u.rotation.x=-Math.PI/2,u.rotation.z=Math.random()*Math.PI,u.position.set(x,Math.max(...g)+.07,M),u.scale.y=.32+Math.random()*.5,u.receiveShadow=!0,Fe.add(u)}const r=new Ct({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const m=new O(new dn(70+Math.random()*150,22),r.clone());m.material.opacity=.008+Math.random()*.014,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),m.position.y<8&&ds.lowFogDisks++,m.scale.y=.22+Math.random()*.26,m.renderOrder=-6,Fe.add(m)}const a=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let p=0;p<52;p++){const m=78+Math.random()*180,x=52+Math.random()*115,M=ri(u=>{const y=p/52*Math.PI*2+u*1.77,v=1380+Math.random()*820+u*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!M)continue;const g=new O(new Si(x,m,5+Math.floor(Math.random()*2)),a[p%a.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Fe.add(g),ai("mountain",M.x,M.z,x,480),m>160){const u=new O(new Si(x*.34,m*.22,5),o);u.position.copy(g.position).add(new L(0,m*.39,0)),u.rotation.y=g.rotation.y,Fe.add(u)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const p=new je(.28,.42,1,6).translate(0,.5,0),m=ps([new Si(2.7,5.4,7).translate(0,1.9,0),new Si(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Si(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new it(v)),M=new sn(p,c,185),g=new sn(m,new W({roughness:.92}),185),u=new zt;let y=0;for(let v=0;v<185;v++){const _=.58+Math.random()*1.05,E=8*_,T=ri(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:A,z:R}=T;if($o(A,R,18))continue;const w=pe(A,R)+.8,b=2.2+Math.random()*3.8;u.position.set(A,w,R),u.rotation.y=Math.random()*Math.PI,u.scale.set(_,b,_),u.updateMatrix(),M.setMatrixAt(y,u.matrix),u.position.set(A,w+b,R),u.scale.set(_,_,_),u.updateMatrix(),g.setMatrixAt(y,u.matrix),g.setColorAt(y,x[v%3]),y++,ai("tree",A,R,E,145)}M.count=y,g.count=y,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Fe.add(M),Fe.add(g)}{const p=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),u=(v,_)=>Math.sin(x*_+v*37.7)*.5+.5;for(let v=0;v<16;v++){const _=v/15,E=Math.sin(_*Math.PI),T=24+_*208,A=66+(u(v,53)-.5)*22*E,R=(18+u(v,29)*22)*(.45+E*.75),w=g.createRadialGradient(T,A-R*.18,0,T,A,R);w.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),w.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),w.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=w,g.beginPath(),g.arc(T,A,R,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const _=.12+v/9*.76,E=_*256,T=20+u(v,71)*16,A=g.createRadialGradient(E,92,0,E,92,T);A.addColorStop(0,"rgba(255, 176, 128, 0.22)"),A.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=A,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const y=new nn(M);return y.colorSpace=Rt,y},m=[p(1),p(2),p(3)];Ae.cloudSprites=0;for(let x=0;x<44;x++){const M=new xh({map:m[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new Uc(M),u=170+Math.random()*280;g.scale.set(u,u*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Fe.add(g),Ae.cloudSprites++,_n(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const m=new tt,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,u=new O(new xe(M,x,g),h[p%h.length]);u.position.y=x/2,u.castShadow=!0,u.receiveShadow=!0,m.add(u);const y=ur(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const A of[-1,1]){const R=new O(new Yt(M*.82,x*.74),v);R.position.set(0,x*.53,A*(g/2+.08)),R.rotation.y=A<0?Math.PI:0,m.add(R)}const _=new O(new xe(M*1.08,1.2,g*1.08),d);if(_.position.y=x+.7,m.add(_),Math.random()<.32){const A=new O(new je(.18,.3,10+Math.random()*12,8),d);A.position.y=x+6.5,m.add(A)}const E=Math.hypot(M,g)*.65,T=ri(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(m.position.set(T.x,fr(T.x,T.z,M,g)-.7,T.z),m.rotation.y=Math.random()*Math.PI,Fe.add(m),ai("building",T.x,T.z,E,240))}const f=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const m=new tt,x=os[p%os.length],M=Io[(p*3+1)%Io.length],g=ls[p%ls.length],u=new W({map:gf(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new it(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,_=new O(new xe(y,v,.5),u);_.position.y=10,m.add(_);const E=new O(new xe(y+1.2,.32,.75),f);E.position.y=10+v*.5+.25,m.add(E);for(const A of[-7,7]){const R=new O(new je(.24,.32,10,8),f);R.position.set(A,5,-.2),m.add(R)}const T=ri(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);T&&(m.position.set(T.x,pe(T.x,T.z)+.5,T.z),m.rotation.y=-.35+Math.random()*.7,Fe.add(m),ai("billboard",T.x,T.z,22,175),Ps("roadside-billboard",T.x,m.position.y+10,T.z))}}function Vv(){for(let u=0;u<3;u++){const y=[4012638,5326704,7035525][u],v=new Ct({color:y,transparent:!0,opacity:.6-u*.14,depthWrite:!1,fog:!1}),_=60,E=5200,T=new Yt(E,360,_,1),A=T.attributes.position;for(let w=0;w<=_;w++){const b=w/_,P=(Math.sin(b*22+u*3)*.5+Math.sin(b*9+u)*.5)*70+120;A.setY(w,P),A.setY(w+_+1,-180)}A.needsUpdate=!0;const R=new O(T,v);R.position.set(0,40,-2300-u*360),Fe.add(R)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let u=0;u<48;u++){const y=.7+Math.random()*1.2,v=9*y,_=ri(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!_)continue;const{x:E,z:T}=_;if($o(E,T,18))continue;const A=pe(E,T)+.6,R=new tt,w=2.6+Math.random()*3.4,b=new O(new je(.34,.5,w,6),n);b.position.y=w/2,R.add(b);const P=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let V=0;V<I;V++){const j=2.4+Math.random()*1.8,te=new O(new $t(j,9,7),P);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,R.add(te)}R.position.set(E,A,T),R.scale.setScalar(y),Fe.add(R),ai("tree",E,T,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:vt}),new W({color:9077368,roughness:1,flatShading:!0,side:vt}),new W({color:6249043,roughness:1,flatShading:!0,side:vt})];for(let u=0;u<70;u++){const y=2+Math.random()*7,v=ri(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:_,z:E}=v,T=new O(new bh(y,0),t[u%t.length]),A=T.geometry.attributes.position;for(let R=0;R<A.count;R++)A.setXYZ(R,A.getX(R)*(.8+Math.random()*.4),A.getY(R)*(.6+Math.random()*.4),A.getZ(R)*(.8+Math.random()*.4));A.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(_,pe(_,E)+y*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Fe.add(T),ci.push({kind:"rock",x:_,z:E,radius:y*1.12}),ai("rock",_,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let u=0;u<14;u++){const y=130+Math.random()*200,v=130+Math.random()*200,_=ri(()=>{for(let P=0;P<6;P++){const I=-1500+Math.random()*3e3,V=-700-Math.random()*1700,j=[pe(I,V),pe(I+y*.45,V+v*.45),pe(I-y*.45,V+v*.45),pe(I+y*.45,V-v*.45),pe(I-y*.45,V-v*.45)];if(Math.max(...j)-Math.min(...j)<1)return{x:I,z:V}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!_||_.x>9e4)continue;const{x:E,z:T}=_,A=new tt,R=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let P=0;P<R;P++){const I=new W({color:P%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),V=new O(new Yt(y,v/R),I);V.rotation.x=-Math.PI/2,V.position.set(0,.05,-v/2+(P+.5)*(v/R)),A.add(V)}const b=Math.max(pe(E,T),pe(E+y*.45,T+v*.45),pe(E-y*.45,T+v*.45),pe(E+y*.45,T-v*.45),pe(E-y*.45,T-v*.45));A.position.set(E,b+.06,T),A.rotation.y=Math.random()*Math.PI,Fe.add(A),ai("field",E,T,Math.max(y,v)*.5,40)}{const u=ri(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(u){const y=[pe(u.x,u.z)];for(let E=0;E<8;E++)y.push(pe(u.x+Math.cos(E/8*Math.PI*2)*110,u.z+Math.sin(E/8*Math.PI*2)*74),pe(u.x+Math.cos(E/8*Math.PI*2)*200,u.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,T)=>E-T);const v=y[4]+.4,_=new O(new dn(150,48),Mf(9));_.rotation.x=-Math.PI/2,_.position.set(u.x,v,u.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Fe.add(_),_f(u.x,u.z,222,148,v),ds.waterBlockers++,ai("lake",u.x,u.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let u=0;u<9;u++){const y=u/9*Math.PI*2+.6,v=1500+Math.random()*700,_=Math.cos(y)*v,E=Math.sin(y)*v-1150,T=60+Math.random()*40,A=new tt,R=new O(new je(1.1,2.2,T,10),s);R.position.y=T/2,A.add(R);const w=new tt;w.position.set(0,T,3);const b=new O(new xe(3,3,7),s);w.add(b);const P=new tt;P.position.z=3.5;for(let V=0;V<3;V++){const j=new O(new xe(1.1,26,.5),s);j.position.y=13;const te=new tt;te.add(j),te.rotation.z=V/3*Math.PI*2,P.add(te)}w.add(P),A.add(w),A.position.set(_,-8,E),A.rotation.y=Math.random()*Math.PI,Fe.add(A);const I=.5+Math.random()*.5;_n(P,V=>{P.rotation.z=V*I})}const r=new W({color:7041398,roughness:.6,metalness:.4}),a=new Fc({color:2764595,transparent:!0,opacity:.5});let o=null;for(let u=0;u<7;u++){const y=-1100+u*360,v=-1650-Math.sin(u*.7)*120,_=48,E=new tt,T=6;for(const R of[-1,1])for(const w of[-1,1]){const b=new O(new je(.4,.7,_,5),r);b.position.set(R*T,_/2,w*T),b.rotation.z=-R*.08,b.rotation.x=w*.08,E.add(b)}for(const R of[_*.6,_*.82,_]){const w=new O(new xe(T*4,.8,.8),r);w.position.y=R,E.add(w)}E.position.set(y,pe(y,v)-2,v),Fe.add(E);const A=pe(y,v)-2+_;if(o)for(const R of[-T*2,0,T*2]){const w=o.x+R,b=o.z,P=y+R,I=v,V=[],j=12;for(let q=0;q<=j;q++){const Z=q/j,ne=Math.sin(Z*Math.PI)*6;V.push(new L(w+(P-w)*Z,o.y-ne+(A-o.y)*Z,b+(I-b)*Z))}const te=new xd(new Zt().setFromPoints(V),a);Fe.add(te)}o={x:y,y:A,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let u=0;u<5;u++){const y=ri(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:_}=y,E=70+Math.random()*50,T=new tt,A=8;for(let P=0;P<A;P++){const I=new O(new je(.5,.7,E/A,4),P%2?h:c);I.position.y=(P+.5)*(E/A),I.rotation.y=Math.PI/4,T.add(I)}const R=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new O(new $t(1.1,10,8),R);w.position.y=E+1,T.add(w),T.position.set(v,pe(v,_),_),Fe.add(T),ai("mast",v,_,8,120);const b=Math.random()*Math.PI*2;_n(w,P=>{R.emissiveIntensity=Math.sin(P*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let u=0;u<6;u++){const y=new tt,v=d[u%d.length],_=new W({map:$v(v[0],v[1]),roughness:.5,metalness:.05,emissive:new it(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new O(new $t(11,20,16),_);E.scale.y=1.25,y.add(E);const T=new O(new xe(3.4,3,3.4),new W({color:8014371,roughness:.9}));T.position.y=-17,y.add(T);const A=new Fc({color:3811866});for(const I of[-1,1])for(const V of[-1,1]){const j=new xd(new Zt().setFromPoints([new L(I*1.6,-15.5,V*1.6),new L(I*7,-3,V*7)]),A);y.add(j)}const R=-700+Math.random()*1400,w=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(R,b,w),Fe.add(y);const P=Math.random()*Math.PI*2;_n(y,I=>{y.position.y=b+Math.sin(I*.5+P)*6,y.position.x=R+Math.sin(I*.08+P)*90,y.rotation.z=Math.sin(I*.4+P)*.04})}const f=new Ct({color:2829104,side:vt,fog:!1});function p(){const u=new yh;return u.moveTo(0,0),u.lineTo(-2.6,1.1),u.lineTo(-2.2,.2),u.lineTo(0,.5),u.lineTo(2.2,.2),u.lineTo(2.6,1.1),u.lineTo(0,0),new O(new Ho(u),f)}for(let u=0;u<5;u++){const y=new tt,v=5+Math.floor(Math.random()*5),_=[];for(let P=0;P<v;P++){const I=p(),V=P%2?1:-1,j=Math.ceil(P/2);I.position.set(V*j*5,-j*2.4,0),I.rotation.x=-Math.PI/2,y.add(I),_.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,A=18+Math.random()*14,R=1400,w=-700+Math.random()*1400;y.position.set(w,E,T),Fe.add(y);const b=Math.random()*Math.PI*2;_n(y,(P,I)=>{y.position.x+=A*I,y.position.x>R&&(y.position.x=-R);const V=Math.sin(P*6+b);for(const j of _)j.rotation.x=-Math.PI/2+V*.4})}{const u=new tt,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new O(new $t(20,20,16),y);v.scale.set(2.6,1,1),u.add(v);const _=new W({color:13781835,roughness:.6});for(let w=0;w<3;w++){const b=new O(new xe(10,9,.6),_);b.position.x=-46,b.rotation.x=w/3*Math.PI*2,u.add(b)}const E=new O(new xe(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,u.add(E);const T=new O(new Yt(40,10),new Ct({map:Lh("STEEL RIBBON"),transparent:!0,side:vt}));T.position.set(60,0,0),u.add(T);const A=900,R=240;u.position.set(0,R,-1200),Fe.add(u),_n(u,w=>{const b=w*.05;u.position.x=Math.cos(b)*A,u.position.z=-1200+Math.sin(b)*A*.5,u.position.y=R+Math.sin(w*.3)*8,u.rotation.y=-b+Math.PI/2})}const m=new Ct({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let u=0;u<14;u++){const y=new O(new Yt(220+Math.random()*360,16+Math.random()*22),m.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Fe.add(y);const v=2+Math.random()*3;_n(y,(_,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),M=new Ct({map:Zv(),side:vt});for(let u=0;u<4;u++){const y=ri(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:_}=y,E=new tt,T=60+Math.random()*40,A=new O(new xe(T,1.4,26),x);A.position.set(0,26,-4),A.rotation.x=-.32,E.add(A);const R=new O(new Yt(T*.94,24),M);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const w of[-T/2,T/2]){const b=new O(new xe(1.4,26,1.4),x);b.position.set(w,13,-8),E.add(b)}E.position.set(v,pe(v,_),_),E.rotation.y=Math.atan2(-v,-_)+(Math.random()-.5)*.5,Fe.add(E),ai("grandstand",v,_,40,30)}const g=[16731486,16765503,16777215,11824127];for(let u=0;u<90;u++){const y=ri(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:_}=y,E=new tt,T=g[Math.floor(Math.random()*g.length)],A=new Ct({color:T,side:vt}),R=5+Math.floor(Math.random()*6);for(let w=0;w<R;w++){const b=new O(new dn(.5+Math.random()*.4,5),A);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,pe(v,_),_),Fe.add(E),ai("flowers",v,_,3,20)}}const rn=[],Kn=[];let Gc=0;const ci=[],Ws=[],Fn=[],Hc=[],ba=[],Mr=[],Ae={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},Fo=[];function Ps(n,e,t,i){Ae.signs++,Fo.length<160&&Fo.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function is(n,e,t=1){Ae[n][e]=(Ae[n][e]||0)+t}let po=null,tu=null;function bf(){return po||(po=new W({vertexColors:!0,roughness:.42,metalness:.22}),po.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},tu=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:po,glass:tu}}const ss=new it;function ln(n,e,t,i=0,s=1){const r=n.clone();e&&r.applyMatrix4(e);const a=r.attributes.position.count,o=new Float32Array(a*3),c=new Float32Array(a*3);ss.set(t??16777215);for(let h=0;h<a;h++)o[h*3]=ss.r,o[h*3+1]=ss.g,o[h*3+2]=ss.b;if(i){ss.set(i).multiplyScalar(s);for(let h=0;h<a;h++)c[h*3]=ss.r,c[h*3+1]=ss.g,c[h*3+2]=ss.b}return r.setAttribute("color",new bt(o,3)),r.setAttribute("aEmissive",new bt(c,3)),r}function mn(n,e,t,i=0){return(i?new wt().makeRotationZ(i):new wt).setPosition(n,e,t)}function Ph(n,e){const t=new tt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:r,glass:a}=bf(),o=n==="taxi"?16767293:e,c=new it(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(ln(new xe(s.w,s.h,s.l),mn(0,.95,0),o)),(s.bus?d:h).push(ln(new xe(s.cabin[0],s.cabin[1],s.cabin[2]),mn(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(ln(new xe(s.cabin[0]*.78,s.cabin[1]*.55,.08),mn(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(ln(new xe(.08,s.cabin[1]*.5,s.cabin[2]*.48),mn(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(ln(new xe(s.w*.94,.58,s.l*.38),mn(0,1.2,1.35),c)),s.box&&h.push(ln(new xe(s.box[0],s.box[1],s.box[2]),mn(0,1.55,1.25),15130833)),s.bus){h.push(ln(new xe(s.w+.06,.28,s.l*.86),mn(0,1.38,0),c));const y=new xe(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const _ of[-1,1])d.push(ln(y,mn(_*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(ln(new xe(1,.24,.46),mn(0,2.2,-.35),16774310,16765773,.9));const f=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],p=[],m=ps([ln(new je(.42,.42,.36,14),mn(0,0,0,Math.PI/2),395016),ln(new je(.18,.18,.38,10),mn(0,0,0,Math.PI/2),14147041)],!1),x=new xe(.3,.34,1.12);for(const y of f)for(const v of[-s.w*.54,s.w*.54]){const _=new O(m,r);_.position.set(v,.45,y),t.add(_),p.push(_),h.push(ln(x,mn(v*1.02,.72,y),1250072))}const M=new xe(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(ln(M,mn(0,.62,y),1250072));const g=new xe(.42,.2,.1),u=new xe(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(ln(g,mn(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(ln(u,mn(y,.98,s.l*.52+.04),16725033,16717325,1.45));return t.add(new O(ps(h,!1),r)),d.length&&t.add(new O(ps(d,!1),a)),t.userData={wheels:p,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function Sf(n,e){const t=new tt,{opaque:i}=bf(),s=new $t(.25,8,5);s.scale(1,.5,1),t.add(new O(ps([ln(new je(.28,.34,.95,8),mn(0,1.35,0),n),ln(new $t(.24,10,8),mn(0,2.02,0),12947299),ln(s,mn(0,2.17,0),1119001)],!1),i));const r=[],a=ln(new je(.075,.09,.78,6),null,e),o=ln(new je(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new O(a,i);h.position.set(c,.58,0),t.add(h),r.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new O(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),r.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=r,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}function Gv(n,e,t){const{X0:i,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,x=[],M=[];for(let U=i;U<=s+1;U+=o)x.push(Math.round(U));for(let U=r;U>=a-1;U-=o)M.push(Math.round(U));M.sort((U,Ce)=>U-Ce);const g=x[0],u=x[x.length-1],y=M[0],v=M[M.length-1];Fn.length=0,Hc.length=0,ba.length=0,Mr.length=0,Ae.traffic=0,Ae.pedestrians=0,Ae.types={},Ae.turns=0,Ae.splats=0,Ae.trafficCrashes=0,Ae.streetLights=0,Ae.trafficLights=0,Ae.stopSigns=0;const _=U=>U[Math.random()*U.length|0],E=U=>(U>0?-1:1)*c*.23,T=(U,Ce)=>{let _e=0,Re=1/0;for(let $=0;$<U.length;$++){const K=Math.abs(U[$]-Ce);K<Re&&(Re=K,_e=$)}return _e},A=(U,Ce,_e)=>{const Re=U==="ns"?M:x;if(_e>0){for(const $ of Re)if($>Ce+.05)return $;return Re[Re.length-1]}for(let $=Re.length-1;$>=0;$--)if(Re[$]<Ce-.05)return Re[$];return Re[0]},R=U=>{const Ce=U.laneOffset+(U.avoidOffset||0);return U.axis==="ns"?{x:U.road+Ce,z:U.along}:{x:U.along,z:U.road+Ce}},w=U=>{if(l.mode!=="roam")return null;const Ce=R(U);if(Math.abs(l.roamPos.y-(pe(Ce.x,Ce.z)+Bn))>4.2)return null;const _e=U.axis==="ns"?0:U.dir,Re=U.axis==="ns"?U.dir:0,$=l.roamPos.x-Ce.x,K=l.roamPos.z-Ce.z,ye=$*_e+K*Re,Se=U.axis==="ns"?$:K,Be=Math.abs(Se),Qe=Math.hypot($,K),Ut=U.mesh?.userData?.colliderHalfW||2,nt=U.mesh?.userData?.colliderHalfD||3;return Qe<En+Math.max(Ut,nt)*.55||ye>-1.5&&ye<nt+4.2&&Be<En+Ut*.85?{crash:!0}:ye>0&&ye<30&&Be<c*.36?{avoidOffset:(Se>=0?-1:1)*U.maxAvoidOffset,stop:ye<13&&Be<En+Ut*.95}:null},b=(U,Ce)=>`${Math.round(U)},${Math.round(Ce)}`,P=(U,Ce)=>{const _e=((Ce+U.phase)%15.5+15.5)%15.5;return _e<6.2?"ns":_e<7.4?"yellow-ns":_e<13.6?"ew":"yellow-ew"},I=(U,Ce)=>{const _e=U.axis==="ns"?U.road:U.next,Re=U.axis==="ns"?U.next:U.road,$=b(_e,Re),K=h.get($);if(!K)return null;if(K.type==="signal"){const ye=P(K,Ce),Se=ye===`yellow-${U.axis}`;return ye===U.axis&&!Se?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&U.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},V=(U,Ce=!1)=>{const _e=U.axis,Re=U.along,$=_e==="ns"?x:M,K=U.road,ye=T($,K),Se=[],Be=_e==="ns"?y:g,Qe=_e==="ns"?v:u;!Ce&&Re+U.dir*o>=Be&&Re+U.dir*o<=Qe&&Se.push({axis:_e,road:U.road,along:Re,dir:U.dir,turn:!1}),ye>0&&Se.push({axis:_e==="ns"?"ew":"ns",road:Re,along:K,dir:-1,turn:!0}),ye<$.length-1&&Se.push({axis:_e==="ns"?"ew":"ns",road:Re,along:K,dir:1,turn:!0}),Se.length||Se.push({axis:_e,road:U.road,along:Re,dir:-U.dir,turn:!0});const Ut=Se.filter(Dt=>Dt.turn),nt=!Ce&&Ut.length&&Math.random()<.42?_(Ut):_(Se);(nt.turn||nt.axis!==_e)&&Ae.turns++,U.axis=nt.axis,U.road=nt.road,U.along=nt.along,U.dir=nt.dir,U.laneOffset=E(U.dir),U.next=A(U.axis,U.along,U.dir),U.turnBlend=nt.turn?1:0,U.lastControlKey=null};for(let U=0;U<m;U++){const Ce=Math.random()<.56?"ns":"ew",_e=f[U%f.length],Re=Math.random()<.5?-1:1,$=(_e==="bus"||_e==="boxTruck"?10:13)+Math.random()*9,K={axis:Ce,dir:Re,type:_e,road:_(Ce==="ns"?x:M),laneOffset:E(Re),along:_(Ce==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Ph(_e,d[U*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,U<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][U%4],K.along=318-U*54,K.speed+=3),K.next=A(K.axis,K.along,K.dir),Fn.push(K.collider),p.push(K),Hc.push(K),n.add(K.mesh),Ae.types[_e]=(Ae.types[_e]||0)+1}function j(U,Ce=0,_e=0){if(U.stolen)return;let Re=Math.max(0,U.speed*_e);const $=w(U);for($?.crash?(t0(U,l.roamPos),Re=0):$?(U.avoidOffset+=($.avoidOffset-U.avoidOffset)*Math.min(1,_e*4.5),U.brakePulse=Math.max(U.brakePulse||0,$.stop?1:.35),$.stop&&(U.waitTimer=Math.max(U.waitTimer,.22),Re=0)):U.avoidOffset+=(0-U.avoidOffset)*Math.min(1,_e*1.8),U.crashTimer>0&&(U.crashTimer=Math.max(0,U.crashTimer-_e),Re=0),U.waitTimer>0&&(U.waitTimer=Math.max(0,U.waitTimer-_e),Re=0);Re>0;){const B=I(U,Ce);if(B){const xt=U.next-U.dir*(B.kind==="signal"?12:8),It=(xt-U.along)*U.dir;if(It>=-.35&&It<=Re+.25){U.along=xt,U.brakePulse=1,Re=0,B.kind==="stop"&&(U.waitTimer=.65+Math.random()*.4,U.lastControlKey=B.key);break}}const gt=Math.abs(U.next-U.along);if(Re<gt)U.along+=U.dir*Re,Re=0;else{U.along=U.next,Re-=gt;const xt=U.next<=(U.axis==="ns"?y:g)+.05||U.next>=(U.axis==="ns"?v:u)-.05;V(U,xt)}}U.brakePulse=Math.max(0,(U.brakePulse||0)-_e*3.2),U.turnBlend=Math.max(0,U.turnBlend-_e*3.2);const{x:K,z:ye}=R(U),Se=U.axis==="ns"?0:U.dir,Be=U.axis==="ns"?U.dir:0;U.mesh.position.set(K,pe(K,ye)+.28+Math.sin(Ce*3.2+U.bob)*.035,ye);const Qe=Math.atan2(-Se,-Be),Ut=Math.atan2(Math.sin(Qe-U.mesh.rotation.y),Math.cos(Qe-U.mesh.rotation.y));U.mesh.rotation.y+=Ut*Math.min(1,_e*7+U.turnBlend*.55),U.crashTimer>0&&(U.mesh.rotation.y+=Math.sin(Ce*22+U.bob)*.02);for(const B of U.mesh.userData.wheels||[])B.rotation.x-=U.dir*U.speed*_e*1.7;const nt=U.mesh.userData.colliderHalfD,Dt=U.mesh.userData.colliderHalfW;U.collider.x=K,U.collider.z=ye,U.collider.hw=U.axis==="ns"?Dt:nt,U.collider.hd=U.axis==="ns"?nt:Dt,U.collider.maxY=U.mesh.position.y+3.2}for(const U of p)j(U,0,0);Ae.traffic=p.length,_n(n,(U,Ce)=>{for(const _e of p)j(_e,U,Ce)});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],Z=[],ne=45;for(let U=0;U<ne;U++){const Ce=Math.random()<.56?"ns":"ew",_e=e[Math.random()*e.length|0],Re=Math.abs(_e.z1-_e.z0)>Math.abs(_e.x1-_e.x0),$=Ce==="ns"?Re?"ns":"ew":Re?"ew":"ns",K=Math.random()<.5?-1:1,ye=Math.random()<.5?-1:1,Se={axis:$,dir:K,sideSign:ye,coord:_($==="ns"?x:M),along:$==="ns"?a+Math.random()*(r-a):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Sf(te[U%te.length],q[U*2%q.length])};U<14&&(Se.axis="ns",Se.coord=80,Se.sideSign=U%2?-1:1,Se.dir=U%3===0?1:-1,Se.along=350-U*24,Se.speed=1.5+U%4*.35),Z.push(Se),ba.push(Se),Se.mesh.traverse(Be=>Be.castShadow=!1),n.add(Se.mesh)}const ue=new Ct({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:vt}),ve=new Ct({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:vt});for(let U=0;U<18;U++){const Ce=new tt,_e=new O(new dn(1,12),ue.clone());_e.rotation.x=-Math.PI/2,Ce.add(_e);for(let Re=0;Re<7;Re++){const $=new O(new dn(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Re)*(.6+Math.random()*1.2),.01,Math.sin(Re*1.7)*(.5+Math.random()*1.1)),Ce.add($)}Ce.visible=!1,Ce.userData.life=0,Ce.userData.maxLife=2.8,Ce.position.y=-99,n.add(Ce),Mr.push(Ce)}function We(U,Ce=0,_e=0){if(!U.active)if(U.respawn-=_e,U.respawn<=0)U.active=!0,U.mesh.visible=!0,U.along+=U.dir*50;else return;U.along+=U.dir*U.speed*_e,U.axis==="ns"?(U.along<a-28&&(U.along=r+28),U.along>r+28&&(U.along=a-28)):(U.along<i-28&&(U.along=s+28),U.along>s+28&&(U.along=i-28));const Re=U.sideSign*(c*.66+1.2),$=U.axis==="ns"?U.coord+Re:U.along,K=U.axis==="ns"?U.along:U.coord+Re,ye=U.axis==="ns"?0:U.dir,Se=U.axis==="ns"?U.dir:0;U.x=$,U.z=K,U.mesh.position.set($,pe($,K)+.08,K),U.mesh.rotation.y=Math.atan2(-ye,-Se);const Be=Math.sin(Ce*7+U.phase);for(const Qe of U.mesh.userData.limbs||[])Qe.mesh.rotation.x=Be*Qe.amp*Qe.side,Qe.mesh.position.y=Qe.baseY+Math.abs(Be)*.025}for(const U of Z)We(U,0,0);Ae.pedestrians=Z.length,_n(n,(U,Ce)=>{for(const _e of Z)We(_e,U,Ce);for(const _e of Mr){if(!_e.visible)continue;_e.userData.life-=Ce;const Re=_e.userData.life,$=me.clamp(Re/_e.userData.maxLife,0,1);_e.scale.setScalar(1+(1-$)*.35),_e.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Re<=0&&(_e.visible=!1)}})}function Hv(){const n=new tt,e=new zt;new $i().setFromAxisAngle(new L(1,0,0),-Math.PI/2),Ae.roadDetails={},Ae.buildingArchetypes={},Ae.zones={},Ae.openerProps=0;const t=ut.x0,i=ut.x1,s=ut.zNear,r=ut.zFar,a=ut.pitch,o=ut.streetW,c=a-o,h=[],d=[];for(let N=t;N<=i+1;N+=a)h.push(Math.round(N));for(let N=s;N>=r-1;N-=a)d.push(Math.round(N));const f=[];for(const N of h)f.push({x0:N,z0:s,x1:N,z1:r});for(const N of d)f.push({x0:t,z0:N,x1:i,z1:N});function p(N,z){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,S=Y/ie;return{x0:N.x0+le*z,z0:N.z0+S*z,x1:N.x1+le*z,z1:N.z1+S*z}}function m(N,z,Y){const ee=[],ie=[];for(const S of N){const F=S.x1-S.x0,G=S.z1-S.z0,X=Math.hypot(F,G),k=Math.max(1,Math.round(X/14)),oe=F/X,ae=-(G/X),Q=oe;let he=null,Te=null;for(let ke=0;ke<=k;ke++){const Ee=ke/k,Ue=Ee*X/68,ct=S.x0+F*Ee,Mt=S.z0+G*Ee,Et=ct+ae*z,_t=Mt+Q*z,Ye=ct-ae*z,At=Mt-Q*z,dt=[Et,pe(Et,_t)+Y,_t,Ue],Kt=[Ye,pe(Ye,At)+Y,At,Ue];he&&(ee.push(he[0],he[1],he[2],Te[0],Te[1],Te[2],Kt[0],Kt[1],Kt[2]),ee.push(he[0],he[1],he[2],Kt[0],Kt[1],Kt[2],dt[0],dt[1],dt[2]),ie.push(0,he[3],1,Te[3],1,Kt[3]),ie.push(0,he[3],1,Kt[3],0,dt[3])),he=dt,Te=Kt}}const le=new Zt;return le.setAttribute("position",new bt(ee,3)),le.setAttribute("uv",new bt(ie,2)),le.computeVertexNormals(),le}const x=new W({map:Pv(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:vt}),M=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),u=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),_=[],E=[];for(const N of f)_.push(p(N,o*.5+3.3),p(N,-13.3)),E.push(p(N,o*.5+.42),p(N,-10.42));const T=new O(m(_,2.9,.66),M);T.receiveShadow=!0,n.add(T);const A=new O(m(E,.28,.78),g);A.receiveShadow=!0,n.add(A),is("roadDetails","sidewalkRuns",_.length),is("roadDetails","curbRuns",E.length);const R=new O(m(f,o/2,.55),x);R.receiveShadow=!0,n.add(R);const w=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:vt});n.add(new O(m(f,.4,.62),w));let b=0,P=0,I=0;for(let N=1;N<h.length-1;N++)for(let z=1;z<d.length-1;z++){const Y=h[N],ee=d[z];if(!(wn(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const le=new O(new xe(o*.92,.07,1.15),u);le.position.set(Y,pe(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const S=new O(new xe(1.15,.07,o*.92),u);S.position.set(Y+ie*13,pe(Y+ie*13,ee)+.83,ee),S.receiveShadow=!0,n.add(S),b+=2}}const V=new yh;V.moveTo(0,5.8),V.lineTo(2.5,1.6),V.lineTo(.72,1.6),V.lineTo(.72,-5.2),V.lineTo(-.72,-5.2),V.lineTo(-.72,1.6),V.lineTo(-2.5,1.6),V.closePath();const j=new Ho(V);j.rotateX(-Math.PI/2);for(const N of f){const z=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,S=N.x0+(N.x1-N.x0)*le,F=N.z0+(N.z1-N.z0)*le;if(wn(S,F,4).clearance<2)continue;const G=new O(j,y);if(G.position.set(S,pe(S,F)+.86,F),G.rotation.y=z?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),P++,ie%2===0){const X=new O(new je(1.05,1.05,.08,24),v);X.position.set(S+(z?3.8:0),pe(S,F)+.84,F+(z?0:3.8)),n.add(X),I++}}}is("roadDetails","crosswalks",b),is("roadDetails","laneArrows",P),is("roadDetails","manholes",I);const te=new Ct({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:vt,blending:di}),q=new Ct({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:vt,blending:di});for(let N=0;N<120;N++){const z=f[Math.random()*f.length|0],Y=Math.random(),ee=z.x0+(z.x1-z.x0)*Y,ie=z.z0+(z.z1-z.z0)*Y;if(wn(ee,ie,4).clearance<2)continue;const le=new O(new dn(1,18),(N%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*o*.7,pe(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const Z=[ur(160,320,.5),ur(160,320,.62),ur(160,320,.42)],ne=[new W({map:Z[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:Z[0],emissiveIntensity:.34}),new W({map:Z[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:Z[1],emissiveIntensity:.32}),new W({map:Z[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:Z[2],emissiveIntensity:.36})],ue=new xe(1,1,1),ve=[[],[],[]],We=[],U=[],Ce=[],_e=[],Re=[],$=[],K=[],ye=[],Se=[],Be=[],Qe=[],Ut=[],nt=[],Dt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=Dv(256,256,"#dbcdb8"),gt=Iv(),xt=Uv(),It=[Bl(512,384,"#944737","#2e95bf"),Bl(512,384,"#7e4d3e","#d04d65"),Bl(512,384,"#a65a35","#4fba6d")],Ze=Fv();function Ot(N,z){is("zones",N),is("buildingArchetypes",z)}function st(N,z,Y,ee,ie,le="downtown"){if(Nn(N,z,Y,ee))return!1;const S=fr(N,z,Y,ee)-1.1;if(Rs(N,z,Y,ee,S+ie+2))return!1;if(e.position.set(N,S+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,S+ie+.6,z),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),We.push(e.matrix.clone()),ie>26){const F=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(N,S+ie+1.35,z+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),U.push(e.matrix.clone()),Ce.push(F);Math.random()<.34&&_e.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:S,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const F=Math.random()<.5?"x":"z";Re.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:S,axis:F,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const F=Math.random()<.5?"x":"z";$.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:S,axis:F,side:Math.random()<.5?-1:1})}return rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),Ot(le,ie>64?"glassTower":"midrise"),!0}function pt(N,z,Y,ee,ie,le="residential"){if(Nn(N,z,Y,ee))return!1;const S=fr(N,z,Y,ee)-.55,F=2+Math.random()*2.4;if(Rs(N,z,Y,ee,S+ie+F+1.5,6))return!1;e.position.set(N,S+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),K.push(e.matrix.clone()),rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:S+ie+F+1.5}),ye.push(Dt[Math.random()*Dt.length|0]),e.position.set(N,S+ie+F/2,z),e.scale.set(Y*.82,F,ee*.82),e.updateMatrix(),Se.push(e.matrix.clone());const G=t+Math.round((N-t)/a)*a,X=s-Math.round((s-z)/a)*a,k=Math.abs(N-G)<Math.abs(z-X),oe=k?G>N?1:-1:X>z?1:-1,ae=Math.min(k?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),he=Math.min(24,Math.max(8,k?Math.abs(G-N)-Y*.5-o*.35:Math.abs(X-z)-ee*.5-o*.35));e.quaternion.identity(),k?(e.position.set(N+oe*(Y*.5+.1),S+Q*.5+.1,z-ee*.16),e.scale.set(.24,Q,ae),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+he*.5),pe(N+oe*(Y*.5+he*.5),z)+.08,z-ee*.16),e.scale.set(he,.08,ae*1.18)):(e.position.set(N-Y*.16,S+Q*.5+.1,z+oe*(ee*.5+.1)),e.scale.set(ae,Q,.24),e.updateMatrix(),Be.push(e.matrix.clone()),e.position.set(N-Y*.16,pe(N,z+oe*(ee*.5+he*.5))+.08,z+oe*(ee*.5+he*.5)),e.scale.set(ae*1.18,.08,he)),e.updateMatrix(),Qe.push(e.matrix.clone()),e.position.set(N,S+.02,z),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),Ut.push(e.matrix.clone());for(let Te=0;Te<3;Te++){const ke=k?N+oe*(Y*.55):N+(Te-1)*Y*.25,Ee=k?z+(Te-1)*ee*.28:z+oe*(ee*.55);e.position.set(ke,pe(ke,Ee)+.55,Ee);const Ue=.85+Math.random()*.75;e.scale.set(Ue*1.35,Ue,Ue*1.35),e.updateMatrix(),nt.push(e.matrix.clone())}return Ot(le,"residentialHouse"),!0}function D(N,z,Y,ee,ie,le="commercial"){if(Nn(N,z,Y,ee))return!1;const S=fr(N,z,Y,ee)-.8;if(Rs(N,z,Y,ee,S+ie+2,7))return!1;const F=new W({map:Ze,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(N,S+ie/2,z),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),k=new O(new xe(Y*.72,.32,ee*.18),X);k.position.set(N,S+ie*.38,z+ee*.18),k.rotation.z=.13,n.add(k);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const Q=new O(new xe(Y*1.02,.24,.22),oe);Q.position.set(N,S+ae,z+ee*.5+.14),n.add(Q)}return rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),Ot(le,"parkingGarage"),!0}function C(N,z,Y,ee,ie,le="commercial"){if(Nn(N,z,Y,ee))return!1;const S=fr(N,z,Y,ee)-.65;if(Rs(N,z,Y,ee,S+ie+2,7))return!1;const F=new W({map:It[Math.random()*It.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(N,S+ie/2,z),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new O(new xe(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,S+ie+.45,z),n.add(X);const k=t+Math.round((N-t)/a)*a,oe=s-Math.round((s-z)/a)*a,ae=Math.abs(N-k)<Math.abs(z-oe),Q=ae?k>N?1:-1:oe>z?1:-1,he=ls[(N+z|0)%ls.length]||"#ffd45b",Te=new Ct({map:Ol(os[(Math.abs(N)+Math.abs(z)|0)%os.length],he),transparent:!0,side:vt,depthWrite:!1}),ke=new O(new Yt(Math.min(16,ae?ee*.82:Y*.82),4.2),Te);return ae?(ke.position.set(N+Q*(Y*.5+.2),S+ie*.66,z),ke.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(ke.position.set(N,S+ie*.66,z+Q*(ee*.5+.2)),ke.rotation.y=Q<0?Math.PI:0),n.add(ke),Ps("storefront-sign",ke.position.x,ke.position.y,ke.position.z),rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),Ot(le,"brickStorefront"),!0}for(let N=t+a/2;N<=i-a/2;N+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const Y=wn(N,z,c*.5).clearance;if(Y<2)continue;const ee=z>40&&z<380&&N>-360&&N<360,ie=ee?"showcase":z<-920?"industrial":Y>230||z<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=c/3;for(let S=0;S<3;S++)for(let F=0;F<3;F++){if(Math.random()<.08)continue;const G=N-c/2+le*(S+.5)+(Math.random()-.5)*le*.3,X=z-c/2+le*(F+.5)+(Math.random()-.5)*le*.3;if(wn(G,X,8).clearance<1)continue;const k=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?st(G,X,k*.9,oe*.9,12+Math.random()*12,ie):pt(G,X,k,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,S=le?me.clamp(58+Y*1.15,68,205):me.clamp(22+Y*.3,22,66),F=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<F;G++){const X=15+Math.random()*Math.min(30,c*.46),k=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),ae=z+(Math.random()-.5)*(c-k);if(wn(oe,ae,Math.hypot(X,k)*.5).clearance<2)continue;const Q=(18+Math.random()*(S-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&C(oe,ae,Math.max(18,X*1.12),Math.max(18,k*1.08),12+Math.random()*14,ie)||Math.random()<.18&&D(oe,ae,Math.max(24,X*1.35),Math.max(24,k*1.28),24+Math.random()*24,ie))||st(oe,ae,X,k,Q,ie)}}}for(let N=0;N<3;N++){if(!ve[N].length)continue;const z=new sn(ue,ne[N],ve[N].length);for(let Y=0;Y<ve[N].length;Y++)z.setMatrixAt(Y,ve[N][Y]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,n.add(z)}if(We.length){const N=new W({color:2896696,roughness:.62,metalness:.34}),z=new sn(ue,N,We.length);for(let Y=0;Y<We.length;Y++)z.setMatrixAt(Y,We[Y]);z.instanceMatrix.needsUpdate=!0,n.add(z)}if(U.length){const N=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new sn(ue,N,U.length);for(let Y=0;Y<U.length;Y++)z.setMatrixAt(Y,U[Y]),z.setColorAt(Y,new it(Ce[Y]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),n.add(z)}if(K.length){const N=new W({color:4891451,roughness:.88,metalness:.02}),z=new sn(ue,N,Ut.length);for(let Q=0;Q<Ut.length;Q++)z.setMatrixAt(Q,Ut[Q]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,n.add(z);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new sn(ue,Y,Qe.length);for(let Q=0;Q<Qe.length;Q++)ee.setMatrixAt(Q,Qe[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:B,roughness:.78,metalness:.03}),le=new sn(ue,ie,K.length);for(let Q=0;Q<K.length;Q++)le.setMatrixAt(Q,K[Q]),le.setColorAt(Q,new it(ye[Q]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const S=new Si(.72,1,4);S.rotateY(Math.PI/4);const F=new W({map:gt,color:14314033,roughness:.72}),G=new sn(S,F,Se.length);for(let Q=0;Q<Se.length;Q++)G.setMatrixAt(Q,Se[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:xt,roughness:.38,metalness:.18}),k=new sn(ue,X,Be.length);for(let Q=0;Q<Be.length;Q++)k.setMatrixAt(Q,Be[Q]);k.instanceMatrix.needsUpdate=!0,n.add(k);const oe=new W({color:3112239,roughness:.88,metalness:.02}),ae=new sn(new $t(1,8,6),oe,nt.length);for(let Q=0;Q<nt.length;Q++)ae.setMatrixAt(Q,nt[Q]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(_e.length,34);N++){const z=_e[N],Y=J[N%J.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new Ct({map:eu(Y,ee),transparent:!0,side:vt,depthWrite:!1}),le=new O(new Yt(8,24),ie);le.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),le.rotation.y=z.zSide<0?Math.PI:0,n.add(le),Ps("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let N=0;N<Math.min(Re.length,48);N++){const z=Re[N],Y=os[(N*5+2)%os.length],ee=ls[(N*2+1)%ls.length],ie=new Ct({map:Ol(Y,ee),transparent:!0,side:vt,depthWrite:!1}),le=Math.min(17,(z.axis==="x"?z.d:z.w)*.82),S=new O(new Yt(le,4.7),ie),F=z.gy+Math.max(6.2,Math.min(z.h-3.5,z.h*(.28+N%3*.12)));z.axis==="x"?(S.position.set(z.px+z.side*(z.w*.5+.22),F,z.pz),S.rotation.y=z.side>0?Math.PI/2:-Math.PI/2):(S.position.set(z.px,F,z.pz+z.side*(z.d*.5+.22)),S.rotation.y=z.side<0?Math.PI:0),n.add(S),Ps("wall-sign",S.position.x,S.position.y,S.position.z)}for(let N=0;N<Math.min($.length,18);N++){const z=$[N],Y=os[(N*7+4)%os.length],ee=Io[(N*5+3)%Io.length],ie=ls[(N+3)%ls.length],le=new tt,S=new W({map:gf(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new it(ie),emissiveIntensity:.34}),F=Math.min(18,(z.axis==="x"?z.d:z.w)*.86),G=new O(new xe(F,5.2,.42),S);G.position.y=4.8,le.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const k of[-F*.34,F*.34]){const oe=new O(new je(.13,.17,5,8),X);oe.position.set(k,2.25,-.2),le.add(oe)}le.position.set(z.px,z.gy+z.h+.7,z.pz),le.rotation.y=z.axis==="x"?z.side>0?Math.PI/2:-Math.PI/2:z.side<0?Math.PI:0,n.add(le),Ps("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=ps([new xe(2.2,.72,4.6).translate(0,.78,0),new xe(1.7,.56,2.15).translate(0,1.42,-.22)]),re=ps([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,z])=>new je(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,z))),Ke=130,Pe=new sn(ge,new W({roughness:.42,metalness:.36}),Ke),et=new sn(re,new W({color:1512727,roughness:.9}),Ke);let Xe=0,Me=0;for(;Xe<Ke&&Me<Ke*6;){Me++;const N=Math.random()<.5,z=N?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(wn(z,Y,4).clearance<2)continue;const ee=pe(z,Y)+.06;e.position.set(z,ee,Y),e.quaternion.setFromAxisAngle(Jt,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Pe.setMatrixAt(Xe,e.matrix),et.setMatrixAt(Xe,e.matrix),Pe.setColorAt(Xe,new it(ce[Math.random()*ce.length|0])),Mn.spots.push({x:z,z:Y,yaw:N?0:-Math.PI/2,idx:Xe,taken:!1}),Xe++}Pe.count=Xe,et.count=Xe,Pe.instanceMatrix.needsUpdate=!0,et.instanceMatrix.needsUpdate=!0,Pe.instanceColor&&(Pe.instanceColor.needsUpdate=!0),Pe.castShadow=!0,Mn.im=Pe,Mn.imW=et,n.add(Pe),n.add(et);const we=new Map,at=(N,z)=>`${Math.round(N)},${Math.round(z)}`;function rt(N,z){const Y=((z+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function He(){const N=[],z=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=Nv(),ie=new Ct({map:ee,transparent:!0,side:vt}),le=new W({color:5050642,roughness:.48,metalness:.12}),S=(ae,Q)=>new W({color:ae,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),F=(ae,Q,he,Te,ke,Ee)=>{const Ue=new tt,ct=new O(new xe(1.15,2.85,.75),Y);Ue.add(ct);const Mt=S(16724008,16717836),Et=S(16767053,16757276),_t=S(4521842,1693789),Ye=[Mt,Et,_t];for(let At=0;At<3;At++){const dt=new O(new $t(.28,12,8),Ye[At]);dt.position.set(0,.78-At*.78,-.42),Ue.add(dt)}Ue.position.set(he,Te,ke),Ue.rotation.y=Ee,ae.add(Ue),N.push({axis:Q,red:Mt,yellow:Et,green:_t,control:ae.userData.control})},G=(ae,Q,he)=>{const Te=at(ae,Q),ke={type:"signal",x:ae,z:Q,phase:he%4*2.1};we.set(Te,ke);const Ee=pe(ae,Q),Ue=new tt;Ue.userData.control=ke;const ct=o*.72,Mt=o*.72,Et=new O(new je(.18,.24,8.2,8),z);Et.position.set(ct,4.1,Mt),Ue.add(Et);const _t=new O(new xe(o*1.65,.2,.2),z);_t.position.set(ct-o*.72,8,Mt),Ue.add(_t);const Ye=new O(new xe(.2,.2,o*1.65),z);Ye.position.set(ct,7.55,Mt-o*.72),Ue.add(Ye),F(Ue,"ns",ct-o*1.24,7.52,Mt,0),F(Ue,"ns",ct-o*.18,7.52,-Mt,Math.PI),F(Ue,"ew",ct,7.05,Mt-o*1.24,Math.PI/2),F(Ue,"ew",-ct,7.05,Mt-o*.18,-Math.PI/2),Ue.position.set(ae,Ee,Q),Ue.traverse(At=>{At.castShadow=!0,At.receiveShadow=!0}),n.add(Ue)},X=(ae,Q,he)=>{const Te=at(ae,Q);we.set(Te,{type:"stop",x:ae,z:Q,phase:0});const ke=pe(ae,Q),Ee=new tt,Ue=he%2?-1:1,ct=he%3?1:-1,Mt=new O(new je(.12,.16,4.2,7),z);Mt.position.y=2.1,Ee.add(Mt);const Et=new O(new dn(1.04,8),le);Et.position.y=4.55,Et.rotation.y=Math.PI,Ee.add(Et);const _t=new O(new Yt(2.05,2.05),ie);_t.position.set(0,4.55,-.04),Ee.add(_t),Ee.position.set(ae+Ue*o*.74,ke,Q+ct*o*.74),Ee.rotation.y=Math.atan2(Ue,ct),Ee.traverse(Ye=>{Ye.castShadow=!0,Ye.receiveShadow=!0}),n.add(Ee)};let k=0,oe=0;for(let ae=1;ae<h.length-1;ae++)for(let Q=1;Q<d.length-1;Q++){const he=h[ae],Te=d[Q];if(wn(he,Te,o*.9).clearance<2)continue;const ke=Math.abs(he-80)<=a*1.05&&Te<=s&&Te>=-560,Ee=Te<-260&&Te>-1180&&(ae+Q)%4===0,Ue=Te>-360&&(ae+Q)%2===0;ke&&Q%2===0||Ee?G(he,Te,k++):(Ue||(ae+Q)%5===0&&Te>-820)&&X(he,Te,oe++)}return _n(n,ae=>{for(const Q of N){const he=rt(Q.control,ae);Q.red.emissiveIntensity=he.green===Q.axis||he.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=he.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=he.green===Q.axis?2.6:.1}}),{trafficLights:k,stopSigns:oe}}const ot=He();Gv(n,f,{X0:t,X1:i,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:we}),Ae.trafficLights=ot.trafficLights,Ae.stopSigns=ot.stopSigns;const H=new je(.12,.16,7.2,7),Ve=new $t(.46,10,8),Oe=new Yt(2.8,13),Ie=new W({color:1581353,roughness:.42,metalness:.68}),be=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),fe=new Ct({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:vt,blending:di}),$e=Lv(),lt=new xh({map:$e,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:di}),Ft=132,Pt=new sn(H,Ie,Ft),Pn=new sn(Ve,be,Ft),yn=new sn(Oe,fe,Ft);let ti=0;for(let N=0;N<Ft*2&&ti<Ft;N++){const z=Math.random()<.5,Y=z?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(wn(Y,ee,3).clearance<2)continue;const ie=pe(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Pt.setMatrixAt(ti,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Pn.setMatrixAt(ti,e.matrix);const le=new Uc(lt);le.position.set(Y,ie+7.5,ee);const S=6.2+Math.random()*2.4;le.scale.set(S,S,1),n.add(le),ds.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new L(1,0,0),-Math.PI/2),e.rotateZ(z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),yn.setMatrixAt(ti,e.matrix),ti++}Pt.count=ti,Pn.count=ti,yn.count=ti,Pt.instanceMatrix.needsUpdate=!0,Pn.instanceMatrix.needsUpdate=!0,yn.instanceMatrix.needsUpdate=!0,n.add(Pt,Pn,yn),Ae.streetLights=ti,n.add(new O(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new O(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const Da=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const z=new O(new xe(1.15,.09,13.5),Da);z.position.set(80,pe(80,N)+.9,N),z.receiveShadow=!0,n.add(z)}for(const N of[286,156,26,-104])for(let z=0;z<7;z++){const Y=new O(new xe(2,.08,11.8),u),ee=71.2+z*2.95;Y.position.set(ee,pe(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),is("roadDetails","openerCrosswalkStripes")}function Ur(N,z,Y,ee=!1){const ie=pe(N,z),le=new tt,S=new O(new je(.16,.22,9.5,8),Ie);S.position.y=4.75,le.add(S);const F=new O(new xe(3.8,.22,.22),Ie);F.position.set(Y*1.75,8.95,0),le.add(F);const G=new O(new $t(.62,12,8),be);G.position.set(Y*3.6,8.82,0),le.add(G);const X=new Uc(lt.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),le.add(X),ds.streetGlowSprites++;const k=new O(new Yt(3.2,15),fe.clone());if(k.position.set(Y*2.8,.72,0),k.rotation.x=-Math.PI/2,k.scale.y=.7+Math.random()*.35,le.add(k),ee){const oe=new wh(16762474,4.4,66,2);oe.position.copy(G.position),le.add(oe)}le.position.set(N,ie,z),n.add(le),Ae.streetLights++}let gi=0;for(let N=340;N>=-700;N-=118)Ur(63,N,1,gi++%3===0),Ur(97,N-42,-1,gi++%3===0);function vi(N,z,Y,ee,ie=6010942){const le=new W({color:ie,roughness:.92,metalness:.01}),S=new O(new xe(Y,.08,ee),le);return S.position.set(N,pe(N,z)+.06,z),S.receiveShadow=!0,n.add(S),Ae.openerProps++,S}function Mi(N,z,Y=1){const ee=pe(N,z),ie=new tt,le=new O(new je(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const S=new W({color:6065982,roughness:.86}),F=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[k,oe,ae,Q]=G[X],he=new O(new $t(Q,12,8),X%2?F:S);he.position.set(k,oe,ae),he.scale.y=.78,he.castShadow=!0,ie.add(he)}return ie.position.set(N,ee,z),ie.scale.setScalar(Y),n.add(ie),ci.push({kind:"tree",x:N,z,radius:3.4*Y,maxY:ee+11*Y}),Ae.openerProps++,ie}function Fr(N,z,Y=0){const ee=new tt,ie=new W({color:10970418,roughness:.64,metalness:.04}),le=new W({color:1910317,roughness:.46,metalness:.5});for(const S of[1.05,1.55]){const F=new O(new xe(6.8,.22,.44),ie);F.position.y=S,ee.add(F)}for(const S of[-2.7,2.7]){const F=new O(new xe(.22,1.2,.35),le);F.position.set(S,.62,0),ee.add(F)}ee.position.set(N,pe(N,z),z),ee.rotation.y=Y,n.add(ee),Ae.openerProps++}function Xs(N,z){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new tt,ie=new O(new je(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new O(new $t(.42,12,8),Y);le.position.y=1.32,ee.add(le);const S=new O(new je(.16,.16,1.1,10),Y);S.rotation.z=Math.PI/2,S.position.y=.9,ee.add(S),ee.position.set(N,pe(N,z),z),n.add(ee),Ae.openerProps++}function Ia(N,z,Y=0){const ee=new tt,ie=new W({color:1185821,roughness:.36,metalness:.68}),le=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),S=new W({color:2370611,roughness:.42,metalness:.32}),F=new O(new xe(8.5,.35,3.2),S);F.position.y=4.2,ee.add(F);for(const k of[-3.8,3.8]){const oe=new O(new je(.09,.11,4.1,7),ie);oe.position.set(k,2.05,-1.25),ee.add(oe)}const G=new O(new xe(8,2.8,.08),le);G.position.set(0,2.2,1.35),ee.add(G);const X=new O(new Yt(2.3,2.8),new Ct({map:Ol("BUS","#4ff3ff"),transparent:!0,side:vt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(N,pe(N,z),z),ee.rotation.y=Y,n.add(ee),Ps("bus-shelter-ad",N,pe(N,z)+2.2,z),Ae.openerProps++}function cn(N,z,Y,ee,ie,le,S,F=null,G=0){if(Nn(N,z,Y,ee,12))return!1;const X=pe(N,z)-.45;if(Rs(N,z,Y,ee,X+ie+2))return!1;const k=N<80?1:-1,oe=new W({map:ur(192,512,S),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new O(new xe(Y,ie,ee),oe);ae.position.set(N,X+ie/2,z),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const Q=new W({map:ur(220,620,Math.min(.86,S+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:vt}),he=new O(new Yt(ee*.78,ie*.74),Q);he.position.set(N+k*(Y/2+.09),X+ie*.54,z),he.rotation.y=k>0?Math.PI/2:-Math.PI/2,n.add(he);for(const Ee of[-1,1]){const Ue=new O(new Yt(Y*.82,ie*.72),Q.clone());Ue.position.set(N,X+ie*.55,z+Ee*(ee/2+.1)),Ue.rotation.y=Ee>0?0:Math.PI,n.add(Ue)}const Te=new O(new xe(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));Te.position.set(N,X+ie+.7,z),n.add(Te);const ke=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ee of[-1,1]){const Ue=new O(new xe(Y*1.1,.22,.18),ke);Ue.position.set(N,X+ie+1.4,z+Ee*(ee/2+.18)),n.add(Ue)}if(F&&G){const Ee=new Ct({map:eu(F,F==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:vt,depthWrite:!1}),Ue=new O(new Yt(7.5,24),Ee);Ue.position.set(N+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),z),Ue.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Ue),Ps("showcase-neon",Ue.position.x,Ue.position.y,Ue.position.z)}return rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),Ot("showcase","glassTower"),!0}function Ua(N,z,Y,ee=3.2){const ie=N*.5+ee,le=z*.5+ee,S=Math.max(2,Math.abs(ie-le)*.72),F=N>=z?[-ie,0,-le,ie,0,-le,S,Y,0,-ie,0,-le,S,Y,0,-S,Y,0,ie,0,-le,ie,0,le,S,Y,0,ie,0,le,-ie,0,le,-S,Y,0,ie,0,le,S,Y,0,-S,Y,0,-ie,0,le,-ie,0,-le,-S,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-S,ie,0,-le,ie,0,le,0,Y,S,ie,0,-le,0,Y,S,0,Y,-S,ie,0,le,-ie,0,le,0,Y,S,-ie,0,le,-ie,0,-le,0,Y,-S,-ie,0,le,0,Y,-S,0,Y,S],G=new Zt;return G.setAttribute("position",new bt(F,3)),G.computeVertexNormals(),G}function Nr(N,z,Y,ee,ie,le,S={}){if(Nn(N,z,Y,ee,12))return!1;const F=pe(N,z)-.3;if(Rs(N,z,Y,ee,F+ie+(S.roofH??8.2)+1,6))return!1;const G=S.frontZ??-1,X=new W({map:B,color:S.wallColor??14734788,roughness:.68,metalness:.03}),k=new O(new xe(Y,ie,ee),X);k.position.set(N,F+ie/2,z),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const oe=new W({map:gt,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=S.roofH??8.2,Q=new O(Ua(Y,ee,ae),oe);Q.position.set(N,F+ie,z),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const he=new W({color:15985112,roughness:.42,metalness:.05}),Te=new O(new xe(Y+7,.42,1.2),he);Te.position.set(N,F+ie+.12,z+G*(ee*.5+1.4)),n.add(Te);const ke=Te.clone();ke.position.z=z-G*(ee*.5+1.4),n.add(ke);const Ee=Math.min(18,Y*.38),Ue=new O(new xe(Ee,ie*.55,.32),new W({map:xt,roughness:.34,metalness:.2}));Ue.position.set(N+Y*.18,F+ie*.33,z+G*(ee*.5+.22)),n.add(Ue);const ct=new O(new xe(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ct.position.set(N-Y*.25,F+3.7,z+G*(ee/2+.24)),n.add(ct);const Mt=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Et=new W({color:3353638,roughness:.38});for(const jt of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(jt-Y*.18)<Ee*.45)continue;const Yn=new O(new xe(6.2,4.8,.26),Et);Yn.position.set(N+jt,F+ie*.58,z+G*(ee*.5+.28)),n.add(Yn);const Bt=new O(new xe(4.8,3.4,.3),Mt);Bt.position.copy(Yn.position),Bt.position.z+=G*.04,n.add(Bt)}const _t=new W({color:12370619,roughness:.44,metalness:.04}),Ye=new O(new xe(Ee*1.18,.12,34),_t);Ye.position.set(N+Y*.18,pe(N+Y*.18,z+G*(ee*.5+17))+.11,z+G*(ee*.5+17)),n.add(Ye);const At=new W({color:5679925,roughness:.86,metalness:.01}),dt=new O(new xe(Y+10,.08,ee+12),At);dt.position.set(N,pe(N,z)-.18,z),dt.receiveShadow=!0,n.add(dt),dt.renderOrder=-1;const Kt=new W({color:3042609,roughness:.84}),Ui=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let jt=0;jt<9;jt++){const Yn=N-Y*.44+jt*(Y*.11),Bt=z+G*(ee*.5+2.2+jt%2*1.5),hn=new O(new $t(1.35+jt%3*.22,10,7),jt%4===0?Ui[jt%Ui.length]:Kt);hn.position.set(Yn,pe(Yn,Bt)+.95,Bt),hn.scale.y=.72,hn.castShadow=!0,n.add(hn)}return rn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:F+ie+5}),Ot("showcase","lowStorefront"),!0}return vi(45,318,36,84,6404169),vi(116,318,36,84,6074179),vi(44,188,34,84,6798662),vi(118,188,36,84,5941822),vi(43,60,34,82,5679164),vi(118,60,36,82,6864197),cn(18,315,70,54,154,2311775,.72,"HOTEL",1),cn(17,185,72,58,188,1522779,.78,null,0),cn(31,55,44,56,138,2840688,.66,"OPEN",1),cn(24,-75,52,64,182,1913933,.7,null,0),cn(145,315,68,54,116,2776440,.72,null,0),cn(146,185,70,58,146,2314602,.76,null,0),cn(142,55,42,56,156,1590364,.68,"CAFE",-1),cn(134,-75,48,64,114,3688540,.62,null,0),cn(-70,315,52,52,146,2112085,.68,null,0),cn(228,185,48,58,148,3235186,.66,null,0),cn(-78,185,48,56,134,2181730,.68,null,0),cn(236,315,44,54,104,3104884,.66,null,0),Nr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Nr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),cn(-48,-360,54,56,148,2439765,.58,null,0),cn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Mi(112,227,1.35),Mi(104,221,1.05),Mi(121,233,1.15),Fr(112,217,0),Mi(50,292,1.2),Mi(111,316,.95),Mi(48,137,.9),Mi(116,102,1.05),Fr(47,248,Math.PI/2),Xs(57,226),Ia(111,260,-Math.PI/2),Fe.add(n),n}function wf(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=ft(i),c=new L(o.tangent.x,0,o.tangent.z).normalize(),h=new L().crossVectors(Jt,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),f=t==="off"?1:-1,p=d.x+c.x*s*f+h.x*e*r,m=d.z+c.z*s*f+h.z*e*r,x=new L(p,pe(p,m)+.4,m),M=t==="off"?d:x,g=t==="off"?x:d,u=26,y=[];for(let q=0;q<=u;q++){const Z=q/u,ne=Z*Z*(3-2*Z),ue=t==="off"?1-(1-Z)*(1-Z):ne;y.push(new L(me.lerp(M.x,g.x,Z),me.lerp(M.y,g.y,ue),me.lerp(M.z,g.z,Z)))}const v=7.4,_=new L,E=new L,T=[],A=[];for(let q=0;q<=u;q++)E.subVectors(y[Math.min(u,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),_.crossVectors(Jt,E).normalize(),T.push(y[q].clone().addScaledVector(_,-v)),A.push(y[q].clone().addScaledVector(_,v));const R={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<u;q++){const Z=y[q],ne=y[q+1],ue=ne.x-Z.x,ve=ne.z-Z.z,We=Math.max(1e-4,ue*ue+ve*ve);R.segments.push({a:Z.clone(),b:ne.clone(),abx:ue,abz:ve,lenSq:We,u0:q/u,u1:(q+1)/u})}Ws.push(R);const w=[];for(let q=0;q<u;q++){const Z=T[q],ne=A[q],ue=T[q+1],ve=A[q+1];w.push(Z.x,Z.y,Z.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),w.push(Z.x,Z.y,Z.z,ve.x,ve.y,ve.z,ue.x,ue.y,ue.z)}const b=new Zt;b.setAttribute("position",new bt(w,3)),b.computeVertexNormals();const P=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:vt});n.add(new O(b,P));const I=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<u;q++)Un(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,I),Un(n,A[q].clone().setY(A[q].y+1),A[q+1].clone().setY(A[q+1].y+1),.16,I);const V=new W({color:7173241,roughness:.82});for(let q=3;q<u;q+=3){const Z=y[q],ne=pe(Z.x,Z.z),ue=Z.y-ne;if(ue<3||Nn(Z.x,Z.z,3.2,3.2,1.2))continue;const ve=new O(new je(.9,1.15,ue,8),V);ve.position.set(Z.x,ne+ue/2,Z.z),n.add(ve),Kn.push({x:Z.x,z:Z.z,hw:1.3,hd:1.3,maxY:Z.y-.9})}const j=new Ct({map:Lh(a),transparent:!0,side:vt}),te=new O(new Yt(12,3),j);te.position.copy(t==="off"?d:x).add(new L(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const Z=new O(new je(.2,.26,6,6),V),ne=t==="off"?d:x;Z.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(Z)}}function Wv(n,e=1){wf(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function Xv(n,e=-1){wf(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function qv(){const n=new tt,e=[],t=new it(14170671),i=new it(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),r=new Ct({map:Yv(),transparent:!0,side:vt}),a=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:vt}),h=12,d=[],f=[];let p=0;for(let x=0;x<se.length;x+=h){if(Pi(x+h*.5)){p++;continue}const M=ft(x),g=ft(x+h),u=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:_}=Hi(M,g);for(const E of[-1,1]){const T=u.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(T),f.push(_),e.push(p%2===0?t:i)}if(p%16===8){const E=(p>>4)%2?1:-1,T=u.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),A=new tt,R=new O(new Yt(4.4,2.6),r);R.position.y=3.4,R.rotation.y=Math.PI,A.add(R);const w=new je(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const P=new O(w,s);P.position.set(b,1.7,0),A.add(P)}A.position.copy(T),A.quaternion.copy(_),n.add(A)}p++}for(let x=0;x<se.length;x+=16){const M=ft(x),g=1+(Math.random()<.5?1:0);for(let u=0;u<g;u++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,_=M.p.x+M.side.x*v*y+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*y+(Math.random()-.5)*16;if($o(_,E,18)||Nn(_,E,12,12,3.5))continue;const T=pe(_,E);if(Math.random()<.78){const A=.7+Math.random()*1.5,R=new tt,w=2.4+Math.random()*4.2,b=new O(new je(.26,.42,w,6),a);b.position.y=w/2,R.add(b);const P=2+Math.floor(Math.random()*3);for(let I=0;I<P;I++){const V=new O(new Si(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(u+I+x)%o.length]);V.position.y=w+I*1.4+1.5,V.rotation.y=Math.random()*Math.PI,R.add(V)}R.position.set(_,T+.6,E),R.scale.setScalar(A),n.add(R)}else{const A=1.4+Math.random()*3.6,R=new O(new vh(A,0),c);R.position.set(_,T+A*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),n.add(R),Kn.push({kind:"rock",x:_,z:E,radius:A*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(Pi(M))continue;const g=ft(M),u=ft(M+h),y=g.p.clone().add(u.p).multiplyScalar(.5),{q:v}=Hi(g,u),_=se.width*.5+1.2,E=9,T=new tt,A=new je(.4,.55,E,7);for(const I of[-1,1]){const V=new O(A,s);V.position.set(I*_,E/2,0),T.add(V)}const R=_*2,w=new O(new xe(R,1.1,1.1),s);w.position.y=E,T.add(w);const b=new Ct({map:Lh(m[x]),transparent:!0,side:vt}),P=new O(new Yt(R*.82,3),b);P.position.set(0,E-2,0),P.rotation.y=Math.PI,T.add(P),T.position.copy(y),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new je(.18,.24,3,6);x.translate(0,1.5,0);const M=new $t(.34,8,6);M.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),u=new W({roughness:.55}),y=new sn(x,g,d.length),v=new sn(M,u,d.length),_=new zt;for(let E=0;E<d.length;E++)_.position.copy(d[E]),_.quaternion.copy(f[E]),_.updateMatrix(),y.setMatrixAt(E,_.matrix),v.setMatrixAt(E,_.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return Wv(n),Xv(n),Fe.add(n),n}function Yv(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new nn(n);return t.colorSpace=Rt,t}function Lh(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new nn(e);return i.colorSpace=Rt,i}function $v(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)i.fillStyle=c%2?s:r,i.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new nn(t);return o.colorSpace=Rt,o}function Zv(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*n.width,a=Math.random()*n.height;e.fillRect(r,a,2.4,2.4)}const i=new nn(n);return i.colorSpace=Rt,i.wrapS=Rn,i.repeat.set(3,1),i}function qt(n,e,t,i,s){const r=new O(new xe(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(i),r.castShadow=!1,r.receiveShadow=!0,n.add(r),r}function Hi(n,e){const t=e.p.clone().sub(n.p).normalize(),i=Ah.crossVectors(Jt,t).normalize();let s=t.clone().cross(i).normalize();const r=(n.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new $i().setFromAxisAngle(t,r);i.applyQuaternion(c),s.applyQuaternion(c)}const a=new wt().makeBasis(i,s,t),o=new $i().setFromRotationMatrix(a);return{tangent:t,sideways:i,normal:s,q:o}}function nu(n,e,t,i){const s=[],r=[],a=[],o=se.width*.47;let c=0;for(let f=e;f<=t;f+=8){const p=ft(Math.min(f,t)),m=Hi(p,ft(p.s+2)),x=Math.sin(f*.018)*.04,M=p.p.clone().addScaledVector(m.sideways,-o).addScaledVector(m.normal,.46+x),g=p.p.clone().addScaledVector(m.sideways,o).addScaledVector(m.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const u=(f-e)/64;if(r.push(0,u,1,u),c>0){const y=(c-1)*2,v=c*2;a.push(y,y+1,v,y+1,v+1,v)}c++}const h=new Zt;h.setAttribute("position",new bt(s,3)),h.setAttribute("uv",new bt(r,2)),h.setIndex(a),h.computeVertexNormals();const d=new O(h,i);d.receiveShadow=!0,n.add(d)}function Kv(n,e){let t=0;for(const i of se.gaps)nu(n,t,Math.max(t,i.start-4),e),t=i.end+4;nu(n,t,se.length,e)}function Jv(n,e,t){const i=ft(e.s+2),{normal:s,q:r}=Hi(e,i),a=new tt;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new O(new xe(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new O(new xe(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const h=new O(new xe(.42,.1,3.8),t);h.position.set(0,.01,-1.9),a.add(h),n.add(a)}function jv(){const n=new tt;Fe.add(n),Gc=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),r=new W({color:6120040,roughness:.5,metalness:.6}),a=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new W({color:4935486,roughness:.92,metalness:.04}),p=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const u=new W({map:Cv(),roughness:.74,metalness:.08}),y=new Ct({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;Kv(n,u);function _(E,T=!1){if(Pi(E))return!1;const A=ft(E),R=ft(E+3),{sideways:w,normal:b,q:P}=Hi(A,R),I=A.p,V=pe(I.x,I.z),j=I.y-.95;if(j-V<10)return!1;const te=se.width*(T?.43:.35),q=j,Z=V+.25,ne=T?.56:.42,ue=T?2.4:1.75,ve=T?.52:.36,We=[],U=[];for(const ye of[-1,1])if(Nn(I.x+w.x*ye*te,I.z+w.z*ye*te,ue*2.2,ue*2.2,1.2))return!1;for(const ye of[-1,1]){const Se=I.clone().addScaledVector(w,ye*te).addScaledVector(b,-.85);Se.y=q;const Be=new L(Se.x,Z,Se.z);Un(n,Be,Se,ne,r);const Qe=new O(new je(ue,ue*1.12,ve,12),r);Qe.position.set(Be.x,V+ve*.5,Be.z),Qe.receiveShadow=!0,n.add(Qe),We.push(Se),U.push(Be),Kn.push({x:Be.x,z:Be.z,hw:ue*.92,hd:ue*.92,maxY:q-.7})}const Ce=I.clone().addScaledVector(b,-1.05);Ce.y=q,qt(n,new L(se.width*.92,T?.58:.42,T?1.55:1.15),Ce,P,a);const _e=U[0].clone();_e.y+=(q-Z)*.28;const Re=U[1].clone();Re.y+=(q-Z)*.28;const $=We[0].clone();$.y-=1;const K=We[1].clone();if(K.y-=1,Un(n,_e,K,T?.18:.14,c),Un(n,Re,$,T?.18:.14,c),T){const ye=U[0].clone();ye.y+=(q-Z)*.58;const Se=U[1].clone();Se.y+=(q-Z)*.58,Un(n,U[0].clone().setY(Z+1.2),Se,.16,c),Un(n,U[1].clone().setY(Z+1.2),ye,.16,c),Un(n,ye,K,.16,c),Un(n,Se,$,.16,c)}return Gc++,!0}for(let E=0;E<se.length;E+=v){if(Pi(E+v*.5))continue;const T=ft(E),A=ft(E+v),R=T.p.clone().add(A.p).multiplyScalar(.5),{sideways:w,normal:b,q:P}=Hi(T,A),I=T.p.distanceTo(A.p)+.45,V=Math.floor(E/(v*2))%2?e:t;qt(n,new L(se.width,.62,I),R.clone().addScaledVector(b,-.05),P,V),qt(n,new L(se.width-2.8,.08,I*.86),R.clone().addScaledVector(b,.36),P,f),qt(n,new L(.2,.1,I*.76),R.clone().addScaledVector(w,-se.width*.19).addScaledVector(b,.43),P,f),qt(n,new L(.2,.1,I*.76),R.clone().addScaledVector(w,se.width*.19).addScaledVector(b,.43),P,f),E%48===0&&(qt(n,new L(.14,.08,I*.62),R.clone().addScaledVector(w,-se.width*.08).addScaledVector(b,.51),P,M),qt(n,new L(.14,.08,I*.62),R.clone().addScaledVector(w,se.width*.08).addScaledVector(b,.51),P,M)),E%120===0&&qt(n,new L(se.width*.42,.07,.72),R.clone().addScaledVector(b,.55),P,g),qt(n,new L(se.width+1.2,.35,I*.94),R.clone().addScaledVector(b,-.56),P,a),qt(n,new L(.42,.42,I*.9),R.clone().addScaledVector(w,-se.width*.36).addScaledVector(b,-.78),P,x),qt(n,new L(.42,.42,I*.9),R.clone().addScaledVector(w,se.width*.36).addScaledVector(b,-.78),P,x);const j=R.clone().addScaledVector(w,-se.width*.51),te=R.clone().addScaledVector(w,se.width*.51);if(qt(n,new L(.32,.46,I),j.clone().addScaledVector(b,.28),P,i),qt(n,new L(.32,.46,I),te.clone().addScaledVector(b,.28),P,i),qt(n,new L(.26,.72,I*.94),j.clone().addScaledVector(b,-.22),P,a),qt(n,new L(.26,.72,I*.94),te.clone().addScaledVector(b,-.22),P,a),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const Z=new O(new je(.16,.2,.12,10),o);Z.position.copy(R).addScaledVector(w,q).addScaledVector(b,.46),Z.quaternion.copy(P),Z.castShadow=!1,n.add(Z)}if(E%72===0&&(qt(n,new L(.34,1.56,3.4),R.clone().addScaledVector(w,-se.width*.66).addScaledVector(b,1.16),P,s),qt(n,new L(.34,1.56,3.4),R.clone().addScaledVector(w,se.width*.66).addScaledVector(b,1.16),P,s),qt(n,new L(.18,.18,4.4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.94),P,s),qt(n,new L(.18,.18,4.4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.94),P,s),qt(n,new L(.12,.12,4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.38),P,i),qt(n,new L(.12,.12,4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.38),P,i),Un(n,R.clone().addScaledVector(w,-se.width*.58).addScaledVector(b,-1.08),R.clone().addScaledVector(w,se.width*.58).addScaledVector(b,-1.08),.11,c),Un(n,R.clone().addScaledVector(w,-se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c),Un(n,R.clone().addScaledVector(w,se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new O(new dn(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(R.x,-4.72,R.z),q.scale.set(se.width*.9,Math.max(10,I*2.2),1),q.rotation.z=Math.atan2(Hi(T,A).tangent.x,Hi(T,A).tangent.z),n.add(q)}if(E%144===0){const q=R.clone().addScaledVector(w,-se.width*.74).addScaledVector(b,2),Z=R.clone().addScaledVector(w,se.width*.74).addScaledVector(b,2);Un(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Un(n,Z.clone().addScaledVector(b,-1.2),Z.clone().addScaledVector(b,1.1),.12,s),qt(n,new L(.46,.72,.46),q.clone().addScaledVector(b,1.15),P,h),qt(n,new L(.46,.72,.46),Z.clone().addScaledVector(b,1.15),P,h)}if(E%288===0){const q=R.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);qt(n,new L(.44,.44,.44),q.clone(),P,p),Un(n,q.clone().addScaledVector(b,-.2),R.clone().addScaledVector(b,1),.05,c)}E%48===0&&_(E+v*.5,!1),E%168===0&&!Pi(E+16)&&Jv(n,ft(E+5),d)}for(const E of se.gaps){const T=ft(E.start-3),A=ft(E.end+3);for(const R of[T,A]){const w=ft(R.s+2),{normal:b,q:P}=Hi(R,w);qt(n,new L(se.width-1.2,.08,4.6),R.p.clone().addScaledVector(b,.54),P,h),qt(n,new L(se.width*.62,.09,1.3),R.p.clone().addScaledVector(b,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),P,g);for(const I of[-se.width*.42,0,se.width*.42]){const V=R.p.clone().addScaledVector(R.side,I).addScaledVector(b,2.35);qt(n,new L(.46,.46,.46),V,P,I===0?m:h)}_(R.s+(R===T?-9:9),!0),_(R.s+(R===T?-24:24),!0)}}return n}function Tf(n=13710372,e=7740696){const t=new tt,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new W({color:329225,roughness:.52,metalness:.12}),a=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),M=new O(new dn(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(_,E,T,A,R=null,w=null)=>{const b=new O(E,T);return b.name=_,b.position.copy(A),R&&b.rotation.set(R.x||0,R.y||0,R.z||0),w&&b.scale.copy(w),t.add(b),b},u=(_,E,T,A,R,w,b=0,P=0,I=0)=>g(_,new xe(E.x,E.y,E.z),T,new L(A,R,w),new L(b,P,I));u("low black undertray",new L(5.25,.28,8.45),r,0,.45,-.08),u("wide wedge body tub",new L(4.85,.86,6.65),i,0,.98,.28,-.035),u("sloped front wedge nose",new L(3.7,.64,3.35),i,0,.83,-3.75,-.145),u("front black splitter",new L(5.25,.13,.78),r,0,.35,-5.6),u("left sculpted rocker panel",new L(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),u("right sculpted rocker panel",new L(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),u("left rear haunch",new L(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),u("right rear haunch",new L(.72,.74,2.55),i,2.53,1.18,2.08,-.04),u("left front fender flare",new L(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),u("right front fender flare",new L(.46,.54,1.38),i,2.55,.98,-2.78,-.04),u("black rear fascia",new L(4.72,.66,.2),a,0,1.02,4.04),u("deep rear bumper",new L(5.32,.38,.48),c,0,.58,4.23),u("front windshield",new L(2.8,.13,1.15),h,0,1.78,-1.25,-.48),u("roof glass",new L(2.34,.18,1.55),h,0,2.08,-.2,-.13),u("left side window",new L(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),u("right side window",new L(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),u("black a pillar left",new L(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),u("black a pillar right",new L(.12,.86,.14),x,1.46,1.75,-1.22,-.48),u("rear deck panel",new L(3.5,.18,2.18),i,0,1.7,2,-.2);for(let _=0;_<7;_++)u("black rear deck louver",new L(3.35,.12,.18),a,0,1.83+_*.015,1.1+_*.28,-.21);u("raised rear spoiler blade",new L(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const _ of[-2.28,2.28])u("spoiler side endplate",new L(.24,.78,1.04),s,_,1.43,3.72,0,0,_<0?-.08:.08);for(const _ of[-1.78,1.78])u("thin hood crease",new L(.08,.04,2.55),x,_*.36,1.27,-3.45,-.15),u("door seam",new L(.035,.68,1.75),x,_,1.16,-.2),u("side intake",new L(.09,.34,.9),a,Math.sign(_)*2.68,.86,1.42);for(const _ of[-1.04,1.04])u("pop up headlight glass",new L(.62,.12,.18),p,_,1.02,-5.28,-.16);u("tail light backplate",new L(3.86,.46,.08),x,0,1.08,4.18);for(const _ of[-1.42,-.62,.62,1.42])u("rectangular glowing tail lamp",new L(.54,.28,.1),Math.abs(_)>1?d:f,_,1.08,4.24);u("slim chrome beltline left",new L(.06,.08,4.75),o,-2.72,1.42,-.2),u("slim chrome beltline right",new L(.06,.08,4.75),o,2.72,1.42,-.2),u("left black roof rail",new L(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),u("right black roof rail",new L(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const _ of[-2.86,2.86])u("angular side mirror arm",new L(.42,.08,.08),x,_,1.62,-1.55,0,0,_<0?-.14:.14),u("blue tinted side mirror",new L(.12,.34,.46),h,_*1.03,1.62,-1.65,0,_<0?.24:-.24),u("flush door handle",new L(.08,.11,.46),o,_*.94,1.28,.52);for(const _ of[-2.65,2.42])u("left wheel arch shadow",new L(.08,.9,1.75),x,-2.82,.78,_),u("right wheel arch shadow",new L(.08,.9,1.75),x,2.82,.78,_);u("black license recess",new L(.9,.24,.08),a,0,.76,4.31);const y=[],v=(_,E,T=!1)=>{const A=new tt;A.name=T?"steering front wheel assembly":"rear wheel assembly",A.position.set(_,.54,E);const R=new O(new je(.88,.88,.62,28),r);R.name="wide performance tire",R.rotation.z=Math.PI/2,A.add(R);const w=new O(new gs(.88,.06,10,32),r);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,A.add(w);const b=new O(new je(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,A.add(b);const P=new O(new je(.56,.56,.08,24),m);P.name="visible brake disc",P.rotation.z=Math.PI/2,P.position.x=_>0?-.05:.05,A.add(P);for(let j=0;j<8;j++){const te=new O(new xe(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=j/8*Math.PI*2,te.position.set(_>0?.035:-.035,0,.22),A.add(te)}const I=new O(new xe(.1,.22,.18),f);I.name="small brake caliper",I.position.set(_>0?-.39:.39,.18,-.38),A.add(I);const V=new O(new je(.17,.17,.72,18),c);V.name="dark center cap",V.rotation.z=Math.PI/2,A.add(V),t.add(A),T&&y.push(A)};for(const _ of[-2.4,2.4])v(_,-2.65,!0),v(_,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const _ of[-.92,-.52,.52,.92]){const E=new O(new je(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(_,.43,4.52),t.add(E)}return t.traverse(_=>{_.castShadow=!0,_.receiveShadow=!0}),Fe.add(t),t}function Qv(){const n=new tt,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),r=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new O(new xe(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new O(new xe(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new O(new xe(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const f=new O(new Yt(2.8,.82,1,1),a);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,n.add(f);const p=new O(new gs(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,n.add(p);for(let m=0;m<3;m++){const x=new O(new xe(.34,.025,.035),i);x.position.copy(p.position),x.rotation.copy(p.rotation),x.rotation.z+=m/3*Math.PI*2,n.add(x)}for(let m=0;m<6;m++){const x=new O(new je(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),n.add(x)}for(const m of[-1.08,1.08]){const x=new O(new je(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(m,-.68,-1.58),n.add(x);const M=new O(new gs(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const x=new O(new je(.035,.04,.028,8),i);x.position.set(m,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const m of[-.52,.52]){const x=new O(new $t(.045,12,8),r);x.position.set(m,-.34,-1.22),n.add(x)}n.position.set(0,0,0),Ne.add(n),an=n}function eM(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:Av(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=ft(0),r=new wt().makeBasis(s.side,Jt,s.tangent),a=new $i().setFromRotationMatrix(r),o=new tt;for(const d of[-se.width*.58,se.width*.58]){const f=new O(new xe(.8,11,.8),n);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Jt,5.4),f.quaternion.copy(a),o.add(f)}const c=new O(new xe(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(Jt,11.2),c.quaternion.copy(a),o.add(c);const h=new O(new xe(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(Jt,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(a),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const f=new O(new $t(.32,16,10),i);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Jt,10.25),o.add(f)}return Fe.add(o),o}function Dh(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new O(new dn(3.65,36),new Ct({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const r=(h,d,f,p,m=null,x=null)=>{const M=new O(d,f);return M.name=h,M.position.copy(p),m&&M.rotation.set(m.x||0,m.y||0,m.z||0),x&&M.scale.copy(x),n.add(M),M},a=(h,d,f,p,m,x,M,g,u=0,y=0,v=0)=>r(h,new xe(d,f,p),m,new L(x,M,g),{x:u,y,z:v}),o=[];function c(h,d,f,p=.88,m=.62){const x=new tt;x.name=f?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,p*.62+.18,d);const M=new O(new je(p,p,m,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new O(new gs(p,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const u=new O(new je(p*.48,p*.48,m+.04,24),i.chrome);u.name="chrome rim",u.rotation.z=Math.PI/2,x.add(u);const y=new O(new je(p*.62,p*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let _=0;_<8;_++){const E=new O(new xe(.08,.055,m),i.chrome);E.name="wheel spoke",E.rotation.x=_/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,p*.25),x.add(E)}const v=new O(new je(.17,.17,m+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),f&&o.push(x),x}return{mats:i,part:r,box:a,wheel:c,frontWheels:o}}function tM(n=15616818,e=2434871){const t=new tt,i=Dh(t,n,e),{mats:s,box:r}=i;r("low undertray",4.6,.26,9.2,s.black,0,.42,0),r("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),r("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),r("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),r("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),r("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),r("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),r("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),r("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),r("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),r("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),r("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),r("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),r("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),r("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let a=0;a<6;a++)r("engine deck vent",2.9,.1,.16,s.dark,0,1.47+a*.008,1.3+a*.42,-.05);r("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),r("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),r("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const a of[-.72,.72])r("slit headlight",.85,.09,.14,s.headLamp,a,.92,-6.1,-.1);for(const a of[-1.5,1.5])r("beltline chrome strip",.05,.06,5.4,s.chrome,a*1.36,1.3,-.4);for(const a of[-.4,.4]){const o=new O(new je(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(a,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Fe.add(t),t}function nM(n=4165830,e=15908108){const t=new tt,i=Dh(t,n,e),{mats:s,box:r}=i;r("undertray",5,.3,7.6,s.black,0,.48,0),r("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),r("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),r("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),r("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),r("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),r("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),r("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),r("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),r("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),r("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),r("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),r("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),r("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const a of[-2.05,-.85,.85,2.05]){const o=new O(new je(.21,.21,.1,18),Math.abs(a)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(a,1.28,3.78),t.add(o)}for(const a of[-1.7,1.7])r("square headlamp",.7,.3,.12,s.headLamp,a,1.22,-4.62);r("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const a of[-1,1]){const o=new O(new je(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(a*2.62,.55,.4),t.add(o),r("side pipe heat shield",.16,.28,2.4,s.dark,a*2.62,.72,.4),r("fender flare front",.5,.6,1.6,s.body,a*2.6,1,-2.5,-.03),r("fender flare rear",.55,.68,1.9,s.body,a*2.62,1.05,2.3,-.03),r("racing stripe",.8,.02,6.8,s.trim,a*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Fe.add(t),t}function iM(n=16764159,e=526344){const t=new tt,i=Dh(t,n,e),{mats:s,box:r}=i;r("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),r("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),r("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),r("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),r("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),r("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),r("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),r("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),r("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),r("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),r("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),r("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),r("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),r("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),r("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const a of[-1,1]){const o=new O(new je(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=a*.42,o.position.set(a*.75,1.85,.35),t.add(o),r("front fender pod",.62,.4,1.5,s.body,a*1.85,.95,-2.15,-.05),r("rear fender pod",.68,.46,1.7,s.body,a*1.9,1,2.15,-.05),r("pod brace arm",.5,.1,.12,s.steel,a*1.45,.98,-2.15),r("number roundel",.04,.5,.5,s.trim,a*1.79,1.05,.2)}for(const a of[-.85,.85])r("bug eye headlamp",.34,.26,.14,s.headLamp,a,1.08,-3.66),r("tail lamp block",.4,.22,.1,Math.abs(a)>.5?s.tailHot:s.tailWarm,a*1.6,1.14,3.14);{const a=new O(new je(.15,.15,.5,14),s.chrome);a.name="single stinger exhaust",a.rotation.x=Math.PI/2,a.position.set(.65,.78,3.28),t.add(a)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Fe.add(t),t}const Gs=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Tf(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>tM()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>nM()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>iM()}];let Yi=me.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function us(){return l.drivingStolen&&ht?du[ht.type]||du.compact:Gs[Yi].stats}const Ef=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],kn=Ef.map((n,e)=>({...n,idx:e,mesh:Tf(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),sM=kn[0].mesh;let Vt=Gs[Yi].build();function rM(n){Yi=me.clamp(n,0,Gs.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Yi));const e=Vt.visible;pr(Vt),Vt=Gs[Yi].build(),Vt.visible=e,typeof jc=="function"&&jc()}for(const n of kn)n.mesh.visible=!1,Fe.add(n.mesh);function Ko(n){for(const e of kn)e.mesh.visible=n}const aM=[10,6,4,2];let Nt=null;try{Nt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function Pa(){return Nt?.active?Nt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Af(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Nt))}function oM(){Nt={division:Pa(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Af()}function Cf(n){return["One","Two","Three","Four"][me.clamp(n,1,4)-1]}function Rf(){return[{key:"you",label:"You",pts:Nt?.points.you??0},...Ef.map(e=>({key:e.key,label:e.label,pts:Nt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Vt.visible=!1;Bv();Ov();Ae.signs=0;Fo.length=0;kv();Vv();Hv();let iu=null,su=null,ru=null,an=null,Vl=null;const Xt=[];Qv();function Pf(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Fe.remove(n))}function pr(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Fe.remove(n))}const _r=[],Sa=[];let au=null;function lM(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new nn(n);return t.colorSpace=Rt,t}function cM(n,e){if(Pi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of Ws)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function hM(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:vt}),t=new je(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let r=0,a=0;const o=new sn(t,i,Math.ceil(se.length/12*2)+8),c=new zt;for(const h of[-1,1]){const d=h*(se.width*.5+.55),f=[],p=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],u=x[M+1];f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.12,u.z,u.x,u.y+1.5,u.z),f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.5,u.z,g.x,g.y+1.5,g.z)}r++}};let m=[];for(let x=0;x<=se.length;x+=s){if(cM(x%se.length,h)){p(m),m=[];continue}const M=ft(x%se.length);if(m.push(M.p.clone().addScaledVector(M.side,d).addScaledVector(Jt,.58)),x%12===0){const g=m[m.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(a++,c.matrix)}}if(p(m),f.length){const x=new Zt;x.setAttribute("position",new bt(f,3)),x.computeVertexNormals(),n.add(new O(x,e))}}o.count=a,o.instanceMatrix.needsUpdate=!0,n.add(o),Ae.railRuns=r,Ae.railPosts=a}function dM(){_r.length=0,Sa.length=0;const n=new tt,e=new Ct({map:lM(),transparent:!0,depthWrite:!1,side:vt,blending:di,opacity:.9}),t=new Yt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][_r.length%3]*se.width,d=ft(c),f=new O(t,e),p=new L().crossVectors(d.side,d.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new wt().makeBasis(d.side,p,new L().crossVectors(d.side,p).normalize());f.quaternion.setFromRotationMatrix(m),f.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(p,.84),n.add(f),_r.push({s:c,lat:h})}const i=new $t(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),r=Math.max(60,Math.round(se.length/24));{const c=new sn(i,s,r*2),h=new zt;let d=0;for(let f=0;f<r;f++){const p=f/r*se.length;if(Pi(p))continue;const m=ft(p);for(const x of[-1,1])h.position.copy(m.p).addScaledVector(m.side,x*(se.width*.5+.22)).addScaledVector(Jt,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const a=new je(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=ft(Math.max(6,c.start-22));for(const d of[-1,1]){const f=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new tt,m=new O(a,o),x=new O(new $t(.3,10,8),f);m.position.y=.75,x.position.y=1.65,p.add(m),p.add(x),p.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(Jt,.55),n.add(p),Sa.push(f)}}return hM(n),Fe.add(n),n}_n(new zt,n=>{if(!Sa.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Sa)t.emissiveIntensity=e});function La(n){return ms=me.clamp(n,0,ks.length-1),se=ks[ms],Kn.length=0,Ws.length=0,pr(iu),pr(su),pr(ru),pr(au),iu=jv(),su=eM(),ru=qv(),au=dM(),Ih(),qe.trackName.textContent=se.name,qe.courseName&&(qe.courseName.textContent=se.name),qe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ms)}),se.name}La(0);function uM(){Vl&&Fe.remove(Vl),Xt.length=0;const n=new tt,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Ct({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:vt,blending:di}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const r=i[s],a=pe(r.x,r.z)+4.2,o=new tt,c=new O(new gs(5.6,.22,12,52),e.clone());c.rotation.y=r.yaw,o.add(c);const h=new O(new dn(4.7,32),t.clone());h.rotation.y=r.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new O(new je(.11,.16,6.2,8),d);m.position.set(Math.cos(r.yaw)*p,-1.1,Math.sin(r.yaw)*p),o.add(m)}const f=new O(new $t(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,n.add(o),Xt.push({...r,y:a,radius:8.5,marker:o,collected:!1})}_n(n,s=>{for(let r=0;r<Xt.length;r++){const a=Xt[r],o=r===l.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Fe.add(n),Vl=n}uM();function fM(){const n=new tt,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,r=-1330+Math.random()*1620,a=15+Math.random()*12;if(Nn(s,r,a*2+14,a*2+14,10)||wn(s,r,a).clearance<-6||Xt.some(d=>Math.hypot(d.x-s,d.z-r)<a+26)||Vs.some(d=>Math.hypot(d.x-s,d.z-r)<d.rx+a+60)||rn.some(d=>Math.abs(d.x-s)<d.hw+a+2&&Math.abs(d.z-r)<d.hd+a+2)||ci.some(d=>{const f=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-r)<f+a+2})||vr.some(d=>Math.hypot(d.x-s,d.z-r)<(d.radius||4)+a+2))continue;const o=pe(s,r);if(Math.max(Math.abs(pe(s+a,r)-o),Math.abs(pe(s-a,r)-o),Math.abs(pe(s,r+a)-o),Math.abs(pe(s,r-a)-o))>1.7)continue;const c=new O(new Go(a*.96,a*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,r),c.renderOrder=-4,n.add(c);const h=new O(new dn(a,36),Mf(Math.max(1.2,a/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,r),h.renderOrder=-3,n.add(h),_f(s,r,a*.98),t++}Ae.ponds=t,Fe.add(n),Ih()}fM();const vn=Sf(3375807,15905331);vn.visible=!1,vn.scale.setScalar(1.06),Fe.add(vn);const Li=new L(0,0,0);let Wc=0,de=null;function pM(){const n=new tt,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),r=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),a=(h,d,f,p,m,x,M=0,g=0,u=0)=>{const y=new O(d,f);return y.name=h,y.position.set(p,m,x),y.rotation.set(M,g,u),n.add(y),y};a("cabin hull",new xe(2.5,2,4.4),e,0,2.1,-.4),a("cabin floor pan",new xe(2.6,.4,4.8),t,0,1.05,-.3),a("nose glass",new xe(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),a("left door glass",new xe(.1,1.1,2),i,-1.28,2.3,-.7),a("right door glass",new xe(.1,1.1,2),i,1.28,2.3,-.7),a("roof turbine housing",new xe(1.5,.8,2.4),t,0,3.4,-.2),a("exhaust stub",new je(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),a("tail boom",new xe(.55,.6,4.6),e,0,2.7,3.4,.02),a("tail fin",new xe(.14,1.5,1),e,0,3.4,5.5,0,0,0),a("tail plane",new xe(1.5,.12,.6),e,0,3,4.6),a("nose lamp",new xe(.5,.2,.12),r,0,1.6,-2.95);for(const h of[-1,1])a("skid rail",new xe(.16,.16,4.4),s,h*1.15,.32,-.4),a("skid strut front",new xe(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),a("skid strut rear",new xe(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);a("rotor hub",new je(.22,.28,.5,10),s,0,3.95,-.2);const o=new tt;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new tt;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function mM(){let n=null;for(let d=0;d<700&&!n;d++){const f=-520+Math.random()*1040,p=-1200+Math.random()*1500;if(Math.hypot(f-80,p-300)>(d<350?420:1200)||Nn(f,p,26,26,6))continue;const m=pe(f,p);Math.max(Math.abs(pe(f+11,p)-m),Math.abs(pe(f-11,p)-m),Math.abs(pe(f,p+11)-m),Math.abs(pe(f,p-11)-m))>.8||rn.some(x=>Math.abs(x.x-f)<x.hw+13&&Math.abs(x.z-p)<x.hd+13)||vr.some(x=>Math.hypot(x.x-f,x.z-p)<(x.radius||4)+13)||Vs.some(x=>Math.hypot(x.x-f,x.z-p)<x.rx+16)||Xt.some(x=>Math.hypot(x.x-f,x.z-p)<24)||wn(f,p,12).clearance<2||(n={x:f,z:p,y:m})}n||(n={x:150,z:330,y:pe(150,330)});const e=new tt,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new O(new je(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const r=s.getContext("2d");r.strokeStyle="#ffd45b",r.lineWidth=12,r.beginPath(),r.arc(128,128,104,0,Math.PI*2),r.stroke(),r.fillStyle="#ffd45b",r.font="900 150px Arial",r.textAlign="center",r.textBaseline="middle",r.fillText("H",128,136);const a=new nn(s);a.colorSpace=Rt;const o=new O(new dn(9.6,36),new Ct({map:a,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const f=d/8*Math.PI*2,p=new O(new $t(.22,8,6),c);p.position.set(n.x+Math.cos(f)*10.2,n.y+.34,n.z+Math.sin(f)*10.2),e.add(p)}Fe.add(e);const h=pM();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Fe.add(h.mesh),de={pad:n,pos:new L(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new L,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},de.mesh.quaternion.setFromAxisAngle(Jt,-de.yaw),Ae.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}mM();var bi=[],Lf=null;function xM(n,e){if(!bi)return 0;for(const t of bi){const i=n-t.x,s=e-t.z,r=i*t.fx+s*t.fz,a=-i*t.fz+s*t.fx;if(!(r<0||r>t.len||Math.abs(a)>t.w*.5))return Lf=t,r/t.len*t.h}return 0}function gM(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),r=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let a=0;a<700&&bi.length<6;a++){const o=n[bi.length%n.length],{len:c,h}=o,d=Math.random()<.5,f=Math.round((ut.x1-ut.x0)/ut.pitch),p=(d?ut.x0:ut.zFar)+(Math.random()*(d?f:Math.round((ut.zNear-ut.zFar)/ut.pitch))|0)*ut.pitch,m=(Math.random()<.5?-1:1)*(ut.streetW*.5+10+Math.random()*9),x=d?ut.zFar+120+Math.random()*(ut.zNear-ut.zFar-240):ut.x0+120+Math.random()*(ut.x1-ut.x0-240),M=d?p+m:x,g=d?x:p+m,u=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(u),v=-Math.cos(u),_=M+y*c,E=g+v*c;if(Nn(M,g,e+4,e+4,2)||Nn(_,E,e+4,e+4,2)||wn(M,g,8).clearance<11||wn(_,E,8).clearance<11||gr(M,g).depth>0||gr(_,E).depth>0||gr(_+y*40,E+v*40).depth>0||Math.abs(pe(M,g)-pe(_,E))>1.1||bi.some(w=>Math.hypot(w.x-M,w.z-g)<150))continue;const T=(w,b,P,I)=>w.some(V=>Math.abs(b-V.x)<(V.hw??V.radius??0)+I&&Math.abs(P-V.z)<(V.hd??V.radius??0)+I);let A=!1;for(const[w,b,P]of[[M-y*45,g-v*45,6],[M-y*22,g-v*22,6],[M,g,7],[_,E,7],[_+y*45,E+v*45,9],[_+y*95,E+v*95,9]])if(T(rn,w,b,P)||T(ci,w,b,P)){A=!0;break}if(A)continue;const R={x:M,z:g,yaw:u,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const w=pe(M,g)+h+13;R.hoop={x:_+y*28,y:w,z:E+v*28,r:7}}bi.push(R)}for(const a of bi){const o=new W({color:a.rail,roughness:.4,emissive:a.rail,emissiveIntensity:1.6});if(a.hoop){const R=new O(new gs(a.hoop.r,.5,10,30),r);R.position.set(a.hoop.x,a.hoop.y,a.hoop.z),R.lookAt(a.hoop.x+a.fx,a.hoop.y,a.hoop.z+a.fz),Fe.add(R)}const c=pe(a.x,a.z)+.05,h=-a.fz,d=a.fx,f=a.w*.5,p=[a.x-h*f,c,a.z-d*f],m=[a.x+h*f,c,a.z+d*f],x=[a.x+a.fx*a.len-h*f,c,a.z+a.fz*a.len-d*f],M=[a.x+a.fx*a.len+h*f,c,a.z+a.fz*a.len+d*f],g=[x[0],c+a.h,x[2]],u=[M[0],c+a.h,M[2]],y=[...p,...m,...u,...p,...u,...g,...x,...M,...u,...x,...u,...g,...p,...g,...x,...m,...M,...u],v=new Zt;v.setAttribute("position",new bt(y,3)),v.computeVertexNormals();const _=new O(v,i);_.castShadow=!1,_.receiveShadow=!0,Fe.add(_);const E=Math.hypot(a.len,a.h),T=new xe(.26,.24,E),A=new O(new xe(1.1,.1,E*.94),s);A.position.set(a.x+a.fx*a.len/2,c+a.h/2+.08,a.z+a.fz*a.len/2),A.lookAt(a.x+a.fx*a.len,c+a.h+.08,a.z+a.fz*a.len),Fe.add(A);for(const R of[-1,1]){const w=new O(T,o),b=a.x+h*f*R,P=a.z+d*f*R,I=a.x+a.fx*a.len+h*f*R,V=a.z+a.fz*a.len+d*f*R;w.position.set((b+I)/2,c+a.h/2+.12,(P+V)/2),w.lookAt(I,c+a.h+.12,V),Fe.add(w);const j=new O(new $t(.34,10,8),t);j.position.set(I,c+a.h+.55,V),Fe.add(j)}}Ae.stuntRamps=bi.length}gM();function vM(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];Ae.propPlanes=0;for(const e of n){const t=new tt,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),r=new O(new je(.85,1.15,7.2,10),i);r.rotation.x=Math.PI/2,t.add(r);const a=new O(new Si(1.16,2.1,10),i);a.rotation.x=-Math.PI/2,a.position.z=-4.6,t.add(a);const o=new O(new $t(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new O(new xe(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new O(new xe(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new O(new xe(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const f=new tt,p=new xe(.26,5.4,.12),m=new O(p,s),x=new O(p,s);x.rotation.z=Math.PI/2,f.add(m),f.add(x),f.position.z=-5.75,t.add(f),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Fe.add(t);const M=Math.random()*Math.PI*2;_n(t,(g,u)=>{t.position.x+=e.dir*e.speed*u,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+M)*5,t.rotation.z=Math.sin(g*.22+M)*.14,f.rotation.z+=u*38}),Ae.propPlanes++}}vM();const kt={cars:[],evadeT:0,nearest:1/0},Df=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),If=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function Jo(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),kt.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function MM(){const n=Ph("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new O(new xe(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new O(new xe(.62,.24,.46),Df),s=new O(new xe(.62,.24,.46),If);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(r=>(r.castShadow=!1,r.receiveShadow=!0)),n}function ou(n,e){return rn.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||gr(n,e).depth>.35}function _M(){const n=Math.random()*Math.PI*2,e=me.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=me.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=MM();Fe.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return kt.cars.push(s),Zi("whoosh",.2,.8,.1),s}function Uf(n){Pf(n.mesh),kt.cars=kt.cars.filter(e=>e!==n)}function Ff(){for(const n of[...kt.cars])Uf(n);kt.evadeT=0,kt.nearest=1/0,l.heat=0}function yM(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),r=l.heat||0;let a=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(ou(n.x+o*17,n.z+c*17)){const f=n.yaw-.7,p=n.yaw+.7;a=!ou(n.x+Math.sin(f)*17,n.z-Math.cos(f)*17)?f:p}const h=Math.atan2(Math.sin(a-n.yaw),Math.cos(a-n.yaw));n.yaw+=me.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+r*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=me.clamp(n.x,-800,800),n.z=me.clamp(n.z,-1600,460),n.mesh.position.set(n.x,pe(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const f of n.mesh.userData.wheels||[])f.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?(Hf(new L(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,Jo(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}_n(new zt,(n,e)=>{const t=Math.floor(n*3.4)%2;if(Df.emissiveIntensity=t?2.6:.35,If.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){kt.cars.length&&Ff();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;kt.cars.length<s;)_M();for(;kt.cars.length>s;)Uf(kt.cars[kt.cars.length-1]);let r=1/0;for(const a of[...kt.cars])r=Math.min(r,yM(a,e));kt.nearest=r,i>0&&(r>240?(kt.evadeT+=e,kt.evadeT>9&&(l.heat=Math.max(0,i-1),kt.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,qi("+500 ESCAPED THE LAW"),ei(980,.22),l.message="You lost them",l.messageTimer=1.4))):kt.evadeT=Math.max(0,kt.evadeT-e*.6)),Ae.police=kt.cars.length});_n(new zt,(n,e)=>{if(!de)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;de.rpm+=(t-de.rpm)*Math.min(1,e*(t?1.4:.5)),de.rotor.rotation.y+=de.rpm*26*e,de.tailRotor.rotation.x+=de.rpm*42*e});const bM=new Ct({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),So=Array.from({length:42},()=>{const n=new O(new $t(.14,6,5),bM);return n.visible=!1,Fe.add(n),{mesh:n,life:0,velocity:new L}}),SM=new Ct({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:vt}),Xc=Array.from({length:14},()=>{const n=new O(new Go(.82,1,28),SM.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Fe.add(n),{mesh:n,life:0,maxLife:1}});function Nf(n,e,t=1){const i=Xc.find(s=>s.life<=0)||Xc[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,pe(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function wM(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=So.find(r=>r.life<=0)||So[i%So.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}Nf(n.x,n.z,1.6)}_n(new zt,(n,e)=>{for(const t of So)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of Xc)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const Ir=new vv(Qt);Ir.addPass(new Mv(Fe,Ne));const zf=new Cr(new De(window.innerWidth,window.innerHeight),.4,.72,.86);Ir.addPass(zf);Ir.addPass(new _v);const TM={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},jr=new df(TM);Ir.addPass(jr);const EM=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),sa=Array.from({length:72},()=>{const n=new O(new $t(.1,8,5),EM);return n.visible=!1,Fe.add(n),{mesh:n,life:0,velocity:new L}}),AM=new Ct({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:vt}),ra=Array.from({length:90},()=>{const n=new O(new dn(1,18),AM.clone());return n.visible=!1,Fe.add(n),{mesh:n,life:0,maxLife:1,velocity:new L,spin:0}}),CM=new W({color:2962232,roughness:.58,metalness:.34}),aa=Array.from({length:48},()=>{const n=new O(new xe(.18,.08,.26),CM);return n.visible=!1,Fe.add(n),{mesh:n,life:0,velocity:new L,spin:new L}});let ze=null;function Of(){if(ze)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),r=new Float32Array(1024);for(let A=0;A<1024;A++){const R=(A/511.5-1)*1.6;r[A]=4*R/(1+3*Math.abs(R))}s.curve=r,s.oversample="2x",s.connect(t);const a=n.createGain();a.gain.value=1,a.connect(s);const o=(A,R,w)=>{const b=n.createOscillator(),P=n.createGain();return b.type=A,P.gain.value=R,b.connect(P),P.connect(w),b.start(),{o:b,g:P}},c=o("sine",.5,t),h=o("sawtooth",.3,a),d=o("sawtooth",.3,a),f=o("triangle",.03,t),p=n.createOscillator(),m=n.createGain();p.type="sine",p.frequency.value=12,m.gain.value=0,p.connect(m),m.connect(a.gain),p.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),M=x.getChannelData(0);for(let A=0;A<M.length;A++)M[A]=Math.random()*2-1;const g=(A,R,w,b)=>{const P=n.createBufferSource(),I=n.createBiquadFilter(),V=n.createGain();return P.buffer=x,P.loop=!0,P.playbackRate.value=b,I.type=A,I.frequency.value=R,I.Q.value=w,V.gain.value=1e-4,P.connect(I),I.connect(V),V.connect(e),P.start(),{filter:I,gain:V}},u=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),_=n.createGain();_.gain.value=1e-4,_.connect(e);const E=n.createOscillator(),T=n.createGain();E.type="triangle",E.frequency.value=660,T.gain.value=1e-4,E.connect(T),T.connect(e),E.start(),ze={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:f,burble:{o:p,depth:m},siren:{o:E,g:T},wind:u,skid:y,boost:v,musicGain:_,nextNote:0,beat:0,prevBoost:!1}}const Bf={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},RM=["interceptor","bullet","brawler","zephyr"];function kf(){return l.mode==="roam"&&l.drivingStolen&&ht?Bf[ht.type]?ht.type:"compact":RM[Yi]||"interceptor"}function vs(){ze||Of(),ze?.ctx.state==="suspended"&&ze.ctx.resume().catch(()=>{}),UM()}function oa(n){if(!ze)return;const{ctx:e}=ze,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(ze.master),t.start(),t.stop(e.currentTime+.24)}function PM(){if(!ze||Zi("whoosh",.4,1,.1))return;const{ctx:n}=ze,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(ze.master),e.start(),e.stop(n.currentTime+.6)}function LM(){if(!ze||Zi("splat",.6,1,.14))return;const n=ze.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Vf(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(ze.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),r=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),r.gain.setValueAtTime(.22,n.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(r).connect(ze.master),s.start(),s.stop(n.currentTime+.26)}let Gl=null;function Vf(){if(Gl)return Gl;const n=ze.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return Gl=e}function DM(n=1){if(!ze||Zi("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=ze,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Vf(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(ze.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Wn={buffers:{},loops:{},loading:!1},IM=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function UM(){if(!(Wn.loading||!ze)){Wn.loading=!0;for(const n of IM)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>ze.ctx.decodeAudioData(e)).then(e=>Wn.buffers[n]=e).catch(()=>{})}}function Zi(n,e=.5,t=1,i=.06){const s=ze&&Wn.buffers[n];if(!s)return!1;const r=ze.ctx,a=r.createBufferSource(),o=r.createGain();return a.buffer=s,a.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,a.connect(o).connect(ze.master),a.start(),!0}function Hl(n,e,t=1e-4){if(Wn.loops[n])return Wn.loops[n];if(!ze||!Wn.buffers[n])return null;const i=ze.ctx,s=i.createBufferSource(),r=i.createGain();return s.buffer=Wn.buffers[n],s.loop=!0,r.gain.value=t,s.connect(r),r.connect(e||ze.master),s.start(),Wn.loops[n]={src:s,gain:r}}const lu={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function cu(n,e,t,i,s,r){const{ctx:a}=ze,o=a.createOscillator(),c=a.createBiquadFilter(),h=a.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=r,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(ze.musicGain),o.start(e),o.stop(e+t+.05)}function FM(){const{ctx:n}=ze,e=60/92/2;for(ze.nextNote<n.currentTime-1&&(ze.nextNote=n.currentTime+.08);ze.nextNote<n.currentTime+.35;){const t=ze.beat%32,i=t/8|0;t%4===0&&cu(lu.bass[i],ze.nextNote,.5,"triangle",.5,420),cu(lu.arps[i][t%4],ze.nextNote,.19,"sawtooth",.16,1300),ze.nextNote+=e,ze.beat++}}function yr(n,e=18){const t=Math.min(e,sa.length);for(let i=0;i<t;i++){const s=sa.find(r=>r.life<=0)||sa[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Gf(n,e=10,t=1){const i=Math.min(e,ra.length);for(let s=0;s<i;s++){const r=ra.find(a=>a.life<=0)||ra[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new L((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function NM(n,e=8,t=1){const i=Math.min(e,aa.length);for(let s=0;s<i;s++){const r=aa.find(a=>a.life<=0)||aa[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new L((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function Hf(n,e=Math.abs(l.speed),t="CRASH"){const i=me.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=me.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),yr(n,Math.round(10+i*24)),Gf(n,Math.round(5+i*12),i),NM(n,Math.round(3+i*8),i),Zi("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||oa(18+i*34)}function zM(n){for(const e of sa){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of ra){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Ne.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of aa)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function OM(){if(!ze)return;const{ctx:n}=ze,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,r=me.clamp((s-900)/6600,0,1),a=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=Bf[kf()],h=i?26+(de?.rpm||0)*14:(38+r*124)*c.fMul;ze.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),ze.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),ze.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),ze.whine.o.frequency.setTargetAtTime(i?620+a*4:h*c.whineMul,e,.03),ze.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),ze.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),ze.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),ze.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+r*r*r*.85)*2,e,.08),ze.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),ze.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-r*.8),e,.1),ze.filter.frequency.setTargetAtTime((380+r*2300+a*5)*c.cutoff*(1-.6*o),e,.06),ze.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+r*.055:1e-4)*(1-.42*o),e,.07),ze.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(a-55)/850)):1e-4,e,.15),ze.wind.filter.frequency.setTargetAtTime(700+a*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,f=Hl("skid");ze.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(f?.05:.15):1e-4,e,.09),f&&f.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const p=Hl("rotor");p&&(p.gain.gain.setTargetAtTime(i?.06+(de?.rpm||0)*.3:1e-4,e,i?.3:.15),p.src.playbackRate.setTargetAtTime(.65+(i&&de?.rpm||0)*.5,e,.4)),l.boosting&&!ze.prevBoost&&PM(),ze.prevBoost=!!l.boosting,ze.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),ze.boost.filter.frequency.setTargetAtTime(l.boosting?420+a*3:260,e,.1);const m=l.mode==="roam"&&(l.heat||0)>0&&kt.nearest<460,x=m?Math.min(.06,(460-kt.nearest)/460*.075):1e-4;ze.siren.g.gain.setTargetAtTime(x,e,.25),ze.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const M=localStorage.getItem("steel-ribbon-music")!=="0",g=M?Hl("music",ze.musicGain,1):Wn.loops.music||null;ze.musicGain.gain.setTargetAtTime(M?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),M&&!g&&FM()}function wa(n=!1,e=!1,t=!1){Of(),vs(),Je.clear(),Aa(),Jf();const i=n||e;l.seasonRace=t&&!i;for(let r=0;r<kn.length;r++){const a=kn[r];a.distance=i?-900:-26-r*7,a.finished=0,a.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=ft(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],o_(),l_(),qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.resultStats.innerHTML="",qe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",qe.trackName.textContent=se.name,Vt.visible=!1,an&&(an.visible=!0),document.body.classList.remove("roam-mode"),Ki(),window.__freeCam=!1}function No(){vs(),l.mode="roam",l.practice=!0,l.freeRun=!1,Je.clear(),Aa();let n=80,e=338;wn(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,pe(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Le.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",vn.visible=!1,Jf(),Ff(),de&&(de.pos.set(de.pad.x,de.pad.y+.24,de.pad.z),de.vel.set(0,0,0),de.mesh.position.copy(de.pos));for(const s of Xt)s.collected=!1;l.message="",l.messageTimer=0,Ko(!1),Vt.visible=!0,an&&(an.visible=!1),document.body.classList.add("roam-mode"),Ki(),window.__freeCam=!1,qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",mi();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);Ne.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),Kc(),Ne.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),Ne.fov=69,Ne.updateProjectionMatrix()}function mi(){const n=$f();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(Jt,-l.roamYaw),n.rotateZ(-l.wheelSteer*me.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:me.clamp(-l.roamVy*.014,-.3,.34):me.clamp(l.roamSuspension,-.16,.22))}function Wf(n,e){let t=null;for(const s of Ws)for(const r of s.segments){const a=n-r.a.x,o=e-r.a.z,c=me.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),h=r.a.x+r.abx*c,d=r.a.z+r.abz*c,f=Math.hypot(n-h,e-d);if(f>s.halfW+En*1.15)continue;const p=me.lerp(r.a.y,r.b.y,c),m=me.lerp(r.u0,r.u1,c),x=f+Math.max(0,pe(n,e)-p)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function Xf(n,e,t=pe(n,e),i=!1){let s=null;const r=10;for(let o=0;o<se.length;o+=r){if(Pi(o+r*.5))continue;const c=ft(o),h=ft(o+r),d=h.p.x-c.p.x,f=h.p.z-c.p.z,p=Math.max(1e-4,d*d+f*f),m=me.clamp(((n-c.p.x)*d+(e-c.p.z)*f)/p,0,1),x=c.p.x+d*m,M=c.p.z+f*m,g=n-x,u=e-M,y=Math.hypot(g,u);if(y>se.width*.5+En*.45)continue;const v=me.lerp(c.p.y,h.p.y,m)+.58;if(!i&&t<v-5)continue;const _=new L(f,0,-d).normalize(),E=me.clamp(g*_.x+u*_.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+r*m,lateral:E,tangentX:d,tangentZ:f,dist:y})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function Us(n,e,t=l.roamPos.y){const i=pe(n,e),s=xM(n,e);let r=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const a=Wf(n,e);a&&a.y>=i-1.2&&(r=a);const o=Xf(n,e,Math.max(t,r.y));return!(r.kind==="ramp"&&r.rampType==="off")&&o&&o.y>=r.y-.8&&(r=o),r}function hu(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=ft(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=me.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=me.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),Ko(!1),Vt.visible=!1,an&&(an.visible=!0),document.body.classList.remove("roam-mode"),Ki(),qe.position.textContent="FREE RUN",qe.trackName.textContent=se.name,mi(),!0}function BM(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,r=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+Bn,t.z+r*3.5),l.roamYaw=Math.atan2(s,-r),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=me.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),Ko(!1),Vt.visible=!0,an&&(an.visible=!1),document.body.classList.add("roam-mode"),Ki(),l.vehicle="car",vn.visible=!1,qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",mi();const a=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-a*17,l.roamPos.y+7.2,l.roamPos.z-o*17),Ne.lookAt(l.roamPos.x+a*13,l.roamPos.y+2.45,l.roamPos.z+o*13),Ne.fov=69,Ne.updateProjectionMatrix(),yr(l.roamPos.clone().add(new L(0,.6,0)),10),!0}function kM(){const n=Yo.set(0,0,-1).applyQuaternion(Ne.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),heat:+(l.heat||0).toFixed(2),police:kt.cars.length,policeNearest:kt.nearest===1/0?null:+kt.nearest.toFixed(1),stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:Ae.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&ht?.type||null,altitude:+(l.roamPos.y-pe(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Le.steer,throttle:Le.throttle,brake:Le.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var zs=document.createElement("canvas");zs.id="minimap",zs.width=256,zs.height=256;document.querySelector("#app")?.appendChild(zs);var qc=null,VM=0,Fs={cx:0,cz:-570,span:2180};function Tn(n,e,t){return[((n-Fs.cx)/Fs.span+.5)*t,((e-Fs.cz)/Fs.span+.5)*t]}function Ih(){if(!Fs)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=ut.x0;s<=ut.x1+1;s+=ut.pitch){const[r,a]=Tn(s,ut.zNear,n),[o,c]=Tn(s,ut.zFar,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,c),t.stroke()}for(let s=ut.zNear;s>=ut.zFar-1;s-=ut.pitch){const[r,a]=Tn(ut.x0,s,n),[o,c]=Tn(ut.x1,s,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Zo())if(s.courseIndex===ms){const[r,a]=Tn(s.x,s.z,n);i?t.moveTo(r,a):t.lineTo(r,a),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of Vs){const[r,a]=Tn(s.x,s.z,n);t.beginPath(),t.ellipse(r,a,Math.max(3,s.rx/Fs.span*n),Math.max(3,s.rz/Fs.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of bi||[]){const[r,a]=Tn(s.x,s.z,n);t.save(),t.translate(r,a),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}qc=e}function GM(){const n=l.mode==="roam";if((zs.style.display=n?"block":"none")&&!n||!n||!qc||VM++%2)return;const e=zs.width,t=zs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(qc,0,0,e,e);for(const r of Ws)if(r.rampType==="on"&&r.points?.length){const a=r.points[0],[o,c]=Tn(a.x,a.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let r=0;r<Xt.length;r++){const a=Xt[r],[o,c]=Tn(a.x,a.z,e),h=r===l.objectiveIndex%Xt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(Uo*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const r of Fn){const[a,o]=Tn(r.x,r.z,e);t.fillRect(a-1.4,o-1.4,2.8,2.8)}if(de){const[r,a]=Tn(de.pad.x,de.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",r,a+4),l.vehicle!=="heli"){const[o,c]=Tn(de.pos.x,de.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[r,a]=Tn(Li.x,Li.z,e);t.fillStyle="#7dc4ff",t.fillRect(r-2.4,a-2.4,4.8,4.8)}if(ht?.parked){const[r,a]=Tn(ht.parked.x,ht.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(r-2.2,a-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const r of kt.cars){const[a,o]=Tn(r.x,r.z,e);t.beginPath(),t.arc(a,o,3.2,0,Math.PI*2),t.fill()}const[i,s]=Tn(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}Ih();let _i=null;function HM(){_i||(_i=new O(new je(2.4,3.2,620,12,1,!0),new Ct({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:di,side:vt,fog:!1})),_i.renderOrder=5,Fe.add(_i));const n=l.mode==="roam"&&Xt.length>0;if(_i.visible=n,!n)return;const e=Xt[l.objectiveIndex%Xt.length];_i.position.set(e.x,e.y+296,e.z),_i.material.opacity=.1+Math.sin(Uo*3.1)*.04}let rs=null;function Uh(){if(l.mode!=="roam"||Xt.length===0){rs=null;return}const n=Xt[l.objectiveIndex%Xt.length];if(!n)return;const e=rs?.x??l.roamPos.x,t=rs?.z??l.roamPos.z,i=rs?.y??l.roamPos.y,s=l.roamPos.x-e,r=l.roamPos.z-t,a=s*s+r*r;if(rs??={x:0,y:0,z:0},rs.x=l.roamPos.x,rs.y=l.roamPos.y,rs.z=l.roamPos.z,a>4e4)return;const o=a>1e-6?me.clamp(((n.x-e)*s+(n.z-t)*r)/a,0,1):0,c=e+s*o-n.x,h=t+r*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),f=n.radius+1.2;c*c+h*h>f*f||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%Xt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,qi(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),ei(880,.16),setTimeout(()=>ei(1245,.2),90),yr(new L(n.x,n.y,n.z),18))}function qf(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Le.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Le.brake),s=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Le.steer,-1,1)*pf,r=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const _=l.speed<0?38:0;l.speed+=((r?70:42)*us().accel+_)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=me.clamp(l.speed,-24,135*us().top),l.boosting=r,r?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*us().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n));const a=-l.wheelSteer*.55,o=$f().userData.frontWheels;if(o&&(o[0].rotation.y=a,o[1].rotation.y=a),l.drivingStolen&&ht)for(const _ of ht.mesh.userData.wheels||[])_.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=Je.has("Space")&&!l.roamAir;if(c>Vc){const _=me.clamp((c-Vc)/5,0,1),E=1-.36*me.clamp((c-34)/85,0,1),T=Sv*1.08*_*E*(h?1.85:1)*us().grip;l.roamYaw+=l.wheelSteer*T*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=me.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),f=Math.sin(d),p=-Math.cos(d),m=(l.speed-e)/Math.max(.001,n),x=me.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-m-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(m)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const _=new L(l.roamPos.x-f*3.2,l.roamPos.y+.2,l.roamPos.z-p*3.2);Gf(_,2,l.roamSlip)}const M=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let u=!1,y=!1,v=Us(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let _=0;_<g;_++)l.roamPos.x+=f*l.speed*n/g,l.roamPos.z+=p*l.speed*n/g,v=Us(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Bn),t_(l.roamPos,v)&&(y=!0),n0(l.roamPos,v)&&(u=!0),v=Us(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Bn);l.roamPos.x=me.clamp(l.roamPos.x,-820,820),l.roamPos.z=me.clamp(l.roamPos.z,-1620,480),u&&(l.collisionCooldown<=0&&(Hf(new L(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,Jo(.6)),e0(n,e),ZM(n,h,u),JM(n,u),v=Us(l.roamPos.x,l.roamPos.z,l.roamPos.y),KM(n,v),!(v.kind==="ramp"&&v.u>.72&&hu(v))&&(v.kind==="track"&&hu(v)||(Uh(),mi(),Je.has("KeyR")&&(No(),Je.delete("KeyR"))))}const du={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let ht=null;const Yf=[];function $f(){return l.drivingStolen&&ht?ht.mesh:Vt}function Zf(){if(ht){if(ht.actor){const n=ht.actor.collider,e=ht.mesh.position;n.x=e.x,n.z=e.z}Yf.push(ht),ht=null}}function WM(n){Zf(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Fe.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return ht={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,pe(n.mesh.position.x,n.mesh.position.z)+Bn,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,vn.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,Jo(1),Zi("jack",.5,1,.08)||ei(340,.18,"square",.1),mi(),!0}function XM(n){if(Zf(),n.taken=!0,n.savedM=new wt,Mn.im){const t=new wt().makeScale(1e-4,1e-4,1e-4);Mn.im.getMatrixAt(n.idx,n.savedM),Mn.im.setMatrixAt(n.idx,t),Mn.imW.setMatrixAt(n.idx,t),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0}const e=Ph("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Fe.add(e),ht={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,pe(n.x,n.z)+Bn,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,vn.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,Jo(.7),Zi("jack",.45,1.05,.08)||ei(300,.16,"square",.09),mi(),!0}function qM(){ht.parked=l.roamPos.clone(),ht.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=pe(l.roamPos.x,l.roamPos.z)+.05,vn.visible=!0,!0}function uu(){return!ht?.parked||l.roamPos.distanceTo(ht.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(ht.parked),l.roamYaw=ht.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,ht.parked=null,vn.visible=!1,mi(),!0)}function Kf(){for(const n of Fn){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return WM(e)}for(const n of Mn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return XM(n);return!1}function fu(n){if(n.actor)n.actor.stolen=!1;else{Pf(n.mesh);const e=n.spotRef;e?.savedM&&Mn.im&&(Mn.im.setMatrixAt(e.idx,e.savedM),Mn.imW.setMatrixAt(e.idx,e.savedM),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function Jf(){ht&&(fu(ht),ht=null),Yf.splice(0).forEach(fu),l.drivingStolen=!1}function Yc(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&ht)return l.roamAir=!1,l.roamVy=0,qM(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;Li.copy(l.roamPos),Wc=l.roamYaw,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=pe(l.roamPos.x,l.roamPos.z)+.05,vn.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function $c(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Li)>7?!1:(l.vehicle="car",l.roamPos.copy(Li),l.roamYaw=Wc,l.camYaw=Wc,l.speed=0,vn.visible=!1,mi(),!0)}function jf(){return l.vehicle!=="foot"||!de||l.roamPos.distanceTo(de.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(de.pos),l.roamYaw=de.yaw,l.camYaw=de.yaw,l.speed=0,de.vel.set(0,0,0),vn.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function Zc(){if(l.vehicle!=="heli"||!de)return!1;const n=pe(de.pos.x,de.pos.z);return de.pos.y-n>5.2||de.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",l.roamPos.x=de.pos.x+Math.cos(de.yaw)*-5.6,l.roamPos.z=de.pos.z+Math.sin(de.yaw)*-5.6,l.roamPos.y=pe(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,vn.visible=!0,!0)}function Qf(){l.mode==="roam"&&(l.vehicle==="car"?Yc()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(Li)<=(ht?.parked?l.roamPos.distanceTo(ht.parked):1/0)?$c()||uu():uu()||$c())||jf()||Kf():Zc())}function YM(n){const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Le.throttle),t=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Le.brake),i=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Le.steer,-1,1),s=Je.has("ShiftLeft")||Je.has("ShiftRight"),r=l.speed,a=(e-t)*(s?14.5:6.4);l.speed+=(a-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,n0(l.roamPos,{kind:"ground"}),l.roamPos.x=me.clamp(l.roamPos.x,-820,820),l.roamPos.z=me.clamp(l.roamPos.z,-1620,480),l.roamPos.y=pe(l.roamPos.x,l.roamPos.z)+.05,e0(n,r),Uh(),vn.position.copy(l.roamPos),vn.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*me.clamp(Math.abs(l.speed)/5,0,1);for(const p of vn.userData.limbs||[])p.mesh.rotation.x=h*p.amp*p.side*2.2,p.mesh.position.y=p.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Li)<7,f=de&&l.roamPos.distanceTo(de.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):f&&(l.message="E — enter helicopter",l.messageTimer=.2))}function $M(n){if(!de)return;const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Le.throttle)-Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Le.brake),t=me.clamp((Je.has("KeyA")||Je.has("ArrowLeft")?1:0)-(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-Le.steer,-1,1),i=de.rpm>.55,s=Je.has("ShiftLeft")||Je.has("ShiftRight"),r=qo?s?1:de.pos.y-pe(de.pos.x,de.pos.z)>6?-.45:0:Je.has("Space")?1:s?-1:0;de.yaw-=t*1.5*n*(i?1:.2);const a=Math.sin(de.yaw),o=-Math.cos(de.yaw);i&&(de.vel.x+=a*e*30*n,de.vel.z+=o*e*30*n,de.vel.y+=r*24*n,r===0&&(de.vel.y-=de.vel.y*1.6*n)),de.vel.x-=de.vel.x*.85*n,de.vel.z-=de.vel.z*.85*n,de.vel.y-=de.vel.y*1.1*n,de.pos.addScaledVector(de.vel,n);const c=pe(de.pos.x,de.pos.z);de.pos.x=me.clamp(de.pos.x,-1500,1500),de.pos.z=me.clamp(de.pos.z,-1900,700),de.pos.y=Math.min(de.pos.y,300),de.pos.y<c+1.1&&(de.pos.y=c+1.1,de.vel.y=Math.max(0,de.vel.y)),(la(de.pos,rn)||la(de.pos,ci))&&(de.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=de.pos.x,l.roamPos.y=de.pos.y,l.roamPos.z=de.pos.z,l.roamYaw=de.yaw,l.speed=Math.hypot(de.vel.x,de.vel.z),de.mesh.position.copy(de.pos),de.mesh.quaternion.setFromAxisAngle(Jt,-de.yaw),de.mesh.rotateX(me.clamp((de.vel.x*a+de.vel.z*o)*.008,-.24,.24)),de.mesh.rotateZ(me.clamp(t*.14,-.2,.2)),Uh()}function ZM(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),r=Math.round(l.driftAcc*s);l.score+=r,qi(s>1?`+${r} DRIFT ×${s}`:`+${r} DRIFT`),ei(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function KM(n,e){const t=e.y+Bn,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=Lf),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,Zi("whoosh",.38,1.2,.08))):(l.roamVy=me.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const r=l.stuntRamp?.hoop;r&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-r.x,l.roamPos.y-r.y,l.roamPos.z-r.z)<r.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,ei(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),Zi("land",Math.min(.62,s/42),1,.1)||oa(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const r=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),a=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+r*140;a&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[a&&"BACKFLIP",r>0&&`ROLL ×${r}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,Ae.stunts=(Ae.stunts||0)+1,qi(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),ei(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const r=Math.round(40+l.roamAirT*70);l.score+=r,qi(`+${r} AIR`),ei(760,.14)}}}l.roamPrevY=l.roamPos.y}const En=2.6;function e0(n,e){const t=l.waterDepth||0;if(l.roamPos.y>pe(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=gr(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(wM(l.roamPos.clone(),Math.abs(e)),DM(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,Nf(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function JM(n,e){for(const t of Fn)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of Fn){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,r=l.roamPos.z-t.z,a=(t.hw+t.hd)*.5+En+2.4;if(s*s+r*r<a*a&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,qi("+45 NEAR MISS"),ei(520,.12,"square",.07);break}}}function la(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Bn+.45)continue;if(s.radius){const f=s.radius+En,p=n.x-s.x,m=n.z-s.z,x=p*p+m*m;if(x>=f*f)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+p/M*f,n.z=s.z+m/M*f;continue}const r=s.hw+En,a=s.hd+En,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const h=r-Math.abs(o),d=a-Math.abs(c);h<d?n.x=s.x+(o<0?-r:r):n.z=s.z+(c<0?-a:a)}return t}function t0(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||ut.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,r=n.mesh?.position?.z??n.collider?.z??n.along,a=n.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;n.avoidOffset=me.clamp((n.avoidOffset||0)+a*i*.9,-i,i),t&&(Ae.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=a*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function jM(n){let e=!1;for(let t=0;t<Fn.length;t++){const i=Fn[t];if(i.maxY!=null&&n.y>i.maxY+Bn+.45)continue;const s=i.hw+En,r=i.hd+En,a=n.x-i.x,o=n.z-i.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,t0(i.actor,n);const c=s-Math.abs(a),h=r-Math.abs(o);c<h?n.x=i.x+(a<0?-s:s):n.z=i.z+(o<0?-r:r)}return e}function QM(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Bn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function e_(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,Ae.splats++,LM();const e=Mr.find(t=>!t.visible)||Mr[Ae.splats%Math.max(1,Mr.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,pe(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function t_(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of ba){if(!i.active)continue;const s=n.x-i.x,r=n.z-i.z,a=En+i.hitRadius;s*s+r*r>a*a||Math.abs(n.y-(pe(i.x,i.z)+Bn))>3.2||(e_(i),t=!0)}return t}function n0(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=la(n,rn),r=e?.kind==="ground"?la(n,Kn):!1,a=la(n,ci),o=e?.kind==="ground"?jM(n):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function i0(n){const e=Le.lookX*1.18,t=Le.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Le.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function Fh(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const r=s/10,a=me.lerp(n.x,e.x,r),o=me.lerp(n.z,e.z,r),c=me.lerp(n.y,e.y,r),h=pe(a,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,r)))}return i}function n_(n,e){const t=pe(n,e);let i=null;const s=Wf(n,e);s&&s.y>t+4&&(i=s);const r=Xf(n,e,1e3,!0);return r&&r.y>t+4&&(!i||r.y>i.y)&&(i=r),i}function zo(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const r=s/14,a=me.lerp(n.x,e.x,r),o=me.lerp(n.z,e.z,r),c=me.lerp(n.y,e.y,r),h=n_(a,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,r)))}return Math.min(54,i)}function Kc(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=me.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,r={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};Ne.position.y+=Fh(r,Ne.position,3.4),Ne.position.y+=zo(r,Ne.position,4.2)}function s0(n){if(window.__freeCam)return;if(i0(n),Math.abs(l.speed)>Vc){let x=l.roamYaw-l.camYaw;x=Math.atan2(Math.sin(x),Math.cos(x)),l.camYaw+=x*(1-Math.pow(.08,n))}const e=l.camYaw+l.camLookYaw,t=Math.sin(e),i=-Math.cos(e),s=l.roamPos,r=me.clamp(l.cameraZoom,-.42,.9),a=me.clamp(Math.abs(l.speed)/135,0,1),o=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},c=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*o.d,h=(7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*o.h,d=ff.set(s.x-t*c,s.y+h,s.z-i*c);if(l.cameraShake>.01||l.collisionDrama>.01){const x=l.cameraShake+l.collisionDrama*.42;d.x+=(Math.random()-.5)*x*1.2,d.y+=(Math.random()-.5)*x*.75,d.z+=(Math.random()-.5)*x*1.2}const f=Yo.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+l.camLookPitch*13.5,s.z+i*(13+a*8-Math.min(r,0)*6));d.y=Math.max(d.y,pe(d.x,d.z)+3.5),d.y+=Fh(f,d,3.4),d.y+=zo(f,d,4.2);const p=l.roamSlip>.35?.006:.0026;Ne.position.lerp(d,1-Math.pow(p,n)),Ne.position.y+=zo(f,Ne.position,3.8)*.72,xn.position.copy(Ne.position),xn.lookAt(f),xn.rotateY(Math.PI),xn.rotateZ(-l.wheelSteer*a*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),Ne.quaternion.slerp(xn.quaternion,1-Math.pow(.05,n));const m=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(Ne.fov-m)>.02&&(Ne.fov+=(m-Ne.fov)*(1-Math.pow(.01,n)),Ne.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function i_(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),qe.best.textContent=`Best score ${l.best}`,qe.resultText.textContent=`${n} Score ${t}. Time ${Oo(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?Oo(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Nt?.active&&e){[{key:"you",metric:l.totalDistance+.001},...kn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Nt.points[c.key]+=aM[h]??0),Nt.raceIndex++;const a=Nt.raceIndex>=4,o=Rf();if(a){Nt.active=!1;const c=o[0].key==="you";c&&Nt.division>1?(localStorage.setItem("steel-ribbon-division",String(Nt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Cf(Nt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Af(),s=`<span>Season — after race ${Nt.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,qe.againBtn.textContent=Nt.active?"Next Race":"Back to Menu"}else qe.againBtn.textContent="Race Again";qe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,Qo(),qe.result.classList.remove("hidden")}function pu(n="Craned back to the ribbon"){const e=ft(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function Nh(n,e){return me.clamp(e*n.tangent.y,-48,48)}function s_(n=94){return se.gaps.map(e=>{const t=ft(e.start),i=ft(e.end+3),s=(e.end-e.start)/Math.max(1,n),r=Nh(t,n),a=t.p.y+2.1+r*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(me.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function mu(n,e){l.grounded=!1,l.yVel=Nh(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Nh(ft(n),e)},gapJumpReport(n){return s_(n)},sceneryClearanceReport(){return zv()},setSpeed(n){return l.speed=me.clamp(n,-14,156-l.damage*.42),ca(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=ft(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=me.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=me.clamp(e,-14,156-l.damage*.42),ca(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=me.clamp(n,0,99),ca(),l.damage},setCourse(n){return La(n)},flyCam(n,e,t,i,s,r){return window.__freeCam=!0,Ne.position.set(n,e,t),Ne.lookAt(i,s,r),Ne.fov=62,Ne.updateProjectionMatrix(),"freecam"},listBoostPads(){return _r.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return Vs.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+gr(n,e).depth.toFixed(3),ground:+pe(n,e).toFixed(2)}},activeGate(){const n=Xt[l.objectiveIndex%Xt.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Nt,division:Pa(),position:zh(),seasonRace:!!l.seasonRace,rivals:kn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Nt=null,Qo(),"reset"},renderInfo(){return{calls:Ae.renderCalls||0,triangles:Ae.renderTris||0,geometries:Qt.info.memory.geometries,textures:Qt.info.memory.textures,mobilePerf:qo,staticMerge:Ae.staticMerge||null}},drawAudit(n=20){const e=new Map;return Fe.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(a=>typeof a=="number").map(a=>+a.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,r=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(r,(e.get(r)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=Fn[0]?.actor?.mesh;return{colliders:Fn.length,wheels:n?.userData?.wheels?.length??0,pedestrians:Ae.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of Fn){const s=i.actor;if(!s||!s.type||s.stolen)continue;const r=Math.hypot(n-i.x,e-i.z);(!t||r<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+r.toFixed(1)})}return t},audioInfo(){return ze?{state:ze.ctx.state,master:+ze.master.gain.value.toFixed(2),engine:!!ze.rumble&&!!ze.growl&&!!ze.whine,fx:!!ze.wind&&!!ze.skid&&!!ze.boost,music:!!ze.musicGain,beat:ze.beat,samples:Object.keys(Wn.buffers).length,sampleLoops:Object.keys(Wn.loops),musicSample:!!Wn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:kf(),engineV2:!!ze.growlB&&!!ze.burble}:null},colliderAudit(){const n=[],e=[],t=ut.streetW*.5;for(let r=ut.x0;r<=ut.x1+1;r+=ut.pitch)n.push(Math.round(r));for(let r=ut.zNear;r>=ut.zFar-1;r-=ut.pitch)e.push(Math.round(r));const i=[],s=(r,a,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=pe(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const f of n)Math.abs(o.x-f)<t+c+En&&o.z<ut.zNear+h&&o.z>ut.zFar-h&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${f}`,overlap:+(t+c+En-Math.abs(o.x-f)).toFixed(1)});for(const f of e)Math.abs(o.z-f)<t+h+En&&o.x<ut.x1+c&&o.x>ut.x0-c&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${f}`,overlap:+(t+h+En-Math.abs(o.z-f)).toFixed(1)})}};return rn.forEach((r,a)=>s("Mn",a,r)),ci.forEach((r,a)=>s("Di",a,r)),Kn.forEach((r,a)=>s("$n",a,r)),{total:rn.length+ci.length+Kn.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&No(),n==="foot"?l.vehicle==="car"?Yc(!0):l.vehicle==="heli"&&Zc():n==="heli"&&de?(l.vehicle==="car"&&Yc(!0),l.roamPos.set(de.pos.x+3,pe(de.pos.x+3,de.pos.z),de.pos.z),jf()):n==="car"&&(l.vehicle==="heli"&&(de.pos.y=pe(de.pos.x,de.pos.z)+1.1,de.vel.set(0,0,0),Zc()),l.vehicle==="foot"&&(l.roamPos.copy(Li),$c())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:vn.visible,heli:de?{x:+de.pos.x.toFixed(1),y:+de.pos.y.toFixed(1),z:+de.pos.z.toFixed(1),rpm:+de.rpm.toFixed(2),scale:+de.mesh.scale.x.toFixed(2),pad:de.pad?{x:+de.pad.x.toFixed(1),z:+de.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Li.x.toFixed(1),z:+Li.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:ht?{type:ht.type,fromTraffic:!!ht.actor,pos:{x:+ht.mesh.position.x.toFixed(1),y:+ht.mesh.position.y.toFixed(2),z:+ht.mesh.position.z.toFixed(1)},visible:ht.mesh.visible,inScene:ht.mesh.parent===Fe,parked:ht.parked?{x:+ht.parked.x.toFixed(1),z:+ht.parked.z.toFixed(1)}:null}:null,parkedSpots:Mn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?Kf():!1},setHeat(n){return l.mode==="roam"&&(l.heat=me.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:kt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:kt.nearest===1/0?null:+kt.nearest.toFixed(1),evadeT:+kt.evadeT.toFixed(1)}},setTod(n){return da.includes(n)&&(zn=n,localStorage.setItem("steel-ribbon-tod",n),Bh()),zn},todInfo(){return{mode:zn,day:+wo.toFixed(3),night:+To.toFixed(3)}},listStuntRamps(){return(bi||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of Mn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&No(),l.roamPos.set(n,pe(n,e)+Bn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,mi(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...ds,boostPads:_r.length,gapBeacons:Sa.length,railRuns:Ae.railRuns||0,railPosts:Ae.railPosts||0,ponds:Vs.length,cityPonds:Ae.ponds||0,cloudSprites:Ae.cloudSprites||0,helipad:Ae.helipad||null,stuntRamps:Ae.stuntRamps||0,propPlanes:Ae.propPlanes||0}},stats(){return{trafficCrashes:Ae.trafficCrashes,splats:Ae.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},viewInfo(){const n=ft(l.s),e=l.y-2.1;return{trackView:fi,mode:l.mode,carVisible:Vt.visible,cockpitVisible:!!(an&&an.visible),camY:+Ne.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!Ei,overheadY:+Jc(Ne.position.x,Ne.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return fi=n==="cockpit"?"cockpit":"chase",Ki(),fi},listCourses(){return ks.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:ms,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Tm(new L(n,400,e),new L(0,-1,0),0,1e3);t.camera=Ne;const i=t.intersectObjects(Fe.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=Us(n,e,400);return{x:n,z:e,ground:+pe(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return Ws.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],r=n.segments[0],a=n.segments[n.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(n=8){return rn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return Kn.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=Kn.filter(e=>e.hw);return{supports:Gc,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of rn){const i=Rs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:rn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of rn){const i=Nn(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:rn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return ci.concat(Kn.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:Ae.traffic,pedestrians:Ae.pedestrians,pedestriansActive:ba.filter(e=>e.active).length,turns:Ae.turns,splats:Ae.splats,trafficCrashes:Ae.trafficCrashes,streetLights:Ae.streetLights,trafficLights:Ae.trafficLights,stopSigns:Ae.stopSigns,signs:Ae.signs,roadDetails:{...Ae.roadDetails},buildingArchetypes:{...Ae.buildingArchetypes},zones:{...Ae.zones},openerProps:Ae.openerProps,signSamples:Fo.slice(0,n),types:{...Ae.types},offRoadTraffic:Fn.filter(e=>!$o(e.x,e.z,2)).length,trafficRoutes:Hc.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Fn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:ba.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...Ae.roadDetails},e={...Ae.buildingArchetypes},t={...Ae.zones},i=Object.values(e).filter(r=>r>0).length,s=Object.values(t).filter(r=>r>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,Ae.signs/7)+Math.min(14,Ae.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:Ae.openerProps,signs:Ae.signs,streetLights:Ae.streetLights,streetGlowSprites:ds.streetGlowSprites,waterBlockers:ds.waterBlockers,lowFogDisks:ds.lowFogDisks}},objectiveReport(){const n=Xt[l.objectiveIndex%Math.max(1,Xt.length)];return{total:Xt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:Xt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:ra.filter(n=>n.life>0).length,debrisActive:aa.filter(n=>n.life>0).length,sparksActive:sa.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Vt.userData.detailReport},racer:{...sM.userData.detailReport},namedParts:Vt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);yf(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=ft(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,r=Math.atan2(t.tangent.x,-t.tangent.z),a=pe(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,a+Bn,s),l.roamYaw=r,l.camYaw=r,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Le.lookX=0,Le.lookY=0,Le.zoom=0,l.wheelSteer=0,l.speed=0,mi();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),Kc(),Ne.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),Ne.fov=69,Ne.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Us(n,e,l.roamPos.y);l.roamPos.set(n,i.y+Bn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,mi();const s=Math.sin(l.roamYaw),r=-Math.cos(l.roamYaw);return Ne.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-r*17),Kc(),Ne.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+r*13),Ne.fov=69,Ne.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Le.zoom,i=30){Le.lookX=me.clamp(n,-1,1),Le.lookY=me.clamp(e,-1,1),Le.zoom=me.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?s0(1/60):Oh(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Le.steer,throttle:Le.throttle,brake:Le.brake};Le.steer=me.clamp(e,-1,1),Le.throttle=me.clamp(t,0,1),Le.brake=me.clamp(i,0,1);const r=1/60;let a=Math.max(0,Math.min(n,8));for(;a>0;){const o=Math.min(r,a);if(qf(o),l.mode!=="roam")break;a-=o}return Le.steer=s.steer,Le.throttle=s.throttle,Le.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(r0(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=ff.set(0,0,-1).applyQuaternion(Vt.quaternion).normalize(),t=Yo.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=Us(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+pe(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+Ne.position.x.toFixed(2),camY:+Ne.position.y.toFixed(2),camZ:+Ne.position.z.toFixed(2),fov:+Ne.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+Fh({x:n.x,y:n.y+2.6,z:n.z},{x:Ne.position.x,y:Ne.position.y,z:Ne.position.z},2.4).toFixed(3),elevatedCameraLift:+zo({x:n.x,y:n.y+2.6,z:n.z},{x:Ne.position.x,y:Ne.position.y,z:Ne.position.z},3.8).toFixed(3),colliders:rn.length+Kn.length+ci.length+Fn.length,insideBuilding:rn.concat(Kn,ci,Fn).some(s=>QM(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Vt.userData.frontWheels?+Vt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function r0(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Le.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Le.brake),s=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Le.steer,-1,1)*pf,r=t>.03&&!e,a=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&r&&l.grounded,o=ft(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(r){const v=l.speed<0?40:0;l.speed+=((a?68:40)*us().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=me.clamp(l.speed,-16,156*us().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=a,a?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*us().boostRegen);const f=Je.has("Space")&&l.grounded,p=(16+h*.13)*(f?1.45:1)*us().grip;l.lateralVel-=s*p*n,l.lateralVel-=l.lateralVel*(l.grounded?f?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const m=Pi(l.s),x=Math.abs(l.lateral)<se.width*.52,M=!m&&x;if(l.grounded&&(!M||Math.abs(l.lateral)>se.width*.5)&&mu(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=me.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&yr(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector(Jt,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=ft(l.s),_=v.p.y+2.1;if(!Pi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=_&&l.yVel<0){const E=-l.yVel,T=Math.abs(l.lateral)<se.width*.34&&E<30,A=Math.round(T?260+l.airtime*85:Math.max(30,120-E));l.y=_,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=A,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=T?"Clean landing":"Hard landing",l.messageTimer=.9,T?l.cleanLandings+=1:l.hardLandings+=1,qi(`+${A} ${T?"CLEAN AIR":"LANDED"}`,T),T&&ei(990,.14),oa(E),yr(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(Jt,.7),T?7:24),l.airtime=0}l.y<-55&&(l.damage+=28,pu("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,h_();const u=Ws.find(v=>v.rampType==="off");if(l.freeRun&&u&&zl(g,l.totalDistance,u.exitS)&&l.lateral*u.dirSel>se.width*.2&&BM(u))return;const y=Math.floor(l.totalDistance/se.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;c_(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,qi("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const _=zh();i_(_===1?"You took the chequered gantry.":`You finished P${_}.`,_)})()}for(const v of se.gaps)zl(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&mu(ft(v.start),v.name));if(l.grounded){for(const v of _r)if(zl(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const _=ft(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,qi("+90 BOOST"),ei(640,.22,"sawtooth",.1),yr(_.p.clone().addScaledVector(_.side,v.lat).addScaledVector(Jt,1),10),oa(14);break}}l.damage=me.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),oa(40),l.damage=90),Je.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),pu("Manual reset"),Je.delete("KeyR"))}function xu(n){const e=se.length*se.laps,t=1+.07*(4-Pa());for(const i of kn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=me.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let f=i.base+d+h;i.key==="bishop"&&(f+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(f+=10*me.clamp(i.distance/Math.max(1,e),0,1)),i.speed=me.clamp(f*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=ft(i.s),r=Math.abs(i.distance-l.totalDistance);let a=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(r<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);a=me.lerp(c,a,r/14)}i.mesh.position.copy(s.p).addScaledVector(Jt,1.4).addScaledVector(s.side,a),i.mesh.quaternion.setFromRotationMatrix(new wt().makeBasis(s.side,Jt,s.tangent));const o=r<26&&fi==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...kn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function zh(){return l.practice?1:1+kn.filter(n=>n.distance>l.totalDistance).length}function r_(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),Ne.position.copy(i);const r=Math.abs(l.speed),a=68+Math.min(10,r*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(Ne.fov-a)>.02&&(Ne.fov+=(a-Ne.fov)*(1-Math.pow(.004,n)),Ne.updateProjectionMatrix());const o=ft(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,r/680),xn.position.copy(Ne.position),xn.lookAt(c),xn.rotateY(Math.PI),xn.rotateY(-l.camLookYaw),xn.rotateZ(-e.bank*.72-l.lateralVel*.006),xn.rotateX(e.grade*.18+(l.grounded?0:me.clamp(l.yVel,-30,30)*-.006)),Ne.quaternion.slerp(xn.quaternion,1-Math.pow(8e-4,n))}function Jc(n,e,t,i){let s=1/0;const r=se.width*.5+2.2;for(const a of Zo()){if(a.courseIndex!==ms||a.y<t||a.y>i||a.y>=s)continue;const o=n-a.x,c=e-a.z;o*o+c*c<r*r&&(s=a.y)}return s}function a_(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+me.clamp(l.cameraZoom,-.42,.9)*8,r=4.6+t*.014+l.camLookPitch*10,a=ft(l.s-s),o=Jc(a.p.x,a.p.z,i+5,i+64);o-1.5<a.p.y+2&&(s=6.4,r=2.7,a=ft(l.s-s),o=Jc(a.p.x,a.p.z,i+5,i+64));let c=me.lerp(a.p.y,i,.62)+r;const h=Ah.set(a.p.x+a.side.x*l.lateral*.72,0,a.p.z+a.side.z*l.lateral*.72);if(c=Math.max(c,a.p.y+2.35,pe(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const m=l.cameraShake;h.x+=(Math.random()-.5)*m*1.1,h.y+=(Math.random()-.5)*m*.6,h.z+=(Math.random()-.5)*m*1.1}Ne.position.distanceTo(h)>70&&Ne.position.copy(h),Ne.position.lerp(h,1-Math.pow(2e-4,n)),Ne.position.y=Math.max(Ne.position.y,a.p.y+2.05),o<1/0&&(Ne.position.y=Math.min(Ne.position.y,o-1.4));const d=ft(l.s+17+t*.09),f=d.p.clone().addScaledVector(d.side,l.lateral*.55);f.y+=2.1+l.camLookPitch*12,l.grounded||(f.y=me.lerp(f.y,l.y+1.2,.5)),xn.position.copy(Ne.position),xn.lookAt(f),xn.rotateY(Math.PI),xn.rotateY(-l.camLookYaw),xn.rotateZ(-e.bank*.42-l.lateralVel*.0034),Ne.quaternion.slerp(xn.quaternion,1-Math.pow(4e-4,n));const p=66+Math.min(11,t*.055)+(l.boosting?5:0)+me.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(Ne.fov-p)>.02&&(Ne.fov+=(p-Ne.fov)*(1-Math.pow(.004,n)),Ne.updateProjectionMatrix())}let hi=null,Ei=null,Gi=0;function o_(){try{Ei=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+ms)||"null")}catch{Ei=null}Gi=0}function l_(){hi&&pr(hi),hi=Gs[Yi].build(),hi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),hi.visible=!1}function c_(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||Ei&&n>=Ei.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);Ei={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+ms,JSON.stringify(Ei))}catch{}l.message=`Ghost saved — ${Oo(n)}`,l.messageTimer=1.3,Gi=0}function h_(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function d_(){if(!hi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&Ei?.samples?.length>2&&!window.__freeCam;if(hi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,Ei.time),t=Ei.samples;for(e<(t[Gi]?.[0]??0)&&(Gi=0);Gi<t.length-2&&t[Gi+1][0]<e;)Gi++;const i=t[Gi],s=t[Math.min(Gi+1,t.length-1)],r=me.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),a=me.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:r),o=me.lerp(i[2],s[2],r),c=me.lerp(i[3],s[3],r),h=ft((a%se.length+se.length)%se.length);hi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),hi.quaternion.setFromRotationMatrix(new wt().makeBasis(h.side,Jt,h.tangent))}function u_(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&fi==="chase"&&!window.__freeCam;if(an&&(an.visible=!e),Vt.visible!==e&&(Vt.visible=e),!e)return;const t=ft(l.s);Vt.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new wt().makeBasis(t.side,Jt,t.tangent);Vt.quaternion.setFromRotationMatrix(i),l.grounded?(Vt.rotateX(-t.grade*.5),Vt.rotateZ(t.bank*.6+me.clamp(l.lateralVel*.012,-.16,.16))):Vt.rotateX(me.clamp(-l.yVel*.011,-.34,.4));const s=Vt.userData.frontWheels,r=me.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=r,s[1].rotation.y=r)}let mo=.6;function f_(n){if(window.__freeCam)return;mo+=n*.13;const e=80,t=300,i=pe(e,t);Vt.visible=!0,an&&(an.visible=!1),Vt.position.set(e,i+.85,t),Vt.quaternion.setFromAxisAngle(Jt,Math.PI*.24);const s=16.5;Ne.position.set(e+Math.cos(mo)*s,i+5.3+Math.sin(mo*.57)*1.1,t+Math.sin(mo)*s),Ne.lookAt(e,i+1.5,t),Ne.rotateY(.3),Math.abs(Ne.fov-58)>.1&&(Ne.fov=58,Ne.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function Oh(n){if(window.__freeCam)return;i0(n);const e=ft(l.s);fi==="chase"&&l.mode!=="menu"?a_(n,e):r_(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=Yo.set(0,0,-1).applyQuaternion(Ne.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Le.steer,throttle:Le.throttle,brake:Le.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const Ns={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Zr=[28,54,82,110,134,156];function p_(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<Zr.length;o++)n>Zr[o]&&(e=o+2);e=Math.min(e,Zr.length);const t=e===1?0:Zr[e-2],i=Zr[e-1],s=i>t?me.clamp((n-t)/(i-t),0,1):0,r=e===1?Ns.idle:Ns.postShift;let a=r+s*(Ns.shift-r);return n<.4&&(a=Ns.idle),{gear:e,rpm:a}}let gu=performance.now(),Wl=0,Xl=0;function a0(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const r=i/2,a=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:r,cy:a,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[r+Math.cos(c)*h,a-Math.sin(c)*h]}}function m_(n,e){const t=qe.speedo;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:c}=a0(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=o(M),u=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=u?Math.max(1.4,a*.035):Math.max(1,a*.02);const y=c(g,a-a*.02),v=c(g,a-a*(u?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),u){const _=c(g,a-a*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),_[0],_[1])}}const d=me.clamp(n/h,0,1),f=o(d),p=c(f,a-a*.06),m=c(f+Math.PI,a*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=a*.18,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(m[0],m[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,r-a*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,r+a*.02)}function x_(n,e){const t=qe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:c}=a0(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke();const d=me.clamp(n,0,1),f=n<.25;i.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?a*.25:a*.1,i.lineWidth=Math.max(2,a*.07),i.beginPath(),i.arc(s,r,a,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,u=o(g),y=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=c(u,a-a*.02),_=c(u,a-a*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(_[0],_[1]),i.stroke(),y){const E=c(u,a-a*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const p=o(d),m=c(p,a-a*.06),x=c(p+Math.PI,a*.14);i.strokeStyle=f?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=a*.16,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,r-a*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=a*.3,i.beginPath(),i.arc(s,r+a*.02,a*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function g_(n,e){const t=qe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,h=Math.min(r*.46,a*.9),d=Ns.max,f=v=>Math.PI-v*Math.PI,p=(v,_)=>[o+Math.cos(v)*_,c-Math.sin(v)*_];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,f(1),f(0)),i.stroke();const m=Ns.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,f(1),f(m)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const _=v/9,E=f(_),T=v*1e3>=Ns.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const A=p(E,h-h*.02),R=p(E,h-h*.18);i.beginPath(),i.moveTo(A[0],A[1]),i.lineTo(R[0],R[1]),i.stroke();const w=p(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const b=f((v+.5)/9),P=p(b,h-h*.02),I=p(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(P[0],P[1]),i.lineTo(I[0],I[1]),i.stroke()}}const x=me.clamp(n/d,0,1),M=f(x),g=p(M,h-h*.06),u=p(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(u[0],u[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function ca(){se.length*se.laps;const n=Qd(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${zh()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),qe.damage.style.width=`${Math.round(l.damage)}%`,qe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,qe.timer.textContent=Oo(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";qe.score.textContent=t?`Gates ${l.objectiveHits}/${Xt.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(qe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&ht?`${ht.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${Pa()}`,t&&Xt.length){const d=Xt[l.objectiveIndex%Xt.length];qe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(qe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),qe.hud.style.display=s?"flex":"none",qe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",qe.touchControls.style.display=s?"":"none",qe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of kn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:Qd(d.distance))*100)}%`);const r=p_();l.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-gu)/1e3);gu=a;const c=1-Math.exp(-o*(r.rpm>l.tachRpm?10:6));l.tachRpm+=(r.rpm-l.tachRpm)*c,g_(l.tachRpm,r.gear);const h=Math.abs(l.speed)*2.25;Wl+=(h-Wl)*(1-Math.exp(-o*8)),Xl+=(l.boost-Xl)*(1-Math.exp(-o*9)),m_(Wl,l.speed<-.5),x_(Xl,l.boosting),qe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),qe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(qe.centerMessage.textContent="Paused",qe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(qe.centerMessage.textContent=l.message,qe.centerMessage.classList.remove("hidden")):qe.centerMessage.classList.add("hidden")}function Oo(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function o0(){Qt.info.reset();const n=bv.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?YM(e):l.vehicle==="heli"?$M(e):qf(e),s0(e),kM()):l.mode==="menu"?(xu(e),f_(e)):(r0(e),xu(e),u_(),d_(),Oh(e)),HM(),GM(),oi&&oi.position.copy(Ne.position),zM(e),yf(e),ca(),OM(),jr.uniforms.uTime.value+=e,vf.forEach(i=>i.uniforms.uTime.value+=e),jr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);jr.uniforms.uBoost.value+=(t-jr.uniforms.uBoost.value)*Math.min(1,e*6),Ir.render(),Ae.renderCalls=Qt.info.render.calls,Ae.renderTris=Qt.info.render.triangles,requestAnimationFrame(o0)}window.addEventListener("keydown",n=>{Je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused")&&wv(),n.code==="KeyE"&&Qf(),n.code==="KeyN"&&f0(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",Je.clear(),Aa()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",Aa(),Vt.visible=!1,an&&(an.visible=!0),document.body.classList.remove("roam-mode"),Ki(),qe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>Je.delete(n.code));window.addEventListener("resize",()=>{Ne.aspect=window.innerWidth/window.innerHeight,Ne.updateProjectionMatrix(),Qt.setSize(window.innerWidth,window.innerHeight),Ir.setSize(window.innerWidth,window.innerHeight),zf.setSize(window.innerWidth,window.innerHeight)});const Bo=()=>{vs(),window.removeEventListener("pointerdown",Bo),window.removeEventListener("keydown",Bo)};window.addEventListener("pointerdown",Bo);window.addEventListener("keydown",Bo);const Ta=document.createElement("button");Ta.id="volBtn",Ta.type="button";function l0(){Ta.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}l0();Ta.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),ze&&ze.master.gain.setTargetAtTime(e,ze.ctx.currentTime,.05),l0()});qe.menu.appendChild(Ta);const Ea=document.createElement("button");Ea.id="musicBtn",Ea.type="button";function c0(){Ea.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}c0();Ea.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),vs(),c0()});qe.menu.appendChild(Ea);const ha=document.createElement("button");ha.id="actionBtn",ha.type="button",ha.textContent="E";ha.addEventListener("pointerdown",n=>{n.preventDefault(),vs(),Qf()});qe.touchControls.appendChild(ha);const jo=document.createElement("div");jo.className="course-select";jo.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';qe.freeRunBtn.parentNode.insertBefore(jo,qe.freeRunBtn);const h0=[];Gs.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>rM(e)),jo.querySelector("#carButtons").appendChild(t),h0.push(t)});function jc(){const n=Gs[Yi],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),h0.forEach((t,i)=>t.classList.toggle("active",i===Yi))}jc();qe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+kn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");qe.playerProgress=document.querySelector("#playerProgress");kn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function Qo(){const n=Pa();qe.startBtn.textContent=Nt?.active?`Continue Season — Race ${Nt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Rf();e.innerHTML=`<span>Division ${Cf(n)}${Nt?.active?` — after race ${Nt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Nt?` — ${i.pts} pts`:""}</b>`).join("")}}function v_(){l.mode="menu",Aa(),Vt.visible=!1,an&&(an.visible=!0),Ko(!1),document.body.classList.remove("roam-mode"),Ki(),Qo(),qe.result.classList.add("hidden"),qe.menu.classList.remove("hidden")}Qo();qe.startBtn.addEventListener("click",()=>{Nt&&Nt.active||oM(),La(me.clamp(Nt.raceIndex,0,3)),wa(!1,!1,!0)});qe.practiceBtn.addEventListener("click",()=>wa(!0));qe.freeRunBtn.addEventListener("click",()=>wa(!0,!0));qe.roamBtn.addEventListener("click",()=>No());qe.againBtn.addEventListener("click",()=>{l.seasonRace&&Nt?Nt.active&&Nt.raceIndex<4?(La(Nt.raceIndex),wa(!1,!1,!0)):v_():wa(!1)});qe.courseButtons.forEach(n=>{n.addEventListener("click",()=>La(Number(n.dataset.course)))});function d0(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Aa(){Le.steer=0,Le.throttle=0,Le.brake=0,Le.lookX=0,Le.lookY=0,Le.zoom=0,Le.lookPointer=null,Le.drivePointer=null,Le.pinchStartDistance=0,Le.pinchStartZoom=0;for(const n of qe.touchControls.querySelectorAll(".touch-stick"))d0(n)}function xo(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=me.clamp(e.clientX-(t.left+t.width/2),-i,i),r=me.clamp(e.clientY-(t.top+t.height/2),-i,i),a=n.dataset.stick;if(n.classList.add("active"),a==="look")Le.lookX=me.clamp(s/i,-1,1),Le.lookY=me.clamp(-r/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Le.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Le.lookY*i)}px`);else{const o=me.clamp(s/i,-1,1),c=me.clamp(-r/i,-1,1);Le.steer=o,Le.throttle=Math.max(0,c),Le.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function vu(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function Mu(n,e){e==="look"?(Le.lookX=0,Le.lookY=0,Le.lookPointer=null):(Le.steer=0,Le.throttle=0,Le.brake=0,Le.drivePointer=null),d0(n)}function M_(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function u0(n,e=!1){if(n.touches.length<2){Le.pinchStartDistance=0;return}const t=M_(n.touches[0],n.touches[1]);if(e||!(Le.pinchStartDistance>0)){Le.pinchStartDistance=t,Le.pinchStartZoom=Le.zoom;return}const i=Math.max(.2,t/Le.pinchStartDistance);Le.zoom=me.clamp(Le.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of qe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),vs(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Le.lookPointer=s.pointerId),e==="drive"&&(Le.drivePointer=s.pointerId),xo(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Le.lookPointer:Le.drivePointer)===s.pointerId&&(s.preventDefault(),xo(n,s))},{passive:!1});const t=s=>{(e==="look"?Le.lookPointer:Le.drivePointer)===s.pointerId&&Mu(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),vs(),l.mode==="paused"&&(l.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Le.lookPointer=r.identifier),e==="drive"&&(Le.drivePointer=r.identifier),xo(n,r))},{passive:!1}),n.addEventListener("touchmove",s=>{const r=e==="look"?Le.lookPointer:Le.drivePointer,a=vu(s,r);a&&(s.preventDefault(),xo(n,a))},{passive:!1});const i=s=>{const r=e==="look"?Le.lookPointer:Le.drivePointer;vu(s,r)&&(s.preventDefault(),Mu(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of qe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),vs(),Je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>Je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Ra.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),u0(n,!0))},{passive:!1});Ra.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),u0(n))},{passive:!1});Ra.addEventListener("touchend",n=>{n.touches.length<2&&(Le.pinchStartDistance=0)},{passive:!1});Ra.addEventListener("touchcancel",()=>{Le.pinchStartDistance=0},{passive:!1});const da=["dusk","night","day","cycle"],__={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let zn=localStorage.getItem("steel-ribbon-tod")||"dusk";da.includes(zn)||(zn="dusk");let wo=0,To=0,ql=95;const y_=new it,b_=new it,S_=new it;function As(n,e,t,i,s){return S_.set(n).lerp(y_.set(e),i).lerp(b_.set(t),s)}const as=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Fe.traverse(n=>{n.isSprite&&n.renderOrder===-50&&Qn.cloudMats.push(n.material)});function w_(n,e){if(!Qn.skyU)return;Qn.skyU.uDay.value=n,Qn.skyU.uNight.value=e;const t=Qn;t.hemi.color.copy(As(16757626,12573183,2371663,n,e)),t.hemi.groundColor.copy(As(3097190,5925464,789534,n,e)),t.hemi.intensity=as(.66,.95,.22,n,e),t.fill.color.copy(As(7179775,13096432,2240591,n,e)),t.fill.intensity=as(.6,.5,.16,n,e),t.key.color.copy(As(16752724,16774880,10336511,n,e)),t.key.intensity=as(2.3,2.6,.45,n,e),t.rim.intensity=as(.5,.3,.1,n,e),Fe.fog.color.copy(As(14719602,12834794,723741,n,e)),Fe.fog.near=as(360,430,300,n,e),Fe.fog.far=as(2150,2600,1650,n,e),t.sunMat.color.copy(As(16764250,16777198,14542591,n,e)),t.sunMat.opacity=as(.92,.95,.5,n,e);for(const s of t.glowMats)s.mat.opacity=as(s.dusk,s.dusk*.55,s.dusk*.18,n,e);const i=As(16777215,16777215,3687001,n,e);for(const s of t.cloudMats)s.color.copy(i)}_n(new zt,(n,e)=>{let t=0,i=0;if(zn==="day")t=1;else if(zn==="night")i=1;else if(zn==="cycle"){ql=(ql+e)%270;const r=ql;r<60?t=1:r<90?t=1-(r-60)/30:r<120||(r<150?i=(r-120)/30:r<210?i=1:r<240?i=1-(r-210)/30:t=(r-240)/30)}const s=Math.min(1,e*1.4);wo+=(t-wo)*s,To+=(i-To)*s,w_(wo,To)});function f0(){zn=da[(da.indexOf(zn)+1)%da.length],localStorage.setItem("steel-ribbon-tod",zn),Bh(),l.message=`Time of day: ${zn.toUpperCase()}`,l.messageTimer=1.2}const Ca=document.createElement("button");Ca.id="todBtn",Ca.type="button";function Bh(){Ca.textContent=`${__[zn]} ${zn[0].toUpperCase()}${zn.slice(1)}`}Bh();Ca.addEventListener("click",n=>{n.stopPropagation(),f0()});qe.menu.appendChild(Ca);function T_(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of Rh)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of Xt)e(c.marker);e(Vt),e(vn),typeof an<"u"&&e(an),typeof hi<"u"&&e(hi),de&&e(de.mesh),typeof oi<"u"&&e(oi),typeof _i<"u"&&_i&&e(_i);for(const c of kn)e(c.mesh);const i=new Map;Fe.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let m=c;m&&m!==Fe;m=m.parent){if(n.has(m)||!m.visible)return;const x=m.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const f=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let p=i.get(f);p||i.set(f,p=[]),p.push(c)});let s=0,r=0;const a=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(m=>{m.updateWorldMatrix(!0,!1);const x=m.geometry.clone().applyMatrix4(m.matrixWorld);for(const M of Object.keys(x.attributes))M==="position"||M==="normal"||M==="uv"||x.deleteAttribute(M);return x}),d=ps(h,!1);if(!d)continue;const f=c[0],p=new O(d,f.material);p.castShadow=f.castShadow,p.receiveShadow=f.receiveShadow,p.matrixAutoUpdate=!1,Fe.add(p);for(const m of c)a.set(m.geometry.uuid,m.geometry),m.removeFromParent(),r++;s++}catch{}const o=new Set;Fe.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of a)o.has(c)||h.dispose();Ae.staticMerge={groups:s,meshesRemoved:r}}T_();const E_=ft(l.s);l.y=E_.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;Oh(.016);ca();o0();
