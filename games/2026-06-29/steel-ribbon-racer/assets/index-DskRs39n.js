(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Dc="181",ru=0,dl=1,au=2,Bh=1,zh=2,hi=3,Ii=0,hn=1,pt=2,Jn=0,Cs=1,Ai=2,ul=3,fl=4,ou=5,Yi=100,cu=101,lu=102,hu=103,du=104,uu=200,fu=201,pu=202,mu=203,Uo=204,Fo=205,xu=206,gu=207,vu=208,_u=209,Mu=210,Su=211,yu=212,bu=213,wu=214,No=0,Oo=1,Bo=2,Ls=3,zo=4,ko=5,Vo=6,Go=7,Ic=0,Tu=1,Eu=2,Pi=0,kh=1,Vh=2,Gh=3,Uc=4,Hh=5,Wh=6,Xh=7,Yh=300,Ds=301,Is=302,Ho=303,Wo=304,Ua=306,un=1e3,fi=1001,Xo=1002,Tn=1003,Au=1004,Nr=1005,In=1006,Ha=1007,Zi=1008,ti=1009,qh=1010,Zh=1011,vr=1012,Fc=1013,ts=1014,$n=1015,jn=1016,Nc=1017,Oc=1018,_r=1020,$h=35902,Kh=35899,Jh=1021,jh=1022,Gn=1023,Mr=1026,Sr=1027,Bc=1028,zc=1029,kc=1030,Vc=1031,Gc=1033,pa=33776,ma=33777,xa=33778,ga=33779,Yo=35840,qo=35841,Zo=35842,$o=35843,Ko=36196,Jo=37492,jo=37496,Qo=37808,ec=37809,tc=37810,nc=37811,ic=37812,sc=37813,rc=37814,ac=37815,oc=37816,cc=37817,lc=37818,hc=37819,dc=37820,uc=37821,fc=36492,pc=36494,mc=36495,xc=36283,gc=36284,vc=36285,_c=36286,Cu=3200,Ru=3201,Hc=0,Pu=1,Ei="",At="srgb",Us="srgb-linear",ya="linear",Ut="srgb",os=7680,pl=519,Lu=512,Du=513,Iu=514,Qh=515,Uu=516,Fu=517,Nu=518,Ou=519,Mc=35044,ml="300 es",Kn=2e3,ba=2001;function ed(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function wa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Bu(){const i=wa("canvas");return i.style.display="block",i}const xl={};function Ta(...i){const e="THREE."+i.shift();console.log(e,...i)}function ct(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Vt(...i){const e="THREE."+i.shift();console.error(e,...i)}function yr(...i){const e=i.join(" ");e in xl||(xl[e]=!0,ct(...i))}function zu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class zs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let gl=1234567;const lr=Math.PI/180,br=180/Math.PI;function Qn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function gt(i,e,t){return Math.max(e,Math.min(t,i))}function Wc(i,e){return(i%e+e)%e}function ku(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Vu(i,e,t){return i!==e?(t-i)/(e-i):0}function hr(i,e,t){return(1-t)*i+t*e}function Gu(i,e,t,n){return hr(i,e,1-Math.exp(-t*n))}function Hu(i,e=1){return e-Math.abs(Wc(i,e*2)-e)}function Wu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Xu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Yu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function qu(i,e){return i+Math.random()*(e-i)}function Zu(i){return i*(.5-Math.random())}function $u(i){i!==void 0&&(gl=i);let e=gl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ku(i){return i*lr}function Ju(i){return i*br}function ju(i){return(i&i-1)===0&&i!==0}function Qu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ef(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function tf(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),p=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*p,o*l);break;case"YZY":i.set(c*p,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*p,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*d,o*l);break;default:ct("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Oe={DEG2RAD:lr,RAD2DEG:br,generateUUID:Qn,clamp:gt,euclideanModulo:Wc,mapLinear:ku,inverseLerp:Vu,lerp:hr,damp:Gu,pingpong:Hu,smoothstep:Wu,smootherstep:Xu,randInt:Yu,randFloat:qu,randFloatSpread:Zu,seededRandom:$u,degToRad:Ku,radToDeg:Ju,isPowerOfTwo:ju,ceilPowerOfTwo:Qu,floorPowerOfTwo:ef,setQuaternionFromProperEuler:tf,normalize:Ft,denormalize:Vn};class Te{constructor(e=0,t=0){Te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],p=r[a+0],m=r[a+1],g=r[a+2],M=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=M;return}if(u!==M||c!==p||l!==m||d!==g){let x=c*p+l*m+d*g+u*M;x<0&&(p=-p,m=-m,g=-g,M=-M,x=-x);let h=1-o;if(x<.9995){const _=Math.acos(x),v=Math.sin(_);h=Math.sin(h*_)/v,o=Math.sin(o*_)/v,c=c*h+p*o,l=l*h+m*o,d=d*h+g*o,u=u*h+M*o}else{c=c*h+p*o,l=l*h+m*o,d=d*h+g*o,u=u*h+M*o;const _=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=_,l*=_,d*=_,u*=_}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],p=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*u+c*m-l*p,e[t+1]=c*g+d*p+l*u-o*m,e[t+2]=l*g+d*m+o*p-c*u,e[t+3]=d*g-o*u-c*p-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),p=c(n/2),m=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=p*d*u+l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u-p*m*g;break;case"YXZ":this._x=p*d*u+l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u+p*m*g;break;case"ZXY":this._x=p*d*u-l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u-p*m*g;break;case"ZYX":this._x=p*d*u-l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u+p*m*g;break;case"YZX":this._x=p*d*u+l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u-p*m*g;break;case"XZY":this._x=p*d*u-l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u+p*m*g;break;default:ct("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],p=n+o+u;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(gt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this.z=gt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this.z=gt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wa.copy(this).projectOnVector(e),this.sub(Wa)}reflect(e){return this.sub(Wa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Wa=new P,vl=new xi;class ft{constructor(e,t,n,s,r,a,o,c,l){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],p=n[2],m=n[5],g=n[8],M=s[0],x=s[3],h=s[6],_=s[1],v=s[4],y=s[7],E=s[2],T=s[5],R=s[8];return r[0]=a*M+o*_+c*E,r[3]=a*x+o*v+c*T,r[6]=a*h+o*y+c*R,r[1]=l*M+d*_+u*E,r[4]=l*x+d*v+u*T,r[7]=l*h+d*y+u*R,r[2]=p*M+m*_+g*E,r[5]=p*x+m*v+g*T,r[8]=p*h+m*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,p=o*c-d*r,m=l*r-a*c,g=t*u+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=u*M,e[1]=(s*l-d*n)*M,e[2]=(o*n-s*a)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*r-o*t)*M,e[6]=m*M,e[7]=(n*c-l*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xa.makeScale(e,t)),this}rotate(e){return this.premultiply(Xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xa=new ft,_l=new ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ml=new ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nf(){const i={enabled:!0,workingColorSpace:Us,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ut&&(s.r=pi(s.r),s.g=pi(s.g),s.b=pi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ut&&(s.r=Rs(s.r),s.g=Rs(s.g),s.b=Rs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ei?ya:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return yr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return yr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Us]:{primaries:e,whitePoint:n,transfer:ya,toXYZ:_l,fromXYZ:Ml,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:At},outputColorSpaceConfig:{drawingBufferColorSpace:At}},[At]:{primaries:e,whitePoint:n,transfer:Ut,toXYZ:_l,fromXYZ:Ml,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:At}}}),i}const Et=nf();function pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Rs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let cs;class sf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{cs===void 0&&(cs=wa("canvas")),cs.width=e.width,cs.height=e.height;const s=cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=cs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=pi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(pi(t[n]/255)*255):t[n]=pi(t[n]);return{data:t,width:e.width,height:e.height}}else return ct("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let rf=0;class Xc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=Qn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ya(s[a].image)):r.push(Ya(s[a]))}else r=Ya(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ya(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?sf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ct("Texture: Unable to serialize Texture."),{})}let af=0;const qa=new P;class dn extends zs{constructor(e=dn.DEFAULT_IMAGE,t=dn.DEFAULT_MAPPING,n=fi,s=fi,r=In,a=Zi,o=Gn,c=ti,l=dn.DEFAULT_ANISOTROPY,d=Ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=Qn(),this.name="",this.source=new Xc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(qa).x}get height(){return this.source.getSize(qa).y}get depth(){return this.source.getSize(qa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){ct(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ct(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Yh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case un:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case Xo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case un:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case Xo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=Yh;dn.DEFAULT_ANISOTROPY=1;class Ot{constructor(e=0,t=0,n=0,s=1){Ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],p=c[1],m=c[5],g=c[9],M=c[2],x=c[6],h=c[10];if(Math.abs(d-p)<.01&&Math.abs(u-M)<.01&&Math.abs(g-x)<.01){if(Math.abs(d+p)<.1&&Math.abs(u+M)<.1&&Math.abs(g+x)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,y=(m+1)/2,E=(h+1)/2,T=(d+p)/4,R=(u+M)/4,C=(g+x)/4;return v>y&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=T/n,r=R/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=C/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=C/r),this.set(n,s,r,t),this}let _=Math.sqrt((x-g)*(x-g)+(u-M)*(u-M)+(p-d)*(p-d));return Math.abs(_)<.001&&(_=1),this.x=(x-g)/_,this.y=(u-M)/_,this.z=(p-d)/_,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this.z=gt(this.z,e.z,t.z),this.w=gt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this.z=gt(this.z,e,t),this.w=gt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class of extends zs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:In,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new dn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:In,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Xc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hn extends of{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class td extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class cf extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ss{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Fn):Fn.fromBufferAttribute(r,a),Fn.applyMatrix4(e.matrixWorld),this.expandByPoint(Fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Or.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Or.copy(n.boundingBox)),Or.applyMatrix4(e.matrixWorld),this.union(Or)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fn),Fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qs),Br.subVectors(this.max,qs),ls.subVectors(e.a,qs),hs.subVectors(e.b,qs),ds.subVectors(e.c,qs),gi.subVectors(hs,ls),vi.subVectors(ds,hs),Ni.subVectors(ls,ds);let t=[0,-gi.z,gi.y,0,-vi.z,vi.y,0,-Ni.z,Ni.y,gi.z,0,-gi.x,vi.z,0,-vi.x,Ni.z,0,-Ni.x,-gi.y,gi.x,0,-vi.y,vi.x,0,-Ni.y,Ni.x,0];return!Za(t,ls,hs,ds,Br)||(t=[1,0,0,0,1,0,0,0,1],!Za(t,ls,hs,ds,Br))?!1:(zr.crossVectors(gi,vi),t=[zr.x,zr.y,zr.z],Za(t,ls,hs,ds,Br))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const si=[new P,new P,new P,new P,new P,new P,new P,new P],Fn=new P,Or=new ss,ls=new P,hs=new P,ds=new P,gi=new P,vi=new P,Ni=new P,qs=new P,Br=new P,zr=new P,Oi=new P;function Za(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Oi.fromArray(i,r);const o=s.x*Math.abs(Oi.x)+s.y*Math.abs(Oi.y)+s.z*Math.abs(Oi.z),c=e.dot(Oi),l=t.dot(Oi),d=n.dot(Oi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const lf=new ss,Zs=new P,$a=new P;class ks{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):lf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zs.subVectors(e,this.center);const t=Zs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Zs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($a.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zs.copy(e.center).add($a)),this.expandByPoint(Zs.copy(e.center).sub($a))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ri=new P,Ka=new P,kr=new P,_i=new P,Ja=new P,Vr=new P,ja=new P;class Yc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ka.copy(e).add(t).multiplyScalar(.5),kr.copy(t).sub(e).normalize(),_i.copy(this.origin).sub(Ka);const r=e.distanceTo(t)*.5,a=-this.direction.dot(kr),o=_i.dot(this.direction),c=-_i.dot(kr),l=_i.lengthSq(),d=Math.abs(1-a*a);let u,p,m,g;if(d>0)if(u=a*c-o,p=a*o-c,g=r*d,u>=0)if(p>=-g)if(p<=g){const M=1/d;u*=M,p*=M,m=u*(u+a*p+2*o)+p*(a*u+p+2*c)+l}else p=r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;else p=-r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;else p<=-g?(u=Math.max(0,-(-a*r+o)),p=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+p*(p+2*c)+l):p<=g?(u=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+l):(u=Math.max(0,-(a*r+o)),p=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+p*(p+2*c)+l);else p=a>0?-r:r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ka).addScaledVector(kr,p),m}intersectSphere(e,t){ri.subVectors(e.center,this.origin);const n=ri.dot(this.direction),s=ri.dot(ri)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,p=this.origin;return l>=0?(n=(e.min.x-p.x)*l,s=(e.max.x-p.x)*l):(n=(e.max.x-p.x)*l,s=(e.min.x-p.x)*l),d>=0?(r=(e.min.y-p.y)*d,a=(e.max.y-p.y)*d):(r=(e.max.y-p.y)*d,a=(e.min.y-p.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(o=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,n,s,r){Ja.subVectors(t,e),Vr.subVectors(n,e),ja.crossVectors(Ja,Vr);let a=this.direction.dot(ja),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_i.subVectors(this.origin,e);const c=o*this.direction.dot(Vr.crossVectors(_i,Vr));if(c<0)return null;const l=o*this.direction.dot(Ja.cross(_i));if(l<0||c+l>a)return null;const d=-o*_i.dot(ja);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pt{constructor(e,t,n,s,r,a,o,c,l,d,u,p,m,g,M,x){Pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,u,p,m,g,M,x)}set(e,t,n,s,r,a,o,c,l,d,u,p,m,g,M,x){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=p,h[3]=m,h[7]=g,h[11]=M,h[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/us.setFromMatrixColumn(e,0).length(),r=1/us.setFromMatrixColumn(e,1).length(),a=1/us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const p=a*d,m=a*u,g=o*d,M=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=m+g*l,t[5]=p-M*l,t[9]=-o*c,t[2]=M-p*l,t[6]=g+m*l,t[10]=a*c}else if(e.order==="YXZ"){const p=c*d,m=c*u,g=l*d,M=l*u;t[0]=p+M*o,t[4]=g*o-m,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=M+p*o,t[10]=a*c}else if(e.order==="ZXY"){const p=c*d,m=c*u,g=l*d,M=l*u;t[0]=p-M*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=M-p*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const p=a*d,m=a*u,g=o*d,M=o*u;t[0]=c*d,t[4]=g*l-m,t[8]=p*l+M,t[1]=c*u,t[5]=M*l+p,t[9]=m*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const p=a*c,m=a*l,g=o*c,M=o*l;t[0]=c*d,t[4]=M-p*u,t[8]=g*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=m*u+g,t[10]=p-M*u}else if(e.order==="XZY"){const p=a*c,m=a*l,g=o*c,M=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=p*u+M,t[5]=a*d,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*d,t[10]=M*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hf,e,df)}lookAt(e,t,n){const s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Mi.crossVectors(n,yn),Mi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Mi.crossVectors(n,yn)),Mi.normalize(),Gr.crossVectors(yn,Mi),s[0]=Mi.x,s[4]=Gr.x,s[8]=yn.x,s[1]=Mi.y,s[5]=Gr.y,s[9]=yn.y,s[2]=Mi.z,s[6]=Gr.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],p=n[9],m=n[13],g=n[2],M=n[6],x=n[10],h=n[14],_=n[3],v=n[7],y=n[11],E=n[15],T=s[0],R=s[4],C=s[8],b=s[12],S=s[1],L=s[5],F=s[9],W=s[13],te=s[2],ne=s[6],X=s[10],Q=s[14],ie=s[3],de=s[7],pe=s[11],ze=s[15];return r[0]=a*T+o*S+c*te+l*ie,r[4]=a*R+o*L+c*ne+l*de,r[8]=a*C+o*F+c*X+l*pe,r[12]=a*b+o*W+c*Q+l*ze,r[1]=d*T+u*S+p*te+m*ie,r[5]=d*R+u*L+p*ne+m*de,r[9]=d*C+u*F+p*X+m*pe,r[13]=d*b+u*W+p*Q+m*ze,r[2]=g*T+M*S+x*te+h*ie,r[6]=g*R+M*L+x*ne+h*de,r[10]=g*C+M*F+x*X+h*pe,r[14]=g*b+M*W+x*Q+h*ze,r[3]=_*T+v*S+y*te+E*ie,r[7]=_*R+v*L+y*ne+E*de,r[11]=_*C+v*F+y*X+E*pe,r[15]=_*b+v*W+y*Q+E*ze,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],p=e[10],m=e[14],g=e[3],M=e[7],x=e[11],h=e[15];return g*(+r*c*u-s*l*u-r*o*p+n*l*p+s*o*m-n*c*m)+M*(+t*c*m-t*l*p+r*a*p-s*a*m+s*l*d-r*c*d)+x*(+t*l*u-t*o*m-r*a*u+n*a*m+r*o*d-n*l*d)+h*(-s*o*d-t*c*u+t*o*p+s*a*u-n*a*p+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],p=e[10],m=e[11],g=e[12],M=e[13],x=e[14],h=e[15],_=u*x*l-M*p*l+M*c*m-o*x*m-u*c*h+o*p*h,v=g*p*l-d*x*l-g*c*m+a*x*m+d*c*h-a*p*h,y=d*M*l-g*u*l+g*o*m-a*M*m-d*o*h+a*u*h,E=g*u*c-d*M*c-g*o*p+a*M*p+d*o*x-a*u*x,T=t*_+n*v+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=_*R,e[1]=(M*p*r-u*x*r-M*s*m+n*x*m+u*s*h-n*p*h)*R,e[2]=(o*x*r-M*c*r+M*s*l-n*x*l-o*s*h+n*c*h)*R,e[3]=(u*c*r-o*p*r-u*s*l+n*p*l+o*s*m-n*c*m)*R,e[4]=v*R,e[5]=(d*x*r-g*p*r+g*s*m-t*x*m-d*s*h+t*p*h)*R,e[6]=(g*c*r-a*x*r-g*s*l+t*x*l+a*s*h-t*c*h)*R,e[7]=(a*p*r-d*c*r+d*s*l-t*p*l-a*s*m+t*c*m)*R,e[8]=y*R,e[9]=(g*u*r-d*M*r-g*n*m+t*M*m+d*n*h-t*u*h)*R,e[10]=(a*M*r-g*o*r+g*n*l-t*M*l-a*n*h+t*o*h)*R,e[11]=(d*o*r-a*u*r-d*n*l+t*u*l+a*n*m-t*o*m)*R,e[12]=E*R,e[13]=(d*M*s-g*u*s+g*n*p-t*M*p-d*n*x+t*u*x)*R,e[14]=(g*o*s-a*M*s-g*n*c+t*M*c+a*n*x-t*o*x)*R,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*p+t*o*p)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,p=r*l,m=r*d,g=r*u,M=a*d,x=a*u,h=o*u,_=c*l,v=c*d,y=c*u,E=n.x,T=n.y,R=n.z;return s[0]=(1-(M+h))*E,s[1]=(m+y)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(m-y)*T,s[5]=(1-(p+h))*T,s[6]=(x+_)*T,s[7]=0,s[8]=(g+v)*R,s[9]=(x-_)*R,s[10]=(1-(p+M))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=us.set(s[0],s[1],s[2]).length();const a=us.set(s[4],s[5],s[6]).length(),o=us.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Nn.copy(this);const l=1/r,d=1/a,u=1/o;return Nn.elements[0]*=l,Nn.elements[1]*=l,Nn.elements[2]*=l,Nn.elements[4]*=d,Nn.elements[5]*=d,Nn.elements[6]*=d,Nn.elements[8]*=u,Nn.elements[9]*=u,Nn.elements[10]*=u,t.setFromRotationMatrix(Nn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Kn,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(n-s),p=(t+e)/(t-e),m=(n+s)/(n-s);let g,M;if(c)g=r/(a-r),M=a*r/(a-r);else if(o===Kn)g=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===ba)g=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Kn,c=!1){const l=this.elements,d=2/(t-e),u=2/(n-s),p=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,M;if(c)g=1/(a-r),M=a/(a-r);else if(o===Kn)g=-2/(a-r),M=-(a+r)/(a-r);else if(o===ba)g=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=p,l[1]=0,l[5]=u,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const us=new P,Nn=new Pt,hf=new P(0,0,0),df=new P(1,1,1),Mi=new P,Gr=new P,yn=new P,Sl=new Pt,yl=new xi;class Xn{constructor(e=0,t=0,n=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-gt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(gt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-gt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(gt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:ct("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Sl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yl.setFromEuler(this),this.setFromQuaternion(yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class qc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let uf=0;const bl=new P,fs=new xi,ai=new Pt,Hr=new P,$s=new P,ff=new P,pf=new xi,wl=new P(1,0,0),Tl=new P(0,1,0),El=new P(0,0,1),Al={type:"added"},mf={type:"removed"},ps={type:"childadded",child:null},Qa={type:"childremoved",child:null};class Ht extends zs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new P,t=new Xn,n=new xi,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Pt},normalMatrix:{value:new ft}}),this.matrix=new Pt,this.matrixWorld=new Pt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(wl,e)}rotateY(e){return this.rotateOnAxis(Tl,e)}rotateZ(e){return this.rotateOnAxis(El,e)}translateOnAxis(e,t){return bl.copy(e).applyQuaternion(this.quaternion),this.position.add(bl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wl,e)}translateY(e){return this.translateOnAxis(Tl,e)}translateZ(e){return this.translateOnAxis(El,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Hr.copy(e):Hr.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt($s,Hr,this.up):ai.lookAt(Hr,$s,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(ai),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Vt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Al),ps.child=e,this.dispatchEvent(ps),ps.child=null):Vt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mf),Qa.child=e,this.dispatchEvent(Qa),Qa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Al),ps.child=e,this.dispatchEvent(ps),ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,e,ff),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,pf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),p=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ht.DEFAULT_UP=new P(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new P,oi=new P,eo=new P,ci=new P,ms=new P,xs=new P,Cl=new P,to=new P,no=new P,io=new P,so=new Ot,ro=new Ot,ao=new Ot;class Dn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),On.subVectors(e,t),s.cross(On);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){On.subVectors(s,t),oi.subVectors(n,t),eo.subVectors(e,t);const a=On.dot(On),o=On.dot(oi),c=On.dot(eo),l=oi.dot(oi),d=oi.dot(eo),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const p=1/u,m=(l*c-o*d)*p,g=(a*d-o*c)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ci.x),c.addScaledVector(a,ci.y),c.addScaledVector(o,ci.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return so.setScalar(0),ro.setScalar(0),ao.setScalar(0),so.fromBufferAttribute(e,t),ro.fromBufferAttribute(e,n),ao.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(so,r.x),a.addScaledVector(ro,r.y),a.addScaledVector(ao,r.z),a}static isFrontFacing(e,t,n,s){return On.subVectors(n,t),oi.subVectors(e,t),On.cross(oi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),On.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Dn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Dn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Dn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Dn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Dn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ms.subVectors(s,n),xs.subVectors(r,n),to.subVectors(e,n);const c=ms.dot(to),l=xs.dot(to);if(c<=0&&l<=0)return t.copy(n);no.subVectors(e,s);const d=ms.dot(no),u=xs.dot(no);if(d>=0&&u<=d)return t.copy(s);const p=c*u-d*l;if(p<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(ms,a);io.subVectors(e,r);const m=ms.dot(io),g=xs.dot(io);if(g>=0&&m<=g)return t.copy(r);const M=m*l-c*g;if(M<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(xs,o);const x=d*g-m*u;if(x<=0&&u-d>=0&&m-g>=0)return Cl.subVectors(r,s),o=(u-d)/(u-d+(m-g)),t.copy(s).addScaledVector(Cl,o);const h=1/(x+M+p);return a=M*h,o=p*h,t.copy(n).addScaledVector(ms,a).addScaledVector(xs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const nd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Wr={h:0,s:0,l:0};function oo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class tt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=At){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Et.workingColorSpace){return this.r=e,this.g=t,this.b=n,Et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Et.workingColorSpace){if(e=Wc(e,1),t=gt(t,0,1),n=gt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=oo(a,r,e+1/3),this.g=oo(a,r,e),this.b=oo(a,r,e-1/3)}return Et.colorSpaceToWorking(this,s),this}setStyle(e,t=At){function n(r){r!==void 0&&parseFloat(r)<1&&ct("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ct("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ct("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=At){const n=nd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ct("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pi(e.r),this.g=pi(e.g),this.b=pi(e.b),this}copyLinearToSRGB(e){return this.r=Rs(e.r),this.g=Rs(e.g),this.b=Rs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=At){return Et.workingToColorSpace(rn.copy(this),e),Math.round(gt(rn.r*255,0,255))*65536+Math.round(gt(rn.g*255,0,255))*256+Math.round(gt(rn.b*255,0,255))}getHexString(e=At){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Et.workingColorSpace){Et.workingToColorSpace(rn.copy(this),t);const n=rn.r,s=rn.g,r=rn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=Et.workingColorSpace){return Et.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=At){Et.workingToColorSpace(rn.copy(this),e);const t=rn.r,n=rn.g,s=rn.b;return e!==At?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Si),this.setHSL(Si.h+e,Si.s+t,Si.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Si),e.getHSL(Wr);const n=hr(Si.h,Wr.h,t),s=hr(Si.s,Wr.s,t),r=hr(Si.l,Wr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const rn=new tt;tt.NAMES=nd;let xf=0;class Ui extends zs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=Qn(),this.name="",this.type="Material",this.blending=Cs,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uo,this.blendDst=Fo,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=Ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=os,this.stencilZFail=os,this.stencilZPass=os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){ct(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ct(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(n.blending=this.blending),this.side!==Ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Uo&&(n.blendSrc=this.blendSrc),this.blendDst!==Fo&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ls&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==os&&(n.stencilFail=this.stencilFail),this.stencilZFail!==os&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==os&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends Ui{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zt=new P,Xr=new Te;let gf=0;class Un{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Mc,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyMatrix3(e),this.setXY(t,Xr.x,Xr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix3(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ft(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mc&&(e.usage=this.usage),e}}class id extends Un{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class sd extends Un{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class bt extends Un{constructor(e,t,n){super(new Float32Array(e),t,n)}}let vf=0;const Rn=new Pt,co=new Ht,gs=new P,bn=new ss,Ks=new ss,jt=new P;class Wt extends zs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ed(e)?sd:id)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ft().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,n){return Rn.makeTranslation(e,t,n),this.applyMatrix4(Rn),this}scale(e,t,n){return Rn.makeScale(e,t,n),this.applyMatrix4(Rn),this}lookAt(e){return co.lookAt(e),co.updateMatrix(),this.applyMatrix4(co.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new bt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ct("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ss);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Vt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Vt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Vt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ks.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(bn.min,Ks.min),bn.expandByPoint(jt),jt.addVectors(bn.max,Ks.max),bn.expandByPoint(jt)):(bn.expandByPoint(Ks.min),bn.expandByPoint(Ks.max))}bn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(jt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)jt.fromBufferAttribute(o,l),c&&(gs.fromBufferAttribute(e,l),jt.add(gs)),s=Math.max(s,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Vt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Vt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Un(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new P,c[C]=new P;const l=new P,d=new P,u=new P,p=new Te,m=new Te,g=new Te,M=new P,x=new P;function h(C,b,S){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,S),p.fromBufferAttribute(r,C),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,S),d.sub(l),u.sub(l),m.sub(p),g.sub(p);const L=1/(m.x*g.y-g.x*m.y);isFinite(L)&&(M.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(L),x.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(L),o[C].add(M),o[b].add(M),o[S].add(M),c[C].add(x),c[b].add(x),c[S].add(x))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let C=0,b=_.length;C<b;++C){const S=_[C],L=S.start,F=S.count;for(let W=L,te=L+F;W<te;W+=3)h(e.getX(W+0),e.getX(W+1),e.getX(W+2))}const v=new P,y=new P,E=new P,T=new P;function R(C){E.fromBufferAttribute(s,C),T.copy(E);const b=o[C];v.copy(b),v.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);const L=y.dot(c[C])<0?-1:1;a.setXYZW(C,v.x,v.y,v.z,L)}for(let C=0,b=_.length;C<b;++C){const S=_[C],L=S.start,F=S.count;for(let W=L,te=L+F;W<te;W+=3)R(e.getX(W+0)),R(e.getX(W+1)),R(e.getX(W+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Un(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,d=new P,u=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const g=e.getX(p+0),M=e.getX(p+1),x=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,x),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,x),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(x,l.x,l.y,l.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(p+0,d.x,d.y,d.z),n.setXYZ(p+1,d.x,d.y,d.z),n.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,p=new l.constructor(c.length*d);let m=0,g=0;for(let M=0,x=c.length;M<x;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*d;for(let h=0;h<d;h++)p[g++]=l[m++]}return new Un(p,d,u)}if(this.index===null)return ct("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const p=l[d],m=e(p,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,p=l.length;u<p;u++){const m=l[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let p=0,m=u.length;p<m;p++)d.push(u[p].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Rl=new Pt,Bi=new Yc,Yr=new ks,Pl=new P,qr=new P,Zr=new P,$r=new P,lo=new P,Kr=new P,Ll=new P,Jr=new P;class G extends Ht{constructor(e=new Wt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Kr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(lo.fromBufferAttribute(u,e),a?Kr.addScaledVector(lo,d):Kr.addScaledVector(lo.sub(t),d))}t.add(Kr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(r),Bi.copy(e.ray).recast(e.near),!(Yr.containsPoint(Bi.origin)===!1&&(Bi.intersectSphere(Yr,Pl)===null||Bi.origin.distanceToSquared(Pl)>(e.far-e.near)**2))&&(Rl.copy(r).invert(),Bi.copy(e.ray).applyMatrix4(Rl),!(n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Bi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=p.length;g<M;g++){const x=p[g],h=a[x.materialIndex],_=Math.max(x.start,m.start),v=Math.min(o.count,Math.min(x.start+x.count,m.start+m.count));for(let y=_,E=v;y<E;y+=3){const T=o.getX(y),R=o.getX(y+1),C=o.getX(y+2);s=jr(this,h,e,n,l,d,u,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let x=g,h=M;x<h;x+=3){const _=o.getX(x),v=o.getX(x+1),y=o.getX(x+2);s=jr(this,a,e,n,l,d,u,_,v,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=p.length;g<M;g++){const x=p[g],h=a[x.materialIndex],_=Math.max(x.start,m.start),v=Math.min(c.count,Math.min(x.start+x.count,m.start+m.count));for(let y=_,E=v;y<E;y+=3){const T=y,R=y+1,C=y+2;s=jr(this,h,e,n,l,d,u,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let x=g,h=M;x<h;x+=3){const _=x,v=x+1,y=x+2;s=jr(this,a,e,n,l,d,u,_,v,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function _f(i,e,t,n,s,r,a,o){let c;if(e.side===hn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Ii,o),c===null)return null;Jr.copy(o),Jr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Jr);return l<t.near||l>t.far?null:{distance:l,point:Jr.clone(),object:i}}function jr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,qr),i.getVertexPosition(c,Zr),i.getVertexPosition(l,$r);const d=_f(i,e,t,n,qr,Zr,$r,Ll);if(d){const u=new P;Dn.getBarycoord(Ll,qr,Zr,$r,u),s&&(d.uv=Dn.getInterpolatedAttribute(s,o,c,l,u,new Te)),r&&(d.uv1=Dn.getInterpolatedAttribute(r,o,c,l,u,new Te)),a&&(d.normal=Dn.getInterpolatedAttribute(a,o,c,l,u,new P),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new P,materialIndex:0};Dn.getNormal(qr,Zr,$r,p.normal),d.face=p,d.barycoord=u}return d}class Ie extends Wt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let p=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new bt(l,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(u,2));function g(M,x,h,_,v,y,E,T,R,C,b){const S=y/R,L=E/C,F=y/2,W=E/2,te=T/2,ne=R+1,X=C+1;let Q=0,ie=0;const de=new P;for(let pe=0;pe<X;pe++){const ze=pe*L-W;for(let I=0;I<ne;I++){const ye=I*S-F;de[M]=ye*_,de[x]=ze*v,de[h]=te,l.push(de.x,de.y,de.z),de[M]=0,de[x]=0,de[h]=T>0?1:-1,d.push(de.x,de.y,de.z),u.push(I/R),u.push(1-pe/C),Q+=1}}for(let pe=0;pe<C;pe++)for(let ze=0;ze<R;ze++){const I=p+ze+ne*pe,ye=p+ze+ne*(pe+1),Me=p+(ze+1)+ne*(pe+1),Se=p+(ze+1)+ne*pe;c.push(I,ye,Se),c.push(ye,Me,Se),ie+=6}o.addGroup(m,ie,b),m+=ie,p+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ie(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Fs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(ct("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function xn(i){const e={};for(let t=0;t<i.length;t++){const n=Fs(i[t]);for(const s in n)e[s]=n[s]}return e}function Mf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function rd(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}const wr={clone:Fs,merge:xn};var Sf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ln extends Ui{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sf,this.fragmentShader=yf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fs(e.uniforms),this.uniformsGroups=Mf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ad extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pt,this.projectionMatrix=new Pt,this.projectionMatrixInverse=new Pt,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yi=new P,Dl=new Te,Il=new Te;class wn extends ad{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=br*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return br*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yi.x,yi.y).multiplyScalar(-e/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yi.x,yi.y).multiplyScalar(-e/yi.z)}getViewSize(e,t){return this.getViewBounds(e,Dl,Il),t.subVectors(Il,Dl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(lr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const vs=-90,_s=1;class bf extends Ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new wn(vs,_s,e,t);s.layers=this.layers,this.add(s);const r=new wn(vs,_s,e,t);r.layers=this.layers,this.add(r);const a=new wn(vs,_s,e,t);a.layers=this.layers,this.add(a);const o=new wn(vs,_s,e,t);o.layers=this.layers,this.add(o);const c=new wn(vs,_s,e,t);c.layers=this.layers,this.add(c);const l=new wn(vs,_s,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class od extends dn{constructor(e=[],t=Ds,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wf extends Hn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new od(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ie(5,5,5),r=new ln({name:"CubemapFromEquirect",uniforms:Fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:hn,blending:Jn});r.uniforms.tEquirect.value=t;const a=new G(s,r),o=t.minFilter;return t.minFilter===Zi&&(t.minFilter=In),new bf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class at extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Tf={type:"move"};class ho{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const M of e.hand.values()){const x=t.getJointPose(M,n),h=this._getHandJoint(l,M);x!==null&&(h.matrix.fromArray(x.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=x.radius),h.visible=x!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],p=d.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&p>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&p<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tf)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Zc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new tt(e),this.near=t,this.far=n}clone(){return new Zc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class cd extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ef{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Mc,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const mn=new P;class Ea{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyMatrix4(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyNormalMatrix(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.transformDirection(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ft(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Vn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Vn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Vn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Vn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ta("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Un(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ea(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ta("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ld extends Ui{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ms;const Js=new P,Ss=new P,ys=new P,bs=new Te,js=new Te,hd=new Pt,Qr=new P,Qs=new P,ea=new P,Ul=new Te,uo=new Te,Fl=new Te;class Nl extends Ht{constructor(e=new ld){if(super(),this.isSprite=!0,this.type="Sprite",Ms===void 0){Ms=new Wt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ef(t,5);Ms.setIndex([0,1,2,0,2,3]),Ms.setAttribute("position",new Ea(n,3,0,!1)),Ms.setAttribute("uv",new Ea(n,2,3,!1))}this.geometry=Ms,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Vt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ss.setFromMatrixScale(this.matrixWorld),hd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ys.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ss.multiplyScalar(-ys.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ta(Qr.set(-.5,-.5,0),ys,a,Ss,s,r),ta(Qs.set(.5,-.5,0),ys,a,Ss,s,r),ta(ea.set(.5,.5,0),ys,a,Ss,s,r),Ul.set(0,0),uo.set(1,0),Fl.set(1,1);let o=e.ray.intersectTriangle(Qr,Qs,ea,!1,Js);if(o===null&&(ta(Qs.set(-.5,.5,0),ys,a,Ss,s,r),uo.set(0,1),o=e.ray.intersectTriangle(Qr,ea,Qs,!1,Js),o===null))return;const c=e.ray.origin.distanceTo(Js);c<e.near||c>e.far||t.push({distance:c,point:Js.clone(),uv:Dn.getInterpolation(Js,Qr,Qs,ea,Ul,uo,Fl,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function ta(i,e,t,n,s,r){bs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(js.x=r*bs.x-s*bs.y,js.y=s*bs.x+r*bs.y):js.copy(bs),i.copy(e),i.x+=js.x,i.y+=js.y,i.applyMatrix4(hd)}class dd extends dn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=Tn,d=Tn,u,p){super(null,a,o,c,l,d,s,r,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ol extends Un{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ws=new Pt,Bl=new Pt,na=[],zl=new ss,Af=new Pt,er=new G,tr=new ks;class an extends G{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ol(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Af)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ss),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ws),zl.copy(e.boundingBox).applyMatrix4(ws),this.boundingBox.union(zl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ks),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ws),tr.copy(e.boundingSphere).applyMatrix4(ws),this.boundingSphere.union(tr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(er.geometry=this.geometry,er.material=this.material,er.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),tr.copy(this.boundingSphere),tr.applyMatrix4(n),e.ray.intersectsSphere(tr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ws),Bl.multiplyMatrices(n,ws),er.matrixWorld=Bl,er.raycast(e,na);for(let a=0,o=na.length;a<o;a++){const c=na[a];c.instanceId=r,c.object=this,t.push(c)}na.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ol(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new dd(new Float32Array(s*this.count),s,this.count,Bc,$n));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const fo=new P,Cf=new P,Rf=new ft;class Gi{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=fo.subVectors(n,t).cross(Cf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(fo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Rf.getNormalMatrix(e),s=this.coplanarPoint(fo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zi=new ks,Pf=new Te(.5,.5),ia=new P;class $c{constructor(e=new Gi,t=new Gi,n=new Gi,s=new Gi,r=new Gi,a=new Gi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Kn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],p=r[6],m=r[7],g=r[8],M=r[9],x=r[10],h=r[11],_=r[12],v=r[13],y=r[14],E=r[15];if(s[0].setComponents(l-a,m-d,h-g,E-_).normalize(),s[1].setComponents(l+a,m+d,h+g,E+_).normalize(),s[2].setComponents(l+o,m+u,h+M,E+v).normalize(),s[3].setComponents(l-o,m-u,h-M,E-v).normalize(),n)s[4].setComponents(c,p,x,y).normalize(),s[5].setComponents(l-c,m-p,h-x,E-y).normalize();else if(s[4].setComponents(l-c,m-p,h-x,E-y).normalize(),t===Kn)s[5].setComponents(l+c,m+p,h+x,E+y).normalize();else if(t===ba)s[5].setComponents(c,p,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(e){zi.center.set(0,0,0);const t=Pf.distanceTo(e.center);return zi.radius=.7071067811865476+t,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ia.x=s.normal.x>0?e.max.x:e.min.x,ia.y=s.normal.y>0?e.max.y:e.min.y,ia.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ia)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Sc extends Ui{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Aa=new P,Ca=new P,kl=new Pt,nr=new Yc,sa=new ks,po=new P,Vl=new P;class Gl extends Ht{constructor(e=new Wt,t=new Sc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Aa.fromBufferAttribute(t,s-1),Ca.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Aa.distanceTo(Ca);e.setAttribute("lineDistance",new bt(n,1))}else ct("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(s),sa.radius+=r,e.ray.intersectsSphere(sa)===!1)return;kl.copy(s).invert(),nr.copy(e.ray).applyMatrix4(kl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,p=n.attributes.position;if(d!==null){const m=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let M=m,x=g-1;M<x;M+=l){const h=d.getX(M),_=d.getX(M+1),v=ra(this,e,nr,c,h,_,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(g-1),x=d.getX(m),h=ra(this,e,nr,c,M,x,g-1);h&&t.push(h)}}else{const m=Math.max(0,a.start),g=Math.min(p.count,a.start+a.count);for(let M=m,x=g-1;M<x;M+=l){const h=ra(this,e,nr,c,M,M+1,M);h&&t.push(h)}if(this.isLineLoop){const M=ra(this,e,nr,c,g-1,m,g-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ra(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Aa.fromBufferAttribute(o,s),Ca.fromBufferAttribute(o,r),t.distanceSqToSegment(Aa,Ca,po,Vl)>n)return;po.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(po);if(!(l<e.near||l>e.far))return{distance:l,point:Vl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class $t extends dn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ud extends dn{constructor(e,t,n=ts,s,r,a,o=Tn,c=Tn,l,d=Mr,u=1){if(d!==Mr&&d!==Sr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Xc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class fd extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class fn extends Wt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new P,d=new Te;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const m=n+u/t*s;l.x=e*Math.cos(m),l.y=e*Math.sin(m),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[p]/e+1)/2,d.y=(a[p+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(o,3)),this.setAttribute("uv",new bt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ht extends Wt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],p=[],m=[];let g=0;const M=[],x=n/2;let h=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new bt(u,3)),this.setAttribute("normal",new bt(p,3)),this.setAttribute("uv",new bt(m,2));function _(){const y=new P,E=new P;let T=0;const R=(t-e)/n;for(let C=0;C<=r;C++){const b=[],S=C/r,L=S*(t-e)+e;for(let F=0;F<=s;F++){const W=F/s,te=W*c+o,ne=Math.sin(te),X=Math.cos(te);E.x=L*ne,E.y=-S*n+x,E.z=L*X,u.push(E.x,E.y,E.z),y.set(ne,R,X).normalize(),p.push(y.x,y.y,y.z),m.push(W,1-S),b.push(g++)}M.push(b)}for(let C=0;C<s;C++)for(let b=0;b<r;b++){const S=M[b][C],L=M[b+1][C],F=M[b+1][C+1],W=M[b][C+1];(e>0||b!==0)&&(d.push(S,L,W),T+=3),(t>0||b!==r-1)&&(d.push(L,F,W),T+=3)}l.addGroup(h,T,0),h+=T}function v(y){const E=g,T=new Te,R=new P;let C=0;const b=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,x*S,0),p.push(0,S,0),m.push(.5,.5),g++;const L=g;for(let F=0;F<=s;F++){const te=F/s*c+o,ne=Math.cos(te),X=Math.sin(te);R.x=b*X,R.y=x*S,R.z=b*ne,u.push(R.x,R.y,R.z),p.push(0,S,0),T.x=ne*.5+.5,T.y=X*.5*S+.5,m.push(T.x,T.y),g++}for(let F=0;F<s;F++){const W=E+F,te=L+F;y===!0?d.push(te,te+1,W):d.push(te+1,te,W),C+=3}l.addGroup(h,C,y===!0?1:2),h+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ji extends ht{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ji(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fa extends Wt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new bt(r,3)),this.setAttribute("normal",new bt(r.slice(),3)),this.setAttribute("uv",new bt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const v=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],y),m(t[T+2],E),c(v,y,E,_)}function c(_,v,y,E){const T=E+1,R=[];for(let C=0;C<=T;C++){R[C]=[];const b=_.clone().lerp(y,C/T),S=v.clone().lerp(y,C/T),L=T-C;for(let F=0;F<=L;F++)F===0&&C===T?R[C][F]=b:R[C][F]=b.clone().lerp(S,F/L)}for(let C=0;C<T;C++)for(let b=0;b<2*(T-C)-1;b++){const S=Math.floor(b/2);b%2===0?(p(R[C][S+1]),p(R[C+1][S]),p(R[C][S])):(p(R[C][S+1]),p(R[C+1][S+1]),p(R[C+1][S]))}}function l(_){const v=new P;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function d(){const _=new P;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=x(_)/2/Math.PI+.5,E=h(_)/Math.PI+.5;a.push(y,1-E)}g(),u()}function u(){for(let _=0;_<a.length;_+=6){const v=a[_+0],y=a[_+2],E=a[_+4],T=Math.max(v,y,E),R=Math.min(v,y,E);T>.9&&R<.1&&(v<.2&&(a[_+0]+=1),y<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function p(_){r.push(_.x,_.y,_.z)}function m(_,v){const y=_*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function g(){const _=new P,v=new P,y=new P,E=new P,T=new Te,R=new Te,C=new Te;for(let b=0,S=0;b<r.length;b+=9,S+=6){_.set(r[b+0],r[b+1],r[b+2]),v.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(a[S+0],a[S+1]),R.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),E.copy(_).add(v).add(y).divideScalar(3);const L=x(E);M(T,S+0,_,L),M(R,S+2,v,L),M(C,S+4,y,L)}}function M(_,v,y,E){E<0&&_.x===1&&(a[v]=_.x-1),y.x===0&&y.z===0&&(a[v]=E/2/Math.PI+.5)}function x(_){return Math.atan2(_.z,-_.x)}function h(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fa(e.vertices,e.indices,e.radius,e.details)}}class Kc extends Fa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Kc(e.radius,e.detail)}}class ni{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ct("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],p=n[s+1]-d,m=(a-d)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Te:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new P,s=[],r=[],a=[],o=new P,c=new Pt;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),p<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(gt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(gt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Jc extends ni{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=c-this.aX,m=l-this.aY;c=p*d-m*u+this.aX,l=p*u+m*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Lf extends Jc{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function jc(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let p=(a-r)/l-(o-r)/(l+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+u)+(c-o)/u;p*=d,m*=d,s(a,o,p,m)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const aa=new P,mo=new jc,xo=new jc,go=new jc;class Df extends ni{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(aa.subVectors(s[0],s[1]).add(s[0]),l=aa);const u=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(aa.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=aa),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),M=Math.pow(u.distanceToSquared(p),m),x=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),g<1e-4&&(g=M),x<1e-4&&(x=M),mo.initNonuniformCatmullRom(l.x,u.x,p.x,d.x,g,M,x),xo.initNonuniformCatmullRom(l.y,u.y,p.y,d.y,g,M,x),go.initNonuniformCatmullRom(l.z,u.z,p.z,d.z,g,M,x)}else this.curveType==="catmullrom"&&(mo.initCatmullRom(l.x,u.x,p.x,d.x,this.tension),xo.initCatmullRom(l.y,u.y,p.y,d.y,this.tension),go.initCatmullRom(l.z,u.z,p.z,d.z,this.tension));return n.set(mo.calc(c),xo.calc(c),go.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Hl(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function If(i,e){const t=1-i;return t*t*e}function Uf(i,e){return 2*(1-i)*i*e}function Ff(i,e){return i*i*e}function dr(i,e,t,n){return If(i,e)+Uf(i,t)+Ff(i,n)}function Nf(i,e){const t=1-i;return t*t*t*e}function Of(i,e){const t=1-i;return 3*t*t*i*e}function Bf(i,e){return 3*(1-i)*i*i*e}function zf(i,e){return i*i*i*e}function ur(i,e,t,n,s){return Nf(i,e)+Of(i,t)+Bf(i,n)+zf(i,s)}class pd extends ni{constructor(e=new Te,t=new Te,n=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ur(e,s.x,r.x,a.x,o.x),ur(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class kf extends ni{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ur(e,s.x,r.x,a.x,o.x),ur(e,s.y,r.y,a.y,o.y),ur(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class md extends ni{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vf extends ni{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class xd extends ni{constructor(e=new Te,t=new Te,n=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(dr(e,s.x,r.x,a.x),dr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gf extends ni{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(dr(e,s.x,r.x,a.x),dr(e,s.y,r.y,a.y),dr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gd extends ni{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Hl(o,c.x,l.x,d.x,u.x),Hl(o,c.y,l.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Te().fromArray(s))}return this}}var Wl=Object.freeze({__proto__:null,ArcCurve:Lf,CatmullRomCurve3:Df,CubicBezierCurve:pd,CubicBezierCurve3:kf,EllipseCurve:Jc,LineCurve:md,LineCurve3:Vf,QuadraticBezierCurve:xd,QuadraticBezierCurve3:Gf,SplineCurve:gd});class Hf extends ni{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Wl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Wl[s.type]().fromJSON(s))}return this}}class Xl extends Hf{constructor(e){super(),this.type="Path",this.currentPoint=new Te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new md(this.currentPoint.clone(),new Te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new xd(this.currentPoint.clone(),new Te(e,t),new Te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new pd(this.currentPoint.clone(),new Te(e,t),new Te(n,s),new Te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new gd(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new Jc(e,t,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Qc extends Xl{constructor(e){super(e),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Xl().fromJSON(s))}return this}}function Wf(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=vd(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=$f(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let d=o,u=c;for(let p=t;p<s;p+=t){const m=i[p],g=i[p+1];m<o&&(o=m),g<c&&(c=g),m>d&&(d=m),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return Tr(r,a,t,o,c,l,0),a}function vd(i,e,t,n,s){let r;if(s===a0(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Yl(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Yl(a/n|0,i[a],i[a+1],r);return r&&Ns(r,r.next)&&(Ar(r),r=r.next),r}function ns(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ns(t,t.next)||Gt(t.prev,t,t.next)===0)){if(Ar(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Tr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&e0(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Yf(i,n,s,r):Xf(i)){e.push(c.i,i.i,l.i),Ar(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=qf(ns(i),e),Tr(i,e,t,n,s,r,2)):a===2&&Zf(i,e,t,n,s,r):Tr(ns(i),e,t,n,s,r,1);break}}}function Xf(i){const e=i.prev,t=i,n=i.next;if(Gt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),p=Math.max(s,r,a),m=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=p&&g.y>=u&&g.y<=m&&ar(s,o,r,c,a,l,g.x,g.y)&&Gt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Yf(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Gt(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,p=a.y,m=Math.min(o,c,l),g=Math.min(d,u,p),M=Math.max(o,c,l),x=Math.max(d,u,p),h=yc(m,g,e,t,n),_=yc(M,x,e,t,n);let v=i.prevZ,y=i.nextZ;for(;v&&v.z>=h&&y&&y.z<=_;){if(v.x>=m&&v.x<=M&&v.y>=g&&v.y<=x&&v!==s&&v!==a&&ar(o,d,c,u,l,p,v.x,v.y)&&Gt(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=m&&y.x<=M&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&ar(o,d,c,u,l,p,y.x,y.y)&&Gt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=h;){if(v.x>=m&&v.x<=M&&v.y>=g&&v.y<=x&&v!==s&&v!==a&&ar(o,d,c,u,l,p,v.x,v.y)&&Gt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=m&&y.x<=M&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&ar(o,d,c,u,l,p,y.x,y.y)&&Gt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function qf(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ns(n,s)&&Md(n,t,t.next,s)&&Er(n,s)&&Er(s,n)&&(e.push(n.i,t.i,s.i),Ar(t),Ar(t.next),t=i=s),t=t.next}while(t!==i);return ns(t)}function Zf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&i0(a,o)){let c=Sd(a,o);a=ns(a,a.next),c=ns(c,c.next),Tr(a,e,t,n,s,r,0),Tr(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function $f(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=vd(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(n0(l))}s.sort(Kf);for(let r=0;r<s.length;r++)t=Jf(s[r],t);return t}function Kf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Jf(i,e){const t=jf(i,e);if(!t)return e;const n=Sd(t,i);return ns(n,n.next),ns(t,t.next)}function jf(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ns(i,t))return t;do{if(Ns(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&_d(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);Er(t,i)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&Qf(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function Qf(i,e){return Gt(i.prev,i,e.prev)<0&&Gt(e.next,i,i.next)<0}function e0(i,e,t,n){let s=i;do s.z===0&&(s.z=yc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,t0(s)}function t0(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function yc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function n0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function _d(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ar(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&_d(i,e,t,n,s,r,a,o)}function i0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!s0(i,e)&&(Er(i,e)&&Er(e,i)&&r0(i,e)&&(Gt(i.prev,i,e.prev)||Gt(i,e.prev,e))||Ns(i,e)&&Gt(i.prev,i,i.next)>0&&Gt(e.prev,e,e.next)>0)}function Gt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ns(i,e){return i.x===e.x&&i.y===e.y}function Md(i,e,t,n){const s=ca(Gt(i,e,t)),r=ca(Gt(i,e,n)),a=ca(Gt(t,n,i)),o=ca(Gt(t,n,e));return!!(s!==r&&a!==o||s===0&&oa(i,t,e)||r===0&&oa(i,n,e)||a===0&&oa(t,i,n)||o===0&&oa(t,e,n))}function oa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ca(i){return i>0?1:i<0?-1:0}function s0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Md(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Er(i,e){return Gt(i.prev,i,i.next)<0?Gt(i,e,i.next)>=0&&Gt(i,i.prev,e)>=0:Gt(i,e,i.prev)<0||Gt(i,i.next,e)<0}function r0(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Sd(i,e){const t=bc(i.i,i.x,i.y),n=bc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Yl(i,e,t,n){const s=bc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ar(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function bc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function a0(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class o0{static triangulate(e,t,n=2){return Wf(e,t,n)}}class fr{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return fr.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];ql(e),Zl(n,e);let a=e.length;t.forEach(ql);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,Zl(n,t[c]);const o=o0.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function ql(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Zl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Na extends Fa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Na(e.radius,e.detail)}}class zt extends Wt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=e/o,p=t/c,m=[],g=[],M=[],x=[];for(let h=0;h<d;h++){const _=h*p-a;for(let v=0;v<l;v++){const y=v*u-r;g.push(y,-_,0),M.push(0,0,1),x.push(v/o),x.push(1-h/c)}}for(let h=0;h<c;h++)for(let _=0;_<o;_++){const v=_+l*h,y=_+l*(h+1),E=_+1+l*(h+1),T=_+1+l*h;m.push(v,y,T),m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new bt(g,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Oa extends Wt{constructor(e=new Qc([new Te(0,.5),new Te(-.5,-.5),new Te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(r,3)),this.setAttribute("uv",new bt(a,2));function l(d){const u=s.length/3,p=d.extractPoints(t);let m=p.shape;const g=p.holes;fr.isClockWise(m)===!1&&(m=m.reverse());for(let x=0,h=g.length;x<h;x++){const _=g[x];fr.isClockWise(_)===!0&&(g[x]=_.reverse())}const M=fr.triangulateShape(m,g);for(let x=0,h=g.length;x<h;x++){const _=g[x];m=m.concat(_)}for(let x=0,h=m.length;x<h;x++){const _=m[x];s.push(_.x,_.y,0),r.push(0,0,1),a.push(_.x,_.y)}for(let x=0,h=M.length;x<h;x++){const _=M[x],v=_[0]+u,y=_[1]+u,E=_[2]+u;n.push(v,y,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return c0(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Oa(n,e.curveSegments)}}function c0(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Xt extends Wt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new P,p=new P,m=[],g=[],M=[],x=[];for(let h=0;h<=n;h++){const _=[],v=h/n;let y=0;h===0&&a===0?y=.5/t:h===n&&c===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),p.copy(u).normalize(),M.push(p.x,p.y,p.z),x.push(T+y,1-v),_.push(l++)}d.push(_)}for(let h=0;h<n;h++)for(let _=0;_<t;_++){const v=d[h][_+1],y=d[h][_],E=d[h+1][_],T=d[h+1][_+1];(h!==0||a>0)&&m.push(v,y,T),(h!==n-1||c<Math.PI)&&m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new bt(g,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Os extends Wt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new P,u=new P,p=new P;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const M=g/s*r,x=m/n*Math.PI*2;u.x=(e+t*Math.cos(x))*Math.cos(M),u.y=(e+t*Math.cos(x))*Math.sin(M),u.z=t*Math.sin(x),o.push(u.x,u.y,u.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),l.push(g/s),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const M=(s+1)*m+g-1,x=(s+1)*(m-1)+g-1,h=(s+1)*(m-1)+g,_=(s+1)*m+g;a.push(M,x,_),a.push(x,h,_)}this.setIndex(a),this.setAttribute("position",new bt(o,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Os(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class l0 extends ln{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class q extends Ui{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class h0 extends Ui{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hc,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class d0 extends Ui{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class u0 extends Ui{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class el extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class f0 extends el{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const vo=new Pt,$l=new P,Kl=new P;class yd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=ti,this.map=null,this.mapPass=null,this.matrix=new Pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $c,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;$l.setFromMatrixPosition(e.matrixWorld),t.position.copy($l),Kl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kl),t.updateMatrixWorld(),vo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Jl=new Pt,ir=new P,_o=new P;class p0 extends yd{constructor(){super(new wn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new Ot(2,1,1,1),new Ot(0,1,1,1),new Ot(3,1,1,1),new Ot(1,1,1,1),new Ot(3,0,1,1),new Ot(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ir.setFromMatrixPosition(e.matrixWorld),n.position.copy(ir),_o.copy(n.position),_o.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(_o),n.updateMatrixWorld(),s.makeTranslation(-ir.x,-ir.y,-ir.z),Jl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jl,n.coordinateSystem,n.reversedDepth)}}class tl extends el{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new p0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class nl extends ad{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class m0 extends yd{constructor(){super(new nl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Mo extends el{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new m0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class x0 extends wn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class bd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const jl=new Pt;class g0{constructor(e,t,n=0,s=1/0){this.ray=new Yc(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new qc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Vt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return jl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(jl),this}intersectObject(e,t=!0,n=[]){return wc(e,this,n,t),n.sort(Ql),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)wc(e[s],this,n,t);return n.sort(Ql),n}}function Ql(i,e){return i.distance-e.distance}function wc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)wc(r[a],e,t,!0)}}function eh(i,e,t,n){const s=v0(n);switch(t){case Jh:return i*e;case Bc:return i*e/s.components*s.byteLength;case zc:return i*e/s.components*s.byteLength;case kc:return i*e*2/s.components*s.byteLength;case Vc:return i*e*2/s.components*s.byteLength;case jh:return i*e*3/s.components*s.byteLength;case Gn:return i*e*4/s.components*s.byteLength;case Gc:return i*e*4/s.components*s.byteLength;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case xa:case ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qo:case $o:return Math.max(i,16)*Math.max(e,8)/4;case Yo:case Zo:return Math.max(i,8)*Math.max(e,8)/2;case Ko:case Jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ec:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case tc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case nc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ic:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case sc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case rc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ac:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case cc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case hc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case dc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case uc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case fc:case pc:case mc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case xc:case gc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case vc:case _c:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function v0(i){switch(i){case ti:case qh:return{byteLength:1,components:1};case vr:case Zh:case jn:return{byteLength:2,components:1};case Nc:case Oc:return{byteLength:2,components:4};case ts:case Fc:case $n:return{byteLength:4,components:1};case $h:case Kh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Dc}}));typeof window<"u"&&(window.__THREE__?ct("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Dc);function wd(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function _0(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,d),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<u.length;m++){const g=u[p],M=u[m];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++p,u[p]=M)}u.length=p+1;for(let m=0,g=u.length;m<g;m++){const M=u[m];i.bufferSubData(l,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var M0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,S0=`#ifdef USE_ALPHAHASH
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
#endif`,y0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,b0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,T0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,E0=`#ifdef USE_AOMAP
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
#endif`,A0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,C0=`#ifdef USE_BATCHING
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
#endif`,R0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,P0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,L0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,D0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,I0=`#ifdef USE_IRIDESCENCE
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
#endif`,U0=`#ifdef USE_BUMPMAP
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
#endif`,F0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,O0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,B0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,z0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,k0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,V0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,G0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,H0=`#define PI 3.141592653589793
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
} // validated`,W0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,X0=`vec3 transformedNormal = objectNormal;
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
#endif`,Y0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,q0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Z0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,K0="gl_FragColor = linearToOutputTexel( gl_FragColor );",J0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,j0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,tp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,np=`#ifdef USE_ENVMAP
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
#endif`,ip=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,op=`#ifdef USE_GRADIENTMAP
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
}`,cp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dp=`uniform bool receiveShadow;
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
#endif`,up=`#ifdef USE_ENVMAP
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
#endif`,fp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gp=`PhysicalMaterial material;
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
#endif`,vp=`uniform sampler2D dfgLUT;
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
}`,_p=`
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
#endif`,Mp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ep=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ap=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rp=`#if defined( USE_POINTS_UV )
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
#endif`,Pp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Up=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fp=`#ifdef USE_MORPHTARGETS
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
#endif`,Np=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Op=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gp=`#ifdef USE_NORMALMAP
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
#endif`,Hp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$p=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sm=`float getShadowMask() {
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
}`,rm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,am=`#ifdef USE_SKINNING
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
#endif`,om=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cm=`#ifdef USE_SKINNING
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
#endif`,lm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,um=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _m=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mm=`uniform sampler2D t2D;
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
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ym=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tm=`#include <common>
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
}`,Em=`#if DEPTH_PACKING == 3200
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
}`,Am=`#define DISTANCE
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
}`,Cm=`#define DISTANCE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lm=`uniform float scale;
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Im=`#include <common>
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
}`,Um=`uniform vec3 diffuse;
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
}`,Fm=`#define LAMBERT
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
}`,Nm=`#define LAMBERT
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
}`,Om=`#define MATCAP
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
}`,Bm=`#define MATCAP
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
}`,zm=`#define NORMAL
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
}`,km=`#define NORMAL
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
}`,Vm=`#define PHONG
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
}`,Gm=`#define PHONG
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
}`,Hm=`#define STANDARD
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
}`,Wm=`#define STANDARD
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
}`,Xm=`#define TOON
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
}`,Ym=`#define TOON
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
}`,qm=`uniform float size;
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
}`,Zm=`uniform vec3 diffuse;
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
}`,$m=`#include <common>
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
}`,Km=`uniform vec3 color;
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
}`,Jm=`uniform float rotation;
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
}`,jm=`uniform vec3 diffuse;
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
}`,xt={alphahash_fragment:M0,alphahash_pars_fragment:S0,alphamap_fragment:y0,alphamap_pars_fragment:b0,alphatest_fragment:w0,alphatest_pars_fragment:T0,aomap_fragment:E0,aomap_pars_fragment:A0,batching_pars_vertex:C0,batching_vertex:R0,begin_vertex:P0,beginnormal_vertex:L0,bsdfs:D0,iridescence_fragment:I0,bumpmap_pars_fragment:U0,clipping_planes_fragment:F0,clipping_planes_pars_fragment:N0,clipping_planes_pars_vertex:O0,clipping_planes_vertex:B0,color_fragment:z0,color_pars_fragment:k0,color_pars_vertex:V0,color_vertex:G0,common:H0,cube_uv_reflection_fragment:W0,defaultnormal_vertex:X0,displacementmap_pars_vertex:Y0,displacementmap_vertex:q0,emissivemap_fragment:Z0,emissivemap_pars_fragment:$0,colorspace_fragment:K0,colorspace_pars_fragment:J0,envmap_fragment:j0,envmap_common_pars_fragment:Q0,envmap_pars_fragment:ep,envmap_pars_vertex:tp,envmap_physical_pars_fragment:up,envmap_vertex:np,fog_vertex:ip,fog_pars_vertex:sp,fog_fragment:rp,fog_pars_fragment:ap,gradientmap_pars_fragment:op,lightmap_pars_fragment:cp,lights_lambert_fragment:lp,lights_lambert_pars_fragment:hp,lights_pars_begin:dp,lights_toon_fragment:fp,lights_toon_pars_fragment:pp,lights_phong_fragment:mp,lights_phong_pars_fragment:xp,lights_physical_fragment:gp,lights_physical_pars_fragment:vp,lights_fragment_begin:_p,lights_fragment_maps:Mp,lights_fragment_end:Sp,logdepthbuf_fragment:yp,logdepthbuf_pars_fragment:bp,logdepthbuf_pars_vertex:wp,logdepthbuf_vertex:Tp,map_fragment:Ep,map_pars_fragment:Ap,map_particle_fragment:Cp,map_particle_pars_fragment:Rp,metalnessmap_fragment:Pp,metalnessmap_pars_fragment:Lp,morphinstance_vertex:Dp,morphcolor_vertex:Ip,morphnormal_vertex:Up,morphtarget_pars_vertex:Fp,morphtarget_vertex:Np,normal_fragment_begin:Op,normal_fragment_maps:Bp,normal_pars_fragment:zp,normal_pars_vertex:kp,normal_vertex:Vp,normalmap_pars_fragment:Gp,clearcoat_normal_fragment_begin:Hp,clearcoat_normal_fragment_maps:Wp,clearcoat_pars_fragment:Xp,iridescence_pars_fragment:Yp,opaque_fragment:qp,packing:Zp,premultiplied_alpha_fragment:$p,project_vertex:Kp,dithering_fragment:Jp,dithering_pars_fragment:jp,roughnessmap_fragment:Qp,roughnessmap_pars_fragment:em,shadowmap_pars_fragment:tm,shadowmap_pars_vertex:nm,shadowmap_vertex:im,shadowmask_pars_fragment:sm,skinbase_vertex:rm,skinning_pars_vertex:am,skinning_vertex:om,skinnormal_vertex:cm,specularmap_fragment:lm,specularmap_pars_fragment:hm,tonemapping_fragment:dm,tonemapping_pars_fragment:um,transmission_fragment:fm,transmission_pars_fragment:pm,uv_pars_fragment:mm,uv_pars_vertex:xm,uv_vertex:gm,worldpos_vertex:vm,background_vert:_m,background_frag:Mm,backgroundCube_vert:Sm,backgroundCube_frag:ym,cube_vert:bm,cube_frag:wm,depth_vert:Tm,depth_frag:Em,distanceRGBA_vert:Am,distanceRGBA_frag:Cm,equirect_vert:Rm,equirect_frag:Pm,linedashed_vert:Lm,linedashed_frag:Dm,meshbasic_vert:Im,meshbasic_frag:Um,meshlambert_vert:Fm,meshlambert_frag:Nm,meshmatcap_vert:Om,meshmatcap_frag:Bm,meshnormal_vert:zm,meshnormal_frag:km,meshphong_vert:Vm,meshphong_frag:Gm,meshphysical_vert:Hm,meshphysical_frag:Wm,meshtoon_vert:Xm,meshtoon_frag:Ym,points_vert:qm,points_frag:Zm,shadow_vert:$m,shadow_frag:Km,sprite_vert:Jm,sprite_frag:jm},Ue={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},qn={basic:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:xt.meshbasic_vert,fragmentShader:xt.meshbasic_frag},lambert:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)}}]),vertexShader:xt.meshlambert_vert,fragmentShader:xt.meshlambert_frag},phong:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:xt.meshphong_vert,fragmentShader:xt.meshphong_frag},standard:{uniforms:xn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag},toon:{uniforms:xn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)}}]),vertexShader:xt.meshtoon_vert,fragmentShader:xt.meshtoon_frag},matcap:{uniforms:xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:xt.meshmatcap_vert,fragmentShader:xt.meshmatcap_frag},points:{uniforms:xn([Ue.points,Ue.fog]),vertexShader:xt.points_vert,fragmentShader:xt.points_frag},dashed:{uniforms:xn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xt.linedashed_vert,fragmentShader:xt.linedashed_frag},depth:{uniforms:xn([Ue.common,Ue.displacementmap]),vertexShader:xt.depth_vert,fragmentShader:xt.depth_frag},normal:{uniforms:xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:xt.meshnormal_vert,fragmentShader:xt.meshnormal_frag},sprite:{uniforms:xn([Ue.sprite,Ue.fog]),vertexShader:xt.sprite_vert,fragmentShader:xt.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xt.background_vert,fragmentShader:xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:xt.backgroundCube_vert,fragmentShader:xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xt.cube_vert,fragmentShader:xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xt.equirect_vert,fragmentShader:xt.equirect_frag},distanceRGBA:{uniforms:xn([Ue.common,Ue.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xt.distanceRGBA_vert,fragmentShader:xt.distanceRGBA_frag},shadow:{uniforms:xn([Ue.lights,Ue.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:xt.shadow_vert,fragmentShader:xt.shadow_frag}};qn.physical={uniforms:xn([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag};const la={r:0,b:0,g:0},ki=new Xn,Qm=new Pt;function ex(i,e,t,n,s,r,a){const o=new tt(0);let c=r===!0?0:1,l,d,u=null,p=0,m=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function M(v){let y=!1;const E=g(v);E===null?h(o,c):E&&E.isColor&&(h(E,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,y){const E=g(y);E&&(E.isCubeTexture||E.mapping===Ua)?(d===void 0&&(d=new G(new Ie(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:Fs(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ki.copy(y.backgroundRotation),ki.x*=-1,ki.y*=-1,ki.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ki.y*=-1,ki.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(ki)),d.material.toneMapped=Et.getTransfer(E.colorSpace)!==Ut,(u!==E||p!==E.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,p=E.version,m=i.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new G(new zt(2,2),new ln({name:"BackgroundMaterial",uniforms:Fs(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Et.getTransfer(E.colorSpace)!==Ut,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||p!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,p=E.version,m=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function h(v,y){v.getRGB(la,rd(i)),n.buffers.color.setClear(la.r,la.g,la.b,y,a)}function _(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,h(o,c)},render:M,addToRenderList:x,dispose:_}}function tx(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(S,L,F,W,te){let ne=!1;const X=u(W,F,L);r!==X&&(r=X,l(r.object)),ne=m(S,W,F,te),ne&&g(S,W,F,te),te!==null&&e.update(te,i.ELEMENT_ARRAY_BUFFER),(ne||a)&&(a=!1,y(S,L,F,W),te!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function d(S){return i.deleteVertexArray(S)}function u(S,L,F){const W=F.wireframe===!0;let te=n[S.id];te===void 0&&(te={},n[S.id]=te);let ne=te[L.id];ne===void 0&&(ne={},te[L.id]=ne);let X=ne[W];return X===void 0&&(X=p(c()),ne[W]=X),X}function p(S){const L=[],F=[],W=[];for(let te=0;te<t;te++)L[te]=0,F[te]=0,W[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:W,object:S,attributes:{},index:null}}function m(S,L,F,W){const te=r.attributes,ne=L.attributes;let X=0;const Q=F.getAttributes();for(const ie in Q)if(Q[ie].location>=0){const pe=te[ie];let ze=ne[ie];if(ze===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&(ze=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&(ze=S.instanceColor)),pe===void 0||pe.attribute!==ze||ze&&pe.data!==ze.data)return!0;X++}return r.attributesNum!==X||r.index!==W}function g(S,L,F,W){const te={},ne=L.attributes;let X=0;const Q=F.getAttributes();for(const ie in Q)if(Q[ie].location>=0){let pe=ne[ie];pe===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&(pe=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&(pe=S.instanceColor));const ze={};ze.attribute=pe,pe&&pe.data&&(ze.data=pe.data),te[ie]=ze,X++}r.attributes=te,r.attributesNum=X,r.index=W}function M(){const S=r.newAttributes;for(let L=0,F=S.length;L<F;L++)S[L]=0}function x(S){h(S,0)}function h(S,L){const F=r.newAttributes,W=r.enabledAttributes,te=r.attributeDivisors;F[S]=1,W[S]===0&&(i.enableVertexAttribArray(S),W[S]=1),te[S]!==L&&(i.vertexAttribDivisor(S,L),te[S]=L)}function _(){const S=r.newAttributes,L=r.enabledAttributes;for(let F=0,W=L.length;F<W;F++)L[F]!==S[F]&&(i.disableVertexAttribArray(F),L[F]=0)}function v(S,L,F,W,te,ne,X){X===!0?i.vertexAttribIPointer(S,L,F,te,ne):i.vertexAttribPointer(S,L,F,W,te,ne)}function y(S,L,F,W){M();const te=W.attributes,ne=F.getAttributes(),X=L.defaultAttributeValues;for(const Q in ne){const ie=ne[Q];if(ie.location>=0){let de=te[Q];if(de===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const pe=de.normalized,ze=de.itemSize,I=e.get(de);if(I===void 0)continue;const ye=I.buffer,Me=I.type,Se=I.bytesPerElement,Z=Me===i.INT||Me===i.UNSIGNED_INT||de.gpuType===Fc;if(de.isInterleavedBufferAttribute){const K=de.data,_e=K.stride,be=de.offset;if(K.isInstancedInterleavedBuffer){for(let Le=0;Le<ie.locationSize;Le++)h(ie.location+Le,K.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Le=0;Le<ie.locationSize;Le++)x(ie.location+Le);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let Le=0;Le<ie.locationSize;Le++)v(ie.location+Le,ze/ie.locationSize,Me,pe,_e*Se,(be+ze/ie.locationSize*Le)*Se,Z)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ie.locationSize;K++)h(ie.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ie.locationSize;K++)x(ie.location+K);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let K=0;K<ie.locationSize;K++)v(ie.location+K,ze/ie.locationSize,Me,pe,ze*Se,ze/ie.locationSize*K*Se,Z)}}else if(X!==void 0){const pe=X[Q];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(ie.location,pe);break;case 3:i.vertexAttrib3fv(ie.location,pe);break;case 4:i.vertexAttrib4fv(ie.location,pe);break;default:i.vertexAttrib1fv(ie.location,pe)}}}}_()}function E(){C();for(const S in n){const L=n[S];for(const F in L){const W=L[F];for(const te in W)d(W[te].object),delete W[te];delete L[F]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const L=n[S.id];for(const F in L){const W=L[F];for(const te in W)d(W[te].object),delete W[te];delete L[F]}delete n[S.id]}function R(S){for(const L in n){const F=n[L];if(F[S.id]===void 0)continue;const W=F[S.id];for(const te in W)d(W[te].object),delete W[te];delete F[S.id]}}function C(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:x,disableUnusedAttributes:_}}function nx(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),t.update(d,n,u))}function o(l,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let m=0;for(let g=0;g<u;g++)m+=d[g];t.update(m,n,1)}function c(l,d,u,p){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],d[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,d,0,p,0,u);let g=0;for(let M=0;M<u;M++)g+=d[M]*p[M];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function ix(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Gn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===jn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==ti&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==$n&&!C)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(ct("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:x,maxAttributes:h,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function sx(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Gi,o=new ft,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const m=u.length!==0||p||n!==0||s;return s=p,n=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=d(u,p,0)},this.setState=function(u,p,m){const g=u.clippingPlanes,M=u.clipIntersection,x=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!x)r?d(null):l();else{const _=r?0:n,v=_*4;let y=h.clippingState||null;c.value=y,y=d(g,p,v,m);for(let E=0;E!==v;++E)y[E]=t[E];h.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,p,m,g){const M=u!==null?u.length:0;let x=null;if(M!==0){if(x=c.value,g!==!0||x===null){const h=m+M*4,_=p.matrixWorldInverse;o.getNormalMatrix(_),(x===null||x.length<h)&&(x=new Float32Array(h));for(let v=0,y=m;v!==M;++v,y+=4)a.copy(u[v]).applyMatrix4(_,o),a.normal.toArray(x,y),x[y+3]=a.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,x}}function rx(i){let e=new WeakMap;function t(a,o){return o===Ho?a.mapping=Ds:o===Wo&&(a.mapping=Is),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ho||o===Wo)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new wf(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ci=4,th=[.125,.215,.35,.446,.526,.582],qi=20,ax=256,sr=new nl,nh=new tt;let So=null,yo=0,bo=0,wo=!1;const ox=new P;class Tc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=ox}=r;So=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),bo=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(So,yo,bo),this._renderer.xr.enabled=wo,e.scissorTest=!1,Ts(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ds||e.mapping===Is?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),So=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),bo=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:In,minFilter:In,generateMipmaps:!1,type:jn,format:Gn,colorSpace:Us,depthBuffer:!1},s=ih(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ih(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=cx(r)),this._blurMaterial=hx(r,e,t),this._ggxMaterial=lx(r,e,t)}return s}_compileMaterial(e){const t=new G(new Wt,e);this._renderer.compile(t,sr)}_sceneToCubeUV(e,t,n,s,r){const c=new wn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,m=u.toneMapping;u.getClearColor(nh),u.toneMapping=Pi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new G(new Ie,new Rt({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,x=M.material;let h=!1;const _=e.background;_?_.isColor&&(x.color.copy(_),e.background=null,h=!0):(x.color.copy(nh),h=!0);for(let v=0;v<6;v++){const y=v%3;y===0?(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[v],r.y,r.z)):y===1?(c.up.set(0,0,l[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[v],r.z)):(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;Ts(s,y*E,v>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(M,c),u.render(e,c)}u.toneMapping=m,u.autoClear=p,e.background=_}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ds||e.mapping===Is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Ts(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,sr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),p=.05+l*.95,m=u*p,{_lodMax:g}=this,M=this._sizeLods[n],x=3*M*(n>g-Ci?n-g+Ci:0),h=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-t,Ts(r,x,h,3*M,2*M),s.setRenderTarget(r),s.render(o,sr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Ts(e,x,h,3*M,2*M),s.setRenderTarget(e),s.render(o,sr)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Vt("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const p=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*qi-1),M=r/g,x=isFinite(r)?1+Math.floor(d*M):qi;x>qi&&ct(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${qi}`);const h=[];let _=0;for(let R=0;R<qi;++R){const C=R/M,b=Math.exp(-C*C/2);h.push(b),R===0?_+=b:R<x&&(_+=2*b)}for(let R=0;R<h.length;R++)h[R]=h[R]/_;p.envMap.value=e.texture,p.samples.value=x,p.weights.value=h,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=g,p.mipInt.value=v-n;const y=this._sizeLods[s],E=3*y*(s>v-Ci?s-v+Ci:0),T=4*(this._cubeSize-y);Ts(t,E,T,3*y,2*y),c.setRenderTarget(t),c.render(u,sr)}}function cx(i){const e=[],t=[],n=[];let s=i;const r=i-Ci+1+th.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ci?c=th[a-i+Ci-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,u=1+l,p=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,g=6,M=3,x=2,h=1,_=new Float32Array(M*g*m),v=new Float32Array(x*g*m),y=new Float32Array(h*g*m);for(let T=0;T<m;T++){const R=T%3*2/3-1,C=T>2?0:-1,b=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];_.set(b,M*g*T),v.set(p,x*g*T);const S=[T,T,T,T,T,T];y.set(S,h*g*T)}const E=new Wt;E.setAttribute("position",new Un(_,M)),E.setAttribute("uv",new Un(v,x)),E.setAttribute("faceIndex",new Un(y,h)),n.push(new G(E,null)),s>Ci&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ih(i,e,t){const n=new Hn(i,e,t);return n.texture.mapping=Ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ts(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function lx(i,e,t){return new ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ax,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ba(),fragmentShader:`

			precision highp float;
			precision highp int;

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function hx(i,e,t){const n=new Float32Array(qi),s=new P(0,1,0);return new ln({name:"SphericalGaussianBlur",defines:{n:qi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ba(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function sh(){return new ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ba(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function rh(){return new ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Ba(){return`

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
	`}function dx(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ho||c===Wo,d=c===Ds||c===Is;if(l||d){let u=e.get(o);const p=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new Tc(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return l&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Tc(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function ux(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&yr("WebGLRenderer: "+n+" extension not supported."),s}}}function fx(i,e,t,n){const s={},r=new WeakMap;function a(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const m in p)e.update(p[m],i.ARRAY_BUFFER)}function l(u){const p=[],m=u.index,g=u.attributes.position;let M=0;if(m!==null){const _=m.array;M=m.version;for(let v=0,y=_.length;v<y;v+=3){const E=_[v+0],T=_[v+1],R=_[v+2];p.push(E,T,T,R,R,E)}}else if(g!==void 0){const _=g.array;M=g.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const E=v+0,T=v+1,R=v+2;p.push(E,T,T,R,R,E)}}else return;const x=new(ed(p)?sd:id)(p,1);x.version=M;const h=r.get(u);h&&e.remove(h),r.set(u,x)}function d(u){const p=r.get(u);if(p){const m=u.index;m!==null&&p.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function px(i,e,t){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,m){i.drawElements(n,m,r,p*a),t.update(m,n,1)}function l(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,p*a,g),t.update(m,n,g))}function d(p,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,g);let x=0;for(let h=0;h<g;h++)x+=m[h];t.update(x,n,1)}function u(p,m,g,M){if(g===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let h=0;h<p.length;h++)l(p[h]/a,m[h],M[h]);else{x.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,M,0,g);let h=0;for(let _=0;_<g;_++)h+=m[_]*M[_];t.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function mx(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Vt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function xx(i,e,t){const n=new WeakMap,s=new Ot;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let p=n.get(o);if(p===void 0||p.count!==u){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var m=S;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),M===!0&&(y=2),x===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*T*4*u),C=new td(R,E,T,u);C.type=$n,C.needsUpdate=!0;const b=y*4;for(let L=0;L<u;L++){const F=h[L],W=_[L],te=v[L],ne=E*T*4*L;for(let X=0;X<F.count;X++){const Q=X*b;g===!0&&(s.fromBufferAttribute(F,X),R[ne+Q+0]=s.x,R[ne+Q+1]=s.y,R[ne+Q+2]=s.z,R[ne+Q+3]=0),M===!0&&(s.fromBufferAttribute(W,X),R[ne+Q+4]=s.x,R[ne+Q+5]=s.y,R[ne+Q+6]=s.z,R[ne+Q+7]=0),x===!0&&(s.fromBufferAttribute(te,X),R[ne+Q+8]=s.x,R[ne+Q+9]=s.y,R[ne+Q+10]=s.z,R[ne+Q+11]=te.itemSize===4?s.w:1)}}p={count:u,texture:C,size:new Te(E,T)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let x=0;x<l.length;x++)g+=l[x];const M=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",M),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function gx(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Td=new dn,ah=new ud(1,1),Ed=new td,Ad=new cf,Cd=new od,oh=[],ch=[],lh=new Float32Array(16),hh=new Float32Array(9),dh=new Float32Array(4);function Vs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=oh[s];if(r===void 0&&(r=new Float32Array(s),oh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Kt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Jt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function za(i,e){let t=ch[e];t===void 0&&(t=new Int32Array(e),ch[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function vx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function _x(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2fv(this.addr,e),Jt(t,e)}}function Mx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Kt(t,e))return;i.uniform3fv(this.addr,e),Jt(t,e)}}function Sx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4fv(this.addr,e),Jt(t,e)}}function yx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;dh.set(n),i.uniformMatrix2fv(this.addr,!1,dh),Jt(t,n)}}function bx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;hh.set(n),i.uniformMatrix3fv(this.addr,!1,hh),Jt(t,n)}}function wx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;lh.set(n),i.uniformMatrix4fv(this.addr,!1,lh),Jt(t,n)}}function Tx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ex(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2iv(this.addr,e),Jt(t,e)}}function Ax(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3iv(this.addr,e),Jt(t,e)}}function Cx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4iv(this.addr,e),Jt(t,e)}}function Rx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Px(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2uiv(this.addr,e),Jt(t,e)}}function Lx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3uiv(this.addr,e),Jt(t,e)}}function Dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4uiv(this.addr,e),Jt(t,e)}}function Ix(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ah.compareFunction=Qh,r=ah):r=Td,t.setTexture2D(e||r,s)}function Ux(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ad,s)}function Fx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Cd,s)}function Nx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Ed,s)}function Ox(i){switch(i){case 5126:return vx;case 35664:return _x;case 35665:return Mx;case 35666:return Sx;case 35674:return yx;case 35675:return bx;case 35676:return wx;case 5124:case 35670:return Tx;case 35667:case 35671:return Ex;case 35668:case 35672:return Ax;case 35669:case 35673:return Cx;case 5125:return Rx;case 36294:return Px;case 36295:return Lx;case 36296:return Dx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ix;case 35679:case 36299:case 36307:return Ux;case 35680:case 36300:case 36308:case 36293:return Fx;case 36289:case 36303:case 36311:case 36292:return Nx}}function Bx(i,e){i.uniform1fv(this.addr,e)}function zx(i,e){const t=Vs(e,this.size,2);i.uniform2fv(this.addr,t)}function kx(i,e){const t=Vs(e,this.size,3);i.uniform3fv(this.addr,t)}function Vx(i,e){const t=Vs(e,this.size,4);i.uniform4fv(this.addr,t)}function Gx(i,e){const t=Vs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Hx(i,e){const t=Vs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Wx(i,e){const t=Vs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Xx(i,e){i.uniform1iv(this.addr,e)}function Yx(i,e){i.uniform2iv(this.addr,e)}function qx(i,e){i.uniform3iv(this.addr,e)}function Zx(i,e){i.uniform4iv(this.addr,e)}function $x(i,e){i.uniform1uiv(this.addr,e)}function Kx(i,e){i.uniform2uiv(this.addr,e)}function Jx(i,e){i.uniform3uiv(this.addr,e)}function jx(i,e){i.uniform4uiv(this.addr,e)}function Qx(i,e,t){const n=this.cache,s=e.length,r=za(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Td,r[a])}function eg(i,e,t){const n=this.cache,s=e.length,r=za(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ad,r[a])}function tg(i,e,t){const n=this.cache,s=e.length,r=za(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Cd,r[a])}function ng(i,e,t){const n=this.cache,s=e.length,r=za(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ed,r[a])}function ig(i){switch(i){case 5126:return Bx;case 35664:return zx;case 35665:return kx;case 35666:return Vx;case 35674:return Gx;case 35675:return Hx;case 35676:return Wx;case 5124:case 35670:return Xx;case 35667:case 35671:return Yx;case 35668:case 35672:return qx;case 35669:case 35673:return Zx;case 5125:return $x;case 36294:return Kx;case 36295:return Jx;case 36296:return jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Qx;case 35679:case 36299:case 36307:return eg;case 35680:case 36300:case 36308:case 36293:return tg;case 36289:case 36303:case 36311:case 36292:return ng}}class sg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ox(t.type)}}class rg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ig(t.type)}}class ag{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const To=/(\w+)(\])?(\[|\.)?/g;function uh(i,e){i.seq.push(e),i.map[e.id]=e}function og(i,e,t){const n=i.name,s=n.length;for(To.lastIndex=0;;){const r=To.exec(n),a=To.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){uh(t,l===void 0?new sg(o,i,e):new rg(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new ag(o),uh(t,u)),t=u}}}class va{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);og(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function fh(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const cg=37297;let lg=0;function hg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ph=new ft;function dg(i){Et._getMatrix(ph,Et.workingColorSpace,i);const e=`mat3( ${ph.elements.map(t=>t.toFixed(4))} )`;switch(Et.getTransfer(i)){case ya:return[e,"LinearTransferOETF"];case Ut:return[e,"sRGBTransferOETF"];default:return ct("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function mh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+hg(i.getShaderSource(e),o)}else return r}function ug(i,e){const t=dg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function fg(i,e){let t;switch(e){case kh:t="Linear";break;case Vh:t="Reinhard";break;case Gh:t="Cineon";break;case Uc:t="ACESFilmic";break;case Wh:t="AgX";break;case Xh:t="Neutral";break;case Hh:t="Custom";break;default:ct("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ha=new P;function pg(){Et.getLuminanceCoefficients(ha);const i=ha.x.toFixed(4),e=ha.y.toFixed(4),t=ha.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(or).join(`
`)}function xg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function gg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function or(i){return i!==""}function xh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ec(i){return i.replace(vg,Mg)}const _g=new Map;function Mg(i,e){let t=xt[e];if(t===void 0){const n=_g.get(e);if(n!==void 0)t=xt[n],ct('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ec(t)}const Sg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vh(i){return i.replace(Sg,yg)}function yg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _h(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function bg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Bh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===zh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hi&&(e="SHADOWMAP_TYPE_VSM"),e}function wg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ds:case Is:e="ENVMAP_TYPE_CUBE";break;case Ua:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Tg(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Is&&(e="ENVMAP_MODE_REFRACTION"),e}function Eg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ic:e="ENVMAP_BLENDING_MULTIPLY";break;case Tu:e="ENVMAP_BLENDING_MIX";break;case Eu:e="ENVMAP_BLENDING_ADD";break}return e}function Ag(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Cg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=bg(t),l=wg(t),d=Tg(t),u=Eg(t),p=Ag(t),m=mg(t),g=xg(r),M=s.createProgram();let x,h,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(or).join(`
`),x.length>0&&(x+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(or).join(`
`),h.length>0&&(h+=`
`)):(x=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(or).join(`
`),h=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?xt.tonemapping_pars_fragment:"",t.toneMapping!==Pi?fg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",xt.colorspace_pars_fragment,ug("linearToOutputTexel",t.outputColorSpace),pg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(or).join(`
`)),a=Ec(a),a=xh(a,t),a=gh(a,t),o=Ec(o),o=xh(o,t),o=gh(o,t),a=vh(a),o=vh(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,h=["#define varying in",t.glslVersion===ml?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ml?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const v=_+x+a,y=_+h+o,E=fh(s,s.VERTEX_SHADER,v),T=fh(s,s.FRAGMENT_SHADER,y);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function R(L){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(M)||"",W=s.getShaderInfoLog(E)||"",te=s.getShaderInfoLog(T)||"",ne=F.trim(),X=W.trim(),Q=te.trim();let ie=!0,de=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,E,T);else{const pe=mh(s,E,"vertex"),ze=mh(s,T,"fragment");Vt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+ne+`
`+pe+`
`+ze)}else ne!==""?ct("WebGLProgram: Program Info Log:",ne):(X===""||Q==="")&&(de=!1);de&&(L.diagnostics={runnable:ie,programLog:ne,vertexShader:{log:X,prefix:x},fragmentShader:{log:Q,prefix:h}})}s.deleteShader(E),s.deleteShader(T),C=new va(s,M),b=gg(s,M)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(M,cg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=lg++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let Rg=0;class Pg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Lg(e),t.set(e,n)),n}}class Lg{constructor(e){this.id=Rg++,this.code=e,this.usedTimes=0}}function Dg(i,e,t,n,s,r,a){const o=new qc,c=new Pg,l=new Set,d=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(b){return l.add(b),b===0?"uv":`uv${b}`}function x(b,S,L,F,W){const te=F.fog,ne=W.geometry,X=b.isMeshStandardMaterial?F.environment:null,Q=(b.isMeshStandardMaterial?t:e).get(b.envMap||X),ie=Q&&Q.mapping===Ua?Q.image.height:null,de=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&ct("WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const pe=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,ze=pe!==void 0?pe.length:0;let I=0;ne.morphAttributes.position!==void 0&&(I=1),ne.morphAttributes.normal!==void 0&&(I=2),ne.morphAttributes.color!==void 0&&(I=3);let ye,Me,Se,Z;if(de){const Tt=qn[de];ye=Tt.vertexShader,Me=Tt.fragmentShader}else ye=b.vertexShader,Me=b.fragmentShader,c.update(b),Se=c.getVertexShaderID(b),Z=c.getFragmentShaderID(b);const K=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),be=W.isInstancedMesh===!0,Le=W.isBatchedMesh===!0,Xe=!!b.map,Lt=!!b.matcap,qe=!!Q,wt=!!b.aoMap,B=!!b.lightMap,dt=!!b.bumpMap,lt=!!b.normalMap,Ct=!!b.displacementMap,Ge=!!b.emissiveMap,Dt=!!b.metalnessMap,$e=!!b.roughnessMap,ot=b.anisotropy>0,D=b.clearcoat>0,A=b.dispersion>0,J=b.iridescence>0,le=b.sheen>0,fe=b.transmission>0,ae=ot&&!!b.anisotropyMap,Ve=D&&!!b.clearcoatMap,Re=D&&!!b.clearcoatNormalMap,Je=D&&!!b.clearcoatRoughnessMap,He=J&&!!b.iridescenceMap,ge=J&&!!b.iridescenceThicknessMap,we=le&&!!b.sheenColorMap,nt=le&&!!b.sheenRoughnessMap,je=!!b.specularMap,Ne=!!b.specularColorMap,st=!!b.specularIntensityMap,k=fe&&!!b.transmissionMap,De=fe&&!!b.thicknessMap,Ee=!!b.gradientMap,Ae=!!b.alphaMap,ve=b.alphaTest>0,he=!!b.alphaHash,Be=!!b.extensions;let it=Pi;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(it=i.toneMapping);const It={shaderID:de,shaderType:b.type,shaderName:b.name,vertexShader:ye,fragmentShader:Me,defines:b.defines,customVertexShaderID:Se,customFragmentShaderID:Z,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Le,batchingColor:Le&&W._colorsTexture!==null,instancing:be,instancingColor:be&&W.instanceColor!==null,instancingMorph:be&&W.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Us,alphaToCoverage:!!b.alphaToCoverage,map:Xe,matcap:Lt,envMap:qe,envMapMode:qe&&Q.mapping,envMapCubeUVHeight:ie,aoMap:wt,lightMap:B,bumpMap:dt,normalMap:lt,displacementMap:p&&Ct,emissiveMap:Ge,normalMapObjectSpace:lt&&b.normalMapType===Pu,normalMapTangentSpace:lt&&b.normalMapType===Hc,metalnessMap:Dt,roughnessMap:$e,anisotropy:ot,anisotropyMap:ae,clearcoat:D,clearcoatMap:Ve,clearcoatNormalMap:Re,clearcoatRoughnessMap:Je,dispersion:A,iridescence:J,iridescenceMap:He,iridescenceThicknessMap:ge,sheen:le,sheenColorMap:we,sheenRoughnessMap:nt,specularMap:je,specularColorMap:Ne,specularIntensityMap:st,transmission:fe,transmissionMap:k,thicknessMap:De,gradientMap:Ee,opaque:b.transparent===!1&&b.blending===Cs&&b.alphaToCoverage===!1,alphaMap:Ae,alphaTest:ve,alphaHash:he,combine:b.combine,mapUv:Xe&&M(b.map.channel),aoMapUv:wt&&M(b.aoMap.channel),lightMapUv:B&&M(b.lightMap.channel),bumpMapUv:dt&&M(b.bumpMap.channel),normalMapUv:lt&&M(b.normalMap.channel),displacementMapUv:Ct&&M(b.displacementMap.channel),emissiveMapUv:Ge&&M(b.emissiveMap.channel),metalnessMapUv:Dt&&M(b.metalnessMap.channel),roughnessMapUv:$e&&M(b.roughnessMap.channel),anisotropyMapUv:ae&&M(b.anisotropyMap.channel),clearcoatMapUv:Ve&&M(b.clearcoatMap.channel),clearcoatNormalMapUv:Re&&M(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Je&&M(b.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&M(b.iridescenceMap.channel),iridescenceThicknessMapUv:ge&&M(b.iridescenceThicknessMap.channel),sheenColorMapUv:we&&M(b.sheenColorMap.channel),sheenRoughnessMapUv:nt&&M(b.sheenRoughnessMap.channel),specularMapUv:je&&M(b.specularMap.channel),specularColorMapUv:Ne&&M(b.specularColorMap.channel),specularIntensityMapUv:st&&M(b.specularIntensityMap.channel),transmissionMapUv:k&&M(b.transmissionMap.channel),thicknessMapUv:De&&M(b.thicknessMap.channel),alphaMapUv:Ae&&M(b.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(lt||ot),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!ne.attributes.uv&&(Xe||Ae),fog:!!te,useFog:b.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:W.isSkinnedMesh===!0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:ze,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,decodeVideoTexture:Xe&&b.map.isVideoTexture===!0&&Et.getTransfer(b.map.colorSpace)===Ut,decodeVideoTextureEmissive:Ge&&b.emissiveMap.isVideoTexture===!0&&Et.getTransfer(b.emissiveMap.colorSpace)===Ut,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===pt,flipSided:b.side===hn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Be&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&b.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return It.vertexUv1s=l.has(1),It.vertexUv2s=l.has(2),It.vertexUv3s=l.has(3),l.clear(),It}function h(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const L in b.defines)S.push(L),S.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(_(S,b),v(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function _(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function v(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const S=g[b.type];let L;if(S){const F=qn[S];L=wr.clone(F.uniforms)}else L=b.uniforms;return L}function E(b,S){let L;for(let F=0,W=d.length;F<W;F++){const te=d[F];if(te.cacheKey===S){L=te,++L.usedTimes;break}}return L===void 0&&(L=new Cg(i,S,b,r),d.push(L)),L}function T(b){if(--b.usedTimes===0){const S=d.indexOf(b);d[S]=d[d.length-1],d.pop(),b.destroy()}}function R(b){c.remove(b)}function C(){c.dispose()}return{getParameters:x,getProgramCacheKey:h,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:R,programs:d,dispose:C}}function Ig(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ug(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Mh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Sh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,p,m,g,M,x){let h=i[e];return h===void 0?(h={id:u.id,object:u,geometry:p,material:m,groupOrder:g,renderOrder:u.renderOrder,z:M,group:x},i[e]=h):(h.id=u.id,h.object=u,h.geometry=p,h.material=m,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=M,h.group=x),e++,h}function o(u,p,m,g,M,x){const h=a(u,p,m,g,M,x);m.transmission>0?n.push(h):m.transparent===!0?s.push(h):t.push(h)}function c(u,p,m,g,M,x){const h=a(u,p,m,g,M,x);m.transmission>0?n.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function l(u,p){t.length>1&&t.sort(u||Ug),n.length>1&&n.sort(p||Mh),s.length>1&&s.sort(p||Mh)}function d(){for(let u=e,p=i.length;u<p;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function Fg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Sh,i.set(n,[a])):s>=r.length?(a=new Sh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ng(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new tt};break;case"SpotLight":t={position:new P,direction:new P,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Og(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Bg=0;function zg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function kg(i){const e=new Ng,t=Og(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const s=new P,r=new Pt,a=new Pt;function o(l){let d=0,u=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,M=0,x=0,h=0,_=0,v=0,y=0,E=0,T=0,R=0;l.sort(zg);for(let b=0,S=l.length;b<S;b++){const L=l[b],F=L.color,W=L.intensity,te=L.distance,ne=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=F.r*W,u+=F.g*W,p+=F.b*W;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],W);R++}else if(L.isDirectionalLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,n.directionalShadow[m]=ie,n.directionalShadowMap[m]=ne,n.directionalShadowMatrix[m]=L.shadow.matrix,_++}n.directional[m]=X,m++}else if(L.isSpotLight){const X=e.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(F).multiplyScalar(W),X.distance=te,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[M]=X;const Q=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,Q.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[M]=Q.matrix,L.castShadow){const ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,n.spotShadow[M]=ie,n.spotShadowMap[M]=ne,y++}M++}else if(L.isRectAreaLight){const X=e.get(L);X.color.copy(F).multiplyScalar(W),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[x]=X,x++}else if(L.isPointLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const Q=L.shadow,ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,ie.shadowCameraNear=Q.camera.near,ie.shadowCameraFar=Q.camera.far,n.pointShadow[g]=ie,n.pointShadowMap[g]=ne,n.pointShadowMatrix[g]=L.shadow.matrix,v++}n.point[g]=X,g++}else if(L.isHemisphereLight){const X=e.get(L);X.skyColor.copy(L.color).multiplyScalar(W),X.groundColor.copy(L.groundColor).multiplyScalar(W),n.hemi[h]=X,h++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ue.LTC_FLOAT_1,n.rectAreaLTC2=Ue.LTC_FLOAT_2):(n.rectAreaLTC1=Ue.LTC_HALF_1,n.rectAreaLTC2=Ue.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=p;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==M||C.rectAreaLength!==x||C.hemiLength!==h||C.numDirectionalShadows!==_||C.numPointShadows!==v||C.numSpotShadows!==y||C.numSpotMaps!==E||C.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=x,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,C.directionalLength=m,C.pointLength=g,C.spotLength=M,C.rectAreaLength=x,C.hemiLength=h,C.numDirectionalShadows=_,C.numPointShadows=v,C.numSpotShadows=y,C.numSpotMaps=E,C.numLightProbes=R,n.version=Bg++)}function c(l,d){let u=0,p=0,m=0,g=0,M=0;const x=d.matrixWorldInverse;for(let h=0,_=l.length;h<_;h++){const v=l[h];if(v.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),u++}else if(v.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),m++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),a.identity(),r.copy(v.matrixWorld),r.premultiply(x),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){const y=n.point[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),p++}else if(v.isHemisphereLight){const y=n.hemi[M];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(x),M++}}}return{setup:o,setupView:c,state:n}}function yh(i){const e=new kg(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Vg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new yh(i),e.set(s,[o])):r>=a.length?(o=new yh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Gg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hg=`uniform sampler2D shadow_pass;
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
}`;function Wg(i,e,t){let n=new $c;const s=new Te,r=new Te,a=new Ot,o=new d0({depthPacking:Ru}),c=new u0,l={},d=t.maxTextureSize,u={[Ii]:hn,[hn]:Ii,[pt]:pt},p=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Gg,fragmentShader:Hg}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new Wt;g.setAttribute("position",new Un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new G(g,p),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bh;let h=this.type;this.render=function(T,R,C){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Jn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const W=h!==hi&&this.type===hi,te=h===hi&&this.type!==hi;for(let ne=0,X=T.length;ne<X;ne++){const Q=T[ne],ie=Q.shadow;if(ie===void 0){ct("WebGLShadowMap:",Q,"has no shadow.");continue}if(ie.autoUpdate===!1&&ie.needsUpdate===!1)continue;s.copy(ie.mapSize);const de=ie.getFrameExtents();if(s.multiply(de),r.copy(ie.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,ie.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,ie.mapSize.y=r.y)),ie.map===null||W===!0||te===!0){const ze=this.type!==hi?{minFilter:Tn,magFilter:Tn}:{};ie.map!==null&&ie.map.dispose(),ie.map=new Hn(s.x,s.y,ze),ie.map.texture.name=Q.name+".shadowMap",ie.camera.updateProjectionMatrix()}i.setRenderTarget(ie.map),i.clear();const pe=ie.getViewportCount();for(let ze=0;ze<pe;ze++){const I=ie.getViewport(ze);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),F.viewport(a),ie.updateMatrices(Q,ze),n=ie.getFrustum(),y(R,C,ie.camera,Q,this.type)}ie.isPointLightShadow!==!0&&this.type===hi&&_(ie,C),ie.needsUpdate=!1}h=this.type,x.needsUpdate=!1,i.setRenderTarget(b,S,L)};function _(T,R){const C=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Hn(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,C,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,C,m,M,null)}function v(T,R,C,b){let S=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=C.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=S.uuid,W=R.uuid;let te=l[F];te===void 0&&(te={},l[F]=te);let ne=te[W];ne===void 0&&(ne=S.clone(),te[W]=ne,R.addEventListener("dispose",E)),S=ne}if(S.visible=R.visible,S.wireframe=R.wireframe,b===hi?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:u[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=i.properties.get(S);F.light=C}return S}function y(T,R,C,b,S){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===hi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const W=e.update(T),te=T.material;if(Array.isArray(te)){const ne=W.groups;for(let X=0,Q=ne.length;X<Q;X++){const ie=ne[X],de=te[ie.materialIndex];if(de&&de.visible){const pe=v(T,de,b,S);T.onBeforeShadow(i,T,R,C,W,pe,ie),i.renderBufferDirect(C,null,W,pe,T,ie),T.onAfterShadow(i,T,R,C,W,pe,ie)}}}else if(te.visible){const ne=v(T,te,b,S);T.onBeforeShadow(i,T,R,C,W,ne,null),i.renderBufferDirect(C,null,W,ne,T,null),T.onAfterShadow(i,T,R,C,W,ne,null)}}const F=T.children;for(let W=0,te=F.length;W<te;W++)y(F[W],R,C,b,S)}function E(T){T.target.removeEventListener("dispose",E);for(const C in l){const b=l[C],S=T.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const Xg={[No]:Oo,[Bo]:Vo,[zo]:Go,[Ls]:ko,[Oo]:No,[Vo]:Bo,[Go]:zo,[ko]:Ls};function Yg(i,e){function t(){let k=!1;const De=new Ot;let Ee=null;const Ae=new Ot(0,0,0,0);return{setMask:function(ve){Ee!==ve&&!k&&(i.colorMask(ve,ve,ve,ve),Ee=ve)},setLocked:function(ve){k=ve},setClear:function(ve,he,Be,it,It){It===!0&&(ve*=it,he*=it,Be*=it),De.set(ve,he,Be,it),Ae.equals(De)===!1&&(i.clearColor(ve,he,Be,it),Ae.copy(De))},reset:function(){k=!1,Ee=null,Ae.set(-1,0,0,0)}}}function n(){let k=!1,De=!1,Ee=null,Ae=null,ve=null;return{setReversed:function(he){if(De!==he){const Be=e.get("EXT_clip_control");he?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT),De=he;const it=ve;ve=null,this.setClear(it)}},getReversed:function(){return De},setTest:function(he){he?K(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(he){Ee!==he&&!k&&(i.depthMask(he),Ee=he)},setFunc:function(he){if(De&&(he=Xg[he]),Ae!==he){switch(he){case No:i.depthFunc(i.NEVER);break;case Oo:i.depthFunc(i.ALWAYS);break;case Bo:i.depthFunc(i.LESS);break;case Ls:i.depthFunc(i.LEQUAL);break;case zo:i.depthFunc(i.EQUAL);break;case ko:i.depthFunc(i.GEQUAL);break;case Vo:i.depthFunc(i.GREATER);break;case Go:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ae=he}},setLocked:function(he){k=he},setClear:function(he){ve!==he&&(De&&(he=1-he),i.clearDepth(he),ve=he)},reset:function(){k=!1,Ee=null,Ae=null,ve=null,De=!1}}}function s(){let k=!1,De=null,Ee=null,Ae=null,ve=null,he=null,Be=null,it=null,It=null;return{setTest:function(Tt){k||(Tt?K(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(Tt){De!==Tt&&!k&&(i.stencilMask(Tt),De=Tt)},setFunc:function(Tt,Yt,Sn){(Ee!==Tt||Ae!==Yt||ve!==Sn)&&(i.stencilFunc(Tt,Yt,Sn),Ee=Tt,Ae=Yt,ve=Sn)},setOp:function(Tt,Yt,Sn){(he!==Tt||Be!==Yt||it!==Sn)&&(i.stencilOp(Tt,Yt,Sn),he=Tt,Be=Yt,it=Sn)},setLocked:function(Tt){k=Tt},setClear:function(Tt){It!==Tt&&(i.clearStencil(Tt),It=Tt)},reset:function(){k=!1,De=null,Ee=null,Ae=null,ve=null,he=null,Be=null,it=null,It=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},p=new WeakMap,m=[],g=null,M=!1,x=null,h=null,_=null,v=null,y=null,E=null,T=null,R=new tt(0,0,0),C=0,b=!1,S=null,L=null,F=null,W=null,te=null;const ne=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Q=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ie)[1]),X=Q>=1):ie.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),X=Q>=2);let de=null,pe={};const ze=i.getParameter(i.SCISSOR_BOX),I=i.getParameter(i.VIEWPORT),ye=new Ot().fromArray(ze),Me=new Ot().fromArray(I);function Se(k,De,Ee,Ae){const ve=new Uint8Array(4),he=i.createTexture();i.bindTexture(k,he),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Be=0;Be<Ee;Be++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(De,0,i.RGBA,1,1,Ae,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(De+Be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return he}const Z={};Z[i.TEXTURE_2D]=Se(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(i.DEPTH_TEST),a.setFunc(Ls),dt(!1),lt(dl),K(i.CULL_FACE),wt(Jn);function K(k){d[k]!==!0&&(i.enable(k),d[k]=!0)}function _e(k){d[k]!==!1&&(i.disable(k),d[k]=!1)}function be(k,De){return u[k]!==De?(i.bindFramebuffer(k,De),u[k]=De,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=De),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=De),!0):!1}function Le(k,De){let Ee=m,Ae=!1;if(k){Ee=p.get(De),Ee===void 0&&(Ee=[],p.set(De,Ee));const ve=k.textures;if(Ee.length!==ve.length||Ee[0]!==i.COLOR_ATTACHMENT0){for(let he=0,Be=ve.length;he<Be;he++)Ee[he]=i.COLOR_ATTACHMENT0+he;Ee.length=ve.length,Ae=!0}}else Ee[0]!==i.BACK&&(Ee[0]=i.BACK,Ae=!0);Ae&&i.drawBuffers(Ee)}function Xe(k){return g!==k?(i.useProgram(k),g=k,!0):!1}const Lt={[Yi]:i.FUNC_ADD,[cu]:i.FUNC_SUBTRACT,[lu]:i.FUNC_REVERSE_SUBTRACT};Lt[hu]=i.MIN,Lt[du]=i.MAX;const qe={[uu]:i.ZERO,[fu]:i.ONE,[pu]:i.SRC_COLOR,[Uo]:i.SRC_ALPHA,[Mu]:i.SRC_ALPHA_SATURATE,[vu]:i.DST_COLOR,[xu]:i.DST_ALPHA,[mu]:i.ONE_MINUS_SRC_COLOR,[Fo]:i.ONE_MINUS_SRC_ALPHA,[_u]:i.ONE_MINUS_DST_COLOR,[gu]:i.ONE_MINUS_DST_ALPHA,[Su]:i.CONSTANT_COLOR,[yu]:i.ONE_MINUS_CONSTANT_COLOR,[bu]:i.CONSTANT_ALPHA,[wu]:i.ONE_MINUS_CONSTANT_ALPHA};function wt(k,De,Ee,Ae,ve,he,Be,it,It,Tt){if(k===Jn){M===!0&&(_e(i.BLEND),M=!1);return}if(M===!1&&(K(i.BLEND),M=!0),k!==ou){if(k!==x||Tt!==b){if((h!==Yi||y!==Yi)&&(i.blendEquation(i.FUNC_ADD),h=Yi,y=Yi),Tt)switch(k){case Cs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ai:i.blendFunc(i.ONE,i.ONE);break;case ul:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case fl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Vt("WebGLState: Invalid blending: ",k);break}else switch(k){case Cs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ul:Vt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fl:Vt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Vt("WebGLState: Invalid blending: ",k);break}_=null,v=null,E=null,T=null,R.set(0,0,0),C=0,x=k,b=Tt}return}ve=ve||De,he=he||Ee,Be=Be||Ae,(De!==h||ve!==y)&&(i.blendEquationSeparate(Lt[De],Lt[ve]),h=De,y=ve),(Ee!==_||Ae!==v||he!==E||Be!==T)&&(i.blendFuncSeparate(qe[Ee],qe[Ae],qe[he],qe[Be]),_=Ee,v=Ae,E=he,T=Be),(it.equals(R)===!1||It!==C)&&(i.blendColor(it.r,it.g,it.b,It),R.copy(it),C=It),x=k,b=!1}function B(k,De){k.side===pt?_e(i.CULL_FACE):K(i.CULL_FACE);let Ee=k.side===hn;De&&(Ee=!Ee),dt(Ee),k.blending===Cs&&k.transparent===!1?wt(Jn):wt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Ae=k.stencilWrite;o.setTest(Ae),Ae&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ge(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(k){S!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),S=k)}function lt(k){k!==ru?(K(i.CULL_FACE),k!==L&&(k===dl?i.cullFace(i.BACK):k===au?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),L=k}function Ct(k){k!==F&&(X&&i.lineWidth(k),F=k)}function Ge(k,De,Ee){k?(K(i.POLYGON_OFFSET_FILL),(W!==De||te!==Ee)&&(i.polygonOffset(De,Ee),W=De,te=Ee)):_e(i.POLYGON_OFFSET_FILL)}function Dt(k){k?K(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function $e(k){k===void 0&&(k=i.TEXTURE0+ne-1),de!==k&&(i.activeTexture(k),de=k)}function ot(k,De,Ee){Ee===void 0&&(de===null?Ee=i.TEXTURE0+ne-1:Ee=de);let Ae=pe[Ee];Ae===void 0&&(Ae={type:void 0,texture:void 0},pe[Ee]=Ae),(Ae.type!==k||Ae.texture!==De)&&(de!==Ee&&(i.activeTexture(Ee),de=Ee),i.bindTexture(k,De||Z[k]),Ae.type=k,Ae.texture=De)}function D(){const k=pe[de];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function J(){try{i.compressedTexImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function le(){try{i.texSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function fe(){try{i.texSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function ae(){try{i.compressedTexSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function Ve(){try{i.compressedTexSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function Re(){try{i.texStorage2D(...arguments)}catch(k){k("WebGLState:",k)}}function Je(){try{i.texStorage3D(...arguments)}catch(k){k("WebGLState:",k)}}function He(){try{i.texImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function ge(){try{i.texImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function we(k){ye.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),ye.copy(k))}function nt(k){Me.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),Me.copy(k))}function je(k,De){let Ee=l.get(De);Ee===void 0&&(Ee=new WeakMap,l.set(De,Ee));let Ae=Ee.get(k);Ae===void 0&&(Ae=i.getUniformBlockIndex(De,k.name),Ee.set(k,Ae))}function Ne(k,De){const Ae=l.get(De).get(k);c.get(De)!==Ae&&(i.uniformBlockBinding(De,Ae,k.__bindingPointIndex),c.set(De,Ae))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},de=null,pe={},u={},p=new WeakMap,m=[],g=null,M=!1,x=null,h=null,_=null,v=null,y=null,E=null,T=null,R=new tt(0,0,0),C=0,b=!1,S=null,L=null,F=null,W=null,te=null,ye.set(0,0,i.canvas.width,i.canvas.height),Me.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:_e,bindFramebuffer:be,drawBuffers:Le,useProgram:Xe,setBlending:wt,setMaterial:B,setFlipSided:dt,setCullFace:lt,setLineWidth:Ct,setPolygonOffset:Ge,setScissorTest:Dt,activeTexture:$e,bindTexture:ot,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:He,texImage3D:ge,updateUBOMapping:je,uniformBlockBinding:Ne,texStorage2D:Re,texStorage3D:Je,texSubImage2D:le,texSubImage3D:fe,compressedTexSubImage2D:ae,compressedTexSubImage3D:Ve,scissor:we,viewport:nt,reset:st}}function qg(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Te,d=new WeakMap;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,A){return m?new OffscreenCanvas(D,A):wa("canvas")}function M(D,A,J){let le=1;const fe=ot(D);if((fe.width>J||fe.height>J)&&(le=J/Math.max(fe.width,fe.height)),le<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ae=Math.floor(le*fe.width),Ve=Math.floor(le*fe.height);u===void 0&&(u=g(ae,Ve));const Re=A?g(ae,Ve):u;return Re.width=ae,Re.height=Ve,Re.getContext("2d").drawImage(D,0,0,ae,Ve),ct("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+ae+"x"+Ve+")."),Re}else return"data"in D&&ct("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),D;return D}function x(D){return D.generateMipmaps}function h(D){i.generateMipmap(D)}function _(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(D,A,J,le,fe=!1){if(D!==null){if(i[D]!==void 0)return i[D];ct("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ae=A;if(A===i.RED&&(J===i.FLOAT&&(ae=i.R32F),J===i.HALF_FLOAT&&(ae=i.R16F),J===i.UNSIGNED_BYTE&&(ae=i.R8)),A===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(ae=i.R8UI),J===i.UNSIGNED_SHORT&&(ae=i.R16UI),J===i.UNSIGNED_INT&&(ae=i.R32UI),J===i.BYTE&&(ae=i.R8I),J===i.SHORT&&(ae=i.R16I),J===i.INT&&(ae=i.R32I)),A===i.RG&&(J===i.FLOAT&&(ae=i.RG32F),J===i.HALF_FLOAT&&(ae=i.RG16F),J===i.UNSIGNED_BYTE&&(ae=i.RG8)),A===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(ae=i.RG8UI),J===i.UNSIGNED_SHORT&&(ae=i.RG16UI),J===i.UNSIGNED_INT&&(ae=i.RG32UI),J===i.BYTE&&(ae=i.RG8I),J===i.SHORT&&(ae=i.RG16I),J===i.INT&&(ae=i.RG32I)),A===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(ae=i.RGB8UI),J===i.UNSIGNED_SHORT&&(ae=i.RGB16UI),J===i.UNSIGNED_INT&&(ae=i.RGB32UI),J===i.BYTE&&(ae=i.RGB8I),J===i.SHORT&&(ae=i.RGB16I),J===i.INT&&(ae=i.RGB32I)),A===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(ae=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(ae=i.RGBA16UI),J===i.UNSIGNED_INT&&(ae=i.RGBA32UI),J===i.BYTE&&(ae=i.RGBA8I),J===i.SHORT&&(ae=i.RGBA16I),J===i.INT&&(ae=i.RGBA32I)),A===i.RGB&&(J===i.UNSIGNED_INT_5_9_9_9_REV&&(ae=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(ae=i.R11F_G11F_B10F)),A===i.RGBA){const Ve=fe?ya:Et.getTransfer(le);J===i.FLOAT&&(ae=i.RGBA32F),J===i.HALF_FLOAT&&(ae=i.RGBA16F),J===i.UNSIGNED_BYTE&&(ae=Ve===Ut?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT_4_4_4_4&&(ae=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(ae=i.RGB5_A1)}return(ae===i.R16F||ae===i.R32F||ae===i.RG16F||ae===i.RG32F||ae===i.RGBA16F||ae===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function y(D,A){let J;return D?A===null||A===ts||A===_r?J=i.DEPTH24_STENCIL8:A===$n?J=i.DEPTH32F_STENCIL8:A===vr&&(J=i.DEPTH24_STENCIL8,ct("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ts||A===_r?J=i.DEPTH_COMPONENT24:A===$n?J=i.DEPTH_COMPONENT32F:A===vr&&(J=i.DEPTH_COMPONENT16),J}function E(D,A){return x(D)===!0||D.isFramebufferTexture&&D.minFilter!==Tn&&D.minFilter!==In?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),C(A),A.isVideoTexture&&d.delete(A)}function R(D){const A=D.target;A.removeEventListener("dispose",R),S(A)}function C(D){const A=n.get(D);if(A.__webglInit===void 0)return;const J=D.source,le=p.get(J);if(le){const fe=le[A.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&b(D),Object.keys(le).length===0&&p.delete(J)}n.remove(D)}function b(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const J=D.source,le=p.get(J);delete le[A.__cacheKey],a.memory.textures--}function S(D){const A=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(A.__webglFramebuffer[le]))for(let fe=0;fe<A.__webglFramebuffer[le].length;fe++)i.deleteFramebuffer(A.__webglFramebuffer[le][fe]);else i.deleteFramebuffer(A.__webglFramebuffer[le]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[le])}else{if(Array.isArray(A.__webglFramebuffer))for(let le=0;le<A.__webglFramebuffer.length;le++)i.deleteFramebuffer(A.__webglFramebuffer[le]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let le=0;le<A.__webglColorRenderbuffer.length;le++)A.__webglColorRenderbuffer[le]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[le]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let le=0,fe=J.length;le<fe;le++){const ae=n.get(J[le]);ae.__webglTexture&&(i.deleteTexture(ae.__webglTexture),a.memory.textures--),n.remove(J[le])}n.remove(D)}let L=0;function F(){L=0}function W(){const D=L;return D>=s.maxTextures&&ct("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function te(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function ne(D,A){const J=n.get(D);if(D.isVideoTexture&&Dt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const le=D.image;if(le===null)ct("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)ct("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+A)}function X(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){Z(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+A)}function Q(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){Z(J,D,A);return}t.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+A)}function ie(D,A){const J=n.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+A)}const de={[un]:i.REPEAT,[fi]:i.CLAMP_TO_EDGE,[Xo]:i.MIRRORED_REPEAT},pe={[Tn]:i.NEAREST,[Au]:i.NEAREST_MIPMAP_NEAREST,[Nr]:i.NEAREST_MIPMAP_LINEAR,[In]:i.LINEAR,[Ha]:i.LINEAR_MIPMAP_NEAREST,[Zi]:i.LINEAR_MIPMAP_LINEAR},ze={[Lu]:i.NEVER,[Ou]:i.ALWAYS,[Du]:i.LESS,[Qh]:i.LEQUAL,[Iu]:i.EQUAL,[Nu]:i.GEQUAL,[Uu]:i.GREATER,[Fu]:i.NOTEQUAL};function I(D,A){if(A.type===$n&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===In||A.magFilter===Ha||A.magFilter===Nr||A.magFilter===Zi||A.minFilter===In||A.minFilter===Ha||A.minFilter===Nr||A.minFilter===Zi)&&ct("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,de[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,de[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,de[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,pe[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,pe[A.minFilter]),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,ze[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Tn||A.minFilter!==Nr&&A.minFilter!==Zi||A.type===$n&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function ye(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const le=A.source;let fe=p.get(le);fe===void 0&&(fe={},p.set(le,fe));const ae=te(A);if(ae!==D.__cacheKey){fe[ae]===void 0&&(fe[ae]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,J=!0),fe[ae].usedTimes++;const Ve=fe[D.__cacheKey];Ve!==void 0&&(fe[D.__cacheKey].usedTimes--,Ve.usedTimes===0&&b(A)),D.__cacheKey=ae,D.__webglTexture=fe[ae].texture}return J}function Me(D,A,J){return Math.floor(Math.floor(D/J)/A)}function Se(D,A,J,le){const ae=D.updateRanges;if(ae.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,J,le,A.data);else{ae.sort((ge,we)=>ge.start-we.start);let Ve=0;for(let ge=1;ge<ae.length;ge++){const we=ae[Ve],nt=ae[ge],je=we.start+we.count,Ne=Me(nt.start,A.width,4),st=Me(we.start,A.width,4);nt.start<=je+1&&Ne===st&&Me(nt.start+nt.count-1,A.width,4)===Ne?we.count=Math.max(we.count,nt.start+nt.count-we.start):(++Ve,ae[Ve]=nt)}ae.length=Ve+1;const Re=i.getParameter(i.UNPACK_ROW_LENGTH),Je=i.getParameter(i.UNPACK_SKIP_PIXELS),He=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let ge=0,we=ae.length;ge<we;ge++){const nt=ae[ge],je=Math.floor(nt.start/4),Ne=Math.ceil(nt.count/4),st=je%A.width,k=Math.floor(je/A.width),De=Ne,Ee=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,st),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),t.texSubImage2D(i.TEXTURE_2D,0,st,k,De,Ee,J,le,A.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Re),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Je),i.pixelStorei(i.UNPACK_SKIP_ROWS,He)}}function Z(D,A,J){let le=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(le=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(le=i.TEXTURE_3D);const fe=ye(D,A),ae=A.source;t.bindTexture(le,D.__webglTexture,i.TEXTURE0+J);const Ve=n.get(ae);if(ae.version!==Ve.__version||fe===!0){t.activeTexture(i.TEXTURE0+J);const Re=Et.getPrimaries(Et.workingColorSpace),Je=A.colorSpace===Ei?null:Et.getPrimaries(A.colorSpace),He=A.colorSpace===Ei||Re===Je?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ge=M(A.image,!1,s.maxTextureSize);ge=$e(A,ge);const we=r.convert(A.format,A.colorSpace),nt=r.convert(A.type);let je=v(A.internalFormat,we,nt,A.colorSpace,A.isVideoTexture);I(le,A);let Ne;const st=A.mipmaps,k=A.isVideoTexture!==!0,De=Ve.__version===void 0||fe===!0,Ee=ae.dataReady,Ae=E(A,ge);if(A.isDepthTexture)je=y(A.format===Sr,A.type),De&&(k?t.texStorage2D(i.TEXTURE_2D,1,je,ge.width,ge.height):t.texImage2D(i.TEXTURE_2D,0,je,ge.width,ge.height,0,we,nt,null));else if(A.isDataTexture)if(st.length>0){k&&De&&t.texStorage2D(i.TEXTURE_2D,Ae,je,st[0].width,st[0].height);for(let ve=0,he=st.length;ve<he;ve++)Ne=st[ve],k?Ee&&t.texSubImage2D(i.TEXTURE_2D,ve,0,0,Ne.width,Ne.height,we,nt,Ne.data):t.texImage2D(i.TEXTURE_2D,ve,je,Ne.width,Ne.height,0,we,nt,Ne.data);A.generateMipmaps=!1}else k?(De&&t.texStorage2D(i.TEXTURE_2D,Ae,je,ge.width,ge.height),Ee&&Se(A,ge,we,nt)):t.texImage2D(i.TEXTURE_2D,0,je,ge.width,ge.height,0,we,nt,ge.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){k&&De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,je,st[0].width,st[0].height,ge.depth);for(let ve=0,he=st.length;ve<he;ve++)if(Ne=st[ve],A.format!==Gn)if(we!==null)if(k){if(Ee)if(A.layerUpdates.size>0){const Be=eh(Ne.width,Ne.height,A.format,A.type);for(const it of A.layerUpdates){const It=Ne.data.subarray(it*Be/Ne.data.BYTES_PER_ELEMENT,(it+1)*Be/Ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ve,0,0,it,Ne.width,Ne.height,1,we,It)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ve,0,0,0,Ne.width,Ne.height,ge.depth,we,Ne.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ve,je,Ne.width,Ne.height,ge.depth,0,Ne.data,0,0);else ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Ee&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ve,0,0,0,Ne.width,Ne.height,ge.depth,we,nt,Ne.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ve,je,Ne.width,Ne.height,ge.depth,0,we,nt,Ne.data)}else{k&&De&&t.texStorage2D(i.TEXTURE_2D,Ae,je,st[0].width,st[0].height);for(let ve=0,he=st.length;ve<he;ve++)Ne=st[ve],A.format!==Gn?we!==null?k?Ee&&t.compressedTexSubImage2D(i.TEXTURE_2D,ve,0,0,Ne.width,Ne.height,we,Ne.data):t.compressedTexImage2D(i.TEXTURE_2D,ve,je,Ne.width,Ne.height,0,Ne.data):ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Ee&&t.texSubImage2D(i.TEXTURE_2D,ve,0,0,Ne.width,Ne.height,we,nt,Ne.data):t.texImage2D(i.TEXTURE_2D,ve,je,Ne.width,Ne.height,0,we,nt,Ne.data)}else if(A.isDataArrayTexture)if(k){if(De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,je,ge.width,ge.height,ge.depth),Ee)if(A.layerUpdates.size>0){const ve=eh(ge.width,ge.height,A.format,A.type);for(const he of A.layerUpdates){const Be=ge.data.subarray(he*ve/ge.data.BYTES_PER_ELEMENT,(he+1)*ve/ge.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,ge.width,ge.height,1,we,nt,Be)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ge.width,ge.height,ge.depth,we,nt,ge.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,je,ge.width,ge.height,ge.depth,0,we,nt,ge.data);else if(A.isData3DTexture)k?(De&&t.texStorage3D(i.TEXTURE_3D,Ae,je,ge.width,ge.height,ge.depth),Ee&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ge.width,ge.height,ge.depth,we,nt,ge.data)):t.texImage3D(i.TEXTURE_3D,0,je,ge.width,ge.height,ge.depth,0,we,nt,ge.data);else if(A.isFramebufferTexture){if(De)if(k)t.texStorage2D(i.TEXTURE_2D,Ae,je,ge.width,ge.height);else{let ve=ge.width,he=ge.height;for(let Be=0;Be<Ae;Be++)t.texImage2D(i.TEXTURE_2D,Be,je,ve,he,0,we,nt,null),ve>>=1,he>>=1}}else if(st.length>0){if(k&&De){const ve=ot(st[0]);t.texStorage2D(i.TEXTURE_2D,Ae,je,ve.width,ve.height)}for(let ve=0,he=st.length;ve<he;ve++)Ne=st[ve],k?Ee&&t.texSubImage2D(i.TEXTURE_2D,ve,0,0,we,nt,Ne):t.texImage2D(i.TEXTURE_2D,ve,je,we,nt,Ne);A.generateMipmaps=!1}else if(k){if(De){const ve=ot(ge);t.texStorage2D(i.TEXTURE_2D,Ae,je,ve.width,ve.height)}Ee&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,nt,ge)}else t.texImage2D(i.TEXTURE_2D,0,je,we,nt,ge);x(A)&&h(le),Ve.__version=ae.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const le=ye(D,A),fe=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+J);const ae=n.get(fe);if(fe.version!==ae.__version||le===!0){t.activeTexture(i.TEXTURE0+J);const Ve=Et.getPrimaries(Et.workingColorSpace),Re=A.colorSpace===Ei?null:Et.getPrimaries(A.colorSpace),Je=A.colorSpace===Ei||Ve===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);const He=A.isCompressedTexture||A.image[0].isCompressedTexture,ge=A.image[0]&&A.image[0].isDataTexture,we=[];for(let he=0;he<6;he++)!He&&!ge?we[he]=M(A.image[he],!0,s.maxCubemapSize):we[he]=ge?A.image[he].image:A.image[he],we[he]=$e(A,we[he]);const nt=we[0],je=r.convert(A.format,A.colorSpace),Ne=r.convert(A.type),st=v(A.internalFormat,je,Ne,A.colorSpace),k=A.isVideoTexture!==!0,De=ae.__version===void 0||le===!0,Ee=fe.dataReady;let Ae=E(A,nt);I(i.TEXTURE_CUBE_MAP,A);let ve;if(He){k&&De&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,st,nt.width,nt.height);for(let he=0;he<6;he++){ve=we[he].mipmaps;for(let Be=0;Be<ve.length;Be++){const it=ve[Be];A.format!==Gn?je!==null?k?Ee&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be,0,0,it.width,it.height,je,it.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be,st,it.width,it.height,0,it.data):ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be,0,0,it.width,it.height,je,Ne,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be,st,it.width,it.height,0,je,Ne,it.data)}}}else{if(ve=A.mipmaps,k&&De){ve.length>0&&Ae++;const he=ot(we[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,st,he.width,he.height)}for(let he=0;he<6;he++)if(ge){k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,we[he].width,we[he].height,je,Ne,we[he].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,st,we[he].width,we[he].height,0,je,Ne,we[he].data);for(let Be=0;Be<ve.length;Be++){const It=ve[Be].image[he].image;k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be+1,0,0,It.width,It.height,je,Ne,It.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be+1,st,It.width,It.height,0,je,Ne,It.data)}}else{k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,je,Ne,we[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,st,je,Ne,we[he]);for(let Be=0;Be<ve.length;Be++){const it=ve[Be];k?Ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be+1,0,0,je,Ne,it.image[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Be+1,st,je,Ne,it.image[he])}}}x(A)&&h(i.TEXTURE_CUBE_MAP),ae.__version=fe.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function _e(D,A,J,le,fe,ae){const Ve=r.convert(J.format,J.colorSpace),Re=r.convert(J.type),Je=v(J.internalFormat,Ve,Re,J.colorSpace),He=n.get(A),ge=n.get(J);if(ge.__renderTarget=A,!He.__hasExternalTextures){const we=Math.max(1,A.width>>ae),nt=Math.max(1,A.height>>ae);fe===i.TEXTURE_3D||fe===i.TEXTURE_2D_ARRAY?t.texImage3D(fe,ae,Je,we,nt,A.depth,0,Ve,Re,null):t.texImage2D(fe,ae,Je,we,nt,0,Ve,Re,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,le,fe,ge.__webglTexture,0,Ct(A)):(fe===i.TEXTURE_2D||fe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,le,fe,ge.__webglTexture,ae),t.bindFramebuffer(i.FRAMEBUFFER,null)}function be(D,A,J){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer){const le=A.depthTexture,fe=le&&le.isDepthTexture?le.type:null,ae=y(A.stencilBuffer,fe),Ve=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=Ct(A);Ge(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,ae,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ae,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,ae,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ve,i.RENDERBUFFER,D)}else{const le=A.textures;for(let fe=0;fe<le.length;fe++){const ae=le[fe],Ve=r.convert(ae.format,ae.colorSpace),Re=r.convert(ae.type),Je=v(ae.internalFormat,Ve,Re,ae.colorSpace),He=Ct(A);J&&Ge(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,He,Je,A.width,A.height):Ge(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,He,Je,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Je,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const le=n.get(A.depthTexture);le.__renderTarget=A,(!le.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),ne(A.depthTexture,0);const fe=le.__webglTexture,ae=Ct(A);if(A.depthTexture.format===Mr)Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,fe,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,fe,0);else if(A.depthTexture.format===Sr)Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,fe,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function Xe(D){const A=n.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const le=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),le){const fe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,le.removeEventListener("dispose",fe)};le.addEventListener("dispose",fe),A.__depthDisposeCallback=fe}A.__boundDepthTexture=le}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const le=D.texture.mipmaps;le&&le.length>0?Le(A.__webglFramebuffer[0],D):Le(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[le]),A.__webglDepthbuffer[le]===void 0)A.__webglDepthbuffer[le]=i.createRenderbuffer(),be(A.__webglDepthbuffer[le],D,!1);else{const fe=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer[le];i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,ae)}}else{const le=D.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),be(A.__webglDepthbuffer,D,!1);else{const fe=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,ae)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(D,A,J){const le=n.get(D);A!==void 0&&_e(le.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&Xe(D)}function qe(D){const A=D.texture,J=n.get(D),le=n.get(A);D.addEventListener("dispose",R);const fe=D.textures,ae=D.isWebGLCubeRenderTarget===!0,Ve=fe.length>1;if(Ve||(le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture()),le.__version=A.version,a.memory.textures++),ae){J.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Re]=[];for(let Je=0;Je<A.mipmaps.length;Je++)J.__webglFramebuffer[Re][Je]=i.createFramebuffer()}else J.__webglFramebuffer[Re]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Re=0;Re<A.mipmaps.length;Re++)J.__webglFramebuffer[Re]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(Ve)for(let Re=0,Je=fe.length;Re<Je;Re++){const He=n.get(fe[Re]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&Ge(D)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Re=0;Re<fe.length;Re++){const Je=fe[Re];J.__webglColorRenderbuffer[Re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[Re]);const He=r.convert(Je.format,Je.colorSpace),ge=r.convert(Je.type),we=v(Je.internalFormat,He,ge,Je.colorSpace,D.isXRRenderTarget===!0),nt=Ct(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,we,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,J.__webglColorRenderbuffer[Re])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),be(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ae){t.bindTexture(i.TEXTURE_CUBE_MAP,le.__webglTexture),I(i.TEXTURE_CUBE_MAP,A);for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)_e(J.__webglFramebuffer[Re][Je],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Je);else _e(J.__webglFramebuffer[Re],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);x(A)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ve){for(let Re=0,Je=fe.length;Re<Je;Re++){const He=fe[Re],ge=n.get(He);let we=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(we=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,ge.__webglTexture),I(we,He),_e(J.__webglFramebuffer,D,He,i.COLOR_ATTACHMENT0+Re,we,0),x(He)&&h(we)}t.unbindTexture()}else{let Re=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Re=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Re,le.__webglTexture),I(Re,A),A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)_e(J.__webglFramebuffer[Je],D,A,i.COLOR_ATTACHMENT0,Re,Je);else _e(J.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,Re,0);x(A)&&h(Re),t.unbindTexture()}D.depthBuffer&&Xe(D)}function wt(D){const A=D.textures;for(let J=0,le=A.length;J<le;J++){const fe=A[J];if(x(fe)){const ae=_(D),Ve=n.get(fe).__webglTexture;t.bindTexture(ae,Ve),h(ae),t.unbindTexture()}}}const B=[],dt=[];function lt(D){if(D.samples>0){if(Ge(D)===!1){const A=D.textures,J=D.width,le=D.height;let fe=i.COLOR_BUFFER_BIT;const ae=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ve=n.get(D),Re=A.length>1;if(Re)for(let He=0;He<A.length;He++)t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer);const Je=D.texture.mipmaps;Je&&Je.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer);for(let He=0;He<A.length;He++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(fe|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(fe|=i.STENCIL_BUFFER_BIT)),Re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ve.__webglColorRenderbuffer[He]);const ge=n.get(A[He]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ge,0)}i.blitFramebuffer(0,0,J,le,0,0,J,le,fe,i.NEAREST),c===!0&&(B.length=0,dt.length=0,B.push(i.COLOR_ATTACHMENT0+He),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(ae),dt.push(ae),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Re)for(let He=0;He<A.length;He++){t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,Ve.__webglColorRenderbuffer[He]);const ge=n.get(A[He]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,ge,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const A=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function Ct(D){return Math.min(s.maxSamples,D.samples)}function Ge(D){const A=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Dt(D){const A=a.render.frame;d.get(D)!==A&&(d.set(D,A),D.update())}function $e(D,A){const J=D.colorSpace,le=D.format,fe=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==Us&&J!==Ei&&(Et.getTransfer(J)===Ut?(le!==Gn||fe!==ti)&&ct("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Vt("WebGLTextures: Unsupported texture color space:",J)),A}function ot(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=F,this.setTexture2D=ne,this.setTexture2DArray=X,this.setTexture3D=Q,this.setTextureCube=ie,this.rebindTextures=Lt,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=wt,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Ge}function Zg(i,e){function t(n,s=Ei){let r;const a=Et.getTransfer(s);if(n===ti)return i.UNSIGNED_BYTE;if(n===Nc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Oc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===$h)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===qh)return i.BYTE;if(n===Zh)return i.SHORT;if(n===vr)return i.UNSIGNED_SHORT;if(n===Fc)return i.INT;if(n===ts)return i.UNSIGNED_INT;if(n===$n)return i.FLOAT;if(n===jn)return i.HALF_FLOAT;if(n===Jh)return i.ALPHA;if(n===jh)return i.RGB;if(n===Gn)return i.RGBA;if(n===Mr)return i.DEPTH_COMPONENT;if(n===Sr)return i.DEPTH_STENCIL;if(n===Bc)return i.RED;if(n===zc)return i.RED_INTEGER;if(n===kc)return i.RG;if(n===Vc)return i.RG_INTEGER;if(n===Gc)return i.RGBA_INTEGER;if(n===pa||n===ma||n===xa||n===ga)if(a===Ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Yo||n===qo||n===Zo||n===$o)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Yo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$o)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ko||n===Jo||n===jo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ko||n===Jo)return a===Ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===jo)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qo||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===cc||n===lc||n===hc||n===dc||n===uc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qo)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ec)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===tc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===nc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ic)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===rc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ac)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===cc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===lc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===hc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===dc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===uc)return a===Ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fc||n===pc||n===mc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===fc)return a===Ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===mc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xc||n===gc||n===vc||n===_c)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===xc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_c)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===_r?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const $g=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Kg=`
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

}`;class Jg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new fd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ln({vertexShader:$g,fragmentShader:Kg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new G(new zt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jg extends zs{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,p=null,m=null,g=null;const M=typeof XRWebGLBinding<"u",x=new Jg,h={},_=t.getContextAttributes();let v=null,y=null;const E=[],T=[],R=new Te;let C=null;const b=new wn;b.viewport=new Ot;const S=new wn;S.viewport=new Ot;const L=[b,S],F=new x0;let W=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let K=E[Z];return K===void 0&&(K=new ho,E[Z]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Z){let K=E[Z];return K===void 0&&(K=new ho,E[Z]=K),K.getGripSpace()},this.getHand=function(Z){let K=E[Z];return K===void 0&&(K=new ho,E[Z]=K),K.getHandSpace()};function ne(Z){const K=T.indexOf(Z.inputSource);if(K===-1)return;const _e=E[K];_e!==void 0&&(_e.update(Z.inputSource,Z.frame,l||a),_e.dispatchEvent({type:Z.type,data:Z.inputSource}))}function X(){s.removeEventListener("select",ne),s.removeEventListener("selectstart",ne),s.removeEventListener("selectend",ne),s.removeEventListener("squeeze",ne),s.removeEventListener("squeezestart",ne),s.removeEventListener("squeezeend",ne),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",Q);for(let Z=0;Z<E.length;Z++){const K=T[Z];K!==null&&(T[Z]=null,E[Z].disconnect(K))}W=null,te=null,x.reset();for(const Z in h)delete h[Z];e.setRenderTarget(v),m=null,p=null,u=null,s=null,y=null,Se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&ct("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&ct("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",ne),s.addEventListener("selectstart",ne),s.addEventListener("selectend",ne),s.addEventListener("squeeze",ne),s.addEventListener("squeezestart",ne),s.addEventListener("squeezeend",ne),s.addEventListener("end",X),s.addEventListener("inputsourceschange",Q),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,be=null,Le=null;_.depth&&(Le=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=_.stencil?Sr:Mr,be=_.stencil?_r:ts);const Xe={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer(Xe),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new Hn(p.textureWidth,p.textureHeight,{format:Gn,type:ti,depthTexture:new ud(p.textureWidth,p.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const _e={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Hn(m.framebufferWidth,m.framebufferHeight,{format:Gn,type:ti,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Se.setContext(s),Se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Q(Z){for(let K=0;K<Z.removed.length;K++){const _e=Z.removed[K],be=T.indexOf(_e);be>=0&&(T[be]=null,E[be].disconnect(_e))}for(let K=0;K<Z.added.length;K++){const _e=Z.added[K];let be=T.indexOf(_e);if(be===-1){for(let Xe=0;Xe<E.length;Xe++)if(Xe>=T.length){T.push(_e),be=Xe;break}else if(T[Xe]===null){T[Xe]=_e,be=Xe;break}if(be===-1)break}const Le=E[be];Le&&Le.connect(_e)}}const ie=new P,de=new P;function pe(Z,K,_e){ie.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(_e.matrixWorld);const be=ie.distanceTo(de),Le=K.projectionMatrix.elements,Xe=_e.projectionMatrix.elements,Lt=Le[14]/(Le[10]-1),qe=Le[14]/(Le[10]+1),wt=(Le[9]+1)/Le[5],B=(Le[9]-1)/Le[5],dt=(Le[8]-1)/Le[0],lt=(Xe[8]+1)/Xe[0],Ct=Lt*dt,Ge=Lt*lt,Dt=be/(-dt+lt),$e=Dt*-dt;if(K.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX($e),Z.translateZ(Dt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Le[10]===-1)Z.projectionMatrix.copy(K.projectionMatrix),Z.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ot=Lt+Dt,D=qe+Dt,A=Ct-$e,J=Ge+(be-$e),le=wt*qe/D*ot,fe=B*qe/D*ot;Z.projectionMatrix.makePerspective(A,J,le,fe,ot,D),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ze(Z,K){K===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(K.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let K=Z.near,_e=Z.far;x.texture!==null&&(x.depthNear>0&&(K=x.depthNear),x.depthFar>0&&(_e=x.depthFar)),F.near=S.near=b.near=K,F.far=S.far=b.far=_e,(W!==F.near||te!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),W=F.near,te=F.far),F.layers.mask=Z.layers.mask|6,b.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const be=Z.parent,Le=F.cameras;ze(F,be);for(let Xe=0;Xe<Le.length;Xe++)ze(Le[Xe],be);Le.length===2?pe(F,b,S):F.projectionMatrix.copy(b.projectionMatrix),I(Z,F,be)};function I(Z,K,_e){_e===null?Z.matrix.copy(K.matrixWorld):(Z.matrix.copy(_e.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(K.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(K.projectionMatrix),Z.projectionMatrixInverse.copy(K.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=br*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function(Z){c=Z,p!==null&&(p.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(F)},this.getCameraTexture=function(Z){return h[Z]};let ye=null;function Me(Z,K){if(d=K.getViewerPose(l||a),g=K,d!==null){const _e=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let be=!1;_e.length!==F.cameras.length&&(F.cameras.length=0,be=!0);for(let qe=0;qe<_e.length;qe++){const wt=_e[qe];let B=null;if(m!==null)B=m.getViewport(wt);else{const lt=u.getViewSubImage(p,wt);B=lt.viewport,qe===0&&(e.setRenderTargetTextures(y,lt.colorTexture,lt.depthStencilTexture),e.setRenderTarget(y))}let dt=L[qe];dt===void 0&&(dt=new wn,dt.layers.enable(qe),dt.viewport=new Ot,L[qe]=dt),dt.matrix.fromArray(wt.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(wt.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(B.x,B.y,B.width,B.height),qe===0&&(F.matrix.copy(dt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),be===!0&&F.cameras.push(dt)}const Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const qe=u.getDepthInformation(_e[0]);qe&&qe.isValid&&qe.texture&&x.init(qe,s.renderState)}if(Le&&Le.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let qe=0;qe<_e.length;qe++){const wt=_e[qe].camera;if(wt){let B=h[wt];B||(B=new fd,h[wt]=B);const dt=u.getCameraImage(wt);B.sourceTexture=dt}}}}for(let _e=0;_e<E.length;_e++){const be=T[_e],Le=E[_e];be!==null&&Le!==void 0&&Le.update(be,K,l||a)}ye&&ye(Z,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Se=new wd;Se.setAnimationLoop(Me),this.setAnimationLoop=function(Z){ye=Z},this.dispose=function(){}}}const Vi=new Xn,Qg=new Pt;function e1(i,e){function t(x,h){x.matrixAutoUpdate===!0&&x.updateMatrix(),h.value.copy(x.matrix)}function n(x,h){h.color.getRGB(x.fogColor.value,rd(i)),h.isFog?(x.fogNear.value=h.near,x.fogFar.value=h.far):h.isFogExp2&&(x.fogDensity.value=h.density)}function s(x,h,_,v,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(x,h):h.isMeshToonMaterial?(r(x,h),u(x,h)):h.isMeshPhongMaterial?(r(x,h),d(x,h)):h.isMeshStandardMaterial?(r(x,h),p(x,h),h.isMeshPhysicalMaterial&&m(x,h,y)):h.isMeshMatcapMaterial?(r(x,h),g(x,h)):h.isMeshDepthMaterial?r(x,h):h.isMeshDistanceMaterial?(r(x,h),M(x,h)):h.isMeshNormalMaterial?r(x,h):h.isLineBasicMaterial?(a(x,h),h.isLineDashedMaterial&&o(x,h)):h.isPointsMaterial?c(x,h,_,v):h.isSpriteMaterial?l(x,h):h.isShadowMaterial?(x.color.value.copy(h.color),x.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(x,h){x.opacity.value=h.opacity,h.color&&x.diffuse.value.copy(h.color),h.emissive&&x.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(x.map.value=h.map,t(h.map,x.mapTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.bumpMap&&(x.bumpMap.value=h.bumpMap,t(h.bumpMap,x.bumpMapTransform),x.bumpScale.value=h.bumpScale,h.side===hn&&(x.bumpScale.value*=-1)),h.normalMap&&(x.normalMap.value=h.normalMap,t(h.normalMap,x.normalMapTransform),x.normalScale.value.copy(h.normalScale),h.side===hn&&x.normalScale.value.negate()),h.displacementMap&&(x.displacementMap.value=h.displacementMap,t(h.displacementMap,x.displacementMapTransform),x.displacementScale.value=h.displacementScale,x.displacementBias.value=h.displacementBias),h.emissiveMap&&(x.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,x.emissiveMapTransform)),h.specularMap&&(x.specularMap.value=h.specularMap,t(h.specularMap,x.specularMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest);const _=e.get(h),v=_.envMap,y=_.envMapRotation;v&&(x.envMap.value=v,Vi.copy(y),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),x.envMapRotation.value.setFromMatrix4(Qg.makeRotationFromEuler(Vi)),x.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=h.reflectivity,x.ior.value=h.ior,x.refractionRatio.value=h.refractionRatio),h.lightMap&&(x.lightMap.value=h.lightMap,x.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,x.lightMapTransform)),h.aoMap&&(x.aoMap.value=h.aoMap,x.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,x.aoMapTransform))}function a(x,h){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,h.map&&(x.map.value=h.map,t(h.map,x.mapTransform))}function o(x,h){x.dashSize.value=h.dashSize,x.totalSize.value=h.dashSize+h.gapSize,x.scale.value=h.scale}function c(x,h,_,v){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,x.size.value=h.size*_,x.scale.value=v*.5,h.map&&(x.map.value=h.map,t(h.map,x.uvTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest)}function l(x,h){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,x.rotation.value=h.rotation,h.map&&(x.map.value=h.map,t(h.map,x.mapTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest)}function d(x,h){x.specular.value.copy(h.specular),x.shininess.value=Math.max(h.shininess,1e-4)}function u(x,h){h.gradientMap&&(x.gradientMap.value=h.gradientMap)}function p(x,h){x.metalness.value=h.metalness,h.metalnessMap&&(x.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,x.metalnessMapTransform)),x.roughness.value=h.roughness,h.roughnessMap&&(x.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,x.roughnessMapTransform)),h.envMap&&(x.envMapIntensity.value=h.envMapIntensity)}function m(x,h,_){x.ior.value=h.ior,h.sheen>0&&(x.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),x.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(x.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,x.sheenColorMapTransform)),h.sheenRoughnessMap&&(x.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,x.sheenRoughnessMapTransform))),h.clearcoat>0&&(x.clearcoat.value=h.clearcoat,x.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(x.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,x.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(x.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===hn&&x.clearcoatNormalScale.value.negate())),h.dispersion>0&&(x.dispersion.value=h.dispersion),h.iridescence>0&&(x.iridescence.value=h.iridescence,x.iridescenceIOR.value=h.iridescenceIOR,x.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(x.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,x.iridescenceMapTransform)),h.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),h.transmission>0&&(x.transmission.value=h.transmission,x.transmissionSamplerMap.value=_.texture,x.transmissionSamplerSize.value.set(_.width,_.height),h.transmissionMap&&(x.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,x.transmissionMapTransform)),x.thickness.value=h.thickness,h.thicknessMap&&(x.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=h.attenuationDistance,x.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(x.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(x.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=h.specularIntensity,x.specularColor.value.copy(h.specularColor),h.specularColorMap&&(x.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,x.specularColorMapTransform)),h.specularIntensityMap&&(x.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,h){h.matcap&&(x.matcap.value=h.matcap)}function M(x,h){const _=e.get(h).light;x.referencePosition.value.setFromMatrixPosition(_.matrixWorld),x.nearDistance.value=_.shadow.camera.near,x.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function t1(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){const y=v.program;n.uniformBlockBinding(_,y)}function l(_,v){let y=s[_.id];y===void 0&&(g(_),y=d(_),s[_.id]=y,_.addEventListener("dispose",x));const E=v.program;n.updateUBOMapping(_,E);const T=e.render.frame;r[_.id]!==T&&(p(_),r[_.id]=T)}function d(_){const v=u();_.__bindingPointIndex=v;const y=i.createBuffer(),E=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Vt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(_){const v=s[_.id],y=_.uniforms,E=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let T=0,R=y.length;T<R;T++){const C=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,S=C.length;b<S;b++){const L=C[b];if(m(L,T,b,E)===!0){const F=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let te=0;for(let ne=0;ne<W.length;ne++){const X=W[ne],Q=M(X);typeof X=="number"||typeof X=="boolean"?(L.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,F+te,L.__data)):X.isMatrix3?(L.__data[0]=X.elements[0],L.__data[1]=X.elements[1],L.__data[2]=X.elements[2],L.__data[3]=0,L.__data[4]=X.elements[3],L.__data[5]=X.elements[4],L.__data[6]=X.elements[5],L.__data[7]=0,L.__data[8]=X.elements[6],L.__data[9]=X.elements[7],L.__data[10]=X.elements[8],L.__data[11]=0):(X.toArray(L.__data,te),te+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(_,v,y,E){const T=_.value,R=v+"_"+y;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const C=E[R];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[R]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(_){const v=_.uniforms;let y=0;const E=16;for(let R=0,C=v.length;R<C;R++){const b=Array.isArray(v[R])?v[R]:[v[R]];for(let S=0,L=b.length;S<L;S++){const F=b[S],W=Array.isArray(F.value)?F.value:[F.value];for(let te=0,ne=W.length;te<ne;te++){const X=W[te],Q=M(X),ie=y%E,de=ie%Q.boundary,pe=ie+de;y+=de,pe!==0&&E-pe<Q.storage&&(y+=E-pe),F.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Q.storage}}}const T=y%E;return T>0&&(y+=E-T),_.__size=y,_.__cache={},this}function M(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?ct("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ct("WebGLRenderer: Unsupported uniform value type.",_),v}function x(_){const v=_.target;v.removeEventListener("dispose",x);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function h(){for(const _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const n1=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let li=null;function i1(){return li===null&&(li=new dd(n1,32,32,kc,jn),li.minFilter=In,li.magFilter=In,li.wrapS=fi,li.wrapT=fi,li.generateMipmaps=!1,li.needsUpdate=!0),li}class s1{constructor(e={}){const{canvas:t=Bu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Set([Gc,Vc,zc]),M=new Set([ti,ts,vr,_r,Nc,Oc]),x=new Uint32Array(4),h=new Int32Array(4);let _=null,v=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let R=!1;this._outputColorSpace=At;let C=0,b=0,S=null,L=-1,F=null;const W=new Ot,te=new Ot;let ne=null;const X=new tt(0);let Q=0,ie=t.width,de=t.height,pe=1,ze=null,I=null;const ye=new Ot(0,0,ie,de),Me=new Ot(0,0,ie,de);let Se=!1;const Z=new $c;let K=!1,_e=!1;const be=new Pt,Le=new P,Xe=new Ot,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qe=!1;function wt(){return S===null?pe:1}let B=n;function dt(w,U){return t.getContext(w,U)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Dc}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",he,!1),t.addEventListener("webglcontextcreationerror",Be,!1),B===null){const U="webgl2";if(B=dt(U,w),B===null)throw dt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let lt,Ct,Ge,Dt,$e,ot,D,A,J,le,fe,ae,Ve,Re,Je,He,ge,we,nt,je,Ne,st,k,De;function Ee(){lt=new ux(B),lt.init(),st=new Zg(B,lt),Ct=new ix(B,lt,e,st),Ge=new Yg(B,lt),Ct.reversedDepthBuffer&&p&&Ge.buffers.depth.setReversed(!0),Dt=new mx(B),$e=new Ig,ot=new qg(B,lt,Ge,$e,Ct,st,Dt),D=new rx(T),A=new dx(T),J=new _0(B),k=new tx(B,J),le=new fx(B,J,Dt,k),fe=new gx(B,le,J,Dt),nt=new xx(B,Ct,ot),He=new sx($e),ae=new Dg(T,D,A,lt,Ct,k,He),Ve=new e1(T,$e),Re=new Fg,Je=new Vg(lt),we=new ex(T,D,A,Ge,fe,m,c),ge=new Wg(T,fe,Ct),De=new t1(B,Dt,Ct,Ge),je=new nx(B,lt,Dt),Ne=new px(B,lt,Dt),Dt.programs=ae.programs,T.capabilities=Ct,T.extensions=lt,T.properties=$e,T.renderLists=Re,T.shadowMap=ge,T.state=Ge,T.info=Dt}Ee();const Ae=new jg(T,B);this.xr=Ae,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const w=lt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=lt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return pe},this.setPixelRatio=function(w){w!==void 0&&(pe=w,this.setSize(ie,de,!1))},this.getSize=function(w){return w.set(ie,de)},this.setSize=function(w,U,V=!0){if(Ae.isPresenting){ct("WebGLRenderer: Can't change size while VR device is presenting.");return}ie=w,de=U,t.width=Math.floor(w*pe),t.height=Math.floor(U*pe),V===!0&&(t.style.width=w+"px",t.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(ie*pe,de*pe).floor()},this.setDrawingBufferSize=function(w,U,V){ie=w,de=U,pe=V,t.width=Math.floor(w*V),t.height=Math.floor(U*V),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(W)},this.getViewport=function(w){return w.copy(ye)},this.setViewport=function(w,U,V,H){w.isVector4?ye.set(w.x,w.y,w.z,w.w):ye.set(w,U,V,H),Ge.viewport(W.copy(ye).multiplyScalar(pe).round())},this.getScissor=function(w){return w.copy(Me)},this.setScissor=function(w,U,V,H){w.isVector4?Me.set(w.x,w.y,w.z,w.w):Me.set(w,U,V,H),Ge.scissor(te.copy(Me).multiplyScalar(pe).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(w){Ge.setScissorTest(Se=w)},this.setOpaqueSort=function(w){ze=w},this.setTransparentSort=function(w){I=w},this.getClearColor=function(w){return w.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(w=!0,U=!0,V=!0){let H=0;if(w){let z=!1;if(S!==null){const se=S.texture.format;z=g.has(se)}if(z){const se=S.texture.type,$=M.has(se),me=we.getClearColor(),ue=we.getClearAlpha(),Ce=me.r,Pe=me.g,xe=me.b;$?(x[0]=Ce,x[1]=Pe,x[2]=xe,x[3]=ue,B.clearBufferuiv(B.COLOR,0,x)):(h[0]=Ce,h[1]=Pe,h[2]=xe,h[3]=ue,B.clearBufferiv(B.COLOR,0,h))}else H|=B.COLOR_BUFFER_BIT}U&&(H|=B.DEPTH_BUFFER_BIT),V&&(H|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",he,!1),t.removeEventListener("webglcontextcreationerror",Be,!1),we.dispose(),Re.dispose(),Je.dispose(),$e.dispose(),D.dispose(),A.dispose(),fe.dispose(),k.dispose(),De.dispose(),ae.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",Ws),Ae.removeEventListener("sessionend",ii),En.stop()};function ve(w){w.preventDefault(),Ta("WebGLRenderer: Context Lost."),R=!0}function he(){Ta("WebGLRenderer: Context Restored."),R=!1;const w=Dt.autoReset,U=ge.enabled,V=ge.autoUpdate,H=ge.needsUpdate,z=ge.type;Ee(),Dt.autoReset=w,ge.enabled=U,ge.autoUpdate=V,ge.needsUpdate=H,ge.type=z}function Be(w){Vt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function it(w){const U=w.target;U.removeEventListener("dispose",it),It(U)}function It(w){Tt(w),$e.remove(w)}function Tt(w){const U=$e.get(w).programs;U!==void 0&&(U.forEach(function(V){ae.releaseProgram(V)}),w.isShaderMaterial&&ae.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,V,H,z,se){U===null&&(U=Lt);const $=z.isMesh&&z.matrixWorld.determinant()<0,me=O(w,U,V,H,z);Ge.setMaterial(H,$);let ue=V.index,Ce=1;if(H.wireframe===!0){if(ue=le.getWireframeAttribute(V),ue===void 0)return;Ce=2}const Pe=V.drawRange,xe=V.attributes.position;let Ke=Pe.start*Ce,rt=(Pe.start+Pe.count)*Ce;se!==null&&(Ke=Math.max(Ke,se.start*Ce),rt=Math.min(rt,(se.start+se.count)*Ce)),ue!==null?(Ke=Math.max(Ke,0),rt=Math.min(rt,ue.count)):xe!=null&&(Ke=Math.max(Ke,0),rt=Math.min(rt,xe.count));const vt=rt-Ke;if(vt<0||vt===1/0)return;k.setup(z,H,me,V,ue);let Mt,ut=je;if(ue!==null&&(Mt=J.get(ue),ut=Ne,ut.setIndex(Mt)),z.isMesh)H.wireframe===!0?(Ge.setLineWidth(H.wireframeLinewidth*wt()),ut.setMode(B.LINES)):ut.setMode(B.TRIANGLES);else if(z.isLine){let ke=H.linewidth;ke===void 0&&(ke=1),Ge.setLineWidth(ke*wt()),z.isLineSegments?ut.setMode(B.LINES):z.isLineLoop?ut.setMode(B.LINE_LOOP):ut.setMode(B.LINE_STRIP)}else z.isPoints?ut.setMode(B.POINTS):z.isSprite&&ut.setMode(B.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)yr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(lt.get("WEBGL_multi_draw"))ut.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const ke=z._multiDrawStarts,St=z._multiDrawCounts,mt=z._multiDrawCount,kt=ue?J.get(ue).bytesPerElement:1,tn=$e.get(H).currentProgram.getUniforms();for(let qt=0;qt<mt;qt++)tn.setValue(B,"_gl_DrawID",qt),ut.render(ke[qt]/kt,St[qt])}else if(z.isInstancedMesh)ut.renderInstances(Ke,vt,z.count);else if(V.isInstancedBufferGeometry){const ke=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,St=Math.min(V.instanceCount,ke);ut.renderInstances(Ke,vt,St)}else ut.render(Ke,vt)};function Yt(w,U,V){w.transparent===!0&&w.side===pt&&w.forceSinglePass===!1?(w.side=hn,w.needsUpdate=!0,as(w,U,V),w.side=Ii,w.needsUpdate=!0,as(w,U,V),w.side=pt):as(w,U,V)}this.compile=function(w,U,V=null){V===null&&(V=w),v=Je.get(V),v.init(U),E.push(v),V.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),w!==V&&w.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),v.setupLights();const H=new Set;return w.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const se=z.material;if(se)if(Array.isArray(se))for(let $=0;$<se.length;$++){const me=se[$];Yt(me,V,z),H.add(me)}else Yt(se,V,z),H.add(se)}),v=E.pop(),H},this.compileAsync=function(w,U,V=null){const H=this.compile(w,U,V);return new Promise(z=>{function se(){if(H.forEach(function($){$e.get($).currentProgram.isReady()&&H.delete($)}),H.size===0){z(w);return}setTimeout(se,10)}lt.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Sn=null;function Ir(w){Sn&&Sn(w)}function Ws(){En.stop()}function ii(){En.start()}const En=new wd;En.setAnimationLoop(Ir),typeof self<"u"&&En.setContext(self),this.setAnimationLoop=function(w){Sn=w,Ae.setAnimationLoop(w),w===null?En.stop():En.start()},Ae.addEventListener("sessionstart",Ws),Ae.addEventListener("sessionend",ii),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){Vt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(U),U=Ae.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,U,S),v=Je.get(w,E.length),v.init(U),E.push(v),be.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Z.setFromProjectionMatrix(be,Kn,U.reversedDepth),_e=this.localClippingEnabled,K=He.init(this.clippingPlanes,_e),_=Re.get(w,y.length),_.init(),y.push(_),Ae.enabled===!0&&Ae.isPresenting===!0){const se=T.xr.getDepthSensingMesh();se!==null&&Xs(se,U,-1/0,T.sortObjects)}Xs(w,U,0,T.sortObjects),_.finish(),T.sortObjects===!0&&_.sort(ze,I),qe=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,qe&&we.addToRenderList(_,w),this.info.render.frame++,K===!0&&He.beginShadows();const V=v.state.shadowsArray;ge.render(V,w,U),K===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=_.opaque,z=_.transmissive;if(v.setupLights(),U.isArrayCamera){const se=U.cameras;if(z.length>0)for(let $=0,me=se.length;$<me;$++){const ue=se[$];Fr(H,z,w,ue)}qe&&we.render(w);for(let $=0,me=se.length;$<me;$++){const ue=se[$];Ur(_,w,ue,ue.viewport)}}else z.length>0&&Fr(H,z,w,U),qe&&we.render(w),Ur(_,w,U);S!==null&&b===0&&(ot.updateMultisampleRenderTarget(S),ot.updateRenderTargetMipmap(S)),w.isScene===!0&&w.onAfterRender(T,w,U),k.resetDefaultState(),L=-1,F=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&He.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,y.pop(),y.length>0?_=y[y.length-1]:_=null};function Xs(w,U,V,H){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)V=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Z.intersectsSprite(w)){H&&Xe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(be);const $=fe.update(w),me=w.material;me.visible&&_.push(w,$,me,V,Xe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Z.intersectsObject(w))){const $=fe.update(w),me=w.material;if(H&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Xe.copy(w.boundingSphere.center)):($.boundingSphere===null&&$.computeBoundingSphere(),Xe.copy($.boundingSphere.center)),Xe.applyMatrix4(w.matrixWorld).applyMatrix4(be)),Array.isArray(me)){const ue=$.groups;for(let Ce=0,Pe=ue.length;Ce<Pe;Ce++){const xe=ue[Ce],Ke=me[xe.materialIndex];Ke&&Ke.visible&&_.push(w,$,Ke,V,Xe.z,xe)}}else me.visible&&_.push(w,$,me,V,Xe.z,null)}}const se=w.children;for(let $=0,me=se.length;$<me;$++)Xs(se[$],U,V,H)}function Ur(w,U,V,H){const{opaque:z,transmissive:se,transparent:$}=w;v.setupLightsView(V),K===!0&&He.setGlobalState(T.clippingPlanes,V),H&&Ge.viewport(W.copy(H)),z.length>0&&rs(z,U,V),se.length>0&&rs(se,U,V),$.length>0&&rs($,U,V),Ge.buffers.depth.setTest(!0),Ge.buffers.depth.setMask(!0),Ge.buffers.color.setMask(!0),Ge.setPolygonOffset(!1)}function Fr(w,U,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[H.id]===void 0&&(v.state.transmissionRenderTarget[H.id]=new Hn(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float")?jn:ti,minFilter:Zi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Et.workingColorSpace}));const se=v.state.transmissionRenderTarget[H.id],$=H.viewport||W;se.setSize($.z*T.transmissionResolutionScale,$.w*T.transmissionResolutionScale);const me=T.getRenderTarget(),ue=T.getActiveCubeFace(),Ce=T.getActiveMipmapLevel();T.setRenderTarget(se),T.getClearColor(X),Q=T.getClearAlpha(),Q<1&&T.setClearColor(16777215,.5),T.clear(),qe&&we.render(V);const Pe=T.toneMapping;T.toneMapping=Pi;const xe=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),v.setupLightsView(H),K===!0&&He.setGlobalState(T.clippingPlanes,H),rs(w,V,H),ot.updateMultisampleRenderTarget(se),ot.updateRenderTargetMipmap(se),lt.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let rt=0,vt=U.length;rt<vt;rt++){const Mt=U[rt],{object:ut,geometry:ke,material:St,group:mt}=Mt;if(St.side===pt&&ut.layers.test(H.layers)){const kt=St.side;St.side=hn,St.needsUpdate=!0,en(ut,V,H,ke,St,mt),St.side=kt,St.needsUpdate=!0,Ke=!0}}Ke===!0&&(ot.updateMultisampleRenderTarget(se),ot.updateRenderTargetMipmap(se))}T.setRenderTarget(me,ue,Ce),T.setClearColor(X,Q),xe!==void 0&&(H.viewport=xe),T.toneMapping=Pe}function rs(w,U,V){const H=U.isScene===!0?U.overrideMaterial:null;for(let z=0,se=w.length;z<se;z++){const $=w[z],{object:me,geometry:ue,group:Ce}=$;let Pe=$.material;Pe.allowOverride===!0&&H!==null&&(Pe=H),me.layers.test(V.layers)&&en(me,U,V,ue,Pe,Ce)}}function en(w,U,V,H,z,se){w.onBeforeRender(T,U,V,H,z,se),w.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(T,U,V,H,w,se),z.transparent===!0&&z.side===pt&&z.forceSinglePass===!1?(z.side=hn,z.needsUpdate=!0,T.renderBufferDirect(V,U,H,z,w,se),z.side=Ii,z.needsUpdate=!0,T.renderBufferDirect(V,U,H,z,w,se),z.side=pt):T.renderBufferDirect(V,U,H,z,w,se),w.onAfterRender(T,U,V,H,z,se)}function as(w,U,V){U.isScene!==!0&&(U=Lt);const H=$e.get(w),z=v.state.lights,se=v.state.shadowsArray,$=z.state.version,me=ae.getParameters(w,z.state,se,U,V),ue=ae.getProgramCacheKey(me);let Ce=H.programs;H.environment=w.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(w.isMeshStandardMaterial?A:D).get(w.envMap||H.environment),H.envMapRotation=H.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Ce===void 0&&(w.addEventListener("dispose",it),Ce=new Map,H.programs=Ce);let Pe=Ce.get(ue);if(Pe!==void 0){if(H.currentProgram===Pe&&H.lightsStateVersion===$)return N(w,me),Pe}else me.uniforms=ae.getUniforms(w),w.onBeforeCompile(me,T),Pe=ae.acquireProgram(me,ue),Ce.set(ue,Pe),H.uniforms=me.uniforms;const xe=H.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(xe.clippingPlanes=He.uniform),N(w,me),H.needsLights=j(w),H.lightsStateVersion=$,H.needsLights&&(xe.ambientLightColor.value=z.state.ambient,xe.lightProbe.value=z.state.probe,xe.directionalLights.value=z.state.directional,xe.directionalLightShadows.value=z.state.directionalShadow,xe.spotLights.value=z.state.spot,xe.spotLightShadows.value=z.state.spotShadow,xe.rectAreaLights.value=z.state.rectArea,xe.ltc_1.value=z.state.rectAreaLTC1,xe.ltc_2.value=z.state.rectAreaLTC2,xe.pointLights.value=z.state.point,xe.pointLightShadows.value=z.state.pointShadow,xe.hemisphereLights.value=z.state.hemi,xe.directionalShadowMap.value=z.state.directionalShadowMap,xe.directionalShadowMatrix.value=z.state.directionalShadowMatrix,xe.spotShadowMap.value=z.state.spotShadowMap,xe.spotLightMatrix.value=z.state.spotLightMatrix,xe.spotLightMap.value=z.state.spotLightMap,xe.pointShadowMap.value=z.state.pointShadowMap,xe.pointShadowMatrix.value=z.state.pointShadowMatrix),H.currentProgram=Pe,H.uniformsList=null,Pe}function Ys(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=va.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function N(w,U){const V=$e.get(w);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function O(w,U,V,H,z){U.isScene!==!0&&(U=Lt),ot.resetTextureUnits();const se=U.fog,$=H.isMeshStandardMaterial?U.environment:null,me=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Us,ue=(H.isMeshStandardMaterial?A:D).get(H.envMap||$),Ce=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Pe=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),xe=!!V.morphAttributes.position,Ke=!!V.morphAttributes.normal,rt=!!V.morphAttributes.color;let vt=Pi;H.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(vt=T.toneMapping);const Mt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ut=Mt!==void 0?Mt.length:0,ke=$e.get(H),St=v.state.lights;if(K===!0&&(_e===!0||w!==F)){const pn=w===F&&H.id===L;He.setState(H,w,pn)}let mt=!1;H.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==St.state.version||ke.outputColorSpace!==me||z.isBatchedMesh&&ke.batching===!1||!z.isBatchedMesh&&ke.batching===!0||z.isBatchedMesh&&ke.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&ke.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&ke.instancing===!1||!z.isInstancedMesh&&ke.instancing===!0||z.isSkinnedMesh&&ke.skinning===!1||!z.isSkinnedMesh&&ke.skinning===!0||z.isInstancedMesh&&ke.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ke.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&ke.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&ke.instancingMorph===!1&&z.morphTexture!==null||ke.envMap!==ue||H.fog===!0&&ke.fog!==se||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==He.numPlanes||ke.numIntersection!==He.numIntersection)||ke.vertexAlphas!==Ce||ke.vertexTangents!==Pe||ke.morphTargets!==xe||ke.morphNormals!==Ke||ke.morphColors!==rt||ke.toneMapping!==vt||ke.morphTargetsCount!==ut)&&(mt=!0):(mt=!0,ke.__version=H.version);let kt=ke.currentProgram;mt===!0&&(kt=as(H,U,z));let tn=!1,qt=!1,An=!1;const Nt=kt.getUniforms(),vn=ke.uniforms;if(Ge.useProgram(kt.program)&&(tn=!0,qt=!0,An=!0),H.id!==L&&(L=H.id,qt=!0),tn||F!==w){Ge.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Nt.setValue(B,"projectionMatrix",w.projectionMatrix),Nt.setValue(B,"viewMatrix",w.matrixWorldInverse);const _n=Nt.map.cameraPosition;_n!==void 0&&_n.setValue(B,Le.setFromMatrixPosition(w.matrixWorld)),Ct.logarithmicDepthBuffer&&Nt.setValue(B,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Nt.setValue(B,"isOrthographic",w.isOrthographicCamera===!0),F!==w&&(F=w,qt=!0,An=!0)}if(z.isSkinnedMesh){Nt.setOptional(B,z,"bindMatrix"),Nt.setOptional(B,z,"bindMatrixInverse");const pn=z.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),Nt.setValue(B,"boneTexture",pn.boneTexture,ot))}z.isBatchedMesh&&(Nt.setOptional(B,z,"batchingTexture"),Nt.setValue(B,"batchingTexture",z._matricesTexture,ot),Nt.setOptional(B,z,"batchingIdTexture"),Nt.setValue(B,"batchingIdTexture",z._indirectTexture,ot),Nt.setOptional(B,z,"batchingColorTexture"),z._colorsTexture!==null&&Nt.setValue(B,"batchingColorTexture",z._colorsTexture,ot));const Cn=V.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&nt.update(z,V,kt),(qt||ke.receiveShadow!==z.receiveShadow)&&(ke.receiveShadow=z.receiveShadow,Nt.setValue(B,"receiveShadow",z.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(vn.envMap.value=ue,vn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(vn.envMapIntensity.value=U.environmentIntensity),vn.dfgLUT!==void 0&&(vn.dfgLUT.value=i1()),qt&&(Nt.setValue(B,"toneMappingExposure",T.toneMappingExposure),ke.needsLights&&Y(vn,An),se&&H.fog===!0&&Ve.refreshFogUniforms(vn,se),Ve.refreshMaterialUniforms(vn,H,pe,de,v.state.transmissionRenderTarget[w.id]),va.upload(B,Ys(ke),vn,ot)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(va.upload(B,Ys(ke),vn,ot),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Nt.setValue(B,"center",z.center),Nt.setValue(B,"modelViewMatrix",z.modelViewMatrix),Nt.setValue(B,"normalMatrix",z.normalMatrix),Nt.setValue(B,"modelMatrix",z.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const pn=H.uniformsGroups;for(let _n=0,Ga=pn.length;_n<Ga;_n++){const Fi=pn[_n];De.update(Fi,kt),De.bind(Fi,kt)}}return kt}function Y(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function j(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(w,U,V){const H=$e.get(w);H.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),$e.get(w.texture).__webglTexture=U,$e.get(w.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:V,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,U){const V=$e.get(w);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(w,U=0,V=0){S=w,C=U,b=V;let H=!0,z=null,se=!1,$=!1;if(w){const ue=$e.get(w);if(ue.__useDefaultFramebuffer!==void 0)Ge.bindFramebuffer(B.FRAMEBUFFER,null),H=!1;else if(ue.__webglFramebuffer===void 0)ot.setupRenderTarget(w);else if(ue.__hasExternalTextures)ot.rebindTextures(w,$e.get(w.texture).__webglTexture,$e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const xe=w.depthTexture;if(ue.__boundDepthTexture!==xe){if(xe!==null&&$e.has(xe)&&(w.width!==xe.image.width||w.height!==xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ot.setupDepthRenderbuffer(w)}}const Ce=w.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&($=!0);const Pe=$e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Pe[U])?z=Pe[U][V]:z=Pe[U],se=!0):w.samples>0&&ot.useMultisampledRTT(w)===!1?z=$e.get(w).__webglMultisampledFramebuffer:Array.isArray(Pe)?z=Pe[V]:z=Pe,W.copy(w.viewport),te.copy(w.scissor),ne=w.scissorTest}else W.copy(ye).multiplyScalar(pe).floor(),te.copy(Me).multiplyScalar(pe).floor(),ne=Se;if(V!==0&&(z=ee),Ge.bindFramebuffer(B.FRAMEBUFFER,z)&&H&&Ge.drawBuffers(w,z),Ge.viewport(W),Ge.scissor(te),Ge.setScissorTest(ne),se){const ue=$e.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,ue.__webglTexture,V)}else if($){const ue=U;for(let Ce=0;Ce<w.textures.length;Ce++){const Pe=$e.get(w.textures[Ce]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ce,Pe.__webglTexture,V,ue)}}else if(w!==null&&V!==0){const ue=$e.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ue.__webglTexture,V)}L=-1},this.readRenderTargetPixels=function(w,U,V,H,z,se,$,me=0){if(!(w&&w.isWebGLRenderTarget)){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&$!==void 0&&(ue=ue[$]),ue){Ge.bindFramebuffer(B.FRAMEBUFFER,ue);try{const Ce=w.textures[me],Pe=Ce.format,xe=Ce.type;if(!Ct.textureFormatReadable(Pe)){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(xe)){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-H&&V>=0&&V<=w.height-z&&(w.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me),B.readPixels(U,V,H,z,st.convert(Pe),st.convert(xe),se))}finally{const Ce=S!==null?$e.get(S).__webglFramebuffer:null;Ge.bindFramebuffer(B.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(w,U,V,H,z,se,$,me=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&$!==void 0&&(ue=ue[$]),ue)if(U>=0&&U<=w.width-H&&V>=0&&V<=w.height-z){Ge.bindFramebuffer(B.FRAMEBUFFER,ue);const Ce=w.textures[me],Pe=Ce.format,xe=Ce.type;if(!Ct.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ke),B.bufferData(B.PIXEL_PACK_BUFFER,se.byteLength,B.STREAM_READ),w.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me),B.readPixels(U,V,H,z,st.convert(Pe),st.convert(xe),0);const rt=S!==null?$e.get(S).__webglFramebuffer:null;Ge.bindFramebuffer(B.FRAMEBUFFER,rt);const vt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await zu(B,vt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ke),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,se),B.deleteBuffer(Ke),B.deleteSync(vt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,U=null,V=0){const H=Math.pow(2,-V),z=Math.floor(w.image.width*H),se=Math.floor(w.image.height*H),$=U!==null?U.x:0,me=U!==null?U.y:0;ot.setTexture2D(w,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,$,me,z,se),Ge.unbindTexture()};const oe=B.createFramebuffer(),re=B.createFramebuffer();this.copyTextureToTexture=function(w,U,V=null,H=null,z=0,se=null){se===null&&(z!==0?(yr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=z,z=0):se=0);let $,me,ue,Ce,Pe,xe,Ke,rt,vt;const Mt=w.isCompressedTexture?w.mipmaps[se]:w.image;if(V!==null)$=V.max.x-V.min.x,me=V.max.y-V.min.y,ue=V.isBox3?V.max.z-V.min.z:1,Ce=V.min.x,Pe=V.min.y,xe=V.isBox3?V.min.z:0;else{const Cn=Math.pow(2,-z);$=Math.floor(Mt.width*Cn),me=Math.floor(Mt.height*Cn),w.isDataArrayTexture?ue=Mt.depth:w.isData3DTexture?ue=Math.floor(Mt.depth*Cn):ue=1,Ce=0,Pe=0,xe=0}H!==null?(Ke=H.x,rt=H.y,vt=H.z):(Ke=0,rt=0,vt=0);const ut=st.convert(U.format),ke=st.convert(U.type);let St;U.isData3DTexture?(ot.setTexture3D(U,0),St=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ot.setTexture2DArray(U,0),St=B.TEXTURE_2D_ARRAY):(ot.setTexture2D(U,0),St=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);const mt=B.getParameter(B.UNPACK_ROW_LENGTH),kt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),tn=B.getParameter(B.UNPACK_SKIP_PIXELS),qt=B.getParameter(B.UNPACK_SKIP_ROWS),An=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Mt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Mt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Ce),B.pixelStorei(B.UNPACK_SKIP_ROWS,Pe),B.pixelStorei(B.UNPACK_SKIP_IMAGES,xe);const Nt=w.isDataArrayTexture||w.isData3DTexture,vn=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){const Cn=$e.get(w),pn=$e.get(U),_n=$e.get(Cn.__renderTarget),Ga=$e.get(pn.__renderTarget);Ge.bindFramebuffer(B.READ_FRAMEBUFFER,_n.__webglFramebuffer),Ge.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ga.__webglFramebuffer);for(let Fi=0;Fi<ue;Fi++)Nt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,$e.get(w).__webglTexture,z,xe+Fi),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,$e.get(U).__webglTexture,se,vt+Fi)),B.blitFramebuffer(Ce,Pe,$,me,Ke,rt,$,me,B.DEPTH_BUFFER_BIT,B.NEAREST);Ge.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ge.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(z!==0||w.isRenderTargetTexture||$e.has(w)){const Cn=$e.get(w),pn=$e.get(U);Ge.bindFramebuffer(B.READ_FRAMEBUFFER,oe),Ge.bindFramebuffer(B.DRAW_FRAMEBUFFER,re);for(let _n=0;_n<ue;_n++)Nt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Cn.__webglTexture,z,xe+_n):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Cn.__webglTexture,z),vn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,pn.__webglTexture,se,vt+_n):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,pn.__webglTexture,se),z!==0?B.blitFramebuffer(Ce,Pe,$,me,Ke,rt,$,me,B.COLOR_BUFFER_BIT,B.NEAREST):vn?B.copyTexSubImage3D(St,se,Ke,rt,vt+_n,Ce,Pe,$,me):B.copyTexSubImage2D(St,se,Ke,rt,Ce,Pe,$,me);Ge.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ge.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else vn?w.isDataTexture||w.isData3DTexture?B.texSubImage3D(St,se,Ke,rt,vt,$,me,ue,ut,ke,Mt.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(St,se,Ke,rt,vt,$,me,ue,ut,Mt.data):B.texSubImage3D(St,se,Ke,rt,vt,$,me,ue,ut,ke,Mt):w.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,se,Ke,rt,$,me,ut,ke,Mt.data):w.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,se,Ke,rt,Mt.width,Mt.height,ut,Mt.data):B.texSubImage2D(B.TEXTURE_2D,se,Ke,rt,$,me,ut,ke,Mt);B.pixelStorei(B.UNPACK_ROW_LENGTH,mt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,kt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,tn),B.pixelStorei(B.UNPACK_SKIP_ROWS,qt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,An),se===0&&U.generateMipmaps&&B.generateMipmap(St),Ge.unbindTexture()},this.initRenderTarget=function(w){$e.get(w).__webglFramebuffer===void 0&&ot.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?ot.setTextureCube(w,0):w.isData3DTexture?ot.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?ot.setTexture2DArray(w,0):ot.setTexture2D(w,0),Ge.unbindTexture()},this.resetState=function(){C=0,b=0,S=null,Ge.reset(),k.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),t.unpackColorSpace=Et._getUnpackColorSpace()}}const _a={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Gs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const r1=new nl(-1,1,1,-1,0,1);class a1 extends Wt{constructor(){super(),this.setAttribute("position",new bt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bt([0,2,0,0,2,0],2))}}const o1=new a1;class il{constructor(e){this._mesh=new G(o1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,r1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Rd extends Gs{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof ln?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=wr.clone(e.uniforms),this.material=new ln({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new il(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class bh extends Gs{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class c1 extends Gs{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class l1{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Te);this._width=n.width,this._height=n.height,t=new Hn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:jn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Rd(_a),this.copyPass.material.blending=Jn,this.clock=new bd}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}bh!==void 0&&(a instanceof bh?n=!0:a instanceof c1&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class h1 extends Gs{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new tt}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const d1={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new tt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Bs extends Gs{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new tt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Hn(r,a,{type:jn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new Hn(r,a,{type:jn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const p=new Hn(r,a,{type:jn});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=d1;this.highPassUniforms=wr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ln({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=wr.clone(_a.uniforms),this.blendMaterial=new ln({uniforms:this.copyUniforms,vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,blending:Ai,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new tt,this._oldClearAlpha=1,this._basic=new Rt,this._fsQuad=new il(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Bs.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Bs.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new ln({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new ln({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Bs.BlurDirectionX=new Te(1,0);Bs.BlurDirectionY=new Te(0,1);const da={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class u1 extends Gs{constructor(){super(),this.uniforms=wr.clone(da.uniforms),this.material=new l0({name:da.name,uniforms:this.uniforms,vertexShader:da.vertexShader,fragmentShader:da.fragmentShader}),this._fsQuad=new il(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Et.getTransfer(this._outputColorSpace)===Ut&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===kh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Vh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Gh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Uc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Wh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Xh?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Hh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class f1 extends cd{constructor(){super();const e=new Ie;e.deleteAttribute("uv");const t=new q({side:hn}),n=new q,s=new tl(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new G(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new an(e,n,6),o=new Ht;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new G(e,Es(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new G(e,Es(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new G(e,Es(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new G(e,Es(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const p=new G(e,Es(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new G(e,Es(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Es(i){return new h0({color:0,emissive:16777215,emissiveIntensity:i})}const Pr=document.querySelector("#game"),Qt=new s1({canvas:Pr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});Qt.setPixelRatio(Math.min(window.devicePixelRatio,2));Qt.setSize(window.innerWidth,window.innerHeight);Qt.shadowMap.enabled=!0;Qt.shadowMap.type=zh;Qt.outputColorSpace=At;Qt.toneMapping=Uc;Qt.toneMappingExposure=1.23;const et=new cd;et.background=new tt(5814015);et.fog=new Zc(11001343,205,1520);const Pd=new Tc(Qt);Pd.compileEquirectangularShader();et.environment=Pd.fromScene(new f1,.04).texture;et.environmentIntensity=.78;const Ze=new wn(69,window.innerWidth/window.innerHeight,.08,1800);et.add(Ze);const Qe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const _t=new Set,Fe={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},p1=new bd,on=new P(0,1,0),Ld=new P,Dd=new P,sl=new P,Ln=new Ht,Id=.86,Ac=1.2,m1=.78,ei=.55,di={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},is=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Ud=Math.max(...is.map(i=>i.width));let Ma=0,ce=is[0];const f={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Qe.best.textContent=`Best score ${f.best}`;function x1(i){const e=Oe.clamp(i,0,1);return e*e*(3-2*e)}function g1(i,e){let t=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;e>=s&&e<=r?t+=n.rise*Oe.clamp((e-s)/(n.approach+n.carry),0,1):e>r&&e<=n.end?t+=n.rise:e>n.end&&e<=a&&(t+=n.rise*(1-x1((e-n.end)/n.settle)))}return t}function rl(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function Fd(i,e){const{t,n}=rl(i,e),s=i.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=g1(i,n),r}function ua(i){const{x:e,z:t,n}=rl(ce,i),s=Fd(ce,n);return new P(e,s,t)}function yt(i){const e=(i%ce.length+ce.length)%ce.length,t=ua(e),s=ua(e+2).sub(t).normalize(),r=Ld.crossVectors(on,s).normalize(),a=ua(e-2).y,o=ua(e+2).y,c=Math.atan2(o-a,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,d=ce.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Li(i){const e=(i%ce.length+ce.length)%ce.length;return ce.gaps.some(t=>e>t.start&&e<t.end)}function wh(i){return Oe.clamp(i/(ce.length*ce.laps),0,1)}function Th(i,e,t){const n=Math.floor(i/ce.length),s=Math.floor(e/ce.length);for(let r=n;r<=s;r++){const a=r*ce.length+t;if(i<a&&e>=a)return!0}return!1}function v1(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new $t(t);return r.colorSpace=At,r.wrapS=un,r.wrapT=un,r.repeat.set(3,1),r}function _1(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new $t(e);return s.colorSpace=At,s.wrapS=un,s.wrapT=un,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function M1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new $t(e);return s.colorSpace=At,s.wrapS=un,s.wrapT=un,s.repeat.set(18,18),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function S1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#263139"),n.addColorStop(.45,"#3a444a"),n.addColorStop(1,"#1b242c"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.32,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=t.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,c=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*i,Math.random()*i,c,c)}const s=new $t(e);return s.colorSpace=At,s.wrapS=un,s.wrapT=un,s.repeat.set(9,16),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function y1(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(255, 255, 238, 1)"),n.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),n.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),n.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),n.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=n,t.fillRect(0,0,i,i);const s=new $t(e);return s.colorSpace=At,s}function As(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new $t(n);return r.colorSpace=At,r}function b1(i=256,e=256,t="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,i,e*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,e*.24,i*.19,e*.2),a(i*.68,e*.25,i*.2,e*.2),a(i*.43,e*.5,i*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,e*.62,i*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new $t(n);return o.colorSpace=At,o.wrapS=un,o.wrapT=un,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function w1(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<i+20;r+=26){t.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<i;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new $t(e);return s.colorSpace=At,s.wrapS=un,s.wrapT=un,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function T1(i=256,e=160){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d"),s=n.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,e),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<e;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,e-8);const r=new $t(t);return r.colorSpace=At,r}function Eh(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",n=!0){const s=document.createElement("canvas");s.width=n?128:384,s.height=n?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=n?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),n&&r.rotate(-Math.PI/2),r.font=`900 ${n?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(i,0,0),r.restore();const c=new $t(s);return c.colorSpace=At,c}const wi=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],Ra=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],Ti=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Nd(i,e,t="#4ff3ff"){const n=document.createElement("canvas");n.width=640,n.height=256;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new $t(n);return a.colorSpace=At,a.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),a}function Eo(i,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const n=t.getContext("2d");n.fillStyle="#151922",n.fillRect(0,0,384,128),n.fillStyle=e,n.fillRect(0,0,384,12),n.fillRect(0,116,384,12),n.strokeStyle="rgba(255,255,255,0.32)",n.lineWidth=4,n.strokeRect(12,16,360,96),n.shadowColor=e,n.shadowBlur=14,n.fillStyle="#f8fbff",n.font="900 38px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(i,192,64,330);const s=new $t(t);return s.colorSpace=At,s}function Ao(i=512,e=384,t="#9d4d3d",n="#2d86b7"){const s=document.createElement("canvas");s.width=i,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,i,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,i,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let c=18;c<e;c+=22){r.beginPath(),r.moveTo(0,c),r.lineTo(i,c),r.stroke();for(let l=Math.floor(c/22)%2*28;l<i;l+=56)r.beginPath(),r.moveTo(l,c-18),r.lineTo(l,c),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,i-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<i-48;c+=78)r.fillRect(c,e*.62,52,e*.19);r.fillStyle=n,r.fillRect(22,e*.49,i-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=n,r.shadowBlur=12,r.fillText("OPEN",i/2,e*.28,i*.76),r.shadowBlur=0;const o=new $t(s);return o.colorSpace=At,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function E1(i=384,e=384){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.fillStyle="#868f96",n.fillRect(0,0,i,e);for(let r=18;r<e;r+=54)n.fillStyle="rgba(30, 38, 44, 0.62)",n.fillRect(22,r,i-44,24),n.fillStyle="rgba(215, 225, 232, 0.44)",n.fillRect(20,r+26,i-40,6);n.strokeStyle="rgba(255,255,255,0.22)",n.lineWidth=3;for(let r=0;r<i;r+=64)n.beginPath(),n.moveTo(r,0),n.lineTo(r,e),n.stroke();n.fillStyle="#ffffff",n.font="900 96px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("P",i*.5,e*.48);const s=new $t(t);return s.colorSpace=At,s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function A1(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=i/2,s=i/2,r=i*.43;t.clearRect(0,0,i,i),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,l=n+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(l,d):t.lineTo(l,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=i*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",n,s+i*.015);const a=new $t(e);return a.colorSpace=At,a}function We(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function $i(i,e,t,n){const s=t*.5,r=n*.5;let a=We(i,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,We(i+o,e+c));return a}function ka(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=di;if(i<n-c||i>s+c||e<a-c||e>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(l,d)<c*.5+t}const Qi={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Hi(i,e,t,n,s=8){const{x0:r,x1:a,zNear:o,zFar:c,pitch:l,streetW:d}=di,u=t*.5,p=n*.5,m=d*.5+s;let g=null;const M=(x,h,_)=>{(!g||_>g.overlap)&&(g={axis:x,road:h,overlap:_})};for(let x=r;x<=a+1;x+=l){if(e+p<c-m||e-p>o+m)continue;const h=u+m-Math.abs(i-x);h>0&&M("x",Math.round(x),h)}for(let x=o;x>=c-1;x-=l){if(i+u<r-m||i-u>a+m)continue;const h=p+m-Math.abs(e-x);h>0&&M("z",Math.round(x),h)}return g}const Sa=[],Co=[],Od=[];let Ah=0;function Bn(i,e){return Od.push({obj:i,update:e}),i}function Bd(i){Ah+=i;for(const e of Od)e.update(Ah,i)}function zd(){if(Co.length===0)for(let i=0;i<is.length;i++){const e=is[i];for(let t=0;t<e.length;t+=14){const n=rl(e,t);Co.push({x:n.x,y:Fd(e,t),z:n.z,s:t,courseIndex:i})}}return Co}function Pn(i,e,t=0){let n=null,s=1/0;for(const r of zd()){const a=i-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-t-Ud*.58,distance:s,nearestS:n?.s??0}}function Wi(i,e,t,n,s,r=9){const a=t*.5,o=n*.5,c=Ud*.62+r;let l=null;for(const d of zd()){const u=Math.max(Math.abs(d.x-i)-a,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(u,p)-c;if(m>0)continue;const g=d.y-2.8,M=s-g;M<=0||(!l||M-m>l.score)&&(l={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return l}function zn(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(Pn(r.x,r.z,e).clearance>=t)return r}return null}function kn(i,e,t,n,s){const r=Pn(e,t,n);Sa.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function C1(){const i=[...Sa].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Sa.length,unsafe:Sa.filter(e=>e.clearance<e.margin),closest:i}}function gn(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new G(new ht(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(on,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function R1(){const i=new f0(12118271,1911848,.9);et.add(i);const e=new Mo(6994175,1.28);e.position.set(260,145,-260),et.add(e);const t=new Mo(16766880,1.72);t.position.set(-240,270,180),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,et.add(t);const n=new Mo(16758892,.38);n.position.set(-180,35,280),et.add(n);const s=new tl(5556479,70,900,2);s.position.set(0,88,-920),et.add(s)}function P1(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#03569f"),t.addColorStop(.34,"#1689e6"),t.addColorStop(.72,"#86d3ff"),t.addColorStop(1,"#fff1c4"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new $t(i);n.colorSpace=At;const s=new G(new Xt(1550,40,20),new Rt({map:n,side:hn,depthWrite:!1}));s.position.set(0,-70,-700),et.add(s);const r=new Rt({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new G(new fn(58,48),r);a.position.set(-430,300,-650),a.lookAt(Ze.position),et.add(a);const o=new Rt({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new G(new fn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new P(0,0,2)),u.lookAt(Ze.position),et.add(u)}const c=new Rt({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:pt});for(let l=0;l<3;l++){const d=new G(new zt(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),et.add(d)}}function L1(){const i=new q({map:M1(),color:10212492,roughness:.98,metalness:.02}),e=new G(new zt(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let g=0;g<t.count;g++){const M=t.getX(g),x=t.getY(g);t.setZ(g,We(M,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),et.add(e);const n=new q({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:pt});for(let g=0;g<3;g++){const M=150-g*190,x=-760-g*420,h=980,_=64+g*18,v=new G(new zt(980,64+g*18,1,1),n.clone());v.rotation.x=-Math.PI/2,v.rotation.z=-.34+g*.03,v.position.set(M,$i(M,x,h,_)-.55,x),v.renderOrder=-4,et.add(v)}const s=[new q({color:4352578,roughness:1}),new q({color:6910014,roughness:1}),new q({color:3562320,roughness:1})];for(let g=0;g<46;g++){const M=new G(new fn(28+Math.random()*90,9),s[g%s.length]);M.rotation.x=-Math.PI/2,M.rotation.z=Math.random()*Math.PI,M.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),M.scale.y=.32+Math.random()*.5,M.receiveShadow=!0,et.add(M)}const r=new Rt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let g=0;g<32;g++){const M=new G(new fn(70+Math.random()*150,22),r.clone());M.material.opacity=.008+Math.random()*.014,M.rotation.x=-Math.PI/2,M.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),M.position.y<8&&Qi.lowFogDisks++,M.scale.y=.22+Math.random()*.26,M.renderOrder=-6,et.add(M)}const a=[new q({color:5991785,roughness:1}),new q({color:7633254,roughness:1}),new q({color:4874865,roughness:1})],o=new q({color:15068905,roughness:.95});for(let g=0;g<52;g++){const M=78+Math.random()*180,x=52+Math.random()*115,h=zn(v=>{const y=g/52*Math.PI*2+v*1.77,E=1380+Math.random()*820+v*18;return{x:Math.cos(y)*E,z:Math.sin(y)*E-1180}},x,480);if(!h)continue;const _=new G(new ji(x,M,5+Math.floor(Math.random()*2)),a[g%a.length]);if(_.position.set(h.x,-9,h.z),_.rotation.y=Math.random()*Math.PI,_.castShadow=!0,_.receiveShadow=!0,et.add(_),kn("mountain",h.x,h.z,x,480),M>160){const v=new G(new ji(x*.34,M*.22,5),o);v.position.copy(_.position).add(new P(0,M*.39,0)),v.rotation.y=_.rotation.y,et.add(v)}}const c=new q({color:4926748,roughness:.9}),l=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:1589042,roughness:.9})];for(let g=0;g<185;g++){const M=.58+Math.random()*1.05,x=8*M,h=zn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),x,145,40);if(!h)continue;const{x:_,z:v}=h;if(ka(_,v,18))continue;const y=We(_,v)+.8,E=new at,T=2.2+Math.random()*3.8,R=new G(new ht(.28,.42,T,6),c);R.position.y=T/2,E.add(R);const C=2+Math.floor(Math.random()*3);for(let b=0;b<C;b++){const S=new G(new ji(2.2+Math.random()*1.7-b*.22,4.8+Math.random()*2.6,7),l[(g+b)%l.length]);S.position.y=T+b*1.45+1.6,S.rotation.y=Math.random()*Math.PI,E.add(S)}E.position.set(_,y,v),E.scale.setScalar(M),et.add(E),kn("tree",_,v,x,145)}const d=new q({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let g=0;g<38;g++){const M=new at,x=4+Math.floor(Math.random()*5);for(let h=0;h<x;h++){const _=new G(new Xt(12+Math.random()*18,14,8),d);_.position.set(h*18-x*9,Math.random()*8,Math.random()*12),_.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),M.add(_)}M.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),et.add(M)}const u=[new q({color:6186600,roughness:.68,metalness:.2}),new q({color:7829101,roughness:.72,metalness:.18}),new q({color:4544612,roughness:.62,metalness:.24})],p=new q({color:2962232,roughness:.65,metalness:.35});for(let g=0;g<44;g++){const M=new at,x=20+Math.random()*95,h=8+Math.random()*18,_=8+Math.random()*18,v=new G(new Ie(h,x,_),u[g%u.length]);v.position.y=x/2,v.castShadow=!0,v.receiveShadow=!0,M.add(v);const y=As(160,320,.28+Math.random()*.36),E=new q({map:y,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const b of[-1,1]){const S=new G(new zt(h*.82,x*.74),E);S.position.set(0,x*.53,b*(_/2+.08)),S.rotation.y=b<0?Math.PI:0,M.add(S)}const T=new G(new Ie(h*1.08,1.2,_*1.08),p);if(T.position.y=x+.7,M.add(T),Math.random()<.32){const b=new G(new ht(.18,.3,10+Math.random()*12,8),p);b.position.y=x+6.5,M.add(b)}const R=Math.hypot(h,_)*.65,C=zn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),R,240,60);C&&(M.position.set(C.x,$i(C.x,C.z,h,_)-.7,C.z),M.rotation.y=Math.random()*Math.PI,et.add(M),kn("building",C.x,C.z,R,240))}const m=new q({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let g=0;g<18;g++){const M=new at,x=wi[g%wi.length],h=Ra[(g*3+1)%Ra.length],_=Ti[g%Ti.length],v=new q({map:Nd(x,h,_),color:16777215,roughness:.22,metalness:.04,emissive:new tt(_),emissiveIntensity:.28}),y=22+Math.random()*18,E=8+Math.random()*4,T=new G(new Ie(y,E,.5),v);T.position.y=10,M.add(T);const R=new G(new Ie(y+1.2,.32,.75),m);R.position.y=10+E*.5+.25,M.add(R);for(const b of[-7,7]){const S=new G(new ht(.24,.32,10,8),m);S.position.set(b,5,-.2),M.add(S)}const C=zn(()=>({x:-780+Math.random()*1560,z:-450-g*135+Math.random()*80-40}),22,175,50);C&&(M.position.set(C.x,We(C.x,C.z)+.5,C.z),M.rotation.y=-.35+Math.random()*.7,et.add(M),kn("billboard",C.x,C.z,22,175),Xi("roadside-billboard",C.x,M.position.y+10,C.z))}}function D1(){for(let h=0;h<3;h++){const _=[9418953,10995926,12770278][h],v=new Rt({color:_,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),y=60,E=5200,T=new zt(E,360,y,1),R=T.attributes.position;for(let b=0;b<=y;b++){const S=b/y,L=(Math.sin(S*22+h*3)*.5+Math.sin(S*9+h)*.5)*70+120;R.setY(b,L),R.setY(b+y+1,-180)}R.needsUpdate=!0;const C=new G(T,v);C.position.set(0,40,-2300-h*360),et.add(C)}const i=new q({color:5583649,roughness:.9}),e=[new q({color:3837754,roughness:.9}),new q({color:7319100,roughness:.92}),new q({color:13075258,roughness:.9}),new q({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const _=.7+Math.random()*1.2,v=9*_,y=zn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!y)continue;const{x:E,z:T}=y;if(ka(E,T,18))continue;const R=We(E,T)+.6,C=new at,b=2.6+Math.random()*3.4,S=new G(new ht(.34,.5,b,6),i);S.position.y=b/2,C.add(S);const L=e[Math.floor(Math.random()*e.length)],F=3+Math.floor(Math.random()*3);for(let W=0;W<F;W++){const te=2.4+Math.random()*1.8,ne=new G(new Xt(te,9,7),L);ne.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),ne.scale.y=.82+Math.random()*.3,C.add(ne)}C.position.set(E,R,T),C.scale.setScalar(_),et.add(C),kn("tree",E,T,v,150)}const t=[new q({color:7762025,roughness:1,flatShading:!0,side:pt}),new q({color:9077368,roughness:1,flatShading:!0,side:pt}),new q({color:6249043,roughness:1,flatShading:!0,side:pt})];for(let h=0;h<70;h++){const _=2+Math.random()*7,v=zn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),_,70,30);if(!v)continue;const{x:y,z:E}=v,T=new G(new Na(_,0),t[h%t.length]),R=T.geometry.attributes.position;for(let C=0;C<R.count;C++)R.setXYZ(C,R.getX(C)*(.8+Math.random()*.4),R.getY(C)*(.6+Math.random()*.4),R.getZ(C)*(.8+Math.random()*.4));R.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,We(y,E)+_*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,et.add(T),Di.push({kind:"rock",x:y,z:E,radius:_*1.12}),kn("rock",y,E,_,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const _=130+Math.random()*200,v=130+Math.random()*200,y=zn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(_,v)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,R=new at,C=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let S=0;S<C;S++){const L=new q({color:S%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),F=new G(new zt(_,v/C),L);F.rotation.x=-Math.PI/2,F.position.set(0,.05,-v/2+(S+.5)*(v/C)),R.add(F)}R.position.set(E,We(E,T)+.05,T),R.rotation.y=Math.random()*Math.PI,et.add(R),kn("field",E,T,Math.max(_,v)*.5,40)}{const h=zn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const _=new q({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.58,depthWrite:!1,side:pt}),v=new G(new fn(150,40),_);v.rotation.x=-Math.PI/2,v.position.set(h.x,$i(h.x,h.z,450,300)+.08,h.z),v.scale.set(1.5,1,1),v.renderOrder=-4,et.add(v),Di.push({kind:"water",x:h.x,z:h.z,radius:176,maxY:90}),Qi.waterBlockers++,kn("lake",h.x,h.z,170,60),Bn(v,y=>{_.opacity=.52+Math.sin(y*.8)*.035,v.rotation.z=Math.sin(y*.2)*.02})}}const s=new q({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const _=h/9*Math.PI*2+.6,v=1500+Math.random()*700,y=Math.cos(_)*v,E=Math.sin(_)*v-1150,T=60+Math.random()*40,R=new at,C=new G(new ht(1.1,2.2,T,10),s);C.position.y=T/2,R.add(C);const b=new at;b.position.set(0,T,3);const S=new G(new Ie(3,3,7),s);b.add(S);const L=new at;L.position.z=3.5;for(let W=0;W<3;W++){const te=new G(new Ie(1.1,26,.5),s);te.position.y=13;const ne=new at;ne.add(te),ne.rotation.z=W/3*Math.PI*2,L.add(ne)}b.add(L),R.add(b),R.position.set(y,-8,E),R.rotation.y=Math.random()*Math.PI,et.add(R);const F=.5+Math.random()*.5;Bn(L,W=>{L.rotation.z=W*F})}const r=new q({color:7041398,roughness:.6,metalness:.4}),a=new Sc({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const _=-1100+h*360,v=-1650-Math.sin(h*.7)*120,y=48,E=new at,T=6;for(const C of[-1,1])for(const b of[-1,1]){const S=new G(new ht(.4,.7,y,5),r);S.position.set(C*T,y/2,b*T),S.rotation.z=-C*.08,S.rotation.x=b*.08,E.add(S)}for(const C of[y*.6,y*.82,y]){const b=new G(new Ie(T*4,.8,.8),r);b.position.y=C,E.add(b)}E.position.set(_,We(_,v)-2,v),et.add(E);const R=We(_,v)-2+y;if(o)for(const C of[-T*2,0,T*2]){const b=o.x+C,S=o.z,L=_+C,F=v,W=[],te=12;for(let X=0;X<=te;X++){const Q=X/te,ie=Math.sin(Q*Math.PI)*6;W.push(new P(b+(L-b)*Q,o.y-ie+(R-o.y)*Q,S+(F-S)*Q))}const ne=new Gl(new Wt().setFromPoints(W),a);et.add(ne)}o={x:_,y:R,z:v}}const c=new q({color:11680302,roughness:.6,metalness:.3}),l=new q({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const _=zn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!_)continue;const{x:v,z:y}=_,E=70+Math.random()*50,T=new at,R=8;for(let L=0;L<R;L++){const F=new G(new ht(.5,.7,E/R,4),L%2?l:c);F.position.y=(L+.5)*(E/R),F.rotation.y=Math.PI/4,T.add(F)}const C=new q({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new G(new Xt(1.1,10,8),C);b.position.y=E+1,T.add(b),T.position.set(v,We(v,y),y),et.add(T),kn("mast",v,y,8,120);const S=Math.random()*Math.PI*2;Bn(b,L=>{C.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const _=new at,v=d[h%d.length],y=new q({map:V1(v[0],v[1]),roughness:.5,metalness:.05,emissive:new tt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new G(new Xt(11,20,16),y);E.scale.y=1.25,_.add(E);const T=new G(new Ie(3.4,3,3.4),new q({color:8014371,roughness:.9}));T.position.y=-17,_.add(T);const R=new Sc({color:3811866});for(const F of[-1,1])for(const W of[-1,1]){const te=new Gl(new Wt().setFromPoints([new P(F*1.6,-15.5,W*1.6),new P(F*7,-3,W*7)]),R);_.add(te)}const C=-700+Math.random()*1400,b=-700-Math.random()*1200,S=280+Math.random()*100;_.position.set(C,S,b),et.add(_);const L=Math.random()*Math.PI*2;Bn(_,F=>{_.position.y=S+Math.sin(F*.5+L)*6,_.position.x=C+Math.sin(F*.08+L)*90,_.rotation.z=Math.sin(F*.4+L)*.04})}const u=new Rt({color:2829104,side:pt,fog:!1});function p(){const h=new Qc;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new G(new Oa(h),u)}for(let h=0;h<5;h++){const _=new at,v=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<v;L++){const F=p(),W=L%2?1:-1,te=Math.ceil(L/2);F.position.set(W*te*5,-te*2.4,0),F.rotation.x=-Math.PI/2,_.add(F),y.push(F)}const E=150+Math.random()*120,T=-500-Math.random()*1400,R=18+Math.random()*14,C=1400,b=-700+Math.random()*1400;_.position.set(b,E,T),et.add(_);const S=Math.random()*Math.PI*2;Bn(_,(L,F)=>{_.position.x+=R*F,_.position.x>C&&(_.position.x=-C);const W=Math.sin(L*6+S);for(const te of y)te.rotation.x=-Math.PI/2+W*.4})}{const h=new at,_=new q({color:14673644,roughness:.4,metalness:.2}),v=new G(new Xt(20,20,16),_);v.scale.set(2.6,1,1),h.add(v);const y=new q({color:13781835,roughness:.6});for(let b=0;b<3;b++){const S=new G(new Ie(10,9,.6),y);S.position.x=-46,S.rotation.x=b/3*Math.PI*2,h.add(S)}const E=new G(new Ie(10,4,4),new q({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new G(new zt(40,10),new Rt({map:al("STEEL RIBBON"),transparent:!0,side:pt}));T.position.set(60,0,0),h.add(T);const R=900,C=240;h.position.set(0,C,-1200),et.add(h),Bn(h,b=>{const S=b*.05;h.position.x=Math.cos(S)*R,h.position.z=-1200+Math.sin(S)*R*.5,h.position.y=C+Math.sin(b*.3)*8,h.rotation.y=-S+Math.PI/2})}const m=new Rt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const _=new G(new zt(220+Math.random()*360,16+Math.random()*22),m.clone());_.material.opacity=.12+Math.random()*.18,_.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),_.rotation.x=-Math.PI/2.1,_.rotation.z=Math.random()*Math.PI,_.scale.y=.3,et.add(_);const v=2+Math.random()*3;Bn(_,(y,E)=>{_.position.x+=v*E,_.position.x>1400&&(_.position.x=-1400)})}const g=new q({color:13620954,roughness:.6,metalness:.2}),M=new Rt({map:G1(),side:pt});for(let h=0;h<4;h++){const _=zn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!_)continue;const{x:v,z:y}=_,E=new at,T=60+Math.random()*40,R=new G(new Ie(T,1.4,26),g);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const C=new G(new zt(T*.94,24),M);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const b of[-T/2,T/2]){const S=new G(new Ie(1.4,26,1.4),g);S.position.set(b,13,-8),E.add(S)}E.position.set(v,We(v,y),y),E.rotation.y=Math.atan2(-v,-y)+(Math.random()-.5)*.5,et.add(E),kn("grandstand",v,y,40,30)}const x=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const _=zn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!_)continue;const{x:v,z:y}=_,E=new at,T=x[Math.floor(Math.random()*x.length)],R=new Rt({color:T,side:pt}),C=5+Math.floor(Math.random()*6);for(let b=0;b<C;b++){const S=new G(new fn(.5+Math.random()*.4,5),R);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(v,We(v,y),y),et.add(E),kn("flowers",v,y,3,20)}}const Mn=[],Zn=[];let Cc=0;const Di=[],Lr=[],Ri=[],Rc=[],Cr=[],Ps=[],Ye={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},Pa=[];function Xi(i,e,t,n){Ye.signs++,Pa.length<160&&Pa.push({kind:i,x:+e.toFixed(1),y:+t.toFixed(1),z:+n.toFixed(1)})}function bi(i,e,t=1){Ye[i][e]=(Ye[i][e]||0)+t}function I1(i,e){const t=new at,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new q({color:e,roughness:.34,metalness:.28}),a=new q({color:new tt(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new q({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new q({color:395016,roughness:.72,metalness:.02}),l=new q({color:14147041,roughness:.2,metalness:.68}),d=new q({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),u=new q({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),p=new G(new Ie(s.w,s.h,s.l),i==="taxi"?new q({color:16767293,roughness:.36,metalness:.24}):r);p.position.y=.95,t.add(p);const m=new G(new Ie(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),t.add(m),!s.bus){const x=new G(new Ie(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);x.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(x);for(const h of[-1,1]){const _=new G(new Ie(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);_.position.set(h*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(_)}}if(s.bed){const x=new G(new Ie(s.w*.94,.58,s.l*.38),a);x.position.set(0,1.2,1.35),t.add(x)}if(s.box){const x=new G(new Ie(s.box[0],s.box[1],s.box[2]),new q({color:15130833,roughness:.62,metalness:.05}));x.position.set(0,1.55,1.25),t.add(x)}if(s.bus){const x=new G(new Ie(s.w+.06,.28,s.l*.86),a);x.position.set(0,1.38,0),t.add(x);for(let h=-2.8;h<=3.1;h+=1.2)for(const _ of[-1,1]){const v=new G(new Ie(.08,.64,.72),o);v.position.set(_*(s.w*.5+.05),2.08,h),t.add(v)}}if(s.sign){const x=new G(new Ie(1,.24,.46),new q({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));x.position.set(0,2.2,-.35),t.add(x)}const g=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],M=[];for(const x of g)for(const h of[-s.w*.54,s.w*.54]){const _=new G(new ht(.42,.42,.36,14),c);_.rotation.z=Math.PI/2,_.position.set(h,.45,x),t.add(_),M.push(_);const v=new G(new ht(.18,.18,.38,10),l);v.rotation.z=Math.PI/2,v.position.set(h,.45,x),t.add(v)}for(const x of[-s.w*.28,s.w*.28]){const h=new G(new Ie(.42,.2,.08),d);h.position.set(x,.95,-s.l*.52),t.add(h);const _=new G(new Ie(.36,.22,.08),u);_.position.set(x,.98,s.l*.52),t.add(_)}return t.userData={wheels:M,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(x=>{x.castShadow=!0,x.receiveShadow=!0}),t}function U1(i,e){const t=new at,n=new q({color:12947299,roughness:.72}),s=new q({color:i,roughness:.68}),r=new q({color:e,roughness:.76}),a=new q({color:1119001,roughness:.82}),o=new G(new ht(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const c=new G(new Xt(.24,10,8),n);c.position.y=2.02,t.add(c);const l=new G(new Xt(.25,8,5),a);l.scale.y=.5,l.position.y=2.17,t.add(l);const d=[];for(const u of[-.16,.16]){const p=new G(new ht(.075,.09,.78,6),r);p.position.set(u,.58,0),t.add(p),d.push({mesh:p,side:Math.sign(u),baseY:.58,amp:.28})}for(const u of[-.38,.38]){const p=new G(new ht(.055,.065,.72,6),n);p.position.set(u,1.33,0),p.rotation.z=u<0?-.18:.18,t.add(p),d.push({mesh:p,side:-Math.sign(u),baseY:1.33,amp:.34})}return t.userData.limbs=d,t.traverse(u=>{u.castShadow=!0,u.receiveShadow=!0}),t}function F1(i,e,t){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:l=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,g=[],M=[];for(let I=n;I<=s+1;I+=o)g.push(Math.round(I));for(let I=r;I>=a-1;I-=o)M.push(Math.round(I));M.sort((I,ye)=>I-ye);const x=g[0],h=g[g.length-1],_=M[0],v=M[M.length-1];Ri.length=0,Rc.length=0,Cr.length=0,Ps.length=0,Ye.traffic=0,Ye.pedestrians=0,Ye.types={},Ye.turns=0,Ye.splats=0,Ye.trafficCrashes=0,Ye.streetLights=0,Ye.trafficLights=0,Ye.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,T=(I,ye)=>{let Me=0,Se=1/0;for(let Z=0;Z<I.length;Z++){const K=Math.abs(I[Z]-ye);K<Se&&(Se=K,Me=Z)}return Me},R=(I,ye,Me)=>{const Se=I==="ns"?M:g;if(Me>0){for(const Z of Se)if(Z>ye+.05)return Z;return Se[Se.length-1]}for(let Z=Se.length-1;Z>=0;Z--)if(Se[Z]<ye-.05)return Se[Z];return Se[0]},C=I=>{const ye=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+ye,z:I.along}:{x:I.along,z:I.road+ye}},b=I=>{if(f.mode!=="roam")return null;const ye=C(I);if(Math.abs(f.roamPos.y-(We(ye.x,ye.z)+ei))>4.2)return null;const Me=I.axis==="ns"?0:I.dir,Se=I.axis==="ns"?I.dir:0,Z=f.roamPos.x-ye.x,K=f.roamPos.z-ye.z,_e=Z*Me+K*Se,be=I.axis==="ns"?Z:K,Le=Math.abs(be),Xe=Math.hypot(Z,K),Lt=I.mesh?.userData?.colliderHalfW||2,qe=I.mesh?.userData?.colliderHalfD||3;return Xe<Wn+Math.max(Lt,qe)*.55||_e>-1.5&&_e<qe+4.2&&Le<Wn+Lt*.85?{crash:!0}:_e>0&&_e<30&&Le<c*.36?{avoidOffset:(be>=0?-1:1)*I.maxAvoidOffset,stop:_e<13&&Le<Wn+Lt*.95}:null},S=(I,ye)=>`${Math.round(I)},${Math.round(ye)}`,L=(I,ye)=>{const Se=((ye+I.phase)%15.5+15.5)%15.5;return Se<6.2?"ns":Se<7.4?"yellow-ns":Se<13.6?"ew":"yellow-ew"},F=(I,ye)=>{const Me=I.axis==="ns"?I.road:I.next,Se=I.axis==="ns"?I.next:I.road,Z=S(Me,Se),K=l.get(Z);if(!K)return null;if(K.type==="signal"){const _e=L(K,ye),be=_e===`yellow-${I.axis}`;return _e===I.axis&&!be?null:{control:K,key:Z,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==Z?{control:K,key:Z,kind:"stop"}:null},W=(I,ye=!1)=>{const Me=I.axis,Se=I.along,Z=Me==="ns"?g:M,K=I.road,_e=T(Z,K),be=[],Le=Me==="ns"?_:x,Xe=Me==="ns"?v:h;!ye&&Se+I.dir*o>=Le&&Se+I.dir*o<=Xe&&be.push({axis:Me,road:I.road,along:Se,dir:I.dir,turn:!1}),_e>0&&be.push({axis:Me==="ns"?"ew":"ns",road:Se,along:K,dir:-1,turn:!0}),_e<Z.length-1&&be.push({axis:Me==="ns"?"ew":"ns",road:Se,along:K,dir:1,turn:!0}),be.length||be.push({axis:Me,road:I.road,along:Se,dir:-I.dir,turn:!0});const Lt=be.filter(wt=>wt.turn),qe=!ye&&Lt.length&&Math.random()<.42?y(Lt):y(be);(qe.turn||qe.axis!==Me)&&Ye.turns++,I.axis=qe.axis,I.road=qe.road,I.along=qe.along,I.dir=qe.dir,I.laneOffset=E(I.dir),I.next=R(I.axis,I.along,I.dir),I.turnBlend=qe.turn?1:0,I.lastControlKey=null};for(let I=0;I<m;I++){const ye=Math.random()<.56?"ns":"ew",Me=u[I%u.length],Se=Math.random()<.5?-1:1,Z=(Me==="bus"||Me==="boxTruck"?10:13)+Math.random()*9,K={axis:ye,dir:Se,road:y(ye==="ns"?g:M),laneOffset:E(Se),along:y(ye==="ns"?M:g),speed:Z,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:I1(Me,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=R(K.axis,K.along,K.dir),Ri.push(K.collider),p.push(K),Rc.push(K),i.add(K.mesh),Ye.types[Me]=(Ye.types[Me]||0)+1}function te(I,ye=0,Me=0){let Se=Math.max(0,I.speed*Me);const Z=b(I);for(Z?.crash?($d(I,f.roamPos),Se=0):Z?(I.avoidOffset+=(Z.avoidOffset-I.avoidOffset)*Math.min(1,Me*4.5),I.brakePulse=Math.max(I.brakePulse||0,Z.stop?1:.35),Z.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Se=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,Me*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-Me),Se=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-Me),Se=0);Se>0;){const B=F(I,ye);if(B){const lt=I.next-I.dir*(B.kind==="signal"?12:8),Ct=(lt-I.along)*I.dir;if(Ct>=-.35&&Ct<=Se+.25){I.along=lt,I.brakePulse=1,Se=0,B.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=B.key);break}}const dt=Math.abs(I.next-I.along);if(Se<dt)I.along+=I.dir*Se,Se=0;else{I.along=I.next,Se-=dt;const lt=I.next<=(I.axis==="ns"?_:x)+.05||I.next>=(I.axis==="ns"?v:h)-.05;W(I,lt)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-Me*3.2),I.turnBlend=Math.max(0,I.turnBlend-Me*3.2);const{x:K,z:_e}=C(I),be=I.axis==="ns"?0:I.dir,Le=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,We(K,_e)+.28+Math.sin(ye*3.2+I.bob)*.035,_e);const Xe=Math.atan2(-be,-Le),Lt=Math.atan2(Math.sin(Xe-I.mesh.rotation.y),Math.cos(Xe-I.mesh.rotation.y));I.mesh.rotation.y+=Lt*Math.min(1,Me*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(ye*22+I.bob)*.02);for(const B of I.mesh.userData.wheels||[])B.rotation.x-=I.dir*I.speed*Me*1.7;const qe=I.mesh.userData.colliderHalfD,wt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=_e,I.collider.hw=I.axis==="ns"?wt:qe,I.collider.hd=I.axis==="ns"?qe:wt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of p)te(I,0,0);Ye.traffic=p.length,Bn(i,(I,ye)=>{for(const Me of p)te(Me,I,ye)});const ne=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],X=[2437188,3092787,4930093,2244434],Q=[],ie=45;for(let I=0;I<ie;I++){const ye=Math.random()<.56?"ns":"ew",Me=e[Math.random()*e.length|0],Se=Math.abs(Me.z1-Me.z0)>Math.abs(Me.x1-Me.x0),Z=ye==="ns"?Se?"ns":"ew":Se?"ew":"ns",K=Math.random()<.5?-1:1,_e=Math.random()<.5?-1:1,be={axis:Z,dir:K,sideSign:_e,coord:y(Z==="ns"?g:M),along:Z==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:U1(ne[I%ne.length],X[I*2%X.length])};I<14&&(be.axis="ns",be.coord=80,be.sideSign=I%2?-1:1,be.dir=I%3===0?1:-1,be.along=350-I*24,be.speed=1.5+I%4*.35),Q.push(be),Cr.push(be),i.add(be.mesh)}const de=new Rt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:pt}),pe=new Rt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:pt});for(let I=0;I<18;I++){const ye=new at,Me=new G(new fn(1,12),de.clone());Me.rotation.x=-Math.PI/2,ye.add(Me);for(let Se=0;Se<7;Se++){const Z=new G(new fn(.25+Math.random()*.25,8),pe.clone());Z.rotation.x=-Math.PI/2,Z.position.set(Math.cos(Se)*(.6+Math.random()*1.2),.01,Math.sin(Se*1.7)*(.5+Math.random()*1.1)),ye.add(Z)}ye.visible=!1,ye.userData.life=0,ye.userData.maxLife=2.8,ye.position.y=-99,i.add(ye),Ps.push(ye)}function ze(I,ye=0,Me=0){if(!I.active)if(I.respawn-=Me,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*Me,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<n-28&&(I.along=s+28),I.along>s+28&&(I.along=n-28));const Se=I.sideSign*(c*.66+1.2),Z=I.axis==="ns"?I.coord+Se:I.along,K=I.axis==="ns"?I.along:I.coord+Se,_e=I.axis==="ns"?0:I.dir,be=I.axis==="ns"?I.dir:0;I.x=Z,I.z=K,I.mesh.position.set(Z,We(Z,K)+.08,K),I.mesh.rotation.y=Math.atan2(-_e,-be);const Le=Math.sin(ye*7+I.phase);for(const Xe of I.mesh.userData.limbs||[])Xe.mesh.rotation.x=Le*Xe.amp*Xe.side,Xe.mesh.position.y=Xe.baseY+Math.abs(Le)*.025}for(const I of Q)ze(I,0,0);Ye.pedestrians=Q.length,Bn(i,(I,ye)=>{for(const Me of Q)ze(Me,I,ye);for(const Me of Ps){if(!Me.visible)continue;Me.userData.life-=ye;const Se=Me.userData.life,Z=Oe.clamp(Se/Me.userData.maxLife,0,1);Me.scale.setScalar(1+(1-Z)*.35),Me.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,Z*1.2))}),Se<=0&&(Me.visible=!1)}})}function N1(){const i=new at,e=new Ht;new xi().setFromAxisAngle(new P(1,0,0),-Math.PI/2),Ye.roadDetails={},Ye.buildingArchetypes={},Ye.zones={},Ye.openerProps=0;const t=di.x0,n=di.x1,s=di.zNear,r=di.zFar,a=di.pitch,o=di.streetW,c=a-o,l=[],d=[];for(let N=t;N<=n+1;N+=a)l.push(Math.round(N));for(let N=s;N>=r-1;N-=a)d.push(Math.round(N));const u=[];for(const N of l)u.push({x0:N,z0:s,x1:N,z1:r});for(const N of d)u.push({x0:t,z0:N,x1:n,z1:N});function p(N,O){const Y=N.x1-N.x0,j=N.z1-N.z0,ee=Math.hypot(Y,j)||1,oe=-j/ee,re=Y/ee;return{x0:N.x0+oe*O,z0:N.z0+re*O,x1:N.x1+oe*O,z1:N.z1+re*O}}function m(N,O,Y){const j=[],ee=[];for(const re of N){const w=re.x1-re.x0,U=re.z1-re.z0,V=Math.hypot(w,U),H=Math.max(1,Math.round(V/14)),z=w/V,$=-(U/V),me=z;let ue=null,Ce=null;for(let Pe=0;Pe<=H;Pe++){const xe=Pe/H,Ke=xe*V/68,rt=re.x0+w*xe,vt=re.z0+U*xe,Mt=rt+$*O,ut=vt+me*O,ke=rt-$*O,St=vt-me*O,mt=[Mt,We(Mt,ut)+Y,ut,Ke],kt=[ke,We(ke,St)+Y,St,Ke];ue&&(j.push(ue[0],ue[1],ue[2],Ce[0],Ce[1],Ce[2],kt[0],kt[1],kt[2]),j.push(ue[0],ue[1],ue[2],kt[0],kt[1],kt[2],mt[0],mt[1],mt[2]),ee.push(0,ue[3],1,Ce[3],1,kt[3]),ee.push(0,ue[3],1,kt[3],0,mt[3])),ue=mt,Ce=kt}}const oe=new Wt;return oe.setAttribute("position",new bt(j,3)),oe.setAttribute("uv",new bt(ee,2)),oe.computeVertexNormals(),oe}const g=new q({map:S1(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:pt}),M=new q({color:11054244,roughness:.62,metalness:.04}),x=new q({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),h=new q({color:15855586,roughness:.48,metalness:.02,emissive:3158064,emissiveIntensity:.1}),_=new q({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new q({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const N of u)y.push(p(N,o*.5+3.3),p(N,-13.3)),E.push(p(N,o*.5+.42),p(N,-10.42));const T=new G(m(y,2.9,.66),M);T.receiveShadow=!0,i.add(T);const R=new G(m(E,.28,.78),x);R.receiveShadow=!0,i.add(R),bi("roadDetails","sidewalkRuns",y.length),bi("roadDetails","curbRuns",E.length);const C=new G(m(u,o/2,.55),g);C.receiveShadow=!0,i.add(C);const b=new q({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:pt});i.add(new G(m(u,.4,.62),b));let S=0,L=0,F=0;for(let N=1;N<l.length-1;N++)for(let O=1;O<d.length-1;O++){const Y=l[N],j=d[O];if(!(Pn(Y,j,o*.75).clearance<2))for(const ee of[-1,1]){const oe=new G(new Ie(o*.92,.07,1.15),h);oe.position.set(Y,We(Y,j+ee*13)+.83,j+ee*13),oe.receiveShadow=!0,i.add(oe);const re=new G(new Ie(1.15,.07,o*.92),h);re.position.set(Y+ee*13,We(Y+ee*13,j)+.83,j),re.receiveShadow=!0,i.add(re),S+=2}}const W=new Qc;W.moveTo(0,5.8),W.lineTo(2.5,1.6),W.lineTo(.72,1.6),W.lineTo(.72,-5.2),W.lineTo(-.72,-5.2),W.lineTo(-.72,1.6),W.lineTo(-2.5,1.6),W.closePath();const te=new Oa(W);te.rotateX(-Math.PI/2);for(const N of u){const O=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),j=Math.max(2,Math.floor(Y/280));for(let ee=0;ee<j;ee++){const oe=(ee+.5)/j,re=N.x0+(N.x1-N.x0)*oe,w=N.z0+(N.z1-N.z0)*oe;if(Pn(re,w,4).clearance<2)continue;const U=new G(te,_);if(U.position.set(re,We(re,w)+.86,w),U.rotation.y=O?0:Math.PI/2,U.scale.setScalar(.9),i.add(U),L++,ee%2===0){const V=new G(new ht(1.05,1.05,.08,24),v);V.position.set(re+(O?3.8:0),We(re,w)+.84,w+(O?0:3.8)),i.add(V),F++}}}bi("roadDetails","crosswalks",S),bi("roadDetails","laneArrows",L),bi("roadDetails","manholes",F);const ne=new Rt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:pt,blending:Ai}),X=new Rt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:pt,blending:Ai});for(let N=0;N<120;N++){const O=u[Math.random()*u.length|0],Y=Math.random(),j=O.x0+(O.x1-O.x0)*Y,ee=O.z0+(O.z1-O.z0)*Y;if(Pn(j,ee,4).clearance<2)continue;const oe=new G(new fn(1,18),(N%4===0?X:ne).clone());oe.rotation.x=-Math.PI/2,oe.rotation.z=Math.atan2(O.x1-O.x0,O.z1-O.z0)+(Math.random()-.5)*.35,oe.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),oe.position.set(j+(Math.random()-.5)*o*.7,We(j,ee)+.66,ee+(Math.random()-.5)*o*.7),i.add(oe)}const Q=[As(160,320,.5),As(160,320,.62),As(160,320,.42)],ie=[new q({map:Q[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new q({map:Q[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new q({map:Q[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],de=new Ie(1,1,1),pe=[[],[],[]],ze=[],I=[],ye=[],Me=[],Se=[],Z=[],K=[],_e=[],be=[],Le=[],Xe=[],Lt=[],qe=[],wt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=b1(256,256,"#dbcdb8"),dt=w1(),lt=T1(),Ct=[Ao(512,384,"#944737","#2e95bf"),Ao(512,384,"#7e4d3e","#d04d65"),Ao(512,384,"#a65a35","#4fba6d")],Ge=E1();function Dt(N,O){bi("zones",N),bi("buildingArchetypes",O)}function $e(N,O,Y,j,ee,oe="downtown"){if(Hi(N,O,Y,j))return!1;const re=$i(N,O,Y,j)-1.1;if(Wi(N,O,Y,j,re+ee+2))return!1;if(e.position.set(N,re+ee/2,O),e.quaternion.identity(),e.scale.set(Y,ee,j),e.updateMatrix(),pe[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,re+ee+.6,O),e.scale.set(Y*1.04,1.2,j*1.04),e.updateMatrix(),ze.push(e.matrix.clone()),ee>26){const w=Math.random()<.72?3790847:16730294;for(const U of[-1,1])e.position.set(N,re+ee+1.35,O+U*(j*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),ye.push(w);Math.random()<.34&&Me.push({px:N,pz:O,w:Y,d:j,h:ee,gy:re,zSide:Math.random()<.5?-1:1})}if(ee>14&&Math.random()<.48){const w=Math.random()<.5?"x":"z";Se.push({px:N,pz:O,w:Y,d:j,h:ee,gy:re,axis:w,side:Math.random()<.5?-1:1})}if(ee>28&&Math.random()<.18){const w=Math.random()<.5?"x":"z";Z.push({px:N,pz:O,w:Y,d:j,h:ee,gy:re,axis:w,side:Math.random()<.5?-1:1})}return Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:re+ee+2}),Dt(oe,ee>64?"glassTower":"midrise"),!0}function ot(N,O,Y,j,ee,oe="residential"){if(Hi(N,O,Y,j))return!1;const re=$i(N,O,Y,j)-.55,w=2+Math.random()*2.4;if(Wi(N,O,Y,j,re+ee+w+1.5,6))return!1;e.position.set(N,re+ee/2,O),e.quaternion.identity(),e.scale.set(Y,ee,j),e.updateMatrix(),K.push(e.matrix.clone()),Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:re+ee+w+1.5}),_e.push(wt[Math.random()*wt.length|0]),e.position.set(N,re+ee+w/2,O),e.scale.set(Y*.82,w,j*.82),e.updateMatrix(),be.push(e.matrix.clone());const U=t+Math.round((N-t)/a)*a,V=s-Math.round((s-O)/a)*a,H=Math.abs(N-U)<Math.abs(O-V),z=H?U>N?1:-1:V>O?1:-1,se=Math.min(H?j*.46:Y*.46,8.5),$=Math.min(ee*.58,4.6),me=Math.min(24,Math.max(8,H?Math.abs(U-N)-Y*.5-o*.35:Math.abs(V-O)-j*.5-o*.35));e.quaternion.identity(),H?(e.position.set(N+z*(Y*.5+.1),re+$*.5+.1,O-j*.16),e.scale.set(.24,$,se),e.updateMatrix(),Le.push(e.matrix.clone()),e.position.set(N+z*(Y*.5+me*.5),We(N+z*(Y*.5+me*.5),O)+.08,O-j*.16),e.scale.set(me,.08,se*1.18)):(e.position.set(N-Y*.16,re+$*.5+.1,O+z*(j*.5+.1)),e.scale.set(se,$,.24),e.updateMatrix(),Le.push(e.matrix.clone()),e.position.set(N-Y*.16,We(N,O+z*(j*.5+me*.5))+.08,O+z*(j*.5+me*.5)),e.scale.set(se*1.18,.08,me)),e.updateMatrix(),Xe.push(e.matrix.clone()),e.position.set(N,re+.02,O),e.scale.set(Y*1.58,.05,j*1.58),e.updateMatrix(),Lt.push(e.matrix.clone());for(let ue=0;ue<3;ue++){const Ce=H?N+z*(Y*.55):N+(ue-1)*Y*.25,Pe=H?O+(ue-1)*j*.28:O+z*(j*.55);e.position.set(Ce,We(Ce,Pe)+.55,Pe);const xe=.85+Math.random()*.75;e.scale.set(xe*1.35,xe,xe*1.35),e.updateMatrix(),qe.push(e.matrix.clone())}return Dt(oe,"residentialHouse"),!0}function D(N,O,Y,j,ee,oe="commercial"){if(Hi(N,O,Y,j))return!1;const re=$i(N,O,Y,j)-.8;if(Wi(N,O,Y,j,re+ee+2,7))return!1;const w=new q({map:Ge,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),U=new G(new Ie(Y,ee,j),w);U.position.set(N,re+ee/2,O),U.castShadow=!0,U.receiveShadow=!0,i.add(U);const V=new q({color:7502722,roughness:.52,metalness:.15}),H=new G(new Ie(Y*.72,.32,j*.18),V);H.position.set(N,re+ee*.38,O+j*.18),H.rotation.z=.13,i.add(H);const z=new q({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let se=5;se<ee;se+=9){const $=new G(new Ie(Y*1.02,.24,.22),z);$.position.set(N,re+se,O+j*.5+.14),i.add($)}return Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:re+ee+2}),Dt(oe,"parkingGarage"),!0}function A(N,O,Y,j,ee,oe="commercial"){if(Hi(N,O,Y,j))return!1;const re=$i(N,O,Y,j)-.65;if(Wi(N,O,Y,j,re+ee+2,7))return!1;const w=new q({map:Ct[Math.random()*Ct.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),U=new G(new Ie(Y,ee,j),w);U.position.set(N,re+ee/2,O),U.castShadow=!0,U.receiveShadow=!0,i.add(U);const V=new G(new Ie(Y*1.06,.9,j*1.06),new q({color:2237478,roughness:.56,metalness:.18}));V.position.set(N,re+ee+.45,O),i.add(V);const H=t+Math.round((N-t)/a)*a,z=s-Math.round((s-O)/a)*a,se=Math.abs(N-H)<Math.abs(O-z),$=se?H>N?1:-1:z>O?1:-1,me=Ti[(N+O|0)%Ti.length]||"#ffd45b",ue=new Rt({map:Eo(wi[(Math.abs(N)+Math.abs(O)|0)%wi.length],me),transparent:!0,side:pt,depthWrite:!1}),Ce=new G(new zt(Math.min(16,se?j*.82:Y*.82),4.2),ue);return se?(Ce.position.set(N+$*(Y*.5+.2),re+ee*.66,O),Ce.rotation.y=$>0?Math.PI/2:-Math.PI/2):(Ce.position.set(N,re+ee*.66,O+$*(j*.5+.2)),Ce.rotation.y=$<0?Math.PI:0),i.add(Ce),Xi("storefront-sign",Ce.position.x,Ce.position.y,Ce.position.z),Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:re+ee+2}),Dt(oe,"brickStorefront"),!0}for(let N=t+a/2;N<=n-a/2;N+=a)for(let O=s-a/2;O>=r+a/2;O-=a){const Y=Pn(N,O,c*.5).clearance;if(Y<2)continue;const j=O>40&&O<380&&N>-360&&N<360,ee=j?"showcase":O<-920?"industrial":Y>230||O<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||j){const re=c/3;for(let w=0;w<3;w++)for(let U=0;U<3;U++){if(Math.random()<.14)continue;const V=N-c/2+re*(w+.5)+(Math.random()-.5)*re*.3,H=O-c/2+re*(U+.5)+(Math.random()-.5)*re*.3;if(Pn(V,H,8).clearance<1)continue;const z=re*(.5+Math.random()*.22),se=re*(.5+Math.random()*.22);!j&&Math.random()<.16?$e(V,H,z*.9,se*.9,12+Math.random()*12,ee):ot(V,H,z,se,5+Math.random()*4.5,ee)}}else{const oe=Y>230,re=oe?Oe.clamp(50+Y*1.1,60,175):Oe.clamp(22+Y*.3,22,62),w=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let U=0;U<w;U++){const V=13+Math.random()*Math.min(26,c*.44),H=13+Math.random()*Math.min(26,c*.44),z=N+(Math.random()-.5)*(c-V),se=O+(Math.random()-.5)*(c-H);if(Pn(z,se,Math.hypot(V,H)*.5).clearance<2)continue;const $=(18+Math.random()*(re-18))*(oe&&Math.random()<.2?1.35:1);!oe&&(Math.random()<.38&&A(z,se,Math.max(18,V*1.12),Math.max(18,H*1.08),12+Math.random()*14,ee)||Math.random()<.18&&D(z,se,Math.max(24,V*1.35),Math.max(24,H*1.28),24+Math.random()*24,ee))||$e(z,se,V,H,$,ee)}}}for(let N=0;N<3;N++){if(!pe[N].length)continue;const O=new an(de,ie[N],pe[N].length);for(let Y=0;Y<pe[N].length;Y++)O.setMatrixAt(Y,pe[N][Y]);O.instanceMatrix.needsUpdate=!0,O.castShadow=!0,O.receiveShadow=!0,i.add(O)}if(ze.length){const N=new q({color:2896696,roughness:.62,metalness:.34}),O=new an(de,N,ze.length);for(let Y=0;Y<ze.length;Y++)O.setMatrixAt(Y,ze[Y]);O.instanceMatrix.needsUpdate=!0,i.add(O)}if(I.length){const N=new q({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),O=new an(de,N,I.length);for(let Y=0;Y<I.length;Y++)O.setMatrixAt(Y,I[Y]),O.setColorAt(Y,new tt(ye[Y]));O.instanceMatrix.needsUpdate=!0,O.instanceColor&&(O.instanceColor.needsUpdate=!0),i.add(O)}if(K.length){const N=new q({color:4891451,roughness:.88,metalness:.02}),O=new an(de,N,Lt.length);for(let $=0;$<Lt.length;$++)O.setMatrixAt($,Lt[$]);O.instanceMatrix.needsUpdate=!0,O.receiveShadow=!0,i.add(O);const Y=new q({color:12040883,roughness:.48,metalness:.05}),j=new an(de,Y,Xe.length);for(let $=0;$<Xe.length;$++)j.setMatrixAt($,Xe[$]);j.instanceMatrix.needsUpdate=!0,j.receiveShadow=!0,i.add(j);const ee=new q({map:B,roughness:.78,metalness:.03}),oe=new an(de,ee,K.length);for(let $=0;$<K.length;$++)oe.setMatrixAt($,K[$]),oe.setColorAt($,new tt(_e[$]));oe.instanceMatrix.needsUpdate=!0,oe.instanceColor&&(oe.instanceColor.needsUpdate=!0),oe.castShadow=!0,oe.receiveShadow=!0,i.add(oe);const re=new ji(.72,1,4);re.rotateY(Math.PI/4);const w=new q({map:dt,color:14314033,roughness:.72}),U=new an(re,w,be.length);for(let $=0;$<be.length;$++)U.setMatrixAt($,be[$]);U.instanceMatrix.needsUpdate=!0,U.castShadow=!0,i.add(U);const V=new q({map:lt,roughness:.38,metalness:.18}),H=new an(de,V,Le.length);for(let $=0;$<Le.length;$++)H.setMatrixAt($,Le[$]);H.instanceMatrix.needsUpdate=!0,i.add(H);const z=new q({color:3112239,roughness:.88,metalness:.02}),se=new an(new Xt(1,8,6),z,qe.length);for(let $=0;$<qe.length;$++)se.setMatrixAt($,qe[$]);se.instanceMatrix.needsUpdate=!0,se.castShadow=!0,se.receiveShadow=!0,i.add(se)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(Me.length,34);N++){const O=Me[N],Y=J[N%J.length],j=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ee=new Rt({map:Eh(Y,j),transparent:!0,side:pt,depthWrite:!1}),oe=new G(new zt(8,24),ee);oe.position.set(O.px,O.gy+Math.max(14,O.h*.58),O.pz+O.zSide*(O.d*.5+.25)),oe.rotation.y=O.zSide<0?Math.PI:0,i.add(oe),Xi("vertical-neon",oe.position.x,oe.position.y,oe.position.z)}for(let N=0;N<Math.min(Se.length,48);N++){const O=Se[N],Y=wi[(N*5+2)%wi.length],j=Ti[(N*2+1)%Ti.length],ee=new Rt({map:Eo(Y,j),transparent:!0,side:pt,depthWrite:!1}),oe=Math.min(17,(O.axis==="x"?O.d:O.w)*.82),re=new G(new zt(oe,4.7),ee),w=O.gy+Math.max(6.2,Math.min(O.h-3.5,O.h*(.28+N%3*.12)));O.axis==="x"?(re.position.set(O.px+O.side*(O.w*.5+.22),w,O.pz),re.rotation.y=O.side>0?Math.PI/2:-Math.PI/2):(re.position.set(O.px,w,O.pz+O.side*(O.d*.5+.22)),re.rotation.y=O.side<0?Math.PI:0),i.add(re),Xi("wall-sign",re.position.x,re.position.y,re.position.z)}for(let N=0;N<Math.min(Z.length,18);N++){const O=Z[N],Y=wi[(N*7+4)%wi.length],j=Ra[(N*5+3)%Ra.length],ee=Ti[(N+3)%Ti.length],oe=new at,re=new q({map:Nd(Y,j,ee),color:16777215,roughness:.2,metalness:.06,emissive:new tt(ee),emissiveIntensity:.34}),w=Math.min(18,(O.axis==="x"?O.d:O.w)*.86),U=new G(new Ie(w,5.2,.42),re);U.position.y=4.8,oe.add(U);const V=new q({color:1053978,roughness:.44,metalness:.28});for(const H of[-w*.34,w*.34]){const z=new G(new ht(.13,.17,5,8),V);z.position.set(H,2.25,-.2),oe.add(z)}oe.position.set(O.px,O.gy+O.h+.7,O.pz),oe.rotation.y=O.axis==="x"?O.side>0?Math.PI/2:-Math.PI/2:O.side<0?Math.PI:0,i.add(oe),Xi("roof-billboard",oe.position.x,oe.position.y+4.8,oe.position.z)}const le=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],fe=new Ie(2.2,1.4,4.6),ae=130,Ve=new an(fe,new q({roughness:.42,metalness:.36}),ae);let Re=0,Je=0;for(;Re<ae&&Je<ae*6;){Je++;const N=Math.random()<.5,O=N?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),Y=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Pn(O,Y,4).clearance<2)continue;const j=We(O,Y)+.7;e.position.set(O,j,Y),e.quaternion.setFromAxisAngle(on,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ve.setMatrixAt(Re,e.matrix),Ve.setColorAt(Re,new tt(le[Math.random()*le.length|0])),Re++}Ve.count=Re,Ve.instanceMatrix.needsUpdate=!0,Ve.instanceColor&&(Ve.instanceColor.needsUpdate=!0),i.add(Ve);const He=new Map,ge=(N,O)=>`${Math.round(N)},${Math.round(O)}`;function we(N,O){const j=((O+N.phase)%15.5+15.5)%15.5;return j<6.2?{green:"ns",yellow:null}:j<7.4?{green:null,yellow:"ns"}:j<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function nt(){const N=[],O=new q({color:1120028,roughness:.38,metalness:.62}),Y=new q({color:1382685,roughness:.34,metalness:.38}),j=A1(),ee=new Rt({map:j,transparent:!0,side:pt}),oe=new q({color:5050642,roughness:.48,metalness:.12}),re=(se,$)=>new q({color:se,roughness:.16,metalness:.02,emissive:$,emissiveIntensity:.2}),w=(se,$,me,ue,Ce,Pe)=>{const xe=new at,Ke=new G(new Ie(1.15,2.85,.75),Y);xe.add(Ke);const rt=re(16724008,16717836),vt=re(16767053,16757276),Mt=re(4521842,1693789),ut=[rt,vt,Mt];for(let ke=0;ke<3;ke++){const St=new G(new Xt(.28,12,8),ut[ke]);St.position.set(0,.78-ke*.78,-.42),xe.add(St)}xe.position.set(me,ue,Ce),xe.rotation.y=Pe,se.add(xe),N.push({axis:$,red:rt,yellow:vt,green:Mt,control:se.userData.control})},U=(se,$,me)=>{const ue=ge(se,$),Ce={type:"signal",x:se,z:$,phase:me%4*2.1};He.set(ue,Ce);const Pe=We(se,$),xe=new at;xe.userData.control=Ce;const Ke=o*.72,rt=o*.72,vt=new G(new ht(.18,.24,8.2,8),O);vt.position.set(Ke,4.1,rt),xe.add(vt);const Mt=new G(new Ie(o*1.65,.2,.2),O);Mt.position.set(Ke-o*.72,8,rt),xe.add(Mt);const ut=new G(new Ie(.2,.2,o*1.65),O);ut.position.set(Ke,7.55,rt-o*.72),xe.add(ut),w(xe,"ns",Ke-o*1.24,7.52,rt,0),w(xe,"ns",Ke-o*.18,7.52,-rt,Math.PI),w(xe,"ew",Ke,7.05,rt-o*1.24,Math.PI/2),w(xe,"ew",-Ke,7.05,rt-o*.18,-Math.PI/2),xe.position.set(se,Pe,$),xe.traverse(ke=>{ke.castShadow=!0,ke.receiveShadow=!0}),i.add(xe)},V=(se,$,me)=>{const ue=ge(se,$);He.set(ue,{type:"stop",x:se,z:$,phase:0});const Ce=We(se,$),Pe=new at,xe=me%2?-1:1,Ke=me%3?1:-1,rt=new G(new ht(.12,.16,4.2,7),O);rt.position.y=2.1,Pe.add(rt);const vt=new G(new fn(1.04,8),oe);vt.position.y=4.55,vt.rotation.y=Math.PI,Pe.add(vt);const Mt=new G(new zt(2.05,2.05),ee);Mt.position.set(0,4.55,-.04),Pe.add(Mt),Pe.position.set(se+xe*o*.74,Ce,$+Ke*o*.74),Pe.rotation.y=Math.atan2(xe,Ke),Pe.traverse(ut=>{ut.castShadow=!0,ut.receiveShadow=!0}),i.add(Pe)};let H=0,z=0;for(let se=1;se<l.length-1;se++)for(let $=1;$<d.length-1;$++){const me=l[se],ue=d[$];if(Pn(me,ue,o*.9).clearance<2)continue;const Ce=Math.abs(me-80)<=a*1.05&&ue<=s&&ue>=-560,Pe=ue<-260&&ue>-1180&&(se+$)%4===0,xe=ue>-360&&(se+$)%2===0;Ce&&$%2===0||Pe?U(me,ue,H++):(xe||(se+$)%5===0&&ue>-820)&&V(me,ue,z++)}return Bn(i,se=>{for(const $ of N){const me=we($.control,se);$.red.emissiveIntensity=me.green===$.axis||me.yellow===$.axis?.12:2.3,$.yellow.emissiveIntensity=me.yellow===$.axis?2.6:.12,$.green.emissiveIntensity=me.green===$.axis?2.6:.1}}),{trafficLights:H,stopSigns:z}}const je=nt();F1(i,u,{X0:t,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:He}),Ye.trafficLights=je.trafficLights,Ye.stopSigns=je.stopSigns;const Ne=new ht(.12,.16,7.2,7),st=new Xt(.46,10,8),k=new zt(2.8,13),De=new q({color:1581353,roughness:.42,metalness:.68}),Ee=new q({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Ae=new Rt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:pt,blending:Ai}),ve=y1(),he=new ld({map:ve,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:Ai}),Be=132,it=new an(Ne,De,Be),It=new an(st,Ee,Be),Tt=new an(k,Ae,Be);let Yt=0;for(let N=0;N<Be*2&&Yt<Be;N++){const O=Math.random()<.5,Y=O?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),j=O?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Pn(Y,j,3).clearance<2)continue;const ee=We(Y,j);e.quaternion.identity(),e.position.set(Y,ee+3.6,j),e.scale.set(1,1,1),e.updateMatrix(),it.setMatrixAt(Yt,e.matrix),e.position.set(Y,ee+7.5,j),e.updateMatrix(),It.setMatrixAt(Yt,e.matrix);const oe=new Nl(he);oe.position.set(Y,ee+7.5,j);const re=6.2+Math.random()*2.4;oe.scale.set(re,re,1),i.add(oe),Qi.streetGlowSprites++,e.position.set(Y,ee+.72,j),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(O?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Tt.setMatrixAt(Yt,e.matrix),Yt++}it.count=Yt,It.count=Yt,Tt.count=Yt,it.instanceMatrix.needsUpdate=!0,It.instanceMatrix.needsUpdate=!0,Tt.instanceMatrix.needsUpdate=!0,i.add(it,It,Tt),Ye.streetLights=Yt,i.add(new G(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),i.add(new G(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),i.add(new G(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),x)),i.add(new G(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),g));const Sn=new q({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const O=new G(new Ie(1.15,.09,13.5),Sn);O.position.set(80,We(80,N)+.9,N),O.receiveShadow=!0,i.add(O)}for(const N of[286,156,26,-104])for(let O=0;O<7;O++){const Y=new G(new Ie(2,.08,11.8),h),j=71.2+O*2.95;Y.position.set(j,We(j,N)+.91,N),Y.receiveShadow=!0,i.add(Y),bi("roadDetails","openerCrosswalkStripes")}function Ir(N,O,Y,j=!1){const ee=We(N,O),oe=new at,re=new G(new ht(.16,.22,9.5,8),De);re.position.y=4.75,oe.add(re);const w=new G(new Ie(3.8,.22,.22),De);w.position.set(Y*1.75,8.95,0),oe.add(w);const U=new G(new Xt(.62,12,8),Ee);U.position.set(Y*3.6,8.82,0),oe.add(U);const V=new Nl(he.clone());V.position.copy(U.position),V.material.opacity=.78+Math.random()*.12,V.scale.set(8.8,8.8,1),oe.add(V),Qi.streetGlowSprites++;const H=new G(new zt(3.2,15),Ae.clone());if(H.position.set(Y*2.8,.72,0),H.rotation.x=-Math.PI/2,H.scale.y=.7+Math.random()*.35,oe.add(H),j){const z=new tl(16762474,4.4,66,2);z.position.copy(U.position),oe.add(z)}oe.position.set(N,ee,O),i.add(oe),Ye.streetLights++}let Ws=0;for(let N=340;N>=-700;N-=118)Ir(63,N,1,Ws++%3===0),Ir(97,N-42,-1,Ws++%3===0);function ii(N,O,Y,j,ee=6010942){const oe=new q({color:ee,roughness:.92,metalness:.01}),re=new G(new Ie(Y,.08,j),oe);return re.position.set(N,We(N,O)+.06,O),re.receiveShadow=!0,i.add(re),Ye.openerProps++,re}function En(N,O,Y=1){const j=We(N,O),ee=new at,oe=new G(new ht(.35,.55,5.5,8),new q({color:6832160,roughness:.88}));oe.position.y=2.75,ee.add(oe);const re=new q({color:7587902,roughness:.86}),w=new q({color:4167215,roughness:.9}),U=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let V=0;V<U.length;V++){const[H,z,se,$]=U[V],me=new G(new Xt($,12,8),V%2?w:re);me.position.set(H,z,se),me.scale.y=.78,me.castShadow=!0,ee.add(me)}return ee.position.set(N,j,O),ee.scale.setScalar(Y),i.add(ee),Di.push({kind:"tree",x:N,z:O,radius:3.4*Y,maxY:j+11*Y}),Ye.openerProps++,ee}function Xs(N,O,Y=15){const j=new q({color:10129021,roughness:.98,flatShading:!0,side:pt}),ee=new G(new Na(Y,2),j),oe=ee.geometry.attributes.position;for(let re=0;re<oe.count;re++){const w=oe.getX(re),U=oe.getY(re),V=oe.getZ(re),H=.86+Math.sin(re*17.1)*.09+Math.cos(re*9.3)*.07;oe.setXYZ(re,w*(1.15+re%3*.06)*H,U*(.72+re%5*.035)*H,V*(.92+re%4*.05)*H)}return oe.needsUpdate=!0,ee.geometry.computeVertexNormals(),ee.position.set(N,We(N,O)+Y*.46,O),ee.rotation.set(.34,-.72,.18),ee.castShadow=!0,ee.receiveShadow=!0,i.add(ee),Di.push({kind:"rock",x:N,z:O,radius:Y*.98,maxY:ee.position.y+Y*.68}),Ye.openerProps++,ee}function Ur(N,O,Y=0){const j=new at,ee=new q({color:10970418,roughness:.64,metalness:.04}),oe=new q({color:1910317,roughness:.46,metalness:.5});for(const re of[1.05,1.55]){const w=new G(new Ie(6.8,.22,.44),ee);w.position.y=re,j.add(w)}for(const re of[-2.7,2.7]){const w=new G(new Ie(.22,1.2,.35),oe);w.position.set(re,.62,0),j.add(w)}j.position.set(N,We(N,O),O),j.rotation.y=Y,i.add(j),Ye.openerProps++}function Fr(N,O){const Y=new q({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),j=new at,ee=new G(new ht(.34,.42,1.25,12),Y);ee.position.y=.65,j.add(ee);const oe=new G(new Xt(.42,12,8),Y);oe.position.y=1.32,j.add(oe);const re=new G(new ht(.16,.16,1.1,10),Y);re.rotation.z=Math.PI/2,re.position.y=.9,j.add(re),j.position.set(N,We(N,O),O),i.add(j),Ye.openerProps++}function rs(N,O,Y=0){const j=new at,ee=new q({color:1185821,roughness:.36,metalness:.68}),oe=new q({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),re=new q({color:2370611,roughness:.42,metalness:.32}),w=new G(new Ie(8.5,.35,3.2),re);w.position.y=4.2,j.add(w);for(const H of[-3.8,3.8]){const z=new G(new ht(.09,.11,4.1,7),ee);z.position.set(H,2.05,-1.25),j.add(z)}const U=new G(new Ie(8,2.8,.08),oe);U.position.set(0,2.2,1.35),j.add(U);const V=new G(new zt(2.3,2.8),new Rt({map:Eo("BUS","#4ff3ff"),transparent:!0,side:pt}));V.position.set(-2.4,2.2,1.42),j.add(V),j.position.set(N,We(N,O),O),j.rotation.y=Y,i.add(j),Xi("bus-shelter-ad",N,We(N,O)+2.2,O),Ye.openerProps++}function en(N,O,Y,j,ee,oe,re,w=null,U=0){if(Hi(N,O,Y,j,12))return!1;const V=We(N,O)-.45;if(Wi(N,O,Y,j,V+ee+2))return!1;const H=N<80?1:-1,z=new q({map:As(192,512,re),color:oe,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),se=new G(new Ie(Y,ee,j),z);se.position.set(N,V+ee/2,O),se.castShadow=!1,se.receiveShadow=!0,i.add(se);const $=new q({map:As(220,620,Math.min(.86,re+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:pt}),me=new G(new zt(j*.78,ee*.74),$);me.position.set(N+H*(Y/2+.09),V+ee*.54,O),me.rotation.y=H>0?Math.PI/2:-Math.PI/2,i.add(me);for(const Pe of[-1,1]){const xe=new G(new zt(Y*.82,ee*.72),$.clone());xe.position.set(N,V+ee*.55,O+Pe*(j/2+.1)),xe.rotation.y=Pe>0?0:Math.PI,i.add(xe)}const ue=new G(new Ie(Y*1.04,1.2,j*1.04),new q({color:1778733,roughness:.34,metalness:.38}));ue.position.set(N,V+ee+.7,O),i.add(ue);const Ce=new q({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Pe of[-1,1]){const xe=new G(new Ie(Y*1.1,.22,.18),Ce);xe.position.set(N,V+ee+1.4,O+Pe*(j/2+.18)),i.add(xe)}if(w&&U){const Pe=new Rt({map:Eh(w,w==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:pt,depthWrite:!1}),xe=new G(new zt(7.5,24),Pe);xe.position.set(N+U*(Y/2+.3),V+Math.min(ee-8,ee*.58),O),xe.rotation.y=U>0?Math.PI/2:-Math.PI/2,i.add(xe),Xi("showcase-neon",xe.position.x,xe.position.y,xe.position.z)}return Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:V+ee+2}),Dt("showcase","glassTower"),!0}function as(N,O,Y,j=3.2){const ee=N*.5+j,oe=O*.5+j,re=Math.max(2,Math.abs(ee-oe)*.72),U=N>=O?[-ee,0,-oe,ee,0,-oe,re,Y,0,-ee,0,-oe,re,Y,0,-re,Y,0,ee,0,-oe,ee,0,oe,re,Y,0,ee,0,oe,-ee,0,oe,-re,Y,0,ee,0,oe,re,Y,0,-re,Y,0,-ee,0,oe,-ee,0,-oe,-re,Y,0]:[-ee,0,-oe,ee,0,-oe,0,Y,-re,ee,0,-oe,ee,0,oe,0,Y,re,ee,0,-oe,0,Y,re,0,Y,-re,ee,0,oe,-ee,0,oe,0,Y,re,-ee,0,oe,-ee,0,-oe,0,Y,-re,-ee,0,oe,0,Y,-re,0,Y,re],V=new Wt;return V.setAttribute("position",new bt(U,3)),V.computeVertexNormals(),V}function Ys(N,O,Y,j,ee,oe,re={}){if(Hi(N,O,Y,j,12))return!1;const w=We(N,O)-.3;if(Wi(N,O,Y,j,w+ee+(re.roofH??8.2)+1,6))return!1;const U=re.frontZ??-1,V=new q({map:B,color:re.wallColor??14734788,roughness:.68,metalness:.03}),H=new G(new Ie(Y,ee,j),V);H.position.set(N,w+ee/2,O),H.castShadow=!0,H.receiveShadow=!0,i.add(H);const z=new q({map:dt,color:oe,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),se=re.roofH??8.2,$=new G(as(Y,j,se),z);$.position.set(N,w+ee,O),$.castShadow=!0,$.receiveShadow=!0,i.add($);const me=new q({color:15985112,roughness:.42,metalness:.05}),ue=new G(new Ie(Y+7,.42,1.2),me);ue.position.set(N,w+ee+.12,O+U*(j*.5+1.4)),i.add(ue);const Ce=ue.clone();Ce.position.z=O-U*(j*.5+1.4),i.add(Ce);const Pe=Math.min(18,Y*.38),xe=new G(new Ie(Pe,ee*.55,.32),new q({map:lt,roughness:.34,metalness:.2}));xe.position.set(N+Y*.18,w+ee*.33,O+U*(j*.5+.22)),i.add(xe);const Ke=new G(new Ie(5.2,7.2,.28),new q({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Ke.position.set(N-Y*.25,w+3.7,O+U*(j/2+.24)),i.add(Ke);const rt=new q({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),vt=new q({color:3353638,roughness:.38});for(const tn of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(tn-Y*.18)<Pe*.45)continue;const qt=new G(new Ie(6.2,4.8,.26),vt);qt.position.set(N+tn,w+ee*.58,O+U*(j*.5+.28)),i.add(qt);const An=new G(new Ie(4.8,3.4,.3),rt);An.position.copy(qt.position),An.position.z+=U*.04,i.add(An)}const Mt=new q({color:12370619,roughness:.44,metalness:.04}),ut=new G(new Ie(Pe*1.18,.12,34),Mt);ut.position.set(N+Y*.18,We(N+Y*.18,O+U*(j*.5+17))+.11,O+U*(j*.5+17)),i.add(ut);const ke=new q({color:5679925,roughness:.86,metalness:.01}),St=new G(new Ie(Y+10,.08,j+12),ke);St.position.set(N,We(N,O)-.18,O),St.receiveShadow=!0,i.add(St),St.renderOrder=-1;const mt=new q({color:3042609,roughness:.84}),kt=[new q({color:16766544,roughness:.58}),new q({color:16738974,roughness:.58}),new q({color:16314584,roughness:.58})];for(let tn=0;tn<9;tn++){const qt=N-Y*.44+tn*(Y*.11),An=O+U*(j*.5+2.2+tn%2*1.5),Nt=new G(new Xt(1.35+tn%3*.22,10,7),tn%4===0?kt[tn%kt.length]:mt);Nt.position.set(qt,We(qt,An)+.95,An),Nt.scale.y=.72,Nt.castShadow=!0,i.add(Nt)}return Mn.push({x:N,z:O,hw:Y*.5,hd:j*.5,maxY:w+ee+5}),Dt("showcase","lowStorefront"),!0}return ii(45,318,36,84,6404169),ii(116,318,36,84,6074179),ii(44,188,34,84,6798662),ii(118,188,36,84,5941822),ii(43,60,34,82,5679164),ii(118,60,36,82,6864197),en(18,315,70,54,154,2311775,.72,"HOTEL",1),en(17,185,72,58,188,1522779,.78,null,0),en(31,55,44,56,138,2840688,.66,"OPEN",1),en(24,-75,52,64,182,1913933,.7,null,0),en(145,315,68,54,116,2776440,.72,null,0),en(146,185,70,58,146,2314602,.76,null,0),en(142,55,42,56,156,1590364,.68,"CAFE",-1),en(134,-75,48,64,114,3688540,.62,null,0),en(-70,315,52,52,146,2112085,.68,null,0),en(228,185,48,58,148,3235186,.66,null,0),en(-78,185,48,56,134,2181730,.68,null,0),en(236,315,44,54,104,3104884,.66,null,0),Ys(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Ys(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),en(-48,-360,54,56,148,2439765,.58,null,0),en(172,-430,50,56,132,3817032,.66,"OPEN",-1),Xs(112,238,12.5),En(50,292,1.2),En(111,316,.95),En(48,132,.9),En(116,102,1.05),Ur(47,248,Math.PI/2),Fr(57,226),rs(111,260,-Math.PI/2),et.add(i),i}function kd(i,{dirSel:e=1,rampType:t="on",merge:n=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=yt(n),c=new P(o.tangent.x,0,o.tangent.z).normalize(),l=new P().crossVectors(on,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*ce.width*.5),u=t==="off"?1:-1,p=d.x+c.x*s*u+l.x*e*r,m=d.z+c.z*s*u+l.z*e*r,g=new P(p,We(p,m)+.4,m),M=t==="off"?d:g,x=t==="off"?g:d,h=26,_=[];for(let X=0;X<=h;X++){const Q=X/h,ie=Q*Q*(3-2*Q),de=t==="off"?1-(1-Q)*(1-Q):ie;_.push(new P(Oe.lerp(M.x,x.x,Q),Oe.lerp(M.y,x.y,de),Oe.lerp(M.z,x.z,Q)))}const v=7.4,y=new P,E=new P,T=[],R=[];for(let X=0;X<=h;X++)E.subVectors(_[Math.min(h,X+1)],_[Math.max(0,X-1)]),E.y=0,E.normalize(),y.crossVectors(on,E).normalize(),T.push(_[X].clone().addScaledVector(y,-v)),R.push(_[X].clone().addScaledVector(y,v));const C={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:n,exitS:n,points:_.map(X=>X.clone()),segments:[]};for(let X=0;X<h;X++){const Q=_[X],ie=_[X+1],de=ie.x-Q.x,pe=ie.z-Q.z,ze=Math.max(1e-4,de*de+pe*pe);C.segments.push({a:Q.clone(),b:ie.clone(),abx:de,abz:pe,lenSq:ze,u0:X/h,u1:(X+1)/h})}Lr.push(C);const b=[];for(let X=0;X<h;X++){const Q=T[X],ie=R[X],de=T[X+1],pe=R[X+1];b.push(Q.x,Q.y,Q.z,ie.x,ie.y,ie.z,pe.x,pe.y,pe.z),b.push(Q.x,Q.y,Q.z,pe.x,pe.y,pe.z,de.x,de.y,de.z)}const S=new Wt;S.setAttribute("position",new bt(b,3)),S.computeVertexNormals();const L=new q({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:pt});i.add(new G(S,L));const F=new q({color:12107972,roughness:.5,metalness:.4});for(let X=0;X<h;X++)gn(i,T[X].clone().setY(T[X].y+1),T[X+1].clone().setY(T[X+1].y+1),.16,F),gn(i,R[X].clone().setY(R[X].y+1),R[X+1].clone().setY(R[X+1].y+1),.16,F);const W=new q({color:7173241,roughness:.82});for(let X=3;X<h;X+=3){const Q=_[X],ie=We(Q.x,Q.z),de=Q.y-ie;if(de<3)continue;const pe=new G(new ht(.9,1.15,de,8),W);pe.position.set(Q.x,ie+de/2,Q.z),i.add(pe),Zn.push({x:Q.x,z:Q.z,hw:1.3,hd:1.3,maxY:Q.y-.9})}const te=new Rt({map:al(a),transparent:!0,side:pt}),ne=new G(new zt(12,3),te);ne.position.copy(t==="off"?d:g).add(new P(0,t==="off"?6.2:5.5,0)),ne.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),i.add(ne);for(const X of[-1,1]){const Q=new G(new ht(.2,.26,6,6),W),ie=t==="off"?d:g;Q.position.set(ie.x+l.x*X*5.4,ie.y+3,ie.z+l.z*X*5.4),i.add(Q)}}function O1(i,e=1){kd(i,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function B1(i,e=-1){kd(i,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function z1(){const i=new at,e=[],t=new tt(14170671),n=new tt(15922680),s=new q({color:3883336,roughness:.6,metalness:.3}),r=new Rt({map:k1(),transparent:!0,side:pt}),a=new q({color:4926748,roughness:.9}),o=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:2583370,roughness:.9})],c=new q({color:7040883,roughness:.95,side:pt}),l=12,d=[],u=[];let p=0;for(let g=0;g<ce.length;g+=l){if(Li(g+l*.5)){p++;continue}const M=yt(g),x=yt(g+l),h=M.p.clone().add(x.p).multiplyScalar(.5),{sideways:_,normal:v,q:y}=ui(M,x);for(const E of[-1,1]){const T=h.clone().addScaledVector(_,E*ce.width*.5).addScaledVector(v,.5);d.push(T),u.push(y),e.push(p%2===0?t:n)}if(p%16===8){const E=(p>>4)%2?1:-1,T=h.clone().addScaledVector(_,E*ce.width*.52).addScaledVector(v,.4),R=new at,C=new G(new zt(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,R.add(C);const b=new ht(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new G(b,s);L.position.set(S,1.7,0),R.add(L)}R.position.copy(T),R.quaternion.copy(y),i.add(R)}p++}for(let g=0;g<ce.length;g+=16){const M=yt(g),x=1+(Math.random()<.5?1:0);for(let h=0;h<x;h++){const _=Math.random()<.5?-1:1,v=ce.width/2+12+Math.random()*78,y=M.p.x+M.side.x*v*_+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*_+(Math.random()-.5)*16;if(ka(y,E,18))continue;const T=We(y,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,C=new at,b=2.4+Math.random()*4.2,S=new G(new ht(.26,.42,b,6),a);S.position.y=b/2,C.add(S);const L=2+Math.floor(Math.random()*3);for(let F=0;F<L;F++){const W=new G(new ji(2.4+Math.random()*1.6-F*.2,4.6+Math.random()*2.4,7),o[(h+F+g)%o.length]);W.position.y=b+F*1.4+1.5,W.rotation.y=Math.random()*Math.PI,C.add(W)}C.position.set(y,T+.6,E),C.scale.setScalar(R),i.add(C)}else{const R=1.4+Math.random()*3.6,C=new G(new Kc(R,0),c);C.position.set(y,T+R*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),i.add(C),Zn.push({kind:"rock",x:y,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const M=ce.length*g/3+6;if(Li(M))continue;const x=yt(M),h=yt(M+l),_=x.p.clone().add(h.p).multiplyScalar(.5),{q:v}=ui(x,h),y=ce.width*.5+1.2,E=9,T=new at,R=new ht(.4,.55,E,7);for(const F of[-1,1]){const W=new G(R,s);W.position.set(F*y,E/2,0),T.add(W)}const C=y*2,b=new G(new Ie(C,1.1,1.1),s);b.position.y=E,T.add(b);const S=new Rt({map:al(m[g]),transparent:!0,side:pt}),L=new G(new zt(C*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(_),T.quaternion.copy(v),i.add(T)}if(d.length){const g=new ht(.18,.24,3,6);g.translate(0,1.5,0);const M=new Xt(.34,8,6);M.translate(0,3.2,0);const x=new q({color:10134440,roughness:.7,metalness:.2}),h=new q({roughness:.55}),_=new an(g,x,d.length),v=new an(M,h,d.length),y=new Ht;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(u[E]),y.updateMatrix(),_.setMatrixAt(E,y.matrix),v.setMatrixAt(E,y.matrix),v.setColorAt(E,e[E]);_.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),i.add(_),i.add(v)}return O1(i),B1(i),et.add(i),i}function k1(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new $t(i);return t.colorSpace=At,t}function al(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new $t(e);return n.colorSpace=At,n}function V1(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new $t(t);return o.colorSpace=At,o}function G1(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new $t(i);return n.colorSpace=At,n.wrapS=un,n.repeat.set(3,1),n}function Bt(i,e,t,n,s){const r=new G(new Ie(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function ui(i,e){const t=e.p.clone().sub(i.p).normalize(),n=Ld.crossVectors(on,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new xi().setFromAxisAngle(t,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new Pt().makeBasis(n,s,t),o=new xi().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function Ch(i,e,t,n){const r=[],a=[],o=[],c=ce.width*.47;let l=0;for(let p=e;p<=t;p+=8){const m=yt(Math.min(p,t)),g=ui(m,yt(m.s+2)),M=Math.sin(p*.018)*.04,x=m.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+M),h=m.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-M);r.push(x.x,x.y,x.z,h.x,h.y,h.z);const _=(p-e)/64;if(a.push(0,_,1,_),l>0){const v=(l-1)*2,y=l*2;o.push(v,v+1,y,v+1,y+1,y)}l++}const d=new Wt;d.setAttribute("position",new bt(r,3)),d.setAttribute("uv",new bt(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new G(d,n);u.receiveShadow=!0,i.add(u)}function H1(i,e){let t=0;for(const n of ce.gaps)Ch(i,t,Math.max(t,n.start-4),e),t=n.end+4;Ch(i,t,ce.length,e)}function W1(i,e,t){const n=yt(e.s+2),{normal:s,q:r}=ui(e,n),a=new at;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new G(new Ie(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new G(new Ie(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new G(new Ie(.42,.1,3.8),t);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function X1(){const i=new at;et.add(i),Cc=0;const e=new q({color:12171149,roughness:.72,metalness:.08}),t=new q({color:9869942,roughness:.78,metalness:.05}),n=new q({color:15255629,roughness:.28,metalness:.72}),s=new q({color:8204328,roughness:.3,metalness:.85}),r=new q({color:6120040,roughness:.5,metalness:.6}),a=new q({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new q({color:14270570,roughness:.35,metalness:.65}),c=new q({color:2435884,roughness:.48,metalness:.62}),l=new q({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new q({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new q({color:4935486,roughness:.92,metalness:.04}),p=new q({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new q({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new q({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new q({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),x=new q({color:15919561,roughness:.82,metalness:.02});new q({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const h=new q({map:_1(),roughness:.74,metalness:.08}),_=new Rt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;H1(i,h);function y(E,T=!1){if(Li(E))return!1;const R=yt(E),C=yt(E+3),{sideways:b,normal:S,q:L}=ui(R,C),F=R.p,W=We(F.x,F.z),te=F.y-.95;if(te-W<10)return!1;const ne=ce.width*(T?.43:.35),X=te,Q=W+.25,ie=T?.56:.42,de=T?2.4:1.75,pe=T?.52:.36,ze=[],I=[];for(const _e of[-1,1]){const be=F.clone().addScaledVector(b,_e*ne).addScaledVector(S,-.85);be.y=X;const Le=new P(be.x,Q,be.z);gn(i,Le,be,ie,r);const Xe=new G(new ht(de,de*1.12,pe,12),r);Xe.position.set(Le.x,W+pe*.5,Le.z),Xe.receiveShadow=!0,i.add(Xe),ze.push(be),I.push(Le),Zn.push({x:Le.x,z:Le.z,hw:de*.92,hd:de*.92,maxY:X-.7})}const ye=F.clone().addScaledVector(S,-1.05);ye.y=X,Bt(i,new P(ce.width*.92,T?.58:.42,T?1.55:1.15),ye,L,a);const Me=I[0].clone();Me.y+=(X-Q)*.28;const Se=I[1].clone();Se.y+=(X-Q)*.28;const Z=ze[0].clone();Z.y-=1;const K=ze[1].clone();if(K.y-=1,gn(i,Me,K,T?.16:.1,c),gn(i,Se,Z,T?.16:.1,c),T){const _e=I[0].clone();_e.y+=(X-Q)*.58;const be=I[1].clone();be.y+=(X-Q)*.58,gn(i,I[0].clone().setY(Q+1.2),be,.13,c),gn(i,I[1].clone().setY(Q+1.2),_e,.13,c),gn(i,_e,K,.13,c),gn(i,be,Z,.13,c)}return Cc++,!0}for(let E=0;E<ce.length;E+=v){if(Li(E+v*.5))continue;const T=yt(E),R=yt(E+v),C=T.p.clone().add(R.p).multiplyScalar(.5),{sideways:b,normal:S,q:L}=ui(T,R),F=T.p.distanceTo(R.p)+.45,W=Math.floor(E/(v*2))%2?e:t;Bt(i,new P(ce.width,.62,F),C.clone().addScaledVector(S,-.05),L,W),Bt(i,new P(ce.width-2.8,.08,F*.86),C.clone().addScaledVector(S,.36),L,u),Bt(i,new P(.2,.1,F*.76),C.clone().addScaledVector(b,-ce.width*.19).addScaledVector(S,.43),L,u),Bt(i,new P(.2,.1,F*.76),C.clone().addScaledVector(b,ce.width*.19).addScaledVector(S,.43),L,u),E%48===0&&(Bt(i,new P(.14,.08,F*.62),C.clone().addScaledVector(b,-ce.width*.08).addScaledVector(S,.51),L,M),Bt(i,new P(.14,.08,F*.62),C.clone().addScaledVector(b,ce.width*.08).addScaledVector(S,.51),L,M)),E%120===0&&Bt(i,new P(ce.width*.42,.07,.72),C.clone().addScaledVector(S,.55),L,x),Bt(i,new P(ce.width+1.2,.35,F*.94),C.clone().addScaledVector(S,-.56),L,a),Bt(i,new P(.42,.42,F*.9),C.clone().addScaledVector(b,-ce.width*.36).addScaledVector(S,-.78),L,g),Bt(i,new P(.42,.42,F*.9),C.clone().addScaledVector(b,ce.width*.36).addScaledVector(S,-.78),L,g);const te=C.clone().addScaledVector(b,-ce.width*.51),ne=C.clone().addScaledVector(b,ce.width*.51);if(Bt(i,new P(.32,.46,F),te.clone().addScaledVector(S,.28),L,n),Bt(i,new P(.32,.46,F),ne.clone().addScaledVector(S,.28),L,n),Bt(i,new P(.26,.72,F*.94),te.clone().addScaledVector(S,-.22),L,a),Bt(i,new P(.26,.72,F*.94),ne.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const X of[-ce.width*.39,-ce.width*.2,ce.width*.2,ce.width*.39]){const Q=new G(new ht(.16,.2,.12,10),o);Q.position.copy(C).addScaledVector(b,X).addScaledVector(S,.46),Q.quaternion.copy(L),Q.castShadow=!1,i.add(Q)}if(E%72===0&&(Bt(i,new P(.34,1.56,3.4),C.clone().addScaledVector(b,-ce.width*.66).addScaledVector(S,1.16),L,s),Bt(i,new P(.34,1.56,3.4),C.clone().addScaledVector(b,ce.width*.66).addScaledVector(S,1.16),L,s),Bt(i,new P(.18,.18,4.4),C.clone().addScaledVector(b,-ce.width*.62).addScaledVector(S,1.94),L,s),Bt(i,new P(.18,.18,4.4),C.clone().addScaledVector(b,ce.width*.62).addScaledVector(S,1.94),L,s),Bt(i,new P(.12,.12,4),C.clone().addScaledVector(b,-ce.width*.62).addScaledVector(S,1.38),L,n),Bt(i,new P(.12,.12,4),C.clone().addScaledVector(b,ce.width*.62).addScaledVector(S,1.38),L,n),gn(i,C.clone().addScaledVector(b,-ce.width*.58).addScaledVector(S,-1.08),C.clone().addScaledVector(b,ce.width*.58).addScaledVector(S,-1.08),.11,c),gn(i,C.clone().addScaledVector(b,-ce.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(b,0).addScaledVector(S,-2.2),.09,c),gn(i,C.clone().addScaledVector(b,ce.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(b,0).addScaledVector(S,-2.2),.09,c)),E%96===0){const X=new G(new fn(1,28),_);X.rotation.x=-Math.PI/2,X.position.set(C.x,-4.72,C.z),X.scale.set(ce.width*.9,Math.max(10,F*2.2),1),X.rotation.z=Math.atan2(ui(T,R).tangent.x,ui(T,R).tangent.z),i.add(X)}if(E%144===0){const X=C.clone().addScaledVector(b,-ce.width*.74).addScaledVector(S,2),Q=C.clone().addScaledVector(b,ce.width*.74).addScaledVector(S,2);gn(i,X.clone().addScaledVector(S,-1.2),X.clone().addScaledVector(S,1.1),.12,s),gn(i,Q.clone().addScaledVector(S,-1.2),Q.clone().addScaledVector(S,1.1),.12,s),Bt(i,new P(.46,.72,.46),X.clone().addScaledVector(S,1.15),L,l),Bt(i,new P(.46,.72,.46),Q.clone().addScaledVector(S,1.15),L,l)}if(E%288===0){const X=C.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*ce.width*.92).addScaledVector(S,5.2);Bt(i,new P(.44,.44,.44),X.clone(),L,p),gn(i,X.clone().addScaledVector(S,-.2),C.clone().addScaledVector(S,1),.05,c)}E%48===0&&y(E+v*.5,!1),E%168===0&&!Li(E+16)&&W1(i,yt(E+5),d)}for(const E of ce.gaps){const T=yt(E.start-3),R=yt(E.end+3);for(const C of[T,R]){const b=yt(C.s+2),{normal:S,q:L}=ui(C,b);Bt(i,new P(ce.width-1.2,.08,4.6),C.p.clone().addScaledVector(S,.54),L,l),Bt(i,new P(ce.width*.62,.09,1.3),C.p.clone().addScaledVector(S,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,x);for(const F of[-ce.width*.42,0,ce.width*.42]){const W=C.p.clone().addScaledVector(C.side,F).addScaledVector(S,2.35);Bt(i,new P(.46,.46,.46),W,L,F===0?m:l)}y(C.s+(C===T?-9:9),!0),y(C.s+(C===T?-24:24),!0)}}return i}function Vd(i=13710372,e=7740696){const t=new at,n=new q({color:i,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new q({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new q({color:329225,roughness:.52,metalness:.12}),a=new q({color:1053463,roughness:.38,metalness:.34}),o=new q({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new q({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),l=new q({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new q({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:1.25}),u=new q({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:.88}),p=new q({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:.95}),m=new q({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),g=new q({color:329225,roughness:.44,metalness:.22}),M=new G(new fn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const x=(y,E,T,R,C=null,b=null)=>{const S=new G(E,T);return S.name=y,S.position.copy(R),C&&S.rotation.set(C.x||0,C.y||0,C.z||0),b&&S.scale.copy(b),t.add(S),S},h=(y,E,T,R,C,b,S=0,L=0,F=0)=>x(y,new Ie(E.x,E.y,E.z),T,new P(R,C,b),new P(S,L,F));h("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),h("wide wedge body tub",new P(4.85,.86,6.65),n,0,.98,.28,-.035),h("sloped front wedge nose",new P(3.7,.64,3.35),n,0,.83,-3.75,-.145),h("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),h("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),h("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),h("left rear haunch",new P(.72,.74,2.55),n,-2.53,1.18,2.08,-.04),h("right rear haunch",new P(.72,.74,2.55),n,2.53,1.18,2.08,-.04),h("left front fender flare",new P(.46,.54,1.38),n,-2.55,.98,-2.78,-.04),h("right front fender flare",new P(.46,.54,1.38),n,2.55,.98,-2.78,-.04),h("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),h("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),h("front windshield",new P(2.8,.13,1.15),l,0,1.78,-1.25,-.48),h("roof glass",new P(2.34,.18,1.55),l,0,2.08,-.2,-.13),h("left side window",new P(.12,.78,1.9),l,-1.28,1.76,-.15,-.08,.04),h("right side window",new P(.12,.78,1.9),l,1.28,1.76,-.15,-.08,-.04),h("black a pillar left",new P(.12,.86,.14),g,-1.46,1.75,-1.22,-.48),h("black a pillar right",new P(.12,.86,.14),g,1.46,1.75,-1.22,-.48),h("rear deck panel",new P(3.5,.18,2.18),n,0,1.7,2,-.2);for(let y=0;y<7;y++)h("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);h("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])h("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])h("thin hood crease",new P(.08,.04,2.55),g,y*.36,1.27,-3.45,-.15),h("door seam",new P(.035,.68,1.75),g,y,1.16,-.2),h("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])h("pop up headlight glass",new P(.62,.12,.18),p,y,1.02,-5.28,-.16);h("tail light backplate",new P(3.86,.46,.08),g,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])h("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?d:u,y,1.08,4.24);h("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),h("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),h("left black roof rail",new P(.12,.12,2.72),g,-1.34,2.15,-.42,-.13),h("right black roof rail",new P(.12,.12,2.72),g,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])h("angular side mirror arm",new P(.42,.08,.08),g,y,1.62,-1.55,0,0,y<0?-.14:.14),h("blue tinted side mirror",new P(.12,.34,.46),l,y*1.03,1.62,-1.65,0,y<0?.24:-.24),h("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])h("left wheel arch shadow",new P(.08,.9,1.75),g,-2.82,.78,y),h("right wheel arch shadow",new P(.08,.9,1.75),g,2.82,.78,y);h("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const _=[],v=(y,E,T=!1)=>{const R=new at;R.name=T?"steering front wheel assembly":"rear wheel assembly",R.position.set(y,.54,E);const C=new G(new ht(.88,.88,.62,28),r);C.name="wide performance tire",C.rotation.z=Math.PI/2,R.add(C);const b=new G(new Os(.88,.06,10,32),r);b.name="rounded tire sidewall",b.rotation.y=Math.PI/2,R.add(b);const S=new G(new ht(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,R.add(S);const L=new G(new ht(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,R.add(L);for(let te=0;te<8;te++){const ne=new G(new Ie(.08,.055,.62),o);ne.name="thin wheel spoke",ne.rotation.x=te/8*Math.PI*2,ne.position.set(y>0?.035:-.035,0,.22),R.add(ne)}const F=new G(new Ie(.1,.22,.18),u);F.name="small brake caliper",F.position.set(y>0?-.39:.39,.18,-.38),R.add(F);const W=new G(new ht(.17,.17,.72,18),c);W.name="dark center cap",W.rotation.z=Math.PI/2,R.add(W),t.add(R),T&&_.push(R)};for(const y of[-2.4,2.4])v(y,-2.65,!0),v(y,2.42,!1);t.userData.frontWheels=_,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new G(new ht(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),et.add(t),t}function Y1(){const i=new at,e=new q({color:9383205,roughness:.35,metalness:.55}),t=new q({color:460551,roughness:.55}),n=new q({color:12375772,roughness:.18,metalness:.9}),s=new q({color:16767297,roughness:.38,metalness:.25}),r=new q({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new q({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new q({color:1118995,roughness:.7,metalness:.05}),c=new G(new Ie(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),i.add(c);const l=new G(new Ie(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new G(new Ie(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new G(new zt(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const p=new G(new Os(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,i.add(p);for(let m=0;m<3;m++){const g=new G(new Ie(.34,.025,.035),n);g.position.copy(p.position),g.rotation.copy(p.rotation),g.rotation.z+=m/3*Math.PI*2,i.add(g)}for(let m=0;m<6;m++){const g=new G(new ht(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),i.add(g)}for(const m of[-1.08,1.08]){const g=new G(new ht(.34,.34,.25,18),t);g.rotation.z=Math.PI/2,g.position.set(m,-.68,-1.58),i.add(g);const M=new G(new Os(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,i.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const g=new G(new ht(.035,.04,.028,8),n);g.position.set(m,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const m of[-.52,.52]){const g=new G(new Xt(.045,12,8),r);g.position.set(m,-.34,-1.22),i.add(g)}i.position.set(0,0,0),Ze.add(i),Yn=i}function q1(){const i=new q({color:16119285,roughness:.35,metalness:.25}),e=new q({color:1184274,roughness:.45}),t=new q({map:v1(),roughness:.42,metalness:.05}),n=new q({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=yt(0),r=new Pt().makeBasis(s.side,on,s.tangent),a=new xi().setFromRotationMatrix(r),o=new at;for(const d of[-ce.width*.58,ce.width*.58]){const u=new G(new Ie(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(on,5.4),u.quaternion.copy(a),o.add(u)}const c=new G(new Ie(ce.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(on,11.2),c.quaternion.copy(a),o.add(c);const l=new G(new Ie(ce.width+1.2,1.4,.18),e);l.position.copy(s.p).addScaledVector(on,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-ce.width*.38,0,ce.width*.38]){const u=new G(new Xt(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(on,10.25),o.add(u)}return et.add(o),o}const es=Vd(),cn=Vd(3108784,1916782);cn.visible=!1;P1();R1();Ye.signs=0;Pa.length=0;L1();D1();N1();let Rh=null,Ph=null,Lh=null,Yn=null,Ro=null;const nn=[];Y1();function Po(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),et.remove(i))}function ol(i){return Ma=Oe.clamp(i,0,is.length-1),ce=is[Ma],Zn.length=0,Lr.length=0,Po(Rh),Po(Ph),Po(Lh),Rh=X1(),Ph=q1(),Lh=z1(),Qe.trackName.textContent=ce.name,Qe.courseName&&(Qe.courseName.textContent=ce.name),Qe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Ma)}),ce.name}ol(0);function Z1(){Ro&&et.remove(Ro),nn.length=0;const i=new at,e=new q({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Rt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:pt,blending:Ai}),n=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<n.length;s++){const r=n[s],a=We(r.x,r.z)+4.2,o=new at,c=new G(new Os(5.6,.22,12,52),e.clone());c.rotation.y=r.yaw,o.add(c);const l=new G(new fn(4.7,32),t.clone());l.rotation.y=r.yaw,o.add(l);const d=new q({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new G(new ht(.11,.16,6.2,8),d);m.position.set(Math.cos(r.yaw)*p,-1.1,Math.sin(r.yaw)*p),o.add(m)}const u=new G(new Xt(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,i.add(o),nn.push({...r,y:a,radius:8.5,marker:o,collected:!1})}Bn(i,s=>{for(let r=0;r<nn.length;r++){const a=nn[r],o=r===f.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),et.add(i),Ro=i}Z1();const Hs=new l1(Qt);Hs.addPass(new h1(et,Ze));const Gd=new Bs(new Te(window.innerWidth,window.innerHeight),.34,.78,1);Hs.addPass(Gd);Hs.addPass(new u1);const $1={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
      float aberration = (0.0016 + uSpeed * 0.0042 + uBoost * 0.004) * dist;
      vec2 dir = normalize(toCenter + 1e-5);
      float r = texture2D(tDiffuse, uv - dir * aberration).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + dir * aberration).b;
      vec3 color = vec3(r, g, b);

      // Contrast + saturation lift for a richer, punchier image.
      color = (color - 0.5) * 1.04 + 0.5;
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luma), color, 1.16);

      // Speed-reactive vignette that closes in as you go faster, selling the rush.
      float vig = smoothstep(0.92, 0.32, dist * (1.0 + uSpeed * 0.5 + uBoost * 0.35));
      color *= mix(1.0, vig, 0.55);

      // Fine animated film grain, strongest in the shadows.
      float grain = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0) - 0.5;
      color += grain * 0.035 * (1.0 - luma * 0.7);

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `},cr=new Rd($1);Hs.addPass(cr);const K1=new q({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),pr=Array.from({length:72},()=>{const i=new G(new Xt(.1,8,5),K1);return i.visible=!1,et.add(i),{mesh:i,life:0,velocity:new P}}),J1=new Rt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:pt}),mr=Array.from({length:90},()=>{const i=new G(new fn(1,18),J1.clone());return i.visible=!1,et.add(i),{mesh:i,life:0,maxLife:1,velocity:new P,spin:0}}),j1=new q({color:2962232,roughness:.58,metalness:.34}),xr=Array.from({length:48},()=>{const i=new G(new Ie(.18,.08,.26),j1);return i.visible=!1,et.add(i),{mesh:i,life:0,velocity:new P,spin:new P}});let mi=null;function Hd(){if(mi)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),mi={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function La(){mi||Hd(),mi?.ctx.state==="suspended"&&mi.ctx.resume().catch(()=>{})}function Pc(i){if(!mi)return;const{ctx:e}=mi,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function Rr(i,e=18){const t=Math.min(e,pr.length);for(let n=0;n<t;n++){const s=pr.find(r=>r.life<=0)||pr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Wd(i,e=10,t=1){const n=Math.min(e,mr.length);for(let s=0;s<n;s++){const r=mr.find(a=>a.life<=0)||mr[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function Q1(i,e=8,t=1){const n=Math.min(e,xr.length);for(let s=0;s<n;s++){const r=xr.find(a=>a.life<=0)||xr[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function ev(i,e=Math.abs(f.speed),t="CRASH"){const n=Oe.clamp(Math.abs(e)/70,.18,1.45);f.collisionHits++,f.collisionDrama=Math.max(f.collisionDrama,n),f.cameraShake=Math.max(f.cameraShake,.25+n*.45),f.damage=Oe.clamp(f.damage+n*3.6,0,100),f.message=t,f.messageTimer=Math.max(f.messageTimer,.7),Rr(i,Math.round(10+n*24)),Wd(i,Math.round(5+n*12),n),Q1(i,Math.round(3+n*8),n),Pc(18+n*34)}function tv(i){for(const e of pr){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of mr){if(e.life<=0)continue;e.life-=i,e.mesh.position.addScaledVector(e.velocity,i),e.velocity.y+=.4*i,e.mesh.rotation.z+=e.spin*i;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+i*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Ze.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of xr)e.life<=0||(e.life-=i,e.velocity.y-=24*i,e.mesh.position.addScaledVector(e.velocity,i),e.mesh.rotation.x+=e.spin.x*i,e.mesh.rotation.y+=e.spin.y*i,e.mesh.rotation.z+=e.spin.z*i,e.life<=0&&(e.mesh.visible=!1))}function nv(i){if(!mi)return;const{ctx:e,engine:t,engineGain:n,filter:s}=mi;t.frequency.setTargetAtTime(62+f.speed*2.9+(_t.has("ShiftLeft")||_t.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+f.speed*9,e.currentTime,.08);const r=f.mode==="race"||f.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(f.speed)/4200:1e-4,e.currentTime,.08)}function Va(i=!1,e=!1){Hd(),_t.clear(),Ia();const t=i||e;Object.assign(f,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=yt(f.s);f.y=n.p.y+2.1,f.yVel=0,Qe.menu.classList.add("hidden"),Qe.result.classList.add("hidden"),Qe.resultStats.innerHTML="",Qe.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",Qe.trackName.textContent=ce.name,cn.visible=!1,Yn&&(Yn.visible=!0),document.body.classList.remove("roam-mode"),window.__freeCam=!1}function Xd(){La(),f.mode="roam",f.practice=!0,f.freeRun=!1,_t.clear(),Ia();let i=80,e=338;Pn(i,e,6).clearance<6&&(i=80,e=320),f.roamPos.set(i,We(i,e),e),f.roamYaw=0,f.camYaw=f.roamYaw,f.camLookYaw=0,f.camLookPitch=0,f.cameraZoom=0,Fe.zoom=0,f.wheelSteer=0,f.speed=0,f.boost=1,f.damage=0,f.cameraShake=0,f.collisionDrama=0,f.collisionHits=0,f.collisionCooldown=0,f.objectiveIndex=0,f.objectiveHits=0,f.objectiveLap=1;for(const s of nn)s.collected=!1;f.message="",f.messageTimer=0,es.visible=!1,cn.visible=!0,Yn&&(Yn.visible=!1),document.body.classList.add("roam-mode"),window.__freeCam=!1,Qe.menu.classList.add("hidden"),Qe.result.classList.add("hidden"),Qe.position.textContent="FREE ROAM",Qe.trackName.textContent="City Streets",Dr();const t=Math.sin(f.roamYaw),n=-Math.cos(f.roamYaw);Ze.position.set(f.roamPos.x-t*17,f.roamPos.y+7.2,f.roamPos.z-n*17),Jd(),Ze.lookAt(f.roamPos.x+t*13,f.roamPos.y+2.45,f.roamPos.z+n*13),Ze.fov=69,Ze.updateProjectionMatrix()}function Dr(){cn.position.set(f.roamPos.x,f.roamPos.y+.3-f.roamSuspension*.45,f.roamPos.z),cn.quaternion.setFromAxisAngle(on,-f.roamYaw),cn.rotateZ(-f.wheelSteer*Oe.clamp(Math.abs(f.speed)/90,0,1)*.1),cn.rotateX(Oe.clamp(f.roamSuspension,-.16,.22))}function Yd(i,e){let t=null;for(const s of Lr)for(const r of s.segments){const a=i-r.a.x,o=e-r.a.z,c=Oe.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,e-d);if(u>s.halfW+Wn*1.15)continue;const p=Oe.lerp(r.a.y,r.b.y,c),m=Oe.lerp(r.u0,r.u1,c),g=u+Math.max(0,We(i,e)-p)*.2;(!t||g<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*ce.width*.34,score:g})}if(!t)return null;const n=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=n,t.tangentZ/=n,t}function qd(i,e,t=We(i,e),n=!1){let s=null;const r=10;for(let o=0;o<ce.length;o+=r){if(Li(o+r*.5))continue;const c=yt(o),l=yt(o+r),d=l.p.x-c.p.x,u=l.p.z-c.p.z,p=Math.max(1e-4,d*d+u*u),m=Oe.clamp(((i-c.p.x)*d+(e-c.p.z)*u)/p,0,1),g=c.p.x+d*m,M=c.p.z+u*m,x=i-g,h=e-M,_=Math.hypot(x,h);if(_>ce.width*.5+Wn*.45)continue;const v=Oe.lerp(c.p.y,l.p.y,m)+.58;if(!n&&t<v-5)continue;const y=new P(u,0,-d).normalize(),E=Oe.clamp(x*y.x+h*y.z,-ce.width*.44,ce.width*.44);(!s||_<s.dist)&&(s={kind:"track",y:v,s:o+r*m,lateral:E,tangentX:d,tangentZ:u,dist:_})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function Ki(i,e,t=f.roamPos.y){const n=We(i,e);let s={kind:"ground",y:n};const r=Yd(i,e);r&&r.y>=n-1.2&&(s=r);const a=qd(i,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function Dh(i){if(i.rampType==="off")return!1;const e=Math.sin(f.roamYaw)*i.tangentX+-Math.cos(f.roamYaw)*i.tangentZ;if(f.speed<10||e<.22)return!1;const t=(i.mergeS??i.s??22)+8,n=yt(t);return f.mode="race",f.practice=!0,f.freeRun=!0,f.breakdownTimer=0,f.s=n.s,f.totalDistance=n.s,f.lastSafeS=n.s,f.lastSafeDistance=n.s,f.lateral=Oe.clamp(i.lateral??0,-ce.width*.32,ce.width*.32),f.lateralVel=-Math.sign(f.lateral)*Math.min(4,Math.abs(f.speed)*.04),f.speed=Oe.clamp(Math.max(28,f.speed),18,112),f.grounded=!0,f.y=n.p.y+2.1,f.yVel=0,f.airtime=0,f.rivalS=-900,f.rivalDistance=-900,f.leadState="SOLO",f.message="Merged onto the ribbon",f.messageTimer=1.6,f.cameraShake=Math.max(f.cameraShake,.35),es.visible=!1,cn.visible=!1,Yn&&(Yn.visible=!0),document.body.classList.remove("roam-mode"),Qe.position.textContent="FREE RUN",Qe.trackName.textContent=ce.name,Dr(),!0}function iv(i){if(!i||f.mode!=="race")return!1;const e=i.segments[0],t=i.points[0],n=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/n,r=e.abz/n;f.mode="roam",f.practice=!0,f.freeRun=!1,f.roamPos.set(t.x+s*3.5,t.y+ei,t.z+r*3.5),f.roamYaw=Math.atan2(s,-r),f.camYaw=f.roamYaw,f.camLookYaw=0,f.camLookPitch=0,f.cameraZoom=0,f.wheelSteer=0,f.speed=Oe.clamp(Math.max(24,Math.abs(f.speed)*.82),20,78),f.grounded=!0,f.yVel=0,f.airtime=0,f.message="Exited to city streets",f.messageTimer=1.25,f.cameraShake=Math.max(f.cameraShake,.22),es.visible=!1,cn.visible=!0,Yn&&(Yn.visible=!1),document.body.classList.add("roam-mode"),Qe.position.textContent="FREE ROAM",Qe.trackName.textContent="City Streets",Dr();const a=Math.sin(f.roamYaw),o=-Math.cos(f.roamYaw);return Ze.position.set(f.roamPos.x-a*17,f.roamPos.y+7.2,f.roamPos.z-o*17),Ze.lookAt(f.roamPos.x+a*13,f.roamPos.y+2.45,f.roamPos.z+o*13),Ze.fov=69,Ze.updateProjectionMatrix(),Rr(f.roamPos.clone().add(new P(0,.6,0)),10),!0}function sv(){if(f.mode!=="roam"||nn.length===0)return;const i=nn[f.objectiveIndex%nn.length];if(!i)return;const e=f.roamPos.x-i.x,t=f.roamPos.z-i.z,n=Math.abs(f.roamPos.y-i.y);e*e+t*t>i.radius*i.radius||n>8.5||(i.collected=!0,f.objectiveHits++,f.objectiveIndex=(f.objectiveIndex+1)%nn.length,f.objectiveIndex===0&&f.objectiveLap++,f.score+=420+Math.round(Math.abs(f.speed)*5),f.boost=Math.min(1,f.boost+.32),f.cameraShake=Math.max(f.cameraShake,.18),f.message=`${i.label} +${420+Math.round(Math.abs(f.speed)*5)}`,f.messageTimer=1.05,Rr(new P(i.x,i.y,i.z),18))}function Zd(i){const e=f.speed;f.collisionCooldown=Math.max(0,f.collisionCooldown-i);const t=Math.max(_t.has("KeyW")||_t.has("ArrowUp")?1:0,Fe.throttle),n=Math.max(_t.has("KeyS")||_t.has("ArrowDown")?1:0,Fe.brake),r=Oe.clamp((_t.has("KeyD")||_t.has("ArrowRight")?1:0)-(_t.has("KeyA")||_t.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*Id,a=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&t>.03;if(t>.03){const v=f.speed<0?38:0;f.speed+=((a?62:36)+v)*t*i}n>.03&&(f.speed-=(f.speed>1.2?78:32)*n*i),f.speed-=.00235*f.speed*Math.abs(f.speed)*i,Math.abs(f.speed)>.08?f.speed-=Math.sign(f.speed)*3.6*i:t<=.03&&n<=.03&&(f.speed=0),f.speed=Oe.clamp(f.speed,-24,135),f.boosting=a,a?f.boost=Math.max(0,f.boost-i*.22):f.boost=Math.min(1,f.boost+i*.05),f.wheelSteer+=(r-f.wheelSteer)*(1-Math.pow(1e-5,i));const o=-f.wheelSteer*.55,c=cn.userData.frontWheels;c&&(c[0].rotation.y=o,c[1].rotation.y=o);const l=Math.abs(f.speed);if(l>Ac){const v=Oe.clamp((l-Ac)/5,0,1),y=1-.36*Oe.clamp((l-34)/85,0,1),E=m1*1.08*v*y;f.roamYaw+=f.wheelSteer*E*i*Math.sign(f.speed)}const d=Math.sin(f.roamYaw),u=-Math.cos(f.roamYaw),p=(f.speed-e)/Math.max(.001,i),m=Oe.clamp(Math.abs(f.wheelSteer)*Math.max(0,l-18)/68+Math.max(0,-p-34)/90,0,1);if(f.roamSlip+=(m-f.roamSlip)*(1-Math.pow(.01,i)),f.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,l/540)+Math.abs(p)*.0018-f.roamSuspension)*(1-Math.pow(.018,i)),f.roamSlip>.38&&Math.random()<i*(3+f.roamSlip*7)){const v=new P(f.roamPos.x-d*3.2,f.roamPos.y+.2,f.roamPos.z-u*3.2);Wd(v,2,f.roamSlip)}const g=Math.abs(f.speed)*i,M=Math.max(1,Math.ceil(g/1.2));let x=!1,h=!1,_=Ki(f.roamPos.x,f.roamPos.z,f.roamPos.y);for(let v=0;v<M;v++)f.roamPos.x+=d*f.speed*i/M,f.roamPos.z+=u*f.speed*i/M,_=Ki(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=_.y+ei,cv(f.roamPos,_)&&(h=!0),lv(f.roamPos,_)&&(x=!0),_=Ki(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=_.y+ei;f.roamPos.x=Oe.clamp(f.roamPos.x,-820,820),f.roamPos.z=Oe.clamp(f.roamPos.z,-1620,480),x&&(f.collisionCooldown<=0&&(ev(new P(f.roamPos.x,f.roamPos.y+.8,f.roamPos.z),e,"IMPACT"),f.collisionCooldown=.38),f.speed*=.28),h&&(f.speed*=.62,f.cameraShake=Math.max(f.cameraShake,.22),f.message="SPLAT!",f.messageTimer=.9),_=Ki(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=_.y+ei,!(_.kind==="ramp"&&_.u>.72&&Dh(_))&&(_.kind==="track"&&Dh(_)||(sv(),Dr(),_t.has("KeyR")&&(Xd(),_t.delete("KeyR"))))}const Wn=2.6;function Lo(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.maxY!=null&&i.y>s.maxY+ei+.45)continue;if(s.radius){const u=s.radius+Wn,p=i.x-s.x,m=i.z-s.z,g=p*p+m*m;if(g>=u*u)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(g));i.x=s.x+p/M*u,i.z=s.z+m/M*u;continue}const r=s.hw+Wn,a=s.hd+Wn,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return t}function $d(i,e=f.roamPos){if(!i)return;const t=(i.crashTimer||0)<=.05;i.crashTimer=Math.max(i.crashTimer||0,1.15+Math.random()*.45),i.waitTimer=Math.max(i.waitTimer||0,.55),i.brakePulse=1;const n=i.maxAvoidOffset||di.streetW*.3,s=i.mesh?.position?.x??i.collider?.x??i.road,r=i.mesh?.position?.z??i.collider?.z??i.along,a=i.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;i.avoidOffset=Oe.clamp((i.avoidOffset||0)+a*n*.9,-n,n),t&&(Ye.trafficCrashes++,i.along-=i.dir*1.8,i.mesh&&(i.mesh.rotation.y+=a*.08),f.mode==="roam"&&(f.cameraShake=Math.max(f.cameraShake,.32),f.message="TRAFFIC CRASH",f.messageTimer=.85))}function rv(i){let e=!1;for(let t=0;t<Ri.length;t++){const n=Ri[t];if(n.maxY!=null&&i.y>n.maxY+ei+.45)continue;const s=n.hw+Wn,r=n.hd+Wn,a=i.x-n.x,o=i.z-n.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,$d(n.actor,i);const c=s-Math.abs(a),l=r-Math.abs(o);c<l?i.x=n.x+(a<0?-s:s):i.z=n.z+(o<0?-r:r)}return e}function av(i,e,t=0){return e.maxY!=null&&i.y>e.maxY+ei+.45?!1:e.radius?Math.hypot(i.x-e.x,i.z-e.z)<e.radius+t:Math.abs(i.x-e.x)<e.hw+t&&Math.abs(i.z-e.z)<e.hd+t}function ov(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,Ye.splats++;const e=Ps.find(t=>!t.visible)||Ps[Ye.splats%Math.max(1,Ps.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(i.x,We(i.x,i.z)+.08,i.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function cv(i,e=null){if(e?.kind!=="ground"||Math.abs(f.speed)<5)return!1;let t=!1;for(const n of Cr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=Wn+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(We(n.x,n.z)+ei))>3.2||(ov(n),t=!0)}return t}function lv(i,e=null){let t=!1;for(let n=0;n<2;n++){const s=Lo(i,Mn),r=e?.kind==="ground"?Lo(i,Zn):!1,a=Lo(i,Di),o=e?.kind==="ground"?rv(i):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function Kd(i){const e=Fe.lookX*1.18,t=Fe.lookY*.58;f.camLookYaw+=(e-f.camLookYaw)*(1-Math.pow(.002,i)),f.camLookPitch+=(t-f.camLookPitch)*(1-Math.pow(.002,i)),f.cameraZoom+=(Fe.zoom-f.cameraZoom)*(1-Math.pow(.018,i))}function cl(i,e,t=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=Oe.lerp(i.x,e.x,r),o=Oe.lerp(i.z,e.z,r),c=Oe.lerp(i.y,e.y,r),l=We(a,o)+t;l>c&&(n=Math.max(n,(l-c)/Math.max(.08,r)))}return n}function hv(i,e){const t=We(i,e);let n=null;const s=Yd(i,e);s&&s.y>t+4&&(n=s);const r=qd(i,e,1e3,!0);return r&&r.y>t+4&&(!n||r.y>n.y)&&(n=r),n}function Da(i,e,t=4){let n=0;for(let s=2;s<=14;s++){const r=s/14,a=Oe.lerp(i.x,e.x,r),o=Oe.lerp(i.z,e.z,r),c=Oe.lerp(i.y,e.y,r),l=hv(a,o);if(!l)continue;const d=l.y+t-c;d>0&&(n=Math.max(n,d/Math.max(.16,r)))}return Math.min(54,n)}function Jd(){const i=f.camYaw+f.camLookYaw,e=Math.sin(i),t=-Math.cos(i),n=Oe.clamp(f.cameraZoom,-.42,.9),s=f.roamPos,r={x:s.x+e*(12-Math.min(n,0)*6),y:s.y+2.6+f.camLookPitch*13.5,z:s.z+t*(12-Math.min(n,0)*6)};Ze.position.y+=cl(r,Ze.position,3.4),Ze.position.y+=Da(r,Ze.position,4.2)}function jd(i){if(window.__freeCam)return;if(Kd(i),Math.abs(f.speed)>Ac){let m=f.roamYaw-f.camYaw;m=Math.atan2(Math.sin(m),Math.cos(m)),f.camYaw+=m*(1-Math.pow(.08,i))}const e=f.camYaw+f.camLookYaw,t=Math.sin(e),n=-Math.cos(e),s=f.roamPos,r=Oe.clamp(f.cameraZoom,-.42,.9),a=Oe.clamp(Math.abs(f.speed)/135,0,1),o=(17+Math.abs(f.speed)*.11+f.roamSlip*3)*(1+r*.72),c=7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+f.camLookPitch*5.8,l=Dd.set(s.x-t*o,s.y+c,s.z-n*o);if(f.cameraShake>.01||f.collisionDrama>.01){const m=f.cameraShake+f.collisionDrama*.42;l.x+=(Math.random()-.5)*m*1.2,l.y+=(Math.random()-.5)*m*.75,l.z+=(Math.random()-.5)*m*1.2}const d=sl.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+f.camLookPitch*13.5,s.z+n*(13+a*8-Math.min(r,0)*6));l.y=Math.max(l.y,We(l.x,l.z)+3.5),l.y+=cl(d,l,3.4),l.y+=Da(d,l,4.2);const u=f.roamSlip>.35?.006:.0026;Ze.position.lerp(l,1-Math.pow(u,i)),Ze.position.y+=Da(d,Ze.position,3.8)*.72,Ln.position.copy(Ze.position),Ln.lookAt(d),Ln.rotateY(Math.PI),Ln.rotateZ(-f.wheelSteer*a*.18+f.roamSlip*Math.sign(f.wheelSteer||1)*.05),Ze.quaternion.slerp(Ln.quaternion,1-Math.pow(.05,i));const p=69+Math.min(13,Math.abs(f.speed)*.075)+f.roamSlip*2.5+r*10;Math.abs(Ze.fov-p)>.02&&(Ze.fov+=(p-Ze.fov)*(1-Math.pow(.01,i)),Ze.updateProjectionMatrix()),f.cameraShake=Math.max(0,f.cameraShake-i*2.4),f.collisionDrama=Math.max(0,f.collisionDrama-i*1.8)}function Qd(i){if(f.mode==="result")return;f.mode="result";const e=Math.max(0,Math.round(f.score-f.damage*9+Math.max(0,220-f.time)*45));e>f.best&&(f.best=e,localStorage.setItem("steel-ribbon-best",String(e))),Qe.best.textContent=`Best score ${f.best}`,Qe.resultText.textContent=`${i} Score ${e}. Time ${Lc(f.time)}. Damage ${Math.round(f.damage)}%.`;const t=Number.isFinite(f.bestLap)?Lc(f.bestLap):"--:--.-";Qe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${f.cleanLandings}</b>
    <b>Hard landings: ${f.hardLandings}</b>
    <b>Recoveries: ${f.recoveries}</b>
    <b>Near edges: ${Math.round(f.nearMisses)}</b>
  `,Qe.result.classList.remove("hidden")}function Ih(i="Craned back to the ribbon"){const e=yt(f.lastSafeS);f.s=f.lastSafeS,f.totalDistance=f.lastSafeDistance,f.lateral=0,f.lateralVel=0,f.y=e.p.y+2.1,f.yVel=0,f.speed=Math.max(16,f.speed*.32),f.grounded=!0,f.cameraShake=1.2,f.message=i,f.messageTimer=1.4,f.recoveries+=1}function ll(i,e){return Oe.clamp(e*i.tangent.y,-48,48)}function dv(i=94){return ce.gaps.map(e=>{const t=yt(e.start),n=yt(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=ll(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Oe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Uh(i,e){f.grounded=!1,f.yVel=ll(i,f.speed),f.airtime=0,e&&(f.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return ll(yt(i),e)},gapJumpReport(i){return dv(i)},sceneryClearanceReport(){return C1()},setSpeed(i){return f.speed=Oe.clamp(i,-14,156-f.damage*.42),gr(),f.speed},setTrackPosition(i,e=f.speed,t=0){const n=yt(i);return f.totalDistance=i,f.s=n.s,f.lastSafeS=n.s,f.lastSafeDistance=i,f.lateral=Oe.clamp(t,-ce.width*.48,ce.width*.48),f.lateralVel=0,f.y=n.p.y+2.1,f.yVel=0,f.grounded=!0,f.speed=Oe.clamp(e,-14,156-f.damage*.42),gr(),{s:f.s,totalDistance:f.totalDistance,speed:f.speed,lateral:f.lateral,y:f.y}},setDamage(i){return f.damage=Oe.clamp(i,0,99),gr(),f.damage},setCourse(i){return ol(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,Ze.position.set(i,e,t),Ze.lookAt(n,s,r),Ze.fov=62,Ze.updateProjectionMatrix(),"freecam"},listCourses(){return is.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:Ma,name:ce.name,length:ce.length,width:ce.width,laps:ce.laps}},probeDown(i,e){const t=new g0(new P(i,400,e),new P(0,-1,0),0,1e3);t.camera=Ze;const n=t.intersectObjects(et.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=Ki(i,e,400);return{x:i,z:e,ground:+We(i,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return Lr.map((i,e)=>{const t=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:i.rampType,mergeS:i.mergeS,exitS:i.exitS,dirSel:i.dirSel,halfW:i.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return Mn.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Zn.filter(e=>e.hw).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const i=Zn.filter(e=>e.hw);return{supports:Cc,pylonColliders:i.length,gaps:ce.gaps.length,sample:i.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const e=[];for(const t of Mn){const n=Wi(t.x,t.z,t.hw*2,t.hd*2,t.maxY);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return e.sort((t,n)=>n.verticalIntrusion-t.verticalIntrusion),{totalBuildings:Mn.length,conflicts:e.length,sample:e.slice(0,i)}},buildingStreetConflictReport(i=12){const e=[];for(const t of Mn){const n=Hi(t.x,t.z,t.hw*2,t.hd*2,0);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:n.axis,road:n.road,overlap:+n.overlap.toFixed(1)})}return e.sort((t,n)=>n.overlap-t.overlap),{totalBuildings:Mn.length,conflicts:e.length,sample:e.slice(0,i)}},rockColliderSample(i=8){return Di.concat(Zn.filter(e=>e.kind==="rock")).slice(0,i).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:Ye.traffic,pedestrians:Ye.pedestrians,pedestriansActive:Cr.filter(e=>e.active).length,turns:Ye.turns,splats:Ye.splats,trafficCrashes:Ye.trafficCrashes,streetLights:Ye.streetLights,trafficLights:Ye.trafficLights,stopSigns:Ye.stopSigns,signs:Ye.signs,roadDetails:{...Ye.roadDetails},buildingArchetypes:{...Ye.buildingArchetypes},zones:{...Ye.zones},openerProps:Ye.openerProps,signSamples:Pa.slice(0,i),types:{...Ye.types},offRoadTraffic:Ri.filter(e=>!ka(e.x,e.z,2)).length,trafficRoutes:Rc.slice(0,i).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Ri.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Cr.filter(e=>e.active).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const i={...Ye.roadDetails},e={...Ye.buildingArchetypes},t={...Ye.zones},n=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(i.crosswalks||0)/8)+Math.min(18,(i.laneArrows||0)/3)+Math.min(14,(i.manholes||0)/4)+Math.min(16,Ye.signs/7)+Math.min(14,Ye.openerProps*1.4)+Math.min(13,n*2.6)).toFixed(1),roadDetails:i,buildingArchetypes:e,zones:t,archetypeKinds:n,zoneKinds:s,openerProps:Ye.openerProps,signs:Ye.signs,streetLights:Ye.streetLights,streetGlowSprites:Qi.streetGlowSprites,waterBlockers:Qi.waterBlockers,lowFogDisks:Qi.lowFogDisks}},objectiveReport(){const i=nn[f.objectiveIndex%Math.max(1,nn.length)];return{total:nn.length,hits:f.objectiveHits,index:f.objectiveIndex,lap:f.objectiveLap,next:i?{x:+i.x.toFixed(1),y:+i.y.toFixed(1),z:+i.z.toFixed(1),label:i.label}:null,collected:nn.filter(e=>e.collected).length,score:Math.round(f.score),boost:+f.boost.toFixed(2)}},drivingFeelReport(){return{speed:+f.speed.toFixed(2),wheelSteer:+(f.wheelSteer||0).toFixed(3),slip:+(f.roamSlip||0).toFixed(3),suspension:+(f.roamSuspension||0).toFixed(3),cameraShake:+(f.cameraShake||0).toFixed(3),collisionDrama:+(f.collisionDrama||0).toFixed(3),collisionHits:f.collisionHits,smokeActive:mr.filter(i=>i.life>0).length,debrisActive:xr.filter(i=>i.life>0).length,sparksActive:pr.filter(i=>i.life>0).length}},vehicleDetailReport(){return{player:{...cn.userData.detailReport},racer:{...es.userData.detailReport},namedParts:cn.children.filter(i=>i.name).map(i=>i.name).slice(0,24)}},advanceCityLife(i=1){const e=.03333333333333333;let t=Math.max(0,Math.min(i,60));for(;t>0;){const n=Math.min(e,t);Bd(n),t-=n}return this.cityLifeReport(12)},setRoamPose(i,e,t){const n=Ki(i,e,f.roamPos.y);f.roamPos.set(i,n.y+ei,e),f.roamYaw=t,f.camYaw=t,f.camLookYaw=0,f.camLookPitch=0,f.wheelSteer=0,f.speed=0,Dr();const s=Math.sin(f.roamYaw),r=-Math.cos(f.roamYaw);return Ze.position.set(f.roamPos.x-s*17,f.roamPos.y+7.2,f.roamPos.z-r*17),Jd(),Ze.lookAt(f.roamPos.x+s*13,f.roamPos.y+2.45,f.roamPos.z+r*13),Ze.fov=69,Ze.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,e=0,t=Fe.zoom,n=30){Fe.lookX=Oe.clamp(i,-1,1),Fe.lookY=Oe.clamp(e,-1,1),Fe.zoom=Oe.clamp(t,-.42,.9);for(let s=0;s<n;s++)f.mode==="roam"?jd(1/60):hl(1/60);return this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(f.mode!=="roam")return this.roamReport();const s={steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake};Fe.steer=Oe.clamp(e,-1,1),Fe.throttle=Oe.clamp(t,0,1),Fe.brake=Oe.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(Zd(o),f.mode!=="roam")break;a-=o}return Fe.steer=s.steer,Fe.throttle=s.throttle,Fe.brake=s.brake,this.roamReport()},simulateTrackDrive(i=1){if(f.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(i,8));for(;t>0;){const n=Math.min(e,t);if(eu(n),f.mode!=="race")break;t-=n}return this.roamReport()},roamReport(){const i=f.roamPos,e=Dd.set(0,0,-1).applyQuaternion(cn.quaternion).normalize(),t=sl.set(Math.sin(f.roamYaw),0,-Math.cos(f.roamYaw)).normalize(),n=Ki(i.x,i.z,i.y);return{mode:f.mode,s:+f.s.toFixed(2),totalDistance:+f.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+f.roamYaw.toFixed(3),camYaw:+f.camYaw.toFixed(3),speed:+f.speed.toFixed(2),groundXZ:+We(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+Ze.position.x.toFixed(2),camY:+Ze.position.y.toFixed(2),camZ:+Ze.position.z.toFixed(2),fov:+Ze.fov.toFixed(2),lookYaw:+f.camLookYaw.toFixed(3),lookPitch:+f.camLookPitch.toFixed(3),cameraZoom:+f.cameraZoom.toFixed(3),cameraSightLift:+cl({x:i.x,y:i.y+2.6,z:i.z},{x:Ze.position.x,y:Ze.position.y,z:Ze.position.z},2.4).toFixed(3),elevatedCameraLift:+Da({x:i.x,y:i.y+2.6,z:i.z},{x:Ze.position.x,y:Ze.position.y,z:Ze.position.z},3.8).toFixed(3),colliders:Mn.length+Zn.length+Di.length+Ri.length,insideBuilding:Mn.concat(Zn,Di,Ri).some(s=>av(i,s)),objectiveHits:f.objectiveHits,objectiveIndex:f.objectiveIndex,collisionHits:f.collisionHits,slip:+(f.roamSlip||0).toFixed(3),suspension:+(f.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:cn.userData.frontWheels?+cn.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function eu(i){if(f.mode!=="race")return;f.time+=i,f.freeRun&&(f.damage=0);const e=f.breakdownTimer>0;e&&(f.breakdownTimer-=i,f.breakdownTimer<=0&&(f.damage=55,f.message="Patched up — back on it",f.messageTimer=1.2));const t=Math.max(_t.has("KeyW")||_t.has("ArrowUp")?1:0,Fe.throttle),n=Math.max(_t.has("KeyS")||_t.has("ArrowDown")?1:0,Fe.brake),r=Oe.clamp((_t.has("KeyD")||_t.has("ArrowRight")?1:0)-(_t.has("KeyA")||_t.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*Id,a=t>.03&&!e,o=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&a&&f.grounded,c=yt(f.s),l=c.p.y+2.1,d=Math.abs(f.speed);if(a){const v=f.speed<0?40:0;f.speed+=((o?68:40)+v)*t*i}if(n>.03){const v=f.speed>1.2?70:26;f.speed-=v*n*i}const u=f.grounded?.0024:.0011;f.speed-=u*f.speed*d*i,d>.08?f.speed-=Math.sign(f.speed)*(f.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(f.speed=0),f.speed=Oe.clamp(f.speed,-16,156-f.damage*.8),e&&(f.speed=Math.min(f.speed,14)),f.boosting=o,o?(f.boost=Math.max(0,f.boost-i*.21),f.score+=28*i):f.boost=Math.min(1,f.boost+i*(f.grounded?.045:.018));const p=14+d*.12;f.lateralVel-=r*p*i,f.lateralVel-=f.lateralVel*(f.grounded?3.4:.7)*i,f.lateral+=f.lateralVel*i;const m=Li(f.s),g=Math.abs(f.lateral)<ce.width*.52,M=!m&&g;if(f.grounded&&(!M||Math.abs(f.lateral)>ce.width*.5)&&Uh(c,g?"":"Edge slip"),f.grounded){const v=Math.sin(f.time*18)*Math.min(.22,Math.abs(f.speed)/700);f.y=Oe.lerp(f.y,l+v,.5),f.yVel=0,f.lastSafeS=f.s,f.lastSafeDistance=f.totalDistance,f.score+=Math.max(0,f.speed)*i*.34,Math.abs(f.lateral)>ce.width*.42&&(f.damage+=i*(1.2+Math.abs(f.speed)*.035),f.cameraShake=Math.max(f.cameraShake,.24),f.nearMisses+=i*.8,Math.random()<i*5&&Rr(c.p.clone().addScaledVector(c.side,Math.sign(f.lateral)*ce.width*.55).addScaledVector(on,1.2),4))}else{f.yVel-=31*i,f.y+=f.yVel*i,f.airtime+=i,f.score+=i*11;const v=yt(f.s),y=v.p.y+2.1;if(!Li(f.s)&&Math.abs(f.lateral)<ce.width*.55&&f.y<=y&&f.yVel<0){const T=-f.yVel,R=Math.abs(f.lateral)<ce.width*.34&&T<30;f.y=y,f.grounded=!0,f.yVel=0,f.lastSafeS=f.s,f.lastSafeDistance=f.totalDistance,f.damage+=Math.max(0,T-17)*.82+Math.max(0,Math.abs(f.lateral)-ce.width*.36)*1.8,f.score+=R?260+f.airtime*85:Math.max(30,120-T),f.cameraShake=Math.max(f.cameraShake,T/34),f.message=R?"Clean landing":"Hard landing",f.messageTimer=.9,R?f.cleanLandings+=1:f.hardLandings+=1,Pc(T),Rr(v.p.clone().addScaledVector(v.side,f.lateral).addScaledVector(on,.7),R?7:24),f.airtime=0}f.y<-55&&(f.damage+=28,Ih("Track crew recovery"))}const x=f.totalDistance;f.totalDistance+=f.speed*i,f.s=(f.totalDistance%ce.length+ce.length)%ce.length;const h=Lr.find(v=>v.rampType==="off");if(f.freeRun&&h&&Th(x,f.totalDistance,h.exitS)&&f.lateral*h.dirSel>ce.width*.2&&iv(h))return;const _=Math.floor(f.totalDistance/ce.length)+1;if(_>f.lap){const v=f.time-f.lapStartTime;f.splitTimes.push(v),f.bestLap=Math.min(f.bestLap,v),f.lapStartTime=f.time,f.lap=_,f.score+=1200,f.message=f.practice?`Lap ${f.lap}`:f.lap<=ce.laps?`Lap ${f.lap}`:"Season race complete",f.messageTimer=1.4,!f.practice&&f.lap>ce.laps&&Qd(f.totalDistance>=f.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const v of ce.gaps)Th(x,f.totalDistance,v.start)&&(f.message=v.name,f.messageTimer=1.1,f.grounded&&Uh(yt(v.start),v.name));f.damage=Oe.clamp(f.damage,0,100),!f.freeRun&&f.damage>=90&&f.breakdownTimer<=0&&(f.breakdownTimer=2.6,f.message="Chassis cracked — limping to repair",f.messageTimer=1.6,f.cameraShake=Math.max(f.cameraShake,.8),Pc(40),f.damage=90),_t.has("KeyR")&&(f.damage=Math.min(99,f.damage+8),Ih("Manual reset"),_t.delete("KeyR"))}function uv(i){if(f.mode==="race"&&!f.practice){const r=f.totalDistance-f.rivalDistance,a=Oe.clamp(r*.06,-12,16),o=Math.sin(f.time*.6)*5;f.rivalSpeed=Oe.clamp(92+a+o,70,120),f.rivalDistance+=f.rivalSpeed*i,f.rivalDistance>=ce.length*ce.laps&&f.lap<=ce.laps&&Qd("Crowther reached the gantry first.")}f.rivalS=(f.rivalDistance%ce.length+ce.length)%ce.length;const e=yt(f.rivalS),t=e.p.clone().addScaledVector(on,1.4).addScaledVector(e.side,Math.sin(f.rivalS*.02)*1.4);es.position.copy(t);const n=new Pt().makeBasis(e.side,on,e.tangent);es.quaternion.setFromRotationMatrix(n);const s=Math.abs(f.rivalDistance-f.totalDistance)<26;es.visible=(f.mode==="race"||f.mode==="paused")&&!f.practice&&!s}function hl(i){if(window.__freeCam)return;Kd(i);const e=yt(f.s),t=e.side.clone().multiplyScalar(f.lateral),n=e.p.clone().add(t);n.y=f.y;const s=f.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),Ze.position.copy(n);const r=Math.abs(f.speed),a=68+Math.min(10,r*.055)+(_t.has("ShiftLeft")||_t.has("ShiftRight")?3:0)+f.cameraZoom*12;Math.abs(Ze.fov-a)>.02&&(Ze.fov+=(a-Ze.fov)*(1-Math.pow(.004,i)),Ze.updateProjectionMatrix());const o=yt(f.s+34+f.speed*.16),c=o.p.clone().addScaledVector(o.side,f.lateral*.45);c.y+=1.7+f.camLookPitch*12+Math.sin(f.time*8)*Math.min(.2,r/680),Ln.position.copy(Ze.position),Ln.lookAt(c),Ln.rotateY(Math.PI),Ln.rotateY(-f.camLookYaw),Ln.rotateZ(-e.bank*.72-f.lateralVel*.006),Ln.rotateX(e.grade*.18+(f.grounded?0:Oe.clamp(f.yVel,-30,30)*-.006)),Ze.quaternion.slerp(Ln.quaternion,1-Math.pow(8e-4,i)),f.cameraShake=Math.max(0,f.cameraShake-i*1.9);const l=sl.set(0,0,-1).applyQuaternion(Ze.quaternion).normalize();window.__steelRibbonTelemetry={mode:f.mode,s:f.s,totalDistance:f.totalDistance,rivalDistance:f.rivalDistance,speed:f.speed,lap:f.lap,score:f.score,damage:f.damage,y:f.y,yVel:f.yVel,grounded:f.grounded,input:{steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const Ji={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},rr=[28,54,82,110,134,156];function fv(){const i=Math.abs(f.speed);let e=1;for(let o=0;o<rr.length;o++)i>rr[o]&&(e=o+2);e=Math.min(e,rr.length);const t=e===1?0:rr[e-2],n=rr[e-1],s=n>t?Oe.clamp((i-t)/(n-t),0,1):0,r=e===1?Ji.idle:Ji.postShift;let a=r+s*(Ji.shift-r);return i<.4&&(a=Ji.idle),{gear:e,rpm:a}}let Fh=performance.now(),Do=0,Io=0;function tu(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function pv(i,e){const t=Qe.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=tu(t),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const M=g/l,x=o(M),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const _=c(x,a-a*.02),v=c(x,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(_[0],_[1]),n.lineTo(v[0],v[1]),n.stroke(),h){const y=c(x,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),y[0],y[1])}}const d=Oe.clamp(i/l,0,1),u=o(d),p=c(u,a-a*.06),m=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(m[0],m[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function mv(i,e){const t=Qe.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=tu(t),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Oe.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let M=0;M<=l;M+=3){const x=M/l,h=o(x),_=M%6===0;n.strokeStyle=M>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=_?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=c(h,a-a*.02),y=c(h,a-a*(_?.17:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(y[0],y[1]),n.stroke(),_){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(M),E[0],E[1])}}const p=o(d),m=c(p,a-a*.06),g=c(p+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function xv(i,e){const t=Qe.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=Ji.max,u=v=>Math.PI-v*Math.PI,p=(v,y)=>[o+Math.cos(v)*y,c-Math.sin(v)*y];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const m=Ji.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(m)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let v=0;v<=9;v++){const y=v/9,E=u(y),T=v*1e3>=Ji.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const R=p(E,l-l*.02),C=p(E,l-l*.18);n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(C[0],C[1]),n.stroke();const b=p(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(v),b[0],b[1]),v<9){const S=u((v+.5)/9),L=p(S,l-l*.02),F=p(S,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(L[0],L[1]),n.lineTo(F[0],F[1]),n.stroke()}}const g=Oe.clamp(i/d,0,1),M=u(g),x=p(M,l-l*.06),h=p(M+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(x[0],x[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const _=f.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(_,o,c+l*.02)}function gr(){ce.length*ce.laps;const i=wh(f.practice?f.totalDistance%ce.length:f.totalDistance),e=f.practice?0:wh(f.rivalDistance),t=f.practice?"SOLO":f.totalDistance>=f.rivalDistance?"P1":"P2";t!==f.leadState&&f.mode==="race"&&(f.leadState=t,f.practice||(f.message=t==="P1"?"You took the lead":"Crowther ahead",f.messageTimer=.95)),Qe.damage.style.width=`${Math.round(f.damage)}%`,Qe.lap.textContent=f.practice?`LAP ${f.lap}`:`${Math.min(f.lap,ce.laps)}/${ce.laps}`,Qe.timer.textContent=Lc(f.time);const n=f.mode==="roam";Qe.score.textContent=n?`Gates ${f.objectiveHits}/${nn.length}  Score ${Math.round(f.score)}`:`Score ${Math.round(f.score)}`;const s=f.mode==="race"||f.mode==="paused"||n;if(Qe.position.textContent=n?"FREE ROAM":f.freeRun?"FREE RUN":f.practice?"PRACTICE":`${t} DIV 4`,n&&nn.length){const d=nn[f.objectiveIndex%nn.length];Qe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}Qe.hud.style.display=s?"flex":"none",Qe.raceStrip.style.display=f.mode==="race"||f.mode==="paused"?"grid":"none",Qe.touchControls.style.display=s?"":"none",Qe.playerProgress.style.width=`${Math.round(i*100)}%`,Qe.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=fv();f.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-Fh)/1e3);Fh=a;const c=1-Math.exp(-o*(r.rpm>f.tachRpm?10:6));f.tachRpm+=(r.rpm-f.tachRpm)*c,xv(f.tachRpm,r.gear);const l=Math.abs(f.speed)*2.25;Do+=(l-Do)*(1-Math.exp(-o*8)),Io+=(f.boost-Io)*(1-Math.exp(-o*9)),pv(Do,f.speed<-.5),mv(Io,f.boosting),Qe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(f.speed)-44)/150)),Qe.damageFx.style.opacity=f.damage<18?0:Math.min(.72,(f.damage-18)/82),f.mode==="paused"?(Qe.centerMessage.textContent="Paused",Qe.centerMessage.classList.remove("hidden")):f.messageTimer>0?(Qe.centerMessage.textContent=f.message,Qe.centerMessage.classList.remove("hidden")):Qe.centerMessage.classList.add("hidden")}function Lc(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function nu(){const i=p1.getDelta(),e=Math.min(.033,i);f.messageTimer>0&&(f.messageTimer-=e),f.mode==="roam"?(Zd(e),jd(e)):(eu(e),uv(e),hl(e)),tv(e),Bd(e),gr(),nv(),cr.uniforms.uTime.value+=e,cr.uniforms.uSpeed.value=Math.min(1,Math.abs(f.speed)/150);const n=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&(f.mode==="race"||f.mode==="roam")?1:Math.min(.75,f.roamSlip*.55+f.collisionDrama*.6);cr.uniforms.uBoost.value+=(n-cr.uniforms.uBoost.value)*Math.min(1,e*6),Hs.render(),requestAnimationFrame(nu)}window.addEventListener("keydown",i=>{_t.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&f.mode==="race"?(f.mode="paused",_t.clear(),Ia()):i.code==="KeyP"&&f.mode==="paused"?f.mode="race":i.code==="Escape"&&(f.mode==="race"||f.mode==="paused"||f.mode==="roam")&&(f.mode="menu",Ia(),cn.visible=!1,Yn&&(Yn.visible=!0),document.body.classList.remove("roam-mode"),Qe.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>_t.delete(i.code));window.addEventListener("resize",()=>{Ze.aspect=window.innerWidth/window.innerHeight,Ze.updateProjectionMatrix(),Qt.setSize(window.innerWidth,window.innerHeight),Hs.setSize(window.innerWidth,window.innerHeight),Gd.setSize(window.innerWidth,window.innerHeight)});Qe.startBtn.addEventListener("click",()=>Va(!1));Qe.practiceBtn.addEventListener("click",()=>Va(!0));Qe.freeRunBtn.addEventListener("click",()=>Va(!0,!0));Qe.roamBtn.addEventListener("click",()=>Xd());Qe.againBtn.addEventListener("click",()=>Va(!1));Qe.courseButtons.forEach(i=>{i.addEventListener("click",()=>ol(Number(i.dataset.course)))});function iu(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function Ia(){Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.lookX=0,Fe.lookY=0,Fe.zoom=0,Fe.lookPointer=null,Fe.drivePointer=null,Fe.pinchStartDistance=0,Fe.pinchStartZoom=0;for(const i of Qe.touchControls.querySelectorAll(".touch-stick"))iu(i)}function fa(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=Oe.clamp(e.clientX-(t.left+t.width/2),-n,n),r=Oe.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Fe.lookX=Oe.clamp(s/n,-1,1),Fe.lookY=Oe.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Fe.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Fe.lookY*n)}px`);else{const o=Oe.clamp(s/n,-1,1),c=Oe.clamp(-r/n,-1,1);Fe.steer=o,Fe.throttle=Math.max(0,c),Fe.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function Nh(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function Oh(i,e){e==="look"?(Fe.lookX=0,Fe.lookY=0,Fe.lookPointer=null):(Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.drivePointer=null),iu(i)}function gv(i,e){return Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY)}function su(i,e=!1){if(i.touches.length<2){Fe.pinchStartDistance=0;return}const t=gv(i.touches[0],i.touches[1]);if(e||!(Fe.pinchStartDistance>0)){Fe.pinchStartDistance=t,Fe.pinchStartZoom=Fe.zoom;return}const n=Math.max(.2,t/Fe.pinchStartDistance);Fe.zoom=Oe.clamp(Fe.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of Qe.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),La(),f.mode==="paused"&&(f.mode="race"),e==="look"&&(Fe.lookPointer=s.pointerId),e==="drive"&&(Fe.drivePointer=s.pointerId),fa(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&(s.preventDefault(),fa(i,s))},{passive:!1});const t=s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&Oh(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),La(),f.mode==="paused"&&(f.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Fe.lookPointer=r.identifier),e==="drive"&&(Fe.drivePointer=r.identifier),fa(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer,a=Nh(s,r);a&&(s.preventDefault(),fa(i,a))},{passive:!1});const n=s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer;Nh(s,r)&&(s.preventDefault(),Oh(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Qe.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),La(),_t.add(e),i.setPointerCapture(n.pointerId)});const t=()=>_t.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}Pr.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),su(i,!0))},{passive:!1});Pr.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),su(i))},{passive:!1});Pr.addEventListener("touchend",i=>{i.touches.length<2&&(Fe.pinchStartDistance=0)},{passive:!1});Pr.addEventListener("touchcancel",()=>{Fe.pinchStartDistance=0},{passive:!1});const vv=yt(f.s);f.y=vv.p.y+2.1;f.lastSafeS=f.s;f.lastSafeDistance=f.totalDistance;hl(.016);gr();nu();
