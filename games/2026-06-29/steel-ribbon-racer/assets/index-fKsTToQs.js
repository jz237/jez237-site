(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Lh="181",pp=0,Ad=1,mp=2,uf=1,ff=2,Ji=3,Ss=0,In=1,yt=2,Ui=0,Ca=1,si=2,Cd=3,Rd=4,xp=5,Bs=100,gp=101,vp=102,Mp=103,_p=104,yp=200,bp=201,wp=202,Sp=203,bc=204,wc=205,Tp=206,Ep=207,Ap=208,Cp=209,Rp=210,Pp=211,Lp=212,Dp=213,Ip=214,Sc=0,Tc=1,Ec=2,Ua=3,Ac=4,Cc=5,Rc=6,Pc=7,Dh=0,Up=1,Fp=2,ys=0,pf=1,mf=2,xf=3,Ih=4,gf=5,vf=6,Mf=7,_f=300,Fa=301,za=302,Lc=303,Dc=304,fl=306,zn=1e3,es=1001,Ic=1002,Kn=1003,zp=1004,eo=1005,ai=1006,Cl=1007,Gs=1008,Vi=1009,yf=1010,bf=1011,Tr=1012,Uh=1013,Ks=1014,Li=1015,Fi=1016,Fh=1017,zh=1018,Er=1020,wf=35902,Sf=35899,Tf=1021,Ef=1022,vi=1023,Ar=1026,Cr=1027,Nh=1028,Oh=1029,kh=1030,Bh=1031,Vh=1033,ko=33776,Bo=33777,Vo=33778,Go=33779,Uc=35840,Fc=35841,zc=35842,Nc=35843,Oc=36196,kc=37492,Bc=37496,Vc=37808,Gc=37809,Hc=37810,Wc=37811,Xc=37812,qc=37813,Yc=37814,$c=37815,Zc=37816,Kc=37817,Jc=37818,jc=37819,Qc=37820,eh=37821,th=36492,nh=36494,ih=36495,sh=36283,ah=36284,rh=36285,oh=36286,Np=3200,Op=3201,Gh=0,kp=1,gs="",Lt="srgb",Na="srgb-linear",$o="linear",Wt="srgb",ia=7680,Pd=519,Bp=512,Vp=513,Gp=514,Af=515,Hp=516,Wp=517,Xp=518,qp=519,lh=35044,Ld="300 es",Di=2e3,Zo=2001;function Cf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ko(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yp(){const n=Ko("canvas");return n.style.display="block",n}const Dd={};function Jo(...n){const e="THREE."+n.shift();console.log(e,...n)}function gt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function an(...n){const e="THREE."+n.shift();console.error(e,...n)}function Rr(...n){const e=n.join(" ");e in Dd||(Dd[e]=!0,gt(...n))}function $p(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class Ga{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Id=1234567;const fr=Math.PI/180,Pr=180/Math.PI;function zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Cn[n&255]+Cn[n>>8&255]+Cn[n>>16&255]+Cn[n>>24&255]+"-"+Cn[e&255]+Cn[e>>8&255]+"-"+Cn[e>>16&15|64]+Cn[e>>24&255]+"-"+Cn[t&63|128]+Cn[t>>8&255]+"-"+Cn[t>>16&255]+Cn[t>>24&255]+Cn[i&255]+Cn[i>>8&255]+Cn[i>>16&255]+Cn[i>>24&255]).toLowerCase()}function Ct(n,e,t){return Math.max(e,Math.min(t,n))}function Hh(n,e){return(n%e+e)%e}function Zp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Kp(n,e,t){return n!==e?(t-n)/(e-n):0}function pr(n,e,t){return(1-t)*n+t*e}function Jp(n,e,t,i){return pr(n,e,1-Math.exp(-t*i))}function jp(n,e=1){return e-Math.abs(Hh(n,e*2)-e)}function Qp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function em(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function tm(n,e){return n+Math.floor(Math.random()*(e-n+1))}function nm(n,e){return n+Math.random()*(e-n)}function im(n){return n*(.5-Math.random())}function sm(n){n!==void 0&&(Id=n);let e=Id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function am(n){return n*fr}function rm(n){return n*Pr}function om(n){return(n&n-1)===0&&n!==0}function lm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function cm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function hm(n,e,t,i,s){const a=Math.cos,r=Math.sin,l=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),u=a((e-i)/2),p=r((e-i)/2),m=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(l*d,c*u,c*p,l*h);break;case"YZY":n.set(c*p,l*d,c*u,l*h);break;case"ZXZ":n.set(c*u,c*p,l*d,l*h);break;case"XZX":n.set(l*d,c*x,c*m,l*h);break;case"YXY":n.set(c*m,l*d,c*x,l*h);break;case"ZYZ":n.set(c*x,c*m,l*d,l*h);break;default:gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Xt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const me={DEG2RAD:fr,RAD2DEG:Pr,generateUUID:zi,clamp:Ct,euclideanModulo:Hh,mapLinear:Zp,inverseLerp:Kp,lerp:pr,damp:Jp,pingpong:jp,smoothstep:Qp,smootherstep:em,randInt:tm,randFloat:nm,randFloatSpread:im,seededRandom:sm,degToRad:am,radToDeg:rm,isPowerOfTwo:om,ceilPowerOfTwo:lm,floorPowerOfTwo:cm,setQuaternionFromProperEuler:hm,normalize:Xt,denormalize:mi};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ct(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ns{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,l){let c=i[s+0],h=i[s+1],d=i[s+2],u=i[s+3],p=a[r+0],m=a[r+1],x=a[r+2],M=a[r+3];if(l<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(l>=1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(u!==M||c!==p||h!==m||d!==x){let g=c*p+h*m+d*x+u*M;g<0&&(p=-p,m=-m,x=-x,M=-M,g=-g);let f=1-l;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);f=Math.sin(f*y)/v,l=Math.sin(l*y)/v,c=c*f+p*l,h=h*f+m*l,d=d*f+x*l,u=u*f+M*l}else{c=c*f+p*l,h=h*f+m*l,d=d*f+x*l,u=u*f+M*l;const y=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=y,h*=y,d*=y,u*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const l=i[s],c=i[s+1],h=i[s+2],d=i[s+3],u=a[r],p=a[r+1],m=a[r+2],x=a[r+3];return e[t]=l*x+d*u+c*m-h*p,e[t+1]=c*x+d*p+h*u-l*m,e[t+2]=h*x+d*m+l*p-c*u,e[t+3]=d*x-l*u-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,l=Math.cos,c=Math.sin,h=l(i/2),d=l(s/2),u=l(a/2),p=c(i/2),m=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"YXZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"ZXY":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"ZYX":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"YZX":this._x=p*d*u+h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u-p*m*x;break;case"XZY":this._x=p*d*u-h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u+p*m*x;break;default:gt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],l=t[5],c=t[9],h=t[2],d=t[6],u=t[10],p=i+l+u;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(a-h)*m,this._z=(r-s)*m}else if(i>l&&i>u){const m=2*Math.sqrt(1+i-l-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+h)/m}else if(l>u){const m=2*Math.sqrt(1+l-i-u);this._w=(a-h)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-i-l);this._w=(r-s)/m,this._x=(a+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,l=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*l+s*h-a*c,this._y=s*d+r*c+a*l-i*h,this._z=a*d+r*h+i*c-s*l,this._w=r*d-i*l-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,l=this.dot(e);l<0&&(i=-i,s=-s,a=-a,r=-r,l=-l);let c=1-t;if(l<.9995){const h=Math.acos(l),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ud.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ud.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,l=e.z,c=e.w,h=2*(r*s-l*i),d=2*(l*t-a*s),u=2*(a*i-r*t);return this.x=t+c*h+r*u-l*d,this.y=i+c*d+l*h-a*u,this.z=s+c*u+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this.z=Ct(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this.z=Ct(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ct(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,l=t.y,c=t.z;return this.x=s*c-a*l,this.y=a*r-i*c,this.z=i*l-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Rl.copy(this).projectOnVector(e),this.sub(Rl)}reflect(e){return this.sub(Rl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Rl=new P,Ud=new ns;class Et{constructor(e,t,i,s,a,r,l,c,h){Et.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,l,c,h)}set(e,t,i,s,a,r,l,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=l,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],l=i[3],c=i[6],h=i[1],d=i[4],u=i[7],p=i[2],m=i[5],x=i[8],M=s[0],g=s[3],f=s[6],y=s[1],v=s[4],_=s[7],E=s[2],T=s[5],C=s[8];return a[0]=r*M+l*y+c*E,a[3]=r*g+l*v+c*T,a[6]=r*f+l*_+c*C,a[1]=h*M+d*y+u*E,a[4]=h*g+d*v+u*T,a[7]=h*f+d*_+u*C,a[2]=p*M+m*y+x*E,a[5]=p*g+m*v+x*T,a[8]=p*f+m*_+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],l=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*l*h-i*a*d+i*l*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],l=e[5],c=e[6],h=e[7],d=e[8],u=d*r-l*h,p=l*c-d*a,m=h*a-r*c,x=t*u+i*p+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=u*M,e[1]=(s*h-d*i)*M,e[2]=(l*i-s*r)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*a-l*t)*M,e[6]=m*M,e[7]=(i*c-h*t)*M,e[8]=(r*t-i*a)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,l){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*l)+r+e,-s*h,s*c,-s*(-h*r+c*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(Pl.makeScale(e,t)),this}rotate(e){return this.premultiply(Pl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Pl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Pl=new Et,Fd=new Et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zd=new Et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dm(){const n={enabled:!0,workingColorSpace:Na,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===Wt&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Wt&&(s.r=Ra(s.r),s.g=Ra(s.g),s.b=Ra(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gs?$o:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Rr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Rr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Na]:{primaries:e,whitePoint:i,transfer:$o,toXYZ:Fd,fromXYZ:zd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:Wt,toXYZ:Fd,fromXYZ:zd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}const Ft=dm();function ts(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ra(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let sa;class um{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{sa===void 0&&(sa=Ko("canvas")),sa.width=e.width,sa.height=e.height;const s=sa.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=sa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ko("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=ts(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ts(t[i]/255)*255):t[i]=ts(t[i]);return{data:t,width:e.width,height:e.height}}else return gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let fm=0;class Wh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,l=s.length;r<l;r++)s[r].isDataTexture?a.push(Ll(s[r].image)):a.push(Ll(s[r]))}else a=Ll(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Ll(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?um.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(gt("Texture: Unable to serialize Texture."),{})}let pm=0;const Dl=new P;class Un extends Ga{constructor(e=Un.DEFAULT_IMAGE,t=Un.DEFAULT_MAPPING,i=es,s=es,a=ai,r=Gs,l=vi,c=Vi,h=Un.DEFAULT_ANISOTROPY,d=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=zi(),this.name="",this.source=new Wh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Dl).x}get height(){return this.source.getSize(Dl).y}get depth(){return this.source.getSize(Dl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){gt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){gt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_f)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case es:e.x=e.x<0?0:1;break;case Ic:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case es:e.y=e.y<0?0:1;break;case Ic:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Un.DEFAULT_IMAGE=null;Un.DEFAULT_MAPPING=_f;Un.DEFAULT_ANISOTROPY=1;class Yt{constructor(e=0,t=0,i=0,s=1){Yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],u=c[8],p=c[1],m=c[5],x=c[9],M=c[2],g=c[6],f=c[10];if(Math.abs(d-p)<.01&&Math.abs(u-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(u+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,_=(m+1)/2,E=(f+1)/2,T=(d+p)/4,C=(u+M)/4,R=(x+g)/4;return v>_&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=T/i,a=C/i):_>E?_<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),i=T/s,a=R/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=C/a,s=R/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(u-M)*(u-M)+(p-d)*(p-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(u-M)/y,this.z=(p-d)/y,this.w=Math.acos((h+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this.z=Ct(this.z,e.z,t.z),this.w=Ct(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this.z=Ct(this.z,e,t),this.w=Ct(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ct(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mm extends Ga{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ai,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Yt(0,0,e,t),this.scissorTest=!1,this.viewport=new Yt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Un(s);this.textures=[];const r=i.count;for(let l=0;l<r;l++)this.textures[l]=a.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ai,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Wh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _i extends mm{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rf extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xm extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ea{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ci.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ci.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ci.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,l=a.count;r<l;r++)e.isMesh===!0?e.getVertexPosition(r,ci):ci.fromBufferAttribute(a,r),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),to.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),to.copy(i.boundingBox)),to.applyMatrix4(e.matrixWorld),this.union(to)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ka),no.subVectors(this.max,Ka),aa.subVectors(e.a,Ka),ra.subVectors(e.b,Ka),oa.subVectors(e.c,Ka),ss.subVectors(ra,aa),as.subVectors(oa,ra),Ps.subVectors(aa,oa);let t=[0,-ss.z,ss.y,0,-as.z,as.y,0,-Ps.z,Ps.y,ss.z,0,-ss.x,as.z,0,-as.x,Ps.z,0,-Ps.x,-ss.y,ss.x,0,-as.y,as.x,0,-Ps.y,Ps.x,0];return!Il(t,aa,ra,oa,no)||(t=[1,0,0,0,1,0,0,0,1],!Il(t,aa,ra,oa,no))?!1:(io.crossVectors(ss,as),t=[io.x,io.y,io.z],Il(t,aa,ra,oa,no))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xi=[new P,new P,new P,new P,new P,new P,new P,new P],ci=new P,to=new ea,aa=new P,ra=new P,oa=new P,ss=new P,as=new P,Ps=new P,Ka=new P,no=new P,io=new P,Ls=new P;function Il(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Ls.fromArray(n,a);const l=s.x*Math.abs(Ls.x)+s.y*Math.abs(Ls.y)+s.z*Math.abs(Ls.z),c=e.dot(Ls),h=t.dot(Ls),d=i.dot(Ls);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>l)return!1}return!0}const gm=new ea,Ja=new P,Ul=new P;class Ha{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):gm.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ja.subVectors(e,this.center);const t=Ja.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ja,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ul.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ja.copy(e.center).add(Ul)),this.expandByPoint(Ja.copy(e.center).sub(Ul))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const qi=new P,Fl=new P,so=new P,rs=new P,zl=new P,ao=new P,Nl=new P;class Xh{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Fl.copy(e).add(t).multiplyScalar(.5),so.copy(t).sub(e).normalize(),rs.copy(this.origin).sub(Fl);const a=e.distanceTo(t)*.5,r=-this.direction.dot(so),l=rs.dot(this.direction),c=-rs.dot(so),h=rs.lengthSq(),d=Math.abs(1-r*r);let u,p,m,x;if(d>0)if(u=r*c-l,p=r*l-c,x=a*d,u>=0)if(p>=-x)if(p<=x){const M=1/d;u*=M,p*=M,m=u*(u+r*p+2*l)+p*(r*u+p+2*c)+h}else p=a,u=Math.max(0,-(r*p+l)),m=-u*u+p*(p+2*c)+h;else p=-a,u=Math.max(0,-(r*p+l)),m=-u*u+p*(p+2*c)+h;else p<=-x?(u=Math.max(0,-(-r*a+l)),p=u>0?-a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h):p<=x?(u=0,p=Math.min(Math.max(-a,-c),a),m=p*(p+2*c)+h):(u=Math.max(0,-(r*a+l)),p=u>0?a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h);else p=r>0?-a:a,u=Math.max(0,-(r*p+l)),m=-u*u+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Fl).addScaledVector(so,p),m}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const i=qi.dot(this.direction),s=qi.dot(qi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),l=i-r,c=i+r;return c<0?null:l<0?this.at(c,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,l,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),d>=0?(a=(e.min.y-p.y)*d,r=(e.max.y-p.y)*d):(a=(e.max.y-p.y)*d,r=(e.min.y-p.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(l=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(l=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),i>c||l>s)||((l>i||i!==i)&&(i=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,i,s,a){zl.subVectors(t,e),ao.subVectors(i,e),Nl.crossVectors(zl,ao);let r=this.direction.dot(Nl),l;if(r>0){if(s)return null;l=1}else if(r<0)l=-1,r=-r;else return null;rs.subVectors(this.origin,e);const c=l*this.direction.dot(ao.crossVectors(rs,ao));if(c<0)return null;const h=l*this.direction.dot(zl.cross(rs));if(h<0||c+h>r)return null;const d=-l*rs.dot(Nl);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _t{constructor(e,t,i,s,a,r,l,c,h,d,u,p,m,x,M,g){_t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,l,c,h,d,u,p,m,x,M,g)}set(e,t,i,s,a,r,l,c,h,d,u,p,m,x,M,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=l,f[13]=c,f[2]=h,f[6]=d,f[10]=u,f[14]=p,f[3]=m,f[7]=x,f[11]=M,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/la.setFromMatrixColumn(e,0).length(),a=1/la.setFromMatrixColumn(e,1).length(),r=1/la.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),l=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const p=r*d,m=r*u,x=l*d,M=l*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=m+x*h,t[5]=p-M*h,t[9]=-l*c,t[2]=M-p*h,t[6]=x+m*h,t[10]=r*c}else if(e.order==="YXZ"){const p=c*d,m=c*u,x=h*d,M=h*u;t[0]=p+M*l,t[4]=x*l-m,t[8]=r*h,t[1]=r*u,t[5]=r*d,t[9]=-l,t[2]=m*l-x,t[6]=M+p*l,t[10]=r*c}else if(e.order==="ZXY"){const p=c*d,m=c*u,x=h*d,M=h*u;t[0]=p-M*l,t[4]=-r*u,t[8]=x+m*l,t[1]=m+x*l,t[5]=r*d,t[9]=M-p*l,t[2]=-r*h,t[6]=l,t[10]=r*c}else if(e.order==="ZYX"){const p=r*d,m=r*u,x=l*d,M=l*u;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+M,t[1]=c*u,t[5]=M*h+p,t[9]=m*h-x,t[2]=-h,t[6]=l*c,t[10]=r*c}else if(e.order==="YZX"){const p=r*c,m=r*h,x=l*c,M=l*h;t[0]=c*d,t[4]=M-p*u,t[8]=x*u+m,t[1]=u,t[5]=r*d,t[9]=-l*d,t[2]=-h*d,t[6]=m*u+x,t[10]=p-M*u}else if(e.order==="XZY"){const p=r*c,m=r*h,x=l*c,M=l*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=p*u+M,t[5]=r*d,t[9]=m*u-x,t[2]=x*u-m,t[6]=l*d,t[10]=M*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vm,e,Mm)}lookAt(e,t,i){const s=this.elements;return qn.subVectors(e,t),qn.lengthSq()===0&&(qn.z=1),qn.normalize(),os.crossVectors(i,qn),os.lengthSq()===0&&(Math.abs(i.z)===1?qn.x+=1e-4:qn.z+=1e-4,qn.normalize(),os.crossVectors(i,qn)),os.normalize(),ro.crossVectors(qn,os),s[0]=os.x,s[4]=ro.x,s[8]=qn.x,s[1]=os.y,s[5]=ro.y,s[9]=qn.y,s[2]=os.z,s[6]=ro.z,s[10]=qn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],l=i[4],c=i[8],h=i[12],d=i[1],u=i[5],p=i[9],m=i[13],x=i[2],M=i[6],g=i[10],f=i[14],y=i[3],v=i[7],_=i[11],E=i[15],T=s[0],C=s[4],R=s[8],S=s[12],b=s[1],L=s[5],I=s[9],V=s[13],j=s[2],te=s[6],q=s[10],K=s[14],ne=s[3],fe=s[7],ve=s[11],Ye=s[15];return a[0]=r*T+l*b+c*j+h*ne,a[4]=r*C+l*L+c*te+h*fe,a[8]=r*R+l*I+c*q+h*ve,a[12]=r*S+l*V+c*K+h*Ye,a[1]=d*T+u*b+p*j+m*ne,a[5]=d*C+u*L+p*te+m*fe,a[9]=d*R+u*I+p*q+m*ve,a[13]=d*S+u*V+p*K+m*Ye,a[2]=x*T+M*b+g*j+f*ne,a[6]=x*C+M*L+g*te+f*fe,a[10]=x*R+M*I+g*q+f*ve,a[14]=x*S+M*V+g*K+f*Ye,a[3]=y*T+v*b+_*j+E*ne,a[7]=y*C+v*L+_*te+E*fe,a[11]=y*R+v*I+_*q+E*ve,a[15]=y*S+v*V+_*K+E*Ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],l=e[5],c=e[9],h=e[13],d=e[2],u=e[6],p=e[10],m=e[14],x=e[3],M=e[7],g=e[11],f=e[15];return x*(+a*c*u-s*h*u-a*l*p+i*h*p+s*l*m-i*c*m)+M*(+t*c*m-t*h*p+a*r*p-s*r*m+s*h*d-a*c*d)+g*(+t*h*u-t*l*m-a*r*u+i*r*m+a*l*d-i*h*d)+f*(-s*l*d-t*c*u+t*l*p+s*r*u-i*r*p+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],l=e[5],c=e[6],h=e[7],d=e[8],u=e[9],p=e[10],m=e[11],x=e[12],M=e[13],g=e[14],f=e[15],y=u*g*h-M*p*h+M*c*m-l*g*m-u*c*f+l*p*f,v=x*p*h-d*g*h-x*c*m+r*g*m+d*c*f-r*p*f,_=d*M*h-x*u*h+x*l*m-r*M*m-d*l*f+r*u*f,E=x*u*c-d*M*c-x*l*p+r*M*p+d*l*g-r*u*g,T=t*y+i*v+s*_+a*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/T;return e[0]=y*C,e[1]=(M*p*a-u*g*a-M*s*m+i*g*m+u*s*f-i*p*f)*C,e[2]=(l*g*a-M*c*a+M*s*h-i*g*h-l*s*f+i*c*f)*C,e[3]=(u*c*a-l*p*a-u*s*h+i*p*h+l*s*m-i*c*m)*C,e[4]=v*C,e[5]=(d*g*a-x*p*a+x*s*m-t*g*m-d*s*f+t*p*f)*C,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*f-t*c*f)*C,e[7]=(r*p*a-d*c*a+d*s*h-t*p*h-r*s*m+t*c*m)*C,e[8]=_*C,e[9]=(x*u*a-d*M*a-x*i*m+t*M*m+d*i*f-t*u*f)*C,e[10]=(r*M*a-x*l*a+x*i*h-t*M*h-r*i*f+t*l*f)*C,e[11]=(d*l*a-r*u*a-d*i*h+t*u*h+r*i*m-t*l*m)*C,e[12]=E*C,e[13]=(d*M*s-x*u*s+x*i*p-t*M*p-d*i*g+t*u*g)*C,e[14]=(x*l*s-r*M*s-x*i*c+t*M*c+r*i*g-t*l*g)*C,e[15]=(r*u*s-d*l*s+d*i*c-t*u*c-r*i*p+t*l*p)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,l=e.y,c=e.z,h=a*r,d=a*l;return this.set(h*r+i,h*l-s*c,h*c+s*l,0,h*l+s*c,d*l+i,d*c-s*r,0,h*c-s*l,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,l=t._z,c=t._w,h=a+a,d=r+r,u=l+l,p=a*h,m=a*d,x=a*u,M=r*d,g=r*u,f=l*u,y=c*h,v=c*d,_=c*u,E=i.x,T=i.y,C=i.z;return s[0]=(1-(M+f))*E,s[1]=(m+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-_)*T,s[5]=(1-(p+f))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(x+v)*C,s[9]=(g-y)*C,s[10]=(1-(p+M))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=la.set(s[0],s[1],s[2]).length();const r=la.set(s[4],s[5],s[6]).length(),l=la.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],hi.copy(this);const h=1/a,d=1/r,u=1/l;return hi.elements[0]*=h,hi.elements[1]*=h,hi.elements[2]*=h,hi.elements[4]*=d,hi.elements[5]*=d,hi.elements[6]*=d,hi.elements[8]*=u,hi.elements[9]*=u,hi.elements[10]*=u,t.setFromRotationMatrix(hi),i.x=a,i.y=r,i.z=l,this}makePerspective(e,t,i,s,a,r,l=Di,c=!1){const h=this.elements,d=2*a/(t-e),u=2*a/(i-s),p=(t+e)/(t-e),m=(i+s)/(i-s);let x,M;if(c)x=a/(r-a),M=r*a/(r-a);else if(l===Di)x=-(r+a)/(r-a),M=-2*r*a/(r-a);else if(l===Zo)x=-r/(r-a),M=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return h[0]=d,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=u,h[9]=m,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,l=Di,c=!1){const h=this.elements,d=2/(t-e),u=2/(i-s),p=-(t+e)/(t-e),m=-(i+s)/(i-s);let x,M;if(c)x=1/(r-a),M=r/(r-a);else if(l===Di)x=-2/(r-a),M=-(r+a)/(r-a);else if(l===Zo)x=-1/(r-a),M=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return h[0]=d,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=u,h[9]=0,h[13]=m,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const la=new P,hi=new _t,vm=new P(0,0,0),Mm=new P(1,1,1),os=new P,ro=new P,qn=new P,Nd=new _t,Od=new ns;class yi{constructor(e=0,t=0,i=0,s=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],l=s[8],c=s[1],h=s[5],d=s[9],u=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(Ct(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(l,m));break;case"XZY":this._z=Math.asin(-Ct(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(l,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Nd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Od.setFromEuler(this),this.setFromQuaternion(Od,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class qh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _m=0;const kd=new P,ca=new ns,Yi=new _t,oo=new P,ja=new P,ym=new P,bm=new ns,Bd=new P(1,0,0),Vd=new P(0,1,0),Gd=new P(0,0,1),Hd={type:"added"},wm={type:"removed"},ha={type:"childadded",child:null},Ol={type:"childremoved",child:null};class It extends Ga{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new P,t=new yi,i=new ns,s=new P(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new Et}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ca.setFromAxisAngle(e,t),this.quaternion.multiply(ca),this}rotateOnWorldAxis(e,t){return ca.setFromAxisAngle(e,t),this.quaternion.premultiply(ca),this}rotateX(e){return this.rotateOnAxis(Bd,e)}rotateY(e){return this.rotateOnAxis(Vd,e)}rotateZ(e){return this.rotateOnAxis(Gd,e)}translateOnAxis(e,t){return kd.copy(e).applyQuaternion(this.quaternion),this.position.add(kd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bd,e)}translateY(e){return this.translateOnAxis(Vd,e)}translateZ(e){return this.translateOnAxis(Gd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?oo.copy(e):oo.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ja.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(ja,oo,this.up):Yi.lookAt(oo,ja,this.up),this.quaternion.setFromRotationMatrix(Yi),s&&(Yi.extractRotation(s.matrixWorld),ca.setFromRotationMatrix(Yi),this.quaternion.premultiply(ca.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(an("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hd),ha.child=e,this.dispatchEvent(ha),ha.child=null):an("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wm),Ol.child=e,this.dispatchEvent(Ol),Ol.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hd),ha.child=e,this.dispatchEvent(ha),ha.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,e,ym),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,bm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(l=>({...l})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(a(e.materials,this.material[c]));s.material=l}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(a(e.animations,c))}}if(t){const l=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),u=r(e.shapes),p=r(e.skeletons),m=r(e.animations),x=r(e.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(l){const c=[];for(const h in l){const d=l[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}It.DEFAULT_UP=new P(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const di=new P,$i=new P,kl=new P,Zi=new P,da=new P,ua=new P,Wd=new P,Bl=new P,Vl=new P,Gl=new P,Hl=new Yt,Wl=new Yt,Xl=new Yt;class ii{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),di.subVectors(e,t),s.cross(di);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){di.subVectors(s,t),$i.subVectors(i,t),kl.subVectors(e,t);const r=di.dot(di),l=di.dot($i),c=di.dot(kl),h=$i.dot($i),d=$i.dot(kl),u=r*h-l*l;if(u===0)return a.set(0,0,0),null;const p=1/u,m=(h*c-l*d)*p,x=(r*d-l*c)*p;return a.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(e,t,i,s,a,r,l,c){return this.getBarycoord(e,t,i,s,Zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Zi.x),c.addScaledVector(r,Zi.y),c.addScaledVector(l,Zi.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return Hl.setScalar(0),Wl.setScalar(0),Xl.setScalar(0),Hl.fromBufferAttribute(e,t),Wl.fromBufferAttribute(e,i),Xl.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Hl,a.x),r.addScaledVector(Wl,a.y),r.addScaledVector(Xl,a.z),r}static isFrontFacing(e,t,i,s){return di.subVectors(i,t),$i.subVectors(e,t),di.cross($i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return di.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),di.cross($i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ii.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ii.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return ii.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return ii.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ii.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,l;da.subVectors(s,i),ua.subVectors(a,i),Bl.subVectors(e,i);const c=da.dot(Bl),h=ua.dot(Bl);if(c<=0&&h<=0)return t.copy(i);Vl.subVectors(e,s);const d=da.dot(Vl),u=ua.dot(Vl);if(d>=0&&u<=d)return t.copy(s);const p=c*u-d*h;if(p<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(da,r);Gl.subVectors(e,a);const m=da.dot(Gl),x=ua.dot(Gl);if(x>=0&&m<=x)return t.copy(a);const M=m*h-c*x;if(M<=0&&h>=0&&x<=0)return l=h/(h-x),t.copy(i).addScaledVector(ua,l);const g=d*x-m*u;if(g<=0&&u-d>=0&&m-x>=0)return Wd.subVectors(a,s),l=(u-d)/(u-d+(m-x)),t.copy(s).addScaledVector(Wd,l);const f=1/(g+M+p);return r=M*f,l=p*f,t.copy(i).addScaledVector(da,r).addScaledVector(ua,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Pf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ls={h:0,s:0,l:0},lo={h:0,s:0,l:0};function ql(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ft.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ft.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ft.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ft.workingColorSpace){if(e=Hh(e,1),t=Ct(t,0,1),i=Ct(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=ql(r,a,e+1/3),this.g=ql(r,a,e),this.b=ql(r,a,e-1/3)}return Ft.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(a){a!==void 0&&parseFloat(a)<1&&gt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],l=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:gt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);gt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const i=Pf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):gt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}copyLinearToSRGB(e){return this.r=Ra(e.r),this.g=Ra(e.g),this.b=Ra(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return Ft.workingToColorSpace(Rn.copy(this),e),Math.round(Ct(Rn.r*255,0,255))*65536+Math.round(Ct(Rn.g*255,0,255))*256+Math.round(Ct(Rn.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ft.workingColorSpace){Ft.workingToColorSpace(Rn.copy(this),t);const i=Rn.r,s=Rn.g,a=Rn.b,r=Math.max(i,s,a),l=Math.min(i,s,a);let c,h;const d=(l+r)/2;if(l===r)c=0,h=0;else{const u=r-l;switch(h=d<=.5?u/(r+l):u/(2-r-l),r){case i:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-i)/u+2;break;case a:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=Ft.workingColorSpace){return Ft.workingToColorSpace(Rn.copy(this),t),e.r=Rn.r,e.g=Rn.g,e.b=Rn.b,e}getStyle(e=Lt){Ft.workingToColorSpace(Rn.copy(this),e);const t=Rn.r,i=Rn.g,s=Rn.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ls),this.setHSL(ls.h+e,ls.s+t,ls.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ls),e.getHSL(lo);const i=pr(ls.h,lo.h,t),s=pr(ls.s,lo.s,t),a=pr(ls.l,lo.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rn=new rt;rt.NAMES=Pf;let Sm=0;class Cs extends Ga{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Ca,this.side=Ss,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bc,this.blendDst=wc,this.blendEquation=Bs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ua,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ia,this.stencilZFail=ia,this.stencilZPass=ia,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){gt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){gt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ca&&(i.blending=this.blending),this.side!==Ss&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==bc&&(i.blendSrc=this.blendSrc),this.blendDst!==wc&&(i.blendDst=this.blendDst),this.blendEquation!==Bs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ua&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ia&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ia&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ia&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const l in a){const c=a[l];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends Cs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dn=new P,co=new Fe;let Tm=0;class Jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lh,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)co.fromBufferAttribute(this,t),co.applyMatrix3(e),this.setXY(t,co.x,co.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix3(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Xt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array),s=Xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array),s=Xt(s,this.array),a=Xt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lh&&(e.usage=this.usage),e}}class Lf extends Jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Df extends Jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class bt extends Jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Em=0;const ti=new _t,Yl=new It,fa=new P,Yn=new ea,Qa=new ea,bn=new P;class Zt extends Ga{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cf(e)?Df:Lf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Et().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,i){return ti.makeTranslation(e,t,i),this.applyMatrix4(ti),this}scale(e,t,i){return ti.makeScale(e,t,i),this.applyMatrix4(ti),this}lookAt(e){return Yl.lookAt(e),Yl.updateMatrix(),this.applyMatrix4(Yl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fa).negate(),this.translate(fa.x,fa.y,fa.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new bt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ea);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){an("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Yn.setFromBufferAttribute(a),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&an('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ha);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){an("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Yn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const l=t[a];Qa.setFromBufferAttribute(l),this.morphTargetsRelative?(bn.addVectors(Yn.min,Qa.min),Yn.expandByPoint(bn),bn.addVectors(Yn.max,Qa.max),Yn.expandByPoint(bn)):(Yn.expandByPoint(Qa.min),Yn.expandByPoint(Qa.max))}Yn.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)bn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(bn));if(t)for(let a=0,r=t.length;a<r;a++){const l=t[a],c=this.morphTargetsRelative;for(let h=0,d=l.count;h<d;h++)bn.fromBufferAttribute(l,h),c&&(fa.fromBufferAttribute(e,h),bn.add(fa)),s=Math.max(s,i.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&an('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){an("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),l=[],c=[];for(let R=0;R<i.count;R++)l[R]=new P,c[R]=new P;const h=new P,d=new P,u=new P,p=new Fe,m=new Fe,x=new Fe,M=new P,g=new P;function f(R,S,b){h.fromBufferAttribute(i,R),d.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),p.fromBufferAttribute(a,R),m.fromBufferAttribute(a,S),x.fromBufferAttribute(a,b),d.sub(h),u.sub(h),m.sub(p),x.sub(p);const L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(u,-m.y).multiplyScalar(L),g.copy(u).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),l[R].add(M),l[S].add(M),l[b].add(M),c[R].add(g),c[S].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,S=y.length;R<S;++R){const b=y[R],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new P,_=new P,E=new P,T=new P;function C(R){E.fromBufferAttribute(s,R),T.copy(E);const S=l[R];v.copy(S),v.sub(E.multiplyScalar(E.dot(S))).normalize(),_.crossVectors(T,S);const L=_.dot(c[R])<0?-1:1;r.setXYZW(R,v.x,v.y,v.z,L)}for(let R=0,S=y.length;R<S;++R){const b=y[R],L=b.start,I=b.count;for(let V=L,j=L+I;V<j;V+=3)C(e.getX(V+0)),C(e.getX(V+1)),C(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const s=new P,a=new P,r=new P,l=new P,c=new P,h=new P,d=new P,u=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,M),r.fromBufferAttribute(t,g),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),l.add(d),c.add(d),h.add(d),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),a.fromBufferAttribute(t,p+1),r.fromBufferAttribute(t,p+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(p+0,d.x,d.y,d.z),i.setXYZ(p+1,d.x,d.y,d.z),i.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bn.fromBufferAttribute(e,t),bn.normalize(),e.setXYZ(t,bn.x,bn.y,bn.z)}toNonIndexed(){function e(l,c){const h=l.array,d=l.itemSize,u=l.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let M=0,g=c.length;M<g;M++){l.isInterleavedBufferAttribute?m=c[M]*l.data.stride+l.offset:m=c[M]*d;for(let f=0;f<d;f++)p[x++]=h[m++]}return new Jn(p,d,u)}if(this.index===null)return gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zt,i=this.index.array,s=this.attributes;for(const l in s){const c=s[l],h=e(c,i);t.setAttribute(l,h)}const a=this.morphAttributes;for(const l in a){const c=[],h=a[l];for(let d=0,u=h.length;d<u;d++){const p=h[d],m=e(p,i);c.push(m)}t.morphAttributes[l]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let l=0,c=r.length;l<c;l++){const h=r[l];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,p=h.length;u<p;u++){const m=h[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let p=0,m=u.length;p<m;p++)d.push(u[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Xd=new _t,Ds=new Xh,ho=new Ha,qd=new P,uo=new P,fo=new P,po=new P,$l=new P,mo=new P,Yd=new P,xo=new P;class O extends It{constructor(e=new Zt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const l=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const l=this.morphTargetInfluences;if(a&&l){mo.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=l[c],u=a[c];d!==0&&($l.fromBufferAttribute(u,e),r?mo.addScaledVector($l,d):mo.addScaledVector($l.sub(t),d))}t.add(mo)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ho.copy(i.boundingSphere),ho.applyMatrix4(a),Ds.copy(e.ray).recast(e.near),!(ho.containsPoint(Ds.origin)===!1&&(Ds.intersectSphere(ho,qd)===null||Ds.origin.distanceToSquared(qd)>(e.far-e.near)**2))&&(Xd.copy(a).invert(),Ds.copy(e.ray).applyMatrix4(Xd),!(i.boundingBox!==null&&Ds.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ds)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,l=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,p=a.groups,m=a.drawRange;if(l!==null)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],f=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(l.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=l.getX(_),C=l.getX(_+1),R=l.getX(_+2);s=go(this,f,e,i,h,d,u,T,C,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let g=x,f=M;g<f;g+=3){const y=l.getX(g),v=l.getX(g+1),_=l.getX(g+2);s=go(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,M=p.length;x<M;x++){const g=p[x],f=r[g.materialIndex],y=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let _=y,E=v;_<E;_+=3){const T=_,C=_+1,R=_+2;s=go(this,f,e,i,h,d,u,T,C,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let g=x,f=M;g<f;g+=3){const y=g,v=g+1,_=g+2;s=go(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Am(n,e,t,i,s,a,r,l){let c;if(e.side===In?c=i.intersectTriangle(r,a,s,!0,l):c=i.intersectTriangle(s,a,r,e.side===Ss,l),c===null)return null;xo.copy(l),xo.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(xo);return h<t.near||h>t.far?null:{distance:h,point:xo.clone(),object:n}}function go(n,e,t,i,s,a,r,l,c,h){n.getVertexPosition(l,uo),n.getVertexPosition(c,fo),n.getVertexPosition(h,po);const d=Am(n,e,t,i,uo,fo,po,Yd);if(d){const u=new P;ii.getBarycoord(Yd,uo,fo,po,u),s&&(d.uv=ii.getInterpolatedAttribute(s,l,c,h,u,new Fe)),a&&(d.uv1=ii.getInterpolatedAttribute(a,l,c,h,u,new Fe)),r&&(d.normal=ii.getInterpolatedAttribute(r,l,c,h,u,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const p={a:l,b:c,c:h,normal:new P,materialIndex:0};ii.getNormal(uo,fo,po,p.normal),d.face=p,d.barycoord=u}return d}class xe extends Zt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const l=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],u=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new bt(h,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(u,2));function x(M,g,f,y,v,_,E,T,C,R,S){const b=_/C,L=E/R,I=_/2,V=E/2,j=T/2,te=C+1,q=R+1;let K=0,ne=0;const fe=new P;for(let ve=0;ve<q;ve++){const Ye=ve*L-V;for(let D=0;D<te;D++){const Ie=D*b-I;fe[M]=Ie*y,fe[g]=Ye*v,fe[f]=j,h.push(fe.x,fe.y,fe.z),fe[M]=0,fe[g]=0,fe[f]=T>0?1:-1,d.push(fe.x,fe.y,fe.z),u.push(D/C),u.push(1-ve/R),K+=1}}for(let ve=0;ve<R;ve++)for(let Ye=0;Ye<C;Ye++){const D=p+Ye+te*ve,Ie=p+Ye+te*(ve+1),ye=p+(Ye+1)+te*(ve+1),Ce=p+(Ye+1)+te*ve;c.push(D,Ie,Ce),c.push(Ie,ye,Ce),ne+=6}l.addGroup(m,ne,S),m+=ne,p+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Oa(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Vn(n){const e={};for(let t=0;t<n.length;t++){const i=Oa(n[t]);for(const s in i)e[s]=i[s]}return e}function Cm(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function If(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ft.workingColorSpace}const Lr={clone:Oa,merge:Vn};var Rm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends Cs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rm,this.fragmentShader=Pm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Oa(e.uniforms),this.uniformsGroups=Cm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Uf extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const cs=new P,$d=new Fe,Zd=new Fe;class $n extends Uf{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Pr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(fr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pr*2*Math.atan(Math.tan(fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(cs.x,cs.y).multiplyScalar(-e/cs.z),cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(cs.x,cs.y).multiplyScalar(-e/cs.z)}getViewSize(e,t){return this.getViewBounds(e,$d,Zd),t.subVectors(Zd,$d)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(fr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const l=this.filmOffset;l!==0&&(a+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const pa=-90,ma=1;class Lm extends It{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $n(pa,ma,e,t);s.layers=this.layers,this.add(s);const a=new $n(pa,ma,e,t);a.layers=this.layers,this.add(a);const r=new $n(pa,ma,e,t);r.layers=this.layers,this.add(r);const l=new $n(pa,ma,e,t);l.layers=this.layers,this.add(l);const c=new $n(pa,ma,e,t);c.layers=this.layers,this.add(c);const h=new $n(pa,ma,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,l,c]=t;for(const h of t)this.remove(h);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Zo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,l,c,h,d]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,l),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,p,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Ff extends Un{constructor(e=[],t=Fa,i,s,a,r,l,c,h,d){super(e,t,i,s,a,r,l,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Dm extends _i{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ff(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xe(5,5,5),a=new Sn({name:"CubemapFromEquirect",uniforms:Oa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:In,blending:Ui});a.uniforms.tEquirect.value=t;const r=new O(s,a),l=t.minFilter;return t.minFilter===Gs&&(t.minFilter=ai),new Lm(1,10,this).update(e,r),t.minFilter=l,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class it extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Im={type:"move"};class Zl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new it,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new it,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new it,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const l=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),f=this._getHandJoint(h,M);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],p=d.position.distanceTo(u.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(Im)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new it;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Yh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new Yh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class zf extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Um{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lh,this.updateRanges=[],this.version=0,this.uuid=zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kn=new P;class jo{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.applyMatrix4(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.applyNormalMatrix(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kn.fromBufferAttribute(this,t),kn.transformDirection(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Xt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array),s=Xt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xt(t,this.array),i=Xt(i,this.array),s=Xt(s,this.array),a=Xt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){Jo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new Jn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new jo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Jo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class pl extends Cs{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let xa;const er=new P,ga=new P,va=new P,Ma=new Fe,tr=new Fe,Nf=new _t,vo=new P,nr=new P,Mo=new P,Kd=new Fe,Kl=new Fe,Jd=new Fe;class Qo extends It{constructor(e=new pl){if(super(),this.isSprite=!0,this.type="Sprite",xa===void 0){xa=new Zt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Um(t,5);xa.setIndex([0,1,2,0,2,3]),xa.setAttribute("position",new jo(i,3,0,!1)),xa.setAttribute("uv",new jo(i,2,3,!1))}this.geometry=xa,this.material=e,this.center=new Fe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&an('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ga.setFromMatrixScale(this.matrixWorld),Nf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),va.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ga.multiplyScalar(-va.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;_o(vo.set(-.5,-.5,0),va,r,ga,s,a),_o(nr.set(.5,-.5,0),va,r,ga,s,a),_o(Mo.set(.5,.5,0),va,r,ga,s,a),Kd.set(0,0),Kl.set(1,0),Jd.set(1,1);let l=e.ray.intersectTriangle(vo,nr,Mo,!1,er);if(l===null&&(_o(nr.set(-.5,.5,0),va,r,ga,s,a),Kl.set(0,1),l=e.ray.intersectTriangle(vo,Mo,nr,!1,er),l===null))return;const c=e.ray.origin.distanceTo(er);c<e.near||c>e.far||t.push({distance:c,point:er.clone(),uv:ii.getInterpolation(er,vo,nr,Mo,Kd,Kl,Jd,new Fe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function _o(n,e,t,i,s,a){Ma.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(tr.x=a*Ma.x-s*Ma.y,tr.y=s*Ma.x+a*Ma.y):tr.copy(Ma),n.copy(e),n.x+=tr.x,n.y+=tr.y,n.applyMatrix4(Nf)}class Of extends Un{constructor(e=null,t=1,i=1,s,a,r,l,c,h=Kn,d=Kn,u,p){super(null,r,l,c,h,d,s,a,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ch extends Jn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const _a=new _t,jd=new _t,yo=[],Qd=new ea,Fm=new _t,ir=new O,sr=new Ha;class cn extends O{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ch(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Fm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ea),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,_a),Qd.copy(e.boundingBox).applyMatrix4(_a),this.boundingBox.union(Qd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ha),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,_a),sr.copy(e.boundingSphere).applyMatrix4(_a),this.boundingSphere.union(sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let l=0;l<i.length;l++)i[l]=s[r+l]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(ir.geometry=this.geometry,ir.material=this.material,ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),sr.copy(this.boundingSphere),sr.applyMatrix4(i),e.ray.intersectsSphere(sr)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,_a),jd.multiplyMatrices(i,_a),ir.matrixWorld=jd,ir.raycast(e,yo);for(let r=0,l=yo.length;r<l;r++){const c=yo[r];c.instanceId=a,c.object=this,t.push(c)}yo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ch(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Of(new Float32Array(s*this.count),s,this.count,Nh,Li));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const l=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=l,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Jl=new P,zm=new P,Nm=new Et;class Ns{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Jl.subVectors(i,t).cross(zm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Jl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Nm.getNormalMatrix(e),s=this.coplanarPoint(Jl).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Is=new Ha,Om=new Fe(.5,.5),bo=new P;class $h{constructor(e=new Ns,t=new Ns,i=new Ns,s=new Ns,a=new Ns,r=new Ns){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(i),l[3].copy(s),l[4].copy(a),l[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di,i=!1){const s=this.planes,a=e.elements,r=a[0],l=a[1],c=a[2],h=a[3],d=a[4],u=a[5],p=a[6],m=a[7],x=a[8],M=a[9],g=a[10],f=a[11],y=a[12],v=a[13],_=a[14],E=a[15];if(s[0].setComponents(h-r,m-d,f-x,E-y).normalize(),s[1].setComponents(h+r,m+d,f+x,E+y).normalize(),s[2].setComponents(h+l,m+u,f+M,E+v).normalize(),s[3].setComponents(h-l,m-u,f-M,E-v).normalize(),i)s[4].setComponents(c,p,g,_).normalize(),s[5].setComponents(h-c,m-p,f-g,E-_).normalize();else if(s[4].setComponents(h-c,m-p,f-g,E-_).normalize(),t===Di)s[5].setComponents(h+c,m+p,f+g,E+_).normalize();else if(t===Zo)s[5].setComponents(c,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Is)}intersectsSprite(e){Is.center.set(0,0,0);const t=Om.distanceTo(e.center);return Is.radius=.7071067811865476+t,Is.applyMatrix4(e.matrixWorld),this.intersectsSphere(Is)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(bo.x=s.normal.x>0?e.max.x:e.min.x,bo.y=s.normal.y>0?e.max.y:e.min.y,bo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(bo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class el extends Cs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const tl=new P,nl=new P,eu=new _t,ar=new Xh,wo=new Ha,jl=new P,tu=new P;class hh extends It{constructor(e=new Zt,t=new el){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)tl.fromBufferAttribute(t,s-1),nl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=tl.distanceTo(nl);e.setAttribute("lineDistance",new bt(i,1))}else gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),wo.copy(i.boundingSphere),wo.applyMatrix4(s),wo.radius+=a,e.ray.intersectsSphere(wo)===!1)return;eu.copy(s).invert(),ar.copy(e.ray).applyMatrix4(eu);const l=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=this.isLineSegments?2:1,d=i.index,p=i.attributes.position;if(d!==null){const m=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const f=d.getX(M),y=d.getX(M+1),v=So(this,e,ar,c,f,y,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(m),f=So(this,e,ar,c,M,g,x-1);f&&t.push(f)}}else{const m=Math.max(0,r.start),x=Math.min(p.count,r.start+r.count);for(let M=m,g=x-1;M<g;M+=h){const f=So(this,e,ar,c,M,M+1,M);f&&t.push(f)}if(this.isLineLoop){const M=So(this,e,ar,c,x-1,m,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const l=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=a}}}}}function So(n,e,t,i,s,a,r){const l=n.geometry.attributes.position;if(tl.fromBufferAttribute(l,s),nl.fromBufferAttribute(l,a),t.distanceSqToSegment(tl,nl,jl,tu)>i)return;jl.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(jl);if(!(h<e.near||h>e.far))return{distance:h,point:tu.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const nu=new P,iu=new P;class km extends hh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)nu.fromBufferAttribute(t,s),iu.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+nu.distanceTo(iu);e.setAttribute("lineDistance",new bt(i,1))}else gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nn extends Un{constructor(e,t,i,s,a,r,l,c,h){super(e,t,i,s,a,r,l,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kf extends Un{constructor(e,t,i=Ks,s,a,r,l=Kn,c=Kn,h,d=Ar,u=1){if(d!==Ar&&d!==Cr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,a,r,l,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Bf extends Un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Mn extends Zt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],l=[],c=[],h=new P,d=new Fe;r.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const m=i+u/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),r.push(h.x,h.y,h.z),l.push(0,0,1),d.x=(r[p]/e+1)/2,d.y=(r[p+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new bt(r,3)),this.setAttribute("normal",new bt(l,3)),this.setAttribute("uv",new bt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Qe extends Zt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:l,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],p=[],m=[];let x=0;const M=[],g=i/2;let f=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new bt(u,3)),this.setAttribute("normal",new bt(p,3)),this.setAttribute("uv",new bt(m,2));function y(){const _=new P,E=new P;let T=0;const C=(t-e)/i;for(let R=0;R<=a;R++){const S=[],b=R/a,L=b*(t-e)+e;for(let I=0;I<=s;I++){const V=I/s,j=V*c+l,te=Math.sin(j),q=Math.cos(j);E.x=L*te,E.y=-b*i+g,E.z=L*q,u.push(E.x,E.y,E.z),_.set(te,C,q).normalize(),p.push(_.x,_.y,_.z),m.push(V,1-b),S.push(x++)}M.push(S)}for(let R=0;R<s;R++)for(let S=0;S<a;S++){const b=M[S][R],L=M[S+1][R],I=M[S+1][R+1],V=M[S][R+1];(e>0||S!==0)&&(d.push(b,L,V),T+=3),(t>0||S!==a-1)&&(d.push(L,I,V),T+=3)}h.addGroup(f,T,0),f+=T}function v(_){const E=x,T=new Fe,C=new P;let R=0;const S=_===!0?e:t,b=_===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,g*b,0),p.push(0,b,0),m.push(.5,.5),x++;const L=x;for(let I=0;I<=s;I++){const j=I/s*c+l,te=Math.cos(j),q=Math.sin(j);C.x=S*q,C.y=g*b,C.z=S*te,u.push(C.x,C.y,C.z),p.push(0,b,0),T.x=te*.5+.5,T.y=q*.5*b+.5,m.push(T.x,T.y),x++}for(let I=0;I<s;I++){const V=E+I,j=L+I;_===!0?d.push(j,j+1,V):d.push(j+1,j,V),R+=3}h.addGroup(f,R,_===!0?1:2),f+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ri extends Qe{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,l=Math.PI*2){super(0,e,t,i,s,a,r,l),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:l}}static fromJSON(e){return new Ri(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ml extends Zt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];l(s),h(i),d(),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(a.slice(),3)),this.setAttribute("uv",new bt(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function l(y){const v=new P,_=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],_),m(t[T+2],E),c(v,_,E,y)}function c(y,v,_,E){const T=E+1,C=[];for(let R=0;R<=T;R++){C[R]=[];const S=y.clone().lerp(_,R/T),b=v.clone().lerp(_,R/T),L=T-R;for(let I=0;I<=L;I++)I===0&&R===T?C[R][I]=S:C[R][I]=S.clone().lerp(b,I/L)}for(let R=0;R<T;R++)for(let S=0;S<2*(T-R)-1;S++){const b=Math.floor(S/2);S%2===0?(p(C[R][b+1]),p(C[R+1][b]),p(C[R][b])):(p(C[R][b+1]),p(C[R+1][b+1]),p(C[R+1][b]))}}function h(y){const v=new P;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(y),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function d(){const y=new P;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const _=g(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;r.push(_,1-E)}x(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],_=r[y+2],E=r[y+4],T=Math.max(v,_,E),C=Math.min(v,_,E);T>.9&&C<.1&&(v<.2&&(r[y+0]+=1),_<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function p(y){a.push(y.x,y.y,y.z)}function m(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){const y=new P,v=new P,_=new P,E=new P,T=new Fe,C=new Fe,R=new Fe;for(let S=0,b=0;S<a.length;S+=9,b+=6){y.set(a[S+0],a[S+1],a[S+2]),v.set(a[S+3],a[S+4],a[S+5]),_.set(a[S+6],a[S+7],a[S+8]),T.set(r[b+0],r[b+1]),C.set(r[b+2],r[b+3]),R.set(r[b+4],r[b+5]),E.copy(y).add(v).add(_).divideScalar(3);const L=g(E);M(T,b+0,y,L),M(C,b+2,v,L),M(R,b+4,_,L)}}function M(y,v,_,E){E<0&&y.x===1&&(r[v]=y.x-1),_.x===0&&_.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ml(e.vertices,e.indices,e.radius,e.details)}}class Zh extends ml{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zh(e.radius,e.detail)}}class Gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){gt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let l=0,c=a-1,h;for(;l<=c;)if(s=Math.floor(l+(c-l)/2),h=i[s]-r,h<0)l=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],p=i[s+1]-d,m=(r-d)/p;return(s+m)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),l=this.getPoint(a),c=t||(r.isVector2?new Fe:new P);return c.copy(l).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],a=[],r=[],l=new P,c=new _t;for(let m=0;m<=e;m++){const x=m/e;s[m]=this.getTangentAt(x,new P)}a[0]=new P,r[0]=new P;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),p<=h&&i.set(0,0,1),l.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],l),r[0].crossVectors(s[0],a[0]);for(let m=1;m<=e;m++){if(a[m]=a[m-1].clone(),r[m]=r[m-1].clone(),l.crossVectors(s[m-1],s[m]),l.length()>Number.EPSILON){l.normalize();const x=Math.acos(Ct(s[m-1].dot(s[m]),-1,1));a[m].applyMatrix4(c.makeRotationAxis(l,x))}r[m].crossVectors(s[m],a[m])}if(t===!0){let m=Math.acos(Ct(a[0].dot(a[e]),-1,1));m/=e,s[0].dot(l.crossVectors(a[0],a[e]))>0&&(m=-m);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],m*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Kh extends Gi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,l=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=l,this.aRotation=c}getPoint(e,t=new Fe){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const l=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(l),h=this.aY+this.yRadius*Math.sin(l);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=c-this.aX,m=h-this.aY;c=p*d-m*u+this.aX,h=p*u+m*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Bm extends Kh{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Jh(){let n=0,e=0,t=0,i=0;function s(a,r,l,c){n=a,e=l,t=-3*a+3*r-2*l-c,i=2*a-2*r+l+c}return{initCatmullRom:function(a,r,l,c,h){s(r,l,h*(l-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,l,c,h,d,u){let p=(r-a)/h-(l-a)/(h+d)+(l-r)/d,m=(l-r)/d-(c-r)/(d+u)+(c-l)/u;p*=d,m*=d,s(r,l,p,m)},calc:function(a){const r=a*a,l=r*a;return n+e*a+t*r+i*l}}}const To=new P,Ql=new Jh,ec=new Jh,tc=new Jh;class Vm extends Gi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let l=Math.floor(r),c=r-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/a)+1)*a:c===0&&l===a-1&&(l=a-2,c=1);let h,d;this.closed||l>0?h=s[(l-1)%a]:(To.subVectors(s[0],s[1]).add(s[0]),h=To);const u=s[l%a],p=s[(l+1)%a];if(this.closed||l+2<a?d=s[(l+2)%a]:(To.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=To),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(u),m),M=Math.pow(u.distanceToSquared(p),m),g=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),Ql.initNonuniformCatmullRom(h.x,u.x,p.x,d.x,x,M,g),ec.initNonuniformCatmullRom(h.y,u.y,p.y,d.y,x,M,g),tc.initNonuniformCatmullRom(h.z,u.z,p.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(Ql.initCatmullRom(h.x,u.x,p.x,d.x,this.tension),ec.initCatmullRom(h.y,u.y,p.y,d.y,this.tension),tc.initCatmullRom(h.z,u.z,p.z,d.z,this.tension));return i.set(Ql.calc(c),ec.calc(c),tc.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function su(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,l=n*n,c=n*l;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*l+a*n+t}function Gm(n,e){const t=1-n;return t*t*e}function Hm(n,e){return 2*(1-n)*n*e}function Wm(n,e){return n*n*e}function mr(n,e,t,i){return Gm(n,e)+Hm(n,t)+Wm(n,i)}function Xm(n,e){const t=1-n;return t*t*t*e}function qm(n,e){const t=1-n;return 3*t*t*n*e}function Ym(n,e){return 3*(1-n)*n*n*e}function $m(n,e){return n*n*n*e}function xr(n,e,t,i,s){return Xm(n,e)+qm(n,t)+Ym(n,i)+$m(n,s)}class Vf extends Gi{constructor(e=new Fe,t=new Fe,i=new Fe,s=new Fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Fe){const i=t,s=this.v0,a=this.v1,r=this.v2,l=this.v3;return i.set(xr(e,s.x,a.x,r.x,l.x),xr(e,s.y,a.y,r.y,l.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Zm extends Gi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2,l=this.v3;return i.set(xr(e,s.x,a.x,r.x,l.x),xr(e,s.y,a.y,r.y,l.y),xr(e,s.z,a.z,r.z,l.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Gf extends Gi{constructor(e=new Fe,t=new Fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Fe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Km extends Gi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hf extends Gi{constructor(e=new Fe,t=new Fe,i=new Fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Fe){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(mr(e,s.x,a.x,r.x),mr(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Jm extends Gi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(mr(e,s.x,a.x,r.x),mr(e,s.y,a.y,r.y),mr(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wf extends Gi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Fe){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),l=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(su(l,c.x,h.x,d.x,u.x),su(l,c.y,h.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Fe().fromArray(s))}return this}}var au=Object.freeze({__proto__:null,ArcCurve:Bm,CatmullRomCurve3:Vm,CubicBezierCurve:Vf,CubicBezierCurve3:Zm,EllipseCurve:Kh,LineCurve:Gf,LineCurve3:Km,QuadraticBezierCurve:Hf,QuadraticBezierCurve3:Jm,SplineCurve:Wf});class jm extends Gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new au[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,l=this.curves[a],c=l.getLength(),h=c===0?0:1-r/c;return l.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],l=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(l);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new au[s.type]().fromJSON(s))}return this}}class ru extends jm{constructor(e){super(),this.type="Path",this.currentPoint=new Fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Gf(this.currentPoint.clone(),new Fe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new Hf(this.currentPoint.clone(),new Fe(e,t),new Fe(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const l=new Vf(this.currentPoint.clone(),new Fe(e,t),new Fe(i,s),new Fe(a,r));return this.curves.push(l),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Wf(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const l=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+l,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,l,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,l,c),this}absellipse(e,t,i,s,a,r,l,c){const h=new Kh(e,t,i,s,a,r,l,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class jh extends ru{constructor(e){super(e),this.uuid=zi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new ru().fromJSON(s))}return this}}function Qm(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=Xf(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let l,c,h;if(i&&(a=sx(n,e,a,t)),n.length>80*t){l=n[0],c=n[1];let d=l,u=c;for(let p=t;p<s;p+=t){const m=n[p],x=n[p+1];m<l&&(l=m),x<c&&(c=x),m>d&&(d=m),x>u&&(u=x)}h=Math.max(d-l,u-c),h=h!==0?32767/h:0}return Dr(a,r,t,l,c,h,0),r}function Xf(n,e,t,i,s){let a;if(s===mx(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=ou(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=ou(r/i|0,n[r],n[r+1],a);return a&&ka(a,a.next)&&(Ur(a),a=a.next),a}function Js(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(ka(t,t.next)||rn(t.prev,t,t.next)===0)){if(Ur(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Dr(n,e,t,i,s,a,r){if(!n)return;!r&&a&&cx(n,i,s,a);let l=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?tx(n,i,s,a):ex(n)){e.push(c.i,n.i,h.i),Ur(n),n=h.next,l=h.next;continue}if(n=h,n===l){r?r===1?(n=nx(Js(n),e),Dr(n,e,t,i,s,a,2)):r===2&&ix(n,e,t,i,s,a):Dr(Js(n),e,t,i,s,a,1);break}}}function ex(n){const e=n.prev,t=n,i=n.next;if(rn(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,l=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),u=Math.min(l,c,h),p=Math.max(s,a,r),m=Math.max(l,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=p&&x.y>=u&&x.y<=m&&hr(s,l,a,c,r,h,x.x,x.y)&&rn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function tx(n,e,t,i){const s=n.prev,a=n,r=n.next;if(rn(s,a,r)>=0)return!1;const l=s.x,c=a.x,h=r.x,d=s.y,u=a.y,p=r.y,m=Math.min(l,c,h),x=Math.min(d,u,p),M=Math.max(l,c,h),g=Math.max(d,u,p),f=dh(m,x,e,t,i),y=dh(M,g,e,t,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=f&&_&&_.z<=y;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&hr(l,d,c,u,h,p,v.x,v.y)&&rn(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&hr(l,d,c,u,h,p,_.x,_.y)&&rn(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=f;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&hr(l,d,c,u,h,p,v.x,v.y)&&rn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=m&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&hr(l,d,c,u,h,p,_.x,_.y)&&rn(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function nx(n,e){let t=n;do{const i=t.prev,s=t.next.next;!ka(i,s)&&Yf(i,t,t.next,s)&&Ir(i,s)&&Ir(s,i)&&(e.push(i.i,t.i,s.i),Ur(t),Ur(t.next),t=n=s),t=t.next}while(t!==n);return Js(t)}function ix(n,e,t,i,s,a){let r=n;do{let l=r.next.next;for(;l!==r.prev;){if(r.i!==l.i&&ux(r,l)){let c=$f(r,l);r=Js(r,r.next),c=Js(c,c.next),Dr(r,e,t,i,s,a,0),Dr(c,e,t,i,s,a,0);return}l=l.next}r=r.next}while(r!==n)}function sx(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const l=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=Xf(n,l,c,i,!1);h===h.next&&(h.steiner=!0),s.push(dx(h))}s.sort(ax);for(let a=0;a<s.length;a++)t=rx(s[a],t);return t}function ax(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function rx(n,e){const t=ox(n,e);if(!t)return e;const i=$f(t,n);return Js(i,i.next),Js(t,t.next)}function ox(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(ka(n,t))return t;do{if(ka(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const l=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&qf(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Ir(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&lx(r,t)))&&(r=t,d=u)}t=t.next}while(t!==l);return r}function lx(n,e){return rn(n.prev,n,e.prev)<0&&rn(e.next,n,n.next)<0}function cx(n,e,t,i){let s=n;do s.z===0&&(s.z=dh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,hx(s)}function hx(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,l=0;for(let h=0;h<t&&(l++,r=r.nextZ,!!r);h++);let c=t;for(;l>0||c>0&&r;)l!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,l--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function dh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function dx(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function qf(n,e,t,i,s,a,r,l){return(s-r)*(e-l)>=(n-r)*(a-l)&&(n-r)*(i-l)>=(t-r)*(e-l)&&(t-r)*(a-l)>=(s-r)*(i-l)}function hr(n,e,t,i,s,a,r,l){return!(n===r&&e===l)&&qf(n,e,t,i,s,a,r,l)}function ux(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!fx(n,e)&&(Ir(n,e)&&Ir(e,n)&&px(n,e)&&(rn(n.prev,n,e.prev)||rn(n,e.prev,e))||ka(n,e)&&rn(n.prev,n,n.next)>0&&rn(e.prev,e,e.next)>0)}function rn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function ka(n,e){return n.x===e.x&&n.y===e.y}function Yf(n,e,t,i){const s=Ao(rn(n,e,t)),a=Ao(rn(n,e,i)),r=Ao(rn(t,i,n)),l=Ao(rn(t,i,e));return!!(s!==a&&r!==l||s===0&&Eo(n,t,e)||a===0&&Eo(n,i,e)||r===0&&Eo(t,n,i)||l===0&&Eo(t,e,i))}function Eo(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ao(n){return n>0?1:n<0?-1:0}function fx(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Yf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ir(n,e){return rn(n.prev,n,n.next)<0?rn(n,e,n.next)>=0&&rn(n,n.prev,e)>=0:rn(n,e,n.prev)<0||rn(n,n.next,e)<0}function px(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function $f(n,e){const t=uh(n.i,n.x,n.y),i=uh(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function ou(n,e,t,i){const s=uh(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ur(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function uh(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function mx(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class xx{static triangulate(e,t,i=2){return Qm(e,t,i)}}class gr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return gr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];lu(e),cu(i,e);let r=e.length;t.forEach(lu);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,cu(i,t[c]);const l=xx.triangulate(i,s);for(let c=0;c<l.length;c+=3)a.push(l.slice(c,c+3));return a}}function lu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function cu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Qh extends ml{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Qh(e.radius,e.detail)}}class qt extends Zt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,l=Math.floor(i),c=Math.floor(s),h=l+1,d=c+1,u=e/l,p=t/c,m=[],x=[],M=[],g=[];for(let f=0;f<d;f++){const y=f*p-r;for(let v=0;v<h;v++){const _=v*u-a;x.push(_,-y,0),M.push(0,0,1),g.push(v/l),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<l;y++){const v=y+h*f,_=y+h*(f+1),E=y+1+h*(f+1),T=y+1+h*f;m.push(v,_,T),m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.width,e.height,e.widthSegments,e.heightSegments)}}class xl extends Zt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const l=[],c=[],h=[],d=[];let u=e;const p=(t-e)/s,m=new P,x=new Fe;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const f=a+g/i*r;m.x=u*Math.cos(f),m.y=u*Math.sin(f),c.push(m.x,m.y,m.z),h.push(0,0,1),x.x=(m.x/t+1)/2,x.y=(m.y/t+1)/2,d.push(x.x,x.y)}u+=p}for(let M=0;M<s;M++){const g=M*(i+1);for(let f=0;f<i;f++){const y=f+g,v=y,_=y+i+1,E=y+i+2,T=y+1;l.push(v,_,T),l.push(_,E,T)}}this.setIndex(l),this.setAttribute("position",new bt(c,3)),this.setAttribute("normal",new bt(h,3)),this.setAttribute("uv",new bt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class gl extends Zt{constructor(e=new jh([new Fe(0,.5),new Fe(-.5,-.5),new Fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let l=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(l,c,d),l+=c,c=0;this.setIndex(i),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(a,3)),this.setAttribute("uv",new bt(r,2));function h(d){const u=s.length/3,p=d.extractPoints(t);let m=p.shape;const x=p.holes;gr.isClockWise(m)===!1&&(m=m.reverse());for(let g=0,f=x.length;g<f;g++){const y=x[g];gr.isClockWise(y)===!0&&(x[g]=y.reverse())}const M=gr.triangulateShape(m,x);for(let g=0,f=x.length;g<f;g++){const y=x[g];m=m.concat(y)}for(let g=0,f=m.length;g<f;g++){const y=m[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,f=M.length;g<f;g++){const y=M[g],v=y[0]+u,_=y[1]+u,E=y[2]+u;i.push(v,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return gx(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new gl(i,e.curveSegments)}}function gx(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Jt extends Zt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:l},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+l,Math.PI);let h=0;const d=[],u=new P,p=new P,m=[],x=[],M=[],g=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let _=0;f===0&&r===0?_=.5/t:f===i&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*a)*Math.sin(r+v*l),u.y=e*Math.cos(r+v*l),u.z=e*Math.sin(s+T*a)*Math.sin(r+v*l),x.push(u.x,u.y,u.z),p.copy(u).normalize(),M.push(p.x,p.y,p.z),g.push(T+_,1-v),y.push(h++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],_=d[f][y],E=d[f+1][y],T=d[f+1][y+1];(f!==0||r>0)&&m.push(v,_,T),(f!==i-1||c<Math.PI)&&m.push(_,E,T)}this.setIndex(m),this.setAttribute("position",new bt(x,3)),this.setAttribute("normal",new bt(M,3)),this.setAttribute("uv",new bt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ts extends Zt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],l=[],c=[],h=[],d=new P,u=new P,p=new P;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const M=x/s*a,g=m/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(M),u.y=(e+t*Math.cos(g))*Math.sin(M),u.z=t*Math.sin(g),l.push(u.x,u.y,u.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/s),h.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const M=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,f=(s+1)*(m-1)+x,y=(s+1)*m+x;r.push(M,g,y),r.push(g,f,y)}this.setIndex(r),this.setAttribute("position",new bt(l,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ts(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class vx extends Sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Cs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gh,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Mx extends Cs{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gh,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _x extends Cs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class yx extends Cs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ed extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class bx extends ed{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const nc=new _t,hu=new P,du=new P;class Zf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=Vi,this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $h,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new Yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;hu.setFromMatrixPosition(e.matrixWorld),t.position.copy(hu),du.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(du),t.updateMatrixWorld(),nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const uu=new _t,rr=new P,ic=new P;class wx extends Zf{constructor(){super(new $n(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Fe(4,2),this._viewportCount=6,this._viewports=[new Yt(2,1,1,1),new Yt(0,1,1,1),new Yt(3,1,1,1),new Yt(1,1,1,1),new Yt(3,0,1,1),new Yt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),rr.setFromMatrixPosition(e.matrixWorld),i.position.copy(rr),ic.copy(i.position),ic.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(ic),i.updateMatrixWorld(),s.makeTranslation(-rr.x,-rr.y,-rr.z),uu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uu,i.coordinateSystem,i.reversedDepth)}}class td extends ed{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new wx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class nd extends Uf{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,l=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Sx extends Zf{constructor(){super(new nd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sc extends ed{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new Sx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Tx extends $n{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Kf{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const fu=new _t;class Ex{constructor(e,t,i=0,s=1/0){this.ray=new Xh(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new qh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):an("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return fu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fu),this}intersectObject(e,t=!0,i=[]){return fh(e,this,i,t),i.sort(pu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)fh(e[s],this,i,t);return i.sort(pu),i}}function pu(n,e){return n.distance-e.distance}function fh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,l=a.length;r<l;r++)fh(a[r],e,t,!0)}}function mu(n,e,t,i){const s=Ax(i);switch(t){case Tf:return n*e;case Nh:return n*e/s.components*s.byteLength;case Oh:return n*e/s.components*s.byteLength;case kh:return n*e*2/s.components*s.byteLength;case Bh:return n*e*2/s.components*s.byteLength;case Ef:return n*e*3/s.components*s.byteLength;case vi:return n*e*4/s.components*s.byteLength;case Vh:return n*e*4/s.components*s.byteLength;case ko:case Bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Vo:case Go:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fc:case Nc:return Math.max(n,16)*Math.max(e,8)/4;case Uc:case zc:return Math.max(n,8)*Math.max(e,8)/2;case Oc:case kc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Bc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Vc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Hc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Wc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Xc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case qc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case $c:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Zc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Kc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Jc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case jc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Qc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case eh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case th:case nh:case ih:return Math.ceil(n/4)*Math.ceil(e/4)*16;case sh:case ah:return Math.ceil(n/4)*Math.ceil(e/4)*8;case rh:case oh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ax(n){switch(n){case Vi:case yf:return{byteLength:1,components:1};case Tr:case bf:case Fi:return{byteLength:2,components:1};case Fh:case zh:return{byteLength:2,components:4};case Ks:case Uh:case Li:return{byteLength:4,components:1};case wf:case Sf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Lh}}));typeof window<"u"&&(window.__THREE__?gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Lh);function Jf(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Cx(n){const e=new WeakMap;function t(l,c){const h=l.array,d=l.usage,u=h.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,h,d),l.onUploadCallback();let m;if(h instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)m=n.HALF_FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=n.SHORT;else if(h instanceof Uint32Array)m=n.UNSIGNED_INT;else if(h instanceof Int32Array)m=n.INT;else if(h instanceof Int8Array)m=n.BYTE;else if(h instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:u}}function i(l,c,h){const d=c.array,u=c.updateRanges;if(n.bindBuffer(h,l),u.length===0)n.bufferSubData(h,0,d);else{u.sort((m,x)=>m.start-x.start);let p=0;for(let m=1;m<u.length;m++){const x=u[p],M=u[m];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++p,u[p]=M)}u.length=p+1;for(let m=0,x=u.length;m<x;m++){const M=u[m];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(n.deleteBuffer(c.buffer),e.delete(l))}function r(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const d=e.get(l);(!d||d.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=e.get(l);if(h===void 0)e.set(l,t(l,c));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,l,c),h.version=l.version}}return{get:s,remove:a,update:r}}var Rx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Px=`#ifdef USE_ALPHAHASH
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
#endif`,Lx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ix=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ux=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fx=`#ifdef USE_AOMAP
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
#endif`,zx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nx=`#ifdef USE_BATCHING
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
#endif`,Ox=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gx=`#ifdef USE_IRIDESCENCE
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
#endif`,Hx=`#ifdef USE_BUMPMAP
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
#endif`,Wx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$x=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Jx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,jx=`#define PI 3.141592653589793
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
} // validated`,Qx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,eg=`vec3 transformedNormal = objectNormal;
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
#endif`,tg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ng=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ig=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ag="gl_FragColor = linearToOutputTexel( gl_FragColor );",rg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,og=`#ifdef USE_ENVMAP
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
#endif`,lg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,cg=`#ifdef USE_ENVMAP
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
#endif`,hg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dg=`#ifdef USE_ENVMAP
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
#endif`,ug=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xg=`#ifdef USE_GRADIENTMAP
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
}`,gg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_g=`uniform bool receiveShadow;
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
#endif`,yg=`#ifdef USE_ENVMAP
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
#endif`,bg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Eg=`PhysicalMaterial material;
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
#endif`,Ag=`uniform sampler2D dfgLUT;
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
}`,Cg=`
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
#endif`,Rg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Pg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Dg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ig=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ug=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ng=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Og=`#if defined( USE_POINTS_UV )
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
#endif`,kg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wg=`#ifdef USE_MORPHTARGETS
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
#endif`,Xg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jg=`#ifdef USE_NORMALMAP
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
#endif`,jg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,e1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,t1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,n1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,i1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,s1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,a1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,r1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,o1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,l1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,c1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,h1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,d1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,u1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,f1=`float getShadowMask() {
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
}`,p1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,m1=`#ifdef USE_SKINNING
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
#endif`,x1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,g1=`#ifdef USE_SKINNING
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
#endif`,v1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,M1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,y1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,b1=`#ifdef USE_TRANSMISSION
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
#endif`,w1=`#ifdef USE_TRANSMISSION
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
#endif`,S1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,E1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const C1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,R1=`uniform sampler2D t2D;
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
}`,P1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,L1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,D1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,I1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U1=`#include <common>
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
}`,F1=`#if DEPTH_PACKING == 3200
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
}`,z1=`#define DISTANCE
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
}`,N1=`#define DISTANCE
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
}`,O1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,k1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B1=`uniform float scale;
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
}`,V1=`uniform vec3 diffuse;
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
}`,G1=`#include <common>
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
}`,H1=`uniform vec3 diffuse;
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
}`,W1=`#define LAMBERT
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
}`,X1=`#define LAMBERT
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
}`,q1=`#define MATCAP
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
}`,Y1=`#define MATCAP
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
}`,$1=`#define NORMAL
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
}`,Z1=`#define NORMAL
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
}`,K1=`#define PHONG
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
}`,J1=`#define PHONG
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
}`,j1=`#define STANDARD
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
}`,Q1=`#define STANDARD
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
}`,e2=`#define TOON
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
}`,t2=`#define TOON
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
}`,n2=`uniform float size;
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
}`,i2=`uniform vec3 diffuse;
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
}`,s2=`#include <common>
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
}`,a2=`uniform vec3 color;
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
}`,r2=`uniform float rotation;
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
}`,o2=`uniform vec3 diffuse;
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
}`,At={alphahash_fragment:Rx,alphahash_pars_fragment:Px,alphamap_fragment:Lx,alphamap_pars_fragment:Dx,alphatest_fragment:Ix,alphatest_pars_fragment:Ux,aomap_fragment:Fx,aomap_pars_fragment:zx,batching_pars_vertex:Nx,batching_vertex:Ox,begin_vertex:kx,beginnormal_vertex:Bx,bsdfs:Vx,iridescence_fragment:Gx,bumpmap_pars_fragment:Hx,clipping_planes_fragment:Wx,clipping_planes_pars_fragment:Xx,clipping_planes_pars_vertex:qx,clipping_planes_vertex:Yx,color_fragment:$x,color_pars_fragment:Zx,color_pars_vertex:Kx,color_vertex:Jx,common:jx,cube_uv_reflection_fragment:Qx,defaultnormal_vertex:eg,displacementmap_pars_vertex:tg,displacementmap_vertex:ng,emissivemap_fragment:ig,emissivemap_pars_fragment:sg,colorspace_fragment:ag,colorspace_pars_fragment:rg,envmap_fragment:og,envmap_common_pars_fragment:lg,envmap_pars_fragment:cg,envmap_pars_vertex:hg,envmap_physical_pars_fragment:yg,envmap_vertex:dg,fog_vertex:ug,fog_pars_vertex:fg,fog_fragment:pg,fog_pars_fragment:mg,gradientmap_pars_fragment:xg,lightmap_pars_fragment:gg,lights_lambert_fragment:vg,lights_lambert_pars_fragment:Mg,lights_pars_begin:_g,lights_toon_fragment:bg,lights_toon_pars_fragment:wg,lights_phong_fragment:Sg,lights_phong_pars_fragment:Tg,lights_physical_fragment:Eg,lights_physical_pars_fragment:Ag,lights_fragment_begin:Cg,lights_fragment_maps:Rg,lights_fragment_end:Pg,logdepthbuf_fragment:Lg,logdepthbuf_pars_fragment:Dg,logdepthbuf_pars_vertex:Ig,logdepthbuf_vertex:Ug,map_fragment:Fg,map_pars_fragment:zg,map_particle_fragment:Ng,map_particle_pars_fragment:Og,metalnessmap_fragment:kg,metalnessmap_pars_fragment:Bg,morphinstance_vertex:Vg,morphcolor_vertex:Gg,morphnormal_vertex:Hg,morphtarget_pars_vertex:Wg,morphtarget_vertex:Xg,normal_fragment_begin:qg,normal_fragment_maps:Yg,normal_pars_fragment:$g,normal_pars_vertex:Zg,normal_vertex:Kg,normalmap_pars_fragment:Jg,clearcoat_normal_fragment_begin:jg,clearcoat_normal_fragment_maps:Qg,clearcoat_pars_fragment:e1,iridescence_pars_fragment:t1,opaque_fragment:n1,packing:i1,premultiplied_alpha_fragment:s1,project_vertex:a1,dithering_fragment:r1,dithering_pars_fragment:o1,roughnessmap_fragment:l1,roughnessmap_pars_fragment:c1,shadowmap_pars_fragment:h1,shadowmap_pars_vertex:d1,shadowmap_vertex:u1,shadowmask_pars_fragment:f1,skinbase_vertex:p1,skinning_pars_vertex:m1,skinning_vertex:x1,skinnormal_vertex:g1,specularmap_fragment:v1,specularmap_pars_fragment:M1,tonemapping_fragment:_1,tonemapping_pars_fragment:y1,transmission_fragment:b1,transmission_pars_fragment:w1,uv_pars_fragment:S1,uv_pars_vertex:T1,uv_vertex:E1,worldpos_vertex:A1,background_vert:C1,background_frag:R1,backgroundCube_vert:P1,backgroundCube_frag:L1,cube_vert:D1,cube_frag:I1,depth_vert:U1,depth_frag:F1,distanceRGBA_vert:z1,distanceRGBA_frag:N1,equirect_vert:O1,equirect_frag:k1,linedashed_vert:B1,linedashed_frag:V1,meshbasic_vert:G1,meshbasic_frag:H1,meshlambert_vert:W1,meshlambert_frag:X1,meshmatcap_vert:q1,meshmatcap_frag:Y1,meshnormal_vert:$1,meshnormal_frag:Z1,meshphong_vert:K1,meshphong_frag:J1,meshphysical_vert:j1,meshphysical_frag:Q1,meshtoon_vert:e2,meshtoon_frag:t2,points_vert:n2,points_frag:i2,shadow_vert:s2,shadow_frag:a2,sprite_vert:r2,sprite_frag:o2},He={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Et},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Et}},envmap:{envMap:{value:null},envMapRotation:{value:new Et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Et},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0},uvTransform:{value:new Et}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Et},alphaMap:{value:null},alphaMapTransform:{value:new Et},alphaTest:{value:0}}},Ai={basic:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:At.meshbasic_vert,fragmentShader:At.meshbasic_frag},lambert:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:At.meshlambert_vert,fragmentShader:At.meshlambert_frag},phong:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:At.meshphong_vert,fragmentShader:At.meshphong_frag},standard:{uniforms:Vn([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag},toon:{uniforms:Vn([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:At.meshtoon_vert,fragmentShader:At.meshtoon_frag},matcap:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:At.meshmatcap_vert,fragmentShader:At.meshmatcap_frag},points:{uniforms:Vn([He.points,He.fog]),vertexShader:At.points_vert,fragmentShader:At.points_frag},dashed:{uniforms:Vn([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:At.linedashed_vert,fragmentShader:At.linedashed_frag},depth:{uniforms:Vn([He.common,He.displacementmap]),vertexShader:At.depth_vert,fragmentShader:At.depth_frag},normal:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:At.meshnormal_vert,fragmentShader:At.meshnormal_frag},sprite:{uniforms:Vn([He.sprite,He.fog]),vertexShader:At.sprite_vert,fragmentShader:At.sprite_frag},background:{uniforms:{uvTransform:{value:new Et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:At.background_vert,fragmentShader:At.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Et}},vertexShader:At.backgroundCube_vert,fragmentShader:At.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:At.cube_vert,fragmentShader:At.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:At.equirect_vert,fragmentShader:At.equirect_frag},distanceRGBA:{uniforms:Vn([He.common,He.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:At.distanceRGBA_vert,fragmentShader:At.distanceRGBA_frag},shadow:{uniforms:Vn([He.lights,He.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:At.shadow_vert,fragmentShader:At.shadow_frag}};Ai.physical={uniforms:Vn([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Et},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Et},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Et},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Et},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Et},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Et}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag};const Co={r:0,b:0,g:0},Us=new yi,l2=new _t;function c2(n,e,t,i,s,a,r){const l=new rt(0);let c=a===!0?0:1,h,d,u=null,p=0,m=null;function x(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function M(v){let _=!1;const E=x(v);E===null?f(l,c):E&&E.isColor&&(f(E,1),_=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,_){const E=x(_);E&&(E.isCubeTexture||E.mapping===fl)?(d===void 0&&(d=new O(new xe(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:Oa(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Us.copy(_.backgroundRotation),Us.x*=-1,Us.y*=-1,Us.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Us.y*=-1,Us.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(l2.makeRotationFromEuler(Us)),d.material.toneMapped=Ft.getTransfer(E.colorSpace)!==Wt,(u!==E||p!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,p=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new O(new qt(2,2),new Sn({name:"BackgroundMaterial",uniforms:Oa(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:Ss,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=Ft.getTransfer(E.colorSpace)!==Wt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||p!==E.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,p=E.version,m=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function f(v,_){v.getRGB(Co,If(n)),i.buffers.color.setClear(Co.r,Co.g,Co.b,_,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return l},setClearColor:function(v,_=1){l.set(v),c=_,f(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(l,c)},render:M,addToRenderList:g,dispose:y}}function h2(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let a=s,r=!1;function l(b,L,I,V,j){let te=!1;const q=u(V,I,L);a!==q&&(a=q,h(a.object)),te=m(b,V,I,j),te&&x(b,V,I,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(te||r)&&(r=!1,_(b,L,I,V),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,L,I){const V=I.wireframe===!0;let j=i[b.id];j===void 0&&(j={},i[b.id]=j);let te=j[L.id];te===void 0&&(te={},j[L.id]=te);let q=te[V];return q===void 0&&(q=p(c()),te[V]=q),q}function p(b){const L=[],I=[],V=[];for(let j=0;j<t;j++)L[j]=0,I[j]=0,V[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:I,attributeDivisors:V,object:b,attributes:{},index:null}}function m(b,L,I,V){const j=a.attributes,te=L.attributes;let q=0;const K=I.getAttributes();for(const ne in K)if(K[ne].location>=0){const ve=j[ne];let Ye=te[ne];if(Ye===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(Ye=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(Ye=b.instanceColor)),ve===void 0||ve.attribute!==Ye||Ye&&ve.data!==Ye.data)return!0;q++}return a.attributesNum!==q||a.index!==V}function x(b,L,I,V){const j={},te=L.attributes;let q=0;const K=I.getAttributes();for(const ne in K)if(K[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const Ye={};Ye.attribute=ve,ve&&ve.data&&(Ye.data=ve.data),j[ne]=Ye,q++}a.attributes=j,a.attributesNum=q,a.index=V}function M(){const b=a.newAttributes;for(let L=0,I=b.length;L<I;L++)b[L]=0}function g(b){f(b,0)}function f(b,L){const I=a.newAttributes,V=a.enabledAttributes,j=a.attributeDivisors;I[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),j[b]!==L&&(n.vertexAttribDivisor(b,L),j[b]=L)}function y(){const b=a.newAttributes,L=a.enabledAttributes;for(let I=0,V=L.length;I<V;I++)L[I]!==b[I]&&(n.disableVertexAttribArray(I),L[I]=0)}function v(b,L,I,V,j,te,q){q===!0?n.vertexAttribIPointer(b,L,I,j,te):n.vertexAttribPointer(b,L,I,V,j,te)}function _(b,L,I,V){M();const j=V.attributes,te=I.getAttributes(),q=L.defaultAttributeValues;for(const K in te){const ne=te[K];if(ne.location>=0){let fe=j[K];if(fe===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(fe=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(fe=b.instanceColor)),fe!==void 0){const ve=fe.normalized,Ye=fe.itemSize,D=e.get(fe);if(D===void 0)continue;const Ie=D.buffer,ye=D.type,Ce=D.bytesPerElement,$=ye===n.INT||ye===n.UNSIGNED_INT||fe.gpuType===Uh;if(fe.isInterleavedBufferAttribute){const Z=fe.data,we=Z.stride,Re=fe.offset;if(Z.isInstancedInterleavedBuffer){for(let ke=0;ke<ne.locationSize;ke++)f(ne.location+ke,Z.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ke=0;ke<ne.locationSize;ke++)g(ne.location+ke);n.bindBuffer(n.ARRAY_BUFFER,Ie);for(let ke=0;ke<ne.locationSize;ke++)v(ne.location+ke,Ye/ne.locationSize,ye,ve,we*Ce,(Re+Ye/ne.locationSize*ke)*Ce,$)}else{if(fe.isInstancedBufferAttribute){for(let Z=0;Z<ne.locationSize;Z++)f(ne.location+Z,fe.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Z=0;Z<ne.locationSize;Z++)g(ne.location+Z);n.bindBuffer(n.ARRAY_BUFFER,Ie);for(let Z=0;Z<ne.locationSize;Z++)v(ne.location+Z,Ye/ne.locationSize,ye,ve,Ye*Ce,Ye/ne.locationSize*Z*Ce,$)}}else if(q!==void 0){const ve=q[K];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){R();for(const b in i){const L=i[b];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const I in L){const V=L[I];for(const j in V)d(V[j].object),delete V[j];delete L[I]}delete i[b.id]}function C(b){for(const L in i){const I=i[L];if(I[b.id]===void 0)continue;const V=I[b.id];for(const j in V)d(V[j].object),delete V[j];delete I[b.id]}}function R(){S(),r=!0,a!==s&&(a=s,h(a.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:R,resetDefaultState:S,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:g,disableUnusedAttributes:y}}function d2(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,u){u!==0&&(n.drawArraysInstanced(i,h,d,u),t.update(d,i,u))}function l(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=d[x];t.update(m,i,1)}function c(h,d,u,p){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)r(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,d,0,p,0,u);let x=0;for(let M=0;M<u;M++)x+=d[M]*p[M];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function u2(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==vi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(C){const R=C===Fi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Vi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Li&&!R)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(gt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function f2(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Ns,l=new Et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const m=u.length!==0||p||i!==0||s;return s=p,i=u.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,p){t=d(u,p,0)},this.setState=function(u,p,m){const x=u.clippingPlanes,M=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let _=f.clippingState||null;c.value=_,_=d(x,p,v,m);for(let E=0;E!==v;++E)_[E]=t[E];f.clippingState=_,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,p,m,x){const M=u!==null?u.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const f=m+M*4,y=p.matrixWorldInverse;l.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,_=m;v!==M;++v,_+=4)r.copy(u[v]).applyMatrix4(y,l),r.normal.toArray(g,_),g[_+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function p2(n){let e=new WeakMap;function t(r,l){return l===Lc?r.mapping=Fa:l===Dc&&(r.mapping=za),r}function i(r){if(r&&r.isTexture){const l=r.mapping;if(l===Lc||l===Dc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new Dm(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const vs=4,xu=[.125,.215,.35,.446,.526,.582],Vs=20,m2=512,or=new nd,gu=new rt;let ac=null,rc=0,oc=0,lc=!1;const x2=new P;class ph{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:l=x2}=a;ac=this._renderer.getRenderTarget(),rc=this._renderer.getActiveCubeFace(),oc=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,l),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_u(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ac,rc,oc),this._renderer.xr.enabled=lc,e.scissorTest=!1,ya(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fa||e.mapping===za?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ac=this._renderer.getRenderTarget(),rc=this._renderer.getActiveCubeFace(),oc=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ai,minFilter:ai,generateMipmaps:!1,type:Fi,format:vi,colorSpace:Na,depthBuffer:!1},s=vu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vu(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=g2(a)),this._blurMaterial=M2(a,e,t)}return s}_compileMaterial(e){const t=new O(new Zt,e);this._renderer.compile(t,or)}_sceneToCubeUV(e,t,i,s,a){const c=new $n(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,m=u.toneMapping;u.getClearColor(gu),u.toneMapping=ys,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new O(new xe,new Rt({name:"PMREM.Background",side:In,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let f=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,f=!0):(g.color.copy(gu),f=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):_===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;ya(s,_*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(M,c),u.render(e,c)}u.toneMapping=m,u.autoClear=p,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Fa||e.mapping===za;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_u()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mu());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const l=a.uniforms;l.envMap.value=e;const c=this._cubeSize;ya(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,or)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=v2(this._lodMax,y,v)}const r=this._ggxMaterial,l=this._lodMeshes[i];l.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-d*d),p=.05+h*.95,m=u*p,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-vs?i-x+vs:0),f=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,ya(a,g,f,3*M,2*M),s.setRenderTarget(a),s.render(l,or),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,ya(e,g,f,3*M,2*M),s.setRenderTarget(e),s.render(l,or)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,l){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&an("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=h;const p=h.uniforms,m=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Vs-1),M=a/x,g=isFinite(a)?1+Math.floor(d*M):Vs;g>Vs&&gt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Vs}`);const f=[];let y=0;for(let C=0;C<Vs;++C){const R=C/M,S=Math.exp(-R*R/2);f.push(S),C===0?y+=S:C<g&&(y+=2*S)}for(let C=0;C<f.length;C++)f[C]=f[C]/y;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=f,p.latitudinal.value=r==="latitudinal",l&&(p.poleAxis.value=l);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const _=this._sizeLods[s],E=3*_*(s>v-vs?s-v+vs:0),T=4*(this._cubeSize-_);ya(t,E,T,3*_,2*_),c.setRenderTarget(t),c.render(u,or)}}function g2(n){const e=[],t=[],i=[];let s=n;const a=n-vs+1+xu.length;for(let r=0;r<a;r++){const l=Math.pow(2,s);e.push(l);let c=1/l;r>n-vs?c=xu[r-n+vs-1]:r===0&&(c=0),t.push(c);const h=1/(l-2),d=-h,u=1+h,p=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,x=6,M=3,g=2,f=1,y=new Float32Array(M*x*m),v=new Float32Array(g*x*m),_=new Float32Array(f*x*m);for(let T=0;T<m;T++){const C=T%3*2/3-1,R=T>2?0:-1,S=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];y.set(S,M*x*T),v.set(p,g*x*T);const b=[T,T,T,T,T,T];_.set(b,f*x*T)}const E=new Zt;E.setAttribute("position",new Jn(y,M)),E.setAttribute("uv",new Jn(v,g)),E.setAttribute("faceIndex",new Jn(_,f)),i.push(new O(E,null)),s>vs&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function vu(n,e,t){const i=new _i(n,e,t);return i.texture.mapping=fl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ya(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function v2(n,e,t){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:m2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:vl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function M2(n,e,t){const i=new Float32Array(Vs),s=new P(0,1,0);return new Sn({name:"SphericalGaussianBlur",defines:{n:Vs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function Mu(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vl(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function _u(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function vl(){return`

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
	`}function _2(n){let e=new WeakMap,t=null;function i(l){if(l&&l.isTexture){const c=l.mapping,h=c===Lc||c===Dc,d=c===Fa||c===za;if(h||d){let u=e.get(l);const p=u!==void 0?u.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==p)return t===null&&(t=new ph(n)),u=h?t.fromEquirectangular(l,u):t.fromCubemap(l,u),u.texture.pmremVersion=l.pmremVersion,e.set(l,u),u.texture;if(u!==void 0)return u.texture;{const m=l.image;return h&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new ph(n)),u=h?t.fromEquirectangular(l):t.fromCubemap(l),u.texture.pmremVersion=l.pmremVersion,e.set(l,u),l.addEventListener("dispose",a),u.texture):null}}}return l}function s(l){let c=0;const h=6;for(let d=0;d<h;d++)l[d]!==void 0&&c++;return c===h}function a(l){const c=l.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function y2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Rr("WebGLRenderer: "+i+" extension not supported."),s}}}function b2(n,e,t,i){const s={},a=new WeakMap;function r(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",r),delete s[p.id];const m=a.get(p);m&&(e.remove(m),a.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function l(u,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function h(u){const p=[],m=u.index,x=u.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],T=y[v+1],C=y[v+2];p.push(E,T,T,C,C,E)}}else if(x!==void 0){const y=x.array;M=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,T=v+1,C=v+2;p.push(E,T,T,C,C,E)}}else return;const g=new(Cf(p)?Df:Lf)(p,1);g.version=M;const f=a.get(u);f&&e.remove(f),a.set(u,g)}function d(u){const p=a.get(u);if(p){const m=u.index;m!==null&&p.version<m.version&&h(u)}else h(u);return a.get(u)}return{get:l,update:c,getWireframeAttribute:d}}function w2(n,e,t){let i;function s(p){i=p}let a,r;function l(p){a=p.type,r=p.bytesPerElement}function c(p,m){n.drawElements(i,m,a,p*r),t.update(m,i,1)}function h(p,m,x){x!==0&&(n.drawElementsInstanced(i,m,a,p*r,x),t.update(m,i,x))}function d(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,a,p,0,x);let g=0;for(let f=0;f<x;f++)g+=m[f];t.update(g,i,1)}function u(p,m,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<p.length;f++)h(p[f]/r,m[f],M[f]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,a,p,0,M,0,x);let f=0;for(let y=0;y<x;y++)f+=m[y]*M[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function S2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,l){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=l*(a/3);break;case n.LINES:t.lines+=l*(a/2);break;case n.LINE_STRIP:t.lines+=l*(a-1);break;case n.LINE_LOOP:t.lines+=l*a;break;case n.POINTS:t.points+=l*a;break;default:an("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function T2(n,e,t){const i=new WeakMap,s=new Yt;function a(r,l,c){const h=r.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,u=d!==void 0?d.length:0;let p=i.get(l);if(p===void 0||p.count!==u){let b=function(){R.dispose(),i.delete(l),l.removeEventListener("dispose",b)};var m=b;p!==void 0&&p.texture.dispose();const x=l.morphAttributes.position!==void 0,M=l.morphAttributes.normal!==void 0,g=l.morphAttributes.color!==void 0,f=l.morphAttributes.position||[],y=l.morphAttributes.normal||[],v=l.morphAttributes.color||[];let _=0;x===!0&&(_=1),M===!0&&(_=2),g===!0&&(_=3);let E=l.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const C=new Float32Array(E*T*4*u),R=new Rf(C,E,T,u);R.type=Li,R.needsUpdate=!0;const S=_*4;for(let L=0;L<u;L++){const I=f[L],V=y[L],j=v[L],te=E*T*4*L;for(let q=0;q<I.count;q++){const K=q*S;x===!0&&(s.fromBufferAttribute(I,q),C[te+K+0]=s.x,C[te+K+1]=s.y,C[te+K+2]=s.z,C[te+K+3]=0),M===!0&&(s.fromBufferAttribute(V,q),C[te+K+4]=s.x,C[te+K+5]=s.y,C[te+K+6]=s.z,C[te+K+7]=0),g===!0&&(s.fromBufferAttribute(j,q),C[te+K+8]=s.x,C[te+K+9]=s.y,C[te+K+10]=s.z,C[te+K+11]=j.itemSize===4?s.w:1)}}p={count:u,texture:R,size:new Fe(E,T)},i.set(l,p),l.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=l.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:a}}function E2(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return u}function r(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const jf=new Un,yu=new kf(1,1),Qf=new Rf,e0=new xm,t0=new Ff,bu=[],wu=[],Su=new Float32Array(16),Tu=new Float32Array(9),Eu=new Float32Array(4);function Wa(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=bu[s];if(a===void 0&&(a=new Float32Array(s),bu[s]=a),e!==0){i.toArray(a,0);for(let r=1,l=0;r!==e;++r)l+=t,n[r].toArray(a,l)}return a}function _n(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function yn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ml(n,e){let t=wu[e];t===void 0&&(t=new Int32Array(e),wu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function A2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function C2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_n(t,e))return;n.uniform2fv(this.addr,e),yn(t,e)}}function R2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_n(t,e))return;n.uniform3fv(this.addr,e),yn(t,e)}}function P2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_n(t,e))return;n.uniform4fv(this.addr,e),yn(t,e)}}function L2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_n(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),yn(t,e)}else{if(_n(t,i))return;Eu.set(i),n.uniformMatrix2fv(this.addr,!1,Eu),yn(t,i)}}function D2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_n(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),yn(t,e)}else{if(_n(t,i))return;Tu.set(i),n.uniformMatrix3fv(this.addr,!1,Tu),yn(t,i)}}function I2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_n(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),yn(t,e)}else{if(_n(t,i))return;Su.set(i),n.uniformMatrix4fv(this.addr,!1,Su),yn(t,i)}}function U2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function F2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_n(t,e))return;n.uniform2iv(this.addr,e),yn(t,e)}}function z2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_n(t,e))return;n.uniform3iv(this.addr,e),yn(t,e)}}function N2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_n(t,e))return;n.uniform4iv(this.addr,e),yn(t,e)}}function O2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function k2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_n(t,e))return;n.uniform2uiv(this.addr,e),yn(t,e)}}function B2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_n(t,e))return;n.uniform3uiv(this.addr,e),yn(t,e)}}function V2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_n(t,e))return;n.uniform4uiv(this.addr,e),yn(t,e)}}function G2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(yu.compareFunction=Af,a=yu):a=jf,t.setTexture2D(e||a,s)}function H2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||e0,s)}function W2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||t0,s)}function X2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Qf,s)}function q2(n){switch(n){case 5126:return A2;case 35664:return C2;case 35665:return R2;case 35666:return P2;case 35674:return L2;case 35675:return D2;case 35676:return I2;case 5124:case 35670:return U2;case 35667:case 35671:return F2;case 35668:case 35672:return z2;case 35669:case 35673:return N2;case 5125:return O2;case 36294:return k2;case 36295:return B2;case 36296:return V2;case 35678:case 36198:case 36298:case 36306:case 35682:return G2;case 35679:case 36299:case 36307:return H2;case 35680:case 36300:case 36308:case 36293:return W2;case 36289:case 36303:case 36311:case 36292:return X2}}function Y2(n,e){n.uniform1fv(this.addr,e)}function $2(n,e){const t=Wa(e,this.size,2);n.uniform2fv(this.addr,t)}function Z2(n,e){const t=Wa(e,this.size,3);n.uniform3fv(this.addr,t)}function K2(n,e){const t=Wa(e,this.size,4);n.uniform4fv(this.addr,t)}function J2(n,e){const t=Wa(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function j2(n,e){const t=Wa(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Q2(n,e){const t=Wa(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function ev(n,e){n.uniform1iv(this.addr,e)}function tv(n,e){n.uniform2iv(this.addr,e)}function nv(n,e){n.uniform3iv(this.addr,e)}function iv(n,e){n.uniform4iv(this.addr,e)}function sv(n,e){n.uniform1uiv(this.addr,e)}function av(n,e){n.uniform2uiv(this.addr,e)}function rv(n,e){n.uniform3uiv(this.addr,e)}function ov(n,e){n.uniform4uiv(this.addr,e)}function lv(n,e,t){const i=this.cache,s=e.length,a=Ml(t,s);_n(i,a)||(n.uniform1iv(this.addr,a),yn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||jf,a[r])}function cv(n,e,t){const i=this.cache,s=e.length,a=Ml(t,s);_n(i,a)||(n.uniform1iv(this.addr,a),yn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||e0,a[r])}function hv(n,e,t){const i=this.cache,s=e.length,a=Ml(t,s);_n(i,a)||(n.uniform1iv(this.addr,a),yn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||t0,a[r])}function dv(n,e,t){const i=this.cache,s=e.length,a=Ml(t,s);_n(i,a)||(n.uniform1iv(this.addr,a),yn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Qf,a[r])}function uv(n){switch(n){case 5126:return Y2;case 35664:return $2;case 35665:return Z2;case 35666:return K2;case 35674:return J2;case 35675:return j2;case 35676:return Q2;case 5124:case 35670:return ev;case 35667:case 35671:return tv;case 35668:case 35672:return nv;case 35669:case 35673:return iv;case 5125:return sv;case 36294:return av;case 36295:return rv;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return lv;case 35679:case 36299:case 36307:return cv;case 35680:case 36300:case 36308:case 36293:return hv;case 36289:case 36303:case 36311:case 36292:return dv}}class fv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=q2(t.type)}}class pv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uv(t.type)}}class mv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const l=s[a];l.setValue(e,t[l.id],i)}}}const cc=/(\w+)(\])?(\[|\.)?/g;function Au(n,e){n.seq.push(e),n.map[e.id]=e}function xv(n,e,t){const i=n.name,s=i.length;for(cc.lastIndex=0;;){const a=cc.exec(i),r=cc.lastIndex;let l=a[1];const c=a[2]==="]",h=a[3];if(c&&(l=l|0),h===void 0||h==="["&&r+2===s){Au(t,h===void 0?new fv(l,n,e):new pv(l,n,e));break}else{let u=t.map[l];u===void 0&&(u=new mv(l),Au(t,u)),t=u}}}class Ho{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);xv(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const l=t[a],c=i[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Cu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const gv=37297;let vv=0;function Mv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const l=r+1;i.push(`${l===e?">":" "} ${l}: ${t[r]}`)}return i.join(`
`)}const Ru=new Et;function _v(n){Ft._getMatrix(Ru,Ft.workingColorSpace,n);const e=`mat3( ${Ru.elements.map(t=>t.toFixed(4))} )`;switch(Ft.getTransfer(n)){case $o:return[e,"LinearTransferOETF"];case Wt:return[e,"sRGBTransferOETF"];default:return gt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Pu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const l=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Mv(n.getShaderSource(e),l)}else return a}function yv(n,e){const t=_v(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function bv(n,e){let t;switch(e){case pf:t="Linear";break;case mf:t="Reinhard";break;case xf:t="Cineon";break;case Ih:t="ACESFilmic";break;case vf:t="AgX";break;case Mf:t="Neutral";break;case gf:t="Custom";break;default:gt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ro=new P;function wv(){Ft.getLuminanceCoefficients(Ro);const n=Ro.x.toFixed(4),e=Ro.y.toFixed(4),t=Ro.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Sv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dr).join(`
`)}function Tv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ev(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let l=1;a.type===n.FLOAT_MAT2&&(l=2),a.type===n.FLOAT_MAT3&&(l=3),a.type===n.FLOAT_MAT4&&(l=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:l}}return t}function dr(n){return n!==""}function Lu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Du(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Av=/^[ \t]*#include +<([\w\d./]+)>/gm;function mh(n){return n.replace(Av,Rv)}const Cv=new Map;function Rv(n,e){let t=At[e];if(t===void 0){const i=Cv.get(e);if(i!==void 0)t=At[i],gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return mh(t)}const Pv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Iu(n){return n.replace(Pv,Lv)}function Lv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Uu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Dv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===uf?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ff?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ji&&(e="SHADOWMAP_TYPE_VSM"),e}function Iv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Fa:case za:e="ENVMAP_TYPE_CUBE";break;case fl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Uv(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===za&&(e="ENVMAP_MODE_REFRACTION"),e}function Fv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Dh:e="ENVMAP_BLENDING_MULTIPLY";break;case Up:e="ENVMAP_BLENDING_MIX";break;case Fp:e="ENVMAP_BLENDING_ADD";break}return e}function zv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Nv(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,l=t.fragmentShader;const c=Dv(t),h=Iv(t),d=Uv(t),u=Fv(t),p=zv(t),m=Sv(t),x=Tv(a),M=s.createProgram();let g,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(dr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(dr).join(`
`),f.length>0&&(f+=`
`)):(g=[Uu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dr).join(`
`),f=[Uu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ys?"#define TONE_MAPPING":"",t.toneMapping!==ys?At.tonemapping_pars_fragment:"",t.toneMapping!==ys?bv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",At.colorspace_pars_fragment,yv("linearToOutputTexel",t.outputColorSpace),wv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(dr).join(`
`)),r=mh(r),r=Lu(r,t),r=Du(r,t),l=mh(l),l=Lu(l,t),l=Du(l,t),r=Iu(r),l=Iu(l),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Ld?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ld?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+g+r,_=y+f+l,E=Cu(s,s.VERTEX_SHADER,v),T=Cu(s,s.FRAGMENT_SHADER,_);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function C(L){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(E)||"",j=s.getShaderInfoLog(T)||"",te=I.trim(),q=V.trim(),K=j.trim();let ne=!0,fe=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const ve=Pu(s,E,"vertex"),Ye=Pu(s,T,"fragment");an("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+ve+`
`+Ye)}else te!==""?gt("WebGLProgram: Program Info Log:",te):(q===""||K==="")&&(fe=!1);fe&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:K,prefix:f}})}s.deleteShader(E),s.deleteShader(T),R=new Ho(s,M),S=Ev(s,M)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,gv)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=vv++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let Ov=0;class kv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Bv(e),t.set(e,i)),i}}class Bv{constructor(e){this.id=Ov++,this.code=e,this.usedTimes=0}}function Vv(n,e,t,i,s,a,r){const l=new qh,c=new kv,h=new Set,d=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(S){return h.add(S),S===0?"uv":`uv${S}`}function g(S,b,L,I,V){const j=I.fog,te=V.geometry,q=S.isMeshStandardMaterial?I.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||q),ne=K&&K.mapping===fl?K.image.height:null,fe=x[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&gt("WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ye=ve!==void 0?ve.length:0;let D=0;te.morphAttributes.position!==void 0&&(D=1),te.morphAttributes.normal!==void 0&&(D=2),te.morphAttributes.color!==void 0&&(D=3);let Ie,ye,Ce,$;if(fe){const Ut=Ai[fe];Ie=Ut.vertexShader,ye=Ut.fragmentShader}else Ie=S.vertexShader,ye=S.fragmentShader,c.update(S),Ce=c.getVertexShaderID(S),$=c.getFragmentShaderID(S);const Z=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Re=V.isInstancedMesh===!0,ke=V.isBatchedMesh===!0,tt=!!S.map,kt=!!S.matcap,at=!!K,zt=!!S.aoMap,k=!!S.lightMap,wt=!!S.bumpMap,Mt=!!S.normalMap,Nt=!!S.displacementMap,je=!!S.emissiveMap,Gt=!!S.metalnessMap,ot=!!S.roughnessMap,vt=S.anisotropy>0,U=S.clearcoat>0,A=S.dispersion>0,J=S.iridescence>0,de=S.sheen>0,ge=S.transmission>0,ae=vt&&!!S.anisotropyMap,et=U&&!!S.clearcoatMap,Ue=U&&!!S.clearcoatNormalMap,nt=U&&!!S.clearcoatRoughnessMap,qe=J&&!!S.iridescenceMap,_e=J&&!!S.iridescenceThicknessMap,Pe=de&&!!S.sheenColorMap,ht=de&&!!S.sheenRoughnessMap,ct=!!S.specularMap,We=!!S.specularColorMap,dt=!!S.specularIntensityMap,H=ge&&!!S.transmissionMap,Ge=ge&&!!S.thicknessMap,Oe=!!S.gradientMap,ze=!!S.alphaMap,Se=S.alphaTest>0,pe=!!S.alphaHash,Ke=!!S.extensions;let ut=ys;S.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ut=n.toneMapping);const Bt={shaderID:fe,shaderType:S.type,shaderName:S.name,vertexShader:Ie,fragmentShader:ye,defines:S.defines,customVertexShaderID:Ce,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:ke,batchingColor:ke&&V._colorsTexture!==null,instancing:Re,instancingColor:Re&&V.instanceColor!==null,instancingMorph:Re&&V.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Na,alphaToCoverage:!!S.alphaToCoverage,map:tt,matcap:kt,envMap:at,envMapMode:at&&K.mapping,envMapCubeUVHeight:ne,aoMap:zt,lightMap:k,bumpMap:wt,normalMap:Mt,displacementMap:p&&Nt,emissiveMap:je,normalMapObjectSpace:Mt&&S.normalMapType===kp,normalMapTangentSpace:Mt&&S.normalMapType===Gh,metalnessMap:Gt,roughnessMap:ot,anisotropy:vt,anisotropyMap:ae,clearcoat:U,clearcoatMap:et,clearcoatNormalMap:Ue,clearcoatRoughnessMap:nt,dispersion:A,iridescence:J,iridescenceMap:qe,iridescenceThicknessMap:_e,sheen:de,sheenColorMap:Pe,sheenRoughnessMap:ht,specularMap:ct,specularColorMap:We,specularIntensityMap:dt,transmission:ge,transmissionMap:H,thicknessMap:Ge,gradientMap:Oe,opaque:S.transparent===!1&&S.blending===Ca&&S.alphaToCoverage===!1,alphaMap:ze,alphaTest:Se,alphaHash:pe,combine:S.combine,mapUv:tt&&M(S.map.channel),aoMapUv:zt&&M(S.aoMap.channel),lightMapUv:k&&M(S.lightMap.channel),bumpMapUv:wt&&M(S.bumpMap.channel),normalMapUv:Mt&&M(S.normalMap.channel),displacementMapUv:Nt&&M(S.displacementMap.channel),emissiveMapUv:je&&M(S.emissiveMap.channel),metalnessMapUv:Gt&&M(S.metalnessMap.channel),roughnessMapUv:ot&&M(S.roughnessMap.channel),anisotropyMapUv:ae&&M(S.anisotropyMap.channel),clearcoatMapUv:et&&M(S.clearcoatMap.channel),clearcoatNormalMapUv:Ue&&M(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&M(S.clearcoatRoughnessMap.channel),iridescenceMapUv:qe&&M(S.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&M(S.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&M(S.sheenColorMap.channel),sheenRoughnessMapUv:ht&&M(S.sheenRoughnessMap.channel),specularMapUv:ct&&M(S.specularMap.channel),specularColorMapUv:We&&M(S.specularColorMap.channel),specularIntensityMapUv:dt&&M(S.specularIntensityMap.channel),transmissionMapUv:H&&M(S.transmissionMap.channel),thicknessMapUv:Ge&&M(S.thicknessMap.channel),alphaMapUv:ze&&M(S.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(Mt||vt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!te.attributes.uv&&(tt||ze),fog:!!j,useFog:S.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:V.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Ye,morphTextureStride:D,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:ut,decodeVideoTexture:tt&&S.map.isVideoTexture===!0&&Ft.getTransfer(S.map.colorSpace)===Wt,decodeVideoTextureEmissive:je&&S.emissiveMap.isVideoTexture===!0&&Ft.getTransfer(S.emissiveMap.colorSpace)===Wt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===yt,flipSided:S.side===In,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ke&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ke&&S.extensions.multiDraw===!0||ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Bt.vertexUv1s=h.has(1),Bt.vertexUv2s=h.has(2),Bt.vertexUv3s=h.has(3),h.clear(),Bt}function f(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)b.push(L),b.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(y(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){l.disableAll(),b.supportsVertexTextures&&l.enable(0),b.instancing&&l.enable(1),b.instancingColor&&l.enable(2),b.instancingMorph&&l.enable(3),b.matcap&&l.enable(4),b.envMap&&l.enable(5),b.normalMapObjectSpace&&l.enable(6),b.normalMapTangentSpace&&l.enable(7),b.clearcoat&&l.enable(8),b.iridescence&&l.enable(9),b.alphaTest&&l.enable(10),b.vertexColors&&l.enable(11),b.vertexAlphas&&l.enable(12),b.vertexUv1s&&l.enable(13),b.vertexUv2s&&l.enable(14),b.vertexUv3s&&l.enable(15),b.vertexTangents&&l.enable(16),b.anisotropy&&l.enable(17),b.alphaHash&&l.enable(18),b.batching&&l.enable(19),b.dispersion&&l.enable(20),b.batchingColor&&l.enable(21),b.gradientMap&&l.enable(22),S.push(l.mask),l.disableAll(),b.fog&&l.enable(0),b.useFog&&l.enable(1),b.flatShading&&l.enable(2),b.logarithmicDepthBuffer&&l.enable(3),b.reversedDepthBuffer&&l.enable(4),b.skinning&&l.enable(5),b.morphTargets&&l.enable(6),b.morphNormals&&l.enable(7),b.morphColors&&l.enable(8),b.premultipliedAlpha&&l.enable(9),b.shadowMapEnabled&&l.enable(10),b.doubleSided&&l.enable(11),b.flipSided&&l.enable(12),b.useDepthPacking&&l.enable(13),b.dithering&&l.enable(14),b.transmission&&l.enable(15),b.sheen&&l.enable(16),b.opaque&&l.enable(17),b.pointsUvs&&l.enable(18),b.decodeVideoTexture&&l.enable(19),b.decodeVideoTextureEmissive&&l.enable(20),b.alphaToCoverage&&l.enable(21),S.push(l.mask)}function _(S){const b=x[S.type];let L;if(b){const I=Ai[b];L=Lr.clone(I.uniforms)}else L=S.uniforms;return L}function E(S,b){let L;for(let I=0,V=d.length;I<V;I++){const j=d[I];if(j.cacheKey===b){L=j,++L.usedTimes;break}}return L===void 0&&(L=new Nv(n,b,S,a),d.push(L)),L}function T(S){if(--S.usedTimes===0){const b=d.indexOf(S);d[b]=d[d.length-1],d.pop(),S.destroy()}}function C(S){c.remove(S)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:C,programs:d,dispose:R}}function Gv(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let l=n.get(r);return l===void 0&&(l={},n.set(r,l)),l}function i(r){n.delete(r)}function s(r,l,c){n.get(r)[l]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Hv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Fu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function zu(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,p,m,x,M,g){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:p,material:m,groupOrder:x,renderOrder:u.renderOrder,z:M,group:g},n[e]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=m,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=M,f.group=g),e++,f}function l(u,p,m,x,M,g){const f=r(u,p,m,x,M,g);m.transmission>0?i.push(f):m.transparent===!0?s.push(f):t.push(f)}function c(u,p,m,x,M,g){const f=r(u,p,m,x,M,g);m.transmission>0?i.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,p){t.length>1&&t.sort(u||Hv),i.length>1&&i.sort(p||Fu),s.length>1&&s.sort(p||Fu)}function d(){for(let u=e,p=n.length;u<p;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:d,sort:h}}function Wv(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new zu,n.set(i,[r])):s>=a.length?(r=new zu,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Xv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new rt};break;case"SpotLight":t={position:new P,direction:new P,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function qv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Yv=0;function $v(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Zv(n){const e=new Xv,t=qv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);const s=new P,a=new _t,r=new _t;function l(h){let d=0,u=0,p=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let m=0,x=0,M=0,g=0,f=0,y=0,v=0,_=0,E=0,T=0,C=0;h.sort($v);for(let S=0,b=h.length;S<b;S++){const L=h[S],I=L.color,V=L.intensity,j=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=I.r*V,u+=I.g*V,p+=I.b*V;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],V);C++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=te,i.directionalShadowMatrix[m]=L.shadow.matrix,y++}i.directional[m]=q,m++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(I).multiplyScalar(V),q.distance=j,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const K=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,K.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=K.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,_++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(I).multiplyScalar(V),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,ne.shadowCameraNear=K.camera.near,ne.shadowCameraFar=K.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(V),q.groundColor.copy(L.groundColor).multiplyScalar(V),i.hemi[f]=q,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=He.LTC_FLOAT_1,i.rectAreaLTC2=He.LTC_FLOAT_2):(i.rectAreaLTC1=He.LTC_HALF_1,i.rectAreaLTC2=He.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=p;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==M||R.rectAreaLength!==g||R.hemiLength!==f||R.numDirectionalShadows!==y||R.numPointShadows!==v||R.numSpotShadows!==_||R.numSpotMaps!==E||R.numLightProbes!==C)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,R.directionalLength=m,R.pointLength=x,R.spotLength=M,R.rectAreaLength=g,R.hemiLength=f,R.numDirectionalShadows=y,R.numPointShadows=v,R.numSpotShadows=_,R.numSpotMaps=E,R.numLightProbes=C,i.version=Yv++)}function c(h,d){let u=0,p=0,m=0,x=0,M=0;const g=d.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){const v=h[f];if(v.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(v.isSpotLight){const _=i.spot[m];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const _=i.rectArea[x];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const _=i.point[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const _=i.hemi[M];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(g),M++}}}return{setup:l,setupView:c,state:i}}function Nu(n){const e=new Zv(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function l(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:r}}function Kv(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let l;return r===void 0?(l=new Nu(n),e.set(s,[l])):a>=r.length?(l=new Nu(n),r.push(l)):l=r[a],l}function i(){e=new WeakMap}return{get:t,dispose:i}}const Jv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jv=`uniform sampler2D shadow_pass;
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
}`;function Qv(n,e,t){let i=new $h;const s=new Fe,a=new Fe,r=new Yt,l=new _x({depthPacking:Op}),c=new yx,h={},d=t.maxTextureSize,u={[Ss]:In,[In]:Ss,[yt]:yt},p=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:Jv,fragmentShader:jv}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Zt;x.setAttribute("position",new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new O(x,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=uf;let f=this.type;this.render=function(T,C,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const S=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Ui),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const V=f!==Ji&&this.type===Ji,j=f===Ji&&this.type!==Ji;for(let te=0,q=T.length;te<q;te++){const K=T[te],ne=K.shadow;if(ne===void 0){gt("WebGLShadowMap:",K,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const fe=ne.getFrameExtents();if(s.multiply(fe),a.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/fe.x),s.x=a.x*fe.x,ne.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/fe.y),s.y=a.y*fe.y,ne.mapSize.y=a.y)),ne.map===null||V===!0||j===!0){const Ye=this.type!==Ji?{minFilter:Kn,magFilter:Kn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new _i(s.x,s.y,Ye),ne.map.texture.name=K.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let Ye=0;Ye<ve;Ye++){const D=ne.getViewport(Ye);r.set(a.x*D.x,a.y*D.y,a.x*D.z,a.y*D.w),I.viewport(r),ne.updateMatrices(K,Ye),i=ne.getFrustum(),_(C,R,ne.camera,K,this.type)}ne.isPointLightShadow!==!0&&this.type===Ji&&y(ne,R),ne.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(S,b,L)};function y(T,C){const R=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new _i(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,R,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,R,m,M,null)}function v(T,C,R,S){let b=null;const L=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)b=L;else if(b=R.isPointLight===!0?c:l,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const I=b.uuid,V=C.uuid;let j=h[I];j===void 0&&(j={},h[I]=j);let te=j[V];te===void 0&&(te=b.clone(),j[V]=te,C.addEventListener("dispose",E)),b=te}if(b.visible=C.visible,b.wireframe=C.wireframe,S===Ji?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=R}return b}function _(T,C,R,S,b){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Ji)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const V=e.update(T),j=T.material;if(Array.isArray(j)){const te=V.groups;for(let q=0,K=te.length;q<K;q++){const ne=te[q],fe=j[ne.materialIndex];if(fe&&fe.visible){const ve=v(T,fe,S,b);T.onBeforeShadow(n,T,C,R,V,ve,ne),n.renderBufferDirect(R,null,V,ve,T,ne),T.onAfterShadow(n,T,C,R,V,ve,ne)}}}else if(j.visible){const te=v(T,j,S,b);T.onBeforeShadow(n,T,C,R,V,te,null),n.renderBufferDirect(R,null,V,te,T,null),T.onAfterShadow(n,T,C,R,V,te,null)}}const I=T.children;for(let V=0,j=I.length;V<j;V++)_(I[V],C,R,S,b)}function E(T){T.target.removeEventListener("dispose",E);for(const R in h){const S=h[R],b=T.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const eM={[Sc]:Tc,[Ec]:Rc,[Ac]:Pc,[Ua]:Cc,[Tc]:Sc,[Rc]:Ec,[Pc]:Ac,[Cc]:Ua};function tM(n,e){function t(){let H=!1;const Ge=new Yt;let Oe=null;const ze=new Yt(0,0,0,0);return{setMask:function(Se){Oe!==Se&&!H&&(n.colorMask(Se,Se,Se,Se),Oe=Se)},setLocked:function(Se){H=Se},setClear:function(Se,pe,Ke,ut,Bt){Bt===!0&&(Se*=ut,pe*=ut,Ke*=ut),Ge.set(Se,pe,Ke,ut),ze.equals(Ge)===!1&&(n.clearColor(Se,pe,Ke,ut),ze.copy(Ge))},reset:function(){H=!1,Oe=null,ze.set(-1,0,0,0)}}}function i(){let H=!1,Ge=!1,Oe=null,ze=null,Se=null;return{setReversed:function(pe){if(Ge!==pe){const Ke=e.get("EXT_clip_control");pe?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ge=pe;const ut=Se;Se=null,this.setClear(ut)}},getReversed:function(){return Ge},setTest:function(pe){pe?Z(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(pe){Oe!==pe&&!H&&(n.depthMask(pe),Oe=pe)},setFunc:function(pe){if(Ge&&(pe=eM[pe]),ze!==pe){switch(pe){case Sc:n.depthFunc(n.NEVER);break;case Tc:n.depthFunc(n.ALWAYS);break;case Ec:n.depthFunc(n.LESS);break;case Ua:n.depthFunc(n.LEQUAL);break;case Ac:n.depthFunc(n.EQUAL);break;case Cc:n.depthFunc(n.GEQUAL);break;case Rc:n.depthFunc(n.GREATER);break;case Pc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ze=pe}},setLocked:function(pe){H=pe},setClear:function(pe){Se!==pe&&(Ge&&(pe=1-pe),n.clearDepth(pe),Se=pe)},reset:function(){H=!1,Oe=null,ze=null,Se=null,Ge=!1}}}function s(){let H=!1,Ge=null,Oe=null,ze=null,Se=null,pe=null,Ke=null,ut=null,Bt=null;return{setTest:function(Ut){H||(Ut?Z(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Ut){Ge!==Ut&&!H&&(n.stencilMask(Ut),Ge=Ut)},setFunc:function(Ut,Nn,An){(Oe!==Ut||ze!==Nn||Se!==An)&&(n.stencilFunc(Ut,Nn,An),Oe=Ut,ze=Nn,Se=An)},setOp:function(Ut,Nn,An){(pe!==Ut||Ke!==Nn||ut!==An)&&(n.stencilOp(Ut,Nn,An),pe=Ut,Ke=Nn,ut=An)},setLocked:function(Ut){H=Ut},setClear:function(Ut){Bt!==Ut&&(n.clearStencil(Ut),Bt=Ut)},reset:function(){H=!1,Ge=null,Oe=null,ze=null,Se=null,pe=null,Ke=null,ut=null,Bt=null}}}const a=new t,r=new i,l=new s,c=new WeakMap,h=new WeakMap;let d={},u={},p=new WeakMap,m=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,C=new rt(0,0,0),R=0,S=!1,b=null,L=null,I=null,V=null,j=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,K=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=K>=1):ne.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=K>=2);let fe=null,ve={};const Ye=n.getParameter(n.SCISSOR_BOX),D=n.getParameter(n.VIEWPORT),Ie=new Yt().fromArray(Ye),ye=new Yt().fromArray(D);function Ce(H,Ge,Oe,ze){const Se=new Uint8Array(4),pe=n.createTexture();n.bindTexture(H,pe),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ke=0;Ke<Oe;Ke++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ge,0,n.RGBA,1,1,ze,0,n.RGBA,n.UNSIGNED_BYTE,Se):n.texImage2D(Ge+Ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Se);return pe}const $={};$[n.TEXTURE_2D]=Ce(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Ce(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Ce(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Ce(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),l.setClear(0),Z(n.DEPTH_TEST),r.setFunc(Ua),wt(!1),Mt(Ad),Z(n.CULL_FACE),zt(Ui);function Z(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function we(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Re(H,Ge){return u[H]!==Ge?(n.bindFramebuffer(H,Ge),u[H]=Ge,H===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ge),H===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ge),!0):!1}function ke(H,Ge){let Oe=m,ze=!1;if(H){Oe=p.get(Ge),Oe===void 0&&(Oe=[],p.set(Ge,Oe));const Se=H.textures;if(Oe.length!==Se.length||Oe[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,Ke=Se.length;pe<Ke;pe++)Oe[pe]=n.COLOR_ATTACHMENT0+pe;Oe.length=Se.length,ze=!0}}else Oe[0]!==n.BACK&&(Oe[0]=n.BACK,ze=!0);ze&&n.drawBuffers(Oe)}function tt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const kt={[Bs]:n.FUNC_ADD,[gp]:n.FUNC_SUBTRACT,[vp]:n.FUNC_REVERSE_SUBTRACT};kt[Mp]=n.MIN,kt[_p]=n.MAX;const at={[yp]:n.ZERO,[bp]:n.ONE,[wp]:n.SRC_COLOR,[bc]:n.SRC_ALPHA,[Rp]:n.SRC_ALPHA_SATURATE,[Ap]:n.DST_COLOR,[Tp]:n.DST_ALPHA,[Sp]:n.ONE_MINUS_SRC_COLOR,[wc]:n.ONE_MINUS_SRC_ALPHA,[Cp]:n.ONE_MINUS_DST_COLOR,[Ep]:n.ONE_MINUS_DST_ALPHA,[Pp]:n.CONSTANT_COLOR,[Lp]:n.ONE_MINUS_CONSTANT_COLOR,[Dp]:n.CONSTANT_ALPHA,[Ip]:n.ONE_MINUS_CONSTANT_ALPHA};function zt(H,Ge,Oe,ze,Se,pe,Ke,ut,Bt,Ut){if(H===Ui){M===!0&&(we(n.BLEND),M=!1);return}if(M===!1&&(Z(n.BLEND),M=!0),H!==xp){if(H!==g||Ut!==S){if((f!==Bs||_!==Bs)&&(n.blendEquation(n.FUNC_ADD),f=Bs,_=Bs),Ut)switch(H){case Ca:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case si:n.blendFunc(n.ONE,n.ONE);break;case Cd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Rd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:an("WebGLState: Invalid blending: ",H);break}else switch(H){case Ca:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case si:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Cd:an("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rd:an("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:an("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,T=null,C.set(0,0,0),R=0,g=H,S=Ut}return}Se=Se||Ge,pe=pe||Oe,Ke=Ke||ze,(Ge!==f||Se!==_)&&(n.blendEquationSeparate(kt[Ge],kt[Se]),f=Ge,_=Se),(Oe!==y||ze!==v||pe!==E||Ke!==T)&&(n.blendFuncSeparate(at[Oe],at[ze],at[pe],at[Ke]),y=Oe,v=ze,E=pe,T=Ke),(ut.equals(C)===!1||Bt!==R)&&(n.blendColor(ut.r,ut.g,ut.b,Bt),C.copy(ut),R=Bt),g=H,S=!1}function k(H,Ge){H.side===yt?we(n.CULL_FACE):Z(n.CULL_FACE);let Oe=H.side===In;Ge&&(Oe=!Oe),wt(Oe),H.blending===Ca&&H.transparent===!1?zt(Ui):zt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const ze=H.stencilWrite;l.setTest(ze),ze&&(l.setMask(H.stencilWriteMask),l.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),l.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),je(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function wt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function Mt(H){H!==pp?(Z(n.CULL_FACE),H!==L&&(H===Ad?n.cullFace(n.BACK):H===mp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),L=H}function Nt(H){H!==I&&(q&&n.lineWidth(H),I=H)}function je(H,Ge,Oe){H?(Z(n.POLYGON_OFFSET_FILL),(V!==Ge||j!==Oe)&&(n.polygonOffset(Ge,Oe),V=Ge,j=Oe)):we(n.POLYGON_OFFSET_FILL)}function Gt(H){H?Z(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+te-1),fe!==H&&(n.activeTexture(H),fe=H)}function vt(H,Ge,Oe){Oe===void 0&&(fe===null?Oe=n.TEXTURE0+te-1:Oe=fe);let ze=ve[Oe];ze===void 0&&(ze={type:void 0,texture:void 0},ve[Oe]=ze),(ze.type!==H||ze.texture!==Ge)&&(fe!==Oe&&(n.activeTexture(Oe),fe=Oe),n.bindTexture(H,Ge||$[H]),ze.type=H,ze.texture=Ge)}function U(){const H=ve[fe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function de(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ae(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ue(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function nt(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function qe(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function _e(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Pe(H){Ie.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Ie.copy(H))}function ht(H){ye.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),ye.copy(H))}function ct(H,Ge){let Oe=h.get(Ge);Oe===void 0&&(Oe=new WeakMap,h.set(Ge,Oe));let ze=Oe.get(H);ze===void 0&&(ze=n.getUniformBlockIndex(Ge,H.name),Oe.set(H,ze))}function We(H,Ge){const ze=h.get(Ge).get(H);c.get(Ge)!==ze&&(n.uniformBlockBinding(Ge,ze,H.__bindingPointIndex),c.set(Ge,ze))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},fe=null,ve={},u={},p=new WeakMap,m=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,C=new rt(0,0,0),R=0,S=!1,b=null,L=null,I=null,V=null,j=null,Ie.set(0,0,n.canvas.width,n.canvas.height),ye.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),l.reset()}return{buffers:{color:a,depth:r,stencil:l},enable:Z,disable:we,bindFramebuffer:Re,drawBuffers:ke,useProgram:tt,setBlending:zt,setMaterial:k,setFlipSided:wt,setCullFace:Mt,setLineWidth:Nt,setPolygonOffset:je,setScissorTest:Gt,activeTexture:ot,bindTexture:vt,unbindTexture:U,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:qe,texImage3D:_e,updateUBOMapping:ct,uniformBlockBinding:We,texStorage2D:Ue,texStorage3D:nt,texSubImage2D:de,texSubImage3D:ge,compressedTexSubImage2D:ae,compressedTexSubImage3D:et,scissor:Pe,viewport:ht,reset:dt}}function nM(n,e,t,i,s,a,r){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Fe,d=new WeakMap;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(U,A){return m?new OffscreenCanvas(U,A):Ko("canvas")}function M(U,A,J){let de=1;const ge=vt(U);if((ge.width>J||ge.height>J)&&(de=J/Math.max(ge.width,ge.height)),de<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ae=Math.floor(de*ge.width),et=Math.floor(de*ge.height);u===void 0&&(u=x(ae,et));const Ue=A?x(ae,et):u;return Ue.width=ae,Ue.height=et,Ue.getContext("2d").drawImage(U,0,0,ae,et),gt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+ae+"x"+et+")."),Ue}else return"data"in U&&gt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),U;return U}function g(U){return U.generateMipmaps}function f(U){n.generateMipmap(U)}function y(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(U,A,J,de,ge=!1){if(U!==null){if(n[U]!==void 0)return n[U];gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ae=A;if(A===n.RED&&(J===n.FLOAT&&(ae=n.R32F),J===n.HALF_FLOAT&&(ae=n.R16F),J===n.UNSIGNED_BYTE&&(ae=n.R8)),A===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.R8UI),J===n.UNSIGNED_SHORT&&(ae=n.R16UI),J===n.UNSIGNED_INT&&(ae=n.R32UI),J===n.BYTE&&(ae=n.R8I),J===n.SHORT&&(ae=n.R16I),J===n.INT&&(ae=n.R32I)),A===n.RG&&(J===n.FLOAT&&(ae=n.RG32F),J===n.HALF_FLOAT&&(ae=n.RG16F),J===n.UNSIGNED_BYTE&&(ae=n.RG8)),A===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RG8UI),J===n.UNSIGNED_SHORT&&(ae=n.RG16UI),J===n.UNSIGNED_INT&&(ae=n.RG32UI),J===n.BYTE&&(ae=n.RG8I),J===n.SHORT&&(ae=n.RG16I),J===n.INT&&(ae=n.RG32I)),A===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGB8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGB16UI),J===n.UNSIGNED_INT&&(ae=n.RGB32UI),J===n.BYTE&&(ae=n.RGB8I),J===n.SHORT&&(ae=n.RGB16I),J===n.INT&&(ae=n.RGB32I)),A===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(ae=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(ae=n.RGBA16UI),J===n.UNSIGNED_INT&&(ae=n.RGBA32UI),J===n.BYTE&&(ae=n.RGBA8I),J===n.SHORT&&(ae=n.RGBA16I),J===n.INT&&(ae=n.RGBA32I)),A===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(ae=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(ae=n.R11F_G11F_B10F)),A===n.RGBA){const et=ge?$o:Ft.getTransfer(de);J===n.FLOAT&&(ae=n.RGBA32F),J===n.HALF_FLOAT&&(ae=n.RGBA16F),J===n.UNSIGNED_BYTE&&(ae=et===Wt?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(ae=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(ae=n.RGB5_A1)}return(ae===n.R16F||ae===n.R32F||ae===n.RG16F||ae===n.RG32F||ae===n.RGBA16F||ae===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function _(U,A){let J;return U?A===null||A===Ks||A===Er?J=n.DEPTH24_STENCIL8:A===Li?J=n.DEPTH32F_STENCIL8:A===Tr&&(J=n.DEPTH24_STENCIL8,gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ks||A===Er?J=n.DEPTH_COMPONENT24:A===Li?J=n.DEPTH_COMPONENT32F:A===Tr&&(J=n.DEPTH_COMPONENT16),J}function E(U,A){return g(U)===!0||U.isFramebufferTexture&&U.minFilter!==Kn&&U.minFilter!==ai?Math.log2(Math.max(A.width,A.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?A.mipmaps.length:1}function T(U){const A=U.target;A.removeEventListener("dispose",T),R(A),A.isVideoTexture&&d.delete(A)}function C(U){const A=U.target;A.removeEventListener("dispose",C),b(A)}function R(U){const A=i.get(U);if(A.__webglInit===void 0)return;const J=U.source,de=p.get(J);if(de){const ge=de[A.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&S(U),Object.keys(de).length===0&&p.delete(J)}i.remove(U)}function S(U){const A=i.get(U);n.deleteTexture(A.__webglTexture);const J=U.source,de=p.get(J);delete de[A.__cacheKey],r.memory.textures--}function b(U){const A=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(A.__webglFramebuffer[de]))for(let ge=0;ge<A.__webglFramebuffer[de].length;ge++)n.deleteFramebuffer(A.__webglFramebuffer[de][ge]);else n.deleteFramebuffer(A.__webglFramebuffer[de]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[de])}else{if(Array.isArray(A.__webglFramebuffer))for(let de=0;de<A.__webglFramebuffer.length;de++)n.deleteFramebuffer(A.__webglFramebuffer[de]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let de=0;de<A.__webglColorRenderbuffer.length;de++)A.__webglColorRenderbuffer[de]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[de]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=U.textures;for(let de=0,ge=J.length;de<ge;de++){const ae=i.get(J[de]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),r.memory.textures--),i.remove(J[de])}i.remove(U)}let L=0;function I(){L=0}function V(){const U=L;return U>=s.maxTextures&&gt("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),L+=1,U}function j(U){const A=[];return A.push(U.wrapS),A.push(U.wrapT),A.push(U.wrapR||0),A.push(U.magFilter),A.push(U.minFilter),A.push(U.anisotropy),A.push(U.internalFormat),A.push(U.format),A.push(U.type),A.push(U.generateMipmaps),A.push(U.premultiplyAlpha),A.push(U.flipY),A.push(U.unpackAlignment),A.push(U.colorSpace),A.join()}function te(U,A){const J=i.get(U);if(U.isVideoTexture&&Gt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&J.__version!==U.version){const de=U.image;if(de===null)gt("WebGLRenderer: Texture marked for update but no image data found.");else if(de.complete===!1)gt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,U,A);return}}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+A)}function q(U,A){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,A);return}else U.isExternalTexture&&(J.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+A)}function K(U,A){const J=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&J.__version!==U.version){$(J,U,A);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+A)}function ne(U,A){const J=i.get(U);if(U.version>0&&J.__version!==U.version){Z(J,U,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+A)}const fe={[zn]:n.REPEAT,[es]:n.CLAMP_TO_EDGE,[Ic]:n.MIRRORED_REPEAT},ve={[Kn]:n.NEAREST,[zp]:n.NEAREST_MIPMAP_NEAREST,[eo]:n.NEAREST_MIPMAP_LINEAR,[ai]:n.LINEAR,[Cl]:n.LINEAR_MIPMAP_NEAREST,[Gs]:n.LINEAR_MIPMAP_LINEAR},Ye={[Bp]:n.NEVER,[qp]:n.ALWAYS,[Vp]:n.LESS,[Af]:n.LEQUAL,[Gp]:n.EQUAL,[Xp]:n.GEQUAL,[Hp]:n.GREATER,[Wp]:n.NOTEQUAL};function D(U,A){if(A.type===Li&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===ai||A.magFilter===Cl||A.magFilter===eo||A.magFilter===Gs||A.minFilter===ai||A.minFilter===Cl||A.minFilter===eo||A.minFilter===Gs)&&gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,fe[A.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,fe[A.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,fe[A.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,ve[A.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,ve[A.minFilter]),A.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,Ye[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Kn||A.minFilter!==eo&&A.minFilter!==Gs||A.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(U,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Ie(U,A){let J=!1;U.__webglInit===void 0&&(U.__webglInit=!0,A.addEventListener("dispose",T));const de=A.source;let ge=p.get(de);ge===void 0&&(ge={},p.set(de,ge));const ae=j(A);if(ae!==U.__cacheKey){ge[ae]===void 0&&(ge[ae]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,J=!0),ge[ae].usedTimes++;const et=ge[U.__cacheKey];et!==void 0&&(ge[U.__cacheKey].usedTimes--,et.usedTimes===0&&S(A)),U.__cacheKey=ae,U.__webglTexture=ge[ae].texture}return J}function ye(U,A,J){return Math.floor(Math.floor(U/J)/A)}function Ce(U,A,J,de){const ae=U.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,J,de,A.data);else{ae.sort((_e,Pe)=>_e.start-Pe.start);let et=0;for(let _e=1;_e<ae.length;_e++){const Pe=ae[et],ht=ae[_e],ct=Pe.start+Pe.count,We=ye(ht.start,A.width,4),dt=ye(Pe.start,A.width,4);ht.start<=ct+1&&We===dt&&ye(ht.start+ht.count-1,A.width,4)===We?Pe.count=Math.max(Pe.count,ht.start+ht.count-Pe.start):(++et,ae[et]=ht)}ae.length=et+1;const Ue=n.getParameter(n.UNPACK_ROW_LENGTH),nt=n.getParameter(n.UNPACK_SKIP_PIXELS),qe=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let _e=0,Pe=ae.length;_e<Pe;_e++){const ht=ae[_e],ct=Math.floor(ht.start/4),We=Math.ceil(ht.count/4),dt=ct%A.width,H=Math.floor(ct/A.width),Ge=We,Oe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,dt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,dt,H,Ge,Oe,J,de,A.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Ue),n.pixelStorei(n.UNPACK_SKIP_PIXELS,nt),n.pixelStorei(n.UNPACK_SKIP_ROWS,qe)}}function $(U,A,J){let de=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(de=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(de=n.TEXTURE_3D);const ge=Ie(U,A),ae=A.source;t.bindTexture(de,U.__webglTexture,n.TEXTURE0+J);const et=i.get(ae);if(ae.version!==et.__version||ge===!0){t.activeTexture(n.TEXTURE0+J);const Ue=Ft.getPrimaries(Ft.workingColorSpace),nt=A.colorSpace===gs?null:Ft.getPrimaries(A.colorSpace),qe=A.colorSpace===gs||Ue===nt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let _e=M(A.image,!1,s.maxTextureSize);_e=ot(A,_e);const Pe=a.convert(A.format,A.colorSpace),ht=a.convert(A.type);let ct=v(A.internalFormat,Pe,ht,A.colorSpace,A.isVideoTexture);D(de,A);let We;const dt=A.mipmaps,H=A.isVideoTexture!==!0,Ge=et.__version===void 0||ge===!0,Oe=ae.dataReady,ze=E(A,_e);if(A.isDepthTexture)ct=_(A.format===Cr,A.type),Ge&&(H?t.texStorage2D(n.TEXTURE_2D,1,ct,_e.width,_e.height):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Pe,ht,null));else if(A.isDataTexture)if(dt.length>0){H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Pe,ht,We.data):t.texImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,Pe,ht,We.data);A.generateMipmaps=!1}else H?(Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height),Oe&&Ce(A,_e,Pe,ht)):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Pe,ht,_e.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){H&&Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,dt[0].width,dt[0].height,_e.depth);for(let Se=0,pe=dt.length;Se<pe;Se++)if(We=dt[Se],A.format!==vi)if(Pe!==null)if(H){if(Oe)if(A.layerUpdates.size>0){const Ke=mu(We.width,We.height,A.format,A.type);for(const ut of A.layerUpdates){const Bt=We.data.subarray(ut*Ke/We.data.BYTES_PER_ELEMENT,(ut+1)*Ke/We.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,ut,We.width,We.height,1,Pe,Bt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,We.width,We.height,_e.depth,Pe,We.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Se,ct,We.width,We.height,_e.depth,0,We.data,0,0);else gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Oe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,We.width,We.height,_e.depth,Pe,ht,We.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Se,ct,We.width,We.height,_e.depth,0,Pe,ht,We.data)}else{H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],A.format!==vi?Pe!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Pe,We.data):t.compressedTexImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,We.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,We.width,We.height,Pe,ht,We.data):t.texImage2D(n.TEXTURE_2D,Se,ct,We.width,We.height,0,Pe,ht,We.data)}else if(A.isDataArrayTexture)if(H){if(Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,_e.width,_e.height,_e.depth),Oe)if(A.layerUpdates.size>0){const Se=mu(_e.width,_e.height,A.format,A.type);for(const pe of A.layerUpdates){const Ke=_e.data.subarray(pe*Se/_e.data.BYTES_PER_ELEMENT,(pe+1)*Se/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,_e.width,_e.height,1,Pe,ht,Ke)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Pe,ht,_e.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,_e.width,_e.height,_e.depth,0,Pe,ht,_e.data);else if(A.isData3DTexture)H?(Ge&&t.texStorage3D(n.TEXTURE_3D,ze,ct,_e.width,_e.height,_e.depth),Oe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Pe,ht,_e.data)):t.texImage3D(n.TEXTURE_3D,0,ct,_e.width,_e.height,_e.depth,0,Pe,ht,_e.data);else if(A.isFramebufferTexture){if(Ge)if(H)t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height);else{let Se=_e.width,pe=_e.height;for(let Ke=0;Ke<ze;Ke++)t.texImage2D(n.TEXTURE_2D,Ke,ct,Se,pe,0,Pe,ht,null),Se>>=1,pe>>=1}}else if(dt.length>0){if(H&&Ge){const Se=vt(dt[0]);t.texStorage2D(n.TEXTURE_2D,ze,ct,Se.width,Se.height)}for(let Se=0,pe=dt.length;Se<pe;Se++)We=dt[Se],H?Oe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,Pe,ht,We):t.texImage2D(n.TEXTURE_2D,Se,ct,Pe,ht,We);A.generateMipmaps=!1}else if(H){if(Ge){const Se=vt(_e);t.texStorage2D(n.TEXTURE_2D,ze,ct,Se.width,Se.height)}Oe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Pe,ht,_e)}else t.texImage2D(n.TEXTURE_2D,0,ct,Pe,ht,_e);g(A)&&f(de),et.__version=ae.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function Z(U,A,J){if(A.image.length!==6)return;const de=Ie(U,A),ge=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+J);const ae=i.get(ge);if(ge.version!==ae.__version||de===!0){t.activeTexture(n.TEXTURE0+J);const et=Ft.getPrimaries(Ft.workingColorSpace),Ue=A.colorSpace===gs?null:Ft.getPrimaries(A.colorSpace),nt=A.colorSpace===gs||et===Ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);const qe=A.isCompressedTexture||A.image[0].isCompressedTexture,_e=A.image[0]&&A.image[0].isDataTexture,Pe=[];for(let pe=0;pe<6;pe++)!qe&&!_e?Pe[pe]=M(A.image[pe],!0,s.maxCubemapSize):Pe[pe]=_e?A.image[pe].image:A.image[pe],Pe[pe]=ot(A,Pe[pe]);const ht=Pe[0],ct=a.convert(A.format,A.colorSpace),We=a.convert(A.type),dt=v(A.internalFormat,ct,We,A.colorSpace),H=A.isVideoTexture!==!0,Ge=ae.__version===void 0||de===!0,Oe=ge.dataReady;let ze=E(A,ht);D(n.TEXTURE_CUBE_MAP,A);let Se;if(qe){H&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,ht.width,ht.height);for(let pe=0;pe<6;pe++){Se=Pe[pe].mipmaps;for(let Ke=0;Ke<Se.length;Ke++){const ut=Se[Ke];A.format!==vi?ct!==null?H?Oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,ut.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ut.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,ut.width,ut.height,ct,We,ut.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,dt,ut.width,ut.height,0,ct,We,ut.data)}}}else{if(Se=A.mipmaps,H&&Ge){Se.length>0&&ze++;const pe=vt(Pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(_e){H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Pe[pe].width,Pe[pe].height,ct,We,Pe[pe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,Pe[pe].width,Pe[pe].height,0,ct,We,Pe[pe].data);for(let Ke=0;Ke<Se.length;Ke++){const Bt=Se[Ke].image[pe].image;H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,Bt.width,Bt.height,ct,We,Bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,Bt.width,Bt.height,0,ct,We,Bt.data)}}else{H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ct,We,Pe[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,dt,ct,We,Pe[pe]);for(let Ke=0;Ke<Se.length;Ke++){const ut=Se[Ke];H?Oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,ct,We,ut.image[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,dt,ct,We,ut.image[pe])}}}g(A)&&f(n.TEXTURE_CUBE_MAP),ae.__version=ge.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function we(U,A,J,de,ge,ae){const et=a.convert(J.format,J.colorSpace),Ue=a.convert(J.type),nt=v(J.internalFormat,et,Ue,J.colorSpace),qe=i.get(A),_e=i.get(J);if(_e.__renderTarget=A,!qe.__hasExternalTextures){const Pe=Math.max(1,A.width>>ae),ht=Math.max(1,A.height>>ae);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,ae,nt,Pe,ht,A.depth,0,et,Ue,null):t.texImage2D(ge,ae,nt,Pe,ht,0,et,Ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,U),je(A)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ge,_e.__webglTexture,0,Nt(A)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,de,ge,_e.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Re(U,A,J){if(n.bindRenderbuffer(n.RENDERBUFFER,U),A.depthBuffer){const de=A.depthTexture,ge=de&&de.isDepthTexture?de.type:null,ae=_(A.stencilBuffer,ge),et=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ue=Nt(A);je(A)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ue,ae,A.width,A.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ue,ae,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,ae,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,U)}else{const de=A.textures;for(let ge=0;ge<de.length;ge++){const ae=de[ge],et=a.convert(ae.format,ae.colorSpace),Ue=a.convert(ae.type),nt=v(ae.internalFormat,et,Ue,ae.colorSpace),qe=Nt(A);J&&je(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,qe,nt,A.width,A.height):je(A)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,qe,nt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,nt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ke(U,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,U),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const de=i.get(A.depthTexture);de.__renderTarget=A,(!de.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const ge=de.__webglTexture,ae=Nt(A);if(A.depthTexture.format===Ar)je(A)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(A.depthTexture.format===Cr)je(A)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function tt(U){const A=i.get(U),J=U.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==U.depthTexture){const de=U.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),de){const ge=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,de.removeEventListener("dispose",ge)};de.addEventListener("dispose",ge),A.__depthDisposeCallback=ge}A.__boundDepthTexture=de}if(U.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const de=U.texture.mipmaps;de&&de.length>0?ke(A.__webglFramebuffer[0],U):ke(A.__webglFramebuffer,U)}else if(J){A.__webglDepthbuffer=[];for(let de=0;de<6;de++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[de]),A.__webglDepthbuffer[de]===void 0)A.__webglDepthbuffer[de]=n.createRenderbuffer(),Re(A.__webglDepthbuffer[de],U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer[de];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}else{const de=U.texture.mipmaps;if(de&&de.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),Re(A.__webglDepthbuffer,U,!1);else{const ge=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function kt(U,A,J){const de=i.get(U);A!==void 0&&we(de.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&tt(U)}function at(U){const A=U.texture,J=i.get(U),de=i.get(A);U.addEventListener("dispose",C);const ge=U.textures,ae=U.isWebGLCubeRenderTarget===!0,et=ge.length>1;if(et||(de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture()),de.__version=A.version,r.memory.textures++),ae){J.__webglFramebuffer=[];for(let Ue=0;Ue<6;Ue++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Ue]=[];for(let nt=0;nt<A.mipmaps.length;nt++)J.__webglFramebuffer[Ue][nt]=n.createFramebuffer()}else J.__webglFramebuffer[Ue]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ue=0;Ue<A.mipmaps.length;Ue++)J.__webglFramebuffer[Ue]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(et)for(let Ue=0,nt=ge.length;Ue<nt;Ue++){const qe=i.get(ge[Ue]);qe.__webglTexture===void 0&&(qe.__webglTexture=n.createTexture(),r.memory.textures++)}if(U.samples>0&&je(U)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ue=0;Ue<ge.length;Ue++){const nt=ge[Ue];J.__webglColorRenderbuffer[Ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Ue]);const qe=a.convert(nt.format,nt.colorSpace),_e=a.convert(nt.type),Pe=v(nt.internalFormat,qe,_e,nt.colorSpace,U.isXRRenderTarget===!0),ht=Nt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,Pe,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ue,n.RENDERBUFFER,J.__webglColorRenderbuffer[Ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Re(J.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,de.__webglTexture),D(n.TEXTURE_CUBE_MAP,A);for(let Ue=0;Ue<6;Ue++)if(A.mipmaps&&A.mipmaps.length>0)for(let nt=0;nt<A.mipmaps.length;nt++)we(J.__webglFramebuffer[Ue][nt],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,nt);else we(J.__webglFramebuffer[Ue],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0);g(A)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(et){for(let Ue=0,nt=ge.length;Ue<nt;Ue++){const qe=ge[Ue],_e=i.get(qe);let Pe=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Pe=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Pe,_e.__webglTexture),D(Pe,qe),we(J.__webglFramebuffer,U,qe,n.COLOR_ATTACHMENT0+Ue,Pe,0),g(qe)&&f(Pe)}t.unbindTexture()}else{let Ue=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ue=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ue,de.__webglTexture),D(Ue,A),A.mipmaps&&A.mipmaps.length>0)for(let nt=0;nt<A.mipmaps.length;nt++)we(J.__webglFramebuffer[nt],U,A,n.COLOR_ATTACHMENT0,Ue,nt);else we(J.__webglFramebuffer,U,A,n.COLOR_ATTACHMENT0,Ue,0);g(A)&&f(Ue),t.unbindTexture()}U.depthBuffer&&tt(U)}function zt(U){const A=U.textures;for(let J=0,de=A.length;J<de;J++){const ge=A[J];if(g(ge)){const ae=y(U),et=i.get(ge).__webglTexture;t.bindTexture(ae,et),f(ae),t.unbindTexture()}}}const k=[],wt=[];function Mt(U){if(U.samples>0){if(je(U)===!1){const A=U.textures,J=U.width,de=U.height;let ge=n.COLOR_BUFFER_BIT;const ae=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=i.get(U),Ue=A.length>1;if(Ue)for(let qe=0;qe<A.length;qe++)t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer);const nt=U.texture.mipmaps;nt&&nt.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let qe=0;qe<A.length;qe++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),Ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,et.__webglColorRenderbuffer[qe]);const _e=i.get(A[qe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,J,de,0,0,J,de,ge,n.NEAREST),c===!0&&(k.length=0,wt.length=0,k.push(n.COLOR_ATTACHMENT0+qe),U.depthBuffer&&U.resolveDepthBuffer===!1&&(k.push(ae),wt.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,wt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,k))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ue)for(let qe=0;qe<A.length;qe++){t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.RENDERBUFFER,et.__webglColorRenderbuffer[qe]);const _e=i.get(A[qe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qe,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const A=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Nt(U){return Math.min(s.maxSamples,U.samples)}function je(U){const A=i.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Gt(U){const A=r.render.frame;d.get(U)!==A&&(d.set(U,A),U.update())}function ot(U,A){const J=U.colorSpace,de=U.format,ge=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||J!==Na&&J!==gs&&(Ft.getTransfer(J)===Wt?(de!==vi||ge!==Vi)&&gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):an("WebGLTextures: Unsupported texture color space:",J)),A}function vt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=I,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=ne,this.rebindTextures=kt,this.setupRenderTarget=at,this.updateRenderTargetMipmap=zt,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=we,this.useMultisampledRTT=je}function iM(n,e){function t(i,s=gs){let a;const r=Ft.getTransfer(s);if(i===Vi)return n.UNSIGNED_BYTE;if(i===Fh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===zh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===wf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Sf)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===yf)return n.BYTE;if(i===bf)return n.SHORT;if(i===Tr)return n.UNSIGNED_SHORT;if(i===Uh)return n.INT;if(i===Ks)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===Fi)return n.HALF_FLOAT;if(i===Tf)return n.ALPHA;if(i===Ef)return n.RGB;if(i===vi)return n.RGBA;if(i===Ar)return n.DEPTH_COMPONENT;if(i===Cr)return n.DEPTH_STENCIL;if(i===Nh)return n.RED;if(i===Oh)return n.RED_INTEGER;if(i===kh)return n.RG;if(i===Bh)return n.RG_INTEGER;if(i===Vh)return n.RGBA_INTEGER;if(i===ko||i===Bo||i===Vo||i===Go)if(r===Wt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ko)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Bo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Vo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Go)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ko)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Bo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Vo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Go)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Uc||i===Fc||i===zc||i===Nc)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Uc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Nc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Oc||i===kc||i===Bc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Oc||i===kc)return r===Wt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Bc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Vc||i===Gc||i===Hc||i===Wc||i===Xc||i===qc||i===Yc||i===$c||i===Zc||i===Kc||i===Jc||i===jc||i===Qc||i===eh)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Vc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Gc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Hc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Wc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Xc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===qc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===$c)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Zc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Kc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qc)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===eh)return r===Wt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===th||i===nh||i===ih)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===th)return r===Wt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ih)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sh||i===ah||i===rh||i===oh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===sh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===ah)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===rh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===oh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Er?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const sM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,aM=`
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

}`;class rM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Bf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Sn({vertexShader:sM,fragmentShader:aM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new O(new qt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class oM extends Ga{constructor(e,t){super();const i=this;let s=null,a=1,r=null,l="local-floor",c=1,h=null,d=null,u=null,p=null,m=null,x=null;const M=typeof XRWebGLBinding<"u",g=new rM,f={},y=t.getContextAttributes();let v=null,_=null;const E=[],T=[],C=new Fe;let R=null;const S=new $n;S.viewport=new Yt;const b=new $n;b.viewport=new Yt;const L=[S,b],I=new Tx;let V=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=E[$];return Z===void 0&&(Z=new Zl,E[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=E[$];return Z===void 0&&(Z=new Zl,E[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=E[$];return Z===void 0&&(Z=new Zl,E[$]=Z),Z.getHandSpace()};function te($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const we=E[Z];we!==void 0&&(we.update($.inputSource,$.frame,h||r),we.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",K);for(let $=0;$<E.length;$++){const Z=T[$];Z!==null&&(T[$]=null,E[$].disconnect(Z))}V=null,j=null,g.reset();for(const $ in f)delete f[$];e.setRenderTarget(v),m=null,p=null,u=null,s=null,_=null,Ce.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){l=$,i.isPresenting===!0&&gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",K),y.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Re=null,ke=null;y.depth&&(ke=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=y.stencil?Cr:Ar,Re=y.stencil?Er:Ks);const tt={colorFormat:t.RGBA8,depthFormat:ke,scaleFactor:a};u=this.getBinding(),p=u.createProjectionLayer(tt),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new _i(p.textureWidth,p.textureHeight,{format:vi,type:Vi,depthTexture:new kf(p.textureWidth,p.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const we={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new _i(m.framebufferWidth,m.framebufferHeight,{format:vi,type:Vi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(l),Ce.setContext(s),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const we=$.removed[Z],Re=T.indexOf(we);Re>=0&&(T[Re]=null,E[Re].disconnect(we))}for(let Z=0;Z<$.added.length;Z++){const we=$.added[Z];let Re=T.indexOf(we);if(Re===-1){for(let tt=0;tt<E.length;tt++)if(tt>=T.length){T.push(we),Re=tt;break}else if(T[tt]===null){T[tt]=we,Re=tt;break}if(Re===-1)break}const ke=E[Re];ke&&ke.connect(we)}}const ne=new P,fe=new P;function ve($,Z,we){ne.setFromMatrixPosition(Z.matrixWorld),fe.setFromMatrixPosition(we.matrixWorld);const Re=ne.distanceTo(fe),ke=Z.projectionMatrix.elements,tt=we.projectionMatrix.elements,kt=ke[14]/(ke[10]-1),at=ke[14]/(ke[10]+1),zt=(ke[9]+1)/ke[5],k=(ke[9]-1)/ke[5],wt=(ke[8]-1)/ke[0],Mt=(tt[8]+1)/tt[0],Nt=kt*wt,je=kt*Mt,Gt=Re/(-wt+Mt),ot=Gt*-wt;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(Gt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),ke[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const vt=kt+Gt,U=at+Gt,A=Nt-ot,J=je+(Re-ot),de=zt*at/U*vt,ge=k*at/U*vt;$.projectionMatrix.makePerspective(A,J,de,ge,vt,U),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ye($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Z=$.near,we=$.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(we=g.depthFar)),I.near=b.near=S.near=Z,I.far=b.far=S.far=we,(V!==I.near||j!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),V=I.near,j=I.far),I.layers.mask=$.layers.mask|6,S.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const Re=$.parent,ke=I.cameras;Ye(I,Re);for(let tt=0;tt<ke.length;tt++)Ye(ke[tt],Re);ke.length===2?ve(I,S,b):I.projectionMatrix.copy(S.projectionMatrix),D($,I,Re)};function D($,Z,we){we===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(we.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Pr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function($){return f[$]};let Ie=null;function ye($,Z){if(d=Z.getViewerPose(h||r),x=Z,d!==null){const we=d.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let Re=!1;we.length!==I.cameras.length&&(I.cameras.length=0,Re=!0);for(let at=0;at<we.length;at++){const zt=we[at];let k=null;if(m!==null)k=m.getViewport(zt);else{const Mt=u.getViewSubImage(p,zt);k=Mt.viewport,at===0&&(e.setRenderTargetTextures(_,Mt.colorTexture,Mt.depthStencilTexture),e.setRenderTarget(_))}let wt=L[at];wt===void 0&&(wt=new $n,wt.layers.enable(at),wt.viewport=new Yt,L[at]=wt),wt.matrix.fromArray(zt.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(zt.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(k.x,k.y,k.width,k.height),at===0&&(I.matrix.copy(wt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Re===!0&&I.cameras.push(wt)}const ke=s.enabledFeatures;if(ke&&ke.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=i.getBinding();const at=u.getDepthInformation(we[0]);at&&at.isValid&&at.texture&&g.init(at,s.renderState)}if(ke&&ke.includes("camera-access")&&M){e.state.unbindTexture(),u=i.getBinding();for(let at=0;at<we.length;at++){const zt=we[at].camera;if(zt){let k=f[zt];k||(k=new Bf,f[zt]=k);const wt=u.getCameraImage(zt);k.sourceTexture=wt}}}}for(let we=0;we<E.length;we++){const Re=T[we],ke=E[we];Re!==null&&ke!==void 0&&ke.update(Re,Z,h||r)}Ie&&Ie($,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),x=null}const Ce=new Jf;Ce.setAnimationLoop(ye),this.setAnimationLoop=function($){Ie=$},this.dispose=function(){}}}const Fs=new yi,lM=new _t;function cM(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,If(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,v,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),u(g,f)):f.isMeshPhongMaterial?(a(g,f),d(g,f)):f.isMeshStandardMaterial?(a(g,f),p(g,f),f.isMeshPhysicalMaterial&&m(g,f,_)):f.isMeshMatcapMaterial?(a(g,f),x(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),M(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&l(g,f)):f.isPointsMaterial?c(g,f,y,v):f.isSpriteMaterial?h(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===In&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===In&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,_=y.envMapRotation;v&&(g.envMap.value=v,Fs.copy(_),Fs.x*=-1,Fs.y*=-1,Fs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Fs.y*=-1,Fs.z*=-1),g.envMapRotation.value.setFromMatrix4(lM.makeRotationFromEuler(Fs)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function l(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,y,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=v*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function p(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function m(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===In&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,f){f.matcap&&(g.matcap.value=f.matcap)}function M(g,f){const y=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function hM(n,e,t,i){let s={},a={},r=[];const l=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function h(y,v){let _=s[y.id];_===void 0&&(x(y),_=d(y),s[y.id]=_,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;a[y.id]!==T&&(p(y),a[y.id]=T)}function d(y){const v=u();y.__bindingPointIndex=v;const _=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function u(){for(let y=0;y<l;y++)if(r.indexOf(y)===-1)return r.push(y),y;return an("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(y){const v=s[y.id],_=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,C=_.length;T<C;T++){const R=Array.isArray(_[T])?_[T]:[_[T]];for(let S=0,b=R.length;S<b;S++){const L=R[S];if(m(L,T,S,E)===!0){const I=L.__offset,V=Array.isArray(L.value)?L.value:[L.value];let j=0;for(let te=0;te<V.length;te++){const q=V[te],K=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,I+j,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,j),j+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,_,E){const T=y.value,C=v+"_"+_;if(E[C]===void 0)return typeof T=="number"||typeof T=="boolean"?E[C]=T:E[C]=T.clone(),!0;{const R=E[C];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[C]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(y){const v=y.uniforms;let _=0;const E=16;for(let C=0,R=v.length;C<R;C++){const S=Array.isArray(v[C])?v[C]:[v[C]];for(let b=0,L=S.length;b<L;b++){const I=S[b],V=Array.isArray(I.value)?I.value:[I.value];for(let j=0,te=V.length;j<te;j++){const q=V[j],K=M(q),ne=_%E,fe=ne%K.boundary,ve=ne+fe;_+=fe,ve!==0&&E-ve<K.storage&&(_+=E-ve),I.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=K.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function M(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):gt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const _=r.indexOf(v.__bindingPointIndex);r.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:f}}const dM=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Ki=null;function uM(){return Ki===null&&(Ki=new Of(dM,32,32,kh,Fi),Ki.minFilter=ai,Ki.magFilter=ai,Ki.wrapS=es,Ki.wrapT=es,Ki.generateMipmaps=!1,Ki.needsUpdate=!0),Ki}class fM{constructor(e={}){const{canvas:t=Yp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const x=new Set([Vh,Bh,Oh]),M=new Set([Vi,Ks,Tr,Er,Fh,zh]),g=new Uint32Array(4),f=new Int32Array(4);let y=null,v=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ys,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let C=!1;this._outputColorSpace=Lt;let R=0,S=0,b=null,L=-1,I=null;const V=new Yt,j=new Yt;let te=null;const q=new rt(0);let K=0,ne=t.width,fe=t.height,ve=1,Ye=null,D=null;const Ie=new Yt(0,0,ne,fe),ye=new Yt(0,0,ne,fe);let Ce=!1;const $=new $h;let Z=!1,we=!1;const Re=new _t,ke=new P,tt=new Yt,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function zt(){return b===null?ve:1}let k=i;function wt(w,F){return t.getContext(w,F)}try{const w={alpha:!0,depth:s,stencil:a,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Lh}`),t.addEventListener("webglcontextlost",Se,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",Ke,!1),k===null){const F="webgl2";if(k=wt(F,w),k===null)throw wt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let Mt,Nt,je,Gt,ot,vt,U,A,J,de,ge,ae,et,Ue,nt,qe,_e,Pe,ht,ct,We,dt,H,Ge;function Oe(){Mt=new y2(k),Mt.init(),dt=new iM(k,Mt),Nt=new u2(k,Mt,e,dt),je=new tM(k,Mt),Nt.reversedDepthBuffer&&p&&je.buffers.depth.setReversed(!0),Gt=new S2(k),ot=new Gv,vt=new nM(k,Mt,je,ot,Nt,dt,Gt),U=new p2(T),A=new _2(T),J=new Cx(k),H=new h2(k,J),de=new b2(k,J,Gt,H),ge=new E2(k,de,J,Gt),ht=new T2(k,Nt,vt),qe=new f2(ot),ae=new Vv(T,U,A,Mt,Nt,H,qe),et=new cM(T,ot),Ue=new Wv,nt=new Kv(Mt),Pe=new c2(T,U,A,je,ge,m,c),_e=new Qv(T,ge,Nt),Ge=new hM(k,Gt,Nt,je),ct=new d2(k,Mt,Gt),We=new w2(k,Mt,Gt),Gt.programs=ae.programs,T.capabilities=Nt,T.extensions=Mt,T.properties=ot,T.renderLists=Ue,T.shadowMap=_e,T.state=je,T.info=Gt}Oe();const ze=new oM(T,k);this.xr=ze,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const w=Mt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Mt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(w){w!==void 0&&(ve=w,this.setSize(ne,fe,!1))},this.getSize=function(w){return w.set(ne,fe)},this.setSize=function(w,F,G=!0){if(ze.isPresenting){gt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=w,fe=F,t.width=Math.floor(w*ve),t.height=Math.floor(F*ve),G===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(ne*ve,fe*ve).floor()},this.setDrawingBufferSize=function(w,F,G){ne=w,fe=F,ve=G,t.width=Math.floor(w*G),t.height=Math.floor(F*G),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(V)},this.getViewport=function(w){return w.copy(Ie)},this.setViewport=function(w,F,G,X){w.isVector4?Ie.set(w.x,w.y,w.z,w.w):Ie.set(w,F,G,X),je.viewport(V.copy(Ie).multiplyScalar(ve).round())},this.getScissor=function(w){return w.copy(ye)},this.setScissor=function(w,F,G,X){w.isVector4?ye.set(w.x,w.y,w.z,w.w):ye.set(w,F,G,X),je.scissor(j.copy(ye).multiplyScalar(ve).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(w){je.setScissorTest(Ce=w)},this.setOpaqueSort=function(w){Ye=w},this.setTransparentSort=function(w){D=w},this.getClearColor=function(w){return w.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,G=!0){let X=0;if(w){let B=!1;if(b!==null){const oe=b.texture.format;B=x.has(oe)}if(B){const oe=b.texture.type,re=M.has(oe),Q=Pe.getClearColor(),ue=Pe.getClearAlpha(),Le=Q.r,Ve=Q.g,De=Q.b;re?(g[0]=Le,g[1]=Ve,g[2]=De,g[3]=ue,k.clearBufferuiv(k.COLOR,0,g)):(f[0]=Le,f[1]=Ve,f[2]=De,f[3]=ue,k.clearBufferiv(k.COLOR,0,f))}else X|=k.COLOR_BUFFER_BIT}F&&(X|=k.DEPTH_BUFFER_BIT),G&&(X|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Se,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",Ke,!1),Pe.dispose(),Ue.dispose(),nt.dispose(),ot.dispose(),U.dispose(),A.dispose(),ge.dispose(),H.dispose(),Ge.dispose(),ae.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",Jr),ze.removeEventListener("sessionend",Ya),bi.stop()};function Se(w){w.preventDefault(),Jo("WebGLRenderer: Context Lost."),C=!0}function pe(){Jo("WebGLRenderer: Context Restored."),C=!1;const w=Gt.autoReset,F=_e.enabled,G=_e.autoUpdate,X=_e.needsUpdate,B=_e.type;Oe(),Gt.autoReset=w,_e.enabled=F,_e.autoUpdate=G,_e.needsUpdate=X,_e.type=B}function Ke(w){an("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ut(w){const F=w.target;F.removeEventListener("dispose",ut),Bt(F)}function Bt(w){Ut(w),ot.remove(w)}function Ut(w){const F=ot.get(w).programs;F!==void 0&&(F.forEach(function(G){ae.releaseProgram(G)}),w.isShaderMaterial&&ae.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,G,X,B,oe){F===null&&(F=kt);const re=B.isMesh&&B.matrixWorld.determinant()<0,Q=z(w,F,G,X,B);je.setMaterial(X,re);let ue=G.index,Le=1;if(X.wireframe===!0){if(ue=de.getWireframeAttribute(G),ue===void 0)return;Le=2}const Ve=G.drawRange,De=G.attributes.position;let Ne=Ve.start*Le,ft=(Ve.start+Ve.count)*Le;oe!==null&&(Ne=Math.max(Ne,oe.start*Le),ft=Math.min(ft,(oe.start+oe.count)*Le)),ue!==null?(Ne=Math.max(Ne,0),ft=Math.min(ft,ue.count)):De!=null&&(Ne=Math.max(Ne,0),ft=Math.min(ft,De.count));const St=ft-Ne;if(St<0||St===1/0)return;H.setup(B,X,Q,G,ue);let Pt,Tt=ct;if(ue!==null&&(Pt=J.get(ue),Tt=We,Tt.setIndex(Pt)),B.isMesh)X.wireframe===!0?(je.setLineWidth(X.wireframeLinewidth*zt()),Tt.setMode(k.LINES)):Tt.setMode(k.TRIANGLES);else if(B.isLine){let $e=X.linewidth;$e===void 0&&($e=1),je.setLineWidth($e*zt()),B.isLineSegments?Tt.setMode(k.LINES):B.isLineLoop?Tt.setMode(k.LINE_LOOP):Tt.setMode(k.LINE_STRIP)}else B.isPoints?Tt.setMode(k.POINTS):B.isSprite&&Tt.setMode(k.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Rr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Tt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Mt.get("WEBGL_multi_draw"))Tt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const $e=B._multiDrawStarts,Dt=B._multiDrawCounts,mt=B._multiDrawCount,jt=ue?J.get(ue).bytesPerElement:1,Wi=ot.get(X).currentProgram.getUniforms();for(let en=0;en<mt;en++)Wi.setValue(k,"_gl_DrawID",en),Tt.render($e[en]/jt,Dt[en])}else if(B.isInstancedMesh)Tt.renderInstances(Ne,St,B.count);else if(G.isInstancedBufferGeometry){const $e=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Dt=Math.min(G.instanceCount,$e);Tt.renderInstances(Ne,St,Dt)}else Tt.render(Ne,St)};function Nn(w,F,G){w.transparent===!0&&w.side===yt&&w.forceSinglePass===!1?(w.side=In,w.needsUpdate=!0,mn(w,F,G),w.side=Ss,w.needsUpdate=!0,mn(w,F,G),w.side=yt):mn(w,F,G)}this.compile=function(w,F,G=null){G===null&&(G=w),v=nt.get(G),v.init(F),E.push(v),G.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),w!==G&&w.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const X=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let re=0;re<oe.length;re++){const Q=oe[re];Nn(Q,G,B),X.add(Q)}else Nn(oe,G,B),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(w,F,G=null){const X=this.compile(w,F,G);return new Promise(B=>{function oe(){if(X.forEach(function(re){ot.get(re).currentProgram.isReady()&&X.delete(re)}),X.size===0){B(w);return}setTimeout(oe,10)}Mt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let An=null;function li(w){An&&An(w)}function Jr(){bi.stop()}function Ya(){bi.start()}const bi=new Jf;bi.setAnimationLoop(li),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(w){An=w,ze.setAnimationLoop(w),w===null?bi.stop():bi.start()},ze.addEventListener("sessionstart",Jr),ze.addEventListener("sessionend",Ya),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){an("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(F),F=ze.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,F,b),v=nt.get(w,E.length),v.init(F),E.push(v),Re.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Re,Di,F.reversedDepth),we=this.localClippingEnabled,Z=qe.init(this.clippingPlanes,we),y=Ue.get(w,_.length),y.init(),_.push(y),ze.enabled===!0&&ze.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&wi(oe,F,-1/0,T.sortObjects)}wi(w,F,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort(Ye,D),at=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,at&&Pe.addToRenderList(y,w),this.info.render.frame++,Z===!0&&qe.beginShadows();const G=v.state.shadowsArray;_e.render(G,w,F),Z===!0&&qe.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,B=y.transmissive;if(v.setupLights(),F.isArrayCamera){const oe=F.cameras;if(B.length>0)for(let re=0,Q=oe.length;re<Q;re++){const ue=oe[re];$a(X,B,w,ue)}at&&Pe.render(w);for(let re=0,Q=oe.length;re<Q;re++){const ue=oe[re];Si(y,w,ue,ue.viewport)}}else B.length>0&&$a(X,B,w,F),at&&Pe.render(w),Si(y,w,F);b!==null&&S===0&&(vt.updateMultisampleRenderTarget(b),vt.updateRenderTargetMipmap(b)),w.isScene===!0&&w.onAfterRender(T,w,F),H.resetDefaultState(),L=-1,I=null,E.pop(),E.length>0?(v=E[E.length-1],Z===!0&&qe.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?y=_[_.length-1]:y=null};function wi(w,F,G,X){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){X&&tt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Re);const re=ge.update(w),Q=w.material;Q.visible&&y.push(w,re,Q,G,tt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){const re=ge.update(w),Q=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),tt.copy(w.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),tt.copy(re.boundingSphere.center)),tt.applyMatrix4(w.matrixWorld).applyMatrix4(Re)),Array.isArray(Q)){const ue=re.groups;for(let Le=0,Ve=ue.length;Le<Ve;Le++){const De=ue[Le],Ne=Q[De.materialIndex];Ne&&Ne.visible&&y.push(w,re,Ne,G,tt.z,De)}}else Q.visible&&y.push(w,re,Q,G,tt.z,null)}}const oe=w.children;for(let re=0,Q=oe.length;re<Q;re++)wi(oe[re],F,G,X)}function Si(w,F,G,X){const{opaque:B,transmissive:oe,transparent:re}=w;v.setupLightsView(G),Z===!0&&qe.setGlobalState(T.clippingPlanes,G),X&&je.viewport(V.copy(X)),B.length>0&&na(B,F,G),oe.length>0&&na(oe,F,G),re.length>0&&na(re,F,G),je.buffers.depth.setTest(!0),je.buffers.depth.setMask(!0),je.buffers.color.setMask(!0),je.setPolygonOffset(!1)}function $a(w,F,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new _i(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")||Mt.has("EXT_color_buffer_float")?Fi:Vi,minFilter:Gs,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ft.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],re=X.viewport||V;oe.setSize(re.z*T.transmissionResolutionScale,re.w*T.transmissionResolutionScale);const Q=T.getRenderTarget(),ue=T.getActiveCubeFace(),Le=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),K=T.getClearAlpha(),K<1&&T.setClearColor(16777215,.5),T.clear(),at&&Pe.render(G);const Ve=T.toneMapping;T.toneMapping=ys;const De=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),Z===!0&&qe.setGlobalState(T.clippingPlanes,X),na(w,G,X),vt.updateMultisampleRenderTarget(oe),vt.updateRenderTargetMipmap(oe),Mt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let ft=0,St=F.length;ft<St;ft++){const Pt=F[ft],{object:Tt,geometry:$e,material:Dt,group:mt}=Pt;if(Dt.side===yt&&Tt.layers.test(X.layers)){const jt=Dt.side;Dt.side=In,Dt.needsUpdate=!0,jr(Tt,G,X,$e,Dt,mt),Dt.side=jt,Dt.needsUpdate=!0,Ne=!0}}Ne===!0&&(vt.updateMultisampleRenderTarget(oe),vt.updateRenderTargetMipmap(oe))}T.setRenderTarget(Q,ue,Le),T.setClearColor(q,K),De!==void 0&&(X.viewport=De),T.toneMapping=Ve}function na(w,F,G){const X=F.isScene===!0?F.overrideMaterial:null;for(let B=0,oe=w.length;B<oe;B++){const re=w[B],{object:Q,geometry:ue,group:Le}=re;let Ve=re.material;Ve.allowOverride===!0&&X!==null&&(Ve=X),Q.layers.test(G.layers)&&jr(Q,F,G,ue,Ve,Le)}}function jr(w,F,G,X,B,oe){w.onBeforeRender(T,F,G,X,B,oe),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(T,F,G,X,w,oe),B.transparent===!0&&B.side===yt&&B.forceSinglePass===!1?(B.side=In,B.needsUpdate=!0,T.renderBufferDirect(G,F,X,B,w,oe),B.side=Ss,B.needsUpdate=!0,T.renderBufferDirect(G,F,X,B,w,oe),B.side=yt):T.renderBufferDirect(G,F,X,B,w,oe),w.onAfterRender(T,F,G,X,B,oe)}function mn(w,F,G){F.isScene!==!0&&(F=kt);const X=ot.get(w),B=v.state.lights,oe=v.state.shadowsArray,re=B.state.version,Q=ae.getParameters(w,B.state,oe,F,G),ue=ae.getProgramCacheKey(Q);let Le=X.programs;X.environment=w.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(w.isMeshStandardMaterial?A:U).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Le===void 0&&(w.addEventListener("dispose",ut),Le=new Map,X.programs=Le);let Ve=Le.get(ue);if(Ve!==void 0){if(X.currentProgram===Ve&&X.lightsStateVersion===re)return Za(w,Q),Ve}else Q.uniforms=ae.getUniforms(w),w.onBeforeCompile(Q,T),Ve=ae.acquireProgram(Q,ue),Le.set(ue,Ve),X.uniforms=Q.uniforms;const De=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(De.clippingPlanes=qe.uniform),Za(w,Q),X.needsLights=Y(w),X.lightsStateVersion=re,X.needsLights&&(De.ambientLightColor.value=B.state.ambient,De.lightProbe.value=B.state.probe,De.directionalLights.value=B.state.directional,De.directionalLightShadows.value=B.state.directionalShadow,De.spotLights.value=B.state.spot,De.spotLightShadows.value=B.state.spotShadow,De.rectAreaLights.value=B.state.rectArea,De.ltc_1.value=B.state.rectAreaLTC1,De.ltc_2.value=B.state.rectAreaLTC2,De.pointLights.value=B.state.point,De.pointLightShadows.value=B.state.pointShadow,De.hemisphereLights.value=B.state.hemi,De.directionalShadowMap.value=B.state.directionalShadowMap,De.directionalShadowMatrix.value=B.state.directionalShadowMatrix,De.spotShadowMap.value=B.state.spotShadowMap,De.spotLightMatrix.value=B.state.spotLightMatrix,De.spotLightMap.value=B.state.spotLightMap,De.pointShadowMap.value=B.state.pointShadowMap,De.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Ve,X.uniformsList=null,Ve}function Qr(w){if(w.uniformsList===null){const F=w.currentProgram.getUniforms();w.uniformsList=Ho.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function Za(w,F){const G=ot.get(w);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function z(w,F,G,X,B){F.isScene!==!0&&(F=kt),vt.resetTextureUnits();const oe=F.fog,re=X.isMeshStandardMaterial?F.environment:null,Q=b===null?T.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Na,ue=(X.isMeshStandardMaterial?A:U).get(X.envMap||re),Le=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),De=!!G.morphAttributes.position,Ne=!!G.morphAttributes.normal,ft=!!G.morphAttributes.color;let St=ys;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(St=T.toneMapping);const Pt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Tt=Pt!==void 0?Pt.length:0,$e=ot.get(X),Dt=v.state.lights;if(Z===!0&&(we===!0||w!==I)){const On=w===I&&X.id===L;qe.setState(X,w,On)}let mt=!1;X.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==Dt.state.version||$e.outputColorSpace!==Q||B.isBatchedMesh&&$e.batching===!1||!B.isBatchedMesh&&$e.batching===!0||B.isBatchedMesh&&$e.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&$e.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&$e.instancing===!1||!B.isInstancedMesh&&$e.instancing===!0||B.isSkinnedMesh&&$e.skinning===!1||!B.isSkinnedMesh&&$e.skinning===!0||B.isInstancedMesh&&$e.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&$e.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&$e.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&$e.instancingMorph===!1&&B.morphTexture!==null||$e.envMap!==ue||X.fog===!0&&$e.fog!==oe||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==qe.numPlanes||$e.numIntersection!==qe.numIntersection)||$e.vertexAlphas!==Le||$e.vertexTangents!==Ve||$e.morphTargets!==De||$e.morphNormals!==Ne||$e.morphColors!==ft||$e.toneMapping!==St||$e.morphTargetsCount!==Tt)&&(mt=!0):(mt=!0,$e.__version=X.version);let jt=$e.currentProgram;mt===!0&&(jt=mn(X,F,B));let Wi=!1,en=!1,Qn=!1;const Ht=jt.getUniforms(),xn=$e.uniforms;if(je.useProgram(jt.program)&&(Wi=!0,en=!0,Qn=!0),X.id!==L&&(L=X.id,en=!0),Wi||I!==w){je.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Ht.setValue(k,"projectionMatrix",w.projectionMatrix),Ht.setValue(k,"viewMatrix",w.matrixWorldInverse);const Wn=Ht.map.cameraPosition;Wn!==void 0&&Wn.setValue(k,ke.setFromMatrixPosition(w.matrixWorld)),Nt.logarithmicDepthBuffer&&Ht.setValue(k,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ht.setValue(k,"isOrthographic",w.isOrthographicCamera===!0),I!==w&&(I=w,en=!0,Qn=!0)}if(B.isSkinnedMesh){Ht.setOptional(k,B,"bindMatrix"),Ht.setOptional(k,B,"bindMatrixInverse");const On=B.skeleton;On&&(On.boneTexture===null&&On.computeBoneTexture(),Ht.setValue(k,"boneTexture",On.boneTexture,vt))}B.isBatchedMesh&&(Ht.setOptional(k,B,"batchingTexture"),Ht.setValue(k,"batchingTexture",B._matricesTexture,vt),Ht.setOptional(k,B,"batchingIdTexture"),Ht.setValue(k,"batchingIdTexture",B._indirectTexture,vt),Ht.setOptional(k,B,"batchingColorTexture"),B._colorsTexture!==null&&Ht.setValue(k,"batchingColorTexture",B._colorsTexture,vt));const ei=G.morphAttributes;if((ei.position!==void 0||ei.normal!==void 0||ei.color!==void 0)&&ht.update(B,G,jt),(en||$e.receiveShadow!==B.receiveShadow)&&($e.receiveShadow=B.receiveShadow,Ht.setValue(k,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(xn.envMap.value=ue,xn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(xn.envMapIntensity.value=F.environmentIntensity),xn.dfgLUT!==void 0&&(xn.dfgLUT.value=uM()),en&&(Ht.setValue(k,"toneMappingExposure",T.toneMappingExposure),$e.needsLights&&N(xn,Qn),oe&&X.fog===!0&&et.refreshFogUniforms(xn,oe),et.refreshMaterialUniforms(xn,X,ve,fe,v.state.transmissionRenderTarget[w.id]),Ho.upload(k,Qr($e),xn,vt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Ho.upload(k,Qr($e),xn,vt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ht.setValue(k,"center",B.center),Ht.setValue(k,"modelViewMatrix",B.modelViewMatrix),Ht.setValue(k,"normalMatrix",B.normalMatrix),Ht.setValue(k,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const On=X.uniformsGroups;for(let Wn=0,Al=On.length;Wn<Al;Wn++){const Rs=On[Wn];Ge.update(Rs,jt),Ge.bind(Rs,jt)}}return jt}function N(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function Y(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(w,F,G){const X=ot.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(w.texture).__webglTexture=F,ot.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){const G=ot.get(w);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};const ee=k.createFramebuffer();this.setRenderTarget=function(w,F=0,G=0){b=w,R=F,S=G;let X=!0,B=null,oe=!1,re=!1;if(w){const ue=ot.get(w);if(ue.__useDefaultFramebuffer!==void 0)je.bindFramebuffer(k.FRAMEBUFFER,null),X=!1;else if(ue.__webglFramebuffer===void 0)vt.setupRenderTarget(w);else if(ue.__hasExternalTextures)vt.rebindTextures(w,ot.get(w.texture).__webglTexture,ot.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const De=w.depthTexture;if(ue.__boundDepthTexture!==De){if(De!==null&&ot.has(De)&&(w.width!==De.image.width||w.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");vt.setupDepthRenderbuffer(w)}}const Le=w.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(re=!0);const Ve=ot.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ve[F])?B=Ve[F][G]:B=Ve[F],oe=!0):w.samples>0&&vt.useMultisampledRTT(w)===!1?B=ot.get(w).__webglMultisampledFramebuffer:Array.isArray(Ve)?B=Ve[G]:B=Ve,V.copy(w.viewport),j.copy(w.scissor),te=w.scissorTest}else V.copy(Ie).multiplyScalar(ve).floor(),j.copy(ye).multiplyScalar(ve).floor(),te=Ce;if(G!==0&&(B=ee),je.bindFramebuffer(k.FRAMEBUFFER,B)&&X&&je.drawBuffers(w,B),je.viewport(V),je.scissor(j),je.setScissorTest(te),oe){const ue=ot.get(w.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,ue.__webglTexture,G)}else if(re){const ue=F;for(let Le=0;Le<w.textures.length;Le++){const Ve=ot.get(w.textures[Le]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Le,Ve.__webglTexture,G,ue)}}else if(w!==null&&G!==0){const ue=ot.get(w.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ue.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(w,F,G,X,B,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget)){an("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue){je.bindFramebuffer(k.FRAMEBUFFER,ue);try{const Le=w.textures[Q],Ve=Le.format,De=Le.type;if(!Nt.textureFormatReadable(Ve)){an("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(De)){an("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-X&&G>=0&&G<=w.height-B&&(w.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Q),k.readPixels(F,G,X,B,dt.convert(Ve),dt.convert(De),oe))}finally{const Le=b!==null?ot.get(b).__webglFramebuffer:null;je.bindFramebuffer(k.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(w,F,G,X,B,oe,re,Q=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=ot.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue)if(F>=0&&F<=w.width-X&&G>=0&&G<=w.height-B){je.bindFramebuffer(k.FRAMEBUFFER,ue);const Le=w.textures[Q],Ve=Le.format,De=Le.type;if(!Nt.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ne),k.bufferData(k.PIXEL_PACK_BUFFER,oe.byteLength,k.STREAM_READ),w.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Q),k.readPixels(F,G,X,B,dt.convert(Ve),dt.convert(De),0);const ft=b!==null?ot.get(b).__webglFramebuffer:null;je.bindFramebuffer(k.FRAMEBUFFER,ft);const St=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await $p(k,St,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ne),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,oe),k.deleteBuffer(Ne),k.deleteSync(St),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,G=0){const X=Math.pow(2,-G),B=Math.floor(w.image.width*X),oe=Math.floor(w.image.height*X),re=F!==null?F.x:0,Q=F!==null?F.y:0;vt.setTexture2D(w,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,re,Q,B,oe),je.unbindTexture()};const ie=k.createFramebuffer(),le=k.createFramebuffer();this.copyTextureToTexture=function(w,F,G=null,X=null,B=0,oe=null){oe===null&&(B!==0?(Rr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let re,Q,ue,Le,Ve,De,Ne,ft,St;const Pt=w.isCompressedTexture?w.mipmaps[oe]:w.image;if(G!==null)re=G.max.x-G.min.x,Q=G.max.y-G.min.y,ue=G.isBox3?G.max.z-G.min.z:1,Le=G.min.x,Ve=G.min.y,De=G.isBox3?G.min.z:0;else{const ei=Math.pow(2,-B);re=Math.floor(Pt.width*ei),Q=Math.floor(Pt.height*ei),w.isDataArrayTexture?ue=Pt.depth:w.isData3DTexture?ue=Math.floor(Pt.depth*ei):ue=1,Le=0,Ve=0,De=0}X!==null?(Ne=X.x,ft=X.y,St=X.z):(Ne=0,ft=0,St=0);const Tt=dt.convert(F.format),$e=dt.convert(F.type);let Dt;F.isData3DTexture?(vt.setTexture3D(F,0),Dt=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(vt.setTexture2DArray(F,0),Dt=k.TEXTURE_2D_ARRAY):(vt.setTexture2D(F,0),Dt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const mt=k.getParameter(k.UNPACK_ROW_LENGTH),jt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Wi=k.getParameter(k.UNPACK_SKIP_PIXELS),en=k.getParameter(k.UNPACK_SKIP_ROWS),Qn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Pt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Pt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Le),k.pixelStorei(k.UNPACK_SKIP_ROWS,Ve),k.pixelStorei(k.UNPACK_SKIP_IMAGES,De);const Ht=w.isDataArrayTexture||w.isData3DTexture,xn=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){const ei=ot.get(w),On=ot.get(F),Wn=ot.get(ei.__renderTarget),Al=ot.get(On.__renderTarget);je.bindFramebuffer(k.READ_FRAMEBUFFER,Wn.__webglFramebuffer),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,Al.__webglFramebuffer);for(let Rs=0;Rs<ue;Rs++)Ht&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ot.get(w).__webglTexture,B,De+Rs),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ot.get(F).__webglTexture,oe,St+Rs)),k.blitFramebuffer(Le,Ve,re,Q,Ne,ft,re,Q,k.DEPTH_BUFFER_BIT,k.NEAREST);je.bindFramebuffer(k.READ_FRAMEBUFFER,null),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||ot.has(w)){const ei=ot.get(w),On=ot.get(F);je.bindFramebuffer(k.READ_FRAMEBUFFER,ie),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,le);for(let Wn=0;Wn<ue;Wn++)Ht?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ei.__webglTexture,B,De+Wn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ei.__webglTexture,B),xn?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,On.__webglTexture,oe,St+Wn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,On.__webglTexture,oe),B!==0?k.blitFramebuffer(Le,Ve,re,Q,Ne,ft,re,Q,k.COLOR_BUFFER_BIT,k.NEAREST):xn?k.copyTexSubImage3D(Dt,oe,Ne,ft,St+Wn,Le,Ve,re,Q):k.copyTexSubImage2D(Dt,oe,Ne,ft,Le,Ve,re,Q);je.bindFramebuffer(k.READ_FRAMEBUFFER,null),je.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else xn?w.isDataTexture||w.isData3DTexture?k.texSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,$e,Pt.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,Pt.data):k.texSubImage3D(Dt,oe,Ne,ft,St,re,Q,ue,Tt,$e,Pt):w.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,oe,Ne,ft,re,Q,Tt,$e,Pt.data):w.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,oe,Ne,ft,Pt.width,Pt.height,Tt,Pt.data):k.texSubImage2D(k.TEXTURE_2D,oe,Ne,ft,re,Q,Tt,$e,Pt);k.pixelStorei(k.UNPACK_ROW_LENGTH,mt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,jt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Wi),k.pixelStorei(k.UNPACK_SKIP_ROWS,en),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Qn),oe===0&&F.generateMipmaps&&k.generateMipmap(Dt),je.unbindTexture()},this.initRenderTarget=function(w){ot.get(w).__webglFramebuffer===void 0&&vt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?vt.setTextureCube(w,0):w.isData3DTexture?vt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?vt.setTexture2DArray(w,0):vt.setTexture2D(w,0),je.unbindTexture()},this.resetState=function(){R=0,S=0,b=null,je.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ft._getUnpackColorSpace()}}function bs(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},l=n[0].morphTargetsRelative,c=new Zt;let h=0;for(let d=0;d<n.length;++d){const u=n[d];let p=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;a[m]===void 0&&(a[m]=[]),a[m].push(u.attributes[m]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(l!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.morphAttributes[m])}if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,m,d),h+=m}}if(t){let d=0;const u=[];for(let p=0;p<n.length;++p){const m=n[p].index;for(let x=0;x<m.count;++x)u.push(m.getX(x)+d);d+=n[p].attributes.position.count}c.setIndex(u)}for(const d in a){const u=Ou(a[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<u;++p){const m=[];for(let M=0;M<r[d].length;++M)m.push(r[d][M][p]);const x=Ou(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function Ou(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),l=new Jn(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const u=c/t;for(let p=0,m=d.count;p<m;p++)for(let x=0;x<t;x++){const M=d.getComponent(p,x);l.setComponent(p+u,x,M)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(l.gpuType=s),l}class pM extends zf{constructor(){super();const e=new xe;e.deleteAttribute("uv");const t=new W({side:In}),i=new W,s=new td(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new O(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new cn(e,i,6),l=new It;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),r.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),r.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),r.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),r.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),r.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),r.setMatrixAt(5,l.matrix),this.add(r);const c=new O(e,ba(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new O(e,ba(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new O(e,ba(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new O(e,ba(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const p=new O(e,ba(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new O(e,ba(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function ba(n){return new Mx({color:0,emissive:16777215,emissiveIntensity:n})}const Wo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Xa{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const mM=new nd(-1,1,1,-1,0,1);class xM extends Zt{constructor(){super(),this.setAttribute("position",new bt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bt([0,2,0,0,2,0],2))}}const gM=new xM;class id{constructor(e){this._mesh=new O(gM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,mM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class n0 extends Xa{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Sn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Lr.clone(e.uniforms),this.material=new Sn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new id(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ku extends Xa{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,l;this.inverse?(r=0,l=1):(r=1,l=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(l),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class vM extends Xa{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class MM{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Fe);this._width=i.width,this._height=i.height,t=new _i(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new n0(Wo),this.copyPass.material.blending=Ui,this.clock=new Kf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const l=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}ku!==void 0&&(r instanceof ku?i=!0:r instanceof vM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Fe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class _M extends Xa{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const Po={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class yM extends Xa{constructor(){super(),this.uniforms=Lr.clone(Po.uniforms),this.material=new vx({name:Po.name,uniforms:this.uniforms,vertexShader:Po.vertexShader,fragmentShader:Po.fragmentShader}),this._fsQuad=new id(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ft.getTransfer(this._outputColorSpace)===Wt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===pf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===mf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===xf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ih?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===vf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Mf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===gf&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const bM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ba extends Xa{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Fe(e.x,e.y):new Fe(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new _i(a,r,{type:Fi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new _i(a,r,{type:Fi});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const p=new _i(a,r,{type:Fi});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),r=Math.round(r/2)}const l=bM;this.highPassUniforms=Lr.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Sn({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Fe(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Lr.clone(Wo.uniforms),this.blendMaterial=new Sn({uniforms:this.copyUniforms,vertexShader:Wo.vertexShader,fragmentShader:Wo.fragmentShader,blending:si,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Rt,this._fsQuad=new id(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Fe(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let l=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ba.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ba.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),l=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new Sn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Fe(.5,.5)},direction:{value:new Fe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ba.BlurDirectionX=new Fe(1,0);Ba.BlurDirectionY=new Fe(0,1);const Xr=document.querySelector("#game"),tn=new fM({canvas:Xr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),_l=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;tn.setPixelRatio(Math.min(window.devicePixelRatio,_l?1.5:2));tn.setSize(window.innerWidth,window.innerHeight);tn.shadowMap.enabled=!_l;tn.info.autoReset=!1;tn.shadowMap.type=ff;tn.outputColorSpace=Lt;tn.toneMapping=Ih;tn.toneMappingExposure=1.12;const Te=new zf;window.__steelRibbonScene=Te;Te.background=new rt(16764588);Te.fog=new Yh(14719602,360,2150);const i0=new ph(tn);i0.compileEquirectangularShader();Te.environment=i0.fromScene(new pM,.04).texture;Te.environmentIntensity=.58;const be=new $n(69,window.innerWidth/window.innerHeight,.08,1800);Te.add(be);const Xe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const Je=new Set,Ee={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},wM=new Kf,Qt=new P(0,1,0),sd=new P,ad=new P,yl=new P,sn=new It,s0=.86,xh=1.2,SM=.78,Fn=.55,Be={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},js=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],a0=Math.max(...js.map(n=>n.width));let ws=0,se=js[0];const o={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Xe.best.textContent=`Best score ${o.best}`;let Mi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Hi(){const n=o.mode==="race"||o.mode==="paused"||o.mode==="result";document.body.classList.toggle("chase-mode",n&&Mi==="chase"),document.body.classList.toggle("menu-mode",o.mode==="menu")}Hi();function TM(){Mi=Mi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",Mi),Hi(),o.message=Mi==="chase"?"Chase camera":"Cockpit camera",o.messageTimer=.9}const Lo=[];function Ni(n,e=!1){let t=Lo.find(s=>!s.busy);t||(Lo.length>=4?t=Lo[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Lo.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Tn(n=880,e=.16,t="triangle",i=.16){if(!Ae)return;const{ctx:s}=Ae,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Ae.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let Bu=0;function EM(){if(!Ae||Ae.ctx.currentTime-Bu<.45)return;Bu=Ae.ctx.currentTime;const{ctx:n}=Ae,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),l=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,l),r.gain.linearRampToValueAtTime(.05,l+.015),r.gain.setValueAtTime(.05,l+i),r.gain.exponentialRampToValueAtTime(1e-4,l+i+.04),s.connect(r),a.connect(r),r.connect(Ae.master),s.start(l),a.start(l),s.stop(l+i+.05),a.stop(l+i+.05)}}function AM(n){const e=me.clamp(n,0,1);return e*e*(3-2*e)}function CM(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*me.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-AM((e-i.end)/i.settle)))}return t}function rd(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function r0(n,e){const{t,n:i}=rd(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let l=i-r.s;l>n.length/2&&(l-=n.length),l<-n.length/2&&(l+=n.length),a+=r.amp*Math.exp(-(l*l)/(r.width*r.width))}return a+=CM(n,i),a}function Do(n){const{x:e,z:t,n:i}=rd(se,n),s=r0(se,i);return new P(e,s,t)}function pt(n){const e=(n%se.length+se.length)%se.length,t=Do(e),i=Do(e+2).sub(t).normalize(),s=sd.crossVectors(Qt,i).normalize(),a=Do(e-2).y,r=Do(e+2).y,l=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:l,bank:c,gap:h}}function Oi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Vu(n){return me.clamp(n/(se.length*se.laps),0,1)}function hc(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let a=i;a<=s;a++){const r=a*se.length+t;if(n<r&&e>=r)return!0}return!1}function RM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let l=0;l<e;l++)i.fillStyle=(l+r)%2?"#101318":"#f5f1df",i.fillRect(l*s,r*s,s,s);const a=new nn(t);return a.colorSpace=Lt,a.wrapS=zn,a.wrapT=zn,a.repeat.set(3,1),a}function PM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),l=Math.random()*n;t.beginPath(),t.moveTo(r,l),t.bezierCurveTo(r+Math.random()*22-11,l+36,r+Math.random()*22-11,l+82,r+Math.random()*16-8,l+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new nn(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),s}function LM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,l=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,l,0,r,l,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,l,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,l=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${l}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new nn(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(18,18),s.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),s}function DM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,l=Math.random()*n;t.beginPath(),t.moveTo(r,l);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,l+=Math.random()*46,t.lineTo(r,l);t.stroke()}const s=new nn(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(9,16),s.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),s}function IM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new nn(e);return s.colorSpace=Lt,s}function Sa(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let l=9;l<n-9;l+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(l,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new nn(i);return a.colorSpace=Lt,a}function UM(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+u-2),s.moveTo(c+2,h+u*.52),s.lineTo(c+d-2,h+u*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const l=new nn(i);return l.colorSpace=Lt,l.wrapS=zn,l.wrapT=zn,l.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),l}function FM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const l=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,l):t.lineTo(r,l)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new nn(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),s}function zM(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new nn(t);return a.colorSpace=Lt,a}function Gu(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:l}=s;a.fillStyle=t,a.fillRect(0,0,r,l),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,l-16),a.save(),a.translate(r/2,l/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new nn(s);return c.colorSpace=Lt,c}const ms=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],il=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],xs=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function o0(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let l=-80;l<700;l+=72)s.beginPath(),s.moveTo(l,256),s.lineTo(l+110,0),s.lineTo(l+145,0),s.lineTo(l+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new nn(i);return r.colorSpace=Lt,r.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),r}function dc(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new nn(t);return s.colorSpace=Lt,s}function uc(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const l=new nn(s);return l.colorSpace=Lt,l.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),l}function NM(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new nn(t);return s.colorSpace=Lt,s.anisotropy=Math.min(16,tn.capabilities.getMaxAnisotropy()),s}function OM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let l=0;l<8;l++){const c=-Math.PI/8+l*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;l===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new nn(e);return r.colorSpace=Lt,r}function ce(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function Ta(n,e,t,i){const s=t*.5,a=i*.5;let r=ce(n,e);for(const l of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,ce(n+l,e+c));return r}function bl(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:l,streetW:c}=Be;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+l/2)%l-l/2),d=Math.abs((a-e+l/2)%l-l/2);return Math.min(h,d)<c*.5+t}const Ms={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Ln(n,e,t,i,s=8){const{x0:a,x1:r,zNear:l,zFar:c,pitch:h,streetW:d}=Be,u=t*.5,p=i*.5,m=d*.5+s;let x=null;const M=(g,f,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:f,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+p<c-m||e-p>l+m)continue;const f=u+m-Math.abs(n-g);f>0&&M("x",Math.round(g),f)}for(let g=l;g>=c-1;g-=h){if(n+u<a-m||n-u>r+m)continue;const f=p+m-Math.abs(e-g);f>0&&M("z",Math.round(g),f)}return x}const Qs=[],l0=[],vn={spots:[],im:null,imW:null};function c0(n=1){const e=new Sn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return l0.push(e),e}function h0(n,e,t,i=t,s=null){Qs.push({x:n,z:e,rx:t,rz:i,waterY:s})}function Ys(n,e){let t=0,i=null;for(const s of Qs){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,l=a*a+r*r;if(l<1){let c=Math.pow(1-l,1.35);s.waterY!=null&&(c*=me.clamp((s.waterY-ce(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const Pa=[],fc=[],od=[];let sl=0;function fn(n,e){return od.push({obj:n,update:e}),n}function d0(n){sl+=n;for(const e of od)e.update(sl,n)}function wl(){if(fc.length===0)for(let n=0;n<js.length;n++){const e=js[n];for(let t=0;t<e.length;t+=14){const i=rd(e,t);fc.push({x:i.x,y:r0(e,t),z:i.z,s:t,courseIndex:n})}}return fc}function Pn(n,e,t=0){let i=null,s=1/0;for(const a of wl()){const r=n-a.x,l=e-a.z,c=Math.hypot(r,l);c<s&&(s=c,i=a)}return{clearance:s-t-a0*.58,distance:s,nearestS:i?.s??0}}function Os(n,e,t,i,s,a=9){const r=t*.5,l=i*.5,c=a0*.62+a;let h=null;for(const d of wl()){const u=Math.max(Math.abs(d.x-n)-r,0),p=Math.max(Math.abs(d.z-e)-l,0),m=Math.hypot(u,p)-c;if(m>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-m>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return h}function ui(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(Pn(a.x,a.z,e).clearance>=t&&!Ln(a.x,a.z,e*2,e*2,3.5))return a}return null}function fi(n,e,t,i,s){const a=Pn(e,t,i);Pa.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function kM(){const n=[...Pa].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Pa.length,unsafe:Pa.filter(e=>e.clearance<e.margin),closest:n}}function Gn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),l=new O(new Qe(i,i,r.length(),8),s);return l.position.copy(a),l.quaternion.setFromUnitVectors(Qt,r.normalize()),l.castShadow=!1,l.receiveShadow=!0,n.add(l),l}const pn={cloudMats:[],glowMats:[]};function BM(){const n=new bx(16757626,3097190,.66);Te.add(n);const e=new sc(7179775,.6);e.position.set(260,145,-260),Te.add(e);const t=new sc(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Te.add(t);const i=new sc(16742973,.5);i.position.set(-180,35,280),Te.add(i);const s=new td(5556479,90,900,2);s.position.set(0,88,-920),Te.add(s),pn.hemi=n,pn.fill=e,pn.key=t,pn.rim=i}let pi=null;function VM(){const n=new P(-310,150,230).normalize();pi=new O(new Jt(1200,48,32),new Sn({side:In,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
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
        }`})),pi.renderOrder=-100,pi.frustumCulled=!1,Te.add(pi);const e=n,t=new Rt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new O(new Mn(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),pi.add(i);const s=new Rt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:si});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const l=new O(new Mn(a,48),s.clone());l.material.opacity=r,l.position.copy(e).multiplyScalar(1060),l.lookAt(0,0,0),pi.add(l),pn.glowMats.push({mat:l.material,dusk:r})}pn.skyU=pi.material.uniforms,pn.sunMat=t}function GM(){const n=new W({map:LM(),color:8231526,roughness:.98,metalness:.02}),e=new O(new qt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const m=t.getX(p),x=t.getY(p);t.setZ(p,ce(m,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Te.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:yt});for(let p=0;p<3;p++){const m=150-p*190,x=-760-p*420,M=980,g=64+p*18,f=new O(new qt(980,64+p*18,1,1),i.clone());f.rotation.x=-Math.PI/2,f.rotation.z=-.34+p*.03,f.position.set(m,Ta(m,x,M,g)-.55,x),f.renderOrder=-4,Te.add(f)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let p=0;p<46;p++){const m=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[ce(x,M)];for(let y=0;y<6;y++)g.push(ce(x+Math.cos(y)*m*.9,M+Math.sin(y*1.9)*m*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const f=new O(new Mn(m,9),s[p%s.length]);f.rotation.x=-Math.PI/2,f.rotation.z=Math.random()*Math.PI,f.position.set(x,Math.max(...g)+.07,M),f.scale.y=.32+Math.random()*.5,f.receiveShadow=!0,Te.add(f)}const a=new Rt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const m=new O(new Mn(70+Math.random()*150,22),a.clone());m.material.opacity=.008+Math.random()*.014,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),m.position.y<8&&Ms.lowFogDisks++,m.scale.y=.22+Math.random()*.26,m.renderOrder=-6,Te.add(m)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],l=new W({color:15068905,roughness:.95});for(let p=0;p<52;p++){const m=78+Math.random()*180,x=52+Math.random()*115,M=ui(f=>{const y=p/52*Math.PI*2+f*1.77,v=1380+Math.random()*820+f*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!M)continue;const g=new O(new Ri(x,m,5+Math.floor(Math.random()*2)),r[p%r.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Te.add(g),fi("mountain",M.x,M.z,x,480),m>160){const f=new O(new Ri(x*.34,m*.22,5),l);f.position.copy(g.position).add(new P(0,m*.39,0)),f.rotation.y=g.rotation.y,Te.add(f)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const p=new Qe(.28,.42,1,6).translate(0,.5,0),m=bs([new Ri(2.7,5.4,7).translate(0,1.9,0),new Ri(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Ri(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),M=new cn(p,c,185),g=new cn(m,new W({roughness:.92}),185),f=new It;let y=0;for(let v=0;v<185;v++){const _=.58+Math.random()*1.05,E=8*_,T=ui(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:C,z:R}=T;if(bl(C,R,18))continue;const S=ce(C,R)+.8,b=2.2+Math.random()*3.8;f.position.set(C,S,R),f.rotation.y=Math.random()*Math.PI,f.scale.set(_,b,_),f.updateMatrix(),M.setMatrixAt(y,f.matrix),f.position.set(C,S+b,R),f.scale.set(_,_,_),f.updateMatrix(),g.setMatrixAt(y,f.matrix),g.setColorAt(y,x[v%3]),y++,fi("tree",C,R,E,145)}M.count=y,g.count=y,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Te.add(M),Te.add(g)}{const p=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),f=(v,_)=>Math.sin(x*_+v*37.7)*.5+.5;for(let v=0;v<16;v++){const _=v/15,E=Math.sin(_*Math.PI),T=24+_*208,C=66+(f(v,53)-.5)*22*E,R=(18+f(v,29)*22)*(.45+E*.75),S=g.createRadialGradient(T,C-R*.18,0,T,C,R);S.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),S.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),S.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=S,g.beginPath(),g.arc(T,C,R,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const _=.12+v/9*.76,E=_*256,T=20+f(v,71)*16,C=g.createRadialGradient(E,92,0,E,92,T);C.addColorStop(0,"rgba(255, 176, 128, 0.22)"),C.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=C,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const y=new nn(M);return y.colorSpace=Lt,y},m=[p(1),p(2),p(3)];Me.cloudSprites=0;for(let x=0;x<44;x++){const M=new pl({map:m[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new Qo(M),f=170+Math.random()*280;g.scale.set(f,f*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Te.add(g),Me.cloudSprites++,fn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const m=new it,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,f=new O(new xe(M,x,g),h[p%h.length]);f.position.y=x/2,f.castShadow=!0,f.receiveShadow=!0,m.add(f);const y=Sa(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const C of[-1,1]){const R=new O(new qt(M*.82,x*.74),v);R.position.set(0,x*.53,C*(g/2+.08)),R.rotation.y=C<0?Math.PI:0,m.add(R)}const _=new O(new xe(M*1.08,1.2,g*1.08),d);if(_.position.y=x+.7,m.add(_),Math.random()<.32){const C=new O(new Qe(.18,.3,10+Math.random()*12,8),d);C.position.y=x+6.5,m.add(C)}const E=Math.hypot(M,g)*.65,T=ui(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(m.position.set(T.x,Ta(T.x,T.z,M,g)-.7,T.z),m.rotation.y=Math.random()*Math.PI,Te.add(m),fi("building",T.x,T.z,E,240))}const u=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const m=new it,x=ms[p%ms.length],M=il[(p*3+1)%il.length],g=xs[p%xs.length],f=new W({map:o0(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,_=new O(new xe(y,v,.5),f);_.position.y=10,m.add(_);const E=new O(new xe(y+1.2,.32,.75),u);E.position.y=10+v*.5+.25,m.add(E);for(const C of[-7,7]){const R=new O(new Qe(.24,.32,10,8),u);R.position.set(C,5,-.2),m.add(R)}const T=ui(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);T&&(m.position.set(T.x,ce(T.x,T.z)+.5,T.z),m.rotation.y=-.35+Math.random()*.7,Te.add(m),fi("billboard",T.x,T.z,22,175),ks("roadside-billboard",T.x,m.position.y+10,T.z))}}function HM(){for(let f=0;f<3;f++){const y=[4012638,5326704,7035525][f],v=new Rt({color:y,transparent:!0,opacity:.6-f*.14,depthWrite:!1,fog:!1}),_=60,E=5200,T=new qt(E,360,_,1),C=T.attributes.position;for(let S=0;S<=_;S++){const b=S/_,L=(Math.sin(b*22+f*3)*.5+Math.sin(b*9+f)*.5)*70+120;C.setY(S,L),C.setY(S+_+1,-180)}C.needsUpdate=!0;const R=new O(T,v);R.position.set(0,40,-2300-f*360),Te.add(R)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let f=0;f<48;f++){const y=.7+Math.random()*1.2,v=9*y,_=ui(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!_)continue;const{x:E,z:T}=_;if(bl(E,T,18))continue;const C=ce(E,T)+.6,R=new it,S=2.6+Math.random()*3.4,b=new O(new Qe(.34,.5,S,6),n);b.position.y=S/2,R.add(b);const L=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let V=0;V<I;V++){const j=2.4+Math.random()*1.8,te=new O(new Jt(j,9,7),L);te.position.set((Math.random()-.5)*3,S+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,R.add(te)}R.position.set(E,C,T),R.scale.setScalar(y),Te.add(R),fi("tree",E,T,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:yt}),new W({color:9077368,roughness:1,flatShading:!0,side:yt}),new W({color:6249043,roughness:1,flatShading:!0,side:yt})];for(let f=0;f<70;f++){const y=2+Math.random()*7,v=ui(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:_,z:E}=v,T=new O(new Qh(y,0),t[f%t.length]),C=T.geometry.attributes.position;for(let R=0;R<C.count;R++)C.setXYZ(R,C.getX(R)*(.8+Math.random()*.4),C.getY(R)*(.6+Math.random()*.4),C.getZ(R)*(.8+Math.random()*.4));C.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(_,ce(_,E)+y*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Te.add(T),xi.push({kind:"rock",x:_,z:E,radius:y*1.12}),fi("rock",_,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let f=0;f<14;f++){const y=130+Math.random()*200,v=130+Math.random()*200,_=ui(()=>{for(let L=0;L<6;L++){const I=-1500+Math.random()*3e3,V=-700-Math.random()*1700,j=[ce(I,V),ce(I+y*.45,V+v*.45),ce(I-y*.45,V+v*.45),ce(I+y*.45,V-v*.45),ce(I-y*.45,V-v*.45)];if(Math.max(...j)-Math.min(...j)<1)return{x:I,z:V}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!_||_.x>9e4)continue;const{x:E,z:T}=_,C=new it,R=5+Math.floor(Math.random()*4),S=i[Math.floor(Math.random()*i.length)];for(let L=0;L<R;L++){const I=new W({color:L%2?S:i[Math.floor(Math.random()*i.length)],roughness:1}),V=new O(new qt(y,v/R),I);V.rotation.x=-Math.PI/2,V.position.set(0,.05,-v/2+(L+.5)*(v/R)),C.add(V)}const b=Math.max(ce(E,T),ce(E+y*.45,T+v*.45),ce(E-y*.45,T+v*.45),ce(E+y*.45,T-v*.45),ce(E-y*.45,T-v*.45));C.position.set(E,b+.06,T),C.rotation.y=Math.random()*Math.PI,Te.add(C),fi("field",E,T,Math.max(y,v)*.5,40)}{const f=ui(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(f){const y=[ce(f.x,f.z)];for(let E=0;E<8;E++)y.push(ce(f.x+Math.cos(E/8*Math.PI*2)*110,f.z+Math.sin(E/8*Math.PI*2)*74),ce(f.x+Math.cos(E/8*Math.PI*2)*200,f.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,T)=>E-T);const v=y[4]+.4,_=new O(new Mn(150,48),c0(9));_.rotation.x=-Math.PI/2,_.position.set(f.x,v,f.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Te.add(_),h0(f.x,f.z,222,148,v),Ms.waterBlockers++,fi("lake",f.x,f.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let f=0;f<9;f++){const y=f/9*Math.PI*2+.6,v=1500+Math.random()*700,_=Math.cos(y)*v,E=Math.sin(y)*v-1150,T=60+Math.random()*40,C=new it,R=new O(new Qe(1.1,2.2,T,10),s);R.position.y=T/2,C.add(R);const S=new it;S.position.set(0,T,3);const b=new O(new xe(3,3,7),s);S.add(b);const L=new it;L.position.z=3.5;for(let V=0;V<3;V++){const j=new O(new xe(1.1,26,.5),s);j.position.y=13;const te=new it;te.add(j),te.rotation.z=V/3*Math.PI*2,L.add(te)}S.add(L),C.add(S),C.position.set(_,-8,E),C.rotation.y=Math.random()*Math.PI,Te.add(C);const I=.5+Math.random()*.5;fn(L,V=>{L.rotation.z=V*I})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new el({color:2764595,transparent:!0,opacity:.5});let l=null;for(let f=0;f<7;f++){const y=-1100+f*360,v=-1650-Math.sin(f*.7)*120,_=48,E=new it,T=6;for(const R of[-1,1])for(const S of[-1,1]){const b=new O(new Qe(.4,.7,_,5),a);b.position.set(R*T,_/2,S*T),b.rotation.z=-R*.08,b.rotation.x=S*.08,E.add(b)}for(const R of[_*.6,_*.82,_]){const S=new O(new xe(T*4,.8,.8),a);S.position.y=R,E.add(S)}E.position.set(y,ce(y,v)-2,v),Te.add(E);const C=ce(y,v)-2+_;if(l)for(const R of[-T*2,0,T*2]){const S=l.x+R,b=l.z,L=y+R,I=v,V=[],j=12;for(let q=0;q<=j;q++){const K=q/j,ne=Math.sin(K*Math.PI)*6;V.push(new P(S+(L-S)*K,l.y-ne+(C-l.y)*K,b+(I-b)*K))}const te=new hh(new Zt().setFromPoints(V),r);Te.add(te)}l={x:y,y:C,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let f=0;f<5;f++){const y=ui(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:_}=y,E=70+Math.random()*50,T=new it,C=8;for(let L=0;L<C;L++){const I=new O(new Qe(.5,.7,E/C,4),L%2?h:c);I.position.y=(L+.5)*(E/C),I.rotation.y=Math.PI/4,T.add(I)}const R=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),S=new O(new Jt(1.1,10,8),R);S.position.y=E+1,T.add(S),T.position.set(v,ce(v,_),_),Te.add(T),fi("mast",v,_,8,120);const b=Math.random()*Math.PI*2;fn(S,L=>{R.emissiveIntensity=Math.sin(L*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let f=0;f<6;f++){const y=new it,v=d[f%d.length],_=new W({map:e_(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new O(new Jt(11,20,16),_);E.scale.y=1.25,y.add(E);const T=new O(new xe(3.4,3,3.4),new W({color:8014371,roughness:.9}));T.position.y=-17,y.add(T);const C=new el({color:3811866});for(const I of[-1,1])for(const V of[-1,1]){const j=new hh(new Zt().setFromPoints([new P(I*1.6,-15.5,V*1.6),new P(I*7,-3,V*7)]),C);y.add(j)}const R=-700+Math.random()*1400,S=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(R,b,S),Te.add(y);const L=Math.random()*Math.PI*2;fn(y,I=>{y.position.y=b+Math.sin(I*.5+L)*6,y.position.x=R+Math.sin(I*.08+L)*90,y.rotation.z=Math.sin(I*.4+L)*.04})}const u=new Rt({color:2829104,side:yt,fog:!1});function p(){const f=new jh;return f.moveTo(0,0),f.lineTo(-2.6,1.1),f.lineTo(-2.2,.2),f.lineTo(0,.5),f.lineTo(2.2,.2),f.lineTo(2.6,1.1),f.lineTo(0,0),new O(new gl(f),u)}for(let f=0;f<5;f++){const y=new it,v=5+Math.floor(Math.random()*5),_=[];for(let L=0;L<v;L++){const I=p(),V=L%2?1:-1,j=Math.ceil(L/2);I.position.set(V*j*5,-j*2.4,0),I.rotation.x=-Math.PI/2,y.add(I),_.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,C=18+Math.random()*14,R=1400,S=-700+Math.random()*1400;y.position.set(S,E,T),Te.add(y);const b=Math.random()*Math.PI*2;fn(y,(L,I)=>{y.position.x+=C*I,y.position.x>R&&(y.position.x=-R);const V=Math.sin(L*6+b);for(const j of _)j.rotation.x=-Math.PI/2+V*.4})}{const f=new it,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new O(new Jt(20,20,16),y);v.scale.set(2.6,1,1),f.add(v);const _=new W({color:13781835,roughness:.6});for(let S=0;S<3;S++){const b=new O(new xe(10,9,.6),_);b.position.x=-46,b.rotation.x=S/3*Math.PI*2,f.add(b)}const E=new O(new xe(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,f.add(E);const T=new O(new qt(40,10),new Rt({map:cd("STEEL RIBBON"),transparent:!0,side:yt}));T.position.set(60,0,0),f.add(T);const C=900,R=240;f.position.set(0,R,-1200),Te.add(f),fn(f,S=>{const b=S*.05;f.position.x=Math.cos(b)*C,f.position.z=-1200+Math.sin(b)*C*.5,f.position.y=R+Math.sin(S*.3)*8,f.rotation.y=-b+Math.PI/2})}const m=new Rt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let f=0;f<14;f++){const y=new O(new qt(220+Math.random()*360,16+Math.random()*22),m.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Te.add(y);const v=2+Math.random()*3;fn(y,(_,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),M=new Rt({map:t_(),side:yt});for(let f=0;f<4;f++){const y=ui(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:_}=y,E=new it,T=60+Math.random()*40,C=new O(new xe(T,1.4,26),x);C.position.set(0,26,-4),C.rotation.x=-.32,E.add(C);const R=new O(new qt(T*.94,24),M);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const S of[-T/2,T/2]){const b=new O(new xe(1.4,26,1.4),x);b.position.set(S,13,-8),E.add(b)}E.position.set(v,ce(v,_),_),E.rotation.y=Math.atan2(-v,-_)+(Math.random()-.5)*.5,Te.add(E),fi("grandstand",v,_,40,30)}const g=[16731486,16765503,16777215,11824127];for(let f=0;f<90;f++){const y=ui(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:_}=y,E=new it,T=g[Math.floor(Math.random()*g.length)],C=new Rt({color:T,side:yt}),R=5+Math.floor(Math.random()*6);for(let S=0;S<R;S++){const b=new O(new Mn(.5+Math.random()*.4,5),C);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,ce(v,_),_),Te.add(E),fi("flowers",v,_,3,20)}}const hn=[],ni=[];let gh=0;const xi=[],ta=[],En=[],vh=[],Fr=[],La=[],Me={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},al=[];function ks(n,e,t,i){Me.signs++,al.length<160&&al.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function hs(n,e,t=1){Me[n][e]=(Me[n][e]||0)+t}let Io=null,Hu=null;function u0(){return Io||(Io=new W({vertexColors:!0,roughness:.42,metalness:.22}),Io.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},Hu=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:Io,glass:Hu}}const ds=new rt;function un(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,l=new Float32Array(r*3),c=new Float32Array(r*3);ds.set(t??16777215);for(let h=0;h<r;h++)l[h*3]=ds.r,l[h*3+1]=ds.g,l[h*3+2]=ds.b;if(i){ds.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=ds.r,c[h*3+1]=ds.g,c[h*3+2]=ds.b}return a.setAttribute("color",new bt(l,3)),a.setAttribute("aEmissive",new bt(c,3)),a}function wn(n,e,t,i=0){return(i?new _t().makeRotationZ(i):new _t).setPosition(n,e,t)}function qr(n,e){const t=new it,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=u0(),l=n==="taxi"?16767293:e,c=new rt(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(un(new xe(s.w,s.h,s.l),wn(0,.95,0),l)),(s.bus?d:h).push(un(new xe(s.cabin[0],s.cabin[1],s.cabin[2]),wn(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(un(new xe(s.cabin[0]*.78,s.cabin[1]*.55,.08),wn(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(un(new xe(.08,s.cabin[1]*.5,s.cabin[2]*.48),wn(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(un(new xe(s.w*.94,.58,s.l*.38),wn(0,1.2,1.35),c)),s.box&&h.push(un(new xe(s.box[0],s.box[1],s.box[2]),wn(0,1.55,1.25),15130833)),s.bus){h.push(un(new xe(s.w+.06,.28,s.l*.86),wn(0,1.38,0),c));const y=new xe(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const _ of[-1,1])d.push(un(y,wn(_*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(un(new xe(1,.24,.46),wn(0,2.2,-.35),16774310,16765773,.9));const u=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],p=[],m=bs([un(new Qe(.42,.42,.36,14),wn(0,0,0,Math.PI/2),395016),un(new Qe(.18,.18,.38,10),wn(0,0,0,Math.PI/2),14147041)],!1),x=new xe(.3,.34,1.12);for(const y of u)for(const v of[-s.w*.54,s.w*.54]){const _=new O(m,a);_.position.set(v,.45,y),t.add(_),p.push(_),h.push(un(x,wn(v*1.02,.72,y),1250072))}const M=new xe(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(un(M,wn(0,.62,y),1250072));const g=new xe(.42,.2,.1),f=new xe(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(un(g,wn(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(un(f,wn(y,.98,s.l*.52+.04),16725033,16717325,1.45));return t.add(new O(bs(h,!1),a)),d.length&&t.add(new O(bs(d,!1),r)),t.userData={wheels:p,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55,plateHalfL:s.l/2},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function ld(n,e){const t=new it,{opaque:i}=u0(),s=new Jt(.25,8,5);s.scale(1,.5,1),t.add(new O(bs([un(new Qe(.28,.34,.95,8),wn(0,1.35,0),n),un(new Jt(.24,10,8),wn(0,2.02,0),12947299),un(s,wn(0,2.17,0),1119001)],!1),i));const a=[],r=un(new Qe(.075,.09,.78,6),null,e),l=un(new Qe(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new O(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new O(l,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}const Wu="BCDFGHJKLMNPRSTVWXZ",WM=["FCK","SHT","DCK","CNT","KKK","WTF","FML","NGR","FGT","SLT","DMN","BTC","JZZ"],Uo=340;function XM(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}let Fo=null;function qM(){if(Fo)return Fo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<64;s++){const a=XM(335585+s*2654435761);let r="";do{r="";for(let d=0;d<3;d++)r+=Wu[a()*Wu.length|0]}while(WM.includes(r));r+=" ";for(let d=0;d<3;d++)r+=a()*10|0;t.push(r);const l=s%8*128,c=(s/8|0)*64,h=s%9===3;e.fillStyle=h?"#f3d268":"#ece9dc",e.fillRect(l+6,c+8,116,48),e.strokeStyle="#25304d",e.lineWidth=3,e.strokeRect(l+7.5,c+9.5,113,45),e.fillStyle="#1c2848",e.textAlign="center",e.textBaseline="middle",e.font="bold 30px 'Courier New', monospace",e.fillText(r,l+64,c+38),e.font="bold 10px sans-serif",e.fillText("STEEL STATE",l+64,c+17)}const i=new nn(n);return i.colorSpace=Lt,i.anisotropy=4,Fo={texture:i,texts:t},Fo}const YM=new P(1,1,1),pc=new _t,zo=new _t,Pi={mesh:null,texts:null,statics:[],dynamics:[],_zero:new _t().makeScale(0,0,0),ensure(){if(this.mesh)return;const{texture:n,texts:e}=qM();this.texts=e;const t=new qt(.55,.17);t.setAttribute("aPlateSlot",new ch(new Float32Array(Uo*2),2));const i=new Rt({map:n});i.customProgramCacheKey=()=>"plate-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aPlateSlot;
varying vec2 vPlateUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPlateUv = uv * 0.125 + aPlateSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vPlateUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vPlateUv );")},this.mesh=new cn(t,i,Uo),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;for(let s=0;s<Uo;s++)this.mesh.setMatrixAt(s,this._zero);Te.add(this.mesh)},_slot(n){const e=n%64;return{u:e%8*.125,v:(7-(e/8|0))*.125,s:e}},_offsets(n,e=.03){return{offF:new _t().makeRotationY(Math.PI).setPosition(0,.62,-(n+e)),offR:new _t().setPosition(0,.62,n+e)}},resetStatic(){this.ensure(),this.statics.length=0;for(let n=0;n<260;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},resetDynamic(){this.ensure(),this.dynamics.length=0;for(let n=260;n<Uo;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},addStatic(n,e,t,i){if(this.ensure(),this.statics.length>=130)return;const s=this.statics.length*2,{u:a,v:r,s:l}=this._slot(t*13+29),c={matrix:n.clone(),spot:i,wasTaken:null,iF:s,iR:s+1,slot:l,...this._offsets(e)},h=this.mesh.geometry.getAttribute("aPlateSlot");h.setXY(c.iF,a,r),h.setXY(c.iR,a,r),h.needsUpdate=!0,this.statics.push(c),this._applyStatic(c)},_applyStatic(n){n.wasTaken=!!(n.spot&&n.spot.taken),n.wasTaken?(this.mesh.setMatrixAt(n.iF,this._zero),this.mesh.setMatrixAt(n.iR,this._zero)):(this.mesh.setMatrixAt(n.iF,zo.multiplyMatrices(n.matrix,n.offF)),this.mesh.setMatrixAt(n.iR,zo.multiplyMatrices(n.matrix,n.offR))),this.mesh.instanceMatrix.needsUpdate=!0},addDynamic(n,e){if(this.ensure(),this.dynamics.length>=40)return;const t=260+this.dynamics.length*2,{u:i,v:s,s:a}=this._slot(e*37+11),r=this.mesh.geometry.getAttribute("aPlateSlot");r.setXY(t,i,s),r.setXY(t+1,i,s),r.needsUpdate=!0,this.dynamics.push({carMesh:n,iF:t,iR:t+1,slot:a,...this._offsets(n.userData.plateHalfL||2.2,.155)})},update(){if(!(!this.mesh||!this.dynamics.length)){for(const n of this.dynamics)pc.compose(n.carMesh.position,n.carMesh.quaternion,YM),this.mesh.setMatrixAt(n.iF,zo.multiplyMatrices(pc,n.offF)),this.mesh.setMatrixAt(n.iR,zo.multiplyMatrices(pc,n.offR));for(const n of this.statics)!!(n.spot&&n.spot.taken)!==n.wasTaken&&this._applyStatic(n);this.mesh.instanceMatrix.needsUpdate=!0}}};function $M(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:l,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,x=[],M=[];for(let D=i;D<=s+1;D+=l)x.push(Math.round(D));for(let D=a;D>=r-1;D-=l)M.push(Math.round(D));M.sort((D,Ie)=>D-Ie);const g=x[0],f=x[x.length-1],y=M[0],v=M[M.length-1];En.length=0,vh.length=0,Fr.length=0,La.length=0,Me.traffic=0,Me.pedestrians=0,Me.types={},Me.turns=0,Me.splats=0,Me.trafficCrashes=0,Me.streetLights=0,Me.trafficLights=0,Me.stopSigns=0,Pi.resetDynamic();const _=D=>D[Math.random()*D.length|0],E=D=>(D>0?-1:1)*c*.23,T=(D,Ie)=>{let ye=0,Ce=1/0;for(let $=0;$<D.length;$++){const Z=Math.abs(D[$]-Ie);Z<Ce&&(Ce=Z,ye=$)}return ye},C=(D,Ie,ye)=>{const Ce=D==="ns"?M:x;if(ye>0){for(const $ of Ce)if($>Ie+.05)return $;return Ce[Ce.length-1]}for(let $=Ce.length-1;$>=0;$--)if(Ce[$]<Ie-.05)return Ce[$];return Ce[0]},R=D=>{const Ie=D.laneOffset+(D.avoidOffset||0);return D.axis==="ns"?{x:D.road+Ie,z:D.along}:{x:D.along,z:D.road+Ie}},S=D=>{if(o.mode!=="roam")return null;const Ie=R(D);if(Math.abs(o.roamPos.y-(ce(Ie.x,Ie.z)+Fn))>4.2)return null;const ye=D.axis==="ns"?0:D.dir,Ce=D.axis==="ns"?D.dir:0,$=o.roamPos.x-Ie.x,Z=o.roamPos.z-Ie.z,we=$*ye+Z*Ce,Re=D.axis==="ns"?$:Z,ke=Math.abs(Re),tt=Math.hypot($,Z),kt=D.mesh?.userData?.colliderHalfW||2,at=D.mesh?.userData?.colliderHalfD||3;return tt<Dn+Math.max(kt,at)*.55||we>-1.5&&we<at+4.2&&ke<Dn+kt*.85?{crash:!0}:we>0&&we<30&&ke<c*.36?{avoidOffset:(Re>=0?-1:1)*D.maxAvoidOffset,stop:we<13&&ke<Dn+kt*.95}:null},b=(D,Ie)=>`${Math.round(D)},${Math.round(Ie)}`,L=(D,Ie)=>{const ye=((Ie+D.phase)%15.5+15.5)%15.5;return ye<6.2?"ns":ye<7.4?"yellow-ns":ye<13.6?"ew":"yellow-ew"},I=(D,Ie)=>{const ye=D.axis==="ns"?D.road:D.next,Ce=D.axis==="ns"?D.next:D.road,$=b(ye,Ce),Z=h.get($);if(!Z)return null;if(Z.type==="signal"){const we=L(Z,Ie),Re=we===`yellow-${D.axis}`;return we===D.axis&&!Re?null:{control:Z,key:$,kind:"signal"}}return Z.type==="stop"&&D.lastControlKey!==$?{control:Z,key:$,kind:"stop"}:null},V=(D,Ie=!1)=>{const ye=D.axis,Ce=D.along,$=ye==="ns"?x:M,Z=D.road,we=T($,Z),Re=[],ke=ye==="ns"?y:g,tt=ye==="ns"?v:f;!Ie&&Ce+D.dir*l>=ke&&Ce+D.dir*l<=tt&&Re.push({axis:ye,road:D.road,along:Ce,dir:D.dir,turn:!1}),we>0&&Re.push({axis:ye==="ns"?"ew":"ns",road:Ce,along:Z,dir:-1,turn:!0}),we<$.length-1&&Re.push({axis:ye==="ns"?"ew":"ns",road:Ce,along:Z,dir:1,turn:!0}),Re.length||Re.push({axis:ye,road:D.road,along:Ce,dir:-D.dir,turn:!0});const kt=Re.filter(zt=>zt.turn),at=!Ie&&kt.length&&Math.random()<.42?_(kt):_(Re);(at.turn||at.axis!==ye)&&Me.turns++,D.axis=at.axis,D.road=at.road,D.along=at.along,D.dir=at.dir,D.laneOffset=E(D.dir),D.next=C(D.axis,D.along,D.dir),D.turnBlend=at.turn?1:0,D.lastControlKey=null};for(let D=0;D<m;D++){const Ie=Math.random()<.56?"ns":"ew",ye=u[D%u.length],Ce=Math.random()<.5?-1:1,$=(ye==="bus"||ye==="boxTruck"?10:13)+Math.random()*9,Z={axis:Ie,dir:Ce,type:ye,road:_(Ie==="ns"?x:M),laneOffset:E(Ce),along:_(Ie==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:qr(ye,d[D*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};Z.collider.actor=Z,D<8&&(Z.axis="ns",Z.dir=-1,Z.laneOffset=E(Z.dir),Z.road=[210,-50,210,-50][D%4],Z.along=318-D*54,Z.speed+=3),Z.next=C(Z.axis,Z.along,Z.dir),En.push(Z.collider),p.push(Z),vh.push(Z),n.add(Z.mesh),Pi.addDynamic(Z.mesh,D),Me.types[ye]=(Me.types[ye]||0)+1}function j(D,Ie=0,ye=0){if(D.stolen)return;let Ce=Math.max(0,D.speed*ye);D.panicT>0?(D.panicT-=ye,Ce*=.32,D.brakePulse=1,D.avoidOffset+=(Math.sign(D.laneOffset||1)*2.1-D.avoidOffset)*Math.min(1,ye*3),D.honked||(D.honked=!0,EM())):D.honked=!1;const $=S(D);for($?.crash?(H0(D,o.roamPos),Ce=0):$?(D.avoidOffset+=($.avoidOffset-D.avoidOffset)*Math.min(1,ye*4.5),D.brakePulse=Math.max(D.brakePulse||0,$.stop?1:.35),$.stop&&(D.waitTimer=Math.max(D.waitTimer,.22),Ce=0)):D.avoidOffset+=(0-D.avoidOffset)*Math.min(1,ye*1.8),D.crashTimer>0&&(D.crashTimer=Math.max(0,D.crashTimer-ye),Ce=0),D.waitTimer>0&&(D.waitTimer=Math.max(0,D.waitTimer-ye),Ce=0);Ce>0;){const k=I(D,Ie);if(k){const Mt=D.next-D.dir*(k.kind==="signal"?12:8),Nt=(Mt-D.along)*D.dir;if(Nt>=-.35&&Nt<=Ce+.25){D.along=Mt,D.brakePulse=1,Ce=0,k.kind==="stop"&&(D.waitTimer=.65+Math.random()*.4,D.lastControlKey=k.key);break}}const wt=Math.abs(D.next-D.along);if(Ce<wt)D.along+=D.dir*Ce,Ce=0;else{D.along=D.next,Ce-=wt;const Mt=D.next<=(D.axis==="ns"?y:g)+.05||D.next>=(D.axis==="ns"?v:f)-.05;V(D,Mt)}}D.brakePulse=Math.max(0,(D.brakePulse||0)-ye*3.2),D.turnBlend=Math.max(0,D.turnBlend-ye*3.2);const{x:Z,z:we}=R(D),Re=D.axis==="ns"?0:D.dir,ke=D.axis==="ns"?D.dir:0;D.mesh.position.set(Z,ce(Z,we)+.28+Math.sin(Ie*3.2+D.bob)*.035,we);const tt=Math.atan2(-Re,-ke),kt=Math.atan2(Math.sin(tt-D.mesh.rotation.y),Math.cos(tt-D.mesh.rotation.y));D.mesh.rotation.y+=kt*Math.min(1,ye*7+D.turnBlend*.55),D.crashTimer>0&&(D.mesh.rotation.y+=Math.sin(Ie*22+D.bob)*.02);for(const k of D.mesh.userData.wheels||[])k.rotation.x-=D.dir*D.speed*ye*1.7;const at=D.mesh.userData.colliderHalfD,zt=D.mesh.userData.colliderHalfW;D.collider.x=Z,D.collider.z=we,D.collider.hw=D.axis==="ns"?zt:at,D.collider.hd=D.axis==="ns"?at:zt,D.collider.maxY=D.mesh.position.y+3.2}for(const D of p)j(D,0,0);Me.traffic=p.length,fn(n,(D,Ie)=>{for(const ye of p)j(ye,D,Ie);Pi.update()});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],K=[],ne=45;for(let D=0;D<ne;D++){const Ie=Math.random()<.56?"ns":"ew",ye=e[Math.random()*e.length|0],Ce=Math.abs(ye.z1-ye.z0)>Math.abs(ye.x1-ye.x0),$=Ie==="ns"?Ce?"ns":"ew":Ce?"ew":"ns",Z=Math.random()<.5?-1:1,we=Math.random()<.5?-1:1,Re={axis:$,dir:Z,sideSign:we,coord:_($==="ns"?x:M),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:ld(te[D%te.length],q[D*2%q.length])};D<14&&(Re.axis="ns",Re.coord=80,Re.sideSign=D%2?-1:1,Re.dir=D%3===0?1:-1,Re.along=350-D*24,Re.speed=1.5+D%4*.35),K.push(Re),Fr.push(Re),Re.mesh.traverse(ke=>ke.castShadow=!1),n.add(Re.mesh)}const fe=new Rt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:yt}),ve=new Rt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:yt});for(let D=0;D<18;D++){const Ie=new it,ye=new O(new Mn(1,12),fe.clone());ye.rotation.x=-Math.PI/2,Ie.add(ye);for(let Ce=0;Ce<7;Ce++){const $=new O(new Mn(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Ce)*(.6+Math.random()*1.2),.01,Math.sin(Ce*1.7)*(.5+Math.random()*1.1)),Ie.add($)}Ie.visible=!1,Ie.userData.life=0,Ie.userData.maxLife=2.8,Ie.position.y=-99,n.add(Ie),La.push(Ie)}function Ye(D,Ie=0,ye=0){if(!D.active)if(D.respawn-=ye,D.respawn<=0)D.active=!0,D.mesh.visible=!0,D.along+=D.dir*50;else return;D.along+=D.dir*D.speed*ye,D.axis==="ns"?(D.along<r-28&&(D.along=a+28),D.along>a+28&&(D.along=r-28)):(D.along<i-28&&(D.along=s+28),D.along>s+28&&(D.along=i-28));const Ce=D.sideSign*(c*.66+1.2),$=D.axis==="ns"?D.coord+Ce:D.along,Z=D.axis==="ns"?D.along:D.coord+Ce,we=D.axis==="ns"?0:D.dir,Re=D.axis==="ns"?D.dir:0;D.x=$,D.z=Z,D.mesh.position.set($,ce($,Z)+.08,Z),D.mesh.rotation.y=Math.atan2(-we,-Re);const ke=Math.sin(Ie*7+D.phase);for(const tt of D.mesh.userData.limbs||[])tt.mesh.rotation.x=ke*tt.amp*tt.side,tt.mesh.position.y=tt.baseY+Math.abs(ke)*.025}for(const D of K)Ye(D,0,0);Me.pedestrians=K.length,fn(n,(D,Ie)=>{for(const ye of K)Ye(ye,D,Ie);for(const ye of La){if(!ye.visible)continue;ye.userData.life-=Ie;const Ce=ye.userData.life,$=me.clamp(Ce/ye.userData.maxLife,0,1);ye.scale.setScalar(1+(1-$)*.35),ye.traverse(Z=>{Z.material&&(Z.material.opacity=Math.min(.78,$*1.2))}),Ce<=0&&(ye.visible=!1)}})}function ZM(){const n=new it,e=new It;new ns().setFromAxisAngle(new P(1,0,0),-Math.PI/2),Me.roadDetails={},Me.buildingArchetypes={},Me.zones={},Me.openerProps=0;const t=Be.x0,i=Be.x1,s=Be.zNear,a=Be.zFar,r=Be.pitch,l=Be.streetW,c=r-l,h=[],d=[];for(let z=t;z<=i+1;z+=r)h.push(Math.round(z));for(let z=s;z>=a-1;z-=r)d.push(Math.round(z));const u=[];for(const z of h)u.push({x0:z,z0:s,x1:z,z1:a});for(const z of d)u.push({x0:t,z0:z,x1:i,z1:z});function p(z,N){const Y=z.x1-z.x0,ee=z.z1-z.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,w=Y/ie;return{x0:z.x0+le*N,z0:z.z0+w*N,x1:z.x1+le*N,z1:z.z1+w*N}}function m(z,N,Y){const ee=[],ie=[];for(const w of z){const F=w.x1-w.x0,G=w.z1-w.z0,X=Math.hypot(F,G),B=Math.max(1,Math.round(X/14)),oe=F/X,re=-(G/X),Q=oe;let ue=null,Le=null;for(let Ve=0;Ve<=B;Ve++){const De=Ve/B,Ne=De*X/68,ft=w.x0+F*De,St=w.z0+G*De,Pt=ft+re*N,Tt=St+Q*N,$e=ft-re*N,Dt=St-Q*N,mt=[Pt,ce(Pt,Tt)+Y,Tt,Ne],jt=[$e,ce($e,Dt)+Y,Dt,Ne];ue&&(ee.push(ue[0],ue[1],ue[2],Le[0],Le[1],Le[2],jt[0],jt[1],jt[2]),ee.push(ue[0],ue[1],ue[2],jt[0],jt[1],jt[2],mt[0],mt[1],mt[2]),ie.push(0,ue[3],1,Le[3],1,jt[3]),ie.push(0,ue[3],1,jt[3],0,mt[3])),ue=mt,Le=jt}}const le=new Zt;return le.setAttribute("position",new bt(ee,3)),le.setAttribute("uv",new bt(ie,2)),le.computeVertexNormals(),le}const x=(pn.roadMat=new W({map:DM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:yt}),pn.roadMat),M=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),f=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),_=[],E=[];for(const z of u)_.push(p(z,l*.5+3.3),p(z,-13.3)),E.push(p(z,l*.5+.42),p(z,-10.42));const T=new O(m(_,2.9,.66),M);T.receiveShadow=!0,n.add(T);const C=new O(m(E,.28,.78),g);C.receiveShadow=!0,n.add(C),hs("roadDetails","sidewalkRuns",_.length),hs("roadDetails","curbRuns",E.length);const R=new O(m(u,l/2,.55),x);R.receiveShadow=!0,n.add(R);const S=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:yt});n.add(new O(m(u,.4,.62),S));let b=0,L=0,I=0;for(let z=1;z<h.length-1;z++)for(let N=1;N<d.length-1;N++){const Y=h[z],ee=d[N];if(!(Pn(Y,ee,l*.75).clearance<2))for(const ie of[-1,1]){const le=new O(new xe(l*.92,.07,1.15),f);le.position.set(Y,ce(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const w=new O(new xe(1.15,.07,l*.92),f);w.position.set(Y+ie*13,ce(Y+ie*13,ee)+.83,ee),w.receiveShadow=!0,n.add(w),b+=2}}const V=new jh;V.moveTo(0,5.8),V.lineTo(2.5,1.6),V.lineTo(.72,1.6),V.lineTo(.72,-5.2),V.lineTo(-.72,-5.2),V.lineTo(-.72,1.6),V.lineTo(-2.5,1.6),V.closePath();const j=new gl(V);j.rotateX(-Math.PI/2);for(const z of u){const N=Math.abs(z.x1-z.x0)<Math.abs(z.z1-z.z0),Y=Math.hypot(z.x1-z.x0,z.z1-z.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,w=z.x0+(z.x1-z.x0)*le,F=z.z0+(z.z1-z.z0)*le;if(Pn(w,F,4).clearance<2)continue;const G=new O(j,y);if(G.position.set(w,ce(w,F)+.86,F),G.rotation.y=N?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),L++,ie%2===0){const X=new O(new Qe(1.05,1.05,.08,24),v);X.position.set(w+(N?3.8:0),ce(w,F)+.84,F+(N?0:3.8)),n.add(X),I++}}}hs("roadDetails","crosswalks",b),hs("roadDetails","laneArrows",L),hs("roadDetails","manholes",I);const te=new Rt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:yt,blending:si}),q=new Rt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:yt,blending:si});for(let z=0;z<120;z++){const N=u[Math.random()*u.length|0],Y=Math.random(),ee=N.x0+(N.x1-N.x0)*Y,ie=N.z0+(N.z1-N.z0)*Y;if(Pn(ee,ie,4).clearance<2)continue;const le=new O(new Mn(1,18),(z%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(N.x1-N.x0,N.z1-N.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*l*.7,ce(ee,ie)+.66,ie+(Math.random()-.5)*l*.7),n.add(le)}const K=[Sa(160,320,.5),Sa(160,320,.62),Sa(160,320,.42)],ne=[new W({map:K[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:K[0],emissiveIntensity:.34}),new W({map:K[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:K[1],emissiveIntensity:.32}),new W({map:K[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:K[2],emissiveIntensity:.36})],fe=new xe(1,1,1),ve=[[],[],[]],Ye=[],D=[],Ie=[],ye=[],Ce=[],$=[],Z=[],we=[],Re=[],ke=[],tt=[],kt=[],at=[],zt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],k=UM(256,256,"#dbcdb8"),wt=FM(),Mt=zM(),Nt=[uc(512,384,"#944737","#2e95bf"),uc(512,384,"#7e4d3e","#d04d65"),uc(512,384,"#a65a35","#4fba6d")],je=NM();function Gt(z,N){hs("zones",z),hs("buildingArchetypes",N)}function ot(z,N,Y,ee,ie,le="downtown"){if(Ln(z,N,Y,ee))return!1;const w=Ta(z,N,Y,ee)-1.1;if(Os(z,N,Y,ee,w+ie+2))return!1;if(e.position.set(z,w+ie/2,N),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(z,w+ie+.6,N),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),Ye.push(e.matrix.clone()),ie>26){const F=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(z,w+ie+1.35,N+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),D.push(e.matrix.clone()),Ie.push(F);Math.random()<.34&&ye.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const F=Math.random()<.5?"x":"z";Ce.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const F=Math.random()<.5?"x":"z";$.push({px:z,pz:N,w:Y,d:ee,h:ie,gy:w,axis:F,side:Math.random()<.5?-1:1})}return hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,ie>64?"glassTower":"midrise"),!0}function vt(z,N,Y,ee,ie,le="residential"){if(Ln(z,N,Y,ee))return!1;const w=Ta(z,N,Y,ee)-.55,F=2+Math.random()*2.4;if(Os(z,N,Y,ee,w+ie+F+1.5,6))return!1;e.position.set(z,w+ie/2,N),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),Z.push(e.matrix.clone()),hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+F+1.5}),we.push(zt[Math.random()*zt.length|0]),e.position.set(z,w+ie+F/2,N),e.scale.set(Y*.82,F,ee*.82),e.updateMatrix(),Re.push(e.matrix.clone());const G=t+Math.round((z-t)/r)*r,X=s-Math.round((s-N)/r)*r,B=Math.abs(z-G)<Math.abs(N-X),oe=B?G>z?1:-1:X>N?1:-1,re=Math.min(B?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),ue=Math.min(24,Math.max(8,B?Math.abs(G-z)-Y*.5-l*.35:Math.abs(X-N)-ee*.5-l*.35));e.quaternion.identity(),B?(e.position.set(z+oe*(Y*.5+.1),w+Q*.5+.1,N-ee*.16),e.scale.set(.24,Q,re),e.updateMatrix(),ke.push(e.matrix.clone()),e.position.set(z+oe*(Y*.5+ue*.5),ce(z+oe*(Y*.5+ue*.5),N)+.08,N-ee*.16),e.scale.set(ue,.08,re*1.18)):(e.position.set(z-Y*.16,w+Q*.5+.1,N+oe*(ee*.5+.1)),e.scale.set(re,Q,.24),e.updateMatrix(),ke.push(e.matrix.clone()),e.position.set(z-Y*.16,ce(z,N+oe*(ee*.5+ue*.5))+.08,N+oe*(ee*.5+ue*.5)),e.scale.set(re*1.18,.08,ue)),e.updateMatrix(),tt.push(e.matrix.clone()),e.position.set(z,w+.02,N),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),kt.push(e.matrix.clone());for(let Le=0;Le<3;Le++){const Ve=B?z+oe*(Y*.55):z+(Le-1)*Y*.25,De=B?N+(Le-1)*ee*.28:N+oe*(ee*.55);e.position.set(Ve,ce(Ve,De)+.55,De);const Ne=.85+Math.random()*.75;e.scale.set(Ne*1.35,Ne,Ne*1.35),e.updateMatrix(),at.push(e.matrix.clone())}return Gt(le,"residentialHouse"),!0}function U(z,N,Y,ee,ie,le="commercial"){if(Ln(z,N,Y,ee))return!1;const w=Ta(z,N,Y,ee)-.8;if(Os(z,N,Y,ee,w+ie+2,7))return!1;const F=new W({map:je,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(z,w+ie/2,N),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),B=new O(new xe(Y*.72,.32,ee*.18),X);B.position.set(z,w+ie*.38,N+ee*.18),B.rotation.z=.13,n.add(B);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let re=5;re<ie;re+=9){const Q=new O(new xe(Y*1.02,.24,.22),oe);Q.position.set(z,w+re,N+ee*.5+.14),n.add(Q)}return hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,"parkingGarage"),!0}function A(z,N,Y,ee,ie,le="commercial"){if(Ln(z,N,Y,ee))return!1;const w=Ta(z,N,Y,ee)-.65;if(Os(z,N,Y,ee,w+ie+2,7))return!1;const F=new W({map:Nt[Math.random()*Nt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new O(new xe(Y,ie,ee),F);G.position.set(z,w+ie/2,N),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new O(new xe(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(z,w+ie+.45,N),n.add(X);const B=t+Math.round((z-t)/r)*r,oe=s-Math.round((s-N)/r)*r,re=Math.abs(z-B)<Math.abs(N-oe),Q=re?B>z?1:-1:oe>N?1:-1,ue=xs[(z+N|0)%xs.length]||"#ffd45b",Le=new Rt({map:dc(ms[(Math.abs(z)+Math.abs(N)|0)%ms.length],ue),transparent:!0,side:yt,depthWrite:!1}),Ve=new O(new qt(Math.min(16,re?ee*.82:Y*.82),4.2),Le);return re?(Ve.position.set(z+Q*(Y*.5+.2),w+ie*.66,N),Ve.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(Ve.position.set(z,w+ie*.66,N+Q*(ee*.5+.2)),Ve.rotation.y=Q<0?Math.PI:0),n.add(Ve),ks("storefront-sign",Ve.position.x,Ve.position.y,Ve.position.z),hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:w+ie+2}),Gt(le,"brickStorefront"),!0}for(let z=t+r/2;z<=i-r/2;z+=r)for(let N=s-r/2;N>=a+r/2;N-=r){const Y=Pn(z,N,c*.5).clearance;if(Y<2)continue;const ee=N>40&&N<380&&z>-360&&z<360,ie=ee?"showcase":N<-920?"industrial":Y>230||N<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=c/3;for(let w=0;w<3;w++)for(let F=0;F<3;F++){if(Math.random()<.08)continue;const G=z-c/2+le*(w+.5)+(Math.random()-.5)*le*.3,X=N-c/2+le*(F+.5)+(Math.random()-.5)*le*.3;if(Pn(G,X,8).clearance<1)continue;const B=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?ot(G,X,B*.9,oe*.9,12+Math.random()*12,ie):vt(G,X,B,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,w=le?me.clamp(58+Y*1.15,68,205):me.clamp(22+Y*.3,22,66),F=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<F;G++){const X=15+Math.random()*Math.min(30,c*.46),B=15+Math.random()*Math.min(30,c*.46),oe=z+(Math.random()-.5)*(c-X),re=N+(Math.random()-.5)*(c-B);if(Pn(oe,re,Math.hypot(X,B)*.5).clearance<2)continue;const Q=(18+Math.random()*(w-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&A(oe,re,Math.max(18,X*1.12),Math.max(18,B*1.08),12+Math.random()*14,ie)||Math.random()<.18&&U(oe,re,Math.max(24,X*1.35),Math.max(24,B*1.28),24+Math.random()*24,ie))||ot(oe,re,X,B,Q,ie)}}}for(let z=0;z<3;z++){if(!ve[z].length)continue;const N=new cn(fe,ne[z],ve[z].length);for(let Y=0;Y<ve[z].length;Y++)N.setMatrixAt(Y,ve[z][Y]);N.instanceMatrix.needsUpdate=!0,N.castShadow=!0,N.receiveShadow=!0,n.add(N)}if(Ye.length){const z=new W({color:2896696,roughness:.62,metalness:.34}),N=new cn(fe,z,Ye.length);for(let Y=0;Y<Ye.length;Y++)N.setMatrixAt(Y,Ye[Y]);N.instanceMatrix.needsUpdate=!0,n.add(N)}if(D.length){const z=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),N=new cn(fe,z,D.length);for(let Y=0;Y<D.length;Y++)N.setMatrixAt(Y,D[Y]),N.setColorAt(Y,new rt(Ie[Y]));N.instanceMatrix.needsUpdate=!0,N.instanceColor&&(N.instanceColor.needsUpdate=!0),n.add(N)}if(Z.length){const z=new W({color:4891451,roughness:.88,metalness:.02}),N=new cn(fe,z,kt.length);for(let Q=0;Q<kt.length;Q++)N.setMatrixAt(Q,kt[Q]);N.instanceMatrix.needsUpdate=!0,N.receiveShadow=!0,n.add(N);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new cn(fe,Y,tt.length);for(let Q=0;Q<tt.length;Q++)ee.setMatrixAt(Q,tt[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:k,roughness:.78,metalness:.03}),le=new cn(fe,ie,Z.length);for(let Q=0;Q<Z.length;Q++)le.setMatrixAt(Q,Z[Q]),le.setColorAt(Q,new rt(we[Q]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const w=new Ri(.72,1,4);w.rotateY(Math.PI/4);const F=new W({map:wt,color:14314033,roughness:.72}),G=new cn(w,F,Re.length);for(let Q=0;Q<Re.length;Q++)G.setMatrixAt(Q,Re[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:Mt,roughness:.38,metalness:.18}),B=new cn(fe,X,ke.length);for(let Q=0;Q<ke.length;Q++)B.setMatrixAt(Q,ke[Q]);B.instanceMatrix.needsUpdate=!0,n.add(B);const oe=new W({color:3112239,roughness:.88,metalness:.02}),re=new cn(new Jt(1,8,6),oe,at.length);for(let Q=0;Q<at.length;Q++)re.setMatrixAt(Q,at[Q]);re.instanceMatrix.needsUpdate=!0,re.castShadow=!0,re.receiveShadow=!0,n.add(re)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let z=0;z<Math.min(ye.length,34);z++){const N=ye[z],Y=J[z%J.length],ee=z%3===0?"#ff4fb7":z%3===1?"#4ff3ff":"#ffd45b",ie=new Rt({map:Gu(Y,ee),transparent:!0,side:yt,depthWrite:!1}),le=new O(new qt(8,24),ie);le.position.set(N.px,N.gy+Math.max(14,N.h*.58),N.pz+N.zSide*(N.d*.5+.25)),le.rotation.y=N.zSide<0?Math.PI:0,n.add(le),ks("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let z=0;z<Math.min(Ce.length,48);z++){const N=Ce[z],Y=ms[(z*5+2)%ms.length],ee=xs[(z*2+1)%xs.length],ie=new Rt({map:dc(Y,ee),transparent:!0,side:yt,depthWrite:!1}),le=Math.min(17,(N.axis==="x"?N.d:N.w)*.82),w=new O(new qt(le,4.7),ie),F=N.gy+Math.max(6.2,Math.min(N.h-3.5,N.h*(.28+z%3*.12)));N.axis==="x"?(w.position.set(N.px+N.side*(N.w*.5+.22),F,N.pz),w.rotation.y=N.side>0?Math.PI/2:-Math.PI/2):(w.position.set(N.px,F,N.pz+N.side*(N.d*.5+.22)),w.rotation.y=N.side<0?Math.PI:0),n.add(w),ks("wall-sign",w.position.x,w.position.y,w.position.z)}for(let z=0;z<Math.min($.length,18);z++){const N=$[z],Y=ms[(z*7+4)%ms.length],ee=il[(z*5+3)%il.length],ie=xs[(z+3)%xs.length],le=new it,w=new W({map:o0(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),F=Math.min(18,(N.axis==="x"?N.d:N.w)*.86),G=new O(new xe(F,5.2,.42),w);G.position.y=4.8,le.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const B of[-F*.34,F*.34]){const oe=new O(new Qe(.13,.17,5,8),X);oe.position.set(B,2.25,-.2),le.add(oe)}le.position.set(N.px,N.gy+N.h+.7,N.pz),le.rotation.y=N.axis==="x"?N.side>0?Math.PI/2:-Math.PI/2:N.side<0?Math.PI:0,n.add(le),ks("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const de=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=bs([new xe(2.2,.72,4.6).translate(0,.78,0),new xe(1.7,.56,2.15).translate(0,1.42,-.22)]),ae=bs([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([z,N])=>new Qe(.36,.36,.3,10).rotateZ(Math.PI/2).translate(z,.38,N))),et=130,Ue=new cn(ge,new W({roughness:.42,metalness:.36}),et),nt=new cn(ae,new W({color:1512727,roughness:.9}),et);Pi.resetStatic();let qe=0,_e=0;for(;qe<et&&_e<et*6;){_e++;const z=Math.random()<.5,N=z?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(l*.26):t+Math.random()*(i-t),Y=z?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(l*.26);if(Pn(N,Y,4).clearance<2)continue;const ee=ce(N,Y)+.06;e.position.set(N,ee,Y),e.quaternion.setFromAxisAngle(Qt,z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ue.setMatrixAt(qe,e.matrix),nt.setMatrixAt(qe,e.matrix),Ue.setColorAt(qe,new rt(de[Math.random()*de.length|0])),vn.spots.push({x:N,z:Y,yaw:z?0:-Math.PI/2,idx:qe,taken:!1}),Pi.addStatic(e.matrix,2.3,qe,vn.spots[vn.spots.length-1]),qe++}Ue.count=qe,nt.count=qe,Ue.instanceMatrix.needsUpdate=!0,nt.instanceMatrix.needsUpdate=!0,Ue.instanceColor&&(Ue.instanceColor.needsUpdate=!0),Ue.castShadow=!0,vn.im=Ue,vn.imW=nt,n.add(Ue),n.add(nt);const Pe=new Map,ht=(z,N)=>`${Math.round(z)},${Math.round(N)}`;function ct(z,N){const Y=((N+z.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function We(){const z=[],N=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=OM(),ie=new Rt({map:ee,transparent:!0,side:yt}),le=new W({color:5050642,roughness:.48,metalness:.12}),w=(re,Q)=>new W({color:re,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),F=(re,Q,ue,Le,Ve,De)=>{const Ne=new it,ft=new O(new xe(1.15,2.85,.75),Y);Ne.add(ft);const St=w(16724008,16717836),Pt=w(16767053,16757276),Tt=w(4521842,1693789),$e=[St,Pt,Tt];for(let Dt=0;Dt<3;Dt++){const mt=new O(new Jt(.28,12,8),$e[Dt]);mt.position.set(0,.78-Dt*.78,-.42),Ne.add(mt)}Ne.position.set(ue,Le,Ve),Ne.rotation.y=De,re.add(Ne),z.push({axis:Q,red:St,yellow:Pt,green:Tt,control:re.userData.control})},G=(re,Q,ue)=>{const Le=ht(re,Q),Ve={type:"signal",x:re,z:Q,phase:ue%4*2.1};Pe.set(Le,Ve);const De=ce(re,Q),Ne=new it;Ne.userData.control=Ve;const ft=l*.72,St=l*.72,Pt=new O(new Qe(.18,.24,8.2,8),N);Pt.position.set(ft,4.1,St),Ne.add(Pt);const Tt=new O(new xe(l*1.65,.2,.2),N);Tt.position.set(ft-l*.72,8,St),Ne.add(Tt);const $e=new O(new xe(.2,.2,l*1.65),N);$e.position.set(ft,7.55,St-l*.72),Ne.add($e),F(Ne,"ns",ft-l*1.24,7.52,St,0),F(Ne,"ns",ft-l*.18,7.52,-St,Math.PI),F(Ne,"ew",ft,7.05,St-l*1.24,Math.PI/2),F(Ne,"ew",-ft,7.05,St-l*.18,-Math.PI/2),Ne.position.set(re,De,Q),Ne.traverse(Dt=>{Dt.castShadow=!0,Dt.receiveShadow=!0}),n.add(Ne)},X=(re,Q,ue)=>{const Le=ht(re,Q);Pe.set(Le,{type:"stop",x:re,z:Q,phase:0});const Ve=ce(re,Q),De=new it,Ne=ue%2?-1:1,ft=ue%3?1:-1,St=new O(new Qe(.12,.16,4.2,7),N);St.position.y=2.1,De.add(St);const Pt=new O(new Mn(1.04,8),le);Pt.position.y=4.55,Pt.rotation.y=Math.PI,De.add(Pt);const Tt=new O(new qt(2.05,2.05),ie);Tt.position.set(0,4.55,-.04),De.add(Tt),De.position.set(re+Ne*l*.74,Ve,Q+ft*l*.74),De.rotation.y=Math.atan2(Ne,ft),De.traverse($e=>{$e.castShadow=!0,$e.receiveShadow=!0}),n.add(De)};let B=0,oe=0;for(let re=1;re<h.length-1;re++)for(let Q=1;Q<d.length-1;Q++){const ue=h[re],Le=d[Q];if(Pn(ue,Le,l*.9).clearance<2)continue;const Ve=Math.abs(ue-80)<=r*1.05&&Le<=s&&Le>=-560,De=Le<-260&&Le>-1180&&(re+Q)%4===0,Ne=Le>-360&&(re+Q)%2===0;Ve&&Q%2===0||De?G(ue,Le,B++):(Ne||(re+Q)%5===0&&Le>-820)&&X(ue,Le,oe++)}return fn(n,re=>{for(const Q of z){const ue=ct(Q.control,re);Q.red.emissiveIntensity=ue.green===Q.axis||ue.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=ue.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=ue.green===Q.axis?2.6:.1}}),{trafficLights:B,stopSigns:oe}}const dt=We();$M(n,u,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:l,trafficControls:Pe}),Me.trafficLights=dt.trafficLights,Me.stopSigns=dt.stopSigns;const H=new Qe(.12,.16,7.2,7),Ge=new Jt(.46,10,8),Oe=new qt(2.8,13),ze=new W({color:1581353,roughness:.42,metalness:.68}),Se=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),pe=new Rt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:yt,blending:si}),Ke=IM(),ut=new pl({map:Ke,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:si}),Bt=132,Ut=new cn(H,ze,Bt),Nn=new cn(Ge,Se,Bt),An=new cn(Oe,pe,Bt);let li=0;for(let z=0;z<Bt*2&&li<Bt;z++){const N=Math.random()<.5,Y=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(l*.58):t+Math.random()*(i-t),ee=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(l*.58);if(Pn(Y,ee,3).clearance<2)continue;const ie=ce(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Ut.setMatrixAt(li,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Nn.setMatrixAt(li,e.matrix);const le=new Qo(ut);le.position.set(Y,ie+7.5,ee);const w=6.2+Math.random()*2.4;le.scale.set(w,w,1),n.add(le),Ms.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),An.setMatrixAt(li,e.matrix),li++}Ut.count=li,Nn.count=li,An.count=li,Ut.instanceMatrix.needsUpdate=!0,Nn.instanceMatrix.needsUpdate=!0,An.instanceMatrix.needsUpdate=!0,n.add(Ut,Nn,An),Me.streetLights=li,n.add(new O(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new O(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const Jr=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let z=330;z>=-700;z-=32){const N=new O(new xe(1.15,.09,13.5),Jr);N.position.set(80,ce(80,z)+.9,z),N.receiveShadow=!0,n.add(N)}for(const z of[286,156,26,-104])for(let N=0;N<7;N++){const Y=new O(new xe(2,.08,11.8),f),ee=71.2+N*2.95;Y.position.set(ee,ce(ee,z)+.91,z),Y.receiveShadow=!0,n.add(Y),hs("roadDetails","openerCrosswalkStripes")}function Ya(z,N,Y,ee=!1){const ie=ce(z,N),le=new it,w=new O(new Qe(.16,.22,9.5,8),ze);w.position.y=4.75,le.add(w);const F=new O(new xe(3.8,.22,.22),ze);F.position.set(Y*1.75,8.95,0),le.add(F);const G=new O(new Jt(.62,12,8),Se);G.position.set(Y*3.6,8.82,0),le.add(G);const X=new Qo(ut.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),le.add(X),Ms.streetGlowSprites++;const B=new O(new qt(3.2,15),pe.clone());if(B.position.set(Y*2.8,.72,0),B.rotation.x=-Math.PI/2,B.scale.y=.7+Math.random()*.35,le.add(B),ee){const oe=new td(16762474,4.4,66,2);oe.position.copy(G.position),le.add(oe)}le.position.set(z,ie,N),n.add(le),Me.streetLights++}let bi=0;for(let z=340;z>=-700;z-=118)Ya(63,z,1,bi++%3===0),Ya(97,z-42,-1,bi++%3===0);function wi(z,N,Y,ee,ie=6010942){const le=new W({color:ie,roughness:.92,metalness:.01}),w=new O(new xe(Y,.08,ee),le);return w.position.set(z,ce(z,N)+.06,N),w.receiveShadow=!0,n.add(w),Me.openerProps++,w}function Si(z,N,Y=1){const ee=ce(z,N),ie=new it,le=new O(new Qe(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const w=new W({color:6065982,roughness:.86}),F=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[B,oe,re,Q]=G[X],ue=new O(new Jt(Q,12,8),X%2?F:w);ue.position.set(B,oe,re),ue.scale.y=.78,ue.castShadow=!0,ie.add(ue)}return ie.position.set(z,ee,N),ie.scale.setScalar(Y),n.add(ie),xi.push({kind:"tree",x:z,z:N,radius:3.4*Y,maxY:ee+11*Y}),Me.openerProps++,ie}function $a(z,N,Y=0){const ee=new it,ie=new W({color:10970418,roughness:.64,metalness:.04}),le=new W({color:1910317,roughness:.46,metalness:.5});for(const w of[1.05,1.55]){const F=new O(new xe(6.8,.22,.44),ie);F.position.y=w,ee.add(F)}for(const w of[-2.7,2.7]){const F=new O(new xe(.22,1.2,.35),le);F.position.set(w,.62,0),ee.add(F)}ee.position.set(z,ce(z,N),N),ee.rotation.y=Y,n.add(ee),Me.openerProps++}function na(z,N){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new it,ie=new O(new Qe(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new O(new Jt(.42,12,8),Y);le.position.y=1.32,ee.add(le);const w=new O(new Qe(.16,.16,1.1,10),Y);w.rotation.z=Math.PI/2,w.position.y=.9,ee.add(w),ee.position.set(z,ce(z,N),N),n.add(ee),Me.openerProps++}function jr(z,N,Y=0){const ee=new it,ie=new W({color:1185821,roughness:.36,metalness:.68}),le=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),w=new W({color:2370611,roughness:.42,metalness:.32}),F=new O(new xe(8.5,.35,3.2),w);F.position.y=4.2,ee.add(F);for(const B of[-3.8,3.8]){const oe=new O(new Qe(.09,.11,4.1,7),ie);oe.position.set(B,2.05,-1.25),ee.add(oe)}const G=new O(new xe(8,2.8,.08),le);G.position.set(0,2.2,1.35),ee.add(G);const X=new O(new qt(2.3,2.8),new Rt({map:dc("BUS","#4ff3ff"),transparent:!0,side:yt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(z,ce(z,N),N),ee.rotation.y=Y,n.add(ee),ks("bus-shelter-ad",z,ce(z,N)+2.2,N),Me.openerProps++}function mn(z,N,Y,ee,ie,le,w,F=null,G=0){if(Ln(z,N,Y,ee,12))return!1;const X=ce(z,N)-.45;if(Os(z,N,Y,ee,X+ie+2))return!1;const B=z<80?1:-1,oe=new W({map:Sa(192,512,w),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),re=new O(new xe(Y,ie,ee),oe);re.position.set(z,X+ie/2,N),re.castShadow=!1,re.receiveShadow=!0,n.add(re);const Q=new W({map:Sa(220,620,Math.min(.86,w+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:yt}),ue=new O(new qt(ee*.78,ie*.74),Q);ue.position.set(z+B*(Y/2+.09),X+ie*.54,N),ue.rotation.y=B>0?Math.PI/2:-Math.PI/2,n.add(ue);for(const De of[-1,1]){const Ne=new O(new qt(Y*.82,ie*.72),Q.clone());Ne.position.set(z,X+ie*.55,N+De*(ee/2+.1)),Ne.rotation.y=De>0?0:Math.PI,n.add(Ne)}const Le=new O(new xe(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));Le.position.set(z,X+ie+.7,N),n.add(Le);const Ve=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const De of[-1,1]){const Ne=new O(new xe(Y*1.1,.22,.18),Ve);Ne.position.set(z,X+ie+1.4,N+De*(ee/2+.18)),n.add(Ne)}if(F&&G){const De=new Rt({map:Gu(F,F==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:yt,depthWrite:!1}),Ne=new O(new qt(7.5,24),De);Ne.position.set(z+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),N),Ne.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Ne),ks("showcase-neon",Ne.position.x,Ne.position.y,Ne.position.z)}return hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),Gt("showcase","glassTower"),!0}function Qr(z,N,Y,ee=3.2){const ie=z*.5+ee,le=N*.5+ee,w=Math.max(2,Math.abs(ie-le)*.72),F=z>=N?[-ie,0,-le,ie,0,-le,w,Y,0,-ie,0,-le,w,Y,0,-w,Y,0,ie,0,-le,ie,0,le,w,Y,0,ie,0,le,-ie,0,le,-w,Y,0,ie,0,le,w,Y,0,-w,Y,0,-ie,0,le,-ie,0,-le,-w,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-w,ie,0,-le,ie,0,le,0,Y,w,ie,0,-le,0,Y,w,0,Y,-w,ie,0,le,-ie,0,le,0,Y,w,-ie,0,le,-ie,0,-le,0,Y,-w,-ie,0,le,0,Y,-w,0,Y,w],G=new Zt;return G.setAttribute("position",new bt(F,3)),G.computeVertexNormals(),G}function Za(z,N,Y,ee,ie,le,w={}){if(Ln(z,N,Y,ee,12))return!1;const F=ce(z,N)-.3;if(Os(z,N,Y,ee,F+ie+(w.roofH??8.2)+1,6))return!1;const G=w.frontZ??-1,X=new W({map:k,color:w.wallColor??14734788,roughness:.68,metalness:.03}),B=new O(new xe(Y,ie,ee),X);B.position.set(z,F+ie/2,N),B.castShadow=!0,B.receiveShadow=!0,n.add(B);const oe=new W({map:wt,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),re=w.roofH??8.2,Q=new O(Qr(Y,ee,re),oe);Q.position.set(z,F+ie,N),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const ue=new W({color:15985112,roughness:.42,metalness:.05}),Le=new O(new xe(Y+7,.42,1.2),ue);Le.position.set(z,F+ie+.12,N+G*(ee*.5+1.4)),n.add(Le);const Ve=Le.clone();Ve.position.z=N-G*(ee*.5+1.4),n.add(Ve);const De=Math.min(18,Y*.38),Ne=new O(new xe(De,ie*.55,.32),new W({map:Mt,roughness:.34,metalness:.2}));Ne.position.set(z+Y*.18,F+ie*.33,N+G*(ee*.5+.22)),n.add(Ne);const ft=new O(new xe(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ft.position.set(z-Y*.25,F+3.7,N+G*(ee/2+.24)),n.add(ft);const St=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Pt=new W({color:3353638,roughness:.38});for(const en of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(en-Y*.18)<De*.45)continue;const Qn=new O(new xe(6.2,4.8,.26),Pt);Qn.position.set(z+en,F+ie*.58,N+G*(ee*.5+.28)),n.add(Qn);const Ht=new O(new xe(4.8,3.4,.3),St);Ht.position.copy(Qn.position),Ht.position.z+=G*.04,n.add(Ht)}const Tt=new W({color:12370619,roughness:.44,metalness:.04}),$e=new O(new xe(De*1.18,.12,34),Tt);$e.position.set(z+Y*.18,ce(z+Y*.18,N+G*(ee*.5+17))+.11,N+G*(ee*.5+17)),n.add($e);const Dt=new W({color:5679925,roughness:.86,metalness:.01}),mt=new O(new xe(Y+10,.08,ee+12),Dt);mt.position.set(z,ce(z,N)-.18,N),mt.receiveShadow=!0,n.add(mt),mt.renderOrder=-1;const jt=new W({color:3042609,roughness:.84}),Wi=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let en=0;en<9;en++){const Qn=z-Y*.44+en*(Y*.11),Ht=N+G*(ee*.5+2.2+en%2*1.5),xn=new O(new Jt(1.35+en%3*.22,10,7),en%4===0?Wi[en%Wi.length]:jt);xn.position.set(Qn,ce(Qn,Ht)+.95,Ht),xn.scale.y=.72,xn.castShadow=!0,n.add(xn)}return hn.push({x:z,z:N,hw:Y*.5,hd:ee*.5,maxY:F+ie+5}),Gt("showcase","lowStorefront"),!0}return wi(45,318,36,84,6404169),wi(116,318,36,84,6074179),wi(44,188,34,84,6798662),wi(118,188,36,84,5941822),wi(43,60,34,82,5679164),wi(118,60,36,82,6864197),mn(18,315,70,54,154,2311775,.72,"HOTEL",1),mn(17,185,72,58,188,1522779,.78,null,0),mn(31,55,44,56,138,2840688,.66,"OPEN",1),mn(24,-75,52,64,182,1913933,.7,null,0),mn(145,315,68,54,116,2776440,.72,null,0),mn(146,185,70,58,146,2314602,.76,null,0),mn(142,55,42,56,156,1590364,.68,"CAFE",-1),mn(134,-75,48,64,114,3688540,.62,null,0),mn(-70,315,52,52,146,2112085,.68,null,0),mn(228,185,48,58,148,3235186,.66,null,0),mn(-78,185,48,56,134,2181730,.68,null,0),mn(236,315,44,54,104,3104884,.66,null,0),Za(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Za(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),mn(-48,-360,54,56,148,2439765,.58,null,0),mn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Si(112,227,1.35),Si(104,221,1.05),Si(121,233,1.15),$a(112,217,0),Si(50,292,1.2),Si(111,316,.95),Si(48,137,.9),Si(116,102,1.05),$a(47,248,Math.PI/2),na(57,226),jr(111,260,-Math.PI/2),Te.add(n),n}function f0(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const l=pt(i),c=new P(l.tangent.x,0,l.tangent.z).normalize(),h=new P().crossVectors(Qt,c).normalize(),d=l.p.clone().addScaledVector(l.side,e*se.width*.5),u=t==="off"?1:-1,p=d.x+c.x*s*u+h.x*e*a,m=d.z+c.z*s*u+h.z*e*a,x=new P(p,ce(p,m)+.4,m),M=t==="off"?d:x,g=t==="off"?x:d,f=26,y=[];for(let q=0;q<=f;q++){const K=q/f,ne=K*K*(3-2*K),fe=t==="off"?1-(1-K)*(1-K):ne;y.push(new P(me.lerp(M.x,g.x,K),me.lerp(M.y,g.y,fe),me.lerp(M.z,g.z,K)))}const v=7.4,_=new P,E=new P,T=[],C=[];for(let q=0;q<=f;q++)E.subVectors(y[Math.min(f,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),_.crossVectors(Qt,E).normalize(),T.push(y[q].clone().addScaledVector(_,-v)),C.push(y[q].clone().addScaledVector(_,v));const R={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<f;q++){const K=y[q],ne=y[q+1],fe=ne.x-K.x,ve=ne.z-K.z,Ye=Math.max(1e-4,fe*fe+ve*ve);R.segments.push({a:K.clone(),b:ne.clone(),abx:fe,abz:ve,lenSq:Ye,u0:q/f,u1:(q+1)/f})}ta.push(R);const S=[];for(let q=0;q<f;q++){const K=T[q],ne=C[q],fe=T[q+1],ve=C[q+1];S.push(K.x,K.y,K.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),S.push(K.x,K.y,K.z,ve.x,ve.y,ve.z,fe.x,fe.y,fe.z)}const b=new Zt;b.setAttribute("position",new bt(S,3)),b.computeVertexNormals();const L=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:yt});n.add(new O(b,L));const I=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<f;q++)Gn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,I),Gn(n,C[q].clone().setY(C[q].y+1),C[q+1].clone().setY(C[q+1].y+1),.16,I);const V=new W({color:7173241,roughness:.82});for(let q=3;q<f;q+=3){const K=y[q],ne=ce(K.x,K.z),fe=K.y-ne;if(fe<3||Ln(K.x,K.z,3.2,3.2,1.2))continue;const ve=new O(new Qe(.9,1.15,fe,8),V);ve.position.set(K.x,ne+fe/2,K.z),n.add(ve),ni.push({x:K.x,z:K.z,hw:1.3,hd:1.3,maxY:K.y-.9})}const j=new Rt({map:cd(r),transparent:!0,side:yt}),te=new O(new qt(12,3),j);te.position.copy(t==="off"?d:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const K=new O(new Qe(.2,.26,6,6),V),ne=t==="off"?d:x;K.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(K)}}function KM(n,e=1){f0(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function JM(n,e=-1){f0(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function jM(){const n=new it,e=[],t=new rt(14170671),i=new rt(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Rt({map:QM(),transparent:!0,side:yt}),r=new W({color:4926748,roughness:.9}),l=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:yt}),h=12,d=[],u=[];let p=0;for(let x=0;x<se.length;x+=h){if(Oi(x+h*.5)){p++;continue}const M=pt(x),g=pt(x+h),f=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:_}=Qi(M,g);for(const E of[-1,1]){const T=f.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(T),u.push(_),e.push(p%2===0?t:i)}if(p%16===8){const E=(p>>4)%2?1:-1,T=f.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),C=new it,R=new O(new qt(4.4,2.6),a);R.position.y=3.4,R.rotation.y=Math.PI,C.add(R);const S=new Qe(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const L=new O(S,s);L.position.set(b,1.7,0),C.add(L)}C.position.copy(T),C.quaternion.copy(_),n.add(C)}p++}for(let x=0;x<se.length;x+=16){const M=pt(x),g=1+(Math.random()<.5?1:0);for(let f=0;f<g;f++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,_=M.p.x+M.side.x*v*y+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*y+(Math.random()-.5)*16;if(bl(_,E,18)||Ln(_,E,12,12,3.5))continue;const T=ce(_,E);if(Math.random()<.78){const C=.7+Math.random()*1.5,R=new it,S=2.4+Math.random()*4.2,b=new O(new Qe(.26,.42,S,6),r);b.position.y=S/2,R.add(b);const L=2+Math.floor(Math.random()*3);for(let I=0;I<L;I++){const V=new O(new Ri(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),l[(f+I+x)%l.length]);V.position.y=S+I*1.4+1.5,V.rotation.y=Math.random()*Math.PI,R.add(V)}R.position.set(_,T+.6,E),R.scale.setScalar(C),n.add(R)}else{const C=1.4+Math.random()*3.6,R=new O(new Zh(C,0),c);R.position.set(_,T+C*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),n.add(R),ni.push({kind:"rock",x:_,z:E,radius:C*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(Oi(M))continue;const g=pt(M),f=pt(M+h),y=g.p.clone().add(f.p).multiplyScalar(.5),{q:v}=Qi(g,f),_=se.width*.5+1.2,E=9,T=new it,C=new Qe(.4,.55,E,7);for(const I of[-1,1]){const V=new O(C,s);V.position.set(I*_,E/2,0),T.add(V)}const R=_*2,S=new O(new xe(R,1.1,1.1),s);S.position.y=E,T.add(S);const b=new Rt({map:cd(m[x]),transparent:!0,side:yt}),L=new O(new qt(R*.82,3),b);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(y),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new Qe(.18,.24,3,6);x.translate(0,1.5,0);const M=new Jt(.34,8,6);M.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),f=new W({roughness:.55}),y=new cn(x,g,d.length),v=new cn(M,f,d.length),_=new It;for(let E=0;E<d.length;E++)_.position.copy(d[E]),_.quaternion.copy(u[E]),_.updateMatrix(),y.setMatrixAt(E,_.matrix),v.setMatrixAt(E,_.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return KM(n),JM(n),Te.add(n),n}function QM(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new nn(n);return t.colorSpace=Lt,t}function cd(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new nn(e);return i.colorSpace=Lt,i}function e_(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const l=new nn(t);return l.colorSpace=Lt,l}function t_(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new nn(n);return i.colorSpace=Lt,i.wrapS=zn,i.repeat.set(3,1),i}function Kt(n,e,t,i,s){const a=new O(new xe(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function Qi(n,e){const t=e.p.clone().sub(n.p).normalize(),i=sd.crossVectors(Qt,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new ns().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new _t().makeBasis(i,s,t),l=new ns().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:l}}function Xu(n,e,t,i){const s=[],a=[],r=[],l=se.width*.47;let c=0;for(let u=e;u<=t;u+=8){const p=pt(Math.min(u,t)),m=Qi(p,pt(p.s+2)),x=Math.sin(u*.018)*.04,M=p.p.clone().addScaledVector(m.sideways,-l).addScaledVector(m.normal,.46+x),g=p.p.clone().addScaledVector(m.sideways,l).addScaledVector(m.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const f=(u-e)/64;if(a.push(0,f,1,f),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new Zt;h.setAttribute("position",new bt(s,3)),h.setAttribute("uv",new bt(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new O(h,i);d.receiveShadow=!0,n.add(d)}function n_(n,e){let t=0;for(const i of se.gaps)Xu(n,t,Math.max(t,i.start-4),e),t=i.end+4;Xu(n,t,se.length,e)}function i_(n,e,t){const i=pt(e.s+2),{normal:s,q:a}=Qi(e,i),r=new it;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const l=new O(new xe(.55,.12,5.2),t);l.position.set(-1.25,0,0),l.rotation.y=-.62,r.add(l);const c=new O(new xe(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new O(new xe(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function s_(){const n=new it;Te.add(n),gh=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),l=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new W({color:4935486,roughness:.92,metalness:.04}),p=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const f=new W({map:PM(),roughness:.74,metalness:.08}),y=new Rt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;n_(n,f);function _(E,T=!1){if(Oi(E))return!1;const C=pt(E),R=pt(E+3),{sideways:S,normal:b,q:L}=Qi(C,R),I=C.p,V=ce(I.x,I.z),j=I.y-.95;if(j-V<10)return!1;const te=se.width*(T?.43:.35),q=j,K=V+.25,ne=T?.56:.42,fe=T?2.4:1.75,ve=T?.52:.36,Ye=[],D=[];for(const we of[-1,1])if(Ln(I.x+S.x*we*te,I.z+S.z*we*te,fe*2.2,fe*2.2,1.2))return!1;for(const we of[-1,1]){const Re=I.clone().addScaledVector(S,we*te).addScaledVector(b,-.85);Re.y=q;const ke=new P(Re.x,K,Re.z);Gn(n,ke,Re,ne,a);const tt=new O(new Qe(fe,fe*1.12,ve,12),a);tt.position.set(ke.x,V+ve*.5,ke.z),tt.receiveShadow=!0,n.add(tt),Ye.push(Re),D.push(ke),ni.push({x:ke.x,z:ke.z,hw:fe*.92,hd:fe*.92,maxY:q-.7})}const Ie=I.clone().addScaledVector(b,-1.05);Ie.y=q,Kt(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Ie,L,r);const ye=D[0].clone();ye.y+=(q-K)*.28;const Ce=D[1].clone();Ce.y+=(q-K)*.28;const $=Ye[0].clone();$.y-=1;const Z=Ye[1].clone();if(Z.y-=1,Gn(n,ye,Z,T?.18:.14,c),Gn(n,Ce,$,T?.18:.14,c),T){const we=D[0].clone();we.y+=(q-K)*.58;const Re=D[1].clone();Re.y+=(q-K)*.58,Gn(n,D[0].clone().setY(K+1.2),Re,.16,c),Gn(n,D[1].clone().setY(K+1.2),we,.16,c),Gn(n,we,Z,.16,c),Gn(n,Re,$,.16,c)}return gh++,!0}for(let E=0;E<se.length;E+=v){if(Oi(E+v*.5))continue;const T=pt(E),C=pt(E+v),R=T.p.clone().add(C.p).multiplyScalar(.5),{sideways:S,normal:b,q:L}=Qi(T,C),I=T.p.distanceTo(C.p)+.45,V=Math.floor(E/(v*2))%2?e:t;Kt(n,new P(se.width,.62,I),R.clone().addScaledVector(b,-.05),L,V),Kt(n,new P(se.width-2.8,.08,I*.86),R.clone().addScaledVector(b,.36),L,u),Kt(n,new P(.2,.1,I*.76),R.clone().addScaledVector(S,-se.width*.19).addScaledVector(b,.43),L,u),Kt(n,new P(.2,.1,I*.76),R.clone().addScaledVector(S,se.width*.19).addScaledVector(b,.43),L,u),E%48===0&&(Kt(n,new P(.14,.08,I*.62),R.clone().addScaledVector(S,-se.width*.08).addScaledVector(b,.51),L,M),Kt(n,new P(.14,.08,I*.62),R.clone().addScaledVector(S,se.width*.08).addScaledVector(b,.51),L,M)),E%120===0&&Kt(n,new P(se.width*.42,.07,.72),R.clone().addScaledVector(b,.55),L,g),Kt(n,new P(se.width+1.2,.35,I*.94),R.clone().addScaledVector(b,-.56),L,r),Kt(n,new P(.42,.42,I*.9),R.clone().addScaledVector(S,-se.width*.36).addScaledVector(b,-.78),L,x),Kt(n,new P(.42,.42,I*.9),R.clone().addScaledVector(S,se.width*.36).addScaledVector(b,-.78),L,x);const j=R.clone().addScaledVector(S,-se.width*.51),te=R.clone().addScaledVector(S,se.width*.51);if(Kt(n,new P(.32,.46,I),j.clone().addScaledVector(b,.28),L,i),Kt(n,new P(.32,.46,I),te.clone().addScaledVector(b,.28),L,i),Kt(n,new P(.26,.72,I*.94),j.clone().addScaledVector(b,-.22),L,r),Kt(n,new P(.26,.72,I*.94),te.clone().addScaledVector(b,-.22),L,r),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const K=new O(new Qe(.16,.2,.12,10),l);K.position.copy(R).addScaledVector(S,q).addScaledVector(b,.46),K.quaternion.copy(L),K.castShadow=!1,n.add(K)}if(E%72===0&&(Kt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(S,-se.width*.66).addScaledVector(b,1.16),L,s),Kt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(S,se.width*.66).addScaledVector(b,1.16),L,s),Kt(n,new P(.18,.18,4.4),R.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.94),L,s),Kt(n,new P(.18,.18,4.4),R.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.94),L,s),Kt(n,new P(.12,.12,4),R.clone().addScaledVector(S,-se.width*.62).addScaledVector(b,1.38),L,i),Kt(n,new P(.12,.12,4),R.clone().addScaledVector(S,se.width*.62).addScaledVector(b,1.38),L,i),Gn(n,R.clone().addScaledVector(S,-se.width*.58).addScaledVector(b,-1.08),R.clone().addScaledVector(S,se.width*.58).addScaledVector(b,-1.08),.11,c),Gn(n,R.clone().addScaledVector(S,-se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c),Gn(n,R.clone().addScaledVector(S,se.width*.48).addScaledVector(b,-1),R.clone().addScaledVector(S,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new O(new Mn(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(R.x,-4.72,R.z),q.scale.set(se.width*.9,Math.max(10,I*2.2),1),q.rotation.z=Math.atan2(Qi(T,C).tangent.x,Qi(T,C).tangent.z),n.add(q)}if(E%144===0){const q=R.clone().addScaledVector(S,-se.width*.74).addScaledVector(b,2),K=R.clone().addScaledVector(S,se.width*.74).addScaledVector(b,2);Gn(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Gn(n,K.clone().addScaledVector(b,-1.2),K.clone().addScaledVector(b,1.1),.12,s),Kt(n,new P(.46,.72,.46),q.clone().addScaledVector(b,1.15),L,h),Kt(n,new P(.46,.72,.46),K.clone().addScaledVector(b,1.15),L,h)}if(E%288===0){const q=R.clone().addScaledVector(S,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);Kt(n,new P(.44,.44,.44),q.clone(),L,p),Gn(n,q.clone().addScaledVector(b,-.2),R.clone().addScaledVector(b,1),.05,c)}E%48===0&&_(E+v*.5,!1),E%168===0&&!Oi(E+16)&&i_(n,pt(E+5),d)}for(const E of se.gaps){const T=pt(E.start-3),C=pt(E.end+3);for(const R of[T,C]){const S=pt(R.s+2),{normal:b,q:L}=Qi(R,S);Kt(n,new P(se.width-1.2,.08,4.6),R.p.clone().addScaledVector(b,.54),L,h),Kt(n,new P(se.width*.62,.09,1.3),R.p.clone().addScaledVector(b,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),L,g);for(const I of[-se.width*.42,0,se.width*.42]){const V=R.p.clone().addScaledVector(R.side,I).addScaledVector(b,2.35);Kt(n,new P(.46,.46,.46),V,L,I===0?m:h)}_(R.s+(R===T?-9:9),!0),_(R.s+(R===T?-24:24),!0)}}return n}function p0(n=13710372,e=7740696){const t=new it,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),l=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),u=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),M=new O(new Mn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(_,E,T,C,R=null,S=null)=>{const b=new O(E,T);return b.name=_,b.position.copy(C),R&&b.rotation.set(R.x||0,R.y||0,R.z||0),S&&b.scale.copy(S),t.add(b),b},f=(_,E,T,C,R,S,b=0,L=0,I=0)=>g(_,new xe(E.x,E.y,E.z),T,new P(C,R,S),new P(b,L,I));f("low black undertray",new P(5.25,.28,8.45),a,0,.45,-.08),f("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),f("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),f("front black splitter",new P(5.25,.13,.78),a,0,.35,-5.6),f("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),f("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),f("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),f("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),f("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),f("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),f("black rear fascia",new P(4.72,.66,.2),r,0,1.02,4.04),f("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),f("front windshield",new P(2.8,.13,1.15),h,0,1.78,-1.25,-.48),f("roof glass",new P(2.34,.18,1.55),h,0,2.08,-.2,-.13),f("left side window",new P(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),f("right side window",new P(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),f("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),f("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),f("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let _=0;_<7;_++)f("black rear deck louver",new P(3.35,.12,.18),r,0,1.83+_*.015,1.1+_*.28,-.21);f("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const _ of[-2.28,2.28])f("spoiler side endplate",new P(.24,.78,1.04),s,_,1.43,3.72,0,0,_<0?-.08:.08);for(const _ of[-1.78,1.78])f("thin hood crease",new P(.08,.04,2.55),x,_*.36,1.27,-3.45,-.15),f("door seam",new P(.035,.68,1.75),x,_,1.16,-.2),f("side intake",new P(.09,.34,.9),r,Math.sign(_)*2.68,.86,1.42);for(const _ of[-1.04,1.04])f("pop up headlight glass",new P(.62,.12,.18),p,_,1.02,-5.28,-.16);f("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const _ of[-1.42,-.62,.62,1.42])f("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(_)>1?d:u,_,1.08,4.24);f("slim chrome beltline left",new P(.06,.08,4.75),l,-2.72,1.42,-.2),f("slim chrome beltline right",new P(.06,.08,4.75),l,2.72,1.42,-.2),f("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),f("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const _ of[-2.86,2.86])f("angular side mirror arm",new P(.42,.08,.08),x,_,1.62,-1.55,0,0,_<0?-.14:.14),f("blue tinted side mirror",new P(.12,.34,.46),h,_*1.03,1.62,-1.65,0,_<0?.24:-.24),f("flush door handle",new P(.08,.11,.46),l,_*.94,1.28,.52);for(const _ of[-2.65,2.42])f("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,_),f("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,_);f("black license recess",new P(.9,.24,.08),r,0,.76,4.31);const y=[],v=(_,E,T=!1)=>{const C=new it;C.name=T?"steering front wheel assembly":"rear wheel assembly",C.position.set(_,.54,E);const R=new O(new Qe(.88,.88,.62,28),a);R.name="wide performance tire",R.rotation.z=Math.PI/2,C.add(R);const S=new O(new Ts(.88,.06,10,32),a);S.name="rounded tire sidewall",S.rotation.y=Math.PI/2,C.add(S);const b=new O(new Qe(.42,.42,.66,24),l);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,C.add(b);const L=new O(new Qe(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=_>0?-.05:.05,C.add(L);for(let j=0;j<8;j++){const te=new O(new xe(.08,.055,.62),l);te.name="thin wheel spoke",te.rotation.x=j/8*Math.PI*2,te.position.set(_>0?.035:-.035,0,.22),C.add(te)}const I=new O(new xe(.1,.22,.18),u);I.name="small brake caliper",I.position.set(_>0?-.39:.39,.18,-.38),C.add(I);const V=new O(new Qe(.17,.17,.72,18),c);V.name="dark center cap",V.rotation.z=Math.PI/2,C.add(V),t.add(C),T&&y.push(C)};for(const _ of[-2.4,2.4])v(_,-2.65,!0),v(_,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const _ of[-.92,-.52,.52,.92]){const E=new O(new Qe(.13,.13,.55,14),l);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(_,.43,4.52),t.add(E)}return t.traverse(_=>{_.castShadow=!0,_.receiveShadow=!0}),Te.add(t),t}function a_(){const n=new it,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),l=new W({color:1118995,roughness:.7,metalness:.05}),c=new O(new xe(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new O(new xe(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new O(new xe(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const u=new O(new qt(2.8,.82,1,1),r);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,n.add(u);const p=new O(new Ts(.36,.035,12,48),l);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,n.add(p);for(let m=0;m<3;m++){const x=new O(new xe(.34,.025,.035),i);x.position.copy(p.position),x.rotation.copy(p.rotation),x.rotation.z+=m/3*Math.PI*2,n.add(x)}for(let m=0;m<6;m++){const x=new O(new Qe(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),n.add(x)}for(const m of[-1.08,1.08]){const x=new O(new Qe(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(m,-.68,-1.58),n.add(x);const M=new O(new Ts(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const x=new O(new Qe(.035,.04,.028,8),i);x.position.set(m,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const m of[-.52,.52]){const x=new O(new Jt(.045,12,8),a);x.position.set(m,-.34,-1.22),n.add(x)}n.position.set(0,0,0),be.add(n),ln=n}function r_(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:RM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=pt(0),a=new _t().makeBasis(s.side,Qt,s.tangent),r=new ns().setFromRotationMatrix(a),l=new it;for(const d of[-se.width*.58,se.width*.58]){const u=new O(new xe(.8,11,.8),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Qt,5.4),u.quaternion.copy(r),l.add(u)}const c=new O(new xe(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(Qt,11.2),c.quaternion.copy(r),l.add(c);const h=new O(new xe(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(Qt,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),l.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const u=new O(new Jt(.32,16,10),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Qt,10.25),l.add(u)}return Te.add(l),l}function hd(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new O(new Mn(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,u,p,m=null,x=null)=>{const M=new O(d,u);return M.name=h,M.position.copy(p),m&&M.rotation.set(m.x||0,m.y||0,m.z||0),x&&M.scale.copy(x),n.add(M),M},r=(h,d,u,p,m,x,M,g,f=0,y=0,v=0)=>a(h,new xe(d,u,p),m,new P(x,M,g),{x:f,y,z:v}),l=[];function c(h,d,u,p=.88,m=.62){const x=new it;x.name=u?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,p*.62+.18,d);const M=new O(new Qe(p,p,m,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new O(new Ts(p,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const f=new O(new Qe(p*.48,p*.48,m+.04,24),i.chrome);f.name="chrome rim",f.rotation.z=Math.PI/2,x.add(f);const y=new O(new Qe(p*.62,p*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let _=0;_<8;_++){const E=new O(new xe(.08,.055,m),i.chrome);E.name="wheel spoke",E.rotation.x=_/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,p*.25),x.add(E)}const v=new O(new Qe(.17,.17,m+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),u&&l.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:l}}function o_(n=15616818,e=2434871){const t=new it,i=hd(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const l=new O(new Qe(.19,.19,.6,16),s.chrome);l.name="center exhaust",l.rotation.x=Math.PI/2,l.position.set(r,.62,4.65),t.add(l)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function l_(n=4165830,e=15908108){const t=new it,i=hd(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const l=new O(new Qe(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);l.name="round tail lamp",l.rotation.x=Math.PI/2,l.position.set(r,1.28,3.78),t.add(l)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const l=new O(new Qe(.16,.16,3.4,14),s.chrome);l.name="side exhaust pipe",l.rotation.x=Math.PI/2,l.position.set(r*2.62,.55,.4),t.add(l),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}function c_(n=16764159,e=526344){const t=new it,i=hd(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const l=new O(new Qe(.09,.09,1.35,10),s.steel);l.name="roll cage hoop",l.rotation.z=r*.42,l.position.set(r*.75,1.85,.35),t.add(l),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new O(new Qe(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Te.add(t),t}const Es=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>p0(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>o_()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>l_()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>c_()}];let ki=me.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function _s(){return o.drivingStolen&&st?tf[st.type]||tf.compact:Es[ki].stats}const m0=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],Xn=m0.map((n,e)=>({...n,idx:e,mesh:p0(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),h_=Xn[0].mesh;let Ot=Es[ki].build();function d_(n){ki=me.clamp(n,0,Es.length-1),localStorage.setItem("steel-ribbon-carmodel",String(ki));const e=Ot.visible;Ea(Ot),Ot=Es[ki].build(),Ot.visible=e,typeof Ch=="function"&&Ch()}for(const n of Xn)n.mesh.visible=!1,Te.add(n.mesh);function Yr(n){for(const e of Xn)e.mesh.visible=n}const u_=[10,6,4,2];let Vt=null;try{Vt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function $r(){return Vt?.active?Vt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function x0(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Vt))}function f_(){Vt={division:$r(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},x0()}function g0(n){return["One","Two","Three","Four"][me.clamp(n,1,4)-1]}function v0(){return[{key:"you",label:"You",pts:Vt?.points.you??0},...m0.map(e=>({key:e.key,label:e.label,pts:Vt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Ot.visible=!1;VM();BM();Me.signs=0;al.length=0;GM();HM();ZM();let qu=null,Yu=null,$u=null,ln=null,mc=null;const $t=[];a_();function As(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Te.remove(n))}function Ea(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Te.remove(n))}const Da=[],zr=[];let Zu=null;function p_(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new nn(n);return t.colorSpace=Lt,t}function m_(n,e){if(Oi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of ta)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function x_(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:yt}),t=new Qe(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const l=new cn(t,i,Math.ceil(se.length/12*2)+8),c=new It;for(const h of[-1,1]){const d=h*(se.width*.5+.55),u=[],p=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],f=x[M+1];u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.12,f.z,f.x,f.y+1.5,f.z),u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.5,f.z,g.x,g.y+1.5,g.z)}a++}};let m=[];for(let x=0;x<=se.length;x+=s){if(m_(x%se.length,h)){p(m),m=[];continue}const M=pt(x%se.length);if(m.push(M.p.clone().addScaledVector(M.side,d).addScaledVector(Qt,.58)),x%12===0){const g=m[m.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),l.setMatrixAt(r++,c.matrix)}}if(p(m),u.length){const x=new Zt;x.setAttribute("position",new bt(u,3)),x.computeVertexNormals(),n.add(new O(x,e))}}l.count=r,l.instanceMatrix.needsUpdate=!0,n.add(l),Me.railRuns=a,Me.railPosts=r}function g_(){Da.length=0,zr.length=0;const n=new it,e=new Rt({map:p_(),transparent:!0,depthWrite:!1,side:yt,blending:si,opacity:.9}),t=new qt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][Da.length%3]*se.width,d=pt(c),u=new O(t,e),p=new P().crossVectors(d.side,d.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new _t().makeBasis(d.side,p,new P().crossVectors(d.side,p).normalize());u.quaternion.setFromRotationMatrix(m),u.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(p,.84),n.add(u),Da.push({s:c,lat:h})}const i=new Jt(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(se.length/24));{const c=new cn(i,s,a*2),h=new It;let d=0;for(let u=0;u<a;u++){const p=u/a*se.length;if(Oi(p))continue;const m=pt(p);for(const x of[-1,1])h.position.copy(m.p).addScaledVector(m.side,x*(se.width*.5+.22)).addScaledVector(Qt,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new Qe(.09,.12,1.5,8),l=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=pt(Math.max(6,c.start-22));for(const d of[-1,1]){const u=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new it,m=new O(r,l),x=new O(new Jt(.3,10,8),u);m.position.y=.75,x.position.y=1.65,p.add(m),p.add(x),p.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(Qt,.55),n.add(p),zr.push(u)}}return x_(n),Te.add(n),n}fn(new It,n=>{if(!zr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of zr)t.emissiveIntensity=e});function Zr(n){return ws=me.clamp(n,0,js.length-1),se=js[ws],ni.length=0,ta.length=0,Ea(qu),Ea(Yu),Ea($u),Ea(Zu),qu=s_(),Yu=r_(),$u=jM(),Zu=g_(),fd(),Xe.trackName.textContent=se.name,Xe.courseName&&(Xe.courseName.textContent=se.name),Xe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ws)}),se.name}Zr(0);function v_(){mc&&Te.remove(mc),$t.length=0;const n=new it,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Rt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:yt,blending:si}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=ce(a.x,a.z)+4.2,l=new it,c=new O(new Ts(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,l.add(c);const h=new O(new Mn(4.7,32),t.clone());h.rotation.y=a.yaw,l.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new O(new Qe(.11,.16,6.2,8),d);m.position.set(Math.cos(a.yaw)*p,-1.1,Math.sin(a.yaw)*p),l.add(m)}const u=new O(new Jt(.45,16,10),e.clone());u.position.y=4.1,l.add(u),l.position.set(a.x,r,a.z),l.userData.index=s,l.userData.baseY=r,l.userData.label=a.label,n.add(l),$t.push({...a,y:r,radius:8.5,marker:l,collected:!1})}fn(n,s=>{for(let a=0;a<$t.length;a++){const r=$t[a],l=a===o.objectiveIndex;r.marker.visible=!r.collected||l,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(l?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=l?2.4:.65)})}}),Te.add(n),mc=n}v_();function M_(){const n=new it,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(Ln(s,a,r*2+14,r*2+14,10)||Pn(s,a,r).clearance<-6||$t.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||Qs.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||hn.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||xi.some(d=>{const u=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<u+r+2})||Pa.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const l=ce(s,a);if(Math.max(Math.abs(ce(s+r,a)-l),Math.abs(ce(s-r,a)-l),Math.abs(ce(s,a+r)-l),Math.abs(ce(s,a-r)-l))>1.7)continue;const c=new O(new xl(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,l+.09,a),c.renderOrder=-4,n.add(c);const h=new O(new Mn(r,36),c0(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,l+.15,a),h.renderOrder=-3,n.add(h),h0(s,a,r*.98),t++}Me.ponds=t,Te.add(n),fd()}M_();const on=ld(3375807,15905331);on.visible=!1,on.scale.setScalar(1.06),Te.add(on);const Bi=new P(0,0,0);let Mh=0,he=null;function __(){const n=new it,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,u,p,m,x,M=0,g=0,f=0)=>{const y=new O(d,u);return y.name=h,y.position.set(p,m,x),y.rotation.set(M,g,f),n.add(y),y};r("cabin hull",new xe(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new xe(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new xe(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new xe(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new xe(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new xe(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new Qe(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new xe(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new xe(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new xe(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new xe(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new xe(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new xe(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new xe(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new Qe(.22,.28,.5,10),s,0,3.95,-.2);const l=new it;l.name="main rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(11.4,.07,.44),t);d.rotation.y=h,l.add(d)}l.position.set(0,4.2,-.2),n.add(l);const c=new it;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new O(new xe(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:l,tailRotor:c}}function y_(){let n=null;for(let d=0;d<700&&!n;d++){const u=-520+Math.random()*1040,p=-1200+Math.random()*1500;if(Math.hypot(u-80,p-300)>(d<350?420:1200)||Ln(u,p,26,26,6))continue;const m=ce(u,p);Math.max(Math.abs(ce(u+11,p)-m),Math.abs(ce(u-11,p)-m),Math.abs(ce(u,p+11)-m),Math.abs(ce(u,p-11)-m))>.8||hn.some(x=>Math.abs(x.x-u)<x.hw+13&&Math.abs(x.z-p)<x.hd+13)||Pa.some(x=>Math.hypot(x.x-u,x.z-p)<(x.radius||4)+13)||Qs.some(x=>Math.hypot(x.x-u,x.z-p)<x.rx+16)||$t.some(x=>Math.hypot(x.x-u,x.z-p)<24)||Pn(u,p,12).clearance<2||(n={x:u,z:p,y:m})}n||(n={x:150,z:330,y:ce(150,330)});const e=new it,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new O(new Qe(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new nn(s);r.colorSpace=Lt;const l=new O(new Mn(9.6,36),new Rt({map:r,transparent:!0}));l.rotation.x=-Math.PI/2,l.position.set(n.x,n.y+.26,n.z),e.add(l);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const u=d/8*Math.PI*2,p=new O(new Jt(.22,8,6),c);p.position.set(n.x+Math.cos(u)*10.2,n.y+.34,n.z+Math.sin(u)*10.2),e.add(p)}Te.add(e);const h=__();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Te.add(h.mesh),he={pad:n,pos:new P(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new P,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},he.mesh.quaternion.setFromAxisAngle(Qt,-he.yaw),Me.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}y_();var Ci=[],M0=null;function b_(n,e){if(!Ci)return 0;for(const t of Ci){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return M0=t,a/t.len*t.h}return 0}function w_(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Ci.length<6;r++){const l=n[Ci.length%n.length],{len:c,h}=l,d=Math.random()<.5,u=Math.round((Be.x1-Be.x0)/Be.pitch),p=(d?Be.x0:Be.zFar)+(Math.random()*(d?u:Math.round((Be.zNear-Be.zFar)/Be.pitch))|0)*Be.pitch,m=(Math.random()<.5?-1:1)*(Be.streetW*.5+10+Math.random()*9),x=d?Be.zFar+120+Math.random()*(Be.zNear-Be.zFar-240):Be.x0+120+Math.random()*(Be.x1-Be.x0-240),M=d?p+m:x,g=d?x:p+m,f=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(f),v=-Math.cos(f),_=M+y*c,E=g+v*c;if(Ln(M,g,e+4,e+4,2)||Ln(_,E,e+4,e+4,2)||Pn(M,g,8).clearance<11||Pn(_,E,8).clearance<11||Ys(M,g).depth>0||Ys(_,E).depth>0||Ys(_+y*40,E+v*40).depth>0||Math.abs(ce(M,g)-ce(_,E))>1.1||Ci.some(S=>Math.hypot(S.x-M,S.z-g)<150))continue;const T=(S,b,L,I)=>S.some(V=>Math.abs(b-V.x)<(V.hw??V.radius??0)+I&&Math.abs(L-V.z)<(V.hd??V.radius??0)+I);let C=!1;for(const[S,b,L]of[[M-y*45,g-v*45,6],[M-y*22,g-v*22,6],[M,g,7],[_,E,7],[_+y*45,E+v*45,9],[_+y*95,E+v*95,9]])if(T(hn,S,b,L)||T(xi,S,b,L)){C=!0;break}if(C)continue;const R={x:M,z:g,yaw:f,fx:y,fz:v,len:c,w:e,h,type:l.type,rail:l.rail};if(l.type==="hoop"){const S=ce(M,g)+h+13;R.hoop={x:_+y*28,y:S,z:E+v*28,r:7}}Ci.push(R)}for(const r of Ci){const l=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const R=new O(new Ts(r.hoop.r,.5,10,30),a);R.position.set(r.hoop.x,r.hoop.y,r.hoop.z),R.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Te.add(R)}const c=ce(r.x,r.z)+.05,h=-r.fz,d=r.fx,u=r.w*.5,p=[r.x-h*u,c,r.z-d*u],m=[r.x+h*u,c,r.z+d*u],x=[r.x+r.fx*r.len-h*u,c,r.z+r.fz*r.len-d*u],M=[r.x+r.fx*r.len+h*u,c,r.z+r.fz*r.len+d*u],g=[x[0],c+r.h,x[2]],f=[M[0],c+r.h,M[2]],y=[...p,...m,...f,...p,...f,...g,...x,...M,...f,...x,...f,...g,...p,...g,...x,...m,...M,...f],v=new Zt;v.setAttribute("position",new bt(y,3)),v.computeVertexNormals();const _=new O(v,i);_.castShadow=!1,_.receiveShadow=!0,Te.add(_);const E=Math.hypot(r.len,r.h),T=new xe(.26,.24,E),C=new O(new xe(1.1,.1,E*.94),s);C.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),C.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Te.add(C);for(const R of[-1,1]){const S=new O(T,l),b=r.x+h*u*R,L=r.z+d*u*R,I=r.x+r.fx*r.len+h*u*R,V=r.z+r.fz*r.len+d*u*R;S.position.set((b+I)/2,c+r.h/2+.12,(L+V)/2),S.lookAt(I,c+r.h+.12,V),Te.add(S);const j=new O(new Jt(.34,10,8),t);j.position.set(I,c+r.h+.55,V),Te.add(j)}}Me.stuntRamps=Ci.length}w_();function S_(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];Me.propPlanes=0;for(const e of n){const t=new it,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new O(new Qe(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new O(new Ri(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const l=new O(new Jt(.85,10,8),s);l.scale.set(1,.7,1.5),l.position.set(0,.75,-.9),t.add(l);const c=new O(new xe(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new O(new xe(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new O(new xe(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const u=new it,p=new xe(.26,5.4,.12),m=new O(p,s),x=new O(p,s);x.rotation.z=Math.PI/2,u.add(m),u.add(x),u.position.z=-5.75,t.add(u),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Te.add(t);const M=Math.random()*Math.PI*2;fn(t,(g,f)=>{t.position.x+=e.dir*e.speed*f,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+M)*5,t.rotation.z=Math.sin(g*.22+M)*.14,u.rotation.z+=f*38}),Me.propPlanes++}}S_();const lt={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},_0=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),y0=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function Kr(n){if(o.mode!=="roam")return;const e=Math.ceil(o.heat||0);o.heat=Math.min(5,(o.heat||0)+n),lt.evadeT=0,Math.ceil(o.heat)>e&&(o.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(o.heat)))}`,o.messageTimer=1.2)}function b0(){const n=qr("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new O(new xe(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new O(new xe(.62,.24,.46),_0),s=new O(new xe(.62,.24,.46),y0);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function Ku(n,e){return hn.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||Ys(n,e).depth>.35}function T_(){const n=Math.random()*Math.PI*2,e=me.clamp(o.roamPos.x+Math.cos(n)*320,-780,780),t=me.clamp(o.roamPos.z+Math.sin(n)*320,-1580,440),i=b0();Te.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return lt.cars.push(s),oi("whoosh",.2,.8,.1),s}function w0(n){As(n.mesh),lt.cars=lt.cars.filter(e=>e!==n)}function S0(n){for(const e of n.meshes)As(e);lt.blocks=lt.blocks.filter(e=>e!==n)}function dd(){for(const n of[...lt.cars])w0(n);for(const n of[...lt.blocks])S0(n);lt.evadeT=0,lt.nearest=1/0,lt.bustT=0,lt.blockCd=6,o.heat=0}function E_(){const n=Math.sin(o.roamYaw),e=-Math.cos(o.roamYaw),t=o.roamPos.x+n*215,i=o.roamPos.z+e*215,s=Be.x0+Math.round((t-Be.x0)/Be.pitch)*Be.pitch,a=Be.zNear-Math.round((Be.zNear-i)/Be.pitch)*Be.pitch,r=Math.abs(t-s),l=Math.abs(i-a);let c,h,d,u,p,m;if(r<=l&&r<Be.streetW*.6)c=s,h=i,d=1,u=0,p=0,m=1;else if(l<Be.streetW*.6)c=t,h=a,d=0,u=1,p=1,m=0;else return!1;if(c<Be.x0||c>Be.x1||h>Be.zNear||h<Be.zFar||lt.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=ce(c,h),M=Be.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),f=new O(new xe(.9,.16,M),g);f.position.set(c,x+.1,h),f.lookAt(c+d,x+.1,h+u),Te.add(f);const y=[f];for(const v of[-1,1]){const _=b0();_.position.set(c+d*v*(M*.32),x+.06,h+u*v*(M*.32)),_.rotation.y=Math.atan2(d,u)+v*.7,Te.add(_),y.push(_)}return lt.blocks.push({x:c,z:h,latX:d,latZ:u,fwX:p,fwZ:m,w:M,meshes:y,age:0,hitT:0}),o.message="ROADBLOCK AHEAD!",o.messageTimer=1.3,Tn(500,.2,"square",.1),!0}function A_(){const n=Math.min(600,Math.round(o.score*.12)+150);o.score=Math.max(0,o.score-n),Me.busts=(Me.busts||0)+1,o.message=`BUSTED! -${n}`,o.messageTimer=2,o.cameraShake=.5,Tn(220,.5,"sawtooth",.14),Ze.state==="active"&&Nr("busted"),o.drivingStolen&&st&&(Sl(),o.vehicle="foot",o.speed=0,on.visible=!0,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,o.message="BUSTED! Ride confiscated"),dd()}function C_(n,e){const t=o.roamPos.x-n.x,i=o.roamPos.z-n.z,s=Math.hypot(t,i),a=o.heat||0;let r=Math.atan2(t,-i);const l=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(Ku(n.x+l*17,n.z+c*17)){const u=n.yaw-.7,p=n.yaw+.7;r=!Ku(n.x+Math.sin(u)*17,n.z-Math.cos(u)*17)?u:p}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=me.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(o.speed)+30):Math.max(42,Math.abs(o.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=me.clamp(n.x,-800,800),n.z=me.clamp(n.z,-1600,460),n.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const u of n.mesh.userData.wheels||[])u.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,o.vehicle==="car"?(F0(new P(n.x,o.roamPos.y+.8,n.z),Math.abs(o.speed-n.speed)+24,"PIT MANEUVER!"),o.speed*=.78,n.speed*=.4,Kr(.3)):(o.cameraShake=Math.max(o.cameraShake,.3),o.message="Get out of there!",o.messageTimer=.9)),s}fn(new It,(n,e)=>{const t=Math.floor(n*3.4)%2;if(_0.emissiveIntensity=t?2.6:.35,y0.emissiveIntensity=t?.35:2.6,o.mode!=="roam"){lt.cars.length&&dd();return}const i=o.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;lt.cars.length<s;)T_();for(;lt.cars.length>s;)w0(lt.cars[lt.cars.length-1]);let a=1/0;for(const r of[...lt.cars])a=Math.min(a,C_(r,e));lt.nearest=a,i>0&&a<12&&Math.abs(o.speed)<8?(lt.bustT+=e,lt.bustT>2.2&&(lt.bustT=0,A_())):lt.bustT=Math.max(0,lt.bustT-e*1.5),i>=4&&(lt.blockCd-=e,lt.blockCd<=0&&Math.abs(o.speed)>30&&(E_(),lt.blockCd=12));for(const r of[...lt.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&S0(r);const l=o.roamPos.x-r.x,c=o.roamPos.z-r.z,h=l*r.latX+c*r.latZ,d=l*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!o.roamAir&&o.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,o.spikedT=3.5,o.speed*=.5,o.damage=me.clamp(o.damage+6,0,100),o.message="SPIKE STRIP!",o.messageTimer=1.2,o.cameraShake=Math.max(o.cameraShake,.4),oi("skid",.55,1.25,.1),Kr(.15))}if(lt.panicTick-=e,lt.panicTick<=0&&i>0){lt.panicTick=.4;for(const r of En){const l=r.actor;if(!l||!l.type||l.stolen||l.panicT>0)continue;let c=Math.hypot(o.roamPos.x-r.x,o.roamPos.z-r.z)<45;if(!c){for(const h of lt.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(l.panicT=1.6)}}i>0&&(a>240?(lt.evadeT+=e,lt.evadeT>9&&(o.heat=Math.max(0,i-1),lt.evadeT=o.heat>0?4:0,o.heat===0&&(o.score+=500,Ni("+500 ESCAPED THE LAW"),Tn(980,.22),o.message="You lost them",o.messageTimer=1.4))):lt.evadeT=Math.max(0,lt.evadeT-e*.6)),Me.police=lt.cars.length});const Ze={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},Ju=["van","boxTruck","taxi","pickup"];function T0(n){const e=new O(new Qe(3.4,3.4,340,12,1,!0),new Rt({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:yt,blending:si}));return e.frustumCulled=!1,Te.add(e),e}function E0(){for(const n of Ze.beacons)n.geometry.dispose(),n.material.dispose(),Te.remove(n);Ze.beacons=[]}function _h(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?Be.x0+(Math.random()*Math.round((Be.x1-Be.x0)/Be.pitch)|0)*Be.pitch:Be.zNear-(Math.random()*Math.round((Be.zNear-Be.zFar)/Be.pitch)|0)*Be.pitch,a=(Math.random()<.5?-1:1)*(Be.streetW*.5+6),r=i?Be.zFar+100+Math.random()*(Be.zNear-Be.zFar-200):Be.x0+100+Math.random()*(Be.x1-Be.x0-200),l=i?s+a:r,c=i?r:s+a,h=Math.hypot(l-o.roamPos.x,c-o.roamPos.z);if(!(h<n||h>e)&&!Ln(l,c,8,8,1)&&!(Ys(l,c).depth>0)&&!hn.some(d=>Math.abs(l-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:l,z:c,yaw:i?0:Math.PI/2}}return null}function A0(){const n=_h(200,700);if(!n){Ze.cooldown=4;return}const e=Ju[Math.random()*Ju.length|0];Ze.type=e,Ze.mesh=qr(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ze.mesh.userData.stolenYOff=.57,Ze.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),Ze.mesh.rotation.y=-n.yaw,Te.add(Ze.mesh),Ze.pickup=n;const t=T0(3531007);t.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(t),Ze.state="available",o.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,o.messageTimer=2}function R_(){if(Ze.state!=="available"||!Ze.mesh||o.roamPos.distanceTo(Ze.mesh.position)>6)return!1;xd();const n=Ze.mesh;return st={mesh:n,type:Ze.type,actor:null,parked:null,parkedYaw:0,job:!0},o.vehicle="car",o.drivingStolen=!0,o.roamPos.set(n.position.x,ce(n.position.x,n.position.z)+Fn,n.position.z),o.roamYaw=Ze.pickup.yaw,o.camYaw=o.roamYaw,o.speed=0,on.visible=!1,oi("jack",.5,1,.08)||Tn(340,.18,"square",.1),jn(),P_(),!0}function P_(){const n=_h(420,900)||_h(250,1100);if(!n){Nr("no route");return}Ze.dest=n,Ze.timeLeft=Math.round(14+Math.hypot(n.x-o.roamPos.x,n.z-o.roamPos.z)*.062),E0();const e=T0(16766720);e.position.set(n.x,ce(n.x,n.z)+150,n.z),Ze.beacons.push(e),Ze.state="active",o.message=`Deliver the ${Ze.type.toUpperCase()} to the gold beacon — ${Ze.timeLeft}s`,o.messageTimer=2.2}function ud(n){E0(),Object.assign(Ze,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Nr(n){Ze.state!=="idle"&&(st?.job?(Sl(),o.vehicle==="car"&&(o.vehicle="foot",on.visible=!0,o.speed=0,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05)):Ze.mesh&&As(Ze.mesh),ud(9),n!=="silent"&&(o.message=`Delivery failed — ${n}`,o.messageTimer=1.6,Tn(240,.3,"sawtooth",.1)),Me.deliveryFails=(Me.deliveryFails||0)+1)}function L_(n){As(n),ud(9),o.message="Delivery failed — vehicle abandoned",o.messageTimer=1.5,Me.deliveryFails=(Me.deliveryFails||0)+1}function D_(){const n=1200+Math.ceil(Ze.timeLeft)*10;o.score+=n,Me.deliveries=(Me.deliveries||0)+1,Ni(`+${n} DELIVERED`,!0),Tn(980,.18),setTimeout(()=>Tn(1320,.22),100);const e=st?.mesh;st=null,o.drivingStolen=!1,e&&As(e),o.vehicle="foot",o.speed=0,on.visible=!0,o.roamPos.x-=Math.cos(o.roamYaw)*3.4,o.roamPos.z-=Math.sin(o.roamYaw)*3.4,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,ud(8),o.message="Delivered! Another job will turn up",o.messageTimer=1.8}fn(new It,(n,e)=>{if(o.mode!=="roam"){Ze.state!=="idle"&&Nr("silent");return}Ze.state==="idle"?(Ze.cooldown-=e,Ze.cooldown<=0&&A0()):Ze.state==="active"&&(Ze.timeLeft-=e,Ze.timeLeft<=0?Nr("time's up"):o.drivingStolen&&st?.job&&Math.hypot(o.roamPos.x-Ze.dest.x,o.roamPos.z-Ze.dest.z)<15&&Math.abs(o.speed)<26&&D_())});fn(new It,(n,e)=>{if(!he)return;const t=o.mode==="roam"&&o.vehicle==="heli"?1:0;he.rpm+=(t-he.rpm)*Math.min(1,e*(t?1.4:.5)),he.rotor.rotation.y+=he.rpm*26*e,he.tailRotor.rotation.x+=he.rpm*42*e});const I_=new Rt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),Xo=Array.from({length:42},()=>{const n=new O(new Jt(.14,6,5),I_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),U_=new Rt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:yt}),yh=Array.from({length:14},()=>{const n=new O(new xl(.82,1,28),U_.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1}});function C0(n,e,t=1){const i=yh.find(s=>s.life<=0)||yh[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ce(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function F_(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=Xo.find(a=>a.life<=0)||Xo[i%Xo.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}C0(n.x,n.z,1.6)}fn(new It,(n,e)=>{for(const t of Xo)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of yh)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const qa=new MM(tn);qa.addPass(new _M(Te,be));const R0=new Ba(new Fe(window.innerWidth,window.innerHeight),.4,.72,.86);qa.addPass(R0);qa.addPass(new yM);const z_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},ur=new n0(z_);qa.addPass(ur);const N_=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),vr=Array.from({length:72},()=>{const n=new O(new Jt(.1,8,5),N_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P}}),O_=new Rt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:yt}),Mr=Array.from({length:90},()=>{const n=new O(new Mn(1,18),O_.clone());return n.visible=!1,Te.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),k_=new W({color:2962232,roughness:.58,metalness:.34}),_r=Array.from({length:48},()=>{const n=new O(new xe(.18,.08,.26),k_);return n.visible=!1,Te.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Ae=null;function P0(){if(Ae)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let R=0;R<1024;R++){const S=(R/511.5-1)*1.6;a[R]=4*S/(1+3*Math.abs(S))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const l=(R,S,b)=>{const L=n.createOscillator(),I=n.createGain();return L.type=R,I.gain.value=S,L.connect(I),I.connect(b),L.start(),{o:L,g:I}},c=l("sine",.5,t),h=l("sawtooth",.3,r),d=l("sawtooth",.3,r),u=l("triangle",.03,t),p=n.createOscillator(),m=n.createGain();p.type="sine",p.frequency.value=12,m.gain.value=0,p.connect(m),m.connect(r.gain),p.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),M=x.getChannelData(0);for(let R=0;R<M.length;R++)M[R]=Math.random()*2-1;const g=(R,S,b,L)=>{const I=n.createBufferSource(),V=n.createBiquadFilter(),j=n.createGain();return I.buffer=x,I.loop=!0,I.playbackRate.value=L,V.type=R,V.frequency.value=S,V.Q.value=b,j.gain.value=1e-4,I.connect(V),V.connect(j),j.connect(e),I.start(),{filter:V,gain:j}},f=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),_=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const T=n.createOscillator(),C=n.createGain();T.type="triangle",T.frequency.value=660,C.gain.value=1e-4,T.connect(C),C.connect(e),T.start(),Ae={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:u,burble:{o:p,depth:m},siren:{o:T,g:C},rain:_,wind:f,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const L0={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},B_=["interceptor","bullet","brawler","zephyr"];function D0(){return o.mode==="roam"&&o.drivingStolen&&st?L0[st.type]?st.type:"compact":B_[ki]||"interceptor"}function is(){Ae||P0(),Ae?.ctx.state==="suspended"&&Ae.ctx.resume().catch(()=>{}),X_()}function Ia(n){if(!Ae)return;const{ctx:e}=Ae,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Ae.master),t.start(),t.stop(e.currentTime+.24)}function V_(){if(!Ae||oi("whoosh",.4,1,.1))return;const{ctx:n}=Ae,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Ae.master),e.start(),e.stop(n.currentTime+.6)}function G_(){if(!Ae||oi("splat",.6,1,.14))return;const n=Ae.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=I0(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Ae.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Ae.master),s.start(),s.stop(n.currentTime+.26)}let xc=null;function I0(){if(xc)return xc;const n=Ae.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return xc=e}function H_(n=1){if(!Ae||oi("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Ae,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=I0(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Ae.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Zn={buffers:{},loops:{},loading:!1},W_=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function X_(){if(!(Zn.loading||!Ae)){Zn.loading=!0;for(const n of W_)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Ae.ctx.decodeAudioData(e)).then(e=>Zn.buffers[n]=e).catch(()=>{})}}function oi(n,e=.5,t=1,i=.06){const s=Ae&&Zn.buffers[n];if(!s)return!1;const a=Ae.ctx,r=a.createBufferSource(),l=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),l.gain.value=e,r.connect(l).connect(Ae.master),r.start(),!0}function gc(n,e,t=1e-4){if(Zn.loops[n])return Zn.loops[n];if(!Ae||!Zn.buffers[n])return null;const i=Ae.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Zn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Ae.master),s.start(),Zn.loops[n]={src:s,gain:a}}const ju={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function Qu(n,e,t,i,s,a){const{ctx:r}=Ae,l=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();l.type=i,l.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),l.connect(c),c.connect(h),h.connect(Ae.musicGain),l.start(e),l.stop(e+t+.05)}function q_(){const{ctx:n}=Ae,e=60/92/2;for(Ae.nextNote<n.currentTime-1&&(Ae.nextNote=n.currentTime+.08);Ae.nextNote<n.currentTime+.35;){const t=Ae.beat%32,i=t/8|0;t%4===0&&Qu(ju.bass[i],Ae.nextNote,.5,"triangle",.5,420),Qu(ju.arps[i][t%4],Ae.nextNote,.19,"sawtooth",.16,1300),Ae.nextNote+=e,Ae.beat++}}function $s(n,e=18){const t=Math.min(e,vr.length);for(let i=0;i<t;i++){const s=vr.find(a=>a.life<=0)||vr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function U0(n,e=10,t=1){const i=Math.min(e,Mr.length);for(let s=0;s<i;s++){const a=Mr.find(r=>r.life<=0)||Mr[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function Y_(n,e=8,t=1){const i=Math.min(e,_r.length);for(let s=0;s<i;s++){const a=_r.find(r=>r.life<=0)||_r[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function F0(n,e=Math.abs(o.speed),t="CRASH"){const i=me.clamp(Math.abs(e)/70,.18,1.45);o.collisionHits++,o.collisionDrama=Math.max(o.collisionDrama,i),o.cameraShake=Math.max(o.cameraShake,.25+i*.45),o.damage=me.clamp(o.damage+i*3.6,0,100),o.message=t,o.messageTimer=Math.max(o.messageTimer,.7),$s(n,Math.round(10+i*24)),U0(n,Math.round(5+i*12),i),Y_(n,Math.round(3+i*8),i),oi("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||Ia(18+i*34)}function $_(n){for(const e of vr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Mr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(be.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of _r)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function Z_(){if(!Ae)return;const{ctx:n}=Ae,e=n.currentTime,t=(o.mode==="race"||o.mode==="roam"||o.mode==="paused")&&!(o.mode==="roam"&&o.vehicle==="foot"),i=o.mode==="roam"&&o.vehicle==="heli",s=o.tachRpm||900,a=me.clamp((s-900)/6600,0,1),r=Math.abs(o.speed),l=o.mode==="roam"&&o.waterDepth||0,c=L0[D0()],h=i?26+(he?.rpm||0)*14:(38+a*124)*c.fMul;Ae.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Ae.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Ae.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Ae.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Ae.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Ae.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Ae.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Ae.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Ae.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Ae.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Ae.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*l),e,.06),Ae.engineGain.gain.setTargetAtTime((t&&o.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*l),e,.07),Ae.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Ae.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=o.mode==="roam"?o.roamSlip:o.grounded?Math.min(1,Math.abs(o.lateralVel)/15):0,u=gc("skid");Ae.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(u?.05:.15):1e-4,e,.09),u&&u.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const p=gc("rotor");p&&(p.gain.gain.setTargetAtTime(i?.06+(he?.rpm||0)*.3:1e-4,e,i?.3:.15),p.src.playbackRate.setTargetAtTime(.65+(i&&he?.rpm||0)*.5,e,.4)),o.boosting&&!Ae.prevBoost&&V_(),Ae.prevBoost=!!o.boosting,Ae.boost.gain.gain.setTargetAtTime(t&&o.boosting?.15:1e-4,e,o.boosting?.05:.22),Ae.boost.filter.frequency.setTargetAtTime(o.boosting?420+r*3:260,e,.1),Ae.rain&&Ae.rain.gain.gain.setTargetAtTime(Va()>.02&&o.mode!=="menu"?Va()*.045:1e-4,e,.4);const m=o.mode==="roam"&&(o.heat||0)>0&&lt.nearest<460,x=m?Math.min(.06,(460-lt.nearest)/460*.075):1e-4;Ae.siren.g.gain.setTargetAtTime(x,e,.25),Ae.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const M=localStorage.getItem("steel-ribbon-music")!=="0",g=M?gc("music",Ae.musicGain,1):Zn.loops.music||null;Ae.musicGain.gain.setTargetAtTime(M?o.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),M&&!g&&q_()}function Or(n=!1,e=!1,t=!1){P0(),is(),Je.clear(),Vr(),Sl();const i=n||e;o.seasonRace=t&&!i;for(let a=0;a<Xn.length;a++){const r=Xn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(o,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=pt(o.s);o.y=s.p.y+2.1,o.yVel=0,o.ghostRec=[],yy(),by(),Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.resultStats.innerHTML="",Xe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Xe.trackName.textContent=se.name,Ot.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Hi(),window.__freeCam=!1}function rl(){is(),o.mode="roam",o.practice=!0,o.freeRun=!1,Je.clear(),Vr();let n=80,e=338;Pn(n,e,6).clearance<6&&(n=80,e=320),o.roamPos.set(n,ce(n,e),e),o.roamYaw=0,o.camYaw=o.roamYaw,o.camLookYaw=0,o.camLookPitch=0,o.cameraZoom=0,Ee.zoom=0,o.wheelSteer=0,o.speed=0,o.boost=1,o.damage=0,o.cameraShake=0,o.collisionDrama=0,o.collisionHits=0,o.collisionCooldown=0,o.objectiveIndex=0,o.objectiveHits=0,o.objectiveLap=1,o.driftCombo=0,o.driftComboT=0,o.stuntActive=!1,o.stuntPrime=0,o.sloMoT=0,o.flipT=0,o.airRoll=0,o.stuntBullseye=!1,o.roamAir=!1,o.roamVy=0,o.roamPrevY=null,o.roamAirT=0,o.vehicle="car",on.visible=!1,Nr("silent"),Sl(),dd(),he&&(he.pos.set(he.pad.x,he.pad.y+.24,he.pad.z),he.vel.set(0,0,0),he.mesh.position.copy(he.pos));for(const s of $t)s.collected=!1;o.message="",o.messageTimer=0,Yr(!1),Ot.visible=!0,ln&&(ln.visible=!1),document.body.classList.add("roam-mode"),Hi(),window.__freeCam=!1,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const t=Math.sin(o.roamYaw),i=-Math.cos(o.roamYaw);be.position.set(o.roamPos.x-t*17,o.roamPos.y+7.2,o.roamPos.z-i*17),Eh(),be.lookAt(o.roamPos.x+t*13,o.roamPos.y+2.45,o.roamPos.z+i*13),be.fov=69,be.updateProjectionMatrix()}function jn(){const n=md();n.position.set(o.roamPos.x,o.roamPos.y+.3-(n.userData.stolenYOff||0)-o.roamSuspension*.45-(o.waterDepth||0)*.38,o.roamPos.z),n.quaternion.setFromAxisAngle(Qt,-o.roamYaw),n.rotateZ(-o.wheelSteer*me.clamp(Math.abs(o.speed)/90,0,1)*.1+(o.roamAir&&o.stuntActive&&o.airRoll||0)),n.rotateX(o.roamAir?o.stuntActive&&o.stuntRamp?.type==="flip"?-(o.flipT||0)*Math.PI*2:me.clamp(-o.roamVy*.014,-.3,.34):me.clamp(o.roamSuspension,-.16,.22))}function z0(n,e){let t=null;for(const s of ta)for(const a of s.segments){const r=n-a.a.x,l=e-a.a.z,c=me.clamp((r*a.abx+l*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,u=Math.hypot(n-h,e-d);if(u>s.halfW+Dn*1.15)continue;const p=me.lerp(a.a.y,a.b.y,c),m=me.lerp(a.u0,a.u1,c),x=u+Math.max(0,ce(n,e)-p)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function N0(n,e,t=ce(n,e),i=!1){let s=null;const a=10;for(let l=0;l<se.length;l+=a){if(Oi(l+a*.5))continue;const c=pt(l),h=pt(l+a),d=h.p.x-c.p.x,u=h.p.z-c.p.z,p=Math.max(1e-4,d*d+u*u),m=me.clamp(((n-c.p.x)*d+(e-c.p.z)*u)/p,0,1),x=c.p.x+d*m,M=c.p.z+u*m,g=n-x,f=e-M,y=Math.hypot(g,f);if(y>se.width*.5+Dn*.45)continue;const v=me.lerp(c.p.y,h.p.y,m)+.58;if(!i&&t<v-5)continue;const _=new P(u,0,-d).normalize(),E=me.clamp(g*_.x+f*_.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:l+a*m,lateral:E,tangentX:d,tangentZ:u,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function Hs(n,e,t=o.roamPos.y){const i=ce(n,e),s=b_(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=z0(n,e);r&&r.y>=i-1.2&&(a=r);const l=N0(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&l&&l.y>=a.y-.8&&(a=l),a}function ef(n){if(n.rampType==="off"||o.drivingStolen)return!1;const e=Math.sin(o.roamYaw)*n.tangentX+-Math.cos(o.roamYaw)*n.tangentZ;if(o.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=pt(t);return o.mode="race",o.practice=!0,o.freeRun=!0,o.breakdownTimer=0,o.s=i.s,o.totalDistance=i.s,o.lastSafeS=i.s,o.lastSafeDistance=i.s,o.lateral=me.clamp(n.lateral??0,-se.width*.32,se.width*.32),o.lateralVel=-Math.sign(o.lateral)*Math.min(4,Math.abs(o.speed)*.04),o.speed=me.clamp(Math.max(28,o.speed),18,112),o.grounded=!0,o.y=i.p.y+2.1,o.yVel=0,o.airtime=0,o.rivalS=-900,o.rivalDistance=-900,o.leadState="SOLO",o.message="Merged onto the ribbon",o.messageTimer=1.6,o.cameraShake=Math.max(o.cameraShake,.35),Yr(!1),Ot.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Hi(),Xe.position.textContent="FREE RUN",Xe.trackName.textContent=se.name,jn(),!0}function K_(n,e,t){if(o.mode!=="race")return!1;const i=t.tangent.x,s=t.tangent.z,a=Math.max(1e-4,Math.hypot(i,s));o.mode="roam",o.practice=!0,o.freeRun=!1,o.roamPos.set(n,ce(n,e)+Fn,e),o.roamYaw=Math.atan2(i/a,-s/a),o.camYaw=o.roamYaw,o.camLookYaw=0,o.camLookPitch=0,o.cameraZoom=0,o.wheelSteer=0,o.speed=me.clamp(Math.abs(o.speed)*.6,12,70),o.grounded=!0,o.yVel=0,o.airtime=0,o.roamAir=!1,o.roamVy=0,o.roamPrevY=null,o.damage=me.clamp(o.damage+10,0,100),o.cameraShake=Math.max(o.cameraShake,.8),o.message="Off the ribbon — welcome to the streets",o.messageTimer=1.8,oi("land",.6,.92,.08)||Ia(30),$s(new P(n,o.roamPos.y+.4,e),20),Yr(!1),Ot.visible=!0,ln&&(ln.visible=!1),document.body.classList.add("roam-mode"),Hi(),o.vehicle="car",on.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const r=Math.sin(o.roamYaw),l=-Math.cos(o.roamYaw);return be.position.set(o.roamPos.x-r*17,o.roamPos.y+7.2,o.roamPos.z-l*17),be.lookAt(o.roamPos.x+r*13,o.roamPos.y+2.45,o.roamPos.z+l*13),be.fov=69,be.updateProjectionMatrix(),!0}function J_(n){if(!n||o.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;o.mode="roam",o.practice=!0,o.freeRun=!1,o.roamPos.set(t.x+s*3.5,t.y+Fn,t.z+a*3.5),o.roamYaw=Math.atan2(s,-a),o.camYaw=o.roamYaw,o.camLookYaw=0,o.camLookPitch=0,o.cameraZoom=0,o.wheelSteer=0,o.speed=me.clamp(Math.max(24,Math.abs(o.speed)*.82),20,78),o.grounded=!0,o.yVel=0,o.airtime=0,o.message="Exited to city streets",o.messageTimer=1.25,o.cameraShake=Math.max(o.cameraShake,.22),Yr(!1),Ot.visible=!0,ln&&(ln.visible=!1),document.body.classList.add("roam-mode"),Hi(),o.vehicle="car",on.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",jn();const r=Math.sin(o.roamYaw),l=-Math.cos(o.roamYaw);return be.position.set(o.roamPos.x-r*17,o.roamPos.y+7.2,o.roamPos.z-l*17),be.lookAt(o.roamPos.x+r*13,o.roamPos.y+2.45,o.roamPos.z+l*13),be.fov=69,be.updateProjectionMatrix(),$s(o.roamPos.clone().add(new P(0,.6,0)),10),!0}function j_(){const n=yl.set(0,0,-1).applyQuaternion(be.quaternion).normalize();window.__steelRibbonTelemetry={mode:o.mode,s:o.s,totalDistance:o.totalDistance,rivalDistance:o.rivalDistance,speed:o.speed,lap:o.lap,score:o.score,damage:o.damage,y:o.roamPos.y,yVel:o.yVel,grounded:!o.roamAir,objectiveHits:o.objectiveHits,waterDepth:+(o.waterDepth||0).toFixed(3),driftAngle:+(o.driftAngle||0).toFixed(3),driftCombo:o.driftCombo||0,driftComboT:+(o.driftComboT||0).toFixed(2),driftT:+(o.driftT||0).toFixed(2),driftAcc:+(o.driftAcc||0).toFixed(1),roamView:Aa,heat:+(o.heat||0).toFixed(2),police:lt.cars.length,policeNearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),roadblocks:lt.blocks.length,spikedT:+(o.spikedT||0).toFixed(2),rain:+Va().toFixed(2),job:{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1)},stuntActive:!!o.stuntActive,stuntType:o.stuntActive&&o.stuntRamp?.type||null,flipT:+(o.flipT||0).toFixed(2),bullseye:!!o.stuntBullseye,sloMoT:+(o.sloMoT||0).toFixed(2),stunts:Me.stunts||0,airTime:+(o.roamAirT||0).toFixed(2),vehicle:o.vehicle||"car",drivingStolen:!!o.drivingStolen,stolenType:o.drivingStolen&&st?.type||null,altitude:+(o.roamPos.y-ce(o.roamPos.x,o.roamPos.z)).toFixed(1),roamPos:{x:o.roamPos.x,y:o.roamPos.y,z:o.roamPos.z},input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:Math.sin(o.roamYaw),y:0,z:-Math.cos(o.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var Zs=document.createElement("canvas");Zs.id="minimap",Zs.width=256,Zs.height=256;document.querySelector("#app")?.appendChild(Zs);var bh=null,Q_=0,Ws={cx:0,cz:-570,span:2180};function gn(n,e,t){return[((n-Ws.cx)/Ws.span+.5)*t,((e-Ws.cz)/Ws.span+.5)*t]}function fd(){if(!Ws)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Be.x0;s<=Be.x1+1;s+=Be.pitch){const[a,r]=gn(s,Be.zNear,n),[l,c]=gn(s,Be.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(l,c),t.stroke()}for(let s=Be.zNear;s>=Be.zFar-1;s-=Be.pitch){const[a,r]=gn(Be.x0,s,n),[l,c]=gn(Be.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(l,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of wl())if(s.courseIndex===ws){const[a,r]=gn(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of Qs){const[a,r]=gn(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/Ws.span*n),Math.max(3,s.rz/Ws.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Ci||[]){const[a,r]=gn(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}bh=e}function ey(){const n=o.mode==="roam";if((Zs.style.display=n?"block":"none")&&!n||!n||!bh||Q_++%2)return;const e=Zs.width,t=Zs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(bh,0,0,e,e);for(const a of ta)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[l,c]=gn(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(l,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<$t.length;a++){const r=$t[a],[l,c]=gn(r.x,r.z,e),h=a===o.objectiveIndex%$t.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(l,c,h?5.5+Math.sin(sl*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of En){const[r,l]=gn(a.x,a.z,e);t.fillRect(r-1.4,l-1.4,2.8,2.8)}if(he){const[a,r]=gn(he.pad.x,he.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),o.vehicle!=="heli"){const[l,c]=gn(he.pos.x,he.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(l,c,3,0,Math.PI*2),t.fill()}}if(o.vehicle!=="car"||o.drivingStolen){const[a,r]=gn(Bi.x,Bi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(st?.parked){const[a,r]=gn(st.parked.x,st.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of lt.cars){const[r,l]=gn(a.x,a.z,e);t.beginPath(),t.arc(r,l,3.2,0,Math.PI*2),t.fill()}for(const a of lt.blocks){const[r,l]=gn(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,l-1.4,8,2.8)}if(Ze.state==="available"&&Ze.pickup){const[a,r]=gn(Ze.pickup.x,Ze.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ze.state==="active"&&Ze.dest){const[a,r]=gn(Ze.dest.x,Ze.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=gn(o.roamPos.x,o.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(o.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}fd();let Ei=null;function ty(){Ei||(Ei=new O(new Qe(2.4,3.2,620,12,1,!0),new Rt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:si,side:yt,fog:!1})),Ei.renderOrder=5,Te.add(Ei));const n=o.mode==="roam"&&$t.length>0;if(Ei.visible=n,!n)return;const e=$t[o.objectiveIndex%$t.length];Ei.position.set(e.x,e.y+296,e.z),Ei.material.opacity=.1+Math.sin(sl*3.1)*.04}let us=null;function pd(){if(o.mode!=="roam"||$t.length===0){us=null;return}const n=$t[o.objectiveIndex%$t.length];if(!n)return;const e=us?.x??o.roamPos.x,t=us?.z??o.roamPos.z,i=us?.y??o.roamPos.y,s=o.roamPos.x-e,a=o.roamPos.z-t,r=s*s+a*a;if(us??={x:0,y:0,z:0},us.x=o.roamPos.x,us.y=o.roamPos.y,us.z=o.roamPos.z,r>4e4)return;const l=r>1e-6?me.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*l-n.x,h=t+a*l-n.z,d=Math.abs(i+(o.roamPos.y-i)*l-n.y),u=n.radius+1.2;c*c+h*h>u*u||d>10||(n.collected=!0,o.objectiveHits++,o.objectiveIndex=(o.objectiveIndex+1)%$t.length,o.objectiveIndex===0&&o.objectiveLap++,o.score+=420+Math.round(Math.abs(o.speed)*5),o.boost=Math.min(1,o.boost+.32),o.cameraShake=Math.max(o.cameraShake,.18),o.message=n.label,o.messageTimer=1.05,Ni(`+${420+Math.round(Math.abs(o.speed)*5)} GATE`,!0),Tn(880,.16),setTimeout(()=>Tn(1245,.2),90),$s(new P(n.x,n.y,n.z),18))}function O0(n){const e=o.speed;o.collisionCooldown=Math.max(0,o.collisionCooldown-n);const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),s=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*s0,a=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&o.boost>.02&&t>.03;if(t>.03){const _=o.speed<0?38:0;o.speed+=((a?70:42)*_s().accel+_)*t*n}i>.03&&(o.speed-=(o.speed>1.2?78:32)*i*n),o.speed-=.00235*o.speed*Math.abs(o.speed)*n,Math.abs(o.speed)>.08?o.speed-=Math.sign(o.speed)*3.6*n:t<=.03&&i<=.03&&(o.speed=0),o.speed=me.clamp(o.speed,-24,135*_s().top*(o.spikedT>0?.62:1)),o.boosting=a,a?o.boost=Math.max(0,o.boost-n*.22):o.boost=Math.min(1,o.boost+n*.05*_s().boostRegen),o.wheelSteer+=(s-o.wheelSteer)*(1-Math.pow(1e-5,n)),o.spikedT>0&&(o.spikedT-=n);const r=-o.wheelSteer*.55,l=md().userData.frontWheels;if(l&&(l[0].rotation.y=r,l[1].rotation.y=r),o.drivingStolen&&st)for(const _ of st.mesh.userData.wheels||[])_.rotation.x-=o.speed*n*1.7;const c=Math.abs(o.speed),h=Je.has("Space")&&!o.roamAir;if(c>xh){const _=me.clamp((c-xh)/5,0,1),E=1-.36*me.clamp((c-34)/85,0,1),T=SM*1.08*_*E*(h?1.85:1)*_s().grip*(o.spikedT>0?.55:1)*(1-.26*Va());o.roamYaw+=o.wheelSteer*T*n*Math.sign(o.speed)}h&&c>8?(o.driftAngle=me.clamp((o.driftAngle||0)+o.wheelSteer*n*2.5*Math.sign(o.speed),-.62,.62),o.speed-=o.speed*(.12+Math.abs(o.driftAngle)*.45)*n):o.driftAngle=(o.driftAngle||0)*Math.pow(.004,n);const d=o.roamYaw-(o.driftAngle||0),u=Math.sin(d),p=-Math.cos(d),m=(o.speed-e)/Math.max(.001,n),x=me.clamp(Math.abs(o.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-m-34)/90+Math.abs(o.driftAngle||0)*1.5,0,1);if(o.roamSlip+=(x-o.roamSlip)*(1-Math.pow(.01,n)),o.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(m)*.0018-o.roamSuspension)*(1-Math.pow(.018,n)),o.roamSlip>.38&&Math.random()<n*(3+o.roamSlip*7)){const _=new P(o.roamPos.x-u*3.2,o.roamPos.y+.2,o.roamPos.z-p*3.2);U0(_,2,o.roamSlip)}const M=Math.abs(o.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let f=!1,y=!1,v=Hs(o.roamPos.x,o.roamPos.z,o.roamPos.y);for(let _=0;_<g;_++)o.roamPos.x+=u*o.speed*n/g,o.roamPos.z+=p*o.speed*n/g,v=Hs(o.roamPos.x,o.roamPos.z,o.roamPos.y),o.roamAir||(o.roamPos.y=v.y+Fn),fy(o.roamPos,v)&&(y=!0),W0(o.roamPos,v)&&(f=!0),v=Hs(o.roamPos.x,o.roamPos.z,o.roamPos.y),o.roamAir||(o.roamPos.y=v.y+Fn);o.roamPos.x=me.clamp(o.roamPos.x,-820,820),o.roamPos.z=me.clamp(o.roamPos.z,-1620,480),f&&(o.collisionCooldown<=0&&(F0(new P(o.roamPos.x,o.roamPos.y+.8,o.roamPos.z),e,"IMPACT"),o.collisionCooldown=.38),o.speed*=.28),y&&(o.speed*=.62,o.cameraShake=Math.max(o.cameraShake,.22),o.message="SPLAT!",o.messageTimer=.9,Kr(.6)),G0(n,e),oy(n,h,f),cy(n,f),v=Hs(o.roamPos.x,o.roamPos.z,o.roamPos.y),ly(n,v),!(v.kind==="ramp"&&v.u>.72&&ef(v))&&(v.kind==="track"&&ef(v)||(pd(),jn(),Je.has("KeyR")&&(rl(),Je.delete("KeyR"))))}const tf={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let st=null;const k0=[];function md(){return o.drivingStolen&&st?st.mesh:Ot}function xd(){if(st){if(st.job){const n=st.mesh;st=null,L_(n);return}if(st.actor){const n=st.actor.collider,e=st.mesh.position;n.x=e.x,n.z=e.z}k0.push(st),st=null}}function ny(n){xd(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Te.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return st={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},o.vehicle="car",o.drivingStolen=!0,o.roamPos.set(n.mesh.position.x,ce(n.mesh.position.x,n.mesh.position.z)+Fn,n.mesh.position.z),o.roamYaw=Math.atan2(e,-t),o.camYaw=o.roamYaw,o.speed=n.speed,on.visible=!1,o.message=`${(n.type||"car").toUpperCase()} jacked!`,o.messageTimer=1.2,Kr(1),oi("jack",.5,1,.08)||Tn(340,.18,"square",.1),jn(),!0}function iy(n){if(xd(),n.taken=!0,n.savedM=new _t,vn.im){const t=new _t().makeScale(1e-4,1e-4,1e-4);vn.im.getMatrixAt(n.idx,n.savedM),vn.im.setMatrixAt(n.idx,t),vn.imW.setMatrixAt(n.idx,t),vn.im.instanceMatrix.needsUpdate=!0,vn.imW.instanceMatrix.needsUpdate=!0}const e=qr("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Te.add(e),st={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},o.vehicle="car",o.drivingStolen=!0,o.roamPos.set(n.x,ce(n.x,n.z)+Fn,n.z),o.roamYaw=n.yaw,o.camYaw=n.yaw,o.speed=0,on.visible=!1,o.message="Borrowed a parked car",o.messageTimer=1.1,Kr(.7),oi("jack",.45,1.05,.08)||Tn(300,.16,"square",.09),jn(),!0}function sy(){st.mesh.visible=!0,st.parked=o.roamPos.clone(),st.parkedYaw=o.roamYaw,o.vehicle="foot",o.drivingStolen=!1,o.speed=0,o.driftAngle=0;const n=Math.cos(o.roamYaw),e=Math.sin(o.roamYaw);return o.roamPos.x-=n*3.4,o.roamPos.z-=e*3.4,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,on.visible=!0,!0}function nf(){return!st?.parked||o.roamPos.distanceTo(st.parked)>7?!1:(o.vehicle="car",o.drivingStolen=!0,o.roamPos.copy(st.parked),o.roamYaw=st.parkedYaw,o.camYaw=o.roamYaw,o.speed=0,st.parked=null,on.visible=!1,jn(),!0)}function B0(){for(const n of En){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(o.roamPos.x-n.x,o.roamPos.z-n.z)>6))return ny(e)}for(const n of vn.spots)if(!n.taken&&Math.hypot(o.roamPos.x-n.x,o.roamPos.z-n.z)<5.5)return iy(n);return!1}function sf(n){if(n.actor)n.actor.stolen=!1;else{As(n.mesh);const e=n.spotRef;e?.savedM&&vn.im&&(vn.im.setMatrixAt(e.idx,e.savedM),vn.imW.setMatrixAt(e.idx,e.savedM),vn.im.instanceMatrix.needsUpdate=!0,vn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function Sl(){st&&(sf(st),st=null),k0.splice(0).forEach(sf),o.drivingStolen=!1}function wh(n=!1){if(o.vehicle!=="car"||!n&&Math.abs(o.speed)>12)return!1;if(o.drivingStolen&&st)return o.roamAir=!1,o.roamVy=0,sy(),o.message="On foot — your car is marked on the map",o.messageTimer=1.6,!0;Bi.copy(o.roamPos),Mh=o.roamYaw,Ot.visible=!0,o.vehicle="foot",o.speed=0,o.driftAngle=0,o.roamAir=!1,o.roamVy=0;const e=Math.cos(o.roamYaw),t=Math.sin(o.roamYaw);return o.roamPos.x-=e*3.4,o.roamPos.z-=t*3.4,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,on.visible=!0,o.message="On foot — E enters your car, the heli, or steals a ride",o.messageTimer=1.6,!0}function Sh(){return o.vehicle!=="foot"||o.roamPos.distanceTo(Bi)>7?!1:(o.vehicle="car",o.roamPos.copy(Bi),o.roamYaw=Mh,o.camYaw=Mh,o.speed=0,on.visible=!1,jn(),!0)}function V0(){return o.vehicle!=="foot"||!he||o.roamPos.distanceTo(he.pos)>10.5?!1:(o.vehicle="heli",o.roamPos.copy(he.pos),o.roamYaw=he.yaw,o.camYaw=he.yaw,o.speed=0,he.vel.set(0,0,0),on.visible=!1,o.message="Arrows fly · Space up · Shift down · E lands",o.messageTimer=2.2,!0)}function Th(){if(o.vehicle!=="heli"||!he)return!1;const n=ce(he.pos.x,he.pos.z);return he.pos.y-n>5.2||he.vel.length()>9?(o.message="Land first — get low and slow",o.messageTimer=1.1,!1):(o.vehicle="foot",he.mesh.visible=!0,o.roamPos.x=he.pos.x+Math.cos(he.yaw)*-5.6,o.roamPos.z=he.pos.z+Math.sin(he.yaw)*-5.6,o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,o.speed=0,on.visible=!0,!0)}function gd(){o.mode==="roam"&&(o.vehicle==="car"?wh()||(o.message="Slow down to step out",o.messageTimer=.9):o.vehicle==="foot"?(o.roamPos.distanceTo(Bi)<=(st?.parked?o.roamPos.distanceTo(st.parked):1/0)?Sh()||nf():nf()||Sh())||V0()||R_()||B0():Th())}function ay(n){const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),t=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),i=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1),s=Je.has("ShiftLeft")||Je.has("ShiftRight"),a=o.speed,r=(e-t)*(s?14.5:6.4);o.speed+=(r-o.speed)*Math.min(1,n*7),o.roamYaw+=i*2.3*n;const l=Math.sin(o.roamYaw),c=-Math.cos(o.roamYaw);o.roamPos.x+=l*o.speed*n,o.roamPos.z+=c*o.speed*n,W0(o.roamPos,{kind:"ground"}),o.roamPos.x=me.clamp(o.roamPos.x,-820,820),o.roamPos.z=me.clamp(o.roamPos.z,-1620,480),o.roamPos.y=ce(o.roamPos.x,o.roamPos.z)+.05,G0(n,a),pd(),on.position.copy(o.roamPos),on.rotation.y=Math.atan2(-l,-c),o.walkPhase=(o.walkPhase||0)+n*(2+Math.abs(o.speed)*.85);const h=Math.sin(o.walkPhase)*me.clamp(Math.abs(o.speed)/5,0,1);for(const p of on.userData.limbs||[])p.mesh.rotation.x=h*p.amp*p.side*2.2,p.mesh.position.y=p.baseY+Math.abs(h)*.03;const d=o.roamPos.distanceTo(Bi)<7,u=he&&o.roamPos.distanceTo(he.pos)<9;o.messageTimer<=0&&(d?(o.message="E — enter car",o.messageTimer=.2):u&&(o.message="E — enter helicopter",o.messageTimer=.2))}function ry(n){if(!he)return;const e=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle)-Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),t=me.clamp((Je.has("KeyA")||Je.has("ArrowLeft")?1:0)-(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-Ee.steer,-1,1),i=he.rpm>.55,s=Je.has("ShiftLeft")||Je.has("ShiftRight"),a=_l?s?1:he.pos.y-ce(he.pos.x,he.pos.z)>6?-.45:0:Je.has("Space")?1:s?-1:0;he.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(he.yaw),l=-Math.cos(he.yaw);i&&(he.vel.x+=r*e*30*n,he.vel.z+=l*e*30*n,he.vel.y+=a*24*n,a===0&&(he.vel.y-=he.vel.y*1.6*n)),he.vel.x-=he.vel.x*.85*n,he.vel.z-=he.vel.z*.85*n,he.vel.y-=he.vel.y*1.1*n,he.pos.addScaledVector(he.vel,n);const c=ce(he.pos.x,he.pos.z);he.pos.x=me.clamp(he.pos.x,-1500,1500),he.pos.z=me.clamp(he.pos.z,-1900,700),he.pos.y=Math.min(he.pos.y,300),he.pos.y<c+1.1&&(he.pos.y=c+1.1,he.vel.y=Math.max(0,he.vel.y)),(yr(he.pos,hn)||yr(he.pos,xi))&&(he.vel.multiplyScalar(.25),o.cameraShake=Math.max(o.cameraShake,.2)),o.roamPos.x=he.pos.x,o.roamPos.y=he.pos.y,o.roamPos.z=he.pos.z,o.roamYaw=he.yaw,o.speed=Math.hypot(he.vel.x,he.vel.z),he.mesh.position.copy(he.pos),he.mesh.quaternion.setFromAxisAngle(Qt,-he.yaw),he.mesh.rotateX(me.clamp((he.vel.x*r+he.vel.z*l)*.008,-.24,.24)),he.mesh.rotateZ(me.clamp(t*.14,-.2,.2)),pd()}function oy(n,e,t){const i=e&&Math.abs(o.driftAngle||0)>.16&&Math.abs(o.speed)>24;if(o.driftComboT>0&&(o.driftComboT-=n,o.driftComboT<=0)&&(o.driftCombo=0),t&&(o.driftCombo||o.driftComboT>0)&&(o.driftCombo=0,o.driftComboT=0),i&&!t)o.driftT=(o.driftT||0)+n,o.driftAcc=(o.driftAcc||0)+n*Math.abs(o.speed)*(.7+Math.abs(o.driftAngle));else if(o.driftT){if(!t&&o.driftT>.55){const s=Math.min(5,(o.driftCombo||0)+1),a=Math.round(o.driftAcc*s);o.score+=a,Ni(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),Tn(600+s*90,.16,"square",.1),o.driftCombo=s,o.driftComboT=4}o.driftT=0,o.driftAcc=0}}function ly(n,e){const t=e.y+Fn,i=o.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(o.speed)>30&&(o.stuntPrime=.3,o.stuntRamp=M0),o.stuntPrime>0&&(o.stuntPrime-=n),!o.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(o.speed)>26&&s<(o.roamVy||0)-40*n-3.4?(o.roamAir=!0,o.roamAirT=0,o.stuntPrime>0&&(o.stuntActive=!0,o.stuntPrime=0,o.flipT=0,o.airRoll=0,o.stuntBullseye=!1,o.sloMoT=o.stuntRamp?.type==="flip"?1.4:1.15,o.message=o.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",o.messageTimer=1,oi("whoosh",.38,1.2,.08))):(o.roamVy=me.clamp(s,-70,70),o.roamPos.y=t)}if(o.roamAir){if(o.roamVy-=34*n,o.roamAirT+=n,o.roamPos.y=o.roamPos.y+o.roamVy*n,o.stuntActive){o.stuntRamp?.type==="flip"&&(o.flipT=Math.min(1,(o.flipT||0)+n/1.05));const s=(Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0);o.airRoll=(o.airRoll||0)+s*n*4.4;const a=o.stuntRamp?.hoop;a&&!o.stuntBullseye&&Math.hypot(o.roamPos.x-a.x,o.roamPos.y-a.y,o.roamPos.z-a.z)<a.r-.4&&(o.stuntBullseye=!0,o.message="BULLSEYE!",o.messageTimer=1,Tn(1240,.2,"square",.14))}if(o.roamPos.y<=t){o.roamPos.y=t,o.roamAir=!1;const s=-o.roamVy;if(o.roamVy=0,s>9&&(o.cameraShake=Math.max(o.cameraShake,Math.min(.5,s/40)),oi("land",Math.min(.62,s/42),1,.1)||Ia(Math.min(24,s*.85)),o.roamSuspension+=.16),o.stuntActive){const a=Math.floor(Math.abs(o.airRoll||0)/(Math.PI*2)),r=o.stuntRamp?.type==="flip"&&(o.flipT||0)>=.96;let l=160+o.roamAirT*240+Math.abs(o.speed)*1.4+a*140;r&&(l*=1.6),o.stuntBullseye&&(l*=2),l=Math.round(l);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,o.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");o.score+=l,Me.stunts=(Me.stunts||0)+1,Ni(`STUNT +${l}`),c&&(o.message=c,o.messageTimer=1.4),Tn(880,.2,"square",.12),o.stuntActive=!1,o.flipT=0,o.airRoll=0}else if(o.roamAirT>.45){const a=Math.round(40+o.roamAirT*70);o.score+=a,Ni(`+${a} AIR`),Tn(760,.14)}}}o.roamPrevY=o.roamPos.y}const Dn=2.6;function G0(n,e){const t=o.waterDepth||0;if(o.roamPos.y>ce(o.roamPos.x,o.roamPos.z)+2.5){o.waterDepth=0;return}const i=Ys(o.roamPos.x,o.roamPos.z);o.waterDepth=i.depth,!(i.depth<=.02)&&(o.speed-=o.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(F_(o.roamPos.clone(),Math.abs(e)),H_(Math.abs(e)/60),o.cameraShake=Math.max(o.cameraShake,.16),o.message="SPLASH",o.messageTimer=.7),o.wakeT=(o.wakeT??0)-n,Math.abs(o.speed)>5&&o.wakeT<=0&&(o.wakeT=.15,C0(o.roamPos.x-Math.sin(o.roamYaw)*1.5,o.roamPos.z+Math.cos(o.roamYaw)*1.5,.8+Math.abs(o.speed)*.012)))}function cy(n,e){for(const t of En)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(o.speed)<32||o.collisionCooldown>0))for(const t of En){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=o.roamPos.x-t.x,a=o.roamPos.z-t.z,r=(t.hw+t.hd)*.5+Dn+2.4;if(s*s+a*a<r*r&&Math.abs(o.roamPos.y-(t.maxY??o.roamPos.y))<7){i.nearMissT=1.8,o.score+=45,o.nearMisses+=1,Ni("+45 NEAR MISS"),Tn(520,.12,"square",.07);break}}}function yr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Fn+.45)continue;if(s.radius){const u=s.radius+Dn,p=n.x-s.x,m=n.z-s.z,x=p*p+m*m;if(x>=u*u)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+p/M*u,n.z=s.z+m/M*u;continue}const a=s.hw+Dn,r=s.hd+Dn,l=n.x-s.x,c=n.z-s.z;if(Math.abs(l)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(l),d=r-Math.abs(c);h<d?n.x=s.x+(l<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function H0(n,e=o.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Be.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=me.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(Me.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),o.mode==="roam"&&(o.cameraShake=Math.max(o.cameraShake,.32),o.message="TRAFFIC CRASH",o.messageTimer=.85))}function hy(n){let e=!1;for(let t=0;t<En.length;t++){const i=En[t];if(i.maxY!=null&&n.y>i.maxY+Fn+.45)continue;const s=i.hw+Dn,a=i.hd+Dn,r=n.x-i.x,l=n.z-i.z;if(Math.abs(r)>=s||Math.abs(l)>=a)continue;e=!0,H0(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(l);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(l<0?-a:a)}return e}function dy(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Fn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function uy(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,Me.splats++,G_();const e=La.find(t=>!t.visible)||La[Me.splats%Math.max(1,La.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ce(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function fy(n,e=null){if(e?.kind!=="ground"||Math.abs(o.speed)<5)return!1;let t=!1;for(const i of Fr){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=Dn+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(ce(i.x,i.z)+Fn))>3.2||(uy(i),t=!0)}return t}function W0(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=yr(n,hn),a=e?.kind==="ground"?yr(n,ni):!1,r=yr(n,xi),l=e?.kind==="ground"?hy(n):!1;if(!s&&!a&&!r&&!l)break;t=!0}return t}function X0(n){const e=Ee.lookX*1.18,t=Ee.lookY*.58;o.camLookYaw+=(e-o.camLookYaw)*(1-Math.pow(.002,n)),o.camLookPitch+=(t-o.camLookPitch)*(1-Math.pow(.002,n)),o.cameraZoom+=(Ee.zoom-o.cameraZoom)*(1-Math.pow(.018,n))}function vd(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=me.lerp(n.x,e.x,a),l=me.lerp(n.z,e.z,a),c=me.lerp(n.y,e.y,a),h=ce(r,l)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function py(n,e){const t=ce(n,e);let i=null;const s=z0(n,e);s&&s.y>t+4&&(i=s);const a=N0(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function ol(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=me.lerp(n.x,e.x,a),l=me.lerp(n.z,e.z,a),c=me.lerp(n.y,e.y,a),h=py(r,l);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function Eh(){const n=o.camYaw+o.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=me.clamp(o.cameraZoom,-.42,.9),s=o.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+o.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};be.position.y+=vd(a,be.position,3.4),be.position.y+=ol(a,be.position,4.2)}let Aa=localStorage.getItem("steel-ribbon-roam-view")==="hood"?"hood":"chase";function my(){Aa=Aa==="chase"?"hood":"chase",localStorage.setItem("steel-ribbon-roam-view",Aa),o.message=Aa==="hood"?"First person":"Third person",o.messageTimer=.9}function q0(){return o.vehicle==="heli"&&he?he.mesh:md()}function xy(n){const e=q0(),t=o.roamYaw+o.camLookYaw*.8,i=Math.sin(t),s=-Math.cos(t),a=o.vehicle==="heli",r=a?2.6:1.42,l=a?1.2:.85;if(e.visible=!1,be.position.set(o.roamPos.x+i*l,o.roamPos.y+r-o.roamSuspension*.4,o.roamPos.z+s*l),o.cameraShake>.01){const h=o.cameraShake*.5;be.position.x+=(Math.random()-.5)*h,be.position.y+=(Math.random()-.5)*h*.6}sn.position.copy(be.position),sn.lookAt(o.roamPos.x+i*30,o.roamPos.y+r+o.camLookPitch*16+(o.roamAir?o.roamVy*.06:0),o.roamPos.z+s*30),sn.rotateY(Math.PI),sn.rotateZ((o.roamAir&&o.stuntActive&&o.airRoll||0)-o.wheelSteer*.05),be.quaternion.slerp(sn.quaternion,1-Math.pow(.001,n));const c=76+Math.min(14,Math.abs(o.speed)*.08);Math.abs(be.fov-c)>.02&&(be.fov+=(c-be.fov)*(1-Math.pow(.01,n)),be.updateProjectionMatrix()),o.cameraShake=Math.max(0,o.cameraShake-n*2.4),o.collisionDrama=Math.max(0,o.collisionDrama-n*1.8)}function Y0(n){if(window.__freeCam)return;if(X0(n),Math.abs(o.speed)>xh){let M=o.roamYaw-o.camYaw;M=Math.atan2(Math.sin(M),Math.cos(M)),o.camYaw+=M*(1-Math.pow(.08,n))}if(Aa==="hood"&&o.vehicle!=="foot"){xy(n);return}const e=q0();e.visible||(e.visible=!0);const t=o.camYaw+o.camLookYaw,i=Math.sin(t),s=-Math.cos(t),a=o.roamPos,r=me.clamp(o.cameraZoom,-.42,.9),l=me.clamp(Math.abs(o.speed)/135,0,1),c=o.vehicle==="foot"?{d:.42,h:.5}:o.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},h=(17+Math.abs(o.speed)*.11+o.roamSlip*3)*(1+r*.72)*c.d,d=(7.2+l*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+o.camLookPitch*5.8)*c.h,u=ad.set(a.x-i*h,a.y+d,a.z-s*h);if(o.cameraShake>.01||o.collisionDrama>.01){const M=o.cameraShake+o.collisionDrama*.42;u.x+=(Math.random()-.5)*M*1.2,u.y+=(Math.random()-.5)*M*.75,u.z+=(Math.random()-.5)*M*1.2}const p=yl.set(a.x+i*(13+l*8-Math.min(r,0)*6),a.y+2.45+o.camLookPitch*13.5,a.z+s*(13+l*8-Math.min(r,0)*6));u.y=Math.max(u.y,ce(u.x,u.z)+3.5),u.y+=vd(p,u,3.4),u.y+=ol(p,u,4.2);const m=o.roamSlip>.35?.006:.0026;be.position.lerp(u,1-Math.pow(m,n)),be.position.y+=ol(p,be.position,3.8)*.72,sn.position.copy(be.position),sn.lookAt(p),sn.rotateY(Math.PI),sn.rotateZ(-o.wheelSteer*l*.18+o.roamSlip*Math.sign(o.wheelSteer||1)*.05),be.quaternion.slerp(sn.quaternion,1-Math.pow(.05,n));const x=69+Math.min(13,Math.abs(o.speed)*.075)+o.roamSlip*2.5+r*10;Math.abs(be.fov-x)>.02&&(be.fov+=(x-be.fov)*(1-Math.pow(.01,n)),be.updateProjectionMatrix()),o.cameraShake=Math.max(0,o.cameraShake-n*2.4),o.collisionDrama=Math.max(0,o.collisionDrama-n*1.8)}function gy(n,e=null){if(o.mode==="result")return;o.mode="result";const t=Math.max(0,Math.round(o.score-o.damage*9+Math.max(0,220-o.time)*45));t>o.best&&(o.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Xe.best.textContent=`Best score ${o.best}`,Xe.resultText.textContent=`${n} Score ${t}. Time ${ll(o.time)}. Damage ${Math.round(o.damage)}%.`;const i=Number.isFinite(o.bestLap)?ll(o.bestLap):"--:--.-";let s="";if(o.seasonRace&&Vt?.active&&e){[{key:"you",metric:o.totalDistance+.001},...Xn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Vt.points[c.key]+=u_[h]??0),Vt.raceIndex++;const r=Vt.raceIndex>=4,l=v0();if(r){Vt.active=!1;const c=l[0].key==="you";c&&Vt.division>1?(localStorage.setItem("steel-ribbon-division",String(Vt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${g0(Vt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${l[0].label} takes the title.</b>`}x0(),s=`<span>Season — after race ${Vt.raceIndex}/4</span>`+l.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,Xe.againBtn.textContent=Vt.active?"Next Race":"Back to Menu"}else Xe.againBtn.textContent="Race Again";Xe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${o.cleanLandings}</b>
    <b>Hard landings: ${o.hardLandings}</b>
    <b>Recoveries: ${o.recoveries}</b>
    <b>Near edges: ${Math.round(o.nearMisses)}</b>
    ${s}
  `,El(),Number.isFinite(o.bestLap)&&o.bestLap>3&&cp("lap",Math.round(1e6/o.bestLap),{time:+o.bestLap.toFixed(2),course:se.name,car:Es[ki]?.label||""}),Xe.result.classList.remove("hidden")}function vc(n="Craned back to the ribbon"){const e=pt(o.lastSafeS);o.s=o.lastSafeS,o.totalDistance=o.lastSafeDistance,o.lateral=0,o.lateralVel=0,o.y=e.p.y+2.1,o.yVel=0,o.speed=Math.max(16,o.speed*.32),o.grounded=!0,o.cameraShake=1.2,o.message=n,o.messageTimer=1.4,o.recoveries+=1}function Md(n,e){return me.clamp(e*n.tangent.y,-48,48)}function vy(n=94){return se.gaps.map(e=>{const t=pt(e.start),i=pt(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=Md(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,l=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(me.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-l)*10)/10}})}function af(n,e){o.grounded=!1,o.yVel=Md(n,o.speed),o.airtime=0,e&&(o.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Md(pt(n),e)},gapJumpReport(n){return vy(n)},sceneryClearanceReport(){return kM()},setSpeed(n){return o.speed=me.clamp(n,-14,156-o.damage*.42),br(),o.speed},setTrackPosition(n,e=o.speed,t=0){const i=pt(n);return o.totalDistance=n,o.s=i.s,o.lastSafeS=i.s,o.lastSafeDistance=n,o.lateral=me.clamp(t,-se.width*.48,se.width*.48),o.lateralVel=0,o.y=i.p.y+2.1,o.yVel=0,o.grounded=!0,o.speed=me.clamp(e,-14,156-o.damage*.42),br(),{s:o.s,totalDistance:o.totalDistance,speed:o.speed,lateral:o.lateral,y:o.y}},setDamage(n){return o.damage=me.clamp(n,0,99),br(),o.damage},setCourse(n){return Zr(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,be.position.set(n,e,t),be.lookAt(i,s,a),be.fov=62,be.updateProjectionMatrix(),"freecam"},listBoostPads(){return Da.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return Qs.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+Ys(n,e).depth.toFixed(3),ground:+ce(n,e).toFixed(2)}},activeGate(){const n=$t[o.objectiveIndex%$t.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Vt,division:$r(),position:_d(),seasonRace:!!o.seasonRace,rivals:Xn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Vt=null,El(),"reset"},renderInfo(){return{calls:Me.renderCalls||0,triangles:Me.renderTris||0,geometries:tn.info.memory.geometries,textures:tn.info.memory.textures,mobilePerf:_l,staticMerge:Me.staticMerge||null}},drawAudit(n=20){const e=new Map;return Te.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=En[0]?.actor?.mesh;return{colliders:En.length,wheels:n?.userData?.wheels?.length??0,pedestrians:Me.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of En){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Ae?{state:Ae.ctx.state,master:+Ae.master.gain.value.toFixed(2),engine:!!Ae.rumble&&!!Ae.growl&&!!Ae.whine,fx:!!Ae.wind&&!!Ae.skid&&!!Ae.boost,music:!!Ae.musicGain,beat:Ae.beat,samples:Object.keys(Zn.buffers).length,sampleLoops:Object.keys(Zn.loops),musicSample:!!Zn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:D0(),engineV2:!!Ae.growlB&&!!Ae.burble}:null},colliderAudit(){const n=[],e=[],t=Be.streetW*.5;for(let a=Be.x0;a<=Be.x1+1;a+=Be.pitch)n.push(Math.round(a));for(let a=Be.zNear;a>=Be.zFar-1;a-=Be.pitch)e.push(Math.round(a));const i=[],s=(a,r,l)=>{const c=l.radius!=null?l.radius:l.hw??0,h=l.radius!=null?l.radius:l.hd??0,d=ce(l.x,l.z);if(!(l.maxY!=null&&l.maxY<d+1.05)){for(const u of n)Math.abs(l.x-u)<t+c+Dn&&l.z<Be.zNear+h&&l.z>Be.zFar-h&&i.push({arr:a,idx:r,kind:l.kind??"box",x:+l.x.toFixed(1),z:+l.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${u}`,overlap:+(t+c+Dn-Math.abs(l.x-u)).toFixed(1)});for(const u of e)Math.abs(l.z-u)<t+h+Dn&&l.x<Be.x1+c&&l.x>Be.x0-c&&i.push({arr:a,idx:r,kind:l.kind??"box",x:+l.x.toFixed(1),z:+l.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${u}`,overlap:+(t+h+Dn-Math.abs(l.z-u)).toFixed(1)})}};return hn.forEach((a,r)=>s("Mn",r,a)),xi.forEach((a,r)=>s("Di",r,a)),ni.forEach((a,r)=>s("$n",r,a)),{total:hn.length+xi.length+ni.length,blockers:i}},setVehicle(n){return o.mode!=="roam"&&rl(),n==="foot"?o.vehicle==="car"?wh(!0):o.vehicle==="heli"&&Th():n==="heli"&&he?(o.vehicle==="car"&&wh(!0),o.roamPos.set(he.pos.x+3,ce(he.pos.x+3,he.pos.z),he.pos.z),V0()):n==="car"&&(o.vehicle==="heli"&&(he.pos.y=ce(he.pos.x,he.pos.z)+1.1,he.vel.set(0,0,0),Th()),o.vehicle==="foot"&&(o.roamPos.copy(Bi),Sh())),o.vehicle},vehicleInfo(){return{vehicle:o.vehicle||"car",walkerVisible:on.visible,heli:he?{x:+he.pos.x.toFixed(1),y:+he.pos.y.toFixed(1),z:+he.pos.z.toFixed(1),rpm:+he.rpm.toFixed(2),scale:+he.mesh.scale.x.toFixed(2),pad:he.pad?{x:+he.pad.x.toFixed(1),z:+he.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Bi.x.toFixed(1),z:+Bi.z.toFixed(1)},drivingStolen:!!o.drivingStolen,stolen:st?{type:st.type,fromTraffic:!!st.actor,pos:{x:+st.mesh.position.x.toFixed(1),y:+st.mesh.position.y.toFixed(2),z:+st.mesh.position.z.toFixed(1)},visible:st.mesh.visible,inScene:st.mesh.parent===Te,parked:st.parked?{x:+st.parked.x.toFixed(1),z:+st.parked.z.toFixed(1)}:null}:null,parkedSpots:vn.spots.length}},stealNearest(){return o.mode==="roam"&&o.vehicle==="foot"?B0():!1},setHeat(n){return o.mode==="roam"&&(o.heat=me.clamp(n,0,5)),o.heat||0},policeInfo(){return{heat:+(o.heat||0).toFixed(2),cars:lt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),evadeT:+lt.evadeT.toFixed(1),bustT:+lt.bustT.toFixed(2),blocks:lt.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:Me.busts||0}},policeTeleportNearest(n,e){const t=lt.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ze.state,type:Ze.type,timeLeft:+Ze.timeLeft.toFixed(1),pickup:Ze.pickup?{x:+Ze.pickup.x.toFixed(1),z:+Ze.pickup.z.toFixed(1)}:null,dest:Ze.dest?{x:+Ze.dest.x.toFixed(1),z:+Ze.dest.z.toFixed(1)}:null,deliveries:Me.deliveries||0,fails:Me.deliveryFails||0}},jobSpawnNow(){return Ze.state==="idle"&&(Ze.cooldown=0,A0()),Ze.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==ri&&(wd(),localStorage.setItem("steel-ribbon-weather",ri)),ri},weatherInfo(){return{mode:ri,amt:+Va().toFixed(2),roadRoughness:+(pn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of En)e.actor?.panicT>0&&n++;return n},mpInfo(){return{connected:xt.connected,room:xt.room,id:xt.id,peers:[...xt.peers.values()].map(n=>({name:n.name,has:n.has,x:+(n.tx||0).toFixed(1),z:+(n.tz||0).toFixed(1)}))}},mpJoin(n,e){const t=document.querySelector("#mpRoom"),i=document.querySelector("#mpName");return t&&(t.value=n),i&&(i.value=e),fp(),xt.room},mpLeave(){return ul(!0),!xt.connected},boardsInfo(){return lp(Wr).then(n=>({mode:Wr,rows:n?n.length:null,ok:n!==null}))},gamepadInfo(){return{active:Bn.active}},setTod(n){return Sr.includes(n)&&(Hn=n,localStorage.setItem("steel-ribbon-tod",n),Sd()),Hn},todInfo(){return{mode:Hn,day:+qo.toFixed(3),night:+Yo.toFixed(3)}},listStuntRamps(){return(Ci||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of vn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return o.mode!=="roam"&&rl(),o.roamPos.set(n,ce(n,e)+Fn,e),o.roamYaw=t,o.camYaw=t,o.speed=i,jn(),{x:o.roamPos.x,y:+o.roamPos.y.toFixed(2),z:o.roamPos.z}},sceneryCounters(){return{...Ms,boostPads:Da.length,gapBeacons:zr.length,railRuns:Me.railRuns||0,railPosts:Me.railPosts||0,ponds:Qs.length,cityPonds:Me.ponds||0,cloudSprites:Me.cloudSprites||0,helipad:Me.helipad||null,stuntRamps:Me.stuntRamps||0,propPlanes:Me.propPlanes||0}},stats(){return{trafficCrashes:Me.trafficCrashes,splats:Me.splats,roamPos:{x:+o.roamPos.x.toFixed(1),y:+o.roamPos.y.toFixed(1),z:+o.roamPos.z.toFixed(1)},speed:+o.speed.toFixed(2),cooldown:+o.collisionCooldown.toFixed(2)}},detailReport(){return{plates:Pi.mesh?{atlasSlots:64,traffic:Pi.dynamics.length,parked:Pi.statics.length,uniqueTexts:new Set(Pi.texts).size,sample:Pi.texts.slice(0,5)}:null}},viewInfo(){const n=pt(o.s),e=o.y-2.1;return{trackView:Mi,mode:o.mode,carVisible:Ot.visible,cockpitVisible:!!(ln&&ln.visible),camY:+be.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+o.y.toFixed(2),ghostRecLen:o.ghostRec?.length??-1,ghostLoaded:!!Ii,overheadY:+Ah(be.position.x,be.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return Mi=n==="cockpit"?"cockpit":"chase",Hi(),Mi},listCourses(){return js.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:ws,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Ex(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=be;const i=t.intersectObjects(Te.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=Hs(n,e,400);return{x:n,z:e,ground:+ce(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return ta.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],l=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+l.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return hn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return ni.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=ni.filter(e=>e.hw);return{supports:gh,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of hn){const i=Os(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:hn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of hn){const i=Ln(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:hn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return xi.concat(ni.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:Me.traffic,pedestrians:Me.pedestrians,pedestriansActive:Fr.filter(e=>e.active).length,turns:Me.turns,splats:Me.splats,trafficCrashes:Me.trafficCrashes,streetLights:Me.streetLights,trafficLights:Me.trafficLights,stopSigns:Me.stopSigns,signs:Me.signs,roadDetails:{...Me.roadDetails},buildingArchetypes:{...Me.buildingArchetypes},zones:{...Me.zones},openerProps:Me.openerProps,signSamples:al.slice(0,n),types:{...Me.types},offRoadTraffic:En.filter(e=>!bl(e.x,e.z,2)).length,trafficRoutes:vh.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:En.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Fr.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...Me.roadDetails},e={...Me.buildingArchetypes},t={...Me.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,Me.signs/7)+Math.min(14,Me.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:Me.openerProps,signs:Me.signs,streetLights:Me.streetLights,streetGlowSprites:Ms.streetGlowSprites,waterBlockers:Ms.waterBlockers,lowFogDisks:Ms.lowFogDisks}},objectiveReport(){const n=$t[o.objectiveIndex%Math.max(1,$t.length)];return{total:$t.length,hits:o.objectiveHits,index:o.objectiveIndex,lap:o.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:$t.filter(e=>e.collected).length,score:Math.round(o.score),boost:+o.boost.toFixed(2)}},drivingFeelReport(){return{speed:+o.speed.toFixed(2),wheelSteer:+(o.wheelSteer||0).toFixed(3),slip:+(o.roamSlip||0).toFixed(3),suspension:+(o.roamSuspension||0).toFixed(3),cameraShake:+(o.cameraShake||0).toFixed(3),collisionDrama:+(o.collisionDrama||0).toFixed(3),collisionHits:o.collisionHits,smokeActive:Mr.filter(n=>n.life>0).length,debrisActive:_r.filter(n=>n.life>0).length,sparksActive:vr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Ot.userData.detailReport},racer:{...h_.userData.detailReport},namedParts:Ot.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);d0(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=pt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=ce(i,s);o.mode="roam",o.practice=!0,o.freeRun=!1,o.roamPos.set(i,r+Fn,s),o.roamYaw=a,o.camYaw=a,o.camLookYaw=0,o.camLookPitch=0,o.cameraZoom=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,o.wheelSteer=0,o.speed=0,jn();const l=Math.sin(o.roamYaw),c=-Math.cos(o.roamYaw);return be.position.set(o.roamPos.x-l*17,o.roamPos.y+7.2,o.roamPos.z-c*17),Eh(),be.lookAt(o.roamPos.x+l*13,o.roamPos.y+2.45,o.roamPos.z+c*13),be.fov=69,be.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-o.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Hs(n,e,o.roamPos.y);o.roamPos.set(n,i.y+Fn,e),o.roamYaw=t,o.camYaw=t,o.camLookYaw=0,o.camLookPitch=0,o.wheelSteer=0,o.speed=0,jn();const s=Math.sin(o.roamYaw),a=-Math.cos(o.roamYaw);return be.position.set(o.roamPos.x-s*17,o.roamPos.y+7.2,o.roamPos.z-a*17),Eh(),be.lookAt(o.roamPos.x+s*13,o.roamPos.y+2.45,o.roamPos.z+a*13),be.fov=69,be.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ee.zoom,i=30){Ee.lookX=me.clamp(n,-1,1),Ee.lookY=me.clamp(e,-1,1),Ee.zoom=me.clamp(t,-.42,.9);for(let s=0;s<i;s++)o.mode==="roam"?Y0(1/60):yd(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(o.mode!=="roam")return this.roamReport();const s={steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake};Ee.steer=me.clamp(e,-1,1),Ee.throttle=me.clamp(t,0,1),Ee.brake=me.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const l=Math.min(a,r);if(O0(l),o.mode!=="roam")break;r-=l}return Ee.steer=s.steer,Ee.throttle=s.throttle,Ee.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(o.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if($0(i),o.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=o.roamPos,e=ad.set(0,0,-1).applyQuaternion(Ot.quaternion).normalize(),t=yl.set(Math.sin(o.roamYaw),0,-Math.cos(o.roamYaw)).normalize(),i=Hs(n.x,n.z,n.y);return{mode:o.mode,s:+o.s.toFixed(2),totalDistance:+o.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+o.roamYaw.toFixed(3),camYaw:+o.camYaw.toFixed(3),speed:+o.speed.toFixed(2),groundXZ:+ce(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+be.position.x.toFixed(2),camY:+be.position.y.toFixed(2),camZ:+be.position.z.toFixed(2),fov:+be.fov.toFixed(2),lookYaw:+o.camLookYaw.toFixed(3),lookPitch:+o.camLookPitch.toFixed(3),cameraZoom:+o.cameraZoom.toFixed(3),cameraSightLift:+vd({x:n.x,y:n.y+2.6,z:n.z},{x:be.position.x,y:be.position.y,z:be.position.z},2.4).toFixed(3),elevatedCameraLift:+ol({x:n.x,y:n.y+2.6,z:n.z},{x:be.position.x,y:be.position.y,z:be.position.z},3.8).toFixed(3),colliders:hn.length+ni.length+xi.length+En.length,insideBuilding:hn.concat(ni,xi,En).some(s=>dy(n,s)),objectiveHits:o.objectiveHits,objectiveIndex:o.objectiveIndex,collisionHits:o.collisionHits,slip:+(o.roamSlip||0).toFixed(3),suspension:+(o.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Ot.userData.frontWheels?+Ot.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function $0(n){if(o.mode!=="race")return;o.time+=n,o.freeRun&&(o.damage=0);const e=o.breakdownTimer>0;e&&(o.breakdownTimer-=n,o.breakdownTimer<=0&&(o.damage=55,o.message="Patched up — back on it",o.messageTimer=1.2));const t=Math.max(Je.has("KeyW")||Je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(Je.has("KeyS")||Je.has("ArrowDown")?1:0,Ee.brake),s=me.clamp((Je.has("KeyD")||Je.has("ArrowRight")?1:0)-(Je.has("KeyA")||Je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*s0,a=t>.03&&!e,r=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&o.boost>.02&&a&&o.grounded,l=pt(o.s),c=l.p.y+2.1,h=Math.abs(o.speed);if(a){const v=o.speed<0?40:0;o.speed+=((r?68:40)*_s().accel+v)*t*n}if(i>.03){const v=o.speed>1.2?70:26;o.speed-=v*i*n}const d=o.grounded?.0024:.0011;o.speed-=d*o.speed*h*n,h>.08?o.speed-=Math.sign(o.speed)*(o.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(o.speed=0),o.speed=me.clamp(o.speed,-16,156*_s().top-o.damage*.8),e&&(o.speed=Math.min(o.speed,14)),o.boosting=r,r?(o.boost=Math.max(0,o.boost-n*.21),o.score+=28*n):o.boost=Math.min(1,o.boost+n*(o.grounded?.045:.018)*_s().boostRegen);const u=Je.has("Space")&&o.grounded,p=(16+h*.13)*(u?1.45:1)*_s().grip;o.lateralVel-=s*p*n,o.lateralVel-=o.lateralVel*(o.grounded?u?2.2:4.1:.7)*n,o.lateral+=o.lateralVel*n;const m=Oi(o.s),x=Math.abs(o.lateral)<se.width*.52,M=!m&&x;if(o.grounded&&(!M||Math.abs(o.lateral)>se.width*.5)&&af(l,x?"":"Edge slip"),o.grounded){const v=Math.sin(o.time*18)*Math.min(.22,Math.abs(o.speed)/700);o.y=me.lerp(o.y,c+v,.5),o.yVel=0,o.lastSafeS=o.s,o.lastSafeDistance=o.totalDistance,o.score+=Math.max(0,o.speed)*n*.34,Math.abs(o.lateral)>se.width*.42&&(o.damage+=n*(1.2+Math.abs(o.speed)*.035),o.cameraShake=Math.max(o.cameraShake,.24),o.nearMisses+=n*.8,Math.random()<n*5&&$s(l.p.clone().addScaledVector(l.side,Math.sign(o.lateral)*se.width*.55).addScaledVector(Qt,1.2),4))}else{o.yVel-=31*n,o.y+=o.yVel*n,o.airtime+=n,o.score+=n*11;const v=pt(o.s),_=v.p.y+2.1;if(!Oi(o.s)&&Math.abs(o.lateral)<se.width*.55&&o.y<=_&&o.yVel<0){const E=-o.yVel,T=Math.abs(o.lateral)<se.width*.34&&E<30,C=Math.round(T?260+o.airtime*85:Math.max(30,120-E));o.y=_,o.grounded=!0,o.yVel=0,o.lastSafeS=o.s,o.lastSafeDistance=o.totalDistance,o.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(o.lateral)-se.width*.36)*1.8,o.score+=C,o.cameraShake=Math.max(o.cameraShake,E/34),o.message=T?"Clean landing":"Hard landing",o.messageTimer=.9,T?o.cleanLandings+=1:o.hardLandings+=1,Ni(`+${C} ${T?"CLEAN AIR":"LANDED"}`,T),T&&Tn(990,.14),Ia(E),$s(v.p.clone().addScaledVector(v.side,o.lateral).addScaledVector(Qt,.7),T?7:24),o.airtime=0}if(o.practice||o.freeRun){if(!o.grounded&&o.yVel<-6){const E=pt(o.s),T=E.p.x+E.side.x*o.lateral,C=E.p.z+E.side.z*o.lateral,R=ce(T,C);o.y<=R+1.3&&K_(T,C,E)}o.y<-55&&(o.damage+=28,vc("Track crew recovery"))}else o.y<-55&&(o.damage+=28,vc("Track crew recovery"))}const g=o.totalDistance;o.totalDistance+=o.speed*n,o.s=(o.totalDistance%se.length+se.length)%se.length,Sy();const f=ta.find(v=>v.rampType==="off");if(o.freeRun&&f&&hc(g,o.totalDistance,f.exitS)&&o.lateral*f.dirSel>se.width*.2&&J_(f))return;const y=Math.floor(o.totalDistance/se.length)+1;if(y>o.lap){const v=o.time-o.lapStartTime;wy(v),o.ghostRec=[],o.splitTimes.push(v),o.bestLap=Math.min(o.bestLap,v),o.lapStartTime=o.time,o.lap=y,o.score+=1200,Ni("+1200 LAP",!0),o.message=o.practice?`Lap ${o.lap}`:o.lap<=se.laps?`Lap ${o.lap}`:"Season race complete",o.messageTimer=1.4,!o.practice&&o.lap>se.laps&&(()=>{const _=_d();gy(_===1?"You took the chequered gantry.":`You finished P${_}.`,_)})()}for(const v of se.gaps)hc(g,o.totalDistance,v.start)&&(o.message=v.name,o.messageTimer=1.1,o.grounded&&af(pt(v.start),v.name));if(o.grounded){for(const v of Da)if(hc(g,o.totalDistance,v.s)&&Math.abs(o.lateral-v.lat)<3.4){const _=pt(v.s);o.boost=Math.min(1,o.boost+.45),o.speed=Math.min(o.speed+9,156-o.damage*.8),o.score+=90,o.cameraShake=Math.max(o.cameraShake,.16),o.message="BOOST PAD",o.messageTimer=.8,Ni("+90 BOOST"),Tn(640,.22,"sawtooth",.1),$s(_.p.clone().addScaledVector(_.side,v.lat).addScaledVector(Qt,1),10),Ia(14);break}}o.damage=me.clamp(o.damage,0,100),!o.freeRun&&o.damage>=90&&o.breakdownTimer<=0&&(o.breakdownTimer=2.6,o.message="Chassis cracked — limping to repair",o.messageTimer=1.6,o.cameraShake=Math.max(o.cameraShake,.8),Ia(40),o.damage=90),Je.has("KeyR")&&(o.damage=Math.min(99,o.damage+8),vc("Manual reset"),Je.delete("KeyR"))}function rf(n){const e=se.length*se.laps,t=1+.07*(4-$r());for(const i of Xn){if(o.mode==="race"&&!o.practice){const c=o.totalDistance-i.distance,h=me.clamp(c*.055,-11,15),d=Math.sin(o.time*i.waveFreq+i.phase)*i.wave;let u=i.base+d+h;i.key==="bishop"&&(u+=11*Math.exp(-o.time/22)),i.key==="maddock"&&(u+=10*me.clamp(i.distance/Math.max(1,e),0,1)),i.speed=me.clamp(u*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=o.time,o.message=`${i.label} takes the flag`,o.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=pt(i.s),a=Math.abs(i.distance-o.totalDistance);let r=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(o.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);r=me.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(Qt,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new _t().makeBasis(s.side,Qt,s.tangent));const l=a<26&&Mi==="cockpit";i.mesh.visible=(o.mode==="race"||o.mode==="paused"||o.mode==="result")&&!o.practice&&!l}o.rivalDistance=Math.max(...Xn.map(i=>i.distance)),o.rivalS=(o.rivalDistance%se.length+se.length)%se.length}function _d(){return o.practice?1:1+Xn.filter(n=>n.distance>o.totalDistance).length}function My(n,e){const t=e.side.clone().multiplyScalar(o.lateral),i=e.p.clone().add(t);i.y=o.y;const s=o.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),be.position.copy(i);const a=Math.abs(o.speed),r=68+Math.min(10,a*.055)+(o.boosting?3:0)+o.cameraZoom*12;Math.abs(be.fov-r)>.02&&(be.fov+=(r-be.fov)*(1-Math.pow(.004,n)),be.updateProjectionMatrix());const l=pt(o.s+34+o.speed*.16),c=l.p.clone().addScaledVector(l.side,o.lateral*.45);c.y+=1.7+o.camLookPitch*12+Math.sin(o.time*8)*Math.min(.2,a/680),sn.position.copy(be.position),sn.lookAt(c),sn.rotateY(Math.PI),sn.rotateY(-o.camLookYaw),sn.rotateZ(-e.bank*.72-o.lateralVel*.006),sn.rotateX(e.grade*.18+(o.grounded?0:me.clamp(o.yVel,-30,30)*-.006)),be.quaternion.slerp(sn.quaternion,1-Math.pow(8e-4,n))}function Ah(n,e,t,i){let s=1/0;const a=se.width*.5+2.2;for(const r of wl()){if(r.courseIndex!==ws||r.y<t||r.y>i||r.y>=s)continue;const l=n-r.x,c=e-r.z;l*l+c*c<a*a&&(s=r.y)}return s}function _y(n,e){const t=Math.abs(o.speed),i=o.y-2.1;let s=12.8+t*.05+me.clamp(o.cameraZoom,-.42,.9)*8,a=4.6+t*.014+o.camLookPitch*10,r=pt(o.s-s),l=Ah(r.p.x,r.p.z,i+5,i+64);l-1.5<r.p.y+2&&(s=6.4,a=2.7,r=pt(o.s-s),l=Ah(r.p.x,r.p.z,i+5,i+64));let c=me.lerp(r.p.y,i,.62)+a;const h=sd.set(r.p.x+r.side.x*o.lateral*.72,0,r.p.z+r.side.z*o.lateral*.72);if(c=Math.max(c,r.p.y+2.35,ce(h.x,h.z)+2.8),l<1/0&&(c=Math.min(c,l-1.5)),h.y=c,o.cameraShake>.01){const m=o.cameraShake;h.x+=(Math.random()-.5)*m*1.1,h.y+=(Math.random()-.5)*m*.6,h.z+=(Math.random()-.5)*m*1.1}be.position.distanceTo(h)>70&&be.position.copy(h),be.position.lerp(h,1-Math.pow(2e-4,n)),be.position.y=Math.max(be.position.y,r.p.y+2.05),l<1/0&&(be.position.y=Math.min(be.position.y,l-1.4));const d=pt(o.s+17+t*.09),u=d.p.clone().addScaledVector(d.side,o.lateral*.55);u.y+=2.1+o.camLookPitch*12,o.grounded||(u.y=me.lerp(u.y,o.y+1.2,.5)),sn.position.copy(be.position),sn.lookAt(u),sn.rotateY(Math.PI),sn.rotateY(-o.camLookYaw),sn.rotateZ(-e.bank*.42-o.lateralVel*.0034),be.quaternion.slerp(sn.quaternion,1-Math.pow(4e-4,n));const p=66+Math.min(11,t*.055)+(o.boosting?5:0)+me.clamp(o.cameraZoom,-.42,.9)*10;Math.abs(be.fov-p)>.02&&(be.fov+=(p-be.fov)*(1-Math.pow(.004,n)),be.updateProjectionMatrix())}let gi=null,Ii=null,ji=0;function yy(){try{Ii=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+ws)||"null")}catch{Ii=null}ji=0}function by(){gi&&Ea(gi),gi=Es[ki].build(),gi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),gi.visible=!1}function wy(n){if(!(o.practice||o.freeRun)||!o.ghostRec||o.ghostRec.length<12||Ii&&n>=Ii.time)return;const e=Math.max(1,Math.floor(o.ghostRec.length/700)),t=o.ghostRec.filter((i,s)=>s%e===0);Ii={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+ws,JSON.stringify(Ii))}catch{}o.message=`Ghost saved — ${ll(n)}`,o.messageTimer=1.3,ji=0}function Sy(){if(o.mode!=="race")return;o.ghostRec||(o.ghostRec=[]);const n=o.time-o.lapStartTime,e=o.ghostRec[o.ghostRec.length-1];(!e||n-e[0]>.08)&&o.ghostRec.length<4e3&&o.ghostRec.push([+n.toFixed(2),+o.s.toFixed(1),+o.lateral.toFixed(2),+o.y.toFixed(2)])}function Ty(){if(!gi)return;const n=o.mode==="race"&&(o.practice||o.freeRun)&&Ii?.samples?.length>2&&!window.__freeCam;if(gi.visible=n,!n)return;const e=(o.time-o.lapStartTime)%Math.max(.01,Ii.time),t=Ii.samples;for(e<(t[ji]?.[0]??0)&&(ji=0);ji<t.length-2&&t[ji+1][0]<e;)ji++;const i=t[ji],s=t[Math.min(ji+1,t.length-1)],a=me.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=me.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:a),l=me.lerp(i[2],s[2],a),c=me.lerp(i[3],s[3],a),h=pt((r%se.length+se.length)%se.length);gi.position.set(h.p.x+h.side.x*l,c-.72,h.p.z+h.side.z*l),gi.quaternion.setFromRotationMatrix(new _t().makeBasis(h.side,Qt,h.tangent))}function Ey(){const n=o.mode==="race"||o.mode==="paused"||o.mode==="result",e=n&&Mi==="chase"&&!window.__freeCam;if(ln&&(ln.visible=!e),Ot.visible!==e&&(Ot.visible=e),!e)return;const t=pt(o.s);Ot.position.set(t.p.x+t.side.x*o.lateral,o.y-.72,t.p.z+t.side.z*o.lateral);const i=new _t().makeBasis(t.side,Qt,t.tangent);Ot.quaternion.setFromRotationMatrix(i),o.grounded?(Ot.rotateX(-t.grade*.5),Ot.rotateZ(t.bank*.6+me.clamp(o.lateralVel*.012,-.16,.16))):Ot.rotateX(me.clamp(-o.yVel*.011,-.34,.4));const s=Ot.userData.frontWheels,a=me.clamp(-o.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let No=.6;function Ay(n){if(window.__freeCam)return;No+=n*.13;const e=80,t=300,i=ce(e,t);Ot.visible=!0,ln&&(ln.visible=!1),Ot.position.set(e,i+.85,t),Ot.quaternion.setFromAxisAngle(Qt,Math.PI*.24);const s=16.5;be.position.set(e+Math.cos(No)*s,i+5.3+Math.sin(No*.57)*1.1,t+Math.sin(No)*s),be.lookAt(e,i+1.5,t),be.rotateY(.3),Math.abs(be.fov-58)>.1&&(be.fov=58,be.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=o.mode)}function yd(n){if(window.__freeCam)return;X0(n);const e=pt(o.s);Mi==="chase"&&o.mode!=="menu"?_y(n,e):My(n,e),o.cameraShake=Math.max(0,o.cameraShake-n*1.9);const t=yl.set(0,0,-1).applyQuaternion(be.quaternion).normalize();window.__steelRibbonTelemetry={mode:o.mode,s:o.s,totalDistance:o.totalDistance,rivalDistance:o.rivalDistance,speed:o.speed,lap:o.lap,score:o.score,damage:o.damage,y:o.y,yVel:o.yVel,grounded:o.grounded,input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const Xs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},lr=[28,54,82,110,134,156];function Cy(){const n=Math.abs(o.speed);let e=1;for(let l=0;l<lr.length;l++)n>lr[l]&&(e=l+2);e=Math.min(e,lr.length);const t=e===1?0:lr[e-2],i=lr[e-1],s=i>t?me.clamp((n-t)/(i-t),0,1):0,a=e===1?Xs.idle:Xs.postShift;let r=a+s*(Xs.shift-a);return n<.4&&(r=Xs.idle),{gear:e,rpm:r}}let of=performance.now(),Mc=0,_c=0;function Z0(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,l=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:l,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function Ry(n,e){const t=Xe.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:l,at:c}=Z0(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,l(1),l(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=l(M),f=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=f?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(f?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),f){const _=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),_[0],_[1])}}const d=me.clamp(n/h,0,1),u=l(d),p=c(u,r-r*.06),m=c(u+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(m[0],m[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function Py(n,e){const t=Xe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:l,at:c}=Z0(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,l(1),l(0)),i.stroke();const d=me.clamp(n,0,1),u=n<.25;i.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,l(d),l(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,f=l(g),y=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(f,r-r*.02),_=c(f,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(_[0],_[1]),i.stroke(),y){const E=c(f,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const p=l(d),m=c(p,r-r*.06),x=c(p+Math.PI,r*.14);i.strokeStyle=u?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function Ly(n,e){const t=Xe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const l=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=Xs.max,u=v=>Math.PI-v*Math.PI,p=(v,_)=>[l+Math.cos(v)*_,c-Math.sin(v)*_];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(l,c,h,u(1),u(0)),i.stroke();const m=Xs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(l,c,h,u(1),u(m)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const _=v/9,E=u(_),T=v*1e3>=Xs.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const C=p(E,h-h*.02),R=p(E,h-h*.18);i.beginPath(),i.moveTo(C[0],C[1]),i.lineTo(R[0],R[1]),i.stroke();const S=p(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),S[0],S[1]),v<9){const b=u((v+.5)/9),L=p(b,h-h*.02),I=p(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(I[0],I[1]),i.stroke()}}const x=me.clamp(n/d,0,1),M=u(x),g=p(M,h-h*.06),f=p(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(f[0],f[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(l,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",l,c-h*.26);const y=o.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,l,c+h*.02)}function br(){se.length*se.laps;const n=Vu(o.practice?o.totalDistance%se.length:o.totalDistance),e=o.practice?"SOLO":`P${_d()}`;e!==o.leadState&&o.mode==="race"&&(o.leadState=e,o.practice||(o.message=e==="P1"?"You took the lead":`Now ${e}`,o.messageTimer=.95)),Xe.damage.style.width=`${Math.round(o.damage)}%`,Xe.lap.textContent=o.practice?`LAP ${o.lap}`:`${Math.min(o.lap,se.laps)}/${se.laps}`,Xe.timer.textContent=ll(o.time);const t=o.mode==="roam",i=t&&o.driftCombo>0&&o.driftComboT>0?`  ·  DRIFT ×${Math.min(5,o.driftCombo+1)}`:"";Xe.score.textContent=t?`Gates ${o.objectiveHits}/${$t.length}  Score ${Math.round(o.score)}${i}`:`Score ${Math.round(o.score)}`;const s=o.mode==="race"||o.mode==="paused"||t;if(Xe.position.textContent=t?o.vehicle==="foot"?"ON FOOT":o.vehicle==="heli"?"HELICOPTER":o.drivingStolen&&st?`${st.type.toUpperCase()} · STOLEN`:"FREE ROAM":o.freeRun?"FREE RUN":o.practice?"PRACTICE":`${e} DIV ${$r()}`,t&&$t.length){const d=$t[o.objectiveIndex%$t.length];Xe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(o.heat||0)>=1&&(Xe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(o.heat)))}`),t&&Ze.state==="active"&&(Xe.trackName.textContent=`Deliver the ${Ze.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ze.timeLeft))}s`),Xe.hud.style.display=s?"flex":"none",Xe.raceStrip.style.display=o.mode==="race"||o.mode==="paused"?"grid":"none",Xe.touchControls.style.display=s?"":"none",Xe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of Xn)d.progEl&&(d.progEl.style.width=`${Math.round((o.practice?0:Vu(d.distance))*100)}%`);const a=Cy();o.gear=a.gear;const r=performance.now(),l=Math.min(.05,(r-of)/1e3);of=r;const c=1-Math.exp(-l*(a.rpm>o.tachRpm?10:6));o.tachRpm+=(a.rpm-o.tachRpm)*c,Ly(o.tachRpm,a.gear);const h=Math.abs(o.speed)*2.25;Mc+=(h-Mc)*(1-Math.exp(-l*8)),_c+=(o.boost-_c)*(1-Math.exp(-l*9)),Ry(Mc,o.speed<-.5),Py(_c,o.boosting),Xe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(o.speed)-44)/150)),Xe.damageFx.style.opacity=o.damage<18?0:Math.min(.72,(o.damage-18)/82),o.mode==="paused"?(Xe.centerMessage.textContent="Paused",Xe.centerMessage.classList.remove("hidden")):o.messageTimer>0?(Xe.centerMessage.textContent=o.message,Xe.centerMessage.classList.remove("hidden")):Xe.centerMessage.classList.add("hidden")}function ll(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}const Bn={active:!1,prev:{}};function Dy(){let n=null;if(navigator.getGamepads){for(const d of navigator.getGamepads())if(d&&d.connected){n=d;break}}if(!n){if(Bn.active){Bn.active=!1,Ee.steer=0,Ee.throttle=0,Ee.brake=0;for(const d of["Space","ShiftLeft"])Bn.prev[d]&&(Je.delete(d),Bn.prev[d]=!1)}return}const e=d=>Math.abs(d)<.14?0:d,t=e(n.axes[0]||0),i=Math.max(n.buttons[7]?.value||0,n.buttons[0]?.pressed?1:0),s=Math.max(n.buttons[6]?.value||0,n.buttons[1]?.pressed?1:0),a=!!n.buttons[2]?.pressed,r=!!n.buttons[3]?.pressed,l=!!n.buttons[5]?.pressed,c=!!n.buttons[9]?.pressed;if(!Bn.active&&!t&&!i&&!s&&!a&&!r&&!l&&!c)return;Bn.active||is(),Bn.active=!0,Ee.steer=t,Ee.throttle=i,Ee.brake=s;const h=(d,u)=>{u&&!Bn.prev[d]?Je.add(d):!u&&Bn.prev[d]&&Je.delete(d),Bn.prev[d]=u};h("Space",a),h("ShiftLeft",l),r&&!Bn.prev.actB&&o.mode==="roam"&&gd(),Bn.prev.actB=r,c&&!Bn.prev.startB&&window.dispatchEvent(new KeyboardEvent("keydown",{code:o.mode==="race"||o.mode==="paused"?"KeyP":"Escape"})),Bn.prev.startB=c}function K0(){tn.info.reset(),Dy();const n=wM.getDelta();let e=Math.min(.033,n);o.sloMoT>0&&(o.sloMoT=Math.max(0,o.sloMoT-e),e*=.42),o.messageTimer>0&&(o.messageTimer-=e),o.mode==="roam"?(o.vehicle==="foot"?ay(e):o.vehicle==="heli"?ry(e):O0(e),Y0(e),j_()):o.mode==="menu"?(rf(e),Ay(e)):($0(e),rf(e),Ey(),Ty(),yd(e)),ty(),ey(),pi&&pi.position.copy(be.position),$_(e),d0(e),br(),Z_(),ur.uniforms.uTime.value+=e,l0.forEach(i=>i.uniforms.uTime.value+=e),ur.uniforms.uSpeed.value=Math.min(1,Math.abs(o.speed)/150);const t=(Je.has("ShiftLeft")||Je.has("ShiftRight"))&&o.boost>.02&&(o.mode==="race"||o.mode==="roam")?1:Math.min(.75,o.roamSlip*.55+o.collisionDrama*.6);ur.uniforms.uBoost.value+=(t-ur.uniforms.uBoost.value)*Math.min(1,e*6),qa.render(),Me.renderCalls=tn.info.render.calls,Me.renderTris=tn.info.render.triangles,requestAnimationFrame(K0)}window.addEventListener("keydown",n=>{Je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(o.mode==="race"||o.mode==="paused"?TM():o.mode==="roam"&&o.vehicle!=="foot"&&my()),n.code==="KeyE"&&gd(),n.code==="KeyN"&&rp(),n.code==="KeyV"&&wd(),n.code==="KeyP"&&o.mode==="race"?(o.mode="paused",Je.clear(),Vr()):n.code==="KeyP"&&o.mode==="paused"?o.mode="race":n.code==="Escape"&&(o.mode==="race"||o.mode==="paused"||o.mode==="roam")&&(o.mode="menu",Vr(),Ot.visible=!1,ln&&(ln.visible=!0),document.body.classList.remove("roam-mode"),Hi(),Xe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>Je.delete(n.code));window.addEventListener("resize",()=>{be.aspect=window.innerWidth/window.innerHeight,be.updateProjectionMatrix(),tn.setSize(window.innerWidth,window.innerHeight),qa.setSize(window.innerWidth,window.innerHeight),R0.setSize(window.innerWidth,window.innerHeight)});const cl=()=>{is(),window.removeEventListener("pointerdown",cl),window.removeEventListener("keydown",cl)};window.addEventListener("pointerdown",cl);window.addEventListener("keydown",cl);const kr=document.createElement("button");kr.id="volBtn",kr.type="button";function J0(){kr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}J0();kr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Ae&&Ae.master.gain.setTargetAtTime(e,Ae.ctx.currentTime,.05),J0()});const j0=document.querySelector("#menuToggles")||Xe.menu;j0.appendChild(kr);const Br=document.createElement("button");Br.id="musicBtn",Br.type="button";function Q0(){Br.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}Q0();Br.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),is(),Q0()});j0.appendChild(Br);const wr=document.createElement("button");wr.id="actionBtn",wr.type="button",wr.textContent="E";wr.addEventListener("pointerdown",n=>{n.preventDefault(),is(),gd()});Xe.touchControls.appendChild(wr);const Tl=document.createElement("div");Tl.className="course-select";Tl.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Xe.freeRunBtn.parentNode.insertBefore(Tl,Xe.freeRunBtn);const ep=[];Es.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>d_(e)),Tl.querySelector("#carButtons").appendChild(t),ep.push(t)});function Ch(){const n=Es[ki],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),ep.forEach((t,i)=>t.classList.toggle("active",i===ki))}Ch();Xe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+Xn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Xe.playerProgress=document.querySelector("#playerProgress");Xn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function El(){const n=$r();Xe.startBtn.textContent=Vt?.active?`Continue Season — Race ${Vt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=v0();e.innerHTML=`<span>Division ${g0(n)}${Vt?.active?` — after race ${Vt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Vt?` — ${i.pts} pts`:""}</b>`).join("")}}function Iy(){o.mode==="roam"&&o.score>800&&cp("roam",o.score,{deliveries:Me.deliveries||0,stunts:Me.stunts||0,busts:Me.busts||0}),o.mode="menu",Vr(),Ot.visible=!1,ln&&(ln.visible=!0),Yr(!1),document.body.classList.remove("roam-mode"),Hi(),El(),Xe.result.classList.add("hidden"),Xe.menu.classList.remove("hidden")}El();Xe.startBtn.addEventListener("click",()=>{Vt&&Vt.active||f_(),Zr(me.clamp(Vt.raceIndex,0,3)),Or(!1,!1,!0)});Xe.practiceBtn.addEventListener("click",()=>Or(!0));Xe.freeRunBtn.addEventListener("click",()=>Or(!0,!0));Xe.roamBtn.addEventListener("click",()=>rl());Xe.againBtn.addEventListener("click",()=>{o.seasonRace&&Vt?Vt.active&&Vt.raceIndex<4?(Zr(Vt.raceIndex),Or(!1,!1,!0)):Iy():Or(!1)});Xe.courseButtons.forEach(n=>{n.addEventListener("click",()=>Zr(Number(n.dataset.course)))});function tp(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Vr(){Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,Ee.lookPointer=null,Ee.drivePointer=null,Ee.pinchStartDistance=0,Ee.pinchStartZoom=0;for(const n of Xe.touchControls.querySelectorAll(".touch-stick"))tp(n)}function Oo(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=me.clamp(e.clientX-(t.left+t.width/2),-i,i),a=me.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Ee.lookX=me.clamp(s/i,-1,1),Ee.lookY=me.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ee.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ee.lookY*i)}px`);else{const l=me.clamp(s/i,-1,1),c=me.clamp(-a/i,-1,1);Ee.steer=l,Ee.throttle=Math.max(0,c),Ee.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(l*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function lf(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function cf(n,e){e==="look"?(Ee.lookX=0,Ee.lookY=0,Ee.lookPointer=null):(Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.drivePointer=null),tp(n)}function Uy(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function np(n,e=!1){if(n.touches.length<2){Ee.pinchStartDistance=0;return}const t=Uy(n.touches[0],n.touches[1]);if(e||!(Ee.pinchStartDistance>0)){Ee.pinchStartDistance=t,Ee.pinchStartZoom=Ee.zoom;return}const i=Math.max(.2,t/Ee.pinchStartDistance);Ee.zoom=me.clamp(Ee.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Xe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),is(),o.mode==="paused"&&(o.mode="race"),e==="look"&&(Ee.lookPointer=s.pointerId),e==="drive"&&(Ee.drivePointer=s.pointerId),Oo(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&(s.preventDefault(),Oo(n,s))},{passive:!1});const t=s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&cf(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),is(),o.mode==="paused"&&(o.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Ee.lookPointer=a.identifier),e==="drive"&&(Ee.drivePointer=a.identifier),Oo(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer,r=lf(s,a);r&&(s.preventDefault(),Oo(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer;lf(s,a)&&(s.preventDefault(),cf(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Xe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),is(),Je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>Je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Xr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),np(n,!0))},{passive:!1});Xr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),np(n))},{passive:!1});Xr.addEventListener("touchend",n=>{n.touches.length<2&&(Ee.pinchStartDistance=0)},{passive:!1});Xr.addEventListener("touchcancel",()=>{Ee.pinchStartDistance=0},{passive:!1});var Ti=0;function Va(){return Ti}let ri=localStorage.getItem("steel-ribbon-weather")||"clear";ri==="rain"||(ri="clear");const bd=420,ip=[];for(let n=0;n<bd;n++)ip.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const hl=new Zt;hl.setAttribute("position",new bt(new Float32Array(bd*6),3));const sp=new el({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),qs=new km(hl,sp);qs.frustumCulled=!1,qs.renderOrder=40,qs.visible=!1,Te.add(qs);fn(new It,(n,e)=>{const t=ri==="rain"?1:0;if(Ti+=(t-Ti)*Math.min(1,e*1.3),t===0&&Ti<.01&&(Ti=0),qs.visible=Ti>.02,sp.opacity=.34*Ti,qs.visible){qs.position.copy(be.position);const i=hl.attributes.position.array;for(let s=0;s<bd;s++){const a=ip[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}hl.attributes.position.needsUpdate=!0}pn.roadMat&&(pn.roadMat.roughness=.62-.37*Ti,pn.roadMat.metalness=.1+.26*Ti,pn.roadMat.envMapIntensity=.8+.9*Ti)});function wd(){ri=ri==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",ri),ap(),o.message=ri==="rain"?"Rain rolling in":"Skies clearing",o.messageTimer=1.2}const Gr=document.createElement("button");Gr.id="weatherBtn",Gr.type="button";function ap(){Gr.textContent=ri==="rain"?"🌧 Rain":"☀ Clear"}ap();Gr.addEventListener("click",n=>{n.stopPropagation(),wd()});(document.querySelector("#menuToggles")||Xe.menu).appendChild(Gr);const Sr=["dusk","night","day","cycle"],Fy={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let Hn=localStorage.getItem("steel-ribbon-tod")||"dusk";Sr.includes(Hn)||(Hn="dusk");let qo=0,Yo=0,yc=95;const zy=new rt,Rh=new rt,Ny=new rt;function zs(n,e,t,i,s){return Ny.set(n).lerp(zy.set(e),i).lerp(Rh.set(t),s)}const fs=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Te.traverse(n=>{n.isSprite&&n.renderOrder===-50&&pn.cloudMats.push(n.material)});function Oy(n,e){if(!pn.skyU)return;const t=Va();pn.skyU.uDay.value=n,pn.skyU.uNight.value=e,pn.skyU.uRain.value=t;const i=pn;i.hemi.color.copy(zs(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(zs(3097190,5925464,789534,n,e)),i.hemi.intensity=fs(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(zs(7179775,13096432,2240591,n,e)),i.fill.intensity=fs(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(zs(16752724,16774880,10336511,n,e)),i.key.intensity=fs(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=fs(.5,.3,.1,n,e)*(1-.4*t),Te.fog.color.copy(zs(14719602,12834794,723741,n,e).lerp(Rh.set(5923950),.6*t)),Te.fog.near=fs(360,430,300,n,e)*(1-.45*t),Te.fog.far=fs(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(zs(16764250,16777198,14542591,n,e)),i.sunMat.opacity=fs(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=fs(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=zs(16777215,16777215,3687001,n,e).lerp(Rh.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}fn(new It,(n,e)=>{let t=0,i=0;if(Hn==="day")t=1;else if(Hn==="night")i=1;else if(Hn==="cycle"){yc=(yc+e)%270;const a=yc;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);qo+=(t-qo)*s,Yo+=(i-Yo)*s,Oy(qo,Yo)});function rp(){Hn=Sr[(Sr.indexOf(Hn)+1)%Sr.length],localStorage.setItem("steel-ribbon-tod",Hn),Sd(),o.message=`Time of day: ${Hn.toUpperCase()}`,o.messageTimer=1.2}const Hr=document.createElement("button");Hr.id="todBtn",Hr.type="button";function Sd(){Hr.textContent=`${Fy[Hn]} ${Hn[0].toUpperCase()}${Hn.slice(1)}`}Sd();Hr.addEventListener("click",n=>{n.stopPropagation(),rp()});(document.querySelector("#menuToggles")||Xe.menu).appendChild(Hr);const hf=document.querySelector("#menuMain"),ky=document.querySelector("#onlinePanel"),By=document.querySelector("#scoresPanel");function dl(n){hf&&(hf.classList.toggle("hidden",!!n),ky.classList.toggle("hidden",n!=="online"),By.classList.toggle("hidden",n!=="scores"))}const op={lap:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",roam:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1"},Ph="steel-ribbon-initials",wa=document.querySelector("#initials");wa&&(wa.value=localStorage.getItem(Ph)||"",wa.addEventListener("input",()=>{wa.value=wa.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,3),localStorage.setItem(Ph,wa.value)}));function Vy(){return(localStorage.getItem(Ph)||"").slice(0,3)}let Wr="lap";async function lp(n){try{const e=new AbortController,t=setTimeout(()=>e.abort(),7e3),i=await fetch(op[n],{signal:e.signal,cache:"no-store"});clearTimeout(t);const s=await i.json();return(Array.isArray(s)?s:s.scores||[]).filter(r=>Number(r.score)>0).sort((r,l)=>l.score-r.score).slice(0,12)}catch{return null}}async function cp(n,e,t={}){const i=Vy();if(!i||!(e>0))return!1;try{const s=new AbortController,a=setTimeout(()=>s.abort(),7e3);return await fetch(op[n],{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initials:i,score:Math.max(0,Math.floor(e)),extra:t}),signal:s.signal}),clearTimeout(a),Me.scoresPosted=(Me.scoresPosted||0)+1,!0}catch{return!1}}async function hp(){const n=document.querySelector("#scoreBoard");if(!n)return;n.textContent="Loading…";const e=await lp(Wr);if(!e){n.textContent="Leaderboard unreachable — try again later.";return}if(!e.length){n.textContent="No entries yet — set your initials and claim the first spot.";return}n.innerHTML=e.map((t,i)=>{const s=String(t.initials||t.name||"???").slice(0,3),a=Wr==="lap"?t.extra?.time?`${Number(t.extra.time).toFixed(2)}s — ${t.extra.course||"?"}`:Math.round(t.score):Math.round(t.score).toLocaleString();return`<div class="score-row"><i>${i+1}</i><b>${s}</b><span>${a}</span></div>`}).join("")}for(const[n,e]of[["#lapBoardBtn","lap"],["#roamBoardBtn","roam"]]){const t=document.querySelector(n);t&&t.addEventListener("click",()=>{Wr=e,document.querySelector("#lapBoardBtn")?.classList.toggle("active-board",e==="lap"),document.querySelector("#roamBoardBtn")?.classList.toggle("active-board",e==="roam"),hp()})}document.querySelector("#scoresBtn")?.addEventListener("click",()=>(dl("scores"),hp()));document.querySelector("#scoresBackBtn")?.addEventListener("click",()=>dl(null));const Gy="wss://iron-ridge-online.jez237.workers.dev/ws",dp="steel-ribbon-mp-room",up="steel-ribbon-mp-name",xt={ws:null,connected:!1,id:null,room:"",name:"",peers:new Map,lastState:0,lastPing:0,manual:!1},cr=(n,e,t)=>String(n||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,t)||e;function Hy(){const n="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let e="";const t=new Uint8Array(5);crypto.getRandomValues(t);for(const i of t)e+=n[i%n.length];return e}function ps(n){const e=document.querySelector("#mpStatus");e&&(e.textContent=n)}function Wy(n){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.clearRect(0,0,256,64),t.fillStyle="rgba(10, 16, 26, 0.78)",t.fillRect(14,10,228,42),t.strokeStyle="rgba(140, 200, 255, 0.9)",t.lineWidth=3,t.strokeRect(14,10,228,42),t.fillStyle="#d8ecff",t.font="800 24px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,32,208);const i=new nn(e);i.colorSpace=Lt;const s=new Qo(new pl({map:i,transparent:!0,depthTest:!1}));return s.scale.set(7.4,1.85,1),s}function df(n,e){let t=xt.peers.get(n);return t||(t={id:n,name:e||"DRIVER",hue:[...n].reduce((i,s)=>i+s.charCodeAt(0),0),tx:0,ty:0,tz:0,tyaw:0,v:"car",has:!1,lastSeen:performance.now()},xt.peers.set(n,t)),e&&(t.name=e),t}function Xy(n){n.car||(n.car=qr("compact",[16739693,5163247,16770048,9498256,3531007][n.hue%5]),n.car.userData.stolenYOff=.57,Te.add(n.car),n.walker=ld(9464783,4149685),n.walker.visible=!1,Te.add(n.walker),n.label=Wy(n.name),Te.add(n.label))}function Td(n){n.car&&As(n.car),n.walker&&As(n.walker),n.label&&(n.label.material.map?.dispose(),n.label.material.dispose(),Te.remove(n.label)),xt.peers.delete(n.id)}function ul(n=!0){if(xt.manual=n,xt.ws)try{xt.ws.close(1e3,"leave")}catch{}xt.ws=null,xt.connected=!1,xt.id=null;for(const e of[...xt.peers.values()])Td(e);ps("Not connected."),Ed()}function fp(){ul(!0);const n=cr(document.querySelector("#mpName")?.value,"DRIVER",12),e=cr(document.querySelector("#mpRoom")?.value,"",10)||Hy(),t=document.querySelector("#mpRoom");t&&(t.value=e),localStorage.setItem(dp,e),localStorage.setItem(up,n),xt.room=e,xt.name=n,xt.manual=!1,ps(`Connecting to ${e}…`);let i;try{i=new WebSocket(`${Gy}/${encodeURIComponent(`SRR-${e}`)}`)}catch{ps("Connection failed.");return}xt.ws=i,i.onopen=()=>{xt.connected=!0,i.send(JSON.stringify({type:"hello",name:n})),ps(`Room ${e} — connected`),Ed()},i.onclose=()=>{xt.ws===i&&(ul(!0),ps(xt.manual?"Not connected.":"Connection dropped."))},i.onerror=()=>ps("Connection failed — try again."),i.onmessage=s=>{let a;try{a=JSON.parse(s.data)}catch{return}if(a.type==="welcome"){xt.id=a.id,ps(`Room ${xt.room} — ${Math.max(1,Number(a.count)||1)} cruising`);return}if(a.type==="peers"){const r=new Set((a.peers||[]).filter(l=>l.id!==xt.id).map(l=>l.id));for(const l of[...xt.peers.values()])r.has(l.id)||Td(l);for(const l of a.peers||[]){if(!l.id||l.id===xt.id)continue;const c=xt.peers.has(l.id);df(l.id,cr(l.name,"DRIVER",12)),c||o.mode==="roam"&&(o.message=`${cr(l.name,"DRIVER",12)} joined the cruise`,o.messageTimer=1.6)}ps(`Room ${xt.room} — ${xt.peers.size+1} cruising`);return}if(!(!a.from||a.from===xt.id)&&a.type==="state"&&a.state){const r=df(a.from,a.name&&cr(a.name,"DRIVER",12));r.tx=Number(a.state.x)||0,r.ty=Number(a.state.y)||0,r.tz=Number(a.state.z)||0,r.tyaw=Number(a.state.yaw)||0,r.v=a.state.v==="foot"?"foot":"car",r.lastSeen=performance.now(),r.has||(Xy(r),r.car.position.set(r.tx,r.ty,r.tz),r.has=!0)}}}function Ed(){const n=document.querySelector("#mpJoinBtn"),e=document.querySelector("#mpLeaveBtn");n&&(n.textContent=xt.connected?"Switch Room":"Join Room"),e&&e.classList.toggle("hidden",!xt.connected)}{const n=document.querySelector("#mpName"),e=document.querySelector("#mpRoom");n&&(n.value=localStorage.getItem(up)||""),e&&(e.value=localStorage.getItem(dp)||""),document.querySelector("#onlineBtn")?.addEventListener("click",()=>dl("online")),document.querySelector("#onlineBackBtn")?.addEventListener("click",()=>dl(null)),document.querySelector("#mpJoinBtn")?.addEventListener("click",fp),document.querySelector("#mpLeaveBtn")?.addEventListener("click",()=>ul(!0)),Ed()}fn(new It,(n,e)=>{if(!xt.connected)return;const t=performance.now();for(const i of[...xt.peers.values()]){if(!i.has)continue;if(t-i.lastSeen>12e3){Td(i);continue}const s=1-Math.exp(-10*e),a=i.v!=="foot";i.car.visible=a,i.walker.visible=!a;const r=a?i.car:i.walker;if(r.position.lerp(ad.set(i.tx,i.ty-(a?.25:.5),i.tz),s),r.rotation.y=-i.tyaw,i.label.position.set(r.position.x,r.position.y+(a?3.4:3),r.position.z),a)for(const l of i.car.userData.wheels||[])l.rotation.x-=20*e}t-xt.lastPing>5e3&&(xt.lastPing=t,xt.ws?.readyState===1&&xt.ws.send(JSON.stringify({type:"ping",t}))),o.mode==="roam"&&t-xt.lastState>95&&xt.ws?.readyState===1&&(xt.lastState=t,xt.ws.send(JSON.stringify({type:"state",name:xt.name,state:{x:+o.roamPos.x.toFixed(1),y:+o.roamPos.y.toFixed(1),z:+o.roamPos.z.toFixed(1),yaw:+o.roamYaw.toFixed(2),v:o.vehicle==="foot"?"foot":"car"}}))),Me.mpPeers=xt.peers.size});function qy(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of od)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of $t)e(c.marker);e(Ot),e(on),typeof ln<"u"&&e(ln),typeof gi<"u"&&e(gi),he&&e(he.mesh),typeof pi<"u"&&e(pi),typeof Ei<"u"&&Ei&&e(Ei);for(const c of Xn)e(c.mesh);const i=new Map;Te.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let m=c;m&&m!==Te;m=m.parent){if(n.has(m)||!m.visible)return;const x=m.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const u=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let p=i.get(u);p||i.set(u,p=[]),p.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(m=>{m.updateWorldMatrix(!0,!1);const x=m.geometry.clone().applyMatrix4(m.matrixWorld);for(const M of Object.keys(x.attributes))M==="position"||M==="normal"||M==="uv"||x.deleteAttribute(M);return x}),d=bs(h,!1);if(!d)continue;const u=c[0],p=new O(d,u.material);p.castShadow=u.castShadow,p.receiveShadow=u.receiveShadow,p.matrixAutoUpdate=!1,Te.add(p);for(const m of c)r.set(m.geometry.uuid,m.geometry),m.removeFromParent(),a++;s++}catch{}const l=new Set;Te.traverse(c=>c.geometry&&l.add(c.geometry.uuid));for(const[c,h]of r)l.has(c)||h.dispose();Me.staticMerge={groups:s,meshesRemoved:a}}qy();const Yy=pt(o.s);o.y=Yy.p.y+2.1;o.lastSafeS=o.s;o.lastSafeDistance=o.totalDistance;yd(.016);br();K0();
