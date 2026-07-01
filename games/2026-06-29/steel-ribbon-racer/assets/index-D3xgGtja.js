(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Zo="181",vd=0,Cc=1,Md=2,nh=1,ih=2,si=3,Ei=0,nn=1,ut=2,Zn=0,ps=1,Oi=2,Rc=3,Pc=4,Sd=5,Fi=100,yd=101,bd=102,wd=103,Td=104,Ed=200,Ad=201,Cd=202,Rd=203,Ka=204,Ja=205,Pd=206,Ld=207,Dd=208,Id=209,Ud=210,Fd=211,Nd=212,Od=213,Bd=214,ja=0,Qa=1,eo=2,_s=3,to=4,no=5,io=6,so=7,$o=0,zd=1,kd=2,wi=0,sh=1,rh=2,ah=3,Ko=4,oh=5,ch=6,lh=7,hh=300,vs=301,Ms=302,ro=303,ao=304,na=306,rn=1e3,ai=1001,oo=1002,wn=1003,Vd=1004,dr=1005,Cn=1006,da=1007,Bi=1008,Kn=1009,dh=1010,uh=1011,js=1012,Jo=1013,Gi=1014,Yn=1015,$n=1016,jo=1017,Qo=1018,Qs=1020,fh=35902,ph=35899,mh=1021,xh=1022,Nn=1023,er=1026,tr=1027,ec=1028,tc=1029,nc=1030,ic=1031,sc=1033,kr=33776,Vr=33777,Gr=33778,Hr=33779,co=35840,lo=35841,ho=35842,uo=35843,fo=36196,po=37492,mo=37496,xo=37808,go=37809,_o=37810,vo=37811,Mo=37812,So=37813,yo=37814,bo=37815,wo=37816,To=37817,Eo=37818,Ao=37819,Co=37820,Ro=37821,Po=36492,Lo=36494,Do=36495,Io=36283,Uo=36284,Fo=36285,No=36286,Gd=3200,Hd=3201,rc=0,Wd=1,Si="",Tt="srgb",Ss="srgb-linear",$r="linear",yt="srgb",Ki=7680,Lc=519,Xd=512,Yd=513,qd=514,gh=515,Zd=516,$d=517,Kd=518,Jd=519,Dc=35044,Ic="300 es",qn=2e3,Kr=2001;function _h(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jd(){const i=Jr("canvas");return i.style.display="block",i}const Uc={};function Fc(...i){const e="THREE."+i.shift();console.log(e,...i)}function Qe(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Bt(...i){const e="THREE."+i.shift();console.error(e,...i)}function nr(...i){const e=i.join(" ");e in Uc||(Uc[e]=!0,Qe(...i))}function Qd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Ts{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nc=1234567;const Xs=Math.PI/180,ir=180/Math.PI;function Xi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function ot(i,e,t){return Math.max(e,Math.min(t,i))}function ac(i,e){return(i%e+e)%e}function eu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function tu(i,e,t){return i!==e?(t-i)/(e-i):0}function Ys(i,e,t){return(1-t)*i+t*e}function nu(i,e,t,n){return Ys(i,e,1-Math.exp(-t*n))}function iu(i,e=1){return e-Math.abs(ac(i,e*2)-e)}function su(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function ru(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function au(i,e){return i+Math.floor(Math.random()*(e-i+1))}function ou(i,e){return i+Math.random()*(e-i)}function cu(i){return i*(.5-Math.random())}function lu(i){i!==void 0&&(Nc=i);let e=Nc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function hu(i){return i*Xs}function du(i){return i*ir}function uu(i){return(i&i-1)===0&&i!==0}function fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*d,o*l);break;default:Qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function us(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function cn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Oe={DEG2RAD:Xs,RAD2DEG:ir,generateUUID:Xi,clamp:ot,euclideanModulo:ac,mapLinear:eu,inverseLerp:tu,lerp:Ys,damp:nu,pingpong:iu,smoothstep:su,smootherstep:ru,randInt:au,randFloat:ou,randFloatSpread:cu,seededRandom:lu,degToRad:hu,radToDeg:du,isPowerOfTwo:uu,ceilPowerOfTwo:fu,floorPowerOfTwo:pu,setQuaternionFromProperEuler:mu,normalize:cn,denormalize:us};class Ee{constructor(e=0,t=0){Ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class hi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],m=r[a+1],g=r[a+2],v=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(u!==v||c!==f||l!==m||d!==g){let p=c*f+l*m+d*g+u*v;p<0&&(f=-f,m=-m,g=-g,v=-v,p=-p);let h=1-o;if(p<.9995){const _=Math.acos(p),y=Math.sin(_);h=Math.sin(h*_)/y,o=Math.sin(o*_)/y,c=c*h+f*o,l=l*h+m*o,d=d*h+g*o,u=u*h+v*o}else{c=c*h+f*o,l=l*h+m*o,d=d*h+g*o,u=u*h+v*o;const _=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=_,l*=_,d*=_,u*=_}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*u+c*m-l*f,e[t+1]=c*g+d*f+l*u-o*m,e[t+2]=l*g+d*m+o*f-c*u,e[t+3]=d*g-o*u-c*f-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),m=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u-f*m*g;break;case"YXZ":this._x=f*d*u+l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u+f*m*g;break;case"ZXY":this._x=f*d*u-l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u-f*m*g;break;case"ZYX":this._x=f*d*u-l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u+f*m*g;break;case"YZX":this._x=f*d*u+l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u-f*m*g;break;case"XZY":this._x=f*d*u-l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u+f*m*g;break;default:Qe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],f=n+o+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ot(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Oc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Oc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ua.copy(this).projectOnVector(e),this.sub(ua)}reflect(e){return this.sub(ua.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ua=new D,Oc=new hi;class it{constructor(e,t,n,s,r,a,o,c,l){it.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],m=n[5],g=n[8],v=s[0],p=s[3],h=s[6],_=s[1],y=s[4],S=s[7],E=s[2],w=s[5],R=s[8];return r[0]=a*v+o*_+c*E,r[3]=a*p+o*y+c*w,r[6]=a*h+o*S+c*R,r[1]=l*v+d*_+u*E,r[4]=l*p+d*y+u*w,r[7]=l*h+d*S+u*R,r[2]=f*v+m*_+g*E,r[5]=f*p+m*y+g*w,r[8]=f*h+m*S+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,f=o*c-d*r,m=l*r-a*c,g=t*u+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(s*l-d*n)*v,e[2]=(o*n-s*a)*v,e[3]=f*v,e[4]=(d*t-s*c)*v,e[5]=(s*r-o*t)*v,e[6]=m*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(fa.makeScale(e,t)),this}rotate(e){return this.premultiply(fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const fa=new it,Bc=new it().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zc=new it().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function xu(){const i={enabled:!0,workingColorSpace:Ss,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===yt&&(s.r=oi(s.r),s.g=oi(s.g),s.b=oi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===yt&&(s.r=ms(s.r),s.g=ms(s.g),s.b=ms(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Si?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return nr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return nr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ss]:{primaries:e,whitePoint:n,transfer:$r,toXYZ:Bc,fromXYZ:zc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Tt},outputColorSpaceConfig:{drawingBufferColorSpace:Tt}},[Tt]:{primaries:e,whitePoint:n,transfer:yt,toXYZ:Bc,fromXYZ:zc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Tt}}}),i}const gt=xu();function oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ms(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ji;class gu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ji===void 0&&(Ji=Jr("canvas")),Ji.width=e.width,Ji.height=e.height;const s=Ji.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Jr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=oi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(oi(t[n]/255)*255):t[n]=oi(t[n]);return{data:t,width:e.width,height:e.height}}else return Qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _u=0;class oc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_u++}),this.uuid=Xi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(pa(s[a].image)):r.push(pa(s[a]))}else r=pa(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function pa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Qe("Texture: Unable to serialize Texture."),{})}let vu=0;const ma=new D;class sn extends Ts{constructor(e=sn.DEFAULT_IMAGE,t=sn.DEFAULT_MAPPING,n=ai,s=ai,r=Cn,a=Bi,o=Nn,c=Kn,l=sn.DEFAULT_ANISOTROPY,d=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vu++}),this.uuid=Xi(),this.name="",this.source=new oc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new it,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ma).x}get height(){return this.source.getSize(ma).y}get depth(){return this.source.getSize(ma).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Qe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==hh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rn:e.x=e.x-Math.floor(e.x);break;case ai:e.x=e.x<0?0:1;break;case oo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rn:e.y=e.y-Math.floor(e.y);break;case ai:e.y=e.y<0?0:1;break;case oo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=hh;sn.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,t=0,n=0,s=1){At.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],f=c[1],m=c[5],g=c[9],v=c[2],p=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,S=(m+1)/2,E=(h+1)/2,w=(d+f)/4,R=(u+v)/4,P=(g+p)/4;return y>S&&y>E?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=w/n,r=R/n):S>E?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=w/s,r=P/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=P/r),this.set(n,s,r,t),this}let _=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(f-d)*(f-d));return Math.abs(_)<.001&&(_=1),this.x=(p-g)/_,this.y=(u-v)/_,this.z=(f-d)/_,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this.w=ot(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this.w=ot(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Mu extends Ts{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new sn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new oc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class On extends Mu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class vh extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wn,this.minFilter=wn,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Su extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wn,this.minFilter=wn,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yi{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Rn):Rn.fromBufferAttribute(r,a),Rn.applyMatrix4(e.matrixWorld),this.expandByPoint(Rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ur.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ur.copy(n.boundingBox)),ur.applyMatrix4(e.matrixWorld),this.union(ur)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ls),fr.subVectors(this.max,Ls),ji.subVectors(e.a,Ls),Qi.subVectors(e.b,Ls),es.subVectors(e.c,Ls),pi.subVectors(Qi,ji),mi.subVectors(es,Qi),Ci.subVectors(ji,es);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Ci.z,Ci.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Ci.z,0,-Ci.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Ci.y,Ci.x,0];return!xa(t,ji,Qi,es,fr)||(t=[1,0,0,0,1,0,0,0,1],!xa(t,ji,Qi,es,fr))?!1:(pr.crossVectors(pi,mi),t=[pr.x,pr.y,pr.z],xa(t,ji,Qi,es,fr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const jn=[new D,new D,new D,new D,new D,new D,new D,new D],Rn=new D,ur=new Yi,ji=new D,Qi=new D,es=new D,pi=new D,mi=new D,Ci=new D,Ls=new D,fr=new D,pr=new D,Ri=new D;function xa(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ri.fromArray(i,r);const o=s.x*Math.abs(Ri.x)+s.y*Math.abs(Ri.y)+s.z*Math.abs(Ri.z),c=e.dot(Ri),l=t.dot(Ri),d=n.dot(Ri);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const yu=new Yi,Ds=new D,ga=new D;class Es{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):yu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ds.subVectors(e,this.center);const t=Ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ds,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ds.copy(e.center).add(ga)),this.expandByPoint(Ds.copy(e.center).sub(ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Qn=new D,_a=new D,mr=new D,xi=new D,va=new D,xr=new D,Ma=new D;class cc{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qn.copy(this.origin).addScaledVector(this.direction,t),Qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){_a.copy(e).add(t).multiplyScalar(.5),mr.copy(t).sub(e).normalize(),xi.copy(this.origin).sub(_a);const r=e.distanceTo(t)*.5,a=-this.direction.dot(mr),o=xi.dot(this.direction),c=-xi.dot(mr),l=xi.lengthSq(),d=Math.abs(1-a*a);let u,f,m,g;if(d>0)if(u=a*c-o,f=a*o-c,g=r*d,u>=0)if(f>=-g)if(f<=g){const v=1/d;u*=v,f*=v,m=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),m=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(_a).addScaledVector(mr,f),m}intersectSphere(e,t){Qn.subVectors(e.center,this.origin);const n=Qn.dot(this.direction),s=Qn.dot(Qn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Qn)!==null}intersectTriangle(e,t,n,s,r){va.subVectors(t,e),xr.subVectors(n,e),Ma.crossVectors(va,xr);let a=this.direction.dot(Ma),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xi.subVectors(this.origin,e);const c=o*this.direction.dot(xr.crossVectors(xi,xr));if(c<0)return null;const l=o*this.direction.dot(va.cross(xi));if(l<0||c+l>a)return null;const d=-o*xi.dot(Ma);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt{constructor(e,t,n,s,r,a,o,c,l,d,u,f,m,g,v,p){Mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,u,f,m,g,v,p)}set(e,t,n,s,r,a,o,c,l,d,u,f,m,g,v,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=m,h[7]=g,h[11]=v,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ts.setFromMatrixColumn(e,0).length(),r=1/ts.setFromMatrixColumn(e,1).length(),a=1/ts.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*d,m=a*u,g=o*d,v=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=m+g*l,t[5]=f-v*l,t[9]=-o*c,t[2]=v-f*l,t[6]=g+m*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,m=c*u,g=l*d,v=l*u;t[0]=f+v*o,t[4]=g*o-m,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=v+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,m=c*u,g=l*d,v=l*u;t[0]=f-v*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=v-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,m=a*u,g=o*d,v=o*u;t[0]=c*d,t[4]=g*l-m,t[8]=f*l+v,t[1]=c*u,t[5]=v*l+f,t[9]=m*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*l,g=o*c,v=o*l;t[0]=c*d,t[4]=v-f*u,t[8]=g*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=m*u+g,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*c,m=a*l,g=o*c,v=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=f*u+v,t[5]=a*d,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*d,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bu,e,wu)}lookAt(e,t,n){const s=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),gi.crossVectors(n,Mn),gi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),gi.crossVectors(n,Mn)),gi.normalize(),gr.crossVectors(Mn,gi),s[0]=gi.x,s[4]=gr.x,s[8]=Mn.x,s[1]=gi.y,s[5]=gr.y,s[9]=Mn.y,s[2]=gi.z,s[6]=gr.z,s[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],m=n[13],g=n[2],v=n[6],p=n[10],h=n[14],_=n[3],y=n[7],S=n[11],E=n[15],w=s[0],R=s[4],P=s[8],b=s[12],M=s[1],A=s[5],I=s[9],B=s[13],q=s[2],Z=s[6],J=s[10],oe=s[14],ie=s[3],me=s[7],Me=s[11],De=s[15];return r[0]=a*w+o*M+c*q+l*ie,r[4]=a*R+o*A+c*Z+l*me,r[8]=a*P+o*I+c*J+l*Me,r[12]=a*b+o*B+c*oe+l*De,r[1]=d*w+u*M+f*q+m*ie,r[5]=d*R+u*A+f*Z+m*me,r[9]=d*P+u*I+f*J+m*Me,r[13]=d*b+u*B+f*oe+m*De,r[2]=g*w+v*M+p*q+h*ie,r[6]=g*R+v*A+p*Z+h*me,r[10]=g*P+v*I+p*J+h*Me,r[14]=g*b+v*B+p*oe+h*De,r[3]=_*w+y*M+S*q+E*ie,r[7]=_*R+y*A+S*Z+E*me,r[11]=_*P+y*I+S*J+E*Me,r[15]=_*b+y*B+S*oe+E*De,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],f=e[10],m=e[14],g=e[3],v=e[7],p=e[11],h=e[15];return g*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*m-n*c*m)+v*(+t*c*m-t*l*f+r*a*f-s*a*m+s*l*d-r*c*d)+p*(+t*l*u-t*o*m-r*a*u+n*a*m+r*o*d-n*l*d)+h*(-s*o*d-t*c*u+t*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],f=e[10],m=e[11],g=e[12],v=e[13],p=e[14],h=e[15],_=u*p*l-v*f*l+v*c*m-o*p*m-u*c*h+o*f*h,y=g*f*l-d*p*l-g*c*m+a*p*m+d*c*h-a*f*h,S=d*v*l-g*u*l+g*o*m-a*v*m-d*o*h+a*u*h,E=g*u*c-d*v*c-g*o*f+a*v*f+d*o*p-a*u*p,w=t*_+n*y+s*S+r*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=_*R,e[1]=(v*f*r-u*p*r-v*s*m+n*p*m+u*s*h-n*f*h)*R,e[2]=(o*p*r-v*c*r+v*s*l-n*p*l-o*s*h+n*c*h)*R,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*m-n*c*m)*R,e[4]=y*R,e[5]=(d*p*r-g*f*r+g*s*m-t*p*m-d*s*h+t*f*h)*R,e[6]=(g*c*r-a*p*r-g*s*l+t*p*l+a*s*h-t*c*h)*R,e[7]=(a*f*r-d*c*r+d*s*l-t*f*l-a*s*m+t*c*m)*R,e[8]=S*R,e[9]=(g*u*r-d*v*r-g*n*m+t*v*m+d*n*h-t*u*h)*R,e[10]=(a*v*r-g*o*r+g*n*l-t*v*l-a*n*h+t*o*h)*R,e[11]=(d*o*r-a*u*r-d*n*l+t*u*l+a*n*m-t*o*m)*R,e[12]=E*R,e[13]=(d*v*s-g*u*s+g*n*f-t*v*f-d*n*p+t*u*p)*R,e[14]=(g*o*s-a*v*s-g*n*c+t*v*c+a*n*p-t*o*p)*R,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*f+t*o*f)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,f=r*l,m=r*d,g=r*u,v=a*d,p=a*u,h=o*u,_=c*l,y=c*d,S=c*u,E=n.x,w=n.y,R=n.z;return s[0]=(1-(v+h))*E,s[1]=(m+S)*E,s[2]=(g-y)*E,s[3]=0,s[4]=(m-S)*w,s[5]=(1-(f+h))*w,s[6]=(p+_)*w,s[7]=0,s[8]=(g+y)*R,s[9]=(p-_)*R,s[10]=(1-(f+v))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ts.set(s[0],s[1],s[2]).length();const a=ts.set(s[4],s[5],s[6]).length(),o=ts.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Pn.copy(this);const l=1/r,d=1/a,u=1/o;return Pn.elements[0]*=l,Pn.elements[1]*=l,Pn.elements[2]*=l,Pn.elements[4]*=d,Pn.elements[5]*=d,Pn.elements[6]*=d,Pn.elements[8]*=u,Pn.elements[9]*=u,Pn.elements[10]*=u,t.setFromRotationMatrix(Pn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=qn,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),m=(n+s)/(n-s);let g,v;if(c)g=r/(a-r),v=a*r/(a-r);else if(o===qn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Kr)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=qn,c=!1){const l=this.elements,d=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,v;if(c)g=1/(a-r),v=a/(a-r);else if(o===qn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Kr)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ts=new D,Pn=new Mt,bu=new D(0,0,0),wu=new D(1,1,1),gi=new D,gr=new D,Mn=new D,kc=new Mt,Vc=new hi;class kn{constructor(e=0,t=0,n=0,s=kn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ot(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ot(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ot(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return kc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vc.setFromEuler(this),this.setFromQuaternion(Vc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kn.DEFAULT_ORDER="XYZ";class lc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Tu=0;const Gc=new D,ns=new hi,ei=new Mt,_r=new D,Is=new D,Eu=new D,Au=new hi,Hc=new D(1,0,0),Wc=new D(0,1,0),Xc=new D(0,0,1),Yc={type:"added"},Cu={type:"removed"},is={type:"childadded",child:null},Sa={type:"childremoved",child:null};class zt extends Ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=Xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new D,t=new kn,n=new hi,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Mt},normalMatrix:{value:new it}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.multiply(ns),this}rotateOnWorldAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.premultiply(ns),this}rotateX(e){return this.rotateOnAxis(Hc,e)}rotateY(e){return this.rotateOnAxis(Wc,e)}rotateZ(e){return this.rotateOnAxis(Xc,e)}translateOnAxis(e,t){return Gc.copy(e).applyQuaternion(this.quaternion),this.position.add(Gc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hc,e)}translateY(e){return this.translateOnAxis(Wc,e)}translateZ(e){return this.translateOnAxis(Xc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?_r.copy(e):_r.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(Is,_r,this.up):ei.lookAt(_r,Is,this.up),this.quaternion.setFromRotationMatrix(ei),s&&(ei.extractRotation(s.matrixWorld),ns.setFromRotationMatrix(ei),this.quaternion.premultiply(ns.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Bt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yc),is.child=e,this.dispatchEvent(is),is.child=null):Bt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Cu),Sa.child=e,this.dispatchEvent(Sa),Sa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yc),is.child=e,this.dispatchEvent(is),is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,e,Eu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,Au,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}zt.DEFAULT_UP=new D(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ln=new D,ti=new D,ya=new D,ni=new D,ss=new D,rs=new D,qc=new D,ba=new D,wa=new D,Ta=new D,Ea=new At,Aa=new At,Ca=new At;class Fn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Ln.subVectors(e,t),s.cross(Ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Ln.subVectors(s,t),ti.subVectors(n,t),ya.subVectors(e,t);const a=Ln.dot(Ln),o=Ln.dot(ti),c=Ln.dot(ya),l=ti.dot(ti),d=ti.dot(ya),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,m=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ni)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ni.x),c.addScaledVector(a,ni.y),c.addScaledVector(o,ni.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Ea.setScalar(0),Aa.setScalar(0),Ca.setScalar(0),Ea.fromBufferAttribute(e,t),Aa.fromBufferAttribute(e,n),Ca.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ea,r.x),a.addScaledVector(Aa,r.y),a.addScaledVector(Ca,r.z),a}static isFrontFacing(e,t,n,s){return Ln.subVectors(n,t),ti.subVectors(e,t),Ln.cross(ti).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Ln.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Fn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ss.subVectors(s,n),rs.subVectors(r,n),ba.subVectors(e,n);const c=ss.dot(ba),l=rs.dot(ba);if(c<=0&&l<=0)return t.copy(n);wa.subVectors(e,s);const d=ss.dot(wa),u=rs.dot(wa);if(d>=0&&u<=d)return t.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(ss,a);Ta.subVectors(e,r);const m=ss.dot(Ta),g=rs.dot(Ta);if(g>=0&&m<=g)return t.copy(r);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(rs,o);const p=d*g-m*u;if(p<=0&&u-d>=0&&m-g>=0)return qc.subVectors(r,s),o=(u-d)/(u-d+(m-g)),t.copy(s).addScaledVector(qc,o);const h=1/(p+v+f);return a=v*h,o=f*h,t.copy(n).addScaledVector(ss,a).addScaledVector(rs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},vr={h:0,s:0,l:0};function Ra(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Tt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,gt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=gt.workingColorSpace){return this.r=e,this.g=t,this.b=n,gt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=gt.workingColorSpace){if(e=ac(e,1),t=ot(t,0,1),n=ot(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ra(a,r,e+1/3),this.g=Ra(a,r,e),this.b=Ra(a,r,e-1/3)}return gt.colorSpaceToWorking(this,s),this}setStyle(e,t=Tt){function n(r){r!==void 0&&parseFloat(r)<1&&Qe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Qe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Tt){const n=Mh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oi(e.r),this.g=oi(e.g),this.b=oi(e.b),this}copyLinearToSRGB(e){return this.r=ms(e.r),this.g=ms(e.g),this.b=ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tt){return gt.workingToColorSpace(jt.copy(this),e),Math.round(ot(jt.r*255,0,255))*65536+Math.round(ot(jt.g*255,0,255))*256+Math.round(ot(jt.b*255,0,255))}getHexString(e=Tt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=gt.workingColorSpace){gt.workingToColorSpace(jt.copy(this),t);const n=jt.r,s=jt.g,r=jt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=gt.workingColorSpace){return gt.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Tt){gt.workingToColorSpace(jt.copy(this),e);const t=jt.r,n=jt.g,s=jt.b;return e!==Tt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(vr);const n=Ys(_i.h,vr.h,t),s=Ys(_i.s,vr.s,t),r=Ys(_i.l,vr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new Ze;Ze.NAMES=Mh;let Ru=0;class qi extends Ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=Xi(),this.name="",this.type="Material",this.blending=ps,this.side=Ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ka,this.blendDst=Ja,this.blendEquation=Fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Qe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(n.blending=this.blending),this.side!==Ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ka&&(n.blendSrc=this.blendSrc),this.blendDst!==Ja&&(n.blendDst=this.blendDst),this.blendEquation!==Fi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Et extends qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=$o,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Gt=new D,Mr=new Ee;let Pu=0;class Bn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Dc,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Mr.fromBufferAttribute(this,t),Mr.applyMatrix3(e),this.setXY(t,Mr.x,Mr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix3(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=us(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=us(t,this.array)),t}setX(e,t){return this.normalized&&(t=cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=us(t,this.array)),t}setY(e,t){return this.normalized&&(t=cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=us(t,this.array)),t}setZ(e,t){return this.normalized&&(t=cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=us(t,this.array)),t}setW(e,t){return this.normalized&&(t=cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=cn(t,this.array),n=cn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=cn(t,this.array),n=cn(n,this.array),s=cn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=cn(t,this.array),n=cn(n,this.array),s=cn(s,this.array),r=cn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Dc&&(e.usage=this.usage),e}}class Sh extends Bn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class yh extends Bn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class pt extends Bn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Lu=0;const An=new Mt,Pa=new zt,as=new D,Sn=new Yi,Us=new Yi,qt=new D;class kt extends Ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=Xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_h(e)?yh:Sh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new it().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Pa.lookAt(e),Pa.updateMatrix(),this.applyMatrix4(Pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Bt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Bt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Bt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Us.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(Sn.min,Us.min),Sn.expandByPoint(qt),qt.addVectors(Sn.max,Us.max),Sn.expandByPoint(qt)):(Sn.expandByPoint(Us.min),Sn.expandByPoint(Us.max))}Sn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)qt.fromBufferAttribute(o,l),c&&(as.fromBufferAttribute(e,l),qt.add(as)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Bt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Bt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new D,c[P]=new D;const l=new D,d=new D,u=new D,f=new Ee,m=new Ee,g=new Ee,v=new D,p=new D;function h(P,b,M){l.fromBufferAttribute(n,P),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,P),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),d.sub(l),u.sub(l),m.sub(f),g.sub(f);const A=1/(m.x*g.y-g.x*m.y);isFinite(A)&&(v.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(A),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(A),o[P].add(v),o[b].add(v),o[M].add(v),c[P].add(p),c[b].add(p),c[M].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let P=0,b=_.length;P<b;++P){const M=_[P],A=M.start,I=M.count;for(let B=A,q=A+I;B<q;B+=3)h(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const y=new D,S=new D,E=new D,w=new D;function R(P){E.fromBufferAttribute(s,P),w.copy(E);const b=o[P];y.copy(b),y.sub(E.multiplyScalar(E.dot(b))).normalize(),S.crossVectors(w,b);const A=S.dot(c[P])<0?-1:1;a.setXYZW(P,y.x,y.y,y.z,A)}for(let P=0,b=_.length;P<b;++P){const M=_[P],A=M.start,I=M.count;for(let B=A,q=A+I;B<q;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,d=new D,u=new D;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let m=0,g=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?m=c[v]*o.data.stride+o.offset:m=c[v]*d;for(let h=0;h<d;h++)f[g++]=l[m++]}return new Bn(f,d,u)}if(this.index===null)return Qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],m=e(f,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const m=l[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,m=u.length;f<m;f++)d.push(u[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zc=new Mt,Pi=new cc,Sr=new Es,$c=new D,yr=new D,br=new D,wr=new D,La=new D,Tr=new D,Kc=new D,Er=new D;class X extends zt{constructor(e=new kt,t=new Et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Tr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(La.fromBufferAttribute(u,e),a?Tr.addScaledVector(La,d):Tr.addScaledVector(La.sub(t),d))}t.add(Tr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sr.copy(n.boundingSphere),Sr.applyMatrix4(r),Pi.copy(e.ray).recast(e.near),!(Sr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Sr,$c)===null||Pi.origin.distanceToSquared($c)>(e.far-e.near)**2))&&(Zc.copy(r).invert(),Pi.copy(e.ray).applyMatrix4(Zc),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Pi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],h=a[p.materialIndex],_=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=_,E=y;S<E;S+=3){const w=o.getX(S),R=o.getX(S+1),P=o.getX(S+2);s=Ar(this,h,e,n,l,d,u,w,R,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=g,h=v;p<h;p+=3){const _=o.getX(p),y=o.getX(p+1),S=o.getX(p+2);s=Ar(this,a,e,n,l,d,u,_,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],h=a[p.materialIndex],_=Math.max(p.start,m.start),y=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=_,E=y;S<E;S+=3){const w=S,R=S+1,P=S+2;s=Ar(this,h,e,n,l,d,u,w,R,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=g,h=v;p<h;p+=3){const _=p,y=p+1,S=p+2;s=Ar(this,a,e,n,l,d,u,_,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Du(i,e,t,n,s,r,a,o){let c;if(e.side===nn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Ei,o),c===null)return null;Er.copy(o),Er.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Er);return l<t.near||l>t.far?null:{distance:l,point:Er.clone(),object:i}}function Ar(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,yr),i.getVertexPosition(c,br),i.getVertexPosition(l,wr);const d=Du(i,e,t,n,yr,br,wr,Kc);if(d){const u=new D;Fn.getBarycoord(Kc,yr,br,wr,u),s&&(d.uv=Fn.getInterpolatedAttribute(s,o,c,l,u,new Ee)),r&&(d.uv1=Fn.getInterpolatedAttribute(r,o,c,l,u,new Ee)),a&&(d.normal=Fn.getInterpolatedAttribute(a,o,c,l,u,new D),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new D,materialIndex:0};Fn.getNormal(yr,br,wr,f.normal),d.face=f,d.barycoord=u}return d}class Ue extends kt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new pt(l,3)),this.setAttribute("normal",new pt(d,3)),this.setAttribute("uv",new pt(u,2));function g(v,p,h,_,y,S,E,w,R,P,b){const M=S/R,A=E/P,I=S/2,B=E/2,q=w/2,Z=R+1,J=P+1;let oe=0,ie=0;const me=new D;for(let Me=0;Me<J;Me++){const De=Me*A-B;for(let F=0;F<Z;F++){const Se=F*M-I;me[v]=Se*_,me[p]=De*y,me[h]=q,l.push(me.x,me.y,me.z),me[v]=0,me[p]=0,me[h]=w>0?1:-1,d.push(me.x,me.y,me.z),u.push(F/R),u.push(1-Me/P),oe+=1}}for(let Me=0;Me<P;Me++)for(let De=0;De<R;De++){const F=f+De+Z*Me,Se=f+De+Z*(Me+1),xe=f+(De+1)+Z*(Me+1),_e=f+(De+1)+Z*Me;c.push(F,Se,_e),c.push(Se,xe,_e),ie+=6}o.addGroup(m,ie,b),m+=ie,f+=oe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ue(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ys(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function ln(i){const e={};for(let t=0;t<i.length;t++){const n=ys(i[t]);for(const s in n)e[s]=n[s]}return e}function Iu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function bh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:gt.workingColorSpace}const sr={clone:ys,merge:ln};var Uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class tn extends qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Uu,this.fragmentShader=Fu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ys(e.uniforms),this.uniformsGroups=Iu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class wh extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=qn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vi=new D,Jc=new Ee,jc=new Ee;class yn extends wh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ir*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Xs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ir*2*Math.atan(Math.tan(Xs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vi.x,vi.y).multiplyScalar(-e/vi.z),vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(vi.x,vi.y).multiplyScalar(-e/vi.z)}getViewSize(e,t){return this.getViewBounds(e,Jc,jc),t.subVectors(jc,Jc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Xs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const os=-90,cs=1;class Nu extends zt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yn(os,cs,e,t);s.layers=this.layers,this.add(s);const r=new yn(os,cs,e,t);r.layers=this.layers,this.add(r);const a=new yn(os,cs,e,t);a.layers=this.layers,this.add(a);const o=new yn(os,cs,e,t);o.layers=this.layers,this.add(o);const c=new yn(os,cs,e,t);c.layers=this.layers,this.add(c);const l=new yn(os,cs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===qn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Kr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,f,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Th extends sn{constructor(e=[],t=vs,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ou extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Th(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ue(5,5,5),r=new tn({name:"CubemapFromEquirect",uniforms:ys(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:Zn});r.uniforms.tEquirect.value=t;const a=new X(s,r),o=t.minFilter;return t.minFilter===Bi&&(t.minFilter=Cn),new Nu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class at extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Bu={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),h=this._getHandJoint(l,v);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&f>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Bu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class hc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ze(e),this.near=t,this.far=n}clone(){return new hc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Eh extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ah extends sn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=wn,d=wn,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qc extends Bn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ls=new Mt,el=new Mt,Cr=[],tl=new Yi,zu=new Mt,Fs=new X,Ns=new Es;class Qt extends X{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Qc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,zu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Yi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ls),tl.copy(e.boundingBox).applyMatrix4(ls),this.boundingBox.union(tl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Es),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ls),Ns.copy(e.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(Ns)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Fs.geometry=this.geometry,Fs.material=this.material,Fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ns.copy(this.boundingSphere),Ns.applyMatrix4(n),e.ray.intersectsSphere(Ns)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ls),el.multiplyMatrices(n,ls),Fs.matrixWorld=el,Fs.raycast(e,Cr);for(let a=0,o=Cr.length;a<o;a++){const c=Cr[a];c.instanceId=r,c.object=this,t.push(c)}Cr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Qc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ah(new Float32Array(s*this.count),s,this.count,ec,Yn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ia=new D,ku=new D,Vu=new it;class Ui{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ia.subVectors(n,t).cross(ku.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ia),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Vu.getNormalMatrix(e),s=this.coplanarPoint(Ia).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Es,Gu=new Ee(.5,.5),Rr=new D;class dc{constructor(e=new Ui,t=new Ui,n=new Ui,s=new Ui,r=new Ui,a=new Ui){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],m=r[7],g=r[8],v=r[9],p=r[10],h=r[11],_=r[12],y=r[13],S=r[14],E=r[15];if(s[0].setComponents(l-a,m-d,h-g,E-_).normalize(),s[1].setComponents(l+a,m+d,h+g,E+_).normalize(),s[2].setComponents(l+o,m+u,h+v,E+y).normalize(),s[3].setComponents(l-o,m-u,h-v,E-y).normalize(),n)s[4].setComponents(c,f,p,S).normalize(),s[5].setComponents(l-c,m-f,h-p,E-S).normalize();else if(s[4].setComponents(l-c,m-f,h-p,E-S).normalize(),t===qn)s[5].setComponents(l+c,m+f,h+p,E+S).normalize();else if(t===Kr)s[5].setComponents(c,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);const t=Gu.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Rr.x=s.normal.x>0?e.max.x:e.min.x,Rr.y=s.normal.y>0?e.max.y:e.min.y,Rr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oo extends qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jr=new D,Qr=new D,nl=new Mt,Os=new cc,Pr=new Es,Ua=new D,il=new D;class sl extends zt{constructor(e=new kt,t=new Oo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)jr.fromBufferAttribute(t,s-1),Qr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=jr.distanceTo(Qr);e.setAttribute("lineDistance",new pt(n,1))}else Qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(s),Pr.radius+=r,e.ray.intersectsSphere(Pr)===!1)return;nl.copy(s).invert(),Os.copy(e.ray).applyMatrix4(nl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const m=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=l){const h=d.getX(v),_=d.getX(v+1),y=Lr(this,e,Os,c,h,_,v);y&&t.push(y)}if(this.isLineLoop){const v=d.getX(g-1),p=d.getX(m),h=Lr(this,e,Os,c,v,p,g-1);h&&t.push(h)}}else{const m=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=l){const h=Lr(this,e,Os,c,v,v+1,v);h&&t.push(h)}if(this.isLineLoop){const v=Lr(this,e,Os,c,g-1,m,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Lr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(jr.fromBufferAttribute(o,s),Qr.fromBufferAttribute(o,r),t.distanceSqToSegment(jr,Qr,Ua,il)>n)return;Ua.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ua);if(!(l<e.near||l>e.far))return{distance:l,point:il.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class un extends sn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ch extends sn{constructor(e,t,n=Gi,s,r,a,o=wn,c=wn,l,d=er,u=1){if(d!==er&&d!==tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new oc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Rh extends sn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class dn extends kt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new D,d=new Ee;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const m=n+u/t*s;l.x=e*Math.cos(m),l.y=e*Math.sin(m),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/e+1)/2,d.y=(a[f+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new pt(a,3)),this.setAttribute("normal",new pt(o,3)),this.setAttribute("uv",new pt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ht extends kt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],m=[];let g=0;const v=[],p=n/2;let h=0;_(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(d),this.setAttribute("position",new pt(u,3)),this.setAttribute("normal",new pt(f,3)),this.setAttribute("uv",new pt(m,2));function _(){const S=new D,E=new D;let w=0;const R=(t-e)/n;for(let P=0;P<=r;P++){const b=[],M=P/r,A=M*(t-e)+e;for(let I=0;I<=s;I++){const B=I/s,q=B*c+o,Z=Math.sin(q),J=Math.cos(q);E.x=A*Z,E.y=-M*n+p,E.z=A*J,u.push(E.x,E.y,E.z),S.set(Z,R,J).normalize(),f.push(S.x,S.y,S.z),m.push(B,1-M),b.push(g++)}v.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){const M=v[b][P],A=v[b+1][P],I=v[b+1][P+1],B=v[b][P+1];(e>0||b!==0)&&(d.push(M,A,B),w+=3),(t>0||b!==r-1)&&(d.push(A,I,B),w+=3)}l.addGroup(h,w,0),h+=w}function y(S){const E=g,w=new Ee,R=new D;let P=0;const b=S===!0?e:t,M=S===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,p*M,0),f.push(0,M,0),m.push(.5,.5),g++;const A=g;for(let I=0;I<=s;I++){const q=I/s*c+o,Z=Math.cos(q),J=Math.sin(q);R.x=b*J,R.y=p*M,R.z=b*Z,u.push(R.x,R.y,R.z),f.push(0,M,0),w.x=Z*.5+.5,w.y=J*.5*M+.5,m.push(w.x,w.y),g++}for(let I=0;I<s;I++){const B=E+I,q=A+I;S===!0?d.push(q,q+1,B):d.push(q+1,q,B),P+=3}l.addGroup(h,P,S===!0?1:2),h+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vi extends ht{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Vi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ia extends kt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new pt(r,3)),this.setAttribute("normal",new pt(r.slice(),3)),this.setAttribute("uv",new pt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const y=new D,S=new D,E=new D;for(let w=0;w<t.length;w+=3)m(t[w+0],y),m(t[w+1],S),m(t[w+2],E),c(y,S,E,_)}function c(_,y,S,E){const w=E+1,R=[];for(let P=0;P<=w;P++){R[P]=[];const b=_.clone().lerp(S,P/w),M=y.clone().lerp(S,P/w),A=w-P;for(let I=0;I<=A;I++)I===0&&P===w?R[P][I]=b:R[P][I]=b.clone().lerp(M,I/A)}for(let P=0;P<w;P++)for(let b=0;b<2*(w-P)-1;b++){const M=Math.floor(b/2);b%2===0?(f(R[P][M+1]),f(R[P+1][M]),f(R[P][M])):(f(R[P][M+1]),f(R[P+1][M+1]),f(R[P+1][M]))}}function l(_){const y=new D;for(let S=0;S<r.length;S+=3)y.x=r[S+0],y.y=r[S+1],y.z=r[S+2],y.normalize().multiplyScalar(_),r[S+0]=y.x,r[S+1]=y.y,r[S+2]=y.z}function d(){const _=new D;for(let y=0;y<r.length;y+=3){_.x=r[y+0],_.y=r[y+1],_.z=r[y+2];const S=p(_)/2/Math.PI+.5,E=h(_)/Math.PI+.5;a.push(S,1-E)}g(),u()}function u(){for(let _=0;_<a.length;_+=6){const y=a[_+0],S=a[_+2],E=a[_+4],w=Math.max(y,S,E),R=Math.min(y,S,E);w>.9&&R<.1&&(y<.2&&(a[_+0]+=1),S<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function m(_,y){const S=_*3;y.x=e[S+0],y.y=e[S+1],y.z=e[S+2]}function g(){const _=new D,y=new D,S=new D,E=new D,w=new Ee,R=new Ee,P=new Ee;for(let b=0,M=0;b<r.length;b+=9,M+=6){_.set(r[b+0],r[b+1],r[b+2]),y.set(r[b+3],r[b+4],r[b+5]),S.set(r[b+6],r[b+7],r[b+8]),w.set(a[M+0],a[M+1]),R.set(a[M+2],a[M+3]),P.set(a[M+4],a[M+5]),E.copy(_).add(y).add(S).divideScalar(3);const A=p(E);v(w,M+0,_,A),v(R,M+2,y,A),v(P,M+4,S,A)}}function v(_,y,S,E){E<0&&_.x===1&&(a[y]=_.x-1),S.x===0&&S.z===0&&(a[y]=E/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function h(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ia(e.vertices,e.indices,e.radius,e.details)}}class uc extends ia{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new uc(e.radius,e.detail)}}class Jn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,m=(a-d)/f;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Ee:new D);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new D,s=[],r=[],a=[],o=new D,c=new Mt;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new D)}r[0]=new D,a[0]=new D;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ot(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(ot(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fc extends Jn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ee){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,m=l-this.aY;c=f*d-m*u+this.aX,l=f*u+m*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Hu extends fc{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function pc(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,m*=d,s(a,o,f,m)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Dr=new D,Fa=new pc,Na=new pc,Oa=new pc;class Wu extends Jn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(Dr.subVectors(s[0],s[1]).add(s[0]),l=Dr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Dr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),v=Math.pow(u.distanceToSquared(f),m),p=Math.pow(f.distanceToSquared(d),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Fa.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,g,v,p),Na.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,g,v,p),Oa.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,g,v,p)}else this.curveType==="catmullrom"&&(Fa.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),Na.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),Oa.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(Fa.calc(c),Na.calc(c),Oa.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function rl(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Xu(i,e){const t=1-i;return t*t*e}function Yu(i,e){return 2*(1-i)*i*e}function qu(i,e){return i*i*e}function qs(i,e,t,n){return Xu(i,e)+Yu(i,t)+qu(i,n)}function Zu(i,e){const t=1-i;return t*t*t*e}function $u(i,e){const t=1-i;return 3*t*t*i*e}function Ku(i,e){return 3*(1-i)*i*i*e}function Ju(i,e){return i*i*i*e}function Zs(i,e,t,n,s){return Zu(i,e)+$u(i,t)+Ku(i,n)+Ju(i,s)}class Ph extends Jn{constructor(e=new Ee,t=new Ee,n=new Ee,s=new Ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ee){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(e,s.x,r.x,a.x,o.x),Zs(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ju extends Jn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(e,s.x,r.x,a.x,o.x),Zs(e,s.y,r.y,a.y,o.y),Zs(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Lh extends Jn{constructor(e=new Ee,t=new Ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ee){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qu extends Jn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Dh extends Jn{constructor(e=new Ee,t=new Ee,n=new Ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ee){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(qs(e,s.x,r.x,a.x),qs(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ef extends Jn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(qs(e,s.x,r.x,a.x),qs(e,s.y,r.y,a.y),qs(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ih extends Jn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ee){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(rl(o,c.x,l.x,d.x,u.x),rl(o,c.y,l.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Ee().fromArray(s))}return this}}var al=Object.freeze({__proto__:null,ArcCurve:Hu,CatmullRomCurve3:Wu,CubicBezierCurve:Ph,CubicBezierCurve3:ju,EllipseCurve:fc,LineCurve:Lh,LineCurve3:Qu,QuadraticBezierCurve:Dh,QuadraticBezierCurve3:ef,SplineCurve:Ih});class tf extends Jn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new al[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new al[s.type]().fromJSON(s))}return this}}class ol extends tf{constructor(e){super(),this.type="Path",this.currentPoint=new Ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Lh(this.currentPoint.clone(),new Ee(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Dh(this.currentPoint.clone(),new Ee(e,t),new Ee(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Ph(this.currentPoint.clone(),new Ee(e,t),new Ee(n,s),new Ee(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Ih(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new fc(e,t,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Uh extends ol{constructor(e){super(e),this.uuid=Xi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new ol().fromJSON(s))}return this}}function nf(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Fh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=cf(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let d=o,u=c;for(let f=t;f<s;f+=t){const m=i[f],g=i[f+1];m<o&&(o=m),g<c&&(c=g),m>d&&(d=m),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return rr(r,a,t,o,c,l,0),a}function Fh(i,e,t,n,s){let r;if(s===vf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=cl(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=cl(a/n|0,i[a],i[a+1],r);return r&&bs(r,r.next)&&(or(r),r=r.next),r}function Hi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(bs(t,t.next)||Ft(t.prev,t,t.next)===0)){if(or(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function rr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&ff(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?rf(i,n,s,r):sf(i)){e.push(c.i,i.i,l.i),or(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=af(Hi(i),e),rr(i,e,t,n,s,r,2)):a===2&&of(i,e,t,n,s,r):rr(Hi(i),e,t,n,s,r,1);break}}}function sf(i){const e=i.prev,t=i,n=i.next;if(Ft(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),m=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=f&&g.y>=u&&g.y<=m&&Vs(s,o,r,c,a,l,g.x,g.y)&&Ft(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function rf(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Ft(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,m=Math.min(o,c,l),g=Math.min(d,u,f),v=Math.max(o,c,l),p=Math.max(d,u,f),h=Bo(m,g,e,t,n),_=Bo(v,p,e,t,n);let y=i.prevZ,S=i.nextZ;for(;y&&y.z>=h&&S&&S.z<=_;){if(y.x>=m&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Vs(o,d,c,u,l,f,y.x,y.y)&&Ft(y.prev,y,y.next)>=0||(y=y.prevZ,S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==s&&S!==a&&Vs(o,d,c,u,l,f,S.x,S.y)&&Ft(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;y&&y.z>=h;){if(y.x>=m&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Vs(o,d,c,u,l,f,y.x,y.y)&&Ft(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;S&&S.z<=_;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==s&&S!==a&&Vs(o,d,c,u,l,f,S.x,S.y)&&Ft(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function af(i,e){let t=i;do{const n=t.prev,s=t.next.next;!bs(n,s)&&Oh(n,t,t.next,s)&&ar(n,s)&&ar(s,n)&&(e.push(n.i,t.i,s.i),or(t),or(t.next),t=i=s),t=t.next}while(t!==i);return Hi(t)}function of(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&xf(a,o)){let c=Bh(a,o);a=Hi(a,a.next),c=Hi(c,c.next),rr(a,e,t,n,s,r,0),rr(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function cf(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=Fh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(mf(l))}s.sort(lf);for(let r=0;r<s.length;r++)t=hf(s[r],t);return t}function lf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function hf(i,e){const t=df(i,e);if(!t)return e;const n=Bh(t,i);return Hi(n,n.next),Hi(t,t.next)}function df(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(bs(i,t))return t;do{if(bs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Nh(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);ar(t,i)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&uf(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function uf(i,e){return Ft(i.prev,i,e.prev)<0&&Ft(e.next,i,i.next)<0}function ff(i,e,t,n){let s=i;do s.z===0&&(s.z=Bo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,pf(s)}function pf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Bo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function mf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Nh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Vs(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Nh(i,e,t,n,s,r,a,o)}function xf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!gf(i,e)&&(ar(i,e)&&ar(e,i)&&_f(i,e)&&(Ft(i.prev,i,e.prev)||Ft(i,e.prev,e))||bs(i,e)&&Ft(i.prev,i,i.next)>0&&Ft(e.prev,e,e.next)>0)}function Ft(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function bs(i,e){return i.x===e.x&&i.y===e.y}function Oh(i,e,t,n){const s=Ur(Ft(i,e,t)),r=Ur(Ft(i,e,n)),a=Ur(Ft(t,n,i)),o=Ur(Ft(t,n,e));return!!(s!==r&&a!==o||s===0&&Ir(i,t,e)||r===0&&Ir(i,n,e)||a===0&&Ir(t,i,n)||o===0&&Ir(t,e,n))}function Ir(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ur(i){return i>0?1:i<0?-1:0}function gf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Oh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ar(i,e){return Ft(i.prev,i,i.next)<0?Ft(i,e,i.next)>=0&&Ft(i,i.prev,e)>=0:Ft(i,e,i.prev)<0||Ft(i,i.next,e)<0}function _f(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Bh(i,e){const t=zo(i.i,i.x,i.y),n=zo(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function cl(i,e,t,n){const s=zo(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function or(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function zo(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function vf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Mf{static triangulate(e,t,n=2){return nf(e,t,n)}}class $s{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return $s.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];ll(e),hl(n,e);let a=e.length;t.forEach(ll);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,hl(n,t[c]);const o=Mf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function ll(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function hl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class mc extends ia{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new mc(e.radius,e.detail)}}class Ut extends kt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=e/o,f=t/c,m=[],g=[],v=[],p=[];for(let h=0;h<d;h++){const _=h*f-a;for(let y=0;y<l;y++){const S=y*u-r;g.push(S,-_,0),v.push(0,0,1),p.push(y/o),p.push(1-h/c)}}for(let h=0;h<c;h++)for(let _=0;_<o;_++){const y=_+l*h,S=_+l*(h+1),E=_+1+l*(h+1),w=_+1+l*h;m.push(y,S,w),m.push(S,E,w)}this.setIndex(m),this.setAttribute("position",new pt(g,3)),this.setAttribute("normal",new pt(v,3)),this.setAttribute("uv",new pt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ut(e.width,e.height,e.widthSegments,e.heightSegments)}}class xc extends kt{constructor(e=new Uh([new Ee(0,.5),new Ee(-.5,-.5),new Ee(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new pt(s,3)),this.setAttribute("normal",new pt(r,3)),this.setAttribute("uv",new pt(a,2));function l(d){const u=s.length/3,f=d.extractPoints(t);let m=f.shape;const g=f.holes;$s.isClockWise(m)===!1&&(m=m.reverse());for(let p=0,h=g.length;p<h;p++){const _=g[p];$s.isClockWise(_)===!0&&(g[p]=_.reverse())}const v=$s.triangulateShape(m,g);for(let p=0,h=g.length;p<h;p++){const _=g[p];m=m.concat(_)}for(let p=0,h=m.length;p<h;p++){const _=m[p];s.push(_.x,_.y,0),r.push(0,0,1),a.push(_.x,_.y)}for(let p=0,h=v.length;p<h;p++){const _=v[p],y=_[0]+u,S=_[1]+u,E=_[2]+u;n.push(y,S,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Sf(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new xc(n,e.curveSegments)}}function Sf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Ht extends kt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new D,f=new D,m=[],g=[],v=[],p=[];for(let h=0;h<=n;h++){const _=[],y=h/n;let S=0;h===0&&a===0?S=.5/t:h===n&&c===Math.PI&&(S=-.5/t);for(let E=0;E<=t;E++){const w=E/t;u.x=-e*Math.cos(s+w*r)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(s+w*r)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),p.push(w+S,1-y),_.push(l++)}d.push(_)}for(let h=0;h<n;h++)for(let _=0;_<t;_++){const y=d[h][_+1],S=d[h][_],E=d[h+1][_],w=d[h+1][_+1];(h!==0||a>0)&&m.push(y,S,w),(h!==n-1||c<Math.PI)&&m.push(S,E,w)}this.setIndex(m),this.setAttribute("position",new pt(g,3)),this.setAttribute("normal",new pt(v,3)),this.setAttribute("uv",new pt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ht(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class cr extends kt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new D,u=new D,f=new D;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const v=g/s*r,p=m/n*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(v),u.y=(e+t*Math.cos(p))*Math.sin(v),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),d.x=e*Math.cos(v),d.y=e*Math.sin(v),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const v=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,h=(s+1)*(m-1)+g,_=(s+1)*m+g;a.push(v,p,_),a.push(p,h,_)}this.setIndex(a),this.setAttribute("position",new pt(o,3)),this.setAttribute("normal",new pt(c,3)),this.setAttribute("uv",new pt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class yf extends tn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class K extends qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class bf extends qi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=$o,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wf extends qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Tf extends qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class gc extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ef extends gc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ba=new Mt,dl=new D,ul=new D;class zh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.mapType=Kn,this.map=null,this.mapPass=null,this.matrix=new Mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dc,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;dl.setFromMatrixPosition(e.matrixWorld),t.position.copy(dl),ul.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ul),t.updateMatrixWorld(),Ba.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ba,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ba)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const fl=new Mt,Bs=new D,za=new D;class Af extends zh{constructor(){super(new yn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ee(4,2),this._viewportCount=6,this._viewports=[new At(2,1,1,1),new At(0,1,1,1),new At(3,1,1,1),new At(1,1,1,1),new At(3,0,1,1),new At(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Bs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Bs),za.copy(n.position),za.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(za),n.updateMatrixWorld(),s.makeTranslation(-Bs.x,-Bs.y,-Bs.z),fl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fl,n.coordinateSystem,n.reversedDepth)}}class _c extends gc{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Af}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class vc extends wh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Cf extends zh{constructor(){super(new vc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class pl extends gc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new Cf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Rf extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class kh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const ml=new Mt;class Pf{constructor(e,t,n=0,s=1/0){this.ray=new cc(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new lc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Bt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ml.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ml),this}intersectObject(e,t=!0,n=[]){return ko(e,this,n,t),n.sort(xl),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ko(e[s],this,n,t);return n.sort(xl),n}}function xl(i,e){return i.distance-e.distance}function ko(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)ko(r[a],e,t,!0)}}function gl(i,e,t,n){const s=Lf(n);switch(t){case mh:return i*e;case ec:return i*e/s.components*s.byteLength;case tc:return i*e/s.components*s.byteLength;case nc:return i*e*2/s.components*s.byteLength;case ic:return i*e*2/s.components*s.byteLength;case xh:return i*e*3/s.components*s.byteLength;case Nn:return i*e*4/s.components*s.byteLength;case sc:return i*e*4/s.components*s.byteLength;case kr:case Vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Gr:case Hr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case lo:case uo:return Math.max(i,16)*Math.max(e,8)/4;case co:case ho:return Math.max(i,8)*Math.max(e,8)/2;case fo:case po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case _o:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case vo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case So:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case yo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case To:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Co:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ro:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Po:case Lo:case Do:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Io:case Uo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Fo:case No:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Lf(i){switch(i){case Kn:case dh:return{byteLength:1,components:1};case js:case uh:case $n:return{byteLength:2,components:1};case jo:case Qo:return{byteLength:2,components:4};case Gi:case Jo:case Yn:return{byteLength:4,components:1};case fh:case ph:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zo}}));typeof window<"u"&&(window.__THREE__?Qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zo);function Vh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Df(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<u.length;m++){const g=u[f],v=u[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let m=0,g=u.length;m<g;m++){const v=u[m];i.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var If=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Uf=`#ifdef USE_ALPHAHASH
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
#endif`,Ff=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Nf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Of=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zf=`#ifdef USE_AOMAP
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
#endif`,kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vf=`#ifdef USE_BATCHING
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
#endif`,Gf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Yf=`#ifdef USE_IRIDESCENCE
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
#endif`,qf=`#ifdef USE_BUMPMAP
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
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,e0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,t0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,n0=`#define PI 3.141592653589793
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
} // validated`,i0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,s0=`vec3 transformedNormal = objectNormal;
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
#endif`,r0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,a0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,c0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,l0="gl_FragColor = linearToOutputTexel( gl_FragColor );",h0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,d0=`#ifdef USE_ENVMAP
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
#endif`,u0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
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
#endif`,p0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,m0=`#ifdef USE_ENVMAP
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
#endif`,x0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,g0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,v0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,M0=`#ifdef USE_GRADIENTMAP
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
}`,S0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,y0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w0=`uniform bool receiveShadow;
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
#endif`,T0=`#ifdef USE_ENVMAP
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
#endif`,E0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,A0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,C0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,R0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,P0=`PhysicalMaterial material;
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
#endif`,L0=`uniform sampler2D dfgLUT;
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
}`,D0=`
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
#endif`,I0=`#if defined( RE_IndirectDiffuse )
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
#endif`,U0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,F0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,N0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,O0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,B0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,z0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,k0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,V0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,G0=`#if defined( USE_POINTS_UV )
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
#endif`,H0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,W0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,X0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Y0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,q0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Z0=`#ifdef USE_MORPHTARGETS
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
#endif`,$0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,K0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,J0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,j0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ep=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tp=`#ifdef USE_NORMALMAP
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
#endif`,np=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ip=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ap=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,op=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,up=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,gp=`float getShadowMask() {
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
}`,_p=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vp=`#ifdef USE_SKINNING
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
#endif`,Mp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sp=`#ifdef USE_SKINNING
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
#endif`,yp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ep=`#ifdef USE_TRANSMISSION
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
#endif`,Ap=`#ifdef USE_TRANSMISSION
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
#endif`,Cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ip=`uniform sampler2D t2D;
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
}`,Up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Np=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Op=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bp=`#include <common>
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
}`,zp=`#if DEPTH_PACKING == 3200
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
}`,kp=`#define DISTANCE
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
}`,Vp=`#define DISTANCE
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
}`,Gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Hp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wp=`uniform float scale;
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
}`,Xp=`uniform vec3 diffuse;
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
}`,Yp=`#include <common>
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
}`,qp=`uniform vec3 diffuse;
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
}`,Zp=`#define LAMBERT
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
}`,$p=`#define LAMBERT
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
}`,Kp=`#define MATCAP
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
}`,Jp=`#define MATCAP
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
}`,jp=`#define NORMAL
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
}`,Qp=`#define NORMAL
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
}`,em=`#define PHONG
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
}`,tm=`#define PHONG
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
}`,nm=`#define STANDARD
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
}`,im=`#define STANDARD
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
}`,sm=`#define TOON
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
}`,rm=`#define TOON
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
}`,am=`uniform float size;
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
}`,om=`uniform vec3 diffuse;
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
}`,cm=`#include <common>
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
}`,lm=`uniform vec3 color;
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
}`,hm=`uniform float rotation;
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
}`,dm=`uniform vec3 diffuse;
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
}`,st={alphahash_fragment:If,alphahash_pars_fragment:Uf,alphamap_fragment:Ff,alphamap_pars_fragment:Nf,alphatest_fragment:Of,alphatest_pars_fragment:Bf,aomap_fragment:zf,aomap_pars_fragment:kf,batching_pars_vertex:Vf,batching_vertex:Gf,begin_vertex:Hf,beginnormal_vertex:Wf,bsdfs:Xf,iridescence_fragment:Yf,bumpmap_pars_fragment:qf,clipping_planes_fragment:Zf,clipping_planes_pars_fragment:$f,clipping_planes_pars_vertex:Kf,clipping_planes_vertex:Jf,color_fragment:jf,color_pars_fragment:Qf,color_pars_vertex:e0,color_vertex:t0,common:n0,cube_uv_reflection_fragment:i0,defaultnormal_vertex:s0,displacementmap_pars_vertex:r0,displacementmap_vertex:a0,emissivemap_fragment:o0,emissivemap_pars_fragment:c0,colorspace_fragment:l0,colorspace_pars_fragment:h0,envmap_fragment:d0,envmap_common_pars_fragment:u0,envmap_pars_fragment:f0,envmap_pars_vertex:p0,envmap_physical_pars_fragment:T0,envmap_vertex:m0,fog_vertex:x0,fog_pars_vertex:g0,fog_fragment:_0,fog_pars_fragment:v0,gradientmap_pars_fragment:M0,lightmap_pars_fragment:S0,lights_lambert_fragment:y0,lights_lambert_pars_fragment:b0,lights_pars_begin:w0,lights_toon_fragment:E0,lights_toon_pars_fragment:A0,lights_phong_fragment:C0,lights_phong_pars_fragment:R0,lights_physical_fragment:P0,lights_physical_pars_fragment:L0,lights_fragment_begin:D0,lights_fragment_maps:I0,lights_fragment_end:U0,logdepthbuf_fragment:F0,logdepthbuf_pars_fragment:N0,logdepthbuf_pars_vertex:O0,logdepthbuf_vertex:B0,map_fragment:z0,map_pars_fragment:k0,map_particle_fragment:V0,map_particle_pars_fragment:G0,metalnessmap_fragment:H0,metalnessmap_pars_fragment:W0,morphinstance_vertex:X0,morphcolor_vertex:Y0,morphnormal_vertex:q0,morphtarget_pars_vertex:Z0,morphtarget_vertex:$0,normal_fragment_begin:K0,normal_fragment_maps:J0,normal_pars_fragment:j0,normal_pars_vertex:Q0,normal_vertex:ep,normalmap_pars_fragment:tp,clearcoat_normal_fragment_begin:np,clearcoat_normal_fragment_maps:ip,clearcoat_pars_fragment:sp,iridescence_pars_fragment:rp,opaque_fragment:ap,packing:op,premultiplied_alpha_fragment:cp,project_vertex:lp,dithering_fragment:hp,dithering_pars_fragment:dp,roughnessmap_fragment:up,roughnessmap_pars_fragment:fp,shadowmap_pars_fragment:pp,shadowmap_pars_vertex:mp,shadowmap_vertex:xp,shadowmask_pars_fragment:gp,skinbase_vertex:_p,skinning_pars_vertex:vp,skinning_vertex:Mp,skinnormal_vertex:Sp,specularmap_fragment:yp,specularmap_pars_fragment:bp,tonemapping_fragment:wp,tonemapping_pars_fragment:Tp,transmission_fragment:Ep,transmission_pars_fragment:Ap,uv_pars_fragment:Cp,uv_pars_vertex:Rp,uv_vertex:Pp,worldpos_vertex:Lp,background_vert:Dp,background_frag:Ip,backgroundCube_vert:Up,backgroundCube_frag:Fp,cube_vert:Np,cube_frag:Op,depth_vert:Bp,depth_frag:zp,distanceRGBA_vert:kp,distanceRGBA_frag:Vp,equirect_vert:Gp,equirect_frag:Hp,linedashed_vert:Wp,linedashed_frag:Xp,meshbasic_vert:Yp,meshbasic_frag:qp,meshlambert_vert:Zp,meshlambert_frag:$p,meshmatcap_vert:Kp,meshmatcap_frag:Jp,meshnormal_vert:jp,meshnormal_frag:Qp,meshphong_vert:em,meshphong_frag:tm,meshphysical_vert:nm,meshphysical_frag:im,meshtoon_vert:sm,meshtoon_frag:rm,points_vert:am,points_frag:om,shadow_vert:cm,shadow_frag:lm,sprite_vert:hm,sprite_frag:dm},Ae={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new it},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new it}},envmap:{envMap:{value:null},envMapRotation:{value:new it},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new it}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new it}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new it},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new it},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new it},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new it}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new it}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new it}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0},uvTransform:{value:new it}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new it},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0}}},Hn={basic:{uniforms:ln([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:ln([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Ze(0)}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:ln([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:ln([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:ln([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new Ze(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:ln([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:ln([Ae.points,Ae.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:ln([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:ln([Ae.common,Ae.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:ln([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:ln([Ae.sprite,Ae.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new it},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new it}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distanceRGBA:{uniforms:ln([Ae.common,Ae.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distanceRGBA_vert,fragmentShader:st.distanceRGBA_frag},shadow:{uniforms:ln([Ae.lights,Ae.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};Hn.physical={uniforms:ln([Hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new it},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new it},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new it},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new it},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new it},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new it},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new it},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new it},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new it},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new it},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new it},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new it}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};const Fr={r:0,b:0,g:0},Di=new kn,um=new Mt;function fm(i,e,t,n,s,r,a){const o=new Ze(0);let c=r===!0?0:1,l,d,u=null,f=0,m=null;function g(y){let S=y.isScene===!0?y.background:null;return S&&S.isTexture&&(S=(y.backgroundBlurriness>0?t:e).get(S)),S}function v(y){let S=!1;const E=g(y);E===null?h(o,c):E&&E.isColor&&(h(E,1),S=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(y,S){const E=g(S);E&&(E.isCubeTexture||E.mapping===na)?(d===void 0&&(d=new X(new Ue(1,1,1),new tn({name:"BackgroundCubeMaterial",uniforms:ys(Hn.backgroundCube.uniforms),vertexShader:Hn.backgroundCube.vertexShader,fragmentShader:Hn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,R,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Di.copy(S.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(um.makeRotationFromEuler(Di)),d.material.toneMapped=gt.getTransfer(E.colorSpace)!==yt,(u!==E||f!==E.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,m=i.toneMapping),d.layers.enableAll(),y.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new X(new Ut(2,2),new tn({name:"BackgroundMaterial",uniforms:ys(Hn.background.uniforms),vertexShader:Hn.background.vertexShader,fragmentShader:Hn.background.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=gt.getTransfer(E.colorSpace)!==yt,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,m=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function h(y,S){y.getRGB(Fr,bh(i)),n.buffers.color.setClear(Fr.r,Fr.g,Fr.b,S,a)}function _(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,S=1){o.set(y),c=S,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,h(o,c)},render:v,addToRenderList:p,dispose:_}}function pm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(M,A,I,B,q){let Z=!1;const J=u(B,I,A);r!==J&&(r=J,l(r.object)),Z=m(M,B,I,q),Z&&g(M,B,I,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,S(M,A,I,B),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function d(M){return i.deleteVertexArray(M)}function u(M,A,I){const B=I.wireframe===!0;let q=n[M.id];q===void 0&&(q={},n[M.id]=q);let Z=q[A.id];Z===void 0&&(Z={},q[A.id]=Z);let J=Z[B];return J===void 0&&(J=f(c()),Z[B]=J),J}function f(M){const A=[],I=[],B=[];for(let q=0;q<t;q++)A[q]=0,I[q]=0,B[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:I,attributeDivisors:B,object:M,attributes:{},index:null}}function m(M,A,I,B){const q=r.attributes,Z=A.attributes;let J=0;const oe=I.getAttributes();for(const ie in oe)if(oe[ie].location>=0){const Me=q[ie];let De=Z[ie];if(De===void 0&&(ie==="instanceMatrix"&&M.instanceMatrix&&(De=M.instanceMatrix),ie==="instanceColor"&&M.instanceColor&&(De=M.instanceColor)),Me===void 0||Me.attribute!==De||De&&Me.data!==De.data)return!0;J++}return r.attributesNum!==J||r.index!==B}function g(M,A,I,B){const q={},Z=A.attributes;let J=0;const oe=I.getAttributes();for(const ie in oe)if(oe[ie].location>=0){let Me=Z[ie];Me===void 0&&(ie==="instanceMatrix"&&M.instanceMatrix&&(Me=M.instanceMatrix),ie==="instanceColor"&&M.instanceColor&&(Me=M.instanceColor));const De={};De.attribute=Me,Me&&Me.data&&(De.data=Me.data),q[ie]=De,J++}r.attributes=q,r.attributesNum=J,r.index=B}function v(){const M=r.newAttributes;for(let A=0,I=M.length;A<I;A++)M[A]=0}function p(M){h(M,0)}function h(M,A){const I=r.newAttributes,B=r.enabledAttributes,q=r.attributeDivisors;I[M]=1,B[M]===0&&(i.enableVertexAttribArray(M),B[M]=1),q[M]!==A&&(i.vertexAttribDivisor(M,A),q[M]=A)}function _(){const M=r.newAttributes,A=r.enabledAttributes;for(let I=0,B=A.length;I<B;I++)A[I]!==M[I]&&(i.disableVertexAttribArray(I),A[I]=0)}function y(M,A,I,B,q,Z,J){J===!0?i.vertexAttribIPointer(M,A,I,q,Z):i.vertexAttribPointer(M,A,I,B,q,Z)}function S(M,A,I,B){v();const q=B.attributes,Z=I.getAttributes(),J=A.defaultAttributeValues;for(const oe in Z){const ie=Z[oe];if(ie.location>=0){let me=q[oe];if(me===void 0&&(oe==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),oe==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),me!==void 0){const Me=me.normalized,De=me.itemSize,F=e.get(me);if(F===void 0)continue;const Se=F.buffer,xe=F.type,_e=F.bytesPerElement,G=xe===i.INT||xe===i.UNSIGNED_INT||me.gpuType===Jo;if(me.isInterleavedBufferAttribute){const Y=me.data,pe=Y.stride,be=me.offset;if(Y.isInstancedInterleavedBuffer){for(let Te=0;Te<ie.locationSize;Te++)h(ie.location+Te,Y.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let Te=0;Te<ie.locationSize;Te++)p(ie.location+Te);i.bindBuffer(i.ARRAY_BUFFER,Se);for(let Te=0;Te<ie.locationSize;Te++)y(ie.location+Te,De/ie.locationSize,xe,Me,pe*_e,(be+De/ie.locationSize*Te)*_e,G)}else{if(me.isInstancedBufferAttribute){for(let Y=0;Y<ie.locationSize;Y++)h(ie.location+Y,me.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Y=0;Y<ie.locationSize;Y++)p(ie.location+Y);i.bindBuffer(i.ARRAY_BUFFER,Se);for(let Y=0;Y<ie.locationSize;Y++)y(ie.location+Y,De/ie.locationSize,xe,Me,De*_e,De/ie.locationSize*Y*_e,G)}}else if(J!==void 0){const Me=J[oe];if(Me!==void 0)switch(Me.length){case 2:i.vertexAttrib2fv(ie.location,Me);break;case 3:i.vertexAttrib3fv(ie.location,Me);break;case 4:i.vertexAttrib4fv(ie.location,Me);break;default:i.vertexAttrib1fv(ie.location,Me)}}}}_()}function E(){P();for(const M in n){const A=n[M];for(const I in A){const B=A[I];for(const q in B)d(B[q].object),delete B[q];delete A[I]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const A=n[M.id];for(const I in A){const B=A[I];for(const q in B)d(B[q].object),delete B[q];delete A[I]}delete n[M.id]}function R(M){for(const A in n){const I=n[A];if(I[M.id]===void 0)continue;const B=I[M.id];for(const q in B)d(B[q].object),delete B[q];delete I[M.id]}}function P(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:p,disableUnusedAttributes:_}}function mm(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),t.update(d,n,u))}function o(l,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let m=0;for(let g=0;g<u;g++)m+=d[g];t.update(m,n,1)}function c(l,d,u,f){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=d[v]*f[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function xm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Nn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const P=R===$n&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Kn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Yn&&!P)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(Qe("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:E,maxSamples:w}}function gm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Ui,o=new it,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||n!==0||s;return s=f,n=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=d(u,f,0)},this.setState=function(u,f,m){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?d(null):l();else{const _=r?0:n,y=_*4;let S=h.clippingState||null;c.value=S,S=d(g,f,y,m);for(let E=0;E!==y;++E)S[E]=t[E];h.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,f,m,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=c.value,g!==!0||p===null){const h=m+v*4,_=f.matrixWorldInverse;o.getNormalMatrix(_),(p===null||p.length<h)&&(p=new Float32Array(h));for(let y=0,S=m;y!==v;++y,S+=4)a.copy(u[y]).applyMatrix4(_,o),a.normal.toArray(p,S),p[S+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function _m(i){let e=new WeakMap;function t(a,o){return o===ro?a.mapping=vs:o===ao&&(a.mapping=Ms),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ro||o===ao)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Ou(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const yi=4,_l=[.125,.215,.35,.446,.526,.582],Ni=20,vm=256,zs=new vc,vl=new Ze;let ka=null,Va=0,Ga=0,Ha=!1;const Mm=new D;class Vo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Mm}=r;ka=this._renderer.getRenderTarget(),Va=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ka,Va,Ga),this._renderer.xr.enabled=Ha,e.scissorTest=!1,hs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===vs||e.mapping===Ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ka=this._renderer.getRenderTarget(),Va=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:$n,format:Nn,colorSpace:Ss,depthBuffer:!1},s=Ml(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ml(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Sm(r)),this._blurMaterial=bm(r,e,t),this._ggxMaterial=ym(r,e,t)}return s}_compileMaterial(e){const t=new X(new kt,e);this._renderer.compile(t,zs)}_sceneToCubeUV(e,t,n,s,r){const c=new yn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(vl),u.toneMapping=wi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new X(new Ue,new Et({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let h=!1;const _=e.background;_?_.isColor&&(p.color.copy(_),e.background=null,h=!0):(p.color.copy(vl),h=!0);for(let y=0;y<6;y++){const S=y%3;S===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[y],r.y,r.z)):S===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[y]));const E=this._cubeSize;hs(s,S*E,y>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(v,c),u.render(e,c)}u.toneMapping=m,u.autoClear=f,e.background=_}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===vs||e.mapping===Ms;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;hs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,zs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,m=u*f,{_lodMax:g}=this,v=this._sizeLods[n],p=3*v*(n>g-yi?n-g+yi:0),h=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-t,hs(r,p,h,3*v,2*v),s.setRenderTarget(r),s.render(o,zs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,hs(e,p,h,3*v,2*v),s.setRenderTarget(e),s.render(o,zs)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Bt("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ni-1),v=r/g,p=isFinite(r)?1+Math.floor(d*v):Ni;p>Ni&&Qe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ni}`);const h=[];let _=0;for(let R=0;R<Ni;++R){const P=R/v,b=Math.exp(-P*P/2);h.push(b),R===0?_+=b:R<p&&(_+=2*b)}for(let R=0;R<h.length;R++)h[R]=h[R]/_;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const S=this._sizeLods[s],E=3*S*(s>y-yi?s-y+yi:0),w=4*(this._cubeSize-S);hs(t,E,w,3*S,2*S),c.setRenderTarget(t),c.render(u,zs)}}function Sm(i){const e=[],t=[],n=[];let s=i;const r=i-yi+1+_l.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-yi?c=_l[a-i+yi-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,g=6,v=3,p=2,h=1,_=new Float32Array(v*g*m),y=new Float32Array(p*g*m),S=new Float32Array(h*g*m);for(let w=0;w<m;w++){const R=w%3*2/3-1,P=w>2?0:-1,b=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];_.set(b,v*g*w),y.set(f,p*g*w);const M=[w,w,w,w,w,w];S.set(M,h*g*w)}const E=new kt;E.setAttribute("position",new Bn(_,v)),E.setAttribute("uv",new Bn(y,p)),E.setAttribute("faceIndex",new Bn(S,h)),n.push(new X(E,null)),s>yi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Ml(i,e,t){const n=new On(i,e,t);return n.texture.mapping=na,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function ym(i,e,t){return new tn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:vm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:sa(),fragmentShader:`

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
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function bm(i,e,t){const n=new Float32Array(Ni),s=new D(0,1,0);return new tn({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:sa(),fragmentShader:`

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
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Sl(){return new tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sa(),fragmentShader:`

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
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function yl(){return new tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function sa(){return`

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
	`}function wm(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===ro||c===ao,d=c===vs||c===Ms;if(l||d){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Vo(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return l&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Vo(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Tm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&nr("WebGLRenderer: "+n+" extension not supported."),s}}}function Em(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function l(u){const f=[],m=u.index,g=u.attributes.position;let v=0;if(m!==null){const _=m.array;v=m.version;for(let y=0,S=_.length;y<S;y+=3){const E=_[y+0],w=_[y+1],R=_[y+2];f.push(E,w,w,R,R,E)}}else if(g!==void 0){const _=g.array;v=g.version;for(let y=0,S=_.length/3-1;y<S;y+=3){const E=y+0,w=y+1,R=y+2;f.push(E,w,w,R,R,E)}}else return;const p=new(_h(f)?yh:Sh)(f,1);p.version=v;const h=r.get(u);h&&e.remove(h),r.set(u,p)}function d(u){const f=r.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function Am(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,m){i.drawElements(n,m,r,f*a),t.update(m,n,1)}function l(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,f*a,g),t.update(m,n,g))}function d(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,g);let p=0;for(let h=0;h<g;h++)p+=m[h];t.update(p,n,1)}function u(f,m,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<f.length;h++)l(f[h]/a,m[h],v[h]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,v,0,g);let h=0;for(let _=0;_<g;_++)h+=m[_]*v[_];t.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Cm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Bt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Rm(i,e,t){const n=new WeakMap,s=new At;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let M=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var m=M;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),v===!0&&(S=2),p===!0&&(S=3);let E=o.attributes.position.count*S,w=1;E>e.maxTextureSize&&(w=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*w*4*u),P=new vh(R,E,w,u);P.type=Yn,P.needsUpdate=!0;const b=S*4;for(let A=0;A<u;A++){const I=h[A],B=_[A],q=y[A],Z=E*w*4*A;for(let J=0;J<I.count;J++){const oe=J*b;g===!0&&(s.fromBufferAttribute(I,J),R[Z+oe+0]=s.x,R[Z+oe+1]=s.y,R[Z+oe+2]=s.z,R[Z+oe+3]=0),v===!0&&(s.fromBufferAttribute(B,J),R[Z+oe+4]=s.x,R[Z+oe+5]=s.y,R[Z+oe+6]=s.z,R[Z+oe+7]=0),p===!0&&(s.fromBufferAttribute(q,J),R[Z+oe+8]=s.x,R[Z+oe+9]=s.y,R[Z+oe+10]=s.z,R[Z+oe+11]=q.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new Ee(E,w)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const v=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Pm(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Gh=new sn,bl=new Ch(1,1),Hh=new vh,Wh=new Su,Xh=new Th,wl=[],Tl=[],El=new Float32Array(16),Al=new Float32Array(9),Cl=new Float32Array(4);function As(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=wl[s];if(r===void 0&&(r=new Float32Array(s),wl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ra(i,e){let t=Tl[e];t===void 0&&(t=new Int32Array(e),Tl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Lm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Dm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2fv(this.addr,e),Xt(t,e)}}function Im(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;i.uniform3fv(this.addr,e),Xt(t,e)}}function Um(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4fv(this.addr,e),Xt(t,e)}}function Fm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Cl.set(n),i.uniformMatrix2fv(this.addr,!1,Cl),Xt(t,n)}}function Nm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Al.set(n),i.uniformMatrix3fv(this.addr,!1,Al),Xt(t,n)}}function Om(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;El.set(n),i.uniformMatrix4fv(this.addr,!1,El),Xt(t,n)}}function Bm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2iv(this.addr,e),Xt(t,e)}}function km(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3iv(this.addr,e),Xt(t,e)}}function Vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4iv(this.addr,e),Xt(t,e)}}function Gm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2uiv(this.addr,e),Xt(t,e)}}function Wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3uiv(this.addr,e),Xt(t,e)}}function Xm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4uiv(this.addr,e),Xt(t,e)}}function Ym(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bl.compareFunction=gh,r=bl):r=Gh,t.setTexture2D(e||r,s)}function qm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Wh,s)}function Zm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Xh,s)}function $m(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Hh,s)}function Km(i){switch(i){case 5126:return Lm;case 35664:return Dm;case 35665:return Im;case 35666:return Um;case 35674:return Fm;case 35675:return Nm;case 35676:return Om;case 5124:case 35670:return Bm;case 35667:case 35671:return zm;case 35668:case 35672:return km;case 35669:case 35673:return Vm;case 5125:return Gm;case 36294:return Hm;case 36295:return Wm;case 36296:return Xm;case 35678:case 36198:case 36298:case 36306:case 35682:return Ym;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Zm;case 36289:case 36303:case 36311:case 36292:return $m}}function Jm(i,e){i.uniform1fv(this.addr,e)}function jm(i,e){const t=As(e,this.size,2);i.uniform2fv(this.addr,t)}function Qm(i,e){const t=As(e,this.size,3);i.uniform3fv(this.addr,t)}function ex(i,e){const t=As(e,this.size,4);i.uniform4fv(this.addr,t)}function tx(i,e){const t=As(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function nx(i,e){const t=As(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function ix(i,e){const t=As(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function sx(i,e){i.uniform1iv(this.addr,e)}function rx(i,e){i.uniform2iv(this.addr,e)}function ax(i,e){i.uniform3iv(this.addr,e)}function ox(i,e){i.uniform4iv(this.addr,e)}function cx(i,e){i.uniform1uiv(this.addr,e)}function lx(i,e){i.uniform2uiv(this.addr,e)}function hx(i,e){i.uniform3uiv(this.addr,e)}function dx(i,e){i.uniform4uiv(this.addr,e)}function ux(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Gh,r[a])}function fx(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Wh,r[a])}function px(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Xh,r[a])}function mx(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Hh,r[a])}function xx(i){switch(i){case 5126:return Jm;case 35664:return jm;case 35665:return Qm;case 35666:return ex;case 35674:return tx;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return rx;case 35668:case 35672:return ax;case 35669:case 35673:return ox;case 5125:return cx;case 36294:return lx;case 36295:return hx;case 36296:return dx;case 35678:case 36198:case 36298:case 36306:case 35682:return ux;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}class gx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Km(t.type)}}class _x{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xx(t.type)}}class vx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Wa=/(\w+)(\])?(\[|\.)?/g;function Rl(i,e){i.seq.push(e),i.map[e.id]=e}function Mx(i,e,t){const n=i.name,s=n.length;for(Wa.lastIndex=0;;){const r=Wa.exec(n),a=Wa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Rl(t,l===void 0?new gx(o,i,e):new _x(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new vx(o),Rl(t,u)),t=u}}}class Wr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Mx(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Pl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Sx=37297;let yx=0;function bx(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Ll=new it;function wx(i){gt._getMatrix(Ll,gt.workingColorSpace,i);const e=`mat3( ${Ll.elements.map(t=>t.toFixed(4))} )`;switch(gt.getTransfer(i)){case $r:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return Qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Dl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+bx(i.getShaderSource(e),o)}else return r}function Tx(i,e){const t=wx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ex(i,e){let t;switch(e){case sh:t="Linear";break;case rh:t="Reinhard";break;case ah:t="Cineon";break;case Ko:t="ACESFilmic";break;case ch:t="AgX";break;case lh:t="Neutral";break;case oh:t="Custom";break;default:Qe("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Nr=new D;function Ax(){gt.getLuminanceCoefficients(Nr);const i=Nr.x.toFixed(4),e=Nr.y.toFixed(4),t=Nr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gs).join(`
`)}function Rx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Px(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Gs(i){return i!==""}function Il(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ul(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Lx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(i){return i.replace(Lx,Ix)}const Dx=new Map;function Ix(i,e){let t=st[e];if(t===void 0){const n=Dx.get(e);if(n!==void 0)t=st[n],Qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Go(t)}const Ux=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fl(i){return i.replace(Ux,Fx)}function Fx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nl(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Nx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ih?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===si&&(e="SHADOWMAP_TYPE_VSM"),e}function Ox(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case vs:case Ms:e="ENVMAP_TYPE_CUBE";break;case na:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Bx(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ms&&(e="ENVMAP_MODE_REFRACTION"),e}function zx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case $o:e="ENVMAP_BLENDING_MULTIPLY";break;case zd:e="ENVMAP_BLENDING_MIX";break;case kd:e="ENVMAP_BLENDING_ADD";break}return e}function kx(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Vx(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Nx(t),l=Ox(t),d=Bx(t),u=zx(t),f=kx(t),m=Cx(t),g=Rx(r),v=s.createProgram();let p,h,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Gs).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Gs).join(`
`),h.length>0&&(h+=`
`)):(p=[Nl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gs).join(`
`),h=[Nl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==wi?"#define TONE_MAPPING":"",t.toneMapping!==wi?st.tonemapping_pars_fragment:"",t.toneMapping!==wi?Ex("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,Tx("linearToOutputTexel",t.outputColorSpace),Ax(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Gs).join(`
`)),a=Go(a),a=Il(a,t),a=Ul(a,t),o=Go(o),o=Il(o,t),o=Ul(o,t),a=Fl(a),o=Fl(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===Ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const y=_+p+a,S=_+h+o,E=Pl(s,s.VERTEX_SHADER,y),w=Pl(s,s.FRAGMENT_SHADER,S);s.attachShader(v,E),s.attachShader(v,w),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function R(A){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(E)||"",q=s.getShaderInfoLog(w)||"",Z=I.trim(),J=B.trim(),oe=q.trim();let ie=!0,me=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,w);else{const Me=Dl(s,E,"vertex"),De=Dl(s,w,"fragment");Bt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+Z+`
`+Me+`
`+De)}else Z!==""?Qe("WebGLProgram: Program Info Log:",Z):(J===""||oe==="")&&(me=!1);me&&(A.diagnostics={runnable:ie,programLog:Z,vertexShader:{log:J,prefix:p},fragmentShader:{log:oe,prefix:h}})}s.deleteShader(E),s.deleteShader(w),P=new Wr(s,v),b=Px(s,v)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,Sx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=yx++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=w,this}let Gx=0;class Hx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Wx(e),t.set(e,n)),n}}class Wx{constructor(e){this.id=Gx++,this.code=e,this.usedTimes=0}}function Xx(i,e,t,n,s,r,a){const o=new lc,c=new Hx,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function p(b,M,A,I,B){const q=I.fog,Z=B.geometry,J=b.isMeshStandardMaterial?I.environment:null,oe=(b.isMeshStandardMaterial?t:e).get(b.envMap||J),ie=oe&&oe.mapping===na?oe.image.height:null,me=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&Qe("WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const Me=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,De=Me!==void 0?Me.length:0;let F=0;Z.morphAttributes.position!==void 0&&(F=1),Z.morphAttributes.normal!==void 0&&(F=2),Z.morphAttributes.color!==void 0&&(F=3);let Se,xe,_e,G;if(me){const Ne=Hn[me];Se=Ne.vertexShader,xe=Ne.fragmentShader}else Se=b.vertexShader,xe=b.fragmentShader,c.update(b),_e=c.getVertexShaderID(b),G=c.getFragmentShaderID(b);const Y=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),be=B.isInstancedMesh===!0,Te=B.isBatchedMesh===!0,ke=!!b.map,bt=!!b.matcap,Ge=!!oe,mt=!!b.aoMap,N=!!b.lightMap,nt=!!b.bumpMap,et=!!b.normalMap,xt=!!b.displacementMap,Le=!!b.emissiveMap,Pt=!!b.metalnessMap,Be=!!b.roughnessMap,qe=b.anisotropy>0,U=b.clearcoat>0,T=b.dispersion>0,W=b.iridescence>0,le=b.sheen>0,fe=b.transmission>0,ne=qe&&!!b.anisotropyMap,ze=U&&!!b.clearcoatMap,we=U&&!!b.clearcoatNormalMap,Ve=U&&!!b.clearcoatRoughnessMap,Fe=W&&!!b.iridescenceMap,ue=W&&!!b.iridescenceThicknessMap,O=le&&!!b.sheenColorMap,z=le&&!!b.sheenRoughnessMap,H=!!b.specularMap,$=!!b.specularColorMap,se=!!b.specularIntensityMap,L=fe&&!!b.transmissionMap,re=fe&&!!b.thicknessMap,ce=!!b.gradientMap,ae=!!b.alphaMap,te=b.alphaTest>0,j=!!b.alphaHash,ve=!!b.extensions;let ge=wi;b.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(ge=i.toneMapping);const de={shaderID:me,shaderType:b.type,shaderName:b.name,vertexShader:Se,fragmentShader:xe,defines:b.defines,customVertexShaderID:_e,customFragmentShaderID:G,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Te,batchingColor:Te&&B._colorsTexture!==null,instancing:be,instancingColor:be&&B.instanceColor!==null,instancingMorph:be&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Y===null?i.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Ss,alphaToCoverage:!!b.alphaToCoverage,map:ke,matcap:bt,envMap:Ge,envMapMode:Ge&&oe.mapping,envMapCubeUVHeight:ie,aoMap:mt,lightMap:N,bumpMap:nt,normalMap:et,displacementMap:f&&xt,emissiveMap:Le,normalMapObjectSpace:et&&b.normalMapType===Wd,normalMapTangentSpace:et&&b.normalMapType===rc,metalnessMap:Pt,roughnessMap:Be,anisotropy:qe,anisotropyMap:ne,clearcoat:U,clearcoatMap:ze,clearcoatNormalMap:we,clearcoatRoughnessMap:Ve,dispersion:T,iridescence:W,iridescenceMap:Fe,iridescenceThicknessMap:ue,sheen:le,sheenColorMap:O,sheenRoughnessMap:z,specularMap:H,specularColorMap:$,specularIntensityMap:se,transmission:fe,transmissionMap:L,thicknessMap:re,gradientMap:ce,opaque:b.transparent===!1&&b.blending===ps&&b.alphaToCoverage===!1,alphaMap:ae,alphaTest:te,alphaHash:j,combine:b.combine,mapUv:ke&&v(b.map.channel),aoMapUv:mt&&v(b.aoMap.channel),lightMapUv:N&&v(b.lightMap.channel),bumpMapUv:nt&&v(b.bumpMap.channel),normalMapUv:et&&v(b.normalMap.channel),displacementMapUv:xt&&v(b.displacementMap.channel),emissiveMapUv:Le&&v(b.emissiveMap.channel),metalnessMapUv:Pt&&v(b.metalnessMap.channel),roughnessMapUv:Be&&v(b.roughnessMap.channel),anisotropyMapUv:ne&&v(b.anisotropyMap.channel),clearcoatMapUv:ze&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:we&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ve&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:O&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:z&&v(b.sheenRoughnessMap.channel),specularMapUv:H&&v(b.specularMap.channel),specularColorMapUv:$&&v(b.specularColorMap.channel),specularIntensityMapUv:se&&v(b.specularIntensityMap.channel),transmissionMapUv:L&&v(b.transmissionMap.channel),thicknessMapUv:re&&v(b.thicknessMap.channel),alphaMapUv:ae&&v(b.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(et||qe),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Z.attributes.uv&&(ke||ae),fog:!!q,useFog:b.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pe,skinning:B.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:De,morphTextureStride:F,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:ge,decodeVideoTexture:ke&&b.map.isVideoTexture===!0&&gt.getTransfer(b.map.colorSpace)===yt,decodeVideoTextureEmissive:Le&&b.emissiveMap.isVideoTexture===!0&&gt.getTransfer(b.emissiveMap.colorSpace)===yt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ut,flipSided:b.side===nn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ve&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&b.extensions.multiDraw===!0||Te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function h(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const A in b.defines)M.push(A),M.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(_(M,b),y(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function y(b,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),b.push(o.mask)}function S(b){const M=g[b.type];let A;if(M){const I=Hn[M];A=sr.clone(I.uniforms)}else A=b.uniforms;return A}function E(b,M){let A;for(let I=0,B=d.length;I<B;I++){const q=d[I];if(q.cacheKey===M){A=q,++A.usedTimes;break}}return A===void 0&&(A=new Vx(i,M,b,r),d.push(A)),A}function w(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function R(b){c.remove(b)}function P(){c.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:S,acquireProgram:E,releaseProgram:w,releaseShaderCache:R,programs:d,dispose:P}}function Yx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function qx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ol(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Bl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,m,g,v,p){let h=i[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:m,groupOrder:g,renderOrder:u.renderOrder,z:v,group:p},i[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=m,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=v,h.group=p),e++,h}function o(u,f,m,g,v,p){const h=a(u,f,m,g,v,p);m.transmission>0?n.push(h):m.transparent===!0?s.push(h):t.push(h)}function c(u,f,m,g,v,p){const h=a(u,f,m,g,v,p);m.transmission>0?n.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||qx),n.length>1&&n.sort(f||Ol),s.length>1&&s.sort(f||Ol)}function d(){for(let u=e,f=i.length;u<f;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function Zx(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Bl,i.set(n,[a])):s>=r.length?(a=new Bl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function $x(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ze};break;case"SpotLight":t={position:new D,direction:new D,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Kx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Jx=0;function jx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Qx(i){const e=new $x,t=Kx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new Mt,a=new Mt;function o(l){let d=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,v=0,p=0,h=0,_=0,y=0,S=0,E=0,w=0,R=0;l.sort(jx);for(let b=0,M=l.length;b<M;b++){const A=l[b],I=A.color,B=A.intensity,q=A.distance,Z=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=I.r*B,u+=I.g*B,f+=I.b*B;else if(A.isLightProbe){for(let J=0;J<9;J++)n.probe[J].addScaledVector(A.sh.coefficients[J],B);R++}else if(A.isDirectionalLight){const J=e.get(A);if(J.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const oe=A.shadow,ie=t.get(A);ie.shadowIntensity=oe.intensity,ie.shadowBias=oe.bias,ie.shadowNormalBias=oe.normalBias,ie.shadowRadius=oe.radius,ie.shadowMapSize=oe.mapSize,n.directionalShadow[m]=ie,n.directionalShadowMap[m]=Z,n.directionalShadowMatrix[m]=A.shadow.matrix,_++}n.directional[m]=J,m++}else if(A.isSpotLight){const J=e.get(A);J.position.setFromMatrixPosition(A.matrixWorld),J.color.copy(I).multiplyScalar(B),J.distance=q,J.coneCos=Math.cos(A.angle),J.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),J.decay=A.decay,n.spot[v]=J;const oe=A.shadow;if(A.map&&(n.spotLightMap[E]=A.map,E++,oe.updateMatrices(A),A.castShadow&&w++),n.spotLightMatrix[v]=oe.matrix,A.castShadow){const ie=t.get(A);ie.shadowIntensity=oe.intensity,ie.shadowBias=oe.bias,ie.shadowNormalBias=oe.normalBias,ie.shadowRadius=oe.radius,ie.shadowMapSize=oe.mapSize,n.spotShadow[v]=ie,n.spotShadowMap[v]=Z,S++}v++}else if(A.isRectAreaLight){const J=e.get(A);J.color.copy(I).multiplyScalar(B),J.halfWidth.set(A.width*.5,0,0),J.halfHeight.set(0,A.height*.5,0),n.rectArea[p]=J,p++}else if(A.isPointLight){const J=e.get(A);if(J.color.copy(A.color).multiplyScalar(A.intensity),J.distance=A.distance,J.decay=A.decay,A.castShadow){const oe=A.shadow,ie=t.get(A);ie.shadowIntensity=oe.intensity,ie.shadowBias=oe.bias,ie.shadowNormalBias=oe.normalBias,ie.shadowRadius=oe.radius,ie.shadowMapSize=oe.mapSize,ie.shadowCameraNear=oe.camera.near,ie.shadowCameraFar=oe.camera.far,n.pointShadow[g]=ie,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=A.shadow.matrix,y++}n.point[g]=J,g++}else if(A.isHemisphereLight){const J=e.get(A);J.skyColor.copy(A.color).multiplyScalar(B),J.groundColor.copy(A.groundColor).multiplyScalar(B),n.hemi[h]=J,h++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ae.LTC_FLOAT_1,n.rectAreaLTC2=Ae.LTC_FLOAT_2):(n.rectAreaLTC1=Ae.LTC_HALF_1,n.rectAreaLTC2=Ae.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==m||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==p||P.hemiLength!==h||P.numDirectionalShadows!==_||P.numPointShadows!==y||P.numSpotShadows!==S||P.numSpotMaps!==E||P.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=S+E-w,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,P.directionalLength=m,P.pointLength=g,P.spotLength=v,P.rectAreaLength=p,P.hemiLength=h,P.numDirectionalShadows=_,P.numPointShadows=y,P.numSpotShadows=S,P.numSpotMaps=E,P.numLightProbes=R,n.version=Jx++)}function c(l,d){let u=0,f=0,m=0,g=0,v=0;const p=d.matrixWorldInverse;for(let h=0,_=l.length;h<_;h++){const y=l[h];if(y.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),u++}else if(y.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const S=n.hemi[v];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(p),v++}}}return{setup:o,setupView:c,state:n}}function zl(i){const e=new Qx(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function eg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new zl(i),e.set(s,[o])):r>=a.length?(o=new zl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const tg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ng=`uniform sampler2D shadow_pass;
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
}`;function ig(i,e,t){let n=new dc;const s=new Ee,r=new Ee,a=new At,o=new wf({depthPacking:Hd}),c=new Tf,l={},d=t.maxTextureSize,u={[Ei]:nn,[nn]:Ei,[ut]:ut},f=new tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:tg,fragmentShader:ng}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new kt;g.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new X(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nh;let h=this.type;this.render=function(w,R,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Zn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=h!==si&&this.type===si,q=h===si&&this.type!==si;for(let Z=0,J=w.length;Z<J;Z++){const oe=w[Z],ie=oe.shadow;if(ie===void 0){Qe("WebGLShadowMap:",oe,"has no shadow.");continue}if(ie.autoUpdate===!1&&ie.needsUpdate===!1)continue;s.copy(ie.mapSize);const me=ie.getFrameExtents();if(s.multiply(me),r.copy(ie.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/me.x),s.x=r.x*me.x,ie.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/me.y),s.y=r.y*me.y,ie.mapSize.y=r.y)),ie.map===null||B===!0||q===!0){const De=this.type!==si?{minFilter:wn,magFilter:wn}:{};ie.map!==null&&ie.map.dispose(),ie.map=new On(s.x,s.y,De),ie.map.texture.name=oe.name+".shadowMap",ie.camera.updateProjectionMatrix()}i.setRenderTarget(ie.map),i.clear();const Me=ie.getViewportCount();for(let De=0;De<Me;De++){const F=ie.getViewport(De);a.set(r.x*F.x,r.y*F.y,r.x*F.z,r.y*F.w),I.viewport(a),ie.updateMatrices(oe,De),n=ie.getFrustum(),S(R,P,ie.camera,oe,this.type)}ie.isPointLightShadow!==!0&&this.type===si&&_(ie,P),ie.needsUpdate=!1}h=this.type,p.needsUpdate=!1,i.setRenderTarget(b,M,A)};function _(w,R){const P=e.update(v);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,P,f,v,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,P,m,v,null)}function y(w,R,P,b){let M=null;const A=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(A!==void 0)M=A;else if(M=P.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=M.uuid,B=R.uuid;let q=l[I];q===void 0&&(q={},l[I]=q);let Z=q[B];Z===void 0&&(Z=M.clone(),q[B]=Z,R.addEventListener("dispose",E)),M=Z}if(M.visible=R.visible,M.wireframe=R.wireframe,b===si?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:u[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=i.properties.get(M);I.light=P}return M}function S(w,R,P,b,M){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===si)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const B=e.update(w),q=w.material;if(Array.isArray(q)){const Z=B.groups;for(let J=0,oe=Z.length;J<oe;J++){const ie=Z[J],me=q[ie.materialIndex];if(me&&me.visible){const Me=y(w,me,b,M);w.onBeforeShadow(i,w,R,P,B,Me,ie),i.renderBufferDirect(P,null,B,Me,w,ie),w.onAfterShadow(i,w,R,P,B,Me,ie)}}}else if(q.visible){const Z=y(w,q,b,M);w.onBeforeShadow(i,w,R,P,B,Z,null),i.renderBufferDirect(P,null,B,Z,w,null),w.onAfterShadow(i,w,R,P,B,Z,null)}}const I=w.children;for(let B=0,q=I.length;B<q;B++)S(I[B],R,P,b,M)}function E(w){w.target.removeEventListener("dispose",E);for(const P in l){const b=l[P],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const sg={[ja]:Qa,[eo]:io,[to]:so,[_s]:no,[Qa]:ja,[io]:eo,[so]:to,[no]:_s};function rg(i,e){function t(){let L=!1;const re=new At;let ce=null;const ae=new At(0,0,0,0);return{setMask:function(te){ce!==te&&!L&&(i.colorMask(te,te,te,te),ce=te)},setLocked:function(te){L=te},setClear:function(te,j,ve,ge,de){de===!0&&(te*=ge,j*=ge,ve*=ge),re.set(te,j,ve,ge),ae.equals(re)===!1&&(i.clearColor(te,j,ve,ge),ae.copy(re))},reset:function(){L=!1,ce=null,ae.set(-1,0,0,0)}}}function n(){let L=!1,re=!1,ce=null,ae=null,te=null;return{setReversed:function(j){if(re!==j){const ve=e.get("EXT_clip_control");j?ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.ZERO_TO_ONE_EXT):ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.NEGATIVE_ONE_TO_ONE_EXT),re=j;const ge=te;te=null,this.setClear(ge)}},getReversed:function(){return re},setTest:function(j){j?Y(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(j){ce!==j&&!L&&(i.depthMask(j),ce=j)},setFunc:function(j){if(re&&(j=sg[j]),ae!==j){switch(j){case ja:i.depthFunc(i.NEVER);break;case Qa:i.depthFunc(i.ALWAYS);break;case eo:i.depthFunc(i.LESS);break;case _s:i.depthFunc(i.LEQUAL);break;case to:i.depthFunc(i.EQUAL);break;case no:i.depthFunc(i.GEQUAL);break;case io:i.depthFunc(i.GREATER);break;case so:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ae=j}},setLocked:function(j){L=j},setClear:function(j){te!==j&&(re&&(j=1-j),i.clearDepth(j),te=j)},reset:function(){L=!1,ce=null,ae=null,te=null,re=!1}}}function s(){let L=!1,re=null,ce=null,ae=null,te=null,j=null,ve=null,ge=null,de=null;return{setTest:function(Ne){L||(Ne?Y(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(Ne){re!==Ne&&!L&&(i.stencilMask(Ne),re=Ne)},setFunc:function(Ne,$e,dt){(ce!==Ne||ae!==$e||te!==dt)&&(i.stencilFunc(Ne,$e,dt),ce=Ne,ae=$e,te=dt)},setOp:function(Ne,$e,dt){(j!==Ne||ve!==$e||ge!==dt)&&(i.stencilOp(Ne,$e,dt),j=Ne,ve=$e,ge=dt)},setLocked:function(Ne){L=Ne},setClear:function(Ne){de!==Ne&&(i.clearStencil(Ne),de=Ne)},reset:function(){L=!1,re=null,ce=null,ae=null,te=null,j=null,ve=null,ge=null,de=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,m=[],g=null,v=!1,p=null,h=null,_=null,y=null,S=null,E=null,w=null,R=new Ze(0,0,0),P=0,b=!1,M=null,A=null,I=null,B=null,q=null;const Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,oe=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(oe=parseFloat(/^WebGL (\d)/.exec(ie)[1]),J=oe>=1):ie.indexOf("OpenGL ES")!==-1&&(oe=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),J=oe>=2);let me=null,Me={};const De=i.getParameter(i.SCISSOR_BOX),F=i.getParameter(i.VIEWPORT),Se=new At().fromArray(De),xe=new At().fromArray(F);function _e(L,re,ce,ae){const te=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ve=0;ve<ce;ve++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(re,0,i.RGBA,1,1,ae,0,i.RGBA,i.UNSIGNED_BYTE,te):i.texImage2D(re+ve,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,te);return j}const G={};G[i.TEXTURE_2D]=_e(i.TEXTURE_2D,i.TEXTURE_2D,1),G[i.TEXTURE_CUBE_MAP]=_e(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[i.TEXTURE_2D_ARRAY]=_e(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),G[i.TEXTURE_3D]=_e(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Y(i.DEPTH_TEST),a.setFunc(_s),nt(!1),et(Cc),Y(i.CULL_FACE),mt(Zn);function Y(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function pe(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function be(L,re){return u[L]!==re?(i.bindFramebuffer(L,re),u[L]=re,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=re),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=re),!0):!1}function Te(L,re){let ce=m,ae=!1;if(L){ce=f.get(re),ce===void 0&&(ce=[],f.set(re,ce));const te=L.textures;if(ce.length!==te.length||ce[0]!==i.COLOR_ATTACHMENT0){for(let j=0,ve=te.length;j<ve;j++)ce[j]=i.COLOR_ATTACHMENT0+j;ce.length=te.length,ae=!0}}else ce[0]!==i.BACK&&(ce[0]=i.BACK,ae=!0);ae&&i.drawBuffers(ce)}function ke(L){return g!==L?(i.useProgram(L),g=L,!0):!1}const bt={[Fi]:i.FUNC_ADD,[yd]:i.FUNC_SUBTRACT,[bd]:i.FUNC_REVERSE_SUBTRACT};bt[wd]=i.MIN,bt[Td]=i.MAX;const Ge={[Ed]:i.ZERO,[Ad]:i.ONE,[Cd]:i.SRC_COLOR,[Ka]:i.SRC_ALPHA,[Ud]:i.SRC_ALPHA_SATURATE,[Dd]:i.DST_COLOR,[Pd]:i.DST_ALPHA,[Rd]:i.ONE_MINUS_SRC_COLOR,[Ja]:i.ONE_MINUS_SRC_ALPHA,[Id]:i.ONE_MINUS_DST_COLOR,[Ld]:i.ONE_MINUS_DST_ALPHA,[Fd]:i.CONSTANT_COLOR,[Nd]:i.ONE_MINUS_CONSTANT_COLOR,[Od]:i.CONSTANT_ALPHA,[Bd]:i.ONE_MINUS_CONSTANT_ALPHA};function mt(L,re,ce,ae,te,j,ve,ge,de,Ne){if(L===Zn){v===!0&&(pe(i.BLEND),v=!1);return}if(v===!1&&(Y(i.BLEND),v=!0),L!==Sd){if(L!==p||Ne!==b){if((h!==Fi||S!==Fi)&&(i.blendEquation(i.FUNC_ADD),h=Fi,S=Fi),Ne)switch(L){case ps:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Oi:i.blendFunc(i.ONE,i.ONE);break;case Rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Bt("WebGLState: Invalid blending: ",L);break}else switch(L){case ps:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Oi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Rc:Bt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pc:Bt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Bt("WebGLState: Invalid blending: ",L);break}_=null,y=null,E=null,w=null,R.set(0,0,0),P=0,p=L,b=Ne}return}te=te||re,j=j||ce,ve=ve||ae,(re!==h||te!==S)&&(i.blendEquationSeparate(bt[re],bt[te]),h=re,S=te),(ce!==_||ae!==y||j!==E||ve!==w)&&(i.blendFuncSeparate(Ge[ce],Ge[ae],Ge[j],Ge[ve]),_=ce,y=ae,E=j,w=ve),(ge.equals(R)===!1||de!==P)&&(i.blendColor(ge.r,ge.g,ge.b,de),R.copy(ge),P=de),p=L,b=!1}function N(L,re){L.side===ut?pe(i.CULL_FACE):Y(i.CULL_FACE);let ce=L.side===nn;re&&(ce=!ce),nt(ce),L.blending===ps&&L.transparent===!1?mt(Zn):mt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ae=L.stencilWrite;o.setTest(ae),ae&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Le(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Y(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(L){M!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),M=L)}function et(L){L!==vd?(Y(i.CULL_FACE),L!==A&&(L===Cc?i.cullFace(i.BACK):L===Md?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),A=L}function xt(L){L!==I&&(J&&i.lineWidth(L),I=L)}function Le(L,re,ce){L?(Y(i.POLYGON_OFFSET_FILL),(B!==re||q!==ce)&&(i.polygonOffset(re,ce),B=re,q=ce)):pe(i.POLYGON_OFFSET_FILL)}function Pt(L){L?Y(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function Be(L){L===void 0&&(L=i.TEXTURE0+Z-1),me!==L&&(i.activeTexture(L),me=L)}function qe(L,re,ce){ce===void 0&&(me===null?ce=i.TEXTURE0+Z-1:ce=me);let ae=Me[ce];ae===void 0&&(ae={type:void 0,texture:void 0},Me[ce]=ae),(ae.type!==L||ae.texture!==re)&&(me!==ce&&(i.activeTexture(ce),me=ce),i.bindTexture(L,re||G[L]),ae.type=L,ae.texture=re)}function U(){const L=Me[me];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function T(){try{i.compressedTexImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function le(){try{i.texSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function fe(){try{i.texSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function ne(){try{i.compressedTexSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function ze(){try{i.compressedTexSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function we(){try{i.texStorage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Ve(){try{i.texStorage3D(...arguments)}catch(L){L("WebGLState:",L)}}function Fe(){try{i.texImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function ue(){try{i.texImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function O(L){Se.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Se.copy(L))}function z(L){xe.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),xe.copy(L))}function H(L,re){let ce=l.get(re);ce===void 0&&(ce=new WeakMap,l.set(re,ce));let ae=ce.get(L);ae===void 0&&(ae=i.getUniformBlockIndex(re,L.name),ce.set(L,ae))}function $(L,re){const ae=l.get(re).get(L);c.get(re)!==ae&&(i.uniformBlockBinding(re,ae,L.__bindingPointIndex),c.set(re,ae))}function se(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},me=null,Me={},u={},f=new WeakMap,m=[],g=null,v=!1,p=null,h=null,_=null,y=null,S=null,E=null,w=null,R=new Ze(0,0,0),P=0,b=!1,M=null,A=null,I=null,B=null,q=null,Se.set(0,0,i.canvas.width,i.canvas.height),xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Y,disable:pe,bindFramebuffer:be,drawBuffers:Te,useProgram:ke,setBlending:mt,setMaterial:N,setFlipSided:nt,setCullFace:et,setLineWidth:xt,setPolygonOffset:Le,setScissorTest:Pt,activeTexture:Be,bindTexture:qe,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:W,texImage2D:Fe,texImage3D:ue,updateUBOMapping:H,uniformBlockBinding:$,texStorage2D:we,texStorage3D:Ve,texSubImage2D:le,texSubImage3D:fe,compressedTexSubImage2D:ne,compressedTexSubImage3D:ze,scissor:O,viewport:z,reset:se}}function ag(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ee,d=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return m?new OffscreenCanvas(U,T):Jr("canvas")}function v(U,T,W){let le=1;const fe=qe(U);if((fe.width>W||fe.height>W)&&(le=W/Math.max(fe.width,fe.height)),le<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ne=Math.floor(le*fe.width),ze=Math.floor(le*fe.height);u===void 0&&(u=g(ne,ze));const we=T?g(ne,ze):u;return we.width=ne,we.height=ze,we.getContext("2d").drawImage(U,0,0,ne,ze),Qe("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+ne+"x"+ze+")."),we}else return"data"in U&&Qe("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),U;return U}function p(U){return U.generateMipmaps}function h(U){i.generateMipmap(U)}function _(U){return U.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?i.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(U,T,W,le,fe=!1){if(U!==null){if(i[U]!==void 0)return i[U];Qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ne=T;if(T===i.RED&&(W===i.FLOAT&&(ne=i.R32F),W===i.HALF_FLOAT&&(ne=i.R16F),W===i.UNSIGNED_BYTE&&(ne=i.R8)),T===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.R8UI),W===i.UNSIGNED_SHORT&&(ne=i.R16UI),W===i.UNSIGNED_INT&&(ne=i.R32UI),W===i.BYTE&&(ne=i.R8I),W===i.SHORT&&(ne=i.R16I),W===i.INT&&(ne=i.R32I)),T===i.RG&&(W===i.FLOAT&&(ne=i.RG32F),W===i.HALF_FLOAT&&(ne=i.RG16F),W===i.UNSIGNED_BYTE&&(ne=i.RG8)),T===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RG8UI),W===i.UNSIGNED_SHORT&&(ne=i.RG16UI),W===i.UNSIGNED_INT&&(ne=i.RG32UI),W===i.BYTE&&(ne=i.RG8I),W===i.SHORT&&(ne=i.RG16I),W===i.INT&&(ne=i.RG32I)),T===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),W===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),W===i.UNSIGNED_INT&&(ne=i.RGB32UI),W===i.BYTE&&(ne=i.RGB8I),W===i.SHORT&&(ne=i.RGB16I),W===i.INT&&(ne=i.RGB32I)),T===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),W===i.UNSIGNED_INT&&(ne=i.RGBA32UI),W===i.BYTE&&(ne=i.RGBA8I),W===i.SHORT&&(ne=i.RGBA16I),W===i.INT&&(ne=i.RGBA32I)),T===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),T===i.RGBA){const ze=fe?$r:gt.getTransfer(le);W===i.FLOAT&&(ne=i.RGBA32F),W===i.HALF_FLOAT&&(ne=i.RGBA16F),W===i.UNSIGNED_BYTE&&(ne=ze===yt?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function S(U,T){let W;return U?T===null||T===Gi||T===Qs?W=i.DEPTH24_STENCIL8:T===Yn?W=i.DEPTH32F_STENCIL8:T===js&&(W=i.DEPTH24_STENCIL8,Qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Gi||T===Qs?W=i.DEPTH_COMPONENT24:T===Yn?W=i.DEPTH_COMPONENT32F:T===js&&(W=i.DEPTH_COMPONENT16),W}function E(U,T){return p(U)===!0||U.isFramebufferTexture&&U.minFilter!==wn&&U.minFilter!==Cn?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function w(U){const T=U.target;T.removeEventListener("dispose",w),P(T),T.isVideoTexture&&d.delete(T)}function R(U){const T=U.target;T.removeEventListener("dispose",R),M(T)}function P(U){const T=n.get(U);if(T.__webglInit===void 0)return;const W=U.source,le=f.get(W);if(le){const fe=le[T.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&b(U),Object.keys(le).length===0&&f.delete(W)}n.remove(U)}function b(U){const T=n.get(U);i.deleteTexture(T.__webglTexture);const W=U.source,le=f.get(W);delete le[T.__cacheKey],a.memory.textures--}function M(U){const T=n.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),n.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(T.__webglFramebuffer[le]))for(let fe=0;fe<T.__webglFramebuffer[le].length;fe++)i.deleteFramebuffer(T.__webglFramebuffer[le][fe]);else i.deleteFramebuffer(T.__webglFramebuffer[le]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[le])}else{if(Array.isArray(T.__webglFramebuffer))for(let le=0;le<T.__webglFramebuffer.length;le++)i.deleteFramebuffer(T.__webglFramebuffer[le]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let le=0;le<T.__webglColorRenderbuffer.length;le++)T.__webglColorRenderbuffer[le]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[le]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const W=U.textures;for(let le=0,fe=W.length;le<fe;le++){const ne=n.get(W[le]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(W[le])}n.remove(U)}let A=0;function I(){A=0}function B(){const U=A;return U>=s.maxTextures&&Qe("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),A+=1,U}function q(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function Z(U,T){const W=n.get(U);if(U.isVideoTexture&&Pt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&W.__version!==U.version){const le=U.image;if(le===null)Qe("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)Qe("WebGLRenderer: Texture marked for update but image is incomplete");else{G(W,U,T);return}}else U.isExternalTexture&&(W.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+T)}function J(U,T){const W=n.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&W.__version!==U.version){G(W,U,T);return}else U.isExternalTexture&&(W.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+T)}function oe(U,T){const W=n.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&W.__version!==U.version){G(W,U,T);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+T)}function ie(U,T){const W=n.get(U);if(U.version>0&&W.__version!==U.version){Y(W,U,T);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+T)}const me={[rn]:i.REPEAT,[ai]:i.CLAMP_TO_EDGE,[oo]:i.MIRRORED_REPEAT},Me={[wn]:i.NEAREST,[Vd]:i.NEAREST_MIPMAP_NEAREST,[dr]:i.NEAREST_MIPMAP_LINEAR,[Cn]:i.LINEAR,[da]:i.LINEAR_MIPMAP_NEAREST,[Bi]:i.LINEAR_MIPMAP_LINEAR},De={[Xd]:i.NEVER,[Jd]:i.ALWAYS,[Yd]:i.LESS,[gh]:i.LEQUAL,[qd]:i.EQUAL,[Kd]:i.GEQUAL,[Zd]:i.GREATER,[$d]:i.NOTEQUAL};function F(U,T){if(T.type===Yn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Cn||T.magFilter===da||T.magFilter===dr||T.magFilter===Bi||T.minFilter===Cn||T.minFilter===da||T.minFilter===dr||T.minFilter===Bi)&&Qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(U,i.TEXTURE_WRAP_S,me[T.wrapS]),i.texParameteri(U,i.TEXTURE_WRAP_T,me[T.wrapT]),(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)&&i.texParameteri(U,i.TEXTURE_WRAP_R,me[T.wrapR]),i.texParameteri(U,i.TEXTURE_MAG_FILTER,Me[T.magFilter]),i.texParameteri(U,i.TEXTURE_MIN_FILTER,Me[T.minFilter]),T.compareFunction&&(i.texParameteri(U,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(U,i.TEXTURE_COMPARE_FUNC,De[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===wn||T.minFilter!==dr&&T.minFilter!==Bi||T.type===Yn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(U,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Se(U,T){let W=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",w));const le=T.source;let fe=f.get(le);fe===void 0&&(fe={},f.set(le,fe));const ne=q(T);if(ne!==U.__cacheKey){fe[ne]===void 0&&(fe[ne]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),fe[ne].usedTimes++;const ze=fe[U.__cacheKey];ze!==void 0&&(fe[U.__cacheKey].usedTimes--,ze.usedTimes===0&&b(T)),U.__cacheKey=ne,U.__webglTexture=fe[ne].texture}return W}function xe(U,T,W){return Math.floor(Math.floor(U/W)/T)}function _e(U,T,W,le){const ne=U.updateRanges;if(ne.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,T.width,T.height,W,le,T.data);else{ne.sort((ue,O)=>ue.start-O.start);let ze=0;for(let ue=1;ue<ne.length;ue++){const O=ne[ze],z=ne[ue],H=O.start+O.count,$=xe(z.start,T.width,4),se=xe(O.start,T.width,4);z.start<=H+1&&$===se&&xe(z.start+z.count-1,T.width,4)===$?O.count=Math.max(O.count,z.start+z.count-O.start):(++ze,ne[ze]=z)}ne.length=ze+1;const we=i.getParameter(i.UNPACK_ROW_LENGTH),Ve=i.getParameter(i.UNPACK_SKIP_PIXELS),Fe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,T.width);for(let ue=0,O=ne.length;ue<O;ue++){const z=ne[ue],H=Math.floor(z.start/4),$=Math.ceil(z.count/4),se=H%T.width,L=Math.floor(H/T.width),re=$,ce=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,se),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,se,L,re,ce,W,le,T.data)}U.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,we),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),i.pixelStorei(i.UNPACK_SKIP_ROWS,Fe)}}function G(U,T,W){let le=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(le=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(le=i.TEXTURE_3D);const fe=Se(U,T),ne=T.source;t.bindTexture(le,U.__webglTexture,i.TEXTURE0+W);const ze=n.get(ne);if(ne.version!==ze.__version||fe===!0){t.activeTexture(i.TEXTURE0+W);const we=gt.getPrimaries(gt.workingColorSpace),Ve=T.colorSpace===Si?null:gt.getPrimaries(T.colorSpace),Fe=T.colorSpace===Si||we===Ve?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let ue=v(T.image,!1,s.maxTextureSize);ue=Be(T,ue);const O=r.convert(T.format,T.colorSpace),z=r.convert(T.type);let H=y(T.internalFormat,O,z,T.colorSpace,T.isVideoTexture);F(le,T);let $;const se=T.mipmaps,L=T.isVideoTexture!==!0,re=ze.__version===void 0||fe===!0,ce=ne.dataReady,ae=E(T,ue);if(T.isDepthTexture)H=S(T.format===tr,T.type),re&&(L?t.texStorage2D(i.TEXTURE_2D,1,H,ue.width,ue.height):t.texImage2D(i.TEXTURE_2D,0,H,ue.width,ue.height,0,O,z,null));else if(T.isDataTexture)if(se.length>0){L&&re&&t.texStorage2D(i.TEXTURE_2D,ae,H,se[0].width,se[0].height);for(let te=0,j=se.length;te<j;te++)$=se[te],L?ce&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,$.width,$.height,O,z,$.data):t.texImage2D(i.TEXTURE_2D,te,H,$.width,$.height,0,O,z,$.data);T.generateMipmaps=!1}else L?(re&&t.texStorage2D(i.TEXTURE_2D,ae,H,ue.width,ue.height),ce&&_e(T,ue,O,z)):t.texImage2D(i.TEXTURE_2D,0,H,ue.width,ue.height,0,O,z,ue.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){L&&re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,H,se[0].width,se[0].height,ue.depth);for(let te=0,j=se.length;te<j;te++)if($=se[te],T.format!==Nn)if(O!==null)if(L){if(ce)if(T.layerUpdates.size>0){const ve=gl($.width,$.height,T.format,T.type);for(const ge of T.layerUpdates){const de=$.data.subarray(ge*ve/$.data.BYTES_PER_ELEMENT,(ge+1)*ve/$.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,ge,$.width,$.height,1,O,de)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,$.width,$.height,ue.depth,O,$.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,H,$.width,$.height,ue.depth,0,$.data,0,0);else Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ce&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,$.width,$.height,ue.depth,O,z,$.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,H,$.width,$.height,ue.depth,0,O,z,$.data)}else{L&&re&&t.texStorage2D(i.TEXTURE_2D,ae,H,se[0].width,se[0].height);for(let te=0,j=se.length;te<j;te++)$=se[te],T.format!==Nn?O!==null?L?ce&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,$.width,$.height,O,$.data):t.compressedTexImage2D(i.TEXTURE_2D,te,H,$.width,$.height,0,$.data):Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ce&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,$.width,$.height,O,z,$.data):t.texImage2D(i.TEXTURE_2D,te,H,$.width,$.height,0,O,z,$.data)}else if(T.isDataArrayTexture)if(L){if(re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,H,ue.width,ue.height,ue.depth),ce)if(T.layerUpdates.size>0){const te=gl(ue.width,ue.height,T.format,T.type);for(const j of T.layerUpdates){const ve=ue.data.subarray(j*te/ue.data.BYTES_PER_ELEMENT,(j+1)*te/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,ue.width,ue.height,1,O,z,ve)}T.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,O,z,ue.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,H,ue.width,ue.height,ue.depth,0,O,z,ue.data);else if(T.isData3DTexture)L?(re&&t.texStorage3D(i.TEXTURE_3D,ae,H,ue.width,ue.height,ue.depth),ce&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,O,z,ue.data)):t.texImage3D(i.TEXTURE_3D,0,H,ue.width,ue.height,ue.depth,0,O,z,ue.data);else if(T.isFramebufferTexture){if(re)if(L)t.texStorage2D(i.TEXTURE_2D,ae,H,ue.width,ue.height);else{let te=ue.width,j=ue.height;for(let ve=0;ve<ae;ve++)t.texImage2D(i.TEXTURE_2D,ve,H,te,j,0,O,z,null),te>>=1,j>>=1}}else if(se.length>0){if(L&&re){const te=qe(se[0]);t.texStorage2D(i.TEXTURE_2D,ae,H,te.width,te.height)}for(let te=0,j=se.length;te<j;te++)$=se[te],L?ce&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,O,z,$):t.texImage2D(i.TEXTURE_2D,te,H,O,z,$);T.generateMipmaps=!1}else if(L){if(re){const te=qe(ue);t.texStorage2D(i.TEXTURE_2D,ae,H,te.width,te.height)}ce&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,O,z,ue)}else t.texImage2D(i.TEXTURE_2D,0,H,O,z,ue);p(T)&&h(le),ze.__version=ne.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function Y(U,T,W){if(T.image.length!==6)return;const le=Se(U,T),fe=T.source;t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+W);const ne=n.get(fe);if(fe.version!==ne.__version||le===!0){t.activeTexture(i.TEXTURE0+W);const ze=gt.getPrimaries(gt.workingColorSpace),we=T.colorSpace===Si?null:gt.getPrimaries(T.colorSpace),Ve=T.colorSpace===Si||ze===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);const Fe=T.isCompressedTexture||T.image[0].isCompressedTexture,ue=T.image[0]&&T.image[0].isDataTexture,O=[];for(let j=0;j<6;j++)!Fe&&!ue?O[j]=v(T.image[j],!0,s.maxCubemapSize):O[j]=ue?T.image[j].image:T.image[j],O[j]=Be(T,O[j]);const z=O[0],H=r.convert(T.format,T.colorSpace),$=r.convert(T.type),se=y(T.internalFormat,H,$,T.colorSpace),L=T.isVideoTexture!==!0,re=ne.__version===void 0||le===!0,ce=fe.dataReady;let ae=E(T,z);F(i.TEXTURE_CUBE_MAP,T);let te;if(Fe){L&&re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,se,z.width,z.height);for(let j=0;j<6;j++){te=O[j].mipmaps;for(let ve=0;ve<te.length;ve++){const ge=te[ve];T.format!==Nn?H!==null?L?ce&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,0,0,ge.width,ge.height,H,ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,se,ge.width,ge.height,0,ge.data):Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,0,0,ge.width,ge.height,H,$,ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,se,ge.width,ge.height,0,H,$,ge.data)}}}else{if(te=T.mipmaps,L&&re){te.length>0&&ae++;const j=qe(O[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,se,j.width,j.height)}for(let j=0;j<6;j++)if(ue){L?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,O[j].width,O[j].height,H,$,O[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,se,O[j].width,O[j].height,0,H,$,O[j].data);for(let ve=0;ve<te.length;ve++){const de=te[ve].image[j].image;L?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,0,0,de.width,de.height,H,$,de.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,se,de.width,de.height,0,H,$,de.data)}}else{L?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,H,$,O[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,se,H,$,O[j]);for(let ve=0;ve<te.length;ve++){const ge=te[ve];L?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,0,0,H,$,ge.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,se,H,$,ge.image[j])}}}p(T)&&h(i.TEXTURE_CUBE_MAP),ne.__version=fe.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function pe(U,T,W,le,fe,ne){const ze=r.convert(W.format,W.colorSpace),we=r.convert(W.type),Ve=y(W.internalFormat,ze,we,W.colorSpace),Fe=n.get(T),ue=n.get(W);if(ue.__renderTarget=T,!Fe.__hasExternalTextures){const O=Math.max(1,T.width>>ne),z=Math.max(1,T.height>>ne);fe===i.TEXTURE_3D||fe===i.TEXTURE_2D_ARRAY?t.texImage3D(fe,ne,Ve,O,z,T.depth,0,ze,we,null):t.texImage2D(fe,ne,Ve,O,z,0,ze,we,null)}t.bindFramebuffer(i.FRAMEBUFFER,U),Le(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,le,fe,ue.__webglTexture,0,xt(T)):(fe===i.TEXTURE_2D||fe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,le,fe,ue.__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function be(U,T,W){if(i.bindRenderbuffer(i.RENDERBUFFER,U),T.depthBuffer){const le=T.depthTexture,fe=le&&le.isDepthTexture?le.type:null,ne=S(T.stencilBuffer,fe),ze=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=xt(T);Le(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we,ne,T.width,T.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,we,ne,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,ne,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ze,i.RENDERBUFFER,U)}else{const le=T.textures;for(let fe=0;fe<le.length;fe++){const ne=le[fe],ze=r.convert(ne.format,ne.colorSpace),we=r.convert(ne.type),Ve=y(ne.internalFormat,ze,we,ne.colorSpace),Fe=xt(T);W&&Le(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,Ve,T.width,T.height):Le(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Fe,Ve,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,Ve,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const le=n.get(T.depthTexture);le.__renderTarget=T,(!le.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),Z(T.depthTexture,0);const fe=le.__webglTexture,ne=xt(T);if(T.depthTexture.format===er)Le(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,fe,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,fe,0);else if(T.depthTexture.format===tr)Le(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,fe,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function ke(U){const T=n.get(U),W=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const le=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),le){const fe=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,le.removeEventListener("dispose",fe)};le.addEventListener("dispose",fe),T.__depthDisposeCallback=fe}T.__boundDepthTexture=le}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const le=U.texture.mipmaps;le&&le.length>0?Te(T.__webglFramebuffer[0],U):Te(T.__webglFramebuffer,U)}else if(W){T.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[le]),T.__webglDepthbuffer[le]===void 0)T.__webglDepthbuffer[le]=i.createRenderbuffer(),be(T.__webglDepthbuffer[le],U,!1);else{const fe=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer[le];i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,ne)}}else{const le=U.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),be(T.__webglDepthbuffer,U,!1);else{const fe=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,ne)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function bt(U,T,W){const le=n.get(U);T!==void 0&&pe(le.__webglFramebuffer,U,U.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&ke(U)}function Ge(U){const T=U.texture,W=n.get(U),le=n.get(T);U.addEventListener("dispose",R);const fe=U.textures,ne=U.isWebGLCubeRenderTarget===!0,ze=fe.length>1;if(ze||(le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture()),le.__version=T.version,a.memory.textures++),ne){W.__webglFramebuffer=[];for(let we=0;we<6;we++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[we]=[];for(let Ve=0;Ve<T.mipmaps.length;Ve++)W.__webglFramebuffer[we][Ve]=i.createFramebuffer()}else W.__webglFramebuffer[we]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let we=0;we<T.mipmaps.length;we++)W.__webglFramebuffer[we]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(ze)for(let we=0,Ve=fe.length;we<Ve;we++){const Fe=n.get(fe[we]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(U.samples>0&&Le(U)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let we=0;we<fe.length;we++){const Ve=fe[we];W.__webglColorRenderbuffer[we]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[we]);const Fe=r.convert(Ve.format,Ve.colorSpace),ue=r.convert(Ve.type),O=y(Ve.internalFormat,Fe,ue,Ve.colorSpace,U.isXRRenderTarget===!0),z=xt(U);i.renderbufferStorageMultisample(i.RENDERBUFFER,z,O,U.width,U.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,W.__webglColorRenderbuffer[we])}i.bindRenderbuffer(i.RENDERBUFFER,null),U.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),be(W.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ne){t.bindTexture(i.TEXTURE_CUBE_MAP,le.__webglTexture),F(i.TEXTURE_CUBE_MAP,T);for(let we=0;we<6;we++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ve=0;Ve<T.mipmaps.length;Ve++)pe(W.__webglFramebuffer[we][Ve],U,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+we,Ve);else pe(W.__webglFramebuffer[we],U,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0);p(T)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ze){for(let we=0,Ve=fe.length;we<Ve;we++){const Fe=fe[we],ue=n.get(Fe);let O=i.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(O=U.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(O,ue.__webglTexture),F(O,Fe),pe(W.__webglFramebuffer,U,Fe,i.COLOR_ATTACHMENT0+we,O,0),p(Fe)&&h(O)}t.unbindTexture()}else{let we=i.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(we=U.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,le.__webglTexture),F(we,T),T.mipmaps&&T.mipmaps.length>0)for(let Ve=0;Ve<T.mipmaps.length;Ve++)pe(W.__webglFramebuffer[Ve],U,T,i.COLOR_ATTACHMENT0,we,Ve);else pe(W.__webglFramebuffer,U,T,i.COLOR_ATTACHMENT0,we,0);p(T)&&h(we),t.unbindTexture()}U.depthBuffer&&ke(U)}function mt(U){const T=U.textures;for(let W=0,le=T.length;W<le;W++){const fe=T[W];if(p(fe)){const ne=_(U),ze=n.get(fe).__webglTexture;t.bindTexture(ne,ze),h(ne),t.unbindTexture()}}}const N=[],nt=[];function et(U){if(U.samples>0){if(Le(U)===!1){const T=U.textures,W=U.width,le=U.height;let fe=i.COLOR_BUFFER_BIT;const ne=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ze=n.get(U),we=T.length>1;if(we)for(let Fe=0;Fe<T.length;Fe++)t.bindFramebuffer(i.FRAMEBUFFER,ze.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ze.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ze.__webglMultisampledFramebuffer);const Ve=U.texture.mipmaps;Ve&&Ve.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ze.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ze.__webglFramebuffer);for(let Fe=0;Fe<T.length;Fe++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(fe|=i.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(fe|=i.STENCIL_BUFFER_BIT)),we){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ze.__webglColorRenderbuffer[Fe]);const ue=n.get(T[Fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ue,0)}i.blitFramebuffer(0,0,W,le,0,0,W,le,fe,i.NEAREST),c===!0&&(N.length=0,nt.length=0,N.push(i.COLOR_ATTACHMENT0+Fe),U.depthBuffer&&U.resolveDepthBuffer===!1&&(N.push(ne),nt.push(ne),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,nt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,N))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),we)for(let Fe=0;Fe<T.length;Fe++){t.bindFramebuffer(i.FRAMEBUFFER,ze.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,ze.__webglColorRenderbuffer[Fe]);const ue=n.get(T[Fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ze.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,ue,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ze.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function xt(U){return Math.min(s.maxSamples,U.samples)}function Le(U){const T=n.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Pt(U){const T=a.render.frame;d.get(U)!==T&&(d.set(U,T),U.update())}function Be(U,T){const W=U.colorSpace,le=U.format,fe=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||W!==Ss&&W!==Si&&(gt.getTransfer(W)===yt?(le!==Nn||fe!==Kn)&&Qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Bt("WebGLTextures: Unsupported texture color space:",W)),T}function qe(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=I,this.setTexture2D=Z,this.setTexture2DArray=J,this.setTexture3D=oe,this.setTextureCube=ie,this.rebindTextures=bt,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=Le}function og(i,e){function t(n,s=Si){let r;const a=gt.getTransfer(s);if(n===Kn)return i.UNSIGNED_BYTE;if(n===jo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ph)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===dh)return i.BYTE;if(n===uh)return i.SHORT;if(n===js)return i.UNSIGNED_SHORT;if(n===Jo)return i.INT;if(n===Gi)return i.UNSIGNED_INT;if(n===Yn)return i.FLOAT;if(n===$n)return i.HALF_FLOAT;if(n===mh)return i.ALPHA;if(n===xh)return i.RGB;if(n===Nn)return i.RGBA;if(n===er)return i.DEPTH_COMPONENT;if(n===tr)return i.DEPTH_STENCIL;if(n===ec)return i.RED;if(n===tc)return i.RED_INTEGER;if(n===nc)return i.RG;if(n===ic)return i.RG_INTEGER;if(n===sc)return i.RGBA_INTEGER;if(n===kr||n===Vr||n===Gr||n===Hr)if(a===yt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===kr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===kr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===co||n===lo||n===ho||n===uo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===co)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ho)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===uo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fo||n===po||n===mo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fo||n===po)return a===yt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===mo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===xo||n===go||n===_o||n===vo||n===Mo||n===So||n===yo||n===bo||n===wo||n===To||n===Eo||n===Ao||n===Co||n===Ro)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===xo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===go)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_o)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Mo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===So)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===yo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===wo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===To)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ao)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Co)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ro)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Po||n===Lo||n===Do)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Po)return a===yt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Lo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Do)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Io||n===Uo||n===Fo||n===No)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Io)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Uo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===No)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const cg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lg=`
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

}`;class hg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Rh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new tn({vertexShader:cg,fragmentShader:lg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new Ut(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dg extends Ts{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,m=null,g=null;const v=typeof XRWebGLBinding<"u",p=new hg,h={},_=t.getContextAttributes();let y=null,S=null;const E=[],w=[],R=new Ee;let P=null;const b=new yn;b.viewport=new At;const M=new yn;M.viewport=new At;const A=[b,M],I=new Rf;let B=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let Y=E[G];return Y===void 0&&(Y=new Da,E[G]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(G){let Y=E[G];return Y===void 0&&(Y=new Da,E[G]=Y),Y.getGripSpace()},this.getHand=function(G){let Y=E[G];return Y===void 0&&(Y=new Da,E[G]=Y),Y.getHandSpace()};function Z(G){const Y=w.indexOf(G.inputSource);if(Y===-1)return;const pe=E[Y];pe!==void 0&&(pe.update(G.inputSource,G.frame,l||a),pe.dispatchEvent({type:G.type,data:G.inputSource}))}function J(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",oe);for(let G=0;G<E.length;G++){const Y=w[G];Y!==null&&(w[G]=null,E[G].disconnect(Y))}B=null,q=null,p.reset();for(const G in h)delete h[G];e.setRenderTarget(y),m=null,f=null,u=null,s=null,S=null,_e.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&Qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,n.isPresenting===!0&&Qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(G){l=G},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",J),s.addEventListener("inputsourceschange",oe),_.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,be=null,Te=null;_.depth&&(Te=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=_.stencil?tr:er,be=_.stencil?Qs:Gi);const ke={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(ke),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new On(f.textureWidth,f.textureHeight,{format:Nn,type:Kn,depthTexture:new Ch(f.textureWidth,f.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new On(m.framebufferWidth,m.framebufferHeight,{format:Nn,type:Kn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),_e.setContext(s),_e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function oe(G){for(let Y=0;Y<G.removed.length;Y++){const pe=G.removed[Y],be=w.indexOf(pe);be>=0&&(w[be]=null,E[be].disconnect(pe))}for(let Y=0;Y<G.added.length;Y++){const pe=G.added[Y];let be=w.indexOf(pe);if(be===-1){for(let ke=0;ke<E.length;ke++)if(ke>=w.length){w.push(pe),be=ke;break}else if(w[ke]===null){w[ke]=pe,be=ke;break}if(be===-1)break}const Te=E[be];Te&&Te.connect(pe)}}const ie=new D,me=new D;function Me(G,Y,pe){ie.setFromMatrixPosition(Y.matrixWorld),me.setFromMatrixPosition(pe.matrixWorld);const be=ie.distanceTo(me),Te=Y.projectionMatrix.elements,ke=pe.projectionMatrix.elements,bt=Te[14]/(Te[10]-1),Ge=Te[14]/(Te[10]+1),mt=(Te[9]+1)/Te[5],N=(Te[9]-1)/Te[5],nt=(Te[8]-1)/Te[0],et=(ke[8]+1)/ke[0],xt=bt*nt,Le=bt*et,Pt=be/(-nt+et),Be=Pt*-nt;if(Y.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Be),G.translateZ(Pt),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),Te[10]===-1)G.projectionMatrix.copy(Y.projectionMatrix),G.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const qe=bt+Pt,U=Ge+Pt,T=xt-Be,W=Le+(be-Be),le=mt*Ge/U*qe,fe=N*Ge/U*qe;G.projectionMatrix.makePerspective(T,W,le,fe,qe,U),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function De(G,Y){Y===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(Y.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let Y=G.near,pe=G.far;p.texture!==null&&(p.depthNear>0&&(Y=p.depthNear),p.depthFar>0&&(pe=p.depthFar)),I.near=M.near=b.near=Y,I.far=M.far=b.far=pe,(B!==I.near||q!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),B=I.near,q=I.far),I.layers.mask=G.layers.mask|6,b.layers.mask=I.layers.mask&3,M.layers.mask=I.layers.mask&5;const be=G.parent,Te=I.cameras;De(I,be);for(let ke=0;ke<Te.length;ke++)De(Te[ke],be);Te.length===2?Me(I,b,M):I.projectionMatrix.copy(b.projectionMatrix),F(G,I,be)};function F(G,Y,pe){pe===null?G.matrix.copy(Y.matrixWorld):(G.matrix.copy(pe.matrixWorld),G.matrix.invert(),G.matrix.multiply(Y.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(Y.projectionMatrix),G.projectionMatrixInverse.copy(Y.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=ir*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(G){c=G,f!==null&&(f.fixedFoveation=G),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=G)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(G){return h[G]};let Se=null;function xe(G,Y){if(d=Y.getViewerPose(l||a),g=Y,d!==null){const pe=d.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let be=!1;pe.length!==I.cameras.length&&(I.cameras.length=0,be=!0);for(let Ge=0;Ge<pe.length;Ge++){const mt=pe[Ge];let N=null;if(m!==null)N=m.getViewport(mt);else{const et=u.getViewSubImage(f,mt);N=et.viewport,Ge===0&&(e.setRenderTargetTextures(S,et.colorTexture,et.depthStencilTexture),e.setRenderTarget(S))}let nt=A[Ge];nt===void 0&&(nt=new yn,nt.layers.enable(Ge),nt.viewport=new At,A[Ge]=nt),nt.matrix.fromArray(mt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(mt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(N.x,N.y,N.width,N.height),Ge===0&&(I.matrix.copy(nt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),be===!0&&I.cameras.push(nt)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const Ge=u.getDepthInformation(pe[0]);Ge&&Ge.isValid&&Ge.texture&&p.init(Ge,s.renderState)}if(Te&&Te.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let Ge=0;Ge<pe.length;Ge++){const mt=pe[Ge].camera;if(mt){let N=h[mt];N||(N=new Rh,h[mt]=N);const nt=u.getCameraImage(mt);N.sourceTexture=nt}}}}for(let pe=0;pe<E.length;pe++){const be=w[pe],Te=E[pe];be!==null&&Te!==void 0&&Te.update(be,Y,l||a)}Se&&Se(G,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),g=null}const _e=new Vh;_e.setAnimationLoop(xe),this.setAnimationLoop=function(G){Se=G},this.dispose=function(){}}}const Ii=new kn,ug=new Mt;function fg(i,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function n(p,h){h.color.getRGB(p.fogColor.value,bh(i)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function s(p,h,_,y,S){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),u(p,h)):h.isMeshPhongMaterial?(r(p,h),d(p,h)):h.isMeshStandardMaterial?(r(p,h),f(p,h),h.isMeshPhysicalMaterial&&m(p,h,S)):h.isMeshMatcapMaterial?(r(p,h),g(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),v(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?c(p,h,_,y):h.isSpriteMaterial?l(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===nn&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===nn&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const _=e.get(h),y=_.envMap,S=_.envMapRotation;y&&(p.envMap.value=y,Ii.copy(S),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),p.envMapRotation.value.setFromMatrix4(ug.makeRotationFromEuler(Ii)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function c(p,h,_,y){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*_,p.scale.value=y*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function l(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function d(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function u(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,_){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===nn&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function v(p,h){const _=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function pg(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,y){const S=y.program;n.uniformBlockBinding(_,S)}function l(_,y){let S=s[_.id];S===void 0&&(g(_),S=d(_),s[_.id]=S,_.addEventListener("dispose",p));const E=y.program;n.updateUBOMapping(_,E);const w=e.render.frame;r[_.id]!==w&&(f(_),r[_.id]=w)}function d(_){const y=u();_.__bindingPointIndex=y;const S=i.createBuffer(),E=_.__size,w=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,E,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,S),S}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Bt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const y=s[_.id],S=_.uniforms,E=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let w=0,R=S.length;w<R;w++){const P=Array.isArray(S[w])?S[w]:[S[w]];for(let b=0,M=P.length;b<M;b++){const A=P[b];if(m(A,w,b,E)===!0){const I=A.__offset,B=Array.isArray(A.value)?A.value:[A.value];let q=0;for(let Z=0;Z<B.length;Z++){const J=B[Z],oe=v(J);typeof J=="number"||typeof J=="boolean"?(A.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,I+q,A.__data)):J.isMatrix3?(A.__data[0]=J.elements[0],A.__data[1]=J.elements[1],A.__data[2]=J.elements[2],A.__data[3]=0,A.__data[4]=J.elements[3],A.__data[5]=J.elements[4],A.__data[6]=J.elements[5],A.__data[7]=0,A.__data[8]=J.elements[6],A.__data[9]=J.elements[7],A.__data[10]=J.elements[8],A.__data[11]=0):(J.toArray(A.__data,q),q+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(_,y,S,E){const w=_.value,R=y+"_"+S;if(E[R]===void 0)return typeof w=="number"||typeof w=="boolean"?E[R]=w:E[R]=w.clone(),!0;{const P=E[R];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return E[R]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(_){const y=_.uniforms;let S=0;const E=16;for(let R=0,P=y.length;R<P;R++){const b=Array.isArray(y[R])?y[R]:[y[R]];for(let M=0,A=b.length;M<A;M++){const I=b[M],B=Array.isArray(I.value)?I.value:[I.value];for(let q=0,Z=B.length;q<Z;q++){const J=B[q],oe=v(J),ie=S%E,me=ie%oe.boundary,Me=ie+me;S+=me,Me!==0&&E-Me<oe.storage&&(S+=E-Me),I.__data=new Float32Array(oe.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=S,S+=oe.storage}}}const w=S%E;return w>0&&(S+=E-w),_.__size=S,_.__cache={},this}function v(_){const y={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?Qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Qe("WebGLRenderer: Unsupported uniform value type.",_),y}function p(_){const y=_.target;y.removeEventListener("dispose",p);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function h(){for(const _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const mg=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let ii=null;function xg(){return ii===null&&(ii=new Ah(mg,32,32,nc,$n),ii.minFilter=Cn,ii.magFilter=Cn,ii.wrapS=ai,ii.wrapT=ai,ii.generateMipmaps=!1,ii.needsUpdate=!0),ii}class gg{constructor(e={}){const{canvas:t=jd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Set([sc,ic,tc]),v=new Set([Kn,Gi,js,Qs,jo,Qo]),p=new Uint32Array(4),h=new Int32Array(4);let _=null,y=null;const S=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let R=!1;this._outputColorSpace=Tt;let P=0,b=0,M=null,A=-1,I=null;const B=new At,q=new At;let Z=null;const J=new Ze(0);let oe=0,ie=t.width,me=t.height,Me=1,De=null,F=null;const Se=new At(0,0,ie,me),xe=new At(0,0,ie,me);let _e=!1;const G=new dc;let Y=!1,pe=!1;const be=new Mt,Te=new D,ke=new At,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function mt(){return M===null?Me:1}let N=n;function nt(C,k){return t.getContext(C,k)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Zo}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",j,!1),t.addEventListener("webglcontextcreationerror",ve,!1),N===null){const k="webgl2";if(N=nt(k,C),N===null)throw nt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw C("WebGLRenderer: "+C.message),C}let et,xt,Le,Pt,Be,qe,U,T,W,le,fe,ne,ze,we,Ve,Fe,ue,O,z,H,$,se,L,re;function ce(){et=new Tm(N),et.init(),se=new og(N,et),xt=new xm(N,et,e,se),Le=new rg(N,et),xt.reversedDepthBuffer&&f&&Le.buffers.depth.setReversed(!0),Pt=new Cm(N),Be=new Yx,qe=new ag(N,et,Le,Be,xt,se,Pt),U=new _m(w),T=new wm(w),W=new Df(N),L=new pm(N,W),le=new Em(N,W,Pt,L),fe=new Pm(N,le,W,Pt),z=new Rm(N,xt,qe),Fe=new gm(Be),ne=new Xx(w,U,T,et,xt,L,Fe),ze=new fg(w,Be),we=new Zx,Ve=new eg(et),O=new fm(w,U,T,Le,fe,m,c),ue=new ig(w,fe,xt),re=new pg(N,Pt,xt,Le),H=new mm(N,et,Pt),$=new Am(N,et,Pt),Pt.programs=ne.programs,w.capabilities=xt,w.extensions=et,w.properties=Be,w.renderLists=we,w.shadowMap=ue,w.state=Le,w.info=Pt}ce();const ae=new dg(w,N);this.xr=ae,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const C=et.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=et.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(C){C!==void 0&&(Me=C,this.setSize(ie,me,!1))},this.getSize=function(C){return C.set(ie,me)},this.setSize=function(C,k,Q=!0){if(ae.isPresenting){Qe("WebGLRenderer: Can't change size while VR device is presenting.");return}ie=C,me=k,t.width=Math.floor(C*Me),t.height=Math.floor(k*Me),Q===!0&&(t.style.width=C+"px",t.style.height=k+"px"),this.setViewport(0,0,C,k)},this.getDrawingBufferSize=function(C){return C.set(ie*Me,me*Me).floor()},this.setDrawingBufferSize=function(C,k,Q){ie=C,me=k,Me=Q,t.width=Math.floor(C*Q),t.height=Math.floor(k*Q),this.setViewport(0,0,C,k)},this.getCurrentViewport=function(C){return C.copy(B)},this.getViewport=function(C){return C.copy(Se)},this.setViewport=function(C,k,Q,ee){C.isVector4?Se.set(C.x,C.y,C.z,C.w):Se.set(C,k,Q,ee),Le.viewport(B.copy(Se).multiplyScalar(Me).round())},this.getScissor=function(C){return C.copy(xe)},this.setScissor=function(C,k,Q,ee){C.isVector4?xe.set(C.x,C.y,C.z,C.w):xe.set(C,k,Q,ee),Le.scissor(q.copy(xe).multiplyScalar(Me).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(C){Le.setScissorTest(_e=C)},this.setOpaqueSort=function(C){De=C},this.setTransparentSort=function(C){F=C},this.getClearColor=function(C){return C.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(C=!0,k=!0,Q=!0){let ee=0;if(C){let V=!1;if(M!==null){const ye=M.texture.format;V=g.has(ye)}if(V){const ye=M.texture.type,Re=v.has(ye),Ie=O.getClearColor(),Pe=O.getClearAlpha(),Ye=Ie.r,Ke=Ie.g,He=Ie.b;Re?(p[0]=Ye,p[1]=Ke,p[2]=He,p[3]=Pe,N.clearBufferuiv(N.COLOR,0,p)):(h[0]=Ye,h[1]=Ke,h[2]=He,h[3]=Pe,N.clearBufferiv(N.COLOR,0,h))}else ee|=N.COLOR_BUFFER_BIT}k&&(ee|=N.DEPTH_BUFFER_BIT),Q&&(ee|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(ee)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",j,!1),t.removeEventListener("webglcontextcreationerror",ve,!1),O.dispose(),we.dispose(),Ve.dispose(),Be.dispose(),U.dispose(),T.dispose(),fe.dispose(),L.dispose(),re.dispose(),ne.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",rt),ae.removeEventListener("sessionend",Vt),Lt.stop()};function te(C){C.preventDefault(),Fc("WebGLRenderer: Context Lost."),R=!0}function j(){Fc("WebGLRenderer: Context Restored."),R=!1;const C=Pt.autoReset,k=ue.enabled,Q=ue.autoUpdate,ee=ue.needsUpdate,V=ue.type;ce(),Pt.autoReset=C,ue.enabled=k,ue.autoUpdate=Q,ue.needsUpdate=ee,ue.type=V}function ve(C){Bt("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ge(C){const k=C.target;k.removeEventListener("dispose",ge),de(k)}function de(C){Ne(C),Be.remove(C)}function Ne(C){const k=Be.get(C).programs;k!==void 0&&(k.forEach(function(Q){ne.releaseProgram(Q)}),C.isShaderMaterial&&ne.releaseShaderCache(C))}this.renderBufferDirect=function(C,k,Q,ee,V,ye){k===null&&(k=bt);const Re=V.isMesh&&V.matrixWorld.determinant()<0,Ie=ui(C,k,Q,ee,V);Le.setMaterial(ee,Re);let Pe=Q.index,Ye=1;if(ee.wireframe===!0){if(Pe=le.getWireframeAttribute(Q),Pe===void 0)return;Ye=2}const Ke=Q.drawRange,He=Q.attributes.position;let lt=Ke.start*Ye,wt=(Ke.start+Ke.count)*Ye;ye!==null&&(lt=Math.max(lt,ye.start*Ye),wt=Math.min(wt,(ye.start+ye.count)*Ye)),Pe!==null?(lt=Math.max(lt,0),wt=Math.min(wt,Pe.count)):He!=null&&(lt=Math.max(lt,0),wt=Math.min(wt,He.count));const Nt=wt-lt;if(Nt<0||Nt===1/0)return;L.setup(V,ee,Ie,Q,Pe);let Ot,Ct=H;if(Pe!==null&&(Ot=W.get(Pe),Ct=$,Ct.setIndex(Ot)),V.isMesh)ee.wireframe===!0?(Le.setLineWidth(ee.wireframeLinewidth*mt()),Ct.setMode(N.LINES)):Ct.setMode(N.TRIANGLES);else if(V.isLine){let We=ee.linewidth;We===void 0&&(We=1),Le.setLineWidth(We*mt()),V.isLineSegments?Ct.setMode(N.LINES):V.isLineLoop?Ct.setMode(N.LINE_LOOP):Ct.setMode(N.LINE_STRIP)}else V.isPoints?Ct.setMode(N.POINTS):V.isSprite&&Ct.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)nr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ct.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))Ct.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const We=V._multiDrawStarts,Dt=V._multiDrawCounts,_t=V._multiDrawCount,_n=Pe?W.get(Pe).bytesPerElement:1,$i=Be.get(ee).currentProgram.getUniforms();for(let vn=0;vn<_t;vn++)$i.setValue(N,"_gl_DrawID",vn),Ct.render(We[vn]/_n,Dt[vn])}else if(V.isInstancedMesh)Ct.renderInstances(lt,Nt,V.count);else if(Q.isInstancedBufferGeometry){const We=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Dt=Math.min(Q.instanceCount,We);Ct.renderInstances(lt,Nt,Dt)}else Ct.render(lt,Nt)};function $e(C,k,Q){C.transparent===!0&&C.side===ut&&C.forceSinglePass===!1?(C.side=nn,C.needsUpdate=!0,Tn(C,k,Q),C.side=Ei,C.needsUpdate=!0,Tn(C,k,Q),C.side=ut):Tn(C,k,Q)}this.compile=function(C,k,Q=null){Q===null&&(Q=C),y=Ve.get(Q),y.init(k),E.push(y),Q.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),C!==Q&&C.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),y.setupLights();const ee=new Set;return C.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ye=V.material;if(ye)if(Array.isArray(ye))for(let Re=0;Re<ye.length;Re++){const Ie=ye[Re];$e(Ie,Q,V),ee.add(Ie)}else $e(ye,Q,V),ee.add(ye)}),y=E.pop(),ee},this.compileAsync=function(C,k,Q=null){const ee=this.compile(C,k,Q);return new Promise(V=>{function ye(){if(ee.forEach(function(Re){Be.get(Re).currentProgram.isReady()&&ee.delete(Re)}),ee.size===0){V(C);return}setTimeout(ye,10)}et.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let dt=null;function vt(C){dt&&dt(C)}function rt(){Lt.stop()}function Vt(){Lt.start()}const Lt=new Vh;Lt.setAnimationLoop(vt),typeof self<"u"&&Lt.setContext(self),this.setAnimationLoop=function(C){dt=C,ae.setAnimationLoop(C),C===null?Lt.stop():Lt.start()},ae.addEventListener("sessionstart",rt),ae.addEventListener("sessionend",Vt),this.render=function(C,k){if(k!==void 0&&k.isCamera!==!0){Bt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(k),k=ae.getCamera()),C.isScene===!0&&C.onBeforeRender(w,C,k,M),y=Ve.get(C,E.length),y.init(k),E.push(y),be.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),G.setFromProjectionMatrix(be,qn,k.reversedDepth),pe=this.localClippingEnabled,Y=Fe.init(this.clippingPlanes,pe),_=we.get(C,S.length),_.init(),S.push(_),ae.enabled===!0&&ae.isPresenting===!0){const ye=w.xr.getDepthSensingMesh();ye!==null&&Yt(ye,k,-1/0,w.sortObjects)}Yt(C,k,0,w.sortObjects),_.finish(),w.sortObjects===!0&&_.sort(De,F),Ge=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Ge&&O.addToRenderList(_,C),this.info.render.frame++,Y===!0&&Fe.beginShadows();const Q=y.state.shadowsArray;ue.render(Q,C,k),Y===!0&&Fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const ee=_.opaque,V=_.transmissive;if(y.setupLights(),k.isArrayCamera){const ye=k.cameras;if(V.length>0)for(let Re=0,Ie=ye.length;Re<Ie;Re++){const Pe=ye[Re];Kt(ee,V,C,Pe)}Ge&&O.render(C);for(let Re=0,Ie=ye.length;Re<Ie;Re++){const Pe=ye[Re];$t(_,C,Pe,Pe.viewport)}}else V.length>0&&Kt(ee,V,C,k),Ge&&O.render(C),$t(_,C,k);M!==null&&b===0&&(qe.updateMultisampleRenderTarget(M),qe.updateRenderTargetMipmap(M)),C.isScene===!0&&C.onAfterRender(w,C,k),L.resetDefaultState(),A=-1,I=null,E.pop(),E.length>0?(y=E[E.length-1],Y===!0&&Fe.setGlobalState(w.clippingPlanes,y.state.camera)):y=null,S.pop(),S.length>0?_=S[S.length-1]:_=null};function Yt(C,k,Q,ee){if(C.visible===!1)return;if(C.layers.test(k.layers)){if(C.isGroup)Q=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(k);else if(C.isLight)y.pushLight(C),C.castShadow&&y.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||G.intersectsSprite(C)){ee&&ke.setFromMatrixPosition(C.matrixWorld).applyMatrix4(be);const Re=fe.update(C),Ie=C.material;Ie.visible&&_.push(C,Re,Ie,Q,ke.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||G.intersectsObject(C))){const Re=fe.update(C),Ie=C.material;if(ee&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),ke.copy(C.boundingSphere.center)):(Re.boundingSphere===null&&Re.computeBoundingSphere(),ke.copy(Re.boundingSphere.center)),ke.applyMatrix4(C.matrixWorld).applyMatrix4(be)),Array.isArray(Ie)){const Pe=Re.groups;for(let Ye=0,Ke=Pe.length;Ye<Ke;Ye++){const He=Pe[Ye],lt=Ie[He.materialIndex];lt&&lt.visible&&_.push(C,Re,lt,Q,ke.z,He)}}else Ie.visible&&_.push(C,Re,Ie,Q,ke.z,null)}}const ye=C.children;for(let Re=0,Ie=ye.length;Re<Ie;Re++)Yt(ye[Re],k,Q,ee)}function $t(C,k,Q,ee){const{opaque:V,transmissive:ye,transparent:Re}=C;y.setupLightsView(Q),Y===!0&&Fe.setGlobalState(w.clippingPlanes,Q),ee&&Le.viewport(B.copy(ee)),V.length>0&&Zt(V,k,Q),ye.length>0&&Zt(ye,k,Q),Re.length>0&&Zt(Re,k,Q),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Kt(C,k,Q,ee){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ee.id]===void 0&&(y.state.transmissionRenderTarget[ee.id]=new On(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?$n:Kn,minFilter:Bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:gt.workingColorSpace}));const ye=y.state.transmissionRenderTarget[ee.id],Re=ee.viewport||B;ye.setSize(Re.z*w.transmissionResolutionScale,Re.w*w.transmissionResolutionScale);const Ie=w.getRenderTarget(),Pe=w.getActiveCubeFace(),Ye=w.getActiveMipmapLevel();w.setRenderTarget(ye),w.getClearColor(J),oe=w.getClearAlpha(),oe<1&&w.setClearColor(16777215,.5),w.clear(),Ge&&O.render(Q);const Ke=w.toneMapping;w.toneMapping=wi;const He=ee.viewport;if(ee.viewport!==void 0&&(ee.viewport=void 0),y.setupLightsView(ee),Y===!0&&Fe.setGlobalState(w.clippingPlanes,ee),Zt(C,Q,ee),qe.updateMultisampleRenderTarget(ye),qe.updateRenderTargetMipmap(ye),et.has("WEBGL_multisampled_render_to_texture")===!1){let lt=!1;for(let wt=0,Nt=k.length;wt<Nt;wt++){const Ot=k[wt],{object:Ct,geometry:We,material:Dt,group:_t}=Ot;if(Dt.side===ut&&Ct.layers.test(ee.layers)){const _n=Dt.side;Dt.side=nn,Dt.needsUpdate=!0,xn(Ct,Q,ee,We,Dt,_t),Dt.side=_n,Dt.needsUpdate=!0,lt=!0}}lt===!0&&(qe.updateMultisampleRenderTarget(ye),qe.updateRenderTargetMipmap(ye))}w.setRenderTarget(Ie,Pe,Ye),w.setClearColor(J,oe),He!==void 0&&(ee.viewport=He),w.toneMapping=Ke}function Zt(C,k,Q){const ee=k.isScene===!0?k.overrideMaterial:null;for(let V=0,ye=C.length;V<ye;V++){const Re=C[V],{object:Ie,geometry:Pe,group:Ye}=Re;let Ke=Re.material;Ke.allowOverride===!0&&ee!==null&&(Ke=ee),Ie.layers.test(Q.layers)&&xn(Ie,k,Q,Pe,Ke,Ye)}}function xn(C,k,Q,ee,V,ye){C.onBeforeRender(w,k,Q,ee,V,ye),C.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),V.onBeforeRender(w,k,Q,ee,C,ye),V.transparent===!0&&V.side===ut&&V.forceSinglePass===!1?(V.side=nn,V.needsUpdate=!0,w.renderBufferDirect(Q,k,ee,V,C,ye),V.side=Ei,V.needsUpdate=!0,w.renderBufferDirect(Q,k,ee,V,C,ye),V.side=ut):w.renderBufferDirect(Q,k,ee,V,C,ye),C.onAfterRender(w,k,Q,ee,V,ye)}function Tn(C,k,Q){k.isScene!==!0&&(k=bt);const ee=Be.get(C),V=y.state.lights,ye=y.state.shadowsArray,Re=V.state.version,Ie=ne.getParameters(C,V.state,ye,k,Q),Pe=ne.getProgramCacheKey(Ie);let Ye=ee.programs;ee.environment=C.isMeshStandardMaterial?k.environment:null,ee.fog=k.fog,ee.envMap=(C.isMeshStandardMaterial?T:U).get(C.envMap||ee.environment),ee.envMapRotation=ee.environment!==null&&C.envMap===null?k.environmentRotation:C.envMapRotation,Ye===void 0&&(C.addEventListener("dispose",ge),Ye=new Map,ee.programs=Ye);let Ke=Ye.get(Pe);if(Ke!==void 0){if(ee.currentProgram===Ke&&ee.lightsStateVersion===Re)return gn(C,Ie),Ke}else Ie.uniforms=ne.getUniforms(C),C.onBeforeCompile(Ie,w),Ke=ne.acquireProgram(Ie,Pe),Ye.set(Pe,Ke),ee.uniforms=Ie.uniforms;const He=ee.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(He.clippingPlanes=Fe.uniform),gn(C,Ie),ee.needsLights=Zi(C),ee.lightsStateVersion=Re,ee.needsLights&&(He.ambientLightColor.value=V.state.ambient,He.lightProbe.value=V.state.probe,He.directionalLights.value=V.state.directional,He.directionalLightShadows.value=V.state.directionalShadow,He.spotLights.value=V.state.spot,He.spotLightShadows.value=V.state.spotShadow,He.rectAreaLights.value=V.state.rectArea,He.ltc_1.value=V.state.rectAreaLTC1,He.ltc_2.value=V.state.rectAreaLTC2,He.pointLights.value=V.state.point,He.pointLightShadows.value=V.state.pointShadow,He.hemisphereLights.value=V.state.hemi,He.directionalShadowMap.value=V.state.directionalShadowMap,He.directionalShadowMatrix.value=V.state.directionalShadowMatrix,He.spotShadowMap.value=V.state.spotShadowMap,He.spotLightMatrix.value=V.state.spotLightMatrix,He.spotLightMap.value=V.state.spotLightMap,He.pointShadowMap.value=V.state.pointShadowMap,He.pointShadowMatrix.value=V.state.pointShadowMatrix),ee.currentProgram=Ke,ee.uniformsList=null,Ke}function an(C){if(C.uniformsList===null){const k=C.currentProgram.getUniforms();C.uniformsList=Wr.seqWithValue(k.seq,C.uniforms)}return C.uniformsList}function gn(C,k){const Q=Be.get(C);Q.outputColorSpace=k.outputColorSpace,Q.batching=k.batching,Q.batchingColor=k.batchingColor,Q.instancing=k.instancing,Q.instancingColor=k.instancingColor,Q.instancingMorph=k.instancingMorph,Q.skinning=k.skinning,Q.morphTargets=k.morphTargets,Q.morphNormals=k.morphNormals,Q.morphColors=k.morphColors,Q.morphTargetsCount=k.morphTargetsCount,Q.numClippingPlanes=k.numClippingPlanes,Q.numIntersection=k.numClipIntersection,Q.vertexAlphas=k.vertexAlphas,Q.vertexTangents=k.vertexTangents,Q.toneMapping=k.toneMapping}function ui(C,k,Q,ee,V){k.isScene!==!0&&(k=bt),qe.resetTextureUnits();const ye=k.fog,Re=ee.isMeshStandardMaterial?k.environment:null,Ie=M===null?w.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Ss,Pe=(ee.isMeshStandardMaterial?T:U).get(ee.envMap||Re),Ye=ee.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Ke=!!Q.attributes.tangent&&(!!ee.normalMap||ee.anisotropy>0),He=!!Q.morphAttributes.position,lt=!!Q.morphAttributes.normal,wt=!!Q.morphAttributes.color;let Nt=wi;ee.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Nt=w.toneMapping);const Ot=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Ct=Ot!==void 0?Ot.length:0,We=Be.get(ee),Dt=y.state.lights;if(Y===!0&&(pe===!0||C!==I)){const on=C===I&&ee.id===A;Fe.setState(ee,C,on)}let _t=!1;ee.version===We.__version?(We.needsLights&&We.lightsStateVersion!==Dt.state.version||We.outputColorSpace!==Ie||V.isBatchedMesh&&We.batching===!1||!V.isBatchedMesh&&We.batching===!0||V.isBatchedMesh&&We.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&We.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&We.instancing===!1||!V.isInstancedMesh&&We.instancing===!0||V.isSkinnedMesh&&We.skinning===!1||!V.isSkinnedMesh&&We.skinning===!0||V.isInstancedMesh&&We.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&We.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&We.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&We.instancingMorph===!1&&V.morphTexture!==null||We.envMap!==Pe||ee.fog===!0&&We.fog!==ye||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==Fe.numPlanes||We.numIntersection!==Fe.numIntersection)||We.vertexAlphas!==Ye||We.vertexTangents!==Ke||We.morphTargets!==He||We.morphNormals!==lt||We.morphColors!==wt||We.toneMapping!==Nt||We.morphTargetsCount!==Ct)&&(_t=!0):(_t=!0,We.__version=ee.version);let _n=We.currentProgram;_t===!0&&(_n=Tn(ee,k,V));let $i=!1,vn=!1,Ps=!1;const It=_n.getUniforms(),pn=We.uniforms;if(Le.useProgram(_n.program)&&($i=!0,vn=!0,Ps=!0),ee.id!==A&&(A=ee.id,vn=!0),$i||I!==C){Le.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),It.setValue(N,"projectionMatrix",C.projectionMatrix),It.setValue(N,"viewMatrix",C.matrixWorldInverse);const mn=It.map.cameraPosition;mn!==void 0&&mn.setValue(N,Te.setFromMatrixPosition(C.matrixWorld)),xt.logarithmicDepthBuffer&&It.setValue(N,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(ee.isMeshPhongMaterial||ee.isMeshToonMaterial||ee.isMeshLambertMaterial||ee.isMeshBasicMaterial||ee.isMeshStandardMaterial||ee.isShaderMaterial)&&It.setValue(N,"isOrthographic",C.isOrthographicCamera===!0),I!==C&&(I=C,vn=!0,Ps=!0)}if(V.isSkinnedMesh){It.setOptional(N,V,"bindMatrix"),It.setOptional(N,V,"bindMatrixInverse");const on=V.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),It.setValue(N,"boneTexture",on.boneTexture,qe))}V.isBatchedMesh&&(It.setOptional(N,V,"batchingTexture"),It.setValue(N,"batchingTexture",V._matricesTexture,qe),It.setOptional(N,V,"batchingIdTexture"),It.setValue(N,"batchingIdTexture",V._indirectTexture,qe),It.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&It.setValue(N,"batchingColorTexture",V._colorsTexture,qe));const En=Q.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&z.update(V,Q,_n),(vn||We.receiveShadow!==V.receiveShadow)&&(We.receiveShadow=V.receiveShadow,It.setValue(N,"receiveShadow",V.receiveShadow)),ee.isMeshGouraudMaterial&&ee.envMap!==null&&(pn.envMap.value=Pe,pn.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),ee.isMeshStandardMaterial&&ee.envMap===null&&k.environment!==null&&(pn.envMapIntensity.value=k.environmentIntensity),pn.dfgLUT!==void 0&&(pn.dfgLUT.value=xg()),vn&&(It.setValue(N,"toneMappingExposure",w.toneMappingExposure),We.needsLights&&fi(pn,Ps),ye&&ee.fog===!0&&ze.refreshFogUniforms(pn,ye),ze.refreshMaterialUniforms(pn,ee,Me,me,y.state.transmissionRenderTarget[C.id]),Wr.upload(N,an(We),pn,qe)),ee.isShaderMaterial&&ee.uniformsNeedUpdate===!0&&(Wr.upload(N,an(We),pn,qe),ee.uniformsNeedUpdate=!1),ee.isSpriteMaterial&&It.setValue(N,"center",V.center),It.setValue(N,"modelViewMatrix",V.modelViewMatrix),It.setValue(N,"normalMatrix",V.normalMatrix),It.setValue(N,"modelMatrix",V.matrixWorld),ee.isShaderMaterial||ee.isRawShaderMaterial){const on=ee.uniformsGroups;for(let mn=0,ha=on.length;mn<ha;mn++){const Ai=on[mn];re.update(Ai,_n),re.bind(Ai,_n)}}return _n}function fi(C,k){C.ambientLightColor.needsUpdate=k,C.lightProbe.needsUpdate=k,C.directionalLights.needsUpdate=k,C.directionalLightShadows.needsUpdate=k,C.pointLights.needsUpdate=k,C.pointLightShadows.needsUpdate=k,C.spotLights.needsUpdate=k,C.spotLightShadows.needsUpdate=k,C.rectAreaLights.needsUpdate=k,C.hemisphereLights.needsUpdate=k}function Zi(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(C,k,Q){const ee=Be.get(C);ee.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,ee.__autoAllocateDepthBuffer===!1&&(ee.__useRenderToTexture=!1),Be.get(C.texture).__webglTexture=k,Be.get(C.depthTexture).__webglTexture=ee.__autoAllocateDepthBuffer?void 0:Q,ee.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,k){const Q=Be.get(C);Q.__webglFramebuffer=k,Q.__useDefaultFramebuffer=k===void 0};const xd=N.createFramebuffer();this.setRenderTarget=function(C,k=0,Q=0){M=C,P=k,b=Q;let ee=!0,V=null,ye=!1,Re=!1;if(C){const Pe=Be.get(C);if(Pe.__useDefaultFramebuffer!==void 0)Le.bindFramebuffer(N.FRAMEBUFFER,null),ee=!1;else if(Pe.__webglFramebuffer===void 0)qe.setupRenderTarget(C);else if(Pe.__hasExternalTextures)qe.rebindTextures(C,Be.get(C.texture).__webglTexture,Be.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const He=C.depthTexture;if(Pe.__boundDepthTexture!==He){if(He!==null&&Be.has(He)&&(C.width!==He.image.width||C.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(C)}}const Ye=C.texture;(Ye.isData3DTexture||Ye.isDataArrayTexture||Ye.isCompressedArrayTexture)&&(Re=!0);const Ke=Be.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Ke[k])?V=Ke[k][Q]:V=Ke[k],ye=!0):C.samples>0&&qe.useMultisampledRTT(C)===!1?V=Be.get(C).__webglMultisampledFramebuffer:Array.isArray(Ke)?V=Ke[Q]:V=Ke,B.copy(C.viewport),q.copy(C.scissor),Z=C.scissorTest}else B.copy(Se).multiplyScalar(Me).floor(),q.copy(xe).multiplyScalar(Me).floor(),Z=_e;if(Q!==0&&(V=xd),Le.bindFramebuffer(N.FRAMEBUFFER,V)&&ee&&Le.drawBuffers(C,V),Le.viewport(B),Le.scissor(q),Le.setScissorTest(Z),ye){const Pe=Be.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+k,Pe.__webglTexture,Q)}else if(Re){const Pe=k;for(let Ye=0;Ye<C.textures.length;Ye++){const Ke=Be.get(C.textures[Ye]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ye,Ke.__webglTexture,Q,Pe)}}else if(C!==null&&Q!==0){const Pe=Be.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Pe.__webglTexture,Q)}A=-1},this.readRenderTargetPixels=function(C,k,Q,ee,V,ye,Re,Ie=0){if(!(C&&C.isWebGLRenderTarget)){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=Be.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Re!==void 0&&(Pe=Pe[Re]),Pe){Le.bindFramebuffer(N.FRAMEBUFFER,Pe);try{const Ye=C.textures[Ie],Ke=Ye.format,He=Ye.type;if(!xt.textureFormatReadable(Ke)){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xt.textureTypeReadable(He)){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=C.width-ee&&Q>=0&&Q<=C.height-V&&(C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ie),N.readPixels(k,Q,ee,V,se.convert(Ke),se.convert(He),ye))}finally{const Ye=M!==null?Be.get(M).__webglFramebuffer:null;Le.bindFramebuffer(N.FRAMEBUFFER,Ye)}}},this.readRenderTargetPixelsAsync=async function(C,k,Q,ee,V,ye,Re,Ie=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=Be.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Re!==void 0&&(Pe=Pe[Re]),Pe)if(k>=0&&k<=C.width-ee&&Q>=0&&Q<=C.height-V){Le.bindFramebuffer(N.FRAMEBUFFER,Pe);const Ye=C.textures[Ie],Ke=Ye.format,He=Ye.type;if(!xt.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xt.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const lt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,lt),N.bufferData(N.PIXEL_PACK_BUFFER,ye.byteLength,N.STREAM_READ),C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ie),N.readPixels(k,Q,ee,V,se.convert(Ke),se.convert(He),0);const wt=M!==null?Be.get(M).__webglFramebuffer:null;Le.bindFramebuffer(N.FRAMEBUFFER,wt);const Nt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Qd(N,Nt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,lt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ye),N.deleteBuffer(lt),N.deleteSync(Nt),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,k=null,Q=0){const ee=Math.pow(2,-Q),V=Math.floor(C.image.width*ee),ye=Math.floor(C.image.height*ee),Re=k!==null?k.x:0,Ie=k!==null?k.y:0;qe.setTexture2D(C,0),N.copyTexSubImage2D(N.TEXTURE_2D,Q,0,0,Re,Ie,V,ye),Le.unbindTexture()};const gd=N.createFramebuffer(),_d=N.createFramebuffer();this.copyTextureToTexture=function(C,k,Q=null,ee=null,V=0,ye=null){ye===null&&(V!==0?(nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ye=V,V=0):ye=0);let Re,Ie,Pe,Ye,Ke,He,lt,wt,Nt;const Ot=C.isCompressedTexture?C.mipmaps[ye]:C.image;if(Q!==null)Re=Q.max.x-Q.min.x,Ie=Q.max.y-Q.min.y,Pe=Q.isBox3?Q.max.z-Q.min.z:1,Ye=Q.min.x,Ke=Q.min.y,He=Q.isBox3?Q.min.z:0;else{const En=Math.pow(2,-V);Re=Math.floor(Ot.width*En),Ie=Math.floor(Ot.height*En),C.isDataArrayTexture?Pe=Ot.depth:C.isData3DTexture?Pe=Math.floor(Ot.depth*En):Pe=1,Ye=0,Ke=0,He=0}ee!==null?(lt=ee.x,wt=ee.y,Nt=ee.z):(lt=0,wt=0,Nt=0);const Ct=se.convert(k.format),We=se.convert(k.type);let Dt;k.isData3DTexture?(qe.setTexture3D(k,0),Dt=N.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(qe.setTexture2DArray(k,0),Dt=N.TEXTURE_2D_ARRAY):(qe.setTexture2D(k,0),Dt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const _t=N.getParameter(N.UNPACK_ROW_LENGTH),_n=N.getParameter(N.UNPACK_IMAGE_HEIGHT),$i=N.getParameter(N.UNPACK_SKIP_PIXELS),vn=N.getParameter(N.UNPACK_SKIP_ROWS),Ps=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Ot.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ot.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ye),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ke),N.pixelStorei(N.UNPACK_SKIP_IMAGES,He);const It=C.isDataArrayTexture||C.isData3DTexture,pn=k.isDataArrayTexture||k.isData3DTexture;if(C.isDepthTexture){const En=Be.get(C),on=Be.get(k),mn=Be.get(En.__renderTarget),ha=Be.get(on.__renderTarget);Le.bindFramebuffer(N.READ_FRAMEBUFFER,mn.__webglFramebuffer),Le.bindFramebuffer(N.DRAW_FRAMEBUFFER,ha.__webglFramebuffer);for(let Ai=0;Ai<Pe;Ai++)It&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Be.get(C).__webglTexture,V,He+Ai),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Be.get(k).__webglTexture,ye,Nt+Ai)),N.blitFramebuffer(Ye,Ke,Re,Ie,lt,wt,Re,Ie,N.DEPTH_BUFFER_BIT,N.NEAREST);Le.bindFramebuffer(N.READ_FRAMEBUFFER,null),Le.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||C.isRenderTargetTexture||Be.has(C)){const En=Be.get(C),on=Be.get(k);Le.bindFramebuffer(N.READ_FRAMEBUFFER,gd),Le.bindFramebuffer(N.DRAW_FRAMEBUFFER,_d);for(let mn=0;mn<Pe;mn++)It?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,En.__webglTexture,V,He+mn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,En.__webglTexture,V),pn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,on.__webglTexture,ye,Nt+mn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,on.__webglTexture,ye),V!==0?N.blitFramebuffer(Ye,Ke,Re,Ie,lt,wt,Re,Ie,N.COLOR_BUFFER_BIT,N.NEAREST):pn?N.copyTexSubImage3D(Dt,ye,lt,wt,Nt+mn,Ye,Ke,Re,Ie):N.copyTexSubImage2D(Dt,ye,lt,wt,Ye,Ke,Re,Ie);Le.bindFramebuffer(N.READ_FRAMEBUFFER,null),Le.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else pn?C.isDataTexture||C.isData3DTexture?N.texSubImage3D(Dt,ye,lt,wt,Nt,Re,Ie,Pe,Ct,We,Ot.data):k.isCompressedArrayTexture?N.compressedTexSubImage3D(Dt,ye,lt,wt,Nt,Re,Ie,Pe,Ct,Ot.data):N.texSubImage3D(Dt,ye,lt,wt,Nt,Re,Ie,Pe,Ct,We,Ot):C.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ye,lt,wt,Re,Ie,Ct,We,Ot.data):C.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ye,lt,wt,Ot.width,Ot.height,Ct,Ot.data):N.texSubImage2D(N.TEXTURE_2D,ye,lt,wt,Re,Ie,Ct,We,Ot);N.pixelStorei(N.UNPACK_ROW_LENGTH,_t),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,_n),N.pixelStorei(N.UNPACK_SKIP_PIXELS,$i),N.pixelStorei(N.UNPACK_SKIP_ROWS,vn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ps),ye===0&&k.generateMipmaps&&N.generateMipmap(Dt),Le.unbindTexture()},this.initRenderTarget=function(C){Be.get(C).__webglFramebuffer===void 0&&qe.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?qe.setTextureCube(C,0):C.isData3DTexture?qe.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?qe.setTexture2DArray(C,0):qe.setTexture2D(C,0),Le.unbindTexture()},this.resetState=function(){P=0,b=0,M=null,Le.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=gt._getDrawingBufferColorSpace(e),t.unpackColorSpace=gt._getUnpackColorSpace()}}const Xr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Cs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const _g=new vc(-1,1,1,-1,0,1);class vg extends kt{constructor(){super(),this.setAttribute("position",new pt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new pt([0,2,0,0,2,0],2))}}const Mg=new vg;class Mc{constructor(e){this._mesh=new X(Mg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,_g)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Yh extends Cs{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof tn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=sr.clone(e.uniforms),this.material=new tn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Mc(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class kl extends Cs{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Sg extends Cs{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class yg{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Ee);this._width=n.width,this._height=n.height,t=new On(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:$n}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Yh(Xr),this.copyPass.material.blending=Zn,this.clock=new kh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}kl!==void 0&&(a instanceof kl?n=!0:a instanceof Sg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class bg extends Cs{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ze}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const wg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ze(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ws extends Cs{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Ee(e.x,e.y):new Ee(256,256),this.clearColor=new Ze(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new On(r,a,{type:$n}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new On(r,a,{type:$n});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new On(r,a,{type:$n});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=wg;this.highPassUniforms=sr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new tn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ee(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=sr.clone(Xr.uniforms),this.blendMaterial=new tn({uniforms:this.copyUniforms,vertexShader:Xr.vertexShader,fragmentShader:Xr.fragmentShader,blending:Oi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ze,this._oldClearAlpha=1,this._basic=new Et,this._fsQuad=new Mc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ee(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ws.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ws.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new tn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ee(.5,.5)},direction:{value:new Ee(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new tn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ws.BlurDirectionX=new Ee(1,0);ws.BlurDirectionY=new Ee(0,1);const Or={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Tg extends Cs{constructor(){super(),this.uniforms=sr.clone(Or.uniforms),this.material=new yf({name:Or.name,uniforms:this.uniforms,vertexShader:Or.vertexShader,fragmentShader:Or.fragmentShader}),this._fsQuad=new Mc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},gt.getTransfer(this._outputColorSpace)===yt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===sh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===rh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ah?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ko?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ch?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===lh?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===oh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Eg extends Eh{constructor(){super();const e=new Ue;e.deleteAttribute("uv");const t=new K({side:nn}),n=new K,s=new _c(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new X(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Qt(e,n,6),o=new zt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new X(e,ds(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new X(e,ds(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new X(e,ds(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new X(e,ds(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new X(e,ds(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const m=new X(e,ds(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function ds(i){return new bf({color:0,emissive:16777215,emissiveIntensity:i})}const hr=document.querySelector("#game"),fn=new gg({canvas:hr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});fn.setPixelRatio(Math.min(window.devicePixelRatio,2));fn.setSize(window.innerWidth,window.innerHeight);fn.shadowMap.enabled=!0;fn.shadowMap.type=ih;fn.outputColorSpace=Tt;fn.toneMapping=Ko;fn.toneMappingExposure=1.08;const Je=new Eh;Je.background=new Ze(5814015);Je.fog=new hc(9293045,165,1380);const qh=new Vo(fn);qh.compileEquirectangularShader();Je.environment=qh.fromScene(new Eg,.04).texture;Je.environmentIntensity=.62;const tt=new yn(69,window.innerWidth/window.innerHeight,.08,1800);Je.add(tt);const Xe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const ct=new Set,Ce={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},Ag=new kh,en=new D(0,1,0),Zh=new D,$h=new D,Sc=new D,Dn=new zt,Kh=.86,Ho=1.2,Cg=.78,ci=.55,Mi={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},Wi=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Jh=Math.max(...Wi.map(i=>i.width));let Yr=0,he=Wi[0];const x={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamPos:new D,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Xe.best.textContent=`Best score ${x.best}`;function Rg(i){const e=Oe.clamp(i,0,1);return e*e*(3-2*e)}function Pg(i,e){let t=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;e>=s&&e<=r?t+=n.rise*Oe.clamp((e-s)/(n.approach+n.carry),0,1):e>r&&e<=n.end?t+=n.rise:e>n.end&&e<=a&&(t+=n.rise*(1-Rg((e-n.end)/n.settle)))}return t}function yc(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function jh(i,e){const{t,n}=yc(i,e),s=i.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=Pg(i,n),r}function Br(i){const{x:e,z:t,n}=yc(he,i),s=jh(he,n);return new D(e,s,t)}function ft(i){const e=(i%he.length+he.length)%he.length,t=Br(e),s=Br(e+2).sub(t).normalize(),r=Zh.crossVectors(en,s).normalize(),a=Br(e-2).y,o=Br(e+2).y,c=Math.atan2(o-a,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,d=he.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Ti(i){const e=(i%he.length+he.length)%he.length;return he.gaps.some(t=>e>t.start&&e<t.end)}function Vl(i){return Oe.clamp(i/(he.length*he.laps),0,1)}function Lg(i,e,t){const n=Math.floor(i/he.length),s=Math.floor(e/he.length);for(let r=n;r<=s;r++){const a=r*he.length+t;if(i<a&&e>=a)return!0}return!1}function Dg(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new un(t);return r.colorSpace=Tt,r.wrapS=rn,r.wrapT=rn,r.repeat.set(3,1),r}function Ig(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new un(e);return s.colorSpace=Tt,s.wrapS=rn,s.wrapT=rn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Ug(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new un(e);return s.colorSpace=Tt,s.wrapS=rn,s.wrapT=rn,s.repeat.set(18,18),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Fg(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#111a1f"),n.addColorStop(.45,"#252c31"),n.addColorStop(1,"#070d11"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=42)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.7,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=t.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<5200;r++){const a=40+Math.floor(Math.random()*80);t.fillStyle=`rgba(${a}, ${a+4}, ${a+8}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1,1)}const s=new un(e);return s.colorSpace=Tt,s.wrapS=rn,s.wrapT=rn,s.repeat.set(22,28),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function fs(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new un(n);return r.colorSpace=Tt,r}function Ng(i=256,e=256,t="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,i,e*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,e*.24,i*.19,e*.2),a(i*.68,e*.25,i*.2,e*.2),a(i*.43,e*.5,i*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,e*.62,i*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new un(n);return o.colorSpace=Tt,o.wrapS=rn,o.wrapT=rn,o.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),o}function Og(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<i+20;r+=26){t.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<i;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new un(e);return s.colorSpace=Tt,s.wrapS=rn,s.wrapT=rn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Bg(i=256,e=160){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d"),s=n.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,e),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<e;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,e-8);const r=new un(t);return r.colorSpace=Tt,r}function Gl(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)"){const n=document.createElement("canvas");n.width=128,n.height=384;const s=n.getContext("2d");s.fillStyle=t,s.fillRect(0,0,128,384),s.strokeStyle=e,s.lineWidth=5,s.strokeRect(8,8,112,368),s.save(),s.translate(64,196),s.rotate(-Math.PI/2),s.font="900 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.shadowColor=e,s.shadowBlur=18,s.fillStyle=e,s.fillText(i,0,0),s.restore();const r=new un(n);return r.colorSpace=Tt,r}function zg(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=i/2,s=i/2,r=i*.43;t.clearRect(0,0,i,i),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,l=n+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(l,d):t.lineTo(l,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=i*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",n,s+i*.015);const a=new un(e);return a.colorSpace=Tt,a}function je(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function Wo(i,e,t,n){const s=t*.5,r=n*.5;let a=je(i,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,je(i+o,e+c));return a}function aa(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=Mi;if(i<n-c||i>s+c||e<a-c||e>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(l,d)<c*.5+t}const qr=[],Xa=[],Qh=[];let Hl=0;function Vn(i,e){return Qh.push({obj:i,update:e}),i}function ed(i){Hl+=i;for(const e of Qh)e.update(Hl,i)}function td(){if(Xa.length===0)for(let i=0;i<Wi.length;i++){const e=Wi[i];for(let t=0;t<e.length;t+=14){const n=yc(e,t);Xa.push({x:n.x,y:jh(e,t),z:n.z,s:t,courseIndex:i})}}return Xa}function Gn(i,e,t=0){let n=null,s=1/0;for(const r of td()){const a=i-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-t-Jh*.58,distance:s,nearestS:n?.s??0}}function Hs(i,e,t,n,s,r=9){const a=t*.5,o=n*.5,c=Jh*.62+r;let l=null;for(const d of td()){const u=Math.max(Math.abs(d.x-i)-a,0),f=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(u,f)-c;if(m>0)continue;const g=d.y-2.8,v=s-g;v<=0||(!l||v-m>l.score)&&(l={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:v,score:v-m})}return l}function In(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(Gn(r.x,r.z,e).clearance>=t)return r}return null}function Un(i,e,t,n,s){const r=Gn(e,t,n);qr.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function kg(){const i=[...qr].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:qr.length,unsafe:qr.filter(e=>e.clearance<e.margin),closest:i}}function hn(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new X(new ht(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(en,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function Vg(){const i=new Ef(10475519,1055524,.82);Je.add(i);const e=new pl(5941759,1.15);e.position.set(260,145,-260),Je.add(e);const t=new pl(16766364,1.55);t.position.set(-240,270,180),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Je.add(t);const n=new _c(5552383,58,820,2.1);n.position.set(0,88,-920),Je.add(n)}function Gg(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#03569f"),t.addColorStop(.34,"#1689e6"),t.addColorStop(.72,"#86d3ff"),t.addColorStop(1,"#fff1c4"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new un(i);n.colorSpace=Tt;const s=new X(new Ht(1550,40,20),new Et({map:n,side:nn,depthWrite:!1}));s.position.set(0,-70,-700),Je.add(s);const r=new Et({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new X(new dn(58,48),r);a.position.set(-430,300,-650),a.lookAt(tt.position),Je.add(a);const o=new Et({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new X(new dn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new D(0,0,2)),u.lookAt(tt.position),Je.add(u)}const c=new Et({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:ut});for(let l=0;l<3;l++){const d=new X(new Ut(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),Je.add(d)}}function Hg(){const i=new K({map:Ug(),color:10212492,roughness:.98,metalness:.02}),e=new X(new Ut(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let v=0;v<t.count;v++){const p=t.getX(v),h=t.getY(v);t.setZ(v,je(p,-h)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Je.add(e);const n=new K({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let v=0;v<3;v++){const p=new X(new Ut(980,64+v*18,1,1),n.clone());p.rotation.x=-Math.PI/2,p.rotation.z=-.34+v*.03,p.position.set(150-v*190,-5.4+v*.03,-760-v*420),Je.add(p)}const s=[new K({color:4352578,roughness:1}),new K({color:6910014,roughness:1}),new K({color:3562320,roughness:1})];for(let v=0;v<46;v++){const p=new X(new dn(28+Math.random()*90,9),s[v%s.length]);p.rotation.x=-Math.PI/2,p.rotation.z=Math.random()*Math.PI,p.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),p.scale.y=.32+Math.random()*.5,p.receiveShadow=!0,Je.add(p)}const r=new Et({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let v=0;v<32;v++){const p=new X(new dn(70+Math.random()*150,22),r.clone());p.material.opacity=.035+Math.random()*.055,p.rotation.x=-Math.PI/2,p.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),p.scale.y=.22+Math.random()*.26,Je.add(p)}const a=[new K({color:5991785,roughness:1}),new K({color:7633254,roughness:1}),new K({color:4874865,roughness:1})],o=new K({color:15068905,roughness:.95});for(let v=0;v<52;v++){const p=78+Math.random()*180,h=52+Math.random()*115,_=In(S=>{const E=v/52*Math.PI*2+S*1.77,w=1380+Math.random()*820+S*18;return{x:Math.cos(E)*w,z:Math.sin(E)*w-1180}},h,480);if(!_)continue;const y=new X(new Vi(h,p,5+Math.floor(Math.random()*2)),a[v%a.length]);if(y.position.set(_.x,-9,_.z),y.rotation.y=Math.random()*Math.PI,y.castShadow=!0,y.receiveShadow=!0,Je.add(y),Un("mountain",_.x,_.z,h,480),p>160){const S=new X(new Vi(h*.34,p*.22,5),o);S.position.copy(y.position).add(new D(0,p*.39,0)),S.rotation.y=y.rotation.y,Je.add(S)}}const c=new K({color:4926748,roughness:.9}),l=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:1589042,roughness:.9})];for(let v=0;v<185;v++){const p=.58+Math.random()*1.05,h=8*p,_=In(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),h,145,40);if(!_)continue;const{x:y,z:S}=_;if(aa(y,S,18))continue;const E=je(y,S)+.8,w=new at,R=2.2+Math.random()*3.8,P=new X(new ht(.28,.42,R,6),c);P.position.y=R/2,w.add(P);const b=2+Math.floor(Math.random()*3);for(let M=0;M<b;M++){const A=new X(new Vi(2.2+Math.random()*1.7-M*.22,4.8+Math.random()*2.6,7),l[(v+M)%l.length]);A.position.y=R+M*1.45+1.6,A.rotation.y=Math.random()*Math.PI,w.add(A)}w.position.set(y,E,S),w.scale.setScalar(p),Je.add(w),Un("tree",y,S,h,145)}const d=new K({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let v=0;v<38;v++){const p=new at,h=4+Math.floor(Math.random()*5);for(let _=0;_<h;_++){const y=new X(new Ht(12+Math.random()*18,14,8),d);y.position.set(_*18-h*9,Math.random()*8,Math.random()*12),y.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),p.add(y)}p.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),Je.add(p)}const u=[new K({color:6186600,roughness:.68,metalness:.2}),new K({color:7829101,roughness:.72,metalness:.18}),new K({color:4544612,roughness:.62,metalness:.24})],f=new K({color:2962232,roughness:.65,metalness:.35});for(let v=0;v<44;v++){const p=new at,h=20+Math.random()*95,_=8+Math.random()*18,y=8+Math.random()*18,S=new X(new Ue(_,h,y),u[v%u.length]);S.position.y=h/2,S.castShadow=!0,S.receiveShadow=!0,p.add(S);const E=fs(160,320,.28+Math.random()*.36),w=new K({map:E,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const M of[-1,1]){const A=new X(new Ut(_*.82,h*.74),w);A.position.set(0,h*.53,M*(y/2+.08)),A.rotation.y=M<0?Math.PI:0,p.add(A)}const R=new X(new Ue(_*1.08,1.2,y*1.08),f);if(R.position.y=h+.7,p.add(R),Math.random()<.32){const M=new X(new ht(.18,.3,10+Math.random()*12,8),f);M.position.y=h+6.5,p.add(M)}const P=Math.hypot(_,y)*.65,b=In(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),P,240,60);b&&(p.position.set(b.x,Wo(b.x,b.z,_,y)-.7,b.z),p.rotation.y=Math.random()*Math.PI,Je.add(p),Un("building",b.x,b.z,P,240))}const m=new K({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22}),g=new K({color:16766574,roughness:.32,metalness:.05,emissive:9061888,emissiveIntensity:.28});for(let v=0;v<12;v++){const p=new at,h=new X(new Ue(20+Math.random()*16,7+Math.random()*4,.5),g);h.position.y=10,p.add(h);for(const y of[-7,7]){const S=new X(new ht(.24,.32,10,8),m);S.position.set(y,5,-.2),p.add(S)}const _=In(()=>({x:-780+Math.random()*1560,z:-450-v*135+Math.random()*80-40}),22,175,50);_&&(p.position.set(_.x,je(_.x,_.z)+.5,_.z),p.rotation.y=-.35+Math.random()*.7,Je.add(p),Un("billboard",_.x,_.z,22,175))}}function Wg(){for(let h=0;h<3;h++){const _=[9418953,10995926,12770278][h],y=new Et({color:_,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),S=60,E=5200,w=new Ut(E,360,S,1),R=w.attributes.position;for(let b=0;b<=S;b++){const M=b/S,A=(Math.sin(M*22+h*3)*.5+Math.sin(M*9+h)*.5)*70+120;R.setY(b,A),R.setY(b+S+1,-180)}R.needsUpdate=!0;const P=new X(w,y);P.position.set(0,40,-2300-h*360),Je.add(P)}const i=new K({color:5583649,roughness:.9}),e=[new K({color:3837754,roughness:.9}),new K({color:7319100,roughness:.92}),new K({color:13075258,roughness:.9}),new K({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const _=.7+Math.random()*1.2,y=9*_,S=In(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),y,150,36);if(!S)continue;const{x:E,z:w}=S;if(aa(E,w,18))continue;const R=je(E,w)+.6,P=new at,b=2.6+Math.random()*3.4,M=new X(new ht(.34,.5,b,6),i);M.position.y=b/2,P.add(M);const A=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let B=0;B<I;B++){const q=2.4+Math.random()*1.8,Z=new X(new Ht(q,9,7),A);Z.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),Z.scale.y=.82+Math.random()*.3,P.add(Z)}P.position.set(E,R,w),P.scale.setScalar(_),Je.add(P),Un("tree",E,w,y,150)}const t=[new K({color:7762025,roughness:1,flatShading:!0,side:ut}),new K({color:9077368,roughness:1,flatShading:!0,side:ut}),new K({color:6249043,roughness:1,flatShading:!0,side:ut})];for(let h=0;h<70;h++){const _=2+Math.random()*7,y=In(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),_,70,30);if(!y)continue;const{x:S,z:E}=y,w=new X(new mc(_,0),t[h%t.length]),R=w.geometry.attributes.position;for(let P=0;P<R.count;P++)R.setXYZ(P,R.getX(P)*(.8+Math.random()*.4),R.getY(P)*(.6+Math.random()*.4),R.getZ(P)*(.8+Math.random()*.4));R.needsUpdate=!0,w.geometry.computeVertexNormals(),w.position.set(S,je(S,E)+_*.35,E),w.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),w.castShadow=!0,Je.add(w),Ks.push({kind:"rock",x:S,z:E,radius:_*1.12}),Un("rock",S,E,_,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const _=130+Math.random()*200,y=130+Math.random()*200,S=In(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(_,y)*.5,40,24);if(!S)continue;const{x:E,z:w}=S,R=new at,P=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let M=0;M<P;M++){const A=new K({color:M%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),I=new X(new Ut(_,y/P),A);I.rotation.x=-Math.PI/2,I.position.set(0,.05,-y/2+(M+.5)*(y/P)),R.add(I)}R.position.set(E,je(E,w)+.05,w),R.rotation.y=Math.random()*Math.PI,Je.add(R),Un("field",E,w,Math.max(_,y)*.5,40)}{const h=In(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const _=new K({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),y=new X(new dn(150,40),_);y.rotation.x=-Math.PI/2,y.position.set(h.x,-6.4,h.z),y.scale.set(1.5,1,1),Je.add(y),Un("lake",h.x,h.z,170,60),Vn(y,S=>{_.opacity=.84+Math.sin(S*.8)*.05,y.rotation.z=Math.sin(S*.2)*.02})}}const s=new K({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const _=h/9*Math.PI*2+.6,y=1500+Math.random()*700,S=Math.cos(_)*y,E=Math.sin(_)*y-1150,w=60+Math.random()*40,R=new at,P=new X(new ht(1.1,2.2,w,10),s);P.position.y=w/2,R.add(P);const b=new at;b.position.set(0,w,3);const M=new X(new Ue(3,3,7),s);b.add(M);const A=new at;A.position.z=3.5;for(let B=0;B<3;B++){const q=new X(new Ue(1.1,26,.5),s);q.position.y=13;const Z=new at;Z.add(q),Z.rotation.z=B/3*Math.PI*2,A.add(Z)}b.add(A),R.add(b),R.position.set(S,-8,E),R.rotation.y=Math.random()*Math.PI,Je.add(R);const I=.5+Math.random()*.5;Vn(A,B=>{A.rotation.z=B*I})}const r=new K({color:7041398,roughness:.6,metalness:.4}),a=new Oo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const _=-1100+h*360,y=-1650-Math.sin(h*.7)*120,S=48,E=new at,w=6;for(const P of[-1,1])for(const b of[-1,1]){const M=new X(new ht(.4,.7,S,5),r);M.position.set(P*w,S/2,b*w),M.rotation.z=-P*.08,M.rotation.x=b*.08,E.add(M)}for(const P of[S*.6,S*.82,S]){const b=new X(new Ue(w*4,.8,.8),r);b.position.y=P,E.add(b)}E.position.set(_,je(_,y)-2,y),Je.add(E);const R=je(_,y)-2+S;if(o)for(const P of[-w*2,0,w*2]){const b=o.x+P,M=o.z,A=_+P,I=y,B=[],q=12;for(let J=0;J<=q;J++){const oe=J/q,ie=Math.sin(oe*Math.PI)*6;B.push(new D(b+(A-b)*oe,o.y-ie+(R-o.y)*oe,M+(I-M)*oe))}const Z=new sl(new kt().setFromPoints(B),a);Je.add(Z)}o={x:_,y:R,z:y}}const c=new K({color:11680302,roughness:.6,metalness:.3}),l=new K({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const _=In(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!_)continue;const{x:y,z:S}=_,E=70+Math.random()*50,w=new at,R=8;for(let A=0;A<R;A++){const I=new X(new ht(.5,.7,E/R,4),A%2?l:c);I.position.y=(A+.5)*(E/R),I.rotation.y=Math.PI/4,w.add(I)}const P=new K({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new X(new Ht(1.1,10,8),P);b.position.y=E+1,w.add(b),w.position.set(y,je(y,S),S),Je.add(w),Un("mast",y,S,8,120);const M=Math.random()*Math.PI*2;Vn(b,A=>{P.emissiveIntensity=Math.sin(A*2.4+M)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const _=new at,y=d[h%d.length],S=new K({map:jg(y[0],y[1]),roughness:.5,metalness:.05,emissive:new Ze(y[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new X(new Ht(11,20,16),S);E.scale.y=1.25,_.add(E);const w=new X(new Ue(3.4,3,3.4),new K({color:8014371,roughness:.9}));w.position.y=-17,_.add(w);const R=new Oo({color:3811866});for(const I of[-1,1])for(const B of[-1,1]){const q=new sl(new kt().setFromPoints([new D(I*1.6,-15.5,B*1.6),new D(I*7,-3,B*7)]),R);_.add(q)}const P=-700+Math.random()*1400,b=-700-Math.random()*1200,M=280+Math.random()*100;_.position.set(P,M,b),Je.add(_);const A=Math.random()*Math.PI*2;Vn(_,I=>{_.position.y=M+Math.sin(I*.5+A)*6,_.position.x=P+Math.sin(I*.08+A)*90,_.rotation.z=Math.sin(I*.4+A)*.04})}const u=new Et({color:2829104,side:ut,fog:!1});function f(){const h=new Uh;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new X(new xc(h),u)}for(let h=0;h<5;h++){const _=new at,y=5+Math.floor(Math.random()*5),S=[];for(let A=0;A<y;A++){const I=f(),B=A%2?1:-1,q=Math.ceil(A/2);I.position.set(B*q*5,-q*2.4,0),I.rotation.x=-Math.PI/2,_.add(I),S.push(I)}const E=150+Math.random()*120,w=-500-Math.random()*1400,R=18+Math.random()*14,P=1400,b=-700+Math.random()*1400;_.position.set(b,E,w),Je.add(_);const M=Math.random()*Math.PI*2;Vn(_,(A,I)=>{_.position.x+=R*I,_.position.x>P&&(_.position.x=-P);const B=Math.sin(A*6+M);for(const q of S)q.rotation.x=-Math.PI/2+B*.4})}{const h=new at,_=new K({color:14673644,roughness:.4,metalness:.2}),y=new X(new Ht(20,20,16),_);y.scale.set(2.6,1,1),h.add(y);const S=new K({color:13781835,roughness:.6});for(let b=0;b<3;b++){const M=new X(new Ue(10,9,.6),S);M.position.x=-46,M.rotation.x=b/3*Math.PI*2,h.add(M)}const E=new X(new Ue(10,4,4),new K({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const w=new X(new Ut(40,10),new Et({map:bc("STEEL RIBBON"),transparent:!0,side:ut}));w.position.set(60,0,0),h.add(w);const R=900,P=240;h.position.set(0,P,-1200),Je.add(h),Vn(h,b=>{const M=b*.05;h.position.x=Math.cos(M)*R,h.position.z=-1200+Math.sin(M)*R*.5,h.position.y=P+Math.sin(b*.3)*8,h.rotation.y=-M+Math.PI/2})}const m=new Et({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const _=new X(new Ut(220+Math.random()*360,16+Math.random()*22),m.clone());_.material.opacity=.12+Math.random()*.18,_.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),_.rotation.x=-Math.PI/2.1,_.rotation.z=Math.random()*Math.PI,_.scale.y=.3,Je.add(_);const y=2+Math.random()*3;Vn(_,(S,E)=>{_.position.x+=y*E,_.position.x>1400&&(_.position.x=-1400)})}const g=new K({color:13620954,roughness:.6,metalness:.2}),v=new Et({map:Qg(),side:ut});for(let h=0;h<4;h++){const _=In(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!_)continue;const{x:y,z:S}=_,E=new at,w=60+Math.random()*40,R=new X(new Ue(w,1.4,26),g);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const P=new X(new Ut(w*.94,24),v);P.position.set(0,12,6),P.rotation.x=-.85,E.add(P);for(const b of[-w/2,w/2]){const M=new X(new Ue(1.4,26,1.4),g);M.position.set(b,13,-8),E.add(M)}E.position.set(y,je(y,S),S),E.rotation.y=Math.atan2(-y,-S)+(Math.random()-.5)*.5,Je.add(E),Un("grandstand",y,S,40,30)}const p=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const _=In(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!_)continue;const{x:y,z:S}=_,E=new at,w=p[Math.floor(Math.random()*p.length)],R=new Et({color:w,side:ut}),P=5+Math.floor(Math.random()*6);for(let b=0;b<P;b++){const M=new X(new dn(.5+Math.random()*.4,5),R);M.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),M.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,M.rotation.z=Math.random()*Math.PI,E.add(M)}E.position.set(y,je(y,S),S),Je.add(E),Un("flowers",y,S,3,20)}}const Wn=[],Xn=[];let Xo=0;const Ks=[],oa=[],bi=[],Yo=[],lr=[],xs=[],St={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0};function Xg(i,e){const t=new at,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new K({color:e,roughness:.34,metalness:.28}),a=new K({color:new Ze(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new K({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new K({color:395016,roughness:.72,metalness:.02}),l=new K({color:14147041,roughness:.2,metalness:.68}),d=new K({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),u=new K({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),f=new X(new Ue(s.w,s.h,s.l),i==="taxi"?new K({color:16767293,roughness:.36,metalness:.24}):r);f.position.y=.95,t.add(f);const m=new X(new Ue(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),t.add(m),!s.bus){const p=new X(new Ue(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);p.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(p);for(const h of[-1,1]){const _=new X(new Ue(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);_.position.set(h*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(_)}}if(s.bed){const p=new X(new Ue(s.w*.94,.58,s.l*.38),a);p.position.set(0,1.2,1.35),t.add(p)}if(s.box){const p=new X(new Ue(s.box[0],s.box[1],s.box[2]),new K({color:15130833,roughness:.62,metalness:.05}));p.position.set(0,1.55,1.25),t.add(p)}if(s.bus){const p=new X(new Ue(s.w+.06,.28,s.l*.86),a);p.position.set(0,1.38,0),t.add(p);for(let h=-2.8;h<=3.1;h+=1.2)for(const _ of[-1,1]){const y=new X(new Ue(.08,.64,.72),o);y.position.set(_*(s.w*.5+.05),2.08,h),t.add(y)}}if(s.sign){const p=new X(new Ue(1,.24,.46),new K({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));p.position.set(0,2.2,-.35),t.add(p)}const g=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],v=[];for(const p of g)for(const h of[-s.w*.54,s.w*.54]){const _=new X(new ht(.42,.42,.36,14),c);_.rotation.z=Math.PI/2,_.position.set(h,.45,p),t.add(_),v.push(_);const y=new X(new ht(.18,.18,.38,10),l);y.rotation.z=Math.PI/2,y.position.set(h,.45,p),t.add(y)}for(const p of[-s.w*.28,s.w*.28]){const h=new X(new Ue(.42,.2,.08),d);h.position.set(p,.95,-s.l*.52),t.add(h);const _=new X(new Ue(.36,.22,.08),u);_.position.set(p,.98,s.l*.52),t.add(_)}return t.userData={wheels:v,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(p=>{p.castShadow=!0,p.receiveShadow=!0}),t}function Yg(i,e){const t=new at,n=new K({color:12947299,roughness:.72}),s=new K({color:i,roughness:.68}),r=new K({color:e,roughness:.76}),a=new K({color:1119001,roughness:.82}),o=new X(new ht(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const c=new X(new Ht(.24,10,8),n);c.position.y=2.02,t.add(c);const l=new X(new Ht(.25,8,5),a);l.scale.y=.5,l.position.y=2.17,t.add(l);const d=[];for(const u of[-.16,.16]){const f=new X(new ht(.075,.09,.78,6),r);f.position.set(u,.58,0),t.add(f),d.push({mesh:f,side:Math.sign(u),baseY:.58,amp:.28})}for(const u of[-.38,.38]){const f=new X(new ht(.055,.065,.72,6),n);f.position.set(u,1.33,0),f.rotation.z=u<0?-.18:.18,t.add(f),d.push({mesh:f,side:-Math.sign(u),baseY:1.33,amp:.34})}return t.userData.limbs=d,t.traverse(u=>{u.castShadow=!0,u.receiveShadow=!0}),t}function qg(i,e,t){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:l=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],f=[],m=30,g=[],v=[];for(let F=n;F<=s+1;F+=o)g.push(Math.round(F));for(let F=r;F>=a-1;F-=o)v.push(Math.round(F));v.sort((F,Se)=>F-Se);const p=g[0],h=g[g.length-1],_=v[0],y=v[v.length-1];bi.length=0,Yo.length=0,lr.length=0,xs.length=0,St.traffic=0,St.pedestrians=0,St.types={},St.turns=0,St.splats=0,St.trafficCrashes=0,St.streetLights=0,St.trafficLights=0,St.stopSigns=0;const S=F=>F[Math.random()*F.length|0],E=F=>(F>0?-1:1)*c*.23,w=(F,Se)=>{let xe=0,_e=1/0;for(let G=0;G<F.length;G++){const Y=Math.abs(F[G]-Se);Y<_e&&(_e=Y,xe=G)}return xe},R=(F,Se,xe)=>{const _e=F==="ns"?v:g;if(xe>0){for(const G of _e)if(G>Se+.05)return G;return _e[_e.length-1]}for(let G=_e.length-1;G>=0;G--)if(_e[G]<Se-.05)return _e[G];return _e[0]},P=F=>{const Se=F.laneOffset+(F.avoidOffset||0);return F.axis==="ns"?{x:F.road+Se,z:F.along}:{x:F.along,z:F.road+Se}},b=F=>{if(x.mode!=="roam")return null;const Se=P(F);if(Math.abs(x.roamPos.y-(je(Se.x,Se.z)+ci))>4.2)return null;const xe=F.axis==="ns"?0:F.dir,_e=F.axis==="ns"?F.dir:0,G=x.roamPos.x-Se.x,Y=x.roamPos.z-Se.z,pe=G*xe+Y*_e,be=F.axis==="ns"?G:Y,Te=Math.abs(be),ke=Math.hypot(G,Y),bt=F.mesh?.userData?.colliderHalfW||2,Ge=F.mesh?.userData?.colliderHalfD||3;return ke<zn+Math.max(bt,Ge)*.55||pe>-1.5&&pe<Ge+4.2&&Te<zn+bt*.85?{crash:!0}:pe>0&&pe<30&&Te<c*.36?{avoidOffset:(be>=0?-1:1)*F.maxAvoidOffset,stop:pe<13&&Te<zn+bt*.95}:null},M=(F,Se)=>`${Math.round(F)},${Math.round(Se)}`,A=(F,Se)=>{const _e=((Se+F.phase)%15.5+15.5)%15.5;return _e<6.2?"ns":_e<7.4?"yellow-ns":_e<13.6?"ew":"yellow-ew"},I=(F,Se)=>{const xe=F.axis==="ns"?F.road:F.next,_e=F.axis==="ns"?F.next:F.road,G=M(xe,_e),Y=l.get(G);if(!Y)return null;if(Y.type==="signal"){const pe=A(Y,Se),be=pe===`yellow-${F.axis}`;return pe===F.axis&&!be?null:{control:Y,key:G,kind:"signal"}}return Y.type==="stop"&&F.lastControlKey!==G?{control:Y,key:G,kind:"stop"}:null},B=(F,Se=!1)=>{const xe=F.axis,_e=F.along,G=xe==="ns"?g:v,Y=F.road,pe=w(G,Y),be=[],Te=xe==="ns"?_:p,ke=xe==="ns"?y:h;!Se&&_e+F.dir*o>=Te&&_e+F.dir*o<=ke&&be.push({axis:xe,road:F.road,along:_e,dir:F.dir,turn:!1}),pe>0&&be.push({axis:xe==="ns"?"ew":"ns",road:_e,along:Y,dir:-1,turn:!0}),pe<G.length-1&&be.push({axis:xe==="ns"?"ew":"ns",road:_e,along:Y,dir:1,turn:!0}),be.length||be.push({axis:xe,road:F.road,along:_e,dir:-F.dir,turn:!0});const bt=be.filter(mt=>mt.turn),Ge=!Se&&bt.length&&Math.random()<.42?S(bt):S(be);(Ge.turn||Ge.axis!==xe)&&St.turns++,F.axis=Ge.axis,F.road=Ge.road,F.along=Ge.along,F.dir=Ge.dir,F.laneOffset=E(F.dir),F.next=R(F.axis,F.along,F.dir),F.turnBlend=Ge.turn?1:0,F.lastControlKey=null};for(let F=0;F<m;F++){const Se=Math.random()<.56?"ns":"ew",xe=u[F%u.length],_e=Math.random()<.5?-1:1,G=(xe==="bus"||xe==="boxTruck"?10:13)+Math.random()*9,Y={axis:Se,dir:_e,road:S(Se==="ns"?g:v),laneOffset:E(_e),along:S(Se==="ns"?v:g),speed:G,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Xg(xe,d[F*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};Y.collider.actor=Y,F<8&&(Y.axis="ns",Y.dir=-1,Y.laneOffset=E(Y.dir),Y.road=[80,210,-50,80][F%4],Y.along=370-F*54,Y.speed+=3),Y.next=R(Y.axis,Y.along,Y.dir),bi.push(Y.collider),f.push(Y),Yo.push(Y),i.add(Y.mesh),St.types[xe]=(St.types[xe]||0)+1}function q(F,Se=0,xe=0){let _e=Math.max(0,F.speed*xe);const G=b(F);for(G?.crash?(od(F,x.roamPos),_e=0):G?(F.avoidOffset+=(G.avoidOffset-F.avoidOffset)*Math.min(1,xe*4.5),F.brakePulse=Math.max(F.brakePulse||0,G.stop?1:.35),G.stop&&(F.waitTimer=Math.max(F.waitTimer,.22),_e=0)):F.avoidOffset+=(0-F.avoidOffset)*Math.min(1,xe*1.8),F.crashTimer>0&&(F.crashTimer=Math.max(0,F.crashTimer-xe),_e=0),F.waitTimer>0&&(F.waitTimer=Math.max(0,F.waitTimer-xe),_e=0);_e>0;){const N=I(F,Se);if(N){const et=F.next-F.dir*(N.kind==="signal"?12:8),xt=(et-F.along)*F.dir;if(xt>=-.35&&xt<=_e+.25){F.along=et,F.brakePulse=1,_e=0,N.kind==="stop"&&(F.waitTimer=.65+Math.random()*.4,F.lastControlKey=N.key);break}}const nt=Math.abs(F.next-F.along);if(_e<nt)F.along+=F.dir*_e,_e=0;else{F.along=F.next,_e-=nt;const et=F.next<=(F.axis==="ns"?_:p)+.05||F.next>=(F.axis==="ns"?y:h)-.05;B(F,et)}}F.brakePulse=Math.max(0,(F.brakePulse||0)-xe*3.2),F.turnBlend=Math.max(0,F.turnBlend-xe*3.2);const{x:Y,z:pe}=P(F),be=F.axis==="ns"?0:F.dir,Te=F.axis==="ns"?F.dir:0;F.mesh.position.set(Y,je(Y,pe)+.28+Math.sin(Se*3.2+F.bob)*.035,pe);const ke=Math.atan2(-be,-Te),bt=Math.atan2(Math.sin(ke-F.mesh.rotation.y),Math.cos(ke-F.mesh.rotation.y));F.mesh.rotation.y+=bt*Math.min(1,xe*7+F.turnBlend*.55),F.crashTimer>0&&(F.mesh.rotation.y+=Math.sin(Se*22+F.bob)*.02);for(const N of F.mesh.userData.wheels||[])N.rotation.x-=F.dir*F.speed*xe*1.7;const Ge=F.mesh.userData.colliderHalfD,mt=F.mesh.userData.colliderHalfW;F.collider.x=Y,F.collider.z=pe,F.collider.hw=F.axis==="ns"?mt:Ge,F.collider.hd=F.axis==="ns"?Ge:mt,F.collider.maxY=F.mesh.position.y+3.2}for(const F of f)q(F,0,0);St.traffic=f.length,Vn(i,(F,Se)=>{for(const xe of f)q(xe,F,Se)});const Z=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],J=[2437188,3092787,4930093,2244434],oe=[],ie=45;for(let F=0;F<ie;F++){const Se=Math.random()<.56?"ns":"ew",xe=e[Math.random()*e.length|0],_e=Math.abs(xe.z1-xe.z0)>Math.abs(xe.x1-xe.x0),G=Se==="ns"?_e?"ns":"ew":_e?"ew":"ns",Y=Math.random()<.5?-1:1,pe=Math.random()<.5?-1:1,be={axis:G,dir:Y,sideSign:pe,coord:S(G==="ns"?g:v),along:G==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Yg(Z[F%Z.length],J[F*2%J.length])};F<14&&(be.axis="ns",be.coord=80,be.sideSign=F%2?-1:1,be.dir=F%3===0?1:-1,be.along=350-F*24,be.speed=1.5+F%4*.35),oe.push(be),lr.push(be),i.add(be.mesh)}const me=new Et({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:ut}),Me=new Et({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:ut});for(let F=0;F<18;F++){const Se=new at,xe=new X(new dn(1,12),me.clone());xe.rotation.x=-Math.PI/2,Se.add(xe);for(let _e=0;_e<7;_e++){const G=new X(new dn(.25+Math.random()*.25,8),Me.clone());G.rotation.x=-Math.PI/2,G.position.set(Math.cos(_e)*(.6+Math.random()*1.2),.01,Math.sin(_e*1.7)*(.5+Math.random()*1.1)),Se.add(G)}Se.visible=!1,Se.userData.life=0,Se.userData.maxLife=2.8,Se.position.y=-99,i.add(Se),xs.push(Se)}function De(F,Se=0,xe=0){if(!F.active)if(F.respawn-=xe,F.respawn<=0)F.active=!0,F.mesh.visible=!0,F.along+=F.dir*50;else return;F.along+=F.dir*F.speed*xe,F.axis==="ns"?(F.along<a-28&&(F.along=r+28),F.along>r+28&&(F.along=a-28)):(F.along<n-28&&(F.along=s+28),F.along>s+28&&(F.along=n-28));const _e=F.sideSign*(c*.66+1.2),G=F.axis==="ns"?F.coord+_e:F.along,Y=F.axis==="ns"?F.along:F.coord+_e,pe=F.axis==="ns"?0:F.dir,be=F.axis==="ns"?F.dir:0;F.x=G,F.z=Y,F.mesh.position.set(G,je(G,Y)+.08,Y),F.mesh.rotation.y=Math.atan2(-pe,-be);const Te=Math.sin(Se*7+F.phase);for(const ke of F.mesh.userData.limbs||[])ke.mesh.rotation.x=Te*ke.amp*ke.side,ke.mesh.position.y=ke.baseY+Math.abs(Te)*.025}for(const F of oe)De(F,0,0);St.pedestrians=oe.length,Vn(i,(F,Se)=>{for(const xe of oe)De(xe,F,Se);for(const xe of xs){if(!xe.visible)continue;xe.userData.life-=Se;const _e=xe.userData.life,G=Oe.clamp(_e/xe.userData.maxLife,0,1);xe.scale.setScalar(1+(1-G)*.35),xe.traverse(Y=>{Y.material&&(Y.material.opacity=Math.min(.78,G*1.2))}),_e<=0&&(xe.visible=!1)}})}function Zg(){const i=new at,e=new zt;new hi().setFromAxisAngle(new D(1,0,0),-Math.PI/2);const t=Mi.x0,n=Mi.x1,s=Mi.zNear,r=Mi.zFar,a=Mi.pitch,o=Mi.streetW,c=a-o,l=[],d=[];for(let O=t;O<=n+1;O+=a)l.push(Math.round(O));for(let O=s;O>=r-1;O-=a)d.push(Math.round(O));const u=[];for(const O of l)u.push({x0:O,z0:s,x1:O,z1:r});for(const O of d)u.push({x0:t,z0:O,x1:n,z1:O});function f(O,z,H){const $=[],se=[];for(const re of O){const ce=re.x1-re.x0,ae=re.z1-re.z0,te=Math.hypot(ce,ae),j=Math.max(1,Math.round(te/14)),ve=ce/te,de=-(ae/te),Ne=ve;let $e=null,dt=null;for(let vt=0;vt<=j;vt++){const rt=vt/j,Vt=rt*te/68,Lt=re.x0+ce*rt,Yt=re.z0+ae*rt,$t=Lt+de*z,Kt=Yt+Ne*z,Zt=Lt-de*z,xn=Yt-Ne*z,Tn=[$t,je($t,Kt)+H,Kt,Vt],an=[Zt,je(Zt,xn)+H,xn,Vt];$e&&($.push($e[0],$e[1],$e[2],dt[0],dt[1],dt[2],an[0],an[1],an[2]),$.push($e[0],$e[1],$e[2],an[0],an[1],an[2],Tn[0],Tn[1],Tn[2]),se.push(0,$e[3],1,dt[3],1,an[3]),se.push(0,$e[3],1,an[3],0,Tn[3])),$e=Tn,dt=an}}const L=new kt;return L.setAttribute("position",new pt($,3)),L.setAttribute("uv",new pt(se,2)),L.computeVertexNormals(),L}const m=new K({map:Fg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:ut}),g=new X(f(u,o/2,.55),m);g.receiveShadow=!0,i.add(g);const v=new K({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:ut});i.add(new X(f(u,.4,.62),v));const p=new Et({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:ut,blending:Oi}),h=new Et({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:ut,blending:Oi});for(let O=0;O<120;O++){const z=u[Math.random()*u.length|0],H=Math.random(),$=z.x0+(z.x1-z.x0)*H,se=z.z0+(z.z1-z.z0)*H;if(Gn($,se,4).clearance<2)continue;const L=new X(new dn(1,18),(O%4===0?h:p).clone());L.rotation.x=-Math.PI/2,L.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,L.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),L.position.set($+(Math.random()-.5)*o*.7,je($,se)+.66,se+(Math.random()-.5)*o*.7),i.add(L)}const _=[fs(160,320,.5),fs(160,320,.62),fs(160,320,.42)],y=[new K({map:_[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new K({map:_[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new K({map:_[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],S=new Ue(1,1,1),E=[[],[],[]],w=[],R=[],P=[],b=[],M=[],A=[],I=[],B=[],q=[],Z=[],J=[],oe=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],ie=Ng(256,256,"#dbcdb8"),me=Og(),Me=Bg();function De(O,z,H,$,se){const L=Wo(O,z,H,$)-1.1;if(Hs(O,z,H,$,L+se+2))return!1;if(e.position.set(O,L+se/2,z),e.quaternion.identity(),e.scale.set(H,se,$),e.updateMatrix(),E[Math.random()*3|0].push(e.matrix.clone()),e.position.set(O,L+se+.6,z),e.scale.set(H*1.04,1.2,$*1.04),e.updateMatrix(),w.push(e.matrix.clone()),se>26){const re=Math.random()<.72?3790847:16730294;for(const ce of[-1,1])e.position.set(O,L+se+1.35,z+ce*($*.52+.12)),e.scale.set(H*1.12,.22,.18),e.updateMatrix(),R.push(e.matrix.clone()),P.push(re);Math.random()<.34&&b.push({px:O,pz:z,w:H,d:$,h:se,gy:L,zSide:Math.random()<.5?-1:1})}return Wn.push({x:O,z,hw:H*.5,hd:$*.5,maxY:L+se+2}),!0}function F(O,z,H,$,se){const L=Wo(O,z,H,$)-.55,re=2+Math.random()*2.4;if(Hs(O,z,H,$,L+se+re+1.5,6))return!1;e.position.set(O,L+se/2,z),e.quaternion.identity(),e.scale.set(H,se,$),e.updateMatrix(),M.push(e.matrix.clone()),Wn.push({x:O,z,hw:H*.5,hd:$*.5,maxY:L+se+re+1.5}),A.push(oe[Math.random()*oe.length|0]),e.position.set(O,L+se+re/2,z),e.scale.set(H*.82,re,$*.82),e.updateMatrix(),I.push(e.matrix.clone());const ce=t+Math.round((O-t)/a)*a,ae=s-Math.round((s-z)/a)*a,te=Math.abs(O-ce)<Math.abs(z-ae),j=te?ce>O?1:-1:ae>z?1:-1,ve=Math.min(te?$*.46:H*.46,8.5),ge=Math.min(se*.58,4.6),de=Math.min(24,Math.max(8,te?Math.abs(ce-O)-H*.5-o*.35:Math.abs(ae-z)-$*.5-o*.35));e.quaternion.identity(),te?(e.position.set(O+j*(H*.5+.1),L+ge*.5+.1,z-$*.16),e.scale.set(.24,ge,ve),e.updateMatrix(),B.push(e.matrix.clone()),e.position.set(O+j*(H*.5+de*.5),je(O+j*(H*.5+de*.5),z)+.08,z-$*.16),e.scale.set(de,.08,ve*1.18)):(e.position.set(O-H*.16,L+ge*.5+.1,z+j*($*.5+.1)),e.scale.set(ve,ge,.24),e.updateMatrix(),B.push(e.matrix.clone()),e.position.set(O-H*.16,je(O,z+j*($*.5+de*.5))+.08,z+j*($*.5+de*.5)),e.scale.set(ve*1.18,.08,de)),e.updateMatrix(),q.push(e.matrix.clone()),e.position.set(O,L+.02,z),e.scale.set(H*1.58,.05,$*1.58),e.updateMatrix(),Z.push(e.matrix.clone());for(let Ne=0;Ne<3;Ne++){const $e=te?O+j*(H*.55):O+(Ne-1)*H*.25,dt=te?z+(Ne-1)*$*.28:z+j*($*.55);e.position.set($e,je($e,dt)+.55,dt);const vt=.85+Math.random()*.75;e.scale.set(vt*1.35,vt,vt*1.35),e.updateMatrix(),J.push(e.matrix.clone())}return!0}for(let O=t+a/2;O<=n-a/2;O+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const H=Gn(O,z,c*.5).clearance;if(H<2)continue;const $=z>40&&z<380&&O>-360&&O<360;if(H<90||$){const L=c/3;for(let re=0;re<3;re++)for(let ce=0;ce<3;ce++){if(Math.random()<.14)continue;const ae=O-c/2+L*(re+.5)+(Math.random()-.5)*L*.3,te=z-c/2+L*(ce+.5)+(Math.random()-.5)*L*.3;if(Gn(ae,te,8).clearance<1)continue;const j=L*(.5+Math.random()*.22),ve=L*(.5+Math.random()*.22);!$&&Math.random()<.16?De(ae,te,j*.9,ve*.9,12+Math.random()*12):F(ae,te,j,ve,5+Math.random()*4.5)}}else{const se=H>230,L=se?Oe.clamp(50+H*1.1,60,175):Oe.clamp(22+H*.3,22,62),re=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let ce=0;ce<re;ce++){const ae=13+Math.random()*Math.min(26,c*.44),te=13+Math.random()*Math.min(26,c*.44),j=O+(Math.random()-.5)*(c-ae),ve=z+(Math.random()-.5)*(c-te);if(Gn(j,ve,Math.hypot(ae,te)*.5).clearance<2)continue;const ge=(18+Math.random()*(L-18))*(se&&Math.random()<.2?1.35:1);De(j,ve,ae,te,ge)}}}for(let O=0;O<3;O++){if(!E[O].length)continue;const z=new Qt(S,y[O],E[O].length);for(let H=0;H<E[O].length;H++)z.setMatrixAt(H,E[O][H]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,i.add(z)}if(w.length){const O=new K({color:2896696,roughness:.62,metalness:.34}),z=new Qt(S,O,w.length);for(let H=0;H<w.length;H++)z.setMatrixAt(H,w[H]);z.instanceMatrix.needsUpdate=!0,i.add(z)}if(R.length){const O=new K({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new Qt(S,O,R.length);for(let H=0;H<R.length;H++)z.setMatrixAt(H,R[H]),z.setColorAt(H,new Ze(P[H]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),i.add(z)}if(M.length){const O=new K({color:4891451,roughness:.88,metalness:.02}),z=new Qt(S,O,Z.length);for(let de=0;de<Z.length;de++)z.setMatrixAt(de,Z[de]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,i.add(z);const H=new K({color:12040883,roughness:.48,metalness:.05}),$=new Qt(S,H,q.length);for(let de=0;de<q.length;de++)$.setMatrixAt(de,q[de]);$.instanceMatrix.needsUpdate=!0,$.receiveShadow=!0,i.add($);const se=new K({map:ie,roughness:.78,metalness:.03}),L=new Qt(S,se,M.length);for(let de=0;de<M.length;de++)L.setMatrixAt(de,M[de]),L.setColorAt(de,new Ze(A[de]));L.instanceMatrix.needsUpdate=!0,L.instanceColor&&(L.instanceColor.needsUpdate=!0),L.castShadow=!0,L.receiveShadow=!0,i.add(L);const re=new Vi(.72,1,4);re.rotateY(Math.PI/4);const ce=new K({map:me,color:14314033,roughness:.72}),ae=new Qt(re,ce,I.length);for(let de=0;de<I.length;de++)ae.setMatrixAt(de,I[de]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,i.add(ae);const te=new K({map:Me,roughness:.38,metalness:.18}),j=new Qt(S,te,B.length);for(let de=0;de<B.length;de++)j.setMatrixAt(de,B[de]);j.instanceMatrix.needsUpdate=!0,i.add(j);const ve=new K({color:3112239,roughness:.88,metalness:.02}),ge=new Qt(new Ht(1,8,6),ve,J.length);for(let de=0;de<J.length;de++)ge.setMatrixAt(de,J[de]);ge.instanceMatrix.needsUpdate=!0,ge.castShadow=!0,ge.receiveShadow=!0,i.add(ge)}const Se=["HOTEL","OPEN","AUTO","RACE","CAFE"];for(let O=0;O<Math.min(b.length,18);O++){const z=b[O],H=Se[O%Se.length],$=O%3===0?"#ff4fb7":O%3===1?"#4ff3ff":"#ffd45b",se=new Et({map:Gl(H,$),transparent:!0,side:ut,depthWrite:!1}),L=new X(new Ut(8,24),se);L.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),L.rotation.y=z.zSide<0?Math.PI:0,i.add(L)}const xe=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],_e=new Ue(2.2,1.4,4.6),G=130,Y=new Qt(_e,new K({roughness:.42,metalness:.36}),G);let pe=0,be=0;for(;pe<G&&be<G*6;){be++;const O=Math.random()<.5,z=O?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),H=O?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Gn(z,H,4).clearance<2)continue;const $=je(z,H)+.7;e.position.set(z,$,H),e.quaternion.setFromAxisAngle(en,O?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Y.setMatrixAt(pe,e.matrix),Y.setColorAt(pe,new Ze(xe[Math.random()*xe.length|0])),pe++}Y.count=pe,Y.instanceMatrix.needsUpdate=!0,Y.instanceColor&&(Y.instanceColor.needsUpdate=!0),i.add(Y);const Te=new Map,ke=(O,z)=>`${Math.round(O)},${Math.round(z)}`;function bt(O,z){const $=((z+O.phase)%15.5+15.5)%15.5;return $<6.2?{green:"ns",yellow:null}:$<7.4?{green:null,yellow:"ns"}:$<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Ge(){const O=[],z=new K({color:1120028,roughness:.38,metalness:.62}),H=new K({color:1382685,roughness:.34,metalness:.38}),$=zg(),se=new Et({map:$,transparent:!0,side:ut}),L=new K({color:5050642,roughness:.48,metalness:.12}),re=(ge,de)=>new K({color:ge,roughness:.16,metalness:.02,emissive:de,emissiveIntensity:.2}),ce=(ge,de,Ne,$e,dt,vt)=>{const rt=new at,Vt=new X(new Ue(1.15,2.85,.75),H);rt.add(Vt);const Lt=re(16724008,16717836),Yt=re(16767053,16757276),$t=re(4521842,1693789),Kt=[Lt,Yt,$t];for(let Zt=0;Zt<3;Zt++){const xn=new X(new Ht(.28,12,8),Kt[Zt]);xn.position.set(0,.78-Zt*.78,-.42),rt.add(xn)}rt.position.set(Ne,$e,dt),rt.rotation.y=vt,ge.add(rt),O.push({axis:de,red:Lt,yellow:Yt,green:$t,control:ge.userData.control})},ae=(ge,de,Ne)=>{const $e=ke(ge,de),dt={type:"signal",x:ge,z:de,phase:Ne%4*2.1};Te.set($e,dt);const vt=je(ge,de),rt=new at;rt.userData.control=dt;const Vt=o*.72,Lt=o*.72,Yt=new X(new ht(.18,.24,8.2,8),z);Yt.position.set(Vt,4.1,Lt),rt.add(Yt);const $t=new X(new Ue(o*1.65,.2,.2),z);$t.position.set(Vt-o*.72,8,Lt),rt.add($t);const Kt=new X(new Ue(.2,.2,o*1.65),z);Kt.position.set(Vt,7.55,Lt-o*.72),rt.add(Kt),ce(rt,"ns",Vt-o*1.24,7.52,Lt,0),ce(rt,"ns",Vt-o*.18,7.52,-Lt,Math.PI),ce(rt,"ew",Vt,7.05,Lt-o*1.24,Math.PI/2),ce(rt,"ew",-Vt,7.05,Lt-o*.18,-Math.PI/2),rt.position.set(ge,vt,de),rt.traverse(Zt=>{Zt.castShadow=!0,Zt.receiveShadow=!0}),i.add(rt)},te=(ge,de,Ne)=>{const $e=ke(ge,de);Te.set($e,{type:"stop",x:ge,z:de,phase:0});const dt=je(ge,de),vt=new at,rt=Ne%2?-1:1,Vt=Ne%3?1:-1,Lt=new X(new ht(.12,.16,4.2,7),z);Lt.position.y=2.1,vt.add(Lt);const Yt=new X(new dn(1.04,8),L);Yt.position.y=4.55,Yt.rotation.y=Math.PI,vt.add(Yt);const $t=new X(new Ut(2.05,2.05),se);$t.position.set(0,4.55,-.04),vt.add($t),vt.position.set(ge+rt*o*.74,dt,de+Vt*o*.74),vt.rotation.y=Math.atan2(rt,Vt),vt.traverse(Kt=>{Kt.castShadow=!0,Kt.receiveShadow=!0}),i.add(vt)};let j=0,ve=0;for(let ge=1;ge<l.length-1;ge++)for(let de=1;de<d.length-1;de++){const Ne=l[ge],$e=d[de];if(Gn(Ne,$e,o*.9).clearance<2)continue;const dt=Math.abs(Ne-80)<=a*1.05&&$e<=s&&$e>=-560,vt=$e<-260&&$e>-1180&&(ge+de)%4===0,rt=$e>-360&&(ge+de)%2===0;dt&&de%2===0||vt?ae(Ne,$e,j++):(rt||(ge+de)%5===0&&$e>-820)&&te(Ne,$e,ve++)}return Vn(i,ge=>{for(const de of O){const Ne=bt(de.control,ge);de.red.emissiveIntensity=Ne.green===de.axis||Ne.yellow===de.axis?.12:2.3,de.yellow.emissiveIntensity=Ne.yellow===de.axis?2.6:.12,de.green.emissiveIntensity=Ne.green===de.axis?2.6:.1}}),{trafficLights:j,stopSigns:ve}}const mt=Ge();qg(i,u,{X0:t,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:Te}),St.trafficLights=mt.trafficLights,St.stopSigns=mt.stopSigns;const N=new ht(.12,.16,7.2,7),nt=new Ht(.46,10,8),et=new Ut(2.8,13),xt=new K({color:1581353,roughness:.42,metalness:.68}),Le=new K({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Pt=new Et({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:ut,blending:Oi}),Be=132,qe=new Qt(N,xt,Be),U=new Qt(nt,Le,Be),T=new Qt(et,Pt,Be);let W=0;for(let O=0;O<Be*2&&W<Be;O++){const z=Math.random()<.5,H=z?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),$=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Gn(H,$,3).clearance<2)continue;const se=je(H,$);e.quaternion.identity(),e.position.set(H,se+3.6,$),e.scale.set(1,1,1),e.updateMatrix(),qe.setMatrixAt(W,e.matrix),e.position.set(H,se+7.5,$),e.updateMatrix(),U.setMatrixAt(W,e.matrix),e.position.set(H,se+.72,$),e.quaternion.setFromAxisAngle(new D(1,0,0),-Math.PI/2),e.rotateZ(z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),T.setMatrixAt(W,e.matrix),W++}qe.count=W,U.count=W,T.count=W,qe.instanceMatrix.needsUpdate=!0,U.instanceMatrix.needsUpdate=!0,T.instanceMatrix.needsUpdate=!0,i.add(qe,U,T),St.streetLights=W;const le=new K({color:10397084,roughness:.58,metalness:.04}),fe=new K({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12});i.add(new X(f([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),le)),i.add(new X(f([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),le)),i.add(new X(f([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),fe));const ne=new Et({color:16765818,transparent:!0,opacity:.28,depthWrite:!1,side:ut,blending:Oi});function ze(O,z,H,$=!1){const se=je(O,z),L=new at,re=new X(new ht(.16,.22,9.5,8),xt);re.position.y=4.75,L.add(re);const ce=new X(new Ue(3.8,.22,.22),xt);ce.position.set(H*1.75,8.95,0),L.add(ce);const ae=new X(new Ht(.62,12,8),Le);ae.position.set(H*3.6,8.82,0),L.add(ae);const te=new X(new dn(4.6,20),ne.clone());te.position.copy(ae.position),te.rotation.x=-Math.PI/2,te.material.opacity=.18+Math.random()*.12,L.add(te);const j=new X(new Ut(3.2,15),Pt.clone());if(j.position.set(H*2.8,.72,0),j.rotation.x=-Math.PI/2,j.scale.y=.7+Math.random()*.35,L.add(j),$){const ve=new _c(16762474,3,52,2.2);ve.position.copy(ae.position),L.add(ve)}L.position.set(O,se,z),i.add(L),St.streetLights++}let we=0;for(let O=340;O>=-700;O-=118)ze(63,O,1,we++%4===0),ze(97,O-42,-1,we++%4===0);function Ve(O,z,H,$,se,L,re,ce=null,ae=0){const te=je(O,z)-.45;if(Hs(O,z,H,$,te+se+2))return!1;const j=O<80?1:-1,ve=new K({map:fs(192,512,re),color:L,roughness:.38,metalness:.26,emissive:1719900,emissiveIntensity:.44}),ge=new X(new Ue(H,se,$),ve);ge.position.set(O,te+se/2,z),ge.castShadow=!0,ge.receiveShadow=!0,i.add(ge);const de=new K({map:fs(220,620,Math.min(.86,re+.18)),color:16777215,roughness:.2,metalness:.14,emissive:1386040,emissiveIntensity:.12,transparent:!0,opacity:.94,side:ut}),Ne=new X(new Ut($*.78,se*.74),de);Ne.position.set(O+j*(H/2+.09),te+se*.54,z),Ne.rotation.y=j>0?Math.PI/2:-Math.PI/2,i.add(Ne);const $e=new X(new Ue(H*1.04,1.2,$*1.04),new K({color:1778733,roughness:.34,metalness:.38}));$e.position.set(O,te+se+.7,z),i.add($e);const dt=new K({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const vt of[-1,1]){const rt=new X(new Ue(H*1.1,.22,.18),dt);rt.position.set(O,te+se+1.4,z+vt*($/2+.18)),i.add(rt)}if(ce&&ae){const vt=new Et({map:Gl(ce,ce==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:ut,depthWrite:!1}),rt=new X(new Ut(7.5,24),vt);rt.position.set(O+ae*(H/2+.3),te+Math.min(se-8,se*.58),z),rt.rotation.y=ae>0?Math.PI/2:-Math.PI/2,i.add(rt)}return Wn.push({x:O,z,hw:H*.5,hd:$*.5,maxY:te+se+2}),!0}function Fe(O,z,H,$=3.2){const se=O*.5+$,L=z*.5+$,re=Math.max(2,Math.abs(se-L)*.72),ae=O>=z?[-se,0,-L,se,0,-L,re,H,0,-se,0,-L,re,H,0,-re,H,0,se,0,-L,se,0,L,re,H,0,se,0,L,-se,0,L,-re,H,0,se,0,L,re,H,0,-re,H,0,-se,0,L,-se,0,-L,-re,H,0]:[-se,0,-L,se,0,-L,0,H,-re,se,0,-L,se,0,L,0,H,re,se,0,-L,0,H,re,0,H,-re,se,0,L,-se,0,L,0,H,re,-se,0,L,-se,0,-L,0,H,-re,-se,0,L,0,H,-re,0,H,re],te=new kt;return te.setAttribute("position",new pt(ae,3)),te.computeVertexNormals(),te}function ue(O,z,H,$,se,L,re={}){const ce=je(O,z)-.3;if(Hs(O,z,H,$,ce+se+(re.roofH??8.2)+1,6))return!1;const ae=re.frontZ??-1,te=new K({map:ie,color:re.wallColor??14734788,roughness:.68,metalness:.03}),j=new X(new Ue(H,se,$),te);j.position.set(O,ce+se/2,z),j.castShadow=!0,j.receiveShadow=!0,i.add(j);const ve=new K({map:me,color:L,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ge=re.roofH??8.2,de=new X(Fe(H,$,ge),ve);de.position.set(O,ce+se,z),de.castShadow=!0,de.receiveShadow=!0,i.add(de);const Ne=new K({color:15985112,roughness:.42,metalness:.05}),$e=new X(new Ue(H+7,.42,1.2),Ne);$e.position.set(O,ce+se+.12,z+ae*($*.5+1.4)),i.add($e);const dt=$e.clone();dt.position.z=z-ae*($*.5+1.4),i.add(dt);const vt=Math.min(18,H*.38),rt=new X(new Ue(vt,se*.55,.32),new K({map:Me,roughness:.34,metalness:.2}));rt.position.set(O+H*.18,ce+se*.33,z+ae*($*.5+.22)),i.add(rt);const Vt=new X(new Ue(5.2,7.2,.28),new K({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Vt.position.set(O-H*.25,ce+3.7,z+ae*($/2+.24)),i.add(Vt);const Lt=new K({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Yt=new K({color:3353638,roughness:.38});for(const gn of[-H*.36,-H*.05,H*.38]){if(Math.abs(gn-H*.18)<vt*.45)continue;const ui=new X(new Ue(6.2,4.8,.26),Yt);ui.position.set(O+gn,ce+se*.58,z+ae*($*.5+.28)),i.add(ui);const fi=new X(new Ue(4.8,3.4,.3),Lt);fi.position.copy(ui.position),fi.position.z+=ae*.04,i.add(fi)}const $t=new K({color:12370619,roughness:.44,metalness:.04}),Kt=new X(new Ue(vt*1.18,.12,34),$t);Kt.position.set(O+H*.18,je(O+H*.18,z+ae*($*.5+17))+.11,z+ae*($*.5+17)),i.add(Kt);const Zt=new K({color:5679925,roughness:.86,metalness:.01}),xn=new X(new Ue(H+10,.08,$+12),Zt);xn.position.set(O,je(O,z)-.18,z),xn.receiveShadow=!0,i.add(xn),xn.renderOrder=-1;const Tn=new K({color:3042609,roughness:.84}),an=[new K({color:16766544,roughness:.58}),new K({color:16738974,roughness:.58}),new K({color:16314584,roughness:.58})];for(let gn=0;gn<9;gn++){const ui=O-H*.44+gn*(H*.11),fi=z+ae*($*.5+2.2+gn%2*1.5),Zi=new X(new Ht(1.35+gn%3*.22,10,7),gn%4===0?an[gn%an.length]:Tn);Zi.position.set(ui,je(ui,fi)+.95,fi),Zi.scale.y=.72,Zi.castShadow=!0,i.add(Zi)}return Wn.push({x:O,z,hw:H*.5,hd:$*.5,maxY:ce+se+5}),!0}return ue(-8,286,92,58,18,14244903,{wallColor:15063235,frontZ:1,roofH:8.8}),ue(168,238,54,46,15,12536356,{wallColor:13946041,frontZ:1,roofH:7.2}),ue(-188,316,48,42,14,12995115,{wallColor:14274744,frontZ:1,roofH:6.8}),ue(262,304,58,46,15,13788715,{wallColor:14799288,frontZ:1,roofH:7.4}),ue(-230,152,54,44,14,12272168,{wallColor:13616562,frontZ:1,roofH:6.8}),ue(282,120,50,42,13,12801063,{wallColor:14275524,frontZ:1,roofH:6.5}),Ve(-48,-360,54,86,148,2439765,.58,null,0),Ve(172,-430,50,80,132,3817032,.66,"OPEN",-1),Je.add(i),i}function $g(i,e=1){const n=ft(16),s=new D(n.tangent.x,0,n.tangent.z).normalize(),r=new D().crossVectors(en,s).normalize(),a=n.p.clone().addScaledVector(n.side,e*he.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*e*c,d=a.z-s.z*o+r.z*e*c,u=new D(l,je(l,d)+.4,d),f=26,m=[];for(let A=0;A<=f;A++){const I=A/f,B=I*I*(3-2*I);m.push(new D(Oe.lerp(u.x,a.x,I),Oe.lerp(u.y,a.y,B),Oe.lerp(u.z,a.z,I)))}const g=7.4,v=new D,p=new D,h=[],_=[];for(let A=0;A<=f;A++)p.subVectors(m[Math.min(f,A+1)],m[Math.max(0,A-1)]),p.y=0,p.normalize(),v.crossVectors(en,p).normalize(),h.push(m[A].clone().addScaledVector(v,-g)),_.push(m[A].clone().addScaledVector(v,g));const y={kind:"ramp",halfW:g,dirSel:e,mergeS:16,points:m.map(A=>A.clone()),segments:[]};for(let A=0;A<f;A++){const I=m[A],B=m[A+1],q=B.x-I.x,Z=B.z-I.z,J=Math.max(1e-4,q*q+Z*Z);y.segments.push({a:I.clone(),b:B.clone(),abx:q,abz:Z,lenSq:J,u0:A/f,u1:(A+1)/f})}oa.push(y);const S=[];for(let A=0;A<f;A++){const I=h[A],B=_[A],q=h[A+1],Z=_[A+1];S.push(I.x,I.y,I.z,B.x,B.y,B.z,Z.x,Z.y,Z.z),S.push(I.x,I.y,I.z,Z.x,Z.y,Z.z,q.x,q.y,q.z)}const E=new kt;E.setAttribute("position",new pt(S,3)),E.computeVertexNormals();const w=new K({color:2895665,roughness:.85,metalness:.05,side:ut});i.add(new X(E,w));const R=new K({color:12107972,roughness:.5,metalness:.4});for(let A=0;A<f;A++)hn(i,h[A].clone().setY(h[A].y+1),h[A+1].clone().setY(h[A+1].y+1),.16,R),hn(i,_[A].clone().setY(_[A].y+1),_[A+1].clone().setY(_[A+1].y+1),.16,R);const P=new K({color:7173241,roughness:.82});for(let A=3;A<f;A+=3){const I=m[A],B=je(I.x,I.z),q=I.y-B;if(q<3)continue;const Z=new X(new ht(.9,1.15,q,8),P);Z.position.set(I.x,B+q/2,I.z),i.add(Z),Xn.push({x:I.x,z:I.z,hw:1.3,hd:1.3,maxY:I.y-.9})}const b=new Et({map:bc("ON RAMP"),transparent:!0,side:ut}),M=new X(new Ut(12,3),b);M.position.copy(u).add(new D(0,5.5,0)),M.rotation.y=Math.atan2(-s.x,-s.z),i.add(M);for(const A of[-1,1]){const I=new X(new ht(.2,.26,6,6),P);I.position.set(u.x+r.x*A*5.4,u.y+3,u.z+r.z*A*5.4),i.add(I)}}function Kg(){const i=new at,e=[],t=new Ze(14170671),n=new Ze(15922680),s=new K({color:3883336,roughness:.6,metalness:.3}),r=new Et({map:Jg(),transparent:!0,side:ut}),a=new K({color:4926748,roughness:.9}),o=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:2583370,roughness:.9})],c=new K({color:7040883,roughness:.95,side:ut}),l=12,d=[],u=[];let f=0;for(let g=0;g<he.length;g+=l){if(Ti(g+l*.5)){f++;continue}const v=ft(g),p=ft(g+l),h=v.p.clone().add(p.p).multiplyScalar(.5),{sideways:_,normal:y,q:S}=ri(v,p);for(const E of[-1,1]){const w=h.clone().addScaledVector(_,E*he.width*.5).addScaledVector(y,.5);d.push(w),u.push(S),e.push(f%2===0?t:n)}if(f%16===8){const E=(f>>4)%2?1:-1,w=h.clone().addScaledVector(_,E*he.width*.52).addScaledVector(y,.4),R=new at,P=new X(new Ut(4.4,2.6),r);P.position.y=3.4,P.rotation.y=Math.PI,R.add(P);const b=new ht(.12,.16,3.4,5);for(const M of[-1.5,1.5]){const A=new X(b,s);A.position.set(M,1.7,0),R.add(A)}R.position.copy(w),R.quaternion.copy(S),i.add(R)}f++}for(let g=0;g<he.length;g+=16){const v=ft(g),p=1+(Math.random()<.5?1:0);for(let h=0;h<p;h++){const _=Math.random()<.5?-1:1,y=he.width/2+12+Math.random()*78,S=v.p.x+v.side.x*y*_+(Math.random()-.5)*16,E=v.p.z+v.side.z*y*_+(Math.random()-.5)*16;if(aa(S,E,18))continue;const w=je(S,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,P=new at,b=2.4+Math.random()*4.2,M=new X(new ht(.26,.42,b,6),a);M.position.y=b/2,P.add(M);const A=2+Math.floor(Math.random()*3);for(let I=0;I<A;I++){const B=new X(new Vi(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(h+I+g)%o.length]);B.position.y=b+I*1.4+1.5,B.rotation.y=Math.random()*Math.PI,P.add(B)}P.position.set(S,w+.6,E),P.scale.setScalar(R),i.add(P)}else{const R=1.4+Math.random()*3.6,P=new X(new uc(R,0),c);P.position.set(S,w+R*.35,E),P.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),P.scale.set(1,.7+Math.random()*.4,1),i.add(P),Xn.push({kind:"rock",x:S,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const v=he.length*g/3+6;if(Ti(v))continue;const p=ft(v),h=ft(v+l),_=p.p.clone().add(h.p).multiplyScalar(.5),{q:y}=ri(p,h),S=he.width*.5+1.2,E=9,w=new at,R=new ht(.4,.55,E,7);for(const I of[-1,1]){const B=new X(R,s);B.position.set(I*S,E/2,0),w.add(B)}const P=S*2,b=new X(new Ue(P,1.1,1.1),s);b.position.y=E,w.add(b);const M=new Et({map:bc(m[g]),transparent:!0,side:ut}),A=new X(new Ut(P*.82,3),M);A.position.set(0,E-2,0),A.rotation.y=Math.PI,w.add(A),w.position.copy(_),w.quaternion.copy(y),i.add(w)}if(d.length){const g=new ht(.18,.24,3,6);g.translate(0,1.5,0);const v=new Ht(.34,8,6);v.translate(0,3.2,0);const p=new K({color:10134440,roughness:.7,metalness:.2}),h=new K({roughness:.55}),_=new Qt(g,p,d.length),y=new Qt(v,h,d.length),S=new zt;for(let E=0;E<d.length;E++)S.position.copy(d[E]),S.quaternion.copy(u[E]),S.updateMatrix(),_.setMatrixAt(E,S.matrix),y.setMatrixAt(E,S.matrix),y.setColorAt(E,e[E]);_.instanceMatrix.needsUpdate=!0,y.instanceMatrix.needsUpdate=!0,y.instanceColor&&(y.instanceColor.needsUpdate=!0),i.add(_),i.add(y)}return $g(i),Je.add(i),i}function Jg(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new un(i);return t.colorSpace=Tt,t}function bc(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new un(e);return n.colorSpace=Tt,n}function jg(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new un(t);return o.colorSpace=Tt,o}function Qg(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new un(i);return n.colorSpace=Tt,n.wrapS=rn,n.repeat.set(3,1),n}function Rt(i,e,t,n,s){const r=new X(new Ue(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function ri(i,e){const t=e.p.clone().sub(i.p).normalize(),n=Zh.crossVectors(en,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new hi().setFromAxisAngle(t,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new Mt().makeBasis(n,s,t),o=new hi().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function Wl(i,e,t,n){const r=[],a=[],o=[],c=he.width*.47;let l=0;for(let f=e;f<=t;f+=8){const m=ft(Math.min(f,t)),g=ri(m,ft(m.s+2)),v=Math.sin(f*.018)*.04,p=m.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+v),h=m.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-v);r.push(p.x,p.y,p.z,h.x,h.y,h.z);const _=(f-e)/64;if(a.push(0,_,1,_),l>0){const y=(l-1)*2,S=l*2;o.push(y,y+1,S,y+1,S+1,S)}l++}const d=new kt;d.setAttribute("position",new pt(r,3)),d.setAttribute("uv",new pt(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new X(d,n);u.receiveShadow=!0,i.add(u)}function e_(i,e){let t=0;for(const n of he.gaps)Wl(i,t,Math.max(t,n.start-4),e),t=n.end+4;Wl(i,t,he.length,e)}function t_(i,e,t){const n=ft(e.s+2),{normal:s,q:r}=ri(e,n),a=new at;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new X(new Ue(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new X(new Ue(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new X(new Ue(.42,.1,3.8),t);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function n_(){const i=new at;Je.add(i),Xo=0;const e=new K({color:12171149,roughness:.72,metalness:.08}),t=new K({color:9869942,roughness:.78,metalness:.05}),n=new K({color:15255629,roughness:.28,metalness:.72}),s=new K({color:8204328,roughness:.3,metalness:.85}),r=new K({color:6120040,roughness:.5,metalness:.6}),a=new K({color:4080968,roughness:.58,metalness:.55}),o=new K({color:14270570,roughness:.35,metalness:.65}),c=new K({color:2435884,roughness:.48,metalness:.62}),l=new K({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new K({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new K({color:4935486,roughness:.92,metalness:.04}),f=new K({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new K({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new K({color:3159607,roughness:.7,metalness:.45}),v=new K({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),p=new K({color:15919561,roughness:.82,metalness:.02});new K({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const h=new K({map:Ig(),roughness:.74,metalness:.08}),_=new Et({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),y=12;e_(i,h);function S(E,w=!1){if(Ti(E))return!1;const R=ft(E),P=ft(E+3),{sideways:b,normal:M,q:A}=ri(R,P),I=R.p,B=je(I.x,I.z),q=I.y-.95;if(q-B<10)return!1;const Z=he.width*(w?.43:.35),J=q,oe=B+.25,ie=w?.56:.42,me=w?2.4:1.75,Me=w?.52:.36,De=[],F=[];for(const pe of[-1,1]){const be=I.clone().addScaledVector(b,pe*Z).addScaledVector(M,-.85);be.y=J;const Te=new D(be.x,oe,be.z);hn(i,Te,be,ie,r);const ke=new X(new ht(me,me*1.12,Me,12),r);ke.position.set(Te.x,B+Me*.5,Te.z),ke.receiveShadow=!0,i.add(ke),De.push(be),F.push(Te),Xn.push({x:Te.x,z:Te.z,hw:me*.92,hd:me*.92,maxY:J-.7})}const Se=I.clone().addScaledVector(M,-1.05);Se.y=J,Rt(i,new D(he.width*.92,w?.58:.42,w?1.55:1.15),Se,A,a);const xe=F[0].clone();xe.y+=(J-oe)*.28;const _e=F[1].clone();_e.y+=(J-oe)*.28;const G=De[0].clone();G.y-=1;const Y=De[1].clone();if(Y.y-=1,hn(i,xe,Y,w?.16:.1,c),hn(i,_e,G,w?.16:.1,c),w){const pe=F[0].clone();pe.y+=(J-oe)*.58;const be=F[1].clone();be.y+=(J-oe)*.58,hn(i,F[0].clone().setY(oe+1.2),be,.13,c),hn(i,F[1].clone().setY(oe+1.2),pe,.13,c),hn(i,pe,Y,.13,c),hn(i,be,G,.13,c)}return Xo++,!0}for(let E=0;E<he.length;E+=y){if(Ti(E+y*.5))continue;const w=ft(E),R=ft(E+y),P=w.p.clone().add(R.p).multiplyScalar(.5),{sideways:b,normal:M,q:A}=ri(w,R),I=w.p.distanceTo(R.p)+.45,B=Math.floor(E/(y*2))%2?e:t;Rt(i,new D(he.width,.62,I),P.clone().addScaledVector(M,-.05),A,B),Rt(i,new D(he.width-2.8,.08,I*.86),P.clone().addScaledVector(M,.36),A,u),Rt(i,new D(.2,.1,I*.76),P.clone().addScaledVector(b,-he.width*.19).addScaledVector(M,.43),A,u),Rt(i,new D(.2,.1,I*.76),P.clone().addScaledVector(b,he.width*.19).addScaledVector(M,.43),A,u),E%48===0&&(Rt(i,new D(.14,.08,I*.62),P.clone().addScaledVector(b,-he.width*.08).addScaledVector(M,.51),A,v),Rt(i,new D(.14,.08,I*.62),P.clone().addScaledVector(b,he.width*.08).addScaledVector(M,.51),A,v)),E%120===0&&Rt(i,new D(he.width*.42,.07,.72),P.clone().addScaledVector(M,.55),A,p),Rt(i,new D(he.width+1.2,.35,I*.94),P.clone().addScaledVector(M,-.56),A,a),Rt(i,new D(.42,.42,I*.9),P.clone().addScaledVector(b,-he.width*.36).addScaledVector(M,-.78),A,g),Rt(i,new D(.42,.42,I*.9),P.clone().addScaledVector(b,he.width*.36).addScaledVector(M,-.78),A,g);const q=P.clone().addScaledVector(b,-he.width*.51),Z=P.clone().addScaledVector(b,he.width*.51);if(Rt(i,new D(.32,.46,I),q.clone().addScaledVector(M,.28),A,n),Rt(i,new D(.32,.46,I),Z.clone().addScaledVector(M,.28),A,n),Rt(i,new D(.26,.72,I*.94),q.clone().addScaledVector(M,-.22),A,a),Rt(i,new D(.26,.72,I*.94),Z.clone().addScaledVector(M,-.22),A,a),E%36===0)for(const J of[-he.width*.39,-he.width*.2,he.width*.2,he.width*.39]){const oe=new X(new ht(.16,.2,.12,10),o);oe.position.copy(P).addScaledVector(b,J).addScaledVector(M,.46),oe.quaternion.copy(A),oe.castShadow=!1,i.add(oe)}if(E%72===0&&(Rt(i,new D(.34,1.56,3.4),P.clone().addScaledVector(b,-he.width*.66).addScaledVector(M,1.16),A,s),Rt(i,new D(.34,1.56,3.4),P.clone().addScaledVector(b,he.width*.66).addScaledVector(M,1.16),A,s),Rt(i,new D(.18,.18,4.4),P.clone().addScaledVector(b,-he.width*.62).addScaledVector(M,1.94),A,s),Rt(i,new D(.18,.18,4.4),P.clone().addScaledVector(b,he.width*.62).addScaledVector(M,1.94),A,s),Rt(i,new D(.12,.12,4),P.clone().addScaledVector(b,-he.width*.62).addScaledVector(M,1.38),A,n),Rt(i,new D(.12,.12,4),P.clone().addScaledVector(b,he.width*.62).addScaledVector(M,1.38),A,n),hn(i,P.clone().addScaledVector(b,-he.width*.58).addScaledVector(M,-1.08),P.clone().addScaledVector(b,he.width*.58).addScaledVector(M,-1.08),.11,c),hn(i,P.clone().addScaledVector(b,-he.width*.48).addScaledVector(M,-1),P.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c),hn(i,P.clone().addScaledVector(b,he.width*.48).addScaledVector(M,-1),P.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c)),E%96===0){const J=new X(new dn(1,28),_);J.rotation.x=-Math.PI/2,J.position.set(P.x,-4.72,P.z),J.scale.set(he.width*.9,Math.max(10,I*2.2),1),J.rotation.z=Math.atan2(ri(w,R).tangent.x,ri(w,R).tangent.z),i.add(J)}if(E%144===0){const J=P.clone().addScaledVector(b,-he.width*.74).addScaledVector(M,2),oe=P.clone().addScaledVector(b,he.width*.74).addScaledVector(M,2);hn(i,J.clone().addScaledVector(M,-1.2),J.clone().addScaledVector(M,1.1),.12,s),hn(i,oe.clone().addScaledVector(M,-1.2),oe.clone().addScaledVector(M,1.1),.12,s),Rt(i,new D(.46,.72,.46),J.clone().addScaledVector(M,1.15),A,l),Rt(i,new D(.46,.72,.46),oe.clone().addScaledVector(M,1.15),A,l)}if(E%288===0){const J=P.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*he.width*.92).addScaledVector(M,5.2);Rt(i,new D(.44,.44,.44),J.clone(),A,f),hn(i,J.clone().addScaledVector(M,-.2),P.clone().addScaledVector(M,1),.05,c)}E%48===0&&S(E+y*.5,!1),E%168===0&&!Ti(E+16)&&t_(i,ft(E+5),d)}for(const E of he.gaps){const w=ft(E.start-3),R=ft(E.end+3);for(const P of[w,R]){const b=ft(P.s+2),{normal:M,q:A}=ri(P,b);Rt(i,new D(he.width-1.2,.08,4.6),P.p.clone().addScaledVector(M,.54),A,l),Rt(i,new D(he.width*.62,.09,1.3),P.p.clone().addScaledVector(M,.62).addScaledVector(P.tangent,P===w?-6.3:6.3),A,p);for(const I of[-he.width*.42,0,he.width*.42]){const B=P.p.clone().addScaledVector(P.side,I).addScaledVector(M,2.35);Rt(i,new D(.46,.46,.46),B,A,I===0?m:l)}S(P.s+(P===w?-9:9),!0),S(P.s+(P===w?-24:24),!0)}}return i}function nd(i=13710372,e=7740696){const t=new at,n=new K({color:i,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new K({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new K({color:329225,roughness:.52,metalness:.12}),a=new K({color:1053463,roughness:.38,metalness:.34}),o=new K({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new K({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),l=new K({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new K({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:1.25}),u=new K({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:.88}),f=new K({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:.95}),m=new K({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),g=new K({color:329225,roughness:.44,metalness:.22}),v=new X(new dn(3.65,36),new Et({color:0,transparent:!0,opacity:.22,depthWrite:!1}));v.rotation.x=-Math.PI/2,v.position.y=.08,v.scale.z=1.58,t.add(v);const p=(S,E,w,R,P=null,b=null)=>{const M=new X(E,w);return M.name=S,M.position.copy(R),P&&M.rotation.set(P.x||0,P.y||0,P.z||0),b&&M.scale.copy(b),t.add(M),M},h=(S,E,w,R,P,b,M=0,A=0,I=0)=>p(S,new Ue(E.x,E.y,E.z),w,new D(R,P,b),new D(M,A,I));h("low black undertray",new D(5.25,.28,8.45),r,0,.45,-.08),h("wide wedge body tub",new D(4.85,.86,6.65),n,0,.98,.28,-.035),h("sloped front wedge nose",new D(3.7,.64,3.35),n,0,.83,-3.75,-.145),h("front black splitter",new D(5.25,.13,.78),r,0,.35,-5.6),h("left sculpted rocker panel",new D(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),h("right sculpted rocker panel",new D(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),h("left rear haunch",new D(.72,.74,2.55),n,-2.53,1.18,2.08,-.04),h("right rear haunch",new D(.72,.74,2.55),n,2.53,1.18,2.08,-.04),h("left front fender flare",new D(.46,.54,1.38),n,-2.55,.98,-2.78,-.04),h("right front fender flare",new D(.46,.54,1.38),n,2.55,.98,-2.78,-.04),h("black rear fascia",new D(4.72,.66,.2),a,0,1.02,4.04),h("deep rear bumper",new D(5.32,.38,.48),c,0,.58,4.23),h("front windshield",new D(2.8,.13,1.15),l,0,1.78,-1.25,-.48),h("roof glass",new D(2.34,.18,1.55),l,0,2.08,-.2,-.13),h("left side window",new D(.12,.78,1.9),l,-1.28,1.76,-.15,-.08,.04),h("right side window",new D(.12,.78,1.9),l,1.28,1.76,-.15,-.08,-.04),h("black a pillar left",new D(.12,.86,.14),g,-1.46,1.75,-1.22,-.48),h("black a pillar right",new D(.12,.86,.14),g,1.46,1.75,-1.22,-.48),h("rear deck panel",new D(3.5,.18,2.18),n,0,1.7,2,-.2);for(let S=0;S<7;S++)h("black rear deck louver",new D(3.35,.12,.18),a,0,1.83+S*.015,1.1+S*.28,-.21);h("raised rear spoiler blade",new D(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const S of[-2.28,2.28])h("spoiler side endplate",new D(.24,.78,1.04),s,S,1.43,3.72,0,0,S<0?-.08:.08);for(const S of[-1.78,1.78])h("thin hood crease",new D(.08,.04,2.55),g,S*.36,1.27,-3.45,-.15),h("door seam",new D(.035,.68,1.75),g,S,1.16,-.2),h("side intake",new D(.09,.34,.9),a,Math.sign(S)*2.68,.86,1.42);for(const S of[-1.04,1.04])h("pop up headlight glass",new D(.62,.12,.18),f,S,1.02,-5.28,-.16);h("tail light backplate",new D(3.86,.46,.08),g,0,1.08,4.18);for(const S of[-1.42,-.62,.62,1.42])h("rectangular glowing tail lamp",new D(.54,.28,.1),Math.abs(S)>1?d:u,S,1.08,4.24);h("slim chrome beltline left",new D(.06,.08,4.75),o,-2.72,1.42,-.2),h("slim chrome beltline right",new D(.06,.08,4.75),o,2.72,1.42,-.2),h("left black roof rail",new D(.12,.12,2.72),g,-1.34,2.15,-.42,-.13),h("right black roof rail",new D(.12,.12,2.72),g,1.34,2.15,-.42,-.13);for(const S of[-2.86,2.86])h("angular side mirror arm",new D(.42,.08,.08),g,S,1.62,-1.55,0,0,S<0?-.14:.14),h("blue tinted side mirror",new D(.12,.34,.46),l,S*1.03,1.62,-1.65,0,S<0?.24:-.24),h("flush door handle",new D(.08,.11,.46),o,S*.94,1.28,.52);for(const S of[-2.65,2.42])h("left wheel arch shadow",new D(.08,.9,1.75),g,-2.82,.78,S),h("right wheel arch shadow",new D(.08,.9,1.75),g,2.82,.78,S);h("black license recess",new D(.9,.24,.08),a,0,.76,4.31);const _=[],y=(S,E,w=!1)=>{const R=new at;R.name=w?"steering front wheel assembly":"rear wheel assembly",R.position.set(S,.54,E);const P=new X(new ht(.88,.88,.62,28),r);P.name="wide performance tire",P.rotation.z=Math.PI/2,R.add(P);const b=new X(new cr(.88,.06,10,32),r);b.name="rounded tire sidewall",b.rotation.y=Math.PI/2,R.add(b);const M=new X(new ht(.42,.42,.66,24),o);M.name="chrome wheel rim",M.rotation.z=Math.PI/2,R.add(M);const A=new X(new ht(.56,.56,.08,24),m);A.name="visible brake disc",A.rotation.z=Math.PI/2,A.position.x=S>0?-.05:.05,R.add(A);for(let q=0;q<8;q++){const Z=new X(new Ue(.08,.055,.62),o);Z.name="thin wheel spoke",Z.rotation.x=q/8*Math.PI*2,Z.position.set(S>0?.035:-.035,0,.22),R.add(Z)}const I=new X(new Ue(.1,.22,.18),u);I.name="small brake caliper",I.position.set(S>0?-.39:.39,.18,-.38),R.add(I);const B=new X(new ht(.17,.17,.72,18),c);B.name="dark center cap",B.rotation.z=Math.PI/2,R.add(B),t.add(R),w&&_.push(R)};for(const S of[-2.4,2.4])y(S,-2.65,!0),y(S,2.42,!1);t.userData.frontWheels=_,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const S of[-.92,-.52,.52,.92]){const E=new X(new ht(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(S,.43,4.52),t.add(E)}return t.traverse(S=>{S.castShadow=!0,S.receiveShadow=!0}),Je.add(t),t}function i_(){const i=new at,e=new K({color:9383205,roughness:.35,metalness:.55}),t=new K({color:460551,roughness:.55}),n=new K({color:12375772,roughness:.18,metalness:.9}),s=new K({color:16767297,roughness:.38,metalness:.25}),r=new K({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new K({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new K({color:1118995,roughness:.7,metalness:.05}),c=new X(new Ue(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),i.add(c);const l=new X(new Ue(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new X(new Ue(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new X(new Ut(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new X(new cr(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let m=0;m<3;m++){const g=new X(new Ue(.34,.025,.035),n);g.position.copy(f.position),g.rotation.copy(f.rotation),g.rotation.z+=m/3*Math.PI*2,i.add(g)}for(let m=0;m<6;m++){const g=new X(new ht(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),i.add(g)}for(const m of[-1.08,1.08]){const g=new X(new ht(.34,.34,.25,18),t);g.rotation.z=Math.PI/2,g.position.set(m,-.68,-1.58),i.add(g);const v=new X(new cr(.22,.035,8,28),s);v.scale.set(.72,1.25,.72),v.position.set(m*.8,-.48,-1.74),v.rotation.x=Math.PI/2,i.add(v)}for(const m of[-1.14,-.84,.84,1.14]){const g=new X(new ht(.035,.04,.028,8),n);g.position.set(m,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const m of[-.52,.52]){const g=new X(new Ht(.045,12,8),r);g.position.set(m,-.34,-1.22),i.add(g)}i.position.set(0,0,0),tt.add(i),di=i}function s_(){const i=new K({color:16119285,roughness:.35,metalness:.25}),e=new K({color:1184274,roughness:.45}),t=new K({map:Dg(),roughness:.42,metalness:.05}),n=new K({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=ft(0),r=new Mt().makeBasis(s.side,en,s.tangent),a=new hi().setFromRotationMatrix(r),o=new at;for(const d of[-he.width*.58,he.width*.58]){const u=new X(new Ue(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(en,5.4),u.quaternion.copy(a),o.add(u)}const c=new X(new Ue(he.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(en,11.2),c.quaternion.copy(a),o.add(c);const l=new X(new Ue(he.width+1.2,1.4,.18),e);l.position.copy(s.p).addScaledVector(en,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-he.width*.38,0,he.width*.38]){const u=new X(new Ht(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(en,10.25),o.add(u)}return Je.add(o),o}const gs=nd(),bn=nd(3108784,1916782);bn.visible=!1;Gg();Vg();Hg();Wg();Zg();let Xl=null,Yl=null,ql=null,di=null;i_();function Ya(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),Je.remove(i))}function wc(i){return Yr=Oe.clamp(i,0,Wi.length-1),he=Wi[Yr],Xn.length=0,oa.length=0,Ya(Xl),Ya(Yl),Ya(ql),Xl=n_(),Yl=s_(),ql=Kg(),Xe.trackName.textContent=he.name,Xe.courseName&&(Xe.courseName.textContent=he.name),Xe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Yr)}),he.name}wc(0);const Rs=new yg(fn);Rs.addPass(new bg(Je,tt));const id=new ws(new Ee(window.innerWidth,window.innerHeight),.34,.78,1);Rs.addPass(id);Rs.addPass(new Tg);const r_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Ws=new Yh(r_);Rs.addPass(Ws);const a_=new K({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Zr=Array.from({length:72},()=>{const i=new X(new Ht(.1,8,5),a_);return i.visible=!1,Je.add(i),{mesh:i,life:0,velocity:new D}});let li=null;function sd(){if(li)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),li={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function ea(){li||sd(),li?.ctx.state==="suspended"&&li.ctx.resume().catch(()=>{})}function Zl(i){if(!li)return;const{ctx:e}=li,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function $l(i,e=18){const t=Math.min(e,Zr.length);for(let n=0;n<t;n++){const s=Zr.find(r=>r.life<=0)||Zr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function o_(i){for(const e of Zr){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}}function c_(i){if(!li)return;const{ctx:e,engine:t,engineGain:n,filter:s}=li;t.frequency.setTargetAtTime(62+x.speed*2.9+(ct.has("ShiftLeft")||ct.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+x.speed*9,e.currentTime,.08);const r=x.mode==="race"||x.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(x.speed)/4200:1e-4,e.currentTime,.08)}function ca(i=!1,e=!1){sd(),ct.clear(),ta();const t=i||e;Object.assign(x,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=ft(x.s);x.y=n.p.y+2.1,x.yVel=0,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.resultStats.innerHTML="",Xe.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",Xe.trackName.textContent=he.name,bn.visible=!1,di&&(di.visible=!0),document.body.classList.remove("roam-mode"),window.__freeCam=!1}function rd(){ea(),x.mode="roam",x.practice=!0,x.freeRun=!1,ct.clear(),ta();let i=118,e=402;Gn(i,e,6).clearance<6&&(i=92,e=392),x.roamPos.set(i,je(i,e),e),x.roamYaw=-.05,x.camYaw=x.roamYaw,x.camLookYaw=0,x.camLookPitch=0,x.cameraZoom=0,Ce.zoom=0,x.wheelSteer=0,x.speed=0,x.boost=1,x.damage=0,x.cameraShake=0,x.message="",x.messageTimer=0,gs.visible=!1,bn.visible=!0,di&&(di.visible=!1),document.body.classList.add("roam-mode"),window.__freeCam=!1,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",la();const t=Math.sin(x.roamYaw),n=-Math.cos(x.roamYaw);tt.position.set(x.roamPos.x-t*18,x.roamPos.y+8.5,x.roamPos.z-n*18),ld(),tt.lookAt(x.roamPos.x+t*12,x.roamPos.y+2.6,x.roamPos.z+n*12),tt.fov=70,tt.updateProjectionMatrix()}function la(){bn.position.set(x.roamPos.x,x.roamPos.y+.3,x.roamPos.z),bn.quaternion.setFromAxisAngle(en,-x.roamYaw)}function l_(i,e){let t=null;for(const s of oa)for(const r of s.segments){const a=i-r.a.x,o=e-r.a.z,c=Oe.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,e-d);if(u>s.halfW+zn*1.15)continue;const f=Oe.lerp(r.a.y,r.b.y,c),m=Oe.lerp(r.u0,r.u1,c),g=u+Math.max(0,je(i,e)-f)*.2;(!t||g<t.score)&&(t={kind:"ramp",y:f,u:m,ramp:s,mergeS:s.mergeS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*he.width*.34,score:g})}if(!t)return null;const n=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=n,t.tangentZ/=n,t}function h_(i,e,t=je(i,e)){let n=null;const s=10;for(let a=0;a<he.length;a+=s){if(Ti(a+s*.5))continue;const o=ft(a),c=ft(a+s),l=c.p.x-o.p.x,d=c.p.z-o.p.z,u=Math.max(1e-4,l*l+d*d),f=Oe.clamp(((i-o.p.x)*l+(e-o.p.z)*d)/u,0,1),m=o.p.x+l*f,g=o.p.z+d*f,v=i-m,p=e-g,h=Math.hypot(v,p);if(h>he.width*.5+zn*.45)continue;const _=Oe.lerp(o.p.y,c.p.y,f)+.58;if(t<_-5)continue;const y=new D(d,0,-l).normalize(),S=Oe.clamp(v*y.x+p*y.z,-he.width*.44,he.width*.44);(!n||h<n.dist)&&(n={kind:"track",y:_,s:a+s*f,lateral:S,tangentX:l,tangentZ:d,dist:h})}if(!n)return null;const r=Math.max(1e-4,Math.hypot(n.tangentX,n.tangentZ));return n.tangentX/=r,n.tangentZ/=r,n}function zi(i,e,t=x.roamPos.y){const n=je(i,e);let s={kind:"ground",y:n};const r=l_(i,e);r&&r.y>=n-1.2&&(s=r);const a=h_(i,e,Math.max(t,s.y));return a&&a.y>=s.y-.8&&(s=a),s}function Kl(i){const e=Math.sin(x.roamYaw)*i.tangentX+-Math.cos(x.roamYaw)*i.tangentZ;if(x.speed<10||e<.22)return!1;const t=(i.mergeS??i.s??22)+8,n=ft(t);return x.mode="race",x.practice=!0,x.freeRun=!0,x.breakdownTimer=0,x.s=n.s,x.totalDistance=n.s,x.lastSafeS=n.s,x.lastSafeDistance=n.s,x.lateral=Oe.clamp(i.lateral??0,-he.width*.32,he.width*.32),x.lateralVel=-Math.sign(x.lateral)*Math.min(4,Math.abs(x.speed)*.04),x.speed=Oe.clamp(Math.max(28,x.speed),18,112),x.grounded=!0,x.y=n.p.y+2.1,x.yVel=0,x.airtime=0,x.rivalS=-900,x.rivalDistance=-900,x.leadState="SOLO",x.message="Merged onto the ribbon",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.35),gs.visible=!1,bn.visible=!1,di&&(di.visible=!0),document.body.classList.remove("roam-mode"),Xe.position.textContent="FREE RUN",Xe.trackName.textContent=he.name,la(),!0}function ad(i){const e=Math.max(ct.has("KeyW")||ct.has("ArrowUp")?1:0,Ce.throttle),t=Math.max(ct.has("KeyS")||ct.has("ArrowDown")?1:0,Ce.brake),s=Oe.clamp((ct.has("KeyD")||ct.has("ArrowRight")?1:0)-(ct.has("KeyA")||ct.has("ArrowLeft")?1:0)+Ce.steer,-1,1)*Kh,r=(ct.has("ShiftLeft")||ct.has("ShiftRight"))&&x.boost>.02&&e>.03;if(e>.03){const p=x.speed<0?38:0;x.speed+=((r?52:30)+p)*e*i}t>.03&&(x.speed-=(x.speed>1.2?64:30)*t*i),x.speed-=.0026*x.speed*Math.abs(x.speed)*i,Math.abs(x.speed)>.08?x.speed-=Math.sign(x.speed)*4.2*i:e<=.03&&t<=.03&&(x.speed=0),x.speed=Oe.clamp(x.speed,-22,120),x.boosting=r,r?x.boost=Math.max(0,x.boost-i*.22):x.boost=Math.min(1,x.boost+i*.05),x.wheelSteer+=(s-x.wheelSteer)*(1-Math.pow(1e-5,i));const a=-x.wheelSteer*.55,o=bn.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const c=Math.abs(x.speed);if(c>Ho){const p=Oe.clamp((c-Ho)/5,0,1),h=1-.45*Oe.clamp((c-28)/70,0,1),_=Cg*p*h;x.roamYaw+=x.wheelSteer*_*i*Math.sign(x.speed)}const l=Math.sin(x.roamYaw),d=-Math.cos(x.roamYaw),u=Math.abs(x.speed)*i,f=Math.max(1,Math.ceil(u/1.2));let m=!1,g=!1,v=zi(x.roamPos.x,x.roamPos.z,x.roamPos.y);for(let p=0;p<f;p++)x.roamPos.x+=l*x.speed*i/f,x.roamPos.z+=d*x.speed*i/f,v=zi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=v.y+ci,p_(x.roamPos,v)&&(g=!0),m_(x.roamPos,v)&&(m=!0),v=zi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=v.y+ci;x.roamPos.x=Oe.clamp(x.roamPos.x,-820,820),x.roamPos.z=Oe.clamp(x.roamPos.z,-1620,480),m&&(x.speed*=.35),g&&(x.speed*=.62,x.cameraShake=Math.max(x.cameraShake,.22),x.message="SPLAT!",x.messageTimer=.9),v=zi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=v.y+ci,!(v.kind==="ramp"&&v.u>.72&&Kl(v))&&(v.kind==="track"&&Kl(v)||(la(),ct.has("KeyR")&&(rd(),ct.delete("KeyR"))))}const zn=2.6;function qa(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.maxY!=null&&i.y>s.maxY+ci+.45)continue;if(s.radius){const u=s.radius+zn,f=i.x-s.x,m=i.z-s.z,g=f*f+m*m;if(g>=u*u)continue;t=!0;const v=Math.max(1e-4,Math.sqrt(g));i.x=s.x+f/v*u,i.z=s.z+m/v*u;continue}const r=s.hw+zn,a=s.hd+zn,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return t}function od(i,e=x.roamPos){if(!i)return;const t=(i.crashTimer||0)<=.05;i.crashTimer=Math.max(i.crashTimer||0,1.15+Math.random()*.45),i.waitTimer=Math.max(i.waitTimer||0,.55),i.brakePulse=1;const n=i.maxAvoidOffset||Mi.streetW*.3,s=i.mesh?.position?.x??i.collider?.x??i.road,r=i.mesh?.position?.z??i.collider?.z??i.along,a=i.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;i.avoidOffset=Oe.clamp((i.avoidOffset||0)+a*n*.9,-n,n),t&&(St.trafficCrashes++,i.along-=i.dir*1.8,i.mesh&&(i.mesh.rotation.y+=a*.08),x.mode==="roam"&&(x.cameraShake=Math.max(x.cameraShake,.32),x.message="TRAFFIC CRASH",x.messageTimer=.85))}function d_(i){let e=!1;for(let t=0;t<bi.length;t++){const n=bi[t];if(n.maxY!=null&&i.y>n.maxY+ci+.45)continue;const s=n.hw+zn,r=n.hd+zn,a=i.x-n.x,o=i.z-n.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,od(n.actor,i);const c=s-Math.abs(a),l=r-Math.abs(o);c<l?i.x=n.x+(a<0?-s:s):i.z=n.z+(o<0?-r:r)}return e}function u_(i,e,t=0){return e.maxY!=null&&i.y>e.maxY+ci+.45?!1:e.radius?Math.hypot(i.x-e.x,i.z-e.z)<e.radius+t:Math.abs(i.x-e.x)<e.hw+t&&Math.abs(i.z-e.z)<e.hd+t}function f_(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,St.splats++;const e=xs.find(t=>!t.visible)||xs[St.splats%Math.max(1,xs.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(i.x,je(i.x,i.z)+.08,i.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function p_(i,e=null){if(e?.kind!=="ground"||Math.abs(x.speed)<5)return!1;let t=!1;for(const n of lr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=zn+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(je(n.x,n.z)+ci))>3.2||(f_(n),t=!0)}return t}function m_(i,e=null){let t=!1;for(let n=0;n<2;n++){const s=qa(i,Wn),r=e?.kind==="ground"?qa(i,Xn):!1,a=qa(i,Ks),o=e?.kind==="ground"?d_(i):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function cd(i){const e=Ce.lookX*1.18,t=Ce.lookY*.58;x.camLookYaw+=(e-x.camLookYaw)*(1-Math.pow(.002,i)),x.camLookPitch+=(t-x.camLookPitch)*(1-Math.pow(.002,i)),x.cameraZoom+=(Ce.zoom-x.cameraZoom)*(1-Math.pow(.018,i))}function Tc(i,e,t=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=Oe.lerp(i.x,e.x,r),o=Oe.lerp(i.z,e.z,r),c=Oe.lerp(i.y,e.y,r),l=je(a,o)+t;l>c&&(n=Math.max(n,(l-c)/Math.max(.08,r)))}return n}function ld(){const i=x.camYaw+x.camLookYaw,e=Math.sin(i),t=-Math.cos(i),n=Oe.clamp(x.cameraZoom,-.42,.9),s=x.roamPos,r={x:s.x+e*(12-Math.min(n,0)*6),y:s.y+2.6+x.camLookPitch*13.5,z:s.z+t*(12-Math.min(n,0)*6)};tt.position.y+=Tc(r,tt.position,3.4)}function hd(i){if(window.__freeCam)return;if(cd(i),Math.abs(x.speed)>Ho){let u=x.roamYaw-x.camYaw;u=Math.atan2(Math.sin(u),Math.cos(u)),x.camYaw+=u*(1-Math.pow(.08,i))}const e=x.camYaw+x.camLookYaw,t=Math.sin(e),n=-Math.cos(e),s=x.roamPos,r=Oe.clamp(x.cameraZoom,-.42,.9),a=(18+Math.abs(x.speed)*.08)*(1+r*.72),o=8.5+Math.max(0,r)*4.4-Math.min(0,r)*2+x.camLookPitch*5.8,c=$h.set(s.x-t*a,s.y+o,s.z-n*a),l=Sc.set(s.x+t*(12-Math.min(r,0)*6),s.y+2.6+x.camLookPitch*13.5,s.z+n*(12-Math.min(r,0)*6));c.y=Math.max(c.y,je(c.x,c.z)+3.5),c.y+=Tc(l,c,3.4),tt.position.lerp(c,1-Math.pow(.0023,i)),Dn.position.copy(tt.position),Dn.lookAt(l),Dn.rotateY(Math.PI),tt.quaternion.slerp(Dn.quaternion,1-Math.pow(.05,i));const d=70+Math.min(8,Math.abs(x.speed)*.05)+r*10;Math.abs(tt.fov-d)>.02&&(tt.fov+=(d-tt.fov)*(1-Math.pow(.01,i)),tt.updateProjectionMatrix())}function dd(i){if(x.mode==="result")return;x.mode="result";const e=Math.max(0,Math.round(x.score-x.damage*9+Math.max(0,220-x.time)*45));e>x.best&&(x.best=e,localStorage.setItem("steel-ribbon-best",String(e))),Xe.best.textContent=`Best score ${x.best}`,Xe.resultText.textContent=`${i} Score ${e}. Time ${qo(x.time)}. Damage ${Math.round(x.damage)}%.`;const t=Number.isFinite(x.bestLap)?qo(x.bestLap):"--:--.-";Xe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${x.cleanLandings}</b>
    <b>Hard landings: ${x.hardLandings}</b>
    <b>Recoveries: ${x.recoveries}</b>
    <b>Near edges: ${Math.round(x.nearMisses)}</b>
  `,Xe.result.classList.remove("hidden")}function Jl(i="Craned back to the ribbon"){const e=ft(x.lastSafeS);x.s=x.lastSafeS,x.totalDistance=x.lastSafeDistance,x.lateral=0,x.lateralVel=0,x.y=e.p.y+2.1,x.yVel=0,x.speed=Math.max(16,x.speed*.32),x.grounded=!0,x.cameraShake=1.2,x.message=i,x.messageTimer=1.4,x.recoveries+=1}function Ec(i,e){return Oe.clamp(e*i.tangent.y,-48,48)}function x_(i=94){return he.gaps.map(e=>{const t=ft(e.start),n=ft(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=Ec(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Oe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function jl(i,e){x.grounded=!1,x.yVel=Ec(i,x.speed),x.airtime=0,e&&(x.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return Ec(ft(i),e)},gapJumpReport(i){return x_(i)},sceneryClearanceReport(){return kg()},setSpeed(i){return x.speed=Oe.clamp(i,-14,156-x.damage*.42),Js(),x.speed},setTrackPosition(i,e=x.speed){const t=ft(i);return x.totalDistance=i,x.s=t.s,x.lastSafeS=t.s,x.lastSafeDistance=i,x.lateral=0,x.lateralVel=0,x.y=t.p.y+2.1,x.yVel=0,x.grounded=!0,x.speed=Oe.clamp(e,-14,156-x.damage*.42),Js(),{s:x.s,totalDistance:x.totalDistance,speed:x.speed,y:x.y}},setDamage(i){return x.damage=Oe.clamp(i,0,99),Js(),x.damage},setCourse(i){return wc(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,tt.position.set(i,e,t),tt.lookAt(n,s,r),tt.fov=62,tt.updateProjectionMatrix(),"freecam"},listCourses(){return Wi.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:Yr,name:he.name,length:he.length,width:he.width,laps:he.laps}},probeDown(i,e){const n=new Pf(new D(i,400,e),new D(0,-1,0),0,1e3).intersectObjects(Je.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=zi(i,e,400);return{x:i,z:e,ground:+je(i,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return oa.map((i,e)=>{const t=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,mergeS:i.mergeS,halfW:i.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return Wn.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Xn.filter(e=>e.hw).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const i=Xn.filter(e=>e.hw);return{supports:Xo,pylonColliders:i.length,gaps:he.gaps.length,sample:i.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const e=[];for(const t of Wn){const n=Hs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return e.sort((t,n)=>n.verticalIntrusion-t.verticalIntrusion),{totalBuildings:Wn.length,conflicts:e.length,sample:e.slice(0,i)}},rockColliderSample(i=8){return Ks.concat(Xn.filter(e=>e.kind==="rock")).slice(0,i).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:St.traffic,pedestrians:St.pedestrians,pedestriansActive:lr.filter(e=>e.active).length,turns:St.turns,splats:St.splats,trafficCrashes:St.trafficCrashes,streetLights:St.streetLights,trafficLights:St.trafficLights,stopSigns:St.stopSigns,types:{...St.types},offRoadTraffic:bi.filter(e=>!aa(e.x,e.z,2)).length,trafficRoutes:Yo.slice(0,i).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:bi.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:lr.filter(e=>e.active).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},vehicleDetailReport(){return{player:{...bn.userData.detailReport},racer:{...gs.userData.detailReport},namedParts:bn.children.filter(i=>i.name).map(i=>i.name).slice(0,24)}},advanceCityLife(i=1){const e=.03333333333333333;let t=Math.max(0,Math.min(i,60));for(;t>0;){const n=Math.min(e,t);ed(n),t-=n}return this.cityLifeReport(12)},setRoamPose(i,e,t){const n=zi(i,e,x.roamPos.y);x.roamPos.set(i,n.y+ci,e),x.roamYaw=t,x.camYaw=t,x.camLookYaw=0,x.camLookPitch=0,x.wheelSteer=0,x.speed=0,la();const s=Math.sin(x.roamYaw),r=-Math.cos(x.roamYaw);return tt.position.set(x.roamPos.x-s*18,x.roamPos.y+8.5,x.roamPos.z-r*18),ld(),tt.lookAt(x.roamPos.x+s*12,x.roamPos.y+2.6,x.roamPos.z+r*12),tt.fov=70,tt.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,e=0,t=Ce.zoom,n=30){Ce.lookX=Oe.clamp(i,-1,1),Ce.lookY=Oe.clamp(e,-1,1),Ce.zoom=Oe.clamp(t,-.42,.9);for(let s=0;s<n;s++)x.mode==="roam"?hd(1/60):Ac(1/60);return this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(x.mode!=="roam")return this.roamReport();const s={steer:Ce.steer,throttle:Ce.throttle,brake:Ce.brake};Ce.steer=Oe.clamp(e,-1,1),Ce.throttle=Oe.clamp(t,0,1),Ce.brake=Oe.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(ad(o),x.mode!=="roam")break;a-=o}return Ce.steer=s.steer,Ce.throttle=s.throttle,Ce.brake=s.brake,this.roamReport()},roamReport(){const i=x.roamPos,e=$h.set(0,0,-1).applyQuaternion(bn.quaternion).normalize(),t=Sc.set(Math.sin(x.roamYaw),0,-Math.cos(x.roamYaw)).normalize(),n=zi(i.x,i.z,i.y);return{mode:x.mode,s:+x.s.toFixed(2),totalDistance:+x.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+x.roamYaw.toFixed(3),camYaw:+x.camYaw.toFixed(3),speed:+x.speed.toFixed(2),groundXZ:+je(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+tt.position.x.toFixed(2),camY:+tt.position.y.toFixed(2),camZ:+tt.position.z.toFixed(2),fov:+tt.fov.toFixed(2),lookYaw:+x.camLookYaw.toFixed(3),lookPitch:+x.camLookPitch.toFixed(3),cameraZoom:+x.cameraZoom.toFixed(3),cameraSightLift:+Tc({x:i.x,y:i.y+2.6,z:i.z},{x:tt.position.x,y:tt.position.y,z:tt.position.z},2.4).toFixed(3),colliders:Wn.length+Xn.length+Ks.length+bi.length,insideBuilding:Wn.concat(Xn,Ks,bi).some(s=>u_(i,s)),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:bn.userData.frontWheels?+bn.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function g_(i){if(x.mode!=="race")return;x.time+=i,x.freeRun&&(x.damage=0);const e=x.breakdownTimer>0;e&&(x.breakdownTimer-=i,x.breakdownTimer<=0&&(x.damage=55,x.message="Patched up — back on it",x.messageTimer=1.2));const t=Math.max(ct.has("KeyW")||ct.has("ArrowUp")?1:0,Ce.throttle),n=Math.max(ct.has("KeyS")||ct.has("ArrowDown")?1:0,Ce.brake),r=Oe.clamp((ct.has("KeyD")||ct.has("ArrowRight")?1:0)-(ct.has("KeyA")||ct.has("ArrowLeft")?1:0)+Ce.steer,-1,1)*Kh,a=t>.03&&!e,o=(ct.has("ShiftLeft")||ct.has("ShiftRight"))&&x.boost>.02&&a&&x.grounded,c=ft(x.s),l=c.p.y+2.1,d=Math.abs(x.speed);if(a){const _=x.speed<0?40:0;x.speed+=((o?68:40)+_)*t*i}if(n>.03){const _=x.speed>1.2?70:26;x.speed-=_*n*i}const u=x.grounded?.0024:.0011;x.speed-=u*x.speed*d*i,d>.08?x.speed-=Math.sign(x.speed)*(x.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(x.speed=0),x.speed=Oe.clamp(x.speed,-16,156-x.damage*.8),e&&(x.speed=Math.min(x.speed,14)),x.boosting=o,o?(x.boost=Math.max(0,x.boost-i*.21),x.score+=28*i):x.boost=Math.min(1,x.boost+i*(x.grounded?.045:.018));const f=14+d*.12;x.lateralVel-=r*f*i,x.lateralVel-=x.lateralVel*(x.grounded?3.4:.7)*i,x.lateral+=x.lateralVel*i;const m=Ti(x.s),g=Math.abs(x.lateral)<he.width*.52,v=!m&&g;if(x.grounded&&(!v||Math.abs(x.lateral)>he.width*.5)&&jl(c,g?"":"Edge slip"),x.grounded){const _=Math.sin(x.time*18)*Math.min(.22,Math.abs(x.speed)/700);x.y=Oe.lerp(x.y,l+_,.5),x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.score+=Math.max(0,x.speed)*i*.34,Math.abs(x.lateral)>he.width*.42&&(x.damage+=i*(1.2+Math.abs(x.speed)*.035),x.cameraShake=Math.max(x.cameraShake,.24),x.nearMisses+=i*.8,Math.random()<i*5&&$l(c.p.clone().addScaledVector(c.side,Math.sign(x.lateral)*he.width*.55).addScaledVector(en,1.2),4))}else{x.yVel-=31*i,x.y+=x.yVel*i,x.airtime+=i,x.score+=i*11;const _=ft(x.s),y=_.p.y+2.1;if(!Ti(x.s)&&Math.abs(x.lateral)<he.width*.55&&x.y<=y&&x.yVel<0){const E=-x.yVel,w=Math.abs(x.lateral)<he.width*.34&&E<30;x.y=y,x.grounded=!0,x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(x.lateral)-he.width*.36)*1.8,x.score+=w?260+x.airtime*85:Math.max(30,120-E),x.cameraShake=Math.max(x.cameraShake,E/34),x.message=w?"Clean landing":"Hard landing",x.messageTimer=.9,w?x.cleanLandings+=1:x.hardLandings+=1,Zl(E),$l(_.p.clone().addScaledVector(_.side,x.lateral).addScaledVector(en,.7),w?7:24),x.airtime=0}x.y<-55&&(x.damage+=28,Jl("Track crew recovery"))}const p=x.totalDistance;x.totalDistance+=x.speed*i,x.s=(x.totalDistance%he.length+he.length)%he.length;const h=Math.floor(x.totalDistance/he.length)+1;if(h>x.lap){const _=x.time-x.lapStartTime;x.splitTimes.push(_),x.bestLap=Math.min(x.bestLap,_),x.lapStartTime=x.time,x.lap=h,x.score+=1200,x.message=x.practice?`Lap ${x.lap}`:x.lap<=he.laps?`Lap ${x.lap}`:"Season race complete",x.messageTimer=1.4,!x.practice&&x.lap>he.laps&&dd(x.totalDistance>=x.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const _ of he.gaps)Lg(p,x.totalDistance,_.start)&&(x.message=_.name,x.messageTimer=1.1,x.grounded&&jl(ft(_.start),_.name));x.damage=Oe.clamp(x.damage,0,100),!x.freeRun&&x.damage>=90&&x.breakdownTimer<=0&&(x.breakdownTimer=2.6,x.message="Chassis cracked — limping to repair",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.8),Zl(40),x.damage=90),ct.has("KeyR")&&(x.damage=Math.min(99,x.damage+8),Jl("Manual reset"),ct.delete("KeyR"))}function __(i){if(x.mode==="race"&&!x.practice){const r=x.totalDistance-x.rivalDistance,a=Oe.clamp(r*.06,-12,16),o=Math.sin(x.time*.6)*5;x.rivalSpeed=Oe.clamp(92+a+o,70,120),x.rivalDistance+=x.rivalSpeed*i,x.rivalDistance>=he.length*he.laps&&x.lap<=he.laps&&dd("Crowther reached the gantry first.")}x.rivalS=(x.rivalDistance%he.length+he.length)%he.length;const e=ft(x.rivalS),t=e.p.clone().addScaledVector(en,1.4).addScaledVector(e.side,Math.sin(x.rivalS*.02)*1.4);gs.position.copy(t);const n=new Mt().makeBasis(e.side,en,e.tangent);gs.quaternion.setFromRotationMatrix(n);const s=Math.abs(x.rivalDistance-x.totalDistance)<26;gs.visible=(x.mode==="race"||x.mode==="paused")&&!x.practice&&!s}function Ac(i){if(window.__freeCam)return;cd(i);const e=ft(x.s),t=e.side.clone().multiplyScalar(x.lateral),n=e.p.clone().add(t);n.y=x.y;const s=x.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),tt.position.copy(n);const r=Math.abs(x.speed),a=68+Math.min(10,r*.055)+(ct.has("ShiftLeft")||ct.has("ShiftRight")?3:0)+x.cameraZoom*12;Math.abs(tt.fov-a)>.02&&(tt.fov+=(a-tt.fov)*(1-Math.pow(.004,i)),tt.updateProjectionMatrix());const o=ft(x.s+34+x.speed*.16),c=o.p.clone().addScaledVector(o.side,x.lateral*.45);c.y+=1.7+x.camLookPitch*12+Math.sin(x.time*8)*Math.min(.2,r/680),Dn.position.copy(tt.position),Dn.lookAt(c),Dn.rotateY(Math.PI),Dn.rotateY(-x.camLookYaw),Dn.rotateZ(-e.bank*.72-x.lateralVel*.006),Dn.rotateX(e.grade*.18+(x.grounded?0:Oe.clamp(x.yVel,-30,30)*-.006)),tt.quaternion.slerp(Dn.quaternion,1-Math.pow(8e-4,i)),x.cameraShake=Math.max(0,x.cameraShake-i*1.9);const l=Sc.set(0,0,-1).applyQuaternion(tt.quaternion).normalize();window.__steelRibbonTelemetry={mode:x.mode,s:x.s,totalDistance:x.totalDistance,rivalDistance:x.rivalDistance,speed:x.speed,lap:x.lap,score:x.score,damage:x.damage,y:x.y,yVel:x.yVel,grounded:x.grounded,input:{steer:Ce.steer,throttle:Ce.throttle,brake:Ce.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const ki={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},ks=[28,54,82,110,134,156];function v_(){const i=Math.abs(x.speed);let e=1;for(let o=0;o<ks.length;o++)i>ks[o]&&(e=o+2);e=Math.min(e,ks.length);const t=e===1?0:ks[e-2],n=ks[e-1],s=n>t?Oe.clamp((i-t)/(n-t),0,1):0,r=e===1?ki.idle:ki.postShift;let a=r+s*(ki.shift-r);return i<.4&&(a=ki.idle),{gear:e,rpm:a}}let Ql=performance.now(),Za=0,$a=0;function ud(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function M_(i,e){const t=Xe.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=ud(t),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const v=g/l,p=o(v),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const _=c(p,a-a*.02),y=c(p,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(_[0],_[1]),n.lineTo(y[0],y[1]),n.stroke(),h){const S=c(p,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),S[0],S[1])}}const d=Oe.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),m=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(m[0],m[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function S_(i,e){const t=Xe.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=ud(t),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Oe.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let v=0;v<=l;v+=3){const p=v/l,h=o(p),_=v%6===0;n.strokeStyle=v>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=_?Math.max(1.3,a*.03):Math.max(1,a*.018);const y=c(h,a-a*.02),S=c(h,a-a*(_?.17:.1));if(n.beginPath(),n.moveTo(y[0],y[1]),n.lineTo(S[0],S[1]),n.stroke(),_){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(v),E[0],E[1])}}const f=o(d),m=c(f,a-a*.06),g=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function y_(i,e){const t=Xe.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=ki.max,u=y=>Math.PI-y*Math.PI,f=(y,S)=>[o+Math.cos(y)*S,c-Math.sin(y)*S];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const m=ki.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(m)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let y=0;y<=9;y++){const S=y/9,E=u(S),w=y*1e3>=ki.redline;n.strokeStyle=w?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const R=f(E,l-l*.02),P=f(E,l-l*.18);n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(P[0],P[1]),n.stroke();const b=f(E,l-l*.34);if(n.fillStyle=w?"#ff8077":"#cfeeff",n.fillText(String(y),b[0],b[1]),y<9){const M=u((y+.5)/9),A=f(M,l-l*.02),I=f(M,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(A[0],A[1]),n.lineTo(I[0],I[1]),n.stroke()}}const g=Oe.clamp(i/d,0,1),v=u(g),p=f(v,l-l*.06),h=f(v+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const _=x.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(_,o,c+l*.02)}function Js(){he.length*he.laps;const i=Vl(x.practice?x.totalDistance%he.length:x.totalDistance),e=x.practice?0:Vl(x.rivalDistance),t=x.practice?"SOLO":x.totalDistance>=x.rivalDistance?"P1":"P2";t!==x.leadState&&x.mode==="race"&&(x.leadState=t,x.practice||(x.message=t==="P1"?"You took the lead":"Crowther ahead",x.messageTimer=.95)),Xe.damage.style.width=`${Math.round(x.damage)}%`,Xe.lap.textContent=x.practice?`LAP ${x.lap}`:`${Math.min(x.lap,he.laps)}/${he.laps}`,Xe.timer.textContent=qo(x.time),Xe.score.textContent=`Score ${Math.round(x.score)}`;const n=x.mode==="roam",s=x.mode==="race"||x.mode==="paused"||n;Xe.position.textContent=n?"FREE ROAM":x.freeRun?"FREE RUN":x.practice?"PRACTICE":`${t} DIV 4`,Xe.hud.style.display=s?"flex":"none",Xe.raceStrip.style.display=x.mode==="race"||x.mode==="paused"?"grid":"none",Xe.touchControls.style.display=s?"":"none",Xe.playerProgress.style.width=`${Math.round(i*100)}%`,Xe.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=v_();x.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-Ql)/1e3);Ql=a;const c=1-Math.exp(-o*(r.rpm>x.tachRpm?10:6));x.tachRpm+=(r.rpm-x.tachRpm)*c,y_(x.tachRpm,r.gear);const l=Math.abs(x.speed)*2.25;Za+=(l-Za)*(1-Math.exp(-o*8)),$a+=(x.boost-$a)*(1-Math.exp(-o*9)),M_(Za,x.speed<-.5),S_($a,x.boosting),Xe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(x.speed)-44)/150)),Xe.damageFx.style.opacity=x.damage<18?0:Math.min(.72,(x.damage-18)/82),x.mode==="paused"?(Xe.centerMessage.textContent="Paused",Xe.centerMessage.classList.remove("hidden")):x.messageTimer>0?(Xe.centerMessage.textContent=x.message,Xe.centerMessage.classList.remove("hidden")):Xe.centerMessage.classList.add("hidden")}function qo(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function fd(){const i=Ag.getDelta(),e=Math.min(.033,i);x.messageTimer>0&&(x.messageTimer-=e),x.mode==="roam"?(ad(e),hd(e)):(g_(e),__(e),Ac(e)),o_(e),ed(e),Js(),c_(),Ws.uniforms.uTime.value+=e,Ws.uniforms.uSpeed.value=Math.min(1,Math.abs(x.speed)/150);const t=(ct.has("ShiftLeft")||ct.has("ShiftRight"))&&x.boost>.02&&x.mode==="race";Ws.uniforms.uBoost.value+=((t?1:0)-Ws.uniforms.uBoost.value)*Math.min(1,e*6),Rs.render(),requestAnimationFrame(fd)}window.addEventListener("keydown",i=>{ct.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&x.mode==="race"?(x.mode="paused",ct.clear(),ta()):i.code==="KeyP"&&x.mode==="paused"?x.mode="race":i.code==="Escape"&&(x.mode==="race"||x.mode==="paused"||x.mode==="roam")&&(x.mode="menu",ta(),bn.visible=!1,di&&(di.visible=!0),document.body.classList.remove("roam-mode"),Xe.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>ct.delete(i.code));window.addEventListener("resize",()=>{tt.aspect=window.innerWidth/window.innerHeight,tt.updateProjectionMatrix(),fn.setSize(window.innerWidth,window.innerHeight),Rs.setSize(window.innerWidth,window.innerHeight),id.setSize(window.innerWidth,window.innerHeight)});Xe.startBtn.addEventListener("click",()=>ca(!1));Xe.practiceBtn.addEventListener("click",()=>ca(!0));Xe.freeRunBtn.addEventListener("click",()=>ca(!0,!0));Xe.roamBtn.addEventListener("click",()=>rd());Xe.againBtn.addEventListener("click",()=>ca(!1));Xe.courseButtons.forEach(i=>{i.addEventListener("click",()=>wc(Number(i.dataset.course)))});function pd(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function ta(){Ce.steer=0,Ce.throttle=0,Ce.brake=0,Ce.lookX=0,Ce.lookY=0,Ce.zoom=0,Ce.lookPointer=null,Ce.drivePointer=null,Ce.pinchStartDistance=0,Ce.pinchStartZoom=0;for(const i of Xe.touchControls.querySelectorAll(".touch-stick"))pd(i)}function zr(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=Oe.clamp(e.clientX-(t.left+t.width/2),-n,n),r=Oe.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Ce.lookX=Oe.clamp(s/n,-1,1),Ce.lookY=Oe.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Ce.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Ce.lookY*n)}px`);else{const o=Oe.clamp(s/n,-1,1),c=Oe.clamp(-r/n,-1,1);Ce.steer=o,Ce.throttle=Math.max(0,c),Ce.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function eh(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function th(i,e){e==="look"?(Ce.lookX=0,Ce.lookY=0,Ce.lookPointer=null):(Ce.steer=0,Ce.throttle=0,Ce.brake=0,Ce.drivePointer=null),pd(i)}function b_(i,e){return Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY)}function md(i,e=!1){if(i.touches.length<2){Ce.pinchStartDistance=0;return}const t=b_(i.touches[0],i.touches[1]);if(e||!(Ce.pinchStartDistance>0)){Ce.pinchStartDistance=t,Ce.pinchStartZoom=Ce.zoom;return}const n=Math.max(.2,t/Ce.pinchStartDistance);Ce.zoom=Oe.clamp(Ce.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of Xe.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),ea(),x.mode==="paused"&&(x.mode="race"),e==="look"&&(Ce.lookPointer=s.pointerId),e==="drive"&&(Ce.drivePointer=s.pointerId),zr(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="look"?Ce.lookPointer:Ce.drivePointer)===s.pointerId&&(s.preventDefault(),zr(i,s))},{passive:!1});const t=s=>{(e==="look"?Ce.lookPointer:Ce.drivePointer)===s.pointerId&&th(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),ea(),x.mode==="paused"&&(x.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Ce.lookPointer=r.identifier),e==="drive"&&(Ce.drivePointer=r.identifier),zr(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="look"?Ce.lookPointer:Ce.drivePointer,a=eh(s,r);a&&(s.preventDefault(),zr(i,a))},{passive:!1});const n=s=>{const r=e==="look"?Ce.lookPointer:Ce.drivePointer;eh(s,r)&&(s.preventDefault(),th(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Xe.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),ea(),ct.add(e),i.setPointerCapture(n.pointerId)});const t=()=>ct.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}hr.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),md(i,!0))},{passive:!1});hr.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),md(i))},{passive:!1});hr.addEventListener("touchend",i=>{i.touches.length<2&&(Ce.pinchStartDistance=0)},{passive:!1});hr.addEventListener("touchcancel",()=>{Ce.pinchStartDistance=0},{passive:!1});const w_=ft(x.s);x.y=w_.p.y+2.1;x.lastSafeS=x.s;x.lastSafeDistance=x.totalDistance;Ac(.016);Js();fd();
